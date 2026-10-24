"""
WO-145 Part 1: the XP budget's numbers against the built file.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import json
import os
import unittest

RAW = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "gamedata", "5.0.4.8", "xp.json")


@unittest.skipUnless(os.path.exists(RAW), "xp.json not built")
class BuiltXp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.d = json.load(open(RAW, encoding="utf-8"))

    def test_the_curve_matches_every_level_a_real_save_has_reached(self):
        # Measured, not assumed: 20 distinct levels across saves 1 to 372, every one fitting 25 * (level + 11).
        for e in self.d["curve"]["evidence"]:
            self.assertEqual(25 * (e["level"] + 11), e["lvlUpExp"], e)

    def test_quest_xp_matches_quest_pages_own_table(self):
        # quest_pages.py's QUEST_XP was typed in before this order existed; rechecked here against the file
        # itself, not assumed right because it looked plausible.
        q = self.d["questXp"]["values"]
        self.assertEqual(q["main"], 200)
        self.assertEqual(q["daedric"], 200)
        self.assertEqual(q["dawnguard"], 200)
        self.assertEqual(q["dragonborn"], 200)
        self.assertEqual(q["civilwar"], 150)
        self.assertEqual(q["side"], 100)
        self.assertEqual(q["misc"], 0)

    def test_clearing_varies_by_place_type_discovery_does_not(self):
        # A fort, a Nordic or Dwemer ruin, a dragon lair pay double to clear; discovery is flat at 10 for all.
        clear = self.d["clearXp"]["values"]
        self.assertEqual(clear["fort"], 200)
        self.assertEqual(clear["nordicruin"], 200)
        self.assertEqual(clear["cave"], 100)
        disc = self.d["discoveryXp"]["values"]
        self.assertTrue(all(v == 10 for v in disc.values()))

    def test_reading_and_raw_skill_use_pay_nothing(self):
        self.assertFalse(self.d["reading"]["enabled"])
        self.assertFalse(self.d["skillUse"]["enabled"])
        self.assertTrue(self.d["killing"]["enabled"])

    def test_crafting_matches_the_field_guides_own_numbers(self):
        c = self.d["crafting"]["values"]
        self.assertEqual(c["alchemyxp"], 5)
        self.assertEqual(c["enchantingxp"], 5)
        self.assertEqual(c["disenchantxp"], 5)
        self.assertEqual(c["miningxp"], 10)
        self.assertEqual(c["smithingxp"], 0)
        self.assertEqual(c["tanningxp"], 0)
        self.assertEqual(c["smeltingxp"], 0)
        self.assertEqual(c["cookingxp"], 0)

    def test_bard_and_scholar_match_the_orders_own_numbers(self):
        # WO-145's own "Bard 25 a song, 5 a day; Scholar 17 a book, 10 a day" -- the order's own stated facts,
        # read from the mod's GLOB records directly, not its source scripts' comments.
        bard = self.d["callings"]["Bard"]
        self.assertEqual((bard["XP"], bard["DailyLimit"]), (25, 5))
        scholar = self.d["callings"]["Scholar"]
        self.assertEqual((scholar["XP"], scholar["DailyLimit"]), (17, 10))

    def test_the_daily_cap_does_rise_with_the_callings_own_rank(self):
        # Correction to the order's own "whether the cap scales with level (today it doesn't)": it does scale,
        # with the calling's own internal rank (Journeyman, Master), a different progression from character
        # level, which this reader doesn't resolve -- flagged, not assumed either way.
        bard = self.d["callings"]["Bard"]
        self.assertLess(bard["DailyLimit"], bard["Daily_Journeyman"])
        self.assertLess(bard["Daily_Journeyman"], bard["Daily_Master"])

    def test_the_full_set_of_callings_is_thirteen_not_nine(self):
        # places.py's own docstring (Part 2) names nine; the mod's own GLOB records show four more (Wanderer,
        # Pilgrim, Cook, Alchemist) -- a real finding, not a guess, worth Mac's own Part 2 knowing about.
        self.assertEqual(len(self.d["callings"]), 13)
        for extra in ("Wanderer", "Pilgrim", "Cook", "Alchemist"):
            self.assertIn(extra, self.d["callings"])


if __name__ == "__main__":
    unittest.main()
