"""
What other plugins change about how each curated quest line starts (WO-101). Reads only. Needs
quests_raw.json, questlines_raw.json, questlines.json and quest_givers_raw.json first. Writes
gamedata/<version>/quest_starts_raw.json and quest_starts_report.md:
  python3 scripts/gamedata/quest_starts.py [version]

For each of the curated lines (questlines.py), its opening quest, and every plugin in the Ultra
load order that changes:
  quest     the opening QUST record: its dialogue and event conditions (CTDA, each naming the quest,
            global or level it reads), the start-game flag, aliases added or changed, and items given
            to an alias (CNTO), compared version by version;
  doors     every door (REFR of a DOOR with XTEL) leading into a cell the quest uses: the cells of its
            location aliases (ALFL, by the cells' XLCN) and of its people's placed references
            (quest_givers_raw.json), and of the references tied to the quest by a script: triggers and
            activators whose scripts point at it (how a quest with no aliases, like Gravewind's, starts)
            and references its own script points at. When such a cell is outdoors, the doors in it
            leading indoors count too. Its lock (XLOC: level, 255 needs a key, the key and who carries
            it: an NPC's or container's inventory, a quest alias's inventory, or a placed key) and an
            enable parent (XESP) that keeps it hidden until something happens;
  dialogue  the quest's own INFOs whose conditions a later plugin changes;
  globals   the globals its conditions read (GetGlobalValue, or a condition compared with a global)
            and their winning values, with the plugin that sets them.

A change counts against a line when the plugin isn't the quest's own mod (its MO2 folder; the base
game's five masters count as one). The report lists every line, and the changed ones worst first: a
lock or key, then a new condition, then a global, each in plain words.
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
START_GAME = 0x01  # QUST DNAM flag
PERSISTENT = 0x400  # CELL record flag: a worldspace's persistent cell, holding refs from all over it
CELL_SIZE = 4096
CMP = {0: "==", 1: "!=", 2: ">", 3: ">=", 4: "<", 5: "<="}
FUNCTIONS = {14: "GetActorValue", 47: "GetItemCount", 77: "GetRandomPercent", 56: "GetQuestRunning", 58: "GetStage", 59: "GetStageDone", 69: "GetIsRace",
             71: "GetInFaction", 72: "GetIsID", 74: "GetGlobalValue", 80: "GetLevel", 448: "HasPerk", 543: "GetQuestCompleted",
             566: "GetIsAliasRef"}
FORM_PARAM = {47, 56, 58, 59, 69, 71, 72, 74, 448, 543}
LOCK_LEVELS = {1: "Novice", 25: "Apprentice", 50: "Adept", 75: "Expert", 100: "Master", 255: "needs a key"}
BASE = {"skyrim.esm", "update.esm", "dawnguard.esm", "hearthfires.esm", "dragonborn.esm"}
NAMED = ("NPC_", "LCTN", "KEYM", "QUST", "GLOB", "DOOR", "CONT", "WRLD")


def _text(v):
    return v.rstrip(b"\0").decode("utf-8", "replace")


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


def ctda(v, masters, name):
    """A condition as the record has it: function, comparison, value (or the global it's compared with), param."""
    op, fn, p1, p2 = v[0], struct.unpack_from("<H", v, 8)[0], struct.unpack_from("<I", v, 12)[0], struct.unpack_from("<I", v, 16)[0]
    c = {"fn": FUNCTIONS.get(fn, f"fn{fn}"), "cmp": CMP.get(op >> 5, "?"), "or": bool(op & 1)}
    if op & 0x04:  # compared with a global, not a number
        c["global"] = form_id(resolve(struct.unpack_from("<I", v, 4)[0], masters, name))
    else:
        c["value"] = round(struct.unpack_from("<f", v, 4)[0], 4)
    if fn in FORM_PARAM:
        c["param"] = form_id(resolve(p1, masters, name))
    elif p1:
        c["param"] = p1
    if fn in (58, 59):
        c["stage"] = p2
    return c


def read_quest(subs, masters, name):
    """A QUST's start-relevant parts: dialogue and event conditions, flags, aliases with their fills and items."""
    out = {"dialogue": [], "event": [], "flags": 0, "aliases": []}
    part, alias = "dialogue", None
    for s, v in subs:
        if s == "DNAM" and len(v) >= 2 and part in ("dialogue", "event"):
            out["flags"] = struct.unpack_from("<H", v)[0]
        elif s == "NEXT" and part == "dialogue":
            part = "event"
        elif s == "CTDA" and part in ("dialogue", "event") and len(v) >= 24:
            out[part].append(ctda(v, masters, name))
        elif s in ("INDX", "QOBJ", "ANAM"):
            part = "rest"
        if s in ("ALST", "ALLS"):
            alias = {"id": struct.unpack_from("<I", v)[0], "name": "", "items": []}
            out["aliases"].append(alias)
        elif alias is not None:
            if s == "ALID":
                alias["name"] = _text(v)
            elif s in ("ALUA", "ALFR", "ALFL") and len(v) >= 4:
                alias[{"ALUA": "actor", "ALFR": "ref", "ALFL": "location"}[s]] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
            elif s == "CNTO" and len(v) >= 8:
                fid, n = struct.unpack_from("<Ii", v)
                alias["items"].append([form_id(resolve(fid, masters, name)), n])
            elif s == "ALED":
                alias = None
    return out


def read_plugin(buf, name, openings, strings=None):
    """
    One plugin's versions of the records WO-101 compares: the opening quests, every quest alias's
    inventory, the opening quests' INFOs, globals, names, NPC and container inventories.
    """
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    strings = strings or {}

    def txt(v):
        if loc and len(v) == 4:
            return strings.get(struct.unpack_from("<I", v)[0], "")
        return _text(v)

    out = {"quests": {}, "aliasItems": [], "infos": {}, "globals": {}, "names": {}, "inventories": {}, "scriptTargets": {}}
    if b"QUST" in buf:
        for o in iter_group(buf, "QUST"):
            _, flags, fid, d = rec_data(buf, o)
            key = form_id(resolve(fid, masters, name))
            subs = subrecs(d)
            q = read_quest(subs, masters, name)
            for a in q["aliases"]:
                if a["items"]:
                    out["aliasItems"].append({"quest": key, "alias": a["name"], "actor": a.get("actor"), "ref": a.get("ref"), "items": a["items"]})
            if key in openings and not flags & DELETED:
                out["quests"][key] = q
                from quest_givers import vmad_objects
                for s, v in subs:
                    if s == "VMAD":
                        try:
                            out["scriptTargets"][key] = [t for _, _, t in vmad_objects(v, masters, name)]
                        except (ValueError, struct.error, IndexError):
                            pass
                        break
    if b"DIAL" in buf:
        topic = None
        for o in iter_group(buf, "DIAL"):
            t, flags, fid, d = rec_data(buf, o)
            subs = subrecs(d)
            if t == "DIAL":
                q = [form_id(resolve(struct.unpack_from("<I", v)[0], masters, name)) for s, v in subs if s == "QNAM"]
                topic = q[0] if q and q[0] in openings else None
            elif t == "INFO" and topic:
                out["infos"][form_id(resolve(fid, masters, name))] = {"quest": topic, "conditions": [ctda(v, masters, name) for s, v in subs if s == "CTDA" and len(v) >= 24]}
    if b"GLOB" in buf:
        for o in iter_group(buf, "GLOB"):
            _, _, fid, d = rec_data(buf, o)
            for s, v in subrecs(d):
                if s == "FLTV" and len(v) >= 4:
                    out["globals"][form_id(resolve(fid, masters, name))] = round(struct.unpack_from("<f", v)[0], 4)
    for grp in NAMED:
        if grp.encode() not in buf:
            continue
        for o in iter_group(buf, grp):
            t, _, fid, d = rec_data(buf, o)
            if t != grp:
                continue
            key = form_id(resolve(fid, masters, name))
            edid = full = ""
            items = []
            for s, v in subrecs(d):
                if s == "EDID":
                    edid = _text(v)
                elif s == "FULL" and not full:
                    full = txt(v).strip()
                elif s == "CNTO" and len(v) >= 8 and grp in ("NPC_", "CONT"):
                    fid2, n = struct.unpack_from("<Ii", v)
                    items.append([form_id(resolve(fid2, masters, name)), n])
            out["names"][key] = {"type": grp, "edid": edid, "name": full}
            if grp in ("NPC_", "CONT"):
                out["inventories"][key] = items
    return out


def read_refs(buf, name, keys, holders, strings=None, openings=frozenset(), wanted=frozenset()):
    """
    From one plugin's CELL and WRLD groups: every door reference with a teleport (XTEL), its lock (XLOC)
    and enable parent (XESP); placed references of the keys and of the NPCs and containers in `holders`;
    every door's cell; every cell's name and location; references whose scripts point at a quest in
    `openings` (quest id -> [(ref, cell)]); and the cells of the references in `wanted`.
    """
    from quest_givers import vmad_objects
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    strings = strings or {}

    def txt(v):
        if loc and len(v) == 4:
            return strings.get(struct.unpack_from("<I", v)[0], "")
        return _text(v)

    doors, placed, cells, tied, wanted_cells = {}, {}, {}, {}, {}
    for top in ("CELL", "WRLD"):
        if top.encode() not in buf:
            continue
        cell = world = None
        for o in iter_group(buf, top):
            t = buf[o:o + 4]
            if t == b"REFR":
                size, flags = struct.unpack_from("<II", buf, o + 4)
                if not flags & 0x40000:
                    raw = buf[o + 24:o + 24 + size]
                    if b"XTEL" not in raw and b"XLOC" not in raw and b"VMAD" not in raw and not (keys or holders or wanted):
                        continue
            elif t not in (b"CELL", b"WRLD", b"ACHR"):
                continue
            tt, flags, fid, d = rec_data(buf, o)
            key = form_id(resolve(fid, masters, name))
            subs = subrecs(d)
            if tt == "WRLD":
                world = key
                continue
            if tt == "CELL":
                cell = key
                c = {"world": world if top == "WRLD" else None, "plugin": name, "persistent": bool(flags & PERSISTENT)}
                for s, v in subs:
                    if s == "XCLC" and len(v) >= 8:
                        c["grid"] = list(struct.unpack_from("<ii", v))
                    if s == "FULL":
                        c["name"] = txt(v).strip()
                    elif s == "XLCN" and len(v) >= 4:
                        c["location"] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
                cells[key] = c
                continue
            if key in wanted:
                wanted_cells[key] = (cell, None)
            base = xtel = xloc = xesp = pos = None
            for s, v in subs:
                if s == "DATA" and len(v) >= 8:
                    pos = list(struct.unpack_from("<ff", v))
                if s == "VMAD" and openings:
                    try:
                        for _, _, target in vmad_objects(v, masters, name):
                            if target in openings:
                                tied.setdefault(target, []).append((key, cell, pos))
                    except (ValueError, struct.error, IndexError):
                        pass
                if s == "NAME" and len(v) >= 4:
                    base = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
                elif s == "XTEL" and len(v) >= 4:
                    xtel = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
                elif s == "XLOC" and len(v) >= 8:
                    k = struct.unpack_from("<I", v, 4)[0]
                    xloc = {"level": v[0], **({"key": form_id(resolve(k, masters, name))} if k else {})}
                elif s == "XESP" and len(v) >= 8:
                    xesp = {"parent": form_id(resolve(struct.unpack_from("<I", v)[0], masters, name)), "opposite": bool(v[4] & 1)}
            if key in wanted:
                wanted_cells[key] = (cell, pos)
            if tt == "REFR" and xtel:
                doors[key] = {"base": base, "cell": cell, "pos": pos, "to": xtel, "lock": xloc, "enable": xesp, "deleted": bool(flags & DELETED)}
            if base in keys or base in holders or key in wanted:
                placed[key] = {"base": base, "cell": cell, "pos": pos, "deleted": bool(flags & DELETED)}
    return doors, placed, cells, tied, wanted_cells


def real_cell(cell, pos, cells, grid):
    """A reference's own cell: for one in a worldspace's persistent cell, the exterior cell its position falls in."""
    c = cells.get(cell)
    if not c or not c.get("persistent"):
        return cell
    if not pos:
        return None
    return grid.get((c["world"], int(pos[0] // CELL_SIZE), int(pos[1] // CELL_SIZE)))


def describe_condition(c, names, globals_):
    """A condition in plain words: 'level 20 or more', 'Dark Ancestor stage 200 done', 'global X >= 1 (now 0)'."""
    def nm(fid):
        n = names.get(fid, {})
        return n.get("name") or n.get("edid") or fid
    val = c.get("value")
    if "global" in c:
        g = c["global"]
        val = f"{nm(g)} (now {globals_.get(g, {}).get('value', '?')})"
    fn = c["fn"]
    if fn == "GetLevel":
        return f"level {c['cmp']} {val}"
    if fn == "GetStageDone":
        return f"{nm(c['param'])} stage {c.get('stage')} {'done' if (c.get('value') == 1) == (c['cmp'] == '==') else 'not done'}"
    if fn == "GetQuestCompleted":
        return f"{nm(c['param'])} {'completed' if (c.get('value') == 1) == (c['cmp'] == '==') else 'not completed'}"
    if fn == "GetStage":
        return f"{nm(c['param'])} stage {c['cmp']} {val}"
    if fn == "GetGlobalValue":
        g = c["param"]
        return f"global {nm(g)} {c['cmp']} {val} (now {globals_.get(g, {}).get('value', '?')})"
    if "param" in c and isinstance(c["param"], str):
        return f"{fn} {nm(c['param'])} {c['cmp']} {val}"
    return f"{fn} {c['cmp']} {val}"


def cond_key(c):
    return json.dumps(c, sort_keys=True)


def quest_changes(versions):
    """Version by version (load order), what each plugin changes in the opening QUST: [(plugin, kind, detail)]."""
    out = []
    for (_, prev), (plugin, cur) in zip(versions, versions[1:]):
        for part in ("dialogue", "event"):
            before = {cond_key(c) for c in prev[part]}
            after = {cond_key(c) for c in cur[part]}
            for c in cur[part]:
                if cond_key(c) not in before:
                    out.append((plugin, "condition", {"part": part, "added": c}))
            for c in prev[part]:
                if cond_key(c) not in after:
                    out.append((plugin, "condition", {"part": part, "removed": c}))
        if (prev["flags"] ^ cur["flags"]) & START_GAME:
            out.append((plugin, "start game", {"on": bool(cur["flags"] & START_GAME)}))
        pa = {a["name"]: a for a in prev["aliases"]}
        for a in cur["aliases"]:
            old = pa.get(a["name"])
            fill = {k: a.get(k) for k in ("actor", "ref", "location")}
            if old is None:
                out.append((plugin, "alias", {"added": a["name"], **{k: v for k, v in fill.items() if v}}))
            elif fill != {k: old.get(k) for k in ("actor", "ref", "location")}:
                out.append((plugin, "alias", {"changed": a["name"], **{k: v for k, v in fill.items() if v}}))
            new_items = [i for i in a["items"] if i not in (old or {}).get("items", [])]
            if new_items:
                out.append((plugin, "alias items", {"alias": a["name"], "items": new_items}))
    return out


def info_changes(info_versions):
    """For each INFO, the plugins after the first that change its conditions."""
    out = []
    for iid, versions in info_versions.items():
        for (_, prev), (plugin, cur) in zip(versions, versions[1:]):
            if [cond_key(c) for c in prev["conditions"]] != [cond_key(c) for c in cur["conditions"]]:
                added = [c for c in cur["conditions"] if cond_key(c) not in {cond_key(x) for x in prev["conditions"]}]
                removed = [c for c in prev["conditions"] if cond_key(c) not in {cond_key(x) for x in cur["conditions"]}]
                out.append((plugin, "dialogue", {"info": iid, "added": added, "removed": removed}))
    return out


def needs_key(lock):
    return bool(lock) and lock["level"] == 255


def door_changes(versions):
    """
    For one door, what each plugin changes about getting through it, as `what`:
      key       it now needs a key (lock level 255) and didn't
      locked    it had no lock and now has one
      unlocked  its lock is gone
      hidden    an enable parent now keeps it hidden (or a different one does)
      shown     its enable parent is gone
      minor     only the lock's level or key changes (USSEP's Novice fix, Requiem's harder locks)
    A door a mod makes counts when it needs a key or is hidden from the start; a base-game door locked
    from the start isn't a change.
    """
    out = []
    prev = None
    for plugin, cur in versions:
        if prev is None:
            if plugin.lower() not in BASE:
                if needs_key(cur["lock"]):
                    out.append((plugin, "door", {"what": "key", "lock": cur["lock"], "new": True}))
                if cur["enable"]:
                    out.append((plugin, "door", {"what": "hidden", "enable": cur["enable"], "new": True}))
        else:
            if cur["lock"] != prev["lock"]:
                if needs_key(cur["lock"]) and not needs_key(prev["lock"]):
                    what = "key"
                elif cur["lock"] and not prev["lock"]:
                    what = "locked"
                elif prev["lock"] and not cur["lock"]:
                    what = "unlocked"
                else:
                    what = "minor"
                out.append((plugin, "door", {"what": what, "lock": cur["lock"], "was": prev["lock"]}))
            if cur["enable"] != prev["enable"]:
                out.append((plugin, "door", {"what": "hidden" if cur["enable"] else "shown", "enable": cur["enable"], "wasEnable": prev["enable"]}))
        prev = cur
    return out


TEST_CELL = re.compile(r"test|smoke|editor", re.I)


def carriers(key, inventories, alias_items, placed, cells, names):
    """Who carries a key: NPCs and containers with it, quest aliases given it, and where any of them (or the key) is placed."""
    out = []

    def places(base):
        rows = []
        for ref, p in placed.items():
            if p["base"] == base and not p["deleted"]:
                c = cells.get(p["cell"], {})
                where = c.get("name") or names.get(c.get("location"), {}).get("name") or names.get(c.get("world"), {}).get("name")
                lname = names.get(c.get("location"), {}).get("name")
                text = ", ".join(dict.fromkeys(x for x in (where, lname) if x)) or p["cell"]
                if not TEST_CELL.search(text):  # developers' test cells hold every key in the game
                    rows.append(text)
        return rows

    for holder, items in inventories.items():
        if any(i[0] == key for i in items):
            n = names.get(holder, {})
            kind = "npc" if n.get("type") == "NPC_" else "container"
            where = places(holder)
            if kind == "container" and not where:
                continue  # a container never placed outside a test cell
            out.append({"kind": kind, "id": holder, "name": n.get("name") or n.get("edid") or holder, "places": where})
    def ref_place(ref):
        p = placed.get(ref)
        if not p or p["deleted"]:
            return [], None
        c = cells.get(p["cell"], {})
        where = c.get("name") or names.get(c.get("location"), {}).get("name") or names.get(c.get("world"), {}).get("name")
        lname = names.get(c.get("location"), {}).get("name")
        return [", ".join(dict.fromkeys(x for x in (where, lname) if x)) or p["cell"]], p["base"]

    for a in alias_items:
        if any(i[0] == key for i in a["items"]):
            who, where = a.get("actor"), []
            if who:
                where = places(who)
            elif a.get("ref"):
                where, who = ref_place(a["ref"])
            n = names.get(who, {}) if who else {}
            out.append({"kind": "quest alias", "quest": names.get(a["quest"], {}).get("name") or names.get(a["quest"], {}).get("edid") or a["quest"],
                        "alias": a["alias"], "id": who, "name": n.get("name") or a["alias"], "places": where})
    ps = places(key)
    if ps:
        out.append({"kind": "placed", "name": names.get(key, {}).get("name") or key, "places": ps})
    return out


def plain_lock(door, target, names, carry):
    """'The Cemetery Homestead door needs the Cemetery Homestead Key, carried by Vighar in Bloodlet Throne.'"""
    lock = door["lock"]
    door_name = f"The {target} door" if target else "A door into the quest's place"
    if lock["level"] == 255:
        kn = names.get(lock.get("key"), {})
        key = f"the {kn['name']}" if kn.get("name") else (f"a key ({kn.get('edid') or lock['key']})" if lock.get("key") else "a key it doesn't name")
        people = [f"{c['name']}" + (f" in {c['places'][0]}" if c["places"] else "") for c in carry if c["kind"] != "placed"]
        who = "; ".join(people[:3]) + (f" and {len(people) - 3} more" if len(people) > 3 else "")
        lying = "; ".join(c["places"][0] for c in carry if c["kind"] == "placed" and c["places"])
        text = f"{door_name} needs {key}"
        if who:
            text += f", carried by {who}"
        if lying:
            text += f"{' or' if who else ','} lying in {lying}"
        return (text + ".").replace("The The ", "The ")
    return f"{door_name} is locked ({LOCK_LEVELS.get(lock['level'], lock['level'])})."


def main():
    from bsa import vanilla_strings
    from esp import ROOT, load_order, localized_strings, plugin_paths
    from questlines import curate
    from recipes import plugin_folders

    base = os.path.join(REPO, "gamedata", VERSION)
    load = lambda n: json.load(open(os.path.join(base, n), encoding="utf-8"))  # noqa: E731
    quests = load("quests_raw.json")["quests"]
    cur = load("questlines.json")
    lines = curate(quests, load("questlines_raw.json")["lines"], cur)
    by_edid = {q["edid"]: q for q in quests}
    givers = {r["id"]: r for r in load("quest_givers_raw.json")["quests"]}
    openings = {by_edid[l["opening"]]["id"] for l in lines}

    pp, lo = plugin_paths(), load_order()
    qv, iv, gv = {}, {}, {}  # versions in load order: quest, INFO, global
    names, inventories, alias_items, script_targets = {}, {}, {}, {}
    ref_plugins = []
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else None
        try:
            got = read_plugin(buf, n, openings, strings)
        except Exception as e:  # a plugin the reader can't follow is listed, never fatal
            print("skip", n, e, file=sys.stderr)
            continue
        for k, q in got["quests"].items():
            qv.setdefault(k, []).append((n, q))
        for k, i in got["infos"].items():
            iv.setdefault(k, []).append((n, i))
        for k, v in got["globals"].items():
            gv.setdefault(k, []).append((n, v))
        names.update(got["names"])
        inventories.update(got["inventories"])
        script_targets.update(got["scriptTargets"])
        for a in got["aliasItems"]:
            alias_items[(a["quest"], a["alias"])] = a  # the winning quest version's alias inventory
        if b"CELL" in buf or b"WRLD" in buf:
            ref_plugins.append((n, p, loc))
    keys = {k for k, v in names.items() if v["type"] == "KEYM"}
    holders = {h for h, items in inventories.items() if any(i[0] in keys for i in items)}
    holders |= {a["actor"] for a in alias_items.values() if a.get("actor") and any(i[0] in keys for i in a["items"])}
    wanted = {t for ts in script_targets.values() for t in ts}
    alias_refs = {a["ref"] for a in alias_items.values() if a.get("ref") and any(i[0] in keys for i in a["items"])}
    wanted |= alias_refs
    dv, placed, cells, tied, wanted_cells = {}, {}, {}, {}, {}
    for n, p, loc in ref_plugins:
        buf = open(p, "rb").read()
        strings = (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else None
        try:
            doors, pl, ce, ti, wc = read_refs(buf, n, keys, holders, strings, openings, wanted)
        except Exception as e:  # noqa: BLE001
            print("skip refs", n, e, file=sys.stderr)
            continue
        for k, d in doors.items():
            dv.setdefault(k, []).append((n, d))
        placed.update(pl)
        cells.update(ce)
        for k, v in ti.items():
            tied.setdefault(k, []).extend(v)
        wanted_cells.update(wc)
    grid = {(c["world"], c["grid"][0], c["grid"][1]): cid for cid, c in cells.items() if c.get("world") and "grid" in c and not c.get("persistent")}
    for versions_d in dv.values():
        for _, d in versions_d:
            d["cell"] = real_cell(d["cell"], d.get("pos"), cells, grid)
    for p in placed.values():
        p["cell"] = real_cell(p["cell"], p.get("pos"), cells, grid) or p["cell"]
    door_cell = {k: v[-1][1]["cell"] for k, v in dv.items()}
    globals_ = {k: {"value": v[-1][1], "plugin": v[-1][0], **({"was": v[0][1], "from": v[0][0]} if v[0][1] != v[-1][1] else {})} for k, v in gv.items()}
    folders = plugin_folders(ROOT)

    def mod_of(plugin):
        if plugin.lower() in BASE:
            return "Skyrim"
        f = folders.get(plugin.lower())
        return f[0] if f else plugin

    cells_by_location = {}
    for cid, c in cells.items():
        if c.get("location"):
            cells_by_location.setdefault(c["location"], set()).add(cid)

    out = []
    for line in lines:
        q = by_edid[line["opening"]]
        qid = q["id"]
        own = mod_of(q["plugin"] if "plugin" in q else qid.split(":")[0])
        versions = qv.get(qid, [])
        winner = versions[-1][1] if versions else {"dialogue": [], "event": [], "flags": 0, "aliases": []}
        # Cells the quest uses: its location aliases' cells, and where its people are placed.
        use = set()
        for a in winner["aliases"]:
            if a.get("location"):
                use |= cells_by_location.get(a["location"], set())
        for p in givers.get(qid, {}).get("people", []):
            for w in p.get("where", []):
                if w.get("cell") and not cells.get(w["cell"], {}).get("persistent"):
                    use.add(w["cell"])
        tied_refs = [(r, real_cell(c, pos, cells, grid)) for r, c, pos in tied.get(qid, [])]
        use |= {c for _, c in tied_refs if c}
        use |= {real_cell(*wanted_cells[t], cells, grid) for t in script_targets.get(qid, []) if wanted_cells.get(t)}
        use.discard(None)

        changes = quest_changes(versions)
        topic_infos = {k: v for k, v in iv.items() if v[-1][1]["quest"] == qid}
        changes += info_changes(topic_infos)
        doors = []
        for did, versions_d in dv.items():
            d = versions_d[-1][1]
            into = door_cell.get(d["to"])
            if d["deleted"] or into is None or into == d["cell"]:
                continue
            outdoors = cells.get(d["cell"], {}).get("world") is not None
            into_indoors = cells.get(into, {}).get("world") is None
            if not ((into in use and d["cell"] not in use) or (d["cell"] in use and outdoors and into_indoors)):
                continue
            target = cells.get(door_cell[d["to"]], {})
            row = {"door": did, "from": d["cell"], "into": door_cell[d["to"]], "intoName": target.get("name") or names.get(target.get("location"), {}).get("name")}
            if d["lock"]:
                row["lock"] = dict(d["lock"], levelName=LOCK_LEVELS.get(d["lock"]["level"], d["lock"]["level"]))
                if d["lock"].get("key"):
                    row["lock"]["keyName"] = names.get(d["lock"]["key"], {}).get("name")
                    row["carriers"] = carriers(d["lock"]["key"], inventories, list(alias_items.values()), placed, cells, names)
                row["plain"] = plain_lock(d, row["intoName"], names, row.get("carriers", []))
            if d["enable"]:
                row["enable"] = d["enable"]
                parent = dv.get(d["enable"]["parent"])
                row["enablePlain"] = f"{('The ' + row['intoName'] + ' door') if row['intoName'] else 'A door into the quest' + chr(39) + 's place'} stays {'visible' if d['enable']['opposite'] else 'hidden'} until its enable parent ({d['enable']['parent']}) is {'disabled' if d['enable']['opposite'] else 'enabled'}."
            row["changes"] = [{"plugin": pl, **detail} for pl, _, detail in door_changes(versions_d)]
            doors.append(row)
            changes += [(pl, "door", dict(detail, door=did)) for pl, _, detail in door_changes(versions_d)]
        conds = winner["dialogue"] + winner["event"] + [c for v in topic_infos.values() for c in v[-1][1]["conditions"]]
        gl = sorted({c["param"] for c in conds if c["fn"] == "GetGlobalValue" and isinstance(c.get("param"), str)} | {c["global"] for c in conds if "global" in c})
        globals_row = [{"id": g, "edid": names.get(g, {}).get("edid"), **globals_.get(g, {})} for g in gl]
        foreign = [(pl, kind, det) for pl, kind, det in changes if mod_of(pl) != own and det.get("what") != "minor"]
        for g in globals_row:
            if g.get("plugin") and mod_of(g["plugin"]) != own and "was" in g:
                foreign.append((g["plugin"], "global", {"global": g["id"], "value": g["value"], "was": g["was"]}))
        row = {"line": line["id"], "name": line["name"], "opening": line["opening"], "quest": qid, "ownMod": own,
               "versions": [pl for pl, _ in versions], "conditions": {"dialogue": winner["dialogue"], "event": winner["event"]},
               "startGame": bool(winner["flags"] & START_GAME), "cellsUsed": sorted(use),
               "tiedRefs": [{"ref": r, "cell": c} for r, c in tied_refs], "doors": doors, "globals": globals_row,
               "changes": [{"plugin": pl, "kind": kind, "own": mod_of(pl) == own, **det} for pl, kind, det in changes],
               "foreign": [{"plugin": pl, "kind": kind, **det} for pl, kind, det in foreign]}
        row["plain"] = plain_words(row, names, globals_)
        out.append(row)
    write(base, out, names, globals_)


def severity(row):
    """0 a lock or key, 1 a new condition, 2 a global, 3 anything else a non-own plugin changes, 4 nothing."""
    kinds = {f["kind"] for f in row["foreign"]}
    if any(f["kind"] == "door" and f["what"] in ("key", "locked", "hidden") for f in row["foreign"]) or "alias items" in kinds:
        return 0
    if "condition" in kinds or "dialogue" in kinds:
        return 1
    if "global" in kinds:
        return 2
    return 3 if kinds else 4


def plain_words(row, names, globals_):
    """What the player has to do, from the non-own changes, in plain words."""
    out = []
    by_door = {}
    for f in row["foreign"]:
        if f["kind"] == "door":
            by_door.setdefault(f["door"], set()).add(f["what"])
    for d in row["doors"]:
        whats = by_door.get(d["door"], set())
        if whats & {"key", "locked"} and d.get("plain"):
            out.append(d["plain"])
        if "unlocked" in whats:
            out.append(f"{('The ' + d['intoName'] + ' door') if d['intoName'] else 'A door into the quest' + chr(39) + 's place'} is no longer locked.")
        if "hidden" in whats and d.get("enablePlain"):
            out.append(d["enablePlain"])
    for f in row["foreign"]:
        if f["kind"] == "condition" and "added" in f:
            out.append(f"{f['plugin']} adds a {f['part']} condition: {describe_condition(f['added'], names, globals_)}.")
        elif f["kind"] == "condition":
            out.append(f"{f['plugin']} removes a {f['part']} condition: {describe_condition(f['removed'], names, globals_)}.")
        elif f["kind"] == "dialogue":
            bits = [f"+ {describe_condition(c, names, globals_)}" for c in f["added"]] + [f"- {describe_condition(c, names, globals_)}" for c in f["removed"]]
            if bits:  # an empty change only reorders the same conditions
                out.append(f"{f['plugin']} changes the opening dialogue's conditions ({'; '.join(bits)}).")
        elif f["kind"] == "global":
            g = names.get(f["global"], {}).get("edid") or f["global"]
            out.append(f"{f['plugin']} sets the global {g} to {f['value']} (was {f['was']}).")
        elif f["kind"] == "start game":
            out.append(f"{f['plugin']} turns the quest's start-game flag {'on' if f['on'] else 'off'}.")
        elif f["kind"] == "alias":
            out.append(f"{f['plugin']} {'adds' if 'added' in f else 'changes'} the alias {f.get('added') or f.get('changed')}.")
        elif f["kind"] == "alias items":
            items = ", ".join(names.get(i, {}).get("name") or i for i, _ in f["items"])
            out.append(f"{f['plugin']} gives the alias {f['alias']}: {items}.")
    return list(dict.fromkeys(o.replace("The The ", "The ") for o in out))


def write(base, rows, names, globals_):
    with open(os.path.join(base, "quest_starts_raw.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"lines": rows}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    changed = [r for r in rows if r["foreign"]]
    kinds = Counter(k for r in changed for k in {f["kind"] if f["kind"] != "door" else "door: " + f["what"] for f in r["foreign"]})
    md = ["# How each quest line starts, and what other plugins change (WO-101)", "",
          "Written by `scripts/gamedata/quest_starts.py` from the records in the Ultra load order. For each curated line's "
          "opening quest: its conditions, the doors into the places it uses (locks, keys, enable parents), its opening "
          "dialogue and the globals its conditions read. A change counts when the plugin isn't the quest's own mod.", "",
          "## Counts", "", f"{len(rows)} lines. {len(changed)} have a change from a plugin other than their own mod.", "",
          "| Kind | Lines |", "| --- | --- |"]
    md += [f"| {k} | {n} |" for k, n in kinds.most_common()]
    md += ["", "Door changes that only move a lock's level (USSEP's Novice fix, Requiem's harder locks) are kept in the raw file as `minor` and not counted."]
    md += ["", f"Lines with a lock on a door into their places (any plugin): {sum(1 for r in rows if any(d.get('lock') for d in r['doors']))}.", "",
           "## Changed by another plugin, worst first", "", "Lock or key, then a new condition, then a global.", ""]
    label = {0: "lock or key", 1: "condition", 2: "global", 3: "other"}
    for r in sorted(changed, key=lambda r: (severity(r), r["name"].lower())):
        md += [f"### {r['name']} (`{r['opening']}`, {label[severity(r)]})", "", f"Own mod: {r['ownMod']}. Plugins: " + ", ".join(sorted({f['plugin'] for f in r['foreign']})) + ".", ""]
        md += [f"- {p}" for p in r["plain"]] or ["- (changes to aliases or other fields with no start effect in plain words)"]
        md.append("")
    md += ["## Every line", "", "| Line | Opening | Own mod | Start-game | Doors into its places (locked) | Globals | Changed by another plugin |", "| --- | --- | --- | --- | --- | --- | --- |"]
    for r in rows:
        locked = sum(1 for d in r["doors"] if d.get("lock"))
        gl = ", ".join(f"{g['edid']}={g.get('value')}" for g in r["globals"]) or ""
        md.append(f"| {r['name']} | `{r['opening']}` | {r['ownMod']} | {'yes' if r['startGame'] else ''} | {len(r['doors'])} ({locked}) | {gl} | "
                  + (", ".join(sorted({f['kind'] if f['kind'] != 'door' else 'door: ' + f['what'] for f in r['foreign']})) or "") + " |")
    with open(os.path.join(base, "quest_starts_report.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(md) + "\n")
    print(f"{len(rows)} lines, {len(changed)} changed by another plugin: " + ", ".join(f"{k} {n}" for k, n in kinds.most_common()))
    print("wrote quest_starts_raw.json and quest_starts_report.md in", os.path.relpath(base, REPO))


VERSION = "5.0.4.8"
if __name__ == "__main__":
    if len(sys.argv) > 1:
        VERSION = sys.argv[1]
    main()
