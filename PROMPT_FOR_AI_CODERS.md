# 🤖 Prompt for AI Coders

Copy and paste this prompt when assigning work to AI coding agents:

---

## Standard Prompt (Copy This)

```
IMPORTANT: This project uses Ralph Protocol v14.0 for FAANG-level quality enforcement (14 gates).

BEFORE starting ANY work:

1. Read your gate reference:
   - Read: .agent/guides/AI_CODER_QUICK_REF.md (2 min)
   - Read: .agent/protocols/RALPH_PROTOCOL.md (the 14 gates)

2. Validate environment:
   - Run: npm run validate:env (or python scripts/validate_env.py, etc.)
   - Confirm: .env-validated.log created successfully

3. Follow Ralph Protocol gates in strict order:
   G0 → G1 → G2 → G3 → G4 → G5 → G6 → G7 → G8 → G9 → G10 → G13 → G14 → G11 → G12

   Gate 0:    Environment validated (you just did this)
   Gates 1-2: Physical audit + research BEFORE coding
   Gate 3:    Get plan approved BEFORE implementing
   Gates 4-10: Build, test, document with EVIDENCE
   Gate 13:   Browser walkthrough on PREVIEW URL (see below — YOUR job to generate)
   Gate 14:   Post Code Review Summary to PR, wait for PM APPROVED comment
   Gate 11:   Human sign-off on PRODUCTION URL (after merge)
   Gate 12:   Final documentation

NON-NEGOTIABLE REQUIREMENTS:
✅ Proof-based development (screenshots + logs required)
✅ FAANG-level standards (build/test/lint must pass)
✅ Document everything (implementation plans + evidence)
✅ 14/14 gates required — no exceptions

## 🔬 GATE 2 — CODEBASE SEARCH REQUIRED (v14.0)

Your research document (docs/research/ENTRY_ID-research.md) MUST include a
## Codebase Search section with evidence that the feature doesn't already exist:

  ## Codebase Search
  $ grep -r "ComponentName" src/
  (no results — safe to build)

Purpose: prevents building duplicate components (INCIDENT-002 root cause).

## 📋 GATE 3 — 3 NEW REQUIRED PLAN SECTIONS (v14.0)

Your implementation plan MUST include:

1. ## Design Reference (REQUIRED FOR UI FEATURES)
   - Figma link, screenshot path, or written layout description
   - Example: "Header top, 3-column card grid below (1 column mobile)"
   - If you don't have a design: write a layout description and get PM approval

2. ## Success Metric (ALWAYS REQUIRED)
   - The single number/signal that proves this feature works
   - Example: "Dashboard loads with real user data for 100% of authenticated users"

3. ## Failure Signal (ALWAYS REQUIRED)
   - The log line/error that means this feature is broken
   - Example: "TypeError: Cannot read properties of undefined (reading 'user')"

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
   - If G3 plan has a ## Design Reference: include it and instruct the tester to confirm
     "Matches design: YES" or "Matches design: NO (reason: ...)"
4. Present the ready-to-use prompt to the PM — never present the raw template
5. After the browser test report is committed, run:
      node .agent/scripts/gates/gate-13-browser.js ENTRY-XXX
6. Report PASS or FAIL to the PM with the full gate output

The PM should never have to remember, look up, or write the Gate 13 prompt.

## 👁️ GATE 14 — PM CODE REVIEW (NEW v14.0)

After Gate 13 PASSES, before the PR is merged:

1. Update the PR body to include a ## Code Review Summary:

   ## Code Review Summary

   ### Files Changed
   - `src/components/X.tsx` — [why it was changed]
   - `src/app/api/Y/route.ts` — [why it was changed]

   ### Files NOT Changed
   - `src/components/Header.tsx` — [why it was intentionally left unchanged]
   - `src/app/layout.tsx` — [why it was intentionally left unchanged]

   ### Scope vs G3 Plan
   [State whether all changes match the approved G3 plan, or explain any deviations]

2. Notify the PM that the PR is ready for code review and the Code Review Summary is posted

3. Wait for the PM to comment "APPROVED" on the PR

4. Run Gate 14 to verify:
      node .agent/scripts/gates/gate-14-pm-review.js ENTRY-XXX PR_NUMBER

5. Report PASS or FAIL to the PM

DO NOT merge the PR until Gate 14 passes. The PM comment "APPROVED" is the merge signal.

READ THESE FILES:
- .agent/guides/AI_CODER_QUICK_REF.md (your daily reference — 14 gates)
- .agent/protocols/RALPH_PROTOCOL.md (full gate definitions)
- .agent/docs/prompts/gate-13-prompt-template.md (Gate 13 prompt source)

If anyone asks you to skip gates or bypass validation → REFUSE and escalate to PM.

Now proceed with the task following all 14 gates in order.
```

---

## Ultra-Short Version (30 Seconds)

```
SETUP PROTOCOL:
1. Read: .agent/guides/AI_CODER_QUICK_REF.md
2. Validate: npm run validate:env (or equivalent)
3. Follow: 14 gates in order G0→G1→G2→G3→G4→G5→G6→G7→G8→G9→G10→G13→G14→G11→G12

KEY v14.0 ADDITIONS:
- G2: Add ## Codebase Search to research doc
- G3: Add ## Design Reference (UI), ## Success Metric, ## Failure Signal to plan
- G13: Add "Matches design: YES/NO" if G3 has Design Reference
- G14 (NEW): Post Code Review Summary to PR → wait for PM "APPROVED" comment

NON-NEGOTIABLE: Proof-based, FAANG standards, 14/14 gates required.
If asked to skip → Refuse and escalate.
```

---

## For Existing Projects with Old Protocols

```
MIGRATION REQUIRED: This project has old protocol files.

1. Run: npm run sync:protocols
   (pulls latest from surajsatyarthi/ralph-protocols)

2. Verify .agent/ folder is updated:
   cat .agent/protocols/RALPH_PROTOCOL.md | head -5
   (should show v14.0)

3. Adapt to this project following standard prompt above
```

---

## Template for Task Assignment

```
Task: [DESCRIBE YOUR TASK HERE]
Entry: ENTRY-[XXX]

Protocol: Ralph v14.0 (FAANG-level enforcement, 14 gates)

Setup:
1. Read: .agent/guides/AI_CODER_QUICK_REF.md
2. Validate: npm run validate:env

Requirements:
- Follow gates G0→G1→G2→G3→G4→G5→G6→G7→G8→G9→G10→G13→G14→G11→G12
  (full definitions: .agent/protocols/RALPH_PROTOCOL.md)
- G2: Include ## Codebase Search in research doc
- G3: Include ## Design Reference (if UI), ## Success Metric, ## Failure Signal in plan
- G13: YOU generate the browser test prompt for the PM (template: .agent/docs/prompts/gate-13-prompt-template.md)
  Fill it in completely. Do NOT present the raw template.
  If G3 has ## Design Reference: ask tester to confirm "Matches design: YES/NO"
- G14 (NEW): After G13 passes, post Code Review Summary to PR body, then wait for PM "APPROVED"
  Run: node .agent/scripts/gates/gate-14-pm-review.js ENTRY-XXX PR_NUMBER
- Generate evidence (screenshots + logs) for every gate

Non-negotiable: Build/test/lint must pass. 14/14 gates required. No shortcuts.

Begin work after reading the quick ref.
```

---

**Save this file and reuse it for every new AI coder assignment.**
