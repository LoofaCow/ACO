// renderer_settings.js – Aggregates settings modules
const settingsAPI = require('./settings_api');
const settingsLogging = require('./settings_logging');
const settingsFormatting = require('./settings_formatting');

module.exports = {
  loadApiSettings: settingsAPI.loadApiSettings.bind(settingsAPI),
  updateModelDropdown: settingsAPI.updateModelDropdown.bind(settingsAPI),
  populateModelDropdown: settingsAPI.populateModelDropdown.bind(settingsAPI),
  filterModels: settingsAPI.filterModels.bind(settingsAPI),
  allModels: settingsAPI.allModels,
  loadLoggingTab: settingsLogging.loadLoggingTab.bind(settingsLogging),
  loadFormattingTab: settingsFormatting.loadFormattingTab.bind(settingsFormatting),
  loadAdvancedTab: () => {
    document.getElementById("settings-content").innerHTML = `
      <div class="advanced-tab">
        <h2>Advanced Parameters</h2>
        <p>Coming Soon...</p>
      </div>
    `;
  },
  loadExtensionsTab: () => {
    document.getElementById("settings-content").innerHTML = `
      <div class="extensions-tab">
        <h2>Extensions</h2>
        <p>Coming Soon...</p>
      </div>
    `;
  }
};
