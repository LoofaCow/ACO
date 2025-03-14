// settings_advanced.js – Advanced Parameters functions
const settingsAdvanced = {
  loadAdvancedTab() {
    document.getElementById("settings-content").innerHTML = `
      <div class="advanced-settings modern-form">
        <h2>Advanced Parameters</h2>
        <div class="form-group">
          <label for="max-tokens">Max Tokens</label>
          <input type="number" id="max-tokens" class="bubble-input" placeholder="Max tokens" value="150">
        </div>
        <div class="form-group">
          <label for="temperature">Temperature</label>
          <input type="number" step="0.01" id="temperature" class="bubble-input" placeholder="Temperature" value="0.7">
        </div>
        <div class="form-group">
          <label for="top-p">Top P</label>
          <input type="number" step="0.01" id="top-p" class="bubble-input" placeholder="Top P" value="1.0">
        </div>
        <div class="form-group">
          <label for="frequency-penalty">Frequency Penalty</label>
          <input type="number" step="0.01" id="frequency-penalty" class="bubble-input" placeholder="Frequency Penalty" value="0.0">
        </div>
        <div class="form-group">
          <label for="presence-penalty">Presence Penalty</label>
          <input type="number" step="0.01" id="presence-penalty" class="bubble-input" placeholder="Presence Penalty" value="0.0">
        </div>
        <button id="save-advanced-params" class="primary-btn bubble-btn">Save Advanced Parameters</button>
      </div>
    `;
    
    // Load any existing advanced parameters from localStorage
    document.getElementById('max-tokens').value = localStorage.getItem('maxTokens') || 150;
    document.getElementById('temperature').value = localStorage.getItem('temperature') || 0.7;
    document.getElementById('top-p').value = localStorage.getItem('topP') || 1.0;
    document.getElementById('frequency-penalty').value = localStorage.getItem('frequencyPenalty') || 0.0;
    document.getElementById('presence-penalty').value = localStorage.getItem('presencePenalty') || 0.0;
    
    document.getElementById('save-advanced-params').addEventListener('click', () => {
      const maxTokens = document.getElementById('max-tokens').value;
      const temperature = document.getElementById('temperature').value;
      const topP = document.getElementById('top-p').value;
      const frequencyPenalty = document.getElementById('frequency-penalty').value;
      const presencePenalty = document.getElementById('presence-penalty').value;
      
      localStorage.setItem('maxTokens', maxTokens);
      localStorage.setItem('temperature', temperature);
      localStorage.setItem('topP', topP);
      localStorage.setItem('frequencyPenalty', frequencyPenalty);
      localStorage.setItem('presencePenalty', presencePenalty);
      
      console.log("Advanced parameters saved.");
      const notification = document.createElement("div");
      notification.className = "notification success";
      notification.textContent = "Advanced parameters saved.";
      document.getElementById("notification-container").appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    });
  }
};

module.exports = settingsAdvanced;
