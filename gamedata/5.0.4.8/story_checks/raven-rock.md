# Start check: Raven Rock (`raven-rock`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. March of the Dead (`DLC2RR01`, Dragonborn.esm:018B13, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- (First objective shown at stage 30; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Captain Veleth". Source: Dragonborn.esm:018B13 QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Kill the ash spawn attacking Captain Veleth". Source: Dragonborn.esm:018B13 QOBJ 10. **files**
- Target alias DLC2RR01Ghoul01Alias (from alias): nothing the records or scripts name. **files**
- Target alias DLC2RR01Ghoul02Alias (from alias): nothing the records or scripts name. **files**
- Target alias DLC2RR01Ghoul03Alias (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: DLC2RR01GoldAward (levelled: gold) (stage 200, DLC2_QF_DLC2RR01_02018B13.fragment_12).

## 2. Served Cold (`DLC2RR02`, Dragonborn.esm:018B14, Severin Manor Has A Price.esp)

**Started by**

- DLC2RR00 (named "Raven Rock Quest Monitor" in its record), a helper quest at stage 10 calls SetStage 5; DLC2RR00 is started by DLC2RR01 (March of the Dead) at stage 200 (SetStage 10); the start-game flag. Source: DLC2_QF_DLC2RR00_0201BFE9.fragment_0 on Dragonborn.esm:01BFE9 (Dragonborn.esm). **script**
- Dialogue with Captain Veleth, placed in Raven Rock, "Did he say what it was about?": SetStage 10 (when: the speaker is Captain Veleth; Served Cold stage == 5). Source: DLC2_TIF__020295DA.Fragment_0 on INFO Dragonborn.esm:0295DA (Dragonborn.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Geldis Sadri", shown at stage 20. Source: Dragonborn.esm:018B14 QOBJ 10. **files**
- Dialogue with Adril Arano, placed in Raven Rock, "Where do I begin?": SetStage 20 (when: the speaker is Adril Arano; Served Cold stage >= 10; Served Cold stage < 20; global DLC2RR02Dia01 == 1 (now 0); global DLC2RR02Dia02 == 1 (now 0)). Reply: "I need you to start out by being my eyes and ears... search Raven Rock and see if you can root out these traitors." Source: DLC2_TIF__0201F2E6.Fragment_0 on INFO Dragonborn.esm:01F2E6 (Dragonborn.esm). **script**
- Dialogue with Adril Arano, placed in Raven Rock, "I'd prefer not to get involved.": SetStage 15 (when: the speaker is Adril Arano; Served Cold stage == 10; global DLC2RR02Dia01 == 1 (now 0); global DLC2RR02Dia02 == 0 (now 0)). Reply: "Without Councilor Morvayn, Raven Rock has no future. Keep that in mind next time you decide to help or not." Source: DLC2_TIF__0201F2C1.Fragment_0 on INFO Dragonborn.esm:01F2C1 (Dragonborn.esm). **script**

**Who and where**

- First objective: "Speak to Adril Arano". Source: Dragonborn.esm:018B14 QOBJ 5. **files**
- Target alias DLC2RR02AdrilAlias (unique): Adril Arano (unique actor, placed in Raven Rock). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Raven Rock: 6 doors, 2 locked. A door is a need only when every way in is locked. **files**

**Gives**: DLC2RR02GoldAward (levelled: gold) (stage 200, DLC2_QF_DLC2RR02_02018B14.fragment_2).

## 3. An Axe to Find (`DLC2RR03Intro`, Dragonborn.esm:020A1C, LoreRim - Dialogue Patch.esp)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Glover Mallory, placed in Glover Mallory's House, "Why all the fuss over a simple pickaxe?": SetStage 15 (when: the speaker is Glover Mallory; An Axe to Find stage <= 15). Source: TIF__02020A0F.Fragment_0 on INFO Dragonborn.esm:020A0F (TheChoiceIsYours.esp). **script**
- Dialogue with Glover Mallory, placed in Glover Mallory's House, "Sure.": SetStage 17 (when: the speaker is Glover Mallory; An Axe to Find stage <= 15). Source: TIF__030036CB.Fragment_0 on INFO TheChoiceIsYours.esp:0036CB (TheChoiceIsYours.esp). **script**
- (First objective shown at stage 17; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return the Ancient Nordic Pickaxe to Glover Mallory", shown at stage 20. Source: Dragonborn.esm:020A1C QOBJ 20. **files**
- DLC2RR03Intro (An Axe to Find) calls SetStage 20. Source: DLC2RR03IntroPlayerScript.OnItemAdded on Dragonborn.esm:020A1C (LoreRim - Dialogue Patch.esp). **script**

**Who and where**

- First objective: "Retrieve the Ancient Nordic Pickaxe". Source: Dragonborn.esm:020A1C QOBJ 10. **files**
- Target alias DLC2RR03IntroCresciusAlias (unique): Crescius Caerellius (unique actor, placed in Caerellius House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Caerellius House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: FavorRewardGoldLarge (levelled: gold) (stage 200, DLC2_QF_DLC2RR03Intro_02020A1C.fragment_4).

## 4. The Final Descent (`DLC2RR03`, Dragonborn.esm:018B15, LoreRim - Dialogue Patch.esp)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Crescius Caerellius, placed in Caerellius House: SetStage 15 (when: the speaker is Crescius Caerellius; The Final Descent stage == 10; global DLC2RR03Dia01 == 0 (now 0)). Source: DLC2_TIF__020209F8.Fragment_1 on INFO Dragonborn.esm:0209F8 (Dragonborn.esm). **script**
- It starts from something placed in Bloodskal Barrow. (Start). Source: DLC2RR03ExitTriggerScript on Dragonborn.esm:02B10E (1 placed). **script**
- (First objective shown at stage 15; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Retrieve Gratian Caerellius' Journal", shown at stage 20. Source: Dragonborn.esm:018B15 QOBJ 10. **files**
- Dialogue with Crescius Caerellius, placed in Caerellius House, "Any idea of where to start?": SetStage 20 (when: the speaker is Crescius Caerellius; The Final Descent stage == 15; global DLC2RR03Dia01 == 2 (now 0)). Reply: "Gratian kept a journal of notes about his discoveries. If you can find his... remains, I'm hoping it will help." Source: DLC2_TIF__02020A0D.Fragment_0 on INFO Dragonborn.esm:020A0D (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Speak to Crescius Caerellius". Source: Dragonborn.esm:018B15 QOBJ 5. **files**
- Target alias DLC2RR03CresciusAlias (unique): Crescius Caerellius (unique actor, placed in Caerellius House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Caerellius House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: FavorRewardGoldLarge (levelled: gold) (stage 200, DLC2_QF_DLC2RR03_02018B15.fragment_8).

## 5. The Final Descent Priest (`DLC2RR03Priest`, Dragonborn.esm:03332A, Dragonborn.esm)

**Started by**

- It starts from something placed in Bloodskal Barrow. (Start). Source: DLC2RR03ExitTriggerScript on Dragonborn.esm:02B10E (1 placed). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Slay the Seeker in Bloodskal Barrow". Source: Dragonborn.esm:03332A QOBJ 10. **files**
- Target alias DLC2RR03Priest (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 6. Recipe for Distraction (`DLC2RRFavor01`, Dragonborn.esm:024DDE, Dragonborn.esm)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Captain Veleth, placed in Raven Rock, "I could track the stash down for you.": SetStage 20 (when: the speaker is Captain Veleth; Recipe for Distraction stage == 10; GetQuestRunning March of the Dead == 0). Source: DLC2_TIF__02024DC3.Fragment_0 on INFO Dragonborn.esm:024DC3 (Dragonborn.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report the stash of Emberbrand Wine to Captain Veleth", shown at stage 30. Source: Dragonborn.esm:024DDE QOBJ 20. **files**
- DLC2RRFavor01 (Recipe for Distraction) calls SetStage 30. Source: DLC2RRF01BarrelScript.OnActivate on Dragonborn.esm:024DDE (Dragonborn.esm). **script**

**Who and where**

- First objective: "Locate the hidden stash of Emberbrand Wine in Raven Rock". Source: Dragonborn.esm:024DDE QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: DLC2RRFavorGoldAward (levelled: gold) (stage 200, DLC2_QF_DLC2RRFavor01_02024DDE.fragment_3).

## 7. Fetch the Netch (`DLC2RRFavor02`, Dragonborn.esm:024DE7, Dragonborn.esm)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Milore Ienth, placed in Ienth Farm, "I could gather some for you.": SetStage 20 (when: the speaker is Milore Ienth; Fetch the Netch stage == 10; GetItemCount Netch Jelly < 5). Source: DLC2_TIF__02024DB5.Fragment_1 on INFO Dragonborn.esm:024DB5 (Dragonborn.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Bring the netch jelly to Milore Ienth", shown at stage 20. Source: Dragonborn.esm:024DE7 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Retrieve netch jelly for Milore Ienth  (<Global=DLC2RRF02JellyCount>/<Global=DLC2RRF02JellyTotal>)". Source: Dragonborn.esm:024DE7 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: Potion of Well-being (Surpassing) x2 (stage 200, DLC2_QF_DLC2RRFavor02_02024DE7.fragment_3).

## 8. Clean Sweep (`DLC2RRFavor03`, Dragonborn.esm:024DFC, Dragonborn.esm)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Elder Othreloth, placed in Temple, Temple Location, "I'll cleanse the tomb for you.": SetStage 20 (when: the speaker is Elder Othreloth; Clean Sweep stage == 10). Source: DLC2_TIF__02024DB4.Fragment_0 on INFO Dragonborn.esm:024DB4 (Dragonborn.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell Elder Othreloth that the Tomb has been cleansed", shown at stage 30. Source: Dragonborn.esm:024DFC QOBJ 20. **files**
- It starts by itself from the start of the game. (SetStage 30). Source: DLC2RRF03QuestScript.SpawnDie on Dragonborn.esm:024DFC (Dragonborn.esm). **script**
- DLC2RRFavor03 (Clean Sweep) calls SetStage 30. Source: DLC2RRF03SpawnScript.OnDying on Dragonborn.esm:024DFC (Dragonborn.esm), through DLC2RRFavor03 (Clean Sweep)'s spawndie. **script**

**Who and where**

- First objective: "Clear the Temple's tomb of ash spawn". Source: Dragonborn.esm:024DFC QOBJ 10. **files**
- Target alias QTTomb (forced): a marker (forced reference, placed in Temple Ancestral Tomb, Temple Location). **files**

**Needs**

- The door from Morvayn Ancestral Tomb into Temple Ancestral Tomb, Temple Location needs the Raven Rock Tomb Key. Source: Dragonborn.esm:036005 (Dragonborn.esm). **files**
- The door from Ulen Ancestral Tomb into Temple Ancestral Tomb, Temple Location needs the Raven Rock Tomb Key. Source: Dragonborn.esm:0359FC (Dragonborn.esm). **files**
- The door from Temple, Temple Location into Temple Ancestral Tomb, Temple Location needs the Raven Rock Tomb Key. Source: Dragonborn.esm:024DF6 (Dragonborn.esm). **files**
- Ways in: Temple Ancestral Tomb, Temple Location: 3 doors, 3 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 9. It's All In The Taste (`DLC2RRFavor04`, Dragonborn.esm:024E04, Dragonborn.esm)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Geldis Sadri, placed in The Retching Netch, "I could help spread the word.": SetStage 20 (when: the speaker is Geldis Sadri; It's All In The Taste stage == 10). Source: DLC2_TIF__02024DBE.Fragment_0 on INFO Dragonborn.esm:024DBE (Dragonborn.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell Geldis Sadri you've distributed his liquor samples", shown at stage 30. Source: Dragonborn.esm:024E04 QOBJ 20. **files**
- It starts by itself from the start of the game. (SetStage 30). Source: DLC2FFR04QuestScript.GiveADrink on Dragonborn.esm:024E04 (Dragonborn.esm). **script**
- Dialogue with Lleril Morvayn, placed in Morvayn Manor, "Geldis Sadri wants you to try his new drink.": SetStage 25 (when: the speaker is Lleril Morvayn; It's All In The Taste stage >= 20; It's All In The Taste stage < 30; GetItemCount Sadri's Sujamma >= 1). Reply: "Good old Geldis is always managing to keep our spirits up... and our eyesight hazy. Thank you." Source: DLC2_TIF__02024DC7.Fragment_0 on INFO Dragonborn.esm:024DC7 (Dragonborn.esm). **script**
- Dialogue with Cindiri Arano, placed in Morvayn Manor, "Geldis Sadri wants you to try his new drink.": SetStage 25 (when: the speaker is Cindiri Arano; It's All In The Taste stage >= 20; It's All In The Taste stage < 30; GetItemCount Sadri's Sujamma >= 1). Reply: "Oh, how kind. Thank Geldis for me, won't you?" Source: DLC2_TIF__02024DC9.Fragment_0 on INFO Dragonborn.esm:024DC9 (Dragonborn.esm). **script**
- Dialogue with Adril Arano, placed in Raven Rock, "Geldis Sadri wants you to try his new drink.": SetStage 25 (when: the speaker is Adril Arano; It's All In The Taste stage >= 20; It's All In The Taste stage < 30; GetItemCount Sadri's Sujamma >= 1). Reply: "Ah, wonderful. Anything to keep the spirits up." Source: DLC2_TIF__02024DCB.Fragment_0 on INFO Dragonborn.esm:024DCB (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Fethis Alor, placed in Alor House, "Geldis Sadri wants you to try his new drink.": SetStage 25 (when: the speaker is Fethis Alor; It's All In The Taste stage >= 20; It's All In The Taste stage < 30; GetItemCount Sadri's Sujamma >= 1). Reply: "Geldis needs to bottle this up and send it to the mainland instead of wasting his time out here... his drinks are outstanding. Thanks." Source: DLC2_TIF__02024DCE.Fragment_0 on INFO Dragonborn.esm:024DCE (Dragonborn.esm). **script**
- Dialogue with Dreyla Alor, placed in Alor House, "Geldis Sadri wants you to try his new drink.": SetStage 25 (when: the speaker is Dreyla Alor; It's All In The Taste stage >= 20; It's All In The Taste stage < 30; GetItemCount Sadri's Sujamma >= 1). Reply: "At least my father will let me drink whatever I want without complaining. Tell Geldis I appreciate it." Source: DLC2_TIF__02024DCF.Fragment_0 on INFO Dragonborn.esm:024DCF (Dragonborn.esm). **script**
- Dialogue with Glover Mallory, placed in Glover Mallory's House, "Geldis Sadri wants you to try his new drink.": SetStage 25 (when: the speaker is Glover Mallory; It's All In The Taste stage >= 20; It's All In The Taste stage < 30; GetItemCount Sadri's Sujamma >= 1). Reply: "Perfect! I was just thinking about heading over for a drink. Thanks for saving me the trip." Source: DLC2_TIF__02024DD0.Fragment_0 on INFO Dragonborn.esm:024DD0 (Dragonborn.esm). **script**
- Dialogue with Crescius Caerellius, placed in Caerellius House, "Geldis Sadri wants you to try his new drink.": SetStage 25 (when: the speaker is Crescius Caerellius; It's All In The Taste stage >= 20; It's All In The Taste stage < 30; GetItemCount Sadri's Sujamma >= 1). Reply: "Hmph, he's begging for patrons again, eh? Well, I suppose I could have just a bit." Source: DLC2_TIF__02024DD1.Fragment_0 on INFO Dragonborn.esm:024DD1 (Dragonborn.esm). **script**

**Who and where**

- First objective: "Distribute Sadri's Sujamma  (<Global=DLC2RRF04DrinkCount>/<Global=DLC2RRF04DrinkTotal>)". Source: Dragonborn.esm:024E04 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: DLC2RRFavorGoldAward (levelled: gold) (stage 200, DLC2_QF_DLC2RRFavor04_02024E04.fragment_3).

## 10. Pain in the Necklace (`DLC2RRFavor05`, Dragonborn.esm:024FA8, Dragonborn.esm)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Fethis Alor, placed in Alor House, "I'll sell you some of mine. (Give East Empire Pendants)": SetStage 20 (when: the speaker is Fethis Alor; Pain in the Necklace stage == 10; GetItemCount East Empire Pendant >= 1). Source: DLC2_TIF__02024F96.Fragment_0 on INFO Dragonborn.esm:024F96 (Dragonborn.esm). **script**
- Dialogue with Fethis Alor, placed in Alor House, "Where can you find them?": SetStage 20 (when: the speaker is Fethis Alor; Pain in the Necklace stage == 10; GetItemCount East Empire Pendant == 0). Source: DLC2_TIF__02024F97.Fragment_0 on INFO Dragonborn.esm:024F97 (Dragonborn.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Locate the East Empire Pendants for Fethis Alor in Raven Rock". Source: Dragonborn.esm:024FA8 QOBJ 10. **files**
- Target alias DLC2RRF05FethisAlias (unique): Fethis Alor (unique actor, placed in Alor House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Alor House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 11. Feeding the Addiction (`DLC2RRFavor06`, Dragonborn.esm:024FAD, Dragonborn.esm)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Bralsa Drel, placed in Abandoned Building, "I could talk to him for you.": SetStage 20 (when: the speaker is Bralsa Drel; Feeding the Addiction stage == 10). Source: DLC2_TIF__02024F9D.Fragment_0 on INFO Dragonborn.esm:024F9D (Dragonborn.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell Bralsa Drel she's welcome at the Retching Netch", shown at stage 30. Source: Dragonborn.esm:024FAD QOBJ 20. **files**
- Dialogue with Geldis Sadri, placed in The Retching Netch, "Maybe this will change your mind. (<BribeCost> gold)": SetStage 30 (when: the speaker is Geldis Sadri; Feeding the Addiction stage == 20). Reply: "Well, there's morals, and then there's money. In this case, money wins." Source: DLC2_TIF__02024F9E.Fragment_0 on INFO Dragonborn.esm:024F9E (Dragonborn.esm). **script**
- Dialogue with Geldis Sadri, placed in The Retching Netch, "A sobbing woman in your inn, or a few broken bones. Your choice. (Intimidate)": SetStage 30 (when: the speaker is Geldis Sadri; Feeding the Addiction stage == 20; fn655 == 1). Reply: "Okay, okay. There's no need to get violent." Source: DLC2_TIF__02024FA1.Fragment_0 on INFO Dragonborn.esm:024FA1 (Immersive Speech Dialogues.esp). **script**
- Dialogue with Geldis Sadri, placed in The Retching Netch, "She has a right to do what she pleases. (Persuade)": SetStage 30 (when: the speaker is Geldis Sadri; Feeding the Addiction stage == 20; GetActorValue >= SpeechAverage (now 50) or GetEquipped Skyrim.esm:0F759C == 1). Reply: "I suppose you're right. If she wants to spend her life at the bottom of an ale mug, it's her choice." Source: DLC2_TIF__02024F93.Fragment_0 on INFO Dragonborn.esm:024F93 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Convince Geldis Sadri to admit Bralsa Drel to the inn". Source: Dragonborn.esm:024FAD QOBJ 10. **files**
- Target alias DLC2RRF06GeldisAlias (unique): Geldis Sadri (unique actor, placed in The Retching Netch). **files**

**Needs**

- Its own conditions: GetDisabled == 1. **files**
- Ways in: The Retching Netch: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: DLC2LItemEnchWeaponAnyBest (levelled: an item) (stage 200, DLC2_QF_DLC2RRFavor06_02024FAD.fragment_3).

## 12. First Edition (`DLC2RRFavor07`, Dragonborn.esm:02BAC6, Dragonborn.esm)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Cindiri Arano, placed in Morvayn Manor, "I'll see if I can find the book for you.": SetStage 20 (when: the speaker is Cindiri Arano; First Edition stage < 20). Source: DLC2_TIF__0202BABE.Fragment_0 on INFO Dragonborn.esm:02BABE (Dragonborn.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return the Folio to Cindiri Arano in Raven Rock", shown at stage 30. Source: Dragonborn.esm:02BAC6 QOBJ 20. **files**
- DLC2RRFavor07 (First Edition) calls SetStage 30. Source: DLC2RRF07PlayerScript.OnItemAdded on Dragonborn.esm:02BAC6 (Dragonborn.esm). **script**

**Who and where**

- First objective: "Locate Cindiri's Folio from the wreck of the Strident Squall". Source: Dragonborn.esm:02BAC6 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: LItemEnchJewelryAll (levelled: an item) (stage 200, DLC2_QF_DLC2RRFavor07_0202BAC6.fragment_4).

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | The reader found no way into Raven Rock from it. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | The reader found no way into Raven Rock from it. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | The reader found no way into Raven Rock from it. |

## Routes into the first quest from outside the starts

### DLC2Init (Init quest)

- What it does: stage 100: Start. Source: DLC2_QF_DLC2_MQ04_02016E02 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Started by: the start-game flag (Dragonborn.esm:016E02 DNAM, Fozars_Dragonborn_-_Requiem_Patch.esp).
- In one sentence: DLC2Init (Init quest) stage 100: Start on DLC2RR01 (March of the Dead); it is started by the start-game flag (Dragonborn.esm:016E02 DNAM, Fozars_Dragonborn_-_Requiem_Patch.esp).

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
