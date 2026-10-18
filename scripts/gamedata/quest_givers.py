"""
Spike (WO-98): who gives each quest, where they are, how it starts, and what it can pay, as far as
the records say it plainly. Reads only. Needs quests_raw.json (quests.py) first. Writes
gamedata/<version>/quest_givers_raw.json and quest_givers_report.md:
  python3 scripts/gamedata/quest_givers.py [version]

For each kept quest:
  people      its aliases (QUST ALST/ALLS blocks): the alias name, and the NPC when it's filled by a
              unique actor (ALUA) or a forced reference (ALFR), or the location (ALFL)
  giver       the likely giver: the speaker of the quest's own dialogue (INFOs under a DIAL whose QNAM
              is the quest) spoken earliest, by its stage condition (GetStage < n on the quest). The
              speaker is read from the INFO's conditions: GetIsID naming an NPC, or GetIsAliasRef
              naming one of the quest's aliases.
  where       the giver's placed reference (ACHR): its cell and the cell's location. NPCs with
              schedules move about; this is their placed home.
  objective   the first objective, with its alias tokens filled in, and whether it names a person or
              place (a capitalised word past its first, nothing left unfilled).
  starts      story-manager quest nodes (SMQN) that start it, and the event at the root of their
              branch (SMEN): change location, kill, script event and so on.
  rewards     what its records can hand out: items created by an alias (ALCO), and the quest scripts'
              properties (VMAD) that point at a weapon, armour, book, spell, perk, gold or a leveled
              list named as a reward. Quest objects (alias flag), keys and notes don't count. These
              are what the scripts can give, not proof of what they do.
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
QUEST_OBJECT = 0x04  # alias flag
GET_STAGE, GET_IS_ID, GET_IS_ALIAS_REF = 58, 72, 566
CMP = {0: "==", 1: "!=", 2: ">", 3: ">=", 4: "<", 5: "<="}
# Story-manager events, the ones named in the order; others keep the game's four-letter code.
EVENTS = {"CLOC": "change location", "KILL": "kill", "SCPT": "script event"}
NAMED = ("NPC_", "LCTN", "WRLD", "WEAP", "ARMO", "BOOK", "SPEL", "PERK", "MISC", "LVLI", "AMMO", "ALCH", "SCRL", "KEYM")
REWARD_TYPES = {"WEAP": "weapon", "ARMO": "armour", "BOOK": "book", "SPEL": "spell", "PERK": "perk", "MISC": "gold", "LVLI": "leveled list"}
NOTE = re.compile(r"\b(note|letter|journal|diary|orders|notice|map|deed|bounty)\b", re.I)
REWARD_LIST = re.compile(r"reward", re.I)
SAMPLES = ["MS13", "MS10", "MS01", "DA09", "DA03", "C00", "TG00", "WTDragonHunt", "zzzAoMMq00", "NMeridia01", "GRVEMainQuest01",
           "InigoBadVibrations", "NecroQuest01", "EVGSirenrootQuest", "FOFRiftenBrawlerQuest"]


def _text(v):
    return v.rstrip(b"\0").decode("utf-8", "replace")


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


def ctda(v, masters, name):
    """A condition: function, comparison, value, its first parameter (resolved when it's a form) and who it runs on."""
    fn, p1 = struct.unpack_from("<H", v, 8)[0], struct.unpack_from("<I", v, 12)[0]
    c = {"fn": fn, "cmp": CMP.get(v[0] >> 5, "?"), "value": struct.unpack_from("<f", v, 4)[0], "or": bool(v[0] & 1),
         "runOn": struct.unpack_from("<I", v, 20)[0] if len(v) >= 24 else 0}
    c["param"] = p1 if fn == GET_IS_ALIAS_REF else form_id(resolve(p1, masters, name))
    return c


def vmad_objects(v, masters, name):
    """[(script, property, form id)] for every object property (and object array) of a record's scripts."""
    ver, fmt, count = struct.unpack_from("<hhH", v, 0)
    pos, out = 6, []

    def wstr():
        nonlocal pos
        n = struct.unpack_from("<H", v, pos)[0]
        s = v[pos + 2:pos + 2 + n].decode("latin1")
        pos += 2 + n
        return s

    def obj():
        nonlocal pos
        fid = struct.unpack_from("<I", v, pos + (4 if fmt == 2 else 0))[0]
        pos += 8
        return fid

    for _ in range(count):
        script = wstr()
        if ver >= 4:
            pos += 1
        for _ in range(struct.unpack_from("<H", v, (pos := pos + 2) - 2)[0]):
            prop = wstr()
            kind = v[pos]
            pos += 2 if ver >= 4 else 1
            if kind == 1:
                fids = [obj()]
            elif kind == 11:
                n = struct.unpack_from("<I", v, pos)[0]
                pos += 4
                fids = [obj() for _ in range(n)]
            else:
                fids = []
                if kind == 2:
                    wstr()
                elif kind in (3, 4):
                    pos += 4
                elif kind == 5:
                    pos += 1
                elif kind in (12, 13, 14, 15):
                    n = struct.unpack_from("<I", v, pos)[0]
                    pos += 4
                    for _ in range(n):
                        if kind == 12:
                            wstr()
                        else:
                            pos += 1 if kind == 15 else 4
                else:
                    raise ValueError(f"script property type {kind}")
            out += [(script, prop, form_id(resolve(f, masters, name))) for f in fids if f]
    return out


def read_aliases(subs, masters, name):
    """A quest's aliases: id, kind (ref or location), name, flags and what fills or creates it."""
    out, cur, on = [], None, False
    for s, v in subs:
        if s == "ANAM":
            on = True
        if not on:
            continue
        if s in ("ALST", "ALLS"):
            cur = {"id": struct.unpack_from("<I", v)[0], "kind": "ref" if s == "ALST" else "location", "name": "", "flags": 0}
            out.append(cur)
        elif cur is None:
            continue
        elif s == "ALID":
            cur["name"] = _text(v)
        elif s == "FNAM" and len(v) >= 4:
            cur["flags"] = struct.unpack_from("<I", v)[0]
        elif s in ("ALUA", "ALFR", "ALFL", "ALCO") and len(v) >= 4:
            cur[{"ALUA": "actor", "ALFR": "ref", "ALFL": "location", "ALCO": "creates"}[s]] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
        elif s == "ALED":
            cur = None
    return out


def read_plugin(buf, name, quests, strings=None):
    """The parts of one plugin's records WO-98 reads, for the quest ids in `quests`."""
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    strings = strings or {}

    def txt(v):
        if loc and len(v) == 4:
            return strings.get(struct.unpack_from("<I", v)[0], "")
        return _text(v)

    out = {"quests": {}, "infos": {}, "nodes": {}, "names": {}}
    if b"QUST" in buf:
        for o in iter_group(buf, "QUST"):
            _, flags, fid, d = rec_data(buf, o)
            key = form_id(resolve(fid, masters, name))
            if key not in quests or flags & DELETED:
                continue
            subs = subrecs(d)
            rec = {"aliases": read_aliases(subs, masters, name), "scripts": []}
            for s, v in subs:
                if s == "VMAD":
                    try:
                        rec["scripts"] = vmad_objects(v, masters, name)
                    except (ValueError, struct.error, IndexError) as e:
                        rec["vmadError"] = str(e)
                    break
            out["quests"][key] = rec
    if b"DIAL" in buf:
        topic = None
        for o in iter_group(buf, "DIAL"):
            t, flags, fid, d = rec_data(buf, o)
            subs = subrecs(d)
            if t == "DIAL":
                q = [form_id(resolve(struct.unpack_from("<I", v)[0], masters, name)) for s, v in subs if s == "QNAM"]
                topic = q[0] if q and q[0] in quests else None
            elif t == "INFO" and topic and not flags & DELETED:
                out["infos"][form_id(resolve(fid, masters, name))] = {"quest": topic, "conditions": [ctda(v, masters, name) for s, v in subs if s == "CTDA" and len(v) >= 24]}
    for grp in ("SMQN", "SMBN", "SMEN"):
        if grp.encode() not in buf:
            continue
        for o in iter_group(buf, grp):
            t, _, fid, d = rec_data(buf, o)
            node = {"type": t, "edid": "", "parent": None, "quests": [], "event": None}
            for s, v in subrecs(d):
                if s == "EDID":
                    node["edid"] = _text(v)
                elif s == "PNAM" and len(v) >= 4:
                    p = struct.unpack_from("<I", v)[0]
                    node["parent"] = form_id(resolve(p, masters, name)) if p else None
                elif s == "NNAM" and t == "SMQN" and len(v) >= 4:  # QNAM is the count; each quest is an NNAM
                    node["quests"].append(form_id(resolve(struct.unpack_from("<I", v)[0], masters, name)))
                elif s == "ENAM" and len(v) >= 4:
                    node["event"] = v[:4].decode("latin1")
            out["nodes"][form_id(resolve(fid, masters, name))] = node
    for grp in NAMED:
        if grp.encode() not in buf:
            continue
        for o in iter_group(buf, grp):
            t, _, fid, d = rec_data(buf, o)
            if t != grp:
                continue
            edid = full = ""
            for s, v in subrecs(d):
                if s == "EDID":
                    edid = _text(v)
                elif s == "FULL":
                    full = txt(v).strip()
                    break
            out["names"][form_id(resolve(fid, masters, name))] = {"type": grp, "edid": edid, "name": full}
    return out


def read_placements(buf, name, npcs, refs, strings=None):
    """
    Placed references from one plugin's CELL and WRLD groups: ACHRs of the NPCs in `npcs`, and the refs in
    `refs`, each with its cell, and every cell's name and location (CELL FULL, XLCN).
    """
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    strings = strings or {}

    def txt(v):
        if loc and len(v) == 4:
            return strings.get(struct.unpack_from("<I", v)[0], "")
        return _text(v)

    placed, cells = {}, {}
    for top in ("CELL", "WRLD"):
        if top.encode() not in buf:
            continue
        cell = world = None
        for o in iter_group(buf, top):
            t = buf[o:o + 4]
            if t not in (b"CELL", b"WRLD", b"ACHR", b"REFR"):
                continue
            fid = struct.unpack_from("<I", buf, o + 12)[0]
            key = form_id(resolve(fid, masters, name))
            if t == b"REFR" and key not in refs:
                continue
            tt, flags, _, d = rec_data(buf, o)
            subs = subrecs(d)
            if tt == "WRLD":
                world = key
                continue
            if tt == "CELL":
                cell = key
                c = {"world": world if top == "WRLD" else None}
                for s, v in subs:
                    if s == "FULL":
                        c["name"] = txt(v).strip()
                    elif s == "XLCN" and len(v) >= 4:
                        c["location"] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
                cells[key] = c
                continue
            base = next((form_id(resolve(struct.unpack_from("<I", v)[0], masters, name)) for s, v in subs if s == "NAME"), None)
            if key in refs or (tt == "ACHR" and base in npcs):
                ploc = next((form_id(resolve(struct.unpack_from("<I", v)[0], masters, name)) for s, v in subs if s == "XLCN" and len(v) >= 4), None)
                placed[key] = {"base": base, "cell": cell, "deleted": bool(flags & DELETED), **({"location": ploc} if ploc else {})}
    return placed, cells


def alias_person(alias, names, placed):
    """The NPC an alias names: its unique actor, or the base of its forced reference when that's an NPC."""
    if alias.get("actor"):
        return alias["actor"]
    ref = placed.get(alias.get("ref"))
    if ref and names.get(ref["base"], {}).get("type") == "NPC_":
        return ref["base"]
    return None


def likely_giver(quest_id, infos, aliases, names, placed):
    """
    The speaker of the quest's dialogue spoken earliest, by its stage condition on the quest: (npc id, stage
    bound, info id, how the speaker was named), or None.
    """
    by_alias = {a["id"]: a for a in aliases}
    found = []
    for iid, info in infos.items():
        if info["quest"] != quest_id:
            continue
        bound, speakers = None, []
        for c in info["conditions"]:
            if c["fn"] == GET_STAGE and c["param"] == quest_id:
                b = {"<": c["value"], "<=": c["value"] + 1, "==": c["value"] + 1}.get(c["cmp"])
                if b is not None:
                    bound = b if bound is None else min(bound, b)
            elif c["runOn"] == 0 and c["cmp"] == "==" and c["value"] == 1:
                if c["fn"] == GET_IS_ID and names.get(c["param"], {}).get("type") == "NPC_":
                    speakers.append((c["param"], "GetIsID"))
                elif c["fn"] == GET_IS_ALIAS_REF and c["param"] in by_alias:
                    npc = alias_person(by_alias[c["param"]], names, placed)
                    if npc:
                        speakers.append((npc, "alias " + by_alias[c["param"]]["name"]))
        if bound is None or not speakers:
            continue
        found += [(bound, iid, sp) for sp in speakers]
    if not found:
        return None
    found.sort(key=lambda f: (f[0], f[1]))
    bound, iid, (npc, how) = found[0]
    out = {"npc": npc, "stageBelow": int(bound), "info": iid, "named": how}
    # Others who speak the quest's early dialogue, earliest first: a quest can start from more than one person.
    others = []
    for b, _, (n, _) in found:
        if n != npc and n not in [o["npc"] for o in others]:
            others.append({"npc": n, "stageBelow": int(b)})
    if others:
        out["others"] = others[:3]
    return out


def place(npc, placed, cells, names):
    """Where an NPC is placed: [{cell, cellName, location}] from its ACHRs, the game's names."""
    out = []
    for ref, p in placed.items():
        if p["base"] != npc or p["deleted"]:
            continue
        c = cells.get(p["cell"], {})
        row = {"ref": ref, "cell": p["cell"]}
        if c.get("name"):
            row["cellName"] = c["name"]
        lid = p.get("location") or c.get("location")
        if lid and names.get(lid, {}).get("name"):
            row["location"] = names[lid]["name"]
        if c.get("world") and names.get(c["world"], {}).get("name"):
            row["world"] = names[c["world"]]["name"]
        out.append(row)
    return out


def where_text(p):
    parts = [x for x in (p.get("cellName"), p.get("location")) if x]
    if not parts and p.get("world"):
        parts = [p["world"]]
    return ", ".join(dict.fromkeys(parts))


ALIAS_TOKEN = re.compile(r"<Alias(?:\.\w+)?=([^>]+)>", re.I)


def fill_objective(text, aliases, names, placed):
    """An objective with its alias tokens filled from the aliases' NPCs and locations, and whether it names who or where."""
    by_name = {a["name"].lower(): a for a in aliases}

    def sub(m):
        a = by_name.get(m.group(1).lower())
        if not a:
            return m.group(0)
        who = alias_person(a, names, placed) or a.get("location")
        return names.get(who, {}).get("name") or m.group(0)

    filled = ALIAS_TOKEN.sub(sub, text)
    words = re.findall(r"[A-Za-z][\w'-]*", ALIAS_TOKEN.sub("", filled))
    names_it = not ALIAS_TOKEN.search(filled) and any(w[0].isupper() for w in words[1:])
    return filled, names_it


def start_events(quest_id, nodes):
    """Story-manager quest nodes that start the quest, each with the event at the root of its branch."""
    out = []
    for nid, n in nodes.items():
        if n["type"] != "SMQN" or quest_id not in n["quests"]:
            continue
        cur, seen, event = n, set(), None
        while cur and cur["parent"] and cur["parent"] not in seen:
            seen.add(cur["parent"])
            cur = nodes.get(cur["parent"])
            if cur and cur["type"] == "SMEN":
                event = cur["event"]
                break
        out.append({"node": n["edid"] or nid, "event": EVENTS.get(event, event)})
    return out


def rewards(aliases, scripts, names):
    """Reward candidates: items created by an alias, and script properties pointing at reward-like records."""
    quest_objects = {a.get("creates") for a in aliases if a["flags"] & QUEST_OBJECT} | {a.get("ref") for a in aliases if a["flags"] & QUEST_OBJECT}
    out, seen = [], set()

    def ok(fid):
        n = names.get(fid)
        if not n or fid in quest_objects or fid in seen:
            return None
        t, label = n["type"], n["name"] or n["edid"]
        if t not in REWARD_TYPES:
            return None
        if t not in ("MISC", "LVLI") and not n["name"]:
            return None  # no in-game name: an effect or an internal record, not something handed over
        if t == "MISC" and not n["edid"].lower().startswith("gold"):
            return None
        if t == "LVLI" and not REWARD_LIST.search(n["edid"]):
            return None
        if t == "BOOK" and NOTE.search(label):
            return None
        return label, REWARD_TYPES[t]

    for a in aliases:
        if a.get("creates") and (r := ok(a["creates"])):
            seen.add(a["creates"])
            out.append({"id": a["creates"], "name": r[0], "type": r[1], "via": f"alias {a['name']}"})
    for script, prop, fid in scripts:
        if r := ok(fid):
            seen.add(fid)
            out.append({"id": fid, "name": r[0], "type": r[1], "via": f"{script}.{prop}"})
    return out


def build(kept, parts, placed, cells):
    """One row per kept quest: people, giver and where, first objective, start events, reward candidates."""
    names, infos, nodes = parts["names"], parts["infos"], parts["nodes"]
    rows = []
    for q in kept:
        rec = parts["quests"].get(q["id"], {"aliases": [], "scripts": []})
        aliases = rec["aliases"]
        people = []
        for a in aliases:
            row = {"alias": a["name"]}
            who = alias_person(a, names, placed)
            if who:
                row["npc"] = names.get(who, {}).get("name") or names.get(who, {}).get("edid") or who
            if a.get("location"):
                row["location"] = names.get(a["location"], {}).get("name") or a["location"]
            if len(row) > 1:
                people.append(row)
        out = {"id": q["id"], "edid": q["edid"], "name": q["name"], "people": people}
        g = likely_giver(q["id"], infos, aliases, names, placed)
        if g:
            g["name"] = names.get(g["npc"], {}).get("name") or names.get(g["npc"], {}).get("edid")
            g["where"] = place(g["npc"], placed, cells, names)
            for o in g.get("others", []):
                o["name"] = names.get(o["npc"], {}).get("name") or names.get(o["npc"], {}).get("edid")
            out["giver"] = g
        if q["objectives"]:
            filled, names_it = fill_objective(q["objectives"][0]["text"], aliases, names, placed)
            out["firstObjective"] = {"text": q["objectives"][0]["text"], "filled": filled, "namesWhoOrWhere": names_it}
        ev = start_events(q["id"], nodes)
        if ev:
            out["starts"] = ev
        rw = rewards(aliases, rec["scripts"], names)
        if rw:
            out["rewards"] = rw
        if rec.get("vmadError"):
            out["vmadError"] = rec["vmadError"]
        rows.append(out)
    return rows


def coverage(rows):
    c = {"quests": len(rows)}
    c["likely giver"] = sum(1 for r in rows if r.get("giver"))
    c["giver with a location"] = sum(1 for r in rows if r.get("giver", {}).get("where"))
    c["first objective names who or where"] = sum(1 for r in rows if r.get("firstObjective", {}).get("namesWhoOrWhere"))
    c["giver or such an objective"] = sum(1 for r in rows if r.get("giver") or r.get("firstObjective", {}).get("namesWhoOrWhere"))
    c["start event"] = sum(1 for r in rows if r.get("starts"))
    c["reward candidate"] = sum(1 for r in rows if r.get("rewards"))
    c["reward candidate other than gold"] = sum(1 for r in rows if any(x["type"] != "gold" for x in r.get("rewards", [])))
    return c


def report(rows, counts):
    by_edid = {r["edid"].lower(): r for r in rows}
    out = ["# Quest givers, where quests start, and rewards (WO-98 spike)", "",
           "Written by `scripts/gamedata/quest_givers.py` from the records in the Ultra load order. Rewards are what the quest's",
           "records can hand out (items its aliases create, objects its scripts point at), not proof of what the scripts do. A",
           "giver's place is where the NPC is placed in the world; NPCs with schedules move about.", "",
           "## Coverage over all kept quests", "", "| | Quests |", "| --- | --- |"]
    out += [f"| {k} | {v} |" for k, v in counts.items()]
    out += ["", "## The 15 samples", "", "Known answer: for Bob to fill in from the game.", "",
            "| Quest | Likely giver | Where | First objective | Start event | Reward candidates | Known answer |",
            "| --- | --- | --- | --- | --- | --- | --- |"]
    details = []
    for e in SAMPLES:
        r = by_edid.get(e.lower())
        if not r:
            out.append(f"| `{e}` | not a kept quest | | | | | |")
            continue
        g = r.get("giver")
        giver = f"{g['name']} (dialogue before stage {g['stageBelow']})" if g else "none found"
        if g and g.get("others"):
            giver += "; also " + ", ".join(f"{o['name']} (before {o['stageBelow']})" for o in g["others"])
        where = "; ".join(where_text(p) for p in g["where"]) if g and g["where"] else ("none found" if g else "")
        fo = r.get("firstObjective", {})
        obj = (fo.get("filled", "") + ("" if fo.get("namesWhoOrWhere") else " (names no one)")) if fo else "none"
        ev = "; ".join(f"{s['event'] or '?'} ({s['node']})" for s in r.get("starts", [])) or "none found"
        rw = "; ".join(f"{x['name']} ({x['type']})" for x in r.get("rewards", [])) or "none found"
        out.append(f"| {r['name']} (`{r['edid']}`) | {giver} | {where} | {obj.replace('|', '/')} | {ev} | {rw} | |")
        details += [f"### {r['name']} (`{r['edid']}`, {r['id']})", ""]
        details.append("- People: " + ("; ".join(f"{p['alias']}: " + ", ".join(x for x in (p.get('npc'), p.get('location')) if x) for p in r["people"]) or "none"))
        if g:
            details.append(f"- Giver: {g['name']}, named by {g['named']} in INFO {g['info']}, dialogue before stage {g['stageBelow']}")
        details.append("- Rewards: " + ("; ".join(f"{x['name']} ({x['type']}, {x['via']})" for x in r.get("rewards", [])) or "none found"))
        details.append("")
    out += ["", "## Sample details", ""] + details
    return "\n".join(out) + "\n"


def main():
    from bsa import vanilla_strings
    from esp import ROOT, load_order, localized_strings, plugin_paths

    base = os.path.join(REPO, "gamedata", VERSION)
    kept = json.load(open(os.path.join(base, "quests_raw.json"), encoding="utf-8"))["quests"]
    ids = {q["id"] for q in kept}
    pp, lo = plugin_paths(), load_order()
    parts = {"quests": {}, "infos": {}, "nodes": {}, "names": {}}
    bufs = []
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else None
        try:
            got = read_plugin(buf, n, ids, strings)
        except Exception as e:  # a plugin the reader can't follow is listed, never fatal
            print("skip", n, e, file=sys.stderr)
            continue
        for k in parts:
            parts[k].update(got[k])  # later plugins win
        if b"CELL" in buf or b"WRLD" in buf:
            bufs.append((n, p, loc))
    # Pass 2: where the givers (and the NPCs behind forced references) are placed.
    refs = {a["ref"] for q in parts["quests"].values() for a in q["aliases"] if a.get("ref")}
    npcs = set()
    for q in kept:
        g = likely_giver(q["id"], parts["infos"], parts["quests"].get(q["id"], {"aliases": []})["aliases"], parts["names"], {})
        if g:
            npcs.add(g["npc"])
    placed, cells = {}, {}
    for n, p, loc in bufs:
        buf = open(p, "rb").read()
        strings = (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else None
        try:
            pl, ce = read_placements(buf, n, npcs, refs, strings)
        except Exception as e:  # noqa: BLE001
            print("skip placements", n, e, file=sys.stderr)
            continue
        placed.update(pl)
        cells.update(ce)
    # The NPCs behind forced references can be givers too; place them as well.
    extra = {p["base"] for p in placed.values() if p["base"] and parts["names"].get(p["base"], {}).get("type") == "NPC_"} - npcs
    if extra:
        for n, p, loc in bufs:
            buf = open(p, "rb").read()
            strings = (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else None
            try:
                pl, _ = read_placements(buf, n, extra, set(), strings)
            except Exception:  # noqa: BLE001
                continue
            placed.update(pl)
    rows = build(kept, parts, placed, cells)
    counts = coverage(rows)
    with open(os.path.join(base, "quest_givers_raw.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"coverage": counts, "quests": rows}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    with open(os.path.join(base, "quest_givers_report.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write(report(rows, counts))
    print(", ".join(f"{k} {v}" for k, v in counts.items()))
    errs = sum(1 for r in rows if r.get("vmadError"))
    if errs:
        print("quests whose scripts couldn't be read:", errs)
    print("wrote quest_givers_raw.json and quest_givers_report.md in", os.path.relpath(base, REPO))


VERSION = "5.0.4.8"
if __name__ == "__main__":
    if len(sys.argv) > 1:
        VERSION = sys.argv[1]
    main()
