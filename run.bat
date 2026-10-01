@echo off
title SmartHire Launcher
echo ====================================================
echo             SMARTHIRE STARTUP LAUNCHER
echo ====================================================

echo [1/3] Starting FastAPI Backend on http://localhost:8000...
start "SmartHire Backend" cmd /k "cd /d ""%~dp0backend"" && .\venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Starting Next.js Frontend on http://localhost:3000...
start "SmartHire Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo ====================================================
echo   SmartHire is launching!
echo   - Web Interface:  http://localhost:3000
echo   - API Swagger:    http://localhost:8000/docs
echo ====================================================

