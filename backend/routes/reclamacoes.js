const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Reclamacao = require('../models/Reclamacao');
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

// @desc    Registrar uma nova reclamação
// @route   POST /api/reclamacoes
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { 
      cliente: clienteId,
      dataEntrega,
      codigoRastreio,
      descricaoReclamacao,
      evidencias
    } = req.body;
    
    // Verificar se o cliente existe
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Cliente não encontrado'
      });
    }
    
    // Criar nova reclamação
    const reclamacao = new Reclamacao({
      cliente: clienteId,
      entregador: req.entregador.id,
      dataEntrega,
      codigoRastreio,
      descricaoReclamacao,
      evidencias: evidencias || []
    });
    
    await reclamacao.save();
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Reclamação registrada com sucesso',
      reclamacao
    });
  } catch (error) {
    console.error('Erro ao criar reclamação:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor'
    });
  }
});

// @desc    Listar reclamações
// @route   GET /api/reclamacoes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      cliente, 
      status,
      dataInicio,
      dataFim,
      limite = 10, 
      pagina = 1 
    } = req.query;
    
    // Construir query de filtro
    const filtro = {};
    
    if (cliente) filtro.cliente = cliente;
    if (status) filtro.status = status;
    
    // Filtro de data
    if (dataInicio || dataFim) {
      filtro.dataEntrega = {};
      if (dataInicio) filtro.dataEntrega.$gte = new Date(dataInicio);
      if (dataFim) filtro.dataEntrega.$lte = new Date(dataFim);
    }
    
    // Calcular paginação
    const skip = (pagina - 1) * limite;
    
    // Buscar reclamações
    const reclamacoes = await Reclamacao.find(filtro)
      .populate('cliente', 'nome endereco telefone')
      .populate('entregador', 'nome empresa')
      .skip(skip)
      .limit(Number(limite))
      .sort({ dataCadastro: -1 });
    
    // Contar total de resultados
    const total = await Reclamacao.countDocuments(filtro);
    
    res.status(200).json({
      sucesso: true,
      total,
      pagina: Number(pagina),
      totalPaginas: Math.ceil(total / limite),
      reclamacoes
    });
  } catch (error) {
    console.error('Erro ao listar reclamações:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor'
    });
  }
});

// @desc    Obter reclamação por ID
// @route   GET /api/reclamacoes/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const reclamacao = await Reclamacao.findById(req.params.id)
      .populate('cliente', 'nome endereco telefone')
      .populate('entregador', 'nome empresa');
    
    if (!reclamacao) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Reclamação não encontrada'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      reclamacao
    });
  } catch (error) {
    console.error('Erro ao buscar reclamação:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor'
    });
  }
});

// @desc    Atualizar status de uma reclamação
// @route   PUT /api/reclamacoes/:id/status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pendente', 'confirmada', 'contestada', 'resolvida'].includes(status)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Status inválido'
      });
    }
    
    const reclamacao = await Reclamacao.findById(req.params.id);
    
    if (!reclamacao) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Reclamação não encontrada'
      });
    }
    
    // Atualizar status
    reclamacao.status = status;
    await reclamacao.save();
    
    res.status(200).json({
      sucesso: true,
      mensagem: `Status atualizado para ${status}`,
      reclamacao
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro no servidor'
    });
  }
});

module.exports = router;