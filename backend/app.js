const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

console.log('🚀 API da Pizzaria - Backend Híbrido MongoDB + Memória!');

// CORS configurado para aceitar requisições de qualquer origem
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logs
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

console.log('✅ MIDDLEWARES CONFIGURADOS');

// Variável para controlar se MongoDB está conectado
let mongoConnected = false;

// Conectar MongoDB
console.log('🔌 Tentando conectar MongoDB...');
console.log('🌐 URI:', process.env.MONGODB_URI ? 'Definida' : 'NÃO DEFINIDA');
console.log('🔗 URI completa:', process.env.MONGODB_URI);

// Força a URI do Atlas se a variável não estiver definida
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://pedrosutil2530sutil:pizzaria123@pizzaria-cluster.k8wkpvm.mongodb.net/pizzaria?retryWrites=true&w=majority';
console.log('🎯 URI que será usada:', mongoUri);

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 15000, // 15 segundos para timeout
  connectTimeoutMS: 15000
})
  .then(() => {
    console.log('✅ MongoDB conectado com sucesso!');
    mongoConnected = true;
  })
  .catch(err => {
    console.log('❌ MongoDB não conectou:', err.name, '-', err.message);
    console.log('🔄 Usando banco de dados em memória como fallback');
    mongoConnected = false;
  });

// Carregar modelos do MongoDB
let Usuario, Produto;
try {
  console.log('📁 Carregando modelos MongoDB...');
  Usuario = require('./models/Usuario');
  Produto = require('./models/Produto');
  console.log('✅ Modelos MongoDB carregados');
} catch (error) {
  console.log('⚠️ Erro ao carregar modelos:', error.message);
}

// Banco de dados em memória
let usuarios = [];
let produtos = [
  {
    _id: '1',
    nome: 'Pizza Margherita',
    descricao: 'Molho de tomate, mussarela, manjericão fresco',
    categoria: 'pizza',
    preco: 35.90,
    disponivel: true
  },
  {
    _id: '2', 
    nome: 'Pizza Pepperoni',
    descricao: 'Molho de tomate, mussarela, pepperoni',
    categoria: 'pizza',
    preco: 42.90,
    disponivel: true
  },
  {
    _id: '3',
    nome: 'Pizza Portuguesa',
    descricao: 'Molho de tomate, mussarela, presunto, ovos, cebola',
    categoria: 'pizza', 
    preco: 38.90,
    disponivel: true
  }
];

// Rota principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'API da Pizzaria Jerônimu\'s funcionando!',
    status: 'OK',
    version: '3.0.0 HÍBRIDO',
    servidor: 'app.js (Híbrido)',
    timestamp: new Date().toISOString(),
    mongodb: mongoConnected ? 'Conectado' : 'Usando memória como fallback'
  });
});

console.log('✅ ROTA PRINCIPAL CRIADA');

// POST /api/clientes/cadastro - Cadastro híbrido (MongoDB + Memória)
app.post('/api/clientes/cadastro', async (req, res) => {
  try {
    console.log('📝 CADASTRO HÍBRIDO:', req.body);
    
    const { nome, telefone, endereco, email, senha } = req.body;
    
    // Validações básicas
    if (!nome || !telefone || !email || !senha) {
      return res.json({ sucesso: false, erro: 'Todos os campos são obrigatórios' });
    }
    
    if (mongoConnected && Usuario) {
      // Usar MongoDB
      try {
        const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase() });
        if (usuarioExistente) {
          console.log('❌ E-mail já cadastrado no MongoDB!');
          return res.json({ sucesso: false, erro: 'E-mail já cadastrado!' });
        }
        
        // Preparar estrutura de endereço para MongoDB
        let enderecoCompleto = endereco;
        if (typeof endereco === 'string') {
          enderecoCompleto = {
            rua: endereco,
            numero: 'S/N',
            bairro: 'Centro',
            cidade: 'São Paulo',
            cep: '00000-000',
            estado: 'SP'
          };
        }
        
        const novoUsuario = new Usuario({
          nome,
          telefone,
          endereco: enderecoCompleto,
          email: email.toLowerCase(),
          senha,
          tipo: 'cliente'
        });
        
        await novoUsuario.save();
        console.log('✅ CADASTRO REALIZADO NO MONGODB:', novoUsuario.nome);
        
        res.json({ sucesso: true, _id: novoUsuario._id, nome: novoUsuario.nome });
      } catch (error) {
        console.error('❌ Erro MongoDB, usando memória:', error.message);
        // Fallback para memória se MongoDB falhar
        return cadastrarEmMemoria();
      }
    } else {
      // Usar memória
      return cadastrarEmMemoria();
    }
    
    // Função auxiliar para cadastro em memória
    function cadastrarEmMemoria() {
      const usuarioExistente = usuarios.find(u => u.email === email.toLowerCase());
      if (usuarioExistente) {
        console.log('❌ E-mail já cadastrado na memória!');
        return res.json({ sucesso: false, erro: 'E-mail já cadastrado!' });
      }
      
      // Preparar estrutura de endereço
      let enderecoCompleto = endereco;
      if (typeof endereco === 'string') {
        enderecoCompleto = {
          rua: endereco,
          numero: 'S/N',
          bairro: 'Centro',
          cidade: 'São Paulo',
          cep: '00000-000',
          estado: 'SP'
        };
      }
      
      const novoUsuario = {
        _id: (usuarios.length + 1).toString(),
        nome,
        telefone,
        endereco: enderecoCompleto,
        email: email.toLowerCase(),
        senha: bcrypt.hashSync(senha, 12),
        tipo: 'cliente',
        dataCadastro: new Date()
      };
      
      usuarios.push(novoUsuario);
      console.log('✅ CADASTRO REALIZADO NA MEMÓRIA:', novoUsuario.nome);
      
      res.json({ sucesso: true, _id: novoUsuario._id, nome: novoUsuario.nome });
    }
  } catch (error) {
    console.error('❌ ERRO CADASTRO HÍBRIDO:', error);
    res.json({ sucesso: false, erro: error.message });
  }
});

// POST /api/clientes/login - Login híbrido (MongoDB + Memória)
app.post('/api/clientes/login', async (req, res) => {
  try {
    console.log('🔐 LOGIN HÍBRIDO:', req.body);
    
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      console.log('❌ Email ou senha em branco');
      return res.json({ sucesso: false, erro: 'Email e senha são obrigatórios' });
    }
    
    if (mongoConnected && Usuario) {
      // Usar MongoDB
      try {
        const usuario = await Usuario.findOne({ email: email.toLowerCase() });
        if (!usuario) {
          console.log('❌ Usuário não encontrado no MongoDB');
          return res.json({ sucesso: false, erro: 'Usuário não encontrado' });
        }
        
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
          console.log('❌ Senha incorreta no MongoDB');
          return res.json({ sucesso: false, erro: 'Senha incorreta' });
        }
        
        const { senha: _, ...usuarioSemSenha } = usuario.toObject();
        console.log('✅ LOGIN REALIZADO NO MONGODB:', usuario.nome);
        
        res.json({ 
          sucesso: true, 
          usuario: usuarioSemSenha,
          token: 'token_mongo_' + usuario._id
        });
      } catch (error) {
        console.error('❌ Erro MongoDB login, tentando memória:', error.message);
        // Fallback para memória se MongoDB falhar
        return loginEmMemoria();
      }
    } else {
      // Usar memória
      return loginEmMemoria();
    }
    
    // Função auxiliar para login em memória
    function loginEmMemoria() {
      const usuario = usuarios.find(u => u.email === email.toLowerCase());
      if (!usuario) {
        console.log('❌ Usuário não encontrado na memória');
        return res.json({ sucesso: false, erro: 'Usuário não encontrado' });
      }
      
      const senhaValida = bcrypt.compareSync(senha, usuario.senha);
      if (!senhaValida) {
        console.log('❌ Senha incorreta na memória');
        return res.json({ sucesso: false, erro: 'Senha incorreta' });
      }
      
      const { senha: _, ...usuarioSemSenha } = usuario;
      console.log('✅ LOGIN REALIZADO NA MEMÓRIA:', usuario.nome);
      
      res.json({ 
        sucesso: true, 
        usuario: usuarioSemSenha,
        token: 'token_memoria_' + usuario._id
      });
    }
  } catch (error) {
    console.error('❌ ERRO LOGIN HÍBRIDO:', error);
    res.json({ sucesso: false, erro: error.message });
  }
});

// GET /api/produtos - Lista de produtos híbrida
app.get('/api/produtos', async (req, res) => {
  try {
    if (mongoConnected && Produto) {
      // Usar MongoDB
      try {
        const produtos = await Produto.find({ disponivel: true });
        console.log('🍕 PRODUTOS DO MONGODB - Total:', produtos.length);
        res.json(produtos);
      } catch (error) {
        console.error('❌ Erro MongoDB produtos, usando memória:', error.message);
        console.log('🍕 PRODUTOS DA MEMÓRIA - Total:', produtos.length);
        res.json(produtos);
      }
    } else {
      // Usar memória
      console.log('🍕 PRODUTOS DA MEMÓRIA - Total:', produtos.length);
      res.json(produtos);
    }
  } catch (error) {
    console.error('❌ ERRO PRODUTOS HÍBRIDO:', error);
    res.json({ error: error.message });
  }
});

// GET /api/clientes - Lista de clientes híbrida
app.get('/api/clientes', async (req, res) => {
  try {
    if (mongoConnected && Usuario) {
      // Usar MongoDB
      try {
        const clientes = await Usuario.find({ tipo: 'cliente' }).select('-senha');
        console.log('👥 CLIENTES DO MONGODB - Total:', clientes.length);
        res.json(clientes);
      } catch (error) {
        console.error('❌ Erro MongoDB clientes, usando memória:', error.message);
        const clientesSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);
        console.log('👥 CLIENTES DA MEMÓRIA - Total:', clientesSemSenha.length);
        res.json(clientesSemSenha);
      }
    } else {
      // Usar memória
      const clientesSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);
      console.log('👥 CLIENTES DA MEMÓRIA - Total:', clientesSemSenha.length);
      res.json(clientesSemSenha);
    }
  } catch (error) {
    console.error('❌ ERRO CLIENTES HÍBRIDO:', error);
    res.json({ error: error.message });
  }
});

// GET /api/database - Visualizar banco de dados híbrido
app.get('/api/database', async (req, res) => {
  try {
    let usuariosData = [];
    let produtosData = [];
    
    if (mongoConnected && Usuario && Produto) {
      // Usar MongoDB
      try {
        usuariosData = await Usuario.find({}).select('-senha');
        produtosData = await Produto.find({});
        console.log('🗃️ DATABASE DO MONGODB');
      } catch (error) {
        console.error('❌ Erro MongoDB database, usando memória:', error.message);
        usuariosData = usuarios.map(({ senha, ...usuario }) => usuario);
        produtosData = produtos;
        console.log('🗃️ DATABASE DA MEMÓRIA');
      }
    } else {
      // Usar memória
      usuariosData = usuarios.map(({ senha, ...usuario }) => usuario);
      produtosData = produtos;
      console.log('🗃️ DATABASE DA MEMÓRIA');
    }
    
    res.json({
      totalUsuarios: usuariosData.length,
      totalProdutos: produtosData.length,
      usuarios: usuariosData,
      produtos: produtosData,
      timestamp: new Date().toISOString(),
      fonte: mongoConnected ? 'MongoDB' : 'Memória',
      versao: 'HÍBRIDO'
    });
  } catch (error) {
    console.error('❌ ERRO DATABASE HÍBRIDO:', error);
    res.json({ error: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('🚀 BACKEND HÍBRIDO INICIADO!');
  console.log(`🌐 API rodando em: http://localhost:${PORT}`);
  console.log(`📋 Status: http://localhost:${PORT}`);
  console.log(`👥 Cadastro: POST http://localhost:${PORT}/api/clientes/cadastro`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/clientes/login`);
  console.log(`🍕 Produtos: GET http://localhost:${PORT}/api/produtos`);
  console.log(`🗃️ Database: GET http://localhost:${PORT}/database`);
  console.log('');
  if (mongoConnected) {
    console.log('✅ MongoDB Conectado - Usando banco real');
  } else {
    console.log('💾 Usando banco de dados em memória como fallback');
  }
  console.log('🔄 Sistema híbrido ativo');
  console.log('');
  console.log('⏹️ Para parar: Ctrl+C');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso!`);
    console.log('💡 Execute: taskkill /f /im node.exe');
  } else {
    console.error('❌ Erro:', err.message);
  }
});

console.log('✅ SERVIDOR HÍBRIDO CONFIGURADO (MongoDB + Memória)');
