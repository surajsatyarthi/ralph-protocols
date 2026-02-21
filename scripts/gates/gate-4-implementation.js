#!/usr/bin/env node

/**
 * Gate 4: Implementation Integrity
 * Verifies that actual code changes align with the approved G3 plan.
 * Prevents scope creep and ensures implementation follows the approved blueprint.
 *
 * BLOCKS: No commits on branch, plan not approved, scope creep >30%
 *         of changed files not mentioned in plan.
 *
 * Usage: node gate-4-implementation.js ENTRY-XXX
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_ROOT = process.cwd();
const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET  = '\x1b[0m';

const SCOPE_CREEP_THRESHOLD = 0.30; // 30% unplanned files = violation

// File patterns that are always excluded from scope analysis (expected additions)
const EXCLUDED_PATTERNS = [
  /\.test\.(ts|tsx|js|jsx)$/,
  /\.spec\.(ts|tsx|js|jsx)$/,
  /package-lock\.json$/,
  /pnpm-lock\.yaml$/,
  /yarn\.lock$/,
  /\.md$/,
];

function isExcluded(filePath) {
  return EXCLUDED_PATTERNS.some(p => p.test(filePath));
}

function getChangedFiles() {
  const commands = [
    'git diff --name-only origin/main..HEAD 2>/dev/null',
    'git diff --name-only main..HEAD 2>/dev/null',
    'git diff --name-only HEAD~3..HEAD 2>/dev/null',
  ];
  for (const cmd of commands) {
    try {
      const result = execSync(cmd, { encoding: 'utf-8', cwd: WORKSPACE_ROOT }).trim();
      if (result) return result.split('\n').filter(Boolean);
    } catch { /* try next */ }
  }
  return [];
}

function extractPlannedFiles(planContent) {
  const files = new Set();
  // Match backtick file references
  const backtickMatches = planContent.match(/`([^`]+\.[a-zA-Z]{1,5})`/g) || [];
  backtickMatches.forEach(m => {
    const f = m.replace(/`/g, '').trim();
    if (f.includes('/') || f.match(/\.[a-zA-Z]{1,5}$/)) files.add(f);
  });
  // Match markdown link references to files
  const linkMatches = planContent.match(/\[([^\]]+\.[a-zA-Z]{1,5})\]/g) || [];
  linkMatches.forEach(m => {
    const f = m.replace(/[\[\]]/g, '').trim();
    if (f.includes('/')) files.add(f);
  });
  return [...files];
}

function fileMatchesPlan(changedFile, plannedFiles) {
  const baseName = path.basename(changedFile);
  return plannedFiles.some(pf => {
    return changedFile.includes(pf) ||
           pf.includes(changedFile) ||
           path.basename(pf) === baseName ||
           changedFile.includes(path.basename(pf));
  });
}

function main() {
  const entryId = process.argv[2];

  if (!entryId || !entryId.match(/ENTRY-[A-Z0-9._-]+/i)) {
    console.error(`${RED}❌ Usage: node gate-4-implementation.js ENTRY-XXX${RESET}`);
    process.exit(1);
  }

  console.log(`\n${YELLOW}🔨 Gate 4: Implementation Integrity for ${entryId}${RESET}\n`);

  const violations = [];

  // --- Pre-check: G3 plan must exist (gate dependency) ---
  const planPath = path.join(WORKSPACE_ROOT, `implementation-plan-${entryId}.md`);
  if (!fs.existsSync(planPath)) {
    console.error(`${RED}❌ Gate 4 BLOCKED: Gate 3 prerequisite not met.${RESET}`);
    console.error(`   No implementation plan found: implementation-plan-${entryId}.md`);
    console.error(`   You MUST complete Gate 3 (Blueprint & RFC) before Gate 4 (Implementation).`);
    process.exit(1);
  }

  const planContent = fs.readFileSync(planPath, 'utf-8');

  // --- Check 1: Plan is approved ---
  console.log('✅ Checking plan approval...');
  if (!planContent.match(/APPROVED|✅\s*Approved|Status:\s*APPROVED/i)) {
    violations.push(
      'Implementation plan is not approved. ' +
      'CEO/PM must sign off (add "Status: APPROVED" or "APPROVED — [Name] [Date]") before coding starts.'
    );
  } else {
    console.log('   ✅ Plan is approved');
  }

  // --- Check 2: Branch has implementation commits ---
  console.log('📝 Checking for implementation commits...');
  const changedFiles = getChangedFiles();
  if (changedFiles.length === 0) {
    violations.push(
      'No changed files detected on this branch. ' +
      'If you have commits, ensure they are pushed or compare against the correct base.'
    );
  } else {
    console.log(`   Found ${changedFiles.length} changed file(s)`);
  }

  // --- Check 3: Scope creep analysis ---
  if (changedFiles.length > 0) {
    console.log('📋 Checking scope alignment with plan...');
    const plannedFiles = extractPlannedFiles(planContent);

    if (plannedFiles.length > 0) {
      const analyzable = changedFiles.filter(f => !isExcluded(f));
      const unplanned = analyzable.filter(f => !fileMatchesPlan(f, plannedFiles));
      const scopeRatio = unplanned.length / Math.max(analyzable.length, 1);

      console.log(`   Planned files in doc : ${plannedFiles.length}`);
      console.log(`   Changed files        : ${analyzable.length}`);
      console.log(`   Unplanned changes    : ${unplanned.length}`);

      if (scopeRatio > SCOPE_CREEP_THRESHOLD && unplanned.length > 3) {
        violations.push(
          `Scope creep detected: ${unplanned.length}/${analyzable.length} changed files ` +
          `(${Math.round(scopeRatio * 100)}%) are not mentioned in the approved plan.\n` +
          `   Unplanned files:\n` +
          unplanned.slice(0, 8).map(f => `     - ${f}`).join('\n') +
          (unplanned.length > 8 ? `\n     ... and ${unplanned.length - 8} more` : '') +
          `\n   Fix: Either update the approved plan to include these files, ` +
          `or revert changes that are out of scope.`
        );
      } else if (unplanned.length > 0) {
        console.log(`   ${YELLOW}⚠️  ${unplanned.length} unplanned file(s) changed (within ${Math.round(SCOPE_CREEP_THRESHOLD * 100)}% tolerance)${RESET}`);
      } else {
        console.log('   ✅ All changes within planned scope');
      }
    } else {
      console.log(`   ${YELLOW}⚠️  Could not extract file list from plan (no backtick file references found)${RESET}`);
    }
  }

  // --- Check 4: Plan has "Files to Change" section ---
  console.log('📄 Checking plan completeness...');
  if (!planContent.match(/Files?\s+to\s+Change|Files?\s+Changed|Implementation\s+Log/i)) {
    violations.push(
      'Plan is missing a "Files to Change" or "Implementation Log" section. ' +
      'The plan must explicitly list which files will be modified.'
    );
  } else {
    console.log('   ✅ Plan has file change documentation');
  }

  // --- Report ---
  if (violations.length > 0) {
    console.error(`\n${RED}❌ Gate 4 BLOCKED: ${violations.length} violation(s):${RESET}\n`);
    violations.forEach(v => console.error(`   ${RED}→ ${v}${RESET}\n`));
    process.exit(1);
  }

  console.log(`\n${GREEN}✅ Gate 4 PASSED: Implementation aligns with approved plan for ${entryId}${RESET}`);
  process.exit(0);
}

main();
