"""
Builds the planner's game data (src/data/lorerim-<version>/perks.json,
trees.json, traits.json, and birthsigns.json and stones.json once the extract
has their records) from the raw extract of the game files.

Perk trees are drawn exactly as the game lays them out: every perk gets the
game's position (`pos`, y up), and trees.json holds the lines the game draws
between stars (`links`). Lines come from the game's picture; prerequisites
(`requires`) stay the rules.

Inputs, under gamedata/<version>/:
  planner_data.json  what extract.py pulled from the winning records (trees,
                     perks with ranks and conditions, Destiny, traits)
  books.json         which books' scripts reference which perks (books.py)
  traitpics.json     trait artwork converted by traitpics.py
  items_raw.json     the game's weapons, armor and ammunition (items.py);
                     optional, builds items.json when present
  powers_raw.json    abilities (powers, lesser powers), the perks that grant
                     them, and shouts (powers.py); builds powers.json
  spells_raw.json    the spells tomes teach and the tier perks' picks
                     (spells.py); optional, builds spells.json when present
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

    # Destiny ids: "Destiny:<name>", but two Destiny perks share the name Endurance in the
    # game (the second is the record DAR_Perk19Acrobat); a repeated name takes its record's
    # name for the id, and keeps the game's name for display.
    destiny_ids = {}
    for n in data["destiny"]:
        if "key" not in n:
            continue
        pid = f"Destiny:{n['name']}"
        if pid in destiny_ids.values():
            pid = "Destiny:" + re.sub(r"^DAR_Perk\d+", "", n["edid"])
        destiny_ids[n["node"]] = pid

    # (plugin, form id) -> planner id, for every node of every skill tree
    ids = {}
    for tree, t in data["trees"].items():
        for n in t["nodes"]:
            ids[tuple(n["key"])] = f"{tree}:{n['name']}"
    for n in data["destiny"]:
        if "key" in n:
            ids[tuple(n["key"])] = destiny_ids[n["node"]]
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
            # The game's own position in the tree: grid cell plus its offset, y up.
            out["pos"] = [round(node["x"] + node["hx"], 4), round(node["y"] + node["vy"], 4)]
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
        pid = destiny_ids[n["node"]]
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
        out["pos"] = [n["x"], n["y"]]
        perks.append(out)

    # The lines the game draws between stars: linksTo for skill trees, Links for Destiny.
    trees = {}
    for tree, t in data["trees"].items():
        links = []
        for node in t["nodes"]:
            src = f"{tree}:{node['name']}"
            for k in node.get("linksTo", []):
                dst = ids.get(tuple(k))
                if not dst or not dst.startswith(tree + ":"):
                    problems.append(f"{src}: line to {k} outside the tree")
                elif [src, dst] not in links:
                    links.append([src, dst])
        trees[tree] = {"links": links}
    by_node = destiny_ids
    destiny_links = []
    for n in data["destiny"]:
        src = by_node.get(n["node"])
        if not src:
            continue  # the wheel's centre, not a perk
        for m in n.get("links", []):
            if m in by_node and [src, by_node[m]] not in destiny_links:
                destiny_links.append([src, by_node[m]])
    trees["Destiny"] = {"links": destiny_links}

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

    seen = set()
    for p in perks:
        if p["id"] in seen:
            problems.append(f"{p['id']}: two perks with this id")
        seen.add(p["id"])
    known = {p["id"] for p in perks}
    for p in perks:
        for r in p["requires"] + p.get("excludes", []):
            if r not in known:
                problems.append(f"{p['id']}: unknown prerequisite {r}")

    # Birthsigns and standing stones: the game's words from their spells' records, the rule
    # numbers from overrides.json. A sign the extract has no record for gets no text, and a note.
    def sign_text(cands, prefer):
        if not cands:
            return None
        # The sign's own ability, not its add-ons (Apprentice_Weakness, Ritual_Turn, Shadow_Moonshadow):
        # among the preferred records, one with text first, then the shortest EDID.
        preferred = [c for c in cands if re.search(prefer, c["edid"] or "", re.I)] or cands
        best = min(preferred, key=lambda c: (not c["desc"].strip(), len(c["edid"] or "")))
        if best["desc"].strip():
            return unmark(clean(best["desc"]))
        parts = []
        for e in best["effects"]:
            d = e["desc"] or ""
            if e.get("mag") is not None:
                d = d.replace("<mag>", f"{e['mag']:g}")
            if e.get("dur") is not None:
                d = d.replace("<dur>", str(e["dur"]))
            d = unmark(clean(d))
            if d and d not in parts:
                parts.append(d)
        return " ".join(parts) or None

    signs_out = stones_out = None
    if "signs" in data:
        signs_out, stones_out = [], []
        for name, nums in overrides["birthsigns"].items():
            t = sign_text(data["signs"].get(name, []), r"birthsign")
            if t is None:
                problems.append(f"birthsign {name}: no text in the records; shown without one")
            signs_out.append({"name": name, "text": t or "", **nums})
        for name, nums in overrides["stones"].items():
            t = sign_text(data["signs"].get(name, []), r"doomstones_.*spell")
            if t is None:
                problems.append(f"standing stone {name}: no text in the records; shown without one")
            stones_out.append({"name": name, "text": t or "", "fromRecords": t is not None, **nums})
    else:
        problems.append("birthsigns and stones: the extract has no 'signs' yet (re-run extract.py); birthsigns.json and stones.json left as they are")

    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "perks.json"), "w", encoding="utf-8") as f:
        json.dump(perks, f, indent=2, ensure_ascii=False)
        f.write("\n")
    with open(os.path.join(OUT, "trees.json"), "w", encoding="utf-8") as f:
        json.dump(trees, f, indent=2, ensure_ascii=False)
        f.write("\n")
    for fname, rows in (("birthsigns.json", signs_out), ("stones.json", stones_out)):
        if rows is not None:
            with open(os.path.join(OUT, fname), "w", encoding="utf-8") as f:
                json.dump(rows, f, indent=2, ensure_ascii=False)
                f.write("\n")
    with open(os.path.join(OUT, "traits.json"), "w", encoding="utf-8") as f:
        json.dump(traits, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"{len(perks)} perks, {len(traits)} traits -> {os.path.relpath(OUT, ROOT)}")
    # Starts (WO-29): the game's 25, in its order and spelling, each with its own text and options.
    if os.path.exists(os.path.join(RAW, "starts_raw.json")):
        labels = overrides.get("starts", {}).get("optionLabels", {})
        starts = [
            {"name": s["name"], "source": s["from"], "text": s["text"], "options": [o["name"] for o in s["options"]], **({"optionLabel": labels[s["name"]]} if s["options"] and s["name"] in labels else {})}
            for s in load("starts_raw.json")["starts"]
        ]
        missing = [s["name"] for s in starts if s["options"] and "optionLabel" not in s]
        if missing:
            problems.append(f"starts with options but no label in overrides.json: {', '.join(missing)}")
        with open(os.path.join(OUT, "starts.json"), "w", encoding="utf-8") as f:
            json.dump(starts, f, indent=2, ensure_ascii=False)
            f.write("\n")
        print(f"{len(starts)} starts -> starts.json")
    # Deity text (WO-29, WO-34): all of Wintersun's deities, each named from its tenets record
    # ("Tenets of the All-Maker" -> "The All-Maker"; the key Totems comes out as The Old Ways), with
    # its follower and devotee boons and tenets.
    if os.path.exists(os.path.join(RAW, "deities_raw.json")):
        from names import deity_name

        text = {}
        for d in load("deities_raw.json")["deities"]:
            if not d.get("tenets"):
                problems.append(f"deity {d['key']}: no tenets record to name it by")
                continue
            text[deity_name(d["tenets"]["name"])] = {part: {"name": d[part]["name"], "text": unmark(d[part]["text"])} for part in ("follower", "devotee", "tenets") if d.get(part)}
        text = dict(sorted(text.items(), key=lambda kv: re.sub(r"^The ", "", kv[0])))
        offered = {g for gods in json.load(open(os.path.join(OUT, "deities.json"), encoding="utf-8")).values() for g in gods}
        for g in sorted(offered - set(text)):
            problems.append(f"deity {g}: offered to a race but not in Wintersun's list")
        with open(os.path.join(OUT, "deity-text.json"), "w", encoding="utf-8") as f:
            json.dump(text, f, indent=2, ensure_ascii=False)
            f.write("\n")
        print(f"{len(text)} deities -> deity-text.json")
    # The item index (items.py), once its raw extract is in: loaded on demand, never in the main bundle.
    if os.path.exists(os.path.join(RAW, "items_raw.json")):
        from items import build_items

        item_rules = load("overrides.json").get("items", {})
        rows = build_items(load("items_raw.json"), item_rules.get("skipNames", []), item_rules.get("prefer", {}))
        with open(os.path.join(OUT, "items.json"), "w", encoding="utf-8") as f:
            json.dump(rows, f, separators=(",", ":"), ensure_ascii=False)
            f.write("\n")
        print(f"{len(rows)} items -> items.json")
    # Abilities and shouts (WO-51), from powers.py's raw file.
    if os.path.exists(os.path.join(RAW, "powers_raw.json")):
        from powers import build_powers

        tree_ids = {p["id"] for p in json.load(open(os.path.join(OUT, "perks.json"), encoding="utf-8"))}
        perk_by_edid = {}
        for edid, pk in data["perks"].items():
            pid = f"{pk['tree']}:{pk['ranks'][0]['name']}"
            if pid in tree_ids:
                for rk in pk["ranks"]:
                    perk_by_edid[rk["edid"]] = pid
                perk_by_edid[edid] = pid
        pw, notes = build_powers(load("powers_raw.json"), perk_by_edid, load("overrides.json").get("powers", {}).get("skipNames", []))
        problems += notes
        with open(os.path.join(OUT, "powers.json"), "w", encoding="utf-8") as f:
            json.dump(pw, f, separators=(",", ":"), ensure_ascii=False)
            f.write("\n")
        print(f"{len(pw['abilities'])} abilities, {len(pw['fromPerks'])} from perks, {len(pw['shouts'])} shouts -> powers.json")
    # Spells (WO-41): the tomes' spells and the tier perks' picks, from spells.py's raw file.
    if os.path.exists(os.path.join(RAW, "spells_raw.json")):
        from spells import build_spells

        perk_ids = {p["id"] for p in json.load(open(os.path.join(OUT, "perks.json"), encoding="utf-8"))}
        data, notes = build_spells(load("spells_raw.json"), perk_ids, unmark, clean)
        problems += notes
        with open(os.path.join(OUT, "spells.json"), "w", encoding="utf-8") as f:
            json.dump(data, f, separators=(",", ":"), ensure_ascii=False)
            f.write("\n")
        print(f"{len(data['spells'])} spells, {len(data['spellPicks']['pools'])} pick pools -> spells.json")
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


if __name__ == "__main__":
    main()
