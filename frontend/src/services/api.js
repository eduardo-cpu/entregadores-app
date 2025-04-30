import axios from 'axios';

// Detectar ambiente automaticamente
const isProduction = window.location.hostname !== "localhost";

// URL da API no Render
const PRODUCTION_API_URL = "https://entregadores-app.onrender.com/api";

// Configuração do cliente axios
const api = axios.create({
  baseURL: isProduction 
    ? PRODUCTION_API_URL 
    : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  // Aumentar timeout para evitar erros com servidores lentos
  timeout: 30000
});

// Adicionar log para debug
console.log('API URL:', isProduction ? PRODUCTION_API_URL : 'http://localhost:5000/api');
console.log('Ambiente:', isProduction ? 'Produção' : 'Desenvolvimento');

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
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
      const response = await api.post('/entregadores/login', { email, senha });
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
      const response = await api.post('/entregadores/registro', entregadorData);
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
    const response = await api.post('/clientes', clienteData);
    return response.data;
  },
  
  listarClientes: async (filtros = {}) => {
    const response = await api.get('/clientes', { params: filtros });
    return response.data;
  },
  
  obterCliente: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },
  
  confirmarCliente: async (id) => {
    const response = await api.post(`/clientes/${id}/confirmar`);
    return response.data;
  }
};

// Funções de reclamações
export const reclamacaoService = {
  cadastrarReclamacao: async (reclamacaoData) => {
    const response = await api.post('/reclamacoes', reclamacaoData);
    return response.data;
  },
  
  listarReclamacoes: async (filtros = {}) => {
    const response = await api.get('/reclamacoes', { params: filtros });
    return response.data;
  },
  
  obterReclamacao: async (id) => {
    const response = await api.get(`/reclamacoes/${id}`);
    return response.data;
  },
  
  atualizarStatus: async (id, status) => {
    const response = await api.put(`/reclamacoes/${id}/status`, { status });
    return response.data;
  }
};

export default api;