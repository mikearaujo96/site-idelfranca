const API_BASE = "https://api.irmaidelfranca.org/wp-json/ihm/v1";
const urlParams = new URLSearchParams(window.location.search);
const projetoId = urlParams.get("id");

// Referências do DOM
const bannerImg   = document.getElementById("projeto-banner-img");
const tituloEl    = document.getElementById("projeto-titulo");
const pillDataEl  = document.getElementById("pill-data");
const pillLocalEl = document.getElementById("pill-local");
const descEl      = document.getElementById("projeto-descricao");

// KPIs / progresso
const kpiTotaisEl    = document.getElementById("kpi-totais");
const kpiOcupadasEl  = document.getElementById("kpi-ocupadas");
const kpiRestantesEl = document.getElementById("kpi-restantes");
const pctLabelEl     = document.getElementById("pct-label");
const progressFillEl = document.getElementById("progress-fill");
const vagasStatusEl  = document.getElementById("vagas-status");

// Form
const form      = document.getElementById("form-inscricao");
const msgStatus = document.getElementById("msg-status");
const hiddenId  = document.getElementById("projeto-id");
if (hiddenId) hiddenId.value = projetoId;

// Helpers
function formatarDataISO(isoDate) {
  if (!isoDate || !isoDate.includes("-")) return "";
  const [ano, mes, dia] = isoDate.split("-");
  return `${dia}/${mes}/${ano}`;
}
function pctOcupacao(totais, ocupadas) {
  if (!totais || totais <= 0) return 0;
  return Math.round((ocupadas / totais) * 100);
}

// Carregar detalhes do projeto
async function carregarProjeto() {
  try {
    const res = await fetch(`${API_BASE}/projetos/${projetoId}`);
    const p = await res.json();

    if (!res.ok) {
      tituloEl.textContent = "Projeto não encontrado";
      return;
    }

    const titulo   = p.titulo || "Projeto";
    const imagem   = p.imagem || "";
    const meta     = p.meta || {};
    const dataISO  = meta.data || "";
    const local    = meta.local || "A definir";
    const vagas    = meta.vagas || { totais: 0, ocupadas: 0, restantes: 0 };
    const conteudo = p.conteudo || "";

    if (bannerImg) {
      bannerImg.src = imagem;
      bannerImg.alt = titulo;
    }
    tituloEl.textContent = titulo;

    const dataFmt = formatarDataISO(dataISO);
    pillDataEl.innerHTML  = `<span class="material-symbols-outlined" style="font-size:18px;">calendar_month</span> ${dataFmt}`;
    pillLocalEl.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;">location_on</span> ${local}`;

    descEl.innerHTML = conteudo;

    const totais    = Number(vagas.totais || 0);
    const ocupadas  = Number(vagas.ocupadas || 0);
    const restantes = Number(vagas.restantes || 0);
    if (kpiTotaisEl)    kpiTotaisEl.textContent    = totais;
    if (kpiOcupadasEl)  kpiOcupadasEl.textContent  = ocupadas;
    if (kpiRestantesEl) kpiRestantesEl.textContent = restantes;

    const pct = pctOcupacao(totais, ocupadas);
    if (pctLabelEl)     pctLabelEl.textContent = `${pct}%`;
    if (progressFillEl) progressFillEl.style.width = `${pct}%`;

    if (vagasStatusEl) {
      const status = meta.status || "ativo";
      const statusMsg = status === "ativo"
        ? "Inscrições abertas"
        : (status === "encerrado" ? "Inscrições encerradas" : "Projeto cancelado");
      vagasStatusEl.textContent = `Ocupadas ${ocupadas} de ${totais} • Restantes ${restantes} • ${statusMsg}`;
    }
  } catch (e) {
    tituloEl.textContent = "Erro ao carregar o projeto";
    console.error(e);
  }
}

// Máscaras e restrições
document.addEventListener("DOMContentLoaded", () => {
  const cpfEl = document.getElementById("cpf");
  const telEl = document.getElementById("whatsapp");
  const nomeEl = document.getElementById("nome");
  const nascEl = document.getElementById("nascimento");

  if (cpfEl) {
    cpfEl.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
    });
  }

  if (telEl) {
    telEl.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "").slice(0, 11);
      if (v.length > 6) {
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      } else {
        e.target.value = v;
      }
    });
  }

  if (nomeEl) {
    nomeEl.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[0-9]/g, "").slice(0, 100);
    });
  }

  if (nascEl) {
    const hoje = new Date();
    const minDate = new Date(hoje.getFullYear() - 100, hoje.getMonth(), hoje.getDate())
      .toISOString().split("T")[0];
    nascEl.setAttribute("min", minDate);
    nascEl.setAttribute("max", hoje.toISOString().split("T")[0]);
  }
});

// Envio do formulário
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msgStatus) {
      msgStatus.textContent = "";
      msgStatus.style.color = "";
    }

    // Validação de idade básica no front (18–100 anos)
    const nascInput = document.getElementById("nascimento");
    if (nascInput && nascInput.value) {
      const nascimento = new Date(nascInput.value);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      if (idade < 0 || idade > 120) {
        msgStatus.textContent = "Data de nascimento inválida.";
        msgStatus.style.color = "red";
        return;
      }
    }

    const payload = {
      projeto_id: projetoId,
      nome:       (document.getElementById("nome")      ?.value || "").trim(),
      cpf:        (document.getElementById("cpf")       ?.value || "").replace(/\D/g, ""),
      email:      (document.getElementById("email")     ?.value || "").trim(),
      whatsapp:   (document.getElementById("whatsapp")  ?.value || "").trim(),
      nascimento: (document.getElementById("nascimento")?.value || ""),
      endereco:   (document.getElementById("endereco")  ?.value || "").trim()
    };

    try {
      const res  = await fetch(`${API_BASE}/inscricao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        msgStatus.textContent = data.message || "Erro ao enviar inscrição.";
        msgStatus.style.color = "red";
        return;
      }

      msgStatus.style.color = "#003c78";
      msgStatus.textContent = data.mensagem || "Inscrição enviada!";
      form.reset();

      carregarProjeto(); // atualizar KPIs
    } catch (err) {
      msgStatus.textContent = "Erro ao conectar com o servidor.";
      msgStatus.style.color = "red";
      console.error(err);
    }
  });
}

// Start
carregarProjeto();
