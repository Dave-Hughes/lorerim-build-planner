# Quest reads: the checker's brief

Another reader wrote answers for a batch of LoreRim 5.0.4.8 quests, following `gamedata/5.0.4.8/quest_reads/BRIEF.md` (read it first). Your job is to check every answer against the same game records, independently, as if you might find them wrong. You didn't write them and you owe them nothing.

Read only what the reader was allowed to read (the `*_raw.json` files) plus the reader's batch file you are given. Same exclusions: no `quests.json`, `quest_truth*.json`, `overrides.json`, `story_checks/`, `src/`, `docs/`, no web, no memory of Skyrim for facts.

For each quest, for each of `canDo`, `needs`, `starts` (who, where, how), `firstStep`, `takesYou`, `choices`, `rewards`, `opens`, `closes`:
- **agree**: you followed the records and got the same answer
- **fix**: it's wrong or missing something a player needs; give the corrected value and the record that shows it
- **unsure**: the records don't settle it; say what would

Two rulings from Bob, 23 Oct, after the first ten batches:
- **Don't empty a field a player needs just because the records only point at the answer.** An item, spell or gold named by the quest's own script properties (a reward property, a `Reward…` or the item the last stage hands over) stays in `rewards`, with an `unsure` note saying it's from the script and not confirmed. A likely giver (the one every sister job uses) goes in `unsure` with the name, so the page can say "probably Fura Bloodmouth". Remove only what the records contradict or what nothing in them supports.
- **"Radiant" is fine; "repeatable" needs a record.** Leave `canDo: "radiant"` alone; drop "repeatable" or "repeats" unless the records show it.

Then write the corrected quest object (the reader's object with your fixes applied, and anything unsettled moved to `unsure`).

Save to the path you are given as `{"checks": [{"edid", "verdicts": {field: {"verdict", "note"}}}], "quests": [corrected objects]}` and reply with the path and one line: how many fields you fixed.

Working files: keep any scripts you write in `/tmp/c<your batch number>/` (outside the repo), never loose in a shared folder: other readers run at the same time.

No record ids, editor ids or plugin file names in any text a player reads, `unsure` notes included ("the records place him in the Red Wave", not "Skyrim.esm:01328D"). Ids go in `evidence` only.
