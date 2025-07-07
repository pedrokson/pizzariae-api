# Deploy manual via PowerShell
Write-Host "Deploy Manual Pizzaria Backend" -ForegroundColor Green

# 1. Criar ZIP dos arquivos do backend
Write-Host "Criando arquivo ZIP..." -ForegroundColor Yellow
Compress-Archive -Path "backend\*" -DestinationPath "backend-deploy.zip" -Force

# 2. Fazer upload via Azure CLI (se instalado)
if (Get-Command az -ErrorAction SilentlyContinue) {
    Write-Host "Fazendo upload para Azure..." -ForegroundColor Yellow
    az webapp deployment source config-zip --resource-group "Pizzaria-Jeronimus_group" --name "pizzaria-backend" --src "backend-deploy.zip"
} else {
    Write-Host "Azure CLI nao encontrado. Upload manual necessario." -ForegroundColor Red
    Write-Host "Arquivo criado: backend-deploy.zip" -ForegroundColor Green
    Write-Host "Acesse: https://pizzaria-backend.scm.azurewebsites.net/ZipDeploy" -ForegroundColor Cyan
    Write-Host "Faca upload do arquivo backend-deploy.zip" -ForegroundColor Cyan
}

Write-Host "Deploy concluido!" -ForegroundColor Green
