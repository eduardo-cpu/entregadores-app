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
    'https://entregadores-app.vercel.app',
    'https://entregadores-app-espaula-ufsmbr-eduardos-projects-abf14777.vercel.app',
    'https://entregadores-pv7swo0yw-eduardos-projects-abf14777.vercel.app',
    'https://frontend-theta-orpin-86.vercel.app',
    'https://frontend-cql73mr9l-eduardos-projects-abf14777.vercel.app',
    'https://entregadores-555un4luu-eduardos-projects-abf14777.vercel.app', // Novo domínio do Vercel
    // Permitir todos os subdomínios do seu projeto no Vercel para futuras implantações
    /^https:\/\/entregadores-.*-eduardos-projects-abf14777\.vercel\.app$/,
    // Localhost para desenvolvimento
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Adicionado OPTIONS para dar suporte a preflight requests
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // Cache de preflight por 24 horas
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para debug de solicitações CORS (somente em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'N/A'}`);
    next();
  });
}

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API de registro de clientes fraudulentos para entregadores',
    status: 'online',
    mongodb: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Conexão com o MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://espaula:jfGqI8wSqsSBjBSf@entregadores.ilashuq.mongodb.net/entregadores-app?retryWrites=true&w=majority&appName=Entregadores';

// Opções avançadas de conexão com MongoDB
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Aumenta o tempo de seleção do servidor para 30 segundos
  socketTimeoutMS: 45000, // Timeout de socket aumentado para 45 segundos
  connectTimeoutMS: 30000, // Timeout de conexão aumentado para 30 segundos
  // Configuração de retry para conexão mais robusta
  retryWrites: true,
  retryReads: true,
  // Configuração de pool de conexões
  maxPoolSize: 10,
  minPoolSize: 5
};

// Supressão do aviso de deprecation
mongoose.set('strictQuery', false);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  
  // Log da string de conexão (com senha ofuscada para segurança)
  const logConnectionString = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//********:********@');
  console.log(`Tentando conectar ao MongoDB: ${logConnectionString}`);
  
  // Tentar conectar ao MongoDB com as novas opções
  mongoose.connect(MONGODB_URI, mongooseOptions)
    .then(() => {
      console.log('Conectado ao MongoDB com sucesso');
      
      // Configurar rotas somente após conexão bem-sucedida com o banco de dados
      const entregadorRoutes = require('./routes/entregadores');
      const clienteRoutes = require('./routes/clientes');
      const reclamacaoRoutes = require('./routes/reclamacoes');
      
      app.use('/api/entregadores', entregadorRoutes);
      app.use('/api/clientes', clienteRoutes);
      app.use('/api/reclamacoes', reclamacaoRoutes);
      
      console.log('Rotas configuradas com sucesso');
    })
    .catch((err) => {
      console.error('❌ Erro ao conectar ao MongoDB:', err.message);
      console.error('Stack trace:', err.stack);
      
      if (err.name === 'MongoNetworkError' || err.message.includes('timed out')) {
        console.log('⚠️ Erro de conexão de rede ou timeout. Recomendações:');
        console.log('1. Verifique se o MongoDB Atlas está disponível');
        console.log('2. Acesse o MongoDB Atlas: https://cloud.mongodb.com');
        console.log('3. Vá para Network Access no menu esquerdo');
        console.log('4. Clique em "ADD IP ADDRESS" e selecione "Allow Access from Anywhere" (0.0.0.0/0)');
        console.log('5. Confira se não há restrições de firewall bloqueando a conexão');
      } else if (err.name === 'MongoServerSelectionError') {
        console.log('⚠️ Erro na seleção do servidor MongoDB. Recomendações:');
        console.log('1. Verifique se o cluster está ativo no MongoDB Atlas');
        console.log('2. Confira se a string de conexão está correta');
      }
      
      console.log('O servidor continuará funcionando com funcionalidade limitada');
    });
});

// Manipulação global de exceções não tratadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});