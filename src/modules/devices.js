// devices.js
export function initDevices() {
  const devicesTile = document.getElementById('devicesTile');
  devicesTile.innerHTML = `
    <div class="tile-header">Devices</div>
    <div class="tile-preview">3 connected devices</div>
  `;
}
