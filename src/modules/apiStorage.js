// src/modules/apiStorage.js

import fs from 'fs/promises';
import path from 'path';

const API_DIR = path.join(process.cwd(), 'src', 'data', 'api');
const DEFAULT_FILE = path.join(API_DIR, 'default.json');

class ApiStorage {
  static async initialize() {
    await fs.mkdir(API_DIR, { recursive: true });
  }

  static async saveConnection(name, url, apiKey) {
    await this.initialize();
    const filePath = path.join(API_DIR, `${name}.json`);
    const connectionData = { name, url, apiKey };
    await fs.writeFile(filePath, JSON.stringify(connectionData, null, 2));
    return true;
  }

  static async getConnections() {
    await this.initialize();
    try {
      const files = await fs.readdir(API_DIR);
      return Promise.all(
        files
          .filter(f=>f.endsWith('.json') && f!=='default.json')
          .map(async file=>{
            const data=await fs.readFile(path.join(API_DIR,file),'utf8');
            return JSON.parse(data);
          })
      );
    } catch (err) {
      return [];
    }
  }

  static async saveDefaultConnection(name, model=null) {
    await this.initialize();
    await fs.writeFile(
      DEFAULT_FILE,
      JSON.stringify({defaultConnection:name,defaultModel:model},null,2)
    );
  }

  static async getDefaultConnection() {
    await this.initialize();
    try {
      const data=await fs.readFile(DEFAULT_FILE,'utf8');
      return JSON.parse(data);
    } catch(err) {
      return { defaultConnection:null, defaultModel:null };
    }
  }
}

export default ApiStorage;
