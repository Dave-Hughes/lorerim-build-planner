"""WO-166 Part 1: where a place is, from the game's own records -- never typed in.

A position is {"world", "pos": [x, y, z], "posFrom"}: the worldspace's editor id ("Tamriel", "DLC2SolstheimWorld"), game units, and
how it was found, in this order of trust:
  marker  the place's own map marker (its location's MNAM, else the one marker with its name);
  cells   the exterior cells whose location (XLCN) is the place or inside it: the middle of their grid squares (no height: z is None);
  door    an interior's door that leads out (XTEL -> a door standing in an exterior cell), followed up to MAX_HOPS rooms deep.
A result that lands on a map (Tamriel, Solstheim, a mod's own land) beats one that doesn't; a place found only inside a pocket
worldspace (Blackreach, Alftand) keeps that world's name, so a page never pins it on a map it isn't on.

Pure functions over the dicts places.scan() returns (cells, markers): no file is read here.
"""
import collections

CELL = 4096.0  # an exterior cell is 4,096 units a side
MIN_MARKERS = 5  # a worldspace with this many map markers is a map; fewer is a pocket (a dungeon's own world). The real lands
# have 6 or more (Wyrmstooth 51, Vigilant's realm 44, Hyorker Isle 18, ksws07World 6); Fort Dawnguard's yard has 3, and the Soul
# Cairn and Gray Fox's Coldharbour 2 to 3. At 3 Fort Dawnguard's yard counted as a map and Dayspring Canyon was "found" inside it.
MAX_HOPS = 3  # rooms deep a door search goes before giving up
# The five big cities are worldspaces of their own, but laid out on Tamriel's own coordinates: checked door to door against
# Tamriel's gate doors (Riften 20-440 units apart, Solitude 0-1,050, Windhelm 70-1,750, Whiterun 55, Markarth 14). A position in
# one is a position on Tamriel's map. The dungeon worlds are not (Blackreach is 70 km off), and are left as they are.
CITY_WORLDS = {"WhiterunWorld": "Tamriel", "WindhelmWorld": "Tamriel", "RiftenWorld": "Tamriel",
               "MarkarthWorld": "Tamriel", "SolitudeWorld": "Tamriel"}


def canon(world):
    return CITY_WORLDS.get(world, world)


def map_worlds(cells, markers):
    """The worldspaces that are maps: the ones holding at least MIN_MARKERS live map markers (Tamriel always)."""
    n = collections.Counter(canon((cells.get(m["cell"]) or {}).get("worldEdid")) for m in markers.values()
                            if not m.get("deleted") and m.get("pos"))
    return {w for w, c in n.items() if w and c >= MIN_MARKERS} | {"Tamriel"}


def door_index(cells):
    """Every door that has a teleport link, by reference: {ref: {"cell", "pos", "dest"}}."""
    out = {}
    for ck, c in cells.items():
        for ref, d in (c.get("doors") or {}).items():
            out[ref] = {"cell": ck, "pos": d["pos"], "dest": d["dest"]}
    return out


def at_marker(m, cells):
    if not m or m.get("deleted") or not m.get("pos"):
        return None
    w = (cells.get(m.get("cell")) or {}).get("worldEdid")
    if not w:
        return None  # a marker standing in an interior cell is on no map
    return {"world": canon(w), "pos": [round(v, 1) for v in m["pos"][:3]], "posFrom": "marker"}


def at_cells(cell_keys, cells):
    """The middle of the exterior cells' grid squares, in the worldspace most of them are in. No height is known: z is None."""
    by = collections.defaultdict(list)
    for ck in cell_keys:
        c = cells.get(ck) or {}
        if c.get("grid") and c.get("worldEdid"):
            by[canon(c["worldEdid"])].append(c["grid"])
    if not by:
        return None
    world = max(by, key=lambda w: (len(by[w]), w))
    g = by[world]
    return {"world": world, "posFrom": "cells",
            "pos": [round(sum(x for x, _ in g) / len(g) * CELL + CELL / 2, 1), round(sum(y for _, y in g) / len(g) * CELL + CELL / 2, 1), None]}


def at_doors(cell_keys, cells, doors, maps, max_hops=MAX_HOPS):
    """The nearest way out onto a map: a door in one of these cells whose far side is a door in an exterior cell of a map world,
    else the same from the rooms those doors lead to, up to max_hops. The door standing outside is the position. Several ways
    out in one hop: the first by reference (named, so it's the same every run; the count is kept as `exits`)."""
    seen, frontier = set(cell_keys), sorted(cell_keys)
    for hop in range(1, max_hops + 1):
        exits, nxt = [], []
        for ck in frontier:
            c = cells.get(ck) or {}
            mine = canon(c.get("worldEdid"))
            for ref in sorted(c.get("doors") or {}):
                d = doors.get(c["doors"][ref]["dest"])
                if not d:
                    continue
                far = canon((cells.get(d["cell"]) or {}).get("worldEdid"))
                if far and far in maps and far != mine:
                    exits.append((far, d["cell"], ref, tuple(d["pos"][:3])))
                elif d["cell"] not in seen:
                    seen.add(d["cell"])
                    nxt.append(d["cell"])
        if exits:
            world = max(collections.Counter(e[0] for e in exits), key=lambda w: (sum(1 for e in exits if e[0] == w), w))
            mine = sorted(e for e in exits if e[0] == world)
            return {"world": world, "pos": [round(v, 1) for v in mine[0][3]], "posFrom": "door", "hops": hop, "exits": len(mine)}
        frontier = sorted(nxt)
    return None


def locate(marker, cell_keys, cells, doors, maps):
    """The place's position by the order of trust above; the first that lands on a map wins, else the first found at all."""
    first = None
    for get in (lambda: at_marker(marker, cells), lambda: at_cells(cell_keys, cells), lambda: at_doors(cell_keys, cells, doors, maps)):
        p = get()
        if p and p["world"] in maps:
            return p
        first = first or p
    return first
