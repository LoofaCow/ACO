// modules/chatModule.js
export const chatModule = {
    async getBotResponse(message) {
      // Retrieve system prompt (or fallback to default)
      const systemPrompt = localStorage.getItem('systemPrompt') ||
        "A chat between a curious human and an AI assistant. The assistant gives helpful, detailed, and polite answers to the human's questions.";
  
      // Build conversation history from the last 3 messages.
      let conversationHistory = "";
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) {
        const messages = Array.from(chatContainer.getElementsByClassName('message-bubble'));
        const lastMessages = messages.slice(-3);
        lastMessages.forEach((msg) => {
          const role = msg.classList.contains('user') ? "User: " : "Assistant: ";
          conversationHistory += role + msg.textContent + "\n";
        });
      }
  
      const fullPrompt = `${systemPrompt}\n${conversationHistory}User: ${message}\nAssistant:`;
      console.log("Prompt sent:\n", fullPrompt);
  
      // Retrieve API parameters (simulate your API integration)
      const apiURL = localStorage.getItem('apiURL') || "https://api.example.com/completions";
      const apiKey = localStorage.getItem('apiKey') || "";
      const maxTokens = parseInt(localStorage.getItem('maxTokens')) || 150;
      const temperature = parseFloat(localStorage.getItem('temperature')) || 0.7;
      const topP = parseFloat(localStorage.getItem('topP')) || 1.0;
      const frequencyPenalty = parseFloat(localStorage.getItem('frequencyPenalty')) || 0.0;
      const presencePenalty = parseFloat(localStorage.getItem('presencePenalty')) || 0.0;
  
      try {
        const response = await fetch(apiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            prompt: fullPrompt,
            max_tokens: maxTokens,
            temperature: temperature,
            top_p: topP,
            frequency_penalty: frequencyPenalty,
            presence_penalty: presencePenalty
          })
        });
        if (!response.ok) throw new Error("HTTP error " + response.status);
        const data = await response.json();
        let botResponse = "No response";
        if (data.choices && data.choices.length > 0) {
          botResponse = data.choices[0].text.trim();
        }
        return botResponse;
      } catch (error) {
        console.error("Error sending message:", error);
        return "Failed to get response";
      }
    },
  
    async handleSendMessage() {
      const messageInput = document.getElementById('message-input');
      const message = messageInput.value.trim();
      if (!message) return;
      this.appendMessage(message, 'user');
      messageInput.value = '';
      const botResponse = await this.getBotResponse(message);
      this.appendMessage(botResponse, 'bot');
    },
  
    appendMessage(content, type = 'user') {
      const chatContainer = document.getElementById('chat-container');
      const messageWrapper = document.createElement('div');
      messageWrapper.className = `message-wrapper ${type}`;
      const messageBubble = document.createElement('div');
      messageBubble.className = 'message-bubble ' + type;
      messageBubble.textContent = content;
      messageWrapper.appendChild(messageBubble);
      chatContainer.appendChild(messageWrapper);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };
  