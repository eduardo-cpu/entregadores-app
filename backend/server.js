const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rotas
const entregadorRoutes = require('./routes/entregadores');
const clienteRoutes = require('./routes/clientes');
const reclamacaoRoutes = require('./routes/reclamacoes');

app.use('/api/entregadores', entregadorRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/reclamacoes', reclamacaoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API de registro de clientes fraudulentos para entregadores' });
});

// Conexão com o MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/entregadores-app';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
  });