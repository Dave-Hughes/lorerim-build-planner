"""
Pixel icons for the Quests page's six categories and its shelf of repeatable work, in the style
of pixels.py: 16x16, light from the top left, three tones per material, the shared outline, one
object a player would name.

pixels.py imports QUESTS and writes them as public/icons/quest-<slug>.svg.
"""


def _ell(i, cx, cy, rx, ry, c, where=None):
    for y in range(16):
        for x in range(16):
            if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1 and (where is None or where(x, y)):
                i.px(x, y, c)


def main_stories(Icon):
    # A dragon's head in profile, roaring: bone horns swept back, an ember eye
    i = Icon()
    i.poly([(0, 16), (1, 9), (4, 5), (9, 5), (15, 7), (15, 9), (10, 9), (6, 11), (5, 16)], "G")   # skull, upper jaw, neck
    i.poly([(7, 11), (10, 10), (14, 12), (13, 13), (8, 14), (6, 13)], "G")                       # lower jaw, dropped open
    i.recolor({"G"}, "g", lambda x, y: y <= 6 or (x <= 3 and y <= 10))
    i.recolor({"G"}, "k", lambda x, y: x >= 3 and y >= 14)
    i.line(10, 9, 14, 9, "W"); i.px(11, 10, "W"); i.px(13, 11, "W")                              # teeth
    i.px(11, 10, "R"); i.line(9, 10, 12, 11, "R")                                                # the open mouth
    i.poly([(3, 6), (0, 0), (6, 5)], "Y")                                                        # the long horn
    i.poly([(6, 5), (6, 1), (8, 5)], "b")                                                        # the short horn
    i.recolor({"Y"}, "b", lambda x, y: x >= 3 and y >= 3)
    i.rect(8, 6, 9, 6, "o"); i.px(9, 6, "y")                                                     # the eye
    i.px(14, 7, "k")                                                                             # nostril
    for (x, y) in ((2, 11), (3, 13), (1, 13)):
        i.px(x, y, "g")                                                                          # spines down the neck
    return i.outline()


def guilds(Icon):
    # A guild banner on a crossbar, swallow-tailed
    i = Icon()
    i.rect(2, 1, 13, 2, "b"); i.rect(2, 1, 13, 1, "Y"); i.px(13, 2, "B")      # crossbar
    i.rect(1, 1, 1, 2, "B"); i.rect(14, 1, 14, 2, "B")                         # finials
    i.poly([(3, 3), (13, 3), (13, 15), (8, 12), (3, 15)], "r")
    i.recolor({"r"}, "p", lambda x, y: x <= 4)
    i.recolor({"r"}, "q", lambda x, y: x >= 11 or y >= 12)
    for k in range(4):                                             # the guild's mark: a chevron
        i.px(5 + k, 6 + k, "Y"); i.px(5 + k, 7 + k, "b")
        i.px(11 - k, 6 + k, "b"); i.px(11 - k, 7 + k, "B")
    return i.outline()


def daedric(Icon):
    # A Daedric helm seen from the front: curled horns, ember eye slits
    i = Icon()
    _ell(i, 8, 9, 4.8, 5.6, "G")
    i.recolor({"G"}, "g", lambda x, y: x <= 6 and y <= 8)
    i.recolor({"G"}, "k", lambda x, y: y >= 13)
    i.poly([(4, 6), (0, 1), (1, 6), (3, 9)], "q")                  # left horn
    i.poly([(12, 6), (16, 1), (15, 6), (13, 9)], "q")              # right horn
    i.recolor({"q"}, "r", lambda x, y: x <= 1 or (x >= 14 and y <= 3))
    i.rect(5, 8, 7, 8, "o"); i.rect(9, 8, 11, 8, "o")              # eye slits
    i.px(5, 8, "y"); i.px(9, 8, "y")
    i.line(8, 4, 8, 7, "R")                                        # the crest
    i.rect(6, 11, 10, 11, "k"); i.px(7, 12, "G"); i.px(9, 12, "G") # the grille
    return i.outline()


def new_lands(Icon):
    # A ship under sail
    i = Icon()
    i.rect(7, 1, 7, 11, "d")                                       # mast
    i.poly([(8, 2), (14, 9), (8, 9)], "W")                         # mainsail
    i.recolor({"W"}, "w", lambda x, y: x >= 11 or y >= 8)
    i.poly([(6, 3), (2, 9), (6, 9)], "w")                          # foresail
    i.recolor({"w"}, "g", lambda x, y: x <= 3 and y >= 8)
    i.px(7, 0, "r"); i.px(8, 0, "r")                               # pennant
    i.poly([(0, 10), (16, 10), (13, 14), (3, 14)], "B")            # hull
    i.recolor({"B"}, "b", lambda x, y: y <= 10)
    i.recolor({"B"}, "d", lambda x, y: y >= 13)
    i.rect(1, 15, 14, 15, "m"); i.rect(1, 15, 4, 15, "c")          # the sea
    return i.outline()


def side_stories(Icon):
    # An open journal with a ribbon
    i = Icon()
    i.poly([(0, 4), (7, 3), (8, 4), (8, 14), (7, 13), (0, 14)], "Y")   # left page
    i.poly([(8, 4), (9, 3), (16, 4), (16, 14), (9, 13), (8, 14)], "b") # right page, in shade
    i.recolor({"b"}, "Y", lambda x, y: y <= 5 and x <= 11)
    for y in (6, 8, 10):
        i.line(2, y, 6, y, "B")
        i.line(10, y, 14, y, "d")
    i.line(11, 4, 11, 15, "r"); i.px(11, 15, "q")                  # ribbon
    i.rect(0, 14, 16, 15, "d"); i.rect(0, 14, 7, 14, "B")          # the cover beneath
    return i.outline()


def followers(Icon):
    # Two travellers, one a step behind: a hooded one and one bareheaded
    i = Icon()
    _ell(i, 11.5, 13.5, 4.5, 3.5, "M")                             # the one behind: shoulders
    i.disc(11.5, 6.5, 2.8, "N")                                    # hood
    i.disc(11.5, 7, 1.7, "k")                                      # face in shadow
    i.recolor({"M"}, "m", lambda x, y: x <= 10 and y <= 11)
    _ell(i, 5, 14, 4.6, 3.4, "s")                                  # the one in front: shoulders
    i.recolor({"s"}, "e", lambda x, y: x <= 3 and y <= 12)
    i.recolor({"s"}, "S", lambda x, y: x >= 7)
    i.disc(5, 7.5, 2.7, "f")                                       # head
    i.recolor({"f"}, "F", lambda x, y: x <= 4 and y <= 7)
    i.recolor({"f"}, "v", lambda x, y: x >= 7)
    i.rect(3, 4, 7, 5, "d"); i.px(2, 6, "d"); i.px(3, 6, "d")      # hair
    i.px(4, 8, "k"); i.px(6, 8, "k")                               # eyes
    return i.outline()


def work(Icon):
    # A coin purse with a septim spilling out
    i = Icon()
    _ell(i, 7, 10, 5.6, 4.8, "B")                                  # the purse
    i.recolor({"B"}, "b", lambda x, y: x + y <= 14)
    i.recolor({"B"}, "d", lambda x, y: x + y >= 20)
    i.poly([(4, 6), (10, 6), (11, 3), (3, 3)], "B")                # gathered neck
    i.recolor({"B"}, "b", lambda x, y: y <= 4 and x <= 6)
    i.rect(4, 6, 10, 6, "R")                                       # drawstring
    _ell(i, 12.5, 12.5, 3.2, 2.4, "a")                             # a septim, tilted
    _ell(i, 12.5, 12.2, 2.4, 1.6, "A")
    i.recolor({"A"}, "y", lambda x, y: x <= 12 and y <= 12)
    return i.outline()


QUESTS = {
    "Main stories": main_stories, "Guilds and factions": guilds, "Daedric Princes": daedric,
    "New lands": new_lands, "Side stories": side_stories, "Followers": followers, "Need coin": work,
}
