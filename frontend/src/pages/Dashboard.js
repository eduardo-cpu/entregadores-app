import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faExclamationTriangle, faUserPlus, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { clienteService, reclamacaoService } from '../services/api';

const Dashboard = () => {
  const { entregador } = useAuth();
  const [estatisticas, setEstatisticas] = useState({
    totalClientes: 0,
    totalReclamacoes: 0,
    carregando: true,
    erro: null
  });

  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        // Buscar clientes cadastrados pelo entregador
        const clientesResponse = await clienteService.listarClientes();
        
        // Buscar reclamações registradas pelo entregador
        const reclamacoesResponse = await reclamacaoService.listarReclamacoes();
        
        setEstatisticas({
          totalClientes: clientesResponse.total || 0,
          totalReclamacoes: reclamacoesResponse.total || 0,
          carregando: false,
          erro: null
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        setEstatisticas({
          ...estatisticas,
          carregando: false,
          erro: 'Erro ao carregar estatísticas. Por favor, tente novamente.'
        });
      }
    };

    carregarEstatisticas();
  }, []);

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            Dashboard
          </h2>
          <p className="text-muted">
            Bem-vindo, {entregador?.nome}! Gerencie os registros de clientes fraudulentos e reclamações.
          </p>
          {estatisticas.erro && <Alert variant="danger">{estatisticas.erro}</Alert>}
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <FontAwesomeIcon icon={faUsers} size="3x" className="text-primary mb-3" />
                <h5>Clientes Fraudulentos</h5>
                <h2>{estatisticas.carregando ? '...' : estatisticas.totalClientes}</h2>
              </div>
              <p className="text-muted">
                Gerencie a lista de clientes com histórico de reclamações fraudulentas.
              </p>
              <div className="mt-auto">
                <Link to="/clientes">
                  <Button variant="outline-primary" className="w-100">
                    Ver Clientes
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-warning mb-3" />
                <h5>Reclamações</h5>
                <h2>{estatisticas.carregando ? '...' : estatisticas.totalReclamacoes}</h2>
              </div>
              <p className="text-muted">
                Visualize e gerencie reclamações de entregas não recebidas.
              </p>
              <div className="mt-auto">
                <Link to="/reclamacoes">
                  <Button variant="outline-warning" className="w-100">
                    Ver Reclamações
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <FontAwesomeIcon icon={faUserPlus} size="3x" className="text-success mb-3" />
                <h5>Cadastrar Cliente</h5>
                <p>Registre um novo cliente com histórico de fraudes</p>
              </div>
              <p className="text-muted">
                Adicione novos clientes à base de dados para alertar outros entregadores.
              </p>
              <div className="mt-auto">
                <Link to="/cadastrar-cliente">
                  <Button variant="outline-success" className="w-100">
                    Novo Cadastro
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h5">Sobre o SeguroEntrega</Card.Header>
            <Card.Body>
              <Card.Text>
                Esta plataforma permite que entregadores de qualquer empresa cadastrem e consultem informações sobre 
                clientes que têm histórico de reclamações fraudulentas sobre não terem recebido pacotes.
              </Card.Text>
              <Card.Text>
                Ao compartilhar estas informações, podemos criar uma comunidade mais segura para todos os profissionais de entrega.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;