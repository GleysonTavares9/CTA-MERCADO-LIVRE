@echo off
title MercadoLivre Poster Generator - Build Producao
color 0E

echo.
echo ========================================
echo  🛒 MERCADOLIVRE POSTER GENERATOR
echo ========================================
echo.
echo 🏗️  Gerando build de producao...
echo.

REM Verificar se Node.js esta instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Node.js nao encontrado!
    echo.
    echo 📥 Por favor, instale o Node.js primeiro:
    echo    https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verificar se as dependencias estao instaladas
if not exist "node_modules" (
    echo ❌ ERRO: Dependencias nao encontradas!
    echo.
    echo 📦 Execute primeiro: instalar.bat
    echo.
    pause
    exit /b 1
)

REM Verificar se o arquivo .env existe
if not exist ".env" (
    echo.
    echo ⚠️  AVISO: Arquivo .env nao encontrado!
    echo.
    echo 🔑 Para usar a IA em producao, configure:
    echo    VITE_GEMINI_API_KEY=sua_chave_aqui
    echo.
    echo 💡 Continuando sem IA (usara templates locais)...
    echo.
)

echo ✅ Verificacoes concluidas
echo.

echo 🧹 Limpando build anterior...
if exist "dist" rmdir /s /q "dist"

echo.
echo 🔨 Executando build...
echo.

npm run build

if errorlevel 1 (
    echo.
    echo ❌ ERRO: Falha no build!
    echo.
    echo 🔧 Tente executar manualmente:
    echo    npm run build
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ BUILD CONCLUIDO COM SUCESSO!
echo.

REM Verificar se a pasta dist foi criada
if exist "dist" (
    echo 📁 Arquivos gerados na pasta: dist/
    echo.
    
    REM Mostrar tamanho dos arquivos principais
    if exist "dist\index.html" echo ✅ index.html criado
    if exist "dist\assets" echo ✅ Assets criados
    
    echo.
    echo 🌐 OPCOES DE DEPLOY:
    echo.
    echo 📤 Netlify:
    echo    1. Arraste a pasta 'dist' para netlify.com/drop
    echo    2. Configure VITE_GEMINI_API_KEY nas variaveis
    echo.
    echo 📤 Vercel:
    echo    1. Execute: npx vercel --prod
    echo    2. Configure VITE_GEMINI_API_KEY nas variaveis
    echo.
    echo 📤 GitHub Pages:
    echo    1. Commit e push para o repositorio
    echo    2. Configure GitHub Actions (ja configurado)
    echo.
    echo 📤 Servidor proprio:
    echo    1. Copie a pasta 'dist' para seu servidor
    echo    2. Configure servidor web (Apache/Nginx)
    echo.
) else (
    echo ❌ ERRO: Pasta dist nao foi criada!
)

echo.
echo 🎯 Para testar o build localmente:
echo    npm run preview
echo.

pause