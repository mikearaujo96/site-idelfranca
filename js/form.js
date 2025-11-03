(function () {
  const form = document.getElementById("form-contato");
  if (!form) return;

  const ENDPOINT = "https://api.irmaidelfranca.org/wp-json/ihm/v1/contato";
  const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector("button");
  const statusBoxId = "contato-status";
  let statusBox = document.getElementById(statusBoxId);
  if (!statusBox) {
    statusBox = document.createElement("p");
    statusBox.id = statusBoxId;
    statusBox.setAttribute("aria-live", "polite");
    form.after(statusBox);
  }

  // ====== Anti-spam: honeypot + tempo mínimo + trava de envio ======
  // Honeypot (campo que humanos não veem)
  let hp = form.querySelector('input[name="website"]');
  if (!hp) {
    hp = document.createElement("input");
    hp.type = "text";
    hp.name = "website";
    hp.autocomplete = "off";
    hp.tabIndex = -1;
    hp.style.position = "absolute";
    hp.style.left = "-9999px";
    hp.style.opacity = "0";
    hp.style.width = "0";
    hp.style.height = "0";
    form.appendChild(hp);
  }

  // Tempo mínimo de permanência no formulário (2.5s)
  const loadTime = Date.now();
  const MIN_DELAY_MS = 2500;

  // Trava contra cliques múltiplos
  let sending = false;

  // ====== Máscara de telefone (Brasil) + limite ======
  const tel = form.querySelector('input[name="telefone"]');
  if (tel) {
    // limite visual: (99) 99999-9999 -> 15 chars
    tel.setAttribute("maxlength", "15");
    tel.addEventListener("input", () => {
      const onlyDigits = tel.value.replace(/\D/g, "").slice(0, 11); // até 11 dígitos
      let out = onlyDigits;

      if (onlyDigits.length > 2 && onlyDigits.length <= 6) {
        out = `(${onlyDigits.slice(0, 2)}) ${onlyDigits.slice(2)}`;
      } else if (onlyDigits.length > 6 && onlyDigits.length <= 10) {
        // fixo: (99) 9999-9999
        out = `(${onlyDigits.slice(0, 2)}) ${onlyDigits.slice(2, 6)}-${onlyDigits.slice(6)}`;
      } else if (onlyDigits.length === 11) {
        // celular: (99) 99999-9999
        out = `(${onlyDigits.slice(0, 2)}) ${onlyDigits.slice(2, 7)}-${onlyDigits.slice(7)}`;
      } else if (onlyDigits.length <= 2) {
        out = onlyDigits;
      }
      tel.value = out;
    });
  }

  function showStatus(msg, ok = false) {
    statusBox.textContent = msg;
    statusBox.style.color = ok ? "#2e7d32" : "#b71c1c";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return;
    sending = true;

    const nome = (form.nome?.value || "").trim();
    const email = (form.email?.value || "").trim();
    const telefone = (form.telefone?.value || "").trim();
    const mensagem = (form.mensagem?.value || "").trim();

    // Validações básicas
    if (!nome || !email || !mensagem) {
      showStatus("Por favor, preencha nome, e-mail e mensagem.");
      sending = false;
      return;
    }
    if (nome.length > 80) {
      showStatus("Nome muito longo (máx. 80 caracteres).");
      sending = false;
      return;
    }
    if (mensagem.length > 1000) {
      showStatus("Mensagem muito longa (máx. 1000 caracteres).");
      sending = false;
      return;
    }

    // Anti-spam client-side
    if (hp.value) {
      // bots costumam preencher o honeypot
      showStatus("Erro ao enviar. (código: HP01)");
      sending = false;
      return;
    }
    const elapsed = Date.now() - loadTime;
    if (elapsed < MIN_DELAY_MS) {
      showStatus("Envio muito rápido. Tente novamente em alguns segundos.");
      sending = false;
      return;
    }

    // UI de envio
    const originalText = submitBtn?.textContent;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";
    }
    showStatus("");

    // Monta payload (telefone sem formatação opcionalmente)
    const telefoneDigits = telefone.replace(/\D/g, "");

    const payload = {
      nome,
      email,
      telefone: telefoneDigits,
      mensagem,
      website: hp.value // honeypot
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // Tenta ler JSON mesmo em erro
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.status === "ok") {
        showStatus("Mensagem enviada com sucesso! Em breve entraremos em contato.", true);
        form.reset();
      } else {
        const msg = data?.message || data?.data?.message || "Não foi possível enviar agora. Tente novamente.";
        showStatus(msg);
      }
    } catch (err) {
      showStatus("Falha de rede. Verifique sua conexão e tente novamente.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText || "Enviar";
      }
      sending = false;
    }
  });
})();