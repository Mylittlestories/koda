/* Real-browser test: load Koda in actual Chromium (Electron), run the user flows,
   inspect canvas PIXELS + console errors. Prints JSON. Run: npx electron test-real.js --no-sandbox */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs'), os = require('os');
app.setPath('userData', fs.mkdtempSync(path.join(os.tmpdir(), 'koda-test-')));

const pageErrors = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1280, height: 900, show: false,
    webPreferences: { contextIsolation: true, sandbox: true }
  });
  win.webContents.on('console-message', (e, level, message) => {
    const m = String(message);
    if (level >= 2 && !m.includes('Electron Security Warning') && !m.includes('willReadFrequently') && !m.includes('bus.cc')) pageErrors.push(m.slice(0, 200));
  });
  win.webContents.on('render-process-gone', (e, d) => pageErrors.push('RENDER GONE: ' + d.reason));

  const out = { ok: true, checks: [], errors: [] };
  const check = (name, pass, extra) => {
    out.checks.push({ name, pass, extra });
    if (!pass) out.ok = false;
  };
  const js = s => win.webContents.executeJavaScript(s, true);

  try {
    await win.loadFile(path.join(__dirname, '..', '..', 'index.html'));
    await sleep(600);

    // helper: count pixels matching a predicate on a canvas
    await js(`
      window.__pix = function(canvasId, pred) {
        const cv = document.getElementById(canvasId);
        if (!cv) return -1;
        const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
        let n = 0;
        for (let i = 0; i < d.length; i += 4) { if (pred(d[i], d[i+1], d[i+2])) n++; }
        return n;
      };
      window.__orange = (r,g,b) => r>190 && g>70 && g<200 && b<160;
      window.__yellow = (r,g,b) => r>210 && g>180 && b<150;
      window.__nonBg = (r,g,b) => Math.abs(r-238)>25 || Math.abs(g-242)>25 || Math.abs(b-255)>25;
      true;`);

    // ============ FLOW 1: CODE PLAYGROUND — results visible on stage ============
    await js(`go('code'); loadTemplate('star'); toggleRun(); true;`);
    await sleep(6500);
    const runDone = await js(`CODING.running === false`);
    const msg = await js(`document.getElementById('stage-msg').textContent`);
    const score = await js(`document.getElementById('score').textContent`);
    const orange = await js(`window.__pix('stage', window.__orange)`);
    const yellow = await js(`window.__pix('stage', window.__yellow)`);
    const nonBg = await js(`window.__pix('stage', window.__nonBg)`);
    check('program finished', runDone === true, { msg });
    check('stage shows Done message', msg.includes('Done'), { msg });
    check('sprite (orange) visible on stage', orange > 40, { orange });
    check('stars (yellow) visible on stage', yellow > 60, { yellow });
    check('stage has substantial painted content', nonBg > 3000, { nonBg });
    check('score > 0 (stars collected)', parseInt(score) > 0, { score });

    // also: code preview panel populated
    const prev = await js(`document.getElementById('code-preview').textContent.length`);
    check('code preview has text', prev > 20, { prev });

    // ============ FLOW 2: ADVENTURE — Code Master (mission coding) ============
    await js(`go('adventure'); advSave.won = true; advSaveNow(); switchRegion('cavern'); advSave.cave.won = true; advSaveNow(); switchRegion('sky'); switchRegion('forest'); true;`);

    const diag0 = await js(`(() => { try { ADV.openCode(); return { children: document.getElementById('modal-root').children.length, cp: !!document.getElementById('cp-canvas') }; } catch(e) { return { err: String(e) }; } })()`);
    await sleep(300);
    const diag1 = await js(`({ children: document.getElementById('modal-root').children.length, cp: !!document.getElementById('cp-canvas') })`);
    console.log('DIAG +0:', JSON.stringify(diag0), '| +300:', JSON.stringify(diag1));
    const cpPix0 = await js(`window.__pix('cp-canvas', window.__nonBg)`);
    const cpYellow = await js(`window.__pix('cp-canvas', window.__yellow)`);
    const cpBlue = await js(`window.__pix('cp-canvas', (r,g,b) => r>150 && r<210 && g>170 && g<220 && b>220)`); // robot body #b9c6f2-ish
    await js(`advCpAdd(0);advCpAdd(0);advCpAdd(0);advCpAdd(2);advCpAdd(0);advCpAdd(0);advCpAdd(0); true;`);
    await js(`advCpRun(); true;`);
    await sleep(2400);
    const haveCode = await js(`ADV.have('code')`);
    check('code master canvas has content (robot/star/obstacles)', cpPix0 > 300, { cpPix0 });
    check('code master shows the vector star (yellow)', cpYellow > 60, { cpYellow });
    check('code master shows the vector robot (bluish body)', cpBlue > 40, { cpBlue });
    check('code gate crystal awarded in real browser', haveCode === true, { haveCode });

    // ============ FLOW 3: QUESTS TAB ============
    await js(`go('code'); switchCodeTab('quests'); true;`);
    const questsHtml = await js(`document.getElementById('quest-list').innerHTML.length`);
    check('quests tab renders missions', questsHtml > 50, { questsHtml });
    await js(`switchCodeTab('blocks'); true;`);

    // ============ screenshot for the record ============
    const img = await win.capturePage();
    require('fs').writeFileSync(path.join(require('os').tmpdir(), 'koda-stage.png'), img.toPNG());

  } catch (e) {
    out.ok = false;
    out.errors.push('HARNESS ERROR: ' + (e && e.message || e));
  }

  out.errors = out.errors.concat(pageErrors);
  if (pageErrors.length) out.ok = false;
  console.log('REAL_BROWSER_RESULT ' + JSON.stringify(out, null, 1));
  app.exit(out.ok ? 0 : 1);
});
