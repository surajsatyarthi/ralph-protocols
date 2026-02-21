#!/usr/bin/env node

/**
 * Gate 14: PM Code Review
 * Verifies that the PM reviewed the actual code and approved it by commenting
 * "APPROVED" on the pull request.
 *
 * WHY THIS GATE EXISTS:
 * Without human review, Antigravity self-certifies its own work.
 * This gate forces a human checkpoint before production merge.
 *
 * HOW IT WORKS:
 * 1. Antigravity posts a "Code Review Summary" to the PR body:
 *    - List of files changed and why each changed
 *    - List of files NOT changed and why
 *    - Any scope deviations from the approved G3 plan
 * 2. PM reviews the code diff + the Code Review Summary
 * 3. PM comments "APPROVED" on the PR
 * 4. This gate checks: PR has APPROVED comment
 *
 * BLOCKS: Missing Code Review Summary in PR body, no APPROVED comment on PR.
 *
 * Usage: node gate-14-pm-review.js ENTRY-XXX PR_NUMBER
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = process.cwd();
const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET  = '\x1b[0m';

function getRepoInfo() {
  try {
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8', cwd: WORKSPACE_ROOT }).trim();
    // Parse https://github.com/owner/repo or git@github.com:owner/repo
    const match = remoteUrl.match(/github\.com[/:]([\w-]+)\/([\w.-]+?)(?:\.git)?$/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  } catch (_) { /* fall through */ }
  return null;
}

function getPrBody(prNumber, owner, repo) {
  try {
    return execSync(
      `gh pr view ${prNumber} --repo ${owner}/${repo} --json body --jq '.body'`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();
  } catch (_) {
    return null;
  }
}

function getPrComments(prNumber, owner, repo) {
  try {
    const output = execSync(
      `gh pr view ${prNumber} --repo ${owner}/${repo} --json comments --jq '.comments[] | {author: .author.login, body: .body}'`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();
    if (!output) return [];
    // gh jq outputs one JSON object per line
    return output.split('\n').map(line => {
      try { return JSON.parse(line); } catch (_) { return null; }
    }).filter(Boolean);
  } catch (_) {
    return null; // null = gh CLI failure
  }
}

function main() {
  const entryId  = process.argv[2];
  const prNumber = process.argv[3];

  if (!entryId || !entryId.match(/ENTRY-[A-Z0-9._-]+/i)) {
    console.error(`${RED}❌ Usage: node gate-14-pm-review.js ENTRY-XXX PR_NUMBER${RESET}`);
    process.exit(1);
  }

  if (!prNumber || !prNumber.match(/^\d+$/)) {
    console.error(`${RED}❌ PR number required.${RESET}`);
    console.error(`${YELLOW}Usage: node gate-14-pm-review.js ${entryId} <PR_NUMBER>${RESET}`);
    console.error(`${YELLOW}Find PR number: gh pr list${RESET}`);
    process.exit(1);
  }

  console.log(`\n${YELLOW}👁️  Gate 14: PM Code Review for ${entryId} (PR #${prNumber})${RESET}\n`);

  const violations = [];

  // --- Get repo info ---
  const repoInfo = getRepoInfo();
  if (!repoInfo) {
    console.error(`${RED}❌ Cannot determine GitHub repo. Ensure git remote origin points to GitHub.${RESET}`);
    process.exit(1);
  }
  console.log(`   Repo: ${repoInfo.owner}/${repoInfo.repo}`);

  // --- Check 1: Antigravity posted a Code Review Summary in the PR body ---
  console.log('📋 Checking for Code Review Summary in PR body...');
  const prBody = getPrBody(prNumber, repoInfo.owner, repoInfo.repo);

  if (prBody === null) {
    violations.push(
      `Could not fetch PR #${prNumber}. Ensure gh CLI is authenticated (gh auth status) ` +
      `and the PR exists at https://github.com/${repoInfo.owner}/${repoInfo.repo}/pull/${prNumber}`
    );
  } else {
    const hasCodeReviewSummary = /Code\s+Review\s+Summary/i.test(prBody);
    const hasFilesChanged      = /files?\s+(changed|modified)|changed\s+files?/i.test(prBody);
    const hasNotChanged        = /not\s+changed|unchanged|did\s+not\s+change|why\s+not/i.test(prBody);

    if (!hasCodeReviewSummary) {
      violations.push(
        `PR #${prNumber} body does not contain a "Code Review Summary". ` +
        'Antigravity must update the PR body with: ' +
        '(1) ## Code Review Summary, ' +
        '(2) List of files changed + why each changed, ' +
        '(3) Files NOT changed and why.'
      );
    } else if (!hasFilesChanged) {
      violations.push(
        '"Code Review Summary" found but missing "Files Changed" section. ' +
        'List each file that was changed and explain why.'
      );
    } else if (!hasNotChanged) {
      violations.push(
        '"Code Review Summary" found but missing "Files NOT Changed" section. ' +
        'Explicitly list what was intentionally left unchanged and why, ' +
        'so the PM can verify Antigravity did not secretly modify anything extra.'
      );
    } else {
      console.log('   ✅ Code Review Summary found (files changed + not changed documented)');
    }
  }

  // --- Check 2: PR has an APPROVED comment ---
  console.log('✅ Checking for PM APPROVED comment...');
  const comments = getPrComments(prNumber, repoInfo.owner, repoInfo.repo);

  if (comments === null) {
    violations.push(
      `Failed to fetch PR comments. Check gh CLI auth: gh auth status. ` +
      `Then view PR: https://github.com/${repoInfo.owner}/${repoInfo.repo}/pull/${prNumber}`
    );
  } else if (comments.length === 0) {
    violations.push(
      `PR #${prNumber} has no comments. ` +
      `PM must review the code diff + Code Review Summary, then comment "APPROVED" on the PR.`
    );
  } else {
    const approvedComment = comments.find(c => /\bAPPROVED\b/i.test(c.body));
    if (!approvedComment) {
      violations.push(
        `PR #${prNumber} has no "APPROVED" comment. ` +
        `PM must review and comment exactly "APPROVED" (case-insensitive) at: ` +
        `https://github.com/${repoInfo.owner}/${repoInfo.repo}/pull/${prNumber}`
      );
      console.log(`${YELLOW}   Comments on PR (${comments.length} total):${RESET}`);
      comments.slice(0, 3).forEach(c => {
        const preview = c.body.replace(/\n/g, ' ').substring(0, 60);
        console.log(`   - @${c.author}: "${preview}..."`);
      });
    } else {
      console.log(`   ${GREEN}✅ APPROVED by @${approvedComment.author}${RESET}`);
    }
  }

  // --- Report ---
  if (violations.length > 0) {
    console.error(`\n${RED}❌ Gate 14 BLOCKED: ${violations.length} violation(s):${RESET}\n`);
    violations.forEach(v => console.error(`   ${RED}→ ${v}${RESET}`));
    console.error(`\n${YELLOW}Steps to unblock:${RESET}`);
    console.error(`   1. Antigravity adds a "## Code Review Summary" to PR #${prNumber} body`);
    console.error(`      - Files changed: list each file + reason`);
    console.error(`      - Files NOT changed: explicit list + reason`);
    console.error(`   2. PM opens PR and reviews the code diff`);
    console.error(`   3. PM comments "APPROVED" on the PR`);
    console.error(`   4. Re-run: node scripts/gates/gate-14-pm-review.js ${entryId} ${prNumber}`);
    process.exit(1);
  }

  console.log(`\n${GREEN}✅ Gate 14 PASSED: PM has reviewed and approved PR #${prNumber} for ${entryId}${RESET}`);
  process.exit(0);
}

main();
