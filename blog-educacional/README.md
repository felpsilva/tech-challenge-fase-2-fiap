# Blog Educacional — Tech Challenge FIAP (Fase 2)

Aplicação de blog educacional composta por **API (Fastify + TypeORM)** com
**PostgreSQL no Neon (remoto)**, orquestrada com Docker Compose.

## Arquitetura — separação de containers

O projeto usa **2 containers**, cada um com uma responsabilidade única:

| Container   | Imagem              | Papel                                                         | Porta (host) |
| ----------- | ------------------- | ------------------------------------------------------------- | ------------ |
| `neon-init` | `postgres:16-alpine`| Bootstrap idempotente do schema/seed no Neon via `db/init.sql`| -            |
| `backend`   | build `./backend`   | API REST — regras de negócio e acesso ao Neon                 | 3001         |

### Por que essa separação faz sentido neste contexto?

- **Banco gerenciado no Neon.** Não há container local de banco para manter.
- **Bootstrap automático.** O container `neon-init` aplica `db/init.sql` antes
  do backend subir, evitando erro de tabela inexistente em ambiente novo.
```
┌────────────┐       ┌────────────┐
│ neon-init  │─────> │  backend   │
│ aplica SQL │       │  Fastify   │
└────────────┘       │  :3001     │
         ^           └────────────┘
         └──────> Neon PostgreSQL remoto
```

## Como subir a aplicação

Pré-requisito: Docker + Docker Compose.

```bash
docker compose up --build
```

Acesse:

- **API:** http://localhost:3001

Para rodar em segundo plano: `docker compose up --build -d`
Para derrubar: `docker compose down`.

## Produção

A API também está publicada em produção no Render, consumindo a imagem do backend
publicada no Docker Hub.
- **URL do imagem no Docker Hub:** https://hub.docker.com/repository/docker/fpsilva777/blog-educacional-backend/tags

- **URL da API em produção:** https://blog-educacional-backend-1.onrender.com/

Sobre atualizações em produção: o deploy é feito no github, o workflow encaminha para a imagem do Docker Hub, e o Render puxa a imagem,
porém, o Render não atualiza automaticamente a imagem, então é necessário ir no painel do Render e clicar em "Manual Deploy" para atualizar a imagem.

## Guia de uso da API

### Base URL

- **Local:** http://localhost:3001
- **Produção:** https://blog-educacional-backend-1.onrender.com/

### Autenticação

A API usa JWT. Para acessar rotas protegidas, faça `POST /user/signin` e envie o
token retornado no header `Authorization` no formato:

```http
Authorization: Bearer <token>
```

### Perfis de acesso

- `admin`: acesso administrativo completo.
- `professor`: pode criar, listar, atualizar e remover categorias e posts.
- `aluno`: pode consultar posts publicados.

### Rotas principais

- `POST /user/signin`: autentica e retorna o token JWT.
- `POST /user`: cria usuário novo, restrito a `admin`.
- `POST /category`: cria categoria, restrito a `admin` e `professor`.
- `POST /post`: cria publicação, restrito a `admin` e `professor`.
- `GET /post` e `GET /post/:id`: consulta posts, liberado para `admin`, `professor` e `aluno`.
- `GET /category`, `GET /category/:id`, `PUT` e `DELETE` das categorias: restrito a `admin` e `professor`.

### Exemplos de payload

#### POST /user/signin

```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### POST /user

```json
{
  "username": "admin",
  "password": "admin123",
  "permission": "admin"
}
```

#### POST /category

```json
{
  "name": "Matemática",
  "slug": "matematica"
}
```

#### POST /post

```json
{
  "user_id": 1,
  "title": "Primeiro post",
  "slug": "primeiro-post",
  "content": "Conteúdo de exemplo da publicação.",
  "image_url": "https://exemplo.com/imagem.png",
  "status": "published",
  "categories": [
    {
      "id": 1,
      "name": "Matemática",
      "slug": "matematica"
    }
  ]
}
```

### Exemplos de chamada

```bash
curl -X POST http://localhost:3001/user/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

```bash
curl -X POST http://localhost:3001/category \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Matemática","slug":"matematica"}'
```

```bash
curl -X POST http://localhost:3001/post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"user_id":1,"title":"Primeiro post","slug":"primeiro-post","content":"Conteúdo de exemplo da publicação.","status":"published","categories":[{"id":1,"name":"Matemática","slug":"matematica"}]}'
```

## Dados de demonstração (seed)

Na subida, o `db/init.sql` cria o schema e popula dados de exemplo no Neon.
Como o script é idempotente (`IF NOT EXISTS` e `ON CONFLICT`), ele pode rodar
em toda inicialização sem duplicar estrutura/dados sensíveis:

- Usuário: **admin** · senha: **admin123** (permissão `admin`)

Para reaplicar o bootstrap: `docker compose up --build`.

## Estrutura

```
.
├── docker-compose.yml      # orquestra neon-init + backend
├── db/
│   └── init.sql            # schema + seed (TypeORM)
└── backend/                # API Fastify + TypeORM (Dockerfile próprio)
```

## Observações técnicas

- O backend roda o TypeScript diretamente via `tsx` (sem etapa de build).
