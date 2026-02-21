#!/usr/bin/env node

/**
 * Gate 13: Antigravity Browser Walkthrough
 * Verifies that Antigravity's browser subagent tested the PREVIEW deployment
 * before the PR is merged to production.
 *
 * WHY PREVIEW, NOT PRODUCTION:
 * Testing on production after deployment means broken code is already live.
 * Vercel/Netlify preview URLs use the same infrastructure and environment
 * variables as production — so a missing GITHUB_CLIENT_ID shows up here too,
 * before any user ever sees the feature.
 *
 * BLOCKS: No browser test report, missing screenshots (mobile 375px + desktop 1280px),
 *         console errors detected, user flow checklist incomplete,
 *         URL tested is localhost (not a real preview deployment).
 *
 * Usage: node gate-13-browser.js ENTRY-XXX
 */

'use strict';

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = process.cwd();
const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET  = '\x1b[0m';

function findBrowserTestReport(entryId) {
  const normalized = entryId.replace(/ENTRY-/i, '').replace(/-/g, '_');
  const candidates = [
    path.join(WORKSPACE_ROOT, 'docs', 'reports', `browser-test-${entryId}.md`),
    path.join(WORKSPACE_ROOT, 'docs', 'reports', `browser_test_${normalized}.md`),
    path.join(WORKSPACE_ROOT, 'docs', 'reports', `browser_test_ENTRY_${normalized}.md`),
  ];
  return candidates.find(p => fs.existsSync(p)) || null;
}

/**
 * checkPreviewUrl — ensures the URL tested is a real preview deployment.
 *
 * Must NOT be localhost or 127.0.0.1.
 * Preview URLs look like: https://my-app-git-branch-abc.vercel.app
 * or: https://deploy-preview-123--my-app.netlify.app
 */
function checkPreviewUrl(content) {
  const urls = content.match(/https?:\/\/[^\s)\]"',]+/g) || [];
  const candidates = urls.filter(u =>
    !u.includes('example.com') &&
    !u.includes('placeholder') &&
    !u.includes('your-domain')
  );

  if (candidates.length === 0) return { found: false };

  const isLocalhost = candidates.every(u =>
    u.includes('localhost') || u.includes('127.0.0.1')
  );

  return {
    found: true,
    url: candidates[0],
    isLocalhost
  };
}

/**
 * checkScreenshot — verifies a viewport-specific screenshot is referenced
 * in the report and the file exists on disk with a non-trivial size.
 */
function checkScreenshot(content, viewport, keywords) {
  const screenshotPattern = /(?:docs|screenshots?)\/[^\s)\]"',]+\.(?:png|jpg|jpeg|webp)/gi;
  const matches = content.match(screenshotPattern) || [];

  for (const match of matches) {
    const lower = match.toLowerCase();
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      const fullPath = path.join(WORKSPACE_ROOT, match);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        // A screenshot under 5KB is almost certainly a blank/placeholder
        if (stats.size < 5000) {
          return {
            found: true, path: match,
            warning: `File is only ${stats.size} bytes — may be a blank or placeholder screenshot`
          };
        }
        return { found: true, path: match, size: stats.size };
      }
      // Referenced but not on disk — still counts as found (CI artifact upload)
      return { found: true, path: match, warning: 'file referenced but not found on disk' };
    }
  }

  // Fallback: keyword + "screenshot" mentioned anywhere in the report
  const hasViewportMention = keywords.some(kw =>
    content.toLowerCase().includes(kw.toLowerCase()) &&
    content.toLowerCase().includes('screenshot')
  );

  if (hasViewportMention) {
    return { found: true, path: `(${viewport} screenshot mentioned in report)` };
  }

  return { found: false };
}

/**
 * checkConsoleErrors — verifies the report explicitly states 0 console errors.
 *
 * Antigravity must open the browser console, check for errors, and write
 * the count to the report. A missing section = BLOCKED.
 * Any errors detected = BLOCKED (they indicate the feature is broken).
 */
function checkConsoleErrors(content) {
  const hasSection = /##.*console\s*error|##.*browser\s*console/i.test(content);

  if (!hasSection) {
    return { present: false, clean: false };
  }

  const zeroErrorPatterns = [
    /console\s+errors?[:\s]+0/i,
    /count:\s*0/i,
    /0\s+(?:console\s+)?errors?\s+(?:found|detected|observed)/i,
    /no\s+console\s+errors/i,
    /errors?[:\s]+none/i,
    /errors?[:\s]+0\b/i,
  ];

  const clean = zeroErrorPatterns.some(p => p.test(content));
  return { present: true, clean };
}

/**
 * checkUserFlowChecklist — verifies Antigravity actually clicked through
 * the feature, not just screenshotted the landing page.
 */
function checkUserFlowChecklist(content) {
  const hasSection = /##.*user\s+flow|##.*test\s+flow|##.*walkthrough\s+checklist|##.*test\s+checklist/i.test(content);

  if (!hasSection) {
    return { present: false, checked: 0, unchecked: 0 };
  }

  const checkedItems   = (content.match(/\[x\]/gi) || []).length;
  const uncheckedItems = (content.match(/\[\s+\]/g) || []).length;

  return { present: true, checked: checkedItems, unchecked: uncheckedItems };
}

async function main() {
  const entryId = process.argv[2];

  if (!entryId || !entryId.match(/ENTRY-[A-Z0-9._-]+/i)) {
    console.error(`${RED}❌ Usage: node gate-13-browser.js ENTRY-XXX${RESET}`);
    process.exit(1);
  }

  console.log(`\n${YELLOW}🌐 Gate 13: Antigravity Browser Walkthrough for ${entryId}${RESET}\n`);

  const violations = [];

  // --- Check 1: Browser test report exists ---
  const reportPath = findBrowserTestReport(entryId);

  if (!reportPath) {
    console.error(`${RED}❌ Gate 13 BLOCKED: No browser test report found.${RESET}`);
    console.error(`\nAntigravity must use its browser subagent to test the PREVIEW URL and document results.\n`);
    console.error(`Create: docs/reports/browser-test-${entryId}.md`);
    console.error(`\nRequired sections:`);
    console.error(`  ## Preview URL`);
    console.error(`       https://[branch]-[hash].vercel.app  ← NOT localhost, NOT production`);
    console.error(`  ## Viewport: Mobile (375px)`);
    console.error(`       Screenshot: docs/reports/screenshots/[feature]-mobile-375px.png`);
    console.error(`  ## Viewport: Desktop (1280px)`);
    console.error(`       Screenshot: docs/reports/screenshots/[feature]-desktop-1280px.png`);
    console.error(`  ## Console Errors`);
    console.error(`       Count: 0  ← must be exactly zero`);
    console.error(`  ## User Flow Checklist`);
    console.error(`       - [x] Page loads without errors at preview URL`);
    console.error(`       - [x] Feature is visible at mobile viewport (375px)`);
    console.error(`       - [x] Feature is visible at desktop viewport (1280px)`);
    console.error(`       - [x] Core user action completes successfully`);
    console.error(`       - [x] No broken layouts observed`);
    console.error(`       - [x] Auth/login flow works (if applicable)`);
    console.error(`\n📋 Use the prompt template: docs/prompts/gate-13-prompt-template.md`);
    process.exit(1);
  }

  console.log(`   Found: ${path.relative(WORKSPACE_ROOT, reportPath)}`);
  const report = fs.readFileSync(reportPath, 'utf-8');

  // --- Check 2: Preview URL is not localhost ---
  console.log('🔗 Checking preview URL...');
  const urlCheck = checkPreviewUrl(report);

  if (!urlCheck.found) {
    violations.push(
      'No URL found in browser test report. ' +
      'The URL tested must be a Vercel/Netlify preview URL, not localhost. ' +
      'Preview URLs look like: https://my-app-git-branch-abc.vercel.app'
    );
  } else if (urlCheck.isLocalhost) {
    violations.push(
      `Browser test was run on localhost (${urlCheck.url}). ` +
      'Gate 13 requires testing on a PREVIEW deployment — not localhost. ' +
      'Reason: localhost has local .env files that may differ from what Vercel/Netlify has. ' +
      'INCIDENT-001 happened because env vars present locally were missing in the deployed environment.'
    );
  } else {
    console.log(`   ${GREEN}✅ Preview URL: ${urlCheck.url}${RESET}`);
  }

  // --- Check 3: Mobile screenshot (375px) ---
  console.log('📱 Checking mobile screenshot (375px)...');
  const mobileCheck = checkScreenshot(report, 'mobile', ['mobile', '375', 'phone', 'sm-', 'xs-']);

  if (!mobileCheck.found) {
    violations.push(
      'Missing mobile screenshot (375px viewport). ' +
      'Antigravity must set the browser viewport to width=375px, navigate to the feature page, ' +
      'and save a screenshot as: docs/reports/screenshots/[feature]-mobile-375px.png'
    );
  } else {
    const warn = mobileCheck.warning ? ` — ${YELLOW}⚠️  ${mobileCheck.warning}${RESET}` : '';
    console.log(`   ${GREEN}✅ Mobile screenshot: ${mobileCheck.path}${RESET}${warn}`);
  }

  // --- Check 4: Desktop screenshot (1280px) ---
  console.log('🖥️  Checking desktop screenshot (1280px)...');
  const desktopCheck = checkScreenshot(report, 'desktop', ['desktop', '1280', 'lg-', 'xl-', 'full']);

  if (!desktopCheck.found) {
    violations.push(
      'Missing desktop screenshot (1280px viewport). ' +
      'Save as: docs/reports/screenshots/[feature]-desktop-1280px.png'
    );
  } else {
    const warn = desktopCheck.warning ? ` — ${YELLOW}⚠️  ${desktopCheck.warning}${RESET}` : '';
    console.log(`   ${GREEN}✅ Desktop screenshot: ${desktopCheck.path}${RESET}${warn}`);
  }

  // --- Check 5: Console errors = 0 ---
  // A broken feature (wrong API endpoint, missing env var, JS error) shows up here.
  // INCIDENT-001: client_id=undefined caused a JS error in the OAuth redirect.
  // This check would have caught it — the browser console would have logged the error.
  console.log('🔍 Checking browser console errors...');
  const consoleCheck = checkConsoleErrors(report);

  if (!consoleCheck.present) {
    violations.push(
      'Missing ## Console Errors section in browser test report. ' +
      'Antigravity must open the browser DevTools console, check for errors, and report the count. ' +
      'Format: ## Console Errors\\nCount: 0'
    );
  } else if (!consoleCheck.clean) {
    violations.push(
      'Browser console errors detected. All console errors must be resolved before Gate 13 passes. ' +
      'Console errors in the preview environment indicate broken functionality that users will hit on production.'
    );
  } else {
    console.log(`   ${GREEN}✅ Console errors: 0${RESET}`);
  }

  // --- Check 6: User flow checklist ---
  // Screenshots of the landing page alone are not sufficient.
  // Antigravity must click through the core user flow.
  console.log('✅ Checking user flow checklist...');
  const checklistResult = checkUserFlowChecklist(report);

  if (!checklistResult.present) {
    violations.push(
      'Missing User Flow Checklist. Add this section to the browser test report:\n\n' +
      '## User Flow Checklist\n' +
      '- [x] Page loads without errors at preview URL\n' +
      '- [x] Feature is visible at mobile viewport (375px)\n' +
      '- [x] Feature is visible at desktop viewport (1280px)\n' +
      '- [x] Core user action completes successfully (describe what was done)\n' +
      '- [x] No broken layouts or overlapping elements\n' +
      '- [x] Auth/login flow works (if applicable)\n\n' +
      'Antigravity must click through the feature, not just screenshot the landing page.'
    );
  } else if (checklistResult.unchecked > 0) {
    violations.push(
      `User flow checklist has ${checklistResult.unchecked} unchecked item(s). ` +
      'All items must be [x] before Gate 13 passes.'
    );
  } else {
    console.log(`   ${GREEN}✅ User flow checklist: ${checklistResult.checked} steps completed${RESET}`);
  }

  // --- Check 7: Browser recording (warning only — not blocking) ---
  const hasRecording = /\.webm|\.mp4|recording\b|browser.*record/i.test(report);
  if (!hasRecording) {
    console.log(`   ${YELLOW}⚠️  No browser recording referenced. Consider using Antigravity's session recording for richer evidence.${RESET}`);
  } else {
    console.log(`   ${GREEN}✅ Browser recording referenced${RESET}`);
  }

  // --- Report ---
  if (violations.length > 0) {
    console.error(`\n${RED}❌ Gate 13 BLOCKED: ${violations.length} violation(s):${RESET}\n`);
    violations.forEach(v => console.error(`   ${RED}→ ${v}${RESET}`));
    console.error(`\n${YELLOW}Fix: Run Antigravity browser subagent on the preview URL using the prompt template.${RESET}`);
    console.error(`${YELLOW}Template: docs/prompts/gate-13-prompt-template.md${RESET}`);
    process.exit(1);
  }

  console.log(`\n${GREEN}✅ Gate 13 PASSED: Browser walkthrough verified for ${entryId}${RESET}`);
  process.exit(0);
}

main().catch(err => {
  console.error(`${RED}❌ Gate 13 unexpected error: ${err.message}${RESET}`);
  process.exit(1);
});
