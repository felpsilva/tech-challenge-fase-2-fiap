// Lógica da área administrativa (Alpine component).
function adminApp() {
  return {
    tab: 'posts',

    // Dados
    posts: [],
    users: [],
    categories: [],

    // Estados de carregamento
    loading: { posts: true, users: true, categories: true },
    error: { posts: '', users: '', categories: '' },

    // Feedback global
    toast: { msg: '', type: 'success' },
    toastTimer: null,

    // Modal / formulário
    modal: null, // 'post' | 'user' | 'category'
    editing: false,
    editingId: null,
    form: {},
    selectedCategoryIds: [],
    saving: false,
    formError: '',
    _slugTouched: false,

    init() {
      this.loadPosts();
      this.loadUsers();
      this.loadCategories();
    },

    notify(msg, type = 'success') {
      this.toast = { msg, type };
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => (this.toast.msg = ''), 3500);
    },

    /* ---------------- Carregamento ---------------- */
    async loadPosts() {
      this.loading.posts = true;
      this.error.posts = '';
      try {
        this.posts = await api.listPosts();
      } catch (e) {
        this.error.posts = e.message;
      } finally {
        this.loading.posts = false;
      }
    },
    async loadUsers() {
      this.loading.users = true;
      this.error.users = '';
      try {
        this.users = await api.listUsers();
      } catch (e) {
        this.error.users = e.message;
      } finally {
        this.loading.users = false;
      }
    },
    async loadCategories() {
      this.loading.categories = true;
      this.error.categories = '';
      try {
        this.categories = await api.listCategories();
      } catch (e) {
        this.error.categories = e.message;
      } finally {
        this.loading.categories = false;
      }
    },

    /* ---------------- Helpers ---------------- */
    userName(id) {
      const u = this.users.find((u) => u.id === id);
      return u ? u.username : '#' + id;
    },
    closeModal() {
      this.modal = null;
      this.formError = '';
      this.form = {};
      this.selectedCategoryIds = [];
    },
    autoSlug() {
      // Só preenche o slug automaticamente se o usuário ainda não o editou.
      if (!this._slugTouched) {
        this.form.slug = utils.slugify(this.form.title);
      }
    },

    /* ---------------- POSTS ---------------- */
    newPost() {
      if (this.users.length === 0) {
        this.notify('Cadastre um usuário antes de criar uma publicação.', 'error');
        this.tab = 'users';
        return;
      }
      this.editing = false;
      this.editingId = null;
      this._slugTouched = false;
      this.form = {
        user_id: this.users[0]?.id,
        title: '',
        slug: '',
        content: '',
        image_url: '',
        status: 'draft',
      };
      this.selectedCategoryIds = [];
      this.formError = '';
      this.modal = 'post';
    },
    editPost(post) {
      this.editing = true;
      this.editingId = post.id;
      this._slugTouched = true;
      this.form = {
        user_id: post.user_id,
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        image_url: post.image_url || '',
        status: post.status || 'draft',
      };
      this.selectedCategoryIds = (post.categories || []).map((c) => c.id);
      this.formError = '';
      this.modal = 'post';
    },
    toggleCategory(id) {
      const i = this.selectedCategoryIds.indexOf(id);
      if (i === -1) this.selectedCategoryIds.push(id);
      else this.selectedCategoryIds.splice(i, 1);
    },
    async savePost() {
      this.formError = '';
      if (!this.form.title?.trim()) return (this.formError = 'O título é obrigatório.');
      if (!this.form.content?.trim()) return (this.formError = 'O conteúdo é obrigatório.');
      if (!this.form.slug?.trim()) this.form.slug = utils.slugify(this.form.title);

      this.saving = true;
      try {
        if (this.editing) {
          // O endpoint de update aceita: title, slug, content, image_url, status.
          await api.updatePost(this.editingId, {
            title: this.form.title,
            slug: this.form.slug,
            content: this.form.content,
            image_url: this.form.image_url || undefined,
            status: this.form.status,
          });
          this.notify('Publicação atualizada com sucesso.');
        } else {
          await api.createPost({
            user_id: Number(this.form.user_id),
            title: this.form.title,
            slug: this.form.slug,
            content: this.form.content,
            image_url: this.form.image_url || undefined,
            status: this.form.status,
            categories: this.selectedCategoryIds.map((id) => ({ id })),
          });
          this.notify('Publicação criada com sucesso.');
        }
        this.closeModal();
        this.loadPosts();
      } catch (e) {
        this.formError = e.message;
      } finally {
        this.saving = false;
      }
    },
    async removePost(post) {
      if (!confirm(`Excluir a publicação "${post.title}"?`)) return;
      try {
        await api.deletePost(post.id);
        this.notify('Publicação excluída.');
        this.loadPosts();
      } catch (e) {
        this.notify(e.message, 'error');
      }
    },

    /* ---------------- USERS ---------------- */
    newUser() {
      this.editing = false;
      this.editingId = null;
      this.form = { username: '', password: '', permission: 'editor' };
      this.formError = '';
      this.modal = 'user';
    },
    editUser(user) {
      this.editing = true;
      this.editingId = user.id;
      this.form = { username: user.username, password: '', permission: user.permission };
      this.formError = '';
      this.modal = 'user';
    },
    async saveUser() {
      this.formError = '';
      if (!this.form.username?.trim()) return (this.formError = 'O nome de usuário é obrigatório.');
      if (!this.editing && !this.form.password?.trim())
        return (this.formError = 'A senha é obrigatória.');

      this.saving = true;
      try {
        if (this.editing) {
          const payload = {
            username: this.form.username,
            permission: this.form.permission,
          };
          if (this.form.password?.trim()) payload.password = this.form.password;
          await api.updateUser(this.editingId, payload);
          this.notify('Usuário atualizado com sucesso.');
        } else {
          await api.createUser({
            username: this.form.username,
            password: this.form.password,
            permission: this.form.permission,
          });
          this.notify('Usuário criado com sucesso.');
        }
        this.closeModal();
        this.loadUsers();
      } catch (e) {
        this.formError = e.message;
      } finally {
        this.saving = false;
      }
    },
    async removeUser(user) {
      if (!confirm(`Excluir o usuário "${user.username}"?`)) return;
      try {
        await api.deleteUser(user.id);
        this.notify('Usuário excluído.');
        this.loadUsers();
      } catch (e) {
        this.notify(e.message, 'error');
      }
    },

    /* ---------------- CATEGORIES ---------------- */
    newCategory() {
      this.editing = false;
      this.editingId = null;
      this._slugTouched = false;
      this.form = { name: '', slug: '' };
      this.formError = '';
      this.modal = 'category';
    },
    editCategory(cat) {
      this.editing = true;
      this.editingId = cat.id;
      this._slugTouched = true;
      this.form = { name: cat.name, slug: cat.slug };
      this.formError = '';
      this.modal = 'category';
    },
    autoSlugCategory() {
      if (!this._slugTouched) this.form.slug = utils.slugify(this.form.name);
    },
    async saveCategory() {
      this.formError = '';
      if (!this.form.name?.trim()) return (this.formError = 'O nome é obrigatório.');
      if (!this.form.slug?.trim()) this.form.slug = utils.slugify(this.form.name);

      this.saving = true;
      try {
        if (this.editing) {
          await api.updateCategory(this.editingId, {
            name: this.form.name,
            slug: this.form.slug,
          });
          this.notify('Categoria atualizada.');
        } else {
          await api.createCategory({ name: this.form.name, slug: this.form.slug });
          this.notify('Categoria criada.');
        }
        this.closeModal();
        this.loadCategories();
      } catch (e) {
        this.formError = e.message;
      } finally {
        this.saving = false;
      }
    },
    async removeCategory(cat) {
      if (!confirm(`Excluir a categoria "${cat.name}"?`)) return;
      try {
        await api.deleteCategory(cat.id);
        this.notify('Categoria excluída.');
        this.loadCategories();
      } catch (e) {
        this.notify(e.message, 'error');
      }
    },
  };
}
