"""quest_pages.py: the Quests pages' data rules (WO-100)."""
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import quest_pages as qp  # noqa: E402


class QuestPagesTest(unittest.TestCase):
    def test_source_names(self):
        self.assertEqual(qp.source_name("VIGILANT - English Translation (Plus Voiced Addon)"), "VIGILANT")
        self.assertEqual(qp.source_name("Meridia's Order ESMIFIED"), "Meridia's Order")
        self.assertEqual(qp.source_name("Undeath Remastered - CLEANED ESMIFIED"), "Undeath Remastered")
        self.assertEqual(qp.source_name("The Welkynar Knight - Quest"), "The Welkynar Knight")
        self.assertEqual(qp.source_name("Skyrim"), "Base game")
        self.assertEqual(qp.source_name("Creation Club"), "Creation Club")
        self.assertEqual(qp.source_name("Missives - Voice and Quest Expansion"), "Missives - Voice and Quest Expansion")

    def test_giver_is_a_person_with_a_place(self):
        where = [{"cellName": "The Bannered Mare", "location": "Whiterun"}]
        e = {"namedGiver": {"npc": "x", "name": "Lurius Liore", "where": where}, "people": [{"alias": "Lurius", "npcId": "x"}]}
        self.assertEqual(qp.giver_of(e), {"name": "Lurius Liore", "place": "The Bannered Mare, Whiterun"})
        # A person whose alias is their own name keeps their place on the page.
        e = {"namedGiver": {"npc": "m", "name": "Meridia", "where": []}, "people": [{"alias": "Meridia", "npcId": "m"}]}
        self.assertEqual(qp.giver_of(e), {"name": "Meridia"})

    def test_a_holding_cell_is_no_place(self):
        e = {"namedGiver": {"npc": "l", "name": "Lurius Liore", "where": [{"cellName": "Wyrmstooth Holder Cell", "location": "Wyrmstooth"}]}, "people": []}
        self.assertEqual(qp.giver_of(e), {"name": "Lurius Liore"})

    def test_roles_are_left_out(self):
        for role in ("Prisoner", "Courier", "Guard", "Bandit", "Necromancer"):
            e = {"namedGiver": {"npc": "c", "name": role, "where": [{"cellName": "Riverwood"}]}, "people": [{"alias": role, "npcId": "c"}]}
            self.assertIsNone(qp.giver_of(e), role)
        self.assertIsNone(qp.giver_of({"people": []}))
        self.assertIsNone(qp.giver_of(None))

    def test_gold_tiers(self):
        lst = lambda n: {"name": n, "type": "leveled list", "kind": "fragment"}  # noqa: E731
        self.assertEqual(qp.gold_tier([lst("LvlQuestReward01Small")]), "small")
        self.assertEqual(qp.gold_tier([lst("LvlQuestReward02Medium"), lst("LvlQuestReward03Large")]), "large")
        self.assertEqual(qp.gold_tier([{"name": "FavorRewardGoldLarge", "type": "leveled list", "kind": "quest script"}]), "large")
        # A plain Septim property alone isn't a reward tier.
        self.assertIsNone(qp.gold_tier([{"name": "Septim", "type": "gold", "kind": "quest script"}]))
        self.assertIsNone(qp.gold_tier([lst("_M_LItemRewardOreHigh")]))

    def test_items_are_weapons_and_armour_from_the_quests_own_records(self):
        rewards = [
            {"name": "Dawnbreaker", "type": "weapon", "kind": "alias"},
            {"name": "Ebony Mail", "type": "armour", "kind": "fragment"},
            {"name": "Skyforge Steel Greatsword", "type": "weapon", "kind": "quest script"},
            {"name": "Beast Form", "type": "spell", "kind": "fragment"},
            {"name": "A Book", "type": "book", "kind": "alias"},
            {"name": "LvlQuestReward02Medium", "type": "leveled list", "kind": "fragment"},
            {"name": "Dawnbreaker", "type": "weapon", "kind": "fragment"},
        ]
        self.assertEqual(qp.reward_items(rewards), ["Dawnbreaker", "Ebony Mail"])

    def test_xp_table(self):
        self.assertEqual(qp.xp_for("Main Quest"), 200)
        self.assertEqual(qp.xp_for("Daedric"), 200)
        self.assertEqual(qp.xp_for("Dawnguard"), 200)
        self.assertEqual(qp.xp_for("Dragonborn"), 200)
        self.assertEqual(qp.xp_for("Civil War"), 150)
        for t in ("Side Quest", "Mages Guild", "Thieves Guild", "Dark Brotherhood", "Companions"):
            self.assertEqual(qp.xp_for(t), 100, t)
        self.assertEqual(qp.xp_for("Misc"), 0)
        self.assertEqual(qp.xp_for(None), 0)

    def test_journal_in_stage_order(self):
        q = {"stages": [{"index": 20, "log": ["Second."]}, {"index": 10, "log": ["First."]}, {"index": 30, "log": []}]}
        self.assertEqual(qp.journal(q), ["First.", "Second."])

    def test_only_instructions_read_from_the_files_show(self):
        line = {"id": "l", "name": "L", "category": "lands", "sources": [{"name": "Skyrim", "modid": None}],
                "opening": "Q", "quests": [], "after": ["college", "main-quest"],
                "start": "Walk in.", "gate": "Level 25.", "minLevel": 25, "size": "1 hour", "note": "Trapped.",
                "checked": {"start": "mod page", "gate": "mod page", "size": "mod page", "note": "files"}}
        out = qp.build_quests([line], [], [])[0]
        self.assertNotIn("start", out)
        self.assertNotIn("gate", out)
        self.assertNotIn("minLevel", out)
        self.assertEqual(out["after"], ["main-quest"])
        self.assertEqual((out["size"], out["note"]), ("1 hour", "Trapped."))
        self.assertEqual(out["checked"], {"size": "mod page", "note": "files"})



RAW = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "gamedata", "5.0.4.8", "quests_raw.json")


class EndingsTest(unittest.TestCase):
    """WO-115: each quest's stages and how it can end, on three quests from the records and the shape quests.py now writes."""

    @classmethod
    def setUpClass(cls):
        with open(RAW, encoding="utf-8") as f:
            cls.raw = {q["edid"]: q for q in json.load(f)["quests"]}

    def endings(self, edid):
        return qp.endings_of(qp.stages_of(self.raw[edid]))

    def test_blood_on_the_ice_ends_two_ways(self):
        ends = self.endings("MS11")
        self.assertEqual([(e["stage"], e.get("completes")) for e in ends], [(100, True), (250, True)])
        self.assertIn("Wuunferth the Unliving was the Butcher of Windhelm", ends[0]["text"])
        self.assertIn("Calixto Corrium was the Butcher of Windhelm", ends[1]["text"])
        # Each says when it happens: stage 100 has no condition in the records; 250's shows only if 100 isn't done.
        self.assertEqual([e["when"] for e in ends], ["the quest reaches stage 100", "the quest reaches stage 250, if stage 100 of this quest not done"])

    def test_innocence_lost_ends_with_grelod_dead_either_way(self):
        ends = self.endings("DB01")
        self.assertEqual([e["stage"] for e in ends], [199, 200])
        self.assertTrue(ends[1]["text"].startswith("I killed Grelod the Kind"))
        # Stage 201 repeats 199's words but doesn't end the quest.
        stages = {st["index"]: st for st in qp.stages_of(self.raw["DB01"])}
        self.assertEqual(stages[201]["log"], [{"text": stages[199]["log"][0]["text"]}])

    def test_a_quest_with_no_ending_in_its_records(self):
        self.assertEqual(self.endings("FreeformRiften11"), [])
        self.assertEqual(qp.stages_of(self.raw["FreeformRiften11"]), [])

    def test_entries_from_quests_py_keep_their_own_flags_and_when(self):
        q = {"stages": [
            {"index": 200, "log": ["Kept.", "Refused."], "completes": True, "fails": True,
             "entries": [{"text": "Kept.", "completes": True}, {"text": "Refused.", "fails": True, "conditions": [{"fn": "GetStageDone"}], "when": "Stage 20 of this quest done"}]},
            {"index": 10, "log": ["Begun."], "entries": [{"text": "Begun."}]},
            {"index": 255, "entries": [{"text": "", "completes": True}]},
        ]}
        stages = qp.stages_of(q)
        self.assertEqual([st["index"] for st in stages], [10, 200, 255])
        self.assertEqual(stages[1]["log"][1], {"text": "Refused.", "fails": True, "when": "Stage 20 of this quest done"})
        self.assertEqual(qp.endings_of(stages), [
            {"stage": 200, "text": "Kept.", "completes": True, "when": "the quest reaches stage 200"},
            {"stage": 200, "text": "Refused.", "fails": True, "when": "the quest reaches stage 200, if stage 20 of this quest done"},
            {"stage": 255, "text": "", "completes": True, "when": "the quest reaches stage 255"},
        ])

    def test_every_quest_on_the_pages_has_endings(self):
        line = {"id": "l", "name": "L", "category": "lands", "sources": [{"name": "Skyrim"}], "opening": "MS11",
                "quests": [{"id": self.raw[e]["id"]} for e in ("MS11", "DB01", "FreeformRiften11")], "checked": {}}
        out = qp.build_quests([line], list(self.raw.values()), [])[0]["quests"]
        self.assertEqual([len(q["endings"]) for q in out], [2, 2, 0])
        self.assertEqual(out[0]["journal"], qp.fill_all(qp.journal(self.raw["MS11"]), self.raw["MS11"].get("fills", {}), {}))


class TagsTest(unittest.TestCase):
    """WO-115: the game's text tags filled from the records, or plain words where the records don't say."""

    def test_fills_globals_dates_and_plain_words(self):
        fills = {"<Alias=Questgiver>": "Commander Maro", "<Alias.PronounObj=Target>": "her"}
        g = {"roomcost": 25.0}
        self.assertEqual(qp.fill_text("Return to <Alias=Questgiver>", fills, g), "Return to Commander Maro")
        self.assertEqual(qp.fill_text("Kill <Alias.PronounObj=Target> and <Alias.Pronoun=Other>", fills, g), "Kill her and they")
        self.assertEqual(qp.fill_text("Rent a room (<Global=RoomCost> gold)", fills, g), "Rent a room (25 gold)")
        self.assertEqual(qp.fill_text("Deliver <Alias=Item> by <Global.Day=D> of <Global.MonthWord=D>", {}, g), "Deliver the item by the set date")
        self.assertEqual(qp.fill_text("<alias=item>", {}, g), "The item")
        self.assertEqual(qp.fill_text("Kill the <Alias=Beast>", {}, g), "Kill the beast")
        self.assertEqual(qp.fill_text("Deliver <Alias=Item by noon", {}, g), "Deliver the item by noon")  # never closed in the record
        self.assertEqual(qp.fill_text("Find <Alias=MS11TargetLocation>", {}, g), "Find the target location")

    def test_every_string_in_a_quest(self):
        out = qp.fill_all({"objectives": ["Find <Alias=Item>"], "start": {"needs": ["Pay <Global=Cost> gold"]}, "xp": 100}, {}, {"cost": 10})
        self.assertEqual(out, {"objectives": ["Find the item"], "start": {"needs": ["Pay 10 gold"]}, "xp": 100})


class StartTest(unittest.TestCase):
    """WO-115 Part 2: a quest's checked start from its story_check row, in plain words."""

    def test_start_game_quest_points_at_its_giver(self):
        row = {"name": "Take Up Arms", "startedBy": [{"by": "start game"}, {"by": "dialogue", "speaker": "Aela", "prompt": "Can I join?"}],
               "target": [{"holds": [{"name": "Kodlak Whitemane", "where": ["Jorrvaskr"]}]}], "firstObjective": {"text": "Speak to Kodlak Whitemane"},
               "needs": {"conditions": None, "doors": []}}
        self.assertEqual(qp.start_of(row, {}), {"needs": [], "who": "Kodlak Whitemane", "where": "Jorrvaskr", "task": "Speak to Kodlak Whitemane", "checked": "files"})

    def test_ways_in_with_their_needs(self):
        node = {"by": "story manager", "event": "change location", "conditions": "Laid to Rest completed; level >= DLC1VQMinLevel (now 30); Dawnguard stage < 10; fn576 == 1"}
        helper = {"by": "quest script", "quest": "DLC1VQ00ChangeLocation, a helper quest", "throughStartedBy": [node]}
        talk = {"by": "dialogue", "speaker": "Agmaer", "speakerPlaced": ["Fort Dawnguard"], "conditions": "the speaker is Agmaer"}
        row = {"name": "Dawnguard", "startedBy": [helper, talk], "target": [], "needs": {"conditions": None, "doors": []}}
        start = qp.start_of(row, {})
        self.assertEqual(start["ways"][0], {"how": "Through DLC1VQ00ChangeLocation, which starts from: It starts by itself on change location",
                                            "needs": ["Laid to Rest completed", "Level 30", "a condition the start check can't name yet (fn576 == 1)"]})
        self.assertEqual(start["ways"][1], {"how": "Talk to Agmaer in Fort Dawnguard"})
        self.assertEqual((start["who"], start["checked"]), ("Agmaer", "files"))

    def test_earlier_quest_and_untraced(self):
        row = {"name": "Proving Honor", "startedBy": [{"by": "quest script", "quest": "C00 (Take Up Arms)", "atStage": 200}], "target": [], "needs": {"conditions": "level >= 5"}}
        self.assertEqual(qp.start_of(row, {"C00": "Take Up Arms"})["needs"], ["After Take Up Arms (its stage 200)", "Level 5"])
        self.assertEqual(qp.start_of({"name": "X", "startedBy": [], "unread": "no starter"}, {})["checked"], "not yet")
        self.assertEqual(qp.start_of(None, {}), {"checked": "not yet"})
        stuck = {"name": "X", "startedBy": [{"by": "quest script", "quest": "Helper, a helper quest", "throughStartedBy": []}], "target": [], "needs": {}}
        self.assertEqual(qp.start_of(stuck, {})["checked"], "not yet")


if __name__ == "__main__":
    unittest.main()
