// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

// Function to create the settings window
function createSettingsWindow() {
  const settingsWin = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Settings',
    resizable: false,
    modal: true,
    parent: BrowserWindow.getFocusedWindow(),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  settingsWin.loadFile(path.join(__dirname, 'src', 'settings.html'));
}

// Function to create an enlarged tile window based on its name
function createTileWindow(tileName) {
  const tileWin = new BrowserWindow({
    width: 800,
    height: 600,
    title: tileName.charAt(0).toUpperCase() + tileName.slice(1),
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  tileWin.loadFile(path.join(__dirname, 'src', `${tileName}.html`));
}

app.whenReady().then(() => {
  createWindow();

  // Listen for the settings window request
  ipcMain.on('open-settings-window', () => {
    createSettingsWindow();
  });

  // Listen for tile window requests; tileName can be "devices", "chat", etc.
  ipcMain.on('open-tile-window', (event, tileName) => {
    createTileWindow(tileName);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
