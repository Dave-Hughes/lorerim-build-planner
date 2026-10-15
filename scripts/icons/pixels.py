"""
Pixel icons for the 18 skills and Destiny, the build page's tabs, attributes, birthsigns, races, level marks, gear slots, game modes, tags, deities, the logo, and the guide's chapters and needs: 16x16, drawn with a few shape
helpers, then given a 1 px dark outline automatically so every icon shares
the same edge. Written out as SVG (one rect per run of pixels, crisp at any
size).

  python3 scripts/icons/pixels.py      -> public/icons/<slug>.svg

Craft rules followed:
- light from the top left: highlight on upper/left parts, shadow lower/right
- three tones per material plus the shared outline
- the silhouette fills most of the 14x14 inside the outline
- the planner's palette only (steel, brass, ember, magicka, health, stamina)
"""
import math
import os
import re

PALETTE = {
    "x": "#06080b",                                                  # outline
    "W": "#f4f7f9", "w": "#c9d2da", "g": "#8e9bab", "G": "#566273",  # steel / bone
    "Y": "#e8d3a4", "b": "#b9a173", "B": "#8a7347", "d": "#5c4b2e",  # brass / wood / leather
    "y": "#ffe3a3", "o": "#f0913f", "O": "#c4652a", "R": "#86391b",  # ember / fire
    "c": "#cddcf6", "m": "#7d9fd6", "M": "#4f6fae", "N": "#2d4374",  # magicka
    "p": "#f1b3a6", "r": "#d07a6a", "q": "#9c4a3e",                  # health
    "e": "#cfe8c6", "s": "#86b47f", "S": "#527a4d",                  # stamina
    "k": "#141b23",                                                  # inner dark
    # skin and fur, for the race portraits only
    "F": "#f2cfb0", "f": "#d9a07e", "v": "#a5694c",                  # fair
    "T": "#d9ab7c", "t": "#b07e52", "U": "#7a5232",                  # tan (Bosmer)
    "j": "#9a6444", "J": "#6e4128", "D": "#4a2a18",                  # dark (Redguard)
    "A": "#ecd28c", "a": "#c9a85a", "i": "#8f7236",                  # gold (Altmer)
    "H": "#aab3c4", "h": "#7f899d", "l": "#565f72",                  # ash (Dunmer)
    "E": "#a6c47e", "n": "#729553", "u": "#4b6634",                  # green (Orsimer)
    "K": "#ecc07a", "Q": "#c48e46", "V": "#83592a",                  # fur (Khajiit)
    "L": "#c9d2da",                                                  # thin line, no outline
    "z": "#ffe3a3",                                                  # spark, no outline
}
NO_OUTLINE = {"L", "z"}


class Icon:
    def __init__(self):
        self.g = [["." for _ in range(16)] for _ in range(16)]

    def px(self, x, y, c):
        if 0 <= x < 16 and 0 <= y < 16:
            self.g[y][x] = c

    def line(self, x0, y0, x1, y1, c):
        dx, dy = abs(x1 - x0), -abs(y1 - y0)
        sx, sy = (1 if x0 < x1 else -1), (1 if y0 < y1 else -1)
        err = dx + dy
        while True:
            self.px(x0, y0, c)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                x0 += sx
            if e2 <= dx:
                err += dx
                y0 += sy

    def rect(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.px(x, y, c)

    def poly(self, pts, c, where=None):
        """Fill pixels whose centres fall inside the polygon."""
        n = len(pts)
        for y in range(16):
            for x in range(16):
                cx, cy = x + 0.5, y + 0.5
                inside = False
                for i in range(n):
                    x1, y1 = pts[i]
                    x2, y2 = pts[(i + 1) % n]
                    if (y1 > cy) != (y2 > cy) and cx < (x2 - x1) * (cy - y1) / (y2 - y1) + x1:
                        inside = not inside
                if inside and (where is None or where(x, y)):
                    self.px(x, y, c)

    def disc(self, cx, cy, r, c, where=None):
        for y in range(16):
            for x in range(16):
                if (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r and (where is None or where(x, y)):
                    self.px(x, y, c)

    def recolor(self, frm, to, where):
        for y in range(16):
            for x in range(16):
                if self.g[y][x] in frm and where(x, y):
                    self.g[y][x] = to

    def filled(self, x, y):
        return 0 <= x < 16 and 0 <= y < 16 and self.g[y][x] not in (".", "x") and self.g[y][x] not in NO_OUTLINE

    def outline(self):
        add = []
        for y in range(16):
            for x in range(16):
                if self.g[y][x] == "." and any(self.filled(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    add.append((x, y))
        for x, y in add:
            self.g[y][x] = "x"
        return self


def leaf(ax, ay, bx, by, wl, wr, power=0.8):
    """Polygon for a leaf, feather or flame along A->B; wl/wr are the half-widths on each side."""
    L = math.hypot(bx - ax, by - ay)
    ux, uy = (bx - ax) / L, (by - ay) / L
    nx, ny = -uy, ux
    left, right = [], []
    for i in range(21):
        t = i / 20
        w = math.sin(math.pi * t) ** power
        px, py = ax + (bx - ax) * t, ay + (by - ay) * t
        left.append((px + nx * wl * w, py + ny * wl * w))
        right.append((px - nx * wr * w, py - ny * wr * w))
    return left + right[::-1]


# ---------------------------------------------------------------- the icons

def one_handed():
    i = Icon()
    i.line(13, 2, 6, 9, "W")          # blade, lit edge
    i.line(13, 3, 7, 9, "g")          # blade, shaded edge
    i.px(14, 1, "W")
    i.line(3, 7, 8, 12, "b")          # crossguard
    i.px(3, 7, "Y"); i.px(4, 8, "Y")
    i.line(5, 11, 3, 13, "d")         # grip
    i.px(2, 14, "o")                  # pommel stone
    return i.outline()


def two_handed():
    i = Icon()
    i.poly([(7, 3.5), (2.2, 0.8), (1, 4), (1, 6.5), (2.2, 9.6), (7, 6.8)], "w")     # left bit
    i.poly([(9, 3.5), (13.8, 0.8), (15, 4), (15, 6.5), (13.8, 9.6), (9, 6.8)], "w")  # right bit
    i.recolor({"w"}, "W", lambda x, y: x <= 2 or y <= 2)
    i.recolor({"w"}, "g", lambda x, y: x >= 13 or y >= 7)
    i.rect(7, 1, 8, 14, "b"); i.line(8, 1, 8, 14, "B")   # haft
    i.rect(7, 3, 8, 6, "G")                              # socket
    i.rect(7, 11, 8, 13, "d")                            # grip wrap
    return i.outline()


def marksman():
    i = Icon()
    for (x, y) in ((6, 1), (5, 2), (4, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (3, 10), (4, 11), (5, 12), (6, 13)):
        i.px(x, y, "b")                                    # bow limb
    for (x, y) in ((4, 4), (4, 5), (4, 9), (4, 10)):
        i.px(x, y, "B")
    i.px(3, 5, "Y"); i.px(3, 6, "Y"); i.px(4, 3, "Y")
    i.px(7, 0, "b"); i.px(7, 14, "b")                      # recurved tips
    i.rect(3, 7, 4, 8, "d")                                # grip
    i.line(6, 2, 6, 12, "L")                               # string
    i.line(7, 7, 12, 7, "B")                               # arrow shaft
    i.px(13, 6, "g"); i.px(13, 7, "W"); i.px(13, 8, "g"); i.px(14, 7, "W")
    i.px(7, 6, "o"); i.px(8, 6, "o"); i.px(7, 8, "O"); i.px(8, 8, "O")   # fletching
    return i.outline()


def block():
    i = Icon()
    i.poly([(2.5, 1.5), (13.5, 1.5), (13.5, 7.5), (12.5, 10), (8, 14.8), (3.5, 10), (2.5, 7.5)], "b")
    i.poly([(3.6, 2.6), (12.4, 2.6), (12.4, 7.4), (11.6, 9.6), (8, 13.4), (4.4, 9.6), (3.6, 7.4)], "w")
    i.recolor({"w"}, "g", lambda x, y: x >= 8)
    i.recolor({"w"}, "W", lambda x, y: x <= 4 or y <= 3)
    i.rect(7, 3, 8, 12, "O"); i.rect(4, 5, 11, 6, "O")    # cross
    i.recolor({"O"}, "o", lambda x, y: x <= 7 and y <= 5)
    i.recolor({"b"}, "Y", lambda x, y: y <= 1 or x <= 2)
    i.recolor({"b"}, "B", lambda x, y: x >= 13 or y >= 11)
    return i.outline()


def smithing():
    i = Icon()
    i.rect(3, 8, 12, 9, "g"); i.rect(3, 8, 12, 8, "W")    # anvil face
    i.px(2, 8, "w"); i.px(1, 8, "w")                       # horn
    i.rect(6, 10, 9, 11, "G")                              # waist
    i.rect(4, 12, 11, 13, "g"); i.rect(4, 13, 11, 13, "G") # foot
    i.rect(9, 1, 13, 3, "w"); i.rect(9, 1, 13, 1, "W"); i.rect(9, 3, 13, 3, "g")   # hammer head
    i.line(10, 4, 6, 7, "b"); i.px(11, 4, "B")             # handle
    i.px(3, 5, "z"); i.px(2, 3, "z"); i.px(5, 4, "z")      # sparks
    return i.outline()


def heavy_armor():
    i = Icon()
    i.rect(1, 2, 4, 4, "w"); i.rect(11, 2, 14, 4, "w")     # pauldrons
    i.rect(3, 3, 12, 8, "w")                               # chest
    i.poly([(3, 8), (13, 8), (12, 13.5), (4, 13.5)], "w")  # belly plates
    i.rect(6, 2, 9, 3, ".")                                # neck
    i.rect(7, 4, 8, 12, "g")                               # centre ridge
    i.rect(4, 9, 11, 9, "G")                               # belt line
    i.recolor({"w"}, "W", lambda x, y: x <= 5 and y <= 6 or y == 2 or x <= 1)
    i.recolor({"w"}, "g", lambda x, y: x >= 11 and y >= 5)
    i.px(5, 9, "b"); i.px(10, 9, "b")
    return i.outline()


def evasion():
    i = Icon()
    i.poly(leaf(2.5, 13.5, 13.8, 1.8, 3.2, 1.9, 0.7), "w")
    i.recolor({"w"}, "g", lambda x, y: x + y > 16)
    i.recolor({"w"}, "W", lambda x, y: x + y < 12)
    i.line(3, 12, 12, 3, "b")                               # shaft
    i.line(2, 13, 1, 14, "B")
    for (x, y) in ((6, 6), (5, 7), (9, 4)):                 # notches in the vane
        i.px(x, y, ".")
    return i.outline()


def finesse():
    i = Icon()
    i.poly([(5, 5), (11, 5), (14, 10), (13, 14), (3, 14), (2, 10)], "b")   # sack
    i.poly([(4, 1), (7, 3), (9, 3), (12, 1), (11, 4.5), (5, 4.5)], "b")    # gathered top
    i.recolor({"b"}, "Y", lambda x, y: x <= 6 and 5 <= y <= 11 or y <= 2)
    i.recolor({"b"}, "B", lambda x, y: x >= 11 and y >= 8 or y >= 13)
    i.rect(5, 4, 11, 4, "q")                                               # drawstring
    i.px(12, 4, "q"); i.px(13, 5, "q")
    i.disc(9.5, 10.5, 2.3, "o"); i.px(9, 9, "y"); i.px(8, 10, "y")         # stamped coin
    return i.outline()


def wayfarer():
    i = Icon()
    i.rect(6, 1, 9, 1, "g"); i.px(5, 2, "g"); i.px(10, 2, "g")   # handle
    i.rect(4, 3, 11, 4, "g"); i.rect(4, 3, 11, 3, "w")            # cap
    i.rect(4, 5, 11, 11, "G")                                     # frame
    i.rect(5, 5, 10, 11, "y")                                     # glass
    i.rect(6, 6, 9, 10, "o"); i.rect(7, 7, 8, 9, "y")             # flame
    i.px(5, 5, "W")
    i.rect(3, 12, 12, 13, "g"); i.rect(3, 12, 12, 12, "w")        # base
    return i.outline()


def sneak():
    i = Icon()
    i.poly([(8, 0.6), (12.6, 3.5), (14, 9), (15, 14.6), (1, 14.6), (2, 9), (3.4, 3.5)], "g")   # hood and cloak
    i.recolor({"g"}, "w", lambda x, y: x + y < 9)
    i.recolor({"g"}, "G", lambda x, y: x >= 11 and y >= 5 or y >= 13)
    i.poly([(8, 4), (11.4, 6.5), (11.4, 10.5), (8, 12.6), (4.6, 10.5), (4.6, 6.5)], "k")      # face in shadow
    i.px(6, 8, "o"); i.px(7, 8, "O"); i.px(9, 8, "O"); i.px(10, 8, "o")                        # eyes
    return i.outline()


def alchemy():
    i = Icon()
    i.disc(8, 10, 5, "w")                                   # bulb
    i.rect(7, 2, 9, 6, "w")                                 # neck
    i.rect(6, 1, 10, 1, "B")                                # cork
    i.disc(8, 10, 4.2, "s", where=lambda x, y: y >= 9)      # liquid
    i.recolor({"s"}, "e", lambda x, y: y == 9)
    i.recolor({"s"}, "S", lambda x, y: x >= 10 or y >= 13)
    i.recolor({"w"}, "g", lambda x, y: x >= 10)
    i.px(5, 8, "W"); i.px(5, 9, "W"); i.px(7, 3, "W")      # shine
    i.px(7, 11, "e")                                        # bubble
    return i.outline()


def speech():
    i = Icon()
    i.rect(3, 3, 12, 12, "Y")                               # sheet
    i.rect(2, 1, 13, 2, "b"); i.rect(2, 13, 13, 14, "b")    # rolled ends
    i.rect(2, 1, 13, 1, "Y"); i.rect(2, 14, 13, 14, "B")
    i.px(1, 2, "B"); i.px(14, 2, "B"); i.px(1, 13, "B"); i.px(14, 13, "B")
    for y in (5, 7, 9):
        i.rect(5, y, 10 if y != 9 else 8, y, "B")           # writing
    i.recolor({"Y"}, "b", lambda x, y: x >= 12 and 3 <= y <= 12)
    i.px(10, 11, "q"); i.px(11, 11, "q"); i.px(10, 12, "q")  # seal
    return i.outline()


def alteration():
    i = Icon()
    i.disc(8, 8, 7, "M")
    i.disc(8, 8, 5.6, ".")
    i.recolor({"M"}, "m", lambda x, y: x + y < 14)
    i.recolor({"M"}, "N", lambda x, y: x + y > 19)
    i.poly([(8, 3), (12.6, 8), (8, 13), (3.4, 8)], "m")     # ward rune
    i.poly([(8, 5), (10.6, 8), (8, 11), (5.4, 8)], "c")
    i.rect(7, 7, 8, 8, "W")
    return i.outline()


def conjuration():
    i = Icon()
    i.disc(8, 6.8, 5.4, "w")                                # cranium
    i.rect(5, 10, 11, 12, "w")                              # jaw
    i.recolor({"w"}, "W", lambda x, y: x <= 6 and y <= 6)
    i.recolor({"w"}, "g", lambda x, y: x >= 11 or y >= 12)
    i.rect(4, 6, 6, 8, "N"); i.rect(9, 6, 11, 8, "N")       # sockets
    i.px(5, 7, "m"); i.px(10, 7, "m")                       # eye glow
    i.px(7, 9, "G"); i.px(8, 9, "G")                        # nose
    for x in (6, 8, 10):
        i.px(x, 12, "G")                                    # teeth
    i.px(7, 13, "w"); i.px(9, 13, "w")
    return i.outline()


def destruction():
    i = Icon()
    outer = [(8, 0.4), (9.6, 4), (12, 2.4), (11.6, 6), (14.4, 7), (13.6, 11.5), (11, 14.6), (5, 14.6),
             (2.4, 11.5), (1.6, 7.5), (3.8, 5), (4.6, 7.4), (6.2, 3.6)]
    i.poly(outer, "O")
    i.poly([(8, 3.8), (9.8, 7.2), (11.6, 7), (12, 11), (10, 13.8), (6, 13.8), (4, 11), (4.6, 8.6), (6.4, 8.6)], "o")
    i.poly([(8, 7.4), (9.8, 10.4), (9.6, 13.2), (6.4, 13.2), (6.2, 10.4)], "y")
    i.recolor({"O"}, "R", lambda x, y: y >= 13)
    return i.outline()


def enchanting():
    i = Icon()
    i.poly([(8, 0.6), (14.4, 7), (8, 15.4), (1.6, 7)], "M")
    i.poly([(8, 0.6), (14.4, 7), (1.6, 7)], "m")            # upper facets
    i.poly([(8, 0.6), (8, 7), (1.6, 7)], "c")               # lit facet
    i.poly([(8, 7), (14.4, 7), (8, 15.4)], "N")             # shaded facet
    i.px(5, 4, "W"); i.px(6, 3, "W")
    return i.outline()


def illusion():
    i = Icon()
    i.disc(7, 8, 6.3, "c")
    i.disc(10, 6.4, 5.4, ".")                               # crescent
    i.recolor({"c"}, "m", lambda x, y: x >= 6 and y >= 10)
    i.recolor({"c"}, "M", lambda x, y: y >= 13)
    for (x, y) in ((12, 9), (13, 3), (10, 12)):
        i.px(x, y, "W")                                     # stars
    i.px(12, 8, "c"); i.px(12, 10, "c"); i.px(11, 9, "c"); i.px(13, 9, "c")
    return i.outline()


def restoration():
    i = Icon()
    i.disc(4.9, 5.3, 3.7, "r"); i.disc(11.1, 5.3, 3.7, "r")
    i.poly([(1.7, 6.5), (14.3, 6.5), (8, 14.4)], "r")
    i.recolor({"r"}, "p", lambda x, y: x + y < 9)
    i.recolor({"r"}, "q", lambda x, y: x + y > 19 or y >= 12)
    i.poly([(8, 4.2), (11, 7.5), (8, 11.2), (5, 7.5)], "y") # inner light
    i.px(8, 7, "W")
    return i.outline()


def destiny():
    i = Icon()
    i.poly([(8, 0), (9.4, 6.6), (16, 8), (9.4, 9.4), (8, 16), (6.6, 9.4), (0, 8), (6.6, 6.6)], "o")
    i.poly([(8, 2.6), (9, 7), (13.4, 8), (9, 9), (8, 13.4), (7, 9), (2.6, 8), (7, 7)], "y")
    i.rect(7, 7, 8, 8, "W")
    for (x, y) in ((3, 3), (12, 3), (3, 12), (12, 12)):
        i.px(x, y, "z")
    return i.outline()

# ---------------------------------------------------------------- attributes

def health():
    i = Icon()
    i.disc(8, 10.2, 4.7, "r")
    i.poly([(8, 0.6), (12.3, 8.6), (3.7, 8.6)], "r")          # blood drop
    i.recolor({"r"}, "p", lambda x, y: x + y < 13 and x <= 7)
    i.recolor({"r"}, "q", lambda x, y: x + y > 20 or y >= 14)
    i.px(5, 10, "W"); i.px(5, 11, "W"); i.px(6, 8, "p")       # glint
    return i.outline()


def magicka():
    i = Icon()
    i.disc(8, 8, 6.4, "m")                                    # orb
    i.recolor({"m"}, "c", lambda x, y: (x - 5.5) ** 2 + (y - 5.5) ** 2 < 9)
    i.recolor({"m"}, "M", lambda x, y: x + y > 18)
    i.recolor({"M"}, "N", lambda x, y: x + y > 22)
    i.px(5, 4, "W"); i.px(4, 5, "W"); i.px(5, 5, "W")         # glint
    i.px(10, 9, "c"); i.px(9, 10, "c"); i.px(11, 10, "c"); i.px(10, 11, "c"); i.px(10, 10, "W")  # spark inside
    return i.outline()


def stamina():
    i = Icon()
    i.poly([(9.6, 0.4), (2.4, 9.4), (7, 9.4), (4.6, 15.6), (13.6, 6.2), (9, 6.2), (12.4, 0.4)], "s")   # bolt
    i.recolor({"s"}, "e", lambda x, y: x + y < 11 or (x <= 5 and y <= 9))
    i.recolor({"s"}, "S", lambda x, y: x + y > 17)
    return i.outline()


# ---------------------------------------------------------------- birthsigns and standing stones
# One medallion for all thirteen: a brass rim around a night sky, the sign's
# figure drawn in starlight. The rim gets the shared outline; the figure,
# drawn inside the sky, does not need one.

def medallion():
    i = Icon()
    i.disc(8, 8, 7.7, "b")
    i.recolor({"b"}, "Y", lambda x, y: x + y < 11)
    i.recolor({"b"}, "B", lambda x, y: x + y > 19)
    i.disc(8, 8, 6.75, "N")
    i.recolor({"N"}, "M", lambda x, y: (x - 4.6) ** 2 + (y - 4.4) ** 2 < 5)   # a little sky glow, top left
    return i


def stars(i, pts, c="c"):
    for x, y in pts:
        i.px(x, y, c)


def sign_warrior():
    i = medallion()
    i.rect(7, 3, 7, 9, "W"); i.rect(8, 3, 8, 9, "c"); i.px(7, 2, "W")     # blade
    i.rect(4, 10, 11, 10, "c"); i.px(4, 9, "c"); i.px(11, 9, "c")         # guard
    i.rect(7, 11, 8, 12, "b"); i.rect(7, 13, 8, 13, "Y")                  # grip, pommel
    stars(i, [(4, 6), (11, 5), (12, 8)])
    return i.outline()


def sign_mage():
    i = medallion()
    i.line(3, 13, 8, 8, "c"); i.line(4, 13, 9, 8, "m")                    # staff
    i.disc(10.4, 5.6, 2.3, "W")                                           # orb
    i.px(11, 6, "c"); i.px(10, 7, "c"); i.px(9, 4, "y")
    stars(i, [(13, 8), (7, 3), (12, 2)], "W")
    stars(i, [(4, 6), (12, 11)])
    return i.outline()


def sign_thief():
    i = medallion()
    i.poly([(2.4, 6.2), (7.2, 7), (8.8, 7), (13.6, 6.2), (12.6, 10.4), (9.4, 10.4), (8, 9.2), (6.6, 10.4), (3.4, 10.4)], "W")   # mask
    i.recolor({"W"}, "c", lambda x, y: y >= 9)
    i.poly([(4.2, 7.6), (6.8, 8.1), (6.2, 9.4), (4.6, 9.2)], "N")         # eye holes
    i.poly([(11.8, 7.6), (9.2, 8.1), (9.8, 9.4), (11.4, 9.2)], "N")
    i.px(2, 7, "c"); i.px(13, 7, "c")                                     # ties
    stars(i, [(8, 12), (5, 4), (11, 4)])
    return i.outline()


def sign_apprentice():
    i = medallion()
    i.rect(3, 6, 7, 11, "W"); i.rect(8, 6, 12, 11, "c")                   # pages
    i.rect(4, 5, 6, 5, "W"); i.rect(9, 5, 11, 5, "c")                     # curled tops
    i.rect(7, 6, 8, 12, "m")                                              # spine
    for y in (7, 9):
        i.rect(4, y, 6, y, "m"); i.rect(9, y, 11, y, "M")                 # lines of text
    stars(i, [(8, 3), (11, 3), (5, 3)], "W")
    return i.outline()


def sign_atronach():
    i = medallion()
    i.rect(6, 3, 9, 5, "W")                                               # head
    i.px(7, 4, "y"); i.px(8, 4, "y")                                      # glowing eyes
    i.rect(4, 6, 11, 9, "W")                                              # shoulders and chest
    i.rect(3, 6, 3, 10, "c"); i.rect(12, 6, 12, 10, "c")                  # arms
    i.rect(5, 10, 10, 10, "c")
    i.rect(5, 11, 6, 13, "c"); i.rect(9, 11, 10, 13, "c")                 # legs
    i.rect(7, 7, 8, 8, "o")                                               # heart stone
    i.recolor({"W"}, "c", lambda x, y: x >= 10)
    return i.outline()


def sign_lady():
    i = medallion()
    for cx, cy in ((8, 5.2), (10.8, 8), (8, 10.8), (5.2, 8)):
        i.disc(cx, cy, 1.6, "W")                                          # petals
    for cx, cy in ((10, 6), (10, 10), (6, 10), (6, 6)):
        i.px(cx, cy, "c")
    i.rect(7, 7, 8, 8, "y")                                               # heart of the flower
    stars(i, [(4, 4), (12, 12), (12, 4)])
    return i.outline()


def sign_lord():
    i = medallion()
    for x in (4, 11):
        i.rect(x, 5, x, 7, "W")
    i.rect(7, 4, 8, 7, "W")                                               # crown points
    i.px(5, 7, "W"); i.px(10, 7, "W")
    i.rect(4, 8, 11, 9, "W")
    i.rect(4, 10, 11, 10, "c")                                            # band
    i.px(6, 10, "o"); i.px(9, 10, "o")                                    # gems
    i.px(7, 3, "y"); i.px(8, 3, "y")
    stars(i, [(5, 12), (10, 12)])
    return i.outline()


def sign_lover():
    i = medallion()
    i.disc(5.9, 6.4, 2.3, "W"); i.disc(10.1, 6.4, 2.3, "W")
    i.poly([(3.6, 7.4), (12.4, 7.4), (8, 12.6)], "W")                     # heart
    i.px(7, 4, "N"); i.px(8, 4, "N"); i.px(7, 5, "N"); i.px(8, 5, "N")    # the notch between the lobes
    i.recolor({"W"}, "c", lambda x, y: x >= 9 and y >= 8)
    i.px(5, 5, "p")
    stars(i, [(3, 11), (12, 11), (8, 2)])
    return i.outline()


def sign_ritual():
    i = medallion()
    for k in range(32):                                                   # the summoning circle
        a = k * math.pi / 16
        i.px(int(round(7.5 + 4.6 * math.cos(a))), int(round(7.5 + 4.6 * math.sin(a))), "c")
    for x, y in ((8, 4), (11, 8), (8, 11), (4, 8)):
        i.px(x if x != 8 else 7, y if y != 8 else 7, "W")
    i.rect(7, 5, 8, 10, "W"); i.rect(5, 7, 10, 8, "W")                    # star at its heart
    i.rect(7, 7, 8, 8, "y")
    return i.outline()


def sign_serpent():
    i = medallion()
    body = [(10, 4), (9, 4), (8, 4), (7, 4), (6, 5), (5, 6), (6, 7), (7, 7), (8, 7), (9, 8), (10, 9),
            (10, 10), (9, 11), (8, 11), (7, 11), (6, 11), (5, 10)]
    for n, (x, y) in enumerate(body):
        i.px(x, y, "W" if n < 9 else "c")
    i.rect(10, 4, 11, 5, "W"); i.px(11, 4, "N")                           # head and eye
    i.px(12, 5, "o")                                                      # tongue
    stars(i, [(4, 9), (12, 9)])
    return i.outline()


def sign_shadow():
    i = medallion()
    i.poly([(2.6, 8), (5.5, 5.4), (10.5, 5.4), (13.4, 8), (10.5, 10.6), (5.5, 10.6)], "c")   # eye
    i.recolor({"c"}, "W", lambda x, y: y <= 7)
    i.disc(8, 8, 2.2, "N"); i.px(7, 7, "m")                               # dark iris
    stars(i, [(5, 3), (11, 12), (12, 4)])
    return i.outline()


def sign_steed():
    i = medallion()
    rows = {3: (8, 8), 4: (7, 9), 5: (6, 10), 6: (5, 10), 7: (4, 10), 8: (4, 10), 9: (7, 10), 10: (7, 11), 11: (6, 11), 12: (5, 11)}
    for y, (a, b) in rows.items():
        i.rect(a, y, b, y, "W")
    i.px(10, 3, "W")                                                      # second ear
    i.rect(4, 8, 6, 8, "c"); i.px(6, 9, "N")                              # muzzle
    i.px(8, 5, "N")                                                       # eye
    i.line(10, 5, 11, 9, "c")                                             # mane
    i.rect(5, 12, 11, 12, "c")
    stars(i, [(3, 5), (12, 4)])
    return i.outline()


def sign_tower():
    i = medallion()
    i.px(5, 3, "W"); i.rect(7, 3, 8, 3, "W"); i.px(10, 3, "W")           # battlements
    i.rect(5, 4, 10, 4, "W")
    i.rect(6, 5, 9, 12, "W"); i.rect(9, 5, 9, 12, "c")                    # tower
    i.rect(7, 7, 8, 7, "y")                                               # lit window
    i.rect(7, 11, 8, 12, "N")                                             # door
    i.rect(4, 12, 11, 12, "c")
    stars(i, [(3, 8), (12, 7), (12, 10)])
    return i.outline()


# ---------------------------------------------------------------- races
# Head-and-shoulders portraits, front on. Same rules as everything else:
# shared outline, light from the top left, one tone up and one down per skin.

def ellipse(i, cx, cy, rx, ry, c, where=None):
    for y in range(16):
        for x in range(16):
            if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1 and (where is None or where(x, y)):
                i.px(x, y, c)


def face(i, ramp, eyes="k", ears=False, cy=7.6, ry=5.0):
    hi, base, lo = ramp
    i.rect(6, 12, 9, 13, base); i.rect(9, 12, 9, 13, lo)       # neck
    if ears:                                                   # pointed elf ears
        for (x, y) in ((2, 5), (2, 6), (3, 6), (3, 7), (3, 8)):
            i.px(x, y, base)
        for (x, y) in ((13, 5), (13, 6), (12, 6), (12, 7), (12, 8)):
            i.px(x, y, lo)
    ellipse(i, 8, cy, 4.3, ry, base)
    i.recolor({base}, hi, lambda x, y: x <= 5 and y <= 8)
    i.recolor({base}, lo, lambda x, y: x >= 11 or (y >= 11 and not (6 <= x <= 8 and y >= 12)))
    i.px(6, 8, eyes); i.px(9, 8, eyes)
    i.px(8, 9, lo)                                             # nose, lit from the left
    return i


def shoulders(i, c, lo, skin=None):
    i.rect(2, 14, 13, 15, c)
    i.rect(10, 14, 13, 15, lo)
    if skin:
        i.rect(6, 12, 9, 13, skin)                             # neck


def race_nord():
    i = Icon()
    shoulders(i, "G", "G"); i.rect(2, 14, 5, 14, "g")            # fur-trimmed armour
    face(i, ("F", "f", "v"), eyes="N")
    i.rect(4, 2, 11, 3, "b"); i.rect(3, 3, 4, 10, "b"); i.rect(11, 3, 12, 10, "B")   # long fair hair
    i.rect(4, 2, 8, 2, "Y"); i.rect(3, 4, 3, 7, "Y")
    i.rect(5, 10, 10, 13, "b"); i.rect(6, 13, 9, 14, "b")        # beard
    i.rect(5, 10, 7, 11, "Y"); i.px(7, 11, "v"); i.px(8, 11, "v")  # beard light, mouth
    i.rect(10, 11, 10, 13, "B")
    return i.outline()


def race_breton():
    i = Icon()
    shoulders(i, "M", "N")                                       # mage's robe
    face(i, ("F", "f", "v"), eyes="d")
    i.rect(4, 2, 11, 4, "d"); i.rect(3, 3, 3, 8, "d"); i.rect(12, 3, 12, 8, "d")      # dark brown hair
    i.rect(5, 2, 8, 2, "B")
    i.px(7, 11, "v"); i.px(8, 11, "v")
    return i.outline()


def race_imperial():
    i = Icon()
    shoulders(i, "q", "R"); i.rect(6, 14, 9, 14, "b")            # red cloak, brass clasp
    face(i, ("F", "f", "v"), eyes="d")
    i.rect(4, 2, 11, 3, "d"); i.px(3, 4, "d"); i.px(12, 4, "d")  # short cropped hair
    i.px(3, 5, "s"); i.px(12, 5, "S"); i.rect(4, 3, 11, 3, "s"); i.px(5, 2, "e"); i.px(10, 2, "s")   # laurel
    i.rect(6, 11, 9, 11, "v")
    return i.outline()


def race_redguard():
    i = Icon()
    shoulders(i, "Y", "b")                                       # desert cloth
    face(i, ("j", "J", "D"), eyes="k")
    i.rect(3, 1, 12, 4, "w"); i.rect(3, 1, 7, 2, "W"); i.rect(10, 3, 12, 4, "g")      # headwrap
    i.rect(3, 5, 3, 8, "w"); i.rect(12, 5, 12, 8, "g")
    i.rect(11, 4, 13, 6, "g")                                    # its tail
    i.rect(6, 11, 9, 11, "D")
    return i.outline()


def race_altmer():
    i = Icon()
    shoulders(i, "y", "b")                                       # gold robes
    face(i, ("A", "a", "i"), eyes="o", ears=True, cy=7.2, ry=5.4)
    i.rect(5, 1, 10, 3, "w"); i.rect(4, 2, 4, 6, "w"); i.rect(11, 2, 11, 6, "g")     # slicked platinum hair
    i.rect(5, 1, 8, 1, "W"); i.rect(9, 3, 10, 3, "g")
    i.px(7, 11, "i"); i.px(8, 11, "i")
    return i.outline()


def race_bosmer():
    i = Icon()
    shoulders(i, "S", "S"); i.rect(2, 14, 6, 14, "s")
    face(i, ("T", "t", "U"), eyes="k", ears=True)
    i.poly([(8, 0.2), (13.2, 4), (12.4, 8.4), (3.6, 8.4), (2.8, 4)], "s")            # leaf-green hood
    ellipse(i, 8, 7.6, 3.6, 4.4, "T", where=lambda x, y: y >= 4 and 4 <= x <= 11)   # face inside it
    i.recolor({"T"}, "t", lambda x, y: x >= 10 or y >= 11)
    i.recolor({"s"}, "S", lambda x, y: x >= 10 or y >= 6)
    i.recolor({"s"}, "e", lambda x, y: x + y < 7)
    i.px(6, 8, "k"); i.px(9, 8, "k"); i.px(8, 9, "U"); i.px(7, 11, "U"); i.px(8, 11, "U")
    return i.outline()


def race_dunmer():
    i = Icon()
    shoulders(i, "d", "d"); i.rect(2, 14, 5, 14, "B")           # chitin
    face(i, ("H", "h", "l"), eyes="r", ears=True)
    i.rect(4, 2, 11, 3, "k"); i.px(5, 1, "k"); i.px(8, 1, "k"); i.px(10, 1, "k")     # spiky black hair
    i.px(3, 3, "k"); i.px(12, 3, "k"); i.rect(4, 4, 4, 5, "k")
    i.px(6, 8, "o"); i.px(7, 11, "l"); i.px(8, 11, "l")
    return i.outline()


def race_orsimer():
    i = Icon()
    shoulders(i, "G", "G"); i.rect(2, 14, 5, 14, "g")           # iron
    face(i, ("E", "n", "u"), eyes="k", cy=8, ry=4.8)
    ellipse(i, 8, 9.4, 5.2, 3.4, "n", where=lambda x, y: y >= 9)  # broad jaw
    i.recolor({"n"}, "u", lambda x, y: x >= 11 and y >= 9)
    i.rect(6, 1, 9, 3, "k"); i.rect(7, 0, 8, 0, "k")            # topknot
    i.rect(5, 7, 10, 7, "u")                                    # heavy brow
    i.px(5, 11, "W"); i.px(5, 10, "W"); i.px(10, 11, "W"); i.px(10, 10, "w")         # tusks
    i.rect(6, 12, 9, 12, "u")
    return i.outline()


def race_khajiit():
    i = Icon()
    shoulders(i, "B", "d")
    i.poly([(2.2, 0.8), (6.4, 4), (3, 6.6)], "Q"); i.poly([(13.8, 0.8), (9.6, 4), (13, 6.6)], "V")   # ears
    i.px(3, 3, "p"); i.px(12, 3, "q")
    ellipse(i, 8, 8, 5.4, 5.0, "Q")
    i.recolor({"Q"}, "K", lambda x, y: x <= 6 and y <= 8)
    i.recolor({"Q"}, "V", lambda x, y: x >= 12 or y >= 12)
    ellipse(i, 8, 10.6, 2.6, 1.8, "K")                          # muzzle
    i.px(5, 4, "V"); i.px(8, 4, "V"); i.px(7, 3, "V"); i.px(10, 4, "V")             # stripes
    i.px(3, 9, "V"); i.px(12, 9, "d")
    i.px(5, 8, "y"); i.px(6, 8, "s"); i.px(9, 8, "y"); i.px(10, 8, "s")             # cat eyes
    i.px(7, 10, "q"); i.px(8, 10, "q")                          # nose
    return i.outline()


def race_argonian():
    i = Icon()
    shoulders(i, "d", "d")
    ellipse(i, 8, 7.4, 4.8, 4.6, "s")                           # skull
    i.poly([(4, 8), (12, 8), (11.4, 13), (4.6, 13)], "s")        # long snout
    i.recolor({"s"}, "e", lambda x, y: x <= 6 and y <= 8)
    i.recolor({"s"}, "S", lambda x, y: x >= 11 or y >= 12)
    for (x, y) in ((4, 2), (3, 1), (11, 2), (12, 1), (6, 2), (9, 2)):
        i.px(x, y, "b")                                         # horns
    i.px(3, 0, "Y"); i.px(12, 0, "B")
    i.px(5, 7, "y"); i.px(10, 7, "y"); i.px(5, 8, "k"); i.px(10, 8, "k")             # reptile eyes
    i.px(6, 12, "S"); i.px(9, 12, "S")                          # nostrils
    i.rect(5, 10, 10, 10, "S")
    return i.outline()


# ---------------------------------------------------------------- level markers
# Planner marks in the level card and pinned bar (approved set 11 Oct 2026).

def trainer():
    i = Icon()
    i.rect(7, 10, 8, 14, "B"); i.rect(8, 10, 8, 14, "d")          # post
    i.rect(5, 15, 10, 15, "d")                                     # foot
    i.rect(1, 6, 14, 7, "B"); i.rect(1, 6, 14, 6, "b")             # crossbar arms
    i.rect(4, 4, 11, 11, "b")                                      # straw body
    i.disc(8, 2.6, 2.2, "b")                                       # straw head
    i.recolor({"b"}, "Y", lambda x, y: x <= 5 or y <= 1)
    i.recolor({"b"}, "B", lambda x, y: x >= 10 and y >= 5)
    i.rect(4, 8, 11, 8, "d")                                       # rope band
    i.disc(8, 9.5, 1.6, "r", where=lambda x, y: y >= 9)            # painted target
    i.px(7, 9, "p")
    return i.outline()


def skill_book():
    i = Icon()
    i.rect(3, 1, 12, 14, "r")                                      # leather cover
    i.rect(12, 2, 13, 13, "Y"); i.rect(13, 2, 13, 13, "b")         # page edges
    i.rect(2, 1, 3, 14, "q")                                       # spine
    i.recolor({"r"}, "p", lambda x, y: x <= 5 and y <= 5)
    i.recolor({"r"}, "q", lambda x, y: x >= 10 and y >= 10)
    for (x, y) in ((4, 2), (11, 2), (4, 13), (11, 13)):
        i.px(x, y, "b")                                            # brass corners
    i.px(4, 2, "Y")
    i.rect(11, 7, 14, 8, "b"); i.px(11, 7, "Y"); i.px(14, 8, "B")  # clasp
    i.poly([(7.5, 4.5), (9.5, 7.5), (7.5, 10.5), (5.5, 7.5)], "y")  # cover emblem
    return i.outline()


def banked():
    i = Icon()
    i.poly([(2, 7), (2, 5), (4, 3), (12, 3), (14, 5), (14, 7)], "b")   # lid
    i.rect(2, 8, 14, 14, "B")                                           # chest
    i.recolor({"b"}, "Y", lambda x, y: y <= 4 or x <= 3)
    i.recolor({"B"}, "b", lambda x, y: x <= 4)
    i.recolor({"B"}, "d", lambda x, y: x >= 12 or y >= 14)
    i.rect(2, 7, 14, 7, "G")                                            # lid seam band
    for x in (4, 12):
        i.rect(x, 3, x, 14, "g")                                        # iron straps
    i.rect(7, 6, 9, 10, "w"); i.rect(9, 6, 9, 10, "g")                  # lock plate
    i.px(8, 8, "k")                                                     # keyhole
    return i.outline()


def perk_point():
    i = Icon()
    i.disc(8, 8, 7, "R")                                           # glow halo
    i.disc(8, 8, 5.6, ".")
    i.disc(8, 8, 4.6, "o")                                         # the star, as taken in the trees
    i.recolor({"o"}, "y", lambda x, y: (x - 6.5) ** 2 + (y - 6.5) ** 2 < 4)
    i.recolor({"o"}, "O", lambda x, y: x + y > 18)
    i.px(6, 6, "W")
    i.recolor({"R"}, "O", lambda x, y: x + y < 10)
    return i.outline()


def note():
    i = Icon()
    i.poly(leaf(7.4, 9, 14.2, 0.8, 2.3, 1.3, 0.7), "W")           # quill feather
    i.recolor({"W"}, "w", lambda x, y: x + y > 15)
    i.line(7, 9, 12, 3, "g")                                       # shaft
    i.disc(6, 11.8, 4, "k", where=lambda x, y: y >= 9)             # inkwell
    i.rect(3, 8, 9, 9, "g"); i.rect(3, 8, 5, 8, "w")               # its rim
    i.px(3, 11, "M"); i.px(3, 12, "M"); i.px(4, 10, "N")           # ink sheen
    return i.outline()


# ---------------------------------------------------------------- Tapps, the first-time guide (WO-61)
# A goofy Nord barbarian: crooked horned helmet with one horn drooping, a braided blond beard with
# ember beads, a squint and a gap-toothed grin, a red wool tunic, a tankard of mead. Drawn by hand
# pixel by pixel (Dave picked this draw on the canvas, 13 Oct), outline included, light from the
# top left, the planner's palette. `tapps` is 24x24 with the tankard; `tapps-point` is 30x30 with
# his free arm out, pointing left (mirrored with CSS to point right).

class Sprite:
    """A hand-drawn icon of any size, from rows of palette letters ("." is clear)."""

    def __init__(self, rows):
        self.g = [list(r) for r in rows]


TAPPS_ROWS = [
    "..x.....................",
    ".xYx....................",
    ".xYx.....xxxxxxx........",
    "..xYx...xWWWWwwwx.......",
    "..xYYx.xWWWWwwwwwxxx....",
    "..xbYYxWWWWwwwwwggYYx...",
    "...xbbWWWWwwwwwgggbbYx..",
    "....xggYggggYggGGYGbbx..",
    ".....xxxFFFFfffffxxxbbx.",
    ".......xWxFfffxxfx..xbx.",
    "......xFFxfFffffvvx..xbx",
    "......xFFffvvqfvvvx...x.",
    "......xbYYbbbbbbbbxxxx..",
    ".....xbYYWWWkWWWbbbWWwx.",
    ".....xYYYYRRRRRbbBBWWWx.",
    "...xxpYYYbbbbbbbBBBBBdx.",
    "..xFfpYYbbbbbbbBBBBgggGx",
    "..xffppbbbbbbbBBBBbBBdGx",
    ".xffrrrbbbbbbBBBBBbBBdGx",
    ".xffrrrrbbBbBBbBBrggggx.",
    "..xxdddddYbBBBYbddbBBdx.",
    "...xrrrrrOorrrOorrrqqx..",
    "...xrrrrrYbrrrYbrrrqqx..",
    "....xxxxxxxxxxxxxxxxx...",
]


TAPPS_POINT_ROWS = [
    "..............................",
    "..............................",
    "..............................",
    "..............................",
    "........x.....................",
    ".......xYx....................",
    ".......xYx.....xxxxxxx........",
    "........xYx...xWWWWwwwx.......",
    "........xYYx.xWWWWwwwwwxxx....",
    "........xbYYxWWWWwwwwwggYYx...",
    ".........xbbWWWWwwwwwgggbbYx..",
    "..........xggYggggYggGGYGbbx..",
    "...........xxxFFFFfffffxxxbbx.",
    ".............xWxFfffxxfx..xbx.",
    "............xFFxfFffffvvx..xbx",
    "............xFFffvvqfvvvx...x.",
    "............xbYYbbbbbbbbxxxx..",
    "...........xbYYWWWkWWWbbbWWwx.",
    ".xxxx......xYYYYRRRRRbbBBWWWx.",
    "xFFFfxxxxxxpYYYbbbbbbbBBBBBdx.",
    ".xxffFFFfffpYYbbbbbbbBBBBgggGx",
    "..xffffffvvppbbbbbbbBBBBbBBdGx",
    "...xxxxxxxrrrbbbbbbBBBBBbBBdGx",
    ".........xrrrrbbBbBBbBBrggggx.",
    ".........xrrrrrYbBBBYbddbBBdx.",
    ".........xrrrrrOorrrOorrrqqx..",
    ".........xrrrrrYbrrrYbrrrqqx..",
    "..........xxxxxxxxxxxxxxxxx...",
    "..............................",
    "..............................",
]


def tapps():
    return Sprite(TAPPS_ROWS)


def tapps_point():
    return Sprite(TAPPS_POINT_ROWS)


# ---------------------------------------------------------------- build page tabs (WO-60)

def tab_levels():
    # A wooden ladder: two rails, five rungs; light from the top left.
    i = Icon()
    i.rect(3, 1, 4, 14, "b"); i.rect(11, 1, 12, 14, "B")       # rails
    i.rect(3, 1, 3, 14, "Y"); i.rect(12, 1, 12, 14, "d")       # lit and shaded edges
    for y in (2, 5, 8, 11, 14):
        i.rect(5, y, 10, y, "b")                                # rungs
        i.rect(5, y, 6, y, "Y")
        i.px(10, y, "B")
    return i.outline()


def tab_guide():
    # An open book with an ember ribbon down the middle.
    i = Icon()
    i.rect(1, 3, 7, 12, "Y"); i.rect(8, 3, 14, 12, "b")       # pages, left lit, right in shade
    i.rect(1, 12, 7, 13, "b"); i.rect(8, 12, 14, 13, "B")     # page edges below
    i.px(1, 3, "W"); i.px(14, 3, "B")
    for y in (5, 7, 9):
        i.rect(2, y, 6, y, "g")                                 # lines of text, left
        i.rect(9, y, 13, y, "G")                                # and right
    i.rect(7, 2, 8, 13, "d")                                    # spine
    i.rect(7, 1, 8, 9, "o"); i.px(7, 1, "y")                    # ribbon
    i.px(7, 10, "O"); i.px(8, 10, "O"); i.px(7, 11, "R")        # its forked end
    return i.outline()


# ---------------------------------------------------------------- gear slots

def power():
    # An active ability: an open hand with magicka in the palm
    i = Icon()
    i.rect(3, 3, 4, 9, "F"); i.rect(6, 2, 7, 9, "F"); i.rect(9, 3, 10, 9, "f"); i.rect(12, 5, 13, 9, "f")
    i.rect(5, 4, 5, 8, "F"); i.rect(8, 3, 8, 8, "f"); i.rect(11, 4, 11, 8, "f")
    for x, y0 in ((5, 3), (8, 2), (11, 3)):
        i.line(x, y0, x, 7, "v")                            # gaps between the fingers
    i.rect(3, 8, 13, 12, "F")                               # palm
    i.recolor({"F"}, "f", lambda x, y: x >= 9)
    i.recolor({"f"}, "v", lambda x, y: x >= 12 and y >= 10)
    i.px(1, 7, "F"); i.px(2, 8, "F"); i.px(1, 8, "F"); i.px(2, 9, "F"); i.px(2, 10, "F")   # thumb
    i.rect(5, 13, 11, 14, "f"); i.rect(10, 13, 11, 14, "v")                             # wrist
    i.disc(8, 10, 2.7, "m"); i.disc(7.6, 9.6, 1.3, "c"); i.px(7, 9, "W"); i.px(9, 11, "M"); i.px(10, 10, "M"); i.px(8, 12, "M")
    for x, y in ((1, 3), (14, 2), (15, 6), (0, 11)):
        i.px(x, y, "z")                                     # sparks
    return i.outline()


def slot_main_hand():
    i = Icon()
    i.line(2, 14, 8, 8, "b"); i.line(3, 14, 9, 8, "B")             # haft
    i.px(1, 15, "G"); i.px(2, 15, "G")                             # pommel
    i.disc(10.6, 5.4, 3.2, "w")                                    # mace head
    for (x, y) in ((10, 0), (11, 0), (15, 5), (15, 6), (6, 4), (6, 5), (10, 10)):
        i.px(x, y, "g")                                            # flanges
    i.recolor({"w"}, "W", lambda x, y: x + y < 15)
    i.recolor({"w"}, "g", lambda x, y: x + y > 17)
    return i.outline()


def slot_off_hand():
    i = Icon()
    i.line(4, 15, 9, 7, "B"); i.line(5, 15, 10, 7, "d")            # torch handle
    i.rect(8, 5, 11, 7, "d"); i.rect(8, 5, 9, 5, "B")              # wrapped head
    i.poly(leaf(9.6, 5.6, 11.4, 0.2, 2.8, 2.6, 0.6), "o")          # flame
    i.poly(leaf(9.8, 5.2, 10.8, 2.0, 1.4, 1.2, 0.6), "y")
    return i.outline()


def slot_head():
    i = Icon()
    i.disc(8, 8, 6, "w", where=lambda x, y: y <= 9)                # dome
    i.rect(2, 8, 4, 13, "w"); i.rect(11, 8, 13, 13, "g")           # cheek guards
    i.recolor({"w"}, "W", lambda x, y: x + y < 10)
    i.recolor({"w"}, "g", lambda x, y: x >= 11)
    i.rect(5, 8, 10, 9, "k"); i.rect(7, 8, 8, 12, "g")             # eye slit, nose guard
    i.px(7, 8, "w")
    i.rect(7, 2, 8, 6, "G")                                        # crest ridge
    i.px(1, 3, "Y"); i.px(1, 4, "b"); i.px(2, 5, "b")              # horns
    i.px(14, 3, "b"); i.px(14, 4, "B"); i.px(13, 5, "B")
    return i.outline()


def slot_body():
    i = Icon()
    i.rect(1, 3, 4, 7, "b"); i.rect(11, 3, 14, 7, "B")             # sleeves
    i.poly([(3.5, 2), (6, 2), (8, 4.5), (10, 2), (12.5, 2), (12.5, 14.5), (3.5, 14.5)], "b")   # leather jerkin
    i.recolor({"b"}, "Y", lambda x, y: x <= 4 and y <= 7 or (x <= 5 and y <= 3))
    i.recolor({"b"}, "B", lambda x, y: x >= 11 and y >= 3)
    i.rect(4, 10, 12, 10, "d"); i.px(8, 10, "Y")                   # belt and buckle
    for y in (6, 8):
        i.px(7, y, "d"); i.px(9, y, "d")                           # laces
    i.px(8, 5, "d"); i.px(8, 7, "d")
    return i.outline()


def slot_hands():
    i = Icon()
    i.rect(4, 11, 11, 14, "g"); i.rect(4, 11, 11, 11, "w")         # cuff
    i.rect(4, 6, 11, 10, "w")                                      # back of the hand
    for x0, top in ((4, 2), (7, 1), (10, 2)):
        i.rect(x0, top, x0 + 1, 6, "w")                            # three plated fingers
        i.px(x0, top + 2, "G"); i.px(x0 + 1, top + 2, "G")         # finger joints
    i.rect(12, 7, 13, 9, "w"); i.px(14, 6, "w"); i.px(14, 5, "w")  # thumb
    i.recolor({"w"}, "W", lambda x, y: x in (4, 7, 10) and y <= 6 or x <= 5)
    i.recolor({"w"}, "g", lambda x, y: x >= 11 and y >= 7)
    i.rect(4, 13, 11, 13, "b")                                     # cuff trim
    return i.outline()


def slot_feet():
    i = Icon()
    i.rect(4, 1, 9, 10, "b")                                       # shaft
    i.poly([(4, 9), (9.5, 9), (14.5, 11.5), (14.5, 14.5), (4, 14.5)], "b")   # foot
    i.recolor({"b"}, "Y", lambda x, y: x <= 5 and y <= 10)
    i.recolor({"b"}, "B", lambda x, y: x >= 8 and y <= 9 or y >= 13)
    i.rect(4, 14, 14, 14, "d")                                     # sole
    i.rect(3, 1, 10, 2, "d"); i.rect(3, 1, 6, 1, "B")              # fold-over cuff
    i.rect(4, 6, 9, 6, "d")                                        # strap
    return i.outline()


def slot_ring():
    i = Icon()
    ellipse(i, 8, 9.5, 5.6, 4.8, "a")
    ellipse(i, 8, 9.8, 3.4, 2.8, ".")
    i.recolor({"a"}, "A", lambda x, y: x <= 5 and y <= 10)
    i.recolor({"a"}, "i", lambda x, y: x >= 11 or y >= 13)
    i.rect(6, 2, 10, 5, "a"); i.rect(6, 2, 7, 3, "A")              # setting
    i.rect(7, 1, 9, 4, "M"); i.px(7, 1, "c"); i.px(7, 2, "c"); i.px(9, 4, "N")   # gem
    return i.outline()


def slot_amulet():
    i = Icon()
    i.line(2, 1, 6, 8, "b"); i.line(13, 1, 9, 8, "B")              # chain
    i.px(2, 1, "Y")
    i.disc(8, 11, 3.8, "a")                                        # pendant
    i.recolor({"a"}, "A", lambda x, y: x + y < 17)
    i.recolor({"a"}, "i", lambda x, y: x + y > 21)
    i.disc(8, 11, 1.8, "r"); i.px(7, 10, "p")                      # stone
    return i.outline()


def slot_ammo():
    i = Icon()
    i.poly([(3, 6), (7, 4.5), (13, 13.5), (9, 15)], "B")           # quiver
    i.recolor({"B"}, "b", lambda x, y: x - y > -3)
    i.recolor({"B"}, "d", lambda x, y: x - y < -5)
    i.line(4, 7, 8, 6, "d")                                        # rim band
    for (x, y) in ((3, 2), (5, 1), (7, 2)):                        # three arrows' fletching
        i.px(x, y, "o"); i.px(x + 1, y + 1, "O"); i.px(x, y + 1, "o")
        i.line(x + 1, y + 2, x + 2, y + 4, "Y")
    return i.outline()


def slot_other():
    i = Icon()
    for (x, y) in ((4, 4), (4, 3), (5, 2), (6, 1), (7, 1), (8, 1), (9, 1), (10, 2), (11, 3), (11, 4)):
        i.px(x, y, "d")                                            # strap
    i.rect(2, 5, 13, 14, "b")                                      # satchel
    i.rect(2, 5, 13, 9, "B"); i.rect(2, 5, 13, 5, "b")             # flap
    i.recolor({"b"}, "Y", lambda x, y: x <= 3 and y >= 10)
    i.recolor({"b"}, "B", lambda x, y: x >= 12 and y >= 10)
    i.rect(7, 8, 8, 11, "Y"); i.px(8, 11, "b")                     # buckle
    i.rect(2, 14, 13, 14, "d")
    return i.outline()


# ---------------------------------------------------------------- game modes

def mode_konahrik():
    i = Icon()
    i.poly([(2, 4), (5, 1), (8, 3), (11, 1), (14, 4), (13.5, 10), (10, 15), (6, 15), (2.5, 10)], "a")   # gold mask
    i.recolor({"a"}, "A", lambda x, y: x <= 6 and y <= 9)
    i.recolor({"a"}, "i", lambda x, y: x >= 11 or y >= 13)
    i.rect(4, 6, 6, 7, "k"); i.rect(9, 6, 11, 7, "k")              # eye slits
    i.rect(7, 4, 8, 11, "a"); i.px(7, 4, "A")                      # nose ridge
    i.rect(6, 12, 9, 12, "k")                                      # mouth
    i.px(5, 2, "y"); i.px(4, 3, "y")                               # shine
    return i.outline()


def mode_naaktiid():
    i = Icon()
    ellipse(i, 8, 14, 6.5, 2.4, "d", where=lambda x, y: y >= 12)   # mound of earth
    i.recolor({"d"}, "B", lambda x, y: x <= 6)
    i.rect(7, 6, 8, 12, "s"); i.rect(8, 6, 8, 12, "S")             # stem
    i.poly(leaf(7.5, 7, 1.6, 3.2, 1.8, 1.8, 0.8), "s")             # left leaf
    i.poly(leaf(8.5, 5.5, 14.4, 1.6, 1.8, 1.8, 0.8), "s")          # right leaf
    i.recolor({"s"}, "e", lambda x, y: x <= 5 or (x <= 10 and y <= 3))
    i.recolor({"s"}, "S", lambda x, y: x >= 12)
    return i.outline()


# ---------------------------------------------------------------- tags

def tag_shield():
    i = Icon()
    i.poly([(3, 1.5), (13, 1.5), (13, 6), (8, 15.4), (3, 6)], "g")    # steel rim
    i.poly([(4.2, 2.6), (11.8, 2.6), (11.8, 6), (8, 13.4), (4.2, 6)], "M")   # painted field
    i.recolor({"M"}, "m", lambda x, y: x <= 6 and y <= 6)
    i.recolor({"M"}, "N", lambda x, y: x >= 10 or y >= 10)
    i.recolor({"g"}, "W", lambda x, y: x <= 3 or y <= 1)
    i.disc(8, 6, 1.7, "w"); i.px(7, 5, "W")                        # boss
    return i.outline()


def tag_unarmored():
    i = Icon()
    i.rect(3, 2, 12, 9, "f")                                       # bare fist
    i.rect(4, 1, 11, 1, "f")
    i.recolor({"f"}, "F", lambda x, y: x <= 5 or y <= 2)
    i.recolor({"f"}, "v", lambda x, y: x >= 11)
    for x in (5, 7, 9):
        i.rect(x, 2, x, 5, "v")                                    # between the fingers
    i.rect(3, 6, 9, 7, "F"); i.rect(3, 7, 9, 7, "f")               # thumb folded across
    i.px(10, 6, "v")
    i.rect(4, 10, 11, 14, "Y")                                     # cloth hand wraps
    for (x, y) in ((4, 11), (6, 10), (8, 12), (10, 11), (5, 13), (9, 14), (11, 13)):
        i.px(x, y, "b")
    i.recolor({"Y"}, "b", lambda x, y: x >= 11)
    return i.outline()


def tag_spellsword():
    i = Icon()
    i.line(13, 2, 6, 9, "c"); i.line(13, 3, 7, 9, "m")             # blade, magicka-lit
    i.px(14, 1, "W")
    for (x, y) in ((11, 2), (9, 4), (12, 5), (7, 6), (10, 7)):
        i.px(x, y, "m")                                            # flame along it
    i.px(12, 0, "c"); i.px(14, 4, "c")
    i.line(3, 7, 8, 12, "b"); i.px(3, 7, "Y"); i.px(4, 8, "Y")     # crossguard
    i.line(5, 11, 3, 13, "d")                                      # grip
    i.px(2, 14, "M")                                               # pommel stone
    return i.outline()


def tag_necromancy():
    i = Icon()
    i.poly([(4, 15), (4, 7), (5, 5), (8, 4), (11, 5), (12, 7), (12, 15)], "g")   # gravestone
    i.recolor({"g"}, "w", lambda x, y: x <= 6 and y <= 9)
    i.recolor({"g"}, "G", lambda x, y: x >= 11 or y >= 14)
    i.rect(7, 7, 8, 12, "G"); i.rect(6, 8, 9, 8, "G")              # carved cross
    i.px(10, 10, "k"); i.px(9, 11, "k")                            # crack
    i.rect(2, 15, 14, 15, "S")                                     # grave earth
    for (x, y) in ((6, 2), (7, 1), (9, 2), (10, 0), (8, 3)):
        i.px(x, y, "e")                                            # rising wisp
    return i.outline()


def tag_shouts():
    i = Icon()
    rows = [
        "................",
        "..hh............",
        "...hhh..........",
        "....gwwwwg......",
        "...gwwwwwwwg....",
        "..gwwwowwwwwwg..",
        "..gwwwwwwwwwwwwg",
        "..ggwwwwwgWgWgg.",
        "...gggcccmm.....",
        "...gGcccmm.m..m.",
        "...gGGgcm.m.....",
        "...gGGGGgWgW....",
        "....gGGGGGGGGg..",
        ".....ggGGGGgg...",
    ]
    look = {"h": "b", "w": "w", "g": "g", "G": "G", "o": "o", "W": "W", "c": "c", "m": "m"}
    for y, row in enumerate(rows):
        for x, c in enumerate(row):
            if c in look:
                i.px(x, y, look[c])
    i.recolor({"w"}, "W", lambda x, y: y <= 4 and x <= 7)
    return i.outline()


def tag_tank():
    i = Icon()
    i.rect(3, 1, 12, 13, "g")                                      # tower shield
    i.rect(4, 2, 11, 12, "w")
    i.recolor({"w"}, "W", lambda x, y: x <= 5)
    i.recolor({"w"}, "g", lambda x, y: x >= 10)
    i.rect(7, 2, 8, 12, "b"); i.rect(7, 2, 7, 12, "Y")             # brass spine
    for (x, y) in ((4, 2), (11, 2), (4, 12), (11, 12)):
        i.px(x, y, "G")                                            # rivets
    i.rect(1, 14, 14, 15, "d"); i.rect(1, 14, 14, 14, "S")         # ground it stands in
    return i.outline()


def tag_beginner():
    i = Icon()
    i.rect(7, 2, 8, 15, "B"); i.rect(7, 2, 7, 15, "b")             # post
    i.poly([(9, 3), (14, 3), (15.5, 4.5), (14, 6), (9, 6)], "b")   # sign to the right
    i.poly([(7, 8), (2, 8), (0.5, 9.5), (2, 11), (7, 11)], "b")    # sign to the left
    i.recolor({"b"}, "Y", lambda x, y: y in (3, 8))
    i.recolor({"b"}, "B", lambda x, y: y in (6, 11))
    i.rect(10, 4, 12, 4, "d"); i.rect(3, 9, 5, 9, "d")             # carved lettering
    i.rect(5, 15, 10, 15, "S")
    return i.outline()


def tag_roleplay():
    i = Icon()
    ellipse(i, 10.6, 6, 4.2, 4.8, "g")                             # the sad mask, behind
    i.recolor({"g"}, "w", lambda x, y: x <= 9 and y <= 4)
    i.recolor({"g"}, "G", lambda x, y: x >= 13)
    i.rect(9, 4, 10, 5, "k"); i.rect(12, 4, 13, 5, "k")
    i.rect(10, 8, 12, 8, "k"); i.px(9, 9, "k"); i.px(13, 9, "k"); i.px(11, 7, "G")   # down-turned mouth
    ellipse(i, 5.8, 9.6, 4.4, 5.2, "a")                            # the merry mask, in front
    i.recolor({"a"}, "A", lambda x, y: x <= 4 and y <= 9)
    i.recolor({"a"}, "i", lambda x, y: x >= 9 or y >= 14)
    i.px(2, 7, "k"); i.rect(3, 8, 4, 8, "k"); i.px(9, 7, "k"); i.rect(7, 8, 8, 8, "k")   # slanted eye holes
    i.px(3, 10, "k"); i.rect(4, 11, 7, 11, "k"); i.px(8, 10, "k"); i.rect(5, 12, 6, 12, "k")   # open grin
    i.px(5, 14, "."); i.px(6, 14, "a")
    i.line(1, 9, 0, 13, "r"); i.px(1, 14, "q")                     # ribbon
    return i.outline()




# ---------------------------------------------------------------- the logo (WO-38): a four-point star that glints

def logo(frame=0):
    """Frame 0 is the star at rest; 1 to 3 are the glint played every 10 seconds."""
    i = Icon()
    t = {0: 0.0, 1: 0.0, 2: 0.6, 3: 0.3}[frame]
    i.poly([(8, 0.3 - t), (10.2, 5.8), (15.7 + t, 8), (10.2, 10.2), (8, 15.7 + t), (5.8, 10.2), (0.3 - t, 8), (5.8, 5.8)], "a")
    i.recolor({"a"}, "A", lambda x, y: x <= 7 and y <= 7)
    i.recolor({"a"}, "i", lambda x, y: x >= 8 and y >= 8)
    i.poly([(8, 2.6), (9.4, 6.6), (13.4, 8), (9.4, 9.4), (8, 13.4), (6.6, 9.4), (2.6, 8), (6.6, 6.6)], "o")
    i.recolor({"o"}, "y", lambda x, y: x <= 7 and y <= 7)
    i.rect(7, 7, 8, 8, "y")
    if frame >= 1:
        i.rect(7, 7, 8, 8, "W")
    if frame == 2:
        i.rect(7, 6, 8, 9, "W"); i.rect(6, 7, 9, 8, "W")
    i.outline()
    if frame == 2:                                                 # diagonal rays, no outline
        for d in (2, 3, 4):
            for (x, y) in ((7 - d, 7 - d), (8 + d, 7 - d), (7 - d, 8 + d), (8 + d, 8 + d)):
                if i.g[y][x] in (".", "x"):
                    i.g[y][x] = "z"
    if frame == 3:
        for (x, y) in ((4, 4), (11, 4), (4, 11), (11, 11)):
            if i.g[y][x] in (".", "x"):
                i.g[y][x] = "z"
    return i

# ---------------------------------------------------------------- deities (Wintersun)
def ring(i, cx, cy, ro, ri, c, where=None):
    for y in range(16):
        for x in range(16):
            d = (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2
            if ri * ri < d <= ro * ro and (where is None or where(x, y)):
                i.px(x, y, c)

def spark(i, x, y, c="y", core="W"):
    i.px(x, y, core)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        i.px(x + dx, y + dy, c)


# The Nine Divines

def deity_akatosh():
    # Time: an hourglass, brass frame, ember sand
    i = Icon()
    i.poly([(4.5, 3), (11.5, 3), (8.7, 7.5), (8.7, 8.5), (11.5, 13), (4.5, 13), (7.3, 8.5), (7.3, 7.5)], "c")
    i.recolor({"c"}, "w", lambda x, y: x >= 9)
    i.poly([(5.6, 4), (10.4, 4), (8, 7.6)], "o")
    i.recolor({"o"}, "y", lambda x, y: x <= 7 and y <= 5)
    i.px(7, 9, "y"); i.px(7, 10, "y")
    i.poly([(4.8, 13), (11.2, 13), (8, 10.4)], "o")
    i.recolor({"o"}, "O", lambda x, y: x >= 9 and y >= 11)
    i.rect(3, 3, 3, 12, "B"); i.rect(12, 3, 12, 12, "d")
    i.rect(2, 1, 13, 2, "b"); i.rect(2, 13, 13, 14, "b")
    i.rect(2, 1, 8, 1, "Y"); i.rect(2, 14, 13, 14, "B")
    return i.outline()


def deity_arkay():
    # Life and death, the burial rites: a lit funeral candle on a dish
    i = Icon()
    i.rect(6, 6, 9, 12, "w"); i.rect(6, 6, 7, 12, "W"); i.rect(9, 6, 9, 12, "g")
    i.px(6, 7, "W"); i.px(5, 8, "W"); i.px(10, 9, "w")               # drips
    i.line(8, 4, 8, 5, "k")                                          # wick
    i.poly(leaf(7.9, 5.2, 7.6, 0.2, 1.9, 1.9, 0.6), "o")
    i.poly(leaf(7.9, 5.0, 7.7, 2.2, 0.9, 0.9, 0.6), "y")
    i.rect(2, 13, 13, 13, "b"); i.rect(3, 14, 12, 14, "B"); i.rect(2, 13, 6, 13, "Y")
    return i.outline()


def deity_dibella():
    # Beauty: a rose
    i = Icon()
    i.line(8, 9, 8, 15, "S"); i.line(7, 10, 7, 15, "s")
    i.poly(leaf(7, 13, 2.5, 10.5, 1.4, 1.2, 0.8), "s")
    i.poly(leaf(8, 12, 13, 10, 1.3, 1.3, 0.8), "S")
    i.disc(8, 5.5, 4.6, "r")
    i.recolor({"r"}, "p", lambda x, y: x + y <= 9)
    i.recolor({"r"}, "q", lambda x, y: x + y >= 16)
    i.px(7, 4, "q"); i.px(8, 4, "q"); i.px(9, 5, "q"); i.px(9, 6, "q"); i.px(8, 7, "q"); i.px(6, 6, "q"); i.px(6, 5, "q")
    i.px(8, 5, "p"); i.px(7, 5, "r")
    return i.outline()


def deity_julianos():
    # Wisdom and logic: an open tome
    i = Icon()
    i.poly([(1, 5), (7.6, 6), (8.4, 6), (15, 5), (15, 14), (8.4, 15), (7.6, 15), (1, 14)], "N")
    i.poly([(1.5, 3.5), (7.6, 4.5), (7.6, 13.5), (1.5, 12.5)], "W")
    i.poly([(8.4, 4.5), (14.5, 3.5), (14.5, 12.5), (8.4, 13.5)], "w")
    for y in (6, 8, 10):
        i.line(3, y, 6, y + 1, "g"); i.line(10, y + 1, 13, y, "G")
    i.rect(7, 5, 8, 14, "M")
    return i.outline()


def deity_kynareth():
    # The sky and the winds: a swallow in flight
    i = Icon()
    i.poly([(7.4, 6.4), (0.6, 4.2), (1.2, 6.8), (6.6, 10.2)], "m")
    i.poly([(8.6, 6.4), (15.4, 4.2), (14.8, 6.8), (9.4, 10.2)], "M")
    i.recolor({"m"}, "c", lambda x, y: y <= 5)
    i.poly([(7, 10.6), (5, 15.4), (8, 12.8), (11, 15.4), (9, 10.6)], "N")
    ellipse(i, 8, 8.4, 1.9, 3.1, "M")
    i.recolor({"M"}, "W", lambda x, y: 7 <= x <= 8 and y >= 8)
    i.disc(8, 4.4, 1.7, "N")
    i.px(7, 3, "M")
    return i.outline()


def deity_mara():
    # Love and marriage: two rings joined
    i = Icon()
    ellipse(i, 10, 7, 4.6, 4.6, "a"); ellipse(i, 10, 7, 2.6, 2.6, ".")
    ellipse(i, 6, 10, 4.6, 4.6, "a", where=lambda x, y: not (x >= 9 and y <= 6)); ellipse(i, 6, 10, 2.6, 2.6, ".")
    i.recolor({"a"}, "A", lambda x, y: x + y <= 9 or (x <= 10 and y <= 3))
    i.recolor({"a"}, "i", lambda x, y: x + y >= 21 or (y >= 13 and x >= 6))
    # the first ring passes back over the second at the crossing
    i.px(8, 10, "a"); i.px(9, 9, "a")
    return i.outline()


def deity_stendarr():
    # Mercy and justice: a balance
    i = Icon()
    i.rect(7, 3, 8, 13, "b"); i.rect(8, 3, 8, 13, "B")
    i.rect(2, 3, 13, 4, "b"); i.rect(2, 3, 7, 3, "Y"); i.rect(9, 4, 13, 4, "B")
    i.rect(7, 1, 8, 2, "y")
    i.rect(4, 13, 11, 14, "B"); i.rect(4, 13, 7, 13, "b")
    i.line(3, 5, 1, 9, "L"); i.line(3, 5, 5, 9, "L"); i.line(12, 5, 10, 9, "L"); i.line(12, 5, 14, 9, "L")
    i.rect(1, 10, 5, 10, "w"); i.rect(2, 11, 4, 11, "g")
    i.rect(10, 10, 14, 10, "w"); i.rect(11, 11, 13, 11, "g")
    return i.outline()


def deity_talos():
    # The Ninth, Tiber Septim: the Emperor's crown
    i = Icon()
    i.poly([(1.5, 11), (1.5, 4), (4.6, 7.2), (8, 1.6), (11.4, 7.2), (14.5, 4), (14.5, 11)], "a")
    i.rect(2, 10, 13, 13, "a")
    i.recolor({"a"}, "A", lambda x, y: x <= 5 and y <= 11)
    i.recolor({"a"}, "i", lambda x, y: x >= 12 or y >= 13)
    i.px(1, 3, "q"); i.px(8, 1, "r"); i.px(14, 3, "q")
    i.rect(4, 11, 5, 12, "q"); i.rect(10, 11, 11, 12, "q"); i.rect(7, 11, 8, 12, "M"); i.px(7, 11, "m"); i.px(4, 11, "r")
    return i.outline()


def deity_zenithar():
    # Work and commerce: a stack of coins, one standing in front
    i = Icon()
    for k, y in enumerate(range(12, 3, -2)):
        ellipse(i, 6, y + 0.5, 4.4, 1.5, "a"); i.recolor({"a"}, "i", lambda x, y, yy=y: y == yy + 1 and x <= 9)
    ellipse(i, 6, 3.5, 4.4, 1.5, "A"); i.px(4, 3, "y")
    i.disc(10.5, 10.5, 4.6, "a")
    i.recolor({"a"}, "A", lambda x, y: x >= 7 and x + y <= 18 and y <= 10 and x <= 10)
    i.recolor({"a"}, "i", lambda x, y: x >= 7 and x + y >= 24)
    i.disc(10.5, 10.5, 2.6, "i"); i.disc(10.5, 10.5, 1.6, "a"); i.px(10, 10, "A")
    return i.outline()



# Offered to the races at the start

def deity_auriel():
    # The Eternal Sun
    i = Icon()
    for (a, b, c2, d) in ((7, 1, 8, 2), (7, 13, 8, 14), (1, 7, 2, 8), (13, 7, 14, 8)):
        i.rect(a, b, c2, d, "o")
    for (x0, y0, x1, y1) in ((2, 2, 3, 3), (13, 2, 12, 3), (2, 13, 3, 12), (13, 13, 12, 12)):
        i.line(x0, y0, x1, y1, "o")
    i.disc(8, 8, 4.2, "a")
    i.recolor({"a"}, "A", lambda x, y: x + y <= 13)
    i.recolor({"a"}, "i", lambda x, y: x + y >= 18)
    i.px(6, 6, "y"); i.px(7, 6, "y"); i.px(6, 7, "y")
    i.recolor({"o"}, "y", lambda x, y: y <= 3 or x <= 3)
    return i.outline()


def deity_azura():
    # Dawn and dusk: a disc half sunrise, half night, with her star
    i = Icon()
    i.disc(8, 8, 6.2, "o")
    i.recolor({"o"}, "y", lambda x, y: x <= 7 and y <= 5)
    i.recolor({"o"}, "O", lambda x, y: x <= 7 and y >= 11)
    i.recolor({"o", "y", "O"}, "M", lambda x, y: x >= 8)
    i.recolor({"M"}, "N", lambda x, y: x >= 8 and y >= 9)
    spark(i, 11, 5, "c", "W")
    return i.outline()


def deity_boethiah():
    # Plots and murder: the Ebony Mail
    i = Icon()
    i.poly([(1.6, 3.4), (5.6, 1.6), (8, 4), (10.4, 1.6), (14.4, 3.4), (13, 7.5), (12.4, 14.4), (3.6, 14.4), (3, 7.5)], "G")
    i.recolor({"G"}, "g", lambda x, y: (x <= 4 and y <= 6) or (x == 5 and y <= 3))
    i.recolor({"G"}, "l", lambda x, y: x >= 11)
    i.rect(5, 7, 10, 7, "k"); i.rect(5, 10, 10, 10, "k")            # plates
    i.rect(7, 5, 8, 13, "q"); i.px(7, 5, "r")                       # red seam
    i.px(4, 3, "W")
    return i.outline()


def deity_hircine():
    # The Hunt: a stag's skull
    i = Icon()
    i.line(6, 6, 3, 1, "b"); i.line(4, 4, 1, 4, "b"); i.line(5, 5, 5, 2, "B")
    i.line(9, 6, 12, 1, "B"); i.line(11, 4, 14, 4, "B"); i.line(10, 5, 10, 2, "b")
    i.disc(7.5, 8, 3.4, "w")
    i.poly([(5, 9), (10, 9), (9, 14.4), (6, 14.4)], "w")
    i.recolor({"w"}, "W", lambda x, y: x <= 6 and y <= 9)
    i.recolor({"w"}, "g", lambda x, y: x >= 9)
    i.rect(5, 8, 6, 9, "k"); i.rect(9, 8, 10, 9, "k")
    i.px(7, 12, "G"); i.px(8, 12, "G")
    return i.outline()


def deity_jephre():
    # Song and the Green: a lute
    i = Icon()
    i.line(8, 8, 13, 2, "d"); i.line(9, 8, 14, 2, "d"); i.line(8, 7, 13, 1, "B")
    i.rect(12, 0, 14, 1, "B"); i.px(15, 1, "b"); i.px(12, 0, "b")   # pegbox
    ellipse(i, 6, 10.5, 4.4, 4.4, "B")
    i.recolor({"B"}, "b", lambda x, y: x + y <= 13 and y >= 6)
    i.recolor({"B"}, "d", lambda x, y: x + y >= 19 and y >= 6)
    i.disc(6.5, 10, 1.3, "k")
    i.rect(3, 13, 6, 13, "d")                                       # bridge
    return i.outline()


def deity_leki():
    # The spirit sword
    i = Icon()
    i.poly([(5, 11.5), (8.5, 7), (11.5, 3.5), (15, 0.8), (14, 4.2), (11.2, 8.2), (7.4, 12.4)], "m")
    i.recolor({"m"}, "c", lambda x, y: x + y <= 14 or (y <= 3))
    i.recolor({"m"}, "M", lambda x, y: x + y >= 19)
    i.line(3, 10, 7, 14, "a"); i.px(3, 10, "A")                     # guard
    i.line(4, 13, 2, 15, "d"); i.line(3, 13, 1, 15, "d")            # grip
    return i.outline()


def deity_magnus():
    # Sorcery: an armillary sphere
    i = Icon()
    ring(i, 8, 8, 6.4, 5.2, "a")
    for y in range(16):
        for x in range(16):
            d = ((x + 0.5 - 8) / 6.2) ** 2 + ((y + 0.5 - 8) / 2.3) ** 2
            if 0.55 < d <= 1:
                i.px(x, y, "b")
    i.recolor({"a"}, "A", lambda x, y: x + y <= 11)
    i.recolor({"a"}, "i", lambda x, y: x + y >= 20)
    i.disc(8, 8, 2, "c"); i.px(7, 7, "W"); i.px(8, 9, "m"); i.px(9, 8, "m")
    return i.outline()


def deity_malacath():
    # Oaths and the Orc: Volendrung
    i = Icon()
    i.rect(7, 7, 8, 14, "B"); i.rect(8, 7, 8, 14, "d")
    i.rect(7, 11, 8, 12, "b")
    i.rect(2, 2, 13, 6, "g")
    i.recolor({"g"}, "w", lambda x, y: y == 2 or x <= 3)
    i.recolor({"g"}, "G", lambda x, y: y == 6 or x >= 12)
    i.px(1, 3, "G"); i.px(1, 5, "G"); i.px(14, 3, "G"); i.px(14, 5, "G")   # spikes
    i.rect(6, 3, 9, 5, "u"); i.px(6, 3, "n")                        # green orcish band
    return i.outline()


def deity_mehrunes():
    # Mehrunes' Razor
    i = Icon()
    i.poly([(6.4, 10.5), (9, 6.5), (12, 2.6), (14.8, 0.8), (13.8, 4), (10.8, 8), (8.2, 11.6)], "w")
    i.recolor({"w"}, "W", lambda x, y: x + y <= 13)
    i.recolor({"w"}, "q", lambda x, y: x + y >= 17 and y >= 3)
    i.line(4, 9, 8, 13, "R"); i.px(4, 9, "q"); i.px(8, 13, "q")
    i.line(5, 12, 2, 15, "k"); i.line(6, 12, 3, 15, "k")
    i.px(2, 15, "o")
    return i.outline()


def deity_mephala():
    # The Webspinner
    i = Icon()
    for (x0, y0, x1, y1) in ((6, 7, 2, 3), (6, 8, 1, 7), (6, 10, 1, 11), (6, 11, 3, 15),
                             (9, 7, 13, 3), (9, 8, 14, 7), (9, 10, 14, 11), (9, 11, 12, 15)):
        i.line(x0, y0, x1, y1, "l")
    ellipse(i, 7.5, 10, 2.6, 3.2, "h")
    i.disc(7.5, 5.6, 1.7, "h")
    i.recolor({"h"}, "H", lambda x, y: x <= 6 and y <= 9)
    i.px(7, 9, "q"); i.px(7, 10, "r"); i.px(7, 11, "q")
    i.px(6, 5, "q"); i.px(8, 5, "q")
    return i.outline()


def deity_molagbal():
    # Domination: two iron cuffs on a chain
    i = Icon()
    ring(i, 4.6, 11, 3.6, 1.8, "g")
    ring(i, 11.4, 4.6, 3.6, 1.8, "g")
    i.recolor({"g"}, "w", lambda x, y: (x <= 3 and y <= 11) or (x <= 10 and y <= 4))
    i.recolor({"g"}, "G", lambda x, y: (y >= 13) or (x >= 13 and y >= 5))
    for (x, y, c) in ((7, 8, "G"), (8, 7, "g"), (9, 8, "G")):
        i.rect(x, y, x, y, c)
    i.px(7, 9, "g"); i.px(8, 8, "k"); i.px(9, 7, "g")
    return i.outline()


def deity_morwha():
    # Fertility and plenty: a clay jar
    i = Icon()
    ellipse(i, 8, 10, 5.4, 4.8, "O")
    i.rect(6, 3, 9, 6, "O")
    i.rect(5, 2, 10, 2, "o")
    i.recolor({"O"}, "o", lambda x, y: x <= 5 and y <= 11)
    i.recolor({"O"}, "R", lambda x, y: x >= 11 or y >= 14)
    i.rect(3, 9, 12, 9, "y"); i.px(4, 9, "Y")
    for x in (5, 8, 11):
        i.px(x, 11, "y")
    return i.outline()


def deity_phynaster():
    # The hundred steps: a pilgrim's staff
    i = Icon()
    i.line(4, 15, 11, 4, "B"); i.line(5, 15, 12, 4, "d")
    i.disc(12.5, 3, 2.2, "a"); i.px(12, 2, "A"); i.px(13, 4, "i")
    i.line(9, 7, 6, 9, "M"); i.line(9, 8, 7, 10, "m")              # ribbon
    i.px(5, 10, "M")
    return i.outline()


def deity_rajhin():
    # The Footpad: a cat's paw print
    i = Icon()
    ellipse(i, 8, 11.2, 3.6, 3, "K")
    i.px(8, 14, ".")
    for (x, y) in ((3.2, 7), (6.2, 3.8), (9.8, 3.8), (12.8, 7)):
        ellipse(i, x, y, 1.4, 1.7, "K")
    i.recolor({"K"}, "Q", lambda x, y: x >= 9 and y >= 9)
    i.recolor({"K"}, "V", lambda x, y: y >= 13 and x >= 8)
    i.px(3, 6, "W"); i.px(6, 3, "W"); i.px(6, 10, "W")
    return i.outline()


def deity_riddlethar():
    # The Two-Moons Dance: Masser and Secunda
    i = Icon()
    i.disc(6, 10, 4.4, "r")
    i.recolor({"r"}, "p", lambda x, y: x <= 4 and y <= 10)
    i.disc(8.4, 9.2, 3.6, "q", where=lambda x, y: (x + 0.5 - 6) ** 2 + (y + 0.5 - 10) ** 2 <= 4.4 ** 2 and x >= 7)
    i.px(4, 11, "q"); i.px(5, 8, "q")
    i.disc(12.4, 3.6, 2.4, "W")
    i.disc(13.4, 3.2, 1.8, "g", where=lambda x, y: (x + 0.5 - 12.4) ** 2 + (y + 0.5 - 3.6) ** 2 <= 2.4 ** 2 and x >= 13)
    return i.outline()


def deity_satakal():
    # The World Skin: a snake that eats its tail
    i = Icon()
    ring(i, 8, 8.5, 6.2, 3.6, "s")
    i.recolor({"s"}, "e", lambda x, y: x + y <= 11)
    i.recolor({"s"}, "S", lambda x, y: x + y >= 21)
    for (x, y) in ((4, 12), (12, 12), (2, 8), (8, 14), (3, 5)):
        i.px(x, y, "S")
    i.disc(11.6, 3.4, 2.4, "s"); i.px(12, 2, "k"); i.px(11, 2, "e")   # head
    i.px(9, 4, "q")                                                 # the tail in its mouth
    return i.outline()


def deity_sheogorath():
    # Madness: a jester's cap
    i = Icon()
    i.poly([(3, 11.5), (0.8, 4), (7.5, 11.5)], "r")
    i.poly([(5.5, 11.5), (8, 1.5), (10.5, 11.5)], "M")
    i.poly([(8.5, 11.5), (15.2, 4), (13, 11.5)], "r")
    i.recolor({"r"}, "q", lambda x, y: x >= 12)
    i.recolor({"M"}, "N", lambda x, y: x >= 9)
    i.rect(3, 11, 12, 13, "Y"); i.rect(3, 13, 12, 13, "b")
    for (x, y) in ((1, 3), (8, 1), (14, 3)):
        i.px(x, y, "y")
    return i.outline()


def deity_shor():
    # Sovngarde's mead: a drinking horn
    i = Icon()
    i.poly([(1.4, 3.6), (6, 2.4), (8.5, 7.5), (12.5, 10.8), (14.8, 13.4), (11.5, 13.2), (7, 11), (3.2, 8)], "Y")
    i.recolor({"Y"}, "b", lambda x, y: x + y >= 17)
    i.recolor({"Y"}, "B", lambda x, y: x >= 12)
    i.line(1, 4, 5, 3, "a"); i.line(2, 4, 6, 3, "i")               # rim
    i.line(4, 8, 8, 6, "a")                                        # band
    i.px(2, 2, "W"); i.px(3, 2, "W"); i.px(4, 1, "W")              # foam
    return i.outline()


def deity_sithis():
    # The Void
    i = Icon()
    i.disc(8, 8, 6.2, "N")
    i.disc(8, 8, 4.8, "k")
    i.recolor({"N"}, "M", lambda x, y: x + y <= 9)
    for (x, y) in ((6, 6), (7, 5), (9, 6), (10, 8), (9, 10), (7, 10)):
        i.px(x, y, "N")
    i.px(8, 8, "c")
    return i.outline()


def deity_syrabane():
    # Warden of magic: a six-pointed star
    i = Icon()
    i.poly([(8, 0.8), (14.4, 11.6), (1.6, 11.6)], "m")
    i.poly([(8, 15.2), (14.4, 4.4), (1.6, 4.4)], "m")
    i.recolor({"m"}, "c", lambda x, y: x + y <= 10)
    i.recolor({"m"}, "M", lambda x, y: x + y >= 19)
    i.disc(8, 8, 1.8, "W")
    return i.outline()


def deity_tallpapa():
    # Who set the stars: a constellation
    i = Icon()
    i.line(3, 11, 8, 4, "L"); i.line(8, 4, 13, 8, "L"); i.line(13, 8, 11, 13, "L")
    spark(i, 3, 11); spark(i, 8, 4); spark(i, 13, 8); spark(i, 11, 13, "o", "y")
    i.px(8, 1, "z"); i.px(14, 3, "z"); i.px(2, 6, "z")
    return i.outline()


def deity_thehist():
    # The Hist: a tree weeping amber sap
    i = Icon()
    i.rect(7, 9, 9, 14, "B"); i.rect(9, 9, 9, 14, "d")
    i.line(6, 14, 4, 15, "d"); i.line(10, 14, 12, 15, "d")         # roots
    i.disc(8, 5.6, 5.2, "S")
    i.disc(5, 8, 2.2, "S"); i.disc(11, 8, 2.2, "S")
    i.recolor({"S"}, "s", lambda x, y: x + y <= 12)
    i.recolor({"s"}, "e", lambda x, y: x + y <= 7)
    i.recolor({"S"}, "u", lambda x, y: y >= 9)
    i.px(8, 11, "o"); i.px(8, 12, "y")                             # sap
    return i.outline()


def deity_hoonding():
    # Make Way: a war banner
    i = Icon()
    i.line(3, 2, 3, 15, "B"); i.px(3, 1, "a"); i.px(3, 0, "A")
    i.poly([(4, 2), (14.6, 3), (12.2, 6.5), (14.6, 10), (4, 9.4)], "r")
    i.recolor({"r"}, "q", lambda x, y: y >= 8 or x >= 12)
    i.disc(8, 6, 1.7, "a"); i.px(7, 5, "A")
    return i.outline()


def deity_trinimac():
    # The warrior of the Aldmer: a gold winged helm
    i = Icon()
    i.poly(leaf(4.5, 7, 0.6, 1.6, 1.4, 1.6, 0.7), "W")
    i.poly(leaf(11.5, 7, 15.4, 1.6, 1.6, 1.4, 0.7), "w")
    i.disc(8, 9.5, 5, "a", where=lambda x, y: y <= 10)
    i.rect(3, 9, 12, 14, "a")
    i.recolor({"a"}, "A", lambda x, y: x + y <= 12)
    i.recolor({"a"}, "i", lambda x, y: x >= 11)
    i.rect(6, 9, 9, 14, "k"); i.rect(7, 13, 8, 14, "a")            # face opening and nasal
    i.rect(7, 9, 8, 12, "i")
    return i.outline()


def deity_xarxes():
    # The scribe of history: a bronze tablet of glyphs
    i = Icon()
    i.rect(1, 3, 14, 12, "b")
    i.recolor({"b"}, "Y", lambda x, y: y == 3 or x == 1)
    i.recolor({"b"}, "B", lambda x, y: y == 12 or x == 14)
    for y in (5, 8, 10):
        for x in range(3, 13, 2):
            if (x * 7 + y * 3) % 5 != 0:
                i.px(x, y, "d")
    i.rect(3, 6, 4, 6, "d"); i.rect(9, 6, 11, 6, "d")
    i.rect(5, 13, 10, 13, "B")
    return i.outline()


def deity_zen():
    # Toil and reckoning: a sickle
    i = Icon()
    ring(i, 8.5, 7, 6.2, 4.2, "w", where=lambda x, y: y <= 9 and not (x <= 7 and y >= 6))
    i.recolor({"w"}, "W", lambda x, y: y <= 2)
    i.recolor({"w"}, "g", lambda x, y: x >= 13)
    i.line(8, 10, 4, 14, "B"); i.line(9, 10, 5, 14, "d"); i.px(10, 9, "G"); i.px(9, 9, "G")
    return i.outline()



# Wintersun's others, joined at a shrine

def deity_almalexia():
    # The Hands of Almalexia: an open gold hand
    i = Icon()
    for x in (4, 6, 8, 10):
        i.rect(x, 1 + (1 if x in (4, 10) else 0), x + 1, 8, "a")
    i.rect(4, 7, 11, 13, "a")
    i.poly([(11, 9), (14.6, 5.6), (14.6, 7.8), (12, 12)], "a")     # thumb
    i.recolor({"a"}, "A", lambda x, y: x <= 5 or (y <= 3 and x <= 8))
    i.recolor({"a"}, "i", lambda x, y: y >= 12 or x >= 13)
    for x in (5, 7, 9):
        i.line(x + 1, 3, x + 1, 6, "i")
    i.rect(5, 14, 10, 14, "a")
    return i.outline()


def deity_baandar():
    # The Bandit God: a domino mask
    i = Icon()
    i.poly([(1, 6), (5, 4.6), (8, 5.8), (11, 4.6), (15, 6), (14, 10), (10, 11), (8, 9.8), (6, 11), (2, 10)], "k")
    i.recolor({"k"}, "l", lambda x, y: y <= 5 or x <= 2)
    i.rect(4, 7, 6, 8, "."); i.rect(10, 7, 12, 8, ".")             # eye holes
    i.line(1, 6, 0, 9, "q"); i.line(15, 6, 15, 9, "q")             # ties
    return i.outline()


def deity_clavicus():
    # The Pactmaker's dog, Barbas
    i = Icon()
    i.disc(8, 7, 4.6, "b")
    i.poly([(2.6, 3.4), (5.4, 3.8), (4.4, 10.6), (2, 9.6)], "B")   # ears hang down
    i.poly([(13.4, 3.4), (10.6, 3.8), (11.6, 10.6), (14, 9.6)], "d")
    ellipse(i, 8, 11.4, 3, 2.6, "Y")                                # muzzle
    i.recolor({"b"}, "Y", lambda x, y: x <= 7 and y <= 4)
    i.px(6, 7, "k"); i.px(10, 7, "k")
    i.rect(7, 10, 8, 10, "k"); i.px(8, 12, "B")
    i.rect(7, 13, 9, 13, "r")                                      # tongue
    return i.outline()


def deity_ebonarm():
    # The god of war with an arm of ebony: an ebony blade
    i = Icon()
    i.poly(leaf(5.4, 5.4, 14.8, 14.8, 1.8, 1.8, 0.35), "G")
    i.recolor({"G"}, "g", lambda x, y: x > y)
    i.recolor({"G"}, "l", lambda x, y: x < y - 1)
    i.line(2, 7, 7, 2, "k"); i.px(2, 7, "q"); i.px(7, 2, "q")        # guard
    i.line(4, 4, 2, 2, "d"); i.px(1, 1, "r")                         # grip, red pommel
    return i.outline()


def deity_herma():
    # The Demon of Knowledge: an eye with tentacles
    i = Icon()
    for (x0, y0, x1, y1) in ((4, 10, 2, 15), (7, 11, 6, 15), (9, 11, 10, 15), (12, 10, 14, 15), (3, 8, 0, 11), (13, 8, 15, 11)):
        i.line(x0, y0, x1, y1, "S")
    ellipse(i, 8, 6.5, 6.4, 4.6, "u")
    ellipse(i, 8, 6.5, 4.4, 2.8, "e")
    i.disc(8, 6.5, 2, "n"); i.rect(8, 5, 8, 8, "k")
    i.px(6, 5, "W")
    return i.outline()


def deity_jyggalag():
    # Order: a perfect cube
    i = Icon()
    i.poly([(8, 1), (14.6, 4.6), (8, 8.2), (1.4, 4.6)], "W")
    i.poly([(1.4, 4.6), (8, 8.2), (8, 15.2), (1.4, 11.6)], "w")
    i.poly([(8, 8.2), (14.6, 4.6), (14.6, 11.6), (8, 15.2)], "g")
    i.line(4, 6, 4, 12, "g"); i.line(11, 7, 11, 13, "G")
    return i.outline()


def deity_mannimarco():
    # The King of Worms
    i = Icon()
    for k, (x, y) in enumerate(((3, 13), (4, 12), (5, 12), (6, 13), (7, 13), (8, 12), (9, 11), (10, 10), (10, 9), (9, 8))):
        i.rect(x, y, x + 1, y + 1, "p" if k % 3 else "r")
    i.disc(9.5, 7, 2, "p"); i.px(9, 6, "k")
    i.rect(8, 2, 11, 4, "a"); i.px(8, 1, "a"); i.px(10, 1, "a"); i.px(11, 1, "a")   # crown
    i.px(9, 3, "q")
    return i.outline()


def deity_meridia():
    # The Lady of Infinite Energies: Dawnbreaker
    i = Icon()
    i.poly(leaf(6.4, 9.6, 14.6, 1.4, 1.6, 1.6, 0.4), "W")
    i.recolor({"W"}, "w", lambda x, y: x + y >= 17)
    i.disc(5.5, 10.5, 2.4, "a")
    for (x, y) in ((2, 7), (3, 13), (8, 13), (1, 10)):
        i.px(x, y, "y")
    i.px(5, 10, "y"); i.line(4, 12, 2, 14, "d"); i.px(1, 15, "a")
    return i.outline()


def deity_namira():
    # Decay and the spurned: a carrion fly
    i = Icon()
    i.poly(leaf(7, 7, 1.6, 2, 1.8, 1.6, 0.7), "c"); i.poly(leaf(9, 7, 14.4, 2, 1.6, 1.8, 0.7), "m")
    ellipse(i, 8, 10, 2.4, 4, "u")
    i.disc(8, 5.8, 1.9, "u")
    i.px(7, 5, "q"); i.px(9, 5, "q")
    for y in (9, 11, 13):
        i.rect(7, y, 8, y, "n")
    i.line(6, 10, 4, 12, "k"); i.line(10, 10, 12, 12, "k")
    return i.outline()


def deity_nocturnal():
    # Night and shadow: the Skeleton Key
    i = Icon()
    ring(i, 4.5, 4.5, 3.6, 1.6, "g")
    i.recolor({"g"}, "w", lambda x, y: x + y <= 6)
    i.line(7, 7, 13, 13, "g"); i.line(7, 8, 12, 13, "G"); i.line(8, 7, 13, 12, "w")
    i.rect(11, 13, 12, 14, "g"); i.rect(13, 11, 14, 12, "g"); i.px(14, 14, "G")
    return i.outline()


def deity_peryite():
    # Pestilence: a plague rat
    i = Icon()
    ellipse(i, 7, 10, 5, 3.4, "h")
    i.poly([(10, 8), (15, 10.6), (10.6, 12)], "h")                 # snout
    i.disc(10.5, 7.4, 1.4, "H")                                    # ear
    i.recolor({"h"}, "H", lambda x, y: y <= 8 and x <= 8)
    i.recolor({"h"}, "l", lambda x, y: y >= 12)
    i.px(12, 9, "k"); i.px(15, 11, "r")
    i.line(2, 11, 0, 14, "r"); i.px(1, 9, "s"); i.px(4, 6, "s"); i.px(2, 7, "e")   # tail, green sickness
    return i.outline()


def deity_sanguine():
    # Debauchery: a goblet of wine
    i = Icon()
    i.poly([(3, 2), (13, 2), (11.6, 7), (9, 9), (7, 9), (4.4, 7)], "a")
    i.rect(4, 3, 11, 4, "q"); i.rect(4, 3, 7, 3, "r")
    i.recolor({"a"}, "A", lambda x, y: x <= 6)
    i.rect(7, 9, 8, 12, "a"); i.rect(4, 13, 11, 14, "a"); i.rect(4, 13, 7, 13, "A"); i.rect(9, 14, 11, 14, "i")
    i.px(12, 5, "q")
    return i.outline()


def deity_sai():
    # Luck: a pair of dice
    i = Icon()
    i.poly([(1.6, 5), (6.6, 3.6), (8.2, 8.6), (3.2, 10)], "W")
    i.rect(7, 7, 14, 14, "w"); i.rect(7, 7, 14, 7, "W")
    i.px(3, 5, "q"); i.px(5, 7, "q")
    for (x, y) in ((9, 9), (12, 9), (9, 12), (12, 12), (10, 10) if False else (11, 11)):
        i.px(x, y, "k")
    i.rect(14, 8, 14, 14, "g")
    return i.outline()


def deity_sothasil():
    # The Clockwork God: a cog
    i = Icon()
    for k in range(8):
        a = k * math.pi / 4
        cx, cy = 8 + 6 * math.cos(a), 8 + 6 * math.sin(a)
        i.disc(cx, cy, 1.4, "b")
    i.disc(8, 8, 5, "b")
    i.recolor({"b"}, "Y", lambda x, y: x + y <= 11)
    i.recolor({"b"}, "B", lambda x, y: x + y >= 20)
    i.disc(8, 8, 2, ".")
    i.disc(8, 8, 1, "o")
    return i.outline()


def deity_stalessia():
    # The Slave Queen: a victor's laurel
    i = Icon()
    pts = [(7, 14), (5, 13), (4, 12), (3, 10), (2, 8), (2, 6), (3, 4), (4, 2)]
    for k, (x, y) in enumerate(pts):
        i.px(x, y, "S"); i.px(15 - x, y, "S")
    for (x, y) in ((4, 13), (2, 11), (1, 9), (1, 6), (2, 4), (3, 2), (5, 11), (4, 9), (4, 7), (4, 5), (5, 3)):
        i.px(x, y, "s"); i.px(15 - x, y, "s")
    i.recolor({"s"}, "e", lambda x, y: y <= 6)
    i.rect(7, 13, 8, 14, "q"); i.px(6, 15, "q"); i.px(9, 15, "q")  # ribbon
    return i.outline()


def deity_totems():
    # The Old Ways: a carved totem
    i = Icon()
    i.rect(5, 1, 10, 15, "B")
    i.recolor({"B"}, "b", lambda x, y: x <= 6)
    i.recolor({"B"}, "d", lambda x, y: x >= 10)
    i.rect(2, 4, 4, 5, "b"); i.rect(11, 4, 13, 5, "d")             # wings
    i.px(6, 3, "k"); i.px(9, 3, "k"); i.rect(7, 5, 8, 6, "o")      # top face, beak
    i.px(6, 9, "k"); i.px(9, 9, "k"); i.rect(6, 11, 9, 11, "k")    # lower face
    i.rect(5, 7, 10, 7, "q"); i.rect(5, 13, 10, 13, "M")
    return i.outline()


def deity_allmaker():
    # The All-Maker's stones: a ring of standing stones
    i = Icon()
    i.rect(1, 6, 3, 13, "g"); i.rect(1, 6, 1, 13, "w")
    i.rect(12, 5, 14, 13, "g"); i.rect(14, 5, 14, 13, "G")
    i.rect(6, 2, 9, 13, "g"); i.rect(6, 2, 6, 13, "w"); i.rect(9, 2, 9, 13, "G")
    i.px(1, 6, "."); i.px(14, 5, "."); i.px(6, 2, "."); i.px(9, 2, ".")
    i.px(7, 5, "c"); i.px(8, 6, "c"); i.px(7, 7, "c"); i.px(8, 8, "m"); i.px(7, 9, "m")   # rune
    i.rect(0, 14, 15, 15, "s"); i.rect(0, 15, 15, 15, "S")
    return i.outline()


def deity_magnage():
    # The Magna-Ge: a falling star
    i = Icon()
    i.poly([(0.6, 15.4), (9.8, 4.4), (12, 6.6)], "N")
    i.poly([(3.4, 13.8), (10.2, 5.2), (11.4, 6.2)], "M")
    i.poly([(6.6, 10.6), (10.4, 5.6), (11, 6)], "c")
    i.disc(11.4, 4.6, 2.3, "y"); i.px(11, 4, "W"); i.px(12, 4, "W"); i.px(11, 5, "W")
    i.px(14, 1, "z"); i.px(15, 5, "z"); i.px(8, 1, "z")
    return i.outline()


def deity_vaermina():
    # Dreams and nightmares: a sleeping eye under a dream
    i = Icon()
    for x in range(2, 14):
        y = 8 + int(round((x - 7.5) ** 2 / 9))
        i.px(x, 15 - y + 2, "M"); i.px(x, 15 - y + 3, "N")
    for (x, y) in ((3, 13), (6, 14), (9, 14), (12, 13)):
        i.px(x, y, "M")
    i.px(11, 5, "c"); i.px(12, 4, "m"); i.px(10, 3, "m"); i.px(9, 2, "c"); i.px(13, 2, "c")
    i.px(5, 4, "m"); i.px(6, 3, "c")
    return i.outline()


def deity_vivec():
    # The Warrior-Poet: his spear, Muatra
    i = Icon()
    i.line(2, 14, 10, 6, "B"); i.line(3, 14, 11, 6, "d")
    i.poly(leaf(10, 6, 15, 1, 1.8, 1.8, 0.7), "a")
    i.recolor({"a"}, "A", lambda x, y: x + y <= 15)
    i.recolor({"a"}, "i", lambda x, y: x + y >= 17)
    i.line(8, 6, 11, 9, "M")                                       # cross guard
    i.px(1, 15, "a")
    return i.outline()



ICONS = {
    "One-Handed": one_handed, "Two-Handed": two_handed, "Marksman": marksman, "Block": block,
    "Smithing": smithing, "Heavy Armor": heavy_armor, "Evasion": evasion, "Finesse": finesse,
    "Wayfarer": wayfarer, "Sneak": sneak, "Alchemy": alchemy, "Speech": speech,
    "Alteration": alteration, "Conjuration": conjuration, "Destruction": destruction,
    "Enchanting": enchanting, "Illusion": illusion, "Restoration": restoration, "Destiny": destiny,
}

ATTRIBUTES = {"Health": health, "Magicka": magicka, "Stamina": stamina}

SIGNS = {
    "Warrior": sign_warrior, "Mage": sign_mage, "Thief": sign_thief, "Apprentice": sign_apprentice,
    "Atronach": sign_atronach, "Lady": sign_lady, "Lord": sign_lord, "Lover": sign_lover,
    "Ritual": sign_ritual, "Serpent": sign_serpent, "Shadow": sign_shadow, "Steed": sign_steed,
    "Tower": sign_tower,
}

# Gear types (WO-82, 15 Oct 2026): one object each, the one a player would name.
def slot_circlet():
    i = Icon()
    ellipse(i, 8, 6, 7.4, 6, "a", where=lambda x, y: y >= 6)       # band curving round the brow
    ellipse(i, 8, 6, 5.6, 4.2, ".", where=lambda x, y: y >= 6)
    i.rect(0, 6, 1, 7, "a"); i.rect(14, 6, 15, 7, "a")
    i.recolor({"a"}, "A", lambda x, y: x <= 4)
    i.recolor({"a"}, "i", lambda x, y: x >= 12)
    i.poly([(5, 12), (8, 2.5), (11, 12)], "a")                      # tall front setting
    i.recolor({"a"}, "A", lambda x, y: 5 <= x <= 7 and y < 11)
    i.rect(7, 6, 8, 9, "M"); i.px(7, 6, "c"); i.px(8, 9, "N")       # gem
    return i.outline()


def slot_face():
    i = Icon()
    ellipse(i, 8, 8, 6, 6.8, "w")                                   # bone mask
    i.recolor({"w"}, "W", lambda x, y: x + y < 11)
    i.recolor({"w"}, "g", lambda x, y: x >= 11 or y >= 12)
    i.rect(4, 6, 6, 7, "k"); i.rect(10, 6, 12, 7, "k")              # eye holes
    i.rect(7, 8, 8, 10, "g")                                        # nose ridge
    i.rect(6, 12, 10, 12, "G")                                      # mouth slit
    i.px(4, 3, "o"); i.px(5, 4, "O"); i.px(11, 4, "O"); i.px(12, 3, "o")   # painted marks
    return i.outline()


def slot_legs():
    i = Icon()
    i.rect(3, 1, 12, 4, "b")                                        # waist
    i.rect(3, 4, 7, 14, "b"); i.rect(9, 4, 12, 14, "B")             # two legs
    i.recolor({"b"}, "Y", lambda x, y: x <= 4)
    i.rect(3, 2, 12, 2, "d"); i.px(8, 2, "Y")                       # belt, buckle
    i.rect(3, 13, 7, 14, "d"); i.rect(9, 13, 12, 14, "d")           # cuffs
    return i.outline()


def slot_cloak():
    i = Icon()
    i.poly([(5, 1.5), (11, 1.5), (14.5, 15), (1.5, 15)], "M")       # cloak falling from the shoulders
    i.recolor({"M"}, "m", lambda x, y: x <= 5)
    i.recolor({"M"}, "N", lambda x, y: x >= 11)
    for x in (5, 8, 11):
        i.line(x, 6, x - (1 if x < 8 else -1 if x > 8 else 0), 14, "N")   # folds
    i.rect(5, 1, 10, 2, "d")                                        # collar
    i.rect(7, 2, 8, 3, "a"); i.px(7, 2, "A")                        # clasp
    return i.outline()


def slot_mantle():
    i = Icon()
    i.poly([(3, 5), (13, 5), (15.5, 13), (0.5, 13)], "B")          # short leather cape over the shoulders
    i.recolor({"B"}, "b", lambda x, y: x <= 4)
    i.recolor({"B"}, "d", lambda x, y: x >= 12 or y >= 12)
    ellipse(i, 8, 4.6, 6.6, 3.4, "w")                               # thick fur collar
    ellipse(i, 8, 3.4, 2.8, 1.6, ".")                               # neck
    i.recolor({"w"}, "W", lambda x, y: x + y < 9)
    i.recolor({"w"}, "g", lambda x, y: x >= 11 or y >= 7)
    for x in (2, 5, 8, 11, 13):
        i.px(x, 8, "g")                                             # fur tufts over the cape
    return i.outline()


def slot_pauldron():
    i = Icon()
    ellipse(i, 8, 9, 7, 6, "w", where=lambda x, y: y <= 9)          # rounded plate
    i.rect(2, 9, 14, 10, "w")
    i.recolor({"w"}, "W", lambda x, y: x + y < 11)
    i.recolor({"w"}, "g", lambda x, y: x >= 11)
    i.line(2, 7, 13, 7, "G"); i.line(3, 10, 13, 10, "G")            # lames
    i.rect(2, 11, 14, 13, "g"); i.rect(2, 11, 4, 13, "w")           # lower lame
    i.px(5, 4, "B"); i.px(10, 4, "B")                               # rivets
    return i.outline()


def slot_scarf():
    i = Icon()
    ellipse(i, 8, 5, 6.4, 3.6, "r")                                 # loop round the neck
    ellipse(i, 8, 4.4, 3.6, 1.8, ".")
    i.poly([(8, 6), (12, 6), (11, 15), (8, 15)], "r")               # hanging end
    i.recolor({"r"}, "p", lambda x, y: x <= 4)
    i.recolor({"r"}, "q", lambda x, y: x >= 11 or y >= 12)
    for y in (9, 12):
        i.line(8, y, 11, y, "q")                                    # stripes
    i.px(8, 15, "q"); i.px(10, 15, "q")                             # fringe
    return i.outline()


def slot_backpack():
    i = Icon()
    i.rect(3, 3, 12, 14, "b")                                       # pack
    i.rect(5, 1, 10, 3, "d")                                        # bedroll on top
    i.rect(5, 1, 6, 3, "B")
    i.rect(3, 3, 12, 7, "B"); i.rect(3, 3, 12, 3, "b")              # flap
    i.recolor({"b"}, "Y", lambda x, y: x <= 4 and y >= 8)
    i.recolor({"b"}, "B", lambda x, y: x >= 11 and y >= 8)
    i.rect(5, 6, 5, 9, "d"); i.rect(10, 6, 10, 9, "d")              # straps
    i.px(5, 9, "Y"); i.px(10, 9, "Y")                               # buckles
    i.rect(5, 10, 10, 13, "B"); i.rect(5, 10, 10, 10, "d")          # front pocket
    return i.outline()


def slot_belt_bag():
    i = Icon()
    i.rect(0, 3, 15, 5, "d"); i.rect(0, 3, 15, 3, "B")              # belt
    i.rect(4, 5, 11, 13, "b")                                       # pouch
    i.rect(4, 5, 11, 8, "B"); i.rect(4, 5, 11, 5, "b")              # flap
    i.recolor({"b"}, "Y", lambda x, y: x <= 5 and y >= 9)
    i.rect(7, 7, 8, 9, "a"); i.px(7, 7, "A")                        # stud
    i.rect(1, 3, 2, 5, "a"); i.px(1, 3, "A")                        # belt buckle
    return i.outline()


def slot_bandolier():
    i = Icon()
    i.line(2, 1, 14, 14, "d"); i.line(1, 2, 13, 15, "d"); i.line(2, 2, 13, 14, "B")   # strap across the chest
    for (x, y) in ((4, 4), (7, 7), (10, 10)):
        i.rect(x - 1, y - 3, x, y, "g")                             # vials in loops
        i.px(x - 1, y - 3, "W"); i.px(x, y - 1, "s"); i.px(x - 1, y - 1, "e")
    i.rect(12, 12, 13, 13, "a")                                     # buckle
    return i.outline()


def slot_necklace():
    i = Icon()
    ellipse(i, 8, 6, 6, 6, "a", where=lambda x, y: y >= 5)          # chain
    ellipse(i, 8, 6, 4.6, 4.6, ".", where=lambda x, y: y >= 5)
    i.recolor({"a"}, "A", lambda x, y: x <= 5)
    for (x, y) in ((3, 8), (5, 10), (10, 10), (12, 8)):
        i.px(x, y, "r")                                             # beads
    i.rect(7, 11, 8, 14, "m"); i.px(7, 11, "c"); i.px(8, 14, "M")   # drop stone
    return i.outline()


def slot_earrings():
    i = Icon()
    for x0 in (2, 9):
        ellipse(i, x0 + 2.5, 6, 2.6, 3, "a")                        # hoop
        ellipse(i, x0 + 2.5, 6, 1.4, 1.8, ".")
        i.recolor({"a"}, "A", lambda x, y, x0=x0: x <= x0 + 1)
        i.rect(x0 + 2, 9, x0 + 3, 12, "m"); i.px(x0 + 2, 9, "c")    # hanging gem
        i.px(x0 + 3, 12, "M")
    return i.outline()


def slot_bracelet():
    i = Icon()
    ellipse(i, 8, 8.4, 7.4, 5.6, "a")                               # wide cuff, seen from above and in front
    ellipse(i, 8, 6.8, 5.2, 3, ".")                                 # the opening; the front band shows deeper
    i.recolor({"a"}, "A", lambda x, y: y <= 6)
    i.recolor({"a"}, "i", lambda x, y: y >= 12 or x <= 1 or x >= 14)
    i.line(2, 10, 13, 10, "i")                                      # top edge of the front band
    i.px(4, 11, "r"); i.rect(7, 11, 8, 12, "m"); i.px(7, 11, "c"); i.px(11, 11, "r")   # stones
    return i.outline()


def slot_armlet():
    i = Icon()
    i.rect(4, 2, 11, 13, "f")                                       # upper arm
    i.recolor({"f"}, "F", lambda x, y: x <= 5)
    i.recolor({"f"}, "v", lambda x, y: x >= 10)
    i.rect(3, 6, 12, 9, "a"); i.rect(3, 6, 12, 6, "A")              # metal band
    i.rect(3, 9, 12, 9, "i")
    i.rect(7, 7, 8, 8, "M"); i.px(7, 7, "c")                        # stone
    return i.outline()


def slot_lantern():
    i = Icon()
    i.rect(7, 0, 8, 1, "G")                                         # ring
    i.rect(4, 2, 11, 3, "g"); i.rect(4, 2, 11, 2, "w")              # cap
    i.rect(4, 4, 11, 12, "y")                                       # glass with the light inside
    i.rect(6, 6, 9, 10, "o"); i.rect(7, 7, 8, 9, "W")
    for x in (4, 11):
        i.rect(x, 4, x, 12, "G")                                    # frame bars
    i.rect(3, 13, 12, 14, "g"); i.rect(3, 13, 12, 13, "w")          # base
    return i.outline()


def slot_spyglass():
    i = Icon()
    i.line(2, 13, 6, 9, "B"); i.line(3, 13, 6, 10, "B"); i.line(2, 12, 5, 9, "d")     # eyepiece draw
    for k in range(4):
        i.line(6 + k, 9 - k, 6 + k, 10 - k, "b"); i.line(5 + k, 9 - k, 7 + k, 11 - k, "b")
    i.line(9, 6, 13, 2, "a"); i.line(10, 7, 14, 3, "i"); i.line(9, 5, 12, 2, "A")    # brass barrel
    i.line(10, 6, 13, 3, "a")
    i.line(5, 8, 7, 10, "a"); i.line(8, 5, 10, 7, "A")                               # bands
    i.rect(13, 1, 14, 2, "c")                                                        # lens
    return i.outline()


def slot_instrument():
    i = Icon()
    ellipse(i, 6, 10.4, 4.6, 4.6, "b")                              # lute body
    i.recolor({"b"}, "Y", lambda x, y: x + y < 13)
    i.recolor({"b"}, "B", lambda x, y: x + y > 18)
    i.disc(6, 10.4, 1.4, "d")                                       # sound hole
    i.line(8, 8, 13, 3, "d"); i.line(9, 8, 14, 3, "B")              # neck
    i.rect(13, 1, 15, 2, "d")                                       # head
    i.line(4, 12, 13, 3, "L")                                       # strings
    return i.outline()


def slot_accessory():
    i = Icon()
    i.rect(6, 1, 9, 3, "d"); i.rect(6, 1, 7, 1, "B")                # stopper
    i.rect(7, 4, 8, 5, "g")                                         # neck
    ellipse(i, 7.6, 10.4, 5.4, 4.6, "g")                            # flask
    i.recolor({"g"}, "W", lambda x, y: x + y < 12)
    i.recolor({"g"}, "G", lambda x, y: x >= 11 or y >= 14)
    i.rect(3, 9, 12, 11, "b"); i.rect(3, 9, 12, 9, "Y")             # leather wrap
    return i.outline()


RACES = {
    "Altmer": race_altmer, "Argonian": race_argonian, "Bosmer": race_bosmer, "Breton": race_breton,
    "Dunmer": race_dunmer, "Imperial": race_imperial, "Khajiit": race_khajiit, "Nord": race_nord,
    "Orsimer": race_orsimer, "Redguard": race_redguard,
}

MARKS = {"Trainer": trainer, "Skill book": skill_book, "Banked": banked, "Perk points": perk_point, "Note": note, "Power": power, "Shout": tag_shouts}
SLOTS = {
    "Main hand": slot_main_hand, "Off hand": slot_off_hand, "Head": slot_head, "Body": slot_body,
    "Hands": slot_hands, "Feet": slot_feet, "Ring": slot_ring, "Amulet": slot_amulet, "Ammo": slot_ammo,
    "Other": slot_other,
    "Circlet": slot_circlet, "Face": slot_face, "Legs": slot_legs, "Shield": tag_shield, "Cloak": slot_cloak, "Mantle": slot_mantle,
    "Pauldron": slot_pauldron, "Scarf": slot_scarf, "Backpack": slot_backpack, "Bag": slot_other, "Belt Bag": slot_belt_bag,
    "Bandolier": slot_bandolier, "Necklace": slot_necklace, "Earrings": slot_earrings, "Bracelet": slot_bracelet,
    "Armlet": slot_armlet, "Lantern": slot_lantern, "Spyglass": slot_spyglass, "Instrument": slot_instrument,
    "Accessory": slot_accessory,
}
MODES = {"Konahrik": mode_konahrik, "Naaktiid": mode_naaktiid}
TAGS = {
    "Shield": tag_shield, "Unarmored": tag_unarmored, "Spellsword": tag_spellsword,
    "Necromancy": tag_necromancy, "Shouts": tag_shouts, "Tank": tag_tank, "Beginner-friendly": tag_beginner,
    "Roleplay": tag_roleplay,
}

# Every set and the file-name prefix it is written under.
DEITIES = {
    "Akatosh": deity_akatosh,
    "Arkay": deity_arkay,
    "Dibella": deity_dibella,
    "Julianos": deity_julianos,
    "Kynareth": deity_kynareth,
    "Mara": deity_mara,
    "Stendarr": deity_stendarr,
    "Talos": deity_talos,
    "Zenithar": deity_zenithar,
    "Auriel": deity_auriel,
    "Azura": deity_azura,
    "Boethiah": deity_boethiah,
    "Hircine": deity_hircine,
    "Jephre": deity_jephre,
    "Leki": deity_leki,
    "Magnus": deity_magnus,
    "Malacath": deity_malacath,
    "Mehrunes Dagon": deity_mehrunes,
    "Mephala": deity_mephala,
    "Molag Bal": deity_molagbal,
    "Morwha": deity_morwha,
    "Phynaster": deity_phynaster,
    "Rajhin": deity_rajhin,
    "Riddle'Thar": deity_riddlethar,
    "Satakal": deity_satakal,
    "Sheogorath": deity_sheogorath,
    "Shor": deity_shor,
    "Sithis": deity_sithis,
    "Syrabane": deity_syrabane,
    "Tall Papa": deity_tallpapa,
    "The Hist": deity_thehist,
    "The HoonDing": deity_hoonding,
    "Trinimac": deity_trinimac,
    "Xarxes": deity_xarxes,
    "Z'en": deity_zen,
    "Almalexia": deity_almalexia,
    "Baan Dar": deity_baandar,
    "Clavicus Vile": deity_clavicus,
    "Ebonarm": deity_ebonarm,
    "Hermaeus Mora": deity_herma,
    "Jyggalag": deity_jyggalag,
    "Mannimarco": deity_mannimarco,
    "Meridia": deity_meridia,
    "Namira": deity_namira,
    "Nocturnal": deity_nocturnal,
    "Peryite": deity_peryite,
    "Sanguine": deity_sanguine,
    "Sai": deity_sai,
    "Sotha Sil": deity_sothasil,
    "St. Alessia": deity_stalessia,
    "The Old Ways": deity_totems,
    "The All-Maker": deity_allmaker,
    "The Magna-Ge": deity_magnage,
    "Vaermina": deity_vaermina,
    "Vivec": deity_vivec,
}

LOGO = {str(f): (lambda f=f: logo(f)) for f in range(4)}

# ---------------------------------------------------------------- the guide's chapters and needs (WO-70)

def chapter_changes():
    # A rolled scroll with an ember wax seal
    i = Icon()
    i.rect(3, 3, 12, 12, "Y")                                      # parchment
    i.recolor({"Y"}, "b", lambda x, y: x >= 10 or y >= 11)
    i.rect(2, 2, 13, 3, "b"); i.rect(2, 2, 13, 2, "Y"); i.rect(12, 2, 13, 3, "B")   # top roll
    i.rect(2, 12, 13, 13, "b"); i.rect(2, 13, 13, 13, "B"); i.rect(12, 12, 13, 13, "d")  # bottom roll
    for y in (5, 7, 9):
        i.rect(4, y, 9, y, "B")                                    # lines of text
    i.disc(10.5, 10.5, 2.4, "o")                                   # wax seal
    i.recolor({"o"}, "y", lambda x, y: x <= 9 and y <= 9)
    i.recolor({"o"}, "O", lambda x, y: x + y >= 23)
    i.px(10, 10, "R")
    return i.outline()


def chapter_character():
    # A hand mirror
    i = Icon()
    ellipse(i, 8.5, 6, 5.2, 5.4, "b")                              # brass frame
    ellipse(i, 8.5, 6, 3.8, 4.0, "m")                              # glass
    i.recolor({"m"}, "c", lambda x, y: x + y <= 11)
    i.recolor({"m"}, "M", lambda x, y: x + y >= 17)
    i.recolor({"b"}, "Y", lambda x, y: x + y <= 9)
    i.recolor({"b"}, "B", lambda x, y: x + y >= 19)
    i.px(6, 4, "W"); i.px(7, 3, "W")                               # shine
    i.rect(7, 11, 9, 11, "B")                                      # neck
    i.rect(7, 12, 9, 15, "d"); i.rect(7, 12, 7, 15, "B")           # handle
    return i.outline()


def chapter_first_days():
    # A pinned notice-board note
    i = Icon()
    i.poly([(2, 3), (13, 2), (14, 14), (3, 15)], "W")              # the note, a little askew
    i.recolor({"W"}, "w", lambda x, y: x >= 11 or y >= 12)
    for y, x1 in ((6, 11), (8, 10), (10, 11), (12, 8)):
        i.line(5, y, x1, y, "g")                                   # handwriting
    i.disc(8, 2.6, 1.8, "r")                                       # the pin
    i.px(7, 2, "p")
    return i.outline()


def chapter_staying_alive():
    # A campfire
    i = Icon()
    i.poly(leaf(8, 13, 8, 1.5, 3.6, 3.6, 0.9), "o")                # flame
    i.poly(leaf(8, 13, 8, 5.5, 1.9, 1.9, 0.9), "y")                # its hot core
    i.recolor({"o"}, "O", lambda x, y: x >= 10)
    i.line(2, 14, 13, 11, "B"); i.line(2, 15, 13, 12, "d")         # logs, crossed
    i.line(3, 11, 14, 14, "b"); i.line(3, 12, 14, 15, "B")
    return i.outline()


def chapter_fighting():
    # A steel sword
    i = Icon()
    i.line(4, 11, 13, 2, "w"); i.line(5, 11, 14, 2, "g"); i.line(4, 10, 13, 1, "W")   # blade
    i.px(14, 1, "W")
    i.line(2, 9, 6, 13, "b"); i.px(2, 9, "Y"); i.px(6, 13, "B")    # crossguard
    i.line(1, 14, 3, 12, "d"); i.line(2, 14, 3, 13, "B")           # grip
    i.px(1, 15, "b"); i.px(0, 15, "Y")                             # pommel
    return i.outline()


def chapter_magic():
    # A blue spell tome
    i = Icon()
    i.rect(3, 1, 12, 14, "m")                                      # cover
    i.rect(12, 2, 13, 13, "W"); i.rect(13, 2, 13, 13, "w")         # page edges
    i.rect(2, 1, 3, 14, "N")                                       # spine
    i.recolor({"m"}, "c", lambda x, y: x <= 5 and y <= 4)
    i.recolor({"m"}, "M", lambda x, y: x >= 10 and y >= 10)
    i.disc(7.5, 7.5, 2.6, "y")                                     # glowing rune
    i.disc(7.5, 7.5, 1.3, "o")
    for (x, y) in ((4, 2), (11, 2), (4, 13), (11, 13)):
        i.px(x, y, "b")                                            # brass corners
    return i.outline()


def chapter_crafting():
    # A smith's hammer
    i = Icon()
    i.rect(2, 2, 11, 6, "g")                                       # iron head
    i.recolor({"g"}, "w", lambda x, y: y <= 3 or x <= 3)
    i.recolor({"g"}, "G", lambda x, y: y >= 6 and x >= 6)
    i.rect(1, 3, 1, 5, "w")                                        # striking face
    i.px(2, 2, "W")
    i.line(7, 7, 13, 14, "b"); i.line(8, 7, 14, 14, "B"); i.px(7, 7, "Y")   # haft
    return i.outline()


def chapter_getting_around():
    # A horseshoe: an iron arch open at the bottom, its two heels, nail holes
    i = Icon()
    ring(i, 8, 7, 6.6, 3.2, "w", where=lambda x, y: y <= 7)        # the arch
    i.rect(1, 7, 4, 13, "w"); i.rect(11, 7, 14, 13, "g")            # the two arms
    i.rect(1, 14, 5, 14, "g"); i.rect(10, 14, 14, 14, "G")          # heels, turned out
    i.recolor({"w"}, "W", lambda x, y: x + y <= 8)
    i.recolor({"w"}, "g", lambda x, y: x >= 11)
    i.recolor({"g"}, "G", lambda x, y: x >= 13 and y >= 9)
    for (x, y) in ((2, 5), (4, 2), (11, 2), (13, 5), (2, 10), (13, 10)):
        i.px(x, y, "G")                                            # nail holes
    return i.outline()


def chapter_death():
    # A skull
    i = Icon()
    i.disc(8, 6.5, 5.6, "w")                                       # cranium
    i.rect(5, 10, 11, 13, "w")                                     # jaw
    i.recolor({"w"}, "W", lambda x, y: x + y <= 10)
    i.recolor({"w"}, "g", lambda x, y: x >= 11 and y >= 6)
    i.rect(4, 7, 6, 9, "k"); i.rect(10, 7, 12, 9, "k")             # eyes
    i.px(8, 10, "k"); i.px(7, 11, "k"); i.px(9, 11, "k")           # nose
    for x in (6, 8, 10):
        i.rect(x, 13, x, 14, "k")                                  # teeth gaps
    i.rect(5, 14, 11, 14, "w"); i.rect(6, 14, 6, 14, "k"); i.rect(8, 14, 8, 14, "k"); i.rect(10, 14, 10, 14, "k")
    return i.outline()


def chapter_followers():
    # An amulet on a chain
    i = Icon()
    for (x, y) in ((2, 1), (3, 3), (4, 5), (5, 7), (13, 1), (12, 3), (11, 5), (10, 7)):
        i.px(x, y, "b")                                            # chain links
    for (x, y) in ((2, 2), (4, 4), (13, 2), (11, 4)):
        i.px(x, y, "B")
    i.disc(8, 11, 3.8, "b")                                        # setting
    i.recolor({"b"}, "Y", lambda x, y: x + y <= 17 and y <= 10)
    i.disc(8, 11, 2.2, "r")                                        # the stone
    i.px(7, 10, "p"); i.px(9, 12, "q")
    return i.outline()


def chapter_keys():
    # An iron key
    i = Icon()
    ring(i, 4.5, 5, 3.6, 1.6, "g")                                 # bow
    i.recolor({"g"}, "w", lambda x, y: x + y <= 7)
    i.line(7, 7, 14, 14, "g"); i.line(7, 8, 13, 14, "G")           # shank
    i.rect(12, 10, 13, 11, "g"); i.rect(10, 12, 11, 13, "g")       # bit
    i.px(13, 10, "G"); i.px(11, 13, "G")
    return i.outline()


def need_hunger():
    # A loaf of bread
    i = Icon()
    ellipse(i, 8, 9, 7, 4.5, "b")
    i.recolor({"b"}, "Y", lambda x, y: y <= 7 and x <= 9)
    i.recolor({"b"}, "B", lambda x, y: y >= 11 or x >= 13)
    for x in (5, 8, 11):
        i.line(x, 6, x + 1, 9, "d")                                # scored top
    i.rect(2, 12, 14, 13, "B")
    return i.outline()


def need_thirst():
    # A waterskin
    i = Icon()
    ellipse(i, 8, 10, 5.5, 5, "B")                                 # leather skin
    i.recolor({"B"}, "b", lambda x, y: x + y <= 14)
    i.recolor({"B"}, "d", lambda x, y: x + y >= 21)
    i.rect(7, 2, 9, 5, "B"); i.rect(7, 2, 7, 5, "b")               # neck
    i.rect(6, 1, 10, 1, "G"); i.rect(6, 1, 7, 1, "g")              # stopper
    i.line(4, 7, 12, 7, "d")                                       # strap stitch
    i.px(5, 9, "m"); i.px(5, 10, "c")                              # wet sheen
    return i.outline()


def need_fatigue():
    # A rolled bedroll
    i = Icon()
    i.rect(1, 5, 12, 12, "s")                                      # the roll
    i.recolor({"s"}, "e", lambda x, y: y <= 6)
    i.recolor({"s"}, "S", lambda x, y: y >= 11)
    i.disc(12.5, 8.5, 3.4, "s")                                    # its rolled end
    i.disc(12.5, 8.5, 2.0, "S"); i.disc(12.5, 8.5, 0.9, "e")
    for x in (4, 9):
        i.rect(x, 4, x, 13, "d")                                   # straps
    return i.outline()


def need_cold():
    # An icicle
    i = Icon()
    i.rect(2, 1, 13, 2, "c"); i.rect(2, 1, 13, 1, "W")            # the ledge of ice
    i.poly([(3, 3), (9, 3), (6, 15)], "c")                         # the long icicle
    i.poly([(9, 3), (13, 3), (11, 10)], "m")                       # a shorter one
    i.recolor({"c"}, "W", lambda x, y: x <= 4 and y <= 8)
    i.recolor({"c"}, "m", lambda x, y: x >= 7 and y >= 5)
    i.recolor({"m"}, "M", lambda x, y: x >= 12)
    return i.outline()


CHAPTERS = {
    "Changes": chapter_changes, "Character": chapter_character, "First days": chapter_first_days, "Staying alive": chapter_staying_alive,
    "Fighting": chapter_fighting, "Magic": chapter_magic, "Crafting": chapter_crafting, "Getting around": chapter_getting_around,
    "Death": chapter_death, "Followers": chapter_followers, "Keys": chapter_keys,
}
NEEDS = {"Hunger": need_hunger, "Thirst": need_thirst, "Fatigue": need_fatigue, "Cold": need_cold}

TABS = {"Levels": tab_levels, "Guide": tab_guide}
GUIDE = {"Tapps": tapps, "Tapps point": tapps_point}
SETS = {"": {**ICONS, **GUIDE}, "tab-": TABS, "attr-": ATTRIBUTES, "sign-": SIGNS, "race-": RACES, "mark-": MARKS, "slot-": SLOTS, "mode-": MODES, "tag-": TAGS, "deity-": DEITIES, "logo-": LOGO, "chapter-": CHAPTERS, "need-": NEEDS}


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def svg(icon):
    n = len(icon.g[0])  # 16 for the icons; Tapps is larger (WO-61)
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n} {len(icon.g)}" shape-rendering="crispEdges">']
    for y, row in enumerate(icon.g):
        x = 0
        while x < n:
            c = row[x]
            if c == ".":
                x += 1
                continue
            run = 1
            while x + run < n and row[x + run] == c:
                run += 1
            out.append(f'<rect x="{x}" y="{y}" width="{run}" height="1" fill="{PALETTE[c]}"/>')
            x += run
    out.append("</svg>")
    return "\n".join(out)


def main():
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    out = os.path.join(root, "public", "icons")
    os.makedirs(out, exist_ok=True)
    n = 0
    for prefix, icons in SETS.items():
        for name, draw in icons.items():
            with open(os.path.join(out, prefix + slug(name) + ".svg"), "w") as f:
                f.write(svg(draw()))
            n += 1
    print(n, "icons ->", os.path.relpath(out, root))


if __name__ == "__main__":
    main()
