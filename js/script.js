/* ========================================
   GEASIS v5 - Scripts Completos
   Modo Oscuro/Claro + Animaciones Premium
======================================== */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initNavScroll();
  initHeroAnimations();
  initSmoothScroll();
  initWorkflowSlider();
  initEmbudoAnimations();
  initTestimonialsAnimations();
  initModulesAnimations();
  initModals();
  initPlatformAnimations();
  initDemoModal();
  initAppMobile();
  initScrollToTop();
  initMicrointeractions();
  initFAQ();
  initPricingAnimations();
});

/* ========== TEMA OSCURO/CLARO ========== */
function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  const html = document.documentElement;
  const videoDark = document.getElementById("video-dark");
  const videoLight = document.getElementById("video-light");

  // Cargar tema guardado o usar oscuro por defecto
  const savedTheme = localStorage.getItem("geasis-theme") || "dark";
  html.setAttribute("data-theme", savedTheme);

  // Activar el video correcto al cargar
  updateVideo(savedTheme);

  toggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("geasis-theme", newTheme);

    // Cambiar video
    updateVideo(newTheme);

    // Forzar actualización de carruseles móviles
    refreshAllMobileCarousels();

    // Animación del toggle
    gsap.fromTo(
      toggle,
      { rotate: 0, scale: 1 },
      {
        rotate: 360,
        scale: 1.1,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => gsap.to(toggle, { scale: 1, duration: 0.2 }),
      },
    );
  });

  function updateVideo(theme) {
    if (!videoDark || !videoLight) return;

    if (theme === "dark") {
      videoDark.classList.add("active");
      videoLight.classList.remove("active");
      // Pausar el video inactivo para ahorrar recursos
      videoLight.pause();
      videoDark.play();
    } else {
      videoDark.classList.remove("active");
      videoLight.classList.add("active");
      // Pausar el video inactivo para ahorrar recursos
      videoDark.pause();
      videoLight.play();
    }
  }
}

/* ========== NAV SCROLL ========== */
function initNavScroll() {
  const nav = document.querySelector(".nav");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    nav.style.transform =
      currentScroll > lastScroll && currentScroll > 200
        ? "translateY(-100%)"
        : "translateY(0)";
    lastScroll = currentScroll;
  });
}

/* ========== HERO ANIMATIONS ========== */
function initHeroAnimations() {
  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    gsap.to(heroVideo, {
      y: 150,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  }

  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    gsap.to(heroContent, {
      opacity: 0,
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "center center",
        end: "bottom top",
        scrub: 1,
      },
    });
  }

  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    gsap.to(scrollIndicator, {
      opacity: 0,
      y: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "20% top",
        scrub: 1,
      },
    });
  }
}

/* ========== SMOOTH SCROLL ========== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const navHeight = document.querySelector(".nav").offsetHeight;
        window.scrollTo({
          top: target.offsetTop - navHeight,
          behavior: "smooth",
        });
      }
    });
  });
}

/* ========== WORKFLOW SLIDER ========== */
function initWorkflowSlider() {
  const progressSteps = document.querySelectorAll(".progress-step");
  const progressFill = document.querySelector(".progress-fill");
  const slides = document.querySelectorAll(".workflow-slide");

  if (progressSteps.length === 0) return;

  let currentSlide = 1;
  const totalSlides = slides.length;
  let autoPlayInterval = null;
  const autoPlayDelay = 6000;

  // Click en pasos
  progressSteps.forEach((step, index) => {
    step.addEventListener("click", () => {
      goToSlide(index + 1);
      restartAutoPlay();
    });
  });

  function goToSlide(slideNumber) {
    if (slideNumber === currentSlide) return;
    currentSlide = slideNumber;

    // Actualizar progreso
    progressFill.style.width = `${(slideNumber / totalSlides) * 100}%`;

    // Actualizar pasos
    progressSteps.forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.remove("active", "completed");
      if (stepNum < slideNumber) step.classList.add("completed");
      else if (stepNum === slideNumber) step.classList.add("active");
    });

    // Cambiar slide
    slides.forEach((slide) => {
      slide.classList.remove("active");
      if (parseInt(slide.dataset.slide) === slideNumber) {
        slide.classList.add("active");
        // Iniciar animaciones específicas del slide
        initSlideAnimations(slideNumber);
      }
    });
  }

  function startAutoPlay() {
    if (autoPlayInterval) return;
    autoPlayInterval = setInterval(() => {
      let nextSlide = currentSlide + 1;
      if (nextSlide > totalSlides) nextSlide = 1;
      goToSlide(nextSlide);
    }, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Iniciar
  startAutoPlay();
  initSlideAnimations(1);

  // Animaciones de entrada
  gsap.from(".workflow-header", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".workflow-section",
      start: "top 70%",
      once: true,
    },
  });
}

/* ========== ANIMACIONES POR SLIDE ========== */
function initSlideAnimations(slideNumber) {
  switch (slideNumber) {
    case 3:
      animateRetryDots();
      break;
    case 4:
      animateCalendar();
      break;
    case 5:
      animateNotifications("preventiveNotifs");
      break;
    case 6:
      animateNotifications("correctiveNotifs");
      animateEscalation();
      break;
  }
}

/* ========== ANIMACIÓN DE REINTENTOS ========== */
function animateRetryDots() {
  const retryDots = document.querySelectorAll(".retry-dot");
  const successMsg = document.getElementById("retrySuccessMsg");

  if (retryDots.length === 0) return;

  // Reset
  retryDots.forEach((dot) => dot.classList.remove("active"));
  successMsg.classList.remove("show");

  let currentDot = 0;
  const delays = [0, 800, 1600, 2400];

  function animateDot(index) {
    if (index >= retryDots.length) {
      // Mostrar mensaje de éxito
      setTimeout(() => {
        successMsg.classList.add("show");
      }, 300);
      return;
    }

    setTimeout(() => {
      // Quitar active de todos
      retryDots.forEach((d) => d.classList.remove("active"));
      // Activar el actual
      retryDots[index].classList.add("active");

      // Siguiente
      animateDot(index + 1);
    }, delays[index]);
  }

  animateDot(0);
}

/* ========== ANIMACIÓN DE CALENDARIO ========== */
function animateCalendar() {
  const calDays = document.querySelectorAll(".cal-d.cobro");
  const successMsg = document.getElementById("calendarSuccessMsg");
  const toast = document.getElementById("paymentToast");

  if (calDays.length === 0) return;

  // Reset
  calDays.forEach((day) => {
    day.classList.remove("active", "success");
  });
  successMsg.classList.remove("show");
  toast.classList.remove("show");

  let currentDay = 0;

  function animateDay() {
    if (currentDay >= calDays.length) {
      // Mostrar éxito
      setTimeout(() => {
        calDays.forEach((d) => d.classList.add("success"));
        successMsg.classList.add("show");
        toast.classList.add("show");
      }, 300);
      return;
    }

    // Quitar active de todos
    calDays.forEach((d) => d.classList.remove("active"));

    // Activar el actual
    calDays[currentDay].classList.add("active");

    currentDay++;
    setTimeout(animateDay, 600);
  }

  setTimeout(animateDay, 500);
}

/* ========== ANIMACIÓN DE NOTIFICACIONES ========== */
function animateNotifications(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const notifs = container.querySelectorAll(".m-notif");

  // Reset
  notifs.forEach((notif) => notif.classList.remove("visible"));

  // Animar con delay
  notifs.forEach((notif, index) => {
    setTimeout(
      () => {
        notif.classList.add("visible");
      },
      200 + index * 300,
    );
  });

  // Actualizar hora en tiempo real
  updateNotificationTime();
}

function updateNotificationTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  const timeElements = document.querySelectorAll("#notifTime1, #notifTime2");
  timeElements.forEach((el) => {
    if (el) el.textContent = timeStr;
  });
}

/* ========== ANIMACIÓN DE ESCALAMIENTO ========== */
function animateEscalation() {
  const levels = document.querySelectorAll(".esc-lvl");

  // Reset
  levels.forEach((lvl) => lvl.classList.remove("active"));

  let current = 0;

  function activateLevel() {
    if (current >= levels.length) {
      current = 0;
    }

    levels.forEach((lvl) => lvl.classList.remove("active"));
    levels[current].classList.add("active");

    current++;
  }

  activateLevel();
  setInterval(activateLevel, 1500);
}

/* ========== EMBUDO (KPIs) ANIMATIONS ========== */
function initEmbudoAnimations() {
  const embudoCards = document.querySelectorAll(".embudo-card");

  if (embudoCards.length === 0) return;

  ScrollTrigger.create({
    trigger: ".embudo-grid",
    start: "top 75%",
    once: true,
    onEnter: () => {
      embudoCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("visible");
          animateEmbudoMetrics(card);
        }, index * 200);
      });
    },
  });

  gsap.from(".embudo-header", {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".embudo-section",
      start: "top 70%",
      once: true,
    },
  });

  gsap.from(".vp-item", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".value-props",
      start: "top 85%",
      once: true,
    },
  });
}

function animateEmbudoMetrics(card) {
  const metricVals = card.querySelectorAll(".em-val");

  metricVals.forEach((val) => {
    const target = parseInt(val.dataset.target);
    if (!target) return;

    gsap.to(val, {
      duration: 1.5,
      ease: "power2.out",
      onUpdate: function () {
        val.textContent = Math.round(target * this.progress());
      },
    });
  });
}

/* ========== PLATFORM ANIMATIONS ========== */
function initPlatformAnimations() {
  gsap.from(".platform-header", {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".platform-section",
      start: "top 70%",
      once: true,
    },
  });

  // Animar los ERP items
  const erpItems = document.querySelectorAll(".erp-item");

  ScrollTrigger.create({
    trigger: ".erp-grid",
    start: "top 80%",
    once: true,
    onEnter: () => {
      erpItems.forEach((item, index) => {
        setTimeout(() => {
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          });
        }, index * 100);
      });
    },
  });

  gsap.from(".stores-cta", {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".stores-cta",
      start: "top 85%",
      once: true,
    },
  });

  gsap.from(".footer-main", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".footer",
      start: "top 90%",
      once: true,
    },
  });
}

/* ========== CONSOLE LOG ========== */
console.log(
  "%c GEASIS v5 - Modo Oscuro/Claro Activado 🌙☀️ ",
  "background: linear-gradient(135deg, #00BCD4, #00E5FF); color: #000; font-size: 16px; font-weight: bold; padding: 12px 24px; border-radius: 8px;",
);

/* ========== TESTIMONIALS ANIMATIONS ========== */
function initTestimonialsAnimations() {
  const testimonialCards = document.querySelectorAll(".testimonial-card");

  if (testimonialCards.length === 0) return;

  ScrollTrigger.create({
    trigger: ".testimonials-grid",
    start: "top 75%",
    once: true,
    onEnter: () => {
      testimonialCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("visible");
        }, index * 150);
      });
    },
  });

  gsap.from(".testimonials-header", {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".testimonials-section",
      start: "top 70%",
      once: true,
    },
  });

  gsap.from(".testimonials-logos", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".testimonials-logos",
      start: "top 85%",
      once: true,
    },
  });
}

/* ========== MODULES ANIMATIONS ========== */
/* ========== MODULES ANIMATIONS ========== */
function initModulesAnimations() {
  const moduleCards = document.querySelectorAll(".module-card");

  if (moduleCards.length === 0) return;

  ScrollTrigger.create({
    trigger: ".modules-grid",
    start: "top 75%",
    once: true,
    onEnter: () => {
      moduleCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("visible");
        }, index * 200);
      });
    },
  });

  gsap.from(".modules-header", {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".modules-section",
      start: "top 70%",
      once: true,
    },
  });
}

/* ========== SISTEMA DE CARRUSEL PARA MODALES ========== */
class ImageCarousel {
  constructor(container, images, autoplayInterval = 2500) {
    this.container = container;
    this.images = images;
    this.currentIndex = 0;
    this.autoplayInterval = autoplayInterval;
    this.autoplayTimer = null;
    this.isTransitioning = false;

    this.init();
  }

  init() {
    if (!this.images || this.images.length === 0) {
      console.error("No images provided to carousel");
      return;
    }

    this.render();
    this.setupControls();
    this.startAutoplay();
  }

  render() {
    const track = this.container.querySelector(".carousel-track");
    if (!track) return;

    track.innerHTML = "";

    this.images.forEach((image, index) => {
      const slide = document.createElement("div");
      slide.className = `carousel-slide${index === 0 ? " active" : ""}`;
      slide.innerHTML = `<img src="${image}" alt="Imagen ${index + 1}" loading="lazy">`;
      track.appendChild(slide);
    });

    this.updateControls();
  }

  setupControls() {
    const prevBtn = this.container.querySelector(".carousel-nav.prev");
    const nextBtn = this.container.querySelector(".carousel-nav.next");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.prev();
        this.resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.next();
        this.resetAutoplay();
      });
    }

    const dots = this.container.querySelectorAll(".carousel-dot");
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.goTo(index);
        this.resetAutoplay();
      });
    });
  }

  updateControls() {
    const counter = this.container.querySelector(".carousel-counter");
    if (counter) {
      counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }

    const dotsContainer = this.container.querySelector(".carousel-controls");
    if (dotsContainer) {
      dotsContainer.innerHTML = "";

      this.images.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.className = `carousel-dot${index === this.currentIndex ? " active" : ""}`;
        dot.addEventListener("click", () => {
          this.goTo(index);
          this.resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }
  }

  goTo(index) {
    if (this.isTransitioning || index === this.currentIndex) return;

    this.isTransitioning = true;
    const slides = this.container.querySelectorAll(".carousel-slide");

    slides[this.currentIndex].classList.add("exit");
    slides[this.currentIndex].classList.remove("active");

    setTimeout(() => {
      slides[this.currentIndex].classList.remove("exit");
      this.currentIndex = index;
      slides[this.currentIndex].classList.add("active");
      this.updateControls();
      this.isTransitioning = false;
    }, 100);
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    this.goTo(nextIndex);
  }

  prev() {
    const prevIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.goTo(prevIndex);
  }

  startAutoplay() {
    if (this.images.length <= 1) return;

    this.autoplayTimer = setInterval(() => {
      this.next();
    }, this.autoplayInterval);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }

  destroy() {
    this.stopAutoplay();
  }
}

/* ========== GESTIÓN DE MODALES CON CARRUSEL ========== */
const modulesData = {
  administrativo: {
    title: "Módulo Administrativo",
    description: "Sistema completo de gestión administrativa",
    images: [
      "assets/images/administrativo/img1.png",
      "assets/images/administrativo/img2.png",
      "assets/images/administrativo/img3.png",
    ],
    features: [
      "Control total de operaciones administrativas",
      "Gestión de documentos y archivos digitales",
      "Reportes y análisis en tiempo real",
      "Automatización de procesos administrativos",
      "Integración con otros módulos del sistema",
    ],
  },
  admisiones: {
    title: "Módulo de Admisiones",
    description: "Gestión integral del proceso de admisión",
    images: [
      "assets/images/admisiones/img1.png",
      "assets/images/admisiones/img2.png",
      "assets/images/admisiones/img3.png",
      "assets/images/admisiones/img4.png",
      "assets/images/admisiones/img5.png",
      "assets/images/admisiones/img6.png",
    ],
    features: [
      "Proceso de inscripción digital",
      "Seguimiento de aspirantes en tiempo real",
      "Evaluación y selección automatizada",
      "Portal para aspirantes y padres",
      "Generación de reportes de admisión",
    ],
  },
  mentoria: {
    title: "Módulo de Mentoría",
    description: "Plataforma de acompañamiento estudiantil",
    images: [
      "assets/images/mentoria/img1.png",
      "assets/images/mentoria/img2.png",
      "assets/images/mentoria/img3.png",
    ],
    features: [
      "Asignación inteligente de mentores",
      "Seguimiento personalizado de estudiantes",
      "Programación de sesiones y reuniones",
      "Registro de avances y observaciones",
      "Comunicación directa mentor-estudiante",
    ],
  },
};

let currentCarousel = null;
let featureAnimationTimer = null;

function openModal(moduleType) {
  const modal = document.getElementById("moduleModal");
  const data = modulesData[moduleType];

  if (!modal || !data) return;

  const modalTitle = modal.querySelector("h2");
  const modalDesc = modal.querySelector(".modal-header p");
  const carouselContainer = modal.querySelector(".modal-image-carousel");
  const featuresList = modal.querySelector(".modal-features ul");

  if (modalTitle) modalTitle.textContent = data.title;
  if (modalDesc) modalDesc.textContent = data.description;

  if (carouselContainer) {
    carouselContainer.innerHTML = `
            <div class="carousel-track"></div>
            <button class="carousel-nav prev" aria-label="Imagen anterior">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button class="carousel-nav next" aria-label="Imagen siguiente">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
            <div class="carousel-counter">1 / ${data.images.length}</div>
            <div class="carousel-controls"></div>
        `;

    currentCarousel = new ImageCarousel(carouselContainer, data.images, 2500);
  }

  if (featuresList) {
    featuresList.innerHTML = "";
    data.features.forEach((feature, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${feature}</span>
            `;
      featuresList.appendChild(li);

      setTimeout(
        () => {
          li.classList.add("visible");
        },
        100 + index * 150,
      );
    });
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("moduleModal");
  if (!modal) return;

  if (currentCarousel) {
    currentCarousel.destroy();
    currentCarousel = null;
  }

  if (featureAnimationTimer) {
    clearTimeout(featureAnimationTimer);
    featureAnimationTimer = null;
  }

  modal.classList.remove("active");
  document.body.style.overflow = "";
}

/* ========== MODALES ========== */
function initModals() {
  const moduleCards = document.querySelectorAll(".module-card");

  moduleCards.forEach((card) => {
    const moduleBtn = card.querySelector(".module-btn");
    const moduleType = card.getAttribute("data-module");

    if (moduleBtn && moduleType) {
      moduleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(moduleType);
      });

      card.addEventListener("click", () => {
        openModal(moduleType);
      });
    }
  });

  const closeBtn = document.querySelector("#moduleModal .modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  const modalOverlay = document.getElementById("moduleModal");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
}

/* ========== DEMO MODAL ========== */
function initDemoModal() {
  const demoModal = document.getElementById("demoModal");
  const closeDemoBtn = document.getElementById("closeDemoModal");
  const demoForm = document.getElementById("demoForm");
  const formMessage = document.getElementById("formMessage");

  const demoBtns = document.querySelectorAll(
    ".btn-primary:not(#btnPersonalizedDemo), .nav-cta",
  );

  demoBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      demoModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  closeDemoBtn.addEventListener("click", () => {
    demoModal.classList.remove("active");
    document.body.style.overflow = "";
  });

  demoModal.addEventListener("click", (e) => {
    if (e.target === demoModal) {
      demoModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && demoModal.classList.contains("active")) {
      demoModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  demoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = demoForm.querySelector(".btn-submit");
    const originalText = submitBtn.querySelector("span").textContent;

    submitBtn.disabled = true;
    submitBtn.querySelector("span").textContent = "Enviando...";

    const formData = new FormData(demoForm);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/contacto@geasis.com.mx",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `Nueva solicitud de demo - ${data.organizacion}`,
            _template: "table",
            Nombre: data.nombre,
            Correo: data.correo,
            Teléfono: data.telefono,
            Organización: data.organizacion,
            "Tipo de Institución": data.tipoInstitucion,
            "Número de Estudiantes":
              data.numeroEstudiantes || "No especificado",
            Cargo: data.cargo || "No especificado",
            Ciudad: data.ciudad || "No especificado",
            Mensaje: data.mensaje || "Sin mensaje adicional",
          }),
        },
      );

      if (response.ok) {
        formMessage.className = "form-message success";
        formMessage.textContent =
          "¡Solicitud enviada! Te contactaremos pronto.";
        demoForm.reset();

        setTimeout(() => {
          demoModal.classList.remove("active");
          document.body.style.overflow = "";
          formMessage.style.display = "none";
        }, 3000);
      } else {
        throw new Error("Error al enviar");
      }
    } catch (error) {
      formMessage.className = "form-message error";
      formMessage.textContent = "Hubo un error. Por favor intenta de nuevo.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector("span").textContent = originalText;
    }
  });
}

/* ========== CONSOLE LOG ========== */
console.log(
  "%c GEASIS v5 - Sistema de Carrusel Activado 🎠 ",
  "background: linear-gradient(135deg, #00BCD4, #00E5FF); color: #000; font-size: 16px; font-weight: bold; padding: 12px 24px; border-radius: 8px;",
);

/* ========== APP MOBILE CAROUSEL ========== */
class MobileCarousel {
  constructor(container, images) {
    this.container = container;
    this.images = images;
    this.currentIndex = 0;
    this.isTransitioning = false;

    this.slidesContainer = container.querySelector(".mobile-slides");
    this.counter = container.querySelector(".mobile-counter");
    this.controlsContainer = container.querySelector(".mobile-controls");
    this.prevBtn = container.querySelector(".mobile-nav.prev");
    this.nextBtn = container.querySelector(".mobile-nav.next");

    // VALIDACIÓN CRÍTICA
    if (!this.slidesContainer || !this.controlsContainer) {
      console.error(
        "❌ Faltan elementos requeridos en el carrusel:",
        container,
      );
      return;
    }

    this.init();
  }

  init() {
    // Limpiar contenido anterior
    this.slidesContainer.innerHTML = "";
    this.controlsContainer.innerHTML = "";

    // Crear slides
    this.images.forEach((img, index) => {
      const slide = document.createElement("div");
      slide.className = "mobile-slide";
      if (index === 0) slide.classList.add("active");

      const imgElement = document.createElement("img");
      imgElement.src = img;
      imgElement.alt = `Screenshot ${index + 1}`;
      imgElement.loading = "lazy";

      slide.appendChild(imgElement);
      this.slidesContainer.appendChild(slide);
    });

    // Crear dots si hay múltiples imágenes
    if (this.images.length > 1) {
      this.images.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.className = "mobile-dot";
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => this.goToSlide(index));
        this.controlsContainer.appendChild(dot);
      });

      // Event listeners para navegación
      if (this.prevBtn) {
        this.prevBtn.addEventListener("click", () => this.prev());
        this.prevBtn.style.display = "flex";
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener("click", () => this.next());
        this.nextBtn.style.display = "flex";
      }
    } else {
      // Ocultar controles si solo hay 1 imagen
      if (this.prevBtn) this.prevBtn.style.display = "none";
      if (this.nextBtn) this.nextBtn.style.display = "none";
      if (this.controlsContainer) this.controlsContainer.style.display = "none";
    }

    // Actualizar contador
    this.updateCounter();

    // Auto-play solo si hay múltiples imágenes
    if (this.images.length > 1) {
      this.startAutoPlay();
    }
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;

    this.isTransitioning = true;
    const slides = this.slidesContainer.querySelectorAll(".mobile-slide");
    const dots = this.controlsContainer.querySelectorAll(".mobile-dot");

    // Animar salida del slide actual
    slides[this.currentIndex].classList.add("exit");
    slides[this.currentIndex].classList.remove("active");
    if (dots[this.currentIndex])
      dots[this.currentIndex].classList.remove("active");

    // Animar entrada del nuevo slide
    setTimeout(() => {
      slides[this.currentIndex].classList.remove("exit");
      slides[index].classList.add("active");
      if (dots[index]) dots[index].classList.add("active");

      this.currentIndex = index;
      this.updateCounter();

      // ✅ AGREGAR ESTAS 3 LÍNEAS:
      if (this.onSlideComplete) {
        this.onSlideComplete(index, index === this.images.length - 1);
      }

      this.isTransitioning = false;
    }, 400);
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    this.goToSlide(nextIndex);
    if (this.autoPlayInterval) this.restartAutoPlay();
  }

  prev() {
    const prevIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.goToSlide(prevIndex);
    if (this.autoPlayInterval) this.restartAutoPlay();
  }

  updateCounter() {
    if (this.counter) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 4000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  restartAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  destroy() {
    this.stopAutoPlay();
  }

  // Callback para notificar cuando termina un slide
  onSlideComplete = null;

  // Método para detectar si está en la última imagen
  isOnLastSlide() {
    return this.currentIndex === this.images.length - 1;
  }
}

/* ========== CONFIGURACIÓN DE IMÁGENES POR SECCIÓN ========== */
const appMobileData = {
  pagos: {
    light: [
      "assets/images/app-mobile/light/pagos1.jpeg",
      "assets/images/app-mobile/light/pagos2.jpeg",
    ],
    dark: [
      "assets/images/app-mobile/dark/pagos1.jpeg",
      "assets/images/app-mobile/dark/pagos2.jpeg",
    ],
  },
  expediente: {
    light: [
      "assets/images/app-mobile/light/expediente1.jpeg",
      "assets/images/app-mobile/light/expediente2.jpeg",
      "assets/images/app-mobile/light/expediente3.jpeg",
    ],
    dark: [
      "assets/images/app-mobile/dark/expediente1.jpeg",
      "assets/images/app-mobile/dark/expediente2.jpeg",
      "assets/images/app-mobile/dark/expediente3.jpeg",
    ],
  },
  calificaciones: {
    light: ["assets/images/app-mobile/light/calificaciones.jpeg"],
    dark: ["assets/images/app-mobile/dark/calificaciones.jpeg"],
  },
  documentacion: {
    light: ["assets/images/app-mobile/light/documentacion.jpeg"],
    dark: ["assets/images/app-mobile/dark/documentacion.jpeg"],
  },
  actividades: {
    light: ["assets/images/app-mobile/light/actividades.jpeg"],
    dark: ["assets/images/app-mobile/dark/actividades.jpeg"],
  },
};

// Array global para almacenar todas las instancias
let allMobileCarousels = [];

// ========== CONFIGURACIÓN DE TABS ==========
const appTabsConfig = [
  {
    id: "pagos",
    label: "Pagos",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>`,
  },
  {
    id: "expediente",
    label: "Expediente",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>`,
  },
  {
    id: "calificaciones",
    label: "Calificaciones",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>`,
  },
  {
    id: "documentacion",
    label: "Documentación",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>`,
  },
  {
    id: "actividades",
    label: "Actividades",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>`,
  },
];

// ========== CLASE PARA GESTIONAR TABS ==========
class AppTabsManager {
  constructor() {
    this.currentTabIndex = 0;
    this.totalTabs = appTabsConfig.length;
    this.isTransitioning = false;
    this.isPaused = false;
    this.autoAdvanceTimer = null;
    this.delayAfterLastSlide = 5000;
    this.tabProgressIntervals = [];

    this.init();
  }

  init() {
    console.log("🎯 Inicializando AppTabsManager");

    // ✅ LIMPIAR ESTADO PREVIO DE FEATURES
    const allFeatures = document.querySelectorAll(".app-feature");
    allFeatures.forEach((feature) => {
      feature.classList.remove(
        "active",
        "exit-left",
        "exit-right",
        "entering-left",
        "entering-right",
      );
      feature.style.opacity = "";
      feature.style.visibility = "";
    });

    this.createTabsHTML();

    this.tabsNav = document.querySelector(".app-tabs-nav");

    this.createTabsHTML();

    this.tabsNav = document.querySelector(".app-tabs-nav");
    this.dotsNav = document.querySelector(".app-dots-nav");
    this.features = document.querySelectorAll(".app-feature");
    this.tabs = document.querySelectorAll(".app-tab");
    this.dots = document.querySelectorAll(".app-dot");
    this.prevArrow = document.querySelector(".app-nav-arrow.prev");
    this.nextArrow = document.querySelector(".app-nav-arrow.next");

    this.setupEventListeners();
    this.initMobileCarousels();

    // ✅ ACTIVAR PRIMERA TAB DESPUÉS DE INICIALIZAR CARRUSELES
    setTimeout(() => {
      this.goToTab(0, false);
      console.log("✅ AppTabsManager inicializado correctamente");
    }, 50);
  }

  createTabsHTML() {
    const appSection = document.querySelector(".app-section");
    const appContainer = appSection.querySelector(".app-container");
    const appHeader = appContainer.querySelector(".app-header");
    const appFeatures = appContainer.querySelector(".app-features");

    // ✅ VERIFICAR SI YA EXISTEN Y ELIMINARLOS
    const existingWrapper = appContainer.querySelector(".app-tabs-wrapper");
    if (existingWrapper) {
      existingWrapper.remove();
    }

    const existingArrows = appFeatures.querySelector(".app-nav-arrows");
    if (existingArrows) {
      existingArrows.remove();
    }

    const tabsWrapper = document.createElement("div");
    tabsWrapper.className = "app-tabs-wrapper";

    const tabsNav = document.createElement("div");
    tabsNav.className = "app-tabs-nav";

    appTabsConfig.forEach((tab, index) => {
      const tabElement = document.createElement("div");
      tabElement.className = "app-tab";
      tabElement.setAttribute("data-tab-index", index);
      tabElement.innerHTML = `
      <div class="app-tab-icon">${tab.icon}</div>
      <span class="app-tab-label">${tab.label}</span>
      <div class="app-tab-progress"></div>
    `;
      tabsNav.appendChild(tabElement);
    });

    const dotsNav = document.createElement("div");
    dotsNav.className = "app-dots-nav";

    appTabsConfig.forEach((tab, index) => {
      const dotElement = document.createElement("div");
      dotElement.className = "app-dot";
      dotElement.setAttribute("data-dot-index", index);
      dotElement.innerHTML = `
      <svg class="app-dot-progress" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    `;
      dotsNav.appendChild(dotElement);
    });

    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(dotsNav);
    appHeader.after(tabsWrapper);

    const navArrows = document.createElement("div");
    navArrows.className = "app-nav-arrows";
    navArrows.innerHTML = `
    <button class="app-nav-arrow prev" aria-label="Anterior">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <button class="app-nav-arrow next" aria-label="Siguiente">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  `;

    appFeatures.appendChild(navArrows);
  }

  setupEventListeners() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        this.goToTab(index, true);
        this.pauseForManualInteraction();
      });
    });

    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.goToTab(index, true);
        this.pauseForManualInteraction();
      });
    });

    if (this.prevArrow) {
      this.prevArrow.addEventListener("click", () => {
        this.prevTab();
        this.pauseForManualInteraction();
      });
    }

    if (this.nextArrow) {
      this.nextArrow.addEventListener("click", () => {
        this.nextTab();
        this.pauseForManualInteraction();
      });
    }

    const appSection = document.querySelector(".app-section");
    appSection.addEventListener("mouseenter", () => {
      this.pause();
    });

    appSection.addEventListener("mouseleave", () => {
      this.resume();
    });
  }

  initMobileCarousels() {
    console.log("📱 Inicializando carruseles móviles dentro de tabs");

    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "dark";

    // ✅ INICIALIZAR ARRAY
    this.carousels = [];

    // ✅ LIMPIAR CARRUSELES ANTERIORES SI EXISTEN
    if (window.allMobileCarousels && window.allMobileCarousels.length > 0) {
      window.allMobileCarousels.forEach((item) => {
        if (item.carousel) {
          item.carousel.destroy();
        }
      });
      window.allMobileCarousels = [];
    }

    this.features.forEach((feature, index) => {
      const carouselContainer = feature.querySelector("[data-carousel]");
      if (!carouselContainer) {
        console.warn(`⚠️ No se encontró carrusel en feature ${index}`);
        return;
      }

      const type = carouselContainer.getAttribute("data-carousel");

      if (!appMobileData[type]) {
        console.error(`❌ No existe configuración para "${type}"`);
        return;
      }

      if (!appMobileData[type][currentTheme]) {
        console.error(`❌ No existe tema "${currentTheme}" para "${type}"`);
        return;
      }

      const images = appMobileData[type][currentTheme];
      console.log(
        `   ✅ Inicializando carrusel "${type}" con ${images.length} imágenes`,
      );

      const carousel = new MobileCarousel(carouselContainer, images);

      // ✅ GUARDAR REFERENCIA
      this.carousels[index] = carousel;

      // ✅ CALLBACK CUANDO TERMINA LA ÚLTIMA IMAGEN
      carousel.onSlideComplete = (slideIndex, isLastSlide) => {
        if (isLastSlide && index === this.currentTabIndex && !this.isPaused) {
          console.log(`⏱️ Última imagen del tab ${index}, esperando 5 seg...`);
          this.scheduleTabAdvance();
        }
      };
    });

    console.log(
      `✅ Total de carruseles inicializados: ${this.carousels.length}`,
    );
  }

  goToTab(index, isManual = false) {
    // ✅ PERMITIR LA PRIMERA ACTIVACIÓN AUNQUE SEA EL MISMO INDEX
    if (this.isTransitioning) return;
    if (index === this.currentTabIndex && this.currentTabIndex !== 0) return;

    console.log(`🔄 Cambiando a tab ${index}`);

    this.isTransitioning = true;
    const previousIndex = this.currentTabIndex;

    this.clearAllTimers();

    const direction = index > previousIndex ? "right" : "left";

    this.tabs[previousIndex].classList.remove("active");
    this.tabs[index].classList.add("active");

    this.dots[previousIndex].classList.remove("active");
    this.dots[index].classList.add("active");

    const previousFeature = this.features[previousIndex];
    const newFeature = this.features[index];

    // ✅ MANEJAR EL CASO DE LA PRIMERA ACTIVACIÓN
    if (previousIndex === index && this.currentTabIndex === 0) {
      // Primera vez, solo activar sin animación
      newFeature.classList.add("active");
      this.currentTabIndex = index;
      this.isTransitioning = false;

      // Esperar a que los carruseles se inicialicen
      setTimeout(() => {
        if (!this.isPaused) {
          this.startWatchingCurrentCarousel();
        }
      }, 100);
      return;
    }

    previousFeature.classList.remove("active");
    previousFeature.classList.add(
      direction === "right" ? "exit-left" : "exit-right",
    );

    newFeature.classList.add(
      direction === "right" ? "entering-right" : "entering-left",
    );

    setTimeout(() => {
      newFeature.classList.remove("entering-right", "entering-left");
      newFeature.classList.add("active");

      setTimeout(() => {
        previousFeature.classList.remove("exit-left", "exit-right");
        this.currentTabIndex = index;
        this.isTransitioning = false;

        if (isManual && this.carousels && this.carousels[index]) {
          this.carousels[index].restartAutoPlay();
        }

        if (!this.isPaused && !isManual) {
          this.startWatchingCurrentCarousel();
        }
      }, 600);
    }, 50);
  }

  startWatchingCurrentCarousel() {
    // ✅ VERIFICAR QUE CAROUSELS EXISTA Y TENGA ELEMENTOS
    if (!this.carousels || this.carousels.length === 0) {
      console.warn("⚠️ No hay carruseles inicializados todavía");
      return;
    }

    const currentCarousel = this.carousels[this.currentTabIndex];

    if (!currentCarousel) {
      console.log(
        `📝 Tab ${this.currentTabIndex} no tiene carrusel o tiene 1 imagen`,
      );
      this.scheduleTabAdvance(8000);
      return;
    }

    // Backup: si por alguna razón no se dispara el callback, forzar avance
    const backupTime =
      currentCarousel.images.length * 4000 + this.delayAfterLastSlide + 2000;
    this.autoAdvanceTimer = setTimeout(() => {
      if (!this.isPaused) {
        this.nextTab();
      }
    }, backupTime);
  }

  scheduleTabAdvance(customDelay = null) {
    const delay = customDelay || this.delayAfterLastSlide;

    this.startTabProgress(delay);

    this.autoAdvanceTimer = setTimeout(() => {
      if (!this.isPaused) {
        this.nextTab();
      }
    }, delay);
  }

  startTabProgress(duration) {
    const currentTab = this.tabs[this.currentTabIndex];
    const progressBar = currentTab.querySelector(".app-tab-progress");
    const currentDot = this.dots[this.currentTabIndex];
    const progressCircle = currentDot.querySelector(".app-dot-progress circle");

    if (progressBar) {
      progressBar.style.transition = `width ${duration}ms linear`;
      progressBar.style.width = "100%";
    }

    if (progressCircle) {
      const circumference = 2 * Math.PI * 10;
      progressCircle.style.strokeDasharray = circumference;
      progressCircle.style.strokeDashoffset = circumference;
      progressCircle.style.transition = `stroke-dashoffset ${duration}ms linear`;

      setTimeout(() => {
        progressCircle.style.strokeDashoffset = "0";
      }, 50);
    }
  }

  clearAllTimers() {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }

    this.tabs.forEach((tab) => {
      const progressBar = tab.querySelector(".app-tab-progress");
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
      }
    });

    this.dots.forEach((dot) => {
      const progressCircle = dot.querySelector(".app-dot-progress circle");
      if (progressCircle) {
        progressCircle.style.transition = "none";
        progressCircle.style.strokeDashoffset = "75.4";
      }
    });
  }

  nextTab() {
    const nextIndex = (this.currentTabIndex + 1) % this.totalTabs;
    this.goToTab(nextIndex, false);
  }

  prevTab() {
    const prevIndex =
      (this.currentTabIndex - 1 + this.totalTabs) % this.totalTabs;
    this.goToTab(prevIndex, false);
  }

  pause() {
    this.isPaused = true;
    this.clearAllTimers();

    if (this.carousels) {
      this.carousels.forEach((carousel) => {
        if (carousel) carousel.stopAutoPlay();
      });
    }
  }

  resume() {
    this.isPaused = false;

    const currentCarousel = this.carousels[this.currentTabIndex];
    if (currentCarousel) {
      currentCarousel.startAutoPlay();
    }

    this.startWatchingCurrentCarousel();
  }

  pauseForManualInteraction() {
    this.pause();

    setTimeout(() => {
      if (this.isPaused) {
        this.resume();
      }
    }, 10000);
  }

  destroy() {
    console.log("🧹 Destruyendo AppTabsManager...");

    // Limpiar timers
    this.clearAllTimers();

    // Destruir carruseles
    if (this.carousels) {
      this.carousels.forEach((carousel) => {
        if (carousel) carousel.destroy();
      });
      this.carousels = [];
    }

    // Limpiar event listeners de hover
    const appSection = document.querySelector(".app-section");
    if (appSection) {
      const newSection = appSection.cloneNode(true);
      appSection.parentNode.replaceChild(newSection, appSection);
    }

    // Resetear estado de todas las features
    const allFeatures = document.querySelectorAll(".app-feature");
    allFeatures.forEach((feature) => {
      feature.classList.remove(
        "active",
        "exit-left",
        "exit-right",
        "entering-left",
        "entering-right",
      );
    });

    console.log("✅ AppTabsManager destruido");
  }
}

// ========== FUNCIÓN PRINCIPAL ==========
let appTabsManager = null;

function initAppMobile() {
  console.log("═══════════════════════════════════════════");
  console.log("🚀 APP MOBILE CON TABS - INICIANDO");
  console.log("═══════════════════════════════════════════");

  if (appTabsManager) {
    appTabsManager.destroy();
  }

  appTabsManager = new AppTabsManager();
}

function refreshAllMobileCarousels() {
  console.log("🔄 Refrescando carruseles móviles con tabs...");

  if (appTabsManager) {
    appTabsManager.destroy();
    appTabsManager = null;
  }

  // ✅ RESETEAR TODAS LAS FEATURES AL ESTADO INICIAL
  const allFeatures = document.querySelectorAll(".app-feature");
  allFeatures.forEach((feature) => {
    feature.classList.remove(
      "active",
      "exit-left",
      "exit-right",
      "entering-left",
      "entering-right",
    );
    feature.style.opacity = "0";
    feature.style.visibility = "hidden";
  });

  // Esperar un frame antes de reinicializar
  requestAnimationFrame(() => {
    initAppMobile();
  });
}

/* ========== ANIMACIONES APP MOBILE ========== */
function initAppMobileAnimations() {
  const features = document.querySelectorAll(".app-feature");

  if (features.length === 0) {
    console.warn("⚠️ No se encontraron elementos .app-feature");
    return;
  }

  console.log(`🎬 Animando ${features.length} app features`);

  features.forEach((feature, index) => {
    // IMPORTANTE: Forzar visibilidad inicial si GSAP falla
    feature.style.opacity = "1";
    feature.style.transform = "translateY(0)";

    gsap.fromTo(
      feature,
      {
        y: 80,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: feature,
          start: "top 80%",
          once: true,
          onEnter: () => {
            feature.classList.add("visible");
            console.log(`   ✅ Feature ${index + 1} visible`);
          },
        },
      },
    );
  });

  // Animación del header
  const appHeader = document.querySelector(".app-header");
  if (appHeader) {
    appHeader.style.opacity = "1";

    gsap.from(".app-header", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".app-section",
        start: "top 70%",
        once: true,
      },
    });
  }
}

/* ========== FAQ ACCORDION ========== */
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  if (faqItems.length === 0) {
    console.warn("⚠️ No se encontraron elementos FAQ");
    return;
  }

  // Animar entrada de items
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 100);
      }
    });
  }, observerOptions);

  faqItems.forEach((item) => observer.observe(item));

  // Funcionalidad del acordeón
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Cerrar todos los items
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        otherItem
          .querySelector(".faq-question")
          .setAttribute("aria-expanded", "false");
      });

      // Abrir el item clickeado si no estaba activo
      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  // CTA button en FAQ
  const faqCTAButton = document.querySelector(".faq-cta .btn-primary");
  if (faqCTAButton) {
    faqCTAButton.addEventListener("click", () => {
      // Abrir el modal de demo
      const demoModal = document.getElementById("demoModal");
      if (demoModal) {
        demoModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  }

  console.log("✅ FAQ accordion initialized");
}

/* ========== SCROLL TO TOP BUTTON ========== */
function initScrollToTop() {
  const scrollBtn = document.getElementById("scrollToTop");

  if (!scrollBtn) {
    console.warn("⚠️ Scroll to top button not found");
    return;
  }

  // Mostrar/ocultar botón según scroll
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 500) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });

  // Click para volver arriba
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Opcional: trackear evento
    console.log("🔝 Scroll to top clicked");
  });

  console.log("✅ Scroll to top button initialized");
}

/* ========== PRICING ANIMATIONS ========== */
function initPricingAnimations() {
  const pricingTiers = document.querySelectorAll(".pricing-tier");

  if (pricingTiers.length === 0) return;

  pricingTiers.forEach((tier, index) => {
    gsap.from(tier.querySelector(".tier-header"), {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: tier,
        start: "top 75%",
        once: true,
      },
    });

    const cards = tier.querySelectorAll(".pricing-card");
    cards.forEach((card, cardIndex) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        delay: cardIndex * 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: tier.querySelector(".pricing-cards"),
          start: "top 80%",
          once: true,
        },
      });
    });
  });

  // Animar CTA
  gsap.from(".pricing-cta", {
    y: 60,
    opacity: 0,
    scale: 0.95,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".pricing-cta",
      start: "top 85%",
      once: true,
    },
  });

  console.log("✅ Pricing animations initialized");
}
