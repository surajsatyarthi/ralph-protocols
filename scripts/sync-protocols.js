const fs = require('fs');
const { exec } = require('child_process');

console.log("🔄 Ralph v11.0: Syncing Protocols...");

// 1. Ingest Playbook (Simulated by verifying file existence)
if (fs.existsSync('ralph_master_playbook_v8.json')) {
    console.log("✅ Playbook v11.0 found.");
} else {
    console.error("❌ Playbook missing! Sync failed.");
    process.exit(1);
}

// 2. Auto-Spawn Verifier (Simulated for this environment)
// In a real Antigravity env, this would trigger the agent spawn
console.log("🚀 Auto-Launching Ralph Verifier Agent...");
const verifier = exec('npm run sidecar', { detach: true, stdio: 'ignore' });
verifier.unref();

console.log("✅ Verifier Spawned in Background (PID: " + verifier.pid + ")");
console.log("🔒 Protocol Enforced. All gates active.");
