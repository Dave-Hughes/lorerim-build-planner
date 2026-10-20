"""
The Quests pages' data (WO-100): src/data/lorerim-<version>/quests.json, built by build.py from
questlines.curate() (the curated lines), quests_raw.json (each quest's journal and objectives) and
quest_givers_raw.json (WO-98/99: who gives a quest, where, and what its records can hand out).

Each line keeps the curation's facts and gains:
  sources        a display name, its Nexus mod id, and base: true for the base game
  giver          the opening quest's named giver, { name, place }, when it's a person, not a role
  firstObjective the opening quest's first objective, when it names who or where
  quests         each quest's edid, name, type, XP, journal (log entries in stage order),
                 stages (WO-115: each stage's log entries with whether it completes or fails the
                 quest and when it shows, in plain words), endings (the entries that complete or
                 fail it, in stage order; [] when the records flag none), objectives and rewards
                 (gold tier, weapons and armour)
  xpTotal        the line's quest XP
"""
import re

# LoreRim's Experience.ini: the XP a finished quest gives, by its type in the records.
QUEST_XP = {
    "Main Quest": 200,
    "Daedric": 200,
    "Dawnguard": 200,
    "Dragonborn": 200,
    "Civil War": 150,
    "Side Quest": 100,
    "Mages Guild": 100,
    "Thieves Guild": 100,
    "Dark Brotherhood": 100,
    "Companions": 100,
    "Misc": 0,
    None: 0,
}

# Givers that are a role, not a person: the page says nothing rather than "Courier".
ROLES = {"prisoner", "courier", "guard", "bandit", "necromancer"}

# Words in an MO2 folder's name that aren't the mod's name.
_NOISE = re.compile(r"\b(ESMIFIED|ESLIFIED|CLEANED)\b", re.IGNORECASE)
_SUFFIX = re.compile(r"\s+-\s+(English Translation|Quest|Quest Mod|Main)\s*$", re.IGNORECASE)


def xp_for(quest_type):
    return QUEST_XP.get(quest_type, 0)


def source_name(folder):
    """An MO2 folder as a mod's name: "Meridia's Order ESMIFIED" -> "Meridia's Order"; Skyrim -> Base game."""
    if folder == "Skyrim":
        return "Base game"
    name = re.sub(r"\s*\([^)]*\)", "", folder)
    name = _NOISE.sub("", name)
    name = re.sub(r"\s+-\s*$", "", re.sub(r"\s+", " ", name).strip())
    name = _SUFFIX.sub("", name)
    return name.strip(" -") or folder


def place_of(where):
    """ "Riverwood Trader, Riverwood" from a giver's first placed reference; None when it has no names."""
    if not where:
        return None
    w = where[0]
    # A holding cell is where a script keeps someone until it moves them in (Lurius Liore sits in
    # the Wyrmstooth Holder Cell, but you meet him at the Bannered Mare): no place is better.
    if re.search(r"holder|holding|storage|dummy|test", w.get("cellName") or "", re.IGNORECASE):
        return None
    parts = [p for p in (w.get("cellName"), w.get("location")) if p]
    # The same name twice ("Riften, Riften") says it once.
    out = []
    for p in parts:
        if p not in out:
            out.append(p)
    return ", ".join(out) or None


def giver_of(entry):
    """The opening quest's named giver as { name, place }, or None for no giver or a role (Courier)."""
    g = (entry or {}).get("namedGiver")
    if not g or not g.get("name"):
        return None
    name = g["name"].strip()
    if name.lower() in ROLES:
        return None
    # Not "a name that's the same as its alias": most quests name a person's alias after them
    # (Meridia, Serana, Neloth, Delphine), so that rule would take 39 of the 114 openings' real
    # givers away. The role names are what it was for, and they're above.
    out = {"name": name}
    place = place_of(g.get("where"))
    if place:
        out["place"] = place
    return out


_GOLD = [
    (re.compile(r"QuestReward0?1Small$|^FavorRewardGoldSmall", re.IGNORECASE), "small"),
    (re.compile(r"QuestReward0?2Medium$|^FavorRewardGoldMedium", re.IGNORECASE), "medium"),
    (re.compile(r"QuestReward0?3Large$|^FavorRewardGoldLarge", re.IGNORECASE), "large"),
]
_RANK = {"small": 1, "medium": 2, "large": 3}


def gold_tier(rewards):
    """The largest gold reward list a quest hands out: small, medium or large. A bare Septim doesn't count."""
    best = None
    for r in rewards or []:
        if r.get("type") not in ("leveled list", "gold"):
            continue
        for pat, tier in _GOLD:
            if pat.search(r.get("name", "")) and (best is None or _RANK[tier] > _RANK[best]):
                best = tier
    return best


def reward_items(rewards):
    """Weapons and armour a quest's own alias or fragment script hands out, by name, once each."""
    out = []
    for r in rewards or []:
        if r.get("type") in ("weapon", "armour") and r.get("kind") in ("alias", "fragment") and r.get("name"):
            if r["name"] not in out:
                out.append(r["name"])
    return out


def journal(q):
    """A quest's log entries in stage order."""
    return [t for s in sorted(q.get("stages", []), key=lambda s: s.get("index", 0)) for t in s.get("log", []) if t]


def entries_of(stage):
    """
    A raw stage's log entries, one by one. quests.py writes `entries` (WO-115); a quests_raw.json from
    before it has only the stage's texts and whether any entry completes or fails it, so each text
    takes the stage's flags, and a flagged stage with no text is one entry with none.
    """
    if "entries" in stage:
        return stage["entries"]
    flags = {k: True for k in ("completes", "fails") if stage.get(k)}
    texts = [t for t in stage.get("log", []) if t]
    if not texts:
        return [{"text": "", **flags}] if flags else []
    return [{"text": t, **flags} for t in texts]


def stages_of(q):
    """A quest's stages with log entries: [{ index, log: [{ text, completes, fails, when }] }], in order."""
    out = []
    for st in sorted(q.get("stages", []), key=lambda s: s.get("index", 0)):
        log = [{"text": e.get("text", ""), **{k: e[k] for k in ("completes", "fails", "when") if e.get(k)}} for e in entries_of(st)]
        if log:
            out.append({"index": st["index"], "log": log})
    return out


def endings_of(stages):
    """The log entries that complete or fail the quest, in stage order, each with its stage."""
    return [{"stage": st["index"], **e} for st in stages for e in st["log"] if e.get("completes") or e.get("fails")]


def build_quests(lines, quests_raw, givers_raw):
    """The curated lines (questlines.curate) -> the quests.json lines, in curation order."""
    by_id = {q["id"]: q for q in quests_raw}
    givers = {g["id"]: g for g in givers_raw}
    by_edid = {q["edid"]: q["id"] for q in quests_raw}
    out = []
    for line in lines:
        item = {k: line[k] for k in ("id", "name", "category", "also", "prince", "where", "opening", "begins", "beginsFrom", "after", "checked") if k in line}
        # Instructions a player acts on (how it starts, what it needs) show only when they were read
        # from the files in this load order. Gravewind's mod-page "walk in" was wrong in LoreRim (a
        # LoreRim patch locks the door), so mod-page and player starts and gates stay out until WO-101
        # and WO-102 confirm them. Length and difficulty stay, labelled with where they came from.
        checked = dict(line.get("checked", {}))
        unread = {k for k in ("start", "gate", "note") if k in line and checked.get(k) != "files"}
        for k in ("start", "gate", "minLevel", "mainQuestAt", "level", "size", "note"):
            if k not in line or k in unread or (k == "minLevel" and "gate" in unread):
                continue
            item[k] = line[k]
        if "gate" in unread:
            item["after"] = [a for a in line.get("after", []) if a == "main-quest"]
        item["checked"] = {k: v for k, v in checked.items() if k not in unread}
        item["sources"] = [
            {"name": source_name(s["name"]), **({"modid": s["modid"]} if s.get("modid") else {}), **({"base": True} if s["name"] == "Skyrim" else {})}
            for s in line["sources"]
        ]
        opening = givers.get(by_edid.get(line["opening"]))
        giver = giver_of(opening)
        if giver:
            item["giver"] = giver
        fo = (opening or {}).get("firstObjective")
        if fo and fo.get("namesWhoOrWhere") and fo.get("filled"):
            item["firstObjective"] = fo["filled"]
        quests = []
        for lq in line["quests"]:
            q = by_id[lq["id"]]
            rw = (givers.get(q["id"]) or {}).get("rewards", [])
            rewards = {}
            tier = gold_tier(rw)
            if tier:
                rewards["gold"] = tier
            items = reward_items(rw)
            if items:
                rewards["items"] = items
            stages = stages_of(q)
            quests.append(
                {
                    "edid": q["edid"],
                    "name": q["name"],
                    "type": q.get("type"),
                    "xp": xp_for(q.get("type")),
                    "journal": journal(q),
                    "stages": stages,
                    "endings": endings_of(stages),
                    "objectives": [o["text"] for o in sorted(q.get("objectives", []), key=lambda o: o.get("index", 0)) if o.get("text")],
                    **({"rewards": rewards} if rewards else {}),
                }
            )
        item["quests"] = quests
        item["xpTotal"] = sum(q["xp"] for q in quests)
        out.append(item)
    return out
