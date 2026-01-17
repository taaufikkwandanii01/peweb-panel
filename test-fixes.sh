#!/bin/bash
# Quick Testing Script untuk Error Fixes
# File: test-fixes.sh

echo "========================================="
echo "🔧 Testing Error Fixes - Peweb Panel"
echo "========================================="
echo ""

# 1. Check if Sidebar.tsx was updated
echo "1️⃣ Checking Sidebar.tsx..."
if grep -q "href=\"/docs\"" src/components/fragments/Sidebar.tsx; then
    echo "   ❌ ERROR: /docs link still exists in Sidebar.tsx"
    echo "   → Please apply the fix from FIXES_REQUIRED.md"
else
    echo "   ✅ PASS: /docs link has been fixed"
fi
echo ""

# 2. Check for other /docs references
echo "2️⃣ Searching for other /docs references..."
DOCS_COUNT=$(grep -r "href=\"/docs\"" src/ 2>/dev/null | wc -l)
if [ "$DOCS_COUNT" -gt 0 ]; then
    echo "   ⚠️  WARNING: Found $DOCS_COUNT more /docs references:"
    grep -r "href=\"/docs\"" src/ 2>/dev/null
else
    echo "   ✅ PASS: No other /docs references found"
fi
echo ""

# 3. Check for checkout-related scripts
echo "3️⃣ Checking for checkout scripts..."
if grep -r "checkout" src/app/layout.tsx 2>/dev/null | grep -q "Script"; then
    echo "   ⚠️  WARNING: Found checkout script in layout.tsx"
    grep -n "checkout" src/app/layout.tsx
else
    echo "   ✅ PASS: No checkout scripts found in layout.tsx"
fi
echo ""

# 4. Check dependencies for payment libraries
echo "4️⃣ Checking dependencies..."
if grep -i "checkout\|stripe\|paypal\|payment" package.json > /dev/null 2>&1; then
    echo "   ⚠️  INFO: Found payment-related dependencies:"
    grep -i "checkout\|stripe\|paypal\|payment" package.json
else
    echo "   ✅ PASS: No payment dependencies found"
fi
echo ""

# 5. Verify backup exists
echo "5️⃣ Checking backup file..."
if [ -f "src/components/fragments/Sidebar.tsx.backup" ]; then
    echo "   ✅ PASS: Backup file exists"
else
    echo "   ⚠️  INFO: No backup file found (optional)"
fi
echo ""

echo "========================================="
echo "📋 Testing Summary"
echo "========================================="
echo ""
echo "Next Steps:"
echo "1. Start dev server: npm run dev"
echo "2. Open browser: http://localhost:3000"
echo "3. Open DevTools Console (F12)"
echo "4. Navigate through Admin/Developer menus"
echo "5. Verify no 404 /docs errors"
echo ""
echo "Documentation:"
echo "- See FIXES_REQUIRED.md for detailed info"
echo "- Check console for remaining errors"
echo ""
