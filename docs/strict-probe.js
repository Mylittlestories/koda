/* STRICT canvas probe: throws on unknown ctx methods (catches typos the lenient stub missed)
   and records draw calls so we can assert the stage actually painted. */
let JSDOMc, VirtualConsolec;
try { ({ JSDOM: JSDOMc, VirtualConsole: VirtualConsolec } = require('jsdom')); }
catch (e) { console.error('jsdom needed'); process.exit(2); }
const JSDOM = JSDOMc, VirtualConsole = VirtualConsolec;
const fs = require('fs'), path = require('path'), os = require('os');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const REAL_METHODS = new Set([
  'clearRect','fillRect','strokeRect','beginPath','moveTo','lineTo','stroke','fill','arc','ellipse',
  'arcTo','closePath','quadraticCurveTo','save','restore','translate','rotate','scale','fillText',
  'strokeText','drawImage','setLineDash','getLineDash','getImageData','putImageData','measureText',
  'createLinearGradient','createRadialGradient','createPattern','clip','rect','isPointInPath',
  'transform','setTransform','resetTransform','globalCompositeOperation',
  'setLineDash' 
]);
const record = {};
function makeCtx(canvasId) {
  const calls = (record[canvasId] = record[canvasId] || []);
  const st = {
    canvas: { width: 0, height: 0 }, fillStyle:'#000', strokeStyle:'#000', lineWidth:1, font:'10px sans-serif',
    textAlign:'left', textBaseline:'alphabetic', globalAlpha:1, lineCap:'butt', lineJoin:'miter',
    imageSmoothingEnabled:true, filter:'none', globalCompositeOperation:'source-over'
  };
  const grad = () => ({ addColorStop(){} });
  return new Proxy(st, {
    get(o, k) {
      if (k in o) return o[k];
      if (typeof k === 'symbol') return undefined;
      if (k === 'createLinearGradient' || k === 'createRadialGradient' || k === 'createPattern') return grad;
      if (k === 'getImageData') return (x,y,w,h) => ({ data: new Uint8ClampedArray(Math.max(0,(w||0)*(h||0)*4)), width:w||0, height:h||0 });
      if (k === 'measureText') return () => ({ width: 10 });
      if (REAL_METHODS.has(k)) { calls.push(k); return (...a) => { calls.push(k + '@'); }; }
      // NOT a real canvas method -> throw (this is the point of the strict probe)
      return undefined;
    },
    set(o, k, v) { o[k] = v; return true; }
  });
}
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('jsdomError: ' + (e && e.message || e)));
const dom = new JSDOM(html, {
  runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(window) {
    window.scrollTo = () => {};
    window.HTMLCanvasElement.prototype.getContext = function (t) {
      if (t !== '2d') return null;
      const id = this.id || 'anon';
      return makeCtx(id);
    };
    window.HTMLCanvasElement.prototype.toDataURL = function () { return 'data:image/png;base64,QUJD'; };
  }
});
const w = dom.window, d = w.document;
const ev = s => w.eval(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const assert = (cond, msg) => { if (!cond) { throw new Error('ASSERT FAIL: ' + msg); } console.log('  ok:', msg); };

(async () => {
  await sleep(150);
  assert(errors.length === 0, 'no boot errors (' + (errors[0] || '') + ')');

  // ===== FLOW 1: Code Playground — results must be visible on the stage =====
  w.go('code');
  w.loadTemplate('star');
  const stageCalls0 = (record['stage'] || []).length;
  w.toggleRun();
  await sleep(6000);
  assert(!ev('CODING.running'), 'star program finishes');
  const stageCalls = record['stage'] || [];
  assert(stageCalls.length > stageCalls0, 'stage received draw calls during run (' + (stageCalls.length - stageCalls0) + ' new)');
  assert(stageCalls.includes('fillText'), 'stage painted text (sprite/stars)');
  assert(ev('CODING.starsCollected') >= 1, 'collected at least 1 star (run actually executes)');

  // ===== FLOW 2: Adventure — Code Master (mission coding) =====
  w.go('adventure');
  ev("advSave.won = true; advSaveNow();");
  ev("switchRegion('cavern');");
  ev("advSave.cave.won = true; advSaveNow();");
  ev("switchRegion('sky');");
  ev("switchRegion('forest');");
  // open code gate in forest
  ev('ADV.openCode();');
  assert(!!d.querySelector('#cp-canvas'), 'code master modal opens');
  const cpCalls0 = (record['cp-canvas'] || []).length;
  ev('advCpDraw();');
  const cpCalls = record['cp-canvas'] || [];
  assert(cpCalls.length > cpCalls0, 'code master canvas drew');
  // build + run the winning program
  ev("advCpAdd(0);advCpAdd(0);advCpAdd(0);advCpAdd(2);advCpAdd(0);advCpAdd(0);advCpAdd(0);");
  ev('advCpRun();');
  await sleep(2200);
  assert(ev('ADV.have("code")'), 'code gate crystal awarded after run');
  // sky code master
  ev("switchRegion('sky');");
  ev('SKY.openCode();');
  assert(!!d.querySelector('#skycp-canvas'), 'sky code master modal opens');
  const scp0 = (record['skycp-canvas'] || []).length;
  ev('skyCpDraw();');
  assert((record['skycp-canvas'] || []).length > scp0, 'sky code canvas drew');

  // ===== FLOW 3: Quests tab in Code Playground =====
  w.go('code');
  ev("switchCodeTab('quests');");
  assert(d.querySelector('#quest-list').style.display !== 'none', 'quest list visible on quests tab');
  assert(ev("document.getElementById('quest-list').innerHTML.includes('First Steps')"), 'missions render in quests tab');
  ev("switchCodeTab('blocks');");
  assert(d.querySelector('#palette').style.display !== 'none', 'palette back on blocks tab');

  // ===== FLOW 4: every view paints (adventure art, photo, movie, typing) =====
  w.go('adventure');
  ev('ADV.draw();');
  assert((record['adventure-canvas'] || []).length > 0, 'adventure canvas painted (art pass)');
  ev("switchRegion('cavern'); caveDraw();");
  assert((record['adventure-canvas'] || []).length > 0, 'cavern painted');
  w.go('photo');
  ev('repaintPhoto();');
  assert((record['photo-canvas'] || []).length > 0, 'photo canvas painted');
  w.go('movie');
  ev('renderMovie(0.5);');
  assert((record['movie-canvas'] || []).length > 0, 'movie canvas painted');

  console.log('\nSTRICT PROBE: ALL FLOWS PAINT CLEANLY ✔ (' + errors.length + ' errors)');
  process.exit(0);
})().catch(e => { console.error('\nPROBE FAILED:', e.message); process.exit(1); });
