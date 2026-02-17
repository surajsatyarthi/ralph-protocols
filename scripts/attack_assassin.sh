#!/bin/bash

echo "🕵️‍♂️ ATTACK VECTOR 2: The Assassin (Process Kill)"

# 1. Start the Sidecar (Normal Ops)
nohup node scripts/ralph-sidecar.js > /dev/null 2>&1 &
PID=$!
echo "ℹ️  Sidecar started with PID: $PID"
sleep 2

# 2. The Attack
echo "[!] KILLING PID $PID..."
kill -9 $PID

# 3. Check for Resurrection
sleep 2
if ps -p $PID > /dev/null; then
   echo "🛡️ FAILED: Sidecar is immortal."
else
   echo "🔓 BREAK SUCCESSFUL: Sidecar is dead. No resurrection mechanism found."
fi
