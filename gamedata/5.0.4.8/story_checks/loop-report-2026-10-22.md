# The quest loop's report (WO-132), 22 Oct 2026

Run by the PC from 06:37 on staging at 1892d0e. The log, batch by batch, is `loop-log.md`; the list for Bob is `needs-bob.md`.

## Why it stopped
**Three batches in a row put more than 30% of their quests on the needs-Bob list: all three put 100%.** In WO-132's words, that means the rules are wrong, not the data. The other stop conditions didn't come up: 333 quests are still unchecked, no check failed, and the loop ran well inside eight hours.

What I saw, below, is why every batch will keep doing this until the rules or the tools change. Missives alone is 364 of the 453 unchecked quests.

## Quests checked, before and after
- Before: 790 of 1,242 had a checked start (452 not yet), after the night run.
- Bob's ruling on the night run (74d2b81, pushed by Mac during the loop) made Dragonborn's DLC2Init no way in. That left March of the Dead with no starter: 789 checked, 453 not yet.
- After: **789 of 1,242**, unchanged by the loop. 120 of the 453 have been through it and are on the needs-Bob list with both readings. The other 333 weren't reached.

## Rows added to the answer key
**None.** A key row needs the records and UESP to agree, and none of the 120 has a starter in its records that a player uses. The key still passes in full, and no existing row was touched.

## What I saw
Of the 453 unchecked quests, 443 have no starter in their records or scripts as the start check reads them. The other 10 are started only by helpers Bob has ruled aren't ways in. So the existing tools can't settle any of them, and the loop can only list them. The 120 it listed fall into four kinds:
1. **The line's order hides the start (25).** The quest's stage is set by another quest the line lists after it, and the check counts any later quest's call as a catch-up, not a start. Often that quest comes first in the story:
   - A New Order is set by Bloodline's stage 30, which UESP describes as its start.
   - Unseen Visions is set by Seeking Disclosure, Under Saarthal by First Lessons' successors, Containment by Revealing the Unseen.
   - Gift of Saturalia's side quests are started by their hub quest.

   A rule could settle most of these: a later quest's call is a start when it comes from a stage that ends that quest, or when the quest it sets has no other starter. That's a new rule, so it's Bob's call.
2. **Boards, radiant jobs and the like (85, under "no starter").** Missives (364 of the 453 unchecked quests: 41 in these batches, 323 after them) and the Vigilant bounties (18) start from a notice board, a story manager event or a radiant dispatcher. Their placed reference or script isn't one the check reads, so the records as read hold no way in. This is a tool gap, not a data gap.
3. **Helpers Bob ruled out (3):** Purity of Revenge and Glory of the Dead (the Unofficial Patch's update helpers), and March of the Dead (DLC2Init). Containment has them too, but it's filed under the line's order, because Revealing the Unseen also sets it.
4. **Starters the check can't name (7):** the Thieves Guild's five city jobs (Under New Management, Silver Lining, The Dainty Sload, Imitation Amnesty, Summerset Shadows), A New Source of Stalhrim (a misc helper's stage 200 starts it), and Sleepwalking Into A Nightmare (a helper nothing starts).

## The needs-Bob list, grouped by reason
All in `needs-bob.md`. Each entry has the quest, its record ids and winning plugin, every starter with its source, its own conditions, its first two objectives with their stages, the first objective's target, the catch-up calls, any answer-key row already there, and UESP's reading (base game and DLC) or "records only" (mods).
- Only a quest the line puts after it sets its stage: 25
- The records hold no starter: 85
- Only helpers Bob ruled aren't ways in start it: 3
- The check found starters it can't name: 7

**Also for Bob:** five answer-key rows belong to quests the planner marks "not yet checked": Black Book: Untold Legends, The Kagrumez Gauntlet, Silenced Tongues, Yngol's Barrow and Sleepwalking Into A Nightmare. The key test passes because it only compares the giver and the first step. Should a key row count as checked, or should the test also ask for `checked: files`?

## Every rule or file changed
- `scripts/gamedata/readables.py` (new): WO-131 Part 1, which WO-132's step 1 needs. Pushed with batch 1, then again on its own (7f01832), with the nearest doors and script handovers. It writes `readables-2026-10-21.json` and `.md`: 79 items, 26 found nowhere.
- `gamedata/5.0.4.8/story_checks/needs-bob.md`, `loop-log.md` and this report: new.
- No rule changed. No change to `quest_pages.py`, `story_check.py` or the answer key, and no generated file changed (`build.py` left `quests.json` as it was each time).
- The list is written by a script outside the repo (the PC's scratch folder), from each batch's check rows and the UESP readings; nothing in it is hand-typed per quest.

## Batches undone
None. Every gate passed: `build.py`, the game-data tests (201, then 208 after Mac's commits) and the answer key.

## What the reviewer sent back, and what I did
A fresh Rex reviewed four quests a batch, given only the records, UESP and the planner's output.
- **Batch 1** (A New Order, Containment, Animal Pelt Collection, Bounty: Book): placement right for all four. Three entries left out records: the second objective and its stage, the winning plugin, each starter's record id, the quest's own conditions, and Containment's Revealing the Unseen call. I fixed these once, in the generator, for every entry.

  On the re-check, Containment's helper lines carried "through USKPRetroactive205's process", which Rex read as copied context. It isn't: it's in the check's own JSON (the version tracker calls each helper's `process`). I reworded it to say so, and Containment stayed on the list.
- **Batch 2** (March of the Dead, Black Book: Untold Legends, Sleepwalking Into A Nightmare, Windhelm By The Sea): placement right for all four. The entries needed each starter's stage, the first objective's target, any answer-key row already there, and a mod line that doesn't say "no way in" when it lists starters. Fixed once, for every entry.

  On the re-check, Sleepwalking still lacked "nothing starts its helper". It was already on the list; I added the clause for every helper starter. Rex also found the five key rows on unchecked quests above.
- **Batch 3** (four Eastmarch Missives quests): PASS for all four. Two follow-ups outside the start decision: the Gather quest's counter shows "(0/0)" on its page, and the list prints the plugin twice in each id.

## Done when
- The loop ran until a stop condition (three batches over 30%), and this report says which.
- 120 quests are on the needs-Bob list with both readings, and this report says why the loop stopped before the other 333.
- The answer key passes in full; no rows were added.
- Every check in CLAUDE.md: see the last commit.

## Second run, after WO-136 (22 Oct)
**Why it stopped:** no quest was left to take. Every one of the 1,242 is checked, or on the needs-Bob list with both readings. That's a stop other than "the rules are wrong".

**Checked before and after:** 789, then **1,202 of 1,242**: 836 from the files, 364 as jobs from a board, and 2 from the answer key.
- **The board reader** (`boards.py`) traced all 364 Missives jobs and the 22 Vigilant bounties, plus dungeon kick-off triggers.
- **Bob's ruling 1** settled 23, among them A New Order, Unseen Visions and Containment.
- **The key** settled 2 (ruling 2, Mac's).
- **Following a helper back to the object that starts it** settled 2: Sleepwalking and A New Source of Stalhrim.

**Rows added to the key: 4**, each where the page and UESP agree on the person and the first step: The Bloodstone Chalice, Unseen Visions, Containment, and Where You Hang Your Enemy's Head.

**The needs-Bob list, now the 40 still not checked:**
- 29 with no starter the check reads.
- 3 started only by helpers Bob ruled out.
- 5 the check can't name: the Thieves Guild's city jobs.
- 3 set only by later quests, where rule 1 doesn't settle it.

Most of the 29 start from a talk that hands you a note (Viriya's fishing jobs; Whiterun's steward for In the Shadows), or from reading a Black Book where it lies. Reading those two is the next tool, if Bob wants it.

**Rules and files changed:**
- New: `boards.py` and `story_checks/boards.json`.
- `story_check.py`: board starts, ruling 1, and a helper's board start followed back.
- `quest_pages.py`: board ways worded from their places. An unnamed trigger is a way in only when nothing else starts the quest. Mac's board class also covers a job whose every start is a board, with the boards the records place, and a board job gets no raw form for the open-or-locked judge. Rule 1's first step also reads a later quest's starting call.
- Tests: `test_story_check.py`, `test_quest_pages.py` and `test_quest_truth.py`. Mac's `wo136.test.ts` was changed for the new reads.

**Batches undone:** none.

**What the reviewer sent back:** on batch 4 (Silver Lining, No Contest, Battle of the city, Memory Guide), placement was right for all four. Two fixes went into the generator for every entry:
- Creation Club quests are compared with UESP.
- Every catch-up caller is listed, with why rule 1 wasn't applied.
