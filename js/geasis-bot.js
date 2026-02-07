/* ========================================
   GEASIS BOT - Asistente Motivacional
======================================== */

class GeasisBot {
  constructor() {
    this.config = {
      name: 'GEASIS Bot',
      messageInterval: 20000, // 20 segundos entre mensajes
      messageDisplay: 10000, // 10 segundos mostrando mensaje
      typingDuration: 1500, // 1.5 segundos "escribiendo"
      maxMessagesPerSession: 5,
      firstMessageDelay: 5000, // 5 segundos para el primer mensaje
      enableSound: true,
    };

    this.state = {
      messageCount: 0,
      isDismissed: false,
      currentSection: 'hero',
      hasRequestedDemo: false,
    };

    this.elements = {
      bot: document.getElementById('geasisBot'),
      avatar: document.getElementById('botAvatar'),
      message: document.getElementById('botMessage'),
      typing: document.getElementById('botTyping'),
      text: document.getElementById('botText'),
      close: document.getElementById('botClose'),
    };

    this.messages = this.getMessageBank();
    this.messageTimer = null;
    this.displayTimer = null;

    this.init();
  }

  init() {
    if (!this.elements.bot) {
      console.warn('⚠️ GEASIS Bot element not found');
      return;
    }

    // Verificar si ya solicitó demo
    this.state.hasRequestedDemo = localStorage.getItem('geasisDemoRequested') === 'true';
    
    if (this.state.hasRequestedDemo) {
      console.log('✅ Usuario ya solicitó demo - Bot en modo pasivo');
      // Mostrar bot pero sin mensajes automáticos
      this.setupEventListeners();
      return;
    }

    // Detectar sección actual
    this.detectSection();

    // Event listeners
    this.setupEventListeners();

    // Iniciar secuencia de mensajes
    this.startMessageSequence();

    console.log('🤖 GEASIS Bot initialized');
  }

  getMessageBank() {
    return {
      // PROVOCACIÓN INGENIOSA (40%)
      provocacion: [
        '¿Sigues usando Excel? Tu director de 1995 te está llamando 📞',
        '¿Cuántas horas perdiste hoy persiguiendo pagos? 🏃‍♂️',
        'Tu pila de papeles acaba de suspirar... literalmente 📚😮‍💨',
        'Excel está bien... si vives en el pasado 🦕',
        '¿Cuántos post-its necesitas para recordar un pago? 📝',
        'Ctrl+Z no funciona en la vida real... pero GEASIS sí ⚡',
        'Tu hoja de cálculo acaba de crashear. Otra vez. 💥',
        'Llamar por teléfono para cobrar es tan 2010 📱',
        '¿Más carpetas? ¿En serio? Hay una forma mejor 📂',
        'Tu tiempo vale más que perseguir pagos atrasados ⏰',
        'Seguimiento manual = tiempo perdido. Punto. ⌛',
        'Ese Excel tiene más colores que un arcoíris 🌈',
      ],

      // BENEFICIOS DIRECTOS (30%)
      beneficios: [
        'Automatiza cobros y recupera 70% de tu tiempo ⚡',
        'Imagina: cero llamadas de cobranza. Es posible ✨',
        'Notificaciones automáticas = Pagos puntuales 💰',
        'Padres felices + Menos trabajo = GEASIS 🎯',
        'De 40 horas manuales a 10 automatizadas 🚀',
        'Cobranza automática mientras duermes 😴💸',
        'Reintentos inteligentes que sí funcionan ✅',
        '98% de pagos exitosos sin mover un dedo 👆',
        'Tu equipo agradecerá no perseguir pagos 🙏',
        'Menos estrés, más resultados medibles 📊',
        'Convierte pagos pendientes en pagos completados 💳',
      ],

      // URGENCIA / FOMO (20%)
      urgencia: [
        'Otras 127 escuelas ya automatizaron. ¿Y tú? 🚀',
        'Cada día manual es dinero que no cobras 💸',
        'Tu competencia ya usa GEASIS... shh 🤫',
        'Mientras lees esto, perdiste 3 minutos de trabajo manual ⏱️',
        'Enero ya empezó. ¿Tu sistema está listo? 🗓️',
        'Los padres de familia esperan modernidad. ¿Tú también? 📱',
        'Demo gratis por tiempo limitado... literalmente ⏰',
        'Tus colegas ya lo probaron. Ahora es tu turno 👥',
      ],

      // CURIOSIDAD (10%)
      curiosidad: [
        '¿Sabes cuánto tiempo pierdes al año en cobranza? 🤔',
        'Spoiler: No necesitas más personal administrativo 👥',
        'Demo de 10 minutos = Tu gestión transformada 🎬',
        '¿Qué harías con 28 horas extra al mes? 💭',
        'Pregunta: ¿Cuántos pagos atrasados tienes hoy? 🧐',
        '¿Tu sistema actual puede hacer esto? (Spoiler: No) 🎯',
      ],

      // MENSAJES CONTEXTUALES POR SECCIÓN
      workflow: [
        'Así se ve la cobranza en piloto automático 🛸',
        'Reintentos automáticos que sí cobran 🎯',
        'Mientras tu duermes, GEASIS cobra 😴💰',
        'Workflow inteligente = Dinero en el banco 🏦',
      ],

      modules: [
        '6 módulos que eliminan el 90% del trabajo manual 🎯',
        'Cada módulo te ahorra horas. Cada. Uno. ⏰',
        'Todo integrado. Todo automatizado. Todo simple. ✨',
      ],

      testimonials: [
        'No somos los únicos que lo dicen... mira tú mismo 👀',
        '127 instituciones no pueden estar equivocadas 🏫',
        'Resultados reales de escuelas reales 📊',
      ],

      app: [
        'App móvil incluida. Porque es 2025, no 2005 📱',
        'Padres felices = Menos llamadas para ti ☎️❌',
        'Todo en el bolsillo. Literal. 👖📲',
      ],
    };
  }

  detectSection() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.id;
            this.state.currentSection = section || 'hero';
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });
  }

  setupEventListeners() {
    // Click en avatar - abrir demo
    this.elements.avatar.addEventListener('click', () => {
      this.openDemoModal();
    });

    // Click en mensaje - abrir demo
    this.elements.message.addEventListener('click', (e) => {
      if (!e.target.closest('.bot-close')) {
        this.openDemoModal();
      }
    });

    // Click en cerrar mensaje
    this.elements.close.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dismissMessage();
    });
  }

  startMessageSequence() {
    // Primer mensaje después del delay inicial
    setTimeout(() => {
      this.showNextMessage();
    }, this.config.firstMessageDelay);
  }

  showNextMessage() {
    if (this.state.messageCount >= this.config.maxMessagesPerSession) {
      console.log('🤖 Bot: Límite de mensajes alcanzado para esta sesión');
      return;
    }

    if (this.state.isDismissed) {
      return;
    }

    // Mostrar typing indicator
    this.showTyping();

    // Después del typing, mostrar mensaje
    setTimeout(() => {
      this.hideTyping();
      this.displayMessage();

      // Programar siguiente mensaje
      this.scheduleNextMessage();
    }, this.config.typingDuration);
  }

  displayMessage() {
    const message = this.getRandomMessage();

    this.elements.text.textContent = message;
    this.elements.text.classList.add('visible');
    this.elements.message.classList.add('visible');

    this.state.messageCount++;

    // Reproducir sonido si está habilitado
    if (this.config.enableSound) {
      this.playSound();
    }

    // Ocultar mensaje después del tiempo de display
    this.displayTimer = setTimeout(() => {
      this.hideMessage();
    }, this.config.messageDisplay);
  }

  showTyping() {
    this.elements.typing.classList.add('active');
    this.elements.message.classList.add('visible');
  }

  hideTyping() {
    this.elements.typing.classList.remove('active');
  }

  hideMessage() {
    this.elements.message.classList.remove('visible');
    this.elements.text.classList.remove('visible');
  }

  dismissMessage() {
    this.hideMessage();
    clearTimeout(this.messageTimer);
    clearTimeout(this.displayTimer);
    // No marcar como dismissed permanentemente, solo pausar
  }

  scheduleNextMessage() {
    this.messageTimer = setTimeout(() => {
      this.showNextMessage();
    }, this.config.messageInterval);
  }

  getRandomMessage() {
    // Determinar categoría basada en probabilidades
    const rand = Math.random();
    let category;

    // Verificar si hay mensajes contextuales para la sección actual
    const sectionMessages = this.messages[this.state.currentSection];

    if (sectionMessages && sectionMessages.length > 0 && rand < 0.3) {
      // 30% de probabilidad de mensaje contextual
      category = this.state.currentSection;
    } else if (rand < 0.4) {
      category = 'provocacion'; // 40%
    } else if (rand < 0.7) {
      category = 'beneficios'; // 30%
    } else if (rand < 0.9) {
      category = 'urgencia'; // 20%
    } else {
      category = 'curiosidad'; // 10%
    }

    const messagesArray = this.messages[category];
    return messagesArray[Math.floor(Math.random() * messagesArray.length)];
  }

  openDemoModal() {
    const demoModal = document.getElementById('demoModal');
    if (demoModal) {
      demoModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Marcar que solicitó demo
      localStorage.setItem('geasisDemoRequested', 'true');
      this.state.hasRequestedDemo = true;

      // Detener mensajes
      this.state.isDismissed = true;
      this.hideMessage();
      clearTimeout(this.messageTimer);
      clearTimeout(this.displayTimer);

      console.log('🎯 Bot: Usuario abrió modal de demo');
    }
  }

  playSound() {
    // Usar el mismo sistema de sonido de microinteractions si existe
    const clickSound = document.querySelector('audio[src*="click"]');
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.08;
      clickSound.play().catch(() => {});
    }
  }
}

// Inicializar el bot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Esperar un poco más para no interferir con otras inicializaciones
  setTimeout(() => {
    new GeasisBot();
  }, 1000);
});