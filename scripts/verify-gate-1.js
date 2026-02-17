const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
};

const TASK_ID = process.argv[2] || 'ENTRY-UNKNOWN';
const LOG_FILE = `audit-gate-0-${TASK_ID}.log`;

console.log(`${colors.yellow}🔍 Ralph Sidecar: Verifying Gate 1 (Research) for ${TASK_ID}...${colors.reset}`);

// 1. Check if file exists
if (!fs.existsSync(LOG_FILE)) {
    console.error(`${colors.red}❌ BLOCKED: No research audit log found (${LOG_FILE})${colors.reset}`);
    console.error('   Required: You must complete research and create the audit log.');
    process.exit(1);
}

// 2. Read content
const content = fs.readFileSync(LOG_FILE, 'utf8');

// 3. Forensic Analysis: Must look like real research
const checks = [
    { name: "Web Searches", regex: /http(s)?:\/\//g, min: 3 },
    { name: "Dependency Analysis", regex: /dependency|package/i, min: 1 },
    { name: "Edge Cases", regex: /edge case|risk/i, min: 1 }
];

let failed = false;

checks.forEach(check => {
    const matches = (content.match(check.regex) || []).length;
    if (matches < check.min) {
        console.error(`${colors.red}❌ BLOCKED: Research log missing '${check.name}' (Found ${matches}, Need ${check.min})${colors.reset}`);
        failed = true;
    } else {
        console.log(`${colors.green}✅ ${check.name} verified (${matches} matches)${colors.reset}`);
    }
});

if (failed) {
    console.error(`${colors.red}🛑 Gate 1 FAILED: Research is insufficient.${colors.reset}`);
    process.exit(1);
}

console.log(`${colors.green}🏆 Gate 1 PASSED: Research verified.${colors.reset}`);
process.exit(0);
