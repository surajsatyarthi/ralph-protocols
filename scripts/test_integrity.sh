#!/bin/bash

echo "🕵️‍♂️ TESTING INTEGRITY SYSTEM (V-007 Mitigation) 🕵️‍♂️"

# 1. Modify a script (Tamper)
echo "[1] Tampering with verify-gate-1.js..."
cp scripts/verify-gate-1.js scripts/verify-gate-1.js.backup
echo "// hacked" >> scripts/verify-gate-1.js

# 2. Run Integrity Check
echo "[2] Running Integrity Check..."
node scripts/verify-integrity.js
EXIT_CODE=$?

# 3. Restore
mv scripts/verify-gate-1.js.backup scripts/verify-gate-1.js

if [ $EXIT_CODE -ne 0 ]; then
    echo "✅ SUCCESS: Tampering detected. System locked down."
else
    echo "❌ FAILURE: Tampering went unnoticed."
fi
