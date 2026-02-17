#!/usr/bin/env node

/**
 * PM Gate 3: Technical Feasibility Validation
 * Ensures technical feasibility was confirmed by coder before assignment
 * BLOCKS: No coder sign-off, risky work without POC
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = process.cwd();
const LEDGER_PATH = path.join(WORKSPACE_ROOT, 'PROJECT_LEDGER.md');

function main() {
  const entryId = process.argv[2];
  
  if (!entryId || !entryId.match(/ENTRY-\d{3}/)) {
    console.error('❌ Usage: npm run verify:feasibility -- ENTRY-XXX');
    process.exit(1);
  }

  console.log(`\n🔧 PM Gate 3: Technical Feasibility Validation for ${entryId}\n`);

  if (!fs.existsSync(LEDGER_PATH)) {
    console.error(`❌ PROJECT_LEDGER.md not found`);
    process.exit(1);
  }

  const ledger = fs.readFileSync(LEDGER_PATH, 'utf-8');
  
  // Extract entry section
  const entryRegex = new RegExp(`## ${entryId}[\\s\\S]*?(?=## ENTRY-|$)`, 'i');
  const entryMatch = ledger.match(entryRegex);
  
  if (!entryMatch) {
    console.error(`❌ ${entryId} not found in ledger`);
    process.exit(1);
  }

  const entryContent = entryMatch[0];
  const violations = [];

  // Method 1: Coder sign-off documented
  console.log('✍️  Checking for coder sign-off...');
  const hasSignOff = /coder\s+sign-off|technical\s+approval|feasibility\s+confirmed/i.test(entryContent);
  
  // Method 2: POC code exists (for risky work)
  console.log('🧪 Checking for POC...');
  const hasPOC = /poc|proof[- ]of[- ]concept|prototype|spike/i.test(entryContent);
  
  // Method 3: Reference to similar work
  console.log('🔗 Checking for similar work reference...');
  const hasSimilar = /similar to|based on|reference.*ENTRY-\d{3}/i.test(entryContent);
  
  // Method 4: Explicit "Low  Risk" label
  console.log('📉 Checking risk assessment...');
  const isLowRisk = /risk:?\s*low|low\s+risk/i.test(entryContent);

  // Validation: At least one method must be present
  if (!hasSignOff && !hasPOC && !hasSimilar && !isLowRisk) {
    violations.push('No technical feasibility confirmation found (need coder sign-off, POC, similar work reference, or low-risk label)');
  }

  // Additional check: If marked as "High Risk", MUST have POC
  const isHighRisk = /risk:?\s*high|high\s+risk/i.test(entryContent);
  if (isHighRisk && !hasPOC) {
    violations.push('High-risk work requires POC or prototype');
  }

  // Generate report
  const report = {
    entry: entryId,
    timestamp: new Date().toISOString(),
    feasibility: {
      hasCoderSignOff: hasSignOff,
      hasPOC: hasPOC,
      hasSimilarWork: hasSimilar,
      isLowRisk: isLowRisk,
      isHighRisk: isHighRisk
    },
    violations
  };

  console.log(`\n📊 Feasibility Status:`);
  console.log(`   Coder sign-off: ${report.feasibility.hasCoderSignOff ? 'Yes ✅' : 'No'}`);  
  console.log(`   POC exists: ${report.feasibility.hasPOC ? 'Yes ✅' : 'No'}`);
  console.log(`   Similar work referenced: ${report.feasibility.hasSimilarWork ? 'Yes ✅' : 'No'}`);
  console.log(`   Risk level: ${report.feasibility.isHighRisk ? 'High ⚠️' : report.feasibility.isLowRisk ? 'Low ✅' : 'Unknown'}`);

  if (violations.length > 0) {
    console.error(`\n❌ PM Gate 3 BLOCKED: ${violations.length} violation(s):\n`);
    violations.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  }

  console.log(`\n✅ PM Gate 3 PASSED: Technical feasibility confirmed`);
  process.exit(0);
}

main();
