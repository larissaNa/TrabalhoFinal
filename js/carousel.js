/**
 * Carousel.js - Sistema de Carrossel para WiseBites
 * Implementa todas as funcionalidades especificadas:
 * - Início automático com intervalo de 5 segundos
 * - Navegação manual com botões Anterior/Próximo
 * - Pausa inteligente no hover
 * - Reinício do temporizador após interação manual
 */

class Carousel { // Define uma classe para encapsular toda a lógica do carrossel
    constructor(containerId, options = {}) { // Construtor recebe o id do container e opções
        this.container = document.getElementById(containerId); // Pega o elemento principal do carrossel pelo ID
        this.slides = this.container.querySelectorAll('.carousel-slide, .testimonial-slide'); // Seleciona todos os slides (suporta dois tipos de classe)
        this.totalSlides = this.slides.length; // Quantidade total de slides
        this.currentSlide = 0; // Índice do slide atual (começa no 0)
        this.isPlaying = true; // Flag que indica se o autoplay está ativo
        this.interval = options.interval || 5000; // 5 segundos por padrão (pode vir das opções)
        this.timer = null; // Referência do setInterval (para poder limpar/debounçar)
        
        // Elementos de navegação
        this.prevBtn = this.container.parentElement.querySelector('.prev'); // Botão "Anterior" (busca no pai do container)
        this.nextBtn = this.container.parentElement.querySelector('.next'); // Botão "Próximo" (busca no pai do container)
        this.indicators = this.container.parentElement.querySelectorAll('.indicator'); // Pontinhos/indicadores de navegação
        
        // Configurações
        this.autoPlay = options.autoPlay !== false; // Autoplay ligado por padrão (só desliga se vier false)
        this.pauseOnHover = options.pauseOnHover !== false; // Pausar no hover ligado por padrão
        
        this.init(); // Chama a inicialização do carrossel
    }
    
    init() { // Método que configura tudo antes de rodar
        if (this.totalSlides === 0) return; // Se não tem slide, não faz nada
        
        // Configurar navegação
        this.setupNavigation(); // Liga eventos de botões e teclado
        
        // Configurar indicadores
        this.setupIndicators(); // Liga clique nos pontinhos
        
        // Configurar eventos de hover
        if (this.pauseOnHover) { // Só se a opção permitir
            this.setupHoverEvents(); // Pausa e retoma ao passar o mouse
        }
        
        // Iniciar auto-play
        if (this.autoPlay) { // Só se a opção permitir
            this.startAutoPlay(); // Começa o setInterval
        }
        
        // Mostrar slide inicial
        this.showSlide(0); // Garante que o primeiro slide apareça como "ativo"
    }
    
    setupNavigation() { // Liga os controles de navegação
        // Botão Anterior
        if (this.prevBtn) { // Se existir no DOM
            this.prevBtn.addEventListener('click', () => { // Ao clicar no "Anterior"
                this.prevSlide(); // Vai para o slide anterior
                this.restartTimer(); // Reinicia o timer do autoplay (anti “pular” logo em seguida)
            });
        }
        
        // Botão Próximo
        if (this.nextBtn) { // Se existir no DOM
            this.nextBtn.addEventListener('click', () => { // Ao clicar no "Próximo"
                this.nextSlide(); // Vai para o próximo slide
                this.restartTimer(); // Reinicia o timer do autoplay
            });
        }
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => { // Escuta teclas no documento
            // Só navega se o foco estiver dentro do carrossel (container ou pai)
            if (this.container.parentElement.contains(document.activeElement) || 
                this.container.contains(document.activeElement)) {
                if (e.key === 'ArrowLeft') { // Setinha esquerda
                    e.preventDefault(); // Evita scroll lateral ou comportamento padrão
                    this.prevSlide(); // Vai para anterior
                    this.restartTimer(); // Reinicia timer
                } else if (e.key === 'ArrowRight') { // Setinha direita
                    e.preventDefault(); // Evita comportamento padrão
                    this.nextSlide(); // Vai para próximo
                    this.restartTimer(); // Reinicia timer
                }
            }
        });
    }
    
    setupIndicators() { // Liga cliques nos indicadores (pontinhos)
        this.indicators.forEach((indicator, index) => { // Para cada indicador...
            indicator.addEventListener('click', () => { // Ao clicar...
                this.goToSlide(index); // Vai direto para o slide correspondente
                this.restartTimer(); // Reinicia timer do autoplay
            });
        });
    }
    
    setupHoverEvents() { // Configura pausa no hover do mouse
    const carouselContainer = this.container.closest('.carousel-container, .testimonials-carousel-container'); // Procura contêiner pai “oficial”

    if (carouselContainer) { // Se encontrou um contêiner adequado
        carouselContainer.addEventListener('mouseenter', () => { // Mouse entrou
            this.pauseAutoPlay(); // Pausa o autoplay
        });

        carouselContainer.addEventListener('mouseleave', () => { // Mouse saiu
            // Reinicia o temporizador quando o mouse sai
            this.restartTimer(); // Retoma o autoplay reiniciando o timer
        });
    }
}
    
    showSlide(index) { // Exibe o slide de um determinado índice
        // Validar índice
        if (index < 0) index = this.totalSlides - 1; // Se for menor que 0, vai para o último (efeito “loop”)
        if (index >= this.totalSlides) index = 0; // Se passar do último, volta para o primeiro
        
        // Remover classe active de todos os slides
        this.slides.forEach(slide => { // Itera sobre todos os slides
            slide.classList.remove('active'); // Esconde/Desmarca (CSS controla visual)
        });
        
        // Remover classe active de todos os indicadores
        this.indicators.forEach(indicator => { // Itera sobre todos os pontos
            indicator.classList.remove('active'); // Desmarca o indicador
        });
        
        // Adicionar classe active ao slide atual
        this.slides[index].classList.add('active'); // Marca o slide atual como ativo (CSS faz aparecer)
        
        // Adicionar classe active ao indicador atual
        if (this.indicators[index]) { // Se existir indicador correspondente
            this.indicators[index].classList.add('active'); // Marca o ponto atual
        }
        
        // Atualizar índice atual
        this.currentSlide = index; // Guarda qual é o slide atual
        
        // Atualizar transform do container
        const translateX = -index * 100; // Calcula deslocamento horizontal em %
        this.container.style.transform = `translateX(${translateX}%)`; // Move o trilho dos slides (layout típico de carrossel horizontal)
    }
    
    nextSlide() { // Vai para o próximo slide
        const nextIndex = this.currentSlide + 1; // Próximo índice
        this.showSlide(nextIndex); // Exibe o slide correspondente (com loop interno)
    }
    
    prevSlide() { // Vai para o slide anterior
        const prevIndex = this.currentSlide - 1; // Índice anterior
        this.showSlide(prevIndex); // Exibe o slide correspondente (com loop interno)
    }
    
    goToSlide(index) { // Vai diretamente para um slide específico
        this.showSlide(index); // Reutiliza showSlide para validar e aplicar
    }
    
    startAutoPlay() { // Inicia o temporizador do autoplay
        if (this.timer) { // Se já existir, limpa para não duplicar
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => { // Cria um intervalo que roda a cada this.interval
            if (this.isPlaying) { // Só avança se o autoplay estiver habilitado
                this.nextSlide(); // Avança um slide
            }
        }, this.interval);
    }
    
    pauseAutoPlay() { // Pausa o autoplay completamente
    this.isPlaying = false; // Marca como não tocando
    if (this.timer) { // Se existir timer ativo
        clearInterval(this.timer); // Cancela o intervalo
        this.timer = null; // Zera a referência
    }
}
    
    resumeAutoPlay() { // Retoma o autoplay
    this.isPlaying = true; // Marca como tocando
    this.startAutoPlay(); // Recria o intervalo
}
    
    restartTimer() { // Reinicia o temporizador após interação manual
        // Parar o timer atual
        if (this.timer) { // Se existe, limpa
            clearInterval(this.timer);
        }
        
        // Reiniciar o timer
        if (this.autoPlay) { // Só se o autoplay estiver habilitado
            this.startAutoPlay(); // Começa de novo (evita “pular” logo após o clique)
        }
    }
    
    destroy() { // Método de limpeza (caso precise desmontar o carrossel)
        if (this.timer) { // Se houver timer...
            clearInterval(this.timer); // Cancela o intervalo
        }
    }
}

// Inicialização dos carrosséis quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() { // Espera o HTML estar pronto
    // Carrossel principal (banners)
    const mainCarousel = new Carousel('mainCarousel', { // Cria instância para o container #mainCarousel
        interval: 5000, // 5 segundos entre trocas
        autoPlay: true, // Autoplay ligado
        pauseOnHover: true // Pausar ao passar o mouse
    });
    
    // Carrossel de depoimentos
    const testimonialsCarousel = new Carousel('testimonialsCarousel', { // Instância para #testimonialsCarousel
        interval: 5000, // 5 segundos
        autoPlay: true, // Autoplay ligado
        pauseOnHover: true // Pausar no hover
    });
    
    // Expor carrosséis globalmente para debug (opcional)
    window.mainCarousel = mainCarousel; // Permite acessar no console do navegador
    window.testimonialsCarousel = testimonialsCarousel; // Idem
});

// Função utilitária para criar carrosséis dinamicamente
function createCarousel(containerId, options = {}) { // Atalho para new Carousel(...)
    return new Carousel(containerId, options); // Retorna uma nova instância configurada
}

// Exportar para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) { // Checa se está em ambiente CommonJS (Node/bundlers)
    module.exports = Carousel; // Exporta a classe para importação em testes/outros arquivos
}
