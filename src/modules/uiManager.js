export class UIManager {
    constructor() {
      this.elements = {
        hamburger: document.getElementById('hamburger'),
        drawer: document.getElementById('drawer'),
        rightDrawer: document.getElementById('right-drawer'),
        // Add all other DOM elements here...
      };
    }
  
    // Generic element getter
    getElement(id) {
      return document.getElementById(id);
    }
  
    // Toggle drawer states
    toggleDrawer(drawerElement) {
      drawerElement.classList.toggle('open');
    }
  
    // Show/hide elements
    toggleElementVisibility(element, show) {
      element.style.display = show ? 'block' : 'none';
    }
  
    // Update content areas
    updateContentArea(element, html) {
      element.innerHTML = html;
    }
  
    // Add event listener with error handling
    safeAddEventListener(element, event, handler) {
      if (element) {
        element.addEventListener(event, handler);
      } else {
        console.error(`Element not found for event: ${event}`);
      }
    }
  }