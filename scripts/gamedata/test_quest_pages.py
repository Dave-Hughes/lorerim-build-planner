"""quest_pages.py: the Quests pages' data rules (WO-100)."""
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


if __name__ == "__main__":
    unittest.main()
