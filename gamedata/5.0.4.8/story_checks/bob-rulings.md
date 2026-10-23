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
