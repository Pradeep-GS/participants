@echo off
echo ==========================================
echo Starting VSBECART - KANAL 2k26
echo Rhythm of Logic: Initiating System...
echo ==========================================

:: Start Backend
echo Launching Backend Server...
start "VSBECART Backend" cmd /c "cd /d %~dp0backend && npm run dev"

:: Start Frontend
echo Launching Frontend Application...
start "VSBECART Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"

echo ==========================================
echo Systems are launching in separate windows.
echo.
echo FRONTEND (UI): http://localhost:5173
echo BACKEND (API): http://localhost:5000
echo.
echo NOTE: Always open http://localhost:5173 to see your pages!
echo ==========================================
pause
