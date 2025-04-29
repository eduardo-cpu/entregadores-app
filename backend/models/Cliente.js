const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do cliente é obrigatório']
  },
  endereco: {
    rua: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String
  },
  telefone: {
    type: String
  },
  email: {
    type: String
  },
  cpf: {
    type: String
  },
  descricaoFraude: {
    type: String,
    required: [true, 'Descrição da fraude é obrigatória']
  },
  cadastradoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entregador',
    required: true
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  },
  confirmacoes: [{
    entregador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entregador'
    },
    data: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Cliente', ClienteSchema);