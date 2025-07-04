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

## � Como executar o Backend

### Pré-requisitos
- Node.js 14+ instalado
- MongoDB instalado e rodando

### Instalação e execução

```bash
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
```

A API será executada em: **http://localhost:3001**

## 📁 Estrutura do Backend

```
pizzaria-api/
├── backend/
│   ├── 📄 app.js              # Servidor principal
│   ├── 📄 app-teste.js        # Servidor de testes
│   ├── 📄 package.json        # Dependências
│   ├── 📄 seed.js             # Popular banco com dados
│   ├── 📁 config/
│   │   └── database.js        # Configuração MongoDB
│   ├── models/             # Models Mongoose
│   │   ├── Usuario.js
│   │   ├── Produto.js
│   │   └── Pedido.js
│   ├── routes/             # Rotas da API
│   │   ├── clientes.js
│   │   ├── produtos.js
│   │   └── pedidos.js
│   ├── seed.js             # Popular banco com dados
│   ├── package.json
│   └── .env               # Variáveis de ambiente
├── config/                 # Configuração frontend
│   └── api.js             # Config API e funções auth
├── js/                    # Scripts do frontend
│   ├── auth.js
│   ├── produtos.js
│   ├── carrinho.js
│   └── pedidos.js
├── css/
│   └── styles.css
├── img/                   # Imagens dos produtos
├── *.html                 # Páginas do frontend
└── package.json          # Scripts principais
```

## ⚙️ Configuração e Instalação

### 1. Clonando o Repositório
```bash
git clone <url-do-repositorio>
cd pizzaria-api
```

### 2. Configurando o Backend
```bash
# Navegar para a pasta backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações do MongoDB
```

### 3. Configuração do MongoDB
1. Criar conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Criar um cluster
3. Criar usuário e senha
4. Obter string de conexão
5. Adicionar no arquivo `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/pizzaria?retryWrites=true&w=majority
JWT_SECRET=seu_jwt_secret_super_seguro
NODE_ENV=development
PORT=3001
```

### 4. Populando o Banco de Dados
```bash
# Dentro da pasta backend
npm run seed
```

### 5. Executando o Sistema
```bash
# Na raiz do projeto
npm start

# Ou diretamente no backend
cd backend
npm start
```

O sistema estará disponível em: `http://localhost:3001`

## 🔧 Scripts Disponíveis

### Raiz do Projeto
- `npm start` - Inicia o backend (que serve frontend e API)
- `npm run dev` - Modo desenvolvimento com nodemon
- `npm run seed` - Popula banco com dados de teste

### Backend
- `npm start` - Inicia servidor
- `npm run dev` - Modo desenvolvimento
- `npm run seed` - Executa script seed

## 📱 Funcionalidades do Sistema

### Para Clientes
1. **Cadastro e Login**
   - Criação de conta com dados pessoais
   - Autenticação segura com JWT
   - Armazenamento de endereço

2. **Navegação do Cardápio**
   - Pizzas salgadas, doces e bebidas
   - Visualização de preços e descrições
   - Diferentes tamanhos de pizza

3. **Carrinho de Compras**
   - Adicionar/remover itens
   - Ajustar quantidades
   - Observações personalizadas

4. **Sistema de Pedidos**
   - Finalização via API (MongoDB)
   - Envio opcional pelo WhatsApp
   - Acompanhamento de status

5. **Avaliações**
   - Avaliar pedidos entregues
   - Sistema de notas (1-5 estrelas)
   - Comentários opcionais

### Para Administradores (via API)
- CRUD completo de produtos
- Gerenciamento de pedidos
- Atualização de status
- Visualização de avaliações

## 🌐 API Endpoints

### Autenticação
- `POST /api/clientes/cadastro` - Cadastrar usuário
- `POST /api/clientes/login` - Login

### Produtos
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/:id` - Buscar produto
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

### Pedidos
- `GET /api/pedidos` - Listar pedidos
- `GET /api/pedidos/:id` - Buscar pedido
- `POST /api/pedidos` - Criar pedido
- `PUT /api/pedidos/:id/status` - Atualizar status
- `POST /api/pedidos/:id/avaliacao` - Avaliar pedido

## 🚀 Deploy

### Backend (Azure App Service)
1. Criar App Service no Azure
2. Configurar variáveis de ambiente
3. Deploy via Git ou GitHub Actions

### Frontend
O frontend é servido automaticamente pelo backend, não necessita deploy separado.

### Variáveis de Ambiente no Azure
```
MONGODB_URI=<sua-string-mongodb>
JWT_SECRET=<seu-jwt-secret>
NODE_ENV=production
PORT=80
```

## 🔒 Segurança

- Autenticação JWT
- Hash de senhas com bcryptjs
- Validação de dados com Mongoose
- CORS configurado
- Sanitização de inputs

## 🎨 Interface

- Design responsivo
- Cores temáticas (verde, branco, vermelho da Itália)
- Navegação intuitiva
- Feedback visual para ações
- Loading states e tratamento de erros

## 📞 Contato

**Pizzaria Jerônimu's**
- Telefone/WhatsApp: (43) 99904-7461
- Endereço: Avenida Pedro Ferreira da Costa, 706 - Centro
- Horário: Quarta a Domingo, 19h às 23h

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para a Pizzaria Jerônimu's** 🍕