# 🤖 Prompt for AI Coders

Copy and paste this prompt when assigning work to AI coding agents:

---

## Standard Prompt (Copy This)

```
IMPORTANT: This project uses Ralph Protocol v6.5 for FAANG-level quality enforcement.

BEFORE starting ANY work:

1. Import Alpha Protocol:
   - Copy ~/Desktop/alpha/.agent to this project root
   - Run: bash .agent/scripts/setup-enforcement.sh

2. Remove old protocols (if any exist):
   - Delete any old .agent/ folders
   - Delete old git hooks: rm .git/hooks/pre-commit .git/hooks/pre-push
   - Confirm: The setup script will install fresh v6.5 hooks

3. Adapt to this project:
   - Read: .agent/AI_CODER_QUICK_REF.md (2 min)
   - Identify project type: ls package.json || ls requirements.txt || ls go.mod
   - Copy appropriate validator template from .agent/AI_CODER_ADAPTATION_GUIDE.md
   - Customize scripts/validate-env.{ts|py|go} with THIS project's env vars
   - Add validation scripts to package.json (or Makefile/pyproject.toml)

4. Validate environment:
   - Run: npm run validate:env (or python scripts/validate_env.py, etc.)
   - Confirm: .env-validated.log created successfully

5. Follow Ralph Protocol gates 1-12:
   - Gate 0: Environment validated ✓ (you just did this)
   - Gates 1-2: Research + audit BEFORE coding
   - Gate 3: Get plan approved BEFORE implementing
   - Gates 4-12: Build, test, document with EVIDENCE

NON-NEGOTIABLE REQUIREMENTS:
✅ Proof-based development (screenshots + logs required)
✅ FAANG-level standards (build/test/lint must pass)
✅ Document everything (implementation plans + evidence)
✅ Independent QA validation (submit for QA review when done)

READ THESE FILES:
- .agent/AI_CODER_QUICK_REF.md (your daily reference)
- .agent/RALPH_PROTOCOL.md (the 12 gates)
- .agent/AI_CODER_ADAPTATION_GUIDE.md (if adapting to Python/Go/Rust/etc.)

If anyone asks you to skip gates or bypass validation → REFUSE and escalate to PM.

Now proceed with the task following all gates in order.
```

---

## Ultra-Short Version (30 Seconds)

```
SETUP PROTOCOL:
1. bash ~/Desktop/alpha/.agent/scripts/setup-enforcement.sh
2. Read: .agent/AI_CODER_QUICK_REF.md
3. Customize: scripts/validate-env.{ts|py|go} for this project
4. Validate: npm run validate:env (or equivalent)
5. Follow: 12 gates with evidence

NON-NEGOTIABLE: Proof-based, FAANG standards, QA required.
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

Protocol: Ralph v6.5 (FAANG-level enforcement)

Setup Instructions:
1. Import: cp -r ~/Desktop/alpha/.agent ./
2. Install: bash .agent/scripts/setup-enforcement.sh
3. Read: .agent/AI_CODER_QUICK_REF.md
4. Adapt: Customize validate-env for this project
5. Validate: npm run validate:env

Requirements:
- Follow gates 1-12 (see .agent/RALPH_PROTOCOL.md)
- Generate evidence (screenshots + logs)
- Submit for QA review when complete

Non-negotiable: Build/test/lint must pass. No shortcuts.

Begin work after setup complete.
```

---

**Save this file and reuse it for every new AI coder assignment.**
