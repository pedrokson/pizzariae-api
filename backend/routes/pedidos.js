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
    console.log('🛒 CRIANDO NOVO PEDIDO:', req.body);
    const { cliente, itens, endereco, formaPagamento, entrega, observacoes } = req.body;
    
    // Verificar se cliente existe
    console.log('👤 Verificando cliente:', cliente);
    const clienteExiste = await Usuario.findById(cliente);
    if (!clienteExiste) {
      console.log('❌ Cliente não encontrado');
      return res.status(400).json({ error: 'Cliente não encontrado' });
    }
    console.log('✅ Cliente encontrado:', clienteExiste.nome);
    
    // Gerar número do pedido
    const totalPedidos = await Pedido.countDocuments();
    const numeroPedido = String(totalPedidos + 1).padStart(6, '0');
    console.log('🔢 Número do pedido gerado:', numeroPedido);
    
    // Calcular valores dos itens
    console.log('🧮 Calculando valores dos itens...');
    let subtotal = 0;
    const itensProcessados = [];
    
    for (let item of itens) {
      console.log('🔍 Processando item:', item);
      const produto = await Produto.findById(item.produto);
      if (!produto) {
        console.log('❌ Produto não encontrado:', item.produto);
        return res.status(400).json({ error: `Produto ${item.produto} não encontrado` });
      }
      console.log('✅ Produto encontrado:', produto.nome);
      
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
      numero: numeroPedido,
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
    
    console.log('💾 Salvando pedido:', numeroPedido);
    await novoPedido.save();
    console.log('✅ Pedido salvo com sucesso!');
    
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

// GET /api/pedidos/:id/imprimir - Formatar pedido para impressão térmica
router.get('/:id/imprimir', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente', 'nome telefone email endereco')
      .populate('itens.produto', 'nome categoria descricao');
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Formato para impressora térmica (58mm) - 48 caracteres
    const linha = "================================================";
    const linhaPequena = "--------------------------------";
    
    let texto = "";
    
    // Cabeçalho da pizzaria
    texto += "================================================\n";
    texto += "            🍕 JERÔNIMU'S PIZZA 🍕\n";
    texto += "         Rua das Pizzas, 123 - Centro\n";
    texto += "         Tel: (11) 99999-9999\n";
    texto += "================================================\n";
    texto += "\n";
    
    // Informações do pedido
    texto += `PEDIDO: #${pedido.numero}\n`;
    texto += `DATA: ${new Date(pedido.createdAt).toLocaleString('pt-BR')}\n`;
    texto += `STATUS: ${pedido.status.toUpperCase()}\n`;
    texto += "\n";
    texto += linhaPequena + "\n";
    texto += "           DADOS DO CLIENTE\n";
    texto += linhaPequena + "\n";
    texto += `NOME: ${pedido.cliente.nome}\n`;
    texto += `FONE: ${pedido.cliente.telefone}\n`;
    if (pedido.cliente.email) {
      texto += `EMAIL: ${pedido.cliente.email}\n`;
    }
    texto += "\n";
    
    // Endereço de entrega
    if (pedido.entrega.tipo === 'delivery' && pedido.endereco) {
      texto += linhaPequena + "\n";
      texto += "         ENDEREÇO DE ENTREGA\n";
      texto += linhaPequena + "\n";
      texto += `${pedido.endereco.rua}, ${pedido.endereco.numero}\n`;
      if (pedido.endereco.complemento) {
        texto += `COMPL: ${pedido.endereco.complemento}\n`;
      }
      texto += `BAIRRO: ${pedido.endereco.bairro}\n`;
      texto += `CIDADE: ${pedido.endereco.cidade}\n`;
      texto += `CEP: ${pedido.endereco.cep}\n`;
      if (pedido.endereco.pontoReferencia) {
        texto += `REF: ${pedido.endereco.pontoReferencia}\n`;
      }
      texto += "\n";
    } else {
      texto += linhaPequena + "\n";
      texto += "           🚶 RETIRADA NO LOCAL\n";
      texto += linhaPequena + "\n";
      texto += "\n";
    }
    
    // Itens do pedido
    texto += "================================================\n";
    texto += "                  PEDIDO\n";
    texto += "================================================\n";
    
    pedido.itens.forEach((item, index) => {
      texto += `${index + 1}. ${item.nome.toUpperCase()}\n`;
      if (item.tamanho) {
        texto += `   TAMANHO: ${item.tamanho}\n`;
      }
      texto += `   QTD: ${item.quantidade}x  VALOR: R$ ${item.precoUnitario.toFixed(2)}\n`;
      texto += `   SUBTOTAL: R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}\n`;
      if (item.observacoes) {
        texto += `   OBS: ${item.observacoes}\n`;
      }
      texto += linhaPequena + "\n";
    });
    
    // Observações gerais
    if (pedido.observacoes) {
      texto += "\n";
      texto += "OBSERVAÇÕES GERAIS:\n";
      texto += `${pedido.observacoes}\n`;
      texto += "\n";
    }
    
    // Totais
    texto += "================================================\n";
    texto += "                 VALORES\n";
    texto += "================================================\n";
    texto += `SUBTOTAL:           R$ ${pedido.valores.subtotal.toFixed(2)}\n`;
    if (pedido.valores.taxaEntrega > 0) {
      texto += `TAXA ENTREGA:       R$ ${pedido.valores.taxaEntrega.toFixed(2)}\n`;
    }
    if (pedido.valores.desconto > 0) {
      texto += `DESCONTO:          -R$ ${pedido.valores.desconto.toFixed(2)}\n`;
    }
    texto += linhaPequena + "\n";
    texto += `TOTAL:              R$ ${pedido.valores.total.toFixed(2)}\n`;
    texto += "================================================\n";
    
    // Forma de pagamento
    texto += "\n";
    texto += `💳 PAGAMENTO: ${pedido.formaPagamento.toUpperCase()}\n`;
    if (pedido.entrega.tipo === 'delivery') {
      texto += "⏰ TEMPO ESTIMADO: 45-60 MIN\n";
    } else {
      texto += "⏰ TEMPO ESTIMADO: 20-30 MIN\n";
    }
    texto += "\n";
    
    // Rodapé
    texto += "================================================\n";
    texto += "          OBRIGADO PELA PREFERÊNCIA!\n";
    texto += "               Volte sempre! 😊\n";
    texto += "================================================\n";
    texto += "\n";
    texto += `Impresso em: ${new Date().toLocaleString('pt-BR')}\n`;
    texto += "\n\n\n"; // Espaço para corte do papel
    
    // Retornar como texto simples para impressão
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(texto);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pedidos/:id/imprimir-html - Versão HTML para impressão web
router.get('/:id/imprimir-html', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente', 'nome telefone email endereco')
      .populate('itens.produto', 'nome categoria descricao');
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Pedido #${pedido.numero}</title>
        <style>
            @media print {
                body { margin: 0; }
                .no-print { display: none; }