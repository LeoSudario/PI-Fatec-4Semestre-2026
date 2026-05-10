# Gym & Client Management App

Repositório do Grupo 07 — Projeto Interdisciplinar DSM (3º semestre, 2025/2)  
Alunos: Juliano Ferreira, Noel Lemos, Leonardo Sudário, Delfino de Oliveira Flávio, Roberta Carreira Barcarollo.  
Descrição curta: Aplicação full‑stack para gerenciamento de academias e clientes com autenticação, check‑in/check‑out e API protegida.

---

[🎬 Elevator Pitch — Assista aqui](https://youtu.be/smQMLMZb7UY)

Resumo rápido: plataforma web para cadastrar academias, registrar entrada/saída de clientes, controlar ocupação e gerenciar usuários com segurança (JWT + hashing de senhas).

---

## Principais funcionalidades

- Autenticação de usuários (signup / login) com JWT e senha hashed (bcryptjs).
- Cadastro, listagem e remoção de academias (gyms).
- Check‑in (registro de cliente) e check‑out.
- Controle de ocupação por academia.
- Endpoints protegidos por middleware de autenticação.

---

## Tech Stack

- Frontend: React.js (JavaScript, HTML, CSS)
- Backend: Node.js + Express
- Banco de dados: MongoDB (Mongoose)
- Autenticação: JWT, bcryptjs

Linguagens no repositório: JavaScript (≈87.7%), CSS (≈9%), HTML (≈3.3%).

---

## Demonstração rápida

- Backend padrão: http://localhost:5000
- Frontend padrão: http://localhost:3000

(Se você hospedar ou usar Docker, atualize os links / variáveis de ambiente.)

---

## Instalação (local)

Pré‑requisitos:

- Node.js (recomendo >= 18)
- npm ou yarn
- MongoDB (localmente ou Atlas)

1. Clone

```bash
git clone https://github.com/FatecFranca/DSM-P3-G07-2025-2.git
cd DSM-P3-G07-2025-2
```

2. Backend

```bash
cd backend
npm install
cp .env.example .env   # ajustar variáveis
npm run dev            # ou: node server.js
```

3. Frontend

```bash
cd frontend
npm install
npm start
```

Usando Docker (opcional):

```bash
docker compose up --build
```

---

## Exemplo .env (ajuste conforme implementação)

```
# Backend
PORT=5000
MONGO_URI=mongodb://localhost:27017/gymdb
JWT_SECRET=uma_chave_super_secreta
TOKEN_EXPIRES_IN=1d

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

Nunca comite o arquivo `.env` real.

---

## Endpoints (resumo)

Autenticação

- POST /signup
  - Body: { "username", "password" }
- POST /login
  - Body: { "username", "password" }
  - Retorna: { "token": "JWT_TOKEN" }

Gyms (protegido — Authorization: Bearer TOKEN)

- GET /gyms
- POST /gyms
  - Body: { "name", "address", "phone", "capacity" }
- DELETE /gyms/:id

Clients (protegido)

- GET /clients
- POST /clients
  - Body: { "name", "email", "phone", "gymName" } // check-in
- POST /clients/checkout
  - Body: { "name", "gymName" } // check-out

Exemplo de chamada protegida:

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/gyms
```

(Revisar e documentar rotas completas no código / Swagger / Postman collection.)

---

## Estrutura do projeto (resumida)

```
backend/
  server.js
  routes/
  controllers/
  models/
  middlewares/
  package.json

frontend/
  src/
    components/
    pages/
    services/   # api client (axios/fetch)
    App.js
  package.json

docs/
  elevator-pitch.pdf (opcional)
.env.example
README.md
```

---

## Testes e qualidade

- Rodar testes unitários (se configurado): `npm test` (backend/frontend conforme pasta)
- Linter: configure ESLint + Prettier
- Recomendações: cobertura mínima para regras de negócio (check-in, ocupação), testes e2e (Cypress/Playwright)

---

## Boas práticas de segurança

- Não salvar JWT permanentemente sem expiração adequada.
- Hashear senhas (bcrypt/argon2).
- Validar/identificar duplicidade no check‑in.
- Validar limites de capacidade da academia antes do check‑in.
- Sanitizar entradas (proteção a XSS/NoSQL injection).
- Rate limit em endpoints sensíveis (ex.: login).

---

## Fluxos críticos a testar manualmente

- Cadastro de usuário / login / renovação de token
- Cadastro de academia e verificação de capacidade
- Check‑in de clientes (quando capacidade atingida recusar)
- Check‑out de clientes (atualizar ocupação)
- Remoção de academia com clientes associados (política: impedir / migrar / remover)

---

## Sugestões de melhorias futuras

- Dashboard com gráficos de ocupação (Chart.js / Recharts)
- Notificações em tempo real (WebSockets) para ocupação
- Exportar relatórios (CSV / PDF)
- Controle de permissões (roles: admin, staff)
- Integração contínua (GitHub Actions) + deploy automático
- Containerização completa e infra como código

---

## Contribuição

1. Abra uma issue descrevendo a proposta.
2. Crie branch com nome `feat/<nome>` ou `fix/<nome>`.
3. Faça PR com descrição, prints, e testes.
4. Use conventional commits.

---

## Licença

MIT.
