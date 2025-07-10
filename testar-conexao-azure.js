const mongoose = require('mongoose');
require('dotenv').config();

async function testarConexaoAzure() {
  try {
    console.log('🔍 TESTANDO CONEXÃO DO AZURE COM MONGODB...\n');
    
    // Verificar variáveis de ambiente
    console.log('🔧 VARIÁVEIS DE AMBIENTE:');
    console.log('NODE_ENV:', process.env.NODE_ENV || 'não definido');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'definido' : 'NÃO DEFINIDO');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'definido' : 'NÃO DEFINIDO');
    
    // Testar conexão
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://pedrosutil2530sutil:pizzaria123@pizzaria-cluster.k8wkpvm.mongodb.net/pizzaria?retryWrites=true&w=majority';
    
    console.log('\n📡 TENTANDO CONECTAR...');
    console.log('URI:', mongoURI.replace(/\/\/.*:.*@/, '//***:***@'));
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ CONEXÃO MONGODB FUNCIONANDO!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Estado:', mongoose.connection.readyState);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ ERRO DE CONEXÃO:', error.message);
    console.error('Tipo:', error.name);
    if (error.reason) {
      console.error('Razão:', error.reason);
    }
  }
}

testarConexaoAzure();
