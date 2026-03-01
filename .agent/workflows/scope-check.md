---
description: "Compare modified files against the PM's approved scope manifest before every commit."
---

# /scope-check — Scope Verification Workflow

Run this workflow before every `git add` or `git commit` to verify you are not modifying files outside the PM's approved scope.

## Step 1: Identify Task Scope

Identify the current task ID (e.g., `ENTRY-XXX`). Read the G3 blueprint for this task in `PROJECT_LEDGER.md` and extract the list of authorized files.

If no G3 blueprint exists, **STOP** — you cannot commit without a scope manifest.

## Step 2: List Modified Files

// turbo
```bash
git diff --name-only HEAD
```

## Step 3: Compare Against Scope Manifest

For each modified file, check: is it listed in the G3 blueprint?

- If **YES** for all files → proceed to Step 5.
- If **ANY** file is NOT in the G3 blueprint → proceed to Step 4.

## Step 4: Scope Violation Detected

**STOP immediately.** Do not commit.

1. List the unauthorized files.
2. Post an error in the ledger:

```
[SCOPE VIOLATION] ENTRY-XXX
Files modified outside G3 blueprint:
- <file 1>
- <file 2>
Awaiting PM guidance.
```

3. Wait for PM to either expand the scope or instruct you to revert.

## Step 5: Scope Confirmed

Confirm: "All modified files are within the approved G3 scope for ENTRY-XXX."

Proceed to commit.

## Rules

- This workflow applies to **EVERY** commit, not just the final one.
- If you realize you need to modify an out-of-scope file, post a request in the ledger and wait for PM approval. Do not "just fix it."
- The scope manifest is the G3 blueprint. If the PM verbally says "also fix X", that does not count until it is written in the ledger.
