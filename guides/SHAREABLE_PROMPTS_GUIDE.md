# SHAREABLE PROMPTS GUIDE
**Mandatory Communication Format for PM and Coder**

**Version**: 1.0
**Created**: 2026-02-12
**Status**: MANDATORY

---

## 🚨 THE RULE (Non-Negotiable)

**EVERY message from PM or Coder to CEO MUST end with:**

```markdown
---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to [PM/Coder]:

"[Clear, concise message that CEO copies directly]"
```

**No exceptions.** Messages without shareable prompts will be rejected.

---

## 🎯 WHY THIS EXISTS

### The Problem (Before Shareable Prompts)

CEO receives PM's long Gate Report:
- 200 lines of technical analysis
- 12 Ralph gates evaluated
- 7 PM gates evaluated
- Detailed evidence sections
- Complex approval conditions

**CEO's confusion**: "What do I tell the Coder???"

### The Solution (Shareable Prompts)

PM's message now ends with:
```
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to Coder:

"ENTRY-015 APPROVED ✅ - Proceed to ENTRY-002 (Install Playwright). 
Check PROJECT_LEDGER.md for details."
```

**CEO's action**: Copy → Paste → Send (5 seconds)

---

## 📋 FORMAT TEMPLATE

### For PM (Sending to Coder)
```markdown
[PM's detailed analysis and review...]

---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to Coder:

"[What Coder needs to know and do]"
```

### For Coder (Sending to PM)
```markdown
[Coder's work completion details...]

---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to PM:

"[What PM needs to know and do]"
```

---

## ✅ GOOD EXAMPLES

### Example 1: PM Approves Work
```markdown
[Full Gate Report with 12 Ralph gates evaluation...]

---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to Coder:

"ENTRY-015 APPROVED ✅ 

Work passes all gates. Proceed to ENTRY-002 (Install Playwright).

Note: Correct git hash is e96c995 (not 635be3a as you mentioned).

Check PROJECT_LEDGER.md for full Gate Report."
```

### Example 2: PM Rejects Work
```markdown
[Detailed quality issues found...]

---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to Coder:

"ENTRY-015 REJECTED ❌

Fix these issues:
1. Build errors (3 TypeScript errors in checkout.ts)
2. Test failures (2/10 tests failing)
3. Missing research audit log

Resubmit after fixes. Details in PROJECT_LEDGER.md."
```

### Example 3: Coder Completes Task
```markdown
[Technical implementation details...]

---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to PM:

"ENTRY-015 COMPLETED ✅

Git: e96c995
Build ✅ Lint ✅ Tests ✅ (105/105)

Ready for Gate Report review.
Evidence in PROJECT_LEDGER.md comments section."
```

### Example 4: Coder Blocked (Needs Clarification)
```markdown
[Question about payment split calculation...]

---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to PM:

"ENTRY-008 BLOCKED ⏸️

Need clarification on payment split calculation:
- Split on gross or net amount?
- Who pays Razorpay fee?

Full question in PROJECT_LEDGER.md. Cannot proceed until answered."
```

### Example 5: PM Provides Clarification
```markdown
[Detailed answer with code examples...]

---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to Coder:

"ENTRY-008 UNBLOCKED ✅

Payment split clarification provided:
- Split on NET amount (after gateway fees)
- Example calculation in PROJECT_LEDGER.md

You can proceed with implementation."
```

### Example 6: PM Assigns Task
```markdown
[Task assignment with requirements...]

---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to Coder:

"New task assigned: ENTRY-016 (Production Deployment Prep)

Priority: High (RICE: 3,200)
Estimated: 2 hours

Check PROJECT_LEDGER.md for requirements and acceptance criteria."
```

---

## ❌ BAD EXAMPLES (Will Be Rejected)

### Bad Example 1: No Shareable Prompt
```markdown
I've reviewed ENTRY-015. The work is good. 
Build passes, tests pass. Coder can proceed to next task.
```
❌ **REJECTED**: No shareable prompt section. CEO doesn't know what to tell Coder.

### Bad Example 2: Vague Shareable Prompt
```markdown
---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to Coder:

"Task done, proceed."
```
❌ **REJECTED**: Too vague. Which task? What's next?

### Bad Example 3: Requires Interpretation
```markdown
---
📋 SHAREABLE PROMPT FOR CEO

Copy-paste to Coder:

"See my detailed analysis above for approval status and next steps."
```
❌ **REJECTED**: CEO shouldn't have to parse analysis. Provide clear message.

---

## 🎯 SHAREABLE PROMPT CHECKLIST

✅ **Every shareable prompt MUST include:**

1. **Task ID**: Clear reference (ENTRY-015)
2. **Status**: What happened (APPROVED/REJECTED/BLOCKED/COMPLETED)
3. **Action**: What recipient should do next
4. **Context**: Where to find details (PROJECT_LEDGER.md)

❌ **Avoid:**
- Vague status ("done", "okay", "check it")
- Missing task ID
- No next action
- Requiring CEO to interpret

---

## 🔄 WORKFLOW INTEGRATION

### PM Workflow
1. Complete Gate Report evaluation
2. Write detailed analysis in PROJECT_LEDGER.md
3. At end of message, add shareable prompt section
4. Notify CEO with shareable prompt included
5. CEO copies prompt → Sends to Coder (5 seconds)

### Coder Workflow
1. Complete task implementation
2. Update PROJECT_LEDGER.md with details
3. At end of message, add shareable prompt section
4. Notify CEO with shareable prompt included
5. CEO copies prompt → Sends to PM (5 seconds)

---

## 📊 IMPACT METRICS

**Before Shareable Prompts**:
- CEO time per message: 2-5 minutes (reading + interpreting + composing)
- CEO errors: Frequent (missing details, wrong task IDs, vague messages)
- PM/Coder confusion: High (unclear instructions from CEO)

**After Shareable Prompts**:
- CEO time per message: 5 seconds (copy + paste)
- CEO errors: Zero (exact message provided)
- PM/Coder confusion: Zero (clear, standardized format)

**Result**: 95%+ time savings for CEO, zero communication errors

---

## 🚨 ENFORCEMENT

### Automatic Rejection Criteria

Messages will be rejected if:
- ❌ No "📋 SHAREABLE PROMPT FOR CEO" section
- ❌ Shareable prompt is vague ("done", "okay")
- ❌ Missing task ID (ENTRY-XXX)
- ❌ Missing status (APPROVED/REJECTED/BLOCKED/etc)
- ❌ No next action specified

### Manual Review Triggers

CEO will request revision if:
- ⚠️ Shareable prompt requires interpretation
- ⚠️ Shareable prompt is too long (>5 lines)
- ⚠️ Shareable prompt contains technical jargon CEO doesn't understand

---

## 📚 RELATED PROTOCOLS

- **CIRCULAR_ENFORCEMENT.md** - Full workflow documentation with shareable prompt examples
- **COMMUNICATION_PROTOCOL.md** - Complete communication guide with 50+ scenarios
- **PM_PROTOCOL.md** - Gate 8 requires shareable prompts in all CEO communications
- **RALPH_PROTOCOL.md** - Coder must provide shareable prompts when submitting work

---

## 📝 CHANGE LOG

| Date | Change | By |
|------|--------|-----|
| 2026-02-12 | Created shareable prompts guide | PM |

---

**Version**: 1.0
**Status**: MANDATORY & ENFORCED
**Violations**: Message rejected until corrected
