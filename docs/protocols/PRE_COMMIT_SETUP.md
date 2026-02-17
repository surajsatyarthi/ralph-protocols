# Pre-Commit Hook Setup (Optional Local Enforcement)

Enforce gates locally before code even reaches GitHub.

## Installation

```bash
# Install husky
npm install --save-dev husky

# Initialize husky
npx husky init

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔒 Running local gate enforcement..."

# Get entry ID from branch name
BRANCH=$(git symbolic-ref --short HEAD)
ENTRY=$(echo "$BRANCH" | grep -oE 'ENTRY-[0-9]{3}' || echo "ENTRY-000")

echo "📋 Branch: $BRANCH"
echo "📝 Entry: $ENTRY"

# Gate 5: Lint Strict
echo "\n🔍 Gate 5: Checking lint suppressions..."
npm run lint:strict -- $ENTRY || exit 1

# Gate 7: Security (quick check)
echo "\n🔒 Gate 7: Scanning for secrets..."
if command -v gitleaks &> /dev/null; then
  gitleaks protect --staged || exit 1
else
  echo "⚠️  gitleaks not installed, skipping..."
fi

echo "\n✅ Local gates passed! Proceeding with commit..."
EOF

chmod +x .husky/pre-commit
```

## Quick One-Liner

```bash
npm install --save-dev husky && npx husky init && \
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
BRANCH=$(git symbolic-ref --short HEAD)
ENTRY=$(echo "$BRANCH" | grep -oE 'ENTRY-[0-9]{3}' || echo "ENTRY-000")
echo "🔒 Gate 5: Lint..."
npm run lint:strict -- $ENTRY || exit 1
echo "✅ Local gates passed!"
EOF
chmod +x .husky/pre-commit
```

## What It Does

1. Runs before every `git commit`
2. Extracts ENTRY-XXX from branch name
3. Runs Gate 5 (Lint Suppression Check)
4. Optionally runs gitleaks (if installed)
5. **Blocks commit if gates fail**

## Bypass (Emergency Only)

```bash
# Skip pre-commit hook (NOT RECOMMENDED)
git commit --no-verify -m "message"
```

**Warning:** CI/CD will still catch violations.
