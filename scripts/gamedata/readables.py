"""
Where the thing you read is (WO-131 Part 1): for every start that is reading a book, note or letter (a `by: book`
starter in story_checks/<line>.json), every place the item is in the load order. Writes
gamedata/<version>/story_checks/readables-2026-10-21.json and .md:
  python3 scripts/gamedata/readables.py [version]

For each item:
  placed      a copy in the world: the reference, its cell, and the nearest named place (the cell's name, else its
              location's, else the worldspace's), and the up to three nearest doors within NEAR units that lead somewhere
              named, each with its distance (Running Wild's note: Hearth-Healer's Hall and Joslin's House, about 22 m
              each, then The Bannered Mare); which one it's "outside" is for a person to say
  container   in a container's own list: the container, and where each placed copy of it stands
  carried     in a person's inventory: who, and where they stand
  levelled    on a leveled list: the list, and the containers and people that carry the list ("random")
  delivered   a quest's script (or one of its aliases') holds the item as a property and calls AddItem or
              AddItemToContainer: the quest and script that hand it over (The Heart of Dibella's letter, on waking)
  nowhere     none of those in any plugin: said so, with what was searched.
The winning record decides: a later plugin's copy of a reference, container or person replaces an earlier one, and a
deleted reference doesn't count.
"""
import glob
import json
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import ROOT, header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
from story_check import name_strings  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
DELETED = 0x20
NEAR = 2000  # game units (about 29 m): a door further than this from the item doesn't place it
SEARCHED = ("placed references, containers, people's inventories, leveled lists and quest scripts that add it, in every plugin "
            "of the load order")


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


def raw_ids(keys, masters, name):
    """The 4-byte form ids `keys` would have inside this plugin, to skip records that can't hold one."""
    order = [m.lower() for m in masters] + [name.lower()]
    out = set()
    for plugin, local in keys:
        if plugin.lower() in order:
            out.add(struct.pack("<I", (order.index(plugin.lower()) << 24) | local))
    return out


def key_of(fid):
    plugin, local = fid.split(":")
    return plugin, int(local, 16)


def book_starts(base):
    """{book id: {title, starts: [{quest, line, call, source}]}} from every story check."""
    out = {}
    for p in sorted(glob.glob(os.path.join(base, "story_checks", "*.json"))):
        try:
            d = json.load(open(p, encoding="utf-8"))
        except ValueError:
            continue
        for q in d.get("quests", []) if isinstance(d, dict) else []:
            # A start, or the read that moves a quest to its second step (Letter from Largashbur, The Cursed Tribe's 10).
            for s in q.get("startedBy", []) + ((q.get("secondStep") or {}).get("movedBy") or []):
                if s.get("by") == "book" and s.get("bookId"):
                    b = out.setdefault(s["bookId"], {"title": s.get("book"), "starts": []})
                    row = {"quest": q["name"], "line": os.path.basename(p)[:-5], "call": s.get("call"), "source": s.get("source")}
                    if row not in b["starts"]:
                        b["starts"].append(row)
    return out


def scan(books):
    """Every place each book is: one pass over the plugins for lists, a second for the references that place them."""
    pp, lo = plugin_paths(), load_order(cc=True)
    names, cells, holders = {}, {}, {}  # holders: container/NPC/list id -> (kind, set of book ids it holds)
    want = {key_of(b) for b in books}
    lists = {}  # leveled list id -> books on it
    # Pass 1: names, and the containers, people and leveled lists that hold a book (or a list holding one).
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = name_strings(p, n, loc, ROOT) or {}
        for grp in ("BOOK", "CONT", "NPC_", "LVLI", "LCTN", "WRLD", "QUST"):
            if grp.encode() not in buf:
                continue
            for o in iter_group(buf, grp):
                t, flags, fid, d = rec_data(buf, o)
                if t != grp:
                    continue
                key = form_id(resolve(fid, masters, n))
                subs = subrecs(d)
                edid = next((v.rstrip(b"\0").decode("latin1") for s, v in subs if s == "EDID"), "")
                full = next((strings.get(struct.unpack_from("<I", v)[0], "") if loc and len(v) == 4 else v.rstrip(b"\0").decode("utf-8", "replace")
                             for s, v in subs if s == "FULL"), "")
                names[key] = {"edid": edid, "name": full.strip(), "type": grp}
                items = [form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs if s in ("CNTO", "LVLO") and len(v) >= 8
                         for v in [v if s == "CNTO" else v[4:]]]
                if grp == "LVLI":
                    held = {i for i in items if i in books}
                    lists[key] = held  # the winning copy of the list
                elif grp in ("CONT", "NPC_"):
                    holders[key] = (grp, set(items))
    on_list = {k: v for k, v in lists.items() if v}  # one level: a list holding the book itself
    delivered = delivered_by(books, names)
    for k, held in list(holders.items()):
        grp, items = held
        found = {i for i in items if i in books} | {b for i in items if i in on_list for b in on_list[i]}
        holders[k] = (grp, found, {i for i in items if i in on_list})
    keep = {k: v for k, v in holders.items() if v[1]}
    targets = set(books) | set(keep)
    # Pass 2: the references that place a book, or a container or person holding one, with their cells.
    placed, doors = {}, {}  # doors: ref -> {cell, pos, to}: every door that teleports somewhere (XTEL)
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = name_strings(p, n, loc, ROOT) or {}
        raws = raw_ids([key_of(t) for t in targets], masters, n)
        for top in ("CELL", "WRLD"):
            if top.encode() not in buf:
                continue
            cell = world = None
            for o in iter_group(buf, top):
                t = buf[o:o + 4]
                if t in (b"REFR", b"ACHR"):
                    size = struct.unpack_from("<I", buf, o + 4)[0]
                    body = buf[o + 24:o + 24 + size]
                    if b"XTEL" in body and t == b"REFR":
                        _, flags, fid, d = rec_data(buf, o)
                        subs = subrecs(d)
                        to = next((form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs if s == "XTEL" and len(v) >= 4), None)
                        pos = next((list(struct.unpack_from("<fff", v)) for s, v in subs if s == "DATA" and len(v) >= 12), None)
                        doors[form_id(resolve(fid, masters, n))] = {"cell": cell, "pos": pos, "to": to}
                    if not any(r in body for r in raws):
                        continue
                elif t not in (b"CELL", b"WRLD"):
                    continue
                tt, flags, fid, d = rec_data(buf, o)
                subs = subrecs(d)
                key = form_id(resolve(fid, masters, n))
                if tt == "WRLD":
                    world = key
                    continue
                if tt == "CELL":
                    cell = key
                    c = cells.setdefault(key, {})
                    c["world"] = world if top == "WRLD" else None
                    for s, v in subs:
                        if s == "FULL":
                            c["name"] = (strings.get(struct.unpack_from("<I", v)[0], "") if loc and len(v) == 4 else v.rstrip(b"\0").decode("utf-8", "replace")).strip()
                        elif s == "XLCN" and len(v) >= 4:
                            c["location"] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, n))
                    continue
                base = next((form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs if s == "NAME" and len(v) >= 4), None)
                pos = next((list(struct.unpack_from("<fff", v)) for s, v in subs if s == "DATA" and len(v) >= 12), None)
                if base in targets:
                    placed[key] = {"base": base, "cell": cell, "pos": pos, "deleted": bool(flags & DELETED), "plugin": n}
                else:
                    placed.pop(key, None)  # a later plugin moved this reference to something else
    return names, cells, keep, on_list, placed, doors, delivered


def delivered_by(books, names):
    """{book: [(quest, script)]}: quest and alias scripts that hold the book as a property and call AddItem or AddItemToContainer."""
    import quest_scripts as qsc
    from pex import Scripts, functions
    pp, lo = plugin_paths(), load_order(cc=True)
    quests = {}
    for n in lo:
        p = pp.get(n.lower())
        if p:
            buf = open(p, "rb").read()
            if b"QUST" in buf:
                quests.update(qsc.read_plugin(buf, n)["quests"])  # the winning copy of each quest
    scripts = Scripts(ROOT, lo)
    out = {}
    for qid, q in quests.items():
        vm = q.get("vmad") or {}
        for sc in vm.get("scripts", []) + [x for a in vm.get("aliasScripts", []) for x in a["scripts"]]:
            held = {v["form"] for v in sc["props"].values() if isinstance(v, dict) and v.get("form") in books}
            if not held:
                continue
            pex = scripts.get(sc["name"])
            adds = isinstance(pex, dict) and any(op == "callmethod" and args and str(args[0][1]).lower() in ("additem", "additemtocontainer")
                                                 for _, f in functions(pex) for op, args in f["code"])
            if adds:
                for b in held:
                    out.setdefault(b, []).append((qid, sc["name"]))
    return out


def near_doors(r, cells, doors, names):
    """For a placed copy, the up to three nearest doors within NEAR that lead somewhere named: [{door, metres}], nearest first."""
    if not r.get("pos"):
        return []
    c = cells.get(r["cell"]) or {}
    here = place_of(r["cell"], names, cells)
    found = {}
    for d in doors.values():
        dc = cells.get(d["cell"]) or {}
        same = d["cell"] == r["cell"] or (c.get("world") and dc.get("world") == c.get("world"))
        if not same or not d.get("pos") or not d.get("to"):
            continue
        dist = sum((a - b) ** 2 for a, b in zip(d["pos"][:2], r["pos"][:2])) ** 0.5
        dest = doors.get(d["to"]) or {}
        to = place_of(dest.get("cell"), names, cells) if dest.get("cell") else None
        if dist > NEAR or not to or to == here:
            continue
        to = to.split(", ")[0]
        if to not in found or dist < found[to]:
            found[to] = dist
    return [{"door": k, "metres": round(v * 0.01428)} for k, v in sorted(found.items(), key=lambda kv: kv[1])[:3]]


def place_of(cell, names, cells):
    """The nearest named place: the cell's name and its location's, else the location's, else the worldspace's."""
    c = cells.get(cell) or {}
    loc = names.get(c.get("location"), {}).get("name")
    world = names.get(c.get("world"), {}).get("name")
    here = c.get("name")
    if here and loc and loc != here:
        return f"{here}, {loc}"
    return here or loc or (f"somewhere in {world}" if world else None) or cell


def build(version):
    base = os.path.join(REPO, "gamedata", version)
    books = book_starts(base)
    names, cells, holders, on_list, placed, doors, delivered = scan(books)
    rows = []
    for bid, b in sorted(books.items(), key=lambda kv: (kv[1]["title"] or "", kv[0])):
        places = []
        for ref, r in placed.items():
            if r["deleted"]:
                continue
            if r["base"] == bid:
                near = near_doors(r, cells, doors, names)
                places.append({"kind": "placed", "ref": ref, "where": place_of(r["cell"], names, cells), **({"nearDoors": near} if near else {}),
                               "plugin": r["plugin"], "verdict": "files"})
        for hid, (grp, held, via) in holders.items():
            if bid not in held:
                continue
            who = names.get(hid, {})
            standing = sorted({place_of(r["cell"], names, cells) for r in placed.values() if r["base"] == hid and not r["deleted"]} - {None})
            random = [names.get(l, {}).get("edid") or l for l in via if bid in on_list.get(l, ())]
            places.append({"kind": "carried" if grp == "NPC_" else "container", "holder": who.get("name") or who.get("edid") or hid, "holderId": hid,
                           "where": standing or None, **({"random": random} if random else {}), "verdict": "files"})
        for lid, held in on_list.items():
            if bid in held and not any(lid in p.get("random", []) or names.get(lid, {}).get("edid") in p.get("random", []) for p in places):
                places.append({"kind": "levelled", "list": names.get(lid, {}).get("edid") or lid, "listId": lid, "where": None, "verdict": "files"})
        for qid, script in delivered.get(bid, []):
            q = names.get(qid, {})
            places.append({"kind": "delivered", "quest": q.get("name") or q.get("edid") or qid, "questId": qid, "script": script, "verdict": "script"})
        rows.append({"item": b["title"] or names.get(bid, {}).get("name") or bid, "itemId": bid, "edid": names.get(bid, {}).get("edid"),
                     "starts": b["starts"], "places": places or [{"kind": "nowhere", "searched": SEARCHED, "verdict": "files"}]})
    return rows


def markdown(rows):
    out = ["# Where the thing you read is (WO-131 Part 1)", "",
           "Written by `scripts/gamedata/readables.py` from every `by: book` start in `story_checks/` and the winning records "
           "in the load order. A place is the cell's own name with its location, else the location's, else the worldspace's. "
           "A courier or script that hands the item over isn't read yet, so such an item shows as nowhere found.", ""]
    for r in rows:
        starts = "; ".join(f"{s['quest']} ({s['call']})" for s in r["starts"])
        out += [f"## {r['item']} (`{r['itemId']}`{', ' + r['edid'] if r.get('edid') else ''})", "", f"Starts: {starts}.", ""]
        for p in r["places"]:
            if p["kind"] == "placed":
                near = ("; the nearest doors lead to " + ", ".join(f"{d['door']} ({d['metres']} m)" for d in p["nearDoors"])) if p.get("nearDoors") else ""
                out.append(f"- **Placed** in {p['where']}{near} (`{p['ref']}`, {p['plugin']}).")
            elif p["kind"] in ("container", "carried"):
                what = "In the container" if p["kind"] == "container" else "Carried by"
                at = f", which stands in {'; '.join(p['where'])}" if p.get("where") else ", which no placed reference puts anywhere"
                rnd = f" (random, through {', '.join(p['random'])})" if p.get("random") else ""
                out.append(f"- **{what}** {p['holder']} (`{p['holderId']}`){rnd}{at}.")
            elif p["kind"] == "delivered":
                out.append(f"- **Handed over** by a script: {p['quest']} (`{p['questId']}`), `{p['script']}`, adds it to you.")
            elif p["kind"] == "levelled":
                out.append(f"- **On a leveled list**, {p['list']} (`{p['listId']}`): random, and nothing here carries the list.")
            else:
                out.append(f"- **Nowhere found** in {p['searched']}.")
        out.append("")
    return "\n".join(out).rstrip() + "\n"


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    rows = build(version)
    base = os.path.join(REPO, "gamedata", version, "story_checks")
    with open(os.path.join(base, "readables-2026-10-21.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"about": __doc__.strip().splitlines()[1], "items": rows}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    with open(os.path.join(base, "readables-2026-10-21.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write(markdown(rows))
    print(f"{len(rows)} read-this items, {sum(1 for r in rows if r['places'][0]['kind'] == 'nowhere')} found nowhere -> story_checks/readables-2026-10-21.json")


if __name__ == "__main__":
    main()
