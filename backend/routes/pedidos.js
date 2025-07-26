const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido");
const Usuario = require("../models/Usuario");
const Produto = require("../models/Produto");
const {
  PRECO_FIXO_PERSONALIZADA,
  processarItemPersonalizado,
  gerarHtmlPersonalizada,
  gerarTextoPersonalizada,
} = require("../utils/pizzaPersonalizada");

// GET /api/pedidos - Listar todos os pedidos
router.get("/", async (req, res) => {
  try {
    const { status, cliente } = req.query;

    let filtros = {};
    if (status) filtros.status = status;
    if (cliente) filtros.cliente = cliente;

    const pedidos = await Pedido.find(filtros)
      .populate("cliente", "nome telefone email")
      .populate("itens.produto", "nome categoria")
      .sort({ createdAt: -1 });

    res.json(pedidos);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// GET /api/pedidos/sincronizar - Endpoint de sincronização
router.get("/sincronizar", async (req, res) => {
  try {
    const pedidos = await Pedido.find({})
      .populate("cliente", "nome telefone email")
      .populate("itens.produto", "nome categoria");

    res.json({ sucesso: true, pedidos });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

// GET /api/pedidos/:id - Buscar pedido por ID
router.get("/:id", async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("cliente", "nome telefone email endereco")
      .populate("itens.produto", "nome categoria descricao")
      .populate("entrega.entregador", "nome telefone");

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pedidos - Criar novo pedido
// Novo endpoint para aceitar pedidos do frontend (cliente embutido)
router.post("/", async (req, res) => {
  try {
    const {
      cliente,
      endereco,
      tipoEntrega,
      formaPagamento,
      trocoPara,
      observacao,
      itens,
      dataHora
    } = req.body;

    // Mapeamento para o schema atual
    const pedidoData = {
      cliente: cliente, // salvar objeto embutido
      endereco: {
        rua: endereco.rua,
        numero: endereco.numero,
        bairro: endereco.bairro,
        complemento: endereco.complemento,
        cidade: endereco.cidade,
        cep: endereco.cep,
        estado: endereco.estado || "",
        pontoReferencia: endereco.referencia || endereco.pontoReferencia || ""
      },
      entrega: {
        tipo: tipoEntrega === "entrega" ? "delivery" : "retirada"
      },
      status: "pendente",
      formaPagamento: {
        tipo: formaPagamento,
        troco: trocoPara || null
      },
      observacoes: observacao || "",
      itens: itens.map(item => ({
        produto: item.produto || null,
        nome: item.nome,
        tamanho: item.tamanho,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        observacoes: item.observacoes || ""
      })),
      horarios: {
        pedido: dataHora ? new Date(dataHora) : new Date()
      }
    };

    // O cálculo de valores será feito pelo pre-save do schema
    const pedido = new Pedido(pedidoData);
    await pedido.save();
    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/pedidos/:id - Atualizar pedido
router.put("/:id", async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/pedidos/:id/status - Atualizar status do pedido
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/pedidos/:id/avaliacao - Adicionar avaliação ao pedido
router.post("/:id/avaliacao", async (req, res) => {
  try {
    const { nota, comentario } = req.body;

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      {
        avaliacao: {
          nota,
          comentario,
          data: new Date(),
        },
      },
      { new: true }
    );

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/pedidos/:id/imprimir - Formatar pedido para impressão térmica
router.get("/:id/imprimir", async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("cliente", "nome telefone email endereco")
      .populate("itens.produto", "nome categoria descricao");

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
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
    texto += `DATA: ${new Date(pedido.createdAt).toLocaleString("pt-BR")}\n`;
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
    if (pedido.entrega.tipo === "delivery" && pedido.endereco) {
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
      if (item.tipo === "personalizada") {
        texto += gerarTextoPersonalizada(item, index, linhaPequena);
      } else {
        texto += `${index + 1}. ${item.nome.toUpperCase()}\n`;
        if (item.tamanho) {
          texto += `   TAMANHO: ${item.tamanho}\n`;
        }
        texto += `   QTD: ${
          item.quantidade
        }x  VALOR: R$ ${item.precoUnitario.toFixed(2)}\n`;
        texto += `   SUBTOTAL: R$ ${(
          item.quantidade * item.precoUnitario
        ).toFixed(2)}\n`;
        if (item.observacoes) {
          texto += `   OBS: ${item.observacoes}\n`;
        }
        texto += linhaPequena + "\n";
      }
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
      texto += `TAXA ENTREGA:       R$ ${pedido.valores.taxaEntrega.toFixed(
        2
      )}\n`;
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
    if (pedido.entrega.tipo === "delivery") {
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
    texto += `Impresso em: ${new Date().toLocaleString("pt-BR")}\n`;
    texto += "\n\n\n"; // Espaço para corte do papel

    // Retornar como texto simples para impressão
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(texto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pedidos/:id/imprimir-html - Versão HTML para impressão web
router.get("/:id/imprimir-html", async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("cliente", "nome telefone email endereco")
      .populate("itens.produto", "nome categoria descricao");

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    let itensHtml = "";
    pedido.itens.forEach((item, index) => {
      if (item.tipo === "personalizada") {
        itensHtml += gerarHtmlPersonalizada(item, index);
      } else {
        itensHtml += `<div style='margin-bottom:10px;border-bottom:1px solid #ccc;padding-bottom:5px;'>`;
        itensHtml += `<strong>${index + 1}. ${item.nome}</strong><br>`;
        if (item.tamanho) itensHtml += `Tamanho: ${item.tamanho}<br>`;
        itensHtml += `Qtd: ${
          item.quantidade
        }x &nbsp; Valor: R$ ${item.precoUnitario.toFixed(2)}<br>`;
        itensHtml += `Subtotal: R$ ${(
          item.quantidade * item.precoUnitario
        ).toFixed(2)}<br>`;
        if (item.observacoes) itensHtml += `Obs: ${item.observacoes}<br>`;
        itensHtml += `</div>`;
      }
    });

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
            }
            body { font-family: Arial, sans-serif; }
            .pedido-header { margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="pedido-header">
            <h1>Pedido #${pedido.numero}</h1>
            <p><strong>Cliente:</strong> ${pedido.cliente.nome} - ${
      pedido.cliente.telefone
    }</p>
            <p><strong>Status:</strong> ${pedido.status.toUpperCase()}</p>
            <p><strong>Data:</strong> ${new Date(
              pedido.createdAt
            ).toLocaleString("pt-BR")}</p>
        </div>
        <h2>Itens do Pedido</h2>
        ${itensHtml}
        <h2>Valores</h2>
        <p>Subtotal: R$ ${pedido.valores.subtotal.toFixed(2)}</p>
        ${
          pedido.valores.taxaEntrega > 0
            ? `<p>Taxa Entrega: R$ ${pedido.valores.taxaEntrega.toFixed(2)}</p>`
            : ""
        }
        ${
          pedido.valores.desconto > 0
            ? `<p>Desconto: -R$ ${pedido.valores.desconto.toFixed(2)}</p>`
            : ""
        }
        <p><strong>Total: R$ ${pedido.valores.total.toFixed(2)}</strong></p>
        <h2>Pagamento</h2>
        <p>${
          pedido.formaPagamento.tipo
            ? pedido.formaPagamento.tipo.toUpperCase()
            : pedido.formaPagamento
        }</p>
        <h2>Observações</h2>
        <p>${pedido.observacoes || ""}</p>
    </body>
    </html>
        `;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
