"""quest_pages.py: the Quests pages' data rules (WO-100)."""
import json
import os
import re
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import quest_pages as qp  # noqa: E402


class QuestPagesTest(unittest.TestCase):
    def test_source_names(self):
        self.assertEqual(qp.source_name("VIGILANT - English Translation (Plus Voiced Addon)"), "VIGILANT")
        self.assertEqual(qp.source_name("Meridia's Order ESMIFIED"), "Meridia's Order")
        self.assertEqual(qp.source_name("Undeath Remastered - CLEANED ESMIFIED"), "Undeath Remastered")
        self.assertEqual(qp.source_name("The Welkynar Knight - Quest"), "The Welkynar Knight")
        self.assertEqual(qp.source_name("Skyrim"), "Base game")
        self.assertEqual(qp.source_name("Creation Club"), "Creation Club")
        self.assertEqual(qp.source_name("Missives - Voice and Quest Expansion"), "Missives - Voice and Quest Expansion")

    def test_giver_is_a_person_with_a_place(self):
        where = [{"cellName": "The Bannered Mare", "location": "Whiterun"}]
        e = {"namedGiver": {"npc": "x", "name": "Lurius Liore", "where": where}, "people": [{"alias": "Lurius", "npcId": "x"}]}
        self.assertEqual(qp.giver_of(e), {"name": "Lurius Liore", "place": "The Bannered Mare, Whiterun"})
        # A person whose alias is their own name keeps their place on the page.
        e = {"namedGiver": {"npc": "m", "name": "Meridia", "where": []}, "people": [{"alias": "Meridia", "npcId": "m"}]}
        self.assertEqual(qp.giver_of(e), {"name": "Meridia"})

    def test_a_holding_cell_is_no_place(self):
        e = {"namedGiver": {"npc": "l", "name": "Lurius Liore", "where": [{"cellName": "Wyrmstooth Holder Cell", "location": "Wyrmstooth"}]}, "people": []}
        self.assertEqual(qp.giver_of(e), {"name": "Lurius Liore"})

    def test_roles_are_left_out(self):
        for role in ("Prisoner", "Courier", "Guard", "Bandit", "Necromancer"):
            e = {"namedGiver": {"npc": "c", "name": role, "where": [{"cellName": "Riverwood"}]}, "people": [{"alias": role, "npcId": "c"}]}
            self.assertIsNone(qp.giver_of(e), role)
        self.assertIsNone(qp.giver_of({"people": []}))
        self.assertIsNone(qp.giver_of(None))

    def test_gold_tiers(self):
        lst = lambda n: {"name": n, "type": "leveled list", "kind": "fragment"}  # noqa: E731
        self.assertEqual(qp.gold_tier([lst("LvlQuestReward01Small")]), "small")
        self.assertEqual(qp.gold_tier([lst("LvlQuestReward02Medium"), lst("LvlQuestReward03Large")]), "large")
        self.assertEqual(qp.gold_tier([{"name": "FavorRewardGoldLarge", "type": "leveled list", "kind": "quest script"}]), "large")
        # A plain Septim property alone isn't a reward tier.
        self.assertIsNone(qp.gold_tier([{"name": "Septim", "type": "gold", "kind": "quest script"}]))
        self.assertIsNone(qp.gold_tier([lst("_M_LItemRewardOreHigh")]))

    def test_items_are_weapons_and_armour_from_the_quests_own_records(self):
        rewards = [
            {"name": "Dawnbreaker", "type": "weapon", "kind": "alias"},
            {"name": "Ebony Mail", "type": "armour", "kind": "fragment"},
            {"name": "Skyforge Steel Greatsword", "type": "weapon", "kind": "quest script"},
            {"name": "Beast Form", "type": "spell", "kind": "fragment"},
            {"name": "A Book", "type": "book", "kind": "alias"},
            {"name": "LvlQuestReward02Medium", "type": "leveled list", "kind": "fragment"},
            {"name": "Dawnbreaker", "type": "weapon", "kind": "fragment"},
        ]
        self.assertEqual(qp.reward_items(rewards), ["Dawnbreaker", "Ebony Mail"])

    def test_xp_table(self):
        self.assertEqual(qp.xp_for("Main Quest"), 200)
        self.assertEqual(qp.xp_for("Daedric"), 200)
        self.assertEqual(qp.xp_for("Dawnguard"), 200)
        self.assertEqual(qp.xp_for("Dragonborn"), 200)
        self.assertEqual(qp.xp_for("Civil War"), 150)
        for t in ("Side Quest", "Mages Guild", "Thieves Guild", "Dark Brotherhood", "Companions"):
            self.assertEqual(qp.xp_for(t), 100, t)
        self.assertEqual(qp.xp_for("Misc"), 0)
        self.assertEqual(qp.xp_for(None), 0)

    def test_journal_in_stage_order(self):
        q = {"stages": [{"index": 20, "log": ["Second."]}, {"index": 10, "log": ["First."]}, {"index": 30, "log": []}]}
        self.assertEqual(qp.journal(q), ["First.", "Second."])

    def test_only_instructions_read_from_the_files_show(self):
        line = {"id": "l", "name": "L", "category": "lands", "sources": [{"name": "Skyrim", "modid": None}],
                "opening": "Q", "quests": [], "after": ["college", "main-quest"],
                "start": "Walk in.", "gate": "Level 25.", "minLevel": 25, "size": "1 hour", "note": "Trapped.",
                "checked": {"start": "mod page", "gate": "mod page", "size": "mod page", "note": "files"}}
        out = qp.build_quests([line], [], [])[0]
        self.assertNotIn("start", out)
        self.assertNotIn("gate", out)
        self.assertNotIn("minLevel", out)
        self.assertEqual(out["after"], ["main-quest"])
        self.assertEqual((out["size"], out["note"]), ("1 hour", "Trapped."))
        self.assertEqual(out["checked"], {"size": "mod page", "note": "files"})



RAW = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "gamedata", "5.0.4.8", "quests_raw.json")


class EndingsTest(unittest.TestCase):
    """WO-115: each quest's stages and how it can end, on three quests from the records and the shape quests.py now writes."""

    @classmethod
    def setUpClass(cls):
        with open(RAW, encoding="utf-8") as f:
            cls.raw = {q["edid"]: q for q in json.load(f)["quests"]}

    def endings(self, edid):
        return qp.endings_of(qp.stages_of(self.raw[edid]))

    def test_blood_on_the_ice_ends_two_ways(self):
        ends = self.endings("MS11")
        self.assertEqual([(e["stage"], e.get("completes")) for e in ends], [(100, True), (250, True)])
        self.assertIn("Wuunferth the Unliving was the Butcher of Windhelm", ends[0]["text"])
        self.assertIn("Calixto Corrium was the Butcher of Windhelm", ends[1]["text"])
        # Each says when it happens: stage 100 has no condition in the records; 250's shows only if 100 isn't done.
        self.assertEqual([e["when"] for e in ends], ["the quest reaches stage 100", "the quest reaches stage 250, if stage 100 of this quest not done"])

    def test_innocence_lost_ends_with_grelod_dead_either_way(self):
        ends = self.endings("DB01")
        self.assertEqual([e["stage"] for e in ends], [199, 200])
        self.assertTrue(ends[1]["text"].startswith("I killed Grelod the Kind"))
        # Stage 201 repeats 199's words but doesn't end the quest.
        stages = {st["index"]: st for st in qp.stages_of(self.raw["DB01"])}
        self.assertEqual(stages[201]["log"], [{"text": stages[199]["log"][0]["text"]}])

    def test_a_quest_with_no_ending_in_its_records(self):
        self.assertEqual(self.endings("FreeformRiften11"), [])
        self.assertEqual(qp.stages_of(self.raw["FreeformRiften11"]), [])

    def test_entries_from_quests_py_keep_their_own_flags_and_when(self):
        q = {"stages": [
            {"index": 200, "log": ["Kept.", "Refused."], "completes": True, "fails": True,
             "entries": [{"text": "Kept.", "completes": True}, {"text": "Refused.", "fails": True, "conditions": [{"fn": "GetStageDone"}], "when": "Stage 20 of this quest done"}]},
            {"index": 10, "log": ["Begun."], "entries": [{"text": "Begun."}]},
            {"index": 255, "entries": [{"text": "", "completes": True}]},
        ]}
        stages = qp.stages_of(q)
        self.assertEqual([st["index"] for st in stages], [10, 200, 255])
        self.assertEqual(stages[1]["log"][1], {"text": "Refused.", "fails": True, "when": "Stage 20 of this quest done"})
        self.assertEqual(qp.endings_of(stages), [
            {"stage": 200, "text": "Kept.", "completes": True, "when": "the quest reaches stage 200"},
            {"stage": 200, "text": "Refused.", "fails": True, "when": "the quest reaches stage 200, if stage 20 of this quest done"},
            {"stage": 255, "text": "", "completes": True, "when": "the quest reaches stage 255"},
        ])

    def test_every_quest_on_the_pages_has_endings(self):
        line = {"id": "l", "name": "L", "category": "lands", "sources": [{"name": "Skyrim"}], "opening": "MS11",
                "quests": [{"id": self.raw[e]["id"]} for e in ("MS11", "DB01", "FreeformRiften11")], "checked": {}}
        out = qp.build_quests([line], list(self.raw.values()), [])[0]["quests"]
        self.assertEqual([len(q["endings"]) for q in out], [2, 2, 0])
        self.assertEqual(out[0]["journal"], qp.fill_all(qp.journal(self.raw["MS11"]), self.raw["MS11"].get("fills", {}), {}))


class TagsTest(unittest.TestCase):
    """WO-115: the game's text tags filled from the records, or plain words where the records don't say."""

    def test_fills_globals_dates_and_plain_words(self):
        fills = {"<Alias=Questgiver>": "Commander Maro", "<Alias.PronounObj=Target>": "her"}
        g = {"roomcost": 25.0}
        self.assertEqual(qp.fill_text("Return to <Alias=Questgiver>", fills, g), "Return to Commander Maro")
        self.assertEqual(qp.fill_text("Kill <Alias.PronounObj=Target> and <Alias.Pronoun=Other>", fills, g), "Kill her and they")
        self.assertEqual(qp.fill_text("Rent a room (<Global=RoomCost> gold)", fills, g), "Rent a room (25 gold)")
        self.assertEqual(qp.fill_text("Deliver <Alias=Item> by <Global.Day=D> of <Global.MonthWord=D>", {}, g), "Deliver the item by the set date")
        self.assertEqual(qp.fill_text("<alias=item>", {}, g), "The item")
        self.assertEqual(qp.fill_text("Kill the <Alias=Beast>", {}, g), "Kill the beast")
        self.assertEqual(qp.fill_text("Deliver <Alias=Item by noon", {}, g), "Deliver the item by noon")  # never closed in the record
        self.assertEqual(qp.fill_text("Find <Alias=MS11TargetLocation>", {}, g), "Find the target location")

    def test_every_string_in_a_quest(self):
        out = qp.fill_all({"objectives": ["Find <Alias=Item>"], "start": {"needs": ["Pay <Global=Cost> gold"]}, "xp": 100}, {}, {"cost": 10})
        self.assertEqual(out, {"objectives": ["Find the item"], "start": {"needs": ["Pay 10 gold"]}, "xp": 100})


class StartTest(unittest.TestCase):
    """WO-115 Part 2: a quest's checked start from its story_check row, in plain words."""

    def test_a_quest_running_from_the_start_keeps_its_ways_and_one_speaker_is_who(self):
        # WO-121: The Book of Love runs from the game's start and Dinya Balu sets it going; the first
        # objective's target (Fastred) is where it sends you, not who starts it.
        row = {"name": "The Book of Love", "startedBy": [{"by": "dialogue", "speaker": "Dinya Balu", "speakerPlaced": ["Temple of Mara"], "prompt": "Just tell me what to do."}, {"by": "start game"}],
               "target": [{"holds": [{"name": "Fastred", "kind": "unique actor", "where": ["Fellstar Farm"]}]}], "firstObjective": {"text": "Talk to Fastred"},
               "needs": {"conditions": None, "doors": []}}
        self.assertEqual(qp.start_of(row, {}), {
            "needs": [],
            "ways": [{"how": 'Ask Dinya Balu "Just tell me what to do." in Temple of Mara', "who": "Dinya Balu", "where": "Temple of Mara"}],
            "who": "Dinya Balu", "where": "Temple of Mara",
            "then": "Talk to Fastred", "thenWhere": "Fellstar Farm", "thenWho": "Fastred",
            "checked": "files",
        })

    def test_who_among_several_only_the_named_giver_never_a_thing(self):
        talks = [{"by": "dialogue", "speaker": n} for n in ("Aela the Huntress", "Vilkas", "Kodlak Whitemane")]
        row = {"name": "Take Up Arms", "startedBy": talks, "target": [{"holds": [{"name": "Golden Claw", "kind": "item", "where": ["Riverwood Trader"]}]}],
               "firstObjective": {"text": "Speak to Kodlak Whitemane"}, "needs": {"conditions": None, "doors": []}}
        self.assertNotIn("who", qp.start_of(row, {}))
        self.assertEqual(qp.start_of(row, {}, {"name": "Kodlak Whitemane", "place": "Jorrvaskr, Whiterun"})["who"], "Kodlak Whitemane")
        self.assertEqual(qp.start_of(row, {}, {"name": "Kodlak Whitemane", "place": "Jorrvaskr, Whiterun"})["where"], "Jorrvaskr, Whiterun")
        # An item as the first objective's target is never a who.
        self.assertNotIn("thenWho", qp.start_of(row, {}))

    def test_ways_in_with_their_needs(self):
        node = {"by": "story manager", "event": "change location", "conditions": "Laid to Rest completed; level >= DLC1VQMinLevel (now 30); Dawnguard stage < 10; fn576 == 1"}
        helper = {"by": "quest script", "quest": "DLC1VQ00ChangeLocation, a helper quest", "throughStartedBy": [node]}
        talk = {"by": "dialogue", "speaker": "Agmaer", "speakerPlaced": ["Fort Dawnguard"], "conditions": "the speaker is Agmaer"}
        row = {"name": "Dawnguard", "startedBy": [helper, talk], "target": [], "needs": {"conditions": None, "doors": []}}
        start = qp.start_of(row, {})
        self.assertEqual(start["ways"][0], {"how": "Through DLC1VQ00ChangeLocation, which starts from: It starts by itself on change location",
                                            "needs": ["Laid to Rest completed", "Level 30", "a condition the start check can't name yet (fn576 == 1)"]})
        self.assertEqual(start["ways"][1], {"how": "Talk to Agmaer in Fort Dawnguard", "who": "Agmaer", "where": "Fort Dawnguard"})
        self.assertEqual((start["who"], start["checked"]), ("Agmaer", "files"))

    def test_earlier_quest_and_untraced(self):
        row = {"name": "Proving Honor", "startedBy": [{"by": "quest script", "quest": "C00 (Take Up Arms)", "atStage": 200}], "target": [], "needs": {"conditions": "level >= 5"}}
        self.assertEqual(qp.start_of(row, {"C00": "Take Up Arms"})["needs"], ["After Take Up Arms (its stage 200)", "Level 5"])
        self.assertEqual(qp.start_of({"name": "X", "startedBy": [], "unread": "no starter"}, {})["checked"], "not yet")
        self.assertEqual(qp.start_of(None, {}), {"checked": "not yet"})
        stuck = {"name": "X", "startedBy": [{"by": "quest script", "quest": "Helper, a helper quest", "throughStartedBy": []}], "target": [], "needs": {}}
        self.assertEqual(qp.start_of(stuck, {})["checked"], "not yet")


class SentBackTest(unittest.TestCase):
    """WO-121a Part 1: the five rules Bob sent back."""

    TOWNS = {"Brina's House": "Dawnstar", "The White Hall": "Dawnstar", "Rustleif's House": "Dawnstar", "Windpeak Inn": "Dawnstar"}

    def test_a_rumour_is_a_way_and_the_first_step_is_the_person(self):
        talk = lambda who, cell, cond=None: {"by": "dialogue", "speaker": who, "speakerPlaced": [cell], "prompt": "Nightmares?", **({"conditions": cond} if cond else {})}
        row = {"name": "Waking Nightmare",
               "startedBy": [talk("Brina Merilis", "Brina's House"), talk("Skald the Elder", "The White Hall"), talk("Madena", "The White Hall", "fn67 == 1"), talk("Rustleif", "Rustleif's House")],
               "target": [{"holds": [{"name": "Erandur", "kind": "unique actor", "where": ["Windpeak Inn"]}]}], "firstObjective": {"text": "Speak to Erandur"},
               "needs": {"conditions": None, "doors": []}}
        start = qp.start_of(row, {}, None, self.TOWNS)
        self.assertEqual(start["ways"], [{"how": "Hear people in Dawnstar talk about it", "where": "Dawnstar"}])
        self.assertEqual(start["needs"], ["Hear people in Dawnstar talk about it"])
        self.assertNotIn("who", start)
        self.assertEqual((start["then"], start["thenWho"], start["thenWhere"]), ("Speak to Erandur", "Erandur", "Windpeak Inn"))

    def test_several_people_in_one_hall_are_not_a_rumour(self):
        talks = [{"by": "dialogue", "speaker": n, "speakerPlaced": ["Jorrvaskr Living Quarters, Jorrvaskr"]} for n in ("Aela the Huntress", "Vilkas", "Farkas")]
        start = qp.start_of({"name": "Take Up Arms", "startedBy": talks, "target": [], "needs": {}}, {}, None, {})
        self.assertEqual([w.get("who") for w in start["ways"]], ["Aela the Huntress", "Vilkas", "Farkas"])

    def test_a_role_is_never_who(self):
        row = {"name": "Thane of Whiterun", "startedBy": [{"by": "dialogue", "speaker": "Courier", "speakerPlaced": ["Whiterun Messenger Tower"]}], "target": [], "needs": {}}
        start = qp.start_of(row, {})
        self.assertNotIn("who", start)
        self.assertNotIn("who", start["ways"][0])
        self.assertTrue(qp.is_role("Windhelm Guard"))
        self.assertFalse(qp.is_role("Vigilant Tolan"))
        self.assertIsNone(qp.giver_of({"namedGiver": {"name": "Courier", "where": [{"cellName": "Whiterun Messenger Tower", "location": "Guard Tower"}]}}))

    def test_a_place_a_player_can_find(self):
        self.assertEqual(qp.clean_place("Blue Palace, The Blue Palace"), "Blue Palace")
        self.assertEqual(qp.clean_place("Hulgard And Svenja's House, Hulgard and Svenja's House"), "Hulgard And Svenja's House")
        self.assertEqual(qp.clean_place("Wyrmstooth Holder Cell, Wyrmstooth"), "Wyrmstooth")
        self.assertIsNone(qp.clean_place("Skyrim"))
        self.assertEqual(qp.clean_place("Temple of Mara, Riften"), "Temple of Mara, Riften")
        row = {"name": "Markarth Side", "startedBy": [{"by": "dialogue", "speaker": "Grit-dar", "speakerPlaced": ["Skyrim"], "prompt": "Fight?"}], "target": [], "needs": {}}
        start = qp.start_of(row, {})
        self.assertEqual((start["who"], start.get("where"), start["ways"][0]["how"]), ("Grit-dar", None, 'Ask Grit-dar "Fight?"'))

    def test_the_first_step_is_the_one_shown_first(self):
        accept = {"by": "dialogue", "speaker": "Dengeir of Stuhn", "info": "Skyrim.esm:0B83BB", "call": "SetStage 10", "prompt": "I will see that Vighar is destroyed."}
        main = {"name": "Dark Ancestor", "startedBy": [accept, {"by": "start game"}], "firstObjectiveStage": 20, "firstObjective": {"text": "Tell Dengeir that Vighar is dead"},
                "target": [{"holds": [{"name": "Dengeir of Stuhn", "kind": "unique actor", "where": ["Dengeir's House"]}]}], "needs": {}}
        hunt = {"name": "Dark Ancestor", "startedBy": [accept], "firstObjectiveStage": 10, "firstObjective": {"text": "Destroy the vampire Vighar"},
                "target": [{"holds": [{"name": "a marker", "kind": "forced reference", "where": ["Bloodlet Throne"]}]}], "needs": {}}
        siblings = {"FreeformFalkreathQuest03": main, "FreeformFalkreathQuest03B": hunt}
        self.assertEqual(qp.start_of(main, {}, None, {}, siblings)["then"], "Destroy the vampire Vighar")
        # Alone, or when the talk's stage already shows the quest's own objective, it keeps its own.
        self.assertEqual(qp.start_of(main, {})["then"], "Tell Dengeir that Vighar is dead")
        self.assertEqual(qp.start_of(hunt, {}, None, {}, siblings)["then"], "Destroy the vampire Vighar")

    def test_towns_from_placed_people_and_house_keys(self):
        givers = [{"where": [{"cellName": "The White Hall", "location": "Dawnstar"}, {"cellName": "Riften", "location": "Riften"}]}]
        starts = {"lines": [{"doors": [{"intoName": "Dawnstar", "lock": {"keyName": "Key to Brina's House"}}, {"intoName": "Honeyside", "lock": {"keyName": "Key to Honeyside"}}]}]}
        self.assertEqual(qp.towns_of(givers, starts), {"The White Hall": "Dawnstar", "Brina's House": "Dawnstar"})


class JudgedTest(unittest.TestCase):
    """WO-121b Part 1: the rules from Bob's judged openings."""

    def test_the_first_step_is_what_the_starting_lines_stage_shows(self):
        objectives = [{"index": 10, "text": "Inspect the Temple of Kynareth"}, {"index": 20, "text": "Retrieve Nettlebane"}]
        talk = {"by": "dialogue", "speaker": "Danica Pure-Spring", "speakerPlaced": ["Temple of Kynareth"], "call": "SetStage 20", "prompt": "I'll get Nettlebane for you."}
        row = {"name": "The Blessings of Nature", "startedBy": [talk], "firstObjectiveStage": 20, "firstObjective": {"text": "Inspect the Temple of Kynareth", "index": 10},
               "objectivesShown": {"20": 20}, "target": [], "needs": {}}
        self.assertEqual(qp.start_of(row, {}, objectives=objectives)["then"], "Retrieve Nettlebane")
        # Spread the Love's talk sets 20, which shows objective 10: the check's stays.
        favour = {**row, "objectivesShown": {"10": 20, "20": 30}}
        self.assertEqual(qp.start_of(favour, {}, objectives=objectives)["then"], "Inspect the Temple of Kynareth")
        # A check from before objectivesShown keeps its first objective.
        self.assertEqual(qp.start_of({k: v for k, v in row.items() if k != "objectivesShown"}, {}, objectives=objectives)["then"], "Inspect the Temple of Kynareth")

    def test_a_required_objective_beats_an_optional_one(self):
        objectives = [{"index": 5, "text": "(Optional) Protect Golldir"}, {"index": 10, "text": "Defeat Vals Veran"}]
        talk = {"by": "dialogue", "speaker": "Golldir", "speakerPlaced": ["Hillgrund's Tomb"], "call": "SetStage 10", "prompt": "Let's go."}
        row = {"name": "Ancestral Worship", "startedBy": [talk], "firstObjectiveStage": 10, "firstObjective": {"text": "(Optional) Protect Golldir", "index": 5}, "target": [], "needs": {}}
        self.assertEqual(qp.start_of(row, {}, objectives=objectives)["then"], "Defeat Vals Veran")
        self.assertEqual(qp.start_of({**row, "objectivesShown": {"5": 10, "10": 10}}, {}, objectives=objectives)["then"], "Defeat Vals Veran")

    def test_when_the_quest_finds_you_say_so(self):
        node = {"by": "story manager", "event": "change location", "conditions": "level >= DLC2EbonyWarriorMinLevel_KRY (now 40); the place you leave isn't Solstheim; the place you enter is Whiterun or the place you enter is Riften or the place you enter is Solitude"}
        talk = {"by": "dialogue", "speaker": "Ebony Warrior", "speakerPlaced": ["Ebony Warrior's Camp"], "call": "SetStage 10", "prompt": "What were you saying before?"}
        start = qp.start_of({"name": "The Ebony Warrior", "startedBy": [talk, node], "firstObjectiveStage": 10, "target": [], "needs": {}}, {})
        self.assertEqual(start["ways"][0], {"how": "Ebony Warrior comes to find you in Whiterun, Riften or Solitude", "needs": ["Level 40"], "who": "Ebony Warrior", "where": "Whiterun, Riften or Solitude"})
        self.assertEqual((start["who"], start["where"]), ("Ebony Warrior", "Whiterun, Riften or Solitude"))
        self.assertEqual(start["ways"][1]["how"], 'Ask Ebony Warrior "What were you saying before?"')
        # Kept in a holding cell: no place, never the cell.
        held = {"by": "dialogue", "speaker": "Theodyn Bienne", "speakerPlaced": ["Wyrmstooth Holder Cell, Wyrmstooth"], "call": "SetStage 10", "conditions": "level >= WTStartLevel (now 10)"}
        helper = {"by": "quest script", "quest": "WTWyrmstoothStarter, a helper quest", "call": "Start", "throughStartedBy": [{"by": "story manager", "event": "change location"}]}
        start = qp.start_of({"name": "Wyrmstooth", "startedBy": [helper, helper, held], "firstObjectiveStage": 10, "target": [], "needs": {}}, {})
        self.assertEqual((start["ways"][0]["how"], start["who"], start.get("where")), ("Theodyn Bienne comes to find you", "Theodyn Bienne", None))
        # A messenger with no name, among other ways: no single giver.
        messenger = {"by": "quest script", "quest": "DLC1VQ00ChangeLocation, a helper quest with Messenger", "call": "SetStage 5",
                     "throughStartedBy": [{"by": "story manager", "event": "change location", "conditions": "Laid to Rest completed; level >= DLC1VQMinLevel (now 30); the place you enter is a habitation"}]}
        agmaer = {"by": "dialogue", "speaker": "Agmaer", "speakerPlaced": ["Fort Dawnguard"], "call": "SetStage 10"}
        start = qp.start_of({"name": "Dawnguard", "startedBy": [messenger, agmaer], "firstObjectiveStage": 10, "target": [], "needs": {}}, {})
        self.assertEqual(start["ways"][0]["how"], "A messenger comes to find you in any inn")
        self.assertEqual(start["ways"][0]["needs"], ["Laid to Rest completed", "Level 30"])
        self.assertNotIn("who", start)
        # A bounty that fires on entering the giver's own town isn't one.
        bounty = {"by": "story manager", "event": "change location", "conditions": "the place you enter is Falkreath"}
        dengeir = {"by": "dialogue", "speaker": "Dengeir of Stuhn", "speakerPlaced": ["Dengeir's House, Falkreath"], "call": "SetStage 10"}
        self.assertIsNone(qp.finds_you([bounty, dengeir], "Bounty", "Favor001", 10, {}))

    def test_a_conditional_starter_is_a_way_never_the_giver(self):
        larak = {"by": "dialogue", "speaker": "Chief Larak", "speakerPlaced": ["Larak's Longhouse"], "call": "SetStage 5", "prompt": "Is anything happening at the other Strongholds?",
                 "conditions": "the speaker is Chief Larak; GetInFaction Blood-Kin of the Orcs == 1 or GetIsRace Skyrim.esm:013747 == 1"}
        node = {"by": "story manager", "event": "level up", "conditions": "level >= DA06MinLevel (now 20)"}
        start = qp.start_of({"name": "The Cursed Tribe", "startedBy": [larak, node], "firstObjectiveStage": 5, "target": [], "needs": {}}, {})
        self.assertNotIn("who", start)
        self.assertNotIn("who", start["ways"][0])
        # A faction condition can be the speaker's own: Mralki the innkeeper stays the giver.
        mralki = {"by": "dialogue", "speaker": "Mralki", "speakerPlaced": ["Frostfruit Inn"], "call": "SetStage 10", "conditions": "GetInFaction JobInnkeeperFaction == 1; the speaker is Mralki"}
        self.assertEqual(qp.start_of({"name": "The Unquiet Dead", "startedBy": [mralki], "firstObjectiveStage": 15, "target": [], "needs": {}}, {})["who"], "Mralki")

    def test_a_line_that_needs_the_quest_under_way_isnt_its_start(self):
        legate = {"by": "dialogue", "speaker": "Legate Adventus Caesennius", "speakerPlaced": ["Solitude"], "call": "SetStage 2", "conditions": "Battle of the Champions stage 20 done"}
        start = qp.start_of({"name": "Battle of the Champions", "startedBy": [legate], "firstObjectiveStage": 10, "target": [], "needs": {}}, {})
        self.assertNotIn("who", start)
        self.assertNotIn("ways", start)
        self.assertEqual(start["checked"], "files")
        # Falk Firebeard's line needs stage 10, which the letter sets before anything shows (the first objective is at 50).
        falk = {"by": "dialogue", "speaker": "Falk Firebeard", "speakerPlaced": ["Blue Palace"], "call": "SetStage 50", "conditions": "The Wolf Queen Awakened stage == 10"}
        self.assertEqual(qp.start_of({"name": "The Wolf Queen Awakened", "startedBy": [falk], "firstObjectiveStage": 50, "target": [], "needs": {}}, {})["who"], "Falk Firebeard")
        # A named person alongside a guard, each starting it, isn't the one giver.
        jonna = {"by": "dialogue", "speaker": "Jonna", "speakerPlaced": ["Moorside Inn"], "call": "SetStage 20", "conditions": "Laid to Rest stage == 10"}
        guard = {"by": "dialogue", "speaker": None, "call": "SetStage 20", "conditions": "GetInFaction Guard Faction (for dialogue) == 1"}
        self.assertNotIn("who", qp.start_of({"name": "Laid to Rest", "startedBy": [jonna, guard], "firstObjectiveStage": 20, "target": [], "needs": {}}, {}))


class SecondLookTest(unittest.TestCase):
    """WO-121b Part 4: Bob's second look at the openings."""

    def test_a_placeholder_objective_is_never_the_first_step(self):
        objectives = [{"index": 10, "text": "TEST"}, {"index": 15, "text": "Read the Message"}, {"index": 20, "text": "Speak to Thane Hroa"}]
        row = {"name": "Skirmish at Whitewatch", "startedBy": [{"by": "start game"}], "firstObjectiveStage": 15, "firstObjective": {"text": "TEST", "index": 10}, "target": [], "needs": {}}
        self.assertEqual(qp.start_of(row, {}, objectives=objectives)["then"], "Read the Message")
        # With no real objective after it, the stage's journal text.
        alone = {**row, "firstObjectiveStage": 10}
        self.assertEqual(qp.start_of(alone, {}, objectives=objectives[:1], logs={10: "I've received a note."})["then"], "I've received a note.")

    def test_a_giver_is_where_the_start_brings_them_never_their_waiting_spot(self):
        altano = {"by": "dialogue", "speaker": "Altano", "speakerPlaced": ["Temple of Stendarr"], "call": "SetStage 5"}
        node = {"by": "story manager", "event": "change location", "conditions": "level >= zzzVigilantMinLevel (now 25)"}
        row = {"name": "Vigilant of Stendarr", "startedBy": [altano, node], "firstObjectiveStage": 5, "target": [], "needs": {}}
        start = qp.start_of(row, {}, brings="Dawnstar")
        self.assertEqual((start["who"], start["where"]), ("Altano", "Dawnstar"))
        self.assertEqual(start["ways"][0]["how"], "Altano comes to find you in Dawnstar")
        towns = {"Windpeak Inn": "Dawnstar"}
        self.assertEqual(qp.brought_to({"people": [{"alias": "DawnstarLocation", "npc": None}, {"alias": "Altano", "npc": "Altano"}]}, towns), "Dawnstar")
        self.assertIsNone(qp.brought_to({"people": [{"alias": "HometownLoc", "npc": None}]}, towns))

    def test_a_quest_opened_through_its_giver_dialogue_helper_names_them(self):
        giver = {"name": "Gwilym", "place": "Silver-Blood Inn"}
        helper = {"by": "quest script", "call": "SetStage 10", "quest": "aaaHOTRDialogue, a helper quest", "throughStartedBy": [{"by": "start game"}]}
        start = qp.start_of({"name": "Heart Of The Reach", "startedBy": [helper], "firstObjectiveStage": 10, "target": [], "needs": {}}, {}, giver)
        self.assertEqual((start["who"], start["where"]), ("Gwilym", "Silver-Blood Inn"))
        # A helper the check can't open, holding the giver's own alias.
        ralforn = {"by": "quest script", "call": "SetStage 10", "quest": "aaaMBRalfornDialogue, a helper quest with RalfornAlias"}
        self.assertEqual(qp.start_of({"name": "Sleepwalking", "startedBy": [ralforn], "target": [], "needs": {}}, {}, {"name": "Ralforn"})["who"], "Ralforn")
        # Cultists' nodes are no one's dialogue: Dragonborn names no one.
        cult = {"by": "quest script", "quest": "DLC2MQ01Cultists, a helper quest", "throughStartedBy": [{"by": "story manager", "event": "change location"}]}
        self.assertNotIn("who", qp.start_of({"name": "Dragonborn", "startedBy": [cult], "target": [], "needs": {}}, {}, {"name": "Neloth"}))
        # A helper traced to the start of the game holding the giver's alias stays unsure (Mjoll).
        mjoll = {"by": "quest script", "quest": "aaMjollAerinQIntro, a helper quest with MjollAlias", "throughStartedBy": [{"by": "start game"}]}
        self.assertNotIn("who", qp.start_of({"name": "Aerin the Man", "startedBy": [mjoll], "target": [], "needs": {}}, {}, {"name": "Mjoll the Lioness"}))


class Part2Test(unittest.TestCase):
    """WO-121b Part 2: the starts the records hold once the check reads further."""

    def test_a_rumour_a_givers_line_needs_comes_first(self):
        hulda = {"by": "dialogue", "speaker": "Hulda", "speakerPlaced": ["The Bannered Mare, Whiterun"], "call": "SetStage 10"}
        node = {"by": "story manager", "event": "level up", "conditions": "level >= DA08MinLevel (now 20)"}
        balgruuf = {"by": "dialogue", "speaker": "Balgruuf the Greater", "speakerPlaced": ["Dragonsreach"], "call": "SetStage 10",
                    "prompt": "I've heard there's trouble with your children.", "after": [{"quest": "DA08RumorPointer", "startedBy": [hulda, node]}]}
        start = qp.start_of({"name": "The Whispering Door", "startedBy": [balgruuf], "firstObjectiveStage": 10, "target": [], "needs": {}}, {})
        self.assertEqual([w["how"] for w in start["ways"]], ["Hear about it from Hulda in The Bannered Mare, Whiterun",
                                                              "Ask Balgruuf the Greater \"I've heard there's trouble with your children.\" in Dragonsreach"])
        self.assertNotIn("who", start)

    def test_a_quest_another_starts_at_a_stage_names_who_sets_that_stage(self):
        rikke = {"by": "dialogue", "speaker": "Legate Rikke", "speakerPlaced": ["Castle Dour"], "call": "SetStage 20"}
        helper = {"by": "quest script", "quest": "CW00A (Imperial Introductions)", "atStage": 20, "call": "SetStage 1", "throughStage": [rikke]}
        start = qp.start_of({"name": "Joining the Legion", "startedBy": [helper], "firstObjectiveStage": 1, "target": [], "needs": {}}, {"CW00A": "Imperial Introductions"})
        self.assertEqual((start["who"], start["where"]), ("Legate Rikke", "Castle Dour"))

    def test_reading_a_book(self):
        book = {"by": "book", "book": "Deathbrand", "call": "SetStage 1", "plain": "Read Deathbrand"}  # the book and Geldis both set 1
        geldis = {"by": "dialogue", "speaker": "Geldis Sadri", "speakerPlaced": ["The Retching Netch"], "call": "SetStage 1"}
        start = qp.start_of({"name": "Deathbrand", "startedBy": [geldis, book], "firstObjectiveStage": 29, "target": [], "needs": {}}, {})
        self.assertEqual(start["ways"][0]["how"], "Read Deathbrand")
        self.assertNotIn("who", start)  # Geldis is only another way

    def test_an_objective_once_per_hold(self):
        objectives = [{"index": i * 10, "text": f"Assist the people of {h} (0/5)"} for i, h in enumerate(("The Reach", "The Rift", "Haafingar", "Whiterun"), 1)]
        self.assertEqual(qp.one_per_hold("Assist the people of The Reach (0/5)", objectives), "Assist the people of that jarl's hold")
        self.assertIsNone(qp.one_per_hold("Bring the letter to The Reach", objectives[:1]))

    def test_the_messenger_by_name(self):
        messenger = {"by": "quest script", "quest": "DLC1VQ00ChangeLocation, a helper quest with Messenger", "messenger": "Durak", "call": "SetStage 5",
                     "throughStartedBy": [{"by": "story manager", "event": "change location", "conditions": "level >= DLC1VQMinLevel (now 30); the place you enter is a habitation"}]}
        agmaer = {"by": "dialogue", "speaker": "Agmaer", "speakerPlaced": ["Fort Dawnguard"], "call": "SetStage 10"}
        start = qp.start_of({"name": "Dawnguard", "startedBy": [messenger, agmaer], "firstObjectiveStage": 10, "target": [], "needs": {}}, {})
        self.assertEqual(start["ways"][0]["how"], "Durak comes to find you in any inn")
        self.assertNotIn("who", start)


ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
QUESTS = os.path.join(ROOT, "src", "data", "lorerim-5.0.4.8", "quests.json")
# What a player must never read in a start (WO-126): a condition function, a comparison, or a helper quest's editor id.
LEAK = re.compile(r"\b(Get[A-Z]\w*|Is[A-Z][a-z]\w*|Has[A-Z]\w*|fn\d+)\b|==|>=|<|\bThrough \S+[A-Z]")


def start_texts(start):
    """Every text a page can show from a start: everything but raw."""
    if isinstance(start, dict):
        return [t for k, v in start.items() if k != "raw" for t in start_texts(v)]
    if isinstance(start, list):
        return [t for v in start for t in start_texts(v)]
    return [start] if isinstance(start, str) else []


class ThirdLookTest(unittest.TestCase):
    """WO-121b: Bob's calls on the PC's traces, 22 Oct."""

    def test_a_talk_only_for_some_players_doesnt_set_everyones_first_step(self):
        objectives = [{"index": 5, "text": "Read the letter from Largashbur"}, {"index": 20, "text": "Speak with Yamarz"}]
        larak = {"by": "dialogue", "speaker": "Chief Larak", "call": "SetStage 5", "conditions": "GetInFaction Blood-Kin of the Orcs == 1 or GetIsRace Orc == 1"}
        atub = {"by": "dialogue", "speaker": "Atub", "speakerPlaced": ["Largashbur Longhouse, Largashbur's Longhouse"], "call": "SetStage 20"}
        row = {"name": "The Cursed Tribe", "startedBy": [larak, atub], "firstObjectiveStage": 5, "firstObjective": {"index": 5, "text": objectives[0]["text"]},
               "objectivesShown": {"5": 5, "20": 20}, "target": [], "needs": {}}
        start = qp.start_of(row, {}, objectives=objectives, say=qp.Words())
        self.assertEqual((start["who"], start["where"], start["then"]), ("Atub", "Largashbur Longhouse", "Speak with Yamarz"))
        self.assertEqual(start["ways"][0]["needs"], ["You're in the Blood-Kin of the Orcs or an Orc"])

    def test_a_traced_book_leads_and_names_no_giver(self):
        book = {"by": "book", "call": "SetStage 1", "plain": "Read Ruminations on the Elder Scrolls"}
        urag = {"by": "dialogue", "speaker": "Urag gro-Shub", "speakerPlaced": ["The Arcanaeum"], "call": "SetStage 10", "prompt": "Where did he go?"}
        objectives = [{"index": 5, "text": "Ask Urag about the insane book"}, {"index": 10, "text": "Find Septimus Signus"}]
        row = {"name": "Discerning the Transmundane", "startedBy": [book, urag, {"by": "start game"}], "firstObjectiveStage": 5,
               "firstObjective": {"index": 5, "text": objectives[0]["text"]}, "objectivesShown": {"5": 5, "10": 10}, "target": [], "needs": {}}
        start = qp.start_of(row, {}, objectives=objectives, say=qp.Words())
        self.assertEqual([w["how"] for w in start["ways"]], ["Read Ruminations on the Elder Scrolls", 'Ask Urag gro-Shub "Where did he go?" in The Arcanaeum'])
        self.assertNotIn("who", start)
        self.assertEqual(start["then"], "Ask Urag about the insane book")

    def test_a_start_game_helper_that_holds_the_giver_and_opens_from_its_stage(self):
        mjoll = {"by": "quest script", "quest": "aaMjollAerinQIntro, a helper quest with Mjoll, Aerin", "atStage": 20, "call": "SetStage 10", "throughStartedBy": [{"by": "start game"}]}
        giver = {"name": "Mjoll the Lioness", "place": "Aerin's House, Riften"}
        start = qp.start_of({"name": "Aerin the Man", "startedBy": [mjoll], "target": [], "needs": {}}, {}, giver, say=qp.Words())
        self.assertEqual((start["who"], start["where"]), ("Mjoll the Lioness", "Aerin's House, Riften"))
        self.assertEqual(start["ways"], [{"how": "Talk to Mjoll the Lioness in Aerin's House, Riften"}])
        # A helper a player knows by name stays that quest, even holding the giver.
        love = {"by": "quest script", "quest": 'T02 (named "The Book of Love" in its record), a helper quest with Dinya', "atStage": 20, "throughStartedBy": [{"by": "start game"}]}
        self.assertEqual(qp.way_words(love, "Spread the Love", {}, qp.Words(), {"name": "Dinya Balu"}), [("Through The Book of Love", [])])

    def test_a_patchs_catch_up_quest_is_no_way_in(self):
        usk = {"by": "quest script", "quest": 'USKPRetroactive12 (named "Retroactive fixes for 1.2" in its record), a helper quest', "throughStartedBy": [{"by": "start game"}]}
        self.assertEqual(qp.way_words(usk, "Blood's Honor", {}, qp.Words()), [])
        # A quest only the patch's helpers reach isn't traced: its page says so.
        version = {"by": "quest script", "quest": "USKPVersionTracking, a helper quest", "throughStartedBy": [{"by": "start game"}]}
        start = qp.start_of({"name": "Containment", "startedBy": [usk, version], "target": [], "needs": {}}, {}, say=qp.Words())
        self.assertEqual(start["checked"], "not yet")

    def test_a_place_named_twice_is_named_once(self):
        self.assertEqual(qp.clean_place("Largashbur Longhouse, Largashbur's Longhouse"), "Largashbur Longhouse")

    def test_trius_trinket_is_off_the_lists(self):
        with open(QUESTS, encoding="utf-8") as f:
            data = json.load(f)
        self.assertNotIn("trius-trinket", [l["id"] for l in data["lines"]])
        self.assertNotIn("dunShipwreck04QST", [q["edid"] for l in data["lines"] for q in l["quests"]])


class WorkShelfTest(unittest.TestCase):
    """WO-130: what Dave's test of WO-115 showed."""

    def test_a_reply_that_turns_the_job_down_or_ends_the_talk_is_no_way_in(self):
        say = qp.Words()
        for prompt in ("You mean...? I... Ehh... Y-You... No! That's everything! Take care now! Bye!",
                       "Let her enjoy herself. Nothing wrong with that. It's perfectly normal, you know.",
                       "I want no part of this.", "I can't help you right now.", "No, not really.",
                       "(Invisible Continue)(Forced Good bye) Time Limit to Attack"):
            self.assertEqual(qp.way_words({"by": "dialogue", "speaker": "Haelga", "prompt": prompt}, "Caught Red Handed", {}, say), [], prompt)
        # An answer that carries on the talk stays a way in.
        for prompt in ("No, I haven't seen Varona.", "I'll take care of the bandits for you.", "I won't say no to that."):
            self.assertEqual(len(qp.way_words({"by": "dialogue", "speaker": "Varnius", "prompt": prompt}, "Q", {}, say)), 1, prompt)

    def test_caught_red_handed_keeps_only_its_ways_in(self):
        with open(QUESTS, encoding="utf-8") as f:
            q = next(q for l in json.load(f)["lines"] for q in l["quests"] if q["name"] == "Caught Red Handed")
        ways = json.dumps(q["start"].get("ways", []))
        self.assertNotIn("Bye!", ways)
        self.assertNotIn("Nothing wrong with that", ways)
        self.assertTrue(q["start"].get("ways"))


class PlayersWordsTest(unittest.TestCase):
    """WO-126: quest starts in players' words."""

    STEPS = [{"id": "Skyrim.esm:1", "edid": "MQ102", "name": "Before the Storm", "objectives": [{"index": 10, "text": "Talk to Gerdur"}, {"index": 30, "text": "Talk to the Jarl of Whiterun"}],
              "stages": [{"index": 10, "entries": [{"text": "Gerdur."}]}, {"index": 160, "entries": [{"text": "", "completes": True}]}]}]

    def setUp(self):
        self.say = qp.Words(self.STEPS)

    def said(self, conditions, own="Own Quest"):
        return qp.plain_needs(conditions, own, self.say)

    def test_items_skills_and_level(self):
        self.assertEqual(self.said("GetItemCount Dragonstone >= 1"), ["You have Dragonstone"])
        self.assertEqual(self.said("GetItemCount Heart of Disorder == 0"), ["You don't have Heart of Disorder"])
        self.assertEqual(self.said("GetItemCount Void Salts >= 3"), ["You have 3 Void Salts"])
        self.assertEqual(self.said("the player has at least RoomCost (25) gold"), ["You have 25 gold"])
        self.assertEqual(self.said("GetActorValue >= SpeechVeryEasy (now 10)"), ["Speech 10"])
        self.assertEqual(self.said("level >= DLC1VQMinLevel (now 30)"), ["Level 30"])
        # A skill the check didn't name stays out of the words, and says so.
        self.assertEqual(self.said("GetActorValue >= 25"), [qp.UNSAID])

    def test_factions_people_race_and_random(self):
        self.assertEqual(self.said("GetInFaction College of Winterhold == 1"), ["You're in the College of Winterhold"])
        self.assertEqual(self.said("GetInFaction The Companions == 0"), ["You're not in The Companions"])
        # A faction with no name a player sees is left out.
        self.assertEqual(self.said("GetInFaction JobInnkeeperFaction == 1; GetInFaction Guard Faction (for dialogue) == 1"), [])
        self.assertEqual(self.said("GetDead == 0"), [])  # the speaker: a dead person doesn't talk
        self.assertEqual(self.said("GetInFaction Blood-Kin of the Orcs == 1 or GetIsRace Skyrim.esm:013747 == 1"), ["You're in the Blood-Kin of the Orcs or an Orc"])
        self.assertEqual(self.said("GetIsRace Skyrim.esm:013742 == 1 or GetIsRace Skyrim.esm:08883D == 1"), ["You're a Dark Elf"])
        self.assertEqual(self.said("GetIsRace Skyrim.esm:013743 == 0"), ["You're not a High Elf"])
        self.assertEqual(self.said("GetRandomPercent < DLC1WE01Chance (now 25)"), ["Sometimes"])
        self.assertEqual(self.said("fn18 > 22 or fn18 < 5.5"), ["At night"])

    def test_quest_stages(self):
        self.assertEqual(self.said("Before the Storm stage 160 done"), ["After Before the Storm"])
        self.assertEqual(self.said("Before the Storm stage >= 50"), ['After "Talk to the Jarl of Whiterun" in Before the Storm'])
        self.assertEqual(self.said("Before the Storm stage < 10"), ["Before Before the Storm starts"])
        self.assertEqual(self.said("Laid to Rest completed; Hostile Takeover not completed"), ["After Laid to Rest", "Before you finish Hostile Takeover"])
        self.assertEqual(self.said("GetQuestRunning Briarheart Necropsy == 1"), ["While Briarheart Necropsy is under way"])
        # Its own stage only guards a repeat; a helper's editor id is never said.
        self.assertEqual(self.said("Skirmish at Whitewatch stage == 10", "Skirmish at Whitewatch"), [])
        self.assertEqual(self.said("MSNStart stage < 10"), [qp.UNSAID])

    def test_events_the_moment_and_anything_else(self):
        self.assertEqual(self.said("the place you enter is Windhelm; the place you leave isn't a dwelling; GetEventData CWSiegeStart == 1"), ["When you enter Windhelm"])
        # Where the speaker stands as the line plays is left out; a function it can't word is flagged, never shown.
        self.assertEqual(self.said("fn359 == 1; fn249 == 1"), [])
        self.assertEqual(self.said("Level 10 thing; fn264 == 1"), [qp.UNSAID])
        self.assertEqual(qp.tidy(["Level 10", qp.UNSAID]), ["Level 10", f"and {qp.UNSAID}"])
        node = {"by": "story manager", "event": "change location", "conditions": "the place you enter is Whiterun or the place you enter is Riften; level >= 20"}
        self.assertEqual(qp.way_words(node, "X", {}, self.say), [("It starts by itself when you enter Whiterun or Riften", ["Level 20"])])
        self.assertEqual(self.say.event("It starts by itself on change location."), "It starts by itself as you travel")

    def test_no_editor_id_and_no_declining_line(self):
        decline = {"by": "dialogue", "speaker": "Altano", "prompt": "No, thanks. I'm not interested."}
        self.assertEqual(qp.way_words(decline, "Vigilant of Stendarr", {}, self.say), [])
        # A helper is what starts it, else nothing: never "Through APS_MQSkipKeep".
        bare = {"by": "quest script", "quest": "APS_MQSkipKeep, a helper quest", "throughStartedBy": []}
        self.assertEqual(qp.way_words(bare, "Unbound", {}, self.say), [])
        up = {"by": "quest script", "quest": "AP_DialogueHelgen, a helper quest", "throughStartedBy": [{"by": "story manager", "event": "change location", "conditions": "the place you enter is Helgen"}]}
        self.assertEqual(qp.way_words(up, "Unbound", {}, self.say), [("It starts by itself when you enter Helgen", [])])
        ralforn = {"by": "quest script", "quest": "aaaMBRalfornDialogue, a helper quest with RalfornAlias"}
        self.assertEqual(qp.way_words(ralforn, "S", {}, self.say, {"name": "Ralforn", "place": "Green-Tip Cabin"}), [("Talk to Ralforn in Green-Tip Cabin", [])])
        named = {"by": "quest script", "quest": 'DA08 (named "The Whispering Door" in its record), a helper quest', "throughStartedBy": [{"by": "start game"}]}
        self.assertEqual(qp.way_words(named, "X", {}, self.say), [("Through The Whispering Door", [])])
        # Nothing it can say: one way that says so.
        start = qp.start_of({"name": "X", "startedBy": [bare], "target": [], "needs": {}}, {}, say=self.say)
        self.assertEqual(start["ways"], [{"how": "Another quest starts it, one the planner can't name yet"}])


class BuiltStartsTest(unittest.TestCase):
    """WO-126 on the built quests.json: the five quests Bob read, Vigilant, raw, and no leak in any start."""

    @classmethod
    def setUpClass(cls):
        with open(QUESTS, encoding="utf-8") as f:
            cls.quests = [q for line in json.load(f)["lines"] for q in line["quests"]]
        cls.by = {q["name"]: q for q in cls.quests}

    def ways(self, name):
        return [(w["how"], w.get("needs", [])) for w in self.by[name]["start"].get("ways", [])]

    def test_missives_never_name_their_destination_in_the_quest(self):
        # WO-129 Part 4: a courier missive's note names its town at run time; the quest's name and objective never do.
        with open(QUESTS, encoding="utf-8") as f:
            lines = {l["id"]: l for l in json.load(f)["lines"]}
        self.assertIs(lines["missives"]["destinationInName"], False)
        towns = ("Whiterun", "Solitude", "Windhelm", "Riften", "Markarth", "Falkreath", "Morthal", "Dawnstar", "Winterhold")
        self.assertEqual([q["name"] for q in lines["missives"]["quests"] if any(t in q["name"] for t in towns)], [])
        self.assertNotIn("destinationInName", lines["main-quest"])

    def test_wo136_ruling_1_and_the_boards(self):
        # A later quest's call is the start when nothing else starts it: Bloodline's stages 30 and 190 set A New Order's 20.
        order = self.by["A New Order"]["start"]
        self.assertEqual((order["checked"], order["then"]), ("files", "Speak with Isran"))
        self.assertIn("Bloodline", json.dumps(order["ways"]))
        # A Vigilant bounty starts from its activator by the Temple of Stendarr; a Missives job is its class's one sentence.
        self.assertEqual(self.ways("Bounty: Book"), [("It starts from Erotic Book somewhere in Stuhn Ravine, by the door to Storage Room", [])])
        job = self.by["Deliver a Letter Near"]["start"]
        self.assertTrue(job["board"] and job["checked"] == "files" and job["ways"][0]["how"].startswith("Missives:"))

    def test_bleak_falls_barrow(self):
        self.assertIn(('Ask Farengar Secret-Fire "So what do you need me to do?" in Dragonsreach', ["You have Dragonstone"]), self.ways("Bleak Falls Barrow"))
        # The night run gave every row objectivesShown, so the stage is named by the objective it shows (WO-121b).
        self.assertIn(("After \"Talk to the Jarl of Whiterun\" in Before the Storm", []), self.ways("Bleak Falls Barrow"))

    def test_unbound(self):
        ways = self.ways("Unbound")
        self.assertEqual([w for w, _ in ways], ['Ask Matlara "I\'d like to rent a room. (Start Intro (25 gold))" in Helgen', 'Ask Shazdehviir "Skip to Helgen Keep" in Helgen'])
        self.assertEqual(ways[0][1], ["You have 25 gold"])

    def test_skirmish_lunatic_and_knight(self):
        self.assertEqual(self.ways("Skirmish at Whitewatch"), [("Talk to a courier in Whiterun Messenger Tower, Guard Tower", [])])
        lunatic = self.ways("The Lunatic's Treasure")
        self.assertIn(('Ask Sees-the-Moon "I\'ve already been to the ruin." in Sees-the-Moon\'s Shack', ["You have Heart of Disorder", "You have Cast Iron Pot"]), lunatic)
        self.assertNotIn("I can't do that right now", json.dumps(lunatic))
        # Its helper's record name is "VS Varla", an editor's label, so it isn't said.
        self.assertEqual(self.ways("Knight of Hounds"), [("Once Memory Guide has started", [])])

    def test_vigilant_of_stendarr(self):
        self.assertEqual(self.ways("Vigilant of Stendarr"), [("Altano and Orlando, in Dawnstar", ["Level 25", "After The House of Horrors", "After Kindred Judgment"])])

    def test_raw_keeps_the_record_form_beside_the_words(self):
        start = self.by["Bleak Falls Barrow"]["start"]
        self.assertIn({"how": 'Ask Farengar Secret-Fire "So what do you need me to do?" in Dragonsreach', "needs": ["GetItemCount Dragonstone >= 1"]}, start["raw"]["ways"])

    def test_no_start_shows_a_raw_condition_an_editor_id_or_a_declining_line(self):
        # 1,243 less Trius' Trinket (WO-121b, Bob 22 Oct), the 9 handlers (G5) and the Civil War's 7 radiant templates (a class), WO-138.
        self.assertEqual(len(self.quests), 1226)
        leaks = [(q["name"], t) for q in self.quests for t in start_texts(q["start"]) if LEAK.search(t)]
        self.assertEqual(leaks, [])
        # A prompt is the game's words, never a topic's editor id (WO-130: "DB02AstridWalkAwayTopic").
        ids = [(q["name"], w["how"]) for q in self.quests for w in q["start"].get("ways", []) if qp._EDID.match((re.search(r'"(.*)"', w["how"]) or [None, ""])[1])]
        self.assertEqual(ids, [])
        declines = [(q["name"], w["how"]) for q in self.quests for w in q["start"].get("ways", []) if qp._DECLINES.search((re.search(r'"(.*)"', w["how"]) or [None, ""])[1])]
        self.assertEqual(declines, [])


# An editor id or form id a page could show (WO-121b, Bob's judgement of the night run): "ccBGSSSE002_NoteFromCalcelmo".
RECORD_ID = re.compile(r"[A-Za-z]+_[A-Za-z]|^cc|esp:|esm:|esl:")


def page_texts(o, key=None):
    """Every text a quest page or the door shows a player: everything but the ids, raw and a journal entry's record condition (its ending says when)."""
    if isinstance(o, dict):
        return [t for k, v in o.items() if k not in ("id", "edid", "opening", "alsoOpening", "after", "raw", "url") and not (k == "when" and "stage" not in o)
                for t in page_texts(v, k)]
    if isinstance(o, list):
        return [t for v in o for t in page_texts(v, key)]
    return [o] if isinstance(o, str) else []


class NightRunTest(unittest.TestCase):
    """Bob's judgement of the PC's night run (WO-121b, 22 Oct): seven things."""

    @classmethod
    def setUpClass(cls):
        with open(QUESTS, encoding="utf-8") as f:
            cls.lines = json.load(f)["lines"]
        cls.by = {q["edid"]: q for line in cls.lines for q in line["quests"]}

    def test_the_blessings_of_nature_takes_bobs_first_step(self):
        start = self.by["T03"]["start"]
        self.assertEqual((start["who"], start["then"]), ("Danica Pure-Spring", "Retrieve Nettlebane"))
        self.assertNotIn("thenWho", start)
        # Innocence Lost has the same shape and keeps its own row's step.
        self.assertEqual(self.by["DB01"]["start"]["then"], "Talk to Aventus Aretino")

    def test_no_page_shows_an_editor_id(self):
        leaks = [(line["id"], t) for line in self.lines for t in page_texts(line) if RECORD_ID.search(t)]
        self.assertEqual(leaks, [])
        self.assertEqual(self.by["ccBGSSSE002_SoulStealerQuest"]["start"]["ways"], [{"how": "Get a note from Calcelmo", "unplaced": "Where to find it isn't checked yet."}])
        self.assertEqual(self.by["MyrwatchTNE_Quest"]["name"], "Myrwatch")

    def test_an_ending_says_no_record_condition(self):
        self.assertEqual(qp.ending_when(90, "global TTFA_FastredRomance is 1"), "the quest reaches stage 90")
        self.assertEqual(qp.ending_when(215, "fn629 >= 1"), "the quest reaches stage 215")
        self.assertEqual(qp.ending_when(100, "Lucan is alive"), "the quest reaches stage 100, if lucan is alive")

    def test_a_condition_says_the_same_thing_once(self):
        self.assertEqual(qp.once("GetIsRace Dark Elf == 1 or GetIsRace Dark Elf == 1"), "GetIsRace Dark Elf == 1")
        self.assertEqual(qp.plain_needs("GetInFaction Blood-Kin of the Orcs == 1 or GetIsRace Orc == 1 or GetIsRace Orc == 1", "X"),
                         ["GetInFaction Blood-Kin of the Orcs == 1 or GetIsRace Orc == 1"])
        golldir = self.by["dunHillgrundsTombQST"]["start"]
        self.assertEqual(golldir["ways"][0]["needs"], ["You're a Dark Elf"])
        self.assertEqual(golldir["raw"]["ways"][0]["needs"], ["GetIsRace Dark Elf == 1"])
        twice = re.compile(r"(GetIsRace [\w ]+? [!=]= \d) (?:or|and) \1\b|\b(an? [A-Z][\w-]*(?: [A-Z][\w-]*)*) or \2\b")
        self.assertEqual([t for q in self.by.values() for t in json.dumps(q["start"]).split('"') if twice.search(t)], [])

    def test_dragonborns_init_quest_is_no_way_in(self):
        init = {"by": "quest script", "quest": 'DLC2Init (named "Init quest" in its record), a helper quest', "call": "Start", "throughStartedBy": [{"by": "start game"}]}
        self.assertTrue(qp.patch_helper(init))
        for edid in ("DLC2MH01", "DLC2TT1", "DLC2dunHaknirTreasureQST"):
            self.assertNotIn("Init quest", json.dumps(start_texts(self.by[edid]["start"])), edid)
        self.assertEqual(self.by["DLC2MH01"]["start"]["who"], "Bujold the Intrepid")
        self.assertEqual([w.get("who") for w in self.by["DLC2TT1"]["start"]["ways"]], ["Neloth", "Varona Nelas"])

    def test_no_page_doubles_a_place(self):
        self.assertEqual(qp.clean_place("Temple, Temple Location"), "Temple")
        places = [p for line in self.lines for q in line["quests"] for p in [q["start"].get("where"), q["start"].get("thenWhere"),
                  *(w.get("where") for w in q["start"].get("ways", []))] if p]
        self.assertEqual([p for p in places if qp.clean_place(p) != p], [])
        self.assertEqual(self.by["DA06"]["start"]["where"], "Largashbur Longhouse")

    def test_the_cursed_tribe_keeps_yamarz(self):
        # Larak's letter is a way only for an Orc or Blood-Kin (rule 5), so it doesn't set everyone's first step.
        start = self.by["DA06"]["start"]
        self.assertEqual((start["who"], start["then"]), ("Atub", "Speak with Yamarz"))
        larak = start["ways"][0]
        self.assertEqual(larak["needs"], ["You're in the Blood-Kin of the Orcs or an Orc"])
        self.assertNotIn("who", larak)


class ReadablesTest(unittest.TestCase):
    """WO-131 Part 2: where each read-this item is, in the game's words, from the PC's readables file."""

    def test_place_words(self):
        placed = {"kind": "placed", "where": "Whiterun", "nearDoors": [{"door": "Hearth-Healer's Hall", "metres": 22}, {"door": "Joslin's House", "metres": 22}, {"door": "The Bannered Mare", "metres": 27}]}
        self.assertEqual(qp.place_words(placed), "Whiterun, near Hearth-Healer's Hall and Joslin's House")
        self.assertEqual(qp.place_words({"kind": "placed", "where": "somewhere in Skyrim", "nearDoors": []}), None)
        self.assertEqual(qp.place_words({"kind": "placed", "where": "Myrwatch", "nearDoors": [{"door": "somewhere in Skyrim", "metres": 3}]}), "Myrwatch")
        self.assertEqual(qp.place_words({"kind": "container", "holder": "Chest", "where": ["somewhere in Whiterun"]}), "In a chest somewhere in Whiterun")
        self.assertEqual(qp.place_words({"kind": "container", "holder": "All Dragonborn Books", "where": ["Editor Smoke Test Cell"]}), None)
        self.assertEqual(qp.place_words({"kind": "carried", "holder": "Bradyn", "where": ["Kolbjorn Barrow"]}), "Carried by Bradyn, in Kolbjorn Barrow")
        self.assertEqual(qp.place_words({"kind": "levelled", "list": "DLC2LItemBook4Combined", "where": None}), "It can turn up as random loot")
        self.assertEqual(qp.place_words({"kind": "delivered", "quest": "THOD_QE"}, "The Heart of Dibella"), "It's handed to you")
        self.assertEqual(qp.place_words({"kind": "delivered", "quest": "Ode To The Tundrastriders"}, "Ode To The Tundrastriders"), "It's handed to you")
        self.assertEqual(qp.place_words({"kind": "nowhere", "searched": "..."}), None)

    def test_a_way_gets_its_places_or_says_it_isnt_checked(self):
        start = {"ways": [{"how": "Read A Note"}, {"how": "Read Lost Page"}, {"how": "Talk to Vex"}]}
        out = qp.placed_ways(start, "Q", {("Q", "A Note"): ["Riften"], ("Q", "Lost Page"): []})
        self.assertEqual(out["ways"], [{"how": "Read A Note", "whereIs": ["Riften"], "whereIsArea": ["Riften"]}, {"how": "Read Lost Page", "unplaced": "Where to find Lost Page isn't checked yet."}, {"how": "Talk to Vex"}])


class LoopRulingsTest(unittest.TestCase):
    """WO-136: a key row counts as checked (ruling 2), and a counter the game sets at run time isn't shown (ruling 6)."""

    def test_a_key_row_makes_an_unchecked_start_checked_from_the_wiki(self):
        row = {"editorId": "X", "noGiver": True, "startsWith": [], "firstObjective": "Explore it", "url": "https://en.uesp.net/wiki/Skyrim:X"}
        self.assertEqual(qp.from_key({"needs": [], "checked": "not yet"}, row),
                         {"needs": [], "checked": "uesp", "source": "UESP", "url": row["url"], "then": "Explore it", "ways": [{"how": "No one gives it"}]})
        mod = {"editorId": "Y", "startsWith": ["Ralforn"], "firstObjective": "Escape", "url": "https://www.nexusmods.com/skyrimspecialedition/mods/1"}
        self.assertEqual(qp.from_key({"checked": "not yet"}, mod)["source"], "Nexus")
        self.assertEqual(qp.from_key({"checked": "not yet"}, mod)["who"], "Ralforn")
        traced = {"checked": "files", "then": "Mine"}
        self.assertIs(qp.from_key(traced, row), traced)

    def test_a_run_time_counter_is_left_out(self):
        self.assertEqual(qp.fill_text("Gather <Alias=Item> (<Global=CountX>/<Global=TotalX>)", {}, {"countx": 0, "totalx": 0}), "Gather the item")
        self.assertEqual(qp.fill_text("Distribute it (<Global=Done>/<Global=Need>)", {}, {"done": 0, "need": 20}), "Distribute it (0/20)")


class BoardWayTest(unittest.TestCase):
    """WO-136: a board's start is the check's own words."""

    def test_a_board_is_a_way_in(self):
        board = {"by": "board", "plain": "It starts from something placed in Windhelm.", "call": "Start"}
        start = qp.start_of({"name": "Deliver a Letter Near", "startedBy": [board], "firstObjectiveStage": 20, "target": [], "needs": {}}, {})
        self.assertEqual(start["ways"][0]["how"], "It starts from something placed in Windhelm.")
        self.assertEqual(start["checked"], "files")

class PlacesByAreaTest(unittest.TestCase):
    """WO-137 item 2: every place kept, grouped by area, in the order the areas first come."""

    def test_grouped(self):
        found = ["Tel Mithryn Steward's House, Tel Mithryn Steward", "Bloodskal Barrow", "Tel Mithryn, Tel Mithryn Tower", "Carried by Adventurer, in Gyldenhul Barrow", "It can turn up as random loot"]
        where, area = qp.by_area(found, {"Tel Mithryn Steward's House": "Tel Mithryn"})
        self.assertEqual(where, ["Tel Mithryn Steward's House, Tel Mithryn Steward", "Tel Mithryn, Tel Mithryn Tower", "Bloodskal Barrow", "Carried by Adventurer, in Gyldenhul Barrow", "It can turn up as random loot"])
        self.assertEqual(area, ["Tel Mithryn", "Tel Mithryn", "Bloodskal Barrow", "Gyldenhul Barrow", "Anywhere"])


class CatchUpTest(unittest.TestCase):
    """WO-137 item 1: a talk that needs a later stage of its own quest than the one it sets is a catch-up, not a way in."""

    def test_geldis_is_a_catch_up(self):
        geldis = {"by": "dialogue", "call": "SetStage 1", "conditions": "the speaker is Geldis Sadri; Deathbrand stage 20 done; Deathbrand stage <= 1"}
        self.assertTrue(qp.continues(geldis, "Deathbrand", "DLC2dunHaknirTreasureQST", 29))
        self.assertTrue(qp.continues(geldis, "Deathbrand", "DLC2dunHaknirTreasureQST", None))
        falk = {"by": "dialogue", "call": "SetStage 50", "conditions": "The Wolf Queen Awakened stage 10 done"}
        self.assertFalse(qp.continues(falk, "The Wolf Queen Awakened", "x", 50))

    def test_a_helpers_trigger_keeps_its_level(self):
        helper = {"by": "quest script", "throughStartedBy": [{"by": "story manager", "event": "level up", "conditions": "level >= DLC2dunHaknirTreasureQSTMinLevel (now 20)"}]}
        self.assertEqual(qp.node_needs(helper, "Deathbrand"), ["Level 20"])


class WayNeedsTest(unittest.TestCase):
    """WO-137 after the PC's check: hand-kept wording can add a need the records leave off a way, in its one-line needs too."""

    def test_a_way_gets_its_need(self):
        start = {"needs": ["One of: Read Deathbrand; or It starts by itself when you level up (Level 20)"],
                 "ways": [{"how": "Read Deathbrand"}, {"how": "It starts by itself when you level up", "needs": ["Level 20"]}]}
        out = qp.reword(start, {"It starts by itself when you level up": "Find the pirates"}, {"Read Deathbrand": ["Level 20"]})
        self.assertEqual(out["ways"], [{"how": "Read Deathbrand", "needs": ["Level 20"]}, {"how": "Find the pirates", "needs": ["Level 20"]}])
        self.assertEqual(out["needs"], ["One of: Read Deathbrand (Level 20); or Find the pirates (Level 20)"])


class RunChangesTest(unittest.TestCase):
    """WO-129 Part 6: what an ending hands over that changes a run, and when one ending of several gives it."""

    def test_an_ending_that_gives_a_house_or_a_follower(self):
        ends = [{"stage": 30, "text": "I've bought the deed to Graystone Lodge in Windhelm's gray quarter. I am now it's owner.", "completes": True}]
        self.assertEqual(qp.changes_of(ends), [{"kind": "house", "stage": 30, "text": ends[0]["text"]}])
        two = [{"stage": 200, "text": "I've made my decision, and allowed Erandur to live. Erandur has offered his services as a companion if I need one.", "completes": True},
               {"stage": 210, "text": "I killed Erandur.", "completes": True}]
        self.assertEqual(qp.changes_of(two), [{"kind": "follower", "stage": 200, "text": two[0]["text"], "only": True}])

    def test_a_debt_or_a_failure_is_nothing(self):
        self.assertEqual(qp.changes_of([{"stage": 50, "text": "The horse has died. That's the end of that.", "fails": True}]), [])

    def test_a_hand_checked_row_replaces_the_reading(self):
        row = [{"_source": "x", "kind": "mount", "stage": 40, "text": "Saddle.", "only": True, "from": 30, "fromText": "Keep the horse."}]
        self.assertEqual(qp.changes_of([], row), [{"kind": "mount", "stage": 40, "text": "Saddle.", "only": True, "from": 30, "fromText": "Keep the horse."}])
        self.assertEqual(qp.changes_of([{"stage": 300, "text": "He owed 1000 septims.", "completes": True}], []), [])


if __name__ == "__main__":
    unittest.main()
