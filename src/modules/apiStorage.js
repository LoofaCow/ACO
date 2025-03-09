const fs = require('fs').promises;
const path = require('path');

const API_DIR = path.join(__dirname, '../data/api/');
const DEFAULT_FILE = path.join(API_DIR, 'default.json');

class ApiStorage {
  static async initialize() {
    await fs.mkdir(API_DIR, { recursive: true });
  }

  static async saveConnection(name, url, apiKey) {
    const filePath = path.join(API_DIR, `${name}.json`);
    const connectionData = { name, url, apiKey };
    await fs.writeFile(filePath, JSON.stringify(connectionData, null, 2));
    return true;
  }

  static async getConnections() {
    try {
      const files = await fs.readdir(API_DIR);
      return Promise.all(
        files
          .filter(file => file.endsWith('.json') && file !== 'default.json')
          .map(async file => {
            const data = await fs.readFile(path.join(API_DIR, file), 'utf8');
            return JSON.parse(data);
          })
      );
    } catch (error) {
      return [];
    }
  }

  static async saveDefaultConnection(name) {
    await fs.writeFile(DEFAULT_FILE, JSON.stringify({ defaultConnection: name }, null, 2));
  }

  static async getDefaultConnection() {
    try {
      const data = await fs.readFile(DEFAULT_FILE, 'utf8');
      return JSON.parse(data).defaultConnection;
    } catch (error) {
      return null;
    }
  }
}

module.exports = ApiStorage;