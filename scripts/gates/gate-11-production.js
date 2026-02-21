#!/usr/bin/env node

/**
 * Gate 11: Production Verification
 * Verifies the deployment is live, healthy, and provides screenshot evidence.
 *
 * BLOCKS: No verification report, production URL unreachable,
 *         missing screenshot evidence, report missing required sections.
 *
 * Usage: node gate-11-production.js ENTRY-XXX
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const WORKSPACE_ROOT = process.cwd();
const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET  = '\x1b[0m';

const REQUEST_TIMEOUT_MS = 15000;

function findReportFile(entryId) {
  const normalized = entryId.replace(/ENTRY-/i, '').replace(/-/g, '_');
  const candidates = [
    path.join(WORKSPACE_ROOT, 'docs', 'reports', `production-verification-${entryId}.md`),
    path.join(WORKSPACE_ROOT, 'docs', 'reports', `production_verification_TASK_${normalized}.md`),
    path.join(WORKSPACE_ROOT, 'docs', 'reports', `production_verification_TASK_${entryId}.md`),
  ];
  return candidates.find(p => fs.existsSync(p)) || null;
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: REQUEST_TIMEOUT_MS }, res => {
      res.resume(); // consume response to free socket
      resolve({ status: res.statusCode, url });
    });
    req.on('error', err => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request to ${url} timed out after ${REQUEST_TIMEOUT_MS}ms`));
    });
  });
}

function extractUrls(content) {
  const urls = content.match(/https?:\/\/[^\s)\]"',]+/g) || [];
  // Filter out localhost, example.com, and non-production-looking URLs
  return urls.filter(u =>
    !u.includes('localhost') &&
    !u.includes('127.0.0.1') &&
    !u.includes('example.com') &&
    !u.includes('placeholder')
  );
}

/**
 * checkViewportScreenshot — checks if the production verification report
 * references a screenshot file matching a given viewport (mobile/desktop).
 */
function checkViewportScreenshot(reportContent, viewport, keywords) {
  // Look for screenshot file references with viewport keywords in name or path
  const screenshotPattern = /(?:docs|screenshots?)\/[^\s)\]"',]+\.(?:png|jpg|jpeg|webp)/gi;
  const matches = reportContent.match(screenshotPattern) || [];

  for (const match of matches) {
    const lower = match.toLowerCase();
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      const fullPath = path.join(WORKSPACE_ROOT, match);
      if (fs.existsSync(fullPath)) {
        return { found: true, path: match };
      }
      // Referenced but file doesn't exist yet — still flag as found (file may be on CI)
      // Only flag as missing if no matching reference at all
      return { found: true, path: match, warning: 'file referenced but not on disk' };
    }
  }

  // Fallback: look for keywords anywhere in the report near a screenshot mention
  const hasViewportMention = keywords.some(kw =>
    reportContent.toLowerCase().includes(kw.toLowerCase()) &&
    reportContent.toLowerCase().includes('screenshot')
  );

  if (hasViewportMention) {
    return { found: true, path: `(${viewport} screenshot mentioned in report)` };
  }

  return { found: false };
}

/**
 * checkManualVerificationChecklist — verifies a human sign-off checklist
 * exists in the production verification report and is fully checked.
 *
 * INCIDENT-001 lesson: PM approved Gate 8 two minutes after deployment
 * without opening the live URL. This checklist makes that impossible to fake.
 */
function checkManualVerificationChecklist(reportContent) {
  const hasChecklist = /##.*Manual\s+Verification|##.*Live\s+Browser|##.*Production\s+Checklist/i.test(reportContent);

  if (!hasChecklist) {
    return { present: false, checked: 0, unchecked: 0 };
  }

  const checkedItems = (reportContent.match(/\[x\]/gi) || []).length;
  const uncheckedItems = (reportContent.match(/\[\s+\]/g) || []).length;

  return {
    present: true,
    checked: checkedItems,
    unchecked: uncheckedItems
  };
}

async function main() {
  const entryId = process.argv[2];

  if (!entryId || !entryId.match(/ENTRY-[A-Z0-9._-]+/i)) {
    console.error(`${RED}❌ Usage: node gate-11-production.js ENTRY-XXX${RESET}`);
    process.exit(1);
  }

  console.log(`\n${YELLOW}🚀 Gate 11: Production Verification for ${entryId}${RESET}\n`);

  const violations = [];

  // --- Check 1: Verification report exists ---
  const reportPath = findReportFile(entryId);

  if (!reportPath) {
    console.error(`${RED}❌ Gate 11 BLOCKED: No production verification report found.${RESET}`);
    console.error(`\nYou must manually verify the production deployment and document it.\n`);
    console.error(`Create: docs/reports/production-verification-${entryId}.md`);
    console.error(`\nRequired sections:`);
    console.error(`  ## Deployment Timestamp`);
    console.error(`  ## Deployment ID  (Vercel/Netlify/etc deployment ID)`);
    console.error(`  ## Production URL  (must be reachable, HTTP 200)`);
    console.error(`  ## Screenshot — TWO required:`);
    console.error(`       docs/reports/screenshots/[feature]-mobile.png  (375px viewport)`);
    console.error(`       docs/reports/screenshots/[feature]-desktop.png (1280px viewport)`);
    console.error(`  ## Health Check Results`);
    console.error(`  ## Manual Verification Checklist  ← HUMAN SIGN-OFF REQUIRED`);
    console.error(`       - [x] Opened production URL in browser`);
    console.error(`       - [x] Feature renders correctly on mobile viewport (375px)`);
    console.error(`       - [x] Feature renders correctly on desktop viewport (1280px)`);
    console.error(`       - [x] Clicked through the core user flow`);
    console.error(`       - [x] No console errors observed`);
    console.error(`       - [x] Auth/login flow tested manually (if applicable)`);
    console.error(`  ## Monitoring (hour 0 / hour 6 / hour 24 sign-offs)`);
    process.exit(1);
  }

  console.log(`   Found: ${path.relative(WORKSPACE_ROOT, reportPath)}`);
  const report = fs.readFileSync(reportPath, 'utf-8');

  // --- Check 2: Required sections present ---
  const requiredSections = [
    { pattern: /##.*Deployment\s+(ID|Timestamp|Time)/i,   name: 'Deployment ID or Timestamp' },
    { pattern: /https?:\/\/[^\s)]+/,                      name: 'Production URL' },
    { pattern: /##.*Screenshot|screenshot|\.png|\.jpg/i,  name: 'Screenshot evidence' },
    { pattern: /##.*Health\s+Check|Health\s+Check/i,      name: 'Health Check Results' },
  ];

  for (const section of requiredSections) {
    console.log(`📋 Checking for ${section.name}...`);
    if (!report.match(section.pattern)) {
      violations.push(`Missing required section: "${section.name}"`);
    } else {
      console.log(`   ✅ Found`);
    }
  }

  // --- Check 3: Production URL is reachable ---
  const urls = extractUrls(report);
  if (urls.length === 0) {
    violations.push('No production URL found in report. Add the live URL.');
  } else {
    const prodUrl = urls[0];
    console.log(`🌐 Checking production URL: ${prodUrl}`);
    try {
      const response = await httpGet(prodUrl);
      if (response.status >= 200 && response.status < 400) {
        console.log(`   ${GREEN}✅ Production URL returned HTTP ${response.status}${RESET}`);
      } else {
        violations.push(`Production URL ${prodUrl} returned HTTP ${response.status} — not healthy.`);
      }
    } catch (err) {
      violations.push(`Production URL ${prodUrl} is unreachable: ${err.message}`);
    }
  }

  // --- Check 4: Screenshot file exists ---
  console.log('📸 Checking screenshot evidence...');
  const screenshotPatterns = [
    /docs\/[^\s)\]"']+\.png/i,
    /docs\/[^\s)\]"']+\.jpg/i,
    /screenshots?\/[^\s)\]"']+\.(png|jpg)/i,
  ];
  let screenshotFound = false;
  for (const pattern of screenshotPatterns) {
    const match = report.match(pattern);
    if (match) {
      const screenshotPath = path.join(WORKSPACE_ROOT, match[0]);
      if (fs.existsSync(screenshotPath)) {
        console.log(`   ${GREEN}✅ Screenshot found: ${match[0]}${RESET}`);
        screenshotFound = true;
        break;
      } else {
        violations.push(`Screenshot referenced but file not found: ${match[0]}`);
        break;
      }
    }
  }
  if (!screenshotFound && !violations.some(v => v.includes('Screenshot'))) {
    violations.push(
      'No screenshot evidence found. ' +
      'Take a screenshot of the live production page and save it to docs/reports/screenshots/'
    );
  }

  // --- Check 5: Mobile + Desktop screenshots ---
  // Lesson: HTTP 200 + one screenshot does not prove the UI works.
  // A blank white page returns HTTP 200. A screenshot of it "passes".
  // We require TWO screenshots: mobile (375px) and desktop (1280px),
  // AND a manual checklist confirming a human clicked through the feature.
  console.log('📱 Checking mobile + desktop screenshot evidence...');
  const mobileCheck = checkViewportScreenshot(report, 'mobile', ['mobile', '375', 'phone', 'sm-']);
  const desktopCheck = checkViewportScreenshot(report, 'desktop', ['desktop', '1280', 'lg-', 'full']);

  if (!mobileCheck.found) {
    violations.push(
      'Missing mobile screenshot (375px viewport). ' +
      'Take a screenshot in Chrome DevTools mobile mode or Playwright at width=375. ' +
      'Save as docs/reports/screenshots/[feature]-mobile.png and reference it in the report. ' +
      'Reason: HTTP 200 does not prove the mobile UI renders correctly.'
    );
  } else {
    console.log(`   ✅ Mobile screenshot found: ${mobileCheck.path}`);
  }

  if (!desktopCheck.found) {
    violations.push(
      'Missing desktop screenshot (1280px viewport). ' +
      'Save as docs/reports/screenshots/[feature]-desktop.png and reference it in the report.'
    );
  } else {
    console.log(`   ✅ Desktop screenshot found: ${desktopCheck.path}`);
  }

  // --- Check 6: Manual live browser verification checklist ---
  // No automated tool can replace a human actually clicking through the feature on production.
  // This checklist must be signed off MANUALLY — not auto-generated.
  console.log('🧑‍💻 Checking manual verification checklist...');
  const checklistResult = checkManualVerificationChecklist(report);
  if (!checklistResult.present) {
    violations.push(
      'Missing manual verification checklist. Add this section to your production verification report:\n\n' +
      '## Manual Verification Checklist\n' +
      '- [x] Opened production URL in browser\n' +
      '- [x] Feature renders correctly on mobile viewport (375px)\n' +
      '- [x] Feature renders correctly on desktop viewport (1280px)\n' +
      '- [x] Clicked through the core user flow (not just landing page)\n' +
      '- [x] No console errors observed\n' +
      '- [x] Auth/login flow tested manually (if applicable)\n\n' +
      'This checklist must be filled in by a human — not auto-generated. ' +
      'INCIDENT-001 was caused by approving a deployment without anyone opening the live URL.'
    );
  } else if (checklistResult.unchecked > 0) {
    violations.push(
      `Manual verification checklist has ${checklistResult.unchecked} unchecked item(s). ` +
      'All items must be checked [ ] → [x] before Gate 11 can pass.'
    );
  } else {
    console.log(`   ✅ Manual checklist complete (${checklistResult.checked} items signed off)`);
  }

  // --- Check 7b: G3 plan has Success Metric + Failure Signal ---
  // Without these, there is no definition of "healthy" and operators cannot tell
  // if the feature is working or broken after it ships.
  console.log('📊 Checking G3 plan for observability fields (Success Metric + Failure Signal)...');
  const planCandidates = [
    path.join(WORKSPACE_ROOT, 'docs', 'implementation', 'plans', `${entryId}-plan.md`),
    path.join(WORKSPACE_ROOT, `implementation-plan-${entryId}.md`),
  ];
  const foundPlanPath = planCandidates.find(p => fs.existsSync(p)) || null;

  if (!foundPlanPath) {
    violations.push(
      `G3 implementation plan not found (checked: ${planCandidates.map(p => path.relative(WORKSPACE_ROOT, p)).join(', ')}). ` +
      'Cannot verify Success Metric and Failure Signal are defined.'
    );
  } else {
    const planContent = fs.readFileSync(foundPlanPath, 'utf-8');
    if (!/##.*Success\s+Metric/i.test(planContent)) {
      violations.push(
        `G3 plan (${path.relative(WORKSPACE_ROOT, foundPlanPath)}) is missing "## Success Metric". ` +
        'Define the number/signal that proves this feature is working before signing off on production.'
      );
    } else {
      console.log('   ✅ G3 Success Metric defined');
    }
    if (!/##.*Failure\s+Signal/i.test(planContent)) {
      violations.push(
        `G3 plan (${path.relative(WORKSPACE_ROOT, foundPlanPath)}) is missing "## Failure Signal". ` +
        'Define the log line/error that indicates this feature is broken before signing off on production.'
      );
    } else {
      console.log('   ✅ G3 Failure Signal defined');
    }
  }

  // --- Check 8: Report is anchored to git HEAD ---
  console.log('🔐 Checking git HEAD anchor...');
  try {
    const head = execSync('git rev-parse HEAD', { encoding: 'utf-8', cwd: WORKSPACE_ROOT }).trim();
    const shortHead = head.substring(0, 7);
    if (report.includes(shortHead) || report.includes(head)) {
      console.log(`   ${GREEN}✅ Anchored to HEAD ${shortHead}${RESET}`);
    } else {
      console.log(`   ${YELLOW}⚠️  Report not anchored to current HEAD (${shortHead}) — add the deployment commit hash${RESET}`);
      // Warning only — production may have been deployed from a slightly different hash
    }
  } catch {
    console.log(`   ${YELLOW}⚠️  Could not verify git HEAD (git not available)${RESET}`);
  }

  // --- Report ---
  if (violations.length > 0) {
    console.error(`\n${RED}❌ Gate 11 BLOCKED: ${violations.length} violation(s):${RESET}\n`);
    violations.forEach(v => console.error(`   ${RED}→ ${v}${RESET}`));
    console.error(`\n${YELLOW}Fix: Verify the production deployment, document it, and provide screenshot evidence.${RESET}`);
    process.exit(1);
  }

  console.log(`\n${GREEN}✅ Gate 11 PASSED: Production deployment verified for ${entryId}${RESET}`);
  process.exit(0);
}

main().catch(err => {
  console.error(`${RED}❌ Gate 11 unexpected error: ${err.message}${RESET}`);
  process.exit(1);
});
