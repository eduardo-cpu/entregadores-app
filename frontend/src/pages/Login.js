import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [detalhesErro, setDetalhesErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !senha) {
      return setErro('Por favor, preencha todos os campos');
    }
    
    try {
      setErro('');
      setDetalhesErro('');
      setCarregando(true);
      
      console.log('Enviando requisição de login');
      const resultado = await login(email, senha);
      console.log('Resultado do login:', resultado);
      
      if (resultado.sucesso) {
        console.log('Login bem-sucedido, redirecionando...');
        navigate('/dashboard');
      } else {
        console.log('Falha no login:', resultado.mensagem);
        setErro(resultado.mensagem || 'Falha ao fazer login');
        if (resultado.detalhes) {
          setDetalhesErro(`Detalhes técnicos: ${resultado.detalhes}`);
        }
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setErro('Erro inesperado ao fazer login. Por favor, tente novamente.');
      setDetalhesErro(error.message || 'Erro desconhecido');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <FontAwesomeIcon icon={faUserShield} size="3x" className="text-primary mb-3" />
                <h2>Login - SeguroEntrega</h2>
                <p className="text-muted">Acesse sua conta para gerenciar seus registros</p>
              </div>
              
              {erro && (
                <Alert variant="danger">
                  {erro}
                  {detalhesErro && (
                    <div className="mt-2 small">
                      <hr />
                      {detalhesErro}
                    </div>
                  )}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="formSenha">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3" 
                  disabled={carregando}
                >
                  {carregando ? 'Entrando...' : (
                    <>
                      <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                      Entrar
                    </>
                  )}
                </Button>
              </Form>
              
              <div className="text-center mt-3">
                <p>
                  Não tem uma conta?{' '}
                  <Link to="/registro">Cadastre-se aqui</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;