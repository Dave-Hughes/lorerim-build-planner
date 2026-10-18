# How each quest line starts, and what other plugins change (WO-101)

Written by `scripts/gamedata/quest_starts.py` from the records in the Ultra load order. For each curated line's opening quest: its conditions, the doors into the places it uses (locks, keys, enable parents), its opening dialogue and the globals its conditions read. A change counts when the plugin isn't the quest's own mod.

## Counts

152 lines. 70 have a change from a plugin other than their own mod.

| Kind | Lines |
| --- | --- |
| dialogue | 51 |
| alias | 18 |
| door: key | 15 |
| door: hidden | 11 |
| global | 4 |
| condition | 3 |
| start game | 3 |
| door: locked | 3 |
| alias items | 2 |
| door: shown | 1 |
| door: unlocked | 1 |

Door changes that only move a lock's level (USSEP's Novice fix, Requiem's harder locks) are kept in the raw file as `minor` and not counted.

Lines with a lock on a door into their places (any plugin): 56.

## Changed by another plugin, worst first

Lock or key, then a new condition, then a global.

### A Healing Wedding (`DB05Alt`, lock or key)

Own mod: Vittorias Alternate Wedding. Plugins: Penitus_Oculatus.esp, Unofficial Skyrim Special Edition Patch.esp.

- A door into the quest's place needs a key it doesn't name.
- The Dark Brotherhood Sanctuary door stays hidden until its enable parent (Penitus_Oculatus.esp:017747) is enabled.

### Blood on the Ice (`MS11`, lock or key)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp, WindhelmSSE.esp.

- The Thalmor Embassy door stays hidden until its enable parent (Skyrim.esm:077E0C) is enabled.
- The Old Temple of Talos door stays visible until its enable parent (Skyrim.esm:077E0C) is disabled.
- Unofficial Skyrim Special Edition Patch.esp changes the alias AuthorityFigure.
- Unofficial Skyrim Special Edition Patch.esp changes the alias Tova.
- Unofficial Skyrim Special Edition Patch.esp adds the alias SecondVictimEssential.
- Unofficial Skyrim Special Edition Patch.esp adds the alias USKPHjerimReplacementKey.
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn629 == 1.0; - GetItemCount Skyrim.esm:021683 > 0.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsAliasRef == 1.0; + fn629 == 1.0; + Blood on the Ice stage 70 done; - GetIsID Jorleif == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn629 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn629 == 1.0; + Blood on the Ice stage > 100.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsAliasRef == 1.0; + fn629 == 1.0; - GetIsID Jorleif == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn629 == 0.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Blood on the Ice stage <= 90.0; - Blood on the Ice stage < 80.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn629 == 1.0; + Blood on the Ice stage 70 done).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn35 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn46 == 1.0; + fn35 == 0.0; - fn46 == 1.0).

### Dawnguard (`DLC1VQ01MiscObjective`, lock or key)

Own mod: Skyrim. Plugins: Stendarr Rising.esp, Unofficial Skyrim Special Edition Patch.esp, Vigilant.esm.

- The Stendarr's Beacon door needs the Stendarr's Beacon Underground Key.
- The Hall of the Vigilant door needs the Hall of the Vigilant Key, carried by Vigilant Claren in Hall of the Vigilant; Vigilant Hilde in Hall of the Vigilant; Vigilant Brigid in Hall of the Vigilant and 5 more.
- The Hall of the Vigilant door stays hidden until its enable parent (Stendarr Rising.esp:0993E0) is enabled.
- Unofficial Skyrim Special Edition Patch.esp changes the alias FortDawnguardWorldspaceDoor.

### Deathbrand (`DLC2dunHaknirTreasureQST`, lock or key)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- The Gyldenhul Barrow door needs the Gyldenhul Barrow Key, lying in Dragonborn.esm:016E1E.

### Dreams of the Dead (`ccRMSSSE001_Quest`, lock or key)

Own mod: Official Master Files - Cleaned Plugins. Plugins: Creation Club Home Requirements - AIO.esp.

- The Gallows Hall door needs a key it doesn't name.

### Falion's Secret (`FreeformMorthalA`, lock or key)

Own mod: Skyrim. Plugins: Environs - Hroggars House.esp, Fists of Fury - Skyrim.esp, photnmorthal.esp.

- The New Moon Cottage door needs the New Moon Cottage Key, carried by Satchel in Movarth's Lair.
- The Eisa's House door stays hidden until its enable parent (Environs - Hroggars House.esp:000802) is enabled.
- Fists of Fury - Skyrim.esp changes the opening dialogue's conditions (+ Fists of Fury - Hjaalmarch stage < 10.0; + Fists of Fury - Hjaalmarch stage > 50.0).

### Fura Bloodmouth (`aaFuraQ1`, lock or key)

Own mod: (BEST EVIL FOLLOWER) Follower Dialogue Expansion - Fura Bloodmouth. Plugins: JK's Castle Volkihar.esp.

- The Volkihar Keep door needs the Ruined Tower Key, lying in Volkihar Keep.

### Gravewind (`GRVEMainQuest01`, lock or key)

Own mod: Gravewind - ESMIFIED. Plugins: LoreRim Gravewind Start Tweak.esp.

- The Cemetery Homestead door needs the Cemetery Homestead Key, carried by Vighar in Bloodlet Throne.

### Kyne's Sacred Trials (`dunHunterQST`, lock or key)

Own mod: Skyrim. Plugins: AlternatePerspective.esp.

- The Froki's Shack door needs a key it doesn't name.
- AlternatePerspective.esp changes the opening dialogue's conditions (+ Unbound completed).

### Laid to Rest (`MS14`, lock or key)

Own mod: Skyrim. Plugins: Environs - Hroggars House.esp, Unofficial Skyrim Special Edition Patch.esp.

- The Eisa's House door stays hidden until its enable parent (Environs - Hroggars House.esp:000802) is enabled.
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Laid to Rest stage == 1200.0; - Laid to Rest stage == 120.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Laid to Rest stage >= 20.0; - Laid to Rest stage >= 10.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Laid to Rest stage < 100.0).

### Missives (`_M_QuestEastmarchCourierLetterHigh`, lock or key)

Own mod: Missives. Plugins: WindhelmSSE.esp.

- The Thalmor Embassy door stays hidden until its enable parent (Skyrim.esm:077E0C) is enabled.
- The Old Temple of Talos door stays visible until its enable parent (Skyrim.esm:077E0C) is disabled.

### Myrwatch (`MyrwatchTNE_Quest`, lock or key)

Own mod: Myrwatch - Tweaks and Enhancements. Plugins: myrwatchhomefixer.esp.

- The Myrwatch door needs a key it doesn't name.

### Pieces of the Past (`DA07`, lock or key)

Own mod: Skyrim. Plugins: photndawnstar.esp.

- The Breaking Dawn Cottage door needs the Breaking Dawn Cottage Key, carried by Satchel in Nightcaller Temple.

### Revealing Rune (`Rune01`, lock or key)

Own mod: Revealing Rune. Plugins: GG's Thieves Guild Headquarters.esp.

- The Ragged Flagon - Cistern door stays hidden until its enable parent (Skyrim.esm:0B4081) is enabled.

### The Companions (`C00`, lock or key)

Own mod: Skyrim. Plugins: Companions Dialogue Bundle.esp, Companions Radiant Expansion.esp, Companions at Mirmulnir.esp, LoreRim - Dialogue Patch.esp, Narrative Gameplay Consistent Dialogue Tweaks.esp, Penitus_Oculatus.esp, Unofficial Skyrim Special Edition Patch.esp, Vilkas Spar Skip.esp.

- The Dawnstar Sanctuary door stays hidden until its enable parent (Penitus_Oculatus.esp:00FAF2) is enabled.
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn131 == 1.0).
- Narrative Gameplay Consistent Dialogue Tweaks.esp changes the opening dialogue's conditions (+ GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0); + GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0); + global NGCDT_GLOB_AelaGreetingDone != 2.0 (now 0.0)).
- Companions Dialogue Bundle.esp changes the opening dialogue's conditions (- GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); - GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); - GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); - GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); - GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0); - GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0); - global NGCDT_GLOB_AelaGreetingDone != 2.0 (now 0.0)).
- LoreRim - Dialogue Patch.esp changes the opening dialogue's conditions (+ GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0); + GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0); + global NGCDT_GLOB_AelaGreetingDone != 2.0 (now 0.0)).
- Narrative Gameplay Consistent Dialogue Tweaks.esp changes the opening dialogue's conditions (+ GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0); + GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0)).
- Companions Dialogue Bundle.esp changes the opening dialogue's conditions (- GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); - GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); - GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); - GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); - GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0); - GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0)).
- LoreRim - Dialogue Patch.esp changes the opening dialogue's conditions (+ GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0); + GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150.0)).
- Companions Radiant Expansion.esp changes the opening dialogue's conditions (+ fn372 == 0.0).
- Narrative Gameplay Consistent Dialogue Tweaks.esp changes the opening dialogue's conditions (+ fn629 == 0.0; + GetActorValue < NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue < NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue < NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue < NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue < NGCDT_GLOB_Aela_HMSMin (now 150.0); + GetActorValue < NGCDT_GLOB_Aela_HMSMin (now 150.0); + The Horn of Jurgen Windcaller not completed; + Kindred Judgment not completed; + At the Summit of Apocrypha not completed; + Destroy the Dark Brotherhood! not completed).
- Vilkas Spar Skip.esp changes the opening dialogue's conditions (- GetIsAliasRef == 1.0; - Take Up Arms stage == 20.0; - GetQuestRunning C00VilkasTrainingQuest == 0.0).
- Narrative Gameplay Consistent Dialogue Tweaks.esp changes the opening dialogue's conditions (+ GetActorValue < NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue < NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue < NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue < NGCDT_GLOB_Aela_AVMin (now 30.0); + GetActorValue < NGCDT_GLOB_Aela_HMSMin (now 150.0); + GetActorValue < NGCDT_GLOB_Aela_HMSMin (now 150.0); + The Horn of Jurgen Windcaller not completed; + Kindred Judgment not completed; + At the Summit of Apocrypha not completed; + Destroy the Dark Brotherhood! not completed).
- Companions at Mirmulnir.esp changes the opening dialogue's conditions (+ fn1 <= 500.0; + fn359 == 1.0; + fn1 <= 500.0; + fn359 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn629 == 0.0).

### The Cursed Tribe (`DA06`, lock or key)

Own mod: Skyrim. Plugins: The Cursed Tribe - LoreRim Patch.esp, The Cursed Tribe - Quest Expansion.esp, Unofficial Skyrim Special Edition Patch.esp.

- The Cursed Tribe - Quest Expansion.esp gives the alias DA06YamarzAlias: Skyrim.esm:0763EF, Skyrim.esm:08CA3E, Skyrim.esm:08CA48.
- The Cursed Tribe - Quest Expansion.esp gives the alias DA06UgorAlias: Skyrim.esm:0763EF, Skyrim.esm:08CA3E.
- The Cursed Tribe - Quest Expansion.esp adds the alias OrcSkeleton.
- The Cursed Tribe - Quest Expansion.esp adds the alias NewShrine.
- The Cursed Tribe - Quest Expansion.esp adds the alias PlayerCastAlias.
- The Cursed Tribe - Quest Expansion.esp adds the alias Ghost01.
- The Cursed Tribe - Quest Expansion.esp adds the alias Ghost02.
- The Cursed Tribe - Quest Expansion.esp adds the alias Ghost03.
- The Cursed Tribe - Quest Expansion.esp adds the alias Ghost04.
- The Cursed Tribe - Quest Expansion.esp adds the alias Ghost05.
- The Cursed Tribe - Quest Expansion.esp adds the alias Ghost06.
- The Cursed Tribe - Quest Expansion.esp adds the alias Ghost07.
- The Cursed Tribe - Quest Expansion.esp adds the alias Ghost08.
- The Cursed Tribe - Quest Expansion.esp adds the alias Ghost09.
- The Cursed Tribe - Quest Expansion.esp adds the alias GhostBoss.
- The Cursed Tribe - LoreRim Patch.esp gives the alias DA06YamarzAlias: Skyrim.esm:0763EF, Skyrim.esm:08CA3E, Skyrim.esm:08CA48.
- The Cursed Tribe - LoreRim Patch.esp gives the alias DA06UgorAlias: Skyrim.esm:0763EF, Skyrim.esm:08CA3E.
- The Cursed Tribe - LoreRim Patch.esp adds the alias OrcSkeleton.
- The Cursed Tribe - LoreRim Patch.esp adds the alias NewShrine.
- The Cursed Tribe - LoreRim Patch.esp adds the alias PlayerCastAlias.
- The Cursed Tribe - LoreRim Patch.esp adds the alias Ghost01.
- The Cursed Tribe - LoreRim Patch.esp adds the alias Ghost02.
- The Cursed Tribe - LoreRim Patch.esp adds the alias Ghost03.
- The Cursed Tribe - LoreRim Patch.esp adds the alias Ghost04.
- The Cursed Tribe - LoreRim Patch.esp adds the alias Ghost05.
- The Cursed Tribe - LoreRim Patch.esp adds the alias Ghost06.
- The Cursed Tribe - LoreRim Patch.esp adds the alias Ghost07.
- The Cursed Tribe - LoreRim Patch.esp adds the alias Ghost08.
- The Cursed Tribe - LoreRim Patch.esp adds the alias Ghost09.
- The Cursed Tribe - LoreRim Patch.esp adds the alias GhostBoss.
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn629 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn629 == 1.0; - The Cursed Tribe stage 100 not done).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn629 == -1.0).
- The Cursed Tribe - Quest Expansion.esp changes the opening dialogue's conditions (+ The Cursed Tribe stage < 60.0; - The Cursed Tribe stage >= 30.0).
- The Cursed Tribe - Quest Expansion.esp changes the opening dialogue's conditions (+ The Cursed Tribe stage >= 10.0).
- The Cursed Tribe - Quest Expansion.esp changes the opening dialogue's conditions (+ The Cursed Tribe stage >= 10.0; + The Cursed Tribe stage < 60.0).
- The Cursed Tribe - Quest Expansion.esp changes the opening dialogue's conditions (+ The Cursed Tribe stage == 45.0; - The Cursed Tribe stage == 40.0).
- The Cursed Tribe - Quest Expansion.esp changes the opening dialogue's conditions (- The Cursed Tribe stage == 20.0).
- The Cursed Tribe - Quest Expansion.esp changes the opening dialogue's conditions (+ The Cursed Tribe stage == 10.0; - The Cursed Tribe stage < 20.0).
- The Cursed Tribe - Quest Expansion.esp changes the opening dialogue's conditions (+ The Cursed Tribe stage == 10.0; + global TRUEGlobal == 0.0 (now 1.0); + fn520 == 1.0; - The Cursed Tribe stage < 20.0).
- The Cursed Tribe - Quest Expansion.esp changes the opening dialogue's conditions (+ global TCTRC_GLOB_Stage30_IntimidatedYamarz == 1.0 (now 0.0); + GetActorValue >= SpeechEasy (now 25.0); + fn182 == 1.0).
- The Cursed Tribe - Quest Expansion.esp changes the opening dialogue's conditions (+ GetActorValue >= SpeechAverage (now 50.0); + fn182 == 1.0).
- The Cursed Tribe - Quest Expansion.esp changes the opening dialogue's conditions (+ global TCTRC_GLOB_Stage30_IntimidatedYamarz == 0.0 (now 0.0); + fn655 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013747 == 1.0; + GetIsRace Skyrim.esm:0A82B9 == 1.0; - GetIsRace Skyrim.esm:013747 == 1.0).
- The Cursed Tribe - Quest Expansion.esp changes the opening dialogue's conditions (+ The Cursed Tribe stage < 60.0; - The Cursed Tribe stage >= 50.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:0A82B9 == 0.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn130 == 0.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn130 == 1.0; + fn130 == 1.0; - fn130 == 1.0).

### The Dark Brotherhood (`DB01`, lock or key)

Own mod: Skyrim. Plugins: Innocence Lost - Quest Expansion.esp, LoreRim - Windhelm Fixes.esp, NGCDT - Distance Checks.esp, RTDocks - Shadowfoot.esp.

- The Aretino Residence door is no longer locked.
- The Shadowfoot Sanctum door needs a key (cceejsse003-hollow.esl:000829).
- Innocence Lost - Quest Expansion.esp adds the alias Guard.
- Innocence Lost - Quest Expansion.esp adds the alias Constance.
- Innocence Lost - Quest Expansion.esp changes the opening dialogue's conditions (+ global ILQE_GrelodsTrip != 1.0 (now 0.0); + fn67 == 1.0).
- Innocence Lost - Quest Expansion.esp changes the opening dialogue's conditions (+ global ILQE_GrelodsTrip != 1.0 (now 0.0)).
- Innocence Lost - Quest Expansion.esp changes the opening dialogue's conditions (+ fn67 == 1.0).
- Innocence Lost - Quest Expansion.esp changes the opening dialogue's conditions (+ fn84 >= 1.0).
- Innocence Lost - Quest Expansion.esp changes the opening dialogue's conditions (+ Innocence Lost stage != 198.0).
- Innocence Lost - Quest Expansion.esp changes the opening dialogue's conditions (+ Innocence Lost stage == 20.0; - Innocence Lost stage == 2000.0).
- NGCDT - Distance Checks.esp changes the opening dialogue's conditions (+ fn1 >= ANDR_DialogueDistanceCheck_ChildGrelod (now 512.0)).
- Innocence Lost - Quest Expansion.esp changes the opening dialogue's conditions (+ global ILQE_WinePoisoned != 2.0 (now 0.0); + global ILQE_GrelodsTrip != 2.0 (now 0.0)).

### The Dragonborn (`MQ101`, lock or key)

Own mod: Skyrim. Plugins: Additional Contracts For the Dark Brotherhood.esp, AlternatePerspective.esp, Narrative Gameplay Consistent Dialogue Tweaks.esp.

- The Helgen Keep door stays hidden until its enable parent (Skyrim.esm:025FB2) is enabled.
- The Froki's Shack door needs a key it doesn't name.
- The Helgen Keep door stays visible until its enable parent (AlternatePerspective.esp:0D09AE) is disabled.
- The Resting Pilgrim door stays visible until its enable parent (AlternatePerspective.esp:312D3C) is disabled.
- The Thalmor Embassy door stays hidden until its enable parent (Additional Contracts For the Dark Brotherhood.esp:000FEC) is enabled.
- The Helgen door needs a key it doesn't name.
- The Jacob's Farm door stays visible until its enable parent (AlternatePerspective.esp:312D3C) is disabled.
- The Abandoned House door stays visible until its enable parent (AlternatePerspective.esp:312D3C) is disabled.
- The Resting Pilgrim Cellar door stays visible until its enable parent (AlternatePerspective.esp:312D3C) is disabled.
- The Helgen Watchtower door stays visible until its enable parent (AlternatePerspective.esp:312D3C) is disabled.
- The Vilod's House door stays visible until its enable parent (AlternatePerspective.esp:312D3C) is disabled.
- The Helgen Keep door stays hidden until its enable parent (AlternatePerspective.esp:0D09AE) is enabled.
- The Skalei's Scrap door stays visible until its enable parent (AlternatePerspective.esp:312D3C) is disabled.
- The Gunnar's House door stays visible until its enable parent (AlternatePerspective.esp:312D3C) is disabled.
- AlternatePerspective.esp adds a dialogue condition: Unbound stage >= 4.0.
- AlternatePerspective.esp adds the alias HadvarLookIntoLedgerMarker.
- AlternatePerspective.esp adds the alias Prisoner02.
- AlternatePerspective.esp adds the alias CivilianSkalei.
- AlternatePerspective.esp adds the alias CivilianJacob.
- AlternatePerspective.esp adds the alias Cart1Spawn.
- AlternatePerspective.esp adds the alias Cart2Spawn.
- AlternatePerspective.esp changes the alias Cart1.
- AlternatePerspective.esp changes the alias Cart2.
- AlternatePerspective.esp adds the alias SoldierFortAssistant.
- AlternatePerspective.esp adds the alias PlayerGearChest.
- AlternatePerspective.esp changes the opening dialogue's conditions (+ global MQQuickstart < 7.0 (now 7.0)).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ fn46 == 0.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ GetIsID Skyrim.esm:0F5E0B == 1.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ Unbound stage >= 250.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ Unbound stage >= 100.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013746 == 1.0; - fn130 == 1.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013740 == 1.0; - fn130 == 1.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013741 == 1.0; - fn130 == 1.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013742 == 1.0; - fn130 == 1.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013743 == 1.0; - fn130 == 1.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013744 == 1.0; - fn130 == 1.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013745 == 1.0; - fn130 == 1.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013747 == 1.0; - fn130 == 1.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013748 == 1.0; - fn130 == 1.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013749 == 1.0; - fn130 == 1.0).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ global MQQuickstart == 7.0 (now 7.0)).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ global MQQuickstart == 0.0 (now 7.0)).
- Narrative Gameplay Consistent Dialogue Tweaks.esp changes the opening dialogue's conditions (+ global TRUEGlobal == 0.0 (now 1.0)).
- AlternatePerspective.esp changes the opening dialogue's conditions (+ global MQQuickstart == 8.0 (now 7.0); - global TRUEGlobal == 0.0 (now 1.0)).
- AlternatePerspective.esp sets the global MQQuickstart to 7.0 (was 0.0).

### The Only Cure (`DA13`, lock or key)

Own mod: Skyrim. Plugins: TOCQE - Wintersun.esp, TheOnlyCureQuestExpansion.esp.

- TheOnlyCureQuestExpansion.esp gives the alias Kesh: TheOnlyCureQuestExpansion.esp:000D65.
- TOCQE - Wintersun.esp gives the alias Kesh: TheOnlyCureQuestExpansion.esp:000D65.
- TheOnlyCureQuestExpansion.esp changes the opening dialogue's conditions (+ global DA13_AltarDestroyed == 2.0 (now 0.0)).
- TheOnlyCureQuestExpansion.esp changes the opening dialogue's conditions (+ The Only Cure stage 30 done).

### The Thieves Guild (`TG00`, lock or key)

Own mod: Skyrim. Plugins: Environs - Riften Warehouse.esp, GG's Thieves Guild Headquarters.esp, RTDocks - Shadowfoot.esp, Snazzy Interiors - Riften AIO.esp, Unofficial Skyrim Special Edition Patch.esp.

- The Riften Warehouse door stays visible until its enable parent (Environs - Riften Warehouse.esp:000998) is disabled.
- The Riftweald Manor door stays hidden until its enable parent (Snazzy Location Resources.esp:0575FF) is enabled.
- The Riftweald Manor door stays hidden until its enable parent (Snazzy Location Resources.esp:0575FE) is enabled.
- The Shadowfoot Sanctum door needs a key (cceejsse003-hollow.esl:000829).
- The Riften door stays hidden until its enable parent (Skyrim.esm:0B4081) is enabled.
- The Ragged Flagon - Cistern door stays hidden until its enable parent (Skyrim.esm:0B4081) is enabled.
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ DialogueRiftenGateGuards stage >= 20.0; - DialogueRiftenGateGuards stage 20 done; - DialogueRiftenGateGuards stage 30 done).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ DialogueRiftenGateGuards stage >= 30.0; - DialogueRiftenGateGuards stage 20 done; - DialogueRiftenGateGuards stage 30 done).

### The Unquiet Dead (`ccVSVSSE004_MainQuest`, lock or key)

Own mod: Official Master Files - Cleaned Plugins. Plugins: CC Farming - Tweaks and Enhancements.esp, Snazzy Interiors - JKs Dragonsreach.esp, Trad_AE_CC_Collection_Requiem_Patch.esp.

- The Dragonsreach door is locked (Master).
- The Goldenhills Plantation door is locked (Adept).
- CC Farming - Tweaks and Enhancements.esp changes the opening dialogue's conditions (+ global TRUEGlobal == 0.0 (now 1.0); + The Unquiet Dead stage == 200.0; + The Unquiet Dead stage == 201.0).

### The Wintersand Deception (`THTE_Quest_WintersandDeception`, lock or key)

Own mod: CC Tundra Homestead - Tweaks and Enhancements (THTE). Plugins: Snazzy Interiors - JKs Dragonsreach.esp.

- The Dragonsreach door is locked (Master).

### The Wolf Queen Awakened (`MS06Start`, lock or key)

Own mod: Skyrim. Plugins: Requiem.esp.

- The Hall of the Dead door is locked (Apprentice).

### Unfathomable Depths (`MS04`, lock or key)

Own mod: Skyrim. Plugins: RTDocks - Shadowfoot.esp, Unofficial Skyrim Special Edition Patch.esp.

- The Shadowfoot Sanctum door needs a key (cceejsse003-hollow.esl:000829).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (- Unfathomable Depths stage >= 760.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ level == -1.0).

### Vigilant (`zzzAoMMq00`, lock or key)

Own mod: VIGILANT - English Translation (Plus Voiced Addon). Plugins: Environs - Tundra Farmhouse.esp, Penitus_Oculatus.esp, Vigilant - Delayed Start.esp, photndawnstar.esp.

- The Dawnstar door stays visible until its enable parent (Penitus_Oculatus.esp:00FAF2) is disabled.
- The Winch's House door stays visible until its enable parent (Skyrim.esm:000014) is disabled.
- The Dawnstar door stays hidden until its enable parent (Penitus_Oculatus.esp:00FAF2) is enabled.
- The Dawnstar Sanctuary door stays hidden until its enable parent (Penitus_Oculatus.esp:00FAF2) is enabled.
- The Breaking Dawn Cottage door needs the Breaking Dawn Cottage Key, carried by Satchel in Nightcaller Temple.
- The Storm-Hull Farm door stays hidden until its enable parent (Environs - Tundra Farmhouse.esp:000A22) is enabled.
- The Storm-Hull Farm door stays hidden until its enable parent (Environs - Tundra Farmhouse.esp:000810) is enabled.
- Vigilant - Delayed Start.esp turns the quest's start-game flag off.

### A Night To Remember (`DA14`, condition)

Own mod: Skyrim. Plugins: LoreRim - Skyrim Revoiced Patch.esp, MoiraFollowerMod.esp, SkyrimRevoiced.esp, Unofficial Skyrim Modders Patch.esp, Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ A Night To Remember stage >= 100.0; + A Night To Remember stage < 135.0; + GetItemCount Skyrim.esm:01CB34 > 0.0; - A Night To Remember stage == 125.0).
- Unofficial Skyrim Modders Patch.esp changes the opening dialogue's conditions (+ A Night To Remember stage < 100.0; + A Night To Remember stage >= 84.0; - A Night To Remember stage < 150.0; - A Night To Remember stage >= 10.0).
- MoiraFollowerMod.esp changes the opening dialogue's conditions (+ 0MoiraFollower stage < 10.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (- fn70 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ level < 0.0).
- SkyrimRevoiced.esp changes the opening dialogue's conditions (+ fn426 == 1.0).
- LoreRim - Skyrim Revoiced Patch.esp changes the opening dialogue's conditions (+ fn426 == 1.0; - fn426 == 1.0).

### A Scroll For Anska (`dunHighGateRuinsQST`, condition)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ A Scroll For Anska stage 20 done).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (- A Scroll For Anska stage == 101.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ A Scroll For Anska stage 20 not done; + A Scroll For Anska stage == 90.0; - A Scroll For Anska stage == 0.0).

### Ancestral Worship (`dunHillgrundsTombQST`, condition)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:013742 == 1.0; + GetIsRace Skyrim.esm:08883D == 1.0; - GetIsRace Skyrim.esm:013742 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:08883D != 1.0).

### Boethiah's Calling (`DA02`, condition)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Boethiah's Calling stage >= 50.0).

### Dark Ancestor (`FreeformFalkreathQuest03`, condition)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn403 >= 1.0; - fn403 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ level >= 10.0; + fn403 >= 1.0; - level == 1.0; - fn403 == 1.0).

### Drowned Sorrows (`FreeformWinterholdC`, condition)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Drowned Sorrows stage == 15.0; - Drowned Sorrows stage == 10.0).

### Favours for townsfolk (`Favor001`, condition)

Own mod: Skyrim. Plugins: Favor Quests Seperated.esp, LoreRim - Dialogue Patch.esp, Scholar's Sting.esp.

- Favor Quests Seperated.esp adds a event condition: global TRUEGlobal == 0.0 (now 1.0).
- Favor Quests Seperated.esp changes the opening dialogue's conditions (+ global TRUEGlobal == 0.0 (now 1.0)).
- Scholar's Sting.esp changes the opening dialogue's conditions (- global TRUEGlobal == 0.0 (now 1.0)).
- LoreRim - Dialogue Patch.esp changes the opening dialogue's conditions (+ global TRUEGlobal == 0.0 (now 1.0)).

### Hendraheim (`ccEEJSSE004_Quest`, condition)

Own mod: Official Master Files - Cleaned Plugins. Plugins: Hendraheim - Tweaks and Enhancements.esp, LoreRim - Dialogue Patch.esp.

- Hendraheim - Tweaks and Enhancements.esp removes a event condition: The Silver Hand stage 200 done.
- Hendraheim - Tweaks and Enhancements.esp adds the alias Raerek.
- Hendraheim - Tweaks and Enhancements.esp adds the alias Reburrus.
- Hendraheim - Tweaks and Enhancements.esp adds the alias Player.
- Hendraheim - Tweaks and Enhancements.esp adds the alias DeedContainer.
- Hendraheim - Tweaks and Enhancements.esp adds the alias DeedImperial.
- Hendraheim - Tweaks and Enhancements.esp adds the alias DeedSons.
- LoreRim - Dialogue Patch.esp adds a event condition: The Silver Hand stage 200 done.

### In My Time Of Need (`MS08`, condition)

Own mod: Skyrim. Plugins: SaadiaToIman.esp, moretosaycityguards.esp.

- SaadiaToIman.esp adds the alias ImanRename.
- moretosaycityguards.esp changes the opening dialogue's conditions (+ In My Time Of Need stage >= 10.0; + In My Time Of Need stage <= 300.0; - In My Time Of Need stage >= 300.0).

### Infiltration (`dunTrevasWatchQST`, condition)

Own mod: Skyrim. Plugins: Infiltration - Quest Expansion.esp.

- Infiltration - Quest Expansion.esp changes the alias Brurid.
- Infiltration - Quest Expansion.esp changes the opening dialogue's conditions (+ Infiltration stage >= 1.0; + Infiltration stage <= 5.0; - Infiltration stage == 1.0).
- Infiltration - Quest Expansion.esp changes the opening dialogue's conditions (+ fn46 == 0.0).

### Lights Out! (`MS07`, condition)

Own mod: Skyrim. Plugins: SaveTheIcerunner.esp, TheChoiceIsYours.esp, Unofficial Skyrim Special Edition Patch.esp.

- SaveTheIcerunner.esp adds the alias MS07HargarsJournal.
- SaveTheIcerunner.esp adds the alias MS07Guard.
- SaveTheIcerunner.esp adds the alias MS07GuardBackup.
- SaveTheIcerunner.esp adds the alias MS07IcerunnerTreas01.
- SaveTheIcerunner.esp adds the alias MS07IcerunnerTreas02.
- SaveTheIcerunner.esp adds the alias MS07IcerunnerTreas03.
- SaveTheIcerunner.esp adds the alias MS07IcerunnerTreas04.
- SaveTheIcerunner.esp adds the alias MS07IcerunnerTreas05.
- SaveTheIcerunner.esp adds the alias MS07IcerunnerTreas06.
- TheChoiceIsYours.esp changes the opening dialogue's conditions (+ Lights Out! stage <= 50.0; + Lights Out! stage >= 8.0; - Lights Out! stage == 50.0).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ Lights Out! stage >= 10.0; - Lights Out! stage >= 8.0).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ fn46 == 0.0).
- TheChoiceIsYours.esp changes the opening dialogue's conditions (+ Lights Out! stage < 50.0; - Lights Out! stage == 50.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Lights Out! stage < 50.0; - Lights Out! stage < 60.0).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ Lights Out! stage < 10.0; - Lights Out! stage < 50.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Lights Out! stage == 50.0; - Lights Out! stage == 60.0).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ Lights Out! stage 50 done; + Lights Out! stage < 90.0; + fn629 == 0.0; + Lights Out! stage 65 done; - Lights Out! stage == 50.0).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ Lights Out! stage == 100.0; + fn46 == 0.0; - Lights Out! stage >= 60.0; - Lights Out! stage <= 100.0).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ Lights Out! stage == 125.0; - Lights Out! stage > 100.0; - Lights Out! stage < 140.0).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ Lights Out! stage 65 not done).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ Lights Out! stage 125 done).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ fn629 == 1.0; + fn46 == 0.0).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ fn629 == 1.0).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ Lights Out! stage == 8.0; - Lights Out! stage > 5.0; - Lights Out! stage < 50.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Lights Out! stage > 5.0; + Lights Out! stage < 50.0).
- SaveTheIcerunner.esp changes the opening dialogue's conditions (+ Lights Out! stage 50 done; + Lights Out! stage < 90.0; + fn629 == 0.0; + Lights Out! stage 65 done; - Lights Out! stage < 60.0; - Lights Out! stage > 10.0).

### Missing In Action (`MS09`, condition)

Own mod: Skyrim. Plugins: IDE Stormcloaks.esp, TheChoiceIsYours.esp, Unofficial Skyrim Modders Patch.esp, Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp adds the alias ThalmorGuard.
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Missing In Action stage < 45.0).
- TheChoiceIsYours.esp changes the opening dialogue's conditions (+ Missing In Action stage < 5.0; + fn67 == 0.0; - Missing In Action stage < 10.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn1 < 800.0; - fn1 < 500.0).
- IDE Stormcloaks.esp changes the opening dialogue's conditions (+ aaSonsMS09 stage < 10.0).
- IDE Stormcloaks.esp changes the opening dialogue's conditions (+ GetIsID Vidrald == 1.0; - GetIsID Geirlund == 1.0).
- IDE Stormcloaks.esp changes the opening dialogue's conditions (+ GetIsID Geirlund == 1.0; - GetIsID Vidrald == 1.0).
- IDE Stormcloaks.esp changes the opening dialogue's conditions (+ fn359 == 1.0).
- TheChoiceIsYours.esp changes the opening dialogue's conditions (+ Missing In Action stage >= 5.0; - Missing In Action stage >= 10.0).
- Unofficial Skyrim Modders Patch.esp changes the opening dialogue's conditions (+ fn73 < 5.0; - fn73 < 5.0).
- Unofficial Skyrim Modders Patch.esp changes the opening dialogue's conditions (+ fn73 >= 0.0; - fn73 >= 0.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetItemCount Skyrim.esm:0524DA >= 1.0; + Missing In Action stage < 45.0; - GetItemCount Skyrim.esm:0524DA == 1.0).

### Neloth of Tel Mithryn (`DLC2TT1`, condition)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Reluctant Steward stage == 170.0; - Old Friends stage == 170.0).

### Odd jobs in Haafingar (`SolitudeFreeform01`, condition)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn131 == 1.0; + fn629 >= 2.0).

### Odd jobs in the north (`FreeformWinterholdA`, condition)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ A Bad Trade stage == 10.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Yngol's Barrow stage < 10.0).

### Odd jobs in Whiterun Hold (`FreeformRiverwood01`, condition)

Own mod: Skyrim. Plugins: LovelyLetter.esp, NGCDT - Distance Checks - The Choice Is Yours Patch.esp, NGCDT - Distance Checks.esp, NGCDT - LovelyLetter Patch.esp.

- NGCDT - Distance Checks.esp changes the opening dialogue's conditions (+ A Lovely Letter stage 240 done; + fn1 > ANDR_DialogueDistanceCheck_SvenFaendal (now 1024.0); - A Lovely Letter stage 240 done).
- NGCDT - Distance Checks.esp changes the opening dialogue's conditions (+ A Lovely Letter stage 230 done; + fn1 > ANDR_DialogueDistanceCheck_SvenFaendal (now 1024.0); - A Lovely Letter stage 230 done).
- LovelyLetter.esp changes the opening dialogue's conditions (+ A Lovely Letter stage 220 not done).
- NGCDT - Distance Checks.esp changes the opening dialogue's conditions (+ fn1 > ANDR_DialogueDistanceCheck_SvenFaendal (now 1024.0); - A Lovely Letter stage 220 not done).
- NGCDT - LovelyLetter Patch.esp changes the opening dialogue's conditions (+ A Lovely Letter stage 220 not done).
- NGCDT - Distance Checks.esp changes the opening dialogue's conditions (+ fn1 > ANDR_DialogueDistanceCheck_SvenFaendal (now 1024.0)).
- LovelyLetter.esp changes the opening dialogue's conditions (+ fn403 < 4.0).
- NGCDT - Distance Checks.esp changes the opening dialogue's conditions (+ fn1 > ANDR_DialogueDistanceCheck_SvenFaendal (now 1024.0); - fn403 < 4.0).
- NGCDT - Distance Checks - The Choice Is Yours Patch.esp changes the opening dialogue's conditions (+ fn403 < 4.0).
- LovelyLetter.esp changes the opening dialogue's conditions (+ A Lovely Letter stage 240 not done).
- NGCDT - Distance Checks.esp changes the opening dialogue's conditions (+ fn1 > ANDR_DialogueDistanceCheck_SvenFaendal (now 1024.0); - A Lovely Letter stage 240 not done).
- NGCDT - LovelyLetter Patch.esp changes the opening dialogue's conditions (+ A Lovely Letter stage 240 not done).
- LovelyLetter.esp changes the opening dialogue's conditions (- A Lovely Letter stage 10 done).
- NGCDT - Distance Checks.esp changes the opening dialogue's conditions (+ A Lovely Letter stage 10 done; + fn1 > ANDR_DialogueDistanceCheck_SvenFaendal (now 1024.0)).
- NGCDT - LovelyLetter Patch.esp changes the opening dialogue's conditions (- A Lovely Letter stage 10 done).
- LovelyLetter.esp changes the opening dialogue's conditions (- A Lovely Letter stage 110 done).
- NGCDT - Distance Checks.esp changes the opening dialogue's conditions (+ A Lovely Letter stage 110 done; + fn1 > ANDR_DialogueDistanceCheck_SvenFaendal (now 1024.0)).
- NGCDT - LovelyLetter Patch.esp changes the opening dialogue's conditions (- A Lovely Letter stage 110 done).
- NGCDT - LovelyLetter Patch.esp changes the opening dialogue's conditions (+ fn403 < 4.0).
- NGCDT - LovelyLetter Patch.esp changes the opening dialogue's conditions (+ fn1 > ANDR_DialogueDistanceCheck_SvenFaendal (now 1024.0)).

### Promises to Keep (`MS03`, condition)

Own mod: Skyrim. Plugins: TheChoiceIsYours.esp, Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Promises to Keep stage >= 15.0; - Promises to Keep stage >= 10.0).
- TheChoiceIsYours.esp changes the opening dialogue's conditions (+ Promises to Keep stage >= 5.0; - Promises to Keep stage >= 10.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Promises to Keep stage >= 20.0; - Promises to Keep stage >= 10.0).

### Rise in the East (`MS10`, condition)

Own mod: Skyrim. Plugins: AI Overhaul.esp, TheChoiceIsYours.esp, Unofficial Skyrim Special Edition Patch.esp.

- TheChoiceIsYours.esp changes the opening dialogue's conditions (+ Rise in the East stage == 10.0; + Rise in the East stage == 5.0; - Rise in the East stage == 10.0).
- TheChoiceIsYours.esp changes the opening dialogue's conditions (+ Rise in the East stage >= 5.0; - Rise in the East stage >= 10.0).
- AI Overhaul.esp changes the opening dialogue's conditions (+ fn359 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Rise in the East stage < 40.0; - Rise in the East stage < 50.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Rise in the East stage == 40.0; - Rise in the East stage >= 40.0; - Rise in the East stage < 50.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Rise in the East stage >= 41.0; + Rise in the East stage < 80.0; - Rise in the East stage >= 50.0; - Rise in the East stage < 100.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Rise in the East stage >= 80.0; - Rise in the East stage >= 100.0).

### Seeking A Cure (`VC01`, condition)

Own mod: Skyrim. Plugins: RisingAtDawnQuestOverhaul.esp.

- RisingAtDawnQuestOverhaul.esp adds the alias RitualMarkerHeading.
- RisingAtDawnQuestOverhaul.esp adds the alias RitualCircleTrigger.
- RisingAtDawnQuestOverhaul.esp adds the alias RitualCircleCenter.
- RisingAtDawnQuestOverhaul.esp adds the alias RitualLight.
- RisingAtDawnQuestOverhaul.esp adds the alias RitualSFXLoop.
- RisingAtDawnQuestOverhaul.esp adds the alias FalionsHouseSceneTrigger.
- RisingAtDawnQuestOverhaul.esp adds the alias FalionsHouseSceneFalionStartMarker.
- RisingAtDawnQuestOverhaul.esp adds the alias FalionsHouseSceneFalionEndMarker.
- RisingAtDawnQuestOverhaul.esp adds the alias FalionsHouseSceneAgniStartMarker.
- RisingAtDawnQuestOverhaul.esp adds the alias FalionsHouseScenePlayerMarker.
- RisingAtDawnQuestOverhaul.esp adds the alias Agni.
- RisingAtDawnQuestOverhaul.esp adds the alias Urag.
- RisingAtDawnQuestOverhaul.esp adds the alias UragSearchMarker.
- RisingAtDawnQuestOverhaul.esp adds the alias BookUndeath.
- RisingAtDawnQuestOverhaul.esp adds the alias NoteInBook.
- RisingAtDawnQuestOverhaul.esp adds the alias CurePotion.
- RisingAtDawnQuestOverhaul.esp changes the opening dialogue's conditions (+ Seeking A Cure stage == 3.0; - Seeking A Cure stage >= 10.0; - Seeking A Cure stage <= 50.0).
- RisingAtDawnQuestOverhaul.esp changes the opening dialogue's conditions (+ Seeking A Cure stage == 3.0; - Seeking A Cure stage >= 1000.0; - Seeking A Cure stage <= 50.0).
- RisingAtDawnQuestOverhaul.esp changes the opening dialogue's conditions (+ fn560 == 1.0).
- RisingAtDawnQuestOverhaul.esp changes the opening dialogue's conditions (+ Seeking A Cure stage == 3.0; - fn654 == 1.0; - Seeking A Cure stage == 100.0).
- RisingAtDawnQuestOverhaul.esp changes the opening dialogue's conditions (+ Seeking A Cure stage == 3.0; - Seeking A Cure stage == 100.0).
- RisingAtDawnQuestOverhaul.esp changes the opening dialogue's conditions (+ Seeking A Cure stage == 3.0; - Seeking A Cure stage == 195.0).
- RisingAtDawnQuestOverhaul.esp changes the opening dialogue's conditions (+ Seeking A Cure stage == 3.0; - Seeking A Cure stage == 175.0).

### Siege on the Dragon Cult (`dunForelhostQST`, condition)

Own mod: Skyrim. Plugins: IDE Thalmor.esp.

- IDE Thalmor.esp changes the opening dialogue's conditions (+ global aaThalmorValmirTruth == 0.0 (now 0.0)).

### Skaal Village (`DLC2SV01`, condition)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the alias FourthPuzzleSolveTriggers.
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn67 == 1.0; - fn67 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn161 == 1.0; - fn161 == 1.0).

### Telrav's Request (`dunNilheimQST`, condition)

Own mod: Skyrim. Plugins: Nilheim_MiscQuestExpansion.esp, Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp adds the alias banditA.
- Unofficial Skyrim Special Edition Patch.esp adds the alias banditB.
- Unofficial Skyrim Special Edition Patch.esp adds the alias banditC.
- Unofficial Skyrim Special Edition Patch.esp adds the alias banditD.
- Unofficial Skyrim Special Edition Patch.esp adds the alias banditE.
- Nilheim_MiscQuestExpansion.esp changes the opening dialogue's conditions (+ Telrav's Request stage < 10.0).
- Nilheim_MiscQuestExpansion.esp changes the opening dialogue's conditions (+ Telrav's Request stage != 130.0; - Telrav's Request stage == 0.0).

### The Affairs of Hagravens (`dunBlindCliffQST`, condition)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:0A82B9 != 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:0A82B9 == 1.0; + GetIsRace Skyrim.esm:08883A == 1.0; + GetIsRace Skyrim.esm:088845 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:08883C != 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:08883C == 1.0; + GetIsRace Skyrim.esm:088794 == 1.0; + GetIsRace Skyrim.esm:088846 == 1.0; + GetIsRace Skyrim.esm:088884 == 1.0; + GetIsRace Skyrim.esm:088840 == 1.0; + GetIsRace Skyrim.esm:08883D == 1.0; + GetIsRace Skyrim.esm:088844 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsRace Skyrim.esm:08883C == 1.0; + GetIsRace Skyrim.esm:013747 == 1.0; + GetIsRace Skyrim.esm:0A82B9 == 1.0; - GetIsRace Skyrim.esm:013747 == 1.0).

### The Bards College (`MS05`, condition)

Own mod: Skyrim. Plugins: TheGiftofSaturalia.esp, Unofficial Skyrim Special Edition Patch.esp, Vittorias Alternate Wedding.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn629 != 3.0; - GetIsID Skyrim.esm:000000 != 3.0).
- TheGiftofSaturalia.esp changes the opening dialogue's conditions (+ GetQuestRunning A Song in the Dark == 0.0).
- Vittorias Alternate Wedding.esp changes the opening dialogue's conditions (+ GetQuestRunning Bound Until Death == 0.0; + GetQuestRunning A Healing Wedding == 0.0; - Bound Until Death stage >= 10.0; - Bound Until Death stage <= 20.0).
- Vittorias Alternate Wedding.esp changes the opening dialogue's conditions (+ A Healing Wedding stage >= 10.0; + A Healing Wedding stage <= 20.0).

### The Black Star (`DA01`, condition)

Own mod: Skyrim. Plugins: Missing Follower Dialogue Fix.esp, Unofficial Skyrim Special Edition Patch.esp.

- Missing Follower Dialogue Fix.esp changes the opening dialogue's conditions (+ GetInFaction Skyrim.esm:05C84E == 0.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ The Black Star stage 30 not done).

### The Bonds of Matrimony (`RelationshipMarriage`, condition)

Own mod: Skyrim. Plugins: LoreRim - Skyrim Revoiced Patch.esp, NPCs_Wear_Amulets_Of_Mara.esp, Unofficial Skyrim Special Edition Patch.esp.

- NPCs_Wear_Amulets_Of_Mara.esp changes the opening dialogue's conditions (+ fn726 == 0.0).
- NPCs_Wear_Amulets_Of_Mara.esp changes the opening dialogue's conditions (+ fn726 == 1.0; + The Bonds of Matrimony stage 10 done; + GetIsRace Skyrim.esm:013746 == 1.0; + GetIsRace Skyrim.esm:088794 == 1.0; - The Bonds of Matrimony stage 10 done).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (- GetQuestRunning Skyrim.esm:000000 == 0.0).
- NPCs_Wear_Amulets_Of_Mara.esp changes the opening dialogue's conditions (+ fn726 == 1.0; - The Bonds of Matrimony stage 5 not done).
- LoreRim - Skyrim Revoiced Patch.esp changes the opening dialogue's conditions (+ fn426 == 1.0; + fn426 == 1.0).
- LoreRim - Skyrim Revoiced Patch.esp changes the opening dialogue's conditions (+ fn426 == 1.0).
- LoreRim - Skyrim Revoiced Patch.esp changes the opening dialogue's conditions (+ fn426 == 1.0; + fn426 == 1.0; + fn426 == 1.0).

### The Book of Love (`t02`, condition)

Own mod: Skyrim. Plugins: Andrealphus Scene Tweaks.esp, TT_FastredsAwakening.esp, Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ The Book of Love stage 70 not done; - The Book of Love stage 60 not done).
- TT_FastredsAwakening.esp changes the opening dialogue's conditions (+ GetQuestRunning The Book of Love - Fastred's Choice == 0.0).
- Andrealphus Scene Tweaks.esp changes the opening dialogue's conditions (+ level == -1.0).

### The College of Winterhold (`MG01`, condition)

Own mod: Skyrim. Plugins: College Of Winterhold - Quest Expansion.esp, CollegeEntry.esp, Requiem.esp, Unofficial Skyrim Special Edition Patch.esp.

- CollegeEntry.esp changes the opening dialogue's conditions (+ GetItemCount Skyrim.esm:0A271E == 0.0; + fn264 == 0.0; - GetItemCount Skyrim.esm:0A2727 == 0.0; - fn264 == 0.0).
- CollegeEntry.esp changes the opening dialogue's conditions (+ global MGI_FaraldaSellsSpells == 1.0 (now 0.0)).
- CollegeEntry.esp changes the opening dialogue's conditions (+ GetItemCount Skyrim.esm:0A271E == 0.0; + fn264 == 0.0; + global MGI_FaraldaSellsSpells == 1.0 (now 0.0); - GetItemCount Skyrim.esm:0A2727 == 0.0; - fn264 == 0.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn130 == 0.0; + fn130 == 0.0; + fn130 == 0.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ fn130 == 1.0; + fn130 == 1.0; + fn130 == 1.0; + fn130 == 1.0; + fn130 == 1.0; + fn130 == 1.0; - fn130 == 0.0; - fn130 == 0.0; - fn130 == 0.0).
- Requiem.esp changes the opening dialogue's conditions (+ fn264 == 0.0).
- Requiem.esp changes the opening dialogue's conditions (+ fn264 == 1.0; + fn264 == 1.0; - fn264 == 1.0).
- College Of Winterhold - Quest Expansion.esp changes the opening dialogue's conditions (+ fn237 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Seeking Disclosure stage 20 not done; - Seeking Disclosure stage 25 not done).
- CollegeEntry.esp changes the opening dialogue's conditions (+ fn630 == 1.0; + First Lessons stage < 30.0; - fn630 == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Elder Knowledge stage >= 50.0; - Elder Knowledge stage == 50.0).
- CollegeEntry.esp changes the opening dialogue's conditions (+ The Way of the Voice completed; - Elder Knowledge stage >= 50.0).
- CollegeEntry.esp changes the opening dialogue's conditions (+ fn264 == 0.0; + global MGI_FaraldaSellsSpells == 1.0 (now 0.0); - fn264 == 0.0).

### The Ebony Warrior (`DLC2EbonyWarriorQuest`, condition)

Own mod: Skyrim. Plugins: EbonyGetLost.esp.

- EbonyGetLost.esp changes the opening dialogue's conditions (+ The Ebony Warrior stage <= 100.0; - The Ebony Warrior stage < 100.0).

### The Forsworn Conspiracy (`MS01`, condition)

Own mod: Skyrim. Plugins: TheChoiceIsYours.esp.

- TheChoiceIsYours.esp changes the opening dialogue's conditions (+ fn161 == 0.0).

### The Golden Claw (`MS13`, condition)

Own mod: Skyrim. Plugins: Riverwood Trader Is A Mess.esp.

- Riverwood Trader Is A Mess.esp changes the opening dialogue's conditions (+ global ANDR_PlayerHelpingLucanCleanUpStatus == 0.0 (now 0.0)).

### The Heart of Dibella (`T01`, condition)

Own mod: Skyrim. Plugins: The Heart Of Dibella - Quest Expansion.esp, Unofficial Skyrim Special Edition Patch.esp.

- The Heart Of Dibella - Quest Expansion.esp adds the alias Madanach.
- The Heart Of Dibella - Quest Expansion.esp changes the opening dialogue's conditions (+ The Heart of Dibella stage 57 not done).
- The Heart Of Dibella - Quest Expansion.esp changes the opening dialogue's conditions (+ global T01_QE_AlternativeLocation == 0.0 (now 0.0)).
- The Heart Of Dibella - Quest Expansion.esp changes the opening dialogue's conditions (+ The Heart of Dibella stage < 55.0; - The Heart of Dibella stage < 60.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ T01DegaineFavor stage 100 not done).
- The Heart Of Dibella - Quest Expansion.esp changes the opening dialogue's conditions (+ The Heart of Dibella stage < 60.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ T01DegaineFavor stage 10 not done).

### The House of Horrors (`DA10`, condition)

Own mod: Skyrim. Plugins: House of Horrors - Delayed Start.esp, HouseOfHorrorsQuestExpansion.esp, Requiem.esp, Wintersun - Reqtificated.esp.

- HouseOfHorrorsQuestExpansion.esp adds the alias FriendlyVigilant.
- Wintersun - Reqtificated.esp adds the alias FriendlyVigilant.
- HouseOfHorrorsQuestExpansion.esp changes the opening dialogue's conditions (+ The House of Horrors stage != 210.0; + The House of Horrors stage != 54.0).
- HouseOfHorrorsQuestExpansion.esp changes the opening dialogue's conditions (+ The House of Horrors stage != 54.0; + The House of Horrors stage != 210.0).
- Requiem.esp changes the opening dialogue's conditions (+ GetQuestRunning The House of Horrors == 1.0).
- House of Horrors - Delayed Start.esp changes the opening dialogue's conditions (+ global TRUEGlobal == 0.0 (now 1.0); - GetQuestRunning The House of Horrors == 1.0).

### The Mind of Madness (`DA15`, condition)

Own mod: Skyrim. Plugins: The Mind of Madness - Delayed Start.esp, Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ The Mind of Madness stage < 10.0; - The Black Star stage < 10.0).
- The Mind of Madness - Delayed Start.esp changes the opening dialogue's conditions (+ global ANDR_DA15_Ready == 1.0 (now 0.0)).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ DA15Loathing stage 200 done; + DA15Paranoia stage 200 done; + DA15Terror stage 200 done; - DA15Loathing completed; - DA15Paranoia completed; - DA15Terror completed).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ DA15Loathing stage 200 done; + DA15Paranoia stage 200 done; - DA15Loathing completed; - DA15Paranoia completed).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ DA15Loathing stage 200 done; + DA15Terror stage 200 done; - DA15Loathing completed; - DA15Terror completed).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ DA15Paranoia stage 200 done; + DA15Terror stage 200 done; - DA15Terror completed; - DA15Paranoia completed).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (- The Black Star stage < 100.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetActorValue >= SpeechEasy (now 25.0); + fn182 == 1.0).
- The Mind of Madness - Delayed Start.esp changes the opening dialogue's conditions (+ global ANDR_DA15_Ready == 1.0 (now 0.0); - fn77 <= 10.0; - The Mind of Madness stage == 0.0).

### The Taste of Death (`DA11`, condition)

Own mod: Skyrim. Plugins: LoreRim - Global Modifiers.esp, The Taste of Death - Delayed Start.esp.

- The Taste of Death - Delayed Start.esp changes the opening dialogue's conditions (+ Investigate the Hall of the Dead stage < 5.0; + level >= ANDR_DA11_LevelReq (now 20.0)).
- LoreRim - Global Modifiers.esp sets the global ANDR_DA11_LevelReq to 20.0 (was 40.0).

### The Whispering Door (`DA08`, condition)

Own mod: Skyrim. Plugins: TWDQE - Wintersun patch.esp, The Whispering Door - Quest Expansion.esp, The Whispering Door QE - USSEP Patch.esp, Unofficial Skyrim Special Edition Patch.esp.

- The Whispering Door - Quest Expansion.esp adds the alias Fianna.
- The Whispering Door - Quest Expansion.esp adds the alias Vigilant.
- The Whispering Door - Quest Expansion.esp adds the alias Alias_DoorJail.
- The Whispering Door - Quest Expansion.esp adds the alias Alias_MiniDoorJail.
- TWDQE - Wintersun patch.esp adds the alias Fianna.
- TWDQE - Wintersun patch.esp adds the alias Vigilant.
- TWDQE - Wintersun patch.esp adds the alias Alias_DoorJail.
- TWDQE - Wintersun patch.esp adds the alias Alias_MiniDoorJail.
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ GetIsID Nelkir == -1.0; + fn629 == 1.0; - GetIsID Nelkir == 1.0).
- The Whispering Door - Quest Expansion.esp changes the opening dialogue's conditions (+ global DA08_HelpingJarl == 0.0 (now 0.0); + GetIsID Nelkir == 1.0; + fn606 == CWImperial (now 1.0); - GetIsID Nelkir == -1.0).
- The Whispering Door QE - USSEP Patch.esp changes the opening dialogue's conditions (+ GetIsID Nelkir == -1.0; - GetIsID Nelkir == 1.0).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ The Whispering Door stage == -1.0).
- The Whispering Door - Quest Expansion.esp changes the opening dialogue's conditions (- The Whispering Door stage == -1.0).
- The Whispering Door QE - USSEP Patch.esp changes the opening dialogue's conditions (+ The Whispering Door stage == -1.0).
- The Whispering Door - Quest Expansion.esp changes the opening dialogue's conditions (+ The Whispering Door stage != 45.0; - The Whispering Door stage == -1.0).
- The Whispering Door - Quest Expansion.esp changes the opening dialogue's conditions (+ The Whispering Door stage != 43.0; + The Whispering Door stage != 44.0; + The Whispering Door stage != 45.0; - The Whispering Door stage == -1.0).

### The White Phial (`MS12`, condition)

Own mod: Skyrim. Plugins: NGCDT - Nurelion - The Choice Is Yours Patch.esp, NGCDT - Nurelion Edits.esp, TheChoiceIsYours.esp.

- NGCDT - Nurelion Edits.esp changes the opening dialogue's conditions (- fn131 == 1.0).
- NGCDT - Nurelion Edits.esp changes the opening dialogue's conditions (+ global TRUEGlobal == 0.0 (now 1.0)).
- TheChoiceIsYours.esp changes the opening dialogue's conditions (+ fn629 != 1.0).
- TheChoiceIsYours.esp changes the opening dialogue's conditions (+ The White Phial stage < 10.0).
- NGCDT - Nurelion Edits.esp changes the opening dialogue's conditions (- The White Phial stage < 10.0).
- NGCDT - Nurelion - The Choice Is Yours Patch.esp changes the opening dialogue's conditions (+ The White Phial stage < 10.0).

### Thirsk Mead Hall (`DLC2MH01`, condition)

Own mod: Skyrim. Plugins: Unofficial Skyrim Special Edition Patch.esp.

- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ level == -1.0).

### Toying With The Dead (`FreeformRiften21`, condition)

Own mod: Skyrim. Plugins: Toying With The Dead mQE.esp, Unofficial Skyrim Special Edition Patch.esp.

- Toying With The Dead mQE.esp adds the alias FFRiften21JarlPale.
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ Toying With The Dead stage 40 not done).
- Unofficial Skyrim Special Edition Patch.esp changes the opening dialogue's conditions (+ global FFRiften21JFound < 1.0 (now 0.0)).

### Waking Nightmare (`DA16`, condition)

Own mod: Skyrim. Plugins: Erandur Dialogue Edits.esp.

- Erandur Dialogue Edits.esp changes the opening dialogue's conditions (- GetIsRace Skyrim.esm:013747 == 1.0).
- Erandur Dialogue Edits.esp changes the opening dialogue's conditions (- GetIsRace Skyrim.esm:013747 == 0.0).

### Discerning the Transmundane (`DA04`, global)

Own mod: Skyrim. Plugins: Requiem.esp.

- Requiem.esp sets the global DA04MinLevel to 20.0 (was 15.0).

### Wyrmstooth (`WTDragonHunt`, global)

Own mod: Wyrmstooth. Plugins: Requiem - Wyrmstooth.esp.

- Requiem - Wyrmstooth.esp sets the global WTStartLevel to 20.0 (was 10.0).

### Extracting an Argonian (`DarkwaterCrossingDerkeethusRescueQuest`, other)

Own mod: Skyrim. Plugins: Finding_Derkeethus.esp.

- Finding_Derkeethus.esp adds the alias Derk_Spot.

### Trius' Trinket (`dunShipwreck04QST`, other)

Own mod: Skyrim. Plugins: Unofficial Skyrim Modders Patch.esp.

- Unofficial Skyrim Modders Patch.esp turns the quest's start-game flag off.

### Undeath (`NecroQuest01`, other)

Own mod: Undeath Remastered - CLEANED ESMIFIED. Plugins: UndeathFixes.esp.

- UndeathFixes.esp turns the quest's start-game flag off.

## Every line

| Line | Opening | Own mod | Start-game | Doors into its places (locked) | Globals | Changed by another plugin |
| --- | --- | --- | --- | --- | --- | --- |
| The Dragonborn | `MQ101` | Skyrim |  | 51 (6) | MQQuickstart=7.0 | alias, condition, dialogue, door: hidden, door: key, door: shown, global |
| Dawnguard | `DLC1VQ01MiscObjective` | Skyrim |  | 14 (2) |  | alias, door: hidden, door: key |
| Dragonborn | `DLC2MQ01` | Skyrim |  | 10 (2) | DLC2MQ01NelothGlobal=0.0, DLC2MetNelothAtTelMithryn=0.0 |  |
| The Companions | `C00` | Skyrim | yes | 14 (0) | _JQ_SkjorAdviceGiven=0.0, _JQ_AdviceShouldBeGiven=0.0, NGCDT_GLOB_Aela_AVMin=30.0, NGCDT_GLOB_Aela_HMSMin=150.0, NGCDT_GLOB_AelaGreetingDone=0.0, GameDaysPassed=1.0 | dialogue, door: hidden |
| The College of Winterhold | `MG01` | Skyrim | yes | 15 (3) | MGI_FaraldaSellsSpells=0.0, SpeechVeryHard=100.0 | dialogue |
| The Thieves Guild | `TG00` | Skyrim | yes | 91 (25) | SpeechHard=75.0 | dialogue, door: hidden, door: key |
| The Dark Brotherhood | `DB01` | Skyrim | yes | 26 (6) | ILQE_GrelodArrested=0.0, ILQE_RoomDiscovered=0.0, ILQE_WinePoisoned=0.0, ILQE_GrelodsTrip=0.0, ANDR_DialogueDistanceCheck_ChildGrelod=512.0 | alias, dialogue, door: key, door: unlocked |
| The Civil War | `CW01A` | Skyrim |  | 8 (0) |  |  |
| The Bards College | `MS05` | Skyrim | yes | 20 (0) | SpeechEasy=25.0, SpeechAverage=50.0 | dialogue |
| Vigilant | `zzzAoMMq00` | VIGILANT - English Translation (Plus Voiced Addon) |  | 61 (13) |  | door: hidden, door: key, start game |
| Meridia's Order | `NMeridia01` | Meridia's Order ESMIFIED | yes | 5 (0) |  |  |
| Penitus Oculatus | `zzzPO00` | Penitus Oculatus | yes | 7 (0) | zzzPOLegionRequirementMet=0.0 |  |
| A Daedra's Best Friend | `DA03` | Skyrim |  | 3 (0) |  |  |
| A Night To Remember | `DA14` | Skyrim |  | 10 (3) | SpeechAverage=50.0, SpeechHard=75.0 | dialogue |
| Boethiah's Calling | `DA02` | Skyrim |  | 9 (0) | TRUEGlobal=1.0 | dialogue |
| Discerning the Transmundane | `DA04` | Skyrim | yes | 10 (0) | DA04MinLevel=20.0 | global |
| Ill Met By Moonlight | `DA05` | Skyrim | yes | 6 (0) |  |  |
| Pieces of the Past | `DA07` | Skyrim | yes | 21 (4) | SpeechHard=75.0 | door: key |
| The Black Star | `DA01` | Skyrim | yes | 17 (3) | SpeechEasy=25.0 | dialogue |
| The Break of Dawn | `DA09` | Skyrim |  | 5 (1) |  |  |
| The Cursed Tribe | `DA06` | Skyrim |  | 4 (0) | TRUEGlobal=1.0, SpeechEasy=25.0, SpeechAverage=50.0, TCTRC_GLOB_Stage30_IntimidatedYamarz=0.0 | alias, alias items, dialogue |
| The House of Horrors | `DA10` | Skyrim |  | 46 (9) | HOH_Waiting=0.0, HOH_TyranusShutUp=0.0, TRUEGlobal=1.0, PlayerAnimalCount=0.0, SpeechAverage=50.0 | alias, dialogue |
| The Mind of Madness | `DA15` | Skyrim | yes | 11 (0) | SpeechEasy=25.0, ANDR_DA15_Ready=0.0 | dialogue |
| Saints and Seducers | `EC_SS_MQ101` | Skyrim Extended Cut - Saints and Seducers |  | 7 (2) |  |  |
| The Only Cure | `DA13` | Skyrim |  | 4 (0) | DA13_AltarDestroyed=0.0 | alias items, dialogue |
| The Taste of Death | `DA11` | Skyrim | yes | 29 (7) | SpeechEasy=25.0, ANDR_DA11_LevelReq=20.0 | dialogue, global |
| The Whispering Door | `DA08` | Skyrim | yes | 15 (0) | CWImperial=1.0, SpeechEasy=25.0, DA08_HelpingJarl=0.0 | alias, dialogue |
| Waking Nightmare | `DA16` | Skyrim | yes | 4 (0) |  | dialogue |
| Sleepwalking Into A Nightmare | `aaaMBQuest` | Sleepwalking Into A Nightmare - New Daedric Prince Quest |  | 5 (2) |  |  |
| Wyrmstooth | `WTDragonHunt` | Wyrmstooth |  | 1 (0) | WTStartLevel=20.0 | global |
| Journey to Baan Malur | `DefunctQuest02` | Journey to Baan Malur and Morrowind |  | 2 (0) |  |  |
| Siege at Icemoth | `HYORdunIcemothQST` | Siege at Icemoth | yes | 9 (0) |  |  |
| The Gray Cowl of Nocturnal | `manny_GF_MQ` | The Gray Cowl of Nocturnal - 10th anniversary | yes | 21 (2) |  |  |
| The Forgotten City | `000FCQuest01` | The Forgotten City |  | 29 (0) | SpeechAverage=50.0 |  |
| Gravewind | `GRVEMainQuest01` | Gravewind - ESMIFIED | yes | 2 (1) |  | door: key |
| Raven Rock | `DLC2RR01` | Skyrim |  | 17 (4) | DLC2RR01Dia01=0.0 |  |
| Thirsk Mead Hall | `DLC2MH01` | Skyrim |  | 2 (0) |  | dialogue |
| Neloth of Tel Mithryn | `DLC2TT1` | Skyrim |  | 4 (0) |  | dialogue |
| Skaal Village | `DLC2SV01` | Skyrim |  | 9 (2) | DLC2SV01WallsTranslated=0.0, DLC2TharstanCommentNextAllowed=0.0, DLC2SV01CommentChance=75.0, GameDaysPassed=1.0 | alias, dialogue |
| The Black Books | `DLC2BlackBook03Quest` | Skyrim |  | 0 (0) |  |  |
| The Ebony Warrior | `DLC2EbonyWarriorQuest` | Skyrim |  | 0 (0) | DLC2EBRun=0.0 | dialogue |
| Deathbrand | `DLC2dunHaknirTreasureQST` | Skyrim |  | 1 (1) |  | door: key |
| Unearthed | `DLC2dunKolbjornQST` | Skyrim |  | 2 (0) | SpeechEasy=25.0 |  |
| Filial Bonds | `DLC2WB01` | Skyrim |  | 1 (0) |  |  |
| The Kagrumez Gauntlet | `DLC2KagrumezQST` | Skyrim |  | 1 (0) | PlayerAnimalCount=0.0 |  |
| Miasma | `RE01MiasmaQst` | Miasma | yes | 3 (1) |  |  |
| Destroy the Acolyte Priests | `EnoAcolyteQuest` | Destroy the Acolyte Priests |  | 7 (0) |  |  |
| The Forsworn Conspiracy | `MS01` | Skyrim | yes | 30 (7) | SpeechVeryEasy=10.0, SpeechEasy=25.0, SpeechAverage=50.0 | dialogue |
| Promises to Keep | `MS03` | Skyrim | yes | 16 (1) | SpeechEasy=25.0 | dialogue |
| Unfathomable Depths | `MS04` | Skyrim |  | 24 (6) |  | dialogue, door: key |
| The Wolf Queen Awakened | `MS06Start` | Skyrim | yes | 16 (1) |  | door: locked |
| Lights Out! | `MS07` | Skyrim | yes | 19 (0) | SpeechAverage=50.0 | alias, dialogue |
| In My Time Of Need | `MS08` | Skyrim | yes | 9 (0) |  | alias, dialogue |
| Missing In Action | `MS09` | Skyrim | yes | 7 (2) | SpeechHard=75.0 | alias, dialogue |
| Rise in the East | `MS10` | Skyrim | yes | 10 (3) |  | dialogue |
| Blood on the Ice | `MS11` | Skyrim |  | 52 (9) |  | alias, dialogue, door: hidden |
| The White Phial | `MS12` | Skyrim | yes | 6 (1) | TRUEGlobal=1.0 | dialogue |
| The Golden Claw | `MS13` | Skyrim | yes | 17 (4) | ANDR_PlayerHelpingLucanCleanUpStatus=0.0 | dialogue |
| Laid to Rest | `MS14` | Skyrim | yes | 22 (7) |  | dialogue, door: hidden |
| A Return To Your Roots | `NN01` | Skyrim | yes | 4 (0) |  |  |
| The Heart of Dibella | `T01` | Skyrim | yes | 33 (8) | T01_QE_PlayerChoice=0.0, T01_QE_AlternativeLocation=0.0 | alias, dialogue |
| The Blessings of Nature | `T03` | Skyrim | yes | 2 (0) |  |  |
| The Book of Love | `t02` | Skyrim | yes | 15 (0) |  | dialogue |
| Seeking A Cure | `VC01` | Skyrim | yes | 5 (1) |  | alias, dialogue |
| Falion's Secret | `FreeformMorthalA` | Skyrim | yes | 27 (10) |  | dialogue, door: hidden, door: key |
| Repentance | `dunDarklightQST` | Skyrim | yes | 2 (0) |  |  |
| Siege on the Dragon Cult | `dunForelhostQST` | Skyrim |  | 2 (1) | aaThalmorValmirTruth=0.0 | dialogue |
| The Pale Lady | `dunFrostmereCryptQST` | Skyrim |  | 11 (4) |  |  |
| Forbidden Legend | `dunGauldursonQST` | Skyrim |  | 5 (0) |  |  |
| A Scroll For Anska | `dunHighGateRuinsQST` | Skyrim |  | 1 (0) |  | dialogue |
| Ancestral Worship | `dunHillgrundsTombQST` | Skyrim |  | 1 (1) |  | dialogue |
| Kyne's Sacred Trials | `dunHunterQST` | Skyrim |  | 3 (1) |  | dialogue, door: key |
| The Lost Expedition | `dunNchuandZelQst` | Skyrim |  | 5 (0) |  |  |
| Trius' Trinket | `dunShipwreck04QST` | Skyrim |  | 0 (0) |  | start game |
| Infiltration | `dunTrevasWatchQST` | Skyrim |  | 5 (0) | SpeechEasy=25.0, SpeechAverage=50.0, SpeechHard=75.0, SpeechVeryHard=100.0 | alias, dialogue |
| Evil in Waiting | `dunValthumeQST` | Skyrim |  | 1 (0) |  |  |
| Silenced Tongues | `dunVolunruudQST` | Skyrim |  | 1 (0) |  |  |
| Yngol's Barrow | `dunYngolBarrowQST` | Skyrim |  | 2 (0) |  |  |
| The Affairs of Hagravens | `dunBlindCliffQST` | Skyrim |  | 3 (0) |  | dialogue |
| Telrav's Request | `dunNilheimQST` | Skyrim | yes | 0 (0) |  | alias, dialogue |
| Search and Seizure | `FreeformMarkarthM` | Skyrim |  | 7 (0) |  |  |
| Toying With The Dead | `FreeformRiften21` | Skyrim | yes | 6 (0) | FFRiften21JFound=0.0 | alias, dialogue |
| Extracting an Argonian | `DarkwaterCrossingDerkeethusRescueQuest` | Skyrim | yes | 3 (0) |  | alias |
| Dark Ancestor | `FreeformFalkreathQuest03` | Skyrim | yes | 1 (0) |  | dialogue |
| Drowned Sorrows | `FreeformWinterholdC` | Skyrim |  | 13 (2) |  | dialogue |
| The Forgemaster's Fingers | `FavorOrcsIntro` | Skyrim |  | 0 (0) |  |  |
| Lost to the Ages | `DLC1LD` | Skyrim |  | 9 (0) | DLC1LD_ShardsFound=0.0 |  |
| A Forgotten Blade | `madFultheimQuest` | Redeeming Fultheim - A Blades Quest Addon | yes | 11 (0) |  |  |
| Destroy the Dragon Cult | `DCQuest` | Defeat the Dragon Cult | yes | 13 (0) |  |  |
| Undeath | `NecroQuest01` | Undeath Remastered - CLEANED ESMIFIED |  | 3 (1) |  | start game |
| Granite Hill | `aaaGraniteHillDungeonQuest` | Granite Hill - ESLIFIED LUX PATCH |  | 1 (0) |  |  |
| Legends of Aetherium | `aaaLOAQuest` | Legends of Aetherium - New Dungeon - Quest - Armour - Weapons | yes | 4 (0) |  |  |
| The Tools of Kagrenac | `TOK_QUST_KagrenacTools` | The Tools of Kagrenac ESMIFIED |  | 18 (6) |  |  |
| Deluge of Deceit | `EVGSirenrootQuest` | SIRENROOT - Deluge of Deceit | yes | 7 (1) | EVGSirenIngunScholar=0.0, EVGSirenCampTilMaormer=0.0, EVGSiren02TilWoke=0.0, EVGSiren02TilDecisionSafety=1.0, EVGSirenCayriceCamp=0.0, EVGSirenTalkedCayrice04a=0.0, EVGSiren04PeletiusDecision=0.0, EVGSirenCayriceBookVar=0.0, EVGSirenDebuff=0.0, EVGSiren05TilaelSaved=0.0, EVGSirenPrePeletiusDecision=0.0, EVGSiren05YineelWarned=0.0, EVGSirenCayriceMain=0.0, EVGSirenPeletiusMain=0.0, EVGSirenTilaelMain=0.0, EVGSirenCayrice3Count=0.0, EVGSirenPeletiusCampQ=0.0, EVGSirenYineelMain=0.0, EVGSiren08FoundC=0.0, EVGSirenCampYineelMerc=0.0, EVGSiren05YineelAfraid=0.0, EVGSirenYineelCampPotion=0.0 |  |
| Heart of the Reach | `aaaHOTRQuest` | Heart of the Reach - New Quest - Dungeon - Weapons - 3 Creature Variants - Ring - Spell |  | 4 (0) |  |  |
| The Welkynar Knight | `ksws04MainQuest` | The Welkynar Knight - Quest |  | 6 (0) | ksws04MainQuestThalmorTopicPlayerAsked=0.0, ksws04MainQuestThalmorTopicWaifuAsked=0.0, ksws04MainQuestThalmorTopicWhereAsked=0.0, ksws04MainQuestRescueTopic02BadPick=0.0, ksws04MainQuestRescueTopic02GoodPick=0.0, ksws04MainQuestRescueTopic03LiePick=0.0, ksws04MainQuestRescueTopic03YesPick=0.0, ksws04MainQuestRescueTopic03NoPick=0.0, ksws04MainQuestMeetTopicPick=0.0 |  |
| Relics of the Crusader | `ccMTYSSE001_DES_RelicsoftheCrusader` | Official Master Files - Cleaned Plugins |  | 6 (0) |  |  |
| Belethor's Sister | `belethorSisterQuest01` | Belethor's Sister - Quest |  | 3 (0) | SpeechAverage=50.0, SpeechHard=75.0 |  |
| Revealing Rune | `Rune01` | Revealing Rune |  | 6 (0) | TGTalkGate=0.0 | door: hidden |
| More to do in the Soul Cairn | `MDSCSoulGemQuest` | More to do in the Soul Cairn | yes | 0 (0) |  |  |
| The Gift of Saturalia | `Sat_TheGiftofSaturalia` | The Gift Of Saturalia | yes | 1 (0) | GameHour=8.0, Sat_CCGlobal=1.0, Sat_SkoomaGlobal=0.0, Sat_SGT_Patch=1.0, Sat_AdoptionGlobal=0.0 |  |
| Fists of Fury | `FOFRiftenBrawlerQuest` | Fists of Fury - Skyrim |  | 5 (0) |  |  |
| The Frozen Heart | `ksws07MainQuest` | The Frozen Heart - Quest Mod |  | 2 (0) | ksws07RelationshipTotal=0.0, ksws07RelationshipKnocked=0.0 |  |
| The Thalmor's Shadow | `00TallyMeet` | The Thalmor's Shadow - Taliesin (Custom Voiced Follower) | yes | 0 (0) |  |  |
| A Healing Wedding | `DB05Alt` | Vittorias Alternate Wedding |  | 50 (6) | VAW_SpokenToVittoria=0.0 | door: hidden, door: key |
| Windhelm, expanded | `0WHQuestDeliveryToBro` | Capital Windhelm Expansion | yes | 2 (0) |  |  |
| Whiterun, expanded | `0WRThaneQ01` | Rob's Bug Fixes - Capital Whiterun Expansion | yes | 14 (3) |  |  |
| Markarth Side | `MarkarthSideGritDarQuest` | Arena - Markarth Side Town | yes | 1 (0) |  |  |
| On Hogithum | `REQ_HOGITHUM` | Requiem - The Roleplaying Overhaul (No Messages ESLIFIED) |  | 4 (0) |  |  |
| Profane Divinity | `Trad_001_ProfaneDivinityQuest` | Trad - AE - CC - Collection - Requiem Patch |  | 0 (0) |  |  |
| The Lost Library | `ccBGSSSE014_SpellPack_StartupQuest` | Official Master Files - Cleaned Plugins |  | 0 (0) |  |  |
| Through a Glass, Darkly | `BGSSSE018_ShadowrendQuest` | Official Master Files - Cleaned Plugins |  | 0 (0) |  |  |
| In the Shadows | `ccBGSSSE038_Quest` | Official Master Files - Cleaned Plugins |  | 0 (0) |  |  |
| The Cause | `ccBGSSSE067_Quest` | Official Master Files - Cleaned Plugins |  | 0 (0) |  |  |
| Hendraheim | `ccEEJSSE004_Quest` | Official Master Files - Cleaned Plugins |  | 18 (5) | cceejsse004_HousePrice=25000.0 | alias, condition |
| Guests for Dinner | `ccEEJSSE005_Quest` | Official Master Files - Cleaned Plugins |  | 1 (0) |  |  |
| A Dying Wish | `ccKRTSSE001_zQuest` | Official Master Files - Cleaned Plugins |  | 15 (0) |  |  |
| Dreams of the Dead | `ccRMSSSE001_Quest` | Official Master Files - Cleaned Plugins |  | 1 (1) |  | door: key |
| The Unquiet Dead | `ccVSVSSE004_MainQuest` | Official Master Files - Cleaned Plugins |  | 17 (3) | GoldenhillsPlantationPriceGlobal=10000.0, TRUEGlobal=1.0 | dialogue, door: locked |
| Stealer of Souls | `ccBGSSSE002_SoulStealerQuest` | Official Master Files - Cleaned Plugins |  | 12 (3) |  |  |
| Battle of the Champions | `ccFFBSSE001_Quest` | Official Master Files - Cleaned Plugins |  | 3 (0) | SpeechAverage=50.0, SpeechVeryHard=100.0 |  |
| The Wintersand Deception | `THTE_Quest_WintersandDeception` | CC Tundra Homestead - Tweaks and Enhancements (THTE) |  | 15 (5) |  | door: locked |
| Myrwatch | `MyrwatchTNE_Quest` | Myrwatch - Tweaks and Enhancements | yes | 4 (1) | ccEEJSSE002_HousePrice=20000.0, SpeechVeryHard=100.0 | door: key |
| Return Aegisbane | `ReturnAegisbaneQuest` | Return Aegisbane |  | 3 (0) |  |  |
| Paragliding in Skyrim | `ParaIntro` | Skyrim's Paraglider - ZERO |  | 0 (0) |  |  |
| Leaps Of Faith | `Leap_MiscQuest` | Leaps of Faith - A Misc Quest | yes | 21 (5) |  |  |
| Inigo | `InigoBadVibrations` | INIGO | yes | 6 (1) |  |  |
| Gore | `HD1GoreMeet` | Gore - A Companion Mod |  | 0 (0) | HD1PermanentDismiss=0.0, HD1GoreRescued=0.0 |  |
| Remiel | `HLIOStartingQuest` | Remiel-Custom Voiced Follower | yes | 10 (0) |  |  |
| Lucien | `JRLucienPersonal1` | Lucien - Immersive Fully Voiced Male Follower | yes | 3 (0) | JRLucienNameInt=0.0, JRLucienDumzbtharReadyTime=1.0, GameDaysPassed=1.0 |  |
| Serana | `SDE_TheElderScrolls` | Serana Dialogue Expansion | yes | 6 (0) |  |  |
| Auri | `018AuriFriendQuest` | Song of the Green (Auri Follower) | yes | 1 (0) | 018AuriIntroDone=0.0, 018AuriFriendship=2.0 |  |
| Katana and Megara | `AK69KatanaPersonalQuest` | Katana - Journey in the Shadows |  | 42 (6) | AK69KatanaQuestReadyTimeVar=0.0, AK69KatanaStage2Var=0.0, AK69KatanaStage3Var=0.0, AK69DHStageVar=0.0, AK69KatanaRecruited=0.0, AK69PQLockedOut=0.0, AK69DoorUnsealedVar=0.0, AK69GaltunReadLetter=0.0, AK69LuckyReadLetter=0.0, GameDaysPassed=1.0 |  |
| Fura Bloodmouth | `aaFuraQ1` | (BEST EVIL FOLLOWER) Follower Dialogue Expansion - Fura Bloodmouth |  | 7 (1) |  | door: key |
| Faralda | `aaFaraldaQ1` | Follower Dialogue Expansion - Faralda |  | 9 (0) |  |  |
| Jenassa | `aaJenassaAmor5RomanceQuest` | Follower Dialogue Expansion - Jenassa |  | 3 (0) |  |  |
| Mjoll the Lioness | `aaMjollAerinQ` | Follower Dialogue Expansion - Mjoll the Lioness |  | 2 (0) |  |  |
| Erik the Slayer | `aaErikCompanionJoin` | Follower Dialogue Expansion - Erik the Slayer |  | 2 (0) |  |  |
| Missives | `_M_QuestEastmarchCourierLetterHigh` | Missives |  | 39 (9) |  | door: hidden |
| Bounties and favours for the jarls | `BQ01Eastmarch` | Favor Quests Separated |  | 0 (0) |  |  |
| Favours for townsfolk | `Favor001` | Skyrim |  | 0 (0) | TRUEGlobal=1.0 | condition, dialogue |
| Thane of every hold | `FavorJarlsMakeFriends` | Skyrim | yes | 0 (0) |  |  |
| Fishing | `ccBGSSSE001_Start_MQ1` | Official Master Files - Cleaned Plugins |  | 0 (0) |  |  |
| Hunter's Mark | `HMADQ01` | Hunters Mark Animal Den on Map |  | 0 (0) | HMADg=10.0 |  |
| More to Say | `ACFMTSAngisCampDialogue` | More to Say - Main |  | 0 (0) |  |  |
| Odd jobs in the Rift | `FreeformRiften11b` | Caught Red Handed - Quest Expansion |  | 2 (0) |  |  |
| Odd jobs in the Reach | `FreeformMarkarthD` | Skyrim | yes | 7 (0) |  |  |
| Odd jobs in Haafingar | `SolitudeFreeform01` | Skyrim | yes | 6 (0) |  | dialogue |
| Odd jobs in Eastmarch | `FreeformWindhelmA` | Skyrim | yes | 6 (0) |  |  |
| Odd jobs in Whiterun Hold | `FreeformRiverwood01` | Skyrim |  | 6 (0) | ANDR_DialogueDistanceCheck_SvenFaendal=1024.0 | dialogue |
| Odd jobs in the north | `FreeformWinterholdA` | Skyrim |  | 5 (2) |  | dialogue |
| The Bonds of Matrimony | `RelationshipMarriage` | Skyrim | yes | 2 (0) |  | dialogue |
