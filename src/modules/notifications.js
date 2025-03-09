// src/modules/notification.js

export class NotificationSystem {
    constructor(uiManager) {
      // Use the UI Manager’s reference to find the notification container
      this.ui = uiManager;
      this.container = this.ui.getElement('notificationContainer') || document.body;
    }
  
    show(message, type = 'info') {
      const note = document.createElement('div');
      note.className = `notification ${type}`;
      note.textContent = message;
  
      this.container.appendChild(note);
  
      setTimeout(() => {
        if (note.parentNode) {
          note.remove();
        }
      }, 3000);
    }
  }
  