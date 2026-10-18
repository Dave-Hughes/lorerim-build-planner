# Quest scripts: what starts each quest, what it unlocks, and what it pays (WO-102)

Written by `scripts/gamedata/quest_scripts.py` from the records and the winning compiled scripts (`pex.py`). Rewards are what `AddItem` gives the player on the stages (or the dialogue) that complete a quest.

## Coverage

| | |
| --- | --- |
| kept quests | 1340 |
| with a known starter | 847 |
| started by dialogue | 494 |
| started by quest script | 283 |
| started by start game | 264 |
| started by story manager | 212 |
| started by place | 48 |
| with a script reward | 742 |
| lines | 152 |
| lines traced | 120 |
| lines unread | 21 |
| lines random | 11 |

Scripts the quests use that aren't anywhere in the install: 261. Scripts that couldn't be read: 0.

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

### Unread (21)

- **The Cursed Tribe** (`DA06`): a reward is added from QF_DA06_0003B681.fragment_60 (something the reader can't resolve); QF_DA06_0003B681.fragment_41 (something the reader can't resolve)
- **The Black Books** (`DLC2BlackBook03Quest`): no starter in its records or scripts
- **Seeking A Cure** (`VC01`): a reward is added from QF_VC01_0005C625.fragment_25 (something the reader can't resolve); QF_VC01_0005C625.fragment_27 (something the reader can't resolve)
- **Relics of the Crusader** (`ccMTYSSE001_DES_RelicsoftheCrusader`): no starter in its records or scripts
- **A Healing Wedding** (`DB05Alt`): no starter in its records or scripts
- **On Hogithum** (`REQ_HOGITHUM`): no starter in its records or scripts
- **Profane Divinity** (`Trad_001_ProfaneDivinityQuest`): no starter in its records or scripts
- **The Lost Library** (`ccBGSSSE014_SpellPack_StartupQuest`): no starter in its records or scripts
- **Through a Glass, Darkly** (`BGSSSE018_ShadowrendQuest`): no starter in its records or scripts; scripts ccBGSSSE018_QF_ShadowQuest_0100081C, ccBGSSSE018_ShadowrendPlaceScript missing
- **In the Shadows** (`ccBGSSSE038_Quest`): no starter in its records or scripts
- **The Cause** (`ccBGSSSE067_Quest`): no starter in its records or scripts; scripts ccBGSSSE067_ContentAwareScript, ccBGSSSE067_QuestFunctionsScript, ccBGSSSE067_Quest_0506BFC1 missing
- **Hendraheim** (`ccEEJSSE004_Quest`): a reward is added from SSE_QF_ccEEJSSE004_Quest_05000C4F.fragment_6 (something the reader can't resolve)
- **Guests for Dinner** (`ccEEJSSE005_Quest`): scripts ccEEJSSE005_DeathCount, ccEEJSSE005_Quest_050B7AED missing or unreadable
- **A Dying Wish** (`ccKRTSSE001_zQuest`): a reward is added from ccKRTSSE001_QF_01000D63.fragment_22 (something the reader can't resolve); ccKRTSSE001_QF_01000D63.fragment_25 (something the reader can't resolve); ccKRTSSE001_QF_01000D63.fragment_41 (something the reader can't resolve)
- **Dreams of the Dead** (`ccRMSSSE001_Quest`): scripts ccRMSSSE001_GhostTrapScript, ccRMSSSE001_SleepSetStageScript missing or unreadable
- **The Unquiet Dead** (`ccVSVSSE004_MainQuest`): a reward is added from ccVSVSSE004_QF_MainQuest.fragment_35 (something the reader can't resolve)
- **Battle of the Champions** (`ccFFBSSE001_Quest`): scripts ccFFBSSE001_SoldierDeadCountScript missing or unreadable
- **The Wintersand Deception** (`THTE_Quest_WintersandDeception`): no starter in its records or scripts
- **Paragliding in Skyrim** (`ParaIntro`): no starter in its records or scripts
- **Missives** (`_M_QuestEastmarchCourierLetterHigh`): no starter in its records or scripts
- **Fishing** (`ccBGSSSE001_Start_MQ1`): no starter in its records or scripts; scripts QF_ccBGSSSE001_Start_MQ1_050009D3 missing

### Random (11)

- **The Break of Dawn** (`DA09`): filled at run time: alias GemContainerLocation
- **The Ebony Warrior** (`DLC2EbonyWarriorQuest`): filled at run time: alias StartCity
- **Blood on the Ice** (`MS11`): filled at run time: alias AuthorityFigure
- **The Forgemaster's Fingers** (`FavorOrcsIntro`): filled at run time: alias QuestGiver
- **Granite Hill** (`aaaGraniteHillDungeonQuest`): filled at run time: alias CourierNote
- **Mjoll the Lioness** (`aaMjollAerinQ`): filled at run time: alias Dungeon
- **Erik the Slayer** (`aaErikCompanionJoin`): filled at run time: alias Location
- **Bounties and favours for the jarls** (`BQ01Eastmarch`): filled at run time: alias BountyLocation
- **Favours for townsfolk** (`Favor001`): filled at run time: alias Target
- **Hunter's Mark** (`HMADQ01`): filled at run time: alias AnimalDenLocation, Location
- **Odd jobs in Whiterun Hold** (`FreeformRiverwood01`): filled at run time: alias Location

### Traced (120)

- **The Dragonborn** (`MQ101`)
- **Dawnguard** (`DLC1VQ01MiscObjective`)
- **Dragonborn** (`DLC2MQ01`)
- **The Companions** (`C00`)
- **The College of Winterhold** (`MG01`)
- **The Thieves Guild** (`TG00`)
- **The Dark Brotherhood** (`DB01`)
- **The Civil War** (`CW01A`)
- **The Bards College** (`MS05`)
- **Vigilant** (`zzzAoMMq00`)
- **Meridia's Order** (`NMeridia01`)
- **Penitus Oculatus** (`zzzPO00`)
- **A Daedra's Best Friend** (`DA03`)
- **A Night To Remember** (`DA14`)
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
- **Trius' Trinket** (`dunShipwreck04QST`)
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
- **Windhelm, expanded** (`0WHQuestDeliveryToBro`)
- **Whiterun, expanded** (`0WRThaneQ01`)
- **Markarth Side** (`MarkarthSideGritDarQuest`)
- **Stealer of Souls** (`ccBGSSSE002_SoulStealerQuest`)
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

- **The Dragonborn**: quests.json has no gold, items Footwraps, Imperial Heavy Bow, Imperial Sword, Long Bow, Prisoner's Cuffs, Roughspun Tunic, Steel Dagger, Ulfric's Gag; the scripts give Long Bow.
- **Dawnguard**: quests.json has no gold; the scripts give Dawnguard Crossbow.
- **The Companions**: quests.json has no gold, items Aela's Shield (Master Work), Vilkas's Sword; the scripts give nothing on completion.
- **The Thieves Guild**: quests.json has no gold, items Madesi's Silver Ring; the scripts give gold (an amount the script works out).
- **A Daedra's Best Friend**: quests.json has no gold, items Masque of Clavicus Vile, Rueful Axe; the scripts give Masque of Clavicus Vile.
- **A Night To Remember**: quests.json has no gold, items Broken Staff, Sanguine Rose; the scripts give Sanguine Rose.
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
- **Windhelm, expanded**: quests.json has no gold; the scripts give Elk Pelt; 25 gold.
- **Markarth Side**: quests.json has no gold, items Ancient Royal Crown; the scripts give 500 gold.
- **Guests for Dinner**: quests.json has gold large; the scripts give nothing on completion.
- **A Dying Wish**: quests.json has no gold; the scripts give Rulnik's Dagger; Bittercup; cckrtsse001_altar.esl:000F02.
- **The Unquiet Dead**: quests.json has gold large; the scripts give nothing on completion.
- **Return Aegisbane**: quests.json has no gold, items Aegisbane; the scripts give nothing on completion.
- **Gore**: quests.json has no gold, items Gore's Greatsword; the scripts give nothing on completion.
- **Katana and Megara**: quests.json has no gold; the scripts give 500 gold; 800 gold; 1000 gold; 3000 gold.
- **Mjoll the Lioness**: quests.json has no gold; the scripts give 1000 gold.
- **Missives**: quests.json has no gold; the scripts give gold (an amount the script works out).
- **Favours for townsfolk**: quests.json has no gold; the scripts give FavorRewardGoldSmall (a small reward list); Scholar's Sting.
- **Odd jobs in Eastmarch**: quests.json has no gold; the scripts give FavorRewardGoldSmall (a small reward list).
- **Odd jobs in Whiterun Hold**: quests.json has no gold; the scripts give 25 gold.
- **The Bonds of Matrimony**: quests.json has no gold, items Amulet of Mara; the scripts give nothing on completion.

## Scripts not in the install

261 scripts the records name aren't in any loose folder or archive (mostly left behind by mods that removed or renamed them). Calls inside them can't be read.

AAS_PlayerScript, ACFH_TIF__03000B2B, ACFH_TIF__03000B6B, BGSSSE010_OnReadSetStageAlias, BaanMalurCarriageScript, HLIO_TIF__0598299C, JR0_QF_JRLucienCCSaintsAndSed_07000800, JR_TIF__05172482, JR_TIF__05172488, ParryManagerQuestScript, QF_DLCDwarvenPuzzleDungeonQu_050038D9, QF_HRI_Events_Quest_WEWerebe_0402904A, QF_SOMRRumoursQuest_0721AE15, QF_ccBGSSSE001_Crab_MQ1_050009D4, QF_ccBGSSSE001_Crab_MQ2_050009DA, QF_ccBGSSSE001_Crab_MQ3_050009D6, QF_ccBGSSSE001_Fish_MQ1_050009DE, QF_ccBGSSSE001_Fish_MQ2_050009EB, QF_ccBGSSSE001_Fish_MQ3_050009E8, QF_ccBGSSSE001_Fish_MQ4_050009DD, QF_ccBGSSSE001_Fish_MQ5_050009DC, QF_ccBGSSSE001_MiscQuests_050009E6, QF_ccBGSSSE001_Misc_Falkreat_050009EC, QF_ccBGSSSE001_Misc_Khajiit_050009E2, QF_ccBGSSSE001_Misc_Markarth_050009DF, QF_ccBGSSSE001_Misc_Morthal_050009E4, QF_ccBGSSSE001_Misc_Solitude_050009E3, QF_ccBGSSSE001_Misc_Whiterun_050009D7, QF_ccBGSSSE001_Misc_Whiterun_05000E5D, QF_ccBGSSSE001_Misc_Windhelm_050009D5, QF_ccBGSSSE001_Radiant_1_05000B98, QF_ccBGSSSE001_Radiant_2_05000C2F, QF_ccBGSSSE001_Radiant_3_05000C8C, QF_ccBGSSSE001_Start_MQ1_050009D3, QF_ccBGSSSE001_Start_MQ2_050009DB, QF_ccBGSSSE010_PetPurchaseQu_02000808, QF_ccBGSSSE025_ElytraPetAcqu_050010C3, QF_ccBGSSSE025_RareCuriosInt_050010C1, QF_ccBGSSSE035_PetAcquireQue_0400080A, SSE_TIF__020008AA, SSE_ccBGSSSE037_RareCurios_0100084D, SilgradCarriageScript, SkyInteract_PlayerLoadGameAlias, Survival_PlayerHitInfo, Survival_PlayerLocationInfo, Survival_ThirstPlayerAlias, Survival_VampirismLycanthropy, TIF__020458BA, TIF__023943AB, TIF__03000976, TIF__03000D75, TIF__04138034, TIF__08005903, TIF_ccBGSSSE025_StaadaFrag, TIF_ccBGSSSE025_StaadaFrag2, TIF_ccBGSSSE025_StaadaFrag3, TIF_ccBGSSSE025_StaadaFragA, TIF_ccBGSSSE025_StaadaFrgF, Traits_ElementalistPlayerScript, VS02_QF_ccVSVSSE002_MainQuest_050008C8, aaCi_TIF__0501F5BC, aaEl_QF_aaElisifUpdate0108_05014EF5, aaaVampireFeedingContractScriptB, aaaVampireFeedingRemoveAlias, ccASVSSE001_KillFollowerCheck, ccASVSSE001_OnHitStageSetScript, ccASVSSE001_SetStageonActivateScript, ccASVSSE001_TIF__05000DFC, ccASVSSE001_TIF__05000E04, ccASVSSE001_TIF__05000E07, ccASVSSE001_TIF__05000E09, ccASVSSE001_TIF__05000EAB, ccASVSSE001_TIF__0500114D, ccASVSSE001_TIF__0500115F, ccASVSSE001_TIF__05001160, ccASVSSE001_TIF__0500116A, ccASVSSE001_TIF__05001178, ccASVSSE001_TIF__05048064, ccASVSSE001_TIF__05048065, ccASVSSE001_TIF__0504806D, ccASVSSE001_TIF__05219F5B, ccASVSSE001_TaskChecklilst, ccBGSSSE001_AdvanceStageOnUpdate, ccBGSSSE001_CatapultMonitor, ccBGSSSE001_CrabEncMonitor, ccBGSSSE001_CrabMQ2EncAlias, ccBGSSSE001_CrabMQ3_Quest, ccBGSSSE001_CrabMQ4BodyCleanup, ccBGSSSE001_CrabMQ4Reinforcements, ccBGSSSE001_DeleteOnQuestDone, ccBGSSSE001_GuardPanicScript, ccBGSSSE001_ItemCollectObjectiveScript, ccBGSSSE001_MiscDwarPlayScript, ccBGSSSE001_MiscKhajPlayScript, ccBGSSSE001_MiscMarkarthScript, ccBGSSSE001_MiscQuestScript, ccBGSSSE001_MiscSol_DinnerGuestScript, ccBGSSSE001_MiscWhiterunCourier, ccBGSSSE001_OnDeathCallReinforce, ccBGSSSE001_OnReadSetStage, ccBGSSSE001_PlayerHitScript, ccBGSSSE001_Quest_SetStageAfterTimer, ccBGSSSE001_RadiantFishQuest, ccBGSSSE001_RadiantItemPlayerScript, ccBGSSSE001_RadiantJunkQuest, ccBGSSSE001_RadiantQuest3Listener, ccBGSSSE001_SandboxFollowerScript, ccBGSSSE001_SetStageOnActivate, ccBGSSSE001_SetStageOnPickup, ccBGSSSE001_StartMQ1PlayerScript, ccBGSSSE001_SwapOutfitOnCellAttach, ccBGSSSE001_TIF__0500099D, ccBGSSSE001_TIF__050009A7, ccBGSSSE001_TIF__050009BC, ccBGSSSE001_TIF__050009D1, ccBGSSSE001_TIF__05000A63, ccBGSSSE001_TIF__05000A68, ccBGSSSE001_TIF__05000B1E, ccBGSSSE001_TIF__05000B5C, ccBGSSSE001_TIF__05000B60, ccBGSSSE001_TIF__05000B64, ccBGSSSE001_TIF__05000B79, ccBGSSSE001_TIF__05000BAF, ccBGSSSE001_TIF__05000BB0, ccBGSSSE001_TIF__05000BB1, ccBGSSSE001_TIF__05000BB2, ccBGSSSE001_TIF__05000BB3, ccBGSSSE001_TIF__05000BB4, ccBGSSSE001_TIF__05000BB5, ccBGSSSE001_TIF__05000BB6, ccBGSSSE001_TIF__05000BDE, ccBGSSSE001_TIF__05000C28, ccBGSSSE001_TIF__05000C29, ccBGSSSE001_TIF__05000C49, ccBGSSSE001_TIF__05000C5C, ccBGSSSE001_TIF__05000C5E, ccBGSSSE001_TIF__05000C70, ccBGSSSE001_TIF__05000E5B, ccBGSSSE001_TIF__05000E5C, ccBGSSSE001_TIF__05000E5E, ccBGSSSE001_TIF__05000E7B, ccBGSSSE001_TIF__05000EA4, ccBGSSSE001_TIF__05000EA9, ccBGSSSE001_TIF__05000EAC, ccBGSSSE001_TIF__05000EAF, ccBGSSSE001_TIF__05000EB4, ccBGSSSE001_TIF__05000EC3, ccBGSSSE001_TIF__05000ECE, ccBGSSSE001_TIF__05000EE5, ccBGSSSE001_TIF__050C1D0F, ccBGSSSE001_WhiterunChestScript, ccBGSSSE002_TKArrowsQuestScript, ccBGSSSE010_ContainerSetStage, ccBGSSSE010_SetStageOnActivate, ccBGSSSE013_BattleScript, ccBGSSSE014_SetStageContainerOpen, ccBGSSSE018_QF_ShadowQuest_0100081C, ccBGSSSE018_ShadowrendPlaceScript, ccBGSSSE018_ShadowrendPlayerScript, ccBGSSSE025_ElytraCollectItemScript, ccBGSSSE025_RCIntegrationScript, ccBGSSSE034_MapContainerChangeAlias, ccBGSSSE034_TIF__02000837, ccBGSSSE034_TIF__02000838, ccBGSSSE034_TIF__02000839, ccBGSSSE034_TIF__0200083A, ccBGSSSE034_TIF__0200083C, ccBGSSSE034_TIF__0200084A, ccBGSSSE034_WildHorseRefAliasScript, ccBGSSSE034_WildHorsesQuestScript, ccBGSSSE034_tif__02000d6c, ccBGSSSE034_tif__02000d6d, ccBGSSSE035_MerchantAlias, ccBGSSSE035_OnActStageRefAlias, ccBGSSSE036_SetStageOnRead, ccBGSSSE051_TIF__05000833, ccBGSSSE051_TIF__05000838, ccBGSSSE051_TIF__05000839, ccBGSSSE051__TIF__0500083D, ccBGSSSE051__TIF__05000841, ccBGSSSE067_ContentAwareScript, ccBGSSSE067_QuestFunctionsScript, ccBGSSSE067_Quest_0506BFC1, ccBGSSSE067_SetStageOnActivateConfirm, ccBGSSSE067_SetStageOnOpenRefAlias, ccBGSSSE067_SetStageTriggerScript, ccEDHSSE003_TIF__02000860, ccEDHSSE003_TIF__02000862, ccEDHSSE003_TIF__0200086B, ccEDHSSE003_TIF__02000871, ccEDHSSE003_TIF__02000875, ccEDHSSE003_TIF__0200088B, ccEDHSSE003_TIF__020008B0, ccEEJSSE004__05000C54, ccEEJSSE004__05000C58, ccEEJSSE004__05000C72, ccEEJSSE005_DeathCount, ccEEJSSE005_Quest_050B7AED, ccEEJSSE005_SetGlobalOnPickup, ccEEJSSE005_TIF__050DB2AD, ccEEJSSE005_TIF__050DB2C5, ccFFBSSE001_SoldierDeadCountScript, ccFFBSSE001_TurncloakScript, ccKRTSSE001_DoorActivateScript, ccKRTSSE001_FerrySyste_05000A7B, ccKRTSSE001_GTScript, ccKRTSSE001_GameTimeScript, ccKRTSSE001_QuestFortu_05000A90, ccKRTSSE001_SetStageOnLoadScript, ccKRTSSE001_SleepSetStageScript, ccKRTSSE001_StageSetonActivate, ccKRTSSE001_TIF__05000A7E, ccMTYSSE001_DisableOnLoad, ccQDRSSE002_FollowerIdleOnSitScript, ccRMSSSE001_AltarActivateScript, ccRMSSSE001_GhostTrapScript, ccRMSSSE001_SleepSetStageScript, ccRMSSSE001_TorchCountScript, ccRMSSSE001_TradeWithSkeletonScript, ccVSVSSE002_MainQuestScript, ccVSVSSE003_QF_MainQuest, ccVSVSSE004_AnimalAliasEggScript, ccVSVSSE004_AnimalAliasMilkScript, ccVSVSSE004_F_MainQuestManager, ccVSVSSE004_F_OverseerAliasScript, ccVSVSSE004_GuardDogAliasScript, ccVSVSSE004_HorseAliasScript, ccVSVSSE004_TIF_BuyChickens, ccVSVSSE004_TIF_BuyChickensSpouse, ccVSVSSE004_TIF_BuyCow, ccVSVSSE004_TIF_BuyCowSpouse, ccVSVSSE004_TIF_BuyGoat, ccVSVSSE004_TIF_BuyGoatSpouse, ccVSVSSE004_TIF_BuyHorse, ccVSVSSE004_TIF_BuyHorseSpouse, ccVSVSSE004_TIF_CollectProfitF, ccVSVSSE004_TIF_CollectProfitM, ccVSVSSE004_TIF_CollectProfitSpouse, ccVSVSSE004_TIF_FarmhandDismiss2, ccVSVSSE004_TIF_FarmhandHire, ccVSVSSE004_TIF_OverseerHire, ccVSVSSE004_TIF_OverseerHireSpouse, ccVSVSSE004_TIF_SpawnFarmhand1, ccVSVSSE004_TIF_SpawnFarmhand1Spouse, ccVSVSSE004_TIF_UpgradeAltKidRoom, ccVSVSSE004_TIF_UpgradeBedroom, ccVSVSSE004_TIF_UpgradeBedroomSpouse, ccVSVSSE004_TIF_UpgradeDining, ccVSVSSE004_TIF_UpgradeDiningSpouse, ccVSVSSE004_TIF_UpgradeKidRoom, ccVSVSSE004_TIF_UpgradeKidRoomAltS, ccVSVSSE004_TIF_UpgradeKidRoomRepS, ccVSVSSE004_TIF_UpgradeKidRoomReplace, ccVSVSSE004_TIF_UpgradeKidRoomSpouse, ccVSVSSE004_TIF_UpgradeKitchen, ccVSVSSE004_TIF_UpgradeKitchenSpouse, ccVSVSSE004_TIF_UpgradeLab, ccVSVSSE004_TIF_UpgradeLabSpouse, ccVSVSSE004_TIF_UpgradeLoft, ccVSVSSE004_TIF_UpgradeLoftSpouse, urshug_TIF__0200183E
