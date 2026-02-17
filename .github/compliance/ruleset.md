# GitHub Ruleset Policy for Ralph v12.0

To activate **Server-Side Supremacy**, you must manually configure the following Ruleset in your GitHub Repository Settings.

**Target:** `main`, `develop`, `releases/**`

## Enforcements
1.  **Require Status Checks to Pass**
    *   Check: `Ralph-CICL-Verifier / The Iron Dome`
    *   Strict: **True** (Do not allow bypass)
2.  **Require Pull Request Reviews**
    *   Required Approvals: 1
3.  **Block Force Pushes**: **True**
4.  **Block Deletions**: **True**
5.  **Require Signed Commits**: **True**

**Why?**
This moves the enforcement from your laptop (bypassable) to GitHub (non-bypassable).
Even if you run `kill -9 sidecar` locally, you **cannot merge** until the CI Workflow passes on the server.
