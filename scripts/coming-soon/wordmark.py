"""Draws the coming soon title as a pixel wordmark, the way a game draws its logo:
LoreRim from Jersey 10 at two art pixels a font pixel, banded from cream to brass, with
a dark one-pixel outline and a drop shadow; BUILD PLANNER under it at one art pixel a
font pixel, in ember, between two rules. Written at art scale (one pixel = one art pixel)
to public/coming-soon/px/wordmark.png; the page scales it with the hero, pixelated.

Run: python3 scripts/coming-soon/wordmark.py
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..', '..')
FONT = os.path.join(ROOT, 'src', 'lib', 'og', 'fonts', 'Jersey10-Regular.woff')
OUT = os.path.join(ROOT, 'public', 'coming-soon', 'px', 'wordmark.png')

def bitmap(text):
    """The text as font pixels: Jersey 10 is drawn on a 75/1400 em grid, so at 56 px one cell is 3 px."""
    f = ImageFont.truetype(FONT, 56)
    im = Image.new('L', (len(text) * 60 + 40, 120), 0)
    ImageDraw.Draw(im).text((12, 12), text, font=f, fill=255)
    x0, y0, x1, y1 = im.getbbox()
    a = np.asarray(im) > 127
    return a[y0 + 1:y1:3, x0 + 1:x1:3]

def hexc(h):
    h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (255,)

INK, SHADOW = hexc('#070a0f'), hexc('#070a0f')
BANDS = [hexc('#fffaf0'), hexc('#f3ead8'), hexc('#f3ead8'), hexc('#e6d6b2'), hexc('#d2bd8c'), hexc('#b9a173')]
EMBER, EMBER_DARK = hexc('#f0913f'), hexc('#b86424')

big = np.kron(bitmap('LoreRim'), np.ones((2, 2), bool))     # two art pixels a font pixel
small = bitmap('BUILD PLANNER')
H1, W1 = big.shape; H2, W2 = small.shape
GAP, RULE = 4, 6                                          # gap under LoreRim; rule length beside the subtitle
W = max(W1, W2 + 2 * (RULE + 3)) + 4
H = H1 + GAP + H2 + 4
canvas = np.zeros((H, W, 4), np.uint8)

def place(mask, ox, oy, fill):
    """Shadow (down-right), outline, then the fill, for one mask."""
    h, w = mask.shape
    m = np.zeros((H, W), bool); m[oy:oy + h, ox:ox + w] = mask
    grow = m.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            grow |= np.roll(np.roll(m, dy, 0), dx, 1)
    shadow = np.roll(np.roll(grow, 1, 0), 1, 1)
    canvas[shadow & ~grow] = SHADOW
    canvas[grow & ~m] = INK
    ys, xs = np.nonzero(m)
    for y, x in zip(ys, xs):
        canvas[y, x] = fill(y - oy, h)

band = lambda r, h: BANDS[min(len(BANDS) - 1, r * len(BANDS) // h)]
place(big, (W - W1) // 2, 1, band)
sy = 1 + H1 + GAP
sx = (W - W2) // 2
place(small, sx, sy, lambda r, h: EMBER if r < h - 3 else EMBER_DARK)
# Two short rules beside BUILD PLANNER, on its middle row.
mid = sy + H2 // 2
for x0 in (sx - 3 - RULE, sx + W2 + 3):
    rule = np.zeros((H, W), bool); rule[mid, x0:x0 + RULE] = True
    canvas[np.roll(rule, 1, 0) & ~rule] = INK
    canvas[rule] = hexc('#b9a173')
Image.fromarray(canvas, 'RGBA').save(OUT, optimize=True)
print('wordmark', W, 'x', H, 'art pixels ->', os.path.relpath(OUT, ROOT))
