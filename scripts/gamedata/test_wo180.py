"""
WO-180 (PC): the game's own markup and an editor's words out of what a page quotes, and a town's people by where they live.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import json
import os
import re
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import editor_words as ew  # noqa: E402
import people as ppl  # noqa: E402
import places as pl  # noqa: E402

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PEOPLE = os.path.join(REPO, "gamedata", "5.0.4.8", "people_raw.json")
SITE = os.path.join(REPO, "src", "data", "lorerim-5.0.4.8", "places.json")
QUESTS = os.path.join(REPO, "src", "data", "lorerim-5.0.4.8", "quests.json")


class Quotes(unittest.TestCase):
    def test_the_game_s_markup_goes_before_a_quote_is_cut(self):
        text = "[pagebreak]<font face='$HandwrittenFont' size='18'>Whispers of <img src='img://x.dds' WIDTH='33' HEIGHT='64'>Aringoth</font>[pagebreak]"
        self.assertEqual(pl.game_text(text).strip(), "Whispers of Aringoth")

    def test_the_player_is_you_and_any_other_name_the_game_fills_in_is_a_hole(self):
        self.assertEqual(pl.game_text("Thank you, <Alias=Player>."), "Thank you, you.")
        self.assertIn(pl.HOLE, pl.game_text("Jarl of <Alias=Jarl>, to <Alias.ShortName=Steward>, in recognition"))
        self.assertIn(pl.HOLE, pl.game_text("It cost <Global=GoldCost> septims"))

    def test_the_built_places_have_no_markup_and_no_hole(self):
        rows = json.load(open(SITE, encoding="utf-8"))["places"]
        bad = []
        for p in rows:
            for q in p.get("pointers") or []:
                w = q["words"]
                if re.search(r"\[pagebreak\]|<|>|size=|face=|WIDTH|img://|\x00", w, re.I):
                    bad.append((p["name"], "markup", w[:60]))
                if re.search(r"\b(?:Jarl of|to|Steward to) ,|,\s*,", w):
                    bad.append((p["name"], "hole", w[:60]))
        self.assertEqual(bad, [])

    def test_a_quote_names_a_quest_only_when_a_player_has_it_on_the_quests_pages(self):
        quests = json.load(open(QUESTS, encoding="utf-8"))["lines"]
        names = {q["name"] for l in quests for q in l["quests"]}
        rows = json.load(open(SITE, encoding="utf-8"))["places"]
        self.assertEqual(sorted({q["quest"] for p in rows for q in p.get("pointers") or [] if q.get("quest") and q["quest"] not in names}), [])
        for junk in ("Whiterun City Dialogue", "Additional Riverwood Dialogue", "CH Generic", "0WRDialogue", "0TallyFollower"):
            self.assertNotIn(junk, {q.get("quest") for p in rows for q in p.get("pointers") or []})
        # ...and the game's own dialogue quest is kept where the assistant's town gossip reads it, under another name.
        self.assertIn("Riften Dialogue", {q.get("dialogue") for p in rows for q in p.get("pointers") or []})


class EditorWords(unittest.TestCase):
    def test_a_clause_with_an_editor_s_word_goes_and_the_rest_stays(self):
        self.assertEqual(ew.without_editor_words("Derkeethus as a follower (he's in the follower and marriage factions)"), "Derkeethus as a follower")
        self.assertEqual(ew.without_editor_words("kidnapped by a vampire; the quest also has Spouse and Friend aliases, so it may be your spouse"), "kidnapped by a vampire")
        self.assertEqual(ew.without_editor_words("tied to the quest's aliases"), "")
        self.assertEqual(ew.without_editor_words("Gold (from the Dark Ancestor quest script)"), "Gold")
        self.assertEqual(ew.without_editor_words("A clean sentence about a form of werewolf."), "A clean sentence about a form of werewolf.")

    def test_a_person_s_day_has_no_package_in_it(self):
        read = {"day": [{"from": "7 am", "for": "12 hours", "where": "Dushnikh Yal", "doing": "his daytime package has no place set; he's about the stronghold"}],
                "changes": ["Both of her home packages only run while she isn't your follower; once she follows you she goes where you go.", "She leaves for Windhelm after the war."]}
        out = ppl.tidy_person_read(read)
        self.assertEqual(out["day"][0]["doing"], "he's about the stronghold.")
        self.assertEqual(out["changes"], ["once she follows you she goes where you go.", "She leaves for Windhelm after the war."])

    def test_the_built_people_and_quests_say_none_of_them(self):
        people = json.load(open(os.path.join(REPO, "src", "data", "lorerim-5.0.4.8", "people.json"), encoding="utf-8"))["people"]
        said = []
        for p in people:
            r = p.get("read") or {}
            for k in ("firstMeet", "role", "sells", "trains", "joins", "marries", "fightsWith", "canDie"):
                if ew.EDITOR_RE.search(r.get(k) or ""):
                    said.append((p["name"], k, r[k][:60]))
            for c in r.get("changes", []):
                if ew.EDITOR_RE.search(c):
                    said.append((p["name"], "changes", c[:60]))
            for d in r.get("day", []):
                if ew.EDITOR_RE.search(d.get("doing", "") + d.get("where", "")):
                    said.append((p["name"], "day", d["doing"][:60]))
        self.assertEqual(said, [])
        quests = json.load(open(QUESTS, encoding="utf-8"))["lines"]
        said = [(q["name"], x.get("role") or x.get("what")) for l in quests for q in l["quests"] for x in (q.get("read") or {}).get("people", []) + (q.get("read") or {}).get("rewards", [])
                if ew.EDITOR_RE.search(x.get("role") or x.get("what") or "")]
        self.assertEqual(said, [])

    def test_a_trainer_s_skill_is_said_as_the_game_shows_it(self):
        self.assertEqual(ppl.person_facts({"X": {"trainer": {"skill": "OneHanded", "levelCap": 50}}})["X"]["trainer"], {"skill": "One-Handed", "cap": 50})
        people = json.load(open(os.path.join(REPO, "src", "data", "lorerim-5.0.4.8", "people.json"), encoding="utf-8"))["people"]
        skills = {p["trainer"]["skill"] for p in people if p.get("trainer")}
        self.assertEqual([s for s in skills if re.search(r"[a-z][A-Z]", s) or s in ("Speechcraft", "Lockpick")], [])


class Races(unittest.TestCase):
    def test_a_race_named_by_an_editor_id_is_said_in_words(self):
        self.assertEqual(ppl.race_words("0Asy1um_OthrielSnowElfRace"), "Snow Elf")
        self.assertEqual(ppl.race_words("MudCrab"), "Mud Crab")
        self.assertEqual(ppl.race_words("Dunmer"), "Dunmer")
        self.assertEqual(ppl.race_words("Wood Elf"), "Wood Elf")

    def test_no_person_is_of_a_race_with_an_underscore_or_a_capital_in_the_middle(self):
        people = json.load(open(os.path.join(REPO, "src", "data", "lorerim-5.0.4.8", "people.json"), encoding="utf-8"))["people"]
        self.assertEqual(sorted({p["race"] for p in people if p.get("race") and re.search(r"[_\d]|[a-z][A-Z]", p["race"])}), [])


@unittest.skipUnless(os.path.exists(PEOPLE), "people_raw.json not built")
class Towns(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows = json.load(open(PEOPLE, encoding="utf-8"))["people"]

    def test_a_dungeon_s_people_are_not_a_cities_people(self):
        # Whiterun listed 133, with the Spider in Bleak Falls Temple, Jon the Mad in his cave, the Greybeards at High Hrothgar and all of Fort Greymoor.
        by = {p["name"]: p for p in self.rows}
        for name in ("Web Mother", "Jon the Mad", "Sild the Warlock", "Arngeir", "Arvel the Swift"):
            if name in by:
                self.assertIsNone(by[name].get("inTown"), name)
        self.assertEqual(by["Balgruuf the Greater"]["inTown"], "Whiterun")
        self.assertEqual(by["Ysolda"]["inTown"], "Whiterun")

    def test_no_one_in_a_town_lives_in_a_place_of_its_own(self):
        places = json.load(open(os.path.join(REPO, "gamedata", "5.0.4.8", "places_raw.json"), encoding="utf-8"))["places"]
        outlying = {p["name"] for p in places if not p.get("inTown") and p["type"] in ("Cave", "NordicRuin", "Fort", "Mine", "Camp", "DwemerRuin")}
        homes = [(p["name"], p["cell"], p["inTown"]) for p in self.rows if p.get("inTown") and p.get("cell") in outlying]
        self.assertEqual(homes, [])


if __name__ == "__main__":
    unittest.main()
