@echo off
echo ===== FIXING PACKAGE VERSIONS =====

echo Installing correct version of @react-native-community/datetimepicker...
call npm install @react-native-community/datetimepicker@8.2.0

echo Installing other potentially problematic packages...
call npm install @react-native-async-storage/async-storage@1.23.1
call npm install jwt-decode

echo ===== CLEANING CACHE =====
call npx expo doctor --fix-dependencies
call npx expo install --check

echo ===== STARTING EXPO =====
call npx expo start --clear 