const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
  
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});