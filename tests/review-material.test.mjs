import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const reviewScriptPath = path.resolve('scripts/review-material.mjs');

function sha256(contents) {
  return createHash('sha256').update(contents).digest('hex');
}

function createFixture(assetOverrides = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'henu-material-review-'));
  const contents = 'review fixture\n';
  const subject = assetOverrides.subject || '测试课程';
  const title = assetOverrides.title || `${subject}_待复核_数组总结.md`;
  const publicPath = assetOverrides.publicPath || `${subject}/待复核资料/${title}`;
  const fullPath = path.join(root, ...publicPath.split('/'));

  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, contents);
  writeFileSync(
    path.join(root, 'manifest.json'),
    `${JSON.stringify({
      version: 1,
      generatedAt: '2026-01-01T00:00:00.000Z',
      subjects: [
        {
          name: subject,
          assets: [
            {
              subject,
              role: '待复核资料',
              title,
              publicPath,
              bytes: Buffer.byteLength(contents),
              sha256: sha256(contents),
              sourceType: 'unknown-reviewing',
              sourceNote: '同学提供的待复核资料。',
              reviewStatus: 'needs_review',
              uncertainty: 'public_boundary_uncertain',
              containsPersonalInfo: false,
              licenseStatus: 'public-review-only',
              ...assetOverrides,
            },
          ],
        },
      ],
    }, null, 2)}\n`,
  );

  return { root, contents, publicPath };
}

function runReview(root, publicPath, targetRole, extraArgs = []) {
  return spawnSync(
    process.execPath,
    [
      reviewScriptPath,
      '--public-path', publicPath,
      '--target-role', targetRole,
      '--confirm-public',
      ...extraArgs,
    ],
    { cwd: root, encoding: 'utf8' },
  );
}

test('archives a reviewed note and derives its public metadata', () => {
  const fixture = createFixture();
  try {
    const result = runReview(fixture.root, fixture.publicPath, '笔记总结');
    assert.equal(result.status, 0, result.stderr);

    const manifest = JSON.parse(readFileSync(path.join(fixture.root, 'manifest.json'), 'utf8'));
    const asset = manifest.subjects[0].assets[0];
    const expectedTitle = '测试课程_笔记_数组总结.md';
    const expectedPath = `测试课程/笔记总结/${expectedTitle}`;

    assert.equal(asset.role, '笔记总结');
    assert.equal(asset.title, expectedTitle);
    assert.equal(asset.publicPath, expectedPath);
    assert.equal(asset.reviewStatus, 'basic-reviewed');
    assert.equal(asset.licenseStatus, 'learning-reference');
    assert.equal(asset.sourceType, 'other');
    assert.match(asset.sourceNote, /^复核前记录：/);
    assert.match(asset.sourceNote, /复核结论：/);
    assert.equal('uncertainty' in asset, false);
    assert.equal(existsSync(path.join(fixture.root, ...fixture.publicPath.split('/'))), false);
    assert.equal(readFileSync(path.join(fixture.root, ...expectedPath.split('/')), 'utf8'), fixture.contents);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('archives an authorized textbook as verified material', () => {
  const title = '测试课程_待复核_公开教材.pdf';
  const fixture = createFixture({ title });
  try {
    const result = runReview(
      fixture.root,
      fixture.publicPath,
      '电子版教材',
      ['--evidence', '权利人书面许可；证据见复核 PR。'],
    );
    assert.equal(result.status, 0, result.stderr);

    const manifest = JSON.parse(readFileSync(path.join(fixture.root, 'manifest.json'), 'utf8'));
    const asset = manifest.subjects[0].assets[0];
    const expectedTitle = '测试课程_教材_公开教材.pdf';

    assert.equal(asset.role, '电子版教材');
    assert.equal(asset.title, expectedTitle);
    assert.equal(asset.reviewStatus, 'verified');
    assert.equal(asset.licenseStatus, 'authorized-redistribution');
    assert.match(asset.sourceNote, /公开再分发授权/);
    assert.match(asset.sourceNote, /授权依据：权利人书面许可/);
    assert.equal(existsSync(path.join(fixture.root, '测试课程', '电子版教材', expectedTitle)), true);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('rejects textbook archival without public-redistribution evidence', () => {
  const title = '测试课程_待复核_无授权教材.pdf';
  const fixture = createFixture({ title });
  try {
    const result = runReview(fixture.root, fixture.publicPath, '电子版教材');

    assert.equal(result.status, 1);
    assert.match(result.stderr, /authorization evidence/);
    assert.equal(existsSync(path.join(fixture.root, ...fixture.publicPath.split('/'))), true);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('rejects material whose bytes no longer match the manifest', () => {
  const fixture = createFixture();
  try {
    writeFileSync(path.join(fixture.root, ...fixture.publicPath.split('/')), 'tampered fixture\n');
    const result = runReview(fixture.root, fixture.publicPath, '笔记总结');

    assert.equal(result.status, 1);
    assert.match(result.stderr, /bytes or sha256 do not match/);
    assert.equal(existsSync(path.join(fixture.root, ...fixture.publicPath.split('/'))), true);
    const manifest = JSON.parse(readFileSync(path.join(fixture.root, 'manifest.json'), 'utf8'));
    assert.equal(manifest.subjects[0].assets[0].role, '待复核资料');
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('rejects control characters in a workflow-supplied material path', () => {
  const title = '测试课程_待复核_恶意\n文件.md';
  const publicPath = `测试课程/待复核资料/${title}`;
  const fixture = createFixture({ title, publicPath });
  try {
    const result = runReview(fixture.root, publicPath, '笔记总结');

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Unsafe public path/);
    assert.equal(existsSync(path.join(fixture.root, ...publicPath.split('/'))), true);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('requires an explicit public-boundary confirmation', () => {
  const fixture = createFixture();
  try {
    const result = spawnSync(
      process.execPath,
      [reviewScriptPath, '--public-path', fixture.publicPath, '--target-role', '笔记总结'],
      { cwd: fixture.root, encoding: 'utf8' },
    );

    assert.equal(result.status, 1);
    assert.match(result.stderr, /--confirm-public/);
    assert.equal(existsSync(path.join(fixture.root, ...fixture.publicPath.split('/'))), true);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('does not overwrite an existing formal material', () => {
  const fixture = createFixture();
  const targetTitle = '测试课程_笔记_数组总结.md';
  const targetPath = path.join(fixture.root, '测试课程', '笔记总结', targetTitle);
  try {
    mkdirSync(path.dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, 'existing material\n');
    const result = runReview(fixture.root, fixture.publicPath, '笔记总结');

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Target file already exists/);
    assert.equal(readFileSync(targetPath, 'utf8'), 'existing material\n');
    assert.equal(existsSync(path.join(fixture.root, ...fixture.publicPath.split('/'))), true);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('rejects a symbolic-link material', () => {
  const fixture = createFixture();
  const sourcePath = path.join(fixture.root, ...fixture.publicPath.split('/'));
  try {
    const realFile = path.join(fixture.root, 'real-material.md');
    writeFileSync(realFile, fixture.contents);
    rmSync(sourcePath);
    symlinkSync(realFile, sourcePath);
    const result = runReview(fixture.root, fixture.publicPath, '笔记总结');

    assert.equal(result.status, 1);
    assert.match(result.stderr, /regular file, not a symbolic link/);
    assert.equal(existsSync(sourcePath), true);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('preserves a confirmed lossy-format note on formal material', () => {
  const fixture = createFixture({ uncertainty: 'format_lossy' });
  try {
    const result = runReview(fixture.root, fixture.publicPath, '复习讲义');
    assert.equal(result.status, 0, result.stderr);
    const manifest = JSON.parse(readFileSync(path.join(fixture.root, 'manifest.json'), 'utf8'));
    assert.equal(manifest.subjects[0].assets[0].uncertainty, 'format_lossy');
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('requires an existing source note before public archival', () => {
  const fixture = createFixture({ sourceNote: '' });
  try {
    const result = runReview(fixture.root, fixture.publicPath, '笔记总结');

    assert.equal(result.status, 1);
    assert.match(result.stderr, /sourceNote/);
    assert.equal(existsSync(path.join(fixture.root, ...fixture.publicPath.split('/'))), true);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('removes an existing material-type prefix when deriving the formal filename', () => {
  const title = '测试课程_待复核_课件_第1章.pdf';
  const fixture = createFixture({ title, sourceType: 'unknown_reviewing' });
  try {
    const result = runReview(fixture.root, fixture.publicPath, '课件');
    assert.equal(result.status, 0, result.stderr);
    const manifest = JSON.parse(readFileSync(path.join(fixture.root, 'manifest.json'), 'utf8'));
    const asset = manifest.subjects[0].assets[0];

    assert.equal(asset.title, '测试课程_课件_第1章.pdf');
    assert.equal(asset.sourceType, 'other');
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});
