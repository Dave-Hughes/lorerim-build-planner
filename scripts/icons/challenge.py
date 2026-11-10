"""
Pixel icons for the Zenithar's Challenge pages: the rules that have no icon elsewhere on the site, the rules
left up to the player, and the leaderboard. Same craft rules as pixels.py (16x16, light from the top left, three tones a
material, the shared outline). Each draw takes the Icon class so this file needs nothing from pixels.py.

Written by pixels.py as public/icons/challenge-<slug>.svg.
"""


def chop(Icon):
    # A log on its side, an axe sunk in it
    i = Icon()
    i.rect(1, 10, 12, 14, "B"); i.rect(1, 10, 12, 10, "b"); i.rect(1, 14, 12, 14, "d")           # the log
    i.line(3, 12, 6, 12, "d"); i.line(8, 11, 10, 11, "d")                                         # bark
    i.disc(12.5, 12.5, 2.6, "Y"); i.px(12, 12, "b"); i.px(13, 13, "b"); i.px(12, 13, "B")         # the cut end and its rings
    i.line(3, 8, 8, 3, "b"); i.line(4, 8, 9, 3, "B")                                              # the haft
    i.poly([(8, 1), (12, 0), (14, 3), (13, 7), (10, 6), (9, 4)], "g")                             # the head
    i.recolor({"g"}, "W", lambda x, y: x >= 12 and y >= 2)                                        # the edge
    i.recolor({"g"}, "w", lambda x, y: y <= 2 and x < 12)
    return i.outline()


def cook(Icon):
    # An iron pot over a fire, steam rising
    i = Icon()
    i.disc(8, 8.5, 5.2, "G", where=lambda x, y: y >= 7)                                           # the belly
    i.recolor({"G"}, "g", lambda x, y: x <= 6 and y <= 10)
    i.rect(2, 6, 13, 7, "g"); i.rect(2, 6, 13, 6, "w")                                            # the rim
    i.rect(4, 7, 11, 7, "b"); i.px(6, 7, "Y"); i.px(9, 7, "Y")                                    # the stew
    i.px(1, 7, "G"); i.px(14, 7, "G")                                                             # the lugs
    i.px(5, 14, "o"); i.px(7, 15, "o"); i.px(8, 14, "y"); i.px(10, 15, "o"); i.px(11, 14, "O")    # the fire
    i.px(6, 15, "O"); i.px(9, 15, "y")
    i.px(6, 3, "z"); i.px(6, 1, "z"); i.px(9, 4, "z"); i.px(9, 2, "z")                            # steam
    return i.outline()


def no_magic(Icon):
    # A spell's spark, struck through
    i = Icon()
    i.poly([(8, 1), (10, 6), (15, 8), (10, 10), (8, 15), (6, 10), (1, 8), (6, 6)], "m")           # the spark
    i.recolor({"m"}, "c", lambda x, y: x <= 8 and y <= 8)
    i.recolor({"m"}, "M", lambda x, y: x >= 9 and y >= 9)
    i.line(2, 13, 13, 2, "r"); i.line(3, 13, 13, 3, "q"); i.line(2, 12, 12, 2, "p")               # the strike
    return i.outline()


def no_missive(Icon):
    # A posted note, struck through
    i = Icon()
    i.rect(3, 2, 12, 14, "Y"); i.rect(11, 2, 12, 14, "b"); i.rect(3, 14, 12, 14, "b")             # the paper
    i.line(5, 5, 10, 5, "B"); i.line(5, 7, 9, 7, "B"); i.line(5, 9, 10, 9, "B"); i.line(5, 11, 8, 11, "B")
    i.rect(7, 1, 8, 2, "g")                                                                       # the nail
    i.line(2, 13, 13, 2, "r"); i.line(3, 13, 13, 3, "q"); i.line(2, 12, 12, 2, "p")               # the strike
    return i.outline()


def oath(Icon):
    # Two links of chain, closed
    i = Icon()
    def link(x0, y0, x1, y1, lit, mid, dark):
        i.rect(x0, y0, x1, y1, mid)
        i.rect(x0 + 2, y0 + 2, x1 - 2, y1 - 2, ".")
        i.rect(x0, y0, x1, y0, lit); i.rect(x0, y0, x0, y1, lit)
        i.rect(x0 + 1, y1, x1, y1, dark); i.rect(x1, y0 + 1, x1, y1, dark)
    link(1, 2, 8, 9, "W", "w", "g")
    link(7, 6, 14, 13, "w", "g", "G")
    i.rect(7, 6, 8, 7, "w"); i.px(7, 8, "."); i.px(8, 8, "g"); i.px(8, 9, "G")                    # where they pass through each other
    return i.outline()


def trophy(Icon):
    # A winner's cup
    i = Icon()
    i.poly([(4, 2), (12, 2), (11, 8), (5, 8)], "o")                                               # the bowl
    i.recolor({"o"}, "y", lambda x, y: x <= 6)
    i.recolor({"o"}, "O", lambda x, y: x >= 10)
    i.rect(4, 1, 11, 2, "y"); i.rect(9, 1, 11, 2, "o")                                            # the rim
    i.rect(1, 3, 2, 6, "o"); i.px(3, 6, "o"); i.px(3, 3, "o"); i.px(2, 4, "."); i.px(2, 5, ".")   # the handles
    i.rect(13, 3, 14, 6, "O"); i.px(12, 6, "O"); i.px(12, 3, "O"); i.px(13, 4, "."); i.px(13, 5, ".")
    i.rect(7, 9, 8, 11, "o"); i.px(7, 9, "y")                                                     # the stem
    i.rect(4, 12, 11, 14, "B"); i.rect(4, 12, 11, 12, "b"); i.rect(6, 13, 9, 13, "Y")             # the base and its plate
    return i.outline()


def hunt(Icon):
    # A stretched hide, an arrow across it
    i = Icon()
    i.poly([(2, 3), (5, 2), (8, 3), (11, 2), (14, 3), (13, 7), (14, 12), (11, 13), (8, 12), (5, 13), (2, 12), (3, 7)], "B")
    i.recolor({"B"}, "b", lambda x, y: x <= 7 and y <= 7)
    i.recolor({"B"}, "d", lambda x, y: x >= 11 or y >= 11)
    i.line(1, 14, 13, 2, "w"); i.px(14, 1, "W"); i.px(13, 1, "W"); i.px(14, 2, "W")               # the shaft and head
    i.px(1, 13, "r"); i.px(2, 14, "r"); i.px(0, 14, "r")                                          # fletching
    return i.outline()


def gem(Icon):
    # A cut gem, point down
    i = Icon()
    i.poly([(4, 3), (11, 3), (14, 7), (8, 14), (7, 14), (1, 7)], "s")
    i.recolor({"s"}, "e", lambda x, y: y <= 6 and x <= 8)                                         # the lit table
    i.recolor({"s"}, "S", lambda x, y: x >= 9 and y >= 7)                                         # the far facets
    i.line(2, 7, 13, 7, "S"); i.line(5, 4, 4, 7, "S"); i.line(10, 4, 11, 7, "S")                  # the girdle and crown cuts
    i.line(5, 8, 7, 13, "e"); i.px(5, 4, "W"); i.px(6, 4, "W")                                    # a glint
    return i.outline()


def soul_gem(Icon):
    # A soul gem: a tall crystal, empty
    i = Icon()
    i.poly([(7, 0), (8, 0), (11, 4), (11, 11), (8, 15), (7, 15), (4, 11), (4, 4)], "m")
    i.recolor({"m"}, "c", lambda x, y: x <= 6 and y <= 9)
    i.recolor({"m"}, "M", lambda x, y: x >= 9)
    i.recolor({"m", "M"}, "N", lambda x, y: y >= 12 and x >= 8)
    i.line(7, 1, 7, 14, "M"); i.line(5, 4, 10, 4, "M"); i.line(5, 11, 10, 11, "N")                # the edges of the cut
    i.px(5, 5, "W"); i.px(5, 6, "W")
    return i.outline()


def reward(Icon):
    # A sword held out hilt first, a ribbon on the grip
    i = Icon()
    i.line(4, 12, 13, 3, "w"); i.line(5, 12, 13, 4, "g"); i.px(14, 2, "W"); i.px(13, 2, "W"); i.px(14, 3, "w")   # the blade
    i.line(2, 9, 7, 14, "b"); i.line(3, 9, 7, 13, "Y")                                            # the guard
    i.line(1, 14, 3, 12, "B"); i.px(0, 15, "Y"); i.px(1, 15, "b")                                 # the grip and pommel
    i.px(3, 14, "r"); i.px(4, 15, "r"); i.px(2, 13, "p"); i.px(5, 15, "q")                        # the ribbon
    return i.outline()


def kills(Icon):
    # A stag's skull and antlers
    i = Icon()
    i.poly([(5, 8), (10, 8), (10, 11), (9, 14), (6, 14), (5, 11)], "w")                           # the skull
    i.recolor({"w"}, "W", lambda x, y: x <= 6 and y <= 10)
    i.recolor({"w"}, "g", lambda x, y: x >= 9 or y >= 13)
    i.px(6, 10, "k"); i.px(9, 10, "k"); i.px(7, 13, "G"); i.px(8, 13, "G")                        # the eyes and nose
    for s in (1, -1):                                                                             # the antlers
        cx = 7.5 + s * 2.5
        x0 = int(cx)
        i.line(x0, 7, int(cx + s * 3), 3, "b"); i.line(int(cx + s * 3), 3, int(cx + s * 3), 1, "Y")
        i.line(int(cx + s * 1), 5, int(cx + s * 1), 2, "Y"); i.line(int(cx + s * 3), 4, int(cx + s * 5), 3, "B")
    return i.outline()


CHALLENGE = {
    "Chop": chop, "Cook": cook, "No magic": no_magic, "No missive": no_missive,
    "Oath": oath, "Trophy": trophy, "Hunt": hunt,
    "Gem": gem, "Soul gem": soul_gem, "Reward": reward, "Kills": kills,
}
