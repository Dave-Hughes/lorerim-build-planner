import json
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(__file__))
import quest_reads as qr  # noqa: E402


def batch(folder, name, quests, checks=None):
    with open(os.path.join(folder, name), "w", encoding="utf-8") as f:
        json.dump({"checks": checks or [], "quests": quests}, f)


class LoadReadsTest(unittest.TestCase):
    def test_no_folder_is_no_reads(self):
        self.assertEqual(qr.load_reads("/no/such/folder"), {})

    def test_a_read_keeps_its_fields_and_what_the_checker_fixed_and_drops_the_evidence(self):
        with tempfile.TemporaryDirectory() as d:
            batch(d, "000.json", [{"edid": "MS07", "name": "Lights Out!", "plugin": "Skyrim.esm", "canDo": "talk", "firstStep": "Talk to Jaree-Ra", "evidence": ["QUST:0x1"], "starts": [{"who": "Jaree-Ra"}]}],
                  [{"edid": "MS07", "verdicts": {"firstStep": {"verdict": "fix", "note": "x"}, "canDo": {"verdict": "agree", "note": ""}}}])
            got = qr.load_reads(d)["MS07"]
            self.assertEqual(got["firstStep"], "Talk to Jaree-Ra")
            self.assertEqual(got["fixed"], ["firstStep"])
            self.assertNotIn("plugin", got)
            self.assertNotIn("evidence", got)

    def test_an_unknown_canDo_is_dropped_not_guessed(self):
        with tempfile.TemporaryDirectory() as d:
            batch(d, "000.json", [{"edid": "A", "name": "A", "canDo": "maybe"}])
            self.assertNotIn("canDo", qr.load_reads(d)["A"])

    def test_a_later_batch_wins_and_a_nameless_read_is_skipped(self):
        with tempfile.TemporaryDirectory() as d:
            batch(d, "000.json", [{"edid": "A", "name": "A", "firstStep": "one"}, {"edid": "B"}])
            batch(d, "001.json", [{"edid": "A", "name": "A", "firstStep": "two"}])
            got = qr.load_reads(d)
            self.assertEqual(got["A"]["firstStep"], "two")
            self.assertNotIn("B", got)


class UnsureTest(unittest.TestCase):
    def test_a_note_that_names_a_record_keeps_its_field_and_loses_its_words(self):
        got = qr.player_unsure([
            {"field": "rewards", "why": "the script holds a Blades Katana; the records don't show whether it is handed over"},
            {"field": "powers", "why": "the power is SQL_Mortal_Spell_Power_VampiresSeduction in Big Tweaks.esp"},
            {"field": "people", "why": "A second quest (Skyrim.esm:0BC096) exists"},
            {"why": "no field"},
        ])
        self.assertEqual(got, [{"field": "rewards", "why": "the script holds a Blades Katana; the records don't show whether it is handed over"}, {"field": "powers"}, {"field": "people"}])


class AttachTest(unittest.TestCase):
    def test_a_quest_with_a_read_says_reads_and_one_without_says_rules(self):
        lines = [{"quests": [{"edid": "A"}, {"edid": "B"}]}]
        have, without, unmatched = qr.attach_reads(lines, {"A": {"canDo": "talk"}, "Z": {}})
        self.assertEqual((have, without, unmatched), (1, 1, ["Z"]))
        self.assertEqual(lines[0]["quests"][0]["source"], "reads")
        self.assertEqual(lines[0]["quests"][0]["read"], {"canDo": "talk"})
        self.assertEqual(lines[0]["quests"][1]["source"], "rules")
        self.assertNotIn("read", lines[0]["quests"][1])


if __name__ == "__main__":
    unittest.main()
