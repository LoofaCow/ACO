const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,  // I know it's not perfect for security, but we're keeping it simple, babe!
      contextIsolation: false
    }
  });

  win.loadFile(require('path').join(__dirname, 'src', 'renderer', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
