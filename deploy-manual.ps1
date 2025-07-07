# 🚀 Deploy Manual para Azure App Service

# 1. Criar arquivo ZIP com apenas o necessário
Write-Host "📦 Criando pacote de deployment..."

# Criar pasta temporária
$tempDir = "deploy-temp"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir

# Copiar arquivos necessários
Copy-Item "package.json" "$tempDir/"
Copy-Item ".deployment" "$tempDir/"
Copy-Item "deploy.cmd" "$tempDir/"
Copy-Item "backend" "$tempDir/backend" -Recurse

# Criar ZIP
$zipPath = "pizzaria-backend-deploy.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath }
Compress-Archive -Path "$tempDir/*" -DestinationPath $zipPath

Write-Host "✅ Pacote criado: $zipPath"

# Limpar pasta temporária
Remove-Item $tempDir -Recurse -Force

Write-Host ""
Write-Host "🚀 PRÓXIMOS PASSOS:"
Write-Host "1. Acesse o portal Azure"
Write-Host "2. Vá para App Service → Advanced Tools → Go"
Write-Host "3. Clique em 'Tools' → 'ZIP Push Deploy'"
Write-Host "4. Arraste o arquivo $zipPath para a área de upload"
Write-Host "5. Aguarde o deployment terminar"
Write-Host ""
Write-Host "🌐 URL da API: https://pizzaria-backend-euegqmb0fyb5cdbj.brazilsouth-01.azurewebsites.net"
