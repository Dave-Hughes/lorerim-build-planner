"""
WO-183 Part 7: what the load order has that the data does not.

The audit sampled what the planner has and never asked what it doesn't. This reads every plugin of the load order (the Creation Club's too) and sets what it made against what
the data holds, in three lists, and writes them as a section of quests_report.md (run it after quests.py, which writes that file whole):

  quests     each QUST record the plugin made with a name and a journal entry or an objective, against quests_raw.json; the ones that are not there, and why;
  places     each named location (LCTN) and each named map marker the plugin made, against places_raw.json (a place's name, its record name, its aliases and the records it was
             recorded as);
  people     each unique named NPC_ the plugin made, against people_raw.json (its id and the ids merged into it); a person the records never place in a cell is spawned by a quest or
             a script and is no one's home (left out on purpose); a person placed and not in the data is a gap.

  python3 scripts/gamedata/coverage.py [version]
"""
import json
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import places as P  # noqa: E402
import quests as Q  # noqa: E402
from bsa import vanilla_strings  # noqa: E402
from esp import ROOT, localized_strings  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
MARK = "## Coverage across the load order (WO-183 Part 7)"
LIMIT = 12  # names listed for one plugin and one list


def fid(key):
    return f"{key[0]}:{key[1]:06X}"


def load(version, name):
    with open(os.path.join(REPO, "gamedata", version, name), encoding="utf-8") as f:
        return json.load(f)


def quests_by_plugin(version, pp, lo):
    """{plugin: {made, named, text, kept, missing: [(edid, name, why)]}} from every plugin's own QUST records."""
    kept = {q["id"].lower() for q in load(version, "quests_raw.json")["quests"]}
    out, all_recs = {}, {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if b"QUST" not in buf:
            continue
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        try:
            recs = Q.read_plugin(buf, n, (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else None)
        except Exception:  # a plugin the reader can't follow is left out, as quests.py does
            continue
        row = {"made": 0, "named": 0, "text": 0, "kept": 0, "missing": [], "unnamed": 0}
        for r in recs:
            all_recs[tuple(r["key"])] = (n, r)  # the last plugin to change a quest wins it
            if r["key"][0].lower() != n.lower():
                continue  # an edit of another plugin's quest
            row["made"] += 1
            has_text = any(e.get("text") for s in r["stages"] for e in s["log"]) or any(o.get("text") for o in r["objectives"])
            if not r["name"]:
                row["unnamed"] += 1
                continue
            row["named"] += 1
            if not has_text:
                continue
            row["text"] += 1
            if fid(r["key"]).lower() in kept:
                row["kept"] += 1
            else:
                row["missing"].append((r["edid"], r["name"], tuple(r["key"])))
        if row["made"]:
            out[n] = row
    # Why a named quest with text is not in the data: the plugin that wins it replaces it with a record with no name and no stages (LoreRim - World Fixes does this to several Creation
    # Club quests: it removes them from the game), else it is a lead-in or machinery the quest filter drops.
    for n, row in out.items():
        why = []
        for e, name, key in row["missing"]:
            win, r = all_recs.get(key, (n, None))
            empty = r is not None and (not r["name"] or not (any(x.get("text") for s in r["stages"] for x in s["log"]) or any(o.get("text") for o in r["objectives"])))
            why.append((e, name, f"{win} replaces it with a record that has no name or journal: removed from the game" if empty else "a lead-in or machinery the quest filter drops"))
        row["missing"] = why
    return out


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    pp, lo = P.plugin_paths(), P.load_order(cc=True)
    quests = quests_by_plugin(version, pp, lo)

    raw = load(version, "places_raw.json")["places"]
    known = set()
    for p in raw:
        for n in (p.get("name"), p.get("recordName"), *(p.get("aliases") or [])):
            if n:
                known.add(n.lower())
        known.add(p["id"].lower())
        for a in p.get("alsoRecordedAs", []):
            known.add(a["id"].lower())
    kw, locs, npcs, lvln, books, infos, qsts, cells, markers, actors, refcell, placed_npc, eczn, fact, feats, enable, forced = P.scan()
    places = {}
    def part_of(k):
        """The place index already has this location's parent or an ancestor: it is a part of that place (an interior, an exterior)."""
        seen = set()
        while k and k in locs and k not in seen:
            seen.add(k)
            k = locs[k].get("parent")
            if k in locs and (locs[k].get("name") or "").lower() in known:
                return locs[k]["name"]
        return None

    for k, v in locs.items():
        if v.get("deleted") or not v.get("name"):
            continue
        row = places.setdefault(k.split(":")[0].lower(), {"locations": 0, "markers": 0, "missing": []})
        row["locations"] += 1
        if k.lower() not in known and v["name"].lower() not in known:
            parent = part_of(k)
            if parent:
                row["inside"] = row.get("inside", 0) + 1  # a part of a place the index has: one place, not two
            else:
                names = {kw.get(x, x) for x in v.get("keywords", [])}
                home = names & {"LocTypeHouse", "LocTypePlayerHouse", "LocTypeDwelling", "LocTypeHabitation", "BYOH_LocTypeHomestead", "LocTypeCity", "LocTypeTown", "LocTypeSettlement", "LocTypeInn", "LocTypeStore", "LocTypeCastle"}
                row["missing"].append((v.get("edid"), v["name"], "a house, a homestead, a town or a shop: the index leaves them out" if home else "a location the index does not keep (unexplained)"))
    for k, v in markers.items():
        if v.get("deleted") or not v.get("name"):
            continue
        row = places.setdefault(k.split(":")[0].lower(), {"locations": 0, "markers": 0, "missing": []})
        row["markers"] += 1
        if v["name"].lower() not in known:
            row["missing"].append((None, v["name"], "a map marker whose kind or location the index does not keep"))

    people_raw = load(version, "people_raw.json")["people"]
    have = {p["id"].lower() for p in people_raw} | {a.lower() for p in people_raw for a in p.get("alsoIds", [])}
    people = {}
    for k, v in npcs.items():
        if not (v.get("unique") and v.get("name")):
            continue
        row = people.setdefault(k.split(":")[0].lower(), {"unique": 0, "covered": 0, "spawned": 0, "missing": []})
        row["unique"] += 1
        if k.lower() in have:
            row["covered"] += 1
        elif k not in placed_npc:
            row["spawned"] += 1  # never placed in a cell by the records: a quest or a script puts them in the world
        else:
            row["missing"].append((v.get("edid"), v["name"], "placed in a cell, not in people_raw.json"))

    names = {n.lower(): n for n in lo}
    plugins = sorted(set(quests) | set(places) | set(people), key=lambda x: names.get(x, x).lower())
    lines = [MARK, "",
             "Each plugin's own records against the data: quests = named, with a journal entry or objective, against `quests_raw.json`; places = named locations and map markers against `places_raw.json`; "
             "people = unique named NPCs against `people_raw.json` (one never placed in a cell is spawned by a script, and left out on purpose). Only plugins with something missing are listed.", ""]
    tq = sum(r["text"] for r in quests.values())
    tk = sum(r["kept"] for r in quests.values())
    tl = sum(r["locations"] + r["markers"] for r in places.values())
    tm = sum(len(r["missing"]) for r in places.values())
    ti = sum(r.get("inside", 0) for r in places.values())
    tu = sum(r["unique"] for r in people.values())
    tc = sum(r["covered"] for r in people.values())
    ts = sum(r["spawned"] for r in people.values())
    tg = sum(len(r["missing"]) for r in people.values())
    lines += [f"**Whole load order ({len(lo)} plugins):** quests {tk} of {tq} named with text are in the data ({tq - tk} dropped as lead-ins or machinery); places {tl - tm} of {tl} named locations and markers ({ti} of them a part of a place the index has: an interior or an exterior); "
              f"people {tc} of {tu} unique named NPCs ({ts} never placed in a cell, left out on purpose; {tg} placed and missing).", ""]
    any_rows = False
    for p in plugins:
        qm = (quests.get(p) or {}).get("missing", [])
        pm = (places.get(p) or {}).get("missing", [])
        gm = (people.get(p) or {}).get("missing", [])
        if not (qm or pm or gm):
            continue
        any_rows = True
        lines.append(f"### {names.get(p, p)}")
        for title, rows in (("quests", qm), ("places", pm), ("people", gm)):
            if rows:
                shown = ", ".join(f"{n} ({e})" if e else n for e, n, _ in rows[:LIMIT]) + (f", and {len(rows) - LIMIT} more" if len(rows) > LIMIT else "")
                why = sorted({w for *_, w in rows})
                lines.append(f"- {title} missing ({len(rows)}; {'; '.join(why)}): {shown}")
        lines.append("")
    if not any_rows:
        lines.append("Nothing is missing.")
        lines.append("")
    path = os.path.join(REPO, "gamedata", version, "quests_report.md")
    text = open(path, encoding="utf-8").read()
    if MARK in text:
        text = text[: text.index(MARK)].rstrip("\n") + "\n"
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text.rstrip("\n") + "\n\n" + "\n".join(lines))
    print(f"coverage: quests {tk}/{tq}, places {tl - tm}/{tl} ({ti} parts), people {tc}/{tu} (+{ts} spawned, {tg} missing) -> quests_report.md")


if __name__ == "__main__":
    main()
