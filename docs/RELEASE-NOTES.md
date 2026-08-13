# 🦊 Koda v1.0.0-beta — Release Notes

> © 2026 DRVsoft · This is the copy-paste description for the GitHub Release.
> It's written to work as the release body on GitHub **and** as a standalone announcement.

---

## Koda 1.0.0-beta — learn by making

**Koda** is a friendly, **open-source, Kano-inspired** learning playground for curious minds
(~7–13). Snap together code blocks, explore a three-world adventure, edit photos, direct
little movies, and pick up real computer-science ideas along the way — all in one
dependency-free file that runs in any browser, offline, with nothing tracked and nothing to install.

> 🧪 **This is a beta.** We want your feedback — see [How to report](#-how-to-report) below.

### ✨ What's inside

| World | What you can do |
|---|---|
| 🎮 **Code Playground** | Snap blocks (motion, looks, pen, control, sound), loops + conditionals, a live stage, 10 guided missions, 5 templates, and a real-JavaScript preview |
| 🗺️ **Adventure** | Three regions — **Koda Forest** → **Crystal Caverns** → **Sky Temple** — 13 puzzles + side quests, each teaching a concept |
| 🎨 **Photo Lab** | Paint, stickers, text, 9 filters, undo/redo, gallery, PNG export |
| 🎬 **Movie Studio** | 6 animated scenes, timeline, text overlays, real `.webm` video export |
| 🧠 **Knowledge Quest** | 11 illustrated lessons + quizzes, Brain Cards fact game |
| 🎯 **Practice Zone** | Typing Hero, Math Sprint, Pattern Master |
| 💾 **My Projects** | Save creations as `.koda` files, thumbnails, 8 showcase samples, **export-all as `.zip`** |

### 🧠 Built for learning
- **Concept system** — solving puzzles & finishing lessons unlocks 8 concepts (Sequencing,
  Patterns, Debugging, Logic, Memory, Sound, Programming basics, Knowledge check) with a
  Learning Journal on the Home page and "Learn more" links into the matching lesson.
- **💡 Hints** on every puzzle — designed to teach, not just give answers.
- **Auto-save** — code, movie timeline and photo edits (including photo pixels, size-guarded)
  survive closing the tab.
- **Per-region enchanted music**, streaks, daily challenges, XP + 21 badges.

### 🛠️ Systems & quality
- Fixed the stage redraw bug (was redrawing at 60 fps forever — battery drainer).
- **Storage safety**: quota-aware saves, auto-trim under pressure, storage status + warning banner.
- **Accessibility pass**: skip link, ARIA labels, `aria-live` regions, focus-visible,
  `prefers-reduced-motion` support.
- Mobile-friendly preparations (touch D-pad, tap targets).

### 📦 Downloads
- **Windows** — `Koda Setup 1.0.0.exe` (installer, self-contained)
- **Linux** — `Koda-1.0.0.AppImage` + `koda-desktop_1.0.0_amd64.deb`
- **Web** — play instantly at the project Pages URL (works offline after first visit)
- **Source** — single `index.html` (~270 KB), MIT licensed

### 🖥️ Ways to run it
- Open `index.html` in any modern browser — that's it.
- Install as a **desktop app** (see the installers above) — gets a native Save dialog for exports.
- Install as a **PWA** from the web build.
- Put `index.html` on a USB stick — it's fully portable.

### 🧪 Known limitations (beta)
- Safari: video export falls back to a browser download (no .webm capture).
- Sandboxed previews (some file viewers): no localStorage / downloads — open in a real tab.
- Audio starts after the first tap/keystroke (browser autoplay rules).
- Mobile is **prepared for**, not fully supported yet (keyboard games need a keyboard).

### 🐞 How to report
1. In the app: **Settings → 🐞 Report a bug** — it pre-fills a report (browser, screen, steps) you can copy and send.
2. Or open a **GitHub Issue** with the same info.
3. Or use the **tester feedback form** (3 quick questions) — see `docs/BETA-INVITE.md`.

### 🙏 Thank you
Thanks to everyone beta-testing, and to **Kano Computing** for inspiring this project.
Koda is an independent, fan-made project — not affiliated with Kano.

**© 2026 DRVsoft** · MIT License

---

## Paste-ready (GitHub release body)

<details>
<summary>Click to copy</summary>

```markdown
## Koda 1.0.0-beta — learn by making

A friendly, open-source, **Kano-inspired** learning playground for curious minds (~7–13).
One dependency-free file: snap-code games, a 3-world adventure, photo lab, mini movies,
11 lessons — nothing tracked, nothing to install.

**Worlds:** Code Playground · Adventure (Forest → Caverns → Sky Temple) · Photo Lab ·
Movie Studio · Knowledge Quest · Practice Zone · My Projects (.koda + .zip export)

**Learning:** concept system with Learning Journal + hints · auto-save · per-region music ·
XP, streaks, daily challenges, 21 badges

**Downloads:**
- Windows: `Koda Setup 1.0.0.exe`
- Linux: `Koda-1.0.0.AppImage` · `koda-desktop_1.0.0_amd64.deb`
- Web: play at the project Pages URL · Source: `index.html` (MIT)

**Beta:** please report bugs via Settings → 🐞 Report a bug or GitHub Issues.
Mobile is prepared-for, not fully supported; Safari video export falls back to download.

© 2026 DRVsoft — Kano-inspired, independent, not affiliated with Kano.
```
</details>
