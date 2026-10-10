"""
Builds the planner's game data (src/data/lorerim-<version>/perks.json and
traits.json) from the raw extract of the game files.

Inputs, under gamedata/<version>/:
  planner_data.json  what extract.py pulled from the winning records (trees,
                     perks with ranks and conditions, Destiny, traits)
  books.json         which books' scripts reference which perks (books.py)
  traitpics.json     trait artwork converted by traitpics.py
  overrides.json     hand-kept facts the records don't carry in a readable
                     form (quest wording, carry weight, which traits the
                     numbers simulate, perk records that stand in for a
                     tree node)

Run from the repo root:  python3 scripts/gamedata/build.py [version]
"""
import json
import os
import re
import sys

VERSION = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = os.path.join(ROOT, "gamedata", VERSION)
OUT = os.path.join(ROOT, "src", "data", f"lorerim-{VERSION}")


def load(name):
    with open(os.path.join(RAW, name), encoding="utf-8") as f:
        return json.load(f)


def clean(s):
    """Collapse in-game line breaks and spacing; keep the words."""
    s = re.sub(r"\s*<br\s*/?>\s*", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r"\.([A-Z])", r". \1", s)  # "all-encompassing.You" in a few records
    return s


def unmark(s):
    """Drop the <N> highlight markers the trait menu uses."""
    return re.sub(r"<([^<>]*)>", r"\1", s)


def split_desc(desc):
    """'flavor<br>[effect]' -> (flavor, effect); anything else -> (text, '')."""
    m = re.match(r"^(.*?)<br>\s*\[(.*)\]\s*$", desc, re.S)
    if m:
        effect = clean(m.group(2))
        return clean(m.group(1)), effect[:1].upper() + effect[1:]
    return clean(desc), ""


def main():
    data = load("planner_data.json")
    books = load("books.json")
    overrides = load("overrides.json")
    pics = load("traitpics.json")

    # (plugin, form id) -> planner id, for every node of every skill tree
    ids = {}
    for tree, t in data["trees"].items():
        for n in t["nodes"]:
            ids[tuple(n["key"])] = f"{tree}:{n['name']}"
    for n in data["destiny"]:
        if "key" in n:
            ids[tuple(n["key"])] = f"Destiny:{n['name']}"
    for key, pid in overrides.get("aliases", {}).items():
        plugin, form = key.rsplit(":", 1)
        ids[(plugin, int(form))] = pid

    # Which book grants a perk: the book whose script names the perk and only
    # that perk's own prerequisites besides it.
    granted_by = {}
    by_book = {}
    for pid, lst in books.items():
        for b in lst:
            by_book.setdefault(b["edid"], {"name": b["book"], "perks": set()})["perks"].add(pid)

    perks = []
    problems = []
    for tree, t in data["trees"].items():
        for node in t["nodes"]:
            rec = data["perks"][node["edid"]]
            ranks = rec["ranks"]
            pid = f"{tree}:{node['name']}"
            requires, excludes = [], []
            any_of = False
            rank_skills, rank_levels = [], []
            book_only = False
            carry_items = []
            quest = False
            for ri, r in enumerate(ranks):
                prev = tuple(ranks[ri - 1]["key"]) if ri else None
                own = tuple(r["key"])
                skill = 0
                level = 0
                conds = r["conditions"]
                for ci, c in enumerate(conds):
                    kind = c["kind"]
                    if kind == "HasPerk":
                        target = tuple(c["perk"])
                        if target == prev or target == own:
                            continue  # the previous rank, or "already have it" in the carry-item pattern
                        tid = ids.get(target)
                        if not tid:
                            problems.append(f"{pid} rank {ri + 1}: HasPerk on a perk outside the trees {c['perkName']} {target}")
                            continue
                        if c["value"] == 1:
                            if ri == 0:
                                if tid not in requires:
                                    requires.append(tid)
                                # An OR flag on this or the previous condition joins the perks into one "any of" group.
                                if c["or"] or (ci > 0 and conds[ci - 1]["kind"] == "HasPerk" and conds[ci - 1]["or"]):
                                    any_of = True
                            elif tid not in requires:
                                problems.append(f"{pid} rank {ri + 1} needs {tid} that rank 1 doesn't")
                        elif c["value"] == 0:
                            if tid not in excludes:
                                excludes.append(tid)
                        else:
                            problems.append(f"{pid}: HasPerk compared with {c['value']}")
                    elif kind == "GetBaseActorValue":
                        if c["av"] != tree:
                            problems.append(f"{pid} rank {ri + 1}: skill condition on {c['av']}")
                        if c["cmp"] == ">=":
                            skill = max(skill, int(c["value"]))
                        else:
                            problems.append(f"{pid}: skill compared with {c['cmp']}")
                    elif kind == "GetLevel":
                        if c["cmp"] == "<" and c["value"] <= 0:
                            book_only = True
                        elif c["cmp"] == ">=" and c["value"] > 1:
                            level = max(level, int(c["value"]))
                        elif c["cmp"] == ">=" and c["value"] <= 1:
                            pass  # always true
                        else:
                            problems.append(f"{pid}: level condition {c['cmp']} {c['value']}")
                    elif kind == "GetItemCount":
                        if c["itemName"] not in carry_items:
                            carry_items.append(c["itemName"])
                    elif kind in ("GetStage", "GetQuestCompleted", "GetQuestRunning", "GetPCMiscStat"):
                        quest = True
                    else:
                        problems.append(f"{pid} rank {ri + 1}: condition {kind} left out")
                rank_skills.append(skill)
                rank_levels.append(level)

            if any_of and len(requires) < 2:
                any_of = False  # an OR flag on the last condition joins nothing
            text, effect = split_desc(ranks[0]["desc"])
            rank_texts = [split_desc(r["desc"]) for r in ranks]
            out = {"id": pid, "tree": tree, "name": node["name"], "requires": requires, "anyOf": any_of}
            if excludes:
                out["excludes"] = excludes
            out["ranks"] = len(ranks)
            out["skill"] = rank_skills[0]
            if len(ranks) > 1:
                out["rankSkills"] = rank_skills
            if any(rank_levels):
                out["rankLevels"] = rank_levels
            book = next((b["name"] for b in by_book.values() if pid in b["perks"] and _grants(b, pid, data, ids)), None)
            if book_only and not book:
                problems.append(f"{pid}: can't be taken from the menu and no book grants it")
            if book and not book_only:
                problems.append(f"{pid}: a book grants it but the menu allows it too")
            if book:
                out["book"] = book
            ov = overrides["perks"].get(pid, {})
            if carry_items:
                out["carryItems"] = "; ".join(carry_items)
            if quest and "quest" not in ov:
                problems.append(f"{pid}: quest condition; add quest wording to overrides")
            if "quest" in ov and not quest:
                problems.append(f"{pid}: overrides give quest wording but the records have no quest condition")
            for k in ("quest", "carryWeight", "allAttributes"):
                if k in ov:
                    out[k] = ov[k]
            if len(ranks) > 1:
                # Each rank has its own words in the game.
                out["rankTexts"] = [unmark(t) for t, _ in rank_texts]
                effects = [unmark(e) for _, e in rank_texts]
                if any(effects):
                    out["rankEffects"] = effects
            else:
                out["text"] = unmark(text)
                if effect:
                    out["effect"] = unmark(effect)
            perks.append(out)

    # Destiny: prerequisites from the perk conditions, positions from the Custom Skills config.
    for n in data["destiny"]:
        if "key" not in n:
            continue
        pid = f"Destiny:{n['name']}"
        requires, any_of = [], False
        conds = n["conditions"]
        for ci, c in enumerate(conds):
            if c["kind"] != "HasPerk" or c["value"] != 1:
                problems.append(f"{pid}: condition {c['kind']} {c['cmp']} {c['value']}")
                continue
            tid = ids.get(tuple(c["perk"]))
            if not tid:
                problems.append(f"{pid}: HasPerk on {c['perkName']} outside Destiny")
                continue
            requires.append(tid)
            if c["or"] or (ci > 0 and conds[ci - 1]["or"]):
                any_of = True
        out = {"id": pid, "tree": "Destiny", "name": n["name"], "requires": requires, "anyOf": any_of and len(requires) > 1}
        out["ranks"] = 1
        ov = overrides["perks"].get(pid, {})
        for k in ("carryWeight", "allAttributes"):
            if k in ov:
                out[k] = ov[k]
        out["text"] = unmark(clean(n["desc"]))
        out["x"] = n["x"]
        out["y"] = n["y"]
        perks.append(out)

    traits = []
    for t in data["traits"]:
        pic = pics.get(t["name"])
        if not pic:
            problems.append(f"trait {t['name']}: no artwork")
        text = clean(t["desc"])
        if text.lower().startswith(t["name"].lower() + ":"):
            text = text[len(t["name"]) + 1 :].strip()  # a few records repeat the name
        traits.append({
            "name": t["name"],
            "text": text,
            "image": f"/traits/{pic['file']}" if pic else None,
            "simulated": bool(overrides["traits"].get(t["name"], {}).get("simulated")),
        })
    traits.sort(key=lambda t: t["name"].lower())

    known = {p["id"] for p in perks}
    for p in perks:
        for r in p["requires"] + p.get("excludes", []):
            if r not in known:
                problems.append(f"{p['id']}: unknown prerequisite {r}")

    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "perks.json"), "w", encoding="utf-8") as f:
        json.dump(perks, f, indent=2, ensure_ascii=False)
        f.write("\n")
    with open(os.path.join(OUT, "traits.json"), "w", encoding="utf-8") as f:
        json.dump(traits, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"{len(perks)} perks, {len(traits)} traits -> {os.path.relpath(OUT, ROOT)}")
    for p in problems:
        print("note:", p)


def _grants(book, pid, data, ids):
    """True when `book` grants `pid`: every other perk its script names is a direct prerequisite of `pid`."""
    others = book["perks"] - {pid}
    if not others:
        return True
    tree, name = pid.split(":", 1)
    node = next(n for n in data["trees"][tree]["nodes"] if n["name"] == name)
    rank1 = data["perks"][node["edid"]]["ranks"][0]
    prereqs = {ids.get(tuple(c["perk"])) for c in rank1["conditions"] if c["kind"] == "HasPerk" and c["value"] == 1}
    return others <= prereqs


main()
