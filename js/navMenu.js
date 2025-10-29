const menuSite = `
  <div class="contatos-rapidos">
    <div>
      <a href="https://www.google.com/maps?q=Rua+Jose+Ferreira+Crespo,+674+-+Jardim+Sao+Vicente+-+São+Paulo" target="_blank">
        <img src="assets/icones/icon-localizacao.svg" alt="icone-localização">
        <p>Rua, n0 - bairro - São Paulo</p>
      </a>
      <a href="mailto:contato@associacaoidelfranca.org" target="_blank">
        <img src="assets/icones/icon-email.svg" alt="icone-email">
        <p>contato@associacaoidelfranca.org</p>
      </a>
    </div>
    <div class="links-contatos-rapidos-redesociais">
      <a href="https://www.facebook.com/profile.php?id=100009378518512&locale=pt_BR" target="_blank"><img src="assets/icones/icon-facebook.svg" alt="icone-facebook"></a>
      <a href="https://www.instagram.com/idelfranca_sede/" target="_blank"><img src="assets/icones/icon-instagram.svg" alt="icone-instagram"></a>
      <a href="https://wa.me/5511900000000" target="_blank"><img src="assets/icones/icon-whatsapp.svg" alt="icone-whatsapp"></a>
    </div>
  </div>

  <nav class="navigation">
    <div class="nav-logo">
      <a href="index.html">
        <img src="assets/logos/logo-idelfranca.svg" alt="logo site Associação irmã idelfranca">
      </a>
    </div>

    <div class="menu-hamburg" aria-label="Abrir menu" aria-expanded="false">
      <div></div><div></div><div></div>
    </div>

    <div class="nav-links">
      <button class="fechar-menu" aria-label="Fechar menu">
        <img src="assets/icones/icon-close.svg" alt="fechar menu">
      </button>

      <a class="link-fixo" href="index.html">Home</a>
      <a class="link-fixo" href="inscricoes.html">Inscrições</a>
      <a class="link-fixo" href="noticias.html">Nossos projetos</a>

      <!-- Submenu Sobre Nós -->
      <div class="submenu-container">
        <button class="submenu-toggle" type="button" aria-haspopup="true" aria-expanded="false">
          Sobre nós
          <span class="material-symbols-outlined arrow">chevron_right</span>
        </button>
        <ul class="submenu" role="menu">
          <li role="none">
            <a role="menuitem" href="sobre-nos.html">Quem somos
              <span class="material-symbols-outlined">diversity_3</span>
            </a>
          </li>
          <li role="none">
            <a role="menuitem" href="impacto.html">Impacto
              <span class="material-symbols-outlined">data_exploration</span>
            </a>
          </li>
          <li role="none">
            <a role="menuitem" href="quero-apoiar.html">Quero Apoiar
              <span class="material-symbols-outlined">handshake</span>
            </a>
          </li>
        </ul>
      </div>

      <a class="link-fixo" href="transparencia.html">Transparência</a>
      <a href="doe.html" class="link-doacoes-menu">DOE AGORA</a>
    </div>

    <div class="bt-doacao">
      <a href="doe.html">DOE AGORA</a>
    </div>
  </nav>
`;
document.querySelector('#insert-menu').innerHTML = menuSite;

// ======= FUNÇÕES AUXILIARES =======
const qs  = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];

// ======= ATIVAR SUBMENU =======
(function initSubmenu(){
  const toggles = qsa('.submenu-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const container = toggle.closest('.submenu-container');
      const isOpen = container.classList.contains('open');

      // fecha outros submenus
      qsa('.submenu-container.open').forEach(c => {
        if (c !== container) {
          c.classList.remove('open');
          const t = c.querySelector('.submenu-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      // alterna atual
      container.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.submenu-container')) {
      qsa('.submenu-container.open').forEach(c => {
        c.classList.remove('open');
        const t = c.querySelector('.submenu-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ESC fecha
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      qsa('.submenu-container.open').forEach(c => {
        c.classList.remove('open');
        const t = c.querySelector('.submenu-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ⬇ Ao clicar em link do submenu: fecha antes de navegar + marca "Sobre nós" ativo
  qsa('.submenu a').forEach(link => {
    link.addEventListener('click', (e) => {
      const container = link.closest('.submenu-container');
      if (container) {
        container.classList.remove('open');
        const toggle = container.querySelector('.submenu-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.add('ativo');
        }
      }
      // Fecha menu mobile se estiver aberto
      const navLinksMobile = qs('.nav-links');
      if (navLinksMobile?.classList.contains('active')) {
        navLinksMobile.classList.remove('active');
      }

      // Fecha visualmente antes de navegar
      e.preventDefault();
      setTimeout(() => {
        window.location.href = link.href;
      }, 30);
    });
  });
})();

// ======= LINK ATIVO =======
(function marcarLinkAtivo(){
  const current = window.location.pathname.split('/').pop() || 'index.html';

  // Top-level
  qsa('.nav-links > a[href]').forEach(a => {
    const hrefFile = new URL(a.href, window.location.origin).pathname.split('/').pop();
    if (hrefFile === current) a.classList.add('ativo');
  });

  // Submenu: marca item atual e o botão pai .ativo (NÃO abre o dropdown)
  qsa('.submenu a[href]').forEach(a => {
    const hrefFile = new URL(a.href, window.location.origin).pathname.split('/').pop();
    if (hrefFile === current) {
      a.classList.add('ativo-submenu');
      const container = a.closest('.submenu-container');
      if (container) {
        const toggle = container.querySelector('.submenu-toggle');
        if (toggle) {
          toggle.classList.add('ativo');          // marca o "Sobre nós"
          toggle.setAttribute('aria-expanded', 'false'); // garante fechado
        }
        // NÃO abre o submenu aqui (sem container.classList.add('open'))
      }
    }
  });
})();

// ======= SCROLL BAR DE CONTATOS =======
const barraContatos = qs('.contatos-rapidos');
const navBar = qs('.navigation');

window.addEventListener('scroll', () => {
  if (window.scrollY > 1) {
    barraContatos.classList.add('oculto');
    navBar.style.top = '0';
  } else {
    barraContatos.classList.remove('oculto');
    navBar.style.top = '50px';
  }
});

// ======= MENU HAMBURGUER =======
const menuHamburger = qs('.menu-hamburg');
const btFecharMenu = qs('.fechar-menu');
const navLinksMobile = qs('.nav-links');

function toggleMobileMenu(state) {
  const isOpen = state ?? !navLinksMobile.classList.contains('active');
  navLinksMobile.classList.toggle('active', isOpen);
  menuHamburger.setAttribute('aria-expanded', String(isOpen));

  // ao abrir/fechar menu mobile, feche submenus
  if (!isOpen) {
    qsa('.submenu-container.open').forEach(c => c.classList.remove('open'));
    qsa('.submenu-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));
  }
}

menuHamburger.addEventListener('click', () => toggleMobileMenu());
btFecharMenu.addEventListener('click', () => toggleMobileMenu(false));

// fecha menu mobile ao clicar em qualquer link
qsa('.nav-links a').forEach(a => {
  a.addEventListener('click', () => toggleMobileMenu(false));
});
