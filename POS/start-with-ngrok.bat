@echo off
echo ========================================
echo   Starting POS Application with ngrok
echo ========================================
echo.

REM Start Angular Development Server
echo [1/2] Starting Angular Dev Server...
start "Angular Dev Server" cmd /k "cd /d %~dp0 && ng serve"

REM Wait for Angular to start
echo.
echo Waiting 15 seconds for Angular to compile...
timeout /t 15 /nobreak

REM Start ngrok tunnel
echo.
echo [2/2] Starting ngrok tunnel...
start "ngrok Tunnel" cmd /k "ngrok http 4200"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo - Angular Dev Server: http://localhost:4200
echo - ngrok will open in a new window
echo - Copy the ngrok HTTPS URL to share your app
echo.
echo Press any key to close this window...
pause > nul

