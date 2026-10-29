"""WO-166 Part 1: place_pos.py on small made-up worlds (no game files)."""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import place_pos as pp  # noqa: E402

CELLS = {
    "ext1": {"worldEdid": "Tamriel", "world": "T", "grid": (3, -2)},
    "ext2": {"worldEdid": "Tamriel", "world": "T", "grid": (5, -2)},
    "ext3": {"worldEdid": "Tamriel", "world": "T", "grid": (9, 9)},
    "pocket1": {"worldEdid": "AlftandWorld", "world": "A", "grid": (0, 0)},
    "whiterun1": {"worldEdid": "WhiterunWorld", "world": "W", "grid": (4, 1)},
    "int1": {"worldEdid": None, "world": None, "doors": {"doorA": {"pos": (1, 1, 1), "dest": "doorB"}}},
    "int2": {"worldEdid": None, "world": None, "doors": {"doorC": {"pos": (2, 2, 2), "dest": "doorD"}, "doorE": {"pos": (3, 3, 3), "dest": "doorF"}}},
    "int3": {"worldEdid": None, "world": None, "doors": {"doorG": {"pos": (5, 5, 5), "dest": "doorH"}}},
    "int4": {"worldEdid": None, "world": None},
}
CELLS["ext3"]["doors"] = {"doorB": {"pos": (40000.0, 12000.0, 300.0), "dest": "doorA"}}
CELLS["pocket1"]["doors"] = {"doorD": {"pos": (7, 7, 7), "dest": "doorC"}, "doorF": {"pos": (8, 8, 8), "dest": "doorE"}}
CELLS["ext1"]["doors"] = {"doorH": {"pos": (-5000.0, 6000.0, 80.0), "dest": "doorG"}}


def marker(cell="ext1", pos=(10.0, 20.0, 30.0), deleted=False):
    return {"cell": cell, "pos": list(pos), "deleted": deleted, "type": None, "name": "x"}


class Worlds(unittest.TestCase):
    def test_the_five_city_worlds_are_tamriel_and_the_dungeon_worlds_are_not(self):
        self.assertEqual(pp.canon("RiftenWorld"), "Tamriel")
        self.assertEqual(pp.canon("WhiterunWorld"), "Tamriel")
        self.assertEqual(pp.canon("BlackreachWorld"), "BlackreachWorld")  # Blackreach is 70 km off Tamriel's coordinates
        self.assertEqual(pp.canon(None), None)

    def test_a_map_is_a_world_with_several_markers_and_tamriel_always(self):
        markers = {f"m{i}": marker("ext1") for i in range(3)} | {"p": marker("pocket1"), "w": marker("whiterun1"), "d": marker("ext1", deleted=True)}
        self.assertEqual(pp.map_worlds(CELLS, markers), {"Tamriel"})  # three in Tamriel, one in a pocket, one in a city world (also Tamriel)
        three = {f"p{i}": marker("pocket1") for i in range(3)}
        self.assertNotIn("AlftandWorld", pp.map_worlds(CELLS, three))  # three is a pocket (Fort Dawnguard's yard has three)
        many = {f"p{i}": marker("pocket1") for i in range(pp.MIN_MARKERS)}
        self.assertIn("AlftandWorld", pp.map_worlds(CELLS, many))


class Marker(unittest.TestCase):
    def test_a_marker_gives_its_position_in_its_cells_world(self):
        self.assertEqual(pp.at_marker(marker(), CELLS), {"world": "Tamriel", "pos": [10.0, 20.0, 30.0], "posFrom": "marker"})

    def test_a_marker_in_a_city_world_is_filed_under_tamriel(self):
        self.assertEqual(pp.at_marker(marker("whiterun1"), CELLS)["world"], "Tamriel")

    def test_no_marker_a_deleted_one_or_one_in_an_interior_gives_nothing(self):
        self.assertIsNone(pp.at_marker(None, CELLS))
        self.assertIsNone(pp.at_marker(marker(deleted=True), CELLS))
        self.assertIsNone(pp.at_marker(marker("int1"), CELLS))


class Cells(unittest.TestCase):
    def test_one_exterior_cell_is_its_own_middle_and_has_no_height(self):
        got = pp.at_cells(["ext1"], CELLS)
        self.assertEqual((got["world"], got["posFrom"]), ("Tamriel", "cells"))
        self.assertEqual(got["pos"], [3 * 4096 + 2048.0, -2 * 4096 + 2048.0, None])

    def test_several_cells_are_averaged_in_the_world_most_of_them_are_in(self):
        got = pp.at_cells(["ext1", "ext2", "pocket1"], CELLS)
        self.assertEqual(got["world"], "Tamriel")
        self.assertEqual(got["pos"][:2], [4 * 4096 + 2048.0, -2 * 4096 + 2048.0])

    def test_interior_cells_alone_give_nothing(self):
        self.assertIsNone(pp.at_cells(["int1", "int4"], CELLS))


class Doors(unittest.TestCase):
    maps = {"Tamriel"}

    def setUp(self):
        self.doors = pp.door_index(CELLS)

    def test_an_interiors_door_out_gives_the_door_standing_outside(self):
        got = pp.at_doors(["int1"], CELLS, self.doors, self.maps)
        self.assertEqual(got, {"world": "Tamriel", "pos": [40000.0, 12000.0, 300.0], "posFrom": "door", "hops": 1, "exits": 1, "rawWorld": "Tamriel"})

    def test_it_follows_a_door_into_the_next_room_when_there_is_none_out_of_this_one(self):
        got = pp.at_doors(["int3"], CELLS, self.doors, self.maps)
        self.assertEqual((got["pos"], got["posFrom"]), ([-5000.0, 6000.0, 80.0], "door"))
        # int2's doors lead only into a pocket world, which is no map: nothing out, however deep it looks
        self.assertIsNone(pp.at_doors(["int2"], CELLS, self.doors, self.maps))

    def test_a_pocket_world_is_not_a_way_out_unless_it_is_a_map(self):
        got = pp.at_doors(["int2"], CELLS, self.doors, self.maps | {"AlftandWorld"})
        self.assertEqual(got["world"], "AlftandWorld")

    def test_a_room_with_no_doors_gives_nothing(self):
        self.assertIsNone(pp.at_doors(["int4"], CELLS, self.doors, self.maps))


class Locate(unittest.TestCase):
    maps = {"Tamriel"}

    def setUp(self):
        self.doors = pp.door_index(CELLS)

    def test_the_marker_beats_the_cells_and_the_door(self):
        self.assertEqual(pp.locate(marker(), ["ext2", "int1"], CELLS, self.doors, self.maps)["posFrom"], "marker")

    def test_with_no_marker_the_cells_beat_the_door(self):
        self.assertEqual(pp.locate(None, ["ext2", "int1"], CELLS, self.doors, self.maps)["posFrom"], "cells")

    def test_cells_in_a_pocket_world_give_way_to_a_door_out_onto_a_map(self):
        got = pp.locate(None, ["pocket1", "int1"], CELLS, self.doors, self.maps)
        self.assertEqual((got["world"], got["posFrom"]), ("Tamriel", "door"))

    def test_a_place_found_only_in_a_pocket_keeps_that_worlds_name(self):
        got = pp.locate(None, ["pocket1"], CELLS, self.doors, self.maps)
        self.assertEqual((got["world"], got["posFrom"]), ("AlftandWorld", "cells"))

    def test_a_place_nothing_can_find_has_no_position(self):
        self.assertIsNone(pp.locate(None, ["int4"], CELLS, self.doors, self.maps))
        self.assertIsNone(pp.locate(None, [], CELLS, self.doors, self.maps))


if __name__ == "__main__":
    unittest.main()
