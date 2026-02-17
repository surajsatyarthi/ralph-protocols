const fs = require('fs');
const colors = { red: '\x1b[31m', green: '\x1b[32m', reset: '\x1b[0m' };
const TASK_ID = process.argv[2] || 'ENTRY-UNKNOWN';
const REPORT = `.ralph/${TASK_ID}-completion-report.md`;
const LEDGER = `PROJECT_LEDGER.md`;

if (!fs.existsSync(REPORT)) {
    console.error(`${colors.red}❌ G12 FAILED: No completion report (${REPORT}).${colors.reset}`);
    process.exit(1);
}

if (fs.existsSync(LEDGER)) {
    const ledgerContent = fs.readFileSync(LEDGER, 'utf8');
    if (!ledgerContent.includes(TASK_ID) || !ledgerContent.includes("DONE")) {
         console.error(`${colors.red}❌ G12 FAILED: Ledger not updated to DONE.${colors.reset}`);
         process.exit(1);
    }
}

console.log(`${colors.green}✅ G12 PASSED: Documentation verified.${colors.reset}`);
