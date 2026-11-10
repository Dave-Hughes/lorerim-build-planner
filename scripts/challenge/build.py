"""Draws the Zenithar's Challenge hero into public/challenge/px/.

A scene of its own: the inside of a smithy at night. Stone walls, a window on
the night sky, a rack of tools, Zenithar's banner, a quench barrel, the anvil
on its stump with Tapps at it, and a big forge. Six frames: the hammer rises
and falls, sparks fly on the strike, the fire and the coals flicker.

Layers written (all 288x192, the scene's 150 rows under 42 of bare wall, the art pixel of the rest of the site):
  smithy-room.png        walls, floor, window, rack, banner, barrel, forge body
  smithy-glow.png        the forge's light on the room
  smithy-fg-0..5.png     fire, anvil, ingot, Tapps, hammer, sparks

Palette and Tapps are the site's (scripts/icons/pixels.py).

Run: python3 scripts/challenge/build.py
"""
import math, os, random, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, '..', 'coming-soon'), os.path.join(HERE, '..', 'icons')]
from PIL import Image
from scene import hexc, sprite
import pixels as P

W, H = 288, 150
OUT = os.path.join(HERE, '..', '..', 'public', 'challenge', 'px')
os.makedirs(OUT, exist_ok=True)
for old in os.listdir(OUT):
    os.remove(os.path.join(OUT, old))

K = '#06080b'
WALL, WALL_LIT, WALL_DARK, MORTAR = '#1c232d', '#252e3a', '#161c24', '#10151b'
FLOOR, FLOOR_LIT, FLOOR_LINE = '#2a2118', '#3a2d20', '#1a140e'
STONE, STONE_LIT, STONE_DARK = '#3a4656', '#566273', '#252f3d'
STEEL, STEEL_LIT, STEEL_DARK = '#8e9bab', '#c9d2da', '#566273'
WOOD, WOOD_LIT, WOOD_DARK = '#5c4b2e', '#8a7347', '#3d311d'
BRASS, BRASS_LIT = '#b9a173', '#e8d3a4'
RED, RED_LIT, RED_DARK = '#86391b', '#c4652a', '#5a2512'
EMBER, FLAME, WHITE = '#f0913f', '#ffe3a3', '#f4f7f9'
SKY_TOP, SKY_LOW, STAR, AURORA = '#0b1220', '#1d2a44', '#cddcf6', '#527a4d'

FLOOR_Y = 122          # where the wall meets the floor
STAND_Y = 136          # where things stand on the floor
ANVIL_X = 138          # the anvil's centre
FORGE_X = 214          # the forge's left edge


def layer():
    return Image.new('RGBA', (W, H), (0, 0, 0, 0))


class Pen:
    def __init__(self, im):
        self.im, self.px = im, im.load()

    def put(self, x, y, col):
        if 0 <= x < W and 0 <= y < H:
            self.px[x, y] = hexc(col)

    def rect(self, x0, y0, x1, y1, col):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.put(x, y, col)

    def frame(self, x0, y0, x1, y1, col):
        for x in range(x0, x1 + 1):
            self.put(x, y0, col); self.put(x, y1, col)
        for y in range(y0, y1 + 1):
            self.put(x0, y, col); self.put(x1, y, col)

    def rows(self, x, y, art, colours):
        """Stamps a small picture: one string per row, '.' is empty."""
        for r, line in enumerate(art):
            for c, ch in enumerate(line):
                if ch != '.':
                    self.put(x + c, y + r, colours[ch])


def bricks(pen, x0, y0, x1, y1, bw=14, bh=7, rnd=None):
    """A stone wall: courses of blocks, every other course shifted, a few lighter and darker."""
    rnd = rnd or random.Random(7)
    pen.rect(x0, y0, x1, y1, WALL)
    course = 0
    for y in range(y0, y1 + 1, bh):
        shift = (bw // 2) if course % 2 else 0
        for x in range(x0 - shift, x1 + 1, bw):
            tone = rnd.random()
            if tone < 0.16:
                pen.rect(max(x0, x + 1), y + 1, min(x1, x + bw - 1), min(y1, y + bh - 1), WALL_LIT)
            elif tone < 0.3:
                pen.rect(max(x0, x + 1), y + 1, min(x1, x + bw - 1), min(y1, y + bh - 1), WALL_DARK)
            for yy in range(y, min(y1, y + bh - 1) + 1):
                if x >= x0:
                    pen.put(x, yy, MORTAR)
        for x in range(x0, x1 + 1):
            pen.put(x, y, MORTAR)
        course += 1


def room():
    im = layer(); pen = Pen(im)
    bricks(pen, 0, 0, W - 1, FLOOR_Y)

    # The floor: planks running away from the viewer.
    pen.rect(0, FLOOR_Y, W - 1, H - 1, FLOOR)
    pen.rect(0, FLOOR_Y, W - 1, FLOOR_Y, K)
    for y in (FLOOR_Y + 6, FLOOR_Y + 13, FLOOR_Y + 21):
        pen.rect(0, y, W - 1, y, FLOOR_LINE)
    rnd = random.Random(11)
    for row, (ya, yb) in enumerate(((FLOOR_Y + 1, FLOOR_Y + 5), (FLOOR_Y + 7, FLOOR_Y + 12), (FLOOR_Y + 14, FLOOR_Y + 20), (FLOOR_Y + 22, H - 1))):
        x = rnd.randint(4, 30)
        while x < W:
            pen.rect(x, ya, x, yb, FLOOR_LINE)
            if rnd.random() < 0.35:
                pen.rect(x + 2, ya + 1, x + rnd.randint(8, 20), ya + 1, FLOOR_LIT)
            x += rnd.randint(26, 44)

    # The window: an arch on the night sky, with the aurora low in it.
    wx0, wx1, wy0, wy1 = 30, 62, 34, 86
    for y in range(wy0, wy1 + 1):
        for x in range(wx0, wx1 + 1):
            cx, r = (wx0 + wx1) / 2, (wx1 - wx0) / 2
            if y < wy0 + r and (x + 0.5 - cx) ** 2 + (y + 0.5 - (wy0 + r)) ** 2 > r * r:
                continue
            t = (y - wy0) / (wy1 - wy0)
            pen.put(x, y, SKY_TOP if t < 0.45 else SKY_LOW)
            streak = (x * 5 % 11)
            if 0.42 < t < 0.42 + 0.06 * (2 + streak % 5) and streak < 6:
                pen.put(x, y, AURORA if streak % 2 else '#3c5f47')
    for sx, sy in ((38, 44), (52, 40), (45, 52), (57, 58), (35, 60), (49, 47)):
        pen.put(sx, sy, STAR)
    pen.rect(46, 34, 46, wy1, K)                                    # the mullion
    pen.rect(wx0, 62, wx1, 62, K)
    for y in range(wy0 - 2, wy1 + 3):                               # the stone frame
        for x in range(wx0 - 3, wx1 + 4):
            cx, r = (wx0 + wx1) / 2, (wx1 - wx0) / 2
            inside = not (y < wy0 + r and (x + 0.5 - cx) ** 2 + (y + 0.5 - (wy0 + r)) ** 2 > r * r) and wx0 <= x <= wx1 and wy0 <= y <= wy1
            near = y >= wy0 + r and (wx0 - 3 <= x <= wx1 + 3) or (x + 0.5 - cx) ** 2 + (y + 0.5 - (wy0 + r)) ** 2 <= (r + 3) ** 2
            if not inside and near and y <= wy1 + 2:
                pen.put(x, y, STONE if (x + y) % 5 else STONE_LIT)
    pen.rect(wx0 - 5, wy1 + 3, wx1 + 5, wy1 + 5, STONE_LIT)          # the sill
    pen.rect(wx0 - 5, wy1 + 6, wx1 + 5, wy1 + 6, K)

    # The rack: a beam on two pegs, tools hanging from it.
    rx0, rx1, ry = 84, 150, 58
    pen.rect(rx0, ry, rx1, ry + 2, WOOD); pen.rect(rx0, ry, rx1, ry, WOOD_LIT); pen.rect(rx0, ry + 3, rx1, ry + 3, K)
    TONGS = ["k.k", "k.k", "k.k", ".k.", "k.k", "k.k", "s.s", "s.s", "s.s", "s.s", "s.s"]
    SLEDGE = [".w.", ".w.", ".w.", ".w.", ".w.", ".w.", ".w.", "sssss"[:3], "LLs", "sss", "kkk"]
    BLADE = [".b.", ".b.", "bbb", ".L.", ".s.", ".L.", ".s.", ".L.", ".s.", ".L.", ".s.", ".s.", ".k."]
    FILE_ = [".w.", ".w.", ".k.", ".s.", ".s.", ".s.", ".s.", ".s.", ".s."]
    cols = {'k': STEEL_DARK, 's': STEEL, 'L': STEEL_LIT, 'w': WOOD_LIT, 'b': BRASS}
    for x, art in ((90, TONGS), (100, SLEDGE), (111, BLADE), (121, FILE_), (131, TONGS), (141, BLADE)):
        pen.put(x + 1, ry + 3, BRASS)
        pen.rows(x, ry + 4, art, cols)

    # Zenithar's banner: an anvil on red cloth, a brass rod, a swallow tail.
    bx0, bx1, by0, by1 = 172, 196, 26, 88
    pen.rect(bx0 - 3, by0 - 3, bx1 + 3, by0 - 2, BRASS); pen.rect(bx0 - 3, by0 - 3, bx1 + 3, by0 - 3, BRASS_LIT)
    for y in range(by0, by1 + 1):
        for x in range(bx0, bx1 + 1):
            cut = y - (by1 - 9)
            if cut > 0 and abs(x - (bx0 + bx1) / 2) < cut * 1.3 - 0:
                continue
            col = RED
            if x in (bx0, bx1) or y == by0:
                col = RED_DARK
            elif x in (bx0 + 2, bx1 - 2):
                col = BRASS
            elif (x - bx0) % 9 == 5:
                col = RED_DARK
            pen.put(x, y, col)
    SIGN = [
        "..YYYYYYYYYYY..",
        "YYYYYYYYYYYYYYY",
        ".YYYYYYYYYYYYY.",
        "...YYYYYYYYY...",
        ".....YYYYY.....",
        ".....YYYYY.....",
        "....YYYYYYY....",
        "..YYYYYYYYYYY..",
        "..YYYYYYYYYYY..",
    ]
    pen.rows(bx0 + 5, by0 + 22, SIGN, {'Y': BRASS_LIT})
    pen.rows(bx0 + 8, by0 + 10, ["....YYY..", "....YYY..", "YYYYYYYYY", "....YYY..", ".....Y...", ".....Y...", ".....Y..."], {'Y': BRASS_LIT})

    # A quench barrel beside the anvil.
    qx, qy = 162, STAND_Y - 19
    BARREL = [
        "..kkkkkkkkkkkk..",
        ".kmmMMMMMMMMmmk.",
        ".kWwwwwwwwwwwWk.",
        "kgggggggggggggGk",
        "kWwwwwwwwwwwwwdk",
        "kWwwwwwwwwwwwwdk",
        "kWwwwwwwwwwwwwdk",
        "kWwwwwwwwwwwwwdk",
        "kgggggggggggggGk",
        "kWwwwwwwwwwwwwdk",
        "kWwwwwwwwwwwwwdk",
        "kWwwwwwwwwwwwwdk",
        "kWwwwwwwwwwwwwdk",
        "kgggggggggggggGk",
        ".kWwwwwwwwwwwdk.",
        ".kWwwwwwwwwwwdk.",
        ".kWwwwwwwwwwwdk.",
        "..kkkkkkkkkkkk..",
    ]
    pen.rows(qx, qy, BARREL, {'k': K, 'w': WOOD, 'W': WOOD_LIT, 'd': WOOD_DARK, 'g': STEEL, 'G': STEEL_DARK, 'm': '#4f6fae', 'M': '#7d9fd6'})

    # The forge: a stone hearth, an arched mouth, a hood narrowing into the chimney.
    fx0, fx1 = FORGE_X, FORGE_X + 62
    hearth_top = STAND_Y - 44
    for y in range(0, hearth_top):                                   # hood and chimney
        t = y / hearth_top
        half = 12 + int(19 * max(0.0, (t - 0.45) / 0.55))
        cx = (fx0 + fx1) // 2
        for x in range(cx - half, cx + half + 1):
            edge = x in (cx - half, cx + half)
            pen.put(x, y, K if edge else (STONE_LIT if (x // 6 + y // 5) % 3 == 0 else STONE))
        if y % 5 == 0:
            pen.rect(cx - half + 1, y, cx + half - 1, y, STONE_DARK)
    for y in range(hearth_top, STAND_Y + 1):                         # the body
        for x in range(fx0, fx1 + 1):
            edge = x in (fx0, fx1) or y in (hearth_top, STAND_Y)
            pen.put(x, y, K if edge else (STONE_LIT if (x // 9 + y // 6) % 3 == 0 else STONE))
        if (y - hearth_top) % 6 == 0:
            pen.rect(fx0 + 1, y, fx1 - 1, y, STONE_DARK)
    pen.rect(fx0 - 3, hearth_top - 3, fx1 + 3, hearth_top, STONE_LIT)  # the lip
    pen.frame(fx0 - 3, hearth_top - 3, fx1 + 3, hearth_top, K)
    mx0, mx1, my0, my1 = fx0 + 13, fx1 - 13, hearth_top + 8, STAND_Y - 8   # the mouth
    for y in range(my0, my1 + 1):
        for x in range(mx0, mx1 + 1):
            cx, r = (mx0 + mx1) / 2, (mx1 - mx0) / 2
            if y < my0 + r * 0.6 and ((x + 0.5 - cx) / r) ** 2 + ((y + 0.5 - (my0 + r * 0.6)) / (r * 0.6)) ** 2 > 1:
                continue
            pen.put(x, y, '#120c08')
    return im, (mx0, mx1, my0, my1)


def glow(mouth):
    """The forge's light: warm rings on the wall and floor, strongest at the mouth."""
    mx0, mx1, my0, my1 = mouth
    cx, cy = (mx0 + mx1) / 2, (my0 + my1) / 2 + 4
    im = layer(); px = im.load()
    for y in range(H):
        for x in range(W):
            d = math.hypot((x - cx), (y - cy) * 1.25)
            for radius, alpha in ((150, 14), (112, 16), (80, 20), (54, 24), (32, 30)):
                if d < radius:
                    r, g, b, a = px[x, y]
                    px[x, y] = (240, 145, 63, min(255, a + alpha))
    return im


FLAMES = [
    ["........o.........", ".......oo....o....", "...o..ooyo..oo....", "..oo.ooyyo.oyo....", "..oyoooyWyooyyo.o.", ".ooyyoyWWyoyWyooo.", ".oyWyyyWWyyyWWyoo.", "ooyWWyWWWWyWWWyyo.", "oyyWWWWWWWWWWWWyoo"],
    ["......o...........", "......oo...o......", ".o...ooyo..oo..o..", ".oo..oyyo.ooyo.oo.", ".oyo.oyWyooyyyooo.", "ooyyooyWWyoyWyoyo.", "oyWyyyyWWyyyWWyyoo", "oyWWyWWWWWyWWWyyo.", "oyyWWWWWWWWWWWWyoo"],
    ["..........o.......", "...o.....oo.......", "...oo...oyo...o...", "..ooyo.ooyyo.oo...", ".ooyyo.oyWyooyoo..", ".oyWyooyWWyoyyyo.o", "ooyWWyyyWWyyyWyooo", "oyyWWyWWWWyWWWyyo.", "oyyWWWWWWWWWWWWyoo"],
]
FLAME_COLS = {'o': RED_LIT, 'y': EMBER, 'W': FLAME}

ANVIL = [
    "....kkkkkkkkkkkkkkkkkkkkkkkkk..",
    "kkkkLLLLLLLLLLLLLLLLLLLLLLLLLk.",
    "kLLLLssssssssssssssssssssssssk.",
    ".kkssssssssssssssssssssssssdk..",
    "...kkkssssssssssssssssssdkkk...",
    "......kkkddssssssssddkkk.......",
    ".........kddsssssssdk..........",
    ".........kdsssssssddk..........",
    ".........kdsssssssddk..........",
    "........kddssssssssddk.........",
    ".......kdddsssssssssddk........",
    "......kddddssssssssssdddk......",
    "......kLLLLLLLLLLLLLLLLLk......",
    "......kddddddddddddddddddk.....",
    "......kkkkkkkkkkkkkkkkkkkk.....",
]
ANVIL_COLS = {'k': K, 'L': STEEL_LIT, 's': STEEL, 'd': STEEL_DARK}
STUMP = [
    "..kkkkkkkkkkkkkkkkkkkk..",
    ".kWWWwwWWWwwwwWWwwwwwwk.",
    "kwwWwwwwwwwWwwwwwwwwdddk",
    "kwwwwWwwwwwwwwwWwwwwdddk",
    "kwWwwwwwwWwwwwwwwwwwdddk",
    "kwwwwwwwwwwwwwWwwwwwdddk",
    "kwwwWwwwwwwwwwwwwwwwdddk",
    "kkkkkkkkkkkkkkkkkkkkkkkk",
]
STUMP_COLS = {'k': K, 'w': WOOD, 'W': WOOD_LIT, 'd': WOOD_DARK}

HAMMER_UP = [
    "....kkkkkkkk",
    "....kLLLssdk",
    "....kLssssdk",
    "....kssssddk",
    "....kkkwwkkk",
    "......kwwk..",
    ".....kwwk...",
    "....kwwk....",
    "...kwwk.....",
    "..kwwk......",
    ".kwwk.......",
    "kwwk........",
    "kkk.........",
]
HAMMER_DOWN = [
    "..........kkkkkk",
    "kkkkkkkkkkkLLsdk",
    "kwwwwwwwwwwLssdk",
    "kwwwwwwwwwwsssdk",
    "kkkkkkkkkkksssdk",
    "..........kssddk",
    "..........kkkkkk",
]
HAMMER_COLS = {'k': K, 's': STEEL, 'L': STEEL_LIT, 'd': STEEL_DARK, 'w': WOOD_LIT}


def frame(i, mouth):
    im = layer(); pen = Pen(im)
    mx0, mx1, my0, my1 = mouth

    # The forge's mouth again, over the glow, so it stays dark behind the fire.
    for y in range(my0, my1 + 1):
        for x in range(mx0, mx1 + 1):
            cx, r = (mx0 + mx1) / 2, (mx1 - mx0) / 2
            if y < my0 + r * 0.6 and ((x + 0.5 - cx) / r) ** 2 + ((y + 0.5 - (my0 + r * 0.6)) / (r * 0.6)) ** 2 > 1:
                continue
            pen.put(x, y, '#1a0f08' if y < my1 - 12 else '#2e1508')

    # The fire in the forge's mouth, coals under it, sparks up the hood.
    fl = FLAMES[i % 3]
    pen.rows((mx0 + mx1) // 2 - 9, my1 - len(fl) - 1, fl, FLAME_COLS)
    pen.rows((mx0 + mx1) // 2 - 16, my1 - len(fl) + 2, FLAMES[(i + 1) % 3][3:], FLAME_COLS)
    pen.rows((mx0 + mx1) // 2 - 1, my1 - len(fl) + 2, FLAMES[(i + 2) % 3][3:], FLAME_COLS)
    rnd = random.Random(i * 7 + 1)
    for x in range(mx0 + 2, mx1 - 1):
        pen.put(x, my1 - 1, EMBER if rnd.random() < 0.6 else RED_LIT)
        pen.put(x, my1, RED if rnd.random() < 0.7 else EMBER)
    for _ in range(4):
        pen.put(rnd.randint(mx0 + 4, mx1 - 4), my0 + rnd.randint(-2, 8), FLAME)

    # The anvil on its stump, an ingot glowing on the face.
    sy = STAND_Y - len(STUMP) + 1
    pen.rows(ANVIL_X - 12, sy, STUMP, STUMP_COLS)
    ay = sy - len(ANVIL) + 1
    pen.rows(ANVIL_X - 16, ay, ANVIL, ANVIL_COLS)
    strike = i % 2 == 1
    pen.rect(ANVIL_X - 3, ay - 3, ANVIL_X + 8, ay - 1, EMBER)
    pen.rect(ANVIL_X - 3, ay - 3, ANVIL_X + 8, ay - 3, FLAME)
    pen.frame(ANVIL_X - 4, ay - 4, ANVIL_X + 9, ay, K)
    pen.rect(ANVIL_X - 3, ay, ANVIL_X + 8, ay, STEEL_LIT)
    if strike:
        pen.rect(ANVIL_X, ay - 3, ANVIL_X + 5, ay - 2, WHITE)

    # Tapps, and the hammer: up on even frames, down on the ingot on odd ones.
    tapps = sprite(P.TAPPS_ROWS)
    tx = ANVIL_X - 22 - tapps.width
    im.alpha_composite(tapps, (tx, STAND_Y - tapps.height + 1))
    pen = Pen(im)
    if strike:
        pen.rows(ANVIL_X - 20, ay - 10, HAMMER_DOWN, HAMMER_COLS)
        for dx, dy in ((12, -9), (15, -6), (-8, -12), (4, -14), (10, -13), (17, -11), (-5, -8), (7, -17)):
            pen.put(ANVIL_X + dx, ay + dy, FLAME if (dx + i) % 2 else WHITE)
    else:
        pen.rows(ANVIL_X - 24, ay - 24, HAMMER_UP, HAMMER_COLS)
    return im


RISE = 42              # extra wall above the scene, so the title has stone to sit on (three brick courses of 14)


def save(im, name, top='clear'):
    """Every layer gains RISE rows on top: the room repeats its top courses (wall and chimney), the glow
    carries its top row up, the frames stay clear."""
    tall = Image.new('RGBA', (W, H + RISE), (0, 0, 0, 0))
    tall.paste(im, (0, RISE))
    if top == 'courses':
        band = im.crop((0, 0, W, 14))
        for y in range(0, RISE, 14):
            tall.paste(band, (0, y))
    elif top == 'stretch':
        tall.paste(im.crop((0, 0, W, 1)).resize((W, RISE)), (0, 0))
    tall.save(os.path.join(OUT, name + '.png'), optimize=True)


base, mouth = room()
save(base, 'smithy-room', 'courses')
# Two courses of the wall on their own: a phone tiles them above the scene, so the room grows upward instead of being cropped.
base.crop((0, 0, W, 14)).save(os.path.join(OUT, 'smithy-wall.png'), optimize=True)
# The same two courses without the chimney (196 = fourteen bricks), for the strip at the top of the other pages.
base.crop((0, 0, 196, 14)).save(os.path.join(OUT, 'smithy-bricks.png'), optimize=True)
save(glow(mouth), 'smithy-glow', 'stretch')
for i in range(6):
    save(frame(i, mouth), f'smithy-fg-{i}')
print('wrote', len(os.listdir(OUT)), 'files to public/challenge/px')
