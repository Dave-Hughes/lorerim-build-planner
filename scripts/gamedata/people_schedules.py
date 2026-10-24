"""
WO-156 (Part 1b: Bob, 23 Oct, 18:50): every person's AI packages and other facts, dumped raw -- no reading,
no "where they are by day". The people reads (WO-155) need the records; this just puts them within reach.
Needs people_raw.json first (places.py's own scan(), reused rather than reading the load order twice):
  python3 scripts/gamedata/people_schedules.py [version]

For every person in people_raw.json (and every quest giver, even one not in that file):
  packages   their NPC_'s PKID list, in that order (the game's own priority, highest first), each package's
             EDID and plugin; PKDT raw hex (the type byte's own enum still isn't decoded -- the package's own
             EDID is relied on for what it *does*: "...Sandbox...", "...Sleep...", "...Work...", "...Eat...");
             its schedule (PSDT: month, day of week, date, hour and duration in minutes, decoded and checked
             by hand against three packages whose names carry their own schedule -- see the log); its
             location target (PLDT's type number, and what it resolves to: a keyword for "near type", else a
             placed reference's own name, cell, location and hold, or -- for an exterior cell with no name of
             its own, most of them -- the nearest named place by position, the same way places.py's own
             nearestTown works); its conditions (CTDA, reusing quest_starts.py's own reader); whether the
             exact same PACK is shared by other people too, and how many.
  factions   SNAM: each faction and the actor's own rank in it (255 = not ranked/doesn't matter).
  class      CNAM, resolved to the CLAS record's own EDID, and -- when the class's own name says
             "Trainer<Skill><Tier>" (46 of them, Skyrim's own convention) -- the skill and tier a trainer
             offers. The tier's own level cap (Novice 25, Apprentice 50, Journeyman 75, Expert 100, Master
             none) is vanilla Skyrim's own training design, not read from this load order's own records, so
             it's a convention carried in, not a guess at this modlist specifically; Requiem's own training
             rules may differ and aren't checked here.
  vendor     whether the actor's own faction carries vendor data (FACT's VEND/VENC/VENV) at all, and VENV's
             own start hour, end hour and radius (checked by hand against Eorlund Gray-Mane's own faction,
             "ServicesWhiterunEorlund": 0 to 23, radius 700 -- a smith open all day, which fits). VEND and
             VENC are given as raw hex only: not independently verified what they resolve to (a container, a
             buy/sell category bitmask, or something else), so not claimed as either.
  outfit     DOFT (worn normally) and SOFT (worn asleep), each resolved to the OUTFIT record's own EDID.
  essential / protected   ACBS flag bits 0x2 and 0x800 (the common Creation Kit assignment; checked by hand
             against Lydia, a known "protected, not essential" housecarl, and found to match -- not
             independently verified beyond that one case, so flagged, not asserted outright).
  follower / marriageable   whether any of the actor's own factions is "PotentialFollowerFaction" /
             "CurrentFollowerFaction", or "PotentialMarriageFaction" -- Skyrim's own standard conventions.
  quests     every quest whose alias fills on this person by "unique actor" (ALUA), with the alias's own
             name, from the quest scripts already read for places.py's own pointers.
"""
import collections
import json
import os
import re
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import ROOT, header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
from quest_starts import ctda  # noqa: E402
import places as pl  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
ESSENTIAL, PROTECTED = 0x2, 0x800
TRAINER_EDID = re.compile(r"^Trainer([A-Za-z]+?)(Novice|Apprentice|Journeyman|Expert|Master)$")
TRAINER_CAP = {"Novice": 25, "Apprentice": 50, "Journeyman": 75, "Expert": 100, "Master": None}


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


def read_classes(lo, pp, wanted):
    """Every CLAS a wanted person's own class names, for its EDID (the trainer skill/tier convention lives
    in the name itself, "TrainerRestorationExpert" -- not a separate field this record carries)."""
    out = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if b"CLAS" not in buf:
            continue
        masters = header(buf)
        for o in iter_group(buf, "CLAS"):
            t, flags, fid, d = rec_data(buf, o)
            if t != "CLAS":
                continue
            key = form_id(resolve(fid, masters, n))
            if key not in wanted:
                continue
            subs = subrecs(d)
            edid = next((v.rstrip(b"\0").decode("latin1") for s, v in subs if s == "EDID"), "")
            out[key] = edid
    return out


def read_faction_vendors(lo, pp, wanted):
    """Every FACT a wanted person belongs to, for its own VEND/VENC/VENV (vendor data) when it has any."""
    out = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if b"FACT" not in buf:
            continue
        masters = header(buf)
        for o in iter_group(buf, "FACT"):
            t, flags, fid, d = rec_data(buf, o)
            if t != "FACT":
                continue
            key = form_id(resolve(fid, masters, n))
            if key not in wanted:
                continue
            subs = subrecs(d)
            vend = next((v for s, v in subs if s == "VEND" and len(v) >= 4), None)
            venc = next((v for s, v in subs if s == "VENC" and len(v) >= 4), None)
            venv = next((v for s, v in subs if s == "VENV" and len(v) >= 12), None)
            # VENV is boilerplate -- every faction carries one, all zero, whether or not it's a real vendor
            # (confirmed: "WinterholdJailFaction" has it too). VEND (the vendor's own merchant container) is
            # the real signal; a faction without it isn't a vendor, whatever VENV says.
            if not vend:
                continue
            entry = {"vendRaw": vend.hex() if vend else None, "vencRaw": venc.hex() if venc else None}
            if venv:
                start_hour, end_hour, radius = struct.unpack_from("<HHH", venv, 0)
                entry["startHour"], entry["endHour"], entry["radius"] = start_hour, end_hour, radius
            out[key] = entry
    return out


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
            sched = None
            if psdt:
                # WO-156 Part 1b: checked by hand against three self-describing packages (SolitudeWarehouseWork10x8,
                # DefaultEatEditorLoc18x1, DefaultSleepEditorLoc2x8) and the always-on ones (DefaultSandboxEditor
                # Location512): byte 3 (hour) and the last 4 bytes (duration, minutes) both read right every time --
                # the work package starts at 10, 480 minutes (8h); eat starts at 18 (6pm), 60 minutes; sleep starts
                # at 2, 480 minutes (8h); the always-on ones carry hour 0xff ("any time") and duration 0.
                month, dow, date, hour = psdt[0], psdt[1], psdt[2], psdt[3]
                duration = struct.unpack_from("<i", psdt, 8)[0]
                sched = {"month": None if month == 0xFF else month, "dayOfWeek": None if dow == 0xFF else dow,
                         "date": date, "hour": None if hour == 0xFF else hour, "durationMinutes": duration,
                         "raw": psdt.hex()}
            packs[key] = {"edid": edid, "plugin": n, "pkdtRaw": pkdt.hex() if pkdt else None,
                          "location": loc, "schedule": sched, "conditions": conds}
    return packs


def resolve_targets(lo, pp, targets):
    """Where a "near reference"/"object" target itself sits: its own name (when it has one -- most are
    anonymous markers), its position, its cell, location and hold -- the same cell/location data places.py's
    own scan() builds, read a second time for just these keys (most PACK targets are ordinary REFR/ACHR,
    which places.py's scan() doesn't keep by key at all)."""
    found = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        is_loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
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
                    name = (full.rstrip(b"\0").decode("utf-8", "replace") if full and (not is_loc or len(full) != 4) else None)
                    pos = next((list(struct.unpack_from("<fff", v)) for s, v in subs if s == "DATA" and len(v) >= 12), None)
                    found[key] = (cell, name, pos)
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

    # WO-156 Part 1b: a "near type" target (PLDT type 1) is a keyword, not a placed reference -- resolving it
    # against the REFR/ACHR scan below always failed (that's most of the 58% unresolved). Resolved straight
    # from the keyword table places.py's own scan() already built.
    ref_targets = {p["location"]["target"] for p in packs.values()
                   if p.get("location") and p["location"].get("target") and p["location"]["type"] in (0, 4, 5)}
    resolved = resolve_targets(lo, pp, ref_targets)

    # A marker's own position, grouped by worldspace, for the nearest-named-place fallback below (the same
    # idea as places.py's own nearestTown: most exterior cells carry no name or location of their own at all).
    by_world = collections.defaultdict(list)
    for m in markers.values():
        if not m.get("deleted") and m.get("name") and m.get("pos"):
            w = (cells.get(m["cell"]) or {}).get("world")
            if w:
                by_world[w].append(m)

    def nearest_named(pos, world):
        best = None
        for m in by_world.get(world, ()):
            dx, dy = m["pos"][0] - pos[0], m["pos"][1] - pos[1]
            dist = (dx * dx + dy * dy) ** 0.5
            if best is None or dist < best[0]:
                best = (dist, m["name"])
        if not best:
            return None
        return {"name": best[1], "km": round(best[0] * 0.0142875 / 1000, 1)}

    for p in packs.values():
        loc = p.get("location")
        if not loc or not loc.get("target"):
            continue
        t = loc["target"]
        if loc["type"] == 1:
            # WO-156 Part 1b: a "near type" target is usually a keyword, but Jaree-Ra's own "stay put" package
            # and Nazeem's own sleep package both name a CELL directly instead ("The Winking Skeever",
            # "Wintersand Manor" -- confirmed by hand, matching Dave's and the order's own spot checks exactly).
            # Keyword first, a direct cell second; neither guessed, both checked against the actual record.
            if t in kw:
                loc["keyword"] = kw[t]
            elif t in cells:
                c = cells[t]
                loc["cell"] = c.get("name")
                place = locs.get(c.get("location")) or {}
                loc["place"] = place.get("name")
            continue
        if t not in resolved:
            continue
        cell_key, ref_name, pos = resolved[t]
        c = cells.get(cell_key) or {}
        place = locs.get(c.get("location")) or {}
        hold = None
        x = c.get("location")
        seen = set()
        while x and x in locs and x not in seen:
            seen.add(x)
            if "LocTypeHold" in {kw.get(k, k) for k in (locs[x].get("keywords") or [])} and locs[x].get("name"):
                hold = locs[x]["name"]
                break
            x = locs[x].get("parent")
        loc["refName"] = ref_name
        loc["cell"] = c.get("name")
        loc["place"] = place.get("name")
        loc["hold"] = hold
        if not loc["place"] and not loc["cell"] and pos and c.get("world"):
            loc["nearestNamed"] = nearest_named(pos, c["world"])

    pack_users = collections.Counter(pk for f in facts.values() for pk in f["pkids"])

    # WO-156 Part 1b: class (trainer skill/tier) and faction vendor data, read from the wanted set only.
    classes = read_classes(lo, pp, {f["class"] for f in facts.values() if f.get("class")})
    fact_vendors = read_faction_vendors(lo, pp, {ff["faction"] for f in facts.values() for ff in f.get("factions", [])})

    def trainer_of(class_key):
        edid = classes.get(class_key)
        m = edid and TRAINER_EDID.match(edid)
        if not m:
            return None
        return {"skill": m.group(1), "tier": m.group(2), "levelCap": TRAINER_CAP[m.group(2)]}

    def vendor_of(faction_keys):
        for fk in faction_keys:
            if fk in fact_vendors:
                return fact_vendors[fk]
        return None

    forced_npc = collections.defaultdict(list)
    for qid, q in quests.items():
        for a in q.get("aliases", {}).values():
            if a.get("fill") == "unique" and a.get("actor") in people:
                forced_npc[a["actor"]].append({"quest": qid, "alias": a.get("name") or None})

    out = {}
    for k in people:
        n = npcs[k]
        f = facts.get(k, {})
        faction_keys = [ff["faction"] for ff in f.get("factions", [])]
        faction_edids = {fact.get(fk) for fk in faction_keys}
        out[k] = {
            "name": n.get("name"),
            "edid": n.get("edid"),
            "plugin": f.get("plugin"),
            "packages": [{"pack": pk, **packs[pk], "shared": pack_users[pk] > 1, "sharedCount": pack_users[pk]}
                         for pk in f.get("pkids", []) if pk in packs],
            "factions": [{"faction": ff["faction"], "edid": fact.get(ff["faction"]), "rank": ff["rank"]} for ff in f.get("factions", [])],
            "class": f.get("class"),
            "trainer": trainer_of(f.get("class")),
            "vendor": vendor_of(faction_keys),
            "outfit": f.get("outfit"),
            "sleepOutfit": f.get("sleepOutfit"),
            "essential": f.get("essential", False),
            "protected": f.get("protected", False),
            "follower": bool(faction_edids & {"PotentialFollowerFaction", "CurrentFollowerFaction"}),
            "marriageable": "PotentialMarriageFaction" in faction_edids,
            "quests": forced_npc.get(k, []),
        }
    return out


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    people = build(version)
    base = os.path.join(REPO, "gamedata", version)
    with open(os.path.join(base, "people_schedules_raw.json"), "w", encoding="utf-8", newline="\n") as fp:
        json.dump({"about": __doc__.strip().splitlines()[0], "people": people}, fp, indent=1, ensure_ascii=False)
        fp.write("\n")
    with_packages = sum(1 for p in people.values() if p["packages"])
    unresolved = sum(1 for p in people.values() for pk in p["packages"]
                      if pk.get("location") and pk["location"].get("target") and not (
                          pk["location"].get("place") or pk["location"].get("cell") or pk["location"].get("keyword") or pk["location"].get("nearestNamed")))
    total_targets = sum(1 for p in people.values() for pk in p["packages"] if pk.get("location") and pk["location"].get("target"))
    print(f"{len(people)} people, {with_packages} with at least one resolved package -> people_schedules_raw.json")
    print(f"{unresolved} of {total_targets} package targets still unresolved (no place, cell, keyword or nearest-named fallback)")


if __name__ == "__main__":
    main()
