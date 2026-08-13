#!/usr/bin/env bash
# Koda release script — build & verify everything locally, one command.
# Usage:  bash scripts/release.sh
# Needs:  node, python3; optionally wine (Windows installer) and xvfb (headless Electron test).
set -e
cd "$(dirname "$0")/.."

echo "▶ 1/4 Syntax check"
python3 - <<'PY'
import re
html = open('index.html', encoding='utf-8').read()
m = re.search(r'<script>(.*)</script>', html, re.S)
open('/tmp/app.js', 'w', encoding='utf-8').write(m.group(1))
PY
node --check /tmp/app.js && echo "   syntax OK"

echo "▶ 2/4 Behavior smoke test (50+ assertions)"
npm install jsdom --no-fund --no-audit >/dev/null 2>&1 || true
node docs/smoke-test.js

echo "▶ 3/4 Build installers"
cd packaging/electron
rm -rf app dist
node prepare.js
npx electron-builder --linux AppImage --linux deb
if command -v wine >/dev/null 2>&1; then
  npx electron-builder --win nsis
else
  echo "   wine not found — skipping Windows build (CI builds it for you)."
fi

echo "▶ 4/4 Done"
echo "   Artifacts: packaging/electron/dist/"
echo "   Next:      git tag v1.0.0-beta.1 && git push origin v1.0.0-beta.1"
