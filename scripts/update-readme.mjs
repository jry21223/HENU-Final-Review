#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const readmePath = path.join(root, 'README.md');
const manifestPath = path.join(root, 'manifest.json');
const checkOnly = process.argv.includes('--check');

const START = '<!-- MATERIALS:START -->';
const END = '<!-- MATERIALS:END -->';

function encodePath(value) {
  return value
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function groupAssetsByRole(assets) {
  const grouped = new Map();
  for (const asset of assets) {
    const list = grouped.get(asset.role) || [];
    list.push(asset);
    grouped.set(asset.role, list);
  }
  return grouped;
}

function chooseDisplayAsset(assets) {
  if (assets.length === 1) return assets[0];
  const preferred = assets.find((asset) => /讲义|真题|答案|解析/.test(asset.title));
  return preferred || assets[0];
}

function renderCatalog(manifest) {
  const lines = [];
  lines.push('## 科目目录');
  lines.push('');
  lines.push('> 此区块由 `manifest.json` 自动生成。请不要手动编辑；运行 `node scripts/update-readme.mjs` 更新。');
  lines.push('');

  for (const subject of manifest.subjects || []) {
    lines.push(`### ${subject.name}`);
    lines.push('');
    if (subject.note) {
      lines.push(subject.note);
      lines.push('');
    }

    const grouped = groupAssetsByRole(subject.assets || []);
    for (const [role, assets] of grouped.entries()) {
      const selected = chooseDisplayAsset(assets);
      if (assets.length === 1) {
        lines.push(`- ${role}: [${selected.title}](${encodePath(selected.publicPath)})`);
      } else {
        const roleDir = `${subject.name}/${role}/`;
        lines.push(`- ${role}: ${assets.length} 个文件，见 [${role}/](${encodePath(roleDir)})。`);
      }
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

function replaceManagedSection(readme, generated) {
  const startIndex = readme.indexOf(START);
  const endIndex = readme.indexOf(END);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`README.md must contain ${START} and ${END} markers.`);
  }

  const before = readme.slice(0, startIndex + START.length);
  const after = readme.slice(endIndex);
  return `${before}\n${generated}\n${after}`;
}

function main() {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const readme = readFileSync(readmePath, 'utf8');
  const generated = renderCatalog(manifest);
  const nextReadme = replaceManagedSection(readme, generated);

  if (checkOnly) {
    if (nextReadme !== readme) {
      console.error('README.md generated catalog is out of date. Run: node scripts/update-readme.mjs');
      console.error(`README path: ${pathToFileURL(readmePath).href}`);
      process.exit(1);
    }
    console.log('README generated catalog is up to date.');
    return;
  }

  writeFileSync(readmePath, nextReadme);
  console.log('README generated catalog updated.');
}

main();
