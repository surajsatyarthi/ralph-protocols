#!/usr/bin/env node

/**
 * PM Gate 2: PRD Quality Validation
 * Ensures acceptance criteria are measurable and user stories are well-formed
 * BLOCKS: Vague criteria, missing user stories, unmeasurable goals
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = process.cwd();
const LEDGER_PATH = path.join(WORKSPACE_ROOT, 'PROJECT_LEDGER.md');

function main() {
  const entryId = process.argv[2];
  
  if (!entryId || !entryId.match(/ENTRY-\d{3}/)) {
    console.error('❌ Usage: npm run verify:prd -- ENTRY-XXX');
    process.exit(1);
  }

  console.log(`\n📋 PM Gate 2: PRD Quality Validation for ${entryId}\n`);

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

  // Validation 1: Acceptance Criteria
  console.log('✅ Checking acceptance criteria...');
  const acSection = entryContent.match(/Acceptance Criteria[\\s\\S]*?(?=###|##|$)/i);
  
  if (!acSection) {
    violations.push('No "Acceptance Criteria" section found');
  } else {
    const criteria = acSection[0].match(/^[-*]\s+.+$/gm) || [];
    if (criteria.length < 5) {
      violations.push(`Only ${criteria.length} acceptance criteria (need 5+)`);
    }
    
    // Check if criteria have measurable metrics
    const measurableCriteria = criteria.filter(c => 
      /\d+|all|every|each|complete|successful/i.test(c)
    );
    
    if (measurableCriteria.length < 3) {
      violations.push(`Only ${measurableCriteria.length} measurable criteria (need 3+)`);
    }
  }

  // Validation 2: User Stories
  console.log('📖 Checking user stories...');
  const userStories = entryContent.match(/As a .+?, I want .+?, so that .+?[.\n]/gi) || [];
  
  if (userStories.length < 3) {
    violations.push(`Only ${userStories.length} user stories (need 3+)`);
  }

  // Validation 3: Success Metrics
  console.log('📊 Checking success metrics...');
  const hasMetrics = /success metrics?|kpis?|metrics?/i.test(entryContent);
  
  if (!hasMetrics) {
    violations.push('No success metrics section found');
  }

  // Validation 4: Edge Cases
  console.log('⚠️  Checking edge cases...');
  const hasEdgeCases = /edge cases?|error handling|failure scenarios?/i.test(entryContent);
  
  if (!hasEdgeCases) {
    violations.push('No edge cases or error handling documented');
  }

  // Generate report
  const report = {
    entry: entryId,
    timestamp: new Date().toISOString(),
    metrics: {
      acceptanceCriteria: acSection ? (acSection[0].match(/^[-*]\s+.+$/gm) || []).length : 0,
      userStories: userStories.length,
      hasSuccessMetrics: hasMetrics,
      hasEdgeCases: hasEdgeCases
    },
    violations
  };

  console.log(`\n📊 PRD Metrics:`);
  console.log(`   Acceptance criteria: ${report.metrics.acceptanceCriteria}`);
  console.log(`   User stories: ${report.metrics.userStories}`);
  console.log(`   Success metrics: ${report.metrics.hasSuccessMetrics ? 'Yes' : 'No'}`);
  console.log(`   Edge cases: ${report.metrics.hasEdgeCases ? 'Yes' : 'No'}`);

  if (violations.length > 0) {
    console.error(`\n❌ PM Gate 2 BLOCKED: ${violations.length} violation(s):\n`);
    violations.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  }

  console.log(`\n✅ PM Gate 2 PASSED: PRD quality meets requirements`);
  process.exit(0);
}

main();
