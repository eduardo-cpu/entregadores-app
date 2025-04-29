import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { clienteService } from '../services/api';

const CadastrarCliente = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    descricaoFraude: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.nome || !formData.descricaoFraude) {
      return setErro('Nome e descrição da fraude são obrigatórios');
    }

    try {
      setErro('');
      setSucesso('');
      setCarregando(true);
      
      const resposta = await clienteService.cadastrarCliente(formData);
      
      setSucesso('Cliente fraudulento registrado com sucesso!');
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        endereco: {
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: ''
        },
        descricaoFraude: ''
      });
      
      // Redirecionar para detalhes do cliente após 2 segundos
      setTimeout(() => {
        navigate(`/clientes/${resposta.cliente._id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      setErro(error.response?.data?.erro || 'Erro ao cadastrar cliente. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="text-warning me-3" />
                <div>
                  <h2>Cadastrar Cliente Fraudulento</h2>
                  <p className="text-muted mb-0">
                    Registre um cliente que abriu reclamação fraudulenta de não recebimento.
                  </p>
                </div>
              </div>
              
              {erro && <Alert variant="danger">{erro}</Alert>}
              {sucesso && <Alert variant="success">{sucesso}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <h5 className="mb-3">Dados Pessoais</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formNome">
                      <Form.Label>Nome do cliente*</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome"
                        placeholder="Nome completo do cliente"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formCPF">
                      <Form.Label>CPF</Form.Label>
                      <Form.Control
                        type="text"
                        name="cpf"
                        placeholder="CPF do cliente (somente números)"
                        value={formData.cpf}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email do cliente"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formTelefone">
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefone"
                        placeholder="Telefone do cliente"
                        value={formData.telefone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <h5 className="mb-3 mt-4">Endereço</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formRua">
                      <Form.Label>Logradouro</Form.Label>
                      <Form.Control
                        type="text"
                        name="endereco.rua"
                        placeholder="Rua, Avenida, etc."
                        value={formData.endereco.rua}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId="formNumero">
                      <Form.Label>Número</Form.Label>
                      <Form.Control
                        type="text"
                        name="endereco.numero"
                        placeholder="Número"
                        value={formData.endereco.numero}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId="formComplemento">
                      <Form.Label>Complemento</Form.Label>
                      <Form.Control
                        type="text"
                        name="endereco.complemento"
                        placeholder="Apto, Sala, etc."
                        value={formData.endereco.complemento}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formBairro">
                      <Form.Label>Bairro</Form.Label>
                      <Form.Control
                        type="text"
                        name="endereco.bairro"
                        placeholder="Bairro"
                        value={formData.endereco.bairro}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formCidade">
                      <Form.Label>Cidade</Form.Label>
                      <Form.Control
                        type="text"
                        name="endereco.cidade"
                        placeholder="Cidade"
                        value={formData.endereco.cidade}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={2}>
                    <Form.Group className="mb-3" controlId="formEstado">
                      <Form.Label>Estado</Form.Label>
                      <Form.Control
                        type="text"
                        name="endereco.estado"
                        placeholder="UF"
                        value={formData.endereco.estado}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={2}>
                    <Form.Group className="mb-3" controlId="formCEP">
                      <Form.Label>CEP</Form.Label>
                      <Form.Control
                        type="text"
                        name="endereco.cep"
                        placeholder="CEP"
                        value={formData.endereco.cep}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <h5 className="mb-3 mt-4">Detalhes da Fraude</h5>
                <Form.Group className="mb-3" controlId="formDescricaoFraude">
                  <Form.Label>Descrição da fraude*</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="descricaoFraude"
                    placeholder="Descreva detalhadamente como ocorreu a fraude (data, circunstâncias, etc.)"
                    value={formData.descricaoFraude}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="danger" 
                    type="submit" 
                    disabled={carregando}
                    className="py-2"
                  >
                    {carregando ? 'Cadastrando...' : (
                      <>
                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                        Cadastrar Cliente Fraudulento
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CadastrarCliente;