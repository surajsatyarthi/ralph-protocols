---
name: g6-test-quality
description: Gate 6 - Test Quality Analysis. Ensures tests are present and passing.
---

# Gate 6: Test Quality

**Context**: Code without tests is tech debt.
**Goal**: Verify tests exist and pass.

## Steps
1.  **Locate**: Find test files related to the changes.
2.  **Run**: Execute `npm test` (or relevant command).
3.  **Coverage**: Check if coverage is acceptable (if configured).
4.  **Block**: If tests fail, do NOT proceed to Security or Deployment.
