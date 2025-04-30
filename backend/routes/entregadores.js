const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Entregador = require('../models/Entregador');

// Middleware para verificar token
const auth = async (req, res, next) => {
  try {
    // Verificar se o header Authorization existe
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Token não fornecido, acesso negado'
      });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'entregadoresapp2025seguro');
    
    // Buscar o entregador pelo ID
    const entregador = await Entregador.findById(decoded.id);
    
    if (!entregador) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Entregador não encontrado'
      });
    }
    
    // Adicionar o entregador ao request
    req.entregador = entregador;
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error.message);
    return res.status(401).json({
      sucesso: false,
      erro: 'Token inválido'
    });
  }
};

// @desc    Registrar um novo entregador
// @route   POST /api/entregadores/registro
// @access  Public
router.post('/registro', async (req, res) => {
  try {
    console.log('Tentativa de registro recebida:', { 
      nome: req.body.nome, 
      email: req.body.email, 
      empresa: req.body.empresa 
    });
    
    const { nome, email, senha, empresa, telefone } = req.body;
    
    if (!nome || !email || !senha || !empresa) {
      console.log('Dados incompletos no registro');
      return res.status(400).json({
        sucesso: false,
        erro: 'Dados incompletos. Preencha todos os campos obrigatórios.'
      });
    }
    
    // Verificar se o email já existe
    console.log('Verificando se o email já existe:', email);
    let entregador = await Entregador.findOne({ email });
    
    if (entregador) {
      console.log('Email já cadastrado:', email);
      return res.status(400).json({
        sucesso: false,
        erro: 'Email já cadastrado'
      });
    }
    
    // Criar novo entregador
    console.log('Criando novo entregador...');
    entregador = new Entregador({
      nome,
      email,
      senha,
      empresa,
      telefone
    });
    
    await entregador.save();
    console.log('Entregador salvo com sucesso');
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: entregador.id },
      process.env.JWT_SECRET || 'entregadoresapp2025seguro',
      { expiresIn: '30d' }
    );
    console.log('Token gerado para o entregador:', entregador.id);
    
    res.status(201).json({
      sucesso: true,
      token,
      entregador: {
        id: entregador.id,
        nome: entregador.nome,
        email: entregador.email,
        empresa: entregador.empresa
      }
    });
  } catch (error) {
    console.error('ERRO NO REGISTRO:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor: ' + error.message
    });
  }
});

// @desc    Login de entregador
// @route   POST /api/entregadores/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('Tentativa de login recebida:', { 
      email: req.body.email 
    });
    
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      console.log('Dados incompletos no login');
      return res.status(400).json({
        sucesso: false,
        erro: 'Email e senha são obrigatórios'
      });
    }
    
    // Verificar se o email existe
    console.log('Buscando entregador pelo email:', email);
    const entregador = await Entregador.findOne({ email }).select('+senha');
    
    if (!entregador) {
      console.log('Entregador não encontrado para o email:', email);
      return res.status(401).json({
        sucesso: false,
        erro: 'Credenciais inválidas'
      });
    }
    
    // Verificar senha
    console.log('Verificando senha...');
    const senhaCorreta = await entregador.matchSenha(senha);
    
    if (!senhaCorreta) {
      console.log('Senha incorreta para o email:', email);
      return res.status(401).json({
        sucesso: false,
        erro: 'Credenciais inválidas'
      });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: entregador.id },
      process.env.JWT_SECRET || 'entregadoresapp2025seguro',
      { expiresIn: '30d' }
    );
    
    console.log('Login bem-sucedido para:', email);
    res.status(200).json({
      sucesso: true,
      token,
      entregador: {
        id: entregador.id,
        nome: entregador.nome,
        email: entregador.email,
        empresa: entregador.empresa
      }
    });
  } catch (error) {
    console.error('ERRO NO LOGIN:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor: ' + error.message
    });
  }
});

// @desc    Obter perfil do entregador logado
// @route   GET /api/entregadores/perfil
// @access  Private
router.get('/perfil', auth, async (req, res) => {
  try {
    const entregador = await Entregador.findById(req.entregador.id);
    
    res.status(200).json({
      sucesso: true,
      entregador: {
        id: entregador.id,
        nome: entregador.nome,
        email: entregador.email,
        empresa: entregador.empresa,
        telefone: entregador.telefone,
        dataCadastro: entregador.dataCadastro
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor'
    });
  }
});

module.exports = router;