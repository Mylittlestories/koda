/* Copies Koda's single-file app into the Electron package before building.
   Keeps packaging/electron self-contained so electron-builder never has to
   chase files outside the project folder. Run automatically by `npm run dist`. */
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');
fs.mkdirSync(appDir, { recursive: true });

const files = [
  ['../../index.html', 'index.html'],
  ['../../docs/koda-logo.png', 'koda-logo.png']
];

for (const [from, to] of files) {
  fs.copyFileSync(path.join(__dirname, from), path.join(appDir, to));
  console.log('copied → app/' + to);
}
console.log('Koda app assets ready in packaging/electron/app/');
