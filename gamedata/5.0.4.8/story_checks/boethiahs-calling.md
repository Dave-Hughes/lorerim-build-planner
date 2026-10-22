# Start check: Boethiah's Calling (`boethiahs-calling`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Boethiah's Calling (`DA02`, Skyrim.esm:04D8D6, Wintersun - Reqtificated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Cultist1 of DA02 (Boethiah's Calling) (created)), "I'll do nothing of the sort.": SetStage 6 (when: the speaker is the one in alias Cultist1). Source: TIF__0004D8AF.Fragment_0 on INFO Skyrim.esm:04D8AF (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias Cultist1 of DA02 (Boethiah's Calling) (created)), "I'll do it.": SetStage 6 (when: the speaker is the one in alias Cultist1). Source: TIF__0004D8CA.Fragment_0 on INFO Skyrim.esm:04D8CA (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias Cultist1 of DA02 (Boethiah's Calling) (created)), "I'll do it.": SetStage 10 (when: the speaker is the one in alias Cultist1). Source: TIF__0004D8CA.Fragment_1 on INFO Skyrim.esm:04D8CA (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias Cultist1 of DA02 (Boethiah's Calling) (created)), "(Invisible Walk Away)": SetStage 6 (when: the speaker is the one in alias Cultist1). Source: TIF__0004D8B0.Fragment_0 on INFO Skyrim.esm:04D8B0 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias BoethiahsConduit of DA02 (Boethiah's Calling) (run time)), "I'll do it.": SetStage 9 (when: the speaker is the one in alias BoethiahsConduit). Source: TIF__010048A6.Fragment_0 on INFO TheChoiceIsYours.esp:0048A6 (TheChoiceIsYours.esp). **script**
- Dialogue with someone the line does not name (named by alias BoethiahsConduit of DA02 (Boethiah's Calling) (run time)), "I'll do nothing of the sort.": SetStage 8 (when: the speaker is the one in alias BoethiahsConduit). Source: TIF__010048A5.Fragment_0 on INFO TheChoiceIsYours.esp:0048A5 (TheChoiceIsYours.esp). **script**
- Read Boethiah's Proving (SetStage 1). Source: DA02BookScript.OnRead on BOOK Skyrim.esm:032E72. **script**
- Read The Truth of Boethiah (SetStage 1). Source: DA02BookScript.OnRead on BOOK Journey to Baan Malur.esp:48C8BA. **script**
- Story manager node DA02IncreaseLevelNodeSHARES, event: level up; conditions up its parents: level >= DA02MinLevel (now 20); The Man in Black stage < 10. Source: DA02IncreaseLevelNodeSHARES Skyrim.esm:09E1AF (BoethiahCalling_AlternativeQuest.esp). **run time**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find the cult of Boethiah". Source: Skyrim.esm:04D8D6 QOBJ 5. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Find the Sacellum of Boethiah". Source: Skyrim.esm:04D8D6 QOBJ 1. **files**
- Target alias ShrineCenterMarker (forced): a marker (forced reference, placed in Shrine of Boethiah). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Global DA02MinLevel: record 20.0 (LoreRim - Global Modifiers.esp). **conflict**

**Gives**: nothing on its completing stages.

## 2. The Man in Black (`DA02AltQuest`, BoethiahCalling_AlternativeQuest.esp:000800, BoethiahCalling_AlternativeQuest.esp)

**Started by**

- Dialogue with Rudin Filaro, placed in Braidwood Inn, "Fine. I'll take you to the Shrine.": SetStage 10 (when: the speaker is Rudin Filaro). Source: TIF_madStartMIBQuest.Fragment_0 on INFO BoethiahCalling_AlternativeQuest.esp:000810 (BoethiahCalling_AlternativeQuest.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BoethiahCalling_AlternativeQuest.esp:000800 DNAM (BoethiahCalling_AlternativeQuest.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Investigate the nearby area.". Source: BoethiahCalling_AlternativeQuest.esp:000800 QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Escort Rudin to the Shrine.". Source: BoethiahCalling_AlternativeQuest.esp:000800 QOBJ 10. **files**
- Target alias Shrine Rune (forced): a marker (forced reference, placed in Shrine of Boethiah). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 3. DA02 Hook (`WEDA02`, Skyrim.esm:04A602, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Story manager node WEPriorityQuests, event: script event; conditions up its parents: global WEDebug == 0 (now 0); global WEEnabled == 1 (now 1); GetEventData WEStart == 1 or GetEventData WERoadStart == 1. Source: WEPriorityQuests Skyrim.esm:0896A9 (LoreRim - World Fixes.esp). **run time**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Investigate the Boethiah cultist". Source: Skyrim.esm:04A602 QOBJ 10. **files**
- Target alias Cultist (created): Boethiah Cultist (created item). **files**

**Needs**

- Its own conditions: DA02 Hook stage 1 not done; GetQuestRunning Boethiah's Calling == 1; Boethiah's Calling stage < 1. **files**
- Global WEDebug: record 0.0 (Skyrim.esm). **files**
- Global WEEnabled: record 1.0 (Skyrim.esm); at run time script QF_E3demo_00093637:  = 0; script CarriageSystemScript:  = None; script CarriageSystemScript:  = None. **run time**

**Gives**: nothing on its completing stages.

## 4. Boethiah's Bidding (`DA02KillObj`, Skyrim.esm:052795, Skyrim.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 50; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Assassinate the Jarl of Solitude". Source: Skyrim.esm:052795 QOBJ 50. **files**
- Target alias Elisif (unique): Elisif the Fair (unique actor, placed in Blue Palace, The Blue Palace). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Blue Palace, The Blue Palace: 6 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | To get into Boethiah's Calling: talk to a marker in Shrine of Boethiah: The Man in Black is running from the start (Escort Rudin to the Shrine.). |

## Routes into the first quest from outside the starts

### dialogue INFO Skyrim.esm:04D8AF

- Speaker: not named by an NPC. Named by: alias Cultist1 of DA02 (Boethiah's Calling) (created).
- The player's prompt: "I'll do nothing of the sort.".
- The reply: "Then you are weak and inconsequential.".
- When it's offered: the speaker is the one in alias Cultist1.
- What it does: SetStage 6 on DA02 (Boethiah's Calling). Source: TIF__0004D8AF.Fragment_0 on INFO Skyrim.esm:04D8AF (Skyrim.esm); topic DA02CultistNo. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: alias Cultist1 of DA02 (Boethiah's Calling) (created).
- In one sentence: Talk to the speaker the line's conditions name and choose "I'll do nothing of the sort.", when the speaker is the one in alias Cultist1: SetStage 6 on DA02 (Boethiah's Calling).

### dialogue INFO Skyrim.esm:04D8CA

- Speaker: not named by an NPC. Named by: alias Cultist1 of DA02 (Boethiah's Calling) (created).
- The player's prompt: "I'll do it.".
- The reply: "That remains to be seen. But if it is so, and if Boethiah appears, then we will welcome you as one of us.".
- When it's offered: the speaker is the one in alias Cultist1.
- What it does: SetStage 6 on DA02 (Boethiah's Calling). Source: TIF__0004D8CA.Fragment_0 on INFO Skyrim.esm:04D8CA (Skyrim.esm); topic DA02CultistYes. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: alias Cultist1 of DA02 (Boethiah's Calling) (created).
- In one sentence: Talk to the speaker the line's conditions name and choose "I'll do it.", when the speaker is the one in alias Cultist1: SetStage 6 on DA02 (Boethiah's Calling).

### dialogue INFO Skyrim.esm:04D8B0

- Speaker: not named by an NPC. Named by: alias Cultist1 of DA02 (Boethiah's Calling) (created).
- The player's prompt: "(Invisible Walk Away)".
- The reply: "You are nothing.".
- When it's offered: the speaker is the one in alias Cultist1.
- What it does: SetStage 6 on DA02 (Boethiah's Calling). Source: TIF__0004D8B0.Fragment_0 on INFO Skyrim.esm:04D8B0 (Skyrim.esm); topic DA02CultistNeverMind. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: alias Cultist1 of DA02 (Boethiah's Calling) (created).
- In one sentence: Talk to the speaker the line's conditions name and choose "(Invisible Walk Away)", when the speaker is the one in alias Cultist1: SetStage 6 on DA02 (Boethiah's Calling).

### dialogue INFO TheChoiceIsYours.esp:0048A6

- Speaker: not named by an NPC. Named by: alias BoethiahsConduit of DA02 (Boethiah's Calling) (run time).
- The player's prompt: "I'll do it.".
- The reply: "We shall soon find out.".
- When it's offered: the speaker is the one in alias BoethiahsConduit.
- What it does: SetStage 9 on DA02 (Boethiah's Calling). Source: TIF__010048A6.Fragment_0 on INFO TheChoiceIsYours.esp:0048A6 (TheChoiceIsYours.esp); topic DA02BoethiahAccept. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: alias BoethiahsConduit of DA02 (Boethiah's Calling) (run time).
- In one sentence: Talk to the speaker the line's conditions name and choose "I'll do it.", when the speaker is the one in alias BoethiahsConduit: SetStage 9 on DA02 (Boethiah's Calling).

### dialogue INFO TheChoiceIsYours.esp:0048A5

- Speaker: not named by an NPC. Named by: alias BoethiahsConduit of DA02 (Boethiah's Calling) (run time).
- The player's prompt: "I'll do nothing of the sort.".
- The reply: "I abide only those whose will is aligned to my own. Those who oppose my desires perish in the most dreadful of ways.".
- When it's offered: the speaker is the one in alias BoethiahsConduit.
- What it does: SetStage 8 on DA02 (Boethiah's Calling). Source: TIF__010048A5.Fragment_0 on INFO TheChoiceIsYours.esp:0048A5 (TheChoiceIsYours.esp); topic DA02BoethiahReject. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: alias BoethiahsConduit of DA02 (Boethiah's Calling) (run time).
- In one sentence: Talk to the speaker the line's conditions name and choose "I'll do nothing of the sort.", when the speaker is the one in alias BoethiahsConduit: SetStage 8 on DA02 (Boethiah's Calling).

### None

- What it does: stage None: SetStage 1. Source: DA02BookScript on None (?). **script**
- Started by: nothing in the records or scripts.
- **unread**: the trail stops here: nothing in the records or scripts starts None, and Alternate Perspective's start menu in LoreRim doesn't offer it.
- In one sentence: The trail stops at None: nothing in the records or scripts starts None, and Alternate Perspective's start menu in LoreRim doesn't offer it.

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
