"""
Every line's opening quest, as the start check read it (WO-121a Part 4), for Bob to judge against UESP or the mod's
page and dialogue. Writes gamedata/<version>/story_checks/openings-2026-10-21.md from quests.json (the lines, their
categories and openings, what the page says now) and story_checks/<line>.json (every start, with its record):
  python3 scripts/gamedata/openings.py [--upto N] [version]

For each line: its opening quest and record; every way the check found it starts (who says the line, where they
stand, the line and the reply, or the trigger, the node's event and conditions, the start-game flag) with the record
that does it; its first step and what that points at; and what the quest's page says now. Lines are grouped by
category in quests.json's order; --upto writes only the first N, so the file can go out in batches.
"""
import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quest_pages import fill_text  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
# What the PC read for a line beyond the start check's rows, for Bob (WO-121a Part 4).
NOTES = {
    "deluge-of-deceit": [
        "The Black-Briar job line (INFO evgSIRENROOT.esm:0A25DD, topic EVGSirenrootQuestBB3, which EVGSirenrootQuestBB2's line "
        "0A25DB leads to) has one condition, GetIsVoiceType evgSirenBlackBriar (evgSIRENROOT.esm:0A25D6). Only one NPC has that "
        "voice: Frissa Black-Briar (BlackBriarNPC, evgSIRENROOT.esm:0A25D4), so the line is hers. The start check now names a "
        "speaker by a voice only one NPC has.",
        "Wujeeta's line (026BC9) is conditioned on Deluge of Deceit at stage 20 yet sets stage 1, so a player starting fresh "
        "can't hear it; what it's for is Bob's call. Frissa's job line has no such condition.",
    ],
    "baan-malur": [
        "The records give the line no single opening quest. A Grand Venture (DefunctQuest01) is an empty placeholder (its one "
        "log entry reads \"finished quest\"). The Amulet of Old (Adimmisaru, Arena Market), The Bruska Pogrom (a Redoran Guard), "
        "The New Temple (Sadren Solis), Daedra and Deceit (Llynelis) and The Struggle for Justice (Kar-Jei) are side quests "
        "you can meet in any order once you're in Baan Malur.",
        "Hlervan's Ashes runs from the start of the game, and nothing the start check reads sets the stage that shows its "
        "objective (\"Deliver Hlervan's Ashes to the Temple in Baan Malur.\"). Its scripts (QF_SOMRHlervansAshesQuest_07136F43, "
        "QF_SOMRHlervansAshes_0710D7F7) only show, complete and reward it, so it most likely starts when you pick the ashes up, "
        "through its alias, which the check doesn't read.",
        "So which quest the player starts first depends on the route: the line's start, \"Take the paid ferry from Raven Rock, "
        "or walk east of Windhelm through the Dwemer ruin Kalbthurz\", stays the way in, with no single giver. The ferry's "
        "talk (Captain Remyris, \"Raven Rock.\", Journey to Baan Malur.esp:12926D) is spoken in Baan Malur, for leaving.",
    ],
    "a-night-to-remember": [
        "New since Part 3: the line opens on DA14Start (Skyrim.esm:01BB9B), Sam Guevenne's drinking contest, which the game shows "
        "under Miscellaneous with no quest name. quests.py keeps a named quest's unnamed lead-in, named by its first objective "
        "(the same rule brings in DA03Start for A Daedra's Best Friend and MS05Start for The Bards College).",
    ],
}
TITLES = {"main": "Main", "guilds": "Guilds", "daedric": "Daedric", "lands": "Lands", "side": "Side", "followers": "Followers", "work": "Work"}


def start_words(s):
    """One start the check found, in words with its record."""
    if s["by"] == "dialogue":
        who = s.get("speaker") or "someone the records don't name"
        named = f" (named by {s['speakerNamed']})" if s.get("speakerNamed") not in (None, "GetIsID") else ""
        where = f", {s['speakerPlaced'][0]}" if s.get("speakerPlaced") else ""
        said = f': "{s["prompt"]}"' if s.get("prompt") else "."
        reply = f' Reply: "{s["reply"][0]}"' if s.get("reply") else ""
        when = f" When: {s['conditions']}." if s.get("conditions") else ""
        return f"**{who}**{named}{where}{said}{reply} Does: {s['call']}.{when} Record: {s['source']}."
    if s["by"] == "story manager":
        return f"**By itself**, story manager node {s['node']}, on {s.get('event') or 'no event'}: {s.get('conditions') or 'no conditions'}. Record: {s['source']}."
    if s["by"] == "quest script":
        text = f"**Through {s['quest']}**" + (f" (its stage {s['atStage']})" if s.get("atStage") is not None else "") + f", which calls {s['call']}."
        if s.get("plain"):
            text += f" {s['plain']}"
        ups = []
        for u in s.get("throughStartedBy", []):
            if u["by"] == "dialogue":
                ups.append(f"{u.get('speaker') or 'someone'}" + (f' ("{u["prompt"]}")' if u.get("prompt") else ""))
            elif u["by"] == "story manager":
                ups.append(f"story manager node {u['node']} on {u.get('event') or 'no event'} ({u.get('conditions') or 'no conditions'})")
            elif u["by"] == "start game":
                ups.append("the start-game flag")
            else:
                ups.append(u.get("quest") or u["by"])
        if "throughStartedBy" in s:
            text += f" That one starts from: {'; '.join(ups) if ups else 'nothing in the records or scripts'}."
        return text + f" Record: {s['source']}."
    return f"**It runs from the start of the game** (the start-game flag). Record: {s['source']}."


def merged(starts):
    """Starts that differ only in the stage they set, as one: the same speaker, line and record, its calls listed."""
    out, seen = [], {}
    for s in starts:
        key = (s["by"], s.get("speaker"), s.get("quest"), s.get("prompt"), s.get("source"), s.get("node"))
        if key in seen and s.get("call"):
            first = seen[key]
            first["call"] = first["call"] + ("" if s["call"] in first["call"].split("; ") else f"; {s['call']}")
            continue
        s = dict(s)
        seen[key] = s
        out.append(s)
    return out


def line_section(line, row, quest, globals_):
    head = f"### {line['name']} (`{line['id']}`)"
    if not row:
        return [head, "", f"Opening: {quest['name'] if quest else line.get('opening')} (`{line.get('opening')}`). **Not checked**: the start check has no result for this line.", ""]
    out = [head, "", f"Opening: **{row['name']}** (`{row['edid']}`, {row['id']}, {row['plugin']})."]
    starts = row.get("startedBy", [])
    if starts:
        out.append("")
        out += [f"- {fill_text(start_words(s), {}, globals_)}" for s in merged(starts)]
    if row.get("unread"):
        out += ["", f"- **Unread**: {row['unread']}."]
    fo = row.get("firstObjective") or {}
    pointed = "; ".join(f"{h['name']}" + (f" ({h['where'][0]})" if h.get("where") else "") for t in row.get("target", []) for h in t.get("holds", []))
    out += ["", f"First step: \"{fo.get('text')}\" at stage {row['firstObjectiveStage']} ({fo.get('source')})" + (f", pointing at {pointed}" if pointed else "") + "." if fo.get("text")
            else f"First step: none in its records (journal stage {row['firstObjectiveStage']})."]
    page = (quest or {}).get("start") or {}
    said = page.get("who") and f"{page['who']}" + (f", {page['where']}" if page.get("where") else "")
    out.append(f"The page says now: " + (f"who {said}; " if said else "no one giver; ") + f"then \"{page.get('then')}\"; checked: {page.get('checked', 'not yet')}.")
    if line["id"] in NOTES:
        out += [""] + [f"> {n}" for n in NOTES[line["id"]]]
    return out + [""]


def build(version, upto=None):
    data = json.load(open(os.path.join(REPO, "src", "data", f"lorerim-{version}", "quests.json"), encoding="utf-8"))
    globals_ = json.load(open(os.path.join(REPO, "gamedata", version, "quests_raw.json"), encoding="utf-8")).get("globals", {})
    checks = os.path.join(REPO, "gamedata", version, "story_checks")
    order = list(TITLES)
    lines = sorted(data["lines"], key=lambda l: order.index(l["category"]) if l["category"] in order else len(order))
    shown = lines[:upto] if upto else lines
    md = ["# Every line's opening (WO-121a Part 4, PC, 21 Oct 2026)", "",
          "For Bob to judge: each line's opening quest, every way the start check (`story_check.py`) found it starts, with "
          "the record that does it, its first step, and what the quest's page says now. Written by "
          "`scripts/gamedata/openings.py` from `quests.json` and `story_checks/<line>.json`. A line Bob can't confirm shows "
          "\"How it starts isn't checked yet\".", "",
          f"{len(shown)} of {len(lines)} lines" + (" so far; the rest follow in batches." if len(shown) < len(lines) else "."), ""]
    cat = None
    for line in shown:
        if line["category"] != cat:
            cat = line["category"]
            md += [f"## {TITLES.get(cat, cat)}", ""]
        quest = next((q for q in line["quests"] if q["edid"] == line.get("opening")), line["quests"][0] if line["quests"] else None)
        path = os.path.join(checks, f"{line['id']}.json")
        row = None
        if os.path.exists(path):
            rows = json.load(open(path, encoding="utf-8")).get("quests", [])
            row = next((r for r in rows if r["edid"] == (quest or {}).get("edid")), None)
        md += line_section(line, row, quest, globals_)
    return "\n".join(md).rstrip() + "\n", len(shown), len(lines)


def main():
    ap = argparse.ArgumentParser(description=__doc__.strip().splitlines()[0])
    ap.add_argument("--upto", type=int, help="write only the first N lines")
    ap.add_argument("version", nargs="?", default="5.0.4.8")
    args = ap.parse_args()
    text, n, total = build(args.version, args.upto)
    path = os.path.join(REPO, "gamedata", args.version, "story_checks", "openings-2026-10-21.md")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print(f"{n} of {total} lines -> {os.path.relpath(path, REPO)}")


if __name__ == "__main__":
    main()
