"""
quest_givers.py against a small plugin built here, byte for byte as the game writes one.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import struct
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import quest_givers as qg  # noqa: E402

PLUGIN = "Fixture.esp"
QUEST = "Fixture.esp:000800"


def sub(t, data):
    return t.encode() + struct.pack("<H", len(data)) + data


def zs(s):
    return s.encode() + b"\0"


def u32(n):
    return struct.pack("<I", n)


def record(t, fid, subs, flags=0):
    data = b"".join(subs)
    return t.encode() + struct.pack("<IIIIHH", len(data), flags, fid, 0, 44, 0) + data


def group(label, records, gtype=0):
    body = b"".join(records)
    lab = label.encode() if isinstance(label, str) else struct.pack("<I", label)
    return b"GRUP" + struct.pack("<I", 24 + len(body)) + lab + struct.pack("<iHHHH", gtype, 0, 0, 0, 0) + body


def ctda(fn, param, value=1.0, cmp=0, run_on=0):
    return sub("CTDA", struct.pack("<B3xfH2xIIIIi", cmp << 5, value, fn, param, 0, run_on, 0, -1))


def wstr(s):
    return struct.pack("<H", len(s)) + s.encode()


def vmad(script, props):
    """VMAD version 5, object format 2: one script with object properties."""
    out = struct.pack("<hhH", 5, 2, 1) + wstr(script) + b"\x00" + struct.pack("<H", len(props))
    for name, fid in props:
        out += wstr(name) + bytes([1, 1]) + struct.pack("<hhI", 0, -1, fid)
    return sub("VMAD", out)


def named(t, fid, edid, full):
    return record(t, fid, [sub("EDID", zs(edid)), sub("FULL", zs(full))])


def fixture():
    tes4 = record("TES4", 0, [sub("HEDR", struct.pack("<fII", 1.7, 0, 0x800))])
    quest = [sub("EDID", zs("FXGolden")), vmad("QF_FXGolden_00000800", [("Gold001", 0x830), ("RewardSword", 0x821), ("Alias_Lucan", 0x800)]),
             sub("FULL", zs("The Fixture Claw")), sub("ANAM", u32(3)),
             sub("ALST", u32(0)), sub("ALID", zs("Lucan")), sub("FNAM", u32(0x41)), sub("ALUA", u32(0x810)), sub("ALED", b""),
             sub("ALST", u32(1)), sub("ALID", zs("Claw")), sub("FNAM", u32(qg.QUEST_OBJECT)), sub("ALCO", u32(0x822)), sub("ALED", b""),
             sub("ALST", u32(2)), sub("ALID", zs("Prize")), sub("FNAM", u32(0)), sub("ALCO", u32(0x820)), sub("ALED", b""),
             sub("ALLS", u32(3)), sub("ALID", zs("Village")), sub("FNAM", u32(0)), sub("ALFL", u32(0x840)), sub("ALED", b"")]
    topic = record("DIAL", 0x850, [sub("EDID", zs("FXGoldenTopic")), sub("QNAM", u32(0x800))])
    infos = group(0x850, [
        record("INFO", 0x851, [ctda(qg.GET_STAGE, 0x800, 10.0, cmp=4), ctda(qg.GET_IS_ID, 0x811)]),        # Camilla, before stage 10
        record("INFO", 0x852, [ctda(qg.GET_STAGE, 0x800, 5.0, cmp=4), ctda(qg.GET_IS_ALIAS_REF, 0)]),      # alias Lucan, before stage 5
        record("INFO", 0x853, [ctda(qg.GET_IS_ID, 0x811)]),                                                # no stage: not a start
        record("INFO", 0x854, [ctda(qg.GET_STAGE, 0x800, 1.0, cmp=4), ctda(qg.GET_IS_ID, 0x811, run_on=1)]),  # runs on the target
    ], gtype=7)
    other = record("DIAL", 0x860, [sub("QNAM", u32(0x899))])
    other_infos = group(0x860, [record("INFO", 0x861, [ctda(qg.GET_STAGE, 0x800, 1.0, cmp=4), ctda(qg.GET_IS_ID, 0x811)])], gtype=7)
    return tes4 + b"".join([
        group("QUST", [record("QUST", 0x800, quest)]),
        group("DIAL", [topic, infos, other, other_infos]),
        group("SMEN", [record("SMEN", 0x870, [sub("PNAM", u32(0)), sub("ENAM", b"CLOC")])]),
        group("SMQN", [record("SMQN", 0x871, [sub("EDID", zs("FXStartNode")), sub("PNAM", u32(0x870)), sub("QNAM", u32(1)), sub("NNAM", u32(0x800))])]),
        group("NPC_", [named("NPC_", 0x810, "FXLucan", "Lucan Valerius"), named("NPC_", 0x811, "FXCamilla", "Camilla Valerius")]),
        group("LCTN", [named("LCTN", 0x840, "FXRiverwood", "Riverwood")]),
        group("WEAP", [named("WEAP", 0x820, "FXPrizeAxe", "Prize Axe"), named("WEAP", 0x821, "FXRewardSword", "Reward Sword"),
                       record("WEAP", 0x823, [sub("EDID", zs("FXEffectBlade"))])]),
        group("MISC", [named("MISC", 0x822, "FXGoldenClaw", "Golden Claw"), named("MISC", 0x830, "Gold001", "Septim")]),
    ])


class GiverTest(unittest.TestCase):
    def setUp(self):
        self.parts = qg.read_plugin(fixture(), PLUGIN, {QUEST})
        self.q = self.parts["quests"][QUEST]

    def test_unique_actor_and_location_aliases(self):
        by_name = {a["name"]: a for a in self.q["aliases"]}
        self.assertEqual(by_name["Lucan"]["actor"], "Fixture.esp:000810")
        self.assertEqual(by_name["Village"]["location"], "Fixture.esp:000840")
        self.assertEqual(by_name["Claw"]["flags"], qg.QUEST_OBJECT)

    def test_info_speaker_and_stage_conditions(self):
        infos = self.parts["infos"]
        self.assertEqual(set(infos), {"Fixture.esp:000851", "Fixture.esp:000852", "Fixture.esp:000853", "Fixture.esp:000854"})
        g = qg.likely_giver(QUEST, infos, self.q["aliases"], self.parts["names"], {})
        # The earliest stage wins (alias Lucan, before 5); Camilla (before 10) is listed too; the target-only and
        # stage-free INFOs don't count.
        self.assertEqual((g["npc"], g["stageBelow"], g["named"]), ("Fixture.esp:000810", 5, "alias Lucan"))
        self.assertEqual(g["others"], [{"npc": "Fixture.esp:000811", "stageBelow": 10}])

    def test_alco_item_and_script_property_rewards(self):
        rw = qg.rewards(self.q["aliases"], self.q["scripts"], self.parts["names"])
        self.assertEqual([(r["name"], r["type"], r["via"]) for r in rw],
                         [("Prize Axe", "weapon", "alias Prize"), ("Septim", "gold", "QF_FXGolden_00000800.Gold001"),
                          ("Reward Sword", "weapon", "QF_FXGolden_00000800.RewardSword")])

    def test_start_event(self):
        self.assertEqual(qg.start_events(QUEST, self.parts["nodes"]), [{"node": "FXStartNode", "event": "change location"}])

    def test_first_objective_filled_from_aliases(self):
        names = self.parts["names"]
        filled, ok = qg.fill_objective("Speak to <Alias=Lucan> in <Alias=Village>", self.q["aliases"], names, {})
        self.assertEqual((filled, ok), ("Speak to Lucan Valerius in Riverwood", True))
        self.assertEqual(qg.fill_objective("Collect <Alias=Item>", self.q["aliases"], names, {})[1], False)

    def test_placement(self):
        placed = {"Fixture.esp:000900": {"base": "Fixture.esp:000810", "cell": "Fixture.esp:000901", "deleted": False}}
        cells = {"Fixture.esp:000901": {"name": "Riverwood Trader", "location": "Fixture.esp:000840", "world": None}}
        where = qg.place("Fixture.esp:000810", placed, cells, self.parts["names"])
        self.assertEqual(qg.where_text(where[0]), "Riverwood Trader, Riverwood")


if __name__ == "__main__":
    unittest.main()
