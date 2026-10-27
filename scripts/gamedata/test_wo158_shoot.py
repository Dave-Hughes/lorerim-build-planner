"""
WO-158: the generated console bat files, checked for shape, not run (the game isn't part of this test suite).
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wo158_shoot as wo  # noqa: E402


class ShapeTest(unittest.TestCase):
    def test_toggles_only_live_in_start_and_end(self):
        # tm, tfc and tai are toggles -- running one twice flips it back off. They may only appear in the two
        # files meant to bracket the whole session, never inside a per-place or per-person shot.
        toggle_words = ("tm", "tfc", "tai")
        for name, slug, target, note in wo.PLACES:
            lines = wo.place_lines(target)
            self.assertFalse(any(line.split()[0] in toggle_words for line in lines), (slug, lines))
        for name, slug, target in wo.PEOPLE:
            others = [t for _, _, t in wo.PEOPLE if t != target]
            lines = wo.person_lines(target, others)
            self.assertFalse(any(line.split()[0] in toggle_words for line in lines), (slug, lines))
        self.assertEqual(set(l.split()[0] for l in wo.start_lines()) & set(toggle_words), set(toggle_words))

    def test_every_person_disables_exactly_the_other_four(self):
        all_targets = [t for _, _, t in wo.PEOPLE]
        for name, slug, target in wo.PEOPLE:
            others = [t for t in all_targets if t != target]
            lines = wo.person_lines(target, others)
            disabled = {l[len("prid "):] for i, l in enumerate(lines[:-1]) if l.startswith("prid ") and lines[i + 1] == "disable"}
            self.assertEqual(disabled, set(others))
            self.assertIn(f"prid {target}", lines)
            self.assertIn("enable", lines)
            self.assertIn("moveto player", lines)

    def test_every_target_is_unique(self):
        place_targets = [t for _, _, t, _ in wo.PLACES]
        people_targets = [t for _, _, t in wo.PEOPLE]
        self.assertEqual(len(place_targets), len(set(place_targets)))
        self.assertEqual(len(people_targets), len(set(people_targets)))

    def test_place_lines_set_weather_and_noon_before_moving(self):
        for name, slug, target, note in wo.PLACES:
            lines = wo.place_lines(target)
            self.assertEqual(lines[-1], f"player.moveto {target}")
            self.assertTrue(any(l.startswith("fw ") for l in lines))
            self.assertTrue(any("gamehour" in l for l in lines))


if __name__ == "__main__":
    unittest.main()
