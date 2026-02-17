---
name: g0-pre-assign
description: Gate 0 - Pre-Assignment Dupe Blocker. Verifies no existing feature overlaps with the request.
---

# Gate 0: Pre-Assignment Dupe Blocker

**Context**: innovative features are often duplicates.
**Goal**: Verify that the requested feature does not already exist in the codebase.

## Steps
1.  **Search**: Use `grep_search` and `find_by_name` to look for keywords related to the user request.
2.  **Analyze**: Review the results. Is there existing code that does this?
3.  **Audit**: Create a log `audit-gate-0-<TASK_ID>.log` with your findings.
4.  **Proof**: If unique, write "No duplicates found" to the log.
5.  **Stop**: If duplicate, STOP and notify user.
