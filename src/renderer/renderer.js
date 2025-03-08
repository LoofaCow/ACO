document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed.');

  // Header & Drawer Toggling
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      console.log('Hamburger clicked');
      drawer.classList.toggle('open');
    });
  } else {
    console.error('Hamburger or drawer element not found!');
  }

  // Drawer Navigation (Chat Threads & Workspace)
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
  const iconCharacters = document.getElementById('icon-characters'); // now for Personas
  const iconPersonas = document.getElementById('icon-personas');       // now for Characters

  if (iconSettings) {
    iconSettings.addEventListener('click', () => { alert('Header Settings icon clicked!'); });
  }
  if (iconCharacters) {
    iconCharacters.addEventListener('click', () => { alert('Header Personas icon clicked!'); });
  }
  if (iconPersonas) {
    iconPersonas.addEventListener('click', () => { alert('Header Characters icon clicked!'); });
  }

  // Chat Send Functionality
  const sendButton = document.getElementById('send-button');
  const messageInput = document.getElementById('message-input');
  const chatContainer = document.getElementById('chat-container');

  sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message === '') return;

    // Create Sender Message Bubble (Right Side)
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

    // Automatically create a response bubble (Left Side) with "Connect API"
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

  // Send Message on Enter Key Press
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendButton.click();
    }
  });
});
