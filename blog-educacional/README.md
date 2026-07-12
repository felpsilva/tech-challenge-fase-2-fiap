# Blog Educacional — Tech Challenge FIAP (Fase 2)

Aplicação de blog educacional composta por **API (Fastify + TypeORM)** com
**PostgreSQL no Neon (remoto)**, orquestrada com Docker Compose.

## Arquitetura — separação de containers

O projeto usa **2 containers**, cada um com uma responsabilidade única:

| Container   | Imagem              | Papel                                                         | Porta (host) |
| ----------- | ------------------- | ------------------------------------------------------------- | ------------ |
| `neon-init` | `postgres:16-alpine`| Bootstrap idempotente do schema/seed no Neon via `db/init.sql` | -            |
| `backend`   | build `./backend`   | API REST — regras de negócio e acesso ao Neon                 | 3001         |

### Por que essa separação faz sentido neste contexto?

- **Banco gerenciado no Neon.** Não há container local de banco para manter.
- **Bootstrap automático.** O container `neon-init` aplica `db/init.sql` antes
  do backend subir, evitando erro de tabela inexistente em ambiente novo.
```
┌────────────┐       ┌────────────┐
│ neon-init  │──────▶│  backend   │
│ aplica SQL │       │  Fastify   │
└────────────┘       │  :3001     │
         ▲           └────────────┘
         └──────▶ Neon PostgreSQL remoto
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

## Dados de demonstração (seed)

Na subida, o `db/init.sql` cria o schema e popula dados de exemplo no Neon.
Como o script é idempotente (`IF NOT EXISTS` e `ON CONFLICT`), ele pode rodar
em toda inicialização sem duplicar estrutura/dados sensíveis:

- Usuário: **admin** · senha: **admin123** (permissão `admin`)
- Categorias: Matemática, Ciências, História
- Uma publicação de boas-vindas

Para reaplicar o bootstrap: `docker compose up --build`.

## Estrutura

```
.
├── docker-compose.yml      # orquestra neon-init + backend
├── db/
│   └── init.sql            # schema + seed (TypeORM não usa synchronize)
└── backend/                # API Fastify + TypeORM (Dockerfile próprio)
```

## Observações técnicas

- O backend roda o TypeScript diretamente via `tsx` (sem etapa de build).
- O TypeORM **não** usa `synchronize`; por isso o schema é criado pelo
  `db/init.sql` na etapa `neon-init`.
