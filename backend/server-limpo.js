const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

console.log('🚀 NOVA API da Pizzaria - LIMPEZA COMPLETA!');

// CORS configurado para aceitar o frontend
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '..')));

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

console.log('✅ MIDDLEWARES CONFIGURADOS - NOVA VERSÃO');

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
    version: '3.0.0 NOVA VERSÃO LIMPA',
    servidor: 'server-limpo.js',
    timestamp: new Date().toISOString(),
    modo: 'Desenvolvimento Simples (LIMPO)'
  });
});

console.log('✅ ROTA PRINCIPAL CRIADA - NOVA VERSÃO');

// POST /api/clientes/cadastro - Cadastro simplificado
app.post('/api/clientes/cadastro', async (req, res) => {
  try {
    console.log('📝 CADASTRO NOVA VERSÃO:', req.body);
    
    const { nome, telefone, endereco, email, senha } = req.body;
    
    // Validações básicas
    if (!nome || !telefone || !email || !senha) {
      return res.json({ sucesso: false, erro: 'Todos os campos são obrigatórios' });
    }
    
    // Verificar se email já existe
    const usuarioExistente = usuarios.find(u => u.email === email.toLowerCase());
    if (usuarioExistente) {
      console.log('❌ E-mail já cadastrado!');
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
    
    // Criar novo usuário
    const novoUsuario = {
      _id: (usuarios.length + 1).toString(),
      nome,
      telefone,
      endereco: enderecoCompleto,
      email: email.toLowerCase(),
      senha: await bcrypt.hash(senha, 12),
      tipo: 'cliente',
      dataCadastro: new Date()
    };
    
    usuarios.push(novoUsuario);
    console.log('✅ CADASTRO REALIZADO - NOVA VERSÃO:', novoUsuario.nome);
    
    res.json({ sucesso: true, _id: novoUsuario._id, nome: novoUsuario.nome });
  } catch (error) {
    console.error('❌ ERRO CADASTRO NOVA VERSÃO:', error);
    res.json({ sucesso: false, erro: error.message });
  }
});

// POST /api/clientes/login - Login simplificado
app.post('/api/clientes/login', async (req, res) => {
  try {
    console.log('🔐 LOGIN NOVA VERSÃO:', req.body);
    
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      console.log('❌ Email ou senha em branco - NOVA VERSÃO');
      return res.json({ sucesso: false, erro: 'Email e senha são obrigatórios' });
    }
    
    const usuario = usuarios.find(u => u.email === email.toLowerCase());
    if (!usuario) {
      console.log('❌ Usuário não encontrado - NOVA VERSÃO');
      return res.json({ sucesso: false, erro: 'Usuário não encontrado' });
    }
    
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      console.log('❌ Senha incorreta - NOVA VERSÃO');
      return res.json({ sucesso: false, erro: 'Senha incorreta' });
    }
    
    const { senha: _, ...usuarioSemSenha } = usuario;
    console.log('✅ LOGIN REALIZADO - NOVA VERSÃO:', usuario.nome);
    
    res.json({ 
      sucesso: true, 
      usuario: usuarioSemSenha,
      token: 'token_limpo_' + usuario._id
    });
  } catch (error) {
    console.error('❌ ERRO LOGIN NOVA VERSÃO:', error);
    res.json({ sucesso: false, erro: error.message });
  }
});

// GET /api/produtos - Lista de produtos
app.get('/api/produtos', (req, res) => {
  console.log('🍕 PRODUTOS NOVA VERSÃO - Total:', produtos.length);
  res.json(produtos);
});

// GET /api/clientes - Lista de clientes (para debug)
app.get('/api/clientes', (req, res) => {
  const clientesSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);
  console.log('👥 CLIENTES NOVA VERSÃO - Total:', clientesSemSenha.length);
  res.json(clientesSemSenha);
});

// GET /api/database - Visualizar todo o banco de dados
app.get('/api/database', (req, res) => {
  const clientesSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);
  res.json({
    totalUsuarios: usuarios.length,
    totalProdutos: produtos.length,
    usuarios: clientesSemSenha,
    produtos: produtos,
    timestamp: new Date().toISOString(),
    versao: 'NOVA VERSÃO LIMPA'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('🚀 BACKEND NOVA VERSÃO INICIADO!');
  console.log(`🌐 API rodando em: http://localhost:${PORT}`);
  console.log(`📋 Status: http://localhost:${PORT}`);
  console.log(`👥 Cadastro: POST http://localhost:${PORT}/api/clientes/cadastro`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/clientes/login`);
  console.log(`🍕 Produtos: GET http://localhost:${PORT}/api/produtos`);
  console.log('');
  console.log('💾 NOVA VERSÃO - Banco em memória');
  console.log('✨ LIMPEZA COMPLETA REALIZADA');
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

console.log('✅ SERVIDOR NOVA VERSÃO CONFIGURADO!');
