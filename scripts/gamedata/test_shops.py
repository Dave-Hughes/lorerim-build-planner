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
        "F:urchin": {"edid": "BYOHUrchin_LuciaJobFaction", "kind": "apothecary", "cell": {"world": "WindhelmWorld"}},
    }

    def shop(self, *keys):
        return people.shop_of({"factions": [{"faction": k, "edid": self.V[k]["edid"]} for k in keys]}, self.V)

    def test_the_services_faction_is_the_shop(self):
        self.assertEqual(self.shop("F:own", "F:services"), {"kind": "blacksmith", "hours": "8 am to 8 pm", "cell": "Warmaiden's"})

    def test_a_chest_in_the_open_is_a_stall_in_a_city_and_a_forge_in_the_wilds(self):
        self.assertEqual(self.shop("F:stall"), {"kind": "food", "stall": True, "world": "WhiterunWorld"})
        self.assertEqual(self.shop("F:forge"), {"kind": "blacksmith", "outdoors": True})

    def test_an_adopted_urchin_sells_nothing(self):
        self.assertIsNone(self.shop("F:urchin"))


if __name__ == "__main__":
    unittest.main()
