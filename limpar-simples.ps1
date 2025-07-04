# Script simples para limpar frontend
Write-Host "Limpando arquivos do frontend..." -ForegroundColor Green

$pasta = "c:\Users\pedro\Desktop\pizzaria-api"

# Remover arquivos HTML
$htmlFiles = @(
    "index.html", "login.html", "cadastro.html", "menu.html", "carrinho.html",
    "pedidos.html", "bebidas.html", "doces.html", "clientes.html",
    "debug-cadastro.html", "debug-localStorage.html", "carrinho-debug.html",
    "teste-carrinho-simples.html", "teste-carrinho-final.html", "teste-carrinho.html",
    "teste-site.html"
)

foreach ($file in $htmlFiles) {
    $path = "$pasta\$file"
    if (Test-Path $path) {
        Remove-Item $path -Force
        Write-Host "Removido: $file" -ForegroundColor Red
    }
}

# Remover arquivos PWA
Remove-Item "$pasta\manifest.json" -Force -ErrorAction SilentlyContinue
Remove-Item "$pasta\service-worker.js" -Force -ErrorAction SilentlyContinue
Remove-Item "$pasta\auth.js" -Force -ErrorAction SilentlyContinue
Remove-Item "$pasta\test-api.js" -Force -ErrorAction SilentlyContinue
Remove-Item "$pasta\test-frontend.js" -Force -ErrorAction SilentlyContinue

# Remover pastas
Remove-Item "$pasta\css" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$pasta\js" -Recurse -Force -ErrorAction SilentlyContinue  
Remove-Item "$pasta\img" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$pasta\config" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$pasta\frontend" -Recurse -Force -ErrorAction SilentlyContinue

# Remover scripts
$scripts = @(
    "copiar-frontend.ps1", "mover-frontend.ps1", "mover-frontend-simples.ps1",
    "separar-frontend.ps1", "copiar-para-pizzaria.bat", "remover-frontend.bat"
)

foreach ($script in $scripts) {
    Remove-Item "$pasta\$script" -Force -ErrorAction SilentlyContinue
}

Write-Host "`nLimpeza concluida!" -ForegroundColor Green
Write-Host "Pasta agora contem apenas backend e API" -ForegroundColor Yellow

# Listar arquivos restantes
Write-Host "`nArquivos mantidos:" -ForegroundColor Cyan
Get-ChildItem -Path $pasta -File | ForEach-Object {
    Write-Host "  $($_.Name)" -ForegroundColor Green
}

Write-Host "`nPastas mantidas:" -ForegroundColor Cyan
Get-ChildItem -Path $pasta -Directory | ForEach-Object {
    Write-Host "  $($_.Name)\" -ForegroundColor Green
}
