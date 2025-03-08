const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

function addMessage(role, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', role);
  messageDiv.innerText = text;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendButton.addEventListener('click', () => {
  const text = messageInput.value.trim();
  if (!text) return;
  addMessage('human', 'You: ' + text);
  messageInput.value = '';
  fetchBotResponse(text);
});

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});

async function fetchBotResponse(message) {
  try {
    // Replace the endpoint and payload below with your AI API details
    const response = await fetch('https://api.featherless.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'  // Replace with your actual API key, babe!
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-Nemo-Instruct-2407',
        prompt: message
      })
    });
    const data = await response.json();
    const botMessage = data.content || 'No response :(';
    addMessage('bot', 'Bot: ' + botMessage);
  } catch (err) {
    addMessage('bot', 'Error: ' + err.message);
  }
}
