#!/usr/bin/env node

/**
 * Gate 3: Scope Validation
 * Ensures implementation matches the plan (no bait-and-switch)
 * BLOCKS: >30% deviation from planned scope without explanation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_ROOT = process.cwd();
const EVIDENCE_DIR = path.join(WORKSPACE_ROOT, '.evidence');
const PLANS_DIR = path.join(WORKSPACE_ROOT, 'docs/implementation/plans');

function main() {
  const entryId = process.argv[2];
  const gitHash = process.argv[3];
  
  if (!entryId || !entryId.match(/ENTRY-\d{3}/)) {
    console.error('❌ Usage: npm run verify:scope -- ENTRY-XXX <git-hash>');
    process.exit(1);
  }

  if (!gitHash) {
    console.error('❌ Git hash required for scope validation');
    process.exit(1);
  }

  console.log(`\n📐 Gate 3: Scope Validation for ${entryId}`);
  console.log(`📍 Git Hash: ${gitHash}\n`);

  const planPath = path.join(PLANS_DIR, `${entryId}-plan.md`);
  
  if (!fs.existsSync(planPath)) {
    console.error(`❌ Implementation plan not found: ${planPath}`);
    console.error(`\nExpected location: docs/implementation/plans/${entryId}-plan.md`);
    process.exit(1);
  }

  const planContent = fs.readFileSync(planPath, 'utf-8');

  // Extract planned files from plan
  console.log('📋 Extracting planned files from implementation plan...');
  const plannedFiles = extractPlannedFiles(planContent);
  
  // Get actual files changed
  console.log('🔍 Getting actual files changed in git...');
  const actualFiles = getActualChangedFiles(gitHash);

  // Calculate deviation
  const analysis = analyzeDeviation(plannedFiles, actualFiles);

  console.log(`\n📊 Scope Analysis:`);
  console.log(`   Planned files: ${plannedFiles.length}`);
  console.log(`   Actual files: ${actualFiles.length}`);
  console.log(`   Matched: ${analysis.matched.length}`);
  console.log(`   Unplanned: ${analysis.unplanned.length}`);
  console.log(`   Missing: ${analysis.missing.length}`);
  console.log(`   Deviation: ${analysis.deviationPercent.toFixed(1)}%`);

  // Check for explanation if high deviation
  const violations = [];
  const deviationThreshold = 30;

  if (analysis.deviationPercent > deviationThreshold) {
    // Check if plan has "Scope Changes" section explaining deviation
    const hasExplanation = /##\s*Scope\s+Changes?|##\s*Deviations?|##\s*Updates?/i.test(planContent);
    
    if (!hasExplanation) {
      violations.push(`${analysis.deviationPercent.toFixed(1)}% scope deviation without explanation (threshold: ${deviationThreshold}%)`);
    }
  }

  // Flag if major unplanned files
  const majorUnplanned = analysis.unplanned.filter(f => 
    !f.includes('test') && 
    !f.includes('spec') && 
    !f.includes('.md') &&
    !f.includes('package-lock.json')
  );

  if (majorUnplanned.length > 3) {
    violations.push(`${majorUnplanned.length} major unplanned files (need explanation)`);
  }

  // Generate report
  const report = {
    entry: entryId,
    gitHash,
    timestamp: new Date().toISOString(),
    planned: plannedFiles,
    actual: actualFiles,
    analysis,
    violations
  };

  saveReport(entryId, report);

  if (violations.length > 0) {
    console.error(`\n❌ Gate 3 BLOCKED: ${violations.length} scope violation(s):\n`);
    violations.forEach(v => console.error(`   - ${v}`));
    console.error(`\nUnplanned files:`);
    analysis.unplanned.slice(0, 10).forEach(f => console.error(`   - ${f}`));
    if (analysis.unplanned.length > 10) {
      console.error(`   ... and ${analysis.unplanned.length - 10} more`);
    }
    process.exit(1);
  }

  console.log(`\n✅ Gate 3 PASSED: Implementation matches plan (${analysis.deviationPercent.toFixed(1)}% deviation)`);
  process.exit(0);
}

function extractPlannedFiles(planContent) {
  const files = [];
  
  // Pattern 1: Markdown file links: [file.ts](path/to/file.ts)
  const linkPattern = /\[([^\]]+\.(ts|tsx|js|jsx|md|json|css))\]\([^)]*\)/g;
  let match;
  while ((match = linkPattern.exec(planContent)) !== null) {
    files.push(match[1]);
  }

  // Pattern 2: Inline code file paths: `src/path/to/file.ts`
  const codePattern = /`([^`]*\.(ts|tsx|js|jsx|md|json|css))`/g;
  while ((match = codePattern.exec(planContent)) !== null) {
    files.push(match[1]);
  }

  // Pattern 3: Plain file paths
  const pathPattern = /(?:^|\s)((?:src|app|pages|components|lib|utils|scripts|docs)\/[^\s]+\.(ts|tsx|js|jsx|md|json|css))/gm;
  while ((match = pathPattern.exec(planContent)) !== null) {
    files.push(match[1]);
  }

  // Remove duplicates and normalize
  return [...new Set(files)].map(f => f.replace(/^\//, ''));
}

function getActualChangedFiles(gitHash) {
  try {
    // Get files changed in commit and its parents (in case of amend)
    const output = execSync(`git diff-tree --no-commit-id --name-only -r ${gitHash}`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });

    return output.split('\n').filter(f => 
      f.length > 0 && 
      f.match(/\.(ts|tsx|js|jsx|md|json|css)$/) &&
      !f.includes('node_modules')
    );
  } catch (error) {
    console.error('❌ Failed to get changed files from git');
    return [];
  }
}

function analyzeDeviation(planned, actual) {
  const matched = [];
  const unplanned = [];
  const missing = [];

  // Normalize paths for comparison
  const normalizedPlanned = planned.map(f => f.replace(/^\//, '').toLowerCase());
  const normalizedActual = actual.map(f => f.replace(/^\//, '').toLowerCase());

  // Find matched files
  actual.forEach((file, idx) => {
    const normalized = normalizedActual[idx];
    // Check exact match or basename match
    const isMatched = normalizedPlanned.some(p => 
      p === normalized || path.basename(p) === path.basename(normalized)
    );
    
    if (isMatched) {
      matched.push(file);
    } else {
      unplanned.push(file);
    }
  });

  // Find missing files
  planned.forEach((file, idx) => {
    const normalized = normalizedPlanned[idx];
    const isPresent = normalizedActual.some(a => 
      a === normalized || path.basename(a) === path.basename(normalized)
    );
    
    if (!isPresent) {
      missing.push(file);
    }
  });

  // Calculate deviation percentage
  const totalScope = Math.max(planned.length, actual.length);
  const deviations = unplanned.length + missing.length;
  const deviationPercent = totalScope > 0 ? (deviations / totalScope) * 100 : 0;

  return {
    matched,
    unplanned,
    missing,
    deviationPercent
  };
}

function saveReport(entryId, report) {
  const reportContent = `# Gate 3 Scope Validation Report - ${entryId}

**Status:** ${report.violations.length === 0 ? '✅ PASSED' : '❌ BLOCKED'}
**Timestamp:** ${report.timestamp}
**Git Hash:** \`${report.gitHash}\`

## Scope Analysis

| Metric | Count |
|--------|-------|
| Planned files | ${report.planned.length} |
| Actual files | ${report.actual.length} |
| Matched | ${report.analysis.matched.length} ✅ |
| Unplanned | ${report.analysis.unplanned.length} ${report.analysis.unplanned.length > 0 ? '⚠️' : ''} |
| Missing | ${report.analysis.missing.length} ${report.analysis.missing.length > 0 ? '⚠️' : ''} |
| **Deviation** | **${report.analysis.deviationPercent.toFixed(1)}%** ${report.analysis.deviationPercent > 30 ? '❌' : '✅'} |

## Matched Files

${report.analysis.matched.length > 0 ? report.analysis.matched.map(f => `- ✅ ${f}`).join('\n') : 'None'}

## Unplanned Files (Not in Original Plan)

${report.analysis.unplanned.length > 0 ? report.analysis.unplanned.map(f => `- ⚠️ ${f}`).join('\n') : 'None'}

## Missing Files (Planned but Not Implemented)

${report.analysis.missing.length > 0 ? report.analysis.missing.map(f => `- ⚠️ ${f}`).join('\n') : 'None'}

## Violations

${report.violations.length === 0 ? 'None ✅' : report.violations.map(v => `- ❌ ${v}`).join('\n')}

## Conclusion

${report.violations.length === 0 
  ? `✅ Implementation scope matches plan. Deviation of ${report.analysis.deviationPercent.toFixed(1)}% is within acceptable threshold (30%).` 
  : `❌ BLOCKED: Significant scope deviation detected. Update plan with "Scope Changes" section explaining deviations.`}

## Guidelines

- **<30% deviation:** Acceptable, proceed
- **>30% deviation:** Requires explanation in plan under "Scope Changes" section
- **Unplanned major files:** Explain why they were added
- **Missing planned files:** Explain why they were not implemented

---
Generated: ${new Date().toISOString()}
`;

  const reportPath = path.join(EVIDENCE_DIR, 'reports', `scope-${entryId}.md`);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportContent);
  
  const jsonPath = path.join(EVIDENCE_DIR, 'reports', `scope-${entryId}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📄 Report saved: ${reportPath}`);
}

main();
