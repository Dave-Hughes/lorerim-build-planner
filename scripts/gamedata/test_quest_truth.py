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
    'The Taste of Death': "Bob, 21 Oct: the planner's quest is DA11, whose own first objective is the records' 'Clear the Draugr from Reachcliff Cave' (Skyrim.esm:02C358 QOBJ 10); UESP's 'Speak to Verulus' belongs to DA11Intro, the favor that leads into it.",
    'The Whispering Door': 'Bob, 21 Oct: the planner\'s quest is DA08, whose own first objective is "Find out what\'s wrong with Nelkir" (Skyrim.esm:04A37B QOBJ 10); UESP\'s first line is DA08RumorPointer\'s.',
    'Laid to Rest': "Bob, 21 Oct: same step in the game's own words, 'Talk to the Jarl of Morthal' (Skyrim.esm:025F3E QOBJ 20).",
    'The Only Cure': "Bob, 21 Oct: the planner's quest is DA13, whose first objective is the records' 'Obtain some Vampire Dust' (Skyrim.esm:08998D QOBJ 11); UESP's 'Find Kesh' is Da13Intro's.",
    'Lights Out!': 'Bob, 21 Oct: the game\'s own words, "Accept Jaree-Ra\'s offer in Solitude" (Skyrim.esm:023A64 QOBJ 10).',
    'Rise in the East': "Bob, 21 Oct: the game's own words, with the office named (Skyrim.esm:01DBFC QOBJ 10).",
    'Missing In Action': "Bob, 21 Oct: the game's own words, 'Meet Fralia at her home in the evening.' (Skyrim.esm:01CF26 QOBJ 10).",
    'Evil in Waiting': "Bob, 21 Oct: the game's own words with its count, 'Collect the Vessels (0/3)' (Skyrim.esm:03ED82 QOBJ 5).",
    'Ancestral Worship': "Bob, 21 Oct: the records show '(Optional) Protect Golldir' (QOBJ 5) and 'Defeat Vals Veran' at the same stage; either is the first step.",
    'The Cursed Tribe': "Bob, 21 Oct: LoreRim's The Cursed Tribe - Quest Expansion.esp adds a letter from Largashbur as the first step and Chief Larak's talk (The Cursed Tribe - Quest Expansion.esp:000089); the records win over vanilla UESP.",
    'The Heart of Dibella': "Bob, 21 Oct: the records hold the early stages UESP's table lacks: 'Enter the Temple of Dibella' (Skyrim.esm:023B6C QOBJ 10), from the innkeeper's rumour, before Hamal catches you.",
    'Unearthed': "Bob, 21 Oct: the planner's quest is DLC2dunKolbjornQST, whose first objective is 'Fund the excavation' (Dragonborn.esm:01810B QOBJ 40); 'Speak to Ralis' belongs to its misc quest.",
    'Deathbrand': "Bob, 21 Oct: the planner's quest is DLC2dunHaknirTreasureQST, first objective 'Learn more about the buried treasure' (Dragonborn.esm:024002 QOBJ 29); UESP's first line is the misc quest's.",
}

# Rows that don't match yet, each sent back for a fix in WO-121a (Bob read them on 21 Oct). What the records show: Each must still fail,
# so a fix that makes one pass says to take it out of here.
WAITING_ON_BOB: dict[str, str] = {
    "First Lessons": "who: the start check's talks are Nirya (Skyrim.esm:0DF034)",
    "Waking Nightmare": "who: the start check's talks are Brina Merilis (Skyrim.esm:087906), Skald the Elder (Skyrim.esm:087907), Madena (Skyrim.esm:087909), Rustleif (Skyrim.esm:08790A), Leigelf (Skyrim.esm:08790B), Frida (Skyrim.esm:08790D), Beitild (Skyrim.esm:08790E)",
    "A Night To Remember": "who: the start check's talks are Senna (Skyrim.esm:01F387), Senna (Skyrim.esm:0A95D5), Senna (Skyrim.esm:0A95CB); then: the records' first objective is 'Find Sam Guevenne' (Skyrim.esm:01BB9B QOBJ 10); UESP's is not one of this quest’s objectives",
    "Blood on the Ice": "who: the start check's talks are none (no dialogue starter found); then: the records' first objective is 'Get assistance from the authority figure' (Skyrim.esm:01F7A3 QOBJ 1); UESP's is a later one of its objectives",
    "Dark Ancestor": "then: the records' first objective is 'Tell Dengeir that Vighar is dead' (Skyrim.esm:0B83C3 QOBJ 20); UESP's is not one of this quest’s objectives",
    "Dawnguard": "who: the start check's talks are Vigilant Tolan (Dawnguard.esm:019AAB), Vigilant Tolan (Dawnguard.esm:01A1B4); then: the records' first objective is 'Find out what the vampires are seeking' (Dawnguard.esm:00352A QOBJ 30); UESP's is not one of this quest’s objectives",
    "Caught Red Handed": "who: the start check's talks are none (no dialogue starter found); then: the records' first objective is None; UESP's is not one of this quest’s objectives",
    "Spread the Love": "who: the start check's talks are none (no dialogue starter found); then: the records' first objective is None; UESP's is not one of this quest’s objectives",
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
