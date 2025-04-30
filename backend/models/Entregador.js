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
}, {
  // Definindo explicitamente o nome da coleção para evitar problemas de pluralização
  collection: 'entregadores'
});

// Criptografar senha antes de salvar
EntregadorSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('senha')) {
      return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    console.error('Erro ao criptografar senha:', error);
    next(error);
  }
});

// Método para verificar senha
EntregadorSchema.methods.matchSenha = async function(senhaInformada) {
  try {
    return await bcrypt.compare(senhaInformada, this.senha);
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    throw error;
  }
};

module.exports = mongoose.model('Entregador', EntregadorSchema);