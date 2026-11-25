import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  appendManifestEntry,
  buildPrBody,
  LEGACY_ROLE_ALIASES,
  MAX_SUBMISSION_BYTES,
  NON_PUBLISHABLE_ROLES,
  normalizeApiBase,
  sanitizeErrorMessage,
  sha256Hex,
  signHmacRequest,
  validateNaming,
  validateSubmissionId,
  verifyDownloadedFile,
} from '../scripts/ingest-submission.mjs';

test('validateSubmissionId accepts canonical UUIDs and rejects non-UUIDs', () => {
  assert.equal(
    validateSubmissionId('550E8400-E29B-41D4-A716-446655440000'),
    '550e8400-e29b-41d4-a716-446655440000',
  );
  assert.throws(() => validateSubmissionId('not-a-uuid'));
  assert.throws(() => validateSubmissionId('../etc/passwd'));
});

test('normalizeApiBase enforces https:// and strips trailing slashes', () => {
  assert.equal(normalizeApiBase('https://henukit.cn/'), 'https://henukit.cn');
  assert.equal(normalizeApiBase('https://henukit.cn///'), 'https://henukit.cn');
  assert.throws(() => normalizeApiBase('http://henukit.cn'), /https:\/\//);
  assert.throws(() => normalizeApiBase('ftp://henukit.cn'), /https:\/\//);
  assert.throws(() => normalizeApiBase('not-a-url'), /https:\/\//);
});

test('validateNaming enforces docs/naming.md path safety, canonical roles, required material_type, and extension allowlist', () => {
  const valid = validateNaming({
    subject: '离散数学',
    role: '往年真题',
    materialType: 'exam',
    proposedFilename: '离散数学_真题_软件学院23级.pdf',
  });
  assert.equal(valid.publicPath, '离散数学/往年真题/离散数学_真题_软件学院23级.pdf');

  // Path traversal and forbidden characters
  assert.throws(() => validateNaming({ subject: '../evil', role: '课件', materialType: 'slides', proposedFilename: 'a.pdf' }));
  assert.throws(() => validateNaming({ subject: '.github', role: '课件', materialType: 'slides', proposedFilename: 'a.pdf' }));
  assert.throws(() => validateNaming({ subject: '离散数学', role: '课件', materialType: 'slides', proposedFilename: '../escape.pdf' }));
  assert.throws(() => validateNaming({ subject: '离散数学', role: '课件', materialType: 'slides', proposedFilename: 'bad:name.pdf' }));
  assert.throws(() => validateNaming({ subject: '离散数学', role: '课件', materialType: 'slides', proposedFilename: '未命名.pdf' }));
  assert.throws(() => validateNaming({ subject: '离散数学', role: '课件', materialType: 'slides', proposedFilename: '讲义_副本.pdf' }));

  // Legacy aliases and non-publishable 待复核资料 are tracked separately and both rejected
  assert.equal(LEGACY_ROLE_ALIASES.has('待复核资料'), false);
  assert.equal(NON_PUBLISHABLE_ROLES.has('待复核资料'), true);
  assert.throws(() => validateNaming({ subject: '离散数学', role: '课件PPT', materialType: 'slides', proposedFilename: '离散数学_课件_第1章.pptx' }));
  assert.throws(() => validateNaming({ subject: '离散数学', role: '待复核资料', materialType: 'handout', proposedFilename: '离散数学_待复核.pdf' }));

  // material_type is mandatory and must match role 1:1
  assert.throws(() => validateNaming({
    subject: '离散数学',
    role: '往年真题',
    proposedFilename: '离散数学_真题_2025.pdf',
  }), /material_type.*required/);
  assert.throws(() => validateNaming({
    subject: '离散数学',
    role: '课件',
    materialType: 'exam',
    proposedFilename: '离散数学_课件_第1章.pdf',
  }), /does not match role/);

  // Disallowed extension rejected
  assert.throws(() => validateNaming({ subject: '离散数学', role: '课件', materialType: 'slides', proposedFilename: '离散数学_课件_脚本.exe' }));
});

test('verifyDownloadedFile checks exact SHA-256 and decimal 100,000,000-byte limit', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ingest-verify-'));
  try {
    const filePath = path.join(dir, 'sample.pdf');
    const content = Buffer.from('%PDF-1.4\nhello henu\n');
    writeFileSync(filePath, content);
    const digest = sha256Hex(content);

    const ok = verifyDownloadedFile({
      filePath,
      expectedSha256: digest,
      expectedBytes: content.byteLength,
    });
    assert.deepEqual(ok, { bytes: content.byteLength, sha256: digest });

    assert.throws(() => verifyDownloadedFile({
      filePath,
      expectedSha256: '0'.repeat(64),
      expectedBytes: content.byteLength,
    }), /SHA-256 mismatch/);

    assert.throws(() => verifyDownloadedFile({
      filePath,
      expectedSha256: digest,
      expectedBytes: content.byteLength + 1,
    }), /byte size mismatch/);

    assert.equal(MAX_SUBMISSION_BYTES, 100_000_000);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('appendManifestEntry records named collector/author attribution and omits attribution for anonymous submissions', () => {
  const baseManifest = () => ({ version: 1, subjects: [] });
  const digest = 'a'.repeat(64);

  const namedCollectorManifest = baseManifest();
  const { entry: collectorEntry } = appendManifestEntry(namedCollectorManifest, {
    subject: '离散数学',
    role: '往年真题',
    material_type: 'exam',
    title: '离散数学_真题_2025.pdf',
    proposed_filename: '离散数学_真题_2025.pdf',
    year: '2025',
    college: '软件学院',
    source_type: 'student-recall',
    source_note: '软件学院同学回忆版，已检查不含个人隐私。',
    review_status: 'basic-reviewed',
    license_status: 'learning-reference',
    contains_personal_info: false,
    attribution_mode: 'named',
    attribution_role: 'collector',
    public_display_name: '明伦小助手',
  }, { bytes: 1234, sha256: digest });
  assert.deepEqual(collectorEntry.attribution, { collectors: ['明伦小助手'] });

  const namedAuthorManifest = baseManifest();
  const { entry: authorEntry } = appendManifestEntry(namedAuthorManifest, {
    subject: '离散数学',
    role: '笔记总结',
    material_type: 'note',
    title: '离散数学_笔记_图论总结.pdf',
    proposed_filename: '离散数学_笔记_图论总结.pdf',
    source_type: 'personal-note',
    source_note: '个人原创整理笔记。',
    review_status: 'basic-reviewed',
    license_status: 'learning-reference',
    contains_personal_info: false,
    attribution_mode: 'named',
    attribution_role: 'author',
    public_display_name: '河大算法笔记君',
  }, { bytes: 2048, sha256: 'b'.repeat(64) });
  assert.deepEqual(authorEntry.attribution, { authors: ['河大算法笔记君'] });

  const anonymousManifest = baseManifest();
  const { entry: anonEntry } = appendManifestEntry(anonymousManifest, {
    subject: '高等数学',
    role: '复习讲义',
    material_type: 'handout',
    title: '高等数学_讲义_考前重点.pdf',
    proposed_filename: '高等数学_讲义_考前重点.pdf',
    source_type: 'community-note',
    source_note: '同校同学整理复习讲义。',
    review_status: 'basic-reviewed',
    license_status: 'learning-reference',
    contains_personal_info: false,
    attribution_mode: 'anonymous',
    attribution_role: 'collector',
    public_display_name: '',
  }, { bytes: 4096, sha256: 'c'.repeat(64) });
  assert.equal('attribution' in anonEntry, false);

  // Rejects contact details in display name or source note
  assert.throws(() => appendManifestEntry(baseManifest(), {
    subject: '离散数学',
    role: '笔记总结',
    material_type: 'note',
    title: '离散数学_笔记_测试.pdf',
    proposed_filename: '离散数学_笔记_测试.pdf',
    source_type: 'personal-note',
    source_note: '个人整理。',
    contains_personal_info: false,
    attribution_mode: 'named',
    attribution_role: 'author',
    public_display_name: 'alice@henu.edu.cn',
  }, { bytes: 100, sha256: 'd'.repeat(64) }), /contact details/);

  // Rejects unauthorized electronic textbook
  assert.throws(() => appendManifestEntry(baseManifest(), {
    subject: '数据库系统',
    role: '电子版教材',
    material_type: 'textbook',
    title: '数据库系统_教材_概论.pdf',
    proposed_filename: '数据库系统_教材_概论.pdf',
    source_type: 'other',
    source_note: '网络整理。',
    review_status: 'basic-reviewed',
    license_status: 'learning-reference',
    contains_personal_info: false,
    attribution_mode: 'anonymous',
    attribution_role: 'collector',
    public_display_name: '',
  }, { bytes: 100, sha256: 'e'.repeat(64) }), /Electronic textbooks/);

  // Accepts verified and authorized electronic textbook
  const textbookManifest = baseManifest();
  const { entry: textbookEntry } = appendManifestEntry(textbookManifest, {
    subject: '数据库系统',
    role: '电子版教材',
    material_type: 'textbook',
    title: '数据库系统_开源教材_2025.pdf',
    proposed_filename: '数据库系统_开源教材_2025.pdf',
    source_type: 'other',
    source_note: 'CC-BY-4.0 开源教材，作者公开授权再分发。',
    review_status: 'verified',
    license_status: 'authorized-redistribution',
    contains_personal_info: false,
    attribution_mode: 'anonymous',
    attribution_role: 'collector',
    public_display_name: '',
  }, { bytes: 1024, sha256: '1'.repeat(64) });
  assert.equal(textbookEntry.reviewStatus, 'verified');
  assert.equal(textbookEntry.licenseStatus, 'authorized-redistribution');

  // Rejects 待复核资料 and unknown-reviewing in submission flow
  assert.throws(() => appendManifestEntry(baseManifest(), {
    subject: '高等数学',
    role: '待复核资料',
    title: '高等数学_待复核.pdf',
    proposed_filename: '高等数学_待复核.pdf',
    source_type: 'other',
    source_note: '测试。',
    review_status: 'basic-reviewed',
    license_status: 'learning-reference',
    contains_personal_info: false,
    attribution_mode: 'anonymous',
    attribution_role: 'collector',
    public_display_name: '',
  }, { bytes: 100, sha256: '2'.repeat(64) }), /7 publishable canonical/);

  assert.throws(() => appendManifestEntry(baseManifest(), {
    subject: '高等数学',
    role: '复习讲义',
    material_type: 'handout',
    title: '高等数学_讲义_未知来源.pdf',
    proposed_filename: '高等数学_讲义_未知来源.pdf',
    source_type: 'unknown-reviewing',
    source_note: '来源待确认。',
    review_status: 'basic-reviewed',
    license_status: 'learning-reference',
    contains_personal_info: false,
    attribution_mode: 'anonymous',
    attribution_role: 'collector',
    public_display_name: '',
  }, { bytes: 100, sha256: '3'.repeat(64) }), /Unsupported submission source_type/);

  // Rejects duplicate sha256
  assert.throws(() => appendManifestEntry(namedCollectorManifest, {
    subject: '高等数学',
    role: '往年真题',
    material_type: 'exam',
    title: '高等数学_真题_重复.pdf',
    proposed_filename: '高等数学_真题_重复.pdf',
    source_type: 'student-recall',
    source_note: '重复测试。',
    contains_personal_info: false,
    attribution_mode: 'anonymous',
    attribution_role: 'collector',
    public_display_name: '',
  }, { bytes: 1234, sha256: digest }), /Duplicate SHA-256/);
});

test('signHmacRequest generates deterministic ADR-0061 canonical HMAC-SHA256 headers', () => {
  const signedA = signHmacRequest({
    method: 'POST',
    requestPath: '/api/v1/library/internal/submissions/550e8400-e29b-41d4-a716-446655440000/pr-callback',
    rawBody: '{"outcome":"pr_open"}',
    secret: 'test-callback-secret-at-least-32-chars',
    timestamp: '1764000000',
    nonce: '0123456789abcdef0123456789abcdef',
  });
  const signedB = signHmacRequest({
    method: 'post',
    requestPath: '/api/v1/library/internal/submissions/550e8400-e29b-41d4-a716-446655440000/pr-callback',
    rawBody: '{"outcome":"pr_open"}',
    secret: 'test-callback-secret-at-least-32-chars',
    timestamp: '1764000000',
    nonce: '0123456789abcdef0123456789abcdef',
  });
  assert.equal(signedA.signature, signedB.signature);
  assert.match(signedA.signature, /^sha256=[0-9a-f]{64}$/);
  assert.equal(signedA.headers['X-Submission-Timestamp'], '1764000000');
  assert.equal(signedA.headers['X-Submission-Nonce'], '0123456789abcdef0123456789abcdef');
  assert.equal(signedA.headers['X-Submission-Signature'], signedA.signature);
});

test('buildPrBody fences user-supplied text, neutralizes embedded fences, and sanitizeErrorMessage redacts URLs', () => {
  const body = buildPrBody({
    submission_id: '550e8400-e29b-41d4-a716-446655440000',
    subject: '离散数学',
    title: '离散数学真题 @everyone Closes #1',
    role: '往年真题',
    source_type: 'student-recall',
    source_note: '同学回忆版。\n```\nCloses #42 @octocat\n```',
    license_status: 'learning-reference',
    review_status: 'basic-reviewed',
    attribution_mode: 'named',
    attribution_role: 'author',
    public_display_name: '作者 @mention ```escape```',
  }, {
    publicPath: '离散数学/往年真题/离散数学_真题_2025.pdf',
    sha256: 'f'.repeat(64),
    bytes: 512,
    runUrl: 'https://github.com/jry21223/HENU-Final-Review/actions/runs/1',
  });
  assert.match(body, /Submission-ID: 550e8400-e29b-41d4-a716-446655440000/);
  assert.match(body, new RegExp(`SHA-256: ${'f'.repeat(64)}`));
  assert.match(body, /````text\n[\s\S]*?标题: 离散数学真题 @everyone Closes #1[\s\S]*?````/);
  assert.match(body, /### 来源说明\n\n````text\n[\s\S]*?Closes #42 @octocat[\s\S]*?````/);
  // Raw triple backticks inside user text are neutralized so they cannot close the outer fence
  const lines = body.split('\n');
  const fenceLines = lines.filter((line) => line.startsWith('```'));
  assert.deepEqual(fenceLines, ['````text', '````', '````text', '````']);

  const sanitized = sanitizeErrorMessage('Failed fetching https://oss.example.com/secret?sig=abc sha256=' + 'a'.repeat(64));
  assert.doesNotMatch(sanitized, /oss\.example\.com/);
  assert.doesNotMatch(sanitized, new RegExp('a'.repeat(64)));
});
