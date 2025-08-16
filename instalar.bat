@echo off
title Instalação - Gerador de CTA
color 0B

echo.
echo ========================================
echo    📦 INSTALANDO DEPENDÊNCIAS
echo ========================================
echo.

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo.
    echo 📥 Instale o Node.js em: https://nodejs.org
    echo    Recomendado: Versão LTS (Long Term Support)
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado!
node --version
echo.

echo 📦 Instalando dependências do projeto...
echo    Isso pode levar alguns minutos...
echo.

npm install

if errorlevel 1 (
    echo.
    echo ❌ Erro na instalação!
    echo.
    echo 🔧 Possíveis soluções:
    echo 1. Verifique sua conexão com a internet
    echo 2. Execute como administrador
    echo 3. Limpe o cache: npm cache clean --force
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Instalação concluída com sucesso!
echo.
echo 🚀 Para iniciar o aplicativo, execute: iniciar.bat
echo.
pause