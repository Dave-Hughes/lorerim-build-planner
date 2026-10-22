# Start check: Undeath (`undeath`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Black Book: Whispers of the Veil (`NecroBlackBookQuest01`, Undeath.esp:125089, Undeath.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Learn the Black Book's hidden knowledge". Source: Undeath.esp:125089 QOBJ 10. **files**
- Target alias BookTarget (forced): Black Book: Whispers of the Veil (forced reference, placed in Apocrypha). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 2. The Path of Transcendence (`NecroLichRitualQuest`, Undeath.esp:019EC8, UndeathFixes.esp)

**Started by**

- NecroBlackBookQuest01 (Black Book: Whispers of the Veil) at stage 20 calls SetStage 10. Source: QF__04125089.fragment_2 on Undeath.esp:125089 (Undeath.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Undeath.esp:019EC8 DNAM (UndeathFixes.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Create the Elixir of Defilation", shown at stage 10. Source: Undeath.esp:019EC8 QOBJ 11. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Construct the Phylactery". Source: Undeath.esp:019EC8 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 3. In their Footsteps (`NecroQuest01`, Undeath.esp:1E225A, UndeathFixes.esp)

**Started by**

- NecroUCLMaintenanceQuest, a helper quest calls SetStage 5; SetStage 5; NecroUCLMaintenanceQuest is started by the start-game flag. Sources: UCLMaintenaceQuestScript.OnInit, NecroUClMaintenanceAlias.OnPlayerLoadGame on UndeathFixes.esp:019D7B. **script**
- Read Torn Page from Traveler's Diary (SetStage 10). Source: DefaultOnReadSetQuestStageNotAlias.onRead on BOOK UndeathFixes.esp:168478. **script**
- Story manager node NecroQuestStart, event: change location; conditions up its parents: GetQuestRunning In their Footsteps == 0; In their Footsteps not completed; Blood on the Ice completed; The Wolf Queen Awakened completed. Source: NecroQuestStart UndeathFixes.esp:0C622F (UndeathQuestPrerequisiteNoLevel.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Investigate the scene of the attack", shown at stage 20. Source: Undeath.esp:1E225A QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Search for the Vigil of Stendarr caravan". Source: Undeath.esp:1E225A QOBJ 10. **files**
- Target alias Vigilant (forced): Vigilant Nikolas (forced reference, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 4. Exhuming Power (`NecroQuest02`, Undeath.esp:26C339, UndeathFixes.esp)

**Started by**

- NecroQuest01 (In their Footsteps) at stage 70 calls SetStage 0. Source: QF__041E225A.fragment_11 on Undeath.esp:1E225A (UndeathFixes.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Defeat the Necromancers", shown at stage 10. Source: Undeath.esp:26C339 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Locate the grave of Archmage Vyngald". Source: Undeath.esp:26C339 QOBJ 10. **files**
- Target alias Grave (forced): a marker (forced reference, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 5. Arkay the Enemy (`NecroQuest03`, Undeath.esp:26C344, UndeathFixes.esp)

**Started by**

- NecroQuest01 (In their Footsteps) at stage 70 calls SetStage 0. Source: QF__041E225A.fragment_11 on Undeath.esp:1E225A (UndeathFixes.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Clear out the Necromancers from the Temple of Arkay", shown at stage 10. Source: Undeath.esp:26C344 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Locate the Temple of Arkay". Source: Undeath.esp:26C344 QOBJ 10. **files**
- Target alias ShrineLocation (forced): a marker (forced reference, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Skyrim: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 6. Infernal Alchemy (`NecroQuest04`, Undeath.esp:26C345, UndeathFixes.esp)

**Started by**

- NecroQuest01 (In their Footsteps) at stage 70 calls SetStage 0. Source: QF__041E225A.fragment_11 on Undeath.esp:1E225A (UndeathFixes.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Defeat the Necromancers", shown at stage 10. Source: Undeath.esp:26C345 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Locate the Ritual Site". Source: Undeath.esp:26C345 QOBJ 10. **files**
- Target alias RitualLocation (forced): a marker (forced reference, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 7. Scourg Barrow (`NecroQuest05`, Undeath.esp:2BDBBF, Undeath.esp)

**Started by**

- NecroQuest01 (In their Footsteps) at stage 70 calls SetStage 0. Source: QF__041E225A.fragment_11 on Undeath.esp:1E225A (UndeathFixes.esp). **script**
- It starts by itself from the start of the game. (SetStage 10). Source: NecroQuest05Script.OnUpdate on Undeath.esp:2BDBBF (Undeath.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Read the Orders", shown at stage 15. Source: Undeath.esp:2BDBBF QOBJ 15. **files**
- Read Orders (SetStage 15). Source: defaultsetstageonplayeracquireitem.OnContainerChanged on BOOK Undeath.esp:2BDBC0. **script**

**Who and where**

- First objective: "Search the Necromancer's body". Source: Undeath.esp:2BDBBF QOBJ 10. **files**
- Target alias Gundar (unique): Gundar (unique actor, placed in Temple of Arkay). **files**
- Target alias Selonius (unique): Selonius the Mad (unique actor, placed in Skyrim). **files**
- Target alias Wynestra (unique): Wynestra (unique actor, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Arkay: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | To get into Undeath: The Path of Transcendence is running from the start: Construct the Phylactery. |

## Routes into the first quest from outside the starts

## The payoff

- **Dragonslayer** (completes at 200): nothing is given on its completing stages.
- **Paarthurnax** (completes at 99, 100): nothing is given on its completing stages.

## Three questions

**Is Skyrim.esm:0242BA MQ105, and is stage 160 the one that completes it?** Yes: Skyrim.esm:0242BA is MQ105 (The Way of the Voice), and stage 160 is its only completing stage.

**Who starts The Horn of Jurgen Windcaller, and where?** None:

**Does Dragonborn's cultist node read Timing is Everything's level (25 in its settings.ini), or something else?** Timing is Everything's setting iTIE_MinimumLevel:Dragonborn = 25 (settings.ini in Timing is Everything SE - Settings Loader).

- Node DLC2CultistAmbushNode001 (LoreRim - Global Modifiers.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 1 (now 1); you're not in Solstheim; The Way of the Voice stage >= 160; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode002 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 2 (now 1); you're not in Solstheim; The Horn of Jurgen Windcaller stage >= 60; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode003 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 3 (now 1); you're not in Solstheim; A Blade in the Dark stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode004 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 4 (now 1); you're not in Solstheim; Alduin's Wall stage >= 280; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode005 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 5 (now 1); you're not in Solstheim; The Throat of the World stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode006 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 6 (now 1); you're not in Solstheim; Elder Knowledge stage >= 100; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode007 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 7 (now 1); you're not in Solstheim; Alduin's Bane stage >= 220; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode008 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 8 (now 1); you're not in Solstheim; Dragonslayer stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode000 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 0 (now 1); you're not in Solstheim; Dragon Rising stage >= 90; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
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
