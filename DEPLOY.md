# 🚀 Guia de Deploy Separado - Frontend e Backend

Este guia explica como fazer deploy do frontend e backend de forma independente.

## 📁 Estrutura Atual

```
pizzaria-api/
├── backend/          # API Node.js + MongoDB
├── frontend/         # HTML + CSS + JS
├── package.json      # Scripts principais
└── README.md
```

## 🔧 Backend (API)

### Azure App Service

1. **Criar App Service**
   ```bash
   # Via Azure CLI
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name pizzaria-backend --runtime "NODE|18-lts"
   ```

2. **Configurar Variáveis de Ambiente**
   ```
   MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/pizzaria
   JWT_SECRET=seu_jwt_secret_super_seguro
   NODE_ENV=production
   PORT=80
   ```

3. **Deploy via Git**
   ```bash
   # Adicionar remote do Azure
   git remote add azure https://pizzaria-backend.scm.azurewebsites.net:443/pizzaria-backend.git
   
   # Push apenas da pasta backend
   git subtree push --prefix=backend azure main
   ```

4. **URL Final**: `https://pizzaria-backend.azurewebsites.net`

### Heroku (Alternativo)

1. **Criar App**
   ```bash
   heroku create pizzaria-backend
   ```

2. **Configurar Variáveis**
   ```bash
   heroku config:set MONGODB_URI=sua_uri
   heroku config:set JWT_SECRET=seu_secret
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git subtree push --prefix=backend heroku main
   ```

## 🌐 Frontend (Static)

### Azure Static Web Apps (Recomendado)

1. **Pelo Portal Azure**
   - Criar novo "Static Web App"
   - Conectar repositório GitHub
   - Build folder: `frontend`
   - Output folder: `frontend`

2. **GitHub Actions** (automático)
   ```yaml
   # .github/workflows/azure-static-web-apps.yml
   name: Azure Static Web Apps CI/CD
   on:
     push:
       branches: [ main ]
   jobs:
     build_and_deploy_job:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Build And Deploy
           uses: Azure/static-web-apps-deploy@v1
           with:
             app_location: "/frontend"
             output_location: "/"
   ```

3. **URL Final**: `https://nome-app.azurestaticapps.net`

### Netlify

1. **Via Interface Web**
   - Arrastar pasta `frontend` para netlify.com
   - Ou conectar repositório Git

2. **Via CLI**
   ```bash
   # Instalar Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   cd frontend
   netlify deploy
   netlify deploy --prod
   ```

3. **URL Final**: `https://nome-site.netlify.app`

### Vercel

1. **Via CLI**
   ```bash
   cd frontend
   npx vercel
   ```

2. **Via Git**
   - Conectar repositório em vercel.com
   - Root directory: `frontend`

## ⚙️ Configuração Cross-Origin

### 1. Atualizar Backend CORS

Já configurado em `backend/app.js`:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://seu-frontend.azurestaticapps.net',
    'https://seu-frontend.netlify.app',
    'https://seu-frontend.vercel.app'
  ]
};
```

### 2. Atualizar Frontend API Config

Já configurado em `frontend/config/api.js`:
```javascript
const API_BASE_URL = (() => {
  if (hostname.includes('azurestaticapps.net')) {
    return 'https://seu-backend.azurewebsites.net/api';
  }
  // ... outras configurações
})();
```

## 🧪 Teste da Separação

### 1. Testar Backend
```bash
cd backend
npm start
# Acesse: http://localhost:3001
# Teste API: http://localhost:3001/api/produtos
```

### 2. Testar Frontend
```bash
cd frontend
npm start
# Acesse: http://localhost:3000
```

### 3. Verificar Comunicação
1. Abrir frontend no navegador
2. Abrir DevTools > Network
3. Fazer login/cadastro
4. Verificar requisições para API

## 📝 Checklist de Deploy

### Backend
- [ ] Variáveis de ambiente configuradas
- [ ] MongoDB URI válida
- [ ] CORS permitindo frontend
- [ ] Porta configurada para cloud
- [ ] Logs de deploy sem erro

### Frontend
- [ ] Build sem erros
- [ ] URL da API atualizada
- [ ] HTTPS funcionando
- [ ] PWA instalável
- [ ] Responsivo em mobile

### Integração
- [ ] Login funcionando
- [ ] Cadastro funcionando
- [ ] Produtos carregando
- [ ] Carrinho funcionando
- [ ] Pedidos sendo criados
- [ ] WhatsApp funcionando

## 🔍 Debug

### Problemas Comuns

1. **CORS Error**
   - Verificar URL do frontend no backend
   - Verificar protocolo (http vs https)

2. **API 404**
   - Verificar URL da API no frontend
   - Verificar se backend está rodando

3. **Token Issues**
   - Limpar localStorage
   - Verificar JWT_SECRET

### Logs Úteis

```javascript
// No frontend (DevTools Console)
console.log('API URL:', API_BASE_URL);
console.log('Token:', localStorage.getItem('token'));

// No backend (Terminal)
console.log('CORS origins:', corsOptions.origin);
console.log('MongoDB:', process.env.MONGODB_URI ? 'Connected' : 'Missing');
```

## 🎯 URLs Finais de Exemplo

- **Backend**: https://pizzaria-backend.azurewebsites.net
- **Frontend**: https://pizzaria-frontend.azurestaticapps.net
- **API Health**: https://pizzaria-backend.azurewebsites.net/
- **API Docs**: https://pizzaria-backend.azurewebsites.net/api/

## 📞 Suporte

Em caso de problemas:
1. Verificar logs do Azure
2. Testar endpoints individualmente
3. Verificar configurações de rede
4. Consultar documentação do Azure/Netlify/Vercel

---

**Boa sorte com o deploy! 🚀**
