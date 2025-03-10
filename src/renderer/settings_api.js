// settings_api.js – API Settings functions
const ApiStorage = require('../modules/apiStorage');
const ApiManager = require('../modules/api');

const settingsAPI = {
  allModels: [],
  async loadApiSettings() {
    const connections = await ApiStorage.getConnections();
    const defaultData = await ApiStorage.getDefaultConnection();
    const defaultConnection = defaultData.defaultConnection;
    const html = this.generateApiFormHtml(connections, defaultConnection);
    document.getElementById('settings-content').innerHTML = html;
    this.attachApiFormEvents();
    // Update the model dropdown: first with cached models then with fresh data
    await this.updateModelDropdown();
  },
  generateApiFormHtml(connections, defaultConnection) {
    const connectionOptions = connections.length
      ? connections
          .map(
            (conn) =>
              `<option value="${conn.name}" ${
                defaultConnection === conn.name ? "selected" : ""
              }>${conn.name}</option>`
          )
          .join("")
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
  },
  attachApiFormEvents() {
    document.getElementById("api-save-btn")?.addEventListener("click", async () => {
      const [name, url, key] = ["api-name", "api-url", "api-key"].map(
        (id) => document.getElementById(id)?.value.trim()
      );
      if (!name || !url || !key) {
        this.showNotification("Please fill all connection fields", "error");
        return;
      }
      try {
        await ApiStorage.saveConnection(name, url, key);
        this.showNotification("Connection saved successfully", "success");
        await this.loadApiSettings();
      } catch (error) {
        this.showNotification("Failed to save connection", "error");
      }
    });
    document.getElementById("api-connect-btn")?.addEventListener("click", async () => {
      const selected = document.getElementById("default-connection")?.value;
      const selectedModel = document.getElementById("default-model")?.value;
      if (!selected) return;
      try {
        await ApiStorage.saveDefaultConnection(selected, selectedModel);
        const success = await ApiManager.setDefaultConnection();
        if (success) {
          this.showNotification("Connected successfully", "success");
          await this.updateModelDropdown();
        }
      } catch (error) {
        this.showNotification("Connection failed", "error");
      }
    });
    document.getElementById("model-search")?.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      this.filterModels(query);
    });
  },
  async updateModelDropdown() {
    const modelSelect = document.getElementById("default-model");
    // Immediately populate dropdown with cached models if available for snappiness
    if (this.allModels && this.allModels.length > 0) {
      this.populateModelDropdown(this.allModels);
    }
    try {
      const models = await ApiManager.getModels();
      this.allModels = models;
      this.populateModelDropdown(models);
    } catch (err) {
      console.error("Error updating model dropdown: ", err);
      if (modelSelect) {
        modelSelect.innerHTML = '<option value="">Error fetching models</option>';
      }
    }
  },
  populateModelDropdown(models) {
    ApiStorage.getDefaultConnection().then((defaultData) => {
      const defaultModel = defaultData.defaultModel;
      const modelSelect = document.getElementById("default-model");
      if (!modelSelect) {
        console.warn(
          "default-model element not found. Skipping populateModelDropdown."
        );
        return;
      }
      if (models.length > 0) {
        modelSelect.innerHTML = models
          .map(
            (model) =>
              `<option value="${model.id}" ${
                defaultModel === model.id ? "selected" : ""
              }>${model.name || model.id}</option>`
          )
          .join("");
      } else {
        modelSelect.innerHTML = '<option value="">No models available</option>';
      }
    });
  },
  filterModels(query) {
    const modelSelect = document.getElementById("default-model");
    if (!modelSelect) return;
    const filtered = this.allModels.filter((model) => {
      const name = model.name || model.id;
      return name.toLowerCase().includes(query);
    });
    if (filtered.length > 0) {
      modelSelect.innerHTML = filtered
        .map(
          (model) =>
            `<option value="${model.id}">${model.name || model.id}</option>`
        )
        .join("");
    } else {
      modelSelect.innerHTML =
        '<option value="">No models match your search</option>';
    }
  },
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.getElementById("notification-container").appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
};

module.exports = settingsAPI;
