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


class WaysTest(unittest.TestCase):
    def test_a_way_keeps_its_title_ends_and_steps_and_drops_the_evidence(self):
        with tempfile.TemporaryDirectory() as d:
            with open(os.path.join(d, "G01.json"), "w", encoding="utf-8") as f:
                json.dump({"quests": [{"edid": "MS07", "shape": "paths", "shared": [], "evidence": ["objective 125"],
                                       "ways": [{"title": "Report him", "ends": "He is arrested.", "steps": ["Report Jaree-Ra", "Find evidence"]}, {"ends": "no title"}],
                                       "unsure": [{"why": "Whether the evidence is on the Skeever"}, {"why": "the stage is QF_MS07_0001"}]},
                                      {"edid": "NoWays", "ways": []}]}, f)
            got = qr.load_ways(d)
            self.assertEqual(list(got), ["MS07"])
            self.assertEqual(got["MS07"]["ways"], [{"title": "Report him", "ends": "He is arrested.", "steps": ["Report Jaree-Ra", "Find evidence"]}])
            self.assertNotIn("evidence", got["MS07"])
            self.assertEqual(got["MS07"]["unsure"], [{"field": "ways", "why": "Whether the evidence is on the Skeever"}, {"field": "ways"}])

    def test_no_folder_is_no_ways(self):
        self.assertEqual(qr.load_ways("/no/such/folder"), {})


class LineReadsTest(unittest.TestCase):
    def test_a_line_read_keeps_the_page_fields_and_drops_the_evidence(self):
        with tempfile.TemporaryDirectory() as d:
            with open(os.path.join(d, "L01.json"), "w", encoding="utf-8") as f:
                json.dump({"checks": [{"id": "x"}], "lines": [{"id": "main-quest", "name": "The Dragonborn", "about": "A story.", "getIn": {"quest": "Unbound"}, "order": [], "branches": [], "gives": ["Thane"], "closes": [],
                                                              "unsure": [{"field": "order", "why": "needs Skyrim.esm:0123AB"}], "evidence": ["checked/000.json"]}]}, f)
            got = qr.load_line_reads(d)["main-quest"]
            self.assertEqual(got["about"], "A story.")
            self.assertNotIn("evidence", got)
            self.assertNotIn("name", got)
            self.assertEqual(got["unsure"], [{"field": "order"}])


class ChangedByTest(unittest.TestCase):
    plugins = {"AlternatePerspective.esp": {"folder": "Alternate Perspective", "modid": "50307"}, "Requiem.esp": {"folder": "Requiem - The Roleplaying Overhaul", "modid": "60888"}}
    name_of = staticmethod(lambda folder: folder)

    def test_a_mapped_mod_links_and_an_unmapped_one_is_named_from_its_file_and_listed(self):
        unmapped = set()
        q = {"editedBy": ["Update.esm", "Unofficial Skyrim Special Edition Patch.esp", "AlternatePerspective.esp", "SaveTheIcerunner.esp", "Requiem.esp", "Some Tweaks.esp", "SaveTheIcerunner.esp"]}
        got = qr.changed_by_of(q, self.plugins, {"name": "Base game"}, self.name_of, unmapped)
        self.assertEqual(got, [{"name": "Alternate Perspective", "modid": "50307"}, {"name": "Save the Icerunner"}])
        self.assertEqual(unmapped, {"SaveTheIcerunner.esp"})

    def test_the_quests_own_mod_and_a_second_plugin_of_a_named_mod_are_not_listed(self):
        q = {"editedBy": ["AlternatePerspective.esp", "Alternate Perspective - Gate to Sovngarde Edition.esp"]}
        self.assertEqual(qr.changed_by_of(q, self.plugins, {"name": "Elsewhere"}, self.name_of), [{"name": "Alternate Perspective", "modid": "50307"}])
        self.assertEqual(qr.changed_by_of(q, self.plugins, {"name": "Alternate Perspective"}, self.name_of), [])

    def test_a_plugin_file_is_read_as_words(self):
        self.assertEqual(qr.plugin_words("SaveTheIcerunner.esp"), "Save the Icerunner")
        self.assertEqual(qr.plugin_words("Caught Red Handed - Quest Expansion.esp"), "Caught Red Handed - Quest Expansion")


class AttachExtrasTest(unittest.TestCase):
    def test_ways_go_to_read_quests_changed_by_to_any_and_a_line_read_to_its_line(self):
        lines = [{"id": "a", "quests": [{"edid": "Q1", "read": {}}, {"edid": "Q2"}]}]
        tied, read_lines, none = qr.attach_extras(lines, {"Q1": {"ways": [1]}, "Q2": {"ways": [2]}}, {"a": {"about": "x"}, "gone": {}}, {"Q2": [{"name": "M"}]})
        self.assertEqual((tied, read_lines, none), (1, 1, ["gone"]))
        self.assertEqual(lines[0]["read"], {"about": "x"})
        self.assertEqual(lines[0]["quests"][0]["read"]["ways"], {"ways": [1]})
        self.assertNotIn("read", lines[0]["quests"][1])
        self.assertEqual(lines[0]["quests"][1]["changedBy"], [{"name": "M"}])
