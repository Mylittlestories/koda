# 🌐 GitHub Setup & First Release — copy‑paste guide

> © 2026 DRVsoft · The repo is **already a real git repository** locally (2 commits).
> This page gets it on GitHub and releases v1.0.0 — CI runs the smoke test and builds
> installers automatically. Everything below is copy‑paste, in order.

---

## 0. Prereqs (once)

```bash
# git identity (if not set)
git config --global user.name "DRVsoft"
git config --global user.email "you@drvsoft.example"

# GitHub CLI (recommended) — https://cli.github.com
gh auth login
```

---

## 1. Create the repo + push (one command)

From inside `~/koda` (the repo root):

```bash
# Option A — create on GitHub AND push in one shot (gh CLI):
gh repo create koda --public --source . --push

# Option B — repo already created on github.com (web UI):
git remote add origin https://github.com/<YOU>/koda.git
git branch -M main
git push -u origin main
```

Verify: `git log --oneline` shows your 2 commits; GitHub shows the files.

---

## 2. Enable GitHub Pages (free web hosting of the app)

1. GitHub → repo → **Settings → Pages** → *Source*: **GitHub Actions** (not branch).
2. Push to `main` → the `deploy-pages.yml` workflow auto-deploys the site to
   `https://<YOU>.github.io/koda/` — the **landing page** is the root (`landing.html`),
   and the app itself lives at `https://<YOU>.github.io/koda/app.html` (the Play buttons
   point there automatically).
3. First deploy takes ~1 min. The page is the full app (works offline via `sw.js`).

> The PWA manifest + icons + service worker are copied into the deploy automatically (and patched to point at `app.html`).

---

## 3. Tag a release → CI builds installers + runs the smoke test

```bash
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1
```

`.github/workflows/build-desktop.yml` fires on `v*` tags:
- **Windows**: `Koda Setup 1.0.0.exe` (NSIS)
- **Linux**: `Koda-1.0.0.AppImage` + `koda-desktop_1.0.0_amd64.deb`
- Runs `node docs/smoke-test.js` (50+ assertions)
- On tag pushes it **auto-creates a GitHub Release** with the installers attached

Watch it live: repo → **Actions** tab → green checkmark = done.

---

## 4. Alternative: build everything locally (no CI needed)

```bash
bash scripts/release.sh
```

Runs: syntax check → smoke test → installers into `packaging/electron/dist/`
(Windows build is skipped automatically if `wine` isn't installed).

---

## 5. Publish a Release manually (if you prefer)

```bash
# after CI finished:
gh release create v1.0.0-beta.1 --title "Koda 1.0.0-beta" \
  --notes "Kano-inspired learning playground. Installers + source. (c) 2026 DRVsoft"

# attach any local artifacts too:
gh release upload v1.0.0-beta.1 \
  packaging/electron/dist/*.exe packaging/electron/dist/*.AppImage packaging/electron/dist/*.deb
```

---

## 6. Post‑release checklist

- [ ] Web app live at `https://<YOU>.github.io/koda/`
- [ ] Release page has `.exe`, `.AppImage`, `.deb` + source zip
- [ ] `README.md` badges (build status, release) added — see below
- [ ] Bump version + CHANGELOG for the next release

Add README badges once the repo is public:

```markdown
[![Build](https://github.com/<YOU>/koda/actions/workflows/build-desktop.yml/badge.svg)](https://github.com/<YOU>/koda/actions)
[![Pages](https://github.com/<YOU>/koda/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/<YOU>/koda/actions)
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `git push` rejected (non‑fast‑forward) | `git pull --rebase origin main` then push again |
| Actions tab empty | Enable Actions in repo settings; run the workflow manually via **Actions → workflow → Run workflow** |
| Pages shows 404 | Settings → Pages → Source = **GitHub Actions**; re‑run `deploy-pages` workflow |
| Windows build fails on Linux | Needs `wine` (`sudo apt-get install wine64 wine32:i386`); or just let CI build it |
| Release not created on tag | Check the job log — the release step needs `contents: write` permission (already set) |
| Beta tester can't open the web app | Make sure the repo is **public** (private Pages need a paid plan) |
