# Start check: Neloth of Tel Mithryn (`tel-mithryn`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Reluctant Steward (`DLC2TT1`, Dragonborn.esm:017E8D, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Neloth (named by alias Neloth of DLC2TT1 (Reluctant Steward) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "No, I haven't seen Varona.": SetStage 150 (when: the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1). Source: DLC2_TIF__02017E6D.Fragment_0 on INFO Dragonborn.esm:017E6D (Dragonborn.esm). **script**
- Dialogue with Varona Nelas, placed in Tel Mithryn Steward's House, Tel Mithryn Steward: SetStage 90 (when: the speaker is Varona Nelas; the speaker is Prisoner). Source: DLC2_TIF__02017E7F.Fragment_0 on INFO Dragonborn.esm:017E7F (Dragonborn.esm). **script**
- (First objective shown at stage 150; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC2TT2 (Old Friends) at stage 0 calls SetStage 100. Source: DLC2_QF_DLC2TT2_020195A1.fragment_11 (Dragonborn.esm).
- DLC2TT2 (Old Friends) at stage 0 calls SetStage 500. Source: DLC2_QF_DLC2TT2_020195A1.fragment_11 (Dragonborn.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell Neloth that Varona is dead", shown at stage 200. Source: Dragonborn.esm:017E8D QOBJ 200. **files**
- DLC2TT1 (Reluctant Steward) calls SetStage 200. Source: DLC2TT1VaronaScript.OnActivate on Dragonborn.esm:017E8D (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Ulves Romoran, placed in Tel Mithryn Kitchen, "Have you seen Varona?": SetStage 170 (when: the speaker is Ulves Romoran; Reluctant Steward stage >= 150; Reluctant Steward stage <= 170). Reply: "Is it tea time already?" Source: DLC2_TIF__02017E72.Fragment_0 on INFO Dragonborn.esm:017E72 (Dragonborn.esm). **script**
- Dialogue with Elynea Mothren, placed in Tel Mithryn Apothecary, "Have you seen Varona?": SetStage 170 (when: the speaker is Elynea Mothren; Reluctant Steward stage >= 150; Reluctant Steward stage <= 170). Reply: "She left for Raven Rock hours ago. She promised to bring me back some fresh blisterwort." Source: DLC2_TIF__02017E73.Fragment_0 on INFO Dragonborn.esm:017E73 (Dragonborn.esm). **script**

**Who and where**

- First objective: "Find Varona". Source: Dragonborn.esm:017E8D QOBJ 150. **files**
- Target alias Varona (unique): Varona Nelas (unique actor, placed in Tel Mithryn Steward's House, Tel Mithryn Steward). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Tel Mithryn Steward's House, Tel Mithryn Steward: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: 500 gold (stage 500, DLC2_QF_DLC2TT1_02017E8D.fragment_13); Staff Enchanter Key (stage 500, DLC2_QF_DLC2TT1_02017E8D.fragment_13).

## 2. A New Debt (`DLC2TT1b`, Dragonborn.esm:01844E, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC2TT1 (Reluctant Steward) at stage 500 calls Start. Source: DLC2_QF_DLC2TT1_02017E8D.fragment_13 on Dragonborn.esm:017E8D (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Pay Mogrul", shown at stage 200. Source: Dragonborn.esm:01844E QOBJ 200. **files**
- Dialogue with Mogrul (named by alias Mogrul of DLC2TT1b (A New Debt) (unique)), placed in The Retching Netch, "Situation? What kind of situation?": SetStage 200 (when: the speaker is the one in alias Mogrul; A New Debt stage <= 100). Reply: "Drovas Relvi owes me 1000 septims." Source: DLC2_TIF__02019584.Fragment_0 on INFO Dragonborn.esm:019584 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Talk to Mogrul". Source: Dragonborn.esm:01844E QOBJ 100. **files**
- Target alias Mogrul (unique): Mogrul (unique actor, placed in The Retching Netch). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Retching Netch: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. Old Friends (`DLC2TT2`, Dragonborn.esm:0195A1, Dragonborn.esm)

**Started by**

- Dialogue with Neloth (named by alias Neloth of DLC2TT2 (Old Friends) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "I suppose you want me to kill them.": SetStage 100 (when: the speaker is the one in alias Neloth). Source: DLC2_TIF__0201956D.Fragment_0 on INFO Dragonborn.esm:01956D (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Neloth (named by alias Neloth of DLC2TT2 (Old Friends) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "Would I be able to collect a bounty?": SetStage 100 (when: the speaker is the one in alias Neloth). Source: DLC2_TIF__020279E0.Fragment_1 on INFO Dragonborn.esm:0279E0 (Dragonborn.esm). **script**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC2TTR5 (Briarheart Necropsy) at stage 300 calls Start. Source: DLC2_QF_DLC2TTR5_0201C05C.fragment_2 (Dragonborn.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Neloth", shown at stage 200. Source: Dragonborn.esm:0195A1 QOBJ 200. **files**
- DLC2TT2 (Old Friends) calls SetStage 200. Source: DLC2TT2HeartStoneScript.OnContainerChanged on Dragonborn.esm:0195A1 (Dragonborn.esm). **script**

**Who and where**

- First objective: "Find the source of the attacks". Source: Dragonborn.esm:0195A1 QOBJ 100. **files**
- Target alias HeartStone (forced): Heart Stone (forced reference, placed in Morrowind). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: DLC2LootStaffsAllBest (levelled: an item) (stage 600, DLC2_QF_DLC2TT2_020195A1.fragment_10).

## 4. From the Ashes (`DLC2TTF1`, Dragonborn.esm:01AAB0, Dragonborn.esm)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Talvas Fathryon (named by alias Talvas of DLC2TTF1 (From the Ashes) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "I can destroy it for you.": SetStage 100 (when: the speaker is the one in alias Talvas; fn359 == 1). Source: DLC2_TIF__0201AA99.Fragment_0 on INFO Dragonborn.esm:01AA99 (Dragonborn.esm). **script**
- Dialogue with Talvas Fathryon (named by alias Talvas of DLC2TTF1 (From the Ashes) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "I can destroy it for you.": SetStage 100 (when: the speaker is the one in alias Talvas; fn359 == 0). Source: DLC2_TIF__0203C336.Fragment_0 on INFO Dragonborn.esm:03C336 (Dragonborn.esm). **script**
- Dialogue with Talvas Fathryon (named by alias Talvas of DLC2TTF1 (From the Ashes) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "What's the problem?": SetStage 50 (when: the speaker is the one in alias Talvas; From the Ashes stage == 30). Source: DLC2_TIF__0201AA9A.Fragment_0 on INFO Dragonborn.esm:01AA9A (Dragonborn.esm). **script**
- Dialogue with Talvas Fathryon (named by alias Talvas of DLC2TTF1 (From the Ashes) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "It's your mess. You clean it up.": SetStage 100 (when: the speaker is the one in alias Talvas). Source: DLC2_TIF__02034BFB.Fragment_0 on INFO Dragonborn.esm:034BFB (Dragonborn.esm). **script**
- Dialogue with Varona Nelas (named by scene DLC2TTF1IntroScene, alias Varona of DLC2TTF1 (From the Ashes) (unique)), placed in Tel Mithryn Steward's House, Tel Mithryn Steward: SetStage 10 (when: fn359 == 1 or fn359 == 1). Source: DLC2_TIF__02035537.Fragment_0 on INFO Dragonborn.esm:035537 (Dragonborn.esm). **script**
- Dialogue with Varona Nelas (named by scene DLC2TTF1IntroScene, alias Varona of DLC2TTF1 (From the Ashes) (unique)), placed in Tel Mithryn Steward's House, Tel Mithryn Steward: SetStage 10 (when: fn359 == 0). Source: DLC2_TIF__0203A2FF.Fragment_0 on INFO Dragonborn.esm:03A2FF (Dragonborn.esm). **script**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Talvas", shown at stage 200. Source: Dragonborn.esm:01AAB0 QOBJ 200. **files**
- DLC2TTF1 (From the Ashes) calls SetStage 200. Source: DLC2TTF1AshGuardianScript.OnDeath on Dragonborn.esm:01AAB0 (Dragonborn.esm). **script**

**Who and where**

- First objective: "Destroy the Ash Guardian". Source: Dragonborn.esm:01AAB0 QOBJ 100. **files**
- Target alias AshGuardian (unique): Dragonborn.esm:01AAB2 (unique actor, placed in Tel Mithryn). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 5. Healing a House (`DLC2TTF2`, Dragonborn.esm:01AAC8, Dragonborn.esm)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Elynea Mothren (named by alias Elynea of DLC2TTF2 (Healing a House) (unique)), placed in Tel Mithryn Apothecary, "What do you need to fix the tower?": SetStage 100 (when: the speaker is the one in alias Elynea). Source: DLC2_TIF__0201AAA3.Fragment_0 on INFO Dragonborn.esm:01AAA3 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Soak the taproots", shown at stage 100. Source: Dragonborn.esm:01AAC8 QOBJ 110. **files**
- **unread**: nothing outside its own stage fragments sets stage 100 or one before it.

**Who and where**

- First objective: "Get three taproots (<global=DLC2TTF2TaprootsAcquired>/3)". Source: Dragonborn.esm:01AAC8 QOBJ 100. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: DLC2LItemPotionRestoreAllBest (levelled: an item) x2 (stage 500, DLC2_QF_DLC2TTF2_0201AAC8.fragment_6).

## 6. Lost Knowledge (`DLC2TTR1`, Dragonborn.esm:01B65F, UndeathFixes.esp)

**Started by**

- Dialogue with Neloth (named by alias Neloth of DLC2TTR1 (Lost Knowledge) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "Have you found any other black books?": SetStage 100 (when: the speaker is the one in alias Neloth; Lost Knowledge stage < 100; fn67 == 1). Source: DLC2_TIF__0201B635.Fragment_0 on INFO Dragonborn.esm:01B635 (Dragonborn.esm). **script**
- Dialogue with Neloth, placed in Tel Mithryn, Tel Mithryn Tower, "Is there anything else?": SetStage 100 (when: the speaker is Neloth; GetQuestRunning Lost Knowledge == 1; Lost Knowledge stage < 100). Source: DLC2_TIF__02038A73.Fragment_0 on INFO Dragonborn.esm:038A73 (Dragonborn.esm). **script**
- Story manager node DLC2BlackBookQuestNode, event: change location; conditions up its parents: fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC2BlackBookQuestNode Dragonborn.esm:020689 (Dragonborn.esm). **files**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Neloth", shown at stage 200. Source: Dragonborn.esm:01B65F QOBJ 200. **files**
- **unread**: nothing outside its own stage fragments sets stage 200 or one before it.

**Who and where**

- First objective: "Retrieve the Black Book". Source: Dragonborn.esm:01B65F QOBJ 100. **files**
- Target alias ApocryphaBook (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: global DLC2PreventNelothRadiant == 0 (now 0); The Gardener of Men completed; Reluctant Steward stage != 100; Reluctant Steward stage != 210; Reluctant Steward stage < 400 or Briarheart Necropsy stage >= 100. **files**
- Global DLC2PreventNelothRadiant: record 0.0 (Dragonborn.esm). **files**

**Gives**: 1000 gold (stage 300, DLC2_QF_DLC2TTR1_0201B65F.fragment_0).

## 7. Heart Stones (`DLC2TTR2`, Dragonborn.esm:01C06E, Dragonborn.esm)

**Started by**

- Dialogue with Neloth (named by alias Neloth of DLC2TTR2 (Heart Stones) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "Can I help with your research?": SetStage 100 (when: the speaker is the one in alias Neloth; fn67 == 1; Heart Stones stage < 100; GetQuestRunning Briarheart Necropsy == 0 or Briarheart Necropsy stage >= 100). Source: DLC2_TIF__0201C053.Fragment_0 on INFO Dragonborn.esm:01C053 (Dragonborn.esm). **script**
- Story manager node DLC2NelothQuestNode, event: change location; conditions up its parents: fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC2NelothQuestNode Dragonborn.esm:020687 (Dragonborn.esm). **files**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Neloth", shown at stage 200. Source: Dragonborn.esm:01C06E QOBJ 200. **files**
- DLC2TTR2 (Heart Stones) calls SetStage 200. Source: DLC2TTR2PlayerScript.OnItemAdded on Dragonborn.esm:01C06E (Dragonborn.esm). **script**

**Who and where**

- First objective: "Get a Heart Stone". Source: Dragonborn.esm:01C06E QOBJ 100. **files**
- Target alias MineMapMarker (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: global DLC2PreventNelothRadiant == 0 (now 0); Reluctant Steward stage != 100; Reluctant Steward stage != 210; Reluctant Steward stage < 400 or Briarheart Necropsy stage >= 100. **files**
- Global DLC2PreventNelothRadiant: record 0.0 (Dragonborn.esm). **files**

**Gives**: 250 gold (stage 300, DLC2_QF_DLC2TTR2_0201C06E.fragment_2).

## 8. Telvanni Research (`DLC2TTR3a`, Dragonborn.esm:01B65D, Dragonborn.esm)

**Started by**

- Dialogue with Neloth (named by alias Neloth of DLC2TTR3a (Telvanni Research) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "Can I help with your research?": SetStage 100 (when: the speaker is the one in alias Neloth; fn359 == 1; Telvanni Research stage < 100; GetQuestRunning Briarheart Necropsy == 0 or Briarheart Necropsy stage >= 100). Source: DLC2_TIF__0201CDCD.Fragment_0 on INFO Dragonborn.esm:01CDCD (Dragonborn.esm). **script**
- Story manager node DLC2NelothQuestNode, event: change location; conditions up its parents: fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC2NelothQuestNode Dragonborn.esm:020687 (Dragonborn.esm). **run time**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Neloth", shown at stage 200. Source: Dragonborn.esm:01B65D QOBJ 200. **files**
- **unread**: nothing outside its own stage fragments sets stage 200 or one before it.

**Who and where**

- First objective: "Collect ash from an ash spawn". Source: Dragonborn.esm:01B65D QOBJ 100. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: global DLC2PreventNelothRadiant == 0 (now 0); Reluctant Steward stage != 100; Reluctant Steward stage != 210; global DLC2TT3aRun == 0 (now 0); fn277 >= PCConjurationAdept (now 100); Reluctant Steward stage < 400 or Briarheart Necropsy stage >= 100. **files**
- Global DLC2PreventNelothRadiant: record 0.0 (Dragonborn.esm). **files**
- Global DLC2TT3aRun: record 0.0 (Dragonborn.esm); at run time script DLC2_QF_DLC2TTR3a_0201B65D:  = 1. **run time**
- Global PCConjurationAdept: record 100.0 (Skyrim.esm); at run time script WISkillIncrease02:  = 0. **run time**

**Gives**: 250 gold (stage 300, DLC2_QF_DLC2TTR3a_0201B65D.fragment_2).

## 9. Wind and Sand (`DLC2TTR3b`, Dragonborn.esm:01D8D1, Dragonborn.esm)

**Started by**

- Dialogue with Neloth (named by alias Neloth of DLC2TTR3b (Wind and Sand) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "Can I help with your research?": SetStage 100 (when: the speaker is the one in alias Neloth; fn67 == 1; Wind and Sand stage < 100; GetQuestRunning Briarheart Necropsy == 0 or Briarheart Necropsy stage >= 100). Source: DLC2_TIF__0201D8CF.Fragment_0 on INFO Dragonborn.esm:01D8CF (Dragonborn.esm). **script**
- Story manager node DLC2NelothQuestNode, event: change location; conditions up its parents: fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC2NelothQuestNode Dragonborn.esm:020687 (Dragonborn.esm). **run time**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Neloth", shown at stage 200. Source: Dragonborn.esm:01D8D1 QOBJ 200. **files**
- **unread**: nothing outside its own stage fragments sets stage 200 or one before it.

**Who and where**

- First objective: "Get the Wind and Sand book". Source: Dragonborn.esm:01D8D1 QOBJ 100. **files**
- Target alias Book (created): Wind and Sand (created item). **files**
- Target alias SkyrimMapMarker (forced): a marker (forced reference, placed in Morrowind). **files**

**Needs**

- Its own conditions: global DLC2PreventNelothRadiant == 0 (now 0); Reluctant Steward stage != 100; Reluctant Steward stage != 210; global DLC2TT3bRun == 0 (now 0); fn277 >= PCDestructionAdept (now 100); Experimental Subject completed; Reluctant Steward stage < 400 or Briarheart Necropsy stage >= 100. **files**
- Ways in: Morrowind: 1 door, 0 locked. A door is a need only when every way in is locked. **files**
- Global DLC2PreventNelothRadiant: record 0.0 (Dragonborn.esm). **files**
- Global DLC2TT3bRun: record 0.0 (Dragonborn.esm); at run time script DLC2_QF_DLC2TTR3b_0201D8D1:  = 1. **run time**
- Global PCDestructionAdept: record 100.0 (Skyrim.esm); at run time script WISkillIncrease02:  = 0. **run time**

**Gives**: 250 gold (stage 300, DLC2_QF_DLC2TTR3b_0201D8D1.fragment_2).

## 10. Experimental Subject (`DLC2TTR4a`, Dragonborn.esm:01B664, Dragonborn.esm)

**Started by**

- Story manager node DLC2NelothQuestNode, event: change location; conditions up its parents: fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC2NelothQuestNode Dragonborn.esm:020687 (Dragonborn.esm). **run time**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Neloth", shown at stage 200. Source: Dragonborn.esm:01B664 QOBJ 200. **files**
- DLC2TTR4a (Experimental Subject) calls SetStage 200. Source: DLC2TTR4aPlayerScript.OnUpdate on Dragonborn.esm:01B664 (Dragonborn.esm). **script**
- DLC2TTR4a (Experimental Subject) calls SetStage 200. Source: DLC2TTR4aPlayerScript.OnLocationChange on Dragonborn.esm:01B664 (Dragonborn.esm). **script**

**Who and where**

- First objective: "Watch for side effects". Source: Dragonborn.esm:01B664 QOBJ 100. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: global DLC2PreventNelothRadiant == 0 (now 0); Reluctant Steward stage != 100; Reluctant Steward stage != 210; global DLC2TT4aRun == 0 (now 0); Reluctant Steward stage < 400 or Briarheart Necropsy stage >= 100. **files**
- Global DLC2PreventNelothRadiant: record 0.0 (Dragonborn.esm). **files**
- Global DLC2TT4aRun: record 0.0 (Dragonborn.esm); at run time script DLC2_QF_DLC2TTR4a_0201B664:  = 1; script DLC2_QF_DLC2TTR4a_0201B664:  = 1. **run time**

**Gives**: 250 gold (stage 300, DLC2_QF_DLC2TTR4a_0201B664.fragment_3).

## 11. Experimental Subject (`DLC2TTR4b`, Dragonborn.esm:01CDE1, Dragonborn.esm)

**Started by**

- Dialogue with Neloth (named by alias Neloth of DLC2TTR4b (Experimental Subject) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "I suppose so.": SetStage 100 (when: the speaker is the one in alias Neloth). Source: DLC2_TIF__0201CDD0.Fragment_1 on INFO Dragonborn.esm:01CDD0 (Dragonborn.esm). **script**
- Story manager node DLC2NelothQuestNode, event: change location; conditions up its parents: fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC2NelothQuestNode Dragonborn.esm:020687 (Dragonborn.esm). **run time**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Help Neloth with his research". Source: Dragonborn.esm:01CDE1 QOBJ 150. **files**
- Target alias Neloth (unique): Neloth (unique actor, placed in Tel Mithryn, Tel Mithryn Tower). **files**

**Needs**

- Its own conditions: global DLC2PreventNelothRadiant == 0 (now 0); Reluctant Steward stage != 100; Reluctant Steward stage != 210; GetQuestRunning Dragonborn == 0; global DLC2TT4bRun == 0 (now 0); global DLC2TTR7DoneOnce > 0 (now 0); Reluctant Steward stage < 400 or Briarheart Necropsy stage >= 100. **files**
- Ways in: Tel Mithryn, Tel Mithryn Tower: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**
- Global DLC2PreventNelothRadiant: record 0.0 (Dragonborn.esm). **files**
- Global DLC2TTR7DoneOnce: record 0.0 (Dragonborn.esm); at run time script DLC2_QF_DLC2TTR7_0201BD18:  = 1. **run time**
- Global DLC2TT4bRun: record 0.0 (Dragonborn.esm); at run time script DLC2_QF_DLC2TTR4b_0201CDE1:  = 1; script DLC2_QF_DLC2TTR4b_0201CDE1:  = 1. **run time**

**Gives**: 250 gold (stage 200, DLC2_QF_DLC2TTR4b_0201CDE1.fragment_3).

## 12. Briarheart Necropsy (`DLC2TTR5`, Dragonborn.esm:01C05C, Dragonborn.esm)

**Started by**

- DLC2TT1 (Reluctant Steward) at stage 500 calls Start. Source: DLC2_QF_DLC2TT1_02017E8D.fragment_13 on Dragonborn.esm:017E8D (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Neloth (named by alias Neloth of DLC2TTR5 (Briarheart Necropsy) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "What about them?": SetStage 100 (when: the speaker is the one in alias Neloth). Source: DLC2_TIF__0201C056.Fragment_0 on INFO Dragonborn.esm:01C056 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Neloth", shown at stage 200. Source: Dragonborn.esm:01C05C QOBJ 200. **files**
- On the way, a line of its own starts a scene while it is at its first objective: Dialogue with Neloth (named by alias Neloth of DLC2TTR5 (Briarheart Necropsy) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "I examined the Briarheart warrior.": StartScene (when: the speaker is the one in alias Neloth; Briarheart Necropsy stage == 200) (scene Dragonborn.esm:03D301). Source: DLC2_TIF__0201C04B.Fragment_1 on INFO Dragonborn.esm:01C04B (Unofficial Skyrim Special Edition Patch.esp). **script**
- **unread**: nothing outside its own stage fragments sets stage 200 or one before it.

**Who and where**

- First objective: "Examine a Briarheart warrior". Source: Dragonborn.esm:01C05C QOBJ 100. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 250 gold (stage 300, DLC2_QF_DLC2TTR5_0201C05C.fragment_2).

## 13. Azra's Staffs (`DLC2TTR7`, Dragonborn.esm:01BD18, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Neloth (named by alias Neloth of DLC2TTR7 (Azra's Staffs) (unique)), placed in Tel Mithryn, Tel Mithryn Tower, "Can I help with your research?": SetStage 100 (when: the speaker is the one in alias Neloth; fn67 == 1; Azra's Staffs stage < 100; GetQuestRunning Briarheart Necropsy == 0 or Briarheart Necropsy stage >= 100). Source: DLC2_TIF__0201BCF7.Fragment_0 on INFO Dragonborn.esm:01BCF7 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Story manager node DLC2NelothQuestNode, event: change location; conditions up its parents: fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: DLC2NelothQuestNode Dragonborn.esm:020687 (Dragonborn.esm). **files**
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Neloth", shown at stage 200. Source: Dragonborn.esm:01BD18 QOBJ 200. **files**
- **unread**: nothing outside its own stage fragments sets stage 200 or one before it.

**Who and where**

- First objective: "Get the staff". Source: Dragonborn.esm:01BD18 QOBJ 100. **files**
- Target alias Staff (created): Dragonborn.esm:019B92 (created item). **files**
- Target alias SkyrimMapMarker (forced): a marker (forced reference, placed in Morrowind). **files**

**Needs**

- Its own conditions: global DLC2PreventNelothRadiant == 0 (now 0); Reluctant Steward stage != 100; Reluctant Steward stage != 210; Reluctant Steward stage < 400 or Briarheart Necropsy stage >= 100. **files**
- Ways in: Morrowind: 1 door, 0 locked. A door is a need only when every way in is locked. **files**
- Global DLC2PreventNelothRadiant: record 0.0 (Dragonborn.esm). **files**

**Gives**: DLC2LootStaffsAllBest (levelled: an item) (stage 300, DLC2_QF_DLC2TTR7_0201BD18.fragment_2).

## 14. Hunting and Gathering (`DLC2TTR8`, Dragonborn.esm:01F13B, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Elynea Mothren (named by alias Elynea of DLC2TTR8 (Hunting and Gathering) (unique)), placed in Tel Mithryn Apothecary, "I've got a daedra heart.": SetStage 100 (when: the speaker is the one in alias Elynea; global DLC2TTR8Ingredient == 1 (now 0); GetItemCount Daedra Heart >= 1; Hunting and Gathering stage == 75). Source: DLC2_TIF__0201F12C.Fragment_1 on INFO Dragonborn.esm:01F12C (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Elynea Mothren (named by alias Elynea of DLC2TTR8 (Hunting and Gathering) (unique)), placed in Tel Mithryn Apothecary, "I've got a giant's toe.": SetStage 100 (when: the speaker is the one in alias Elynea; global DLC2TTR8Ingredient == 2 (now 0); GetItemCount Giant's Toe >= 1; Hunting and Gathering stage == 75). Source: DLC2_TIF__0201F12D.Fragment_1 on INFO Dragonborn.esm:01F12D (Dragonborn.esm). **script**
- Dialogue with Elynea Mothren (named by alias Elynea of DLC2TTR8 (Hunting and Gathering) (unique)), placed in Tel Mithryn Apothecary, "I've found a hagraven claw.": SetStage 100 (when: the speaker is the one in alias Elynea; global DLC2TTR8Ingredient == 3 (now 0); GetItemCount Hagraven Claw >= 1; Hunting and Gathering stage == 75). Source: DLC2_TIF__0201F12E.Fragment_1 on INFO Dragonborn.esm:01F12E (Dragonborn.esm). **script**
- Dialogue with Elynea Mothren (named by alias Elynea of DLC2TTR8 (Hunting and Gathering) (unique)), placed in Tel Mithryn Apothecary, "I have some vampire dust.": SetStage 100 (when: the speaker is the one in alias Elynea; global DLC2TTR8Ingredient == 4 (now 0); GetItemCount Vampire Dust >= 1; Hunting and Gathering stage == 75). Source: DLC2_TIF__0201F12F.Fragment_1 on INFO Dragonborn.esm:01F12F (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Elynea Mothren (named by alias Elynea of DLC2TTR8 (Hunting and Gathering) (unique)), placed in Tel Mithryn Apothecary, "I have a briarheart.": SetStage 100 (when: the speaker is the one in alias Elynea; global DLC2TTR8Ingredient == 5 (now 0); GetItemCount Briar Heart >= 1; Hunting and Gathering stage == 75). Source: DLC2_TIF__0201F130.Fragment_1 on INFO Dragonborn.esm:01F130 (Dragonborn.esm). **script**
- Dialogue with Elynea Mothren (named by alias Elynea of DLC2TTR8 (Hunting and Gathering) (unique)), placed in Tel Mithryn Apothecary, "I have some void salts.": SetStage 100 (when: the speaker is the one in alias Elynea; global DLC2TTR8Ingredient == 6 (now 0); GetItemCount Void Salts >= 1; Hunting and Gathering stage == 75). Source: DLC2_TIF__0201F131.Fragment_1 on INFO Dragonborn.esm:01F131 (Dragonborn.esm). **script**
- Dialogue with Elynea Mothren (named by alias Elynea of DLC2TTR8 (Hunting and Gathering) (unique)), placed in Tel Mithryn Apothecary, "Do you need any help?": SetStage 75 (when: the speaker is the one in alias Elynea; global DLC2TTR8Ingredient == 1 (now 0); Hunting and Gathering stage == 50). Source: DLC2_TIF__0201F132.Fragment_0 on INFO Dragonborn.esm:01F132 (Dragonborn.esm). **script**
- Dialogue with Elynea Mothren (named by alias Elynea of DLC2TTR8 (Hunting and Gathering) (unique)), placed in Tel Mithryn Apothecary, "Do you need any help?": SetStage 75 (when: the speaker is the one in alias Elynea; global DLC2TTR8Ingredient == 2 (now 0); Hunting and Gathering stage == 50). Source: DLC2_TIF__0201F133.Fragment_0 on INFO Dragonborn.esm:01F133 (Dragonborn.esm). **script**
- and 5 more in the JSON
- (First objective shown at stage 110; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Bring a giant's toe to Elynea", shown at stage 110. Source: Dragonborn.esm:01F13B QOBJ 102. **files**
- **unread**: nothing outside its own stage fragments sets stage 110 or one before it.

**Who and where**

- First objective: "Bring a daedra heart to Elynea". Source: Dragonborn.esm:01F13B QOBJ 101. **files**
- Target alias Elynea (unique): Elynea Mothren (unique actor, placed in Tel Mithryn Apothecary). **files**

**Needs**

- Its own conditions: Healing a House completed. **files**
- Ways in: Tel Mithryn Apothecary: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: 350 gold (stage 100, DLC2_QF_DLC2TTR8_0201F13B.fragment_0); 200 gold (stage 100, DLC2_QF_DLC2TTR8_0201F13B.fragment_0); 100 gold (stage 100, DLC2_QF_DLC2TTR8_0201F13B.fragment_0).

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | To get into Neloth of Tel Mithryn: ask Neloth in Tel Mithryn, Tel Mithryn Tower "No, I haven't seen Varona." (the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1), which starts Reluctant Steward; or ask Varona Nelas in Tel Mithryn Steward's House, Tel Mithryn Steward "" (the speaker is Varona Nelas; the speaker is Prisoner), which starts Reluctant Steward. |

## Routes into the first quest from outside the starts

### DLC2Init (Init quest)

- What it does: stage 100: Start. Source: DLC2_QF_DLC2_MQ04_02016E02 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Started by: the start-game flag (Dragonborn.esm:016E02 DNAM, Fozars_Dragonborn_-_Requiem_Patch.esp).
- In one sentence: DLC2Init (Init quest) stage 100: Start on DLC2TT1 (Reluctant Steward); it is started by the start-game flag (Dragonborn.esm:016E02 DNAM, Fozars_Dragonborn_-_Requiem_Patch.esp).

### dialogue INFO Dragonborn.esm:017E6D

- Speaker: Neloth (Dunmer), placed in Tel Mithryn, Tel Mithryn Tower. Named by: alias Neloth of DLC2TT1 (Reluctant Steward) (unique).
- The player's prompt: "No, I haven't seen Varona.".
- The reply: "Well find her. Tell her I want apple cabbage stew, with some canis root tea.".
- When it's offered: the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1.
- What it does: SetStage 150 on DLC2TT1 (Reluctant Steward). Source: DLC2_TIF__02017E6D.Fragment_0 on INFO Dragonborn.esm:017E6D (Dragonborn.esm); topic DLC2TT1NelothStartTopic. **script**
- In one sentence: Talk to Neloth (Dunmer) in Tel Mithryn, Tel Mithryn Tower and choose "No, I haven't seen Varona.", when the speaker is the one in alias Neloth; Reluctant Steward stage == 100; fn359 == 1: SetStage 150 on DLC2TT1 (Reluctant Steward).

### dialogue INFO Dragonborn.esm:017E7F

- Speaker: Varona Nelas (Dunmer), placed in Tel Mithryn Steward's House, Tel Mithryn Steward. Named by: GetIsID.
- The player's prompt: "".
- The reply: "We don't get many visitors. Is there something you need?".
- When it's offered: the speaker is Varona Nelas; the speaker is Prisoner.
- What it does: SetStage 90 on DLC2TT1 (Reluctant Steward). Source: DLC2_TIF__02017E7F.Fragment_0 on INFO Dragonborn.esm:017E7F (Dragonborn.esm); topic . **script**
- In one sentence: Talk to Varona Nelas (Dunmer) in Tel Mithryn Steward's House, Tel Mithryn Steward, when the speaker is Varona Nelas; the speaker is Prisoner: SetStage 90 on DLC2TT1 (Reluctant Steward).

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
