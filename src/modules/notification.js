export class NotificationSystem {
    constructor() {
      this.container = document.getElementById('notification-container');
    }
  
    show(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      this.container.appendChild(notification);
      
      setTimeout(() => notification.remove(), 3000);
    }
  }