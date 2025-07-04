# Script completo para garantir que todos os arquivos sejam copiados

$origem = "c:\Users\pedro\Desktop\pizzaria-api"
$destino = "C:\Users\pedro\Desktop\pizzaria"

Write-Host "=== COPIANDO FRONTEND COMPLETO ===" -ForegroundColor Green

# Garantir que a pasta de destino existe
New-Item -ItemType Directory -Path $destino -Force | Out-Null

# Lista de todos os arquivos HTML que precisam ser copiados
$arquivosHTML = @(
    "index.html",
    "login.html", 
    "cadastro.html",
    "menu.html",
    "doces.html",
    "bebidas.html",
    "carrinho.html",
    "pedidos.html",
    "clientes.html"
)

# Copiar cada arquivo HTML individualmente
foreach ($arquivo in $arquivosHTML) {
    $origemArquivo = Join-Path $origem $arquivo
    $destinoArquivo = Join-Path $destino $arquivo
    
    if (Test-Path $origemArquivo) {
        Copy-Item $origemArquivo $destinoArquivo -Force
        Write-Host "✓ Copiado: $arquivo" -ForegroundColor Green
    } else {
        Write-Host "✗ Não encontrado: $arquivo" -ForegroundColor Red
    }
}

# Copiar arquivos essenciais
$arquivosEssenciais = @("manifest.json", "service-worker.js", "auth.js")
foreach ($arquivo in $arquivosEssenciais) {
    $origemArquivo = Join-Path $origem $arquivo
    $destinoArquivo = Join-Path $destino $arquivo
    
    if (Test-Path $origemArquivo) {
        Copy-Item $origemArquivo $destinoArquivo -Force
        Write-Host "✓ Copiado: $arquivo" -ForegroundColor Green
    } else {
        Write-Host "✗ Não encontrado: $arquivo" -ForegroundColor Red
    }
}

# Copiar pastas completas (sobrescrever se existir)
$pastas = @("css", "js", "img", "config")
foreach ($pasta in $pastas) {
    $origemPasta = Join-Path $origem $pasta
    $destinoPasta = Join-Path $destino $pasta
    
    if (Test-Path $origemPasta) {
        # Remover pasta de destino se existir
        if (Test-Path $destinoPasta) {
            Remove-Item $destinoPasta -Recurse -Force
        }
        # Copiar pasta completa
        Copy-Item $origemPasta $destinoPasta -Recurse -Force
        Write-Host "✓ Copiada pasta: $pasta" -ForegroundColor Green
    } else {
        Write-Host "✗ Pasta não encontrada: $pasta" -ForegroundColor Red
    }
}

Write-Host "`n=== VERIFICANDO RESULTADO ===" -ForegroundColor Yellow
Get-ChildItem $destino | Format-Table Name, Length, LastWriteTime -AutoSize

Write-Host "`n=== CONTAGEM DE ARQUIVOS ===" -ForegroundColor Yellow
$totalArquivos = (Get-ChildItem $destino -Recurse -File | Measure-Object).Count
Write-Host "Total de arquivos copiados: $totalArquivos" -ForegroundColor Cyan

Write-Host "`n✅ CÓPIA COMPLETA FINALIZADA!" -ForegroundColor Green
