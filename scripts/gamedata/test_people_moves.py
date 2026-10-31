"""WO-185 Part 4: where a quest's stage moves a person to."""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import people_moves as pm  # noqa: E402


def cond(fn, cmp, value, quest="Q.esp:000001", stage=0, or_=False):
    return {"fn": fn, "cmp": cmp, "value": float(value), "param": quest, "stage": stage, "or": or_}


class Window(unittest.TestCase):
    def test_stage_bounds(self):
        self.assertEqual(pm.window([cond("GetStage", ">=", 10), cond("GetStage", "<", 27)]), ("Q.esp:000001", 10, 27))
        self.assertEqual(pm.window([cond("GetStage", "==", 30)]), ("Q.esp:000001", 30, 31))
        self.assertEqual(pm.window([cond("GetStage", ">=", 25)]), ("Q.esp:000001", 25, pm.INF))

    def test_a_stage_done_is_from_that_stage_and_not_done_is_until_it(self):
        self.assertEqual(pm.window([cond("GetStageDone", "==", 1, stage=55)]), ("Q.esp:000001", 55, pm.INF))
        self.assertEqual(pm.window([cond("GetStageDone", "==", 1, stage=20), cond("GetStageDone", "==", 0, stage=60)]), ("Q.esp:000001", 20, 60))

    def test_a_quest_done_is_after_it(self):
        self.assertEqual(pm.window([cond("GetQuestCompleted", "==", 1)]), ("Q.esp:000001", pm.INF, pm.INF))
        self.assertIsNone(pm.window([cond("GetQuestCompleted", "==", 0)]))  # not yet done is the day the person already has

    def test_anything_else_on_the_package_is_not_a_quests_move(self):
        self.assertIsNone(pm.window([cond("GetStage", ">=", 10), {"fn": "GetInFaction", "cmp": "==", "value": 1.0, "param": "F.esp:000002", "or": False}]))
        self.assertIsNone(pm.window([cond("GetStage", ">=", 10), cond("GetStage", "<", 20, quest="Other.esp:000003")]))
        self.assertIsNone(pm.window([cond("GetStage", ">=", 10, or_=True)]))
        self.assertIsNone(pm.window([]))


class Moves(unittest.TestCase):
    QUESTS = [{"id": "Q.esp:000001", "name": "The Ritual", "stages": [{"index": 10}, {"index": 25}, {"index": 70, "completes": True}]}]
    PLACES = {"fort justice": "Fort Justice", "riften": "Riften"}
    NAMES = {"The Ritual"}

    def moves(self, *packages):
        dump = {"P.esp:000010": {"name": "Someone", "packages": list(packages)}}
        return pm.moves_of(dump, self.QUESTS, self.PLACES, self.NAMES).get("P.esp:000010")

    @staticmethod
    def pack(conds, **loc):
        return {"edid": "Pkg", "conditions": conds, "location": {"type": 0, "target": "P.esp:000099", **loc}}

    def test_a_stage_that_ends_before_the_quest_does_is_during(self):
        self.assertEqual(self.moves(self.pack([cond("GetStage", ">=", 25), cond("GetStage", "<", 60)], cell="Fort Justice")), [{"when": "during", "quest": "The Ritual", "place": "Fort Justice"}])

    def test_from_the_finishing_stage_on_is_after(self):
        self.assertEqual(self.moves(self.pack([cond("GetStage", ">=", 70)], cell="Fort Justice")), [{"when": "after", "quest": "The Ritual", "place": "Fort Justice"}])
        self.assertEqual(self.moves(self.pack([cond("GetQuestCompleted", "==", 1)], place="Riften", cell="Riften Docks")), [{"when": "after", "quest": "The Ritual", "place": "Riften"}])

    def test_a_spot_with_no_name_is_left_out(self):
        self.assertIsNone(self.moves(self.pack([cond("GetStage", ">=", 25), cond("GetStage", "<", 60)])))  # a target and no cell: "around a spot by Riften"
        self.assertIsNone(self.moves(self.pack([cond("GetStage", ">=", 25), cond("GetStage", "<", 60)], cell="Honrich Atasel")))  # a cell no place page has
        self.assertIsNone(self.moves({"edid": "Follow", "conditions": [cond("GetStage", "==", 20)], "location": {"type": 12, "target": None}}))

    def test_a_quest_with_no_page_is_left_out(self):
        dump = {"P.esp:000010": {"name": "Someone", "packages": [self.pack([cond("GetStage", ">=", 25), cond("GetStage", "<", 60)], cell="Fort Justice")]}}
        self.assertEqual(pm.moves_of(dump, self.QUESTS, self.PLACES, set()), {})

    def test_one_place_for_each_window_the_first_package_wins(self):
        window = [cond("GetStage", ">=", 25), cond("GetStage", "<", 60)]
        got = self.moves(self.pack(window, cell="Fort Justice"), self.pack(window, place="Riften"))
        self.assertEqual(got, [{"when": "during", "quest": "The Ritual", "place": "Fort Justice"}])

    def test_what_comes_first_in_the_quest_comes_first(self):
        got = self.moves(
            self.pack([cond("GetStage", ">=", 70)], cell="Fort Justice"),
            self.pack([cond("GetStage", ">=", 10), cond("GetStage", "<", 25)], place="Riften"),
        )
        self.assertEqual([m["when"] for m in got], ["during", "after"])


if __name__ == "__main__":
    unittest.main()
