#!/usr/bin/env node

/**
 * Gate 0: Pre-Assignment Blocker
 * Searches for duplicate work before allowing task assignment
 * EVIDENCE REQUIRED: audit-gate-0-ENTRY-XXX.log with research documentation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Configuration
const WORKSPACE_ROOT = process.cwd();
const EVIDENCE_DIR = path.join(WORKSPACE_ROOT, '.evidence');
const BRAIN_DIR = process.env.BRAIN_DIR || path.join(process.env.HOME, '.gemini/antigravity/brain');

function main() {
  const entryId = process.argv[2];
  
  if (!entryId || !entryId.match(/ENTRY-\d{3}/)) {
    console.error('❌ Usage: npm run pre-assign -- ENTRY-XXX');
    process.exit(1);
  }

  console.log(`\n🔍 Gate 0: Pre-Assignment Check for ${entryId}\n`);

  const auditLog = {
    entry: entryId,
    timestamp: new Date().toISOString(),
    searches: []
  };

  // Search 1: Check walkthroughs for similar work
  console.log('📋 Searching walkthroughs...');
  const walkthroughSearch = searchWalkthroughs(entryId);
  auditLog.searches.push(walkthroughSearch);
  
  if (walkthroughSearch.matches.length > 0) {
    console.error(`❌ DUPLICATE WORK DETECTED in walkthroughs:`);
    walkthroughSearch.matches.forEach(m => console.error(`   - ${m}`));
    saveAuditLog(entryId, auditLog, 'BLOCKED');
    process.exit(1);
  }

  // Search 2: Check git commits
  console.log('📝 Searching git history...');
  const gitSearch = searchGitCommits(entryId);
  auditLog.searches.push(gitSearch);
  
  if (gitSearch.matches.length > 0) {
    console.error(`❌ SIMILAR WORK FOUND in git:`);
    gitSearch.matches.forEach(m => console.error(`   - ${m}`));
    saveAuditLog(entryId, auditLog, 'BLOCKED');
    process.exit(1);
  }

  // Search 3: Check PROJECT_LEDGER
  console.log('📊 Searching PROJECT_LEDGER.md...');
  const ledgerSearch = searchLedger(entryId);
  auditLog.searches.push(ledgerSearch);
  
  if (ledgerSearch.duplicate) {
    console.error(`❌ ENTRY ${entryId} ALREADY EXISTS in ledger`);
    saveAuditLog(entryId, auditLog, 'BLOCKED');
    process.exit(1);
  }

  // Search 4: Check brain directory for artifacts
  console.log('🧠 Searching brain artifacts...');
  const brainSearch = searchBrainArtifacts(entryId);
  auditLog.searches.push(brainSearch);

  // All clear
  console.log('\n✅ Gate 0 PASSED: No duplicate work detected');
  console.log(`   Walkthroughs checked: ${walkthroughSearch.filesChecked}`);
  console.log(`   Git commits checked: ${gitSearch.commitsChecked}`);
  console.log(`   Ledger entries checked: ${ledgerSearch.entriesChecked}`);
  
  saveAuditLog(entryId, auditLog, 'PASSED');
  createEvidenceTicket('gate-0', entryId, `audit-gate-0-${entryId}.log`);
  
  process.exit(0);
}

function searchWalkthroughs(entryId) {
  const walkthroughsDir = path.join(BRAIN_DIR, '*', 'walkthrough.md');
  const search = {
    type: 'walkthroughs',
    query: entryId,
    filesChecked: 0,
    matches: []
  };

  try {
    const files = execSync(`find ${BRAIN_DIR} -name "walkthrough.md" 2>/dev/null`, { encoding: 'utf-8' })
      .split('\n')
      .filter(Boolean);
    
    search.filesChecked = files.length;
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes(entryId)) {
        search.matches.push(file);
      }
    });
  } catch (error) {
    // No walkthroughs found
  }

  return search;
}

function searchGitCommits(entryId) {
  const search = {
    type: 'git-commits',
    query: entryId,
    commitsChecked: 0,
    matches: []
  };

  try {
    const commits = execSync(`git log --all --grep="${entryId}" --oneline`, { encoding: 'utf-8' })
      .split('\n')
      .filter(Boolean);
    
    search.commitsChecked = commits.length;
    search.matches = commits;
  } catch (error) {
    // No commits found
  }

  return search;
}

function searchLedger(entryId) {
  const ledgerPath = path.join(WORKSPACE_ROOT, 'PROJECT_LEDGER.md');
  const search = {
    type: 'ledger',
    query: entryId,
    entriesChecked: 0,
    duplicate: false
  };

  if (!fs.existsSync(ledgerPath)) {
    return search;
  }

  const content = fs.readFileSync(ledgerPath, 'utf-8');
  const entries = content.match(/^##\s+ENTRY-\d{3}/gm) || [];
  
  search.entriesChecked = entries.length;
  search.duplicate = entries.some(entry => entry.includes(entryId));

  return search;
}

function searchBrainArtifacts(entryId) {
  const search = {
    type: 'brain-artifacts',
    query: entryId,
    artifactsFound: []
  };

  try {
    const artifacts = execSync(`find ${BRAIN_DIR} -name "*${entryId}*" 2>/dev/null`, { encoding: 'utf-8' })
      .split('\n')
      .filter(Boolean);
    
    search.artifactsFound = artifacts;
  } catch (error) {
    // No artifacts found
  }

  return search;
}

function saveAuditLog(entryId, auditLog, status) {
  const logContent = `# Gate 0 Pre-Assignment Audit - ${entryId}

**Status:** ${status}
**Timestamp:** ${auditLog.timestamp}

## Searches Conducted

${auditLog.searches.map(s => `
### ${s.type}
- Query: ${s.query}
- Files/Commits Checked: ${s.filesChecked || s.commitsChecked || s.entriesChecked || s.artifactsFound?.length || 0}
- Matches Found: ${s.matches?.length || (s.duplicate ? 1 : 0)}
${s.matches?.length > 0 ? `\n**Matches:**\n${s.matches.map(m => `- ${m}`).join('\n')}` : ''}
${s.artifactsFound?.length > 0 ? `\n**Artifacts:**\n${s.artifactsFound.map(a => `- ${a}`).join('\n')}` : ''}
`).join('\n')}

## Conclusion

${status === 'PASSED' ? '✅ No duplicate work detected. Safe to proceed with assignment.' : '❌ BLOCKED: Duplicate or similar work detected. Review matches before proceeding.'}

---
Generated: ${new Date().toISOString()}
`;

  const logPath = path.join(EVIDENCE_DIR, 'reports', `audit-gate-0-${entryId}.log`);
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, logContent);
  
  console.log(`\n📄 Audit log saved: ${logPath}`);
}

function createEvidenceTicket(gate, entry, evidenceFile) {
  const evidencePath = path.join(EVIDENCE_DIR, 'reports', evidenceFile);
  const content = fs.readFileSync(evidencePath, 'utf-8');
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  const timestamp = new Date().toISOString();
  const signature = crypto.createHash('sha256').update(`${process.env.USER}:${timestamp}:${hash}`).digest('hex');

  const ticket = {
    gate,
    entry,
    evidence: evidenceFile,
    hash,
    timestamp,
    signature,
    user: process.env.USER || 'unknown'
  };

  const ticketPath = path.join(EVIDENCE_DIR, 'tickets', `ticket-${gate}-${entry}.json`);
  fs.writeFileSync(ticketPath, JSON.stringify(ticket, null, 2));

  // Append to ledger
  const ledgerPath = path.join(EVIDENCE_DIR, 'ledger.csv');
  const ledgerEntry = `${gate},${entry},${evidenceFile},${hash},${timestamp},${signature}\n`;
  fs.appendFileSync(ledgerPath, ledgerEntry);

  console.log(`🎫 Evidence ticket created: ${ticketPath}`);
}

main();
