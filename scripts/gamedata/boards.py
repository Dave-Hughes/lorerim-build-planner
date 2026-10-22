"""
Notice boards and radiant dispatchers (WO-136): placed objects whose script starts quests. Writes
gamedata/<version>/story_checks/boards.json, which story_check.py reads as a start ("by: board"):
  python3 scripts/gamedata/boards.py [version]

An object starts a quest when its script (on the placed reference, or on the base object it's placed from) holds the
quest in a property, directly or through a form list, and calls Start or SetStage. Missives' notice boards are a
trigger box by each board with `_M_ActivatorScript`, whose QuestsLow/Med/High/VeryHigh form lists hold that hold's
jobs: walking up to the board starts some of them at random. A Vigilant bounty is an activator with
`AoMRQTriggerScript`, whose qR property is the bounty quest. For each quest: the object, its script, the call, and
every place a copy stands (its cell's name, and the nearest doors that lead somewhere named, as readables.py says
them). Only what the records hold: a script that picks a quest some other way isn't read, and isn't guessed.
"""
import json
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import ROOT, header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
import quest_scripts as qsc  # noqa: E402
from pex import Scripts, functions  # noqa: E402
from readables import near_doors, place_of  # noqa: E402
from story_check import name_strings  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
OBJECTS = ("ACTI", "CONT", "FURN", "DOOR", "MISC", "TACT", "FLOR")  # base objects whose script runs on every placed copy
DELETED = 0x20


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


def starts_quests(pex, quest_props, list_props):
    """
    The calls a script makes on a quest it holds: {"Start"} and/or {"SetStage"}. The call's target must be a property
    holding the quest (its autovar, ::<name>_var), or, when the script holds a form list of quests, a variable that isn't
    another property (the quest it took from the list: Missives' MissiveQuest). A Start on a scene property isn't one.
    """
    if not isinstance(pex, dict):
        return set()
    direct = {f"::{p}_var": p for p in quest_props}
    out = set()  # (call, the property it's made on: a quest property's name, or "list" for a quest taken from a form list)
    for _, f in functions(pex):
        for op, args in f["code"]:
            if op != "callmethod" or len(args) < 2 or str(args[0][1]).lower() not in ("start", "setstage"):
                continue
            target = str(args[1][1]).lower()
            call = "Start" if str(args[0][1]).lower() == "start" else "SetStage"
            if target in direct:
                out.add((call, direct[target]))
            elif list_props and not target.startswith("::") and target != "self":
                out.add((call, "list"))
    return out


def quests_in(props, flists, quests):
    """
    The quests a script's properties hold, directly or through a form list: (quests, the properties holding a quest, the
    properties holding a list of them, its stage property, its prerequisite stage). A prerequisite (defaultsetStageTrig's
    prereqStageOPT, -1 when unset) means the quest is already running.
    """
    out, direct, lists = {}, set(), set()  # out: quest -> the property holding it ("list" for a form list's)
    for k, v in props.items():
        if isinstance(v, dict) and v.get("form"):
            if v["form"] in quests:
                out[v["form"]] = k
                direct.add(k)
            held = [q for q in flists.get(v["form"], ()) if q in quests]
            if held:
                out.update({q: "list" for q in held})
                lists.add(k)
    # The stage it sets: an int property named for a stage (stage, myStage, StageToSet...), never the prerequisite.
    stage = next((v for k, v in props.items() if "stage" in k and "prereq" not in k and isinstance(v, int) and not isinstance(v, bool)), None)
    prereq = next((v for k, v in props.items() if "prereq" in k and isinstance(v, int) and not isinstance(v, bool) and v >= 0), None)
    return out, direct, lists, stage, prereq


def scan():
    pp, lo = plugin_paths(), load_order(cc=True)
    names, flists, quests, objects = {}, {}, set(), {}
    for n in lo:  # pass 1: names, form lists, quests, and base objects with scripts
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = name_strings(p, n, loc, ROOT) or {}
        for grp in ("QUST", "FLST", "LCTN", "WRLD") + OBJECTS:
            if grp.encode() not in buf:
                continue
            for o in iter_group(buf, grp):
                t, flags, fid, d = rec_data(buf, o)
                if t != grp:
                    continue
                key = form_id(resolve(fid, masters, n))
                subs = subrecs(d)
                edid = next((v.rstrip(b"\0").decode("latin1") for s, v in subs if s == "EDID"), "")
                full = next((strings.get(struct.unpack_from("<I", v)[0], "") if loc and len(v) == 4 else v.rstrip(b"\0").decode("utf-8", "replace")
                             for s, v in subs if s == "FULL"), "")
                names[key] = {"edid": edid, "name": full.strip(), "type": grp}
                if grp == "QUST":
                    quests.add(key)
                elif grp == "FLST":
                    flists[key] = [form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs if s == "LNAM" and len(v) >= 4]
                elif grp in OBJECTS:
                    vm = next((v for s, v in subs if s == "VMAD"), None)
                    if vm is not None:
                        try:
                            objects[key] = qsc.parse_vmad(vm, masters, n, grp)["scripts"]
                        except (struct.error, ValueError):
                            pass
                    else:
                        objects.pop(key, None)  # a later plugin took the script off
    scripts = Scripts(ROOT, lo)
    starters = {}  # base or ref -> [(script, quests, stage, calls)]

    def read(owner, scs):
        rows = []
        for sc in scs:
            qs, direct, lists, stage, prereq = quests_in(sc["props"], flists, quests)
            calls = starts_quests(scripts.get(sc["name"]), direct, lists) if qs else set()
            # Only the quests a call is made on: a script holding one quest to test and another to start starts the other.
            started = sorted(q for q, prop in qs.items() if any(c[1] == prop for c in calls))
            if started and prereq is None:
                rows.append((sc["name"], started, stage, sorted({c[0] for c in calls})))
        if rows:
            starters[owner] = rows
        else:
            starters.pop(owner, None)

    for k, scs in objects.items():
        read(k, scs)
    bases = {k for k in starters}
    placed, cells, doors = {}, {}, {}
    for n in lo:  # pass 2: references with such a script, or placed from such an object, and every door, with their cells
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = name_strings(p, n, loc, ROOT) or {}
        order = [m.lower() for m in masters] + [n.lower()]
        raws = {struct.pack("<I", (order.index(b.split(":")[0].lower()) << 24) | int(b.split(":")[1], 16)) for b in bases if b.split(":")[0].lower() in order}
        for top in ("CELL", "WRLD"):
            if top.encode() not in buf:
                continue
            cell = world = None
            for o in iter_group(buf, top):
                t = buf[o:o + 4]
                if t == b"REFR":
                    size = struct.unpack_from("<I", buf, o + 4)[0]
                    body = buf[o + 24:o + 24 + size]
                    if b"VMAD" not in body and b"XTEL" not in body and not any(r in body for r in raws):
                        continue
                elif t not in (b"CELL", b"WRLD"):
                    continue
                tt, flags, fid, d = rec_data(buf, o)
                subs = subrecs(d)
                key = form_id(resolve(fid, masters, n))
                if tt == "WRLD":
                    world = key
                    continue
                if tt == "CELL":
                    cell = key
                    c = cells.setdefault(key, {})
                    c["world"] = world if top == "WRLD" else None
                    for s, v in subs:
                        if s == "FULL":
                            c["name"] = (strings.get(struct.unpack_from("<I", v)[0], "") if loc and len(v) == 4 else v.rstrip(b"\0").decode("utf-8", "replace")).strip()
                        elif s == "XLCN" and len(v) >= 4:
                            c["location"] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, n))
                    continue
                base = next((form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs if s == "NAME" and len(v) >= 4), None)
                pos = next((list(struct.unpack_from("<fff", v)) for s, v in subs if s == "DATA" and len(v) >= 12), None)
                to = next((form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs if s == "XTEL" and len(v) >= 4), None)
                if to:
                    doors[key] = {"cell": cell, "pos": pos, "to": to}
                vm = next((v for s, v in subs if s == "VMAD"), None)
                own = None
                if vm is not None:
                    try:
                        own = qsc.parse_vmad(vm, masters, n, "REFR")["scripts"]
                    except (struct.error, ValueError):
                        own = None
                if own:
                    read(key, own)
                if key in starters or base in bases:
                    placed[key] = {"base": base, "cell": cell, "pos": pos, "deleted": bool(flags & DELETED), "plugin": n}
                else:
                    placed.pop(key, None)
    return names, cells, doors, starters, placed


def build():
    names, cells, doors, starters, placed = scan()
    out = {}
    for ref, r in placed.items():
        if r["deleted"]:
            continue
        rows = starters.get(ref) or starters.get(r["base"]) or []
        where = place_of(r["cell"], names, cells)
        near = near_doors(r, cells, doors, names)
        obj = names.get(r["base"], {})
        for script, qs, stage, calls in rows:
            # A script with a stage property sets that stage (a default trigger, even one that starts the quest first); one with
            # none that calls Start is a Start (Missives' board, whose SetStage 110 is a reset when the job is already taken).
            call = f"SetStage {stage}" if stage is not None and "SetStage" in calls else ("Start" if "Start" in calls else "SetStage")
            for q in qs:
                place = {"ref": ref, "where": where, **({"nearDoors": near} if near else {}), "plugin": r["plugin"]}
                row = out.setdefault(q, {}).setdefault(script, {"by": "board", "script": script, **({"object": obj["name"]} if obj.get("name") else {}),
                                                                "objectEdid": obj.get("edid"), "objectId": r["base"], "call": call, "places": [], "verdict": "script"})
                if place not in row["places"]:
                    row["places"].append(place)
    return {q: list(v.values()) for q, v in out.items()}


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    rows = build()
    path = os.path.join(REPO, "gamedata", version, "story_checks", "boards.json")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump({"about": __doc__.strip().splitlines()[0], "quests": rows}, f, indent=1, ensure_ascii=False, sort_keys=True)
        f.write("\n")
    scripts = {}
    for q, rs in rows.items():
        for r in rs:
            scripts[r["script"]] = scripts.get(r["script"], 0) + 1
    print(f"{len(rows)} quests started by a placed object's script -> story_checks/boards.json; by script: {sorted(scripts.items(), key=lambda kv: -kv[1])[:12]}")


if __name__ == "__main__":
    main()
