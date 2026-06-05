@echo off
title E-Shop - Starting Server...
color 0A

echo.
echo  =============================================
echo    E-Shop - Local Development Server
echo  =============================================
echo.
echo  Starting server... Please wait.
echo.

cd /d "%~dp0backend"

:: Check if node_modules exists
if not exist "node_modules" (
  echo  [INFO] Installing dependencies for the first time...
  echo  This only happens once. Please wait...
  npm install
  echo.
)

:: Open browser after a short delay (2 seconds for server to start)
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5000"

:: Start the server
echo  [OK] Server is starting at http://localhost:5000
echo  [OK] Browser will open automatically...
echo.
echo  Press Ctrl+C to stop the server.
echo  =============================================
echo.

node server.js

pause
