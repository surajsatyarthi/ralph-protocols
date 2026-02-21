# 🦅 RALPH PROTOCOL v7.0
## FAANG-Standard Technical Quality Gates

**Version:** 7.0 (Complete Gate Coverage + Runtime Validation)
**Effective Date:** 2026-02-21
**Status:** ACTIVE & MECHANICALLY ENFORCED
**Owner:** AI Coder
**Changelog:**
- v7.0: Added Gate 1 mechanical enforcement (was documented but unenforced).
  Added Node.js runtime check to Gate 0. Fixed artifact naming confusion.
  All 12 gates now have scripts. Gate sequence made explicit and unskippable.

---

## EXECUTIVE SUMMARY

Ralph Protocol ensures **FAANG-level code quality** through **12 sequential gates** and **11 non-negotiable commandments**. Every gate is mechanically enforced — there is no honor system.

**Gate Sequence (non-negotiable order):**

```
G0 → G1 → G2 → G3 → G4 → G5 → G6 → G7 → G8 → G9 → G10 → G11 → G12
```

**The three most important sequencing rules:**
1. **G1 before G2**: You MUST observe the current state before researching. You cannot research effectively without knowing what exists.
2. **G2 before G3**: You MUST research before planning. You cannot plan without knowing the landscape.
3. **G3 before G4**: You MUST have an approved plan before writing code. No code without approval.

---

## 🆕 v7.0 ENHANCEMENTS

### Fix 1: Gate 1 Now Has Mechanical Enforcement

**Problem:** Gate 1 (Physical Audit) was documented but had no script. Any agent could skip it.

**Fix:** New script `scripts/gates/gate-1-physical-audit.js` enforces:
- A physical audit document must exist (`docs/reports/physical-audit-ENTRY_ID.md`)
- Document must be anchored to current git HEAD hash
- Document must be ≥50 non-empty lines
- Document must contain: Current State, Git History, Production State, Files/Dependency sections
- Pre-dev hook now checks for BOTH G1 artifact AND G2 artifact (was only G2)

### Fix 2: Node.js Runtime Check in Gate 0

**Problem:** Gate 0 validated env vars and connectivity but never confirmed Node.js was installed. Agents without Node.js produced static guesses instead of real output.

**Fix:** Gate 0 now fails immediately if:
- Node.js is not installed
- Node.js version is below 18.0.0
- npm/pnpm is not available

**Error message:** Clear install instructions with exact required version.

### Fix 3: Artifact Naming Clarification

**The historical naming confusion:**
```
audit-gate-0-TASK_ID.log  ← CONFUSINGLY NAMED (it's the G2 research artifact)
```

This file was named "gate-0" because it predates the formal gate numbering system.
It has always been the **Gate 2 (Research)** artifact, not Gate 0.

**Accepted artifact locations (both valid):**
- `docs/research/ENTRY_ID-research.md` ← **NEW PREFERRED** (explicit, organized)
- `audit-gate-0-ENTRY_ID.log` ← **LEGACY ACCEPTED** (backward compatible)

New projects MUST use `docs/research/`. Existing projects can keep using legacy path.
Verification scripts accept both.

### Fix 4: Gate 4, 8, and 11 Scripts Added

New scripts that were previously absent:
- `scripts/gates/gate-4-implementation.js` — scope creep detection
- `scripts/gates/gate-8-tdd.js` — test coverage enforcement
- `scripts/gates/gate-11-production.js` — production health check

---

## GATE 0: Environment & Runtime Pre-Flight

**Script:** `scripts/gates/gate-0-pre-assign.js`

Before ANY work begins:

```bash
npm run validate:env
```

**What it validates (v7.0):**
1. ✅ **Node.js ≥18.0.0 installed** (NEW — blocks immediately if absent)
2. ✅ npm or pnpm available
3. ✅ All required environment variables present and correctly formatted
4. ✅ Supabase URL is accessible (active HTTP ping)
5. ✅ Supabase Auth service responds to health checks
6. ✅ Local ports match configuration (prevents 54321 vs 55321 mismatches)
7. ✅ Generates `.env-validated.log` as proof of validation

**Enforcement:**
- `predev` hook: Blocks `npm run dev` if Node.js absent or env invalid
- Pre-commit hook: Rejects commits without `.env-validated.log`
- Validation expires after 24 hours (warning shown, hard block after 48h)

**Node.js not found error:**
```
❌ BLOCKED: Node.js not found on this machine.

Gate 0 requires Node.js ≥18.0.0 to run this project.

Install options:
  macOS:   brew install node@20
  Linux:   https://nodejs.org/en/download/package-manager
  nvm:     nvm install 20 && nvm use 20

Cannot proceed without Node.js. All gate checks will produce
inaccurate static analysis instead of real validation.
```

---

## THE 11 COMMANDMENTS

| # | Law | Rule | Severity | Enforcement |
|---|-----|------|----------|-------------|
| 1 | **Limit Law** | All SELECT queries must include LIMIT | P0 | Scanner blocks |
| 2 | **Security Law** | Never use dangerouslySetInnerHTML without DOMPurify | P0 | Build fails |
| 3 | **JSON-LD Law** | Always use safeJsonLd() utility | P0 | Scanner blocks |
| 4 | **Revenue Law** | Payment code uses database, not in-memory | P0 | Deploy blocked |
| 5 | **Sequential Law** | All 12 gates in strict order, no skipping | P0 | Audit log required |
| 6 | **Proof Law** | Evidence = Logs + Screenshots + Git Hash | P0 | Logs required |
| 7 | **Air-Gap Law** | DB writes via server-side only | P0 | Build fails |
| 8 | **Context Law** | Reports anchor to Git HEAD | P1 | Hash verified |
| 9 | **Semantic Law** | Commits reference TASK_ID | P1 | Hook rejects |
| 10 | **Integrity Law** | Reports pass validation | P1 | Exit code blocks |
| 11 | **RFC Law** | Plan has "Alternatives" + CEO/PM approval | P0 | Hook rejects |

---

## THE 12 QUALITY GATES

### PHASE 0: PRE-FLIGHT (BEFORE ANYTHING ELSE)

| Gate | Name | Script | Time | Requirements | Enforcement |
|------|------|--------|------|--------------|-------------|
| **G0** | Environment & Runtime Pre-Flight | `gate-0-pre-assign.js` | 5m | **Node.js ≥18 installed**, env vars present, services reachable | Blocks `npm run dev` and all commits |

---

### PHASE 1: ASSESSMENT (MUST COMPLETE BEFORE PLANNING OR CODING)

| Gate | Name | Script | Time | Requirements | Enforcement |
|------|------|--------|------|--------------|-------------|
| **G1** | Physical Audit & State | `gate-1-physical-audit.js` | 1-2h | Directly observe current code + production. Document in `docs/reports/physical-audit-ENTRY_ID.md` anchored to git HEAD. ≥50 lines. | Pre-dev hook blocks without audit file |
| **G2** | Logic Mapping & Research | `gate-2-research.js` | 2-3h | **3+ web searches documented**. 5+ sources. Alternatives Considered. 1000+ words. Dependency analysis. | Pre-commit hook blocks without research artifact |

**🚨 G1 MUST PRECEDE G2:**
You cannot conduct meaningful research without first directly observing what exists.
The physical audit (G1) tells you WHAT to research.

**Research artifact naming:**
- **New projects:** `docs/research/ENTRY_ID-research.md`
- **Legacy projects:** `audit-gate-0-ENTRY_ID.log` (accepted, but migrate when possible)

---

### PHASE 2: PLANNING (MUST COMPLETE BEFORE CODING)

| Gate | Name | Script | Time | Requirements | Enforcement |
|------|------|--------|------|--------------|-------------|
| **G3** | Blueprint & RFC | `gate-3-scope.js` | 1-2h | Implementation plan with "Alternatives Considered", "Files to Change", CEO/PM approval signature | Pre-commit hook checks for APPROVED signature |

**NO CODE BEFORE G3 APPROVAL.** This is mechanically enforced.

---

### PHASE 3: EXECUTION (ONLY AFTER G1 + G2 + G3 COMPLETE)

| Gate | Name | Script | Time | Requirements | Enforcement |
|------|------|--------|------|--------------|-------------|
| **G4** | Implementation Integrity | `gate-4-implementation.js` | Varies | Execute approved plan. Scope creep >30% = blocked. | Runs during and after implementation |
| **G5** | Strict Lint Suppression | `gate-5-lint-strict.js` | 15m | Zero unexplained `eslint-disable`, `@ts-ignore`, `@ts-nocheck` | Scans all changed files |
| **G6** | Test Quality Analysis | `gate-6-test-quality.js` | 30m | ≥3 assertions/test, <80% mock ratio, real integration tests | Analyzes test files |
| **G7** | Security Suite | `gate-7-security.js` | 30m | Secrets detection, `npm audit` (no critical/high CVEs), OWASP checklist | Blocks on any secrets or critical CVEs |
| **G8** | TDD Proof | `gate-8-tdd.js` | 2-4h | Tests must exist, pass, ≥80% coverage. New source files must have test files. | Runs test suite + coverage parser |
| **G9** | Accessibility Audit | `gate-9-accessibility.js` | 1h | Axe scan, keyboard nav, ARIA labels. WCAG 2.1 AA. | Skip only if no UI changes |

---

### PHASE 4: VERIFICATION

| Gate | Name | Script | Time | Requirements | Enforcement |
|------|------|--------|------|--------------|-------------|
| **G10** | Performance | `gate-10-performance.js` | 30m | Lighthouse ≥80 (median 3 runs), bundle size no regression >10% | Lighthouse CI against staging |
| **G11** | Production Verification | `gate-11-production.js` | 1h + 24h | Live deployment, production URL HTTP 200, screenshot evidence, health check, 24h monitoring sign-off | HTTP ping + screenshot file check |

---

### PHASE 5: DOCUMENTATION

| Gate | Name | Script | Time | Requirements | Enforcement |
|------|------|--------|------|--------------|-------------|
| **G12** | Documentation & Walkthrough | `gate-12-validate.js` | 30m | What changed, why, how to use, rollback procedure. MASTER_TASK_LIST updated. | File existence + required sections check |

---

## COMPLETE EVIDENCE REQUIREMENTS

### Gate 0 (Pre-Flight)
```
✅ .env-validated.log              — Generated by: npm run validate:env
                                     Node.js version confirmed ≥18
                                     Expires: 24h (warning) / 48h (hard block)
```

### Gate 1 (Physical Audit)
```
✅ docs/reports/physical-audit-ENTRY_ID.md
   Required content:
   - Current git HEAD hash
   - Current State Analysis (what exists now)
   - Production State (URL, last deploy, current behavior)
   - Files/Dependency Analysis
   - Known Issues
   Minimum: 50 non-empty lines, no unfilled placeholders
```

### Gate 2 (Research)
```
✅ docs/research/ENTRY_ID-research.md   (NEW preferred path)
   OR audit-gate-0-ENTRY_ID.log         (legacy path, still accepted)
   Required content:
   - ≥3 documented web searches (## Search #N sections)
   - ≥5 source citations
   - Alternatives Considered section
   - Key Findings section
   - ≥1000 words
```

### Gate 3 (Plan)
```
✅ implementation-plan-ENTRY_ID.md
   Required content:
   - Problem Statement
   - Proposed Solution
   - Alternatives Considered
   - Files to Change (explicit list)
   - Approval: "Status: APPROVED — [Name] [Date]"
```

### Gates 4-9 (Execution)
```
✅ git commits on branch with TASK_ID in message
✅ npm run build — PASSED
✅ npm run lint — PASSED
✅ npm run test — PASSED (coverage ≥80%)
✅ Security scan — PASSED (no secrets, no critical CVEs)
```

### Gate 11 (Production)
```
✅ docs/reports/production-verification-ENTRY_ID.md
   Required content:
   - Deployment Timestamp
   - Deployment ID
   - Production URL (HTTP 200 verified)
   - Screenshot path (file must exist)
   - Health Check Results
```

### Gate 12 (Documentation)
```
✅ docs/walkthroughs/walkthrough-ENTRY_ID.md
   Required sections: What Changed, Why, How to Use, Rollback Procedure
```

---

## ENFORCEMENT MECHANISMS

### Pre-dev Hook (v7.0 — checks G0 + G1 + G2)

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

# Extract TASK_ID from branch name
TASK_ID=$(git branch --show-current | grep -oE 'ENTRY-[A-Za-z0-9._-]+' || echo "unknown")

# Gate 1: Physical audit must exist BEFORE research
AUDIT_FOUND=false
for path in \
  "docs/reports/physical-audit-${TASK_ID}.md" \
  "bmn-site/docs/reports/physical-audit-${TASK_ID}.md"; do
  [ -f "$path" ] && AUDIT_FOUND=true && break
done

if [ "$AUDIT_FOUND" = false ] && [ "$TASK_ID" != "unknown" ]; then
  echo ""
  echo "❌ BLOCKED: Gate 1 (Physical Audit) not complete."
  echo ""
  echo "You must observe the current code and production state BEFORE"
  echo "doing any research or writing any code."
  echo ""
  echo "Create: docs/reports/physical-audit-${TASK_ID}.md"
  echo "Required sections: Current State, Git HEAD, Production State, Files"
  echo "Minimum: 50 non-empty lines"
  echo ""
  exit 1
fi

# Gate 2: Research audit must exist
RESEARCH_FOUND=false
for path in \
  "docs/research/${TASK_ID}-research.md" \
  "audit-gate-0-${TASK_ID}.log" \
  "bmn-site/docs/research/${TASK_ID}-research.md" \
  "bmn-site/audit-gate-0-${TASK_ID}.log"; do
  [ -f "$path" ] && RESEARCH_FOUND=true && break
done

if [ "$RESEARCH_FOUND" = false ] && [ "$TASK_ID" != "unknown" ]; then
  echo ""
  echo "❌ BLOCKED: Gate 2 (Research) not complete."
  echo ""
  echo "Required: docs/research/${TASK_ID}-research.md"
  echo "Must contain: 3+ web searches, 5+ sources, Alternatives Considered, 1000+ words"
  echo ""
  exit 1
fi

echo "✅ Pre-dev gates passed (G0 Node.js, G1 Physical Audit, G2 Research)"
```

### Pre-commit Hook (v7.0)

```bash
#!/bin/bash
# .git/hooks/pre-commit

set -e

# Node.js check
if ! command -v node &> /dev/null; then
  echo "❌ BLOCKED: Node.js not found. Install Node.js ≥18."
  exit 1
fi

# Env validation
if [ ! -f ".env-validated.log" ] && [ ! -f "bmn-site/.env-validated.log" ]; then
  echo "❌ BLOCKED: Run 'npm run validate:env' first"
  exit 1
fi

TASK_ID=$(git branch --show-current | grep -oE 'ENTRY-[A-Za-z0-9._-]+' || echo "unknown")

# Gate 1: Physical audit
if [ "$TASK_ID" != "unknown" ]; then
  AUDIT_FOUND=false
  for path in \
    "docs/reports/physical-audit-${TASK_ID}.md" \
    "bmn-site/docs/reports/physical-audit-${TASK_ID}.md"; do
    [ -f "$path" ] && AUDIT_FOUND=true && break
  done
  if [ "$AUDIT_FOUND" = false ]; then
    echo "❌ BLOCKED: No physical audit found. Complete Gate 1 before committing."
    exit 1
  fi
fi

# Gate 2: Research audit
if [ "$TASK_ID" != "unknown" ]; then
  RESEARCH_FOUND=false
  for path in \
    "docs/research/${TASK_ID}-research.md" \
    "audit-gate-0-${TASK_ID}.log" \
    "bmn-site/docs/research/${TASK_ID}-research.md" \
    "bmn-site/audit-gate-0-${TASK_ID}.log"; do
    [ -f "$path" ] && RESEARCH_FOUND=true && break
  done
  if [ "$RESEARCH_FOUND" = false ]; then
    echo "❌ BLOCKED: No research audit found. Complete Gate 2 before committing."
    exit 1
  fi
fi

# Gate 3: Approved plan
if [ "$TASK_ID" != "unknown" ]; then
  PLAN_PATH="implementation-plan-${TASK_ID}.md"
  [ ! -f "$PLAN_PATH" ] && PLAN_PATH="bmn-site/implementation-plan-${TASK_ID}.md"
  if [ ! -f "$PLAN_PATH" ]; then
    echo "❌ BLOCKED: No implementation plan found. Complete Gate 3 before committing."
    exit 1
  fi
  if ! grep -q "APPROVED" "$PLAN_PATH"; then
    echo "❌ BLOCKED: Plan not approved by PM/CEO. Get sign-off before committing."
    exit 1
  fi
fi

# Build gates
cd bmn-site 2>/dev/null || true
npm run build || { echo "❌ BLOCKED: Build failed"; exit 1; }
npm run lint  || { echo "❌ BLOCKED: Lint failed"; exit 1; }
npm run test  || { echo "❌ BLOCKED: Tests failed"; exit 1; }

echo "✅ All Ralph gates passed — commit allowed"
```

### CI/CD Pipeline
- All 12 gates checked on every PR to main
- Security scan runs automatically
- Merge blocked if any gate fails
- HMAC proofs verified by CI runner (cannot be forged locally)

---

## BYPASS PREVENTION

| Mechanism | Prevents |
|-----------|----------|
| Node.js runtime check in G0 | Agents without Node.js producing fake static analysis |
| Pre-dev hook checks G1 + G2 | Starting work without physical audit or research |
| Pre-commit hook checks G1 + G2 + G3 | Committing without audit, research, or approved plan |
| Artifact existence + content check | Empty or template files claiming gate complete |
| 50-line minimum on G1 audit | "Done" in 3 lines to satisfy the check |
| Security scanner | Shipping P0 vulnerabilities or secrets |
| CI/CD required status checks | Merging PRs without all gates |
| HMAC cryptographic proofs | Forged local proof files |
| Production URL HTTP ping | Fake production verification claims |
| Screenshot file existence check | Claiming screenshots without taking them |

---

**Created:** 2026-02-09
**v7.0:** 2026-02-21
**Status:** ACTIVE & ENFORCED
**Escalation:** Any bypass attempt = P0 incident report
