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


def ev(caller, kind, target, call, stage=None, at=None, via=None):
    """One (context, event) pair as story_check reads them."""
    ctx = {"kind": kind, "quest": caller, "script": f"QF_{caller}", "stage": at}
    e = {"call": call, "quest": target, "function": "Fragment_0"}
    if stage is not None:
        e["stage"] = stage
    if via:
        e["via"] = via
    return ctx, e


class StartersTest(unittest.TestCase):
    """Item 1: starters, catch-ups and advances, as the story's order reads them."""

    def test_starters_not_catch_ups(self):
        order = {"Unbound": 0, "Storm": 1, "Barrow": 2}
        events = [
            ev("Unbound", "quest", "Helper", "SetStage", 3, at=700),   # Unbound's end starts the helper...
            ev("Helper", "quest", "Storm", "Start", at=5),             # ...whose stage 5 starts Before the Storm
            ev("Barrow", "quest", "Storm", "SetStage", 1, at=1),       # a later quest catching Before the Storm up
            ev("Elsewhere", "quest", "Storm", "SetStage", 50, at=10),  # past the first objective's stage: advances it
            ev("Storm", "quest", "Storm", "SetStage", 10, at=5),       # its own script
            ev("Storm", "quest", "Storm", "SetStage", 12, at=5, via="Storm"),  # its own other script
        ]
        out = sc.classify_starts("Storm", order, events, 10)
        self.assertEqual([c["quest"] for c, _ in out["started"]], ["Helper"])
        self.assertEqual([c["quest"] for c, _ in out["caughtUp"]], ["Barrow"])
        self.assertEqual([c["quest"] for c, _ in out["advanced"]], ["Elsewhere"])
        # The helper isn't on the story: it takes Before the Storm's place, so Unbound starts it and Barrow doesn't.
        events.append(ev("Barrow", "quest", "Helper", "SetStage", 1, at=1))
        helper = sc.classify_starts("Helper", order, events, 10, here=order["Storm"])
        self.assertEqual([c["quest"] for c, _ in helper["started"]], ["Unbound"])
        self.assertEqual([c["quest"] for c, _ in helper["caughtUp"]], ["Barrow"])


def localized_quest_plugin():
    """A localized plugin whose quest's FULL is string 5."""
    tes4 = record("TES4", 0, [sub("HEDR", struct.pack("<fII", 1.7, 0, 0x800))], flags=0x80)
    return tes4 + group("QUST", [record("QUST", 0x800, [sub("EDID", zs("MQ102A")), sub("FULL", u32(5))])])


def string_table(entries, lengths):
    data, directory = b"", b""
    for i, s in entries:
        directory += struct.pack("<II", i, len(data))
        b = s.encode() + bytes([0])
        data += (struct.pack("<I", len(b)) + b) if lengths else b
    return struct.pack("<II", len(entries), len(data)) + directory + data


class NamesTest(unittest.TestCase):
    """Item 2: a quest's name is its own FULL, from STRINGS, not a DLSTRINGS line that reuses the id."""

    def test_name_from_strings_not_dlstrings(self):
        with tempfile.TemporaryDirectory() as tmp:
            os.makedirs(os.path.join(tmp, "Strings"))
            with open(os.path.join(tmp, "Strings", "Fixture_english.STRINGS"), "wb") as f:
                f.write(string_table([(5, "Before the Storm")], False))
            with open(os.path.join(tmp, "Strings", "Fixture_english.DLSTRINGS"), "wb") as f:
                f.write(string_table([(5, "Season Unending")], True))
            strings = sc.name_strings(os.path.join(tmp, PLUGIN), PLUGIN, True, tmp)
            got = qsc.read_plugin(localized_quest_plugin(), PLUGIN, strings)
            self.assertEqual(got["names"]["Fixture.esp:000800"]["name"], "Before the Storm")
            self.assertEqual(sc.quest_label("Fixture.esp:000800", got["names"]), "MQ102A (Before the Storm)")


class ConditionsTest(unittest.TestCase):
    """Item 5: conditions read as the game reads them, OR'd ones joined with "or"."""

    def test_or_groups(self):
        names = {"Skyrim.esm:03FA16": {"type": "QUST", "edid": "MQPaarthurnax", "name": "Paarthurnax"},
                 "Skyrim.esm:036192": {"type": "QUST", "edid": "MQ203", "name": "Alduin's Wall"}}
        conds = [
            {"fn": "GetStageDone", "cmp": "==", "value": 1.0, "or": False, "param": "Skyrim.esm:036192", "stage": 280},
            {"fn": "GetStage", "cmp": "<", "value": 10.0, "or": True, "param": "Skyrim.esm:03FA16"},
            {"fn": "GetStageDone", "cmp": "==", "value": 1.0, "or": True, "param": "Skyrim.esm:03FA16", "stage": 100},
            {"fn": "GetStageDone", "cmp": "==", "value": 1.0, "or": False, "param": "Skyrim.esm:03FA16", "stage": 99},
        ]
        self.assertEqual(sc.format_conditions(conds, names),
                         "Alduin's Wall stage 280 done; Paarthurnax stage < 10 or Paarthurnax stage 100 done or Paarthurnax stage 99 done")

    def test_speaker_and_gold_in_plain_words(self):
        names = {"Skyrim.esm:00000F": {"type": "MISC", "edid": "Gold001", "name": "Septim"}, "AP.esp:00B189": {"type": "NPC_", "edid": "X", "name": "Shazdehviir"}}
        conds = [{"fn": "GetIsID", "cmp": "==", "value": 1.0, "or": False, "param": "AP.esp:00B189"},
                 {"fn": "GetIsAliasRef", "cmp": "==", "value": 1.0, "or": False, "param": 2},
                 {"fn": "GetItemCount", "cmp": ">=", "value": 25.0, "or": False, "param": "Skyrim.esm:00000F"}]
        self.assertEqual(sc.format_conditions(conds, names, alias_names={2: "Innkeeper"}),
                         "the speaker is Shazdehviir; the speaker is the one in alias Innkeeper; the player has at least 25 gold")


    def test_alias_zero(self):
        """The record's reading leaves param out for alias 0 (WO-115): it is still alias 0, not 'alias None'."""
        conds = [{"fn": "GetIsAliasRef", "cmp": "==", "value": 1.0, "or": False}]
        self.assertEqual(sc.format_conditions(conds, {}, alias_names={0: "Agmaer"}), "the speaker is the one in alias Agmaer")


def plugin(*groups):
    return record("TES4", 0, [sub("HEDR", struct.pack("<fII", 1.7, 0, 0x800))]) + b"".join(groups)


class SpeakersTest(unittest.TestCase):
    """WO-115 gap 2: a line with no GetIsID is spoken by a scene's actor alias, a package's alias, or the line before it."""

    def test_scene_actor_and_its_quest(self):
        scen = record("SCEN", 0x900, [
            sub("EDID", zs("FXAgmaerScene")),
            sub("ALID", u32(9)), sub("LNAM", u32(1)), sub("DNAM", u32(0)),              # the actor list
            sub("ANAM", struct.pack("<H", 0)), sub("ALID", u32(9)), sub("INAM", u32(1)), sub("DATA", u32(0x810)), sub("ANAM", b""),
            sub("ANAM", struct.pack("<H", 1)), sub("ALID", u32(9)), sub("PNAM", u32(0x820)), sub("ANAM", b""),  # a package action's own PNAM
            sub("ANAM", struct.pack("<H", 3)), sub("ALID", u32(4)), sub("PTOP", u32(0x811)), sub("ANAM", b""),  # a player dialogue choice
            sub("PNAM", u32(0x800)),                                                      # the scene's quest
        ])
        got = sc.read_scenes(plugin(group("SCEN", [scen])), PLUGIN)
        self.assertEqual(got["Fixture.esp:000810"], [{"scene": "FXAgmaerScene", "id": "Fixture.esp:000900", "quest": QUEST, "alias": 9}])
        self.assertEqual(got["Fixture.esp:000811"][0]["alias"], 4)

    def test_line_that_leads_on(self):
        dial = record("DIAL", 0x910, [sub("EDID", zs("FXTopic")), sub("QNAM", u32(0x800))])
        info = record("INFO", 0x911, [ctda(72, 1.0, cmp=0, param=0x830), sub("TCLT", u32(0x812))])
        other = record("INFO", 0x912, [sub("TCLT", u32(0x813))])
        got = sc.read_links(plugin(group("DIAL", [dial, info, other])), PLUGIN, {"Fixture.esp:000812"})
        (ln,) = got["Fixture.esp:000812"]
        self.assertEqual((ln["info"], ln["topic"], ln["quest"]), ("Fixture.esp:000911", "Fixture.esp:000910", QUEST))
        self.assertEqual((ln["conditions"][0]["fn"], ln["conditions"][0]["param"]), ("GetIsID", "Fixture.esp:000830"))

    def test_package_says_the_topic(self):
        pack = record("PACK", 0x920, [sub("EDID", zs("FXForcegreet")), sub("PDTO", u32(0) + u32(0x814))])
        qust = record("QUST", 0x800, [sub("EDID", zs("FXQuest")), sub("ALST", u32(2)), sub("ALID", zs("Vilkas")), sub("ALPC", u32(0x920)), sub("ALED", b""),
                                      sub("ALST", u32(3)), sub("ALID", zs("Other")), sub("ALED", b"")])
        topics, runs = sc.read_packages(plugin(group("PACK", [pack]), group("QUST", [qust])), PLUGIN)
        self.assertEqual(topics, {"Fixture.esp:000814": ["Fixture.esp:000920"]})
        self.assertEqual(runs, {"Fixture.esp:000920": [(QUEST, 2)]})


class SecondStepTest(unittest.TestCase):
    """WO-115 gap 4: what moves a quest from its first objective to its second, not its own stage fragments."""

    def test_moves_between_the_objectives(self):
        quest = {"objectives": [{"index": 10}, {"index": 20}]}
        shows = lambda obj, at: ({"kind": "quest", "quest": "C00", "stage": at, "fragment": True, "script": "QF"},  # noqa: E731
                                 {"call": "SetObjectiveDisplayed", "quest": "C00", "objective": obj, "function": "Fragment_1"})
        talk = ({"kind": "dialogue", "info": "Kodlak", "quest": "C00", "script": "TIF"}, {"call": "SetStage", "quest": "C00", "stage": 20, "function": "Fragment_0"})
        own = ({"kind": "quest", "quest": "C00", "stage": 15, "fragment": True, "script": "QF"}, {"call": "SetStage", "quest": "C00", "stage": 20, "function": "Fragment_2"})
        later = ({"kind": "dialogue", "info": "Late", "quest": "C00", "script": "TIF"}, {"call": "SetStage", "quest": "C00", "stage": 30, "function": "Fragment_0"})
        events = [shows(10, 10), shows(20, 20), talk, own, later]
        self.assertEqual(sc.first_objective_stage("C00", quest, events), 10)
        objective, stage, moves = sc.second_step("C00", quest, 10, events)
        self.assertEqual((objective, stage, [c["info"] for c, _ in moves]), (20, 20, ["Kodlak"]))
        self.assertEqual(sc.second_step("C00", {"objectives": [{"index": 10}]}, 10, events), (None, None, []))


if __name__ == "__main__":
    unittest.main()
