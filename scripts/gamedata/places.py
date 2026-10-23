"""
The places index (WO-128 Part 1): every location a player can visit that isn't a city, a town or a house, across the
whole load order, with what points at it. Writes gamedata/<version>/places_raw.json and places_report.md; build.py turns
the raw file into src/data/lorerim-<version>/places.json:
  python3 scripts/gamedata/places.py [version]

A place is a location (LCTN) whose LocType keywords say dungeon, cave, mine, fort, ruin, camp, lair, tower, shrine and the
like, or whose world map marker is one of those kinds (the marker's own type: Cave, Nordic Ruin, Giant Camp...). Never
one that is a city, town, settlement, dwelling, house, inn, store, castle or jail, or that sits inside one.

For each place:
  type         the map marker's kind when it has one, else the LocType keywords'
  hold         the hold its parent locations lead up to (LocTypeHold)
  nearestTown  the closest city, town or settlement by the map markers' positions in the same worldspace
  actors       the placed actors in its cells (and its child locations'): how many, their levels, and the boss (the actor
               with the Boss location ref type, Skyrim.esm:0130F7), each level as the record holds it: a fixed level, a
               multiple of the player's level within a range, or a leveled list's range
  clearXp      what LoreRim's Experience settings give for clearing that kind of place (SKSE/Plugins/Experience.ini,
               [Clearing], by the marker's kind)
  pointers     dialogue lines that name it (the speaker, where the speaker stands, the words, the record), and books and
               notes that name it, matched on the place's whole name
  quests       quests whose location aliases are it, or whose forced references stand in it: a quest already goes there
"""
import collections
import configparser
import json
import os
import re
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import ROOT, header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
import quest_scripts as qsc  # noqa: E402
from story_check import all_strings, name_strings  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
DELETED = 0x20
BOSS = "Skyrim.esm:0130F7"  # the Boss location ref type
# A world map marker's kind (REFR TNAM), as the Creation Kit numbers them (UESP: Mod File Format/REFR, map marker type).
MARKER = {1: "City", 2: "Town", 3: "Settlement", 4: "Cave", 5: "Camp", 6: "Fort", 7: "NordicRuin", 8: "DwemerRuin", 9: "Shipwreck",
          10: "Grove", 11: "Landmark", 12: "DragonLair", 13: "Farm", 14: "WoodMill", 15: "Mine", 16: "MilitaryCamp", 17: "MilitaryCamp",
          18: "Doomstone", 19: "WheatMill", 20: "Smelter", 21: "Stable", 22: "ImperialTower", 23: "Clearing", 24: "Pass", 25: "Altar",
          26: "Rock", 27: "Lighthouse", 28: "OrcStronghold", 29: "GiantCamp", 30: "Shack", 31: "NordicTower", 32: "NordicDwelling",
          33: "Docks", 34: "DaedricShrine", 35: "Castle", 36: "Castle", 37: "Castle", 38: "Castle", 39: "Castle", 40: "Castle",
          41: "Castle", 42: "Castle", 43: "Castle", 44: "MiraakTemple", 45: "Town", 46: "StandingStone", 47: "TelvanniTower",
          48: "Grove", 49: "CastleKarstaag"}
NOT_PLACES = {"City", "Town", "Settlement", "Farm", "WoodMill", "WheatMill", "Smelter", "Stable", "Docks", "Castle", "OrcStronghold"}
# The nine hold capitals (WO-144 Part 1): never found by a marker's TNAM type, which this load order's city overhauls
# reassign to other icons (Castle, MiraakTemple, Grove, StandingStone, or none) on every one of the nine. Found instead by
# the one LCTN in the whole load order with this exact name and the CWCapital keyword (Skyrim's Civil War data, which
# names a hold's capital for the siege system and isn't touched by the icon mods).
CAPITALS = {"Whiterun", "Windhelm", "Riften", "Solitude", "Markarth", "Morthal", "Winterhold", "Dawnstar", "Falkreath"}
# Four capitals (Falkreath, Dawnstar, Morthal, Winterhold) have their own named exterior marker in Tamriel. The other
# five are their own worldspace with no exterior marker of their own and no door this reader could find into it; Bob's
# ruling (23 Oct) was to anchor each to a named thing standing right outside its gate instead -- confirmed within a few
# hundred metres of the carriage driver or stablehand placed there (Bjorlam's own position lands beside Whiterun
# Stables). A capital not in here is found by its own name, as before.
CAPITAL_ANCHOR = {"Whiterun": "Whiterun Stables", "Windhelm": "Windhelm Stables", "Riften": "Riften Stables",
                   "Markarth": "Markarth Stables", "Solitude": "Solitude East Gate"}
# Named settlements a design treats like a town (WO-141 Part 1, folded here): never a marker trusted by its TNAM type
# alone (that let "Wintersand Manor", "Flight Platform" and other mislabelled markers stand in as a "town").
SETTLEMENTS = {"Riverwood", "Ivarstead", "Rorikstead", "Shor's Stone", "Darkwater Crossing", "Kynesgrove", "Karthwasten",
               "Dragon Bridge", "Stonehills", "Helgen", "Skaal Village", "Raven Rock", "Thirsk"}
# The four Orc strongholds (WO-141 Part 1, folded here): a type of their own ("OrcStronghold" is in NOT_PLACES because
# most things with that marker type are the stronghold's own town-like interior, not a place), named so only these four
# bypass that. A stronghold's gate guard's dialogue conditions become its `enters` text (item 2's "what gets you in").
STRONGHOLDS = {"Narzulbur", "Largashbur", "Dushnikh Yal", "Mor Khazgur"}
NAMED_PLACES = SETTLEMENTS | STRONGHOLDS  # item 2: these bypass the usual exclusion rules by name alone
# The stronghold gate guard's line (found by searching dialogue for "Blood-Kin"): shared across all four, under
# "Generic dialogue for orc villagers" (Skyrim.esm:03907C), not any one stronghold's own quest.
STRONGHOLD_GATE = "Skyrim.esm:0BBB2D"
# Item 3: named buildings a character goes to on purpose. Temples, inns and guild halls (the two colleges are
# LocTypeGuild too, confirmed on Winterhold College and The Bards College) are found by keyword, system-wide, never
# narrowed to the nine cities -- the order's own examples (every inn, a Thieves Guild hall) want them all. A keep is
# found by CWCAPITALHQ, not LocTypeCastle (which also covers Castle Volkihar and other non-capital castles): confirmed
# against all nine jarls' seats and nothing else. These have no exterior marker of their own (an interior-only
# location), so their town is the first ancestor in CAPITALS or SETTLEMENTS up their own parent chain, never a
# distance -- `inTown`, not `nearestTown`. Kept off the map by their `type` (Mac's "rule 20" on `suggest_places`).
BUILDING_KW = {"LocTypeTemple", "LocTypeInn", "LocTypeGuild"}
KEEP_KW = "CWCapitalHQ"
# Bob's cleaning pass (23 Oct, 15:35): a building keyword alone isn't a building. A location that is also the city
# itself (Whiterun and Solitude both carry "LocTypeInn" on their own city LCTN), a player-built home, a bandit camp
# or a dungeon (Cragwater Cavern, tagged "LocTypeInn" as well as "LocTypeBanditCamp") is never one, so these never
# bypass PLACE_KW/NOT_KW even though BUILDING_KW matches. A few more carry no disqualifying keyword at all (an
# identical shape to a real inn, in the Dormitory's case) and are named by hand instead, logged rather than guessed
# at by a general rule that could just as easily drop a real one.
NOT_BUILDING_KW = {"LocTypeCity", "CWCapital", "LocTypeHoldCapital", "LocTypeHold", "LocTypeMilitaryFort",
                    "LocTypeHouse", "LocTypePlayerHouse", "LocTypeBanditCamp"}
NOT_BUILDINGS = {"Temple Location", "Snow-Shod Farm Cellar", "Mausoleum", "Mustering Hall", "The Hermit",
                  "The Hermit Cellar", "Markarth East Empire Dormitory",
                  "Solitude"}  # The Great City of Solitude.esp:01F045: LocTypeInn, no cell at all, never placed
# Bob's ruling (23 Oct, 15:20): the km is real, but this is a small map, so a player's own measure goes beside it.
# Set from two pairs Bob gave: Riverwood to Whiterun (0.5 km) is "a short walk"; Whiterun to Riften (2.5 km) is "a
# long day's road". Embershard Mine to Riverwood (0.3 km, practically touching) sets the top of "next to it".
WALK_BANDS = [(0.4, "next to it"), (1.0, "a short walk"), (2.0, "half a day")]


def walk(km):
    return next((w for cutoff, w in WALK_BANDS if km < cutoff), "a long day's road")
# The LocType keywords that make a place, and those that rule one out (where people live, trade or rule).
PLACE_KW = {"LocTypeDungeon", "LocTypeCave", "LocTypeMine", "LocTypeMilitaryFort", "LocTypeAnimalDen", "LocTypeBanditCamp",
            "LocTypeDraugrCrypt", "LocTypeDwarvenAutomatons", "LocTypeFalmerHive", "LocTypeForswornCamp", "LocTypeGiantCamp",
            "LocTypeDragonLair", "LocTypeDragonPriestLair", "LocTypeHagravenNest", "LocTypeVampireLair", "LocTypeWarlockLair",
            "LocTypeSprigganGrove", "LocTypeShipwreck", "LocTypeClearable", "LocTypeMilitaryCamp", "LocTypeNordicRuin",
            "LocTypeDwemerRuin", "LocTypeShrine", "LocTypeTower", "LocTypeLandmark", "LocTypeMilitaryCampImperial",
            "LocTypeMilitaryCampStormcloak", "LocTypeAyleidRuin", "LocTypeHoldLocation"}
NOT_KW = {"LocTypeCity", "LocTypeTown", "LocTypeSettlement", "LocTypeDwelling", "LocTypePlayerHouse", "LocTypeHouse", "LocTypeInn",
          "LocTypeStore", "LocTypeCastle", "LocTypeJail", "LocTypeHold", "LocTypeHoldCapital", "LocTypeHoldMajor", "LocTypeHoldMinor",
          "LocTypeHabitation", "LocTypeTemple", "LocTypeGuild", "LocTypeBarracks", "LocTypeOrcStronghold", "LocTypeFarm",
          "LocTypeLumberMill", "LocTypeShip"}
TOWN_KW = {"LocTypeCity", "LocTypeTown", "LocTypeSettlement"}
KIND_WORDS = {"LocTypeCave": "Cave", "LocTypeMine": "Mine", "LocTypeMilitaryFort": "Fort", "LocTypeDraugrCrypt": "NordicRuin",
              "LocTypeDwarvenAutomatons": "DwemerRuin", "LocTypeBanditCamp": "Camp", "LocTypeForswornCamp": "Camp",
              "LocTypeGiantCamp": "GiantCamp", "LocTypeDragonLair": "DragonLair", "LocTypeShipwreck": "Shipwreck",
              "LocTypeFalmerHive": "Cave", "LocTypeAnimalDen": "Cave", "LocTypeHagravenNest": "Camp", "LocTypeVampireLair": "Cave",
              "LocTypeWarlockLair": "Cave", "LocTypeSprigganGrove": "Grove", "LocTypeDragonPriestLair": "NordicRuin"}


HELPER = re.compile(r"\b(Handler|Controller|Tracker|Dialogue|Misc|Retroactive|Scene|Reserve)\b")  # a quest no player sees as one


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


def txt(v, loc, table):
    if loc and len(v) == 4:
        return (table or {}).get(struct.unpack_from("<I", v)[0], "")
    return v.rstrip(b"\0").decode("utf-8", "replace")


def clear_xp():
    """The [Clearing] XP for each kind of place, from the Experience.ini the Ultra profile's highest mod gives (MO2 order)."""
    mods = [l.strip()[1:] for l in open(os.path.join(ROOT, "profiles", "Ultra", "modlist.txt"), encoding="utf-8", errors="ignore") if l.startswith("+")]
    for m in mods:  # modlist.txt lists the highest priority first
        p = os.path.join(ROOT, "mods", m, "SKSE", "Plugins", "Experience.ini")
        if os.path.exists(p):
            cp = configparser.ConfigParser(strict=False)
            cp.read(p, encoding="utf-8-sig")
            return {k[len("ixpclear"):].lower(): int(v) for k, v in cp["Clearing"].items()} if cp.has_section("Clearing") else {}, m
    return {}, None


def npc_level(v):
    """An NPC_ ACBS's level: (fixed level, scaling (multiple, min, max) or None, template flags)."""
    flags, = struct.unpack_from("<I", v, 0)
    lvl, cmin, cmax = struct.unpack_from("<hHH", v, 8)
    tflags = struct.unpack_from("<H", v, 18)[0] if len(v) >= 20 else 0
    return (None, (round(lvl / 1000, 2), cmin, cmax), tflags) if flags & 0x80 else (lvl, None, tflags)


def scan():
    pp, lo = plugin_paths(), load_order(cc=True)
    kw, locs, npcs, lvln, books, infos, quests, eczn = {}, {}, {}, {}, {}, {}, {}, {}
    for n in lo:  # pass 1: keywords, locations, actors, leveled lists, books, dialogue, quests (each the winning copy)
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = name_strings(p, n, loc, ROOT) or {}
        tables = (all_strings(p, n, loc, ROOT) or {}) if loc else {}
        res = lambda v: form_id(resolve(struct.unpack_from("<I", v)[0], masters, n))  # noqa: E731
        for grp in ("KYWD", "LCTN", "NPC_", "LVLN", "BOOK", "ECZN"):
            if grp.encode() not in buf:
                continue
            for o in iter_group(buf, grp):
                t, flags, fid, d = rec_data(buf, o)
                if t != grp:
                    continue
                key = form_id(resolve(fid, masters, n))
                subs = subrecs(d)
                edid = next((v.rstrip(b"\0").decode("latin1") for s, v in subs if s == "EDID"), "")
                full = next((txt(v, loc, strings) for s, v in subs if s == "FULL"), "").strip()
                if grp == "KYWD":
                    kw[key] = edid
                elif grp == "LCTN":
                    kwda = next((v for s, v in subs if s == "KWDA"), b"")
                    locs[key] = {"edid": edid, "name": full, "plugin": n, "deleted": bool(flags & DELETED),
                                 "keywords": [form_id(resolve(struct.unpack_from("<I", kwda, i)[0], masters, n)) for i in range(0, len(kwda) - 3, 4)],
                                 "parent": next((res(v) for s, v in subs if s == "PNAM" and len(v) >= 4), None),
                                 "marker": next((res(v) for s, v in subs if s == "MNAM" and len(v) >= 4), None)}
                elif grp == "NPC_":
                    acbs = next((v for s, v in subs if s == "ACBS" and len(v) >= 14), None)
                    fixed, scaled, tflags = npc_level(acbs) if acbs else (None, None, 0)
                    kwda = next((v for s, v in subs if s == "KWDA"), b"")
                    acbs_flags = struct.unpack_from("<I", acbs, 0)[0] if acbs else 0
                    npcs[key] = {"name": full or None, "edid": edid, "level": fixed, "scaled": scaled, "useStats": bool(tflags & 2),
                                 "template": next((res(v) for s, v in subs if s == "TPLT" and len(v) >= 4 and struct.unpack_from("<I", v)[0]), None),
                                 "keywords": [form_id(resolve(struct.unpack_from("<I", kwda, i)[0], masters, n)) for i in range(0, len(kwda) - 3, 4)],
                                 "race": next((res(v) for s, v in subs if s == "RNAM" and len(v) >= 4), None),
                                 "sex": "female" if acbs_flags & 1 else "male"}
                elif grp == "LVLN":
                    lvln[key] = {"edid": edid, "entries": [(struct.unpack_from("<H", v, 0)[0], form_id(resolve(struct.unpack_from("<I", v, 4)[0], masters, n)))
                                                           for s, v in subs if s == "LVLO" and len(v) >= 8]}
                elif grp == "BOOK":
                    desc = next((txt(v, loc, tables.get("DLSTRINGS") if loc else None) for s, v in subs if s == "DESC"), "")
                    books[key] = {"name": full or edid, "text": desc, "plugin": n}
                elif grp == "ECZN":
                    # DATA (12 bytes), decoded by hand on Fort Hraggstad (Bob, 23 Oct): Owner (FormID, 4), Location
                    # (FormID, 4), Rank (int8), MinLevel (int8), Flags (uint8), MaxLevel (int8); max 0 means no cap.
                    data = next((v for s, v in subs if s == "DATA" and len(v) >= 12), None)
                    if data:
                        loc_fid = struct.unpack_from("<I", data, 4)[0]
                        eczn[key] = {"location": form_id(resolve(loc_fid, masters, n)) if loc_fid else None,
                                     "minLevel": data[9], "maxLevel": data[11], "flags": data[10]}
        if b"DIAL" in buf:
            topic = None
            for o in iter_group(buf, "DIAL"):
                t, flags, fid, d = rec_data(buf, o)
                subs = subrecs(d)
                if t == "DIAL":
                    topic = next((res(v) for s, v in subs if s == "QNAM" and len(v) >= 4), None)
                    continue
                if t != "INFO":
                    continue
                lines = [txt(v, loc, tables.get("ILSTRINGS") if loc else None) for s, v in subs if s == "NAM1"]
                if not any(lines):
                    continue
                spk = None
                for s, v in subs:
                    if s == "CTDA" and len(v) >= 24 and struct.unpack_from("<H", v, 8)[0] == 72 and v[0] >> 5 == 0:
                        spk = form_id(resolve(struct.unpack_from("<I", v, 12)[0], masters, n))
                        break
                infos[form_id(resolve(fid, masters, n))] = {"lines": [l for l in lines if l], "speaker": spk, "quest": topic, "plugin": n}
        if b"QUST" in buf:
            got = qsc.read_plugin(buf, n, strings)
            for k, q in got["quests"].items():
                q["name"] = got["names"].get(k, {}).get("name") or got["names"].get(k, {}).get("edid") or k
                q["named"] = bool(got["names"].get(k, {}).get("name"))  # a scene holder or helper has no name a player sees
                quests[k] = q
    # Pass 2: cells (name, location, worldspace), map markers, placed actors, and where quests' forced references stand.
    forced = {a["ref"] for q in quests.values() for a in q.get("aliases", {}).values() if a.get("ref")}
    cells, markers, actors, refcell, placed_npc = {}, {}, {}, {}, {}
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
                if t not in (b"CELL", b"WRLD", b"REFR", b"ACHR"):
                    continue
                if t == b"REFR":
                    size = struct.unpack_from("<I", buf, o + 4)[0]
                    body = buf[o + 24:o + 24 + size]
                    fid = form_id(resolve(struct.unpack_from("<I", buf, o + 12)[0], masters, n))
                    if b"XMRK" not in body and fid not in forced:
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
                            c["name"] = txt(v, loc, strings).strip()
                        elif s == "XLCN" and len(v) >= 4:
                            c["location"] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, n))
                    continue
                pos = next((list(struct.unpack_from("<fff", v)) for s, v in subs if s == "DATA" and len(v) >= 12), None)
                if tt == "REFR":
                    if key in forced:
                        refcell[key] = cell
                    if any(s == "XMRK" for s, _ in subs):
                        mtype = next((v[0] for s, v in subs if s == "TNAM" and v), None)
                        markers[key] = {"cell": cell, "pos": pos, "type": MARKER.get(mtype), "deleted": bool(flags & DELETED),
                                        "name": next((txt(v, loc, strings) for s, v in subs if s == "FULL"), "").strip()}
                    continue
                base = next((form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs if s == "NAME" and len(v) >= 4), None)
                lrt = next((v for s, v in subs if s == "XLRT"), b"")
                actors[key] = {"cell": cell, "base": base, "deleted": bool(flags & DELETED),
                               "boss": BOSS in {form_id(resolve(struct.unpack_from("<I", lrt, i)[0], masters, n)) for i in range(0, len(lrt) - 3, 4)}}
                if base and not flags & DELETED:
                    placed_npc.setdefault(base, cell)
    return kw, locs, npcs, lvln, books, infos, quests, cells, markers, actors, refcell, placed_npc, eczn


def level_of(base, npcs, lvln, depth=0, cache=None, seen=None):
    """(low, high) levels a placed actor can have, and its words: "level 12", "your level x1.0 (5-30)", "leveled 4-40".
    A leveled list's entries are resolved by their real target, never the entry's own stored level (Bob, 23 Oct: that
    field means "picked from this level up", not the output actor's level, and reads a flat 1 for every real,
    deeply-nested Requiem list this reader checked -- Fort Hraggstad's own chain bottoms out at fixed-level Bandits
    of 3, 7, 10, 19, confirmed by hand against the records, not the stray "leveled from 1" the old reading gave)."""
    cache = {} if cache is None else cache
    if base in cache:
        return cache[base]
    seen = seen if seen is not None else set()
    if depth > 12 or not base or base in seen:
        return None
    seen = seen | {base}
    if base in npcs:
        n = npcs[base]
        # A template's stats (its level) when the actor uses them (ACBS template flags, "use stats").
        if n["template"] and (n.get("useStats") or (n["level"] in (None, 0) and not n["scaled"])):
            got = level_of(n["template"], npcs, lvln, depth + 1, cache, seen)
            if got:
                cache[base] = got
                return got
        if n["scaled"]:
            mult, lo, hi = n["scaled"]
            r = (lo or 1, hi or 81, f"your level x{mult:g}" + (f" ({lo}-{hi})" if hi else f" (from {lo})"))
            cache[base] = r
            return r
        if n["level"]:
            r = (n["level"], n["level"], f"level {n['level']}")
            cache[base] = r
            return r
        return None
    if base in lvln:
        targets = {tgt for _, tgt in lvln[base]["entries"]}
        results = [r for r in (level_of(t, npcs, lvln, depth + 1, cache, seen) for t in targets) if r]
        if not results:
            return None
        lo, hi = min(r[0] for r in results), max(r[1] for r in results)
        r = (lo, hi, f"leveled {lo}-{hi}" if lo != hi else f"leveled from {lo}")
        cache[base] = r
        return r
    return None


def build(version):
    kw, locs, npcs, lvln, books, infos, quests, cells, markers, actors, refcell, placed_npc, eczn = scan()
    xp, xp_from = clear_xp()
    kname = lambda ks: {kw.get(k, k) for k in ks}  # noqa: E731
    marker_of = {k: markers.get(l["marker"]) for k, l in locs.items() if l.get("marker") in markers and not markers[l["marker"]]["deleted"]}
    marker_world = lambda m: (cells.get(m["cell"]) or {}).get("world")  # noqa: E731

    def chain(k):
        out, seen = [], set()
        while k and k in locs and k not in seen:
            seen.add(k)
            out.append(k)
            k = locs[k]["parent"]
        return out

    def hold_of(k):
        return next((locs[x]["name"] for x in chain(k)[1:] if "LocTypeHold" in kname(locs[x]["keywords"]) and locs[x]["name"]), None)

    # Towns are the named markers in CAPITALS and SETTLEMENTS themselves, never any marker trusted by its TNAM type (WO-144
    # Part 1): a marker's "City"/"Town" icon is unreliable in this load order (see CAPITALS), and some non-towns carry it.
    # A capital with an anchor (CAPITAL_ANCHOR) is looked up by the anchor's name but kept under the capital's own name.
    by_marker_exact = collections.defaultdict(list)
    for mk in markers.values():
        if not mk["deleted"] and mk.get("pos") and mk.get("name"):
            by_marker_exact[mk["name"]].append(mk)

    def one_marker(name):
        ms = by_marker_exact.get(CAPITAL_ANCHOR.get(name, name)) or []
        return ms[0] if len(ms) == 1 else None  # never a guess when the name is missing or ambiguous

    towns = [(nm, one_marker(nm)) for nm in (CAPITALS | SETTLEMENTS)]
    towns = [(nm, mk) for nm, mk in towns if mk]
    cities = [(nm, mk) for nm, mk in towns if nm in CAPITALS]
    by_marker_name = collections.defaultdict(list)
    for m in markers.values():
        if not m["deleted"] and m["name"]:
            by_marker_name[m["name"]].append(m)
    # A building's own cell name, as a player reads it ("Mistveil Keep", not "Riften Mistveil Keep"): the shortest of
    # its cells' names, since a keep or inn's main hall is always named plainer than its own sub-rooms (Bob, 23 Oct).
    cell_names_of = collections.defaultdict(set)
    for c in cells.values():
        if c.get("location") and c.get("name"):
            cell_names_of[c["location"]].add(c["name"])
    places = {}
    for k, l in locs.items():
        if l["deleted"] or not l["name"]:
            continue
        names = kname(l["keywords"])
        # Its map marker: the one the location names, else the one with its own name (when that's the only one).
        m = marker_of.get(k) or (by_marker_name[l["name"]][0] if len(by_marker_name.get(l["name"], [])) == 1 else None)
        mtype = (m or {}).get("type")
        up = chain(k)[1:]
        inside_town = any((TOWN_KW | {"LocTypeDwelling", "LocTypeHouse", "LocTypePlayerHouse", "LocTypeCastle"}) & kname(locs[x]["keywords"]) for x in up[:1])
        # A dungeon near a town is often parented to it (Shroud Hearth Barrow to Ivarstead): only a location with no place
        # keyword or marker of its own is ruled out by its parent.
        named = l["name"] in NAMED_PLACES
        is_keep = KEEP_KW in names
        is_stable = "LocTypeStables" in names  # a strong keyword of its own: skip the generic disqualifiers entirely
        generic_building = (bool(names & BUILDING_KW) and not (names & NOT_BUILDING_KW) and not (names & PLACE_KW)
                             and l["name"] not in NOT_BUILDINGS)  # item 3: temples, inns, guild halls, keeps, stables
        building = is_keep or is_stable or generic_building
        bypass = named or building
        if not bypass and (names & NOT_KW or mtype in NOT_PLACES or (inside_town and not (names & PLACE_KW or mtype))):
            continue
        if not bypass and not (names & PLACE_KW or (mtype and mtype not in NOT_PLACES)):
            continue
        if is_keep:
            kind = "Keep"
        elif is_stable:
            kind = "Stables"  # never "Stable": that's still a mislabelled marker's own type, in NOT_PLACES
        elif generic_building:
            kind = next(w for kw2, w in (("LocTypeTemple", "Temple"), ("LocTypeInn", "Inn"), ("LocTypeGuild", "Guild")) if kw2 in names)
        else:
            kind = mtype or next((KIND_WORDS[x] for x in sorted(names) if x in KIND_WORDS), None) or "Landmark"
        in_town = next((locs[x]["name"] for x in up if locs[x].get("name") in (CAPITALS | SETTLEMENTS)), None) if building else None

        def nearest(candidates):
            if not (m and m.get("pos")):
                return None
            best = None
            for tname, tm in candidates:
                if marker_world(tm) != marker_world(m) or tm is m:
                    continue
                dist = sum((a - b) ** 2 for a, b in zip(tm["pos"][:2], m["pos"][:2])) ** 0.5
                if best is None or dist < best[0]:
                    best = (dist, tname)
            if not best:
                return None
            km = round(best[0] * 0.0142875 / 1000, 1)  # 1 unit = 1.43 cm
            return {"town": best[1], "km": km, "walk": walk(km)}

        near, near_city = nearest(towns), nearest(cities)
        # The map's name when it only extends the record's ("Embershard" -> "Embershard Mine"); never another place's (a mod's
        # Morvunskar Crypts that points at Bleak Falls Barrow's marker keeps its own name). A building's own cell's
        # name instead, when it's shorter than the record's ("Mistveil Keep", not "Riften Mistveil Keep").
        cell_shown = min(cell_names_of.get(k, ()), key=len, default=None) if building else None
        shown = (cell_shown if cell_shown and len(cell_shown) < len(l["name"]) else
                 m["name"] if (m or {}).get("name") and l["name"].lower() in m["name"].lower() else l["name"])
        places[k] = {"id": k, "name": shown, **({"recordName": l["name"]} if shown != l["name"] else {}), "edid": l["edid"], "type": kind, "keywords": sorted(x for x in names if x.startswith("LocType")),
                     "hold": hold_of(k), "nearestTown": near, "nearestCity": near_city, "inTown": in_town, "plugin": l["plugin"], "marker": l.get("marker") if m else None}
        if l["name"] in STRONGHOLDS and infos.get(STRONGHOLD_GATE):
            gate = infos[STRONGHOLD_GATE]
            places[k]["enters"] = {"words": " ".join(gate["lines"]), "record": f"INFO {STRONGHOLD_GATE} ({gate['plugin']})"}
    # Actors in each place's cells, and its child locations' (a dungeon's inner levels).
    owner = {}
    for k in locs:
        for x in chain(k):
            if x in places:
                owner[k] = x
                break
    by_place = collections.defaultdict(list)
    for a in actors.values():
        if a["deleted"]:
            continue
        pl = owner.get((cells.get(a["cell"]) or {}).get("location"))
        if pl:
            by_place[pl].append(a)
    # The encounter zone owning a place, by its location (ECZN's own Location field, not a guess -- Bob decoded the
    # DATA layout by hand on Fort Hraggstad, 23 Oct). Clamps the resolved actor range: a floor it can't fall below,
    # a ceiling when the zone sets one (max 0 means none).
    eczn_by_loc = {z["location"]: z for z in eczn.values() if z.get("location")}
    level_cache = {}
    for k, acts in by_place.items():
        lv = [x for x in (level_of(a["base"], npcs, lvln, cache=level_cache) for a in acts) if x]
        boss = next((a for a in acts if a["boss"]), None)
        bl = level_of(boss["base"], npcs, lvln, cache=level_cache) if boss else None
        zone = eczn_by_loc.get(k)
        levels = None
        if lv:
            lo, hi = min(x[0] for x in lv), max(x[1] for x in lv)
            if zone and zone["minLevel"] and zone["minLevel"] <= hi:
                lo = max(lo, zone["minLevel"])
            if zone and zone["maxLevel"]:
                hi = min(hi, zone["maxLevel"])
                lo = min(lo, hi)
            levels = [lo, hi]
        places[k]["actors"] = {"count": len(acts), **({"levels": levels} if levels else {}),
                               **({"zoneMin": zone["minLevel"]} if zone and zone["minLevel"] else {}),
                               # The boss by its own name when it has one; a leveled boss has none, so only its level shows.
                               **({"boss": {**({"name": npcs[boss["base"]]["name"]} if (npcs.get(boss["base"]) or {}).get("name") else {}),
                                            "level": bl[2] if bl else None}} if boss else {})}
    for k, p in places.items():
        x = xp.get(p["type"].lower())
        if x is not None:
            p["clearXp"] = x
    # What points at each place: dialogue and books that name it, on its whole name, case as written.
    named = collections.defaultdict(list)
    for k, p in places.items():
        for nm in {p["name"], p.get("recordName") or p["name"]}:  # the map's name and the record's ("Embershard Mine", "Embershard")
            if len(nm) >= 5:
                named[nm].append(k)
    if named:
        pat = re.compile(r"\b(" + "|".join(re.escape(x) for x in sorted(named, key=len, reverse=True)) + r")\b")

        def where_npc(npc):
            c = cells.get(placed_npc.get(npc)) or {}
            loc = (locs.get(c.get("location")) or {}).get("name")
            return c.get("name") or loc or None

        for iid, inf in infos.items():
            text = " ".join(inf["lines"])
            for nm in set(pat.findall(text)):
                for k in named[nm]:
                    places[k].setdefault("pointers", []).append({
                        "kind": "dialogue", "speaker": (npcs.get(inf["speaker"]) or {}).get("name") if inf["speaker"] else None,
                        "speakerPlace": where_npc(inf["speaker"]) if inf["speaker"] else None,
                        "quest": (quests.get(inf["quest"]) or {}).get("name") if inf["quest"] else None,
                        "words": next((l for l in inf["lines"] if nm in l), text)[:300], "record": f"INFO {iid} ({inf['plugin']})"})
        for bid, b in books.items():
            for nm in set(pat.findall(b["text"] or "")):
                for k in named[nm]:
                    i = b["text"].find(nm)
                    places[k].setdefault("pointers", []).append({"kind": "book", "book": b["name"], "words": re.sub(r"<[^>]+>", "", b["text"][max(0, i - 120):i + 160]).strip(),
                                                                 "record": f"BOOK {bid} ({b['plugin']})"})
    # Quests that already go there: a location alias that is it (or inside it), or a forced reference standing in it.
    for qid, q in quests.items():
        hit = set()
        for a in q.get("aliases", {}).values():
            if a.get("location") and owner.get(a["location"]):
                hit.add(owner[a["location"]])
            if a.get("ref") and refcell.get(a["ref"]):
                pl = owner.get((cells.get(refcell[a["ref"]]) or {}).get("location"))
                if pl:
                    hit.add(pl)
        for k in hit if q.get("named") and not HELPER.search(q["name"]) else ():
            places[k].setdefault("quests", []).append({"quest": q["name"], "id": qid})
    # Item 4: the roads, every capital and settlement to every other in the same worldspace, by their own markers
    # (never a place's: a settlement's road is to the next settlement, not shortened by a dungeon passed on the way).
    roads = []
    for i, (a, am) in enumerate(towns):
        for b, bm in towns[i + 1:]:
            if marker_world(am) != marker_world(bm):
                continue
            dist = sum((x - y) ** 2 for x, y in zip(am["pos"][:2], bm["pos"][:2])) ** 0.5
            km = round(dist * 0.0142875 / 1000, 1)
            roads.append({"towns": sorted((a, b)), "km": km, "walk": walk(km)})
    return places, xp_from, cities, roads


def report(places, xp_from, cities=()):
    rows = list(places.values())
    by_type = collections.Counter(p["type"] for p in rows)
    by_hold = collections.Counter(p.get("hold") or "(none)" for p in rows)
    pointed = sum(1 for p in rows if p.get("pointers"))
    quested = sum(1 for p in rows if p.get("quests"))
    neither = sum(1 for p in rows if not p.get("pointers") and not p.get("quests"))
    found_cities = {nm for nm, _ in cities}
    missing = sorted(CAPITALS - found_cities)
    out = ["# The places index (WO-128 Part 1, WO-144 Part 1)", "",
           "Written by `scripts/gamedata/places.py` from the winning records across the load order (with the Creation Club plugins). "
           f"Clear XP from `{xp_from}`'s Experience.ini." if xp_from else "Clear XP: no Experience.ini found.", "",
           f"**{len(rows)} places.** {pointed} have a pointer (a line or a book that names them), {quested} have a quest that goes there, "
           f"and {neither} have neither.", "",
           "## The nine capitals", "",
           f"Found by name and the CWCapital keyword: {', '.join(sorted(found_cities)) or '(none)'}.",
           (f"**Not checked (no exterior marker in Tamriel, no door into their worldspace this reader found): {', '.join(missing)}.** "
            "`nearestCity`/`nearestTown` never names them; see WO-144's decision log." if missing else "All nine found with an exterior position."),
           "", "## By type", "", "| Type | Places | With a pointer | With a quest |", "|---|---|---|---|"]
    for t, n in by_type.most_common():
        out.append(f"| {t} | {n} | {sum(1 for p in rows if p['type'] == t and p.get('pointers'))} | {sum(1 for p in rows if p['type'] == t and p.get('quests'))} |")
    out += ["", "## By hold", "", "| Hold | Places | With a pointer | With a quest |", "|---|---|---|---|"]
    for h, n in by_hold.most_common():
        out.append(f"| {h} | {n} | {sum(1 for p in rows if (p.get('hold') or '(none)') == h and p.get('pointers'))} | {sum(1 for p in rows if (p.get('hold') or '(none)') == h and p.get('quests'))} |")
    return "\n".join(out) + "\n"


RECORD_NAME = re.compile(r"_|^[A-Za-z]+[a-z][A-Z]\w*$")  # an editor id, not a name ("EGD_DialogueGuardsGeneral", "dunGeirmundQST")


def plugin_of(record):
    """The plugin a pointer's record comes from: "INFO Skyrim.esm:01AACA (Unofficial Skyrim Special Edition Patch.esp)" -> the last."""
    return record[record.rfind("(") + 1:-1] if record.endswith(")") and "(" in record else None


def build_site(rows):
    """The planner's places.json from the raw rows: what a page or an assistant shows, without record ids or editor ids."""
    out = []
    for p in rows:
        r = {k: p[k] for k in ("id", "name", "type", "hold", "nearestTown", "nearestCity", "inTown", "clearXp") if p.get(k) is not None}
        if p.get("actors"):
            r["actors"] = p["actors"]
        if p.get("pointers"):
            r["pointers"] = [{k: v for k, v in {"kind": x["kind"], "speaker": x.get("speaker"), "speakerPlace": x.get("speakerPlace"),
                                                "book": x.get("book"), "words": x["words"],
                                                "quest": x.get("quest") if x.get("quest") and not RECORD_NAME.search(x["quest"]) else None,
                                                "from": plugin_of(x["record"])}.items() if v}
                             for x in p["pointers"]]
        if p.get("quests"):
            r["quests"] = sorted({q["quest"] for q in p["quests"]})
        if p.get("enters"):
            r["enters"] = {"words": p["enters"]["words"], "from": plugin_of(p["enters"]["record"])}
        out.append(r)
    return out


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    places, xp_from, cities, roads = build(version)
    base = os.path.join(REPO, "gamedata", version)
    rows = sorted(places.values(), key=lambda p: (p.get("hold") or "~", p["name"]))
    roads = sorted(roads, key=lambda r: r["towns"])
    with open(os.path.join(base, "places_raw.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"about": __doc__.strip().splitlines()[0], "places": rows, "roads": roads}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    with open(os.path.join(base, "places_report.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write(report(places, xp_from, cities))
    print(f"{len(rows)} places, {sum(1 for p in rows if p.get('pointers'))} with a pointer, {sum(1 for p in rows if p.get('quests'))} with a quest -> places_raw.json")
    print(f"{len(roads)} roads -> places_raw.json")


if __name__ == "__main__":
    main()
