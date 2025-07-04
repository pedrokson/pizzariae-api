const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// GET /api/clientes - Listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Usuario.find({ tipo: 'cliente' }).select('-senha');
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/clientes/cadastro - Cadastro de cliente
router.post('/cadastro', async (req, res) => {
  try {
    console.log('Recebido cadastro:', req.body);
    
    const { nome, telefone, endereco, email, senha } = req.body;
    
    // Verificar se email já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      console.log('E-mail já cadastrado!');
      return res.json({ sucesso: false, erro: 'E-mail já cadastrado!' });
    }
    
    // Criar novo usuário
    const novoUsuario = new Usuario({
      nome,
      telefone,
      endereco,
      email,
      senha,
      tipo: 'cliente'
    });
    
    await novoUsuario.save();
    console.log('Cliente cadastrado com sucesso');
    
    res.json({ sucesso: true, cliente: novoUsuario });
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    res.json({ sucesso: false, erro: error.message });
  }
});

// POST /api/clientes/login - Login de cliente
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Buscar usuário por email
    const usuario = await Usuario.findOne({ email, tipo: 'cliente' });
    if (!usuario) {
      return res.json({ sucesso: false, erro: 'E-mail ou senha inválidos!' });
    }
    
    // Verificar senha
    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      return res.json({ sucesso: false, erro: 'E-mail ou senha inválidos!' });
    }
    
    // Atualizar último login
    usuario.ultimoLogin = new Date();
    await usuario.save();
    
    // Gerar JWT token
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      sucesso: true, 
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        endereco: usuario.endereco
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

// GET /api/clientes/:id - Buscar cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Usuario.findById(req.params.id).select('-senha');
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/clientes/:id - Atualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const cliente = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-senha');
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;