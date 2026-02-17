const { execSync } = require('child_process');
const fs = require('fs');
const colors = { red: '\x1b[31m', green: '\x1b[32m', reset: '\x1b[0m' };

try {
    console.log("Running Tests...");
    execSync('npm test -- --coverage', { stdio: 'pipe' });
    
    // Forensic: Check coverage
    if (!fs.existsSync('coverage/coverage-final.json')) {
         throw new Error("No coverage report generated");
    }
    console.log(`${colors.green}✅ G6 PASSED: Tests passed with coverage.${colors.reset}`);
} catch (e) {
    console.error(`${colors.red}❌ G6 FAILED: Tests failed or no coverage.${colors.reset}`);
    process.exit(1);
}
