"""
people.py (WO-144 Part 2): the built index against people the order names.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import people as ppl  # noqa: E402

RAW = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "gamedata", "5.0.4.8", "people_raw.json")


@unittest.skipUnless(os.path.exists(RAW), "people_raw.json not built")
class BuiltIndex(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows = json.load(open(RAW, encoding="utf-8"))["people"]
        cls.by = {}
        for p in cls.rows:
            cls.by.setdefault(p["name"], p)

    def test_the_nine_capitals_each_have_a_jarl(self):
        jarls = {p["inTown"] for p in self.rows if p.get("role") == "JobJarl"}
        for city in ("Riften", "Markarth"):  # Igmund, Laila Law-Giver: confirmed against the records by hand
            self.assertIn(city, jarls)

    def test_an_innkeeper_knows_her_town_and_race(self):
        hulda = self.by["Hulda"]
        self.assertEqual(hulda["inTown"], "Whiterun")
        self.assertEqual(hulda["race"], "Nord")
        self.assertEqual(hulda["sex"], "female")

    def test_no_person_without_a_name_or_a_role(self):
        self.assertTrue(all(p.get("name") or p.get("role") for p in self.rows))

    def test_the_site_file_keeps_record_ids_out(self):
        raw = [{"id": "X:000001", "name": "Someone", "race": "Nord", "sex": "male", "cell": "A House", "inTown": "Whiterun", "role": "JobMerchant", "plugin": "Skyrim.esm"}]
        (row,) = ppl.build_site(raw)
        self.assertNotIn("id", row)
        self.assertNotIn("plugin", row)
        self.assertEqual(row["name"], "Someone")

    def test_what_a_person_is_comes_from_the_dump_by_record_id_and_nothing_else_is_added(self):
        dump = {
            "X:000001": {"essential": True, "follower": True, "marriageable": True, "vendor": {"startHour": 9}, "trainer": {"skill": "Restoration", "tier": "Expert", "levelCap": 100}, "packages": [{"edid": "NotCopied"}], "factions": [{"edid": "JobInnkeeperFaction"}]},
            "X:000002": {"essential": False, "follower": False, "marriageable": False, "vendor": None, "trainer": None},
        }
        facts = ppl.person_facts(dump)
        self.assertEqual(facts, {"X:000001": {"essential": True, "follower": True, "marriage": True, "sells": True, "innkeeper": True, "trainer": {"skill": "Restoration", "cap": 100}}})
        raw = [{"id": "X:000001", "name": "Mjoll", "race": "Nord", "sex": "female"}, {"id": "X:000002", "name": "Nobody", "race": "Nord", "sex": "male"}]
        a, b = ppl.build_site(raw, facts)
        self.assertEqual((a["follower"], a["marriage"], a["trainer"]["skill"]), (True, True, "Restoration"))
        self.assertNotIn("follower", b)
        self.assertNotIn("packages", a)


class PeopleReads(unittest.TestCase):
    """WO-159: the checked reads joined to the index, with the reader's asides out of what a player reads."""

    def test_a_reader_aside_is_dropped_and_the_fact_stays(self):
        self.assertEqual(ppl.tidy_read("With the Khajiit caravan he leads, camped out in the open; the extracts don't say which city it is camped by."), "With the Khajiit caravan he leads, camped out in the open.")
        self.assertEqual(ppl.tidy_read("Spell tomes (he's a spell vendor, open at any hour); his exact stock isn't in the records I can read"), "Spell tomes (he's a spell vendor, open at any hour)")
        self.assertEqual(ppl.tidy_read("Illusion (master trainer; the records don't set a level cap)"), "Illusion (master trainer)")
        self.assertEqual(ppl.tidy_read("Can be asked to follow you; the records I can read don't show what unlocks it"), "Can be asked to follow you.")
        self.assertEqual(ppl.tidy_read("The exact stock list isn't resolved in the extracts."), "")

    def test_a_clean_sentence_is_left_alone(self):
        s = "Behind the counter of the Riverwood Trader in Riverwood (the records also call it Lucan's Dry Goods)."
        self.assertEqual(ppl.tidy_read(s), s)

    def test_a_reason_for_a_doubt_reads_as_the_page_says_it(self):
        self.assertEqual(ppl.tidy_why("neither resolves to a name, so I can't say how they fight; it isn't in the extracts."), "neither resolves to a name, so we can't say how they fight; it isn't in the game files.")

    def test_a_batch_joins_by_record_id_and_keeps_each_fields_verdict_without_the_note(self):
        import tempfile

        with tempfile.TemporaryDirectory() as d:
            batch = {
                "checks": [{"id": "X:000001", "verdicts": {"day": {"verdict": "fix", "note": "AIOSandbox X:1234 is first"}, "sells": {"verdict": "unsure", "note": "n"}}}],
                "people": [{"id": "X:000001", "name": "Someone", "firstMeet": "At home.", "day": [], "changes": [], "quests": [], "unsure": [{"field": "sells", "why": "Not in the extracts."}], "evidence": ["X:000001"]}],
            }
            json.dump(batch, open(os.path.join(d, "P001.json"), "w"))
            reads = ppl.load_reads(d)
        self.assertEqual(reads["X:000001"]["verdicts"], {"day": "fix", "sells": "unsure"})
        self.assertNotIn("evidence", reads["X:000001"])
        self.assertEqual(reads["X:000001"]["unsure"][0]["why"], "Not in the game files.")
        (row,) = ppl.build_site([{"id": "X:000001", "name": "Someone", "race": "Nord", "sex": "male"}], None, reads)
        self.assertEqual(row["read"]["firstMeet"], "At home.")

    def test_a_players_found_fact_replaces_the_read_and_drops_its_doubts(self):
        read = {"firstMeet": "On the docks.", "day": [{"from": "8 am"}], "changes": ["x"], "unsure": [{"field": "firstMeet", "why": "?"}, {"field": "sells", "why": "?"}], "verdicts": {"firstMeet": "agree"}}
        out = ppl.apply_rulings(read, {"firstMeet": "By the Winking Skeever.", "_source": "Dave"})
        self.assertEqual(out["firstMeet"], "By the Winking Skeever.")
        self.assertEqual(out["day"], [{"from": "8 am"}])
        self.assertEqual(out["fromPlayers"], ["firstMeet"])
        self.assertEqual(out["reports"], 1)
        self.assertEqual([u["field"] for u in out["unsure"]], ["sells"])
        self.assertEqual(out["verdicts"]["firstMeet"], "players")

    def test_the_built_site_file_has_the_reads_and_jaree_ra_is_by_the_winking_skeever(self):
        path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "src", "data", "lorerim-5.0.4.8", "people.json")
        if not os.path.exists(path):
            self.skipTest("people.json not built")
        rows = json.load(open(path, encoding="utf-8"))["people"]
        read = [r for r in rows if r.get("read")]
        # 553 reads; the one person two records made (Alara and High Priestess Alara, WO-183 Part 1) has one page and keeps the one read.
        self.assertGreaterEqual(len(read), 552)
        jaree = next(r for r in rows if r.get("name") == "Jaree-Ra")["read"]
        self.assertIn("Winking Skeever", jaree["firstMeet"])
        self.assertNotIn("docks", json.dumps(jaree["day"]))
        self.assertEqual(jaree["reports"], 1)
        text = json.dumps([r["read"] for r in read], ensure_ascii=False)
        self.assertNotRegex(text, r"extracts?\b|records I can read")
        self.assertNotIn("\ufffd", text)
        lydia = next(r for r in rows if r.get("name") == "Lydia")["read"]
        self.assertIn("housecarl", lydia["joins"])


if __name__ == "__main__":
    unittest.main()
