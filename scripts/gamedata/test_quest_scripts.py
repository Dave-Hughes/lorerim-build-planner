"""
pex.py and quest_scripts.py against a compiled script, a VMAD and a BSA built here, byte for byte as the
game's tools write them.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import struct
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pex  # noqa: E402
import quest_scripts as qs  # noqa: E402

QUEST, OTHER, SWORD = "Fixture.esp:000800", "Fixture.esp:000801", "Fixture.esp:000820"


class Pex:
    """A tiny .pex writer: one object, autovar properties, one state, functions of plain instructions."""

    def __init__(self, name):
        self.name, self.strings = name, []

    def s(self, text):
        if text not in self.strings:
            self.strings.append(text)
        return self.strings.index(text)

    def value(self, v):
        if v is None:
            return b"\x00"
        if isinstance(v, bool):
            return b"\x05" + bytes([v])
        if isinstance(v, int):
            return b"\x03" + struct.pack(">i", v)
        if isinstance(v, str) and v.startswith('"'):
            return b"\x02" + struct.pack(">H", self.s(v.strip('"')))
        return b"\x01" + struct.pack(">H", self.s(v))

    def function(self, name, code, params=()):
        out = struct.pack(">HHIB", self.s("None"), self.s(""), 0, 0)
        out += struct.pack(">H", len(params)) + b"".join(struct.pack(">HH", self.s(n), self.s(t)) for n, t in params)
        out += struct.pack(">H", 0) + struct.pack(">H", len(code))
        ops = {n: (op, cnt, extra) for op, (n, cnt, extra) in pex.OPCODES.items()}
        for opname, args in code:
            op, cnt, extra = ops[opname]
            out += bytes([op]) + b"".join(self.value(a) for a in args[:cnt])
            if extra:
                rest = args[cnt:]
                out += self.value(len(rest)) + b"".join(self.value(a) for a in rest)
        return struct.pack(">H", self.s(name)) + out

    def build(self, props, funcs):
        body = struct.pack(">HHIH", self.s("Quest"), self.s(""), 0, self.s(""))
        body += struct.pack(">H", 0)  # variables
        body += struct.pack(">H", len(props))
        for p, t in props:
            body += struct.pack(">HHHIB", self.s(p), self.s(t), self.s(""), 0, 4 | 3) + struct.pack(">H", self.s(f"::{p}_var"))
        body += struct.pack(">H", 1) + struct.pack(">H", self.s("")) + struct.pack(">H", len(funcs))
        body += b"".join(self.function(n, c) for n, c in funcs)
        obj = struct.pack(">H", self.s(self.name)) + struct.pack(">I", len(body) + 4) + body
        head = struct.pack(">IBBHQ", pex.MAGIC, 3, 2, 1, 0)
        for t in (self.name + ".psc", "fixture", "fixture"):
            head += struct.pack(">H", len(t)) + t.encode()
        table = struct.pack(">H", len(self.strings)) + b"".join(struct.pack(">H", len(t)) + t.encode() for t in self.strings)
        return head + table + b"\x00" + struct.pack(">H", 0) + struct.pack(">H", 1) + obj


def fragment_script():
    """QF_Fixture: Fragment_0 gives the player the Reward property and sets stage 10 of OtherQuest."""
    w = Pex("QF_Fixture")
    for t in ("None", "", "Quest", "QF_Fixture", "::temp0", "::NoneVar", "game", "GetPlayer", "AddItem", "SetStage", "self"):
        w.s(t)
    code = [("callstatic", ["game", "GetPlayer", "::temp0"]),
            ("callmethod", ["AddItem", "::temp0", "::NoneVar", "::Reward_var", 1, False]),
            ("callmethod", ["SetStage", "::OtherQuest_var", "::NoneVar", 10])]
    return w.build([("Reward", "weapon"), ("OtherQuest", "quest")], [("Fragment_0", code)])


def wstr(s):
    return struct.pack("<H", len(s)) + s.encode()


def vmad_qust():
    """VMAD 5, object format 2: QF_Fixture with two properties, and its fragment table (stage 20 -> Fragment_0)."""
    props = [("Reward", 0x820), ("OtherQuest", 0x801)]
    out = struct.pack("<hhH", 5, 2, 1) + wstr("QF_Fixture") + b"\x00" + struct.pack("<H", len(props))
    for n, fid in props:
        out += wstr(n) + bytes([1, 1]) + struct.pack("<hhI", 0, -1, fid)
    out += b"\x02" + struct.pack("<H", 1) + wstr("QF_Fixture")
    out += struct.pack("<HhiB", 20, 0, 0, 1) + wstr("QF_Fixture") + wstr("Fragment_0")
    out += struct.pack("<H", 0)
    return out


def bsa(files):
    """A BSA version 105, uncompressed, folder and file names included: {'scripts\\\\x.pex': bytes}."""
    folders = {}
    for path, data in files.items():
        folder, name = path.rsplit("\\", 1)
        folders.setdefault(folder, []).append((name, data))
    names = b"".join(n.encode() + b"\0" for fs in folders.values() for n, _ in fs)
    folder_block = b""
    header_len = 36 + 24 * len(folders)
    blocks_len = sum(len(f) + 2 + 16 * len(fs) for f, fs in folders.items())
    data_at = header_len + blocks_len + len(names)
    recs, blob = b"", b""
    for folder, fs in folders.items():
        recs += struct.pack("<QIIQ", 0, len(fs), 0, 0)
        folder_block += bytes([len(folder) + 1]) + folder.encode() + b"\0"
        for _, data in fs:
            folder_block += struct.pack("<QII", 0, len(data), data_at + len(blob))
            blob += data
    head = struct.pack("<4sIIIIIIII", b"BSA\x00", 105, 36, 3, len(folders), len(files), sum(len(f) + 1 for f in folders), len(names), 0)
    return head + recs + folder_block + names + blob


class ReaderTest(unittest.TestCase):
    def test_reads_a_compiled_script(self):
        p = pex.read_pex(fragment_script())
        obj = p["objects"][0]
        self.assertEqual((obj["name"], obj["parent"]), ("QF_Fixture", "Quest"))
        self.assertEqual([(x["name"], x["autovar"]) for x in obj["properties"]], [("Reward", "::Reward_var"), ("OtherQuest", "::OtherQuest_var")])
        (_, f), = list(pex.functions(p))
        self.assertEqual(f["name"], "Fragment_0")
        self.assertEqual([op for op, _ in f["code"]], ["callstatic", "callmethod", "callmethod"])
        self.assertEqual([a[1] for a in f["code"][1][1]], ["AddItem", "::temp0", "::NoneVar", "::Reward_var", 1, False])

    def test_bad_magic(self):
        with self.assertRaises(pex.PexError):
            pex.read_pex(b"\x00" * 40)


class VmadTest(unittest.TestCase):
    def test_fragment_mapped_to_its_stage(self):
        vm = qs.parse_vmad(vmad_qust(), [], "Fixture.esp", "QUST")
        self.assertEqual(vm["fragments"], [{"stage": 20, "log": 0, "script": "QF_Fixture", "function": "Fragment_0"}])
        self.assertEqual(vm["scripts"][0]["props"]["reward"], {"form": SWORD, "alias": -1})


class AnalyzerTest(unittest.TestCase):
    def test_additem_through_a_property_and_setstage_on_another_quest(self):
        names = {SWORD: {"type": "WEAP", "edid": "FXSword", "name": "Reward Sword"}, OTHER: {"type": "QUST", "edid": "FXOther", "name": "The Other Quest"},
                 QUEST: {"type": "QUST", "edid": "FXQuest", "name": "The Quest"}}
        scripts = {"QF_Fixture": pex.read_pex(fragment_script())}
        vm = qs.parse_vmad(vmad_qust(), [], "Fixture.esp", "QUST")
        an = qs.Analyzer(scripts, names, {})
        events = an.run("QF_Fixture", vm["scripts"][0]["props"], {"quest": QUEST}, ["Fragment_0"])
        add = next(e for e in events if e["call"] == "AddItem")
        self.assertEqual(qs.item_of(add, names), {"id": SWORD, "name": "Reward Sword", "type": "WEAP", "count": 1})
        self.assertIn({"call": "SetStage", "quest": OTHER, "stage": 10, "function": "Fragment_0"}, events)

    def test_started_by_another_quests_stage(self):
        kept = [{"id": OTHER, "edid": "FXOther", "name": "The Other Quest", "stages": [{"index": 10, "log": ["It begins."]}], "objectives": []}]
        events = [({"kind": "quest", "quest": QUEST, "script": "QF_Fixture", "stage": 20, "fragment": True}, {"call": "SetStage", "quest": OTHER, "stage": 10, "function": "Fragment_0"})]
        names = {QUEST: {"type": "QUST", "edid": "FXQuest", "name": "The Quest"}}
        rows = qs.build_quests(kept, {}, events, names, {}, lambda r: None)
        self.assertEqual(rows[OTHER]["startedBy"][0]["by"], "quest script")
        self.assertEqual(qs.starter_text(rows[OTHER]["startedBy"][0]), "The Quest stage 20 (SetStage 10)")


class WinnerTest(unittest.TestCase):
    def test_loose_beats_bsa(self):
        with tempfile.TemporaryDirectory() as tmp:
            mod = os.path.join(tmp, "Mod")
            os.makedirs(os.path.join(mod, "scripts"))
            with open(os.path.join(mod, "scripts", "QF_Fixture.pex"), "wb") as f:
                f.write(fragment_script())
            archive = os.path.join(tmp, "Other.bsa")
            with open(archive, "wb") as f:
                f.write(bsa({"scripts\\qf_fixture.pex": b"older", "scripts\\onlyinbsa.pex": fragment_script()}))
            s = pex.Scripts(tmp, [], archives=[archive], loose_dirs=[mod])
            self.assertEqual(s.where("QF_Fixture")[0], "loose")
            self.assertEqual(s.where("OnlyInBsa"), ("bsa", archive))
            self.assertEqual(s.get("OnlyInBsa")["objects"][0]["name"], "QF_Fixture")
            self.assertIsNone(s.get("NotAnywhere"))


if __name__ == "__main__":
    unittest.main()
