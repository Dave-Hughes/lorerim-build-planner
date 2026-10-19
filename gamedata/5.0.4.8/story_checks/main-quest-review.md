# Bob's check of `main-quest.md` (WO-104), 18 Oct 2026

Read item by item against the base game and the story board (`QuestStory.dc.html`). Some of Jeff's findings were re-read on the PC; those say "re-read".

## What the report gets right

- **The chain matches the base game.** Each quest is started by the stage before it that you'd expect:
  - Bleak Falls Barrow by Before the Storm at 160;
  - Dragon Rising by Bleak Falls Barrow at 190;
  - The Way of the Voice by Dragon Rising at 150;
  - The Horn by The Way of the Voice at 160;
  - A Blade in the Dark by The Way of the Voice at 200;
  - and on through Dragonslayer, started by Sovngarde at 200.
- **The three questions.**
  - `0242BA` is MQ105, and stage 160 completes it.
  - The Horn is started by The Way of the Voice's stage 160, at High Hrothgar. The board's "Arngeir, after The Way of the Voice" holds.
  - The Dragonborn cultists need level 25 and The Way of the Voice. Of the TIE settings, only that one is chosen, set by `DLC2QuestStartSelection_KRY = 1`.
- **Timing is Everything: Bob was wrong on 18 Oct.** LoreRim ships its own `tie_mcmscript.pex` in `[LoreRim] - SPID Files and Script Overwrites`. That mod is above the settings loader in MO2: modlist line 134 against 350. Re-read: LoreRim's script extends `SKI_ConfigBase` and never calls `GetModSetting`, so the loader's `settings.ini` is never read. The levels in `LoreRim - Global Modifiers.esp` stand: Dawnguard 30, The Break of Dawn 20, Boethiah's Calling 20 and the rest. The backlog line saying otherwise is corrected.
- **LoreRim changes worth putting on the page:**
  - Diplomatic Immunity's first objective is "Meet Delphine in Riverwood or storm the Thalmor Embassy" (Storm the Thalmor Embassy.esp);
  - Paarthurnax runs through PaarthurnaxQuestExpansion.esp;
  - only the two Dragonborn starts run Unbound. Helgen Keep (Start) begins at stage 6, Helgen Keep (End) at 250. Every other start doesn't.
- **Payoff:** neither Dragonslayer nor Paarthurnax gives anything on its completing stages. The page says the story ends with no item reward.

## What's wrong or missing (WO-105)

1. **"Started by" mixes starters with catch-ups.** Most entries are a later quest's stage 1 setting an earlier quest's stage. For example, Bleak Falls Barrow's stage 1 sets Before the Storm's stage 1. That's how the game skips ahead, not how a quest starts. The real start is the call that takes a quest from not running to its first objective. List only that under "Started by", and put catch-ups under a separate heading.
2. **Before the Storm's real starter is missing:** the end of Unbound. It may be under `advancedBy` in the JSON, but the page needs it as the starter.
3. **Wrong names:** MQ102A and MQ102B are shown as "Season Unending". They're the Imperial and Stormcloak versions of Before the Storm.
4. **"Who" picks the wrong person:**
   - Irileth is shown for Before the Storm and Dragon Rising. The first objective points at `RiverwoodFriend` (Alvor or Gerdur) and at Balgruuf. Use the person or place the first objective's target alias holds.
   - Drop "Location for things that need a location" as a place.
5. **Starting the main quest from the other starts, in player terms.** The table says every non-Dragonborn start leaves Unbound off, then lists AP's routes back into it:
   - `AP_DialogueHelgen` with `APMessengerUtil`;
   - a dialogue with Shazdehviir in Helgen, with its conditions empty;
   - an unnamed INFO, `075139`;
   - `APS_VanillaStart`, with no starter found.

   For each: who says what (the player's prompt and the reply), when it's offered (the INFO's conditions, read), and what the player has to do. This is the "can I even start it" answer, so it can't be left as form ids.
6. **Conditions lose their OR flags.** Rebuilding the Blades "needs Paarthurnax stage < 10; stage 100 done; stage 99 done" can't all be true at once. Print the groups as written, with "or" between them.
7. **Door noise.**
   - Kept as needs: the Riften warehouse for Dragon Rising, Dragonsreach's Master-locked door, and the High Hrothgar doors that need a key.
   - Fix: a door counts only if it's the way into the first objective's target cell, and there's no other unlocked way in. Report the High Hrothgar doors once, with which door they are.
8. **Gives.** Season Unending shows the Civil War's rank rewards (`CWRankReward…`). Only list what a quest's own completing stages give the player, and name what a reward list holds.
9. **Wyrmstooth's start level isn't settled.**
   - The loader's `settings.ini` has `iWTGeneralRequirementsMinimalLevel=10` and `bLoadSettingsonReload=0`.
   - Its script also has `MigrateToMCMHelper`, which copies the global into the setting. Done on first run, that would keep the record's 20.
   - Read `OnConfigInit` and `MigrateToMCMHelper` and say which value a new game ends up with.
   - Until then the board shows Wyrmstooth's level as not checked.

## Changes to the board once WO-105 is in

- "How it starts" adds what to do from every other start (item 5).
- The Horn: "Arngeir, at High Hrothgar, after The Way of the Voice" is backed. Ustengrav is the base game's place; WO-105 reads it from the objective's target alias.
- Payoff: "No item reward. The story ends with Dragonslayer."
- Wyrmstooth: level shown as not checked until item 9 is answered.
- Chapter 5 gets a note about Storm the Thalmor Embassy.

## WO-105 rerun, checked (18 Oct, evening)

- **Items 1 to 8 are in.**
  - Before the Storm is started through its helper quests MQ102A and MQ102B. Unbound starts them at stage 700 or 800, and they put Alvor or Gerdur in `RiverwoodFriend`.
  - Catch-ups sit under their own heading.
  - Conditions print with their "or".
  - No quest in the story has a locked-only way in.
  - Rewards come only from a quest's own completing stages: Blade of Whiterun from Dragon Rising, nothing from the last quests.
- **MQ102A and MQ102B's names:** Jeff is right. Their records' own names are "Season Unending". The report calling them Before the Storm's helper quests is correct, and the box is ticked.
- **Wyrmstooth: level 10 in a new game.** The settings loader's first-run load sets `WTStartLevel` from its `settings.ini`. The migration that would keep 20 runs only on saves made before the loader. The story page and `questlines.json` must use 10.
- **The other starts:** the report offers three ways in. Only one is solid.
  - **Farengar: not backed.** The line comes from the tool, not from dialogue. Bleak Falls Barrow runs from the start, but only at stage 0. Its first objective, "Talk to Farengar", appears at stage 10, and only Before the Storm's stage 160 sets that. No dialogue in the report moves Bleak Falls Barrow off stage 0. Drop it from the page, and fix `story_check.py` (around line 1095) so a start-game quest only counts as "open now" when it shows its first objective at the stage it starts on.
  - **Shazdehviir's "Skip to Helgen Keep":** this is the statue choice at the very start (the Dragonborn start), not a way in later.
  - **Matlara, "I'd like to rent a room", 25 gold, at the Resting Pilgrim in Helgen:** the likely way in later, but one link isn't read. She has to be in `AP_DialogueHelgen`'s `RestingPilgrimOwner` alias, and Unbound starts that quest at stage 0. What starts Unbound at stage 0 in a new game hasn't been found (`APS_VanillaStart` has no starter). Until that's read, or Dave confirms it from his own game, the page marks this line "not checked yet".

## Second check of the story page (Rex, 18 Oct)

An independent check of `QuestStory.dc.html` against this report. Changes made to the page:
- "Done" was 6 of 19: it's 5 (the Horn is next, not done). Said once now.
- "When" no longer says High Hrothgar. The Horn's target alias names no place.
- Chapter 7 has 6 quests. Paarthurnax starts during The Fallen, not after the end.
- "Along the way" no longer says the jobs repeat. The report doesn't say so.
- **Dragonborn:** the cultists' node also needs `GetRandomPercent < DLC2WE09Chance`, and LoreRim's record sets that chance to 0.0. Scripts and Extended Encounters' menu can set it in play. Until that's read, "level 25 for the cultists" is marked not checked, and the page offers the ship to Raven Rock from Windhelm.
- Matlara: "Resting Pilgrim" comes from an alias name, not the report, so it's dropped. Bob keeps the line marked not checked (the alias link above), against Rex's call that the report backs it. Farengar stays off (not backed); Shazdehviir is the starting statue.

Data fixed: Wyrmstooth's gate is level 10 in `questlines.json`, and the main quest's start text is the Dragonborn starts.

Still to fix before rewards go on story pages: `quests.json`'s rewards come from WO-99. They disagree with this report on MQ106 (the report gives Delphine's Secret Door Key), MQ204 and MQ301 (the report gives nothing). Rewards should come from the start check's own-completing-stages rule.
