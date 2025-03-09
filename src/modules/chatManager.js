export class ChatManager {
    constructor(ui, notifications) {
      this.ui = ui;
      this.notifications = notifications;
      this.initializeChatEvents();
    }
  
    initializeChatEvents() {
      this.ui.safeAddEventListener(this.ui.getElement('send-button'), 'click', () => this.handleMessageSend());
      this.ui.safeAddEventListener(this.ui.getElement('message-input'), 'keypress', (e) => {
        if (e.key === 'Enter') this.handleMessageSend();
      });
    }
  
    handleMessageSend() {
      const message = this.ui.getElement('message-input').value.trim();
      if (!message) return;
  
      this.addMessageBubble(message, true);
      this.ui.getElement('message-input').value = '';
      
      setTimeout(() => {
        this.addMessageBubble("Connect API", false);
      }, 500);
    }
  
    addMessageBubble(text, isUser) {
      const bubble = document.createElement('div');
      bubble.textContent = text;
      bubble.className = `message-bubble ${isUser ? 'user' : 'bot'}`;
      this.ui.getElement('chat-container').appendChild(bubble);
    }
  }