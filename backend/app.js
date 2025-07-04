const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const app = express();

// Configuração CORS para Azure
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'https://pizzaria-frontend.azurestaticapps.net', // Substitua pela URL real do seu frontend
    'https://*.azurestaticapps.net',
    'https://*.azurewebsites.net'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
  
app.use(express.json());

// Banco de dados
const dbPath = path.join(__dirname, 'database', 'pizzaria.db');
const schemaPath = path.join(__dirname, 'database', 'schema.sql');

// Cria o banco e as tabelas se não existirem
if (!fs.existsSync(dbPath)) {
  const dbInit = new sqlite3.Database(dbPath);
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  dbInit.exec(schema, (err) => {
    if (err) console.error('Erro ao criar o banco:', err);
    else console.log('Banco de dados criado!');
    dbInit.close();
  });
}

// Conexão para uso normal
const db = new sqlite3.Database(dbPath);

// Rotas
const produtosRouter = require('./routes/produtos')(db);
const clientesRouter = require('./routes/clientes')(db);
const pedidosRouter = require('./routes/pedidos')(db);

app.use('/api/produtos', produtosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/pedidos', pedidosRouter);

app.get('/', (req, res) => {
  res.send('API da Pizzaria funcionando!');
});

// Configuração da porta para Azure
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});