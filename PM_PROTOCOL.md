# 🎯 PM PROTOCOL v3.0 (ACCOUNTABILITY EDITION)
## Strategic Business Gates for FAANG-Standard Product Development

**Version:** 3.0 (Major Update - 2026-02-12)
**Effective Date:** 2026-02-12
**Status:** ACTIVE
**Owner:** CEO / PM

**🚨 NEW v3.0 ACCOUNTABILITY (CEO Final Warning 2026-02-12):**
- PM is **personally accountable** for project success/failure
- PM **MUST audit codebase** before making ANY recommendations
- PM **MUST update all docs** after approving ANY work
- **Violation = PM removed from project** (non-negotiable)

---

## EXECUTIVE SUMMARY

The PM Protocol ensures **strategic correctness, business alignment, and growth velocity**. A task can pass all 12 Ralph gates (perfect code) but fail PM Protocol and still be rejected.

**Key Principle:** Strategic misalignment wastes more resources than code bugs.

**NEW v3.0 Principle:** PM making recommendations without codebase audit wastes MORE resources than strategic misalignment.

---

## THE 7 PM GATES

### Gate 1: Strategic Alignment ⚔️
**Question:** "Is this work for the RIGHT product?"

| Checkpoint | Required |
|------------|----------|
| Work is for our product, not a competitor | ✅ |
| Advances core mission | ✅ |
| Has competitive differentiation | ✅ |
| PM has validated positioning | ✅ |

**Evidence:** State explicitly: "This work is for [Product Name]"

---

### Gate 2: Product-Market Fit 🎯
**Question:** "Do users actually WANT this?"

| Checkpoint | Required |
|------------|----------|
| User research or data supports this | ✅ |
| Feature in top 3 user requests | ⚠️ Preferred |
| Competitive gap confirmed | ✅ |
| Success metric defined | ✅ |

**Evidence:** Link to user research, Reddit threads, GitHub issues, etc.

---

### Gate 3: Monetization Path 💰
**Question:** "How does this make MONEY?"

| Checkpoint | Required |
|------------|----------|
| Revenue stream identified | ✅ |
| MRR impact quantified | ✅ |
| Timeline to revenue documented | ✅ |
| If foundation layer, path to monetization clear | ✅ |

**Revenue Streams:**
- Subscription tiers
- One-time purchases
- Featured/premium placements
- Advertising/sponsorships

---

### Gate 4: SEO Impact 📈
**Question:** "Will Google RANK it?"

| Checkpoint | Required |
|------------|----------|
| SEO impact identified | ✅ |
| Target keywords defined (5-10) | ✅ |
| Organic traffic estimate | ✅ |
| Internal linking strategy | ⚠️ Preferred |

**Evidence:** Keyword research, competitor SERP analysis

---

### Gate 5: Virality as Product 🔄
**Question:** "Does this create NETWORK EFFECTS?"

| Checkpoint | Required |
|------------|----------|
| Growth mechanic identified | ✅ |
| Retention hook exists | ✅ |
| Sharing incentive built in | ⚠️ Preferred |
| Viral coefficient estimated | ⚠️ Preferred |

---

### Gate 6: Virality as Engineering ⚙️
**Question:** "Can we MEASURE growth?"

| Checkpoint | Required |
|------------|----------|
| Analytics tracking implemented | ✅ |
| Referral attribution working | ⚠️ Preferred |
| Metrics dashboard available | ✅ |
| Viral loop tested | ⚠️ Preferred |

---

### Gate 7: MRR Validation 💹
**Question:** "Does this ladder to $10K MRR baseline?"

| Checkpoint | Required |
|------------|----------|
| Revenue model: Units × Price = MRR | ✅ |
| Pricing competitive | ✅ |
| CAC < LTV | ✅ |
| Path to MRR target documented | ✅ |

---

### Gate 8: PM Documentation Accountability 📝 (NEW v3.0 - 2026-02-12)
**Question:** "Has PM updated ALL documentation to reflect reality?"

**🚨 MANDATORY AFTER APPROVING ANY CODER WORK:**

| Checkpoint | Required | Consequence if Skipped |
|------------|----------|----------------------|
| PROJECT_LEDGER.md updated with completion | ✅ MANDATORY | Ledger out of sync → rework |
| PRD updated if scope changed | ✅ MANDATORY | Specs wrong → wrong builds |
| MASTER-TASK-LIST.md updated | ✅ MANDATORY | Task list inaccurate |
| Related docs updated | ✅ MANDATORY | Documentation rot |
| Codebase audit performed BEFORE recommendations | ✅ MANDATORY | Recommend building existing features |
| Payment provider verification (Razorpay for India, NOT Stripe!) | ✅ MANDATORY | Wrong tech stack |

**NEW PM Workflow (Non-Negotiable):**

```
1. Coder submits work
2. PM performs codebase audit (if making new recommendations)
3. PM reviews with GATE_REPORT_TEMPLATE.md
4. IF APPROVED:
   a. Update PROJECT_LEDGER.md (mark complete, add git hash)
   b. Update PRD (if scope changed)
   c. Update MASTER-TASK-LIST.md (mark done)
   d. Update related docs (README, etc.)
   e. THEN notify CEO of approval
5. IF REJECTED:
   a. Document reason in ledger
   b. Provide actionable feedback
   c. THEN notify CEO of rejection
```

**Enforcement:**
- PM cannot approve next task until current task docs are updated
- CEO will verify doc updates before assigning next work
- **Violation = PM removed from project** (final warning given 2026-02-12)

**Rationale:**
- 2026-02-12 incident: PM didn't know PayPal/Razorpay existed (65% of MVP built, ledger said 0%)
- PM recommended building Stripe (blocked in India) when Razorpay already working
- PM recommended building payment system that was 95% complete
- **Root cause**: PM didn't audit codebase, didn't keep ledger updated
- **Impact**: CEO wasted time, rework planned for existing features

---

## PM ASSESSMENT TEMPLATE (v3.0 - Updated 2026-02-12)

```markdown
# PM Protocol Assessment - [TASK_NAME]

**Task ID:** [ID]
**Date:** [DATE]
**PM:** [NAME]

## 🚨 PRE-ASSESSMENT CHECKLIST (NEW v3.0)
**BEFORE making ANY recommendations:**
- [ ] Audited codebase with Glob/Grep/Read tools
- [ ] Verified what's ACTUALLY built vs ledger claims
- [ ] Checked payment integrations (PayPal? Razorpay? NOT Stripe for India!)
- [ ] Verified tech stack compatibility
- [ ] Read related PRDs and implementation files

**If making recommendations without audit = VIOLATION (PM removed)**

---

## Gate 1: Strategic Alignment ⚔️
- Product: [Product Name]
- Competitive position: [Advances mission / Duplicates competitor]
- **Status:** ✅ PASS / ❌ FAIL

## Gate 2: Product-Market Fit 🎯
- User research: [Evidence link]
- Success metric: [How we measure utility]
- **Status:** ✅ PASS / ❌ FAIL

## Gate 3: Monetization Path 💰
- Revenue stream: [Which stream]
- MRR impact: $[AMOUNT] expected
- Timeline: [When]
- **Status:** ✅ PASS / ❌ FAIL

## Gate 4: SEO Impact 📈
- Pages created: [Number]
- Keywords: [List 3-5]
- Traffic impact: +[Number] visitors/month
- **Status:** ✅ PASS / ❌ FAIL

## Gate 5: Virality as Product 🔄
- Growth mechanic: [How user A brings user B]
- Sharing incentive: [Why share?]
- **Status:** ✅ PASS / ❌ FAIL

## Gate 6: Virality as Engineering ⚙️
- Analytics: [Implemented / Not]
- Metrics dashboard: [Link or description]
- **Status:** ✅ PASS / ❌ FAIL

## Gate 7: MRR Validation 💹
- Model: [Units] × $[Price] = $[MRR]
- Pricing validated: [Yes / No]
- **Status:** ✅ PASS / ⚠️ CONDITIONAL / ❌ FAIL

## Gate 8: PM Documentation Accountability 📝 (NEW v3.0)
**MANDATORY AFTER APPROVAL:**
- [ ] PROJECT_LEDGER.md updated with completion status
- [ ] PRD updated (if scope changed)
- [ ] MASTER-TASK-LIST.md updated
- [ ] Related docs updated (README, guides, etc.)
- [ ] Git hash recorded in ledger
- **Status:** ✅ COMPLETE / ❌ INCOMPLETE

**⚠️ WARNING**: Cannot approve next task until current task docs updated

---

## OVERALL DECISION
- [ ] ✅ APPROVED — Proceed to Ralph Protocol + **MUST complete Gate 8 doc updates**
- [ ] ⚠️ CONDITIONAL — Foundation layer, track metrics + **MUST complete Gate 8 doc updates**
- [ ] 🚫 REJECTED — Strategic misalignment

**PM Signature:** _______________
**Date:** _______________

**Gate 8 Completion (MANDATORY for APPROVED/CONDITIONAL):**
- [ ] Ledger updated: [Yes/No]
- [ ] PRD updated: [Yes/No/N/A]
- [ ] Task list updated: [Yes/No]
- [ ] Docs updated: [Yes/No/N/A]
- **Completed by:** _______________
- **Verified by CEO:** _______________
```

---

## DECISION MATRIX

| Scenario | Ralph | PM | Decision |
|----------|-------|----|----------|
| Perfect feature, right product | 12/12 ✅ | 7/7 ✅ | ✅ APPROVED |
| Perfect code, wrong product | 12/12 ✅ | 0/7 ❌ | 🚫 REJECTED |
| Good code, incomplete monetization | 12/12 ✅ | 5/7 ⚠️ | ⚠️ CONDITIONAL |
| Broken code, right product | 6/12 ❌ | 7/7 ✅ | 🚫 REJECTED |

---

## PM ACCOUNTABILITY

**You (PM) are accountable for:**
1. Verifying strategic alignment BEFORE developer approval
2. Requesting SEO analysis before shipping
3. Confirming growth + monetization math before shipping

**If PM misses a gate:**
- Gate 1 miss → Entire batch fails (wasted work)
- Gate 3 miss → Feature ships without revenue path
- Gate 4 miss → Page lives on dark side of internet

---

## ENFORCEMENT

PM Protocol gates must pass BEFORE Ralph Protocol begins.

```
PM Assessment (7 Gates)
       ↓
PM Verdict: ✅ APPROVED
       ↓
Ralph Protocol Begins (12 Gates)
```

---

**Created:** 2026-02-09
**Status:** ACTIVE
