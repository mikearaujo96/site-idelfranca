// --- Modal Pix ---
const btnPix = document.getElementById('btn-pix');
const modalPix = document.getElementById('pix-modal');
const closePix = document.getElementById('pix-close');
const btnCopiar = document.getElementById('copiar-chave');
const inputChave = document.getElementById('pix-chave');
const copiarMsg = document.getElementById('copiar-msg');

// Abrir modal
btnPix.addEventListener('click', () => {
  modalPix.style.display = 'flex';
});

// Fechar modal
closePix.addEventListener('click', () => {
  modalPix.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if (e.target === modalPix) modalPix.style.display = 'none';
});

// Copiar chave Pix
btnCopiar.addEventListener('click', () => {
  inputChave.select();
  inputChave.setSelectionRange(0, 99999); // para mobile
  navigator.clipboard.writeText(inputChave.value).then(() => {
    copiarMsg.textContent = "Chave copiada!";
    setTimeout(() => copiarMsg.textContent = "", 2000);
  });
});

// --- Formulário ---
const form = document.getElementById('form-doacao');
const msgStatus = document.getElementById('msg-status');

// Inputs extras
const telefoneInput = document.getElementById("telefone");
const cpfcnpjInput = document.getElementById("cpfcnpj");
const comprovanteInput = document.getElementById("comprovante");

// Máscara telefone
telefoneInput.addEventListener("input", () => {
  let v = telefoneInput.value.replace(/\D/g, "");
  if (v.length > 10) {
    telefoneInput.value = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (v.length > 5) {
    telefoneInput.value = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (v.length > 2) {
    telefoneInput.value = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    telefoneInput.value = v.replace(/^(\d*)/, "($1");
  }
});


// Máscara CPF/CNPJ com limite de caracteres
cpfcnpjInput.addEventListener("input", () => {
  let v = cpfcnpjInput.value.replace(/\D/g, "");

  // limitar no máximo 14 dígitos (CNPJ)
  if (v.length > 14) {
    v = v.slice(0, 14);
  }

  if (v.length <= 11) {
    // CPF: 000.000.000-00
    cpfcnpjInput.value = v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // CNPJ: 00.000.000/0000-00
    cpfcnpjInput.value = v
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
});

// --- Formatar campo de valor ---
const valorInput = document.getElementById("valor");

valorInput.addEventListener("input", () => {
  let v = valorInput.value.replace(/\D/g, ""); // mantém só números
  if (!v) {
    valorInput.value = "";
    return;
  }

  // transforma em número com 2 casas decimais
  v = (parseInt(v, 10) / 100).toFixed(2);

  // formata no padrão brasileiro
  valorInput.value = v
    .replace(".", ",")              // vírgula para centavos
    .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // pontos para milhares
});



// Validação do formulário
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = telefoneInput.value.trim();
  const cpfcnpj = cpfcnpjInput.value.trim();
  const valor = document.getElementById('valor').value.trim();
  const comprovante = comprovanteInput.files[0];

  if (!nome || !email || !telefone || !cpfcnpj || !valor) {
    msgStatus.textContent = "Preencha todos os campos obrigatórios!";
    msgStatus.style.color = "red";
    return;
  }

  msgStatus.textContent = `Obrigado ${nome}! Sua doação de R$ ${valor} foi registrada.`;
  msgStatus.style.color = "#003c78";

  if (comprovante) {
    msgStatus.textContent += " (Comprovante anexado)";
  }

  form.reset();
});
