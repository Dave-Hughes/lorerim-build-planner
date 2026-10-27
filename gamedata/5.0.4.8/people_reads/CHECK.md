# People reads: the checker's brief

Another reader wrote answers for a batch of LoreRim 5.0.4.8 people, following `gamedata/5.0.4.8/people_reads/BRIEF.md` (read it first, and `docs/data/people.md`'s table). Check every answer against the same game records, independently, as if you might find them wrong.

Read only what the reader was allowed to read (the `*_raw.json` files in `gamedata/5.0.4.8/`) plus the reader's batch file you are given. No `people.json`, `quests.json`, `quest_truth*.json`, `overrides.json`, `src/`, other `docs/`, no web, no memory of Skyrim for facts.

For each person, for each of `firstMeet`, `day`, `changes`, `role`, `sells`, `trains`, `joins`, `marries`, `fightsWith`, `quests`, `canDie`:
- **agree**: you followed the records and got the same answer
- **fix**: it's wrong or missing something a player needs; give the corrected value and the record that shows it
- **unsure**: the records don't settle it; say what would

Every verdict's note names the record and what it showed, in a few words ("day: the 8 am sandbox package is conditioned on rain; the reader missed the condition"). A note that would fit any person isn't a check. Read the AI packages in the order the game runs them: the first whose conditions pass is what they do, so a quest-gated "stay put" package at the top beats everything below it while it holds.

Then write the corrected person object (the reader's object with your fixes applied, anything unsettled moved to `unsure`). No record ids, editor ids or plugin file names in any text a player reads; ids go in `evidence`.

Save to the path you are given as `{"checks": [{"id", "verdicts": {field: {"verdict", "note"}}}], "people": [corrected objects]}` and reply with the path and one line: how many fields you fixed.

Working files: keep any scripts you write in `/tmp/pc<your batch>/` (outside the repo).
