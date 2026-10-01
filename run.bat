@echo off
title SmartScreener Launcher
echo ====================================================
echo           SMARTSCREENER STARTUP LAUNCHER
echo ====================================================

echo [1/3] Starting FastAPI Backend on http://localhost:8000...
start "SmartScreener Backend" cmd /k "cd /d ""%~dp0backend"" && .\venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Starting Next.js Frontend on http://localhost:3000...
start "SmartScreener Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo ====================================================
echo   SmartScreener is launching!
echo   - Web Interface:  http://localhost:3000
echo   - API Swagger:    http://localhost:8000/docs
echo ====================================================
