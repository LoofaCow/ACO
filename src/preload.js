const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  windowControl: (action) => ipcRenderer.invoke('window-control', action),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  platform: process.platform,
  toggleLoggingPopout: () => ipcRenderer.invoke('toggle-logging-popout'),
  send: (channel, data) => {
    const validChannels = ['config-save', 'connection-test', 'new-log'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ['config-update', 'connection-status', 'new-log'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  // Optionally, you can expose an onNewLog method for convenience:
  onNewLog: (callback) => ipcRenderer.on('new-log', (event, ...args) => callback(...args))
});