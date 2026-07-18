// Electron Preload Script
// Expose premium desktop APIs to the renderer process safely
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  // Add any custom cross-process methods here for a deep-integrated experience
});
