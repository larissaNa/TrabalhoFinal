/**
 * search.js - Sistema de Pesquisa Global
 * Implementa busca assíncrona em todas as páginas do site
 * - Captura de termo via URL (search.html?q=django)
 * - Busca assíncrona com fetch()
 * - Análise do DOM com DOMParser
 * - Busca em tags de texto (h1, h2, p, a, etc.)
 * - Exibição dinâmica de resultados
 */

class SiteSearch {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchResults = [];
        this.isSearching = false;
        
        // Páginas do site para buscar
        this.sitePages = [
            'index.html',
            'portfolio.html'
        ];
        
        this.init();
    }
    
    init() {
        if (this.searchInput && this.searchBtn) {
            this.setupEventListeners();
        }
        
        // Verificar se há termo de busca na URL
        this.checkURLSearch();
    }
    
    setupEventListeners() {
        // Busca ao clicar no botão
        this.searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.performSearch();
        });
        
        // Busca ao pressionar Enter
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
            }
        });
        
        // Busca em tempo real (opcional)
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (e.target.value.length >= 3) {
                    this.performSearch();
                }
            }, 500);
        });
    }
    
    checkURLSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('q');
        
        if (searchTerm) {
            this.searchInput.value = searchTerm;
            this.performSearch();
        }
    }
    
    async performSearch() {
        const searchTerm = this.searchInput.value.trim();
        
        if (!searchTerm) {
            this.showMessage('Digite um termo para pesquisar', 'info');
            return;
        }
        
        this.setLoadingState(true);
        this.searchResults = [];
        
        try {
            // Buscar em todas as páginas do site
            await this.searchAllPages(searchTerm);
            
            if (this.searchResults.length > 0) {
                this.displayResults(searchTerm);
            } else {
                this.showMessage(`Nenhum resultado encontrado para "${searchTerm}"`, 'warning');
            }
        } catch (error) {
            console.error('Erro na busca:', error);
            this.showMessage('Erro ao realizar a busca. Tente novamente.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async searchAllPages(searchTerm) {
        const searchPromises = this.sitePages.map(page => 
            this.searchPage(page, searchTerm)
        );
        
        await Promise.all(searchPromises);
    }
    
    async searchPage(pageUrl, searchTerm) {
        try {
            const response = await fetch(pageUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const htmlContent = await response.text();
            const results = this.parseHTMLContent(htmlContent, searchTerm, pageUrl);
            
            this.searchResults.push(...results);
        } catch (error) {
            console.error(`Erro ao buscar em ${pageUrl}:`, error);
        }
    }
    
    parseHTMLContent(htmlContent, searchTerm, pageUrl) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const results = [];
        
        // Tags para buscar
        const searchTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'div'];
        const searchTermLower = searchTerm.toLowerCase();
        
        searchTags.forEach(tag => {
            const elements = doc.querySelectorAll(tag);
            
            elements.forEach(element => {
                const text = element.textContent.trim();
                
                if (text && text.toLowerCase().includes(searchTermLower)) {
                    const result = this.createSearchResult(element, text, searchTerm, pageUrl);
                    if (result) {
                        results.push(result);
                    }
                }
            });
        });
        
        return results;
    }
    
    createSearchResult(element, text, searchTerm, pageUrl) {
        // Extrair contexto ao redor do termo encontrado
        const context = this.extractContext(text, searchTerm);
        
        // Determinar o tipo de conteúdo
        const tagName = element.tagName.toLowerCase();
        let contentType = 'text';
        
        if (tagName.startsWith('h')) {
            contentType = 'heading';
        } else if (tagName === 'a') {
            contentType = 'link';
        }
        
        return {
            text: text,
            context: context,
            pageUrl: pageUrl,
            contentType: contentType,
            tagName: tagName,
            element: element
        };
    }
    
    extractContext(text, searchTerm, contextLength = 100) {
        const searchTermLower = searchTerm.toLowerCase();
        const textLower = text.toLowerCase();
        const index = textLower.indexOf(searchTermLower);
        
        if (index === -1) return text;
        
        const start = Math.max(0, index - contextLength / 2);
        const end = Math.min(text.length, index + searchTerm.length + contextLength / 2);
        
        let context = text.substring(start, end);
        
        // Adicionar "..." se necessário
        if (start > 0) context = '...' + context;
        if (end < text.length) context = context + '...';
        
        // Destacar o termo encontrado
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        context = context.replace(regex, '<mark>$1</mark>');
        
        return context;
    }
    
    displayResults(searchTerm) {
        // Criar container de resultados se não existir
        let resultsContainer = document.getElementById('searchResults');
        
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'searchResults';
            resultsContainer.className = 'search-results';
            document.body.appendChild(resultsContainer);
        }
        
        // Limpar resultados anteriores
        resultsContainer.innerHTML = '';
        
        // Criar cabeçalho dos resultados
        const header = document.createElement('div');
        header.className = 'search-results-header';
        header.innerHTML = `
            <h3>Resultados da busca para "${searchTerm}"</h3>
            <p>${this.searchResults.length} resultado(s) encontrado(s)</p>
        `;
        resultsContainer.appendChild(header);
        
        // Agrupar resultados por página
        const resultsByPage = this.groupResultsByPage();
        
        // Exibir resultados
        Object.keys(resultsByPage).forEach(pageUrl => {
            const pageResults = resultsByPage[pageUrl];
            const pageSection = this.createPageSection(pageUrl, pageResults);
            resultsContainer.appendChild(pageSection);
        });
        
        // Mostrar container de resultados
        resultsContainer.style.display = 'block';
        
        // Scroll para os resultados
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    groupResultsByPage() {
        const grouped = {};
        
        this.searchResults.forEach(result => {
            if (!grouped[result.pageUrl]) {
                grouped[result.pageUrl] = [];
            }
            grouped[result.pageUrl].push(result);
        });
        
        return grouped;
    }
    
    createPageSection(pageUrl, results) {
        const section = document.createElement('div');
        section.className = 'search-page-section';
        
        const pageName = this.getPageName(pageUrl);
        
        section.innerHTML = `
            <h4>${pageName}</h4>
            <div class="search-results-list">
                ${results.map(result => this.createResultItem(result)).join('')}
            </div>
        `;
        
        return section;
    }
    
    createResultItem(result) {
        const pageName = this.getPageName(result.pageUrl);
        
        return `
            <div class="search-result-item">
                <div class="result-content">
                    <div class="result-context">${result.context}</div>
                    <div class="result-meta">
                        <span class="result-type">${this.getContentTypeLabel(result.contentType)}</span>
                        <a href="${result.pageUrl}" class="result-link">Ver em ${pageName}</a>
                    </div>
                </div>
            </div>
        `;
    }
    
    getPageName(pageUrl) {
        const pageNames = {
            'index.html': 'Página Inicial',
            'portfolio.html': 'Portfólio'
        };
        
        return pageNames[pageUrl] || pageUrl;
    }
    
    getContentTypeLabel(contentType) {
        const labels = {
            'heading': 'Título',
            'link': 'Link',
            'text': 'Texto'
        };
        
        return labels[contentType] || 'Conteúdo';
    }
    
    setLoadingState(isLoading) {
        this.isSearching = isLoading;
        
        if (this.searchBtn) {
            if (isLoading) {
                this.searchBtn.classList.add('search-loading');
                this.searchBtn.textContent = '⏳';
            } else {
                this.searchBtn.classList.remove('search-loading');
                this.searchBtn.textContent = '🔍';
            }
        }
        
        if (this.searchInput) {
            this.searchInput.disabled = isLoading;
        }
    }
    
    showMessage(message, type = 'info') {
        // Criar elemento de mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `search-message ${type}`;
        messageDiv.textContent = message;
        
        // Adicionar ao DOM
        document.body.appendChild(messageDiv);
        
        // Remover após 5 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    // Método para limpar resultados
    clearResults() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
        
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }
    
    // Método para buscar em uma página específica
    async searchSpecificPage(pageUrl, searchTerm) {
        try {
            const response = await fetch(pageUrl);
            const htmlContent = await response.text();
            return this.parseHTMLContent(htmlContent, searchTerm, pageUrl);
        } catch (error) {
            console.error(`Erro ao buscar em ${pageUrl}:`, error);
            return [];
        }
    }
}

// Inicializar o sistema de busca quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const siteSearch = new SiteSearch();
    
    // Expor para uso global
    window.siteSearch = siteSearch;
    
    // Adicionar estilos CSS dinamicamente para os resultados
    const searchStyles = `
        .search-results {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-height: 70vh;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            border-radius: 0 0 16px 16px;
        }
        
        .search-results-header {
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
            background: #f8fafc;
        }
        
        .search-results-header h3 {
            margin: 0 0 10px 0;
            color: #1f2937;
        }
        
        .search-results-header p {
            margin: 0;
            color: #6b7280;
        }
        
        .search-page-section {
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .search-page-section h4 {
            margin: 0 0 15px 0;
            color: #059669;
            font-size: 1.1rem;
        }
        
        .search-result-item {
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 10px;
            background: #f9fafb;
        }
        
        .result-context {
            margin-bottom: 10px;
            line-height: 1.5;
            color: #374151;
        }
        
        .result-context mark {
            background: #fef3c7;
            color: #92400e;
            padding: 2px 4px;
            border-radius: 4px;
        }
        
        .result-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;
        }
        
        .result-type {
            background: #e0f2fe;
            color: #0369a1;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
        }
        
        .result-link {
            color: #059669;
            text-decoration: none;
            font-weight: 500;
        }
        
        .result-link:hover {
            text-decoration: underline;
        }
        
        .search-message {
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
        
        .search-message.info {
            background: #3b82f6;
        }
        
        .search-message.warning {
            background: #f59e0b;
        }
        
        .search-message.error {
            background: #ef4444;
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
        
        @media (max-width: 768px) {
            .search-results {
                top: 120px;
                max-height: 60vh;
            }
            
            .result-meta {
                flex-direction: column;
                gap: 10px;
                align-items: flex-start;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = searchStyles;
    document.head.appendChild(styleSheet);
});

// Função utilitária para criar busca dinamicamente
function createSiteSearch(options = {}) {
    return new SiteSearch(options);
}

// Exportar para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteSearch;
}
