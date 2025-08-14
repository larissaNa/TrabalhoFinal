/**
 * login.js - Sistema de Login
 * Implementa tela de login modal com validação
 * - Modal de login/pop-up
 * - Validação de formulário
 * - Controle de estado logado/deslogado
 * - Substituição do link "Login" por informações do perfil
 */

class LoginSystem {
    constructor() {
        this.modal = document.getElementById('loginModal');
        this.loginBtn = document.getElementById('loginBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.userProfile = document.getElementById('userProfile');
        this.loginForm = document.getElementById('loginForm');
        this.closeBtn = document.querySelector('.close');
        
        this.isLoggedIn = false;
        this.currentUser = null;
        
        this.init();
    }
    
    init() {
        // Verificar se há usuário logado no localStorage
        this.checkStoredUser();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Configurar validação em tempo real
        this.setupRealTimeValidation();
        
        // Atualizar interface baseada no estado de login
        this.updateUI();
    }
    
    setupEventListeners() {
        // Abrir modal de login
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }
        
        // Fechar modal
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Fechar modal ao clicar fora
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
        
        // Submissão do formulário de login
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Logout
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }
    
    openModal() {
        if (this.modal) {
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevenir scroll
            
            // Focar no primeiro campo
            const firstInput = this.modal.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }
    
    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = ''; // Restaurar scroll
            
            // Limpar formulário
            if (this.loginForm) {
                this.loginForm.reset();
            }
        }
    }
    
    async handleLogin() {
        const formData = new FormData(this.loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        if (!this.validateLoginForm(email, password)) {
            return;
        }

        try {
            const user = await this.validateCredentials(email, password);

            if (user) {
                this.loginUser(user, true);
                this.closeModal();
            } else {
                this.showMessage('Email ou senha incorretos.', 'error');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            this.showMessage('Erro ao realizar login. Tente novamente.', 'error');
        }
    }
        
    validateLoginForm(email, password) {
        let isValid = true;
        const errors = [];
        
        // Validar email
        if (!email || email.trim() === '') {
            errors.push('Email é obrigatório');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            errors.push('Email deve ter um formato válido');
            isValid = false;
        }
        
        // Validar senha
        if (!password || password.trim() === '') {
            errors.push('Senha é obrigatória');
            isValid = false;
        } else {
            const passwordValidation = this.validatePassword(password);
            if (!passwordValidation.isValid) {
                errors.push(...passwordValidation.errors);
                isValid = false;
            }
        }
        
        // Mostrar erros se houver
        if (!isValid) {
            this.showValidationErrors(errors);
        }
        
        return isValid;
    }
    
    validatePassword(password) {
        const errors = [];
        let isValid = true;
        
        // Mínimo de 8 caracteres
        if (password.length < 8) {
            errors.push('Senha deve ter no mínimo 8 caracteres');
            isValid = false;
        }
        
        // Mínimo de 2 números
        const numbers = password.match(/\d/g);
        if (!numbers || numbers.length < 2) {
            errors.push('Senha deve conter pelo menos 2 números');
            isValid = false;
        }
        
        // Mínimo de 1 caractere especial
        const specialChars = password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g);
        if (!specialChars || specialChars.length < 1) {
            errors.push('Senha deve conter pelo menos 1 caractere especial (!@#$%^&*)');
            isValid = false;
        }
        
        // Mínimo de 1 letra maiúscula
        if (!/[A-Z]/.test(password)) {
            errors.push('Senha deve conter pelo menos 1 letra maiúscula');
            isValid = false;
        }
        
        // Mínimo de 1 letra minúscula
        if (!/[a-z]/.test(password)) {
            errors.push('Senha deve conter pelo menos 1 letra minúscula');
            isValid = false;
        }
        
        return { isValid, errors };
    }
    
    showValidationErrors(errors) {
        // Criar toast de erro personalizado
        const toast = document.createElement('div');
        toast.className = 'message error validation-toast';
        toast.innerHTML = `
            <div class="validation-header">
                <span class="validation-icon">⚠️</span>
                <strong>Erros de Validação:</strong>
            </div>
            <ul class="validation-list">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        
        document.body.appendChild(toast);
        
        // Remover após 6 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 6000);
    }
    
    // Adicionar validação em tempo real
    setupRealTimeValidation() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                this.validateEmailField(emailInput);
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.validatePasswordField(passwordInput);
            });
        }
    }
    
    validateEmailField(input) {
        const email = input.value.trim();
        const emailContainer = input.parentElement;
        
        // Remover classes de erro anteriores
        input.classList.remove('error');
        const existingFeedback = emailContainer.querySelector('.field-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        if (email === '') {
            return; // Não mostrar erro se estiver vazio
        }
        
        if (!this.isValidEmail(email)) {
            input.classList.add('error');
            this.showFieldFeedback(emailContainer, 'Email deve ter um formato válido', 'error');
        } else {
            this.showFieldFeedback(emailContainer, 'Email válido', 'success');
        }
    }
    
    validatePasswordField(input) {
        const password = input.value;
        const passwordContainer = input.parentElement;
        
        // Remover classes de erro anteriores
        input.classList.remove('error');
        const existingFeedback = passwordContainer.querySelector('.field-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        if (password === '') {
            return; // Não mostrar erro se estiver vazio
        }
        
        const validation = this.validatePassword(password);
        
        if (!validation.isValid) {
            input.classList.add('error');
            this.showFieldFeedback(passwordContainer, validation.errors[0], 'error');
        } else {
            this.showFieldFeedback(passwordContainer, 'Senha válida', 'success');
        }
    }
    
    showFieldFeedback(container, message, type) {
        const feedback = document.createElement('div');
        feedback.className = `field-feedback ${type}`;
        feedback.textContent = message;
        container.appendChild(feedback);
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    async validateCredentials(email, password) {
        // Simular validação de credenciais
        // Em um projeto real, isso seria uma chamada para API
        
        // Credenciais de exemplo para demonstração
        const validUsers = [
            {
                id: 1,
                name: 'João Silva',
                email: 'joao@example.com',
                password: '12345678@Js',
                avatar: 'assets/images/user-avatar.png'
            },
            {
                id: 2,
                name: 'Maria Santos',
                email: 'maria@example.com',
                password: '123456',
                avatar: 'assets/images/user-avatar.png'
            },
            {
                id: 3,
                name: 'Admin',
                email: 'admin@wisebites.com',
                password: 'admin123',
                avatar: 'assets/images/user-avatar.png'
            }
        ];
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Encontrar usuário
        const user = validUsers.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );
        
        if (user) {
            // Remover senha do objeto retornado
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        
        return null;
    }
    
    loginUser(user, isManualLogin = true) {
        this.isLoggedIn = true;
        this.currentUser = user;

        localStorage.setItem('wisebites_user', JSON.stringify(user));
        localStorage.setItem('wisebites_logged_in', 'true');

        this.updateUI();
        this.dispatchLoginEvent(user);

        if (window.notificationSystem) {
            // Remove qualquer notificação antiga salva
            localStorage.removeItem('wisebites_notifications');
            window.notificationSystem.clearNotifications();

            // Ativa sistema normalmente
            window.notificationSystem.enableNotifications();

            // Adiciona apenas a notificação de login
            window.notificationSystem.addNotification({
                type: 'login',
                title: 'Login realizado com sucesso!',
                message: `Bem-vindo de volta, ${user.name}!`
            });
        }


        if (isManualLogin) {
            this.showMessage('Login realizado com sucesso!', 'success');
        }
    }
    
    handleLogout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        
        // Limpar localStorage
        localStorage.removeItem('wisebites_user');
        localStorage.removeItem('wisebites_logged_in');
        
        // Atualizar interface
        this.updateUI();
        
        // Disparar evento customizado
        this.dispatchLogoutEvent();
        
        // Adicionar notificação de logout (se o sistema de notificações estiver disponível)
        if (window.notificationSystem) {
            window.notificationSystem.addNotification({
                type: 'logout',
                title: 'Logout realizado',
                message: 'Você foi desconectado com sucesso.'
            });
        }
        
        this.showMessage('Logout realizado com sucesso!', 'success');
    }
    
    checkStoredUser() {
        const storedUser = localStorage.getItem('wisebites_user');
        const isLoggedIn = localStorage.getItem('wisebites_logged_in');
        
        if (storedUser && isLoggedIn === 'true') {
            try {
                this.currentUser = JSON.parse(storedUser);
                this.isLoggedIn = true;
                // ✅ Apenas atualiza a interface sem mostrar mensagem
                this.updateUI();
            } catch (error) {
                console.error('Erro ao carregar usuário do localStorage:', error);
                this.clearStoredUser();
            }
        }
    }

    
    clearStoredUser() {
        localStorage.removeItem('wisebites_user');
        localStorage.removeItem('wisebites_logged_in');
    }
    
    updateUI() {
        if (this.isLoggedIn && this.currentUser) {
            // Mostrar perfil do usuário
            this.showUserProfile();
        } else {
            // Mostrar botão de login
            this.showLoginButton();
        }
    }
    
    showUserProfile() {
        if (this.loginBtn) {
            this.loginBtn.style.display = 'none';
        }
        
        if (this.userProfile) {
            this.userProfile.style.display = 'flex';
            
            // Atualizar informações do usuário
            const userName = this.userProfile.querySelector('.user-name');
            const userAvatar = this.userProfile.querySelector('.user-avatar');
            
            if (userName) {
                userName.textContent = this.currentUser.name;
            }
            
            if (userAvatar && this.currentUser.avatar) {
                userAvatar.src = this.currentUser.avatar;
            }
        }
    }
    
    showLoginButton() {
        if (this.loginBtn) {
            this.loginBtn.style.display = 'block';
        }
        
        if (this.userProfile) {
            this.userProfile.style.display = 'none';
        }
    }
    
    dispatchLoginEvent(user) {
        const event = new CustomEvent('userLogin', {
            detail: { user }
        });
        document.dispatchEvent(event);
    }
    
    dispatchLogoutEvent() {
        const event = new CustomEvent('userLogout');
        document.dispatchEvent(event);
    }
    
    showMessage(message, type = 'info') {
        // Criar elemento de mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `login-message ${type}`;
        messageDiv.textContent = message;
        
        // Adicionar ao DOM
        document.body.appendChild(messageDiv);
        
        // Remover após 5 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    // Método para verificar se usuário está logado
    isUserLoggedIn() {
        return this.isLoggedIn;
    }
    
    // Método para obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Método para verificar permissões (exemplo)
    hasPermission(permission) {
        if (!this.isLoggedIn || !this.currentUser) {
            return false;
        }
        
        // Exemplo de verificação de permissões
        const userPermissions = {
            'admin@wisebites.com': ['admin', 'read', 'write'],
            'joao@example.com': ['read', 'write'],
            'maria@example.com': ['read']
        };
        
        const userPerms = userPermissions[this.currentUser.email] || [];
        return userPerms.includes(permission);
    }
}

// Inicializar o sistema de login quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const loginSystem = new LoginSystem();
    
    // Expor para uso global
    window.loginSystem = loginSystem;
    
    // Adicionar estilos CSS dinamicamente para mensagens
    const loginStyles = `
        .login-message {
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
        
        .login-message.success {
            background: #059669;
        }
        
        .login-message.error {
            background: #dc2626;
        }
        
        .login-message.info {
            background: #3b82f6;
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
        
        /* Melhorias no modal */
        .modal {
            animation: fadeIn 0.3s ease-out;
        }
        
        .modal-content {
            animation: slideInUp 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Melhorias nos formulários */
        .form-group input:invalid {
            border-color: #dc2626;
        }
        
        .form-group input:valid {
            border-color: #059669;
        }
        
        /* Indicador de carregamento */
        .btn-primary.loading {
            position: relative;
            color: transparent;
        }
        
        .btn-primary.loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 16px;
            height: 16px;
            margin: -8px 0 0 -8px;
            border: 2px solid white;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loginStyles;
    document.head.appendChild(styleSheet);
    
    // Adicionar funcionalidade de registro (opcional)
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginSystem.showMessage('Funcionalidade de registro em desenvolvimento!', 'info');
        });
    }
    
    // Adicionar funcionalidade de "Lembrar de mim" (opcional)
    const rememberMeCheckbox = document.createElement('input');
    rememberMeCheckbox.type = 'checkbox';
    rememberMeCheckbox.id = 'rememberMe';
    rememberMeCheckbox.name = 'rememberMe';
    
    const rememberMeLabel = document.createElement('label');
    rememberMeLabel.htmlFor = 'rememberMe';
    rememberMeLabel.textContent = 'Lembrar de mim';
    
    const rememberMeDiv = document.createElement('div');
    rememberMeDiv.className = 'form-group';
    rememberMeDiv.appendChild(rememberMeCheckbox);
    rememberMeDiv.appendChild(rememberMeLabel);
    
    // Adicionar antes do botão de submit
    const submitBtn = loginSystem.loginForm?.querySelector('button[type="submit"]');
    if (submitBtn && loginSystem.loginForm) {
        loginSystem.loginForm.insertBefore(rememberMeDiv, submitBtn);
    }
});

// Função utilitária para criar sistema de login
function createLoginSystem(options = {}) {
    return new LoginSystem(options);
}

// Exportar para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginSystem;
}
