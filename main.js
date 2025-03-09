const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'false';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
      nodeIntegration: true,         // Enabled so that require() works in renderer
      contextIsolation: false,       // Disabled for easier module access in renderer
      sandbox: false,                // Disabled to allow node integration
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  // Load main window
  mainWindow.loadFile(path.join(__dirname, 'src/renderer/index.html'));

  // Development tools
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    require('electron-reloader')(module);
  }

  // Window controls handler
  ipcMain.handle('window-control', (_, action) => {
    switch(action) {
      case 'minimize': 
        mainWindow.minimize(); 
        break;
      case 'maximize': 
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
        break;
      case 'close': 
        mainWindow.close(); 
        break;
    }
  });

  // Version handler
  ipcMain.handle('get-app-version', () => app.getVersion());
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Security headers middleware
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event) => {
    event.preventDefault();
  });
  
  contents.setWindowOpenHandler(() => ({
    action: 'deny'
  }));
});
