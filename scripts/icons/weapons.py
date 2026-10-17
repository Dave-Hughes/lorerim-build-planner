"""
Pixel icons for the weapon types and the two kinds of ammunition (the Gear page's type chips,
after WO-92), in the same style as pixels.py: 16x16, light from the top left, three tones per
material, the shared outline. Every weapon lies on the same diagonal, grip at the bottom left
and point at the top right, so a row of them reads as one set.

pixels.py imports WEAPONS and writes them as public/icons/weapon-<slug>.svg.
"""


def _blade(i, x0, y0, x1, y1, lit="W", shade="g", width=2):
    """A straight blade along a down-left diagonal: a lit edge, then a shaded one beside it."""
    i.line(x0, y0, x1, y1, lit)
    if width >= 2:
        i.line(x0, y0 + 1, x1, y1 + 1, shade)
    if width >= 3:
        i.line(x0 - 1, y0 + 1, x1 - 1, y1 + 1, lit)


def _haft(i, x0, y0, x1, y1, lit="b", shade="B"):
    i.line(x0, y0, x1, y1, lit)
    i.line(x0 + 1, y0, x1 + 1, y1, shade)


def _bar(i, cx, cy, half_len, half_wide, c, along=(1, 1)):
    """A filled bar centred on (cx, cy), lying along `along` (the other diagonal by default)."""
    ux, uy = along
    n = (ux * ux + uy * uy) ** 0.5
    ux, uy = ux / n, uy / n
    vx, vy = uy, -ux
    pts = [(cx + ux * a + vx * b, cy + uy * a + vy * b) for a, b in ((-half_len, -half_wide), (half_len, -half_wide), (half_len, half_wide), (-half_len, half_wide))]
    i.poly(pts, c)


def _shade(i, frm, lo=13, hi=17):
    """Light from the top left: the upper-left part lit, the lower-right part shaded."""
    i.recolor({frm}, "W", lambda x, y: x + y <= lo)
    i.recolor({frm}, "g", lambda x, y: x + y >= hi)


def weapon_sword(Icon):
    i = Icon()
    _blade(i, 13, 1, 6, 8)
    i.px(14, 0, "W")
    i.line(3, 7, 7, 11, "b"); i.px(3, 7, "Y"); i.px(4, 8, "Y")     # crossguard
    i.line(4, 11, 2, 13, "d")                                       # grip
    i.px(1, 14, "Y")                                                # pommel
    return i.outline()


def weapon_greatsword(Icon):
    i = Icon()
    _bar(i, 10.0, 6.0, 7.2, 1.25, "w", along=(1, -1))               # long, broad blade
    i.recolor({"w"}, "W", lambda x, y: x + y <= 15 and y - x <= -5)
    i.recolor({"w"}, "g", lambda x, y: y - x >= -3)
    i.px(15, 0, "W")
    i.line(2, 7, 7, 12, "b"); i.px(2, 7, "Y"); i.px(3, 8, "Y")     # wide crossguard
    i.line(3, 11, 1, 13, "d"); i.line(4, 11, 2, 13, "d")           # two-hand grip
    i.px(0, 14, "Y"); i.px(1, 14, "Y")                             # pommel
    return i.outline()


def weapon_dagger(Icon):
    i = Icon()
    _blade(i, 11, 4, 8, 7)
    i.px(12, 3, "W")
    i.line(5, 7, 8, 10, "b"); i.px(5, 7, "Y")                      # small guard
    i.line(6, 10, 5, 11, "d")                                       # short grip
    i.px(4, 12, "Y")
    return i.outline()


def weapon_rapier(Icon):
    i = Icon()
    i.line(14, 1, 6, 9, "W")                                        # thin blade, one pixel
    i.px(15, 0, "W")
    i.line(3, 8, 6, 11, "b")                                        # quillons
    i.px(5, 8, "Y"); i.px(4, 7, "Y"); i.px(6, 9, "B")               # the swept guard's arc
    i.line(4, 11, 2, 13, "d")                                       # grip
    i.line(3, 13, 7, 11, "B")                                       # knuckle bow
    i.px(1, 14, "Y")
    return i.outline()


def weapon_mace(Icon):
    i = Icon()
    _haft(i, 2, 13, 8, 7)
    i.px(1, 14, "G")
    i.disc(10.6, 5.4, 3.2, "w")                                     # head
    for (x, y) in ((10, 0), (11, 0), (15, 5), (15, 6), (6, 4), (6, 5), (10, 10)):
        i.px(x, y, "g")                                             # flanges
    i.recolor({"w"}, "W", lambda x, y: x + y < 15)
    i.recolor({"w"}, "g", lambda x, y: x + y > 17)
    return i.outline()


def weapon_war_axe(Icon):
    i = Icon()
    _haft(i, 2, 14, 12, 4)
    i.poly([(13.0, 3.5), (9.5, 7.0), (6.0, 6.0), (5.5, 3.0), (8.5, 1.0)], "w")   # one bit, on the near side
    _shade(i, "w", lo=9, hi=13)
    i.px(13, 3, "G")                                                # butt of the head
    i.line(3, 13, 4, 12, "d")                                       # grip wrap
    return i.outline()


def weapon_battleaxe(Icon):
    i = Icon()
    i.poly([(12.5, 3.5), (9.5, 6.5), (6.5, 6.0), (6.0, 3.0), (9.0, 1.0)], "w")    # near bit
    i.poly([(12.5, 3.5), (9.5, 6.5), (10.0, 9.5), (13.0, 10.0), (15.0, 7.0)], "w")  # far bit, its mirror
    _shade(i, "w", lo=10, hi=20)
    _haft(i, 1, 14, 13, 2)                                           # the haft runs through both
    i.line(2, 13, 4, 11, "d")
    return i.outline()


def weapon_warhammer(Icon):
    i = Icon()
    _haft(i, 1, 14, 10, 5)
    _bar(i, 11.5, 4.5, 3.6, 1.7, "w")                               # the head, across the haft
    _shade(i, "w", lo=14, hi=17)
    i.recolor({"W", "w", "g"}, "G", lambda x, y: x + y >= 18)        # its striking face
    i.px(12, 1, "g"); i.px(13, 0, "G")                              # spike on top
    i.line(2, 13, 4, 11, "d")
    return i.outline()


def weapon_spear(Icon):
    i = Icon()
    _haft(i, 1, 14, 10, 5)
    i.poly([(9.5, 4.5), (14.5, 0.5), (11.5, 6.5)], "W")              # leaf point
    i.recolor({"W"}, "g", lambda x, y: x + y >= 15 and x >= 11)
    i.px(9, 6, "G"); i.px(10, 6, "G")                               # binding
    return i.outline()


def weapon_polearm(Icon):
    i = Icon()
    _haft(i, 1, 14, 12, 3)
    i.line(13, 2, 15, 0, "W"); i.px(14, 2, "g")                     # top spike
    i.poly([(12.5, 3.0), (9.5, 6.0), (6.5, 5.0), (6.5, 2.5), (9.0, 1.5)], "w")   # axe blade, near side
    _shade(i, "w", lo=9, hi=12)
    i.px(13, 5, "g"); i.px(14, 6, "G")                              # back hook
    return i.outline()


def weapon_javelin(Icon):
    i = Icon()
    i.line(2, 14, 11, 5, "b")                                       # light one-pixel shaft
    i.line(10, 4, 12, 4, "W"); i.line(12, 2, 12, 4, "W")            # small head
    i.line(13, 1, 14, 0, "W"); i.px(12, 3, "W"); i.px(13, 3, "g"); i.px(12, 2, "W")
    i.line(5, 11, 6, 10, "d")                                       # throwing grip
    return i.outline()


def weapon_quarterstaff(Icon):
    i = Icon()
    _haft(i, 1, 14, 13, 2)
    i.line(1, 14, 3, 12, "G"); i.line(2, 14, 4, 12, "G")            # iron caps
    i.line(12, 3, 14, 1, "g"); i.line(13, 3, 15, 1, "G")
    i.line(6, 9, 8, 7, "d")                                         # grip wrap
    return i.outline()


def weapon_staff(Icon):
    i = Icon()
    _haft(i, 1, 14, 9, 6, lit="B", shade="d")
    i.disc(11.5, 4.5, 2.6, "m")                                     # the gem
    i.recolor({"m"}, "c", lambda x, y: x + y <= 14)
    i.recolor({"m"}, "M", lambda x, y: x + y >= 18)
    for (x, y) in ((9, 3), (12, 7), (14, 2)):
        i.px(x, y, "b")                                             # claws holding it
    i.px(15, 0, "z"); i.px(8, 1, "z")                               # glints
    return i.outline()


def weapon_bow(Icon):
    i = Icon()
    for (x, y) in ((13, 0), (12, 1), (11, 2), (10, 3), (9, 4), (8, 5), (7, 6), (6, 7), (5, 8), (4, 9), (3, 10), (2, 11), (1, 12)):
        pass
    # A drawn longbow seen side-on: the limb bowed up-right, the string straight.
    limb = ((14, 1), (13, 1), (12, 1), (11, 2), (10, 2), (9, 3), (8, 4), (7, 5), (6, 6), (5, 7), (4, 8), (3, 9), (2, 10), (2, 11), (1, 12), (1, 13), (1, 14))
    for (x, y) in limb:
        i.px(x, y, "b")
    for (x, y) in ((10, 3), (9, 4), (8, 5), (4, 9), (3, 10)):
        i.px(x, y, "B")
    i.px(12, 0, "Y"); i.px(13, 0, "Y")
    i.rect(6, 6, 7, 7, "d")                                         # grip
    i.line(14, 2, 2, 14, "L")                                       # string
    return i.outline()


def weapon_crossbow(Icon):
    # Seen from above, pointing up: the one weapon off the diagonal, since only its T shape reads.
    i = Icon()
    i.rect(7, 4, 8, 15, "b"); i.line(8, 4, 8, 15, "B")             # tiller
    i.rect(7, 12, 8, 15, "d")                                       # stock
    for x in range(1, 15):
        i.px(x, 4 if 3 <= x <= 12 else 5, "g")                      # the prod, ends swept back
    i.line(3, 3, 12, 3, "W")                                        # its lit face
    i.px(1, 6, "g"); i.px(14, 6, "g")
    i.line(2, 6, 7, 10, "L"); i.line(13, 6, 8, 10, "L")             # string, drawn back
    i.rect(7, 1, 8, 2, "W"); i.px(8, 2, "g")                        # bolt point
    return i.outline()


def weapon_pickaxe(Icon):
    i = Icon()
    _haft(i, 2, 14, 10, 6)
    i.line(6, 2, 9, 3, "W"); i.line(10, 4, 13, 8, "g")              # curved head
    i.line(6, 3, 9, 4, "w"); i.line(11, 4, 14, 8, "G")
    i.px(10, 3, "W"); i.px(10, 5, "G")
    i.px(5, 1, "W"); i.px(14, 9, "g")                               # points
    return i.outline()


def ammo_arrow(Icon):
    i = Icon()
    i.poly([(0.5, 12.5), (3.5, 9.5), (6.0, 12.0), (3.0, 15.0)], "o")   # fletching
    i.recolor({"o"}, "O", lambda x, y: x + y >= 15)
    i.line(2, 13, 11, 4, "b")                                       # shaft, through it
    i.poly([(10.5, 3.5), (14.5, 0.5), (13.5, 5.5)], "W")              # head
    i.px(13, 3, "g")
    return i.outline()


def ammo_bolt(Icon):
    i = Icon()
    i.poly([(1.5, 11.5), (4.0, 9.0), (6.0, 11.0), (3.5, 13.5)], "w")   # stiff vanes
    i.recolor({"w"}, "g", lambda x, y: x + y >= 15)
    i.line(4, 11, 10, 5, "b"); i.line(5, 11, 11, 5, "B")            # short, thick shaft
    i.poly([(9.5, 3.5), (13.5, 1.5), (12.5, 6.5)], "g")             # squat head
    i.recolor({"g"}, "W", lambda x, y: x + y <= 14 and y <= 6)
    return i.outline()


WEAPONS = {
    "Sword": weapon_sword, "Greatsword": weapon_greatsword, "Dagger": weapon_dagger, "Rapier": weapon_rapier,
    "Mace": weapon_mace, "War Axe": weapon_war_axe, "Battleaxe": weapon_battleaxe, "Warhammer": weapon_warhammer,
    "Spear": weapon_spear, "Polearm": weapon_polearm, "Javelin": weapon_javelin, "Quarterstaff": weapon_quarterstaff,
    "Staff": weapon_staff, "Bow": weapon_bow, "Crossbow": weapon_crossbow, "Pickaxe": weapon_pickaxe,
    "Arrow": ammo_arrow, "Bolt": ammo_bolt,
}
