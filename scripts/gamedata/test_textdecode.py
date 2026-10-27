import unittest

import textdecode
from textdecode import repair_lost, tidy_excerpt


class Decode(unittest.TestCase):
    def test_cp1252_where_it_is_not_utf8(self):
        self.assertEqual(b"we\x92ve heard \x93Greater\x94".decode("utf-8", "game"), "we’ve heard “Greater”")
        self.assertEqual("naïve ’".encode("utf-8").decode("utf-8", "game"), "naïve ’")

    def test_a_name_keeps_its_letter(self):
        self.assertEqual(b"Gh\xfbra".decode("utf-8", "game"), "Ghûra")


class Repair(unittest.TestCase):
    def test_punctuation_from_the_letters_around_it(self):
        self.assertEqual(repair_lost("What�s this? we�ve na�ve"), "What’s this? we’ve naïve")
        self.assertEqual(repair_lost("Searching for �ancient Nord wisdom�, are we"), "Searching for “ancient Nord wisdom”, are we")
        self.assertEqual(repair_lost("the rumors � Balgruuf"), "the rumors – Balgruuf")
        self.assertEqual(repair_lost("Saarthal�the first city�burned"), "Saarthal—the first city—burned")


class Excerpt(unittest.TestCase):
    def test_ends_on_a_sentence_or_a_word(self):
        self.assertEqual(tidy_excerpt("A whole sentence that is long enough. Another that stops at a cert"), "A whole sentence that is long enough.")
        self.assertEqual(tidy_excerpt("There is a test that the Nords put in place to keep th"), "There is a test that the Nords put in place to keep…")
        self.assertEqual(tidy_excerpt("Done."), "Done.")

    def test_a_window_starts_at_a_sentence(self):
        self.assertEqual(tidy_excerpt("ing of the tomb. The legend says so. It ends.", window=True), "The legend says so. It ends.")


if __name__ == "__main__":
    unittest.main()
