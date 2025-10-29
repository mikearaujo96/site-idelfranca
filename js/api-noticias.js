// API base WP
const API_BASE = 'https://api.associacaoidelfranca.org/wp-json/wp/v2';

// DOM
const elBuscaInput = document.getElementById('input-busca');
const elBtnCategorias = document.getElementById('btn-categorias');
const elListaCategorias = document.getElementById('lista-categorias');

const elGrid = document.getElementById('grid-cards');
const elBtnAnterior = document.getElementById('btn-anterior');
const elBtnProximo = document.getElementById('btn-proximo');
const elContador = document.getElementById('contador-pagina');

// Estado
const estado = {
  pagina: 1,
  porPagina: 8,
  busca: '',
  categoriaId: '',
  totalPaginas: 1
};

// Utils
function stripHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return (div.textContent || div.innerText || '').trim();
}
function corta(txt = '', n = 140) {
  return txt.length > n ? txt.slice(0, n).trim() + '…' : txt;
}
function pegaImagem(post) {
  try { return post._embedded['wp:featuredmedia'][0].source_url; }
  catch { return 'https://via.placeholder.com/800x450?text=Sem+imagem'; }
}
function dataBR(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Categorias (constrói dropdown suspenso)
async function carregaCategorias() {
  const res = await fetch(`${API_BASE}/categories?per_page=100`);
  const cats = await res.json();

  // “Todas as categorias”
  const itens = [{ id: '', name: 'Todas as categorias' }, ...cats];

  elListaCategorias.innerHTML = itens.map(c => `
    <div class="item${c.id === estado.categoriaId ? ' ativo' : ''}" data-id="${c.id}" role="option" tabindex="0">
      ${c.name}
    </div>
  `).join('');

  // Ações de clique/teclado
  elListaCategorias.querySelectorAll('.item').forEach(item => {
    const aplicar = () => {
      estado.categoriaId = item.dataset.id || '';
      estado.pagina = 1;
      atualizar();
      elListaCategorias.classList.remove('show');
      elBtnCategorias.setAttribute('aria-expanded', 'false');
      // marca ativo
      elListaCategorias.querySelectorAll('.item').forEach(i => i.classList.remove('ativo'));
      item.classList.add('ativo');
    };
    item.addEventListener('click', aplicar);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aplicar(); }
    });
  });
}

// Busca/Lista
async function carregaPosts() {
  const params = new URLSearchParams({
    per_page: String(estado.porPagina),
    page: String(estado.pagina),
    orderby: 'date',
    order: 'desc',
    _embed: '1'
  });
  if (estado.busca) params.set('search', estado.busca);
  if (estado.categoriaId) params.set('categories', estado.categoriaId);

  const url = `${API_BASE}/posts?${params.toString()}`;
  const res = await fetch(url);

  // controla total de páginas e corrige página fora do range
  estado.totalPaginas = Number(res.headers.get('X-WP-TotalPages')) || 1;
  if (estado.pagina > estado.totalPaginas && estado.totalPaginas > 0) {
    estado.pagina = 1;
    return carregaPosts();
  }

  const posts = await res.json();

  if (!Array.isArray(posts) || posts.length === 0) {
    elGrid.innerHTML = `
      <p style="padding:18px; background:#f4f6fb; border:1px dashed #d0dcf0; border-radius:12px; text-align:center;">
        Nenhum post encontrado.
      </p>`;
  } else {
    elGrid.innerHTML = posts.map(p => {
      const titulo = stripHTML(p.title.rendered);
      const exc = corta(stripHTML(p.excerpt.rendered), 120);
      const img = pegaImagem(p);
      const quando = dataBR(p.date);
      return `
        <a class="card" href="post.html?id=${p.id}" aria-label="Abrir post: ${titulo}">
          <figure><img src="${img}" alt="${titulo}"></figure>
          <div class="miolo">
            <div>
              <h3>${titulo}</h3>
              <p>${exc}</p>
              <div class="linha">📅 ${quando}</div>
            </div>
            <span class="acessar" role="button" tabindex="0">
              Acessar <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </span>
          </div>
        </a>
      `;
    }).join('');
  }

  elContador.textContent = `Página ${estado.pagina} de ${estado.totalPaginas}`;
  elBtnAnterior.disabled = (estado.pagina <= 1);
  elBtnProximo.disabled = (estado.pagina >= estado.totalPaginas);
}

async function atualizar() { await carregaPosts(); }

/* Eventos */

// Busca instantânea (debounce)
let buscaTimer = null;
elBuscaInput.addEventListener('input', () => {
  clearTimeout(buscaTimer);
  buscaTimer = setTimeout(() => {
    estado.busca = elBuscaInput.value.trim();
    estado.pagina = 1;
    atualizar();
  }, 350);
});

// Abre/fecha dropdown de categorias
elBtnCategorias.addEventListener('click', () => {
  const aberto = elListaCategorias.classList.toggle('show');
  elBtnCategorias.setAttribute('aria-expanded', aberto ? 'true' : 'false');
});

// Fecha dropdown clicando fora
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown-categorias')) {
    elListaCategorias.classList.remove('show');
    elBtnCategorias.setAttribute('aria-expanded', 'false');
  }
});

// Paginação
elBtnAnterior.addEventListener('click', () => {
  if (estado.pagina > 1) {
    estado.pagina--;
    carregaPosts();
  }
});
elBtnProximo.addEventListener('click', () => {
  if (estado.pagina < estado.totalPaginas) {
    estado.pagina++;
    carregaPosts();
  }
});

// Init
(async function init() {
  try {
    await carregaCategorias();
    await atualizar();
  } catch (err) {
    console.error(err);
    elGrid.innerHTML = `
      <p style="padding:18px; background:#fef2f2; border:1px solid #fecaca; color:#991b1b; border-radius:12px;">
        Erro ao carregar as notícias. Tente novamente.
      </p>`;
  }
})();
