# Pizzaria API

Uma API REST para gerenciamento de pizzaria desenvolvida em Node.js com Express e SQLite.

## 🚀 Funcionalidades

- **Gestão de Clientes**: CRUD completo para clientes
- **Gestão de Produtos**: Cadastro e gerenciamento de produtos/pizzas
- **Gestão de Pedidos**: Sistema de pedidos completo
- **Banco de Dados**: SQLite para persistência de dados

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **SQLite3**: Banco de dados
- **CORS**: Middleware para Cross-Origin Resource Sharing

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pizzaria-api.git
cd pizzaria-api
```

2. Navegue para o diretório backend:
```bash
cd backend
```

3. Instale as dependências:
```bash
npm install
```

4. Execute a aplicação:
```bash
npm start
```

A API estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
backend/
├── app.js              # Arquivo principal da aplicação
├── package.json        # Dependências e scripts
├── database/
│   ├── pizzaria.db     # Banco de dados SQLite
│   └── schema.sql      # Schema do banco de dados
└── routes/
    ├── clientes.js     # Rotas para clientes
    ├── pedidos.js      # Rotas para pedidos
    └── produtos.js     # Rotas para produtos
```

## 🔗 Endpoints da API

### Clientes
- `GET /clientes` - Lista todos os clientes
- `POST /clientes` - Cria um novo cliente
- `GET /clientes/:id` - Busca cliente por ID
- `PUT /clientes/:id` - Atualiza cliente
- `DELETE /clientes/:id` - Remove cliente

### Produtos
- `GET /produtos` - Lista todos os produtos
- `POST /produtos` - Cria um novo produto
- `GET /produtos/:id` - Busca produto por ID
- `PUT /produtos/:id` - Atualiza produto
- `DELETE /produtos/:id` - Remove produto

### Pedidos
- `GET /pedidos` - Lista todos os pedidos
- `POST /pedidos` - Cria um novo pedido
- `GET /pedidos/:id` - Busca pedido por ID
- `PUT /pedidos/:id` - Atualiza pedido
- `DELETE /pedidos/:id` - Remove pedido

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Desenvolvido por [Seu Nome]
