"""
What each quest's Papyrus scripts start, unlock and pay (WO-102). Reads only. Needs quests_raw.json,
questlines_raw.json, questlines.json, quest_givers_raw.json and quest_starts_raw.json first. Writes
gamedata/<version>/quest_scripts_raw.json and quest_scripts_report.md:
  python3 scripts/gamedata/quest_scripts.py [version]

Scripts read (pex.py; the winning copy, loose before BSA):
  quests     every quest's own scripts (QUST VMAD), its stage fragments (QF_..., each fragment mapped to
             its stage by the VMAD fragment table) and its aliases' scripts;
  dialogue   every dialogue line's fragments (TIF_... on INFO VMAD), with the line's quest and speaker;
  places     the scripts on the triggers, activators and doors quest_starts.py tied to each line.
Every property resolves to the form (or alias) its VMAD points it at, by name.

The calls that matter, with their targets named and the stage or dialogue line they run on:
  Start() and SetStage(n) on a quest (recorded on both sides: "X's stage 200 starts Y"),
  AddItem / RemoveItem on the player, with item and count,
  Unlock, Lock, SetLockLevel, Enable, Disable and SetOpen on references, with the reference's cell,
  AddPerk, AddSpell and ModFactionRank on the player,
  ForceRefTo and MoveTo that place people.
Inside a function, values are followed simply: Game.GetPlayer(), the PlayerRef, GetOwningQuest(),
an alias's GetReference() and properties; calls into the script's own functions are followed too.

Per quest: started by (dialogue, another quest's script, a trigger or activator, a story-manager event,
start-game), rewards (AddItem to the player on the stages that complete it, and in its dialogue that
completes it), unlocks. Per curated line, a verdict on its opening quest:
  traced  its start and its rewards resolve to records and scripts;
  random  an alias it starts or pays through is filled at run time (named);
  unread  no starter could be found, or a script it needs is missing or unreadable (named).
"""
import json
import os
import re
import struct
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import header, iter_group, rec_data, resolve, subrecs  # noqa: E402
from pex import IDENT, INT, functions  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))

DELETED = 0x20
START_GAME = 0x01
PLAYER_REF = "Skyrim.esm:000014"
PLAYER_NPC = "Skyrim.esm:000007"
NAMED = ("QUST", "NPC_", "KEYM", "WEAP", "ARMO", "MISC", "LVLI", "BOOK", "SPEL", "PERK", "ALCH", "AMMO", "SCRL", "INGR", "FACT", "SCEN", "LCTN", "WRLD", "GLOB",
         "ACTI", "TACT", "DOOR", "CONT", "FURN")
REWARD_LIST = re.compile(r"reward", re.I)
REF_CALLS = {"unlock", "lock", "setlocklevel", "enable", "disable", "setopen"}
PLAYER_CALLS = {"additem", "removeitem", "addperk", "addspell", "modfactionrank"}
REF_GETTERS = {"getreference", "getactorreference", "getactorref", "getref"}


def _text(v):
    return v.rstrip(b"\0").decode("utf-8", "replace")


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


class VmadReader:
    def __init__(self, v, masters, name):
        self.v, self.o, self.masters, self.name = v, 0, masters, name

    def take(self, fmt):
        r = struct.unpack_from("<" + fmt, self.v, self.o)
        self.o += struct.calcsize("<" + fmt)
        return r if len(r) > 1 else r[0]

    def wstr(self):
        n = self.take("H")
        s = self.v[self.o:self.o + n].decode("latin1")
        self.o += n
        return s

    def obj(self, fmt):
        if fmt == 2:
            _, alias, fid = self.take("hhI")
        else:
            fid, alias, _ = self.take("Ihh")
        return {"form": form_id(resolve(fid, self.masters, self.name)) if fid else None, "alias": alias}

    def scripts(self, ver, fmt):
        out = []
        for _ in range(self.take("H")):
            name = self.wstr()
            if ver >= 4:
                self.take("B")
            props = {}
            for _ in range(self.take("H")):
                pname = self.wstr()
                kind = self.take("B")
                if ver >= 4:
                    self.take("B")
                props[pname.lower()] = self.value(kind, fmt)
            out.append({"name": name, "props": props})
        return out

    def value(self, kind, fmt):
        if kind == 1:
            return self.obj(fmt)
        if kind == 2:
            return self.wstr()
        if kind == 3:
            return self.take("i")
        if kind == 4:
            return round(self.take("f"), 4)
        if kind == 5:
            return bool(self.take("B"))
        if kind in (11, 12, 13, 14, 15):
            n = self.take("I")
            return [self.value(kind - 10, fmt) for _ in range(n)]
        raise ValueError(f"script property type {kind}")


def parse_vmad(v, masters, name, record):
    """A record's scripts with their properties, and for a QUST its fragments (stage -> function) and alias scripts; for an INFO its fragments."""
    r = VmadReader(v, masters, name)
    ver, fmt = r.take("hh")
    out = {"scripts": r.scripts(ver, fmt)}
    if r.o >= len(v):
        return out
    try:
        if record == "QUST":
            r.take("B")
            count = r.take("H")
            out["fragmentScript"] = r.wstr()
            frags = []
            for _ in range(count):
                stage, _, log, _ = r.take("HhiB")
                script, fn = r.wstr(), r.wstr()
                frags.append({"stage": stage, "log": log, "script": script, "function": fn})
            out["fragments"] = frags
            aliases = []
            for _ in range(r.take("H")):
                obj = r.obj(fmt)
                aver, afmt = r.take("hh")
                aliases.append({"alias": obj["alias"], "scripts": r.scripts(aver, afmt)})
            out["aliasScripts"] = aliases
        elif record == "INFO":
            r.take("B")
            flags = r.take("B")
            out["fragmentScript"] = r.wstr()
            frags = []
            for bit, when in ((1, "begin"), (2, "end")):
                if flags & bit:
                    r.take("B")
                    frags.append({"when": when, "script": r.wstr(), "function": r.wstr()})
            out["fragments"] = frags
    except (struct.error, ValueError):
        out["fragmentError"] = True
    return out


def read_aliases(subs, masters, name):
    """id -> {name, fill (unique, forced, location, created, from alias, run time), actor/ref/location/creates}."""
    out, cur = {}, None
    on = False
    for s, v in subs:
        if s == "ANAM":
            on = True
        if not on:
            continue
        if s in ("ALST", "ALLS"):
            cur = {"id": struct.unpack_from("<I", v)[0], "name": "", "kind": "ref" if s == "ALST" else "location"}
            out[cur["id"]] = cur
        elif cur is None:
            continue
        elif s == "ALID":
            cur["name"] = _text(v)
        elif s in ("ALUA", "ALFR", "ALFL", "ALCO") and len(v) >= 4:
            cur[{"ALUA": "actor", "ALFR": "ref", "ALFL": "location", "ALCO": "creates"}[s]] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
        elif s == "ALFA":
            cur["fromAlias"] = True
        elif s in ("ALFE", "ALFD"):
            cur["fromEvent"] = True
        elif s == "ALED":
            cur = None
    for a in out.values():
        a["fill"] = ("unique" if a.get("actor") else "forced" if a.get("ref") else "location" if a.get("location") else
                     "created" if a.get("creates") else "from alias" if a.get("fromAlias") else "from event" if a.get("fromEvent") else "run time")
    return out


def read_plugin(buf, name, strings=None):
    """Every QUST's scripts, aliases, stages and flags; every INFO with scripts, its quest and speaker; names."""
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    strings = strings or {}

    def txt(v):
        if loc and len(v) == 4:
            return strings.get(struct.unpack_from("<I", v)[0], "")
        return _text(v)

    out = {"quests": {}, "infos": {}, "names": {}}
    if b"QUST" in buf:
        for o in iter_group(buf, "QUST"):
            _, flags, fid, d = rec_data(buf, o)
            if flags & DELETED:
                continue
            key = form_id(resolve(fid, masters, name))
            subs = subrecs(d)
            q = {"aliases": read_aliases(subs, masters, name), "flags": 0, "vmad": None}
            for s, v in subs:
                if s == "VMAD" and q["vmad"] is None:
                    try:
                        q["vmad"] = parse_vmad(v, masters, name, "QUST")
                    except (struct.error, ValueError) as e:
                        q["vmadError"] = str(e)
                elif s == "DNAM" and len(v) >= 2 and not q["flags"]:
                    q["flags"] = struct.unpack_from("<H", v)[0]
                elif s == "INDX":
                    break
            out["quests"][key] = q
    if b"DIAL" in buf:
        topic = None
        for o in iter_group(buf, "DIAL"):
            if buf[o:o + 4] == b"INFO":
                size, rflags = struct.unpack_from("<II", buf, o + 4)
                if not rflags & 0x40000 and b"VMAD" not in buf[o + 24:o + 24 + size]:
                    continue
            t, flags, fid, d = rec_data(buf, o)
            subs = subrecs(d)
            if t == "DIAL":
                q = [form_id(resolve(struct.unpack_from("<I", v)[0], masters, name)) for s, v in subs if s == "QNAM"]
                topic = q[0] if q else None
                continue
            vm = next((v for s, v in subs if s == "VMAD"), None)
            if vm is None or flags & DELETED:
                continue
            speaker = None
            for s, v in subs:
                if s == "CTDA" and len(v) >= 24 and struct.unpack_from("<H", v, 8)[0] == 72 and v[0] >> 5 == 0:
                    speaker = form_id(resolve(struct.unpack_from("<I", v, 12)[0], masters, name))
                    break
            try:
                out["infos"][form_id(resolve(fid, masters, name))] = {"quest": topic, "speaker": speaker, "vmad": parse_vmad(vm, masters, name, "INFO")}
            except (struct.error, ValueError):
                pass
    for grp in NAMED:
        if grp.encode() not in buf:
            continue
        for o in iter_group(buf, grp):
            t, _, fid, d = rec_data(buf, o)
            if t != grp:
                continue
            edid = full = ""
            entries = []
            for s, v in subrecs(d):
                if s == "EDID":
                    edid = _text(v)
                elif s == "FULL" and not full:
                    full = txt(v).strip()
                    if grp != "LVLI":
                        break
                elif s == "LVLO" and len(v) >= 8:
                    entries.append(form_id(resolve(struct.unpack_from("<I", v, 4)[0], masters, name)))
            row = {"type": grp, "edid": edid, "name": full}
            if entries:
                row["entries"] = entries
            out["names"][form_id(resolve(fid, masters, name))] = row
    return out


def read_refs(buf, name, wanted, strings=None):
    """For references in `wanted`: base, cell, position and scripts; and every cell's name, location, grid and persistence."""
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    strings = strings or {}

    def txt(v):
        if loc and len(v) == 4:
            return strings.get(struct.unpack_from("<I", v)[0], "")
        return _text(v)

    refs, cells = {}, {}
    for top in ("CELL", "WRLD"):
        if top.encode() not in buf:
            continue
        cell = world = None
        for o in iter_group(buf, top):
            t = buf[o:o + 4]
            if t in (b"REFR", b"ACHR"):
                key = form_id(resolve(struct.unpack_from("<I", buf, o + 12)[0], masters, name))
                if key not in wanted:
                    continue
            elif t not in (b"CELL", b"WRLD"):
                continue
            tt, flags, fid, d = rec_data(buf, o)
            subs = subrecs(d)
            key = form_id(resolve(fid, masters, name))
            if tt == "WRLD":
                world = key
                for s, v in subs:
                    if s == "FULL":
                        cells.setdefault("__worlds__", {})[key] = txt(v).strip()
                continue
            if tt == "CELL":
                cell = key
                c = {"world": world if top == "WRLD" else None, "persistent": bool(flags & 0x400)}
                for s, v in subs:
                    if s == "FULL":
                        c["name"] = txt(v).strip()
                    elif s == "XLCN" and len(v) >= 4:
                        c["location"] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
                    elif s == "XCLC" and len(v) >= 8:
                        c["grid"] = list(struct.unpack_from("<ii", v))
                cells[key] = c
                continue
            r = {"cell": cell, "deleted": bool(flags & DELETED), "base": None, "pos": None, "vmad": None}
            for s, v in subs:
                if s == "NAME" and len(v) >= 4:
                    r["base"] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, name))
                elif s == "DATA" and len(v) >= 8:
                    r["pos"] = list(struct.unpack_from("<ff", v))
                elif s == "VMAD":
                    try:
                        r["vmad"] = parse_vmad(v, masters, name, "REFR")
                    except (struct.error, ValueError):
                        pass
            refs[key] = r
    return refs, cells


class Analyzer:
    """Follows one script's functions and records the calls that matter, resolving properties and simple values."""

    def __init__(self, scripts, names, quest_aliases, quest_props=None):
        self.scripts, self.names, self.quest_aliases = scripts, names, quest_aliases
        self.quest_props = quest_props or {}  # quest id -> its scripts' properties, by name
        self.unreadable, self.missing = set(), set()

    def prop_value(self, v, owner_quest):
        """A VMAD property value as a descriptor: player, quest, alias, form, or a plain number."""
        if isinstance(v, dict):
            if v.get("alias", -1) not in (-1, None) and v.get("form"):
                q = v["form"]
                a = self.quest_aliases.get(q, {}).get(v["alias"])
                if a and (a.get("ref") == PLAYER_REF or a["name"].lower() == "player"):
                    return {"player": True}
                return {"alias": a["name"] if a else f"alias {v['alias']}", "aliasId": v["alias"], "quest": q, "fill": a["fill"] if a else "unknown",
                        "creates": a.get("creates") if a else None, "ref": a.get("ref") if a else None, "actor": a.get("actor") if a else None}
            f = v.get("form")
            if f in (PLAYER_REF, PLAYER_NPC):
                return {"player": True}
            if f:
                t = self.names.get(f, {}).get("type")
                return {"quest": f} if t == "QUST" else {"form": f, "type": t}
            return None
        if isinstance(v, (int, float)) and not isinstance(v, bool):
            return {"int": v}
        return None

    def run(self, script_name, props, owner, entry_functions=None):
        """Events from a script: [{call, ..., function}]. owner: {"quest"} / {"alias", "quest"} / {"info", "quest"} / {"ref"}."""
        pex = self.scripts.get(script_name)
        if pex is None:
            self.missing.add(script_name)
            return []
        if isinstance(pex, str):
            self.unreadable.add(script_name)
            return []
        obj = pex["objects"][0] if pex["objects"] else {"properties": [], "states": []}
        autovars = {p["autovar"].lower(): p["name"].lower() for p in obj["properties"] if p.get("autovar")}
        funcs = {}
        for _, f in functions(pex):
            funcs.setdefault(f["name"].lower(), f)
        base_env = {}
        for var, pname in autovars.items():
            if pname in props:
                base_env[var] = self.prop_value(props[pname], owner.get("quest"))
        events = []
        names = entry_functions or [f["name"] for _, f in functions(pex) if not f["native"]]
        for fname in names:
            f = funcs.get(fname.lower())
            if f:
                self.walk(f, dict(base_env), owner, funcs, autovars, props, events, fname, 0)
        return events

    def walk(self, f, env, owner, funcs, autovars, props, events, entry, depth):
        def val(a):
            t, x = a
            if t == INT:
                return {"int": x}
            if t == IDENT:
                k = x.lower()
                if k == "self":
                    return {"self": True, **owner}
                return env.get(k)
            return None

        for op, args in f["code"]:
            if op in ("assign", "cast") and args[0][0] == IDENT:
                env[args[0][1].lower()] = val(args[1])
            elif op == "propget" and args[1][0] == IDENT:
                obj, pname = val(args[1]), args[0][1].lower()
                p = None
                if args[1][1].lower() == "self" and not owner.get("info"):
                    p = props.get(pname)
                if p is None and obj and obj.get("quest") and "alias" not in obj and "aliasRef" not in obj:
                    # (self as DA09QuestScript), (GetOwningQuest() as TG00QuestScript): that quest's script properties
                    p = self.quest_props.get(obj["quest"], {}).get(pname)
                env[args[2][1].lower()] = self.prop_value(p, owner.get("quest")) if p is not None else None
            elif op == "callstatic":
                cls, fn = args[0][1].lower(), args[1][1].lower()
                dest = args[2][1].lower() if args[2][0] == IDENT else None
                if dest:
                    env[dest] = {"player": True} if (cls, fn) == ("game", "getplayer") else None
            elif op == "callmethod":
                fn = args[0][1]
                fl = fn.lower()
                target = val(args[1])
                dest = args[2][1].lower() if args[2][0] == IDENT else None
                rest = [val(a) for a in args[3:]]
                result = None
                if fl == "getowningquest":
                    result = {"quest": owner.get("quest")} if owner.get("quest") else None
                elif fl in REF_GETTERS and target and "alias" in target:
                    result = {"player": True} if target.get("ref") == PLAYER_REF else {"aliasRef": target["alias"], **{k: target.get(k) for k in ("fill", "creates", "ref", "actor", "quest")}}
                elif fl == "getalias" and target and "quest" in target and rest and rest[0] and "int" in rest[0]:
                    a = self.quest_aliases.get(target["quest"], {}).get(int(rest[0]["int"]))
                    result = {"alias": a["name"], "quest": target["quest"], "fill": a["fill"], "creates": a.get("creates"), "ref": a.get("ref"), "actor": a.get("actor")} if a else None
                elif target and target.get("self") and fl in funcs and depth < 4 and not funcs[fl]["native"]:
                    sub_env = dict(env)
                    for (pname, _), arg in zip(funcs[fl]["params"], rest):
                        sub_env[pname.lower()] = arg
                    self.walk(funcs[fl], sub_env, owner, funcs, autovars, props, events, entry, depth + 1)
                ev = self.event(fl, fn, target, rest, owner)
                if ev:
                    ev["function"] = entry
                    events.append(ev)
                if dest:
                    env[dest] = result

    def event(self, fl, fn, target, rest, owner):
        if target is None:
            return None
        quest = target.get("quest") if ("quest" in target and "alias" not in target and "aliasRef" not in target) else None
        if target.get("self") and owner.get("info"):
            quest = None  # an INFO isn't a quest; GetOwningQuest() gives the quest
        if fl == "setstage" and quest and rest and rest[0] and "int" in rest[0]:
            return {"call": "SetStage", "quest": quest, "stage": int(rest[0]["int"])}
        if fl == "start" and quest:
            return {"call": "Start", "quest": quest}
        if fl in PLAYER_CALLS and target.get("player"):
            item = rest[0] if rest else None
            if len(rest) > 1:
                count = rest[1]["int"] if rest[1] and "int" in rest[1] else None  # a count from a variable the reader can't follow
            else:
                count = 1 if fl in ("additem", "removeitem") else None
            return {"call": fn, "item": item, "count": count}
        if fl in REF_CALLS and ("form" in target or "aliasRef" in target or "alias" in target):
            return {"call": fn, "ref": target}
        if fl == "forcerefto" and "alias" in target:
            return {"call": "ForceRefTo", "alias": target["alias"], "to": rest[0] if rest else None}
        if fl == "moveto" and ("aliasRef" in target or "form" in target):
            return {"call": "MoveTo", "who": target, "to": rest[0] if rest else None}
        return None


def describe(d, names, cells=None):
    """A value descriptor in words."""
    if not d:
        return "something the reader can't resolve"
    if d.get("player"):
        return "the player"
    if "aliasRef" in d or "alias" in d:
        a = d.get("aliasRef") or d.get("alias")
        made = d.get("creates")
        if made:
            return f"{names.get(made, {}).get('name') or made} (alias {a})"
        who = d.get("actor") or d.get("ref")
        return f"alias {a}" + (f" ({names.get(who, {}).get('name')})" if who and names.get(who, {}).get("name") else "")
    if "quest" in d and d["quest"]:
        n = names.get(d["quest"], {})
        return n.get("name") or n.get("edid") or d["quest"]
    if "form" in d:
        n = names.get(d["form"], {})
        return n.get("name") or n.get("edid") or d["form"]
    if "int" in d:
        return str(d["int"])
    return "something the reader can't resolve"


def item_of(ev, names):
    """An AddItem's item as {id, name, type, count}, gold counted as gold; None when the item can't be resolved."""
    d = ev.get("item")
    if not d:
        return None
    fid = d.get("form") or d.get("creates")
    if not fid:
        return None
    n = names.get(fid, {})
    out = {"id": fid, "name": n.get("name") or n.get("edid") or fid, "type": n.get("type"), "count": ev.get("count")}
    if n.get("edid", "").lower().startswith("gold") and n.get("type") == "MISC":
        out["gold"] = True
    if n.get("type") == "LVLI":
        if REWARD_LIST.search(n.get("edid", "")):
            out["rewardList"] = True
        inside = list(dict.fromkeys(names.get(e, {}).get("name") or names.get(e, {}).get("edid") or e for e in n.get("entries", [])))
        if 0 < len(inside) <= 3:
            out["contains"] = inside
            out["containsTypes"] = sorted({names.get(e, {}).get("type") for e in n.get("entries", []) if names.get(e, {}).get("type")})
    return out


def main():
    from bsa import vanilla_strings
    from esp import ROOT, load_order, localized_strings, plugin_paths
    from pex import Scripts
    from questlines import curate
    from quest_starts import real_cell

    base = os.path.join(REPO, "gamedata", VERSION)
    load = lambda n: json.load(open(os.path.join(base, n), encoding="utf-8"))  # noqa: E731
    kept = load("quests_raw.json")["quests"]
    cur = load("questlines.json")
    lines = curate(kept, load("questlines_raw.json")["lines"], cur)
    givers = {r["id"]: r for r in load("quest_givers_raw.json")["quests"]}
    starts = {r["line"]: r for r in load("quest_starts_raw.json")["lines"]}
    by_edid = {q["edid"]: q for q in kept}
    kept_ids = {q["id"] for q in kept}

    pp, lo = plugin_paths(), load_order()
    quests, infos, names = {}, {}, {}
    ref_plugins = []
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else None
        try:
            got = read_plugin(buf, n, strings)
        except Exception as e:  # a plugin the reader can't follow is listed, never fatal
            print("skip", n, e, file=sys.stderr)
            continue
        quests.update(got["quests"])
        infos.update(got["infos"])
        names.update(got["names"])
        if b"CELL" in buf or b"WRLD" in buf:
            ref_plugins.append((n, p, loc))
    print(f"read {len(quests)} quests, {len(infos)} dialogue lines with scripts", flush=True)
    scripts = Scripts(ROOT, lo)
    aliases = {q: v["aliases"] for q, v in quests.items()}
    quest_props = {}
    for q, v in quests.items():
        merged = {}
        for sc in (v.get("vmad") or {}).get("scripts", []):
            for k, val in sc["props"].items():
                merged.setdefault(k, val)
        quest_props[q] = merged
    an = Analyzer(scripts, names, aliases, quest_props)

    # Places: the triggers, activators and doors WO-101 tied to each line, with their scripts and cells.
    wanted = set()
    for r in starts.values():
        wanted |= {t["ref"] for t in r.get("tiedRefs", [])} | {d["door"] for d in r.get("doors", [])}
    refs, cells = {}, {}
    for n, p, loc in ref_plugins:
        buf = open(p, "rb").read()
        strings = (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else None
        try:
            r, c = read_refs(buf, n, wanted, strings)
        except Exception as e:  # noqa: BLE001
            print("skip refs", n, e, file=sys.stderr)
            continue
        refs.update(r)
        worlds = c.pop("__worlds__", {})
        cells.update(c)
        for w, nm in worlds.items():
            names.setdefault(w, {"type": "WRLD", "edid": "", "name": nm})
    grid = {(c["world"], c["grid"][0], c["grid"][1]): cid for cid, c in cells.items() if c.get("world") and "grid" in c and not c.get("persistent")}

    def cell_text(ref):
        r = refs.get(ref)
        if not r:
            return None
        cid = real_cell(r["cell"], r["pos"], cells, grid)
        c = cells.get(cid, {})
        parts = [c.get("name"), names.get(c.get("location"), {}).get("name")]
        if not any(parts) and c.get("world"):
            parts = [names.get(c["world"], {}).get("name")]
        return ", ".join(dict.fromkeys(p for p in parts if p)) or cid

    # Every quest's own scripts and fragments, every dialogue line's fragments, the tied places' scripts.
    events = []  # (context, event)
    for qid, q in quests.items():
        vm = q.get("vmad")
        if not vm:
            continue
        owner = {"quest": qid}
        frag_fn = {}
        for fr in vm.get("fragments", []):
            frag_fn.setdefault(fr["script"].lower(), {})[fr["function"].lower()] = fr["stage"]
        for sc in vm["scripts"]:
            fmap = frag_fn.get(sc["name"].lower())
            evs = an.run(sc["name"], sc["props"], owner, list(fmap) if fmap else None)
            for ev in evs:
                stage = fmap.get(ev["function"].lower()) if fmap else None
                events.append(({"kind": "quest", "quest": qid, "script": sc["name"], "stage": stage, "fragment": bool(fmap)}, ev))
        for asc in vm.get("aliasScripts", []):
            a = q["aliases"].get(asc["alias"], {})
            for sc in asc["scripts"]:
                for ev in an.run(sc["name"], sc["props"], {"alias": a.get("name"), "quest": qid}):
                    events.append(({"kind": "alias", "quest": qid, "alias": a.get("name"), "script": sc["name"]}, ev))
    print(f"quest scripts: {len(events)} calls", flush=True)
    for iid, info in infos.items():
        vm = info["vmad"]
        for fr in vm.get("fragments", []):
            props = next((s["props"] for s in vm["scripts"] if s["name"].lower() == fr["script"].lower()), {})
            for ev in an.run(fr["script"], props, {"info": iid, "quest": info["quest"]}, [fr["function"]]):
                events.append(({"kind": "dialogue", "info": iid, "quest": info["quest"], "speaker": info["speaker"], "script": fr["script"]}, ev))
    for rid, r in refs.items():
        if not r.get("vmad"):
            continue
        for sc in r["vmad"]["scripts"]:
            for ev in an.run(sc["name"], sc["props"], {"ref": rid}):
                events.append(({"kind": "place", "ref": rid, "base": r["base"], "cell": cell_text(rid), "script": sc["name"]}, ev))
    print(f"all scripts: {len(events)} calls; scripts missing {len(an.missing)}, unreadable {len(an.unreadable)}", flush=True)

    rows = build_quests(kept, quests, events, names, givers, cell_text)
    verdicts = build_lines(lines, cur, by_edid, rows, quests, an, givers)
    try:
        current = json.load(open(os.path.join(REPO, "src", "data", f"lorerim-{VERSION}", "quests.json"), encoding="utf-8"))
    except FileNotFoundError:
        current = None
    write(base, rows, verdicts, an, names, current)


def build_quests(kept, quests, events, names, givers, cell_text):
    """Per kept quest: started by, rewards, unlocks, and every call that names it."""
    by_target = {}
    for ctx, ev in events:
        if ev["call"] in ("SetStage", "Start") and ev.get("quest"):
            by_target.setdefault(ev["quest"], []).append((ctx, ev))
    own = {}
    for ctx, ev in events:
        if ctx.get("quest"):
            own.setdefault(ctx["quest"], []).append((ctx, ev))

    def who(npc):
        n = names.get(npc, {})
        return n.get("name") or n.get("edid") or npc

    rows = {}
    for q in kept:
        qid = q["id"]
        completing = {s["index"] for s in q["stages"] if s.get("completes")}
        # A start is Start(), or SetStage to a stage no later than its first journal entry (else first objective),
        # from outside the quest's own quest and alias scripts. Later stages set from outside are advances.
        logged = [s["index"] for s in q["stages"] if s.get("log")]
        first = min(logged) if logged else (min(o["index"] for o in q["objectives"]) if q["objectives"] else 10)
        started, advanced = [], []
        for ctx, ev in by_target.get(qid, []):
            if ctx["kind"] in ("quest", "alias") and ctx["quest"] == qid:
                continue  # its own scripts moving it along
            if ev["call"] == "SetStage" and ev["stage"] > first:
                advanced.append({"by": ctx["kind"], "from": ctx.get("quest") or ctx.get("ref"), "stage": ev["stage"], "script": ctx["script"]})
                continue
            if ctx["kind"] == "dialogue":
                started.append({"by": "dialogue", "speaker": who(ctx["speaker"]) if ctx.get("speaker") else None, "info": ctx["info"],
                                "topicQuest": ctx["quest"], "call": ev["call"], "stage": ev.get("stage")})
            elif ctx["kind"] in ("quest", "alias"):
                started.append({"by": "quest script", "quest": ctx["quest"], "questName": who(ctx["quest"]), "atStage": ctx.get("stage"),
                                "script": ctx["script"], "call": ev["call"], "stage": ev.get("stage")})
            elif ctx["kind"] == "place":
                started.append({"by": "place", "ref": ctx["ref"], "base": who(ctx["base"]) if ctx.get("base") else None, "cell": ctx.get("cell"),
                                "script": ctx["script"], "call": ev["call"], "stage": ev.get("stage")})
        sm = givers.get(qid, {}).get("starts", [])
        for s in sm:
            started.append({"by": "story manager", "event": s.get("event"), "node": s.get("node")})
        if quests.get(qid, {}).get("flags", 0) & START_GAME:
            started.append({"by": "start game"})
        rewards, also, unlocks, unresolved = [], [], [], []

        def own_fragment(c):
            return c["kind"] == "quest" and c.get("fragment")
        complete_stages_from_dialogue = set()
        for ctx, ev in own.get(qid, []):
            if ctx["kind"] == "dialogue" and ev["call"] == "SetStage" and ev.get("quest") == qid and ev.get("stage") in completing:
                complete_stages_from_dialogue.add(ctx["info"])
        for ctx, ev in own.get(qid, []):
            completes = (ctx["kind"] == "quest" and ctx.get("stage") in completing) or (ctx["kind"] == "dialogue" and ctx["info"] in complete_stages_from_dialogue)
            if ev["call"].lower() == "additem":
                it = item_of(ev, names)
                row = {"item": it, "from": ctx["kind"], "stage": ctx.get("stage"), "script": ctx["script"], "function": ev["function"]}
                # Rewards: gold and reward lists at any stage (often the turn-in, before the completing stage), gear from
                # its own stage fragments at any stage, anything else only on the stages that complete it.
                gear = bool(it) and (it.get("type") in ("WEAP", "ARMO") or bool(set(it.get("containsTypes", [])) & {"WEAP", "ARMO"}))
                # Only its own stage fragments and its own dialogue: a shared quest script (the Companions' housekeeping) pays for other work.
                own_words = own_fragment(ctx) or (ctx["kind"] == "dialogue" and ctx.get("quest") == qid)
                is_reward = bool(it) and own_words and bool(it.get("gold") or it.get("rewardList") or (gear and own_fragment(ctx)) or completes)
                d = ev.get("item") or {}
                if it is None and ("aliasRef" in d or "alias" in d):
                    row["aliasItem"] = d.get("aliasRef") or d.get("alias")  # a quest item held in an alias (a journal, a ring): not a reward
                elif it is None:
                    row["unresolved"] = describe(ev.get("item"), names)
                    if completes or own_fragment(ctx):
                        unresolved.append(row)
                (rewards if is_reward else also).append(row)
            elif ev["call"].lower() in REF_CALLS:
                ref = ev["ref"]
                rid = ref.get("form") or ref.get("ref")
                unlocks.append({"call": ev["call"], "what": describe(ref, names), "cell": cell_text(rid) if rid else None, "stage": ctx.get("stage"), "script": ctx["script"]})
            elif ev["call"] in ("ForceRefTo", "MoveTo"):
                unlocks.append({"call": ev["call"], "what": describe(ev.get("alias") and {"alias": ev["alias"]} or ev.get("who"), names), "to": describe(ev.get("to"), names), "stage": ctx.get("stage"), "script": ctx["script"]})
            elif ev["call"].lower() in ("addperk", "addspell", "modfactionrank"):
                also.append({"item": {"name": describe(ev.get("item"), names), "type": ev["call"]}, "from": ctx["kind"], "stage": ctx.get("stage"), "script": ctx["script"], "function": ev["function"]})
        alias_made = [a for a in quests.get(qid, {}).get("aliases", {}).values() if a.get("creates")]
        rows[qid] = {"id": qid, "edid": q["edid"], "name": q["name"], "startedBy": started, "advancedBy": advanced[:20], "rewards": rewards, "alsoGives": also[:40], "unlocks": unlocks[:40],
                     "unresolvedRewards": unresolved, "aliasesCreate": [{"alias": a["name"], "item": names.get(a["creates"], {}).get("name") or a["creates"]} for a in alias_made]}
    return rows


def build_lines(lines, cur, by_edid, rows, quests, an, givers):
    """A verdict per curated line, on its opening quest."""
    out = []
    for line in lines:
        q = by_edid[line["opening"]]
        r = rows[q["id"]]
        qa = quests.get(q["id"], {})
        own_scripts = [s["name"] for s in (qa.get("vmad") or {}).get("scripts", [])]
        missing = [s for s in own_scripts if s in an.missing or s.lower() in {m.lower() for m in an.missing}]
        unreadable = [s for s in own_scripts if s.lower() in {m.lower() for m in an.unreadable}]
        # Aliases its opening text or first objective names, and the aliases its start and rewards go through.
        text = " ".join([log for st in q["stages"] for log in st.get("log", [])][:1] + [o["text"] for o in q["objectives"][:1]])
        named = {m.lower() for m in re.findall(r"<Alias(?:\.\w+)?=([^>]+)>", text, re.I)}
        runtime = sorted({a["name"] for a in qa.get("aliases", {}).values() if a["name"].lower() in named and a["fill"] in ("run time", "from event")})
        if any(s["by"] == "story manager" for s in r["startedBy"]):
            runtime += [a["name"] for a in qa.get("aliases", {}).values() if a["fill"] == "from event" and a["name"] not in runtime]
        if not r["startedBy"]:
            reason = "no starter in its records or scripts"
            if missing or unreadable:
                reason += "; scripts " + ", ".join(missing + unreadable) + (" missing" if missing and not unreadable else " missing or unreadable")
            verdict = ("unread", reason)
        elif r["unresolvedRewards"]:
            verdict = ("unread", "a reward is added from " + "; ".join(f"{u['script']}.{u['function']} ({u['unresolved']})" for u in r["unresolvedRewards"][:3]))
        elif runtime:
            verdict = ("random", "filled at run time: alias " + ", ".join(runtime))
        elif missing or unreadable:
            verdict = ("unread", "scripts " + ", ".join(missing + unreadable) + " missing or unreadable")
        else:
            verdict = ("traced", "")
        out.append({"line": line["id"], "name": line["name"], "category": line["category"], "opening": line["opening"], "quest": q["id"],
                    "verdict": verdict[0], "reason": verdict[1]})
    return out


def starter_text(s):
    if s["by"] == "dialogue":
        return f"dialogue{(' with ' + s['speaker']) if s.get('speaker') else ''} ({s['call']}{' ' + str(s['stage']) if s.get('stage') is not None else ''})"
    if s["by"] == "quest script":
        return f"{s['questName']}{(' stage ' + str(s['atStage'])) if s.get('atStage') is not None else ''} ({s['call']}{' ' + str(s['stage']) if s.get('stage') is not None else ''})"
    if s["by"] == "place":
        return f"{s.get('base') or 'a reference'} in {s.get('cell') or '?'} ({s['call']}{' ' + str(s['stage']) if s.get('stage') is not None else ''})"
    if s["by"] == "story manager":
        return f"story-manager event: {s.get('event') or '?'} ({s.get('node')})"
    return "start-game"


def reward_text(r):
    it = r["item"]
    if it.get("gold"):
        return f"{it['count']} gold" if isinstance(it.get("count"), int) else "gold (an amount the script works out)"
    tier = re.search(r"(Small|Medium|Large|Wow)", it["name"]) if it.get("rewardList") else None
    name = it["name"] + (f" (a {tier.group(1).lower()} reward list)" if tier else " (a reward list)" if it.get("rewardList") else "")
    if it.get("contains") and not it.get("rewardList"):
        name = ", ".join(it["contains"]) + f" (from {it['name']})"
    return name + (f" x{it['count']}" if isinstance(it.get("count"), int) and it["count"] != 1 else "")


KNOWN = {"MS13": "Gold", "MS10": "Gold", "MS01": "Gold", "DA09": "Dawnbreaker", "DA03": "The Masque of Clavicus Vile or the Rueful Axe", "C00": "none",
         "TG00": "Gold", "WTDragonHunt": "not known", "zzzAoMMq00": "not known", "NMeridia01": "not known", "GRVEMainQuest01": "not known",
         "InigoBadVibrations": "not known", "NecroQuest01": "not known", "EVGSirenrootQuest": "not known", "FOFRiftenBrawlerQuest": "not known"}


def write(base, rows, verdicts, an, names, current):
    with open(os.path.join(base, "quest_scripts_raw.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"quests": list(rows.values()), "lines": verdicts, "missingScripts": sorted(an.missing), "unreadableScripts": sorted(an.unreadable)},
                  f, indent=1, ensure_ascii=False)
        f.write("\n")
    rs = list(rows.values())
    by_edid = {r["edid"]: r for r in rs}
    vc = Counter(v["verdict"] for v in verdicts)
    starter_kinds = Counter(k for r in rs for k in {s["by"] for s in r["startedBy"]})
    md = ["# Quest scripts: what starts each quest, what it unlocks, and what it pays (WO-102)", "",
          "Written by `scripts/gamedata/quest_scripts.py` from the records and the winning compiled scripts (`pex.py`). Rewards are what "
          "`AddItem` gives the player on the stages (or the dialogue) that complete a quest.", "",
          "## Coverage", "", "| | |", "| --- | --- |",
          f"| kept quests | {len(rs)} |",
          f"| with a known starter | {sum(1 for r in rs if r['startedBy'])} |"]
    md += [f"| started by {k} | {n} |" for k, n in starter_kinds.most_common()]
    md += [f"| with a script reward | {sum(1 for r in rs if r['rewards'])} |",
           f"| lines | {len(verdicts)} |"] + [f"| lines {k} | {n} |" for k, n in vc.most_common()]
    md += ["", f"Scripts the quests use that aren't anywhere in the install: {len(an.missing)}. Scripts that couldn't be read: {len(an.unreadable)}."]
    if an.unreadable:
        md += ["", "Couldn't be read: " + ", ".join(sorted(an.unreadable)) + "."]
    md += ["", "## The 15 WO-98 samples", "", "| Quest | Started by | Rewards from scripts | Known reward (quest_givers_checks.md) |", "| --- | --- | --- | --- |"]
    for e, known in KNOWN.items():
        r = by_edid.get(e)
        if not r:
            md.append(f"| `{e}` | not kept | | {known} |")
            continue
        st = "; ".join(starter_text(s) for s in r["startedBy"][:4]) or "none found"
        rw = "; ".join(dict.fromkeys(reward_text(x) for x in r["rewards"])) or "none found"
        md.append(f"| {r['name']} (`{e}`) | {st} | {rw} | {known} |")
    g = by_edid.get("GRVEMainQuest01")
    if g:
        md += ["", "## Gravewind", "", "- Started by: " + ("; ".join(starter_text(s) for s in g["startedBy"]) or "none found"),
               "- Rewards: " + ("; ".join(reward_text(x) for x in g["rewards"]) or "none found"),
               "- Unlocks: " + ("; ".join(f"{u['call']} {u['what']}" + (f" in {u['cell']}" if u.get("cell") else "") for u in g["unlocks"][:8]) or "none found")]
    md += ["", "## Lines by verdict", ""]
    for kind in ("unread", "random", "traced"):
        vs = [v for v in verdicts if v["verdict"] == kind]
        md += [f"### {kind.capitalize()} ({len(vs)})", ""]
        md += [f"- **{v['name']}** (`{v['opening']}`)" + (f": {v['reason']}" if v["reason"] else "") for v in vs]
        md.append("")
    if current:
        md += ["## Where the scripts differ from quests.json", "",
               "Lines whose opening quest's rewards from scripts differ from the rewards quests.json shows now (its gold tiers and items).", ""]
        cur_by_id = {l["id"]: l for l in (current.get("lines") if isinstance(current, dict) else current)}
        diffs = []
        for v in verdicts:
            cl = cur_by_id.get(v["line"])
            r = by_edid.get(v["opening"])
            if not cl or not r:
                continue
            cq = next((x for x in cl.get("quests", []) if x.get("edid") == v["opening"]), {})
            cur_r = cq.get("rewards") or {}
            cur_items = sorted(cur_r.get("items", []))
            cur_gold = cur_r.get("gold")
            new_items = sorted({x["item"]["name"] for x in r["rewards"] if not x["item"].get("gold") and x["item"].get("type") in ("WEAP", "ARMO")})
            new_gold = any(x["item"].get("gold") or "reward" in (x["item"].get("name") or "").lower() for x in r["rewards"])
            if new_items != cur_items or bool(cur_gold) != new_gold:
                diffs.append(f"- **{v['name']}**: quests.json has " + (f"gold {cur_gold}" if cur_gold else "no gold") + (f", items {', '.join(cur_items)}" if cur_items else "")
                             + "; the scripts give " + ("; ".join(dict.fromkeys(reward_text(x) for x in r["rewards"])) or "nothing on completion") + ".")
        md += diffs or ["None."]
    md += ["", "## Scripts not in the install", "",
           f"{len(an.missing)} scripts the records name aren't in any loose folder or archive (mostly left behind by mods that "
           "removed or renamed them). Calls inside them can't be read.", "", ", ".join(sorted(an.missing)) or "None."]
    with open(os.path.join(base, "quest_scripts_report.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(md) + "\n")
    print(f"{len(rs)} quests: {sum(1 for r in rs if r['startedBy'])} with a starter, {sum(1 for r in rs if r['rewards'])} with a script reward; lines "
          + ", ".join(f"{k} {n}" for k, n in vc.most_common()))
    print("wrote quest_scripts_raw.json and quest_scripts_report.md in", os.path.relpath(base, REPO))


VERSION = "5.0.4.8"
if __name__ == "__main__":
    if len(sys.argv) > 1:
        VERSION = sys.argv[1]
    main()
