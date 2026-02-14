# CI/CD Gate Enforcement - Setup Guide

## Overview

Automated protocol gate enforcement via GitHub Actions. **Makes bypassing gates impossible.**

---

## What's Enforced

### On Every PR and Push to `main`/`develop`:

1. **Gate 5: Lint Suppression** - Blocks new `eslint-disable` or `@ts-ignore`
2. **Gate 7: Security** - Scans for secrets (gitleaks) and vulnerabilities (npm audit)
3. **Gate 6: Test Quality** - Analyzes coverage, assertions, mock ratios
4. **Gate 9: Accessibility** - Runs axe-core WCAG compliance scan

All gates must pass for PR to be mergeable.

---

## Setup Instructions

### Step 1: Enable GitHub Actions

1. Go to repository **Settings** → **Actions** → **General**
2. Under "Actions permissions", select **Allow all actions**
3. Save

### Step 2: Enable Branch Protection

1. Go to **Settings** → **Branches**
2. Click **Add rule** next to "Branch protection rules"
3. Branch name pattern: `main`
4. Enable:
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
5. Under "Status checks that are required", search and select:
   - `Gate 5 - Lint Suppression Check`
   - `Gate 7 - Security Scan`
   - `Gate 6 - Test Quality`
   - `Gate 9 - Accessibility`
   - `Gate Enforcement Summary`
6. Enable:
   - ✅ **Require conversation resolution before merging**
   - ✅ **Do not allow bypassing the above settings** (CRITICAL!)
7. Save changes

**Repeat for `develop` branch if applicable.**

### Step 3: Test the Workflow

1. Create a test branch:
   ```bash
   git checkout -b test/gate-enforcement
   ```

2. Make a trivial change and push:
   ```bash
   echo "# Test" >> README.md
   git add README.md
   git commit -m "test: Verify gate enforcement"
   git push origin test/gate-enforcement
   ```

3. Open a PR on GitHub
4. Watch the workflow run
5. Verify all 4 gates execute and pass

---

## How It Works

### Workflow Triggers
```yaml
on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]
```

### Gate Execution

Each gate runs as a separate job in parallel:

```
┌─────────────────────────────────────┐
│  PR Created or Push to main/develop │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │   Triggers    │
       │ GitHub Actions│
       └───────┬───────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌────────┐           ┌────────┐
│ Gate 5 │           │ Gate 7 │
│  Lint  │           │Security│
└───┬────┘           └───┬────┘
    │                    │
    ▼                    ▼
┌────────┐           ┌────────┐
│ Gate 6 │           │ Gate 9 │
│ Tests  │           │  A11y  │
└───┬────┘           └───┬────┘
    │                    │
    └──────────┬─────────┘
               ▼
         ┌──────────┐
         │ Summary  │
         │ All Pass?│
         └────┬─────┘
              │
         ┌────┴────┐
         │   YES   │   NO
         ▼         ▼
    ✅ Merge   ❌ Block
```

### Evidence Collection

All evidence tickets and reports are:
1. Generated during gate execution
2. Uploaded as GitHub Actions artifacts
3. Retained for 90 days
4. Downloadable from workflow run page

---

## What Happens on Failure

### If Any Gate Fails:

1. ❌ PR is **blocked** from merging
2. 📄 Evidence report uploaded to artifacts
3. 📊 Summary shows which gate(s) failed
4. 🔴 Required status check fails

### Developer Must:

1. View failed check logs
2. Download evidence report
3. Fix violations
4. Push new commit
5. Gates re-run automatically

**No bypass possible** if branch protection is enabled correctly.

---

## Environment Variables (Optional)

Add to repository **Settings** → **Secrets and variables** → **Actions**:

```bash
# Optional: Custom thresholds
LINT_WARNING_THRESHOLD=10
SECURITY_SEVERITY_THRESHOLD=HIGH
TEST_COVERAGE_MIN=75
A11Y_VIOLATIONS_MAX=0
```

---

## Cost Estimation

### GitHub Actions Minutes

**Public repositories:** FREE (unlimited)  
**Private repositories:** 2,000 minutes/month (free tier)

**Estimated usage per PR:**
- Gate 5 (Lint): ~1 minute
- Gate 7 (Security): ~2 minutes
- Gate 6 (Tests): ~3 minutes
- Gate 9 (Accessibility): ~3 minutes
- **Total:** ~9 minutes/PR

At 20 PRs/month = **180 minutes/month** (well within free tier)

---

## Advanced Configuration

### Run Only on ENTRY- Branches

To reduce CI usage, only enforce on entry branches:

```yaml
on:
  pull_request:
    branches: [ main ]
    paths-ignore:
      - 'docs/**'
      - '**.md'
  push:
    branches:
      - 'ENTRY-*'
```

### Add Gate 10 (Performance)

```yaml
performance-gate:
  name: Gate 10 - Performance
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npm install -g @lhci/cli
    - run: npm run build
    - run: npm run perf:gate -- ENTRY-000 https://localhost:3000
```

### Add Slack Notifications

```yaml
- name: Notify on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "❌ Gate enforcement failed for PR #${{ github.event.pull_request.number }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## Troubleshooting

### Issue: "No status checks found"

**Solution:** Wait for first workflow run, then add status checks to branch protection.

### Issue: Workflow doesn't trigger

**Solution:** 
1. Check `.github/workflows/` directory exists
2. Verify YAML syntax with `yamllint`
3. Check Actions are enabled in repo settings

### Issue: Gate fails on first run

**Solution:** This is expected! Gates enforce quality from Day 1. Fix violations and re-run.

### Issue: "gitleaks not found"

**Solution:** Workflow installs gitleaks automatically. If it fails, check wget/tar commands.

---

## Monitoring

### View Workflow Runs

1. Go to **Actions** tab
2. Click **Protocol Gate Enforcement**
3. View all runs, filter by status

### Download Evidence

1. Open workflow run
2. Scroll to **Artifacts**
3. Download `gate-evidence-{sha}` ZIP
4. Extract to view evidence tickets

---

## Rollback Plan

If gates cause issues:

1. **Temporary bypass** (NOT RECOMMENDED):
   - Go to branch protection → uncheck required status checks
   - Merge PR
   - Re-enable immediately

2. **Disable workflow**:
   - Rename `.github/workflows/gate-enforcement.yml` to `.github/workflows/gate-enforcement.yml.disabled`
   - Commit and push

3. **Revert entirely**:
   ```bash
   git revert <commit-hash-of-ci-integration>
   ```

---

## Success Criteria

✅ **Gates are enforced if:**

1. PR cannot be merged when any gate fails
2. Evidence artifacts are generated and uploaded
3. Summary shows pass/fail for each gate
4. No bypass is possible (even for admins)

❌ **Not working if:**

- PRs can merge with failed checks
- No artifacts uploaded
- Status checks are optional

---

## Next Steps

After CI/CD is working:

1. **Monitor for 1 week** - ensure no false positives
2. **Add remaining gates** - Gate 2 (research), Gate 3 (scope), etc.
3. **Expand to pre-commit hooks** - Local enforcement before push
4. **Add performance budgets** - Gate 10 with Lighthouse CI

---

**Status:** Ready for immediate deployment  
**Risk:** Low (can disable if issues)  
**Impact:** Makes bypass impossible
