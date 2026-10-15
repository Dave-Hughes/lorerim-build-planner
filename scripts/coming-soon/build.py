"""Draws the coming soon page's pixel art into public/coming-soon/px/.

The hero is a 288x150 night scene in layers, stacked in the page:
sky, two star layers (they swap to twinkle), two aurora layers (they
cross-fade), the land (moon, mountains, forests, ground, fire glow), then
six foreground frames (the campfire and Tapps writing). The story panels
are 160x100, three or four frames each. Everything is drawn from the
palette and the Tapps sprites in scripts/icons/pixels.py.

Run: python3 scripts/coming-soon/build.py
"""
import os, random, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [HERE, os.path.join(HERE, '..', 'icons')]
from PIL import Image
from scene import W, H, sky, stars, sprite
import scene2 as S2, scene3 as S3, panels as PN
import pixels as P

OUT = os.path.join(HERE, '..', '..', 'public', 'coming-soon', 'px')
os.makedirs(OUT, exist_ok=True)

def save(im, name):
    im.save(os.path.join(OUT, name + '.png'), optimize=True)

save(sky(), 'hero-sky')
a = stars(7); b = a.copy(); pa = b.load(); rnd = random.Random(2)
for _ in range(60):
    x, y = rnd.randrange(W), rnd.randrange(int(H * .62))
    if pa[x, y][3]: pa[x, y] = (0, 0, 0, 0)
save(a, 'hero-stars-a'); save(b, 'hero-stars-b')
save(S3.aurora(shift=0), 'hero-aurora-a'); save(S3.aurora(shift=14), 'hero-aurora-b')

land = Image.new('RGBA', (W, H))
for p in (S2.moon(240, 22, 6),
          S3.mountains(5, 100, 44, '#26324a', '#3a4a63', '#1d2638', '#c9d2da', '#8e9bab', cap=14),
          S3.mountains(13, 112, 26, '#19212f', '#232e42', '#141b27', oct=((60, 1), (24, .45), (10, .15))),
          S2.forest(21, 122, '#0f1916', '#1c2b24', 0.55, 7, 14, '#0b120f'),
          S2.forest(33, 133, '#0a110e', '#15221c', 0.72, 11, 20, '#090d0b'),
          S2.ground(135), S3.glow(182, 138, radii=(19, 12, 6), alphas=(22, 30, 40))):
    land = Image.alpha_composite(land, p)
save(land, 'hero-land')

# Foreground: frame i is campfire frame i % 3 with Tapps writing frame WRITE[i].
WRITE = (0, 1, 2, 3, 2, 3)
frames = [P.TAPPS_WRITING_0_ROWS, P.TAPPS_WRITING_1_ROWS, P.TAPPS_WRITING_2_ROWS, P.TAPPS_WRITING_3_ROWS]
for i, w in enumerate(WRITE):
    im = S3.campfire(i % 3, 182, 141)
    im.alpha_composite(sprite(frames[w]), (148, 141 - 29))
    save(im, f'hero-fg-{i}')

for name, fn, n in (('p1', PN.p1, 3), ('p2', PN.p2, 3), ('p3', PN.p3, 4), ('p4', PN.p4, 4)):
    for f in range(n):
        save(fn(f), f'{name}-{f}')

print('wrote', len(os.listdir(OUT)), 'files to public/coming-soon/px')
