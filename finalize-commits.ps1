#!/usr/bin/env powershell

# Script para finalizar commits e sincronizar com repositório remoto

Write-Host "🔧 Finalizando commits e sincronização..." -ForegroundColor Green

# Ir para o diretório do projeto
Set-Location "C:\Users\pedro\Desktop\pizzaria-api"

# Verificar se há merge em andamento e abortar se necessário
if (Test-Path ".git\MERGE_HEAD") {
    Write-Host "⚠️ Merge em andamento detectado. Abortando..." -ForegroundColor Yellow
    git merge --abort
}

# Configurar editor Git para evitar problemas
git config --global core.editor "notepad"

# Verificar status
Write-Host "📋 Status do repositório:" -ForegroundColor Blue
git status

# Tentar push direto (nossos commits já estão feitos)
Write-Host "🚀 Fazendo push dos commits..." -ForegroundColor Blue
git push origin main --force-with-lease

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no push. Tentando sync..." -ForegroundColor Red
    
    # Se falhar, fazer fetch e rebase
    Write-Host "📥 Fazendo fetch..." -ForegroundColor Blue
    git fetch origin
    
    Write-Host "🔄 Fazendo rebase..." -ForegroundColor Blue
    git rebase origin/main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🚀 Fazendo push após rebase..." -ForegroundColor Blue
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Sincronização concluída com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "❌ Erro final no push" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Erro no rebase" -ForegroundColor Red
    }
}

Write-Host "📊 Log dos últimos commits:" -ForegroundColor Blue
git log --oneline -5

Write-Host "🏁 Script finalizado!" -ForegroundColor Green
