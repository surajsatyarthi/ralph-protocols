#!/usr/bin/env node
/**
 * PM Gate Verification Script
 *
 * CODER uses this to BLOCK PM if research/plan missing
 * Enforces Gate 2 (research) and Gate 3 (plan approval) BEFORE coding
 *
 * Usage: npm run verify:pm-gates -- ENTRY-XXX
 */

const fs = require('fs');
const path = require('path');

const taskId = process.argv[2];

if (!taskId) {
  console.error('❌ Usage: npm run verify:pm-gates -- ENTRY-XXX');
  process.exit(1);
}

console.log(`🔍 Verifying PM gates for ${taskId}...`);

const checks = {
  researchAudit: {
    passed: false,
    file: `audit-gate-0-${taskId}.log`,
    description: 'Research audit with 3+ web searches (Gate 2)'
  },
  implementationPlan: {
    passed: false,
    file: `implementation-plan-${taskId}.md`,
    description: 'Implementation plan with alternatives (Gate 3)'
  },
  planApproved: {
    passed: false,
    file: `implementation-plan-${taskId}.md`,
    description: 'Plan has CEO/PM approval signature'
  },
  previousTaskDocumented: {
    passed: true, // Default true, only check if previous task exists
    file: null,
    description: 'Previous task has completion report (Gate 8)'
  }
};

// Check 1: Research audit exists
if (fs.existsSync(checks.researchAudit.file)) {
  const auditContent = fs.readFileSync(checks.researchAudit.file, 'utf8');
  // Verify it contains web searches (look for URLs or "Search:")
  const hasWebSearches = auditContent.includes('http') || auditContent.includes('Search:');
  checks.researchAudit.passed = hasWebSearches;
}

// Check 2: Implementation plan exists
checks.implementationPlan.passed = fs.existsSync(checks.implementationPlan.file);

// Check 3: Plan has approval signature
if (checks.implementationPlan.passed) {
  const plan = fs.readFileSync(checks.implementationPlan.file, 'utf8');
  checks.planApproved.passed = plan.includes('APPROVED') || plan.includes('✅ CEO APPROVAL');
}

// Check 4: Previous task documented (Gate 8)
// Extract task number and check if previous task exists
const taskMatch = taskId.match(/ENTRY-(\d+)/);
if (taskMatch) {
  const taskNumber = parseInt(taskMatch[1], 10);
  if (taskNumber > 1) {
    const prevTaskId = `ENTRY-${String(taskNumber - 1).padStart(3, '0')}`;
    const prevPlan = `implementation-plan-${prevTaskId}.md`;
    const prevReport = `.ralph/${prevTaskId}-completion-report.md`;

    // Only check if previous task was started (has a plan)
    if (fs.existsSync(prevPlan)) {
      checks.previousTaskDocumented.passed = fs.existsSync(prevReport);
      checks.previousTaskDocumented.file = prevReport;
      checks.previousTaskDocumented.description = `Previous task (${prevTaskId}) documented (Gate 8)`;
    }
  }
}

// Print results
console.log('\n📋 PM Gate Verification Results:\n');

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
  console.error('\n❌ PM GATE VERIFICATION FAILED\n');
  console.error('CODER BLOCKED: Cannot start task until PM provides missing artifacts.\n');
  console.error('Required PM actions:');

  if (!checks.researchAudit.passed) {
    console.error(`  1. Complete Gate 2 research (3+ web searches)`);
    console.error(`     Create: ${checks.researchAudit.file}`);
  }

  if (!checks.implementationPlan.passed) {
    console.error(`  2. Create implementation plan with "Alternatives Considered"`);
    console.error(`     Create: ${checks.implementationPlan.file}`);
  }

  if (!checks.planApproved.passed && checks.implementationPlan.passed) {
    console.error(`  3. Get CEO/PM approval signature in plan`);
    console.error(`     Add "APPROVED" or "✅ CEO APPROVAL" to: ${checks.planApproved.file}`);
  }

  if (!checks.previousTaskDocumented.passed) {
    console.error(`  4. Document previous task completion (Gate 8)`);
    console.error(`     Create: ${checks.previousTaskDocumented.file}`);
    console.error(`     Update: PROJECT_LEDGER.md with DONE status`);
  }

  console.error('\n💬 Coder should comment in PROJECT_LEDGER.md under task:');
  console.error('   "🚫 BLOCKED - PM gate verification failed (see verification log)"\n');

  process.exit(1);
}

console.log('\n✅ All PM gates passed - coder can proceed with task\n');
process.exit(0);
