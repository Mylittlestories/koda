# Changelog

## 1.0.0-beta.2 (2026-08-13) · © DRVsoft — bug-fix release

**Critical fix: visitors were stuck on the old version**
- The PWA service worker was **cache-first** with a never-bumped cache (`koda-v1`): browsers
  that visited once kept being served the *old* app.html forever, so the vector-rendering
  fixes never reached them. Symptoms: "the bug is still there" despite the deploy.
- **New SW: pages are network-first** (always fetch the newest app when online; cache is
  only an offline fallback) and the cache is bumped to `koda-v2` (old caches auto-deleted).
- Verified in a real browser: install old SW → cache old app → deploy new app+SW → revisit
  shows the **new** app. Offline fallback preserved.
- Added a visible **version (v1.0.0-beta.2)** in the About box + `window.KODA_VERSION` so you
  can confirm which build you're on.

**Fixed (found via a real-browser pixel test suite)**
- **Code Playground stage now works without emoji fonts**: stars and the fox are drawn as
  vector shapes (was 100% emoji glyphs — on devices without a color-emoji font the results
  were invisible). Verified by pixel-analysis in real Chromium: sprite + stars render
  regardless of fonts.
- **Adventure "Code Master" puzzle (both Forest and Sky Temple) now works without emoji
  fonts**: the goal star and the robot are vector-drawn, so the puzzle is always visible.
- **Star Champion mission retuned 6 → 4 stars** (6 in a single run was practically
  unachievable).
- Added **emoji-font detection** — on devices missing emoji fonts, Koda shows a one-time
  friendly tip (core gameplay no longer depends on them).
- Minor cleanup in the forest art pass.

**Testing upgrades**
- New `docs/strict-probe.js`: runs every view + puzzle with a *strict* canvas stub that
  throws on any non-2D-API method call, and asserts every canvas actually painted.
- New `packaging/electron/test-real.js`: drives the app in real Chromium (Electron) and
  checks actual canvas pixels (sprite/stars/robot visible), flow completion, and console
  errors. All checks green.

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
