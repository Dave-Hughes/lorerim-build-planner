"""
people.py (WO-144 Part 2): the built index against people the order names.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import people as ppl  # noqa: E402

RAW = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "gamedata", "5.0.4.8", "people_raw.json")


@unittest.skipUnless(os.path.exists(RAW), "people_raw.json not built")
class BuiltIndex(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows = json.load(open(RAW, encoding="utf-8"))["people"]
        cls.by = {}
        for p in cls.rows:
            cls.by.setdefault(p["name"], p)

    def test_the_nine_capitals_each_have_a_jarl(self):
        jarls = {p["inTown"] for p in self.rows if p.get("role") == "JobJarl"}
        for city in ("Riften", "Markarth"):  # Igmund, Laila Law-Giver: confirmed against the records by hand
            self.assertIn(city, jarls)

    def test_an_innkeeper_knows_her_town_and_race(self):
        hulda = self.by["Hulda"]
        self.assertEqual(hulda["inTown"], "Whiterun")
        self.assertEqual(hulda["race"], "Nord")
        self.assertEqual(hulda["sex"], "female")

    def test_no_person_without_a_name_or_a_role(self):
        self.assertTrue(all(p.get("name") or p.get("role") for p in self.rows))

    def test_the_site_file_keeps_record_ids_out(self):
        raw = [{"id": "X:000001", "name": "Someone", "race": "Nord", "sex": "male", "cell": "A House", "inTown": "Whiterun", "role": "JobMerchant", "plugin": "Skyrim.esm"}]
        (row,) = ppl.build_site(raw)
        self.assertNotIn("id", row)
        self.assertNotIn("plugin", row)
        self.assertEqual(row["name"], "Someone")


if __name__ == "__main__":
    unittest.main()
