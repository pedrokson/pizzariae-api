# Script para limpar arquivos desnecessários e deixar apenas o backend

Write-Host "🧹 Limpando projeto para manter apenas o backend..." -ForegroundColor Yellow

# Ir para o diretório pai
cd ..

# Arquivos e pastas para manter
$manter = @(
    "backend",
    ".env",
    ".gitignore",
    ".git"
)

# Listar todos os itens no diretório
$todos = Get-ChildItem -Name

Write-Host "📁 Arquivos e pastas que serão MANTIDOS:" -ForegroundColor Green
foreach ($item in $manter) {
    if (Test-Path $item) {
        Write-Host "  ✅ $item" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🗑️ Arquivos e pastas que serão REMOVIDOS:" -ForegroundColor Red

# Remover itens que não estão na lista de manter
foreach ($item in $todos) {
    if ($item -notin $manter) {
        Write-Host "  ❌ $item" -ForegroundColor Red
    }
}

Write-Host ""
$resposta = Read-Host "Deseja continuar com a limpeza? (s/n)"

if ($resposta -eq "s" -or $resposta -eq "S") {
    Write-Host "🧹 Removendo arquivos..." -ForegroundColor Yellow
    
    foreach ($item in $todos) {
        if ($item -notin $manter) {
            try {
                if (Test-Path $item -PathType Container) {
                    Remove-Item $item -Recurse -Force
                    Write-Host "  🗑️ Pasta removida: $item" -ForegroundColor Red
                } else {
                    Remove-Item $item -Force
                    Write-Host "  🗑️ Arquivo removido: $item" -ForegroundColor Red
                }
            } catch {
                Write-Host "  ⚠️ Erro ao remover $item`: $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
    }
    
    Write-Host ""
    Write-Host "✅ Limpeza concluída! Projeto agora contém apenas o backend." -ForegroundColor Green
    Write-Host "📂 Estrutura final:" -ForegroundColor Cyan
    Get-ChildItem -Name | ForEach-Object { Write-Host "  📁 $_" -ForegroundColor Cyan }
    
} else {
    Write-Host "❌ Limpeza cancelada." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Para iniciar o backend:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  node app.js" -ForegroundColor White
