#!/usr/bin/env node
/**
 * Protocol Validity Test
 * Validates the Ralph Protocol repository structure:
 * - Master playbook JSON is valid and has all 12 gates
 * - All scripts referenced in playbook exist on disk
 * - Required documentation files are present
 */

const fs = require('fs');
const path = require('path');

const PASS = '\x1b[32m✅ PASS\x1b[0m';
const FAIL = '\x1b[31m❌ FAIL\x1b[0m';

let allPassed = true;

function check(label, condition, detail) {
  if (condition) {
    console.log(`${PASS} ${label}`);
  } else {
    console.error(`${FAIL} ${label}${detail ? ': ' + detail : ''}`);
    allPassed = false;
  }
}

// 1. Validate master playbook JSON
console.log('\n--- [1] Master Playbook JSON ---');
let playbook;
try {
  playbook = JSON.parse(fs.readFileSync('ralph_master_playbook_v8.json', 'utf8'));
  check('Playbook is valid JSON', true);
} catch (e) {
  check('Playbook is valid JSON', false, e.message);
  process.exit(1);
}

// 2. Check all 12 gates are defined
console.log('\n--- [2] Gate Coverage ---');
const requiredGateIds = ['G0','G1','G2','G3','G4','G5','G6','G7','G8','G9','G10','G11','G12'];
const gates = playbook.gates && playbook.gates.technical ? playbook.gates.technical : [];
const gateIds = gates.map(g => g.id);

for (const gid of requiredGateIds) {
  check(`Gate ${gid} defined`, gateIds.includes(gid));
}

// 3. Check that scripts referenced in the playbook exist on disk
console.log('\n--- [3] Script References ---');
for (const gate of gates) {
  if (gate.script) {
    const scriptPath = gate.script;
    check(`${gate.id} script exists: ${scriptPath}`, fs.existsSync(scriptPath), `not found at ${scriptPath}`);
  }
}

// 4. Required documentation files
console.log('\n--- [4] Required Files ---');
const requiredFiles = [
  'ralph_master_playbook_v8.json',
  'protocols/RALPH_PROTOCOL.md',
  'protocols/CIRCULAR_ENFORCEMENT.md',
  'guides/AI_CODER_QUICK_REF.md',
  'PROJECT_LEDGER.md',
  'integrity-manifest.json',
  'scripts/verify-integrity.js',
  'scripts/setup-enforcement.sh',
];

for (const f of requiredFiles) {
  check(`Required file exists: ${f}`, fs.existsSync(f));
}

// 5. Validate all JSON files parse cleanly
console.log('\n--- [5] All JSON Files ---');
function walkJson(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkJson(fullPath);
    } else if (entry.name.endsWith('.json')) {
      try {
        JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        check(`Valid JSON: ${fullPath}`, true);
      } catch (e) {
        check(`Valid JSON: ${fullPath}`, false, e.message);
      }
    }
  }
}
walkJson('.');

// Summary
console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('\x1b[32m🛡️  All protocol validity checks passed.\x1b[0m');
  process.exit(0);
} else {
  console.error('\x1b[31m🚨 Protocol validity checks FAILED. Fix issues above.\x1b[0m');
  process.exit(1);
}
