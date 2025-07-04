@echo off
title Backend de Teste - Pizzaria Jeronimu's
color 0A

echo.
echo ========================================
echo   INICIANDO BACKEND DE TESTE
echo ========================================
echo.

cd /d "c:\Users\pedro\Desktop\pizzaria-api\backend"

echo Verificando dependencias...
call npm install

echo.
echo Iniciando servidor de teste...
echo.
echo O servidor sera iniciado em http://localhost:3001
echo.
echo Para testar o frontend:
echo 1. Mantenha este terminal aberto
echo 2. Abra o navegador em: file:///c:/Users/pedro/Desktop/pizzaria-api/cadastro.html
echo 3. Teste o cadastro
echo.

node app-teste.js

pause
