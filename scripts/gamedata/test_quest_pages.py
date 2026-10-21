"""quest_pages.py: the Quests pages' data rules (WO-100)."""
import json
import os
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


if __name__ == "__main__":
    unittest.main()
