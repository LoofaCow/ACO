export class DrawerManager {
    constructor(ui, notifications) {
      this.ui = ui;
      this.notifications = notifications;
      this.activeRightDrawerType = null;
    }
  
    toggleLeftDrawer() {
      this.ui.toggleDrawer(this.ui.elements.drawer);
    }
  
    closeLeftDrawer() {
      this.ui.elements.drawer.classList.remove('open');
    }
  
    toggleRightDrawer(type, title, contentGenerator) {
      if (this.activeRightDrawerType === type) {
        this.closeRightDrawer();
        return;
      }
  
      this.ui.elements.rightDrawerTitle.textContent = title;
      this.ui.updateContentArea(this.ui.elements.rightDrawerContent, contentGenerator());
      this.ui.elements.rightDrawer.classList.add('open');
      this.activeRightDrawerType = type;
    }
  
    closeRightDrawer() {
      this.ui.elements.rightDrawer.classList.remove('open');
      this.activeRightDrawerType = null;
    }
  }