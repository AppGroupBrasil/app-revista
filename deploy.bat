@echo off
chcp 65001 >nul
title APP REVISTA — Deploy Hetzner

REM ============================================
REM  Deploy APP REVISTA (Next.js) to Hetzner
REM  Uso: clicar 2x ou rodar: deploy.bat
REM ============================================

set SERVER=root@46.225.191.114
set SSH_KEY=%USERPROFILE%\.ssh\hetzner_key
set REMOTE_DIR=/root/apprevista/nextjs
set CONTAINER=apprevista-web

echo.
echo ============================================
echo   APP REVISTA — Deploy para Producao
echo ============================================
echo.

REM Verificar se a chave SSH existe
if not exist "%SSH_KEY%" (
    echo [ERRO] Chave SSH nao encontrada em: %SSH_KEY%
    echo.
    echo Copie a chave hetzner_key para: %USERPROFILE%\.ssh\
    echo.
    pause
    exit /b 1
)

REM 1. Build local
echo [1/5] Fazendo build de producao...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Build falhou!
    pause
    exit /b 1
)

REM 2. Empacotar (usando tar do Windows 10+)
echo [2/5] Empacotando arquivos...
tar czf "%TEMP%\apprevista-deploy.tar.gz" --exclude=node_modules --exclude=.next --exclude=.git --exclude=scripts --exclude="*.md" .

REM 3. Upload para o servidor
echo [3/5] Enviando para o servidor...
ssh -i "%SSH_KEY%" %SERVER% "mkdir -p %REMOTE_DIR%"
scp -i "%SSH_KEY%" "%TEMP%\apprevista-deploy.tar.gz" %SERVER%:%REMOTE_DIR%/deploy.tar.gz

REM 4. Build Docker no servidor
echo [4/5] Construindo imagem Docker no servidor...
ssh -i "%SSH_KEY%" %SERVER% "cd %REMOTE_DIR% && tar xzf deploy.tar.gz && rm deploy.tar.gz && docker stop %CONTAINER% 2>/dev/null; docker rm %CONTAINER% 2>/dev/null; docker compose build --no-cache && docker compose up -d && docker image prune -f && echo '---' && docker ps --filter name=%CONTAINER% --format '{{.Names}} {{.Status}} {{.Ports}}'"

REM 5. Verificar
echo [5/5] Verificando...
timeout /t 5 /nobreak >nul
ssh -i "%SSH_KEY%" %SERVER% "docker inspect %CONTAINER% --format '{{.State.Status}}'"

echo.
echo ============================================
echo   Deploy concluido!
echo   https://apprevista.com.br
echo ============================================
echo.
pause
