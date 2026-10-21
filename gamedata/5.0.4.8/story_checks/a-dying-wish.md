# Start check: A Dying Wish (`a-dying-wish`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. A Dying Wish (`ccKRTSSE001_zQuest`, cckrtsse001_altar.esl:000D63, Bittercup - Tweaks and Enhancements.esp)

**Started by**

- Start-game flag: the quest runs from the start of the game. Source: ccstartafterchargenscript.OnUpdate on cckrtsse001_altar.esl:000D63 (Bittercup - Tweaks and Enhancements.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Travel to the Roadside Ruins", shown at stage 2. Source: cckrtsse001_altar.esl:000D63 QOBJ 2. **files**
- **unread**: nothing outside its own stage fragments sets stage 2 or one before it.

**Who and where**

- First objective: "Find information at Dead Man's Drink". Source: cckrtsse001_altar.esl:000D63 QOBJ 1. **files**
- Target alias Journal (forced): a marker (forced reference, placed in Dead Man's Drink). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dead Man's Drink: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Rulnik's Dagger (stage 200, ccKRTSSE001_QF_01000D63.fragment_29); Bittercup (stage 200, ccKRTSSE001_QF_01000D63.fragment_29); ccKRTSSE001_BittercupNote02 (stage 200, ccKRTSSE001_QF_01000D63.fragment_29).

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | The reader found no way into A Dying Wish from it. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | The reader found no way into A Dying Wish from it. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | The reader found no way into A Dying Wish from it. |

## Routes into the first quest from outside the starts

### ccKRTSSE001_zQuest (A Dying Wish), its script's onupdate

- What it does: SetStage ccKRTSSE001_zQuest (A Dying Wish) 0. Source: ccstartafterchargenscript on cckrtsse001_altar.esl:000D63 (Bittercup - Tweaks and Enhancements.esp). **script**
- Called from: nothing the reader found.
- In one sentence: ccKRTSSE001_zQuest (A Dying Wish)'s onupdate does SetStage ccKRTSSE001_zQuest (A Dying Wish) 0; it is called from nothing the reader found.

## The payoff

- **Dragonslayer** (completes at 200): nothing is given on its completing stages.
- **Paarthurnax** (completes at 99, 100): nothing is given on its completing stages.

## Three questions

**Is Skyrim.esm:0242BA MQ105, and is stage 160 the one that completes it?** Yes: Skyrim.esm:0242BA is MQ105 (The Way of the Voice), and stage 160 is its only completing stage.

**Who starts The Horn of Jurgen Windcaller, and where?** None:

**Does Dragonborn's cultist node read Timing is Everything's level (25 in its settings.ini), or something else?** Timing is Everything's setting iTIE_MinimumLevel:Dragonborn = 25 (settings.ini in Timing is Everything SE - Settings Loader).

- Node DLC2CultistAmbushNode001 (LoreRim - Global Modifiers.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 1 (now 1); fn359 == 0; The Way of the Voice stage >= 160; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode002 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 2 (now 1); fn359 == 0; The Horn of Jurgen Windcaller stage >= 60; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode003 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 3 (now 1); fn359 == 0; A Blade in the Dark stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode004 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 4 (now 1); fn359 == 0; Alduin's Wall stage >= 280; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode005 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 5 (now 1); fn359 == 0; The Throat of the World stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode006 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 6 (now 1); fn359 == 0; Elder Knowledge stage >= 100; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode007 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 7 (now 1); fn359 == 0; Alduin's Bane stage >= 220; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode008 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 8 (now 1); fn359 == 0; Dragonslayer stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode000 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 0 (now 1); fn359 == 0; Dragon Rising stage >= 90; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**

## Run-time values

Settings loaders the story's globals touch, and whether the script the game runs reads their settings.ini:

- TimingIsEverything: script TIE_MCMScript on TimingIsEverything.esp:005E3B; the copy that wins is C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex (extends SKI_ConfigBase); it carries no settings.ini value into a global, so the globals keep their record values unless the player changes them in the menu.
- Wyrmstooth: script WT_MCMScript on Wyrmstooth.esp:AC1487; the copy that wins is C:/LoreRim\mods\Wyrmstooth - Settings Loader\Scripts\WT_MCMScript.pex (extends MCM_ConfigBase); it reads its MCM Helper settings and sets globals from them.

- Timing is Everything: Dragonborn level setting 25 (settings.ini in Timing is Everything SE - Settings Loader), meant for DLC2CultistAttackMinLevel_KRY (record 25.0 from TimingIsEverything.esp; in game 25.0; **files**).
- Wyrmstooth: WTStartLevel is 10 in a new game (record 20.0 in Requiem - Wyrmstooth.esp). Why: OnConfigInit runs once when the menu registers in a new game; it sets `migrated` and calls LoadSettings, which goes on only while bEnabled:Maintenance is set (it is 1) and then calls Load, which reads iWTGeneralRequirementsMinimalLevel:Requirements (10, settings.ini in Wyrmstooth - Settings Loader) and sets WTStartLevel to it; MigrateToMCMHelper, which would copy the global's record value (20.0) into that setting, runs only from OnGameReload or OnConfigOpen while `migrated` is false, and OnConfigInit has already set it, so a new game never migrates (an older save made before the loader would); OnGameReload reloads the settings only when bLoadSettingsonReload:Maintenance is set; it is 0, so later loads keep whatever the global holds. Source: WT_MCMScript (C:/LoreRim\mods\Wyrmstooth - Settings Loader\Scripts\WT_MCMScript.pex). **run time**

Scripts the records name that aren't in the install (30); calls inside them can't be read. Full list in the JSON.
