# 🖥️ Koda Desktop App

Koda becomes a **real desktop program** — a window, an app icon, full offline use,
working `localStorage` and working file downloads (PNG / `.koda` / movie export) — with a
tiny Electron wrapper, because the whole app is one dependency-free HTML file.

> ✅ **Verified in this repo:** `Koda-1.0.0.AppImage`, `koda-desktop_1.0.0_amd64.deb` and
> `Koda Setup 1.0.0.exe` (cross-built with wine) all build; the Linux binary renders all
> 9 views, 11 lessons, 10 missions, the adventure map and `desktopBridge:true` via the
> `KODA_TEST` self-check. All installers are **fully self-contained** (Electron bundles
> Chromium + Node; the app has zero runtime dependencies) — offline, no downloads at install.

## Run it (dev)

```bash
cd packaging/electron
npm install
npm start
```

## Build installers (Windows .exe / Linux .AppImage + .deb)

macOS is out of active scope (it needs a Mac to build); the CI workflow builds Windows + Linux on every version tag.

```bash
cd packaging/electron
npm run dist          # runs prepare.js (copies index.html + logo into app/) then builds
```

Builds land in `packaging/electron/dist/` (e.g. `Koda-1.0.0.AppImage` on Linux).
Requires Node.js 18+.

## Native save dialogs (movie export & more)

`preload.js` exposes `window.koda.saveBlob(bytes, filename)` over a context-isolated IPC bridge.
`main.js` answers it with a native **Save As** dialog. The app's `downloadBlob()` detects the
bridge, so **movie exports (.webm), PNG art, gallery images and `.koda` projects all save
through the real system dialog** in the desktop app (and still use browser downloads on the web).

## Self-test (used by CI / this repo's verification)

```bash
npm test              # = prepare.js + KODA_TEST=1 electron . --no-sandbox
```

Prints `KODA_TEST_RESULT { ... }` with the rendered page's title, view count, lesson and
mission counts, and a canvas check — then exits 0. On headless Linux run it under
`xvfb-run -a` and add `--disable-gpu`; the app itself never needs these flags.

## How it's wired

- `prepare.js` copies the single-file app (`index.html`) and the mascot logo into
  `app/`, so electron-builder packs a fully self-contained bundle (`files: ["main.js", "app/**"]`).
- `main.js` resolves files in both layouts: packaged (`app/index.html` inside the asar)
  or dev (`../../index.html`).
- `contextIsolation` and `sandbox` stay on — no preload needed.
- The `KODA_TEST` hook in `main.js` is inert unless `KODA_TEST=1` is set.
- Kids' mode tip: launch with `--kiosk` or use the OS kiosk scripts in `packaging/os/`.
- `.gitignore` keeps `node_modules/`, `dist/` and the generated `app/` out of version control.
