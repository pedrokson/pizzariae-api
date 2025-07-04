// Servidor backend temporário para teste sem MongoDB
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// CORS configurado para aceitar o frontend (mais permissivo para teste)
app.use(cors({
  origin: true, // Aceita qualquer origem para teste
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '..')));

// Middleware para logs detalhados
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

app.use(express.json());

// Dados temporários em memória (substituirá MongoDB)
let usuarios = [];
let produtos = [
  {
    _id: '1',
    nome: 'Pizza Marguerita',
    categoria: 'pizza-salgada',
    preco: 39.90,
    imagem: 'img/pizza-marguerita.jpg',
    ingredientes: 'Molho de tomate, mussarela, manjericão',
    disponivel: true
  },
  {
    _id: '2', 
    nome: 'Pizza Calabresa',
    categoria: 'pizza-salgada',
    preco: 42.90,
    imagem: 'img/pizza-calabresa.jpg',
    ingredientes: 'Molho de tomate, mussarela, calabresa, cebola',
    disponivel: true
  },
  {
    _id: '3',
    nome: 'Pizza Quatro Queijos', 
    categoria: 'pizza-salgada',
    preco: 45.90,
    imagem: 'img/pizza-4queijos.jpg',
    ingredientes: 'Molho branco, mussarela, parmesão, provolone, gorgonzola',
    disponivel: true
  }
];
let pedidos = [];

// Rota principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'API da Pizzaria Jerônimu\'s funcionando!',
    status: 'OK',
    version: '2.0.0-test',
    usuarios: usuarios.length,
    produtos: produtos.length,
    pedidos: pedidos.length
  });
});

// Rota de cadastro
app.post('/api/clientes/cadastro', async (req, res) => {
  try {
    console.log('🎯 Recebendo requisição de cadastro...');
    console.log('📦 Headers:', req.headers);
    console.log('📝 Body recebido:', req.body);
    
    const { nome, telefone, endereco, email, senha } = req.body;
    
    // Validações básicas
    if (!nome || !email || !senha) {
      console.log('❌ Dados obrigatórios não fornecidos');
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios!' });
    }
    
    console.log('✅ Dados validados:', { nome, email, telefone });
    
    // Verificar se usuário já existe
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
      console.log('❌ Email já cadastrado:', email);
      return res.status(400).json({ error: 'E-mail já cadastrado!' });
    }
    
    // Criptografar senha
    console.log('🔐 Criptografando senha...');
    const senhaHash = await bcrypt.hash(senha, 10);
    
    // Criar usuário
    const novoUsuario = {
      _id: (usuarios.length + 1).toString(),
      nome,
      telefone: telefone || '',
      endereco: endereco || {},
      email: email.toLowerCase(),
      senha: senhaHash,
      dataCriacao: new Date()
    };
    
    usuarios.push(novoUsuario);
    
    console.log('✅ Usuário criado com sucesso:', { 
      id: novoUsuario._id, 
      nome, 
      email: novoUsuario.email,
      total_usuarios: usuarios.length
    });
    
    res.status(201).json({ 
      message: 'Usuário cadastrado com sucesso!',
      _id: novoUsuario._id,
      nome: novoUsuario.nome,
      email: novoUsuario.email
    });
    
  } catch (error) {
    console.error('❌ ERRO DETALHADO no cadastro:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
  }
});

// Rota de login
app.post('/api/clientes/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    console.log('🔐 Tentativa de login:', email);
    
    // Buscar usuário
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
      return res.status(400).json({ error: 'E-mail ou senha inválidos!' });
    }
    
    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: 'E-mail ou senha inválidos!' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { userId: usuario._id, email: usuario.email },
      'pizzaria_jwt_secret_teste',
      { expiresIn: '24h' }
    );
    
    console.log('✅ Login realizado:', { id: usuario._id, nome: usuario.nome });
    
    res.json({
      token,
      usuario: {
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone
      }
    });
    
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de produtos
app.get('/api/produtos', (req, res) => {
  const { categoria } = req.query;
  
  let produtosFiltrados = produtos;
  if (categoria) {
    produtosFiltrados = produtos.filter(p => p.categoria === categoria);
  }
  
  console.log(`📦 Produtos solicitados (${categoria || 'todos'}):`, produtosFiltrados.length);
  res.json(produtosFiltrados);
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('🚀 Backend de TESTE iniciado!');
  console.log(`🌐 API rodando em: http://localhost:${PORT}`);
  console.log(`📋 Status: http://localhost:${PORT}`);
  console.log(`👥 Cadastro: POST http://localhost:${PORT}/api/clientes/cadastro`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/clientes/login`);
  console.log(`🍕 Produtos: GET http://localhost:${PORT}/api/produtos`);
  console.log('');
  console.log('💡 Este é um servidor de TESTE sem MongoDB');
  console.log('📝 Os dados serão perdidos ao reiniciar');
  console.log('');
  console.log('⏹️ Para parar: Ctrl+C');
});
