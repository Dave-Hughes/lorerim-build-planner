"""
places.py (WO-128 Part 1): the readers on made-up records, and the built index against the places the order names.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import collections
import json
import os
import struct
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import places as pl  # noqa: E402

RAW = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "gamedata", "5.0.4.8", "places_raw.json")


class Readers(unittest.TestCase):
    def test_an_actors_level(self):
        fixed = struct.pack("<IhhhHHHhHhh", 0, 0, 0, 12, 0, 0, 100, 0, 0, 0, 0)
        self.assertEqual(pl.npc_level(fixed), (12, None, 0))
        scaled = struct.pack("<IhhhHHHhHhh", 0x80, 0, 0, 1000, 5, 30, 100, 0, 2, 0, 0)
        self.assertEqual(pl.npc_level(scaled), (None, (1.0, 5, 30), 2))

    def test_levels_through_templates_and_lists(self):
        npcs = {"A": {"name": "Boss", "level": 1, "scaled": None, "useStats": True, "template": "L"},
                "B": {"name": None, "level": 20, "scaled": None, "useStats": False, "template": None}}
        lvln = {"L": {"edid": "LCharBanditBoss", "entries": [(1, "B"), (9, "B"), (24, "B")]}}
        self.assertEqual(pl.level_of("A", npcs, lvln), (1, 24, "leveled 1-24"))  # uses the template's stats, not its own level 1
        self.assertEqual(pl.level_of("B", npcs, lvln), (20, 20, "level 20"))

    def test_the_site_file_keeps_record_and_editor_ids_out(self):
        raw = [{"id": "X:000001", "name": "Some Cave", "type": "Cave", "edid": "SomeCaveLocation", "keywords": ["LocTypeCave"],
                "pointers": [{"kind": "dialogue", "speaker": "Gerdur", "words": "Some Cave is up the hill.", "quest": "EGD_DialogueGuardsGeneral",
                              "record": "INFO Skyrim.esm:000002 (Extended Guard Dialogue.esp)"}],
                "quests": [{"quest": "Lost Legacy", "id": "Q"}, {"quest": "Lost Legacy", "id": "Q2"}]}]
        (row,) = pl.build_site(raw)
        self.assertNotIn("edid", row)
        self.assertEqual(row["pointers"], [{"kind": "dialogue", "speaker": "Gerdur", "words": "Some Cave is up the hill.", "from": "Extended Guard Dialogue.esp"}])
        self.assertEqual(row["quests"], ["Lost Legacy"])


@unittest.skipUnless(os.path.exists(RAW), "places_raw.json not built")
class BuiltIndex(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows = json.load(open(RAW, encoding="utf-8"))["places"]
        cls.by = {}
        for p in cls.rows:
            cls.by.setdefault(p["name"], p)

    def test_embershard_mine_by_riverwood_with_its_pointer(self):
        mine = self.by["Embershard Mine"]
        self.assertEqual((mine["type"], mine["nearestTown"]["town"]), ("Mine", "Riverwood"))
        self.assertTrue(any("Embershard Mine" in p["words"] and "criminals" in p["words"] for p in mine["pointers"]))

    def test_bleak_falls_barrow_is_the_golden_claws(self):
        barrow = self.by["Bleak Falls Barrow"]
        self.assertIn("The Golden Claw", {q["quest"] for q in barrow["quests"]})
        self.assertEqual(barrow["clearXp"], 200)  # a Nordic ruin, by LoreRim's Experience settings

    def test_geirmunds_hall_and_who_names_it(self):
        hall = self.by["Geirmund's Hall"]
        self.assertEqual(hall["nearestTown"]["town"], "Ivarstead")
        self.assertIn(("Wilhelm", "Vilemyr Inn"), {(p.get("speaker"), p.get("speakerPlace")) for p in hall["pointers"]})

    def test_no_town_and_every_pointer_has_its_record(self):
        self.assertFalse([p["name"] for p in self.rows if p["type"] in pl.NOT_PLACES])
        self.assertTrue(all(x["record"] for p in self.rows for x in p.get("pointers", [])))
        self.assertGreater(len({p["plugin"] for p in self.rows}), 20)  # across the load order, not only the base game

    def test_nearest_town_and_city_are_never_a_mislabelled_marker(self):
        # WO-144 Part 1: a marker's TNAM type is unreliable here (the nine capitals all carry the wrong one); only a
        # name in CAPITALS or SETTLEMENTS is ever trusted as a town, so "Wintersand Manor" and friends can't stand in.
        towns = {p["nearestTown"]["town"] for p in self.rows if p.get("nearestTown")}
        cities = {p["nearestCity"]["town"] for p in self.rows if p.get("nearestCity")}
        self.assertLessEqual(towns, pl.CAPITALS | pl.SETTLEMENTS)
        self.assertLessEqual(cities, pl.CAPITALS)
        self.assertFalse(towns & {"Wintersand Manor", "Flight Platform", "Dunpar Wall Ruins", "Unknown Gate"})

    def test_each_found_capital_has_places_nearby(self):
        # The four capitals with an exterior marker in Tamriel (see CAPITALS' comment); the other five have none this
        # reader can find and are logged under WO-144, not guessed at.
        by_city = collections.Counter(p["nearestCity"]["town"] for p in self.rows if p.get("nearestCity"))
        for city in ("Morthal", "Falkreath", "Winterhold", "Dawnstar"):
            self.assertGreaterEqual(by_city[city], 10, city)

    def test_riverwood_is_still_a_settlement_and_never_a_capital_itself(self):
        mine = self.by["Embershard Mine"]
        self.assertEqual(mine["nearestTown"]["town"], "Riverwood")
        self.assertNotIn("Riverwood", pl.CAPITALS)  # a settlement, never counted as one of the nine


if __name__ == "__main__":
    unittest.main()
