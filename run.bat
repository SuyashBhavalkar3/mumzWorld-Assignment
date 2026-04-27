@echo off
echo ==========================================
echo MUMZ-SHIELD AI LAUNCHER
echo ==========================================
echo.

echo Launching Backend (FastAPI)...
start cmd /k "cd server && venv\Scripts\activate && python main.py"

echo Launching Frontend (Next.js)...
start cmd /k "cd client && npm run dev"

echo.
echo Both servers are starting up. 
echo Dashboard will be available at http://localhost:3000
echo API will be available at http://127.0.0.1:8000
echo.
pause
