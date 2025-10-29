// Animações de entrada + contadores
document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(
    ".impacto-hero h1, .impacto-hero p, .numero-card, .impacto-linha-tempo li, .historia-card, .impacto-historias h2"
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
      } else {
        entry.target.classList.remove("reveal");
      }
    });
  }, { threshold: 0.2 });

  elementos.forEach(el => observer.observe(el));

  // Animação dos contadores
  const contadores = document.querySelectorAll(".contador");
  const observerContadores = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const contador = entry.target;
        const alvo = +contador.getAttribute("data-alvo");
        let valor = 0;
        const incremento = Math.ceil(alvo / 200);
        const atualizar = () => {
          valor += incremento;
          if (valor > alvo) valor = alvo;
          contador.textContent = "+ " + valor.toLocaleString("pt-BR");
          if (valor < alvo) requestAnimationFrame(atualizar);
        };
        atualizar();
        observerContadores.unobserve(contador);
      }
    });
  }, { threshold: 0.5 });

  contadores.forEach(c => observerContadores.observe(c));
});
