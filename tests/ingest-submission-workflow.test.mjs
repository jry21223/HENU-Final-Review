import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const workflow = readFileSync('.github/workflows/ingest-submission.yml', 'utf8');

test('accepts only submission_id and ingest_token workflow_dispatch inputs', () => {
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /submission_id:\n[\s\S]*?required: true\n[\s\S]*?type: string/);
  assert.match(workflow, /ingest_token:\n[\s\S]*?required: true\n[\s\S]*?type: string/);
  assert.doesNotMatch(workflow, /download_url:/);
  assert.doesNotMatch(workflow, /pull_request_target:/);
});

test('passes untrusted inputs strictly via env rather than shell interpolation', () => {
  assert.match(workflow, /SUBMISSION_ID: \$\{\{ inputs\.submission_id \}\}/);
  assert.match(workflow, /INGEST_TOKEN: \$\{\{ inputs\.ingest_token \}\}/);
  assert.match(workflow, /CALLBACK_SECRET: \$\{\{ secrets\.HENUKIT_SUBMISSION_CALLBACK_SECRET \}\}/);
  assert.doesNotMatch(workflow, /run:[\s\S]*?\$\{\{\s*inputs\./);
});

test('uses least-privilege permissions, pinned checkout, repo validators, and success/failure callbacks', () => {
  assert.match(workflow, /permissions:\n  contents: write\n  pull-requests: write/);
  assert.match(workflow, /uses: actions\/checkout@[0-9a-f]{40}/);
  assert.match(workflow, /node scripts\/refresh-manifest-metadata\.mjs --write/);
  assert.match(workflow, /node scripts\/update-readme\.mjs/);
  assert.match(workflow, /node scripts\/validate-materials\.mjs/);
  assert.match(workflow, /python3 scripts\/audit-material-duplicates\.py \./);
  assert.match(workflow, /gh pr create/);
  assert.match(workflow, /--outcome pr_open/);
  assert.match(workflow, /if: failure\(\)/);
  assert.match(workflow, /--outcome pr_failed/);
});
