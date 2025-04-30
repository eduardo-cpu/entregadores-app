const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cliente = require('../models/Cliente');
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
    return res.status(401).json({
      sucesso: false,
      erro: 'Token inválido'
    });
  }
};

// @desc    Cadastrar um novo cliente fraudulento
// @route   POST /api/clientes
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { 
      nome, 
      endereco, 
      telefone, 
      email, 
      cpf, 
      descricaoFraude 
    } = req.body;
    
    // Criar novo cliente fraudulento
    const cliente = new Cliente({
      nome,
      endereco,
      telefone,
      email,
      cpf,
      descricaoFraude,
      cadastradoPor: req.entregador.id,
      confirmacoes: [{
        entregador: req.entregador.id
      }]
    });
    
    await cliente.save();
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Cliente fraudulento cadastrado com sucesso',
      cliente
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor'
    });
  }
});

// @desc    Buscar clientes fraudulentos
// @route   GET /api/clientes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      nome, 
      endereco, 
      telefone, 
      email, 
      cpf, 
      limite = 10, 
      pagina = 1 
    } = req.query;
    
    // Construir query de filtro
    const filtro = {};
    
    if (nome) filtro.nome = { $regex: nome, $options: 'i' };
    if (telefone) filtro.telefone = telefone;
    if (email) filtro.email = { $regex: email, $options: 'i' };
    if (cpf) filtro.cpf = cpf;
    if (endereco?.cep) filtro['endereco.cep'] = endereco.cep;
    
    // Calcular paginação
    const skip = (pagina - 1) * limite;
    
    // Buscar clientes
    const clientes = await Cliente.find(filtro)
      .populate('cadastradoPor', 'nome empresa')
      .skip(skip)
      .limit(Number(limite))
      .sort({ dataCadastro: -1 });
    
    // Contar total de resultados
    const total = await Cliente.countDocuments(filtro);
    
    res.status(200).json({
      sucesso: true,
      total,
      pagina: Number(pagina),
      totalPaginas: Math.ceil(total / limite),
      clientes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor'
    });
  }
});

// @desc    Obter cliente fraudulento por ID
// @route   GET /api/clientes/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id)
      .populate('cadastradoPor', 'nome empresa')
      .populate('confirmacoes.entregador', 'nome empresa');
    
    if (!cliente) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Cliente não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      cliente
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor'
    });
  }
});

// @desc    Confirmar cliente fraudulento
// @route   POST /api/clientes/:id/confirmar
// @access  Private
router.post('/:id/confirmar', auth, async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Cliente não encontrado'
      });
    }
    
    // Verificar se o entregador já confirmou este cliente
    const jaConfirmou = cliente.confirmacoes.some(
      confirmacao => confirmacao.entregador.toString() === req.entregador.id
    );
    
    if (jaConfirmou) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Você já confirmou este cliente fraudulento'
      });
    }
    
    // Adicionar confirmação
    cliente.confirmacoes.push({
      entregador: req.entregador.id
    });
    
    await cliente.save();
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Cliente fraudulento confirmado com sucesso',
      cliente
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