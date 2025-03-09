// src/modules/chatManager.js

import ApiStorage from './apiStorage.js';
import ApiManager from './api.js';

export class ChatManager {
  constructor(uiManager, notificationSystem) {
    this.ui = uiManager;
    this.notifications = notificationSystem;

    // Hook up chat UI events
    const sendBtn = this.ui.getElement('sendButton');
    const msgInput = this.ui.getElement('messageInput');

    this.ui.safeAddEventListener(sendBtn, 'click', () => this.handleSendMessage());
    this.ui.safeAddEventListener(msgInput, 'keypress', (e) => {
      if (e.key === 'Enter') this.handleSendMessage();
    });
  }

  async handleSendMessage() {
    const input = this.ui.getElement('messageInput');
    const container = this.ui.getElement('chatContainer');
    if (!input || !container) return;

    const message = input.value.trim();
    if (!message) return;

    // user message
    this.appendMessage(message, 'user');
    input.value = '';

    // get AI response
    const reply = await this.getBotResponse(message);
    this.appendMessage(reply, 'bot');
  }

  appendMessage(content, type) {
    const chatContainer = this.ui.getElement('chatContainer');
    if (!chatContainer) return;

    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${type}`;
    bubble.textContent = content;
    chatContainer.appendChild(bubble);

    // scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  async getBotResponse(userMessage) {
    // read default model from local storage
    const defData = await ApiStorage.getDefaultConnection();
    const modelId = defData.defaultModel;
    if (!modelId) {
      console.error("No model selected");
      return "No model selected";
    }

    const response = await ApiManager.sendMessage(userMessage, modelId);
    return response;
  }
}
