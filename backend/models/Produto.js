const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres']
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true
  },
  categoria: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: {
      values: ['pizza', 'bebida', 'sobremesa', 'entrada', 'acompanhamento'],
      message: 'Categoria deve ser: pizza, bebida, sobremesa, entrada ou acompanhamento'
    }
  },
  preco: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço deve ser positivo']
  },
  tamanhos: [{
    nome: {
      type: String,
      required: true,
      enum: ['Pequena', 'Média', 'Grande', 'Família']
    },
    preco: {
      type: Number,
      required: true,
      min: 0
    },
    diametro: String // ex: "25cm"
  }],
  ingredientes: [{
    nome: String,
    alergeno: {
      type: Boolean,
      default: false
    }
  }],
  imagem: {
    url: String,
    alt: String
  },
  disponivel: {
    type: Boolean,
    default: true
  },
  destaque: {
    type: Boolean,
    default: false
  },
  tempoPreparo: {
    type: Number, // em minutos
    default: 30
  },
  promocao: {
    ativa: {
      type: Boolean,
      default: false
    },
    desconto: Number, // porcentagem
    dataInicio: Date,
    dataFim: Date
  },
  avaliacoes: [{
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    },
    nota: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comentario: String,
    data: {
      type: Date,
      default: Date.now
    }
  }],
  mediaAvaliacoes: {
    type: Number,
    default: 0
  },
  totalVendas: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calcular média das avaliações
produtoSchema.methods.calcularMediaAvaliacoes = function() {
  if (this.avaliacoes.length === 0) {
    this.mediaAvaliacoes = 0;
  } else {
    const soma = this.avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.nota, 0);
    this.mediaAvaliacoes = Math.round((soma / this.avaliacoes.length) * 10) / 10;
  }
};

// Middleware para calcular média antes de salvar
produtoSchema.pre('save', function(next) {
  this.calcularMediaAvaliacoes();
  next();
});

module.exports = mongoose.model('Produto', produtoSchema);
