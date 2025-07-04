const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const app = express();

// Conectar ao MongoDB
connectDB();

// Configuração CORS para Azure
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'https://mango-meadow-07492b31e.1.azurestaticapps.net', // URL do seu frontend no Azure
    'https://*.azurestaticapps.net',
    'https://*.azurewebsites.net'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
  
app.use(express.json());

// Rotas
const produtosRouter = require('./routes/produtos');
const clientesRouter = require('./routes/clientes');
const pedidosRouter = require('./routes/pedidos');

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