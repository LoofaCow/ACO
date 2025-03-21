// index.js
const { ipcRenderer } = require('electron');
import { initDevices } from './modules/devices.js';
import { initChat } from './modules/chat.js';
import { initAutomations } from './modules/automations.js';
import { initAlerts } from './modules/alerts.js';
import { initCurrentState } from './modules/currentState.js';
import { initOlives } from './modules/olives.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the tile previews
  initDevices();
  initChat();
  initAutomations();
  initAlerts();
  initCurrentState();
  initOlives();

  // Hook up the settings button to open the settings window
  const settingsButton = document.getElementById('settingsButton');
  settingsButton.addEventListener('click', () => {
    ipcRenderer.send('open-settings-window');
  });

  // Define each tile and its corresponding enlarged view
  const tileMappings = [
    { id: 'devicesTile', name: 'devices' },
    { id: 'chatTile', name: 'chat' },
    { id: 'automationsTile', name: 'automations' },
    { id: 'alertsTile', name: 'alerts' },
    { id: 'currentStateTile', name: 'currentState' },
    { id: 'olivesTile', name: 'olives' },
  ];

  tileMappings.forEach(tile => {
    const element = document.getElementById(tile.id);
    element.style.cursor = 'pointer';
    element.addEventListener('click', () => {
      ipcRenderer.send('open-tile-window', tile.name);
    });
  });
});
