#!/usr/bin/env node
/**
 * Ralph Gate Verification Script
 *
 * PM uses this to BLOCK coder if quality gates failing
 * Enforces Ralph Protocol G7 (build/lint/test) before approval
 *
 * Usage: npm run verify:ralph-gates -- ENTRY-XXX
 */

const { execSync } = require('child_process');
const fs = require('fs');

const taskId = process.argv[2];

if (!taskId) {
  console.error('❌ Usage: npm run verify:ralph-gates -- ENTRY-XXX');
  process.exit(1);
}

console.log(`🔍 Verifying Ralph Protocol gates for ${taskId}...\n`);

const checks = {
  build: { passed: false, name: 'Build compiles (Gate 7)' },
  lint: { passed: false, name: 'ESLint passes (Gate 7)' },
  test: { passed: false, name: 'Tests pass (Gate 8)' },
  researchAudit: { passed: false, name: 'Research audit exists (Gate 2)' }
};

let allPassed = true;

// Check 1: Build compiles
console.log('1️⃣  Running build...');
try {
  execSync('npm run build', { stdio: 'pipe', encoding: 'utf8' });
  checks.build.passed = true;
  console.log('   ✅ Build successful\n');
} catch (error) {
  checks.build.passed = false;
  console.error('   ❌ Build failed\n');
  console.error(error.stdout || error.message);
  allPassed = false;
}

// Check 2: Lint passes
console.log('2️⃣  Running lint...');
try {
  execSync('npm run lint', { stdio: 'pipe', encoding: 'utf8' });
  checks.lint.passed = true;
  console.log('   ✅ Lint passed\n');
} catch (error) {
  checks.lint.passed = false;
  console.error('   ❌ Lint failed\n');
  console.error(error.stdout || error.message);
  allPassed = false;
}

// Check 3: Tests pass
console.log('3️⃣  Running tests...');
try {
  execSync('npm run test', { stdio: 'pipe', encoding: 'utf8' });
  checks.test.passed = true;
  console.log('   ✅ Tests passed\n');
} catch (error) {
  checks.test.passed = false;
  console.error('   ❌ Tests failed\n');
  console.error(error.stdout || error.message);
  allPassed = false;
}

// Check 4: Research audit exists (coder followed Gate 2)
console.log('4️⃣  Checking research audit...');
const auditFile = `audit-gate-0-${taskId}.log`;
if (fs.existsSync(auditFile)) {
  checks.researchAudit.passed = true;
  console.log(`   ✅ Research audit found: ${auditFile}\n`);
} else {
  checks.researchAudit.passed = false;
  console.error(`   ❌ Missing research audit: ${auditFile}\n`);
  allPassed = false;
}

// Print summary
console.log('📋 Ralph Gate Verification Summary:\n');
for (const [key, check] of Object.entries(checks)) {
  const icon = check.passed ? '✅' : '❌';
  console.log(`${icon} ${check.name}`);
}

if (!allPassed) {
  console.error('\n❌ RALPH GATE VERIFICATION FAILED\n');
  console.error('PM BLOCKED: Cannot approve task until coder fixes quality issues.\n');
  console.error('Required coder actions:');

  if (!checks.build.passed) {
    console.error('  1. Fix build errors (see output above)');
  }

  if (!checks.lint.passed) {
    console.error('  2. Fix lint errors (run: npm run lint)');
  }

  if (!checks.test.passed) {
    console.error('  3. Fix failing tests (run: npm run test)');
  }

  if (!checks.researchAudit.passed) {
    console.error(`  4. Create research audit: ${auditFile}`);
    console.error('     Must contain 3+ web searches per Gate 2');
  }

  console.error('\n💬 PM should comment in PROJECT_LEDGER.md under task:');
  console.error('   "🚫 BLOCKED - Ralph gate verification failed (see verification log)"\n');

  process.exit(1);
}

console.log('\n✅ All Ralph gates passed - PM can approve task\n');
process.exit(0);
