# Contributing to Koda

Thanks for wanting to make Koda friendlier! 🦊 Koda is a small, human-scale project — everything is one file, so a one-line fix can help a lot of kids.

## Ways to contribute

- **Add a block, scene, lesson, filter or badge** — all data-driven; see `docs/ARCHITECTURE.md` for exactly where.
- **Fix a bug** — open an issue first if unsure, or just send the fix.
- **Improve the look** — the design system lives in the top `<style>` block (CSS variables).
- **Write documentation** — this file, the README, the architecture notes.
- **Test** — run the smoke test on new browser versions and report breakage.

## Getting started

```bash
git clone <your-fork-url> koda
cd koda
open index.html            # or: python3 -m http.server 8000
```

## Code style

- Plain ES2017+. No frameworks, no build step, no external assets — keep it that way.
- One blank-line-separated section per module, with a banner comment.
- Prefer readable names and short comments; the audience includes 10-year-olds who read the code!
- All user-facing strings: simple, encouraging, no jargon. Avoid sarcasm and negativity (Koda's voice is "cheerful mentor").
- Accessibility: keep buttons big, colors high-contrast, and never rely on color alone (icons + text).

## Before you open a pull request

1. Make sure the app still boots with zero console errors:
   ```bash
   node --check /tmp/app.js   # after extracting the <script> block
   ```
2. Run the behavior smoke test (node + jsdom):
   ```bash
   npm install jsdom
   node docs/smoke-test.js
   ```
3. If you changed user-visible behavior, add or update an assertion in `docs/smoke-test.js`.
4. Describe what you changed and why, and attach a short screenshot if it's visual.

## Reporting issues

Include: which browser/device, what you did, what you expected, and what happened. Screenshots help a lot. Progress/privacy note: Koda stores everything locally in the browser — clear the site's `localStorage` to reproduce "fresh start" bugs.

## License

By contributing you agree that your work is licensed under the same **MIT** license as the project (© 2026 DRVsoft).
