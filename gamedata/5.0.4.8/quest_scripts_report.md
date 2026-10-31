# Quest scripts: what starts each quest, what it unlocks, and what it pays (WO-102)

Written by `scripts/gamedata/quest_scripts.py` from the records and the winning compiled scripts (`pex.py`). Rewards are what `AddItem` gives the player on the stages (or the dialogue) that complete a quest.

## Coverage

| | |
| --- | --- |
| kept quests | 1387 |
| with a known starter | 895 |
| started by dialogue | 513 |
| started by quest script | 309 |
| started by start game | 272 |
| started by story manager | 213 |
| started by place | 58 |
| with a script reward | 761 |
| lines | 164 |
| lines traced | 126 |
| lines unread | 26 |
| lines random | 12 |

Scripts the quests use that aren't anywhere in the install: 30. Scripts that couldn't be read: 0.

## The 15 WO-98 samples

| Quest | Started by | Rewards from scripts | Known reward (quest_givers_checks.md) |
| --- | --- | --- | --- |
| The Golden Claw (`MS13`) | dialogue with Lucan Valerius (SetStage 10); dialogue with Lucan Valerius (SetStage 10); dialogue with Camilla Valerius (SetStage 10); defaultSetStageTRIG in Bleak Falls Barrow, E3 Bleak Falls Barrow (Start) | LvlQuestReward02Medium (a medium reward list) | Gold |
| Rise in the East (`MS10`) | dialogue with Orthus Endario (SetStage 5); dialogue with Orthus Endario (SetStage 10); start-game | LvlQuestReward03Large (a large reward list) | Gold |
| The Forsworn Conspiracy (`MS01`) | MS01MiscObjectives stage 20 (SetStage 15); dialogue with Eltrys (SetStage 10); dialogue with Eltrys (SetStage 13); dialogue with Eltrys (SetStage 10) | LvlQuestReward02Medium (a medium reward list) | Gold |
| The Break of Dawn (`DA09`) | story-manager event: LEVL (DA09IncreaseLevelNodeSHARES) | Dawnbreaker (from DA09DawnbreakerList) | Dawnbreaker |
| A Daedra's Best Friend (`DA03`) | DA03Start stage 10 (SetStage 5); dialogue with Barbas (SetStage 10); dialogue with Barbas (SetStage 20); dialogue with Barbas (SetStage 15) | Masque of Clavicus Vile | The Masque of Clavicus Vile or the Rueful Axe |
| Take Up Arms (`C00`) | dialogue with Aela the Huntress (SetStage 10); dialogue with Vilkas (SetStage 10); dialogue with Farkas (SetStage 10); dialogue with Skjor (SetStage 10) | none found | none |
| A Chance Arrangement (`TG00`) | dialogue with Brynjolf (SetStage 5); dialogue with Brynjolf (SetStage 5); dialogue with Brynjolf (SetStage 8); dialogue with Brynjolf (SetStage 8) | gold (an amount the script works out) | Gold |
| Wyrmstooth (`WTDragonHunt`) | Wyrmstooth Starter stage 0 (Start); Wyrmstooth Starter stage 0 (Start); Wyrmstooth Starter stage 0 (Start); Wyrmstooth Starter stage 0 (Start) | none found | not known |
| Vigilant of Stendarr (`zzzAoMMq00`) | dialogue (SetStage 5); defaultSetStageTRIGPlayerOnly in Temple of Stendarr (Start); story-manager event: change location (VigilantDelayedStart) | Amulet of Stendarr; Old Histus Flask | not known |
| Meridia's Order (`NMeridia01`) | dialogue with Paladin Marith (SetStage 10); dialogue with Paladin Marith (SetStage 10); dialogue with Paladin Marith (SetStage 10); start-game | none found | not known |
| In the Pines (`GRVEMainQuest01`) | defaultSetStageTRIGPlayerOnly in Cemetery Homestead, Gravetender's House (Start); defaultSetStageTRIGPlayerOnly in Cemetery Homestead, Gravetender's House (SetStage 10); defaultSetStageTRIGPlayerOnly in Cemetery Homestead, Gravetender's House (Start); defaultSetStageTRIGPlayerOnly in Gravewind (Start) | none found | not known |
| Bad Vibrations (`InigoBadVibrations`) | dialogue with Inigo (SetStage 10); dialogue with Inigo (SetStage 30); dialogue with Inigo (SetStage 50); dialogue with Inigo (SetStage 20) | none found | not known |
| In their Footsteps (`NecroQuest01`) | NecroUCLMaintenanceQuest (SetStage 5); NecroUCLMaintenanceQuest (SetStage 5); defaultSetStageTRIG in Skyrim (Start); defaultSetStageTRIGPlayerOnly in Skyrim (Start) | none found | not known |
| Deluge of Deceit (`EVGSirenrootQuest`) | dialogue with Wujeeta (SetStage 1); dialogue (SetStage 1); start-game | 600 gold; 400 gold | not known |
| Fists of Fury - The Rift (`FOFRiftenBrawlerQuest`) | FOFQuestControl stage 30 (SetStage 5); FOFQuestControl stage 55 (SetStage 5); defaultSetStageTRIGPlayerOnly in The Ratway Arena, Ratway Arena (Start) | 650 gold; Ratway Arena Back Door Key | not known |

## Gravewind

- Started by: defaultSetStageTRIGPlayerOnly in Cemetery Homestead, Gravetender's House (Start); defaultSetStageTRIGPlayerOnly in Cemetery Homestead, Gravetender's House (SetStage 10); defaultSetStageTRIGPlayerOnly in Cemetery Homestead, Gravetender's House (Start); defaultSetStageTRIGPlayerOnly in Gravewind (Start); start-game
- Rewards: none found
- Unlocks: none found

## Lines by verdict

### Unread (26)

- **The Cursed Tribe** (`DA06`): a reward is added from QF_DA06_0003B681.fragment_60 (something the reader can't resolve); QF_DA06_0003B681.fragment_41 (something the reader can't resolve)
- **The Black Books** (`DLC2BlackBook03Quest`): no starter in its records or scripts
- **Seeking A Cure** (`VC01`): a reward is added from QF_VC01_0005C625.fragment_25 (something the reader can't resolve); QF_VC01_0005C625.fragment_27 (something the reader can't resolve)
- **Relics of the Crusader** (`ccMTYSSE001_DES_RelicsoftheCrusader`): no starter in its records or scripts
- **A Healing Wedding** (`DB05Alt`): no starter in its records or scripts
- **On Hogithum** (`REQ_HOGITHUM`): no starter in its records or scripts
- **Profane Divinity** (`Trad_001_ProfaneDivinityQuest`): no starter in its records or scripts
- **The Lost Library** (`ccBGSSSE014_SpellPack_StartupQuest`): no starter in its records or scripts
- **Through a Glass, Darkly** (`BGSSSE018_ShadowrendQuest`): no starter in its records or scripts
- **In the Shadows** (`ccBGSSSE038_Quest`): no starter in its records or scripts
- **The Cause** (`ccBGSSSE067_Quest`): a reward is added from ccBGSSSE067_Quest_0506BFC1.fragment_44 (something the reader can't resolve)
- **Hendraheim** (`ccEEJSSE004_Quest`): a reward is added from SSE_QF_ccEEJSSE004_Quest_05000C4F.fragment_6 (something the reader can't resolve)
- **Guests for Dinner** (`ccEEJSSE005_Quest`): a reward is added from ccEEJSSE005_Quest_050B7AED.fragment_0 (something the reader can't resolve)
- **A Dying Wish** (`ccKRTSSE001_QuestFortune`): a reward is added from ccKRTSSE001_QuestFortu_05000A90.fragment_46 (something the reader can't resolve); ccKRTSSE001_QuestFortu_05000A90.fragment_0 (something the reader can't resolve); ccKRTSSE001_QuestFortu_05000A90.fragment_0 (something the reader can't resolve)
- **Horse Whisperer** (`ccBGSSSE034_UnicornQuest`): no starter in its records or scripts
- **Ghosts of the Tribunal** (`ccASVSSE001_Quest`): a reward is added from ccASVSSE001_Quest_05000CC3.fragment_47 (something the reader can't resolve); ccASVSSE001_Quest_05000CC3.fragment_21 (something the reader can't resolve); ccASVSSE001_Quest_05000CC3.fragment_21 (something the reader can't resolve)
- **Forgotten Seasons** (`DLCDwarvenPuzzleDungeonCrownQuest`): no starter in its records or scripts
- **A Soul Divided** (`ccBGSSSE013_AquisitionQuest`): no starter in its records or scripts
- **The Restless** (`ccBGSSSE031_QUEST`): a reward is added from SSE_QF_ccBGSSSE031_QUEST_05000FDC.fragment_10 (something the reader can't resolve)
- **A Matter of Pride** (`ccBGSSSE005_MainQuest`): a reward is added from QF_ccBGSSSE005_MainQuest_02000838.fragment_4 (something the reader can't resolve)
- **Blood in the Water** (`ccBGSSSE068_Quest`): no starter in its records or scripts
- **Saturalia Preparation** (`ccVSVSSE001_MainQuest`): no starter in its records or scripts
- **The Wintersand Deception** (`THTE_Quest_WintersandDeception`): no starter in its records or scripts
- **Paragliding in Skyrim** (`ParaIntro`): no starter in its records or scripts
- **Missives** (`_M_QuestEastmarchCourierLetterHigh`): no starter in its records or scripts
- **Fishing** (`ccBGSSSE001_Start_MQ1`): no starter in its records or scripts

### Random (12)

- **A Night To Remember** (`DA14Start`): filled at run time: alias EventLocation
- **The Break of Dawn** (`DA09`): filled at run time: alias GemContainerLocation
- **The Ebony Warrior** (`DLC2EbonyWarriorQuest`): filled at run time: alias StartCity
- **Blood on the Ice** (`MS11`): filled at run time: alias AuthorityFigure
- **The Forgemaster's Fingers** (`FavorOrcsIntro`): filled at run time: alias QuestGiver
- **Granite Hill** (`aaaGraniteHillDungeonQuest`): filled at run time: alias CourierNote
- **Mjoll the Lioness** (`aaMjollAerinQ`): filled at run time: alias Dungeon
- **Erik the Slayer** (`aaErikCompanionJoin`): filled at run time: alias Location
- **Bounties and favours for the jarls** (`BQ01Eastmarch`): filled at run time: alias BountyLocation
- **Favours for townsfolk** (`Favor001AngasMill`): filled at run time: alias Location
- **Hunter's Mark** (`HMADQ01`): filled at run time: alias AnimalDenLocation, Location
- **Odd jobs in Whiterun Hold** (`FreeformRiverwood01`): filled at run time: alias Location

### Traced (126)

- **The main quest** (`MQ101`)
- **Dawnguard** (`DLC1VQ01MiscObjective`)
- **Dragonborn** (`DLC2MQ01`)
- **The Companions** (`C00`)
- **The College of Winterhold** (`MG01`)
- **The Thieves Guild** (`TG00`)
- **The Dark Brotherhood** (`DB01`)
- **The Civil War** (`CW01A`)
- **The Bards College** (`MS05Start`)
- **Vigilant** (`zzzAoMMq00`)
- **Meridia's Order** (`NMeridia01`)
- **Penitus Oculatus** (`zzzPO00`)
- **A Daedra's Best Friend** (`DA03Start`)
- **Boethiah's Calling** (`DA02`)
- **Discerning the Transmundane** (`DA04`)
- **Ill Met By Moonlight** (`DA05`)
- **Pieces of the Past** (`DA07`)
- **The Black Star** (`DA01`)
- **The House of Horrors** (`DA10`)
- **The Mind of Madness** (`DA15`)
- **Saints and Seducers** (`EC_SS_MQ101`)
- **The Only Cure** (`DA13`)
- **The Taste of Death** (`DA11`)
- **The Whispering Door** (`DA08`)
- **Waking Nightmare** (`DA16`)
- **Sleepwalking Into A Nightmare** (`aaaMBQuest`)
- **Wyrmstooth** (`WTDragonHunt`)
- **Journey to Baan Malur** (`DefunctQuest02`)
- **Siege at Icemoth** (`HYORdunIcemothQST`)
- **The Gray Cowl of Nocturnal** (`manny_GF_MQ`)
- **The Forgotten City** (`000FCQuest01`)
- **Gravewind** (`GRVEMainQuest01`)
- **Raven Rock** (`DLC2RR01`)
- **Thirsk Mead Hall** (`DLC2MH01`)
- **Neloth of Tel Mithryn** (`DLC2TT1`)
- **Skaal Village** (`DLC2SV01`)
- **Deathbrand** (`DLC2dunHaknirTreasureQST`)
- **Unearthed** (`DLC2dunKolbjornQST`)
- **Filial Bonds** (`DLC2WB01`)
- **The Kagrumez Gauntlet** (`DLC2KagrumezQST`)
- **Miasma** (`RE01MiasmaQst`)
- **Destroy the Acolyte Priests** (`EnoAcolyteQuest`)
- **The Forsworn Conspiracy** (`MS01`)
- **Promises to Keep** (`MS03`)
- **Unfathomable Depths** (`MS04`)
- **The Wolf Queen Awakened** (`MS06Start`)
- **Lights Out!** (`MS07`)
- **In My Time Of Need** (`MS08`)
- **Missing In Action** (`MS09`)
- **Rise in the East** (`MS10`)
- **The White Phial** (`MS12`)
- **The Golden Claw** (`MS13`)
- **Laid to Rest** (`MS14`)
- **A Return To Your Roots** (`NN01`)
- **The Heart of Dibella** (`T01`)
- **The Blessings of Nature** (`T03`)
- **The Book of Love** (`t02`)
- **Falion's Secret** (`FreeformMorthalA`)
- **Repentance** (`dunDarklightQST`)
- **Siege on the Dragon Cult** (`dunForelhostQST`)
- **The Pale Lady** (`dunFrostmereCryptQST`)
- **Forbidden Legend** (`dunGauldursonQST`)
- **A Scroll For Anska** (`dunHighGateRuinsQST`)
- **Ancestral Worship** (`dunHillgrundsTombQST`)
- **Kyne's Sacred Trials** (`dunHunterQST`)
- **The Lost Expedition** (`dunNchuandZelQst`)
- **Infiltration** (`dunTrevasWatchQST`)
- **Evil in Waiting** (`dunValthumeQST`)
- **Silenced Tongues** (`dunVolunruudQST`)
- **Yngol's Barrow** (`dunYngolBarrowQST`)
- **The Affairs of Hagravens** (`dunBlindCliffQST`)
- **Telrav's Request** (`dunNilheimQST`)
- **Search and Seizure** (`FreeformMarkarthM`)
- **Toying With The Dead** (`FreeformRiften21`)
- **Extracting an Argonian** (`DarkwaterCrossingDerkeethusRescueQuest`)
- **Dark Ancestor** (`FreeformFalkreathQuest03`)
- **Drowned Sorrows** (`FreeformWinterholdC`)
- **Lost to the Ages** (`DLC1LD`)
- **A Forgotten Blade** (`madFultheimQuest`)
- **Destroy the Dragon Cult** (`DCQuest`)
- **Undeath** (`NecroQuest01`)
- **Legends of Aetherium** (`aaaLOAQuest`)
- **The Tools of Kagrenac** (`TOK_QUST_KagrenacTools`)
- **Deluge of Deceit** (`EVGSirenrootQuest`)
- **Heart of the Reach** (`aaaHOTRQuest`)
- **The Welkynar Knight** (`ksws04MainQuest`)
- **Belethor's Sister** (`belethorSisterQuest01`)
- **Revealing Rune** (`Rune01`)
- **More to do in the Soul Cairn** (`MDSCSoulGemQuest`)
- **The Gift of Saturalia** (`Sat_TheGiftofSaturalia`)
- **Fists of Fury** (`FOFRiftenBrawlerQuest`)
- **The Frozen Heart** (`ksws07MainQuest`)
- **The Thalmor's Shadow** (`00TallyMeet`)
- **More to do in Windhelm** (`0WHQuestDeliveryToBro`)
- **More to do in Whiterun** (`0WRThaneQ01`)
- **Markarth Side** (`MarkarthSideGritDarQuest`)
- **Dreams of the Dead** (`ccRMSSSE001_Quest`)
- **The Unquiet Dead** (`ccVSVSSE004_RestoreFarmQuest`)
- **The Sanctuary and the Manufactory** (`ccAARSSE001ManufactoryControlQuest`)
- **Blue in the Face** (`ccBGSSSE040_Quest`)
- **The Staff of Hasedoki** (`ccBGSSSE045_Quest`)
- **Caught in a Web** (`ccBGSSSE069_Quest`)
- **Shadowfoot Sanctum** (`ccEEJSSE003_HouseQuest`)
- **Stealer of Souls** (`ccBGSSSE002_SoulStealerQuest`)
- **Battle of the Champions** (`ccFFBSSE001_Quest`)
- **Myrwatch** (`MyrwatchTNE_Quest`)
- **Return Aegisbane** (`ReturnAegisbaneQuest`)
- **Leaps Of Faith** (`Leap_MiscQuest`)
- **Inigo** (`InigoBadVibrations`)
- **Gore** (`HD1GoreMeet`)
- **Remiel** (`HLIOStartingQuest`)
- **Lucien** (`JRLucienPersonal1`)
- **Serana** (`SDE_TheElderScrolls`)
- **Auri** (`018AuriFriendQuest`)
- **Katana and Megara** (`AK69KatanaPersonalQuest`)
- **Fura Bloodmouth** (`aaFuraQ1`)
- **Faralda** (`aaFaraldaQ1`)
- **Jenassa** (`aaJenassaAmor5RomanceQuest`)
- **Thane of every hold** (`FavorJarlsMakeFriends`)
- **More to Say** (`ACFMTSAngisCampDialogue`)
- **Odd jobs in the Rift** (`FreeformRiften11b`)
- **Odd jobs in the Reach** (`FreeformMarkarthD`)
- **Odd jobs in Haafingar** (`SolitudeFreeform01`)
- **Odd jobs in Eastmarch** (`FreeformWindhelmA`)
- **Odd jobs in the north** (`FreeformWinterholdA`)
- **The Bonds of Matrimony** (`RelationshipMarriage`)

## Where the scripts differ from quests.json

Lines whose opening quest's rewards from scripts differ from the rewards quests.json shows now (its gold tiers and items).

- **The main quest**: quests.json has no gold, items Footwraps, Imperial Heavy Bow, Imperial Sword, Long Bow, Prisoner's Cuffs, Roughspun Tunic, Steel Dagger, Ulfric's Gag; the scripts give Long Bow.
- **Dawnguard**: quests.json has no gold; the scripts give Dawnguard Crossbow.
- **The Companions**: quests.json has no gold, items Aela's Shield (Master Work), Vilkas's Sword; the scripts give nothing on completion.
- **The Thieves Guild**: quests.json has no gold, items Madesi's Silver Ring; the scripts give gold (an amount the script works out).
- **A Daedra's Best Friend**: quests.json has no gold; the scripts give 25 gold.
- **Boethiah's Calling**: quests.json has no gold; the scripts give Blade of Sacrifice.
- **Ill Met By Moonlight**: quests.json has no gold, items Cursed Ring of Hircine, Savior's Hide; the scripts give Savior's Hide.
- **Pieces of the Past**: quests.json has no gold, items Mehrunes' Razor; the scripts give 500 gold; Mehrunes' Razor; DA07GoldReward01Single (a reward list); DA07GoldReward02Triple (a reward list).
- **The Break of Dawn**: quests.json has no gold, items Dawnbreaker; the scripts give Dawnbreaker (from DA09DawnbreakerList).
- **The Cursed Tribe**: quests.json has no gold, items Necklace of the Wise Woman, Shagrol's Warhammer, Volendrung; the scripts give nothing on completion.
- **The House of Horrors**: quests.json has no gold, items Mace of Molag Bal; the scripts give Rusty Mace; Mace of Molag Bal; 1000 gold.
- **The Taste of Death**: quests.json has no gold, items Ring of Namira; the scripts give 100 gold; Ring of Namira.
- **Sleepwalking Into A Nightmare**: quests.json has no gold, items Daybreak's Embrace; the scripts give aaaMBLitemBowReward (a reward list); aaaMBLitemRingReward (a reward list).
- **Journey to Baan Malur**: quests.json has no gold, items Cheap Silver Amulet; the scripts give nothing on completion.
- **The Gray Cowl of Nocturnal**: quests.json has no gold, items Gray Cowl of Nocturnal; the scripts give nothing on completion.
- **Neloth of Tel Mithryn**: quests.json has no gold; the scripts give 500 gold; Staff Enchanter Key.
- **Skaal Village**: quests.json has no gold; the scripts give 1000 gold.
- **Deathbrand**: quests.json has no gold, items Deathbrand Boots, Deathbrand Cuirass, Deathbrand Gauntlets, Deathbrand Helm; the scripts give nothing on completion.
- **Miasma**: quests.json has no gold, items Haj-Xul's Bow; the scripts give nothing on completion.
- **Lights Out!**: quests.json has no gold; the scripts give 200 gold.
- **In My Time Of Need**: quests.json has no gold; the scripts give 500 gold.
- **Missing In Action**: quests.json has no gold; the scripts give MS09Reward (a reward list); 200 gold.
- **Blood on the Ice**: quests.json has no gold; the scripts give 500 gold.
- **The White Phial**: quests.json has no gold; the scripts give 5 gold; 500 gold.
- **Falion's Secret**: quests.json has no gold; the scripts give 200 gold.
- **Siege on the Dragon Cult**: quests.json has no gold, items Rahgot; the scripts give nothing on completion.
- **Forbidden Legend**: quests.json has no gold; the scripts give Gauldur Amulet Fragment.
- **The Lost Expedition**: quests.json has no gold; the scripts give FavorRewardGoldLarge (a large reward list).
- **Infiltration**: quests.json has no gold; the scripts give Spell Tome (Adept): Detect Life; FavorRewardEnchWeaponAny (a reward list); FavorRewardEnchArmor (a reward list); FavorRewardGoldLarge (a large reward list); FavorRewardJewelry (a reward list).
- **Silenced Tongues**: quests.json has no gold, items Ceremonial Axe, Ceremonial Sword; the scripts give nothing on completion.
- **The Affairs of Hagravens**: quests.json has no gold, items Eye of Melka; the scripts give nothing on completion.
- **Telrav's Request**: quests.json has no gold; the scripts give 200 gold.
- **Search and Seizure**: quests.json has no gold; the scripts give LvlQuestReward02Medium (a medium reward list); LvlQuestReward01Small (a small reward list).
- **Toying With The Dead**: quests.json has no gold; the scripts give 250 gold; LItemEnchWeapon1H.
- **Extracting an Argonian**: quests.json has no gold; the scripts give LvlQuestReward01Small (a small reward list).
- **Dark Ancestor**: quests.json has no gold; the scripts give 200 gold.
- **The Tools of Kagrenac**: quests.json has no gold, items Keening, Sunder; the scripts give nothing on completion.
- **Deluge of Deceit**: quests.json has no gold; the scripts give 600 gold; 400 gold.
- **Heart of the Reach**: quests.json has no gold, items Ring Of The Tree; the scripts give 1000 gold; Ring Of The Tree.
- **The Welkynar Knight**: quests.json has gold small; the scripts give FavorRewardGoldSmall (a small reward list); Welkynar Hussar Circlet.
- **Belethor's Sister**: quests.json has no gold; the scripts give 0 gold; 100 gold.
- **Revealing Rune**: quests.json has no gold; the scripts give FavorRewardJewelry (a reward list) x3.
- **The Gift of Saturalia**: quests.json has no gold; the scripts give 5000 gold.
- **Fists of Fury**: quests.json has no gold; the scripts give 650 gold; Ratway Arena Back Door Key.
- **A Healing Wedding**: quests.json has no gold, items Asgeir's Wedding Band, Vittoria's Wedding Band; the scripts give nothing on completion.
- **More to do in Windhelm**: quests.json has no gold; the scripts give Elk Pelt; 25 gold.
- **Markarth Side**: quests.json has no gold, items Ancient Royal Crown; the scripts give 500 gold.
- **A Dying Wish**: quests.json has no gold; the scripts give 1000 gold; 300 gold; 5 gold; 50 gold.
- **A Matter of Pride**: quests.json has no gold, items Sivdur's Amulet; the scripts give nothing on completion.
- **The Staff of Hasedoki**: quests.json has no gold, items Staff of Hasedoki; the scripts give nothing on completion.
- **Blood in the Water**: quests.json has no gold, items Headman's Cleaver; the scripts give nothing on completion.
- **Return Aegisbane**: quests.json has no gold, items Aegisbane; the scripts give nothing on completion.
- **Gore**: quests.json has no gold, items Gore's Greatsword; the scripts give nothing on completion.
- **Katana and Megara**: quests.json has no gold; the scripts give 500 gold; 800 gold; 1000 gold; 3000 gold.
- **Mjoll the Lioness**: quests.json has no gold; the scripts give 1000 gold.
- **Missives**: quests.json has no gold; the scripts give gold (an amount the script works out).
- **Favours for townsfolk**: quests.json has no gold; the scripts give FavorRewardGoldSmall (a small reward list).
- **Odd jobs in Eastmarch**: quests.json has no gold; the scripts give FavorRewardGoldSmall (a small reward list).
- **Odd jobs in Whiterun Hold**: quests.json has no gold; the scripts give 25 gold.

## Scripts not in the install

30 scripts the records name aren't in any loose folder or archive (mostly left behind by mods that removed or renamed them). Calls inside them can't be read.

AAS_PlayerScript, ACFH_TIF__03000B2B, ACFH_TIF__03000B6B, BaanMalurCarriageScript, HLIO_TIF__0598299C, JR0_QF_JRLucienCCSaintsAndSed_07000800, JR_TIF__05172482, JR_TIF__05172488, ParryManagerQuestScript, QF_HRI_Events_Quest_WEWerebe_0402904A, QF_SOMRRumoursQuest_0721AE15, SSE_TIF__05000FD4, SSE_TIF__05000FD5, SSE_TIF__05000FD8, SSE_TIF__05000FDB, SilgradCarriageScript, SkyInteract_PlayerLoadGameAlias, Survival_ThirstPlayerAlias, TIF__020458BA, TIF__023943AB, TIF__03000976, TIF__03000D75, TIF__04138034, TIF__08005903, Traits_ElementalistPlayerScript, aaCi_TIF__0501F5BC, aaEl_QF_aaElisifUpdate0108_05014EF5, aaaVampireFeedingContractScriptB, aaaVampireFeedingRemoveAlias, urshug_TIF__0200183E
