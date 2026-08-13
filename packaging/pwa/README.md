# 📲 Koda as an installable app (PWA)

A Progressive Web App installs like an app (icon on the home screen / taskbar, full window,
works offline) — no app store needed. Koda's `index.html` **already contains** the code that
auto-registers `sw.js` when it's served, so you only need to serve the right files.

## Steps

1. Put these files together in one folder (this is what gets served):

   ```
   index.html          ← copy from the koda/ root
   sw.js               ← this folder
   manifest.webmanifest← this folder
   icon-192.png        ← this folder
   icon-512.png        ← this folder
   ```

2. Serve them over HTTP (PWA + service workers need http(s), not file://):

   ```bash
   cd that-folder
   python3 -m http.server 8080        # or: npx serve
   ```

3. Open http://localhost:8080 — the service worker registers itself (silently skipped if
   `sw.js` is missing, so the plain single-file app still works anywhere).

4. In Chrome/Edge: use the install icon in the address bar → Koda installs as an app.
   On Android Chrome / iOS Safari, "Add to Home Screen".

The `theme-color` and iOS meta tags are already in `index.html`, so installed windows get
the purple accent and hide the browser chrome.
