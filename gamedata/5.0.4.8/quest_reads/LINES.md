# Line reads: the brief (WO-153 Part 2)

A quest line page (Dave's spec, `docs/data/quest-pages.md`, "A quest line page") tells a player, for a whole line: what it is, how to get in, the quests in order, what the whole line gives, and what it closes. You write that for the lines you are given, from the checked quest reads.

## What you may read

- `src/data/lorerim-5.0.4.8/quests.json`, **only** each line's `id`, `name`, `category` and the `edid` and order of its `quests`. Nothing else in that file: its other fields come from older rules.
- `gamedata/5.0.4.8/quest_reads/checked/*.json` (the `quests` lists): the checked read of each quest. These are your facts.
- The `*_raw.json` files in `gamedata/5.0.4.8/`, to settle something a checked read leaves open (a level gate, which quest a quest leads to).
- Not `quest_truth*.json`, `overrides.json`, `story_checks/`, other `docs/`, the web, or what you remember of Skyrim. LoreRim moves and renames things.

## What to write

One object per line:

```json
{
  "id": "thieves-guild",
  "name": "The Thieves Guild",
  "about": "Two plain sentences: what kind of story, where it happens, what level it's made for, roughly how long.",
  "getIn": {"quest": "A Chance Arrangement", "who": "Brynjolf", "where": "the market in Riften, by day", "how": "one sentence a player can follow", "needs": ["a level gate or earlier quest, or empty"]},
  "order": [
    {"quest": "A Chance Arrangement", "what": "one line: what you do", "where": "the main place", "needs": "only what this one needs that the one before didn't, or empty"}
  ],
  "branches": [{"at": "quest name", "options": ["what each side is"]}],
  "gives": ["the big rewards of the whole line: titles, houses, followers, powers, artifacts"],
  "closes": ["sides you can't take after, people who die, lines it conflicts with"],
  "unsure": [{"field": "...", "why": "..."}],
  "evidence": ["which checked reads and records each fact came from"]
}
```

- Every fact comes from a checked read or a record. Where they don't settle something, leave it out of the field and say why in `unsure`. Never fill a gap from memory.
- `order` follows the line's quest order. A radiant or repeatable job in the line gets one row saying so; it isn't a step in the story.
- `about` and every `what` are plain sentences that state facts. No punchy lines, no "X, not Y", no lists of three adjectives, no promises. Use the game's names. Spoil nothing past what a player needs to choose whether to start.
- No record ids, editor ids or plugin file names in any text a player reads; they go in `evidence`.

Save to the path you are given as `{"lines": [objects]}` and reply with the path and one line: how many lines, how many carry an `unsure`.

Working files: keep any scripts you write in `/tmp/l<your group>/` (outside the repo).

## Checking a line read

A second agent checks every line read against the same sources, field by field, the way `CHECK.md` checks quests: **agree**, **fix** (with the corrected value and the read or record that shows it) or **unsure**. Every verdict's note names what was compared. It writes `{"checks": [{"id", "verdicts": {field: {"verdict", "note"}}}], "lines": [corrected objects]}` to the checked path it is given.
