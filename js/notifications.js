class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.notificationList = document.getElementById('notificationList');
        this.notificationBtn = document.getElementById('notificationBtn');
        this.silentMode = true; // <-- MODO SILENCIOSO

        this.bindEvents();
    }

    bindEvents() {
        if (this.notificationBtn) {
            this.notificationBtn.addEventListener('click', () => this.toggleNotifications());
        }

        window.addEventListener('userLogin', (e) => {
            this.clearNotifications();
            this.addNotification(`Bem-vindo, ${e.detail.email}!`);
        });

        window.addEventListener('userLogout', () => {
            this.clearNotifications();
        });
    }

    addNotification(notification) {
        this.notifications.push(notification);

        // Só salvar notificações persistentes
        const persistents = this.notifications.filter(n => n.persistent);
        localStorage.setItem('notifications', JSON.stringify(persistents));

        this.renderNotifications();
    }


    clearNotifications() {
        this.notifications = [];
        this.saveNotifications();
        this.renderNotifications();
    }


    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }
    
    loadNotifications() {
        const saved = JSON.parse(localStorage.getItem('notifications')) || [];
        this.notifications = saved;

        if (!this.silentMode) {
            this.renderNotifications();
        }
    }


    renderNotifications() {
        if (!this.notificationList) return;
        this.notificationList.innerHTML = '';

        if (this.notifications.length === 0) {
            this.notificationList.innerHTML = '<li>Sem notificações</li>';
            return;
        }

        this.notifications.forEach(n => {
            const li = document.createElement('li');
            li.textContent = `${n.message} (${n.time})`;
            this.notificationList.appendChild(li);
        });
    }

    toggleNotifications() {
        const panel = document.getElementById('notificationPanel');
        panel.classList.toggle('show');
    }

    // Ativa notificações depois de login ou evento
    enableNotifications() {
        this.silentMode = false;
        this.loadNotifications();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.notificationSystem = new NotificationSystem();
});
