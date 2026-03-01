---
description: "Session startup checks: verify no direct-to-main commits, check for orphan branches, read current task context."
---

# /session-start — Session Start Workflow

Run this workflow at the beginning of every new conversation or coding session.

## Step 1: Check for Direct-to-Main Commits

// turbo
```bash
git log origin/main --oneline -10
```

Review the last 10 commits on main. If ANY commit was made directly (not via a PR merge — identifiable by missing `(#XX)` suffix), flag it:

```
[WARNING] Direct-to-main commit detected: <hash> <message>
```

Post in the ledger under the current date.

## Step 2: Check for Orphan Branches

// turbo
```bash
git branch -r --no-merged origin/main
```

List remote branches not yet merged to main. Report them:

```
[INFO] Orphan branches found:
- origin/feat/entry-xxx (last commit: <date>)
```

These may represent incomplete tasks.

## Step 3: Verify Current Branch

// turbo
```bash
git branch --show-current
```

- If on `main` → **switch** to the correct feature branch before doing any work.
- If on a feature branch → confirm it matches the current task assignment.

## Step 4: Read Current Task Assignment

Open `PROJECT_LEDGER.md` and find the latest PM assignment:
- Task ID
- G3 blueprint scope (authorized files)
- Priority
- Any blocking notes

## Step 5: Read Hard Rules

Read `CLAUDE.md` to refresh:
- Project-specific commands
- Forbidden patterns
- Role boundaries

## Step 6: Confirm Session Readiness

Report:
```
Session started [YYYY-MM-DD]
- Task: ENTRY-XXX
- Branch: feat/entry-xxx
- Scope: <list of authorized files from G3>
- Direct-to-main violations: <none / list>
- Orphan branches: <none / list>
```

## Rules

- This workflow runs **BEFORE** any code changes.
- If you discover a direct-to-main commit, report it but do not attempt to revert it. Wait for PM guidance.
- If you are on the wrong branch, switch before doing anything else.
- Never start coding without completing this workflow.
