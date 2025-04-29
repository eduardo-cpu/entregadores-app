import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faSignOutAlt, faListAlt, faExclamationTriangle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const NavbarComponent = () => {
  const { entregador, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to={isAuthenticated ? "/dashboard" : "/"}>
          <FontAwesomeIcon icon={faUserShield} className="me-2" />
          SeguroEntrega
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/clientes">
                  <FontAwesomeIcon icon={faListAlt} className="me-1" />
                  Clientes Fraudulentos
                </Nav.Link>
                <Nav.Link as={Link} to="/cadastrar-cliente">
                  <FontAwesomeIcon icon={faUserPlus} className="me-1" />
                  Cadastrar Cliente
                </Nav.Link>
                <Nav.Link as={Link} to="/reclamacoes">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                  Reclamações
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  Olá, {entregador?.nome} ({entregador?.empresa})
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/registro">Cadastrar</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;