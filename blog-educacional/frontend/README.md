# Front-end — Blog Educacional

Interface web do blog, feita com **HTML + CSS + JavaScript** e
[**Alpine.js**](https://alpinejs.dev) (carregado localmente em `assets/vendor/`)
para a dinamização das páginas. Não há etapa de build.

## Páginas

| Arquivo            | Descrição                                                            |
| ------------------ | ------------------------------------------------------------------- |
| `index.html`       | **Home** — lista de publicações com busca por título/conteúdo.      |
| `post.html?id=:id` | **Post interno** — exibe uma publicação completa.                   |
| `categories.html`  | **Categorias** — lista categorias e filtra as publicações por tema. |
| `admin.html`       | **Admin** — CRUD de publicações, usuários e categorias.             |

## Como executar (Docker — recomendado)

Todo o projeto sobe com um único comando a partir da **raiz** do repositório:

```bash
docker compose up --build
```

- Front-end (nginx): http://localhost:8080
- API: http://localhost:3001
- Banco (Postgres): localhost:5432

O CORS já está habilitado no back-end (`@fastify/cors`), permitindo o acesso a
partir do front servido em outra porta. Veja detalhes no `README.md` da raiz.

## Execução avulsa (sem Docker)

Sirva os arquivos estáticos com qualquer servidor HTTP, com o back-end rodando
separadamente (`cd ../backend && npm run start:dev`):

```bash
cd frontend
npx serve -l 5500   # abra http://localhost:5500
```

> Abrir os arquivos direto com `file://` **não** funciona, pois o navegador
> bloqueia as requisições `fetch` para a API. Use um servidor HTTP.

## Configuração da URL da API

Por padrão o front aponta para `http://localhost:3001`. Para mudar, defina
`window.API_BASE` antes de carregar `assets/js/api.js`, por exemplo:

```html
<script>window.API_BASE = 'http://meu-servidor:3001';</script>
<script src="assets/js/api.js"></script>
```

## Observações sobre a integração com a API

- **Criar publicação** envia `user_id`, `title`, `slug`, `content`,
  `image_url`, `status` e `categories` (array de `{ id }`).
- O endpoint de **atualização de publicação** (`PUT /post/:id`) aceita apenas
  `title`, `slug`, `content`, `image_url` e `status` — por isso as categorias
  são definidas somente na criação (ficam desabilitadas na edição).
- Senhas de usuários são enviadas em texto puro e o back-end faz o hash
  (bcrypt). Na edição, deixar a senha em branco mantém a atual.
