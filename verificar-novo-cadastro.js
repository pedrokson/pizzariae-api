const mongoose = require('mongoose');
require('dotenv').config();

async function verificarNovoCadastro() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://pedrosutil2530sutil:pizzaria123@pizzaria-cluster.k8wkpvm.mongodb.net/pizzaria?retryWrites=true&w=majority';
    
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado ao MongoDB');
    
    const Usuario = require('./models/Usuario');
    
    // Buscar por nome "pedro henrique"
    console.log('🔍 PROCURANDO USUÁRIO "PEDRO HENRIQUE":');
    const pedroUsuarios = await Usuario.find({ 
      nome: { $regex: /pedro henrique/i } 
    }).select('nome email telefone tipo createdAt');
    
    console.log(`Encontrados ${pedroUsuarios.length} usuários com nome "pedro henrique":`);
    pedroUsuarios.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nome} - ${user.email} - ${user.telefone} - Criado: ${user.createdAt}`);
    });
    
    // Buscar por telefone específico do novo cadastro
    console.log('\n🔍 PROCURANDO POR TELEFONE "43991310616":');
    const usuarioTelefone = await Usuario.findOne({ telefone: "43991310616" });
    
    if (usuarioTelefone) {
      console.log('✅ ENCONTRADO usuário com esse telefone:');
      console.log(`Nome: ${usuarioTelefone.nome}`);
      console.log(`Email: ${usuarioTelefone.email}`);
      console.log(`Telefone: ${usuarioTelefone.telefone}`);
      console.log(`Tipo: ${usuarioTelefone.tipo}`);
      console.log(`Cadastrado em: ${usuarioTelefone.createdAt}`);
      console.log(`Endereço: ${usuarioTelefone.endereco.rua}, ${usuarioTelefone.endereco.numero}`);
    } else {
      console.log('❌ NÃO ENCONTRADO usuário com telefone "43991310616"');
    }
    
    // Buscar email específico do novo cadastro
    console.log('\n🔍 PROCURANDO POR EMAIL "prdesil156@gmail.com":');
    const usuarioEmail = await Usuario.findOne({ email: "prdesil156@gmail.com" });
    
    if (usuarioEmail) {
      console.log('✅ ENCONTRADO usuário com esse email:');
      console.log(`Nome: ${usuarioEmail.nome}`);
      console.log(`Telefone: ${usuarioEmail.telefone}`);
      console.log(`Cadastrado em: ${usuarioEmail.createdAt}`);
      console.log(`Endereço: ${usuarioEmail.endereco.rua}, ${usuarioEmail.endereco.numero}`);
    } else {
      console.log('❌ NÃO ENCONTRADO usuário com email "prdesil156@gmail.com"');
    }
    
    // Mostrar os 3 usuários mais recentes
    console.log('\n📅 ÚLTIMOS 3 CADASTROS:');
    const ultimosCadastros = await Usuario.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('nome email telefone tipo createdAt');
    
    ultimosCadastros.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nome} - ${user.email} - ${user.telefone}`);
      console.log(`   Cadastrado: ${user.createdAt}`);
    });
    
    // Contar total atual
    const totalUsuarios = await Usuario.countDocuments();
    console.log(`\n📊 TOTAL ATUAL: ${totalUsuarios} usuários`);
    
    await mongoose.disconnect();
    console.log('🔌 Desconectado');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verificarNovoCadastro();
