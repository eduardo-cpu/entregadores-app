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
      const data = await authService.login(email, senha);
      setEntregador(data.entregador);
      return { sucesso: true };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: error.response?.data?.erro || 'Erro ao fazer login'
      };
    }
  };
  
  const registro = async (dadosEntregador) => {
    try {
      const data = await authService.registro(dadosEntregador);
      setEntregador(data.entregador);
      return { sucesso: true };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: error.response?.data?.erro || 'Erro ao criar conta'
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