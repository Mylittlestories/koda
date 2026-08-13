const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const path = require('path');
const landing = fs.readFileSync(path.join(__dirname, '..', 'landing.html'), 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(e.message));

function boot(url) {
  const dom = new JSDOM(landing, { runScripts: 'dangerously', url, virtualConsole: vc });
  return dom.window;
}
(async () => {
  // 1) deployed layout: served as root -> play buttons point to ./app.html
  const w1 = boot('https://example.github.io/koda/');
  await new Promise(r => setTimeout(r, 50));
  const href1 = w1.document.getElementById('play-btn').getAttribute('href');
  console.log('deployed-root play href:', href1, href1 === './app.html' ? 'OK' : 'FAIL');
  if (href1 !== './app.html') process.exit(1);
  const gh = w1.document.getElementById('gh-link').href;
  console.log('gh link on github.io:', gh, gh === 'https://github.com/example/koda' ? 'OK' : 'FAIL');
  if (gh !== 'https://github.com/example/koda') process.exit(1);

  // 2) local layout: landing.html next to index.html -> play points to ./index.html
  const w2 = boot('file:///home/user/koda/landing.html');
  await new Promise(r => setTimeout(r, 50));
  const href2 = w2.document.getElementById('play-btn-2').getAttribute('href');
  console.log('local play href:', href2, href2 === './index.html' ? 'OK' : 'FAIL');
  if (href2 !== './index.html') process.exit(1);

  console.log('landing errors:', errors.length ? errors : 'none ✔');
  if (errors.length) process.exit(1);
  console.log('LANDING TESTS PASSED ✔');
  process.exit(0);
})();
