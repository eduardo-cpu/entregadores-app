const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EntregadorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: 6,
    select: false
  },
  empresa: {
    type: String,
    required: [true, 'Nome da empresa é obrigatório']
  },
  telefone: {
    type: String
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  }
});

// Criptografar senha antes de salvar
EntregadorSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para verificar senha
EntregadorSchema.methods.matchSenha = async function(senhaInformada) {
  return await bcrypt.compare(senhaInformada, this.senha);
};

module.exports = mongoose.model('Entregador', EntregadorSchema);