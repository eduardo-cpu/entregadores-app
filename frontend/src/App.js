import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Importar páginas
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import CadastrarCliente from './pages/CadastrarCliente';
import ListarClientes from './pages/ListarClientes';
import DetalhesCliente from './pages/DetalhesCliente';

// Importar componentes
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

// Importar estilos do Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente para redirecionar com base na autenticação
const RedirectBasedOnAuth = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="pb-5">
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<RedirectBasedOnAuth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              
              {/* Rotas privadas */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cadastrar-cliente" element={<CadastrarCliente />} />
                <Route path="/clientes" element={<ListarClientes />} />
                <Route path="/clientes/:id" element={<DetalhesCliente />} />
                {/* Outras rotas protegidas serão adicionadas aqui */}
              </Route>
            </Routes>
          </div>
          <footer className="bg-dark text-white text-center py-3 fixed-bottom">
            <div className="container">
              <p className="mb-0">SeguroEntrega &copy; {new Date().getFullYear()} - Proteção para Entregadores</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
