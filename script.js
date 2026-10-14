// Initial Default Posts Data (Derived from User's base HTML + enriched details)
const DEFAULT_POSTS = [
    {
        id: 'post-1',
        title: '¿Quién Soy?',
        category: 'sobre-mi',
        categoryLabel: 'Sobre Mí',
        readTime: '2 min de lectura',
        date: '2026-03-15',
        image: 'https://petapixel.com/assets/uploads/2022/12/what-is-unsplash-1536x806.jpg',
        content: 'Soy un entusiasta de la programación y quiero aprender sobre cómo crear aplicaciones para solucionar necesidades básicas y automatizar estas de forma que pueda ayudar a las personas a mejorar su calidad de vida y la de los demás.',
        likes: 12,
        comments: [
            { id: 'c1', author: 'Cincinnatus Team', text: '¡Excelente visión! El desarrollo con propósito social transforma comunidades.', date: 'Hace 2 días' }
        ]
    },
    {
        id: 'post-2',
        title: '¿Qué hago?',
        category: 'desarrollo',
        categoryLabel: 'Desarrollo Full-Stack',
        readTime: '3 min de lectura',
        date: '2026-03-20',
        image: 'https://hotelplatino.com/wp-content/uploads/2024/07/278395440_528747048686889_5349722638329336443_n-839x1024.jpg',
        content: 'Soy un desarrollador full-stack especializado en crear aplicaciones web innovadoras con arquitecturas modernas, animaciones fluidas e interfaces altamente intuitivas que optimizan procesos.',
        likes: 24,
        comments: [
            { id: 'c2', author: 'Ana Martínez', text: 'Gran trabajo combinando Tailwind y animaciones interactivas.', date: 'Ayer' }
        ]
    },
    {
        id: 'post-3',
        title: '¿Dónde vivo?',
        category: 'ubicacion',
        categoryLabel: 'Gurabo, Santiago',
        readTime: '3 min de lectura',
        date: '2026-03-25',
        image: 'https://images.unsplash.com/photo-1788929895175-3064d55d3d4c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        content: 'Soy de Gurabo, Santiago de los Caballeros, República Dominicana. Donde vivo exactamente dicen que es un barrio peligroso y que no es recomendable vivir allí, pero como me crié allí, no me importa lo que digan los demás. Es mi hogar y el motor de mi superación diaria.',
        likes: 38,
        comments: [
            { id: 'c3', author: 'Comunidad Santiago', text: '¡Orgullo dominicano! El talento y la disciplina definen a las personas, no el sector.', date: 'Hace 5 horas' }
        ]
    }
];

// State Store
let state = {
    posts: [],
    isAdmin: false,
    currentCategory: 'all',
    searchQuery: '',
    sortBy: 'newest',
    confirmResolver: null
};

// Initialization
window.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupScrollProgress();
    setupSearchListeners();
    updateStats();
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// Load Posts from LocalStorage or Defaults
function loadPosts() {
    const stored = localStorage.getItem('gerarmy_blog_posts');
    if (stored) {
        try {
            state.posts = JSON.parse(stored);
        } catch (e) {
            state.posts = [...DEFAULT_POSTS];
        }
    } else {
        state.posts = [...DEFAULT_POSTS];
        savePosts();
    }
    renderPosts();
}

function savePosts() {
    localStorage.setItem('gerarmy_blog_posts', JSON.stringify(state.posts));
    updateStats();
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    showToast(isDark ? 'Modo Oscuro activado' : 'Modo Claro activado', 'info');
}

// Admin Mode Toggle
function toggleAdminMode() {
    state.isAdmin = !state.isAdmin;
    const btnText = document.getElementById('admin-btn-text');
    const indicator = document.getElementById('admin-indicator');
    const createBtn = document.getElementById('create-post-btn');
    const mobileAdminText = document.getElementById('mobile-admin-text');
    const mobileCreateBtn = document.getElementById('mobile-create-btn');

    if (state.isAdmin) {
        btnText.textContent = 'Modo Administrador';
        indicator.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
        createBtn.classList.remove('hidden');
        createBtn.classList.add('flex');
        mobileAdminText.textContent = 'Modo Administrador';
        mobileCreateBtn.classList.remove('hidden');
        showToast('Modo Edición / Administrador Activado', 'success');
    } else {
        btnText.textContent = 'Modo Lector';
        indicator.className = 'w-2 h-2 rounded-full bg-slate-400';
        createBtn.classList.add('hidden');
        createBtn.classList.remove('flex');
        mobileAdminText.textContent = 'Modo Lector';
        mobileCreateBtn.classList.add('hidden');
        showToast('Modo Lector Activado', 'info');
    }

    renderPosts();
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Reading Scroll Progress Indicator
function setupScrollProgress() {
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
    });
}

// Search Listeners
function setupSearchListeners() {
    const navSearch = document.getElementById('navbar-search');
    const mobileSearch = document.getElementById('mobile-search');

    const handleSearch = (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        renderPosts();
    };

    if (navSearch) navSearch.addEventListener('input', handleSearch);
    if (mobileSearch) mobileSearch.addEventListener('input', handleSearch);
}

// Category Filter Handler
function filterCategory(category) {
    state.currentCategory = category;
    
    // Update Active Buttons Styling
    document.querySelectorAll('.cat-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-cat') === category) {
            btn.className = 'cat-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all';
        } else {
            btn.className = 'cat-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all';
        }
    });

    renderPosts();
}

// Sort Handler
function sortPosts(sortBy) {
    state.sortBy = sortBy;
    renderPosts();
}

// Filter and Sort Function
function getFilteredPosts() {
    return state.posts.filter(post => {
        const matchesCategory = state.currentCategory === 'all' || post.category === state.currentCategory;
        const matchesSearch = post.title.toLowerCase().includes(state.searchQuery) ||
                              post.content.toLowerCase().includes(state.searchQuery);
        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        if (state.sortBy === 'likes') {
            return b.likes - a.likes;
        } else {
            return new Date(b.date) - new Date(a.date);
        }
    });
}

// Render Posts Grid
function renderPosts() {
    const grid = document.getElementById('posts-grid');
    const emptyState = document.getElementById('empty-state');
    const filtered = getFilteredPosts();

    if (filtered.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    grid.innerHTML = filtered.map(post => `
        <article class="interactive-card glass-panel rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200/80 dark:border-slate-800/80 group">
            
            <div>
                <!-- Card Image Header -->
                <div class="relative overflow-hidden aspect-video cursor-pointer" onclick="openLightbox('${post.image}', '${post.title}')">
                    <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    
                    <!-- Category Badge -->
                    <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-cyan-300 backdrop-blur-md border border-cyan-500/30">
                        ${getCategoryName(post.category)}
                    </span>

                    <!-- Zoom Lightbox Hint -->
                    <span class="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <i class="fa-solid fa-expand text-xs"></i>
                    </span>
                </div>

                <!-- Card Content -->
                <div class="p-5 space-y-3">
                    <div class="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span><i class="fa-regular fa-calendar mr-1"></i> ${formatDate(post.date)}</span>
                        <span><i class="fa-regular fa-clock mr-1"></i> ${post.readTime || '2 min lectura'}</span>
                    </div>

                    <h3 class="text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                        ${post.title}
                    </h3>

                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        ${post.content}
                    </p>
                </div>
            </div>

            <!-- Card Actions & Footer -->
            <div class="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/50 mt-4">
                
                <!-- Admin Edit Controls Bar (Visible if Admin Mode is On) -->
                ${state.isAdmin ? `
                    <div class="flex items-center justify-between py-2 px-3 mb-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <span class="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Modo Edición</span>
                        <div class="flex items-center gap-2">
                            <button onclick="openEditModal('${post.id}')" class="p-1.5 text-xs text-blue-500 hover:bg-blue-500/10 rounded-lg" title="Editar">
                                <i class="fa-solid fa-pen-to-square"></i> Editar
                            </button>
                            <button onclick="confirmDeletePost('${post.id}')" class="p-1.5 text-xs text-rose-500 hover:bg-rose-500/10 rounded-lg" title="Eliminar">
                                <i class="fa-solid fa-trash-can"></i> Eliminar
                            </button>
                        </div>
                    </div>
                ` : ''}

                <div class="flex items-center justify-between text-xs pt-3">
                    
                    <!-- Like Button -->
                    <button onclick="handleLike('${post.id}', event)" class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-all active:scale-95">
                        <i class="fa-solid fa-heart ${post.likes > 0 ? 'text-rose-500' : 'text-slate-400'}"></i>
                        <span class="font-bold">${post.likes}</span>
                    </button>

                    <!-- Comments Toggle -->
                    <button onclick="toggleComments('${post.id}')" class="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 font-medium transition-colors">
                        <i class="fa-regular fa-comment"></i>
                        <span>${post.comments ? post.comments.length : 0} comentarios</span>
                    </button>

                    <!-- Share Button -->
                    <button onclick="sharePost('${post.title}')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="Compartir">
                        <i class="fa-solid fa-share-nodes"></i>
                    </button>
                </div>

                <!-- Expandable Comments Drawer -->
                <div id="comments-section-${post.id}" class="hidden pt-4 mt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Comentarios</h4>
                    
                    <div class="space-y-2 max-h-40 overflow-y-auto pr-1">
                        ${(post.comments || []).map(c => `
                            <div class="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 text-xs space-y-1">
                                <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                                    <span>${c.author}</span>
                                    <span>${c.date}</span>
                                </div>
                                <p class="text-slate-700 dark:text-slate-300">${c.text}</p>
                            </div>
                        `).join('')}
                    </div>

                    <!-- New Comment Input -->
                    <div class="flex gap-2 pt-1">
                        <input type="text" id="input-comment-${post.id}" placeholder="Escribe un comentario..." 
                            class="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <button onclick="addComment('${post.id}')" class="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                            Enviar
                        </button>
                    </div>
                </div>

            </div>
        </article>
    `).join('');
}

// Like Handler with Floating Particles
function handleLike(postId, event) {
    const post = state.posts.find(p => p.id === postId);
    if (!post) return;

    post.likes += 1;
    savePosts();

    // Spawn floating heart particle effect
    const btn = event.currentTarget;
    const rect = btn.getBoundingClientRect();
    const heart = document.createElement('i');
    heart.className = 'fa-solid fa-heart floating-heart';
    heart.style.left = `${event.clientX - rect.left}px`;
    heart.style.top = `${event.clientY - rect.top}px`;
    btn.appendChild(heart);

    setTimeout(() => heart.remove(), 800);

    renderPosts();
}

// Toggle Comments Drawer
function toggleComments(postId) {
    const elem = document.getElementById(`comments-section-${postId}`);
    if (elem) elem.classList.toggle('hidden');
}

// Add Comment
function addComment(postId) {
    const input = document.getElementById(`input-comment-${postId}`);
    if (!input || !input.value.trim()) return;

    const post = state.posts.find(p => p.id === postId);
    if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push({
            id: 'c_' + Date.now(),
            author: state.isAdmin ? 'Gerarmy (Autor)' : 'Lector Invitado',
            text: input.value.trim(),
            date: 'Ahora mismo'
        });
        savePosts();
        renderPosts();
        showToast('Comentario publicado', 'success');
    }
}

// Lightbox Viewer
function openLightbox(imageUrl, title) {
    const modal = document.getElementById('modal-lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    img.src = imageUrl;
    caption.textContent = title;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeLightbox() {
    const modal = document.getElementById('modal-lightbox');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Post Modal Logic (Create / Edit)
function openCreateModal() {
    document.getElementById('modal-title').textContent = 'Crear Nuevo Artículo';
    document.getElementById('form-post-id').value = '';
    document.getElementById('post-form').reset();
    
    const modal = document.getElementById('modal-post');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function openEditModal(postId) {
    const post = state.posts.find(p => p.id === postId);
    if (!post) return;

    document.getElementById('modal-title').textContent = 'Editar Artículo';
    document.getElementById('form-post-id').value = post.id;
    document.getElementById('form-title').value = post.title;
    document.getElementById('form-category').value = post.category;
    document.getElementById('form-readtime').value = post.readTime || '2 min de lectura';
    document.getElementById('form-image').value = post.image;
    document.getElementById('form-content').value = post.content;

    const modal = document.getElementById('modal-post');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closePostModal() {
    const modal = document.getElementById('modal-post');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function handlePostSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('form-post-id').value;
    const title = document.getElementById('form-title').value;
    const category = document.getElementById('form-category').value;
    const readTime = document.getElementById('form-readtime').value;
    const image = document.getElementById('form-image').value;
    const content = document.getElementById('form-content').value;

    if (id) {
        // Edit existing
        const post = state.posts.find(p => p.id === id);
        if (post) {
            post.title = title;
            post.category = category;
            post.readTime = readTime;
            post.image = image;
            post.content = content;
            showToast('Artículo actualizado con éxito', 'success');
        }
    } else {
        // Create new
        const newPost = {
            id: 'post-' + Date.now(),
            title,
            category,
            readTime,
            date: new Date().toISOString().split('T')[0],
            image,
            content,
            likes: 0,
            comments: []
        };
        state.posts.unshift(newPost);
        showToast('Nuevo artículo creado con éxito', 'success');
    }

    savePosts();
    closePostModal();
    renderPosts();
}

// Custom Delete Confirmation Modal
function confirmDeletePost(postId) {
    const modal = document.getElementById('modal-confirm');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    state.confirmResolver = (confirmed) => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        if (confirmed) {
            state.posts = state.posts.filter(p => p.id !== postId);
            savePosts();
            renderPosts();
            showToast('Artículo eliminado', 'info');
        }
    };
}

function resolveConfirm(result) {
    if (state.confirmResolver) state.confirmResolver(result);
}

// Toast Notifications System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'warning' ? 'bg-amber-600' : 'bg-blue-600';
    
    toast.className = `${bgColor} text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 transform transition-all duration-300 opacity-0 translate-y-2`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-2');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Helper Utilities
function getCategoryName(categoryKey) {
    const map = {
        'sobre-mi': '¿Quién Soy?',
        'desarrollo': '¿Qué Hago?',
        'ubicacion': '¿Dónde Vivo?',
        'tecnologia': 'Tecnología'
    };
    return map[categoryKey] || 'General';
}

function formatDate(dateString) {
    if (!dateString) return 'Reciente';
    const parts = dateString.split('-');
    if (parts.length < 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function updateStats() {
    document.getElementById('stat-posts-count').textContent = state.posts.length;
    const totalLikes = state.posts.reduce((acc, p) => acc + (p.likes || 0), 0);
    document.getElementById('stat-likes-count').textContent = totalLikes;
}

function sharePost(title) {
    navigator.clipboard.writeText(window.location.href);
    showToast(`Enlace copiado para: "${title}"`, 'success');
}

function shareBlog() {
    navigator.clipboard.writeText(window.location.href);
    showToast('Enlace del Blog copiado al portapapeles', 'success');
}
