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
Each stage also lists its log entries one by one (`entries`, WO-115): the text, whether that entry
completes or fails the quest (QSDT), and the conditions it shows under (the CTDA subrecords after its
QSDT), kept as quest_starts.ctda reads them and in plain words (`when`): "Stage 160 of this quest done",
"global X is 1", "the player is in faction Y". The names come from a second pass over the load order.

Text tags (WO-115): journal entries, objectives and names carry the game's tags, <Alias=Item>,
<Alias.ShortName=Questgiver>, <Alias.PronounObj=Target>, <Global=RoomCost>. Each quest gets `fills`, the
tags its own text uses mapped to what the records say they stand for: an alias's unique actor (ALUA),
the base of its forced reference (ALFR), its location (ALFL) or the item it creates (ALCO); the short
name (SHRT) for ShortName; he, she, him, her and so on from the actor's sex (ACBS) for the pronoun tags.
`globals` holds each named global's value (FLTV) by EDID, for the tags in quest text and in the start
check's results. quest_pages.py fills the text; a tag the records can't answer becomes plain words there.

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
from quest_starts import ctda, describe_condition  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))

DELETED = 0x20
# DNAM quest type (uint32 at offset 8), in the game's words.
TYPES = {0: None, 1: "Main Quest", 2: "Mages Guild", 3: "Thieves Guild", 4: "Dark Brotherhood", 5: "Companions", 6: "Misc",
         7: "Daedric", 8: "Side Quest", 9: "Civil War", 10: "Dawnguard", 11: "Dragonborn"}
# Log entry flags (QSDT).
COMPLETES, FAILS = 0x01, 0x02
RUN_ON_ALIAS = 5  # CTDA run-on type (offset 20): the condition is checked on one of the quest's aliases
# The records a log entry's conditions name, read in the second pass for their names (and globals' values).
NAMED = ("QUST", "GLOB", "FACT", "NPC_", "LCTN", "KEYM", "MISC", "BOOK", "WEAP", "ARMO", "RACE", "ALCH", "INGR", "AMMO", "SLGM",
         "SCRL", "CONT", "ACTI", "FURN", "DOOR", "LIGH", "FLOR")
# A text tag: <Alias=Item>, <Alias.PronounObj=Target>, <Global=RoomCost>, <Global.Day=Deadline>.
TAG = re.compile(r"<(Alias|Global)(?:\.(\w+))?=([^<>]+)>", re.IGNORECASE)
PRONOUNS = {"pronoun": ("he", "she"), "pronouncap": ("He", "She"), "pronounobj": ("him", "her"), "pronounobjcap": ("Him", "Her"),
            "pronounpos": ("his", "her"), "pronounposcap": ("His", "Her"), "pronounposobj": ("his", "hers"), "pronounposobjcap": ("His", "Hers")}
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
               "stages": [], "objectives": [], "aliases": {}}
        rec["aliasFills"] = {}
        stage = entry = objective = alias = None
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
                entry = {"text": "", "flags": v[0], "conditions": []}
                stage["log"].append(entry)
            elif s == "CTDA" and entry is not None and part == "stages" and len(v) >= 24:
                c = ctda(v, masters, name)
                if len(v) >= 32 and struct.unpack_from("<I", v, 20)[0] == RUN_ON_ALIAS:
                    c["alias"] = struct.unpack_from("<i", v, 28)[0]  # parameter 3 holds the alias id
                entry["conditions"].append(c)
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
                if s != "ANAM":
                    alias = struct.unpack_from("<I", v)[0]
                    rec["aliasFills"][alias] = {}
            elif s == "ALID" and part == "aliases":
                rec["aliases"][alias] = _text(v)
            elif s in ("ALUA", "ALFR", "ALFL", "ALCO") and part == "aliases" and alias is not None and len(v) >= 4 and struct.unpack_from("<I", v)[0]:
                kind = {"ALUA": "actor", "ALFR": "ref", "ALFL": "location", "ALCO": "creates"}[s]
                rec["aliasFills"][alias][kind] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
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
        entries = []
        for e in st["log"]:
            one = {"text": e["text"]}
            if e["flags"] & COMPLETES:
                one["completes"] = True
            if e["flags"] & FAILS:
                one["fails"] = True
            if e.get("conditions"):
                one["conditions"] = e["conditions"]
            if one["text"] or len(one) > 1:
                entries.append(one)
        if entries:
            row["entries"] = entries
        stages.append(row)
    objectives = [{"index": o["index"], "text": o["text"]} for o in sorted(rec["objectives"], key=lambda o: o["index"]) if o["text"]]
    out = {"id": form_id(rec["key"]), "edid": rec["edid"], "name": rec["name"], "type": rec["type"], "plugin": rec["key"][0]}
    others = [p for p in editors if p.lower() != rec["key"][0].lower()]
    if others:
        out["editedBy"] = others
    out["stages"] = stages
    out["objectives"] = objectives
    if rec.get("aliases"):
        out["aliases"] = {str(k): v for k, v in sorted(rec["aliases"].items())}
    fills = {str(k): v for k, v in sorted(rec.get("aliasFills", {}).items()) if v}
    if fills:
        out["aliasFills"] = fills
    return out


def _num(v):
    return int(v) if isinstance(v, float) and v == int(v) else v


def condition_words(c, own, names, aliases):
    """
    One log entry condition in plain words. `own` is the quest's id, `names` the named records
    (form id -> {edid, name, value}) and `aliases` the quest's alias names by id. The subject of a log
    entry's condition is the player unless it runs on an alias.
    """
    def nm(fid):
        n = names.get(fid, {})
        return n.get("name") or n.get("edid") or fid
    who = aliases.get(str(c["alias"]), f"alias {c['alias']}") if "alias" in c else "the player"
    yes = (c["value"] == 1) == (c["cmp"] == "==") if c.get("value") in (0, 1) and c["cmp"] in ("==", "!=") else None
    fn = c["fn"]
    if fn == "GetStageDone" and c.get("param") == own and yes is not None:
        return f"Stage {c.get('stage')} of this quest {'done' if yes else 'not done'}"
    if fn == "GetGlobalValue" and "value" in c:
        cmp = {"==": "is", "!=": "is not"}.get(c["cmp"], c["cmp"])
        return f"global {nm(c['param'])} {cmp} {_num(c['value'])}"
    if fn == "GetInFaction" and yes is not None:
        return f"{who} is {'in' if yes else 'not in'} faction {nm(c['param'])}"
    if fn == "GetIsID" and yes is not None:
        return f"{who} is {'' if yes else 'not '}{nm(c['param'])}"
    if fn == "GetDead" and yes is not None:
        return f"{who} is {'dead' if yes else 'alive'}"
    if fn == "GetStageDone" and yes is not None:
        return f"Stage {c.get('stage')} of {nm(c['param'])} {'done' if yes else 'not done'}"
    words = describe_condition({**c, **({"value": _num(c["value"])} if "value" in c else {})}, names,
                               {k: {"value": _num(n["value"])} for k, n in names.items() if "value" in n})
    return f"{who}: {words}" if "alias" in c else words


def when_words(conditions, own, names, aliases):
    """A log entry's conditions as one line: each in plain words, joined by and, or where the record says or."""
    out = []
    for i, c in enumerate(conditions):
        if i:
            out.append("or" if conditions[i - 1]["or"] else "and")
        out.append(condition_words(c, own, names, aliases))
    return " ".join(out)


def named_forms(quests):
    """Every record a kept quest's log entry conditions name: their params and the globals they compare with."""
    out = set()
    for q in quests:
        for st in q["stages"]:
            for e in st.get("entries", []):
                for c in e.get("conditions", []):
                    for k in ("param", "global"):
                        if isinstance(c.get(k), str):
                            out.add(c[k])
    return out


def read_names(buf, name, wanted, strings=None):
    """
    The records in `wanted` that this plugin holds: {form id: {edid, name, value (globals)}}.
    `strings` is called for the plugin's string table the first time a localized name needs it.
    """
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    table = None
    out = {}
    for grp in NAMED:
        if grp.encode() not in buf:
            continue
        for o in iter_group(buf, grp):
            t, _, fid, d = rec_data(buf, o)
            key = form_id(resolve(fid, masters, name))
            if t != grp or key not in wanted:
                continue
            row = {}
            for s, v in subrecs(d):
                if s == "EDID":
                    row["edid"] = _text(v)
                elif s == "FULL" and "name" not in row:
                    if loc and len(v) == 4:
                        if table is None:
                            table = (strings() if strings else None) or {}
                        row["name"] = table.get(struct.unpack_from("<I", v)[0], "").strip()
                    else:
                        row["name"] = _text(v).strip()
                elif s == "FLTV" and grp == "GLOB" and len(v) >= 4:
                    row["value"] = round(struct.unpack_from("<f", v)[0], 4)
                elif s == "SHRT" and grp == "NPC_":
                    if loc and len(v) == 4:
                        if table is None:
                            table = (strings() if strings else None) or {}
                        row["short"] = table.get(struct.unpack_from("<I", v)[0], "").strip()
                    else:
                        row["short"] = _text(v).strip()
                elif s == "ACBS" and grp == "NPC_" and len(v) >= 4:
                    row["female"] = bool(struct.unpack_from("<I", v)[0] & 1)
            out[key] = row
    return out


def text_tags(q):
    """The tags in a quest's own text: its name, journal entries and objectives."""
    texts = [q.get("name", "")] + [o["text"] for o in q.get("objectives", [])]
    texts += [e.get("text", "") for st in q.get("stages", []) for e in st.get("entries", [])] + [t for st in q.get("stages", []) for t in st.get("log", [])]
    return {m.group(0): m for t in texts for m in TAG.finditer(t or "")}


def tag_forms(quests):
    """(references, records) that fill the alias tags the quests' text uses: forced references to look up, and the rest to name."""
    refs, forms = set(), set()
    for q in quests:
        by_name = {a.lower(): k for k, a in q.get("aliases", {}).items()}
        for m in text_tags(q).values():
            fill = q.get("aliasFills", {}).get(by_name.get(m.group(3).strip().lower()), {}) if m.group(1).lower() == "alias" else {}
            refs |= {fill["ref"]} if fill.get("ref") else set()
            forms |= {fill[k] for k in ("actor", "location", "creates") if fill.get(k)}
    return refs, forms


def read_ref_bases(buf, name, wanted):
    """{reference: its base object} for the placed references in `wanted` (REFR and ACHR, NAME)."""
    masters = header(buf)
    out = {}
    for grp in ("CELL", "WRLD"):
        if grp.encode() not in buf:
            continue
        for o in iter_group(buf, grp):
            if buf[o:o + 4] not in (b"REFR", b"ACHR"):
                continue
            key = form_id(resolve(struct.unpack_from("<I", buf, o + 12)[0], masters, name))
            if key not in wanted:
                continue
            _, _, _, d = rec_data(buf, o)
            for s, v in subrecs(d):
                if s == "NAME" and len(v) >= 4:
                    out[key] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
                    break
    return out


def read_globals(buf, wanted):
    """{edid (lower case): value} for the globals in `wanted`, by EDID."""
    out = {}
    if b"GLOB" not in buf:
        return out
    for o in iter_group(buf, "GLOB"):
        t, _, _, d = rec_data(buf, o)
        if t != "GLOB":
            continue
        edid, value = None, None
        for s, v in subrecs(d):
            if s == "EDID":
                edid = _text(v).lower()
            elif s == "FLTV" and len(v) >= 4:
                value = round(struct.unpack_from("<f", v)[0], 4)
        if edid in wanted and value is not None:
            out[edid] = value
    return out


def tag_fills(q, names, bases):
    """A quest's alias tags mapped to what its records say they stand for; a tag they don't answer is left out."""
    by_name = {a.lower(): k for k, a in q.get("aliases", {}).items()}
    out = {}
    for tag, m in text_tags(q).items():
        if m.group(1).lower() != "alias":
            continue
        fill = q.get("aliasFills", {}).get(by_name.get(m.group(3).strip().lower()), {})
        who = fill.get("actor") or bases.get(fill.get("ref"))
        person = names.get(who, {}) if who else {}
        thing = names.get(fill.get("location") or fill.get("creates") or "", {})
        part = (m.group(2) or "").lower()
        if part in PRONOUNS:
            if "female" in person:
                out[tag] = PRONOUNS[part][person["female"]]
        elif part == "shortname" and (person.get("short") or person.get("name")):
            out[tag] = person.get("short") or person["name"]
        elif person.get("name") or thing.get("name"):
            out[tag] = person.get("name") or thing["name"]
    return out


def global_edids(quests, story_checks):
    """The EDIDs (lower case) of the globals the tags name, in quest text and in the start check's results."""
    out = {m.group(3).strip().lower() for q in quests for m in text_tags(q).values() if m.group(1).lower() == "global"}
    if os.path.isdir(story_checks):
        for f in os.listdir(story_checks):
            if f.endswith(".json") and not f.startswith("."):
                out |= {m.group(3).strip().lower() for m in TAG.finditer(open(os.path.join(story_checks, f), encoding="utf-8").read())
                        if m.group(1).lower() == "global"}
    return out


def describe_when(quests, names):
    """Fills each conditioned log entry's `when`, in plain words."""
    for q in quests:
        for st in q["stages"]:
            for e in st.get("entries", []):
                if e.get("conditions"):
                    e["when"] = when_words(e["conditions"], q["id"], names, q.get("aliases", {}))


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
    # A named quest's lead-in has no name of its own (WO-121a): DA14Start, Sam Guevenne's drinking contest, opens A Night
    # To Remember (DA14) as a Miscellaneous objective. It's kept, named by its first objective, the game's own words.
    parents = {q["edid"].lower(): q for q in kept}
    for q in rows:
        parent = parents.get(q["edid"].lower()[:-5]) if q["edid"].lower().endswith("start") and not q["name"] else None
        if parent and q["objectives"]:
            q["name"] = q["objectives"][0]["text"]
            q["leadsTo"] = parent["id"]
            kept.append(q)
    counts["lead-ins"] = sum(1 for q in kept if q.get("leadsTo"))
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

    pp, lo = plugin_paths(), load_order(cc=True)
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
    # Second pass: the names of what the log entries' conditions read, the winning version of each.
    wanted, names = named_forms(quests), {}
    for n in lo:
        p = pp.get(n.lower())
        if p and wanted:
            names.update(read_names(open(p, "rb").read(), n, wanted, lambda p=p, n=n: localized_strings(p, n) or vanilla_strings(n, ROOT)))
    for q in quests:
        names.setdefault(q["id"], {"edid": q["edid"], "name": q["name"]})
    describe_when(quests, names)
    # The text tags: forced references' bases, then the names of what fills each alias, and the globals' values.
    base = os.path.join(REPO, "gamedata", VERSION)
    refs, forms = tag_forms(quests)
    gl_wanted = global_edids(quests, os.path.join(base, "story_checks"))
    bases, gvalues = {}, {}
    for n in lo:
        p = pp.get(n.lower())
        if p:
            buf = open(p, "rb").read()
            if refs:
                bases.update(read_ref_bases(buf, n, refs))
            gvalues.update(read_globals(buf, gl_wanted))
    tag_names = {}
    for n in lo:
        p = pp.get(n.lower())
        if p:
            tag_names.update(read_names(open(p, "rb").read(), n, forms | set(bases.values()), lambda p=p, n=n: localized_strings(p, n) or vanilla_strings(n, ROOT)))
    for q in quests:
        fills = tag_fills(q, tag_names, bases)
        if fills:
            q["fills"] = fills
        q.pop("aliasFills", None)
    filled = sum(len(q.get("fills", {})) for q in quests)
    print(f"text tags: {sum(len(text_tags(q)) for q in quests)} in quest text, {filled} alias tags filled from the records, "
          f"{len(gvalues)} of {len(gl_wanted)} named globals found")
    folders = plugin_folders(ROOT)
    spelling = {n.lower(): n for n in lo}
    for q in quests:
        q["plugin"] = spelling.get(q["plugin"].lower(), q["plugin"])
        q.update(source_of(q["plugin"], folders, ROOT))
    lines = quest_lines(quests)
    with open(os.path.join(base, "quests_raw.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"counts": counts, "quests": quests, "globals": dict(sorted(gvalues.items()))}, f, indent=1, ensure_ascii=False)
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
