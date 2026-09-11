@echo off
title OmniManga & Light Novels Launcher
echo ===================================================
echo   Starting OmniManga, Comics & Light Novels Hub
echo ===================================================

echo [1/2] Launching Backend on http://127.0.0.1:8000...
start "OmniManga Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

echo [2/2] Launching Frontend on http://127.0.0.1:5173...
start "OmniManga Frontend" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo Application started! Opening browser...
timeout /t 2 >nul
start http://127.0.0.1:5173
