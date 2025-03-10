// settings_formatting.js – Advanced Formatting tab functions
const DEFAULT_CONTEXT_TEMPLATE_PRESET = `{{#if system}}{{system}}
{{/if}}{{#if wiBefore}}{{wiBefore}}
{{/if}}{{#if description}}{{description}}
{{/if}}{{#if personality}}{{personality}}
{{/if}}{{#if scenario}}{{scenario}}
{{/if}}{{#if wiAfter}}{{wiAfter}}
{{/if}}{{#if persona}}{{persona}}
{{/if}}`;

const DEFAULT_SYSTEM_PROMPT_PRESET = `A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human's questions.`;

const settingsFormatting = {
  loadFormattingTab() {
    document.getElementById("settings-content").innerHTML =
      this.generateFormattingTabHtml();
    this.attachFormattingEvents();
    const settings = this.loadFormattingSettings();
    document.getElementById("context-template").value =
      settings.contextTemplate || DEFAULT_CONTEXT_TEMPLATE_PRESET;
    document.getElementById("system-prompt").value =
      settings.systemPrompt || DEFAULT_SYSTEM_PROMPT_PRESET;
  },
  generateFormattingTabHtml() {
    return `
      <div class="formatting-tab">
        <h2>Advanced Formatting</h2>
        <div class="form-group">
          <label for="context-template-preset">Context Template Preset</label>
          <select id="context-template-preset">
            <option value="${encodeURIComponent(
              DEFAULT_CONTEXT_TEMPLATE_PRESET
            )}">Default</option>
          </select>
        </div>
        <div class="form-group">
          <label for="context-template">Context Template</label>
          <textarea id="context-template" placeholder="Enter your context template..."></textarea>
        </div>
        <div class="form-group">
          <label for="system-prompt-preset">System Prompt Preset</label>
          <select id="system-prompt-preset">
            <option value="${encodeURIComponent(
              DEFAULT_SYSTEM_PROMPT_PRESET
            )}">Default</option>
          </select>
        </div>
        <div class="form-group">
          <label for="system-prompt">System Prompt</label>
          <textarea id="system-prompt" placeholder="Enter your system prompt..."></textarea>
        </div>
        <button id="save-formatting-btn" class="primary-btn">Save Formatting</button>
      </div>
    `;
  },
  attachFormattingEvents() {
    document.getElementById("save-formatting-btn")?.addEventListener("click", () => {
      settingsFormatting.saveFormattingSettings();
    });
    document.getElementById("context-template-preset")?.addEventListener("change", (e) => {
      const presetValue = decodeURIComponent(e.target.value);
      document.getElementById("context-template").value = presetValue;
    });
    document.getElementById("system-prompt-preset")?.addEventListener("change", (e) => {
      const presetValue = decodeURIComponent(e.target.value);
      document.getElementById("system-prompt").value = presetValue;
    });
  },
  saveFormattingSettings() {
    const contextTemplate = document.getElementById("context-template")?.value || "";
    const systemPrompt = document.getElementById("system-prompt")?.value || "";
    localStorage.setItem("contextTemplate", contextTemplate);
    localStorage.setItem("systemPrompt", systemPrompt);
    console.log(`Formatting settings saved. Context Template: ${contextTemplate} | System Prompt: ${systemPrompt}`);
    settingsFormatting.showNotification("Formatting settings saved", "success");
  },
  loadFormattingSettings() {
    return {
      contextTemplate: localStorage.getItem("contextTemplate") || "",
      systemPrompt: localStorage.getItem("systemPrompt") || ""
    };
  },
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.getElementById("notification-container").appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
};

module.exports = settingsFormatting;
