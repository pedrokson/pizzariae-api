# Script para limpar frontend da pasta pizzaria-api
# Mantendo apenas backend, banco e API
Write-Host "Limpando frontend da pasta pizzaria-api..." -ForegroundColor Green

$pastaBackend = "c:\Users\pedro\Desktop\pizzaria-api"

Write-Host "Removendo arquivos HTML do frontend..." -ForegroundColor Yellow

# Lista de arquivos HTML do frontend para remover
$arquivosHTML = @(
    "index.html",
    "login.html", 
    "cadastro.html",
    "menu.html",
    "carrinho.html",
    "pedidos.html",
    "bebidas.html",
    "doces.html",
    "clientes.html",
    "debug-cadastro.html",
    "debug-localStorage.html",
    "carrinho-debug.html",
    "teste-carrinho-simples.html",
    "teste-carrinho-final.html",
    "teste-carrinho.html",
    "teste-site.html"
)

foreach ($arquivo in $arquivosHTML) {
    $caminho = "$pastaBackend\$arquivo"
    if (Test-Path $caminho) {
        Remove-Item $caminho -Force
        Write-Host "   Removido: $arquivo" -ForegroundColor Red
    }
}

Write-Host "`nRemovendo arquivos PWA..." -ForegroundColor Yellow

# Arquivos PWA para remover
$arquivosPWA = @(
    "manifest.json",
    "service-worker.js"
)

foreach ($arquivo in $arquivosPWA) {
    $caminho = "$pastaBackend\$arquivo"
    if (Test-Path $caminho) {
        Remove-Item $caminho -Force
        Write-Host "   Removido: $arquivo" -ForegroundColor Red
    }
}

Write-Host "`nRemovendo pastas do frontend..." -ForegroundColor Yellow

# Pastas do frontend para remover
$pastasRemover = @(
    "css",
    "js",
    "img",
    "config",
    "frontend"
)

foreach ($pasta in $pastasRemover) {
    $caminho = "$pastaBackend\$pasta"
    if (Test-Path $caminho) {
        Remove-Item $caminho -Recurse -Force
        Write-Host "   Removida: $pasta\" -ForegroundColor Red
    }
}

Write-Host "`nRemovendo scripts de frontend..." -ForegroundColor Yellow

# Scripts relacionados ao frontend
$scriptsRemover = @(
    "copiar-frontend.ps1",
    "copiar-para-pizzaria.bat",
    "mover-frontend.ps1",
    "mover-frontend-simples.ps1",
    "separar-frontend.ps1",
    "remover-frontend.bat",
    "test-frontend.js"
)

foreach ($script in $scriptsRemover) {
    $caminho = "$pastaBackend\$script"
    if (Test-Path $caminho) {
        Remove-Item $caminho -Force
        Write-Host "   Removido: $script" -ForegroundColor Red
    }
}

Write-Host "`nRemovendo arquivos de teste desnecessarios..." -ForegroundColor Yellow

# Arquivos de teste para remover
$testesRemover = @(
    "test-api.js",
    "auth.js"
)

foreach ($teste in $testesRemover) {
    $caminho = "$pastaBackend\$teste"
    if (Test-Path $caminho) {
        Remove-Item $caminho -Force
        Write-Host "   Removido: $teste" -ForegroundColor Red
    }
}

Write-Host "`nAtualizando README.md..." -ForegroundColor Yellow

# Criar novo README focado no backend
$readmeBackend = @"
# 🍕 Pizzaria Jerônimu's - Backend API

API REST completa para sistema de pedidos da Pizzaria Jerônimu's.

## 🏗️ Arquitetura

- **Backend**: Node.js + Express.js
- **Banco de Dados**: MongoDB + Mongoose
- **Autenticação**: JWT (JSON Web Tokens)
- **CORS**: Configurado para frontend
- **Logs**: Sistema detalhado de logs

## 📋 Funcionalidades da API

- ✅ **Autenticação JWT**: Login seguro e gestão de tokens
- ✅ **CRUD Produtos**: Gerenciamento completo de pizzas, bebidas e doces
- ✅ **CRUD Clientes**: Cadastro e autenticação de usuários
- ✅ **CRUD Pedidos**: Sistema completo de pedidos
- ✅ **Validações**: Dados validados com Mongoose
- ✅ **Logs Detalhados**: Monitoramento de todas as operações
- ✅ **CORS**: Integração com frontend

## 🚀 Como executar o Backend

### Pré-requisitos
- Node.js 14+ instalado
- MongoDB instalado e rodando

### Instalação e execução

\`\`\`bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Iniciar MongoDB (se necessário)
.\instalar-mongodb.bat

# Executar servidor de desenvolvimento
npm run dev

# Ou executar servidor completo
npm start
\`\`\`

A API será executada em: **http://localhost:3001**

## 📁 Estrutura do Backend

\`\`\`
pizzaria-api/
├── backend/
│   ├── 📄 app.js              # Servidor principal
│   ├── 📄 app-teste.js        # Servidor de testes
│   ├── 📄 package.json        # Dependências
│   ├── 📄 seed.js             # Popular banco com dados
│   ├── 📁 config/
│   │   └── database.js        # Configuração MongoDB
│   ├── 📁 models/
│   │   ├── Usuario.js         # Model de usuários
│   │   ├── Produto.js         # Model de produtos
│   │   └── Pedido.js          # Model de pedidos
│   └── 📁 routes/
│       ├── produtos.js        # Rotas de produtos
│       ├── clientes.js        # Rotas de clientes
│       └── pedidos.js         # Rotas de pedidos
├── 📄 README.md               # Este arquivo
└── 📁 docs/                   # Documentação (se houver)
\`\`\`

## 🔗 Endpoints da API

### Autenticação
- \`POST /api/clientes/cadastro\` - Cadastrar usuário
- \`POST /api/clientes/login\` - Fazer login

### Produtos
- \`GET /api/produtos\` - Listar todos os produtos
- \`GET /api/produtos/:id\` - Buscar produto por ID
- \`POST /api/produtos\` - Criar novo produto (admin)
- \`PUT /api/produtos/:id\` - Atualizar produto (admin)
- \`DELETE /api/produtos/:id\` - Deletar produto (admin)

### Pedidos
- \`GET /api/pedidos\` - Listar pedidos do usuário
- \`POST /api/pedidos\` - Criar novo pedido
- \`GET /api/pedidos/:id\` - Buscar pedido por ID
- \`PUT /api/pedidos/:id\` - Atualizar pedido

## 🔒 Autenticação

A API utiliza JWT para autenticação:

\`\`\`javascript
// Headers necessários
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
\`\`\`

## 💾 Banco de Dados

### Collections MongoDB

1. **usuarios**
   - \_id, nome, email, senha, telefone, endereco
   - Senhas criptografadas com bcrypt

2. **produtos**
   - \_id, nome, categoria, preco, tamanho, disponivel, imagem

3. **pedidos**
   - \_id, cliente, itens, total, status, dataCreate, endereco

### Scripts Utilitários

- \`.\backend\iniciar-completo.bat\` - Inicia servidor completo
- \`.\backend\iniciar-teste.bat\` - Inicia servidor de teste  
- \`.\backend\instalar-mongodb.bat\` - Instala/configura MongoDB
- \`.\backend\reiniciar-servidor.bat\` - Reinicia servidor

## 🧪 Testes

\`\`\`bash
# Testar conexão com MongoDB
node backend/test-mongodb.js

# Popular banco com dados de teste
node backend/seed.js

# Executar testes do sistema
node backend/test-sistema.js
\`\`\`

## 🌍 Variáveis de Ambiente

Crie um arquivo \`.env\` na pasta \`backend/\`:

\`\`\`env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/pizzaria
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
CORS_ORIGIN=http://localhost:3000
\`\`\`

## 🚀 Deploy

### Preparação para Deploy
1. Configure variáveis de ambiente de produção
2. Configure MongoDB Atlas ou outro banco em nuvem
3. Deploy no Azure, Heroku, ou Vercel

### Azure App Service
\`\`\`bash
# Configurar no portal Azure
# - Runtime: Node.js 18
# - Startup command: node backend/app.js
\`\`\`

## 📊 Logs e Monitoramento

O sistema gera logs detalhados:
- Requisições HTTP
- Operações do banco
- Erros e warnings
- Autenticação e autorização

## 🔧 Desenvolvimento

### Adicionar nova funcionalidade
1. Criar model em \`backend/models/\`
2. Criar rotas em \`backend/routes/\`
3. Registrar rotas em \`backend/app.js\`
4. Testar endpoints

### Estrutura de Response
\`\`\`javascript
// Sucesso
{
  "success": true,
  "data": {...},
  "message": "Operação realizada com sucesso"
}

// Erro
{
  "success": false,
  "error": "Mensagem do erro",
  "code": "ERROR_CODE"
}
\`\`\`

---

**🔥 API 100% funcional e pronta para produção!**

*Backend desenvolvido para Pizzaria Jerônimu's*
"@

Set-Content -Path "$pastaBackend\README.md" -Value $readmeBackend -Encoding UTF8
Write-Host "   README.md atualizado para backend" -ForegroundColor Green

# Estatisticas finais
Write-Host "`nResumo da limpeza:" -ForegroundColor Cyan
$arquivosRestantes = (Get-ChildItem -Path $pastaBackend -Recurse -File).Count
Write-Host "   Pasta backend: $pastaBackend" -ForegroundColor White
Write-Host "   Arquivos restantes: $arquivosRestantes" -ForegroundColor White

Write-Host "`nArquivos mantidos (Backend):" -ForegroundColor Green
Get-ChildItem -Path $pastaBackend -File | ForEach-Object {
    Write-Host "   ✅ $($_.Name)" -ForegroundColor Green
}

Write-Host "`nPastas mantidas (Backend):" -ForegroundColor Green
Get-ChildItem -Path $pastaBackend -Directory | ForEach-Object {
    Write-Host "   ✅ $($_.Name)\" -ForegroundColor Green
}

Write-Host "`nLimpeza concluida! Pasta agora contem apenas:" -ForegroundColor Cyan
Write-Host "   🔧 Backend (Node.js + Express)" -ForegroundColor Yellow
Write-Host "   💾 Configuracoes do MongoDB" -ForegroundColor Yellow  
Write-Host "   🌐 API REST completa" -ForegroundColor Yellow
Write-Host "   📝 Scripts de deploy e teste" -ForegroundColor Yellow

Write-Host "`n🎯 Proximos passos:" -ForegroundColor Green
Write-Host "   1. cd backend && npm install" -ForegroundColor White
Write-Host "   2. Configurar .env com credenciais" -ForegroundColor White
Write-Host "   3. npm start para iniciar API" -ForegroundColor White
Write-Host "   4. Deploy backend separadamente" -ForegroundColor White
