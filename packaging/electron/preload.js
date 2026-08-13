/* Koda Desktop preload — bridges the app to a native "Save As" dialog.
   contextIsolation + sandbox stay on; only this tiny bridge is exposed. */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('koda', {
  isDesktop: true,
  /* Saves a blob's bytes via a native save dialog. Returns true on success. */
  saveBlob: (bytes, filename) => ipcRenderer.invoke('koda:save-blob', bytes, filename)
});
