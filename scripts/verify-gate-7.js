const { execSync } = require('child_process');
const colors = { red: '\x1b[31m', green: '\x1b[32m', reset: '\x1b[0m' };

try {
    console.log("Running Security Scan...");
    // Fallback if generic security command missing
    execSync('npm audit --audit-level=high', { stdio: 'pipe' });
    console.log(`${colors.green}✅ G7 PASSED: No high/critical vulns.${colors.reset}`);
} catch (e) {
    console.error(`${colors.red}❌ G7 FAILED: Security vulnerabilities found.${colors.reset}`);
    process.exit(1);
}
