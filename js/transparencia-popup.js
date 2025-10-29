
(function () {
  const ID_BACKDROP = 'ihmTranspBackdrop';
  let lastFocused = null;

  function ensureModalExists(opts) {
    if (document.getElementById(ID_BACKDROP)) return;

    const o = normalizeOpts(opts);
    const html = `
      <div class="ihmT-modal-backdrop" id="${ID_BACKDROP}" aria-hidden="true">
        <div class="ihmT-modal" role="dialog" aria-modal="true" aria-labelledby="ihmTTitle" tabindex="-1">
          <div class="ihmT-header">
            <span class="ihmT-badge">Aviso</span>
            <h3 class="ihmT-title" id="ihmTTitle">${o.title}</h3>
            <button class="ihmT-close" type="button" aria-label="Fechar" data-close-modal>&times;</button>
          </div>
          <div class="ihmT-body">
            <p class="ihmT-msg">${buildMessage(o)}</p>
            <p>Fale com a gente se precisar do documento antes:</p>
          </div>
          <div class="ihmT-actions">
            <a class="ihmT-btn ihmT-btn--primary"
               href="${waHref(o)}" target="_blank" rel="noopener">Falar no WhatsApp</a>
            <a class="ihmT-btn ihmT-btn--outline"
               href="${mailHref(o)}">Enviar e-mail</a>
            <button class="ihmT-btn ihmT-btn--outline" type="button" data-close-modal>Fechar</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    const $backdrop = document.getElementById(ID_BACKDROP);
    const $dialog   = $backdrop.querySelector('[role="dialog"]');

    // eventos
    $backdrop.addEventListener('click', (e) => { if (e.target === $backdrop) closeModal(); });
    $backdrop.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) closeModal();
    });

    // trap de foco simples
    $backdrop.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = $backdrop.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      const list = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
      if (!list.length) return;
      const first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    });

    $backdrop.__dialog = $dialog;
  }

  function normalizeOpts(opts) {
    // aceita string => item
    if (typeof opts === 'string') opts = { item: opts };
    const def = {
      item: '',
      title: 'Transparência — Documento em atualização',
      message: '',
      whatsapp: '5511900000000',
      email: 'contato@associacaoidelfranca.org'
    };
    return Object.assign({}, def, (opts || {}));
  }

  function buildMessage(o) {
    if (o.message && o.message.trim()) return o.message;
    const alvo = o.item ? `${o.item}` : 'o documento selecionado';
    return `Estamos preparando ${alvo}. Em breve o botão de download/visualização estará disponível.`;
  }

  function waHref(o) {
    const item = encodeURIComponent(o.item || 'documento');
    const text = `Olá! Gostaria de receber o ${item} da área de Transparência do Instituto Hand Maria.`;
    return `https://wa.me/${o.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  function mailHref(o) {
    const item = o.item || 'documento';
    const subject = encodeURIComponent(`Solicitação de ${item} — Transparência IHM`);
    const body = encodeURIComponent(`Olá, equipe IHM!\n\nPoderiam me enviar o ${item}?\n\nObrigado(a).`);
    return `mailto:${o.email}?subject=${subject}&body=${body}`;
  }

  function isOpen() {
    const $b = document.getElementById(ID_BACKDROP);
    return $b && $b.classList.contains('is-open');
  }

  function openModal(opts) {
    ensureModalExists(opts);
    // atualiza conteúdo a cada abertura (dinâmico por item)
    patchContent(opts);

    const $backdrop = document.getElementById(ID_BACKDROP);
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
    const o = normalizeOpts(opts);
    const $b = document.getElementById(ID_BACKDROP);
    if (!$b) return;
    $b.querySelector('#ihmTTitle').textContent = o.title;
    $b.querySelector('.ihmT-msg').textContent = buildMessage(o);

    // atualiza links
    const $wa = $b.querySelector('.ihmT-btn--primary');
    const $em = $b.querySelector('.ihmT-btn--outline[href^="mailto:"]');
    if ($wa) $wa.href = waHref(o);
    if ($em) $em.href = mailHref(o);
  }

  // Expor global
  window.openTransparenciaPopup = openModal;
  window.closeTransparenciaPopup = closeModal;
})();
