// load
document.addEventListener("DOMContentLoaded", () => {
  const counter = document.getElementById("loader-counter");
  const loader = document.getElementById("loader");
  const loaderTop = document.querySelector(".loader-top");
  const loaderBottom = document.querySelector(".loader-bottom");

  let value = 0;
  let interval;
  let siteLoaded = false;

  function finishLoader() {
    // faz o número desaparecer junto com as cortinas
    counter.style.opacity = "0";

    // animação cortina → azul sobe, amarelo desce
    loaderTop.style.transform = "translateY(-100%)";
    loaderBottom.style.transform = "translateY(100%)";

    // remover loader depois da transição
    setTimeout(() => {
      loader.style.display = "none";
    }, 1000); // tempo da animação das cortinas
  }

  // contador progressivo
  interval = setInterval(() => {
    if (value < 99) {
      value++;
      counter.textContent = value + "%";
    } else {
      // trava em 99% até o site terminar de carregar
      counter.textContent = "99%";
    }
  }, 20); // velocidade da contagem (20ms → ~2s até 99%)

  // quando o site terminar de carregar
  window.onload = () => {
    siteLoaded = true;
    clearInterval(interval);

    // garante que o contador vá até 100%
    let finalInterval = setInterval(() => {
      if (value < 100) {
        value++;
        counter.textContent = value + "%";
      }
      if (value >= 100) {
        clearInterval(finalInterval);
        finishLoader();
      }
    }, 20);
  };
});
