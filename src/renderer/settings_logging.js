// settings_logging.js – Logging tab functions
const settingsLogging = {
    loadLoggingTab() {
      document.getElementById("settings-content").innerHTML =
        this.generateLoggingTabHtml();
      this.attachLoggingEvents();
      const logContainer = document.getElementById("log-container");
      if (logContainer && window.globalLogs) {
        window.globalLogs.forEach((msg) => {
          const logEntry = document.createElement("div");
          logEntry.className = "log-entry";
          logEntry.textContent = msg;
          logContainer.appendChild(logEntry);
        });
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    },
    generateLoggingTabHtml() {
      return `
        <div class="logging-tab">
          <div class="logging-header">
            <h2>Logging</h2>
            <button id="popout-logs" class="icon-btn popout-btn" title="Pop Out Logs">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#e0e0e0">
                <path d="M14 3l7 7-1.414 1.414L15 6.828V17h-2V6.828l-4.586 4.586L7 10l7-7z"/>
                <path d="M5 19h14v2H5z"/>
              </svg>
            </button>
          </div>
          <div id="log-container" class="log-container">
            <!-- Log entries will appear here -->
          </div>
          <button id="clear-logs" class="primary-btn clear-btn">Clear Logs</button>
        </div>
      `;
    },
    attachLoggingEvents() {
      document.getElementById("clear-logs")?.addEventListener("click", () => {
        settingsLogging.clearLogs();
      });
      document.getElementById("popout-logs")?.addEventListener("click", async () => {
        const poppedOut = await window.electronAPI.toggleLoggingPopout();
        console.log("Popout toggled:", poppedOut);
      });
    },
    clearLogs() {
      window.globalLogs = [];
      const logContainer = document.getElementById("log-container");
      if (logContainer) {
        logContainer.innerHTML = "";
      }
    }
  };
  
  module.exports = settingsLogging;
  