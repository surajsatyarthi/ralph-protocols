const fs = require('fs');
const crypto = require('crypto');
const colors = { red: '\x1b[31m', green: '\x1b[32m', blue: '\x1b[34m', reset: '\x1b[0m' };

const MANIFEST_PATH = 'integrity-manifest.json';

console.log(`${colors.blue}🛡️  Ralph Integrity System v10.2: Verifying System Core...${colors.reset}`);

if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`${colors.red}🚨 CRITICAL ERROR: Integrity Manifest missing! System compromised.${colors.reset}`);
    process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
let failed = false;

Object.keys(manifest.scripts).forEach(file => {
    if (!fs.existsSync(file)) {
        console.error(`${colors.red}❌ MISSING: ${file}${colors.reset}`);
        failed = true;
        return;
    }

    const fileBuffer = fs.readFileSync(file);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const hex = hashSum.digest('hex');

    if (hex !== manifest.scripts[file]) {
        console.error(`${colors.red}🚨 TAMPERING DETECTED: ${file}${colors.reset}`);
        console.error(`   Expected: ${manifest.scripts[file]}`);
        console.error(`   Found:    ${hex}`);
        failed = true;
    } else {
        // console.log(`${colors.green}✅ OK: ${file}${colors.reset}`);
    }
});

if (failed) {
    console.error(`${colors.red}🛑 SYSTEM LOCKDOWN: Integrity checks failed. Sidecar will not start.${colors.reset}`);
    process.exit(1);
}

console.log(`${colors.green}🛡️  Integrity Verified. System Secure.${colors.reset}`);
process.exit(0);
