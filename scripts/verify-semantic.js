const fs = require('fs');
const colors = { red: '\x1b[31m', green: '\x1b[32m', reset: '\x1b[0m' };

const FILE = process.argv[2];
const MIN_WORDS = 20;

if (!fs.existsSync(FILE)) {
    console.error(`${colors.red}❌ SEMANTIC FAIL: File missing (${FILE})${colors.reset}`);
    process.exit(1);
}

const content = fs.readFileSync(FILE, 'utf8');
const words = content.split(/\s+/).length;

// 1. Length Check
if (words < MIN_WORDS) {
    console.error(`${colors.red}❌ SEMANTIC FAIL: Content too short (${words} words). Minimum ${MIN_WORDS}.${colors.reset}`);
    process.exit(1);
}

// 2. Anti-Garbage (Lorem Ipsum)
if (/lorem ipsum|random garbage/i.test(content)) {
    console.error(`${colors.red}❌ SEMANTIC FAIL: Placeholder text detected.${colors.reset}`);
    process.exit(1);
}

// 3. Structure Check (Markdown Headers)
// Real docs should have structure
if (FILE.endsWith('.md') && !/#\s/.test(content)) {
      console.error(`${colors.red}❌ SEMANTIC FAIL: No Markdown headers found. Formatting required.${colors.reset}`);
      process.exit(1); 
}

// 4. Entropy/Repetition (Simple check)
const uniqueWords = new Set(content.split(/\s+/)).size;
const varietyRatio = uniqueWords / words;
if (varietyRatio < 0.4) {
    console.error(`${colors.red}❌ SEMANTIC FAIL: Low vocabulary variety (${(varietyRatio*100).toFixed(0)}%). Looks like copy-paste/spam.${colors.reset}`);
    process.exit(1);
}

// console.log(`${colors.green}🧠 Semantic Checks Passed for ${FILE}${colors.reset}`);
process.exit(0);
