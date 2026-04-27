@echo off
echo ==========================================
echo MUMZ-SHIELD AI SETUP (Windows)
echo ==========================================
echo.

echo [1/3] Setting up Backend Virtual Environment...
cd server
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
echo.

echo [2/3] Setting up Frontend Dependencies...
cd ../client
npm install
echo.

echo [3/3] Final Check...
echo Setup complete! 
echo.
echo IMPORTANT: Make sure to add your OPENAI_API_KEY to server/.env before starting.
echo.
pause
