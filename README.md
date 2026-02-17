# RALPH PROTOCOLS (Central Repository)
**Mandatory Governance & Quality Standards for All Projects**

**Updated**: 2026-02-17
**Version**: 8.0 (Mandatory Master Playbook Edition)
**Status**: Active Enforcement

---

## 🎯 NEW ARCHITECTURE (v10.1 Real-Time Forensic)

We have moved from a "Guidelines" model to a **Governance Operating System**.
The single source of truth is now: **`ralph_master_playbook_v8.json`**. // Note: We keep the filename v8 for compatibility but content is v10.1

### Security Audit (2026-02-17)
*   **Status**: PASSED (With Mitigation)
*   **Critical Fix 1**: Split-Key Architecture (Prevents Forgery).
*   **Critical Fix 2**: Forensic Evidence Requirement (Prevents Empty Tests).
*   **Critical Fix 3**: Real-Time Sidecar (Prevents Token Waste).

### Core Changes
1.  **Mandatory**: Rules are no longer optional. They are enforced by the Antigravity platform.
2.  **Turnstile Blocking**: You cannot start Step B until Step A has a proof.
3.  **Real-Time Sidecar**: A background process watches and verifies *as you type*.
4.  **Forensic**: Every verification MUST include zipped logs/screenshots ("The Evidence").
5.  **Proof-Based**: Every check produces a cryptographic proof (HMAC-SHA256).
4.  **Sync-First**: You edit the JSON here, and it syncs to all 5 client projects.
5.  **CICL Enforcement**: Local bypasses (`--no-verify`) are caught by the Server CI/CD.

---

## 🔒 KEY ARCHITECTURE (CRITICAL)

To prevent agents from forging proofs:
*   **Local Dev**: Uses `RALPH_LOCAL_DEV_KEY`. Generates `DEV_PROOF`. Good for PRs.
*   **Production CI**: Uses `RALPH_CI_SECRET_KEY`. Generates `PROD_PROOF`. Required for Release.
*   **Rule**: Production will REJECT any deployment signed with a Dev Key.

---

---

## 📂 REPOSITORY STRUCTURE

### 📜 Core Configuration
*   `ralph_master_playbook_v8.json`: **THE LAW.** The complete configuration for Rules, Skills, and Gates. Sync this file to all projects.

### 📚 Documentation Categories
*   **`protocols/`**: The human-readable definitions of the laws.
    *   `RALPH_PROTOCOL.md`: Technical Gates (1-12).
    *   `PM_PROTOCOL.md`: Strategic Gates (Product/Biz).
    *   `CIRCULAR_ENFORCEMENT.md`: The checks-and-balances system.
*   **`guides/`**: Instructions for Agents and Humans.
    *   `AI_CODER_ADAPTATION_GUIDE.md`: How agents should behave.
    *   `CIRCULAR_ENFORCEMENT_SETUP.md`: Implementation details.
    *   `SHAREABLE_PROMPTS_GUIDE.md`: Standard prompts for communication.
*   **`scripts/`**: Automation tools.
    *   `sync-protocols.js` (and others): deployment logic.
*   **`legacy_reports/`**: Audit results from previous versions (Reference only).
*   **`archive/`**: Deprecated v6.5/v7.0 materials.

---

## 🚀 HOW TO SYNC

To push the latest `ralph_master_playbook_v8.json` to all your projects:

```bash
# In each client project (BMN, etc.)
npm run sync:protocols
```

This will:
1.  Pull the latest JSON from this repo.
2.  Update the project's `.agent/` folder.
3.  Trigger the local Antigravity agent to ingest the new rules.

---

## 🔄 RETRO-AUDIT STRATEGY

For legacy codebases (pre-v8.0):
1.  **Trigger One-Time Baseline**: Run "run retro-audit full baseline on src/" in the project.
2.  **Permanent Delta Mode**: After the baseline, the Verifier Agent automatically checks *only* changed files.

---

**Maintainer Note**: Do not edit files in `protocols/` without also updating `ralph_master_playbook_v8.json`, as the JSON is what the agents actually read.
