# 🚀 DEPLOY DO BACKEND - PIZZARIA API

## Azure App Service - Deploy Guide

### 📦 ARQUIVOS DE DEPLOY CRIADOS:
- `package-deploy.json` - Package.json otimizado para produção
- `web.config` - Configuração IIS para Azure
- `.deployment` - Configurações de build

### 🔧 CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE NO AZURE:

No Azure Portal, configure estas variáveis de ambiente:

```bash
MONGODB_URI=mongodb+srv://pedrosutil2530sutil:pizzaria123@pizzaria-cluster.k8wkpvm.mongodb.net/pizzaria?retryWrites=true&w=majority
JWT_SECRET=pizzaria_jwt_secret_super_seguro_2024_#$%&
NODE_ENV=production
PORT=80
```

### 🚀 COMANDOS PARA DEPLOY:

#### Opção 1: Deploy via Git (Recomendado)
```bash
# 1. Inicializar repositório Git (se não tiver)
git init

# 2. Adicionar arquivos
git add .

# 3. Commit
git commit -m "Deploy inicial do backend da pizzaria"

# 4. Adicionar remote do Azure (você vai pegar essa URL no Azure Portal)
git remote add azure <URL_DO_GIT_AZURE>

# 5. Push para deploy
git push azure main
```

#### Opção 2: Deploy via ZIP
1. Compactar toda a pasta `backend` em um ZIP
2. Upload via Azure Portal > App Service > Deployment Center

### 🌐 ENDPOINTS APÓS DEPLOY:

Após o deploy, sua API estará disponível em:
```
https://[SEU-APP-NAME].azurewebsites.net/

Endpoints principais:
- GET  https://[SEU-APP-NAME].azurewebsites.net/
- GET  https://[SEU-APP-NAME].azurewebsites.net/api/produtos
- GET  https://[SEU-APP-NAME].azurewebsites.net/api/pedidos
- POST https://[SEU-APP-NAME].azurewebsites.net/api/clientes/cadastro
- POST https://[SEU-APP-NAME].azurewebsites.net/api/clientes/login
- POST https://[SEU-APP-NAME].azurewebsites.net/api/pedidos
```

### ⚙️ CONFIGURAÇÃO NO AZURE PORTAL:

1. **Criar App Service:**
   - Runtime: Node.js 18+ LTS
   - Sistema Operacional: Linux (recomendado)
   - Plano: Free F1 (para testes)

2. **Configurar Deployment:**
   - Deployment Center > Local Git ou GitHub
   - Configure as variáveis de ambiente

3. **Testar Deployment:**
   - Acesse a URL principal
   - Teste os endpoints da API

### 🔗 INTEGRAÇÃO COM FRONTEND:

Após o deploy, atualize seu frontend para usar:
```javascript
const API_BASE_URL = 'https://[SEU-BACKEND-NAME].azurewebsites.net';
```

### 📋 CHECKLIST PÓS-DEPLOY:

- [ ] Backend respondendo na URL do Azure
- [ ] MongoDB Atlas conectado
- [ ] Endpoints da API funcionando
- [ ] CORS configurado para o frontend
- [ ] Frontend integrado com backend na nuvem
- [ ] Testes de cadastro, login e pedidos funcionando

### 🆘 TROUBLESHOOTING:

- **500 Error:** Verificar variáveis de ambiente
- **MongoDB não conecta:** Verificar MONGODB_URI
- **CORS Error:** Verificar configuração de CORS no app.js
- **App não inicia:** Verificar package.json e scripts

---
**✅ BACKEND PRONTO PARA DEPLOY!**
