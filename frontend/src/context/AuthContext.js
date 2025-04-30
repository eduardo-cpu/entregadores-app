import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [entregador, setEntregador] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const carregarUsuario = () => {
      const usuarioSalvo = authService.getCurrentUser();
      if (usuarioSalvo) {
        setEntregador(usuarioSalvo);
      }
      setLoading(false);
    };
    
    carregarUsuario();
  }, []);
  
  const login = async (email, senha) => {
    try {
      console.log('Tentando login com:', { email });
      const data = await authService.login(email, senha);
      console.log('Resposta de login:', data);
      setEntregador(data.entregador);
      return { sucesso: true };
    } catch (error) {
      console.error('Erro detalhado no login:', error);
      // Exibe informações mais detalhadas sobre o erro
      return {
        sucesso: false,
        mensagem: error.response?.data?.erro || 'Erro ao fazer login. Verifique suas credenciais e tente novamente.',
        detalhes: error.message
      };
    }
  };
  
  const registro = async (dadosEntregador) => {
    try {
      const data = await authService.registro(dadosEntregador);
      setEntregador(data.entregador);
      return { sucesso: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      return {
        sucesso: false,
        mensagem: error.response?.data?.erro || 'Erro ao criar conta',
        detalhes: error.message
      };
    }
  };
  
  const logout = () => {
    authService.logout();
    setEntregador(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        entregador,
        isAuthenticated: !!entregador,
        loading,
        login,
        registro,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;