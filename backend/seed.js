const mongoose = require('mongoose');
require('dotenv').config();
const Produto = require('./models/Produto');
const Usuario = require('./models/Usuario');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado!');
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Limpar dados existentes
    await Produto.deleteMany({});
    await Usuario.deleteMany({});

    // Criar produtos de exemplo
    const produtos = [
      {
        nome: "Pizza Margherita",
        descricao: "Molho de tomate, mussarela, manjericão fresco",
        categoria: "pizza",
        preco: 35.90,
        tamanhos: [
          { nome: "Média", preco: 35.90, diametro: "30cm" },
          { nome: "Grande", preco: 45.90, diametro: "35cm" }
        ],
        ingredientes: [
          { nome: "Mussarela", alergeno: true },
          { nome: "Manjericão", alergeno: false },
          { nome: "Molho de tomate", alergeno: false }
        ],
        disponivel: true,
        destaque: true
      },
      {
        nome: "Pizza Pepperoni",
        descricao: "Molho de tomate, mussarela, pepperoni",
        categoria: "pizza",
        preco: 42.90,
        tamanhos: [
          { nome: "Média", preco: 42.90, diametro: "30cm" },
          { nome: "Grande", preco: 52.90, diametro: "35cm" }
        ],
        ingredientes: [
          { nome: "Mussarela", alergeno: true },
          { nome: "Pepperoni", alergeno: false },
          { nome: "Molho de tomate", alergeno: false }
        ],
        disponivel: true,
        destaque: false
      },
      {
        nome: "Coca-Cola 350ml",
        descricao: "Refrigerante Coca-Cola lata 350ml",
        categoria: "bebida",
        preco: 5.50,
        disponivel: true,
        destaque: false
      }
    ];

    await Produto.insertMany(produtos);

    // Criar usuário admin de exemplo
    const admin = new Usuario({
      nome: "Administrador",
      email: "admin@pizzaria.com",
      senha: "admin123",
      telefone: "(11) 99999-9999",
      endereco: {
        rua: "Rua Principal",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        cep: "01234-567",
        estado: "SP"
      },
      tipo: "admin"
    });

    await admin.save();

    console.log('✅ Dados inseridos com sucesso!');
    console.log(`📦 ${produtos.length} produtos criados`);
    console.log(`👤 1 usuário admin criado`);
    
  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error);
  }
};

const main = async () => {
  await connectDB();
  await seedDatabase();
  mongoose.connection.close();
  console.log('🔚 Conexão fechada');
};

main();
