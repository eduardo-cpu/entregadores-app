import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faExclamationTriangle, faEye } from '@fortawesome/free-solid-svg-icons';
import { clienteService } from '../services/api';

const ListarClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtros, setFiltros] = useState({
    nome: '',
    cpf: '',
    cidade: '',
    limite: 10,
    pagina: 1
  });
  const [paginacao, setPaginacao] = useState({
    total: 0,
    totalPaginas: 0,
    paginaAtual: 1
  });

  // Função para carregar os clientes
  const carregarClientes = async (pagina = 1) => {
    try {
      setLoading(true);
      setErro('');
      
      const params = { ...filtros, pagina };
      const response = await clienteService.listarClientes(params);
      
      setClientes(response.clientes || []);
      setPaginacao({
        total: response.total || 0,
        totalPaginas: response.totalPaginas || 0,
        paginaAtual: pagina
      });
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setErro('Falha ao carregar a lista de clientes. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar clientes quando o componente montar
  useEffect(() => {
    carregarClientes();
  }, []);

  // Função para manipular a mudança na paginação
  const handlePaginaChange = (novaPagina) => {
    if (novaPagina < 1 || novaPagina > paginacao.totalPaginas) {
      return;
    }
    
    carregarClientes(novaPagina);
  };

  // Função para manipular o envio do formulário de filtro
  const handleFiltroSubmit = (e) => {
    e.preventDefault();
    carregarClientes(1);
  };

  // Função para manipular a mudança nos campos de filtro
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" />
            Clientes Fraudulentos
          </h2>
          <p className="text-muted">
            Lista de clientes cadastrados com histórico de fraudes em entregas.
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Form onSubmit={handleFiltroSubmit}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formNome">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por nome"
                        name="nome"
                        value={filtros.nome}
                        onChange={handleFiltroChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formCPF">
                      <Form.Label>CPF</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por CPF"
                        name="cpf"
                        value={filtros.cpf}
                        onChange={handleFiltroChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formCidade">
                      <Form.Label>Cidade</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por cidade"
                        name="cidade"
                        value={filtros.cidade}
                        onChange={handleFiltroChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit">
                    <FontAwesomeIcon icon={faSearch} className="me-2" />
                    Buscar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {erro && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{erro}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Carregando clientes...</p>
                </div>
              ) : clientes.length === 0 ? (
                <Alert variant="info">
                  Nenhum cliente encontrado com os filtros selecionados.
                </Alert>
              ) : (
                <>
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Localização</th>
                        <th>Confirmações</th>
                        <th>Cadastrado por</th>
                        <th>Data</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.map((cliente) => (
                        <tr key={cliente._id}>
                          <td>
                            <FontAwesomeIcon icon={faUser} className="text-muted me-2" />
                            {cliente.nome}
                          </td>
                          <td>
                            {cliente.endereco?.cidade ? 
                              `${cliente.endereco.cidade}, ${cliente.endereco.estado}` : 
                              'Local não informado'}
                          </td>
                          <td>
                            <span className="badge bg-warning">
                              {cliente.confirmacoes?.length || 0} confirmações
                            </span>
                          </td>
                          <td>{cliente.cadastradoPor?.empresa || 'N/A'}</td>
                          <td>
                            {new Date(cliente.dataCadastro).toLocaleDateString()}
                          </td>
                          <td>
                            <Link to={`/clientes/${cliente._id}`}>
                              <Button variant="outline-info" size="sm">
                                <FontAwesomeIcon icon={faEye} className="me-1" />
                                Detalhes
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {/* Paginação */}
                  {paginacao.totalPaginas > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                      <Button
                        variant="outline-secondary"
                        className="mx-1"
                        disabled={paginacao.paginaAtual === 1}
                        onClick={() => handlePaginaChange(paginacao.paginaAtual - 1)}
                      >
                        Anterior
                      </Button>
                      
                      {[...Array(paginacao.totalPaginas).keys()].map(num => (
                        <Button
                          key={num + 1}
                          variant={paginacao.paginaAtual === num + 1 ? "primary" : "outline-primary"}
                          className="mx-1"
                          onClick={() => handlePaginaChange(num + 1)}
                        >
                          {num + 1}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline-secondary"
                        className="mx-1"
                        disabled={paginacao.paginaAtual === paginacao.totalPaginas}
                        onClick={() => handlePaginaChange(paginacao.paginaAtual + 1)}
                      >
                        Próxima
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ListarClientes;