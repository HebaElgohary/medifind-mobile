@echo off
echo ===== CLEANING UP PROCESSES =====
taskkill /f /im node.exe 2>nul
timeout /t 2

echo ===== CLEARING CACHE =====
rmdir /s /q node_modules\.cache 2>nul
timeout /t 1

echo ===== SETTING ENVIRONMENT VARIABLES =====
set BASE_URL=http://192.168.1.57:7777
set FEATURE_ENABLED=true
set EXPO_WEB_DEBUG=true
set PLATFORM_NAME=web

echo ===== STARTING EXPO WEB WITH FIXES =====
npx expo start --web --no-dev 