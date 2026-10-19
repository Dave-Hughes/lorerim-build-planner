"""
Stories (WO-106): big quest lines written as adventures, hand-kept by Bob in
gamedata/<version>/stories.json. build.py checks each story against the quest lines and writes
src/data/lorerim-<version>/stories.json with each quest's name and XP, and each opened line's name,
joined in from the quest pages' data.

Checks, all fatal (StoryError): every edid is a quest of the story's line; every quest of that line
is in a chapter or `alongside`, once; every `from` is a quest in the story; every opened line and
every need's line is a line id; every `checked` is "files" or "not yet".
"""
import copy

CHECKED = ("files", "not yet")


class StoryError(Exception):
    pass


def _checked_values(story):
    """Every `checked` in a story, with where it is, for the check."""
    out = []
    for i, s in enumerate(story.get("start", [])):
        out.append((f"start {i + 1}", s.get("checked")))
    for c in story.get("chapters", []):
        for q in c.get("quests", []):
            out.append((q.get("edid"), q.get("checked")))
    for q in story.get("alongside", []):
        out.append((q.get("edid"), q.get("checked")))
    if story.get("reward"):
        out.append(("reward", story["reward"].get("checked")))
    for o in story.get("opens", []):
        for n in o.get("needs", []):
            out.append((f"{o.get('line')} need {n.get('text')}", n.get("checked")))
        if o.get("or"):
            out.append((f"{o.get('line')} or", o["or"].get("checked")))
    return out


def check_story(story, lines):
    """Every problem with one story, as lines of text; empty when it's sound. `lines` is quests.json's lines by id."""
    sid = story.get("id", "?")
    problems = []
    line = lines.get(story.get("line"))
    if not line:
        return [f"{sid}: no quest line {story.get('line')!r}"]
    in_line = [q["edid"] for q in line["quests"]]
    told = [q["edid"] for c in story.get("chapters", []) for q in c.get("quests", [])] + [q["edid"] for q in story.get("alongside", [])]
    for e in told:
        if e not in in_line:
            problems.append(f"{sid}: {e} isn't a quest of {line['id']}")
    for e in in_line:
        n = told.count(e)
        if n == 0:
            problems.append(f"{sid}: {e} ({line['id']}) is in no chapter and not alongside")
        elif n > 1:
            problems.append(f"{sid}: {e} is in the story {n} times")
    for c in story.get("chapters", []):
        for q in c.get("quests", []):
            if "from" in q and q["from"] not in told:
                problems.append(f"{sid}: {q['edid']} comes from {q['from']}, which isn't in the story")
    for o in story.get("opens", []):
        if o.get("line") not in lines:
            problems.append(f"{sid}: opens {o.get('line')!r}, which isn't a line")
        for n in o.get("needs", []):
            if n.get("kind") == "line" and n.get("line") not in lines:
                problems.append(f"{sid}: a need of {o.get('line')} is the line {n.get('line')!r}, which isn't a line")
    for where, v in _checked_values(story):
        if v not in CHECKED:
            problems.append(f"{sid}: {where} is checked {v!r}; it must be 'files' or 'not yet'")
    return problems


def build_stories(stories, quest_lines):
    """stories.json (hand-kept) + quests.json's lines -> the page's stories.json. Raises StoryError."""
    lines = {l["id"]: l for l in quest_lines}
    problems = [p for s in stories for p in check_story(s, lines)]
    if problems:
        raise StoryError("\n".join(problems))
    out = []
    for s in stories:
        s = copy.deepcopy(s)
        line = lines[s["line"]]
        by = {q["edid"]: q for q in line["quests"]}
        s["lineName"] = line["name"]
        s["sources"] = line["sources"]
        for q in [q for c in s["chapters"] for q in c["quests"]] + s.get("alongside", []):
            q["name"] = by[q["edid"]]["name"]
            q["xp"] = by[q["edid"]]["xp"]
        for o in s.get("opens", []):
            o["name"] = lines[o["line"]]["name"]
        out.append(s)
    return out
