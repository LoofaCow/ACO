// renderer.js – Main entry: imports modules and starts the app
const RendererCore = require('./renderer_core');
const rendererChat = require('./renderer_chat');
const rendererSettings = require('./renderer_settings');

document.addEventListener('DOMContentLoaded', () => {
  RendererCore.initialize();
});
