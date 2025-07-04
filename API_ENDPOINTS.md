# Configuração para Frontend

## URL da API no Azure
```
https://[SEU-BACKEND].azurewebsites.net/api
```

## Endpoints disponíveis:

### Produtos
- GET: https://[SEU-BACKEND].azurewebsites.net/api/produtos
- POST: https://[SEU-BACKEND].azurewebsites.net/api/produtos
- PUT: https://[SEU-BACKEND].azurewebsites.net/api/produtos/:id
- DELETE: https://[SEU-BACKEND].azurewebsites.net/api/produtos/:id

### Clientes
- GET: https://[SEU-BACKEND].azurewebsites.net/api/clientes
- POST: https://[SEU-BACKEND].azurewebsites.net/api/clientes
- PUT: https://[SEU-BACKEND].azurewebsites.net/api/clientes/:id
- DELETE: https://[SEU-BACKEND].azurewebsites.net/api/clientes/:id

### Pedidos
- GET: https://[SEU-BACKEND].azurewebsites.net/api/pedidos
- POST: https://[SEU-BACKEND].azurewebsites.net/api/pedidos
- PUT: https://[SEU-BACKEND].azurewebsites.net/api/pedidos/:id
- DELETE: https://[SEU-BACKEND].azurewebsites.net/api/pedidos/:id

## Para o Frontend:
Substitua todas as chamadas `localhost:3001` pela URL real do backend no Azure.

Exemplo:
```javascript
// ANTES (localhost)
const API_URL = 'http://localhost:3001/api';

// DEPOIS (Azure)
const API_URL = 'https://[SEU-BACKEND].azurewebsites.net/api';
```
