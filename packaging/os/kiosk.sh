#!/usr/bin/env bash
# Koda Kiosk — run Koda fullscreen on any Linux with Chromium.
# Usage:  bash kiosk.sh [path/to/index.html]
# Tip:    combine with a lightweight window manager or tty to make a Koda console.
set -e

HTML="${1:-$PWD/index.html}"
if [ ! -f "$HTML" ]; then
  echo "index.html not found at: $HTML"
  echo "Usage: bash kiosk.sh [path/to/index.html]"
  exit 1
fi

if command -v chromium >/dev/null 2>&1; then CHROME=chromium
elif command -v chromium-browser >/dev/null 2>&1; then CHROME=chromium-browser
elif command -v google-chrome >/dev/null 2>&1; then CHROME=google-chrome
else
  echo "Chromium is required: sudo apt-get install -y chromium-browser"
  exit 1
fi

exec "$CHROME" \
  --noerrdialogs \
  --kiosk \
  --disable-session-crashed-bubble \
  --autoplay-policy=no-user-gesture-required \
  --check-for-update-interval=31536000 \
  "file://$(realpath "$HTML")"
