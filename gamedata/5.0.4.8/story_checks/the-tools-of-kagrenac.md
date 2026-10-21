# Start check: The Tools of Kagrenac (`the-tools-of-kagrenac`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Lost Heritage (`TOK_QUST_DialogueVonos`, Tools of Kagrenac.esp:21F230, Tools of Kagrenac.esp)

**Started by**

- Dialogue with Vonos Dreloth (named by alias Vonos_Dreloth of TOK_QUST_DialogueVonos (Lost Heritage) (unique)), placed in Hall of Attainment, Dormitory, "Alright, I'll do it!": SetStage 10 (when: the speaker is the one in alias Vonos_Dreloth). Source: TIF__042336B5.Fragment_1 on INFO Tools of Kagrenac.esp:2336B5 (Tools of Kagrenac.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- TOK_QUST_KagrenacTools (Kagrenac's Tools) at stage 10 calls Start. Source: QF_TOK_QUST_KagrenacTools_0421F221.fragment_9 (Tools of Kagrenac.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Vonos Dreloth", shown at stage 20. Source: Tools of Kagrenac.esp:21F230 QOBJ 20. **files**
- TOK_QUST_DialogueVonos (Lost Heritage) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on Tools of Kagrenac.esp:21F230 (Tools of Kagrenac.esp). **script**

**Who and where**

- First objective: "Find Vonos's Missing Ring". Source: Tools of Kagrenac.esp:21F230 QOBJ 10. **files**
- Target alias Ring_of_the_Wind_1 (forced): Ring of the Wind (forced reference, placed in The Arcanaeum). **files**
- Target alias Ring_of_the_Wind_2 (forced): Ring of the Wind (forced reference, placed in The Arcanaeum). **files**
- Target alias Ring_of_the_Wind_3 (forced): Ring of the Wind (forced reference, placed in The Arcanaeum). **files**
- Target alias Ring_of_the_Wind_4 (forced): Ring of the Wind (forced reference, placed in The Arcanaeum). **files**
- Target alias Ring_of_the_Wind_5 (forced): Ring of the Wind (forced reference, placed in The Arcanaeum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Arcanaeum: 4 doors, 0 locked; The Arcanaeum: 4 doors, 0 locked; The Arcanaeum: 4 doors, 0 locked; The Arcanaeum: 4 doors, 0 locked; The Arcanaeum: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. My Precious (`TOK_QUST_DialogueYassour`, Tools of Kagrenac.esp:21F231, Tools of Kagrenac.esp)

**Started by**

- Dialogue with Yassour Tansumiran (named by alias Yassour_Tansumiran of TOK_QUST_DialogueYassour (My Precious) (unique)), placed in The Retching Netch, "Sure! I'll get you back Wraithguard.": SetStage 10 (when: the speaker is the one in alias Yassour_Tansumiran). Source: TIF__0426614D.Fragment_1 on INFO Tools of Kagrenac.esp:26614D (Tools of Kagrenac.esp). **script**
- Dialogue with Yassour Tansumiran (named by alias Yassour_Tansumiran of TOK_QUST_DialogueYassour (My Precious) (unique)), placed in The Retching Netch, "I'll get it back for myself!": SetStage 10 (when: the speaker is the one in alias Yassour_Tansumiran). Source: TIF__0426614F.Fragment_1 on INFO Tools of Kagrenac.esp:26614F (Tools of Kagrenac.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- TOK_QUST_KagrenacTools (Kagrenac's Tools) at stage 10 calls Start. Source: QF_TOK_QUST_KagrenacTools_0421F221.fragment_9 (Tools of Kagrenac.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "(Optional) Return to Yassour Tansumiran", shown at stage 20. Source: Tools of Kagrenac.esp:21F231 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "(Optional) Retrieve Wraithguard for Yassour". Source: Tools of Kagrenac.esp:21F231 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 3. Kagrenac's Tools (`TOK_QUST_KagrenacTools`, Tools of Kagrenac.esp:21F221, Tools of Kagrenac.esp)

**Started by**

- Story manager node TOK_SMQN_QuestStart, event: item added; conditions up its parents: GetEventData TOK_KYWD_KeeningSMQuestStart == 1; Arniel's Endeavor completed; The Way of the Voice completed; GetQuestRunning Kagrenac's Tools == 0. Source: TOK_SMQN_QuestStart Tools of Kagrenac.esp:AA0E7D (Tools of Kagrenac.esp). **run time**
- Story manager node TOK_SMQN_QuestAltStart, event: item added; conditions up its parents: global TOK_GLOB_MCMAltStart_Bool == 1 (now 0); GetQuestRunning Kagrenac's Tools == 0. Source: TOK_SMQN_QuestAltStart Tools of Kagrenac.esp:AA0E7E (Tools of Kagrenac.esp). **run time**
- (First objective shown at stage 2; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet Mathis Valen at the Silver-Blood Inn in Markarth", shown at stage 5. Source: Tools of Kagrenac.esp:21F221 QOBJ 20. **files**
- TOK_QUST_KagrenacTools (Kagrenac's Tools) calls SetStage 5. Source: defaultsetstageonclosebook.stageHandling on Tools of Kagrenac.esp:21F221 (Tools of Kagrenac.esp). **script**
- TOK_QUST_KagrenacTools (Kagrenac's Tools) calls SetStage 5. Source: defaultsetstageonclosebook.OnActivate on Tools of Kagrenac.esp:21F221 (Tools of Kagrenac.esp). **script**
- TOK_QUST_KagrenacTools (Kagrenac's Tools) calls SetStage 5. Source: defaultsetstageonclosebook.OnEquipped on Tools of Kagrenac.esp:21F221 (Tools of Kagrenac.esp). **script**
- TOK_QUST_KagrenacTools (Kagrenac's Tools) calls SetStage 5. Source: defaultsetstageonclosebook.OnRead on Tools of Kagrenac.esp:21F221 (Tools of Kagrenac.esp). **script**

**Who and where**

- First objective: "Read the Anonymous Note". Source: Tools of Kagrenac.esp:21F221 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Global TOK_GLOB_MCMAltStart_Bool: record 0.0 (Tools of Kagrenac.esp); at run time script TOK_SCRIPT_MCMConfig_Quest_Handler:  = 0; script TOK_SCRIPT_MCMConfig_Quest_Handler:  = 1; script TOK_SCRIPT_MCMConfig_Quest_Handler:  = 0; script TOK_SCRIPT_MCMConfig_Quest_Handler:  = 1. **conflict**

**Gives**: nothing on its completing stages.

## 4. Darkest Depths (`TOK_QUST_LabyrinthPuzzle`, Tools of Kagrenac.esp:71C218, Tools of Kagrenac.esp)

**Started by**

- TOK_QUST_KagrenacTools (Kagrenac's Tools) at stage 30 calls Start. Source: QF_TOK_QUST_KagrenacTools_0421F221.fragment_15 on Tools of Kagrenac.esp:21F221 (Tools of Kagrenac.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Lower the eastern portcullis (<Global=TOK_GLOB_PortcullisLeftCount>/<Global=TOK_GLOB_PortcullisLeftTotal>)", shown at stage 10. Source: Tools of Kagrenac.esp:71C218 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Lower the western portcullis (<Global=TOK_GLOB_PortcullisRightCount>/<Global=TOK_GLOB_PortcullisRightTotal>)". Source: Tools of Kagrenac.esp:71C218 QOBJ 10. **files**
- Target alias Ayleid_Pressure_Plate_A (forced): a marker (forced reference, placed in Oio-Lalor, The Labyrinthian, Oio-Lalor). **files**
- Target alias Ayleid_Pressure_Plate_B (forced): a marker (forced reference, placed in Oio-Lalor, The Labyrinthian, Oio-Lalor). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Oio-Lalor, The Labyrinthian, Oio-Lalor: 6 doors, 1 locked; Oio-Lalor, The Labyrinthian, Oio-Lalor: 6 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 5. Vivec's Trial of Wisdom (`TOK_QUST_SunderVault`, Tools of Kagrenac.esp:24CBF6, Tools of Kagrenac.esp)

**Started by**

- TOK_QUST_KagrenacTools (Kagrenac's Tools) at stage 20 calls Start. Source: QF_TOK_QUST_KagrenacTools_0421F221.fragment_13 on Tools of Kagrenac.esp:21F221 (Tools of Kagrenac.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Place the Stanzas on the receptacles", shown at stage 20. Source: Tools of Kagrenac.esp:24CBF6 QOBJ 20. **files**
- TOK_QUST_SunderVault (Vivec's Trial of Wisdom) calls SetStage 20. Source: TOK_SCRIPT_Sunder_Quest_Handler.IncrementStanzaCount on Tools of Kagrenac.esp:24CBF6 (Tools of Kagrenac.esp). **script**
- TOK_QUST_SunderVault (Vivec's Trial of Wisdom) calls SetStage 20. Source: TOK_SCRIPT_StanzaCountAlias.OnContainerChanged on Tools of Kagrenac.esp:24CBF6 (Tools of Kagrenac.esp), through TOK_QUST_SunderVault (Vivec's Trial of Wisdom)'s incrementstanzacount. **script**

**Who and where**

- First objective: "Find the three Stanzas of Kagrenac (<Global=TOK_GLOB_StanzaCount>/<Global=TOK_GLOB_StanzaTotal>)". Source: Tools of Kagrenac.esp:24CBF6 QOBJ 10. **files**
- Target alias 1st_Stanza_of_Kagrenac (forced): 1st Stanza of Kagrenac (forced reference, placed in Rkulftzul, Sealed Vault). **files**
- Target alias 2nd_Stanza_of_Kagrenac (forced): 2nd Stanza of Kagrenac (forced reference, placed in Rkulftzul, Sealed Vault). **files**
- Target alias 3rd_Stanza_of_Kagrenac (forced): 3rd Stanza of Kagrenac (forced reference, placed in Rkulftzul, Sealed Vault). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Rkulftzul, Sealed Vault: 1 door, 0 locked; Rkulftzul, Sealed Vault: 1 door, 0 locked; Rkulftzul, Sealed Vault: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | To get into The Tools of Kagrenac: ask Vonos Dreloth in Hall of Attainment, Dormitory "Alright, I'll do it!" (the speaker is the one in alias Vonos_Dreloth), which starts Lost Heritage. |

## Routes into the first quest from outside the starts

### dialogue INFO Tools of Kagrenac.esp:2336B5

- Speaker: Vonos Dreloth (Dunmer), placed in Hall of Attainment, Dormitory. Named by: alias Vonos_Dreloth of TOK_QUST_DialogueVonos (Lost Heritage) (unique).
- The player's prompt: "Alright, I'll do it!".
- The reply: "Good! I just remember... I think I last had the ring... hmm..." / "In the Arcanaeum! Yes, I definitely still had it in the Arcanaeum! I'd say that should be the place to start!".
- When it's offered: the speaker is the one in alias Vonos_Dreloth.
- What it does: SetStage 10 on TOK_QUST_DialogueVonos (Lost Heritage). Source: TIF__042336B5.Fragment_1 on INFO Tools of Kagrenac.esp:2336B5 (Tools of Kagrenac.esp); topic TOK_VonosQuestStartB1Topic. **script**
- In one sentence: Talk to Vonos Dreloth (Dunmer) in Hall of Attainment, Dormitory and choose "Alright, I'll do it!", when the speaker is the one in alias Vonos_Dreloth: SetStage 10 on TOK_QUST_DialogueVonos (Lost Heritage).

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

Scripts the records name that aren't in the install (259); calls inside them can't be read. Full list in the JSON.
