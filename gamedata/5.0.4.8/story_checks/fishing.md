# Start check: Fishing (`fishing`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. In A Pinch (`ccBGSSSE001_Crab_MQ1`, ccBGSSSE001-Fish.esm:0009D4, Synthesis - Gameplay Overwrite.esp)

**Started by**

- Dialogue with Viriya (named by the one follower in ccBGSSSE001_Crab_MQ1 (In A Pinch)'s aliases), placed in Riften Fishery, "What's wrong?": SetStage 10. Source: ccBGSSSE001_TIF__05000E7B.Fragment_1 on INFO ccBGSSSE001-Fish.esm:000E7B (Simple Fishing Overhaul.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: ccBGSSSE001-Fish.esm:0009D4 DNAM (Synthesis - Gameplay Overwrite.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Viriya". Source: ccBGSSSE001-Fish.esm:0009D4 QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain a juvenile mudcrab for Viriya". Source: ccBGSSSE001-Fish.esm:0009D4 QOBJ 0. **files**
- Target alias CrabCritter (forced): a marker (forced reference, placed in Skyrim). **files**

**Needs**

- Its own conditions: the speaker is the one in alias 0; Angler Acquaintances stage >= 5. **files**

**Gives**: nothing on its completing stages.

## 2. Crustacean Extermination (`ccBGSSSE001_Crab_MQ2`, ccBGSSSE001-Fish.esm:0009DA, Synthesis - Gameplay Overwrite.esp)

**Started by**

- ccBGSSSE001_MiscQuests (named "Miscellaneous Quests Handler" in its record), a helper quest with Viriya at stage 40 calls Start; ccBGSSSE001_MiscQuests is started by dialogue with Viriya (Start). Source: QF_ccBGSSSE001_MiscQuests_050009E6.fragment_6 on ccBGSSSE001-Fish.esm:0009E6 (Synthesis - Gameplay Overwrite.esp). **script**
- Dialogue with Viriya (named by the one follower in ccBGSSSE001_Crab_MQ2 (Crustacean Extermination)'s aliases), placed in Riften Fishery: SetStage 5. Source: ccBGSSSE001_TIF__05000AD5.Fragment_0 on INFO ccBGSSSE001-Fish.esm:000AD5 (ccBGSSSE001-Fish.esm). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Investigate the area near the fishing shack west of Dawnstar", shown at stage 10. Source: ccBGSSSE001-Fish.esm:0009DA QOBJ 5. **files**
- ccBGSSSE001_Crab_MQ2 (Crustacean Extermination) calls SetStage 10. Source: DefaultOnReadSetQuestStage.onRead on ccBGSSSE001-Fish.esm:0009DA (Synthesis - Gameplay Overwrite.esp). **script**

**Who and where**

- First objective: "Read the letter on mudcrab attacks". Source: ccBGSSSE001-Fish.esm:0009DA QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is the one in alias 2. **files**

**Gives**: Alik'ri Fishing Rod (stage 200, QF_ccBGSSSE001_Crab_MQ2_050009DA.fragment_3).

## 3. End of the Line (`ccBGSSSE001_Crab_MQ3`, ccBGSSSE001-Fish.esm:0009D6, Synthesis - Gameplay Overwrite.esp)

**Started by**

- It starts by itself from the start of the game. (SetStage 5). Source: ccBGSSSE001_CrabMQ3_Quest.OnUpdateGameTime on ccBGSSSE001-Fish.esm:0009D6 (Synthesis - Gameplay Overwrite.esp). **script**
- ccBGSSSE001_Crab_MQ4 (Wave Breaker) at stage 2000 calls Start; its stage 2000 is set by Dialogue with Viriya (named by the one follower in ccBGSSSE001_Crab_MQ4 (Wave Breaker)'s aliases), placed in Riften Fishery: SetStage 2000 (when: Wave Breaker stage == 600; fn136 == 1); Dialogue with Viriya (named by the one follower in ccBGSSSE001_Crab_MQ4 (Wave Breaker)'s aliases), placed in Riften Fishery: SetStage 2000 (when: Wave Breaker stage == 600; fn136 == 1). Source: QF_ccBGSSSE001_Crab_MQ4_050009E9.fragment_2 on ccBGSSSE001-Fish.esm:0009E9 (Synthesis - Gameplay Overwrite.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Obtain <Global=ccBGSSSE001_MQ3NailsTotal> nails (<Global=ccBGSSSE001_MQ3NailsCount>/<Global=ccBGSSSE001_MQ3NailsTotal>)". Source: ccBGSSSE001-Fish.esm:0009D6 QOBJ 1. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain <Global=ccBGSSSE001_MQ3WoodTotal> pieces of firewood (<Global=ccBGSSSE001_MQ3WoodCount>/<Global=ccBGSSSE001_MQ3WoodTotal>)". Source: ccBGSSSE001-Fish.esm:0009D6 QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is the one in alias 1. **files**

**Gives**: nothing on its completing stages.

## 4. Wave Breaker (`ccBGSSSE001_Crab_MQ4`, ccBGSSSE001-Fish.esm:0009E9, Synthesis - Gameplay Overwrite.esp)

**Started by**

- ccBGSSSE001_Misc_Dwarven (Beneath Bronze Waters) at stage 20 calls Start. Source: QF_ccBGSSSE001_Misc_Dwarven_05000AD6.fragment_7 on ccBGSSSE001-Fish.esm:000AD6 (Synthesis - Gameplay Overwrite.esp). **script**
- (First objective shown at stage 50; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to the shore west of Dawnstar", shown at stage 100. Source: ccBGSSSE001-Fish.esm:0009E9 QOBJ 10. **files**
- ccBGSSSE001_Crab_MQ4 (Wave Breaker) calls SetStage 100. Source: DefaultOnReadSetQuestStage.onRead on ccBGSSSE001-Fish.esm:0009E9 (Synthesis - Gameplay Overwrite.esp). **script**

**Who and where**

- First objective: "Read Viriya's hastily written letter". Source: ccBGSSSE001-Fish.esm:0009E9 QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is the one in alias 0 or the speaker is the one in alias 1 or the speaker is the one in alias 13. **files**

**Gives**: gold (an amount the script works out) (stage 2000, QF_ccBGSSSE001_Crab_MQ4_050009E9.fragment_2).

## 5. Catch of the Day (`ccBGSSSE001_Fish_MQ1`, ccBGSSSE001-Fish.esm:0009DE, Synthesis - Gameplay Overwrite.esp)

**Started by**

- Dialogue with someone the line does not name, "You work here? Can you teach me a few things about fishing?": SetStage 10 (when: Catch of the Day hasn't started). Source: ccBGSSSE001_TIF__0500099D.Fragment_0 on INFO ccBGSSSE001-Fish.esm:00099D (Simple Fishing Overhaul.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: ccBGSSSE001-Fish.esm:0009DE DNAM (Synthesis - Gameplay Overwrite.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Obtain a glassfish". Source: ccBGSSSE001-Fish.esm:0009DE QOBJ 1. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain a carp". Source: ccBGSSSE001-Fish.esm:0009DE QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is the one in alias 0; Angler Acquaintances stage >= 5. **files**

**Gives**: nothing on its completing stages.

## 6. Caught in the Rain (`ccBGSSSE001_Fish_MQ2`, ccBGSSSE001-Fish.esm:0009EB, Synthesis - Gameplay Overwrite.esp)

**Started by**

- ccBGSSSE001_Fish_MQ1 (Catch of the Day) at stage 200 calls Start; its stage 200 is set by Dialogue with someone the line does not name: SetStage 200 (when: Catch of the Day stage == 20 or Catch of the Day stage == 21; GetItemCount Raw Pogfish >= 1; GetItemCount Raw Carp >= 1; GetItemCount Goldfish >= 1; GetItemCount Glassfish >= 1). Source: QF_ccBGSSSE001_Fish_MQ1_050009DE.fragment_3 on ccBGSSSE001-Fish.esm:0009DE (Synthesis - Gameplay Overwrite.esp). **script**
- Dialogue with someone the line does not name, "I'm ready for another fishing challenge. Do you have anything for me?": SetStage 10 (when: Caught in the Rain hasn't started). Source: ccBGSSSE001_TIF__05000A63.Fragment_0 on INFO ccBGSSSE001-Fish.esm:000A63 (Simple Fishing Overhaul.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Obtain a pearlfish". Source: ccBGSSSE001-Fish.esm:0009EB QOBJ 1. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain a catfish". Source: ccBGSSSE001-Fish.esm:0009EB QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is the one in alias 1. **files**

**Gives**: nothing on its completing stages.

## 7. Frozen Fish (`ccBGSSSE001_Fish_MQ3`, ccBGSSSE001-Fish.esm:0009E8, Synthesis - Gameplay Overwrite.esp)

**Started by**

- ccBGSSSE001_Fish_MQ2 (Caught in the Rain) at stage 300 calls Start; its stage 300 is set by Dialogue with someone the line does not name: SetStage 300; Dialogue with someone the line does not name: SetStage 300. Source: QF_ccBGSSSE001_Fish_MQ2_050009EB.fragment_8 on ccBGSSSE001-Fish.esm:0009EB (Synthesis - Gameplay Overwrite.esp). **script**
- (First objective shown at stage 4; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Obtain an arctic char". Source: ccBGSSSE001-Fish.esm:0009E8 QOBJ 1. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain an angler larvae". Source: ccBGSSSE001-Fish.esm:0009E8 QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is the one in alias 2. **files**

**Gives**: nothing on its completing stages.

## 8. Darkest Depths (`ccBGSSSE001_Fish_MQ4`, ccBGSSSE001-Fish.esm:0009DD, Synthesis - Gameplay Overwrite.esp)

**Started by**

- ccBGSSSE001_Fish_MQ3 (Frozen Fish) at stage 200 calls Start; its stage 200 is set by Dialogue with someone the line does not name: SetStage 200 (when: Frozen Fish stage 20 done; GetItemCount Angler Larvae >= 1; GetItemCount Raw Arctic Grayling >= 1; GetItemCount Raw Arctic Char >= 1; GetItemCount Raw Cod >= 1; Frozen Fish stage 200 not done). Source: QF_ccBGSSSE001_Fish_MQ3_050009E8.fragment_4 on ccBGSSSE001-Fish.esm:0009E8 (Synthesis - Gameplay Overwrite.esp). **script**
- Dialogue with someone the line does not name: SetStage 10. Source: ccBGSSSE001_TIF__05000EB4.Fragment_0 on INFO ccBGSSSE001-Fish.esm:000EB4 (Simple Fishing Overhaul.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Obtain a glass catfish". Source: ccBGSSSE001-Fish.esm:0009DD QOBJ 1. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain a direfish". Source: ccBGSSSE001-Fish.esm:0009DD QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is the one in alias 1. **files**

**Gives**: nothing on its completing stages.

## 9. Fishing Legend (`ccBGSSSE001_Fish_MQ5`, ccBGSSSE001-Fish.esm:0009DC, Synthesis - Gameplay Overwrite.esp)

**Started by**

- ccBGSSSE001_Fish_MQ4 (Darkest Depths) at stage 200 calls Start; its stage 200 is set by Dialogue with someone the line does not name: SetStage 200 (when: Darkest Depths stage 20 done; Darkest Depths stage 200 not done; GetItemCount Raw Glass Catfish >= 1; GetItemCount Raw Direfish >= 1; GetItemCount Raw Tripod Spiderfish >= 1; GetItemCount Raw Vampire Fish >= 1). Source: QF_ccBGSSSE001_Fish_MQ4_050009DD.fragment_3 on ccBGSSSE001-Fish.esm:0009DD (Synthesis - Gameplay Overwrite.esp). **script**
- Dialogue with someone the line does not name: SetStage 10. Source: ccBGSSSE001_TIF__05000EE5.Fragment_0 on INFO ccBGSSSE001-Fish.esm:000EE5 (Simple Fishing Overhaul.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Obtain an angler". Source: ccBGSSSE001-Fish.esm:0009DC QOBJ 1. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain an angelfish". Source: ccBGSSSE001-Fish.esm:0009DC QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is the one in alias 1. **files**

**Gives**: nothing on its completing stages.

## 10. Beneath Bronze Waters (`ccBGSSSE001_Misc_Dwarven`, ccBGSSSE001-Fish.esm:000AD6, Synthesis - Gameplay Overwrite.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Read the fisherman's journal", shown at stage 5. Source: ccBGSSSE001-Fish.esm:000AD6 QOBJ 10. **files**
- **unread**: nothing outside its own stage fragments sets stage 5 or one before it.

**Who and where**

- First objective: "Investigate the entrance of Bronze Water Cave". Source: ccBGSSSE001-Fish.esm:000AD6 QOBJ 0. **files**
- Target alias CaveInvestigateMarker (forced): a marker (forced reference, placed in Bronze Water Cave). **files**

**Needs**

- Its own conditions: the speaker is the one in alias 13. **files**
- Ways in: Bronze Water Cave: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 11. Clear-Headed (`ccBGSSSE001_Misc_Falkreath`, ccBGSSSE001-Fish.esm:0009EC, Synthesis - Gameplay Overwrite.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Zaria". Source: ccBGSSSE001-Fish.esm:0009EC QOBJ 10. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain a glassfish for Zaria in Falkreath". Source: ccBGSSSE001-Fish.esm:0009EC QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is the one in alias 0 or the speaker is the one in alias 7. **files**

**Gives**: Ring of Surroundings (stage 200, QF_ccBGSSSE001_Misc_Falkreat_050009EC.fragment_7); Ring of Surroundings (stage 200, QF_ccBGSSSE001_Misc_Falkreat_050009EC.fragment_9).

## 12. Spirits Away (`ccBGSSSE001_Misc_Khajiit`, ccBGSSSE001-Fish.esm:0009E2, Synthesis - Gameplay Overwrite.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Fish up Ri'saad's lost bottles of aged flin (<Global=ccBGSSSE001_MiscKhajiitFlinCount>/<Global=ccBGSSSE001_MiscKhajiitFlinTotal>)", shown at stage 20. Source: ccBGSSSE001-Fish.esm:0009E2 QOBJ 10. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Find the Khajiit caravan's overturned cart west of Old Hroldan Inn". Source: ccBGSSSE001-Fish.esm:0009E2 QOBJ 0. **files**
- Target alias Trigger (forced): a marker (forced reference, placed in Skyrim). **files**

**Needs**

- Its own conditions: the speaker is the one in alias 2. **files**

**Gives**: Replica Ring of Khajiit (stage 200, QF_ccBGSSSE001_Misc_Khajiit_050009E2.fragment_2).

## 13. Private Lessons (`ccBGSSSE001_Misc_Markarth`, ccBGSSSE001-Fish.esm:0009DF, Synthesis - Gameplay Overwrite.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet Lynea on the docks near the Warrens", shown at stage 10. Source: ccBGSSSE001-Fish.esm:0009DF QOBJ 10. **files**
- Dialogue with someone the line does not name, "Sure. We can fish off the docks near the Warrens.": SetStage 10. Reply: "Of course... I'll see you there soon." Source: ccBGSSSE001_TIF__05000B60.Fragment_0 on INFO ccBGSSSE001-Fish.esm:000B60 (Simple Fishing Overhaul.esp). **script**

**Who and where**

- First objective: "Speak to Lynea about private fishing lessons". Source: ccBGSSSE001-Fish.esm:0009DF QOBJ 0. **files**
- Target alias Student (forced): Lynea (forced reference, placed in Silver-Blood Inn). **files**

**Needs**

- Its own conditions: the speaker is the one in alias 0. **files**
- Ways in: Silver-Blood Inn: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Lynea's Amulet of Dibella (stage 200, QF_ccBGSSSE001_Misc_Markarth_050009DF.fragment_11).

## 14. No Contest (`ccBGSSSE001_Misc_Morthal`, ccBGSSSE001-Fish.esm:0009E4, Synthesis - Gameplay Overwrite.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet Brutius at the fishing spot", shown at stage 10. Source: ccBGSSSE001-Fish.esm:0009E4 QOBJ 10. **files**
- Dialogue with someone the line does not name: SetStage 10. Reply: "Here's where you need to go." Source: ccBGSSSE001_TIF__05000B5C.Fragment_0 on INFO ccBGSSSE001-Fish.esm:000B5C (ccBGSSSE001-Fish.esm). **script**

**Who and where**

- First objective: "Talk to Brutius in Morthal about a fishing contest". Source: ccBGSSSE001-Fish.esm:0009E4 QOBJ 0. **files**
- Target alias OldMan (forced): Brutius (forced reference, placed in Morthal). **files**

**Needs**

- Its own conditions: the speaker is the one in alias 1. **files**
- Ways in: Morthal: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 15. The Ultimate Feast (`ccBGSSSE001_Misc_Solitude`, ccBGSSSE001-Fish.esm:0009E3, Synthesis - Gameplay Overwrite.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Obtain a cooked arctic char". Source: ccBGSSSE001-Fish.esm:0009E3 QOBJ 1. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain a pair of steamed crab legs". Source: ccBGSSSE001-Fish.esm:0009E3 QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is the one in alias 1. **files**

**Gives**: nothing on its completing stages.

## 16. Heart of Gold (`ccBGSSSE001_Misc_WhiterunPartOne`, ccBGSSSE001-Fish.esm:000E5D, Synthesis - Gameplay Overwrite.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Mila Valentia". Source: ccBGSSSE001-Fish.esm:000E5D QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain a goldfish for Mila Valentia in Whiterun". Source: ccBGSSSE001-Fish.esm:000E5D QOBJ 0. **files**
- Target alias Child (unique): Mila Valentia (unique actor, placed in Carlotta Valentia's House). **files**

**Needs**

- Its own conditions: the speaker is the one in alias 0. **files**
- Ways in: Carlotta Valentia's House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 17. Two of a Kind (`ccBGSSSE001_Misc_WhiterunPartTwo`, ccBGSSSE001-Fish.esm:0009D7, Synthesis - Gameplay Overwrite.esp)

**Started by**

- ccBGSSSE001_Misc_WhiterunPartOne (Heart of Gold) at stage 200 calls Start; its stage 200 is set by Dialogue with someone the line does not name: SetStage 200 (when: Heart of Gold stage == 40). Source: QF_ccBGSSSE001_Misc_Whiterun_05000E5D.fragment_5 on ccBGSSSE001-Fish.esm:000E5D (Synthesis - Gameplay Overwrite.esp). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Mila Valentia". Source: ccBGSSSE001-Fish.esm:0009D7 QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Find another goldfish for Mila Valentia". Source: ccBGSSSE001-Fish.esm:0009D7 QOBJ 0. **files**
- Target alias Child (unique): Mila Valentia (unique actor, placed in Carlotta Valentia's House). **files**

**Needs**

- Its own conditions: the speaker is the one in alias 0. **files**
- Ways in: Carlotta Valentia's House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 18. Tusked Terror (`ccBGSSSE001_Misc_Windhelm`, ccBGSSSE001-Fish.esm:0009D5, Synthesis - Gameplay Overwrite.esp)

**Started by**

- ccBGSSSE001_MiscQuests (named "Miscellaneous Quests Handler" in its record), a helper quest with Viriya calls at stage 45 SetStage 10; at stage 43 Start; ccBGSSSE001_MiscQuests is started by dialogue with Viriya (Start). Sources: QF_ccBGSSSE001_MiscQuests_050009E6.fragment_14, QF_ccBGSSSE001_MiscQuests_050009E6.fragment_22 on ccBGSSSE001-Fish.esm:0009E6. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Place an arctic grayling at Fangtusk's feeding grounds". Source: ccBGSSSE001-Fish.esm:0009D5 QOBJ 10. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain an arctic grayling". Source: ccBGSSSE001-Fish.esm:0009D5 QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is the one in alias 0. **files**

**Gives**: nothing on its completing stages.

## 19. Stocking Up (`ccBGSSSE001_Radiant_1`, ccBGSSSE001-Fish.esm:000B98, Synthesis - Gameplay Overwrite.esp)

**Started by**

- Dialogue with someone the line does not name: Start. Source: ccBGSSSE001_TIF__05000E5B.Fragment_1 on INFO ccBGSSSE001-Fish.esm:000E5B (Simple Fishing Overhaul.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Obtain <Global=ccBGSSSE001_RadiantObjTotal> salmon for <Alias.ShortName=Innkeeper> in <Alias=Town> (<Global=ccBGSSSE001_RadiantObjCount>/<Global=ccBGSSSE001_RadiantObjTotal>)". Source: ccBGSSSE001-Fish.esm:000B98 QOBJ 1. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain <Global=ccBGSSSE001_RadiantObjTotal> brook bass for <Alias.ShortName=Innkeeper> in <Alias=Town> (<Global=ccBGSSSE001_RadiantObjCount>/<Global=ccBGSSSE001_RadiantObjTotal>)". Source: ccBGSSSE001-Fish.esm:000B98 QOBJ 0. **files**
- Target alias Innkeeper (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: the speaker is the one in alias 0. **files**

**Gives**: nothing on its completing stages.

## 20. Further Study (`ccBGSSSE001_Radiant_2`, ccBGSSSE001-Fish.esm:000C2F, Synthesis - Gameplay Overwrite.esp)

**Started by**

- Dialogue with someone the line does not name: Start. Source: ccBGSSSE001_TIF__05000E5C.Fragment_1 on INFO ccBGSSSE001-Fish.esm:000E5C (Simple Fishing Overhaul.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Obtain an angler larvae for <Alias=Alchemist> in <Alias=Town> (<Global=ccBGSSSE001_RadiantObjCount>/<Global=ccBGSSSE001_RadiantObjTotal>)". Source: ccBGSSSE001-Fish.esm:000C2F QOBJ 1. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Obtain a pygmy sunfish for <Alias=Alchemist> in <Alias=Town> (<Global=ccBGSSSE001_RadiantObjCount>/<Global=ccBGSSSE001_RadiantObjTotal>)". Source: ccBGSSSE001-Fish.esm:000C2F QOBJ 0. **files**
- Target alias Alchemist (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: the speaker is the one in alias 0. **files**

**Gives**: nothing on its completing stages.

## 21. Rubbish Retrieval (`ccBGSSSE001_Radiant_3`, ccBGSSSE001-Fish.esm:000C8C, Synthesis - Gameplay Overwrite.esp)

**Started by**

- Dialogue with someone the line does not name: Start. Source: ccBGSSSE001_TIF__05000E5E.Fragment_1 on INFO ccBGSSSE001-Fish.esm:000E5E (Simple Fishing Overhaul.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>". Source: ccBGSSSE001-Fish.esm:000C8C QOBJ 50. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Fish up <Global=ccBGSSSE001_RadiantObjTotal> items from the water in <Alias=Town> (<Global=ccBGSSSE001_RadiantObjCount>/<Global=ccBGSSSE001_RadiantObjTotal>)". Source: ccBGSSSE001-Fish.esm:000C8C QOBJ 0. **files**
- Target alias FishingSpot (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: the speaker is the one in alias 0 or the speaker is the one in alias 1. **files**

**Gives**: nothing on its completing stages.

## 22. First Catch (`ccBGSSSE001_Start_MQ1`, ccBGSSSE001-Fish.esm:0009D3, Synthesis - Gameplay Overwrite.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Equip a fishing rod", shown at stage 15. Source: ccBGSSSE001-Fish.esm:0009D3 QOBJ 5. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Visit the fishing camp south of Riverwood". Source: ccBGSSSE001-Fish.esm:0009D3 QOBJ 0. **files**
- Target alias CampMarker (forced): a marker (forced reference, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 23. Angler Acquaintances (`ccBGSSSE001_Start_MQ2`, ccBGSSSE001-Fish.esm:0009DB, Synthesis - Gameplay Overwrite.esp)

**Started by**

- ccBGSSSE001_FishingSystemQuest (named "Fishing System Quest" in its record), a helper quest calls Start; Start; Start; Start; Start; Start; Start; Start; Start; ccBGSSSE001_FishingSystemQuest is started by the start-game flag. Sources: ccBGSSSE001_FishingSystemScript.CatchSuccess, ccBGSSSE001_FishingSystemScript.OnFishingTriggerActivated, ccBGSSSE001_FishingSystemScript.TryToStartQuestAfterFirstCatch, ccBGSSSE001_FishingSystemScript.OnUpdate, ccBGSSSE001_FishingSystemScript.reel_line_known_result, ccBGSSSE001_FishingSystemScript.ReelLine on ccBGSSSE001-Fish.esm:033A57. **script**
- ccBGSSSE001_Start_MQ1 (First Catch) at stage 50 calls Start. Source: QF_ccBGSSSE001_Start_MQ1_050009D3.fragment_5 on ccBGSSSE001-Fish.esm:0009D3 (Synthesis - Gameplay Overwrite.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Viriya", shown at stage 5. Source: ccBGSSSE001-Fish.esm:0009DB QOBJ 10. **files**
- Dialogue with Keerava, placed in The Bee and Barb, Bee and Barb, "I'd like to learn about fishing. Could you help me?": SetStage 5 (when: the speaker is Keerava; Angler Acquaintances stage < 5; GetQuestRunning Angler Acquaintances == 1). Reply: "Oh yes. Take a look at the Riften fishery." Source: ANDR_CCFishDelay_DialogScript.Fragment_1 on INFO CC Fishing - Delayed Start.esp:000803 (CC Fishing - Delayed Start.esp). **script**

**Who and where**

- First objective: "Gather information on fishing". Source: ccBGSSSE001-Fish.esm:0009DB QOBJ 0. **files**
- Target alias Fishery (forced): Keerava (forced reference, placed in The Bee and Barb, Bee and Barb). **files**

**Needs**

- Its own conditions: the speaker is Viriya. **files**
- Ways in: The Bee and Barb, Bee and Barb: 5 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

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

### dialogue INFO ccBGSSSE001-Fish.esm:000E7B

- Speaker: Viriya (Redguard), placed in Riften Fishery. Named by: the one follower in ccBGSSSE001_Crab_MQ1 (In A Pinch)'s aliases.
- The player's prompt: "What's wrong?".
- The reply: "Listen, if you want to help... Here, take a look. Don't ask. Just take it. Maybe you can figure it out.".
- When it's offered: no conditions.
- What it does: SetStage 10 on ccBGSSSE001_Crab_MQ1 (In A Pinch). Source: ccBGSSSE001_TIF__05000E7B.Fragment_1 on INFO ccBGSSSE001-Fish.esm:000E7B (Simple Fishing Overhaul.esp); topic ccBGSSSE001_Crab_MQ1_PreStartTopic. **script**
- In one sentence: Talk to Viriya (Redguard) in Riften Fishery and choose "What's wrong?": SetStage 10 on ccBGSSSE001_Crab_MQ1 (In A Pinch).

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
