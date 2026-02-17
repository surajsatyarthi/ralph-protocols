const fs = require('fs');
const colors = { red: '\x1b[31m', green: '\x1b[32m', reset: '\x1b[0m' };
const REPORT = 'lighthouse-report.json';

if (!fs.existsSync(REPORT)) {
    console.error(`${colors.red}❌ G10 FAILED: No Lighthouse report found.${colors.reset}`);
    process.exit(1);
}

try {
    const data = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
    // Assuming JSON format from lighthouse-cli
    const score = data?.categories?.performance?.score * 100 || 0;
    
    if (score < 80) {
        console.error(`${colors.red}❌ G10 FAILED: Performance score ${score} < 80.${colors.reset}`);
        process.exit(1);
    }
    console.log(`${colors.green}✅ G10 PASSED: Deep Performance Score ${score}.${colors.reset}`);

} catch (e) {
    console.error(`${colors.red}❌ G10 FAILED: Invalid report format.${colors.reset}`);
    process.exit(1);
}
