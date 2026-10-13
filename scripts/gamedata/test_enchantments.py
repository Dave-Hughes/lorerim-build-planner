"""
enchantments.py: the text filling, and the committed file's shape.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import enchantments  # noqa: E402

RAW = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "gamedata", "5.0.4.8", "enchantments_raw.json")


class Fill(unittest.TestCase):
    def test_magnitude_and_duration(self):
        self.assertEqual(enchantments.fill("Absorbs <mag> magicka for <dur> seconds.", {"mag": 6.0, "dur": 1}), "Absorbs 6 magicka for 1 seconds.")

    def test_fixed_numbers_and_words_lose_their_brackets(self):
        e = {"mag": 9.0}
        self.assertEqual(enchantments.fill("Has <10>% chance to deal <mag> magical damage.", e), "Has 10% chance to deal 9 magical damage.")
        self.assertEqual(enchantments.fill("1 Arcane Runestone for a <single use> enchantment.", e), "1 Arcane Runestone for a single use enchantment.")

    def test_line_breaks_become_spaces(self):
        self.assertEqual(enchantments.fill("Deals <mag> damage.\r\n<1> Arcane Runestone.", {"mag": 10.0}), "Deals 10 damage. 1 Arcane Runestone.")


class CommittedFile(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(RAW, encoding="utf-8") as f:
            cls.raw = json.load(f)

    def test_one_per_name_and_kind(self):
        keys = [(r["name"], r["on"]) for r in self.raw["enchantments"]]
        self.assertEqual(len(keys), len(set(keys)))

    def test_every_enchantment_says_where_it_is_learned(self):
        for r in self.raw["enchantments"]:
            self.assertTrue(r["sources"], r["name"])
            self.assertIn(r["on"], ("weapon", "armor", "both"))

    def test_the_powers_teach_five_each(self):
        by = {}
        for r in self.raw["enchantments"]:
            for s in r["sources"]:
                if s["kind"] == "power":
                    by.setdefault(s["power"], []).append(r["name"])
        self.assertEqual({k: len(v) for k, v in by.items()}, {"Arcane Experimentation": 5, "Artificer's Insight": 5})

    def test_runestone_powers_name_their_perk(self):
        for r in self.raw["runestone"]:
            self.assertTrue(set(r["perks"]) <= {"Enchanting:Elemental Lore", "Enchanting:Corpus Lore"} and r["perks"], r["name"])


if __name__ == "__main__":
    unittest.main()
