/**
 * filter.js - Sistema de Filtros para Portfólio
 * Implementa filtragem de projetos por tecnologia
 * - Botões de categoria (React, Django, PHP, etc.)
 * - Botão "Todos" para mostrar todos os projetos
 * - Ocultar projetos que não correspondem ao filtro
 */

class ProjectFilter {
    constructor() {
        this.projects = document.querySelectorAll('.project-card');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        
        this.init();
    }
    
    init() {
        if (this.filterButtons.length === 0) return;
        
        // Adicionar event listeners aos botões de filtro
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterProjects(button.dataset.filter);
                this.updateActiveButton(button);
            });
        });
        
        // Mostrar todos os projetos inicialmente
        this.showAllProjects();
    }
    
    filterProjects(filter) {
        this.currentFilter = filter;
        
        this.projects.forEach(project => {
            const category = project.dataset.category;
            
            if (filter === 'all' || category === filter) {
                this.showProject(project);
            } else {
                this.hideProject(project);
            }
        });
        
        // Animar a transição
        this.animateFilterTransition();
    }
    
    showProject(project) {
        project.classList.remove('hidden');
        project.style.display = 'block';
        
        // Adicionar delay para animação em cascata
        setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'scale(1)';
        }, 50);
    }
    
    hideProject(project) {
        project.style.opacity = '0';
        project.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            project.classList.add('hidden');
            project.style.display = 'none';
        }, 300);
    }
    
    showAllProjects() {
        this.projects.forEach(project => {
            this.showProject(project);
        });
    }
    
    updateActiveButton(activeButton) {
        // Remover classe active de todos os botões
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Adicionar classe active ao botão clicado
        activeButton.classList.add('active');
    }
    
    animateFilterTransition() {
        // Adicionar efeito de transição suave
        const visibleProjects = Array.from(this.projects).filter(project => {
            return !project.classList.contains('hidden');
        });
        
        visibleProjects.forEach((project, index) => {
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'scale(1)';
            }, index * 100); // Delay em cascata
        });
    }
    
    // Método para filtrar por múltiplas categorias
    filterByMultipleCategories(categories) {
        this.projects.forEach(project => {
            const category = project.dataset.category;
            
            if (categories.includes(category)) {
                this.showProject(project);
            } else {
                this.hideProject(project);
            }
        });
    }
    
    // Método para buscar projetos por texto
    searchProjects(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        this.projects.forEach(project => {
            const title = project.querySelector('h3').textContent.toLowerCase();
            const description = project.querySelector('p').textContent.toLowerCase();
            const techTags = Array.from(project.querySelectorAll('.tech-tag'))
                .map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(term) || 
                           description.includes(term) || 
                           techTags.some(tag => tag.includes(term));
            
            if (matches) {
                this.showProject(project);
            } else {
                this.hideProject(project);
            }
        });
    }
    
    // Método para obter estatísticas dos filtros
    getFilterStats() {
        const stats = {
            total: this.projects.length,
            visible: 0,
            hidden: 0,
            byCategory: {}
        };
        
        this.projects.forEach(project => {
            const category = project.dataset.category;
            const isVisible = !project.classList.contains('hidden');
            
            if (isVisible) {
                stats.visible++;
            } else {
                stats.hidden++;
            }
            
            if (!stats.byCategory[category]) {
                stats.byCategory[category] = 0;
            }
            stats.byCategory[category]++;
        });
        
        return stats;
    }
    
    // Método para resetar filtros
    resetFilters() {
        this.currentFilter = 'all';
        this.showAllProjects();
        this.updateActiveButton(document.querySelector('[data-filter="all"]'));
    }
}

// Inicializar o sistema de filtros quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const projectFilter = new ProjectFilter();
    
    // Expor para uso global (opcional)
    window.projectFilter = projectFilter;
    
    // Adicionar funcionalidade de busca em tempo real (opcional)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value;
                
                if (searchTerm.trim() === '') {
                    projectFilter.resetFilters();
                } else {
                    projectFilter.searchProjects(searchTerm);
                }
            }, 300); // Debounce de 300ms
        });
    }
    
    // Adicionar funcionalidade de filtro por URL (opcional)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');
    
    if (categoryFilter) {
        const filterButton = document.querySelector(`[data-filter="${categoryFilter}"]`);
        if (filterButton) {
            projectFilter.filterProjects(categoryFilter);
            projectFilter.updateActiveButton(filterButton);
        }
    }
    
    // Adicionar funcionalidade de teclas de atalho (opcional)
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + F para focar na busca
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // ESC para resetar filtros
        if (e.key === 'Escape') {
            projectFilter.resetFilters();
        }
    });
    
    // Adicionar animações de entrada para os projetos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar projetos para animação de entrada
    projectFilter.projects.forEach(project => {
        project.style.opacity = '0';
        project.style.transform = 'translateY(30px)';
        observer.observe(project);
    });
});

// Função utilitária para criar filtros dinamicamente
function createProjectFilter(containerId, options = {}) {
    return new ProjectFilter(containerId, options);
}

// Exportar para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectFilter;
}
