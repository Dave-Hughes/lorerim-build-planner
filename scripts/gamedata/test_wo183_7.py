"""WO-183 Part 7: what was missing altogether (Creation Club plugins' strings live in their own archive)."""
import os
import struct
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bsa  # noqa: E402
import quest_pages as qp  # noqa: E402


def table(strings):
    """A STRINGS table: {id: text} as the game writes it."""
    body, index = b"", []
    for sid, text in strings.items():
        index.append((sid, len(body)))
        body += text.encode("utf-8") + b"\0"
    head = struct.pack("<II", len(index), len(body)) + b"".join(struct.pack("<II", s, o) for s, o in index)
    return head + body


def archive(path, files):
    """A minimal v105 BSA with one folder and the given {file name: bytes}, stored uncompressed."""
    names = sorted(files)
    folder = b"strings"
    names_blob = b"".join(n.encode() + b"\0" for n in names)
    header_size = 36
    folder_rec = 24
    block = 1 + len(folder) + 1 + 16 * len(names)
    data_at = header_size + folder_rec + block + len(names_blob)
    out = struct.pack("<4sIIIIIIII", b"BSA\0", 105, header_size, 0x3, 1, len(names), len(folder) + 1, len(names_blob), 0)
    out += struct.pack("<QIIQ", 0, len(names), 0, 0)
    out += bytes([len(folder) + 1]) + folder + b"\0"
    off = data_at
    for n in names:
        out += struct.pack("<QII", 0, len(files[n]), off)
        off += len(files[n])
    out += names_blob + b"".join(files[n] for n in names)
    open(path, "wb").write(out)


class PluginArchive(unittest.TestCase):
    def test_a_plugins_own_archive_gives_its_english_strings(self):
        with tempfile.TemporaryDirectory() as d:
            archive(os.path.join(d, "ccx-test.bsa"), {"ccx-test_english.strings": table({5: "Blue in the Face"}), "ccx-test_french.strings": table({5: "Bleu"})})
            kinds = bsa.plugin_strings_kinds(os.path.join(d, "ccx-test.esl"), "ccx-test.esl")
            self.assertEqual(kinds["STRINGS"], {5: "Blue in the Face"})
            self.assertEqual(kinds["DLSTRINGS"], {})

    def test_no_archive_is_no_strings(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(bsa.plugin_strings_kinds(os.path.join(d, "none.esl"), "none.esl"), {"STRINGS": {}, "DLSTRINGS": {}, "ILSTRINGS": {}})


class FishingTotals(unittest.TestCase):
    def test_a_total_the_game_sets_is_not_zero_but_a_count_that_starts_at_zero_is(self):
        globals_ = {"ccbgssse001_radiantobjtotal": 0.0, "ccbgssse001_radiantobjcount": 0.0, "somecount": 0.0}
        self.assertEqual(qp.fill_text("Obtain <Global=ccBGSSSE001_RadiantObjTotal> brook bass", {}, globals_), "Obtain the amount the game sets brook bass")
        self.assertEqual(qp.fill_text("Find <Global=SomeCount> pages", {}, globals_), "Find 0 pages")


class CoGivers(unittest.TestCase):
    def test_a_giver_with_another_on_the_other_side_is_not_the_one_giver(self):
        entry = {"namedGiver": {"name": "Captain Yrsarald Thrice-Pierced", "where": []},
                 "giver": {"name": "Captain Yrsarald Thrice-Pierced", "others": [{"name": "Legate Adventus Caesennius", "stageBelow": 221}]}}
        self.assertEqual(qp.giver_of(entry)["also"], ["Legate Adventus Caesennius"])
        self.assertNotIn("also", qp.giver_of({"namedGiver": {"name": "Delphine", "where": []}}))


if __name__ == "__main__":
    unittest.main()
