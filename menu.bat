@echo off
title MercadoLivre Poster Generator - Menu Principal
color 0F

:menu
cls
echo.
echo ========================================
echo  🛒 MERCADOLIVRE POSTER GENERATOR
echo ========================================
echo.
echo 📋 MENU PRINCIPAL
echo.
echo 1. 🚀 Iniciar Aplicacao
echo 2. 📦 Instalar Dependencias  
echo 3. ⚙️  Configurar API
echo 4. 🏗️  Build para Producao
echo 5. 👁️  Preview do Build
echo 6. 🧹 Limpar Cache
echo 7. 📊 Status do Projeto
echo 8. 📚 Abrir Documentacao
echo 9. ❌ Sair
echo.

set /p opcao=Escolha uma opcao (1-9): 

if "%opcao%"=="1" goto :iniciar
if "%opcao%"=="2" goto :instalar
if "%opcao%"=="3" goto :configurar
if "%opcao%"=="4" goto :build
if "%opcao%"=="5" goto :preview
if "%opcao%"=="6" goto :limpar
if "%opcao%"=="7" goto :status
if "%opcao%"=="8" goto :docs
if "%opcao%"=="9" goto :sair

echo.
echo ❌ Opcao invalida! Tente novamente.
timeout /t 2 >nul
goto :menu

:iniciar
cls
echo.
echo 🚀 Iniciando aplicacao...
echo.
call iniciar.bat
goto :menu

:instalar
cls
echo.
echo 📦 Instalando dependencias...
echo.
call instalar.bat
goto :menu

:configurar
cls
echo.
echo ⚙️  Configurando aplicacao...
echo.
call configurar.bat
goto :menu

:build
cls
echo.
echo 🏗️  Gerando build de producao...
echo.
call build.bat
goto :menu

:preview
cls
echo.
echo 👁️  Iniciando preview do build...
echo.
if not exist "dist" (
    echo ❌ Build nao encontrado! Execute opcao 4 primeiro.
    pause
    goto :menu
)
echo 🌐 Abrindo preview em http://localhost:4173/
echo ⏹️  Para parar, pressione Ctrl+C
echo.
npm run preview
goto :menu

:limpar
cls
echo.
echo 🧹 Limpando cache e arquivos temporarios...
echo.
if exist "node_modules" (
    echo 📁 Removendo node_modules...
    rmdir /s /q "node_modules"
)
if exist "dist" (
    echo 📁 Removendo dist...
    rmdir /s /q "dist"
)
if exist "package-lock.json" (
    echo 📄 Removendo package-lock.json...
    del "package-lock.json"
)
echo.
echo ✅ Limpeza concluida!
echo 💡 Execute a opcao 2 para reinstalar dependencias.
echo.
pause
goto :menu

:status
cls
echo.
echo 📊 STATUS DO PROJETO
echo ========================================
echo.

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js: Nao instalado
) else (
    echo ✅ Node.js: 
    node --version
)

REM Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm: Nao disponivel
) else (
    echo ✅ npm: 
    npm --version
)

REM Verificar dependencias
if exist "node_modules" (
    echo ✅ Dependencias: Instaladas
) else (
    echo ❌ Dependencias: Nao instaladas
)

REM Verificar .env
if exist ".env" (
    echo ✅ Configuracao: .env encontrado
) else (
    echo ⚠️  Configuracao: .env nao encontrado
)

REM Verificar build
if exist "dist" (
    echo ✅ Build: Disponivel
) else (
    echo ❌ Build: Nao gerado
)

echo.
echo 📁 ESTRUTURA DO PROJETO:
if exist "src" echo ✅ src/ - Codigo fonte
if exist "public" echo ✅ public/ - Arquivos publicos
if exist "package.json" echo ✅ package.json - Configuracao
if exist "README.md" echo ✅ README.md - Documentacao

echo.
echo 🌐 PORTAS UTILIZADAS:
echo    Desenvolvimento: 5173
echo    Preview: 4173

echo.
pause
goto :menu

:docs
cls
echo.
echo 📚 DOCUMENTACAO DISPONIVEL
echo ========================================
echo.
echo 📖 Arquivos de documentacao:
echo.

if exist "README.md" (
    echo ✅ README.md - Guia principal
    echo    Visao geral e instrucoes basicas
)

if exist "USAGE.md" (
    echo ✅ USAGE.md - Manual de uso
    echo    Guia detalhado para afiliados
)

if exist "DEPLOY.md" (
    echo ✅ DEPLOY.md - Guia de deploy
    echo    Como hospedar a aplicacao
)

if exist "FEATURES.md" (
    echo ✅ FEATURES.md - Lista de funcionalidades
    echo    Todas as funcionalidades disponiveis
)

if exist "CHANGELOG.md" (
    echo ✅ CHANGELOG.md - Historico de versoes
    echo    Mudancas e atualizacoes
)

echo.
echo 🌐 Links uteis:
echo    Google AI Studio: https://makersuite.google.com/app/apikey
echo    Node.js Download: https://nodejs.org/
echo    Netlify Deploy: https://netlify.com/drop
echo.

echo 📖 Deseja abrir algum arquivo? (README/USAGE/DEPLOY/N)
set /p doc_choice=
if /i "%doc_choice%"=="README" start README.md
if /i "%doc_choice%"=="USAGE" start USAGE.md
if /i "%doc_choice%"=="DEPLOY" start DEPLOY.md

goto :menu

:sair
cls
echo.
echo 👋 Obrigado por usar o MercadoLivre Poster Generator!
echo.
echo 🎯 Desenvolvido para maximizar suas vendas como afiliado
echo 💰 Aceita todos os tipos de links do MercadoLivre
echo 🤖 Powered by Google Gemini AI
echo.
echo 📧 Para suporte, consulte a documentacao
echo.
timeout /t 3 >nul
exit