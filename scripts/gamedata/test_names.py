import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from names import deity_name  # noqa: E402


class DeityNameTest(unittest.TestCase):
    def test_the_tenets_record_names_the_deity(self):
        self.assertEqual(deity_name("Tenets of the All-Maker"), "The All-Maker")
        self.assertEqual(deity_name("Tenets of Akatosh"), "Akatosh")
        self.assertEqual(deity_name("Tenets of the HoonDing"), "The HoonDing")

    def test_totems_is_the_old_ways(self):
        import json

        raw = json.load(open(os.path.join(os.path.dirname(__file__), "..", "..", "gamedata", "5.0.4.8", "deities_raw.json")))
        totems = next(d for d in raw["deities"] if d["key"] == "Totems")
        self.assertEqual(deity_name(totems["tenets"]["name"]), "The Old Ways")


if __name__ == "__main__":
    unittest.main()
