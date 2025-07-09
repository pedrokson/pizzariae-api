const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔌 Verificando pedidos no MongoDB Atlas...');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Conectado ao MongoDB Atlas!');
    
    try {
      const Pedido = require('./models/Pedido');
      const pedidos = await Pedido.find({}).populate('cliente', 'nome email');
      
      console.log('=====================================');
      console.log(`📦 PEDIDOS (${pedidos.length} encontrados):`);
      
      if (pedidos.length === 0) {
        console.log('❌ Nenhum pedido encontrado no banco de dados!');
        console.log('💡 Isso explica por que sua tela está vazia.');
      } else {
        pedidos.forEach((pedido, index) => {
          console.log(`  ${index + 1}. ID: ${pedido._id}`);
          console.log(`     Número: ${pedido.numero || 'N/A'}`);
          console.log(`     Cliente: ${pedido.cliente?.nome || 'N/A'}`);
          console.log(`     Status: ${pedido.status || 'N/A'}`);
          console.log(`     Total: R$ ${pedido.valores?.total || 'N/A'}`);
          console.log(`     Data: ${pedido.createdAt || 'N/A'}`);
          console.log('     ---');
        });
      }
      
      console.log('=====================================');
      
    } catch (error) {
      console.log('⚠️ Erro ao consultar pedidos:', error.message);
    }
    
    console.log('✅ Verificação concluída!');
    process.exit(0);
    
  })
  .catch(err => {
    console.error('❌ Erro ao conectar MongoDB:', err.message);
    process.exit(1);
  });
