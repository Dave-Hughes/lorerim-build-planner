"""
enchantments.py: the text filling, the committed file's shape, and the planner's rows (WO-54).
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


# The planner's rows (WO-54): slots from worn restrictions, where it's learned, runestones kept out.
def ench(eid, name, on, restrictions=(), sources=None, **extra):
    return {"id": eid, "name": name, "on": on, "text": f"{name}.", "wornRestrictions": list(restrictions),
            "sources": sources if sources is not None else [{"kind": "item", "count": 1, "examples": ["Thing"]}], **extra}


class BuildEnchantments(unittest.TestCase):
    def test_worn_restrictions_become_the_planners_slots(self):
        rows = enchantments.build_enchantments({"enchantments": [
            ench("A:1", "Fortify Magicka", "armor", ["ArmorGauntlets", "ClothingHands", "ArmorHelmet", "ClothingCirclet", "ClothingNecklace", "ClothingRing"]),
            ench("A:2", "Resist Fire", "armor", ["ArmorCuirass", "ClothingBody", "ArmorBoots", "ClothingFeet", "ArmorShield"]),
        ]})
        self.assertEqual({r["name"]: r["slots"] for r in rows}, {"Fortify Magicka": ["Head", "Hands", "Ring", "Amulet"], "Resist Fire": ["Body", "Feet", "Shield"]})

    def test_no_restriction_means_every_armour_slot_and_weapons_have_none(self):
        rows = {r["name"]: r for r in enchantments.build_enchantments({"enchantments": [ench("A:1", "Blessing", "armor"), ench("A:2", "Fire", "weapon")]})}
        self.assertEqual(rows["Blessing"]["slots"], ["Head", "Body", "Hands", "Feet", "Shield", "Ring", "Amulet"])
        self.assertEqual(rows["Fire"]["slots"], [])

    def test_learned_reads_as_players_say_it(self):
        item = {"kind": "item", "count": 102, "examples": ["Ring of Eminent Health", "Necklace of Eminent Health", "Third"]}
        power = {"kind": "power", "power": "Arcane Experimentation", "perk": "Enchanting:Arcane Experimentation"}
        rows = {r["name"]: r for r in enchantments.build_enchantments({"enchantments": [ench("A:1", "Fortify Health", "armor", sources=[item]), ench("A:2", "Fireburst", "weapon", sources=[power])]})}
        self.assertEqual(rows["Fortify Health"]["learned"], "Disenchant: Ring of Eminent Health, Necklace of Eminent Health and 100 more")
        self.assertNotIn("powers", rows["Fortify Health"])
        self.assertEqual((rows["Fireburst"]["learned"], rows["Fireburst"]["powers"]), ("The Arcane Experimentation power", ["Enchanting:Arcane Experimentation"]))

    def test_no_runestone_power_reaches_the_planner(self):
        with open(RAW, encoding="utf-8") as f:
            raw = json.load(f)
        rows = enchantments.build_enchantments(raw)
        ids = {r["id"] for r in rows} | {i for r in rows for i in r.get("sameAs", [])}
        for rune in raw["runestone"]:
            self.assertNotIn(rune["enchantment"], ids, rune["name"])
            self.assertNotIn(rune["name"], {r["name"] for r in rows})
        self.assertEqual(len(rows), 88)


if __name__ == "__main__":
    unittest.main()
