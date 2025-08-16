@echo off
title MercadoLivre Poster Generator - Configuracao
color 0D

echo.
echo ========================================
echo  🛒 MERCADOLIVRE POSTER GENERATOR
echo ========================================
echo.
echo ⚙️  Configuracao da aplicacao...
echo.

REM Verificar se o arquivo .env existe
if exist ".env" (
    echo ✅ Arquivo .env encontrado
    echo.
    echo 📝 Conteudo atual do .env:
    echo ----------------------------------------
    type ".env"
    echo ----------------------------------------
    echo.
    
    echo 🔄 Deseja reconfigurar? (S/N)
    set /p reconfig=
    if /i "%reconfig%"=="N" goto :end
    if /i "%reconfig%"=="n" goto :end
)

echo.
echo 🔑 CONFIGURACAO DA CHAVE DA API GEMINI
echo.
echo 📥 Para obter sua chave da API:
echo    1. Acesse: https://makersuite.google.com/app/apikey
echo    2. Clique em "Create API Key"
echo    3. Copie a chave gerada
echo.

echo 🔐 Cole sua chave da API do Gemini:
echo    (ou pressione Enter para usar templates locais)
set /p api_key=

if "%api_key%"=="" (
    echo.
    echo 💡 Configurando para usar templates locais...
    echo # Configuracao do MercadoLivre Poster Generator > .env
    echo # Para usar IA, descomente e adicione sua chave: >> .env
    echo # VITE_GEMINI_API_KEY=sua_chave_aqui >> .env
    echo. >> .env
    echo # Sem chave da API, a aplicacao usara templates locais >> .env
    echo VITE_GEMINI_API_KEY= >> .env
    
    echo ✅ Configurado para usar templates locais
) else (
    echo.
    echo 🔑 Configurando chave da API...
    echo # Configuracao do MercadoLivre Poster Generator > .env
    echo # Chave da API do Google Gemini >> .env
    echo VITE_GEMINI_API_KEY=%api_key% >> .env
    
    echo ✅ Chave da API configurada com sucesso!
)

echo.
echo 📋 CONFIGURACAO ADICIONAL (Opcional):
echo.

echo 🎨 Deseja personalizar configuracoes avancadas? (S/N)
set /p advanced=
if /i "%advanced%"=="S" goto :advanced
if /i "%advanced%"=="s" goto :advanced
goto :end

:advanced
echo.
echo ⚙️  CONFIGURACOES AVANCADAS
echo.

echo 🌐 Porta do servidor de desenvolvimento (padrao: 5173):
set /p port=
if not "%port%"=="" (
    echo. >> .env
    echo # Porta do servidor de desenvolvimento >> .env
    echo VITE_PORT=%port% >> .env
)

echo.
echo 🔧 Nivel de log (error/warn/info/debug):
set /p log_level=
if not "%log_level%"=="" (
    echo. >> .env
    echo # Nivel de log >> .env
    echo VITE_LOG_LEVEL=%log_level% >> .env
)

echo.
echo ✅ Configuracoes avancadas salvas!

:end
echo.
echo 🎉 CONFIGURACAO CONCLUIDA!
echo.

if exist ".env" (
    echo 📝 Arquivo .env final:
    echo ----------------------------------------
    type ".env"
    echo ----------------------------------------
)

echo.
echo 🚀 Proximos passos:
echo    1. Execute: iniciar.bat
echo    2. Acesse: http://localhost:5173/
echo    3. Cole um link do MercadoLivre
echo    4. Gere seus posters profissionais!
echo.

echo 📚 Documentacao:
echo    README.md - Guia completo
echo    USAGE.md - Como usar
echo.

pause