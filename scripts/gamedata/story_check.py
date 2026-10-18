"""
The start check for one story (WO-104): for every quest on a curated line, what starts it, where, what
it needs, and which values a settings loader or script changes at run time, each fact with its source
and a verdict. Reads only. Writes gamedata/<version>/story_checks/<line>.json and <line>.md:
  python3 scripts/gamedata/story_check.py <line id> [version]        e.g. main-quest

The quests are the line's in src/data/lorerim-<version>/quests.json (read, never written), in story order.

For each quest:
  started by  dialogue (the speaker, their placed cell, the line's conditions), another quest's script
              (which, at what stage, Start() or SetStage, read from the .pex), a story manager node (its
              event and every condition up its parents, globals resolved), or the start-game flag;
  where       the first objective, with who and where it points at (quest_givers_raw.json);
  needs       level, quests done and items from the quest's own conditions and its starters', and the
              doors and keys into the cells it uses (quest_starts.py's door check);
  run time    every global those read: its record value, and what an MCM Helper settings loader (the
              mod's MCM/Config/<mod>/settings.ini, overridden by MCM/Settings/<mod>.ini in a mod folder
              or overwrite, carried into the global by the mod's MCM script) or a script's SetValue makes it.
Then: every way a game begins (starts_raw.json, each start's quest read for what it does to the main
quest), the payoff on the stages that complete the last quests, and the WO's three questions.

Verdicts: files (a record decides it), script (a .pex decides it, read), run time (a settings loader or
script sets it at load), conflict (two sources disagree; both given), unread (named).
"""
import configparser
import json
import os
import re
import struct
import sys
from collections import Counter

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


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


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


# ---- settings loaders --------------------------------------------------------------------------

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


class StoryAnalyzer(qsc.Analyzer):
    """WO-102's analyzer, also recording SetValue on globals, shouts and words taught, and AddShout."""

    def event(self, fl, fn, target, rest, owner):
        if target and fl in SETTERS and target.get("type") == "GLOB" and rest:
            return {"call": "SetValue", "global": target["form"], "value": rest[0].get("int") if rest[0] else None}
        if target and fl == "addshout" and target.get("player"):
            return {"call": "AddShout", "item": rest[0] if rest else None}
        return super().event(fl, fn, target, rest, owner)

    def static_event(self, cls, fn, rest, owner):
        if cls == "game" and fn in ("teachword", "unlockword"):
            return {"call": "TeachWord" if fn == "teachword" else "UnlockWord", "item": rest[0] if rest else None}
        return None


# ---- the check -----------------------------------------------------------------------------------

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
        # A settings file says one thing, but the script that would load it isn't the one the game runs: the record stands.
        rec["value"] = rec.get("record")
        same = all(str(u["value"]).split(".")[0] == str(rec.get("record")).split(".")[0] for u in unread_settings)
        rec["verdict"] = "files" if same else "conflict"
    elif runtime and any(r["by"] == "settings loader" for r in runtime):
        rec["verdict"] = "run time"
        lv = next(r["value"] for r in runtime if r["by"] == "settings loader")
        rec["value"] = lv
    elif runtime:
        rec["verdict"] = "run time"
    else:
        rec["verdict"] = "files"
        rec["value"] = rec.get("record")
    if "value" not in rec:
        rec["value"] = rec.get("record")
    return rec


def needs_from(conds, names, globals_):
    """Level, quests done and items from a list of conditions, in words, each with the global it reads."""
    out = {"level": [], "quests": [], "items": [], "other": []}
    for c in conds:
        words = qst.describe_condition(c, names, {k: {"value": v.get("value")} for k, v in globals_.items()})
        row = {"text": words, **({"node": c["node"]} if c.get("node") else {})}
        g = c.get("global") or (c.get("param") if c["fn"] == "GetGlobalValue" else None)
        if g:
            row["global"] = g
        key = {"GetLevel": "level", "GetStageDone": "quests", "GetQuestCompleted": "quests", "GetStage": "quests", "GetItemCount": "items"}.get(c["fn"], "other")
        if row not in out[key]:
            out[key].append(row)
    return out


def main():
    from bsa import vanilla_strings
    from esp import ROOT, load_order, localized_strings, plugin_paths
    from pex import Scripts
    from quest_givers import place, where_text

    line_id = sys.argv[1] if len(sys.argv) > 1 else "main-quest"
    version = sys.argv[2] if len(sys.argv) > 2 else "5.0.4.8"
    base = os.path.join(REPO, "gamedata", version)
    load = lambda n: json.load(open(os.path.join(base, n), encoding="utf-8"))  # noqa: E731
    lines = json.load(open(os.path.join(REPO, "src", "data", f"lorerim-{version}", "quests.json"), encoding="utf-8"))["lines"]
    line = next(l for l in lines if l["id"] == line_id)
    raw = {q["edid"].lower(): q for q in load("quests_raw.json")["quests"]}
    givers = {r["id"]: r for r in load("quest_givers_raw.json")["quests"]}
    story = [raw[q["edid"].lower()] for q in line["quests"] if q["edid"].lower() in raw]
    missing_edids = [q["edid"] for q in line["quests"] if q["edid"].lower() not in raw]
    story_ids = {q["id"] for q in story}

    pp, lo = plugin_paths(), load_order()
    quests, infos, names, nodes = {}, {}, {}, {}
    qv, iv, gv = {}, {}, {}
    inventories, alias_items, script_targets = {}, {}, {}
    quest_plugin, info_plugin = {}, {}
    ref_plugins = []
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else None
        try:
            got = qsc.read_plugin(buf, n, strings)
            st = qst.read_plugin(buf, n, story_ids, strings)
            nodes.update(read_nodes(buf, n))
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
        if b"CELL" in buf or b"WRLD" in buf:
            ref_plugins.append((n, p, loc))
    print(f"read {len(quests)} quests, {len(infos)} scripted dialogue lines, {len(nodes)} story manager nodes", flush=True)

    scripts = Scripts(ROOT, lo)
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
    print(f"{len(events)} script calls read", flush=True)

    # Settings loaders: MCM Helper mods, and which global each setting lands in.
    mods = [l.strip()[1:] for l in open(os.path.join(ROOT, "profiles", "Ultra", "modlist.txt"), encoding="utf-8", errors="ignore") if l.startswith("+")]
    dirs = [os.path.join(ROOT, "mods", d) for d in mods]
    mcm = mcm_settings(dirs, os.path.join(ROOT, "overwrite"))
    loader_scripts = {}
    for modname, m in mcm.items():
        sd = os.path.join(ROOT, "mods", m["folder"], "scripts")
        if os.path.isdir(sd):
            for f in os.listdir(sd):
                if f.lower().endswith(".pex"):
                    loader_scripts[f[:-4].lower()] = modname
    loaders = {}
    loader_quests = {}
    from pex import read_pex
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
            # The loader's own copy, when another folder's copy wins: what it would carry that the winner doesn't.
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

    # Starters, rewards (WO-102's rules) for the story's quests.
    kept_rows = qsc.build_quests(story, quests, events, names, {q["id"]: {"starts": []} for q in story}, lambda r: None)

    # Speakers and key holders to place; doors into each quest's cells.
    speakers = {s.get("speakerId") for r in kept_rows.values() for s in r["startedBy"]}
    speakers = {infos[s["info"]]["speaker"] for r in kept_rows.values() for s in r["startedBy"] if s["by"] == "dialogue" and infos.get(s["info"], {}).get("speaker")}
    keys = {k for k, v in names.items() if v["type"] == "KEYM"}
    holders = {h for h, items in inventories.items() if any(i[0] in keys for i in items)} | speakers
    wanted = {t for ts in script_targets.values() for t in ts}
    dv, placed, cells, tied, wanted_cells = {}, {}, {}, {}, {}
    for n, p, loc in ref_plugins:
        buf = open(p, "rb").read()
        strings = (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else None
        try:
            doors, pl, ce, ti, wc = qst.read_refs(buf, n, keys, holders, strings, story_ids, wanted)
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
            d["cell"] = qst.real_cell(d["cell"], d.get("pos"), cells, grid)
    for p in placed.values():
        p["cell"] = qst.real_cell(p["cell"], p.get("pos"), cells, grid) or p["cell"]
    door_cell = {k: v[-1][1]["cell"] for k, v in dv.items()}
    cells_by_location = {}
    for cid, c in cells.items():
        if c.get("location"):
            cells_by_location.setdefault(c["location"], set()).add(cid)

    def doors_into(qid):
        versions = qv.get(qid, [])
        winner = versions[-1][1] if versions else {"aliases": []}
        use = set()
        for a in winner["aliases"]:
            if a.get("location"):
                use |= cells_by_location.get(a["location"], set())
        for p in givers.get(qid, {}).get("people", []):
            for w in p.get("where", []):
                if w.get("cell") and not cells.get(w["cell"], {}).get("persistent"):
                    use.add(w["cell"])
        use |= {qst.real_cell(c, pos, cells, grid) for _, c, pos in tied.get(qid, [])}
        use.discard(None)
        out = []
        for did, vd in dv.items():
            d = vd[-1][1]
            into = door_cell.get(d["to"])
            if d["deleted"] or into is None or into == d["cell"] or not d["lock"]:
                continue
            outdoors = cells.get(d["cell"], {}).get("world") is not None
            if not ((into in use and d["cell"] not in use) or (d["cell"] in use and outdoors and cells.get(into, {}).get("world") is None)):
                continue
            # A door that needs a key, or whose lock a later plugin added or changed (WO-101); an ordinary locked house door isn't a need.
            whats = {c[2]["what"] for c in qst.door_changes(vd)}
            if not (d["lock"]["level"] == 255 or whats & {"key", "locked"}):
                continue
            target = cells.get(into, {})
            iname = target.get("name") or names.get(target.get("location"), {}).get("name")
            carry = qst.carriers(d["lock"]["key"], inventories, list(alias_items.values()), placed, cells, names) if d["lock"].get("key") else []
            out.append({"door": did, "into": iname, "lock": d["lock"], "plain": qst.plain_lock(d, iname, names, carry), "plugin": vd[-1][0],
                        "changedBy": sorted({c[0] for c in qst.door_changes(vd) if c[2]["what"] != "minor"})})
        return out

    def speaker_place(npc):
        rows = place(npc, placed, cells, names)
        return [where_text(r) for r in rows if where_text(r)]

    def info_conditions(iid):
        vs = iv.get(iid)
        if vs:
            return vs[-1][1]["conditions"]
        return []

    # Globals any of it reads.
    report_quests = []
    all_globals = {}
    for q in story:
        qid = q["id"]
        r = kept_rows[qid]
        versions = qv.get(qid, [])
        winner = versions[-1][1] if versions else {"dialogue": [], "event": [], "flags": 0}
        starts = []
        for s in r["startedBy"]:
            if s["by"] == "dialogue":
                info = infos.get(s["info"], {})
                conds = info_conditions(s["info"])
                fr = next((f for f in info.get("vmad", {}).get("fragments", [])), {})
                starts.append({"by": "dialogue", "speaker": s.get("speaker"), "speakerPlaced": speaker_place(info.get("speaker")) if info.get("speaker") else [],
                               "call": s["call"], "stage": s.get("stage"), "conditions": conds,
                               "source": f"{fr.get('script', '?')}.{fr.get('function', '?')} on INFO {s['info']} ({info_plugin.get(s['info'], '?')})", "verdict": "script"})
            elif s["by"] == "quest script":
                qn = names.get(s["quest"], {})
                label = qn.get("edid") or s["quest"]
                if qn.get("name") and qn["name"] != qn.get("edid"):
                    label += f" ({qn['name']})"
                starts.append({"by": "quest script", "quest": label, "questId": s["quest"], "atStage": s.get("atStage"), "call": s["call"],
                               "stage": s.get("stage"), "source": f"{s['script']} on {s['quest']} ({quest_plugin.get(s['quest'], '?')})", "verdict": "script"})
        for ns in node_starts(qid, nodes):
            starts.append({"by": "story manager", "event": ns["event"], "node": ns["node"], "conditions": ns["conditions"], "parents": ns["parents"],
                           "source": f"{ns['node']} {ns['id']} ({ns['plugin']})", "verdict": "files"})
        if winner["flags"] & qst.START_GAME:
            starts.append({"by": "start game", "source": f"{qid} DNAM ({versions[-1][0] if versions else '?'})", "verdict": "files"})
        conds = winner["dialogue"] + winner["event"]
        for s in starts:
            conds += s.get("conditions", []) if s["by"] in ("story manager",) else []
        gl = {c.get("global") for s in starts for c in s.get("conditions", []) if c.get("global")} | {c.get("global") for c in conds if c.get("global")}
        gl |= {c["param"] for s in starts for c in s.get("conditions", []) if c["fn"] == "GetGlobalValue"} | {c["param"] for c in conds if c["fn"] == "GetGlobalValue"}
        gl.discard(None)
        facts = {g: global_fact(g, gv, loaders, setters, names) for g in sorted(gl)}
        all_globals.update(facts)
        for s in starts:
            if any((c.get("global") or (c["param"] if c["fn"] == "GetGlobalValue" else None)) in facts and facts[c.get("global") or c["param"]]["verdict"] in ("run time", "conflict")
                   for c in s.get("conditions", [])):
                s["verdict"] = "run time" if s["verdict"] == "files" else s["verdict"]
            if s.get("conditions"):
                s["conditionText"] = [qst.describe_condition(c, names, {k: {"value": v["value"]} for k, v in facts.items()}) for c in s["conditions"]]
        g = givers.get(qid, {})
        fo = g.get("firstObjective") or {}
        ng = g.get("namedGiver") or {}
        needs = needs_from(conds, names, facts)
        doors = doors_into(qid)
        row = {"id": qid, "edid": q["edid"], "name": q["name"], "plugin": versions[-1][0] if versions else quest_plugin.get(qid),
               "startedBy": starts, "advancedBy": r.get("advancedBy", []),
               "firstObjective": {"text": fo.get("filled") or fo.get("text"), "source": f"{qid} QOBJ", "verdict": "files"} if fo else None,
               "who": ({"name": ng.get("name"), "where": [where_text(w) for w in ng.get("where", []) if where_text(w)], "how": ng.get("how")}
                       if ng and (ng.get("name") or "").lower() not in ROLES else None),
               "needs": needs, "doors": doors, "globals": list(facts.values()), "rewards": r["rewards"], "unlocks": r["unlocks"]}
        if not starts:
            own = [s["name"] for s in (quests.get(qid, {}).get("vmad") or {}).get("scripts", [])]
            miss = [s for s in own if s in an.missing]
            row["unread"] = "no starter in its records or scripts" + (f"; scripts {', '.join(miss)} aren't in the install" if miss else "")
        report_quests.append(row)

    # Every way a game begins.
    starts_raw = load("starts_raw.json")["starts"]
    by_edid = {v["edid"].lower(): k for k, v in names.items() if v["type"] == "QUST"}
    mq101 = by_edid.get("mq101")
    mq_ids = {by_edid.get(e) for e in ("mq101", "mq102", "mq102a", "mq102b", "mq103", "mq104", "mq105")} - {None}
    mq_stages = {q["id"]: {s["index"] for s in q["stages"] if s.get("completes")} for q in story}
    mq101_flag = bool(qv.get(mq101, [[None, {"flags": 0}]])[-1][1]["flags"] & qst.START_GAME) if mq101 else None
    start_quest_ids = set()
    start_rows = []
    for s in starts_raw:
        ids = [s["id"]] if s.get("id") else [o["id"] for o in s["options"] if o["id"] not in ("0", 0, None)]
        opts = []
        for oid in ids:
            num = oid if isinstance(oid, int) else int(oid, 16) if str(oid).lower().startswith("0x") else int(oid)
            fid = f"{s['plugin']}:{num & 0xFFFFFF:06X}"
            start_quest_ids.add(fid)
            evs = [(c, e) for c, e in events if c.get("quest") == fid and e["call"] in ("SetStage", "Start") and e.get("quest") in mq_ids]
            moves = [f"{names.get(e['quest'], {}).get('edid')} {e['call']}{(' ' + str(e['stage'])) if e.get('stage') is not None else ''}" for _, e in evs]
            mq101_set = [e.get("stage") for _, e in evs if e.get("quest") == mq101 and e["call"] == "SetStage"]
            done = mq_stages.get(mq101, {1000})
            if mq101_set and min(mq101_set) < min(done):
                runs = f"yes, from stage {min(mq101_set)}"
            elif mq101_set:
                runs = f"no: its script sets MQ101 to {max(mq101_set)} (done)"
            elif mq101_flag:
                runs = "yes: MQ101 is start-game enabled"
            else:
                runs = "no"
            label = next((o["name"] for o in s["options"] if o["id"] == oid), s["name"])
            opts.append({"option": label, "quest": fid, "questEdid": names.get(fid, {}).get("edid"), "mainQuestRuns": runs, "moves": list(dict.fromkeys(moves)),
                         "source": f"{names.get(fid, {}).get('edid')} scripts ({quest_plugin.get(fid, '?')})" if fid in quests else f"{fid} isn't a quest in the records"})
        start_rows.append({"start": s["name"], "from": s["from"], "options": opts})
    later = []
    for target in sorted(mq_ids, key=lambda x: names.get(x, {}).get("edid", "")):
        for c, e in events:
            if e.get("quest") != target or e["call"] not in ("SetStage", "Start"):
                continue
            src_q = c.get("quest")
            if src_q in start_quest_ids or src_q in mq_ids:
                continue
            stage_bound = min((s["index"] for s in raw.get(names.get(target, {}).get("edid", "").lower(), {}).get("stages", []) if s.get("log")), default=10)
            if e["call"] == "SetStage" and e.get("stage", 0) > stage_bound:
                continue
            who = (f"dialogue with {names.get(infos[c['info']]['speaker'], {}).get('name')}" if c["kind"] == "dialogue" and infos.get(c["info"], {}).get("speaker")
                   else f"{names.get(src_q, {}).get('edid') or src_q}" + (f" stage {c['stage']}" if c.get("stage") is not None else ""))
            later.append({"quest": names.get(target, {}).get("edid"), "by": who, "call": e["call"], "stage": e.get("stage"), "script": c["script"],
                          "plugin": quest_plugin.get(src_q) if c["kind"] != "dialogue" else info_plugin.get(c["info"])})
    for target in sorted(mq_ids, key=lambda x: names.get(x, {}).get("edid", "")):
        for ns in node_starts(target, nodes):
            later.append({"quest": names.get(target, {}).get("edid"), "by": f"story manager {ns['node']} ({ns['event']})", "call": "node", "stage": None,
                          "script": None, "plugin": ns["plugin"],
                          "conditions": [qst.describe_condition(c, names, {g: {"value": global_fact(g, gv, loaders, setters, names)["value"]}
                                                                            for g in [c.get("global") or (c["param"] if c["fn"] == "GetGlobalValue" else None)] if g}) for c in ns["conditions"]]})
    # APS skip quests and the like: who starts the quests that move the main quest for a start that skips it.
    movers = sorted({c.get("quest") for c, e in events if e.get("quest") in mq_ids and c.get("quest") and c.get("quest") not in mq_ids and c.get("quest") not in start_quest_ids})
    mover_rows = []
    for m in movers:
        st = [x for x in qsc.build_quests([{"id": m, "edid": names.get(m, {}).get("edid", m), "name": names.get(m, {}).get("name", ""), "stages": [], "objectives": []}],
                                          quests, events, names, {m: {"starts": []}}, lambda r: None)[m]["startedBy"]]
        row = {"quest": names.get(m, {}).get("edid") or m, "id": m, "plugin": quest_plugin.get(m), "startedBy": [qsc.starter_text(x) for x in st[:5]],
               "nodes": [f"{ns['node']} ({ns['event']})" for ns in node_starts(m, nodes)], "startGame": bool(quests.get(m, {}).get("flags", 0) & qst.START_GAME)}
        # And what starts the quests that start it (APS_MQSkipMQ105 starts the Hadvar and Ralof skips).
        deeper = []
        for x in st[:5]:
            if x["by"] == "quest script" and x["quest"] not in mq_ids:
                up = qsc.build_quests([{"id": x["quest"], "edid": names.get(x["quest"], {}).get("edid", ""), "name": "", "stages": [], "objectives": []}],
                                      quests, events, names, {x["quest"]: {"starts": []}}, lambda r: None)[x["quest"]]["startedBy"]
                deeper.append({"quest": names.get(x["quest"], {}).get("edid") or x["quest"], "startedBy": [qsc.starter_text(u) for u in up[:5]],
                               "nodes": [f"{ns['node']} ({ns['event']})" for ns in node_starts(x["quest"], nodes)],
                               "startGame": bool(quests.get(x["quest"], {}).get("flags", 0) & qst.START_GAME)})
        row["startedByStartedBy"] = deeper
        mover_rows.append(row)
    start_game_mq = [names.get(q, {}).get("edid") for q in sorted(mq_ids) if quests.get(q, {}).get("flags", 0) & qst.START_GAME]

    # The payoff: what the stages that complete the last quests give.
    payoff = []
    for e in ("mq305", "mqpaarthurnax"):
        q = raw.get(e)
        if not q:
            continue
        completing = {s["index"] for s in q["stages"] if s.get("completes")}
        gives = []
        for c, ev in events:
            if c.get("quest") == q["id"] and c["kind"] == "quest" and c.get("stage") in completing and ev["call"].lower() in ("additem", "addspell", "addperk", "addshout", "teachword", "unlockword"):
                gives.append({"call": ev["call"], "what": qsc.describe(ev.get("item"), names), "count": ev.get("count"), "stage": c["stage"], "source": f"{c['script']}.{ev['function']}"})
        payoff.append({"quest": q["name"], "edid": q["edid"], "completingStages": sorted(completing), "gives": gives})

    # The three questions.
    mq105 = raw.get("mq105")
    q1 = {"question": "Is Skyrim.esm:0242BA MQ105, and is stage 160 the one that completes it?",
          "edid": names.get("Skyrim.esm:0242BA", {}).get("edid"), "name": names.get("Skyrim.esm:0242BA", {}).get("name"),
          "completingStages": sorted(s["index"] for s in mq105["stages"] if s.get("completes")) if mq105 else None}
    q1["answer"] = (f"Yes: Skyrim.esm:0242BA is {q1['edid']} ({q1['name']}), and stage 160 is its only completing stage." if q1["edid"] == "MQ105" and q1["completingStages"] == [160]
                    else f"Skyrim.esm:0242BA is {q1['edid']} ({q1['name']}); its completing stages are {q1['completingStages']}.")
    horn = next((r for r in report_quests if r["edid"].lower() == "mq105ustengrav"), None)
    q2 = {"question": "Who starts The Horn of Jurgen Windcaller, and where?", "quest": horn and f"{horn['name']} ({horn['edid']}, {horn['id']})",
          "startedBy": horn["startedBy"] if horn else [], "who": horn and horn["who"], "firstObjective": horn and horn["firstObjective"],
          "giver": horn and (givers.get(horn["id"], {}).get("namedGiver") or {})}
    dlc2 = by_edid.get("dlc2cultistambush")
    q3_nodes = node_starts(dlc2, nodes) if dlc2 else []
    tie_level = setting_value(mcm["TimingIsEverything"], "iTIE_MinimumLevel:Dragonborn") if "TimingIsEverything" in mcm else (None, None)
    q3 = {"question": "Does Dragonborn's cultist node read Timing is Everything's level (25 in its settings.ini), or something else?",
          "quest": (names.get(dlc2, {}).get("edid") + f" ({dlc2})") if dlc2 else None, "nodes": [], "tieSetting": {"key": "iTIE_MinimumLevel:Dragonborn", "value": tie_level[0], "from": tie_level[1]}}
    for ns in q3_nodes:
        reads = []
        for c in ns["conditions"]:
            if c["fn"] == "GetLevel":
                g = c.get("global")
                fact = global_fact(g, gv, loaders, setters, names) if g else None
                reads.append({"node": c.get("node"), "cmp": c["cmp"], "value": c.get("value"), "global": g, "fact": fact})
        gvals, gfacts = {}, []
        for c in ns["conditions"]:
            g = c.get("global") or (c["param"] if c["fn"] == "GetGlobalValue" else None)
            if g and g not in gvals:
                f = global_fact(g, gv, loaders, setters, names)
                gvals[g] = {"value": f["value"]}
                gfacts.append(f)
        q3["nodes"].append({"node": ns["node"], "id": ns["id"], "plugin": ns["plugin"], "event": ns["event"], "levelConditions": reads, "globals": gfacts,
                            "conditions": [qst.describe_condition(c, names, gvals) for c in ns["conditions"]]})
    wt_global = next((k for k, v in names.items() if v["type"] == "GLOB" and v["edid"].lower() == "wtstartlevel"), None)
    wyrm = {"loaderInstalled": "Wyrmstooth" in mcm, "loaderFolder": mcm.get("Wyrmstooth", {}).get("folder"), "global": wt_global,
            "fact": global_fact(wt_global, gv, loaders, setters, names) if wt_global else None,
            "loaderQuest": loader_quests.get("Wyrmstooth")}
    tie = {"loaderInstalled": "TimingIsEverything" in mcm, "loaderFolder": mcm.get("TimingIsEverything", {}).get("folder"),
           "script": loader_quests.get("TimingIsEverything"),
           "dragonbornLevel": {"key": "iTIE_MinimumLevel:Dragonborn", "value": tie_level[0], "from": tie_level[1],
                               "globals": [dict(global_fact(g, gv, loaders, setters, names), **{"global": g}) for g, rows in loaders.items()
                                           if any(r["key"] == "iTIE_MinimumLevel:Dragonborn" for r in rows)]}}

    touched = {r["mod"] for g in all_globals for r in loaders.get(g, [])}
    for g in [x.get("global") for x in tie["dragonbornLevel"]["globals"]] + [wt_global]:
        touched |= {r["mod"] for r in loaders.get(g, [])}
    shown = {m: v for m, v in loader_quests.items() if m in touched or m in ("TimingIsEverything", "Wyrmstooth")}
    out = {"line": line_id, "name": line["name"], "quests": report_quests, "notInRawQuests": missing_edids, "starts": start_rows, "mainQuestLater": later,
           "startGameMainQuest": start_game_mq, "loaders": shown,
           "mainQuestMovers": mover_rows, "payoff": payoff, "questions": [q1, q2, q3], "timingIsEverything": tie, "wyrmstooth": wyrm,
           "missingScripts": sorted(an.missing)}
    d = os.path.join(base, "story_checks")
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, f"{line_id}.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
        f.write("\n")
    with open(os.path.join(d, f"{line_id}.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write(markdown(out))
    c = Counter("unread" if r.get("unread") else "started" for r in report_quests)
    print(f"{line_id}: {len(report_quests)} quests ({dict(c)}), {sum(len(s['options']) for s in start_rows)} start options -> story_checks/{line_id}.md")


def starter_line(s):
    if s["by"] == "dialogue":
        where = f", placed in {'; '.join(s['speakerPlaced'][:2])}" if s.get("speakerPlaced") else ""
        when = f" (needs: {'; '.join(s['conditionText'])})" if s.get("conditionText") else ""
        return f"Dialogue with {s.get('speaker') or 'someone the line does not name'}{where}: {s['call']}{' ' + str(s['stage']) if s.get('stage') is not None else ''}{when}"
    if s["by"] == "quest script":
        return f"{s['quest']}{(' at stage ' + str(s['atStage'])) if s.get('atStage') is not None else ''} calls {s['call']}{' ' + str(s['stage']) if s.get('stage') is not None else ''}"
    if s["by"] == "story manager":
        conds = "; ".join(s.get("conditionText", [])) or "no conditions"
        return f"Story manager node {s['node']}, event: {s['event'] or 'none'}; conditions up its parents: {conds}"
    return "Start-game flag: the quest runs from the start of the game"


def markdown(out):
    md = [f"# Start check: {out['name']} (`{out['line']}`)", "",
          "Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. "
          "Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; "
          "**conflict** two sources disagree; **unread** named.", ""]
    if out["notInRawQuests"]:
        md += [f"Not in the crawl (no journal text): {', '.join(out['notInRawQuests'])}.", ""]
    for i, q in enumerate(out["quests"], 1):
        md += [f"## {i}. {q['name']} (`{q['edid']}`, {q['id']}, {q['plugin']})", ""]
        md.append("**Started by**")
        md.append("")
        if q.get("unread"):
            md.append(f"- **unread**: {q['unread']}")
        for s in q["startedBy"][:8]:
            md.append(f"- {starter_line(s)}. Source: {s['source']}. **{s['verdict']}**")
        if len(q["startedBy"]) > 8:
            md.append(f"- and {len(q['startedBy']) - 8} more in the JSON")
        md.append("")
        md.append("**Where**")
        md.append("")
        if q.get("firstObjective") and q["firstObjective"]["text"]:
            md.append(f"- First objective: \"{q['firstObjective']['text']}\". Source: {q['firstObjective']['source']}. **files**")
        if q.get("who") and q["who"].get("name"):
            md.append(f"- Who: {q['who']['name']} ({'named in its opening' if q['who'].get('how') == 'named' else 'its first speaker'})"
                      + (f", placed in {'; '.join(q['who']['where'][:2])}" if q["who"].get("where") else ", never placed (a script moves or spawns them)") + ". **files**")
        md.append("")
        md.append("**Needs**")
        md.append("")
        n = q["needs"]
        any_need = False
        for k, label in (("level", "Level"), ("quests", "Quests"), ("items", "Items"), ("other", "Other conditions")):
            if n[k]:
                any_need = True
                md.append(f"- {label}: " + "; ".join(x["text"] for x in n[k]) + ". Source: the quest's own conditions. **files**")
        for d in q["doors"]:
            any_need = True
            md.append(f"- Door: {d['plain']} Source: {d['door']} ({d['plugin']}). **files**")
        if not any_need:
            md.append("- Nothing in its own conditions or doors.")
        for g in q["globals"]:
            rt = "; ".join(f"{r['by']} {r.get('mod') or r.get('script')}: {r.get('key', '')} = {r['value']}" + (f" ({r['from']})" if r.get("from") else "") for r in g["runtime"])
            md.append(f"- Global {g['edid']}: record {g.get('record')} ({g.get('recordFrom')})" + (f"; at run time {rt}" if rt else "") + f". **{g['verdict']}**")
        md.append("")
        if q["rewards"]:
            md.append("**Gives**: " + "; ".join(dict.fromkeys(qsc.reward_text(x) for x in q["rewards"])) + ". **script**")
            md.append("")
    md += ["## Every way a game begins", "", f"MQ101's start-game flag: see each quest above. Each start's option is a quest; what its scripts do to the main quest:", "",
           "| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves |", "| --- | --- | --- | --- | --- |"]
    for s in out["starts"]:
        for o in s["options"]:
            md.append(f"| {s['start']} | {o['option']} | {o['questEdid'] or o['quest']} | {o['mainQuestRuns']} | {'; '.join(o['moves']) or 'nothing in the main quest'} |")
    md += ["", "**When MQ101 doesn't run, what starts the main quest later** (calls on MQ101 to MQ105 from outside the starts and the main quest itself):", ""]
    seen = set()
    for l in out["mainQuestLater"]:
        key = (l["quest"], l["by"], l["call"], l["stage"])
        if key in seen:
            continue
        seen.add(key)
        md.append(f"- {l['quest']}: {l['by']} ({l['call']}{' ' + str(l['stage']) if l['stage'] is not None else ''})" + (f", {l['script']}" if l.get("script") else "")
                  + (f", {l['plugin']}" if l.get("plugin") else "") + (f"; conditions: {'; '.join(l['conditions'])}" if l.get("conditions") else ""))
    md += ["", f"Main-quest quests with the start-game flag (running from the first moment, whatever the start): {', '.join(out['startGameMainQuest']) or 'none'}. **files**", ""]
    md += ["Quests outside the main quest that move it, and what starts them:", ""]
    for m in out["mainQuestMovers"]:
        md.append(f"- {m['quest']} ({m['plugin']}): " + ("; ".join(dict.fromkeys(m["startedBy"] + m["nodes"] + (["start-game"] if m.get("startGame") else []))) or "no starter found in its records or scripts"))
        for d in m.get("startedByStartedBy", []):
            md.append(f"  - {d['quest']} is started by: " + ("; ".join(dict.fromkeys(d["startedBy"] + d["nodes"] + (["start-game"] if d.get("startGame") else []))) or "no starter found in its records or scripts (**unread**)"))
    md += ["", "## The payoff", ""]
    for p in out["payoff"]:
        md.append(f"- **{p['quest']}** (completes at {', '.join(map(str, p['completingStages']))}): "
                  + ("; ".join(f"{g['call']} {g['what']}" + (f" x{g['count']}" if g.get("count") not in (None, 1) else "") + f" ({g['source']}, stage {g['stage']})" for g in p["gives"])
                     or "nothing is given on its completing stages") + ".")
    md += ["", "## Three questions", ""]
    q1, q2, q3 = out["questions"]
    md += [f"**{q1['question']}** {q1['answer']}", ""]
    md.append(f"**{q2['question']}** {q2['quest']}:")
    for s in q2["startedBy"][:6]:
        md.append(f"- {starter_line(s)}. Source: {s['source']}.")
    if q2.get("firstObjective") and q2["firstObjective"].get("text"):
        md.append(f"- Its first objective: \"{q2['firstObjective']['text']}\".")
    if q2.get("who") and q2["who"].get("name"):
        md.append(f"- Named in its opening: {q2['who']['name']}" + (f", placed in {'; '.join(q2['who']['where'][:2])}" if q2["who"].get("where") else ""))
    md += ["", f"**{q3['question']}** Timing is Everything's setting {q3['tieSetting']['key']} = {q3['tieSetting']['value']} ({q3['tieSetting']['from']}).", ""]
    def level_text(c):
        if not c.get("fact"):
            return f"level {c['cmp']} {c['value']} (a number in the record; **files**)"
        f = c["fact"]
        rt = ", ".join(f"{r.get('mod') or r.get('script')} {r.get('key', '')} = {r['value']}" for r in f["runtime"]) or "nothing sets it"
        return f"level {c['cmp']} global {f['edid']} (record {f.get('record')}, at run time {rt}; **{f['verdict']}**)"

    for n in q3["nodes"]:
        md.append(f"- Node {n['node']} ({n['plugin']}), event {n['event']}: " + ("; ".join(level_text(c) for c in n["levelConditions"]) or "no level condition")
                  + ". All its conditions: " + ("; ".join(n["conditions"]) or "none") + ".")
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
                  + ("it reads its MCM Helper settings on load and sets globals from them." if info["readsSettings"]
                     else "it carries no settings.ini value into a global, so the globals keep their record values unless the player changes them in the menu."))
    md.append("")
    md += [
           f"- Timing is Everything settings loader: {'installed (' + tie['loaderFolder'] + ')' if tie['loaderInstalled'] else 'not installed'}; Dragonborn level setting "
           f"{tie['dragonbornLevel']['value']} ({tie['dragonbornLevel']['from']}), meant for "
           + (", ".join(f"{g['edid']} (record {g.get('record')} from {g.get('recordFrom')}; in game {g['value']}"
                        + ("; " + "; ".join(u["why"] for u in g.get("settingsNotRead", [])) if g.get("settingsNotRead") else "") + f"; **{g['verdict']}**)"
                        for g in tie["dragonbornLevel"]["globals"]) or "no global the reader could follow") + ".",
           f"- Wyrmstooth settings loader: {'installed (' + wy['loaderFolder'] + ')' if wy['loaderInstalled'] else 'not installed'}. WTStartLevel: "
           + (f"record {wy['fact'].get('record')} ({wy['fact'].get('recordFrom')}), in game {wy['fact']['value']}" + (" (" + "; ".join(f"{r.get('mod') or r.get('script')} {r.get('key', '')} = {r['value']}" for r in wy['fact']['runtime']) + ")" if wy['fact']['runtime'] else "") + f", **{wy['fact']['verdict']}**" if wy["fact"] else "no WTStartLevel global in the records") + "."]
    if out["missingScripts"]:
        md += ["", f"Scripts the records name that aren't in the install ({len(out['missingScripts'])}); calls inside them can't be read. Full list in the JSON."]
    return "\n".join(md) + "\n"


if __name__ == "__main__":
    main()
