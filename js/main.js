/**
 * main.js - Funcionalidades gerais do WiseBites
 * Inclui navegação suave, animações e interações básicas
 */

document.addEventListener('DOMContentLoaded', function() {
    // Navegação suave para links internos
    setupSmoothScrolling();
    
    // Animações de scroll
    setupScrollAnimations();
    
    // Navegação responsiva
    setupResponsiveNavigation();
    
    // Efeitos de hover nos cards de serviços
    setupServiceCardEffects();
    
    // Validação de formulários (se houver)
    setupFormValidation();
});

/**
 * Configura navegação suave para links internos
 */
function setupSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Configura animações baseadas no scroll
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Elementos para animar
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-content');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Configura navegação responsiva
 */
function setupResponsiveNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '<span></span><span></span><span></span>';
    navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Adicionar botão de toggle apenas em telas pequenas
    function addNavToggle() {
        if (window.innerWidth <= 768 && !document.querySelector('.nav-toggle')) {
            nav.parentElement.insertBefore(navToggle, nav);
        } else if (window.innerWidth > 768 && document.querySelector('.nav-toggle')) {
            document.querySelector('.nav-toggle').remove();
        }
    }
    
    // Adicionar toggle inicial
    addNavToggle();
    
    // Adicionar toggle em resize
    window.addEventListener('resize', addNavToggle);
    
    // Toggle do menu
    document.addEventListener('click', function(e) {
        if (e.target.closest('.nav-toggle')) {
            nav.classList.toggle('nav-open');
            navToggle.classList.toggle('active');
        }
        
        // Fechar menu ao clicar em um link
        if (e.target.closest('.nav a')) {
            nav.classList.remove('nav-open');
            navToggle.classList.remove('active');
        }
    });
}

/**
 * Configura efeitos nos cards de serviços
 */
function setupServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Configura validação de formulários
 */
function setupFormValidation() {
    const forms = document.querySelectorAll('#contactForm'); 
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Simular envio do formulário
                showSuccessMessage('Formulário enviado com sucesso!');
                form.reset();
            } else {
                showErrorMessage('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    });
}

/**
 * Mostra mensagem de sucesso
 */
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message success';
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

/**
 * Mostra mensagem de erro
 */
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message error';
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

/**
 * Utilitário para debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utilitário para throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Adicionar estilos CSS dinamicamente para animações
const animationStyles = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
    }
    
    .nav-toggle span {
        display: block;
        width: 25px;
        height: 3px;
        background: white;
        margin: 5px 0;
        transition: 0.3s;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    }
    
    .message.success {
        background: #059669;
    }
    
    .message.error {
        background: #dc2626;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .error {
        border-color: #dc2626 !important;
        box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2) !important;
    }
    
    @media (max-width: 768px) {
        .nav-toggle {
            display: block;
        }
        
        .nav {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #1e3a8a;
            flex-direction: column;
            padding: 20px;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav.nav-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav ul {
            flex-direction: column;
            gap: 15px;
        }
    }
`;

// Injetar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);
