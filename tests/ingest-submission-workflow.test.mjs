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

test('passes untrusted inputs strictly via env rather than shell interpolation and scopes secrets per step', () => {
  assert.match(workflow, /concurrency:\n  group: ingest-submission-\$\{\{ inputs\.submission_id \}\}\n  cancel-in-progress: false/);
  assert.match(workflow, /SUBMISSION_ID: \$\{\{ inputs\.submission_id \}\}/);
  assert.match(workflow, /INGEST_TOKEN: \$\{\{ inputs\.ingest_token \}\}/);
  assert.match(workflow, /CALLBACK_SECRET: \$\{\{ secrets\.HENUKIT_SUBMISSION_CALLBACK_SECRET \}\}/);
  assert.match(workflow, /echo "::add-mask::\$INGEST_TOKEN"/);
  // No shell `run:` block may interpolate `${{ inputs.* }}` directly
  const runBlocks = [...workflow.matchAll(/^[ \t]+run:[ \t]*(?:\|\n((?:[ \t]{10,}.*\n|\n)*)|([^\n]+))/gm)];
  assert.ok(runBlocks.length >= 6);
  for (const match of runBlocks) {
    const scriptBody = match[1] ?? match[2] ?? '';
    assert.doesNotMatch(scriptBody, /\$\{\{\s*inputs\./);
  }

  // Job-level env must not carry INGEST_TOKEN or CALLBACK_SECRET
  const jobHeader = workflow.split('    steps:')[0];
  assert.doesNotMatch(jobHeader, /INGEST_TOKEN:/);
  assert.doesNotMatch(jobHeader, /CALLBACK_SECRET:/);

  // INGEST_TOKEN must appear in exactly one step (fetch-and-apply)
  const ingestTokenMatches = workflow.match(/INGEST_TOKEN:\s*\$\{\{/g) || [];
  assert.equal(ingestTokenMatches.length, 1);

  // CALLBACK_SECRET must appear only in the 3 HTTP-signing steps (fetch-and-apply, success callback, failure callback)
  const callbackSecretMatches = workflow.match(/CALLBACK_SECRET:\s*\$\{\{/g) || [];
  assert.equal(callbackSecretMatches.length, 3);
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
