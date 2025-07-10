const mongoose = require('mongoose');
require('dotenv').config();

async function limparBancoUsuarios() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://pedrosutil2530sutil:pizzaria123@pizzaria-cluster.k8wkpvm.mongodb.net/pizzaria?retryWrites=true&w=majority';
    
    console.log('🗑️ INICIANDO LIMPEZA DO BANCO DE USUÁRIOS...\n');
    
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado ao MongoDB');
    
    const Usuario = require('./models/Usuario');
    
    // Contar usuários antes da limpeza
    const totalAntes = await Usuario.countDocuments();
    console.log(`📊 ANTES: ${totalAntes} usuários no banco`);
    
    // Mostrar todos os usuários que serão removidos
    console.log('\n📋 USUÁRIOS QUE SERÃO REMOVIDOS:');
    const todosUsuarios = await Usuario.find().select('nome email telefone tipo');
    todosUsuarios.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nome} - ${user.email} - ${user.tipo || 'sem tipo'}`);
    });
    
    // Confirmar se quer mesmo limpar
    console.log('\n⚠️  ATENÇÃO: Esta operação irá REMOVER TODOS os usuários!');
    console.log('🔄 Continuando em 3 segundos...\n');
    
    // Aguardar 3 segundos
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // OPÇÃO 1: Manter apenas o admin principal
    console.log('🛡️ MANTENDO APENAS ADMIN PRINCIPAL...');
    
    // Remover todos exceto admin principal
    const resultado = await Usuario.deleteMany({ 
      email: { $ne: 'admin@pizzaria.com' } // Manter apenas o admin@pizzaria.com
    });
    
    console.log(`🗑️ REMOVIDOS: ${resultado.deletedCount} usuários`);
    
    // OPÇÃO 2: Se quiser remover TUDO (descomente as linhas abaixo)
    /*
    console.log('💥 REMOVENDO TODOS OS USUÁRIOS...');
    const resultado = await Usuario.deleteMany({});
    console.log(`🗑️ REMOVIDOS: ${resultado.deletedCount} usuários`);
    */
    
    // Contar usuários após limpeza
    const totalDepois = await Usuario.countDocuments();
    console.log(`📊 DEPOIS: ${totalDepois} usuários restantes`);
    
    if (totalDepois > 0) {
      console.log('\n👤 USUÁRIOS RESTANTES:');
      const usuariosRestantes = await Usuario.find().select('nome email telefone tipo');
      usuariosRestantes.forEach((user, index) => {
        console.log(`${index + 1}. ${user.nome} - ${user.email} - ${user.tipo}`);
      });
    } else {
      console.log('\n🏜️ BANCO COMPLETAMENTE LIMPO!');
    }
    
    // Criar admin básico se não existir
    if (totalDepois === 0) {
      console.log('\n👑 CRIANDO ADMIN BÁSICO...');
      
      const bcrypt = require('bcryptjs');
      const senhaHash = await bcrypt.hash('admin123', 12);
      
      const adminBasico = new Usuario({
        nome: 'Administrador',
        email: 'admin@pizzaria.com',
        senha: senhaHash,
        telefone: '(11) 99999-9999',
        endereco: {
          rua: 'Rua Principal',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          cep: '01000-000',
          estado: 'SP'
        },
        tipo: 'admin',
        ativo: true
      });
      
      await adminBasico.save();
      console.log('✅ Admin básico criado: admin@pizzaria.com / admin123');
    }
    
    console.log('\n🎯 LIMPEZA CONCLUÍDA!');
    console.log('📝 Agora você pode testar novos cadastros com dados frescos');
    
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
    
  } catch (error) {
    console.error('❌ ERRO NA LIMPEZA:', error.message);
  }
}

// Perguntar confirmação antes de executar
console.log('⚠️  CONFIRMAÇÃO NECESSÁRIA:');
console.log('📋 Este script irá LIMPAR o banco de usuários!');
console.log('🛡️ Mantendo apenas o admin principal (admin@pizzaria.com)');
console.log('🔄 Executando automaticamente...\n');

limparBancoUsuarios();
