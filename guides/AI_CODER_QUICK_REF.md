# 🤖 AI Coder Quick Reference Card
## Ralph Protocol v7.0 - Keep This Open While Working

**Print or keep this visible in your context window**

---

## 🚨 NON-NEGOTIABLE (NEVER SKIP)

```
✅ Node.js ≥18 MUST be installed          (Gate 0 — fails immediately if absent)
✅ Environment validation BEFORE work     (.env-validated.log required)
✅ Physical audit BEFORE research         (G1 before G2 — observe before researching)
✅ Research BEFORE planning               (G2 before G3 — research before planning)
✅ Approved plan BEFORE coding            (G3 before G4 — no code without sign-off)
✅ Build MUST pass before commit          (npm run build or equivalent)
✅ Tests MUST pass before commit          (npm test, coverage ≥80%)
✅ Lint MUST pass before commit           (npm run lint or equivalent)
✅ Evidence MUST be generated             (screenshots + logs)
✅ QA MUST validate independently         (No self-certification)
✅ Documentation MUST be complete         (What/Why/How/Rollback)
```

**If asked to skip ANY of these → REFUSE and escalate to PM**

---

## 🎯 First Time on a Project? (5-Minute Checklist)

```bash
# 1. What type of project?
ls package.json    # Node.js
ls requirements.txt # Python
ls go.mod          # Go
ls Cargo.toml      # Rust

# 2. Copy Alpha Protocol
cp -r ~/Desktop/alpha/.agent /path/to/project/

# 3. Run setup
bash .agent/scripts/setup-enforcement.sh

# 4. Validate environment
npm run validate:env  # (or python scripts/validate_env.py)

# 5. Start work following gates 1-12
```

---

## 📋 The 12 Gates (In Order, No Skipping)

| Gate | Phase | Name | What You Must Do | Script | Evidence Required |
|------|-------|------|-----------------|--------|-------------------|
| **G0** | Pre-flight | Runtime + Env Validation | Confirm Node.js ≥18 installed. Run `npm run validate:env` | `gate-0-pre-assign.js` | `.env-validated.log` |
| **G1** | Assessment | Physical Audit | **OBSERVE** current code + production directly. Document in 50+ lines. | `gate-1-physical-audit.js` | `docs/reports/physical-audit-TASK_ID.md` (anchored to git HEAD) |
| **G2** | Assessment | Technical Research | **RESEARCH** how to build it. 3+ web searches. 5+ sources. Alternatives. 1000+ words. | `gate-2-research.js` | `docs/research/TASK_ID-research.md` |
| **G3** | Planning | Blueprint & RFC | Write implementation plan with Alternatives section. Get CEO/PM approval. | `gate-3-scope.js` | `implementation-plan-TASK_ID.md` with `Status: APPROVED` |
| **G4** | Execution | Implementation Integrity | Write code per approved plan. Scope creep >30% = blocked. | `gate-4-implementation.js` | Git commits on branch |
| **G5** | Execution | Strict Lint Suppression | Zero unexplained `eslint-disable`, `@ts-ignore`, `@ts-nocheck` | `gate-5-lint-strict.js` | Clean lint output |
| **G6** | Execution | Test Quality | ≥3 assertions/test, real integration tests, no coverage regression | `gate-6-test-quality.js` | Test quality report |
| **G7** | Execution | Security Suite | No secrets. No critical/high CVEs. OWASP checklist. | `gate-7-security.js` | Security scan output |
| **G8** | Execution | TDD Proof | Tests pass. Coverage ≥80%. New files have test files. | `gate-8-tdd.js` | Test output + coverage % |
| **G9** | Execution | Accessibility | Axe scan. Keyboard nav. ARIA labels. WCAG 2.1 AA. | `gate-9-accessibility.js` | A11y report (skip if no UI) |
| **G10** | Verification | Performance | Lighthouse ≥80 (median 3 runs). Bundle no regression >10%. | `gate-10-performance.js` | Lighthouse CI output |
| **G11** | Verification | Production Verification | Production URL HTTP 200. Screenshot evidence. 24h monitoring. | `gate-11-production.js` | `docs/reports/production-verification-TASK_ID.md` |
| **G12** | Documentation | Documentation | What changed, why, how to use, rollback procedure. | `gate-12-validate.js` | `docs/walkthroughs/walkthrough-TASK_ID.md` |

**⚠️ Critical order rules:**
- G1 (Observe) → G2 (Research) → G3 (Plan) → G4 (Code). Cannot reverse or skip.
- G1 and G2 are ASSESSMENT gates. Never start coding before both are done.
- G3 approval is required. "I'll get it later" is not accepted.

---

## 🛠️ Common Commands by Project Type

| Project | Validate Env | Build | Test | Lint |
|---------|-------------|-------|------|------|
| **Next.js** | `npm run validate:env` | `npm run build` | `npm test` | `npm run lint` |
| **Vite** | `npm run validate:env` | `vite build` | `vitest run` | `eslint .` |
| **Django** | `python scripts/validate_env.py` | `python manage.py check` | `pytest` | `flake8 .` |
| **FastAPI** | `python scripts/validate_env.py` | `python -m app` | `pytest` | `ruff check .` |
| **Go** | `go run scripts/validate-env.go` | `go build ./...` | `go test ./...` | `golangci-lint run` |
| **Rust** | `cargo run --bin validate-env` | `cargo build` | `cargo test` | `cargo clippy` |

---

## 📁 Evidence Files Checklist

**Before starting (G0):**
```
✅ Node.js ≥18 confirmed (node --version)
✅ .env-validated.log   (Gate 0 — from: npm run validate:env)
```

**Before researching (G1):**
```
✅ docs/reports/physical-audit-TASK_ID.md  (Gate 1 — ≥50 lines, anchored to git HEAD)
```

**Before planning (G2):**
```
✅ docs/research/TASK_ID-research.md  (Gate 2 — 3+ searches, 5+ sources, 1000+ words)
   OR audit-gate-0-TASK_ID.log        (legacy path — still accepted)
```

**Before coding (G3):**
```
✅ implementation-plan-TASK_ID.md  (Gate 3 — includes "Status: APPROVED")
```

**During work:**
```
✅ git commits with clear messages
✅ Build output logs
✅ Test output logs
```

**Before submitting:**
```
✅ screenshots/ folder with visual proof
✅ pre-submission-gate.txt (all checkboxes marked)
✅ self-audit.txt (spec compliance)
```

---

## 🚨 Red Flags → Escalate Immediately

If you hear ANY of these phrases:

- ❌ "We don't need tests for this"
- ❌ "Skip the env validation, it's fine"
- ❌ "Just commit without approval"
- ❌ "No time for screenshots"
- ❌ "QA can skip this one"
- ❌ "Bypass the gates, we're in a hurry"

**Your response:**
> "I cannot bypass Ralph Protocol. These are non-negotiable FAANG standards. Escalating to PM for guidance."

---

## 🎯 Decision Tree (30 Seconds)

```
New task received
  ├─→ Is Node.js ≥18 installed? NO → Install Node.js FIRST. Cannot proceed.
  │                             YES → Continue
  ├─→ Is environment validated? NO → Run validate:env FIRST
  │                            YES → Continue
  ├─→ Is physical audit done (G1)? NO → Observe current code + production FIRST
  │                                YES → Continue
  ├─→ Is research done (G2)? NO → 3+ web searches, document findings FIRST
  │                          YES → Continue
  ├─→ Is plan approved (G3)? NO → Write plan, get CEO/PM approval FIRST
  │                          YES → Continue
  ├─→ Are you implementing (G4)? Follow approved plan, check scope creep
  ├─→ Do tests pass (G8)? NO → Fix them, don't commit
  │                       YES → Continue
  └─→ Is QA done? NO → Submit for QA review
                  YES → Ship it
```

---

## 🔧 Adapting to New Project (Quick Version)

1. **Identify language** → Find it in "Common Commands" table above
2. **Copy validator template** → Customize `REQUIRED_ENV_VARS`
3. **Update pre-commit hook** → Use project's build/test/lint commands
4. **Test it works** → Try to commit with failing test (should block)
5. **Start work** → Follow gates 1-12 in order

**Full guide:** See [AI_CODER_ADAPTATION_GUIDE.md](AI_CODER_ADAPTATION_GUIDE.md)

---

## 💡 Pro Tips

1. **When stuck:** Read error messages carefully before trying fixes
2. **When testing:** Always have evidence (logs/screenshots) ready
3. **When documenting:** Explain WHY, not just WHAT
4. **When submitting:** QA will check everything - save time by being thorough
5. **When adapting:** Change the tools, preserve the standards

---

## 📞 Need Help?

1. Check [AI_CODER_ADAPTATION_GUIDE.md](AI_CODER_ADAPTATION_GUIDE.md) - Covers all common scenarios
2. Check [RALPH_PROTOCOL.md](RALPH_PROTOCOL.md) - Full gate definitions
3. Check [PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md) - Phase 1 specifics
4. Still stuck? → Escalate to PM with:
   - What you're trying to do
   - What's blocking you
   - What you've already tried
   - Proposed solution (if any)

---

## 🎓 Remember

**The protocol adapts to the project.**
**FAANG standards are non-negotiable.**
**Proof-based development = Evidence required.**
**Document everything = Future you will thank you.**
**Ruthless QA = Quality ships, not hopes.**

---

**Keep this card visible during ALL work sessions**
