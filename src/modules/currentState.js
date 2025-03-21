// currentState.js
export function initCurrentState() {
  const currentStateTile = document.getElementById('currentStateTile');
  currentStateTile.innerHTML = `
    <div class="tile-header">Current State</div>
    <div class="tile-preview">All systems nominal</div>
  `;
}
