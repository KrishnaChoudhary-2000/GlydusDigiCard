@echo off
echo Starting Glydus Digital Business Card Application...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd server && npm start"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Application is starting up!
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul 