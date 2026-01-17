# Quick Testing Script untuk Error Fixes (Windows)
# File: test-fixes.ps1

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🔧 Testing Error Fixes - Peweb Panel" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check if Sidebar.tsx was updated
Write-Host "1️⃣ Checking Sidebar.tsx..." -ForegroundColor Yellow
$sidebarContent = Get-Content "src\components\fragments\Sidebar.tsx" -Raw
if ($sidebarContent -match 'href="/docs"') {
    Write-Host "   ❌ ERROR: /docs link still exists in Sidebar.tsx" -ForegroundColor Red
    Write-Host "   → Please apply the fix from FIXES_REQUIRED.md" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ PASS: /docs link has been fixed" -ForegroundColor Green
}
Write-Host ""

# 2. Check for other /docs references
Write-Host "2️⃣ Searching for other /docs references..." -ForegroundColor Yellow
$docsRefs = Select-String -Path "src\**\*.tsx", "src\**\*.ts" -Pattern 'href="/docs"' -ErrorAction SilentlyContinue
if ($docsRefs) {
    Write-Host "   ⚠️  WARNING: Found /docs references:" -ForegroundColor Yellow
    $docsRefs | ForEach-Object { Write-Host "      $($_.Path):$($_.LineNumber)" -ForegroundColor Gray }
} else {
    Write-Host "   ✅ PASS: No other /docs references found" -ForegroundColor Green
}
Write-Host ""

# 3. Check for checkout-related scripts
Write-Host "3️⃣ Checking for checkout scripts..." -ForegroundColor Yellow
if (Test-Path "src\app\layout.tsx") {
    $layoutContent = Get-Content "src\app\layout.tsx" -Raw
    if ($layoutContent -match "checkout" -and $layoutContent -match "Script") {
        Write-Host "   ⚠️  WARNING: Found checkout script in layout.tsx" -ForegroundColor Yellow
        Select-String -Path "src\app\layout.tsx" -Pattern "checkout" | ForEach-Object {
            Write-Host "      Line $($_.LineNumber): $($_.Line)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ✅ PASS: No checkout scripts found in layout.tsx" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠️  WARNING: layout.tsx not found" -ForegroundColor Yellow
}
Write-Host ""

# 4. Check dependencies for payment libraries
Write-Host "4️⃣ Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw
    if ($packageJson -match "checkout|stripe|paypal|payment") {
        Write-Host "   ⚠️  INFO: Found payment-related dependencies:" -ForegroundColor Yellow
        Select-String -Path "package.json" -Pattern "checkout|stripe|paypal|payment" | ForEach-Object {
            Write-Host "      $($_.Line)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ✅ PASS: No payment dependencies found" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ ERROR: package.json not found" -ForegroundColor Red
}
Write-Host ""

# 5. Verify backup exists
Write-Host "5️⃣ Checking backup file..." -ForegroundColor Yellow
if (Test-Path "src\components\fragments\Sidebar.tsx.backup") {
    Write-Host "   ✅ PASS: Backup file exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  INFO: No backup file found (optional)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📋 Testing Summary" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "1. Start dev server: npm run dev" -ForegroundColor Gray
Write-Host "2. Open browser: http://localhost:3000" -ForegroundColor Gray
Write-Host "3. Open DevTools Console (F12)" -ForegroundColor Gray
Write-Host "4. Navigate through Admin/Developer menus" -ForegroundColor Gray
Write-Host "5. Verify no 404 /docs errors" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation:" -ForegroundColor White
Write-Host "- See FIXES_REQUIRED.md for detailed info" -ForegroundColor Gray
Write-Host "- Check console for remaining errors" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
