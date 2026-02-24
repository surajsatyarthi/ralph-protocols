# AI Coder Quick Reference — Ralph Protocol v16.1

**Read-only. Written by PM. Do not modify.**

---

## BEFORE YOU START ANY TASK

**Step 0 — Branch hygiene (do this before anything else):**
```bash
git fetch origin
git checkout -b feat/ENTRY-X origin/main
```
Never continue on an existing branch that already has old merged work on it. Always branch from current `origin/main`. Confirm with `git rev-parse origin/main` — record this SHA. You will need it for the PR.

Check the PROJECT_LEDGER.md entry for your task. It must have:
- `**Tier:** S / M / L` — set by PM
- `**Gates required:**` — set by PM

If the tier is not set: post in PROJECT_LEDGER.md and wait. Do not start work.

---

## GATE CHECKLIST BY TIER

### Tier S (Small — ≤50 lines, additive, no API/auth/DB)

```
[ ] CI passes (automatic — fix if failing before anything else)
[ ] G1 — Codebase search: grep for existing component/feature, confirm not duplicate
[ ] G4 — Code matches task description exactly. No extras.
[ ] G5 — Zero eslint-disable / @ts-ignore in your changes
[ ] G13 — Browser walkthrough on VERCEL PREVIEW URL (not localhost)
         File: docs/reports/browser-test-ENTRY-XXX.md
[ ] G14 — Code Review Summary in PR body including:
         CI Run: <GitHub Actions run URL> ✅ passed
         Branch base: branched from `main` at SHA <sha>
         Wait for PM "APPROVED" comment.
[ ] G11 — After merge: production URL HTTP 200, screenshots confirming feature works
```

---

### Tier M (Medium — new components, pages, non-auth routes)

```
[ ] CI passes (automatic — fix if failing before anything else)
[ ] G1 — Full component audit: docs/reports/physical-audit-ENTRY-XXX.md (with codebase search)
[ ] G3 — Implementation plan: implementation-plan-ENTRY-XXX.md
         PM must write "APPROVED" before you write code
[ ] G4 — Code matches approved plan. Scope creep >20% = stop and report.
[ ] G5 — Zero eslint-disable / @ts-ignore in your changes
[ ] G6 — Tests for new logic/routes/interactions (no 100% mocked externals)
[ ] G13 — Browser walkthrough on VERCEL PREVIEW URL
         File: docs/reports/browser-test-ENTRY-XXX.md
[ ] G14 — Code Review Summary in PR body including:
         CI Run: <GitHub Actions run URL> ✅ passed
         Branch base: branched from `main` at SHA <sha>
         Wait for PM "APPROVED" comment.
[ ] G11 — After merge: production verification + G3 Success Metric confirmed
         File: docs/reports/production-verification-ENTRY-XXX.md
[ ] G12 — Walkthrough doc: docs/walkthroughs/walkthrough-ENTRY-XXX.md
```

---

### Tier L (Large — auth, payments, DB schema, new external integrations)

```
[ ] All Tier M gates above, PLUS:
[ ] G7 — npm audit (no critical/high CVEs)
         New env vars added to .env.example
         New env vars confirmed in Vercel before merge
```

---

## NON-NEGOTIABLE RULES

**G13 must use the Vercel PREVIEW URL — never localhost.**
Localhost has your local .env.local. Preview uses the same environment as production.
INCIDENT-001 happened because localhost hid a missing env var. Don't repeat it.

**G1 must include a codebase search.**
Before building anything: grep for it. If it exists, do not build a duplicate.
INCIDENT-002 happened because this was skipped. Don't repeat it.

**G14 requires PM "APPROVED" comment. You cannot merge your own PR.**
Branch protection enforces this mechanically. There is no workaround.

**CI run URL is required in the PR body.**
Include `CI Run: <URL> ✅ passed` and `Branch base: SHA <sha>` in your Code Review Summary. PM will not open the code review without it. If CI hasn't triggered, wait. If it failed, fix it first.

---

## RED FLAGS — STOP AND REPORT TO PM

- You are about to build something that grep found already exists
- CI is failing and you cannot figure out why after 2 attempts
- The task is bigger than the tier suggests (Tier S that turns into 200 lines)
- A change requires touching auth, payments, or DB schema but tier is S or M
- You are considering adding eslint-disable or @ts-ignore

Post in PROJECT_LEDGER.md. Wait for PM direction. Do not improvise.

---

## EVIDENCE FILES SUMMARY

| Gate | File | Required for |
|------|------|-------------|
| G1 | `docs/reports/physical-audit-ENTRY-XXX.md` | M, L |
| G3 | `implementation-plan-ENTRY-XXX.md` | M, L |
| G13 | `docs/reports/browser-test-ENTRY-XXX.md` | S, M, L |
| G14 | Code Review Summary in PR body | S, M, L |
| G11 | `docs/reports/production-verification-ENTRY-XXX.md` | S, M, L |
| G12 | `docs/walkthroughs/walkthrough-ENTRY-XXX.md` | M, L |

---

**v16.1 — 2026-02-25 — Owner: PM (Claude)**
