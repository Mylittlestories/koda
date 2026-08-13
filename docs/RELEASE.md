# 🚀 Koda 1.0 — Release Plan

> © 2026 DRVsoft · Status: **beta** (1.0.0-beta) · App: single self-contained `index.html` (~227 KB, zero dependencies)

## Your options for this release

### A. What to ship (pick any combination)
1. **Web app** — host `index.html` anywhere. Zero cost, instant updates, works on any device.
2. **Desktop installers** — Windows `.exe`, Linux `.AppImage` + `.deb` (already verified in-repo).
   macOS `.dmg` needs a Mac (or CI). All are **fully self-contained** (offline, no downloads at install).
3. **PWA** — installable from the browser, works offline (files in `packaging/pwa/`).
4. **Raspberry Pi "Koda Console"** — boot a Pi straight into Koda (`packaging/os/pi-setup.sh`).
5. **Portable** — the single HTML file on a USB stick. Truly zero-install.

### B. How to proceed (recommended path)
```
1. Beta (now)     → fix bugs from docs/BETA-TESTING.md
2. Release candidate → tag v1.0.0 → GitHub Actions builds all installers + runs smoke test
3. v1.0.0         → publish: GitHub Release (installers + source) + web host + PWA
4. Post-launch    → CHANGELOG, feedback channel, roadmap items
```

### C. Where to distribute
| Channel | What | Cost | Best for |
|---|---|---|---|
| **GitHub Releases** | `.exe`, `.AppImage`, `.deb`, source, `.koda` samples | free | Developers, self-hosters, the obvious home of an open-source project |
| **GitHub Pages** | the web app at `https://<you>.github.io/koda/` | free | Zero-friction "play now" link |
| **Netlify / Cloudflare Pages** | web app + automatic PWA/HTTPS | free tier | Nicer URLs, easy deploys |
| **itch.io** | web + desktop builds, ratings, community | free | Reaching kids/indie-games audience |
| **Raspberry Pi / schools** | Koda Console image | free | Education (Kano's audience) |
| **Microsoft Store** *(optional later)* | MSIX installer | needs cert | Windows families — skip for v1 |

### D. Where to build
| Target | Where | Notes |
|---|---|---|
| Windows `.exe` | this repo: `npx electron-builder --win nsis` (wine on Linux) **or** GitHub Actions `windows-latest` | verified both ways |
| Linux `.AppImage` / `.deb` | Linux locally or CI `ubuntu-latest` | verified in-repo |
| macOS `.dmg` | **must be a Mac** (or GitHub Actions `macos-latest`) | add one line to the CI matrix when ready |
| Web/PWA | any static host | `python3 -m http.server` to test locally |
| Pi image | local `pi-setup.sh`, or pre-bake with Raspberry Pi Imager | see `packaging/os/` |

### E. Release checklist (before v1.0.0)
- [ ] Beta feedback triaged; critical bugs fixed
- [ ] `node docs/smoke-test.js` → 50+ assertions green
- [ ] Version bumped to `1.0.0` (package.json + About box)
- [ ] CHANGELOG.md written
- [ ] Tag `v1.0.0` → CI builds Windows + Linux installers automatically
- [ ] Upload artifacts + source to GitHub Release
- [ ] Deploy web build to Pages/Netlify
- [ ] Add install instructions to README (per platform)
- [ ] Decide feedback channel (GitHub Issues recommended)

### F. Nice-to-haves for launch
- A real email for the bug-report button + `drvsoft@example.org` placeholders replaced
- Code-signing certs for Windows/macOS (removes "unknown publisher" warnings) — optional, costs money
- A short "What's new in 1.0" video/animated GIF
- Teacher guide PDF
