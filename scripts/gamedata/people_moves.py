"""
WO-185 Part 4: where a quest moves a person to, from the records.

A person's AI packages (people_schedules_raw.json) say where they are; some of them hold only while a quest is at a stage (a GetStage condition on the
quest). When such a package puts the person in a named place, a player can act on it: "After The Ritual: Fort Justice", "During Infiltration: Meridia's
Sanctum". Everything else is left out: a package that follows you, waits for you, or stands the person at a spot with no name of its own ("around a spot
by Riften"); a package with any condition besides the quest's stage; a window that opens before the quest and says nothing of where it ends.

  python3 -c "import people_moves"   (build.py calls moves_of)
"""
import re

# The conditions that only ask where a quest is. Anything else on a package (a time of day, a faction, a global, who is speaking) makes it not a quest's move.
STAGE_FNS = ("GetStage", "GetStageDone", "GetQuestCompleted")
INF = 10 ** 6
# The masters the game ships: a package one of these made is the game's.
VANILLA = {"skyrim.esm", "update.esm", "dawnguard.esm", "hearthfires.esm", "dragonborn.esm"}


def window(conds):
    """
    (quest id, low, high) from a package's conditions: the stages at which it holds, `low <= stage < high`, or None when the conditions are not all about
    one quest's stage, or an OR joins them. A quest done (GetQuestCompleted == 1) is `low` = INF ("after it, whatever its stages").
    """
    quest, lo, hi = None, 0, INF
    for c in conds or []:
        if c.get("or") or c.get("fn") not in STAGE_FNS or not c.get("param"):
            return None
        if quest not in (None, c["param"]):
            return None
        quest = c["param"]
        v, op = c.get("value"), c.get("cmp")
        if v is None:
            return None
        if c["fn"] == "GetQuestCompleted":
            if op in ("==", ">=") and v >= 1 or op == ">" and v == 0:
                lo = INF
            else:
                return None  # "not yet done" is the quest's before, which the day already is
        elif c["fn"] == "GetStageDone":
            # (the stage asked about is the condition's own `stage`; the value says done or not)
            stage = c.get("stage") or 0
            if op == "==" and v >= 1 and stage:
                lo = max(lo, stage)
            elif op == "==" and v == 0 and stage:
                hi = min(hi, stage)
            else:
                return None
        elif op == ">=":
            lo = max(lo, v)
        elif op == ">":
            lo = max(lo, v + 1)
        elif op == "==":
            lo, hi = max(lo, v), min(hi, v + 1)
        elif op == "<":
            hi = min(hi, v)
        elif op == "<=":
            hi = min(hi, v + 1)
        else:
            return None
    return (quest, lo, hi) if quest else None


def named_place(loc, places):
    """The place a package puts the person in, by a name the place pages have: the place the cell is part of, else the cell. None for a spot with no name."""
    if not loc or not loc.get("target"):
        return None
    for name in (loc.get("place"), loc.get("cell")):
        if name and name.lower() in places:
            return places[name.lower()]
    return None


def moves_of(dump, quests, places, quest_names, drop=None, differ=None):
    """
    {record id: [{"when": "after" | "during", "quest": <name>, "place": <name>, "maybeLoreRim"?: true}]} for every person a quest's stage moves to a named place, in the
    order the quest goes (and the place named after the quest it comes from). `quests` is quests_raw's list, `places` {lower-case name: name} of the place pages and
    `quest_names` the names of the quests that have a page (a move for one that doesn't would link nowhere). `drop` is {person's name: [quest names]}: a package that is their
    own home or bed and no move (WO-185 Part 6a: Delphine's inn, Ancano's bed). `differ` is {person's name: [quest names]}: moves the records show and UESP
    contradicts, kept and marked `maybeLoreRim`; so is any move a mod's own package makes for a person the game made.
    """
    by_id = {q["id"]: q for q in quests}
    out = {}
    for pid, d in (dump or {}).items():
        rows = {}
        for pk in d.get("packages") or []:
            w = window(pk.get("conditions"))
            place = named_place(pk.get("location"), places)
            q = by_id.get(w[0]) if w else None
            if not w or not place or not q or q.get("name") not in quest_names or q.get("name") in (drop or {}).get(d.get("name"), []):
                continue
            _, lo, hi = w
            stages = [s["index"] for s in q.get("stages", [])]
            # (a quest with no completing stage ends at its last: Kolskeggr Mine's 100)
            finish = min((s["index"] for s in q.get("stages", []) if s.get("completes")), default=max(stages, default=None))
            # A window still open when the quest ends is After; one that opens and shuts before it ends is During (WO-185 Part 6a: Pavo Attius, Drovas Relvi, Babette).
            if lo >= INF or (finish is not None and (lo >= finish or hi > finish)):
                when = "after"
            elif hi < INF and lo > 0:
                when = "during"
            else:
                continue
            plugin = (pk.get("plugin") or "").lower()
            ours = plugin in VANILLA or plugin.startswith(("cc", "unofficial"))  # (the game's, its Creation Club's, and the Unofficial patches that mend them)
            maybe = (pid.split(":")[0].lower() in VANILLA and not ours) or q["name"] in (differ or {}).get(d.get("name"), [])
            # (one place for each window of a quest: the package listed first is the one that wins; a person who is in the kitchen by day and the tower by night
            # while the quest is at one stage is at the quest's place, said once)
            rows.setdefault((q["name"], when, lo, hi), (place, len(rows), maybe))
        if rows:
            order = {}
            for (name, when, lo, hi), (place, i, maybe) in rows.items():
                order.setdefault(name, i)
            said, lines = set(), []
            for (name, when, lo, hi), (place, i, maybe) in sorted(rows.items(), key=lambda kv: (order[kv[0][0]], kv[0][1] != "during", kv[0][2], kv[1][1])):
                if (name, when, place) not in said:  # (the same place in two windows of one quest is said once)
                    said.add((name, when, place))
                    lines.append({"when": when, "quest": name, "place": place, **({"maybeLoreRim": True} if maybe else {})})
            if lines:
                out[pid] = lines
    return out
