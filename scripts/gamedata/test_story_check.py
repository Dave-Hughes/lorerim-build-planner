"""
story_check.py against fixtures built here: a compiled script, story manager nodes, MCM Helper settings
files and a BSA, byte for byte as the game and its tools write them.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import struct
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pex  # noqa: E402
import quest_scripts as qsc  # noqa: E402
import story_check as sc  # noqa: E402
from test_quest_scripts import OTHER, QUEST, Pex, bsa, fragment_script, vmad_qust  # noqa: E402

PLUGIN = "Fixture.esp"
GLOBAL = "Fixture.esp:000830"


def sub(t, data):
    return t.encode() + struct.pack("<H", len(data)) + data


def zs(s):
    return s.encode() + b"\0"


def u32(n):
    return struct.pack("<I", n)


def record(t, fid, subs, flags=0):
    data = b"".join(subs)
    return t.encode() + struct.pack("<IIIIHH", len(data), flags, fid, 0, 44, 0) + data


def group(label, records):
    body = b"".join(records)
    return b"GRUP" + struct.pack("<I", 24 + len(body)) + label.encode() + struct.pack("<iHHHH", 0, 0, 0, 0, 0) + body


def ctda(fn, value, cmp=3, param=0, p2=0, global_=None):
    op = cmp << 5 | (0x04 if global_ else 0)
    comp = u32(global_) if global_ else struct.pack("<f", value)
    return sub("CTDA", bytes([op, 0, 0, 0]) + comp + struct.pack("<H2xIIIIi", fn, param, p2, 0, 0, -1))


def nodes_plugin():
    """An event node (change location, level 5 or more), a branch under it (MQ stage 160 done), a quest node under that (level >= a global)."""
    tes4 = record("TES4", 0, [sub("HEDR", struct.pack("<fII", 1.7, 0, 0x800))])
    return tes4 + b"".join([
        group("SMEN", [record("SMEN", 0x870, [sub("PNAM", u32(0)), ctda(80, 5.0), sub("ENAM", b"CLOC")])]),
        group("SMBN", [record("SMBN", 0x871, [sub("EDID", zs("FXBranch")), sub("PNAM", u32(0x870)), ctda(59, 1.0, cmp=0, param=0x801, p2=160)])]),
        group("SMQN", [record("SMQN", 0x872, [sub("EDID", zs("FXQuestNode")), sub("PNAM", u32(0x871)), ctda(80, 0.0, global_=0x830),
                                              sub("QNAM", u32(1)), sub("NNAM", u32(0x800))])]),
    ])


def mcm_script():
    """An MCM Helper script: Load reads iLevel:General and sets the Level property's global."""
    w = Pex("FX_MCMScript")
    code = [("callmethod", ["GetModSettingInt", "self", "::temp0", '"iLevel:General"']),
            ("cast", ["::temp1", "::temp0"]),
            ("callmethod", ["SetValue", "::Level_var", "::NoneVar", "::temp1"])]
    return w.build([("Level", "globalvariable")], [("Load", code)])


class PexTest(unittest.TestCase):
    def test_reader_finds_setstage_on_another_quest(self):
        scripts = {"QF_Fixture": pex.read_pex(fragment_script())}
        vm = qsc.parse_vmad(vmad_qust(), [], PLUGIN, "QUST")
        names = {OTHER: {"type": "QUST", "edid": "FXOther", "name": "The Other Quest"}}
        events = sc.StoryAnalyzer(scripts, names, {}).run("QF_Fixture", vm["scripts"][0]["props"], {"quest": QUEST}, ["Fragment_0"])
        self.assertIn({"call": "SetStage", "quest": OTHER, "stage": 10, "function": "Fragment_0"}, events)

    def test_loose_beats_bsa(self):
        with tempfile.TemporaryDirectory() as tmp:
            mod = os.path.join(tmp, "Mod")
            os.makedirs(os.path.join(mod, "Scripts"))
            with open(os.path.join(mod, "Scripts", "FX_MCMScript.pex"), "wb") as f:
                f.write(mcm_script())
            archive = os.path.join(tmp, "Fixture.bsa")
            with open(archive, "wb") as f:
                f.write(bsa({"scripts\\fx_mcmscript.pex": fragment_script()}))
            s = pex.Scripts(tmp, [], archives=[archive], loose_dirs=[mod])
            self.assertEqual(s.where("FX_MCMScript")[0], "loose")
            self.assertEqual(s.get("FX_MCMScript")["objects"][0]["name"], "FX_MCMScript")


class NodeTest(unittest.TestCase):
    def test_conditions_gathered_up_the_parents(self):
        nodes = sc.read_nodes(nodes_plugin(), PLUGIN)
        (start,) = sc.node_starts(QUEST, nodes)
        self.assertEqual((start["node"], start["event"], start["parents"]), ("FXQuestNode", "change location", ["FXBranch", "Fixture.esp:000870"]))
        self.assertEqual([(c["fn"], c["node"]) for c in start["conditions"]],
                         [("GetLevel", "FXQuestNode"), ("GetStageDone", "FXBranch"), ("GetLevel", "Fixture.esp:000870")])
        self.assertEqual(start["conditions"][0]["global"], GLOBAL)
        self.assertEqual((start["conditions"][1]["param"], start["conditions"][1]["stage"]), (OTHER, 160))


class SettingsTest(unittest.TestCase):
    def folders(self, tmp):
        loader = os.path.join(tmp, "mods", "Fixture - Settings Loader")
        os.makedirs(os.path.join(loader, "MCM", "Config", "Fixture"))
        with open(os.path.join(loader, "MCM", "Config", "Fixture", "settings.ini"), "w") as f:
            f.write("[General]\niLevel=25\n")
        return loader

    def test_settings_ini_beats_the_record(self):
        with tempfile.TemporaryDirectory() as tmp:
            loader = self.folders(tmp)
            mcm = sc.mcm_settings([loader], os.path.join(tmp, "overwrite"))
            self.assertEqual(sc.setting_value(mcm["Fixture"], "iLevel:General"), ("25", "settings.ini in Fixture - Settings Loader"))
            names = {GLOBAL: {"type": "GLOB", "edid": "FXLevel", "name": ""}}
            an = qsc.Analyzer({}, names, {})
            mapped = sc.settings_globals(pex.read_pex(mcm_script()), {"level": {"form": GLOBAL, "alias": -1}}, an.prop_value)
            self.assertEqual(mapped, [(GLOBAL, "iLevel:General", "Load")])
            loaders = {GLOBAL: [{"mod": "Fixture", "key": "iLevel:General", "value": "25", "from": "settings.ini", "script": "FX_MCMScript.Load"}]}
            fact = sc.global_fact(GLOBAL, {GLOBAL: [(PLUGIN, 10.0)]}, loaders, {}, names)
            self.assertEqual((fact["record"], fact["value"], fact["verdict"]), (10.0, "25", "run time"))

    def test_user_settings_beat_the_defaults(self):
        with tempfile.TemporaryDirectory() as tmp:
            loader = self.folders(tmp)
            os.makedirs(os.path.join(tmp, "overwrite", "MCM", "Settings"))
            with open(os.path.join(tmp, "overwrite", "MCM", "Settings", "Fixture.ini"), "w") as f:
                f.write("[General]\niLevel=30\n")
            mcm = sc.mcm_settings([loader], os.path.join(tmp, "overwrite"))
            self.assertEqual(sc.setting_value(mcm["Fixture"], "iLevel:General"), ("30", "MCM/Settings in overwrite"))

    def test_a_settings_file_the_game_doesnt_read(self):
        names = {GLOBAL: {"type": "GLOB", "edid": "FXLevel", "name": ""}}
        loaders = {GLOBAL: [{"mod": "Fixture", "key": "iLevel:General", "value": "25", "from": "settings.ini", "script": "x", "notRead": True, "why": "the winner doesn't read it"}]}
        fact = sc.global_fact(GLOBAL, {GLOBAL: [(PLUGIN, 10.0)]}, loaders, {}, names)
        self.assertEqual((fact["value"], fact["verdict"]), (10.0, "conflict"))
        same = sc.global_fact(GLOBAL, {GLOBAL: [(PLUGIN, 25.0)]}, loaders, {}, names)
        self.assertEqual(same["verdict"], "files")


if __name__ == "__main__":
    unittest.main()
