// renderer_core.js – Core initialization, event listeners, logger, and window controls
const ApiStorage = require('../modules/apiStorage');
const ApiManager = require('../modules/api');
const rendererChat = require('./renderer_chat');
const rendererSettings = require('./renderer_settings');

const RendererCore = {
  state: {
    activeRightDrawer: null,
    currentSettingsTab: 'api'
  },
  initialize() {
    this.registerEventListeners();
    this.initLogger();
    this.loadInitialContent();
    this.setupWindowControls();
  },
  registerEventListeners() {
    const hamburger = document.getElementById('hamburger');
    const settingsIcon = document.getElementById('icon-settings');
    const personasIcon = document.getElementById('icon-personas');
    const charactersIcon = document.getElementById('icon-characters');
    const closeBtn = document.getElementById('settings-close-btn');
    const sendBtn = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');

    hamburger?.addEventListener('click', () => this.toggleDrawer('left'));
    settingsIcon?.addEventListener('click', () => this.toggleSettingsPanel());
    personasIcon?.addEventListener('click', () => this.toggleRightDrawer('characters'));
    charactersIcon?.addEventListener('click', () => this.toggleRightDrawer('personas'));

    closeBtn?.addEventListener('click', () => {
      document.getElementById('settings-panel').classList.remove('active');
    });

    sendBtn?.addEventListener('click', () => rendererChat.handleSendMessage());
    messageInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') rendererChat.handleSendMessage();
    });

    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleSettingsTabChange(e));
    });
  },
  async loadInitialContent() {
    await rendererSettings.loadApiSettings();
    const success = await ApiManager.setDefaultConnection();
    if (success) {
      if (rendererSettings.allModels && rendererSettings.allModels.length > 0) {
        rendererSettings.populateModelDropdown(rendererSettings.allModels);
      } else {
        await rendererSettings.updateModelDropdown();
      }
    }
  },
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
  },
  appendLog(message) {
    window.globalLogs = window.globalLogs || [];
    window.globalLogs.push(message);
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      logEntry.textContent = message;
      logContainer.appendChild(logEntry);
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  },
  toggleDrawer(type) {
    if (type === 'left') {
      document.getElementById('drawer').classList.toggle('open');
    }
  },
  toggleRightDrawer(contentType) {
    const rightDrawer = document.getElementById('right-drawer');
    if (this.state.activeRightDrawer === contentType) {
      rightDrawer.classList.remove('open');
      this.state.activeRightDrawer = null;
    } else {
      rightDrawer.classList.add('open');
      this.state.activeRightDrawer = contentType;
      // Load additional content if needed
    }
  },
  async toggleSettingsPanel() {
    const settingsPanel = document.getElementById('settings-panel');
    settingsPanel.classList.toggle('active');
    if (settingsPanel.classList.contains('active')) {
      switch (this.state.currentSettingsTab) {
        case 'api':
          await rendererSettings.loadApiSettings();
          if (rendererSettings.allModels && rendererSettings.allModels.length > 0) {
            rendererSettings.populateModelDropdown(rendererSettings.allModels);
          }
          break;
        case 'logging':
          rendererSettings.loadLoggingTab();
          break;
        case 'advanced':
          rendererSettings.loadAdvancedTab();
          break;
        case 'formatting':
          rendererSettings.loadFormattingTab();
          break;
        case 'extensions':
          rendererSettings.loadExtensionsTab();
          break;
        default:
          await rendererSettings.loadApiSettings();
      }
    }
  },
  async handleSettingsTabChange(event) {
    const tab = event.target.closest('button').dataset.tab;
    this.state.currentSettingsTab = tab;
    document.querySelectorAll('.settings-tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    switch (tab) {
      case 'api':
        await rendererSettings.loadApiSettings();
        if (rendererSettings.allModels && rendererSettings.allModels.length > 0) {
          rendererSettings.populateModelDropdown(rendererSettings.allModels);
        }
        break;
      case 'logging':
        rendererSettings.loadLoggingTab();
        break;
      case 'advanced':
        rendererSettings.loadAdvancedTab();
        break;
      case 'formatting':
        rendererSettings.loadFormattingTab();
        break;
      case 'extensions':
        rendererSettings.loadExtensionsTab();
        break;
    }
  },
  setupWindowControls() {
    document.getElementById('minimize-btn')?.addEventListener('click', () =>
      window.electronAPI.windowControl('minimize'));
    document.getElementById('maximize-btn')?.addEventListener('click', () =>
      window.electronAPI.windowControl('maximize'));
    document.getElementById('close-btn')?.addEventListener('click', () =>
      window.electronAPI.windowControl('close'));
  }
};

module.exports = RendererCore;
