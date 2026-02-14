#!/usr/bin/env node

/**
 * PM Gate 6: Atomic Ledger Update & Approval
 * Prevents status drift by atomically updating:
 * 1. Ledger status to DONE
 * 2. Approval comment with timestamp
 * 3. Completion report from template
 * All in a single git commit
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_ROOT = process.cwd();
const LEDGER_PATH = path.join(WORKSPACE_ROOT, 'PROJECT_LEDGER.md');
const RALPH_DIR = path.join(WORKSPACE_ROOT, '.ralph');

function main() {
  const entryId = process.argv[2];
  const gitHash = process.argv[3];
  
  if (!entryId || !entryId.match(/ENTRY-\d{3}/)) {
    console.error('❌ Usage: npm run approve -- ENTRY-XXX <git-hash>');
    process.exit(1);
  }

  if (!gitHash) {
    console.error('❌ Git hash required for approval');
    process.exit(1);
  }

  console.log(`\n📋 PM Gate 6: Atomic Approval for ${entryId}\n`);

  // Step 1: Validate git hash exists
  try {
    execSync(`git rev-parse --verify ${gitHash}`, { encoding: 'utf-8' });
  } catch (error) {
    console.error(`❌ Invalid git hash: ${gitHash}`);
    process.exit(1);
  }

  // Step 2: Update ledger status
  console.log('📝 Updating ledger status to DONE...');
  updateLedgerStatus(entryId, gitHash);

  // Step 3: Add approval comment
  console.log('✅ Adding approval comment...');
  addApprovalComment(entryId);

  // Step 4: Create completion report
  console.log('📄 Creating completion report...');
  createCompletionReport(entryId, gitHash);

  // Step 5: Git commit all changes atomically
  console.log('💾 Committing changes atomically...');
  const commitMessage = `PM Approval: ${entryId} - Atomic update (ledger + comment + report)

Status: DONE
Git Hash: ${gitHash}
Approved: ${new Date().toISOString()}
Approved By: ${process.env.USER || 'PM'}

Evidence: .ralph/${entryId}-completion-report.md`;

  try {
    execSync('git add PROJECT_LEDGER.md .ralph/', { stdio: 'inherit' });
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log('\n✅ PM Gate 6 PASSED: Atomic approval complete');
  } catch (error) {
    console.error('❌ Failed to commit changes');
    process.exit(1);
  }

  process.exit(0);
}

function updateLedgerStatus(entryId, gitHash) {
  if (!fs.existsSync(LEDGER_PATH)) {
    console.error(`❌ Ledger not found: ${LEDGER_PATH}`);
    process.exit(1);
  }

  let content = fs.readFileSync(LEDGER_PATH, 'utf-8');
  const entryRegex = new RegExp(`(## ${entryId}.*?\\n)(Status: .*?\\n)`, 's');
  
  if (!entryRegex.test(content)) {
    console.error(`❌ Entry ${entryId} not found in ledger`);
    process.exit(1);
  }

  // Update status header
  content = content.replace(
    entryRegex,
    `$1Status: **DONE** ✅\n`
  );

  // Update git hash if present
  const hashRegex = new RegExp(`(${entryId}.*?Git Hash: ).*?\\n`, 's');
  if (hashRegex.test(content)) {
    content = content.replace(hashRegex, `$1\`${gitHash}\`\n`);
  }

  fs.writeFileSync(LEDGER_PATH, content);
}

function addApprovalComment(entryId) {
  if (!fs.existsSync(LEDGER_PATH)) {
    return;
  }

  let content = fs.readFileSync(LEDGER_PATH, 'utf-8');
  const timestamp = new Date().toISOString();
  const approver = process.env.USER || 'PM';

  // Find the entry section
  const entryRegex = new RegExp(`(## ${entryId}.*?)(\\n## |$)`, 's');
  const match = content.match(entryRegex);
  
  if (!match) {
    return;
  }

  // Check if approval already exists
  if (match[1].includes('✅ APPROVED')) {
    console.warn(`⚠️  Approval already exists for ${entryId}`);
    return;
  }

  // Add approval comment before next entry or end of file
  const approvalComment = `\n### PM Approval\n\n✅ **APPROVED**  \n**Timestamp:** ${timestamp}  \n**Approved By:** ${approver}  \n**Evidence:** \`.ralph/${entryId}-completion-report.md\`\n`;

  content = content.replace(
    entryRegex,
    `${match[1]}${approvalComment}$2`
  );

  fs.writeFileSync(LEDGER_PATH, content);
}

function createCompletionReport(entryId, gitHash) {
  fs.mkdirSync(RALPH_DIR, { recursive: true });

  const reportPath = path.join(RALPH_DIR, `${entryId}-completion-report.md`);
  
  if (fs.existsSync(reportPath)) {
    console.warn(`⚠️  Completion report already exists: ${reportPath}`);
    return;
  }

  const template = `# ${entryId} - Completion Report

**Status:** DONE ✅  
**Completed:** ${new Date().toISOString()}  
**Git Hash:** \`${gitHash}\`  
**Approved By:** ${process.env.USER || 'PM'}

## Production Readiness Checklist

- [ ] Production URL loads without errors
- [ ] All authentication methods tested on production
- [ ] All critical user flows functional
- [ ] CEO explicit requests verified (with screenshots)
- [ ] No console errors in browser
- [ ] No 500 errors on any major page
- [ ] Performance acceptable (Lighthouse > 80)
- [ ] Mobile responsive verified
- [ ] Monitoring and alerting configured
- [ ] Rollback plan documented and tested

## Evidence

**Evidence Location:** \`.evidence/reports/gate-8-${entryId}/\`
**Screenshots:** TBD
**Test Results:** TBD

## Sign-Off

**PM Signature:** ${process.env.USER || 'PM'}  
**Date:** ${new Date().toISOString()}

---
*This report was generated automatically by PM Gate 6 enforcement script.*
`;

  fs.writeFileSync(reportPath, template);
  console.log(`📄 Created: ${reportPath}`);
}

main();
