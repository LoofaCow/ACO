const OpenAI = require('openai');
const ApiStorage = require('./apiStorage');

class ApiManager {
  constructor() {
    this.openai = null;
  }

  async initialize() {
    return this.setDefaultConnection();
  }

  async updateConnection(connection) {
    try {
      if (!connection?.url || !connection?.apiKey) {
        throw new Error('Invalid connection parameters');
      }

      this.openai = new OpenAI({
        baseURL: connection.url,
        apiKey: connection.apiKey,
      });

      console.log(`API connection updated to: ${connection.name}`);
      return true;
    } catch (error) {
      console.error('Connection error:', error.message);
      return false;
    }
  }

  async getModels() {
    if (!this.openai) throw new Error('API connection not initialized');
    
    try {
      const response = await fetch(`${this.openai.baseURL}/models`, {
        headers: { 'Authorization': `Bearer ${this.openai.apiKey}` }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Model fetch error:', error.message);
      return [];
    }
  }

  async setDefaultConnection() {
    try {
      const connections = await ApiStorage.getConnections();
      const defaultName = await ApiStorage.getDefaultConnection();
      const connection = connections.find(c => c.name === defaultName);
      
      return connection ? this.updateConnection(connection) : false;
    } catch (error) {
      console.error('Default connection error:', error.message);
      return false;
    }
  }
}

module.exports = new ApiManager();