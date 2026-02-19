@echo off
title Dero Tycoon Launcher
cls
echo ==========================================
echo   Dero Tycoon: City - Launcher
echo ==========================================
echo.
echo This game uses modern JavaScript Modules.
echo To run it locally, we need a web server to avoid CORS errors.
echo.

:: Try Python 3
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Python found. Starting server...
    echo [INFO] Opening game in browser...
    start http://localhost:8000
    python -m http.server 8000
    goto end
)

:: Try Python 2
python2 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Python 2 found. Starting server...
    echo [INFO] Opening game in browser...
    start http://localhost:8000
    python2 -m SimpleHTTPServer 8000
    goto end
)

:: Try Node.js (npx)
where npx >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Node.js found. Starting http-server...
    echo [INFO] Opening game in browser...
    start http://localhost:8000
    call npx http-server -p 8000
    goto end
)

:: Try PHP
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] PHP found. Starting server...
    echo [INFO] Opening game in browser...
    start http://localhost:8000
    php -S localhost:8000
    goto end
)

echo [ERROR] No suitable web server found!
echo.
echo You need one of the following installed:
echo - Python (Recommended)
echo - Node.js
echo - PHP
echo.
echo Please install Python from https://python.org and run this file again.
echo.
pause

:end
