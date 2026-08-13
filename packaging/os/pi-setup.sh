#!/usr/bin/env bash
# Koda Console — turn a Raspberry Pi into a friendly Koda learning box
# (the modern version of what Kano did: a Pi + a kid-friendly shell).
#
# 1. Flash Raspberry Pi OS (Lite or Desktop) to an SD card.
# 2. Boot once, then run this script as the normal user:
#      bash pi-setup.sh
# 3. Copy your app:  cp /path/to/index.html ~/koda/index.html
# 4. Reboot. The Pi boots straight into Koda, fullscreen.
set -e
echo "🔧 Setting up a Koda Console on Raspberry Pi…"

sudo apt-get update -y
sudo apt-get install -y chromium-browser xserver-xorg xinit unclutter

mkdir -p ~/koda
if [ ! -f ~/koda/index.html ]; then
  echo ""
  echo "⚠️  Copy Koda's index.html first:"
  echo "    cp /path/to/koda/index.html ~/koda/index.html"
  echo "    Then re-run: bash pi-setup.sh"
  exit 1
fi

cat > ~/.xinitrc <<'XINIT'
#!/usr/bin/env bash
unclutter -idle 3 &
exec chromium-browser --noerrdialogs --kiosk --disable-session-crashed-bubble \
  --autoplay-policy=no-user-gesture-required \
  file:///home/pi/koda/index.html
XINIT
chmod +x ~/.xinitrc

# Start X automatically on console login
grep -q "startx" ~/.bashrc || cat >> ~/.bashrc <<'BASHRC'

if [ -z "$DISPLAY" ] && [ "$(tty)" = "/dev/tty1" ]; then
  startx
fi
BASHRC

echo ""
echo "✅ Done! Reboot with:  sudo reboot"
echo "   Exit Koda at any time with Ctrl+Alt+F2 (back to console: Ctrl+Alt+F1)."
