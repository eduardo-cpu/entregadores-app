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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'entregadoresapp');
    
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
    const { nome, email, senha, empresa, telefone } = req.body;
    
    // Verificar se o email já existe
    let entregador = await Entregador.findOne({ email });
    
    if (entregador) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Email já cadastrado'
      });
    }
    
    // Criar novo entregador
    entregador = new Entregador({
      nome,
      email,
      senha,
      empresa,
      telefone
    });
    
    await entregador.save();
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: entregador.id },
      process.env.JWT_SECRET || 'entregadoresapp',
      { expiresIn: '30d' }
    );
    
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
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor'
    });
  }
});

// @desc    Login de entregador
// @route   POST /api/entregadores/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Verificar se o email existe
    const entregador = await Entregador.findOne({ email }).select('+senha');
    
    if (!entregador) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Credenciais inválidas'
      });
    }
    
    // Verificar senha
    const senhaCorreta = await entregador.matchSenha(senha);
    
    if (!senhaCorreta) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Credenciais inválidas'
      });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: entregador.id },
      process.env.JWT_SECRET || 'entregadoresapp',
      { expiresIn: '30d' }
    );
    
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
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor'
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