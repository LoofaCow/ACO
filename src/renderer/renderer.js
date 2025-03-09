const ApiStorage = require('../modules/apiStorage');
const ApiManager = require('../modules/api');

// Define default presets for formatting
const DEFAULT_CONTEXT_TEMPLATE_PRESET = `{{#if system}}{{system}}
{{/if}}{{#if wiBefore}}{{wiBefore}}
{{/if}}{{#if description}}{{description}}
{{/if}}{{#if personality}}{{personality}}
{{/if}}{{#if scenario}}{{scenario}}
{{/if}}{{#if wiAfter}}{{wiAfter}}
{{/if}}{{#if persona}}{{persona}}
{{/if}}`;

const DEFAULT_SYSTEM_PROMPT_PRESET = `A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human's questions.`;

let globalLogs = [];

class RendererApp {
  constructor() {
    this.domElements = {
      notificationContainer: document.getElementById('notification-container'),
      hamburger: document.getElementById('hamburger'),
      drawer: document.getElementById('drawer'),
      rightDrawer: document.getElementById('right-drawer'),
      settingsPanel: document.getElementById('settings-panel'),
      chatContainer: document.getElementById('chat-container'),
      messageInput: document.getElementById('message-input'),
      sendButton: document.getElementById('send-button')
    };

    this.state = {
      activeRightDrawer: null,
      currentSettingsTab: 'api'
    };

    // Store all fetched models so they persist while connected.
    this.allModels = [];
  }

  initialize() {
    this.registerEventListeners();
    this.initLogger();
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
    const success = await ApiManager.setDefaultConnection();
    if (success) {
      // If we already fetched models before, reuse them; otherwise fetch.
      if (this.allModels.length === 0) {
        await this.updateModelDropdown();
      } else {
        this.populateModelDropdown(this.allModels);
      }
    }
  }

  // Logger Methods: Capture logs globally and forward them.
  initLogger() {
    const originalLog = console.log;
    const originalError = console.error;
    console.log = (...args) => {
      originalLog.apply(console, args);
      const msg = args.join(" ");
      this.appendLog("LOG: " + msg);
      if (window.secureAPI && typeof window.secureAPI.send === "function") {
        window.secureAPI.send('new-log', "LOG: " + msg);
      }
    };
    console.error = (...args) => {
      originalError.apply(console, args);
      const msg = args.join(" ");
      this.appendLog("ERROR: " + msg);
      if (window.secureAPI && typeof window.secureAPI.send === "function") {
        window.secureAPI.send('new-log', "ERROR: " + msg);
      }
    };
    window.onerror = (message, source, lineno, colno, error) => {
      const msg = `ONERROR: ${message} at ${source}:${lineno}:${colno}`;
      this.appendLog(msg);
      if (window.secureAPI && typeof window.secureAPI.send === "function") {
        window.secureAPI.send('new-log', msg);
      }
      return false;
    };
  }

  appendLog(message) {
    globalLogs.push(message);
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      logEntry.textContent = message;
      logContainer.appendChild(logEntry);
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }

  clearLogs() {
    globalLogs = [];
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
      logContainer.innerHTML = '';
    }
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

  // Settings Panel: overlays chat area (leaving space for message bar)
  async toggleSettingsPanel() {
    this.domElements.settingsPanel.classList.toggle('active');
    if (this.domElements.settingsPanel.classList.contains('active')) {
      switch (this.state.currentSettingsTab) {
        case 'api':
          await this.loadApiSettings();
          // If models were previously fetched, repopulate the dropdown.
          if (this.allModels.length > 0) {
            this.populateModelDropdown(this.allModels);
          }
          break;
        case 'logging':
          this.loadLoggingTab();
          break;
        case 'advanced':
          this.loadAdvancedTab();
          break;
        case 'formatting':
          this.loadFormattingTab();
          break;
        case 'extensions':
          this.loadExtensionsTab();
          break;
        default:
          await this.loadApiSettings();
      }
    }
  }

  async handleSettingsTabChange(event) {
    const tab = event.target.closest('button').dataset.tab;
    this.state.currentSettingsTab = tab;
    document.querySelectorAll('.settings-tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    switch (tab) {
      case 'api':
        await this.loadApiSettings();
        if (this.allModels.length > 0) {
          this.populateModelDropdown(this.allModels);
        }
        break;
      case 'logging':
        this.loadLoggingTab();
        break;
      case 'advanced':
        this.loadAdvancedTab();
        break;
      case 'formatting':
        this.loadFormattingTab();
        break;
      case 'extensions':
        this.loadExtensionsTab();
        break;
    }
  }

  // API Settings Management
  async loadApiSettings() {
    const connections = await ApiStorage.getConnections();
    const defaultData = await ApiStorage.getDefaultConnection();
    const defaultConnection = defaultData.defaultConnection;
    document.getElementById('settings-content').innerHTML = this.generateApiFormHtml(connections, defaultConnection);
    this.attachApiFormEvents();
  }

  // Updated API Connections form with a model search input.
  generateApiFormHtml(connections, defaultConnection) {
    const connectionOptions = connections.length
      ? connections.map(conn => `
        <option value="${conn.name}" ${defaultConnection === conn.name ? 'selected' : ''}>
          ${conn.name}
        </option>
      `).join('')
      : '<option value="">No saved connections</option>';
    return `
      <div class="api-settings modern-form">
        <h2>API Connections</h2>
        <div class="form-section new-connection">
          <h3>Add New Connection</h3>
          <div class="form-group">
            <input type="text" id="api-name" placeholder="Connection Name">
          </div>
          <div class="form-group">
            <input type="url" id="api-url" placeholder="API Endpoint">
          </div>
          <div class="form-group">
            <input type="password" id="api-key" placeholder="API Key">
          </div>
          <button id="api-save-btn" class="primary-btn">Save Connection</button>
        </div>
        <div class="form-section default-connection">
          <h3>Default Settings</h3>
          <div class="form-group">
            <select id="default-connection">${connectionOptions}</select>
          </div>
          <div class="form-group">
            <input type="text" id="model-search" placeholder="Search models...">
          </div>
          <div class="form-group">
            <select id="default-model"><option value="">Select a model</option></select>
          </div>
          <button id="api-connect-btn" class="primary-btn">Connect</button>
        </div>
      </div>
    `;
  }

  attachApiFormEvents() {
    document.getElementById('api-save-btn')?.addEventListener('click', async () => {
      const [name, url, key] = ['api-name', 'api-url', 'api-key'].map(id => document.getElementById(id)?.value.trim());
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
      const selectedModel = document.getElementById('default-model')?.value;
      if (!selected) return;
      try {
        await ApiStorage.saveDefaultConnection(selected, selectedModel);
        const success = await ApiManager.setDefaultConnection();
        if (success) {
          this.showNotification('Connected successfully', 'success');
          await this.updateModelDropdown();
        }
      } catch (error) {
        this.showNotification('Connection failed', 'error');
      }
    });

    // Model search functionality
    document.getElementById('model-search')?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      this.filterModels(query);
    });
  }

  // Populate the model dropdown using stored model list.
  populateModelDropdown(models) {
    const defaultData = ApiStorage.getDefaultConnection ? {} : {}; // Placeholder
    // We need to re-read the default connection data.
    ApiStorage.getDefaultConnection().then(defaultData => {
      const defaultModel = defaultData.defaultModel;
      const modelSelect = document.getElementById('default-model');
      if (!modelSelect) {
        console.warn("default-model element not found. Skipping populateModelDropdown.");
        return;
      }
      if (models.length > 0) {
        modelSelect.innerHTML = models
          .map(model => `<option value="${model.id}" ${defaultModel === model.id ? 'selected' : ''}>${model.name || model.id}</option>`)
          .join('');
      } else {
        modelSelect.innerHTML = '<option value="">No models available</option>';
      }
    });
  }

  async updateModelDropdown() {
    try {
      const models = await ApiManager.getModels();
      this.allModels = models;
      await this.populateModelDropdown(models);
    } catch (err) {
      console.error('Error updating model dropdown: ', err);
      const modelSelect = document.getElementById('default-model');
      if (modelSelect) {
        modelSelect.innerHTML = '<option value="">Error fetching models</option>';
      }
    }
  }

  filterModels(query) {
    const modelSelect = document.getElementById('default-model');
    if (!modelSelect) return;
    const filtered = this.allModels.filter(model => {
      const name = model.name || model.id;
      return name.toLowerCase().includes(query);
    });
    if (filtered.length > 0) {
      modelSelect.innerHTML = filtered
        .map(model => `<option value="${model.id}">${model.name || model.id}</option>`)
        .join('');
    } else {
      modelSelect.innerHTML = '<option value="">No models match your search</option>';
    }
  }

  // Logging Tab Management
  loadLoggingTab() {
    document.getElementById('settings-content').innerHTML = this.generateLoggingTabHtml();
    this.attachLoggingEvents();
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
      globalLogs.forEach(msg => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = msg;
        logContainer.appendChild(logEntry);
      });
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }

  generateLoggingTabHtml() {
    return `
      <div class="logging-tab">
        <div class="logging-header">
          <h2>Logging</h2>
          <button id="popout-logs" class="icon-btn popout-btn" title="Pop Out Logs">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e0e0e0">
              <path d="M14 3l7 7-1.414 1.414L15 6.828V17h-2V6.828l-4.586 4.586L7 10l7-7z"/>
              <path d="M5 19h14v2H5z"/>
            </svg>
          </button>
        </div>
        <div id="log-container" class="log-container">
          <!-- Log entries will appear here -->
        </div>
        <button id="clear-logs" class="primary-btn clear-btn">Clear Logs</button>
      </div>
    `;
  }

  attachLoggingEvents() {
    document.getElementById('clear-logs')?.addEventListener('click', () => {
      this.clearLogs();
    });
    document.getElementById('popout-logs')?.addEventListener('click', async () => {
      const poppedOut = await window.electronAPI.toggleLoggingPopout();
      console.log("Popout toggled:", poppedOut);
    });
  }

  // Advanced Formatting Tab: Context Template & System Prompt Presets and Inputs
  loadFormattingTab() {
    document.getElementById('settings-content').innerHTML = this.generateFormattingTabHtml();
    this.attachFormattingEvents();
    const settings = this.loadFormattingSettings();
    document.getElementById('context-template').value = settings.contextTemplate || DEFAULT_CONTEXT_TEMPLATE_PRESET;
    document.getElementById('system-prompt').value = settings.systemPrompt || DEFAULT_SYSTEM_PROMPT_PRESET;
  }

  generateFormattingTabHtml() {
    return `
      <div class="formatting-tab">
        <h2>Advanced Formatting</h2>
        <div class="form-group">
          <label for="context-template-preset">Context Template Preset</label>
          <select id="context-template-preset">
            <option value="${encodeURIComponent(DEFAULT_CONTEXT_TEMPLATE_PRESET)}">Default</option>
          </select>
        </div>
        <div class="form-group">
          <label for="context-template">Context Template</label>
          <textarea id="context-template" placeholder="Enter your context template..."></textarea>
        </div>
        <div class="form-group">
          <label for="system-prompt-preset">System Prompt Preset</label>
          <select id="system-prompt-preset">
            <option value="${encodeURIComponent(DEFAULT_SYSTEM_PROMPT_PRESET)}">Default</option>
          </select>
        </div>
        <div class="form-group">
          <label for="system-prompt">System Prompt</label>
          <textarea id="system-prompt" placeholder="Enter your system prompt..."></textarea>
        </div>
        <button id="save-formatting-btn" class="primary-btn">Save Formatting</button>
      </div>
    `;
  }

  attachFormattingEvents() {
    document.getElementById('save-formatting-btn')?.addEventListener('click', () => {
      this.saveFormattingSettings();
    });
    document.getElementById('context-template-preset')?.addEventListener('change', (e) => {
      const presetValue = decodeURIComponent(e.target.value);
      document.getElementById('context-template').value = presetValue;
    });
    document.getElementById('system-prompt-preset')?.addEventListener('change', (e) => {
      const presetValue = decodeURIComponent(e.target.value);
      document.getElementById('system-prompt').value = presetValue;
    });
  }

  saveFormattingSettings() {
    const contextTemplate = document.getElementById('context-template')?.value || "";
    const systemPrompt = document.getElementById('system-prompt')?.value || "";
    localStorage.setItem('contextTemplate', contextTemplate);
    localStorage.setItem('systemPrompt', systemPrompt);
    console.log(`Formatting settings saved. Context Template: ${contextTemplate} | System Prompt: ${systemPrompt}`);
    this.showNotification("Formatting settings saved", "success");
  }

  loadFormattingSettings() {
    return {
      contextTemplate: localStorage.getItem('contextTemplate') || "",
      systemPrompt: localStorage.getItem('systemPrompt') || ""
    };
  }

  // Advanced, Extensions Tabs (placeholders)
  loadAdvancedTab() {
    document.getElementById('settings-content').innerHTML = `
      <div class="advanced-tab">
        <h2>Advanced Parameters</h2>
        <p>Coming Soon...</p>
      </div>
    `;
  }

  loadExtensionsTab() {
    document.getElementById('settings-content').innerHTML = `
      <div class="extensions-tab">
        <h2>Extensions</h2>
        <p>Coming Soon...</p>
      </div>
    `;
  }

  // Chat Functionality
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
  }

  async handleSendMessage() {
    const message = this.domElements.messageInput.value.trim();
    if (!message) return;
    this.appendMessage(message, 'user');
    this.domElements.messageInput.value = '';
    const botResponse = await this.getBotResponse(message);
    this.appendMessage(botResponse, 'bot');
  }

  appendMessage(content, type = 'user') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-bubble ${type}`;
    messageDiv.textContent = content;
    this.domElements.chatContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  scrollToBottom() {
    const container = this.domElements.chatContainer;
    container.scrollTop = container.scrollHeight;
  }

  // Window Controls
  setupWindowControls() {
    document.getElementById('minimize-btn')?.addEventListener('click', () =>
      window.electronAPI.windowControl('minimize'));
    document.getElementById('maximize-btn')?.addEventListener('click', () =>
      window.electronAPI.windowControl('maximize'));
    document.getElementById('close-btn')?.addEventListener('click', () =>
      window.electronAPI.windowControl('close'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new RendererApp();
  app.initialize();
});