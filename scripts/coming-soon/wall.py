"""Draws the icon wall behind "Coming later": every 16x16 icon from
scripts/icons/pixels.py in a grid that tiles seamlessly, written to
public/coming-soon/px/icon-wall.png. The page repeats it at 3x, pixelated.

Run: python3 scripts/coming-soon/wall.py
"""
import os, random, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [HERE, os.path.join(HERE, '..', 'icons')]
from PIL import Image
import pixels as P

COLS, ROWS, CELL = 24, 12, 24          # 16 px icon in a 24 px cell
icons = []
for prefix, group in P.SETS.items():
    if prefix == 'logo-':
        continue
    for name, draw in group.items():
        ic = draw()
        if len(ic.g) == 16 and len(ic.g[0]) == 16:
            icons.append(ic)

rnd = random.Random(7)
pool = []
while len(pool) < COLS * ROWS:
    batch = icons[:]; rnd.shuffle(batch); pool += batch
img = Image.new('RGBA', (COLS * CELL, ROWS * CELL))
px = img.load()
for i in range(COLS * ROWS):
    r, c = divmod(i, COLS)
    ox = c * CELL + 4 + (CELL // 2 if r % 2 else 0)   # brick offset, wraps at the edge
    oy = r * CELL + 4
    for y, row in enumerate(pool[i].g):
        for x, ch in enumerate(row):
            if ch != '.':
                h = P.PALETTE[ch].lstrip('#')
                px[(ox + x) % img.width, oy + y] = tuple(int(h[k:k + 2], 16) for k in (0, 2, 4)) + (255,)
out = os.path.join(HERE, '..', '..', 'public', 'coming-soon', 'px', 'icon-wall.png')
img.save(out, optimize=True)
print(len(icons), 'icons;', img.size, os.path.getsize(out), 'bytes ->', os.path.relpath(out))
