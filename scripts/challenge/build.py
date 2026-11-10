"""Draws the Zenithar's Challenge hero into public/challenge/px/.

The hero reuses the coming soon night scene (sky, stars, aurora, land: see
scripts/coming-soon/build.py) and swaps the foreground: Tapps at an anvil
beside a stone forge, six frames. The hammer rises and falls, the ingot
glows and the forge fire flickers. Drawn from the same palette and Tapps
sprites (scripts/icons/pixels.py).

Run: python3 scripts/challenge/build.py
"""
import os, random, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, '..', 'coming-soon'), os.path.join(HERE, '..', 'icons')]
from PIL import Image
from scene import W, H, hexc, layer, sprite
import scene3 as S3
import pixels as P

OUT = os.path.join(HERE, '..', '..', 'public', 'challenge', 'px')
os.makedirs(OUT, exist_ok=True)

OUTLINE = '#06080b'
STONE, STONE_LIT, STONE_DARK = '#3a4656', '#566273', '#252f3d'
STEEL, STEEL_LIT, STEEL_DARK = '#8e9bab', '#c9d2da', '#566273'
WOOD, WOOD_LIT = '#5c4b2e', '#8a7347'
EMBER, FLAME, WHITE = '#f0913f', '#ecc07a', '#f4f7f9'

GROUND = 141          # the ground line the campfire sits on in the coming soon hero
ANVIL_X = 180         # the anvil's centre
FORGE_X = 204         # the forge's left edge


def put(px, x, y, col):
    if 0 <= x < W and 0 <= y < H:
        px[x, y] = hexc(col)


def rows(px, x, y, art, colours):
    """Stamps a small picture: one string per row, '.' is empty."""
    for r, line in enumerate(art):
        for c, ch in enumerate(line):
            if ch != '.':
                put(px, x + c, y + r, colours[ch])


ANVIL = [
    "..kkkkkkkkkkkkkk.",
    "kkLLLLLLLLLLLLLLk",
    "kssssssssssssssk.",
    ".kkkddsssssdkkk..",
    "....kddsssdk.....",
    "....kdssssdk.....",
    "...kddsssssdk....",
    "..kdddssssssdk...",
    "..kkkkkkkkkkkk...",
]
ANVIL_COLOURS = {'k': OUTLINE, 'L': STEEL_LIT, 's': STEEL, 'd': STEEL_DARK}

# A stump under the anvil.
STUMP = [
    ".kkkkkkkkkk.",
    "kwwWWwwwwwwk",
    "kwwwwWwwwwwk",
    "kwwwwwwwwwwk",
]
STUMP_COLOURS = {'k': OUTLINE, 'w': WOOD, 'W': WOOD_LIT}

FORGE = [
    "....kkkkkkkkkkkkkk....",
    "...kSSsSSSSsSSSsSSk...",
    "...ksSSSsSSSSsSSSsk...",
    "..kkkkkkkkkkkkkkkkkk..",
    "..kSsSk........kSsSk..",
    "..ksSSk........kSSsk..",
    "..kSSsk........ksSSk..",
    "..ksSSk........kSsSk..",
    ".kkkkkkkkkkkkkkkkkkkk.",
    "kSSsSSSSsSSSSSsSSSSsSk",
    "ksSSSsSSSSSsSSSSsSSSSk",
    "kkkkkkkkkkkkkkkkkkkkkk",
]
FORGE_COLOURS = {'k': OUTLINE, 'S': STONE, 's': STONE_LIT}

FLAMES = [
    ["...o....", "..oyo...", ".ooyoo..", ".oyWyoo.", "ooyWWyo.", "oyyWWyyo"],
    ["....o...", "...oo...", "..oyyo..", ".ooyWyo.", ".oyWWyoo", "oyyWWyyo"],
    [".o......", ".oo..o..", ".oyoooo.", "ooyWyyo.", "oyWWWyoo", "oyyWWyyo"],
]
FLAME_COLOURS = {'o': EMBER, 'y': FLAME, 'W': WHITE}

HAMMER_UP = [
    "...kkkkkk",
    "...kLLssk",
    "...kssssk",
    "...kkwkkk",
    "....kwk..",
    "...kwk...",
    "..kwk....",
    ".kwk.....",
    "kwk......",
]
HAMMER_DOWN = [
    "......kkkkk",
    "kkkkkkkLssk",
    "kwwwwwwsssk",
    "kkkkkkkkssk",
    "......kkkkk",
]
HAMMER_COLOURS = {'k': OUTLINE, 's': STEEL, 'L': STEEL_LIT, 'w': WOOD_LIT}


def frame(i):
    im = layer()
    px = im.load()

    # The forge, its fire inside the opening, and a low chimney.
    fy = GROUND - len(FORGE) + 1
    for y in range(fy + 4, fy + 8):
        for x in range(FORGE_X + 7, FORGE_X + 15):
            put(px, x, y, '#1a1410')
    rows(px, FORGE_X + 7, fy + 2, FLAMES[i % 3], FLAME_COLOURS)
    rows(px, FORGE_X, fy, FORGE, FORGE_COLOURS)
    for y in range(fy - 6, fy):
        for x in range(FORGE_X + 14, FORGE_X + 19):
            edge = x in (FORGE_X + 14, FORGE_X + 18) or y == fy - 6
            put(px, x, y, OUTLINE if edge else (STONE_LIT if (x + y) % 3 == 0 else STONE))
    rnd = random.Random(i * 5 + 3)
    for _ in range(2):
        put(px, FORGE_X + 16 + rnd.randint(-2, 2), fy - 8 - rnd.randint(0, 9), FLAME)

    # The anvil on its stump, an ingot glowing on the face.
    sy = GROUND - len(STUMP) + 1
    rows(px, ANVIL_X - 6, sy, STUMP, STUMP_COLOURS)
    ay = sy - len(ANVIL) + 1
    rows(px, ANVIL_X - 9, ay, ANVIL, ANVIL_COLOURS)
    strike = i % 2 == 1
    for x in range(ANVIL_X - 3, ANVIL_X + 3):
        put(px, x, ay - 1, WHITE if strike and x in (ANVIL_X - 1, ANVIL_X) else FLAME)
        put(px, x, ay - 2, EMBER)

    # Tapps, and the hammer in his hand: up on even frames, down on the ingot on odd ones.
    tapps = sprite(P.TAPPS_ROWS)
    tx = ANVIL_X - 13 - tapps.width
    im.alpha_composite(tapps, (tx, GROUND - tapps.height + 1))
    px = im.load()
    if strike:
        rows(px, ANVIL_X - 12, ay - 6, HAMMER_DOWN, HAMMER_COLOURS)
        for dx, dy in ((4, -6), (7, -4), (-4, -8), (2, -9), (6, -8)):
            put(px, ANVIL_X + dx, ay + dy, FLAME if (dx + i) % 2 else WHITE)
    else:
        rows(px, ANVIL_X - 13, ay - 14, HAMMER_UP, HAMMER_COLOURS)
    return im


def save(im, name):
    im.save(os.path.join(OUT, name + '.png'), optimize=True)


# The fire's glow on the ground, drawn under the foreground like the campfire's.
save(S3.glow(FORGE_X + 11, GROUND - 3, radii=(26, 17, 9), alphas=(22, 30, 40)), 'hero-glow')
for i in range(6):
    save(frame(i), f'hero-fg-{i}')
print('wrote', len(os.listdir(OUT)), 'files to public/challenge/px')
