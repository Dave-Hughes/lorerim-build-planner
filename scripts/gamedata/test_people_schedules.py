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

    def test_jaree_ra_has_a_shared_work_package_pointing_off_his_placement(self):
        # A work package, not a sandbox-near-self one, is why he isn't found at his own placement cell at all.
        jaree = self.by_name["Jaree-Ra"]
        work = next((p for p in jaree["packages"] if "Work" in p["edid"]), None)
        self.assertIsNotNone(work)
        self.assertEqual(work["location"]["type"], 0)
        self.assertIsNotNone(work["location"]["target"])

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

    def test_no_vendor_or_trainer_claim_is_made(self):
        for p in list(self.by_name.values())[:50]:
            self.assertNotIn("vendor", p)
            self.assertNotIn("trainer", p)


if __name__ == "__main__":
    unittest.main()
