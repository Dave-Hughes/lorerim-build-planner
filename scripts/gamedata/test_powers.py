"""
powers.py: the dragon words, the skip list and the dedupe.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import powers  # noqa: E402


class DragonWords(unittest.TestCase):
    def test_digits_are_long_vowels(self):
        self.assertEqual([powers.dragon_word(w) for w in ["Fus", "Ro", "D4"]], ["Fus", "Ro", "Dah"])
        self.assertEqual(powers.dragon_word("T3d"), "Tiid")


class Skipped(unittest.TestCase):
    def test_exact_and_prefix(self):
        skip = ["Examine", "Dismiss …"]
        self.assertTrue(powers.skipped("Examine", skip))
        self.assertTrue(powers.skipped("Dismiss Follower", skip))
        self.assertFalse(powers.skipped("Examined", skip))


if __name__ == "__main__":
    unittest.main()
