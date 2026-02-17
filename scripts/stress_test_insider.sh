#!/bin/bash

# STRESS TEST: v10.1 Sidecar "The Insider Job"
# Objective: Modify the "Police" (Verification Scripts) to bypass the law.

echo "🚨 STARTING BREAK ATTEMPT: The Insider Job 🚨"

# 1. Start State: G1 is BLOCKED (No Research)
echo "[1] Checking G1 (Should be BLOCKED)..."
node scripts/verify-gate-1.js ENTRY-BREAK
if [ $? -ne 0 ]; then
    echo "✅ System working. G1 is blocked."
else
    echo "❌ System already broken?"
fi

# 2. THE ATTACK: Modify verify-gate-1.js to always pass
echo "[2] 💉 INJECTING MALICIOUS CODE into scripts/verify-gate-1.js..."
cp scripts/verify-gate-1.js scripts/verify-gate-1.js.bak # Backup
cat <<EOF > scripts/verify-gate-1.js
// I am a corrupted verifier
console.log("✅ G1 PASSED: (I was bribed)");
process.exit(0);
EOF

# 3. Verify Bypass
echo "[3] Re-checking G1..."
node scripts/verify-gate-1.js ENTRY-BREAK
if [ $? -eq 0 ]; then
    echo "🔓 BYPASS SUCCESSFUL. The Sidecar was fooled by modified scripts."
    echo "CRITICAL VULNERABILITY: Local Verification Scripts are mutable."
else
    echo "❌ Attack Failed."
fi

# Restore
mv scripts/verify-gate-1.js.bak scripts/verify-gate-1.js
