const API_BASE = "https://api.irmaidelfranca.org/wp-json/ihm/v1";
const lista = document.getElementById("projetos-lista");

// Formata data no padrão DD/MM/AAAA
function formatarData(isoDate) {
  if (!isoDate) return "";
  const [ano, mes, dia] = isoDate.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Carregar projetos da API
async function carregarProjetos() {
  try {
    const res = await fetch(`${API_BASE}/projetos`);
    const projetos = await res.json();

    if (!Array.isArray(projetos) || !projetos.length) {
      lista.innerHTML = "<p>Nenhum projeto disponível no momento.</p>";
      return;
    }

    lista.innerHTML = projetos.map(p => `
      <div class="projeto-card">
        <h3>${p.titulo}</h3>
        <p class="projeto-info"><strong>Data:</strong> ${formatarData(p.meta.data)}</p>
        <p class="projeto-info"><strong>Vagas disponíveis:</strong> ${p.meta.vagas.restantes} de ${p.meta.vagas.totais}</p>
        <p class="projeto-info">${p.resumo}</p>
        ${
          p.meta.status === "ativo"
            ? `<a class="btn-inscrever" href="inscricao-projeto.html?id=${p.id}">Inscreva-se</a>`
            : `<p style="color:#a00;font-weight:bold;">Inscrições encerradas</p>`
        }
      </div>
    `).join("");
  } catch (err) {
    console.error("Erro ao carregar projetos:", err);
    lista.innerHTML = "<p>Erro ao carregar projetos.</p>";
  }
}

// Inicializa
carregarProjetos();
