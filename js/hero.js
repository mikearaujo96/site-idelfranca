const slides = document.querySelectorAll('.slide');
const controls = document.querySelectorAll('.slide-controls button');

let currentIndex = 0;
let slideInterval;
const intervalTime = 15000; // 15s

// ======================
// Função de troca
// ======================
function showSlide(nextIndex) {
    if (nextIndex === currentIndex) return;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[nextIndex];

    let diff = nextIndex - currentIndex;

    // Prepara próximo slide
    nextSlide.style.transition = "none";
    nextSlide.style.transform = diff > 0 ? "translateX(100%)" : "translateX(-100%)";
    nextSlide.style.zIndex = 2;

    requestAnimationFrame(() => {
        // Anima entrada
        nextSlide.style.transition = "transform 0.6s ease";
        nextSlide.style.transform = "translateX(0)";

        // Atualiza controles
        controls.forEach(c => c.classList.remove("active"));
        controls[nextIndex].classList.add("active");

        // Quando terminar animação
        nextSlide.addEventListener("transitionend", () => {
            currentSlide.classList.remove("active");
            currentSlide.style.transform = diff > 0 ? "translateX(-100%)" : "translateX(100%)";
            currentSlide.style.zIndex = 0;

            nextSlide.classList.add("active");
            nextSlide.style.zIndex = 1;

            currentIndex = nextIndex;
        }, { once: true });
    });
}

// ======================
// Automático
// ======================
function nextSlideAuto() {
    let nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
}

function prevSlideAuto() {
    let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
}

function startSlideShow() {
    stopSlideShow();
    slideInterval = setInterval(nextSlideAuto, intervalTime);
}

function stopSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
}

// ======================
// Controles manuais
// ======================
controls.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        showSlide(i);
        startSlideShow();
    });
});

// ======================
// Swipe / Touch
// ======================
let startX = 0;
let endX = 0;
const banner = document.getElementById("banner");

banner.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    stopSlideShow();
});

banner.addEventListener("touchmove", (e) => {
    endX = e.touches[0].clientX;
});

banner.addEventListener("touchend", () => {
    let diffX = endX - startX;

    if (Math.abs(diffX) > 50) {
        if (diffX < 0) {
            nextSlideAuto();
        } else {
            prevSlideAuto();
        }
    }
    startSlideShow();
});

// ======================
// Inicialização
// ======================
slides.forEach((s, i) => {
    if (i !== 0) {
        s.style.transform = "translateX(100%)";
    }
});
slides[0].classList.add("active");
controls[0].classList.add("active");
startSlideShow();
