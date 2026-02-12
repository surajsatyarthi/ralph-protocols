# ALPHA - Reusable Project Protocols
**PM ↔ Coder Accountability System**

**Updated**: 2026-02-12
**Version**: 2.1 (Shareable Prompts Edition)
**Status**: Production-Ready

---

## 🚨 FOR AI CODERS AND PMs: MIGRATE YOUR PROJECTS

**Old protocols have been removed.** All projects must migrate to Circular Enforcement v2.0.

### Quick Migration (5 Minutes)

```bash
# Go to alpha folder
cd ~/Desktop/alpha

# Read migration guide
cat MIGRATION_PROMPT.md

# Run migration script
bash MIGRATE_PROJECT.sh /path/to/your-project

# Test verification
cd /path/to/your-project
npm run verify:pm-gates -- ENTRY-001
```

**See**: [MIGRATION_PROMPT.md](MIGRATION_PROMPT.md) for complete instructions

---

## 🎯 WHAT'S NEW (v2.1 - 2026-02-12)

### ✅ Added: Mandatory Shareable Prompts (v2.1 - Latest Update)
**Problem solved**: CEO had to parse long PM/Coder messages to figure out what to relay
**Solution**: PM and Coder MUST end every message with "📋 SHAREABLE PROMPT FOR CEO" section
**Result**: CEO just copy-pastes the prompt (5 seconds, zero interpretation needed)

### ✅ Added: Circular Enforcement System (v2.0)
**Problem solved**: PM self-enforcement failed → Made recommendations without codebase audit, didn't document tasks
**Solution**: Mechanical PM ↔ Coder mutual verification - neither can bypass quality gates

### ❌ Removed: Old Protocol Files
- Old PM_PROTOCOL.md (replaced with v3.0 including Gate 8)
- Old RALPH_PROTOCOL.md (replaced with v6.5 including sequential enforcement)
- Old QA_PROTOCOL.md (archived)
- Old STANDING_ORDERS.md (archived)
- Old WORKFLOW.md (archived)

### 📦 New Files
1. **RALPH_PROTOCOL.md** (v6.5) - 12 quality gates with mechanical enforcement
2. **PM_PROTOCOL.md** (v3.0) - 8 strategic gates including Gate 8 (accountability)
3. **CIRCULAR_ENFORCEMENT.md** - Complete workflow documentation + shareable prompts
4. **COMMUNICATION_PROTOCOL.md** - CEO ↔ PM ↔ Coder messaging with shareable prompt examples
5. **CIRCULAR_ENFORCEMENT_SETUP.md** - Implementation guide for any project
6. **verification-scripts/** - 3 verification scripts (12KB)

---

## 🚀 QUICK START (5 Minutes)

### For New Projects

```bash
# 1. Copy files to your project
cp ~/Desktop/alpha/verification-scripts/*.js ./scripts/
cp ~/Desktop/alpha/RALPH_PROTOCOL.md ./.agent/
cp ~/Desktop/alpha/PM_PROTOCOL.md ./.agent/
cp ~/Desktop/alpha/CIRCULAR_ENFORCEMENT.md ./docs/

# 2. Make scripts executable
chmod +x scripts/verify-*.js

# 3. Add to package.json scripts section:
# "verify:pm-gates": "node scripts/verify-pm-gates.js",
# "verify:ralph-gates": "node scripts/verify-ralph-gates.js",
# "verify:pm-documentation": "node scripts/verify-pm-documentation.js"

# 4. Test verification
npm run verify:pm-gates -- ENTRY-001
```

### For Existing Projects

Read **CIRCULAR_ENFORCEMENT_SETUP.md** for full implementation guide.

---

## 📁 FOLDER STRUCTURE

```
alpha/
├── README.md                              ← You are here
├── CIRCULAR_ENFORCEMENT_SETUP.md          ← START HERE for implementation
├── SHAREABLE_PROMPTS_GUIDE.md             ← NEW: Mandatory CEO messaging format
├── COMMUNICATION_PROTOCOL.md              ← CEO ↔ PM ↔ Coder messaging workflows
├── RALPH_PROTOCOL.md                      ← 12 quality gates (v6.5)
├── PM_PROTOCOL.md                         ← 8 strategic gates (v3.0 - includes Gate 8)
├── CIRCULAR_ENFORCEMENT.md                ← Workflow documentation with shareable prompts
├── verification-scripts/
│   ├── verify-pm-gates.js                 ← Coder blocks PM (4.3KB)
│   ├── verify-ralph-gates.js              ← PM blocks Coder (3.5KB)
│   └── verify-pm-documentation.js         ← Coder blocks next task (4.2KB)
├── templates/
│   └── [project-specific templates]
└── [legacy files - archived]
```

---

## 🔄 CIRCULAR ENFORCEMENT OVERVIEW

### The Problem
- ❌ PM makes recommendations without auditing codebase
- ❌ PM doesn't document completed tasks
- ❌ Coder codes without research/planning
- ❌ Coder submits failing code
- ❌ Self-discipline fails → Wasted time + rework

### The Solution
**Neither PM nor Coder can bypass quality gates**

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

### How It Works

| Verification | Who Uses | Purpose | Command |
|-------------|----------|---------|---------|
| **PM Gates** | Coder | Blocks task start without research/plan | `npm run verify:pm-gates -- TASK_ID` |
| **Ralph Gates** | PM | Blocks approval without quality gates | `npm run verify:ralph-gates -- TASK_ID` |
| **PM Documentation** | Coder | Blocks next task if PM didn't document | `npm run verify:pm-documentation -- TASK_ID` |

**Exit codes**: 0 = Pass (proceed), 1 = Fail (block in ledger)

---

## 📖 CORE PROTOCOLS

### 1. Ralph Protocol (Coder Quality Gates)
**File**: `RALPH_PROTOCOL.md`
**Purpose**: 12 technical quality gates for coder
**Version**: v6.5 (2026-02-12)

**Key Gates**:
- **G1**: Physical Audit (verify current state)
- **G2**: Research (3+ web searches MANDATORY)
- **G3**: Plan Approval (CEO/PM signature required)
- **G4-G9**: Implementation (code, security, tests, accessibility)
- **G10-G11**: Deployment verification
- **G12**: Documentation

**Enforcement**: Pre-dev and pre-commit hooks block without research/plan

---

### 2. PM Protocol (Strategic Validation)
**File**: `PM_PROTOCOL.md`
**Purpose**: 8 strategic gates for PM
**Version**: v3.0 (2026-02-12)

**Key Gates**:
- **Gate 1**: Strategic Alignment
- **Gate 2**: Product-Market Fit (data-driven)
- **Gate 3**: Monetization Path
- **Gate 4**: SEO Impact
- **Gate 5**: Virality as Product
- **Gate 6**: Virality as Engineering
- **Gate 7**: MRR Validation
- **Gate 8**: PM Documentation Accountability (NEW v3.0)

**Gate 8 Requirements** (After approving ANY coder work):
1. Create `.ralph/TASK_ID-completion-report.md`
2. Update `PROJECT_LEDGER.md` to DONE
3. Commit: `docs: document TASK_ID completion (Gate 8)`

**Consequence**: Coder blocks next task if PM skips Gate 8

---

### 3. Circular Enforcement (Mutual Accountability)
**File**: `CIRCULAR_ENFORCEMENT.md`
**Purpose**: Workflow documentation for PM ↔ Coder verification
**Version**: 1.0 (2026-02-12)

**Task Lifecycle**:
1. PENDING → RESEARCHED (PM creates research audit)
2. RESEARCHED → PLANNED (PM creates implementation plan)
3. PLANNED → CODE_COMPLETE (Coder implements)
4. CODE_COMPLETE → DOCUMENTED (PM documents - Gate 8)
5. DOCUMENTED → DONE (Both verified)

**Enforcement**: Each transition requires verification by peer

---

## 🛠️ VERIFICATION SCRIPTS

### verify-pm-gates.js (4.3KB)
**Who uses**: Coder
**When**: Before starting task
**Checks**:
- ✅ Research audit exists (`audit-gate-0-TASK_ID.log`)
- ✅ Research contains 3+ web searches
- ✅ Implementation plan exists (`implementation-plan-TASK_ID.md`)
- ✅ Plan has "Alternatives Considered" section
- ✅ Plan has approval signature
- ✅ Previous task documented (if exists)

**Exit codes**: 0 = Pass, 1 = Block (PM missing artifacts)

---

### verify-ralph-gates.js (3.5KB)
**Who uses**: PM
**When**: Before approving task
**Checks**:
- ✅ Build compiles (`npm run build`)
- ✅ Lint passes (`npm run lint`)
- ✅ Tests pass (`npm run test`)
- ✅ Research audit exists

**Exit codes**: 0 = Pass, 1 = Block (Coder quality issues)

---

### verify-pm-documentation.js (4.2KB)
**Who uses**: Coder
**When**: Before starting next task (verifies previous task documented)
**Checks**:
- ✅ Completion report exists (`.ralph/TASK_ID-completion-report.md`)
- ✅ Ledger updated (`PROJECT_LEDGER.md` status DONE)
- ✅ Docs committed (git log shows documentation commits)

**Exit codes**: 0 = Pass, 1 = Block (PM didn't complete Gate 8)

---

## 🎓 TRAINING

### For Coders (Using Circular Enforcement)

**Before starting task**:
```bash
npm run verify:pm-gates -- ENTRY-XXX
# Exit 0 → Start work
# Exit 1 → Comment "🚫 BLOCKED" in ledger
```

**Before starting next task**:
```bash
npm run verify:pm-documentation -- ENTRY-{previous}
# Exit 0 → Accept next task
# Exit 1 → Block until PM completes Gate 8
```

---

### For PMs (Using Circular Enforcement)

**Before assigning task**:
1. Create `audit-gate-0-TASK_ID.log` (3+ web searches)
2. Create `implementation-plan-TASK_ID.md` (with alternatives)
3. Get CEO approval

**Before approving task**:
```bash
npm run verify:ralph-gates -- ENTRY-XXX
# Exit 0 → Approve
# Exit 1 → Comment "🚫 BLOCKED" in ledger
```

**After approving task (Gate 8 - MANDATORY)**:
1. Create `.ralph/ENTRY-XXX-completion-report.md`
2. Update `PROJECT_LEDGER.md` to DONE
3. Commit: `docs: document ENTRY-XXX completion (Gate 8)`

---

## 📊 BENEFITS

| Metric | Before | After |
|--------|--------|-------|
| PM recommendations without audit | Common | **Blocked by coder** |
| PM doesn't document tasks | Common | **Blocks next task** |
| Coder codes without research | Common | **Blocked by pre-dev hook** |
| Coder submits failing code | Common | **Blocked by PM** |
| Wasted time on rework | High | **Eliminated** |
| Single point of failure | PM or Coder | **None** |

---

## 🚀 IMPLEMENTATION GUIDE

**For complete step-by-step instructions**, see:
- **CIRCULAR_ENFORCEMENT_SETUP.md** - Full implementation guide (15KB)

**Quick checklist**:
- [ ] Copy verification scripts to `./scripts/`
- [ ] Copy protocols to `./.agent/`
- [ ] Copy documentation to `./docs/`
- [ ] Add npm commands to `package.json`
- [ ] Make scripts executable
- [ ] Test verification commands
- [ ] Train team on workflow

---

## 📚 RELATED PROJECTS

**Tested on**:
- ✅ antigravity.directory (2026-02-12) - Production-ready

**Recommended for**:
- Any PM ↔ Coder collaboration
- Projects with quality gate requirements
- Teams struggling with accountability
- Projects with >2 contributors

---

## 🆘 SUPPORT

### Common Issues

**Q: Verification script fails with "command not found"**
A: Run `chmod +x scripts/verify-*.js` to make scripts executable

**Q: Coder blocked but PM thinks research exists**
A: Check file naming: must be `audit-gate-0-TASK_ID.log` (e.g., `audit-gate-0-ENTRY-002.log`)

**Q: PM gate verification passes but plan not approved**
A: Plan file must contain "APPROVED" or "✅ CEO APPROVAL" string

**Q: PM documented task but coder still blocked**
A: Check git commits - must include "docs:" prefix in commit message

### Getting Help

1. Read **CIRCULAR_ENFORCEMENT_SETUP.md** (comprehensive guide)
2. Read **CIRCULAR_ENFORCEMENT.md** (workflow details)
3. Check verification script output (shows exactly what's missing)
4. Review protocol files (Ralph, PM) for gate requirements

---

## 📝 VERSION HISTORY

### v2.0 (2026-02-12) - Circular Enforcement Edition
- ✅ Added circular enforcement system
- ✅ Added 3 verification scripts (12KB)
- ✅ Updated Ralph Protocol to v6.5 (sequential enforcement)
- ✅ Updated PM Protocol to v3.0 (Gate 8 accountability)
- ✅ Added CIRCULAR_ENFORCEMENT.md (workflow docs)
- ✅ Added CIRCULAR_ENFORCEMENT_SETUP.md (implementation guide)
- ❌ Removed old protocol files (archived)

### v1.0 (2026-02-11) - Original Alpha Release
- Initial protocol collection
- PM, QA, Ralph protocols
- Standing orders and workflow

---

**Status**: Production-Ready (2026-02-12)
**Tested**: antigravity.directory project
**License**: Reusable for all projects
**Maintenance**: Update protocols as needed, keep verification scripts in sync
