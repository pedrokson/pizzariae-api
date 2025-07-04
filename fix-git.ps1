# Script PowerShell para resolver problema Git
Set-Location "C:\Users\pedro\Desktop\pizzaria-api"

# Forçar saída de qualquer editor
taskkill /f /im vim.exe 2>$null
taskkill /f /im notepad.exe 2>$null

# Configurar editor simples
git config --global core.editor "echo 'Auto-merge commit'"

# Limpar estado de merge
if (Test-Path ".git\MERGE_HEAD") {
    Remove-Item ".git\MERGE_HEAD" -Force
}
if (Test-Path ".git\MERGE_MSG") {
    Remove-Item ".git\MERGE_MSG" -Force
}

# Status
git status

# Push forçado
Write-Host "Fazendo push dos commits..."
git push origin main --force

Write-Host "Commits enviados com sucesso!"
git log --oneline -5
