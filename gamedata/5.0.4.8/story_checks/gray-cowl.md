# Start check: The Gray Cowl of Nocturnal (`gray-cowl`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Memories of the Umbranox (`manny_GF_Books`, Gray Fox Cowl.esm:0026F4, Gray Fox Cowl.esm)

**Started by**

- Read Caio's Journal vol. 2 (SetStage 10). Source: manny_GF_OnReadOnce.OnContainerChanged on BOOK Gray Fox Cowl.esm:0026F8. **script**
- Read Caio's Journal vol. 3 (SetStage 10). Source: manny_GF_OnReadOnce.OnContainerChanged on BOOK Gray Fox Cowl.esm:0026FB. **script**
- Read Caio's Journal vol. 5 (SetStage 10). Source: manny_GF_OnReadOnce.OnContainerChanged on BOOK Gray Fox Cowl.esm:000EB4. **script**
- Start-game flag: the quest runs from the start of the game. Source: Gray Fox Cowl.esm:0026F4 DNAM (Gray Fox Cowl.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Deliver the journals to Seviana", shown at stage 20. Source: Gray Fox Cowl.esm:0026F4 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Find all the journals (<Global=manny_GF_Global_BooksCount>/<Global=manny_GF_Global_BooksTotal>)". Source: Gray Fox Cowl.esm:0026F4 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 2. Bury Valen Dreth (`manny_GF_BuryValenDreth`, Gray Fox Cowl.esm:01E072, Gray Fox Cowl.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bury the rests of Valen Dreth at Falkreath". Source: Gray Fox Cowl.esm:01E072 QOBJ 10. **files**
- Target alias myDestination (forced): a marker (forced reference, placed in Falkreath). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Falkreath: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Left Eye of Coldharbour (stage 30, manny_GF_ValenQuestScript.fragment_4).

## 3. Reward of Coldharbour (`manny_GF_ColdharbourQuest`, Gray Fox Cowl.esm:01F56B, Gray Fox Cowl.esm)

**Started by**

- manny_GF_MQ (The Call of Gray Cowl of Nocturnal) at stage 150 calls SetStage 10. Source: manny_GF_MainQuestScript.fragment_17 on Gray Fox Cowl.esm:001E61 (Gray Fox Cowl.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "(Optional) Do not kill the Guardians of Coldharbour", shown at stage 10. Source: Gray Fox Cowl.esm:01F56B QOBJ 10. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Escape from Coldharbour". Source: Gray Fox Cowl.esm:01F56B QOBJ 5. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 4. Time for the Farewells (`manny_GF_Farewell`, Gray Fox Cowl.esm:01CFA7, Gray Fox Cowl.esm)

**Started by**

- Dialogue with Seviana Umbranox, placed in Seviana's House, "It's an honor.": SetStage 10 (when: Time for the Farewells stage < 10; GetQuestRunning Time for the Farewells == 1; the speaker is Seviana Umbranox). Source: manny_GF_FarewellLeaveHomeScript.Fragment_1 on INFO Gray Fox Cowl.esm:01CFB2 (Gray Fox Cowl.esm). **script**
- manny_GF_MQ (The Call of Gray Cowl of Nocturnal) at stage 999 calls Start; its stage 999 is set by Dialogue with Seviana Umbranox, placed in Seviana's House: SetStage 999. Source: manny_GF_MainQuestScript.fragment_28 on Gray Fox Cowl.esm:001E61 (Gray Fox Cowl.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Escort Seviana and Luvien to the docks of Solitude". Source: Gray Fox Cowl.esm:01CFA7 QOBJ 10. **files**
- Target alias Arrival (forced): a marker (forced reference, placed in Solitude). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 5. The Experiment (`manny_GF_IrlavExperiment`, Gray Fox Cowl.esm:03039F, Gray Fox Cowl.esm)

**Started by**

- Dialogue with Ilrav Baenius, placed in Three Peaks Staff and Magic, "Is there something else I can do for you?": SetStage 10 (when: manny_GF_MiscQUestIrlavFavour stage >= 10; the speaker is Ilrav Baenius). Source: manny_GF_IrlavExperimentStart.Fragment_0 on INFO Gray Fox Cowl.esm:0303BF (Gray Fox Cowl.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Gray Fox Cowl.esm:03039F DNAM (Gray Fox Cowl.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Place the artifact near Falkreath", shown at stage 10. Source: Gray Fox Cowl.esm:03039F QOBJ 2. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Place the artifact near Markarth". Source: Gray Fox Cowl.esm:03039F QOBJ 1. **files**
- Target alias Holder1 (forced): Holder (forced reference, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: Irlav's Penitence (stage 300, QF_manny_GF_IrlavExperiment_0203039F.fragment_6).

## 6. Claim Shanta Filibb (`manny_GF_MiscQuestShantaFilibb`, Gray Fox Cowl.esm:050159, Synthesis - Gameplay Overwrite.esp)

**Started by**

- Start-game flag: the quest runs from the start of the game. Source: Gray Fox Cowl.esm:050159 DNAM (Synthesis - Gameplay Overwrite.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Check for a reward", shown at stage 50. Source: Gray Fox Cowl.esm:050159 QOBJ 15. **files**
- manny_GF_MiscQuestShantaFilibb (Claim Shanta Filibb) calls SetStage 20. Source: manny_GF_QuestNoteShantaFilibbScript.onRead on Gray Fox Cowl.esm:050159 (Synthesis - Gameplay Overwrite.esp). **script**

**Who and where**

- First objective: "Kill all the unknown attackers". Source: Gray Fox Cowl.esm:050159 QOBJ 10. **files**
- Target alias ShantaFilibb (forced): a marker (forced reference, placed in Shanta Filibb). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 7. The Call of Gray Cowl of Nocturnal (`manny_GF_MQ`, Gray Fox Cowl.esm:001E61, Gray Fox Cowl.esm)

**Started by**

- manny_GF_PrepareMQ, a helper quest at stage 10 calls SetStage 10; manny_GF_PrepareMQ is started by story manager node manny_GF_Steal (event: change location; Under New Management stage == 200). Source: manny_GF_PrepareMQScript.fragment_3 on Gray Fox Cowl.esm:001F3B (Gray Fox Cowl.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Gray Fox Cowl.esm:001E61 DNAM (Gray Fox Cowl.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find the Hall of the Initiation", shown at stage 25. Source: Gray Fox Cowl.esm:001E61 QOBJ 20. **files**
- Dialogue with Seviana Umbranox, placed in Seviana's House, "Keepers?": SetStage 22 (when: The Call of Gray Cowl of Nocturnal stage == 21; the speaker is Seviana Umbranox). Reply: "Please, Make yourself comfortable. I will tell you the whole story." Source: manny_GF_SevianaSitScript.Fragment_1 on INFO Gray Fox Cowl.esm:00328D (Gray Fox Cowl.esm). **script**
- Dialogue with Seviana Umbranox, placed in Seviana's House, "What do I have to do?": SetStage 25 (when: The Call of Gray Cowl of Nocturnal stage == 22; the speaker is Seviana Umbranox; fn644 == 1). Reply: "My mission is to give you the Arrow and to show you where to start your quest. You will need this key as well. Take it, it will open the gate of the place where you're headed." Source: manny_GF_SevianaExplainQuestScript.Fragment_1 on INFO Gray Fox Cowl.esm:0032E7 (Gray Fox Cowl.esm). **script**
- Dialogue with Seviana Umbranox, placed in Seviana's House, "What?": SetStage 21 (when: the speaker is Seviana Umbranox; The Call of Gray Cowl of Nocturnal stage == 20). Reply: "You're here! Finally you're here! My family has been waiting for generations, Dragonborn." Source: manny_GF_SevianaAfterFGScript.Fragment_0 on INFO Gray Fox Cowl.esm:034C04 (Gray Fox Cowl.esm). **script**

**Who and where**

- First objective: "Reach the place". Source: Gray Fox Cowl.esm:001E61 QOBJ 10. **files**
- Target alias Seviana (unique): Seviana Umbranox (unique actor, placed in Seviana's House). **files**

**Needs**

- The door from Skyrim into Seviana's House needs the Key to Seviana's House. Source: Gray Fox Cowl.esm:001A88 (Gray Fox Cowl.esm). **files**
- Ways in: Seviana's House: 1 door, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 8. The Curse of Sadraaka (`manny_GF_Sadraaka`, Gray Fox Cowl.esm:026AE8, Gray Fox Cowl.esm)

**Started by**

- It starts from something placed in Forgotten City. (SetStage 5). Source: defaultsetStageTrigSCRIPT on Skyrim.esm:033F50 (1 placed). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill Sadraaka and free the Forgotten City from the curse", shown at stage 10. Source: Gray Fox Cowl.esm:026AE8 QOBJ 20. **files**
- manny_GF_Sadraaka (The Curse of Sadraaka) calls SetStage 10. Source: defaultsetstageonplayeracquire.OnContainerChanged on Gray Fox Cowl.esm:026AE8 (Gray Fox Cowl.esm). **script**

**Who and where**

- First objective: "Find information about the Forgotten City". Source: Gray Fox Cowl.esm:026AE8 QOBJ 10. **files**
- Target alias myTriggerBook (created): We were Yokudans (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 9. Helping the Enemy (`ASHGAndynQuest`, BetalillesHammerfellQuestBundle.esp:0017A1, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Honai, placed in Ash'abah Hideout, "Anything new about Andyn Pamarc?": SetStage 10 (when: Helping the Enemy stage < 10; Is There a Necromancer in Town? completed; The Library Lost to the Ages completed; The Ash'abah completed; the speaker is Honai). Source: ASHG_TIF__06000DB2.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:0017D1 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:0017A1 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Defeat Andyn Pamarc", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:0017A1 QOBJ 20. **files**
- Dialogue with Andyn Pamarc, placed in Alik'r Desert, "You're Andyn Pamarc.": SetStage 20 (when: the speaker is Andyn Pamarc). Reply: "You know my name? Interesting... Remember it..." Source: ASHG_TIF__06000DBD.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:0017DC (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Talk to Andyn Pamarc". Source: BetalillesHammerfellQuestBundle.esp:0017A1 QOBJ 10. **files**
- Target alias Andyn01 (forced): Andyn Pamarc (forced reference, placed in Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 1500 gold (stage 200, ASHG_QF_ASHGAndynQuest_06000CF9.fragment_5).

## 10. The Ash'abah (`ASHGAshabahQuest`, BetalillesHammerfellQuestBundle.esp:0017A0, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Honai, placed in Ash'abah Hideout, "Do you need help?": SetStage 10 (when: the speaker is Honai). Source: ASHG_TIF__06000A9F.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:001549 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:0017A0 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Honai of the Ash'abah", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:0017A0 QOBJ 20. **files**
- ASHGAshabahQuest (The Ash'abah) calls SetStage 20. Source: defaultaliasondeathscript.onDeath on BetalillesHammerfellQuestBundle.esp:0017A0 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Clear the ancient ruins in the Alik'r Desert". Source: BetalillesHammerfellQuestBundle.esp:0017A0 QOBJ 10. **files**
- Target alias Mummy1 (unique): The Silent Sword (unique actor, placed in Ancient Ruins). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Ancient Ruins: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: 1000 gold (stage 200, ASHG_QF_ASHGAshabahQuest_06000CF8.fragment_2).

## 11. The Library Lost to the Ages (`ASHGMageQuest`, BetalillesHammerfellQuestBundle.esp:00179F, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Dorian Masterhart, placed in Dorian's House, Ben Erai, "Do you need any help to locate this library?": SetStage 10 (when: the speaker is Dorian Masterhart). Source: ASHG_TIF__06000D20.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:000D20 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:00179F DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Go back to Dorian in Ben Erai", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:00179F QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Find the ancient library in the Alik'r Desert". Source: BetalillesHammerfellQuestBundle.esp:00179F QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 1500 gold (stage 200, ASHG_QF_ASHGMageQuest_06000CF7.fragment_5).

## 12. Is There a Necromancer in Town? (`ASHGNecroQuest`, BetalillesHammerfellQuestBundle.esp:001545, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Thaik, placed in Thaik's House, Salas Kazas, "I will deal with it.": SetStage 10 (when: the speaker is Thaik). Source: ASHG_TIF__06000D75.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:0017B4 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:001545 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Go back to Thaik in Salas Kazas", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:001545 QOBJ 20. **files**
- ASHGNecroQuest (Is There a Necromancer in Town?) calls SetStage 20. Source: defaultaliasondeathscript.onDeath on BetalillesHammerfellQuestBundle.esp:001545 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Find the necromancer camp in the desert and deal with the necromancers". Source: BetalillesHammerfellQuestBundle.esp:001545 QOBJ 10. **files**
- Target alias Necro01 (forced): Agryval Stemuseph (forced reference, placed in Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 1000 gold (stage 200, ASHG_QF_ASHGNecroQuest_06000A9B.fragment_2).

## 13. Weltan the Poet (`ASHGPoetryQuest`, BetalillesHammerfellQuestBundle.esp:001781, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Sharza, placed in Sharza's House, Salas Kazas, "Alright... I guess I can do that.": SetStage 10 (when: the speaker is Sharza). Source: ASHG_TIF__06000CE3.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:00178B (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:001781 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Find the two books written by Weltan in the Alik'r Desert and bring them back to Sharza in Kazas Salas". Source: BetalillesHammerfellQuestBundle.esp:001781 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 1000 gold (stage 200, ASHG_QF_ASHGPoetryQuest_06000CD9.fragment_2).

## 14. From Solstheim to Hammerfell (`ASHGSolstheimQuest`, BetalillesHammerfellQuestBundle.esp:00179E, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Lloros Reynel, placed in Reynel's House, Ben Erai, "Alright, let's go.": SetStage 10 (when: the speaker is Lloros Reynel). Source: ASHG_TIF__06000D32.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:000D32 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:00179E DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Get Lloros Reynel to Hammerfell". Source: BetalillesHammerfellQuestBundle.esp:00179E QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 3000 gold (stage 200, ASHG_QF_ASHGSolstheimQuest_06000CF6.fragment_2).

## 15. Black Marsh Maps (`CYCOHQuest01`, BetalillesHammerfellQuestBundle.esp:00117E, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Jukka, placed in Cyrodilic Collections, Alik'r Desert, "Yes. I am ready.": SetStage 10 (when: the speaker is Jukka). Source: CYCO_TIF__070008A5.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:00118F (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:00117E DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find the second map in the Alik'r Desert", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:00117E QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Find the first map in Khenzedum". Source: BetalillesHammerfellQuestBundle.esp:00117E QOBJ 10. **files**
- Target alias Shadowfen (forced): Map of Shadowfen (forced reference, placed in Khenzedum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Khenzedum: 6 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: 750 gold (stage 200, CYCO_QF_CYCOHQuest01_07000893.fragment_6).

## 16. Cyrodilic Collections are Recruiting (`CYCOHQuest02`, BetalillesHammerfellQuestBundle.esp:00117F, BetalillesHammerfellQuestBundle.esp)

**Started by**

- CYCOHQuest01 (Black Marsh Maps) at stage 200 calls SetStage 10; its stage 200 is set by Dialogue with Jukka, placed in Cyrodilic Collections, Alik'r Desert: SetStage 200 (when: Black Marsh Maps stage == 30; the speaker is Jukka). Source: CYCO_QF_CYCOHQuest01_07000893.fragment_6 on BetalillesHammerfellQuestBundle.esp:00117E (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:00117F DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Place the second sign in Ben Erai", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:00117F QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Place the first sign in Ben Erai". Source: BetalillesHammerfellQuestBundle.esp:00117F QOBJ 10. **files**
- Target alias Activator01 (forced): Sign (forced reference, placed in Ben Erai). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Ben Erai: 7 doors, 6 locked. A door is a need only when every way in is locked. **files**

**Gives**: 500 gold (stage 200, CYCO_QF_CYCOHQuest02_07000894.fragment_1).

## 17. Ancient Pottery (`CYCOHQuest03`, BetalillesHammerfellQuestBundle.esp:001180, BetalillesHammerfellQuestBundle.esp)

**Started by**

- CYCOHQuest02 (Cyrodilic Collections are Recruiting) at stage 200 calls SetStage 10; its stage 200 is set by Dialogue with Jukka, placed in Cyrodilic Collections, Alik'r Desert: SetStage 200 (when: Cyrodilic Collections are Recruiting stage == 40; the speaker is Jukka). Source: CYCO_QF_CYCOHQuest02_07000894.fragment_1 on BetalillesHammerfellQuestBundle.esp:00117F (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:001180 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Go back to Jukka in the Cyrodilic Collections", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:001180 QOBJ 20. **files**
- CYCOHQuest03 (Ancient Pottery) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on BetalillesHammerfellQuestBundle.esp:001180 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Find the artifact Jukka was talking about in Sadraaka". Source: BetalillesHammerfellQuestBundle.esp:001180 QOBJ 10. **files**
- Target alias Container01 (forced): Chest (forced reference, placed in Tomb of the Forgotten Draugr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Tomb of the Forgotten Draugr: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: 950 gold (stage 200, CYCO_QF_CYCOHQuest03_07000895.fragment_5).

## 18. A Special Smell (`CYCOHQuest04`, BetalillesHammerfellQuestBundle.esp:001181, BetalillesHammerfellQuestBundle.esp)

**Started by**

- CYCOHQuest03 (Ancient Pottery) at stage 200 calls SetStage 10; its stage 200 is set by Dialogue with Jukka, placed in Cyrodilic Collections, Alik'r Desert: SetStage 200 (when: the speaker is Jukka). Source: CYCO_QF_CYCOHQuest03_07000895.fragment_5 on BetalillesHammerfellQuestBundle.esp:001180 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:001181 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Go back to Jukka in the Cyrodilic Collections", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:001181 QOBJ 20. **files**
- CYCOHQuest04 (A Special Smell) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on BetalillesHammerfellQuestBundle.esp:001181 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Find an artifact for the Cyrodilic Collections in Al Shedim". Source: BetalillesHammerfellQuestBundle.esp:001181 QOBJ 10. **files**
- Target alias Container02 (forced): Chest (forced reference, placed in Al Shedim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Al Shedim: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: 1000 gold (stage 200, CYCO_QF_CYCOHQuest04_07000896.fragment_4).

## 19. The Dark Brotherhood in Hammerfell (`DDBIntroQuest`, BetalillesHammerfellQuestBundle.esp:000ECA, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Unknown Initiate, placed in Skyrim, "Who are you?": SetStage 10 (when: Hail Sithis! completed; The Dark Brotherhood in Hammerfell stage < 10; the speaker is Unknown Initiate). Source: DDB_TIF__03000E71.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:000E71 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000ECA DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Tenerio", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000ECA QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Head to the Alik'r Desert Sanctuary". Source: BetalillesHammerfellQuestBundle.esp:000ECA QOBJ 10. **files**
- Target alias TheDoor (forced): Black Door (forced reference, placed in Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Alik'r Desert: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 20. Ending the Dark Brotherhood in Hammerfell again (`DDBPenitusOculatusQuest`, BetalillesHammerfellQuestBundle.esp:001076, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Leollus, placed in Penitus Oculatus Outpost, Ben Erai, "I will not miss an opportunity to destroy the Dark Brotherhood.": SetStage 10 (when: the speaker is Leollus). Source: DDB_TIF__040009CB.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:001085 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:001076 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Go back to the Penitus Oculatus Outpost in Hammerfell", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:001076 QOBJ 20. **files**
- DDBPenitusOculatusQuest (Ending the Dark Brotherhood in Hammerfell again) calls SetStage 20. Source: defaultaliasondeathscript.onDeath on BetalillesHammerfellQuestBundle.esp:001076 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Defeat the Dark Brotherhood leader in Hammerfell". Source: BetalillesHammerfellQuestBundle.esp:001076 QOBJ 10. **files**
- Target alias Tenerio01 (unique): Tenerio (unique actor, placed in Alik'r Desert Sanctuary, Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Alik'r Desert Sanctuary, Alik'r Desert: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: 1500 gold (stage 200, DDB_QF_DDBPenitusOculatusQues_040009BC.fragment_3); Crimson Eviscerator (stage 200, DDB_QF_DDBPenitusOculatusQues_040009BC.fragment_3).

## 21. Merchant Problem (`DDBQuest01`, BetalillesHammerfellQuestBundle.esp:000ECD, BetalillesHammerfellQuestBundle.esp)

**Started by**

- DDBIntroQuest (The Dark Brotherhood in Hammerfell) at stage 200 calls SetStage 10; its stage 200 is set by Dialogue with Tenerio, placed in Alik'r Desert Sanctuary, Alik'r Desert: SetStage 200 (when: the speaker is Tenerio). Source: DDB_QF_DDBIntroQuest_0300082D.fragment_3 on BetalillesHammerfellQuestBundle.esp:000ECA (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000ECD DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Go back to Tenerio", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000ECD QOBJ 20. **files**
- DDBQuest01 (Merchant Problem) calls SetStage 20. Source: defaultsetstageondeathrefalias.onDeath on BetalillesHammerfellQuestBundle.esp:000ECD (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Kill the merchant at the Ben Erai Outpost". Source: BetalillesHammerfellQuestBundle.esp:000ECD QOBJ 10. **files**
- Target alias Target01000 (created): Elona (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 500 gold (stage 200, DDB_QF_DDBQuest01_0300082E.fragment_3).

## 22. Argonian Hero (`DDBQuest02`, BetalillesHammerfellQuestBundle.esp:000ECE, BetalillesHammerfellQuestBundle.esp)

**Started by**

- DDBQuest01 (Merchant Problem) at stage 200 calls SetStage 10; its stage 200 is set by Dialogue with Tenerio, placed in Alik'r Desert Sanctuary, Alik'r Desert: SetStage 200 (when: Merchant Problem stage == 20; the speaker is Tenerio). Source: DDB_QF_DDBQuest01_0300082E.fragment_3 on BetalillesHammerfellQuestBundle.esp:000ECD (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000ECE DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Tenerio", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000ECE QOBJ 20. **files**
- DDBQuest02 (Argonian Hero) calls SetStage 20. Source: defaultsetstageondeathrefalias.onDeath on BetalillesHammerfellQuestBundle.esp:000ECE (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Kill the Argonian at the Lantern of the North". Source: BetalillesHammerfellQuestBundle.esp:000ECE QOBJ 10. **files**
- Target alias Target02000 (created): Faster-Than-Storm (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 600 gold (stage 200, DDB_QF_DDBQuest02_0300082F.fragment_2).

## 23. Wandering Monk (`DDBQuest03`, BetalillesHammerfellQuestBundle.esp:000ECF, BetalillesHammerfellQuestBundle.esp)

**Started by**

- DDBQuest02 (Argonian Hero) at stage 200 calls SetStage 10; its stage 200 is set by Dialogue with Tenerio, placed in Alik'r Desert Sanctuary, Alik'r Desert: SetStage 200 (when: Argonian Hero stage == 20; the speaker is Tenerio). Source: DDB_QF_DDBQuest02_0300082F.fragment_2 on BetalillesHammerfellQuestBundle.esp:000ECE (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000ECF DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Go back to Tenerio", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000ECF QOBJ 20. **files**
- DDBQuest03 (Wandering Monk) calls SetStage 20. Source: defaultsetstageondeathrefalias.onDeath on BetalillesHammerfellQuestBundle.esp:000ECF (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Kill the monk at the Lucky Lantern". Source: BetalillesHammerfellQuestBundle.esp:000ECF QOBJ 10. **files**
- Target alias Target03000 (created): Lavond (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 700 gold (stage 200, DDB_QF_DDBQuest03_03000830.fragment_2).

## 24. Alik'r No More (`DDBQuest04`, BetalillesHammerfellQuestBundle.esp:000ED0, BetalillesHammerfellQuestBundle.esp)

**Started by**

- DDBQuest03 (Wandering Monk) at stage 200 calls SetStage 10; its stage 200 is set by Dialogue with Tenerio, placed in Alik'r Desert Sanctuary, Alik'r Desert: SetStage 200 (when: Wandering Monk stage == 20; the speaker is Tenerio). Source: DDB_QF_DDBQuest03_03000830.fragment_2 on BetalillesHammerfellQuestBundle.esp:000ECF (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000ED0 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Tenerio", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000ED0 QOBJ 20. **files**
- DDBQuest04 (Alik'r No More) calls SetStage 20. Source: defaultsetstageondeathrefalias.onDeath on BetalillesHammerfellQuestBundle.esp:000ED0 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Defeat the Alik'r warrior in Ben Erai". Source: BetalillesHammerfellQuestBundle.esp:000ED0 QOBJ 10. **files**
- Target alias Target04000 (created): Orryn (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 850 gold (stage 200, DDB_QF_DDBQuest04_03000831.fragment_2).

## 25. No Guard Is Safe (`DDBQuest05`, BetalillesHammerfellQuestBundle.esp:000ED1, BetalillesHammerfellQuestBundle.esp)

**Started by**

- DDBQuest04 (Alik'r No More) at stage 200 calls SetStage 10; its stage 200 is set by Dialogue with Tenerio, placed in Alik'r Desert Sanctuary, Alik'r Desert: SetStage 200 (when: Alik'r No More stage == 20; the speaker is Tenerio). Source: DDB_QF_DDBQuest04_03000831.fragment_2 on BetalillesHammerfellQuestBundle.esp:000ED0 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000ED1 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Go back to Tenerio", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000ED1 QOBJ 20. **files**
- DDBQuest05 (No Guard Is Safe) calls SetStage 20. Source: defaultsetstageondeathrefalias.onDeath on BetalillesHammerfellQuestBundle.esp:000ED1 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Kill Laurentina inside the Fortress of Ben Erai". Source: BetalillesHammerfellQuestBundle.esp:000ED1 QOBJ 10. **files**
- Target alias Target05000 (forced): Laurentina (forced reference, placed in Fortress of Ben Erai). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Fortress of Ben Erai: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: 1000 gold (stage 200, DDB_QF_DDBQuest05_03000832.fragment_4).

## 26. Disappearing in the Dark (`DDBQuest06`, BetalillesHammerfellQuestBundle.esp:000FCA, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Tenerio, placed in Alik'r Desert Sanctuary, Alik'r Desert, "Alright, I'll look into it.": SetStage 20 (when: the speaker is Tenerio). Source: DDB_TIF__04000939.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:000FF4 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000FCA DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Investigate the village where Lucya was supposed to be", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000FCA QOBJ 20. **files**
- Dialogue with Tenerio, placed in Alik'r Desert Sanctuary, Alik'r Desert, "Alright, I'll look into it.": SetStage 20 (when: the speaker is Tenerio). Reply: "Great. She was investigating a small village in the desert. That's the last place she's been sent to." Source: DDB_TIF__04000939.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:000FF4 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Talk to Tenerio in the Dark Brotherhood Sanctuary in the Alik'r Desert". Source: BetalillesHammerfellQuestBundle.esp:000FCA QOBJ 10. **files**
- Target alias TenerioQ06 (unique): Tenerio (unique actor, placed in Alik'r Desert Sanctuary, Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Alik'r Desert Sanctuary, Alik'r Desert: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 27. The Crimson Eviscerator (`DDBQuest07`, BetalillesHammerfellQuestBundle.esp:000FCE, BetalillesHammerfellQuestBundle.esp)

**Started by**

- DDBQuest06 (Disappearing in the Dark) at stage 200 calls SetStage 10; its stage 200 is set by Dialogue with Tenerio, placed in Alik'r Desert Sanctuary, Alik'r Desert: SetStage 200 (when: the speaker is Tenerio). Source: DDB_QF_DDBQuest06_0400090F.fragment_14 on BetalillesHammerfellQuestBundle.esp:000FCA (BetalillesHammerfellQuestBundle.esp). **script**
- Dialogue with Lucya, placed in Soul Cairn Tower, Soul Cairn, "Yes, I will.": SetStage 20 (when: the speaker is Lucya). Source: DDB_TIF__0400094D.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:001008 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000FCE DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Enter the Soul Cavern in the Alik'r Desert", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000FCE QOBJ 20. **files**
- Dialogue with Lucya, placed in Soul Cairn Tower, Soul Cairn, "Yes, I will.": SetStage 20 (when: the speaker is Lucya). Reply: "Then go, Listener. The artifact is located in a cave in the Alik'r Desert. Use my soul gem to open the way to the artifact." Source: DDB_TIF__0400094D.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:001008 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Find the soul of Lucya in the Soul Cairn". Source: BetalillesHammerfellQuestBundle.esp:000FCE QOBJ 10. **files**
- Target alias LucyaQ07 (unique): Lucya (unique actor, placed in Soul Cairn Tower, Soul Cairn). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Soul Cairn Tower, Soul Cairn: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 28. Crimson Scar Believers (`DDBQuest08`, BetalillesHammerfellQuestBundle.esp:000FCF, BetalillesHammerfellQuestBundle.esp)

**Started by**

- DDBQuest07 (The Crimson Eviscerator) at stage 200 calls SetStage 10; its stage 200 is set by Dialogue with Tenerio, placed in Alik'r Desert Sanctuary, Alik'r Desert: SetStage 200 (when: The Crimson Eviscerator stage == 60; the speaker is Tenerio). Source: DDB_QF_DDBQuest07_04000913.fragment_6 on BetalillesHammerfellQuestBundle.esp:000FCE (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000FCF DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Defeat the hostile vampires", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000FCF QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Head to the Vampire Hideout". Source: BetalillesHammerfellQuestBundle.esp:000FCF QOBJ 10. **files**
- Target alias Door02 (forced): a marker (forced reference, placed in Vampire Hideout, Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Vampire Hideout, Alik'r Desert: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: 1000 gold (stage 200, DDB_QF_DDBQuest08_04000914.fragment_3).

## 29. Protecting What Was Lost (`HABLBladesQuest01`, BetalillesHammerfellQuestBundle.esp:000B6B, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Azita, placed in Alik'r Desert, "How do you know all of this?": SetStage 10 (when: the speaker is Azita). Source: HABL_TIF__06000B7C.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:000B7C (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000B6B DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill the Fire Dragon", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000B6B QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Interact with the pillar to begin the trials". Source: BetalillesHammerfellQuestBundle.esp:000B6B QOBJ 10. **files**
- Target alias Activator01 (forced): Lantern of the Trials (forced reference, placed in Azzin's Hideout, Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Azzin's Hideout, Alik'r Desert: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Boneshaver Replica (stage 200, HABL_QF_HABLBladesQuest01_06000B6B.fragment_14).

## 30. In need of Scouts (`HABLBladesQuest02`, BetalillesHammerfellQuestBundle.esp:000C5C, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Loremaster Za'kir, placed in Common House, Alik'r Desert, "Alright. I will come back to you once I have the two new recruits.": SetStage 10 (when: the speaker is Loremaster Za'kir). Source: HABL_TIF__06000C71.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:000C71 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000C5C DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find a second follower to ask them to join the Blades in Hammerfell", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000C5C QOBJ 20. **files**
- Dialogue with someone the line does not name, "I want you to join the Blades. Do you agree to join the Wind Scour Temple?": SetStage 20 (when: GetInFaction PetFramework_PetFollowingFaction == 0; GetInFaction PetFramework_PetFaction == 0; GetInFaction CompanionsCirclePlusKodlak == 0; GetInFaction The Dark Brotherhood == 0; GetInFaction Blades == 0; GetInFaction PotentialFollowerFaction == 1; In need of Scouts stage == 10). Reply: "I do." Source: HABL_TIF__06000C74.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:000C74 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Find a follower and ask them to join the Blades in Hammerfell". Source: BetalillesHammerfellQuestBundle.esp:000C5C QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 31. Sands of the Past (`HABLBladesQuest03`, BetalillesHammerfellQuestBundle.esp:000C5D, BetalillesHammerfellQuestBundle.esp)

**Started by**

- HABLBladesQuest02 (In need of Scouts) at stage 200 calls SetStage 10; its stage 200 is set by Dialogue with Loremaster Za'kir, placed in Common House, Alik'r Desert: SetStage 200 (when: In need of Scouts stage == 30; the speaker is Loremaster Za'kir). Source: HABL_QF_HABLBladesQuest02_06000C5C.fragment_3 on BetalillesHammerfellQuestBundle.esp:000C5C (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000C5D DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Head to the second location given by Za'kir and defeat the ghost haunting the place", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000C5D QOBJ 20. **files**
- HABLBladesQuest03 (Sands of the Past) calls SetStage 20. Source: defaultaliasondeathscript.onDeath on BetalillesHammerfellQuestBundle.esp:000C5D (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Head to the first location given by Za'kir and defeat the ghost haunting the place". Source: BetalillesHammerfellQuestBundle.esp:000C5D QOBJ 10. **files**
- Target alias Blade01 (forced): Blade (forced reference, placed in Akaviri Ruins, Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Akaviri Ruins, Alik'r Desert: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: 1000 gold (stage 200, HABL_QF_HABLBladesQuest03_06000C5D.fragment_10).

## 32. A Lost Temple in Hammerfell (`HABLQuest01`, BetalillesHammerfellQuestBundle.esp:000A8E, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Duraelm, placed in Alik'r Desert, "I can do it for you if you want.": SetStage 10 (when: the speaker is Duraelm). Source: HABL_TIF__03000A7B.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:000A7B (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000A8E DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "You didn't find anything there, search the second location", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000A8E QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Search the first location". Source: BetalillesHammerfellQuestBundle.esp:000A8E QOBJ 10. **files**
- Target alias Zone01 (forced): a marker (forced reference, placed in Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 1000 gold (stage 200, HABL_QF_HABLQuest01_03000A8E.fragment_15).

## 33. Dragonguard Archives (`HABLQuest02`, BetalillesHammerfellQuestBundle.esp:000A8F, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Duraelm, placed in Alik'r Desert, "Can I do anything to help you?": SetStage 10 (when: Dragonguard Archives stage < 10; A Lost Temple in Hammerfell completed; the speaker is Duraelm). Source: HABL_TIF__03000A8B.Fragment_0 on INFO BetalillesHammerfellQuestBundle.esp:000A8B (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000A8F DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Go back to Duarelm", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000A8F QOBJ 20. **files**
- HABLQuest02 (Dragonguard Archives) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on BetalillesHammerfellQuestBundle.esp:000A8F (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Find the Dragonguard book in <Alias=Location> and bring it back to Duarelm". Source: BetalillesHammerfellQuestBundle.esp:000A8F QOBJ 10. **files**
- Target alias Container (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 500 gold (stage 200, HABL_QF_HABLQuest02_03000A8F.fragment_4).

## 34. Dragonguard Archives: Book 1 (`HABLRaQuest01`, BetalillesHammerfellQuestBundle.esp:000AB8, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Read Duarelm's Note: Dragonguard Style (SetStage 10). Source: DefaultOnReadSetQuestStageNotAlias.onRead on BOOK BetalillesHammerfellQuestBundle.esp:000AAD. **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000AB8 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Put the Dragonguard book in the chest in the Wind Scour Temple", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000AB8 QOBJ 20. **files**
- HABLRaQuest01 (Dragonguard Archives: Book 1) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on BetalillesHammerfellQuestBundle.esp:000AB8 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Get the Dragonguard book from Vulstad". Source: BetalillesHammerfellQuestBundle.esp:000AB8 QOBJ 10. **files**
- Target alias Book (forced): Crafting Motif 76: Dragonguard Style (forced reference, placed in Terinen's House, Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Terinen's House, Alik'r Desert: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: 300 gold (stage 200, HABL_QF_HABLRaQuest01_03000AB8.fragment_3).

## 35. Dragonguard Archives: Book 2 (`HABLRaQuest02`, BetalillesHammerfellQuestBundle.esp:000AB9, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Read Duarelm's Note: The Warp in the West, Part 1 (SetStage 10). Source: DefaultOnReadSetQuestStageNotAlias.onRead on BOOK BetalillesHammerfellQuestBundle.esp:000A70. **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000AB9 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Put the Blades book in the chest in the Wind Scour Temple", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000AB9 QOBJ 20. **files**
- HABLRaQuest02 (Dragonguard Archives: Book 2) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on BetalillesHammerfellQuestBundle.esp:000AB9 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Get the Blades book from the Ben Erai Barracks". Source: BetalillesHammerfellQuestBundle.esp:000AB9 QOBJ 10. **files**
- Target alias Book (created): The Warp in the West, Part 1 (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 300 gold (stage 200, HABL_QF_HABLRaQuest02_03000AB9.fragment_3).

## 36. Dragonguard Archives: Book 3 (`HABLRaQuest03`, BetalillesHammerfellQuestBundle.esp:000AB7, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Read Duarelm's Note: The Warp in the West, Part 2 (SetStage 10). Source: DefaultOnReadSetQuestStageNotAlias.onRead on BOOK BetalillesHammerfellQuestBundle.esp:000A72. **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000AB7 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Put the Blades book in the chest in the Wind Scour Temple", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000AB7 QOBJ 20. **files**
- HABLRaQuest03 (Dragonguard Archives: Book 3) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on BetalillesHammerfellQuestBundle.esp:000AB7 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Get the Blades book from Ben Erai". Source: BetalillesHammerfellQuestBundle.esp:000AB7 QOBJ 10. **files**
- Target alias Book (created): The Warp in the West, Part 2 (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 300 gold (stage 200, HABL_QF_HABLRaQuest03_03000AB7.fragment_4).

## 37. Dragonguard Archives: Book 4 (`HABLRaQuest04`, BetalillesHammerfellQuestBundle.esp:000ABB, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Read Duarelm's Note: Horn of Ja'darri, Part 1 (SetStage 10). Source: DefaultOnReadSetQuestStageNotAlias.onRead on BOOK BetalillesHammerfellQuestBundle.esp:000AAE. **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000ABB DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Put the Dragonguard book in the chest in the Wind Scour Temple", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000ABB QOBJ 20. **files**
- HABLRaQuest04 (Dragonguard Archives: Book 4) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on BetalillesHammerfellQuestBundle.esp:000ABB (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Get the Dragonguard book from the Fortress of Ben Erai". Source: BetalillesHammerfellQuestBundle.esp:000ABB QOBJ 10. **files**
- Target alias BookJadarri1 (created): Searching for the Horn of Ja'darri, Part 1 (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 300 gold (stage 200, HABL_QF_HABLRaQuest04_03000ABB.fragment_3).

## 38. Dragonguard Archives: Book 5 (`HABLRaQuest05`, BetalillesHammerfellQuestBundle.esp:000ABA, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Read Duarelm's Note: Horn of Ja'darri, Part 2 (SetStage 10). Source: DefaultOnReadSetQuestStageNotAlias.onRead on BOOK BetalillesHammerfellQuestBundle.esp:000AAF. **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000ABA DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Put the Dragonguard book in the chest in the Wind Scour Temple", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000ABA QOBJ 20. **files**
- HABLRaQuest05 (Dragonguard Archives: Book 5) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on BetalillesHammerfellQuestBundle.esp:000ABA (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Get Dragonguard book from Arenar's Camp". Source: BetalillesHammerfellQuestBundle.esp:000ABA QOBJ 10. **files**
- Target alias Book (forced): Searching for the Horn of Ja'darri, Part 2 (forced reference, placed in Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 300 gold (stage 200, HABL_QF_HABLRaQuest05_03000ABA.fragment_3).

## 39. Dragonguard Archives: Book 6 (`HABLRaQuest06`, BetalillesHammerfellQuestBundle.esp:000ABC, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Read Duarelm's Note: Horn of Ja'darri, Part 3 (SetStage 10). Source: DefaultOnReadSetQuestStageNotAlias.onRead on BOOK BetalillesHammerfellQuestBundle.esp:000A6E. **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:000ABC DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Put the Dragonguard book in the chest in the Wind Scour Temple", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:000ABC QOBJ 20. **files**
- HABLRaQuest06 (Dragonguard Archives: Book 6) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on BetalillesHammerfellQuestBundle.esp:000ABC (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Get the Dragonguard book from Khenzedum". Source: BetalillesHammerfellQuestBundle.esp:000ABC QOBJ 10. **files**
- Target alias Book (created): Searching for the Horn of Ja'darri, Part 3 (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 300 gold (stage 200, HABL_QF_HABLRaQuest06_03000ABC.fragment_3).

## 40. Spectral Lamias in the Desert (`LAMIDesertLamiaQuest`, BetalillesHammerfellQuestBundle.esp:001252, BetalillesHammerfellQuestBundle.esp)

**Started by**

- Dialogue with Oziriana, placed in Alik'r Desert, "I want to help you out.": SetStage 10 (when: the speaker is Oziriana). Source: HNHT_TIF__06000885.Fragment_1 on INFO BetalillesHammerfellQuestBundle.esp:001275 (BetalillesHammerfellQuestBundle.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: BetalillesHammerfellQuestBundle.esp:001252 DNAM (BetalillesHammerfellQuestBundle.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Oziriana", shown at stage 20. Source: BetalillesHammerfellQuestBundle.esp:001252 QOBJ 20. **files**
- LAMIDesertLamiaQuest (Spectral Lamias in the Desert) calls SetStage 20. Source: defaultaliasondeathscript.onDeath on BetalillesHammerfellQuestBundle.esp:001252 (BetalillesHammerfellQuestBundle.esp). **script**

**Who and where**

- First objective: "Defeat Feiria the Matriarch". Source: BetalillesHammerfellQuestBundle.esp:001252 QOBJ 10. **files**
- Target alias Feiria (forced): Feiria the Matriarch (forced reference, placed in Alik'r Desert). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 500 gold (stage 200, LAMI_QF_LAMIDesertLamiaQuest_06000862.fragment_6).

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Left for Dead | The Rift | APS_LeftForDeadRiften | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Forsworn | Forsworn | APS_Forsworn | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Guilds | College of Winterhold | APS_GuildMages | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Guilds | Thieves Guild | APS_GuildThievesguild | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Guilds | Companions | APS_GuildCompanions | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | yes: it is start-game enabled | MQ101 SetStage 6; MQ101 SetStage 7 | it runs from the start |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | yes: it is start-game enabled | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | it runs from the start |
| Addict | Addict | AFLOLALAddictQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Beggar | Riften | AFLOAP_BeggarRiften | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Jailed | Whiterun | AFLOAP_JailWhiterun | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Jailed | The Rift | AFLOAP_JailRift | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Jailed | The Reach | AFLOAP_JailReach | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Jailed | Falkreath | AFLOAP_JailFalkreath | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Jailed | The Pale | AFLOAP_JailPale | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Jailed | Winterhold | AFLOAP_JailWinterhold | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Vampire | Solitude | AFLOAP_VampireSolitude | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Vampire | Riften | AFLOAP_VampireRiften | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Vampire | Markarth | AFLOAP_VampireMarkarth | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | yes: it is start-game enabled | nothing in the main quest | it runs from the start |

## Routes into the first quest from outside the starts

### None

- What it does: stage None: SetStage 10. Source: manny_GF_OnReadOnce on None (?). **script**
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
