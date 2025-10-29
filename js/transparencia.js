// Dados fictícios para teste (pode puxar de API futuramente)

// Relatórios anuais
const relatorios = [
  { ano: 2025, link: "docs/relatorio-2025.pdf" },
  { ano: 2024, link: "docs/relatorio-2024.pdf" },
  { ano: 2023, link: "docs/relatorio-2023.pdf" },
  { ano: 2022, link: "docs/relatorio-2022.pdf" },
  { ano: 2021, link: "docs/relatorio-2021.pdf" },
  { ano: 2020, link: "docs/relatorio-2020.pdf" },
  { ano: 2019, link: "docs/relatorio-2019.pdf" }
];

// Termos de fomento
const termos = [
  { numero: "Processando...", secretaria: "Esportes e Lazer", link: "" },
  // { numero: "Processando...", secretaria: "Esportes e Lazer", link: "docs/termo-esportes.pdf" },

];

// Prestação de contas
const contas = [
  { ano: 2025, receitas: "Processando...", despesas: "Processando...", saldo: "Processando..." },
  { ano: 2024, receitas: "Processando...", despesas: "Processando...", saldo: "Processando..." },
  { ano: 2023, receitas: "Processando...", despesas: "Processando...", saldo: "Processando..." },
  { ano: 2022, receitas: "Processando...", despesas: "Processando...", saldo: "Processando..." },
  { ano: 2021, receitas: "Processando...", despesas: "Processando...", saldo: "Processando..." },
  { ano: 2020, receitas: "Processando...", despesas: "Processando...", saldo: "Processando..." },
  { ano: 2019, receitas: "Processando...", despesas: "Processando...", saldo: "Processando..." }
];

// Preencher relatórios
const listaRelatorios = document.getElementById("lista-relatorios");
listaRelatorios.innerHTML = relatorios.map(r => `
  <li>
    <span>Relatório ${r.ano}</span>
    <a href="#" onclick="openTransparenciaPopup('relatorio de ${r.ano}')">Baixar PDF</a>
    <!-- <a href="${r.link}" target="_blank">Baixar PDF</a> -->
  </li>
`).join("");

// Preencher termos
const listaTermos = document.getElementById("lista-termos");
listaTermos.innerHTML = termos.map(t => `
  <li>
    <span>Termo ${t.numero} — ${t.secretaria}</span>
    <a href="#" onclick="openTransparenciaPopup('termos')">Visualizar</a>
   <!-- <a href="${t.link}" target="_blank">Visualizar</a> --> 
  </li>
`).join("");

// Preencher tabela de contas
const tabela = document.querySelector("#tabela-contas tbody");
tabela.innerHTML = contas.map(c => `
  <tr>
    <td>${c.ano}</td>
    <td>R$ ${c.receitas.toLocaleString("pt-BR")}</td>
    <td>R$ ${c.despesas.toLocaleString("pt-BR")}</td>
    <td>R$ ${c.saldo.toLocaleString("pt-BR")}</td>
  </tr>
`).join("");
