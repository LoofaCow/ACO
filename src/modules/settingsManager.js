import { apiStorage } from './apiStorage';
import { api } from './api';

export class SettingsManager {
  constructor(uiManager, notificationSystem) {
    this.ui = uiManager;
    this.notifications = notificationSystem;
  }

  async handleApiConnection() {
    const selectedConnection = this.ui.getElement('default-connection').value;
    if (!selectedConnection) {
      this.notifications.show("No connection selected", "error");
      return;
    }

    try {
      apiStorage.saveDefaultConnection(selectedConnection);
      const connections = apiStorage.getConnections();
      const newDefault = connections.find(conn => conn.name === selectedConnection);

      if (newDefault && api.updateAPIConnection(newDefault)) {
        const models = await api.getModels();
        if (models?.length > 0) {
          this.notifications.show("Connected", "success");
          this.updateModelDropdown(models);
        }
      }
    } catch (error) {
      this.notifications.show("Connection failed", "error");
      console.error('API Connection Error:', error);
    }
  }

  updateModelDropdown(models) {
    const modelSelect = this.ui.getElement('default-model');
    modelSelect.innerHTML = models.map(model => 
      `<option value="${model.id}">${model.name}</option>`
    ).join('');
  }
}