# 🦅 RALPH PROTOCOL v14.0
## FAANG-Standard Technical Quality Gates

**Version:** 14.0 — See full reference: `protocols/RALPH_PROTOCOL.md`
**Effective Date:** 2026-02-21
**Status:** ACTIVE & MECHANICALLY ENFORCED

---

## Gate Sequence (non-negotiable)

```
G0 → G1 → G2 → G3 → G4 → G5 → G6 → G7 → G8 → G9 → G10 → G13 → G14 → G11 → G12
```

**14 gates total. All mandatory. No skipping.**

---

## The 14 Gates at a Glance

| Gate | Phase | Name | Key Requirement |
|------|-------|------|----------------|
| **G0** | Pre-flight | Environment Validation | Node.js ≥18, env vars, `.env-validated.log` |
| **G1** | Assessment | Physical Audit | Observe current code + production. ≥50 lines. List existing components (UI tasks). |
| **G2** | Assessment | External Research | 3+ web searches. **`## Codebase Search` required** — prove feature doesn't exist. 1000+ words. |
| **G3** | Planning | Blueprint & RFC | Approved plan. **`## Design Reference`** (UI). **`## Success Metric`**. **`## Failure Signal`**. |
| **G4** | Execution | Implementation Integrity | Code per approved plan. Scope creep >30% = blocked. |
| **G5** | Execution | Strict Lint Suppression | Zero unexplained eslint-disable / @ts-ignore. |
| **G6** | Execution | Test Quality | ≥3 assertions/test. Real integration tests. No 100% mocked externals. |
| **G7** | Execution | Security Suite | No secrets. No critical CVEs. Env parity check. |
| **G8** | Execution | TDD Proof | Tests pass. Coverage ≥80%. |
| **G9** | Execution | Accessibility | Axe scan. WCAG 2.1 AA. Skip if no UI. |
| **G10** | Verification | Performance | Lighthouse ≥80. Bundle no regression >10%. |
| **G13** | Verification | Browser Walkthrough (Preview) | Test PREVIEW URL. Screenshots (375px + 1280px). Console errors = 0. **`Matches design: YES/NO`** if G3 has Design Reference. |
| **G14** | Verification | PM Code Review | Antigravity posts Code Review Summary to PR. PM comments **"APPROVED"**. |
| **G11** | Verification | Production Verification | HTTP 200. Mobile + desktop screenshots. Human checklist. **G3 must have Success Metric + Failure Signal.** |
| **G12** | Documentation | Documentation | What changed, why, how to use, rollback. |

---

## New in v14.0 — What Antigravity Must Do Differently

### G2 Research Document: Add `## Codebase Search`

```markdown
## Codebase Search

Searched repo for existing implementations of [feature]:

$ grep -r "featureName" src/
(no results — safe to build)
```

**Why:** Prevents building duplicate components (INCIDENT-002 root cause).

---

### G3 Implementation Plan: Add 3 New Sections

```markdown
## Design Reference
[UI features only — Figma link, screenshot path, or written layout description]
Example: "Header at top, card grid below (3 columns on desktop, 1 on mobile)"

## Success Metric
[Single number/signal proving the feature works]
Example: "Dashboard loads with real user data for 100% of authenticated requests"

## Failure Signal
[Log line/error that indicates the feature is broken]
Example: "TypeError: Cannot read properties of undefined (reading 'user')" in console
```

**Why:** No feature should ship without knowing what "working" and "broken" look like.

---

### G13 Browser Test Report: Add Design Compliance

If the G3 plan has a `## Design Reference`, add this line to the browser test report:

```
Matches design: YES
```
or:
```
Matches design: NO (reason: sidebar is vertical but design shows horizontal)
```

---

### G14: New Gate — PM Code Review

After G13 passes, Antigravity adds a `## Code Review Summary` to the PR body:

```markdown
## Code Review Summary

### Files Changed
- `src/components/X.tsx` — [reason]

### Files NOT Changed
- `src/components/Y.tsx` — [reason it was intentionally left unchanged]
```

Then: PM reviews the PR and comments **"APPROVED"**.

Then: Run `node scripts/gates/gate-14-pm-review.js ENTRY-XXX PR_NUMBER` to verify.

---

## Evidence Checklist

```
G0:  .env-validated.log
G1:  docs/reports/physical-audit-ENTRY_ID.md          (≥50 lines, anchored to git HEAD)
G2:  docs/research/ENTRY_ID-research.md                (## Codebase Search required)
G3:  implementation-plan-ENTRY_ID.md                   (APPROVED + Design Ref + Success Metric + Failure Signal)
G4-G10: git commits, build pass, lint pass, test pass (≥80% coverage), Lighthouse ≥80
G13: docs/reports/browser-test-ENTRY_ID.md            (preview URL, screenshots, 0 errors, Matches design: YES/NO)
G14: APPROVED comment on GitHub PR                     (Code Review Summary in PR body)
G11: docs/reports/production-verification-ENTRY_ID.md (HTTP 200, screenshots, checklist, G3 observability verified)
G12: docs/walkthroughs/walkthrough-ENTRY_ID.md
```

---

**Full reference:** `protocols/RALPH_PROTOCOL.md`
**Scripts:** `scripts/gates/gate-N-*.js`
**Quick ref card:** `guides/AI_CODER_QUICK_REF.md`

---

**v14.0 — 2026-02-21 — ACTIVE & ENFORCED**
