const fs = require('fs');
const colors = { red: '\x1b[31m', green: '\x1b[32m', reset: '\x1b[0m' };
const GATE = process.argv[2]; // e.g., PM-G1
const TASK_ID = process.argv[3] || 'ENTRY-UNKNOWN';

const REQUIREMENTS = {
    "PM-G1": { file: `pm-research-${TASK_ID}.log`, name: "User Research" },
    "PM-G2": { file: `prd-${TASK_ID}.md`, name: "Approved PRD", check: "APPROVED" },
    "PM-G3": { file: `feasibility-${TASK_ID}.log`, name: "Feasibility Audit" },
    "PM-G6": { file: `PROJECT_LEDGER.md`, name: "Atomic Ledger Approval", check: "APPROVED_FOR_DEPLOY" }
};

const req = REQUIREMENTS[GATE];
if (!req) {
    console.error(`Unknown PM Gate: ${GATE}`);
    process.exit(1);
}

const { execSync } = require('child_process');

if (!fs.existsSync(req.file)) {
    console.error(`${colors.red}❌ ${GATE} FAILED: Missing ${req.name} (${req.file}).${colors.reset}`);
    process.exit(1);
}

// Run Semantic Check (V-008 Fix)
try {
    execSync(`node scripts/verify-semantic.js "${req.file}"`, { stdio: 'pipe' });
} catch (e) {
    console.error(`${colors.red}❌ ${GATE} FAILED: Semantic Quality Check Failed.${colors.reset}`);
    // console.error(e.stderr.toString());
    process.exit(1);
}

if (req.check) {
    const content = fs.readFileSync(req.file, 'utf8');
    if (!content.includes(req.check)) {
        console.error(`${colors.red}❌ ${GATE} FAILED: File missing signature '${req.check}'.${colors.reset}`);
        process.exit(1);
    }
}

console.log(`${colors.green}✅ ${GATE} PASSED: ${req.name} verified.${colors.reset}`);
