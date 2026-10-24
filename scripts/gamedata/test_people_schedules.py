"""
WO-156: the raw dump against the people the order names.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

RAW = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "gamedata", "5.0.4.8", "people_schedules_raw.json")


@unittest.skipUnless(os.path.exists(RAW), "people_schedules_raw.json not built")
class BuiltDump(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.people = json.load(open(RAW, encoding="utf-8"))["people"]
        cls.by_name = {}
        for p in cls.people.values():
            cls.by_name.setdefault(p["name"], p)

    def test_balgruuf_has_only_the_exiled_jarl_package_conditioned_on_a_faction(self):
        # WO-156's own spot check: Balgruuf's vanilla record (every plugin's own copy agrees) carries exactly
        # one package, and it's gated by GetInFaction -- a reading agent sees the condition and can tell this
        # isn't his everyday spot; with no competing package, his own placement (Dragonsreach) stands.
        balgruuf = self.by_name["Balgruuf the Greater"]
        self.assertEqual(len(balgruuf["packages"]), 1)
        pack = balgruuf["packages"][0]
        self.assertEqual(pack["location"]["place"], "The Blue Palace")
        self.assertEqual(len(pack["conditions"]), 1)
        self.assertEqual(pack["conditions"][0]["fn"], "GetInFaction")

    def test_nazeems_packages_resolve_to_whiterun_and_a_cc_homestead(self):
        # Dave's own spot check (WO-152's log): the Whiterun market and the Cloud District by day, a Creation
        # Club homestead ("Wintersand Manor") at night -- all present as raw packages, none interpreted here.
        nazeem = self.by_name["Nazeem"]
        edids = {p["edid"] for p in nazeem["packages"]}
        self.assertIn("AIOWRNazeemCloudDistrict", edids)
        self.assertIn("WhiterunNazeemBrowse8x4", edids)
        sleep = next(p for p in nazeem["packages"] if p["edid"] == "WhiterunWintersandManorSleepAny")
        self.assertIn("homestead", sleep["plugin"].lower())
        # WO-156 Part 1b: a "near type" target (PLDT type 1) resolved as a cell directly -- "Wintersand Manor"
        # itself, confirmed by hand, not a keyword as first assumed.
        self.assertEqual(sleep["location"]["cell"], "Wintersand Manor")

    def test_jaree_ra_stays_put_by_the_winking_skeever_not_his_placement(self):
        # WO-156 Part 1b (Bob, 23 Oct, 18:50): his top-priority package's "near type" target resolves straight
        # to the cell "The Winking Skeever" -- exactly where Dave watched him stand, from the raw dump alone.
        jaree = self.by_name["Jaree-Ra"]
        top = jaree["packages"][0]
        self.assertEqual(top["edid"], "STIJareeRaStayPutForSolitudeOpening")
        self.assertEqual(top["location"]["cell"], "The Winking Skeever")

    def test_jaree_ras_work_package_resolves_by_nearest_named_place(self):
        # His work package's own target has no cell of its own (an exterior wilderness ref); the nearest
        # named marker -- the East Empire Company Warehouse, essentially on top of it -- stands in instead.
        jaree = self.by_name["Jaree-Ra"]
        work = next((p for p in jaree["packages"] if "Work" in p["edid"]), None)
        self.assertIsNotNone(work)
        self.assertEqual(work["location"]["type"], 0)
        self.assertIsNone(work["location"]["cell"])
        self.assertEqual(work["location"]["nearestNamed"]["name"], "East Empire Company Warehouse")
        self.assertLess(work["location"]["nearestNamed"]["km"], 0.2)

    def test_the_schedule_is_decoded_hour_and_duration_not_only_raw_hex(self):
        # WO-156 Part 1b: checked by hand against three self-describing packages -- the work shift starts at
        # 10, 8 hours; the meal at 18 (6pm), an hour; sleep at 2am, 8 hours; the always-on ones carry no hour.
        jaree = self.by_name["Jaree-Ra"]
        work = next(p for p in jaree["packages"] if p["edid"] == "SolitudeWarehouseWork10x8")
        self.assertEqual((work["schedule"]["hour"], work["schedule"]["durationMinutes"]), (10, 480))
        eat = next(p for p in jaree["packages"] if p["edid"] == "DefaultEatEditorLoc18x1")
        self.assertEqual((eat["schedule"]["hour"], eat["schedule"]["durationMinutes"]), (18, 60))
        sleep = next(p for p in jaree["packages"] if p["edid"] == "DefaultSleepEditorLoc2x8")
        self.assertEqual((sleep["schedule"]["hour"], sleep["schedule"]["durationMinutes"]), (2, 480))
        always = next(p for p in jaree["packages"] if p["edid"] == "DefaultSandboxEditorLocation512")
        self.assertIsNone(always["schedule"]["hour"])

    def test_a_trivial_near_self_package_resolves_no_target(self):
        # Location type 3 ("near editor location") means "near wherever this actor was placed" -- never a
        # specific reference, so `target` stays null rather than a guessed one.
        jaree = self.by_name["Jaree-Ra"]
        trivial = next(p for p in jaree["packages"] if p["edid"] == "DefaultSleepEditorLoc2x8")
        self.assertIsNone(trivial["location"]["target"])

    def test_a_widely_shared_package_is_flagged_as_such(self):
        jaree = self.by_name["Jaree-Ra"]
        generic = next(p for p in jaree["packages"] if p["edid"] == "DefaultSandboxEditorLocation512")
        self.assertTrue(generic["shared"])
        self.assertGreater(generic["sharedCount"], 100)

    def test_a_real_vendor_is_told_apart_from_every_factions_boilerplate_venv(self):
        # WO-156 Part 1b: every faction carries a VENV, all zero, whether or not it's a real vendor (confirmed
        # on a faction with nothing to do with selling); VEND, the merchant's own container, is the real
        # signal. Eorlund Gray-Mane (the Skyforge) checked by hand: open 0 to 23, radius 700.
        eorlund = next(p for p in self.people.values() if p["name"] and "Eorlund" in p["name"])
        self.assertEqual(eorlund["vendor"]["startHour"], 0)
        self.assertEqual(eorlund["vendor"]["endHour"], 23)
        self.assertEqual(eorlund["vendor"]["radius"], 700)
        unrelated = [p for p in self.people.values() if p["name"] == "Jaree-Ra"][0]
        self.assertIsNone(unrelated["vendor"])

    def test_a_trainer_class_names_its_own_skill_and_tier(self):
        # "TrainerRestorationExpert"-style class names are Skyrim's own convention, read from the class, never
        # a guess at what an NPC teaches.
        trainers = [p for p in self.people.values() if p.get("trainer")]
        self.assertGreater(len(trainers), 0)
        for p in trainers[:20]:
            self.assertIn(p["trainer"]["tier"], ("Novice", "Apprentice", "Journeyman", "Expert", "Master"))

    def test_follower_and_marriageable_read_the_standard_factions(self):
        followers = [p for p in self.people.values() if p["follower"]]
        marriageable = [p for p in self.people.values() if p["marriageable"]]
        self.assertGreater(len(followers), 0)
        self.assertGreater(len(marriageable), 0)


if __name__ == "__main__":
    unittest.main()
