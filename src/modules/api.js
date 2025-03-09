const OpenAI = require('openai');
const apiStorage = require('./apiStorage');
const fetch = require('node-fetch');


// Create an OpenAI instance with default values initially
let openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.featherless.ai/v1',
  apiKey: process.env.OPENAI_API_KEY || 'api_key',
});

/**
 * Create a chat completion using the LLM.
 * @param {Array} messages - Array of message objects.
 * @param {string} model - The model to use.
 * @param {number} maxTokens - Maximum tokens for the response.
 * @returns {Promise<string>} - The response message content.
 */
async function createChatCompletion(messages, model = 'mistralai/Mistral-Nemo-Instruct-2407', maxTokens = 4096) {
  try {
    const chatCompletions = await openai.chat.completions.create({
      model: model,
      max_tokens: maxTokens,
      messages: messages,
    });
    if (chatCompletions.choices && chatCompletions.choices.length > 0) {
      return chatCompletions.choices[0].message.content;
    } else {
      throw new Error('No completion choices returned.');
    }
  } catch (error) {
    console.error('Error during chat completion:', error);
    throw error;
  }
}

/**
 * Update the OpenAI instance with new connection settings.
 * @param {Object} connection - The connection object with keys: name, url, apiKey.
 */
function updateAPIConnection(connection) {
  openai = new OpenAI({
    baseURL: connection.url,
    apiKey: connection.apiKey,
  });
  console.log(`API connection updated to: ${connection.name}`);
}

/**
 * Set the default API connection using the saved default.
 */
function setDefaultAPIConnection() {
  const connections = apiStorage.getConnections();
  const defaultName = apiStorage.getDefaultConnection();
  const connection = connections.find(conn => conn.name === defaultName);
  if (connection) {
    updateAPIConnection(connection);
  } else {
    console.warn('No default connection found.');
  }
}

module.exports = {
  createChatCompletion,
  updateAPIConnection,
  setDefaultAPIConnection,
};
