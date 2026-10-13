"""
enchantments.py: the planner's rows (WO-54): slots from worn restrictions, where it's learned,
and the runestone powers kept out.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import enchantments  # noqa: E402

RAW = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "gamedata", "5.0.4.8", "enchantments_raw.json")


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
