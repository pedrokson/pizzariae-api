const mongoose = require('mongoose');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Conectado ao MongoDB Atlas!');
    console.log('=====================================');
    
    // Listar todas as collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Collections disponíveis:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    console.log('=====================================');
    
    // Consultar usuários
    try {
      const Usuario = require('./models/Usuario');
      const usuarios = await Usuario.find({});
      console.log(`👥 USUÁRIOS (${usuarios.length} encontrados):`);
      usuarios.forEach(user => {
        console.log(`  - ID: ${user._id}`);
        console.log(`    Nome: ${user.nome}`);
        console.log(`    Email: ${user.email}`);
        console.log(`    Telefone: ${user.telefone}`);
        console.log(`    Tipo: ${user.tipo}`);
        console.log(`    Data: ${user.dataCadastro || user.createdAt}`);
        console.log('    ---');
      });
    } catch (error) {
      console.log('⚠️ Erro ao consultar usuários:', error.message);
    }
    
    console.log('=====================================');
    
    // Consultar produtos
    try {
      const Produto = require('./models/Produto');
      const produtos = await Produto.find({});
      console.log(`🍕 PRODUTOS (${produtos.length} encontrados):`);
      produtos.forEach(prod => {
        console.log(`  - ID: ${prod._id}`);
        console.log(`    Nome: ${prod.nome}`);
        console.log(`    Preço: R$ ${prod.preco}`);
        console.log(`    Categoria: ${prod.categoria}`);
        console.log(`    Disponível: ${prod.disponivel ? 'Sim' : 'Não'}`);
        console.log('    ---');
      });
    } catch (error) {
      console.log('⚠️ Erro ao consultar produtos:', error.message);
    }
    
    console.log('=====================================');
    console.log('🔍 Consulta finalizada!');
    process.exit(0);
    
  })
  .catch(err => {
    console.error('❌ Erro ao conectar:', err.message);
    process.exit(1);
  });
