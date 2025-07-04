@echo off
title Finalizando Commits Git
echo 🔧 Finalizando commits e sincronização...

cd /d "C:\Users\pedro\Desktop\pizzaria-api"

echo ⚠️ Verificando merge em andamento...
if exist ".git\MERGE_HEAD" (
    echo Abortando merge...
    git merge --abort
)

echo 📋 Configurando editor...
git config --global core.editor "echo"

echo 📋 Status do repositório:
git status

echo 🚀 Fazendo push dos commits...
git push origin main --force-with-lease

if %errorlevel% equ 0 (
    echo ✅ Push realizado com sucesso!
) else (
    echo ❌ Erro no push. Tentando sync...
    
    echo 📥 Fazendo fetch...
    git fetch origin
    
    echo 🔄 Fazendo rebase...
    git rebase origin/main
    
    if %errorlevel% equ 0 (
        echo 🚀 Fazendo push após rebase...
        git push origin main
        
        if %errorlevel% equ 0 (
            echo ✅ Sincronização concluída com sucesso!
        ) else (
            echo ❌ Erro final no push
        )
    ) else (
        echo ❌ Erro no rebase
    )
)

echo 📊 Log dos últimos commits:
git log --oneline -5

echo 🏁 Script finalizado!
pause
