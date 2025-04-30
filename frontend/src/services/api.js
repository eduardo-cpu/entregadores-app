import axios from 'axios';

// Detectar ambiente automaticamente
const isProduction = window.location.hostname !== "localhost";

// URLs da API para diferentes ambientes
const PRODUCTION_API_URL = "https://entregadores-app.onrender.com";  // Removido /api do final
const DEVELOPMENT_API_URL = "http://localhost:5000";

// Log ambiente para debug
console.log('Ambiente:', isProduction ? 'Produção' : 'Desenvolvimento');
console.log('API URL Base:', isProduction ? PRODUCTION_API_URL : DEVELOPMENT_API_URL);

// Configuração do cliente axios
const api = axios.create({
  baseURL: isProduction ? PRODUCTION_API_URL : DEVELOPMENT_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Aumentar timeout para evitar erros com servidores lentos
  timeout: 30000
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    // Log da requisição para debug
    console.log(`Enviando requisição para: ${config.baseURL}${config.url}`);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para logs de resposta/erro
api.interceptors.response.use(
  response => {
    console.log(`Resposta bem-sucedida [${response.config.url}]:`, response.status);
    return response;
  },
  error => {
    const { response } = error;
    if (response) {
      console.error(`Erro na requisição [${error.config?.url}]:`, {
        status: response.status,
        data: response.data
      });
    } else {
      console.error('Erro na requisição sem resposta do servidor:', error.message || error);
    }
    return Promise.reject(error);
  }
);

// Funções de autenticação
export const authService = {
  login: async (email, senha) => {
    console.log('Iniciando requisição de login para:', email);
    try {
      // Adicionando o prefixo /api para garantir que a rota esteja correta
      const response = await api.post('/api/entregadores/login', { email, senha });
      console.log('Login bem-sucedido:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('entregador', JSON.stringify(response.data.entregador));
      }
      return response.data;
    } catch (error) {
      console.error('Erro durante o login:', error.response?.data || error.message);
      throw error;
    }
  },
  
  registro: async (entregadorData) => {
    try {
      // Adicionando o prefixo /api para garantir que a rota esteja correta
      const response = await api.post('/api/entregadores/registro', entregadorData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('entregador', JSON.stringify(response.data.entregador));
      }
      return response.data;
    } catch (error) {
      console.error('Erro durante o registro:', error.response?.data || error.message);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('entregador');
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('entregador'));
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Funções de clientes fraudulentos
export const clienteService = {
  cadastrarCliente: async (clienteData) => {
    const response = await api.post('/api/clientes', clienteData);
    return response.data;
  },
  
  listarClientes: async (filtros = {}) => {
    const response = await api.get('/api/clientes', { params: filtros });
    return response.data;
  },
  
  obterCliente: async (id) => {
    const response = await api.get(`/api/clientes/${id}`);
    return response.data;
  },
  
  confirmarCliente: async (id) => {
    const response = await api.post(`/api/clientes/${id}/confirmar`);
    return response.data;
  }
};

// Funções de reclamações
export const reclamacaoService = {
  cadastrarReclamacao: async (reclamacaoData) => {
    const response = await api.post('/api/reclamacoes', reclamacaoData);
    return response.data;
  },
  
  listarReclamacoes: async (filtros = {}) => {
    const response = await api.get('/api/reclamacoes', { params: filtros });
    return response.data;
  },
  
  obterReclamacao: async (id) => {
    const response = await api.get(`/api/reclamacoes/${id}`);
    return response.data;
  },
  
  atualizarStatus: async (id, status) => {
    const response = await api.put(`/api/reclamacoes/${id}/status`, { status });
    return response.data;
  }
};

// Função para testar a conexão com a API
export const testarConexao = async () => {
  try {
    const response = await api.get('/');
    console.log('Conexão com a API:', response.data);
    return {
      sucesso: true,
      mensagem: 'Conexão estabelecida com sucesso',
      dados: response.data
    };
  } catch (error) {
    console.error('Erro ao testar conexão com a API:', error);
    return {
      sucesso: false,
      mensagem: 'Falha na conexão com a API',
      erro: error.message
    };
  }
};

export default api;