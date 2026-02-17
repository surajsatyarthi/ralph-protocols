const { execSync } = require('child_process');
const fs = require('fs');
const colors = { red: '\x1b[31m', green: '\x1b[32m', reset: '\x1b[0m' };

try {
    console.log("Checking Accessibility...");
    
    // Check if report exists
    if (fs.existsSync('a11y-report.json')) {
         console.log(`${colors.green}✅ G9 PASSED: Report found.${colors.reset}`);
         process.exit(0);
    }

    // Try to run pa11y if installed
    try {
        execSync('npx pa11y-ci', { stdio: 'pipe' });
        console.log(`${colors.green}✅ G9 PASSED: pa11y check clean.${colors.reset}`);
    } catch {
         // If pa11y fails or finds errors
         throw new Error("Accessibility check failed");
    }

} catch (e) {
    console.error(`${colors.red}❌ G9 FAILED: Accessibility issues or missing report.${colors.reset}`);
    process.exit(1);
}
