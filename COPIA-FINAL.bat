@echo off
title Copia Completa do Frontend da Pizzaria
color 0A

echo.
echo ============================================
echo   COPIANDO FRONTEND COMPLETO DA PIZZARIA
echo ============================================
echo.

REM Criar pasta de destino
echo [1/4] Criando pasta de destino...
mkdir "C:\Users\pedro\Desktop\pizzaria" 2>nul
echo ✓ Pasta criada/verificada

echo.
echo [2/4] Copiando arquivos HTML...
copy "c:\Users\pedro\Desktop\pizzaria-api\index.html" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
copy "c:\Users\pedro\Desktop\pizzaria-api\login.html" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
copy "c:\Users\pedro\Desktop\pizzaria-api\cadastro.html" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
copy "c:\Users\pedro\Desktop\pizzaria-api\menu.html" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
copy "c:\Users\pedro\Desktop\pizzaria-api\doces.html" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
copy "c:\Users\pedro\Desktop\pizzaria-api\bebidas.html" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
copy "c:\Users\pedro\Desktop\pizzaria-api\carrinho.html" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
copy "c:\Users\pedro\Desktop\pizzaria-api\pedidos.html" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
copy "c:\Users\pedro\Desktop\pizzaria-api\clientes.html" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
echo ✓ Arquivos HTML copiados

echo.
echo [3/4] Copiando arquivos de configuracao...
copy "c:\Users\pedro\Desktop\pizzaria-api\manifest.json" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
copy "c:\Users\pedro\Desktop\pizzaria-api\service-worker.js" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
copy "c:\Users\pedro\Desktop\pizzaria-api\auth.js" "C:\Users\pedro\Desktop\pizzaria\" /Y >nul
echo ✓ Arquivos de configuracao copiados

echo.
echo [4/4] Copiando pastas completas...
xcopy "c:\Users\pedro\Desktop\pizzaria-api\css" "C:\Users\pedro\Desktop\pizzaria\css\" /E /I /Y /Q >nul
echo ✓ Pasta CSS copiada
xcopy "c:\Users\pedro\Desktop\pizzaria-api\js" "C:\Users\pedro\Desktop\pizzaria\js\" /E /I /Y /Q >nul
echo ✓ Pasta JS copiada
xcopy "c:\Users\pedro\Desktop\pizzaria-api\img" "C:\Users\pedro\Desktop\pizzaria\img\" /E /I /Y /Q >nul
echo ✓ Pasta IMG copiada
xcopy "c:\Users\pedro\Desktop\pizzaria-api\config" "C:\Users\pedro\Desktop\pizzaria\config\" /E /I /Y /Q >nul
echo ✓ Pasta CONFIG copiada

echo.
echo ============================================
echo          VERIFICANDO RESULTADO
echo ============================================
echo.
echo Arquivos na pasta C:\Users\pedro\Desktop\pizzaria:
dir "C:\Users\pedro\Desktop\pizzaria" /B
echo.
echo Contagem total de arquivos:
dir "C:\Users\pedro\Desktop\pizzaria" /S /-C | find "File(s)"

echo.
echo ============================================
echo   ✅ COPIA COMPLETA FINALIZADA!
echo ============================================
echo.
echo O frontend da pizzaria foi copiado para:
echo C:\Users\pedro\Desktop\pizzaria
echo.
echo Para testar o frontend:
echo 1. Abra o terminal na pasta C:\Users\pedro\Desktop\pizzaria
echo 2. Execute: npm install
echo 3. Execute: npm start
echo 4. Acesse: http://localhost:3000
echo.
pause
