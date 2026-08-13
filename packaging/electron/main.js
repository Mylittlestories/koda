/* Koda Desktop — wraps the single-file app in an Electron window.
   Run:  npm install && npm start        (from this folder)
   Build installers:  npm run dist       (needs electron-builder)
   Test:  KODA_TEST=1 npx electron . --no-sandbox  (loads, verifies, prints JSON, exits) */
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

/* Resolve a file either from the packaged app/ folder or the dev tree. */
function resolveAppFile(name) {
  const packaged = path.join(__dirname, 'app', name);
  if (fs.existsSync(packaged)) return packaged;
  return path.join(__dirname, '..', '..', name); // dev: packaging/electron/../../<name>
}

/* Native "Save As" for movie exports (.webm), PNG art, gallery and .koda projects. */
ipcMain.handle('koda:save-blob', async (event, bytes, filename) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    defaultPath: filename || 'koda-export.webm',
    filters: [
      { name: 'Koda export', extensions: ['webm', 'png', 'jpg', 'koda', 'json'] },
      { name: 'All files', extensions: ['*'] }
    ]
  });
  if (canceled || !filePath) return false;
  await fs.promises.writeFile(filePath, Buffer.from(bytes));
  return true;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    backgroundColor: '#6d5cff',
    autoHideMenuBar: true,
    icon: resolveAppFile('koda-logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true
    }
  });
  win.setMenuBarVisibility(false);
  win.loadFile(resolveAppFile('index.html'));

  /* Automated test mode: KODA_TEST=1 loads the app, checks it rendered, prints JSON, exits. */
  if (process.env.KODA_TEST) {
    win.webContents.on('console-message', (e, level, message) => {
      if (message) console.log('[page]', String(message).slice(0, 300));
    });
    win.webContents.on('did-finish-load', async () => {
      try {
        const result = await win.webContents.executeJavaScript(`(() => ({
          title: document.title,
          views: document.querySelectorAll('.view').length,
          navbtns: document.querySelectorAll('.navbtn').length,
          xp: typeof state !== 'undefined' ? state.xp : -1,
          lessons: typeof LESSONS !== 'undefined' ? LESSONS.length : -1,
          missions: typeof MISSIONS !== 'undefined' ? MISSIONS.length : -1,
          adventure: (typeof ADV !== 'undefined' && ADV.W === 18 && ADV.H === 13) && (typeof SKY !== 'undefined' && SKY.W === 18 && SKY.stars.length === 4) ? 'ok' : 'missing',
          desktopBridge: typeof koda !== 'undefined' && koda.isDesktop === true,
          canvasOK: !!document.querySelector('#stage') && !!document.querySelector('#stage').getContext('2d')
        }))()`);
        console.log('KODA_TEST_RESULT ' + JSON.stringify(result));
      } catch (e) {
        console.log('KODA_TEST_ERROR ' + (e && e.message));
      }
      app.exit(0);
    });
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
