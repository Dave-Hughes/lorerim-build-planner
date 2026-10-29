"""WO-180 Part 4a: the reads in a player's words (read_clean.py): a guess or a note about the files comes out, the field goes under Not sure yet."""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import read_clean as rc  # noqa: E402
import quest_pages as qp  # noqa: E402


def said(s):
    return rc.clean_string(s)[0]


class Strings(unittest.TestCase):
    def test_a_guess_at_the_end_of_a_clause_goes(self):
        self.assertEqual(said("Altar of Molag Bal, most likely beneath Stendarr's Beacon"), "Altar of Molag Bal")
        self.assertEqual(said("Bruska Shaman's Staff (lightning staff), likely carried by the Shaman"), "Bruska Shaman's Staff (lightning staff)")
        self.assertEqual(said("He is the one you report to; he's most likely the one who asks."), "He is the one you report to.")

    def test_a_guess_that_is_the_whole_item_leaves_nothing(self):
        for s in ("Probably Remnants", "Probably Black Marsh Maps.", "Possibly a magical side-effect while cleansing: Fortify Magicka or Drain Magicka"):
            self.assertIsNone(said(s))

    def test_a_guess_after_a_colon_or_and_goes(self):
        self.assertEqual(said("His gear, looted from his body: probably Ebony Warrior's Armor, Ebony Warrior's Boots"), "His gear, looted from his body")
        self.assertEqual(said("Walk into Windhelm; the job is set up, and Shahvee most likely offers it when you talk to her."), "Walk into Windhelm; the job is set up.")

    def test_a_bracket_with_a_guess_or_the_files_goes_whole(self):
        self.assertEqual(said("the guard at Fort Tulis (most likely Captain Delevin)"), "the guard at Fort Tulis")
        self.assertEqual(said("Payment from Nazir (amount not in these records)"), "Payment from Nazir")
        self.assertEqual(said("Riverwood (the records place her in the Sleeping Giant Inn)"), "Riverwood")

    def test_an_empty_bracket_goes(self):
        self.assertEqual(said("The quest is set off when you enter Markarth ( ); once you have helped, the jarl offers the title."), "The quest is set off when you enter Markarth; once you have helped, the jarl offers the title.")

    def test_a_note_about_the_files_goes_and_the_rest_stays(self):
        self.assertEqual(said("your housecarl; the records place them in Vlindrel Hall"), "your housecarl")
        self.assertEqual(said("It has two quests, the second played out inside the first, and the records set no level for it."), "It has two quests, the second played out inside the first.")
        self.assertEqual(said("The records give no level gate for the line; the toughest named enemy is a dragon."), "The toughest named enemy is a dragon.")
        self.assertEqual(said("Looks unfinished in the records: no people are set up for it."), "Looks unfinished: no people are set up for it.")
        self.assertIsNone(said("from the quest's script"))
        self.assertIsNone(said("not given in the records"))

    def test_what_someone_says_is_the_games_and_stays(self):
        self.assertEqual(said('Ask Svana Far-Shield "Perhaps I can "talk" to them for you..." in Haelga\'s Bunkhouse'), 'Ask Svana Far-Shield "Perhaps I can "talk" to them for you..." in Haelga\'s Bunkhouse')
        self.assertEqual(said('Ask someone the records don\'t name "Perhaps I can get you one?"'), 'Ask someone "Perhaps I can get you one?"')

    def test_what_the_reads_copied_from_the_game_keeps_its_hedge(self):
        out = rc.clean_read({"steps": [{"objectives": ["Perhaps someone in Raven Rock will know about him.", "Search the the actor", "Find <the item> inside <the dungeon>"]}]})
        self.assertEqual(out["steps"][0]["objectives"], ["Perhaps someone in Raven Rock will know about him.", "Search the person", "Find the item the job names inside the dungeon the job names"])
        self.assertNotIn("unsure", out)

    def test_blanks_the_game_fills_are_said_in_plain_words(self):
        self.assertEqual(said("Target takes <25> points of frost damage"), "Target takes 25 points of frost damage")
        self.assertEqual(said("Find the Black Book in <the dungeon named>"), "Find the Black Book in the dungeon the job names")
        self.assertEqual(said('Ask Brother Verulus "Would some coin help? (<BribeCost> gold)" in Hall of the Dead'), 'Ask Brother Verulus "Would some coin help?" in Hall of the Dead')

    def test_roles_the_game_names_are_said_as_people(self):
        self.assertEqual(said("Report to the field co."), "Report to the field commander.")
        self.assertEqual(said("Talk to the riverwood friend in Riverwood"), "Talk to your friend from Helgen in Riverwood")
        self.assertEqual(said("Speechcraft to 75 (journeyman)"), "Speech to 75 (journeyman)")

    def test_a_job_with_a_placeholder_name_gets_a_plain_one(self):
        self.assertEqual(said("Delivery for the npc"), "A delivery")
        self.assertEqual(said("The item"), "A shipment to collect")
        self.assertEqual(said("Hunter Marks Animal Den 02"), "Mark an animal den (second job)")
        self.assertEqual(said("Delivery for <recipient> (Lelaegh's delivery errands)"), "A delivery (Lelaegh's delivery errands)")


class Reads(unittest.TestCase):
    def test_the_field_that_lost_a_guess_goes_under_not_sure_yet(self):
        out = rc.clean_read({"rewards": [{"what": "Probably the dragon priest mask", "when": "at the end"}, {"what": "Gold", "when": "probably at the end"}], "unsure": [{"field": "starts"}]})
        self.assertEqual(out["rewards"], [{"what": "Gold"}])
        self.assertEqual([u["field"] for u in out["unsure"]], ["starts", "rewards"])

    def test_a_field_already_unsure_is_not_listed_twice(self):
        out = rc.clean_read({"needs": [{"what": "Probably Remnants"}], "unsure": [{"field": "needs", "why": "Not known."}]})
        self.assertEqual(out["needs"], [])
        self.assertEqual(out["unsure"], [{"field": "needs", "why": "Not known."}])

    def test_a_where_that_is_a_sentence_is_not_a_place(self):
        out = rc.clean_read({"starts": [{"who": "Altano", "where": "where No Mercy left him", "how": "Talk to him."}]})
        self.assertEqual(out["starts"], [{"who": "Altano", "how": "Talk to him."}])
        self.assertEqual([u["field"] for u in out["unsure"]], ["starts"])

    def test_a_hedged_where_is_not_a_place_either(self):
        out = rc.clean_read({"starts": [{"who": "Altano", "where": "most likely still in the Temple of Stendarr", "how": "Talk to him."}]})
        self.assertNotIn("where", out["starts"][0])


class Aliases(unittest.TestCase):
    def test_roles_the_records_name_are_said_as_people(self):
        self.assertEqual(qp.plain_alias("RiverwoodFriend"), "your friend from Helgen")
        self.assertEqual(qp.plain_alias("FieldCO"), "the field commander")
        self.assertEqual(qp.plain_alias("EnemyFieldCO"), "the enemy field commander")
        self.assertEqual(qp.plain_alias("Item"), "the item")


if __name__ == "__main__":
    unittest.main()
