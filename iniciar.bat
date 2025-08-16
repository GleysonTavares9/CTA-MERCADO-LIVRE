@echo off
title Gerador de CTA - MercadoLivre
color 0A

echo.
echo ========================================
echo    🚀 GERADOR DE CTA - MERCADOLIVRE
echo ========================================
echo.
echo 📱 Iniciando aplicativo...
echo.

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo.
    echo 📥 Instale o Node.js em: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    echo.
    npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
    echo.
)

REM Verificar se a API do Gemini está configurada
findstr /C:"VITE_GEMINI_API_KEY=AIza" .env >nul 2>&1
if errorlevel 1 (
    echo ⚠️  API do Gemini não configurada!
    echo.
    echo 🔧 Para configurar:
    echo 1. Acesse: https://makersuite.google.com/app/apikey
    echo 2. Gere uma chave da API
    echo 3. Cole no arquivo .env
    echo.
    echo 💡 O app funcionará com templates locais sem a API
    echo.
)

echo ✅ Tudo pronto! Iniciando servidor...
echo.
echo 🌐 O aplicativo abrirá em: http://localhost:5173
echo.
echo 📋 Como usar:
echo 1. Cole um link de afiliado do MercadoLivre
echo 2. Aguarde a extração automática dos dados
echo 3. Copie a mensagem gerada para o WhatsApp
echo.
echo ⏹️  Para parar: Pressione Ctrl+C
echo.

REM Iniciar o servidor de desenvolvimento
npm run dev

echo.
echo 👋 Aplicativo encerrado!
pause