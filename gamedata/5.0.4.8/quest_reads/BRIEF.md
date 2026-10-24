# Quest reads: the reader's brief

You are reading quests for LoreRim 5.0.4.8, a large Skyrim modlist, so that a planner can tell players how to find, start and finish each one. A player will follow what you write, so it must be right. Where you aren't sure, say so; a blank with a reason beats a guess.

## What you may read

Only the game-record extracts in `gamedata/5.0.4.8/` whose names end in `_raw.json`: `quests_raw.json`, `quest_givers_raw.json`, `quest_starts_raw.json`, `questlines_raw.json`, `people_raw.json`, `places_raw.json`, `items_raw.json`, `spells_raw.json` and the rest. Use Python or grep to pull just the records you need; the files are large.

Do not open `quests.json`, `quest_truth*.json`, `overrides.json`, `story_checks/`, `src/`, `docs/`, other files in `quest_reads/`, or the web. Don't use what you remember of Skyrim for the facts: LoreRim changes many quests, and the point is what the records say.

## How to read

Read like a person following a trail, not a script matching patterns:
- Which dialogue line, script, book, trigger or event sets the quest's first stage? Follow it to the person, object or place.
- Check the conditions on that line: what has to be true (a level, an earlier quest's stage, a faction, a time of day)?
- When several plugins edit a quest, the last one in load order wins; say which.
- Read the stages, log entries and objectives to work out where the quest sends the player and which choices branch it.
- Rewards: script properties, leveled lists, items added, gold, spells, followers, houses, titles.

## What to write

One JSON object per quest, in a list, saved to the path you are given. Fields:

```json
{
  "edid": "TG05",
  "name": "Speaking With Silence",
  "plugin": "Skyrim.esm (last edited by …)",
  "canDo": "talk | by itself | radiant | cut | background",
  "canDoWhy": "one line, in player words",
  "needs": [{"what": "Finish Scoundrel's Folly", "kind": "quest | level | faction | item | other"}],
  "starts": [{"who": "Mercer Frey", "where": "the Cistern, under the Ragged Flagon in Riften", "how": "Talk to Mercer once Scoundrel's Folly is done; he tells you to meet him at Snow Veil Sanctum."}],
  "firstStep": "Meet Mercer Frey outside Snow Veil Sanctum",
  "takesYou": [{"place": "Snow Veil Sanctum", "hold": "Eastmarch", "why": "find Karliah"}],
  "choices": [{"choice": "plain words", "leadsTo": "plain words"}],
  "steps": [{"branch": "main", "objectives": ["…"]}],
  "rewards": [{"what": "Karliah's Invisibility (spell)", "when": "at the end"}],
  "type": "the quest's type in the records",
  "opens": ["quests this leads to"],
  "closes": ["anything it locks: a side, a guild, a person who dies"],
  "people": [{"name": "Karliah", "role": "found in Snow Veil Sanctum"}],
  "unsure": [{"field": "where", "why": "the records place him in X; his daily schedule isn't in these files"}],
  "evidence": ["the record ids you relied on, short"]
}
```

Rules for the words:
- `where` is how a player would look: a building, a room, "outside the Winking Skeever", never a bare city when the person stands in one spot. The records give where a person is placed, not their daily schedule; if the place matters and you only have the placement, put it in `unsure`.
- No stage numbers, record ids or condition text in any field a player reads. They go in `evidence`.
- A quest that is cut, console-only or never shown to the player: say so in `canDo` and leave `starts` empty.
- Empty lists are fine. Never invent to fill a field.

When you're done, reply with just the file path.
