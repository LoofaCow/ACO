const { ipcRenderer } = require('electron');
const apiStorage = require('../modules/apiStorage'); // Import API storage module

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed.');

  // Function to show notifications
  function showNotification(message, type) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerText = message;
    container.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 3000);
  }

  // Header & Left Drawer Toggling
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      console.log('Hamburger clicked');
      drawer.classList.toggle('open');
    });
  } else {
    console.error('Hamburger or left drawer element not found!');
  }

  // Left Drawer Navigation (Chat Threads & Workspace)
  const navChat = document.getElementById('nav-chat');
  const navWorkspace = document.getElementById('nav-workspace');
  if (navChat) {
    navChat.addEventListener('click', () => {
      alert('Chat Threads clicked!');
      drawer.classList.remove('open');
    });
  }
  if (navWorkspace) {
    navWorkspace.addEventListener('click', () => {
      alert('Workspace clicked!');
      drawer.classList.remove('open');
    });
  }

  // Header Icon Buttons
  const iconSettings = document.getElementById('icon-settings');
  const iconCharacters = document.getElementById('icon-characters'); // For Persona management (right drawer)
  const iconPersonas = document.getElementById('icon-personas');       // For Character management (right drawer)

  // Toggle Settings Panel on Settings Icon Click
  if (iconSettings) {
    iconSettings.addEventListener('click', () => {
      const settingsPanel = document.getElementById('settings-panel');
      const chatInterface = document.getElementById('chat-interface');
      if (settingsPanel.classList.contains('active')) {
        settingsPanel.classList.remove('active');
        chatInterface.style.display = 'flex';
        iconSettings.classList.remove('icon-active');
      } else {
        settingsPanel.classList.add('active');
        chatInterface.style.display = 'none';
        iconSettings.classList.add('icon-active');
        // Also close right drawer if open
        rightDrawer.classList.remove('open');
        activeRightDrawerType = null;
        // Load API form by default when settings open
        loadApiForm();
      }
    });
  }

  // Right Drawer for Character/Persona Management
  const rightDrawer = document.getElementById('right-drawer');
  const rightDrawerTitle = document.getElementById('right-drawer-title');
  const rightDrawerContent = document.getElementById('right-drawer-content');
  let activeRightDrawerType = null; // 'characters' for Character management, 'personas' for Persona management

  // For Character management (right drawer) - default view shows the icon buttons
  if (iconPersonas) {
    iconPersonas.addEventListener('click', () => {
      if (activeRightDrawerType === 'characters') {
        rightDrawer.classList.remove('open');
        activeRightDrawerType = null;
      } else {
        rightDrawerTitle.innerText = "Character Management";
        rightDrawerContent.innerHTML = getCharacterManagementDefault();
        rightDrawer.classList.add('open');
        activeRightDrawerType = 'characters';
        // Hide settings panel if open
        const settingsPanel = document.getElementById('settings-panel');
        settingsPanel.classList.remove('active');
        document.getElementById('chat-interface').style.display = 'flex';
        iconSettings.classList.remove('icon-active');
        attachCharacterDefaultEvents();
      }
    });
  }

  // For Persona management (right drawer)
  if (iconCharacters) {
    iconCharacters.addEventListener('click', () => {
      if (activeRightDrawerType === 'personas') {
        rightDrawer.classList.remove('open');
        activeRightDrawerType = null;
      } else {
        rightDrawerTitle.innerText = "Persona Management";
        rightDrawerContent.innerHTML = getPersonaManagementDefault();
        rightDrawer.classList.add('open');
        activeRightDrawerType = 'personas';
        const settingsPanel = document.getElementById('settings-panel');
        settingsPanel.classList.remove('active');
        document.getElementById('chat-interface').style.display = 'flex';
        iconSettings.classList.remove('icon-active');
        attachPersonaDefaultEvents();
      }
    });
  }
  

  // Settings Panel Close Button
  const settingsCloseBtn = document.getElementById('settings-close-btn');
  if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener('click', () => {
      const settingsPanel = document.getElementById('settings-panel');
      const chatInterface = document.getElementById('chat-interface');
      settingsPanel.classList.remove('active');
      chatInterface.style.display = 'flex';
      iconSettings.classList.remove('icon-active');
    });
  }

  // Settings Panel Tabs
  const settingsTabButtons = document.querySelectorAll('.settings-tab-btn');
  const settingsContent = document.getElementById('settings-content');
  settingsTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      settingsTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      let contentHTML = '';
      if (tab === 'api') {
         contentHTML = getApiFormHtml();
      } else if (tab === 'advanced') {
         contentHTML = '<p>Placeholder for Advanced Parameters.</p>';
      } else if (tab === 'formatting') {
         contentHTML = '<p>Placeholder for Advanced Formatting.</p>';
      } else if (tab === 'extensions') {
         contentHTML = '<p>Placeholder for Extensions.</p>';
      }
      settingsContent.innerHTML = contentHTML;
      if (tab === 'api') {
        attachApiFormEvents();
      }
    });
  });

    // Function to return API form HTML with structured API setup and default chat options
  function getApiFormHtml() {
    return `
      <div>
        <label for="api-name">API Name:</label><br>
        <input type="text" id="api-name" placeholder="My API Connection"
          style="width:100%; padding:8px; margin:8px 0; border-radius:4px; border:none; background:#2a2a2a; color:#e0e0e0;"><br>

        <label for="api-url">API URL:</label><br>
        <input type="text" id="api-url" placeholder="https://api.example.com"
          style="width:100%; padding:8px; margin:8px 0; border-radius:4px; border:none; background:#2a2a2a; color:#e0e0e0;"><br>
        
        <label for="api-key">API Key:</label><br>
        <input type="text" id="api-key" placeholder="Your API key here"
          style="width:100%; padding:8px; margin:8px 0; border-radius:4px; border:none; background:#2a2a2a; color:#e0e0e0;"><br>

        <button id="api-connect-btn"
          style="padding:8px 16px; border:none; border-radius:4px; background:#ff6f61; color:#fff; cursor:pointer;">
          Connect
        </button><br>

        <div style="border-top: 2px solid #444; padding-top: 8px; margin-top: 8px; text-align: center; color: #e0e0e0; font-weight: bold;">
          Default Chat
        </div>

        <label for="default-connection">Default Connection:</label><br>
        <select id="default-connection" style="width:100%; padding:8px; margin:8px 0; border-radius:4px; border:none; background:#2a2a2a; color:#e0e0e0;">
          <option value="connection-1">Connection 1</option>
          <option value="connection-2">Connection 2</option>
          <option value="connection-3">Connection 3</option>
        </select><br>

        <label for="default-model">Default Model:</label><br>
        <select id="default-model" style="width:100%; padding:8px; margin:8px 0; border-radius:4px; border:none; background:#2a2a2a; color:#e0e0e0;">
          <option value="model-1">Model 1</option>
          <option value="model-2">Model 2</option>
          <option value="model-3">Model 3</option>
        </select><br>
      </div>
    `;
  }

    // Attach event listener to API Connect button
  function attachApiFormEvents() {
    const apiConnectBtn = document.getElementById('api-connect-btn');
    
    if (apiConnectBtn) {
        apiConnectBtn.addEventListener('click', () => {
            const apiName = document.getElementById('api-name').value.trim();
            const apiUrl = document.getElementById('api-url').value.trim();
            const apiKey = document.getElementById('api-key').value.trim();

            if (!apiName || !apiUrl || !apiKey) {
                showNotification("Please fill in all fields", "error");
                return;
            }

            // Save connection as its own JSON file
            apiStorage.saveConnection(apiName, apiUrl, apiKey);
            showNotification("API Connection Saved", "success");

            updateDefaultConnectionsDropdown(); // Refresh dropdown immediately
        });
    }

    // Attach event listener to default connections dropdown
    const defaultConnectionSelect = document.getElementById('default-connection');
    if (defaultConnectionSelect) {
        defaultConnectionSelect.addEventListener('change', () => {
            const selectedConnection = defaultConnectionSelect.value;
            apiStorage.saveDefaultConnection(selectedConnection);
        });
    }
  }

    // Function to update the Default Connections dropdown and persist selection
  function updateDefaultConnectionsDropdown() {
    const defaultConnectionSelect = document.getElementById('default-connection');
    if (!defaultConnectionSelect) return;

    defaultConnectionSelect.innerHTML = ''; // Clear existing options

    const connections = apiStorage.getConnections();

    if (connections.length === 0) {
        defaultConnectionSelect.innerHTML = '<option value="">No saved connections</option>';
    } else {
        connections.forEach(conn => {
            const option = document.createElement('option');
            option.value = conn.name;
            option.textContent = conn.name;
            defaultConnectionSelect.appendChild(option);
        });
    }

    // Load and apply the last selected default connection
    const savedDefault = apiStorage.getDefaultConnection();
    if (savedDefault && connections.some(conn => conn.name === savedDefault)) {
        defaultConnectionSelect.value = savedDefault;
    }
  }

  // Function to return default Character Management content (default view)
  function getCharacterManagementDefault() {
    return `
      <p>No character selected. Choose an option:</p>
      <div class="character-bar">
        <button class="char-btn" id="default-create-char-btn" title="Create Character">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0">
            <path d="M12 5v14m-7-7h14" stroke="#e0e0e0" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="char-btn" id="default-import-char-btn" title="Import Character">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM13 9V3.5L18.5 9H13z"/>
          </svg>
        </button>
      </div>
      <div class="character-list">
        <p>Character profiles will be displayed here.</p>
      </div>
    `;
  }

    // Function to return Character Creation Form HTML with confirm button aligned to the right
  function getCharacterCreationForm() {
    return `
      <div class="character-creation">
        <div style="display: flex; flex-direction: column; margin-bottom: 16px;">
          <div style="display: flex; align-items: flex-end; margin-bottom: 8px;">
            <div style="width: 80px; height: 100px; background: #2a2a2a; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#2a2a2a"/>
                <text x="50%" y="50%" fill="#e0e0e0" font-size="24" font-family="Segoe UI" text-anchor="middle" alignment-baseline="middle">?</text>
              </svg>
            </div>
            <div style="display: flex; flex-direction: column; flex: 1; position: relative;">
              <input type="text" id="char-name" placeholder="Name"
                style="width: 100%; padding: 8px; border: none; border-radius: 4px; background: #2a2a2a; color: #e0e0e0;">
              <!-- Confirm (check mark) button aligned to the right -->
              <button id="confirm-char-btn" title="Create Character"
                style="background: transparent; border: none; cursor: pointer; position: absolute; right: 0; top: -30px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0">
                  <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 16px;">
          <textarea id="char-description" placeholder="Character Description" style="width:100%; padding:8px; border:none; border-radius:4px; background:#2a2a2a; color:#e0e0e0;" rows="3"></textarea>
        </div>
        <div>
          <textarea id="char-first-message" placeholder="Character First Message" style="width:100%; padding:8px; border:none; border-radius:4px; background:#2a2a2a; color:#e0e0e0;" rows="3"></textarea>
        </div>
      </div>
    `;
  }
  // Attach event listeners for default Character Management buttons
  function attachCharacterDefaultEvents() {
    const defaultCreateCharBtn = document.getElementById('default-create-char-btn');
    const defaultImportCharBtn = document.getElementById('default-import-char-btn');
    if (defaultCreateCharBtn) {
      defaultCreateCharBtn.addEventListener('click', () => {
        rightDrawerContent.innerHTML = getCharacterCreationForm();
      });
    }
    if (defaultImportCharBtn) {
      defaultImportCharBtn.addEventListener('click', () => {
        alert("Import Character clicked!");
      });
    }
  }

    // Function to return Persona Creation Form HTML with confirm button aligned to the right
  function getPersonaCreationForm() {
    return `
      <div class="persona-creation">
        <div style="display: flex; flex-direction: column; margin-bottom: 16px;">
          <div style="display: flex; align-items: flex-end; margin-bottom: 8px;">
            <div style="width: 80px; height: 100px; background: #2a2a2a; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#2a2a2a"/>
                <text x="50%" y="50%" fill="#e0e0e0" font-size="24" font-family="Segoe UI" text-anchor="middle" alignment-baseline="middle">?</text>
              </svg>
            </div>
            <div style="display: flex; flex-direction: column; flex: 1; position: relative;">
              <input type="text" id="persona-name" placeholder="Name"
                style="width: 100%; padding: 8px; border: none; border-radius: 4px; background: #2a2a2a; color: #e0e0e0;">
              <!-- Confirm (check mark) button aligned to the right -->
              <button id="confirm-persona-btn" title="Create Persona"
                style="background: transparent; border: none; cursor: pointer; position: absolute; right: 0; top: -30px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0">
                  <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div>
          <textarea id="persona-description" placeholder="Persona Description" style="width:100%; padding:8px; border:none; border-radius:4px; background:#2a2a2a; color:#e0e0e0;" rows="3"></textarea>
        </div>
      </div>
    `;
  }

    // Function to return default Persona Management content (before selecting create)
  function getPersonaManagementDefault() {
    return `
      <p>No persona selected. Choose an option:</p>
      <div class="character-bar">
        <button class="char-btn" id="default-create-persona-btn" title="Create Persona">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0">
            <path d="M12 5v14m-7-7h14" stroke="#e0e0e0" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="char-btn" id="default-import-persona-btn" title="Import Persona">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM13 9V3.5L18.5 9H13z"/>
          </svg>
        </button>
      </div>
      <div class="character-list">
        <p>Persona profiles will be displayed here.</p>
      </div>
    `;
  }
    // Attach event listeners for default Persona Management buttons
  function attachPersonaDefaultEvents() {
    const defaultCreatePersonaBtn = document.getElementById('default-create-persona-btn');
    const defaultImportPersonaBtn = document.getElementById('default-import-persona-btn');
    if (defaultCreatePersonaBtn) {
      defaultCreatePersonaBtn.addEventListener('click', () => {
        rightDrawerContent.innerHTML = getPersonaCreationForm();
      });
    }
    if (defaultImportPersonaBtn) {
      defaultImportPersonaBtn.addEventListener('click', () => {
        alert("Import Persona clicked!");
      });
    }
  }

  // Window Control Buttons using IPC
  const minimizeBtn = document.getElementById('minimize-btn');
  const maximizeBtn = document.getElementById('maximize-btn');
  const closeBtn = document.getElementById('close-btn');
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => { ipcRenderer.send('window-minimize'); });
  }
  if (maximizeBtn) {
    maximizeBtn.addEventListener('click', () => { ipcRenderer.send('window-maximize'); });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => { ipcRenderer.send('window-close'); });
  }

  // Chat Send Functionality
  const sendButton = document.getElementById('send-button');
  const messageInput = document.getElementById('message-input');
  const chatContainer = document.getElementById('chat-container');
  sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message === '') return;
    const messageBubble = document.createElement('div');
    messageBubble.style.padding = '8px 12px';
    messageBubble.style.marginBottom = '8px';
    messageBubble.style.background = '#ff6f61';
    messageBubble.style.borderRadius = '8px';
    messageBubble.style.maxWidth = '70%';
    messageBubble.style.alignSelf = 'flex-end';
    messageBubble.innerText = message;
    chatContainer.appendChild(messageBubble);
    messageInput.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;
    setTimeout(() => {
      const responseBubble = document.createElement('div');
      responseBubble.style.padding = '8px 12px';
      responseBubble.style.marginBottom = '8px';
      responseBubble.style.background = '#4e4e4e';
      responseBubble.style.borderRadius = '8px';
      responseBubble.style.maxWidth = '70%';
      responseBubble.style.alignSelf = 'flex-start';
      responseBubble.innerText = "Connect API";
      chatContainer.appendChild(responseBubble);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 500);
  });
  messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { sendButton.click(); } });

  document.addEventListener('DOMContentLoaded', () => {
    updateDefaultConnectionsDropdown(); // Load saved API connections on startup
  });
});
