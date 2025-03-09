// src/modules/settingsManager.js

import ApiStorage from './apiStorage.js';
import ApiManager from './api.js';

export class SettingsManager {
  constructor(uiManager, notifications) {
    this.ui = uiManager;
    this.notifications = notifications;
    this.allModels = [];
    this.currentTab = 'api'; // default tab
  }

  async openTab(tabName) {
    this.currentTab = tabName;
    const settingsContent = document.getElementById('settings-content');
    if (!settingsContent) return;

    switch (tabName) {
      case 'api':
        await this.loadApiSettings(settingsContent);
        break;
      case 'logging':
        this.loadLoggingTab(settingsContent);
        break;
      case 'advanced':
        this.loadAdvancedTab(settingsContent);
        break;
      case 'formatting':
        this.loadFormattingTab(settingsContent);
        break;
      case 'extensions':
        this.loadExtensionsTab(settingsContent);
        break;
      default:
        await this.loadApiSettings(settingsContent);
    }
  }

  /* ======================
   * API SETTINGS TAB
   * ====================*/
  async loadApiSettings(containerEl) {
    const connections = await ApiStorage.getConnections();
    const defData = await ApiStorage.getDefaultConnection();
    const defConn = defData.defaultConnection;

    containerEl.innerHTML = this.generateApiFormHtml(connections, defConn);
    this.attachApiFormEvents();

    // if we've already fetched models, repopulate
    if (this.allModels.length > 0) {
      this.populateModelDropdown(this.allModels);
    }
  }

  generateApiFormHtml(connections, defaultConnection) {
    const connOptions = connections.length
      ? connections.map(c => `
          <option value="${c.name}" ${c.name===defaultConnection?'selected':''}>${c.name}</option>
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
            <select id="default-connection">${connOptions}</select>
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
    const saveBtn = document.getElementById('api-save-btn');
    const connectBtn = document.getElementById('api-connect-btn');

    // Save new connection
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const name = (document.getElementById('api-name')?.value || '').trim();
        const url = (document.getElementById('api-url')?.value || '').trim();
        const key = (document.getElementById('api-key')?.value || '').trim();

        if (!name || !url || !key) {
          this.notifications.show('Please fill all connection fields', 'error');
          return;
        }

        try {
          await ApiStorage.saveConnection(name, url, key);
          this.notifications.show('Connection saved successfully', 'success');
          // Reload the list
          await this.loadApiSettings(document.getElementById('settings-content'));
        } catch (err) {
          this.notifications.show('Failed to save connection', 'error');
        }
      });
    }

    // Connect
    if (connectBtn) {
      connectBtn.addEventListener('click', async () => {
        const defConn = document.getElementById('default-connection')?.value;
        const defModel = document.getElementById('default-model')?.value;
        if (!defConn) return;

        try {
          await ApiStorage.saveDefaultConnection(defConn, defModel);
          const success = await ApiManager.setDefaultConnection();
          if (success) {
            this.notifications.show('Connected successfully', 'success');
            await this.updateModelDropdown();
          }
        } catch (error) {
          this.notifications.show('Connection failed', 'error');
        }
      });
    }

    // Model search
    const modelSearch = document.getElementById('model-search');
    if (modelSearch) {
      modelSearch.addEventListener('input', e => {
        const query = e.target.value.toLowerCase();
        this.filterModels(query);
      });
    }
  }

  async updateModelDropdown() {
    try {
      const models = await ApiManager.getModels();
      this.allModels = models;
      this.populateModelDropdown(models);
    } catch (err) {
      console.error('Error updating model dropdown:', err);
      const modelSelect = document.getElementById('default-model');
      if (modelSelect) {
        modelSelect.innerHTML = '<option value="">Error fetching models</option>';
      }
    }
  }

  populateModelDropdown(models) {
    ApiStorage.getDefaultConnection().then(defData => {
      const defModel = defData.defaultModel;
      const modelSelect = document.getElementById('default-model');
      if (!modelSelect) return;

      if (models.length > 0) {
        modelSelect.innerHTML = models.map(m => `
          <option value="${m.id}" ${m.id===defModel?'selected':''}>
            ${m.name || m.id}
          </option>
        `).join('');
      } else {
        modelSelect.innerHTML = '<option value="">No models available</option>';
      }
    });
  }

  filterModels(query) {
    const modelSelect = document.getElementById('default-model');
    if (!modelSelect) return;

    const filtered = this.allModels.filter(m => {
      const name = m.name || m.id;
      return name.toLowerCase().includes(query);
    });

    if (filtered.length > 0) {
      modelSelect.innerHTML = filtered.map(m => `
        <option value="${m.id}">${m.name || m.id}</option>
      `).join('');
    } else {
      modelSelect.innerHTML = '<option value="">No models match your search</option>';
    }
  }

  /* ======================
   * LOGGING TAB
  ====================== */
  loadLoggingTab(containerEl) {
    containerEl.innerHTML = `
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
        <div id="log-container" class="log-container"></div>
        <button id="clear-logs" class="primary-btn clear-btn">Clear Logs</button>
      </div>
    `;
    // If needed, attach events for #popout-logs or #clear-logs
  }

  /* ======================
   * ADVANCED TAB
  ====================== */
  loadAdvancedTab(containerEl) {
    containerEl.innerHTML = `
      <div class="advanced-tab">
        <h2>Advanced Parameters</h2>
        <p>Coming Soon...</p>
      </div>
    `;
  }

  /* ======================
   * FORMATTING TAB
  ====================== */
  loadFormattingTab(containerEl) {
    const defaultCT = `{{#if system}}{{system}}
{{/if}}{{#if wiBefore}}{{wiBefore}}
{{/if}}{{#if description}}{{description}}
{{/if}}{{#if personality}}{{personality}}
{{/if}}{{#if scenario}}{{scenario}}
{{/if}}{{#if wiAfter}}{{wiAfter}}
{{/if}}{{#if persona}}{{persona}}
{{/if}}`;
    const defaultSP = `A chat between a curious human and an artificial intelligence assistant.
The assistant gives helpful, detailed, and polite answers to the human's questions.`;

    containerEl.innerHTML = `
      <div class="formatting-tab">
        <h2>Advanced Formatting</h2>
        <div class="form-group">
          <label for="context-template-preset">Context Template Preset</label>
          <select id="context-template-preset">
            <option value="${encodeURIComponent(defaultCT)}">Default</option>
          </select>
        </div>
        <div class="form-group">
          <label for="context-template">Context Template</label>
          <textarea id="context-template" placeholder="Enter your context template..."></textarea>
        </div>
        <div class="form-group">
          <label for="system-prompt-preset">System Prompt Preset</label>
          <select id="system-prompt-preset">
            <option value="${encodeURIComponent(defaultSP)}">Default</option>
          </select>
        </div>
        <div class="form-group">
          <label for="system-prompt">System Prompt</label>
          <textarea id="system-prompt" placeholder="Enter your system prompt..."></textarea>
        </div>
        <button id="save-formatting-btn" class="primary-btn">Save Formatting</button>
      </div>
    `;
    this.attachFormattingEvents();

    // load previously saved from localStorage
    const { contextTemplate, systemPrompt } = this.loadFormattingSettings();
    document.getElementById('context-template').value = contextTemplate || defaultCT;
    document.getElementById('system-prompt').value = systemPrompt || defaultSP;
  }

  attachFormattingEvents() {
    const saveBtn = document.getElementById('save-formatting-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveFormattingSettings();
      });
    }

    const ctPreset = document.getElementById('context-template-preset');
    if (ctPreset) {
      ctPreset.addEventListener('change', (e) => {
        const val = decodeURIComponent(e.target.value);
        document.getElementById('context-template').value = val;
      });
    }

    const spPreset = document.getElementById('system-prompt-preset');
    if (spPreset) {
      spPreset.addEventListener('change', (e) => {
        const val = decodeURIComponent(e.target.value);
        document.getElementById('system-prompt').value = val;
      });
    }
  }

  saveFormattingSettings() {
    const cTemplate = document.getElementById('context-template')?.value || "";
    const sPrompt = document.getElementById('system-prompt')?.value || "";
    localStorage.setItem('contextTemplate', cTemplate);
    localStorage.setItem('systemPrompt', sPrompt);
    console.log("Formatting settings saved:", cTemplate, sPrompt);
    this.notifications.show("Formatting settings saved", "success");
  }

  loadFormattingSettings() {
    return {
      contextTemplate: localStorage.getItem('contextTemplate') || "",
      systemPrompt: localStorage.getItem('systemPrompt') || ""
    };
  }

  /* ======================
   * EXTENSIONS TAB
  ====================== */
  loadExtensionsTab(containerEl) {
    containerEl.innerHTML = `
      <div class="extensions-tab">
        <h2>Extensions</h2>
        <p>Coming Soon...</p>
      </div>
    `;
  }
}
