"""
Pixel icons for the 18 skills and Destiny: 16x16, drawn with a few shape
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


ICONS = {
    "One-Handed": one_handed, "Two-Handed": two_handed, "Marksman": marksman, "Block": block,
    "Smithing": smithing, "Heavy Armor": heavy_armor, "Evasion": evasion, "Finesse": finesse,
    "Wayfarer": wayfarer, "Sneak": sneak, "Alchemy": alchemy, "Speech": speech,
    "Alteration": alteration, "Conjuration": conjuration, "Destruction": destruction,
    "Enchanting": enchanting, "Illusion": illusion, "Restoration": restoration, "Destiny": destiny,
}


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def svg(icon):
    out = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">']
    for y, row in enumerate(icon.g):
        x = 0
        while x < 16:
            c = row[x]
            if c == ".":
                x += 1
                continue
            run = 1
            while x + run < 16 and row[x + run] == c:
                run += 1
            out.append(f'<rect x="{x}" y="{y}" width="{run}" height="1" fill="{PALETTE[c]}"/>')
            x += run
    out.append("</svg>")
    return "\n".join(out)


def main():
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    out = os.path.join(root, "public", "icons")
    os.makedirs(out, exist_ok=True)
    for name, draw in ICONS.items():
        with open(os.path.join(out, slug(name) + ".svg"), "w") as f:
            f.write(svg(draw()))
    print(len(ICONS), "icons ->", os.path.relpath(out, root))


if __name__ == "__main__":
    main()
