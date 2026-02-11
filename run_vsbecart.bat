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
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo ==========================================
pause
