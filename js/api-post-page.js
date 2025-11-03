const API_BASE = 'https://api.irmaidelfranca.org/wp-json/wp/v2';

// DOM
const elTitle = document.getElementById('post-title');
const elDate = document.getElementById('post-date');
const elAuthor = document.getElementById('post-author');
const elContent = document.getElementById('post-content');
const elRelacionados = document.getElementById('relacionados-cards');

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

// ID da URL
const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

function stripHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return div.textContent || div.innerText || '';
}

/**
 * Agrupa <figure> consecutivas em blocos .galeria-hscroll
 * para permitir scroll lateral no mobile (CSS controla o comportamento).
 */
function agruparGalerias(container) {
  let current = container.firstElementChild;

  while (current) {
    if (current.tagName && current.tagName.toLowerCase() === 'figure') {
      // Cria wrapper para uma sequência de figures
      const wrapper = document.createElement('div');
      wrapper.className = 'galeria-hscroll';
      container.insertBefore(wrapper, current);

      // Move todas as figures consecutivas para dentro do wrapper
      while (current && current.tagName && current.tagName.toLowerCase() === 'figure') {
        const next = current.nextElementSibling;
        wrapper.appendChild(current);
        current = next;
      }
      // Continua a partir do próximo elemento após o bloco de figures
    } else {
      current = current.nextElementSibling;
    }
  }
}

/** Conecta o lightbox às imagens do conteúdo */
function conectarLightbox(container) {
  container.querySelectorAll('figure img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.style.display = 'flex';
    });
  });
}

/** Monta links de compartilhamento (inclui Instagram Stories com fallback de desktop) */
function configurarCompartilhamento(post, urlAtual) {
  const title = stripHTML(post.title?.rendered || document.title);
  const image =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    "https://via.placeholder.com/600x400?text=Instituto+Hand+Maria";

  const aFacebook = document.getElementById('share-facebook');
  const aTwitter = document.getElementById('share-twitter');
  const aLinkedIn = document.getElementById('share-linkedin');
  const aWhatsApp = document.getElementById('share-whatsapp');
  const aInstagram = document.getElementById('share-instagram');

  if (aFacebook) {
    aFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlAtual)}`;
  }
  if (aTwitter) {
    aTwitter.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlAtual)}&text=${encodeURIComponent(title)}`;
  }
  if (aLinkedIn) {
    aLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(urlAtual)}`;
  }
  if (aWhatsApp) {
    aWhatsApp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(urlAtual)}`;
  }

  // Instagram Stories (apenas mobile com app instalado)
  if (aInstagram) {
    aInstagram.href = `instagram-stories://share?backgroundImage=${encodeURIComponent(image)}&contentUrl=${encodeURIComponent(urlAtual)}`;

    // Tratamento para desktop
    if (!/Mobi|Android/i.test(navigator.userAgent)) {
      aInstagram.addEventListener('click', (e) => {
        e.preventDefault();
        alert("O compartilhamento no Instagram Stories só funciona em dispositivos móveis com o app instalado.");
      });
    }
  }
}

async function carregaPost() {
  if (!postId) {
    elContent.innerHTML = '<p>Post não encontrado.</p>';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/posts/${postId}?_embed=1`);
    if (!res.ok) throw new Error('Falha ao buscar post');
    const post = await res.json();

    elTitle.textContent = stripHTML(post.title.rendered);
    elDate.textContent = new Date(post.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // Autor fixo
    elAuthor.textContent = "Instituto Hand Maria";

    // Insere conteúdo do post
    elContent.innerHTML = post.content.rendered;

    // Agrupa figures consecutivas para a galeria horizontal no mobile
    agruparGalerias(elContent);

    // Conecta lightbox após agrupar
    conectarLightbox(elContent);

    // Compartilhar
    configurarCompartilhamento(post, window.location.href);

    // Relacionados (pega a primeira categoria se houver)
    const primeiraCategoria = Array.isArray(post.categories) && post.categories.length ? post.categories[0] : null;
    if (primeiraCategoria) {
      carregaRelacionados(postId, primeiraCategoria);
    } else {
      elRelacionados.innerHTML = '<p>Nenhum post relacionado.</p>';
    }
  } catch (err) {
    console.error(err);
    elContent.innerHTML = '<p>Erro ao carregar o post.</p>';
  }
}

async function carregaRelacionados(idAtual, categoria) {
  try {
    const res = await fetch(
      `${API_BASE}/posts?per_page=3&_embed=1&categories=${categoria}&exclude=${idAtual}`
    );
    if (!res.ok) throw new Error('Falha ao buscar relacionados');

    const posts = await res.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      elRelacionados.innerHTML = '<p>Nenhum post relacionado.</p>';
      return;
    }

    elRelacionados.innerHTML = posts.map(p => `
      <a href="post.html?id=${p.id}" class="card-relacionado">
        <figure>
          <img src="${
            p._embedded?.['wp:featuredmedia']?.[0]?.source_url
              || 'https://via.placeholder.com/400x250?text=Sem+Imagem'
          }" alt="${stripHTML(p.title.rendered)}">
        </figure>
        <h3>${stripHTML(p.title.rendered)}</h3>
      </a>
    `).join('');
  } catch (err) {
    console.error(err);
    elRelacionados.innerHTML = '<p>Erro ao carregar relacionados.</p>';
  }
}

// Eventos lightbox
lightboxClose.addEventListener('click', () => {
  lightbox.style.display = 'none';
});
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});

// Init
carregaPost();
