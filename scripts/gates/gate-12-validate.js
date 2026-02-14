#!/usr/bin/env node

/**
 * Gate 12: Documentation Completeness Validation
 * Ensures Gate 12 docs are not just templates but have real content
 * BLOCKS: Empty templates, TODO placeholders, insufficient word counts
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = process.cwd();
const GATE_12_DIR = path.join(WORKSPACE_ROOT, 'docs/implementation/gate-12');

function main() {
  const entryId = process.argv[2];
  
  if (!entryId || !entryId.match(/ENTRY-\d{3}/)) {
    console.error('❌ Usage: npm run verify:gate-12 -- ENTRY-XXX');
    process.exit(1);
  }

  console.log(`\n📚 Gate 12: Documentation Validation for ${entryId}\n`);

  const docPath = path.join(GATE_12_DIR, `${entryId}-gate-12.md`);
  
  if (!fs.existsSync(docPath)) {
    console.error(`❌ Gate 12 documentation not found: ${docPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(docPath, 'utf-8');
  const violations = [];

  // Validation 1: No TODO/TBD placeholders
  console.log('🔍 Checking for placeholders...');
  const placeholders = content.match(/TODO|TBD|FIXME|XXX|PLACEHOLDER/gi) || [];
  if (placeholders.length > 0) {
    violations.push(`${placeholders.length} TODO/TBD placeholders found`);
  }

  // Validation 2: Minimum word count per section
  console.log('📝 Checking word counts...');
  const sections = extractSections(content);
  const minWordsPerSection = 200;
  
  sections.forEach(section => {
    const words = section.content.split(/\s+/).filter(Boolean).length;
    if (words < minWordsPerSection) {
      violations.push(`Section "${section.title}" only has ${words} words (need ${minWordsPerSection})`);
    }
  });

  // Validation 3: At least 1 code snippet
  console.log('💻 Checking for code snippets...');
  const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
  if (codeBlocks.length < 1) {
    violations.push('No code snippets found (need at least 1)');
  }

  // Validation 4: At least 2 file path references
  console.log('📁 Checking file path references...');
  const filePaths = content.match(/`[^`]*\.(ts|js|tsx|jsx|md|json)`/g) || [];
  if (filePaths.length < 2) {
    violations.push(`Only ${filePaths.length} file path reference(s) (need at least 2)`);
  }

  // Validation 5: Test results section with numbers
  console.log('🧪 Checking test results...');
  if (!content.includes('Test Results') && !content.includes('Testing')) {
    violations.push('No test results section found');
  } else {
    const hasNumbers = /\d+\s+(tests?|passed|failed|coverage|assertions?)/i.test(content);
    if (!hasNumbers) {
      violations.push('Test results section has no actual numbers');
    }
  }

  // Validation 6: Implementation details section
  console.log('⚙️  Checking implementation details...');
  if (!content.includes('Implementation') && !content.includes('Changes Made')) {
    violations.push('No implementation details section found');
  }

  // Generate report
  const report = {
    entry: entryId,
    timestamp: new Date().toISOString(),
    docPath: path.relative(WORKSPACE_ROOT, docPath),
    fileSize: fs.statSync(docPath).size,
    totalWords: content.split(/\s+/).filter(Boolean).length,
    totalSections: sections.length,
    codeBlocks: codeBlocks.length,
    fileReferences: filePaths.length,
    violations: violations
  };

  console.log(`\n📊 Documentation Stats:`);
  console.log(`   Total words: ${report.totalWords}`);
  console.log(`   Total sections: ${report.totalSections}`);
  console.log(`   Code blocks: ${report.codeBlocks}`);
  console.log(`   File references: ${report.fileReferences}`);

  if (violations.length > 0) {
    console.error(`\n❌ Gate 12 BLOCKED: ${violations.length} violation(s):\n`);
    violations.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  }

  console.log('\n✅ Gate 12 PASSED: Documentation meets quality standards');
  process.exit(0);
}

function extractSections(content) {
  const sections = [];
  const lines = content.split('\n');
  let currentSection = null;

  lines.forEach(line => {
    // Match h2 or h3 headers
    const headerMatch = line.match(/^##\s+(.+)$/);
    if (headerMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: headerMatch[1],
        content: ''
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

main();
