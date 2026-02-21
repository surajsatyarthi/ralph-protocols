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
    console.error(`Create one of:`);
    console.error(`  docs/reports/production-verification-${entryId}.md`);
    console.error(`\nRequired sections:`);
    console.error(`  ## Deployment Timestamp`);
    console.error(`  ## Deployment ID  (Vercel/Netlify/etc deployment ID)`);
    console.error(`  ## Production URL  (must be reachable, HTTP 200)`);
    console.error(`  ## Screenshot  (path to screenshot file)`);
    console.error(`  ## Health Check Results`);
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

  // --- Check 5: Report is anchored to git HEAD ---
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
