const settingsAPI = require('./settings_api');
const settingsLogging = require('./settings_logging');
const settingsFormatting = require('./settings_formatting');
const settingsAdvanced = require('./settings_advanced');

module.exports = {
  loadApiSettings: settingsAPI.loadApiSettings.bind(settingsAPI),
  updateModelDropdown: settingsAPI.updateModelDropdown.bind(settingsAPI),
  populateModelDropdown: settingsAPI.populateModelDropdown.bind(settingsAPI),
  filterModels: settingsAPI.filterModels.bind(settingsAPI),
  allModels: settingsAPI.allModels,
  loadLoggingTab: settingsLogging.loadLoggingTab.bind(settingsLogging),
  loadFormattingTab: settingsFormatting.loadFormattingTab.bind(settingsFormatting),
  loadAdvancedTab: settingsAdvanced.loadAdvancedTab,  // Use the advanced parameters module
  loadExtensionsTab: () => {
    document.getElementById("settings-content").innerHTML = `
      <div class="extensions-tab">
        <h2>Extensions</h2>
        <p>Coming Soon...</p>
      </div>
    `;
  }
};
