# Koda — Architecture

Koda is deliberately **one self-contained HTML file**. No build step, no package manager, no network requests. This keeps it forkable, auditable, and runnable from a USB stick — very much in the spirit of Kano.

## How the file is organized

Inside `index.html` everything lives in three layers, in order:

1. **`<style>`** — the design system: CSS variables for the palette (`--violet`, `--pink`, …), the two themes (day / night via `body.night`), and the playful rounded-card look.
2. **Static HTML** — header/nav, the nine `<section class="view">` screens (home, code, photo, movie, learn, practice, adventure, projects, settings), modal & toast roots.
3. **`<script>`** — plain ES2017+ JavaScript, organized into modules separated by banner comments:

| Module | Purpose |
|---|---|
| `core` | `store` (safe localStorage wrapper with in-memory fallback), app `state`, `beep()` WebAudio synth, `toast`, `openModal`, XP/levels/badges, router (`go()`), home dashboard, settings |
| `CODING` | block definitions (`BLOCKS`), palette & program UI, drag-to-reorder, code preview generator, stage/sprite/pen renderers, async interpreter with `repeat`/`end` loop stack and `ifNearStar`/`endIf` condition skipping, star-collection physics |
| `QUESTS` | guided coding missions (`MISSIONS`), quest tab UI, `checkQuests()` called after every program run |
| `PHOTO` | image loading (file or generated sample), canvas pixel filters, brush/eraser layers, sticker & text layers, undo/redo snapshots, gallery, PNG export |
| `MOVIE` | animated scene library (`SCENES`), timeline model, overlay track, real-time player, `MediaRecorder` webm export |
| `PRACTICE` | three drills: `TYPING` (canvas falling-words), `MATH` (DOM quiz sprint), `MEMORY` (Simon pads) — plus the `PRACTICE` hub router |
| `BRAIN` | true/false fact-card game (modal flow, XP) |
| `DAILY` | `CHALLENGES` rotation by day-of-year, `claimDaily()`, `updateStreakNow()` streak tracker |
| `PROJECTS` | `.koda` share format: `exportProject()` (packs code + movie + photo), `importProject()` / `applyProjectData()` (validates + loads), `photoProjectData()`, `loadDemoProject()` |
| `ADVENTURE` | Koda Forest: 18×13 tile map (`ADV_MAP0`, BFS-verified connected), derived entity positions (stones/music/lanterns/apples/squirrel scanned from the map), 5 crystal puzzles + 2 side quests (lanterns, apples), procedural canvas rendering (trees, pond, gate, shadows, vignette), state persisted under `koda.adventure`, `adventureKeyHandler` input |
| `GALLERY` | My Projects library (`state.lib`, max 10): `addToLibrary()` hooks every export and snapshots a `thumb` (code/movie/photo preview via `makeThumb()`), cards with type chips, open/re-save/delete, plus 8 `SHOWCASE` samples and photo generators (`makePostcardData()`, `makeGardenData()`) |
| `SYSTEMS` | `autosaveWorkspace()`/`restoreWorkspace()` (debounced, `koda.workspace`, on tab close; photo state includes pixel dataURLs with a 1.5 MB guard that strips pixels when too big), 15s state autosave, and `MUSIC` — procedural WebAudio soundtrack with **per-region patterns** (`home`/`forest`/`cavern`/`movie`, switched in `go()` and `switchRegion()`) |
| `ZIP` | dependency-free ZIP writer (`buildZip`, store method + CRC32) and `buildGalleryZip()`/`exportGalleryZip()` packing projects + gallery photos into a `.zip` |
| `CAVE` | Crystal Caverns: second region with its own map (`CAVE_MAP0`, BFS-verified), rune/bridge/glow puzzles, bridge-as-lock mechanic, persisted under `advSave.cave` |
| `SKY` | Sky Temple: third region (`SKY_MAP0`, BFS-verified), star-stone trail, harder cloud-code maze (`SKY_CP_*`), Sky Owl quiz, gate locked until 3 gems, Golden Feather win, persisted under `advSave.sky` |
| `LEARN` | lesson content (data), page/quiz modal flow, progress tracking |
| `BOOT` | event wiring, streak init, PWA service-worker probe, initial render |

## Key design decisions

- **Single source of truth:** all persistent state lives in `state` (a JS object mirrored to `localStorage` under `koda.state`). `saveState()` is called whenever it changes. New features add keys to `DEFAULTS` (e.g. `missions: {}`, `typingBest`, `streak`).
- **Storage fallback:** sandboxed iframes block `localStorage`, so `store` probes it once and silently falls back to an in-memory object. The app never crashes without storage.
- **Canvas everywhere:** the stage, photo editor, movie player and typing game all use `<canvas>` 2D contexts, so no media assets are needed — the sample photo, sparkle particles, and all six movie scenes are procedurally drawn.
- **The block interpreter is a tiny loop engine:** blocks are flat data; `repeat` pushes `{left, origin}` onto a stack and the matching `end` decrements it; `ifNearStar` skips to its matching `endIf` when the condition is false (depth-counted, so conditions can nest). Programs stay trivial to save/serialize.
- **Games are stateless until started:** each Practice game's shell re-renders only when idle, so navigating between views doesn't destroy an active round.
- **Downloads & export:** PNG via `canvas.toDataURL`, video via `captureStream(30)` + `MediaRecorder` (webm). Both wrapped in try/catch with friendly toasts so restricted iframes degrade gracefully.
- **PWA-ready:** `index.html` probes for `sw.js` once (silently, http(s) only) and registers it when present — see `packaging/pwa/`.

## How to extend

- **Add a block:** add an entry to a category in `BLOCKS` (e.g. control: `ifNearStar`/`endIf`), a branch in the interpreter loop, and a line in `codeLines()` for the preview. Everything else (palette, program UI, drag/reorder, missions) is automatic.
- **Add a mission:** append to `MISSIONS` with a `check(program, outcome)` predicate. It appears in the Quests tab and can drive a badge.
- **Add a movie scene:** add an object to `SCENES` with a `draw(ctx, t, dur)` function.
- **Add a lesson:** append to `LESSONS` (3 pages + 3 quiz items). Cards, modal flow and XP are generic. Add a badge predicate in `BADGES` if you like.
- **Add a practice game:** create a module + a `<div id="game-...">` shell + a tab in `#practice-tabs` + a branch in `PRACTICE.open`.
- **Add a badge:** append to `BADGES` with a `need()` predicate.

## Testing

```bash
npm install jsdom            # dev-only dependency (the app itself has none)
node docs/smoke-test.js      # boots the app, drives every module, asserts behavior
```

`docs/smoke-test.js` stubs `HTMLCanvasElement` (jsdom has no real canvas) and verifies: clean boot, navigation, block templates + execution + XP, workspace auto-save + restore, music toggling, the full Koda Forest (BFS, side quests, all puzzles), the full Crystal Caverns (region lock, map BFS with bridge-as-lock, rune/bridge/glow puzzles, heart victory + badge), the project gallery (thumbs, 8 showcase items, photo data), movie playback, lessons, and settings — 50+ assertions.
