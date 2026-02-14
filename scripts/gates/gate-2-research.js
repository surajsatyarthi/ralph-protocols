#!/usr/bin/env node

/**
 * Gate 2: External Research Validation
 * Ensures proper external research was conducted with documented web searches
 * BLOCKS: Missing research, insufficient sources, no alternatives considered
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = process.cwd();
const RESEARCH_DIR = path.join(WORKSPACE_ROOT, 'docs/research');

function main() {
  const entryId = process.argv[2];
  
  if (!entryId || !entryId.match(/ENTRY-\d{3}/)) {
    console.error('❌ Usage: npm run verify:gate-2 -- ENTRY-XXX');
    process.exit(1);
  }

  console.log(`\n🔍 Gate 2: Research Validation for ${entryId}\n`);

  const researchPath = path.join(RESEARCH_DIR, `${entryId}-research.md`);
  
  if (!fs.existsSync(researchPath)) {
    console.error(`❌ Research document not found: ${researchPath}`);
    console.error(`\nExpected location: docs/research/${entryId}-research.md`);
    process.exit(1);
  }

  const content = fs.readFileSync(researchPath, 'utf-8');
  const violations = [];

  // Validation 1: Minimum 3 web searches documented
  console.log('📝 Checking for documented searches...');
  const searches = content.match(/##\s+Search\s+#\d+/gi) || [];
  if (searches.length < 3) {
    violations.push(`Only ${searches.length} searches documented (need 3+)`);
  }

  // Validation 2: Minimum 5 sources cited
  console.log('📚 Checking source citations...');
  const sources = content.match(/Source:\s*\[.+?\]\(.+?\)/gi) || [];
  if (sources.length < 5) {
    violations.push(`Only ${sources.length} sources cited (need 5+)`);
  }

  // Validation 3: Alternatives Considered section
  console.log('🔀 Checking for alternatives...');
  if (!content.match(/Alternatives?\s+Considered/i)) {
    violations.push('No "Alternatives Considered" section found');
  }

  // Validation 4: Minimum word count
  console.log('📏 Checking word count...');
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const minWords = 1000;
  if (wordCount < minWords) {
    violations.push(`Only ${wordCount} words (need ${minWords}+)`);
  }

  // Validation 5: External links (not just citations)
  console.log('🔗 Checking external links...');
  const externalLinks = content.match(/https?:\/\/[^\s)]+/g) || [];
  if (externalLinks.length < 3) {
    violations.push(`Only ${externalLinks.length} external links (need 3+)`);
  }

  // Validation 6: Key findings documented
  console.log('🔑 Checking for key findings...');
  const keyFindings = content.match(/Key Finding/gi) || [];
  if (keyFindings.length === 0) {
    violations.push('No key findings documented');
  }

  // Generate report
  const report = {
    entry: entryId,
    timestamp: new Date().toISOString(),
    researchPath: path.relative(WORKSPACE_ROOT, researchPath),
    metrics: {
      searches: searches.length,
      sources: sources.length,
      wordCount,
      externalLinks: externalLinks.length,
      keyFindings: keyFindings.length,
      hasAlternatives: content.match(/Alternatives?\s+Considered/i) !== null
    },
    violations
  };

  console.log(`\n📊 Research Metrics:`);
  console.log(`   Searches documented: ${report.metrics.searches}`);
  console.log(`   Sources cited: ${report.metrics.sources}`);
  console.log(`   Word count: ${report.metrics.wordCount}`);
  console.log(`   External links: ${report.metrics.externalLinks}`);
  console.log(`   Key findings: ${report.metrics.keyFindings}`);

  if (violations.length > 0) {
    console.error(`\n❌ Gate 2 BLOCKED: ${violations.length} violation(s):\n`);
    violations.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  }

  console.log('\n✅ Gate 2 PASSED: Research documentation meets requirements');
  process.exit(0);
}

main();
