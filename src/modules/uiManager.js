// src/modules/uiManager.js

export class UIManager {
  constructor() {
    // Store references to your main DOM elements by ID
    this.elements = {
      // Notification area
      notificationContainer: document.getElementById('notification-container'),

      // Left drawer toggling
      hamburger: document.getElementById('hamburger'),
      drawer: document.getElementById('drawer'),

      // Right drawer toggling
      rightDrawer: document.getElementById('right-drawer'),

      // Settings panel bubble
      settingsPanel: document.getElementById('settings-panel'),

      // Chat area
      chatContainer: document.getElementById('chat-container'),
      messageInput: document.getElementById('message-input'),
      sendButton: document.getElementById('send-button'),

      // Header icon buttons
      iconSettings: document.getElementById('icon-settings'),
      iconPersonas: document.getElementById('icon-personas'),
      iconCharacters: document.getElementById('icon-characters'),

      // Title bar buttons
      minimizeBtn: document.getElementById('minimize-btn'),
      maximizeBtn: document.getElementById('maximize-btn'),
      closeBtn: document.getElementById('close-btn')
    };
  }

  // Return a stored element by key name
  getElement(key) {
    return this.elements[key] || null;
  }

  // Toggle a CSS class on an element
  toggleClass(element, className = 'active') {
    if (!element) return;
    element.classList.toggle(className);
  }

  // Show/hide a particular element
  showElement(element, show = true) {
    if (!element) return;
    element.style.display = show ? 'block' : 'none';
  }

  // Safely attach an event listener
  safeAddEventListener(element, eventName, handler) {
    if (element) {
      element.addEventListener(eventName, handler);
    } else {
      console.warn(`UIManager: Missing element for event "${eventName}"`);
    }
  }
}
