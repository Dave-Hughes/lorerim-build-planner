# Bob's rulings, as they come (WO-138)

Jeff reads this file at the start of every batch (`git pull` first) and applies anything new. Bob adds a ruling within a batch of Jeff setting a quest aside. Newest at the bottom; each names the quests it touches so a rerun is one batch.

## 23 Oct, 07:40
- The Part 3 rulings in `docs/work-orders.md` (R1 to R4, G1 to G6) are the first entries here. Apply them as written.

## 23 Oct, 08:05, on 416bf54 (decisions D0 to D9, batches 1 to 4 re-sorted)
- **D0 to D9 stand.** Rex's three rounds were right and the fixes are right. Nothing overturned.
- **Hold the "no row until Mac" quests as rows, not notes.** The 8 under D5 (G2) and the 13 under D4 (G4) are only named in the decisions file. Write each as a row in `quest_truth_loop.json` with its expected giver (none, or UESP's) and first step, marked `waitingOn: "G2"` or `"G4"`, so `test_quest_truth.py` flips them green the moment Mac's Part 4 lands and nothing has to be re-added by hand.
- **The three Vigilant guides (Stendarr Guide ×2, Memory Guide): no-giver, start by themselves.** They are trackers the line's quests fill in, not quests a player goes and starts. Way in: "It starts by itself during Vigilant: <the first quest whose stage sets it> sets its stages" (zzzBMGuide: Remnants, stage 80; zzzCOGuide: Child of Oblivion, stage 60; Memory Guide: the Memory quests, from Johan the Fool). `checked: files`, a `noGiver` row each, first step the records' own. The line lists each guide after the quest that first sets it. Off the needs-Bob list.
- **The Path of Knowledge: no giver; after The Fate of the Skaal; `sentBy` Storn Crag-Strider; first step "Talk to Neloth" (both agree).** Its only starter is DLC2MQ03's script, so this is G2's form; Frea is the page's mistake (Mac's G2 drops her). A `noGiver` row waiting on Mac. Off the needs-Bob list.
- **The 18 with no starter and no page (Part 1's leftovers):** handlers and holders (Durnehviir's handler, the Civil War's three objective holders, Animal Pelt Collection) are G5 background, out of the pages and the log. In the Shadows, Boethiah's Bidding, The Lost Verse, First Catch and the nine mod quests stay "not checked" with both readings; that is the right answer and costs nothing. Nothing more to do on them this run.
- Carry on from batch 5.

## 23 Oct, 08:30, on 715ced5 (batch 5: Civil War, Daedric; decisions version 4)
- **Version 4 stands,** with one refinement to G2/D5, below. Rex's three catches (a page with several stage tables, every starter counted, one rule for one shape) are right.
- **G2 is for a quest a player plays. A handler isn't one.** G2 ("After <that quest>", no giver) applies when the quest that sets this one's stage is a quest the player plays: it shows objectives, and it has ended or passed a visible stage. When the only setter is a handler or umbrella quest with no objectives, running from the game's start (CW00 and its kin, the favour handlers), that is R1's shape: the talk is the way in and its speaker is the giver. So:
  - **Joining the Legion: Legate Rikke, Castle Dour. Joining the Stormcloaks: Galmar Stone-Fist, Palace of the Kings.** Both are key rows, passing now, and UESP agrees. Not G2.
  - **The Jagged Crown (both) and Message to Whiterun stay G2:** Joining the Legion and The Jagged Crown are quests a player plays. `sentBy` Tullius or Galmar; first step as the records.
  - The same test settles the earlier G2 list: Bloodline, Chasing Echoes, Alduin's Wall and the rest are set by played quests and stay G2. Reparations is set by `TGBanToggle`, a handler: R1's shape, "Ask Mercer, Brynjolf or Delvin", with the need "after the Guild bans you" as Jeff noted.
- **Radiant templates named by alias text are a class, not quests.** "The Battle for the fort", "The name location", "Attack the capital", "Defend the capital", "Battle for the city", "Rescue from the attack point": a player never sees those titles. Show them once under the Civil War line as the boards are shown ("The war's radiant jobs: fort sieges, city battles, rescues; each is handed out by your side's commander"), `checked: files` as a class, and out of the per-quest lists and the quest log. Mac, with the Missives class as the model. Off D7's files-only count.
- **The 08:05 rulings weren't in this batch** (the guides, The Path of Knowledge, holding the until-Mac quests as rows). Apply them at the start of batch 6 along with this.
- Carry on.
