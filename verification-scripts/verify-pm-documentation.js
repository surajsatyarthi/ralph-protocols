#!/usr/bin/env node
/**
 * PM Documentation Verification Script
 *
 * CODER uses this to BLOCK next task if PM didn't document previous task
 * Enforces Gate 8 (PM Documentation Accountability)
 *
 * Usage: npm run verify:pm-documentation -- ENTRY-XXX
 *
 * Example: Before starting ENTRY-016, verify ENTRY-015 is documented
 *          npm run verify:pm-documentation -- ENTRY-015
 */

const fs = require('fs');
const { execSync } = require('child_process');

const taskId = process.argv[2];

if (!taskId) {
  console.error('❌ Usage: npm run verify:pm-documentation -- ENTRY-XXX');
  console.error('   Example: npm run verify:pm-documentation -- ENTRY-015');
  process.exit(1);
}

console.log(`🔍 Verifying PM documentation for ${taskId}...\n`);

const checks = {
  completionReport: {
    passed: false,
    file: `.ralph/${taskId}-completion-report.md`,
    description: 'Completion report exists'
  },
  ledgerUpdated: {
    passed: false,
    file: 'PROJECT_LEDGER.md',
    description: 'Ledger updated with DONE status'
  },
  docsCommitted: {
    passed: false,
    file: null,
    description: 'Documentation updates committed to git'
  }
};

// Check 1: Completion report exists
checks.completionReport.passed = fs.existsSync(checks.completionReport.file);

// Check 2: Ledger updated with DONE status
if (fs.existsSync(checks.ledgerUpdated.file)) {
  const ledger = fs.readFileSync(checks.ledgerUpdated.file, 'utf8');

  // Look for task entry with DONE status
  // Pattern: [ENTRY-XXX] followed by status: DONE (case-insensitive)
  const taskPattern = new RegExp(`${taskId}[\\s\\S]*?status:\\s*DONE`, 'i');
  checks.ledgerUpdated.passed = taskPattern.test(ledger);
}

// Check 3: Documentation committed to git
try {
  // Search recent commits for documentation updates related to this task
  const recentCommits = execSync(
    `git log --oneline -20 --grep="${taskId}"`,
    { encoding: 'utf8', stdio: 'pipe' }
  );

  // Look for doc commits (contains "docs:" or "document")
  checks.docsCommitted.passed =
    recentCommits.includes('docs:') ||
    recentCommits.toLowerCase().includes('document');
} catch (error) {
  // If git command fails, assume not committed
  checks.docsCommitted.passed = false;
}

// Print results
console.log('📋 PM Documentation Verification Results:\n');

let allPassed = true;
for (const [key, check] of Object.entries(checks)) {
  const icon = check.passed ? '✅' : '❌';
  console.log(`${icon} ${check.description}`);
  if (!check.passed && check.file) {
    console.log(`   Missing: ${check.file}`);
  }
  if (!check.passed) {
    allPassed = false;
  }
}

if (!allPassed) {
  console.error('\n❌ PM DOCUMENTATION VERIFICATION FAILED\n');
  console.error('CODER BLOCKED: Cannot start next task until PM completes Gate 8.\n');
  console.error(`Required PM actions for ${taskId}:\n`);

  if (!checks.completionReport.passed) {
    console.error(`  1. Create completion report: ${checks.completionReport.file}`);
    console.error('     Must include:');
    console.error('     - What was built');
    console.error('     - Errors encountered and fixes');
    console.error('     - Time taken vs estimated');
    console.error('     - Git hash');
    console.error('     - Lessons learned');
  }

  if (!checks.ledgerUpdated.passed) {
    console.error(`  2. Update PROJECT_LEDGER.md`);
    console.error(`     - Change ${taskId} status to DONE`);
    console.error(`     - Link to completion report`);
    console.error(`     - Update evidence section`);
  }

  if (!checks.docsCommitted.passed) {
    console.error(`  3. Commit documentation updates`);
    console.error(`     - Message: "docs: document ${taskId} completion (Gate 8)"`);
    console.error(`     - Include: completion report, ledger update, PRD updates`);
  }

  console.error('\n📖 Reference: PM Protocol Gate 8 (Documentation Accountability)');
  console.error('   See: .agent/PM_PROTOCOL.md');

  console.error('\n💬 Coder should comment in PROJECT_LEDGER.md:');
  console.error(`   "🚫 BLOCKED - ${taskId} not documented (Gate 8 violation)"`);
  console.error(`   "Cannot start next task until PM completes documentation."\n`);

  process.exit(1);
}

console.log(`\n✅ PM documentation verified for ${taskId}`);
console.log('   Coder can proceed with next task\n');
process.exit(0);
