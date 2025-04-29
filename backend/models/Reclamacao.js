const mongoose = require('mongoose');

const ReclamacaoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  entregador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entregador',
    required: true
  },
  dataEntrega: {
    type: Date,
    required: true
  },
  codigoRastreio: {
    type: String
  },
  descricaoReclamacao: {
    type: String,
    required: true
  },
  evidencias: [{
    tipo: String, // foto, vídeo, áudio, etc.
    url: String,
    descricao: String
  }],
  dataCadastro: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pendente', 'confirmada', 'contestada', 'resolvida'],
    default: 'pendente'
  }
});

module.exports = mongoose.model('Reclamacao', ReclamacaoSchema);