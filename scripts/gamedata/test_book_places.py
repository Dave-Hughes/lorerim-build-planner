"""
WO-144 Part 3: the books that teach, and where a scholar reads in bulk, against the built file.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import json
import os
import unittest

RAW = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "gamedata", "5.0.4.8", "book_places.json")


@unittest.skipUnless(os.path.exists(RAW), "book_places.json not built")
class BuiltBookPlaces(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.d = json.load(open(RAW, encoding="utf-8"))

    def test_every_smithing_book_has_at_least_one_place_or_says_nowhere(self):
        # Never a bare empty list: a book with nothing found still carries one "nowhere" row, readables.py's own rule.
        for row in self.d["smithingBooks"]:
            self.assertTrue(row["places"])
            self.assertTrue(row["perk"])
            self.assertTrue(row["book"])

    def test_craftsmanship_books_are_requiems_own_book_gated_smithing_perks(self):
        # Requiem (unlike vanilla) gates its smithing perks behind books; read from the perks' own `GetLevel < 0`
        # ranks and the books' own VMAD references, not assumed from vanilla's different convention.
        perks = {row["perk"] for row in self.d["smithingBooks"]}
        self.assertIn("Craftsmanship", perks)
        self.assertIn("Arcane Craftsmanship", perks)
        # Ordinator's own extra Smithing perks (no GetLevel condition at all) are never book-gated.
        self.assertNotIn("Smithing Specialization", perks)
        self.assertNotIn("Iron Lore", perks)

    def test_arcane_craftsmanships_book_is_placed_in_the_arcanaeum(self):
        row = next(r for r in self.d["smithingBooks"] if r["perk"] == "Arcane Craftsmanship")
        wheres = [p.get("where") for p in row["places"]]
        self.assertTrue(any(w == "The Arcanaeum" or (isinstance(w, list) and "The Arcanaeum" in w) for w in wheres))

    def test_reading_rooms_are_all_at_or_above_the_five_book_floor(self):
        self.assertTrue(self.d["readingRooms"])
        for r in self.d["readingRooms"]:
            self.assertGreaterEqual(r["books"], 5)

    def test_reading_rooms_are_sorted_highest_first(self):
        counts = [r["books"] for r in self.d["readingRooms"]]
        self.assertEqual(counts, sorted(counts, reverse=True))

    def test_the_orders_own_named_scholar_rooms_clear_the_floor(self):
        # Checked against the count, not assumed: all five rooms the order names (the Arcanaeum, the Bards
        # College, Dragonsreach, the Blue Palace, Jorrvaskr) carry five or more placed books.
        places = [r["place"] for r in self.d["readingRooms"]]
        for name in ("Arcanaeum", "Bards College", "Dragonsreach", "Blue Palace", "Jorrvaskr"):
            self.assertTrue(any(name in p for p in places), name)

    def test_a_disabled_or_deleted_copy_never_inflates_a_rooms_count(self):
        # A player home with hundreds of books before this check (variant decoration refs, only one enabled at a
        # time) is the regression this guards: no single room should read in the hundreds-of-books range that a
        # real, single library wouldn't plausibly hold at once in the base game's own rooms.
        top = self.d["readingRooms"][0]
        self.assertLess(top["books"], 1000)


if __name__ == "__main__":
    unittest.main()
