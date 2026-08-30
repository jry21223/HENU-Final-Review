import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const workflow = readFileSync('.github/workflows/review-material.yml', 'utf8');

test('exposes the native manual review form', () => {
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /public_path:\n[\s\S]*?type: string/);
  assert.match(workflow, /target_role:\n[\s\S]*?type: choice/);
  assert.match(workflow, /review_evidence:\n[\s\S]*?required: false[\s\S]*?type: string/);
  assert.match(workflow, /confirm_public:\n[\s\S]*?type: boolean/);
  assert.match(workflow, /- 电子版教材/);
  assert.match(workflow, /- 笔记总结/);
});

test('passes workflow input through environment variables instead of shell interpolation', () => {
  assert.match(workflow, /PUBLIC_PATH: \$\{\{ inputs\.public_path \}\}/);
  assert.match(workflow, /REVIEW_EVIDENCE: \$\{\{ inputs\.review_evidence \}\}/);
  assert.match(workflow, /--public-path "\$PUBLIC_PATH"/);
  assert.doesNotMatch(workflow, /--public-path "\$\{\{/);
});

test('uses least-purpose write permissions and creates a pull request', () => {
  assert.match(workflow, /permissions:\n  contents: write\n  pull-requests: write/);
  assert.match(workflow, /uses: actions\/checkout@[0-9a-f]{40}/);
  assert.match(workflow, /gh pr create/);
  assert.doesNotMatch(workflow, /pull_request_target:/);
});
