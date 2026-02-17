# 🤖 AI Coder Adaptation Guide
## Ralph Protocol v6.5 - Multi-Project Implementation

**Target Audience:** AI Coding Agents (Claude, GPT, etc.)
**Purpose:** Adapt Ralph Protocol to ANY project while maintaining FAANG standards
**Status:** MANDATORY READING before starting work on ANY project

---

## ⚡ CRITICAL: READ THIS FIRST

### Non-Negotiable Core Principles

These **NEVER CHANGE** regardless of project type:

```yaml
IMMUTABLE_LAWS:
  proof_based_development: REQUIRED
    - Every claim requires evidence (logs, screenshots, test output)
    - No "trust me, it works" - show the proof

  faang_level_standards: ENFORCED
    - Build must pass before commit
    - Tests must pass before commit
    - Lint must pass before commit
    - Security scans required

  documentation_everything: MANDATORY
    - What changed (git commit messages)
    - Why changed (implementation plans)
    - How to verify (evidence files)
    - How to rollback (documented procedures)

  ruthless_qa: ENABLED
    - Independent verification by QA Agent
    - PM validates business alignment
    - CEO spot-checks evidence authenticity

  environment_validation: PHASE_1_REQUIREMENT
    - Validate env BEFORE starting work
    - Generate .env-validated.log
    - Block dev/commit without validation
```

**If a project tries to bypass these → REJECT and escalate to PM/CEO**

---

## 📋 Adaptation Framework

### Step 1: Identify Project Type

Run this checklist when you first encounter a project:

```bash
# Check 1: What framework?
ls package.json && echo "Node.js/JavaScript" ||
ls requirements.txt && echo "Python" ||
ls go.mod && echo "Go" ||
ls Cargo.toml && echo "Rust" ||
echo "Unknown - investigate"

# Check 2: What's the build system?
grep "next" package.json && echo "Next.js" ||
grep "vite" package.json && echo "Vite" ||
grep "webpack" package.json && echo "Webpack" ||
grep "django" requirements.txt && echo "Django" ||
echo "Custom build"

# Check 3: What's the test framework?
grep "vitest" package.json && echo "Vitest" ||
grep "jest" package.json && echo "Jest" ||
grep "pytest" requirements.txt && echo "Pytest" ||
echo "No tests - ADD THEM"

# Check 4: What environment?
ls .env.local && echo "Local env configured" ||
ls .env.example && echo "Has example - copy it" ||
echo "No env - CREATE IT"
```

### Step 2: Adapt Validation Script

**File to modify:** `scripts/validate-env.ts` (or `.py`, `.go`, etc.)

#### Template for Different Languages

<details>
<summary><b>Node.js/TypeScript (Default)</b></summary>

Use the provided `validate-env.ts` as-is. Customize only:
- `REQUIRED_ENV_VARS` object (add your project's variables)
- Connectivity tests (add project-specific health checks)

```typescript
const REQUIRED_ENV_VARS = {
  // Add YOUR project's env vars here
  NEXT_PUBLIC_API_URL: { ... },
  DATABASE_URL: { ... },
  // Keep the pattern, change the vars
}
```
</details>

<details>
<summary><b>Python/Django</b></summary>

Create `scripts/validate_env.py`:

```python
#!/usr/bin/env python3
"""
Ralph Protocol v6.5 - Environment Validation (Python)
"""
import os
import sys
import requests
from datetime import datetime

REQUIRED_ENV_VARS = {
    'DATABASE_URL': {
        'description': 'PostgreSQL connection string',
        'example': 'postgresql://user:pass@localhost:5432/db',
        'production': True,
    },
    'DJANGO_SECRET_KEY': {
        'description': 'Django secret key',
        'example': 'django-insecure-...',
        'production': True,
    },
}

def validate_environment():
    missing = []

    print("🔍 Ralph Protocol v6.5 - Python Environment Validation")
    print("=" * 60)

    for var, config in REQUIRED_ENV_VARS.items():
        value = os.getenv(var)
        if not value:
            missing.append(var)
            print(f"❌ MISSING: {var}")
            print(f"   {config['description']}")
        else:
            print(f"✅ {var}")

    # Generate validation log
    if not missing:
        with open('.env-validated.log', 'w') as f:
            f.write(f"Validated at: {datetime.now().isoformat()}\n")
            f.write("Status: PASSED\n")
        print("\n✅ All checks passed")
        return 0
    else:
        print(f"\n❌ {len(missing)} variables missing")
        return 1

if __name__ == '__main__':
    sys.exit(validate_environment())
```

Update `package.json` → `pyproject.toml` or Makefile:
```makefile
validate-env:
	python scripts/validate_env.py

dev: validate-env
	python manage.py runserver
```
</details>

<details>
<summary><b>Go</b></summary>

Create `scripts/validate-env.go`:

```go
package main

import (
    "fmt"
    "os"
    "time"
)

var requiredEnvVars = map[string]string{
    "DATABASE_URL": "PostgreSQL connection string",
    "API_KEY":      "API authentication key",
}

func main() {
    fmt.Println("🔍 Ralph Protocol v6.5 - Go Environment Validation")

    missing := []string{}
    for key, desc := range requiredEnvVars {
        if os.Getenv(key) == "" {
            missing = append(missing, key)
            fmt.Printf("❌ MISSING: %s (%s)\n", key, desc)
        } else {
            fmt.Printf("✅ %s\n", key)
        }
    }

    if len(missing) == 0 {
        // Write validation log
        f, _ := os.Create(".env-validated.log")
        defer f.Close()
        f.WriteString(fmt.Sprintf("Validated: %s\n", time.Now()))
        fmt.Println("\n✅ All checks passed")
        os.Exit(0)
    } else {
        fmt.Printf("\n❌ %d variables missing\n", len(missing))
        os.Exit(1)
    }
}
```

Update `Makefile`:
```makefile
validate-env:
	go run scripts/validate-env.go

dev: validate-env
	go run main.go
```
</details>

### Step 3: Adapt Build/Test Commands

**Modify:** `.git/hooks/pre-commit` (created by setup script)

Find the project's actual commands:

```bash
# For Node.js projects
npm run build || pnpm build || yarn build

# For Python projects
python manage.py check || pytest

# For Go projects
go build ./... || go test ./...

# For Rust projects
cargo build || cargo test
```

**Example pre-commit hook adaptation:**

```bash
#!/bin/bash
# Ralph Protocol v6.5 - Pre-commit (Adapted for Python/Django)

# GATE 0: Environment validation (ALWAYS REQUIRED)
if [ ! -f ".env-validated.log" ]; then
  echo "❌ BLOCKED: Run 'make validate-env' first"
  exit 1
fi

# GATE 1: Django checks (instead of npm run build)
if ! python manage.py check --deploy; then
  echo "❌ BLOCKED: Django checks failed"
  exit 1
fi

# GATE 2: Linting (adapted)
if ! flake8 .; then
  echo "❌ BLOCKED: Lint failed"
  exit 1
fi

# GATE 3: Tests (adapted)
if ! pytest; then
  echo "❌ BLOCKED: Tests failed"
  exit 1
fi

echo "✅ All gates passed (Python/Django)"
```

---

## 🎯 Project-Specific Customization Matrix

| Project Type | Env Validator | Build Command | Test Command | Lint Command |
|--------------|--------------|---------------|--------------|--------------|
| **Next.js** | `validate-env.ts` | `npm run build` | `npm test` | `npm run lint` |
| **Vite/React** | `validate-env.ts` | `vite build` | `vitest run` | `eslint .` |
| **Django** | `validate_env.py` | `python manage.py check` | `pytest` | `flake8 .` |
| **FastAPI** | `validate_env.py` | `python -m app` | `pytest` | `ruff check .` |
| **Go** | `validate-env.go` | `go build ./...` | `go test ./...` | `golangci-lint run` |
| **Rust** | `validate-env.rs` | `cargo build` | `cargo test` | `cargo clippy` |
| **Ruby/Rails** | `validate_env.rb` | `rails assets:precompile` | `rspec` | `rubocop` |

**AI Coder Action:** When you encounter a project, find its row in this table and adapt accordingly.

---

## 📝 Evidence Requirements (Universal)

These files are **REQUIRED** for all projects, regardless of language/framework:

### Before Starting Work
```
✅ .env-validated.log           (Gate 0 - Phase 1)
✅ audit-gate-0-TASK_ID.log     (Research audit)
✅ implementation_plan.md       (RFC with alternatives)
✅ plan-approval.txt            (PM/CEO signature)
```

### During Implementation
```
✅ build-output.log             (npm run build or equivalent)
✅ test-output.log              (npm test or equivalent)
✅ lint-output.log              (npm run lint or equivalent)
```

### After Completion
```
✅ screenshots/                 (Visual proof of working features)
✅ pre-submission-gate.txt      (Completed checklist)
✅ self-audit.txt               (Spec compliance verification)
```

**Format doesn't matter, evidence does. Screenshot + log = valid proof.**

---

## 🛠️ Common Adaptation Scenarios

### Scenario 1: Project Has No Tests

**❌ WRONG:** "This project doesn't have tests, so I'll skip Gate 8"

**✅ RIGHT:**
1. Add testing framework to project
2. Write minimal smoke tests (1-2 tests)
3. Document in implementation plan: "Added Vitest + 2 smoke tests"
4. Future work: Expand to 80% coverage

**Pre-commit hook adaptation:**
```bash
# If tests don't exist yet, create placeholder
if [ ! -d "tests" ] && [ ! -d "__tests__" ]; then
  echo "⚠️  WARNING: No test directory found"
  echo "Creating placeholder test..."
  mkdir -p tests
  echo "// TODO: Add real tests" > tests/placeholder.test.ts
fi

# Run tests (will pass with placeholder)
npm test || exit 1
```

### Scenario 2: Project Uses Different Env Var Names

**Example:** Project uses `SUPABASE_URL` not `NEXT_PUBLIC_SUPABASE_URL`

**✅ Adaptation:**
```typescript
// In validate-env.ts
const REQUIRED_ENV_VARS = {
  // Use THEIR naming convention
  SUPABASE_URL: {  // Not NEXT_PUBLIC_SUPABASE_URL
    description: 'Supabase URL',
    example: 'https://xxx.supabase.co',
    production: true,
    testConnectivity: true,
  },
}
```

### Scenario 3: Monorepo with Multiple Projects

**Example:** `apps/web`, `apps/api`, `packages/shared`

**✅ Adaptation:**
```bash
# In pre-commit hook, validate ALL workspaces
for workspace in apps/web apps/api; do
  echo "Validating $workspace..."
  cd "$workspace"

  if [ ! -f ".env-validated.log" ]; then
    echo "❌ $workspace: Environment not validated"
    exit 1
  fi

  npm run build || exit 1
  npm test || exit 1

  cd - > /dev/null
done
```

### Scenario 4: CI/CD Platform Restrictions

**Example:** Vercel doesn't allow pre-commit hooks

**✅ Adaptation:**
```json
// In vercel.json
{
  "buildCommand": "npm run validate:env && npm run build",
  "installCommand": "npm install"
}
```

**Add CI check:**
```yaml
# .github/workflows/ci.yml
- name: Gate 0 - Environment Validation
  run: npm run validate:env

- name: Check validation log exists
  run: test -f .env-validated.log || exit 1
```

### Scenario 5: Legacy Project with Existing Workflow

**Example:** Project already has a complex build script

**✅ Adaptation:**
```bash
# Don't replace their build - wrap it
# In pre-commit hook:

# Gate 0: Environment (NEW - always add this)
if [ ! -f ".env-validated.log" ]; then
  echo "❌ Run 'npm run validate:env' first"
  exit 1
fi

# Gates 1-3: Use their existing script (don't reinvent)
if ! bash scripts/their-existing-build-script.sh; then
  echo "❌ Existing build script failed"
  exit 1
fi

# Add evidence logging
echo "Build completed at $(date)" >> build-output.log
```

---

## 🎓 AI Coder Decision Tree

When starting work on a new project, follow this flowchart:

```
START: New project encountered
  │
  ▼
┌─────────────────────────────────────────┐
│ 1. Does .agent/ folder exist?           │
│    YES → Read protocols, they're active │
│    NO  → Install Alpha Protocol first   │
└────────────────┬────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│ 2. Run project type detection           │
│    (See Step 1 above)                   │
└────────────────┬────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│ 3. Does validate-env script exist?      │
│    YES → Customize REQUIRED_ENV_VARS    │
│    NO  → Copy template for language     │
└────────────────┬────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│ 4. Does pre-commit hook exist?          │
│    YES → Verify it checks .env log      │
│    NO  → Run setup-enforcement.sh       │
└────────────────┬────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│ 5. Adapt build/test/lint commands       │
│    (Use project's actual commands)      │
└────────────────┬────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│ 6. Validate environment                 │
│    Run: npm run validate:env (or equiv) │
└────────────────┬────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│ 7. Start work following Ralph Protocol  │
│    All 12 gates apply, evidence required│
└─────────────────────────────────────────┘
```

---

## 📊 Customization vs Non-Negotiable

### ✅ YOU CAN CUSTOMIZE:

- **Language/Framework:** Python, Go, Rust, etc. (not just Node.js)
- **Build commands:** `go build`, `cargo build`, `python manage.py check`
- **Test commands:** `pytest`, `go test`, `cargo test`
- **Env variable names:** Match project's existing conventions
- **Directory structure:** `src/`, `app/`, `cmd/`, etc.
- **File formats:** `.ts`, `.py`, `.go`, `.rs`, etc.

### ❌ YOU CANNOT SKIP:

- **Gate 0:** Environment validation (ALWAYS required)
- **Evidence files:** `.env-validated.log`, audit logs, screenshots
- **Pre-commit blocking:** Build/test/lint MUST pass
- **Plan approval:** CEO/PM must approve before coding
- **QA validation:** Independent QA agent checks your work
- **Documentation:** Implementation plans, commit messages, evidence
- **FAANG standards:** 80% test coverage, security scans, accessibility

**If someone asks to skip these → Escalate to PM with explanation why it's non-negotiable**

---

## 🚨 Red Flags: When to Escalate

Escalate to PM/CEO if you encounter:

1. **"We don't need tests"** → Violation of FAANG standards
2. **"Skip the env validation, it's fine"** → Violation of Phase 1
3. **"Just commit it without approval"** → Violation of Gate 3
4. **"Don't bother with screenshots"** → Violation of evidence requirement
5. **"QA can skip this one"** → Violation of ruthless QA principle
6. **"We're in a hurry, bypass the gates"** → Violation of entire protocol

**Your response:**
> "I cannot bypass Ralph Protocol gates. These are FAANG-level standards that ensure quality and prevent production incidents. Escalating to PM for approval to proceed differently."

---

## 🎯 Quick Reference: AI Coder Checklist

Copy this checklist for EVERY new project:

```markdown
# Ralph Protocol v6.5 - Project Setup Checklist

## Phase 1: Discovery
- [ ] Identified project type (Node.js/Python/Go/etc.)
- [ ] Found build command: ______________
- [ ] Found test command: ______________
- [ ] Found lint command: ______________
- [ ] Checked for existing .agent/ folder

## Phase 2: Installation
- [ ] Copied Alpha Protocol to .agent/
- [ ] Ran setup-enforcement.sh
- [ ] Verified pre-commit hook created
- [ ] Verified pre-push hook created

## Phase 3: Customization
- [ ] Copied validate-env template for language
- [ ] Customized REQUIRED_ENV_VARS with project's vars
- [ ] Adapted pre-commit hook with correct commands
- [ ] Added validation to dev/build scripts
- [ ] Tested validation: npm run validate:env (or equiv)

## Phase 4: Verification
- [ ] Validation creates .env-validated.log
- [ ] Pre-commit blocks without validation log
- [ ] Build command works and blocks bad commits
- [ ] Test command works and blocks bad commits
- [ ] Lint command works and blocks bad commits

## Phase 5: Documentation
- [ ] Added project-specific notes to .agent/README.md
- [ ] Documented custom env vars in .env.example
- [ ] Updated team docs with validation instructions

## Ready to Start Work
- [ ] Environment validated
- [ ] All gates verified working
- [ ] Evidence directories created (screenshots/, logs/)
- [ ] Ready to follow Ralph Protocol gates 1-12
```

---

## 📖 Real-World Examples

### Example 1: Next.js SaaS (Default)

**No adaptation needed** - use templates as-is:
- `validate-env.ts` → Add your Supabase/Stripe/etc. vars
- Pre-commit hook → Works out of the box
- Evidence: Screenshots + logs + test output

### Example 2: Python Django API

**Adaptations:**
1. Create `scripts/validate_env.py` (see Python template above)
2. Modify pre-commit to use `python manage.py check`
3. Add `pytest` and `flake8` to pre-commit
4. Evidence: Same format (logs + screenshots)

**What stays the same:**
- Gate 0 still requires `.env-validated.log`
- Still need audit logs, implementation plans
- QA still validates evidence independently

### Example 3: Go Microservice

**Adaptations:**
1. Create `scripts/validate-env.go` (see Go template above)
2. Modify pre-commit to use `go build ./...`
3. Add `go test -race ./...` to pre-commit
4. Add `golangci-lint run` to pre-commit

**What stays the same:**
- Same 12 gates, same evidence requirements
- Same PM approval process
- Same QA validation process

### Example 4: Rust CLI Tool

**Adaptations:**
1. Create `scripts/validate-env.rs`
2. Pre-commit: `cargo build && cargo test && cargo clippy`
3. Evidence format: Same (logs + screenshots)

**What stays the same:**
- Proof-based development still required
- FAANG-level standards still enforced
- Documentation still mandatory

---

## 🔮 Future: Multi-Language Template Library

Coming soon to Alpha Protocol:

```
templates/
├── node/
│   └── validate-env.ts
├── python/
│   └── validate_env.py
├── go/
│   └── validate-env.go
├── rust/
│   └── validate-env.rs
├── ruby/
│   └── validate_env.rb
└── java/
    └── ValidateEnv.java
```

For now: Adapt the TypeScript template to your language using examples above.

---

## 📞 Support for AI Coders

**Stuck on adaptation?**

1. **Check this guide first** - Common scenarios covered above
2. **Review the project type matrix** - Find your language/framework
3. **Look at evidence requirements** - Format flexible, proof mandatory
4. **Check decision tree** - Follow the flowchart
5. **Still stuck?** Escalate to PM with:
   - Project type
   - What you're trying to adapt
   - What's blocking you
   - Proposed solution that maintains FAANG standards

---

## 🎓 Key Takeaways for AI Coders

1. **ADAPT the tools, PRESERVE the standards**
   - Change the language, keep the rigor
   - Change the commands, keep the gates
   - Change the format, keep the evidence

2. **When in doubt, ADD MORE PROOF**
   - Extra screenshot? Good.
   - Extra log file? Good.
   - Extra documentation? Good.
   - Less evidence? BAD.

3. **Every project is different, standards are universal**
   - Python needs pytest, Node needs vitest → BOTH need tests
   - Django needs checks, Next needs build → BOTH need validation
   - All need: env validation, evidence, QA, documentation

4. **Your job: Make it impossible to ship bad code**
   - Not "encourage quality" → ENFORCE quality
   - Not "suggest tests" → REQUIRE tests
   - Not "hope for evidence" → GENERATE evidence

---

**Version:** 1.0
**Status:** ACTIVE
**Applies to:** ALL projects using Ralph Protocol v6.5+
**Last Updated:** 2026-02-11

**Remember:** The protocol adapts to the project, but FAANG standards are non-negotiable.
