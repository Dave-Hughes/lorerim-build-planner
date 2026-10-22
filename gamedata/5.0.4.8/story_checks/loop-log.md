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
