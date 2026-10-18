"""
quest_starts.py against two small plugins built here, byte for byte as the game writes them: a master
with a quest, a key, a global and two cells joined by doors, and a patch loaded after it that locks
the door with the key, gives the key to another quest's alias, adds a level condition to the quest
and sets the global.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import struct
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import quest_starts as qs  # noqa: E402

MASTER, PATCH = "Fixture.esm", "Patch.esp"
QUEST = "Fixture.esm:000800"


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


def tes4(masters=()):
    subs = [sub("HEDR", struct.pack("<fII", 1.7, 0, 0x800))]
    for m in masters:
        subs += [sub("MAST", zs(m)), sub("DATA", bytes(8))]
    return record("TES4", 0, subs)


def ctda(fn, value, cmp=3, param=0):
    return sub("CTDA", struct.pack("<B3xfH2xIIIIi", cmp << 5, value, fn, param, 0, 0, 0, -1))


def door(fid, to, lock_key=None):
    subs = [sub("NAME", u32(0x850)), sub("XTEL", u32(to) + bytes(28))]
    if lock_key is not None:
        subs.append(sub("XLOC", bytes([255, 0, 0, 0]) + u32(lock_key) + bytes(12)))
    return record("REFR", fid, subs + [sub("DATA", bytes(24))])


def quest(conds=()):
    return record("QUST", 0x800, [sub("EDID", zs("FXHomestead")), sub("FULL", zs("The Homestead")), sub("DNAM", struct.pack("<HBBII", 0, 0, 0, 0, 8)),
                                  *conds, sub("ANAM", u32(1)), sub("ALLS", u32(0)), sub("ALID", zs("Home")), sub("ALFL", u32(0x840)), sub("ALED", b"")])


def cells(door_a, door_t, more=()):
    """Cell A (the road) with door A into cell T (the homestead, at the quest's location), and back; one CELL group, as the game has."""
    return group("CELL", [
        record("CELL", 0x860, [sub("EDID", zs("FXRoad")), sub("FULL", zs("Old Road"))]), group(0x860, [door_a], gtype=8),
        record("CELL", 0x861, [sub("EDID", zs("FXHome")), sub("FULL", zs("Cemetery Homestead")), sub("XLCN", u32(0x840))]), group(0x861, [door_t], gtype=8),
        *more,
    ])


def master():
    return tes4() + b"".join([
        group("QUST", [quest()]),
        group("GLOB", [record("GLOB", 0x830, [sub("EDID", zs("FXHomesteadOpen")), sub("FNAM", b"s"), sub("FLTV", struct.pack("<f", 0.0))])]),
        group("DOOR", [record("DOOR", 0x850, [sub("EDID", zs("FXDoor"))])]),
        group("LCTN", [record("LCTN", 0x840, [sub("EDID", zs("FXHomeLocation")), sub("FULL", zs("Cemetery Homestead"))])]),
        group("NPC_", [record("NPC_", 0x870, [sub("EDID", zs("FXVighar")), sub("FULL", zs("Vighar"))])]),
        cells(door(0x880, 0x881), door(0x881, 0x880), [
            record("CELL", 0x862, [sub("EDID", zs("FXLair")), sub("FULL", zs("Bloodlet Throne"))]),
            group(0x862, [record("ACHR", 0x890, [sub("NAME", u32(0x870)), sub("DATA", bytes(24))])], gtype=8)]),
    ])


def patch():
    # Index 0 is the master; 1 is this plugin: its own key is 0x01000800.
    key = 0x01000800
    other = record("QUST", 0x01000900, [sub("EDID", zs("FXDarkAncestor")), sub("FULL", zs("Dark Ancestor")), sub("ANAM", u32(1)),
                                        sub("ALST", u32(0)), sub("ALID", zs("Vighar")), sub("ALUA", u32(0x870)),
                                        sub("COCT", u32(1)), sub("CNTO", struct.pack("<Ii", key, 1)), sub("ALED", b"")])
    return tes4([MASTER]) + b"".join([
        group("KEYM", [record("KEYM", key, [sub("EDID", zs("FXHomesteadKey")), sub("FULL", zs("Cemetery Homestead Key"))])]),
        group("QUST", [quest([ctda(80, 20.0), ctda(74, 1.0, cmp=0, param=0x830)]), other]),
        group("GLOB", [record("GLOB", 0x830, [sub("EDID", zs("FXHomesteadOpen")), sub("FNAM", b"s"), sub("FLTV", struct.pack("<f", 1.0))])]),
        cells(door(0x880, 0x881, lock_key=key), door(0x881, 0x880)),
    ])


class StartTest(unittest.TestCase):
    def setUp(self):
        self.m = qs.read_plugin(master(), MASTER, {QUEST})
        self.p = qs.read_plugin(patch(), PATCH, {QUEST})
        self.names = {**self.m["names"], **self.p["names"]}
        keys = {k for k, v in self.names.items() if v["type"] == "KEYM"}
        holders = {"Fixture.esm:000870"}
        self.mr = qs.read_refs(master(), MASTER, keys, holders)
        self.pr = qs.read_refs(patch(), PATCH, keys, holders)

    def test_condition_added_by_a_later_plugin(self):
        changes = qs.quest_changes([(MASTER, self.m["quests"][QUEST]), (PATCH, self.p["quests"][QUEST])])
        added = [(pl, d["added"]["fn"]) for pl, kind, d in changes if kind == "condition" and "added" in d]
        self.assertEqual(added, [(PATCH, "GetLevel"), (PATCH, "GetGlobalValue")])
        level = next(d["added"] for _, k, d in changes if k == "condition" and d["added"]["fn"] == "GetLevel")
        self.assertEqual(qs.describe_condition(level, self.names, {}), "level >= 20.0")

    def test_global_winning_value(self):
        versions = [(MASTER, self.m["globals"]["Fixture.esm:000830"]), (PATCH, self.p["globals"]["Fixture.esm:000830"])]
        self.assertEqual(versions, [(MASTER, 0.0), (PATCH, 1.0)])

    def test_door_lock_needing_a_key_and_who_carries_it(self):
        doors_m, _, cells_m, _, _ = self.mr
        doors_p, placed_p, cells_p, _, _ = self.pr
        _, placed_m, _, _, _ = self.mr
        versions = [(MASTER, doors_m["Fixture.esm:000880"]), (PATCH, doors_p["Fixture.esm:000880"])]
        changes = qs.door_changes(versions)
        self.assertEqual([(pl, d["what"]) for pl, _, d in changes], [(PATCH, "key")])
        lock = doors_p["Fixture.esm:000880"]["lock"]
        self.assertEqual(lock, {"level": 255, "key": "Patch.esp:000800"})
        carry = qs.carriers(lock["key"], {}, self.p["aliasItems"], {**placed_m, **placed_p}, {**cells_m, **cells_p}, self.names)
        self.assertEqual([(c["kind"], c["quest"], c["name"], c["places"]) for c in carry], [("quest alias", "Dark Ancestor", "Vighar", ["Bloodlet Throne"])])
        text = qs.plain_lock(versions[-1][1], "Cemetery Homestead", self.names, carry)
        self.assertEqual(text, "The Cemetery Homestead door needs the Cemetery Homestead Key, carried by Vighar in Bloodlet Throne.")

    def test_door_into_the_quests_place(self):
        doors, _, cells, _, _ = self.pr
        self.assertEqual(cells["Fixture.esm:000861"]["location"], "Fixture.esm:000840")  # the alias's location
        self.assertEqual((doors["Fixture.esm:000880"]["cell"], doors["Fixture.esm:000881"]["cell"]), ("Fixture.esm:000860", "Fixture.esm:000861"))

    def test_minor_lock_changes_dont_count(self):
        a = {"lock": {"level": 0}, "enable": None}
        b = {"lock": {"level": 25}, "enable": None}
        self.assertEqual([d["what"] for _, _, d in qs.door_changes([("Skyrim.esm", a), ("Requiem.esp", b)])], ["minor"])


if __name__ == "__main__":
    unittest.main()
