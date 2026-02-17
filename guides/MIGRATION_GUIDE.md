# MIGRATION GUIDE - Old Protocols → Circular Enforcement v2.0
**For AI Coders and PMs**

**Date**: 2026-02-12
**Status**: MANDATORY (Old protocols removed)

---

## 🎯 WHAT IS HAPPENING

Your project protocols are being upgraded from **self-enforcement** (honor system) to **circular enforcement** (mechanical accountability).

### Why This Change?
**Problem**: Self-enforcement failed
- PM made recommendations without auditing codebase (recommended Stripe when PayPal/Razorpay existed)
- PM didn't document completed tasks (ledger out of sync)
- Coder coded without research (wasted effort)
- Coder submitted failing code (wasted PM review time)

**Solution**: Circular Enforcement
- PM assigns → **Coder blocks** if PM missing research/plan
- Coder submits → **PM blocks** if quality gates fail
- PM approves → **Coder blocks next task** if PM didn't document

**Result**: Neither PM nor Coder can bypass quality gates

---

## 📋 WHAT WILL BE REPLACED

### Old Files (Being Removed)
```
❌ .agent/PM_PROTOCOL.md (v1.0 or v2.0)
❌ .agent/RALPH_PROTOCOL.md (v5.0 or older)
❌ .agent/QA_PROTOCOL.md
❌ .agent/STANDING_ORDERS.md
❌ .agent/WORKFLOW.md
```

### New Files (Being Added)
```
✅ .agent/RALPH_PROTOCOL.md (v6.5) - 12 gates with sequential enforcement
✅ .agent/PM_PROTOCOL.md (v3.0) - 8 gates including Gate 8
✅ docs/CIRCULAR_ENFORCEMENT.md - Workflow documentation
✅ scripts/verify-pm-gates.js - Coder blocks PM
✅ scripts/verify-ralph-gates.js - PM blocks Coder
✅ scripts/verify-pm-documentation.js - Coder blocks next task
```

---

## 🚀 AUTOMATIC MIGRATION (Recommended)

### Option 1: Use Migration Script

```bash
# From ~/Desktop/alpha folder:
cd ~/Desktop/alpha

# Run migration (replace path with your project)
bash MIGRATE_PROJECT.sh /path/to/your-project

# What it does:
# 1. Removes old protocol files
# 2. Copies new circular enforcement files
# 3. Updates package.json with verification commands
# 4. Makes scripts executable
# 5. Updates PROJECT_LEDGER.md with state machine
# 6. Tests verification scripts
```

**The script will show you**:
- ✅ Files removed
- ✅ Files added
- ✅ package.json updated
- ✅ Verification tests passed

---

## 🛠️ MANUAL MIGRATION (If Script Fails)

### Step 1: Remove Old Files

```bash
cd /path/to/your-project

# Remove old protocols
rm -f .agent/PM_PROTOCOL.md \
      .agent/QA_PROTOCOL.md \
      .agent/RALPH_PROTOCOL.md \
      .agent/STANDING_ORDERS.md \
      .agent/WORKFLOW.md

echo "✅ Old protocols removed"
```

---

### Step 2: Copy New Files

```bash
# Create directories if needed
mkdir -p .agent scripts docs .ralph

# Copy new protocols
cp ~/Desktop/alpha/RALPH_PROTOCOL.md .agent/
cp ~/Desktop/alpha/PM_PROTOCOL.md .agent/
cp ~/Desktop/alpha/CIRCULAR_ENFORCEMENT.md docs/

# Copy verification scripts
cp ~/Desktop/alpha/verification-scripts/*.js scripts/
chmod +x scripts/verify-*.js

echo "✅ New files copied"
```

---

### Step 3: Update package.json

Add these to the `"scripts"` section:

```json
{
  "scripts": {
    "verify:pm-gates": "node scripts/verify-pm-gates.js",
    "verify:ralph-gates": "node scripts/verify-ralph-gates.js",
    "verify:pm-documentation": "node scripts/verify-pm-documentation.js",
    "verify:circular": "npm run verify:pm-gates && npm run verify:ralph-gates && npm run verify:pm-documentation"
  }
}
```

---

### Step 4: Update PROJECT_LEDGER.md

Add this section after the PURPOSE section:

```markdown
## 🔄 CIRCULAR ENFORCEMENT (Added 2026-02-12)

**Problem Solved**: PM had no mechanical enforcement (only self-discipline, which failed)
**Solution**: Coder and PM verify each other's work before task transitions

### Task Lifecycle State Machine

Every task must progress through these states:

| State | Owner | Required Artifacts | Verified By | Command |
|-------|-------|-------------------|-------------|---------|
| **PENDING** | PM | Task created in ledger | CEO | Manual |
| **RESEARCHED** | PM | `audit-gate-0-TASK_ID.log` | Coder | `npm run verify:pm-gates` |
| **PLANNED** | PM | `implementation-plan-TASK_ID.md` (approved) | Coder | `npm run verify:pm-gates` |
| **READY** | Coder | PM verification passed | PM | Manual |
| **IN_PROGRESS** | Coder | Development started | PM | Manual |
| **CODE_COMPLETE** | Coder | Code + tests passing | PM | `npm run verify:ralph-gates` |
| **DOCUMENTED** | PM | Completion report + docs updated | Coder | `npm run verify:pm-documentation` |
| **DONE** | Both | All verified | CEO | Manual |

### Enforcement Rules

1. **Coder blocks PM** if missing research/plan → Coder comments "🚫 BLOCKED" in ledger
2. **PM blocks Coder** if quality gates fail → PM comments "🚫 BLOCKED" in ledger
3. **Coder blocks next task** if PM didn't document previous task → Comments "🚫 BLOCKED - Gate 8"

**Documentation**: See [docs/CIRCULAR_ENFORCEMENT.md](docs/CIRCULAR_ENFORCEMENT.md)
```

---

### Step 5: Test Verification

```bash
# Test PM gate verification (should fail without artifacts - this is correct!)
npm run verify:pm-gates -- ENTRY-001

# Expected output:
# ❌ PM GATE VERIFICATION FAILED
# Missing: audit-gate-0-ENTRY-001.log
# Missing: implementation-plan-ENTRY-001.md

# This is CORRECT behavior - it's blocking because PM hasn't provided required artifacts
```

---

## 📖 WHAT YOU NEED TO LEARN

### For AI Coders

#### New Protocol: Ralph Protocol v6.5

**Read this file**: `.agent/RALPH_PROTOCOL.md`

**Key changes from old version**:

1. **Gate 2 is now MANDATORY** (was optional)
   - Must create `audit-gate-0-TASK_ID.log` with 3+ web searches
   - Cannot start coding without this
   - Pre-dev hook blocks `npm run dev` without research audit

2. **PM verification before starting**
   - Before accepting task, run: `npm run verify:pm-gates -- TASK_ID`
   - Exit 0 = PM provided research/plan → Proceed
   - Exit 1 = PM missing artifacts → Block in ledger

3. **Sequential execution enforced**
   - G1 → G2 (research) → G3 (plan) → G4 (code)
   - Cannot skip gates
   - Pre-commit hook rejects commits without research log

#### Your New Workflow

```
1. PM assigns TASK_ID
2. YOU RUN: npm run verify:pm-gates -- TASK_ID
3. Exit 1? → Comment in ledger: "🚫 BLOCKED - PM must provide research/plan"
4. Exit 0? → Create audit-gate-0-TASK_ID.log (3+ web searches)
5. Read PM's implementation-plan-TASK_ID.md
6. Code according to plan
7. Run build/lint/test (must pass)
8. Submit for PM approval
9. Wait for PM to run: npm run verify:ralph-gates -- TASK_ID
10. Exit 1? → Fix quality issues
11. Exit 0? → PM approves and documents (Gate 8)
12. Before next task, verify PM documented: npm run verify:pm-documentation -- PREVIOUS_TASK_ID
```

---

### For PMs

#### New Protocol: PM Protocol v3.0

**Read this file**: `.agent/PM_PROTOCOL.md`

**Key changes from old version**:

1. **Gate 8 is now MANDATORY** (NEW)
   - Must document EVERY completed task
   - Cannot assign next task until current task documented
   - Coder will block next task if Gate 8 not complete

2. **Coder verification before you assign**
   - Coder runs: `npm run verify:pm-gates -- TASK_ID`
   - Coder blocks if you didn't provide research/plan
   - Must create artifacts BEFORE assigning

3. **Ralph gate verification before approval**
   - You run: `npm run verify:ralph-gates -- TASK_ID`
   - Exit 0 = Approve → Must complete Gate 8
   - Exit 1 = Block → Coder must fix quality issues

#### Your New Workflow

```
1. Before assigning task:
   - Create audit-gate-0-TASK_ID.log (3+ web searches)
   - Create implementation-plan-TASK_ID.md (with alternatives)
   - Get CEO approval on plan

2. Assign task to coder
3. Coder verifies with: npm run verify:pm-gates -- TASK_ID
4. Coder implements
5. Coder submits for approval

6. YOU RUN: npm run verify:ralph-gates -- TASK_ID
7. Exit 1? → Comment in ledger: "🚫 BLOCKED - Fix build/lint/test errors"
8. Exit 0? → Approve

9. MANDATORY - Complete Gate 8:
   - Create .ralph/TASK_ID-completion-report.md
   - Update PROJECT_LEDGER.md status to DONE
   - Commit: "docs: document TASK_ID completion (Gate 8)"

10. Next task:
    - Coder verifies Gate 8 with: npm run verify:pm-documentation -- PREVIOUS_TASK_ID
    - Exit 1? → You must complete Gate 8
    - Exit 0? → Coder accepts next task
```

---

## 🎯 GATE 8 REQUIREMENTS (PMs ONLY)

After approving ANY coder work, you MUST create:

### 1. Completion Report

File: `.ralph/TASK_ID-completion-report.md`

```markdown
# Completion Report - [TASK_ID]

**Task**: [Title]
**Started**: [Timestamp]
**Completed**: [Timestamp]
**Time Taken**: [Actual vs Estimated]
**Git Hash**: [Commit hash]

## What Was Built
- Feature 1
- Feature 2

## Errors Encountered
1. **Error**: [Description]
   **Fix**: [How it was resolved]
   **Time**: [How long it took]

## Lessons Learned
- Lesson 1
- Lesson 2

## Quality Gates
- ✅ Build: PASSED
- ✅ Lint: PASSED
- ✅ Tests: PASSED (coverage: XX%)

## Evidence
- Commit: [git hash]
```

### 2. Update Ledger

In `PROJECT_LEDGER.md`, change task status:

```markdown
### [ENTRY-XXX] TASK | DONE | [timestamp] | Coder | [git_hash]
**Status**: DONE
**Evidence**: `.ralph/ENTRY-XXX-completion-report.md`
**Completion Date**: [timestamp]
```

### 3. Commit Documentation

```bash
git add .ralph/TASK_ID-completion-report.md PROJECT_LEDGER.md
git commit -m "docs: document TASK_ID completion (Gate 8)"
```

---

## ✅ VERIFICATION CHECKLIST

After migration, verify:

- [ ] Old protocol files removed from `.agent/`
- [ ] New protocol files in `.agent/` (RALPH v6.5, PM v3.0)
- [ ] Circular enforcement docs in `docs/`
- [ ] 3 verification scripts in `scripts/` (executable)
- [ ] package.json has 4 new npm commands
- [ ] PROJECT_LEDGER.md has state machine section
- [ ] `npm run verify:pm-gates -- ENTRY-001` fails (correct!)
- [ ] `npm run verify:ralph-gates -- ENTRY-001` runs
- [ ] `npm run verify:pm-documentation -- ENTRY-001` runs
- [ ] Read your new protocol file (RALPH or PM)
- [ ] Understand your new workflow
- [ ] Know when to run verification commands

---

## 🚨 COMMON QUESTIONS

**Q: Can I keep using the old protocols?**
A: No. Old protocols removed from alpha folder. All projects must migrate.

**Q: What if I'm in the middle of a task?**
A: Finish current task with old workflow. Migrate before starting next task.

**Q: Will this slow me down?**
A: No. It prevents wasted effort:
  - Coder won't code without PM research (saves rework)
  - PM won't review failing code (saves review time)
  - PM must document (keeps ledger accurate)

**Q: What if verification script fails?**
A: Read the error output - it tells you exactly what's missing.

**Q: Can I modify verification scripts?**
A: Yes, but preserve the core checks. See CIRCULAR_ENFORCEMENT_SETUP.md.

**Q: What if I disagree with blocking?**
A: Escalate to CEO. Scripts enforce minimum quality standards.

---

## 📞 SUPPORT

**Issue**: Migration script fails
**Solution**: Try manual migration steps above

**Issue**: Verification script not found
**Solution**: Run `chmod +x scripts/verify-*.js`

**Issue**: Don't understand new workflow
**Solution**: Read docs/CIRCULAR_ENFORCEMENT.md (complete workflow guide)

**Issue**: Blocked but think I shouldn't be
**Solution**: Read error output - shows exactly what's missing

---

## 🎓 TRAINING MATERIALS

After migration, read these files from your project:

### For AI Coders
1. `.agent/RALPH_PROTOCOL.md` (12 gates)
2. `docs/CIRCULAR_ENFORCEMENT.md` (workflow)
3. Gate 2 section (3+ web searches MANDATORY)

### For PMs
1. `.agent/PM_PROTOCOL.md` (8 gates)
2. `docs/CIRCULAR_ENFORCEMENT.md` (workflow)
3. Gate 8 section (documentation MANDATORY)

---

**Migration Status**: Ready
**Migration Script**: `~/Desktop/alpha/MIGRATE_PROJECT.sh`
**Support**: See CIRCULAR_ENFORCEMENT_SETUP.md for detailed troubleshooting
