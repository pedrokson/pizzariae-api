const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const app = express();

// Conectar ao MongoDB
connectDB();

// Configuração CORS simplificada para desenvolvimento
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5500', 'file://'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
  
app.use(express.json());

// Rotas da API
const produtosRouter = require('./routes/produtos');
const clientesRouter = require('./routes/clientes');
const pedidosRouter = require('./routes/pedidos');

app.use('/api/produtos', produtosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/pedidos', pedidosRouter);

// Rota de health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'API da Pizzaria Jerônimu\'s funcionando!',
    version: '2.0.0',
    endpoints: {
      produtos: '/api/produtos',
      clientes: '/api/clientes', 
      pedidos: '/api/pedidos'
    }
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Configuração da porta para Azure
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend API rodando na porta ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});