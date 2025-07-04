// Teste de conexão com MongoDB Atlas
require('dotenv').config();
const mongoose = require('mongoose');

async function testarConexao() {
  try {
    console.log('🔄 Tentando conectar ao MongoDB Atlas...');
    console.log('📍 URL:', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'));
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB Atlas conectado com sucesso!');
    console.log('📊 Banco:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Testar operação básica
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Collections encontradas:', collections.map(c => c.name));
    
    console.log('\n🎉 Banco de dados funcionando perfeitamente!');
    
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔑 PROBLEMA DE AUTENTICAÇÃO:');
      console.log('- Verifique usuário e senha no MongoDB Atlas');
      console.log('- Acesse: https://cloud.mongodb.com');
      console.log('- Database Access > Users');
    }
    
    if (error.message.includes('network')) {
      console.log('\n🌐 PROBLEMA DE REDE:');
      console.log('- Verifique sua conexão com internet');
      console.log('- IP pode estar bloqueado no MongoDB Atlas');
      console.log('- Network Access > IP Access List');
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testarConexao();
