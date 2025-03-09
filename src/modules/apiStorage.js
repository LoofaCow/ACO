const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Ensure axios is installed (npm install axios)

const apiDir = path.join(__dirname, '../data/api/');
const defaultFilePath = path.join(apiDir, 'default.json');

// Ensure the API data directory exists
if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
}

// Save API connection as a separate JSON file
function saveConnection(name, url, apiKey) {
    const filePath = path.join(apiDir, `${name}.json`);
    const connectionData = { name, url, apiKey };

    fs.writeFileSync(filePath, JSON.stringify(connectionData, null, 2), 'utf8');
    return true;
}

// Load all saved API connections (ignores default.json)
function getConnections() {
    if (!fs.existsSync(apiDir)) return [];

    const files = fs.readdirSync(apiDir).filter(file => file.endsWith('.json') && file !== 'default.json');
    return files.map(file => {
        const filePath = path.join(apiDir, file);
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    });
}

// Save the default selected connection
function saveDefaultConnection(name) {
    fs.writeFileSync(defaultFilePath, JSON.stringify({ defaultConnection: name }, null, 2), 'utf8');
}

// Load the default selected connection
function getDefaultConnection() {
    if (!fs.existsSync(defaultFilePath)) return null;
    const data = JSON.parse(fs.readFileSync(defaultFilePath, 'utf8'));
    return data.defaultConnection || null;
}

module.exports = {
    saveConnection,
    getConnections,
    saveDefaultConnection,
    getDefaultConnection };

    // Function to fetch available models from Featherless AI
async function fetchFeatherlessModels(apiUrl, apiKey) {
    try {
        const response = await axios.get(`${apiUrl}/v1/models`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (response.data && response.data.models) {
            return response.data.models; // Return list of available models
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching models:", error);
        return [];
    }
}

module.exports = {
    saveConnection,
    getConnections,
    saveDefaultConnection,
    getDefaultConnection,
    fetchFeatherlessModels // Export the new function
};