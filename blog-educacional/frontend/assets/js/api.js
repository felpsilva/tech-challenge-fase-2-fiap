// Cliente HTTP central do front-end.
// Aponta para a API Fastify do backend (porta padrão 3001).
const API_BASE = window.API_BASE || 'http://localhost:3001';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body.message || JSON.stringify(body);
    } catch (_) {
      detail = res.statusText;
    }
    throw new Error(`Erro ${res.status}: ${detail}`);
  }

  // 204 No Content (ex.: delete)
  if (res.status === 204) return null;
  return res.json();
}

// API pública usada pelas páginas / componentes Alpine.
window.api = {
  // Posts
  listPosts: () => request('/post'),
  searchPosts: (q) => request(`/post/search?q=${encodeURIComponent(q)}`),
  getPost: (id) => request(`/post/${id}`),
  createPost: (data) =>
    request('/post', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (id, data) =>
    request(`/post/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePost: (id) => request(`/post/${id}`, { method: 'DELETE' }),

  // Categorias
  listCategories: () => request('/category'),
  getCategory: (id) => request(`/category/${id}`),
  createCategory: (data) =>
    request('/category', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) =>
    request(`/category/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/category/${id}`, { method: 'DELETE' }),

  // Usuários
  listUsers: () => request('/user'),
  getUser: (id) => request(`/user/${id}`),
  createUser: (data) =>
    request('/user', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) =>
    request(`/user/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/user/${id}`, { method: 'DELETE' }),
};

// Utilidades compartilhadas.
window.utils = {
  // Gera um slug a partir de um texto (acentos removidos, minúsculo, hífens).
  slugify(text) {
    return (text || '')
      .toString()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  },

  formatDate(value) {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  },

  excerpt(text, max = 160) {
    if (!text) return '';
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > max ? clean.slice(0, max) + '…' : clean;
  },

  // Query string helper (?id=123)
  queryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },
};
