# E-Shop - Local Server Startup Script
Write-Host ""
Write-Host "  =============================================" -ForegroundColor Cyan
Write-Host "    E-Shop - Local Development Server" -ForegroundColor Cyan
Write-Host "  =============================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $PSScriptRoot "backend"
Set-Location $backendPath

# Install dependencies if node_modules is missing
if (-not (Test-Path "node_modules")) {
    Write-Host "  [INFO] Installing dependencies (first time only)..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host "  [OK] Server starting at http://localhost:5000" -ForegroundColor Green
Write-Host "  [OK] Browser will open automatically..." -ForegroundColor Green
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server." -ForegroundColor Gray
Write-Host "  =============================================" -ForegroundColor Cyan
Write-Host ""

# Open browser after 2 seconds
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:5000"
} | Out-Null

# Start the server
node server.js
