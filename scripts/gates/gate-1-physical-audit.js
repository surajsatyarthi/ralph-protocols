#!/usr/bin/env node

/**
 * Gate 1: Physical Audit & State Verification
 * Ensures the coder has DIRECTLY OBSERVED the current code AND production
 * state before any research or planning begins.
 *
 * WHY THIS GATE EXISTS:
 *   You cannot conduct meaningful research (G2) without first knowing what
 *   actually exists. You cannot plan (G3) without knowing the current state.
 *   This gate proves you looked before you leaped.
 *
 * BLOCKS: Missing audit doc, no git HEAD anchor, audit too short (templates),
 *         missing required sections, unfilled placeholders.
 *
 * Usage: node gate-1-physical-audit.js ENTRY-XXX
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_ROOT = process.cwd();
const RED   = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function findAuditFile(entryId) {
  // Support both new path (docs/reports/) and legacy root-level placement
  const candidates = [
    path.join(WORKSPACE_ROOT, 'docs', 'reports', `physical-audit-${entryId}.md`),
    path.join(WORKSPACE_ROOT, 'docs', 'reports', `phase_1_assessment_report_TASK_${entryId.replace(/ENTRY-/i, '').replace(/-/g, '_')}.md`),
    path.join(WORKSPACE_ROOT, `physical-audit-${entryId}.md`),
  ];
  return candidates.find(p => fs.existsSync(p)) || null;
}

function getCurrentHead() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf-8', cwd: WORKSPACE_ROOT }).trim();
  } catch {
    return null;
  }
}

function main() {
  const entryId = process.argv[2];

  if (!entryId || !entryId.match(/ENTRY-[A-Z0-9._-]+/i)) {
    console.error(`${RED}❌ Usage: node gate-1-physical-audit.js ENTRY-XXX${RESET}`);
    process.exit(1);
  }

  console.log(`\n${YELLOW}🔍 Gate 1: Physical Audit Verification for ${entryId}${RESET}\n`);

  const auditPath = findAuditFile(entryId);

  if (!auditPath) {
    console.error(`${RED}❌ Gate 1 BLOCKED: No physical audit document found.${RESET}`);
    console.error(`\nYou MUST directly observe the current code AND production state`);
    console.error(`before doing any research or planning.\n`);
    console.error(`Create one of these files:`);
    console.error(`  docs/reports/physical-audit-${entryId}.md`);
    console.error(`  docs/reports/phase_1_assessment_report_TASK_${entryId.replace(/ENTRY-/i, '')}.md`);
    console.error(`\nRequired sections (minimum 50 non-empty lines):`);
    console.error(`  ## Git HEAD`);
    console.error(`  ## Current State Analysis`);
    console.error(`  ## Production State`);
    console.error(`  ## Files / Dependency Analysis`);
    console.error(`  ## Known Issues`);
    process.exit(1);
  }

  console.log(`   Found: ${path.relative(WORKSPACE_ROOT, auditPath)}`);
  const content = fs.readFileSync(auditPath, 'utf-8');
  const violations = [];

  // --- Check 1: Contains current git HEAD hash ---
  console.log('🔐 Checking for git HEAD anchor...');
  const head = getCurrentHead();
  if (head) {
    const shortHead = head.substring(0, 7);
    if (!content.includes(shortHead) && !content.includes(head)) {
      violations.push(
        `Missing current git HEAD hash (${shortHead}). ` +
        `The audit must be anchored to the current commit. ` +
        `Run: git rev-parse HEAD`
      );
    } else {
      console.log(`   ✅ Anchored to HEAD ${shortHead}`);
    }
  } else {
    console.log(`   ${YELLOW}⚠️  Could not verify HEAD (git unavailable)${RESET}`);
  }

  // --- Check 2: Minimum length (50 non-empty lines) ---
  const nonEmptyLines = content.split('\n').filter(l => l.trim().length > 0);
  console.log(`📏 Checking document length (${nonEmptyLines.length} non-empty lines)...`);
  if (nonEmptyLines.length < 50) {
    violations.push(
      `Audit document too short: ${nonEmptyLines.length} lines (minimum 50). ` +
      `A genuine physical audit of code and production cannot be done in fewer lines.`
    );
  } else {
    console.log(`   ✅ ${nonEmptyLines.length} lines`);
  }

  // --- Check 3: Required sections present ---
  const requiredSections = [
    {
      pattern: /##.*Current\s+State|##.*Code\s+State|##.*Analysis/i,
      name: 'Current State Analysis (## Current State or ## Analysis)'
    },
    {
      pattern: /git\s+rev-parse|HEAD\s+SHA|HEAD\s+Hash|HEAD\s+Commit|commit\s+hash/i,
      name: 'Git HEAD documentation'
    },
    {
      pattern: /##.*Production|##.*Live|##.*Deploy/i,
      name: 'Production State section (## Production State or ## Live)'
    },
    {
      pattern: /##.*Files|##.*Dependencies|##.*Changed|##.*Dependency/i,
      name: 'Files / Dependency Analysis section'
    },
  ];

  for (const section of requiredSections) {
    const label = `📋 Checking for "${section.name}"...`;
    console.log(label);
    if (!content.match(section.pattern)) {
      violations.push(`Missing required section: "${section.name}"`);
    } else {
      console.log(`   ✅ Found`);
    }
  }

  // --- Check 4: No unfilled template placeholders ---
  console.log('🔍 Checking for unfilled template placeholders...');
  const templatePatterns = [/\[INSERT\]/i, /\[TODO\]/i, /\[FILL IN\]/i, /your_description_here/i, /\[PASTE\]/i];
  const foundPlaceholder = templatePatterns.find(p => content.match(p));
  if (foundPlaceholder) {
    violations.push('Document contains unfilled template placeholders. Replace all [INSERT], [TODO], etc. with real data.');
  } else {
    console.log('   ✅ No placeholders found');
  }

  // --- Report ---
  if (violations.length > 0) {
    console.error(`\n${RED}❌ Gate 1 BLOCKED: ${violations.length} violation(s):${RESET}\n`);
    violations.forEach(v => console.error(`   ${RED}→ ${v}${RESET}`));
    console.error(`\n${YELLOW}Fix: Complete a genuine physical audit of the current codebase and production state.${RESET}`);
    process.exit(1);
  }

  console.log(`\n${GREEN}✅ Gate 1 PASSED: Physical audit verified for ${entryId}${RESET}`);
  process.exit(0);
}

main();
