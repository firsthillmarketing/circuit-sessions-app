#!/usr/bin/env bash
# Generates and configures the Circuit Sessions iOS project on macOS (Codemagic). First Hill Marketing, LLC.
set -euo pipefail
cd "$(dirname "$0")"

[ -d ios ] || npx cap add ios
npx cap sync ios

python3 -m pip install --quiet --break-system-packages pillow 2>/dev/null || python3 -m pip install --quiet --user pillow

python3 - <<'PY'
import re
app = "ios/App/App"
p = f"{app}/Info.plist"; s = open(p).read()
if "NSCameraUsageDescription" not in s:
    add = """    <key>NSCameraUsageDescription</key>
    <string>Circuit Sessions uses the camera when you add a photo or video to your artist profile or community posts.</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Circuit Sessions lets you choose photos and videos for your artist profile and community posts.</string>
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>Circuit Sessions saves photos and flyers you choose to keep to your photo library.</string>
    <key>NSMicrophoneUsageDescription</key>
    <string>Circuit Sessions uses the microphone when you record a video for your artist profile or community posts.</string>
    <key>ITSAppUsesNonExemptEncryption</key>
    <false/>
"""
    s = s.replace("<dict>", "<dict>\n" + add, 1)
# iPhone portrait only; iPad keeps all orientations (Apple requires it for multitasking)
s = re.sub(r"(<key>UISupportedInterfaceOrientations</key>\s*<array>)(.*?)(</array>)",
           lambda m: m.group(1) + "\n\t\t<string>UIInterfaceOrientationPortrait</string>\n\t" + m.group(3), s, count=1, flags=re.S)
open(p, "w").write(s)
pb = "ios/App/App.xcodeproj/project.pbxproj"; t = open(pb).read()
t = re.sub(r"MARKETING_VERSION = [0-9.]+;", "MARKETING_VERSION = 1.0.0;", t)
open(pb, "w").write(t)
print("Info.plist ready:", s.count("UsageDescription"), "usage strings | version 1.0.0")
PY

python3 - <<'PY'
from PIL import Image
src = Image.open("icon-1024.png").convert("RGB").resize((1024, 1024), Image.LANCZOS)
src.save("ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png", "PNG")
bg = tuple(int("#000000"[i:i + 2], 16) for i in (1, 3, 5))
splash = Image.new("RGB", (2732, 2732), bg); n = 760
from PIL import ImageDraw
m = Image.new("L", (n, n), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, n - 1, n - 1), radius=int(n * 0.22), fill=255)
splash.paste(src.resize((n, n), Image.LANCZOS), ((2732 - n) // 2, (2732 - n) // 2), m)
for f in ("splash-2732x2732.png", "splash-2732x2732-1.png", "splash-2732x2732-2.png"):
    splash.save("ios/App/App/Assets.xcassets/Splash.imageset/" + f, "PNG")
chk = Image.open("ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png")
print("Icon:", chk.size, chk.mode, "corner", chk.getpixel((3, 3)))
PY
echo "Circuit Sessions iOS project ready."
