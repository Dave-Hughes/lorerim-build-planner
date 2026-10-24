# People reads: the reader's brief

You are reading people in LoreRim 5.0.4.8, a large Skyrim modlist, so a planner can tell a player where to find someone, when, and what they offer. A player will walk to where you say, so it must be right. Where you aren't sure, say so; a blank with a reason beats a guess. The spec is `docs/data/people.md`; read its table first (that file only, not the rest of `docs/`).

## What you may read

Only the game-record extracts in `gamedata/5.0.4.8/` whose names end in `_raw.json`, above all `people_schedules_raw.json` (every person's AI packages in the order the game evaluates them, with decoded hours, resolved places, conditions; their factions, class, vendor, trainer, follower, marriage, essential flags and the quests whose aliases name them) and `people_raw.json`, plus `quests_raw.json`, `quest_givers_raw.json`, `places_raw.json`, `items_raw.json`, `spells_raw.json`. Use Python to pull just what you need. Don't open `quests.json`, `people.json`, `quest_truth*.json`, `overrides.json`, `src/`, the web, or what you remember of Skyrim: LoreRim moves and renames things (Winterhold's Longhouse is Stonecold Fortress here).

## How to read where someone is

The game runs a person's packages top first; the first whose conditions pass is what they do. So read down the list: a quest-gated "stay put" package at the top beats everything below it while it holds (Jaree-Ra stays at the Winking Skeever until Lights Out! is done). Shared packages ("Default…", used by hundreds) say only "near where they're placed". Give the day as a player would live it: "8 am to 8 pm at her stall in the market; 8 pm to midnight at the Bee and Barb; sleeps at home". Say what changes it (a quest, a war outcome, being exiled).

## What to write

One JSON object per person, in a list:

```json
{
  "id": "Skyrim.esm:01336B", "name": "Mjoll the Lioness",
  "race": "Nord", "sex": "female",
  "firstMeet": "where a player first finds them, in player words",
  "day": [{"from": "8 am", "for": "4 hours", "where": "the market, Riften", "doing": "browsing"}],
  "changes": ["what moves them, and when"],
  "role": "what they are to the player: merchant, trainer, innkeeper, follower, quest giver...",
  "sells": "what, if a real vendor; else empty",
  "trains": "skill and up to what level, if a trainer",
  "joins": "how they become a follower, if they can",
  "marries": "yes/no and what it needs",
  "fightsWith": "from class and gear",
  "quests": [{"quest": "name", "how": "gives it / a step in it / its target / changed by it"}],
  "canDie": "essential / protected / can die",
  "unsure": [{"field": "...", "why": "..."}],
  "evidence": ["record ids, package editor ids"]
}
```

No record ids, editor ids or plugin file names in any text a player reads; they go in `evidence`. Never invent to fill a field.

Working files: keep any scripts you write in `/tmp/p<your batch>/` (outside the repo).

When you're done, reply with just the file path.
