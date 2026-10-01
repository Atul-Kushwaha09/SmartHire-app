# SmartHire Concurrent Dev Server Startup Script (Windows PowerShell)

Write-Host "====================================================" -ForegroundColor Magenta
Write-Host "             SMARTHIRE STARTUP LAUNCHER             " -ForegroundColor Magenta
Write-Host "====================================================" -ForegroundColor Magenta

# Check local Ollama status
Write-Host "[1/3] Checking local AI backend status..." -ForegroundColor Cyan
try {
    $ollama = Invoke-WebRequest -Uri "http://localhost:11434/" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "[OK] Ollama LLM is running locally." -ForegroundColor Green
} catch {
    Write-Host "[!] Ollama is not detected at http://localhost:11434/." -ForegroundColor Yellow
    Write-Host "    The application will automatically start in Local NLP Fallback mode." -ForegroundColor Yellow
    Write-Host "    To use full LLM extraction capability, run 'ollama serve' in another terminal." -ForegroundColor Yellow
}

$projectRoot = $PSScriptRoot

# Start FastAPI Backend
Write-Host "[2/3] Starting FastAPI Backend on port 8000..." -ForegroundColor Cyan
$backendDir = Join-Path $projectRoot "backend"
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; .\venv\Scripts\Activate.ps1; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# Start Next.js Frontend
Write-Host "[3/3] Starting Next.js Dev Server on port 3000..." -ForegroundColor Cyan
$frontendDir = Join-Path $projectRoot "frontend"
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev"

Write-Host "====================================================" -ForegroundColor Green
Write-Host "  SmartHire is launching!" -ForegroundColor Green
Write-Host "  - Web Interface:  http://localhost:3000" -ForegroundColor Green
Write-Host "  - API Swagger:    http://localhost:8000/docs" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green

