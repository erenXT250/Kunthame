@echo off
title Push Kunthame Proposal to GitHub
color 0E
echo ========================================================
echo    Pushing Kunthame Marriage Proposal to GitHub...
echo ========================================================
echo.

cd /d "E:\kunthame"
git push -u origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo    SUCCESS! Site is being published!
) else (
    echo    If it asked to sign in, complete the browser
    echo    prompt and run this file again.
)
echo ========================================================
echo.
pause
