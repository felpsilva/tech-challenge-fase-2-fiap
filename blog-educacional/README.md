# Blog Educacional — Tech Challenge FIAP (Fase 2)

Aplicação de blog educacional composta por **API (Fastify + TypeORM)** e
**PostgreSQL**, toda orquestrada com Docker Compose.

## Arquitetura — separação de containers

O projeto usa **2 containers**, cada um com uma responsabilidade única:

| Container  | Imagem            | Papel                                                | Porta (host) |
| ---------- | ----------------- | ---------------------------------------------------- | ------------ |
| `db`       | `postgres:16`     | Persistência dos dados (banco relacional)            | 5432         |
| `backend`  | build `./backend` | API REST — regras de negócio, acesso ao banco        | 3001         |

### Por que essa separação faz sentido neste contexto?

- **Responsabilidade única / escalabilidade independente.** Banco e API
  evoluem e escalam separadamente sem tocar no banco.
- **Banco isolado com volume próprio (`pgdata`).** Os dados sobrevivem a
  rebuilds/recriações dos containers de aplicação. O ciclo de vida do dado é
  separado do ciclo de vida do código.
```
┌────────────┐      ┌────────────┐
│     db     │      │  backend   │
│ PostgreSQL │◀─────│  Fastify   │
│  :5432     │      │  :3001     │
└────────────┘      └────────────┘
       ▲ volume pgdata   ▲ REST
```

## Como subir a aplicação

Pré-requisito: Docker + Docker Compose.

```bash
docker compose up --build
```

Acesse:

- **API:** http://localhost:3001
- **Banco:** localhost:5432 (usuário/senha/banco: `blog`)

Para rodar em segundo plano: `docker compose up --build -d`
Para derrubar: `docker compose down` (use `-v` para apagar também o banco).

## Dados de demonstração (seed)

Na **primeira** subida, o `db/init.sql` cria o schema e popula dados de
exemplo (só roda com o volume vazio):

- Usuário: **admin** · senha: **admin123** (permissão `admin`)
- Categorias: Matemática, Ciências, História
- Uma publicação de boas-vindas

Para recriar o seed do zero: `docker compose down -v && docker compose up --build`.

## Estrutura

```
.
├── docker-compose.yml      # orquestra db + backend
├── db/
│   └── init.sql            # schema + seed (TypeORM não usa synchronize)
└── backend/                # API Fastify + TypeORM (Dockerfile próprio)
```

## Observações técnicas

- O backend roda o TypeScript diretamente via `tsx` (sem etapa de build).
- O TypeORM **não** usa `synchronize`; por isso o schema é criado pelo
  `db/init.sql` na inicialização do Postgres.
