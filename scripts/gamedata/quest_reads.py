"""
The quest reads (WO-153, WO-154): an agent read each quest's records and a second checked it, one batch file at a time in
gamedata/<version>/quest_reads/checked/*.json, each {"checks": [{edid, verdicts}], "quests": [the corrected objects]} as
BRIEF.md and CHECK.md lay it out. A quest with a read gets it on its page and from the door; one without keeps the older
rule-made fields, marked source "rules". Nothing from a read is reworded here.
"""
import glob
import json
import os
import re

# What a page and the door use, in BRIEF.md's words. `evidence` (record ids) and `plugin` stay in the batch files, not the data.
FIELDS = ("canDo", "canDoWhy", "needs", "starts", "firstStep", "takesYou", "choices", "steps", "rewards", "type", "opens", "closes", "people", "unsure")
CAN_DO = ("talk", "by itself", "radiant", "cut", "background")


# An editor id or form id a page could show: a note holding one keeps its field but not its words (nothing is reworded, so it is left out whole).
RECORD_ID = re.compile(r"[A-Za-z]+_[A-Za-z]|^cc|[A-Za-z0-9]\.(esp|esm|esl):")


def player_unsure(unsure):
    """The reader's unsure notes: each keeps its field; its why is dropped when it names a record, so no page shows an id."""
    return [{"field": u["field"], **({"why": u["why"]} if u.get("why") and not RECORD_ID.search(u["why"]) else {})} for u in unsure or [] if u.get("field")]


def load_reads(folder):
    """
    Every checked quest read under folder, by editor id: {edid: {fields, "fixed": [the fields the checker fixed], "plugin"}}.
    A missing folder is no reads. A quest read twice (a later batch file) is the later one; a quest with no name or edid is skipped.
    """
    out = {}
    for path in sorted(glob.glob(os.path.join(folder, "*.json"))):
        with open(path, encoding="utf-8") as f:
            batch = json.load(f)
        fixed = {c["edid"]: [k for k, v in (c.get("verdicts") or {}).items() if isinstance(v, dict) and v.get("verdict") == "fix"] for c in batch.get("checks", []) if c.get("edid")}
        for q in batch.get("quests", []):
            edid = q.get("edid")
            if not edid or not q.get("name"):
                continue
            read = {k: q[k] for k in FIELDS if k in q}
            if read.get("canDo") not in CAN_DO:
                read.pop("canDo", None)
            if "unsure" in read:
                read["unsure"] = player_unsure(read["unsure"])
            out[edid] = {**read, "fixed": fixed.get(edid, [])}
    return out


def attach_reads(lines, reads):
    """
    Each quest in the lines gets its read as `read` and `source: "reads"`, else `source: "rules"` (the older fields stand in). Returns
    (quests with a read, quests without), and the edids of reads that match no quest on the pages (Missives, cut ones).
    """
    have = without = 0
    seen = set()
    for line in lines:
        for q in line["quests"]:
            r = reads.get(q["edid"])
            if r:
                q["read"] = r
                q["source"] = "reads"
                have += 1
                seen.add(q["edid"])
            else:
                q["source"] = "rules"
                without += 1
    return have, without, sorted(set(reads) - seen)


# The ways through a quest (WAYS.md): each choice tied to the journal steps it takes. The reader's `evidence` stays in the batch file.
WAY_FIELDS = ("shape", "shared", "ways", "unsure")


def load_ways(folder):
    """
    Every quest's ways under folder (ways/G*.json, each {"quests": [...]}), by editor id: {edid: {shape, shared, ways, unsure}}.
    A way keeps its title, its `ends` line and its steps, copied as written. A quest with no ways, or none that has a title, is skipped.
    """
    out = {}
    for path in sorted(glob.glob(os.path.join(folder, "G*.json"))):
        with open(path, encoding="utf-8") as f:
            group = json.load(f)
        for q in group.get("quests", []):
            ways = [{"title": w["title"], **({"ends": w["ends"]} if w.get("ends") else {}), "steps": list(w.get("steps") or [])} for w in q.get("ways", []) if w.get("title")]
            if q.get("edid") and ways:
                out[q["edid"]] = {"shape": q.get("shape") if q.get("shape") in ("paths", "endings") else "paths", "shared": list(q.get("shared") or []), "ways": ways, **({"unsure": player_unsure([{"field": "ways", **u} for u in q["unsure"]])} if q.get("unsure") else {})}
    return out


# What a line page shows (docs/data/quest-pages.md, "A quest line page"), in the line reads' words.
LINE_FIELDS = ("about", "getIn", "order", "branches", "gives", "closes", "unsure")


def load_line_reads(folder):
    """
    Every checked line read under folder (lines/checked/L*.json, each {"checks": [...], "lines": [the corrected objects]}), by line id.
    A note that names a record keeps its field and loses its words, as for a quest. `evidence` stays in the batch file.
    """
    out = {}
    for path in sorted(glob.glob(os.path.join(folder, "L*.json"))):
        with open(path, encoding="utf-8") as f:
            batch = json.load(f)
        # The second reader's verdict on each field (agree, fix or unsure), so a page lists as unsure only what was not settled (WO-160 Part 6).
        verdicts = {c["id"]: {f: v.get("verdict") for f, v in (c.get("verdicts") or {}).items() if isinstance(v, dict) and v.get("verdict")} for c in batch.get("checks", []) if c.get("id")}
        for line in batch.get("lines", []):
            if not line.get("id"):
                continue
            read = {k: line[k] for k in LINE_FIELDS if k in line}
            if verdicts.get(line["id"]):
                read["verdicts"] = verdicts[line["id"]]
            if "unsure" in read:
                read["unsure"] = player_unsure(read["unsure"])
            out[line["id"]] = read
    return out


def attach_extras(lines, ways, line_reads, changed_by):
    """
    Each read quest gets its ways (`read.ways`) and, whatever its source, the mods that changed it (`changedBy`); each line with a
    read gets it as `read`. Returns (quests with ways, lines with a read, line read ids that match no line).
    """
    tied = read_lines = 0
    seen = set()
    for line in lines:
        r = line_reads.get(line["id"])
        if r:
            line["read"] = r
            read_lines += 1
            seen.add(line["id"])
        for q in line["quests"]:
            if q.get("read") is not None and q["edid"] in ways:
                q["read"]["ways"] = ways[q["edid"]]
                tied += 1
            if changed_by.get(q["edid"]):
                q["changedBy"] = changed_by[q["edid"]]
    return tied, read_lines, sorted(set(line_reads) - seen)


# Plugins that edit nearly every quest to fix it, not to change it: a page doesn't say a quest was "changed by" them.
BASE_PLUGINS = ("skyrim.esm", "update.esm", "dawnguard.esm", "hearthfires.esm", "dragonborn.esm")
FIXES = re.compile(r"^unofficial .* patch\b", re.IGNORECASE)
# A plugin that only adjusts another mod or the load order isn't a mod a player knows by name; nor is LoreRim's own glue.
GLUE = re.compile(r"\b(patch|fix|fixes|tweak|tweaks|compat|compatibility|bundle|bashed|merged|lorerim|requiem|ai overhaul)\b", re.IGNORECASE)
SMALL = {"the", "of", "a", "an", "and", "in", "to", "for", "on"}


def plugin_words(plugin):
    """A plugin's file name as words, for a mod the folder map doesn't hold: "SaveTheIcerunner.esp" -> "Save the Icerunner"."""
    stem = re.sub(r"\.(esp|esm|esl)$", "", plugin, flags=re.IGNORECASE).replace("_", " ")
    words = re.sub(r"(?<=[a-z])(?=[A-Z])", " ", stem).split()
    return " ".join(w.lower() if i and w.lower() in SMALL else w for i, w in enumerate(words))


def changed_by_of(raw_quest, plugins, own, name_of, unmapped=None):
    """
    The mods that edit a quest the game or another mod defines, as [{name, modid?}] in load order, each once: the quest's editedBy
    plugins, less the base game's, the bug-fix patch's, the quest's own mod and glue. `plugins` is plugins_raw's {plugin: {folder, modid}};
    `name_of` turns a folder into a mod's name. A plugin the map doesn't hold is named from its file, unlinked, unless it only adjusts
    other mods (GLUE), and is added to `unmapped` (a set) for the PC to place.
    """
    seen, out = {own.get("name")}, []
    for plugin in raw_quest.get("editedBy") or []:
        info = plugins.get(plugin)
        if plugin.lower() in BASE_PLUGINS or FIXES.search(plugin):
            continue
        if info:
            name = name_of(info["folder"])
            nexus = info.get("modid") if info.get("modid") not in (None, "", "0") else None
        else:
            name, nexus = plugin_words(plugin), None
            if unmapped is not None and not GLUE.search(name):
                unmapped.add(plugin)
        # Glue isn't a mod, and a second plugin of a mod already named ("Alternate Perspective - Gate to Sovngarde Edition") is that mod.
        if GLUE.search(name) or name in seen or any(name.startswith(f"{n} - ") for n in seen if n):
            continue
        seen.add(name)
        out.append({"name": name, **({"modid": nexus} if nexus else {})})
    return out
