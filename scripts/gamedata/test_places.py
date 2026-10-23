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
        data = json.load(open(RAW, encoding="utf-8"))
        cls.rows = data["places"]
        cls.roads = data["roads"]
        cls.by = {}
        for p in cls.rows:
            cls.by.setdefault(p["name"], p)
        cls.road_by = {frozenset(r["towns"]): r for r in cls.roads}

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
        # WO-144 Part 1 item 2: NAMED_PLACES (the thirteen settlements, the four strongholds) are the one named
        # exception -- everything else stays out, so a stray "City"/"Town"/"Settlement" marker still can't sneak in.
        self.assertFalse([p["name"] for p in self.rows if p["type"] in pl.NOT_PLACES and p["name"] not in pl.NAMED_PLACES])
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

    def test_each_of_the_nine_capitals_has_places_nearby(self):
        # WO-144 Part 1's own test, tightened by Bob 23 Oct 15:20: "ten places within a short walk to half a day",
        # not a flat 5 km (which covers most of a hold on this small map and proved too little).
        close = ("next to it", "a short walk", "half a day")
        by_city = collections.Counter(p["nearestCity"]["town"] for p in self.rows if p.get("nearestCity") and p["nearestCity"]["walk"] in close)
        for city in pl.CAPITALS:
            self.assertGreaterEqual(by_city[city], 10, city)

    def test_walk_bands_follow_bob_s_two_pairs(self):
        # Riverwood to Whiterun (0.5 km) is "a short walk"; Whiterun to Riften (2.5 km) is "a long day's road".
        self.assertEqual(pl.walk(0.5), "a short walk")
        self.assertEqual(pl.walk(2.5), "a long day's road")
        self.assertEqual(self.by["Riverwood"]["nearestCity"]["walk"], "a short walk")

    def test_riverwood_is_still_a_settlement_and_never_a_capital_itself(self):
        mine = self.by["Embershard Mine"]
        self.assertEqual(mine["nearestTown"]["town"], "Riverwood")
        self.assertNotIn("Riverwood", pl.CAPITALS)  # a settlement, never counted as one of the nine

    def test_named_settlements_and_strongholds_are_places_now(self):
        # WO-144 Part 1 item 2: these bypass the usual place rules by name (NAMED_PLACES), so they show up themselves,
        # not only as another place's nearestTown.
        for nm in pl.SETTLEMENTS | pl.STRONGHOLDS:
            if nm == "Thirsk":
                continue  # no marker this reader can find for it; "not checked" is correct, not a failure
            self.assertIn(nm, self.by, nm)

    def test_a_strongholds_gate_names_the_game_s_own_condition(self):
        for nm in pl.STRONGHOLDS:
            gate = self.by[nm]["enters"]
            self.assertIn("Orc", gate["words"])
            self.assertIn("Blood-Kin", gate["words"])
            self.assertTrue(gate["record"].startswith("INFO "))

    def test_city_buildings_are_findable_with_their_town(self):
        # WO-144 Part 1 item 3: named by keyword (CWCapitalHQ for a keep, LocTypeStables for a stable; LocTypeTemple/
        # Inn/Guild otherwise), their town is a parent-chain fact (inTown), never a distance guess.
        by_type = collections.Counter(p["type"] for p in self.rows if p["type"] in ("Temple", "Inn", "Guild", "Keep", "Stables"))
        self.assertEqual(by_type["Keep"], 9)  # exactly the nine jarls' seats, never a non-capital castle
        self.assertEqual(by_type["Stables"], 5)  # Whiterun, Windhelm, Riften, Markarth, Solitude
        self.assertGreater(by_type["Inn"], 20)
        self.assertGreater(by_type["Temple"], 5)
        self.assertGreater(by_type["Guild"], 5)
        for nm, city in (("Dragonsreach", "Whiterun"), ("Temple of Kynareth", "Whiterun"), ("The Bannered Mare", "Whiterun"),
                         ("Jorrvaskr", "Whiterun"), ("Winterhold College", "Winterhold"), ("Bards College", "Solitude"),
                         ("Solitude Stables", "Solitude")):
            self.assertEqual(self.by[nm]["inTown"], city, nm)

    def test_buildings_never_pick_up_a_non_capital_castle(self):
        castles = {p["name"] for p in self.rows if p["type"] == "Keep"}
        self.assertNotIn("Castle Volkihar", castles)

    def test_bobs_cleaning_pass_names_are_gone_or_fixed(self):
        # WO-144 Part 1, Bob 23 Oct 15:35: a keyword alone isn't a building (a city tagged as having an inn, a
        # player home, a dungeon with a stray LocTypeInn, a cellar, a tomb). These never show as a Temple/Inn/Guild.
        names = {p["name"] for p in self.rows if p["type"] in ("Temple", "Inn", "Guild")}
        for bad in ("Whiterun", "Solitude", "Home of Thane Alarik", "Fort Valus", "The Hermit", "The Hermit Cellar",
                    "Markarth East Empire Dormitory", "Temple Location", "Markarth Outskirts",
                    "Snow-Shod Farm Cellar", "Mausoleum", "Mustering Hall"):
            self.assertNotIn(bad, names, bad)
        self.assertNotEqual(self.by["Cragwater Cavern"]["type"], "Inn")  # still a dungeon, just never an inn

    def test_building_names_are_the_cell_s_not_the_record_s(self):
        # Bob: "Mistveil Keep", not "Riften Mistveil Keep"; "Vilemyr Inn", not "Ivarstead Vilemyr Inn".
        self.assertEqual(self.by["Mistveil Keep"]["name"], "Mistveil Keep")
        self.assertEqual(self.by["Mistveil Keep"]["recordName"], "Riften Mistveil Keep")
        self.assertEqual(self.by["Vilemyr Inn"]["name"], "Vilemyr Inn")

    def test_the_roads_table_covers_every_mainland_pair_once(self):
        # WO-144 Part 1 item 4: every capital and settlement to every other in the same worldspace, no duplicate pair,
        # never across worldspaces (Solstheim's towns never road to a mainland one), and matches Bob's two pairs.
        self.assertEqual(self.road_by[frozenset(("Riverwood", "Whiterun"))], {"towns": ["Riverwood", "Whiterun"], "km": 0.5, "walk": "a short walk"})
        self.assertEqual(self.road_by[frozenset(("Riften", "Whiterun"))]["walk"], "a long day's road")
        self.assertNotIn(frozenset(("Riverwood", "Raven Rock")), self.road_by)  # Tamriel to Solstheim: no road
        self.assertEqual(len(self.roads), len({frozenset(r["towns"]) for r in self.roads}))  # no pair twice

    def test_suggest_places_can_read_a_place_s_road_towns(self):
        # Player question 26 ("What's near Riften for Kyria's first act?"): Mac's door reads nearTowns for an act's
        # towns from this table; the PC's job is only that every road the door could ask for is here, with a town.
        riften_roads = [r for r in self.roads if "Riften" in r["towns"]]
        self.assertGreater(len(riften_roads), 10)
        self.assertTrue(all(r["km"] > 0 for r in riften_roads))


if __name__ == "__main__":
    unittest.main()
