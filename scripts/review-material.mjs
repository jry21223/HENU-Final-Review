#!/usr/bin/env node
import { createHash } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const TARGET_ROLES = new Map([
  ['复习讲义', '复习讲义'],
  ['往年真题', '真题'],
  ['课件', '课件'],
  ['题库练习', '题库练习'],
  ['答案解析', '答案解析'],
  ['笔记总结', '笔记'],
  ['电子版教材', '教材'],
]);

const DETAIL_PREFIXES = [
  '复习讲义_',
  '讲义_',
  '真题_',
  '样卷_',
  '课件_',
  '题库练习_',
  '题库_',
  '答案解析_',
  '笔记总结_',
  '笔记_',
  '电子版教材_',
  '教材_',
];

function usage() {
  return 'Usage: node scripts/review-material.mjs --public-path <path> --target-role <role> [--evidence <public note>] --confirm-public';
}

function abort(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--confirm-public') {
      if (values.confirmPublic) abort("Duplicate argument '--confirm-public'.");
      values.confirmPublic = true;
      continue;
    }
    if (argument !== '--public-path' && argument !== '--target-role' && argument !== '--evidence') {
      abort(`Unknown argument '${argument}'. ${usage()}`);
    }
    if (argument in values) abort(`Duplicate argument '${argument}'.`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) abort(`Missing value for '${argument}'.`);
    values[argument] = value;
    index += 1;
  }

  const publicPath = values['--public-path'];
  const targetRole = values['--target-role'];
  if (!publicPath || !targetRole || !values.confirmPublic) abort(usage());
  return { publicPath, targetRole, evidence: values['--evidence'] };
}

function isSafePublicPath(value) {
  if (
    typeof value !== 'string'
    || value.length === 0
    || value.includes('\\')
    || /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return false;
  }
  if (value.startsWith('/') || value.startsWith('\\')) return false;
  const normalized = path.posix.normalize(value);
  return normalized === value && normalized !== '..' && !normalized.startsWith('../');
}

function isInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function verifiedDirectory(root, relativePath) {
  const fullPath = path.join(root, ...relativePath.split('/'));
  if (!existsSync(fullPath)) mkdirSync(fullPath, { recursive: true });
  if (lstatSync(fullPath).isSymbolicLink() || !lstatSync(fullPath).isDirectory()) {
    abort(`Target directory is not a regular directory: '${relativePath}'.`);
  }
  const realPath = realpathSync(fullPath);
  if (!isInside(root, realPath)) abort(`Target directory resolves outside the repository: '${relativePath}'.`);
  return fullPath;
}

function validatedEvidence(value, targetRole) {
  if (value === undefined && targetRole !== '电子版教材') return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    abort('Electronic textbook archival requires public authorization evidence.');
  }
  const normalized = value.trim();
  if (normalized.length > 1000 || /[\u0000-\u001f\u007f]/.test(normalized)) {
    abort('Review evidence must be 1-1000 characters without control characters.');
  }
  return normalized;
}

function appendReviewNote(sourceNote, targetRole, evidence) {
  const confirmation = targetRole === '电子版教材'
    ? '资料维护者已人工复核课程归属、来源、隐私风险与公开再分发授权。'
    : '资料维护者已人工复核课程归属、来源、隐私风险与公开边界。';
  const current = typeof sourceNote === 'string' ? sourceNote.trim() : '';
  const evidenceText = evidence
    ? ` ${targetRole === '电子版教材' ? '授权依据' : '复核依据'}：${evidence}`
    : '';
  return `复核前记录：${current} 复核结论：${confirmation}${evidenceText}`;
}

function normalizedDetails(value) {
  const prefix = DETAIL_PREFIXES.find((candidate) => value.startsWith(candidate));
  const normalized = prefix ? value.slice(prefix.length) : value;
  if (!normalized) abort('Source filename is missing material details.');
  return normalized;
}

function buildTransition(manifest, requestedPath, targetRole, evidenceInput) {
  if (!isSafePublicPath(requestedPath)) abort(`Unsafe public path '${requestedPath}'.`);
  const filenameToken = TARGET_ROLES.get(targetRole);
  if (!filenameToken) abort(`Unsupported target role '${targetRole}'.`);
  const evidence = validatedEvidence(evidenceInput, targetRole);
  if (!Array.isArray(manifest.subjects)) abort('manifest.subjects must be an array.');

  const matches = [];
  for (const subject of manifest.subjects) {
    if (!Array.isArray(subject.assets)) continue;
    for (const asset of subject.assets) {
      if (asset.publicPath === requestedPath) matches.push({ subject, asset });
    }
  }
  if (matches.length !== 1) abort(`Expected exactly one manifest asset at '${requestedPath}', found ${matches.length}.`);

  const { subject, asset } = matches[0];
  if (asset.subject !== subject.name) abort('Asset subject does not match its manifest subject.');
  if (asset.role !== '待复核资料' || asset.reviewStatus !== 'needs_review') {
    abort('Only canonical needs_review material can be archived.');
  }
  if (asset.containsPersonalInfo !== false) {
    abort('Material must explicitly declare containsPersonalInfo=false before archival.');
  }
  if (typeof asset.sourceNote !== 'string' || asset.sourceNote.trim() === '') {
    abort('Material must include a non-empty sourceNote before archival.');
  }
  if (asset.title !== path.posix.basename(requestedPath)) abort('Asset title must match the source filename.');

  const sourcePrefix = `${subject.name}_待复核_`;
  if (!asset.title.startsWith(sourcePrefix) || asset.title.length === sourcePrefix.length) {
    abort(`Source filename must start with '${sourcePrefix}'.`);
  }
  const details = normalizedDetails(asset.title.slice(sourcePrefix.length));
  const targetTitle = `${subject.name}_${filenameToken}_${details}`;
  const targetPath = `${subject.name}/${targetRole}/${targetTitle}`;
  const duplicate = manifest.subjects
    .flatMap((entry) => Array.isArray(entry.assets) ? entry.assets : [])
    .some((entry) => entry !== asset && entry.publicPath === targetPath);
  if (duplicate) abort(`Manifest already contains target path '${targetPath}'.`);

  asset.role = targetRole;
  asset.title = targetTitle;
  asset.publicPath = targetPath;
  asset.reviewStatus = targetRole === '电子版教材' ? 'verified' : 'basic-reviewed';
  asset.licenseStatus = targetRole === '电子版教材'
    ? 'authorized-redistribution'
    : 'learning-reference';
  asset.sourceNote = appendReviewNote(asset.sourceNote, targetRole, evidence);
  if (asset.sourceType === 'unknown-reviewing' || asset.sourceType === 'unknown_reviewing') {
    asset.sourceType = 'other';
  }
  if (asset.uncertainty !== 'format_lossy') delete asset.uncertainty;
  manifest.generatedAt = new Date().toISOString();

  return { asset, targetPath };
}

function main() {
  const { publicPath, targetRole, evidence } = parseArgs(process.argv.slice(2));
  const root = realpathSync(process.cwd());
  const manifestPath = path.join(root, 'manifest.json');
  if (!existsSync(manifestPath)) abort('manifest.json is missing.');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const { asset, targetPath } = buildTransition(manifest, publicPath, targetRole, evidence);

  const sourceFullPath = path.join(root, ...publicPath.split('/'));
  if (!existsSync(sourceFullPath)) abort(`Material file is missing at '${publicPath}'.`);
  const sourceStats = lstatSync(sourceFullPath);
  if (sourceStats.isSymbolicLink() || !sourceStats.isFile()) abort('Material must be a regular file, not a symbolic link.');
  const realSource = realpathSync(sourceFullPath);
  if (!isInside(root, realSource)) abort('Material resolves outside the repository.');
  const actualHash = createHash('sha256').update(readFileSync(sourceFullPath)).digest('hex');
  if (sourceStats.size !== asset.bytes || actualHash !== asset.sha256) {
    abort('Material bytes or sha256 do not match the manifest.');
  }

  const targetDirectory = verifiedDirectory(root, `${asset.subject}/${targetRole}`);
  const targetFullPath = path.join(targetDirectory, path.posix.basename(targetPath));
  if (existsSync(targetFullPath)) abort(`Target file already exists at '${targetPath}'.`);

  const temporaryManifest = path.join(root, `.manifest.review-${process.pid}-${Date.now()}.tmp`);
  writeFileSync(temporaryManifest, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
  let materialMoved = false;
  try {
    renameSync(sourceFullPath, targetFullPath);
    materialMoved = true;
    renameSync(temporaryManifest, manifestPath);
  } catch (error) {
    if (materialMoved && existsSync(targetFullPath) && !existsSync(sourceFullPath)) {
      renameSync(targetFullPath, sourceFullPath);
    }
    rmSync(temporaryManifest, { force: true });
    throw error;
  }

  console.log(JSON.stringify({
    publicPath,
    targetPath,
    reviewStatus: asset.reviewStatus,
    licenseStatus: asset.licenseStatus,
  }));
}

try {
  main();
} catch (error) {
  console.error(`review-material: ${error.message}`);
  process.exitCode = 1;
}
