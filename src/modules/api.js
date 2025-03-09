// src/modules/api.js
import OpenAI from 'openai';
import ApiStorage from './apiStorage.js';

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
        dangerouslyAllowBrowser: true
      });

      console.log(`API connection updated to: ${connection.name}${connection.defaultModel?" with model: "+connection.defaultModel:""}`);
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
      let models = [];
      if (data.models) {
        models = data.models;
      } else if (data.data) {
        models = data.data;
      }
      if (models.length>0 && typeof models[0]==='string') {
        models = models.map(m=>({id:m,name:m}));
      }
      return models;
    } catch (err) {
      console.error('Model fetch error:', err.message);
      return [];
    }
  }

  async sendMessage(message, modelId) {
    if (!this.openai) throw new Error('API connection not initialized');
    try {
      console.log(`Sending message to model ${modelId}: ${message}`);
      const response = await fetch(`${this.openai.baseURL}/completions`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${this.openai.apiKey}`
        },
        body: JSON.stringify({
          model: modelId,
          prompt: message,
          max_tokens: 150,
          temperature: 0.7
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      let botResponse = "No response";
      if (data.choices && data.choices.length>0) {
        botResponse = data.choices[0].text.trim();
      }
      console.log(`Received response from model ${modelId}: ${botResponse}`);
      return botResponse;
    } catch (error) {
      console.error('Error sending message:', error.message);
      return "Failed to get response";
    }
  }

  async setDefaultConnection() {
    try {
      const { defaultConnection, defaultModel } = await ApiStorage.getDefaultConnection();
      const conns = await ApiStorage.getConnections();
      const conn = conns.find(c=>c.name===defaultConnection);
      if (!conn) return false;

      conn.defaultModel = defaultModel;
      const updateSuccess = await this.updateConnection(conn);
      if (updateSuccess) {
        console.log(`API connection updated to: ${conn.name}${defaultModel?" with model: "+defaultModel:""}`);
      }
      return updateSuccess;
    } catch (err) {
      console.error('Default connection error:', err.message);
      return false;
    }
  }
}

const manager = new ApiManager();
export default manager;
