#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'manifest.json');
const strictMetadata = process.argv.includes('--strict-metadata');

const SYSTEM_DIRS = new Set([
  '.git',
  '.github',
  'docs',
  'scripts',
  'skills',
  '.public-materials-export'
]);

const ALLOWED_TYPE_DIRS = new Set([
  '复习讲义',
  '往年真题',
  '课件PPT',
  '课件资料',
  '课件资料包',
  '题库练习',
  '答案解析',
  '笔记总结',
  '待复核课件PPT',
  '待复核资料'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.ppt',
  '.pptx',
  '.docx',
  '.md',
  '.txt',
  '.zip'
]);

const FORBIDDEN_BASENAME_PATTERNS = [
  /副本/i,
  /final_final/i,
  /未命名/i,
  /新建文件/i,
  /^~\$/,
  /\.tmp$/i,
  /\.crdownload$/i,
  /\.download$/i
];

const OPTIONAL_METADATA_FIELDS = [
  'year',
  'college',
  'sourceType',
  'sourceNote',
  'reviewStatus',
  'containsPersonalInfo',
  'licenseStatus'
];

const errors = [];
const warnings = [];
const metadataGaps = new Map();

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function recordMetadataGap(field) {
  metadataGaps.set(field, (metadataGaps.get(field) || 0) + 1);
}

function sha256(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function isSafeRelativePath(value) {
  if (!value || typeof value !== 'string') return false;
  if (value.startsWith('/') || value.startsWith('\\')) return false;
  const normalized = path.posix.normalize(value);
  return normalized === value && !normalized.startsWith('../') && normalized !== '..';
}

function readManifest() {
  if (!existsSync(manifestPath)) {
    fail('manifest.json is missing.');
    return null;
  }

  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    fail(`manifest.json is not valid JSON: ${error.message}`);
    return null;
  }
}

function validateTopLevelFolders(manifest) {
  const subjectNames = new Set((manifest.subjects || []).map((subject) => subject.name));
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (SYSTEM_DIRS.has(entry.name)) continue;
    if (!subjectNames.has(entry.name)) {
      warn(`Top-level folder '${entry.name}' is not listed as a manifest subject.`);
    }
  }
}

function validateCourseFolders() {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || SYSTEM_DIRS.has(entry.name)) continue;
    const courseDir = path.join(root, entry.name);
    for (const child of readdirSync(courseDir, { withFileTypes: true })) {
      if (!child.isDirectory()) continue;
      if (!ALLOWED_TYPE_DIRS.has(child.name)) {
        fail(`Unsupported material type folder: ${entry.name}/${child.name}`);
      }
    }
  }
}

function validateAsset(subject, asset, seenPaths) {
  const label = `${subject.name || '<unknown subject>'} / ${asset.title || '<untitled>'}`;

  for (const field of ['subject', 'role', 'title', 'publicPath', 'bytes', 'sha256']) {
    if (!(field in asset)) fail(`${label}: missing required field '${field}'.`);
  }

  if (asset.subject !== subject.name) {
    fail(`${label}: asset.subject '${asset.subject}' does not match subject.name '${subject.name}'.`);
  }

  if (!ALLOWED_TYPE_DIRS.has(asset.role)) {
    fail(`${label}: unsupported role '${asset.role}'.`);
  }

  if (!isSafeRelativePath(asset.publicPath)) {
    fail(`${label}: unsafe publicPath '${asset.publicPath}'.`);
    return;
  }

  const parts = asset.publicPath.split('/');
  if (parts.length < 3) {
    fail(`${label}: publicPath must be '课程名/资料类型/文件名'.`);
  } else {
    const [courseName, roleDir] = parts;
    if (courseName !== subject.name) {
      fail(`${label}: publicPath course '${courseName}' does not match subject '${subject.name}'.`);
    }
    if (roleDir !== asset.role) {
      fail(`${label}: publicPath role folder '${roleDir}' does not match asset.role '${asset.role}'.`);
    }
  }

  const basename = path.posix.basename(asset.publicPath);
  const ext = path.posix.extname(basename).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    fail(`${label}: unsupported file extension '${ext}'.`);
  }

  if (/[,:?*<>|"\\]/.test(basename)) {
    fail(`${label}: filename contains forbidden characters: '${basename}'.`);
  }

  for (const pattern of FORBIDDEN_BASENAME_PATTERNS) {
    if (pattern.test(basename)) {
      fail(`${label}: filename looks temporary or unnormalized: '${basename}'.`);
      break;
    }
  }

  if (!basename.startsWith(`${subject.name}_`)) {
    warn(`${label}: filename does not start with '${subject.name}_'.`);
  }

  if (seenPaths.has(asset.publicPath)) {
    fail(`${label}: duplicate publicPath '${asset.publicPath}'.`);
  }
  seenPaths.add(asset.publicPath);

  const fullPath = path.join(root, ...asset.publicPath.split('/'));
  if (!existsSync(fullPath)) {
    fail(`${label}: file does not exist at '${asset.publicPath}'.`);
    return;
  }

  const stats = statSync(fullPath);
  if (!stats.isFile()) {
    fail(`${label}: publicPath is not a regular file.`);
    return;
  }

  if (asset.bytes !== stats.size) {
    fail(`${label}: bytes mismatch, manifest=${asset.bytes}, actual=${stats.size}.`);
  }

  const actualHash = sha256(fullPath);
  if (asset.sha256 !== actualHash) {
    fail(`${label}: sha256 mismatch, manifest=${asset.sha256}, actual=${actualHash}.`);
  }

  for (const field of OPTIONAL_METADATA_FIELDS) {
    if (!(field in asset)) recordMetadataGap(field);
  }

  if (strictMetadata) {
    const missingMetadata = OPTIONAL_METADATA_FIELDS.filter((field) => !(field in asset));
    if (missingMetadata.length > 0) {
      fail(`${label}: missing provenance metadata: ${missingMetadata.join(', ')}.`);
    }
  }

  if (asset.containsPersonalInfo === true) {
    fail(`${label}: containsPersonalInfo=true is not allowed in the public repository.`);
  }
}

function main() {
  const manifest = readManifest();
  if (!manifest) return;

  if (manifest.version !== 1) {
    fail(`Unsupported manifest version '${manifest.version}'. Expected version 1.`);
  }

  if (!Array.isArray(manifest.subjects)) {
    fail('manifest.subjects must be an array.');
    return;
  }

  validateTopLevelFolders(manifest);
  validateCourseFolders();

  const seenSubjects = new Set();
  const seenPaths = new Set();

  for (const subject of manifest.subjects) {
    if (!subject.name) {
      fail('A subject is missing name.');
      continue;
    }
    if (seenSubjects.has(subject.name)) {
      fail(`Duplicate subject '${subject.name}'.`);
    }
    seenSubjects.add(subject.name);

    if (!Array.isArray(subject.assets)) {
      fail(`Subject '${subject.name}' assets must be an array.`);
      continue;
    }

    for (const asset of subject.assets) {
      validateAsset(subject, asset, seenPaths);
    }
  }

  if (metadataGaps.size > 0 && !strictMetadata) {
    const summary = [...metadataGaps.entries()]
      .map(([field, count]) => `${field}: ${count}`)
      .join(', ');
    warn(`Optional provenance metadata is incomplete. Run with --strict-metadata after backfilling fields. Missing counts: ${summary}.`);
  }

  for (const warning of warnings) {
    console.warn(`warning: ${warning}`);
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`error: ${error}`);
    }
    console.error(`\nValidation failed with ${errors.length} error(s) and ${warnings.length} warning(s).`);
    process.exit(1);
  }

  console.log(`Material validation passed with ${warnings.length} warning(s).`);
}

main();
