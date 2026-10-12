"""
spells.py: the school and tier rule, the text filling and the repeat rule.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import spells  # noqa: E402
from build import clean, unmark  # noqa: E402


def effect(skill, min_skill, text="", name="", mag=0.0, dur=0, area=0):
    return {"skill": skill, "minSkill": min_skill, "text": text, "name": name, "mag": mag, "dur": dur, "area": area}


def spell(sid, name, effects, school=None, tier=None, tomes=1, order=None):
    s, t, _ = spells.school_and_tier(effects)
    return {"id": sid, "name": name, "school": school or s, "tier": tier or t, "cost": 10, "cast": "Fire and forget", "desc": "", "effects": effects,
            "tomes": [{"id": f"{sid}t{i}", "name": f"Spell Tome: {name}"} for i in range(tomes)], "order": order}


class SchoolAndTier(unittest.TestCase):
    def test_school_is_the_first_effects_skill(self):
        s, _, _ = spells.school_and_tier([effect("Destruction", 50), effect("Alteration", 0)])
        self.assertEqual(s, "Destruction")

    def test_tier_is_the_highest_minimum_skill_of_any_effect(self):
        self.assertEqual(spells.school_and_tier([effect("Destruction", 0), effect("Destruction", 75)])[1], "Expert")
        self.assertEqual(spells.school_and_tier([effect("Illusion", 100)])[1], "Master")
        self.assertEqual(spells.school_and_tier([effect("Illusion", 49)])[1], "Apprentice")
        self.assertEqual(spells.school_and_tier([])[:2], (None, "Novice"))


class Build(unittest.TestCase):
    def test_text_fills_tokens_and_drops_markers(self):
        e = effect("Destruction", 50, "Deals <mag> fire damage for <dur> seconds, <20> more on <Spirit> targets.", mag=40.0, dur=4)
        text, unknown = spells.fill_text(e["text"], e, {}, unmark)
        self.assertEqual(text, "Deals 40 fire damage for 4 seconds, 20 more on Spirit targets.")
        self.assertEqual(unknown, [])

    def test_an_unknown_global_leaves_out_its_sentence(self):
        e = effect("Conjuration", 0, "Summon a Gremlin for <dur> seconds. If offered, gains <Global=X>% to disarm.", dur=15)
        self.assertEqual(spells.fill_text(e["text"], e, {}, unmark), ("Summon a Gremlin for 15 seconds.", ["X"]))
        self.assertEqual(spells.fill_text(e["text"], e, {"X": 25.0}, unmark)[0], "Summon a Gremlin for 15 seconds. If offered, gains 25% to disarm.")

    def test_repeats_keep_the_later_one_in_the_load_order(self):
        raw = {"spells": [spell("A:1", "Flames", [effect("Destruction", 0, "x")], order=5), spell("B:1", "Flames", [effect("Destruction", 0, "y")], order=9)], "perkPicks": {}}
        data, _ = spells.build_spells(raw, set(), unmark, clean)
        self.assertEqual([s["id"] for s in data["spells"]], ["B:1"])

    def test_no_name_or_no_school_is_left_out(self):
        raw = {"spells": [spell("A:1", "", [effect("Destruction", 0, "x")]), spell("A:2", "Odd", [effect(None, 0, "x")])], "perkPicks": {}}
        self.assertEqual(spells.build_spells(raw, set(), unmark, clean)[0]["spells"], [])

    def test_pools_are_keyed_by_the_tier_perk(self):
        raw = {"spells": [spell("A:1", "Flames", [effect("Destruction", 0, "x")])], "perkPicks": {"Destruction Novice": {"spells": ["A:1", "Z:9"]}}, "picksPerPerk": {"Novice": 2}}
        data, _ = spells.build_spells(raw, {"Destruction:Novice Destruction"}, unmark, clean)
        self.assertEqual(data["spellPicks"], {"perTier": {"Novice": 2}, "pools": {"Destruction:Novice Destruction": ["A:1"]}})


if __name__ == "__main__":
    unittest.main()
