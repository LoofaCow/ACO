const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'false';

let mainWindow;
let loggingWindow = null;

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
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src/renderer/index.html'));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    require('electron-reloader')(module);
  }

  ipcMain.handle('window-control', (_, action) => {
    switch(action) {
      case 'minimize': mainWindow.minimize(); break;
      case 'maximize': 
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
        break;
      case 'close': mainWindow.close(); break;
    }
  });

  ipcMain.handle('get-app-version', () => app.getVersion());
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event) => {
    event.preventDefault();
  });
  
  contents.setWindowOpenHandler(() => ({
    action: 'deny'
  }));
});

// Logging popout toggle handler
ipcMain.handle('toggle-logging-popout', () => {
  console.log("toggle-logging-popout invoked");
  if (loggingWindow) {
    loggingWindow.close();
    loggingWindow = null;
    return false;
  } else {
    loggingWindow = new BrowserWindow({
      width: 600,
      height: 400,
      title: "Logging Popout",
      webPreferences: {
        preload: path.join(__dirname, 'src/preload.js'),
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    loggingWindow.loadFile(path.join(__dirname, 'src/renderer/logging_popout.html'));
    loggingWindow.once('ready-to-show', () => {
      loggingWindow.show();
      loggingWindow.focus();
    });
    loggingWindow.on('closed', () => {
      loggingWindow = null;
    });
    return true;
  }
});