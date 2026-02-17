# 🤖 AI Coder Quick Reference Card
## Ralph Protocol v6.5 - Keep This Open While Working

**Print or keep this visible in your context window**

---

## 🚨 NON-NEGOTIABLE (NEVER SKIP)

```
✅ Environment validation BEFORE work    (.env-validated.log required)
✅ Build MUST pass before commit          (npm run build or equivalent)
✅ Tests MUST pass before commit          (npm test or equivalent)
✅ Lint MUST pass before commit           (npm run lint or equivalent)
✅ Implementation plan MUST be approved   (PM/CEO signature required)
✅ Evidence MUST be generated             (screenshots + logs)
✅ QA MUST validate independently         (No self-certification)
✅ Documentation MUST be complete         (What/Why/How to verify)
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

| Gate | Name | What You Must Do | Evidence Required |
|------|------|-----------------|-------------------|
| **G0** | Env Validation | `npm run validate:env` | `.env-validated.log` |
| **G1** | Physical Audit | Read current code/prod | Audit notes |
| **G2** | Research | 3+ web searches, deps | `audit-gate-0-TASK_ID.log` |
| **G3** | Plan + Approval | RFC with alternatives | `implementation_plan.md` + approval |
| **G4** | Implementation | Write code | Git commits |
| **G5** | Security | Scan for P0 vulnerabilities | Security scan output |
| **G6** | Performance | Lighthouse/profiling | Performance report |
| **G7** | Build/Lint | Must pass | Build + lint logs |
| **G8** | Tests | 80%+ coverage | Test output + coverage |
| **G9** | Accessibility | Axe scan, keyboard nav | A11y report |
| **G10** | Staging | Deploy + smoke test | Staging URL + screenshots |
| **G11** | Production | Live verification | Production screenshots |
| **G12** | Documentation | How-to + rollback | `README.md` updates |

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

**Before starting:**
```
✅ .env-validated.log           (Gate 0)
✅ audit-gate-0-TASK_ID.log     (Gate 2)
✅ implementation_plan.md       (Gate 3)
✅ plan-approval.txt            (Gate 3)
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
  ├─→ Is environment validated? NO → Run validate:env FIRST
  │                            YES → Continue
  ├─→ Is plan approved? NO → Create plan, get approval FIRST
  │                     YES → Continue
  ├─→ Are you at Gate 4? NO → Go back, don't skip gates
  │                      YES → Continue
  ├─→ Do tests pass? NO → Fix them, don't commit
  │                  YES → Continue
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
