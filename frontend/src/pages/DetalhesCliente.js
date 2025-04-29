import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Spinner, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faPhone, faEnvelope, faExclamationTriangle, faCalendarAlt, faCheckCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { clienteService } from '../services/api';

const DetalhesCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [confirmarLoading, setConfirmarLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    const carregarCliente = async () => {
      try {
        setLoading(true);
        setErro('');
        
        const response = await clienteService.obterCliente(id);
        setCliente(response.cliente);
      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
        setErro('Não foi possível carregar os detalhes do cliente. Verifique se o ID está correto.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      carregarCliente();
    }
  }, [id]);

  const handleConfirmar = async () => {
    try {
      setConfirmarLoading(true);
      setErro('');
      setMensagemSucesso('');
      
      const response = await clienteService.confirmarCliente(id);
      
      setMensagemSucesso('Cliente fraudulento confirmado com sucesso!');
      
      // Atualizar os dados do cliente
      setCliente(response.cliente);
    } catch (error) {
      console.error('Erro ao confirmar cliente:', error);
      setErro(error.response?.data?.erro || 'Erro ao confirmar cliente fraudulento.');
    } finally {
      setConfirmarLoading(false);
    }
  };

  const formatarEndereco = (endereco) => {
    if (!endereco) return 'Endereço não informado';
    
    const partes = [];
    if (endereco.rua) partes.push(endereco.rua);
    if (endereco.numero) partes.push(endereco.numero);
    if (endereco.complemento) partes.push(endereco.complemento);
    if (endereco.bairro) partes.push(endereco.bairro);
    if (endereco.cidade) partes.push(endereco.cidade);
    if (endereco.estado) partes.push(endereco.estado);
    if (endereco.cep) partes.push(`CEP: ${endereco.cep}`);
    
    return partes.join(', ');
  };

  const jaConfirmou = cliente?.confirmacoes?.some(
    confirmacao => confirmacao.entregador === localStorage.getItem('entregadorId')
  );

  return (
    <Container>
      <div className="mb-4">
        <Button variant="outline-secondary" onClick={() => navigate('/clientes')}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Voltar para lista
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Carregando detalhes do cliente...</p>
        </div>
      ) : erro ? (
        <Alert variant="danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {erro}
        </Alert>
      ) : cliente ? (
        <>
          {mensagemSucesso && (
            <Alert variant="success" className="mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
              {mensagemSucesso}
            </Alert>
          )}

          <Row>
            <Col md={8}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-dark text-white">
                  <h3>
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    {cliente.nome}
                  </h3>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={6}>
                      <p className="mb-2">
                        <strong><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />Endereço:</strong>
                      </p>
                      <p>{formatarEndereco(cliente.endereco)}</p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong><FontAwesomeIcon icon={faPhone} className="me-2" />Telefone:</strong>
                      </p>
                      <p>{cliente.telefone || 'Não informado'}</p>
                      <p className="mb-2">
                        <strong><FontAwesomeIcon icon={faEnvelope} className="me-2" />Email:</strong>
                      </p>
                      <p>{cliente.email || 'Não informado'}</p>
                    </Col>
                  </Row>

                  <div className="mb-4">
                    <h5>Descrição da Fraude:</h5>
                    <Card className="bg-light">
                      <Card.Body>
                        <p>{cliente.descricaoFraude}</p>
                      </Card.Body>
                    </Card>
                  </div>

                  <div>
                    <p className="mb-2">
                      <strong><FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Data de Cadastro:</strong>
                    </p>
                    <p>{new Date(cliente.dataCadastro).toLocaleDateString()} - {new Date(cliente.dataCadastro).toLocaleTimeString()}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-warning text-white">
                  <h4>Confirmações</h4>
                </Card.Header>
                <Card.Body>
                  <p className="mb-4">
                    <Badge bg="warning" className="p-2">
                      <h5 className="mb-0">{cliente.confirmacoes?.length || 0} Confirmações</h5>
                    </Badge>
                  </p>
                  
                  {!jaConfirmou ? (
                    <div className="d-grid">
                      <Button 
                        variant="danger" 
                        onClick={handleConfirmar} 
                        disabled={confirmarLoading}
                      >
                        {confirmarLoading ? 'Processando...' : 'Confirmar Cliente Fraudulento'}
                      </Button>
                      <small className="text-muted mt-2 text-center">
                        Ao confirmar, você atesta que também teve problemas com este cliente.
                      </small>
                    </div>
                  ) : (
                    <Alert variant="success">
                      <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                      Você já confirmou este cliente como fraudulento.
                    </Alert>
                  )}
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Header>
                  <h4>Confirmado por:</h4>
                </Card.Header>
                <Card.Body>
                  {cliente.confirmacoes && cliente.confirmacoes.length > 0 ? (
                    <ListGroup variant="flush">
                      {cliente.confirmacoes.map((confirmacao, index) => (
                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                          <div>
                            <FontAwesomeIcon icon={faUser} className="me-2 text-muted" />
                            {confirmacao.entregador?.nome || 'Entregador'}
                          </div>
                          <small className="text-muted">
                            {new Date(confirmacao.data).toLocaleDateString()}
                          </small>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p className="text-center text-muted">
                      Apenas o cadastrador original
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Alert variant="warning">
          Cliente não encontrado
        </Alert>
      )}
    </Container>
  );
};

export default DetalhesCliente;