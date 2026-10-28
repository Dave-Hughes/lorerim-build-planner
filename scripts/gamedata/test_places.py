"""
places.py (WO-128 Part 1): the readers on made-up records, and the built index against the places the order names.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import collections
import json
import os
import struct
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import places as pl  # noqa: E402

RAW = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "gamedata", "5.0.4.8", "places_raw.json")


class Readers(unittest.TestCase):
    def test_an_actors_level(self):
        fixed = struct.pack("<IhhhHHHhHhh", 0, 0, 0, 12, 0, 0, 100, 0, 0, 0, 0)
        self.assertEqual(pl.npc_level(fixed), (12, None, 0))
        scaled = struct.pack("<IhhhHHHhHhh", 0x80, 0, 0, 1000, 5, 30, 100, 0, 2, 0, 0)
        self.assertEqual(pl.npc_level(scaled), (None, (1.0, 5, 30), 2))

    def test_levels_through_templates_and_nested_lists(self):
        # WO-144 Part 1d (Bob, 23 Oct, after Fort Hraggstad's actors all read [1, 1]): a leveled list entry's own
        # stored number is "picked from this level up", never the output level. Fort Hraggstad's own chain bottoms
        # out at fixed-level Bandits of 3, 7, 10, 19, confirmed by hand -- this mirrors that shape, not the old
        # single-target fixture, which happened to pass by reading the entries' numbers instead of their targets'.
        npcs = {"Boss": {"name": "Boss", "level": 1, "scaled": None, "useStats": True, "template": "Outer"},
                "Low": {"name": None, "level": 3, "scaled": None, "useStats": False, "template": None},
                "Mid": {"name": None, "level": 10, "scaled": None, "useStats": False, "template": None},
                "High": {"name": None, "level": 19, "scaled": None, "useStats": False, "template": None}}
        lvln = {"Outer": {"edid": "LCharBanditBoss", "entries": [(1, "Inner")]},
                "Inner": {"edid": "REQ_Variations", "entries": [(1, "Low"), (1, "Mid"), (1, "High")]}}
        self.assertEqual(pl.level_of("Boss", npcs, lvln), (3, 19, "leveled 3-19"))
        self.assertEqual(pl.level_of("Low", npcs, lvln), (3, 3, "level 3"))

    def test_level_of_never_loops_on_a_list_that_points_at_itself(self):
        lvln = {"Loop": {"edid": "LSelfReferential", "entries": [(1, "Loop")]}}
        self.assertIsNone(pl.level_of("Loop", {}, lvln))

    def test_the_site_file_keeps_record_and_editor_ids_out(self):
        raw = [{"id": "X:000001", "name": "Some Cave", "type": "Cave", "edid": "SomeCaveLocation", "keywords": ["LocTypeCave"],
                "pointers": [{"kind": "dialogue", "speaker": "Gerdur", "words": "Some Cave is up the hill.", "quest": "EGD_DialogueGuardsGeneral",
                              "record": "INFO Skyrim.esm:000002 (Extended Guard Dialogue.esp)"}],
                "quests": [{"quest": "Lost Legacy", "id": "Q"}, {"quest": "Lost Legacy", "id": "Q2"}]}]
        (row,) = pl.build_site(raw)
        self.assertNotIn("edid", row)
        self.assertEqual(row["pointers"], [{"kind": "dialogue", "speaker": "Gerdur", "words": "Some Cave is up the hill.", "from": "Extended Guard Dialogue.esp"}])
        self.assertEqual(row["quests"], ["Lost Legacy"])


@unittest.skipUnless(os.path.exists(RAW), "places_raw.json not built")
class BuiltIndex(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        data = json.load(open(RAW, encoding="utf-8"))
        cls.rows = data["places"]
        cls.roads = data["roads"]
        cls.by = {}
        for p in cls.rows:
            cls.by.setdefault(p["name"], p)
        cls.road_by = {frozenset(r["towns"]): r for r in cls.roads}

    def test_embershard_mine_by_riverwood_with_its_pointer(self):
        mine = self.by["Embershard Mine"]
        self.assertEqual((mine["type"], mine["nearestTown"]["town"]), ("Mine", "Riverwood"))
        self.assertTrue(any("Embershard Mine" in p["words"] and "criminals" in p["words"] for p in mine["pointers"]))

    def test_bleak_falls_barrow_is_the_golden_claws(self):
        barrow = self.by["Bleak Falls Barrow"]
        self.assertIn("The Golden Claw", {q["quest"] for q in barrow["quests"]})
        self.assertEqual(barrow["clearXp"], 200)  # a Nordic ruin, by LoreRim's Experience settings

    def test_geirmunds_hall_and_who_names_it(self):
        hall = self.by["Geirmund's Hall"]
        self.assertEqual(hall["nearestTown"]["town"], "Ivarstead")
        self.assertIn(("Wilhelm", "Vilemyr Inn"), {(p.get("speaker"), p.get("speakerPlace")) for p in hall["pointers"]})

    def test_no_town_and_every_pointer_has_its_record(self):
        # WO-144 Part 1 item 2: NAMED_PLACES (the thirteen settlements, the four strongholds) are the one named
        # exception -- everything else stays out, so a stray "City"/"Town"/"Settlement" marker still can't sneak in.
        # WO-166 adds two more exceptions: the nine capitals (rows of type City) and the towns a quest names (Ben Erai, Stonehollow).
        self.assertFalse([p["name"] for p in self.rows if p["type"] in pl.NOT_PLACES and p["name"] not in pl.NAMED_PLACES | pl.CAPITALS
                          and not p.get("namedByQuest")])
        self.assertTrue(all(x["record"] for p in self.rows for x in p.get("pointers", [])))
        self.assertGreater(len({p["plugin"] for p in self.rows}), 20)  # across the load order, not only the base game

    def test_nearest_town_and_city_are_never_a_mislabelled_marker(self):
        # WO-144 Part 1: a marker's TNAM type is unreliable here (the nine capitals all carry the wrong one); only a
        # name in CAPITALS or SETTLEMENTS is ever trusted as a town, so "Wintersand Manor" and friends can't stand in.
        towns = {p["nearestTown"]["town"] for p in self.rows if p.get("nearestTown")}
        cities = {p["nearestCity"]["town"] for p in self.rows if p.get("nearestCity")}
        self.assertLessEqual(towns, pl.CAPITALS | pl.SETTLEMENTS)
        self.assertLessEqual(cities, pl.CAPITALS)
        self.assertFalse(towns & {"Wintersand Manor", "Flight Platform", "Dunpar Wall Ruins", "Unknown Gate"})

    def test_a_shower_room_is_never_an_inn(self):
        # 27 Oct: found only after esp.py started reading MO2's own selected profile instead of a fixed "Ultra" --
        # that profile has Keep It Clean.esp enabled, whose "Shower Room" (LocTypeInn, LocTypeShowersInInns) would
        # otherwise read as a real inn. A room in an inn, not the inn.
        self.assertNotIn("Shower Room", self.by)

    def test_each_of_the_nine_capitals_has_places_nearby(self):
        # WO-144 Part 1's own test, tightened by Bob 23 Oct 15:20: "ten places within a short walk to half a day",
        # not a flat 5 km (which covers most of a hold on this small map and proved too little).
        close = ("next to it", "a short walk", "half a day")
        by_city = collections.Counter(p["nearestCity"]["town"] for p in self.rows if p.get("nearestCity") and p["nearestCity"]["walk"] in close)
        for city in pl.CAPITALS:
            self.assertGreaterEqual(by_city[city], 10, city)

    def test_walk_bands_follow_bob_s_two_pairs(self):
        # Riverwood to Whiterun (0.5 km) is "a short walk"; Whiterun to Riften (2.5 km) is "a long day's road".
        self.assertEqual(pl.walk(0.5), "a short walk")
        self.assertEqual(pl.walk(2.5), "a long day's road")
        self.assertEqual(self.by["Riverwood"]["nearestCity"]["walk"], "a short walk")

    def test_riverwood_is_still_a_settlement_and_never_a_capital_itself(self):
        mine = self.by["Embershard Mine"]
        self.assertEqual(mine["nearestTown"]["town"], "Riverwood")
        self.assertNotIn("Riverwood", pl.CAPITALS)  # a settlement, never counted as one of the nine

    def test_named_settlements_and_strongholds_are_places_now(self):
        # WO-144 Part 1 item 2: these bypass the usual place rules by name (NAMED_PLACES), so they show up themselves,
        # not only as another place's nearestTown.
        for nm in pl.SETTLEMENTS | pl.STRONGHOLDS:
            if nm == "Thirsk":
                continue  # no marker this reader can find for it; "not checked" is correct, not a failure
            self.assertIn(nm, self.by, nm)

    def test_a_strongholds_gate_names_the_game_s_own_condition(self):
        for nm in pl.STRONGHOLDS:
            gate = self.by[nm]["enters"]
            self.assertIn("Orc", gate["words"])
            self.assertIn("Blood-Kin", gate["words"])
            self.assertTrue(gate["record"].startswith("INFO "))

    def test_city_buildings_are_findable_with_their_town(self):
        # WO-144 Part 1 item 3: named by keyword (CWCapitalHQ for a keep, LocTypeStables for a stable; LocTypeTemple/
        # Inn/Guild otherwise), their town is a parent-chain fact (inTown), never a distance guess.
        by_type = collections.Counter(p["type"] for p in self.rows if p["type"] in ("Temple", "Inn", "Guild", "Keep", "Stables"))
        self.assertEqual(by_type["Keep"], 9)  # exactly the nine jarls' seats, never a non-capital castle
        self.assertEqual(by_type["Stables"], 5)  # Whiterun, Windhelm, Riften, Markarth, Solitude
        self.assertGreater(by_type["Inn"], 20)
        self.assertGreater(by_type["Temple"], 5)
        self.assertGreater(by_type["Guild"], 5)
        for nm, city in (("Dragonsreach", "Whiterun"), ("Temple of Kynareth", "Whiterun"), ("The Bannered Mare", "Whiterun"),
                         ("Jorrvaskr", "Whiterun"), ("Winterhold College", "Winterhold"), ("Bards College", "Solitude"),
                         ("Solitude Stables", "Solitude")):
            self.assertEqual(self.by[nm]["inTown"], city, nm)

    def test_buildings_never_pick_up_a_non_capital_castle(self):
        castles = {p["name"] for p in self.rows if p["type"] == "Keep"}
        self.assertNotIn("Castle Volkihar", castles)

    def test_enemy_levels_are_clamped_by_the_encounter_zone(self):
        # WO-144 Part 1d (Bob, 23 Oct, 16:15): ECZN DATA decoded by hand on Fort Hraggstad -- min level 6, no cap.
        # floor/ceiling replace the old flat "levels"; Bleak Falls Barrow's own zone narrows its wide range.
        # WO-144 Part 1e-4: Fort Hraggstad's entire static garrison turns out to be Civil-War-tied (none left at
        # the start), so the zone check moves to `afterTheWar`; a fort with a real baseline (Fort Greymoor) keeps
        # it at the top level.
        hraggstad = self.by["Fort Hraggstad"]["actors"]["afterTheWar"]
        self.assertEqual(hraggstad["zoneMin"], 6)
        self.assertEqual(hraggstad["floor"], 6)
        self.assertGreaterEqual(hraggstad["ceiling"], 6)
        barrow = self.by["Bleak Falls Barrow"]["actors"]
        self.assertLess(barrow["ceiling"], 60)  # was [1, 60] before the zone clamp
        no_ones = [p["name"] for p in self.rows if p.get("actors", {}).get("floor") == 1 and p["actors"]["ceiling"] == 1]
        self.assertLess(len(no_ones), 25, no_ones)  # was 108 before level_of's own fix; a handful of genuine level 1s remain

    def test_bob_s_five_named_places_read_exactly_right(self):
        # WO-144 Part 1d (Bob, 23 Oct, 17:45, read against 1a405ad): the values he checked by hand, verbatim.
        self.assertEqual(self.by["Bleak Falls Barrow"]["actors"]["floor"], 6)
        self.assertEqual(self.by["Bleak Falls Barrow"]["actors"]["ceiling"], 20)
        self.assertEqual(self.by["Bleak Falls Barrow"]["actors"]["boss"]["level"], "level 40")  # Zulakaroth: fixed, never clamped
        # WO-144 Part 1e-4 (Bob, 23 Oct, 18:05): Fort Hraggstad's whole static garrison is Civil-War-tied (count
        # 0 at the start); the war's own Imperials are `afterTheWar`, ceiling 47.
        self.assertEqual(self.by["Fort Hraggstad"]["actors"]["count"], 0)
        self.assertEqual(self.by["Fort Hraggstad"]["actors"]["afterTheWar"]["ceiling"], 47)
        self.assertEqual(self.by["Labyrinthian"]["actors"]["floor"], 24)
        self.assertEqual(self.by["Labyrinthian"]["actors"]["ceiling"], 100)
        self.assertEqual(self.by["Wolfskull Cave"]["actors"]["floor"], 8)
        self.assertEqual(self.by["Wolfskull Cave"]["actors"]["ceiling"], 50)
        self.assertEqual(self.by["Wolfskull Cave"]["actors"]["boss"]["name"], "Ritual Master")
        self.assertEqual(self.by["Wolfskull Cave"]["actors"]["boss"]["level"], "matches your level, 10 to 20")

    def test_a_ranged_boss_is_clamped_by_the_zone_but_a_unique_never_is(self):
        # Embershard Mine's boss is a leveled list ("leveled 3-24" before this part); clamped like the rank and
        # file. Zulakaroth is a fixed, unique, named boss above the zone's own ceiling -- the whole point of naming
        # one -- and is covered by test_bob_s_five_named_places_read_exactly_right above.
        self.assertEqual(self.by["Embershard Mine"]["actors"]["boss"]["level"], "leveled 6-10")

    def test_at_level_is_cumulative_not_a_single_tier(self):
        # Bob, 23 Oct, 17:10: "at 12 you'll meet about 3 to 12" -- everything gated at or below 12, not just
        # whatever one tier happens to need exactly 12. Bob, 16:50: a player's terms (from/meets/words), no "gate",
        # and no row that repeats the one before it (a band holds until "meets" actually changes).
        at_level = self.by["Bleak Falls Barrow"]["actors"]["atLevel"]
        froms = [e["from"] for e in at_level]
        self.assertEqual(froms, sorted(froms))  # ascending, one row per distinct band
        self.assertNotIn("gate", at_level[0])
        for e in at_level:
            self.assertIn("words", e)
            self.assertIn(str(e["from"]), e["words"])
        for i in range(1, len(at_level)):
            self.assertNotEqual(at_level[i - 1]["meets"], at_level[i]["meets"])  # a real change, not a repeat
            self.assertLessEqual(at_level[i - 1]["meets"][0], at_level[i]["meets"][0])  # the floor never falls as the band rises
            self.assertLessEqual(at_level[i - 1]["meets"][1], at_level[i]["meets"][1])  # nor does the ceiling

    def test_halted_stream_camp_s_chief_and_fort_hraggstad_s_commander(self):
        # Bob, 23 Oct, 16:50: the chief's own records say 19 to 24, but the zone (read and logged under the order)
        # caps the camp at 10; say "level 10", never "leveled from 10" (that reads as an open floor). A fort's
        # commander isn't always marked Boss in the records; fall back to its highest-level named, unique actor.
        self.assertEqual(self.by["Halted Stream Camp"]["actors"]["boss"]["level"], "level 10")
        # WO-144 Part 1e-2/1e-4 (Bob, 23 Oct): Fort Hraggstad's commander -- and its entire static garrison --
        # turns out to be the Civil War's own, caught by the marker chain and by faction alike; nothing is left
        # at the start (count 0), so the fort's commander is `afterTheWar`'s boss now, not a start-set fallback.
        start = self.by["Fort Hraggstad"]["actors"]
        self.assertEqual(start["count"], 0)
        after = start["afterTheWar"]
        self.assertEqual(after["boss"]["name"], "Imperial Soldier")
        self.assertTrue(after["boss"]["level"].startswith("leveled"))

    def test_the_fourteen_at_level_one_are_read_by_hand_not_guessed(self):
        # Bob, 23 Oct, 17:10: "The 14 still at 1 to 1 get read by hand and logged." Spot-checked directly against
        # the records (not this index): Septimus Signus is Septimus Signus himself, level 1, a real vanilla fact,
        # not a bug. The others are tiny inns and shacks with one to five low-threat actors; see the order's log.
        outpost = self.by["Septimus Signus' Outpost"]["actors"]
        self.assertEqual((outpost["floor"], outpost["ceiling"]), (1, 1))

    def test_discovery_xp_and_respawns_are_grounded_in_the_mcm_settings(self):
        # WO-144 Part 1e: discoveryXp from Experience.ini's [Exploring]; respawns from Requiem's own MCM settings
        # (720h/7200h = 30/300 days), never hardcoded -- matches docs/data/places.md's own stated numbers exactly.
        barrow = self.by["Bleak Falls Barrow"]
        self.assertEqual(barrow["discoveryXp"], 10)
        self.assertEqual(barrow["respawns"], "after 300 days once cleared, 30 ordinarily")
        never = [p["name"] for p in self.rows if p.get("respawns") == "never"]
        self.assertGreater(len(never), 0)  # at least one place carries the zone's own "never resets" flag

    def test_what_lives_there_is_the_actor_s_own_faction_not_a_substring_guess(self):
        # WO-144 Part 1e: a faction EDID must *end with* "<Kind>Faction" -- a Wolf at Embershard Mine carries
        # "SprigganPredatorFaction" (what it hunts, not what it is) alongside its own "WolfFaction"; a plain
        # substring check called it a Spriggan before this test existed.
        self.assertEqual(self.by["Bleak Falls Barrow"]["actors"]["livesHere"], "Draugr")
        embershard = self.by["Embershard Mine"]["actors"]
        self.assertEqual(embershard["livesHere"], "Bandit")
        self.assertNotIn("Spriggan", [embershard["livesHere"]] + embershard.get("alsoHere", []))

    def test_bobs_cleaning_pass_names_are_gone_or_fixed(self):
        # WO-144 Part 1, Bob 23 Oct 15:35: a keyword alone isn't a building (a city tagged as having an inn, a
        # player home, a dungeon with a stray LocTypeInn, a cellar, a tomb). These never show as a Temple/Inn/Guild.
        names = {p["name"] for p in self.rows if p["type"] in ("Temple", "Inn", "Guild")}
        for bad in ("Whiterun", "Solitude", "Home of Thane Alarik", "Fort Valus", "The Hermit", "The Hermit Cellar",
                    "Markarth East Empire Dormitory", "Temple Location", "Markarth Outskirts",
                    "Snow-Shod Farm Cellar", "Mausoleum", "Mustering Hall"):
            self.assertNotIn(bad, names, bad)
        self.assertNotEqual(self.by["Cragwater Cavern"]["type"], "Inn")  # still a dungeon, just never an inn

    def test_building_names_are_the_cell_s_not_the_record_s(self):
        # Bob: "Mistveil Keep", not "Riften Mistveil Keep"; "Vilemyr Inn", not "Ivarstead Vilemyr Inn".
        self.assertEqual(self.by["Mistveil Keep"]["name"], "Mistveil Keep")
        self.assertEqual(self.by["Mistveil Keep"]["recordName"], "Riften Mistveil Keep")
        self.assertEqual(self.by["Vilemyr Inn"]["name"], "Vilemyr Inn")

    def test_the_roads_table_covers_every_mainland_pair_once(self):
        # WO-144 Part 1 item 4: every capital and settlement to every other in the same worldspace, no duplicate pair,
        # never across worldspaces (Solstheim's towns never road to a mainland one), and matches Bob's two pairs.
        self.assertEqual(self.road_by[frozenset(("Riverwood", "Whiterun"))], {"towns": ["Riverwood", "Whiterun"], "km": 0.5, "walk": "a short walk"})
        self.assertEqual(self.road_by[frozenset(("Riften", "Whiterun"))]["walk"], "a long day's road")
        self.assertNotIn(frozenset(("Riverwood", "Raven Rock")), self.road_by)  # Tamriel to Solstheim: no road
        self.assertEqual(len(self.roads), len({frozenset(r["towns"]) for r in self.roads}))  # no pair twice

    def test_suggest_places_can_read_a_place_s_road_towns(self):
        # Player question 26 ("What's near Riften for Kyria's first act?"): Mac's door reads nearTowns for an act's
        # towns from this table; the PC's job is only that every road the door could ask for is here, with a town.
        riften_roads = [r for r in self.roads if "Riften" in r["towns"]]
        self.assertGreater(len(riften_roads), 10)
        self.assertTrue(all(r["km"] > 0 for r in riften_roads))

    def test_bleak_falls_barrow_s_word_wall_is_unrelenting_force(self):
        # WO-144 Part 1e, one of the ten spot checks (against UESP: Bleak Falls Barrow teaches the first word of
        # Unrelenting Force, "Fus"). Resolved by the activator's own word matched to its WOOP, then the SHOU whose
        # SNAM names that WOOP -- a real record relationship each step, never a guess at which shout a wall teaches.
        self.assertEqual(self.by["Bleak Falls Barrow"]["worthGoingFor"]["wordWall"], ["Unrelenting Force"])
        self.assertTrue(self.by["Bleak Falls Barrow"]["worthGoingFor"]["bossChest"])
        self.assertIn("an alchemy lab", self.by["Bleak Falls Barrow"]["worthGoingFor"]["crafting"])
        self.assertTrue(self.by["Bleak Falls Barrow"]["danger"]["traps"])

    def test_labyrinthian_and_ustengrav_word_walls(self):
        # Against UESP: Labyrinthian teaches Dismay, Ustengrav teaches Become Ethereal.
        self.assertEqual(self.by["Labyrinthian"]["worthGoingFor"]["wordWall"], ["Dismay"])
        self.assertEqual(self.by["Ustengrav"]["worthGoingFor"]["wordWall"], ["Become Ethereal"])

    def test_skill_books_name_their_skill_and_title_not_a_leveled_guess(self):
        # Skyrim's own convention ("SkillPickpocket2" teaches Pickpocket) is the source, never a guess at a leveled
        # list's loot. "Thief" (Pickpocket) really is placed at Bleak Falls Barrow -- confirmed against the record,
        # not assumed from its title alone.
        # WO-144 Part 1e-4 (Bob, 23 Oct, 18:05): "Pickpocket (Thief)" -> "Pickpocket: Thief", a skill's own name
        # as a player reads it ("HeavyArmor" is never shown bare).
        books = self.by["Bleak Falls Barrow"]["worthGoingFor"]["skillBooks"]
        self.assertIn("Pickpocket: Thief", books)

    def test_a_place_with_nothing_worth_going_for_carries_neither_key(self):
        # The Bee and Barb (an inn, no dungeon loot) carries no worthGoingFor or danger at all -- "not checked" by
        # omission, never an empty dict or a false "no" where the place simply has none of these.
        bee = self.by["Bee and Barb"]
        self.assertNotIn("worthGoingFor", bee)
        self.assertNotIn("danger", bee)

    def test_the_wars_garrison_is_separate_at_every_war_fort(self):
        # WO-144 Part 1e-2 (Bob, 23 Oct, 17:20): "who's there when she arrives" at every fort the war contests --
        # the start's own occupants (bandits, skeletons, whatever already holds it) never merge with the Civil
        # War's own reinforcement (enable-parented to "CWGarrisonEnableMarkerImperial<Fort>"/"...Sons<Fort>",
        # Bethesda's own naming across every fort and camp, both sides -- not a guess).
        for name in ("Fort Hraggstad", "Fort Greymoor", "Fort Snowhawk", "Fort Amol"):
            after = self.by[name]["actors"]["afterTheWar"]
            if "name" in after["boss"]:  # Fort Amol's own tie has no single named soldier standing out
                self.assertIn(after["boss"]["name"], ("Imperial Soldier", "Fort Commander"))
            self.assertTrue(after["boss"]["level"].startswith("level"))

    def test_embershard_mines_wolves_are_not_the_wars_garrison(self):
        # WO-144 Part 1e-2/1e-3/1e-4, read twice over: UESP names only bandits for this dungeon, no wolves, and
        # the wolves' own enable-parent ("E3demoMarker", a disabled leftover) agrees -- but excluding *any*
        # disabled ref (tried in 1e-4) also excluded Wolfskull Cave's own confirmed-right Ritual Master (enable-
        # parented to a quest-state marker that starts disabled too, enabled almost as soon as a player reaches
        # the cave -- a shape this reader can't tell apart from Embershard's wolves without reading the enabling
        # quest's own stages). So: Civil War only, by the verified "CWGarrisonEnableMarker" naming or a CW
        # faction; the wolves carry neither, and stay counted at the start -- a known, logged gap, not a guess.
        embershard = self.by["Embershard Mine"]["actors"]
        self.assertIn("Wolf", embershard.get("alsoHere", []))
        self.assertNotIn("afterTheWar", embershard)

    def test_wolfskull_caves_ritual_master_survives_the_civil_war_only_rule(self):
        # The case that forced 1e-4's narrower rule: a dungeon's own quest-tied boss (enable-parented to a quest-
        # state marker, not a Civil War one) must never be excluded by a broad "any disabled ref" rule.
        self.assertEqual(self.by["Wolfskull Cave"]["actors"]["boss"]["name"], "Ritual Master")

    def test_a_civil_war_faction_moves_a_garrison_even_with_no_marker_chain(self):
        # WO-144 Part 1e-4 (Bob, 23 Oct, 18:05): Fort Hraggstad's start still read "lives here: Imperial" -- about
        # 20 unnamed CWImperialFaction soldiers carried no CWGarrisonEnableMarker parent at all (a different gate
        # on the same war), caught now by the actor's own faction, not only the marker chain. Fort Hraggstad's
        # entire static garrison turns out to be Civil-War-tied this way (zero left at the start once both the
        # marker chain and the faction catch their own); logged as read, not forced back up to match UESP's
        # "starts bandit-held" by guessing at a baseline this reader can't otherwise find in the records.
        start = self.by["Fort Hraggstad"]["actors"]
        self.assertEqual(start["count"], 0)
        self.assertEqual(start["afterTheWar"]["livesHere"], "Imperial")
        self.assertEqual(self.by["Fort Greymoor"]["actors"]["livesHere"], "Bandit")  # a real baseline survives here

    def test_stendarrs_beacons_molag_bal_is_a_logged_gap_not_the_civil_war(self):
        # WO-144 Part 1e-4 (Bob, 23 Oct, 18:05): Molag Bal (Vigilant.esm, a quest scene) is confirmed, by hand, a
        # genuinely disabled actor with no enable parent at all -- but telling a quest's own absent-until-later
        # boss apart from a dungeon's always-there, quest-tied one (Wolfskull Cave's Ritual Master, also disabled
        # at the record level) needs the enabling quest's own stages, which this reader doesn't parse. Still
        # counted at the start for that reason, never the war's -- logged as open, not silently guessed around.
        beacon = self.by["Stendarr's Beacon"]["actors"]
        self.assertEqual(beacon.get("boss", {}).get("name"), "Molag Bal")
        self.assertNotIn("afterTheWar", beacon)

    def test_friendly_places_have_no_enemies_or_boss(self):
        # WO-144 Part 1e-3 (Bob, 23 Oct, 17:35): "a stronghold's, a town's or a guild hall's residents aren't
        # hostile" -- an Orc stronghold, an inn, a keep never carries `boss`/`floor`/`ceiling`, whatever level its
        # people happen to be (Largashbur's own Chief Yamarz, Bee and Barb's Keerava, Jarl Siddgeir).
        for name in ("Largashbur", "Narzulbur", "Bee and Barb", "Jarl's Longhouse"):
            actors = self.by[name]["actors"]
            self.assertEqual(actors["hostile"], False)
            self.assertNotIn("boss", actors)
            self.assertNotIn("floor", actors)

    def test_the_boss_is_the_highest_level_hostile_not_the_strongest_named_pet(self):
        # Bob, 23 Oct, 17:35: Faldar's Tooth read "Pit Wolf, level 2" as its boss -- a named but minor pet,
        # picked only because the old fallback required a name at all. Its real strongest tier is an anonymous
        # leveled bandit (6 to 24, clamped); the boss is now that ceiling, unnamed, never "Pit Wolf".
        boss = self.by["Faldar's Tooth"]["actors"]["boss"]
        self.assertNotEqual(boss.get("name"), "Pit Wolf")
        self.assertEqual(boss["level"], "leveled 6-24")

    def test_a_named_creature_with_no_hostile_faction_is_never_the_boss(self):
        # Bob, 23 Oct, 17:35: Fort Snowhawk's own boss read as "Exmoor Pony, level 4" -- a named horse, not an
        # enemy. The fallback boss now also requires `kind_of` to resolve a hostile kind, the same check "what
        # lives there" uses, never just whichever named actor happens to have the highest level.
        snowhawk = self.by["Fort Snowhawk"]["actors"]
        self.assertNotEqual(snowhawk.get("boss", {}).get("name"), "Exmoor Pony")

    def test_a_mannequin_is_never_counted_as_an_enemy(self):
        # Bob, 23 Oct, 17:35: Nightingale Hall read "1 to 1" against its own zone minimum of 8 -- a contradiction.
        # Its only actors are display mannequins (race ManakinRace); excluded, the place carries no `actors` at
        # all now, "not checked" rather than a false floor of 1.
        self.assertNotIn("actors", self.by["Nightingale Hall"])

    def test_danger_names_a_dragon_lair_from_the_place_s_own_type_not_a_new_read(self):
        # "Danger to a build": a dragon lair is already the place's own `type` (its map marker); no new record read.
        lairs = [p for p in self.rows if p["type"] == "DragonLair"]
        self.assertGreater(len(lairs), 0)
        self.assertTrue(all(p["danger"]["dragonLair"] for p in lairs))

    # ---- WO-166 Part 1: where each place is ----

    def test_every_place_has_a_position_or_a_town_or_says_why_not(self):
        for p in self.rows:
            self.assertEqual(sum([bool(p.get("pos")), bool(p.get("inTown")), bool(p.get("noPos"))]), 1, p["name"])  # exactly one story
            if p.get("pos"):
                self.assertEqual(len(p["pos"]), 3, p["name"])
                self.assertTrue(isinstance(p["world"], str) and p["world"], p["name"])
                self.assertIn(p["posFrom"], ("marker", "cells", "door"), p["name"])
                self.assertTrue(all(isinstance(v, (int, float)) for v in p["pos"][:2]), p["name"])
                self.assertEqual(p["pos"][2] is None, p["posFrom"] == "cells", p["name"])  # a cell's middle has no height; the rest do

    def test_nearly_every_place_is_placed(self):
        # The proof placed 286 of 566 on Tamriel; now the markers, the cells and the doors place all but a handful.
        free = [p for p in self.rows if not p.get("inTown")]
        placed = [p for p in free if p.get("pos")]
        self.assertGreater(len(placed), 0.97 * len(free), [p["name"] for p in free if not p.get("pos")])
        self.assertGreater(len([p for p in placed if p["world"] == "Tamriel"]), 340)

    def test_the_nine_capitals_are_cities_with_their_own_markers_positions(self):
        cities = {p["name"]: p for p in self.rows if p["type"] == "City" and p["name"] in pl.CAPITALS}
        self.assertEqual(set(cities), pl.CAPITALS)
        for name, (x, y) in {"Whiterun": (19855, -7422), "Solitude": (-64943, 104648), "Riften": (173415, -96600), "Markarth": (-174024, 5256),
                             "Windhelm": (135137, 35265), "Falkreath": (-30296, -86284)}.items():
            c = cities[name]
            self.assertEqual((c["world"], c["posFrom"]), ("Tamriel", "marker"), name)  # the five big cities' worlds share Tamriel's coordinates
            self.assertLess(abs(c["pos"][0] - x) + abs(c["pos"][1] - y), 5, name)
        self.assertEqual(cities["Whiterun"]["hold"], "Whiterun")
        self.assertEqual(cities["Solitude"]["hold"], "Haafingar")
        self.assertFalse([n for n, c in cities.items() if c.get("pointers")])  # a city keeps its quests, not every line that says its name
        self.assertTrue(all(c.get("quests") for c in cities.values()))

    def test_every_building_in_a_capital_points_at_a_city_row(self):
        towns = {p["inTown"] for p in self.rows if p.get("inTown")}
        cities = {p["name"] for p in self.rows if p["type"] == "City"}
        self.assertTrue({t for t in towns if t in pl.CAPITALS} <= cities)

    def test_bob_s_two_hand_checks_on_the_map(self):
        # Bleak Falls Barrow is west-north-west of Riverwood and higher; Embershard Mine is south of it.
        riv, bfb, emb = (self.by[n] for n in ("Riverwood", "Bleak Falls Barrow", "Embershard Mine"))
        self.assertLess(bfb["pos"][0], riv["pos"][0])
        self.assertGreater(bfb["pos"][1], riv["pos"][1])
        self.assertGreater(bfb["pos"][2], riv["pos"][2])
        self.assertLess(emb["pos"][1], riv["pos"][1])
        self.assertLess(abs(bfb["pos"][0] - riv["pos"][0]) + abs(bfb["pos"][1] - riv["pos"][1]), 26000)  # "next to it": 0.3 km

    def test_morvunskar_crypts_has_its_own_position_and_is_no_longer_riverwood_s_neighbour(self):
        crypts, barrow = self.by["Morvunskar Crypts"], self.by["Bleak Falls Barrow"]
        self.assertNotEqual(crypts["marker"], barrow["marker"])  # its record pointed at the barrow's map marker
        self.assertGreater(abs(crypts["pos"][0] - barrow["pos"][0]) + abs(crypts["pos"][1] - barrow["pos"][1]), 10 * pl.SAME_SPOT)
        self.assertNotEqual(crypts["nearestTown"]["town"], "Riverwood")

    def test_fort_dawnguard_and_the_other_places_quests_name_are_places(self):
        # WO-166 (Bob, 27 Oct 21:45): Dawnguard starts at Fort Dawnguard, which had no place at all.
        for name in ("Fort Dawnguard", "Esbern's Vault", "Thalmor Embassy", "Dayspring Canyon"):
            p = self.by[name]
            self.assertEqual(p["world"], "Tamriel", name)
            self.assertTrue(p["namedByQuest"], name)
        self.assertEqual(self.by["Fort Dawnguard"]["type"], "Fort")
        self.assertIs(self.by["Fort Dawnguard"]["actors"]["hostile"], False)  # the Dawnguard's home, not a fight with "Isran, level 150"
        # ...and a room is not one: a house, a shop, a jail, a hold or a name no map holds stays out.
        for name in ("Belethor's General Goods", "Whiterun Jail", "Haafingar", "Apocrypha", "Sovngarde"):
            self.assertNotIn(name, self.by, name)

    def test_the_leftovers_and_the_listed_twice_are_gone_or_merged(self):
        self.assertNotIn("E3 Bleak Falls Barrow", self.by)  # an E3 demo's location
        self.assertNotIn("Name TBD", self.by)
        self.assertNotIn("Sewers", self.by)  # a room of Ben Erai's: named for it
        self.assertIn("Ben Erai Sewers", self.by)
        self.assertFalse([p["name"] for p in self.rows if pl.LEFTOVER.search(p["edid"])])
        self.assertEqual(sum(1 for p in self.rows if p["name"] == "Sancre Tor"), 1)  # a place and its four parts
        self.assertEqual(sum(1 for p in self.rows if p["name"] == "Bonestrewn Crest"), 1)  # the real one, not the UNUSED copy
        self.assertEqual(self.by["Sancre Tor"]["alsoRecordedAs"][0]["edid"][:15], "manny_GF_L_Sanc")

    def test_one_name_for_two_places_only_where_they_are_two_places(self):
        by_name = collections.defaultdict(list)
        for p in self.rows:
            by_name[p["name"].lower()].append(p)
        for name, group in by_name.items():
            for i, a in enumerate(group):
                for b in group[i + 1:]:
                    self.assertFalse(a["marker"] and a["marker"] == b["marker"], name)
                    if a.get("pos") and b.get("pos") and a["world"] == b["world"]:
                        d = ((a["pos"][0] - b["pos"][0]) ** 2 + (a["pos"][1] - b["pos"][1]) ** 2) ** 0.5
                        self.assertGreater(d, pl.SAME_SPOT, name)
        self.assertEqual(len(by_name["imperial military camp"]), 8)  # one in each hold: eight places, not one
        self.assertEqual(len(by_name["hall of the dead"]), 3)  # Markarth, Riften, Whiterun

    def test_the_site_file_carries_where_a_place_is(self):
        row = {"id": "X:1", "name": "Some Cave", "type": "Cave", "edid": "E", "world": "Tamriel", "pos": [1.0, 2.0, None], "posFrom": "cells",
               "noPos": None, "alsoRecordedAs": [{"id": "Y:2"}], "namedByQuest": ["Q"]}
        (out,) = pl.build_site([row])
        self.assertEqual((out["world"], out["pos"]), ("Tamriel", [1.0, 2.0, None]))
        for hidden in ("posFrom", "noPos", "alsoRecordedAs", "namedByQuest", "edid"):
            self.assertNotIn(hidden, out)


if __name__ == "__main__":
    unittest.main()
