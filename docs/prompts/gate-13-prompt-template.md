# Gate 13: Antigravity Browser Walkthrough Prompt Template

**Purpose**: Copy this prompt and fill in `[PLACEHOLDERS]` before giving it to Antigravity.
This is the standard prompt for Gate 13. Using it consistently ensures every feature
gets the same structured browser testing, not ad-hoc browsing.

---

## Prompt (copy and fill in the blanks)

```
## Gate 13: Browser Walkthrough — ENTRY-[XXX]

Use your browser subagent to test the preview deployment of [FEATURE NAME] for ENTRY-[XXX].

**IMPORTANT — Read before starting:**
- Test on the PREVIEW URL below — NOT localhost, NOT production
- The preview uses the same infrastructure as production (real env vars, real database)
- Any failure here (broken layout, console error, broken flow) means the same failure will
  hit users on production. This is your last automated check before merge.

---

### Preview URL
[PASTE VERCEL/NETLIFY PREVIEW URL HERE]
Example: https://my-app-git-feat-profile-edit.vercel.app

---

### Step 1: Mobile Viewport Test (375px)

1. Open [PREVIEW URL] in the browser
2. Set viewport width to 375px (mobile simulation)
3. Navigate to: [FEATURE PATH, e.g. /profile/edit]
4. Take a full-page screenshot
5. Save as: docs/reports/screenshots/[feature-name]-mobile-375px.png
6. Check:
   - Is the layout broken? Any elements overlapping?
   - Is text readable?
   - Is the feature visible and usable?

---

### Step 2: Desktop Viewport Test (1280px)

1. Set viewport width to 1280px
2. Navigate to: [FEATURE PATH]
3. Take a full-page screenshot
4. Save as: docs/reports/screenshots/[feature-name]-desktop-1280px.png
5. Check:
   - Does the layout look correct?
   - Is there broken grid/columns?

---

### Step 3: Core User Flow

Click through the following steps and note whether each succeeds or fails:

[PASTE FEATURE-SPECIFIC STEPS HERE]
Example steps for a profile edit form:
1. Navigate to /profile/edit
2. Fill in the form: name, company, trade terms
3. Click "Save Profile"
4. Verify: success message appears
5. Refresh the page
6. Verify: changes are persisted (saved data still shown)
7. Test validation: submit with an empty required field
8. Verify: error message appears (not a crash)

---

### Step 4: Auth/Login Flow (if this feature requires login)

1. Open the preview URL in a fresh incognito window (not logged in)
2. Navigate to: [FEATURE PATH]
3. Verify: Redirected to login page (not a blank screen or 404)
4. Log in using test credentials: [TEST EMAIL / METHOD]
5. Verify: After login, redirected back to the feature

---

### Step 5: Console Error Check

After completing the user flow:
1. Open browser DevTools → Console tab
2. Count all errors (ignore warnings unless they look like broken functionality)
3. Note the exact count (must be 0 to pass)
4. If there are errors, copy the first 3 here

---

### Step 6: Browser Recording (optional but recommended)

If your browser subagent supports session recording:
- Record the full walkthrough from Step 1 through Step 5
- Save as: docs/reports/recordings/[feature-name]-walkthrough.webm

---

### Step 7: Write the Gate 13 Report

Create the file: docs/reports/browser-test-ENTRY-[XXX].md

Use the template at: docs/templates/browser-test-report-template.md

Fill in:
- Preview URL (the actual URL you tested)
- Screenshot paths (for both mobile and desktop)
- Console error count (must be 0)
- User Flow Checklist (mark [x] for each completed step)
- Any issues found

---

### Step 8: Commit the Report and Screenshots

```bash
git add docs/reports/browser-test-ENTRY-[XXX].md
git add docs/reports/screenshots/[feature-name]-mobile-375px.png
git add docs/reports/screenshots/[feature-name]-desktop-1280px.png
# Add recording if available:
# git add docs/reports/recordings/[feature-name]-walkthrough.webm
git commit -m "docs(gate-13): browser walkthrough evidence for ENTRY-[XXX]"
```

---

### Step 9: Verify Gate 13 Passes

```bash
node scripts/gates/gate-13-browser.js ENTRY-[XXX]
```

Expected output: `✅ Gate 13 PASSED`

If blocked, fix the issues reported and re-test.

---

**Gate 13 is complete when:**
- `node scripts/gates/gate-13-browser.js ENTRY-[XXX]` exits 0
- PR can now be merged to production
- After merge: Gate 11 (Human sign-off on live production URL) runs next
```

---

## Checklist for the person giving this prompt to Antigravity

Before sending the prompt, confirm:

- [ ] Preview URL obtained from Vercel/Netlify dashboard (not localhost)
- [ ] Feature-specific user flow steps written in Step 3
- [ ] Test credentials documented if auth is needed
- [ ] `ENTRY-[XXX]` replaced with actual entry ID in all placeholders
- [ ] `[feature-name]` replaced with the actual feature name (e.g., `profile-edit`)

---

## Why Gate 13 Exists

> "Antigravity and Claude Code spent two whole days testing with Playwright.
> $7,000 in tokens. When the site launched, nothing was implemented.
> A junior developer was fired. The project is delayed 15 days."

The previous workflow tested logic in isolation (mocked tests, unit tests, Playwright against
mocked backends). None of it caught what a real browser on the real deployed preview would have
caught in 5 minutes.

Gate 13 is the mandatory reality check: **does the actual deployed feature work in an actual
browser, on actual infrastructure, before actual users see it?**
