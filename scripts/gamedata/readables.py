"""
Where the thing you read is (WO-131 Part 1): for every start that is reading a book, note or letter (a `by: book`
starter in story_checks/<line>.json), every place the item is in the load order. Writes
gamedata/<version>/story_checks/readables-2026-10-21.json and .md:
  python3 scripts/gamedata/readables.py [version]

For each item:
  placed      a copy in the world: the reference, its cell, and the nearest named place (the cell's name, else its
              location's, else the worldspace's)
  container   in a container's own list: the container, and where each placed copy of it stands
  carried     in a person's inventory: who, and where they stand
  levelled    on a leveled list: the list, and the containers and people that carry the list ("random")
  nowhere     none of those in any plugin: said so, with what was searched. A courier or a script that hands it over
              (AddItem in a script) isn't read here; such an item shows as nowhere found until it is.
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
SEARCHED = "placed references, containers, people's inventories and leveled lists in every plugin of the load order"


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
            for s in q.get("startedBy", []):
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
        for grp in ("BOOK", "CONT", "NPC_", "LVLI", "LCTN", "WRLD"):
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
    for k, held in list(holders.items()):
        grp, items = held
        found = {i for i in items if i in books} | {b for i in items if i in on_list for b in on_list[i]}
        holders[k] = (grp, found, {i for i in items if i in on_list})
    keep = {k: v for k, v in holders.items() if v[1]}
    targets = set(books) | set(keep)
    # Pass 2: the references that place a book, or a container or person holding one, with their cells.
    placed = {}
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
                    if not any(r in buf[o + 24:o + 24 + size] for r in raws):
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
                if base in targets:
                    placed[key] = {"base": base, "cell": cell, "deleted": bool(flags & DELETED), "plugin": n}
                else:
                    placed.pop(key, None)  # a later plugin moved this reference to something else
    return names, cells, keep, on_list, placed


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
    names, cells, holders, on_list, placed = scan(books)
    rows = []
    for bid, b in sorted(books.items(), key=lambda kv: (kv[1]["title"] or "", kv[0])):
        places = []
        for ref, r in placed.items():
            if r["deleted"]:
                continue
            if r["base"] == bid:
                places.append({"kind": "placed", "ref": ref, "where": place_of(r["cell"], names, cells), "plugin": r["plugin"], "verdict": "files"})
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
                out.append(f"- **Placed** in {p['where']} (`{p['ref']}`, {p['plugin']}).")
            elif p["kind"] in ("container", "carried"):
                what = "In the container" if p["kind"] == "container" else "Carried by"
                at = f", which stands in {'; '.join(p['where'])}" if p.get("where") else ", which no placed reference puts anywhere"
                rnd = f" (random, through {', '.join(p['random'])})" if p.get("random") else ""
                out.append(f"- **{what}** {p['holder']} (`{p['holderId']}`){rnd}{at}.")
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
