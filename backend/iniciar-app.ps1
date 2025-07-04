Write-Host "🚀 Iniciando servidor app.js..." -ForegroundColor Green

# Navegar para o diretório correto
Set-Location "c:\Users\pedro\Desktop\pizzaria-api\backend"

# Parar qualquer processo node em execução
Write-Host "🔫 Parando processos Node.js..." -ForegroundColor Yellow
taskkill /f /im node.exe 2>$null

# Aguardar um pouco
Start-Sleep -Seconds 2

# Iniciar o servidor em background
Write-Host "🎯 Iniciando app.js..." -ForegroundColor Cyan
$job = Start-Job -ScriptBlock {
    Set-Location "c:\Users\pedro\Desktop\pizzaria-api\backend"
    node app.js
}

# Aguardar alguns segundos para o servidor iniciar
Write-Host "⏳ Aguardando servidor iniciar..." -ForegroundColor Blue
Start-Sleep -Seconds 5

# Testar se o servidor está respondendo
Write-Host "🧪 Testando servidor..." -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ SERVIDOR FUNCIONANDO!" -ForegroundColor Green
    Write-Host "📡 Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "📝 Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ SERVIDOR NÃO ESTÁ RESPONDENDO" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar processos node
Write-Host "`n🔍 Processos Node.js em execução:" -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Format-Table ProcessName,Id,StartTime

# Verificar porta 3001
Write-Host "🔍 Porta 3001:" -ForegroundColor Yellow
netstat -ano | findstr ":3001"

Write-Host "`n✅ Teste concluído!" -ForegroundColor Green
Write-Host "💡 Para parar o servidor, execute: taskkill /f /im node.exe" -ForegroundColor Cyan
