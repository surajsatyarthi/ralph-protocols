# RALPH PROTOCOL v15.0
## Lean Quality Gates for a Startup That Ships

**Version:** 15.0
**Effective Date:** 2026-02-22
**Owner:** PM (Claude) — AI Coder reads this, does not modify it
**Changelog:**
- v15.0: Complete redesign. Scope tiers. Removed G0, G2, G8, G9, G10. CI is now the primary enforcement layer, not honor-system. Gates tied to real incidents only.
- v14.0: Added G13 (browser walkthrough on preview), G14 (PM APPROVED), G3 observability fields.
- v13.x: G1 enforcement, G11/G12 structure.

---

## Why v14.0 Failed

v14.0 had 14 gates applied uniformly to every change. A nav link fix required the same gates as a payment flow. The result:

- Gates were skipped because they were obviously inapplicable (G10 Lighthouse on a nav link)
- PM granted ad-hoc waivers with no protocol basis
- Protocol became decoration, not enforcement
- Real incident-prevention value was diluted by noise gates

v15.0 fixes this with **scope tiers** and **mechanical CI enforcement**.

---

## Design Principles

1. **Every gate must map to a real incident pattern.** If we cannot name the incident it prevents, the gate is cut.
2. **Mechanical enforcement beats honor system.** CI that blocks bad merges is worth more than 10 documentation requirements.
3. **PM classifies scope. AI Coder cannot self-promote.** Tier determines which gates apply. Only PM sets the tier.
4. **Proportional process for proportional risk.** A nav link and a payment flow do not get the same gates.

---

## Incident → Gate Mapping

| Incident | What Happened | Gate That Prevents It |
|----------|--------------|----------------------|
| INCIDENT-001 | `GITHUB_CLIENT_ID` undefined in Vercel. Worked locally. Broke in production. | G13 (preview URL, not localhost) + CI env parity check |
| INCIDENT-002 | Built competing vertical sidebar when horizontal DashboardNav already existed. | G1 (component audit + codebase search) |
| Self-merge | Antigravity merged its own PR without PM review. | G14 (PM APPROVED) + GitHub branch protection requiring 1 review |
| Destructive revert | Antigravity reverted a PR without PM instruction, deleting unrelated files. | G14 + branch protection |

**These four incidents are the entire justification for this protocol.** Every gate exists to prevent one of them.

---

## SCOPE TIERS (PM Sets This — AI Coder Cannot Change It)

PM writes the tier into the PROJECT_LEDGER.md task entry before AI Coder starts work.

| Tier | Criteria | Examples |
|------|----------|---------|
| **S — Small** | ≤50 lines changed, additive only, no new API routes, no auth changes, no DB mutations, follows existing pattern exactly | Nav link, copy change, icon swap, CSS tweak |
| **M — Medium** | New UI components, new pages, refactors, non-auth API routes, new npm packages | New dashboard section, new API endpoint, component refactor |
| **L — Large** | Auth flows, payments, DB schema changes, new external integrations (OAuth, Stripe, etc.), security-sensitive logic | Login system, checkout flow, new OAuth provider, DB migration |

**Default when in doubt: one tier up.** If PM is unsure between S and M, assign M.

---

## GATES BY TIER

| Gate | Name | Tier S | Tier M | Tier L |
|------|------|--------|--------|--------|
| **CI** | Build + Lint + Typecheck | ✅ Auto | ✅ Auto | ✅ Auto |
| **G1** | Component Audit | ✅ | ✅ | ✅ |
| **G3** | Blueprint & RFC | ❌ | ✅ | ✅ |
| **G4** | Implementation Integrity | ✅ | ✅ | ✅ |
| **G5** | Zero Lint Suppression | ✅ | ✅ | ✅ |
| **G6** | Tests | ❌ | ✅ | ✅ |
| **G7** | Security + Env Parity | ❌ | ❌ | ✅ |
| **G13** | Browser Walkthrough (Preview) | ✅ | ✅ | ✅ |
| **G14** | PM APPROVED | ✅ | ✅ | ✅ |
| **G11** | Production Verification | ✅ | ✅ | ✅ |
| **G12** | Documentation | ❌ | ✅ | ✅ |

**Total gates per tier:**
- Tier S: 6 gates (CI + G1 + G4 + G5 + G13 + G14 + G11)
- Tier M: 9 gates (CI + G1 + G3 + G4 + G5 + G6 + G13 + G14 + G11 + G12)
- Tier L: 10 gates (all of M + G7)

---

## GATE DEFINITIONS

### CI — Build + Lint + Typecheck (Mechanical, Always On)

**Enforced by:** GitHub Actions on every PR. Branch protection blocks merge if CI fails.

```
npm run build       — zero errors
npm run lint        — zero warnings
npx tsc --noEmit    — zero TypeScript errors
```

This is not a gate AI Coder runs manually. It runs automatically on every push. If CI fails, the PR cannot be merged — branch protection enforces this. AI Coder fixes CI failures before requesting PM review.

**Env parity check also runs in CI:**
Compares `.env.example` keys against available environment variables. If a key in `.env.example` is missing in CI, the build fails. This is the mechanical replacement for G0 and the prevention mechanism for INCIDENT-001.

---

### G1 — Component Audit (All Tiers)

**Purpose:** Prevents INCIDENT-002. Verify what exists before building anything.

**Required before writing a single line of code.**

AI Coder must:
1. List all existing components relevant to the task area
2. Run a codebase search proving the feature/component does not already exist
3. Identify which files will be changed and why

**Evidence required (Tier M/L):** `docs/reports/physical-audit-ENTRY-XXX.md`

**Minimum for Tier S:** Codebase search result documented in the commit message or PR description.

**Codebase search format:**
```
$ grep -r "ComponentName" src/
(no results — safe to build)

$ grep -r "existing-pattern" src/components/
(no results)
```

If a result IS found: stop, report to PM, do not build a duplicate.

---

### G3 — Blueprint & RFC (Tier M and L only)

**Purpose:** No code without an approved plan. Prevents scope drift and wrong architecture.

PM must write `APPROVED` in the implementation plan before AI Coder writes code.

**Required sections:**

```markdown
## Problem Statement
[What problem are we solving?]

## Proposed Solution
[What are we building? Which files change and why?]

## Design Reference
[REQUIRED IF ANY UI CHANGES — describe layout or link to design]
[Example: "Follows existing DashboardNav pattern — horizontal sidebar link"]

## Success Metric
[Single signal that proves this works]
[Example: "/database loads 50 companies for authenticated users"]

## Failure Signal
[Error/log that indicates this is broken]
[Example: "HTTP 500 on GET /database" or blank page with no console error]

## Status: APPROVED — PM — YYYY-MM-DD
```

---

### G4 — Implementation Integrity (All Tiers)

**Purpose:** Code matches the approved plan. No scope creep.

AI Coder must implement exactly what G3 describes (for M/L) or what the ledger task describes (for S).

Scope creep >20% = stop, report to PM, get plan updated before continuing.

---

### G5 — Zero Lint Suppression (All Tiers)

**Purpose:** No technical debt injection.

Zero `eslint-disable`, `@ts-ignore`, `@ts-nocheck` in changed files without explicit PM approval documented in the PR.

This is verified by CI (lint step catches most cases) and manually by PM during G14 review.

---

### G6 — Tests (Tier M and L only)

**Purpose:** Regression protection for non-trivial changes.

Tests are required for:
- New API routes: at minimum one integration test verifying the route returns correct status
- New business logic: unit tests covering main code paths
- New components with user interaction: render tests verifying key behaviour

**No coverage percentage requirement.** Tests must be real — not 100% mocked externals. At least one test per external integration must verify real configuration (not just mock it).

**Not required for:**
- Pure layout/styling components with no logic
- Tier S changes

---

### G7 — Security + Env Parity (Tier L only)

**Purpose:** Prevents secrets exposure and missing env vars for high-risk changes.

Required for Tier L only because Tier L is where new external integrations and auth paths are introduced.

1. `npm audit` — no critical or high CVEs
2. No secrets or API keys in source code (CI scans for this)
3. All new env vars added to `.env.example` with placeholder values
4. All new env vars confirmed present in Vercel/production environment

AI Coder reports G7 results in the PR description.

---

### G13 — Browser Walkthrough on Preview URL (All Tiers)

**Purpose:** Prevents INCIDENT-001. Preview URL uses the same env as production — missing vars surface here.

**Critical: Must be the Vercel PREVIEW URL, not localhost.**

Localhost has local `.env.local` that differs from what Vercel deploys. Preview uses the exact same environment as production. This is the only way to catch missing env vars before merge.

**Required report** (`docs/reports/browser-test-ENTRY-XXX.md`):
```
URL tested: https://bmn-site-git-feat-BRANCH-HASH.vercel.app  (NOT localhost)
Breakpoints: 375px (mobile) + 1280px (desktop)
Console errors: 0
User flow: [checklist of key actions tested]
Matches design: YES / NO + reason  (if G3 has Design Reference)
```

If the preview URL doesn't exist yet: push the branch, wait for Vercel to build it, then run G13.

---

### G14 — PM APPROVED (All Tiers)

**Purpose:** Prevents self-merge. Ensures PM human eyes on every merge.

AI Coder posts a **Code Review Summary** to the PR body:
```markdown
## Code Review Summary

### Files Changed
- `src/components/X.tsx` — reason

### Files NOT Changed
- `src/components/Y.tsx` — intentionally unchanged because [reason]

### Scope vs Plan
All changes match approved G3 plan. / Deviations: [list any]
```

PM reviews the diff + summary and comments **"APPROVED"** on the PR.

Branch protection requires 1 approving review before merge is possible. AI Coder cannot approve its own PR.

---

### G11 — Production Verification (All Tiers)

**Purpose:** Confirm the feature works in production after merge.

After merge and deploy:
1. Production URL returns HTTP 200
2. Mobile (375px) + desktop (1280px) screenshots showing the feature works
3. G3 Success Metric confirmed: the metric is observable and passing
4. G3 Failure Signal checked: the error is NOT present

Report filed in `docs/reports/production-verification-ENTRY-XXX.md`.

---

### G12 — Documentation (Tier M and L only)

**Purpose:** Future maintainers (including future AI Coders) can understand what was built and why.

Required sections in `docs/walkthroughs/walkthrough-ENTRY-XXX.md`:
- What changed
- Why it was changed
- How to verify it's working
- How to roll back if it breaks

---

## WHAT WAS REMOVED AND WHY

| Removed | Reason |
|---------|--------|
| **G0 — .env-validated.log ceremony** | Replaced by automated env parity check in CI. Mechanical enforcement beats manual ceremony. |
| **G2 — Web research (3+ searches, 1000 words)** | Never caught an incident. Codebase search (the only useful part) is now in G1. External research is AI Coder's baseline competence, not a gate. |
| **G8 — 80% test coverage** | Unmaintainable at startup velocity. Produces test theater — tests written to hit a number, not to catch bugs. Replaced by G6 which requires real tests for real paths. |
| **G9 — Axe scan per PR** | Run quarterly as a team-wide audit, not per PR. A nav link following existing accessible patterns does not need an axe scan. |
| **G10 — Lighthouse per PR** | Run monthly as a team-wide audit. Lighthouse score doesn't change per nav link. Per-PR Lighthouse is noise. |

---

## MECHANICAL ENFORCEMENT SUMMARY

These mechanisms are PM-controlled. AI Coder cannot bypass them.

| Mechanism | What It Blocks |
|-----------|---------------|
| GitHub Actions CI (build + lint + tsc) | Broken builds, lint errors, TypeScript errors merging to main |
| CI env parity check | Missing env vars shipping to production (INCIDENT-001 class) |
| Branch protection: require CI pass | Any PR that fails CI cannot be merged |
| Branch protection: require 1 PR review | AI Coder cannot merge its own PRs (self-merge incident) |
| G13 requires Vercel preview URL | Using localhost to hide env var issues (INCIDENT-001) |
| G14 PM APPROVED comment | Work shipping without PM human review |

---

## QUARTERLY AUDITS (Not Per-PR)

These run as scheduled tasks, not on every PR:

- **Accessibility audit (axe)** — quarterly, PM-scheduled
- **Lighthouse performance audit** — monthly, PM-scheduled
- **Full npm audit** — monthly in CI as non-blocking, blocking for Tier L

---

## PROJECT LEDGER FORMAT (PM fills this before task starts)

```markdown
## ENTRY-X.Y — [Task name]

**Tier:** S / M / L
**Reason for tier:** [one sentence]
**Gates required:** [list from tier table]
**Success Metric:** [what working looks like]
**Failure Signal:** [what broken looks like]
```

AI Coder does not start work until this section exists in the ledger.

---

**v15.0 — 2026-02-22**
**Owner: PM (Claude)**
**AI Coder: read-only**
