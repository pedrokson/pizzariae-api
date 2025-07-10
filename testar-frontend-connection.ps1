# TESTE DIRETO VIA POWERSHELL - Simulando Frontend

Write-Host "🔍 TESTANDO API COMO SE FOSSE O FRONTEND..." -ForegroundColor Cyan

$baseURL = "https://pizzaria-backend-eueqgmb0fyb5cdbj.brazilsouth-01.azurewebsites.net"

Write-Host "`n1️⃣ Testando GET /api/produtos..." -ForegroundColor Yellow
try {
    $produtos = Invoke-RestMethod -Uri "$baseURL/api/produtos" -Method GET
    Write-Host "✅ Produtos:" $produtos.Count "encontrados" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro:" $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n2️⃣ Testando GET /api/clientes..." -ForegroundColor Yellow
try {
    $clientes = Invoke-RestMethod -Uri "$baseURL/api/clientes" -Method GET
    Write-Host "✅ Clientes:" $clientes.Count "encontrados" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro:" $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n3️⃣ Testando POST /api/clientes/cadastro..." -ForegroundColor Yellow
try {
    $body = @{
        nome = "Frontend Test"
        email = "frontend@test.com"
        senha = "123456"
        telefone = "11999999999"
    } | ConvertTo-Json

    $cadastro = Invoke-RestMethod -Uri "$baseURL/api/clientes/cadastro" -Method POST -Body $body -ContentType "application/json"
    
    if ($cadastro.sucesso) {
        Write-Host "✅ Cadastro bem-sucedido! ID:" $cadastro._id -ForegroundColor Green
    } else {
        Write-Host "⚠️ Cadastro falhou:" $cadastro.erro -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erro:" $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n4️⃣ Testando POST /api/clientes/login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "frontend@test.com"
        senha = "123456"
    } | ConvertTo-Json

    $login = Invoke-RestMethod -Uri "$baseURL/api/clientes/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    if ($login.sucesso) {
        Write-Host "✅ Login bem-sucedido! Token:" $login.token.Substring(0,20) "..." -ForegroundColor Green
    } else {
        Write-Host "⚠️ Login falhou:" $login.erro -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erro:" $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n🎯 CONCLUSÃO:" -ForegroundColor Cyan
Write-Host "Se todos os testes passaram, o backend está 100% funcional!" -ForegroundColor Green
Write-Host "Agora basta atualizar a URL no frontend para:" -ForegroundColor White
Write-Host $baseURL -ForegroundColor Yellow
