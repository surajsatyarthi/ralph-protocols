#!/bin/bash

# STRESS TEST: v10.1 Sidecar "The Ghost Writer"
# Objective: Generate "Valid-Looking" but Fake Artifacts to fool Regex checks.

echo "🚨 STARTING BREAK ATTEMPT: The Ghost Writer 🚨"
TASK_ID="ENTRY-BREAK-2"

# 1. Attack G0 (Dupe Check)
# Requirement: Log file with "No duplicates found"
echo "[1] Forging G0 Artifact..."
echo "Random garbage text... No duplicates found ... more garbage" > audit-gate-0-dupe-check.log
node scripts/verify-gate-0.js $TASK_ID
if [ $? -eq 0 ]; then
    echo "🔓 G0 BYPASSED. Sidecar accepted fake log."
fi

# 2. Attack PM-G2 (PRD Approval)
# Requirement: File with "APPROVED"
echo "[2] Forging PM-G2 Artifact..."
echo "This is a fake PRD. Status: APPROVED" > prd-${TASK_ID}.md
node scripts/verify-pm-gate.js PM-G2 $TASK_ID
if [ $? -eq 0 ]; then
    echo "🔓 PM-G2 BYPASSED. Sidecar accepted fake PRD."
fi

# 3. Attack PM-G3 (Feasibility)
# Requirement: File existence
echo "[3] Forging PM-G3 Artifact..."
touch feasibility-${TASK_ID}.log
node scripts/verify-pm-gate.js PM-G3 $TASK_ID
if [ $? -eq 0 ]; then
    echo "🔓 PM-G3 BYPASSED. Sidecar accepted empty file."
fi

echo "CRITICAL VULNERABILITY: Sidecar checks SYNTAX (Regex) not SEMANTICS (Meaning)."
