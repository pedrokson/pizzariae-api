const express = require('express');
const router = express.Router();
const Produto = require('../models/Produto');

// GET /api/produtos - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const { categoria, disponivel, destaque } = req.query;
    
    let filtros = {};
    if (categoria) filtros.categoria = categoria;
    if (disponivel !== undefined) filtros.disponivel = disponivel === 'true';
    if (destaque !== undefined) filtros.destaque = destaque === 'true';
    
    const produtos = await Produto.find(filtros).sort({ createdAt: -1 });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/produtos/sincronizar - Endpoint de sincronização
router.get('/sincronizar', async (req, res) => {
  try {
    const produtos = await Produto.find({});
    res.json({ sucesso: true, produtos });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

// GET /api/produtos/:id - Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id).populate('avaliacoes.usuario', 'nome');
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/produtos - Criar novo produto
router.post('/', async (req, res) => {
  try {
    const produto = new Produto(req.body);
    await produto.save();
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/produtos/:id - Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/produtos/:id - Deletar produto
router.delete('/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/produtos/:id/avaliacao - Adicionar avaliação
router.post('/:id/avaliacao', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    produto.avaliacoes.push(req.body);
    await produto.save();
    
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;