#!/bin/bash

echo "🕵️‍♂️ ATTACK VECTOR 1: The Silencer (Hook Bypass)"

# v11.0 relies on 'postinstall' to spawn the Verifier.
# If I run strict npm install, it launches.
# But if I am a malicious dev...

echo "[!] Running: npm install --ignore-scripts"
# Simulating the command execution
echo "✅ dependency installation complete."
echo "❌ POSTINSTALL SKIPPED."
echo "❌ VERIFIER NOT SPAWNED."

# Verify if Sidecar is running
pgrep -f "ralph-sidecar.js" > /dev/null
if [ $? -ne 0 ]; then
    echo "🔓 BREAK SUCCESSFUL: The Police never arrived."
else
    echo "🛡️ FAILED: Verification is running."
fi
