#!/bin/bash
#
# MIGRATE_PROJECT.sh - Migrate project to Circular Enforcement v2.0
#
# Usage: bash MIGRATE_PROJECT.sh /path/to/your-project
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if project path provided
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: No project path provided${NC}"
  echo ""
  echo "Usage: bash MIGRATE_PROJECT.sh /path/to/your-project"
  echo ""
  echo "Example:"
  echo "  bash MIGRATE_PROJECT.sh ~/Desktop/antigravity-directory"
  exit 1
fi

PROJECT_PATH="$1"
ALPHA_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if project path exists
if [ ! -d "$PROJECT_PATH" ]; then
  echo -e "${RED}❌ Error: Project path does not exist: $PROJECT_PATH${NC}"
  exit 1
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 CIRCULAR ENFORCEMENT v2.0 - PROJECT MIGRATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Project:${NC} $PROJECT_PATH"
echo -e "${YELLOW}Alpha:${NC} $ALPHA_PATH"
echo ""

# Confirm migration
read -p "Proceed with migration? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Migration cancelled.${NC}"
  exit 0
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}STEP 1: Removing old protocol files${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$PROJECT_PATH"

# Remove old protocol files
OLD_FILES=(
  ".agent/PM_PROTOCOL.md"
  ".agent/QA_PROTOCOL.md"
  ".agent/RALPH_PROTOCOL.md"
  ".agent/STANDING_ORDERS.md"
  ".agent/WORKFLOW.md"
)

for file in "${OLD_FILES[@]}"; do
  if [ -f "$file" ]; then
    rm -f "$file"
    echo -e "${GREEN}✅ Removed:${NC} $file"
  else
    echo -e "${YELLOW}⏭️  Skipped:${NC} $file (not found)"
  fi
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}STEP 2: Creating directories${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

mkdir -p .agent scripts docs .ralph
echo -e "${GREEN}✅ Created:${NC} .agent/ scripts/ docs/ .ralph/"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}STEP 3: Copying new protocol files${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Copy new protocol files
cp "$ALPHA_PATH/RALPH_PROTOCOL.md" .agent/
echo -e "${GREEN}✅ Copied:${NC} RALPH_PROTOCOL.md (v6.5) → .agent/"

cp "$ALPHA_PATH/PM_PROTOCOL.md" .agent/
echo -e "${GREEN}✅ Copied:${NC} PM_PROTOCOL.md (v3.0) → .agent/"

cp "$ALPHA_PATH/CIRCULAR_ENFORCEMENT.md" docs/
echo -e "${GREEN}✅ Copied:${NC} CIRCULAR_ENFORCEMENT.md → docs/"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}STEP 4: Copying verification scripts${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cp "$ALPHA_PATH/verification-scripts/"*.js scripts/
chmod +x scripts/verify-*.js
echo -e "${GREEN}✅ Copied:${NC} verify-pm-gates.js → scripts/"
echo -e "${GREEN}✅ Copied:${NC} verify-ralph-gates.js → scripts/"
echo -e "${GREEN}✅ Copied:${NC} verify-pm-documentation.js → scripts/"
echo -e "${GREEN}✅ Made executable:${NC} scripts/verify-*.js"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}STEP 5: Updating package.json${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "package.json" ]; then
  # Check if commands already exist
  if grep -q '"verify:pm-gates"' package.json; then
    echo -e "${YELLOW}⏭️  Skipped:${NC} package.json already has verification commands"
  else
    echo -e "${YELLOW}⚠️  Manual step required:${NC} Add these to package.json scripts section:"
    echo ""
    echo '  "verify:pm-gates": "node scripts/verify-pm-gates.js",'
    echo '  "verify:ralph-gates": "node scripts/verify-ralph-gates.js",'
    echo '  "verify:pm-documentation": "node scripts/verify-pm-documentation.js",'
    echo '  "verify:circular": "npm run verify:pm-gates && npm run verify:ralph-gates && npm run verify:pm-documentation"'
    echo ""
  fi
else
  echo -e "${YELLOW}⏭️  Skipped:${NC} No package.json found (not a Node.js project)"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}STEP 6: Testing verification scripts${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test verification scripts
echo "Testing verify-pm-gates.js..."
if node scripts/verify-pm-gates.js ENTRY-001 2>&1 | grep -q "PM GATE VERIFICATION FAILED"; then
  echo -e "${GREEN}✅ Test passed:${NC} verify-pm-gates.js (correctly fails without artifacts)"
else
  echo -e "${RED}❌ Test failed:${NC} verify-pm-gates.js"
fi

echo ""
echo "Testing verify-ralph-gates.js..."
if [ -f "package.json" ]; then
  if node scripts/verify-ralph-gates.js ENTRY-001 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Test passed:${NC} verify-ralph-gates.js"
  else
    echo -e "${YELLOW}⚠️  Warning:${NC} verify-ralph-gates.js failed (may need build/lint/test to pass first)"
  fi
else
  echo -e "${YELLOW}⏭️  Skipped:${NC} verify-ralph-gates.js (no package.json)"
fi

echo ""
echo "Testing verify-pm-documentation.js..."
if node scripts/verify-pm-documentation.js ENTRY-001 2>&1 | grep -q "PM DOCUMENTATION VERIFICATION FAILED"; then
  echo -e "${GREEN}✅ Test passed:${NC} verify-pm-documentation.js (correctly fails without docs)"
else
  echo -e "${RED}❌ Test failed:${NC} verify-pm-documentation.js"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}STEP 7: Migration summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}✅ Migration complete!${NC}"
echo ""
echo "Files added:"
echo "  - .agent/RALPH_PROTOCOL.md (v6.5)"
echo "  - .agent/PM_PROTOCOL.md (v3.0)"
echo "  - docs/CIRCULAR_ENFORCEMENT.md"
echo "  - scripts/verify-pm-gates.js"
echo "  - scripts/verify-ralph-gates.js"
echo "  - scripts/verify-pm-documentation.js"
echo ""
echo "Old files removed:"
echo "  - .agent/PM_PROTOCOL.md (old version)"
echo "  - .agent/QA_PROTOCOL.md"
echo "  - .agent/RALPH_PROTOCOL.md (old version)"
echo "  - .agent/STANDING_ORDERS.md"
echo "  - .agent/WORKFLOW.md"
echo ""

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}NEXT STEPS:${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. If package.json update was skipped, add verification commands manually"
echo "2. Read your new protocol file:"
echo "   - AI Coders: cat .agent/RALPH_PROTOCOL.md"
echo "   - PMs: cat .agent/PM_PROTOCOL.md"
echo "3. Read workflow documentation: cat docs/CIRCULAR_ENFORCEMENT.md"
echo "4. Test verification commands:"
echo "   - npm run verify:pm-gates -- ENTRY-001"
echo "   - npm run verify:ralph-gates -- ENTRY-001"
echo "   - npm run verify:pm-documentation -- ENTRY-001"
echo ""
echo -e "${GREEN}Migration successful! You're now using Circular Enforcement v2.0${NC}"
echo ""
