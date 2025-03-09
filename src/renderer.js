// src/renderer.js

import { UIManager } from './modules/uiManager.js';
import { NotificationSystem } from './modules/notification.js';
import { DrawerManager } from './modules/drawerManager.js';
import { ChatManager } from './modules/chatManager.js';
import { SettingsManager } from './modules/settingsManager.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Create UI manager
  const ui = new UIManager();

  // 2. Notification system
  const notifications = new NotificationSystem(ui);

  // 3. Drawer manager for left & right drawers
  const drawerManager = new DrawerManager(ui);

  // 4. Chat manager for chat logic
  const chatManager = new ChatManager(ui, notifications);

  // 5. Settings manager for the entire settings panel
  const settingsManager = new SettingsManager(ui, notifications);

  // Left drawer: hamburger
  ui.safeAddEventListener(ui.getElement('hamburger'), 'click', () => {
    drawerManager.toggleLeftDrawer();
  });

  // Right drawer: persona & character icons
  ui.safeAddEventListener(ui.getElement('iconPersonas'), 'click', () => {
    drawerManager.toggleRightDrawer('personas');
  });
  ui.safeAddEventListener(ui.getElement('iconCharacters'), 'click', () => {
    drawerManager.toggleRightDrawer('characters');
  });

  // Settings panel: gear icon
  ui.safeAddEventListener(ui.getElement('iconSettings'), 'click', () => {
    // Toggle the settings panel bubble
    ui.toggleClass(ui.getElement('settingsPanel'), 'active');
    // Open the last used tab
    settingsManager.openTab(settingsManager.currentTab);
  });

  // Settings sub-tab switching
  const tabButtons = document.querySelectorAll('.settings-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.target.closest('button').dataset.tab;
      // Mark the clicked one active
      tabButtons.forEach(b => b.classList.remove('active'));
      e.target.closest('button').classList.add('active');
      // Actually open that tab
      settingsManager.openTab(tab);
    });
  });

  // Title bar controls: minimize, maximize, close
  ui.safeAddEventListener(ui.getElement('minimizeBtn'), 'click', () => {
    window.electronAPI?.windowControl('minimize');
  });
  ui.safeAddEventListener(ui.getElement('maximizeBtn'), 'click', () => {
    window.electronAPI?.windowControl('maximize');
  });
  ui.safeAddEventListener(ui.getElement('closeBtn'), 'click', () => {
    window.electronAPI?.windowControl('close');
  });

  console.log("Renderer initialization complete. All modules loaded.");
});
