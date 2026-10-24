"""
WO-144 Part 3: the books that teach, and where a scholar reads in bulk. Writes gamedata/<version>/book_places.json:
  python3 scripts/gamedata/book_places.py [version]

  smithingBooks  every Smithing perk that's book-gated (a rank with a `GetLevel < 0` condition -- Skyrim's own
                 convention for "no level needed, a book grants it instead"), the book that grants it, and every
                 placed copy's place, with its nearest doors -- reusing WO-131's own placement scan (`readables.py`:
                 `scan()`, `place_of()`, `near_doors()`), the way this part asks. Skill books (`SkillAlchemy5` and
                 its kin) aren't repeated here: WO-144 Part 1e already places every one against the place it's found
                 in (`places.json`'s own `goodies.skillBooks`, built from the same winning records); this file adds
                 only what that pass doesn't cover.
  readingRooms   every place with five or more placed, readable copies of a BOOK record (a physical copy sitting in
                 the world; a leveled list's random chance doesn't count, the same distinction Part 1e's "worth
                 going for" draws), by count, highest first -- for a scholar calling to be told where to go. Not a
                 whitelist of "scholar" rooms: every cell in the load order that clears the count, so the five the
                 order names (the Arcanaeum, the Bards College, Dragonsreach, the Blue Palace, Jorrvaskr) can be
                 checked against it rather than assumed into it. The five-book line is this reader's own choice, not
                 a number docs/data gives (no `docs/data/books.md` exists yet, unlike places.md/people.md) -- logged
                 as a decision, not a spec value; a bookshelf of two or three is common and not what "a scholar
                 reads here" means. Player homes aren't enumerated as a class (there's no load-order signal that
                 marks a cell "a player home" the way `CWCapital` marks a capital); any that clear the count show up
                 on their own merit, the rest are "not checked" rather than listed by name from outside the records.

Naming: `books.json` already exists (`books.py`, an older, unrelated VMAD scan of which perks' own scripts reference
which perks, wired into `build.py` for the perk trees) -- this file is `book_places.json` so it never collides with,
or gets overwritten by, that pipeline step.
"""
import json
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import ROOT, header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
from story_check import name_strings  # noqa: E402
import readables  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
DELETED = 0x20
INITIALLY_DISABLED = 0x800
MIN_ROOM = 5  # this reader's own threshold (see module docstring), not a docs/data number


def smithing_books(version):
    """{perk name: {book id, title, edid}} for every Smithing perk gated `GetLevel < 0` -- Skyrim's own
    book-teaches-this convention (`REQ_Smithing_*`'s own ranks carry the pair "any level OR < 0"; a perk with no
    `GetLevel` condition at all, like Ordinator's Smithing Specialization, is never book-gated and correctly left
    out). Scans winning `BOOK` records for a `VMAD` property reference to that perk, the same technique `books.py`
    (an older, standalone script) already used for the planner's own perk trees -- rerun here against Smithing only,
    because that script's own output (`books.json`) already belongs to the perk-tree pipeline step and only ever
    needed to know which book, not where it is."""
    base = os.path.join(REPO, "gamedata", version)
    data = json.load(open(os.path.join(base, "planner_data.json"), encoding="utf-8"))
    want = {}
    for pid, p in data["perks"].items():
        if p["tree"] != "Smithing":
            continue
        for r in p["ranks"]:
            if any(c["kind"] == "GetLevel" and c["cmp"] == "<" for c in r["conditions"]):
                want[tuple(r["key"])] = r["name"]
    pp, lo = plugin_paths(), load_order(cc=True)
    out = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if b"BOOK" not in buf:
            continue
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = name_strings(p, n, loc, ROOT) or {}
        for o in iter_group(buf, "BOOK"):
            t, flags, fid, d = rec_data(buf, o)
            if t != "BOOK":
                continue
            subs = subrecs(d)
            edid = next((v.rstrip(b"\0").decode("latin1") for s, v in subs if s == "EDID"), "")
            full = next((strings.get(struct.unpack_from("<I", v)[0], "") if loc and len(v) == 4 else v.rstrip(b"\0").decode("utf-8", "replace")
                         for s, v in subs if s == "FULL"), "")
            key = resolve(fid, masters, n)
            for s, v in subs:
                if s != "VMAD":
                    continue
                for i in range(0, len(v) - 3):
                    fidv = struct.unpack_from("<I", v, i)[0]
                    if fidv == 0:
                        continue
                    rk = resolve(fidv, masters, n)
                    if rk in want:
                        out[want[rk]] = {"book": readables.form_id(key), "title": full.strip() or edid, "edid": edid}
    return out


def smithing_book_places(version):
    """Every Smithing perk book's own rows, in WO-131's own shape: placed copies with their nearest doors, in a
    container, carried, on a leveled list, or handed over by a script -- whichever the records show."""
    perks = smithing_books(version)
    target = {v["book"]: {"title": v["title"], "starts": []} for v in perks.values()}
    by_book = {v["book"]: perk for perk, v in perks.items()}
    names, cells, holders, on_list, placed, doors, delivered = readables.scan(target)
    rows = []
    for bid, b in sorted(target.items(), key=lambda kv: kv[1]["title"] or ""):
        places = []
        for ref, r in placed.items():
            if r["deleted"] or r["base"] != bid:
                continue
            near = readables.near_doors(r, cells, doors, names)
            places.append({"kind": "placed", "ref": ref, "where": readables.place_of(r["cell"], names, cells),
                            **({"nearDoors": near} if near else {}), "plugin": r["plugin"]})
        for hid, (grp, held, via) in holders.items():
            if bid not in held:
                continue
            who = names.get(hid, {})
            standing = sorted({readables.place_of(r["cell"], names, cells) for r in placed.values() if r["base"] == hid and not r["deleted"]} - {None})
            places.append({"kind": "carried" if grp == "NPC_" else "container", "holder": who.get("name") or who.get("edid") or hid, "where": standing or None})
        for lid, held in on_list.items():
            if bid in held:
                places.append({"kind": "levelled", "list": names.get(lid, {}).get("edid") or lid, "where": None})
        for qid, script in delivered.get(bid, []):
            q = names.get(qid, {})
            places.append({"kind": "delivered", "quest": q.get("name") or q.get("edid") or qid, "script": script})
        rows.append({"perk": by_book[bid], "book": target[bid]["title"], "bookId": bid,
                      "places": places or [{"kind": "nowhere", "searched": readables.SEARCHED}]})
    return rows


def reading_rooms(version):
    """Every place with `MIN_ROOM` or more placed, readable copies of a BOOK (a `REFR` whose base is a `BOOK`
    record, never a leveled list's chance), highest count first. A dedicated pass, not `readables.scan()`'s (that
    one only follows a chosen target list of books; this one counts every book there is)."""
    pp, lo = plugin_paths(), load_order(cc=True)
    is_book, names, cells = set(), {}, {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = name_strings(p, n, loc, ROOT) or {}
        if b"BOOK" in buf:
            for o in iter_group(buf, "BOOK"):
                t, flags, fid, d = rec_data(buf, o)
                if t == "BOOK":
                    is_book.add(readables.form_id(resolve(fid, masters, n)))
        for grp in ("LCTN", "WRLD"):
            if grp.encode() not in buf:
                continue
            for o in iter_group(buf, grp):
                t, flags, fid, d = rec_data(buf, o)
                if t != grp:
                    continue
                subs = subrecs(d)
                key = readables.form_id(resolve(fid, masters, n))
                full = next((strings.get(struct.unpack_from("<I", v)[0], "") if loc and len(v) == 4 else v.rstrip(b"\0").decode("utf-8", "replace")
                             for s, v in subs if s == "FULL"), "")
                names[key] = {"name": full.strip()}
    placed_at = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = name_strings(p, n, loc, ROOT) or {}
        for top in ("CELL", "WRLD"):
            if top.encode() not in buf:
                continue
            cell = world = None
            for o in iter_group(buf, top):
                t = buf[o:o + 4]
                if t in (b"REFR", b"ACHR"):
                    tt, flags, fid, d = rec_data(buf, o)
                    subs = subrecs(d)
                    base = next((readables.form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs if s == "NAME" and len(v) >= 4), None)
                    key = readables.form_id(resolve(fid, masters, n))
                    if base in is_book:
                        placed_at[key] = {"cell": cell, "deleted": bool(flags & DELETED), "disabled": bool(flags & INITIALLY_DISABLED)}
                    else:
                        placed_at.pop(key, None)
                    continue
                if t not in (b"CELL", b"WRLD"):
                    continue
                tt, flags, fid, d = rec_data(buf, o)
                subs = subrecs(d)
                key = readables.form_id(resolve(fid, masters, n))
                if tt == "WRLD":
                    world = key
                    continue
                cell = key
                c = cells.setdefault(key, {})
                c["world"] = world if top == "WRLD" else None
                for s, v in subs:
                    if s == "FULL":
                        c["name"] = (strings.get(struct.unpack_from("<I", v)[0], "") if loc and len(v) == 4 else v.rstrip(b"\0").decode("utf-8", "replace")).strip()
                    elif s == "XLCN" and len(v) >= 4:
                        c["location"] = readables.form_id(resolve(struct.unpack_from("<I", v)[0], masters, n))
    counts = {}
    for ref, r in placed_at.items():
        if r["deleted"] or r["disabled"]:
            continue
        place = readables.place_of(r["cell"], names, cells)
        if place:
            counts[place] = counts.get(place, 0) + 1
    rows = [{"place": place, "books": n} for place, n in counts.items() if n >= MIN_ROOM]
    rows.sort(key=lambda r: (-r["books"], r["place"]))
    return rows


def build(version):
    return {"smithingBooks": smithing_book_places(version), "readingRooms": reading_rooms(version)}


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    data = build(version)
    base = os.path.join(REPO, "gamedata", version)
    with open(os.path.join(base, "book_places.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"about": __doc__.strip().splitlines()[0], **data}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"{len(data['smithingBooks'])} Smithing perk books, {len(data['readingRooms'])} reading rooms -> book_places.json")


if __name__ == "__main__":
    main()
