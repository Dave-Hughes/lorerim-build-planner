"""
WO-121: the planner's quest starts against an answer key, gamedata/<version>/quest_truth.json, which Bob
keeps by hand from UESP. For every row whose quest is in quests.json: the page's person (the quest's who,
else its first way's person, else its first step's person) is one of the row's startsWith, and its first
step (then) is the row's firstObjective, ignoring case and punctuation. A row where LoreRim's records really
differ is listed in DIFFERS with the reason and the record that shows it, never skipped silently.

Run:  python3 -m unittest scripts/gamedata/test_quest_truth.py   (or npm run test:gamedata)
"""
import json
import os
import re
import unittest

VERSION = "5.0.4.8"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TRUTH = os.path.join(ROOT, "gamedata", VERSION, "quest_truth.json")
QUESTS = os.path.join(ROOT, "src", "data", f"lorerim-{VERSION}", "quests.json")

# Rows the LoreRim records answer differently, each with why and the record that shows it.
DIFFERS: dict[str, str] = {
    'Caught Red Handed': "Bob, 21 Oct: who passes (Svana Far-Shield, INFO Skyrim.esm:041E0C). The first step is LoreRim's wording, 'Obtain a Mark of Dibella from Bolli, a Riften fisherman' (Skyrim.esm:041F91 through LoreRim - Dialogue Patch.esp and Caught Red Handed - Quest Expansion.esp).",
    'Spread the Love': "Bob, 21 Oct: who passes (Dinya Balu, INFO Skyrim.esm:053278). The first step carries the game's count, '(0/20)' (Skyrim.esm:053309).",
    'Dawnguard': "Bob, 21 Oct: the key now points at the line's opening, DLC1VQ01MiscObjective; Agmaer is one of UESP's ways in (LoreRim: level 30). Its first step is the game's full wording, 'Speak with the leader of the Dawnguard, located within Fort Dawnguard, which is southeast of Riften and inside of Dayspring Canyon.'",
    'The Taste of Death': "Bob, 21 Oct: the planner's quest is DA11, whose own first objective is the records' 'Clear the Draugr from Reachcliff Cave' (Skyrim.esm:02C358 QOBJ 10); UESP's 'Speak to Verulus' belongs to DA11Intro, the favor that leads into it.",
    'The Whispering Door': 'Bob, 21 Oct: the planner\'s quest is DA08, whose own first objective is "Find out what\'s wrong with Nelkir" (Skyrim.esm:04A37B QOBJ 10); UESP\'s first line is DA08RumorPointer\'s.',
    'Laid to Rest': "Bob, 21 Oct: same step in the game's own words, 'Talk to the Jarl of Morthal' (Skyrim.esm:025F3E QOBJ 20).",
    'The Only Cure': "Bob, 21 Oct: the planner's quest is DA13, whose first objective is the records' 'Obtain some Vampire Dust' (Skyrim.esm:08998D QOBJ 11); UESP's 'Find Kesh' is Da13Intro's.",
    'Lights Out!': 'Bob, 21 Oct: the game\'s own words, "Accept Jaree-Ra\'s offer in Solitude" (Skyrim.esm:023A64 QOBJ 10).',
    'Rise in the East': "Bob, 21 Oct: the game's own words, with the office named (Skyrim.esm:01DBFC QOBJ 10).",
    'Missing In Action': "Bob, 21 Oct: the game's own words, 'Meet Fralia at her home in the evening.' (Skyrim.esm:01CF26 QOBJ 10).",
    'Evil in Waiting': "Bob, 21 Oct: the game's own words with its count, 'Collect the Vessels (0/3)' (Skyrim.esm:03ED82 QOBJ 5).",
    'The Heart of Dibella': "Bob, 21 Oct: the records hold the early stages UESP's table lacks: 'Enter the Temple of Dibella' (Skyrim.esm:023B6C QOBJ 10), from the innkeeper's rumour, before Hamal catches you.",
    'Unearthed': "Bob, 21 Oct: the planner's quest is DLC2dunKolbjornQST, whose first objective is 'Fund the excavation' (Dragonborn.esm:01810B QOBJ 40); 'Speak to Ralis' belongs to its misc quest.",
    'Deathbrand': "Bob, 21 Oct: the planner's quest is DLC2dunHaknirTreasureQST, first objective 'Learn more about the buried treasure' (Dragonborn.esm:024002 QOBJ 29); UESP's first line is the misc quest's.",
}

# Rows that don't match yet, each sent back for a fix in WO-121a (Bob read them on 21 Oct), with what the records show. Each must still fail,
# so a fix that makes one pass says to take it out of here.
WAITING_ON_BOB: dict[str, str] = {
    'Blood on the Ice': "Bob, 21 Oct (reversed): the first step is wrong, not the records' wording. The guard's line sets stage 10, whose objective is 'Question the witnesses'; 'Get assistance from the authority figure' (QOBJ 1) is the stage-110 one. WO-121b's rule: then is the objective the starting line's stage shows. WO-121b Part 1 (Mac): rule 1 reads the objective the starting line's stage shows from the check's objectivesShown, which story_check.py now writes; it passes once the PC reruns the check.",
    'The Cursed Tribe': "Bob, 21 Oct (reversed): Chief Larak's letter line (The Cursed Tribe - Quest Expansion.esp) only fires for an Orc or Blood-Kin; for everyone else the level-up node starts it by itself and Atub asks at Largashbur. WO-121b's rule: a conditional starter is a way with its condition, not the giver. WO-121b Part 1 (Mac): Larak's letter line is a way with its race condition now, never the giver, and the page names no single giver; Atub isn't a starter in the check (no dialogue of his starts DA06), so the PC's check needs his line.",
    "A Night To Remember": "who: the start check's talks are Senna (Skyrim.esm:01F387), Senna (Skyrim.esm:0A95D5), Senna (Skyrim.esm:0A95CB); then: the records' first objective is 'Find Sam Guevenne' (Skyrim.esm:01BB9B QOBJ 10). WO-121a Part 1: the opening should be DA14Start, Sam Guevenne's drinking contest, but DA14Start isn't in quests_raw.json (the Mac has only the crawl), so the PC adds it to quests.py's crawl and then questlines.json's opening",
}


def norm(s):
    return re.sub(r"[^a-z0-9 ]", "", re.sub(r"^(a|an|the) ", "", (s or "").lower().strip())).strip()


def person_of(start):
    """The person the page names for how a quest starts: its who, else its first way's, else its first step's."""
    if start.get("who"):
        return start["who"]
    for w in start.get("ways", []):
        if w.get("who"):
            return w["who"]
    return start.get("thenWho")


def by_edid():
    with open(QUESTS, encoding="utf-8") as f:
        lines = json.load(f)["lines"]
    out = {}
    for line in lines:
        for q in line["quests"]:
            out.setdefault(q["edid"].lower(), q)
    return out


class QuestTruth(unittest.TestCase):
    def test_every_row_matches_or_is_listed(self):
        with open(TRUTH, encoding="utf-8") as f:
            truth = json.load(f)["quests"]
        quests = by_edid()
        wrong = []
        for row in truth:
            q = quests.get(row["editorId"].lower())
            if not q or row["quest"] in DIFFERS or row["quest"] in WAITING_ON_BOB:
                continue
            start = q.get("start") or {}
            who = person_of(start)
            if norm(who) not in {norm(s) for s in row["startsWith"]}:
                wrong.append(f"{row['quest']}: the page names {who or 'no one'}; UESP: {', '.join(row['startsWith'])}")
            if norm(start.get("then")) != norm(row["firstObjective"]):
                wrong.append(f"{row['quest']}: then is {start.get('then')!r}; UESP: {row['firstObjective']!r}")
        self.assertEqual(wrong, [], "\n".join(wrong))

    def test_waiting_rows_still_differ(self):
        with open(TRUTH, encoding="utf-8") as f:
            truth = {r["quest"]: r for r in json.load(f)["quests"]}
        quests = by_edid()
        passing = []
        for name in WAITING_ON_BOB:
            row = truth[name]
            start = (quests.get(row["editorId"].lower()) or {}).get("start") or {}
            if norm(person_of(start)) in {norm(s) for s in row["startsWith"]} and norm(start.get("then")) == norm(row["firstObjective"]):
                passing.append(name)
        self.assertEqual(passing, [], "These pass now: take them out of WAITING_ON_BOB.")

    def test_no_who_is_a_thing(self):
        things = re.compile(r"\b(claw|door|passage|marker|chest|book|note|letter|cell|xmarker|trigger)\b", re.IGNORECASE)
        bad = [f"{q['name']}: {q['start']['who']}" for q in by_edid().values() if (q.get("start") or {}).get("who") and things.search(q["start"]["who"])]
        self.assertEqual(bad, [], "\n".join(bad))

    def test_the_book_of_love(self):
        start = by_edid()["t02"]["start"]
        self.assertEqual(start.get("who"), "Dinya Balu")
        self.assertEqual(start.get("where"), "Temple of Mara")
        self.assertTrue(start["ways"][0]["how"].startswith('Ask Dinya Balu "Just tell me what to do." in Temple of Mara'), start["ways"])
        self.assertEqual((start.get("then"), start.get("thenWhere")), ("Talk to Fastred", "Fellstar Farm"))


if __name__ == "__main__":
    unittest.main()
