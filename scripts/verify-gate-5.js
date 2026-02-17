const { execSync } = require('child_process');
const colors = { red: '\x1b[31m', green: '\x1b[32m', reset: '\x1b[0m' };

try {
    console.log("Running Lint...");
    execSync('npm run lint', { stdio: 'pipe' });
    console.log(`${colors.green}✅ G5 PASSED: Lint clean.${colors.reset}`);
} catch (e) {
    console.error(`${colors.red}❌ G5 FAILED: Lint errors detected.${colors.reset}`);
    // console.error(e.stderr.toString()); // Optional: show errors
    process.exit(1);
}
