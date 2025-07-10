# INSTRUÇÕES PARA CONFIGURAR VARIÁVEIS DE AMBIENTE NO AZURE APP SERVICE

## 🔧 CONFIGURAÇÕES NECESSÁRIAS NO AZURE:

### 1. Acesse o Azure Portal:
https://portal.azure.com

### 2. Navegue para seu App Service:
Nome: pizzariae-backend
OU: pizzaria-backend-eueqgmb0fyb5cdbj

### 3. Vá em "Configuration" (Configuração):
App Service → Configuration → Application settings

### 4. Adicione as seguintes variáveis:

**MONGODB_URI**
Valor: mongodb+srv://pedrosutil2530sutil:pizzaria123@pizzaria-cluster.k8wkpvm.mongodb.net/pizzaria?retryWrites=true&w=majority

**JWT_SECRET**
Valor: pizzaria_secret_key_2024

**NODE_ENV**
Valor: production

**PORT**
Valor: 8080

### 5. Clique em "Save" (Salvar)

### 6. Reinicie o App Service:
Overview → Restart

## 🎯 RESULTADO ESPERADO:
Depois disso, a API deve conseguir conectar ao MongoDB e os cadastros serão persistidos!

## 🧪 TESTE:
Acesse: https://pizzaria-backend-eueqgmb0fyb5cdbj.brazilsouth-01.azurewebsites.net/
Deve mostrar: "mongodb":"Conectado" ao invés de "Usando memória como fallback"

## 🔗 URL CORRETA DA API:
https://pizzaria-backend-eueqgmb0fyb5cdbj.brazilsouth-01.azurewebsites.net

**Esta é a URL que deve ser usada no frontend!**
