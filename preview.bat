@echo off
title Abhishek Pal - Portfolio Local Preview
echo ========================================================
echo   Starting Abhishek Pal Portfolio Local Server...
echo ========================================================
echo.
echo   Opening http://localhost:8080 in your browser...
echo   (Press Ctrl+C in this window anytime to stop the server)
echo.
start http://localhost:8080
python -m http.server 8080
pause
