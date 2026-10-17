"""
Every player-facing quest in the Ultra load order, from the winning QUST records, and the quest
lines a player could follow instead of the main story.

Reads only. Writes gamedata/<version>/quests_raw.json, questlines_raw.json and quests_report.md:
  python3 scripts/gamedata/quests.py [version]

Quests are filtered in steps, each counted in the output:
  read        every winning QUST record
  named       a full name (FULL)
  with text   at least one journal entry (a stage's log entry, CNAM) or objective (NNAM)
  kept        both: the quests a player sees in the journal. Many named quests are the game's
              own machinery (radiant scenes, dialogue holders) with neither.

For each kept quest: id, EDID, name, the plugin that made it and the ones that edit it, its type
(DNAM), its stages in order (index, log entries, whether one completes or fails the quest), its
objectives, and the MO2 mod folder its plugin loads from with that folder's Nexus modid (recipes.py's
lookup). Text is the game's own words, from the plugins' string tables when they're localized.

Who gives a quest, and where, sits in its aliases and dialogue conditions; those aren't plain facts
in the records and are left out.

Quest lines (questlines_raw.json):
  base game and DLC  one line per story type (Main Quest, College, Companions, Thieves Guild, Dark
                     Brotherhood, Civil War, Dawnguard, Dragonborn); each Daedric quest is a line of
                     its own; side and misc quests are one bucket each.
  mods               one line per mod (its MO2 folder, or the folder below it that has the modid when
                     the plugin loads from one of LoreRim's output folders; Creation Club plugins one
                     each), quests in EDID order, numbers counted as numbers.
Each line says how it begins: the first journal entry (or, for mods like Vigilant that use only
objectives, the first objective) of its opening quest: the base game's own first quest for a story
line (STORY_START); for a mod, the quest named after the mod (Wyrmstooth's "Wyrmstooth"), else the
first whose EDID marks a main quest (MQ, as Vigilant's zzzAoMMq00), else the first that isn't Misc,
where radiant jobs sit.
`journal` counts the quests with journal entries, which tells a story line from a radiant one.
"""
import json
import os
import re
import struct
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import header, iter_group, rec_data, resolve, subrecs  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))

DELETED = 0x20
# DNAM quest type (uint32 at offset 8), in the game's words.
TYPES = {0: None, 1: "Main Quest", 2: "Mages Guild", 3: "Thieves Guild", 4: "Dark Brotherhood", 5: "Companions", 6: "Misc",
         7: "Daedric", 8: "Side Quest", 9: "Civil War", 10: "Dawnguard", 11: "Dragonborn"}
# Log entry flags (QSDT).
COMPLETES, FAILS = 0x01, 0x02
BASE = {"skyrim.esm", "update.esm", "dawnguard.esm", "hearthfires.esm", "dragonborn.esm"}
# The base game's story lines, by quest type, and what a player calls each.
STORY_LINES = {"Main Quest": "Main Quest", "Mages Guild": "College of Winterhold", "Companions": "Companions",
               "Thieves Guild": "Thieves Guild", "Dark Brotherhood": "Dark Brotherhood", "Civil War": "Civil War",
               "Dawnguard": "Dawnguard", "Dragonborn": "Dragonborn"}
# The quest each base-game story line opens with (checked by name against the records, 17 Oct 2026).
# EDID order doesn't give it: Dawnguard's would open with A New Order. The Civil War opens with
# either side's; Joining the Legion is first.
STORY_START = {"Main Quest": "MQ101", "Mages Guild": "MG01", "Companions": "C00", "Thieves Guild": "TG00",
               "Dark Brotherhood": "DB01", "Civil War": "CW01A", "Dawnguard": "DLC1VQ01MiscObjective", "Dragonborn": "DLC2MQ01"}


def _text(v):
    return v.rstrip(b"\0").decode("utf-8", "replace")


def edid_order(q):
    """EDID order with numbers counted as numbers: zzzAoMMq2 before zzzAoMMq10."""
    return [int(p) if p.isdigit() else p for p in re.split(r"(\d+)", q["edid"].lower())]


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


def read_plugin(buf, name, strings=None):
    """QUST records from one plugin's bytes, with their text resolved through `strings` when localized."""
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    strings = strings or {}

    def txt(v):
        if loc and len(v) == 4:
            return strings.get(struct.unpack_from("<I", v)[0], "")
        return _text(v)

    out = []
    if b"QUST" not in buf:
        return out
    for o in iter_group(buf, "QUST"):
        _, flags, fid, d = rec_data(buf, o)
        rec = {"plugin": name, "key": list(resolve(fid, masters, name)), "flags": flags, "edid": "", "name": "", "type": None,
               "stages": [], "objectives": []}
        stage = entry = objective = None
        part = "head"  # head, stages, objectives, aliases: subrecord names repeat across the parts
        for s, v in subrecs(d):
            if s == "EDID":
                rec["edid"] = _text(v)
            elif s == "FULL" and part == "head":
                rec["name"] = txt(v).strip()
            elif s == "DNAM" and part == "head" and len(v) >= 12:
                rec["type"] = TYPES.get(struct.unpack_from("<I", v, 8)[0])
            elif s == "INDX" and part in ("head", "stages"):
                part = "stages"
                stage = {"index": struct.unpack_from("<H", v)[0], "log": []}
                rec["stages"].append(stage)
                entry = None
            elif s == "QSDT" and stage is not None and part == "stages":
                entry = {"text": "", "flags": v[0]}
                stage["log"].append(entry)
            elif s == "CNAM" and entry is not None and part == "stages":
                entry["text"] = txt(v).strip()
            elif s == "QOBJ":
                part = "objectives"
                objective = {"index": struct.unpack_from("<H", v)[0], "text": ""}
                rec["objectives"].append(objective)
            elif s == "NNAM" and objective is not None and part == "objectives":
                objective["text"] = txt(v).strip()
            elif s in ("ANAM", "ALST", "ALLS"):
                part = "aliases"
        out.append(rec)
    return out


def describe(rec, editors):
    """A raw QUST as a quest entry: stages in order with their log text, objectives, and what ends it."""
    stages = []
    for st in sorted(rec["stages"], key=lambda s: s["index"]):
        log = [e["text"] for e in st["log"] if e["text"]]
        row = {"index": st["index"]}
        if log:
            row["log"] = log
        if any(e["flags"] & COMPLETES for e in st["log"]):
            row["completes"] = True
        if any(e["flags"] & FAILS for e in st["log"]):
            row["fails"] = True
        stages.append(row)
    objectives = [{"index": o["index"], "text": o["text"]} for o in sorted(rec["objectives"], key=lambda o: o["index"]) if o["text"]]
    out = {"id": form_id(rec["key"]), "edid": rec["edid"], "name": rec["name"], "type": rec["type"], "plugin": rec["key"][0]}
    others = [p for p in editors if p.lower() != rec["key"][0].lower()]
    if others:
        out["editedBy"] = others
    out["stages"] = stages
    out["objectives"] = objectives
    return out


def has_text(q):
    return any("log" in s for s in q["stages"]) or bool(q["objectives"])


def index_quests(winners, editors):
    """The filter steps over the winning QUST records, with the count after each. Returns (quests, counts)."""
    counts = {"read": len(winners)}
    rows = [describe(r, editors.get(tuple(r["key"]), [])) for r in winners if not r["flags"] & DELETED]
    named = [q for q in rows if q["name"]]
    counts["named"] = len(named)
    counts["with text"] = sum(1 for q in rows if has_text(q))
    kept = [q for q in named if has_text(q)]
    counts["kept"] = len(kept)
    kept.sort(key=lambda q: (q["plugin"].lower(), q["edid"].lower()))
    return kept, counts


def source_of(plugin, folders, root):
    """Where a quest's plugin comes from: Skyrim for the base game and DLC, else its MO2 folder and modid."""
    if plugin.lower() in BASE:
        return {"source": "Skyrim"}
    from recipes import plugin_source

    s = plugin_source(plugin, folders.get(plugin.lower()), root)
    # A plugin loaded from one of LoreRim's output folders is the mod its modid comes from.
    name = s.get("modidFrom") or s["folder"]
    out = {"source": "Creation Club" if plugin.lower().startswith("cc") else name, "folder": s["folder"]}
    if s["modid"]:
        out["modid"] = s["modid"]
    return out


def first_entry(q):
    """A quest's first journal entry (lowest stage with log text), else its first objective."""
    for st in q["stages"]:
        if st.get("log"):
            return st["log"][0]
    return q["objectives"][0]["text"] if q["objectives"] else ""


def opening_quest(line, qs):
    """A mod line's first quest: the one named after the mod, else the first main quest (MQ in its EDID), else the first that isn't Misc."""
    title = line.split(" - ")[0].strip().lower()
    return (next((q for q in qs if q["name"].lower() == title), None)
            or next((q for q in qs if "mq" in q["edid"].lower() and q["type"] != "Misc"), None)
            or next((q for q in qs if q["type"] != "Misc"), qs[0]))


def quest_lines(quests):
    """Group the kept quests into lines a player would pick from, biggest first. Each quest needs `source`."""
    groups = {}
    for q in quests:
        if q["source"] == "Skyrim":
            t = q["type"]
            if t in STORY_LINES:
                key, name, kind = ("story", t), STORY_LINES[t], "story"
            elif t == "Daedric":
                key, name, kind = ("daedric", q["id"]), q["name"], "daedric"
            elif t == "Misc":
                key, name, kind = ("bucket", "Misc"), "Miscellaneous", "bucket"
            else:
                key, name, kind = ("bucket", "Side"), "Side quests", "bucket"
            src = {"source": "Skyrim"}
        elif q["source"] == "Creation Club":
            key, name, kind = ("mod", q["plugin"].lower()), os.path.splitext(q["plugin"])[0], "mod"
            src = {"source": "Creation Club", "plugins": [q["plugin"]]}
        else:
            key, name, kind = ("mod", q["source"].lower()), q["source"], "mod"
            src = {"source": q["source"], **({"modid": q["modid"]} if q.get("modid") else {})}
        g = groups.setdefault(key, {"name": name, "kind": kind, **src, "quests": []})
        g["quests"].append(q)
    lines = []
    for g in groups.values():
        qs = sorted(g.pop("quests"), key=edid_order)
        start = STORY_START.get(qs[0]["type"]) if g["kind"] == "story" else None
        opening = next((q for q in qs if q["edid"] == start), None) or opening_quest(g["name"], qs)
        if g["kind"] == "story":
            qs.remove(opening)
            qs.insert(0, opening)
        g["plugins"] = sorted({q["plugin"] for q in qs}, key=str.lower)
        if g["kind"] != "mod":
            g.pop("plugins")
        g["count"] = len(qs)
        g["journal"] = sum(1 for q in qs if any("log" in st for st in q["stages"]))
        g["types"] = dict(Counter(q["type"] or "None" for q in qs).most_common())
        g["opening"] = opening["id"]
        g["begins"] = first_entry(opening)
        g["quests"] = [q["id"] for q in qs]
        lines.append(g)
    lines.sort(key=lambda g: (-g["count"], g["name"].lower()))
    return lines


def report(counts, quests, lines, samples):
    """quests_report.md: the counts, kept by type and by plugin, five sample quests in full, every line."""
    out = ["# Quests in LoreRim 5.0.4.8", "", "Written by `scripts/gamedata/quests.py` from the winning QUST records in the Ultra load order.", ""]
    out += ["## Counts", "", " -> ".join(f"{k} {v}" for k, v in counts.items()), ""]
    out += ["## Kept by type", "", "| Type | Quests |", "| --- | --- |"]
    out += [f"| {t} | {n} |" for t, n in Counter(q["type"] or "None" for q in quests).most_common()]
    out += ["", "## Kept by plugin (top 20)", "", "| Plugin | Quests |", "| --- | --- |"]
    out += [f"| {p} | {n} |" for p, n in Counter(q["plugin"] for q in quests).most_common(20)]
    out += ["", "## Sample quests", ""]
    for q in samples:
        out += [f"### {q['name']} (`{q['edid']}`, {q['id']})", "", f"Type: {q['type'] or 'none'}. Source: {q['source']}" + (f" (Nexus {q['modid']})" if q.get("modid") else "") + ".", ""]
        out += ["Journal:", ""]
        journal = []
        for st in q["stages"]:
            for t in st.get("log", []):
                end = " (completes the quest)" if st.get("completes") else " (fails the quest)" if st.get("fails") else ""
                journal.append(f"- Stage {st['index']}{end}: {t}")
        out += journal or ["- (none)"]
        out += ["", "Objectives:", ""]
        out += [f"- {o['index']}: {o['text']}" for o in q["objectives"]] or ["- (none)"]
        out.append("")
    out += ["## Quest lines, biggest first", "", "Journal: how many of the line's quests have journal entries; a line of objective-only quests is",
            "radiant work (Missives, bounties) or a mod that uses objectives alone (Vigilant).", "",
            "| Line | Kind | Source | Quests | Journal | Types | How it begins |", "| --- | --- | --- | --- | --- | --- | --- |"]
    for g in lines:
        src = g["source"] + (f" (Nexus {g['modid']})" if g.get("modid") else "")
        types = ", ".join(f"{t} {n}" for t, n in g["types"].items())
        begins = g["begins"].replace("|", "/").replace("\n", " ")
        out.append(f"| {g['name']} | {g['kind']} | {src} | {g['count']} | {g['journal']} | {types} | {begins} |")
    return "\n".join(out) + "\n"


SAMPLE_EDIDS = ["MQ103", "C01", "DA02"]


def pick_samples(quests, lines):
    """Bleak Falls Barrow (MQ103) and two more base-game quests if kept, Vigilant's opening quest, and Wyrmstooth's (or another quest mod's)."""
    by_edid = {q["edid"].lower(): q for q in quests}
    by_id = {q["id"]: q for q in quests}
    out = [by_edid[e.lower()] for e in SAMPLE_EDIDS if e.lower() in by_edid][:3]
    mods = [g for g in lines if g["kind"] == "mod"]
    vig = next((g for g in mods if "vigilant" in g["name"].lower()), None)
    if vig:
        out.append(by_id[vig["opening"]])
    other = next((g for g in mods if "wyrmstooth" == g["name"].lower()), None) or next((g for g in mods if g is not vig and g["journal"] >= 3), None)
    if other:
        out.append(by_id[other["opening"]])
    return out


def main():
    from bsa import vanilla_strings
    from esp import ROOT, load_order, localized_strings, plugin_paths
    from recipes import plugin_folders

    pp, lo = plugin_paths(), load_order()
    winners, editors = {}, {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if b"QUST" not in buf:
            continue
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        try:
            recs = read_plugin(buf, n, (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else None)
        except Exception as e:  # a plugin the reader can't follow is listed, never fatal
            print("skip", n, e, file=sys.stderr)
            continue
        for r in recs:
            key = tuple(r["key"])
            editors.setdefault(key, []).append(n)
            winners.pop(key, None)  # keep load order: the winner goes to the end
            winners[key] = r
    quests, counts = index_quests(list(winners.values()), editors)
    folders = plugin_folders(ROOT)
    spelling = {n.lower(): n for n in lo}
    for q in quests:
        q["plugin"] = spelling.get(q["plugin"].lower(), q["plugin"])
        q.update(source_of(q["plugin"], folders, ROOT))
    lines = quest_lines(quests)
    base = os.path.join(REPO, "gamedata", VERSION)
    with open(os.path.join(base, "quests_raw.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"counts": counts, "quests": quests}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    with open(os.path.join(base, "questlines_raw.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"lines": lines}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    with open(os.path.join(base, "quests_report.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write(report(counts, quests, lines, pick_samples(quests, lines)))
    print(" -> ".join(f"{k} {v}" for k, v in counts.items()))
    kinds = Counter(g["kind"] for g in lines)
    print(f"lines {len(lines)}: " + ", ".join(f"{k} {n}" for k, n in kinds.items()))
    print("wrote quests_raw.json, questlines_raw.json, quests_report.md in", os.path.relpath(base, REPO))


VERSION = "5.0.4.8"
if __name__ == "__main__":
    if len(sys.argv) > 1:
        VERSION = sys.argv[1]
    main()
