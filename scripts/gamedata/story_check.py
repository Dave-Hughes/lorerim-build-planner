"""
The start check for one story (WO-104, second pass WO-105): for every quest on a curated line, what starts
it, who and where its first objective points at, what it needs, what it gives, and which values a settings
loader or script changes at run time, each fact with its source and a verdict. Reads only. Writes
gamedata/<version>/story_checks/<line>.json and <line>.md:
  python3 scripts/gamedata/story_check.py <line id> [version]        e.g. main-quest

The quests are the line's in src/data/lorerim-<version>/quests.json (read, never written), in story order.
Names come from each record's own FULL, looked up in its plugin's STRINGS table (not DLSTRINGS or ILSTRINGS,
which reuse the same ids for other text).

For each quest:
  started by   only what takes it from not running to the stage that shows its first objective: Start(),
               SetStage to that stage or below, dialogue doing that, a story manager node (its event and every
               condition up its parents, OR groups kept, globals resolved), or the start-game flag. A starter
               that is a helper quest is followed back to what starts it (Unbound's end, through MQ102A).
  caught up by calls from a later quest in the story that set this quest's stage (how the game skips ahead).
  who, where   the alias the first objective points at, and what it holds: a unique actor, a forced reference,
               a location, the NPCs its conditions name, or whoever a script's ForceRefTo puts in it; and where
               that is placed.
  needs        level, quests and items from its own conditions; a door only when it is the way into the first
               objective's target cell and no other way in is unlocked, named by where it leads from.
  gives        AddItem on the player on its own completing stages, and items its aliases create in the player;
               a reward list named by what it holds.
  run time     every global those read: its record value, and what an MCM Helper settings loader or a script's
               SetValue makes it, wherever the global's record is.
  second step  what moves it from its first objective to its second (Kodlak's join line, Faralda's spell), with
               the speaker, prompt, reply and conditions.
A helper quest with no script starting it is followed to its story manager node or start-game flag. A dialogue
line's speaker is its GetIsID NPC, else the alias GetIsAliasRef names, else the actor alias of the scene that
speaks its topic (Agmaer at Fort Dawnguard), else whoever speaks the line that leads on to it; a line spoken in a
scene says what starts the scene (Kodlak's join line starts the one where Vilkas takes you outside).

WO-121a: a quest that runs from the start of the game without showing anything (First Lessons sits at its start-up
stage 0) is started, to the player, by the first talk of its own that can be said from there, even when it jumps past
the first objective's stage, as far as its next step (Faralda's "Okay, I can do that." sets 20). A talk still offered
past the next step (Nirya's, until stage 30) is a catch-up line; those talks count only when no other talk opens the
quest (Dinya Balu opens The Book of Love). The openers come first, then those talks, then catch-ups.
A voice type only one NPC has names that NPC as the speaker (Frissa Black-Briar's evgSirenBlackBriar). A helper's start reads its fragment's guards in words ("It starts by itself at night in
Windhelm, after you've come in four times."), and a speaker the records fill at run time from a place and a role is
named that way ("a Windhelm guard").

SC_PHASE=A, B, C runs the check in three steps (plugins, scripts, report), each cached for the next, so a step
fits a three-minute window; story_check_all.py runs lines in batches.
Then: every way a game begins (starts_raw.json), each route into the line's first quest in player terms
(speaker, race, placed cell, prompt and reply, conditions, what the script does), the payoff, the WO's three
questions and Wyrmstooth's start level in a new game.

Verdicts: files (a record decides it), script (a .pex decides it, read), run time (a settings loader or
script sets it at load), conflict (two sources disagree; both given), unread (named).
"""
import configparser
import glob
import json
import os
import pickle
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import header, iter_group, rec_data, resolve, subrecs  # noqa: E402
from pex import IDENT, STRING, functions  # noqa: E402
import quest_scripts as qsc  # noqa: E402
import quest_starts as qst  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
EVENTS = {"CLOC": "change location", "KILL": "kill", "SCPT": "script event", "LEVL": "level up", "ADIA": "dialogue", "AFAV": "favour",
          "QSTR": "quest start", "LCLD": "location loaded", "CHRR": "relationship change", "ARRT": "arrest", "AIPL": "item added"}
ROLES = {"prisoner", "courier", "guard", "bandit", "necromancer"}
MCM_GETTERS = {"getmodsettingint", "getmodsettingfloat", "getmodsettingbool", "getmodsettingstring"}
SETTERS = {"setvalue", "setvalueint", "setvaluefloat"}
# GetEventData's members for a change of location (the story manager's CLOC event).
EVENT_MEMBERS = {"L1": "the place you leave", "L2": "the place you enter"}
# A location ref type, as the person who has it: the hold's guards are placed as its soldiers.
ROLE_WORDS = {"cwsoldier": "guard", "guard": "guard", "boss": "boss", "civilian": "person"}
NUMBERS = {1: "once", 2: "twice", 3: "three times", 4: "four times", 5: "five times", 6: "six times", 7: "seven times", 8: "eight times",
           9: "nine times", 10: "ten times"}
LEVELS = {0: "unlocked", 1: "Novice", 25: "Apprentice", 50: "Adept", 75: "Expert", 100: "Master", 255: "needs a key"}


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


def quest_label(qid, names):
    """'MQ102A (Before the Storm)': the EDID and the quest's own name."""
    n = names.get(qid, {})
    label = n.get("edid") or qid
    if n.get("name") and n["name"] != n.get("edid"):
        label += f" ({n['name']})"
    return label


def name_strings(path, name, loc, root):
    """The STRINGS table a localized plugin's names (FULL) come from: its loose Strings, else the base game's."""
    if not loc:
        return None
    from bsa import vanilla_strings_kinds
    from esp import localized_strings_kinds

    own = localized_strings_kinds(path, name)
    return own["STRINGS"] if any(own.values()) else vanilla_strings_kinds(name, root)["STRINGS"]


def all_strings(path, name, loc, root):
    """All three tables, for dialogue: {'STRINGS', 'DLSTRINGS', 'ILSTRINGS'}."""
    if not loc:
        return None
    from bsa import vanilla_strings_kinds
    from esp import localized_strings_kinds

    own = localized_strings_kinds(path, name)
    return own if any(own.values()) else vanilla_strings_kinds(name, root)


# ---- conditions ----------------------------------------------------------------------------------

def num(v):
    """25.0 -> '25'."""
    return f"{v:g}" if isinstance(v, float) else str(v)


def cond_text(c, names, gvals=None, alias_names=None):
    """One condition in plain words: 'the speaker is Shazdehviir', 'Unbound hasn't started', 'the player has at least 25 gold'."""
    gvals, alias_names = gvals or {}, alias_names or {}
    fn, cmp, val = c["fn"], c["cmp"], c.get("value")
    yes = (cmp == "==" and val == 1) or (cmp == "!=" and val == 0)
    if fn == "GetIsID" and isinstance(c.get("param"), str):
        who = names.get(c["param"], {}).get("name") or c["param"]
        return f"the speaker is {who}" if yes else f"the speaker isn't {who}"
    if fn == "GetIsVoiceType" and isinstance(c.get("param"), str):
        voice = names.get(c["param"], {}).get("edid") or c["param"]
        return f"the speaker has the voice {voice}" if yes else f"the speaker hasn't the voice {voice}"
    if fn == "GetIsAliasRef":
        al = alias_names.get(c.get("param") or 0, str(c.get("param") or 0))
        return f"the speaker is the one in alias {al}" if yes else f"the speaker isn't the one in alias {al}"
    if fn == "GetEventData" and c.get("member") in EVENT_MEMBERS and isinstance(c.get("param"), str):
        edid = names.get(c["param"], {}).get("edid") or ""
        thing = names.get(c["param"], {}).get("name") or (edid[7:].lower() if edid.startswith("LocType") else edid) or c["param"]  # LocTypeDwelling: a dwelling
        verb = ("is" if yes else "isn't") if c.get("test") == 0 else ("is a" if yes else "isn't a")
        return f"{EVENT_MEMBERS[c['member']]} {verb} {thing}"
    if fn == "GetStage" and isinstance(c.get("param"), str) and val == 0 and cmp in ("==", "<="):
        return f"{names.get(c['param'], {}).get('name') or c['param']} hasn't started"
    if fn == "GetItemCount" and isinstance(c.get("param"), str) and names.get(c["param"], {}).get("edid", "").lower().startswith("gold"):
        amount = (f"{names.get(c['global'], {}).get('edid') or 'a global'} ({num(gvals.get(c['global'], {}).get('value', '?'))})" if c.get("global") else num(val))
        return {">=": f"the player has at least {amount} gold", ">": f"the player has more than {amount} gold"}.get(cmp, f"gold {cmp} {amount}")
    text = qst.describe_condition(c, names, gvals)
    return text.replace(".0 ", " ").replace(".0)", ")").replace(".0;", ";") if text.endswith(".0") is False else text[:-2]


def format_conditions(conds, names, gvals=None, alias_names=None):
    """
    Conditions as the game reads them: an OR flag joins a condition with the next into one group, and the groups
    are all needed. ['A', 'B' (or), 'C'] -> 'A; B or C'.
    """
    gvals = gvals or {}
    groups, cur = [], []
    for c in conds:
        cur.append(cond_text(c, names, gvals, alias_names))
        if not c.get("or"):
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    return "; ".join(" or ".join(g) for g in groups)


# ---- story manager nodes -------------------------------------------------------------------------

def read_nodes(buf, name):
    """Story manager nodes: type, EDID, parent, conditions, the quests a quest node starts, a branch root's event."""
    masters = header(buf)
    out = {}
    for grp in ("SMQN", "SMBN", "SMEN"):
        if grp.encode() not in buf:
            continue
        for o in iter_group(buf, grp):
            t, flags, fid, d = rec_data(buf, o)
            node = {"type": t, "edid": "", "parent": None, "conditions": [], "quests": [], "event": None, "plugin": name}
            for s, v in subrecs(d):
                if s == "EDID":
                    node["edid"] = v.rstrip(b"\0").decode("latin1")
                elif s == "PNAM" and len(v) >= 4:
                    p = struct.unpack_from("<I", v)[0]
                    node["parent"] = form_id(resolve(p, masters, name)) if p else None
                elif s == "CTDA" and len(v) >= 24:
                    node["conditions"].append(qst.ctda(v, masters, name))
                elif s == "NNAM" and t == "SMQN" and len(v) >= 4:
                    node["quests"].append(form_id(resolve(struct.unpack_from("<I", v)[0], masters, name)))
                elif s == "ENAM" and len(v) >= 4:
                    node["event"] = v[:4].decode("latin1")
            out[form_id(resolve(fid, masters, name))] = node
    return out


def node_chain(nid, nodes):
    """A quest node and its parents up to the event node: [(id, node)] from the quest node up."""
    chain, seen = [], set()
    while nid and nid not in seen and nid in nodes:
        seen.add(nid)
        chain.append((nid, nodes[nid]))
        nid = nodes[nid]["parent"]
    return chain


def node_starts(quest, nodes):
    """Every story manager quest node that starts `quest`: its event and every condition up its parents."""
    out = []
    for nid, n in nodes.items():
        if n["type"] != "SMQN" or quest not in n["quests"]:
            continue
        chain = node_chain(nid, nodes)
        event = next((x["event"] for _, x in chain if x["type"] == "SMEN"), None)
        conds = [dict(c, node=x["edid"] or i) for i, x in chain for c in x["conditions"]]
        out.append({"node": n["edid"] or nid, "id": nid, "plugin": n["plugin"], "event": EVENTS.get(event, event), "eventCode": event,
                    "conditions": conds, "parents": [x["edid"] or i for i, x in chain[1:]]})
    return out


# ---- records read for WO-105 ---------------------------------------------------------------------

def read_objective_targets(buf, name, ids):
    """For the quests in `ids`: {quest: {objective index: [alias ids its targets name]}} (QOBJ, then QSTA)."""
    masters = header(buf)
    out = {}
    if b"QUST" not in buf:
        return out
    for o in iter_group(buf, "QUST"):
        _, flags, fid, d = rec_data(buf, o)
        key = form_id(resolve(fid, masters, name))
        if key not in ids:
            continue
        objs, cur = {}, None
        for s, v in subrecs(d):
            if s == "QOBJ":
                cur = struct.unpack_from("<H", v)[0]
                objs[cur] = []
            elif s == "QSTA" and cur is not None and len(v) >= 4:
                objs[cur].append(struct.unpack_from("<i", v)[0])
            elif s in ("ANAM", "ALST", "ALLS"):
                cur = None
        out[key] = objs
    return out


def read_startup(buf, name, ids):
    """{quest: its start-up stage} for the quests in `ids` (an INDX whose flags have 0x02)."""
    masters = header(buf)
    out = {}
    if b"QUST" not in buf:
        return out
    for o in iter_group(buf, "QUST"):
        _, flags, fid, d = rec_data(buf, o)
        key = form_id(resolve(fid, masters, name))
        if key not in ids:
            continue
        for s, v in subrecs(d):
            if s == "INDX" and len(v) >= 3 and v[2] & 2:
                out[key] = struct.unpack_from("<H", v)[0]
                break
            if s in ("QOBJ", "ANAM"):
                break
    return out


def fragment_guards(pex, function, global_of, target_prop):
    """
    What a fragment checks before it starts a quest or sets its stage: (counters, comparisons), where counters are the
    globals it adds one to and comparisons are (global, operator, number) on a global's value. `global_of` maps a
    property's variable, lower case ("::enterwindhelmcount_var"), to its global's EDID; `target_prop` is the quest's.
    """
    fn = next((f for _, f in functions(pex) if f["name"].lower() == function.lower()), None)
    if not fn:
        return set(), []
    temps, counters, compares = {}, set(), []
    for op, args in fn["code"]:
        vals = [a[1] for a in args]
        var = str(vals[1]).lower() if len(vals) >= 2 else ""
        if op == "callmethod" and len(vals) >= 3 and str(vals[0]).lower() in ("getvalueint", "getvalue") and var in global_of:
            temps[vals[2]] = global_of[var]
        elif op == "propget" and len(vals) >= 3 and str(vals[0]).lower() == "value" and var in global_of:
            temps[vals[2]] = global_of[var]
        elif op in ("iadd", "fadd") and len(vals) >= 3 and vals[1] in temps and vals[2] == 1:
            temps[vals[0]] = temps[vals[1]]
            counters.add(temps[vals[1]])
        elif op.startswith("cmp_") and len(vals) >= 3 and vals[1] in temps and isinstance(vals[2], (int, float)):
            compares.append((temps[vals[1]], op[4:], vals[2]))
        elif op == "callmethod" and len(vals) >= 2 and str(vals[0]).lower() in ("start", "setstage") and var == target_prop:
            break
    return counters, compares


def own_level(pex, props):
    """The player level a script waits for before it starts its quest: GetLevel compared with a number or a property of its quest."""
    level = None
    for _, f in functions(pex):
        temps = set()
        for op, args in f["code"]:
            vals = [a[1] for a in args]
            if op == "callmethod" and len(vals) >= 3 and str(vals[0]).lower() == "getlevel":
                temps.add(vals[2])
            elif op in ("cmp_ge", "cmp_gt") and len(vals) >= 3 and vals[1] in temps:
                v = vals[2]
                if isinstance(v, str) and v.lower().startswith("::") and v.lower().endswith("_var"):
                    v = props.get(v[2:-4].lower(), 0)  # a property the quest doesn't set is 0: no level to wait for
                    v = v.get("int", v.get("value")) if isinstance(v, dict) else v
                if isinstance(v, (int, float)):
                    level = int(v) + (1 if op == "cmp_gt" else 0)
    return level


def guards_words(counters, compares, place, event):
    """A helper's start in words: "It starts by itself at night in Windhelm, after you've come in four times."."""
    hours = {op: v for g, op, v in compares if g.lower() == "gamehour"}
    night = "ge" in hours and "lt" in hours and hours["ge"] > hours["lt"]  # 19:00 or later, or before 7:00
    text = "It starts by itself" + (" at night" if night else "") + (f" in {place}" if place else (f" on {event}" if event else ""))
    for g, op, v in compares:
        if g.lower() == "gamehour":
            continue
        if g in counters and op in ("ge", "gt") and event == "change location":
            n = int(v) + (1 if op == "gt" else 0)
            text += f", after you've come in {NUMBERS.get(n, f'{n} times')}"
        else:
            text += f", when {g} {dict(ge='>=', gt='>', lt='<', le='<=', eq='==', ne='!=').get(op, op)} {num(v)}"
    return text + "."


def read_dialogue(buf, name, wanted, strings=None):
    """
    The INFOs in `wanted`: their topic (and its prompt, FULL), the topic's quest, their own prompt (RNAM), their
    response lines (NAM1), a shared INFO they take their lines from (DNAM), and their conditions.
    """
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    strings = strings or {}

    def txt(v, kind):
        if loc and len(v) == 4:
            return strings.get(kind, {}).get(struct.unpack_from("<I", v)[0], "")
        return v.rstrip(b"\0").decode("utf-8", "replace")

    out = {}
    if b"DIAL" not in buf:
        return out
    topic = None
    for o in iter_group(buf, "DIAL"):
        t = buf[o:o + 4]
        if t == b"INFO":
            key = form_id(resolve(struct.unpack_from("<I", buf, o + 12)[0], masters, name))
            if key not in wanted:
                continue
        elif t != b"DIAL":
            continue
        tt, flags, fid, d = rec_data(buf, o)
        subs = subrecs(d)
        if tt == "DIAL":
            topic = {"id": form_id(resolve(fid, masters, name)), "edid": "", "prompt": "", "quest": None}
            for s, v in subs:
                if s == "EDID":
                    topic["edid"] = v.rstrip(b"\0").decode("latin1")
                elif s == "FULL":
                    topic["prompt"] = txt(v, "STRINGS")
                elif s == "QNAM" and len(v) >= 4:
                    topic["quest"] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
            continue
        info = {"plugin": name, "topic": dict(topic) if topic else None, "prompt": None, "lines": [], "shared": None, "conditions": []}
        for s, v in subs:
            if s == "RNAM":
                info["prompt"] = txt(v, "STRINGS")
            elif s == "NAM1":
                line = txt(v, "ILSTRINGS")
                if line:
                    info["lines"].append(line)
            elif s == "DNAM" and len(v) >= 4:
                info["shared"] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
            elif s == "CTDA" and len(v) >= 24:
                info["conditions"].append(qst.ctda(v, masters, name))
        out[key] = info
    return out


def read_races(buf, name, npcs, strings=None):
    """{npc: race id} for the NPCs in `npcs`, and {race: name} for every race the plugin has."""
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    strings = strings or {}
    race_of, race_names = {}, {}
    if b"NPC_" in buf and npcs:
        for o in iter_group(buf, "NPC_"):
            key = form_id(resolve(struct.unpack_from("<I", buf, o + 12)[0], masters, name))
            if key not in npcs:
                continue
            _, _, fid, d = rec_data(buf, o)
            for s, v in subrecs(d):
                if s == "RNAM" and len(v) >= 4:
                    race_of[key] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
    if b"RACE" in buf:
        for o in iter_group(buf, "RACE"):
            _, _, fid, d = rec_data(buf, o)
            for s, v in subrecs(d):
                if s == "FULL":
                    race_names[form_id(resolve(fid, masters, name))] = (strings.get(struct.unpack_from("<I", v)[0], "") if loc and len(v) == 4
                                                                        else v.rstrip(b"\0").decode("utf-8", "replace"))
                    break
    return race_of, race_names


SCENE_TOPICS = ("DATA", "PTOP", "NTOP", "NETO", "QTOP")  # a dialogue action's topic; a player dialogue action's choices


def read_scenes(buf, name):
    """
    Every scene's dialogue: {topic: [{scene, id, quest, alias}]}, the scene action that speaks the topic and the alias
    of the scene's quest that acts it. A scene's lines carry no GetIsID; the speaker is the actor in that alias.
    """
    masters = header(buf)
    out = {}
    if b"SCEN" not in buf:
        return out
    for o in iter_group(buf, "SCEN"):
        t, flags, fid, d = rec_data(buf, o)
        if t != "SCEN":
            continue
        edid, quest, said, action = "", None, [], None
        for s, v in subrecs(d):
            if s == "EDID":
                edid = v.rstrip(b"\0").decode("latin1")
            elif s == "PNAM" and action is None and len(v) >= 4:  # a package action has a PNAM of its own
                quest = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
            elif s == "ANAM":
                action = {"type": struct.unpack_from("<H", v)[0], "alias": None} if len(v) >= 2 else None
            elif action is not None and s == "ALID" and len(v) >= 4:
                action["alias"] = struct.unpack_from("<i", v)[0]
            elif action is not None and action["type"] in (0, 3) and s in SCENE_TOPICS and len(v) == 4 and struct.unpack_from("<I", v)[0]:
                said.append((form_id(resolve(struct.unpack_from("<I", v)[0], masters, name)), action["alias"]))
        sid = form_id(resolve(fid, masters, name))
        for topic, alias in said:
            out.setdefault(topic, []).append({"scene": edid or sid, "id": sid, "quest": quest, "alias": alias})
    return out


def read_voices(buf, name, voices):
    """{voice type: {npc}} for the voice types in `voices` (NPC_ VTCK), from one plugin."""
    masters = header(buf)
    out = {}
    if b"NPC_" not in buf or not voices:
        return out
    for o in iter_group(buf, "NPC_"):
        t, flags, fid, d = rec_data(buf, o)
        if t != "NPC_":
            continue
        for s, v in subrecs(d):
            if s == "VTCK" and len(v) >= 4:
                vt = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
                if vt in voices:
                    out.setdefault(vt, set()).add(form_id(resolve(fid, masters, name)))
                break
    return out


def read_links(buf, name, topics):
    """
    The dialogue lines that lead on to a topic in `topics` (TCLT): {topic: [{info, topic, quest, conditions}]}. The
    player's reply in a linked topic is answered by whoever spoke the line before it.
    """
    masters = header(buf)
    out = {}
    if b"DIAL" not in buf or not topics:
        return out
    topic = None
    for o in iter_group(buf, "DIAL"):
        t = buf[o:o + 4]
        if t not in (b"DIAL", b"INFO"):
            continue
        if t == b"INFO" and b"TCLT" not in buf[o + 24:o + 24 + struct.unpack_from("<I", buf, o + 4)[0]] and not struct.unpack_from("<I", buf, o + 8)[0] & 0x40000:
            continue  # no link, and not compressed (a compressed record is read to look)
        tt, flags, fid, d = rec_data(buf, o)
        subs = subrecs(d)
        if tt == "DIAL":
            q = [form_id(resolve(struct.unpack_from("<I", v)[0], masters, name)) for s, v in subs if s == "QNAM" and len(v) >= 4]
            topic = {"id": form_id(resolve(fid, masters, name)), "quest": q[0] if q else None}
            continue
        for s, v in subs:
            if s == "TCLT" and len(v) >= 4 and topic:
                to = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
                if to in topics:
                    out.setdefault(to, []).append({"info": form_id(resolve(fid, masters, name)), "topic": topic["id"], "quest": topic["quest"], "plugin": name,
                                                   "conditions": [qst.ctda(c, masters, name) for k, c in subs if k == "CTDA" and len(c) >= 24]})
    return out


def read_packages(buf, name):
    """
    ({topic: [package]}, {package: [(quest, alias)]}): the packages whose dialogue procedure says a topic (PDTO, a
    forcegreet), and the quest aliases that run each package (ALPC). The speaker is whoever fills that alias.
    """
    masters = header(buf)
    topics, runs = {}, {}
    if b"PACK" in buf:
        for o in iter_group(buf, "PACK"):
            t, flags, fid, d = rec_data(buf, o)
            if t != "PACK":
                continue
            for s, v in subrecs(d):
                if s == "PDTO" and len(v) >= 8 and struct.unpack_from("<I", v)[0] == 0 and struct.unpack_from("<I", v, 4)[0]:
                    topics.setdefault(form_id(resolve(struct.unpack_from("<I", v, 4)[0], masters, name)), []).append(form_id(resolve(fid, masters, name)))
    if b"QUST" in buf:
        for o in iter_group(buf, "QUST"):
            t, flags, fid, d = rec_data(buf, o)
            if t != "QUST" or b"ALPC" not in d:
                continue
            quest, alias = form_id(resolve(fid, masters, name)), None
            for s, v in subrecs(d):
                if s in ("ALST", "ALLS") and len(v) >= 4:
                    alias = struct.unpack_from("<I", v)[0]
                elif s == "ALED":
                    alias = None
                elif s == "ALPC" and alias is not None and len(v) >= 4:
                    runs.setdefault(form_id(resolve(struct.unpack_from("<I", v)[0], masters, name)), []).append((quest, alias))
    return topics, runs


# ---- starters ------------------------------------------------------------------------------------

def objective_stage(qid, objective, events):
    """The lowest stage whose own fragment shows `objective` (SetObjectiveDisplayed), or None."""
    shown = [c["stage"] for c, e in events if c.get("quest") == qid and c["kind"] == "quest" and c.get("stage") is not None
             and e["call"] == "SetObjectiveDisplayed" and e.get("objective") == objective and e.get("via") in (None, qid)]
    return min(shown) if shown else None


def admits(conds, qid, stage):
    """Whether a line's conditions on its own quest's stage allow it at `stage` (the others aren't judged here)."""
    ops = {"==": lambda a, b: a == b, "!=": lambda a, b: a != b, ">": lambda a, b: a > b, ">=": lambda a, b: a >= b, "<": lambda a, b: a < b, "<=": lambda a, b: a <= b}
    for c in conds:
        if c.get("or"):
            return True  # an OR group could let it through; not judged
        if c["fn"] == "GetStage" and c.get("param") == qid and "value" in c and c["cmp"] in ops and not ops[c["cmp"]](stage, c["value"]):
            return False
        if c["fn"] == "GetStageDone" and c.get("param") == qid and c.get("value") == 1 and c["cmp"] == "==" and c.get("stage", 0) > stage:
            return False
    return True


def catch_up(conds, qid, upto):
    """Whether a line is still offered past `upto` by its own quest's stage condition (stage < 30 when the next step is 20)."""
    return any(c["fn"] == "GetStage" and c.get("param") == qid and c["cmp"] in ("<", "<=") and (c.get("value") or 0) > upto + (0 if c["cmp"] == "<" else -1)
               for c in conds)


def first_objective_stage(qid, quest, events):
    """The stage that shows a quest's first objective (its own fragment calling SetObjectiveDisplayed), else its first journal stage."""
    objectives = sorted(o["index"] for o in quest.get("objectives", []))
    if objectives:
        shown = objective_stage(qid, objectives[0], events)
        if shown is not None:
            return shown
    logged = [s["index"] for s in quest.get("stages", []) if s.get("log")]
    return min(logged) if logged else 10


def second_step(qid, quest, first_stage, events):
    """
    The calls that move a quest from its first objective to its second: SetStage past the first objective's stage, up
    to the stage that shows the second objective, from dialogue, an alias's or the quest's own script outside its
    stage fragments, or another quest's script. Often the real test (Kodlak's join line, Faralda's spell at the
    bridge). Returns (second objective, its stage, [(ctx, ev)]).
    """
    objectives = sorted(o["index"] for o in quest.get("objectives", []))
    if len(objectives) < 2:
        return None, None, []
    stage = objective_stage(qid, objectives[1], events)
    if stage is None or stage <= first_stage:
        return objectives[1], stage, []
    moves = [(c, e) for c, e in events if e.get("quest") == qid and e["call"] == "SetStage" and e.get("stage") is not None
             and first_stage < e["stage"] <= stage and not (c["kind"] == "quest" and c.get("fragment") and c.get("quest") == qid and e.get("via") in (None, qid))]
    return objectives[1], stage, moves


def classify_starts(qid, order, events, threshold, here=None):
    """
    The calls on a quest from outside it, sorted: started (Start, or SetStage to its first objective's stage or below,
    from anything but a later quest in the story), caught up (a later quest in the story setting its stage) and
    advanced (a stage past the first objective's). `order` is {quest id: place in the story}; `here` is the quest's
    place when it isn't on the story itself (a helper quest takes the place of the story quest it serves).
    """
    out = {"started": [], "caughtUp": [], "advanced": []}
    here = order.get(qid, -1) if here is None else here
    for ctx, ev in events:
        if ev.get("quest") != qid or ev["call"] not in ("Start", "SetStage"):
            continue
        caller = ctx.get("quest")
        own = ctx["kind"] in ("quest", "alias") and caller == qid and ev.get("via") in (None, qid)
        # Its own scripts move it along, except a quest script outside its stage fragments that starts it: LoreRim's
        # ccStartAfterChargenScript sets a Creation Club quest's first stage once you're the level it asks (WO-121b).
        if own and not (ctx["kind"] == "quest" and ctx.get("fragment") is False and (ev["call"] == "Start" or (ev.get("stage") is not None and ev["stage"] <= threshold))):
            continue
        row = (ctx, ev)
        if caller in order and order[caller] > here and caller != qid:
            out["caughtUp"].append(row)
        elif ev["call"] == "SetStage" and ev.get("stage", 0) > threshold:
            out["advanced"].append(row)
        else:
            out["started"].append(row)
    return out


# ---- settings loaders ----------------------------------------------------------------------------

def read_ini(path):
    cp = configparser.ConfigParser(interpolation=None, strict=False)
    cp.optionxform = str
    try:
        cp.read(path, encoding="utf-8")
    except (configparser.Error, UnicodeDecodeError):
        return {}
    return {f"{k}:{sec}": v for sec in cp.sections() for k, v in cp.items(sec)}


def mcm_settings(dirs, overwrite):
    """
    Every MCM Helper mod's settings: {mod: {"folder", "defaults": {key: value}, "user": {key: value}, "userFrom"}}.
    Keys are "name:section" as the MCM script asks for them. `dirs` are the enabled mod folders, highest priority first.
    """
    out = {}
    for d in reversed(dirs):  # lowest first, so a higher folder's copy wins
        cfg = os.path.join(d, "MCM", "Config")
        if os.path.isdir(cfg):
            for mod in os.listdir(cfg):
                ini = os.path.join(cfg, mod, "settings.ini")
                if os.path.exists(ini):
                    out[mod] = {"folder": os.path.basename(d), "defaults": read_ini(ini), "user": {}, "userFrom": None}
    for d in list(reversed(dirs)) + [overwrite]:
        user = os.path.join(d, "MCM", "Settings")
        if not os.path.isdir(user):
            continue
        for f in os.listdir(user):
            mod = os.path.splitext(f)[0]
            if f.lower().endswith(".ini") and mod in out:
                out[mod]["user"].update(read_ini(os.path.join(user, f)))
                out[mod]["userFrom"] = os.path.basename(d)
    return out


def setting_value(mod, key):
    """(value, where from): the user's MCM/Settings value, else the settings.ini default."""
    if key in mod["user"]:
        return mod["user"][key], f"MCM/Settings in {mod['userFrom']}"
    if key in mod["defaults"]:
        return mod["defaults"][key], f"settings.ini in {mod['folder']}"
    return None, None


def settings_globals(pex, props, prop_value):
    """
    What an MCM script carries from its settings into globals: [(global id, setting key, function)], read from
    GetModSettingInt/Float/Bool(key) followed (through casts) by SetValue on a global property.
    """
    obj = pex["objects"][0] if pex["objects"] else {"properties": []}
    autovars = {p["autovar"].lower(): p["name"].lower() for p in obj["properties"] if p.get("autovar")}
    out = []
    for _, f in functions(pex):
        env = {}
        for op, args in f["code"]:
            if op in ("assign", "cast") and args[0][0] == IDENT and args[1][0] == IDENT:
                env[args[0][1].lower()] = env.get(args[1][1].lower())
            elif op == "callmethod":
                fn = args[0][1].lower()
                dest = args[2][1].lower() if args[2][0] == IDENT else None
                extra = args[3:]
                if fn in MCM_GETTERS and extra and extra[0][0] == STRING and dest:
                    env[dest] = ("mcm", extra[0][1])
                elif fn in SETTERS and args[1][0] == IDENT and extra:
                    src = env.get(extra[0][1].lower()) if extra[0][0] == IDENT else None
                    pname = autovars.get(args[1][1].lower())
                    if src and pname and pname in props:
                        g = prop_value(props[pname], None)
                        if g and g.get("form"):
                            out.append((g["form"], src[1], f["name"]))
                elif dest:
                    env[dest] = None
    return out


def mcm_flow(pex, key):
    """
    When an MCM Helper script applies one setting: whether OnConfigInit loads settings on a new game, what guards a
    migration that copies globals into settings, and whether OnGameReload reloads them. Read from the code.
    """
    funcs = {f["name"].lower(): f for _, f in functions(pex)}

    def calls(f, name):
        return any(op in ("callmethod", "callparent") and args[0][1].lower() == name for op, args in f["code"]) if f else False

    def assigns_true(f, var):
        return any(op == "assign" and args[0][1].lower() == var and args[1] == (5, True) for op, args in f["code"]) if f else False

    init, reload_, load = funcs.get("onconfiginit"), funcs.get("ongamereload"), funcs.get("loadsettings")
    migrate = funcs.get("migratetomcmhelper")
    guard = None
    if reload_ and migrate:
        for op, args in reload_["code"]:
            if op == "not" and args[1][0] == IDENT:
                guard = args[1][1]
                break
    reload_key = None
    if reload_:
        for op, args in reload_["code"]:
            if op == "callmethod" and args[0][1].lower() in MCM_GETTERS and len(args) > 3 and args[3][0] == STRING:
                reload_key = args[3][1]
    # LoadSettings may hand the work to the script's own functions (Wyrmstooth's calls Load): follow self calls a few deep.
    reach, todo, gate = [], ["loadsettings"], None
    while todo and len(reach) < 6:
        fname = todo.pop(0)
        f = funcs.get(fname)
        if not f or fname in reach:
            continue
        reach.append(fname)
        for op, args in f["code"]:
            if op == "callmethod" and args[1] == (IDENT, "self") and args[0][1].lower() in funcs:
                todo.append(args[0][1].lower())
            if gate is None and fname == "loadsettings" and op == "callmethod" and args[0][1].lower() in MCM_GETTERS and len(args) > 3 and args[3][0] == STRING:
                gate = args[3][1]  # the first setting LoadSettings checks before it does anything (bEnabled)
    reads_in = next((funcs[f]["name"] for f in reach if any(op == "callmethod" and args[0][1].lower() in MCM_GETTERS and len(args) > 3 and args[3][1] == key
                                                         for op, args in funcs[f]["code"])), None)
    load_reads = bool(reads_in)
    migrate_copies = bool(migrate) and any(op == "callmethod" and args[0][1].lower().startswith("setmodsetting") and len(args) > 3 and args[3][1] == key
                                           for op, args in migrate["code"])
    return {"initLoads": calls(init, "loadsettings"), "initSetsGuard": bool(guard) and assigns_true(init, guard.lower()), "guard": guard,
            "reloadMigrates": calls(reload_, "migratetomcmhelper"), "reloadLoadsIf": reload_key, "loadReadsKey": load_reads,
            "migrateCopiesKey": migrate_copies, "readsIn": reads_in, "gate": gate}


class StoryAnalyzer(qsc.Analyzer):
    """WO-102's analyzer, also recording SetValue on globals, SetObjectiveDisplayed, shouts and words taught, and AddShout."""

    def event(self, fl, fn, target, rest, owner):
        if target and fl in SETTERS and target.get("type") == "GLOB" and rest:
            return {"call": "SetValue", "global": target["form"], "value": rest[0].get("int") if rest[0] else None}
        if target and fl == "addshout" and target.get("player"):
            return {"call": "AddShout", "item": rest[0] if rest else None}
        if target and fl == "setobjectivedisplayed" and target.get("self") and owner.get("quest") and not owner.get("info") and rest and rest[0] and "int" in rest[0]:
            return {"call": "SetObjectiveDisplayed", "quest": owner["quest"], "objective": int(rest[0]["int"])}
        if target and fl == "start" and target.get("form") and "quest" not in target and self.names.get(target["form"], {}).get("type") != "QUST":
            return {"call": "StartScene", "scene": target["form"]}  # matched to a SCEN later; other forms never match
        return super().event(fl, fn, target, rest, owner)

    def static_event(self, cls, fn, rest, owner):
        if cls == "game" and fn in ("teachword", "unlockword"):
            return {"call": "TeachWord" if fn == "teachword" else "UnlockWord", "item": rest[0] if rest else None}
        return None


def global_fact(gid, gv, loaders, setters, names):
    """A global's record value, what a settings loader or script makes it at run time, and the verdict."""
    versions = gv.get(gid, [])
    rec = {"id": gid, "edid": names.get(gid, {}).get("edid") or gid}
    if versions:
        rec["record"] = versions[-1][1]
        rec["recordFrom"] = versions[-1][0]
        if len(versions) > 1 and versions[0][1] != versions[-1][1]:
            rec["recordWas"] = {"value": versions[0][1], "from": versions[0][0]}
    runtime, unread_settings = [], []
    for ld in loaders.get(gid, []):
        if ld.get("notRead"):
            unread_settings.append({"mod": ld["mod"], "key": ld["key"], "value": ld["value"], "from": ld["from"], "why": ld["why"]})
            continue
        runtime.append({"by": "settings loader", "mod": ld["mod"], "key": ld["key"], "value": ld["value"], "from": ld["from"], "script": ld["script"]})
    for s in setters.get(gid, []):
        runtime.append({"by": "script", "script": s["script"], "function": s["function"], "value": s["value"]})
    rec["runtime"] = runtime
    if unread_settings:
        rec["settingsNotRead"] = unread_settings
    values = {str(r["value"]) for r in runtime if r["value"] is not None}
    if len(values) > 1:
        rec["verdict"] = "conflict"
    elif unread_settings and not runtime:
        rec["value"] = rec.get("record")
        same = all(str(u["value"]).split(".")[0] == str(rec.get("record")).split(".")[0] for u in unread_settings)
        rec["verdict"] = "files" if same else "conflict"
    elif runtime and any(r["by"] == "settings loader" for r in runtime):
        rec["verdict"] = "run time"
        rec["value"] = next(r["value"] for r in runtime if r["by"] == "settings loader")
    elif runtime:
        rec["verdict"] = "run time"
    else:
        rec["verdict"] = "files"
        rec["value"] = rec.get("record")
    if "value" not in rec:
        rec["value"] = rec.get("record")
    return rec


# ---- what a reward list holds --------------------------------------------------------------------

def describe_list(lid, names, depth=0):
    """A levelled list in words: 'levelled: Steel Sword or Steel Mace', or 'levelled: gold and an item'."""
    n = names.get(lid, {})
    entries = list(dict.fromkeys(n.get("entries", [])))
    kinds, named = set(), []
    for e in entries:
        en = names.get(e, {})
        if en.get("type") == "MISC" and en.get("edid", "").lower().startswith("gold"):
            kinds.add("gold")
        elif en.get("type") == "LVLI":
            inner = describe_list(e, names, depth + 1) if depth < 2 else ""
            kinds.add("gold" if inner == "levelled: gold" else "item")
        else:
            kinds.add("item")
            named.append(en.get("name") or en.get("edid") or e)
    if kinds == {"item"} and 0 < len(named) <= 3 and len(named) == len(entries):
        return "levelled: " + " or ".join(named)
    words = [w for w in ("gold", "item") if w in kinds]
    return "levelled: " + " and ".join("gold" if w == "gold" else "an item" for w in words) if words else "levelled: nothing"


def item_text(ev, names):
    """An AddItem's item in words, with a count and what a reward list holds."""
    it = qsc.item_of(ev, names)
    if not it:
        return None
    if it.get("gold"):
        return f"{it['count']} gold" if isinstance(it.get("count"), int) else "gold (an amount the script works out)"
    if it.get("type") == "LVLI":
        text = f"{it['name']} ({describe_list(it['id'], names)})"
    else:
        text = it["name"]
    return text + (f" x{it['count']}" if isinstance(it.get("count"), int) and it["count"] != 1 else "")


def read_events(quests, infos, names, scripts):
    """Every call the quests' and dialogue lines' scripts make, read from the winning .pex files."""
    quest_props = {q: {k: v for sc in (x.get("vmad") or {}).get("scripts", []) for k, v in sc["props"].items()} for q, x in quests.items()}
    quest_script_list = {q: [(sc["name"], sc["props"]) for sc in (x.get("vmad") or {}).get("scripts", [])] for q, x in quests.items()}
    an = StoryAnalyzer(scripts, names, {q: v["aliases"] for q, v in quests.items()}, quest_props, quest_script_list)
    events = []
    for qid, q in quests.items():
        vm = q.get("vmad")
        if not vm:
            continue
        frag = {}
        for fr in vm.get("fragments", []):
            frag.setdefault(fr["script"].lower(), {})[fr["function"].lower()] = fr["stage"]
        for sc in vm["scripts"]:
            fm = frag.get(sc["name"].lower())
            for ev in an.run(sc["name"], sc["props"], {"quest": qid}, list(fm) if fm else None):
                events.append(({"kind": "quest", "quest": qid, "script": sc["name"], "stage": fm.get(ev["function"].lower()) if fm else None,
                                "fragment": bool(fm)}, ev))
        for asc in vm.get("aliasScripts", []):
            a = q["aliases"].get(asc["alias"], {})
            for sc in asc["scripts"]:
                for ev in an.run(sc["name"], sc["props"], {"alias": a.get("name"), "quest": qid}):
                    events.append(({"kind": "alias", "quest": qid, "alias": a.get("name"), "script": sc["name"]}, ev))
    for iid, info in infos.items():
        vm = info["vmad"]
        for fr in vm.get("fragments", []):
            props = next((s["props"] for s in vm["scripts"] if s["name"].lower() == fr["script"].lower()), {})
            for ev in an.run(fr["script"], props, {"info": iid, "quest": info["quest"]}, [fr["function"]]):
                events.append(({"kind": "dialogue", "info": iid, "quest": info["quest"], "speaker": info["speaker"], "script": fr["script"]}, ev))
    return events, scripts, an, quest_props, quest_script_list


# ---- the check -----------------------------------------------------------------------------------

def main():
    from esp import ROOT, load_order, plugin_paths
    from pex import Scripts, read_pex
    from quest_givers import place, where_text

    line_id = sys.argv[1] if len(sys.argv) > 1 else "main-quest"
    version = sys.argv[2] if len(sys.argv) > 2 else "5.0.4.8"
    base = os.path.join(REPO, "gamedata", version)
    load = lambda n: json.load(open(os.path.join(base, n), encoding="utf-8"))  # noqa: E731
    lines = json.load(open(os.path.join(REPO, "src", "data", f"lorerim-{version}", "quests.json"), encoding="utf-8"))["lines"]
    line = next(l for l in lines if l["id"] == line_id)
    raw = {q["edid"].lower(): q for q in load("quests_raw.json")["quests"]}
    story = [raw[q["edid"].lower()] for q in line["quests"] if q["edid"].lower() in raw]
    missing_edids = [q["edid"] for q in line["quests"] if q["edid"].lower() not in raw]
    story_ids = {q["id"] for q in story}
    order = {q["id"]: i for i, q in enumerate(story)}

    pp, lo = plugin_paths(), load_order(cc=True)  # with the Creation Club plugins and their archives (WO-121b)
    quests, infos, names, nodes = {}, {}, {}, {}
    qv, iv, gv = {}, {}, {}
    inventories, alias_items, script_targets, objective_targets = {}, {}, {}, {}
    quest_plugin, info_plugin = {}, {}
    plugins = []
    # SC_PHASE=A reads the plugins and stops, B reads the scripts and stops, C writes the report; each picks up the
    # one before from a cache, so a run fits a short window (the PC bridge's three minutes). Unset runs all three.
    phase = os.environ.get("SC_PHASE")
    cache = os.path.join(base, "story_checks", f".{line_id}.cache.pkl")
    startup = {}
    pass1 = ("quests", "infos", "names", "nodes", "qv", "iv", "gv", "inventories", "alias_items", "script_targets", "objective_targets",
             "quest_plugin", "info_plugin", "plugins", "startup")
    if phase in ("B", "C"):
        with open(cache, "rb") as f:
            c = pickle.load(f)
        (quests, infos, names, nodes, qv, iv, gv, inventories, alias_items, script_targets, objective_targets,
         quest_plugin, info_plugin, plugins, startup) = (c[k] for k in pass1)
    for n in (lo if phase not in ("B", "C") else []):
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = name_strings(p, n, loc, ROOT)
        try:
            got = qsc.read_plugin(buf, n, strings)
            st = qst.read_plugin(buf, n, story_ids, strings)
            nodes.update(read_nodes(buf, n))
            objective_targets.update(read_objective_targets(buf, n, story_ids))
            startup.update(read_startup(buf, n, story_ids))
        except Exception as e:  # a plugin the reader can't follow is listed, never fatal
            print("skip", n, e, file=sys.stderr)
            continue
        quests.update(got["quests"])
        for k in got["quests"]:
            quest_plugin[k] = n
        infos.update(got["infos"])
        for k in got["infos"]:
            info_plugin[k] = n
        names.update(got["names"])
        names.update({k: v for k, v in st["names"].items() if k not in names or not names[k].get("name")})
        for k, q in st["quests"].items():
            qv.setdefault(k, []).append((n, q))
        for k, i in st["infos"].items():
            iv.setdefault(k, []).append((n, i))
        for k, v in st["globals"].items():
            gv.setdefault(k, []).append((n, v))
        inventories.update(st["inventories"])
        for a in st["aliasItems"]:
            alias_items[(a["quest"], a["alias"])] = a
        script_targets.update(st["scriptTargets"])
        plugins.append((n, p, loc))
    print(f"read {len(quests)} quests, {len(infos)} scripted dialogue lines, {len(nodes)} story manager nodes", flush=True)

    if phase == "A":
        os.makedirs(os.path.dirname(cache), exist_ok=True)
        with open(cache, "wb") as f:
            pickle.dump(dict(zip(pass1, (quests, infos, names, nodes, qv, iv, gv, inventories, alias_items, script_targets, objective_targets,
                                         quest_plugin, info_plugin, plugins, startup))), f)
        print("phase A cached", flush=True)
        return

    pass2 = ("events", "scripts", "an", "quest_props", "quest_script_list")
    if phase == "C":
        with open(cache + ".b", "rb") as f:
            c = pickle.load(f)
        events, scripts, an, quest_props, quest_script_list = (c[k] for k in pass2)
    else:
        events, scripts, an, quest_props, quest_script_list = read_events(quests, infos, names, Scripts(ROOT, lo))
    if phase == "B":
        with open(cache + ".b", "wb") as f:
            pickle.dump(dict(zip(pass2, (events, scripts, an, quest_props, quest_script_list))), f)
        print("phase B cached", flush=True)
        return
    print(f"{len(events)} script calls read", flush=True)

    # Settings loaders: MCM Helper mods, and which global each setting lands in.
    mods = [l.strip()[1:] for l in open(os.path.join(ROOT, "profiles", "Ultra", "modlist.txt"), encoding="utf-8", errors="ignore") if l.startswith("+")]
    dirs = [os.path.join(ROOT, "mods", d) for d in mods]
    mcm = mcm_settings(dirs, os.path.join(ROOT, "overwrite"))
    loader_scripts = {}
    for modname, m in mcm.items():
        for sdname in ("Scripts", "scripts"):
            sd = os.path.join(ROOT, "mods", m["folder"], sdname)
            if os.path.isdir(sd):
                for f in os.listdir(sd):
                    if f.lower().endswith(".pex"):
                        loader_scripts[f[:-4].lower()] = modname
                break
    loaders, loader_quests = {}, {}
    for qid, q in quests.items():
        for sc in (q.get("vmad") or {}).get("scripts", []):
            modname = loader_scripts.get(sc["name"].lower())
            if not modname:
                continue
            p = scripts.get(sc["name"])
            if not isinstance(p, dict):
                continue
            kind, where = scripts.where(sc["name"])
            own_path = next((os.path.join(ROOT, "mods", mcm[modname]["folder"], d, sc["name"] + ".pex") for d in ("Scripts", "scripts")
                             if os.path.exists(os.path.join(ROOT, "mods", mcm[modname]["folder"], d, sc["name"] + ".pex"))), None)
            winner_reads = settings_globals(p, sc["props"], an.prop_value)
            info = {"quest": qid, "script": sc["name"], "winner": where, "winnerParent": p["objects"][0]["parent"] if p["objects"] else None,
                    "readsSettings": bool(winner_reads)}
            loader_quests[modname] = info
            for g, key, fn in winner_reads:
                value, src = setting_value(mcm[modname], key)
                row = {"mod": modname, "key": key, "value": value, "from": src, "script": f"{sc['name']}.{fn}"}
                if not any(r["key"] == key and r["mod"] == modname for r in loaders.get(g, [])):
                    loaders.setdefault(g, []).append(row)
            if own_path and os.path.normpath(own_path) != os.path.normpath(where or ""):
                try:
                    own = read_pex(open(own_path, "rb").read())
                except Exception:  # noqa: BLE001
                    own = None
                if own:
                    won = {(g, k) for g, k, _ in winner_reads}
                    for g, key, fn in settings_globals(own, sc["props"], an.prop_value):
                        if (g, key) in won:
                            continue
                        value, src = setting_value(mcm[modname], key)
                        row = {"mod": modname, "key": key, "value": value, "from": src, "script": f"{sc['name']}.{fn}", "notRead": True,
                               "why": f"the winning {sc['name']} ({where}, extends {info['winnerParent']}) doesn't read it"}
                        if not any(r["key"] == key and r["mod"] == modname for r in loaders.get(g, [])):
                            loaders.setdefault(g, []).append(row)
    setters = {}
    loader_quest_ids = {v["quest"] for v in loader_quests.values()}
    for ctx, ev in events:
        if ev["call"] == "SetValue" and ev.get("global") and ctx.get("script", "").lower() not in loader_scripts and ctx.get("quest") not in loader_quest_ids:
            setters.setdefault(ev["global"], []).append({"script": ctx["script"], "function": ev["function"], "value": ev.get("value")})

    # Starters, first objective targets, and who to place.
    thresholds = {q["id"]: first_objective_stage(q["id"], q, events) for q in story}
    sorted_starts = {q["id"]: classify_starts(q["id"], order, events, thresholds[q["id"]]) for q in story}
    forced = {}  # (quest, alias name) -> [what ForceRefTo puts there]
    for ctx, ev in events:
        if ev["call"] == "ForceRefTo" and ev.get("quest") and ev.get("to"):
            forced.setdefault((ev["quest"], ev["alias"].lower()), []).append(ev["to"])
    targets = {}
    for q in story:
        objs = objective_targets.get(q["id"], {})
        first = min(objs) if objs else None
        aliases = quests.get(q["id"], {}).get("aliases", {})
        targets[q["id"]] = [aliases[a] for a in objs.get(first, []) if a in aliases] if first is not None else []
    npcs, refs = set(), set()
    for ts in targets.values():
        for a in ts:
            if a.get("actor"):
                npcs.add(a["actor"])
            if a.get("ref"):
                refs.add(a["ref"])
            npcs |= set(a.get("isID", []))
    for (q, _), tos in forced.items():
        if q in story_ids:
            for t in tos:
                if t.get("form"):
                    refs.add(t["form"])
    route_infos = set()
    first_q = story[0]["id"] if story else None
    starts_raw = load("starts_raw.json")["starts"]
    start_quest_ids = set()
    for s in starts_raw:
        ids = [s["id"]] if s.get("id") else [o["id"] for o in s["options"] if o["id"] not in ("0", 0, None)]
        for oid in ids:
            num = oid if isinstance(oid, int) else int(oid, 16) if str(oid).lower().startswith("0x") else int(oid)
            start_quest_ids.add(f"{s['plugin']}:{num & 0xFFFFFF:06X}")
    for ctx, ev in sorted_starts.get(first_q, {}).get("started", []):
        if ctx["kind"] == "dialogue":
            route_infos.add(ctx["info"])
    seconds = {q["id"]: second_step(q["id"], q, thresholds[q["id"]], events) for q in story}
    quiet = {q["id"] for q in story if qv.get(q["id"]) and qv[q["id"]][-1][1]["flags"] & qst.START_GAME and startup.get(q["id"], 0) < thresholds[q["id"]]}
    route_infos |= {c["info"] for q in quiet for c, e in sorted_starts[q]["advanced"] if c["kind"] == "dialogue" and c.get("quest") == q
                    and seconds[q][1] is not None and e.get("stage") is not None and e["stage"] <= seconds[q][1]}
    for q in story:
        for ctx, ev in sorted_starts[q["id"]]["started"] + seconds[q["id"]][2]:
            if ctx["kind"] == "dialogue":
                route_infos.add(ctx["info"])
    route_infos |= {c["info"] for c, e in events if e["call"] == "StartScene" and c["kind"] == "dialogue" and c.get("quest") in story_ids}
    for iid in route_infos:
        if infos.get(iid, {}).get("speaker"):
            npcs.add(infos[iid]["speaker"])
        for a in quests.get(infos.get(iid, {}).get("quest"), {}).get("aliases", {}).values():
            if a.get("actor"):
                npcs.add(a["actor"])
            if a.get("ref"):
                refs.add(a["ref"])

    # Pass 2: the dialogue lines and the scenes and lines that name their speakers, then races and references
    # (doors, people, targets).
    dialogue, scenes, links, placed, package_topics, alias_packages, voiced = {}, {}, {}, {}, {}, {}, {}

    words_of = {}  # a dialogue line's speaker the records fill at run time, in words: "a Windhelm guard"

    def alias_holder(qid, al):
        """An alias of a quest and who it holds: (alias, npc, reference)."""
        a = quests.get(qid, {}).get("aliases", {}).get(al)
        if not a:
            return None, None, None
        return a, a.get("actor") or (placed.get(a.get("ref"), {}) or {}).get("base") or next(iter(a.get("isID", [])), None), a.get("ref")

    def alias_words(qid, a):
        """An alias filled from a location alias with a ref type, in words: "a Windhelm guard"; else None."""
        if not a.get("refType") or a.get("fromAliasId") is None:
            return None
        where = quests.get(qid, {}).get("aliases", {}).get(a["fromAliasId"], {})
        place = names.get(where.get("location"), {}).get("name")
        role = ROLE_WORDS.get((names.get(a["refType"], {}).get("edid") or "").lower())
        return f"a {place} {role}" if place and role else None

    def speaker_of(iid, d=None, ctx_quest=None, depth=0):
        """
        Who speaks a dialogue line: (npc, how named, the scene it's spoken in, reference). GetIsID on an NPC, else the
        alias GetIsAliasRef names, else the actor alias of the scene that speaks its topic, else whoever speaks the line
        that leads on to its topic (a player's reply is answered by the one who spoke before it).
        """
        d = dialogue.get(iid, {}) if d is None else d
        conds = d.get("conditions", [])
        spk = infos.get(iid, {}).get("speaker") or next((c["param"] for c in conds if c["fn"] == "GetIsID" and isinstance(c.get("param"), str)
                                                         and c["cmp"] == "==" and c.get("value") == 1), None)
        if spk:
            return spk, "GetIsID", None, None
        voice = next((c["param"] for c in conds if c["fn"] == "GetIsVoiceType" and isinstance(c.get("param"), str) and c["cmp"] == "==" and c.get("value") == 1), None)
        if voice and len(voiced.get(voice, ())) == 1:  # a voice only one NPC has names them (WO-121a: Frissa Black-Briar)
            return next(iter(voiced[voice])), f"the only NPC with voice type {names.get(voice, {}).get('edid') or voice}", None, None
        topic = d.get("topic") or {}
        tq = topic.get("quest") or ctx_quest
        al = next((c.get("param") or 0 for c in conds if c["fn"] == "GetIsAliasRef"), None)
        if al is not None:
            a, who, ref = alias_holder(tq, al)
            if a:
                if not who and alias_words(tq, a):
                    words_of[iid] = alias_words(tq, a)
                return who, f"alias {a['name']} of {quest_label(tq, names)} ({a['fill']})", None, ref
        for sc in scenes.get(topic.get("id"), []):
            a, who, ref = alias_holder(sc["quest"], sc["alias"])
            if a:
                return who, f"scene {sc['scene']}, alias {a['name']} of {quest_label(sc['quest'], names)} ({a['fill']})", sc["id"], ref
        for pk in package_topics.get(topic.get("id"), []):
            for q, al in alias_packages.get(pk, []):
                a, who, ref = alias_holder(q, al)
                if a:
                    return who, f"package {pk} (it says the topic), run by alias {a['name']} of {quest_label(q, names)} ({a['fill']})", None, ref
        if depth == 0:
            for ln in links.get(topic.get("id"), []):
                who, how, scene, ref = speaker_of(ln["info"], dict(ln, topic={"id": ln["topic"], "quest": ln["quest"]}), depth=1)
                if who or ref:
                    return who, f"the line before it ({ln['info']}), {how}", scene, ref
        return None, "GetIsID", None, None

    for n, p, loc in plugins:
        try:
            dialogue.update(read_dialogue(open(p, "rb").read(), n, route_infos, all_strings(p, n, loc, ROOT)))
        except Exception as e:  # noqa: BLE001
            print("skip dialogue", n, e, file=sys.stderr)
    # Shared lines: an INFO can take its response from another (DNAM).
    shared = {d["shared"] for d in dialogue.values() if d.get("shared") and not d["lines"]}
    link_topics = {d["topic"]["id"] for d in dialogue.values() if d.get("topic")}
    voices = {c["param"] for d in dialogue.values() for c in d.get("conditions", []) if c["fn"] == "GetIsVoiceType" and isinstance(c.get("param"), str)}
    for n, p, loc in plugins:
        buf = open(p, "rb").read()
        try:
            if shared:
                dialogue.update(read_dialogue(buf, n, shared, all_strings(p, n, loc, ROOT)))
            scenes.update(read_scenes(buf, n))  # the last plugin to carry a scene wins
            for vt, npcs_ in read_voices(buf, n, voices).items():
                voiced.setdefault(vt, set()).update(npcs_)
            pt, ap = read_packages(buf, n)
            package_topics.update(pt)
            for pk, rows in ap.items():
                alias_packages[pk] = rows  # the quest record that wins
            for t, rows in read_links(buf, n, link_topics).items():
                kept = {r["info"]: r for r in links.get(t, [])}
                kept.update({r["info"]: r for r in rows})  # a later plugin's copy of a line wins
                links[t] = list(kept.values())
        except Exception as e:  # noqa: BLE001
            print("skip scenes", n, e, file=sys.stderr)
    for iid in list(dialogue):
        who, _, _, ref = speaker_of(iid)
        if who:
            npcs.add(who)
        if ref:
            refs.add(ref)
    keys = {k for k, v in names.items() if v["type"] == "KEYM"}
    race_of, race_names = {}, {}
    dv, cells, tied, wanted_cells = {}, {}, {}, {}
    wanted = {t for ts in script_targets.values() for t in ts} | refs
    for n, p, loc in plugins:
        buf = open(p, "rb").read()
        tables = all_strings(p, n, loc, ROOT)
        try:
            ro, rn = read_races(buf, n, npcs, tables["STRINGS"] if tables else None)
            race_of.update(ro)
            race_names.update(rn)
            if b"CELL" in buf or b"WRLD" in buf:
                doors, pl, ce, ti, wc = qst.read_refs(buf, n, keys, npcs, tables["STRINGS"] if tables else None, story_ids, wanted)
                for k, d in doors.items():
                    dv.setdefault(k, []).append((n, d))
                placed.update(pl)
                cells.update(ce)
                for k, v in ti.items():
                    tied.setdefault(k, []).extend(v)
                wanted_cells.update(wc)
        except Exception as e:  # noqa: BLE001
            print("skip pass 2", n, e, file=sys.stderr)
    grid = {(c["world"], c["grid"][0], c["grid"][1]): cid for cid, c in cells.items() if c.get("world") and "grid" in c and not c.get("persistent")}
    for versions_d in dv.values():
        for _, d in versions_d:
            d["cell"] = qst.real_cell(d["cell"], d.get("pos"), cells, grid)
    for p in placed.values():
        p["cell"] = qst.real_cell(p["cell"], p.get("pos"), cells, grid) or p["cell"]
    door_cell = {k: v[-1][1]["cell"] for k, v in dv.items()}
    doors_into_cell = {}
    for did, vd in dv.items():
        d = vd[-1][1]
        into = door_cell.get(d["to"])
        if into and not d["deleted"] and into != d["cell"]:
            doors_into_cell.setdefault(into, []).append((did, vd))

    def cell_text(cid):
        c = cells.get(cid, {})
        parts = [c.get("name"), names.get(c.get("location"), {}).get("name")]
        parts = [x for x in parts if x and not x.lower().startswith("location for")]
        if not parts and c.get("world"):
            parts = [names.get(c["world"], {}).get("name")]
        return ", ".join(dict.fromkeys(x for x in parts if x)) or None

    def npc_where(npc):
        return [x for x in (where_text(r) for r in place(npc, placed, cells, names)) if x and not x.lower().startswith("location for")]

    def npc_cells(npc):
        return [r["cell"] for r in place(npc, placed, cells, names) if r.get("cell")]

    def holder(t):
        """What one ForceRefTo target is: an NPC (from a placed reference's base) or a thing."""
        if t.get("form"):
            p = placed.get(t["form"])
            if p and p.get("base"):
                return {"id": p["base"], "name": names.get(p["base"], {}).get("name") or p["base"], "ref": t["form"], "cell": p["cell"]}
            n = names.get(t["form"], {})
            return {"id": t["form"], "name": n.get("name") or n.get("edid") or t["form"]}
        if t.get("aliasRef") or t.get("alias"):
            who = t.get("actor") or t.get("ref")
            return {"id": who, "name": names.get(who, {}).get("name") or (t.get("aliasRef") or t.get("alias"))} if who else None
        return None

    def who_where(qid):
        """Who or what the first objective's target alias holds, and where that is."""
        out = []
        for a in targets.get(qid, []):
            row = {"alias": a["name"], "fill": a["fill"], "holds": [], "cells": []}
            if a.get("actor"):
                row["holds"].append({"name": names.get(a["actor"], {}).get("name") or a["actor"], "kind": "unique actor", "where": npc_where(a["actor"])})
                row["cells"] += npc_cells(a["actor"])
            if a.get("ref"):
                p = placed.get(a["ref"])
                base = p and p.get("base")
                row["holds"].append({"name": names.get(base, {}).get("name") or ("a marker" if base else a["ref"]), "kind": "forced reference",
                                     "where": [cell_text(p["cell"])] if p and cell_text(p["cell"]) else []})
                if p and p.get("cell"):
                    row["cells"].append(p["cell"])
            if a.get("location"):
                nm = names.get(a["location"], {}).get("name") or a["location"]
                if not nm.lower().startswith("location for"):
                    row["holds"].append({"name": nm, "kind": "location", "where": [nm]})
            if a.get("creates"):
                row["holds"].append({"name": names.get(a["creates"], {}).get("name") or a["creates"], "kind": "created item", "where": []})
            for npc in a.get("isID", []):
                row["holds"].append({"name": names.get(npc, {}).get("name") or npc, "kind": "named in its conditions", "where": npc_where(npc)})
                row["cells"] += npc_cells(npc)
            for t in forced.get((qid, a["name"].lower()), []):
                h = holder(t)
                if h and h["name"] not in [x["name"] for x in row["holds"]]:
                    where = [cell_text(h["cell"])] if h.get("cell") and cell_text(h["cell"]) else npc_where(h["id"]) if h.get("id") else []
                    row["holds"].append({"name": h["name"], "kind": "put there by a script (ForceRefTo)", "where": where})
                    if h.get("cell"):
                        row["cells"].append(h["cell"])
            row["holds"] = [h for h in row["holds"] if h["name"].lower() not in ROLES]
            out.append(row)
        return out

    def door_needs(qid, ww):
        """A door is a need only when it's the way into the first objective's target cell and no other way in is unlocked."""
        out = []
        for row in ww:
            for cid in dict.fromkeys(row["cells"]):
                ways = doors_into_cell.get(cid, [])
                if not ways or any(not vd[-1][1]["lock"] or vd[-1][1]["lock"]["level"] == 0 for _, vd in ways):
                    continue
                for did, vd in ways:
                    d = vd[-1][1]
                    lock = d["lock"]
                    frm = cell_text(d["cell"]) or "outside"
                    if lock["level"] == 255 or lock.get("key"):
                        kn = names.get(lock.get("key"), {})
                        carry = qst.carriers(lock["key"], inventories, list(alias_items.values()), placed, cells, names) if lock.get("key") else []
                        who = "; ".join(c["name"] + (f" in {c['places'][0]}" if c["places"] else "") for c in carry if c["kind"] != "placed")
                        text = f"The door from {frm} into {cell_text(cid) or 'it'} needs {('the ' + kn['name']) if kn.get('name') else 'a key'}" + (f", carried by {who}" if who else "") + "."
                    else:
                        text = f"The door from {frm} into {cell_text(cid) or 'it'} is locked ({LEVELS.get(lock['level'], lock['level'])})."
                    out.append({"door": did, "plugin": vd[-1][0], "text": text})
        return out

    def door_ways(ww):
        """For each target cell: how many doors lead in and how many of them are locked."""
        out = []
        for row in ww:
            for cid in dict.fromkeys(row["cells"]):
                ways = doors_into_cell.get(cid, [])
                if cells.get(cid, {}).get("world") is not None and not ways:
                    continue  # outdoors: you walk in
                locked = [w for w in ways if w[1][-1][1]["lock"] and w[1][-1][1]["lock"]["level"] != 0]
                out.append({"cell": cell_text(cid) or cid, "ways": len(ways), "locked": len(locked)})
        return out

    def gives(q):
        """AddItem on the player on its own completing stages, and items its aliases create in the player."""
        qid = q["id"]
        completing = {s["index"] for s in q["stages"] if s.get("completes")}
        out = []
        for ctx, ev in events:
            if (ctx.get("quest") == qid and ctx["kind"] == "quest" and ctx.get("fragment") and ctx.get("stage") in completing and ev.get("via") in (None, qid)
                    and ev["call"].lower() == "additem"):
                t = item_text(ev, names)
                if t:
                    out.append({"what": t, "stage": ctx["stage"], "source": f"{ctx['script']}.{ev['function']}", "verdict": "script"})
        aliases = quests.get(qid, {}).get("aliases", {})
        player_aliases = {i for i, a in aliases.items() if a.get("ref") == qsc.PLAYER_REF or a["name"].lower() in ("player", "playeralias", "playerref")}
        for a in aliases.values():
            if a.get("creates") and a.get("createIn") in player_aliases:
                out.append({"what": names.get(a["creates"], {}).get("name") or a["creates"], "stage": None, "source": f"alias {a['name']} (created in the player)", "verdict": "files"})
        return out

    def gvals_of(conds):
        """The values the globals in these conditions hold in play, wherever their records are (compared with one, or GetGlobalValue)."""
        out = {}
        for c in conds:
            for g in (c.get("global"), c.get("param") if c["fn"] == "GetGlobalValue" else None):
                if g and g not in out:
                    out[g] = {"value": global_fact(g, gv, loaders, setters, names)["value"]}
        return out

    def dialogue_conditions(iid, ctx_quest=None):
        """A dialogue line's conditions in words, globals resolved and aliases named."""
        conds = iv[iid][-1][1]["conditions"] if iv.get(iid) else dialogue.get(iid, {}).get("conditions")
        if conds is None:
            return None
        tq = ((dialogue.get(iid) or {}).get("topic") or {}).get("quest") or ctx_quest
        alias_names = {i: a["name"] for i, a in quests.get(tq, {}).get("aliases", {}).items()}
        return format_conditions(conds, names, gvals_of(conds), alias_names)

    def node_rows(qid):
        """The story manager nodes that start a quest, as starter rows."""
        out = []
        for ns in node_starts(qid, nodes):
            gvals = gvals_of(ns["conditions"])
            out.append({"by": "story manager", "event": ns["event"], "node": ns["node"], "parents": ns["parents"],
                        "conditions": format_conditions(ns["conditions"], names, gvals), "globals": sorted(gvals),
                        "source": f"{ns['node']} {ns['id']} ({ns['plugin']})", "verdict": "files"})
        return out

    def talk_conditions(ctx):
        """A dialogue starter's own conditions, as the record has them."""
        if iv.get(ctx.get("info")):
            return iv[ctx["info"]][-1][1]["conditions"]
        return dialogue.get(ctx.get("info"), {}).get("conditions") or []

    def helper_words(caller, ctx, ev):
        """A helper started by a story manager node, with its fragment's guards, in words; else None."""
        rows = node_starts(caller, nodes)
        p = scripts.get(ctx.get("script", "")) if ctx.get("script") else None
        if not rows or not isinstance(p, dict):
            return None
        props = next((sc["props"] for sc in (quests.get(caller, {}).get("vmad") or {}).get("scripts", []) if sc["name"].lower() == ctx["script"].lower()), {})
        global_of, target = {}, None
        for k, v in props.items():
            form = v.get("form") if isinstance(v, dict) else None
            if form and names.get(form, {}).get("type") == "GLOB":
                global_of[f"::{k}_var".lower()] = names[form].get("edid") or form
            if form == ev.get("quest"):
                target = f"::{k}_var".lower()
        counters, compares = fragment_guards(p, ev["function"], global_of, target)
        enter = next((c["param"] for c in rows[0]["conditions"] if c["fn"] == "GetEventData" and c.get("member") == "L2" and c.get("test") == 0
                      and (c.get("value") == 1) == (c["cmp"] == "==")), None)
        place = names.get(enter, {}).get("name") if enter else None
        return guards_words(counters, compares, place, rows[0]["event"])

    def starter_row(ctx, ev, depth=0):
        """One starter in words, with its source; a helper quest is followed back one step, and so is a line's scene."""
        stage = f" {ev['stage']}" if ev.get("stage") is not None else ""
        if ctx["kind"] == "dialogue":
            spk, how, scene, _ = speaker_of(ctx["info"], ctx_quest=ctx.get("quest"))
            d = dialogue.get(ctx["info"], {})
            started = [starter_row(c, e, 1) for c, e in events if scene and depth == 0 and e["call"] == "StartScene" and e.get("scene") == scene][:4]
            return {"by": "dialogue", "speaker": names.get(spk, {}).get("name") if spk else words_of.get(ctx["info"]), "speakerNamed": how,
                    "speakerPlaced": npc_where(spk) if spk else [], "call": ev["call"] + stage, "info": ctx["info"],
                    "prompt": d.get("prompt") or (d.get("topic") or {}).get("prompt") or None,
                    "reply": d.get("lines") or dialogue.get(d.get("shared") or "", {}).get("lines") or [],
                    "conditions": dialogue_conditions(ctx["info"], ctx.get("quest")),
                    **({"scene": scene, "sceneStartedBy": started} if scene else {}),
                    "source": f"{ctx['script']}.{ev['function']} on INFO {ctx['info']} ({info_plugin.get(ctx['info'], '?')})", "verdict": "script"}
        caller = ctx.get("quest")
        if caller == ev.get("quest") and ctx["kind"] == "quest" and ctx.get("fragment") is False and not ev.get("via"):
            # Its own script starts it (WO-121b): by itself, once you're the level it waits for.
            p = scripts.get(ctx["script"])
            props = next((sc["props"] for sc in (quests.get(caller, {}).get("vmad") or {}).get("scripts", []) if sc["name"].lower() == ctx["script"].lower()), {})
            level = own_level(p, {k.lower(): v for k, v in props.items()}) if isinstance(p, dict) else None
            level = level if level and level > 1 else None
            return {"by": "by itself", "script": ctx["script"], "call": ev["call"] + stage, **({"level": level} if level else {}),
                    "plain": "It starts by itself" + (f" once you're level {level}" if level else " from the start of the game") + ".",
                    "source": f"{ctx['script']}.{ev['function']} on {caller} ({quest_plugin.get(caller, '?')})", "verdict": "script"}
        via = f", through {quest_label(ev['via'], names)}'s {ev.get('viaFunction')}" if ev.get("via") else ""
        row = {"by": "quest script", "quest": quest_label(caller, names), "questId": caller, "atStage": ctx.get("stage"), "call": ev["call"] + stage,
               "source": f"{ctx['script']}.{ev['function']} on {caller} ({quest_plugin.get(caller, '?')}){via}", "verdict": "script"}
        if caller not in order:
            actors = [a["name"] for a in quests.get(caller, {}).get("aliases", {}).values() if a.get("actor")][:3]
            row["quest"] = f"{names.get(caller, {}).get('edid') or caller}" + (f" (named \"{names[caller]['name']}\" in its record)" if names.get(caller, {}).get("name") else "")                 + f", a helper quest" + (f" with {', '.join(actors)}" if actors else "")
        if caller not in order and depth == 0:  # a helper (MQ102A): what starts it, one step back
            here = order.get(ev.get("quest"), -1)
            up = [x for x in classify_starts(caller, order, events, 10, here=here)["started"] if x[0].get("quest") != caller]
            # The story quests before the one it serves; the quest itself calling its helper back isn't a start.
            from_story = [x for x in up if order.get(x[0].get("quest"), here) < here]
            row["throughStartedBy"] = [starter_row(c, e, 1) for c, e in (from_story or up)][:4]
            # A helper no script starts: its story manager node, or the start-game flag (DLC1VQ00ChangeLocation).
            row["throughStartedBy"] += node_rows(caller)[:4]
            plain = helper_words(caller, ctx, ev)
            if plain:
                row["plain"] = plain
            if quests.get(caller, {}).get("flags", 0) & qst.START_GAME:
                row["throughStartedBy"].append({"by": "start game", "source": f"{caller} DNAM ({quest_plugin.get(caller, '?')})", "verdict": "files"})
        return row

    report_quests = []
    all_globals = {}
    for q in story:
        qid = q["id"]
        versions = qv.get(qid, [])
        winner = versions[-1][1] if versions else {"dialogue": [], "event": [], "flags": 0}
        srt = sorted_starts[qid]
        started, admitted = list(srt["started"]), []
        upto = seconds[qid][1] if seconds[qid][1] is not None else thresholds[qid]
        late = [x for x in started if x[0]["kind"] == "dialogue" and catch_up(talk_conditions(x[0]), qid, upto)]
        openers = [x for x in started if x[0]["kind"] == "dialogue" and x not in late]
        if qid in quiet and not openers:
            # It runs from the start without showing anything, and no talk opens it but catch-ups: a talk of its own that can be said from there, and that
            # takes it no further than its next step (the second objective's stage), starts it. Faralda's "Okay, I can do
            # that." sets 20, which shows "Cast a Magelight spell"; Fastred's later lines in The Book of Love don't count.
            at, upto = startup.get(qid, 0), seconds[qid][1]
            for c, e in srt["advanced"]:
                conds = iv[c["info"]][-1][1]["conditions"] if c["kind"] == "dialogue" and iv.get(c["info"]) else dialogue.get(c.get("info"), {}).get("conditions")
                if (c["kind"] == "dialogue" and c.get("quest") == qid and conds is not None and admits(conds, qid, at)
                        and upto is not None and e.get("stage") is not None and e["stage"] <= upto):
                    admitted.append((c, e))
        # A talk still offered past the next step (Nirya's "What are you doing out here?", until First Lessons' stage 30) is
        # a catch-up line, said if you come by later. The talks from the start count only when there's no other opener
        # (Dinya Balu opens The Book of Love, so Fastred's later lines don't); the openers go first, catch-ups last.
        starts = [starter_row(c, e) for c, e in [x for x in started if x not in late] + admitted + late]
        once = set()  # its own script's several entry points (OnInit, OnUpdate) are one start
        starts = [s for s in starts if s["by"] != "by itself" or (s["script"] not in once and not once.add(s["script"]))]
        for ns in node_starts(qid, nodes):
            starts.append({"by": "story manager", "event": ns["event"], "node": ns["node"], "conditionsRaw": ns["conditions"], "parents": ns["parents"],
                           "source": f"{ns['node']} {ns['id']} ({ns['plugin']})", "verdict": "files"})
        if winner["flags"] & qst.START_GAME:
            starts.append({"by": "start game", "source": f"{qid} DNAM ({versions[-1][0] if versions else '?'})", "verdict": "files"})
        own_conds = winner["dialogue"] + winner["event"]
        gl = set()
        for c in own_conds + [c for s in starts for c in s.get("conditionsRaw", [])]:
            gl |= {g for g in (c.get("global"), c.get("param") if c["fn"] == "GetGlobalValue" else None) if g}
        facts = {g: global_fact(g, gv, loaders, setters, names) for g in sorted(gl)}
        all_globals.update(facts)
        gvals = {k: {"value": v["value"]} for k, v in facts.items()}
        for s in starts:
            if s.get("conditionsRaw") is not None:
                s["conditions"] = format_conditions(s.pop("conditionsRaw"), names, gvals)
                if any(f["verdict"] in ("run time", "conflict") for f in facts.values()):
                    s["verdict"] = "run time"
        caught = [{"by": quest_label(c.get("quest"), names), "atStage": c.get("stage"), "call": e["call"] + (f" {e['stage']}" if e.get("stage") is not None else ""),
                   "source": f"{c['script']}.{e['function']} ({quest_plugin.get(c.get('quest'), '?')})"} for c, e in srt["caughtUp"]]
        ww = who_where(qid)
        fo = (q.get("objectives") or [{}])[0]
        row = {"id": qid, "edid": q["edid"], "name": names.get(qid, {}).get("name") or q["name"], "plugin": versions[-1][0] if versions else quest_plugin.get(qid),
               "firstObjectiveStage": thresholds[qid], "startedBy": starts, "caughtUpBy": caught, "advancedBy": len(srt["advanced"]),
               "firstObjective": {"text": fo.get("text"), "index": fo.get("index"), "source": f"{qid} QOBJ {fo.get('index')}", "verdict": "files"} if fo else None,
               # WO-121b rule 1: the stage whose own fragment shows each objective, for the first step as the starting
               # line's stage shows it (quest_pages.stage_step).
               "objectivesShown": {str(o["index"]): st for o in q.get("objectives") or [] for st in [objective_stage(qid, o["index"], events)] if st is not None},
               "target": ww, "needs": {"conditions": format_conditions(own_conds, names, gvals) if own_conds else None, "doors": door_needs(qid, ww),
                                       "ways": door_ways(ww)},
               "globals": list(facts.values()), "gives": gives(q)}
        so, so_stage, so_moves = seconds[qid]
        if so is not None:
            so_text = next((o.get("text") for o in q.get("objectives", []) if o.get("index") == so), None)
            moved = [starter_row(c, e) for c, e in so_moves]
            row["secondStep"] = {"objective": {"text": so_text, "index": so, "source": f"{qid} QOBJ {so}", "verdict": "files"}, "stage": so_stage,
                                 "movedBy": list({json.dumps(m, sort_keys=True): m for m in moved}.values())[:8]}
            scened = []
            for c, e in events:
                if e["call"] != "StartScene" or c["kind"] != "dialogue" or c.get("quest") != qid:
                    continue
                conds = (dialogue.get(c["info"]) or {}).get("conditions") or (iv[c["info"]][-1][1]["conditions"] if iv.get(c["info"]) else [])
                at_first = any(x.get("param") == qid and ((x["fn"] == "GetStage" and thresholds[qid] <= (x.get("value") or 0) <= (so_stage or thresholds[qid]))
                                                         or (x["fn"] == "GetStageDone" and x.get("stage") == thresholds[qid])) for x in conds)
                if at_first:
                    scened.append(dict(starter_row(c, e), startsScene=e["scene"]))
            if scened:
                row["secondStep"]["scenesStarted"] = scened[:4]
            if so_stage is None:
                row["secondStep"]["unread"] = "no fragment of its own shows the second objective, so the stage that moves it isn't traced"
            elif not moved:
                row["secondStep"]["unread"] = f"nothing outside its own stage fragments sets stage {so_stage} or one before it"
        if not starts:
            own = [s["name"] for s in (quests.get(qid, {}).get("vmad") or {}).get("scripts", [])]
            miss = [s for s in own if s in an.missing]
            row["unread"] = "no starter in its records or scripts" + (f"; scripts {', '.join(miss)} aren't in the install" if miss else "")
        report_quests.append(row)

    # Every way a game begins.
    by_edid = {v["edid"].lower(): k for k, v in names.items() if v["type"] == "QUST"}
    mq_ids = {by_edid.get(e) for e in ("mq101", "mq102", "mq102a", "mq102b", "mq103", "mq104", "mq105")} - {None}
    first_done = {s["index"] for s in story[0]["stages"] if s.get("completes")} if story else {1000}
    first_flag = bool(qv.get(first_q, [[None, {"flags": 0}]])[-1][1]["flags"] & qst.START_GAME) if first_q else False
    start_rows = []
    for s in starts_raw:
        ids = [s["id"]] if s.get("id") else [o["id"] for o in s["options"] if o["id"] not in ("0", 0, None)]
        opts = []
        for oid in ids:
            num = oid if isinstance(oid, int) else int(oid, 16) if str(oid).lower().startswith("0x") else int(oid)
            fid = f"{s['plugin']}:{num & 0xFFFFFF:06X}"
            evs = [(c, e) for c, e in events if c.get("quest") == fid and e["call"] in ("SetStage", "Start") and e.get("quest") in mq_ids]
            moves = list(dict.fromkeys(f"{names.get(e['quest'], {}).get('edid')} {e['call']}{(' ' + str(e['stage'])) if e.get('stage') is not None else ''}" for _, e in evs))
            first_set = [e.get("stage") for _, e in evs if e.get("quest") == first_q and e["call"] == "SetStage"]
            if first_set and min(first_set) < min(first_done):
                runs = f"yes, from stage {min(first_set)}"
            elif first_set:
                runs = f"no: its script sets {names.get(first_q, {}).get('edid')} to {max(first_set)} (done)"
            elif first_flag:
                runs = "yes: it is start-game enabled"
            else:
                runs = "no"
            label = next((o["name"] for o in s["options"] if o["id"] == oid), s["name"])
            opts.append({"option": label, "quest": fid, "questEdid": names.get(fid, {}).get("edid"), "mainQuestRuns": runs, "moves": moves,
                         "source": f"{names.get(fid, {}).get('edid')} scripts ({quest_plugin.get(fid, '?')})" if fid in quests else f"{fid} isn't a quest in the records"})
        start_rows.append({"start": s["name"], "from": s["from"], "options": opts})

    # Routes into the line's first quest from outside the starts, in player terms.
    ap_configs = " ".join(open(f, encoding="utf-8", errors="ignore").read().upper() for f in glob.glob(os.path.join(ROOT, "mods", "*", "SKSE", "AlternatePerspective", "*.json")))
    routes = []
    seen = set()
    for ctx, ev in sorted_starts.get(first_q, {}).get("started", []):
        caller = ctx.get("quest")
        if caller in start_quest_ids:
            continue
        if ctx["kind"] == "dialogue":
            key = ("info", ctx["info"])
        elif ev.get("via"):
            key = ("via", ev["via"], ev.get("viaFunction"))
        else:
            key = ("quest", caller)
        if key in seen:
            continue
        seen.add(key)
        if ctx["kind"] == "dialogue":
            d = dialogue.get(ctx["info"], {})
            lines_ = d.get("lines") or dialogue.get(d.get("shared") or "", {}).get("lines") or []
            spk, how_named, _, _ = speaker_of(ctx["info"], ctx_quest=ctx.get("quest"))
            speaker = names.get(spk, {}).get("name") if spk else None
            race = race_names.get(race_of.get(spk)) if spk else None
            where = npc_where(spk) if spk else []
            prompt = d.get("prompt") or (d.get("topic") or {}).get("prompt")
            conds = dialogue_conditions(ctx["info"], ctx.get("quest")) or ""
            route = {"route": f"dialogue INFO {ctx['info']}", "kind": "dialogue", "speaker": speaker, "speakerNamed": how_named, "race": race, "placed": where,
                     "prompt": prompt, "reply": lines_, "conditions": conds, "does": f"{ev['call']}{(' ' + str(ev['stage'])) if ev.get('stage') is not None else ''} on {quest_label(first_q, names)}",
                     "source": f"{ctx['script']}.{ev['function']} on INFO {ctx['info']} ({d.get('plugin') or info_plugin.get(ctx['info'], '?')}); topic {(d.get('topic') or {}).get('edid')}"}
            who_txt = speaker or "the speaker the line's conditions name"
            route["sentence"] = (f"Talk to {who_txt}" + (f" ({race})" if race else "") + (f" in {where[0]}" if where else "") + (f" and choose \"{prompt}\"" if prompt else "")
                                 + (f", when {conds}" if conds else "") + f": {route['does']}.")
            if not speaker:
                route["stops"] = f"the speaker isn't named by an NPC: {how_named}"
        elif ev.get("via") or (ctx["kind"] == "quest" and not ctx.get("fragment")):
            vq, vf = (ev["via"], ev.get("viaFunction")) if ev.get("via") else (caller, ev["function"].lower())
            if ("via", vq, vf) in seen and not ev.get("via"):
                continue
            seen.add(("via", vq, vf))
            calls = [e for c, e in events if e.get("via") == vq and e.get("viaFunction") == vf]
            did = list(dict.fromkeys(f"{e['call']} {quest_label(e['quest'], names) if e.get('quest') else qsc.describe(e.get('who') or e.get('ref') or e.get('item'), names)}"
                                     + (f" {e['stage']}" if e.get("stage") is not None else "") for e in calls))
            callers = list(dict.fromkeys((f"dialogue INFO {c['info']} \"{(dialogue.get(c['info']) or {}).get('prompt') or ((dialogue.get(c['info']) or {}).get('topic') or {}).get('prompt') or ''}\""
                                          if c["kind"] == "dialogue" else quest_label(c.get("quest"), names) + (f" stage {c['stage']}" if c.get("stage") is not None else ""))
                                         for c, e in events if e.get("via") == vq and e.get("viaFunction") == vf))
            if not did:
                did = [f"{ev['call']} {quest_label(first_q, names)}" + (f" {ev['stage']}" if ev.get("stage") is not None else "")]
            starts_of_vq = (classify_starts(vq, order, events, 10)["started"] or node_starts(vq, nodes) or (quests.get(vq, {}).get("flags", 0) & qst.START_GAME))
            route = {"route": f"{quest_label(vq, names)}, its script's {vf}", "kind": "script function", "does": did, "calledFrom": callers,
                     "source": f"{ctx['script'] if not ev.get('via') else vf} on {vq} ({quest_plugin.get(vq, '?')})"}
            from_starts = [c for c in callers if any(c.startswith(quest_label(sq, names)) for sq in start_quest_ids)]
            others = [c for c in callers if c not in from_starts]
            route["sentence"] = (f"{quest_label(vq, names)}'s {vf} does {'; '.join(did)}; it is called from "
                                 + ("; ".join(callers) if callers else "nothing the reader found") + "."
                                 + (" Only a start's quest calls it, so from any other start this route needs one of the dialogue lines here." if from_starts and not others else ""))
            if not callers and not starts_of_vq:
                route["stops"] = f"nothing in the records or scripts calls {vf} or starts {quest_label(vq, names)}"
        else:
            up = classify_starts(caller, order, events, 10)["started"]
            route = {"route": quest_label(caller, names), "kind": "quest script", "does": f"stage {ctx.get('stage')}: {ev['call']}{(' ' + str(ev['stage'])) if ev.get('stage') is not None else ''}",
                     "startedBy": ([starter_row(c, e)["source"] for c, e in up if c.get("quest") != caller][:4]
                                   + [f"story manager node {r['node']} ({r['event'] or 'no event'}; {r['conditions'] or 'no conditions'}; {r['source']})" for r in node_rows(caller)[:4]]),
                     "inStartMenu": caller.split(":")[1].lstrip("0") in ap_configs if caller else False, "source": f"{ctx['script']} on {caller} ({quest_plugin.get(caller, '?')})"}
            if quests.get(caller, {}).get("flags", 0) & qst.START_GAME:
                route["startedBy"].append(f"the start-game flag ({caller} DNAM, {quest_plugin.get(caller, '?')})")
            if not route["startedBy"]:
                route["stops"] = (f"nothing in the records or scripts starts {quest_label(caller, names)}"
                                  + ("" if route["inStartMenu"] else ", and Alternate Perspective's start menu in LoreRim doesn't offer it"))
                route["sentence"] = f"The trail stops at {quest_label(caller, names)}: {route['stops']}."
            else:
                route["sentence"] = f"{quest_label(caller, names)} {route['does']} on {quest_label(first_q, names)}; it is started by " + "; ".join(route["startedBy"]) + "."
        routes.append(route)
    # What every other start can do: the story's quests that run from the start, and the routes above.
    chain_type = story[0].get("type") if story else None
    start_game_story = [r for r, q in zip(report_quests, story) if q.get("type") == chain_type and any(s["by"] == "start game" for s in r["startedBy"])]
    open_now = []
    for r in start_game_story:
        who = next((h for t in r["target"] for h in t["holds"]), None)
        if who and r.get("firstObjective"):
            open_now.append(f"talk to {who['name']}" + (f" in {who['where'][0]}" if who.get("where") else "") + f": {r['name']} is running from the start ({r['firstObjective']['text']})")
        elif r.get("firstObjective"):
            open_now.append(f"{r['name']} is running from the start: {r['firstObjective']['text']}")
    talk = []
    for r in routes:
        if r["kind"] == "dialogue" and not r.get("stops") and r.get("speaker"):
            talk.append(f"ask {r['speaker']}" + (f" in {r['placed'][0]}" if r.get("placed") else "") + f" \"{r['prompt']}\" ({r['conditions']}), which starts {quest_label(first_q, names).split(' (')[-1].rstrip(')')}")
    other_start_sentence = (f"To get into {line['name']}: " + "; or ".join(open_now + talk) + ".") if (open_now or talk) else f"The reader found no way into {line['name']} from it."

    # The payoff: what the stages that complete the last quests give.
    payoff = []
    for e in ("mq305", "mqpaarthurnax"):
        q = raw.get(e)
        if not q:
            continue
        completing = {s["index"] for s in q["stages"] if s.get("completes")}
        given = []
        for c, ev in events:
            if (c.get("quest") == q["id"] and c["kind"] == "quest" and c.get("stage") in completing and ev.get("via") in (None, q["id"])
                    and ev["call"].lower() in ("additem", "addspell", "addperk", "addshout", "teachword", "unlockword")):
                given.append({"call": ev["call"], "what": item_text(ev, names) if ev["call"].lower() == "additem" else qsc.describe(ev.get("item"), names),
                              "stage": c["stage"], "source": f"{c['script']}.{ev['function']}"})
        payoff.append({"quest": names.get(q["id"], {}).get("name") or q["name"], "edid": q["edid"], "completingStages": sorted(completing), "gives": given})

    # The three questions.
    mq105 = raw.get("mq105")
    q1 = {"question": "Is Skyrim.esm:0242BA MQ105, and is stage 160 the one that completes it?",
          "edid": names.get("Skyrim.esm:0242BA", {}).get("edid"), "name": names.get("Skyrim.esm:0242BA", {}).get("name"),
          "completingStages": sorted(s["index"] for s in mq105["stages"] if s.get("completes")) if mq105 else None}
    q1["answer"] = (f"Yes: Skyrim.esm:0242BA is {q1['edid']} ({q1['name']}), and stage 160 is its only completing stage." if q1["edid"] == "MQ105" and q1["completingStages"] == [160]
                    else f"Skyrim.esm:0242BA is {q1['edid']} ({q1['name']}); its completing stages are {q1['completingStages']}.")
    horn = next((r for r in report_quests if r["edid"].lower() == "mq105ustengrav"), None)
    q2 = {"question": "Who starts The Horn of Jurgen Windcaller, and where?", "quest": horn and f"{horn['name']} ({horn['edid']}, {horn['id']})",
          "startedBy": horn["startedBy"] if horn else [], "target": horn and horn["target"], "firstObjective": horn and horn["firstObjective"]}
    dlc2 = by_edid.get("dlc2cultistambush")
    tie_level = setting_value(mcm["TimingIsEverything"], "iTIE_MinimumLevel:Dragonborn") if "TimingIsEverything" in mcm else (None, None)
    q3 = {"question": "Does Dragonborn's cultist node read Timing is Everything's level (25 in its settings.ini), or something else?",
          "quest": (names.get(dlc2, {}).get("edid") + f" ({dlc2})") if dlc2 else None, "nodes": [], "tieSetting": {"key": "iTIE_MinimumLevel:Dragonborn", "value": tie_level[0], "from": tie_level[1]}}
    for ns in (node_starts(dlc2, nodes) if dlc2 else []):
        gfacts, gvals = [], {}
        for c in ns["conditions"]:
            g = c.get("global") or (c["param"] if c["fn"] == "GetGlobalValue" else None)
            if g and g not in gvals:
                f = global_fact(g, gv, loaders, setters, names)
                gvals[g] = {"value": f["value"]}
                gfacts.append(f)
        q3["nodes"].append({"node": ns["node"], "id": ns["id"], "plugin": ns["plugin"], "event": ns["event"], "globals": gfacts,
                            "conditions": format_conditions(ns["conditions"], names, gvals)})

    # Wyrmstooth: its start level in a new game, from WT_MCMScript's own code.
    wt_global = next((k for k, v in names.items() if v["type"] == "GLOB" and v["edid"].lower() == "wtstartlevel"), None)
    wyrm = {"loaderInstalled": "Wyrmstooth" in mcm, "loaderFolder": mcm.get("Wyrmstooth", {}).get("folder"), "global": wt_global,
            "fact": global_fact(wt_global, gv, loaders, setters, names) if wt_global else None, "loaderQuest": loader_quests.get("Wyrmstooth")}
    if wyrm["loaderQuest"]:
        wp = scripts.get(wyrm["loaderQuest"]["script"])
        key = next((r["key"] for r in loaders.get(wt_global, []) if r["mod"] == "Wyrmstooth"), "iWTGeneralRequirementsMinimalLevel:Requirements")
        flow = mcm_flow(wp, key) if isinstance(wp, dict) else {}
        setting, src = setting_value(mcm["Wyrmstooth"], key)
        reload_setting = setting_value(mcm["Wyrmstooth"], flow.get("reloadLoadsIf") or "bLoadSettingsonReload:Maintenance")[0]
        rec = wyrm["fact"].get("record") if wyrm["fact"] else None
        gate_value = setting_value(mcm["Wyrmstooth"], flow["gate"])[0] if flow.get("gate") else None
        gate_on = gate_value is None or str(gate_value).strip() not in ("0", "false", "False")
        new_game = int(setting) if flow.get("initLoads") and flow.get("loadReadsKey") and gate_on and str(setting).isdigit() else rec
        why = []
        if flow.get("initLoads"):
            why.append(f"OnConfigInit runs once when the menu registers in a new game; it sets `{flow.get('guard')}` and calls LoadSettings, "
                       + (f"which goes on only while {flow['gate']} is set (it is {gate_value}) and then calls {flow['readsIn']}, " if flow.get("gate") else "")
                       + f"which reads {key} ({setting}, {src}) and sets WTStartLevel to it")
        if flow.get("migrateCopiesKey"):
            why.append(f"MigrateToMCMHelper, which would copy the global's record value ({rec}) into that setting, runs only from OnGameReload or OnConfigOpen "
                       f"while `{flow.get('guard')}` is false, and OnConfigInit has already set it, so a new game never migrates (an older save made before the loader would)")
        if flow.get("reloadLoadsIf"):
            why.append(f"OnGameReload reloads the settings only when {flow['reloadLoadsIf']} is set; it is {reload_setting}, so later loads keep whatever the global holds")
        wyrm["newGame"] = {"value": new_game, "why": why, "verdict": "run time" if new_game != rec else "files"}

    tie = {"loaderInstalled": "TimingIsEverything" in mcm, "loaderFolder": mcm.get("TimingIsEverything", {}).get("folder"), "script": loader_quests.get("TimingIsEverything"),
           "dragonbornLevel": {"key": "iTIE_MinimumLevel:Dragonborn", "value": tie_level[0], "from": tie_level[1],
                               "globals": [dict(global_fact(g, gv, loaders, setters, names), **{"global": g}) for g, rows in loaders.items()
                                           if any(r["key"] == "iTIE_MinimumLevel:Dragonborn" for r in rows)]}}
    touched = {r["mod"] for g in all_globals for r in loaders.get(g, [])}
    shown = {m: v for m, v in loader_quests.items() if m in touched or m in ("TimingIsEverything", "Wyrmstooth")}

    out = {"line": line_id, "name": line["name"], "quests": report_quests, "notInRawQuests": missing_edids, "starts": start_rows,
           "otherStarts": other_start_sentence, "routes": routes, "loaders": shown, "payoff": payoff, "questions": [q1, q2, q3],
           "timingIsEverything": tie, "wyrmstooth": wyrm, "missingScripts": sorted(an.missing)}
    d = os.path.join(base, "story_checks")
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, f"{line_id}.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
        f.write("\n")
    with open(os.path.join(d, f"{line_id}.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write(markdown(out))
    print(f"{line_id}: {len(report_quests)} quests, {sum(1 for r in report_quests if r.get('unread'))} unread, {len(routes)} routes into "
          f"{report_quests[0]['name'] if report_quests else '?'} -> story_checks/{line_id}.md")


def starter_line(s):
    if s["by"] == "dialogue":
        where = f", placed in {'; '.join(s['speakerPlaced'][:2])}" if s.get("speakerPlaced") else ""
        named = f" (named by {s['speakerNamed']})" if s.get("speakerNamed", "GetIsID") != "GetIsID" else ""
        prompt = f", \"{s['prompt']}\"" if s.get("prompt") else ""
        when = f" (when: {s['conditions']})" if s.get("conditions") else ""
        scene = ""
        if s.get("sceneStartedBy"):
            scene = "; its scene is started by " + "; ".join(
                (f"dialogue with {u.get('speaker') or 'someone'}" + (f", \"{u['prompt']}\"" if u.get("prompt") else "") + (f" (when: {u['conditions']})" if u.get("conditions") else ""))
                if u["by"] == "dialogue" else f"{u.get('quest')}" + (f" at stage {u['atStage']}" if u.get("atStage") is not None else "") for u in s["sceneStartedBy"])
        return f"Dialogue with {s.get('speaker') or 'someone the line does not name'}{named}{where}{prompt}: {s['call']}{when}{scene}"
    if s["by"] == "quest script":
        text = f"{s['quest']}{(' at stage ' + str(s['atStage'])) if s.get('atStage') is not None else ''} calls {s['call']}"
        if "throughStartedBy" in s:
            def up(u):
                if u["by"] == "quest script":
                    return f"{u['quest']}" + (f" at stage {u['atStage']}" if u.get("atStage") is not None else "") + f" ({u['call']})"
                if u["by"] == "dialogue":
                    return f"dialogue with {u.get('speaker') or 'someone'} ({u['call']})"
                if u["by"] == "story manager":
                    return f"story manager node {u['node']} (event: {u['event'] or 'none'}; {u['conditions'] or 'no conditions'})"
                return "the start-game flag"
            text += "; " + s["quest"].split(",")[0].split(" ")[0] + " is started by " + ("; ".join(up(u) for u in s["throughStartedBy"])
                                                                                         or "nothing in the records or scripts (**unread**)")
        return text
    if s["by"] == "story manager":
        return f"Story manager node {s['node']}, event: {s['event'] or 'none'}; conditions up its parents: {s.get('conditions') or 'none'}"
    return "Start-game flag: the quest runs from the start of the game"


def markdown(out):
    md = [f"# Start check: {out['name']} (`{out['line']}`)", "",
          "Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. "
          "Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; "
          "**conflict** two sources disagree; **unread** named. Conditions read as the game reads them: \"or\" joins OR'd conditions, \";\" separates what is all needed.", ""]
    if out["notInRawQuests"]:
        md += [f"Not in the crawl (no journal text): {', '.join(out['notInRawQuests'])}.", ""]
    for i, q in enumerate(out["quests"], 1):
        md += [f"## {i}. {q['name']} (`{q['edid']}`, {q['id']}, {q['plugin']})", ""]
        md += ["**Started by**", ""]
        if q.get("unread"):
            md.append(f"- **unread**: {q['unread']}")
        grouped, order_ = {}, []
        for s in q["startedBy"]:
            key = (s["by"], s.get("quest") or s.get("info") or s.get("node") or s["by"])
            if key not in grouped:
                grouped[key] = []
                order_.append(key)
            grouped[key].append(s)
        for key in order_[:8]:
            rows = grouped[key]
            s = rows[0]
            if len(rows) > 1 and s["by"] == "quest script":
                calls = "; ".join(f"at stage {r['atStage']} {r['call']}" if r.get("atStage") is not None else r["call"] for r in rows)
                line = starter_line(dict(s, atStage=None, call=calls))
                md.append(f"- {line}. Sources: {', '.join(dict.fromkeys(r['source'].split(' on ')[0] for r in rows))} on {s['questId']}. **{s['verdict']}**")
            else:
                for r in rows[:3]:
                    md.append(f"- {starter_line(r)}. Source: {r['source']}. **{r['verdict']}**")
        if len(order_) > 8:
            md.append(f"- and {len(order_) - 8} more in the JSON")
        md.append(f"- (First objective shown at stage {q['firstObjectiveStage']}; a call to a later stage advances the quest instead.)")
        if q["caughtUpBy"]:
            md += ["", "**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)", ""]
            for c in q["caughtUpBy"][:6]:
                md.append(f"- {c['by']}" + (f" at stage {c['atStage']}" if c.get("atStage") is not None else "") + f" calls {c['call']}. Source: {c['source']}.")
            if len(q["caughtUpBy"]) > 6:
                md.append(f"- and {len(q['caughtUpBy']) - 6} more in the JSON")
        ss = q.get("secondStep")
        if ss:
            md += ["", "**Second step** (what moves it to its second objective, often the real test)", ""]
            if ss["objective"].get("text"):
                md.append(f"- Second objective: \"{ss['objective']['text']}\"" + (f", shown at stage {ss['stage']}" if ss.get("stage") is not None else "")
                          + f". Source: {ss['objective']['source']}. **files**")
            for x in ss["movedBy"]:
                reply = f" Reply: \"{x['reply'][0]}\"" if x.get("reply") else ""
                md.append(f"- {starter_line(x)}.{reply} Source: {x['source']}. **{x['verdict']}**")
            for x in ss.get("scenesStarted", []):
                md.append(f"- On the way, a line of its own starts a scene while it is at its first objective: {starter_line(x)} (scene {x['startsScene']}). Source: {x['source']}. **script**")
            if ss.get("unread"):
                md.append(f"- **unread**: {ss['unread']}.")
        md += ["", "**Who and where**", ""]
        if q.get("firstObjective") and q["firstObjective"].get("text"):
            md.append(f"- First objective: \"{q['firstObjective']['text']}\". Source: {q['firstObjective']['source']}. **files**")
        if not q["target"]:
            md.append("- Its first objective names no target alias.")
        for t in q["target"]:
            holds = "; ".join(f"{h['name']} ({h['kind']}" + (f", placed in {', '.join(h['where'][:2])}" if h.get("where") else "") + ")" for h in t["holds"])
            md.append(f"- Target alias {t['alias']} ({t['fill']}): " + (holds or "nothing the records or scripts name") + ". **"
                      + ("script" if any("script" in h["kind"] for h in t["holds"]) else "files") + "**")
        md += ["", "**Needs**", ""]
        n = q["needs"]
        if n["conditions"]:
            md.append(f"- Its own conditions: {n['conditions']}. **files**")
        for d in n["doors"]:
            md.append(f"- {d['text']} Source: {d['door']} ({d['plugin']}). **files**")
        if not n["conditions"] and not n["doors"]:
            md.append("- Nothing in its own conditions, and no locked-only way into its first objective's place.")
        ways = [w for w in n.get("ways", []) if w["ways"]]
        if ways:
            md.append("- Ways in: " + "; ".join(f"{w['cell']}: {w['ways']} door{'s' if w['ways'] != 1 else ''}, {w['locked']} locked" for w in ways)
                      + ". A door is a need only when every way in is locked. **files**")
        for g in q["globals"]:
            rt = "; ".join(f"{r['by']} {r.get('mod') or r.get('script')}: {r.get('key', '')} = {r['value']}" + (f" ({r['from']})" if r.get("from") else "") for r in g["runtime"])
            md.append(f"- Global {g['edid']}: record {g.get('record')} ({g.get('recordFrom')})" + (f"; at run time {rt}" if rt else "") + f". **{g['verdict']}**")
        md.append("")
        md.append("**Gives**: " + ("; ".join(f"{x['what']}" + (f" (stage {x['stage']}, {x['source']})" if x.get("stage") is not None else f" ({x['source']})") for x in q["gives"])
                                   or "nothing on its completing stages") + ".")
        md.append("")
    md += ["## Every way a game begins", "", "Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:", "",
           "| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |", "| --- | --- | --- | --- | --- | --- |"]
    for s in out["starts"]:
        for o in s["options"]:
            how = "it runs from the start" if o["mainQuestRuns"].startswith("yes") else out["otherStarts"]
            md.append(f"| {s['start']} | {o['option']} | {o['questEdid'] or o['quest']} | {o['mainQuestRuns']} | {'; '.join(o['moves']) or 'nothing in the main quest'} | {how.replace('|', '/')} |")
    md += ["", "## Routes into the first quest from outside the starts", ""]
    for r in out["routes"]:
        md.append(f"### {r['route']}")
        md.append("")
        if r["kind"] == "dialogue":
            md.append(f"- Speaker: {r.get('speaker') or 'not named by an NPC'}" + (f" ({r['race']})" if r.get("race") else "") + (f", placed in {'; '.join(r['placed'][:2])}" if r.get("placed") else "")
                      + f". Named by: {r['speakerNamed']}.")
            md.append(f"- The player's prompt: \"{r.get('prompt') or ''}\".")
            md.append("- The reply: " + (" / ".join(f"\"{x}\"" for x in r["reply"]) if r["reply"] else "(no line of its own)") + ".")
            md.append(f"- When it's offered: {r['conditions'] or 'no conditions'}.")
            md.append(f"- What it does: {r['does']}. Source: {r['source']}. **script**")
        elif r["kind"] == "script function":
            md.append(f"- What it does: {'; '.join(r['does'])}. Source: {r['source']}. **script**")
            md.append(f"- Called from: {'; '.join(r['calledFrom']) or 'nothing the reader found'}.")
        else:
            md.append(f"- What it does: {r['does']}. Source: {r['source']}. **script**")
            md.append(f"- Started by: {'; '.join(r['startedBy']) or 'nothing in the records or scripts'}.")
        if r.get("stops"):
            md.append(f"- **unread**: the trail stops here: {r['stops']}.")
        md.append(f"- In one sentence: {r['sentence']}")
        md.append("")
    md += ["## The payoff", ""]
    for p in out["payoff"]:
        md.append(f"- **{p['quest']}** (completes at {', '.join(map(str, p['completingStages']))}): "
                  + ("; ".join(f"{g['call']} {g['what']} ({g['source']}, stage {g['stage']})" for g in p["gives"]) or "nothing is given on its completing stages") + ".")
    md += ["", "## Three questions", ""]
    q1, q2, q3 = out["questions"]
    md += [f"**{q1['question']}** {q1['answer']}", ""]
    md.append(f"**{q2['question']}** {q2['quest']}:")
    for s in q2["startedBy"][:6]:
        md.append(f"- {starter_line(s)}. Source: {s['source']}.")
    if q2.get("firstObjective") and q2["firstObjective"].get("text"):
        md.append(f"- Its first objective: \"{q2['firstObjective']['text']}\".")
    for t in q2.get("target") or []:
        md.append(f"- Its target alias {t['alias']}: " + ("; ".join(f"{h['name']} ({h['kind']})" for h in t["holds"]) or "nothing named") + ".")
    md += ["", f"**{q3['question']}** Timing is Everything's setting {q3['tieSetting']['key']} = {q3['tieSetting']['value']} ({q3['tieSetting']['from']}).", ""]
    for n in q3["nodes"]:
        md.append(f"- Node {n['node']} ({n['plugin']}), event {n['event']}: {n['conditions']}.")
        for g in n.get("globals", []):
            unread = "; ".join(f"{u['mod']} {u['key']} = {u['value']} in {u['from']}, but {u['why']}" for u in g.get("settingsNotRead", []))
            was = f", was {g['recordWas']['value']} in {g['recordWas']['from']}" if g.get("recordWas") else ""
            rt = "; ".join(f"{r.get('mod') or r.get('script')}{('.' + r['function']) if r.get('function') else ''} sets it to {r['value'] if r['value'] is not None else 'a value it works out'}"
                           for r in g["runtime"])
            md.append(f"  - {g['edid']}: record {g.get('record')} ({g.get('recordFrom')}{was})" + (f"; in play: {rt}" if rt else "") + (f"; {unread}" if unread else "")
                      + f". **{g['verdict']}**")
    tie, wy = out["timingIsEverything"], out["wyrmstooth"]
    md += ["", "## Run-time values", "", "Settings loaders the story's globals touch, and whether the script the game runs reads their settings.ini:", ""]
    for modname, info in sorted(out["loaders"].items()):
        md.append(f"- {modname}: script {info['script']} on {info['quest']}; the copy that wins is {info['winner']} (extends {info['winnerParent']}); "
                  + ("it reads its MCM Helper settings and sets globals from them." if info["readsSettings"]
                     else "it carries no settings.ini value into a global, so the globals keep their record values unless the player changes them in the menu."))
    md += ["", f"- Timing is Everything: Dragonborn level setting {tie['dragonbornLevel']['value']} ({tie['dragonbornLevel']['from']}), meant for "
           + (", ".join(f"{g['edid']} (record {g.get('record')} from {g.get('recordFrom')}; in game {g['value']}; **{g['verdict']}**)" for g in tie["dragonbornLevel"]["globals"]) or "no global the reader could follow") + "."]
    if wy.get("newGame"):
        ng = wy["newGame"]
        md.append(f"- Wyrmstooth: WTStartLevel is {ng['value']} in a new game (record {wy['fact'].get('record')} in {wy['fact'].get('recordFrom')}). Why: "
                  + "; ".join(ng["why"]) + f". Source: {wy['loaderQuest']['script']} ({wy['loaderQuest']['winner']}). **{ng['verdict']}**")
    if out["missingScripts"]:
        md += ["", f"Scripts the records name that aren't in the install ({len(out['missingScripts'])}); calls inside them can't be read. Full list in the JSON."]
    return "\n".join(md) + "\n"


if __name__ == "__main__":
    main()
