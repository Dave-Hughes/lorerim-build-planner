"""WO-180 Part 7a: a shop is the vendor faction's own data."""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import people  # noqa: E402
import shops  # noqa: E402


class KindAndHours(unittest.TestCase):
    def test_a_vendor_list_is_a_word_players_use(self):
        self.assertEqual(shops.kind_of("VendorItemsBlacksmith", []), "blacksmith")
        self.assertEqual(shops.kind_of("GM_VendorItemsSilversmith", []), "silversmith")  # Endon, not a blacksmith
        self.assertEqual(shops.kind_of("RVT_FL_VendorItemsFoodWithIngrediants", []), "food")
        self.assertEqual(shops.kind_of("VendorItemsJeweler", []), "jewelry")
        self.assertEqual(shops.kind_of("VendorItemsBlacksmithWHAxes", ["WeapTypeWarAxe", "VendorItemOreIngot"]), "weapons")  # Audmund's Axes
        self.assertIsNone(shops.kind_of("REQ_VendorItems_NoSale", ["VendorNoSale"]))

    def test_hours_in_words_and_all_day_is_none(self):
        self.assertEqual(shops.hours_of(8, 20), "8 am to 8 pm")
        self.assertIsNone(shops.hours_of(0, 24))
        self.assertIsNone(shops.hours_of(0, 25))
        self.assertIsNone(shops.hours_of(0, 23))  # a smith's "0 to 23"
        self.assertIsNone(shops.hours_of(12, 12))
        self.assertEqual(shops.hours_of(7, 12), "7 am to noon")


class SellerShop(unittest.TestCase):
    V = {
        "F:services": {"edid": "ServicesWhiterunWarmaidens", "kind": "blacksmith", "hours": "8 am to 8 pm", "cell": {"name": "Warmaiden's", "interior": True}},
        "F:own": {"edid": "WhiterunWarmaidensFaction", "kind": "apothecary", "cell": {"name": "Elsewhere", "interior": True}},
        "F:stall": {"edid": "ServicesWhiterunCarlotta", "kind": "food", "cell": {"world": "WhiterunWorld"}},
        "F:forge": {"edid": "ServicesRiverwoodAlvor", "kind": "blacksmith", "cell": {"world": "Tamriel"}},
        "F:urchin": {"edid": "BYOHUrchin_LuciaJobFaction", "list": "BYOHUrchin_SofieVendorList", "kind": "flowers", "cell": {"world": "WindhelmWorld"}},
        "F:orphan": {"edid": "urshug_OrcOrphanFaction", "list": "BYOHUrchin_SofieVendorList", "kind": "flowers", "cell": {"world": "WindhelmWorld"}},
        "F:sofie": {"edid": "BYOHServicesWindhelmSofie", "list": "BYOHUrchin_SofieVendorList", "kind": "flowers", "cell": {"world": "WindhelmWorld"}},
    }

    def shop(self, *keys):
        return people.shop_of({"factions": [{"faction": k, "edid": self.V[k]["edid"]} for k in keys]}, self.V)

    def test_the_services_faction_is_the_shop(self):
        self.assertEqual(self.shop("F:own", "F:services"), {"kind": "blacksmith", "faction": "ServicesWhiterunWarmaidens", "hours": "8 am to 8 pm", "cell": "Warmaiden's"})

    def test_a_chest_in_the_open_is_a_stall_in_a_city_and_a_forge_in_the_wilds(self):
        self.assertEqual(self.shop("F:stall"), {"kind": "food", "faction": "ServicesWhiterunCarlotta", "stall": True, "world": "WhiterunWorld"})
        self.assertEqual(self.shop("F:forge"), {"kind": "blacksmith", "faction": "ServicesRiverwoodAlvor", "outdoors": True})

    def test_an_adopted_urchin_sells_nothing_but_sofie_does(self):
        # judged by the list (Sofie's flowers), not by a faction's name: a mod's orphans have no BYOH name and the same list
        self.assertIsNone(self.shop("F:urchin"))
        self.assertIsNone(self.shop("F:orphan"))
        self.assertEqual(self.shop("F:orphan", "F:sofie")["faction"], "BYOHServicesWindhelmSofie")

    def test_an_urchin_with_only_the_urchins_list_is_no_merchant(self):
        dump = {"A:1": {"name": "Elandra", "vendor": {"vendRaw": "1"}, "factions": [{"faction": "F:orphan", "edid": "urshug_OrcOrphanFaction"}]},
                "A:2": {"name": "Sofie", "vendor": {"vendRaw": "1"}, "factions": [{"faction": "F:sofie", "edid": "BYOHServicesWindhelmSofie"}]}}
        got = people.person_facts(dump, self.V)
        self.assertNotIn("A:1", got)
        self.assertTrue(got["A:2"]["sells"])
        self.assertEqual(got["A:2"]["shop"]["kind"], "flowers")

    def test_a_person_the_records_give_a_vendor_faction_who_does_not_trade_sells_nothing(self):
        dump = {"A:3": {"name": "Adara", "vendor": {"vendRaw": "1"}, "factions": [{"faction": "F:stall", "edid": "ServicesWhiterunCarlotta"}]}}
        self.assertNotIn("A:3", people.person_facts(dump, self.V, {"A:3": "Kerah's child"}))
        self.assertIn("A:3", people.person_facts(dump, self.V))


class Keeper(unittest.TestCase):
    """WO-180 Part 8: one keeper for each vendor faction; the rest are its assistants."""

    V = {"edid": "ServicesMarkarthHagsCure", "cell": {"name": "The Hag's Cure", "interior": True}}

    def test_the_chest_owner_then_the_cell_owner(self):
        members = [("A:1", "Muiri"), ("A:2", "Bothela")]
        self.assertEqual(people.keeper_of({**self.V, "cell": {**self.V["cell"], "chestOwner": "A:1"}}, members), "A:1")
        self.assertEqual(people.keeper_of({**self.V, "cell": {**self.V["cell"], "owner": "A:2"}}, members), "A:2")

    def test_a_rank_of_their_own_in_a_job_faction_beats_none(self):
        # Adrianne is rank 0 in the blacksmiths', Ulfberth 255, which is no rank
        dump = {"A:1": {"factions": [{"edid": "JobBlacksmithFaction", "rank": 255}]}, "A:2": {"factions": [{"edid": "JobBlacksmithFaction", "rank": 0}]}}
        self.assertEqual(people.keeper_of({"edid": "ServicesWhiterunWarmaidens"}, [("A:1", "Ulfberth War-Bear"), ("A:2", "Adrianne Avenicci")], dump), "A:2")

    def test_the_name_the_faction_carries_then_the_first_made(self):
        self.assertEqual(people.keeper_of({"edid": "ServicesDawnstarRustleifSmithy"}, [("Skyrim.esm:01361F", "Seren"), ("Skyrim.esm:01361E", "Rustleif")]), "Skyrim.esm:01361E")
        self.assertEqual(people.keeper_of({"edid": "ServicesMarkarthHagsCure"}, [("Skyrim.esm:01406B", "Muiri"), ("Skyrim.esm:01338B", "Bothela")]), "Skyrim.esm:01338B")

    def test_a_ruling_settles_a_tie_and_one_member_is_the_keeper(self):
        dump = {"A:1": {"name": "Imedhnain", "vendor": {"vendRaw": "1"}, "factions": [{"faction": "F:a", "edid": "ServicesMarkarthArnleifandSons"}]},
                "A:2": {"name": "Lisbet", "vendor": {"vendRaw": "1"}, "factions": [{"faction": "F:a", "edid": "ServicesMarkarthArnleifandSons"}]}}
        vendors = {"F:a": {"edid": "ServicesMarkarthArnleifandSons", "kind": "general goods", "cell": {"name": "Arnleif and Sons Trading Company", "interior": True}}}
        got = people.person_facts(dump, vendors, None, {"ServicesMarkarthArnleifandSons": "Lisbet"})
        self.assertEqual([k for k, f in got.items() if f["shop"].get("keeper")], ["A:2"])


if __name__ == "__main__":
    unittest.main()
