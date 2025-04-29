# Correção do erro 404 no Vercel

## Problema
O frontend quando hospedado no Vercel está tentando acessar a API em `localhost:5000`, que não está acessível a partir da nuvem, resultando em erros 404 ao carregar recursos.

## Solução
Atualize o arquivo `frontend/src/services/api.js` com o seguinte código que detecta automaticamente se está em ambiente de produção e usa a URL correta:

```javascript
import axios from 'axios';

// Detectar ambiente automaticamente
const isProduction = window.location.hostname !== "localhost";

// URL da API em produção - substitua pelo endpoint real do seu backend hospedado
const PRODUCTION_API_URL = "https://seguroentrega-api.onrender.com/api";

// Configuração do cliente axios
const api = axios.create({
  baseURL: isProduction 
    ? PRODUCTION_API_URL 
    : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Adicionar log para debug
console.log('API URL:', isProduction ? PRODUCTION_API_URL : 'http://localhost:5000/api');
console.log('Ambiente:', isProduction ? 'Produção' : 'Desenvolvimento');

// O restante do código permanece inalterado
```

## Próximos passos
1. Aplique as alterações acima no arquivo `api.js`
2. Hospede o backend em um serviço como Render, Heroku ou similar
3. Atualize a constante `PRODUCTION_API_URL` para apontar para seu backend hospedado
4. No backend, configure CORS para permitir requisições do seu domínio no Vercel

## Observação
As variáveis de ambiente no React precisam ter o prefixo `REACT_APP_` e são injetadas durante o build, não em runtime. A abordagem acima é mais robusta por não depender de variáveis de ambiente.
