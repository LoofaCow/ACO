const fs = require('fs');
const path = require('path');

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
    getDefaultConnection
};
