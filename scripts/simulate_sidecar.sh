#!/bin/bash

# Simulation: The Lazy Developer vs Ralph Sidecar
# Objective: Prove that the Sidecar blocks progress until gates are met.

TASK_ID="ENTRY-DEMO"
LOG_FILE="audit-gate-0-${TASK_ID}.log"
PLAN_FILE="implementation-plan-${TASK_ID}.md"

echo "🎭 Starting Simulation: The Lazy Developer 🎭"

# Clean up previous run
rm -f $LOG_FILE $PLAN_FILE

# Step 1: Attempt to Code Immediately (Lazy Mode)
echo "\n--- [Step 1] Lazy Developer tries to code ---"
echo "Check G1 status:"
node scripts/verify-gate-1.js $TASK_ID
if [ $? -eq 1 ]; then
    echo "🔒 BLOCKED as expected. Sidecar says: 'No Research'."
else
    echo "🚨 FAILURE: Sidecar let the lazy developer through!"
fi

# Step 2: Developer fakes research (Bad Content)
echo "\n--- [Step 2] Developer creates empty research log ---"
echo "Found nothing" > $LOG_FILE
node scripts/verify-gate-1.js $TASK_ID
if [ $? -eq 1 ]; then
    echo "🔒 BLOCKED as expected. Sidecar says: 'Research Insufficient'."
else
    echo "🚨 FAILURE: Sidecar accepted bad research!"
fi

# Step 3: Developer does Real Research
echo "\n--- [Step 3] Developer does proper research ---"
cat <<EOF > $LOG_FILE
Research Log for $TASK_ID
Search 1: https://google.com/search?q=best+practices
Search 2: https://stackoverflow.com/questions/123
Search 3: https://github.com/example/repo
Dependency Analysis: Verified package.json
Edge Cases: Network failure handling
EOF
echo "Created valid log."
node scripts/verify-gate-1.js $TASK_ID
if [ $? -eq 0 ]; then
    echo "🔓 UNLOCKED! G1 Passed."
else
    echo "🚨 FAILURE: Sidecar blocked valid research!"
fi

# Step 4: Developer tries to skip Plan (G2)
echo "\n--- [Step 4] Developer tries to code without Plan ---"
node scripts/verify-gate-2.js $TASK_ID
if [ $? -eq 1 ]; then
    echo "🔒 BLOCKED as expected. Sidecar says: 'No Plan'."
fi

# Step 5: Developer creates valid Plan
echo "\n--- [Step 5] Developer creates Approved Plan ---"
cat <<EOF > $PLAN_FILE
# Implementation Plan
## Alternatives Considered
- Option A: Bad
- Option B: Good

## Status: APPROVED
EOF
echo "Created valid plan."
node scripts/verify-gate-2.js $TASK_ID
if [ $? -eq 0 ]; then
    echo "🔓 UNLOCKED! G2 Passed."
else
    echo "🚨 FAILURE: Sidecar blocked valid plan!"
fi

echo "\n🏆 SIMULATION COMPLETE. Sidecar enforced sequential order."
