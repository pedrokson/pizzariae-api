const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Usuario = require('../models/Usuario');
const Produto = require('../models/Produto');

// GET /api/pedidos - Listar todos os pedidos
router.get('/', async (req, res) => {
  try {
    const { status, cliente } = req.query;
    
    let filtros = {};
    if (status) filtros.status = status;
    if (cliente) filtros.cliente = cliente;
    
    const pedidos = await Pedido.find(filtros)
      .populate('cliente', 'nome telefone email')
      .populate('itens.produto', 'nome categoria')
      .sort({ createdAt: -1 });
    
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pedidos/sincronizar - Endpoint de sincronização
router.get('/sincronizar', async (req, res) => {
  try {
    const pedidos = await Pedido.find({})
      .populate('cliente', 'nome telefone email')
      .populate('itens.produto', 'nome categoria');
    
    res.json({ sucesso: true, pedidos });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

// GET /api/pedidos/:id - Buscar pedido por ID
router.get('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente', 'nome telefone email endereco')
      .populate('itens.produto', 'nome categoria descricao')
      .populate('entrega.entregador', 'nome telefone');
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pedidos - Criar novo pedido
router.post('/', async (req, res) => {
  try {
    const { cliente, itens, endereco, formaPagamento, entrega, observacoes } = req.body;
    
    // Verificar se cliente existe
    const clienteExiste = await Usuario.findById(cliente);
    if (!clienteExiste) {
      return res.status(400).json({ error: 'Cliente não encontrado' });
    }
    
    // Calcular valores dos itens
    let subtotal = 0;
    const itensProcessados = [];
    
    for (let item of itens) {
      const produto = await Produto.findById(item.produto);
      if (!produto) {
        return res.status(400).json({ error: `Produto ${item.produto} não encontrado` });
      }
      
      // Se tem tamanho específico, buscar preço do tamanho
      let precoUnitario = item.precoUnitario;
      if (item.tamanho && produto.tamanhos.length > 0) {
        const tamanhoInfo = produto.tamanhos.find(t => t.nome === item.tamanho);
        if (tamanhoInfo) {
          precoUnitario = tamanhoInfo.preco;
        }
      }
      
      const itemProcessado = {
        produto: produto._id,
        nome: produto.nome,
        tamanho: item.tamanho,
        quantidade: item.quantidade,
        precoUnitario: precoUnitario,
        observacoes: item.observacoes
      };
      
      subtotal += precoUnitario * item.quantidade;
      itensProcessados.push(itemProcessado);
    }
    
    // Calcular taxa de entrega (exemplo: R$ 5,00 para delivery)
    const taxaEntrega = entrega.tipo === 'delivery' ? 5.00 : 0;
    
    const novoPedido = new Pedido({
      cliente,
      itens: itensProcessados,
      endereco,
      formaPagamento,
      entrega,
      observacoes,
      valores: {
        subtotal,
        taxaEntrega,
        desconto: 0,
        total: subtotal + taxaEntrega
      }
    });
    
    await novoPedido.save();
    
    // Popular dados para resposta
    await novoPedido.populate('cliente', 'nome telefone email');
    await novoPedido.populate('itens.produto', 'nome categoria');
    
    res.status(201).json(novoPedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/pedidos/:id - Atualizar pedido
router.put('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/pedidos/:id/status - Atualizar status do pedido
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/pedidos/:id/avaliacao - Adicionar avaliação ao pedido
router.post('/:id/avaliacao', async (req, res) => {
  try {
    const { nota, comentario } = req.body;
    
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { 
        avaliacao: {
          nota,
          comentario,
          data: new Date()
        }
      },
      { new: true }
    );
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;