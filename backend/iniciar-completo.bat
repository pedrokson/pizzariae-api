@echo off
title Pizzaria API - Backend Completo com MongoDB
color 0A

echo.
echo ============================================
echo   INICIANDO BACKEND COM MONGODB
echo ============================================
echo.

cd /d "c:\Users\pedro\Desktop\pizzaria-api\backend"

echo [1/4] Instalando dependencias...
call npm install

echo.
echo [2/4] Testando conexao com MongoDB Atlas...
node test-mongodb.js

echo.
echo [3/4] Populando banco de dados (se necessario)...
node seed.js

echo.
echo [4/4] Iniciando servidor principal...
echo.
echo O servidor sera iniciado em http://localhost:3001
echo.
echo Para testar:
echo - API Status: http://localhost:3001
echo - Produtos: http://localhost:3001/api/produtos
echo - Frontend: file:///c:/Users/pedro/Desktop/pizzaria-api/cadastro.html
echo.

node app.js

pause
