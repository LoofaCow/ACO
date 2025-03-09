const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Using invoke so that it matches the ipcMain.handle in main.js
  windowControl: (action) => ipcRenderer.invoke('window-control', action),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  platform: process.platform
});

// Security filters for IPC
contextBridge.exposeInMainWorld('secureAPI', {
  send: (channel, data) => {
    const validChannels = ['config-save', 'connection-test'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ['config-update', 'connection-status'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});
