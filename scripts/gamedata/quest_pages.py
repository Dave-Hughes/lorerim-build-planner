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
                 (gold tier, weapons and armour), and start (WO-115: from the start check's results in
                 gamedata/<version>/story_checks, { needs, who, where, task, ways, checked: "files" | "not
                 yet" }; a line not checked yet, or a quest the check couldn't trace, is "not yet")
Every text has the game's tags filled (WO-115): <Alias=...> from the quest's `fills` (quests.py, from the
records), <Global=...> from the globals' values, a run-time date as "the set date", and an alias the records
don't fill in plain words ("the item").
  xpTotal        the line's quest XP
"""
import json
import os
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


_HOLDING = re.compile(r"\b(holder|holding|storage|dummy|test)\b", re.IGNORECASE)  # a cell a script keeps someone in
# A whole worldspace isn't a place a player can find ("Skyrim" for Markarth Side's Grit-dar).
_WORLDS = {"skyrim", "tamriel"}


def clean_place(text):
    """
    A place a player can find (WO-121a), from "cell, location": no holding cell, no worldspace, and each name
    once ("Blue Palace, The Blue Palace" -> "Blue Palace"); None when nothing is left.
    """
    out, seen = [], set()
    for p in (text or "").split(", "):
        p = p.strip()
        # "Largashbur's Longhouse" is "Largashbur Longhouse"; "Temple Location" is "Temple".
        key = re.sub(r" location$", "", re.sub(r"'s\b", "", re.sub(r"^the ", "", p.lower())))
        if not p or _HOLDING.search(p) or key in _WORLDS or key in seen:
            continue
        seen.add(key)
        out.append(p)
    return ", ".join(out) or None


def place_of(where):
    """ "Riverwood Trader, Riverwood" from a giver's first placed reference; None when it has no names."""
    if not where:
        return None
    w = where[0]
    # A holding cell is where a script keeps someone until it moves them in (Lurius Liore sits in
    # the Wyrmstooth Holder Cell, but you meet him at the Bannered Mare): no place is better.
    if _HOLDING.search(w.get("cellName") or ""):
        return None
    return clean_place(", ".join(p for p in (w.get("cellName"), w.get("location")) if p))


def is_role(name):
    """A role, not a person (WO-121a): "Courier", "Windhelm Guard"."""
    words = (name or "").lower().split()
    return bool(words) and (" ".join(words) in ROLES or words[-1] in ROLES)


def towns_of(givers_raw, starts_raw=None):
    """
    Each cell's town, for telling a town's rumour (WO-121a): {cell name: location} from every placed person in
    quest_givers_raw.json, then a house's key ("Key to Brina's House" on a door into Dawnstar) from quest_starts_raw.json.
    """
    towns = {}

    def walk(o, f):
        if isinstance(o, dict):
            f(o)
            for v in o.values():
                walk(v, f)
        elif isinstance(o, list):
            for v in o:
                walk(v, f)

    def placed(o):
        if isinstance(o.get("cellName"), str) and isinstance(o.get("location"), str) and o["cellName"] != o["location"]:
            towns.setdefault(o["cellName"], o["location"])

    def door(o):
        key = ((o.get("lock") or {}).get("keyName") or "")
        if key.startswith("Key to ") and isinstance(o.get("intoName"), str) and o["intoName"] != key[7:]:
            towns.setdefault(re.sub(r"^the ", "The ", key[7:]), o["intoName"])

    walk(givers_raw, placed)
    walk(starts_raw or {}, door)
    return towns


def brought_to(entry, towns):
    """
    The town a quest's own location alias names (WO-121b Part 4): "DawnstarLocation" is Dawnstar, when Dawnstar is a town
    the planner knows. None for none.
    """
    known = set(towns.values())
    for p in (entry or {}).get("people", []):
        a = p.get("alias") or ""
        if p.get("npc") is None and a.endswith("Location"):
            name = re.sub(r"(?<=[a-z])(?=[A-Z])", " ", a[: -len("Location")]).strip()
            if name in known:
                return name
    return None


def giver_of(entry):
    """The opening quest's named giver as { name, place }, or None for no giver or a role (Courier)."""
    g = (entry or {}).get("namedGiver")
    if not g or not g.get("name"):
        return None
    name = g["name"].strip()
    if is_role(name):
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


# Outcomes that change a run (WO-129 Part 6), read from a completing ending's journal line: a mount kept, a house owned,
# someone who'll follow, a lot of gold. Tight on purpose: a miss is better than a false promise, and overrides.json
# questRewards holds the hand-checked ones the ending's own line doesn't say (Running Wild keeps the horse at 40 and 41;
# only stage 30 says so).
_CHANGES = [
    ("mount", re.compile(r"\b(?:keep|kept)\b[^.]*\b(?:horse|mount|steed)\b|\b(?:horse|steed)\b[^.]*\b(?:for myself|my own|is mine|to keep)\b", re.I)),
    ("house", re.compile(r"\b(?:bought|purchased)\b[^.]*\b(?:house|home|lodge|manor|homestead|estate|deed)\b|\bI am now (?:its|it's) owner\b|\b(?:house|home|lodge|manor)\b[^.]*\b(?:is mine|is now mine)\b", re.I)),
    ("follower", re.compile(r"\boffered (?:his|her|their) services as a (?:companion|follower)\b|\boffered to travel with me\b|\bwill (?:now )?(?:follow|travel with) me\b|\bhappy to (?:join|travel with|accompany) me\b", re.I)),
    ("gold", re.compile(r"\b(?:paid in gold|a (?:handsome|large) (?:sum|reward)|a lot of gold|\d{3,}[\d,]* (?:gold|septims))\b", re.I)),
]


def changes_of(endings, checked=None):
    """
    What a quest's endings hand over that changes a run (WO-129 Part 6): [{kind, stage, text, only?}], text the ending's
    journal line. only: one ending gives it and another doesn't, so the player chooses. `checked` (overrides.json
    questRewards) replaces the reading for a quest whose endings don't say it themselves, each with the stage text (from,
    fromText) that does.
    """
    if checked is not None:
        return [{k: v for k, v in c.items() if not k.startswith("_")} for c in checked]
    done = [e for e in endings if e.get("completes")]
    out = []
    for e in done:
        for kind, pat in _CHANGES:
            if pat.search(e["text"]):
                out.append({"kind": kind, "stage": e["stage"], "text": e["text"]})
    for c in out:
        if len(done) > 1 and sum(1 for x in out if x["kind"] == c["kind"]) < len(done):
            c["only"] = True
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


def ending_when(stage, conditions):
    """
    When an ending happens, as the page reads it after "When": the stage that writes it, and the conditions its log
    entry shows under where the record has any. Most endings have none (1,746 of 1,800 in the 20 Oct crawl): the
    entry shows whenever its stage is set.
    """
    text = f"the quest reaches stage {stage}"
    # A condition named by its editor id, form id, unnamed function or a global's id ("global TTFA_FastredRomance is 1")
    # isn't something a player can read (WO-126): the stage alone. A condition said twice in a row is said once.
    if not conditions or _RECORD_FORM.search(conditions):
        return text
    conditions = once(conditions)
    return text + f", if {conditions[0].lower()}{conditions[1:]}"


# Record text a player can't read: an editor id with an underscore or a Creation Club prefix, a form id, an unnamed
# condition function, a global (WO-121b, Bob's night-run judgement).
_RECORD_FORM = re.compile(r"[A-Za-z]+_[A-Za-z]|\bcc[A-Z]\w*|\.es[mpl]:|\bfn\d+\b|\bglobal ")


def once(text):
    """A condition naming the same thing twice in a row says it once: "GetIsRace Dark Elf == 1 or GetIsRace Dark Elf == 1"."""
    for sep in (" or ", " and "):
        text = sep.join(dict.fromkeys(text.split(sep)))
    return text


def endings_of(stages):
    """The log entries that complete or fail the quest, in stage order, each with its stage and when it happens."""
    return [{"stage": st["index"], **e, "when": ending_when(st["index"], e.get("when"))}
            for st in stages for e in st["log"] if e.get("completes") or e.get("fails")]


# The game's text tags (WO-115): <Alias=Item>, <Alias.PronounObj=Target>, <Global=RoomCost>, <Global.Day=Deadline>.
TAG = re.compile(r"<(Alias|Global)(?:\.(\w+))?=([^<>]+)>", re.IGNORECASE)
_OPEN = re.compile(r"<((?:Alias|Global)(?:\.\w+)?=\w+)(?=[\s,.;:!?)]|$)", re.IGNORECASE)
_DATE = re.compile(r"<Global\.Day=[^<>]+>\s*(?:of\s+)?<Global\.MonthWord=[^<>]+>", re.IGNORECASE)
_NEUTRAL = {"pronoun": "they", "pronouncap": "They", "pronounobj": "them", "pronounobjcap": "Them", "pronounpos": "their",
            "pronounposcap": "Their", "pronounposobj": "theirs", "pronounposobjcap": "Theirs"}


def plain_alias(name):
    """An alias the records fill only at run time, in plain words: Item -> "the item", TargetLocation -> "the target location"."""
    name = re.sub(r"^[A-Za-z]{0,6}\d+", "", name)  # an EDID-like prefix: MS11TargetLocation -> TargetLocation
    words = [w for w in re.findall(r"[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+", name.replace("_", " ")) if not any(ch.isdigit() for ch in w)]
    words = [w.lower() for w in words if w.lower() not in ("alias", "ref", "quest")] or ["one"]
    return "the " + " ".join(words)


_COUNTER = re.compile(r"\s*\(<Global=[^<>]+>\s*/\s*<Global=([^<>]+)>\)", re.IGNORECASE)


def fill_text(text, fills, globals_):
    """
    A text with its tags filled: the quest's own fills (quests.py, from the records), a global's value by its EDID, a
    date the game sets at run time as "the set date", and an alias the records don't fill in plain words.
    """
    if not isinstance(text, str) or "<" not in text:
        return text
    text = _OPEN.sub(r"<\1>", text)  # a tag the record never closes: "Deliver <Alias=Item by ..."
    text = _DATE.sub("the set date", text)
    # A counter whose total the game sets when the job is given reads "(0/0)" from the records (WO-136 ruling 6: the Gather
    # jobs, Retaking Thirsk's rieklings): no counter. One the records set keeps it ("(0/20)").
    text = _COUNTER.sub(lambda m: "" if not globals_.get(m.group(1).strip().lower()) else m.group(0), text)

    def sub(m):
        tag, kind, part, name = m.group(0), m.group(1).lower(), (m.group(2) or "").lower(), m.group(3).strip()
        if tag in fills:
            out = fills[tag]
        elif kind == "global":
            value = globals_.get(name.lower())
            out = {"day": "the set day", "monthword": "the set month"}.get(part) or (f"{value:g}" if isinstance(value, (int, float)) else "the amount the game sets")
        else:
            out = _NEUTRAL.get(part) or plain_alias(name)
        before = m.string[:m.start()].rstrip()
        if out.startswith("the ") and re.search(r"\b(the|a|an|your|my)$", before, re.IGNORECASE):
            out = out[4:]  # "Kill the <Alias=Beast>": the text has its own article
        return out[0].upper() + out[1:] if (not before or before.endswith((".", "!", "?", ":", '"'))) and out[:1].islower() else out

    return TAG.sub(sub, text)


def fill_all(obj, fills, globals_):
    """Every string in a quest's data with its tags filled."""
    if isinstance(obj, dict):
        return {k: fill_all(v, fills, globals_) for k, v in obj.items()}
    if isinstance(obj, list):
        return [fill_all(v, fills, globals_) for v in obj]
    return fill_text(obj, fills, globals_)


def load_checks(folder):
    """The start check's results (story_check.py): {line id: {quest edid: its row}}, for the lines checked so far."""
    out = {}
    if not os.path.isdir(folder):
        return out
    for name in sorted(os.listdir(folder)):
        if name.endswith(".json") and not name.startswith("."):
            data = json.load(open(os.path.join(folder, name), encoding="utf-8"))
            if isinstance(data, dict) and "quests" in data and "line" in data:
                out[data["line"]] = {q["edid"]: q for q in data["quests"]}
    return out


_LEVEL = re.compile(r"\blevel >= (?:[^;()]*?\(now )?(\d+)", re.IGNORECASE)
_UNNAMED = re.compile(r"\bfn\d+\b")


def level_of(text):
    """The level a condition text asks for: 'level >= DLC1VQMinLevel (now 30)' -> 30."""
    m = _LEVEL.search(text or "")
    return int(m.group(1)) if m else None


def plain_needs(conditions, own_name, say=None):
    """
    A condition text (groups joined with '; ') as needs: the level as "Level N", the speaker and the quest's own
    "not started yet" left out (the way in says who; a quest that hasn't started is the point), and a condition the
    reader can't name yet kept and said so. With `say` (Words, WO-126), each need in a player's words, and anything it
    can't word as one UNSAID at the end.
    """
    if say:
        out, unsaid = [], False
        for group in (conditions or "").split("; "):
            w = say.group(group.strip(), own_name)
            unsaid |= w is UNSAID
            if w and w is not UNSAID:
                out.append(w)
        return list(dict.fromkeys(out)) + ([UNSAID] if unsaid else [])
    out = []
    for group in (conditions or "").split("; "):
        g = once(group.strip())
        if not g or g.startswith(("the speaker is", "the speaker isn't")):
            continue
        if own_name and g.startswith(own_name) and re.search(r"(stage <=? \d+|hasn't started|stage \d+ not done|stage == 0)$", g):
            continue
        lv = level_of(g)
        if lv is not None and " or " not in g:
            out.append(f"Level {lv}")
        elif _UNNAMED.search(g):
            out.append(f"a condition the start check can't name yet ({g})")
        else:
            out.append(g)
    return list(dict.fromkeys(out))


def board_way(s):
    """
    A board's start in words, from its places (WO-136): what it is when it has a name, where its copies stand, and the door
    nearest the first when it leads somewhere named ("It starts from Erotic Book in Stuhn Ravine, by the door to Storage
    Room"); never a door "to somewhere in Skyrim", never an editor id. The check's own `plain` when it has no places.
    """
    places = s.get("places") or []
    if not places:
        return s.get("plain") or "It starts from something placed"
    where = list(dict.fromkeys(clean_place(p["where"]) or p["where"] for p in places if p.get("where")))
    doors = [d["door"] for d in (places[0].get("nearDoors") or []) if not d["door"].startswith("somewhere")]
    named = s.get("object")
    text = f"It starts from {named}" if named else "It starts from something placed"
    if where:
        listed = ", ".join(where[:4]) + (f" and {len(where) - 4} more places" if len(where) > 4 else "")
        text += f" {listed}" if listed.startswith("somewhere in ") else f" in {listed}"
    if doors and len(where) == 1:
        text += f", by the door to {doors[0]}"
    return text


def way_of(s, own_name, line_quests):
    """One starter row in player words, and the needs that go with it."""
    if s["by"] == "dialogue":
        who = s.get("speaker") or "someone the records don't name"
        place = clean_place((s.get("speakerPlaced") or [None])[0])
        text = (f"Ask {who} \"{s['prompt']}\"" if s.get("prompt") else f"Talk to {who}") + (f" in {place}" if place else "")
        return text, plain_needs(s.get("conditions"), own_name)
    if s["by"] == "by itself":  # its own script starts it once you're a level (WO-121b)
        return s["plain"], ([f"Level {s['level']}"] if s.get("level") else [])
    if s["by"] == "book":  # reading it starts the quest (WO-121b: Deathbrand)
        return s["plain"], []
    if s["by"] == "board":  # a notice board or radiant dispatcher starts it (WO-136), in words from its places
        return board_way(s), []
    if s["by"] == "story manager":
        return f"It starts by itself on {s.get('event') or 'a story event'}", plain_needs(s.get("conditions"), own_name)
    if s["by"] == "quest script":
        edid = (s.get("quest") or "").split(" ")[0].rstrip(",")
        if edid in line_quests:
            return f"After {line_quests[edid]}" + (f" (its stage {s['atStage']})" if s.get("atStage") is not None else ""), []
        ups = [way_of(u, own_name, line_quests) for u in s.get("throughStartedBy", []) if u["by"] != "quest script" or u.get("quest")]
        named = (s.get("quest") or edid).split(",")[0]
        if s.get("plain"):  # the start check's words for a helper with a story manager trigger (WO-121a)
            return s["plain"], node_needs(s, own_name)
        # One way up: its needs are this way's (Dawnguard's helper starts on a node that needs level 30). More than
        # one (Dragonborn's two cultist nodes): each keeps its own needs in the text.
        if len(ups) == 1:
            return f"Through {named}, which starts from: {ups[0][0]}", ups[0][1]
        texts = list(dict.fromkeys(t + (f" ({', '.join(n)})" if n else "") for t, n in ups))
        return f"Through {named}" + (f", which starts from: {'; or '.join(texts)}" if texts else ""), []
    return "It runs from the start of the game", []


# ---- quest starts in players' words (WO-126) ------------------------------------------------------------------------

# What a way gets for a condition the planner can't word yet: never the record's form, which stays in `raw`.
UNSAID = "a condition the planner can't put in words yet"
# The functions the start check couldn't name (it writes fn<index>), by the game's index, that only say where the speaker
# stands or what they're doing as the line plays (GetInCurrentLoc 359, IsInDialogueWithPlayer 249, IsInCombat 289,
# GetDistance 1, a persuasion's outcome 654/655...): a player never acts on these, so they're left out, not flagged.
_MOMENT = {1, 32, 35, 67, 136, 159, 230, 248, 249, 286, 289, 300, 310, 327, 359, 360, 562, 565, 644, 654, 655}
# The playable races by their Skyrim.esm form, a vampire's with its race.
_RACES = {"013740": "Argonian", "013741": "Breton", "013742": "Dark Elf", "013743": "High Elf", "013744": "Imperial", "013745": "Khajiit",
          "013746": "Nord", "013747": "Orc", "013748": "Redguard", "013749": "Wood Elf", "08883D": "Dark Elf", "0A82B9": "Orc"}
# The story manager's events (story_check.py's EVENTS, and a code it has no word for) as the start reads them.
_EVENT_WORDS = {"change location": "as you travel", "kill": "when you kill someone", "script event": "when another part of the game sets it off",
                "level up": "when you level up", "dialogue": "when someone talks to you", "favour": "when you do someone a favour",
                "quest start": "when another quest starts", "location loaded": "when a place loads around you",
                "relationship change": "when someone's feelings about you change", "arrest": "when you're arrested",
                "item added": "when you pick something up", "ASSU": "when someone is attacked"}
# A line that turns the job down or ends the talk (WO-126 Part 2, WO-130): never a way in. "No, I haven't seen Varona." answers
# and carries on, so it isn't one; "Let her enjoy herself. Nothing wrong with that." and "...Take care now! Bye!" are.
_DECLINES = re.compile(r"\(Skip Quest\)|not interested|can't do that right now|don't have time|^No way\b|no such thing|not right now|^No, thanks|"
                       r"waste of time|don't like your attitude|^No\.$|^Sorry\. We don't have time|"
                       r"\bno part of\b|can't help you right now|^No, not really\b|Nothing wrong with that|\bBye!?\s*$|\(Forced Good ?bye\)", re.IGNORECASE)
# An editor id: a word with a capital, digit or underscore inside (APS_MQSkipKeep, aaaHOTRDialogue, DA08, MSNStart).
_EDID = re.compile(r"^(?=\w*[\d_]|\w+[A-Z])\w+$")
# A quest's record name that is a helper's, not one a player sees in their journal ("Riften Maul Dialogue", "Katana Tracker"),
# or a patch's catch-up for an old save ("Retroactive fixes for 1.2", the Unofficial Patch's): never a way in.
_HELPER = re.compile(r"\b(Handler|Controller|Tracker|Quests?|Dialogue|Misc|Retroactive)\b")
_OPS = {"==": lambda a, b: a == b, "!=": lambda a, b: a != b, ">=": lambda a, b: a >= b, ">": lambda a, b: a > b, "<=": lambda a, b: a <= b, "<": lambda a, b: a < b}


def plain_name(name):
    """A quest's name a player sees in their journal: no editor id in it ("VS Varla", "MSNStart"), no tag, no helper's name."""
    return bool(name) and "<" not in name and not _HELPER.search(name) and not _RECORD_FORM.search(name) and not any(_EDID.match(w) for w in name.split())


def _value(v):
    """A compared value as a number: '25', or a global's 'CWSons (now 2)' -> 2; None for none."""
    m = re.search(r"\(now ([-\d.]+)\)\s*$", v) or re.fullmatch(r"\s*(-?[\d.]+)\s*", v)
    return float(m.group(1)) if m else None


def _race(what):
    """A race the check names by its form ("Skyrim.esm:013747") or, since WO-121b's rerun, by name ("Orc"); None for another."""
    what = (what or "").strip()
    return what if what in _RACES.values() else _RACES.get(what.split(":")[-1])


def _a(word):
    return ("an " if word[:1] in "AEIOU" else "a ") + word


def _the(name):
    return name if name.lower().startswith("the ") else "the " + name


def tidy(needs):
    """A way's needs once each, with UNSAID last ("and a condition ..." after the others)."""
    unsaid = any(n in (UNSAID, f"and {UNSAID}") for n in needs)
    out = list(dict.fromkeys(n for n in needs if n not in (UNSAID, f"and {UNSAID}")))
    return out + ([f"and {UNSAID}" if out else UNSAID] if unsaid else [])


class Words:
    """
    The start check's conditions in a player's words (WO-126), with every quest's steps from quests_raw.json for a stage
    test on another quest. A part is a str, None (left out: the speaker, the moment, plumbing) or UNSAID.
    """

    def __init__(self, quests_raw=(), globals_=None):
        self.by_name, self.by_edid = {}, {}
        for q in quests_raw:
            self.by_edid[q["edid"].lower()] = q
            if q.get("name"):
                self.by_name.setdefault(q["name"].lower(), q)
        self.globals = globals_ or {}

    # -- another quest's stage --
    def _quest(self, name):
        return self.by_name.get((name or "").lower())

    def _first(self, q):
        at = [o["index"] for o in q.get("objectives", []) if o.get("text")] + [s["index"] for s in q.get("stages", []) if any(e.get("text") for e in entries_of(s))]
        return min(at) if at else 0

    def step(self, name, n, exact=False):
        """The step another quest shows at stage n: its objective there, else (unless exact) the last before it, else that stage's short log line."""
        q = self._quest(name)
        if not q:
            return None
        objs = sorted((o for o in q.get("objectives", []) if o.get("text") and not _PLACEHOLDER.fullmatch(o["text"])), key=lambda o: o.get("index", 0))
        pick = next((o for o in objs if o.get("index") == n), None) or (None if exact else next((o for o in reversed(objs) if o.get("index", 0) < n), None))
        text = pick["text"] if pick else next((e["text"] for s in q.get("stages", []) if s["index"] == n for e in entries_of(s) if e.get("text") and len(e["text"]) <= 100), None)
        return _OPTIONAL.sub("", fill_text(text, q.get("fills", {}), self.globals)).strip() if text else None

    def _completes(self, name, n):
        q = self._quest(name)
        return bool(q) and any(e.get("completes") for s in q.get("stages", []) if s["index"] == n for e in entries_of(s))

    def stage(self, name, op, n):
        """A stage test on another quest: "After "<its step>" in <quest>", "While <quest> is under way", "Before <quest> starts"..."""
        q = self._quest(name)
        first = self._first(q) if q else 0
        if op in (">=", ">", "done"):
            if self._completes(name, n):
                return f"After {name}"
            if n <= first:
                return f"Once {name} has started"
            text = self.step(name, n)
            return f'After "{text}" in {name}' if text else f"Once {name} is under way"
        if op in ("<", "<=", "not done"):
            if n <= first:
                return f"Before {name} starts"
            text = self.step(name, n, exact=True)
            return (f'Before you get past "{text}" in {name}' if op == "<=" else f'Before "{text}" in {name}') if text else f"Early in {name}"
        if op == "==":
            if n <= 0:
                return f"Before {name} starts"
            text = self.step(name, n)
            return f'While {name} is at "{text}"' if text else f"While {name} is under way"
        if op == "!=":
            if n <= 0:
                return f"Once {name} has started"
            text = self.step(name, n, exact=True)
            return f'Unless {name} is at "{text}"' if text else UNSAID
        return UNSAID

    def after(self, name, at):
        """A way in from another of the line's quests: after it, or after the step its starting stage shows."""
        return f"After {name}" if at is None else self.stage(name, ">=", at)

    # -- one condition --
    def part(self, p, own):
        if not p or p.startswith("the speaker "):
            return None
        lv = level_of(p)
        if lv is not None:
            return f"Level {lv}"
        if p.startswith("level "):
            return UNSAID
        m = re.fullmatch(r"fn(\d+) \S+ .+", p)
        if m:
            return None if int(m.group(1)) in _MOMENT else UNSAID
        # The moment's tests the start check now names (WO-121b): where someone is, the kind of place, a distance, a cell.
        if p.startswith(("you're in ", "you're not in ", "the place is ", "the place isn't ", "the place has ", "the place hasn't ")) or \
                re.match(r"(GetDistance|GetDisabled|GetInCell) ", p):
            return None
        m = re.fullmatch(r"the player has (at least|more than) (?:.*?\()?(\d+)\)? gold", p)
        if m:
            return f"You have {int(m.group(2)) + (m.group(1) == 'more than')} gold"
        m = re.fullmatch(r"the place you (enter|leave) (is|isn't|is a|isn't a) (.+)", p)
        if m:
            return f"When you {m.group(1)} {m.group(3)}" if m.group(2) == "is" else None
        if p.startswith("GetEventData "):  # a story event's keyword filter: plumbing
            return None
        if p.startswith("GetRandomPercent "):
            return "Sometimes"
        m = re.fullmatch(r"(Get\w+)(?: (.+?))? (==|!=|>=|>|<=|<) (.+)", p)
        if m:
            return self._function(m.group(1), m.group(2), m.group(3), m.group(4))
        m = re.fullmatch(r"global (\S+) (==|!=|>=|>|<=|<) (.+?) \(now ([-\d.]+)\)", p)
        if m:
            if "GameDaysPassed" in p:
                return "After some days have passed"
            want = _value(m.group(3))
            # A setting that already holds (a mod's switch that's on) is plumbing; one that doesn't waits on something unsaid.
            return None if want is not None and _OPS[m.group(2)](float(m.group(4)), want) else UNSAID
        m = (re.fullmatch(r"(.+) stage (\d+) (done|not done)", p) or re.fullmatch(r"(.+?) (not completed|completed|hasn't started)", p)
             or re.fullmatch(r"(.+) stage (==|!=|>=|>|<=|<) (.+)", p))
        if m:
            name = m.group(1)
            if name == own:  # its own stage only guards a repeat or its own flow
                return None
            if not plain_name(name):
                return UNSAID
            if m.re.pattern.startswith("(.+?) (not completed"):
                return {"completed": f"After {name}", "not completed": f"Before you finish {name}", "hasn't started": f"Before {name} starts"}[m.group(2)]
            if m.group(3) in ("done", "not done"):
                return self.stage(name, m.group(3), int(m.group(2)))
            n = _value(m.group(3))
            return UNSAID if n is None else self.stage(name, m.group(2), int(n))
        return UNSAID

    def _function(self, fn, what, op, val):
        n = _value(val)
        yes = (op == "==" and n == 1) or (op == "!=" and n == 0)
        if fn == "GetItemCount":
            if not what or n is None or _EDID.match(what) or "<" in what:
                return UNSAID
            if (op in ("==", "<=") and n == 0) or (op == "<" and n == 1):
                return f"You don't have {what}"
            if op == "<":
                return f"You have fewer than {n:g} {what}"
            need = n + (op == ">")
            return (f"You have {what}" if need <= 1 else f"You have {need:g} {what}") if op in (">=", ">", "==") and need >= 1 else UNSAID
        if fn == "GetInFaction":
            # A faction with no name a player sees (a job, a crime or dialogue faction) is the speaker's plumbing.
            if not what or " " not in what or re.search(r"Faction|[(:]", what):
                return None
            return f"You're in {_the(what)}" if yes else f"You're not in {_the(what)}"
        if fn == "GetDead":
            if what:
                return f"{what} is alive" if not yes else f"{what} is dead"
            return None if not yes else UNSAID  # on the speaker: a dead person doesn't talk
        if fn == "GetIsRace":
            race = _race(what)
            return (f"You're {_a(race)}" if yes else f"You're not {_a(race)}") if race else UNSAID
        if fn == "GetQuestRunning":
            if not plain_name(what):
                return UNSAID
            return f"While {what} is under way" if yes else f"Unless {what} is under way"
        if fn == "GetActorValue" and op in (">=", ">") and re.match(r"Speech\w+ \(now", val or ""):
            return f"Speech {n:g}"  # a persuasion's check
        return UNSAID

    # -- a group of conditions, any one of which will do --
    def group(self, g, own):
        if not g:
            return None
        parts = [p.strip() for p in g.split(" or ")]
        if all(p.startswith("fn18 ") for p in parts):  # GetCurrentTime
            later = [_value(p.split(" ", 2)[2]) for p in parts if " > " in p]
            return "At night" if later and later[0] >= 18 else UNSAID
        races = [re.fullmatch(r"GetIsRace (.+?) (==|!=) (\d)", p) for p in parts]
        if len(parts) > 1 and all(races):
            names = [_race(m.group(1)) for m in races]
            yes = {(m.group(2) == "==") == (m.group(3) == "1") for m in races}
            if None in names or len(yes) > 1:
                return UNSAID
            said = " or ".join(_a(r) for r in dict.fromkeys(names))
            return f"You're {said}" if yes.pop() else f"You're not {said}"
        words = [self.part(p, own) for p in parts]
        if UNSAID in words or (None in words and any(words)):
            return UNSAID
        said = list(dict.fromkeys(w for w in words if w))
        # "You're in the Blood-Kin of the Orcs or an Orc", not "... or You're an Orc".
        rest = [w[len("You're "):] if said and said[0].startswith("You're ") and w.startswith("You're ") else w for w in said[1:]]
        # "Once Dragonborn has started or early in The Way of the Voice".
        rest = [w[0].lower() + w[1:] if re.match(r"(Once|Early|Before|After|While|Unless|When|Sometimes|At) ", w) else w for w in rest]
        return " or ".join(said[:1] + rest) if said else None

    # -- a way in --
    def event(self, text):
        """ "It starts by itself on change location." -> "It starts by itself as you travel." """
        text = re.sub(r" on ([\w ]+)\.?$", lambda m: f" {_EVENT_WORDS.get(m.group(1), 'when something in the game sets it off')}", text or "")
        return text[:-1] if text.endswith(".") else text

    def node(self, s, own):
        """A story manager node as a way: the place you enter when it names one, else its event, with its needs."""
        place = _place_you_enter(s.get("conditions"))
        how = "It starts by itself " + ("when you walk into any inn" if place == "any inn" else f"when you enter {place}" if place else
                                         _EVENT_WORDS.get(s.get("event"), "when something in the game sets it off"))
        needs = plain_needs(s.get("conditions"), own, self)
        return how, [n for n in needs if not (place and n.startswith("When you enter"))]

    def helper(self, s):
        """A helper quest's name in the game: its record's full name, never an editor id; None for none."""
        named = re.search(r'named "([^"]+)"', s.get("quest") or "")
        edid = (s.get("quest") or "").split(" ")[0].rstrip(",")
        name = named.group(1) if named else (self.by_edid.get(edid.lower()) or {}).get("name")
        return name if plain_name(name) else None


# The Unofficial Patch's quests that bring an old save up to date (USKPRetroactive130, USKPVersionTracking,
# Patch1_9_UpdateQuest): they set a quest's stage for a save made before a fix, never a way a player starts it. Nor is
# Dragonborn's "Init quest" (DLC2Init), which gets Solstheim's quests running (Bob, 22 Oct: Thirsk Mead Hall, Neloth).
_PATCH = re.compile(r"^(USKP\w*|Patch\d+_\d+_UpdateQuest|DLC2Init)$")


def patch_helper(s):
    return s["by"] == "quest script" and bool(_PATCH.match((s.get("quest") or "").split(" ")[0].rstrip(",")))


def talks_through(s, line_quests, giver):
    """
    A helper that is someone's dialogue ("aaaHOTRDialogue"), or one that holds the giver's own alias ("with RalfornAlias")
    and that the check can't open, or that runs from the start of the game and starts the quest from a stage of its own
    (WO-121b Part 4; Bob, 22 Oct: Mjoll's aaMjollAerinQIntro reaches stage 20 on your "Let's go." with Mjoll and Aerin).
    """
    edid = (s.get("quest") or "").split(" ")[0].rstrip(",")
    first_name = (giver or {}).get("name", "").split(" ")[0]
    ups = s.get("throughStartedBy") or []
    opens = not ups or (s.get("atStage") is not None and all(u["by"] == "start game" for u in ups))
    return s["by"] == "quest script" and edid not in line_quests and (
        edid.endswith("Dialogue") or bool(first_name and opens and re.search(rf"\bwith \w*{re.escape(first_name)}\w*", s.get("quest") or "")))


def way_words(s, own, line_quests, say, giver=None):
    """
    One starter in a player's words (WO-126): [(how, needs)], none for a line that turns the quest down, a helper's own
    script that starts it from the quest itself, or a helper with no name a player could know (a patch's catch-up quest).
    A helper is what starts it ("Talk to Ralforn in Green-Tip Cabin", "It starts by itself when you enter Helgen"), or its
    record's full name.
    """
    if s["by"] == "dialogue":
        prompt = s.get("prompt") or ""
        if _DECLINES.search(prompt):
            return []
        # A line with no words, or one the game never shows ("(Invisible Continue)"), is just talking to them.
        bare = re.fullmatch(r"[.\s…]*|\(Invisible Continue\)", prompt, re.IGNORECASE) or _EDID.match(prompt)  # or a topic's editor id
        who = s.get("speaker")
        if who and is_role(who):  # "Talk to a courier", "a Windhelm guard"
            who = _a(" ".join(who.split()[:-1] + [who.split()[-1].lower()]))
        text, _ = way_of({**s, "speaker": who, **({"prompt": None} if bare else {"prompt": prompt.replace("<BribeCost>", "some")})}, own, line_quests)
        return [(text, plain_needs(s.get("conditions"), own, say))]
    if s["by"] == "by itself":
        return [(say.event(s["plain"]), [f"Level {s['level']}"] if s.get("level") else [])]
    if s["by"] == "book":  # reading it starts the quest: the check's own words
        return [(s["plain"], [])]
    if s["by"] == "board":  # a notice board or radiant dispatcher (WO-136), in words from its places
        return [(board_way(s), [])]
    if s["by"] == "story manager":
        return [say.node(s, own)]
    if s["by"] != "quest script" or patch_helper(s):
        return []
    edid = (s.get("quest") or "").split(" ")[0].rstrip(",")
    if edid in line_quests:
        return [] if line_quests[edid] == own else [(say.after(line_quests[edid], s.get("atStage")), [])]
    if s.get("plain"):
        # The trigger's own needs come with it (WO-137 item 1): Deathbrand's level-up node needs a level held in a global.
        return [(say.event(s["plain"]), node_needs(s, own, say))]
    name = say.helper(s)
    # A helper that's a quest a player knows is that quest ("Through The Book of Love"), even when it holds the giver.
    if giver and not name and talks_through(s, line_quests, giver):
        return [(f"Talk to {giver['name']}" + (f" in {giver['place']}" if giver.get("place") else ""), [])]
    ups = [w for u in s.get("throughStartedBy", []) if u["by"] != "start game" and (u["by"] != "quest script" or u.get("quest"))
           for w in way_words(u, own, line_quests, say, giver)]
    if ups:
        return ups
    return [(f"Through {name}", [])] if name else []


def town_of(place, towns):
    """The town a speaker stands in: their cell's town, else the place's own location ("Windpeak Inn, Dawnstar")."""
    if not place:
        return None
    cell, _, location = place.partition(", ")
    return towns.get(cell) or location or None


def rumours(shown, towns):
    """
    Talks by three or more people in three or more places in one town are a rumour (WO-121a): one way, "Hear people
    in Dawnstar talk about it", with the needs they all share and no one person, in the place of the first of them.
    """
    by_town = {}
    for w in shown:
        if w.get("who"):
            town = town_of(w.get("where"), towns)
            if town:
                by_town.setdefault(town, []).append(w)
    out = []
    for w in shown:
        # Around the town, not one hall: the Companions asked in Jorrvaskr are six ways to join, not a rumour.
        town = next((t for t, ws in by_town.items() if w in ws and len({x["who"] for x in ws}) >= 3 and len({x["where"] for x in ws}) >= 3), None)
        if not town:
            out.append(w)
        elif not any(x.get("rumour") == town for x in out):
            ws = by_town[town]
            common = [n for n in ws[0].get("needs", []) if all(n in x.get("needs", []) for x in ws)]
            out.append({"how": f"Hear people in {town} talk about it", **({"needs": common} if common else {}), "where": town, "rumour": town})
    return out


def first_step(row, siblings):
    """
    The row whose first objective the player sees first (WO-121a): when the talk that starts a quest sets a stage
    before the quest shows anything, and the same talk starts one of the line's other quests at a stage that shows its
    objective (Dengeir's "I will see that Vighar is destroyed." sets Dark Ancestor's stage 10, which shows nothing, and
    starts FreeformFalkreathQuest03B, whose stage 10 shows "Destroy the vampire Vighar"), that quest's; else the row's own.
    """
    shows_at = row.get("firstObjectiveStage")
    for s in row.get("startedBy", []):
        m = re.fullmatch(r"SetStage (\d+)", s.get("call") or "")
        if s["by"] != "dialogue" or not m or shows_at is None or int(m.group(1)) >= shows_at:
            continue
        for other in (siblings or {}).values():
            if other is row or not (other.get("firstObjective") or {}).get("text"):
                continue
            for t in other.get("startedBy", []):
                n = re.fullmatch(r"SetStage (\d+)", t.get("call") or "")
                if t.get("info") == s.get("info") and n and other.get("firstObjectiveStage") is not None and other["firstObjectiveStage"] <= int(n.group(1)):
                    return other
    return row


_STAGE_SET = re.compile(r"^SetStage (\d+)$")
_OPTIONAL = re.compile(r"^\(optional\)", re.IGNORECASE)
# A mod author's placeholder objective (WO-121b Part 4: Whiterun, expanded's "TEST"), never shown as a step.
_PLACEHOLDER = re.compile(r"\s*(test|todo|tbd|placeholder|x{3,}|\.+|-+)\s*", re.IGNORECASE)
# The player's race: a faction condition may be the speaker's (Mralki's JobInnkeeperFaction), a race one is the player's.
_PLAYER_IS = re.compile(r"\bGetIsRace\b[^;]*== 1")


def node_needs(s, own, say=None):
    """The needs of the story manager nodes a helper starts from (WO-137 item 1): "Level 20" for a level held in a global."""
    return list(dict.fromkeys(n for u in s.get("throughStartedBy", []) if u["by"] == "story manager" for n in plain_needs(u.get("conditions"), own, say)))


def continues(s, own, edid, shows_at):
    """
    A talk that needs its own quest already past the stage where its first objective shows (WO-121b rule 6): a later
    step, not a start. Battle of the Champions' Legate needs stage 20, past its 10; Sam Guevenne's lines need DA14Start
    at 60, past its 20. Falk Firebeard's needs The Wolf Queen Awakened at 10, which its letter sets before anything
    shows (its first objective is at 50), so he still starts it.
    """
    names = "|".join(re.escape(n) for n in {own, edid} if n)
    if s["by"] != "dialogue" or not names:
        return False
    # The stage the line itself sets: a line that needs a later stage of its own quest is a catch-up (WO-137 item 1:
    # Geldis Sadri sets Deathbrand's 1 but needs its 20 done, a mod's edit for a quest already under way).
    sets = _STAGE_SET.match(s.get("call") or "")
    for g in (s.get("conditions") or "").split("; "):
        m = re.fullmatch(rf"(?:{names}) stage (?:(==|>=|>) (\d+)|(\d+) done)", g.strip())
        if not m:
            continue
        n = int(m.group(2) or m.group(3))
        if (shows_at is not None and n >= shows_at) or (sets and n > int(sets.group(1)) and n > 0):
            return True
    return False


def asks_who_you_are(s):
    """A talk only for players of some races (WO-121b rule 5): an Orc for The Cursed Tribe's letter. A way, never the giver."""
    return s["by"] == "dialogue" and bool(_PLAYER_IS.search(s.get("conditions") or ""))


def stage_step(row, objectives, sets):
    """
    The first step as the player sees it (WO-121b rules 1 and 2), when it isn't the check's lowest-numbered objective.
      1. The starting line's stage: the objective that stage's own fragment shows (the check's objectivesShown), from
         the lowest stage a talk that starts it sets. Danica's line sets 20, which shows "Retrieve Nettlebane"; the
         guard's sets 10, "Question the witnesses".
      2. A required objective beats an optional one shown at the same stage: "Defeat Vals Veran", not "(Optional)
         Protect Golldir". A check from before objectivesShown reads it from the stage's own number.
    None to keep the check's first objective.
    """
    first = row.get("firstObjective") or {}
    texts = {o["index"]: o["text"] for o in objectives or [] if o.get("text")}
    shown = {int(i): st for i, st in (row.get("objectivesShown") or {}).items()}
    if shown and sets:
        # Only for a talk that starts it: a quest a node or helper starts reads its first step from the stage's own number
        # below (The Pale Lady and Sleepwalking keep theirs; Heart of the Reach's 10 is "Travel to Ever-Bog"), and one running
        # from the start of the game whose first objective no fragment of its own shows keeps it (Innocence Lost's "Talk to
        # Aventus Aretino") (the night run, WO-121b).
        if first.get("index") not in shown and any(s["by"] == "start game" for s in row.get("startedBy", [])):
            return None
        at = min(sets)
        here = sorted(i for i, st in shown.items() if st == at and i in texts)
        if not here and first.get("index") in shown:  # the talk's stage shows nothing: the stage that shows the first objective (Golldir's 5, then 10)
            here = sorted(i for i, st in shown.items() if st == shown[first["index"]] and i in texts)
        pick = next((i for i in here if not _OPTIONAL.match(texts[i])), here[0] if here else None)
        return {"index": pick, "text": texts[pick]} if pick is not None and pick != first.get("index") else None
    at = row.get("firstObjectiveStage")
    if _OPTIONAL.match(first.get("text") or "") and at in texts and not _OPTIONAL.match(texts[at]):
        return {"index": at, "text": texts[at]}
    return None


def _node_of(s):
    """The story manager node a starter comes from: itself, or the one under a helper quest."""
    if s["by"] == "story manager":
        return s
    return next((u for u in s.get("throughStartedBy", []) if u["by"] == "story manager"), None)


def _place_you_enter(conditions):
    """Where a node fires, from its conditions: "any inn" for a habitation, else the places it names; None for none."""
    for g in (conditions or "").split("; "):
        places = re.findall(r"the place you enter is (?!n't)([^;]+?)(?= or |$)", g)
        if places:
            return "any inn" if any(p.strip() in ("a habitation", "an inn") for p in places) else ", ".join(p.strip() for p in places[:-1]) + (" or " if len(places) > 1 else "") + places[-1].strip()
    return None


def finds_you(starters, own, edid, shows_at, towns, brings=None, say=None):
    """
    When the quest finds you (WO-121b rule 3): a node or a messenger starts it, and its person comes to you. The person
    is the one named speaker (never a role), when they wait in a holding cell (Theodyn Bienne), when the node fires on
    entering places they aren't in (the Ebony Warrior, in five cities, not his camp), or when it fires in any inn and
    every line of theirs comes after the start (Sam Guevenne); or "A messenger" when the helper quest has one
    (Dawnguard). A bounty that fires on entering Falkreath, where its giver is, isn't one. Its way: "<person> comes to
    find you in <place>", with the node's needs and the person's level. None when nothing finds you.
    """
    nodes = [(s, _node_of(s)) for s in starters]
    nodes = [(s, n) for s, n in nodes if n]
    if not nodes:
        return None
    talks = [s for s in starters if s["by"] == "dialogue" and s.get("speaker") and not is_role(s["speaker"])]
    named = list(dict.fromkeys(s["speaker"] for s in talks))
    place = next((p for _, n in nodes for p in [_place_you_enter(n.get("conditions"))] if p), None)
    held = any(_HOLDING.search(w) for s in talks for w in s.get("speakerPlaced") or [])
    messenger = any("with Messenger" in (s.get("quest") or "") for s, _ in nodes)
    sent = next((s["messenger"] for s, _ in nodes if s.get("messenger")), None)  # who the Messenger alias holds (Durak)
    person = None
    if len(named) == 1:
        theirs = [s for s in talks if s["speaker"] == named[0]]
        spots = {x for s in theirs for w in s.get("speakerPlaced") or [] for x in [*w.split(", "), town_of(w, towns)] if x}
        if held:
            person = named[0]
        elif place == "any inn":
            person = named[0] if all(continues(s, own, edid, shows_at) for s in theirs) else None
        elif place and " or " in place and spots and not any(x in place.replace(" or ", ", ").split(", ") for x in spots):
            # Any of several places they aren't in: they come to you there. One place is where the quest waits.
            person = named[0]
        elif not place and brings and brings not in spots:
            # The quest's own location alias names the town the start brings them to (WO-121b Part 4: VIGILANT's Altano
            # waits at the Temple of Stendarr until the start, then he's in Dawnstar).
            person, place = named[0], brings
    if not person and not messenger:
        return None
    node = next(n for _, n in nodes)
    needs = [n for n in plain_needs(node.get("conditions"), own, say) if not n.startswith(("the place you enter", "the place you leave", "When you enter", "When you leave"))]
    if person:
        needs += [n for s in talks for n in plain_needs(s.get("conditions"), own, say) if re.fullmatch(r"Level \d+", n)]
    person = person or sent
    how = f"{person or 'A messenger'} comes to find you" + (f" in {place}" if place else "")
    return {"how": how, **({"needs": tidy(needs)} if needs else {}), **({"who": person} if person else {}), **({"where": place} if place else {}), "node": node}


HOLDS = ("The Reach", "The Rift", "Haafingar", "Whiterun", "Eastmarch", "Hjaalmarch", "The Pale", "Falkreath", "Winterhold")


def one_per_hold(text, objectives):
    """
    An objective the quest has once per hold, the same words but the hold's name, said for the hold you're in (WO-121b:
    Making Friends and Influencing People's "Assist the people of The Reach (0/5)", from any jarl): its words for that jarl's
    hold. None when it isn't one.
    """
    m = re.match(rf"^(.*?)\b({'|'.join(HOLDS)})\b", text or "")
    if not m:
        return None
    same = {h for o in objectives or [] for h in HOLDS if (o.get("text") or "").startswith(m.group(1) + h)}
    return f"{m.group(1)}that jarl's hold" if len(same) >= 3 else None


def through(starters):
    """
    Each quest-script starter that another quest of the line sets off at a stage, swapped for the talks that set that stage
    (WO-121b: Joining the Legion starts at Imperial Introductions' stage 20, which Legate Rikke's talk sets); a talk that
    needs a rumour first comes after the rumour's own talks (rule 4: Hulda's, then Balgruuf's).
    """
    out = []
    for s in starters:
        if s["by"] == "quest script" and s.get("throughStage"):
            out += [t for t in s["throughStage"] if t not in out]
            continue
        for r in s.get("after", []) if s["by"] == "dialogue" else []:
            for u in r.get("startedBy", []):
                if u["by"] == "dialogue" and u not in out:
                    out.append({**u, "rumour": True})
        out.append(s)
    return out


def talk_way(s, text, needs, found, own, line_quests, say=None):
    """A way in, with its speaker and place when it's a talk."""
    w = {"how": text, **({"needs": needs} if needs else {})}
    if s["by"] == "dialogue" and s.get("speaker"):
        w["talk"] = True
        # A talk only for some players is a way with its condition, never the giver (rule 5).
        if not is_role(s["speaker"]) and not asks_who_you_are(s):
            w["who"] = s["speaker"]
        place = clean_place((s.get("speakerPlaced") or [None])[0])
        # The person who comes to find you isn't where the records keep them (rule 3).
        if found and found.get("who") == s["speaker"]:
            place = None
            bare = {**s, "speakerPlaced": []}
            w["how"] = way_words(bare, own, line_quests, say)[0][0] if say else way_of(bare, own, line_quests)[0]
        if place:
            w["where"] = place
    return w


def start_of(row, line_quests, giver=None, towns=None, siblings=None, objectives=None, edid=None, logs=None, brings=None, say=None):
    """
    A quest's checked start in plain words (WO-121, WO-121a): { needs, ways, then, thenWhere, who, where, checked }.
    needs are all needed; when there is more than one way in they are one need ("One of: ..."). ways are
    every starter the check found, in way_of's words, each with its speaker and place when it's a talk; three
    or more people in one town are one rumour way (`towns`, from towns_of). then is the first objective the
    player sees (first_step, over the line's other rows in `siblings`), and thenWhere its target's place. who
    and where only when one person starts it: exactly one speaker, or several where the records' named giver
    (WO-99, `giver`) is one of them; never a role, an item, a door, a marker or a cell, and a place only one a
    player can find (clean_place). checked is "files" when the start check traced what starts it, else "not yet".
    With `say` (Words), every way and need in a player's words (WO-126, way_words); without it, as the check writes them.
    """
    if not row:
        return {"checked": "not yet"}
    own = row.get("name")
    edid = edid or row.get("edid")
    every = row.get("startedBy", [])
    # A talk that needs the quest already under way is a later step, not a way in (rule 6).
    # A line that turns the job down or ends the talk is no way in, in the words or the record form (WO-130 follow-up).
    starters = through([s for s in every if not continues(s, own, edid, row.get("firstObjectiveStage"))
                        and not (s["by"] == "dialogue" and _DECLINES.search(s.get("prompt") or ""))])
    # A placed trigger with no name of its own is a way in only when nothing else starts the quest (WO-136): Missives' boards,
    # never a generic stage trigger beside Matlara's talk in Unbound.
    if any(x["by"] not in ("board", "start game") and not patch_helper(x) for x in starters):
        starters = [x for x in starters if x["by"] != "board" or x.get("object")]
        # Behind a helper too (Knight of Hounds: VS Varla's helper, from a trigger in Varla's Hall, beside Memory Guide).
        starters = [{**x, "throughStartedBy": [u for u in x["throughStartedBy"] if u["by"] != "board" or u.get("object")]}
                    if x.get("throughStartedBy") else x for x in starters]
    found = finds_you(every, own, edid, row.get("firstObjectiveStage"), towns or {}, brings, say)
    needs = plain_needs((row.get("needs") or {}).get("conditions"), own, say)
    # Every way in the check found, a quest that also runs from the game's start included (The Book of
    # Love runs from the start, and Dinya Balu sets it going): those are how a player starts it.
    shown = [{k: v for k, v in found.items() if k != "node"}] if found else []
    for s in starters:
        # Once the quest finds you, every node that starts it is that one way.
        if s["by"] == "start game" or (found and _node_of(s)):
            continue
        # A patch's catch-up helper is no way in, in the record form either (WO-126; WO-137: Deathbrand's DLC2Init).
        for text, n in (way_words(s, own, line_quests, say, giver) if say else [] if patch_helper(s) else [way_of(s, own, line_quests)]):
            if s.get("rumour"):  # a rumour's talk: hear it from them (Hulda), with what the rumour waits for
                place = clean_place((s.get("speakerPlaced") or [None])[0])
                text = f"Hear about it from {s.get('speaker') or 'someone'}" + (f" in {place}" if place else "")
            if not any(w["how"] == text for w in shown):
                book_at = _STAGE_SET.match(s.get("call") or "") if s["by"] == "book" else None
                shown.append({**talk_way(s, text, tidy(n), found, own, line_quests, say),
                              **({"book": int(book_at.group(1)) if book_at else 0} if s["by"] == "book" else {})})
    # Every way the check found has no words yet (a patch's catch-up quest, a helper with no name): say so, never its id.
    if say and not shown and any(s["by"] != "start game" and not patch_helper(s) for s in starters):
        shown = [{"how": "Another quest starts it, one the planner can't name yet"}]
    shown = rumours(shown, towns or {})
    # A book that starts it no later than any talk does is a way no one gives (WO-121b: reading Deathbrand, The Aetherium
    # Wars): it leads, and there's no single giver. One that comes after the giver's own talks (the Letter to Lucien, at 10;
    # Lucien's talk sets 5) is another way, and the giver stays.
    talks = [int(m.group(1)) for s in starters if s["by"] == "dialogue" for m in [_STAGE_SET.match(s.get("call") or "")] if m]
    book = [w for w in shown if "book" in w and (not talks or w["book"] <= min(talks))]
    shown = book + [w for w in shown if w not in book]
    if not any(s["by"] == "start game" for s in starters):
        if len(shown) == 1:
            needs = [shown[0]["how"]] + needs + shown[0].get("needs", [])
        elif shown:
            needs.append("One of: " + "; or ".join(w["how"] + (f" ({', '.join(w['needs'])})" if w.get("needs") else "") for w in shown))
    needs += [d["text"] for d in (row.get("needs") or {}).get("doors", [])]
    out = {"needs": tidy(needs)}
    shown = [{k: v for k, v in w.items() if k not in ("talk", "rumour", "book")} for w in shown]
    if shown:
        out["ways"] = shown
    speakers = [] if book else list(dict.fromkeys(w["who"] for w in shown if w.get("who")))
    one = speakers[0] if len(speakers) == 1 else (giver["name"] if giver and giver.get("name") in speakers else None)
    # A named person alongside a guard, each starting it, isn't the one giver (Laid to Rest: Jonna, and a Morthal guard).
    guard = any(s["by"] == "dialogue" and ((s.get("speaker") and is_role(s["speaker"])) or "Guard Faction" in (s.get("conditions") or "")) for s in starters)
    if one and not found and guard and not (giver and giver.get("name") == one):
        one = None
    # When the quest finds you, its person is the giver only when every way is theirs (rule 3).
    if found and not all(w.get("who") == found.get("who") for w in shown):
        one = None
    # Started only through someone's dialogue helper ("aaaHOTRDialogue"), or a helper the check can't open that holds the
    # giver's own alias ("with RalfornAlias"): the records' named giver is the one (WO-121b Part 4: Gwilym for Heart of the Reach,
    # Ralforn for Sleepwalking Into A Nightmare). Dragonborn's cultist nodes are no one's dialogue.
    helpers = [s for s in starters if s["by"] != "start game"]
    if not one and not found and giver and helpers and all(talks_through(h, line_quests, giver) for h in helpers):
        one = giver["name"]
    if found and one:
        out["who"] = one
        if found.get("where"):
            out["where"] = found["where"]
    elif one:
        out["who"] = one
        # The records' named giver's place names its hold too ("Temple of Mara, Riften"): use it when it's them.
        place = (giver or {}).get("place") if (giver or {}).get("name") == one else None
        place = place or next((w.get("where") for w in shown if w.get("who") == one and w.get("where")), None)
        if place:
            out["where"] = place
    step = first_step(row, siblings)
    # The first step is what the starting line's stage shows (rules 1 and 2).
    # A talk only for some players (rule 5) sets it for them, not for everyone, when anything else starts it (The Cursed
    # Tribe: Larak's letter line is an Orc's; Atub's sets 20). A book that starts it counts like a talk (Discerning).
    # So does a later quest's call that WO-136's ruling 1 counts as the start (A New Order: Bloodline sets 20, "Speak with Isran").
    opener = lambda s: s["by"] == "book" or s.get("laterInLine") or (s["by"] == "dialogue" and not asks_who_you_are(s))  # noqa: E731
    pick = [s for s in starters if opener(s)] if any(opener(s) for s in starters) else [s for s in starters if s["by"] == "dialogue"]
    sets = {int(m.group(1)) for s in pick for m in [_STAGE_SET.match(s.get("call") or "")] if m}
    shown_first = stage_step(row, objectives, sets) if step is row else None
    first = (step.get("firstObjective") or {})
    # A placeholder is never the first step: the real objective the stage shows, else the next one, else its journal.
    if not shown_first and first.get("text") and _PLACEHOLDER.fullmatch(first["text"]):
        real = sorted((o for o in objectives or [] if o.get("text") and not _PLACEHOLDER.fullmatch(o["text"]) and o.get("index", 0) > (first.get("index") or 0)), key=lambda o: (o.get("index") != row.get("firstObjectiveStage"), o.get("index", 0)))
        shown_first = real[0] if real else {"index": None, "text": (logs or {}).get(row.get("firstObjectiveStage")) or ""}
        first = {}
    if shown_first and shown_first.get("text"):
        out["then"] = shown_first["text"]
    elif one_per_hold(first.get("text"), objectives):
        out["then"] = one_per_hold(first.get("text"), objectives)
    elif first.get("text"):
        out["then"] = first["text"]
        holder = next((h for t in step.get("target", []) for h in t.get("holds", []) if h.get("name") and "actor" in (h.get("kind") or "")), None)
        place = next((p for p in map(clean_place, (holder or {}).get("where", [])) if p), None)
        if place:
            out["thenWhere"] = place
        if holder and not is_role(holder["name"]):
            out["thenWho"] = holder["name"]
    # The towns it starts in (WO-128 Part 2, WO-129 Part 3): each way's speaker's town and the giver's, for where an act goes.
    at = list(dict.fromkeys(t for t in (town_of(p, towns or {}) for p in [*(w.get("where") for w in shown), out.get("where")]) if t))
    if at:
        out["towns"] = at
    # Only a patch's catch-up helpers (WO-121b): nothing a player does is traced yet.
    traced = every and not row.get("unread") and not all(patch_helper(s) or (s["by"] == "quest script" and not s.get("throughStartedBy") and
                                                             (s.get("quest") or "").split(" ")[0].rstrip(",") not in line_quests) for s in every)
    out["checked"] = "files" if traced else "not yet"
    return out


def start_disagreements(pages):
    """Where a line's opening quest's checked level differed from the field guide's minLevel (build_quests kept the checked one)."""
    return [{"line": l["id"], "name": l["name"], "field": "minLevel", "guide": l["guideMinLevel"], "checked": l["minLevel"], "quest": l["quests"][0]["name"]}
            for l in pages if "guideMinLevel" in l]


# A first step Bob judged where no rule tells it apart (WO-121b, 22 Oct), by quest edid, like the answer key's DIFFERS:
# the step, and why. The Blessings of Nature has Innocence Lost's shape exactly (start-game, a first objective no fragment
# of its own shows, a giver's talk that sets the next stage), and the two want opposite answers.
FIRST_STEPS = {
    "T03": ("Retrieve Nettlebane", "Bob, 22 Oct: Danica's \"I'll get Nettlebane for you.\" sets stage 20, which is the step; "
                                   "the stage-10 temple inspection happens by itself (UESP)."),
}


def reword(start, wording, way_needs=None):
    """
    A start with the hand-kept wording (overrides.json questStarts, WO-126) put in for the words it replaces, and
    `way_needs` ({way, as reworded: [needs]}, its _wayNeeds) added to a way the records leave a need off (WO-137: reading
    Deathbrand needs its level gate, which the book's script checks and the start check doesn't read).
    """
    if not wording and not way_needs:
        return start
    put = lambda t: next((t.replace(k, v) for k, v in (wording or {}).items() if k in t), t)  # noqa: E731
    out = {**start, "needs": [put(n) for n in start.get("needs", [])]}
    if start.get("ways"):
        out["ways"] = []
        for w in start["ways"]:
            w = {**w, "how": put(w["how"])}
            add = [n for n in (way_needs or {}).get(w["how"], []) if n not in w.get("needs", [])]
            out["ways"].append({**w, "needs": w.get("needs", []) + add} if add else w)
        # The one-line needs say each way with its needs, as start_of writes them.
        if len(out["ways"]) > 1 and any(n.startswith("One of: ") for n in out["needs"]):
            one = "One of: " + "; or ".join(w["how"] + (f" ({', '.join(w['needs'])})" if w.get("needs") else "") for w in out["ways"])
            out["needs"] = [one if n.startswith("One of: ") else n for n in out["needs"]]
    return out


def people_of(entry):
    """
    The people and creatures a quest's records fill its aliases with, and its giver, by name (WO-133: Palonimo, the horse
    Running Wild sends you after): what a player may call the quest by. Never a role, never an editor id.
    """
    names = [p.get("npc") for p in (entry or {}).get("people", [])] + [((entry or {}).get("giver") or {}).get("name")]
    return list(dict.fromkeys(n for n in names if n and not is_role(n) and not _RECORD_FORM.search(n) and not _EDID.match(n)))


def steps_of(q, row):
    """
    Each objective with the stage that shows it (WO-134, for the quest log): from the start check's objectivesShown when the
    row has it, which leaves out an objective no fragment of its own shows; else the objective's own number, which is the
    stage for most. A placeholder ("TEST") is never one.
    """
    shown = (row or {}).get("objectivesShown") or {}
    out = []
    for o in sorted(q.get("objectives", []), key=lambda o: o.get("index", 0)):
        if not o.get("text") or _PLACEHOLDER.fullmatch(o["text"]):
            continue
        stage = shown.get(str(o["index"]), None if shown else o["index"])
        if stage is not None:
            out.append({"stage": int(stage), "text": o["text"]})
    return sorted(out, key=lambda x: x["stage"])


_READ = re.compile(r"^(?:Read|Get) (.+)$")


# A container a player knows by what it is, not by name: "In a chest somewhere in Whiterun".
_CONTAINERS = {"chest", "barrel", "sack", "satchel", "strongbox", "desk", "dresser", "end table", "wardrobe", "cupboard", "urn", "coffin",
               "knapsack", "crate", "basket", "drawer", "cabinet", "footlocker", "safe", "display case", "bookshelf", "nightstand"}


def place_words(p, quest_name=None):
    """
    One place a read-this item is, from the PC's readables file (WO-131 Part 2), in plain words; None for one a player can't
    use (a holding or test cell, a container only the editor has). A random list is "random loot", never its editor id.
    """
    where = [w for w in ([p["where"]] if isinstance(p.get("where"), str) else p.get("where") or []) if w and not _HOLDING.search(w)]
    if p["kind"] in ("placed", "container", "carried") and not where:
        return None
    at = clean_place(where[0]) if where else None
    if at and at.lower() in ("somewhere in skyrim", "somewhere in tamriel"):  # a whole worldspace is no place to look
        at = None
    # "somewhere in Whiterun" is the file's word for a cell with no name: "in a chest somewhere in Whiterun".
    inside = lambda a: a if a.startswith("somewhere in ") else f"in {a}"  # noqa: E731
    if p["kind"] == "carried" and p.get("holder"):
        return f"Carried by {p['holder']}" + (f", {inside(at)}" if at else "")
    if p["kind"] in ("placed", "container") and not at:
        return None
    if p["kind"] == "placed":
        # The nearest named doors, within 5 m of the nearest; never one with no name, never one the place already says.
        doors = sorted((d for d in p.get("nearDoors") or [] if not d["door"].startswith("somewhere") and d["door"].lower() not in at.lower()), key=lambda d: d["metres"])
        near = [d["door"] for d in doors if d["metres"] <= doors[0]["metres"] + 5][:2] if doors else []
        return (at[0].upper() + at[1:]) + (f", near {' and '.join(near)}" if near else "")
    if p["kind"] == "container":
        holder = p.get("holder") or "a container"
        holder = _a(holder.lower()) if holder.lower() in _CONTAINERS else holder
        return f"In {holder} {inside(at)}"
    if p["kind"] == "levelled":
        return "It can turn up as random loot"
    if p["kind"] == "delivered":
        # By another quest a player knows: say which; by the quest it starts, or a helper: just that it comes to you.
        q = p.get("quest")
        return f"It's handed to you during {q}" if q and q != quest_name and plain_name(q) else "It's handed to you"
    return None


def read_places(readables):
    """{(quest name, item name): [places in plain words]} from the readables file's items (WO-131 Part 2)."""
    out = {}
    for r in readables or []:
        for st in r.get("starts", []):
            out[(st["quest"], r["item"])] = list(dict.fromkeys(w for w in (place_words(p, st["quest"]) for p in r.get("places", [])) if w))
    return out


def by_area(found, towns=None):
    """
    Every place, grouped by area (WO-137 item 2): the town a place's cell is in; else what it's in ("in Gyldenhul Barrow"), the
    place a cell belongs to ("Tel Mithryn, Tel Mithryn Tower" is Tel Mithryn), or the place itself; "Anywhere" for loot and
    the like. Areas in the order they first come, the readables file's order kept inside each. -> (places, their areas).
    """
    areas = {}
    for w in found:
        cell, _, rest = w.partition(", ")
        t = towns or {}
        area = (t.get(cell) or t.get(w) or (rest[3:] if rest.startswith("in ") else cell if rest.startswith("near ") or rest.startswith(cell) else t.get(rest) or rest)
                or ("Anywhere" if re.match(r"It\b", w) else cell))
        areas.setdefault(area, []).append(w)
    return [w for ws in areas.values() for w in ws], [a for a, ws in areas.items() for _ in ws]


def placed_ways(start, quest_name, places, towns=None):
    """
    Each read-this way with where its item is (`whereIs`, every place, grouped by area, with `whereIsArea` beside it), or,
    with none, `unplaced`: "Where to find X isn't checked yet." The way still says only "Read X"; nothing turns it into a
    direction (WO-131 Part 2). How many to show is the reader's: the door gives eight and the rest on asking (WO-137 item 2).
    """
    ways = []
    for w in start.get("ways", []):
        m = _READ.match(w["how"])
        if m and "checked" not in w:
            found = places.get((quest_name, m.group(1)))
            if found:
                where, area = by_area(found, towns)
                w = {**w, "whereIs": where, "whereIsArea": area}
            else:
                w = {**w, "unplaced": f"Where to find {'it' if _RECORD_FORM.search(m.group(1)) else m.group(1)} isn't checked yet."}
        ways.append(w)
    return {**start, "ways": ways} if start.get("ways") else start


def from_key(start, row):
    """
    A quest the start check hasn't settled, with a row in Bob's answer key (WO-136 ruling 2): the key's starter, confirmed
    from the wiki, makes it checked, with the source named (UESP, or the mod's Nexus page). Its giver and first step are the
    key's; a no-giver row has no one to talk to and says so. A start the check settled is left as it is.
    """
    if not row or start.get("checked") != "not yet":
        return start
    url = row.get("url") or ""
    if row.get("source") == "records":  # Bob, 23 Oct 08:05: a row from the records alone (the Vigilant guides) is checked in the files
        out = {**start, "checked": "files"}
    else:
        out = {**start, "checked": "uesp", "source": "Nexus" if "nexusmods" in url else "UESP", **({"url": url} if url else {})}
    out["then"] = row["firstObjective"]
    if row.get("noGiver"):
        out = {k: v for k, v in out.items() if k not in ("who", "where", "thenWho", "thenWhere")}
        out["ways"] = out.get("ways") or [{"how": "No one gives it"}]
    elif len(row.get("startsWith", [])) == 1 and not start.get("who"):
        out["who"] = row["startsWith"][0]
    return out


def build_quests(lines, quests_raw, givers_raw, checks=None, globals_=None, towns=None, wording=None, called=None, readables=None, truth=None, classes=None, changes=None):
    """
    The curated lines (questlines.curate) -> the quests.json lines, in curation order, tags filled. Each start is in a
    player's words (WO-126), with the check's own form kept in start.raw for the open-or-locked judge and assistants;
    `wording` is overrides.json's questStarts, {quest edid: {words: what the page says instead}}. `called` is
    overrides.json's questNames, {quest edid: {names: what players call it}} (WO-133).
    """
    checks, globals_, wording, called = checks or {}, globals_ or {}, wording or {}, called or {}
    places = read_places(readables)
    keyed = {r["editorId"].lower(): r for r in truth or []}
    classes = {k: v for k, v in (classes or {}).items() if not k.startswith("_")}
    say = Words(quests_raw, globals_)
    raws = {}
    towns = towns if towns is not None else towns_of(givers_raw)
    by_id = {q["id"]: q for q in quests_raw}
    givers = {g["id"]: g for g in givers_raw}
    by_edid = {q["edid"]: q["id"] for q in quests_raw}
    out = []
    for line in lines:
        item = {k: line[k] for k in ("id", "name", "category", "also", "prince", "where", "opening", "begins", "beginsFrom", "after", "checked", "destinationInName") if k in line}
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
        item["checked"] = {k: v for k, v in checked.items() if k not in unread and k != "giver"}  # the giver says its own source
        item["sources"] = [
            {"name": source_name(s["name"]), **({"modid": s["modid"]} if s.get("modid") else {}), **({"base": True} if s["name"] == "Skyrim" else {})}
            for s in line["sources"]
        ]
        opening = givers.get(by_edid.get(line["opening"]))
        fo = (opening or {}).get("firstObjective")
        if fo and fo.get("namesWhoOrWhere") and fo.get("filled"):
            item["firstObjective"] = fill_text(fo["filled"], (by_id.get(by_edid.get(line["opening"])) or {}).get("fills", {}), globals_)
        quests = []
        checked_rows = checks.get(line["id"], {})
        line_quests = {by_id[lq["id"]]["edid"]: by_id[lq["id"]]["name"] for lq in line["quests"]}
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
            changed = changes_of(endings_of(stages), (changes or {}).get(q["edid"], {}).get("set"))
            if changed:
                rewards["endings"] = changed
            args = (checked_rows.get(q["edid"]), line_quests, giver_of(givers.get(q["id"])), towns, checked_rows, q.get("objectives"), q["edid"],
                    {st["index"]: st["log"][0]["text"] for st in stages if st["log"] and st["log"][0].get("text")}, brought_to(givers.get(q["id"]), towns))
            ov = wording.get(q["edid"], {})
            if ov.get("_starters") and args[0]:  # a starter the PC traced that the check doesn't list yet (overrides.json)
                args = (dict(args[0], startedBy=ov["_starters"] + args[0].get("startedBy", [])),) + args[1:]
            # The record form takes the hand-kept way needs too (WO-137), for the open-or-locked judge.
            raw = reword(start_of(*args), None, wording.get(q["edid"], {}).get("_wayNeeds"))
            start = reword(placed_ways(start_of(*args, say=say), q["name"], places, towns), {k: v for k, v in wording.get(q["edid"], {}).items() if not k.startswith("_")}, wording.get(q["edid"], {}).get("_wayNeeds"))
            # A way a player found in game, not the files (WO-131 Part 0: Dave's note outside Joslin's house): marked so.
            if ov.get("_checked") == "players":
                put = {v for k, v in ov.items() if not k.startswith("_")}
                start["ways"] = [{**w, "checked": "players", "source": ov["_source"]} if w["how"] in put else w for w in start.get("ways", [])]
            start = from_key(start, keyed.get(q["edid"].lower()))
            # A job from a board (WO-136 ruling 3): one the check hasn't traced is checked as its class, in the class's words.
            kind = classes.get(line["id"])
            # So is one whose every start is a board (WO-136: the PC's boards.py traces each Missives job to its hold's board).
            only_boards = bool((checked_rows.get(q["edid"]) or {}).get("startedBy")) and all(s["by"] == "board" for s in checked_rows[q["edid"]]["startedBy"])
            if kind and (start.get("checked") == "not yet" or only_boards):
                start = {"needs": [], "ways": [{"how": kind["says"]}], "checked": "files", "board": True, **({"then": start["then"]} if start.get("then") else {})}
            if q["edid"] in FIRST_STEPS:
                start = {k: v for k, v in start.items() if k not in ("thenWhere", "thenWho")}
                start["then"] = FIRST_STEPS[q["edid"]][0]
            # A job from a board needs nothing past its class's sentence: the board's own words aren't a need for the judge (WO-136).
            if (raw.get("needs") or raw.get("ways")) and not start.get("board"):
                start["raw"] = {"needs": raw.get("needs", []), **({"ways": [{k: w[k] for k in ("how", "needs") if k in w} for w in raw["ways"]]} if raw.get("ways") else {})}
            raws[q["edid"]] = raw
            quests.append(fill_all(
                {
                    "edid": q["edid"],
                    # A record whose name is its editor id ("MyrwatchTNE_Quest") opens its line under the line's name.
                    "name": line["name"] if q["edid"] == line["opening"] and _RECORD_FORM.search(q["name"] or "") else q["name"],
                    "type": q.get("type"),
                    "xp": xp_for(q.get("type")),
                    "journal": journal(q),
                    "stages": stages,
                    "endings": endings_of(stages),
                    "objectives": [o["text"] for o in sorted(q.get("objectives", []), key=lambda o: o.get("index", 0)) if o.get("text")],
                    "steps": steps_of(q, checked_rows.get(q["edid"])),
                    "start": start,
                    **({"rewards": rewards} if rewards else {}),
                    # What a player may call it by (WO-133): who its records fill it with, and the names players use.
                    **({"people": people_of(givers.get(q["id"]))} if people_of(givers.get(q["id"])) else {}),
                    **({"calledBy": called[q["edid"]]["names"]} if isinstance(called.get(q["edid"]), dict) else {}),
                }, q.get("fills", {}), globals_)
            )
        item["quests"] = quests
        # The class's sentence once for the line, with how many of its quests it covers (WO-136 ruling 3).
        if classes.get(line["id"]):
            kind = classes[line["id"]]
            # The boards the records place (boards.py, through the start check), when the class doesn't name them by hand.
            placed = sorted({p["where"] for r in checked_rows.values() for s in r.get("startedBy", []) if s["by"] == "board" for p in s.get("places", [])
                             if p.get("where") and not p["where"].startswith("somewhere in ")})
            item["board"] = {"name": kind["name"], "says": kind["says"], "boards": kind.get("boards") or placed or None, "jobs": sum(1 for q in quests if q["start"].get("board"))}
        # The line's giver (WO-121): its opening quest's who; else the records' named giver, only when the
        # check found no one to talk to; else none, and the line page shows the opening quest's ways.
        first_start = next((q["start"] for q in quests if q["edid"] == line["opening"]), {})
        # An opening that starts after another of the line's quests is given by whoever gives that one (WO-121b Part 4:
        # The Isle of Madness opens after The Route of Madness, which Staada gives).
        first_raw = raws.get(line["opening"], {})
        before = re.fullmatch(r"After (.+?)(?: \(its stage \d+\))?", (first_raw.get("ways") or [{}])[0].get("how", "")) if len(first_raw.get("ways") or []) == 1 else None
        lead = next((q for q in quests if before and q["name"] == before.group(1) and q["edid"] != line["opening"]), None)
        # That quest's who, else the records' named giver for it.
        lead_giver = (lead["start"].get("who") and {"name": lead["start"]["who"], "place": lead["start"].get("where")}) if lead else None
        lead_giver = lead_giver or (giver_of(givers.get(by_edid.get(lead["edid"]))) if lead else None)
        # Their place is where that quest puts them, which isn't traced yet: never the spot they wait in.
        if lead_giver and not first_start.get("who"):
            first_start["who"] = lead_giver["name"]
        if first_start.get("who"):
            item["giver"] = {"name": first_start["who"], **({"place": first_start["where"]} if first_start.get("where") else {})}
        # The records' named giver stands in only when the check found a way in with no one to name; a quest that runs
        # from the start with no way in found has no giver the page can name (WO-121b Part 4: The Heart of Dibella, not
        # Kleppr).
        elif first_start.get("ways") and not any(w.get("who") for w in first_start.get("ways", [])) and not any(
                s["by"] == "book" for s in (checked_rows.get(line["opening"]) or {}).get("startedBy", [])):  # a book is no one's (Dibella's letter)
            giver = giver_of(opening)
            # Not someone whose line is only a way with its condition (WO-121b rule 5: Chief Larak, for an Orc).
            if giver and not any(re.match(rf"(Ask|Talk to) {re.escape(giver['name'])}\b", w["how"]) for w in first_start.get("ways", [])):
                item["giver"] = giver
        # More than one opening (WO-121b): the Civil War's two sides, the townsfolk's six deliveries. No one giver; the
        # line's ways in are each opening's, its person and place, named by its quest when their names differ.
        openers = [q for q in quests if q["edid"] == line["opening"]] + [q for q in quests if q["edid"] in line.get("alsoOpening", [])]
        if len(openers) > 1:
            item.pop("giver", None)
            named = len({q["name"] for q in openers}) > 1
            ways = []
            for q in openers:
                st = q["start"]
                w = ({"how": f"Talk to {st['who']}" + (f" in {st['where']}" if st.get("where") else ""), "who": st["who"], **({"where": st["where"]} if st.get("where") else {})}
                     if st.get("who") else next(iter(st.get("ways", [])), None))
                if w:
                    ways.append({**w, "how": (f"{q['name']}: " if named else "") + w["how"]})
            item["ways"] = ways
        # A giver a judged source names when the records can't (WO-121b: Raven Rock's Captain Veleth, at Old Attius Farm).
        if line.get("giver") and checked.get("giver"):
            item["giver"] = {**line["giver"], "source": checked["giver"]}
        # A checked level beats the field guide's (WO-115); start_disagreements lists each for questlines_report.md.
        first = quests[0]["start"] if quests else {}
        levels = [int(n.split(" ")[1]) for n in first.get("needs", []) if re.fullmatch(r"Level \d+", n)]
        if first.get("checked") == "files" and levels and item.get("minLevel") is not None and max(levels) != item["minLevel"]:
            item["guideMinLevel"] = item["minLevel"]
            item["minLevel"] = max(levels)
        item["xpTotal"] = sum(q["xp"] for q in quests)
        out.append(item)
    return out
