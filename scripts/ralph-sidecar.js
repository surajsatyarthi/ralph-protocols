const { execSync } = require('child_process');
const colors = { red: '\x1b[31m', green: '\x1b[32m', blue: '\x1b[34m', reset: '\x1b[0m' };

const TASK_ID = process.argv[2] || process.env.TASK_ID || 'ENTRY-UNKNOWN';
console.log(`${colors.blue}🦅 Ralph Sidecar v12.0 (Helper) Watching: ${TASK_ID}${colors.reset}`);
console.log(`${colors.blue}ℹ️  Real-time feedback enabled. Final verification will be SERVER-SIDE.${colors.reset}`);

// The Unbroken Chain
const CHAIN = [
    { script: `node scripts/verify-integrity.js`, name: "🔥 INTEGRITY CHECK (Anti-Tamper)" },
    { script: `node scripts/verify-pm-gate.js PM-G1 ${TASK_ID}`, name: "PM-G1 (User Research)" },
    { script: `node scripts/verify-pm-gate.js PM-G2 ${TASK_ID}`, name: "PM-G2 (PRD)" },
    { script: `node scripts/verify-pm-gate.js PM-G3 ${TASK_ID}`, name: "PM-G3 (Feasibility)" },
    { script: `node scripts/verify-gate-0.js ${TASK_ID}`, name: "G0 (Dupe Check)" },
    { script: `node scripts/verify-gate-1.js ${TASK_ID}`, name: "G1 (Repo/Env)" }, // Assuming G1 logic same as research
    { script: `node scripts/verify-gate-2.js ${TASK_ID}`, name: "G2 (Tech Plan)" },
    // G3 is Code Access - implicit if G2 passes
    { script: `node scripts/verify-gate-5.js`, name: "G5 (Lint)" }, // Continuous
    { script: `node scripts/verify-gate-6.js`, name: "G6 (Tests)" }, // Continuous
    { script: `node scripts/verify-gate-7.js`, name: "G7 (Security)" },
    { script: `node scripts/verify-gate-12.js ${TASK_ID}`, name: "G12 (Docs)" },
    { script: `node scripts/verify-pm-gate.js PM-G6 ${TASK_ID}`, name: "PM-G6 (Final Approval)" }
];

let lastPassedIndex = -1;

setInterval(() => {
    // console.clear(); // Optional: Keep terminal clean
    console.log(`\n--- Verification Cycle (${new Date().toLocaleTimeString()}) ---`);
    
    for (let i = 0; i < CHAIN.length; i++) {
        const step = CHAIN[i];
        
        // You cannot attempt Step N if Step N-1 failed
        if (i > lastPassedIndex + 1) {
            console.log(`${colors.red}🔒 LOCKED: ${step.name} (Complete previous steps first)${colors.reset}`);
            break; 
        }

        try {
            execSync(step.script, { stdio: 'ignore' });
            console.log(`${colors.green}✅ ${step.name} PASSED${colors.reset}`);
            if (i > lastPassedIndex) lastPassedIndex = i; // Unlock next level
        } catch (e) {
            console.log(`${colors.red}🛑 BLOCKED: ${step.name} FAILED${colors.reset}`);
            // If a previously passed gate fails now (e.g. Broken Lint), the chain breaks here
            lastPassedIndex = i - 1; 
            break; // Stop checking further
        }
    }
}, 5000); // Check every 5s
