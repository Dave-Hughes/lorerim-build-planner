"""
items.py against a small plugin built here, byte for byte as the game writes one.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import struct
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import items  # noqa: E402

PLUGIN = "Fixture.esp"


def sub(t, data):
    return t.encode() + struct.pack("<H", len(data)) + data


def zs(s):
    return s.encode() + b"\0"


def record(t, fid, subs, flags=0):
    data = b"".join(subs)
    return t.encode() + struct.pack("<IIIIHH", len(data), flags, fid, 0, 44, 0) + data


def group(label, records):
    body = b"".join(records)
    return b"GRUP" + struct.pack("<I", 24 + len(body)) + label.encode() + struct.pack("<IHHHH", 0, 0, 0, 0, 0) + body


def kwda(*fids):
    return sub("KWDA", b"".join(struct.pack("<I", f) for f in fids))


def weap(fid, edid, name, kws=(), anim=1, wflags=0, damage=7, weight=10.0, value=25, template=0, flags=0):
    subs = [sub("EDID", zs(edid)), sub("FULL", zs(name))]
    if kws:
        subs.append(kwda(*kws))
    if template:
        subs.append(sub("CNAM", struct.pack("<I", template)))
    subs += [sub("DATA", struct.pack("<IfH", value, weight, damage)), sub("DNAM", bytes([anim, 0, 0, 0]) + struct.pack("<ffH", 1.0, 1.0, wflags) + bytes(86))]
    return record("WEAP", fid, subs, flags)


def armo(fid, edid, name, biped, btype=1, kws=(), rating=2500, weight=30.0, value=100, template=0, flags=0, desc=""):
    subs = [sub("EDID", zs(edid)), sub("FULL", zs(name)), sub("BOD2", struct.pack("<II", biped, btype))]
    if kws:
        subs.append(kwda(*kws))
    if template:
        subs.append(sub("TNAM", struct.pack("<I", template)))
    if desc:
        subs.append(sub("DESC", zs(desc)))
    subs += [sub("DATA", struct.pack("<if", value, weight)), sub("DNAM", struct.pack("<i", rating))]
    return record("ARMO", fid, subs, flags)


def ammo(fid, edid, name, aflags, damage):
    return record("AMMO", fid, [sub("EDID", zs(edid)), sub("FULL", zs(name)), sub("DATA", struct.pack("<IIfIf", 0, aflags, damage, 3, 0.1))])


def fixture():
    tes4 = record("TES4", 0, [sub("HEDR", struct.pack("<fII", 1.7, 0, 0x800))])
    return tes4 + b"".join(
        [
            group("KYWD", [record("KYWD", 0x801, [sub("EDID", zs("WeapTypeSword"))]), record("KYWD", 0x802, [sub("EDID", zs("ArmorHeavy"))]), record("KYWD", 0x803, [sub("EDID", zs("WeapTypeSpear"))])]),
            group(
                "WEAP",
                [
                    weap(0x810, "IronSword", "Iron Sword", kws=(0x801,)),
                    weap(0x811, "EnchIronSwordFrost01", "Iron Sword of Frost", kws=(0x801,), template=0x810),
                    weap(0x812, "zzzTestSword", "zzzTest Sword", kws=(0x801,)),
                    weap(0x813, "SteelSpear", "Steel Spear", kws=(0x803,), anim=6, damage=11, weight=14.0),
                    weap(0x814, "GhostBlade", "Ghost Blade", kws=(0x801,), wflags=0x80),
                    weap(0x815, "DawnCrossbow", "Crossbow", anim=9, damage=19),
                ],
            ),
            group(
                "ARMO",
                [
                    armo(0x820, "SteelArmorOld", "Steel Armor", 1 << 2, kws=(0x802,), rating=2400, weight=35.0, desc="Old steel."),
                    armo(0x821, "SteelArmor", "Steel Armor", 1 << 2, kws=(0x802,), rating=2500, weight=30.0),
                    armo(0x822, "SkinNaked", "Naked", 1 << 2, flags=0x04),
                    armo(0x823, "TailThing", "Tail Ribbon", 1 << 10),
                    armo(0x824, "DebugHat", "[Debug] Hat", 1 << 0),
                    armo(0x825, "HideShield", "Hide Shield", 1 << 9, btype=0, rating=1500, weight=4.0),
                    armo(0x826, "SteelArmorOfHealth", "Steel Armor of Health", 1 << 2, kws=(0x802,), template=0x821),
                ],
            ),
            group("AMMO", [ammo(0x830, "IronArrow", "Iron Arrow", items.AMMO_NON_BOLT, 8.0), ammo(0x831, "SteelBolt", "Steel Bolt", 0, 12.0)]),
        ]
    )


class ItemsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.keywords, cls.records = items.read_plugin(fixture(), PLUGIN)
        cls.kw = {tuple(k): v for k, v in cls.keywords.items()}
        cls.entries, cls.counts = items.index_items(cls.records, cls.kw, items.DEFAULT_SKIP)
        cls.names = [e["name"] for e in cls.entries]

    def test_reads_every_record_and_keyword(self):
        self.assertEqual(len(self.records), 15)
        self.assertEqual(self.kw[(PLUGIN, 0x801)], "WeapTypeSword")

    def test_skips_non_playable_records_and_armor_without_a_slot(self):
        self.assertNotIn("Naked", self.names)  # non-playable flag
        self.assertNotIn("Ghost Blade", self.names)  # non-playable weapon flag
        self.assertNotIn("Tail Ribbon", self.names)  # no slot the planner shows
        self.assertEqual(self.counts["playable"], 12)

    def test_skips_debug_and_deleted_names(self):
        self.assertNotIn("zzzTest Sword", self.names)
        self.assertNotIn("[Debug] Hat", self.names)
        self.assertEqual(self.counts["named"], 10)

    def test_skips_templated_enchanted_copies(self):
        self.assertNotIn("Iron Sword of Frost", self.names)
        self.assertNotIn("Steel Armor of Health", self.names)
        self.assertIn("Iron Sword", self.names)
        self.assertEqual(self.counts["untemplated"], 8)

    def test_keeps_every_same_name_record_for_the_merge(self):
        steel = [e for e in self.entries if e["name"] == "Steel Armor"]
        self.assertEqual([e["id"] for e in steel], ["Fixture.esp:000820", "Fixture.esp:000821"])
        self.assertEqual(self.counts["merged"], 7)

    def test_merge_keeps_the_latest_and_lists_the_others(self):
        steel = [e for e in items.merge(self.entries) if e["name"] == "Steel Armor"]
        self.assertEqual(len(steel), 1)
        self.assertEqual((steel[0]["id"], steel[0]["armor"], steel[0]["also"]), ("Fixture.esp:000821", 25, ["Fixture.esp:000820"]))

    def test_merge_takes_the_preferred_record(self):
        quest = {"id": "Skyrim.esm:105EE7", "name": "Steel Arrow", "kind": "ammo", "ammoType": "Arrow", "damage": 40.0, "order": 9}
        game = dict(quest, id="Skyrim.esm:01397F", damage=60.0, order=2)
        merged = items.merge([game, quest], {"Steel Arrow": "skyrim.esm:01397f"})
        self.assertEqual([(e["id"], e["damage"], e["also"]) for e in merged], [("Skyrim.esm:01397F", 60.0, ["Skyrim.esm:105EE7"])])
        # Without the preference, the later record wins.
        self.assertEqual(items.merge([game, quest])[0]["id"], "Skyrim.esm:105EE7")

    def test_describes_types_slots_and_stats(self):
        by = {e["name"]: e for e in self.entries}
        self.assertEqual(by["Iron Sword"]["weaponType"], "Sword")
        self.assertEqual(by["Steel Spear"]["weaponType"], "Spear")
        self.assertEqual(by["Crossbow"]["weaponType"], "Crossbow")
        self.assertEqual((by["Steel Armor"]["slot"], by["Steel Armor"]["armorType"]), ("Body", "Heavy"))
        self.assertEqual((by["Hide Shield"]["slot"], by["Hide Shield"]["armorType"]), ("Shield", "Light"))
        self.assertEqual((by["Iron Arrow"]["ammoType"], by["Steel Bolt"]["ammoType"]), ("Arrow", "Bolt"))

    def test_builds_the_planner_rows(self):
        rows = {r["name"]: r for r in items.build_items({"items": self.entries})}
        self.assertEqual(rows["Steel Armor"], {"id": "Fixture.esp:000821", "name": "Steel Armor", "kind": "armor", "slot": "Body", "armorType": "Heavy", "stats": "Heavy armor, 25 armor, 30 weight", "also": ["Fixture.esp:000820"]})
        self.assertEqual(rows["Steel Spear"]["stats"], "Spear, 11 damage, 14 weight")
        self.assertEqual(rows["Iron Arrow"]["stats"], "Arrow, 8 damage, 0.1 weight")


class LabelTest(unittest.TestCase):
    def test_labels_read_as_players_say_them(self):
        self.assertEqual(items.weapon_label("Steel Quarterstaff", "Warhammer"), "Quarterstaff")
        self.assertEqual(items.weapon_label("Ebony Battlestaff", "Warhammer"), "Quarterstaff")
        self.assertEqual(items.weapon_label("Iron Spear", "Sword"), "Spear")
        self.assertEqual(items.weapon_label("Ebony Javelin", "Sword"), "Javelin")
        self.assertEqual(items.weapon_label("Oak Staff", "Qtr Staff"), "Quarterstaff")
        self.assertEqual(items.weapon_label("Spear of Bitter Mercy", "Pole2H_Thrust"), "Spear")
        self.assertEqual(items.weapon_label("Ebony Pike", "Greatsword"), "Polearm")
        self.assertEqual(items.weapon_label("Steel Halberd", "Battleaxe"), "Polearm")
        self.assertEqual(items.weapon_label("Iron Glaive", "Greatsword"), "Polearm")
        self.assertEqual(items.weapon_label("Pike", "Greatsword"), "Polearm")
        self.assertEqual(items.weapon_label("Molag Bal Spike", "Sword"), "Sword")
        self.assertEqual(items.weapon_label("Staff of Ice Spike", "Staff"), "Staff")
        self.assertEqual(items.weapon_label("Spear of the Hunter", "Greatsword"), "Spear")
        self.assertEqual(items.weapon_label("Daedric Pike of the Inferno", "Greatsword"), "Polearm")
        self.assertEqual(items.weapon_label("Paladin Halberd (Rusty)", "Battleaxe"), "Polearm")
        self.assertEqual(items.weapon_label("Daedric Quarterstaff of the Inferno", "Warhammer"), "Quarterstaff")
        self.assertEqual(items.weapon_label("Wooden Battlestaff of Flames", "Staff"), "Staff")
        self.assertEqual(items.weapon_label("Glass Battlestaff of Icy Spear", "Staff"), "Staff")
        self.assertEqual(items.weapon_label("Knight of Kynareth Halberd", "Battleaxe"), "Polearm")
        self.assertEqual(items.weapon_label("Knight of Kynareth Halberd (Tarnished Silver)", "Battleaxe"), "Polearm")
        self.assertEqual(items.weapon_label("Staff of Icy Spear", "Staff"), "Staff")
        self.assertEqual(items.weapon_label("Iron Sword", "Sword"), "Sword")

    def test_build_skips_names_again(self):
        raw = {"items": [{"id": "A:000001", "name": "Unarmed", "kind": "weapon", "weaponType": "Claw"}, {"id": "A:000002", "name": "Iron Spear", "kind": "weapon", "weaponType": "Sword", "damage": 9}]}
        rows = items.build_items(raw, ["^Unarmed$"])
        self.assertEqual([(r["name"], r["weaponType"]) for r in rows], [("Iron Spear", "Spear")])


if __name__ == "__main__":
    unittest.main()
