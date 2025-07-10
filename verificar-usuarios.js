const mongoose = require('mongoose');
require('dotenv').config();

async function verificarTiposUsuarios() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://pedrosutil2530sutil:pizzaria123@pizzaria-cluster.k8wkpvm.mongodb.net/pizzaria?retryWrites=true&w=majority';
    
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado ao MongoDB');
    
    const Usuario = require('./models/Usuario');
    
    // Buscar todos os usuários
    console.log('📋 TODOS OS USUÁRIOS:');
    const todosUsuarios = await Usuario.find().select('nome email telefone tipo');
    
    todosUsuarios.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nome} - ${user.email} - Tipo: ${user.tipo || 'INDEFINIDO'}`);
    });
    
    // Contar por tipo
    console.log('\n📊 CONTAGEM POR TIPO:');
    const totalUsuarios = await Usuario.countDocuments();
    const clientes = await Usuario.countDocuments({ tipo: 'cliente' });
    const admins = await Usuario.countDocuments({ tipo: 'admin' });
    const semTipo = await Usuario.countDocuments({ tipo: { $exists: false } });
    
    console.log(`Total: ${totalUsuarios}`);
    console.log(`Clientes: ${clientes}`);
    console.log(`Admins: ${admins}`);
    console.log(`Sem tipo definido: ${semTipo}`);
    
    if (semTipo > 0) {
      console.log('\n🔧 CORRIGINDO: Definindo tipo "cliente" para usuários sem tipo...');
      
      const resultado = await Usuario.updateMany(
        { tipo: { $exists: false } },
        { $set: { tipo: 'cliente' } }
      );
      
      console.log(`✅ ${resultado.modifiedCount} usuários atualizados!`);
      
      // Verificar novamente
      const clientesAgora = await Usuario.countDocuments({ tipo: 'cliente' });
      console.log(`🎯 Agora temos ${clientesAgora} clientes!`);
    }
    
    await mongoose.disconnect();
    console.log('🔌 Desconectado');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verificarTiposUsuarios();
