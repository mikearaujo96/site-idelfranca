// animationHome.js
document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(
    // Sessão Fazemos
    ".titulo-fazemos h2, .titulo-fazemos div p, .titulo-fazemos .btn, .cards-fazemos .card," +
    // Sessão Impacto
    ".impacto-img img, .impacto-conteudo h2, .impacto-conteudo p, .btn-impacto," +
    // Sessão Apoio
    ".apoio-img img, .apoio-conteudo h2, .apoio-conteudo p, .btn-apoio"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        observer.unobserve(entry.target); // 👈 para não remover nem reexecutar
      }
    });
  }, { threshold: 0.2 });

  elementos.forEach(el => observer.observe(el));
});
