# SeguroEntrega - Plataforma para Registro de Clientes Fraudulentos

SeguroEntrega é uma plataforma web que permite que entregadores de qualquer empresa cadastrem e consultem informações sobre clientes que têm histórico de reclamações fraudulentas sobre não recebimento de pacotes.

## Funcionalidades

- Cadastro e login de entregadores
- Registro de clientes fraudulentos com detalhes de endereço e descrição da fraude
- Confirmação de fraudes por outros entregadores
- Registro de reclamações específicas com evidências
- Consulta de banco de dados de clientes problemáticos

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Backend**: API RESTful desenvolvida com Node.js, Express e MongoDB
- **Frontend**: Interface web desenvolvida com React, React Bootstrap e FontAwesome

## Pré-requisitos

- Node.js (v14 ou superior)
- MongoDB
- NPM ou Yarn

## Configuração e Execução

### Backend

1. Navegue até a pasta do backend:
   ```
   cd entregadores-app/backend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente (já existe um arquivo `.env` com configurações básicas)

4. Inicie o servidor:
   ```
   npm start
   ```

O servidor backend estará rodando na porta 5000.

### Frontend

1. Navegue até a pasta do frontend:
   ```
   cd entregadores-app/frontend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Inicie a aplicação React:
   ```
   npm start
   ```

A aplicação frontend estará rodando na porta 3000.

## Tecnologias Utilizadas

### Backend
- Node.js e Express
- MongoDB e Mongoose
- JWT para autenticação
- bcryptjs para criptografia de senhas

### Frontend
- React.js
- React Router para navegação
- Context API para gerenciamento de estado
- React Bootstrap para componentes de UI
- FontAwesome para ícones
- Axios para requisições HTTP

## Segurança

A aplicação implementa diversos mecanismos de segurança:

- Autenticação com tokens JWT
- Senhas armazenadas de forma criptografada
- Validação de dados em ambos frontend e backend
- Proteção de rotas privadas

## Próximos Passos

- Implementar mais filtros na busca de clientes
- Adicionar sistema de notificações para entregadores
- Implementar upload de imagens e documentos como evidências
- Adicionar estatísticas e dashboards mais detalhados