"""
The quest lines a player picks from, curated from what quests.py read on Dave's PC.

Reads gamedata/<version>/quests_raw.json, questlines_raw.json and the hand-kept questlines.json.
Writes questlines_report.md beside them (and returns the lines, for build.py when the quest pages
come):
  python3 scripts/gamedata/questlines.py [version]

questlines.json lists each curated line with
  lines      raw lines (by name) it takes whole: a mod, its patches, a vanilla story type
  quests     single quests (by EDID) it takes, from anywhere: how the vanilla side and misc
             buckets are split into named lines. A quest named here leaves the raw line it was in.
  skip       quests of its raw lines that are machinery (map markers, scene holders)
  opening    the quest whose first journal entry says how the line begins. Default: the first raw
             line's opening, else the first quest. "begins": false when the text is no use (a
             modder's note that happens to read as a sentence).
  alsoOpening other quests that open the line as much as `opening` does (the Civil War's two sides, the
             townsfolk's six deliveries): the line has no one giver, and its ways in are each opening's.
  destinationInName  false for a family of radiant jobs whose quest names and objectives never say where
             the job goes (Missives: "Deliver a Letter Distant"; WO-129 Part 3's promise check reads it)
  giver      {name, place} a judged source names when the records can't (Raven Rock: Captain Veleth, whom
             DLC2Init sets fighting at Old Attius Farm); `checked.giver` says which source.
  category   its home: one of the six `categories`, or a `shelves` entry (repeatable work)
  also       other categories it belongs in (Vigilant: guilds, and Daedric for Molag Bal)
  start, gate, minLevel, level, size, note, after: facts the records don't hold, from the field
             guide; `checked` says where each came from (files, mod page, players).
`dropped` and `droppedQuests` say why a raw line or a bucket quest is left out.

Checks, all fatal: every raw line is taken or dropped; every bucket quest is taken or dropped; no
quest or raw line is taken twice; every EDID, line name and `after` id is real. The begins text is the
game's own words: the first journal entry of the opening quest that is plain text (no <Alias=…>
holes, no ';' notes, a sentence long), else the first such entry later in the line, else the first
plain objective. Lines where that fell back, or found nothing, are listed in the report.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
FACTS = ("start", "gate", "minLevel", "level", "size", "note", "mainQuestAt")


class CurationError(Exception):
    pass


def plain(text):
    """Text a page can show as it is: a sentence, no alias holes, not a modder's note."""
    if not text:
        return False
    t = text.strip()
    return len(t) >= 30 and "<" not in t and not t.startswith(";") and " " in t


def entries(q):
    """A quest's journal entries up to the stage that ends it: an ending is no way to start a card
    ("I have defeated the Ebony Warrior")."""
    for s in q.get("stages", []):
        if s.get("completes") or s.get("fails"):
            return
        for log in s.get("log") or []:
            yield log


def objective_of(q):
    for o in q.get("objectives") or []:
        text = o.get("text") if isinstance(o, dict) else o
        if text and "<" not in text and len(text.strip()) >= 12:
            return text.strip()
    return None


def begins_of(order, opening, objectives=True):
    """(text, how), how being 'opening', 'objective' (the opening quest's), 'later' (a later quest's
    entry), or (None, None). The opening quest's own words come first, journal then objective; only
    then a later quest, which may give more of the story away."""
    log = next((x for x in entries(opening) if plain(x)), None)
    if log:
        return log.strip(), "opening"
    if objectives and objective_of(opening):
        return objective_of(opening), "objective"
    for q in order:
        if q is opening:
            continue
        log = next((x for x in entries(q) if plain(x)), None)
        if log:
            return log.strip(), "later"
    return None, None


def curate(quests, raw_lines, cur):
    by_edid = {}
    for q in quests:
        if q["edid"] in by_edid:
            raise CurationError(f"two quests share the EDID {q['edid']}")
        by_edid[q["edid"]] = q
    by_id = {q["id"]: q for q in quests}
    raw = {l["name"]: l for l in raw_lines}
    buckets = {l["name"] for l in raw_lines if l["kind"] == "bucket"}
    problems = []

    # Quests named on a line leave whatever raw line they were in.
    claimed = {}
    for line in cur["lines"]:
        for e in line.get("quests", []):
            if e not in by_edid:
                problems.append(f"{line['id']}: no quest {e}")
            elif e in claimed:
                problems.append(f"{e} is on both {claimed[e]} and {line['id']}")
            else:
                claimed[e] = line["id"]
    taken = {}
    for line in cur["lines"]:
        for n in line.get("lines", []):
            if n not in raw:
                problems.append(f"{line['id']}: no raw line {n!r}")
            elif n in buckets:
                problems.append(f"{line['id']}: takes the bucket {n!r} whole; name its quests instead")
            elif n in taken:
                problems.append(f"raw line {n!r} is on both {taken[n]} and {line['id']}")
            else:
                taken[n] = line["id"]
    for n in cur.get("dropped", {}):
        if n not in raw:
            problems.append(f"dropped: no raw line {n!r}")
        elif n in taken:
            problems.append(f"raw line {n!r} is both dropped and on {taken[n]}")
    for n, l in raw.items():
        if n in buckets or n in taken or n in cur.get("dropped", {}):
            continue
        problems.append(f"raw line {n!r} ({l['count']} quests) is neither on a line nor dropped")
    dq = cur.get("droppedQuests", {})
    for e in dq:
        if e not in by_edid:
            problems.append(f"droppedQuests: no quest {e}")
        elif e in claimed:
            problems.append(f"{e} is both dropped and on {claimed[e]}")
    for n in buckets:
        for i in raw[n]["quests"]:
            e = by_id[i]["edid"]
            if e not in claimed and e not in dq:
                problems.append(f"{n}: {e} ({by_id[i]['name']}) is neither on a line nor dropped")

    ids = {line["id"] for line in cur["lines"]}
    if len(ids) != len(cur["lines"]):
        problems.append("two lines share an id")
    for line in cur["lines"]:
        homes = {**cur["categories"], **cur.get("shelves", {})}
        if line["category"] not in homes:
            problems.append(f"{line['id']}: unknown category {line['category']}")
        if line.get("mainQuestAt") and line["mainQuestAt"] not in by_edid:
            problems.append(f"{line['id']}: mainQuestAt {line['mainQuestAt']} isn't a quest")
        for c in line.get("also", []):
            if c not in cur["categories"] or c == line["category"]:
                problems.append(f"{line['id']}: also in {c}, which isn't another category")
        for a in line.get("after", []):
            if a not in ids:
                problems.append(f"{line['id']}: after {a}, which isn't a line")
        for k in line.get("checked", {}):
            if k not in line:
                problems.append(f"{line['id']}: says where {k} was checked but has no {k}")
    if problems:
        raise CurationError("\n".join(problems))

    out = []
    for line in cur["lines"]:
        skip = set(line.get("skip", []))
        from_raw = []
        for n in line.get("lines", []):
            for i in raw[n]["quests"]:
                q = by_id[i]
                if q["edid"] not in claimed and q["edid"] not in skip:
                    from_raw.append(q)
        named = [by_edid[e] for e in line.get("quests", [])]
        order = named + from_raw if line.get("questsFirst") else from_raw + named
        for e in skip:
            if e not in by_edid or all(q["edid"] != e for n in line.get("lines", []) for q in
                                       (by_id[i] for i in raw[n]["quests"])):
                problems.append(f"{line['id']}: skips {e}, which isn't in its raw lines")
        if not order:
            problems.append(f"{line['id']}: no quests left")
            continue
        if "opening" in line:
            opening = by_edid.get(line["opening"])
            if opening not in order:
                problems.append(f"{line['id']}: opening {line['opening']} isn't one of its quests")
                continue
        elif line.get("lines") and raw[line["lines"][0]].get("opening") in {q["id"] for q in order}:
            opening = by_id[raw[line["lines"][0]]["opening"]]
        else:
            opening = order[0]
        for e in line.get("alsoOpening", []):
            if by_edid.get(e) not in order:
                problems.append(f"{line['id']}: also opens with {e}, which isn't one of its quests")
        if line.get("begins") is False:
            text, how = None, None
        else:
            # Steady work and homes have no story to open: a card says how to find them instead.
            text, how = begins_of(order, opening, objectives=line["category"] in cur["categories"])
        # Where its quests come from: the base game first (as one), then each mod in quest order.
        sources = []
        for q in order:
            src = ("Skyrim", None) if q.get("source") == "Skyrim" else (q.get("source"), q.get("modid"))
            if src not in sources:
                sources.append(src)
        sources.sort(key=lambda s: s[0] != "Skyrim")
        item = {
            "id": line["id"], "name": line["name"], "category": line["category"], "also": line.get("also", []),
            "where": line.get("where"), "prince": line.get("prince"),
            "sources": [{"name": s, "modid": m} for s, m in sources],
            "opening": opening["edid"], "begins": text, "beginsFrom": how,
            "quests": [{"id": q["id"], "edid": q["edid"], "name": q["name"], "type": q["type"]} for q in order],
            "after": line.get("after", []),
            "checked": line.get("checked", {}),
        }
        for k in FACTS + ("alsoOpening", "giver", "destinationInName"):
            if k in line:
                item[k] = line[k]
        out.append(item)
    if problems:
        raise CurationError("\n".join(problems))
    return out


def report(lines, cur, not_in_records, disagreements=None):
    md = ["# Quest lines, curated", "",
          f"{len(lines)} lines from {sum(len(l['quests']) for l in lines)} quests. Written by "
          "`scripts/gamedata/questlines.py` from `questlines.json` (hand-kept) and the raw crawl. "
          "Begins is the game's own text: the line's opening journal entry.", ""]
    cats = {**cur["categories"], **cur.get("shelves", {})}
    md += ["Six categories, each line in one (its home) and maybe others (also). Repeatable work is "
           "a shelf of its own, not a category.", "",
           "| Category | Subtitle | Lines (home) | Also here |", "|---|---|---|---|"]
    for k, c in cats.items():
        ls = [l for l in lines if l["category"] == k]
        more = [l for l in lines if k in l["also"]]
        md.append(f"| {c['name']} | {c['subtitle']} | {len(ls)} | {len(more)} |")
    md += [""] + [f"- **{c['name']}**: {c['more']}" for c in cats.values()]
    look = [l for l in lines if l["beginsFrom"] != "opening" and l["category"] in cur["categories"]]
    md += ["", "## Needs a look", ""]
    md += [f"- **{l['name']}**: " + ("no plain journal entry or objective anywhere." if not l["begins"]
           else {"objective": "the opening quest has no plain journal entry; shows its first objective.",
                 "later": "the opening quest has no plain text; shows a later quest's first entry."}[l["beginsFrom"]]) for l in look] or ["Nothing."]
    unchecked = [l["name"] for l in lines if not l["checked"] and l["category"] in cur["categories"]]
    md += ["", f"**No facts checked yet** ({len(unchecked)}): " + ", ".join(unchecked) + ".", ""]
    for k, c in cats.items():
        ls = [l for l in lines if l["category"] == k]
        md += [f"## {c['name']}", "", f"*{c['subtitle']}*", ""]
        more = [l["name"] for l in lines if k in l["also"]]
        if more:
            md += ["Also here: " + ", ".join(more) + ".", ""]
        for l in ls:
            src = ", ".join(s["name"] + (f" (Nexus {s['modid']})" if s["modid"] else "") for s in l["sources"])
            md.append(f"### {l['name']}")
            md.append("")
            bits = [f"{len(l['quests'])} quest{'s' if len(l['quests']) != 1 else ''}", src]
            if l.get("where"):
                bits.append(l["where"])
            if l.get("prince"):
                bits.append(l["prince"])
            md.append(" | ".join(bits))
            md.append("")
            if l["begins"]:
                md.append(f"> {l['begins']}")
                md.append("")
            for k2, lab in (("start", "Start"), ("gate", "Gate"), ("level", "Level"), ("size", "Length"), ("note", "Note")):
                if l.get(k2):
                    how = l["checked"].get(k2)
                    md.append(f"- {lab}: {l[k2]}" + (f" *({how})*" if how else ""))
            if l["after"]:
                md.append("- After: " + ", ".join(next(x["name"] for x in lines if x["id"] == a) for a in l["after"]))
            md.append("- Quests: " + "; ".join(q["name"] for q in l["quests"]))
            md.append("")
    md += ["## In the field guide, not in the records", "",
           "Installed, but the crawl kept no quest for them (no journal text it could read, or the "
           "plugin goes by another name). To check on the PC.", ""]
    for n in not_in_records:
        md.append(f"- **{n['name']}**: {n['why']}")
    if disagreements:
        md += ["", "## Checked starts that disagree with the field guide", "",
               "The start check (story_check.py) read these from the files; the checked value is the one quests.json keeps.", ""]
        for d in disagreements:
            md.append(f"- **{d['name']}** ({d['quest']}): the field guide's {d['field']} is {d['guide']}; the files say {d['checked']}.")
    dropped = cur.get("dropped", {})
    md += ["", "## Left out", ""] + [f"- {n}: {why}" for n, why in dropped.items()]
    md += [f"- {len(cur.get('droppedQuests', {}))} base-game quests: roadside encounters, children's games, "
           "monitors and placeholders (listed in `questlines.json`)."]
    return "\n".join(md) + "\n"


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    base = os.path.join(ROOT, "gamedata", version)
    load = lambda n: json.load(open(os.path.join(base, n), encoding="utf-8"))  # noqa: E731
    cur = load("questlines.json")
    try:
        lines = curate(load("quests_raw.json")["quests"], load("questlines_raw.json")["lines"], cur)
    except CurationError as e:
        print(e, file=sys.stderr)
        sys.exit(1)
    with open(os.path.join(base, "questlines_report.md"), "w", encoding="utf-8") as f:
        f.write(report(lines, cur, cur.get("notInRecords", [])))
    print(f"{len(lines)} lines, {sum(len(l['quests']) for l in lines)} quests")
    return lines


if __name__ == "__main__":
    main()
