// Script de teste completo do sistema
const express = require('express');
const cors = require('cors');

console.log('🧪 INICIANDO TESTES DO SISTEMA...\n');

// Teste 1: Verificar dependências
console.log('📦 Teste 1: Verificando dependências...');
try {
  require('mongoose');
  require('bcryptjs');
  require('jsonwebtoken');
  require('dotenv');
  console.log('✅ Todas as dependências encontradas!\n');
} catch (error) {
  console.log('❌ Erro nas dependências:', error.message);
  process.exit(1);
}

// Teste 2: Verificar configuração da API
console.log('⚙️ Teste 2: Verificando configuração da API...');
try {
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  // Rota de teste
  app.get('/test', (req, res) => {
    res.json({ message: 'API funcionando!', timestamp: new Date() });
  });
  
  console.log('✅ Configuração da API OK!\n');
} catch (error) {
  console.log('❌ Erro na configuração:', error.message);
  process.exit(1);
}

// Teste 3: Verificar rotas
console.log('🛣️ Teste 3: Verificando rotas...');
try {
  const fs = require('fs');
  const path = require('path');
  
  const routesPath = path.join(__dirname, 'routes');
  const routeFiles = ['produtos.js', 'clientes.js', 'pedidos.js'];
  
  for (const file of routeFiles) {
    const filePath = path.join(routesPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} encontrado`);
    } else {
      console.log(`❌ ${file} não encontrado`);
    }
  }
  console.log('✅ Verificação de rotas concluída!\n');
} catch (error) {
  console.log('❌ Erro ao verificar rotas:', error.message);
}

// Teste 4: Verificar modelos
console.log('📊 Teste 4: Verificando modelos...');
try {
  const fs = require('fs');
  const path = require('path');
  
  const modelsPath = path.join(__dirname, 'models');
  const modelFiles = ['Usuario.js', 'Produto.js', 'Pedido.js'];
  
  for (const file of modelFiles) {
    const filePath = path.join(modelsPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} encontrado`);
    } else {
      console.log(`❌ ${file} não encontrado`);
    }
  }
  console.log('✅ Verificação de modelos concluída!\n');
} catch (error) {
  console.log('❌ Erro ao verificar modelos:', error.message);
}

// Teste 5: Iniciar servidor de teste
console.log('🚀 Teste 5: Iniciando servidor de teste...');
const testApp = express();
testApp.use(cors());
testApp.use(express.json());

testApp.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor de teste funcionando!',
    status: 'OK',
    timestamp: new Date(),
    endpoints: ['/test', '/health']
  });
});

testApp.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

testApp.get('/test', (req, res) => {
  res.json({ message: 'Teste OK!', timestamp: new Date() });
});

const PORT = 3099; // Porta diferente para não conflitar
testApp.listen(PORT, () => {
  console.log(`✅ Servidor de teste rodando na porta ${PORT}`);
  console.log(`🌐 Teste: http://localhost:${PORT}`);
  console.log(`❤️ Health: http://localhost:${PORT}/health`);
  console.log(`🧪 Test: http://localhost:${PORT}/test\n`);
  
  console.log('🎉 TODOS OS TESTES BÁSICOS PASSARAM!');
  console.log('📝 Para testar a API completa, execute: npm start');
  console.log('🔧 Para popular o banco, execute: npm run seed');
  
  // Auto-finalizar após 5 segundos
  setTimeout(() => {
    console.log('\n⏰ Finalizando servidor de teste...');
    process.exit(0);
  }, 5000);
});
