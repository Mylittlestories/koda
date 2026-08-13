# Changelog

## 1.0.0-beta (2026-08-13) · © DRVsoft
**Core**
- Code Playground: snap blocks, loops, `if near a star`, live stage, real-JS preview, 10 missions, 5 templates
- Photo Lab: paint/erase, stickers, text, 9 filters, undo/redo, gallery, PNG export
- Movie Studio: 6 animated scenes, timeline, text overlays, `.webm` export (native save dialog in desktop)
- Knowledge Quest: 11 lessons + quizzes, Brain Cards
- Practice Zone: Typing Hero, Math Sprint, Pattern Master
- Adventure: **Forest → Crystal Caverns → Sky Temple** (3 regions, 13 puzzles + side quests)

**Learning**
- **Concept system**: solving puzzles & finishing lessons unlocks 8 concepts (Sequencing, Patterns, Debugging…) with explainer cards + a Learning Log in Settings
- **Hints** on every puzzle modal
- "What you'll learn here" per region

**Systems**
- **Auto-save**: code/movie/photo (incl. photo *pixels*, size-guarded) + 15s state flush + tab-close save
- **Per-region enchanted music** (WebAudio, 5 patterns, toggle)
- **Storage safety**: quota-aware store, auto-trim of old gallery photos under pressure, storage status + warning banner
- Bug-report helper (Settings)

**Quality**
- Fixed stage redraw bug (was redrawing 60fps forever → battery drainer)
- Accessibility: skip link, ARIA labels, aria-live regions, focus-visible, prefers-reduced-motion
- Mobile preparations: touch-friendly D-pad, tap-target sizing
- **Procedural art pass** on the forest (drawn trees/fox/gate, animated terrain) — regions share art helpers

**Packaging**
- Electron: Windows `.exe`, Linux `.AppImage`/`.deb` (verified), native Save dialog
- PWA (offline), kiosk + Raspberry Pi scripts
- **Real git repository** initialized (this repo)

**Framing**
- Rebranded to "Kano-*inspired*" (honest: independent prototype, not affiliated)

**Testing**
- 50+ smoke-test assertions (node + jsdom), zip validated independently, Electron self-check
