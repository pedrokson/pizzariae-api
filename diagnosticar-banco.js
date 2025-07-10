const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 INICIANDO DIAGNÓSTICO DO BANCO DE DADOS...\n');

async function diagnosticarBanco() {
  try {
    // Conectar ao MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://pedrosutil2530sutil:pizzaria123@pizzaria-cluster.k8wkpvm.mongodb.net/pizzaria?retryWrites=true&w=majority';
    
    console.log('📡 Conectando ao MongoDB...');
    console.log('🔗 URI:', mongoURI.replace(/\/\/.*:.*@/, '//***:***@')); // Ocultar senha
    
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado ao MongoDB com sucesso!\n');
    
    // Verificar informações da conexão
    console.log('🗃️ INFORMAÇÕES DA CONEXÃO:');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    console.log('Estado:', mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado');
    console.log();
    
    // Listar todas as collections
    console.log('📋 COLLECTIONS DISPONÍVEIS:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('❌ NENHUMA COLLECTION ENCONTRADA!');
    } else {
      collections.forEach(col => {
        console.log(`- ${col.name} (tipo: ${col.type})`);
      });
    }
    console.log();
    
    // Contar documentos em cada collection
    console.log('📊 CONTAGEM DE DOCUMENTOS EM CADA COLLECTION:');
    
    const collectionsComDados = [];
    
    for (const col of collections) {
      try {
        const count = await mongoose.connection.db.collection(col.name).countDocuments();
        console.log(`📁 ${col.name}: ${count} documentos`);
        
        if (count > 0) {
          collectionsComDados.push({ nome: col.name, count });
          
          // Mostrar exemplo do primeiro documento
          const exemplo = await mongoose.connection.db.collection(col.name).findOne();
          console.log(`   Exemplo:`, JSON.stringify(exemplo, null, 2).substring(0, 300) + '...');
          console.log();
        }
      } catch (error) {
        console.log(`❌ Erro ao verificar ${col.name}: ${error.message}`);
      }
    }
    
    if (collectionsComDados.length === 0) {
      console.log('⚠️ NENHUMA COLLECTION COM DADOS ENCONTRADA!');
      console.log('💡 O banco de dados está completamente vazio.');
    }
    
    // Tentar buscar com os modelos específicos
    console.log('\n🎯 TENTANDO BUSCAR COM MODELOS ESPECÍFICOS:');
    
    try {
      // Importar modelos
      const Usuario = require('./models/Usuario');
      const Produto = require('./models/Produto');
      const Pedido = require('./models/Pedido');
      
      const usuariosCount = await Usuario.countDocuments();
      console.log(`👥 Usuários (model): ${usuariosCount}`);
      
      const produtosCount = await Produto.countDocuments();
      console.log(`🍕 Produtos (model): ${produtosCount}`);
      
      const pedidosCount = await Pedido.countDocuments();
      console.log(`📦 Pedidos (model): ${pedidosCount}`);
      
      // Se houver usuários, mostrar alguns
      if (usuariosCount > 0) {
        console.log('\n📋 PRIMEIROS 3 USUÁRIOS:');
        const usuarios = await Usuario.find().limit(3).select('nome email telefone');
        usuarios.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.nome} - ${user.email} - ${user.telefone}`);
        });
      }
      
    } catch (modelError) {
      console.log(`❌ Erro ao usar modelos: ${modelError.message}`);
    }
    
    // Verificar diferentes databases
    console.log('\n🔍 VERIFICANDO OUTRAS DATABASES POSSÍVEIS:');
    
    try {
      const admin = mongoose.connection.db.admin();
      const databases = await admin.listDatabases();
      
      console.log('📚 Databases disponíveis:');
      databases.databases.forEach(db => {
        console.log(`- ${db.name} (tamanho: ${db.sizeOnDisk} bytes)`);
      });
      
      // Verificar se existe uma database 'pizzaria' ou similar
      const possiveisDatabases = ['pizzaria', 'pizzariaapi', 'pizzaria-api', 'test'];
      
      for (const dbName of possiveisDatabases) {
        try {
          const dbExists = databases.databases.find(db => db.name === dbName);
          if (dbExists) {
            console.log(`\n🎯 ENCONTRADA DATABASE: ${dbName}`);
            
            // Conectar na database específica
            const tempConnection = await mongoose.createConnection(mongoURI.replace('/pizzaria?', `/${dbName}?`));
            const collections = await tempConnection.db.listCollections().toArray();
            
            console.log(`Collections em ${dbName}:`);
            for (const col of collections) {
              const count = await tempConnection.db.collection(col.name).countDocuments();
              console.log(`  - ${col.name}: ${count} documentos`);
            }
            
            await tempConnection.close();
          }
        } catch (dbError) {
          console.log(`Erro ao verificar ${dbName}: ${dbError.message}`);
        }
      }
      
    } catch (adminError) {
      console.log(`❌ Erro ao listar databases: ${adminError.message}`);
    }
    
    console.log('\n🎯 DIAGNÓSTICO CONCLUÍDO!');
    
  } catch (error) {
    console.error('❌ ERRO CRÍTICO NO DIAGNÓSTICO:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    try {
      await mongoose.disconnect();
      console.log('🔌 Desconectado do MongoDB');
    } catch (disconnectError) {
      console.log('❌ Erro ao desconectar:', disconnectError.message);
    }
  }
}

// Executar diagnóstico
diagnosticarBanco();
