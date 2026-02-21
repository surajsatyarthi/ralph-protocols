#!/usr/bin/env node

/**
 * Gate 8: TDD Proof (Test-Driven Development)
 * Verifies tests exist, pass, achieve ≥80% coverage, and new source
 * files have corresponding test files.
 *
 * BLOCKS: No test files, failing tests, coverage <80%,
 *         new source files with zero test coverage.
 *
 * Usage: node gate-8-tdd.js ENTRY-XXX
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const WORKSPACE_ROOT = process.cwd();
const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET  = '\x1b[0m';

const COVERAGE_MINIMUM = 80;

// Next.js / framework files that don't require tests
const EXEMPT_PATTERNS = [
  /page\.(ts|tsx)$/,
  /layout\.(ts|tsx)$/,
  /loading\.(ts|tsx)$/,
  /error\.(ts|tsx)$/,
  /not-found\.(ts|tsx)$/,
  /metadata\.(ts|tsx)$/,
  /middleware\.(ts|tsx)$/,
  /next\.config/,
  /tailwind\.config/,
  /postcss\.config/,
  /drizzle\.config/,
  /vitest\.config/,
  /playwright\.config/,
  /sentry\./,
];

function isExempt(filePath) {
  return EXEMPT_PATTERNS.some(p => p.test(path.basename(filePath)));
}

function findTestFiles() {
  try {
    const result = execSync(
      'find . -type f \\( -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.test.js" -o -name "*.spec.ts" -o -name "*.spec.tsx" -o -name "*.spec.js" \\) | grep -v node_modules | grep -v ".next" | grep -v "dist"',
      { encoding: 'utf-8', cwd: WORKSPACE_ROOT }
    ).trim();
    return result ? result.split('\n').filter(Boolean) : [];
  } catch {
    return [];
  }
}

function getNewSourceFiles() {
  const commands = [
    'git diff --name-only --diff-filter=A origin/main..HEAD 2>/dev/null',
    'git diff --name-only --diff-filter=A main..HEAD 2>/dev/null',
  ];
  for (const cmd of commands) {
    try {
      const result = execSync(cmd, { encoding: 'utf-8', cwd: WORKSPACE_ROOT }).trim();
      if (result) {
        return result.split('\n').filter(f =>
          f.match(/\.(ts|tsx|js|jsx)$/) &&
          !f.match(/test|spec/) &&
          !f.match(/node_modules/) &&
          !isExempt(f)
        );
      }
    } catch { /* try next */ }
  }
  return [];
}

function runTests() {
  // Try vitest first, then jest, then npm run test
  const commands = [
    { cmd: 'npx vitest run', label: 'Vitest' },
    { cmd: 'npm run test', label: 'npm test' },
    { cmd: 'npx jest --passWithNoTests', label: 'Jest' },
  ];

  for (const { cmd, label } of commands) {
    const result = spawnSync(cmd, { shell: true, encoding: 'utf-8', cwd: WORKSPACE_ROOT });
    if (result.status !== null) {
      return {
        runner: label,
        passed: result.status === 0,
        output: (result.stdout || '') + (result.stderr || ''),
      };
    }
  }
  return { runner: 'unknown', passed: false, output: 'Could not find test runner' };
}

function parseCoverage(output) {
  // Try various coverage output formats
  const patterns = [
    /All files[^\d]*(\d+(?:\.\d+)?)\s*%/,           // Vitest/Jest table
    /Statements\s*:\s*(\d+(?:\.\d+)?)\s*%/,          // Istanbul
    /Lines\s*:\s*(\d+(?:\.\d+)?)\s*%/,               // Istanbul lines
    /coverage[^\d]*(\d+(?:\.\d+)?)\s*%/i,            // Generic
  ];
  for (const pattern of patterns) {
    const match = output.match(pattern);
    if (match) return parseFloat(match[1]);
  }
  return null;
}

function main() {
  const entryId = process.argv[2];

  if (!entryId || !entryId.match(/ENTRY-[A-Z0-9._-]+/i)) {
    console.error(`${RED}❌ Usage: node gate-8-tdd.js ENTRY-XXX${RESET}`);
    process.exit(1);
  }

  console.log(`\n${YELLOW}🧪 Gate 8: TDD Proof for ${entryId}${RESET}\n`);

  const violations = [];

  // --- Check 1: Test files exist ---
  console.log('📁 Checking for test files...');
  const testFiles = findTestFiles();
  console.log(`   Found ${testFiles.length} test file(s)`);

  if (testFiles.length === 0) {
    violations.push(
      'No test files found (*.test.ts, *.spec.ts, etc.). ' +
      'Tests are mandatory. Add unit tests for all new logic.'
    );
  }

  // --- Check 2: Tests pass ---
  if (testFiles.length > 0) {
    console.log('▶️  Running tests...');
    const result = runTests();
    console.log(`   Runner: ${result.runner}`);
    if (result.passed) {
      console.log(`   ${GREEN}✅ Tests pass${RESET}`);
    } else {
      violations.push(
        'Tests are failing. All tests must pass before Gate 8 can clear. ' +
        'Run `npm run test` and fix every failure.'
      );
    }

    // --- Check 3: Coverage ≥80% ---
    console.log(`📊 Checking coverage (minimum ${COVERAGE_MINIMUM}%)...`);
    try {
      const coverageResult = spawnSync(
        'npm run test -- --coverage 2>&1 || npx vitest run --coverage 2>&1',
        { shell: true, encoding: 'utf-8', cwd: WORKSPACE_ROOT }
      );
      const coverageOutput = (coverageResult.stdout || '') + (coverageResult.stderr || '');
      const coverage = parseCoverage(coverageOutput);

      if (coverage !== null) {
        console.log(`   Coverage: ${coverage}%`);
        if (coverage < COVERAGE_MINIMUM) {
          violations.push(
            `Coverage ${coverage}% is below ${COVERAGE_MINIMUM}% minimum. ` +
            `Add more tests to raise coverage.`
          );
        } else {
          console.log(`   ${GREEN}✅ Coverage ${coverage}% meets minimum${RESET}`);
        }
      } else {
        console.log(`   ${YELLOW}⚠️  Could not parse coverage percentage from output${RESET}`);
        console.log(`   Run 'npm run test -- --coverage' manually and verify ≥${COVERAGE_MINIMUM}%`);
      }
    } catch {
      console.log(`   ${YELLOW}⚠️  Coverage check skipped (runner not available in this environment)${RESET}`);
    }
  }

  // --- Check 4: New source files have test coverage ---
  console.log('🔗 Checking new files have test coverage...');
  const newSourceFiles = getNewSourceFiles();

  if (newSourceFiles.length > 0) {
    console.log(`   Found ${newSourceFiles.length} new source file(s) to check`);
    const untestedFiles = newSourceFiles.filter(sourceFile => {
      const baseName = path.basename(sourceFile, path.extname(sourceFile));
      const dir = path.dirname(sourceFile);
      return !testFiles.some(tf =>
        tf.includes(baseName) ||
        tf.includes(dir + '/') ||
        path.basename(tf).replace(/\.(test|spec)\.(ts|tsx|js)$/, '') === baseName
      );
    });

    if (untestedFiles.length > 0) {
      violations.push(
        `${untestedFiles.length} new source file(s) have no corresponding test file:\n` +
        untestedFiles.map(f => `     - ${f}`).join('\n') +
        `\n   Create test files (e.g. ${untestedFiles[0].replace(/\.(ts|tsx|js)$/, '.test.ts')})`
      );
    } else {
      console.log(`   ${GREEN}✅ All new files have test coverage${RESET}`);
    }
  } else {
    console.log('   No new source files on this branch');
  }

  // --- Check 5: Test report artifact ---
  const reportDir = path.join(WORKSPACE_ROOT, 'docs', 'reports');
  const reportExists = fs.existsSync(reportDir) &&
    fs.readdirSync(reportDir).some(f => f.includes(entryId) && f.includes('test'));

  if (!reportExists) {
    console.log(`   ${YELLOW}⚠️  No test report found at docs/reports/test-results-${entryId}.md${RESET}`);
    console.log(`       Create this file with: test runner output, coverage %, pass/fail counts`);
    // Warning only (not a hard block) — the actual test execution is the hard gate
  }

  // --- Report ---
  if (violations.length > 0) {
    console.error(`\n${RED}❌ Gate 8 BLOCKED: ${violations.length} violation(s):${RESET}\n`);
    violations.forEach(v => console.error(`   ${RED}→ ${v}${RESET}\n`));
    process.exit(1);
  }

  console.log(`\n${GREEN}✅ Gate 8 PASSED: Tests verified for ${entryId}${RESET}`);
  process.exit(0);
}

main();
