@echo off
color 0A
echo.
echo ========================================
echo    POS APP STATUS CHECKER
echo ========================================
echo.

echo Checking Angular Dev Server...
curl -s http://localhost:4200 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Angular is running on http://localhost:4200
) else (
    echo [X] Angular is NOT running!
    echo     Start it with: ng serve --disable-host-check
)

echo.
echo Checking ngrok tunnel...
curl -s http://127.0.0.1:4040/api/tunnels >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] ngrok is running
    echo.
    echo Your Public URL:
    curl -s http://127.0.0.1:4040/api/tunnels | findstr "public_url"
) else (
    echo [X] ngrok is NOT running!
    echo     Start it with: ngrok http 4200
)

echo.
echo ========================================
echo.
pause

