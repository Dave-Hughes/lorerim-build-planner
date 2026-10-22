# Start check: The Dragonborn (`main-quest`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Unbound (`MQ101`, Skyrim.esm:03372B, Alternate Perspective - Gate to Sovngarde Edition.esp)

**Started by**

- AP_DialogueHelgen, a helper quest with Player, RestingPilgrimOwner, RestingPilgrimBackup calls SetStage 6; SetStage 7; AP_DialogueHelgen is started by MQ101 (Unbound) (Start); MQ101 (Unbound) at stage 0 (Start). Sources: APMessengerUtil.SkipKeepEntrance on AlternatePerspective.esp:1E301D. **script**
- APS_VanillaStart, a helper quest at stage 0 calls SetStage 4; APS_VanillaStart is started by nothing in the records or scripts (**unread**). Source: QF_APS_VanillaStart_053BF197.fragment_0 on AlternatePerspective.esp:3BF197 (AlternatePerspective.esp). **script**
- APS_MQSkipKeep, a helper quest calls at stage 5 SetStage 6; at stage 5 SetStage 7; APS_MQSkipKeep is started by nothing in the records or scripts (**unread**). Sources: QF_APS_MQSkipKeep_0547F943.fragment_0 on AlternatePerspective.esp:47F943. **script**
- Dialogue with Matlara (named by alias RestingPilgrimOwner of AP_DialogueHelgen (unique)), placed in Helgen, "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))": SetStage 1 (when: Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold). Source: TIF_AP_05075139.Fragment_0 on INFO AlternatePerspective.esp:075139 (AlternatePerspective.esp). **script**
- Dialogue with Shazdehviir, placed in Helgen, "Skip to Helgen Keep": SetStage 6 (when: the speaker is Shazdehviir). Source: TIF_AP_0638C6E9.Fragment_1 on INFO AlternatePerspective.esp:38C6E9 (AlternatePerspective.esp). **script**
- Dialogue with Shazdehviir, placed in Helgen, "Skip to Helgen Keep": SetStage 7 (when: the speaker is Shazdehviir). Source: TIF_AP_0638C6E9.Fragment_1 on INFO AlternatePerspective.esp:38C6E9 (AlternatePerspective.esp). **script**
- (First objective shown at stage 160; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ102 (Before the Storm) at stage 10 calls SetStage 900. Source: QF_MQ102_0004E50D.fragment_83 (Unofficial Skyrim Special Edition Patch.esp).
- MQ102 (Before the Storm) at stage 12 calls SetStage 900. Source: QF_MQ102_0004E50D.fragment_128 (Unofficial Skyrim Special Edition Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Enter the Keep with Hadvar or Ralof". Source: Skyrim.esm:03372B QOBJ 50. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Make your way to the Keep". Source: Skyrim.esm:03372B QOBJ 30. **files**
- Target alias Ralof (unique): Ralof (unique actor, placed in Helgen). **files**
- Target alias ObjectiveInn01 (forced): a marker (forced reference, placed in Helgen). **files**
- Target alias Hadvar (unique): Hadvar (unique actor, placed in Helgen). **files**
- Target alias ObjectiveKeepCourtyard (forced): a marker (forced reference, placed in Helgen). **files**

**Needs**

- Its own conditions: Unbound stage >= 4. **files**
- Ways in: Helgen: 6 doors, 3 locked; Helgen: 2 doors, 0 locked; Helgen: 6 doors, 3 locked; Helgen: 6 doors, 3 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Before the Storm (`MQ102`, Skyrim.esm:04E50D, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MQ102B (named "Season Unending" in its record), a helper quest with Gerdur, Hod, Frodnar calls at stage 10 Start; at stage 5 Start; at stage 20 SetStage 10; MQ102B is started by MQ101 (Unbound) at stage 0 (SetStage 1); MQ101 (Unbound) at stage 700 (SetStage 3); MQ101 (Unbound) at stage 800 (SetStage 5). Sources: QF_MQ102B_010A4C68.fragment_5, QF_MQ102B_010A4C68.fragment_38, QF_MQ102B_010A4C68.fragment_8 on Skyrim.esm:02610A. **script**
- MQ102A (named "Season Unending" in its record), a helper quest with Alvor, Sigrid, Dorthe calls at stage 20 SetStage 10; at stage 5 Start; MQ102A is started by MQ101 (Unbound) at stage 0 (SetStage 1); MQ101 (Unbound) at stage 700 (SetStage 3); MQ101 (Unbound) at stage 800 (SetStage 5). Sources: QF_MQ102_0002BF9C.fragment_7, QF_MQ102_0002BF9C.fragment_37 on Skyrim.esm:02BF9C. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ103 (Bleak Falls Barrow) at stage 1 calls SetStage 1. Source: QF_MQ103_000D0800.fragment_5 (LoreRim - Dialogue Patch.esp).
- MQ103 (Bleak Falls Barrow) at stage 1 calls SetStage 50. Source: QF_MQ103_000D0800.fragment_5 (LoreRim - Dialogue Patch.esp).
- MQ103 (Bleak Falls Barrow) at stage 1 calls SetStage 80. Source: QF_MQ103_000D0800.fragment_5 (LoreRim - Dialogue Patch.esp).
- MQ103 (Bleak Falls Barrow) at stage 1 calls SetStage 100. Source: QF_MQ103_000D0800.fragment_5 (LoreRim - Dialogue Patch.esp).
- MQ103 (Bleak Falls Barrow) at stage 1 calls SetStage 110. Source: QF_MQ103_000D0800.fragment_5 (LoreRim - Dialogue Patch.esp).
- MQ103 (Bleak Falls Barrow) at stage 1 calls SetStage 150. Source: QF_MQ103_000D0800.fragment_5 (LoreRim - Dialogue Patch.esp).
- and 1 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "(Optional) Travel to Riverwood with <Alias=FactionFriend>". Source: Skyrim.esm:04E50D QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Talk to <Alias=RiverwoodFriend> in Riverwood". Source: Skyrim.esm:04E50D QOBJ 10. **files**
- Target alias RiverwoodFriend (run time): Gerdur (put there by a script (ForceRefTo)); Alvor (put there by a script (ForceRefTo)). **script**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: REQ_LI_MQ102_Reward2 (levelled: Flawless Amethyst) (stage 160, QF_MQ102_0004E50D.fragment_45); REQ_LI_MQ102_Reward1 (levelled: Flawless Amethyst) (stage 160, QF_MQ102_0004E50D.fragment_45).

## 3. Bleak Falls Barrow (`MQ103`, Skyrim.esm:0D0800, LoreRim - Dialogue Patch.esp)

**Started by**

- MQ102 (Before the Storm) calls at stage 160 SetStage 10; at stage 150 SetStage 8; its stage None is set by Dialogue with Balgruuf the Greater, placed in Dragonsreach: SetStage 160 (when: the speaker is Balgruuf the Greater; Before the Storm stage 150 done; Before the Storm stage 160 not done). Sources: QF_MQ102_0004E50D.fragment_45, QF_MQ102_0004E50D.fragment_115 on Skyrim.esm:04E50D. **script**
- Dialogue with Balgruuf the Greater (named by scene MQ103IntroScene, alias Balgruuf of MQ103 (Bleak Falls Barrow) (unique)), placed in Dragonsreach: SetStage 20; its scene is started by MQ103 (Bleak Falls Barrow) at stage 10. Source: TIF__000D50F1.Fragment_0 on INFO Skyrim.esm:0D50F1 (Skyrim.esm). **script**
- Dialogue with Farengar Secret-Fire, placed in Dragonsreach, "So what do you need me to do?": SetStage 50 (when: the speaker is Farengar Secret-Fire; GetItemCount Dragonstone >= 1). Source: TIF__000D50E1.Fragment_0 on INFO Skyrim.esm:0D50E1 (Skyrim.esm). **script**
- Dialogue with Farengar Secret-Fire, placed in Dragonsreach, "So what do you need me to do?": SetStage 50 (when: the speaker is Farengar Secret-Fire). Source: TIF__000E0EBA.Fragment_0 on INFO Skyrim.esm:0E0EBA (Skyrim.esm). **script**
- Dialogue with Farengar Secret-Fire, placed in Dragonsreach: SetStage 20 (when: the speaker is Farengar Secret-Fire). Source: TIF__000D50D3.Fragment_0 on INFO Skyrim.esm:0D50D3 (Skyrim.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0D0800 DNAM (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ104 (Dragon Rising) at stage 1 calls SetStage 1. Source: QF_MQ104B_0002610C.fragment_6 (LoreRim - Weapons.esp).
- MQ104 (Dragon Rising) at stage 1 calls SetStage 10. Source: QF_MQ104B_0002610C.fragment_6 (LoreRim - Weapons.esp).
- MQ104 (Dragon Rising) at stage 1 calls SetStage 20. Source: QF_MQ104B_0002610C.fragment_6 (LoreRim - Weapons.esp).
- MQ104 (Dragon Rising) at stage 1 calls SetStage 50. Source: QF_MQ104B_0002610C.fragment_6 (LoreRim - Weapons.esp).
- MQ104 (Dragon Rising) at stage 1 calls SetStage 80. Source: QF_MQ104B_0002610C.fragment_6 (LoreRim - Weapons.esp).
- MQ104 (Dragon Rising) at stage 1 calls SetStage 90. Source: QF_MQ104B_0002610C.fragment_6 (LoreRim - Weapons.esp).
- and 6 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Retrieve the Dragonstone", shown at stage 50. Source: Skyrim.esm:0D0800 QOBJ 50. **files**
- e3demo, a helper quest with Arvel at stage 0 calls SetStage 50; e3demo is started by nothing in the records or scripts (**unread**). Source: QF_E3demo_00093637.fragment_0 on Skyrim.esm:093637 (Skyrim.esm). **script**
- MQ104 (Dragon Rising) at stage 1 calls SetStage 20. Source: QF_MQ104B_0002610C.fragment_6 on Skyrim.esm:02610C (LoreRim - Weapons.esp). **script**
- MQ104 (Dragon Rising) at stage 1 calls SetStage 50. Source: QF_MQ104B_0002610C.fragment_6 on Skyrim.esm:02610C (LoreRim - Weapons.esp). **script**
- Dialogue with Balgruuf the Greater (named by scene MQ103IntroScene, alias Balgruuf of MQ103 (Bleak Falls Barrow) (unique)), placed in Dragonsreach: SetStage 20; its scene is started by MQ103 (Bleak Falls Barrow) at stage 10. Reply: "Farengar, I think I've found someone who can help you with your dragon project." Source: TIF__000D50F1.Fragment_0 on INFO Skyrim.esm:0D50F1 (Skyrim.esm). **script**
- Dialogue with Farengar Secret-Fire, placed in Dragonsreach, "So what do you need me to do?": SetStage 50 (when: the speaker is Farengar Secret-Fire; GetItemCount Dragonstone >= 1). Reply: "I, uh, learned of a certain stone tablet said to be housed in Bleak Falls Barrow - a "Dragonstone," said to contain a map of dragon burial sites." Source: TIF__000D50E1.Fragment_0 on INFO Skyrim.esm:0D50E1 (Skyrim.esm). **script**
- Dialogue with Farengar Secret-Fire, placed in Dragonsreach, "So what do you need me to do?": SetStage 50 (when: the speaker is Farengar Secret-Fire). Reply: "I, uh, learned of a certain stone tablet said to be housed in Bleak Falls Barrow - a "Dragonstone," said to contain a map of dragon burial sites." Source: TIF__000E0EBA.Fragment_0 on INFO Skyrim.esm:0E0EBA (Skyrim.esm). **script**
- Dialogue with Farengar Secret-Fire, placed in Dragonsreach: SetStage 20 (when: the speaker is Farengar Secret-Fire). Reply: "Please forgive my earlier rudeness. I am so often interrupted by visitors wandering in, I can occasionally become quite savage." Source: TIF__000D50D3.Fragment_0 on INFO Skyrim.esm:0D50D3 (Skyrim.esm). **script**

**Who and where**

- First objective: "Talk to Farengar". Source: Skyrim.esm:0D0800 QOBJ 15. **files**
- Target alias Farengar (unique): Farengar Secret-Fire (unique actor, placed in Dragonsreach). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dragonsreach: 5 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 4. Dragon Rising (`MQ104`, Skyrim.esm:02610C, LoreRim - Weapons.esp)

**Started by**

- MQ103 (Bleak Falls Barrow) at stage 190 calls SetStage 10; its stage 190 is set by Dialogue with someone the line does not name: SetStage 190 (when: the speaker is the one in alias Farengar; Bleak Falls Barrow stage 180 done; Bleak Falls Barrow stage 190 not done); Dialogue with someone the line does not name: SetStage 190 (when: the speaker is the one in alias Farengar). Source: QF_MQ103_000D0800.fragment_20 on Skyrim.esm:0D0800 (LoreRim - Dialogue Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ105 (The Way of the Voice) at stage 1 calls SetStage 1. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 10. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 30. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 90. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 120. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 150. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- and 5 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet Irileth near the Western Watchtower", shown at stage 40. Source: Skyrim.esm:02610C QOBJ 15. **files**
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 30. Source: QF_MQ105_000242BA.fragment_1 on Skyrim.esm:0242BA (Skyrim.esm). **script**
- Dialogue with Irileth (named by alias Irileth of MQ104 (Dragon Rising) (unique)), placed in Dragonsreach, "I'd rather scout ahead.": SetStage 30 (when: the speaker is the one in alias Irileth). Reply: "Good enough. We'll meet up near the watchtower. Don't take any chances until we get there." Source: TIF__0005DD4E.Fragment_0 on INFO Skyrim.esm:05DD4E (Skyrim.esm). **script**
- Dialogue with Irileth (named by alias Irileth of MQ104 (Dragon Rising) (unique)), placed in Dragonsreach, "I'll come along with you.": SetStage 20 (when: the speaker is the one in alias Irileth). Reply: "Follow me. We're assembling near the main gate." Source: TIF__0005DD48.Fragment_0 on INFO Skyrim.esm:05DD48 (Skyrim.esm). **script**
- Dialogue with Balgruuf the Greater (named by alias Balgruuf of MQ104 (Dragon Rising) (unique)), placed in Dragonsreach, "What about my reward?": SetStage 30 (when: the speaker is the one in alias Balgruuf; Dragon Rising stage 15 done; Dragon Rising stage 40 not done). Reply: "But I haven't forgotten the service you did for me in retrieving the Dragonstone for Farengar." Source: TIF__000DF1F8.Fragment_1 on INFO Skyrim.esm:0DF1F8 (Skyrim.esm). **script**

**Who and where**

- First objective: "Talk to Jarl Balgruuf". Source: Skyrim.esm:02610C QOBJ 5. **files**
- Target alias Balgruuf (unique): Balgruuf the Greater (unique actor, placed in Dragonsreach). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dragonsreach: 5 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: Blade of Whiterun (stage 160, QF_MQ104B_0002610C.fragment_45).

## 5. The Way of the Voice (`MQ105`, Skyrim.esm:0242BA, Skyrim.esm)

**Started by**

- DA08 (named "The Whispering Door" in its record), a helper quest with Fianna at stage 1 calls SetStage 0; DA08 is started by the start-game flag. Source: QF_DA08_0004A37B.fragment_32 on Skyrim.esm:04A37B (TWDQE - Wintersun patch.esp). **script**
- MQ104 (Dragon Rising) at stage 110 calls SetStage 5. Source: QF_MQ104B_0002610C.fragment_39 on Skyrim.esm:02610C (LoreRim - Weapons.esp). **script**
- APS_MQSkipMQ105Hadvar, a helper quest at stage 0 calls SetStage 1; APS_MQSkipMQ105Hadvar is started by APS_MQSkipMQ105, a helper quest at stage 5 (Start). Source: QF_APS_MQSkip_063D36E9.fragment_0 on AlternatePerspective.esp:3D36E9 (AlternatePerspective.esp). **script**
- APS_MQSkipMQ105Ralof, a helper quest at stage 0 calls SetStage 1; APS_MQSkipMQ105Ralof is started by APS_MQSkipMQ105, a helper quest at stage 5 (Start). Source: QF_APS_MQSkipRalof_063D36EA.fragment_0 on AlternatePerspective.esp:3D36EA (AlternatePerspective.esp). **script**
- (First objective shown at stage 8; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 240. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 290. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ106 (A Blade in the Dark) at stage 30 calls SetStage 220. Source: QF_MQ106_00032926.fragment_11 (Skyrim.esm).
- MQ106 (A Blade in the Dark) at stage 1 calls SetStage 1. Source: QF_MQ106_00032926.fragment_2 (Skyrim.esm).
- MQ106 (A Blade in the Dark) at stage 1 calls SetStage 30. Source: QF_MQ106_00032926.fragment_2 (Skyrim.esm).
- MQ106 (A Blade in the Dark) at stage 1 calls SetStage 70. Source: QF_MQ106_00032926.fragment_2 (Skyrim.esm).
- and 3 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Demonstrate your "Unrelenting Force" Shout", shown at stage 30. Source: Skyrim.esm:0242BA QOBJ 20. **files**
- MQ106 (A Blade in the Dark) at stage 1 calls SetStage 30. Source: QF_MQ106_00032926.fragment_2 on Skyrim.esm:032926 (Skyrim.esm). **script**
- MQ104 (Dragon Rising) at stage 150 calls SetStage 10; its stage 150 is set by Dialogue with Lydia (named by the one follower in MQ104 (Dragon Rising)'s aliases), placed in Breezehome: SetStage 150 (when: the speaker is the one in alias Balgruuf); Dialogue with Lydia (named by the one follower in MQ104 (Dragon Rising)'s aliases), placed in Breezehome: SetStage 150 (when: the speaker is the one in alias Balgruuf); Dialogue with Lydia (named by the one follower in MQ104 (Dragon Rising)'s aliases), placed in Breezehome: SetStage 150 (when: the speaker is the one in alias Balgruuf); Dialogue with Lydia (named by the one follower in MQ104 (Dragon Rising)'s aliases), placed in Breezehome: SetStage 150 (when: the speaker is the one in alias Balgruuf). Source: QF_MQ104B_0002610C.fragment_43 on Skyrim.esm:02610C (LoreRim - Weapons.esp). **script**
- MQ105 (The Way of the Voice) calls SetStage 25. Source: MQ105ShoutTargetScript.OnMagicEffectApplyEx on Skyrim.esm:0242BA (Skyrim.esm). **script**
- Dialogue with Arngeir (named by alias Arngeir of MQ105 (The Way of the Voice) (unique)), placed in High Hrothgar, "I am answering your summons.": SetStage 30 (when: The Way of the Voice stage < 50; The Way of the Voice stage 25 done; the speaker is the one in alias Arngeir). Reply: "So... a Dragonborn appears, at this moment in the turning of the age." Source: TIF__0002F2C4.Fragment_0 on INFO Skyrim.esm:02F2C4 (Skyrim.esm). **script**
- Dialogue with Arngeir (named by alias Arngeir of MQ105 (The Way of the Voice) (unique)), placed in High Hrothgar, "I'm answering your summons.": SetStage 30 (when: The Way of the Voice stage < 50; the speaker is the one in alias Arngeir). Reply: "We will see if you truly have the gift." Source: TIF__0002F2C5.Fragment_0 on INFO Skyrim.esm:02F2C5 (Skyrim.esm). **script**
- Dialogue with Arngeir (named by alias Arngeir of MQ105 (The Way of the Voice) (unique)), placed in High Hrothgar, "You call me Dragonborn. What does that mean?": SetStage 30 (when: The Way of the Voice stage < 50; the speaker is the one in alias Arngeir). Reply: "First, let us see if you truly are Dragonborn. Let us taste of your Voice." Source: TIF__0002F7AA.Fragment_0 on INFO Skyrim.esm:02F7AA (Skyrim.esm). **script**

**Who and where**

- First objective: "Speak to the Greybeards". Source: Skyrim.esm:0242BA QOBJ 10. **files**
- Target alias Arngeir (unique): Arngeir (unique actor, placed in High Hrothgar). **files**
- Target alias HighHrothgarMapMarker (forced): a marker (forced reference, placed in High Hrothgar). **files**
- Target alias IvarsteadMapMarker (forced): a marker (forced reference, placed in Ivarstead). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: High Hrothgar: 8 doors, 2 locked; High Hrothgar: 3 doors, 0 locked; Ivarstead: 4 doors, 3 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 6. The Horn of Jurgen Windcaller (`MQ105Ustengrav`, Skyrim.esm:0713DC, Skyrim.esm)

**Started by**

- MQ105 (The Way of the Voice) at stage 160 calls SetStage 10; its stage 160 is set by Dialogue with someone the line does not name: SetStage 160 (when: the speaker is the one in alias Arngeir); Dialogue with someone the line does not name: SetStage 160 (when: the speaker is the one in alias Arngeir; The Way of the Voice stage 140 done; The Way of the Voice stage 160 not done). Source: QF_MQ105_000242BA.fragment_42 on Skyrim.esm:0242BA (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Read the note", shown at stage 15. Source: Skyrim.esm:0713DC QOBJ 15. **files**
- MQ105 (The Way of the Voice) at stage 190 calls SetStage 15. Source: QF_MQ105_000242BA.fragment_119 on Skyrim.esm:0242BA (Skyrim.esm). **script**

**Who and where**

- First objective: "Retrieve the Horn of Jurgen Windcaller". Source: Skyrim.esm:0713DC QOBJ 10. **files**
- Target alias HornActivator (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 7. A Blade in the Dark (`MQ106`, Skyrim.esm:032926, Skyrim.esm)

**Started by**

- MQ105 (The Way of the Voice) at stage 200 calls SetStage 5. Source: QF_MQ105_000242BA.fragment_55 on Skyrim.esm:0242BA (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "I'd like to rent the attic room. (<Global=RoomCost> gold)": SetStage 10 (when: the speaker is Delphine; A Blade in the Dark stage >= 5; A Blade in the Dark stage < 10; GetInCell Skyrim.esm:0133C6 == 1; GetActorValue == 1). Source: TIF__000453EE.Fragment_0 on INFO Skyrim.esm:0453EE (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "I'd like to rent the attic room. (<Global=RoomCost> gold)": SetStage 10 (when: the speaker is Delphine; A Blade in the Dark stage >= 5; A Blade in the Dark stage < 10; GetInCell Skyrim.esm:0133C6 == 1). Source: TIF__000A56D4.Fragment_0 on INFO Skyrim.esm:0A56D4 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "I just came here for the horn.": SetStage 30 (when: the speaker is Delphine). Source: TIF__00083055.Fragment_0 on INFO Skyrim.esm:083055 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "What of it?": SetStage 30 (when: the speaker is Delphine). Source: TIF__000C65A2.Fragment_0 on INFO Skyrim.esm:0C65A2 (Skyrim.esm). **script**
- (First objective shown at stage 30; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 1. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 30. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 50. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 80. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 120. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 150. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- and 3 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Locate the dragon burial site", shown at stage 50. Source: Skyrim.esm:032926 QOBJ 20. **files**
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 50. Source: QF_MQ201_00035D5F.fragment_12 on Skyrim.esm:035D5F (Storm the Thalmor Embassy.esp). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "So where are we headed?": SetStage 50 (when: the speaker is Delphine; A Blade in the Dark stage 47 done). Reply: "Kynesgrove. There's an ancient dragon burial near there. If we can get there before it happens, maybe we'll learn how to stop it." Source: TIF__00032906.Fragment_0 on INFO Skyrim.esm:032906 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "What makes you think dragons are coming back to life?": SetStage 47 (when: the speaker is Delphine). Reply: "I know they are. I've visited their ancient burial mounds and found them empty." Source: TIF__0008649C.Fragment_0 on INFO Skyrim.esm:08649C (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "Why are you looking for a Dragonborn?": SetStage 45 (when: the speaker is Delphine). Reply: "We remember what most don't - that the Dragonborn is the ultimate dragonslayer." Source: TIF__0003290A.Fragment_0 on INFO Skyrim.esm:03290A (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "Why are you looking for a Dragonborn?": SetStage 45 (when: the speaker is Delphine). Reply: "We remember what most don't - that the Dragonborn is the ultimate dragonslayer." Source: TIF__00021144.Fragment_0 on INFO Skyrim.esm:021144 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "I don't have time for this.": SetStage 40 (when: the speaker is Delphine). Reply: "I shouldn't let you walk out of here, knowing what you know. But I guess even my paranoia has its limits." Source: TIF__00032908.Fragment_0 on INFO Skyrim.esm:032908 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "I just came here for the horn.": SetStage 35 (when: the speaker is Delphine; A Blade in the Dark stage 35 not done). Reply: "I am not your enemy. I already gave you the horn. I'm actually trying to help you. I just need you to hear me out." Source: TIF__0003290B.Fragment_0 on INFO Skyrim.esm:03290B (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "I just came here for the horn.": SetStage 42 (when: the speaker is Delphine). Reply: "And now you have it. No harm done." Source: TIF__00083055.Fragment_0 on INFO Skyrim.esm:083055 (Skyrim.esm). **script**

**Who and where**

- First objective: "Talk to Delphine". Source: Skyrim.esm:032926 QOBJ 10. **files**
- Target alias Delphine (unique): Delphine (unique actor, placed in Sleeping Giant Inn). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Sleeping Giant Inn: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Delphine's Secret Door Key (stage 200, QF_MQ106_00032926.fragment_6).

## 8. Diplomatic Immunity (`MQ201`, Skyrim.esm:035D5F, Storm the Thalmor Embassy.esp)

**Started by**

- MQ106 (A Blade in the Dark) at stage 160 calls SetStage 10. Source: QF_MQ106_00032926.fragment_30 on Skyrim.esm:032926 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "So how do we get into the Thalmor Embassy?": SetStage 30 (when: the speaker is Delphine). Source: TIF__01162FB9.Fragment_0 on INFO Skyrim.esm:03B495 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "What makes you think the Thalmor are bringing dragons back?": SetStage 20 (when: the speaker is Delphine). Source: TIF__0003B499.Fragment_0 on INFO Skyrim.esm:03B499 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "Who are you and what do you want with me?": SetStage 15 (when: the speaker is Delphine). Source: TIF__01162FAA.Fragment_0 on INFO Skyrim.esm:03B492 (Skyrim.esm). **script**
- (First objective shown at stage 30; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ202 (A Cornered Rat) at stage 1 calls SetStage 1. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- MQ202 (A Cornered Rat) at stage 1 calls SetStage 30. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- MQ202 (A Cornered Rat) at stage 1 calls SetStage 202. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- MQ202 (A Cornered Rat) at stage 1 calls SetStage 205. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- MQ202 (A Cornered Rat) at stage 1 calls SetStage 230. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- MQ202 (A Cornered Rat) at stage 1 calls SetStage 250. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- and 2 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet Malborn in Solitude", shown at stage 40. Source: Skyrim.esm:035D5F QOBJ 10. **files**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "So what's your plan? How do I infiltrate the Thalmor Embassy?": SetStage 40 (when: the speaker is Delphine). Reply: "The Thalmor ambassador, Elenwen, regularly throws parties where the rich and connected cozy up to the Thalmor." Source: TIF__0005F702.Fragment_0 on INFO Skyrim.esm:05F702 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Meet Delphine in Riverwood or storm the Thalmor Embassy". Source: Skyrim.esm:035D5F QOBJ 5. **files**
- Target alias Delphine (unique): Delphine (unique actor, placed in Sleeping Giant Inn). **files**
- Target alias RiverwoodTargetMarker (forced): a marker (forced reference, placed in Sleeping Giant Inn). **files**
- Target alias EmbassyMainGate (forced): Gate (forced reference, placed in Thalmor Embassy). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Sleeping Giant Inn: 1 door, 0 locked; Sleeping Giant Inn: 1 door, 0 locked; Thalmor Embassy: 5 doors, 2 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 9. A Cornered Rat (`MQ202`, Skyrim.esm:036191, Requiem.esp)

**Started by**

- MQ201 (Diplomatic Immunity) calls at stage 230 SetStage 5; at stage 250 SetStage 10. Sources: QF_MQ201_00035D5F.fragment_40, QF_MQ201_00035D5F.fragment_55 on Skyrim.esm:035D5F. **script**
- Patch1_5_UpdateQuest, a helper quest with Lydia calls at stage 10 SetStage 5; at stage 10 SetStage 10; Patch1_5_UpdateQuest is started by the start-game flag. Sources: QF_Patch1_5_UpdateQuest_0100083F.fragment_0 on Update.esm:00083F. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ302 (Season Unending) at stage 1 calls SetStage 200. Source: QF_MQ302_00045923.fragment_7 (Skyrim.esm).
- MQ301 (The Fallen) at stage 1 calls SetStage 200. Source: QF_MQ301_00044C56.fragment_4 (Unofficial Skyrim Special Edition Patch.esp).
- MQ203 (Alduin's Wall) at stage 1 calls SetStage 1. Source: QF_MQ203_00036192.fragment_0 (Skyrim.esm).
- MQ203 (Alduin's Wall) at stage 1 calls SetStage 150. Source: QF_MQ203_00036192.fragment_0 (Skyrim.esm).
- MQ203 (Alduin's Wall) at stage 1 calls SetStage 160. Source: QF_MQ203_00036192.fragment_0 (Skyrim.esm).
- MQ203 (Alduin's Wall) at stage 1 calls SetStage 170. Source: QF_MQ203_00036192.fragment_0 (Skyrim.esm).
- and 3 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Search the Ratway for Esbern's hideout", shown at stage 20. Source: Skyrim.esm:036191 QOBJ 20. **files**
- It starts by itself from the start of the game. (SetStage 20). Source: MQ202QuestScript.OnUpdate on Skyrim.esm:036191 (Requiem.esp). **script**
- Dialogue with Keerava, placed in The Bee and Barb, Bee and Barb, "I'm looking for an old guy, hiding out somewhere in Riften.": SetStage 20 (when: A Cornered Rat stage 50 not done; GetInFaction JobInnkeeperFaction == 1; the speaker is Keerava or the speaker is Talen-Jei). Reply: "Never heard of anybody like that. But if you want to hide out in Riften, the Ratway's where you'd be." Source: TIF__0006C863.Fragment_0 on INFO Skyrim.esm:06C863 (Skyrim.esm). **script**

**Who and where**

- First objective: "Ask in Riften about Esbern". Source: Skyrim.esm:036191 QOBJ 10. **files**
- Target alias Keerava (unique): Keerava (unique actor, placed in The Bee and Barb, Bee and Barb). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Bee and Barb, Bee and Barb: 5 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 10. Alduin's Wall (`MQ203`, Skyrim.esm:036192, Skyrim.esm)

**Started by**

- MQ202 (A Cornered Rat) at stage 180 calls SetStage 10; its stage 180 is set by Dialogue with Esbern, placed in The Ratway Warrens, Esbern's Vault: SetStage 180 (when: the speaker is Esbern). Source: QF_MQ202_00036191.fragment_19 on Skyrim.esm:036191 (Requiem.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ302 (Season Unending) at stage 1 calls SetStage 240. Source: QF_MQ302_00045923.fragment_7 (Skyrim.esm).
- MQ301 (The Fallen) at stage 1 calls SetStage 240. Source: QF_MQ301_00044C56.fragment_4 (Unofficial Skyrim Special Edition Patch.esp).
- MQ204 (The Throat of the World) at stage 1 calls SetStage 1. Source: QF_MQ204_0002D515.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).
- MQ204 (The Throat of the World) at stage 1 calls SetStage 20. Source: QF_MQ204_0002D515.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).
- MQ204 (The Throat of the World) at stage 1 calls SetStage 60. Source: QF_MQ204_0002D515.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).
- MQ204 (The Throat of the World) at stage 1 calls SetStage 110. Source: QF_MQ204_0002D515.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).
- and 5 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Esbern", shown at stage 50. Source: Skyrim.esm:036192 QOBJ 20. **files**
- MQ203 (Alduin's Wall) calls SetStage 20. Source: MQ203EsbernScript.OnLocationChange on Skyrim.esm:036192 (Skyrim.esm). **script**
- MQ203 (Alduin's Wall) calls SetStage 30. Source: MQ203EsbernScript.OnLocationChange on Skyrim.esm:036192 (Skyrim.esm). **script**
- MQ204 (The Throat of the World) at stage 1 calls SetStage 20. Source: QF_MQ204_0002D515.fragment_7 on Skyrim.esm:02D515 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "He's here in Riverwood. Right outside.": SetStage 30 (when: the speaker is Delphine; Alduin's Wall stage 20 done; fn300 == 1). Reply: "Mara's mercy, then he's safe! Come on, we have a lot to discuss." Source: TIF__0006EBDF.Fragment_0 on INFO Skyrim.esm:06EBDF (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "He's on his way.": SetStage 25 (when: the speaker is Delphine; Alduin's Wall stage 10 done; Alduin's Wall stage < 20). Reply: "What? You left him on his own? With the Thalmor after him? Go make sure he's safe and bring him here!" Source: TIF__0006EBDE.Fragment_0 on INFO Skyrim.esm:06EBDE (Skyrim.esm). **script**

**Who and where**

- First objective: "Escort Esbern to Riverwood". Source: Skyrim.esm:036192 QOBJ 10. **files**
- Target alias Delphine (unique): Delphine (unique actor, placed in Sleeping Giant Inn). **files**
- Target alias Esbern (unique): Esbern (unique actor, placed in The Ratway Warrens, Esbern's Vault). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Sleeping Giant Inn: 1 door, 0 locked; The Ratway Warrens, Esbern's Vault: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 11. The Throat of the World (`MQ204`, Skyrim.esm:02D515, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MQ203 (Alduin's Wall) at stage 280 calls SetStage 10; its stage 280 is set by Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 280 (when: the speaker is Delphine); Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 280 (when: the speaker is Delphine). Source: QF_MQ203_00036192.fragment_16 on Skyrim.esm:036192 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ206 (Alduin's Bane) at stage 15 calls SetStage 220. Source: QF_MQ206_00036193.fragment_51 (Skyrim.esm).
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 1. Source: QF_MQ205_0002D516.fragment_10 (Unofficial Skyrim Special Edition Patch.esp).
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 10. Source: QF_MQ205_0002D516.fragment_10 (Unofficial Skyrim Special Edition Patch.esp).
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 80. Source: QF_MQ205_0002D516.fragment_10 (Unofficial Skyrim Special Edition Patch.esp).
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 81. Source: QF_MQ205_0002D516.fragment_10 (Unofficial Skyrim Special Edition Patch.esp).
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 82. Source: QF_MQ205_0002D516.fragment_10 (Unofficial Skyrim Special Edition Patch.esp).
- and 13 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Learn the "Clear Skies" Shout", shown at stage 70. Source: Skyrim.esm:02D515 QOBJ 20. **files**
- Dialogue with Arngeir, placed in High Hrothgar, "It was recorded on Alduin's Wall.": SetStage 30 (when: the speaker is Arngeir). Reply: "The Blades! Of course. They specialize in meddling in matters they barely understand. Their reckless arrogance knows no bounds." Source: TIF__0003C1A9.Fragment_0 on INFO Skyrim.esm:03C1A9 (Skyrim.esm). **script**
- Dialogue with Arngeir, placed in High Hrothgar, "I need to learn the Shout used to defeat Alduin.": SetStage 20 (when: the speaker is Arngeir; The Throat of the World stage < 50). Reply: "Where did you learn of that? Who have you been talking to?" Source: TIF__0003C1A7.Fragment_0 on INFO Skyrim.esm:03C1A7 (Skyrim.esm). **script**
- Dialogue with Arngeir, placed in High Hrothgar, "I need to learn the Shout used to defeat Alduin.": SetStage 20 (when: the speaker is Arngeir; The Throat of the World stage < 30). Reply: "Where did you learn of a Shout used to defeat Alduin?" Source: TIF__0003F891.Fragment_0 on INFO Skyrim.esm:03F891 (Skyrim.esm). **script**
- Dialogue with Arngeir, placed in High Hrothgar, "I have nothing to hide. The Blades helped me find out about it.": SetStage 30 (when: the speaker is Arngeir). Reply: "The Blades! Of course. They specialize in meddling in matters they barely understand. Their reckless arrogance knows no bounds." Source: TIF__0003F883.Fragment_0 on INFO Skyrim.esm:03F883 (Skyrim.esm). **script**
- Dialogue with Arngeir, placed in High Hrothgar, "I need to learn the Shout used to defeat Alduin.": SetStage 50 (when: the speaker is Arngeir; The Throat of the World stage 40 done). Reply: "Forgive me. I was... intemperate. I allowed my emotions to cloud my judgment. Master Einarth reminded me of my duty." Source: TIF__000B397C.Fragment_0 on INFO Skyrim.esm:0B397C (Skyrim.esm). **script**
- Dialogue with Arngeir, placed in High Hrothgar, "How do I get to the top of the mountain to see him?": SetStage 60 (when: the speaker is Arngeir; The Throat of the World stage 55 done). Reply: "Only those whose Voice is strong can find the path. We will teach you a Shout to open the way to Paarthurnax." Source: TIF__000483D8.Fragment_0 on INFO Skyrim.esm:0483D8 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Arngeir, placed in High Hrothgar, "Why haven't I met Paarthurnax yet?": SetStage 55 (when: the speaker is Arngeir). Reply: "He lives in seclusion on the very peak of the mountain." Source: TIF__0004826B.Fragment_0 on INFO Skyrim.esm:04826B (Skyrim.esm). **script**
- Dialogue with Arngeir, placed in High Hrothgar, "So you won't help me?": SetStage 35 (when: the speaker is Arngeir). Reply: "No. Not now. Not until you return to the path of wisdom." Source: TIF__000B394E.Fragment_0 on INFO Skyrim.esm:0B394E (Skyrim.esm). **script**

**Who and where**

- First objective: "Talk to Arngeir". Source: Skyrim.esm:02D515 QOBJ 10. **files**
- Target alias Arngeir (unique): Arngeir (unique actor, placed in High Hrothgar). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: High Hrothgar: 8 doors, 2 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 12. Elder Knowledge (`MQ205`, Skyrim.esm:02D516, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MQ204 (The Throat of the World) calls at stage 205 SetStage 10; at stage 200 SetStage 10. Sources: QF_MQ204_0002D515.fragment_64, QF_MQ204_0002D515.fragment_17 on Skyrim.esm:02D515. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ206 (Alduin's Bane) at stage 1 calls SetStage 1. Source: QF_MQ206_00036193.fragment_0 (Skyrim.esm).
- MQ206 (Alduin's Bane) at stage 1 calls SetStage 100. Source: QF_MQ206_00036193.fragment_0 (Skyrim.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "(Optional) Talk to Esbern", shown at stage 20. Source: Skyrim.esm:02D516 QOBJ 20. **files**
- Dialogue with Paarthurnax, placed in Skyrim, "Hmm. Esbern or Arngeir might have some idea.": SetStage 20 (when: the speaker is Paarthurnax). Reply: "Trust your instincts, Dovahkiin. Your blood will show you the way." Source: TIF__0003FA45.Fragment_0 on INFO Skyrim.esm:03FA45 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn, "No, but I know how to find out. I need an Elder Scroll.": SetStage 20 (when: the speaker is Delphine). Reply: "An Elder Scroll? That's not going to be easy to come by." Source: TIF__00041F13.Fragment_0 on INFO Skyrim.esm:041F13 (Skyrim.esm). **script**

**Who and where**

- First objective: "Learn the location of the Elder Scroll". Source: Skyrim.esm:02D516 QOBJ 10. **files**
- Target alias Paarthurnax (unique): Paarthurnax (unique actor, placed in Skyrim). **files**
- Target alias Urag (unique): Urag gro-Shub (unique actor, placed in The Arcanaeum). **files**
- Target alias Septimus (unique): Septimus Signus (unique actor, placed in Septimus Signus' Outpost). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Arcanaeum: 4 doors, 0 locked; Septimus Signus' Outpost: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 13. Alduin's Bane (`MQ206`, Skyrim.esm:036193, Skyrim.esm)

**Started by**

- MQ205 (Elder Knowledge) at stage 100 calls SetStage 10. Source: QF_MQ205_0002D516.fragment_12 on Skyrim.esm:02D516 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ301 (The Fallen) at stage 1 calls SetStage 1. Source: QF_MQ301_00044C56.fragment_4 (Unofficial Skyrim Special Edition Patch.esp).
- MQ301 (The Fallen) at stage 1 calls SetStage 50. Source: QF_MQ301_00044C56.fragment_4 (Unofficial Skyrim Special Edition Patch.esp).
- MQ301 (The Fallen) at stage 1 calls SetStage 70. Source: QF_MQ301_00044C56.fragment_4 (Unofficial Skyrim Special Edition Patch.esp).
- MQ301 (The Fallen) at stage 1 calls SetStage 220. Source: QF_MQ301_00044C56.fragment_4 (Unofficial Skyrim Special Edition Patch.esp).
- MQ301 (The Fallen) at stage 1 calls SetStage 240. Source: QF_MQ301_00044C56.fragment_4 (Unofficial Skyrim Special Edition Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Learn the "Dragonrend" Shout from the Nord heroes", shown at stage 20. Source: Skyrim.esm:036193 QOBJ 20. **files**
- It starts by itself from the start of the game. (SetStage 20). Source: MQ206Script.OnUpdate on Skyrim.esm:036193 (Skyrim.esm). **script**
- Dialogue with Paarthurnax, placed in Skyrim, "I have the Elder Scroll.": SetStage 15 (when: the speaker is Paarthurnax; Alduin's Bane stage < 20). Reply: "You have it. The Kel - the Elder Scroll. Tiid kreh... qalos. Time shudders at its touch." Source: TIF__000C64EC.Fragment_1 on INFO Skyrim.esm:0C64EC (Skyrim.esm). **script**
- Read Elder Scroll (Dragon) (SetStage 20). Source: ElderScrollScript.OnEquipped on BOOK Skyrim.esm:02D513. **script**

**Who and where**

- First objective: "Read the Elder Scroll at the Time-Wound". Source: Skyrim.esm:036193 QOBJ 10. **files**
- Target alias TimeWoundTarget (forced): a marker (forced reference, placed in Throat of the World). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 14. The Fallen (`MQ301`, Skyrim.esm:044C56, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MQ206 (Alduin's Bane) at stage 220 calls SetStage 10. Source: QF_MQ206_00036193.fragment_34 on Skyrim.esm:036193 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ303 (The World-Eater's Eyrie) at stage 1 calls SetStage 70. Source: QF_MQ303_00046EF0.fragment_13 (Unofficial Skyrim Special Edition Patch.esp).
- MQ303 (The World-Eater's Eyrie) at stage 1 calls SetStage 120. Source: QF_MQ303_00046EF0.fragment_13 (Unofficial Skyrim Special Edition Patch.esp).
- MQ303 (The World-Eater's Eyrie) at stage 1 calls SetStage 150. Source: QF_MQ303_00046EF0.fragment_13 (Unofficial Skyrim Special Edition Patch.esp).
- MQ303 (The World-Eater's Eyrie) at stage 1 calls SetStage 180. Source: QF_MQ303_00046EF0.fragment_13 (Unofficial Skyrim Special Edition Patch.esp).
- MQ303 (The World-Eater's Eyrie) at stage 1 calls SetStage 220. Source: QF_MQ303_00046EF0.fragment_13 (Unofficial Skyrim Special Edition Patch.esp).
- MQ303 (The World-Eater's Eyrie) at stage 1 calls SetStage 1. Source: QF_MQ303_00046EF0.fragment_13 (Unofficial Skyrim Special Edition Patch.esp).
- and 7 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Arngeir", shown at stage 10. Source: Skyrim.esm:044C56 QOBJ 11. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Talk to Paarthurnax". Source: Skyrim.esm:044C56 QOBJ 10. **files**
- Target alias Paarthurnax (unique): Paarthurnax (unique actor, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 15. Season Unending (`MQ302`, Skyrim.esm:045923, Skyrim.esm)

**Started by**

- MQ301 (The Fallen) at stage 30 calls SetStage 10; its stage 30 is set by Dialogue with someone the line does not name: SetStage 30 (when: the speaker is the one in alias Jarl). Source: QF_MQ301_00044C56.fragment_6 on Skyrim.esm:044C56 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to General Tullius", shown at stage 15. Source: Skyrim.esm:045923 QOBJ 20. **files**
- Dialogue with Arngeir, placed in High Hrothgar, "Both sides respect the Greybeards. They will listen.": SetStage 15 (when: the speaker is Arngeir). Reply: "Paarthurnax has made the decision to help you. This is the road we have to walk." Source: TIF__00026732.Fragment_0 on INFO Skyrim.esm:026732 (Skyrim.esm). **script**

**Who and where**

- First objective: "Talk to Arngeir". Source: Skyrim.esm:045923 QOBJ 10. **files**
- Target alias Arngeir (unique): Arngeir (unique actor, placed in High Hrothgar). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: High Hrothgar: 8 doors, 2 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 16. The World-Eater's Eyrie (`MQ303`, Skyrim.esm:046EF0, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MQ301 (The Fallen) calls at stage 200 SetStage 5; at stage 220 SetStage 10. Sources: QF_MQ301_00044C56.fragment_15, QF_MQ301_00044C56.fragment_27 on Skyrim.esm:044C56. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ304 (Sovngarde) at stage 1 calls SetStage 1. Source: QF_MQ304_00046EF1.fragment_6 (Update.esm).
- MQ304 (Sovngarde) at stage 1 calls SetStage 100. Source: QF_MQ304_00046EF1.fragment_6 (Update.esm).
- MQ304 (Sovngarde) at stage 1 calls SetStage 180. Source: QF_MQ304_00046EF1.fragment_6 (Update.esm).
- MQ304 (Sovngarde) at stage 1 calls SetStage 300. Source: QF_MQ304_00046EF1.fragment_6 (Update.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Odahviing", shown at stage 40. Source: Skyrim.esm:046EF0 QOBJ 20. **files**
- MQ301 (The Fallen) at stage 230 calls SetStage 20; its stage 230 is set by Dialogue with Odahviing, placed in Dragonsreach, Great Porch: SetStage 230 (when: the speaker is Odahviing). Source: QF_MQ301_00044C56.fragment_43 on Skyrim.esm:044C56 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name (named by alias Gatekeeper of MQ303 (The World-Eater's Eyrie) (run time)), "Yes, I'm sure.": SetStage 30 (when: the speaker is the one in alias Gatekeeper). Reply: "Your funeral. Someone else is gonna have to help you get him back in there again." Source: TIF__0004DE3B.Fragment_0 on INFO Skyrim.esm:04DE3B (Skyrim.esm). **script**
- Dialogue with Odahviing, placed in Dragonsreach, Great Porch, "I guess I'll have to trust you.": SetStage 20 (when: the speaker is Odahviing). Reply: "Onikaan koraav gein miraad. It is wise to recognize when you only have one choice." Source: TIF__0004DE33.Fragment_0 on INFO Skyrim.esm:04DE33 (Skyrim.esm). **script**
- Dialogue with Odahviing, placed in Dragonsreach, Great Porch, "Yes. I'll set you free if you promise to take me to Skuldafn.": SetStage 20 (when: the speaker is Odahviing). Reply: "Onikaan koraav gein miraad. It is wise to recognize when you only have one choice." Source: TIF__0004DE34.Fragment_0 on INFO Skyrim.esm:04DE34 (Skyrim.esm). **script**

**Who and where**

- First objective: "Set Odahviing free". Source: Skyrim.esm:046EF0 QOBJ 10. **files**
- Target alias Gatekeeper (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 17. Sovngarde (`MQ304`, Skyrim.esm:046EF1, Update.esm)

**Started by**

- MQ303 (The World-Eater's Eyrie) calls at stage 180 SetStage 5; at stage 300 SetStage 10. Sources: QF_MQ303_00046EF0.fragment_33, QF_MQ303_00046EF0.fragment_24 on Skyrim.esm:046EF0. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ305 (Dragonslayer) at stage 1 calls SetStage 1. Source: QF_MQ305_00046EF2.fragment_8 (Skyrim.esm).
- MQ305 (Dragonslayer) at stage 1 calls SetStage 5. Source: QF_MQ305_00046EF2.fragment_8 (Skyrim.esm).
- MQ305 (Dragonslayer) at stage 1 calls SetStage 10. Source: QF_MQ305_00046EF2.fragment_8 (Skyrim.esm).
- MQ305 (Dragonslayer) at stage 1 calls SetStage 30. Source: QF_MQ305_00046EF2.fragment_8 (Skyrim.esm).
- MQ305 (Dragonslayer) at stage 1 calls SetStage 90. Source: QF_MQ305_00046EF2.fragment_8 (Skyrim.esm).
- MQ305 (Dragonslayer) at stage 1 calls SetStage 150. Source: QF_MQ305_00046EF2.fragment_8 (Skyrim.esm).
- and 2 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Gain admittance to the Hall of Valor", shown at stage 50. Source: Skyrim.esm:046EF1 QOBJ 20. **files**
- MQ305 (Dragonslayer) at stage 1 calls SetStage 30. Source: QF_MQ305_00046EF2.fragment_8 on Skyrim.esm:046EF2 (Skyrim.esm). **script**
- Dialogue with Stormcloak Soldier (named by alias LostSoul of MQ304 (Sovngarde) (forced)), placed in Sovngarde, "Invisible Walk Away": SetStage 50 (when: the speaker is the one in alias LostSoul). Reply: "The World-Eater waits within the mist! Bring word to Shor's hall of our hard fate!" Source: TIF__0004E9B5.Fragment_0 on INFO Skyrim.esm:04E9B5 (Skyrim.esm). **script**
- Dialogue with Stormcloak Soldier (named by alias LostSoul of MQ304 (Sovngarde) (forced)), placed in Sovngarde, "Yes, it's at the far end of the valley from here.": SetStage 50 (when: the speaker is the one in alias LostSoul). Reply: "I saw it fair when first I trod this long-sought path. The pain and fear vanished, dreamlike, and a vision beckoned..." Source: TIF__0004E9BB.Fragment_0 on INFO Skyrim.esm:04E9BB (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Stormcloak Soldier (named by alias LostSoul of MQ304 (Sovngarde) (forced)), placed in Sovngarde, "Shor's hall? What's that?": SetStage 50 (when: the speaker is the one in alias LostSoul). Reply: "Don't you know? What drew you here? Surely your dreams showed you the way?" Source: TIF__0004F74E.Fragment_0 on INFO Skyrim.esm:04F74E (Skyrim.esm). **script**
- Dialogue with Tsun, placed in Sovngarde: SetStage 50 (when: the speaker is Tsun; Sovngarde stage 135 not done). Reply: "What brings you, wayfarer grim, to wander here, in Sovngarde, souls-end, Shor's gift to honored dead?" Source: TIF__0004FA20.Fragment_0 on INFO Skyrim.esm:04FA20 (Skyrim.esm). **script**
- Dialogue with Tsun, placed in Sovngarde, "I seek entrance to the Hall of Valor.": SetStage 50 (when: the speaker is Tsun; Sovngarde stage < 140). Reply: "No shade are you, as usually here passes, but living, you dare the land of the dead." Source: TIF__000946F1.Fragment_0 on INFO Skyrim.esm:0946F1 (Skyrim.esm). **script**

**Who and where**

- First objective: "Find out how to defeat Alduin". Source: Skyrim.esm:046EF1 QOBJ 10. **files**
- Target alias Alduin1 (forced): Alduin (forced reference, placed in Sovngarde). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 18. Dragonslayer (`MQ305`, Skyrim.esm:046EF2, Skyrim.esm)

**Started by**

- MQ304 (Sovngarde) at stage 200 calls SetStage 10. Source: QF_MQ304_00046EF1.fragment_22 on Skyrim.esm:046EF1 (Update.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Defeat Alduin", shown at stage 100. Source: Skyrim.esm:046EF2 QOBJ 20. **files**
- It starts by itself from the start of the game. (SetStage 30). Source: MQ305Script.OnUpdate on Skyrim.esm:046EF2 (Skyrim.esm). **script**

**Who and where**

- First objective: "Help the heroes of Sovngarde dispel Alduin's mist". Source: Skyrim.esm:046EF2 QOBJ 10. **files**
- Target alias ShoutTarget (forced): a marker (forced reference, placed in Sovngarde). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Sovngarde: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 19. Paarthurnax (`MQPaarthurnax`, Skyrim.esm:03FA16, PaarthurnaxQuestExpansion.esp)

**Started by**

- MQ301 (The Fallen) calls at stage 10 SetStage 10; at stage 50 SetStage 15; at stage 30 SetStage 15; at stage 18 SetStage 15. Sources: QF_MQ301_00044C56.fragment_0, QF_MQ301_00044C56.fragment_7, QF_MQ301_00044C56.fragment_6, QF_MQ301_00044C56.fragment_49 on Skyrim.esm:044C56. **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 20 (when: the speaker is Delphine). Source: TIF__00042841.Fragment_0 on INFO Skyrim.esm:042841 (Skyrim.esm). **script**
- Dialogue with Esbern, placed in The Ratway Warrens, Esbern's Vault: SetStage 20 (when: the speaker is Esbern). Source: TIF__000428DC.Fragment_0 on INFO Skyrim.esm:0428DC (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Delphine", shown at stage 50. Source: Skyrim.esm:03FA16 QOBJ 20. **files**
- Dialogue with Arngeir, placed in High Hrothgar, "The Blades want me to kill Paarthurnax.": SetStage 30 (when: the speaker is Arngeir; Paarthurnax stage 50 not done; Paarthurnax stage 99 not done; Paarthurnax stage 100 not done; Paarthurnax stage 20 done). Reply: "Now you see why I've warned you against them! Bloodthirsty barbarians!" Source: TIF__00077358.Fragment_0 on INFO Skyrim.esm:077358 (PaarthurnaxQuestExpansion.esp). **script**

**Who and where**

- First objective: "Decide Paarthurnax's Fate". Source: Skyrim.esm:03FA16 QOBJ 10. **files**
- Target alias Paarthurnax (unique): Paarthurnax (unique actor, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 20. The Words of Power (`FreeformHighHrothgarA`, Skyrim.esm:0E76DE, Skyrim.esm)

**Started by**

- Dialogue with Arngeir, placed in High Hrothgar, "Have you located any Words of Power?": SetStage 10 (when: DialogueHighHrothgar stage 10 done; The Words of Power stage 10 not done; the speaker is Arngeir). Source: TIF__000E76D9.Fragment_0 on INFO Skyrim.esm:0E76D9 (Skyrim.esm). **script**
- Story manager node HighHrothgarNode, event: change location; conditions up its parents: the place you enter is High Hrothgar. Source: HighHrothgarNode Skyrim.esm:0E76E4 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Find the Word of Power in <Alias=Dungeon>". Source: Skyrim.esm:0E76DE QOBJ 10. **files**
- Target alias WordWall (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: Paarthurnax stage 100 not done; The Way of the Voice stage 300 done. **files**

**Gives**: nothing on its completing stages.

## 21. Rebuilding the Blades (`FreeformSkyhavenTempleA`, Skyrim.esm:0E38C9, PaarthurnaxQuestExpansion.esp)

**Started by**

- Dialogue with Delphine, placed in Sleeping Giant Inn, "Maybe I can help you find new recruits.": SetStage 10 (when: the speaker is Delphine; GetInFaction CurrentFollowerFaction == 0; you're in Sky Haven Temple). Source: TIF__000E38C5.Fragment_0 on INFO Skyrim.esm:0E38C5 (Missing Follower Dialogue Fix.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0E38C9 DNAM (PaarthurnaxQuestExpansion.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- FreeformSkyHavenTempleB (Dragon Hunting) at stage 5 calls SetStage 50. Source: QF_FreeformSkyHavenTempleB_000E3E67.fragment_0 (PaarthurnaxQuestExpansion.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Bring a follower to Delphine", shown at stage 20. Source: Skyrim.esm:0E38C9 QOBJ 20. **files**
- It starts by itself from the start of the game. (SetStage 20). Source: FreeformSkyHavenTempleAScript.RecruitBlade on Skyrim.esm:0E38C9 (PaarthurnaxQuestExpansion.esp). **script**
- DialogueFollower, a helper quest at stage 10 calls SetStage 20; DialogueFollower is started by the start-game flag. Source: QF_DialogueFollower_000750BA.fragment_0 on Skyrim.esm:0750BA (Simple Follower Framework Patch.esp), through FreeformSkyhavenTempleA (Rebuilding the Blades)'s recruitblade. **script**
- DialogueFollower, a helper quest at stage 15 calls SetStage 20; DialogueFollower is started by the start-game flag. Source: QF_DialogueFollower_000750BA.fragment_3 on Skyrim.esm:0750BA (Simple Follower Framework Patch.esp), through FreeformSkyhavenTempleA (Rebuilding the Blades)'s recruitblade. **script**
- DialogueFollower, a helper quest at stage 20 calls SetStage 20; DialogueFollower is started by the start-game flag. Source: QF_DialogueFollower_000750BA.fragment_4 on Skyrim.esm:0750BA (Simple Follower Framework Patch.esp), through FreeformSkyhavenTempleA (Rebuilding the Blades)'s recruitblade. **script**

**Who and where**

- First objective: "Bring a follower to Delphine". Source: Skyrim.esm:0E38C9 QOBJ 10. **files**
- Target alias Delphine (unique): Delphine (unique actor, placed in Sleeping Giant Inn). **files**

**Needs**

- Its own conditions: Alduin's Wall stage 280 done; you're in Sky Haven Temple; Paarthurnax stage < 10 or Paarthurnax stage 100 done or Paarthurnax stage 99 done. **files**
- Ways in: Sleeping Giant Inn: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 22. Dragon Hunting (`FreeformSkyHavenTempleB`, Skyrim.esm:0E3E67, PaarthurnaxQuestExpansion.esp)

**Started by**

- Dialogue with Esbern, placed in The Ratway Warrens, Esbern's Vault, "Tell them to meet me there.": SetStage 10 (when: the speaker is Esbern; GetInFaction CurrentFollowerFaction == 0; you're in Sky Haven Temple). Source: TIF__000E67EC.Fragment_0 on INFO Skyrim.esm:0E67EC (Missing Follower Dialogue Fix.esp). **script**
- Story manager node SkyHavenTempleNode, event: change location; conditions up its parents: none. Source: SkyHavenTempleNode Skyrim.esm:0E6802 (DragonHunting.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Esbern", shown at stage 20. Source: Skyrim.esm:0E3E67 QOBJ 20. **files**
- It starts by itself from the start of the game. (SetStage 20). Source: FreeformSkyHavenTempleAScript.RecruitBlade on Skyrim.esm:0E3E67 (PaarthurnaxQuestExpansion.esp). **script**
- FreeformSkyHavenTempleB (Dragon Hunting) calls SetStage 15. Source: BladesOnUnloadScript.OnUnload on Skyrim.esm:0E3E67 (PaarthurnaxQuestExpansion.esp). **script**

**Who and where**

- First objective: "Kill the Dragon in <Alias=DragonLair>". Source: Skyrim.esm:0E3E67 QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: Alduin's Wall stage 280 done; you're in Sky Haven Temple; Paarthurnax stage < 10 or Paarthurnax stage 100 done or Paarthurnax stage 99 done. **files**

**Gives**: nothing on its completing stages.

## 23. Dragon Research (`FreeformSkyHavenTempleD`, Skyrim.esm:0E6DF1, DragonHuntingPaarthurnaxQE.esp)

**Started by**

- Dialogue with Esbern, placed in The Ratway Warrens, Esbern's Vault, "The dragon of <Alias=DragonLair> is dead.": SetStage 10 (when: hasn't the spell Dragon Infusion; Dragon Research stage 100 not done; Dragon Hunting stage 20 done; the speaker is Esbern; GetInFaction CurrentFollowerFaction == 0; you're in Sky Haven Temple). Source: TIF__000E67EB.Fragment_0 on INFO Skyrim.esm:0E67EB (LoreRim - Dialogue Patch.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0E6DF1 DNAM (DragonHuntingPaarthurnaxQE.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring 3 Dragon Blood, 3 Dragon Bile and 3 Dragon Rheum to Esbern". Source: Skyrim.esm:0E6DF1 QOBJ 10. **files**
- Target alias Esbern (unique): Esbern (unique actor, placed in The Ratway Warrens, Esbern's Vault). **files**

**Needs**

- Its own conditions: Alduin's Wall stage 280 done; you're in Sky Haven Temple; Paarthurnax stage < 10 or Paarthurnax stage 100 done or Paarthurnax stage 99 done. **files**
- Ways in: The Ratway Warrens, Esbern's Vault: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | yes, from stage 6 | MQ101 SetStage 6; MQ101 SetStage 7 | it runs from the start |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | yes, from stage 250 | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | it runs from the start |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | To get into The Dragonborn: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |

## Routes into the first quest from outside the starts

### AP_DialogueHelgen, its script's skipkeepentrance

- What it does: SetStage MQ101 (Unbound) 6; SetStage MQ101 (Unbound) 7. Source: APMessengerUtil on AlternatePerspective.esp:1E301D (AlternatePerspective.esp). **script**
- Called from: APS_MQSkipKeep stage 5; dialogue INFO AlternatePerspective.esp:38C6E9 "Skip to Helgen Keep".
- In one sentence: AP_DialogueHelgen's skipkeepentrance does SetStage MQ101 (Unbound) 6; SetStage MQ101 (Unbound) 7; it is called from APS_MQSkipKeep stage 5; dialogue INFO AlternatePerspective.esp:38C6E9 "Skip to Helgen Keep".

### APS_VanillaStart

- What it does: stage 0: SetStage 4. Source: QF_APS_VanillaStart_053BF197 on AlternatePerspective.esp:3BF197 (AlternatePerspective.esp). **script**
- Started by: nothing in the records or scripts.
- **unread**: the trail stops here: nothing in the records or scripts starts APS_VanillaStart.
- In one sentence: The trail stops at APS_VanillaStart: nothing in the records or scripts starts APS_VanillaStart.

### dialogue INFO AlternatePerspective.esp:075139

- Speaker: Matlara (Nord), placed in Helgen. Named by: alias RestingPilgrimOwner of AP_DialogueHelgen (unique).
- The player's prompt: "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))".
- The reply: "Sure thing. It's yours for a day.".
- When it's offered: Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold.
- What it does: SetStage 1 on MQ101 (Unbound). Source: TIF_AP_05075139.Fragment_0 on INFO AlternatePerspective.esp:075139 (AlternatePerspective.esp); topic APStartIntroDiaTopic. **script**
- In one sentence: Talk to Matlara (Nord) in Helgen and choose "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))", when Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold: SetStage 1 on MQ101 (Unbound).

### dialogue INFO AlternatePerspective.esp:38C6E9

- Speaker: Shazdehviir (Dragon Race), placed in Helgen. Named by: GetIsID.
- The player's prompt: "Skip to Helgen Keep".
- The reply: "Of course.".
- When it's offered: the speaker is Shazdehviir.
- What it does: SetStage 6 on MQ101 (Unbound). Source: TIF_AP_0638C6E9.Fragment_1 on INFO AlternatePerspective.esp:38C6E9 (AlternatePerspective.esp); topic MessengerAlduinSkipImp. **script**
- In one sentence: Talk to Shazdehviir (Dragon Race) in Helgen and choose "Skip to Helgen Keep", when the speaker is Shazdehviir: SetStage 6 on MQ101 (Unbound).

## The payoff

- **Dragonslayer** (completes at 200): nothing is given on its completing stages.
- **Paarthurnax** (completes at 99, 100): nothing is given on its completing stages.

## Three questions

**Is Skyrim.esm:0242BA MQ105, and is stage 160 the one that completes it?** Yes: Skyrim.esm:0242BA is MQ105 (The Way of the Voice), and stage 160 is its only completing stage.

**Who starts The Horn of Jurgen Windcaller, and where?** The Horn of Jurgen Windcaller (MQ105Ustengrav, Skyrim.esm:0713DC):
- MQ105 (The Way of the Voice) at stage 160 calls SetStage 10; its stage 160 is set by Dialogue with someone the line does not name: SetStage 160 (when: the speaker is the one in alias Arngeir); Dialogue with someone the line does not name: SetStage 160 (when: the speaker is the one in alias Arngeir; The Way of the Voice stage 140 done; The Way of the Voice stage 160 not done). Source: QF_MQ105_000242BA.fragment_42 on Skyrim.esm:0242BA (Skyrim.esm).
- Its first objective: "Retrieve the Horn of Jurgen Windcaller".
- Its target alias HornActivator: nothing named.

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
