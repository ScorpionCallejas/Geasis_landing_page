/* ========================================
   MICROINTERACCIONES SUTILES - SOLO SONIDO Y RIPPLE
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMicrointeractions();
});

function initMicrointeractions() {
    // Inicializar sistema de sonido
    const sounds = {
        click: new Audio('assets/sounds/click.mp3'),
        success: new Audio('assets/sounds/success.mp3'),
        whoosh: new Audio('assets/sounds/whoosh.mp3')
    };
    
    // Configurar volumen bajo
    Object.values(sounds).forEach(sound => {
        sound.volume = 0.05; // 5% de volumen
    });
    
    // Función para reproducir sonido
    function playSound(soundName) {
        if (sounds[soundName]) {
            sounds[soundName].currentTime = 0;
            sounds[soundName].play().catch(e => {
                // Ignorar errores de autoplay
            });
        }
    }
    
    // ========== EFECTO RIPPLE AL HACER CLICK ==========
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    // ========== APLICAR A BOTONES ==========
    const buttons = document.querySelectorAll(
        '.btn-primary, .btn-secondary, .nav-cta, .module-btn, .btn-submit'
    );
    
    buttons.forEach(button => {
        // Asegurar que tenga position relative
        const position = window.getComputedStyle(button).position;
        if (position === 'static') {
            button.style.position = 'relative';
        }
        button.style.overflow = 'hidden';
        
        button.addEventListener('click', function(e) {
            createRipple(e, this);
            playSound('click');
        });
    });
    
    // ========== APLICAR A CARDS ==========
    const cards = document.querySelectorAll(
        '.module-card, .testimonial-card, .embudo-card'
    );
    
    cards.forEach(card => {
        const position = window.getComputedStyle(card).position;
        if (position === 'static') {
            card.style.position = 'relative';
        }
        card.style.overflow = 'hidden';
        
        card.addEventListener('click', function(e) {
            // Solo si no es un botón dentro del card
            if (!e.target.closest('button')) {
                createRipple(e, this);
                playSound('click');
            }
        });
    });
    
    // ========== APLICAR A PROGRESS STEPS ==========
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach(step => {
        step.addEventListener('click', function(e) {
            playSound('whoosh');
        });
    });
    
    // ========== APLICAR A DOTS DE NAVEGACIÓN ==========
    const dots = document.querySelectorAll('.mobile-dot, .carousel-dot');
    
    dots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            playSound('click');
        });
    });
    
    // ========== FORMULARIO - SONIDO DE ÉXITO ==========
    const demoForm = document.getElementById('demoForm');
    
    if (demoForm) {
        const originalSubmit = demoForm.onsubmit;
        demoForm.addEventListener('submit', function(e) {
            // Reproducir sonido de éxito cuando el formulario se envía correctamente
            setTimeout(() => {
                const successMessage = document.querySelector('.form-message.success');
                if (successMessage && successMessage.style.display !== 'none') {
                    playSound('success');
                }
            }, 1500);
        });
    }
    
    console.log('✨ Microinteracciones activadas (sonido + ripple)');
}
