# Start check: Dawnguard (`dawnguard`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Dawnguard (`DLC1VQ01MiscObjective`, Dawnguard.esm:00D06C, Requiem.esp)

**Started by**

- DLC1VQ00ChangeLocation, a helper quest with Messenger at stage 0 calls SetStage 5; DLC1VQ00ChangeLocation is started by story manager node DLC1VQ00Node (event: change location; Laid to Rest completed; level >= DLC1VQMinLevel (now 30); Dawnguard stage < 10; Dragonborn stage >= 5 or The Way of the Voice stage < 160; fn576 == 1; fn576 == 0; fn576 == 0; fn576 == 0; fn359 == 0; fn359 == 0). Source: DLC1_QF_DLC1VQ00ChangeLocatio_0100D90B.fragment_1 on Dawnguard.esm:00D90B (TheChoiceIsYours.esp). **script**
- DLC1VQ00, a helper quest at stage 50 calls SetStage 10; DLC1VQ00 is started by DLC1VQ00ChangeLocation, a helper quest with Messenger at stage 0 (Start); the start-game flag. Source: DLC1_QF_DLC1VQ00_0100D90E.fragment_7 on Dawnguard.esm:00D90E (Dawnguard.esm). **script**
- Dialogue with Agmaer (named by scene DLC1VQ01AgmaerScene, alias Agmaer of DLC1VQ01MiscObjective (Dawnguard) (unique)), placed in Fort Dawnguard: SetStage 10; its scene is started by DLC1VQ01MiscObjective (Dawnguard) at stage 50. Source: DLC1_TIF__0100D8D8.Fragment_0 on INFO Dawnguard.esm:00D8D8 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC1VQ01 (Awakening) at stage 0 calls SetStage 10. Source: QF_DLC01VQ01_0100352A.fragment_7 (Dawnguard.esm).

**Who and where**

- First objective: "Speak with the leader of the Dawnguard, located within Fort Dawnguard, which is southeast of Riften and inside of Dayspring Canyon.". Source: Dawnguard.esm:00D06C QOBJ 10. **files**
- Target alias Isran (unique): Isran (unique actor, placed in Fort Dawnguard). **files**
- Target alias FortDawnguardWorldspaceDoor (forced): Passage (forced reference, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Fort Dawnguard: 9 doors, 0 locked; Skyrim: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. A New Order (`DLC1HunterBaseIntro`, Dawnguard.esm:004E24, Requiem.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC1VQ02 (Bloodline) at stage 190 calls SetStage 20. Source: DLC1_QF_DLC1VQ01COPY0000_01002F65.fragment_13 (Dawnguard.esm).
- DLC1VQ02 (Bloodline) at stage 30 calls SetStage 20. Source: DLC1_QF_DLC1VQ01COPY0000_01002F65.fragment_9 (Dawnguard.esm).
- DLC1VQ03Hunter (Prophet) at stage 0 calls SetStage 200. Source: DLC1_QF_DLC1VQ03Hunter_010098CB.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak with Isran", shown at stage 20. Source: Dawnguard.esm:004E24 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Meet Tolan at Stendarr's Beacon". Source: Dawnguard.esm:004E24 QOBJ 10. **files**
- Target alias IsranAlias (unique): Isran (unique actor, placed in Fort Dawnguard). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Fort Dawnguard: 9 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. Bolstering the Ranks (`DLC1HunterBaseStage2`, Dawnguard.esm:013F1F, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Sorine Jurard (named by alias SorineAlias of DLC1HunterBaseStage2 (Bolstering the Ranks) (unique)), placed in Fort Dawnguard, "Where can I find him?": SetStage 10 (when: the speaker is the one in alias SorineAlias). Source: DLC1_TIF__01014362.Fragment_0 on INFO Dawnguard.esm:014362 (Dawnguard.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC1VQ03Hunter (Prophet) at stage 60 calls Start. Source: DLC1_QF_DLC1VQ03Hunter_010098CB.fragment_13 (Unofficial Skyrim Special Edition Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find Florentius", shown at stage 20. Source: Dawnguard.esm:013F1F QOBJ 20. **files**
- Dialogue with Isran (named by alias IsranAlias of DLC1HunterBaseStage2 (Bolstering the Ranks) (unique)), placed in Fort Dawnguard, "Sorine thought we'd need his help.": SetStage 20 (when: the speaker is the one in alias IsranAlias). Reply: "I suppose she's right. I shouldn't let my personal feelings get in the way." Source: DLC1_TIF__02011A92.Fragment_0 on INFO Dawnguard.esm:011A92 (Dawnguard.esm). **script**
- Dialogue with Vigilant Tolan (named by alias TolanAlias of DLC1HunterBaseStage2 (Bolstering the Ranks) (unique)), placed in Fort Dawnguard, "Do you know where I can find him?": SetStage 20 (when: the speaker is the one in alias TolanAlias). Reply: "Florentius still worked with the Order from time to time." Source: DLC1_TIF__010163A0.Fragment_0 on INFO Dawnguard.esm:0163A0 (Dawnguard.esm). **script**

**Who and where**

- First objective: "Speak with Isran". Source: Dawnguard.esm:013F1F QOBJ 10. **files**
- Target alias IsranAlias (unique): Isran (unique actor, placed in Fort Dawnguard). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Fort Dawnguard: 9 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 4. Hide and Seek (`DLC1RH01`, Dawnguard.esm:005E4A, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Gunmar (named by alias QuestGiver of DLC1RH01 (Hide and Seek) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; the speaker is the one in alias QuestGiver; Hide and Seek stage < 10). Source: DLC1_TIF__01005E41.Fragment_0 on INFO Dawnguard.esm:005E41 (Dawnguard.esm). **script**
- Story manager node DLC1RadiantHunterQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantHunterQuestNode Dawnguard.esm:005E52 (Dawnguard.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=QuestGiver>", shown at stage 100. Source: Dawnguard.esm:005E4A QOBJ 100. **files**
- DLC1RH01 (Hide and Seek) calls SetStage 100. Source: DLC1RH01TargetScript.OnDeath on Dawnguard.esm:005E4A (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Discreetly kill the <Alias=Target>". Source: Dawnguard.esm:005E4A QOBJ 10. **files**
- Target alias Target (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 5. Cleansing Light (`DLC1RH02`, Dawnguard.esm:005E53, Dawnguard.esm)

**Started by**

- Dialogue with Gunmar (named by alias QuestGiver of DLC1RH02 (Cleansing Light) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; Cleansing Light stage < 10; the speaker is the one in alias QuestGiver). Source: DLC1_TIF__01005E48.Fragment_0 on INFO Dawnguard.esm:005E48 (Dawnguard.esm). **script**
- Story manager node DLC1RadiantHunterQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantHunterQuestNode Dawnguard.esm:005E52 (Dawnguard.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=QuestGiver>", shown at stage 100. Source: Dawnguard.esm:005E53 QOBJ 100. **files**
- DLC1RH02 (Cleansing Light) calls SetStage 100. Source: DLC1RH02BossScript.OnDeath on Dawnguard.esm:005E53 (Dawnguard.esm). **script**

**Who and where**

- First objective: "Kill the <Alias=Boss> at <Alias=Dungeon>". Source: Dawnguard.esm:005E53 QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 6. Preemptive Strike (`DLC1RH03`, Dawnguard.esm:005E58, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Gunmar (named by alias Questgiver of DLC1RH03 (Preemptive Strike) (run time)), placed in Fort Dawnguard, "...": SetStage 10 (when: the speaker is the one in alias Questgiver). Source: DLC1_TIF__01005E43.Fragment_0 on INFO Dawnguard.esm:005E43 (Dawnguard.esm). **script**
- Story manager node DLC1RadiantHunterQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantHunterQuestNode Dawnguard.esm:005E52 (Dawnguard.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=QuestGiver>", shown at stage 100. Source: Dawnguard.esm:005E58 QOBJ 100. **files**
- DLC1RH03 (Preemptive Strike) calls SetStage 100. Source: DLC1RH03VampireScript.OnDeath on Dawnguard.esm:005E58 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Kill the <Alias=Vampire> at <Alias=Dungeon>". Source: Dawnguard.esm:005E58 QOBJ 10. **files**
- Target alias Vampire (created): Skyrim.esm:02F9E2 (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 7. Hunting the Monster (`DLC1RH04`, Dawnguard.esm:006952, Dawnguard.esm)

**Started by**

- Dialogue with Gunmar (named by alias Questgiver of DLC1RH04 (Hunting the Monster) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; Hunting the Monster stage < 10; the speaker is the one in alias Questgiver). Source: DLC1_TIF__01006950.Fragment_0 on INFO Dawnguard.esm:006950 (Dawnguard.esm). **script**
- Story manager node DLC1RadiantHunterQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantHunterQuestNode Dawnguard.esm:005E52 (Dawnguard.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill the <Alias=Vampire> at <Alias=Dungeon>", shown at stage 50. Source: Dawnguard.esm:006952 QOBJ 50. **files**
- DLC1RH04 (Hunting the Monster) calls SetStage 50. Source: DLC1RH04LetterScript.OnContainerChanged on Dawnguard.esm:006952 (Dawnguard.esm). **script**
- Dialogue with someone the line does not name (named by alias Friend of DLC1RH04 (Hunting the Monster) (run time)), "If I find them myself, you'll meet the same fate as theirs. (Intimidate)": SetStage 50 (when: the speaker is the one in alias Friend; fn655 == 1; GetActorValue <= GameDaysPassed (now 1)). Reply: "All right, calm down... Here, take this." Source: DLC1_TIF__01006948.Fragment_1 on INFO Dawnguard.esm:006948 (Immersive Speech Dialogues.esp). **script**
- Dialogue with someone the line does not name (named by alias Friend of DLC1RH04 (Hunting the Monster) (run time)), "Perhaps some coin will jog your memory? (<BribeCost> gold)": SetStage 50 (when: the speaker is the one in alias Friend; fn654 == 1). Reply: "Well... we weren't the closest of friends... Here, take this." Source: DLC1_TIF__01006946.Fragment_1 on INFO Dawnguard.esm:006946 (Dawnguard.esm). **script**
- Dialogue with someone the line does not name (named by alias Friend of DLC1RH04 (Hunting the Monster) (run time)), "Make this easier for you, tell me what I want to know. (Persuade)": SetStage 50 (when: the speaker is the one in alias Friend; GetActorValue >= SpeechAverage (now 50) or fn182 == 1). Reply: "All right... Here, take this." Source: DLC1_TIF__0100694B.Fragment_1 on INFO Dawnguard.esm:00694B (Dawnguard.esm). **script**

**Who and where**

- First objective: "Find evidence of the vampire's whereabouts". Source: Dawnguard.esm:006952 QOBJ 10. **files**
- Target alias Friend (run time): nothing the records or scripts name. **files**
- Target alias Letter (created): Letter from a Vampire (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 8. Ancient Technology (`DLC1RH05`, Dawnguard.esm:006BAC, Dawnguard.esm)

**Started by**

- Dialogue with Sorine Jurard (named by alias QuestGiver of DLC1RH05 (Ancient Technology) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; Ancient Technology stage < 10; the speaker is the one in alias QuestGiver; global DLC1RH05RunCount == 0 (now 0)). Source: DLC1_TIF__01002F1B.Fragment_0 on INFO Dawnguard.esm:002F1B (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Sorine Jurard (named by alias QuestGiver of DLC1RH05 (Ancient Technology) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; Ancient Technology stage < 10; the speaker is the one in alias QuestGiver; global DLC1RH05RunCount == 1 (now 0)). Source: DLC1_TIF__01006BAB.Fragment_0 on INFO Dawnguard.esm:006BAB (Dawnguard.esm). **script**
- Dialogue with Sorine Jurard (named by alias QuestGiver of DLC1RH05 (Ancient Technology) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; Ancient Technology stage < 10; the speaker is the one in alias QuestGiver; global DLC1RH05RunCount == 2 (now 0)). Source: DLC1_TIF__01002F1C.Fragment_0 on INFO Dawnguard.esm:002F1C (Dawnguard.esm). **script**
- Dialogue with Sorine Jurard (named by alias QuestGiver of DLC1RH05 (Ancient Technology) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; Ancient Technology stage < 10; the speaker is the one in alias QuestGiver; global DLC1RH05RunCount == 3 (now 0)). Source: DLC1_TIF__01002F1D.Fragment_0 on INFO Dawnguard.esm:002F1D (Dawnguard.esm). **script**
- Dialogue with Sorine Jurard (named by alias QuestGiver of DLC1RH05 (Ancient Technology) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; Ancient Technology stage < 10; the speaker is the one in alias QuestGiver; global DLC1RH05RunCount == 4 (now 0)). Source: DLC1_TIF__01002F1E.Fragment_0 on INFO Dawnguard.esm:002F1E (Dawnguard.esm). **script**
- Dialogue with Sorine Jurard (named by alias QuestGiver of DLC1RH05 (Ancient Technology) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; Ancient Technology stage < 10; the speaker is the one in alias QuestGiver; global DLC1RH05RunCount == 5 (now 0)). Source: DLC1_TIF__01002F1F.Fragment_0 on INFO Dawnguard.esm:002F1F (Dawnguard.esm). **script**
- Dialogue with Sorine Jurard (named by alias QuestGiver of DLC1RH05 (Ancient Technology) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; Ancient Technology stage < 10; the speaker is the one in alias QuestGiver). Source: DLC1_TIF__01002F20.Fragment_0 on INFO Dawnguard.esm:002F20 (Dawnguard.esm). **script**
- Story manager node DLC1RH05QuestNode, event: script event; conditions up its parents: fn576 == 1; global DLC1RH05FinishedAllQuests == 0 (now 0); fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RH05QuestNode Dawnguard.esm:002F21 (Unofficial Skyrim Special Edition Patch.esp). **run time**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=QuestGiver>", shown at stage 100. Source: Dawnguard.esm:006BAC QOBJ 100. **files**
- DLC1RH05 (Ancient Technology) calls SetStage 100. Source: DLC1RH05ItemScript.OnContainerChanged on Dawnguard.esm:006BAC (Dawnguard.esm). **script**

**Who and where**

- First objective: "Retrieve the <Alias=Item> from <Alias=Dungeon>". Source: Dawnguard.esm:006BAC QOBJ 10. **files**
- Target alias Item (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Global DLC1RH05FinishedAllQuests: record 0.0 (Dawnguard.esm); at run time script DLC1_QF_DLC1RH05_01006BAC:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 9. Rescue (`DLC1RH06`, Dawnguard.esm:007201, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Florentius Baenius (named by alias QuestGiver of DLC1RH06 (Rescue) (run time)), placed in Fort Dawnguard, "...": SetStage 10 (when: the speaker is the one in alias QuestGiver; fn70 == 1). Source: DLC1_TIF__01007C30.Fragment_0 on INFO Dawnguard.esm:007C30 (Dawnguard.esm). **script**
- Dialogue with Florentius Baenius (named by alias QuestGiver of DLC1RH06 (Rescue) (run time)), placed in Fort Dawnguard, "...": SetStage 10 (when: the speaker is the one in alias QuestGiver; fn70 == 1). Source: DLC1_TIF__01007C31.Fragment_0 on INFO Dawnguard.esm:007C31 (Dawnguard.esm). **script**
- Story manager node DLC1RadiantHunterQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantHunterQuestNode Dawnguard.esm:005E52 (Dawnguard.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill the <Alias=Vampire>", shown at stage 10. Source: Dawnguard.esm:007201 QOBJ 11. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Rescue <Alias=Prisoner> from <Alias=Dungeon>". Source: Dawnguard.esm:007201 QOBJ 10. **files**
- Target alias Prisoner (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 10. A Jarl's Justice (`DLC1RH07`, Dawnguard.esm:007EC5, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Isran (named by alias QuestGiver of DLC1RH07 (A Jarl's Justice) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; the speaker is the one in alias QuestGiver; A Jarl's Justice stage < 10). Source: DLC1_TIF__01007EC2.Fragment_0 on INFO Dawnguard.esm:007EC2 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Story manager node DLC1RadiantHunterQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantHunterQuestNode Dawnguard.esm:005E52 (Dawnguard.esm). **run time**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find evidence linked to the vampire", shown at stage 20. Source: Dawnguard.esm:007EC5 QOBJ 20. **files**
- Dialogue with someone the line does not name (named by alias Jarl of DLC1RH07 (A Jarl's Justice) (run time)), "You are in danger. A vampire has infiltrated your court.": SetStage 20 (when: A Jarl's Justice stage >= 10; A Jarl's Justice stage < 30; the speaker is the one in alias Jarl). Reply: "That's quite a bold claim. I'd need proof before I could possibly accept it." Source: DLC1_TIF__01007EC3.Fragment_0 on INFO Dawnguard.esm:007EC3 (Dawnguard.esm). **script**

**Who and where**

- First objective: "Warn <Alias=Jarl> about the vampire threat". Source: Dawnguard.esm:007EC5 QOBJ 10. **files**
- Target alias Jarl (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: global DLC1RH07NextAllowed <= GameDaysPassed (now 1) (now 0). **files**
- Global DLC1RH07NextAllowed: record 0.0 (Dawnguard.esm); at run time script DLC1_QF_DLC1RH07_01007EC5:  = 12. **run time**
- Global GameDaysPassed: record 1.0 (Wintersun - Reqtificated.esp). **files**

**Gives**: nothing on its completing stages.

## 11. Lost Relic (`DLC1RH08`, Dawnguard.esm:015017, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Florentius Baenius (named by alias QuestGiver of DLC1RH08 (Lost Relic) (run time)), placed in Fort Dawnguard, "What can I do to help?": SetStage 10 (when: fn67 == 1; Lost Relic stage < 10; the speaker is the one in alias QuestGiver). Source: DLC1_TIF__0101500F.Fragment_0 on INFO Dawnguard.esm:01500F (Unofficial Skyrim Special Edition Patch.esp). **script**
- Story manager node DLC1RadiantHunterQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantHunterQuestNode Dawnguard.esm:005E52 (Dawnguard.esm). **run time**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=QuestGiver>", shown at stage 100. Source: Dawnguard.esm:015017 QOBJ 100. **files**
- **unread**: nothing outside its own stage fragments sets stage 100 or one before it.

**Who and where**

- First objective: "Retrieve the <Alias=Item> from <Alias=Dungeon>". Source: Dawnguard.esm:015017 QOBJ 10. **files**
- Target alias Item (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: global DLC1RH08RunCount < 3 (now 0). **files**
- Global DLC1RH08RunCount: record 0.0 (Dawnguard.esm); at run time script DLC1_QF_DLC1RH08_01015017:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 12. The Hunt (`DLC1RV01`, Dawnguard.esm:004C1B, Dawnguard.esm)

**Started by**

- Dialogue with Fura Bloodmouth, placed in Volkihar Keep, "What can I do to help?": SetStage 10 (when: the speaker is the one in alias QuestGiver; The Hunt stage < 10; the speaker is Fura Bloodmouth). Source: DLC1_TIF__01004C1A.Fragment_0 on INFO Dawnguard.esm:004C1A (Dawnguard.esm). **script**
- Dialogue with Garan Marethi, placed in Volkihar Keep, "What can I do to help?": SetStage 10 (when: the speaker is the one in alias QuestGiver; The Hunt stage < 10; the speaker is Garan Marethi). Source: DLC1_TIF__01015E0C.Fragment_0 on INFO Dawnguard.esm:015E0C (Dawnguard.esm). **script**
- Story manager node DLC1RadiantVampireQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantVampireQuestNode Dawnguard.esm:004C22 (Dawnguard.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "(Optional) Make it a discreet kill", shown at stage 10. Source: Dawnguard.esm:004C1B QOBJ 11. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Kill <Alias=Target>". Source: Dawnguard.esm:004C1B QOBJ 10. **files**
- Target alias Target (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 13. Culling the Beast (`DLC1RV02`, Dawnguard.esm:0050B9, Dawnguard.esm)

**Started by**

- Dialogue with Fura Bloodmouth, placed in Volkihar Keep, "What can I do to help?": SetStage 10 (when: the speaker is the one in alias QuestGiver; Culling the Beast stage < 10; the speaker is Fura Bloodmouth). Source: DLC1_TIF__010050B5.Fragment_0 on INFO Dawnguard.esm:0050B5 (Dawnguard.esm). **script**
- Dialogue with Garan Marethi, placed in Volkihar Keep, "What can I do to help?": SetStage 10 (when: the speaker is the one in alias QuestGiver; Culling the Beast stage < 10; the speaker is Garan Marethi). Source: DLC1_TIF__01015E11.Fragment_0 on INFO Dawnguard.esm:015E11 (Dawnguard.esm). **script**
- Story manager node DLC1RadiantVampireQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantVampireQuestNode Dawnguard.esm:004C22 (Dawnguard.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=QuestGiver>", shown at stage 100. Source: Dawnguard.esm:0050B9 QOBJ 100. **files**
- DLC1RV02 (Culling the Beast) calls SetStage 100. Source: DLC1RV02BossScript.OnDeath on Dawnguard.esm:0050B9 (Dawnguard.esm). **script**

**Who and where**

- First objective: "Kill the <Alias=Boss> at <Alias=Dungeon>". Source: Dawnguard.esm:0050B9 QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 14. Deceiving the Herd (`DLC1RV03`, Dawnguard.esm:0050BD, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Feran Sadri (named by alias QuestGiver of DLC1RV03 (Deceiving the Herd) (run time)), placed in Volkihar Keep, "I heard you might need help.": SetStage 10 (when: Deceiving the Herd stage < 10; the speaker is the one in alias QuestGiver). Source: DLC1_TIF__010050B3.Fragment_0 on INFO Dawnguard.esm:0050B3 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Story manager node DLC1RadiantVampireQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantVampireQuestNode Dawnguard.esm:004C22 (Dawnguard.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "(Optional) Make it a public kill while wearing Dawnguard armor", shown at stage 10. Source: Dawnguard.esm:0050BD QOBJ 110. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Kill someone out in the streets of <Alias=City>". Source: Dawnguard.esm:0050BD QOBJ 100. **files**
- Target alias CityCenterMarker (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 15. Protecting the Bloodline (`DLC1RV04`, Dawnguard.esm:0056FD, Dawnguard.esm)

**Started by**

- Dialogue with Fura Bloodmouth, placed in Volkihar Keep, "...": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Fura Bloodmouth). Source: DLC1_TIF__01015E12.Fragment_0 on INFO Dawnguard.esm:015E12 (Dawnguard.esm). **script**
- Dialogue with Garan Marethi, placed in Volkihar Keep, "...": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Garan Marethi). Source: DLC1_TIF__01015E13.Fragment_0 on INFO Dawnguard.esm:015E13 (Dawnguard.esm). **script**
- Story manager node DLC1RadiantVampireQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantVampireQuestNode Dawnguard.esm:004C22 (Dawnguard.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=QuestGiver>", shown at stage 100. Source: Dawnguard.esm:0056FD QOBJ 100. **files**
- DLC1RV04 (Protecting the Bloodline) calls SetStage 100. Source: DLC1RV04VampireScript.OnDeath on Dawnguard.esm:0056FD (Dawnguard.esm). **script**

**Who and where**

- First objective: "Kill the <Alias=Vampire> at <Alias=Dungeon>". Source: Dawnguard.esm:0056FD QOBJ 10. **files**
- Target alias Vampire (created): Skyrim.esm:02F9E2 (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 16. Ancient Power (`DLC1RV05`, Dawnguard.esm:005702, Dawnguard.esm)

**Started by**

- Dialogue with Feran Sadri (named by alias QuestGiver of DLC1RV05 (Ancient Power) (run time)), placed in Volkihar Keep, "What can I do to help?": SetStage 10 (when: the speaker is the one in alias QuestGiver; Ancient Power stage < 10; global DLC1VampireChaliceLevel == 0 (now 0)). Source: DLC1_TIF__010056F9.Fragment_0 on INFO Dawnguard.esm:0056F9 (Dawnguard.esm). **script**
- Dialogue with Feran Sadri (named by alias QuestGiver of DLC1RV05 (Ancient Power) (run time)), placed in Volkihar Keep, "What can I do to help?": SetStage 10 (when: the speaker is the one in alias QuestGiver; Ancient Power stage < 10). Source: DLC1_TIF__0101473D.Fragment_0 on INFO Dawnguard.esm:01473D (Dawnguard.esm). **script**
- Story manager node DLC1RadiantVampireQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantVampireQuestNode Dawnguard.esm:004C22 (Dawnguard.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=QuestGiver>", shown at stage 100. Source: Dawnguard.esm:005702 QOBJ 100. **files**
- DLC1RV05 (Ancient Power) calls SetStage 100. Source: DLC1RV05RemainsScript.OnContainerChanged on Dawnguard.esm:005702 (Dawnguard.esm). **script**

**Who and where**

- First objective: "Retrieve the <Alias=Remains> from <Alias=Dungeon>". Source: Dawnguard.esm:005702 QOBJ 10. **files**
- Target alias Remains (created): Dawnguard.esm:00570A (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 17. The Gift (`DLC1RV06`, Dawnguard.esm:0058CA, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Vingalmo (named by alias QuestGiver of DLC1RV06 (The Gift) (run time)), placed in Volkihar Keep, "...": SetStage 10 (when: the speaker is the one in alias QuestGiver; fn70 == 1). Source: DLC1_TIF__010058BD.Fragment_0 on INFO Dawnguard.esm:0058BD (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Vingalmo (named by alias QuestGiver of DLC1RV06 (The Gift) (run time)), placed in Volkihar Keep, "...": SetStage 10 (when: the speaker is the one in alias QuestGiver; fn70 == 1). Source: DLC1_TIF__010058BE.Fragment_0 on INFO Dawnguard.esm:0058BE (Unofficial Skyrim Special Edition Patch.esp). **script**
- Story manager node DLC1RadiantVampireQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantVampireQuestNode Dawnguard.esm:004C22 (Dawnguard.esm). **run time**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=QuestGiver>", shown at stage 100. Source: Dawnguard.esm:0058CA QOBJ 100. **files**
- Dialogue with Aela the Huntress (named by alias Spouse of DLC1RV06 (The Gift) (run time)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "You'll need to trust me. The family is safer this way.": SetStage 70 (when: the speaker is the one in alias Spouse; GetInFaction PotentialMarriageFaction == 1). Reply: "I see... I... I understand. Thank you." Source: DLC1_TIF__010058C5.Fragment_0 on INFO Dawnguard.esm:0058C5 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Mesmerize and turn <Alias=Spouse> into a vampire.". Source: Dawnguard.esm:0058CA QOBJ 10. **files**
- Target alias Spouse (run time): Aela the Huntress (named in its conditions, placed in Jorrvaskr Living Quarters, Jorrvaskr); Farkas (named in its conditions, placed in Jorrvaskr Living Quarters, Jorrvaskr); Vilkas (named in its conditions, placed in Jorrvaskr Living Quarters, Jorrvaskr). **files**

**Needs**

- Its own conditions: global DLC1RV06DoOnce == 0 (now 0). **files**
- Ways in: Jorrvaskr Living Quarters, Jorrvaskr: 1 door, 0 locked. A door is a need only when every way in is locked. **files**
- Global DLC1RV06DoOnce: record 0.0 (Dawnguard.esm); at run time script DLC1_QF_DLC1RV06_010058CA:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 18. New Allegiances (`DLC1RV07`, Dawnguard.esm:00A29C, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Vingalmo (named by alias QuestGiver of DLC1RV07 (New Allegiances) (run time)), placed in Volkihar Keep, "Understood.": SetStage 10 (when: the speaker is the one in alias QuestGiver; fn70 == 1). Source: DLC1_TIF__0100A299.Fragment_0 on INFO Dawnguard.esm:00A299 (Dawnguard.esm). **script**
- Dialogue with Vingalmo (named by alias QuestGiver of DLC1RV07 (New Allegiances) (run time)), placed in Volkihar Keep, "Understood.": SetStage 10 (when: the speaker is the one in alias QuestGiver; fn70 == 1). Source: DLC1_TIF__0100A29A.Fragment_0 on INFO Dawnguard.esm:00A29A (Dawnguard.esm). **script**
- Story manager node DLC1RadiantVampireQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantVampireQuestNode Dawnguard.esm:004C22 (Dawnguard.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=QuestGiver>", shown at stage 100. Source: Dawnguard.esm:00A29C QOBJ 100. **files**
- **unread**: nothing outside its own stage fragments sets stage 100 or one before it.

**Who and where**

- First objective: "Turn <Alias=Candidate> into a vampire". Source: Dawnguard.esm:00A29C QOBJ 10. **files**
- Target alias Candidate (run time): Haran (named in its conditions, placed in The Frozen Hearth); Cairine (named in its conditions, placed in The Warrens); Valindor (named in its conditions, placed in Valindor's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Frozen Hearth: 5 doors, 0 locked; The Warrens: 1 door, 0 locked; Valindor's House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 19. Rings of Blood Magic (`DLC1RV08`, Dawnguard.esm:00CE06, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Feran Sadri (named by alias QuestGiver of DLC1RV08 (Rings of Blood Magic) (run time)), placed in Volkihar Keep, "Understood.": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: DLC1_TIF__01003992.Fragment_0 on INFO Dawnguard.esm:003992 (Dawnguard.esm). **script**
- Story manager node DLC1RadiantVampireQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantVampireQuestNode Dawnguard.esm:004C22 (Dawnguard.esm). **run time**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Retrieve the <Alias=Item2> from <Alias=Location2>", shown at stage 10. Source: Dawnguard.esm:00CE06 QOBJ 120. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Retrieve the <Alias=Item1> from <Alias=Location1>". Source: Dawnguard.esm:00CE06 QOBJ 110. **files**
- Target alias Item1 (created): Ring of the Beast (created item). **files**

**Needs**

- Its own conditions: global DLC1RV08DoOnce == 0 (now 0). **files**
- Global DLC1RV08DoOnce: record 0.0 (Dawnguard.esm); at run time script DLC1_QF_DLC1RV08_0100CE06:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 20. Amulets of Night Power (`DLC1RV09`, Dawnguard.esm:00CE0B, Dawnguard.esm)

**Started by**

- Dialogue with Feran Sadri (named by alias QuestGiver of DLC1RV09 (Amulets of Night Power) (run time)), placed in Volkihar Keep, "Understood.": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: DLC1_TIF__01003997.Fragment_0 on INFO Dawnguard.esm:003997 (Dawnguard.esm). **script**
- Story manager node DLC1RadiantVampireQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantVampireQuestNode Dawnguard.esm:004C22 (Dawnguard.esm). **run time**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Retrieve the <Alias=Item2> from <Alias=Location2>". Source: Dawnguard.esm:00CE0B QOBJ 120. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Retrieve the <Alias=Item1> from <Alias=Location1>". Source: Dawnguard.esm:00CE0B QOBJ 110. **files**
- Target alias Item1 (created): Amulet of Bats (created item). **files**

**Needs**

- Its own conditions: global DLC1RV09DoOnce == 0 (now 0); HasPerk Vampiric Seed == 1. **files**
- Global DLC1RV09DoOnce: record 0.0 (Dawnguard.esm); at run time script DLC1_QF_DLC1RV09_0100CE0B:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 21. Destroying the Dawnguard (`DLC1RV10`, Dawnguard.esm:019938, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Garan Marethi, placed in Volkihar Keep, "What can I do to help?": SetStage 10 (when: the speaker is the one in alias QuestGiver; the speaker is Garan Marethi; Destroying the Dawnguard stage < 10). Source: DLC1_TIF__01019932.Fragment_0 on INFO Dawnguard.esm:019932 (Dawnguard.esm). **script**
- Dialogue with Fura Bloodmouth, placed in Volkihar Keep, "What can I do to help?": SetStage 10 (when: the speaker is the one in alias QuestGiver; the speaker is Fura Bloodmouth; Destroying the Dawnguard stage < 10). Source: DLC1_TIF__01019933.Fragment_0 on INFO Dawnguard.esm:019933 (Dawnguard.esm). **script**
- Story manager node DLC1RadiantVampireQuestNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC1RadiantVampireQuestNode Dawnguard.esm:004C22 (Dawnguard.esm). **run time**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=QuestGiver>", shown at stage 100. Source: Dawnguard.esm:019938 QOBJ 100. **files**
- DLC1RV10 (Destroying the Dawnguard) calls SetStage 100. Source: DLC1RV10Script.CheckDead on Dawnguard.esm:019938 (Unofficial Skyrim Special Edition Patch.esp). **script**
- DLC1RV10 (Destroying the Dawnguard) calls SetStage 100. Source: DLC1RV10AliasScript.OnDeath on Dawnguard.esm:019938 (Unofficial Skyrim Special Edition Patch.esp), through DLC1RV10 (Destroying the Dawnguard)'s checkdead. **script**
- DLC1RV10 (Destroying the Dawnguard) calls SetStage 100. Source: DLC1RV10AliasScript.OnDying on Dawnguard.esm:019938 (Unofficial Skyrim Special Edition Patch.esp), through DLC1RV10 (Destroying the Dawnguard)'s checkdead. **script**

**Who and where**

- First objective: "Kill the Dawnguard Leaders". Source: Dawnguard.esm:019938 QOBJ 10. **files**
- Target alias Agmaer (unique): Agmaer (unique actor, placed in Fort Dawnguard). **files**
- Target alias Beleval (unique): Beleval (unique actor, placed in Fort Dawnguard). **files**
- Target alias Celann (unique): Celann (unique actor, placed in Fort Dawnguard). **files**
- Target alias Durak (unique): Durak (unique actor, placed in Fort Dawnguard). **files**
- Target alias Florentius (unique): Florentius Baenius (unique actor, placed in Fort Dawnguard). **files**
- Target alias Gunmar (unique): Gunmar (unique actor, placed in Fort Dawnguard). **files**
- Target alias Isran (unique): Isran (unique actor, placed in Fort Dawnguard). **files**
- Target alias Sorine (unique): Sorine Jurard (unique actor, placed in Fort Dawnguard). **files**

**Needs**

- Its own conditions: global DLC1HarkonDead == 1 (now 0); global DLC1RV10DoOnce == 0 (now 0). **files**
- Ways in: Fort Dawnguard: 9 doors, 0 locked; Fort Dawnguard: 9 doors, 0 locked; Fort Dawnguard: 9 doors, 0 locked; Fort Dawnguard: 9 doors, 0 locked; Fort Dawnguard: 9 doors, 0 locked; Fort Dawnguard: 9 doors, 0 locked; Fort Dawnguard: 9 doors, 0 locked; Fort Dawnguard: 9 doors, 0 locked. A door is a need only when every way in is locked. **files**
- Global DLC1RV10DoOnce: record 0.0 (Dawnguard.esm); at run time script DLC1_QF_DLC1RV10_01019938:  = 1. **run time**
- Global DLC1HarkonDead: record 0.0 (Dawnguard.esm); at run time script DLC1_QF_DLC1VQ08_01007C25:  = 1; script aaFu_QF__0501FC2B:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 22. The Bloodstone Chalice (`DLC1VampireBaseIntro`, Dawnguard.esm:00594C, Dawnguard.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC1VQ02 (Bloodline) at stage 180 calls SetStage 10. Source: DLC1_QF_DLC1VQ01COPY0000_01002F65.fragment_14 (Dawnguard.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Follow Garan", shown at stage 15. Source: Dawnguard.esm:00594C QOBJ 15. **files**
- Dialogue with Garan Marethi (named by alias GaranAlias of DLC1VampireBaseIntro (The Bloodstone Chalice) (unique)), placed in Volkihar Keep: SetStage 15 (when: the speaker is the one in alias GaranAlias). Reply: "The Chalice has been in Lord Harkon's possession for quite some time now. It is, when used properly, able to increase the potency of our powers." Source: DLC1_TIF__01018B65.Fragment_0 on INFO Dawnguard.esm:018B65 (Dawnguard.esm). **script**

**Who and where**

- First objective: "Speak with Garan Marethi". Source: Dawnguard.esm:00594C QOBJ 10. **files**
- Target alias GaranAlias (unique): Garan Marethi (unique actor, placed in Volkihar Keep). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Volkihar Keep: 6 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 23. Awakening (`DLC1VQ01`, Dawnguard.esm:00352A, Dawnguard.esm)

**Started by**

- DLC1VQ01MiscObjective (Dawnguard) at stage 180 calls SetStage 10. Source: DLC1_QF_DLC1VQ01MiscObjective_0100D06C.fragment_16 on Dawnguard.esm:00D06C (Requiem.esp). **script**
- Dialogue with Vigilant Tolan, placed in Fort Dawnguard: SetStage 10 (when: the speaker is Vigilant Tolan). Source: DLC1_TIF_DLC1VQ01TolanDirecti_01019AAB.Fragment_0 on INFO Dawnguard.esm:019AAB (Dawnguard.esm). **script**
- Dialogue with Vigilant Tolan, placed in Fort Dawnguard, "You said something happened to the Hall of Vigilants?": SetStage 5 (when: the speaker is Vigilant Tolan; Awakening stage 10 done; Awakening stage 5 not done). Source: DLC1_TIF__0101A1B4.Fragment_0 on INFO Dawnguard.esm:01A1B4 (Dawnguard.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC1VQ03Hunter (Prophet) at stage 0 calls SetStage 200. Source: DLC1_QF_DLC1VQ03Hunter_010098CB.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to the mysterious woman", shown at stage 20. Source: Dawnguard.esm:00352A QOBJ 40. **files**
- DLC1VQ01 (Awakening) calls SetStage 12. Source: DLC1VQ01TolanScript.OnUnload on Dawnguard.esm:00352A (Dawnguard.esm). **script**
- DLC1VQ01 (Awakening) calls SetStage 17. Source: DLC1VQ01BookScript.onRead on Dawnguard.esm:00352A (Dawnguard.esm). **script**
- DLC1VQ01 (Awakening) calls SetStage 17. Source: DLC1VQ01BookScript.OnContainerChanged on Dawnguard.esm:00352A (Dawnguard.esm). **script**

**Who and where**

- First objective: "Find out what the vampires are seeking". Source: Dawnguard.esm:00352A QOBJ 30. **files**
- Target alias Sarcophagus (forced): a marker (forced reference, placed in Dimhollow Cavern, Dimhollow Crypt). **files**
- Target alias DimhollowEntrance (forced): Passage (forced reference, placed in Dimhollow Crypt). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dimhollow Cavern, Dimhollow Crypt: 2 doors, 0 locked; Dimhollow Crypt: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 24. Bloodline (`DLC1VQ02`, Dawnguard.esm:002F65, Dawnguard.esm)

**Started by**

- DLC1VQ01 (Awakening) at stage 200 calls SetStage 5. Source: QF_DLC01VQ01_0100352A.fragment_1 on Dawnguard.esm:00352A (Dawnguard.esm). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC1VQ03Hunter (Prophet) at stage 0 calls SetStage 200. Source: DLC1_QF_DLC1VQ03Hunter_010098CB.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).
- DLC1VampireTutorial (Power of the Blood) at stage 100 calls SetStage 180. Source: DLC1_QF_DLC1VampireTutorial_0101909F.fragment_10 (Skip Vampire Lord Tutorial.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Harkon", shown at stage 10. Source: Dawnguard.esm:002F65 QOBJ 20. **files**
- Dialogue with Isran (named by alias IsranAlias of DLC1HunterBaseIntro (A New Order) (unique)), placed in Fort Dawnguard: SetStage 6 (when: A New Order stage < 20; fn629 == 0; fn249 == 1; the speaker is the one in alias IsranAlias). Reply: "And I suppose you're the one Tolan says is actually doing something about this mess." Source: DLC1_TIF__01005946.Fragment_0 on INFO Dawnguard.esm:005946 (Dawnguard.esm). **script**
- Dialogue with Isran (named by alias IsranAlias of DLC1HunterBaseIntro (A New Order) (unique)), placed in Fort Dawnguard: SetStage 7 (when: the speaker is the one in alias IsranAlias). Reply: "Well, it seems the Dawnguard really is needed again." Source: DLC1_TIF__01017FEA.Fragment_0 on INFO Dawnguard.esm:017FEA (Dawnguard.esm). **script**
- Dialogue with Isran (named by alias Isran of DLC1VQ02 (Bloodline) (unique)), placed in Fort Dawnguard, "She's asking me to take her home, to some castle.": SetStage 7 (when: the speaker is the one in alias Isran). Reply: "I won't lie - if this were any other situation, I'd put her down just on the chance she might be a vampire." Source: DLC1_TIF__01019812.Fragment_0 on INFO Dawnguard.esm:019812 (Dawnguard.esm). **script**

**Who and where**

- First objective: "Lead Serana to her home". Source: Dawnguard.esm:002F65 QOBJ 10. **files**
- Target alias Harkon (unique): Lord Harkon (unique actor, placed in Volkihar Keep). **files**
- Target alias Boat (forced): Rowboat (forced reference, placed in Skyrim). **files**
- Target alias DungeonExit (forced): a marker (forced reference, placed in Dimhollow Cavern, Dimhollow Crypt). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Volkihar Keep: 6 doors, 1 locked; Skyrim: 1 door, 0 locked; Dimhollow Cavern, Dimhollow Crypt: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 25. Prophet (`DLC1VQ03Hunter`, Dawnguard.esm:0098CB, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC1HunterBaseIntro (A New Order) at stage 200 calls SetStage 5. Source: DLC1_QF_DLC1HunterBaseIntro_01004E24.fragment_5 on Dawnguard.esm:004E24 (Requiem.esp). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Serana", shown at stage 7. Source: Dawnguard.esm:0098CB QOBJ 10. **files**
- **unread**: nothing outside its own stage fragments sets stage 7 or one before it.

**Who and where**

- First objective: "Follow Isran". Source: Dawnguard.esm:0098CB QOBJ 5. **files**
- Target alias Isran (unique): Isran (unique actor, placed in Fort Dawnguard). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Fort Dawnguard: 9 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 26. Prophet (`DLC1VQ03Vampire`, Dawnguard.esm:004C3D, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC1VampireBaseIntro (The Bloodstone Chalice) at stage 200 calls Start. Source: DLC1_QF_DLC1VampireBaseIntro_0100594C.fragment_14 on Dawnguard.esm:00594C (Dawnguard.esm). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Listen to Harkon's speech", shown at stage 10. Source: Dawnguard.esm:004C3D QOBJ 20. **files**
- Dialogue with Lord Harkon, placed in Volkihar Keep: SetStage 10 (when: the speaker is Lord Harkon). Reply: "I have ordered the court to assemble. I have a new task for us all to carry out, and that includes you." Source: DLC1_TIF__010069AF.Fragment_0 on INFO Dawnguard.esm:0069AF (Dawnguard.esm). **script**

**Who and where**

- First objective: "Speak to Harkon". Source: Dawnguard.esm:004C3D QOBJ 10. **files**
- Target alias Harkon (unique): Lord Harkon (unique actor, placed in Volkihar Keep). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Volkihar Keep: 6 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 27. Chasing Echoes (`DLC1VQ04`, Dawnguard.esm:00284F, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC1VQ03Vampire (Prophet) at stage 200 calls SetStage 10. Source: DLC1_QF_DLC1VQ03Vampire_01004C3D.fragment_1 on Dawnguard.esm:004C3D (Unofficial Skyrim Special Edition Patch.esp). **script**
- DLC1VQ03Hunter (Prophet) at stage 200 calls SetStage 10. Source: DLC1_QF_DLC1VQ03Hunter_010098CB.fragment_1 on Dawnguard.esm:0098CB (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Explore Castle Volkihar's Courtyard", shown at stage 20. Source: Dawnguard.esm:00284F QOBJ 20. **files**
- Dialogue with Serana, placed in Dimhollow Cavern, Dimhollow Crypt, "Let's go to the castle's secret entrance.": SetStage 20 (when: the speaker is Serana; fn359 == 1). Reply: "Come on. It's just around the side." Source: DLC1_TIF__02012192.Fragment_1 on INFO Dawnguard.esm:012192 (Dawnguard.esm). **script**
- Dialogue with Serana, placed in Dimhollow Cavern, Dimhollow Crypt, "Let's go to the castle's secret entrance.": SetStage 20 (when: the speaker is Serana). Reply: "It's around the side of the castle. Let's move." Source: DLC1_TIF__02012E82.Fragment_1 on INFO Dawnguard.esm:012E82 (Dawnguard.esm). **script**

**Who and where**

- First objective: "Speak to Serana". Source: Dawnguard.esm:00284F QOBJ 10. **files**
- Target alias DLC1VQ04RNPC (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 28. Beyond Death (`DLC1VQ05`, Dawnguard.esm:002850, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC1VQ04 (Chasing Echoes) at stage 200 calls SetStage 10. Source: DLC1_QF_VQ04Hunter_0100284F.fragment_5 on Dawnguard.esm:00284F (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Valerica", shown at stage 25. Source: Dawnguard.esm:002850 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 25 or one before it.

**Who and where**

- First objective: "Locate Valerica". Source: Dawnguard.esm:002850 QOBJ 10. **files**
- Target alias DLC1VQ05ValericaAlias (unique): Valerica (unique actor, placed in Soul Cairn). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 29. Unseen Visions (`DLC1VQ06`, Dawnguard.esm:002852, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC1VQElder (Seeking Disclosure) at stage 200 calls SetStage 10. Source: DLC1_QF_DLC1VQElder_01005DA9.fragment_0 (Unofficial Skyrim Special Edition Patch.esp).
- DLC1VQElder (Seeking Disclosure) at stage 200 calls SetStage 10. Source: DLC1_QF_DLC1VQElder_01005DA9.fragment_13 (Unofficial Skyrim Special Edition Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Gather bark from a Canticle Tree", shown at stage 20. Source: Dawnguard.esm:002852 QOBJ 20. **files**
- DLC1VQ06 (Unseen Visions) calls SetStage 20. Source: DLC1VQ06DrawKnifeAliasScript.OnContainerChanged on Dawnguard.esm:002852 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Find a Moth Priest's knife". Source: Dawnguard.esm:002852 QOBJ 10. **files**
- Target alias DLC1VQ06DrawKnifeQTAlias (forced): a marker (forced reference, placed in Ancestor Glade). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 30. Touching the Sky (`DLC1VQ07`, Dawnguard.esm:002853, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC1VQ06 (Unseen Visions) calls at stage 200 SetStage 10; at stage 200 SetStage 10. Sources: DLC1_QF_DLC1VQ06_01002852.fragment_2, DLC1_QF_DLC1VQ06_01002852.fragment_13 on Dawnguard.esm:002852. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Gelebor", shown at stage 30. Source: Dawnguard.esm:002853 QOBJ 30. **files**
- **unread**: nothing outside its own stage fragments sets stage 30 or one before it.

**Who and where**

- First objective: "Locate Auriel's Bow". Source: Dawnguard.esm:002853 QOBJ 20. **files**
- Target alias DLC1VQ07GeleborAlias (unique): Knight-Paladin Gelebor (unique actor, placed in Darkfall Cave). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Darkfall Cave: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Elven Arrow x12 (stage 200, DLC1_QF_DLC1VQ07_01002853.fragment_22); Sunhallowed Elven Arrow x12 (stage 200, DLC1_QF_DLC1VQ07_01002853.fragment_22).

## 31. Kindred Judgment (`DLC1VQ08`, Dawnguard.esm:007C25, Requiem_VampireCollection.esp)

**Started by**

- DLC1VQ07 (Touching the Sky) at stage 200 calls SetStage 10. Source: DLC1_QF_DLC1VQ07_01002853.fragment_22 on Dawnguard.esm:002853 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Isran", shown at stage 20. Source: Dawnguard.esm:007C25 QOBJ 20. **files**
- Dialogue with someone the line does not name (named by alias DLC1VQ08RNPCAlias of DLC1VQ08 (Kindred Judgment) (run time)), "Then let's face him, together.": SetStage 20 (when: the speaker is the one in alias DLC1VQ08RNPCAlias; Kindred Judgment stage == 10; global DLC1PlayingVampireLine == 1 (now 0); global DLC1VQ08DLink01 == 1 (now 0)). Reply: "Thank you. Somehow I knew you'd understand." Source: DLC1_TIF__01019FA9.Fragment_0 on INFO Dawnguard.esm:019FA9 (Dawnguard.esm). **script**
- Dialogue with someone the line does not name (named by alias DLC1VQ08RNPCAlias of DLC1VQ08 (Kindred Judgment) (run time)), "Then let's face him, together.": SetStage 20 (when: the speaker is the one in alias DLC1VQ08RNPCAlias; Kindred Judgment stage == 10; global DLC1PlayingVampireLine == 0 (now 0); global DLC1VQ08DLink01 == 1 (now 0)). Reply: "If we head back to the castle and kick the front door in, we're going to be knee-deep in his friends." Source: DLC1_TIF__01019F97.Fragment_0 on INFO Dawnguard.esm:019F97 (Dawnguard.esm). **script**

**Who and where**

- First objective: "Speak to Serana". Source: Dawnguard.esm:007C25 QOBJ 10. **files**
- Target alias DLC1VQ08RNPCAlias (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 32. Seeking Disclosure (`DLC1VQElder`, Dawnguard.esm:005DA9, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC1VQ03Vampire (Prophet) at stage 200 calls SetStage 10. Source: DLC1_QF_DLC1VQ03Vampire_01004C3D.fragment_1 on Dawnguard.esm:004C3D (Unofficial Skyrim Special Edition Patch.esp). **script**
- DLC1VQ03Hunter (Prophet) at stage 200 calls SetStage 10. Source: DLC1_QF_DLC1VQ03Hunter_010098CB.fragment_1 on Dawnguard.esm:0098CB (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find The Elder Scroll (Blood)", shown at stage 10. Source: Dawnguard.esm:005DA9 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Find The Elder Scroll (Dragon)". Source: Dawnguard.esm:005DA9 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: Elder Scroll (Sun) (stage 200, DLC1_QF_DLC1VQElder_01005DA9.fragment_0); Elder Scroll (Sun) (stage 200, DLC1_QF_DLC1VQElder_01005DA9.fragment_13).

## 33. Scroll Scouting (`DLC1VQElderHandler`, Dawnguard.esm:0181BF, Dawnguard.esm)

**Started by**

- DLC1VQElder (Seeking Disclosure) at stage 10 calls SetStage 20. Source: DLC1_QF_DLC1VQElder_01005DA9.fragment_2 on Dawnguard.esm:005DA9 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Dexion Evicus, placed in Forebears' Holdout, "Why is that?": SetStage 20 (when: the speaker is Dexion Evicus; Seeking Disclosure stage 20 not done; Elder Knowledge hasn't started; Discerning the Transmundane stage < 10; fn629 == 0). Source: DLC1_TIF__010181BC.Fragment_0 on INFO Dawnguard.esm:0181BC (Dawnguard.esm). **script**
- Dialogue with someone the line does not name (named by alias DLC1VQElderRNPCAlias of DLC1VQElderHandler (Scroll Scouting) (run time)), "Any clues about the other Elder Scroll?": SetStage 20 (when: the speaker is the one in alias DLC1VQElderRNPCAlias; Seeking Disclosure stage 20 not done; Elder Knowledge hasn't started; Discerning the Transmundane stage < 10; fn629 == 0). Source: DLC1_TIF__010181BE.Fragment_0 on INFO Dawnguard.esm:0181BE (Dawnguard.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Buy back the Elder Scroll (Dragon) from Urag gro-Shub", shown at stage 30. Source: Dawnguard.esm:0181BF QOBJ 20. **files**
- DLC1VQElder (Seeking Disclosure) at stage 10 calls SetStage 30. Source: DLC1_QF_DLC1VQElder_01005DA9.fragment_2 on Dawnguard.esm:005DA9 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Discover the location of the Elder Scroll (Dragon)". Source: Dawnguard.esm:0181BF QOBJ 10. **files**
- Target alias DLC1VQElderHandlerUragAlias (unique): Urag gro-Shub (unique actor, placed in The Arcanaeum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Arcanaeum: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 34. Impatience of a Saint (`DLC1VQSaint`, Dawnguard.esm:01400B, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Jiub, placed in Soul Cairn, "How many pages did you lose?": SetStage 20 (when: the speaker is Jiub; Impatience of a Saint stage == 10; global DLC1VQSaintDLink01 == 2 (now 0)). Source: DLC1_TIF__0101417B.Fragment_0 on INFO Dawnguard.esm:01417B (Dawnguard.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Dawnguard.esm:01400B DNAM (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Jiub", shown at stage 30. Source: Dawnguard.esm:01400B QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 30 or one before it.

**Who and where**

- First objective: "Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>)". Source: Dawnguard.esm:01400B QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: Saint Jiub's Opus (stage 200, DLC1_QF_DLC1VQSaint_0101400B.fragment_3); Locket of Saint Jiub (stage 200, DLC1_QF_DLC1VQSaint_0101400B.fragment_3).

## 35. Soul Cairn Horse Quest (`DLC01SoulCairnHorseQuest2`, Dawnguard.esm:0163CD, Dawnguard.esm)

**Started by**

- Dialogue with Soul (named by alias RiderSoul of DLC01SoulCairnHorseQuest2 (Soul Cairn Horse Quest) (forced)), placed in Soul Cairn; Soul Cairn, "How can I help him?": SetStage 15 (when: the speaker is the one in alias RiderSoul). Source: DLC1_TIF__01002B0B.Fragment_0 on INFO Dawnguard.esm:002B0B (Dawnguard.esm). **script**
- Dialogue with Soul (named by alias RiderSoul of DLC01SoulCairnHorseQuest2 (Soul Cairn Horse Quest) (forced)), placed in Soul Cairn; Soul Cairn, "How can I help him?": SetStage 20 (when: the speaker is the one in alias RiderSoul). Source: DLC1_TIF__01002B0B.Fragment_1 on INFO Dawnguard.esm:002B0B (Dawnguard.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Retrieve Arvak's skull", shown at stage 100. Source: Dawnguard.esm:0163CD QOBJ 100. **files**
- **unread**: nothing outside its own stage fragments sets stage 100 or one before it.

**Who and where**

- First objective: "Find Arvak's skull in the Soul Cairn". Source: Dawnguard.esm:0163CD QOBJ 20. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: fn18 > 22 or fn18 < 5.5. **files**

**Gives**: nothing on its completing stages.

## 36. "Parent" quest for Radiant Content (`DLC1Radiant`, Dawnguard.esm:004C1C, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC1VQ06 (Unseen Visions) at stage 0 calls SetStage 10. Source: DLC1_QF_DLC1VQ06_01002852.fragment_0 on Dawnguard.esm:002852 (Unofficial Skyrim Special Edition Patch.esp). **script**
- DLC1VQ03Vampire (Prophet) at stage 0 calls SetStage 10. Source: DLC1_QF_DLC1VQ03Vampire_01004C3D.fragment_7 on Dawnguard.esm:004C3D (Unofficial Skyrim Special Edition Patch.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Dawnguard.esm:004C1C DNAM (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Help Sorine with her project to improve the crossbow". Source: Dawnguard.esm:004C1C QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Speak with <Alias=CurrentQuestGiver> for an assignment". Source: Dawnguard.esm:004C1C QOBJ 10. **files**
- Target alias CurrentQuestGiver (run time): Isran (put there by a script (ForceRefTo), placed in Fort Dawnguard); Gunmar (put there by a script (ForceRefTo), placed in Fort Dawnguard); Florentius Baenius (put there by a script (ForceRefTo), placed in Fort Dawnguard); Sorine Jurard (put there by a script (ForceRefTo), placed in Fort Dawnguard); Orthjolf (put there by a script (ForceRefTo), placed in Volkihar Keep); Vingalmo (put there by a script (ForceRefTo), placed in Volkihar Keep); Feran Sadri (put there by a script (ForceRefTo), placed in Volkihar Keep); Garan Marethi (put there by a script (ForceRefTo), placed in Volkihar Keep); Fura Bloodmouth (put there by a script (ForceRefTo), placed in Volkihar Keep). **script**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Fort Dawnguard: 9 doors, 0 locked; Volkihar Keep: 6 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 37. Beyond Death Soul Gem Handler (`DLC1VQ05SoulGemHandler`, Dawnguard.esm:00EA41, Praedy's SoulEssenceGem.esp)

**Started by**

- DLC1VQ04 (Chasing Echoes) calls SetStage 10; at stage 115 SetStage 10. Sources: dlc1vq04questscript.SoulTrapped, DLC1_QF_VQ04Hunter_0100284F.fragment_33 on Dawnguard.esm:00284F. **script**
- Dialogue with Valerica, placed in Soul Cairn, "Any idea where it could be?": SetStage 20 (when: the speaker is Valerica; Beyond Death stage == 130; Beyond Death Soul Gem Handler stage 30 not done; global DLC1VQ04SoulTrapped == 1 (now 0)). Source: DLC1_TIF__0200E9DD.Fragment_0 on INFO Dawnguard.esm:00E9DD (Dawnguard.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Retrieve the Soul Essence Gem". Source: Dawnguard.esm:00EA41 QOBJ 10. **files**
- Target alias DLC1VQ05GemChestAlias (forced): Chest (forced reference, placed in Soul Cairn). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 38. Durnehviir (`DLC1VQDragon`, Dawnguard.esm:00C73A, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias DLC1VQDragonAlias of DLC1VQDragon (Durnehviir) (from alias)), "Just call your name in Tamriel? That's it?": SetStage 30 (when: the speaker is the one in alias DLC1VQDragonAlias; Durnehviir stage == 20; global DLC1VQDragonDLink01 == 1 (now 0)). Source: DLC1_TIF__0101157B.Fragment_0 on INFO Dawnguard.esm:01157B (Dawnguard.esm). **script**
- Dialogue with someone the line does not name (named by alias DLC1VQDragonAlias of DLC1VQDragon (Durnehviir) (from alias)), "I have more pressing matters at the moment.": SetStage 20 (when: the speaker is the one in alias DLC1VQDragonAlias; Durnehviir stage == 10; global DLC1VQDragonDLink01 == 0 (now 0)). Source: DLC1_TIF__0101157E.Fragment_0 on INFO Dawnguard.esm:01157E (Dawnguard.esm). **script**
- Dialogue with someone the line does not name (named by alias DLC1VQDragonAlias of DLC1VQDragon (Durnehviir) (from alias)), "Why are we speaking?": SetStage 20 (when: the speaker is the one in alias DLC1VQDragonAlias; Durnehviir stage == 10; global DLC1VQDragonDLink01 == 0 (now 0)). Source: DLC1_TIF__01011570.Fragment_0 on INFO Dawnguard.esm:011570 (Dawnguard.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Dawnguard.esm:00C73A DNAM (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 30; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Learn the first word of the Soul Tear shout", shown at stage 30. Source: Dawnguard.esm:00C73A QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 30 or one before it.

**Who and where**

- First objective: "Summon Durnehviir in Tamriel". Source: Dawnguard.esm:00C73A QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 39. Durnehviir Misc Objective Handler (`DLC1VQDragonMisc`, Dawnguard.esm:01119F, Dawnguard.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Durnehviir at his lair in the Soul Cairn". Source: Dawnguard.esm:01119F QOBJ 10. **files**
- Target alias DLC1VQDragonMiscAlias (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 40. Forgotten Vale Books Quest (`DLC1VQFVBooks`, Dawnguard.esm:01A3E4, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Start-game flag: the quest runs from the start of the game. Source: Dawnguard.esm:01A3E4 DNAM (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring Ancient Falmer Tome to Urag gro-Shub". Source: Dawnguard.esm:01A3E4 QOBJ 10. **files**
- Target alias DLC1FVBUragAlias (unique): Urag gro-Shub (unique actor, placed in The Arcanaeum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Arcanaeum: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 41. Power of the Blood (`DLC1VampireTutorial`, Dawnguard.esm:01909F, Skip Vampire Lord Tutorial.esp)

**Started by**

- DLC1VQ02 (Bloodline) at stage 40 calls SetStage 10. Source: DLC1_QF_DLC1VQ01COPY0000_01002F65.fragment_20 on Dawnguard.esm:002F65 (Dawnguard.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Enter melee mode". Source: Dawnguard.esm:01909F QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Tranform into the Vampire Lord". Source: Dawnguard.esm:01909F QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | To get into Dawnguard: Impatience of a Saint is running from the start: Find pages from Saint Jiub's Opus (<Global=DLC1VQSaintCount>/<Global=DLC1VQSaintTotal>); or ask Agmaer in Fort Dawnguard "" (), which starts Dawnguard. |

## Routes into the first quest from outside the starts

### DLC1VQ00ChangeLocation

- What it does: stage 0: SetStage 5. Source: DLC1_QF_DLC1VQ00ChangeLocatio_0100D90B on Dawnguard.esm:00D90B (TheChoiceIsYours.esp). **script**
- Started by: story manager node DLC1VQ00Node (change location; Laid to Rest completed; level >= DLC1VQMinLevel (now 30); Dawnguard stage < 10; Dragonborn stage >= 5 or The Way of the Voice stage < 160; fn576 == 1; fn576 == 0; fn576 == 0; fn576 == 0; fn359 == 0; fn359 == 0; DLC1VQ00Node Dawnguard.esm:00D911 (DawnguardQuestPrerequisite.esp)).
- In one sentence: DLC1VQ00ChangeLocation stage 0: SetStage 5 on DLC1VQ01MiscObjective (Dawnguard); it is started by story manager node DLC1VQ00Node (change location; Laid to Rest completed; level >= DLC1VQMinLevel (now 30); Dawnguard stage < 10; Dragonborn stage >= 5 or The Way of the Voice stage < 160; fn576 == 1; fn576 == 0; fn576 == 0; fn576 == 0; fn359 == 0; fn359 == 0; DLC1VQ00Node Dawnguard.esm:00D911 (DawnguardQuestPrerequisite.esp)).

### DLC1VQ00

- What it does: stage 50: SetStage 10. Source: DLC1_QF_DLC1VQ00_0100D90E on Dawnguard.esm:00D90E (Dawnguard.esm). **script**
- Started by: DLC1_QF_DLC1VQ00ChangeLocatio_0100D90B.fragment_1 on Dawnguard.esm:00D90B (TheChoiceIsYours.esp); the start-game flag (Dawnguard.esm:00D90E DNAM, Dawnguard.esm).
- In one sentence: DLC1VQ00 stage 50: SetStage 10 on DLC1VQ01MiscObjective (Dawnguard); it is started by DLC1_QF_DLC1VQ00ChangeLocatio_0100D90B.fragment_1 on Dawnguard.esm:00D90B (TheChoiceIsYours.esp); the start-game flag (Dawnguard.esm:00D90E DNAM, Dawnguard.esm).

### dialogue INFO Dawnguard.esm:00D8D8

- Speaker: Agmaer (Nord), placed in Fort Dawnguard. Named by: scene DLC1VQ01AgmaerScene, alias Agmaer of DLC1VQ01MiscObjective (Dawnguard) (unique).
- The player's prompt: "".
- The reply: "Oh, hey there! You here to join the Dawnguard too?".
- When it's offered: no conditions.
- What it does: SetStage 10 on DLC1VQ01MiscObjective (Dawnguard). Source: DLC1_TIF__0100D8D8.Fragment_0 on INFO Dawnguard.esm:00D8D8 (Unofficial Skyrim Special Edition Patch.esp); topic . **script**
- In one sentence: Talk to Agmaer (Nord) in Fort Dawnguard: SetStage 10 on DLC1VQ01MiscObjective (Dawnguard).

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
