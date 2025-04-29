import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserShield } from '@fortawesome/free-solid-svg-icons';

const Registro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    empresa: '',
    telefone: ''
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { registro } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { nome, email, senha, confirmarSenha, empresa, telefone } = formData;
    
    // Validações básicas
    if (!nome || !email || !senha || !confirmarSenha || !empresa) {
      return setErro('Por favor, preencha todos os campos obrigatórios');
    }
    
    if (senha !== confirmarSenha) {
      return setErro('As senhas não coincidem');
    }
    
    if (senha.length < 6) {
      return setErro('A senha deve ter pelo menos 6 caracteres');
    }
    
    try {
      setErro('');
      setCarregando(true);
      
      const resultado = await registro({
        nome,
        email,
        senha,
        empresa,
        telefone
      });
      
      if (resultado.sucesso) {
        navigate('/dashboard');
      } else {
        setErro(resultado.mensagem || 'Falha ao criar conta');
      }
    } catch (error) {
      setErro('Erro ao criar conta. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <FontAwesomeIcon icon={faUserShield} size="3x" className="text-primary mb-3" />
                <h2>Cadastro de Entregador</h2>
                <p className="text-muted">Crie sua conta para começar a registrar clientes fraudulentos</p>
              </div>
              
              {erro && <Alert variant="danger">{erro}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formNome">
                      <Form.Label>Nome completo*</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome"
                        placeholder="Digite seu nome completo"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formEmpresa">
                      <Form.Label>Empresa/Transportadora*</Form.Label>
                      <Form.Control
                        type="text"
                        name="empresa"
                        placeholder="Digite o nome da sua empresa"
                        value={formData.empresa}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>Email*</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Digite seu email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formTelefone">
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefone"
                        placeholder="Digite seu telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formSenha">
                      <Form.Label>Senha*</Form.Label>
                      <Form.Control
                        type="password"
                        name="senha"
                        placeholder="Digite sua senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                      />
                      <Form.Text className="text-muted">
                        Mínimo de 6 caracteres
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formConfirmarSenha">
                      <Form.Label>Confirmar senha*</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmarSenha"
                        placeholder="Confirme sua senha"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mt-3" 
                  disabled={carregando}
                >
                  {carregando ? 'Cadastrando...' : (
                    <>
                      <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                      Cadastrar
                    </>
                  )}
                </Button>
              </Form>
              
              <div className="text-center mt-3">
                <p>
                  Já tem uma conta?{' '}
                  <Link to="/login">Faça login aqui</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Registro;