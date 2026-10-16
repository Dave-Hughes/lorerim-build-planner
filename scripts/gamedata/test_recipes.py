"""
recipes.py against a small plugin built here, byte for byte as the game writes one.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import struct
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import recipes  # noqa: E402

PLUGIN = "Fixture.esp"
SWORD, OLD_SWORD = "Fixture.esp:000840", "Fixture.esp:000841"


def sub(t, data):
    return t.encode() + struct.pack("<H", len(data)) + data


def zs(s):
    return s.encode() + b"\0"


def record(t, fid, subs, flags=0):
    data = b"".join(subs)
    return t.encode() + struct.pack("<IIIIHH", len(data), flags, fid, 0, 44, 0) + data


def group(label, records):
    body = b"".join(records)
    return b"GRUP" + struct.pack("<I", 24 + len(body)) + label.encode() + struct.pack("<IHHHH", 0, 0, 0, 0, 0) + body


def ctda(fn, value=1.0, cmp=0, param=0, or_=False):
    op = cmp << 5 | (1 if or_ else 0)
    return sub("CTDA", struct.pack("<B3xfH2xIIIIi", op, value, fn, param, 0, 0, 0, -1))


def cobj(fid, edid, creates, station, materials, conds=(), count=None, flags=0):
    subs = [sub("EDID", zs(edid)), sub("COCT", struct.pack("<I", len(materials)))]
    subs += [sub("CNTO", struct.pack("<Ii", comp, n)) for comp, n in materials]
    subs += list(conds)
    subs.append(sub("CNAM", struct.pack("<I", creates)))
    if station:
        subs.append(sub("BNAM", struct.pack("<I", station)))
    if count:
        subs.append(sub("NAM1", struct.pack("<H", count)))
    return record("COBJ", fid, subs, flags)


def fixture():
    tes4 = record("TES4", 0, [sub("HEDR", struct.pack("<fII", 1.7, 0, 0x800))])
    kws = [("CraftingSmithingForge", 0x801), ("CraftingSmithingSharpeningWheel", 0x802), ("REQ_DisableRecipe", 0x803), ("CraftingOddBench", 0x804)]
    has_perk, enchanted = 448, 659
    return tes4 + b"".join(
        [
            group("KYWD", [record("KYWD", fid, [sub("EDID", zs(e))]) for e, fid in kws]),
            group(
                "PERK",
                [
                    record("PERK", 0x820, [sub("EDID", zs("REQ_Smithing_GlassSmithing")), sub("FULL", zs("Glass Smithing"))]),
                    record("PERK", 0x821, [sub("EDID", zs("REQ_Smithing_AdvancedBlacksmithing")), sub("FULL", zs("Advanced Blacksmithing"))]),
                ],
            ),
            group("MISC", [record("MISC", 0x830, [sub("EDID", zs("IngotMalachite")), sub("FULL", zs("Refined Malachite"))]), record("MISC", 0x831, [sub("EDID", zs("LeatherStrips")), sub("FULL", zs("Leather Strips"))])]),
            group("WEAP", [record("WEAP", 0x840, [sub("EDID", zs("GlassSword")), sub("FULL", zs("Glass Sword"))]), record("WEAP", 0x841, [sub("EDID", zs("GlassSwordOld")), sub("FULL", zs("Glass Sword"))])]),
            group(
                "COBJ",
                [
                    cobj(0x850, "RecipeGlassSword", 0x840, 0x801, [(0x830, 2), (0x831, 1)], [ctda(has_perk, param=0x820)]),
                    cobj(0x851, "TemperGlassSword", 0x840, 0x802, [(0x830, 1)], [ctda(enchanted, cmp=1, or_=True), ctda(has_perk, param=0x821), ctda(has_perk, param=0x820)]),
                    cobj(0x852, "RecipeGlassSwordOddBench", 0x840, 0x804, [(0x830, 1)]),
                    cobj(0x853, "RecipeOldGlassSword", 0x841, 0x801, [(0x830, 3)], [ctda(74, value=2.0, cmp=3, param=0x830)], count=2),
                    cobj(0x854, "RecipeGlassSwordDisabled", 0x840, 0x803, [(0x830, 1)]),
                    cobj(0x855, "BreakdownGlassSword", 0x830, 0x801, [(0x840, 1)]),
                    cobj(0x856, "RecipeGlassSwordNoStation", 0x840, 0, [(0x830, 1)]),
                    cobj(0x857, "RecipeGlassSwordDeleted", 0x840, 0x801, [(0x830, 1)], flags=0x20),
                ],
            ),
        ]
    )


def extract():
    got = recipes.read_plugin(fixture(), PLUGIN)
    return recipes.index_recipes(got["recipes"], {SWORD, OLD_SWORD}, got["keywords"], got["names"], got["perks"])


STATIONS = {"CraftingSmithingForge": "Forge", "CraftingSmithingSharpeningWheel": "Grindstone"}
PERKS = {"REQ_Smithing_GlassSmithing": "Smithing:Glass Smithing", "REQ_Smithing_AdvancedBlacksmithing": "Smithing:Advanced Blacksmithing"}
ITEMS = [{"id": SWORD, "name": "Glass Sword", "kind": "weapon", "also": [OLD_SWORD]}]


class ReadTest(unittest.TestCase):
    def setUp(self):
        self.rows, self.counts = extract()
        self.by_edid = {r["edid"]: r for r in self.rows}

    def test_counts(self):
        self.assertEqual(self.counts, {"read": 8, "at a station": 5, "kept": 4, "crafting": 3, "tempering": 1, "disabled": 1, "no station": 1, "breakdown": 1})

    def test_crafting_recipe(self):
        r = self.by_edid["RecipeGlassSword"]
        self.assertEqual((r["kind"], r["item"], r["station"]), ("make", SWORD, "CraftingSmithingForge"))
        self.assertEqual([(m["name"], m["count"]) for m in r["materials"]], [("Refined Malachite", 2), ("Leather Strips", 1)])
        self.assertEqual(r["conditions"][0]["perkEdid"], "REQ_Smithing_GlassSmithing")
        self.assertEqual(r["conditions"][0]["perkName"], "Glass Smithing")
        self.assertNotIn("makes", r)

    def test_tempering_recipe(self):
        r = self.by_edid["TemperGlassSword"]
        self.assertEqual(r["kind"], "improve")
        self.assertEqual([c["kind"] for c in r["conditions"]], ["EPTemperingItemIsEnchanted", "HasPerk", "HasPerk"])

    def test_created_count_and_other_ids(self):
        r = self.by_edid["RecipeOldGlassSword"]
        self.assertEqual((r["item"], r["makes"]), (OLD_SWORD, 2))
        self.assertEqual(r["conditions"][0]["kind"], "GetGlobalValue")

    def test_left_out(self):
        for edid in ("RecipeGlassSwordDisabled", "BreakdownGlassSword", "RecipeGlassSwordNoStation", "RecipeGlassSwordDeleted"):
            self.assertNotIn(edid, self.by_edid)


class BuildTest(unittest.TestCase):
    def setUp(self):
        rows, _ = extract()
        self.out, self.notes = recipes.build_recipes({"recipes": rows, "stationNames": {"CraftingOddBench": ["Odd Bench"]}}, ITEMS, STATIONS, PERKS)

    def test_make(self):
        made = self.out[SWORD]["make"]
        self.assertEqual(made[0], {"station": "Forge", "materials": [{"name": "Refined Malachite", "count": 2}, {"name": "Leather Strips", "count": 1}], "perks": ["Smithing:Glass Smithing"]})

    def test_improve_drops_the_routine_pair(self):
        self.assertEqual(self.out[SWORD]["improve"], [{"station": "Grindstone", "materials": [{"name": "Refined Malachite", "count": 1}], "perks": ["Smithing:Glass Smithing"]}])

    def test_also_id_goes_under_the_primary_item(self):
        self.assertNotIn(OLD_SWORD, self.out)
        self.assertIn({"station": "Forge", "materials": [{"name": "Refined Malachite", "count": 3}], "perks": [], "otherConditions": 1, "makes": 2}, self.out[SWORD]["make"])

    def test_unknown_station_left_out_with_a_note(self):
        self.assertEqual(len(self.out[SWORD]["make"]), 2)
        self.assertTrue(any("CraftingOddBench" in n and "1 recipes left out" in n and "Odd Bench" in n for n in self.notes), self.notes)
        self.assertTrue(any("GetGlobalValue 1" in n for n in self.notes), self.notes)


class PluginTest(unittest.TestCase):
    def test_sources(self):
        with tempfile.TemporaryDirectory() as root:
            for d, ini in (("Glass Mod", "[General]\nmodid=1234\n"), ("Output", "[General]\nmodid=0\n"), ("Patch", "[General]\n")):
                os.makedirs(os.path.join(root, "mods", d))
                with open(os.path.join(root, "mods", d, "meta.ini"), "w", encoding="utf-8") as f:
                    f.write(ini)
            self.assertEqual(recipes.plugin_source("Glass.esp", ["Glass Mod"], root), {"folder": "Glass Mod", "modid": "1234"})
            self.assertEqual(recipes.plugin_source("Glass.esp", ["Output", "Glass Mod"], root), {"folder": "Output", "modid": "1234", "modidFrom": "Glass Mod"})
            self.assertEqual(recipes.plugin_source("Patch.esp", ["Patch"], root), {"folder": "Patch", "modid": None})
            self.assertEqual(recipes.plugin_source("Skyrim.esm", None, root), {"folder": None, "modid": None})
            self.assertEqual(recipes.plugin_source("Dawnguard.esm", ["Glass Mod"], root), {"folder": "Glass Mod", "modid": None})
            self.assertEqual(recipes.plugin_source("ccbgssse001-fish.esm", ["Glass Mod"], root), {"folder": "Glass Mod", "modid": None})


if __name__ == "__main__":
    unittest.main()
