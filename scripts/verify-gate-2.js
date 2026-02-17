const fs = require('fs');
const path = require('path');

// Colors
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
};

const TASK_ID = process.argv[2] || 'ENTRY-UNKNOWN';
const PLAN_FILE = `implementation-plan-${TASK_ID}.md`;

console.log(`${colors.yellow}🔍 Ralph Sidecar: Verifying Gate 2 (Plan) for ${TASK_ID}...${colors.reset}`);

// 1. Check existence
if (!fs.existsSync(PLAN_FILE)) {
    console.error(`${colors.red}❌ BLOCKED: No implementation plan found (${PLAN_FILE})${colors.reset}`);
    process.exit(1);
}

const content = fs.readFileSync(PLAN_FILE, 'utf8');

// 2. Check for "Alternatives Considered" (Anti-Lazy Rule)
if (!content.includes('Alternatives Considered')) {
    console.error(`${colors.red}❌ BLOCKED: Plan missing 'Alternatives Considered' section.${colors.reset}`);
    console.error('   Rule: You must document what you are NOT building and why.');
    process.exit(1);
}

// 3. Check for Approval Signature
// Strict Regex: "Approved by: [Name]" or "Status: APPROVED"
const approvalRegex = /(Approved by:|Status:\s*APPROVED)/i;
if (!approvalRegex.test(content)) {
    console.error(`${colors.red}❌ BLOCKED: Plan not approved.${colors.reset}`);
    console.error('   Required: CEO/PM must sign off with "Approved by: [Name]" or "Status: APPROVED"');
    process.exit(1);
}

console.log(`${colors.green}🏆 Gate 2 PASSED: Plan approved.${colors.reset}`);
process.exit(0);
