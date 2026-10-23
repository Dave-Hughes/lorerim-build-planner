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

## WO-136: boards, Bob's rulings 1 and 2, the rerun (22 Oct)
- **Boards and dispatchers:** `scripts/gamedata/boards.py` (new) finds every placed object whose script holds a quest (directly, or through a form list) and calls Start or SetStage on it, with every place a copy stands. It writes `story_checks/boards.json`, and the start check reads it as a "board" start when the call is Start or sets the stage that shows the first objective.
  - **Missives:** a trigger by each hold's notice board (`_M_ActivatorScript`) starts that hold's jobs at random from its form lists when you walk up; picking up the missive sets stage 20.
  - **Vigilant bounties:** an activator (`AoMRQTriggerScript`) by the Temple of Stendarr in Stuhn Ravine.
  - The call has to be made on the property holding the quest (a scene's Start doesn't count), and a trigger with a prerequisite stage is no start.
  - On the pages, an unnamed trigger is a way in only when nothing else starts the quest. So Unbound and Skirmish at Whitewatch don't get a generic trigger beside their talks.
- **Ruling 1** (`story_check.py`): a later quest's call is a start when it comes from a stage that ends that quest, or when nothing else starts this one. Helpers Bob ruled out and the start-game flag alone don't count as something else. Rule 1's first step now also reads such a call's stage. A New Order: Bloodline's stages 30 and 190 set 20, "Speak with Isran".
- **Ruling 2** (`quest_pages.py`): a quest with an answer-key row is checked, with `checkedFrom` (uesp or records) and the key's `url`. `test_quest_truth.py` checks no key row sits on a "not yet" quest.
- **Also:** a helper started by a placed object is followed back (DLC2StartSVQuests starts A New Source of Stalhrim's helper when you leave Skaal Village). An NPC with no name takes its template's, as before. `test_quest_pages.py`'s no-editor-id test skips a `url`.
- **Rerun:** all 152 lines (09:06 to 11:48, none failed; one earlier start was stopped and restarted after two fixes, so no line mixes code). Then `build.py`.
- **Checked starts: 1,202 of 1,242, up from 789.** By what: a board 386 (the 364 Missives jobs, the 22 Vigilant bounties, and dungeon kick-off triggers); ruling 1 23 (A New Order, The Bloodstone Chalice, Unseen Visions, The Temple of Miraak, Under Saarthal, Containment, Rapture of the Deep, Where You Hang Your Enemy's Head and 15 more); ruling 2 2 (Black Book: Untold Legends, The Kagrumez Gauntlet); a helper followed back 2 (Sleepwalking Into A Nightmare, A New Source of Stalhrim). No quest lost its check. 40 are still not yet checked.
- **Key rows added (4), each where the page and UESP agree on person and first step:** The Bloodstone Chalice (no single giver), Unseen Visions (Dexion Evicus), Containment (Mirabelle Ervine), Where You Hang Your Enemy's Head... (Nazir), each `source: uesp` with the page. A New Order agrees on the first step, but its page names no one where UESP names Isran, so it isn't added.
- **Ruling 5, the hand traces:** the Thieves Guild's five city jobs come from TGRShell. Its `TGRadiantCount` sets 160/170/180/190 after five jobs in Whiterun, Solitude, Windhelm or Markarth, and the next stage (162 to 197), whose fragment starts the special job, is set by something the scripts don't name, likely a talk of TGRShell's own (Delvin). A New Source of Stalhrim's helper is started by `DLC2StartSVQuests` when you leave Skaal Village. Sleepwalking's helper aaaMBRalfornDialogue is started by nothing any script names.
- **Merged with Mac's WO-136 part (rebased on cfdca12 and after).** Mac's rule 2 (`from_key`: `checked: "uesp"` with `source` UESP or Nexus) replaces mine; mine is dropped. His class for jobs from a board (ruling 3) now also covers a job whose every start is a board, since `boards.py` traces each Missives job to its hold's board. The class's `boards`, null by hand, are filled from the records: Ben Erai, Dawnstar, Falkreath, Markarth, Morthal, Raven Rock, Riften, Solitude, Stonehollow, Whiterun, Windhelm and Winterhold. A board job gets no raw start form, so the open-or-locked judge doesn't read the board's words as a need. A board way on a page is worded from its places, never "the door to somewhere in Skyrim".
- **Mac's tests changed for the new reads:** `test_quest_truth.py` and `wo136.test.ts` used Yngol's Barrow, Silenced Tongues and Sleepwalking Into A Nightmare as quests only the key settles. The board reader and helper follow-back now trace those from the files, so the key-only examples are Black Book: Untold Legends and The Kagrumez Gauntlet. The Missives class now expects the 12 boards, not "isn't checked yet".
- **After the merge:** 1,202 of 1,242 checked (836 from the files, 364 as jobs from a board, 2 from the answer key), 40 not yet. Python 217, typecheck, lint, `npm test` 527, the questions test (11) and the build pass; e2e isn't run on this PC.

## Batch 4 (WO-136's restart: the 40 still not checked)
- After the rerun, 40 quests are "not yet": every quest the start check, the boards, rule 1 and the key don't settle. One batch, so this is the last.
- 40 quests: 19 base game or DLC and 9 Creation Club (UESP read by a subagent; Creation Club is now compared with UESP, after Rex), 12 from mods (records only).
- Key rows added: 0; all 40 on the needs-Bob list:
  - 29 with no starter: Durnehviir's handler, Animal Pelt Collection, the Civil War's three objective holders, The Lost Verse, Boethiah's Bidding, A Grand Venture, Bury Valen Dreth, the Black Books (The Font of Memory, The Winds of Change, The Sallow Regent, Filament and Filigree, The Hidden Twilight, Whispers of the Veil), Grace of Kynareth, Farmland Saga, On Hogithum, In the Shadows, Fear and Loathing, With Love, Eilonwy, Part 2, and the fishing quests (Beneath Bronze Waters, Clear-Headed, Spirits Away, Private Lessons, No Contest, The Ultimate Feast, Heart of Gold, First Catch).
  - 3 started only by helpers Bob ruled out: Purity of Revenge, Glory of the Dead, March of the Dead.
  - 5 the check can't name: the Thieves Guild's five city jobs.
  - 3 set only by later quests, where rule 1 doesn't settle it (no call sets the first objective's stage): the Vigilant's Stendarr Guides and Memory Guide.
- What most of them have in common: the fishing jobs and In the Shadows start from a talk that hands you a note (Viriya; Whiterun's steward), and the Black Books from reading the book in a place. The check doesn't see either: the talk is in a topic of another quest, and the book's script isn't a "read" one.
- Gate: `build.py`, 218 game-data tests and the answer key pass.
- Rex (fresh, on Silver Lining, No Contest, Battle of the city, Memory Guide): placement right for all four; Silver Lining and Battle of the city pass. Fixed once, in the generator, for every entry: Creation Club quests are compared with UESP (No Contest had none); every catch-up caller is listed (Memory Guide had nine, the list showed eight); and each entry in the line's-order group says why rule 1 wasn't applied.
- Rex's re-check: No Contest and Memory Guide pass.
- **Stop:** no unchecked quest is left that the loop hasn't taken. Every one of the 1,242 is checked or on the needs-Bob list with both readings. That's a stop other than "the rules are wrong".

## WO-137: the PC check (22 Oct)

**Item 1, Deathbrand: which are ways in and which are catch-ups.** Read from the records and scripts, then checked against UESP's Deathbrand page.
- **The start is silent.** Deathbrand reaches stage 10 one of two ways, and neither shows anything in the journal:
  - when you arrive on Solstheim (DLC2Init stage 100), if your level is at least `DLC2dunHaknirTreasureQSTMinLevel`;
  - otherwise, on the first level-up that reaches that level (`DLC2dunHaknirTreasureNodeSHARES` starts the helper `DLC2dunHaknirQSTIncreaseLevel`, which sets 10).
  - The global is **20** in LoreRim. UESP says 36 (vanilla).
  - The DLC2Init check is inside its script, so the start check didn't record it: its row reads only "SetStage 10".
- **Stage 20 means "the pirates are at Haknir's Shoal".** Stage 10's fragment polls. As soon as you are neither at Haknir's Shoal nor near its boss, the quest sets 20, and that stage puts the pirates there, with the map and a copy of the book on the boss. For a player, "stage 20 done" means the level gate has passed. It doesn't mean they've been to the shoal.
- **Reading Deathbrand is a way in.** The book's script (`DLC2dunHaknirBookScript`) sets stage 1 only when `myPrereqStage` 20 is done. Stage 1 gives the "Search for the treasure of Haknir Death-Brand" objective and the map marker. So: a way in at level 20, which matches UESP's "once you have reached level 36, reading the book will start" (with LoreRim's 20). Our row and the page show "Read Deathbrand" with no level.
- **Geldis Sadri's rumour:**
  - **Dragonborn.esm:** a second way in under the same gate. It needs stage 20 done and stage 1 not done, then sets 1. UESP agrees ("also possible to initiate the quest by asking about the latest rumors").
  - **TheChoiceIsYours.esp wins this line.** It swaps "stage 1 not done" for "stage <= 1". That can't be true while stage 20 is done (the quest is at 20 until something sets 1). So in this load order Geldis's line only shows after you've already read the book: a **catch-up**, not a way in. The planner shouldn't offer it as a start. Dave could check it in game: at level 20+, with the book unread, Geldis shouldn't have the line.
- **Walking into Haknir's Shoal is a third way in.** Taking the map from the pirate boss sets 30 ("Use the Deathbrand Treasure Map"), and opening the chest first sets 29 ("Learn more about the buried treasure"). Both need the pirates there (stage 20). The check lists taking the map only as the second step.
- **What the page says** (after Mac's e874f10, which landed while this ran): "Read Deathbrand; It starts by itself when you level up (Level 20)", with Geldis dropped as a catch-up. That agrees with the records. Still open:
  - "when you level up" is the gate, not a way a player takes;
  - "Read Deathbrand" has no level, though the book's script needs the gate (stage 20);
  - finding the pirates at Haknir's Shoal isn't listed.

**The sweep: ways that need the quest's own later stage, or a level held in a global.**
- Read every checked start (`checked` files or uesp) with its helpers followed back, and matched each talk to the page's way by its prompt.
- Counted:
  - a condition naming the quest's own stage at a stage above 0 (`done`, `==`, `>=`, `>`), leaving out the not-started tests (`<`, `<=`, `not done`);
  - `level >= <global>`;
  - and, new, a book whose script checks a prerequisite stage before it sets one.
- 138 ways. Against the pages after Mac's e874f10, 68 quests show at least one without the condition. Full list: `story_checks/wo137-sweep-2026-10-22.md`.

| | shown with it | shown as "a condition the planner can't put in words yet" | shown without it | not a way on the page |
|---|---|---|---|---|
| the quest's own later stage | 0 | 29 | 67 | 18 |
| a level held in a global | 14 | 0 | 0 | 5 |
| a book's prerequisite stage | 0 | 0 | 5 | 0 |

- Before e874f10 the level row was 8 / 0 / 6 / 5, and the own-stage row was 0 / 29 / 69 / 16. Mac's commit fixed the six level ways (Deathbrand, Dragonborn's four cultist ambushes, I Done Got Thaned!) and dropped two catch-up talks: Geldis's (Deathbrand) and Vigilant Tolan's (Awakening, stage 10 done).
- **Own later stage (96 shown):** nearly all are the giver's "I'll do it" line in a quest a script or the story manager already started at 5 or 10: the Rift's odd jobs, Raven Rock's and Tel Mithryn's favours, Meridia's Order, the Fists of Fury, Reparations, Unearthed (Ralis's lines at 10, 14, 20 and 40). The talk moves the quest to its first objective, so by Bob's rule it's the step, not the start. The page shows it as a start with no condition (67) or an unworded one (29). Mac's new rule drops a talk that needs a later stage than the one it sets, and these set a later stage than they need, so they stay. Battle of the Champions (stage 20 done) and Kyne's Sacred Trials (15 and 20 done) still show talks that need a stage the player reaches by playing first, as Geldis did.
- **Books with a prerequisite stage (5):** Deathbrand (stage 20), Letter to Lucien (The Oblivion Engine stage 5), and Wyrmstooth's Miner's Warning, Ja'Shavi-Dar's Note and Dunyick's Request (stage 0 done, so the quest must already be running). The start check doesn't read the prerequisite at all; it's in the book's script properties.
- **Not read:** a level or stage check inside a script fragment, like DLC2Init's level check above. The sweep reads conditions and script properties, not branches in code.

**Item 6, the nearest named place for "somewhere in" triggers (fix (a)).**
- `boards.py` now reads every map marker. For a placed trigger in an unnamed open-air cell, `readables.near_place` writes the nearest named marker (`nearPlace`) and the nearest town (`nearTown`, a City or Town marker as in `places.py`), each with its distance in metres.
- `boards.json` gained only those two fields; nothing else changed. They reach the line files on the next start-check rerun; the site data is untouched.
- **Paragliding's three triggers:**
  - Paragliding.esp:00802D is 2 m from the mod's own **Flight Platform** marker.
  - :008021 and :009060 are 31 m and 32 m from **Peak's Shade Tower**; the nearest town marker is Lakeview Manor, about 260 m away.
  - The paraglider itself (:008032) is 7 m from Flight Platform.
  - The places index puts Flight Platform's and Peak's Shade Tower's neighbours in Falkreath hold, which matches Dave's "near Falkreath".
  - Flight Platform's marker uses a town icon, so it also comes out as the "nearest town". Mac's wording should say the hold or the place, not "town".
- **Every other trigger that says "somewhere in":**
  - 973 distinct triggers say "somewhere in Skyrim" (79 quests, mostly the Missives boards' trigger boxes). 944 now have a nearest place.
  - The 29 without one are MQ204's sky-fog triggers, in a worldspace with no named marker.
  - On the pages, Paragliding is the only start worded with nothing but "somewhere in Skyrim". The others already have a door ("by the door to Storage Room") or a named cell. The Stuhn Ravine bounties are 5 m from the Temple of Stendarr marker, and Victory Celebrations' Whiterun triggers are 41 to 60 m from Jorrvaskr.
- Readables (a book "in a chest somewhere in Whiterun") aren't triggers and don't get the field yet. The same helper fits them if Bob wants it.
- Tests: `BoardsTest` covers the helper on made-up markers (nearest named place, nearest town, nothing for a named cell or an interior) and Paragliding's three triggers in the built file.

## WO-138 Part 1: the last 40 (23 Oct)

**19 settled.** Each one is a hand trace of the records that agrees with UESP, now a key row (`source: uesp`) with the trace in its notes. The start check reads none of these four patterns, so each is listed for a later rule.

- **The seven fishing jobs** (Beneath Bronze Waters, Clear-Headed, Spirits Away, Private Lessons, No Contest, The Ultimate Feast, Heart of Gold).
  - `ccBGSSSE001_MiscQuests` holds them in an array property, `miscquests`, with Viriya as its alias.
  - Viriya's talk gives you a bounty letter (`GivePlayerBountyLetterForQuest`). Reading it calls `SetBountyLetterWasRead`, which starts the job at that index of the array.
  - The check doesn't follow a quest taken from an array.
- **The four Dragonborn Black Books** (The Winds of Change, The Sallow Regent, Filament and Filigree, The Hidden Twilight).
  - Each book (Dragonborn.esm:01E99C to 01E99F) carries `DLC2BlackBookScript`, with `myQuest` set to its quest and `myQuestStage` 10.
  - When you read it, `DLC2BookDungeonController.ReadBook` sets that stage.
  - The call sits in the controller, not in the book's own script, so the book reader misses it.
- **The Thieves Guild's four city jobs.**
  - Delvin Mallory's lines (INFO Skyrim.esm:09DD57 to 09DD5A) need TGRShell stage 160, 170, 180 or 190 done (five jobs in Whiterun, Solitude, Windhelm or Markarth).
  - Each line sets 162, 172, 182 or 192. That stage's fragment sets Imitation Amnesty, The Dainty Sload, Summerset Shadows or Silver Lining to stage 10.
  - The fragments reach the job through a property on TGRShell's own script (`kmyQuest.pTGTQ0xQuest`), which the check doesn't follow.
- **Under New Management.**
  - `TGRShellScript.TGLeaderCheck` sets TGRShell stage 197 once four city jobs are done and Darkness Returns is complete. Stage 197 starts it by itself.
  - Rex caught my first row naming Brynjolf as giver. UESP has no giver, and Brynjolf is only the first step, so the row is now a no-giver row.
- **From the wiki, as the order says:** Purity of Revenge, Glory of the Dead and March of the Dead. The records start these only from helpers Bob ruled out (USSEP's update helpers; DLC2Init on arriving at Solstheim).

**21 stay on the needs-Bob list, with both readings:**
- In the Shadows: its first objective, "Speak to the Jarl's Steward", shows at stage 0, and nothing in the records starts it, so they can't confirm UESP's start.
- No UESP page: the Durnehviir handler, Animal Pelt Collection, the Civil War's three objective holders, The Lost Verse, First Catch.
- Boethiah's Bidding: unfinished content, on UESP's Unfinished Quests page only.
- Mod quests with no second source: A Grand Venture, The Font of Memory, Bury Valen Dreth, Whispers of the Veil, Grace of Kynareth, Farmland Saga, On Hogithum, Fear and Loathing, With Love, Eilonwy Part 2.
- The Vigilant's three guides: a mod, so there's no UESP page to decide them with.

**Checked starts: 1,221 of 1,242**, up from 1,202: 1,200 from the files and 21 from the key.

**Rex (fresh, on No Contest, The Winds of Change, Imitation Amnesty, Under New Management):** CHANGES NEEDED on all four.
- **Fixed once:** Under New Management's giver (above).
- **Not mine to fix in the loop** (quest_pages' wording, which WO-132's limits keep me out of). A start the key confirms keeps the check's leftover ways:
  - "Through Thieves Guild Radiant Shell" shows as a way and a need on the five Thieves Guild quests. It's an internal quest's name.
  - "No one gives it" is the only way shown for a book read in a place. It should say which book and where (Raven Rock Mine).
  - No Contest has no "after Heart of Gold". Viriya hands the letters in her array's order, which matches UESP's chain.
  - Rex's point: `checked: uesp` says the giver and first step are confirmed. It doesn't mean the page's ways and needs are complete.
  - These are for Mac (wording) and Bob (whether a key-only start needs its own ways). Listed in the report.

## WO-138 Part 2: every checked start against UESP

- **The universe:** checked (`files`) base-game, DLC and Creation Club quests not already in the key, in the order main, guilds, Daedric, lands, side, followers. That's 345 quests in 9 batches; the order's ~400 counted the 21 not-yet quests and some already-keyed ones.
- **How each is compared:** `pyread/uesp138.py` fetches the UESP page's wiki text (raw, cached; found by the quest's name, following redirects, and it must list the editor ID). From it, it reads:
  - the infobox's Giver, keeping only people the planner knows;
  - the stage table's objectives, in stage order, with optional objectives skipped. An alias slot (`<Alias=Boss>`) stands for any words, so "Kill the boss at the dungeon" matches "Kill the <Alias=Boss> at <Alias=Dungeon>".
- **Agree** means the page's giver is UESP's (or neither names one) and its first step is UESP's first objective. That gets a key row (`source: uesp`, with the url). Anything else goes to `needs-bob.md` with both readings and the record ids, grouped by kind of difference.
- My first parse cut UESP's alias slots and nested templates, and counted places and items as givers: 31 of batch 1 "differed". Fixed before anything was written: 12 differ.

### Batch 1 (main quest, Dawnguard)
- 40 quests: 28 agree (key rows), 11 differ, 1 with no page (Dragon Research). That's 30% to Bob, not over the stop line.
- By kind of difference:
  - giver: the page names none where UESP does (Before the Storm, The Horn of Jurgen Windcaller, Dragonslayer, A New Order);
  - a different giver (Dragon Rising: Farengar on UESP; The Way of the Voice and Season Unending: UESP names who sends you; The Fallen: UESP says Alduin);
  - a different first step (Diplomatic Immunity's LoreRim wording; A Cornered Rat; Paarthurnax: "Decide Paarthurnax's Fate" against UESP's "Kill Paarthurnax").
- Gate: `build.py`, the game-data tests and the answer key pass; no page changed (a key row on a checked quest only confirms it).
- Rex (fresh, on A Jarl's Justice, Deceiving the Herd, Ancient Power, Alduin's Wall): PASS on all four for giver and first step.
- Rex's other notes, not this batch's test: the `towns` tag names a place that isn't a town (Dayspring Canyon, Esbern's Vault); Alduin's Wall's need could name A Cornered Rat, not just "Talk to Esbern".

### Batch 2 (Dawnguard, Dragonborn, the Companions)
- 40 quests: 10 agree (key rows), 23 differ, 7 with no page that lists them (Prophet's two halves, Dawnguard's radiant parent, Beyond Death's soul gem handler, Power of the Blood, Animal Extermination's two). **75% to Bob, over 30%.**
- By kind:
  - The page names no giver where UESP does (10): mostly the Companions' radiant jobs, whose pages name no one where UESP names Farkas, Vilkas, Skjor or Aela.
  - A different giver (8). UESP's Giver is often who sends you on; the page names the person you speak to first: Chasing Echoes and Seeking Disclosure (Dexion Evicus against Lord Harkon), Proving Honor (Skjor against Farkas), The Silver Hand and Blood's Honor (UESP's Skjor and Kodlak against Aela).
  - No giver on UESP where the page names one (3): Beyond Death, The Temple of Miraak and Impatience of a Saint, which UESP says start by themselves.
- Two more parser faults found while checking: places and items still passing as people, and "Aela" not matched to "Aela the Huntress", which made one false agreement (Striking the Heart). Fixed; every batch-1 row still agrees.
- Rex (fresh, on Kindred Judgment, The Gardener of Men, Destroying the Dawnguard, Cleansing the Stones): PASS on all four. Its other notes: Destroying the Dawnguard's thenWho is Agmaer, a recruit, not a leader; Cleansing the Stones' place repeats itself ("Shaman's Hut, Skaal Village Shaman's Hut").

### Batch 3 (the Companions, the College)
- 40 quests: 26 agree (key rows), 13 differ, 1 with no page (Research Thief). **35% to Bob, over 30%.**
- The College's radiant and objective quests name Tolfdir or Sergius where UESP has no giver, or the reverse. Good Intentions and Revealing the Unseen name Urag and Savos where UESP names Tolfdir and Mirabelle.
- Parser faults fixed first: UESP's counts ("(/3)"), names in a template ("{{sic|…}}", `<Alias.ShortName=…>`), and a giver written as plain text.
- Rex (fresh, on The Eye of Magnus, Arniel's Endeavor, Dampened Spirits, Purity): three PASS. The Eye of Magnus got CHANGES NEEDED: its way says "Talk to someone the records don't name" where UESP says it starts by itself.
- Fixed once, for every batch: a no-giver page whose way names an unnamed person now counts as a difference. Its row came out and it went to Bob. No other written row changed.

### Batch 4 (the Thieves Guild, the Dark Brotherhood)
- 40 quests: 20 agree (key rows), 15 differ, 5 with no page (the TG00, Dampened Spirits scene, East Empire and No Stone Unturned handlers, Scoundrel's Folly Post). **50% to Bob, over 30%.**
- The Thieves Guild's radiant jobs name no giver where UESP names Vex or Delvin. The Dark Brotherhood's UESP giver is Astrid, where the page names the person you speak to (Muiri, Festus Krex, Cicero). Before it went into the list, an "Automatic after killing [[Astrid]]" giver was being counted as Astrid; fixed.
- Rex (fresh, on Bound Until Death, Blindsighted, Destroy the Dark Brotherhood!, Meet the Family): PASS on all four. Its other notes: "Through Dark Brotherhood" as a way; Bound Until Death's place may be the Abandoned Shack where it should be the Dawnstar Sanctuary (to check in the files).

**Stop:** batches 2, 3 and 4 each put more than 30% on the needs-Bob list (75%, 35%, 50%). That's WO-132's second stop condition. Report: `loop-report-2026-10-23.md`. Batches 5 to 9 are compared read-only in the report, not written.

## Decisions (WO-138 Part 5)

From here the PC decides pattern questions itself. Each decision gives its reason and the quests it touched (batches 1 to 4 here; later batches below). `story_checks/wo138-decisions.json` lists them by batch, so if Bob overturns a decision, the fix is one rerun of `pyread/uesp138.py settle <n>`.

The loop's rows that wait on Mac live in `gamedata/5.0.4.8/quest_truth_loop.json`, which `test_quest_truth.py` now reads alongside its own lists. Each must still fail until Mac's Part 4 lands.

**Version 2, after Rex.** The first version (D1 to D8) got CHANGES NEEDED on D1, D2, D5, D6 and D7. Rex was right on each:
- D1 passed any second person and labelled them all `sentBy`.
- D2 kept a giver where another quest's ending starts the quest.
- D5 let a no-giver row pass while the page still said "Ask <speaker>".
- D6 read UESP's "Unknown" stage as the first stage and hid a giver gap behind `DIFFERS`.
- D7 missed pages behind redirects, disambiguation pages and UESP's Unfinished Quests.

Under it all, the comparison counted the first step's person as the page's giver, which made The Fallen "agree" on Paarthurnax. All of these are fixed, and batches 1 to 4 were re-sorted from the last commit.

**Version 3, after Rex's re-review** (D0, D2 to D9 passed). Four fixes:
- "a starter's speaker" is now defined (below);
- D1b also needs the page's giver to set the quest off;
- G1's one-dispatcher clause is for radiant jobs only: a story quest that another quest's stage starts rightly names no giver (A New Order, The Way of the Voice);
- D5 reads the page's `who` and ways, never its first step.

**Bob's, Part 3 (the first decisions, applied as written):**
- **R1 to R4** are wording rules for the pages (Mac's Part 4; R4 by hand). The loop doesn't change them.
- **G1:** see D1, and for radiant jobs:
  - one dispatcher the page doesn't name: a key row with that giver, waiting on Mac, but only for a radiant job. When every starter is another quest's stage, the quest is a story quest: a no-giver row (G2's form), and UESP's giver is who you go to. Touched (batches 1 to 4): Before the Storm, Dragon Rising, The Way of the Voice, The Horn of Jurgen Windcaller, Season Unending, Dragonslayer, A New Order, Prophet (both), Touching the Sky, At the Summit of Apocrypha, Under Saarthal;
  - several dispatchers: a no-giver row;
  - one dispatcher whom the page's first step already names: a key row.
- **G2:** see D5.
- **G3:** the records' objective text wins over UESP's paraphrase; see D6.
- **G4:** see D4.
- **G5:** handlers and helpers with no UESP page are background: counted, never a key row.
  - Bob also named Prophet's two halves, but the lookup now finds their page (the Prophet disambiguation page leads to both IDs), so they're compared like any quest.
- **G6:** a key row confirms the giver and first step only.

**The PC's:**
- **D0. The page's giver is its `who`, else its first way's person, never the first step's person.**
  - Why: the planner's first step names whoever you go and see, not who starts the quest. Counting that person made false agreements (The Fallen).
- **A starter's speaker** is a person whose own dialogue line sets this quest's stage (a `dialogue` row in the start check's `startedBy`). A person whose line sets a stage of another quest, which then sets this one (a `throughStage` under a `quest script` row), isn't one: that's another quest's ending, G2's case (Rex). Muiri, for instance, sets Mourning Never Comes' stage 50, which only sets Whispers in the Dark's empty stage 1.
- **D1. UESP and the page name different people. The start check's starters decide which case of G1 it is:**
  - **D1a.** UESP's giver is a starter's speaker (their talk sets the quest off). If the page's giver is a starter too, both stand (Delayed Burial). If not, the page is wrong: a row with UESP's giver, waiting on Mac (Whispers in the Dark: Astrid's own line sets stage 10; Muiri's only reaches the empty stage 1 through Mourning Never Comes).
  - **D1b.** UESP's giver is the first step's person: named in the first step, or its `thenWho`. That's the person you speak to, not a sender. Both stand, with no `sentBy`, provided the page's giver is a starter's speaker; otherwise D1d (Proving Honor, The Silver Hand, Blood's Honor, TG00 Maul Handler, To Kill an Empire).
  - **D1c.** The page's giver is a starter's speaker and UESP's is neither: UESP's sends you there, so `sentBy` (Awakening).
  - **D1d.** None of these: not checked, both readings on the needs-Bob list (The Path of Knowledge).
  - Why: Rex showed that "both are people" covered three different cases and labelled them all wrong. The starters are the records' answer to who sets it off.
- **D2. UESP names no person and doesn't say it starts by itself: the records decide.** If the page's giver is a starter's speaker (their own talk sets it), it stands. Otherwise it's not checked, with both readings.
  - Why: an empty infobox is UESP saying nothing. Rex's point stands: The Fallen's "giver" was another quest's ending, and D0 now makes it a no-giver row.
  - Touched: Dragon Research, Impatience of a Saint, Rogue Wizard, College Objective Quest, Filling Soul Gems.
- **D3. UESP has no stage table: the giver is compared, and the first step is the records' own.** The row's notes say UESP didn't confirm the step.
  - Touched: Tolfdir the Absent-Minded, Restocking Soul Gems, Research Thief.
- **D4. G4 quests (a way says "someone the records don't name") get no key row until Mac names the speaker or drops the way.**
  - Why: G4 says such a page never agrees, and the key test reads only the giver and first step.
  - Touched: Dragon Rising, The Horn of Jurgen Windcaller, Season Unending, Paarthurnax, Prophet, Touching the Sky, Scroll Scouting, Cultists vs Player, Brotherhood, Under Saarthal, The Eye of Magnus, Shalidor's Insights, Rejoining the College.
- **D5. G2: when another quest's stage starts it (every starter is another quest's script), or UESP says it starts by itself, and the page still names a person in its `who` or its ways (not its first step, which G2 lets name them), there's no row until Mac's G2 makes the page "After <that quest>".**
  - Why: a no-giver row would pass the test while the page says "Ask <speaker>" (Rex).
  - Reparations is here too, though Bob's R3 allows its "Ask Mercer, Brynjolf or Delvin". Its condition is really "after the Guild bans you" (`TGBanToggle`), which the page should say.
  - Touched: Chasing Echoes, Seeking Disclosure, The Temple of Miraak, Good Intentions, Revealing the Unseen, Reparations, No Stone Unturned, The Silence Has Been Broken.
- **D6. First steps.**
  - UESP's first objective is the lowest stage's, leaving out stages UESP marks "Unknown" and optional objectives.
  - When the page's step is a later UESP objective:
    - if every starter sets the page's stage or later directly, the records win;
    - otherwise UESP's earlier stage is reachable, and the row carries UESP's step, waiting on Mac (rule 1).
  - When the records win (by that test, or because their own wording differs from UESP's), the row holds the records' step. It doesn't go in `DIFFERS`, so the giver is still tested (Rex: `DIFFERS` skips the whole row). UESP's wording is in the notes.
  - Records win: Diplomatic Immunity, A Cornered Rat, Paarthurnax, Dragon Research, Forgotten Vale Books Quest, Cultists vs Player, Brotherhood, Alteration Ritual Spell, Delayed Burial. Reachable: Under Saarthal, TG00 Maul Handler.
  - A New Order agrees on the step now ("Speak with Isran") and is a no-giver row passing now: Bloodline's stages start it (G1 above).
- **D7. No UESP page at all (a 404, after redirects, disambiguation pages and UESP's Unfinished Quests sections), and not a handler: files-only, counted.**
  - Touched: Power of the Blood.
- **D8. The matching rules stay:**
  - an alias slot stands for any words;
  - the count's first number is ignored;
  - a giver must be a person the planner knows;
  - "Automatic after…" is no giver.
- **D9. The lookup follows a disambiguation page to the version that lists the editor ID, and reads a quest's own section of UESP's Unfinished Quests page.**
  - It also retries a refused page with its letters encoded, because UESP's firewall refused three pages whose titles contain "Research" (HTTP 403). My first runs had cached those refusals as "no page".

**Batches 1 to 4 under version 2:**
- 130 key rows: 114 passing now, 16 waiting on Mac (14 radiant jobs' one dispatcher, Whispers in the Dark, TG00 Maul Handler's rule 1 step). The two Animal Extermination quests share one name in the waiting list.
- No row until Mac: 8 for G2, 13 for G4.
- 7 background (G5), 1 files-only.
- 1 not checked: The Path of Knowledge, on the needs-Bob list.
- No row from before this loop changed.

**Version 4, after Rex's batch 5 sample** (three rules wrong; all fixed, and batches 1 to 5 re-sorted from the last commit):
- **D6, the stage table:** a UESP page can hold several quests' stage tables, and one table can hold several quests, split by a `|!|<name>|<ID>` row.
  - The first step is now read only from the quest's own segment. A Daedra's Best Friend had been read from DA03Start's table ("Speak to Lod") instead of DA03's ("Talk with Barbas"), and DA02 Hook from DA02's.
  - A page whose tables all name other IDs gives no step (D3).
  - "Unknown" stages count only when they're all the quest's segment has (DA02 Hook, Collecting the Edda).
- **D6, the starters:** "every starter sets the page's stage or later directly" now counts every starter. A story manager node, a Start or the start-game flag sets no later stage. Investigate the Hall of the Dead (entering Markarth starts it) now waits with UESP's stage 5 step.
- **D5, version 4:** follows Mac's G2 rule as written, whatever UESP names.
  - When every starter is another quest's stage, or UESP says it starts by itself, the start is "After <that quest>" with no giver. A page that still names a person in its `who` or ways gets no row until Mac.
  - Why: Rex showed that identical records gave opposite outcomes. Joining the Legion agreed because UESP named Rikke; Joining the Stormcloaks didn't because UESP named Ulfric. One rule for one shape. The exception for "an offer the player can decline" isn't read; Mac's rule decides that per line.
  - Touched (batches 1 to 5): A Cornered Rat; Alduin's Wall; The Throat of the World; Elder Knowledge; The World-Eater's Eyrie; Bloodline; Chasing Echoes; Seeking Disclosure; The Temple of Miraak; The Fate of the Skaal; Hitting the Books; Good Intentions; Revealing the Unseen; The Staff of Magnus; Loud and Clear; Dampened Spirits; Scoundrel's Folly; Speaking With Silence; Hard Answers; The Pursuit; Trinity Restored; Blindsighted; Darkness Returns; Reparations; No Stone Unturned; Meet the Family; The Silence Has Been Broken; Joining the Legion; Joining the Stormcloaks; The Jagged Crown; The Jagged Crown; Message to Whiterun.
- **D4 before D7:** a way that names no one never ships, whether or not a page was found. The Battle for the fort (CWFortSiegeFort) has UESP pages per fort, which the name lookup can't reach, and an unnamed field-commander way.
- **D7's limit:** UESP's search returns nothing by editor ID (and refused Rex), so a quest whose name is an alias text ("The Battle for the fort") can't be found by name. Those are files-only unless D4 or G5 takes them; listed in the report.
- **The decisions file no longer** lists a quest under "agree" when it got no row (G4).

**Batches 1 to 5 under version 4:**
- 131 key rows: 114 passing now, 17 waiting on Mac.
- No row until Mac: 32 for G2, 19 for G4.
- 7 background (G5), 10 files-only (D7).
- 1 not checked (needs-Bob).
