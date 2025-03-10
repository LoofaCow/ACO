// renderer_chat.js – Chat functions: sending messages and appending chat bubbles
const ApiStorage = require('../modules/apiStorage');
const ApiManager = require('../modules/api');

const rendererChat = {
  async getBotResponse(message) {
    // Use stored default model from ApiStorage
    const defaultData = await ApiStorage.getDefaultConnection();
    const modelId = defaultData.defaultModel;
    if (!modelId) {
      console.error("No model selected");
      return "No model selected";
    }
    const response = await ApiManager.sendMessage(message, modelId);
    return response;
  },

  async handleSendMessage() {
    const messageInput = document.getElementById('message-input');
    const chatContainer = document.getElementById('chat-container');
    const message = messageInput.value.trim();
    if (!message) return;
    this.appendMessage(message, 'user');
    messageInput.value = '';
    const botResponse = await this.getBotResponse(message);
    this.appendMessage(botResponse, 'bot');
  },

  appendMessage(content, type = 'user') {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-bubble ${type}`;
    messageDiv.textContent = content;
    chatContainer.appendChild(messageDiv);
    this.scrollToBottom();
  },

  scrollToBottom() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
};

module.exports = rendererChat;
