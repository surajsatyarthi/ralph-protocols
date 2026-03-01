---
description: "End-of-task checklist: ensure G12 doc, PR link, CI link, and final ledger status are posted."
---

# /wrap-up ENTRY-XXX — Task Wrap-Up Workflow

Run this workflow when you believe a task is complete. It ensures nothing is missed before declaring "done."

## Step 1: Verify G12 Walkthrough

Check for the walkthrough document (e.g., `docs/walkthroughs/walkthrough-ENTRY-XXX.md`).

If missing → create it now. It must contain:
- What was changed (files modified, components added/removed)
- What was tested (commands run, exit codes captured)
- Validation results (screenshots if UI, CI link if available)

## Step 2: Verify PR is Open

// turbo
```bash
gh pr list --head feat/entry-xxx --json number,url,state 2>/dev/null || echo "gh CLI not available — check manually"
```

If no PR exists → **STOP**. Open the PR first.

## Step 3: Verify CI Status

Check: does the PR have a CI run?
- If CI is failing → **STOP**. Fix the failures before wrapping up.
- If CI is passing → record the CI link.

## Step 4: Post Final Status

Post this block in `PROJECT_LEDGER.md` under the current task:

```
### ENTRY-XXX — Final Status [YYYY-MM-DD]
- **PR:** <link to PR>
- **CI:** <link to CI run> | <PASS/FAIL>
- **G12 Doc:** <path to walkthrough>
- **Build:** EXIT_CODE=<code>
- **Lint:** EXIT_CODE=<code>
- **Status:** Awaiting PM G14 review
```

## Step 5: Iron Rule Verification

Confirm each item:
- [ ] PR link in the ledger
- [ ] CI link in the ledger
- [ ] Walkthrough document created
- [ ] PR NOT merged (PM merges after G14)

## Step 6: Notify PM

Confirm to PM: "ENTRY-XXX is ready for G14 review."

## Rules

- Do **NOT** say "done" until steps 1-5 are all checked.
- The Coder does **NOT** merge. The PM merges after G14 review.
- If any step fails, fix it before declaring readiness.
