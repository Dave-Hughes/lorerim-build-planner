# Ways through a quest: the brief

The quest page shows choices and steps as one section, "N ways to finish it" (Dave, 23 Oct; canvas board "Quest page: Lights Out!, second pass"). Each way has a title (the choice, in a player's words), one line on how it ends, and the journal steps that way takes, numbered. The checked reads keep choices and steps as two separate lists and nothing ties them together. Your job is to tie them.

## What you may read

Only the checked reads you are given (`gamedata/5.0.4.8/quest_reads/checked/NNN.json`, the `quests` list) and `gamedata/5.0.4.8/quests_raw.json` (each quest's `objectives` with their index, and its `stages` with journal lines and the `completes` / `fails` flags). Nothing else: no `quests.json`, `quest_truth*.json`, `overrides.json`, `src/`, `docs/`, the web, or what you remember of Skyrim.

## What to write

For every quest in your batches whose checked read has a non-empty `choices` list, one object:

```json
{
  "edid": "MS07",
  "shape": "paths",
  "shared": [],
  "ways": [
    {"title": "Take the deal and put out the fire",
     "ends": "The Icerunner runs aground. Deeja turns on you at the wreck, then you hunt Jaree-Ra at Broken Oar Grotto.",
     "steps": ["Accept Jaree-Ra's offer in Solitude", "Put out the fire in the Solitude Lighthouse", "..."]}
  ],
  "unsure": [{"why": "..."}],
  "evidence": ["objective 125 follows stage 100's log", "..."]
}
```

- **`shape`**: `"paths"` when the choices split the quest into different step sequences (Lights Out!), `"endings"` when everyone does the same steps and the choice only decides the ending (The Golden Claw: get the claw, then give it back or keep it). For `"endings"`, the common steps go in `shared` and each way's `steps` holds only what that ending adds (often nothing).
- **`title`**: the choice, as the checked read words it, trimmed to a short title a player would pick from ("Report him to the guard captain"). Keep the game's names.
- **`ends`**: the choice's `leadsTo`, as the checked read words it. Don't add facts.
- **`steps`**: journal objective texts **copied exactly** from `quests_raw.json`, in the order a player meets them on that way. A step may sit in more than one way. Never write a step in your own words, never merge two.
- Tie by the records: which stages a journal line follows, which stage sets each objective, which stages `complete` or `fail`. When the records don't settle which way a step belongs to, put it where they point most strongly and say so in `unsure`.
- Every choice in the checked read becomes exactly one way, in the read's order. Don't drop one and don't invent one.

No record ids, editor ids or plugin file names in `title`, `ends` or `steps`; they go in `evidence`.

Save to the path you are given as `{"quests": [objects]}` and reply with the path and one line: how many quests you tied and how many carry an `unsure`.

Working files: keep any scripts you write in `/tmp/w<your group>/` (outside the repo).
