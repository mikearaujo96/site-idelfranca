// Animações com IntersectionObserver (Sobre)
document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(
    ".mvv-card, .equipe-card, .atuacao, .sobre-hero h1, .sobre-hero p, .quem-somos h2, .quem-somos p, .equipe h2"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
      } else {
        entry.target.classList.remove("reveal");
      }
    });
  }, { threshold: 0.3 });

  elementos.forEach(el => observer.observe(el));
});
