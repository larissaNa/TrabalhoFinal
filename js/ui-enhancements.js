// ui-enhancements.js
// Efeitos: Botão Voltar ao Topo e Botão Copiar (Clipboard)

document.addEventListener('DOMContentLoaded', function() {
    // --- Botão Voltar ao Topo ---
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTopBtn';
    backToTopBtn.title = 'Voltar ao topo';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.style.display = 'none';
    document.body.appendChild(backToTopBtn);

    // Estilo básico (pode ser melhorado no CSS)
    backToTopBtn.style.position = 'fixed';
    backToTopBtn.style.right = '32px';
    backToTopBtn.style.bottom = '32px';
    backToTopBtn.style.zIndex = '9999';
    backToTopBtn.style.padding = '12px 16px';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.background = '#2d8cff';
    backToTopBtn.style.color = '#fff';
    backToTopBtn.style.fontSize = '1.5rem';
    backToTopBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    backToTopBtn.style.border = 'none';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.transition = 'opacity 0.3s';
    backToTopBtn.style.opacity = '0';

    // Mostrar/ocultar botão ao rolar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
            setTimeout(() => backToTopBtn.style.opacity = '1', 10);
        } else {
            backToTopBtn.style.opacity = '0';
            setTimeout(() => backToTopBtn.style.display = 'none', 300);
        }
    });

    // Scroll suave ao topo
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Botão Copiar E-mail ---
    // Procura por elementos com a classe 'copy-email-btn' e atributo 'data-email'
    document.querySelectorAll('.copy-email-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const email = btn.getAttribute('data-email');
            if (!email) return;
            navigator.clipboard.writeText(email).then(() => {
                const original = btn.innerHTML;
                btn.innerHTML = 'Copiado!';
                btn.disabled = true;
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // --- Menu Hambúrguer Responsivo ---
(function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
})();

// --- Alternador de Tema Claro/Escuro ---
    (function() {
        const body = document.body;
        const root = document.documentElement;
        const themeBtn = document.getElementById('themeToggleBtn');
        const themeIcon = document.getElementById('themeIcon');
        const THEME_KEY = 'theme';

        function setThemeClasses(isDark) {
            if (isDark) {
                root.classList.add('dark-theme');
                body.classList.add('dark-theme');
                if (themeIcon) themeIcon.textContent = '☀️';
            } else {
                root.classList.remove('dark-theme');
                body.classList.remove('dark-theme');
                if (themeIcon) themeIcon.textContent = '🌙';
            }
        }

        // Aplica o tema salvo
        (function applySavedTheme() {
            const saved = localStorage.getItem(THEME_KEY);
            setThemeClasses(saved === 'dark');
        })();

        // Alternar tema ao clicar
        if (themeBtn) {
            themeBtn.addEventListener('click', function() {
                const isDark = !root.classList.contains('dark-theme');
                setThemeClasses(isDark);
                localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
            });
        }
    })();
});
