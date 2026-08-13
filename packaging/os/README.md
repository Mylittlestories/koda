# 🖥️ Launching Koda as a program — or an OS

Because Koda is **one dependency-free HTML file**, it can be launched in more and more
"real" ways over time. Here's the honest map of what's possible today and how.

## Tier 1 — already works (today)

| Goal | How | Files |
|---|---|---|
| **Desktop program** (Win/macOS/Linux) | Electron wrapper; Windows `.exe` + Linux `.AppImage` verified in-repo; macOS via `.github/workflows/build-desktop.yml` | `packaging/electron/` |
| **Installable app / mobile-ish** | PWA: served over HTTP, install from the browser; works offline via service worker | `packaging/pwa/` |
| **Koda Console on Raspberry Pi** | Pi OS Lite + Chromium kiosk that boots straight into Koda — the spiritual heir of Kano OS | `pi-setup.sh` |
| **Koda Kiosk on any Linux** | One command: `bash kiosk.sh index.html` | `kiosk.sh` |

## Tier 2 — very realistic next steps (needs a maintainer + hardware)

- **Official Android APK / iOS app** — wrap with Capacitor; the app logic is already 100% portable.
- **"Koda Edition" Raspberry Pi image** — a pre-built SD-card image (Pi OS Lite + kiosk +
  Koda preinstalled). Tools: Raspberry Pi Imager's custom image support, or `buildroot`.
- **Bundled offline packs** — ship Koda with a local web server binary (e.g. `caddy`) so a
  classroom LAN runs it without internet.

## Tier 3 — the "Koda OS" dream (fun, but honestly overkill)

A true custom operating system (own kernel + bootloader + shell) is not worth building —
even Kano OS was really *Debian Linux with a friendly shell on top*. The Kano experience is
recreated 1:1 by **a Raspberry Pi (or any PC) booting into a kiosk that only shows Koda**.
That's a 30-minute job with the scripts here, runs on a €15 Pi Zero 2 W, and gives kids the
same "this whole computer is mine" feeling.

> **Offline-first by design:** Koda has zero network dependencies, so a Koda Console
> (Pi + kiosk, no Wi-Fi even) works perfectly forever — ideal for schools.
> The sound effects are synthesized in the browser (WebAudio) — no audio files needed.

## Kiosk tips

- `--autoplay-policy=no-user-gesture-required` lets Koda's sounds play without requiring a
  click first (great for kiosks and the Movie Studio's self-playing export).
- On the Pi, `unclutter` hides the mouse cursor when idle.
- Fullscreen + a $5 USB keyboard is a complete kid-friendly setup.
- Exit a kiosk: `Ctrl+Alt+F2` (Pi script) or restart the browser process.

## "Will it ever be possible?"

**Yes — and it already partially is.** The desktop app wrapper works today; a bootable
Koda Console image is a weekend project for anyone with an SD card; a mobile app is a
standard Capacitor build. The only thing that doesn't make sense is a from-scratch kernel.
Everything about Koda (single file, no dependencies, offline-first, synthesized sound)
was designed so this escalation stays easy.
