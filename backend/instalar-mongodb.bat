@echo off
title Instalar MongoDB Local
color 0C

echo.
echo ============================================
echo   INSTALACAO MONGODB LOCAL
echo ============================================
echo.

echo OPCAO 1: Instalar via Chocolatey (Recomendado)
echo.
echo 1. Abra PowerShell como Administrador
echo 2. Execute: Set-ExecutionPolicy Bypass -Scope Process -Force
echo 3. Execute: iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
echo 4. Execute: choco install mongodb
echo 5. Execute: net start MongoDB
echo.

echo OPCAO 2: Download Manual
echo.
echo 1. Acesse: https://www.mongodb.com/try/download/community
echo 2. Baixe MongoDB Community Server
echo 3. Instale com configuracao padrao
echo 4. Inicie o servico MongoDB
echo.

echo OPCAO 3: MongoDB Compass (Interface Grafica)
echo.
echo 1. Acesse: https://www.mongodb.com/try/download/compass
echo 2. Baixe e instale o MongoDB Compass
echo 3. Conecte em: mongodb://localhost:27017
echo.

echo.
echo Apos instalar MongoDB local, edite o arquivo .env:
echo MONGODB_URI=mongodb://localhost:27017/pizzaria
echo.

pause
