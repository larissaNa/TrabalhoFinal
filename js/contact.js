/**
 * contact.js - Sistema de Validação de Formulário de Contato
 * Implementa validação robusta com feedback personalizado
 * - Validação em tempo real
 * - Contador de caracteres
 * - Feedback visual personalizado
 * - Simulação de envio de email
 */

class ContactFormValidator {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.nameInput = document.getElementById('contactName');
        this.emailInput = document.getElementById('contactEmail');
        this.subjectInput = document.getElementById('contactSubject');
        this.messageInput = document.getElementById('contactMessage');
        this.submitBtn = document.getElementById('contactSubmit');

        this.maxMessageLength = 500;
        this.minMessageLength = 10;

        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
            this.setupCharacterCounter();
            this.updateCharacterCounter(); // mostra "0 / 500" no load
        }
    }

    setupEventListeners() {
        // Validação em tempo real
        if (this.nameInput) {
            this.nameInput.addEventListener('input', () => {
                this.validateNameField();
            });
        }

        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => {
                this.validateEmailField();
            });
        }

        if (this.subjectInput) {
            this.subjectInput.addEventListener('input', () => {
                this.validateSubjectField();
            });
        }

        if (this.messageInput) {
            this.messageInput.addEventListener('input', () => {
                this.validateMessageField();
                this.updateCharacterCounter();
            });
        }

        // Submissão do formulário (agora garantindo o ID correto)
        if (this.form && this.form.id === 'contactForm') {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    }

    setupCharacterCounter() {
        if (this.messageInput) {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.id = 'charCounter';
            counter.textContent = `0 / ${this.maxMessageLength}`;

            const container = this.messageInput.parentElement;
            if (container) {
                container.appendChild(counter);
            }
        }
    }

    updateCharacterCounter() {
        const counter = document.getElementById('charCounter');
        if (counter && this.messageInput) {
            const currentLength = this.messageInput.value.length;
            counter.textContent = `${currentLength} / ${this.maxMessageLength}`;

            // Mudar cor baseado no comprimento
            counter.classList.remove('warning', 'error');

            if (currentLength > this.maxMessageLength) {
                counter.classList.add('error');
            } else if (currentLength > this.maxMessageLength * 0.8) {
                counter.classList.add('warning');
            }
        }
    }

    validateNameField() {
        const name = this.nameInput.value.trim();
        const container = this.nameInput.parentElement;

        this.clearFieldFeedback(container);
        this.nameInput.classList.remove('error', 'success');

        if (name === '') return;

        if (name.length < 2) {
            this.nameInput.classList.add('error');
            this.showFieldFeedback(container, 'Nome deve ter pelo menos 2 caracteres', 'error');
        } else {
            this.nameInput.classList.add('success');
            this.showFieldFeedback(container, 'Nome válido', 'success');
        }
    }

    validateEmailField() {
        const email = this.emailInput.value.trim();
        const container = this.emailInput.parentElement;

        this.clearFieldFeedback(container);
        this.emailInput.classList.remove('error', 'success');

        if (email === '') return;

        if (!this.isValidEmail(email)) {
            this.emailInput.classList.add('error');
            this.showFieldFeedback(container, 'Email deve ter um formato válido', 'error');
        } else {
            this.emailInput.classList.add('success');
            this.showFieldFeedback(container, 'Email válido', 'success');
        }
    }

    validateSubjectField() {
        const subject = this.subjectInput.value.trim();
        const container = this.subjectInput.parentElement;

        this.clearFieldFeedback(container);
        this.subjectInput.classList.remove('error', 'success');

        if (subject === '') return;

        if (subject.length < 3) {
            this.subjectInput.classList.add('error');
            this.showFieldFeedback(container, 'Assunto deve ter pelo menos 3 caracteres', 'error');
        } else {
            this.subjectInput.classList.add('success');
            this.showFieldFeedback(container, 'Assunto válido', 'success');
        }
    }

    validateMessageField() {
        const message = this.messageInput.value.trim();
        const container = this.messageInput.parentElement;

        this.clearFieldFeedback(container);
        this.messageInput.classList.remove('error', 'success');

        if (message === '') return;

        if (message.length < this.minMessageLength) {
            this.messageInput.classList.add('error');
            this.showFieldFeedback(container, `Mensagem deve ter pelo menos ${this.minMessageLength} caracteres`, 'error');
        } else if (message.length > this.maxMessageLength) {
            this.messageInput.classList.add('error');
            this.showFieldFeedback(container, `Mensagem não pode ter mais de ${this.maxMessageLength} caracteres`, 'error');
        } else {
            this.messageInput.classList.add('success');
            this.showFieldFeedback(container, 'Mensagem válida', 'success');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    clearFieldFeedback(container) {
        const existingFeedback = container.querySelector('.field-feedback');
        if (existingFeedback) existingFeedback.remove();
    }

    showFieldFeedback(container, message, type) {
        const feedback = document.createElement('div');
        feedback.className = `field-feedback ${type}`;
        feedback.textContent = message;
        container.appendChild(feedback);
    }

    validateForm() {
        const errors = [];

        const name = this.nameInput.value.trim();
        if (!name) errors.push('Nome é obrigatório');
        else if (name.length < 2) errors.push('Nome deve ter pelo menos 2 caracteres');

        const email = this.emailInput.value.trim();
        if (!email) errors.push('Email é obrigatório');
        else if (!this.isValidEmail(email)) errors.push('Email deve ter um formato válido');

        const subject = this.subjectInput.value.trim();
        if (!subject) errors.push('Assunto é obrigatório');
        else if (subject.length < 3) errors.push('Assunto deve ter pelo menos 3 caracteres');

        const message = this.messageInput.value.trim();
        if (!message) errors.push('Mensagem é obrigatória');
        else if (message.length < this.minMessageLength) errors.push(`Mensagem deve ter pelo menos ${this.minMessageLength} caracteres`);
        else if (message.length > this.maxMessageLength) errors.push(`Mensagem não pode ter mais de ${this.maxMessageLength} caracteres`);

        return { isValid: errors.length === 0, errors };
    }

    async handleSubmit() {
        // ✅ Corrigido: garante que estamos no contactForm
        if (!this.form || this.form.id !== 'contactForm') return;

        const validation = this.validateForm();
        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }

        this.setSubmitButtonLoading(true);
        try {
            await this.simulateEmailSend();

            // Toast local de sucesso
            const toast = document.createElement('div');
            toast.className = 'message success';
            toast.innerHTML = 'Formulário enviado com sucesso!';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 5000);

            this.resetForm();
        } catch (error) {
            this.showErrorMessage('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            this.setSubmitButtonLoading(false);
        }
    }

    async simulateEmailSend() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Email enviado com sucesso para contato@wisebites.com!');
                resolve();
            }, 2000);
        });
    }

    showValidationErrors(errors) {
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
        setTimeout(() => toast.remove(), 6000);
    }

    showSuccessMessage() {
        const toast = document.createElement('div');
        toast.className = 'message success';
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>✅</span>
                <strong>Mensagem enviada com sucesso!</strong>
            </div>
            <p style="margin: 8px 0 0 0; font-size: 0.9rem;">
                Sua mensagem foi enviada para contato@wisebites.com
            </p>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    showErrorMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'message error';
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>❌</span>
                <strong>${message}</strong>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    setSubmitButtonLoading(loading) {
        if (!this.submitBtn) return;
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<span>Enviando...</span>';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<span>Enviar</span>';
        }
    }

    resetForm() {
        if (!this.form) return;
        this.form.reset();

        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => input.classList.remove('error', 'success'));

        const feedbacks = this.form.querySelectorAll('.field-feedback');
        feedbacks.forEach(f => f.remove());

        this.updateCharacterCounter();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        const contactValidator = new ContactFormValidator();
        window.contactValidator = contactValidator;
    }
});
