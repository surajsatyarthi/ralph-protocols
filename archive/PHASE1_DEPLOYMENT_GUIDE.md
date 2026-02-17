# 🚀 Phase 1 Deployment Guide
## Ralph Protocol v6.5 - Environment Validation Enhancement

**Status:** PRODUCTION READY
**Date:** 2026-02-11
**Target Audience:** Developers deploying to existing projects

---

## 📋 Overview

Phase 1 adds **mechanical environment validation** to prevent RALPH-003 class failures:
- ❌ **Before v6.5:** Agent wastes hours debugging wrong port/URL configurations
- ✅ **After v6.5:** Environment validated in <5 seconds before work starts

**What Changed:**
- New **Gate 0**: Environment pre-flight validation
- Blocks `npm run dev` if environment misconfigured
- Pre-commit hook requires `.env-validated.log`
- Active connectivity testing (not just variable presence)

---

## 🎯 Quick Start (5 Minutes)

### For New Projects

```bash
# 1. Copy alpha protocol to your project
cd /path/to/your-project
cp -r ~/Desktop/alpha/.agent ./

# 2. Run automated setup
bash .agent/scripts/setup-enforcement.sh

# 3. Add required npm scripts to package.json
npm pkg set scripts.predev="npm run validate:env"
npm pkg set scripts.validate:env="tsx scripts/validate-env.ts"
npm pkg set scripts.validate:env:production="tsx scripts/validate-env.ts --environment=production"

# 4. Install required dependency
npm install -D tsx @types/node

# 5. Validate your environment
npm run validate:env

# 6. Start development (will auto-validate)
npm run dev
```

### For Existing Projects with Alpha Protocol

```bash
# 1. Update to v6.5
cd /path/to/your-project
cp ~/Desktop/alpha/templates/validate-env.ts .agent/templates/
cp ~/Desktop/alpha/scripts/setup-enforcement.sh .agent/scripts/

# 2. Re-run setup to update hooks
bash .agent/scripts/setup-enforcement.sh

# 3. Copy validation script to your project
cp .agent/templates/validate-env.ts scripts/

# 4. Customize scripts/validate-env.ts with your env vars
# (See Customization section below)

# 5. Add scripts to package.json (see above)

# 6. Test validation
npm run validate:env
```

---

## 🔧 Customization Guide

### Step 1: Edit `scripts/validate-env.ts`

Update the `REQUIRED_ENV_VARS` object with your project's specific variables:

```typescript
const REQUIRED_ENV_VARS = {
  // Your Supabase config
  NEXT_PUBLIC_SUPABASE_URL: {
    description: 'Supabase project URL',
    example: 'https://xxxxx.supabase.co',
    production: true,
    testConnectivity: true,  // Will ping this URL
  },

  // Your API keys
  YOUR_API_KEY: {
    description: 'Description of this key',
    example: 'sk_test_...',
    production: true,
    testConnectivity: false,  // Just check presence
  },

  // Local development only
  LOCAL_DEV_VAR: {
    description: 'Only needed for local dev',
    example: 'some-value',
    production: false,  // Not required in production
    testConnectivity: false,
  },
} as const;
```

**Key fields:**
- `production: true` → Required for production deployment
- `production: false` → Optional (warnings only)
- `testConnectivity: true` → Script will actively ping this URL
- `testConnectivity: false` → Only checks presence/format

### Step 2: Configure Package.json Hooks

Add to your `package.json`:

```json
{
  "scripts": {
    "predev": "npm run validate:env",
    "dev": "next dev",
    "prebuild": "npm run validate:env",
    "build": "next build",
    "validate:env": "tsx scripts/validate-env.ts",
    "validate:env:production": "tsx scripts/validate-env.ts --environment=production",
    "validate:env:skip-network": "tsx scripts/validate-env.ts --skip-connectivity"
  }
}
```

**What each script does:**
- `predev` → Auto-runs before `npm run dev`
- `prebuild` → Auto-runs before `npm run build`
- `validate:env` → Manual validation (full check)
- `validate:env:production` → Only checks production-required vars
- `validate:env:skip-network` → Skips connectivity tests (faster, vars only)

---

## 🧪 Testing Your Setup

### Test 1: Valid Environment

```bash
# Should pass and create .env-validated.log
npm run validate:env

# Check the log was created
ls -la .env-validated.log

# Should show: ✅ All checks passed
```

### Test 2: Missing Variable

```bash
# Temporarily rename your .env.local
mv .env.local .env.local.backup

# Should fail with clear error messages
npm run validate:env

# Restore
mv .env.local.backup .env.local
```

### Test 3: Wrong URL

```bash
# Edit .env.local to have wrong Supabase URL
# Change: https://xxxxx.supabase.co
# To:     https://wrong-url.supabase.co

# Should fail connectivity test
npm run validate:env

# Fix and re-validate
```

### Test 4: Pre-commit Hook

```bash
# Remove validation log
rm .env-validated.log

# Try to commit
git add .
git commit -m "test"

# Should block with: ❌ BLOCKED: Environment not validated

# Fix
npm run validate:env
git commit -m "test"  # Now works
```

### Test 5: Dev Server Blocking

```bash
# Remove validation log
rm .env-validated.log

# Try to start dev server
npm run dev

# Should auto-run validate:env via predev hook
```

---

## 🐛 Troubleshooting

### Issue 1: "Cannot find module 'tsx'"

**Problem:** tsx not installed
**Fix:**
```bash
npm install -D tsx @types/node
```

### Issue 2: "Cannot find module 'node:fs'"

**Problem:** Old Node.js version (need v16+)
**Fix:**
```bash
node --version  # Should be v16 or higher
nvm install 20
nvm use 20
```

### Issue 3: Validation log not recognized by git hook

**Problem:** Working directory mismatch
**Fix:**
```bash
# Check where validation log was created
find . -name ".env-validated.log"

# Should be in project root
# If in subdirectory, move it:
mv bmn-site/.env-validated.log .
```

### Issue 4: Connectivity tests fail for local Supabase

**Problem:** Local Supabase not running
**Fix:**
```bash
# Start local Supabase first
npx supabase start

# Then validate
npm run validate:env

# Or skip connectivity tests
npm run validate:env -- --skip-connectivity
```

### Issue 5: "Port already in use" error

**Problem:** Dev server already running
**Fix:**
This is actually OK! The validation script detects this and reports it as expected behavior. The error message will say "this is OK if your dev server is running."

---

## 📊 What Gets Validated

### Level 1: Variable Presence
- Checks all required env vars exist
- Validates URL format (must start with http:// or https://)
- Validates email format (must contain @)

### Level 2: Connectivity Tests (if enabled)
- **Supabase URL:** HTTP HEAD request (5s timeout)
- **Supabase Auth:** Health check endpoint (`/auth/v1/health`)
- **Local Ports:** Checks if configured port is in use

### Level 3: Evidence Generation
- Creates `.env-validated.log` with timestamp
- Log expires after 24 hours (warning shown)
- Pre-commit hook requires valid log file

---

## 🔒 Security Notes

**Safe:**
- ✅ Validation log does NOT contain secret values
- ✅ Only tests connectivity, doesn't transmit keys
- ✅ All network requests are health checks only

**Add to .gitignore:**
```gitignore
.env
.env.local
.env.*.local
.env-validated.log
```

**DO commit:**
- ✅ `scripts/validate-env.ts` (template with variable names)
- ✅ `.agent/` folder (protocols and templates)

---

## 📈 Rollout Strategy

### Phase 1A: Pilot Project (1-2 days)
1. Deploy to ONE project first
2. Test full workflow
3. Verify no blocking issues
4. Document any edge cases

### Phase 1B: Team Rollout (1 week)
1. Share this guide with team
2. Deploy to all active projects
3. Monitor for issues
4. Collect feedback

### Phase 1C: Enforcement (ongoing)
1. Make validation required for all PRs
2. Add to project README templates
3. Include in onboarding docs

---

## 🎓 Training Developers

### Quick Reference Card

Print/share this with your team:

```
🦅 Ralph Protocol v6.5 - Developer Quick Reference

BEFORE starting ANY work:
1. npm run validate:env        (< 5 seconds)

STARTING development:
2. npm run dev                  (auto-validates)

BEFORE committing:
3. Ensure .env-validated.log exists

TROUBLESHOOTING:
- Validation failed? Read error messages carefully
- URL unreachable? Check VPN/network
- Missing vars? Check .env.local.example
- Still stuck? Run: npm run validate:env -- --skip-connectivity

BYPASS (emergencies only):
- Skip network tests: npm run validate:env -- --skip-connectivity
- Then: rm .git/hooks/pre-commit (TEMPORARY - restore after)
```

---

## 🔮 Future Enhancements (Phase 2)

Coming in Phase 2:
- **Gate Circuit Breaker:** Auto-stop after 3 test failures
- **Debug Report Generator:** `npm run gate:debug` for structured troubleshooting
- **Gate Start Script:** `npm run gate:start TASK_ID` enforces research before coding

For now, Phase 1 provides the foundation: **valid environment = confident development**.

---

## 📞 Support

**Issues?**
1. Check troubleshooting section above
2. Review [RALPH_PROTOCOL.md](RALPH_PROTOCOL.md) Phase 1 section
3. Review [suggested_improvements.md](suggested_improvements.md) for rationale

**Success Stories?**
Document in project README:
- Time saved by catching env issues early
- Specific bugs prevented (port mismatches, dead URLs)

---

**Deployed:** 2026-02-11
**Version:** Ralph Protocol v6.5 Phase 1
**Status:** ✅ PRODUCTION READY
