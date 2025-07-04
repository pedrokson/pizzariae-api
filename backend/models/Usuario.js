const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório']
  },
  endereco: {
    rua: { type: String, default: 'Não informado' },
    numero: { type: String, default: 'S/N' },
    complemento: { type: String, default: '' },
    bairro: { type: String, default: 'Centro' },
    cidade: { type: String, default: 'São Paulo' },
    cep: { type: String, default: '00000-000' },
    estado: { type: String, default: 'SP', maxlength: 2 }
  },
  tipo: {
    type: String,
    enum: ['cliente', 'funcionario', 'admin'],
    default: 'cliente'
  },
  ativo: {
    type: Boolean,
    default: true
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  },
  ultimoLogin: Date
}, {
  timestamps: true
});

// Hash da senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 12);
  next();
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function(senhaCandidata) {
  return await bcrypt.compare(senhaCandidata, this.senha);
};

// Remover senha do JSON response
usuarioSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.senha;
  return obj;
};

module.exports = mongoose.model('Usuario', usuarioSchema);
