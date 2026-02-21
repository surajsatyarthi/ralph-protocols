# 🤖 Prompt for AI Coders

Copy and paste this prompt when assigning work to AI coding agents:

---

## Standard Prompt (Copy This)

```
IMPORTANT: This project uses Ralph Protocol v13.1 for FAANG-level quality enforcement (13 gates).

BEFORE starting ANY work:

1. Read your gate reference:
   - Read: .agent/guides/AI_CODER_QUICK_REF.md (2 min)
   - Read: .agent/protocols/RALPH_PROTOCOL.md (the 13 gates)

2. Validate environment:
   - Run: npm run validate:env (or python scripts/validate_env.py, etc.)
   - Confirm: .env-validated.log created successfully

3. Follow Ralph Protocol gates in order G0→G1→G2→G3→G4→G5→G6→G7→G8→G9→G10→G13→G11→G12:
   - Gate 0: Environment validated ✓ (you just did this)
   - Gates 1-2: Research + audit BEFORE coding
   - Gate 3: Get plan approved BEFORE implementing
   - Gates 4-10: Build, test, document with EVIDENCE
   - Gate 13: Browser walkthrough on PREVIEW URL (see below — YOUR job to generate)
   - Gate 11: Human sign-off on PRODUCTION URL (after merge)
   - Gate 12: Final documentation

NON-NEGOTIABLE REQUIREMENTS:
✅ Proof-based development (screenshots + logs required)
✅ FAANG-level standards (build/test/lint must pass)
✅ Document everything (implementation plans + evidence)
✅ 13/13 gates required — no exceptions

## 🌐 GATE 13 — YOUR JOB TO GENERATE THE PROMPT

The PM does not look up prompt templates. YOU generate the Gate 13 browser test
prompt and present it to the PM. They either approve it or copy-paste it.

When Gate 10 is complete and the branch is pushed (Vercel preview URL exists):

1. Ask the PM for the preview URL if you don't already have it
2. Read: .agent/docs/prompts/gate-13-prompt-template.md
3. Generate the complete, filled-in prompt for this specific ENTRY:
   - Replace ENTRY-XXX with the actual entry ID
   - Insert the actual preview URL
   - Add the feature-specific user flow steps (what to click through)
   - Add any auth credentials needed for testing
4. Present the ready-to-use prompt to the PM — never present the raw template
5. After the browser test report is committed, run:
      node .agent/scripts/gates/gate-13-browser.js ENTRY-XXX
6. Report PASS or FAIL to the PM with the full gate output

The PM should never have to remember, look up, or write the Gate 13 prompt.

READ THESE FILES:
- .agent/guides/AI_CODER_QUICK_REF.md (your daily reference)
- .agent/protocols/RALPH_PROTOCOL.md (the 13 gates)
- .agent/docs/prompts/gate-13-prompt-template.md (Gate 13 prompt source)

If anyone asks you to skip gates or bypass validation → REFUSE and escalate to PM.

Now proceed with the task following all gates in order.
```

---

## Ultra-Short Version (30 Seconds)

```
SETUP PROTOCOL:
1. Read: .agent/guides/AI_CODER_QUICK_REF.md
2. Validate: npm run validate:env (or equivalent)
3. Follow: 13 gates in order G0→…→G10→G13→G11→G12 with evidence
4. Gate 13: YOU generate the browser test prompt for the PM — see Standard Prompt above

NON-NEGOTIABLE: Proof-based, FAANG standards, 13/13 gates required.
If asked to skip → Refuse and escalate.
```

---

## For Existing Projects with Old Protocols

```
MIGRATION REQUIRED: This project has old protocol files.

1. Backup old protocols:
   BACKUP_DIR=".protocol-backup-$(date +%Y%m%d-%H%M%S)"
   mkdir -p "$BACKUP_DIR"
   [ -d ".agent" ] && cp -r .agent "$BACKUP_DIR/"

2. Remove old protocols:
   rm -rf .agent/
   rm -f .git/hooks/pre-commit .git/hooks/pre-push

3. Install Alpha Protocol v6.5:
   cp -r ~/Desktop/alpha/.agent ./
   bash .agent/scripts/setup-enforcement.sh

4. Adapt to this project (see standard prompt above)

Old protocols backed up to: $BACKUP_DIR
```

---

## Template for Task Assignment

```
Task: [DESCRIBE YOUR TASK HERE]
Entry: ENTRY-[XXX]

Protocol: Ralph v13.1 (FAANG-level enforcement, 13 gates)

Setup:
1. Read: .agent/guides/AI_CODER_QUICK_REF.md
2. Validate: npm run validate:env

Requirements:
- Follow gates G0→G1→G2→G3→G4→G5→G6→G7→G8→G9→G10→G13→G11→G12 (see .agent/protocols/RALPH_PROTOCOL.md)
- Generate evidence (screenshots + logs) for every gate
- Gate 13: YOU generate the browser test prompt for the PM (template at .agent/docs/prompts/gate-13-prompt-template.md)
  Do NOT ask the PM to write this prompt. Fill it in and present it ready-to-use.

Non-negotiable: Build/test/lint must pass. 13/13 gates required. No shortcuts.

Begin work after reading the quick ref.
```

---

**Save this file and reuse it for every new AI coder assignment.**
