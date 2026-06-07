@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed. Please install it from https://nodejs.org
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing dependencies...
  npm install
)
echo.
echo Starting Helm at http://localhost:3000
echo Press Ctrl+C to stop.
echo.
node server.js
pause
