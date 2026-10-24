"""
WO-156: every person's AI packages and other facts, dumped raw -- no reading, no "where they are by day".
The people reads (WO-155) need the records; this just puts them within reach. Needs people_raw.json first
(places.py's own scan(), reused rather than reading the load order twice):
  python3 scripts/gamedata/people_schedules.py [version]

For every person in people_raw.json (and every quest giver, even one not in that file):
  packages   their NPC_'s PKID list, in that order (the game's own priority, highest first), each package's
             EDID and plugin; PKDT raw hex (the type byte's own enum isn't decoded -- not verified against
             this project's own records, so not claimed; the package's own EDID names its intent far more
             reliably: "...Sandbox...", "...Sleep...", "...Work...", "...Eat..."); its location target
             (PLDT: the type number, the target it resolves to when it's a specific reference or object,
             and the radius), resolved to a cell/location/hold when the target is a placed reference;
             PSDT raw hex (schedule data: month, day, date, time, duration -- the byte layout isn't
             hand-verified the way ECZN was in WO-144 Part 1d, so only the raw bytes are given, not a
             segmentation claimed as fact); its conditions (CTDA, as the record has them, reusing
             quest_starts.py's own reader); whether the exact same PACK record is shared by other people
             too, and how many.
  factions   SNAM: each faction and the actor's own rank in it (255 = not ranked/doesn't matter).
  class      CNAM, resolved to the CLAS record's own EDID.
  outfit     DOFT (worn normally) and SOFT (worn asleep), each resolved to the OUTFIT record's own EDID.
  essential / protected   ACBS flag bits 0x2 and 0x800 (the common Creation Kit assignment; checked by hand
             against Lydia, a known "protected, not essential" housecarl, and found to match -- not
             independently verified beyond that one case, so flagged, not asserted outright).
  quests     every quest whose alias fills on this person by "unique actor" (ALUA), with the alias's own
             name, from the quest scripts already read for places.py's own pointers.

Not built, flagged rather than guessed: vendor (what a merchant's faction actually buys and sells -- FACT's
own VENV/VENC vendor fields aren't read here) and trainer (the skill and level cap a trainer offers -- CLAS's
own training fields aren't read here). Both need their own byte-layout check before they're worth shipping.
"""
import collections
import json
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import ROOT, header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
from quest_starts import ctda  # noqa: E402
import places as pl  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
ESSENTIAL, PROTECTED = 0x2, 0x800


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


def read_people_facts(lo, pp, people):
    """Per person: PKID order, factions with rank, class, outfits, ACBS essential/protected -- the winning
    copy of each NPC_ across the load order, read a second time (places.py's own scan() doesn't keep these)."""
    facts = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if b"NPC_" not in buf:
            continue
        masters = header(buf)
        res = lambda v: form_id(resolve(struct.unpack_from("<I", v)[0], masters, n))  # noqa: E731
        for o in iter_group(buf, "NPC_"):
            t, flags, fid, d = rec_data(buf, o)
            if t != "NPC_":
                continue
            key = form_id(resolve(fid, masters, n))
            if key not in people:
                continue
            subs = subrecs(d)
            acbs = next((v for s, v in subs if s == "ACBS" and len(v) >= 4), None)
            aflags = struct.unpack_from("<I", acbs, 0)[0] if acbs else 0
            cnam = next((v for s, v in subs if s == "CNAM" and len(v) >= 4), None)
            doft = next((v for s, v in subs if s == "DOFT" and len(v) >= 4), None)
            soft = next((v for s, v in subs if s == "SOFT" and len(v) >= 4), None)
            facts[key] = {
                "pkids": [res(v) for s, v in subs if s == "PKID" and len(v) >= 4],
                "factions": [{"faction": res(v), "rank": v[4]} for s, v in subs if s == "SNAM" and len(v) >= 5],
                "class": res(cnam) if cnam else None,
                "outfit": res(doft) if doft else None,
                "sleepOutfit": res(soft) if soft else None,
                "essential": bool(aflags & ESSENTIAL),
                "protected": bool(aflags & PROTECTED),
                "plugin": n,
            }
    return facts


def read_packs(lo, pp, wanted):
    """Every PACK a wanted NPC_ references, the winning copy, with its location, schedule and conditions."""
    packs = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if b"PACK" not in buf:
            continue
        masters = header(buf)
        res = lambda v: form_id(resolve(struct.unpack_from("<I", v)[0], masters, n))  # noqa: E731
        for o in iter_group(buf, "PACK"):
            t, flags, fid, d = rec_data(buf, o)
            if t != "PACK":
                continue
            key = form_id(resolve(fid, masters, n))
            if key not in wanted:
                continue
            subs = subrecs(d)
            edid = next((v.rstrip(b"\0").decode("latin1") for s, v in subs if s == "EDID"), "")
            pkdt = next((v for s, v in subs if s == "PKDT"), None)
            pldt = next((v for s, v in subs if s == "PLDT" and len(v) >= 12), None)
            psdt = next((v for s, v in subs if s == "PSDT" and len(v) >= 12), None)
            conds = [ctda(v, masters, n) for s, v in subs if s == "CTDA" and len(v) >= 24]
            loc = None
            if pldt:
                ltype, lvalue_raw, radius = struct.unpack_from("<iii", pldt, 0)
                target = res(pldt[4:8]) if ltype in (0, 1, 4, 5) and lvalue_raw else None
                loc = {"type": ltype, "target": target, "radius": radius}
            packs[key] = {"edid": edid, "plugin": n, "pkdtRaw": pkdt.hex() if pkdt else None,
                          "psdtRaw": psdt.hex() if psdt else None, "location": loc, "conditions": conds}
    return packs


def resolve_targets(lo, pp, targets):
    """Where a package's "near reference" target itself sits: its own name (when it has one -- most are
    anonymous markers), its cell, location and hold -- the same cell/location data places.py's own scan()
    builds, read a second time for just these keys (most PACK targets are ordinary REFR/ACHR, which
    places.py's scan() doesn't keep by key at all)."""
    found = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        for top in ("CELL", "WRLD"):
            if top.encode() not in buf:
                continue
            cell = None
            for o in iter_group(buf, top):
                t = buf[o:o + 4]
                if t not in (b"CELL", b"WRLD", b"REFR", b"ACHR"):
                    continue
                tt, flags, fid, d = rec_data(buf, o)
                key = form_id(resolve(fid, masters, n))
                if tt == "CELL":
                    cell = key
                    continue
                if tt == "WRLD":
                    continue
                if key in targets:
                    subs = subrecs(d)
                    full = next((v for s, v in subs if s == "FULL"), None)
                    name = (full.rstrip(b"\0").decode("utf-8", "replace") if full and (not loc or len(full) != 4) else None)
                    found[key] = (cell, name)
    return found


def build(version):
    pp, lo = plugin_paths(), load_order(cc=True)
    kw, locs, npcs, lvln, books, infos, quests, cells, markers, actors, refcell, placed_npc, eczn, fact, feat, enable_info, forced = pl.scan()

    # Every quest giver (quest_givers_raw.json) and everyone already in people_raw.json, union'd (the order's
    # "every named person in people_raw.json, and every quest giver, even one not in that file").
    people = set()
    people_path = os.path.join(REPO, "gamedata", version, "people_raw.json")
    if os.path.exists(people_path):
        pd = json.load(open(people_path, encoding="utf-8"))
        people |= {row["id"] for row in pd.get("people", [])}
    givers_path = os.path.join(REPO, "gamedata", version, "quest_givers_raw.json")
    if os.path.exists(givers_path):
        gd = json.load(open(givers_path, encoding="utf-8"))
        for q in gd.get("quests", []):
            g = q.get("giver")
            if g and g.get("npc"):
                people.add(g["npc"])
            for person in q.get("people", []) or []:
                if person.get("npcId"):
                    people.add(person["npcId"])
    people = {k for k in people if k in npcs}

    facts = read_people_facts(lo, pp, people)
    all_pkids = {pk for f in facts.values() for pk in f["pkids"]}
    packs = read_packs(lo, pp, all_pkids)
    targets = {p["location"]["target"] for p in packs.values() if p.get("location") and p["location"].get("target")}
    resolved = resolve_targets(lo, pp, targets)
    for p in packs.values():
        t = (p.get("location") or {}).get("target")
        if t and t in resolved:
            cell_key, ref_name = resolved[t]
            c = cells.get(cell_key) or {}
            loc = locs.get(c.get("location")) or {}
            hold = None
            x = c.get("location")
            seen = set()
            while x and x in locs and x not in seen:
                seen.add(x)
                if "LocTypeHold" in {kw.get(k, k) for k in (locs[x].get("keywords") or [])} and locs[x].get("name"):
                    hold = locs[x]["name"]
                    break
                x = locs[x].get("parent")
            p["location"]["refName"] = ref_name
            p["location"]["cell"] = c.get("name")
            p["location"]["place"] = loc.get("name")
            p["location"]["hold"] = hold

    pack_users = collections.Counter(pk for f in facts.values() for pk in f["pkids"])

    def kname(ks):
        return {kw.get(k, k) for k in ks}

    forced_npc = collections.defaultdict(list)
    for qid, q in quests.items():
        for a in q.get("aliases", {}).values():
            if a.get("fill") == "unique" and a.get("actor") in people:
                forced_npc[a["actor"]].append({"quest": qid, "alias": a.get("name") or None})

    out = {}
    for k in people:
        n = npcs[k]
        f = facts.get(k, {})
        out[k] = {
            "name": n.get("name"),
            "edid": n.get("edid"),
            "plugin": f.get("plugin"),
            "packages": [{"pack": pk, **packs[pk], "shared": pack_users[pk] > 1, "sharedCount": pack_users[pk]}
                         for pk in f.get("pkids", []) if pk in packs],
            "factions": [{"faction": ff["faction"], "edid": fact.get(ff["faction"]), "rank": ff["rank"]} for ff in f.get("factions", [])],
            "class": f.get("class"),
            "outfit": f.get("outfit"),
            "sleepOutfit": f.get("sleepOutfit"),
            "essential": f.get("essential", False),
            "protected": f.get("protected", False),
            "quests": forced_npc.get(k, []),
        }
    return out


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    people = build(version)
    base = os.path.join(REPO, "gamedata", version)
    with open(os.path.join(base, "people_schedules_raw.json"), "w", encoding="utf-8", newline="\n") as fp:
        json.dump({"about": __doc__.strip().splitlines()[0]
                           + " Vendor and trainer facts are not built: flagging the gap, not guessing at FACT's"
                             " vendor fields or CLAS's training fields without a verified byte layout.",
                   "people": people}, fp, indent=1, ensure_ascii=False)
        fp.write("\n")
    with_packages = sum(1 for p in people.values() if p["packages"])
    print(f"{len(people)} people, {with_packages} with at least one resolved package -> people_schedules_raw.json")


if __name__ == "__main__":
    main()
