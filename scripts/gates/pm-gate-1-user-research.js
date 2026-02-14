#!/usr/bin/env node

/**
 * PM Gate 1: User Research Validation
 * Ensures PM conducted proper user research before assignment
 * BLOCKS: Missing interviews, insufficient feedback, no data
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = process.cwd();
const RESEARCH_DIR = path.join(WORKSPACE_ROOT, 'docs/pm-research');

function main() {
  const entryId = process.argv[2];
  
  if (!entryId || !entryId.match(/ENTRY-\d{3}/)) {
    console.error('❌ Usage: npm run verify:user-research -- ENTRY-XXX');
    process.exit(1);
  }

  console.log(`\n👥 PM Gate 1: User Research Validation for ${entryId}\n`);

  const researchPath = path.join(RESEARCH_DIR, `${entryId}-user-research.md`);
  
  if (!fs.existsSync(researchPath)) {
    console.error(`❌ User research document not found: ${researchPath}`);
    console.error(`\nExpected location: docs/pm-research/${entryId}-user-research.md`);
    process.exit(1);
  }

  const content = fs.readFileSync(researchPath, 'utf-8');
  const violations = [];

  // Method 1: User Interviews
  console.log('📞 Checking for user interviews...');
  const interviews = content.match(/##\s*Interview\s+#\d+/gi) || [];
  
  // Method 2: Survey Results
  console.log('📊 Checking for survey responses...');
  const surveyMatch = content.match(/(\d+)\s+survey\s+responses?/i);
  const surveyCount = surveyMatch ? parseInt(surveyMatch[1]) : 0;
  
  // Method 3: Existing Feedback
  console.log('💬 Checking for existing feedback...');
  const hasFeedback = content.match(/existing\s+feedback|customer\s+feedback|user\s+feedback/i);

  // Validation: At least one method must be satisfied
  if (interviews.length < 3 && surveyCount < 20 && !hasFeedback) {
    violations.push('Insufficient user research: need either 3+ interviews, 20+ survey responses, or documented existing feedback');
  }

  // Validation: Key insights documented
  console.log('💡 Checking for key insights...');
  const insights = content.match(/##\s*Key\s+Insights?/i);
  if (!insights) {
    violations.push('No "Key Insights" section found');
  }

  // Validation: User pain points
  console.log('😤 Checking for pain points...');
  const painPoints = content.match(/pain\s+points?/i);
  if (!painPoints) {
    violations.push('No user pain points documented');
  }

  // Validation: Minimum word count
  console.log('📏 Checking word count...');
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const minWords = 500;
  if (wordCount < minWords) {
    violations.push(`Only ${wordCount} words (need ${minWords}+)`);
  }

  // Generate report
  const report = {
    entry: entryId,
    timestamp: new Date().toISOString(),
    researchPath: path.relative(WORKSPACE_ROOT, researchPath),
    metrics: {
      interviews: interviews.length,
      surveyResponses: surveyCount,
      hasExistingFeedback: !!hasFeedback,
      hasInsights: !!insights,
      hasPainPoints: !!painPoints,
      wordCount
    },
    violations
  };

  console.log(`\n📊 Research Metrics:`);
  console.log(`   Interviews: ${report.metrics.interviews}`);
  console.log(`   Survey responses: ${report.metrics.surveyResponses}`);
  console.log(`   Existing feedback: ${report.metrics.hasExistingFeedback ? 'Yes' : 'No'}`);
  console.log(`   Word count: ${report.metrics.wordCount}`);

  if (violations.length > 0) {
    console.error(`\n❌ PM Gate 1 BLOCKED: ${violations.length} violation(s):\n`);
    violations.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  }

  console.log(`\n✅ PM Gate 1 PASSED: User research documentation meets requirements`);
  process.exit(0);
}

main();
