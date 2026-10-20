"""
story_check_all.py's batches, from the committed quests.json.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import story_check_all as sca  # noqa: E402


class BatchTest(unittest.TestCase):
    def test_stories_start_with_the_named_lines(self):
        lines = sca.batch_lines("stories", "5.0.4.8")
        self.assertEqual(lines[:3], ["main-quest", "companions", "college"])
        self.assertIn("vigilants", lines)
        self.assertEqual(len(lines), len(set(lines)))

    def test_categories_cover_their_lines(self):
        guilds = sca.batch_lines("guilds", "5.0.4.8")
        self.assertIn("companions", guilds)
        self.assertNotIn("main-quest", guilds)

    def test_unknown_batch(self):
        with self.assertRaises(SystemExit):
            sca.batch_lines("everything", "5.0.4.8")

    def test_checkpoint_round_trip(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, ".checkpoint-stories.json")
            self.assertEqual(sca.load_checkpoint(path), {})
            sca.save_checkpoint(path, {"done": {"companions": "ok"}})
            self.assertEqual(sca.load_checkpoint(path), {"done": {"companions": "ok"}})


if __name__ == "__main__":
    unittest.main()
