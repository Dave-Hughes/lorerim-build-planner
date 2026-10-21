# Start check: The Civil War (`civil-war`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Imperial Introductions (`CW00A`, Skyrim.esm:0D3C5F, LoreRim - Dialogue Patch.esp)

**Started by**

- WEDL13 (named "Looking to join Imperials" in its record), a helper quest at stage 10 calls SetStage 1; WEDL13 is started by story manager node WERoadQuestNode (event: script event; GetEventData WERoadStart == 1; global WEEnabled == 1 (now 1); GetEventData WEStart == 1 or GetEventData WERoadStart == 1). Source: QF_WEDL13_000BD757.fragment_12 on Skyrim.esm:0BD757 (Skyrim.esm). **script**
- MQ102A (named "Season Unending" in its record), a helper quest with Alvor, Sigrid, Dorthe at stage 22 calls SetStage 1; MQ102A is started by MQ102 (named "Before the Storm" in its record), a helper quest with Balgruuf, Irileth, Proventus at stage 1 (SetStage 1); MQ102 (named "Before the Storm" in its record), a helper quest with Balgruuf, Irileth, Proventus at stage 1 (SetStage 10); MQ102 (named "Before the Storm" in its record), a helper quest with Balgruuf, Irileth, Proventus at stage 2 (SetStage 5); MQ102 (named "Before the Storm" in its record), a helper quest with Balgruuf, Irileth, Proventus at stage 15 (SetStage 10). Source: QF_MQ102_0002BF9C.fragment_47 on Skyrim.esm:02BF9C (Skyrim.esm). **script**
- Dialogue with Alvor, placed in Alvor and Sigrid's House, "What do you think about the war?": SetStage 1 (when: the speaker is Alvor). Source: TIF__00056B24.Fragment_1 on INFO Skyrim.esm:056B24 (Skyrim.esm). **script**
- Dialogue with Alvor (named by alias Alvor of MQ102A (Season Unending) (unique)), placed in Alvor and Sigrid's House, "You support the Empire, then?": SetStage 1 (when: the speaker is the one in alias Alvor). Source: TIF__000D39AF.Fragment_0 on INFO Skyrim.esm:0D39AF (Skyrim.esm). **script**
- Dialogue with Hadvar, placed in Helgen: SetStage 1 (when: fn359 == 0; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Imperial Legion == 1; the speaker isn't Hadvar). Source: TIF__000D3C58.Fragment_0 on INFO Skyrim.esm:0D3C58 (Skyrim.esm). **script**
- Dialogue with someone the line does not name, "...": SetStage 2 (when: fn359 == 0; GetInFaction CWFieldCOFaction == 1; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Sons of Skyrim == 1; fn426 == 0; fn426 == 0). Source: TIF__000D3C57.Fragment_0 on INFO Skyrim.esm:0D3C57 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name, "...": SetStage 2 (when: fn359 == 1; GetInFaction CWFieldCOFaction == 1; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Sons of Skyrim == 1; fn426 == 0; fn426 == 0). Source: TIF__000FBA68.Fragment_0 on INFO Skyrim.esm:0FBA68 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name, "How does one join the Imperial Legion?": SetStage 1 (when: Unbound completed; fn359 == 0; GetInFaction CWFieldCOFaction == 1; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Imperial Legion == 1; fn426 == 0; fn426 == 0). Source: TIF__000D3C5A.Fragment_0 on INFO Skyrim.esm:0D3C5A (AlternatePerspective.esp). **script**
- and 6 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- CW01A (Joining the Legion) at stage 0 calls SetStage 20. Source: QF_CW01_000D517A.fragment_6 (LoreRim - Dialogue Patch.esp).
- DialogueSolitudeGuardIntro (Recruitment Drive) calls SetStage 1. Source: TIF__00034B35.Fragment_0 (Skyrim.esm).

**Who and where**

- First objective: "Join the Imperial Legion". Source: Skyrim.esm:0D3C5F QOBJ 1. **files**
- Target alias Rikke (unique): Legate Rikke (unique actor, placed in Castle Dour). **files**
- Target alias Tullius (unique): General Tullius (unique actor, placed in Castle Dour). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Castle Dour: 5 doors, 0 locked; Castle Dour: 5 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Stormcloak Introductions (`CW00B`, Skyrim.esm:0E1B5A, LoreRim - Dialogue Patch.esp)

**Started by**

- WEDL14 (named "Looking to join Stormcloaks" in its record), a helper quest at stage 10 calls SetStage 2; WEDL14 is started by story manager node WERoadQuestNode (event: script event; GetEventData WERoadStart == 1; global WEEnabled == 1 (now 1); GetEventData WEStart == 1 or GetEventData WERoadStart == 1). Source: QF_WEDL14_000BD758.fragment_12 on Skyrim.esm:0BD758 (Skyrim.esm). **script**
- MQ102B (named "Season Unending" in its record), a helper quest with Gerdur, Hod, Frodnar at stage 22 calls SetStage 2; MQ102B is started by MQ102 (named "Before the Storm" in its record), a helper quest with Balgruuf, Irileth, Proventus at stage 1 (SetStage 5); MQ102 (named "Before the Storm" in its record), a helper quest with Balgruuf, Irileth, Proventus at stage 2 (SetStage 1); MQ102 (named "Before the Storm" in its record), a helper quest with Balgruuf, Irileth, Proventus at stage 15 (SetStage 10); MQ101 (named "Unbound" in its record), a helper quest with Hadvar, Ralof, Alduin at stage 0 (SetStage 1). Source: QF_MQ102B_010A4C68.fragment_51 on Skyrim.esm:02610A (Skyrim.esm). **script**
- Dialogue with someone the line does not name, placed in Windhelm; Windhelm, "Placeholder For Remarks Culled From Other Topics": SetStage 2 (when: fn426 == 0; fn426 == 1). Source: TIF__0003ED51.Fragment_0 on INFO Skyrim.esm:03ED51 (Skyrim.esm). **script**
- Dialogue with Gerdur, placed in Hod and Gerdur's House, "What do you think about the war?": SetStage 2 (when: the speaker is Gerdur; Season Unending stage 50 done). Source: TIF__00056AB1.Fragment_0 on INFO Skyrim.esm:056AB1 (Skyrim.esm). **script**
- Dialogue with Gerdur, placed in Hod and Gerdur's House, "You support the Stormcloaks, then?": SetStage 2 (when: the speaker is Gerdur). Source: TIF__000DF1F3.Fragment_0 on INFO Skyrim.esm:0DF1F3 (Skyrim.esm). **script**
- Dialogue with Galmar Stone-Fist, placed in Palace of the Kings: SetStage 7 (when: Stormcloak Introductions stage 20 not done; Stormcloak Introductions stage 10 not done; fn249 == 1; the speaker is Galmar Stone-Fist). Source: TIF__000E1B06.Fragment_0 on INFO Skyrim.esm:0E1B06 (Skyrim.esm). **script**
- Dialogue with Ulfric Stormcloak, placed in Palace of the Kings, "...": SetStage 10 (when: the speaker is Ulfric Stormcloak). Source: TIF__000E1B25.Fragment_0 on INFO Skyrim.esm:0E1B25 (Skyrim.esm). **script**
- Dialogue with Ulfric Stormcloak, placed in Palace of the Kings: SetStage 10 (when: Unbound completed; Stormcloak Introductions stage 10 not done; fn629 == 1; the speaker is Ulfric Stormcloak). Source: TIF__000C3489.Fragment_0 on INFO Skyrim.esm:0C3489 (AlternatePerspective.esp). **script**
- and 3 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- CW01B (Joining the Stormcloaks) at stage 0 calls SetStage 20. Source: QF_CW01B_000E2D29.fragment_6 (LoreRim - Dialogue Patch.esp).

**Who and where**

- First objective: "Join the Stormcloak rebellion". Source: Skyrim.esm:0E1B5A QOBJ 2. **files**
- Target alias Ulfric (unique): Ulfric Stormcloak (unique actor, placed in Palace of the Kings). **files**
- Target alias Galmar (unique): Galmar Stone-Fist (unique actor, placed in Palace of the Kings). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Palace of the Kings: 5 doors, 0 locked; Palace of the Kings: 5 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. Get Outfitted (`CW01AOutfitImperial`, Skyrim.esm:0C349B, LoreRim - Dialogue Patch.esp)

**Started by**

- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0C349B DNAM (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- CW01A (Joining the Legion) at stage 200 calls SetStage 1. Source: QF_CW01_000D517A.fragment_4 (LoreRim - Dialogue Patch.esp).

**Who and where**

- First objective: "Get Imperial gear from Beirand". Source: Skyrim.esm:0C349B QOBJ 1. **files**
- Target alias Beirand (unique): Beirand (unique actor, placed in Bits and Pieces). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Bits and Pieces: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 4. Recruitment Drive (`DialogueSolitudeGuardIntro`, Skyrim.esm:034B58, Skyrim.esm)

**Started by**

- Dialogue with someone the line does not name (named by alias Guard1 of DialogueSolitudeGuardIntro (Recruitment Drive) (forced)), placed in Solitude; Solitude: SetStage 10 (when: Solitude Dialogue stage < 10; Recruitment Drive hasn't started; the speaker is the one in alias Guard1 or the speaker is the one in alias Guard2). Source: TIF__00034B38.Fragment_0 on INFO Skyrim.esm:034B38 (Skyrim.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:034B58 DNAM (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Talk to Rikke about joining the Imperial Legion". Source: Skyrim.esm:034B58 QOBJ 20. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 5. Joining the Legion (`CW01A`, Skyrim.esm:0D517A, LoreRim - Dialogue Patch.esp)

**Started by**

- CW00A (Imperial Introductions) calls at stage 21 SetStage 1; at stage 20 SetStage 1. Sources: QF_CW00_000D3C5F.fragment_8, QF_CW00_000D3C5F.fragment_6 on Skyrim.esm:0D3C5F. **script**
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- CW01B (Joining the Stormcloaks) at stage 200 calls SetStage 999. Source: QF_CW01B_000E2D29.fragment_4 (LoreRim - Dialogue Patch.esp).
- CW03 (Message to Whiterun) at stage 1 calls SetStage 200. Source: QF_CW03_000D661C.fragment_12 (LoreRim - Dialogue Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report to Legate Rikke", shown at stage 100. Source: Skyrim.esm:0D517A QOBJ 100. **files**
- CW00A (Imperial Introductions) at stage 21 calls SetStage 100. Source: QF_CW00_000D3C5F.fragment_8 on Skyrim.esm:0D3C5F (LoreRim - Dialogue Patch.esp). **script**

**Who and where**

- First objective: "Clear out Fort Hraggstad". Source: Skyrim.esm:0D517A QOBJ 1. **files**
- Target alias Bandit1 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit2 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit3 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit4 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit5 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit6 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit7 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit8 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit9 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit10 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit11 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit12 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit13 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit14 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit15 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit16 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit17 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit18 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit19 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit20 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit21 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit22 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit23 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit24 (from alias): nothing the records or scripts name. **files**
- Target alias Bandit25 (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 6. Joining the Stormcloaks (`CW01B`, Skyrim.esm:0E2D29, LoreRim - Dialogue Patch.esp)

**Started by**

- CW00B (Stormcloak Introductions) at stage 20 calls SetStage 1. Source: QF_CW00B_000E1B5A.fragment_6 on Skyrim.esm:0E1B5A (LoreRim - Dialogue Patch.esp). **script**
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- CW03 (Message to Whiterun) at stage 2 calls SetStage 200. Source: QF_CW03_000D661C.fragment_18 (LoreRim - Dialogue Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Galmar", shown at stage 100. Source: Skyrim.esm:0E2D29 QOBJ 100. **files**
- **unread**: nothing outside its own stage fragments sets stage 100 or one before it.

**Who and where**

- First objective: "Kill the Ice Wraith". Source: Skyrim.esm:0E2D29 QOBJ 1. **files**
- Target alias IceWraith (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: CWPlayerUniformSons (levelled: an item) (stage 200, QF_CW01B_000E2D29.fragment_4).

## 7. The Jagged Crown (`CW02A`, Skyrim.esm:02D75C, LoreRim - Dialogue Patch.esp)

**Started by**

- CW01A (Joining the Legion) at stage 200 calls SetStage 10. Source: QF_CW01_000D517A.fragment_4 on Skyrim.esm:0D517A (LoreRim - Dialogue Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet Legate Rikke outside Korvanjund", shown at stage 30. Source: Skyrim.esm:02D75C QOBJ 20. **files**
- Dialogue with Legate Rikke (named by alias LegateRikke of CW02A (The Jagged Crown) (unique)), placed in Castle Dour, "General Tullius told me to report to you.": SetStage 20 (when: fn249 == 1; the speaker is the one in alias LegateRikke; The Jagged Crown stage < 30). Reply: "Welcome to the Legion, Auxiliary. Listen up." Source: TIF__0001A2A5.Fragment_1 on INFO Skyrim.esm:01A2A5 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Legate Rikke (named by alias LegateRikke of CW02A (The Jagged Crown) (unique)), placed in Castle Dour, "What's the mission?": SetStage 30 (when: the speaker is the one in alias LegateRikke; The Jagged Crown stage 20 done). Reply: "Ulfric's right-hand man, Galmar Stone-Fist, has located what he believes is the final resting place of the Jagged Crown." Source: TIF__0001BC8F.Fragment_0 on INFO Skyrim.esm:01BC8F (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Talk to Legate Rikke". Source: Skyrim.esm:02D75C QOBJ 10. **files**
- Target alias LegateRikke (unique): Legate Rikke (unique actor, placed in Castle Dour). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Castle Dour: 5 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 8. The Jagged Crown (`CW02B`, Skyrim.esm:02610B, LoreRim - Dialogue Patch.esp)

**Started by**

- CW01B (Joining the Stormcloaks) at stage 200 calls SetStage 10. Source: QF_CW01B_000E2D29.fragment_4 on Skyrim.esm:0E2D29 (LoreRim - Dialogue Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet Galmar outside Korvanjund", shown at stage 30. Source: Skyrim.esm:02610B QOBJ 20. **files**
- Dialogue with Galmar Stone-Fist, placed in Palace of the Kings, "What's the mission?": SetStage 30 (when: the speaker is Galmar Stone-Fist; The Jagged Crown stage 40 not done). Reply: "I've found the final resting place of the Jagged Crown. Can you believe it? Well, I'm almost certain." Source: TIF__00057BD0.Fragment_0 on INFO Skyrim.esm:057BD0 (Skyrim.esm). **script**
- Dialogue with Galmar Stone-Fist (named by scene MQ103BGalmarScene, alias Galmar of CW02B (The Jagged Crown) (forced)), placed in Palace of the Kings: SetStage 20; its scene is started by CW02B (The Jagged Crown) at stage 10. Reply: "..." Source: TIF__00058655.Fragment_0 on INFO Skyrim.esm:058655 (Skyrim.esm). **script**

**Who and where**

- First objective: "Talk to Galmar". Source: Skyrim.esm:02610B QOBJ 10. **files**
- Target alias Galmar (forced): Galmar Stone-Fist (forced reference, placed in Palace of the Kings). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Palace of the Kings: 5 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 9. Message to Whiterun (`CW03`, Skyrim.esm:0D661C, LoreRim - Dialogue Patch.esp)

**Started by**

- CW02B (The Jagged Crown) calls at stage 190 SetStage 10; at stage 220 SetStage 10. Sources: QF_MQ103B_0002610B.fragment_22, QF_MQ103B_0002610B.fragment_30 on Skyrim.esm:02610B. **script**
- CW02A (The Jagged Crown) calls at stage 190 SetStage 10; at stage 220 SetStage 10. Sources: QF_MQ103A_0002D75C.fragment_20, QF_MQ103A_0002D75C.fragment_32 on Skyrim.esm:02D75C. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Deliver axe to the Jarl of Whiterun", shown at stage 10. Source: Skyrim.esm:0D661C QOBJ 11. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Deliver message to the Jarl of Whiterun". Source: Skyrim.esm:0D661C QOBJ 10. **files**
- Target alias Balgruuf (run time): Hrongar (put there by a script (ForceRefTo), placed in Dragonsreach). **script**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dragonsreach: 5 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 10. Campaign for <Alias=CampaignHold> (`CWCampaignObj`, Skyrim.esm:026F45, LoreRim - Dialogue Patch.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Help conquer <Alias=CampaignHold>.", shown at stage 15. Source: Skyrim.esm:026F45 QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Report to <Alias=FieldCO>.". Source: Skyrim.esm:026F45 QOBJ 10. **files**
- Target alias FieldCO (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 11. The Battle for <Alias=Fort> (`CWFortSiegeCapital`, Skyrim.esm:087C21, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with Legate Rikke, placed in Castle Dour, "Reporting in.": SetStage 10 (when: the speaker is Legate Rikke; fn629 == CWImperial (now 1); GetInFaction CWFieldCOFaction == 1; GetInFaction Imperial Legion == 1; GetQuestRunning The Battle for <Alias=Fort> == 1). Source: TIF__000CA74C.Fragment_1 on INFO Skyrim.esm:0CA74C (Skyrim.esm). **script**
- Dialogue with Legate Rikke, placed in Castle Dour, "Reporting in.": SetStage 10 (when: the speaker is Legate Rikke; fn629 == CWImperial (now 1); GetInFaction CWFieldCOFaction == 1; GetInFaction Imperial Legion == 1; GetQuestRunning The Battle for <Alias=Fort> == 1). Source: TIF__00065C83.Fragment_1 on INFO Skyrim.esm:065C83 (Skyrim.esm). **script**
- Dialogue with Legate Rikke, placed in Castle Dour, "Reporting in.": SetStage 10 (when: the speaker is Legate Rikke; fn629 == CWImperial (now 1); GetInFaction CWFieldCOFaction == 1; GetInFaction Imperial Legion == 1; GetQuestRunning The Battle for <Alias=Fort> == 1). Source: TIF__00065C84.Fragment_1 on INFO Skyrim.esm:065C84 (Skyrim.esm). **script**
- Dialogue with Galmar Stone-Fist, placed in Palace of the Kings, "Reporting in.": SetStage 10 (when: the speaker is Galmar Stone-Fist; fn629 == CWSons (now 2); the speaker isn't Captain Yrsarald Thrice-Pierced; GetInFaction CWFieldCOFaction == 1; GetInFaction Sons of Skyrim == 1; GetQuestRunning The Battle for <Alias=Fort> == 1). Source: TIF__000CA74D.Fragment_1 on INFO Skyrim.esm:0CA74D (Skyrim.esm). **script**
- Dialogue with Galmar Stone-Fist, placed in Palace of the Kings, "Reporting in.": SetStage 10 (when: the speaker is Galmar Stone-Fist; fn629 == CWSons (now 2); the speaker isn't Captain Yrsarald Thrice-Pierced; GetInFaction CWFieldCOFaction == 1; GetInFaction Sons of Skyrim == 1; GetQuestRunning The Battle for <Alias=Fort> == 1). Source: TIF__00065C88.Fragment_1 on INFO Skyrim.esm:065C88 (Skyrim.esm). **script**
- Dialogue with Galmar Stone-Fist, placed in Palace of the Kings, "Reporting in.": SetStage 10 (when: the speaker is Galmar Stone-Fist; fn629 == CWSons (now 2); the speaker isn't Captain Yrsarald Thrice-Pierced; GetInFaction CWFieldCOFaction == 1; GetInFaction Sons of Skyrim == 1; GetQuestRunning The Battle for <Alias=Fort> == 1). Source: TIF__00065C89.Fragment_1 on INFO Skyrim.esm:065C89 (Skyrim.esm). **script**
- Story manager node CWCapitalTownFortSiegeNode, event: script event; conditions up its parents: GetEventData CWFortSiegeMinorCapitalStart == 1. Source: CWCapitalTownFortSiegeNode Skyrim.esm:0CA841 (Skyrim.esm). **files**
- Story manager node CWNonFortFortSiegeNode, event: script event; conditions up its parents: GetEventData CWFortSiegeSpecialStart == 1. Source: CWNonFortFortSiegeNode Skyrim.esm:018387 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Join the men defending <Alias=Fort>", shown at stage 10. Source: Skyrim.esm:087C21 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Join the men attacking <Alias=Fort>". Source: Skyrim.esm:087C21 QOBJ 10. **files**
- Target alias Attacker1 (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 12. The Battle for <Alias=Fort> (`CWFortSiegeFort`, Skyrim.esm:083042, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias FieldCO of CWFortSiegeFort (The Battle for <Alias=Fort>) (from event)), "That fort is as good as ours.": SetStage 10 (when: the speaker is the one in alias FieldCO; GetInFaction Sons of Skyrim == 1). Source: TIF__000A1F78.Fragment_0 on INFO Skyrim.esm:0A1F78 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWFortSiegeFort (The Battle for <Alias=Fort>) (from event)), "That fort is as good as ours.": SetStage 10 (when: the speaker is the one in alias FieldCO; GetInFaction Sons of Skyrim == 1). Source: TIF__000A1F79.Fragment_0 on INFO Skyrim.esm:0A1F79 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWFortSiegeFort (The Battle for <Alias=Fort>) (from event)), "That fort is as good as ours.": SetStage 10 (when: the speaker is the one in alias FieldCO; GetInFaction Sons of Skyrim == 1). Source: TIF__000A1F7A.Fragment_0 on INFO Skyrim.esm:0A1F7A (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWFortSiegeFort (The Battle for <Alias=Fort>) (from event)), "That fort is as good as ours.": SetStage 10 (when: the speaker is the one in alias FieldCO; GetInFaction Sons of Skyrim == 1). Source: TIF__000A1F7B.Fragment_0 on INFO Skyrim.esm:0A1F7B (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWFortSiegeFort (The Battle for <Alias=Fort>) (from event)), "That fort is as good as ours.": SetStage 10 (when: the speaker is the one in alias FieldCO; GetInFaction Sons of Skyrim == 1). Source: TIF__000A1F7C.Fragment_0 on INFO Skyrim.esm:0A1F7C (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWFortSiegeFort (The Battle for <Alias=Fort>) (from event)), "That fort is as good as ours.": SetStage 10 (when: the speaker is the one in alias FieldCO; GetInFaction Sons of Skyrim == 1). Source: TIF__000A1F7D.Fragment_0 on INFO Skyrim.esm:0A1F7D (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWFortSiegeFort (The Battle for <Alias=Fort>) (from event)), "That fort is as good as ours.": SetStage 10 (when: the speaker is the one in alias FieldCO; GetInFaction Sons of Skyrim == 1). Source: TIF__000A1F7E.Fragment_0 on INFO Skyrim.esm:0A1F7E (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWFortSiegeFort (The Battle for <Alias=Fort>) (from event)), "That fort is as good as ours.": SetStage 10 (when: the speaker is the one in alias FieldCO; GetInFaction Sons of Skyrim == 1). Source: TIF__000A1F7F.Fragment_0 on INFO Skyrim.esm:0A1F7F (Skyrim.esm). **script**
- and 25 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Join the men defending <Alias=Fort>", shown at stage 10. Source: Skyrim.esm:083042 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Join the men attacking <Alias=Fort>". Source: Skyrim.esm:083042 QOBJ 10. **files**
- Target alias Attacker1 (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Global TRUEGlobal: record 1.0 (Skyrim.esm). **files**
- Global CWImperial: record 1.0 (Skyrim.esm). **files**
- Global CWSons: record 2.0 (Skyrim.esm). **files**

**Gives**: nothing on its completing stages.

## 13. A False Front (`CWMission03`, Skyrim.esm:03BCC4, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias FieldCO of CWMission03 (A False Front) (from event)), "Consider it done.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005B6B6.Fragment_0 on INFO Skyrim.esm:05B6B6 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission03 (A False Front) (from event)), "Consider it done.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005B6B7.Fragment_0 on INFO Skyrim.esm:05B6B7 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission03 (A False Front) (from event)), "Consider it done.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005B6B8.Fragment_0 on INFO Skyrim.esm:05B6B8 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission03 (A False Front) (from event)), "Consider it done.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005B6B9.Fragment_0 on INFO Skyrim.esm:05B6B9 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission03 (A False Front) (from event)), "Consider it done.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005B6BA.Fragment_0 on INFO Skyrim.esm:05B6BA (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission03 (A False Front) (from event)), "Consider it done.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005B6BB.Fragment_0 on INFO Skyrim.esm:05B6BB (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission03 (A False Front) (from event)), "Consider it done.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005B6BC.Fragment_0 on INFO Skyrim.esm:05B6BC (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission03 (A False Front) (from event)), "Consider it done.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005B6BD.Fragment_0 on INFO Skyrim.esm:05B6BD (Skyrim.esm). **script**
- and 15 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Retrieve the <Alias=Courier>'s package", shown at stage 20. Source: Skyrim.esm:03BCC4 QOBJ 20. **files**
- CWMission03 (A False Front) calls SetStage 20. Source: CWMission03Script.OnGainLOS on Skyrim.esm:03BCC4 (LoreRim - Dialogue Patch.esp). **script**
- CWMission03 (A False Front) calls SetStage 15. Source: cwplayerscript.OnLocationChange on Skyrim.esm:03BCC4 (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with someone the line does not name (named by alias InnkeeperA of CWMission03 (A False Front) (run time)), "Seen any Stormcloak couriers lately?": SetStage 20 (when: A False Front stage 21 not done; fn629 == CWImperial (now 1); the speaker is the one in alias InnkeeperA; fn360 == 1; fn403 >= 1 or A False Front stage 20 done). Reply: "He's in the inn. Look around. I'm sure you'll find him." Source: TIF__0001E3C6.Fragment_0 on INFO Skyrim.esm:01E3C6 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias InnkeeperA of CWMission03 (A False Front) (run time)), "Seen any Stormcloak couriers lately?": SetStage 20 (when: A False Front stage 21 not done; fn629 == CWImperial (now 1); the speaker is the one in alias InnkeeperA; fn360 == 0; fn403 >= 1 or A False Front stage 20 done). Reply: "He was here, but he left. If you leave now, you can probably catch him." Source: TIF__0001E3C7.Fragment_0 on INFO Skyrim.esm:01E3C7 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias InnkeeperA of CWMission03 (A False Front) (run time)), "Seen any Imperial couriers lately?": SetStage 20 (when: A False Front stage 21 not done; fn629 == CWSons (now 2); the speaker is the one in alias InnkeeperA; fn360 == 1; fn403 >= 1 or A False Front stage 20 done). Reply: "He's in the inn. Look around. I'm sure you'll find him." Source: TIF__000D288F.Fragment_0 on INFO Skyrim.esm:0D288F (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias InnkeeperA of CWMission03 (A False Front) (run time)), "Seen any Imperial couriers lately?": SetStage 20 (when: A False Front stage 21 not done; fn629 == CWSons (now 2); the speaker is the one in alias InnkeeperA; fn360 == 0; fn403 >= 1 or A False Front stage 20 done). Reply: "He was here, but he left. If you leave now, you can probably catch him." Source: TIF__000D2890.Fragment_0 on INFO Skyrim.esm:0D2890 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias InnkeeperA of CWMission03 (A False Front) (run time)), "Maybe some gold will help? (<BribeCost> gold)": SetStage 20 (when: fn654 == 1; the speaker is the one in alias InnkeeperA or the speaker is the one in alias InnkeeperB). Reply: "Well, if you insist..." Source: TIF__000E67D3.Fragment_1 on INFO Skyrim.esm:0E67D3 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias InnkeeperA of CWMission03 (A False Front) (run time)), "Waste my time, and my comrades won't be so lenient when they come to this town.": SetStage 20 (when: the speaker is the one in alias InnkeeperA or the speaker is the one in alias InnkeeperB). Reply: "Now, now! That won't be necessary." Source: TIF__000C27F0.Fragment_1 on INFO Skyrim.esm:0C27F0 (Immersive Speech Dialogues.esp). **script**

**Who and where**

- First objective: "Find the <Alias=Courier>". Source: Skyrim.esm:03BCC4 QOBJ 10. **files**
- Target alias InnMarkerA (run time): nothing the records or scripts name. **files**
- Target alias InnMarkerB (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Global TRUEGlobal: record 1.0 (Skyrim.esm). **files**
- Global CWImperial: record 1.0 (Skyrim.esm). **files**
- Global CWSons: record 2.0 (Skyrim.esm). **files**

**Gives**: nothing on its completing stages.

## 14. Rescue from <Alias=AttackPoint> (`CWMission04`, Skyrim.esm:035A23, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias FieldCO of CWMission04 (Rescue from <Alias=AttackPoint>) (from event)), "Nothing I can't handle.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005C614.Fragment_0 on INFO Skyrim.esm:05C614 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission04 (Rescue from <Alias=AttackPoint>) (from event)), "Nothing I can't handle.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005C615.Fragment_0 on INFO Skyrim.esm:05C615 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission04 (Rescue from <Alias=AttackPoint>) (from event)), "Nothing I can't handle.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005C6D2.Fragment_0 on INFO Skyrim.esm:05C6D2 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission04 (Rescue from <Alias=AttackPoint>) (from event)), "Nothing I can't handle.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005C78F.Fragment_0 on INFO Skyrim.esm:05C78F (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission04 (Rescue from <Alias=AttackPoint>) (from event)), "Nothing I can't handle.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005C791.Fragment_0 on INFO Skyrim.esm:05C791 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission04 (Rescue from <Alias=AttackPoint>) (from event)), "Nothing I can't handle.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005C793.Fragment_0 on INFO Skyrim.esm:05C793 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission04 (Rescue from <Alias=AttackPoint>) (from event)), "Nothing I can't handle.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005C796.Fragment_0 on INFO Skyrim.esm:05C796 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission04 (Rescue from <Alias=AttackPoint>) (from event)), "Nothing I can't handle.": SetStage 10 (when: fn426 == 1; the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__0005C799.Fragment_0 on INFO Skyrim.esm:05C799 (Skyrim.esm). **script**
- and 15 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Sneak into the fort", shown at stage 12. Source: Skyrim.esm:035A23 QOBJ 12. **files**
- CWMission04 (Rescue from <Alias=AttackPoint>) calls SetStage 11. Source: CWMission04FriendScript.OnUpdate on Skyrim.esm:035A23 (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with Ralof, placed in Helgen, "What's the plan?": SetStage 12 (when: the speaker is Ralof; fn249 == 1; Rescue from <Alias=AttackPoint> stage < 15; the speaker is the one in alias Friend). Reply: "We found a cave under the lake. With luck, it'll lead into the prison." Source: TIF__000D87F8.Fragment_0 on INFO Skyrim.esm:0D87F8 (Skyrim.esm). **script**
- Dialogue with Hadvar, placed in Helgen, "What's the plan?": SetStage 12 (when: the speaker is Hadvar; fn249 == 1; Rescue from <Alias=AttackPoint> stage < 15; the speaker is the one in alias Friend). Reply: "There's a grate outside the wall. Looks like it used to be buried in snow. I don't think they know it's there." Source: TIF__000D87F9.Fragment_0 on INFO Skyrim.esm:0D87F9 (Skyrim.esm). **script**

**Who and where**

- First objective: "Meet the men near <Alias=AttackPoint>". Source: Skyrim.esm:035A23 QOBJ 10. **files**
- Target alias Friend (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Global TRUEGlobal: record 1.0 (Skyrim.esm). **files**
- Global CWImperial: record 1.0 (Skyrim.esm). **files**
- Global CWSons: record 2.0 (Skyrim.esm). **files**

**Gives**: nothing on its completing stages.

## 15. Compelling Tribute (`CWMission07`, Skyrim.esm:0504F0, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias FieldCO of CWMission07 (Compelling Tribute) (from event)), "I'll get proof... and <Alias=Steward>'s cooperation.": SetStage 10 (when: the speaker is the one in alias FieldCO; GetInFaction Imperial Legion == 1). Source: TIF__000504C4.Fragment_0 on INFO Skyrim.esm:0504C4 (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias FieldCO of CWMission07 (Compelling Tribute) (from event)), "I'll get proof... and <Alias=Steward>'s cooperation.": SetStage 10 (when: the speaker is the one in alias FieldCO; GetInFaction Sons of Skyrim == 1). Source: TIF__000504C5.Fragment_0 on INFO Skyrim.esm:0504C5 (Skyrim.esm). **script**
- Story manager node CWRiftQuestMission07Node, event: script event; conditions up its parents: fn565 == 1; fn629 == 0; fn606 == CWImperial (now 1); fn606 == CWImperial (now 1); fn606 != CWImperial (now 1); fn606 >= CWImperial (now 1); fn606 >= CWImperial (now 1); fn606 >= CWImperial (now 1); fn606 >= CWImperial (now 1); fn606 != CWImperial (now 1); fn629 == CWImperial (now 1); fn629 == 1. Source: CWRiftQuestMission07Node Skyrim.esm:0CD6D9 (Skyrim.esm). **files**
- Story manager node CWReachQuestMission07Node, event: script event; conditions up its parents: fn565 == 1; fn629 == 0; fn606 == CWSons (now 2); fn606 == CWSons (now 2); fn606 != CWSons (now 2); fn606 <= CWSons (now 2); fn606 <= CWSons (now 2); fn606 <= CWSons (now 2); fn606 <= CWSons (now 2); fn606 != CWSons (now 2); fn629 == CWSons (now 2); fn629 == 1. Source: CWReachQuestMission07Node Skyrim.esm:0CD6D2 (Skyrim.esm). **files**
- Story manager node CWMissionNode, event: script event; conditions up its parents: global TRUEGlobal == 0 (now 1); GetEventData CWMissionStart == 1. Source: CWMissionNode Skyrim.esm:0216A8 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Blackmail <Alias=Steward>", shown at stage 20. Source: Skyrim.esm:0504F0 QOBJ 20. **files**
- CWMission07 (Compelling Tribute) calls SetStage 20. Source: DefaultAddItemAliasScript.OnContainerChanged on Skyrim.esm:0504F0 (LoreRim - Dialogue Patch.esp). **script**

**Who and where**

- First objective: "Find evidence". Source: Skyrim.esm:0504F0 QOBJ 10. **files**
- Target alias Evidence (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Global TRUEGlobal: record 1.0 (Skyrim.esm). **files**
- Global CWImperial: record 1.0 (Skyrim.esm). **files**
- Global CWSons: record 2.0 (Skyrim.esm). **files**

**Gives**: nothing on its completing stages.

## 16. <Alias=QuestNameLocation> (`CWObj`, Skyrim.esm:029940, LoreRim - Dialogue Patch.esp)

**Started by**

- CWFortSiegeFort (The Battle for <Alias=Fort>) calls at stage 950 SetStage 1; at stage 950 SetStage 1; at stage 950 SetStage 1; at stage 950 SetStage 1; at stage 950 SetStage 1; at stage 9000 SetStage 1; at stage 9000 SetStage 1; at stage 9000 SetStage 1; at stage 9000 SetStage 1; at stage 9000 SetStage 1. Sources: QF_CWFortSiegeFort_00083042.fragment_31, QF_CWFortSiegeFort_00083042.fragment_20 on Skyrim.esm:083042. **script**
- CWSiege, a helper quest with JarlWhiterun, JarlHaafingar, JarlEastmarch calls SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; at stage 200 SetStage 1; at stage 200 SetStage 1; at stage 200 SetStage 1; at stage 200 SetStage 1; at stage 200 SetStage 1; at stage 200 SetStage 1; at stage 200 SetStage 1; at stage 200 SetStage 1; at stage 200 SetStage 1; at stage 200 SetStage 1; CWSiege is started by CW03 (Message to Whiterun) at stage 240 (SetStage 1); story manager node CWSiegeQuestsNode (event: script event; GetEventData CWSiegeStart == 1). Sources: CWSiegeScript.FailAttackQuest, CWSiegeScript.SucceedDefenseQuest, CWSiegeScript.FailDefenseQuest, QF_CWSiege_000954E1.fragment_25 on Skyrim.esm:0954E1. **script**
- CWFortSiegeCapital (The Battle for <Alias=Fort>) calls at stage 950 SetStage 1; at stage 950 SetStage 1; at stage 950 SetStage 1; at stage 950 SetStage 1; at stage 950 SetStage 1; at stage 9000 SetStage 1; at stage 9000 SetStage 1; at stage 9000 SetStage 1; at stage 9000 SetStage 1; at stage 9000 SetStage 1. Sources: QF_CWFortSiege_00087C21.fragment_31, QF_CWFortSiege_00087C21.fragment_20 on Skyrim.esm:087C21. **script**
- CW, a helper quest with Tullius, Ulfric, Rikke calls SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; SetStage 1; at stage 30 SetStage 1; at stage 30 SetStage 1; at stage 30 SetStage 1; at stage 30 SetStage 1; CW is started by CWMissionQuickStart, a helper quest at stage 200 (SetStage 2); CWMissionQuickStart, a helper quest at stage 42 (SetStage 2); CWMissionQuickStart, a helper quest at stage 600 (SetStage 1); CWMissionQuickStart, a helper quest at stage 71 (SetStage 1); the start-game flag. Sources: CWScript.modObjectiveByEnemySoldierDeath, CWScript.updateObjective, CWScript.displayFactionLeaderObjective, CWScript.modObjectiveByMissionSuccess, CWScript.completeCWObj, CWScript.failCWObj, CWScript.WinHoldOffScreenIfNotDoingCapitalBattles, CWScript.modObjectiveBySabotage, QF_CW_00019E53.fragment_38 on Skyrim.esm:019E53. **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:029940 DNAM (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- CWSiegeObj (Battle for <Alias=City>) at stage 9000 calls SetStage 1. Source: QF_CWSiegeObj_00096E71.fragment_1 (LoreRim - Dialogue Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report to <Alias=CWFieldCOSonsWhiterunCamp>". Source: Skyrim.esm:029940 QOBJ 11. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Report to <Alias=WhiterunCapitalImperialFieldCO>". Source: Skyrim.esm:029940 QOBJ 10. **files**
- Target alias WhiterunCapitalImperialFieldCO (forced): Legate Quentin Cipius (forced reference, placed in Whiterun). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Whiterun: 2 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 17. Attack <Alias=Capital> (`CWResolution01`, Skyrim.esm:02B272, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias FieldCO of CWResolution01 (Attack <Alias=Capital>) (from event)), "(Invisible Continue)(Forced Good bye) Time Limit to Attack": SetStage 10 (when: the speaker is the one in alias FieldCO; fn629 == 1). Source: TIF__0002C151.Fragment_0 on INFO Skyrim.esm:02C151 (Skyrim.esm). **script**
- Story manager node CWResolutionAttackCaptialSettlementNode, event: script event; conditions up its parents: GetEventData CWResolution01Start == 1. Source: CWResolutionAttackCaptialSettlementNode Skyrim.esm:02B35B (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Destroy the barricade blocking the Jarl's house.", shown at stage 20. Source: Skyrim.esm:02B272 QOBJ 20. **files**
- CWResolution01 (Attack <Alias=Capital>) calls SetStage 20. Source: CWResolution01SoldierFriendlyScript.OnActivate on Skyrim.esm:02B272 (LoreRim - Dialogue Patch.esp). **script**
- CWResolution01 (Attack <Alias=Capital>) calls SetStage 20. Source: CWResolution01SoldierFriendlyScript.OnUpdate on Skyrim.esm:02B272 (LoreRim - Dialogue Patch.esp). **script**

**Who and where**

- First objective: "Rendezvous with army.". Source: Skyrim.esm:02B272 QOBJ 10. **files**
- Target alias CapitalEdgeMarker (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: fn426 == 1. **files**

**Gives**: nothing on its completing stages.

## 18. Defend <Alias=Capital> (`CWResolution02`, Skyrim.esm:01FA52, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias FieldCO of CWResolution02 (Defend <Alias=Capital>) (from event)), "(Invisible Continue)(Forced Goodbye) Time Limit to Attack": SetStage 10 (when: the speaker is the one in alias FieldCO; fn629 == 1). Source: TIF__00021115.Fragment_0 on INFO Skyrim.esm:021115 (Skyrim.esm). **script**
- Story manager node CWResolutionDefendCapitalSettlementNode, event: script event; conditions up its parents: GetEventData CWResolution02Start == 1. Source: CWResolutionDefendCapitalSettlementNode Skyrim.esm:02111D (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Defend the barricade blocking the Jarl's house.", shown at stage 20. Source: Skyrim.esm:01FA52 QOBJ 20. **files**
- CWResolution02 (Defend <Alias=Capital>) calls SetStage 20. Source: CWResolution02SoldierFriendlyScript.OnActivate on Skyrim.esm:01FA52 (LoreRim - Dialogue Patch.esp). **script**
- CWResolution02 (Defend <Alias=Capital>) calls SetStage 20. Source: CWResolution02SoldierFriendlyScript.OnUpdate on Skyrim.esm:01FA52 (LoreRim - Dialogue Patch.esp). **script**

**Who and where**

- First objective: "Rendezvous with army.". Source: Skyrim.esm:01FA52 QOBJ 10. **files**
- Target alias CapitalEdgeMarker (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: fn426 == 1. **files**

**Gives**: nothing on its completing stages.

## 19. Battle of <Alias=City> (`CWSiegeAttackObj`, Skyrim.esm:04E857, LoreRim - Dialogue Patch.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Break through the enemy Barricade". Source: Skyrim.esm:04E857 QOBJ 5. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Meet with the <Alias=General>". Source: Skyrim.esm:04E857 QOBJ 0. **files**
- Target alias General (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 20. Defense of <Alias=City> (`CWSiegeDefendObj`, Skyrim.esm:02FF95, LoreRim - Dialogue Patch.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Join the General on the Front Line.". Source: Skyrim.esm:02FF95 QOBJ 10. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Meet with the <Alias=General> on the Front Line.". Source: Skyrim.esm:02FF95 QOBJ 0. **files**
- Target alias General (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 21. Battle for <Alias=City> (`CWSiegeObj`, Skyrim.esm:096E71, LoreRim - Dialogue Patch.esp)

**Started by**

- CWSiege, a helper quest with JarlWhiterun, JarlHaafingar, JarlEastmarch calls at stage 0 Start; at stage 0 SetStage 1; CWSiege is started by CW03 (Message to Whiterun) at stage 240 (SetStage 1); story manager node CWSiegeQuestsNode (event: script event; GetEventData CWSiegeStart == 1). Sources: QF_CWSiege_000954E1.fragment_0 on Skyrim.esm:0954E1. **script**
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Break through the Enemy Barricade". Source: Skyrim.esm:096E71 QOBJ 1005. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Get your Orders from <Alias=General>". Source: Skyrim.esm:096E71 QOBJ 1000. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 22. Civil War Champion Armor (`CWCRQuest`, Civil War Champions - Reduced Cut.esp:000800, Civil War Champions - Reduced Cut.esp)

**Started by**

- CWCRQuestChangeLoc, a helper quest calls SetStage 10; CWCRQuestChangeLoc is started by story manager node CWCRQuestNode (event: change location; Civil War Champion Armor hasn't started; GetQuestRunning Battle for <Alias=City> == 1). Source: CWCRQuestChangeLocScript.OnStoryChangeLocation on Civil War Champions - Reduced Cut.esp:000805 (Civil War Champions - Reduced Cut.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Pick up champion armor from your commanding officer". Source: Civil War Champions - Reduced Cut.esp:000800 QOBJ 10. **files**
- Target alias ImpQuestGiver (forced): Legate Adventus Caesennius (forced reference, placed in Solitude). **files**
- Target alias SonsQuestGiver (forced): Captain Yrsarald Thrice-Pierced (forced reference, placed in Windhelm). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Solitude: 7 doors, 4 locked; Windhelm: 4 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: ccFFBSSE001_LItemArmorImperialDragon (levelled: an item) (stage 100, CWCR_QF_CWCRQuest_06005900.fragment_1); ccFFBSSE001_LItemArmorStormbear (levelled: an item) (stage 100, CWCR_QF_CWCRQuest_06005900.fragment_3).

## 23. Repairing the Cities (`CWRepairs`, CWRepairs.esp:000803, CWRepairs.esp)

**Started by**

- Story manager node CWRepairsQN, event: change location; conditions up its parents: Repairing the Cities stage < 10; GetDead == 1 or GetDead == 1 or CWFinale stage 500 done; the place you enter isn't Solitude; fn359 == 0; the place you enter isn't Windhelm; fn359 == 0. Source: CWRepairsQN CWRepairs.esp:000E05 (CWRepairs.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Works are underway, now it's just a matter of waiting.", shown at stage 20. Source: CWRepairs.esp:000803 QOBJ 20. **files**
- CWRepairs (Repairing the Cities) calls SetStage 20. Source: CWRepairsScript.StartRepairs on CWRepairs.esp:000803 (CWRepairs.esp). **script**

**Who and where**

- First objective: "During the next two days, the Temple of the Divines in Solitude will be collecting donations to accelerate the reconstruction.". Source: CWRepairs.esp:000803 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

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

### WEDL13 (Looking to join Imperials)

- What it does: stage 10: SetStage 1. Source: QF_WEDL13_000BD757 on Skyrim.esm:0BD757 (Skyrim.esm). **script**
- Started by: story manager node WERoadQuestNode (script event; GetEventData WERoadStart == 1; global WEEnabled == 1 (now 1); GetEventData WEStart == 1 or GetEventData WERoadStart == 1; WERoadQuestNode Skyrim.esm:102D65 (Dawnguard.esm)).
- In one sentence: WEDL13 (Looking to join Imperials) stage 10: SetStage 1 on CW00A (Imperial Introductions); it is started by story manager node WERoadQuestNode (script event; GetEventData WERoadStart == 1; global WEEnabled == 1 (now 1); GetEventData WEStart == 1 or GetEventData WERoadStart == 1; WERoadQuestNode Skyrim.esm:102D65 (Dawnguard.esm)).

### MQ102A (Season Unending)

- What it does: stage 22: SetStage 1. Source: QF_MQ102_0002BF9C on Skyrim.esm:02BF9C (Skyrim.esm). **script**
- Started by: QF_MQ102_0004E50D.fragment_75 on Skyrim.esm:04E50D (Unofficial Skyrim Special Edition Patch.esp); QF_MQ102_0004E50D.fragment_75 on Skyrim.esm:04E50D (Unofficial Skyrim Special Edition Patch.esp); QF_MQ102_0004E50D.fragment_78 on Skyrim.esm:04E50D (Unofficial Skyrim Special Edition Patch.esp); QF_MQ102_0004E50D.fragment_86 on Skyrim.esm:04E50D (Unofficial Skyrim Special Edition Patch.esp).
- In one sentence: MQ102A (Season Unending) stage 22: SetStage 1 on CW00A (Imperial Introductions); it is started by QF_MQ102_0004E50D.fragment_75 on Skyrim.esm:04E50D (Unofficial Skyrim Special Edition Patch.esp); QF_MQ102_0004E50D.fragment_75 on Skyrim.esm:04E50D (Unofficial Skyrim Special Edition Patch.esp); QF_MQ102_0004E50D.fragment_78 on Skyrim.esm:04E50D (Unofficial Skyrim Special Edition Patch.esp); QF_MQ102_0004E50D.fragment_86 on Skyrim.esm:04E50D (Unofficial Skyrim Special Edition Patch.esp).

### dialogue INFO Skyrim.esm:056B24

- Speaker: Alvor (Nord), placed in Alvor and Sigrid's House. Named by: GetIsID.
- The player's prompt: "What do you think about the war?".
- The reply: "People are rightly stirred up about the damn Thalmor being allowed to roam around arresting people, just for worshipping Talos." / "But was it worth tearing Skyrim apart, and maybe destroying the Empire? No, Ulfric will have a lot to answer for in the end." / "Nords have always supported the Empire, and the Empire has always been good for Skyrim.".
- When it's offered: the speaker is Alvor.
- What it does: SetStage 1 on CW00A (Imperial Introductions). Source: TIF__00056B24.Fragment_1 on INFO Skyrim.esm:056B24 (Skyrim.esm); topic MQ102ACivilWarTopic. **script**
- In one sentence: Talk to Alvor (Nord) in Alvor and Sigrid's House and choose "What do you think about the war?", when the speaker is Alvor: SetStage 1 on CW00A (Imperial Introductions).

### dialogue INFO Skyrim.esm:0D39AF

- Speaker: Alvor (Nord), placed in Alvor and Sigrid's House. Named by: alias Alvor of MQ102A (Season Unending) (unique).
- The player's prompt: "You support the Empire, then?".
- The reply: "Of course. Skyrim has always been part of the Empire." / "That doesn't mean I support everything the Empire's been doing lately, but Nords have never been fair-weather friends.".
- When it's offered: the speaker is the one in alias Alvor.
- What it does: SetStage 1 on CW00A (Imperial Introductions). Source: TIF__000D39AF.Fragment_0 on INFO Skyrim.esm:0D39AF (Skyrim.esm); topic MQ102AJarlBalgruufA2. **script**
- In one sentence: Talk to Alvor (Nord) in Alvor and Sigrid's House and choose "You support the Empire, then?", when the speaker is the one in alias Alvor: SetStage 1 on CW00A (Imperial Introductions).

### dialogue INFO Skyrim.esm:0D3C58

- Speaker: Hadvar (Nord), placed in Helgen. Named by: GetIsID.
- The player's prompt: "".
- The reply: "The Legion's always looking for strong, capable warriors. If you think you've got what it takes, our headquarters is in Solitude.".
- When it's offered: fn359 == 0; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Imperial Legion == 1; the speaker isn't Hadvar.
- What it does: SetStage 1 on CW00A (Imperial Introductions). Source: TIF__000D3C58.Fragment_0 on INFO Skyrim.esm:0D3C58 (Skyrim.esm); topic CW00Hello. **script**
- In one sentence: Talk to Hadvar (Nord) in Helgen, when fn359 == 0; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Imperial Legion == 1; the speaker isn't Hadvar: SetStage 1 on CW00A (Imperial Introductions).

### dialogue INFO Skyrim.esm:0D3C57

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "...".
- The reply: "If you are, then you make your way to Windhelm and talk to the man himself. If you're not, well, friend, you'd best walk away before this gets ugly.".
- When it's offered: fn359 == 0; GetInFaction CWFieldCOFaction == 1; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Sons of Skyrim == 1; fn426 == 0; fn426 == 0.
- What it does: SetStage 2 on CW00A (Imperial Introductions). Source: TIF__000D3C57.Fragment_0 on INFO Skyrim.esm:0D3C57 (Unofficial Skyrim Special Edition Patch.esp); topic CW00JoinTopicContinue. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "...", when fn359 == 0; GetInFaction CWFieldCOFaction == 1; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Sons of Skyrim == 1; fn426 == 0; fn426 == 0: SetStage 2 on CW00A (Imperial Introductions).

### dialogue INFO Skyrim.esm:0FBA68

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "...".
- The reply: "If you are, then you talk to the man himself. If you're not, well, friend, you'd best walk away before this gets ugly.".
- When it's offered: fn359 == 1; GetInFaction CWFieldCOFaction == 1; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Sons of Skyrim == 1; fn426 == 0; fn426 == 0.
- What it does: SetStage 2 on CW00A (Imperial Introductions). Source: TIF__000FBA68.Fragment_0 on INFO Skyrim.esm:0FBA68 (Unofficial Skyrim Special Edition Patch.esp); topic CW00JoinTopicContinue. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "...", when fn359 == 1; GetInFaction CWFieldCOFaction == 1; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Sons of Skyrim == 1; fn426 == 0; fn426 == 0: SetStage 2 on CW00A (Imperial Introductions).

### dialogue INFO Skyrim.esm:0D3C5A

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "How does one join the Imperial Legion?".
- The reply: "Think you've got the mettle, eh?" / "Honestly, the Legion can use all the able bodies it can muster. We have our hands full. A dead king, a rebellion, and now dragons? Skyrim's a mess." / "If you're serious, make your way to Solitude. Our headquarters is Castle Dour. You'll find General Tullius there, commanding our forces in Skyrim." / "But talk to Legate Rikke. She handles the local recruiting.".
- When it's offered: Unbound completed; fn359 == 0; GetInFaction CWFieldCOFaction == 1; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Imperial Legion == 1; fn426 == 0; fn426 == 0.
- What it does: SetStage 1 on CW00A (Imperial Introductions). Source: TIF__000D3C5A.Fragment_0 on INFO Skyrim.esm:0D3C5A (AlternatePerspective.esp); topic CW00JoinTopic. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "How does one join the Imperial Legion?", when Unbound completed; fn359 == 0; GetInFaction CWFieldCOFaction == 1; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Imperial Legion == 1; fn426 == 0; fn426 == 0: SetStage 1 on CW00A (Imperial Introductions).

### dialogue INFO Skyrim.esm:0FBA67

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "How does one join the Imperial Legion?".
- The reply: "Think you've got the mettle, eh?" / "Honestly, the Legion can use all the able bodies it can muster. We have our hands full. A dead king, a rebellion, and now dragons? Skyrim's a mess." / "If you're serious, you're in the right place. Our headquarters is in Castle Dour. Here you'll find General Tullius, commanding our forces in Skyrim." / "But talk to Legate Rikke. She handles the local recruiting.".
- When it's offered: Unbound completed; fn359 == 1; GetInFaction CWFieldCOFaction == 1; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Imperial Legion == 1; fn426 == 0; fn426 == 0.
- What it does: SetStage 1 on CW00A (Imperial Introductions). Source: TIF__000FBA67.Fragment_0 on INFO Skyrim.esm:0FBA67 (AlternatePerspective.esp); topic CW00JoinTopic. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "How does one join the Imperial Legion?", when Unbound completed; fn359 == 1; GetInFaction CWFieldCOFaction == 1; GetInFaction CWDialogueSoldierFaction == 1; GetInFaction Imperial Legion == 1; fn426 == 0; fn426 == 0: SetStage 1 on CW00A (Imperial Introductions).

### dialogue INFO Skyrim.esm:0D514D

- Speaker: Legate Rikke (Nord), placed in Castle Dour. Named by: GetIsID.
- The player's prompt: "".
- The reply: "Are you lost? ".
- When it's offered: Imperial Introductions stage 20 not done; Imperial Introductions stage 10 not done; fn249 == 1; the speaker is Legate Rikke.
- What it does: SetStage 7 on CW00A (Imperial Introductions). Source: TIF__000D514D.Fragment_2 on INFO Skyrim.esm:0D514D (Skyrim.esm); topic CW00RikkeBlockingTopic. **script**
- In one sentence: Talk to Legate Rikke (Nord) in Castle Dour, when Imperial Introductions stage 20 not done; Imperial Introductions stage 10 not done; fn249 == 1; the speaker is Legate Rikke: SetStage 7 on CW00A (Imperial Introductions).

### dialogue INFO Skyrim.esm:0D5136

- Speaker: General Tullius (Imperial), placed in Castle Dour. Named by: GetIsID.
- The player's prompt: "...".
- The reply: "I suspect we might have use for someone resourceful like you. Not many survived Helgen." / "Besides, I'm sure your being imprisoned was all a terrible misunderstanding. ".
- When it's offered: the speaker is General Tullius.
- What it does: SetStage 10 on CW00A (Imperial Introductions). Source: TIF__000D5136.Fragment_0 on INFO Skyrim.esm:0D5136 (Skyrim.esm); topic CW00TulliusGreetTalkRikke. **script**
- In one sentence: Talk to General Tullius (Imperial) in Castle Dour and choose "...", when the speaker is General Tullius: SetStage 10 on CW00A (Imperial Introductions).

### dialogue INFO Skyrim.esm:0C348B

- Speaker: General Tullius (Imperial), placed in Castle Dour. Named by: GetIsID.
- The player's prompt: "Hello.".
- The reply: "I remember you, you were at Helgen. Speak to Legate Rikke. I suspect we could use someone like you.".
- When it's offered: Unbound completed; Imperial Introductions stage 10 not done; fn629 == 2; the speaker is General Tullius.
- What it does: SetStage 10 on CW00A (Imperial Introductions). Source: TIF__000C348B.Fragment_0 on INFO Skyrim.esm:0C348B (AlternatePerspective.esp); topic CW00TulliusForcegreetTopic. **script**
- In one sentence: Talk to General Tullius (Imperial) in Castle Dour and choose "Hello.", when Unbound completed; Imperial Introductions stage 10 not done; fn629 == 2; the speaker is General Tullius: SetStage 10 on CW00A (Imperial Introductions).

### dialogue INFO AlternatePerspective.esp:206783

- Speaker: General Tullius (Imperial), placed in Castle Dour. Named by: GetIsID.
- The player's prompt: "I don't want to sit idly by after what I've witnessed. I want to join the Legion!".
- The reply: "I suspect we might have use for someone resourceful like you. Not many survived Helgen.".
- When it's offered: the speaker is General Tullius.
- What it does: SetStage 10 on CW00A (Imperial Introductions). Source: TIF_AP_04206783.Fragment_0 on INFO AlternatePerspective.esp:206783 (AlternatePerspective.esp); topic CW00TulliusGreetTalkRikkateAP. **script**
- In one sentence: Talk to General Tullius (Imperial) in Castle Dour and choose "I don't want to sit idly by after what I've witnessed. I want to join the Legion!", when the speaker is General Tullius: SetStage 10 on CW00A (Imperial Introductions).

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
