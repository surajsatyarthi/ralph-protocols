const fs = require('fs');
const colors = { red: '\x1b[31m', green: '\x1b[32m', reset: '\x1b[0m' };
const TASK_ID = process.argv[2] || 'ENTRY-UNKNOWN';
const LOG = `audit-gate-0-dupe-check.log`;

const { execSync } = require('child_process');

if (!fs.existsSync(LOG)) {
    console.error(`${colors.red}❌ G0 BLOCKED: No dupe-check audit log found.${colors.reset}`);
    process.exit(1);
}

// Run Semantic Check (V-008 Fix)
try {
    execSync(`node scripts/verify-semantic.js "${LOG}"`, { stdio: 'pipe' });
} catch (e) {
    console.error(`${colors.red}❌ G0 FAILED: Semantic Quality Check Failed.${colors.reset}`);
    process.exit(1);
}

// Forensic check: must contain "No duplicates found" or similar affirmation
const content = fs.readFileSync(LOG, 'utf8');
if (!/No duplicates|Unique feature|No overlap/i.test(content)) {
    console.error(`${colors.red}❌ G0 FAILED: Audit does not confirm uniqueness.${colors.reset}`);
    process.exit(1);
}
console.log(`${colors.green}✅ G0 PASSED: Dupe check verified.${colors.reset}`);
