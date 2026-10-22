"""
WO-121b Part 3: the answer key (gamedata/<version>/quest_truth.json) takes every opening Bob judged right in
story_checks/openings-judged-2026-10-21.json: CONFIRMED and NO_GIVER_OK. Each row comes from what the page said when he
judged it ("Faralda, Hall of Countenance, Winterhold College; then "Join the College of Winterhold""), with its
source: `uesp` and the url for base-game and DLC lines, `records` for mod lines. A NO_GIVER_OK row is `noGiver: true`.
A WRONG row goes in once a fix puts the page right (FIXED, in Bob's words from his reason).
A first step he saw cut short ("Steal Suvaris Atheron's logbook...") takes the page's full words when they start the
same. Rows the key already holds (by editor id) stay as Bob wrote them.

Run:  python3 scripts/gamedata/truth_from_judged.py   (then python3 scripts/gamedata/build.py)
"""
import json
import os
import re

VERSION = "5.0.4.8"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TRUTH = os.path.join(ROOT, "gamedata", VERSION, "quest_truth.json")
JUDGED = os.path.join(ROOT, "gamedata", VERSION, "story_checks", "openings-judged-2026-10-21.json")
QUESTS = os.path.join(ROOT, "src", "data", f"lorerim-{VERSION}", "quests.json")

SAYS = re.compile(r'^(?P<who>.+?); then "?(?P<then>.*?)"?$')
# "First Lessons (MG01)", or the editor id alone ("dunVolunruudQST").
OPENING = re.compile(r"^(?:(?P<name>.*) \((?P<edid>[^()]+)\)|(?P<bare>[^\s()]+))$")


# Rows Bob judged WRONG that WO-121b Part 1 put right: what the page should say, from his reason.
FIXED = {
    "wyrmstooth": {"startsWith": ["Theodyn Bienne"], "where": "he comes to find you", "firstObjective": "Speak to Lurius Liore at The Bannered Mare in Whiterun"},
    "the-ebony-warrior": {"startsWith": ["Ebony Warrior"], "where": "Whiterun, Riften, Windhelm, Markarth or Solitude", "firstObjective": "Talk to the Ebony Warrior"},
    "battle-of-the-champions": {"noGiver": True, "startsWith": [], "firstObjective": "Head to a major hold and await news from a courier"},
    # Bob's second look, 22 Oct (WO-121b Part 4).
    "vigilants": {"startsWith": ["Altano", "Orlando"], "where": "Windpeak Inn, Dawnstar", "firstObjective": "Join the Vigilants of Stendarr"},
    "discerning-the-transmundane": {"noGiver": True, "startsWith": [], "firstObjective": "Ask Urag about the insane book"},
    "saints-and-seducers": {"startsWith": ["Staada"], "firstObjective": "Enter the Asylum"},
    "sleepwalking-into-a-nightmare": {"startsWith": ["Ralforn"], "where": "Green-tip Cabin, northeast of Ivarstead", "firstObjective": "Find a way to escape The Nightmare."},
    "the-heart-of-dibella": {"noGiver": True, "startsWith": [], "firstObjective": "Enter the Temple of Dibella"},
    "heart-of-the-reach": {"startsWith": ["Gwilym"], "where": "Silver-Blood Inn, Markarth", "firstObjective": "Travel to Ever-Bog"},
    "capital-whiterun": {"noGiver": True, "startsWith": [], "firstObjective": "Read the Message"},
    # Bob's third look, 22 Oct, on the PC's traces.
    "mjoll": {"startsWith": ["Mjoll the Lioness"], "where": "with Aerin, Riften", "firstObjective": "Clear the dungeon with Aerin and Mjoll"},
}
# A row the key held for a quest the line no longer opens with, pointed at the line's opening (as Dawnguard's was).
REPOINT = {"DA14": "DA14Start"}


def row_of(judged, pages, names):
    """One answer-key row from a judged line, or None when its words can't be read."""
    says, opening = SAYS.match(judged["pageSays"]), OPENING.match(judged["opening"])
    if not says or not opening:
        return None
    edid, then = opening.group("edid") or opening.group("bare"), says.group("then").strip()
    page = (pages.get(edid) or {}).get("then") or ""
    if then.endswith("...") and page.startswith(then[:-3]):
        then = page
    out = {"quest": opening.group("name") or names.get(edid, edid), "editorId": edid, "line": judged["line"]}
    if judged["verdict"] == "NO_GIVER_OK":
        out["noGiver"] = True
        out["startsWith"] = []
    else:
        who, *where = [p.strip() for p in says.group("who").split(", ")]
        out["startsWith"] = [who]
        if where:
            out["where"] = ", ".join(where)
    out["firstObjective"] = then
    out["source"] = "uesp" if judged.get("url") else "records"
    if judged.get("url"):
        out["url"] = judged["url"]
    out["notes"] = f"Bob, 21 Oct, {judged['verdict']}: {judged['reason']}"
    return out


def main():
    with open(TRUTH, encoding="utf-8") as f:
        truth = json.load(f)
    with open(JUDGED, encoding="utf-8") as f:
        judged = json.load(f)["lines"]
    with open(QUESTS, encoding="utf-8") as f:
        quests = [q for l in json.load(f)["lines"] for q in l["quests"]]
    pages = {q["edid"]: q.get("start") or {} for q in quests}
    names = {q["edid"]: q["name"] for q in quests}
    for r in truth["quests"]:
        r["editorId"] = REPOINT.get(r["editorId"], r["editorId"])
    have = {r["editorId"].lower() for r in truth["quests"]}
    added, unread = 0, []
    for j in judged:
        if j["verdict"] not in ("CONFIRMED", "NO_GIVER_OK") and j["line"] not in FIXED:
            continue
        row = row_of(j, pages, names)
        if row and j["line"] in FIXED:
            row = {k: v for k, v in row.items() if k not in ("startsWith", "where", "noGiver", "firstObjective")}
            row = {**row, **FIXED[j["line"]]}
        if not row:
            unread.append(j["line"])
        elif row["editorId"].lower() not in have:
            truth["quests"].append(row)
            have.add(row["editorId"].lower())
            added += 1
    with open(TRUTH, "w", encoding="utf-8") as f:
        json.dump(truth, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"{added} judged openings added; {len(truth['quests'])} rows in the key" + (f"; couldn't read {', '.join(unread)}" if unread else ""))


if __name__ == "__main__":
    main()
