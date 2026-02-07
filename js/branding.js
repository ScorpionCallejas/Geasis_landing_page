/* ========================================
   SECCIÓN DE PERSONALIZACIÓN
======================================== */

class BrandingSection {
  constructor() {
    this.elements = {
      mockups: document.querySelectorAll(".branding-mockup"),
      btnPersonalizedDemo: document.getElementById("btnPersonalizedDemo"),
      modal: document.getElementById("personalizationModal"),
      closeModal: document.getElementById("closePersonalizationModal"),
      institutionName: document.getElementById("institutionName"),
      logoUpload: document.getElementById("logoUpload"),
      logoUploadArea: document.getElementById("logoUploadArea"),
      uploadPlaceholder: document.getElementById("uploadPlaceholder"),
      uploadPreview: document.getElementById("uploadPreview"),
      logoPreviewImg: document.getElementById("logoPreviewImg"),
      removeLogo: document.getElementById("removeLogo"),
      previewButtonsContainer: document.getElementById(
        "previewButtonsContainer",
      ),
      previewModal: document.getElementById("previewModal"),
      closePreviewModal: document.getElementById("closePreviewModal"),
      previewModalImage: document.getElementById("previewModalImage"),
    };

    this.state = {
      logoFile: null,
      logoDataUrl: null,
      institutionName: "",
      isSquareLogo: false, // Nueva propiedad para detectar logos cuadrados
    };

    // Configuración de posiciones del logo para cada tipo
    this.logoPositions = {
      login: {
        top: "15%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "220px",
        height: "75px",
        justifyContent: "center",
      },
      dashboard: {
        top: "2px",
        left: "5px",
        width: "150px",
        height: "42px",
        justifyContent: "flex-start",
      },
      app: {
        top: "8%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "160px",
        height: "55px",
        borderRadius: "12px",
        justifyContent: "center",
        padding: "8px 12px",
      },
      appSquare: {
        // Nueva posición para logos cuadrados en app
        top: "8%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "180px",
        height: "65px",
        borderRadius: "12px",
        justifyContent: "center",
        padding: "10px 14px",
      },
      solicitud: {
        top: "10%",
        right: "3%",
        left: "auto",
        width: "auto",
        height: "34px",
        justifyContent: "flex-end",
        padding: "3px 6px",
        borderRadius: "4px",
      },
    };

    this.init();
  }

  init() {
    if (!this.elements.modal) {
      console.warn("⚠️ Branding section elements not found");
      return;
    }

    this.setupScrollAnimations();
    this.setupModalEvents();
    this.setupLogoUpload();
    this.setupInputEvents();

    console.log("✅ Branding section initialized");
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 150);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    this.elements.mockups.forEach((mockup) => observer.observe(mockup));
  }

  setupModalEvents() {
    // Abrir modal de personalización (NO EL DE DEMO)
    this.elements.btnPersonalizedDemo?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.openModal();
    });

    // Cerrar modal de personalización
    this.elements.closeModal?.addEventListener("click", () => {
      this.closeModal();
    });

    // Cerrar modal de preview
    this.elements.closePreviewModal?.addEventListener("click", () => {
      this.closePreviewModal();
    });

    // Cerrar al hacer click fuera del modal de personalización
    this.elements.modal?.addEventListener("click", (e) => {
      if (e.target === this.elements.modal) {
        this.closeModal();
      }
    });

    // Cerrar al hacer click fuera del modal de preview
    this.elements.previewModal?.addEventListener("click", (e) => {
      if (e.target === this.elements.previewModal) {
        this.closePreviewModal();
      }
    });

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.elements.previewModal?.classList.contains("active")) {
          this.closePreviewModal();
        } else if (this.elements.modal?.classList.contains("active")) {
          this.closeModal();
        }
      }
    });

    // NUEVO: Abrir modal de demo desde personalización
    const btnRequestDemo = document.getElementById(
      "btnRequestDemoFromPersonalization",
    );
    btnRequestDemo?.addEventListener("click", () => {
      // Cerrar modal de personalización
      this.closeModal();

      // Abrir modal de demo
      const demoModal = document.getElementById("demoModal");
      if (demoModal) {
        demoModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  }

  setupLogoUpload() {
    // Click en área de upload
    this.elements.logoUploadArea?.addEventListener("click", () => {
      this.elements.logoUpload.click();
    });

    // Cambio en input file
    this.elements.logoUpload?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleLogoFile(file);
      }
    });

    // Drag & Drop
    this.elements.logoUploadArea?.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.elements.logoUploadArea.style.borderColor = "var(--primary)";
    });

    this.elements.logoUploadArea?.addEventListener("dragleave", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.elements.logoUploadArea.style.borderColor = "";
    });

    this.elements.logoUploadArea?.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.elements.logoUploadArea.style.borderColor = "";

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        this.handleLogoFile(file);
      }
    });

    // Remover logo
    this.elements.removeLogo?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.removeLogo();
    });
  }

  setupInputEvents() {
    // Actualizar nombre de institución CON LÍMITE DE 8 CARACTERES
    this.elements.institutionName?.addEventListener("input", (e) => {
      let value = e.target.value;

      // Limitar a 8 caracteres
      if (value.length > 8) {
        value = value.substring(0, 8);
        e.target.value = value;
      }

      this.state.institutionName = value;
    });
  }

  handleLogoFile(file) {
    // Validar tipo
    if (!file.type.startsWith("image/")) {
      alert("Por favor sube una imagen válida (PNG, JPG o SVG)");
      return;
    }

    // Validar tamaño (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("El archivo es muy grande. Máximo 2MB");
      return;
    }

    this.state.logoFile = file;

    // Leer archivo y detectar si es cuadrado
    const reader = new FileReader();
    reader.onload = (e) => {
      this.state.logoDataUrl = e.target.result;

      // Crear imagen para obtener dimensiones
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;

        // Considerar cuadrado si el aspect ratio está entre 0.85 y 1.15
        this.state.isSquareLogo = aspectRatio >= 0.85 && aspectRatio <= 1.15;

        // Actualizar UI
        this.elements.logoPreviewImg.src = e.target.result;
        this.elements.uploadPlaceholder.style.display = "none";
        this.elements.uploadPreview.style.display = "flex";

        // Habilitar/deshabilitar campo de texto según el tipo de logo
        if (this.state.isSquareLogo) {
          this.elements.institutionName.disabled = false;
          this.elements.institutionName.placeholder = "Ej: Colegio";
        } else {
          this.elements.institutionName.disabled = true;
          this.elements.institutionName.value = "";
          this.elements.institutionName.placeholder =
            "Solo logos cuadrados permiten texto";
          this.state.institutionName = "";
        }

        this.showPreviewButtons();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeLogo() {
    this.state.logoFile = null;
    this.state.logoDataUrl = null;
    this.state.isSquareLogo = false;
    this.elements.logoUpload.value = "";
    this.elements.logoPreviewImg.src = "";
    this.elements.uploadPlaceholder.style.display = "flex";
    this.elements.uploadPreview.style.display = "none";

    // Rehabilitar campo de texto
    this.elements.institutionName.disabled = false;
    this.elements.institutionName.placeholder = "Ej: Colegio Benito Juárez";

    this.hidePreviewButtons();
  }

  showPreviewButtons() {
    if (!this.elements.previewButtonsContainer) return;

    this.elements.previewButtonsContainer.innerHTML = `
      <h4>Vista Previa en Pantallas</h4>
      <p class="preview-buttons-desc">Selecciona dónde quieres ver tu logo integrado</p>
      <div class="preview-buttons-grid">
        <button class="preview-btn" data-type="login">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M9 3v18"></path>
          </svg>
          <span>Login</span>
        </button>
        <button class="preview-btn" data-type="dashboard">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Dashboard</span>
        </button>
        <button class="preview-btn" data-type="app">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
          <span>App Móvil</span>
        </button>
        <button class="preview-btn" data-type="solicitud">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Solicitud</span>
        </button>
      </div>
    `;

    this.elements.previewButtonsContainer.style.display = "block";

    // Agregar event listeners a los botones
    const previewBtns =
      this.elements.previewButtonsContainer.querySelectorAll(".preview-btn");
    previewBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const type = btn.getAttribute("data-type");
        this.showPreview(type);
      });
    });
  }

  hidePreviewButtons() {
    if (this.elements.previewButtonsContainer) {
      this.elements.previewButtonsContainer.style.display = "none";
      this.elements.previewButtonsContainer.innerHTML = "";
    }
  }

  showPreview(type) {
    if (!this.state.logoDataUrl) return;

    const baseImagePath = `assets/images/mockups/${type}.webp`;

    // Usar posición especial para app con logo cuadrado
    let position;
    if (type === "app" && this.state.isSquareLogo) {
      position = this.logoPositions.appSquare;
    } else {
      position = this.logoPositions[type];
    }

    const hasText =
      this.state.isSquareLogo &&
      this.state.institutionName &&
      this.state.institutionName.trim() !== "";

    // Limitar texto a 8 caracteres para el preview también
    const displayText = hasText
      ? this.state.institutionName.substring(0, 8)
      : "";

    this.elements.previewModalImage.innerHTML = `
      <div class="preview-image-wrapper">
        <img src="${baseImagePath}" alt="${type}" class="preview-base-image">
        <div class="preview-logo-overlay" style="
          position: absolute;
          top: ${position.top || "auto"};
          bottom: ${position.bottom || "auto"};
          left: ${position.left || "auto"};
          right: ${position.right || "auto"};
          width: ${position.width || "auto"};
          height: ${position.height};
          ${position.transform ? `transform: ${position.transform};` : ""}
          ${position.borderRadius ? `border-radius: ${position.borderRadius};` : ""}
          ${position.padding ? `padding: ${position.padding};` : "padding: 0 10px;"}
          display: flex;
          align-items: center;
          justify-content: ${position.justifyContent || "flex-start"};
          gap: ${hasText ? "8px" : "0"};
        ">
          <img src="${this.state.logoDataUrl}" alt="Logo" style="
            height: 78%;
            width: auto;
            max-width: ${hasText ? "50%" : "80%"};
            object-fit: contain;
            flex-shrink: 0;
          ">
          ${
            hasText
              ? `
            <span style="
              font-family: var(--font);
              font-size: ${this.calculateFontSize(position.height, type)};
              font-weight: 700;
              color: ${this.getTextColor(type)};
              white-space: nowrap;
              line-height: 1.1;
              display: flex;
              align-items: center;
            ">${displayText}</span>
          `
              : ""
          }
        </div>
      </div>
    `;

    this.openPreviewModal();
  }

  calculateFontSize(containerHeight, type) {
    const height = parseInt(containerHeight);

    // Tamaños específicos por tipo
    if (type === "solicitud") {
      return "11px";
    }
    if (type === "app") {
      // Si es logo cuadrado en app, usar tamaño más grande
      if (this.state.isSquareLogo && this.state.institutionName) {
        return "22px";
      }
      return "20px";
    }
    if (type === "dashboard") {
      return "18px";
    }

    // Login (tamaño más grande)
    return "24px";
  }

  getTextColor(type) {
    // Para app y solicitud usar color que contraste
    if (type === "app" || type === "solicitud") {
      return "#2d3748";
    }
    // Para los demás usar el color del tema
    return "var(--text)";
  }

  openModal() {
    this.elements.modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    this.elements.modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  openPreviewModal() {
    this.elements.previewModal.classList.add("active");
  }

  closePreviewModal() {
    this.elements.previewModal.classList.remove("active");
  }
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  new BrandingSection();
});
