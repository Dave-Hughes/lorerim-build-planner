"""
powers.py: the dragon words, the skip list and the dedupe.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import powers  # noqa: E402


class DragonWords(unittest.TestCase):
    def test_digits_are_long_vowels(self):
        self.assertEqual([powers.dragon_word(w) for w in ["Fus", "Ro", "D4"]], ["Fus", "Ro", "Dah"])
        self.assertEqual(powers.dragon_word("T3d"), "Tiid")


class Skipped(unittest.TestCase):
    def test_exact_and_prefix(self):
        skip = ["Examine", "Dismiss …"]
        self.assertTrue(powers.skipped("Examine", skip))
        self.assertTrue(powers.skipped("Dismiss Follower", skip))
        self.assertFalse(powers.skipped("Examined", skip))


POWERS_JSON = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "src", "data", "lorerim-5.0.4.8", "powers.json")


class RacePowers(unittest.TestCase):
    """WO-55: each race's powers and passives; a race's power survives the name dedupe."""

    def test_a_race_power_stays_beside_another_with_its_name(self):
        raw = {
            "powers": [
                {"id": "Skyrim.esm:0AA01D", "name": "Night Eye", "kind": "Lesser power", "text": "Improved night vision for 8.5536e+06 seconds."},
                {"id": "Ordinator.esp:0BC4F9", "name": "Night Eye", "kind": "Lesser power", "text": "Improved night vision for 120 seconds."},
            ],
            "races": [{"race": "Khajiit", "spells": [
                {"id": "Skyrim.esm:0AA01D", "name": "Night Eye", "kind": "Lesser power", "text": "x"},
                {"id": "Skyrim.esm:0AA01E", "name": "Claws", "kind": "Ability", "text": "Unarmed attacks do more damage."},
            ]}],
        }
        out, _ = powers.build_powers(raw, {}, [])
        self.assertEqual(sorted(a["id"] for a in out["abilities"]), ["Ordinator.esp:0BC4F9", "Skyrim.esm:0AA01D"])
        self.assertEqual(out["fromRaces"]["Khajiit"], {"powers": ["Skyrim.esm:0AA01D"], "passives": [{"id": "Skyrim.esm:0AA01E", "name": "Claws", "text": "Unarmed attacks do more damage."}]})
        self.assertIn("Improved night vision for 99 days.", [a["text"] for a in out["abilities"]])

    def test_a_long_duration_reads_in_days(self):
        self.assertEqual(powers.readable_durations("for 8.64e+06 seconds"), "for 100 days")
        self.assertEqual(powers.readable_durations("for 120 seconds"), "for 120 seconds")

    def test_the_built_file(self):
        with open(POWERS_JSON, encoding="utf-8") as f:
            built = json.load(f)
        races = built["fromRaces"]
        self.assertEqual(len(races), 10)
        self.assertEqual(races["Khajiit"]["powers"], ["Skyrim.esm:0AA01D"])
        self.assertEqual([p["name"] for p in races["Altmer"]["passives"]], ["Weakness to Elements", "Highborn"])
        self.assertEqual(sorted(a["id"] for a in built["abilities"] if a["name"] == "Night Eye"), ["Ordinator - Perks of Skyrim.esp:0BC4F9", "Skyrim.esm:0AA01D"])


if __name__ == "__main__":
    unittest.main()
