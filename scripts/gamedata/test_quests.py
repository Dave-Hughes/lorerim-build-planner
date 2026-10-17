"""
quests.py against a small localized plugin built here, byte for byte as the game writes one, with its
text in STRINGS and DLSTRINGS tables.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import struct
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import esp  # noqa: E402
import quests  # noqa: E402

PLUGIN = "Fixture.esp"
TEXT = {
    1: "The Fixture Prince",
    2: "Machinery",
    3: "Find the shrine",
    4: "Slay the champion",
    10: "A voice in a dream told me to find a shrine in the hills.",
    11: "I found the shrine. The prince wants a champion slain.",
    12: "The prince is pleased, and gave me a ring.",
}
STRINGS = (1, 2, 3, 4)  # names and objectives; the log entries (10-12) are in DLSTRINGS


def sub(t, data):
    return t.encode() + struct.pack("<H", len(data)) + data


def zs(s):
    return s.encode() + b"\0"


def sid(n):
    return struct.pack("<I", n)


def record(t, fid, subs, flags=0):
    data = b"".join(subs)
    return t.encode() + struct.pack("<IIIIHH", len(data), flags, fid, 0, 44, 0) + data


def group(label, records):
    body = b"".join(records)
    return b"GRUP" + struct.pack("<I", 24 + len(body)) + label.encode() + struct.pack("<IHHHH", 0, 0, 0, 0, 0) + body


def dnam(qtype):
    return sub("DNAM", struct.pack("<HBBII", 0x11, 50, 0, 0, qtype))


def stage(index, entries):
    out = [sub("INDX", struct.pack("<HBB", index, 0, 0))]
    for text_id, flags in entries:
        out += [sub("QSDT", bytes([flags])), sub("CNAM", sid(text_id))]
    return out


def objective(index, text_id):
    return [sub("QOBJ", struct.pack("<H", index)), sub("FNAM", struct.pack("<I", 0)), sub("NNAM", sid(text_id))]


def fixture():
    tes4 = record("TES4", 0, [sub("HEDR", struct.pack("<fII", 1.7, 0, 0x800))], flags=0x80)  # localized
    daedric = [sub("EDID", zs("FXDA01")), sub("FULL", sid(1)), dnam(7)]
    daedric += stage(20, [(11, 0)]) + stage(10, [(10, 0)]) + stage(5, []) + stage(200, [(12, quests.COMPLETES)])
    daedric += objective(20, 4) + objective(10, 3)
    # Aliases follow the objectives; their FNAM and names must not leak into the objectives.
    daedric += [sub("ANAM", struct.pack("<I", 1)), sub("ALST", struct.pack("<I", 0)), sub("ALID", zs("Champion")), sub("FNAM", struct.pack("<I", 0)), sub("ALED", b"")]
    machinery = [sub("EDID", zs("FXDialogue")), sub("FULL", sid(2)), dnam(0)] + stage(0, [])
    unnamed = [sub("EDID", zs("FXUnnamed")), dnam(6)] + objective(0, 3)
    deleted = [sub("EDID", zs("FXDeleted")), sub("FULL", sid(1)), dnam(8)] + objective(0, 3)
    return tes4 + group("QUST", [record("QUST", 0x800, daedric), record("QUST", 0x801, machinery), record("QUST", 0x802, unnamed),
                                 record("QUST", 0x803, deleted, flags=0x20)])


def string_table(entries, lengths):
    """A STRINGS (zero-terminated) or DLSTRINGS (length-prefixed) table, as the game writes them."""
    data, directory = b"", b""
    for i, s in entries:
        directory += struct.pack("<II", i, len(data))
        b = s.encode() + b"\0"
        data += (struct.pack("<I", len(b)) + b) if lengths else b
    return struct.pack("<II", len(entries), len(data)) + directory + data


def extract(tmp):
    os.makedirs(os.path.join(tmp, "Strings"))
    with open(os.path.join(tmp, "Strings", "Fixture_english.STRINGS"), "wb") as f:
        f.write(string_table([(i, TEXT[i]) for i in STRINGS], False))
    with open(os.path.join(tmp, "Strings", "Fixture_english.DLSTRINGS"), "wb") as f:
        f.write(string_table([(i, t) for i, t in TEXT.items() if i not in STRINGS], True))
    strings = esp.localized_strings(os.path.join(tmp, PLUGIN), PLUGIN)
    recs = quests.read_plugin(fixture(), PLUGIN, strings)
    return quests.index_quests(recs, {tuple(r["key"]): [PLUGIN] for r in recs})


class QuestTest(unittest.TestCase):
    def setUp(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.quests, self.counts = extract(tmp)
        self.q = self.quests[0]

    def test_player_facing_filter(self):
        self.assertEqual(self.counts, {"read": 4, "named": 2, "with text": 2, "kept": 1})
        self.assertEqual([q["edid"] for q in self.quests], ["FXDA01"])

    def test_name_and_type_from_the_records(self):
        self.assertEqual((self.q["id"], self.q["name"], self.q["type"], self.q["plugin"]), ("Fixture.esp:000800", "The Fixture Prince", "Daedric", PLUGIN))

    def test_stages_in_order_with_log_text(self):
        self.assertEqual([s["index"] for s in self.q["stages"]], [5, 10, 20, 200])
        self.assertEqual([s.get("log") for s in self.q["stages"]], [None, [TEXT[10]], [TEXT[11]], [TEXT[12]]])
        self.assertTrue(self.q["stages"][-1]["completes"])
        self.assertNotIn("completes", self.q["stages"][1])

    def test_objectives(self):
        self.assertEqual(self.q["objectives"], [{"index": 10, "text": TEXT[3]}, {"index": 20, "text": TEXT[4]}])

    def test_first_entry(self):
        self.assertEqual(quests.first_entry(self.q), TEXT[10])


class LineTest(unittest.TestCase):
    def q(self, edid, qtype, source, plugin="Skyrim.esm", log=True, name=None):
        stages = [{"index": 10, "log": [f"{edid} begins."]}] if log else [{"index": 10}]
        return {"id": f"{plugin}:{len(edid):06X}{edid}", "edid": edid, "name": name or edid, "type": qtype, "plugin": plugin, "source": source,
                "stages": stages, "objectives": [{"index": 0, "text": f"Do {edid}"}]}

    def test_lines(self):
        qs = [
            self.q("MQ102", "Main Quest", "Skyrim"), self.q("MQ101", "Main Quest", "Skyrim"),
            self.q("DA01", "Daedric", "Skyrim"), self.q("DA02", "Daedric", "Skyrim"),
            self.q("FavorA", "Misc", "Skyrim"), self.q("SideA", "Side Quest", "Skyrim"),
            self.q("zzzQ10", "Side Quest", "Big Mod", "Big.esp"), self.q("zzzQ2", "Side Quest", "Big Mod", "Big.esp", name="Big Mod"),
            self.q("zzzBounty", "Misc", "Big Mod", "Big.esp", log=False),
        ]
        lines = {g["name"]: g for g in quests.quest_lines(qs)}
        self.assertEqual(sorted(lines), ["Big Mod", "DA01", "DA02", "Main Quest", "Miscellaneous", "Side quests"])
        main = lines["Main Quest"]
        self.assertEqual((main["kind"], main["count"], main["begins"]), ("story", 2, "MQ101 begins."))
        mod = lines["Big Mod"]
        # EDID order counts numbers as numbers; the opening is the quest named after the mod.
        self.assertEqual([q.split(":")[1][6:] for q in mod["quests"]], ["zzzBounty", "zzzQ2", "zzzQ10"])
        self.assertEqual((mod["kind"], mod["journal"], mod["begins"], mod["plugins"]), ("mod", 2, "zzzQ2 begins.", ["Big.esp"]))
        self.assertEqual(mod["types"], {"Side Quest": 2, "Misc": 1})
        self.assertEqual(lines["DA02"]["kind"], "daedric")
        self.assertEqual(quests.quest_lines(qs)[0]["name"], "Big Mod")  # biggest first


if __name__ == "__main__":
    unittest.main()
