@echo off
title Corrigindo Erros da Aplicacao
color 0C

echo.
echo ========================================
echo  🔧 CORRIGINDO ERROS DA APLICACAO
echo ========================================
echo.

echo 🧹 Limpando cache do npm...
npm cache clean --force

echo.
echo 📦 Reinstalando dependencias...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
npm install

echo.
echo 🔄 Atualizando browserslist...
npx update-browserslist-db@latest

echo.
echo ✅ Erros corrigidos!
echo.
echo 🚀 Agora execute: iniciar.bat
echo.
pause