# The quest loop's log (WO-132)

What each batch did, written as it went. The report at the end is `loop-report-2026-10-22.md`.

Started 22 Oct 2026, 06:37, on staging at 1892d0e: 452 of 1,242 quests not yet checked, after the night run. Of those 452, 442 have no starter in their records or scripts, and the other 10 are started only by the Unofficial Patch's update helpers, which Bob has ruled aren't ways in. So no unchecked quest has a starter the existing tools can read. The loop runs as written anyway: each batch's quests are compared with UESP (base game and DLC) or the records alone (mods), and every one the records can't settle goes on the needs-Bob list with both readings.

Before the batches: WO-132's step 1 needs WO-131 Part 1 (where the thing you read is), which wasn't built. `scripts/gamedata/readables.py` now writes `readables-2026-10-21.json` and `.md`: 63 read-this items, each with every place the item is (placed in the world, in a container, carried, on a leveled list) or "nowhere found" (27; a courier or script that hands an item over isn't read yet).

## Batch 1 (unchecked 1 to 40)
- 40 quests: 21 base game or DLC (UESP read by a subagent), 19 from mods (records only).
- Key rows added: 0. None of the 40 has a starter in the records, so none can agree with UESP; all 40 are on the needs-Bob list (100%).
- Needs-Bob reasons: 20 with no starter in the records; 13 set only by a quest the line puts after them (the check counts those as catch-ups, so it may be the line's order, not the records, that hides the start: A New Order is set by Bloodline's stage 30, which UESP describes as its start); 2 started only by patch helpers; 5 with starters the check can't name.
- Gate: `build.py`, 201 game-data tests and the answer key pass; no generated file changed.
- Rex (fresh, on A New Order, Containment, Animal Pelt Collection, Bounty: Book): placement right for all four, but three entries left out records Bob needs (the second objective and its stage; the winning plugin; each starter's record id; the quest's own conditions; Containment's Revealing the Unseen call, and its second reason). Fixed once in the list's generator, for every entry.
- Rex's re-check: A New Order and Animal Pelt Collection pass. Containment didn't: its helper lines carried "through USKPRetroactive205's process", which Rex read as the generator copying the last line's context. It isn't. It's the start check's own record in `college.json`: the version tracker calls each retroactive helper's `process`, and the call on MG05 is inside it. The `.md` Rex compared against leaves that out. WO-132 allows one fix, so the tag now reads "the call itself sits in USKPRetroactive205's process function, which this script calls", and Containment stays on the needs-Bob list, where it already was.
- Committed and pushed as batch 1.

## Between batches: WO-131 Part 1
Pushed on its own (7f01832), as Dave asked. `readables.py` now also covers reads that move a quest to its second step, names the three nearest doors that lead somewhere named for each placed copy, and finds quest scripts that hand an item over. That's 79 items, 11 handed over and 26 still found nowhere. Running Wild's note: Whiterun, nearest doors Hearth-Healer's Hall and Joslin's House (22 m each) and The Bannered Mare (27 m).

## Batch 2 (unchecked 41 to 80)
- Bob's ruling on the night run (74d2b81) made Dragonborn's DLC2Init no way in. March of the Dead lost its only starter and joined the unchecked list (453 now). It's in this batch, and DLC2Init is counted with the patch helpers in the needs-Bob reasons. Its UESP reading is the one Bob recorded in `openings-judged-2026-10-21.json`.
- 40 quests: 12 base game or DLC (UESP read by a subagent, with batch 1's), 28 from mods (records only).
- Key rows added: 0; all 40 on the needs-Bob list (100%). Cumulative reasons for the 80: 45 no starter, 25 set only by a quest the line puts after them, 3 started only by helpers Bob ruled out, 7 with starters the check can't name.
- Gate: `build.py`, 208 game-data tests and the answer key pass; no generated file changed.
- Rex (fresh, on March of the Dead, Black Book: Untold Legends, Sleepwalking Into A Nightmare, Windhelm By The Sea): placement right for all four. Three entries needed more. Fixed once in the generator, for every entry: a starter keeps its stage; a catch-up with no stage says so; the first objective's target and where it's placed; any existing answer-key row; and the mod line no longer says "no way in" when it lists starters.
- Rex's cross-cutting find: **five answer-key rows belong to quests the planner marks "not yet checked"**. They are Black Book: Untold Legends, The Kagrumez Gauntlet, Silenced Tongues, Yngol's Barrow and Sleepwalking Into A Nightmare. The key test passes because it only compares the giver and first step, not `checked`. Bob: should a key row count as checked, or should the test ask for `checked: files`?
- Rex's re-check: Black Book: Untold Legends and Windhelm By The Sea pass. Sleepwalking still lacked the records' own "aaaMBRalfornDialogue is started by nothing in the records or scripts". It was already on the needs-Bob list, so the one-fix rule is met. The clause is generated from the records, so every helper starter now says what starts the helper, or that nothing does.
- Committed and pushed as batch 2.

## Batch 3 (unchecked 81 to 120)
- 40 quests, all Missives (Missives.esp), records only. Key rows added: 0; all 40 on the needs-Bob list (100%): the records hold no starter (a notice-board job's start isn't one the check reads).
- Gate: `build.py`, 208 game-data tests and the answer key pass; no generated file changed.
- Rex (fresh, on four Eastmarch Missives quests): PASS for all four. Its follow-ups, not about starts: the Gather quest's counter shows "(0/0)" on its page, and the list prints the plugin twice in the id.
- **Stop:** three batches in a row put more than 30% on the needs-Bob list (100% each). Report written: `loop-report-2026-10-22.md`.
