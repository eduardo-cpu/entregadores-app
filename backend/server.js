const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Configuração do CORS para permitir apenas domínios específicos
const corsOptions = {
  origin: [
    // Domínios do Vercel
    'https://entregadores-app-espaula-ufsmbr-eduardos-projects-abf14777.vercel.app',
    'https://entregadores-pv7swo0yw-eduardos-projects-abf14777.vercel.app',
    // Localhost para desenvolvimento
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
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
  res.json({ 
    mensagem: 'API de registro de clientes fraudulentos para entregadores',
    status: 'online',
    mongodb: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado'
  });
});

// Conexão com o MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/entregadores-app';

// Supressão do aviso de deprecation
mongoose.set('strictQuery', false);

// Iniciar o servidor primeiro, independente da conexão com o MongoDB
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Tentar conectar ao MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    console.log('Para resolver este problema:');
    console.log('1. Acesse o MongoDB Atlas: https://cloud.mongodb.com');
    console.log('2. Vá para Network Access no menu esquerdo');
    console.log('3. Clique em "ADD IP ADDRESS" e selecione "Allow Access from Anywhere" (0.0.0.0/0)');
    console.log('4. Confirme e aguarde a alteração ser aplicada');
    console.log('O servidor continuará funcionando, mas sem acesso ao banco de dados');
  });