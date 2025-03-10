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
    const message = messageInput.value.trim();
    if (!message) return;
    this.appendMessage(message, 'user');
    messageInput.value = '';
    const botResponse = await this.getBotResponse(message);
    this.appendMessage(botResponse, 'bot');
  },

  appendMessage(content, type = 'user') {
    const chatContainer = document.getElementById('chat-container');
    
    // Create a wrapper that will hold both the message and the action buttons
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message-wrapper ${type}`;
    
    // Create the container for action buttons (hidden until hover)
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'message-buttons';
    
    // Edit button (pencil icon)
    const editButton = document.createElement('button');
    editButton.className = 'message-btn edit-btn';
    editButton.title = 'Edit Message';
    editButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="#ff6f61">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.41l-2.34-2.34a1.003 1.003 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>`;
    editButton.addEventListener('click', () => {
      // Implement edit functionality
      console.log('Edit clicked for message:', content);
    });
    buttonContainer.appendChild(editButton);
    
    // Regenerate button (circular refresh icon)
    const regenButton = document.createElement('button');
    regenButton.className = 'message-btn regen-btn';
    regenButton.title = 'Regenerate Response';
    regenButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="#ff6f61">
      <path d="M17.65 6.35a7.95 7.95 0 00-11.3 0L2 10.7l1.41 1.41 3.35-3.35a5.96 5.96 0 018.49 0 5.96 5.96 0 010 8.49 5.96 5.96 0 01-8.49 0L2 13.3l1.41-1.41 3.35 3.35a7.95 7.95 0 0011.3 0 7.95 7.95 0 000-11.3z"/>
    </svg>`;
    regenButton.addEventListener('click', () => {
      // Implement regenerate functionality
      console.log('Regenerate clicked for message:', content);
    });
    buttonContainer.appendChild(regenButton);
    
    // Continue button (larger right-pointing arrow)
    const continueButton = document.createElement('button');
    continueButton.className = 'message-btn continue-btn';
    continueButton.title = 'Continue Message';
    continueButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#ff6f61">
      <path d="M13 7l5 5-5 5V7z"/>
    </svg>`;
    continueButton.addEventListener('click', () => {
      // Implement continue functionality
      console.log('Continue clicked for message:', content);
    });
    buttonContainer.appendChild(continueButton);
    
    // For user messages, insert the buttons to the left of the message bubble;
    // for bot messages, keep the buttons below the bubble.
    if (type === 'user') {
      messageWrapper.appendChild(buttonContainer);
      const messageDiv = document.createElement('div');
      messageDiv.className = `message-bubble ${type}`;
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      messageContent.textContent = content;
      messageDiv.appendChild(messageContent);
      messageWrapper.appendChild(messageDiv);
    } else {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message-bubble ${type}`;
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      messageContent.textContent = content;
      messageDiv.appendChild(messageContent);
      messageWrapper.appendChild(messageDiv);
      messageWrapper.appendChild(buttonContainer);
    }
    
    chatContainer.appendChild(messageWrapper);
    this.scrollToBottom();
  },

  scrollToBottom() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
};

module.exports = rendererChat;
