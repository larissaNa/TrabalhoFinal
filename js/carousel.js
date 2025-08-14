/**
 * Carousel.js - Sistema de Carrossel para WiseBites
 * Implementa todas as funcionalidades especificadas:
 * - Início automático com intervalo de 5 segundos
 * - Navegação manual com botões Anterior/Próximo
 * - Pausa inteligente no hover
 * - Reinício do temporizador após interação manual
 */

class Carousel {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.slides = this.container.querySelectorAll('.carousel-slide, .testimonial-slide');
        this.totalSlides = this.slides.length;
        this.currentSlide = 0;
        this.isPlaying = true;
        this.interval = options.interval || 5000; // 5 segundos por padrão
        this.timer = null;
        
        // Elementos de navegação
        this.prevBtn = this.container.parentElement.querySelector('.prev');
        this.nextBtn = this.container.parentElement.querySelector('.next');
        this.indicators = this.container.parentElement.querySelectorAll('.indicator');
        
        // Configurações
        this.autoPlay = options.autoPlay !== false; // Auto-play ativado por padrão
        this.pauseOnHover = options.pauseOnHover !== false; // Pausa no hover ativada por padrão
        
        this.init();
    }
    
    init() {
        if (this.totalSlides === 0) return;
        
        // Configurar navegação
        this.setupNavigation();
        
        // Configurar indicadores
        this.setupIndicators();
        
        // Configurar eventos de hover
        if (this.pauseOnHover) {
            this.setupHoverEvents();
        }
        
        // Iniciar auto-play
        if (this.autoPlay) {
            this.startAutoPlay();
        }
        
        // Mostrar slide inicial
        this.showSlide(0);
    }
    
    setupNavigation() {
        // Botão Anterior
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.restartTimer();
            });
        }
        
        // Botão Próximo
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.restartTimer();
            });
        }
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (this.container.parentElement.contains(document.activeElement) || 
                this.container.contains(document.activeElement)) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                    this.restartTimer();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                    this.restartTimer();
                }
            }
        });
    }
    
    setupIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.restartTimer();
            });
        });
    }
    
    setupHoverEvents() {
    const carouselContainer = this.container.closest('.carousel-container, .testimonials-carousel-container');

    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });

        carouselContainer.addEventListener('mouseleave', () => {
            // Reinicia o temporizador quando o mouse sai
            this.restartTimer();
        });
    }
}
    
    showSlide(index) {
        // Validar índice
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        
        // Remover classe active de todos os slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remover classe active de todos os indicadores
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Adicionar classe active ao slide atual
        this.slides[index].classList.add('active');
        
        // Adicionar classe active ao indicador atual
        if (this.indicators[index]) {
            this.indicators[index].classList.add('active');
        }
        
        // Atualizar índice atual
        this.currentSlide = index;
        
        // Atualizar transform do container
        const translateX = -index * 100;
        this.container.style.transform = `translateX(${translateX}%)`;
    }
    
    nextSlide() {
        const nextIndex = this.currentSlide + 1;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = this.currentSlide - 1;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
    
    startAutoPlay() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => {
            if (this.isPlaying) {
                this.nextSlide();
            }
        }, this.interval);
    }
    
    pauseAutoPlay() {
    this.isPlaying = false;
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    }
}
    
    resumeAutoPlay() {
    this.isPlaying = true;
    this.startAutoPlay();
}
    
    restartTimer() {
        // Parar o timer atual
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Reiniciar o timer
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }
    
    destroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}

// Inicialização dos carrosséis quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Carrossel principal (banners)
    const mainCarousel = new Carousel('mainCarousel', {
        interval: 5000, // 5 segundos
        autoPlay: true,
        pauseOnHover: true
    });
    
    // Carrossel de depoimentos
    const testimonialsCarousel = new Carousel('testimonialsCarousel', {
        interval: 5000, // 5 segundos
        autoPlay: true,
        pauseOnHover: true
    });
    
    // Expor carrosséis globalmente para debug (opcional)
    window.mainCarousel = mainCarousel;
    window.testimonialsCarousel = testimonialsCarousel;
});

// Função utilitária para criar carrosséis dinamicamente
function createCarousel(containerId, options = {}) {
    return new Carousel(containerId, options);
}

// Exportar para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Carousel;
}
