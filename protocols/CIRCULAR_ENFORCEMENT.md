# CIRCULAR ENFORCEMENT SYSTEM
**PM ↔ Coder Mutual Accountability**

**Created**: 2026-02-12
**Status**: ACTIVE & ENFORCED
**Purpose**: Prevent PM and Coder failures through mutual verification

---

## 🚨 WHY THIS EXISTS

### The Problem
- **Coder** has Ralph Protocol with pre-commit hooks (mechanical enforcement)
- **PM** had no enforcement → self-discipline failed
- **Result**: PM made recommendations without codebase audit, didn't document completed tasks, wasted CEO time

### The Solution
**Circular enforcement** where neither PM nor Coder can bypass quality gates:

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

**No single point of failure** - both agents enforce standards on each other.

---

## 🔄 TASK LIFECYCLE STATE MACHINE

Every task progresses through these states:

| State | Owner | Required Artifacts | Verified By | Transition |
|-------|-------|-------------------|-------------|------------|
| **PENDING** | PM | Task created in PROJECT_LEDGER.md | CEO | Manual |
| **RESEARCHED** | PM | `audit-gate-0-TASK_ID.log` (3+ web searches) | Coder | `npm run verify:pm-gates` |
| **PLANNED** | PM | `implementation-plan-TASK_ID.md` (with alternatives + approval) | Coder | `npm run verify:pm-gates` |
| **READY** | Coder | PM gate verification passed | PM | Manual |
| **IN_PROGRESS** | Coder | Development started, code being written | PM | Manual |
| **CODE_COMPLETE** | Coder | Code + tests + build passing | PM | `npm run verify:ralph-gates` |
| **DOCUMENTED** | PM | Completion report, ledger updated, docs committed | Coder | `npm run verify:pm-documentation` |
| **DONE** | Both | All artifacts verified | CEO | Manual |

**RULE**: Cannot skip states. Each transition requires artifacts + peer verification.

---

## 🛠️ VERIFICATION SCRIPTS

### 1. Coder Blocks PM: `verify:pm-gates`

**When**: Before accepting task assignment
**Usage**: `npm run verify:pm-gates -- ENTRY-XXX`
**Purpose**: Ensure PM completed Gate 2 (research) and Gate 3 (plan approval)

**Checks**:
- ✅ Research audit exists: `audit-gate-0-TASK_ID.log`
- ✅ Audit contains 3+ web searches (not assumptions)
- ✅ Implementation plan exists: `implementation-plan-TASK_ID.md`
- ✅ Plan has "Alternatives Considered" section
- ✅ Plan has approval signature (CEO/PM)
- ✅ Previous task documented (if exists)

**Exit codes**:
- `0` = All checks pass → Coder can accept task
- `1` = Missing artifacts → Coder comments BLOCKED in ledger

---

### 2. PM Blocks Coder: `verify:ralph-gates`

**When**: Before approving task completion
**Usage**: `npm run verify:ralph-gates -- ENTRY-XXX`
**Purpose**: Ensure Coder followed Ralph Protocol (build/lint/test)

**Checks**:
- ✅ Build compiles: `npm run build`
- ✅ Lint passes: `npm run lint`
- ✅ Tests pass: `npm run test`
- ✅ Research audit log present (coder followed G2)

**Exit codes**:
- `0` = All checks pass → PM can approve
- `1` = Quality issues → PM comments BLOCKED in ledger

---

### 3. Coder Blocks Next Task: `verify:pm-documentation`

**When**: Before starting next task (verifies previous task documented)
**Usage**: `npm run verify:pm-documentation -- ENTRY-XXX`
**Purpose**: Ensure PM completed Gate 8 (documentation accountability)

**Checks**:
- ✅ Completion report exists: `.ralph/ENTRY-XXX-completion-report.md`
- ✅ Ledger updated: `PROJECT_LEDGER.md` shows DONE status
- ✅ Docs committed: Git shows documentation commits

**Exit codes**:
- `0` = PM documented → Coder can start next task
- `1` = PM didn't document → Coder blocks until PM completes Gate 8

---

## 📋 WORKFLOW EXAMPLE

### Scenario: PM assigns ENTRY-016, but ENTRY-015 not documented

```bash
# PM: "Coder, start ENTRY-016"

# Coder runs verification
$ npm run verify:pm-gates -- ENTRY-016

# Output:
🔍 Verifying PM gates for ENTRY-016...

📋 PM Gate Verification Results:

✅ Research audit with 3+ web searches (Gate 2)
✅ Implementation plan with alternatives (Gate 3)
✅ Plan has CEO/PM approval signature
❌ Previous task (ENTRY-015) documented (Gate 8)
   Missing: .ralph/ENTRY-015-completion-report.md

❌ PM GATE VERIFICATION FAILED

CODER BLOCKED: Cannot start task until PM provides missing artifacts.

Required PM actions:
  4. Document previous task completion (Gate 8)
     Create: .ralph/ENTRY-015-completion-report.md
     Update: PROJECT_LEDGER.md with DONE status

💬 Coder should comment in PROJECT_LEDGER.md under task:
   "🚫 BLOCKED - PM gate verification failed (see verification log)"
```

**Coder comments in ledger**:

```markdown
## 💬 COMMENTS

### [ENTRY-016] - 2026-02-12 10:30 - Coder
**STATUS**: 🚫 BLOCKED - PM Gate Verification Failed

Cannot start ENTRY-016 until PM completes Gate 8 for ENTRY-015.

Missing artifacts:
- ❌ .ralph/ENTRY-015-completion-report.md
- ❌ PROJECT_LEDGER.md not updated to DONE status

**Waiting for PM to resolve.**
```

**PM must now**:
1. Create `.ralph/ENTRY-015-completion-report.md`
2. Update `PROJECT_LEDGER.md` status to DONE
3. Commit with message: `docs: document ENTRY-015 completion (Gate 8)`

**Only then** can Coder start ENTRY-016.

---

## 🔒 ENFORCEMENT RULES

### Rule 1: PM Cannot Assign Without Research
- PM must create `audit-gate-0-TASK_ID.log` BEFORE assigning task
- Coder verifies with `npm run verify:pm-gates`
- Missing = Coder blocks in ledger

### Rule 2: PM Cannot Assign Without Plan Approval
- PM must get CEO approval on `implementation-plan-TASK_ID.md`
- Plan must contain "Alternatives Considered" section
- Missing = Coder blocks in ledger

### Rule 3: Coder Cannot Submit Without Quality Gates
- Build must pass
- Lint must pass
- Tests must pass (80%+ coverage)
- PM verifies with `npm run verify:ralph-gates`
- Failing = PM blocks in ledger

### Rule 4: PM Cannot Assign Next Task Without Documenting Current
- PM must create completion report for Task N
- PM must update ledger to DONE
- PM must commit documentation
- Coder verifies with `npm run verify:pm-documentation -- ENTRY-{N}`
- Missing = Coder blocks Task N+1

### Rule 5: PM and Coder Must Provide Shareable Prompts (MANDATORY)
- **EVERY message to CEO** must end with a "SHAREABLE PROMPT" section
- CEO copy-pastes this directly to the other party
- Format (see examples in LEDGER BLOCKING PROTOCOL section below)
- **No exceptions** - messages without shareable prompts will be rejected

---

## 💬 LEDGER BLOCKING PROTOCOL

When verification fails, the blocking agent MUST comment in `PROJECT_LEDGER.md`:

**Coder blocks PM** (PM missing research/plan):
```markdown
### [ENTRY-XXX] - YYYY-MM-DD HH:MM - Coder
**STATUS**: 🚫 BLOCKED - PM Gate Verification Failed

Missing PM artifacts:
- ❌ No research audit (audit-gate-0-ENTRY-XXX.log)
- ❌ No implementation plan (implementation-plan-ENTRY-XXX.md)

Required before I can start:
1. Complete Gate 2 research (3+ web searches)
2. Create implementation plan with alternatives
3. Get CEO approval on plan

**Coder will not start until PM resolves blockers.**

---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to PM:

"ENTRY-XXX is BLOCKED. Coder cannot start until you provide:
1. Research audit (audit-gate-0-ENTRY-XXX.log)
2. Implementation plan with alternatives
3. CEO approval on plan

Check PROJECT_LEDGER.md comments section for details."
```

**PM blocks Coder** (quality gates failing):
```markdown
### [ENTRY-XXX] - YYYY-MM-DD HH:MM - PM
**STATUS**: 🚫 BLOCKED - Ralph Gate Verification Failed

Quality issues found:
- ❌ Build failing: 3 TypeScript errors
- ❌ Tests failing: 2/10 tests
- ❌ No research audit log (violated Gate 2)

Required before approval:
1. Fix build errors
2. Fix failing tests
3. Create research audit log

**PM will not approve until coder resolves blockers.**

---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to Coder:

"ENTRY-XXX submission REJECTED. Fix these issues before resubmitting:
1. Build errors (3 TypeScript errors)
2. Test failures (2/10 failing)
3. Missing research audit log

Check PROJECT_LEDGER.md comments for PM's detailed review."
```

**Coder blocks next task** (PM didn't document previous):
```markdown
### [ENTRY-{N+1}] - YYYY-MM-DD HH:MM - Coder
**STATUS**: 🚫 BLOCKED - PM Documentation Verification Failed

Previous task (ENTRY-{N}) not documented (Gate 8 violation).

Missing PM artifacts:
- ❌ .ralph/ENTRY-{N}-completion-report.md
- ❌ PROJECT_LEDGER.md not updated to DONE
- ❌ No documentation commits in git

Cannot start ENTRY-{N+1} until PM completes Gate 8 for ENTRY-{N}.

**Waiting for PM.**

---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to PM:

"ENTRY-{N+1} is BLOCKED. You must complete Gate 8 documentation for ENTRY-{N} first:
1. Create .ralph/ENTRY-{N}-completion-report.md
2. Update PROJECT_LEDGER.md status to DONE
3. Commit: 'docs: document ENTRY-{N} completion (Gate 8)'

Coder cannot proceed until this is done."
```

---

## 🎯 VERIFICATION FREQUENCY

| Verification | When | Who Runs | Blocks What |
|--------------|------|----------|-------------|
| `verify:pm-gates` | Before starting task | Coder | Task start |
| `verify:ralph-gates` | Before approving completion | PM | Task approval |
| `verify:pm-documentation` | Before starting next task | Coder | Next task start |

---

## 📖 RELATED PROTOCOLS

- **Ralph Protocol**: [.agent/RALPH_PROTOCOL.md](.agent/RALPH_PROTOCOL.md) - Coder quality gates (12 gates)
- **PM Protocol**: [.agent/PM_PROTOCOL.md](.agent/PM_PROTOCOL.md) - PM strategic gates (8 gates including Gate 8)
- **PROJECT_LEDGER.md**: [PROJECT_LEDGER.md](../PROJECT_LEDGER.md) - Task registry and state machine

---

## 🚀 IMPLEMENTATION CHECKLIST

- [x] Create `scripts/verify-pm-gates.js`
- [x] Create `scripts/verify-ralph-gates.js`
- [x] Create `scripts/verify-pm-documentation.js`
- [x] Add npm commands to `package.json`
- [ ] Update `PROJECT_LEDGER.md` with state machine rules
- [ ] Test verification scripts with next task (ENTRY-016 or ENTRY-002)
- [ ] Document ledger blocking protocol
- [ ] Train coder to use verification scripts before starting tasks
- [ ] Train PM to use verification scripts before approving tasks

---

## 🎓 TRAINING

### For Coder
**Before starting ANY task**:
1. Run `npm run verify:pm-gates -- ENTRY-XXX`
2. If exit code 1 → Comment BLOCKED in ledger
3. If exit code 0 → Proceed with development

**Before accepting next task**:
1. Run `npm run verify:pm-documentation -- ENTRY-{previous}`
2. If exit code 1 → Comment BLOCKED in ledger
3. If exit code 0 → Accept next task

### For PM
**Before approving ANY task**:
1. Run `npm run verify:ralph-gates -- ENTRY-XXX`
2. If exit code 1 → Comment BLOCKED in ledger
3. If exit code 0 → Approve and document (Gate 8)

**After approving task**:
1. Create `.ralph/ENTRY-XXX-completion-report.md`
2. Update `PROJECT_LEDGER.md` to DONE status
3. Commit: `docs: document ENTRY-XXX completion (Gate 8)`

---

**Status**: ACTIVE & ENFORCED (2026-02-12)
**Violations**: P0 incident report
**Escalation**: CEO removal of PM or Coder from project
