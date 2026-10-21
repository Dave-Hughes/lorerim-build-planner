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
        key = re.sub(r"^the ", "", p.lower())
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
    return text + (f", if {conditions[0].lower()}{conditions[1:]}" if conditions else "")


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


def fill_text(text, fills, globals_):
    """
    A text with its tags filled: the quest's own fills (quests.py, from the records), a global's value by its EDID, a
    date the game sets at run time as "the set date", and an alias the records don't fill in plain words.
    """
    if not isinstance(text, str) or "<" not in text:
        return text
    text = _OPEN.sub(r"<\1>", text)  # a tag the record never closes: "Deliver <Alias=Item by ..."
    text = _DATE.sub("the set date", text)

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


def plain_needs(conditions, own_name):
    """
    A condition text (groups joined with '; ') as needs: the level as "Level N", the speaker and the quest's own
    "not started yet" left out (the way in says who; a quest that hasn't started is the point), and a condition the
    reader can't name yet kept and said so.
    """
    out = []
    for group in (conditions or "").split("; "):
        g = group.strip()
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


def way_of(s, own_name, line_quests):
    """One starter row in player words, and the needs that go with it."""
    if s["by"] == "dialogue":
        who = s.get("speaker") or "someone the records don't name"
        place = clean_place((s.get("speakerPlaced") or [None])[0])
        text = (f"Ask {who} \"{s['prompt']}\"" if s.get("prompt") else f"Talk to {who}") + (f" in {place}" if place else "")
        return text, plain_needs(s.get("conditions"), own_name)
    if s["by"] == "story manager":
        return f"It starts by itself on {s.get('event') or 'a story event'}", plain_needs(s.get("conditions"), own_name)
    if s["by"] == "quest script":
        edid = (s.get("quest") or "").split(" ")[0].rstrip(",")
        if edid in line_quests:
            return f"After {line_quests[edid]}" + (f" (its stage {s['atStage']})" if s.get("atStage") is not None else ""), []
        ups = [way_of(u, own_name, line_quests) for u in s.get("throughStartedBy", []) if u["by"] != "quest script" or u.get("quest")]
        named = (s.get("quest") or edid).split(",")[0]
        if s.get("plain"):  # the start check's words for a helper with a story manager trigger (WO-121a)
            return s["plain"], []
        # One way up: its needs are this way's (Dawnguard's helper starts on a node that needs level 30). More than
        # one (Dragonborn's two cultist nodes): each keeps its own needs in the text.
        if len(ups) == 1:
            return f"Through {named}, which starts from: {ups[0][0]}", ups[0][1]
        texts = list(dict.fromkeys(t + (f" ({', '.join(n)})" if n else "") for t, n in ups))
        return f"Through {named}" + (f", which starts from: {'; or '.join(texts)}" if texts else ""), []
    return "It runs from the start of the game", []


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
# The player's race: a faction condition may be the speaker's (Mralki's JobInnkeeperFaction), a race one is the player's.
_PLAYER_IS = re.compile(r"\bGetIsRace\b[^;]*== 1")


def continues(s, own, edid, shows_at):
    """
    A talk that needs its own quest already past the stage where its first objective shows (WO-121b rule 6): a later
    step, not a start. Battle of the Champions' Legate needs stage 20, past its 10; Sam Guevenne's lines need DA14Start
    at 60, past its 20. Falk Firebeard's needs The Wolf Queen Awakened at 10, which its letter sets before anything
    shows (its first objective is at 50), so he still starts it.
    """
    names = "|".join(re.escape(n) for n in {own, edid} if n)
    if s["by"] != "dialogue" or not names or shows_at is None:
        return False
    for g in (s.get("conditions") or "").split("; "):
        m = re.fullmatch(rf"(?:{names}) stage (?:(==|>=|>) (\d+)|(\d+) done)", g.strip())
        if m and int(m.group(2) or m.group(3)) >= shows_at:
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
    if shown:
        at = min(sets) if sets else row.get("firstObjectiveStage")
        here = sorted(i for i, st in shown.items() if st == at and i in texts)
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


def finds_you(starters, own, edid, shows_at, towns):
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
    if not person and not messenger:
        return None
    node = next(n for _, n in nodes)
    needs = [n for n in plain_needs(node.get("conditions"), own) if not n.startswith(("the place you enter", "the place you leave"))]
    if person:
        needs += [n for s in talks for n in plain_needs(s.get("conditions"), own) if re.fullmatch(r"Level \d+", n)]
    how = f"{person or 'A messenger'} comes to find you" + (f" in {place}" if place else "")
    return {"how": how, **({"needs": list(dict.fromkeys(needs))} if needs else {}), **({"who": person} if person else {}), **({"where": place} if place else {}), "node": node}


def start_of(row, line_quests, giver=None, towns=None, siblings=None, objectives=None, edid=None):
    """
    A quest's checked start in plain words (WO-121, WO-121a): { needs, ways, then, thenWhere, who, where, checked }.
    needs are all needed; when there is more than one way in they are one need ("One of: ..."). ways are
    every starter the check found, in way_of's words, each with its speaker and place when it's a talk; three
    or more people in one town are one rumour way (`towns`, from towns_of). then is the first objective the
    player sees (first_step, over the line's other rows in `siblings`), and thenWhere its target's place. who
    and where only when one person starts it: exactly one speaker, or several where the records' named giver
    (WO-99, `giver`) is one of them; never a role, an item, a door, a marker or a cell, and a place only one a
    player can find (clean_place). checked is "files" when the start check traced what starts it, else "not yet".
    """
    if not row:
        return {"checked": "not yet"}
    own = row.get("name")
    edid = edid or row.get("edid")
    every = row.get("startedBy", [])
    # A talk that needs the quest already under way is a later step, not a way in (rule 6).
    starters = [s for s in every if not continues(s, own, edid, row.get("firstObjectiveStage"))]
    found = finds_you(every, own, edid, row.get("firstObjectiveStage"), towns or {})
    needs = plain_needs((row.get("needs") or {}).get("conditions"), own)
    # Every way in the check found, a quest that also runs from the game's start included (The Book of
    # Love runs from the start, and Dinya Balu sets it going): those are how a player starts it.
    shown = [{k: v for k, v in found.items() if k != "node"}] if found else []
    for s in starters:
        # Once the quest finds you, every node that starts it is that one way.
        if s["by"] == "start game" or (found and _node_of(s)):
            continue
        text, n = way_of(s, own, line_quests)
        if any(w["how"] == text for w in shown):
            continue
        w = {"how": text, **({"needs": n} if n else {})}
        if s["by"] == "dialogue" and s.get("speaker"):
            w["talk"] = True
            # A talk only for some players is a way with its condition, never the giver (rule 5).
            if not is_role(s["speaker"]) and not asks_who_you_are(s):
                w["who"] = s["speaker"]
            place = clean_place((s.get("speakerPlaced") or [None])[0])
            # The person who comes to find you isn't where the records keep them (rule 3).
            if found and found.get("who") == s["speaker"]:
                place = None
                w["how"] = way_of({**s, "speakerPlaced": []}, own, line_quests)[0]
            if place:
                w["where"] = place
        shown.append(w)
    shown = rumours(shown, towns or {})
    if not any(s["by"] == "start game" for s in starters):
        if len(shown) == 1:
            needs = [shown[0]["how"]] + needs + shown[0].get("needs", [])
        elif shown:
            needs.append("One of: " + "; or ".join(w["how"] + (f" ({', '.join(w['needs'])})" if w.get("needs") else "") for w in shown))
    needs += [d["text"] for d in (row.get("needs") or {}).get("doors", [])]
    out = {"needs": list(dict.fromkeys(needs))}
    shown = [{k: v for k, v in w.items() if k not in ("talk", "rumour")} for w in shown]
    if shown:
        out["ways"] = shown
    speakers = list(dict.fromkeys(w["who"] for w in shown if w.get("who")))
    one = speakers[0] if len(speakers) == 1 else (giver["name"] if giver and giver.get("name") in speakers else None)
    # A named person alongside a guard, each starting it, isn't the one giver (Laid to Rest: Jonna, and a Morthal guard).
    guard = any(s["by"] == "dialogue" and ((s.get("speaker") and is_role(s["speaker"])) or "Guard Faction" in (s.get("conditions") or "")) for s in starters)
    if one and not found and guard and not (giver and giver.get("name") == one):
        one = None
    # When the quest finds you, its person is the giver only when every way is theirs (rule 3).
    if found and not all(w.get("who") == found.get("who") for w in shown):
        one = None
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
    sets = {int(m.group(1)) for s in starters if s["by"] == "dialogue" for m in [_STAGE_SET.match(s.get("call") or "")] if m}
    shown_first = stage_step(row, objectives, sets) if step is row else None
    first = (step.get("firstObjective") or {})
    if shown_first:
        out["then"] = shown_first["text"]
    elif first.get("text"):
        out["then"] = first["text"]
        holder = next((h for t in step.get("target", []) for h in t.get("holds", []) if h.get("name") and "actor" in (h.get("kind") or "")), None)
        place = next((p for p in map(clean_place, (holder or {}).get("where", [])) if p), None)
        if place:
            out["thenWhere"] = place
        if holder and not is_role(holder["name"]):
            out["thenWho"] = holder["name"]
    traced = every and not row.get("unread") and not all(s["by"] == "quest script" and not s.get("throughStartedBy") and
                                                             (s.get("quest") or "").split(" ")[0].rstrip(",") not in line_quests for s in every)
    out["checked"] = "files" if traced else "not yet"
    return out


def start_disagreements(pages):
    """Where a line's opening quest's checked level differed from the field guide's minLevel (build_quests kept the checked one)."""
    return [{"line": l["id"], "name": l["name"], "field": "minLevel", "guide": l["guideMinLevel"], "checked": l["minLevel"], "quest": l["quests"][0]["name"]}
            for l in pages if "guideMinLevel" in l]


def build_quests(lines, quests_raw, givers_raw, checks=None, globals_=None, towns=None):
    """The curated lines (questlines.curate) -> the quests.json lines, in curation order, tags filled."""
    checks, globals_ = checks or {}, globals_ or {}
    towns = towns if towns is not None else towns_of(givers_raw)
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
            quests.append(fill_all(
                {
                    "edid": q["edid"],
                    "name": q["name"],
                    "type": q.get("type"),
                    "xp": xp_for(q.get("type")),
                    "journal": journal(q),
                    "stages": stages,
                    "endings": endings_of(stages),
                    "objectives": [o["text"] for o in sorted(q.get("objectives", []), key=lambda o: o.get("index", 0)) if o.get("text")],
                    "start": start_of(checked_rows.get(q["edid"]), line_quests, giver_of(givers.get(q["id"])), towns, checked_rows, q.get("objectives"), q["edid"]),
                    **({"rewards": rewards} if rewards else {}),
                }, q.get("fills", {}), globals_)
            )
        item["quests"] = quests
        # The line's giver (WO-121): its opening quest's who; else the records' named giver, only when the
        # check found no one to talk to; else none, and the line page shows the opening quest's ways.
        first_start = next((q["start"] for q in quests if q["edid"] == line["opening"]), {})
        if first_start.get("who"):
            item["giver"] = {"name": first_start["who"], **({"place": first_start["where"]} if first_start.get("where") else {})}
        elif not any(w.get("who") for w in first_start.get("ways", [])):
            giver = giver_of(opening)
            # Not someone whose line is only a way with its condition (WO-121b rule 5: Chief Larak, for an Orc).
            if giver and not any(re.match(rf"(Ask|Talk to) {re.escape(giver['name'])}\b", w["how"]) for w in first_start.get("ways", [])):
                item["giver"] = giver
        # A checked level beats the field guide's (WO-115); start_disagreements lists each for questlines_report.md.
        first = quests[0]["start"] if quests else {}
        levels = [int(n.split(" ")[1]) for n in first.get("needs", []) if re.fullmatch(r"Level \d+", n)]
        if first.get("checked") == "files" and levels and item.get("minLevel") is not None and max(levels) != item["minLevel"]:
            item["guideMinLevel"] = item["minLevel"]
            item["minLevel"] = max(levels)
        item["xpTotal"] = sum(q["xp"] for q in quests)
        out.append(item)
    return out
