# RALPH PROTOCOLS
**Centralized Quality Standards for All Projects**

**Updated**: 2026-02-12
**Version**: 3.0 (Sync System Edition)
**Status**: Production-Ready

---

## 🎯 WHAT IS THIS?

This is the **central source of truth** for quality protocols used across all Antigravity projects.

**Purpose**: Maintain ONE protocol repository on GitHub → Auto-sync to all projects

**Structure**:
```
GitHub: ralph-protocols (this repo)
   ↓ sync
Project 1/.agent/ ← Synced protocols
Project 2/.agent/ ← Synced protocols
Project 3/.agent/ ← Synced protocols
Project 4/.agent/ ← Synced protocols
Project 5/.agent/ ← Synced protocols
```

---

## 🚀 QUICK START

### For Projects Using These Protocols

**Sync latest protocols to your project**:
```bash
npm run sync:protocols
```

**First-time setup** (new project):
```bash
npm run sync:protocols:init
```

**See complete setup guide**: Each project has `PROTOCOL_SYNC_SETUP.md`

---

## 📖 CORE PROTOCOLS

### 1. **RALPH_PROTOCOL.md** (12 Gates - Technical Quality)
- Build compilation (0 errors)
- TypeScript validation (0 type errors)
- Console cleanliness (0 errors/warnings)
- Logic correctness
- Database query optimization (no N+1)
- Performance (<2s page load)
- Mobile responsiveness (375px, 768px, 1024px)
- Security (XSS, SQL injection, CSRF prevention)
- Error handling (graceful failures)
- Code style consistency
- Test coverage (unit + integration)
- CI/CD readiness

**When to Use**: Every code submission, always required

---

### 2. **PM_PROTOCOL.md** (7 Gates - Strategic Validation)
- Strategic alignment (Antigravity IDE focus)
- Product-market fit (user research validated)
- Monetization model (revenue stream assigned)
- SEO impact (indexed pages, keywords, traffic)
- Virality (product) - growth mechanics, retention hooks
- Virality (engineering) - analytics tracking
- MRR validation (revenue math verified)

**When to Use**: User-facing features, monetization changes, major product changes

---

### 3. **COMMUNICATION_PROTOCOL.md** (CEO Relay System)
- Ledger-based communication (PROJECT_LEDGER.md)
- Shareable prompts (Rule 5 - mandatory)
- PM ↔ CEO ↔ Coder relay system
- Timestamp format standards
- Evidence requirements

**When to Use**: All PM-Coder communication

---

### 4. **CIRCULAR_ENFORCEMENT.md** (Accountability System)
- PM verification gates (Coder blocks if PM didn't research)
- Ralph verification gates (PM blocks if quality fails)
- Documentation verification (Coder blocks if PM didn't document)
- State machine transitions
- Verification commands (`npm run verify:*`)

**When to Use**: Task transitions, approvals, handoffs

---

### 5. **SHAREABLE_PROMPTS_GUIDE.md** (Rule 5 Implementation)
- Prompt format requirements
- Templates for common scenarios
- CEO relay instructions
- Examples and anti-patterns

**When to Use**: Every message sent to CEO for relay

---

## 📁 FOLDER STRUCTURE

```
protocol/
├── README.md                         ← You are here
├── RALPH_PROTOCOL.md                 ← 12 quality gates
├── PM_PROTOCOL.md                    ← 7 strategic gates
├── COMMUNICATION_PROTOCOL.md         ← CEO ↔ PM ↔ Coder messaging
├── CIRCULAR_ENFORCEMENT.md           ← Workflow documentation
├── CIRCULAR_ENFORCEMENT_SETUP.md     ← Implementation guide
├── SHAREABLE_PROMPTS_GUIDE.md        ← Rule 5 (mandatory prompts)
├── PROMPT_FOR_AI_CODERS.md           ← Quick reference
├── AI_CODER_ADAPTATION_GUIDE.md      ← Detailed AI coder guidance
├── verification-scripts/
│   ├── verify-pm-gates.js            ← Coder blocks PM
│   ├── verify-ralph-gates.js         ← PM blocks Coder
│   └── verify-pm-documentation.js    ← Coder blocks next task
├── templates/
│   ├── PM_ASSESSMENT_TEMPLATE.md
│   ├── QA_REPORT_TEMPLATE.md
│   ├── SELF_AUDIT_TEMPLATE.md
│   └── [other templates]
└── scripts/
    └── [utility scripts]
```

---

## 🔄 HOW THE SYNC SYSTEM WORKS

### Central Repository (This GitHub Repo)
- **URL**: `https://github.com/YOUR_USERNAME/ralph-protocols`
- **Branch**: `main` (single branch, always production-ready)
- **Updates**: Edit here → Push to GitHub → Sync to all projects

### Project Sync
Each project has a sync script that:
1. Clones/pulls this GitHub repository
2. Copies all protocols to project's `.agent` folder
3. Reports sync status

### Update Workflow

**To update protocols**:

1. **Edit on GitHub** (Recommended):
   - Click file → Edit → Commit
   - Changes immediately available for sync

2. **Edit Locally** (Advanced):
   ```bash
   cd /Users/surajsatyarthi/Desktop/Projects/protocol

   # Edit files
   vim RALPH_PROTOCOL.md

   # Commit and push
   git add .
   git commit -m "docs: update RALPH_PROTOCOL - add new gate"
   git push origin main
   ```

3. **Sync to All Projects**:
   ```bash
   # In each project
   npm run sync:protocols
   ```

---

## 📊 PROTOCOL HIERARCHY

```
ALL CODE SUBMISSIONS:
├─ Ralph Protocol (12/12) ← Always required
└─ PM Protocol (7/7) ← Required if user-facing/strategic

USER-FACING FEATURES:
├─ Ralph Protocol (12/12)
├─ PM Protocol (7/7)
└─ Circular Enforcement (state transitions)

INFRASTRUCTURE WORK:
└─ Ralph Protocol (12/12) only

ALL COMMUNICATION:
├─ Communication Protocol (ledger-based)
└─ Shareable Prompts (Rule 5 - mandatory)
```

---

## 🚨 NON-NEGOTIABLE RULES

1. **Ralph 12/12 Required** - No code ships without all 12 gates passing
2. **PM 7/7 for User-Facing** - Strategic validation mandatory for user-visible work
3. **Shareable Prompts (Rule 5)** - Every message to CEO must include copy-paste prompt
4. **Evidence-Based** - All gate scores require proof (screenshots, logs, test results)
5. **Circular Enforcement** - PM and Coder verify each other's work before transitions
6. **No Gate Skipping** - Cannot approve/reject without completing full gate report

---

## 🎓 PROJECTS USING THESE PROTOCOLS

1. **googleantigravity.directory** - Marketplace for Antigravity tools
2. **Project 2** - TBD
3. **Project 3** - TBD
4. **Project 4** - TBD
5. **Project 5** - TBD

All projects sync from this central repository.

---

## 🛠 VERIFICATION SCRIPTS

### verify-pm-gates.js
**Who uses**: Coder
**When**: Before starting task
**Checks**: Research audit exists, plan approved, 3+ web searches
**Exit codes**: 0 = Pass, 1 = Block

### verify-ralph-gates.js
**Who uses**: PM
**When**: Before approving task
**Checks**: Build, lint, tests pass
**Exit codes**: 0 = Pass, 1 = Block

### verify-pm-documentation.js
**Who uses**: Coder
**When**: Before starting next task
**Checks**: PM documented previous task (Gate 8)
**Exit codes**: 0 = Pass, 1 = Block

---

## 📚 TRAINING

### For Coders
```bash
# Before starting task
npm run verify:pm-gates -- ENTRY-XXX
# Exit 0 → Start work
# Exit 1 → Comment "🚫 BLOCKED" in ledger

# Before starting next task
npm run verify:pm-documentation -- ENTRY-{previous}
# Exit 0 → Accept next task
# Exit 1 → Block until PM completes Gate 8
```

### For PMs
```bash
# Before approving task
npm run verify:ralph-gates -- ENTRY-XXX
# Exit 0 → Approve
# Exit 1 → Comment "🚫 BLOCKED" in ledger

# After approving (Gate 8 - MANDATORY)
# 1. Create .ralph/ENTRY-XXX-completion-report.md
# 2. Update PROJECT_LEDGER.md to DONE
# 3. Commit: "docs: document ENTRY-XXX completion (Gate 8)"
```

---

## 📝 VERSION HISTORY

### v3.0 (2026-02-12) - Sync System Edition
- ✅ **NEW**: Centralized GitHub repository
- ✅ **NEW**: Auto-sync system for all projects
- ✅ Protocol sync via npm commands
- ✅ Removed manual file copying requirement
- ✅ Single source of truth architecture

### v2.1 (2026-02-12) - Shareable Prompts Edition
- ✅ Added mandatory shareable prompts (Rule 5)
- ✅ CEO relay standardization

### v2.0 (2026-02-12) - Circular Enforcement Edition
- ✅ Added circular enforcement system
- ✅ Added 3 verification scripts
- ✅ Updated Ralph Protocol to v6.5
- ✅ Updated PM Protocol to v3.0 (Gate 8)

### v1.0 (2026-02-11) - Original Release
- Initial protocol collection

---

## 🆘 SUPPORT

### Common Issues

**Q: How do I update protocols across all projects?**
A: Edit in this GitHub repo → Push → Run `npm run sync:protocols` in each project

**Q: Can I edit .agent folder directly in projects?**
A: NO - edits will be overwritten on next sync. Edit in this central repo instead.

**Q: Sync fails with "repository not found"**
A: Check `scripts/sync-protocols.js` has correct GitHub URL

**Q: Sync not pulling latest changes**
A: Force refresh: `rm -rf .protocol-cache && npm run sync:protocols:init`

---

**Last Updated**: 2026-02-12
**Repository**: https://github.com/YOUR_USERNAME/ralph-protocols
**Status**: Production-Ready (Centralized Sync System)
**Maintenance**: Update here → Sync to all projects
