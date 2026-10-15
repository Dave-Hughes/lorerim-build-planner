"""Bakes the pixel art the link-preview cards use, at 1200x630, already scaled
up with nearest-neighbour so the card renderer never smooths it:

- src/lib/og/art/site-scene.png: the coming soon hero (sky, stars, aurora, land,
  Tapps writing by the fire) at 5x, cropped as the hero crops it (62% across, bottom).
- src/lib/og/art/guide-wall.png: the icon wall at 3x, for the guide chapters' cards.

Run after build.py and wall.py: python3 scripts/coming-soon/share.py
"""
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..', '..')
PX = os.path.join(ROOT, 'public', 'coming-soon', 'px')
OUT = os.path.join(ROOT, 'src', 'lib', 'og', 'art')
os.makedirs(OUT, exist_ok=True)
W, H = 1200, 630

def crop(img, fx, fy):
    x = round((img.width - W) * fx); y = round((img.height - H) * fy)
    return img.crop((x, y, x + W, y + H))

scene = None
for name in ('hero-sky', 'hero-stars-a', 'hero-aurora-a', 'hero-land', 'hero-fg-0'):
    layer = Image.open(os.path.join(PX, name + '.png')).convert('RGBA')
    scene = layer if scene is None else Image.alpha_composite(scene, layer)
big = scene.resize((scene.width * 5, scene.height * 5), Image.NEAREST)
crop(big, .62, 1).convert('RGB').save(os.path.join(OUT, 'site-scene.png'), optimize=True)

wall = Image.open(os.path.join(PX, 'icon-wall.png')).convert('RGBA')
big = wall.resize((wall.width * 3, wall.height * 3), Image.NEAREST)
ground = Image.new('RGBA', big.size, (14, 19, 25, 255))
ground.alpha_composite(big)
crop(ground, .5, 0).convert('RGB').save(os.path.join(OUT, 'guide-wall.png'), optimize=True)

for f in ('site-scene.png', 'guide-wall.png'):
    print(f, os.path.getsize(os.path.join(OUT, f)), 'bytes')
