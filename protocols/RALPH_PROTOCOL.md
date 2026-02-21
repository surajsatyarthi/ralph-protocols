# 🦅 RALPH PROTOCOL v14.0
## FAANG-Standard Technical Quality Gates

**Version:** 14.0
**Effective Date:** 2026-02-21
**Status:** ACTIVE & MECHANICALLY ENFORCED
**Owner:** AI Coder
**Changelog:**
- v14.0: 4-phase revamp. G2 requires `## Codebase Search`. G3 requires `## Design Reference` (UI), `## Success Metric`, `## Failure Signal`. New G14 PM Code Review gate. G11 verifies G3 observability fields. Gate sequence: G0→G1→G2→G3→G4→G5→G6→G7→G8→G9→G10→G13→G14→G11→G12.
- v13.1: Added G13 (Antigravity Browser Walkthrough on Vercel PREVIEW URL before merge).
- v13.0: Added G1 mechanical enforcement. Node.js runtime check in G0. Added G4, G8, G11 scripts. All 13 gates enforced.
- v7.0: Added G1 mechanical enforcement. Node.js runtime check. Artifact naming clarification.

---

## EXECUTIVE SUMMARY

Ralph Protocol ensures **FAANG-level code quality** through **14 sequential gates**. Every gate is mechanically enforced — there is no honor system. Gates cannot be skipped, reordered, or bypassed.

**Gate Sequence (non-negotiable):**

```
G0 → G1 → G2 → G3 → G4 → G5 → G6 → G7 → G8 → G9 → G10 → G13 → G14 → G11 → G12
```

**The critical sequencing rules:**
1. **G1 before G2** — Observe current state before researching. You cannot research without knowing what exists.
2. **G2 before G3** — Research before planning. You cannot plan without knowing the landscape.
3. **G3 before G4** — Approved plan before writing code. No code without sign-off.
4. **G13 before G14** — Browser test the preview before PM reviews. PM reviews evidence, not just code.
5. **G14 before G11** — PM approves before production merge. No production sign-off without human review.

---

## THE 11 COMMANDMENTS

| # | Law | Rule | Severity | Enforcement |
|---|-----|------|----------|-------------|
| 1 | **Limit Law** | All SELECT queries must include LIMIT | P0 | Scanner blocks |
| 2 | **Security Law** | Never use dangerouslySetInnerHTML without DOMPurify | P0 | Build fails |
| 3 | **JSON-LD Law** | Always use safeJsonLd() utility | P0 | Scanner blocks |
| 4 | **Revenue Law** | Payment code uses database, not in-memory | P0 | Deploy blocked |
| 5 | **Sequential Law** | All 14 gates in strict order, no skipping | P0 | Audit log required |
| 6 | **Proof Law** | Evidence = Logs + Screenshots + Git Hash | P0 | Logs required |
| 7 | **Air-Gap Law** | DB writes via server-side only | P0 | Build fails |
| 8 | **Context Law** | Reports anchor to Git HEAD | P1 | Hash verified |
| 9 | **Semantic Law** | Commits reference TASK_ID | P1 | Hook rejects |
| 10 | **Integrity Law** | Reports pass validation | P1 | Exit code blocks |
| 11 | **RFC Law** | Plan has "Alternatives" + CEO/PM approval + Design Reference (UI) + Success Metric + Failure Signal | P0 | Hook rejects |

---

## THE 14 QUALITY GATES

### PHASE 0: PRE-FLIGHT

| Gate | Name | Script | Requirements | Enforcement |
|------|------|--------|--------------|-------------|
| **G0** | Environment & Runtime Pre-Flight | `gate-0-pre-assign.js` | Node.js ≥18 installed. All required env vars present. Services reachable. Generates `.env-validated.log`. | Blocks `npm run dev` and all commits |

**What G0 validates:**
- ✅ Node.js ≥18.0.0 installed (blocks immediately if absent)
- ✅ npm/pnpm available
- ✅ Required environment variables present
- ✅ External services reachable (Supabase, etc.)
- ✅ Generates `.env-validated.log`

---

### PHASE 1: ASSESSMENT (MUST COMPLETE BEFORE PLANNING OR CODING)

| Gate | Name | Script | Requirements | Enforcement |
|------|------|--------|--------------|-------------|
| **G1** | Physical Audit & State | `gate-1-physical-audit.js` | Directly observe current code + production. Document ≥50 lines anchored to git HEAD. List existing components (UI tasks). | Pre-dev hook blocks without audit file |
| **G2** | External Research | `gate-2-research.js` | 3+ documented web searches. 5+ sources. Alternatives Considered. **`## Codebase Search` section required** (grep results proving feature doesn't already exist). 1000+ words. | Pre-commit hook blocks without research artifact |

**G2 — `## Codebase Search` is mandatory:**

The research document MUST contain a `## Codebase Search` (or `## Internal Search` or `## Existing Implementation`) section with evidence from searching the repo. This prevents re-building features that already exist — the root cause of INCIDENT-002.

```markdown
## Codebase Search

Searched for existing [feature] implementations:

$ grep -r "ComponentName" src/
(no results)

$ grep -r "existing-pattern" src/components/
(no results)

Conclusion: Feature does not exist in codebase. Safe to build.
```

---

### PHASE 2: PLANNING (MUST COMPLETE BEFORE CODING)

| Gate | Name | Script | Requirements | Enforcement |
|------|------|--------|--------------|-------------|
| **G3** | Blueprint & RFC | `gate-3-scope.js` | Implementation plan with Alternatives Considered. CEO/PM approval. **`## Design Reference` if UI.** **`## Success Metric` always required.** **`## Failure Signal` always required.** | Pre-commit hook checks for APPROVED signature |

**G3 plan required sections:**

```markdown
## Problem Statement
[What problem are we solving?]

## Proposed Solution
[What are we building?]

## Alternatives Considered
[What else did we consider and why did we reject it?]

## Design Reference
[REQUIRED FOR UI FEATURES — Figma link, screenshot path, or written layout description]
[Example: https://figma.com/file/... or docs/designs/dashboard-mockup.png]
[Example: "Header at top, sidebar on left (250px), main content area on right"]

## Files to Change
- src/components/X.tsx — reason
- src/app/Y/page.tsx — reason

## Success Metric
[The single number/signal that proves this feature works]
[Example: "Dashboard page loads with real user data for 100% of authenticated users"]

## Failure Signal
[The log line/error that indicates this feature is broken]
[Example: "Error: Cannot read properties of undefined (reading 'user')" in console]
[Example: "HTTP 500 on GET /api/dashboard" in server logs]

## Status: APPROVED — [PM Name] [Date]
```

**Why `## Success Metric` + `## Failure Signal` are mandatory:**
Without these, there is no definition of "healthy." Operators cannot tell if the shipped feature is working or broken. These fields are verified again at G11 (production sign-off).

---

### PHASE 3: EXECUTION (ONLY AFTER G1 + G2 + G3 COMPLETE)

| Gate | Name | Script | Requirements | Enforcement |
|------|------|--------|--------------|-------------|
| **G4** | Implementation Integrity | `gate-4-implementation.js` | Execute approved plan. Scope creep >30% = blocked. | Runs during and after implementation |
| **G5** | Strict Lint Suppression | `gate-5-lint-strict.js` | Zero unexplained `eslint-disable`, `@ts-ignore`, `@ts-nocheck` | Scans all changed files |
| **G6** | Test Quality Analysis | `gate-6-test-quality.js` | ≥3 assertions/test. Real integration tests (not 100% mocked). No coverage regression. Every external integration (OAuth, Stripe, Supabase) must have ≥1 non-mocked test. | Analyzes test files |
| **G7** | Security Suite | `gate-7-security.js` | Secrets detection (gitleaks + regex). `npm audit` (no critical/high CVEs). OWASP checklist. Environment variable parity check. | Blocks on secrets or critical CVEs |
| **G8** | TDD Proof | `gate-8-tdd.js` | Tests exist, pass, ≥80% coverage. New source files must have test files. | Runs test suite + coverage parser |
| **G9** | Accessibility Audit | `gate-9-accessibility.js` | Axe scan. Keyboard nav. ARIA labels. WCAG 2.1 AA. | Skip only if no UI changes |

**G6 — external integration rule (INCIDENT-001 lesson):**
INCIDENT-001: 99 mocked tests passed. OAuth had `client_id=undefined` in production. Every external provider detected in source must have ≥1 test that verifies real configuration — not fully mocked.

**G7 — environment parity rule (INCIDENT-001 lesson):**
All variables in `.env.example` matching critical patterns (`CLIENT_ID`, `CLIENT_SECRET`, `API_KEY`, `SECRET`, `DATABASE_URL`) must be present in the current environment. Missing = BLOCKED.

---

### PHASE 4: VERIFICATION

| Gate | Name | Script | Requirements | Enforcement |
|------|------|--------|--------------|-------------|
| **G10** | Performance | `gate-10-performance.js` | Lighthouse ≥80 (median 3 runs). Bundle size no regression >10%. | Lighthouse CI |
| **G13** | Browser Walkthrough (Preview) | `gate-13-browser.js` | **Test the PREVIEW URL** (not localhost, not production). Mobile (375px) + desktop (1280px) screenshots. Console errors = 0. User flow checklist complete. **If G3 has `## Design Reference`: add `Matches design: YES/NO` to report.** | Browser test report required |
| **G14** | PM Code Review | `gate-14-pm-review.js` | Antigravity posts **Code Review Summary** to PR body (files changed + why; files NOT changed + why). PM reviews code diff + summary and **comments "APPROVED"** on the PR. | APPROVED comment required on PR |
| **G11** | Production Verification | `gate-11-production.js` | Production URL HTTP 200. Mobile + desktop screenshots. Human sign-off checklist (all `[x]`). **G3 plan must have `## Success Metric` + `## Failure Signal`.** | HTTP ping + screenshots + checklist + G3 plan check |

**G13 — why PREVIEW, not localhost (INCIDENT-001 lesson):**
Localhost has local `.env` files that differ from what Vercel/Netlify deploys. INCIDENT-001: OAuth worked on localhost (`GITHUB_CLIENT_ID` was in `.env.local`) but failed on production (not in Vercel). Preview URL uses the SAME environment as production — missing env vars show up here before merge.

**G13 — design compliance check:**
If the G3 plan has a `## Design Reference` section, the browser test report must include:
```
Matches design: YES
```
or:
```
Matches design: NO (reason: the sidebar is vertical but design shows horizontal tabs)
```
A "NO" is a warning (PM may have approved the deviation). A missing line = BLOCKED.

**G14 — Code Review Summary format (Antigravity writes this to the PR body):**
```markdown
## Code Review Summary

### Files Changed
- `src/components/Dashboard.tsx` — added user data display, connected to /api/dashboard
- `src/app/api/dashboard/route.ts` — new endpoint returning user session data

### Files NOT Changed
- `src/components/Header.tsx` — layout unchanged, no reason to modify
- `src/app/layout.tsx` — global layout unaffected by this feature

### Scope vs G3 Plan
All changes match the approved G3 plan. No deviations.
```

**G14 — how PM approves:**
PM reviews the code diff on GitHub + the Code Review Summary, then posts a comment:
```
APPROVED
```
That is all that is required. G14 checks for the word "APPROVED" in any PR comment.

**G11 — observability check:**
Before G11 passes, the gate script reads the G3 implementation plan and verifies `## Success Metric` and `## Failure Signal` are defined. If either is missing, G11 BLOCKS. This ensures operators know what "healthy" looks like before signing off on production.

---

### PHASE 5: DOCUMENTATION

| Gate | Name | Script | Requirements | Enforcement |
|------|------|--------|--------------|-------------|
| **G12** | Documentation & Walkthrough | `gate-12-validate.js` | What changed, why, how to use, rollback procedure. MASTER_TASK_LIST updated. | File existence + required sections |

---

## COMPLETE EVIDENCE REQUIREMENTS

### Gate 0 (Pre-Flight)
```
✅ .env-validated.log    — npm run validate:env. Node.js ≥18 confirmed. Expires 24h.
```

### Gate 1 (Physical Audit)
```
✅ docs/reports/physical-audit-ENTRY_ID.md
   - Git HEAD hash (git rev-parse HEAD)
   - Current State Analysis
   - Production State (URL, last deploy, current behavior)
   - Existing Components (list all relevant UI components for UI tasks)
   - Files/Dependency Analysis
   - Known Issues
   Minimum: 50 non-empty lines
```

### Gate 2 (Research)
```
✅ docs/research/ENTRY_ID-research.md   (preferred)
   OR audit-gate-0-ENTRY_ID.log         (legacy, still accepted)
   Required:
   - ≥3 documented web searches (## Search #N headers)
   - ≥5 source citations
   - Alternatives Considered section
   - Key Findings section
   - ## Codebase Search section (grep results from the repo)   ← NEW v14.0
   - ≥1000 words
```

### Gate 3 (Plan)
```
✅ implementation-plan-ENTRY_ID.md
   Required:
   - Problem Statement
   - Proposed Solution
   - Alternatives Considered
   - Files to Change
   - ## Design Reference (required if plan mentions any UI terms)  ← NEW v14.0
   - ## Success Metric (always required)                           ← NEW v14.0
   - ## Failure Signal (always required)                           ← NEW v14.0
   - Status: APPROVED — [Name] [Date]
```

### Gates 4–10 (Execution + Performance)
```
✅ git commits on branch with TASK_ID in message
✅ npm run build — PASSED
✅ npm run lint — PASSED
✅ npm run test — PASSED (coverage ≥80%)
✅ Security scan — PASSED (no secrets, no critical CVEs, env parity)
✅ Lighthouse ≥80
```

### Gate 13 (Browser Walkthrough — Preview)
```
✅ docs/reports/browser-test-ENTRY_ID.md
   Required:
   - Preview URL (Vercel/Netlify — NOT localhost, NOT production)
   - Mobile screenshot (375px viewport)
   - Desktop screenshot (1280px viewport)
   - Console Errors: Count: 0
   - User Flow Checklist (all [x])
   - Matches design: YES/NO   ← required if G3 plan has ## Design Reference
```

### Gate 14 (PM Code Review)
```
✅ PR body contains "## Code Review Summary"
   - Files changed + reason
   - Files NOT changed + reason
✅ PR has comment containing "APPROVED"
   Usage: node scripts/gates/gate-14-pm-review.js ENTRY-XXX PR_NUMBER
```

### Gate 11 (Production Verification)
```
✅ docs/reports/production-verification-ENTRY_ID.md
   Required:
   - Deployment Timestamp
   - Deployment ID
   - Production URL (HTTP 200 verified)
   - Mobile screenshot (375px)
   - Desktop screenshot (1280px)
   - Manual Verification Checklist (all [x])
   - Health Check Results
✅ G3 plan has ## Success Metric + ## Failure Signal    ← verified by G11 script
```

### Gate 12 (Documentation)
```
✅ docs/walkthroughs/walkthrough-ENTRY_ID.md
   Required sections: What Changed, Why, How to Use, Rollback Procedure
```

---

## ENFORCEMENT MECHANISMS

### Pre-dev Hook (checks G0 + G1 + G2)

```bash
#!/bin/bash
# .git/hooks/pre-dev

set -e

# Gate 0: Node.js must be installed
if ! command -v node &> /dev/null; then
  echo "❌ BLOCKED: Node.js not found."
  echo "Install Node.js ≥18: https://nodejs.org"
  exit 1
fi

NODE_MAJOR=$(node -e "process.stdout.write(process.version.match(/^v(\d+)/)[1])")
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "❌ BLOCKED: Node.js $NODE_MAJOR found, require ≥18"
  exit 1
fi

# Gate 0: Environment validated
if [ ! -f ".env-validated.log" ] && [ ! -f "bmn-site/.env-validated.log" ]; then
  echo "❌ BLOCKED: Environment not validated. Run: npm run validate:env"
  exit 1
fi

TASK_ID=$(git branch --show-current | grep -oE 'ENTRY-[A-Za-z0-9._-]+' || echo "unknown")

# Gate 1: Physical audit must exist
AUDIT_FOUND=false
for p in "docs/reports/physical-audit-${TASK_ID}.md" "bmn-site/docs/reports/physical-audit-${TASK_ID}.md"; do
  [ -f "$p" ] && AUDIT_FOUND=true && break
done
if [ "$AUDIT_FOUND" = false ] && [ "$TASK_ID" != "unknown" ]; then
  echo "❌ BLOCKED: Gate 1 (Physical Audit) not complete."
  echo "Create: docs/reports/physical-audit-${TASK_ID}.md (≥50 lines, anchored to git HEAD)"
  exit 1
fi

# Gate 2: Research must exist
RESEARCH_FOUND=false
for p in \
  "docs/research/${TASK_ID}-research.md" \
  "audit-gate-0-${TASK_ID}.log" \
  "bmn-site/docs/research/${TASK_ID}-research.md" \
  "bmn-site/audit-gate-0-${TASK_ID}.log"; do
  [ -f "$p" ] && RESEARCH_FOUND=true && break
done
if [ "$RESEARCH_FOUND" = false ] && [ "$TASK_ID" != "unknown" ]; then
  echo "❌ BLOCKED: Gate 2 (Research) not complete."
  echo "Create: docs/research/${TASK_ID}-research.md"
  echo "Must include: ## Codebase Search section (v14.0 requirement)"
  exit 1
fi

echo "✅ Pre-dev gates passed (G0, G1, G2)"
```

### Pre-commit Hook (checks G0 + G1 + G2 + G3 + build)

```bash
#!/bin/bash
# .git/hooks/pre-commit

set -e

if ! command -v node &> /dev/null; then
  echo "❌ BLOCKED: Node.js not found. Install Node.js ≥18."
  exit 1
fi

if [ ! -f ".env-validated.log" ] && [ ! -f "bmn-site/.env-validated.log" ]; then
  echo "❌ BLOCKED: Run 'npm run validate:env' first"
  exit 1
fi

TASK_ID=$(git branch --show-current | grep -oE 'ENTRY-[A-Za-z0-9._-]+' || echo "unknown")

if [ "$TASK_ID" != "unknown" ]; then
  # Gate 1
  AUDIT_FOUND=false
  for p in "docs/reports/physical-audit-${TASK_ID}.md" "bmn-site/docs/reports/physical-audit-${TASK_ID}.md"; do
    [ -f "$p" ] && AUDIT_FOUND=true && break
  done
  [ "$AUDIT_FOUND" = false ] && echo "❌ BLOCKED: No physical audit found. Complete Gate 1." && exit 1

  # Gate 2
  RESEARCH_FOUND=false
  for p in \
    "docs/research/${TASK_ID}-research.md" \
    "audit-gate-0-${TASK_ID}.log" \
    "bmn-site/docs/research/${TASK_ID}-research.md" \
    "bmn-site/audit-gate-0-${TASK_ID}.log"; do
    [ -f "$p" ] && RESEARCH_FOUND=true && break
  done
  [ "$RESEARCH_FOUND" = false ] && echo "❌ BLOCKED: No research artifact found. Complete Gate 2 with ## Codebase Search." && exit 1

  # Gate 3
  PLAN_PATH="implementation-plan-${TASK_ID}.md"
  [ ! -f "$PLAN_PATH" ] && PLAN_PATH="bmn-site/implementation-plan-${TASK_ID}.md"
  if [ ! -f "$PLAN_PATH" ]; then
    echo "❌ BLOCKED: No implementation plan found. Complete Gate 3."
    exit 1
  fi
  if ! grep -q "APPROVED" "$PLAN_PATH"; then
    echo "❌ BLOCKED: Plan not approved by PM/CEO."
    exit 1
  fi
fi

cd bmn-site 2>/dev/null || true
npm run build || { echo "❌ BLOCKED: Build failed"; exit 1; }
npm run lint  || { echo "❌ BLOCKED: Lint failed"; exit 1; }
npm run test  || { echo "❌ BLOCKED: Tests failed"; exit 1; }

echo "✅ All Ralph gates passed — commit allowed"
```

---

## BYPASS PREVENTION

| Mechanism | Prevents |
|-----------|----------|
| Node.js runtime check in G0 | Agents without Node.js producing fake static analysis |
| Pre-dev hook checks G1 + G2 | Starting work without physical audit or research |
| Pre-commit hook checks G1 + G2 + G3 | Committing without audit, research, or approved plan |
| G2 requires `## Codebase Search` | Building features that already exist (INCIDENT-002) |
| G3 requires `## Design Reference` (UI) | Antigravity guessing layouts instead of following design |
| G3 requires `## Success Metric` | Shipping with no definition of "working" |
| G3 requires `## Failure Signal` | Shipping with no way to detect breakage |
| G13 requires preview URL (not localhost) | Missing env vars going undetected before merge (INCIDENT-001) |
| G13 requires design compliance confirmation | UI deviating from approved design without PM notice |
| G14 requires PM APPROVED comment on PR | Antigravity self-certifying its own work |
| G14 requires Code Review Summary | PM reviewing blindly without knowing what changed |
| G11 verifies G3 Success Metric + Failure Signal | Signing off on production with no observability |
| G11 requires mobile + desktop screenshots | Blank pages returning HTTP 200 passing as "working" |
| G11 requires human sign-off checklist | PM approving without opening the live URL (INCIDENT-001) |
| HMAC cryptographic proofs | Forged local proof files |
| CI/CD required status checks | Merging PRs without all gates |

---

**Created:** 2026-02-09
**v14.0:** 2026-02-21
**Status:** ACTIVE & ENFORCED
**Escalation:** Any bypass attempt = P0 incident report
