const OpenAI = require('openai');
const ApiStorage = require('./apiStorage');

const DEFAULT_CONTEXT_TEMPLATE_PRESET = `{{#if system}}{{system}}
{{/if}}{{#if wiBefore}}{{wiBefore}}
{{/if}}{{#if description}}{{description}}
{{/if}}{{#if personality}}{{personality}}
{{/if}}{{#if scenario}}{{scenario}}
{{/if}}{{#if wiAfter}}{{wiAfter}}
{{/if}}{{#if persona}}{{persona}}
{{/if}}`;

const DEFAULT_SYSTEM_PROMPT_PRESET = `A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human's questions.`;

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
      // Allow usage in a browser-like environment
      this.openai = new OpenAI({
        baseURL: connection.url,
        apiKey: connection.apiKey,
        dangerouslyAllowBrowser: true
      });
      console.log(`API connection updated to: ${connection.name}${connection.defaultModel ? " with model: " + connection.defaultModel : ""}`);
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
      if (models.length > 0 && typeof models[0] === 'string') {
        models = models.map(m => ({ id: m, name: m }));
      }
      return models;
    } catch (error) {
      console.error('Model fetch error:', error.message);
      return [];
    }
  }

  async sendMessage(message, modelId) {
    if (!this.openai) throw new Error('API connection not initialized');
    try {
      // Retrieve formatting settings from localStorage or use defaults
      const contextTemplate = localStorage.getItem('contextTemplate') || DEFAULT_CONTEXT_TEMPLATE_PRESET;
      const systemPrompt = localStorage.getItem('systemPrompt') || DEFAULT_SYSTEM_PROMPT_PRESET;
      
      // Replace the system placeholder with the system prompt
      let processedContextTemplate = contextTemplate.replace('{{system}}', systemPrompt);
      // Remove any leftover handlebars placeholders (lines containing unresolved {{...}})
      processedContextTemplate = processedContextTemplate.split('\n')
          .map(line => line.trim())
          .filter(line => !(/{{.*}}/.test(line)))
          .join('\n');
      
      // Retrieve the last 3 messages from the chat container as conversation history
      let conversationHistory = "";
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) {
        const messages = chatContainer.getElementsByClassName('message-bubble');
        const lastMessages = Array.from(messages).slice(-3);
        lastMessages.forEach(msg => {
          if (msg.classList.contains('user')) {
            conversationHistory += "User: " + msg.textContent + "\n";
          } else {
            conversationHistory += "Assistant: " + msg.textContent + "\n";
          }
        });
      }
      
      // Build the full prompt: processed context template, conversation history, new message, and the assistant indicator
      const fullPrompt = processedContextTemplate + "\n" + conversationHistory + "User: " + message + "\nAssistant:";
      
      // Log the prompt with clear demarcation for easier reading in the logs
      console.log("===== PROMPT SENT =====\n" + fullPrompt + "\n===== END OF PROMPT =====");
      
      const response = await fetch(`${this.openai.baseURL}/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openai.apiKey}`
        },
        body: JSON.stringify({
          model: modelId,
          prompt: fullPrompt,
          max_tokens: 150,
          temperature: 0.7
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      let botResponse = "No response";
      if (data.choices && data.choices.length > 0) {
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
      const connections = await ApiStorage.getConnections();
      const connection = connections.find(c => c.name === defaultConnection);
      if (connection) {
        connection.defaultModel = defaultModel; // attach default model to connection
        const updateSuccess = await this.updateConnection(connection);
        if (updateSuccess) {
          console.log(`API connection updated to: ${connection.name}${defaultModel ? " with model: " + defaultModel : ""}`);
        }
        return updateSuccess;
      }
      return false;
    } catch (error) {
      console.error('Default connection error:', error.message);
      return false;
    }
  }
}

module.exports = new ApiManager();
