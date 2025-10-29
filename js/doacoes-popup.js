/* Instituto Hand Maria — Popup de Doações (JS + HTML)
 * Uso nos cards: onclick="openDoacaoPopup()"
 * Você pode passar opções: openDoacaoPopup({ whatsapp:'5511999999999', email:'contato@...', title:'...', message:'...' })
 */
(function () {
  const ID_BACKDROP = 'ihmDoacoesBackdrop';
  let lastFocused = null;

  function ensureModalExists(opts) {
    if (document.getElementById(ID_BACKDROP)) return;

    const title = (opts && opts.title) || 'Doações online';
    const message = (opts && opts.message) ||
      'Estamos finalizando a integração de cartão e doação recorrente. ' +
      'Enquanto isso, o Pix já está ATIVO e você pode doar agora mesmo.';

    const wa   = (opts && opts.whatsapp) || '5511900000000';
    const mail = (opts && opts.email)    || 'contato@associacaoidelfranca.org';

    const html = `
      <div class="ihm-modal-backdrop" id="${ID_BACKDROP}" aria-hidden="true">
        <div class="ihm-modal" role="dialog" aria-modal="true" aria-labelledby="ihmModalTitle" tabindex="-1">
          <div class="ihm-modal__header">
            <span class="ihm-badge">Aviso</span>
            <h3 class="ihm-modal__title" id="ihmModalTitle">${title}</h3>
            <button class="ihm-close" type="button" aria-label="Fechar" data-close-modal>&times;</button>
          </div>
          <div class="ihm-modal__body">
            <p>${message}</p>
            <p>Se preferir, fale com a gente pelos canais abaixo:</p>
          </div>
          <div class="ihm-modal__actions">
            <a class="ihm-btn ihm-btn--primary"
               href="https://wa.me/${wa}?text=Quero%20doar%20ao%20Instituto%20Hand%20Maria"
               target="_blank" rel="noopener">Falar no WhatsApp</a>
            <a class="ihm-btn ihm-btn--outline" href="mailto:${mail}">Enviar e-mail</a>
            <button class="ihm-btn ihm-btn--pix" type="button" data-open-pix>Doar com Pix</button>
            <button class="ihm-btn ihm-btn--outline" type="button" data-close-modal>Fechar</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    const $backdrop = document.getElementById(ID_BACKDROP);
    const $dialog   = $backdrop.querySelector('[role="dialog"]');

    // Clique fora fecha
    $backdrop.addEventListener('click', (e) => {
      if (e.target === $backdrop) closeModal();
    });

    // Botões de fechar
    $backdrop.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // ESC fecha
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) closeModal();
    });

    // Trap de foco simples
    $backdrop.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = $backdrop.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      const list = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
      if (!list.length) return;
      const first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    });

    // Botão "Doar com Pix"
    const pixBtn = $backdrop.querySelector('[data-open-pix]');
    pixBtn.addEventListener('click', () => {
      closeModal();
      openPixModal();
    });

    $backdrop.__dialog = $dialog;
  }

  function isOpen() {
    const $b = document.getElementById(ID_BACKDROP);
    return $b && $b.classList.contains('is-open');
  }

  function openModal(opts) {
    ensureModalExists(opts);
    const $backdrop = document.getElementById(ID_BACKDROP);
    if (!$backdrop) return;

    if (opts) patchContent(opts);

    lastFocused = document.activeElement;
    $backdrop.classList.add('is-open');
    $backdrop.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => $backdrop.__dialog && $backdrop.__dialog.focus());
    document.documentElement.style.overflow = 'hidden';
  }

  function closeModal() {
    const $backdrop = document.getElementById(ID_BACKDROP);
    if (!$backdrop) return;
    $backdrop.classList.remove('is-open');
    $backdrop.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function patchContent(opts) {
    const $b = document.getElementById(ID_BACKDROP);
    if (!$b) return;
    if (opts.title)   $b.querySelector('#ihmModalTitle').textContent = opts.title;
    if (opts.message) {
      const $p = $b.querySelector('.ihm-modal__body p');
      if ($p) $p.textContent = opts.message;
    }
    if (opts.whatsapp) {
      const $wa = $b.querySelector('.ihm-btn--primary[href^="https://wa.me/"]');
      if ($wa) $wa.href = `https://wa.me/${opts.whatsapp}?text=Quero%20doar%20ao%20Instituto%20Hand%20Maria`;
    }
    if (opts.email) {
      const $em = $b.querySelector('.ihm-btn--outline[href^="mailto:"]');
      if ($em) $em.href = `mailto:${opts.email}`;
    }
  }

  // Abre o modal de Pix existente (#pix-modal)
  function openPixModal() {
    const pix = document.getElementById('pix-modal');
    if (pix) {
      pix.style.display = 'flex'; // combina com seu JS atual do Pix
      // foco acessível no modal do Pix, se houver elemento focável
      const focusable = pix.querySelector('button, [href], input, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    } else {
      console.warn('Modal Pix (#pix-modal) não encontrado.');
    }
  }

  // Expor para os cards
  window.openDoacaoPopup  = openModal;
  window.closeDoacaoPopup = closeModal;
  window.openPixModal     = openPixModal; // caso queira chamar direto
})();
