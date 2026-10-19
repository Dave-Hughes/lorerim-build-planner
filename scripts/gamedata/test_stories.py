"""stories.py: the checks a hand-kept story must pass (WO-106)."""
import copy
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import stories  # noqa: E402

LINES = [
    {"id": "main-quest", "name": "The Dragonborn", "sources": [{"name": "Base game", "base": True}],
     "quests": [{"edid": "MQ101", "name": "Unbound", "xp": 200}, {"edid": "MQ102", "name": "Before the Storm", "xp": 200}, {"edid": "Freeform", "name": "Find the Word", "xp": 0}]},
    {"id": "wyrmstooth", "name": "Wyrmstooth", "sources": [], "quests": [{"edid": "WT", "name": "Wyrmstooth", "xp": 100}]},
    {"id": "rise-in-the-east", "name": "Rise in the East", "sources": [], "quests": [{"edid": "RE", "name": "Rise in the East", "xp": 100}]},
]
GOOD = {
    "id": "become-the-dragonborn", "line": "main-quest", "name": "Become the Dragonborn",
    "start": [{"text": "Take a Dragonborn start.", "checked": "files"}],
    "chapters": [{"name": "Escape Helgen", "quests": [
        {"edid": "MQ101", "task": "Make your way to the Keep", "checked": "files"},
        {"edid": "MQ102", "from": "MQ101", "task": "Talk to Alvor", "checked": "not yet"}]}],
    "alongside": [{"edid": "Freeform", "task": "Find the Word of Power", "checked": "files"}],
    "reward": {"text": "None.", "checked": "files"},
    "opens": [{"line": "wyrmstooth", "needs": [{"kind": "level", "level": 10, "text": "Level 10", "checked": "files"},
                                              {"kind": "line", "line": "rise-in-the-east", "text": "Rise in the East", "checked": "files"}]}],
}


def broken(change):
    s = copy.deepcopy(GOOD)
    change(s)
    return s


class StoriesTest(unittest.TestCase):
    def test_a_sound_story_builds_with_names_and_xp_joined_in(self):
        out = stories.build_stories([GOOD], LINES)[0]
        self.assertEqual(out["lineName"], "The Dragonborn")
        self.assertEqual(out["chapters"][0]["quests"][1]["name"], "Before the Storm")
        self.assertEqual(out["chapters"][0]["quests"][1]["xp"], 200)
        self.assertEqual(out["alongside"][0]["xp"], 0)
        self.assertEqual(out["opens"][0]["name"], "Wyrmstooth")

    def assertFails(self, story, words):
        with self.assertRaises(stories.StoryError) as e:
            stories.build_stories([story], LINES)
        self.assertIn(words, str(e.exception))

    def test_an_edid_not_in_the_line_fails(self):
        self.assertFails(broken(lambda s: s["chapters"][0]["quests"][0].update(edid="MQ999")), "MQ999 isn't a quest of main-quest")

    def test_a_quest_left_out_fails(self):
        self.assertFails(broken(lambda s: s.update(alongside=[])), "Freeform (main-quest) is in no chapter and not alongside")

    def test_a_quest_told_twice_fails(self):
        self.assertFails(broken(lambda s: s["alongside"].append({"edid": "MQ101", "task": "x", "checked": "files"})), "MQ101 is in the story 2 times")

    def test_a_from_outside_the_story_fails(self):
        self.assertFails(broken(lambda s: s["chapters"][0]["quests"][1].update({"from": "MQ050"})), "comes from MQ050, which isn't in the story")

    def test_an_opened_line_that_isnt_a_line_fails(self):
        self.assertFails(broken(lambda s: s["opens"][0].update(line="nowhere")), "opens 'nowhere', which isn't a line")

    def test_a_needs_line_that_isnt_a_line_fails(self):
        self.assertFails(broken(lambda s: s["opens"][0]["needs"][1].update(line="nowhere")), "is the line 'nowhere', which isn't a line")

    def test_checked_must_be_files_or_not_yet(self):
        self.assertFails(broken(lambda s: s["chapters"][0]["quests"][0].update(checked="players")), "MQ101 is checked 'players'")
        self.assertFails(broken(lambda s: s["reward"].update(checked=None)), "reward is checked None")


if __name__ == "__main__":
    unittest.main()
