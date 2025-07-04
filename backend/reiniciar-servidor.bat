@echo off
echo.
echo ========================================
echo  🛑 PARANDO SERVIDOR ANTERIOR...
echo ========================================
taskkill /f /im node.exe 2>nul

echo.
echo ========================================
echo  🚀 INICIANDO SERVIDOR CORRIGIDO...
echo ========================================

cd /d "C:\Users\pedro\Desktop\pizzaria-api\backend"
echo.
echo 🌐 Servidor vai servir frontend em: http://localhost:3001
echo 📄 Páginas disponíveis:
echo    • http://localhost:3001/cadastro.html
echo    • http://localhost:3001/login.html  
echo    • http://localhost:3001/menu.html
echo    • http://localhost:3001/carrinho.html
echo.
echo ⏹️ Para parar: Ctrl+C
echo.

node app-teste.js
