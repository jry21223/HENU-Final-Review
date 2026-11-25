#!/usr/bin/env node
import { createHash, createHmac, randomBytes } from 'node:crypto';
import {
  appendFileSync,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const MAX_SUBMISSION_BYTES = 100_000_000;

export const CANONICAL_ROLES = new Set([
  '复习讲义',
  '往年真题',
  '课件',
  '题库练习',
  '答案解析',
  '笔记总结',
  '电子版教材',
  '待复核资料',
]);

export const LEGACY_ROLE_ALIASES = new Set([
  '课件PPT',
  '课件资料',
  '课件资料包',
  '待复核课件PPT',
]);

export const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.pptx',
  '.ppt',
  '.docx',
  '.md',
  '.txt',
  '.zip',
]);

const SYSTEM_DIRS = new Set([
  '.git',
  '.github',
  'docs',
  'scripts',
  'skills',
  'tests',
  '.public-materials-export',
]);

const FORBIDDEN_FILENAME_CHARS = /[,:?*<>|"\\/\u0000-\u001f\u007f]/;
const FORBIDDEN_BASENAME_PATTERNS = [
  /副本/i,
  /final_final/i,
  /未命名/i,
  /新建文件/i,
  /^~\$/,
  /\.tmp$/i,
  /\.crdownload$/i,
  /\.download$/i,
];

const CONTACT_DETAIL_PATTERNS = [
  /[A-Z0-9._%+-]+\s*@\s*[A-Z0-9.-]+\.[A-Z]{2,}/i,
  /(?<!\d)1[3-9]\d{9}(?!\d)/,
  /QQ\s*[:：]?\s*[1-9]\d{4,11}/i,
  /微信\s*[:：]?/i,
  /联系方式|联系邮箱|联系电话|手机号|二维码|学号/,
];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

export function validateSubmissionId(value) {
  if (typeof value !== 'string' || !UUID_PATTERN.test(value.trim())) {
    throw new Error('submission_id must be a canonical UUID.');
  }
  return value.trim().toLowerCase();
}

export function sha256Hex(bufferOrString) {
  return createHash('sha256').update(bufferOrString).digest('hex');
}

export function signHmacRequest({ method, requestPath, rawBody, secret, timestamp, nonce }) {
  if (typeof secret !== 'string' || secret.length < 16) {
    throw new Error('HENUKIT_SUBMISSION_CALLBACK_SECRET is missing or too short.');
  }
  const upperMethod = String(method || 'POST').toUpperCase();
  const normalizedPath = String(requestPath || '');
  if (!normalizedPath.startsWith('/')) {
    throw new Error(`Invalid canonical requestPath '${normalizedPath}'.`);
  }
  const ts = String(timestamp ?? Math.floor(Date.now() / 1000));
  const usedNonce = String(nonce ?? randomBytes(16).toString('hex'));
  const bodyHash = sha256Hex(rawBody ?? '');
  const canonical = `${upperMethod}\n${normalizedPath}\n${ts}\n${usedNonce}\n${bodyHash}`;
  const digest = createHmac('sha256', secret).update(canonical).digest('hex');
  return {
    timestamp: ts,
    nonce: usedNonce,
    signature: `sha256=${digest}`,
    headers: {
      'X-Submission-Timestamp': ts,
      'X-Submission-Nonce': usedNonce,
      'X-Submission-Signature': `sha256=${digest}`,
    },
  };
}

export function containsContactDetails(value) {
  return typeof value === 'string' && CONTACT_DETAIL_PATTERNS.some((pattern) => pattern.test(value));
}

export function validateNaming({ subject, role, proposedFilename }) {
  if (typeof subject !== 'string' || subject.trim() !== subject || subject.length === 0 || subject.length > 160) {
    throw new Error('subject must be a trimmed non-empty string up to 160 characters.');
  }
  if (
    subject === '.'
    || subject === '..'
    || SYSTEM_DIRS.has(subject)
    || FORBIDDEN_FILENAME_CHARS.test(subject)
  ) {
    throw new Error(`Invalid subject directory '${subject}'.`);
  }

  if (typeof role !== 'string' || LEGACY_ROLE_ALIASES.has(role) || !CANONICAL_ROLES.has(role)) {
    throw new Error(`role '${role}' must be one of the 8 canonical material types.`);
  }

  if (
    typeof proposedFilename !== 'string'
    || proposedFilename.trim() !== proposedFilename
    || proposedFilename.length === 0
    || proposedFilename.length > 255
  ) {
    throw new Error('proposed_filename must be a trimmed non-empty filename up to 255 characters.');
  }
  if (
    proposedFilename === '.'
    || proposedFilename === '..'
    || proposedFilename.includes('..')
    || FORBIDDEN_FILENAME_CHARS.test(proposedFilename)
  ) {
    throw new Error(`Unsafe filename '${proposedFilename}'.`);
  }
  for (const pattern of FORBIDDEN_BASENAME_PATTERNS) {
    if (pattern.test(proposedFilename)) {
      throw new Error(`Filename looks temporary or unnormalized: '${proposedFilename}'.`);
    }
  }

  const ext = path.posix.extname(proposedFilename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`Unsupported file extension '${ext}'.`);
  }

  const publicPath = `${subject}/${role}/${proposedFilename}`;
  const normalized = path.posix.normalize(publicPath);
  if (normalized !== publicPath || normalized.startsWith('../') || normalized.startsWith('/')) {
    throw new Error(`Resolved publicPath '${publicPath}' failed normalization safety check.`);
  }

  return { subject, role, proposedFilename, publicPath, ext };
}

export function verifyDownloadedFile({ filePath, expectedSha256, expectedBytes }) {
  if (!existsSync(filePath)) {
    throw new Error('Downloaded submission file does not exist.');
  }
  const stats = statSync(filePath);
  if (!stats.isFile()) {
    throw new Error('Downloaded submission path is not a regular file.');
  }
  if (stats.size < 1 || stats.size > MAX_SUBMISSION_BYTES) {
    throw new Error(`Submission file size ${stats.size} exceeds allowed range 1..${MAX_SUBMISSION_BYTES} bytes.`);
  }
  if (expectedBytes !== undefined && stats.size !== expectedBytes) {
    throw new Error(`Downloaded byte size mismatch: expected ${expectedBytes}, got ${stats.size}.`);
  }
  const normalizedExpectedHash = String(expectedSha256 || '').toLowerCase();
  if (!SHA256_PATTERN.test(normalizedExpectedHash)) {
    throw new Error('Expected sha256 must be a 64-char lowercase hex digest.');
  }
  const actualSha256 = sha256Hex(readFileSync(filePath));
  if (actualSha256 !== normalizedExpectedHash) {
    throw new Error(`SHA-256 mismatch: expected ${normalizedExpectedHash}, got ${actualSha256}.`);
  }
  return { bytes: stats.size, sha256: actualSha256 };
}

export function appendManifestEntry(manifest, submission, verifiedFile) {
  if (!manifest || manifest.version !== 1 || !Array.isArray(manifest.subjects)) {
    throw new Error('manifest.json must have version 1 and a subjects array.');
  }
  const { subject, role, proposedFilename, publicPath } = validateNaming({
    subject: submission.subject,
    role: submission.role,
    proposedFilename: submission.proposed_filename,
  });

  if (submission.contains_personal_info !== false) {
    throw new Error('Submission must declare contains_personal_info=false.');
  }
  if (typeof submission.source_note !== 'string' || submission.source_note.trim() === '') {
    throw new Error('Submission must include a non-empty source_note.');
  }
  if (containsContactDetails(submission.source_note)) {
    throw new Error('source_note must not contain personal contact details.');
  }

  const reviewStatus = submission.review_status || 'basic-reviewed';
  const licenseStatus = submission.license_status || 'learning-reference';
  if (role === '电子版教材') {
    if (reviewStatus !== 'verified' || licenseStatus !== 'authorized-redistribution') {
      throw new Error('Electronic textbooks require review_status=verified and license_status=authorized-redistribution.');
    }
  }
  if (licenseStatus === 'teacher_shared_exception') {
    throw new Error('New submissions may not use teacher_shared_exception.');
  }

  for (const existingSubject of manifest.subjects) {
    for (const existingAsset of existingSubject.assets || []) {
      if (existingAsset.publicPath === publicPath) {
        throw new Error(`Manifest already contains an asset at '${publicPath}'.`);
      }
      if (existingAsset.sha256 === verifiedFile.sha256) {
        throw new Error(`Duplicate SHA-256 already present in manifest at '${existingAsset.publicPath}'.`);
      }
    }
  }

  const entry = {
    subject,
    role,
    title: submission.title && String(submission.title).trim() ? String(submission.title).trim() : proposedFilename,
    publicPath,
    ...(submission.year && String(submission.year).trim() ? { year: String(submission.year).trim() } : {}),
    ...(submission.college && String(submission.college).trim() ? { college: String(submission.college).trim() } : {}),
    ...(submission.source_type ? { sourceType: String(submission.source_type) } : {}),
    sourceNote: submission.source_note.trim(),
    reviewStatus,
    containsPersonalInfo: false,
    licenseStatus,
    bytes: verifiedFile.bytes,
    sha256: verifiedFile.sha256,
  };

  const mode = submission.attribution_mode;
  if (mode !== 'named' && mode !== 'anonymous') {
    throw new Error(`Unsupported attribution_mode '${mode}'.`);
  }
  if (mode === 'named') {
    const displayName = typeof submission.public_display_name === 'string' ? submission.public_display_name.trim() : '';
    if (!displayName || displayName.length > 64) {
      throw new Error('Named submission requires a non-empty public_display_name up to 64 characters.');
    }
    if (containsContactDetails(displayName)) {
      throw new Error('public_display_name must not contain contact details.');
    }
    const attrRole = submission.attribution_role;
    if (attrRole === 'author') {
      entry.attribution = { authors: [displayName] };
    } else if (attrRole === 'collector') {
      entry.attribution = { collectors: [displayName] };
    } else {
      throw new Error(`Unsupported attribution_role '${attrRole}'.`);
    }
  }

  let subjectBucket = manifest.subjects.find((item) => item.name === subject);
  if (!subjectBucket) {
    subjectBucket = {
      name: subject,
      note: '收录同校公开复习资料。',
      assets: [],
    };
    manifest.subjects.push(subjectBucket);
  }
  if (!Array.isArray(subjectBucket.assets)) {
    subjectBucket.assets = [];
  }
  subjectBucket.assets.push(entry);
  return { publicPath, entry };
}

export function buildPrBody(submission, { publicPath, sha256, bytes, runUrl }) {
  const attributionLine = submission.attribution_mode === 'named'
    ? `${submission.attribution_role === 'author' ? '原创作者' : '资料提供者'}: \`${submission.public_display_name}\``
    : '匿名投稿（不写入 manifest attribution）';
  const lines = [
    '## 学生投稿自动入库',
    '',
    `Submission-ID: ${submission.submission_id}`,
    `SHA-256: ${sha256}`,
    '',
    `- 课程: \`${submission.subject}\``,
    `- Canonical 类型: \`${submission.role}\``,
    `- 仓库路径: \`${publicPath}\``,
    `- 文件大小: \`${bytes}\` bytes`,
    ...(submission.year ? [`- 年份/适用范围: \`${submission.year}\``] : []),
    ...(submission.college ? [`- 学院: \`${submission.college}\``] : []),
    `- 来源类别: \`${submission.source_type || 'other'}\``,
    `- 来源说明: ${submission.source_note}`,
    `- 授权边界: \`${submission.license_status || 'learning-reference'}\``,
    `- 复核状态: \`${submission.review_status || 'basic-reviewed'}\``,
    `- 署名致谢: ${attributionLine}`,
    ...(runUrl ? [`- 工作流记录: ${runUrl}`] : []),
    '',
    '请维护者核对文件命名、内容边界与 manifest 元数据后合并；合并后将自动同步至 HENU Kit `/library` 并记入贡献榜。',
  ];
  return `${lines.join('\n')}\n`;
}

export function sanitizeErrorMessage(message) {
  const raw = String(message || 'Submission ingestion failed')
    .replace(/https?:\/\/\S+/gi, '[redacted-url]')
    .replace(/sha256=[0-9a-f]{64}/gi, 'sha256=[redacted]')
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim();
  if (!raw) return 'Submission ingestion failed';
  return raw.length > 500 ? `${raw.slice(0, 497)}...` : raw;
}

function ensureInsideRepo(repoRoot, targetPath) {
  const realRoot = realpathSync(repoRoot);
  const parentDir = path.dirname(targetPath);
  mkdirSync(parentDir, { recursive: true });
  if (lstatSync(parentDir).isSymbolicLink()) {
    throw new Error('Target directory is a symbolic link.');
  }
  const realParent = realpathSync(parentDir);
  const rel = path.relative(realRoot, realParent);
  if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error('Target directory resolves outside the repository.');
  }
}

async function fetchJsonSigned({ apiBase, requestPath, payload, secret }) {
  const rawBody = JSON.stringify(payload);
  const signed = signHmacRequest({ method: 'POST', requestPath, rawBody, secret });
  const url = `${apiBase.replace(/\/+$/, '')}${requestPath}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...signed.headers,
    },
    body: rawBody,
  });
  const text = await response.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }
  if (!response.ok) {
    const code = parsed?.error?.code || `HTTP_${response.status}`;
    const msg = parsed?.error?.message || `Request failed with status ${response.status}`;
    throw new Error(`${code}: ${msg}`);
  }
  return parsed?.data ?? parsed;
}

async function downloadToFile(downloadUrl, destPath) {
  const response = await fetch(downloadUrl, { method: 'GET', redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`Failed to download staged submission object (HTTP ${response.status}).`);
  }
  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength < 1 || arrayBuffer.byteLength > MAX_SUBMISSION_BYTES) {
    throw new Error(`Downloaded payload size ${arrayBuffer.byteLength} violates 1..${MAX_SUBMISSION_BYTES} byte limit.`);
  }
  writeFileSync(destPath, Buffer.from(arrayBuffer));
}

function writeGitHubOutput(outputPath, entries) {
  if (!outputPath) return;
  const lines = Object.entries(entries).map(([key, value]) => `${key}=${String(value).replace(/\r?\n/g, ' ')}`);
  appendFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
}

async function runFetchAndApply() {
  const submissionId = validateSubmissionId(process.env.SUBMISSION_ID);
  const ingestToken = String(process.env.INGEST_TOKEN || '').trim();
  if (!ingestToken) throw new Error('INGEST_TOKEN is required.');
  const secret = String(process.env.CALLBACK_SECRET || '').trim();
  const apiBase = String(process.env.INGEST_API_BASE || 'https://henukit.cn').trim();
  const repoRoot = process.cwd();

  const requestPath = `/api/v1/library/internal/submissions/${submissionId}/ingest-payload`;
  const payload = await fetchJsonSigned({
    apiBase,
    requestPath,
    payload: { ingest_token: ingestToken },
    secret,
  });

  if (!payload || typeof payload.download_url !== 'string' || !payload.download_url.startsWith('https://')) {
    throw new Error('Ingest payload did not include a valid HTTPS download_url.');
  }

  const tempDir = mkdtempSync(path.join(tmpdir(), 'henu-ingest-'));
  try {
    const tempFile = path.join(tempDir, 'submission.bin');
    await downloadToFile(payload.download_url, tempFile);
    const verified = verifyDownloadedFile({
      filePath: tempFile,
      expectedSha256: payload.sha256,
      expectedBytes: payload.byte_size,
    });

    const naming = validateNaming({
      subject: payload.subject,
      role: payload.role,
      proposedFilename: payload.proposed_filename,
    });

    const targetPath = path.join(repoRoot, ...naming.publicPath.split('/'));
    if (existsSync(targetPath)) {
      throw new Error(`Target material file already exists at '${naming.publicPath}'.`);
    }
    ensureInsideRepo(repoRoot, targetPath);

    const manifestPath = path.join(repoRoot, 'manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const { publicPath, entry } = appendManifestEntry(manifest, { ...payload, submission_id: submissionId }, verified);

    copyFileSync(tempFile, targetPath);
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

    const shortId = submissionId.slice(0, 8);
    const branch = `submission/${shortId}`;
    const prTitle = `add(${naming.subject}): ${entry.title}`;
    const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : '';
    const bodyFile = path.join(tmpdir(), `submission-${shortId}-pr-body.md`);
    writeFileSync(
      bodyFile,
      buildPrBody({ ...payload, submission_id: submissionId }, { publicPath, sha256: verified.sha256, bytes: verified.bytes, runUrl }),
      'utf8',
    );

    writeGitHubOutput(process.env.GITHUB_OUTPUT, {
      branch,
      pr_title: prTitle,
      pr_body_file: bodyFile,
      public_path: publicPath,
      sha256: verified.sha256,
      subject: naming.subject,
    });
    console.log(`Prepared submission ${submissionId} at ${publicPath} (${verified.bytes} bytes, sha256=${verified.sha256}).`);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function parseCallbackArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key.startsWith('--') || value === undefined) {
      throw new Error(`Invalid argument near '${key}'.`);
    }
    args[key.slice(2)] = value;
    i += 1;
  }
  return args;
}

async function runCallback(argv) {
  const submissionId = validateSubmissionId(process.env.SUBMISSION_ID);
  const secret = String(process.env.CALLBACK_SECRET || '').trim();
  const apiBase = String(process.env.INGEST_API_BASE || 'https://henukit.cn').trim();
  const args = parseCallbackArgs(argv);
  const outcome = args.outcome;
  if (outcome !== 'pr_open' && outcome !== 'pr_failed') {
    throw new Error(`Unsupported callback outcome '${outcome}'.`);
  }
  const body = { outcome };
  if (outcome === 'pr_open') {
    const prNumber = Number(args['pr-number']);
    if (!Number.isInteger(prNumber) || prNumber < 1) {
      throw new Error('pr_open callback requires a positive integer --pr-number.');
    }
    if (!args['pr-url'] || !args.branch) {
      throw new Error('pr_open callback requires --pr-url and --branch.');
    }
    body.github_pr_number = prNumber;
    body.github_pr_url = args['pr-url'];
    body.github_branch = args.branch;
  } else {
    body.pr_error = sanitizeErrorMessage(args.error || 'Submission ingestion workflow failed.');
  }

  const requestPath = `/api/v1/library/internal/submissions/${submissionId}/pr-callback`;
  const result = await fetchJsonSigned({ apiBase, requestPath, payload: body, secret });
  console.log(`Reported callback ${outcome} for submission ${submissionId}:`, JSON.stringify(result));
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (command === 'fetch-and-apply') {
    await runFetchAndApply();
    return;
  }
  if (command === 'callback') {
    await runCallback(rest);
    return;
  }
  throw new Error('Usage: node scripts/ingest-submission.mjs <fetch-and-apply|callback> [options]');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    const safeMessage = sanitizeErrorMessage(error?.message || String(error));
    console.error(`error: ${safeMessage}`);
    if (process.env.GITHUB_ENV) {
      appendFileSync(process.env.GITHUB_ENV, `INGEST_FAILURE_REASON=${safeMessage}\n`, 'utf8');
    }
    process.exit(1);
  });
}
