"""
WO-138 Part 4 (Mac, 23 Oct): Bob's rulings in Part 3 as rules, each tested on the quests he named, on the built pages.
R2 and R3 (a line is a step, not a way in), R4 (books worded with their prerequisite), G1 (the dispatcher; sentBy), G2
("After <quest>", no giver), G4 (no way names no one), G5 (handlers off the pages), G6 (no shell is a way), the Civil War's
radiant class, and Rex's notes. The quests' own key rows are in test_quest_truth.py.

Run:  python3 -m unittest scripts/gamedata/test_wo138.py   (or npm run test:gamedata)
"""
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import quest_pages as qp  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
QUESTS = os.path.join(ROOT, "src", "data", "lorerim-5.0.4.8", "quests.json")


class Pages(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(QUESTS, encoding="utf-8") as f:
            cls.lines = {l["id"]: l for l in json.load(f)["lines"]}
        cls.by = {q["edid"]: q for l in cls.lines.values() for q in l["quests"]}

    def start(self, edid):
        return self.by[edid]["start"]

    def ways(self, edid):
        return [w["how"] for w in self.start(edid).get("ways", [])]


class R2R3(Pages):
    def test_a_line_whose_stage_another_way_sets_is_a_step(self):
        # A Night To Remember: Sam's contest sets stage 5; Senna's lines need it, so they're steps.
        self.assertEqual(self.ways("DA14"), ["After Participate in a drinking contest with Sam Guevenne"])
        self.assertNotIn("who", self.start("DA14"))

    def test_a_handlers_stage_is_r1_and_the_talk_stays(self):
        # Thieves Guild Caravan Fence: TGStatus, a handler, sets 10; Tonilia's offer is the way in (R1).
        self.assertEqual(self.start("TGFenceCaravan")["who"], "Tonilia")

    def test_one_speakers_higher_stages_are_steps(self):
        # Bad Vibrations: the lines at 30 and later go; Inigo's 10 stays.
        self.assertFalse(any("Hopefully it doesn't happen again" in w for w in self.ways("InigoBadVibrations")))

    def test_one_moment_is_one_way(self):
        # Fists of Fury: Maul's four lines are one way; Reparations: three speakers with one line are one way.
        self.assertEqual(len(self.ways("FOFRiftenBrawlerQuest")), 1)
        self.assertEqual(self.ways("TGBan"), ['Ask Mercer Frey, Brynjolf or Delvin Mallory "What have I done wrong?"'])

    def test_the_rules_on_made_up_starters(self):
        node = {"by": "quest script", "quest": "DA14Start", "call": "SetStage 5"}
        senna = {"by": "dialogue", "speaker": "Senna", "call": "SetStage 10", "conditions": "A Night To Remember stage == 5"}
        self.assertEqual(qp.steps_not_ways([node, senna], "A Night To Remember", "DA14"), [node])
        low = {"by": "dialogue", "speaker": "Inigo", "call": "SetStage 20", "conditions": "Bad Vibrations stage == 10"}
        high = {"by": "dialogue", "speaker": "Inigo", "call": "SetStage 40", "conditions": "Bad Vibrations stage == 30"}
        self.assertEqual(qp.steps_not_ways([low, high], "Bad Vibrations", "InigoBadVibrations"), [low])


class R4(Pages):
    def test_books_say_their_prerequisite(self):
        self.assertIn("After The Oblivion Engine has begun, read Letter to Lucien", self.ways("JRLucienPersonal1"))
        for edid, book in (("WTWolfFollower", "Dunyick's Request"), ("WTPricelessCommodity", "Miner's Warning"), ("WTTheNakedNord", "Ja'Shavi-Dar's Note")):
            self.assertIn(f"On Wyrmstooth, read {book}", self.ways(edid))


class G1(Pages):
    def test_the_radiant_jobs_name_their_dispatcher(self):
        self.assertEqual(self.start("CR01")["who"], "Aela the Huntress")  # the node's event, CRAela
        self.assertEqual(self.start("CR08")["who"], "Vilkas")  # both nodes need CRVilkas (DIFFERS: UESP adds Skjor)
        self.assertEqual(self.start("TGRBE")["who"], "Vex")
        self.assertEqual(self.start("TGRFO")["who"], "Delvin Mallory")
        self.assertEqual(self.start("FreeformRiften06")["who"], "Talen-Jei")  # runs from the game's start; her talk is the way

    def test_a_job_several_hand_out_has_no_single_giver(self):
        self.assertNotIn("who", self.start("Favor104"))
        self.assertTrue(any(w.startswith("Ask Ahtar or Annekke Crag-Jumper") for w in self.ways("Favor104")))
        self.assertEqual(self.start("FreeformKolskeggrA")["who"], "Pavo Attius")  # two people in their own right: the records' giver

    def test_a_quest_running_from_the_start_with_its_objective_showing_has_no_giver(self):
        self.assertNotIn("who", self.start("00TallyMeet"))

    def test_its_own_lines_name_the_giver_first(self):
        named = [w["who"] for w in self.start("DB04")["ways"] if w.get("who")]
        self.assertEqual(named[0], "Astrid")  # before Muiri, whose talk sets Mourning Never Comes' stage


class G2(Pages):
    def test_after_the_quest_before_with_sent_by(self):
        for edid, after, sent in (("TG03", "After Loud and Clear", "Brynjolf"), ("CW02A", "After Joining the Legion", "General Tullius"), ("MG05", "After Revealing the Unseen", "Mirabelle Ervine")):
            st = self.start(edid)
            self.assertNotIn("who", st, edid)
            self.assertIn(after, self.ways(edid))
            self.assertEqual(st["sentBy"], sent)

    def test_an_offer_that_ends_nothing_is_still_the_way_in(self):
        self.assertEqual(self.start("CW01A")["who"], "Legate Rikke")
        self.assertEqual(self.start("CW01B")["who"], "Galmar Stone-Fist")

    def test_a_line_after_the_quest_ended_counts_as_its_ending(self):
        self.assertIn("After Caught in the Rain", self.ways("ccBGSSSE001_Fish_MQ3"))


class G4(Pages):
    def test_no_way_names_no_one_where_the_records_name_them(self):
        for edid in ("MQ302", "MS11b", "CW00A", "BQ01", "Favor250", "FavorJarlsMakeFriends", "DA14", "MGR21", "CWMission03"):
            self.assertFalse(any("records don't name" in w for w in self.ways(edid)), edid)

    def test_roles_from_the_alias(self):
        self.assertIn("Ask a jarl's steward or an innkeeper \"I'm looking for work. Got any leads?\"", self.ways("BQ01"))
        self.assertTrue(any(w.startswith("Ask the jarl of the Reach") for w in self.ways("Favor250")))
        # A Civil War mission: the side's commander, either side (Legate Rikke or Galmar Stone-Fist).
        self.assertEqual([w.get("who") for w in self.start("CWMission03")["ways"][:2]], ["Legate Rikke", "Galmar Stone-Fist"])
        self.assertEqual(self.start("MGR21")["who"], "Urag gro-Shub")


class G5G6(Pages):
    def test_handlers_are_off_the_pages(self):
        for edid in ("DLC1Radiant", "DLC1VQ05SoulGemHandler", "TG00MiscHandler", "TG03SP", "TG04EECHandler", "TG04Post", "TGCrownMisc", "DLC2MHMisc", "DialogueCidhnaMine"):
            self.assertNotIn(edid, self.by)

    def test_no_shell_or_handler_is_a_way(self):
        every = [w for q in self.by.values() for w in [*(x["how"] for x in q["start"].get("ways", [])), *q["start"].get("needs", [])]]
        self.assertFalse([w for w in every if "Radiant Shell" in w or "Scripted Scene Bridge" in w or "Insights Rewards" in w])


class CivilWarClass(Pages):
    def test_the_radiant_templates_are_one_class(self):
        cw = self.lines["civil-war"]
        self.assertEqual(cw["radiant"], {"name": "The war's radiant jobs", "says": "The war's radiant jobs: fort sieges, city battles, rescues; each is handed out by your side's commander.", "checked": "files", "jobs": 7})
        names = {q["name"] for q in cw["quests"]}
        self.assertFalse(names & {"The Battle for the fort", "The name location", "Attack the capital", "Defend the capital", "Battle for the city", "Rescue from the attack point"})


class RexNotes(Pages):
    def test_the_cause_says_the_courier_and_the_level(self):
        st = self.start("ccBGSSSE067_Quest")
        self.assertTrue(st["ways"][0]["how"].startswith("A courier brings you Stranger's Plea"))
        self.assertEqual(st["ways"][0]["needs"], ["Level 46"])

    def test_a_place_names_its_town_once(self):
        self.assertEqual(qp.clean_place("Shaman's Hut, Skaal Village Shaman's Hut"), "Shaman's Hut, Skaal Village")
        self.assertEqual(qp.clean_place("Clan Hammer-Shield, Home of Clan Hammer-Shield"), "Clan Hammer-Shield, Home of Clan Hammer-Shield")


if __name__ == "__main__":
    unittest.main()
