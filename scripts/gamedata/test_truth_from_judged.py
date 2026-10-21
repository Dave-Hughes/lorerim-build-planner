"""WO-121b Part 3: the answer key's rows from Bob's judged openings."""
import unittest

import truth_from_judged as tj


class JudgedRowsTest(unittest.TestCase):
    def test_a_confirmed_row_names_its_giver_place_and_step(self):
        j = {"line": "college", "opening": "First Lessons (MG01)", "verdict": "CONFIRMED", "url": "https://uesp.net/wiki/Skyrim:First_Lessons", "reason": "Matches.",
             "pageSays": 'Faralda, Hall of Countenance, Winterhold College; then "Join the College of Winterhold"'}
        row = tj.row_of(j, {}, {})
        self.assertEqual({k: row[k] for k in ("quest", "editorId", "startsWith", "where", "firstObjective", "source", "url")},
                         {"quest": "First Lessons", "editorId": "MG01", "startsWith": ["Faralda"], "where": "Hall of Countenance, Winterhold College",
                          "firstObjective": "Join the College of Winterhold", "source": "uesp", "url": "https://uesp.net/wiki/Skyrim:First_Lessons"})

    def test_a_no_giver_row_from_the_records_by_its_editor_id(self):
        j = {"line": "silenced-tongues", "opening": "dunVolunruudQST", "verdict": "NO_GIVER_OK", "url": "", "reason": "Starts by itself.",
             "pageSays": 'no one giver; then "Locate The Ceremonial Weapons"'}
        row = tj.row_of(j, {}, {"dunVolunruudQST": "Silenced Tongues"})
        self.assertEqual((row["quest"], row["noGiver"], row["startsWith"], row["source"]), ("Silenced Tongues", True, [], "records"))

    def test_a_step_seen_cut_short_takes_the_pages_words(self):
        j = {"line": "rise-in-the-east", "opening": "Rise in the East (MS08)", "verdict": "CONFIRMED", "url": "", "reason": "Right.",
             "pageSays": "Orthus Endario, East Empire Company, Windhelm; then Steal Suvaris Atheron's logbook..."}
        row = tj.row_of(j, {"MS08": {"then": "Steal Suvaris Atheron's logbook from the Windhelm docks"}}, {})
        self.assertEqual(row["firstObjective"], "Steal Suvaris Atheron's logbook from the Windhelm docks")


if __name__ == "__main__":
    unittest.main()
