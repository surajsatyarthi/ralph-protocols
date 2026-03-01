---
description: "Run build, lint, and tests. Capture exact exit codes. Format output as ledger-ready evidence."
---

# /verify-build — Build Verification Workflow

Execute verification in this exact order. Modeled after `adamreger/ecc-antigravity` `/verify` workflow.

## Step 1: Build Check

// turbo
Run the build command for this project. Capture the exact exit code.

```bash
npm run build 2>&1; echo "EXIT_CODE=$?"
```

If `EXIT_CODE≠0` → report errors and **STOP**. Post the exact error output in the ledger. Do not proceed.

## Step 2: Type Check

// turbo
Run the type checker. Report all errors with file:line.

```bash
npx tsc --noEmit 2>&1; echo "EXIT_CODE=$?"
```

## Step 3: Lint Check

// turbo
Run the linter. Report warnings and errors.

```bash
npm run lint 2>&1; echo "EXIT_CODE=$?"
```

If `EXIT_CODE≠0` → report errors and **STOP**. Post the exact output in the ledger.

## Step 4: Test Suite

// turbo
Run all tests. Report pass/fail count.

```bash
npm run test 2>&1; echo "EXIT_CODE=$?" || echo "No test script found"
```

## Step 5: Debug Statement Audit

Search for debug statements in source files:

```bash
grep -rn "console.log" src/ --include="*.ts" --include="*.tsx" | head -20
```

Report locations if found.

## Step 6: Generate Evidence Block

Format this exact evidence block for the ledger:

```
### Verify-Build Evidence [YYYY-MM-DD]
- **Build:** EXIT_CODE=<code> | <PASS/FAIL>
- **Types:** EXIT_CODE=<code> | <PASS/X errors>
- **Lint:**  EXIT_CODE=<code> | <PASS/X issues>
- **Tests:** EXIT_CODE=<code> | <X/Y passed>
- **Debug:** <OK/X debug statements found>

Ready for PR: [YES/NO]
```

## Step 7: Post Evidence

Post the evidence block in `PROJECT_LEDGER.md` under the current task entry.

## Rules

- **NEVER** type "build passed" or "all tests passed" without running the actual commands first.
- **NEVER** summarize output — paste the exact exit codes.
- If any step fails, **STOP** and post the error. Do not attempt to fix and re-run silently.
- If you fix an issue, re-run the **entire** workflow from Step 1 — do not skip steps.
