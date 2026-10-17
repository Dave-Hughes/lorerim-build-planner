"""Draws the Quests page's category art into public/quests/: one 160x64 pixel scene per category,
shown scaled up with image-rendering: pixelated, the way the coming soon page shows its panels.
Drawn with the coming soon page's helpers (scripts/coming-soon/panels.py) and the icon palette
(scripts/icons/pixels.py).

Run: python3 scripts/quests/art.py
"""
import math
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, '..', 'coming-soon'), os.path.join(HERE, '..', 'icons')]
import panels as PN  # noqa: E402

PN.PW, PN.PH = 160, 64
W, H = PN.PW, PN.PH
hexc, grad, ridge, forest, ground, rect, glow, canvas = PN.hexc, PN.grad, PN.ridge, PN.forest, PN.ground, PN.rect, PN.glow, PN.canvas
OUT = os.path.join(HERE, '..', '..', 'public', 'quests')


def stars(im, seed, n, ymax):
    px = im.load(); rnd = random.Random(seed)
    for _ in range(n):
        px[rnd.randrange(W), rnd.randrange(ymax)] = hexc(rnd.choice(('#f4f7f9', '#cddcf6', '#8e9bab', '#8e9bab')))


def poly(im, pts, col):
    px = im.load(); n = len(pts)
    for y in range(H):
        for x in range(W):
            cx, cy = x + .5, y + .5; inside = False
            for i in range(n):
                (x1, y1), (x2, y2) = pts[i], pts[(i + 1) % n]
                if (y1 > cy) != (y2 > cy) and cx < (x2 - x1) * (cy - y1) / (y2 - y1) + x1:
                    inside = not inside
            if inside:
                px[x, y] = hexc(col)


def disc(im, cx, cy, r, col):
    px = im.load()
    for y in range(H):
        for x in range(W):
            if (x + .5 - cx) ** 2 + (y + .5 - cy) ** 2 <= r * r:
                px[x, y] = hexc(col)


def fire(im, cx, by):
    px = im.load()
    for i in range(-4, 5):
        px[cx + i, by] = hexc('#5c4b2e'); px[cx + i, by - 1] = hexc('#8a7347' if abs(i) < 3 else '#5c4b2e')
    for r, row in enumerate(["..o..", ".oyo.", ".yWy.", "oyWyo"]):
        for c, ch in enumerate(row):
            if ch != '.':
                px[cx - 2 + c, by - 5 + r] = hexc({'o': '#f0913f', 'y': '#ecc07a', 'W': '#f4f7f9'}[ch])


def main_stories():
    # The Throat of the World at night, a dragon crossing it, Helgen's smoke glowing low
    im = canvas(); grad(im, ['#070a0f', '#0b1018', '#141d2d', '#212e45', '#3a2f3a'], 0, H)
    stars(im, 3, 60, 34)
    glow(im, 30, 66, 34, (240, 145, 63), 30)
    disc(im, 58, 18, 13, '#8e9bab'); disc(im, 60, 17, 12, '#c9d2da')       # Masser, rising
    ridge(im, 5, 52, 14, '#1d2638', '#26324a')
    poly(im, [(70, 54), (104, 12), (112, 8), (120, 14), (150, 54)], '#26324a')  # the Throat of the World
    poly(im, [(104, 12), (112, 8), (120, 14), (124, 20), (116, 18), (110, 21), (100, 17)], '#c9d2da')
    poly(im, [(112, 8), (120, 14), (124, 20), (116, 18)], '#8e9bab')
    poly(im, [(104, 12), (108, 10), (90, 34), (86, 34)], '#3a4a63')         # its lit flank
    ridge(im, 11, 56, 8, '#141b27', '#1d2638')
    forest(im, 21, 60, '#0a110e', '#15221c', 0.7, 6, 12, '#090d0b')
    # the dragon across the moon: a long body, two wide wings mid-beat, a tail
    d = '#06080b'
    poly(im, [(42, 22), (58, 18), (68, 19), (73, 16), (77, 17), (72, 21), (62, 23), (48, 25)], d)  # body and head
    poly(im, [(53, 20), (44, 4), (38, 9), (33, 6), (49, 23)], d)                                    # far wing
    poly(im, [(57, 21), (72, 5), (76, 11), (83, 9), (64, 23)], d)                                   # near wing
    poly(im, [(43, 22), (26, 29), (20, 28), (45, 24)], d)                                           # tail
    px = im.load()
    px[74, 17] = hexc('#f0913f')
    return im


def guilds():
    # A mead hall: dark timber, three guild banners, braziers
    im = canvas(); rect(im, 0, 0, W - 1, H - 1, '#1f150e')
    px = im.load()
    for y in range(H):
        for x in range(W):
            if y % 9 == 0: px[x, y] = hexc('#18100a')
    for x in (0, 52, 106, 156):                          # pillars
        rect(im, x, 0, x + 3, H - 1, '#3a2a1a'); rect(im, x, 0, x, H - 1, '#5c4b2e')
    rect(im, 0, 4, W - 1, 6, '#3a2a1a'); rect(im, 0, 4, W - 1, 4, '#5c4b2e')  # the beam
    for cx, (hi, mid, lo) in ((29, ('#f1b3a6', '#d07a6a', '#9c4a3e')), (80, ('#cddcf6', '#7d9fd6', '#4f6fae')), (131, ('#cfe8c6', '#86b47f', '#527a4d'))):
        rect(im, cx - 11, 7, cx + 11, 8, '#b9a173')
        poly(im, [(cx - 9, 9), (cx + 10, 9), (cx + 10, 44), (cx + .5, 37), (cx - 9, 44)], mid)
        rect(im, cx - 9, 9, cx - 7, 42, hi); rect(im, cx + 8, 9, cx + 9, 42, lo)
        for k in range(6):                                   # a brass chevron on each, point up
            for t in range(2):
                px[cx - 5 + k, 24 - k + t] = hexc('#e8d3a4'); px[cx + 5 - k, 24 - k + t] = hexc('#b9a173')
    rect(im, 0, 56, W - 1, H - 1, '#140d08'); rect(im, 0, 56, W - 1, 56, '#3a2a1a')
    for bx in (22, 138):                                     # braziers
        rect(im, bx - 4, 50, bx + 4, 52, '#566273'); rect(im, bx - 1, 53, bx + 1, 56, '#566273')
        fire(im, bx, 50)
    return im


def daedric():
    # A Prince's shrine under a red sky: a robed figure holding up a burning star
    im = canvas(); grad(im, ['#120709', '#2a0f12', '#4a1c1c', '#86391b'], 0, 54)
    stars(im, 9, 20, 26)
    disc(im, 128, 16, 7, '#9c4a3e'); disc(im, 126, 15, 6, '#c4652a')   # a red moon
    ridge(im, 3, 50, 10, '#1a0d0f', '#2a1416')
    rect(im, 0, 54, W - 1, H - 1, '#0c0708')
    glow(im, 66, 12, 18, (255, 227, 163), 40)
    rect(im, 50, 50, 82, 56, '#566273'); rect(im, 50, 50, 82, 50, '#8e9bab'); rect(im, 54, 46, 78, 49, '#566273'); rect(im, 54, 46, 78, 46, '#8e9bab')
    poly(im, [(60, 46), (72, 46), (70, 26), (66, 21), (62, 26)], '#3a4656')      # the robe
    poly(im, [(62, 27), (58, 12), (61, 12), (65, 26)], '#3a4656')              # arms raised
    poly(im, [(70, 27), (74, 12), (71, 12), (67, 26)], '#3a4656')
    disc(im, 66, 19, 3, '#3a4656')                                             # head
    px = im.load()
    for y in range(20, 46):
        if px[62, y][:3] == hexc('#3a4656')[:3]: px[62, y] = hexc('#566273')    # a lit edge
    for (x, y) in ((66, 6), (66, 7), (66, 8), (65, 7), (67, 7), (64, 7), (68, 7), (66, 5), (66, 9)):
        px[x, y] = hexc('#ffe3a3')
    px[66, 7] = hexc('#f4f7f9')
    return im


def new_lands():
    # Dusk at sea: a ship making for an island with a mountain on it
    im = canvas(); grad(im, ['#141d2d', '#2a3450', '#4a4058', '#7a5060', '#c4652a'], 0, 40)
    glow(im, 40, 40, 24, (240, 145, 63), 36)
    px = im.load()
    for x in range(W):                                   # the sea, with the sun's path on it
        for y in range(40, H):
            c = '#1a2539' if (x * 3 + y * 7) % 13 else '#2a3450'
            if y % 3 == 1 and abs(x - 40) < 4 + (y - 40) * 0.8 and (x // 3 + y) % 4 != 0: c = '#c4652a' if y < 50 else '#86391b'
            px[x, y] = hexc(c)
    poly(im, [(96, 41), (110, 30), (118, 33), (128, 18), (138, 30), (150, 34), (160, 41)], '#1d2638')  # the island
    poly(im, [(124, 23), (128, 18), (132, 23)], '#8e9bab')
    rect(im, 96, 40, 159, 41, '#141b27')
    # the ship: hull, mast, two sails
    poly(im, [(56, 46), (80, 46), (76, 51), (60, 51)], '#5c4b2e'); rect(im, 58, 46, 78, 46, '#8a7347')
    rect(im, 67, 26, 67, 46, '#3a2a1a')
    poly(im, [(68, 28), (78, 42), (68, 42)], '#e8d3a4'); poly(im, [(66, 30), (58, 42), (66, 42)], '#b9a173')
    px[67, 25] = hexc('#d07a6a'); px[68, 25] = hexc('#d07a6a')
    rect(im, 54, 52, 82, 52, '#4f6fae')
    return im


def side_stories():
    # Dusk on the road: a signpost, and a barrow door with a lantern left burning
    im = canvas(); grad(im, ['#1a2539', '#2a3450', '#4a4058', '#7a5060', '#c4652a'], 0, 44)
    glow(im, 34, 44, 26, (240, 145, 63), 30)
    ridge(im, 4, 40, 12, '#2a2d44', '#3a3d58')
    ground(im, 46, '#24301f', '#3e5230', 5)
    px = im.load()
    for y in range(47, H):                               # the road
        w = int(3 + (y - 47) * 1.4); cx = 40 + int((y - 47) * 0.5)
        for x in range(cx - w, cx + w):
            if 0 <= x < W: px[x, y] = hexc('#8a7347' if (x * 3 + y * 7) % 11 == 0 else '#5c4b2e')
    rect(im, 66, 30, 67, 50, '#5c4b2e'); rect(im, 68, 32, 80, 35, '#b9a173'); rect(im, 68, 32, 80, 32, '#e8d3a4'); rect(im, 80, 33, 81, 34, '#b9a173')
    rect(im, 52, 38, 65, 41, '#b9a173'); rect(im, 52, 38, 65, 38, '#e8d3a4'); rect(im, 51, 39, 51, 40, '#b9a173')
    # the barrow: a grassy mound, a stone door, standing stones
    poly(im, [(100, 50), (112, 34), (140, 30), (160, 36), (160, 50)], '#2c3a24')
    poly(im, [(104, 46), (116, 36), (138, 33), (158, 38), (160, 46)], '#3e5230')
    rect(im, 122, 38, 136, 50, '#3a4656'); rect(im, 124, 40, 134, 50, '#141b23'); rect(im, 122, 38, 136, 38, '#8e9bab')
    rect(im, 128, 40, 128, 50, '#0b0f14')
    for sx in (116, 142):
        rect(im, sx, 36, sx + 2, 48, '#566273'); rect(im, sx, 36, sx, 48, '#8e9bab')
    glow(im, 120, 47, 9, (240, 145, 63), 50)
    rect(im, 119, 46, 121, 49, '#c4652a'); px[120, 47] = hexc('#ffe3a3'); px[120, 45] = hexc('#5c4b2e')
    return im


def followers():
    # Two travellers by a fire in a clearing at night
    im = canvas(); grad(im, ['#06080b', '#0b1018', '#111827', '#141d2d'], 0, H)
    stars(im, 21, 50, 30)
    forest(im, 7, 44, '#0d1512', '#16231d', 0.7, 10, 22, '#0a0f0d')
    ground(im, 52, '#0b100d', '#1c2532', 8)
    glow(im, 80, 52, 30, (240, 145, 63), 32)
    fire(im, 80, 56)
    # the one on the left, sitting, lit on the right side
    poly(im, [(56, 57), (58, 47), (62, 44), (66, 47), (68, 57)], '#2d4374'); disc(im, 62, 42, 3, '#4f6fae')
    rect(im, 65, 46, 66, 56, '#7d9fd6')
    # the one on the right, a hooded figure, lit on the left
    poly(im, [(92, 57), (94, 46), (99, 43), (104, 46), (106, 57)], '#3e5230'); disc(im, 99, 41, 3.5, '#527a4d')
    px = im.load()
    rect(im, 93, 46, 94, 56, '#86b47f'); px[97, 41] = hexc('#f2cfb0'); px[97, 42] = hexc('#d9a07e')
    px[64, 42] = hexc('#f2cfb0'); px[64, 43] = hexc('#d9a07e')
    # a pack and a sword set down beside them
    rect(im, 44, 53, 50, 57, '#8a7347'); rect(im, 44, 53, 50, 53, '#b9a173')
    return im


SCENES = {'main-stories': main_stories, 'guilds-and-factions': guilds, 'daedric-princes': daedric,
          'new-lands': new_lands, 'side-stories': side_stories, 'followers': followers}

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name, fn in SCENES.items():
        fn().save(os.path.join(OUT, name + '.png'), optimize=True)
    print('wrote', len(SCENES), 'scenes to public/quests')
