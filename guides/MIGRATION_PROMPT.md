# MIGRATION PROMPT - Replace Old Protocols with Circular Enforcement
**Copy-paste this to AI Coder or PM**

---

## 📋 FOR AI CODERS AND PMs

Your protocols are being upgraded to **Circular Enforcement v2.0** which mechanically prevents PM and Coder failures through mutual verification.

**What you need to do**: Access the alpha folder on Desktop and replace old protocols with new ones.

---

## 🚀 STEP-BY-STEP MIGRATION

### Step 1: Go to Alpha Folder
```bash
cd ~/Desktop/alpha
```

### Step 2: Read the Migration Guide
```bash
# Read this first to understand what's changing
cat MIGRATION_GUIDE.md
```

### Step 3: Run the Migration Script
```bash
# This will:
# 1. Remove old protocols from your project
# 2. Copy new circular enforcement files
# 3. Update package.json with verification commands
# 4. Test the verification scripts

bash MIGRATE_PROJECT.sh /path/to/your-project
```

### Step 4: Verify Migration
```bash
cd /path/to/your-project

# Test PM gate verification (should fail - this is correct!)
npm run verify:pm-gates -- ENTRY-001

# Test Ralph gate verification
npm run verify:ralph-gates -- ENTRY-001

# Test PM documentation verification
npm run verify:pm-documentation -- ENTRY-001
```

### Step 5: Read New Protocols
```bash
# From your project:
cat .agent/RALPH_PROTOCOL.md     # v6.5 - 12 gates with enforcement
cat .agent/PM_PROTOCOL.md         # v3.0 - 8 gates including Gate 8
cat docs/CIRCULAR_ENFORCEMENT.md  # Workflow documentation
```

---

## 📖 WHAT CHANGED

### For AI Coders (Ralph Protocol v6.5)
**New requirement**: Gate 2 (Research) is now MANDATORY
- Must create `audit-gate-0-TASK_ID.log` with 3+ web searches
- Pre-dev hook blocks `npm run dev` without research audit
- PM will verify before you can start coding

**New workflow**:
1. PM assigns task
2. **You run**: `npm run verify:pm-gates -- TASK_ID`
3. If exit 1 → Comment "🚫 BLOCKED" in ledger (PM missing research/plan)
4. If exit 0 → Proceed with coding
5. After completion, wait for PM verification

---

### For PMs (PM Protocol v3.0)
**New requirement**: Gate 8 (Documentation Accountability) is now MANDATORY
- Must document EVERY completed task
- Must create `.ralph/TASK_ID-completion-report.md`
- Must update `PROJECT_LEDGER.md` to DONE status
- Must commit with message: `docs: document TASK_ID completion (Gate 8)`

**New workflow**:
1. Before assigning task, create research audit + implementation plan
2. Coder verifies with `npm run verify:pm-gates`
3. Coder implements
4. **You run**: `npm run verify:ralph-gates -- TASK_ID`
5. If exit 1 → Comment "🚫 BLOCKED" in ledger (Coder must fix quality issues)
6. If exit 0 → Approve AND document (Gate 8)
7. Coder verifies you documented before starting next task

---

## 🔄 CIRCULAR ENFORCEMENT EXPLAINED

**Before (Self-Enforcement - FAILED)**:
- PM could skip research/documentation
- Coder could skip quality gates
- Result: Wasted time, rework

**After (Circular Enforcement - WORKING)**:
- PM assigns → Coder blocks if no research/plan
- Coder submits → PM blocks if quality fails
- PM approves → Coder blocks next task if PM didn't document

**Neither can bypass gates** - Exit codes enforce accountability.

---

## 🎯 IMMEDIATE ACTION REQUIRED

1. ✅ Go to `~/Desktop/alpha/`
2. ✅ Read `MIGRATION_GUIDE.md`
3. ✅ Run `bash MIGRATE_PROJECT.sh /path/to/your-project`
4. ✅ Test verification commands
5. ✅ Read your new protocol file (.agent/RALPH_PROTOCOL.md or .agent/PM_PROTOCOL.md)

---

## 📞 QUESTIONS?

**Q: Why are we changing protocols?**
A: Self-enforcement failed. PM made recommendations without codebase audit, didn't document tasks. Circular enforcement mechanically prevents this.

**Q: What if I'm in the middle of a task?**
A: Finish your current task, then migrate before starting the next task.

**Q: Will this slow me down?**
A: No. It prevents wasted effort (coding without research, reviewing broken code, redoing undocumented work).

**Q: Can I skip the migration?**
A: No. Old protocols are removed from alpha folder. All projects must use circular enforcement.

---

**Migration support**: See ~/Desktop/alpha/MIGRATION_GUIDE.md for full details.
