const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  numero: {
    type: String,
    unique: true,
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'Cliente é obrigatório']
  },
  itens: [{
    produto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produto',
      required: true
    },
    nome: String, // cache do nome do produto
    tamanho: String,
    quantidade: {
      type: Number,
      required: true,
      min: 1
    },
    precoUnitario: {
      type: Number,
      required: true,
      min: 0
    },
    observacoes: String
  }],
  endereco: {
    rua: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: String,
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    cep: { type: String, required: true },
    estado: { type: String, required: true },
    pontoReferencia: String
  },
  status: {
    type: String,
    enum: {
      values: ['pendente', 'confirmado', 'preparando', 'saiu_entrega', 'entregue', 'cancelado'],
      message: 'Status inválido'
    },
    default: 'pendente'
  },
  formaPagamento: {
    tipo: {
      type: String,
      enum: ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'vale_refeicao'],
      required: true
    },
    troco: Number, // apenas para pagamento em dinheiro
    statusPagamento: {
      type: String,
      enum: ['pendente', 'pago', 'estornado'],
      default: 'pendente'
    }
  },
  valores: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    taxaEntrega: {
      type: Number,
      default: 0,
      min: 0
    },
    desconto: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  entrega: {
    tipo: {
      type: String,
      enum: ['delivery', 'retirada'],
      required: true
    },
    entregador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    },
    tempoEstimado: Number, // em minutos
    horaSaida: Date,
    horaEntrega: Date
  },
  observacoes: String,
  horarios: {
    pedido: {
      type: Date,
      default: Date.now
    },
    confirmacao: Date,
    preparo: Date,
    saida: Date,
    entrega: Date,
    cancelamento: Date
  },
  avaliacao: {
    nota: {
      type: Number,
      min: 1,
      max: 5
    },
    comentario: String,
    data: Date
  }
}, {
  timestamps: true
});

// Gerar número do pedido antes de salvar
pedidoSchema.pre('save', async function(next) {
  if (!this.numero) {
    const hoje = new Date();
    const ano = hoje.getFullYear().toString().substr(-2);
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoje.getDate().toString().padStart(2, '0');
    
    // Buscar último pedido do dia
    const ultimoPedido = await this.constructor.findOne({
      numero: new RegExp(`^${ano}${mes}${dia}`)
    }).sort({ numero: -1 });
    
    let sequencial = 1;
    if (ultimoPedido) {
      sequencial = parseInt(ultimoPedido.numero.substr(-3)) + 1;
    }
    
    this.numero = `${ano}${mes}${dia}${sequencial.toString().padStart(3, '0')}`;
  }
  next();
});

// Calcular total antes de salvar
pedidoSchema.pre('save', function(next) {
  // Calcular subtotal
  this.valores.subtotal = this.itens.reduce((total, item) => {
    return total + (item.precoUnitario * item.quantidade);
  }, 0);
  
  // Calcular total
  this.valores.total = this.valores.subtotal + this.valores.taxaEntrega - this.valores.desconto;
  
  next();
});

// Atualizar horários baseado no status
pedidoSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const agora = new Date();
    switch (this.status) {
      case 'confirmado':
        if (!this.horarios.confirmacao) this.horarios.confirmacao = agora;
        break;
      case 'preparando':
        if (!this.horarios.preparo) this.horarios.preparo = agora;
        break;
      case 'saiu_entrega':
        if (!this.horarios.saida) this.horarios.saida = agora;
        break;
      case 'entregue':
        if (!this.horarios.entrega) this.horarios.entrega = agora;
        break;
      case 'cancelado':
        if (!this.horarios.cancelamento) this.horarios.cancelamento = agora;
        break;
    }
  }
  next();
});

module.exports = mongoose.model('Pedido', pedidoSchema);
