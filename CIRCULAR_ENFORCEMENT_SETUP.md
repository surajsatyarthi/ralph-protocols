# CIRCULAR ENFORCEMENT SYSTEM - IMPLEMENTATION GUIDE
**Reusable PM ↔ Coder Accountability System for Any Project**

**Created**: 2026-02-12
**Status**: Production-Ready
**Version**: 1.0

---

## 📋 WHAT IS THIS?

A **mechanical enforcement system** that prevents both PM and Coder failures through mutual verification.

### The Problem It Solves
- ❌ PM makes recommendations without auditing codebase
- ❌ PM doesn't document completed tasks (Gate 8 violations)
- ❌ Coder codes without research/planning (Gate 2/G3 violations)
- ❌ Coder submits code with failing tests/build
- ❌ Self-discipline fails → Wasted time, rework, "lazy ass pmship"

### The Solution
**Neither PM nor Coder can bypass quality gates** - both agents block each other.

```
┌─────────────────────────────────────────┐
│  PM assigns task                        │
│  ↓ CODER BLOCKS if no research/plan    │
└─────────────────────────────────────────┘
           ▼
┌─────────────────────────────────────────┐
│  Coder implements                       │
│  ↓ PM BLOCKS if build/tests fail       │
└─────────────────────────────────────────┘
           ▼
┌─────────────────────────────────────────┐
│  PM approves work                       │
│  ↓ CODER BLOCKS next task if PM didn't │
│    document current task (Gate 8)      │
└─────────────────────────────────────────┘
```

**Result**: No single point of failure, mechanical accountability.

---

## 🚀 QUICK START (5 Minutes)

### 1. Copy Files to Your Project

```bash
# From your project root:
cp ~/Desktop/alpha/verification-scripts/*.js ./scripts/
cp ~/Desktop/alpha/RALPH_PROTOCOL.md ./.agent/
cp ~/Desktop/alpha/PM_PROTOCOL.md ./.agent/
cp ~/Desktop/alpha/CIRCULAR_ENFORCEMENT.md ./docs/
```

### 2. Add NPM Commands

Add to your `package.json`:

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

### 3. Make Scripts Executable

```bash
chmod +x scripts/verify-*.js
```

### 4. Test Verification

```bash
# Test PM gate verification (should fail if no research/plan exists)
npm run verify:pm-gates -- ENTRY-001

# Test Ralph gate verification (checks build/lint/test)
npm run verify:ralph-gates -- ENTRY-001

# Test PM documentation verification
npm run verify:pm-documentation -- ENTRY-001
```

---

## 📁 FILES IN THIS FOLDER

| File | Purpose | Size |
|------|---------|------|
| **RALPH_PROTOCOL.md** | 12 quality gates for coder (updated 2026-02-12) | 15KB |
| **PM_PROTOCOL.md** | 8 strategic gates for PM (includes Gate 8 accountability) | 18KB |
| **CIRCULAR_ENFORCEMENT.md** | Complete workflow documentation | 11KB |
| **verification-scripts/verify-pm-gates.js** | Coder blocks PM without research/plan | 4.3KB |
| **verification-scripts/verify-ralph-gates.js** | PM blocks coder without quality gates | 3.5KB |
| **verification-scripts/verify-pm-documentation.js** | Coder blocks next task if PM didn't document | 4.2KB |

**Total**: 56KB of mechanical enforcement infrastructure

---

## 🔄 HOW IT WORKS

### Task Lifecycle States

| State | Owner | Verified By | Command |
|-------|-------|-------------|---------|
| **PENDING** | PM | CEO | Manual |
| **RESEARCHED** | PM | Coder | `npm run verify:pm-gates -- TASK_ID` |
| **PLANNED** | PM | Coder | `npm run verify:pm-gates -- TASK_ID` |
| **READY** | Coder | PM | Manual |
| **IN_PROGRESS** | Coder | PM | Manual |
| **CODE_COMPLETE** | Coder | PM | `npm run verify:ralph-gates -- TASK_ID` |
| **DOCUMENTED** | PM | Coder | `npm run verify:pm-documentation -- TASK_ID` |
| **DONE** | Both | CEO | Manual |

### Verification Commands

| Command | Who Uses | When | Blocks What |
|---------|----------|------|-------------|
| `verify:pm-gates` | Coder | Before starting task | Task start (PM must provide research + plan) |
| `verify:ralph-gates` | PM | Before approving task | Task approval (Coder must fix quality issues) |
| `verify:pm-documentation` | Coder | Before starting next task | Next task start (PM must document current task) |

---

## 📖 IMPLEMENTATION STEPS (Full Setup)

### Step 1: Project Structure

Create these folders if they don't exist:

```bash
mkdir -p .agent scripts docs .ralph
```

### Step 2: Copy Protocol Files

```bash
# Core protocols
cp ~/Desktop/alpha/RALPH_PROTOCOL.md ./.agent/
cp ~/Desktop/alpha/PM_PROTOCOL.md ./.agent/
cp ~/Desktop/alpha/CIRCULAR_ENFORCEMENT.md ./docs/

# Verification scripts
cp ~/Desktop/alpha/verification-scripts/*.js ./scripts/
chmod +x scripts/verify-*.js
```

### Step 3: Update package.json

Add verification commands (see Quick Start section above).

### Step 4: Create PROJECT_LEDGER.md

Add circular enforcement section to your project ledger:

```markdown
## 🔄 CIRCULAR ENFORCEMENT

### Task Lifecycle States

Every task must progress through these states:

| State | Owner | Verified By | Command |
|-------|-------|-------------|---------|
| PENDING → RESEARCHED | PM | Coder | `npm run verify:pm-gates` |
| RESEARCHED → PLANNED | PM | Coder | `npm run verify:pm-gates` |
| PLANNED → CODE_COMPLETE | Coder | PM | `npm run verify:ralph-gates` |
| CODE_COMPLETE → DOCUMENTED | PM | Coder | `npm run verify:pm-documentation` |

### Enforcement Rules

1. **Coder blocks PM** if missing research/plan
2. **PM blocks Coder** if quality gates fail
3. **Coder blocks next task** if PM didn't document previous task
```

### Step 5: Train Your Team

**For Coder:**
- Before starting ANY task: Run `npm run verify:pm-gates -- TASK_ID`
- If exit code 1 → Comment BLOCKED in ledger
- If exit code 0 → Proceed with development

**For PM:**
- Before approving ANY task: Run `npm run verify:ralph-gates -- TASK_ID`
- If exit code 1 → Comment BLOCKED in ledger
- If exit code 0 → Approve and document (Gate 8)
- After approval: Create completion report, update ledger, commit docs

### Step 6: Test the System

```bash
# Create test task
echo "[ENTRY-001] TEST | PENDING | $(date -Iseconds) | PM | -" >> PROJECT_LEDGER.md

# Try to verify PM gates (should fail - no research/plan)
npm run verify:pm-gates -- ENTRY-001

# Expected output:
# ❌ PM GATE VERIFICATION FAILED
# Missing: audit-gate-0-ENTRY-001.log
# Missing: implementation-plan-ENTRY-001.md
```

If you see the above error, **the system is working** - it's blocking the coder because PM hasn't provided required artifacts.

---

## 🎯 PM DOCUMENTATION REQUIREMENTS (Gate 8)

After approving ANY coder work, PM MUST create these artifacts:

### 1. Completion Report

Create `.ralph/TASK_ID-completion-report.md`:

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

2. **Error**: [Description]
   **Fix**: [How it was resolved]
   **Time**: [How long it took]

## Lessons Learned
- Lesson 1
- Lesson 2

## Quality Gates
- ✅ Build: PASSED
- ✅ Lint: PASSED
- ✅ Tests: PASSED (coverage: XX%)
- ✅ Security: PASSED

## Evidence
- Commit: [git hash]
- Screenshots: [paths]
- Logs: [paths]
```

### 2. Update PROJECT_LEDGER.md

Change task status to DONE:

```markdown
### [ENTRY-XXX] TASK | DONE | [timestamp] | Coder | [git_hash]
**Status**: DONE
**Evidence**: `.ralph/ENTRY-XXX-completion-report.md`
**Completion Date**: [timestamp]
```

### 3. Commit Documentation

```bash
git add .ralph/ENTRY-XXX-completion-report.md PROJECT_LEDGER.md docs/
git commit -m "docs: document ENTRY-XXX completion (Gate 8)"
```

**Only then** can coder start next task.

---

## 🚨 COMMON SCENARIOS

### Scenario 1: PM Assigns Task Without Research

```bash
# PM: "Coder, start ENTRY-002"

# Coder runs:
$ npm run verify:pm-gates -- ENTRY-002

# Output:
❌ PM GATE VERIFICATION FAILED
Missing: audit-gate-0-ENTRY-002.log
Missing: implementation-plan-ENTRY-002.md

# Coder comments in ledger:
"🚫 BLOCKED - PM must provide research audit and implementation plan before I can start"
```

**PM must**:
1. Create `audit-gate-0-ENTRY-002.log` (3+ web searches)
2. Create `implementation-plan-ENTRY-002.md` (with alternatives + approval)
3. Get CEO approval on plan

**Only then** coder can start.

---

### Scenario 2: Coder Submits Code with Failing Tests

```bash
# Coder: "ENTRY-003 complete, requesting approval"

# PM runs:
$ npm run verify:ralph-gates -- ENTRY-003

# Output:
❌ RALPH GATE VERIFICATION FAILED
Tests failing: 2/10 tests
Build errors: 3 TypeScript errors

# PM comments in ledger:
"🚫 BLOCKED - Fix failing tests and TypeScript errors before approval"
```

**Coder must**:
1. Fix TypeScript errors
2. Fix failing tests
3. Re-run verification

**Only then** PM can approve.

---

### Scenario 3: PM Approves But Doesn't Document

```bash
# PM approved ENTRY-004, but didn't create completion report

# Coder tries to start ENTRY-005:
$ npm run verify:pm-documentation -- ENTRY-004

# Output:
❌ PM DOCUMENTATION VERIFICATION FAILED
Missing: .ralph/ENTRY-004-completion-report.md
PROJECT_LEDGER.md not updated to DONE

# Coder comments in ledger:
"🚫 BLOCKED - Cannot start ENTRY-005 until PM documents ENTRY-004 (Gate 8)"
```

**PM must**:
1. Create `.ralph/ENTRY-004-completion-report.md`
2. Update `PROJECT_LEDGER.md` to DONE
3. Commit: `docs: document ENTRY-004 completion (Gate 8)`

**Only then** coder can start ENTRY-005.

---

## 🛠️ CUSTOMIZATION

### Adjust Verification Checks

Edit the scripts to match your project needs:

**`scripts/verify-pm-gates.js`**:
- Add/remove required PM artifacts
- Change file naming conventions
- Adjust approval signature requirements

**`scripts/verify-ralph-gates.js`**:
- Add security scans
- Adjust coverage thresholds
- Add custom quality checks

**`scripts/verify-pm-documentation.js`**:
- Change completion report requirements
- Adjust ledger update format
- Add custom documentation checks

### Integrate with CI/CD

Add to `.github/workflows/pr-checks.yml`:

```yaml
- name: Verify PM Gates
  run: npm run verify:pm-gates -- ${{ github.head_ref }}

- name: Verify Ralph Gates
  run: npm run verify:ralph-gates -- ${{ github.head_ref }}
```

---

## 📊 BENEFITS

| Before Circular Enforcement | After Circular Enforcement |
|----------------------------|---------------------------|
| PM self-discipline (failed) | Mechanical enforcement (works) |
| PM recommendations without audit | Coder blocks without research audit |
| PM doesn't document tasks | Coder blocks next task |
| Coder submits failing code | PM blocks without quality gates |
| Wasted CEO time on rework | Both agents accountable |
| "Lazy ass pmship" | No single point of failure |

---

## 📚 REFERENCES

- **Ralph Protocol**: `.agent/RALPH_PROTOCOL.md` - 12 quality gates for coder
- **PM Protocol**: `.agent/PM_PROTOCOL.md` - 8 strategic gates for PM (includes Gate 8)
- **Circular Enforcement**: `docs/CIRCULAR_ENFORCEMENT.md` - Complete workflow
- **Verification Scripts**: `scripts/verify-*.js` - Enforcement mechanisms

---

## 🎓 TRAINING MATERIALS

### For New Coders

**Before starting ANY task**:
1. Run `npm run verify:pm-gates -- TASK_ID`
2. Check exit code:
   - `0` = PM provided research/plan → Proceed
   - `1` = PM missing artifacts → Comment BLOCKED in ledger
3. After completing task, wait for PM verification

**Before starting NEXT task**:
1. Run `npm run verify:pm-documentation -- PREVIOUS_TASK_ID`
2. Check exit code:
   - `0` = PM documented → Accept next task
   - `1` = PM didn't document → Block until Gate 8 complete

### For New PMs

**Before assigning task**:
1. Create `audit-gate-0-TASK_ID.log` (3+ web searches)
2. Create `implementation-plan-TASK_ID.md` (with alternatives)
3. Get CEO approval
4. Coder will verify with `npm run verify:pm-gates`

**Before approving task**:
1. Run `npm run verify:ralph-gates -- TASK_ID`
2. Check exit code:
   - `0` = Quality gates pass → Approve
   - `1` = Quality issues → Comment BLOCKED in ledger

**After approving task (Gate 8 - MANDATORY)**:
1. Create `.ralph/TASK_ID-completion-report.md`
2. Update `PROJECT_LEDGER.md` to DONE
3. Commit: `docs: document TASK_ID completion (Gate 8)`
4. Next task verification will check this

---

## ✅ IMPLEMENTATION CHECKLIST

Copy this to your project and check off as you implement:

```markdown
- [ ] Created `.agent/` folder
- [ ] Created `scripts/` folder
- [ ] Created `docs/` folder
- [ ] Created `.ralph/` folder
- [ ] Copied `RALPH_PROTOCOL.md` to `.agent/`
- [ ] Copied `PM_PROTOCOL.md` to `.agent/`
- [ ] Copied `CIRCULAR_ENFORCEMENT.md` to `docs/`
- [ ] Copied `verify-pm-gates.js` to `scripts/`
- [ ] Copied `verify-ralph-gates.js` to `scripts/`
- [ ] Copied `verify-pm-documentation.js` to `scripts/`
- [ ] Made scripts executable (`chmod +x scripts/verify-*.js`)
- [ ] Added npm commands to `package.json`
- [ ] Updated `PROJECT_LEDGER.md` with state machine
- [ ] Tested `npm run verify:pm-gates`
- [ ] Tested `npm run verify:ralph-gates`
- [ ] Tested `npm run verify:pm-documentation`
- [ ] Trained coder on verification workflow
- [ ] Trained PM on Gate 8 requirements
- [ ] Documented custom verification rules (if any)
```

---

**Status**: Production-Ready (2026-02-12)
**Tested**: antigravity.directory project
**Violations**: P0 incident report
**Support**: See CIRCULAR_ENFORCEMENT.md for full details
