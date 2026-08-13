# 🐞 Koda Beta Test — 1.0.0-beta

> **© 2026 DRVsoft** · Tested build: `index.html` (beta) · app size ~227 KB
> Last automated pass: **50 smoke-test assertions, 0 console errors** (see `docs/smoke-test.js`)

This is the beta-testing plan for Koda. It combines an **automated pass** (already run) with a
**manual checklist** for human testers, plus the bug-report format.

---

## 1. Automated testing (already passing ✅)

| Area | What was verified |
|---|---|
| Boot | clean load, no console errors, nav renders 9 items |
| Code | templates, block add/reorder/delete, `if/endIf` execution, missions, XP |
| Auto-save | code/movie/photo saved + restored; photo *pixels* saved; 1.5 MB size guard |
| Music | 5 region patterns (home/forest/cavern/movie/sky), toggling, region switching |
| Adventure | Forest (map 18×13 BFS, key, 5 crystals, side quests, gate) |
| Adventure | Caverns (region lock, bridge-as-lock BFS, runes/bridge/glow, Heart) |
| Adventure | **Sky Temple (new)** (region lock, map BFS, star stones, cloud-code maze, owl quiz, gate + Golden Feather) |
| Projects | `.koda` export/import, thumbnails, 8 showcase items, **`.zip` export validated by Python `zipfile`** |
| Photo / Movie / Learn / Practice | filters, playback, 11 lessons + quizzes, typing/math/memory games |
| Copyright | About box shows "© 2026 DRVsoft" |

Run it yourself:

```bash
npm install jsdom          # dev-only
node docs/smoke-test.js    # 50 assertions, exits 0 on success
```

## 2. Manual test checklist (humans!)

Pick your browser (Chrome / Edge / Firefox / Safari on desktop, Chrome/Safari on phone) and
mark each: ✅ works · ⚠️ glitch · ❌ broken. **Especially test the things automation can't.**

### Core loop
- [ ] XP increases after running a program / finishing a quiz / solving a puzzle
- [ ] Close the tab mid-edit, reopen → auto-saved code/movie/photo come back
- [ ] Night mode + sound + music toggles persist after reload

### 🎮 Code Playground
- [ ] Star Catcher template runs and collects stars
- [ ] `if near a star` block: add Smart Robot template, run it
- [ ] Peek at the real code panel shows valid JavaScript
- [ ] All 10 missions complete by building the described programs

### 🗺️ Adventure (the big one)
- [ ] Forest: find key 🔑, solve all 5 crystal puzzles + 2 side quests, open Grand Gate
- [ ] Caverns unlock after forest; bridge puzzle is the *only* crossing
- [ ] **Sky Temple** unlocks after caverns; star stones, cloud-code maze, owl, Golden Feather 🪶
- [ ] Movement works with arrow keys AND the on-screen D-pad AND WASD
- [ ] **Music changes per region** (forest = bright, caverns = deep, sky = airy)
- [ ] Progress persists after refresh (gems, opened gates)

### 🎨 Photo Lab
- [ ] Upload a photo; paint, stickers, text, filters all work
- [ ] Undo/redo behave; export PNG downloads
- [ ] **Close tab with a half-edited photo → pixels restored** (not just layers)

### 🎬 Movie Studio
- [ ] Build a 3-scene movie, add overlay text, play it
- [ ] Export .webm (browser) or Save-dialog (desktop app)
- [ ] Long movies (>60s) are politely rejected

### 💾 Projects
- [ ] Export a project → appears in My Projects with a thumbnail
- [ ] Open / re-save / delete a library entry
- [ ] Load 2+ showcase items
- [ ] **📦 Export all (.zip)** → open the .zip, all files inside and valid

### 🖥️ Desktop app (packaging/electron)
- [ ] `npm start` runs the app; window opens full-size
- [ ] Movie export opens a **native Save As** dialog
- [ ] Installer builds: `.exe` (Windows), `.AppImage` + `.deb` (Linux)

## 3. Bug report format

Use the in-app button (Settings → **🐞 Report a bug**) which pre-fills this, or copy:

```
Koda Beta Report
Browser/OS: <user agent>
View: <which screen> · XP: <number> · Version: 1.0.0-beta
1. What happened:
2. What you expected:
3. Steps to reproduce:
4. Screenshot/notes:
```

Send to the team (email / GitHub issue). Include the device + browser — most bugs are
browser-specific.

## 4. Known limitations (accept for beta)

- Sandboxed iframe previews (like some file viewers): no `localStorage`, no downloads, no
  video export — Koda detects this and falls back gracefully. **Test in a real browser tab.**
- Audio/music starts after the first tap/keystroke (browser autoplay policy).
- Video export (.webm) needs Chrome/Edge/Firefox; Safari may fall back to browser download.
- `.koda` projects with huge photos are excluded from auto-save pixels when over the 1.5 MB guard.

## 5. What we're asking beta testers

1. Play the **Sky Temple** (new region) and the whole adventure arc.
2. Try the **.zip export** and **auto-save restore** — the newest systems.
3. Report anything that feels broken, confusing, or unfriendly for a 8–12 year old.
4. Note performance on low-end devices/phones.
