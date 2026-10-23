# WO-138 report: the last 40, and checked starts against UESP (PC, 23 Oct 2026)

## Where it stopped

The loop stopped on WO-132's second condition: three batches in a row put more than 30% of their quests on the needs-Bob list (batch 2 75%, batch 3 35%, batch 4 50%). That stop is there for when "the rules are wrong, not the data". Here it means that most differences are about what "giver" means, not wrong starts (see "What keeps appearing"). Batches 5 to 9 (185 quests) weren't written. A read-only comparison of them is at the end, so you can see whether the same faults continue.

## Numbers

| | before | after |
|---|---|---|
| Checked starts | 1,202 of 1,242 | 1,221 of 1,242 (1,200 from the files, 21 from the key) |
| Answer-key rows | 133 | 236 (19 from Part 1, 84 from Part 2) |
| Base, DLC and Creation Club starts compared with UESP | 133 (the key) | 133 + 19 + 160 compared, 103 of them agree |
| On the needs-Bob list | 40 | 21 (Part 1) + 76 (Part 2) |

## Part 1: the last 40

**19 settled**, each by a hand trace of the records that agrees with UESP, now a key row with the trace in its notes:
- The seven fishing jobs. Viriya's bounty letter starts a quest taken from `ccBGSSSE001_MiscQuests`' `miscquests` array.
- The four Dragonborn Black Books. The book's script holds the quest and stage 10, and the dungeon controller's `ReadBook` sets it.
- The Thieves Guild's four city jobs. Delvin's lines (INFO 09DD57 to 09DD5A) set TGRShell 162, 172, 182 and 192, whose fragments set each job.
- Under New Management. `TGLeaderCheck` sets TGRShell 197 after four city jobs and Darkness Returns.
- From the wiki, as the order says: Purity of Revenge, Glory of the Dead and March of the Dead (only ruled-out helpers in the records).

**21 stay**, each with both readings:
- In the Shadows: its first objective shows at stage 0 and nothing in the records starts it.
- No UESP page: the Durnehviir handler, Animal Pelt Collection, the Civil War's three objective holders, The Lost Verse, First Catch.
- Boethiah's Bidding (unfinished content).
- Nine mod quests with no second source.
- The Vigilant's three guides.

**Four start patterns the check can't read**, which the hand traces show, each worth a rule:
1. A quest taken from an array property (fishing).
2. A book whose read script hands the quest to a controller quest that sets the stage (the Black Books).
3. A quest's fragment reaching the job through a property on its own script (`kmyQuest.pTGTQ01Quest`).
4. A main script's function setting a stage (`TGLeaderCheck`).

## Part 2: checked starts against UESP

**How:** `pyread/uesp138.py` reads each UESP page's wiki text: the infobox's Giver (people only) and the stage table's objectives, in order, with an alias slot standing for any words.
- **Agree:** the page's giver is UESP's (or neither names one) and its first step is UESP's first objective. Each one is a key row, `source: uesp`, with the url.
- **Anything else:** goes to `needs-bob.md`, grouped by kind, with both readings and the record ids.

| Batch | Lines | Agree (key rows) | Differ | No page | To Bob |
|---|---|---|---|---|---|
| 1 | main quest, Dawnguard | 28 | 11 | 1 | 30% |
| 2 | Dawnguard, Dragonborn, Companions | 10 | 23 | 7 | 75% |
| 3 | Companions, College | 26 | 13 | 1 | 35% |
| 4 | Thieves Guild, Dark Brotherhood | 20 | 15 | 5 | 50% |
| **1 to 4** | | **84** | **62** | **14** | **48%** |

**The differences by kind (batches 1 to 4):**

| Kind | Count | What it is |
|---|---|---|
| The page names no giver, UESP does | 24 | Almost all radiant jobs (Companions, Thieves Guild): the page's start is "Talk to Farkas"-style dialogue in a handler quest, so it names no one, while UESP names the job-giver. |
| A different giver | 18 | UESP's Giver is often who sends you on (Dexion for Chasing Echoes, Astrid for To Kill an Empire). The page names the person you first talk to, or the one who sets the stage. |
| No giver on UESP, the page names one | 11 | UESP says it starts by itself (Beyond Death, Reparations, The Temple of Miraak). The page names whoever speaks at the start. |
| A different first step | 6 | Real differences: A Cornered Rat, Paarthurnax ("Decide Paarthurnax's Fate" against "Kill Paarthurnax"), Diplomatic Immunity, Impatience of a Saint, Brotherhood ("Follow the questgiver"). |
| The page's first step is a later UESP objective | 6 | The page skips UESP's first stage (A New Order's "Meet Tolan at Stendarr's Beacon", Under Saarthal, Delayed Burial). |
| The page's way says an unnamed person starts it | 5 | A no-giver start whose only way reads "Talk to someone the records don't name", where UESP says it starts by itself (The Eye of Magnus; Rex caught it). The giver agrees; the way misleads. |
| No UESP page lists it | 14 | Handlers and helper quests: Prophet's two halves, Dawnguard's radiant parent, TG00 handlers, Scoundrel's Folly Post. |

**What keeps appearing:** 53 of the 62 differences are about the giver, not about the start being wrong. UESP's "Quest Giver" and the page's `who` mean different things: UESP gives the person who sends you, and the page gives the person whose talk or trigger starts the quest. Bob, these need one ruling:
- (a) Count a giver as agreeing when UESP's giver is the person whose talk starts the quest on the page or sets it off (often the previous quest's last speaker); or
- (b) keep `who` as the person you speak to and add UESP's giver as `sentBy`.

With (a), and radiant jobs taking their dispatcher as giver, most of the 53 would become key rows. The 12 first-step differences are the real ones. None of batches 1 to 4's differences come from a LoreRim mod's edit; all are base or USSEP records.

## Rules or files changed

- `quest_truth.json`: 103 rows added. No existing row changed. Two of my own new rows changed after Rex: Under New Management became a no-giver row, and The Eye of Magnus came out (its way names an unnamed person).
- `needs-bob.md`: Part 1's 19 off; Part 2's batches 1 to 4 added by kind.
- `loop-log.md`: each step.
- No script in the repo changed. The comparison is `pyread/uesp138.py`, outside the repo like the earlier loop tools. The UESP pages are cached in `pyread/uesp138/raw/`.

## Batches undone

None. Before writing anything, I fixed my own parser four times:
- alias slots and nested templates;
- places and items counted as givers;
- "Aela" not matched to "Aela the Huntress", which made one false agreement;
- counts and "Automatic after…" givers;
- after Rex, a no-giver page whose way says "someone the records don't name" now counts as a difference.

Each time, every row already written was rechecked and still agreed.

## What Rex sent back

- **Part 1 sample** (No Contest, The Winds of Change, Imitation Amnesty, Under New Management): CHANGES NEEDED on all four.
  - Fixed: Under New Management's giver (UESP has none).
  - Not mine to fix (quest_pages wording, which WO-132's limits keep me out of). A start the key confirms keeps the check's leftover ways:
    - "Through Thieves Guild Radiant Shell" as a way and a need;
    - "No one gives it" for a book read in a known place;
    - No Contest has no "after Heart of Gold".
  - Rex's point stands: `checked: uesp` confirms the giver and first step, not that the ways and needs are complete. For Mac and Bob.
- **Batch 1** (A Jarl's Justice, Deceiving the Herd, Ancient Power, Alduin's Wall): PASS on all four.
- **Batch 2** (Kindred Judgment, The Gardener of Men, Destroying the Dawnguard, Cleansing the Stones): PASS on all four.
- **Batch 3** (The Eye of Magnus, Arniel's Endeavor, Dampened Spirits, Purity): three PASS. The Eye of Magnus got CHANGES NEEDED: no giver, which is right, but its way says "Talk to someone the records don't name" where UESP says it starts by itself after The Staff of Magnus. Fixed once, for every batch: such a page now counts as a difference, so its row came out and it went to Bob. It's the only row that changed.
- **Batch 4** (Bound Until Death, Blindsighted, Destroy the Dark Brotherhood!, Meet the Family): PASS on all four.
- **Rex's other notes, across batches:**
  - `towns` names places that aren't towns (Dayspring Canyon, Esbern's Vault);
  - a `thenWho` that is a recruit, not the leaders (Destroying the Dawnguard);
  - a place that repeats itself ("Shaman's Hut, Skaal Village Shaman's Hut");
  - helper names as ways ("Through Dark Brotherhood", "Through Thieves Guild Radiant Shell");
  - a previous quest missing from needs (The Eye of Magnus after The Staff of Magnus);
  - "a condition the planner can't put in words yet" where the flag could be worded (Dampened Spirits, Blindsighted).

## Batches 5 to 9, read only (not written)

185 quests:
- 81 would agree, 75 differ, 29 have no page.
- Kinds of difference: the page's way says an unnamed person 23, the page names no giver 21, no giver on UESP 18, a different first step 15, no objectives on UESP 9, a later objective 6, a different giver 5.
- Most come from the Civil War, the fishing jobs, the Rift's odd jobs and townsfolk favours.
- 17 differences there are on quests a LoreRim mod edits.

If Bob rules on the giver question, the loop can restart at batch 5 from the cache.
