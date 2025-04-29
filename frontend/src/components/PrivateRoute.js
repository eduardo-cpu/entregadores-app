import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Se estiver carregando, não renderiza nada
  if (loading) {
    return <div className="d-flex justify-content-center mt-5">Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;