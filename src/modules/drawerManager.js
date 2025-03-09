// src/modules/drawerManager.js

export class DrawerManager {
    constructor(uiManager) {
      this.ui = uiManager;
      this.leftDrawer = this.ui.getElement('drawer');
      this.rightDrawer = this.ui.getElement('rightDrawer');
      // Keep track of the right drawer’s active content
      this.rightDrawerActiveContent = null;
    }
  
    toggleLeftDrawer() {
      if (!this.leftDrawer) return;
      this.ui.toggleClass(this.leftDrawer, 'open');
    }
  
    toggleRightDrawer(contentType) {
      if (!this.rightDrawer) return;
  
      // If the user toggles the same content, close it
      if (this.rightDrawerActiveContent === contentType) {
        this.rightDrawer.classList.remove('open');
        this.rightDrawerActiveContent = null;
      } else {
        this.rightDrawer.classList.add('open');
        this.rightDrawerActiveContent = contentType;
        // (Optional) load content for that specific contentType here
      }
    }
  }
  