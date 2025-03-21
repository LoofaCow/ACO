// automations.js
export function initAutomations() {
  const automationsTile = document.getElementById('automationsTile');
  automationsTile.innerHTML = `
    <div class="tile-header">Automations</div>
    <div class="tile-preview">5 active automations</div>
  `;
}
