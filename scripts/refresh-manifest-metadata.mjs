#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'manifest.json');
const write = process.argv.includes('--write');
const check = process.argv.includes('--check');

function sha256(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function fail(message) {
  console.error(`error: ${message}`);
  process.exitCode = 1;
}

function refreshManifest(manifest) {
  let changed = 0;
  const updates = [];

  for (const subject of manifest.subjects || []) {
    for (const asset of subject.assets || []) {
      if (!asset.publicPath) continue;
      const fullPath = path.join(root, ...asset.publicPath.split('/'));
      if (!existsSync(fullPath)) {
        fail(`${asset.publicPath}: file does not exist`);
        continue;
      }

      const bytes = readFileSync(fullPath).byteLength;
      const hash = sha256(fullPath);
      const beforeBytes = asset.bytes;
      const beforeHash = asset.sha256;

      if (beforeBytes !== bytes || beforeHash !== hash) {
        updates.push({
          publicPath: asset.publicPath,
          beforeBytes,
          afterBytes: bytes,
          beforeHash,
          afterHash: hash,
        });
        asset.bytes = bytes;
        asset.sha256 = hash;
        changed += 1;
      }
    }
  }

  return { changed, updates };
}

if (!existsSync(manifestPath)) {
  fail('manifest.json is missing');
  process.exit();
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch (error) {
  fail(`manifest.json is not valid JSON: ${error.message}`);
  process.exit();
}

const result = refreshManifest(manifest);

for (const update of result.updates) {
  console.log(
    `${update.publicPath}: bytes ${update.beforeBytes} -> ${update.afterBytes}; ` +
      `sha256 ${update.beforeHash} -> ${update.afterHash}`,
  );
}

if (result.changed === 0) {
  console.log('manifest metadata is already current.');
  process.exit();
}

if (check) {
  fail(`manifest metadata is stale for ${result.changed} asset(s); run node scripts/refresh-manifest-metadata.mjs --write`);
  process.exit();
}

if (!write) {
  console.log(`dry-run: would refresh ${result.changed} asset(s); pass --write to update manifest.json`);
  process.exit();
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`updated manifest metadata for ${result.changed} asset(s).`);
