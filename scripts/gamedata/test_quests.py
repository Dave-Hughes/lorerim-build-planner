"""
quests.py against a small localized plugin built here, byte for byte as the game writes one, with its
text in STRINGS and DLSTRINGS tables.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import struct
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import esp  # noqa: E402
import quests  # noqa: E402

PLUGIN = "Fixture.esp"
TEXT = {
    1: "The Fixture Prince",
    2: "Machinery",
    3: "Find the shrine",
    4: "Slay the champion",
    10: "A voice in a dream told me to find a shrine in the hills.",
    11: "I found the shrine. The prince wants a champion slain.",
    12: "The prince is pleased, and gave me a ring.",
    13: "I refused the prince, and the shrine went dark.",
}
STRINGS = (1, 2, 3, 4)  # names and objectives; the log entries (10-13) are in DLSTRINGS
GLOBAL, FACTION = 0x900, 0x901


def sub(t, data):
    return t.encode() + struct.pack("<H", len(data)) + data


def zs(s):
    return s.encode() + b"\0"


def sid(n):
    return struct.pack("<I", n)


def record(t, fid, subs, flags=0):
    data = b"".join(subs)
    return t.encode() + struct.pack("<IIIIHH", len(data), flags, fid, 0, 44, 0) + data


def group(label, records):
    body = b"".join(records)
    return b"GRUP" + struct.pack("<I", 24 + len(body)) + label.encode() + struct.pack("<IHHHH", 0, 0, 0, 0, 0) + body


def dnam(qtype):
    return sub("DNAM", struct.pack("<HBBII", 0x11, 50, 0, 0, qtype))


def condition(fn, value, param=0, stage_=0, or_=False, alias=None):
    """A CTDA as the game writes it: ==, compared with a number, on the subject or one of the quest's aliases."""
    return sub("CTDA", struct.pack("<B3sfHHIIIIi", int(or_), b"\0\0\0", value, fn, 0, param, stage_, 5 if alias is not None else 0, 0,
                                   alias if alias is not None else -1))


def stage(index, entries):
    out = [sub("INDX", struct.pack("<HBB", index, 0, 0))]
    for text_id, flags, *conds in entries:
        out += [sub("QSDT", bytes([flags]))] + (conds[0] if conds else []) + [sub("CNAM", sid(text_id))]
    return out


def objective(index, text_id):
    return [sub("QOBJ", struct.pack("<H", index)), sub("FNAM", struct.pack("<I", 0)), sub("NNAM", sid(text_id))]


def fixture():
    tes4 = record("TES4", 0, [sub("HEDR", struct.pack("<fII", 1.7, 0, 0x800))], flags=0x80)  # localized
    daedric = [sub("EDID", zs("FXDA01")), sub("FULL", sid(1)), dnam(7)]
    daedric += stage(20, [(11, 0)]) + stage(10, [(10, 0)]) + stage(5, []) + stage(200, [(12, quests.COMPLETES)])
    # A second ending, shown only under its conditions: stage 20 done, or the global set and the
    # champion in the guild.
    refused = [condition(59, 1.0, 0x800, 20, or_=True), condition(74, 1.0, GLOBAL), condition(71, 1.0, FACTION, alias=0)]
    daedric += stage(210, [(13, quests.FAILS, refused)])
    daedric += objective(20, 4) + objective(10, 3)
    # Aliases follow the objectives; their FNAM and names must not leak into the objectives.
    daedric += [sub("ANAM", struct.pack("<I", 1)), sub("ALST", struct.pack("<I", 0)), sub("ALID", zs("Champion")), sub("FNAM", struct.pack("<I", 0)), sub("ALED", b"")]
    machinery = [sub("EDID", zs("FXDialogue")), sub("FULL", sid(2)), dnam(0)] + stage(0, [])
    unnamed = [sub("EDID", zs("FXUnnamed")), dnam(6)] + objective(0, 3)
    deleted = [sub("EDID", zs("FXDeleted")), sub("FULL", sid(1)), dnam(8)] + objective(0, 3)
    return tes4 + group("QUST", [record("QUST", 0x800, daedric), record("QUST", 0x801, machinery), record("QUST", 0x802, unnamed),
                                 record("QUST", 0x803, deleted, flags=0x20)])


def string_table(entries, lengths):
    """A STRINGS (zero-terminated) or DLSTRINGS (length-prefixed) table, as the game writes them."""
    data, directory = b"", b""
    for i, s in entries:
        directory += struct.pack("<II", i, len(data))
        b = s.encode() + b"\0"
        data += (struct.pack("<I", len(b)) + b) if lengths else b
    return struct.pack("<II", len(entries), len(data)) + directory + data


def extract(tmp):
    os.makedirs(os.path.join(tmp, "Strings"))
    with open(os.path.join(tmp, "Strings", "Fixture_english.STRINGS"), "wb") as f:
        f.write(string_table([(i, TEXT[i]) for i in STRINGS], False))
    with open(os.path.join(tmp, "Strings", "Fixture_english.DLSTRINGS"), "wb") as f:
        f.write(string_table([(i, t) for i, t in TEXT.items() if i not in STRINGS], True))
    strings = esp.localized_strings(os.path.join(tmp, PLUGIN), PLUGIN)
    recs = quests.read_plugin(fixture(), PLUGIN, strings)
    return quests.index_quests(recs, {tuple(r["key"]): [PLUGIN] for r in recs})


class QuestTest(unittest.TestCase):
    def setUp(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.quests, self.counts = extract(tmp)
        self.q = self.quests[0]

    def test_player_facing_filter(self):
        self.assertEqual(self.counts, {"read": 4, "named": 2, "with text": 2, "lead-ins": 0, "kept": 1})
        self.assertEqual([q["edid"] for q in self.quests], ["FXDA01"])

    def test_a_named_quests_lead_in(self):
        """WO-121a: DA14Start has no name; it's kept as DA14's lead-in, named by its first objective."""
        rec = lambda edid, name, objs, fid: {"plugin": "Fixture.esp", "key": ["Fixture.esp", fid], "flags": 0, "edid": edid, "name": name, "type": None,  # noqa: E731
                                            "stages": [], "objectives": [{"index": 10, "text": t} for t in objs], "aliases": {}}
        winners = [rec("DA14", "A Night To Remember", ["Find Sam Guevenne"], 0x800), rec("DA14Start", "", ["Participate in a drinking contest with Sam Guevenne"], 0x801),
                   rec("FXOtherStart", "", ["Nothing it leads to"], 0x802)]
        kept, counts = quests.index_quests(winners, {})
        lead = next(q for q in kept if q["edid"] == "DA14Start")
        self.assertEqual((lead["name"], lead["leadsTo"]), ("Participate in a drinking contest with Sam Guevenne", "Fixture.esp:000800"))
        self.assertEqual((counts["lead-ins"], counts["kept"]), (1, 2))

    def test_name_and_type_from_the_records(self):
        self.assertEqual((self.q["id"], self.q["name"], self.q["type"], self.q["plugin"]), ("Fixture.esp:000800", "The Fixture Prince", "Daedric", PLUGIN))

    def test_stages_in_order_with_log_text(self):
        self.assertEqual([s["index"] for s in self.q["stages"]], [5, 10, 20, 200, 210])
        self.assertEqual([s.get("log") for s in self.q["stages"]], [None, [TEXT[10]], [TEXT[11]], [TEXT[12]], [TEXT[13]]])
        self.assertTrue(self.q["stages"][3]["completes"])
        self.assertTrue(self.q["stages"][4]["fails"])
        self.assertNotIn("completes", self.q["stages"][1])

    def test_each_log_entry_keeps_its_flags_and_conditions(self):
        self.assertEqual(self.q["stages"][3]["entries"], [{"text": TEXT[12], "completes": True}])
        self.assertNotIn("entries", self.q["stages"][0])
        refused = self.q["stages"][4]["entries"][0]
        self.assertEqual((refused["text"], refused.get("fails"), refused.get("completes")), (TEXT[13], True, None))
        self.assertEqual([(c["fn"], c.get("stage"), c["or"], c.get("alias")) for c in refused["conditions"]],
                         [("GetStageDone", 20, True, None), ("GetGlobalValue", None, False, None), ("GetInFaction", None, False, 0)])
        self.assertEqual(self.q["aliases"], {"0": "Champion"})

    def test_when_in_plain_words(self):
        names = {"Fixture.esp:000900": {"edid": "FXShrineDark", "value": 0}, "Fixture.esp:000901": {"edid": "FXGuild", "name": "Fixture Guild"}}
        quests.describe_when(self.quests, names)
        self.assertEqual(self.q["stages"][4]["entries"][0]["when"], "Stage 20 of this quest done or global FXShrineDark is 1 and Champion is in faction Fixture Guild")
        self.assertNotIn("when", self.q["stages"][3]["entries"][0])
        self.assertEqual(quests.named_forms(self.quests), {"Fixture.esp:000800", "Fixture.esp:000900", "Fixture.esp:000901"})

    def test_condition_words(self):
        own, names = "Fixture.esp:000800", {"Skyrim.esm:000001": {"name": "The Golden Claw"}}
        w = lambda c: quests.condition_words({"or": False, "cmp": "==", "value": 1.0, **c}, own, names, {"3": "Grelod"})  # noqa: E731
        self.assertEqual(w({"fn": "GetStageDone", "param": own, "stage": 160}), "Stage 160 of this quest done")
        self.assertEqual(w({"fn": "GetStageDone", "param": own, "stage": 160, "value": 0.0}), "Stage 160 of this quest not done")
        self.assertEqual(w({"fn": "GetStageDone", "param": "Skyrim.esm:000001", "stage": 10}), "Stage 10 of The Golden Claw done")
        self.assertEqual(w({"fn": "GetDead", "alias": 3}), "Grelod is dead")
        self.assertEqual(w({"fn": "GetInFaction", "param": "Skyrim.esm:000002", "cmp": "!="}), "the player is not in faction Skyrim.esm:000002")
        self.assertEqual(w({"fn": "GetLevel", "cmp": ">=", "value": 20.0}), "level >= 20")

    def test_names_from_a_second_pass(self):
        tes4 = record("TES4", 0, [sub("HEDR", struct.pack("<fII", 1.7, 0, 0x800))])
        glob = record("GLOB", GLOBAL, [sub("EDID", zs("FXShrineDark")), sub("FNAM", b"s"), sub("FLTV", struct.pack("<f", 1.0))])
        fact = record("FACT", FACTION, [sub("EDID", zs("FXGuild")), sub("FULL", zs("Fixture Guild"))])
        other = record("FACT", 0x902, [sub("EDID", zs("FXOther"))])
        buf = tes4 + group("GLOB", [glob]) + group("FACT", [fact, other])
        self.assertEqual(quests.read_names(buf, PLUGIN, {"Fixture.esp:000900", "Fixture.esp:000901"}),
                         {"Fixture.esp:000900": {"edid": "FXShrineDark", "value": 1.0}, "Fixture.esp:000901": {"edid": "FXGuild", "name": "Fixture Guild"}})

    def test_objectives(self):
        self.assertEqual(self.q["objectives"], [{"index": 10, "text": TEXT[3]}, {"index": 20, "text": TEXT[4]}])

    def test_first_entry(self):
        self.assertEqual(quests.first_entry(self.q), TEXT[10])


class LineTest(unittest.TestCase):
    def q(self, edid, qtype, source, plugin="Skyrim.esm", log=True, name=None):
        stages = [{"index": 10, "log": [f"{edid} begins."]}] if log else [{"index": 10}]
        return {"id": f"{plugin}:{len(edid):06X}{edid}", "edid": edid, "name": name or edid, "type": qtype, "plugin": plugin, "source": source,
                "stages": stages, "objectives": [{"index": 0, "text": f"Do {edid}"}]}

    def test_lines(self):
        qs = [
            self.q("MQ102", "Main Quest", "Skyrim"), self.q("MQ101", "Main Quest", "Skyrim"),
            self.q("DA01", "Daedric", "Skyrim"), self.q("DA02", "Daedric", "Skyrim"),
            self.q("FavorA", "Misc", "Skyrim"), self.q("SideA", "Side Quest", "Skyrim"),
            self.q("zzzQ10", "Side Quest", "Big Mod", "Big.esp"), self.q("zzzQ2", "Side Quest", "Big Mod", "Big.esp", name="Big Mod"),
            self.q("zzzBounty", "Misc", "Big Mod", "Big.esp", log=False),
        ]
        lines = {g["name"]: g for g in quests.quest_lines(qs)}
        self.assertEqual(sorted(lines), ["Big Mod", "DA01", "DA02", "Main Quest", "Miscellaneous", "Side quests"])
        main = lines["Main Quest"]
        self.assertEqual((main["kind"], main["count"], main["begins"]), ("story", 2, "MQ101 begins."))
        mod = lines["Big Mod"]
        # EDID order counts numbers as numbers; the opening is the quest named after the mod.
        self.assertEqual([q.split(":")[1][6:] for q in mod["quests"]], ["zzzBounty", "zzzQ2", "zzzQ10"])
        self.assertEqual((mod["kind"], mod["journal"], mod["begins"], mod["plugins"]), ("mod", 2, "zzzQ2 begins.", ["Big.esp"]))
        self.assertEqual(mod["types"], {"Side Quest": 2, "Misc": 1})
        self.assertEqual(lines["DA02"]["kind"], "daedric")
        self.assertEqual(quests.quest_lines(qs)[0]["name"], "Big Mod")  # biggest first


class TagFillsTest(unittest.TestCase):
    """WO-115: what an alias tag stands for, from the alias's fill and the records it names."""

    def plugin(self):
        tes4 = record("TES4", 0, [sub("HEDR", struct.pack("<fII", 1.7, 0, 0x800))])
        qust = record("QUST", 0x800, [sub("EDID", zs("FXCourier")), sub("FULL", zs("Deliver <Alias=Item>")), dnam(8),
                                      sub("QOBJ", struct.pack("<H", 10)), sub("NNAM", zs("Take <Alias=Item> to <Alias.ShortName=Giver> and tell <Alias.PronounObj=Giver>")),
                                      sub("ANAM", sid(2)), sub("ALST", sid(0)), sub("ALID", zs("Item")), sub("ALCO", sid(0x810)), sub("ALED", b""),
                                      sub("ALST", sid(1)), sub("ALID", zs("Giver")), sub("ALFR", sid(0x830)), sub("ALED", b"")])
        npc = record("NPC_", 0x820, [sub("EDID", zs("FXMaro")), sub("ACBS", struct.pack("<I", 0) + bytes(20)), sub("FULL", zs("Commander Maro")), sub("SHRT", zs("Maro"))])
        misc = record("MISC", 0x810, [sub("EDID", zs("FXLetter")), sub("FULL", zs("Letter"))])
        glob = record("GLOB", 0x840, [sub("EDID", zs("FXRoomCost")), sub("FNAM", b"s"), sub("FLTV", struct.pack("<f", 25.0))])
        refr = record("REFR", 0x830, [sub("NAME", sid(0x820))])
        return tes4 + group("QUST", [qust]) + group("NPC_", [npc]) + group("MISC", [misc]) + group("GLOB", [glob]) + group("CELL", [refr])

    def test_alias_tags_from_the_records(self):
        buf = self.plugin()
        (rec,) = quests.read_plugin(buf, "Fixture.esp")
        q = quests.describe(rec, ["Fixture.esp"])
        refs, forms = quests.tag_forms([q])
        self.assertEqual((refs, forms), ({"Fixture.esp:000830"}, {"Fixture.esp:000810"}))
        bases = quests.read_ref_bases(buf, "Fixture.esp", refs)
        self.assertEqual(bases, {"Fixture.esp:000830": "Fixture.esp:000820"})
        names = quests.read_names(buf, "Fixture.esp", forms | set(bases.values()))
        self.assertEqual(quests.tag_fills(q, names, bases), {"<Alias=Item>": "Letter", "<Alias.ShortName=Giver>": "Maro", "<Alias.PronounObj=Giver>": "him"})
        self.assertEqual(quests.read_globals(buf, {"fxroomcost"}), {"fxroomcost": 25.0})


if __name__ == "__main__":
    unittest.main()
