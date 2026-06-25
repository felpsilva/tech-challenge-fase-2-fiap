# Blog Educacional — Tech Challenge FIAP (Fase 2)

Aplicação de blog educacional composta por **API (Fastify + TypeORM)**,
**front-end estático (HTML/CSS/JS + Alpine.js)** e **PostgreSQL**, toda
orquestrada com Docker Compose.

## Arquitetura — separação de containers

O projeto usa **3 containers**, cada um com uma responsabilidade única:

| Container  | Imagem            | Papel                                                | Porta (host) |
| ---------- | ----------------- | ---------------------------------------------------- | ------------ |
| `db`       | `postgres:16`     | Persistência dos dados (banco relacional)            | 5432         |
| `backend`  | build `./backend` | API REST — regras de negócio, acesso ao banco        | 3001         |
| `frontend` | `nginx` + build   | Servição dos arquivos estáticos do front (SPA leve)  | 8080         |

### Por que essa separação faz sentido neste contexto?

- **Responsabilidade única / escalabilidade independente.** Banco, API e
  apresentação evoluem e escalam separadamente. Em produção, o front
  (estático) pode ser servido por uma CDN e a API escalar em mais réplicas,
  sem tocar no banco.
- **Banco isolado com volume próprio (`pgdata`).** Os dados sobrevivem a
  rebuilds/recriações dos containers de aplicação. O ciclo de vida do dado é
  separado do ciclo de vida do código.
- **Front servido por nginx**, e não por um servidor de desenvolvimento
  (como o `python -m http.server`): nginx é leve, próprio para conteúdo
  estático e o mesmo artefato vai para produção.
- **Imagens enxutas e específicas:** `node` só no backend, `nginx` só no
  front. Cada imagem carrega apenas o que precisa.

> Não faz sentido, neste porte, separar mais do que isso (ex.: um container
> por caso de uso). Três camadas — dados, aplicação e apresentação — é o
> equilíbrio certo entre clareza e simplicidade para o projeto.

```
┌────────────┐      ┌────────────┐      ┌────────────┐
│  frontend  │      │  backend   │      │     db     │
│   nginx    │      │  Fastify   │─────▶│ PostgreSQL │
│  :8080     │      │  :3001     │      │  :5432     │
└────────────┘      └────────────┘      └────────────┘
       ▲ HTML/JS           ▲ REST (CORS)        ▲ volume pgdata
       └─────── navegador do usuário ───────────┘
```

> O navegador acessa o front em `:8080` e chama a API em `:3001` diretamente
> (CORS habilitado no backend via `@fastify/cors`). Como alternativa, o nginx
> pode atuar como **proxy reverso** de `/api` para o backend — há um exemplo
> comentado em `frontend/nginx.conf` (basta então definir
> `window.API_BASE = '/api'`).

## Como subir tudo

Pré-requisito: Docker + Docker Compose.

```bash
docker compose up --build
```

Acesse:

- **Front-end:** http://localhost:8080
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
├── docker-compose.yml      # orquestra os 3 containers
├── db/
│   └── init.sql            # schema + seed (TypeORM não usa synchronize)
├── backend/                # API Fastify + TypeORM (Dockerfile próprio)
└── frontend/               # HTML/CSS/JS + Alpine.js (nginx, Dockerfile próprio)
```

## Observações técnicas

- O backend roda o TypeScript diretamente via `tsx` (sem etapa de build).
- O TypeORM **não** usa `synchronize`; por isso o schema é criado pelo
  `db/init.sql` na inicialização do Postgres.
- Detalhes do front-end e dos endpoints: veja `frontend/README.md`.
