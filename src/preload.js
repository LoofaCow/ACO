const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  windowControl: (action) => ipcRenderer.invoke('window-control', action),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  toggleLoggingPopout: () => ipcRenderer.invoke('toggle-logging-popout')
});

contextBridge.exposeInMainWorld('secureAPI', {
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
  }
});