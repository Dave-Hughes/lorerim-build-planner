"""
questlines.py's checks and its begins text, on a small made-up crawl.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import copy
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import questlines  # noqa: E402
from questlines import CurationError, curate  # noqa: E402


def quest(edid, *logs, objective=None, plugin="Skyrim.esm", ending=None):
    stages = [{"index": 10 * (i + 1), "log": [t]} for i, t in enumerate(logs)]
    if ending:
        stages.append({"index": 200, "log": [ending], "completes": True})
    return {"id": f"{plugin}:{edid}", "edid": edid, "name": edid.title(), "type": "Side Quest",
            "plugin": plugin, "source": "Skyrim" if plugin == "Skyrim.esm" else "A Mod", "modid": None,
            "stages": stages, "objectives": [{"index": 0, "text": objective}] if objective else []}


QUESTS = [
    quest("MS10", "The East Empire Company is being harassed by a group of pirates."),
    quest("MS11", "Windhelm is plagued by a shadowy killer, and the guards want my help."),
    quest("WEJunk", objective="Explore <Alias=Dungeon>"),
    quest("ModStart", "I received a letter from <Alias=Courier> about the island.",
          "Lurius Liore has asked me to meet him at the docks in Solitude.", plugin="Mod.esp"),
    quest("ModMarker", objective="Find the follower on your map", plugin="Mod.esp"),
    quest("ModWarrior", "A warrior tried to talk to me on the streets of <alias=StartCity>.",
          objective="Defeat the warrior at his last vigil", plugin="Mod.esp",
          ending="I have defeated the warrior. May his soul find rest in Sovngarde."),
]
RAW = [
    {"name": "Side quests", "kind": "bucket", "source": "Skyrim", "modid": None, "count": 3,
     "quests": ["Skyrim.esm:MS10", "Skyrim.esm:MS11", "Skyrim.esm:WEJunk"]},
    {"name": "The Mod", "kind": "mod", "source": "The Mod", "modid": "123", "count": 3,
     "opening": "Mod.esp:ModStart", "quests": ["Mod.esp:ModStart", "Mod.esp:ModMarker", "Mod.esp:ModWarrior"]},
]
CUR = {
    "kinds": {"story": "A story in Skyrim", "land": "Go somewhere new"},
    "lines": [
        {"id": "rise-in-the-east", "name": "Rise in the East", "kind": "story", "quests": ["MS10"]},
        {"id": "blood-on-the-ice", "name": "Blood on the Ice", "kind": "story", "quests": ["MS11"]},
        {"id": "the-mod", "name": "The Mod", "kind": "land", "lines": ["The Mod"], "skip": ["ModMarker"],
         "after": ["rise-in-the-east"], "gate": "Level 20.", "minLevel": 20, "checked": {"gate": "files"}},
    ],
    "droppedQuests": {"WEJunk": "A roadside encounter."},
}


def run(cur=CUR, quests=QUESTS, raw=RAW):
    return {l["id"]: l for l in curate(copy.deepcopy(quests), copy.deepcopy(raw), copy.deepcopy(cur))}


class Checks(unittest.TestCase):
    def fails(self, cur, *bits):
        with self.assertRaises(CurationError) as e:
            run(cur)
        for b in bits:
            self.assertIn(b, str(e.exception))

    def test_a_good_curation_resolves(self):
        out = run()
        self.assertEqual([q["edid"] for q in out["the-mod"]["quests"]], ["ModStart", "ModWarrior"])
        self.assertEqual(out["the-mod"]["sources"], [{"name": "The Mod", "modid": "123"}])
        self.assertEqual(out["rise-in-the-east"]["sources"], [{"name": "Skyrim", "modid": None}])
        self.assertEqual((out["the-mod"]["minLevel"], out["the-mod"]["after"]), (20, ["rise-in-the-east"]))

    def test_every_raw_line_and_bucket_quest_lands_somewhere(self):
        cur = copy.deepcopy(CUR)
        cur["lines"] = cur["lines"][1:]
        cur["droppedQuests"] = {}
        self.fails(cur, "MS10", "WEJunk")
        cur = copy.deepcopy(CUR)
        cur["lines"] = cur["lines"][:2]
        cur["lines"][0]["after"] = []
        self.fails(cur, "raw line 'The Mod'")

    def test_nothing_is_taken_twice(self):
        cur = copy.deepcopy(CUR)
        cur["lines"][1]["quests"].append("MS10")
        self.fails(cur, "MS10 is on both")
        cur = copy.deepcopy(CUR)
        cur["lines"].append({"id": "again", "name": "Again", "kind": "land", "lines": ["The Mod"]})
        self.fails(cur, "is on both the-mod and again")

    def test_names_must_be_real(self):
        cur = copy.deepcopy(CUR)
        cur["lines"][0]["quests"] = ["MS99"]
        cur["lines"][2]["after"] = ["nowhere"]
        self.fails(cur, "no quest MS99", "after nowhere")

    def test_a_bucket_is_split_not_taken_whole(self):
        cur = copy.deepcopy(CUR)
        cur["lines"][0]["lines"] = ["Side quests"]
        self.fails(cur, "takes the bucket")

    def test_a_named_quest_leaves_its_raw_line(self):
        cur = copy.deepcopy(CUR)
        cur["lines"][2]["skip"] = []
        cur["lines"].append({"id": "follower", "name": "Follower", "kind": "story", "quests": ["ModMarker"]})
        out = run(cur)
        self.assertNotIn("ModMarker", [q["edid"] for q in out["the-mod"]["quests"]])
        self.assertEqual([q["edid"] for q in out["follower"]["quests"]], ["ModMarker"])


class Begins(unittest.TestCase):
    def test_the_first_plain_entry_skips_alias_holes(self):
        out = run()
        self.assertEqual(out["the-mod"]["begins"], "Lurius Liore has asked me to meet him at the docks in Solitude.")
        self.assertEqual(out["the-mod"]["beginsFrom"], "opening")

    def test_an_ending_never_opens_a_line(self):
        cur = copy.deepcopy(CUR)
        cur["lines"][2]["opening"] = "ModWarrior"
        out = run(cur)
        self.assertEqual(out["the-mod"]["begins"], "Defeat the warrior at his last vigil")
        self.assertEqual(out["the-mod"]["beginsFrom"], "objective")

    def test_plain(self):
        self.assertFalse(questlines.plain("; Hilde admonished"))
        self.assertFalse(questlines.plain("QuickStart"))
        self.assertFalse(questlines.plain("Kill <Alias=Boss> in the cave beyond the river"))
        self.assertTrue(questlines.plain("A courier tracked me down and gave me a letter."))


if __name__ == "__main__":
    unittest.main()
