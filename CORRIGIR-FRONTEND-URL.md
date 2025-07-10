// INSTRUÇÕES PARA CORRIGIR O FRONTEND

## 🎯 PROBLEMA: Frontend tentando conectar em localhost

## 🔧 SOLUÇÃO: Atualizar URL da API no frontend

### 📁 Na pasta pizzaria-frontend, procure por arquivos que contenham:

```javascript
// URLs que DEVEM SER ALTERADAS:
'http://localhost:3001'
'http://localhost:3000' 
'localhost:3001'
'localhost:3000'

// SUBSTITUIR POR:
'https://pizzaria-backend-eueqgmb0fyb5cdbj.brazilsouth-01.azurewebsites.net'
```

### � ROTAS CORRETAS DA API:

```javascript
// URLs CORRETAS para usar no frontend:
const baseURL = 'https://pizzaria-backend-eueqgmb0fyb5cdbj.brazilsouth-01.azurewebsites.net';

// ROTAS DISPONÍVEIS:
`${baseURL}/api/clientes/cadastro` (POST) - Cadastro de cliente
`${baseURL}/api/clientes/login` (POST) - Login de cliente  
`${baseURL}/api/clientes` (GET) - Listar clientes
`${baseURL}/api/produtos` (GET) - Listar produtos
`${baseURL}/` (GET) - Status da API
```

### �📋 ARQUIVOS COMUNS QUE PRECISAM SER ALTERADOS:

1. **config/api.js** ou **config.js**
2. **js/auth.js**
3. **js/api.js**
4. **cadastro.html** (JavaScript inline)
5. **login.html** (JavaScript inline)
6. **menu.html** (JavaScript inline)

### 🔍 EXEMPLO DE COMO DEVE FICAR:

```javascript
// ANTES (ERRADO):
const baseURL = 'http://localhost:3001/api';

// DEPOIS (CORRETO):
const baseURL = 'https://pizzaria-backend-eueqgmb0fyb5cdbj.brazilsouth-01.azurewebsites.net/api';
```

### 📝 COMANDO RÁPIDO PARA ENCONTRAR:

Execute na pasta pizzaria-frontend:
```bash
grep -r "localhost" . --include="*.html" --include="*.js"
```

### 🧪 TESTE APÓS CORREÇÃO:

1. Salve os arquivos corrigidos
2. Recarregue a página (F5)
3. Teste o cadastro novamente
4. Deve funcionar sem erro de servidor!
