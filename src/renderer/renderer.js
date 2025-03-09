// Note: With nodeIntegration enabled, you can use require() in the renderer.
const ApiStorage = require('../modules/apiStorage');
const ApiManager = require('../modules/api');

class RendererApp {
  constructor() {
    this.domElements = {
      notificationContainer: document.getElementById('notification-container'),
      hamburger: document.getElementById('hamburger'),
      drawer: document.getElementById('drawer'),
      rightDrawer: document.getElementById('right-drawer'),
      settingsPanel: document.getElementById('settings-panel'),
      chatInterface: document.getElementById('chat-interface'),
      messageInput: document.getElementById('message-input'),
      sendButton: document.getElementById('send-button')
    };

    this.state = {
      activeRightDrawer: null,
      currentSettingsTab: 'api'
    };
  }

  initialize() {
    this.registerEventListeners();
    this.loadInitialContent();
    this.setupWindowControls();
  }

  registerEventListeners() {
    // Navigation controls
    this.domElements.hamburger?.addEventListener('click', () => this.toggleDrawer('left'));
    document.getElementById('icon-settings')?.addEventListener('click', () => this.toggleSettingsPanel());
    document.getElementById('icon-personas')?.addEventListener('click', () => this.toggleRightDrawer('characters'));
    document.getElementById('icon-characters')?.addEventListener('click', () => this.toggleRightDrawer('personas'));

    // Settings panel close button
    document.getElementById('settings-close-btn')?.addEventListener('click', () => {
      this.domElements.settingsPanel.classList.remove('active');
    });

    // Chat functionality
    this.domElements.sendButton?.addEventListener('click', () => this.handleSendMessage());
    this.domElements.messageInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSendMessage();
    });

    // Settings panel tabs
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleSettingsTabChange(e));
    });
  }

  async loadInitialContent() {
    await this.loadApiSettings();
    await ApiManager.setDefaultConnection();
  }

  // DOM Utilities
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    this.domElements.notificationContainer.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }

  toggleElement(element, className = 'active') {
    element.classList.toggle(className);
  }

  // Drawer Management
  toggleDrawer(type) {
    if (type === 'left') {
      this.toggleElement(this.domElements.drawer, 'open');
    }
  }

  toggleRightDrawer(contentType) {
    if (this.state.activeRightDrawer === contentType) {
      this.domElements.rightDrawer.classList.remove('open');
      this.state.activeRightDrawer = null;
    } else {
      this.domElements.rightDrawer.classList.add('open');
      this.state.activeRightDrawer = contentType;
      this.loadRightDrawerContent(contentType);
    }
  }

  // Settings Panel
  // Updated to only toggle the settings panel so it can overlay on top of the chat interface
  toggleSettingsPanel() {
    this.domElements.settingsPanel.classList.toggle('active');
    if (this.domElements.settingsPanel.classList.contains('active')) {
      this.loadApiSettings();
    }
  }

  async handleSettingsTabChange(event) {
    const tab = event.target.closest('button').dataset.tab;
    this.state.currentSettingsTab = tab;
    
    document.querySelectorAll('.settings-tab-btn').forEach(btn => 
      btn.classList.remove('active'));
    event.target.classList.add('active');

    switch(tab) {
      case 'api':
        await this.loadApiSettings();
        break;
      // Add other tab cases here
    }
  }

  // API Settings Management
  async loadApiSettings() {
    const connections = await ApiStorage.getConnections();
    const defaultConnection = await ApiStorage.getDefaultConnection();
    
    document.getElementById('settings-content').innerHTML = 
      this.generateApiFormHtml(connections, defaultConnection);
    
    this.attachApiFormEvents();
  }

  generateApiFormHtml(connections, defaultConnection) {
    const connectionOptions = connections.length 
      ? connections.map(conn => `
        <option value="${conn.name}" ${defaultConnection === conn.name ? 'selected' : ''}>
          ${conn.name}
        </option>
      `).join('')
      : '<option value="">No saved connections</option>';

    return `
      <div class="api-settings">
        <div class="form-section">
          <label>New Connection</label>
          <input type="text" id="api-name" placeholder="Connection Name">
          <input type="url" id="api-url" placeholder="API Endpoint">
          <input type="password" id="api-key" placeholder="API Key">
          <button id="api-save-btn" class="primary-btn">Save Connection</button>
        </div>

        <div class="form-section">
          <label>Default Settings</label>
          <select id="default-connection">${connectionOptions}</select>
          <select id="default-model"></select>
          <button id="api-connect-btn" class="primary-btn">Connect</button>
        </div>
      </div>
    `;
  }

  attachApiFormEvents() {
    document.getElementById('api-save-btn')?.addEventListener('click', async () => {
      const [name, url, key] = ['api-name', 'api-url', 'api-key']
        .map(id => document.getElementById(id)?.value.trim());

      if (!name || !url || !key) {
        this.showNotification('Please fill all connection fields', 'error');
        return;
      }

      try {
        await ApiStorage.saveConnection(name, url, key);
        this.showNotification('Connection saved successfully', 'success');
        await this.loadApiSettings();
      } catch (error) {
        this.showNotification('Failed to save connection', 'error');
      }
    });

    document.getElementById('api-connect-btn')?.addEventListener('click', async () => {
      const selected = document.getElementById('default-connection')?.value;
      if (!selected) return;

      try {
        await ApiStorage.saveDefaultConnection(selected);
        const success = await ApiManager.setDefaultConnection();
        
        if (success) {
          this.showNotification('Connected successfully', 'success');
          await this.updateModelDropdown();
        }
      } catch (error) {
        this.showNotification('Connection failed', 'error');
      }
    });
  }

  // Chat Functionality
  async handleSendMessage() {
    const message = this.domElements.messageInput.value.trim();
    if (!message) return;

    this.appendMessage(message, 'user');
    this.domElements.messageInput.value = '';

    try {
      const response = await this.getBotResponse(message);
      this.appendMessage(response, 'bot');
    } catch (error) {
      this.appendMessage('Failed to get response', 'error');
    }
  }

  appendMessage(content, type = 'user') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-bubble ${type}`;
    messageDiv.textContent = content;
    this.domElements.chatInterface.appendChild(messageDiv);
    this.scrollToBottom();
  }

  scrollToBottom() {
    const container = this.domElements.chatInterface;
    container.scrollTop = container.scrollHeight;
  }

  // Window Controls (Updated to use electronAPI.windowControl)
  setupWindowControls() {
    document.getElementById('minimize-btn')?.addEventListener('click', () =>
      window.electronAPI.windowControl('minimize'));
    document.getElementById('maximize-btn')?.addEventListener('click', () =>
      window.electronAPI.windowControl('maximize'));
    document.getElementById('close-btn')?.addEventListener('click', () =>
      window.electronAPI.windowControl('close'));
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  const app = new RendererApp();
  app.initialize();
});
