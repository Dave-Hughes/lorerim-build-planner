"""WO-166 Part 2: maps.py's rule and grid on plain numbers, the winning-file lookup on a made-up install, and the built map against what
was checked by eye (Solitude, Whiterun and Riften's pins on the paper map, 27 Oct 2026)."""
import json
import os
import shutil
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import esp  # noqa: E402
import maps  # noqa: E402

REPO = maps.REPO
MAPS_JSON = os.path.join(REPO, "src", "data", "lorerim-5.0.4.8", "maps.json")
PLACES_JSON = os.path.join(REPO, "src", "data", "lorerim-5.0.4.8", "places.json")
BORDER = (725, 1533, 7635, 6419)  # the paper map's own frame on the 8192 image, measured from its alpha channel


class Rule(unittest.TestCase):
    def test_the_game_origin_is_the_middle_of_the_picture_and_y_runs_up(self):
        self.assertEqual(maps.to_pixel(0, 0), (4096, 4096))
        self.assertEqual(maps.to_pixel(64, 64), (4097, 4095))
        self.assertEqual(maps.to_pixel(-64 * 100, -64 * 100), (3996, 4196))

    def test_riverwood_is_where_bob_s_proof_put_it(self):
        x, y = maps.to_pixel(22242.7, -44616.1)
        self.assertAlmostEqual(x, 4443.5, delta=0.1)
        self.assertAlmostEqual(y, 4793.1, delta=0.1)


class Grid(unittest.TestCase):
    def test_the_tiles_that_touch_the_frame_at_each_zoom(self):
        self.assertEqual(maps.tile_grid(BORDER, 8192), ((1, 14), (2, 12)))  # the margins above and below the frame have no tiles
        self.assertEqual(maps.tile_grid(BORDER, 4096), ((0, 7), (1, 6)))

    def test_a_frame_ending_exactly_on_a_tile_edge_does_not_ask_for_the_next_tile(self):
        self.assertEqual(maps.tile_grid((0, 0, 1024, 512), 8192), ((0, 1), (0, 0)))

    def test_the_entry_carries_the_credit_and_the_rule_so_the_site_types_none_of_it(self):
        e = maps.entry(BORDER, 2000, 1414)
        self.assertEqual(e["credit"], {"text": "Skyrim Paper Map by Caro Tuts", "url": "https://www.nexusmods.com/skyrimspecialedition/mods/62705"})
        self.assertEqual((e["texture"]["origin"], e["texture"]["unitsPerPixel"]), ([4096, 4096], 64.0))
        self.assertEqual([z["z"] for z in e["tiles"]["zooms"]], [0, 1])
        self.assertEqual(e["tiles"]["url"], "/maps/tamriel/{z}/{x}_{y}.webp")

    def test_the_frames_corners_are_the_whole_pictures_corners(self):
        e = maps.entry(BORDER, 2000, 1414)
        # a game position that lands on the frame's top-left and bottom-right pixels
        gx0, gy0 = (BORDER[0] - 4096) * 64, (4096 - BORDER[1]) * 64
        gx1, gy1 = (BORDER[2] - 4096) * 64, (4096 - BORDER[3]) * 64
        self.assertEqual([round(v, 6) for v in maps.to_whole(e, gx0, gy0)], [0, 0])
        self.assertEqual([round(v, 6) for v in maps.to_whole(e, gx1, gy1)], [2000, 1414])


class WinningFile(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.old = (esp.ROOT, esp.active_profile)
        esp.ROOT = self.tmp
        esp.active_profile = lambda: "P"

    def tearDown(self):
        esp.ROOT, esp.active_profile = self.old
        shutil.rmtree(self.tmp, ignore_errors=True)

    def put(self, where, rel="textures/terrain/tamriel/skyrim.dds"):
        p = os.path.join(self.tmp, where, *rel.split("/"))
        os.makedirs(os.path.dirname(p), exist_ok=True)
        open(p, "wb").write(b"x")
        return p

    def won(self, rel="textures/terrain/tamriel/skyrim.dds"):
        got = esp.winning_asset(rel)
        return got and os.path.normpath(got)

    def modlist(self, *names):
        os.makedirs(os.path.join(self.tmp, "profiles", "P"), exist_ok=True)
        open(os.path.join(self.tmp, "profiles", "P", "modlist.txt"), "w").write("# header\n" + "".join(f"+{n}\n" for n in names) + "-Disabled\n")

    def test_the_first_enabled_line_is_the_highest_priority(self):
        self.modlist("Paper Map", "FWMF")
        paper, _flat = self.put("mods/Paper Map"), self.put("mods/FWMF")
        self.assertEqual(self.won(), os.path.normpath(paper))

    def test_overwrite_beats_every_mod_and_the_games_own_data_is_the_last_resort(self):
        self.modlist("Paper Map")
        self.put("mods/Paper Map")
        over = self.put("overwrite")
        self.assertEqual(self.won(), os.path.normpath(over))
        os.remove(over)
        os.remove(self.put("mods/Paper Map"))
        base = self.put("Stock Game/Data")
        self.assertEqual(self.won("\\textures\\terrain\\tamriel\\skyrim.dds"), os.path.normpath(base))  # either slash, and a leading one
        os.remove(base)
        self.assertIsNone(self.won())


@unittest.skipUnless(os.path.exists(MAPS_JSON), "maps.json not built")
class BuiltMap(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.m = json.load(open(MAPS_JSON, encoding="utf-8"))["Tamriel"]

    def test_every_tile_the_grid_names_is_there_and_none_else(self):
        from PIL import Image

        for z in self.m["tiles"]["zooms"]:
            folder = os.path.join(REPO, "public", "maps", "tamriel", str(z["z"]))
            want = {f"{x}_{y}.webp" for x in range(z["columns"][0], z["columns"][1] + 1) for y in range(z["rows"][0], z["rows"][1] + 1)}
            self.assertEqual(set(os.listdir(folder)), want, z)
            with Image.open(os.path.join(folder, sorted(want)[0])) as t:
                self.assertEqual((t.size, t.format), ((512, 512), "WEBP"))

    def test_the_whole_map_picture_is_the_size_maps_json_says_and_the_frames_shape(self):
        from PIL import Image

        with Image.open(os.path.join(REPO, "public", "maps", "tamriel.webp")) as im:
            self.assertEqual(im.size, (self.m["image"]["width"], self.m["image"]["height"]))
        bx0, by0, bx1, by1 = self.m["border"]
        self.assertAlmostEqual(self.m["image"]["width"] / self.m["image"]["height"], (bx1 - bx0) / (by1 - by0), delta=0.002)
        self.assertEqual(self.m["image"]["width"], maps.WHOLE_WIDTH)

    def test_the_credit_is_in_the_file(self):
        self.assertEqual(self.m["credit"]["text"], "Skyrim Paper Map by Caro Tuts")
        self.assertTrue(self.m["credit"]["url"].endswith("/mods/62705"))

    @unittest.skipUnless(os.path.exists(PLACES_JSON), "places.json not built")
    def test_three_cities_land_where_they_were_checked_by_eye_on_the_paper_map(self):
        # 27 Oct 2026, close-ups at full resolution with a crosshair: Solitude on the road end on the headland above the Karth River
        # bay, Whiterun on the end of the plains' road loop, Riften on the east shore of Lake Honrich at the road.
        places = {p["name"]: p for p in json.load(open(PLACES_JSON, encoding="utf-8"))["places"]}
        for name, (x, y) in {"Solitude": (682.0, 268.5), "Whiterun": (1065.5, 775.3), "Riften": (1759.9, 1178.5)}.items():
            got = maps.to_whole(self.m, *places[name]["pos"][:2])
            self.assertAlmostEqual(got[0], x, delta=1.5, msg=name)
            self.assertAlmostEqual(got[1], y, delta=1.5, msg=name)

    @unittest.skipUnless(os.path.exists(PLACES_JSON), "places.json not built")
    def test_every_place_on_tamriel_but_a_parked_marker_is_on_the_picture(self):
        # GORE's "Campsite" has its map marker parked at (251909, 198637, -30000): off the frame and 30 km under the world. Anything else
        # off the picture would be a position wrongly read (a world not on Tamriel's coordinates, a wrong rule).
        W, H = self.m["image"]["width"], self.m["image"]["height"]
        out = [(p["name"], p["pos"][2]) for p in json.load(open(PLACES_JSON, encoding="utf-8"))["places"]
               if p.get("world") == "Tamriel" and not (0 <= maps.to_whole(self.m, *p["pos"][:2])[0] < W and 0 <= maps.to_whole(self.m, *p["pos"][:2])[1] < H)]
        # (the Creation Club's Campsite markers are named now, so GORE's parked one no longer stands as a place of its own: WO-183 Part 7)
        self.assertEqual([o for o in out if o[1] != -30000.0], [])


if __name__ == "__main__":
    unittest.main()
