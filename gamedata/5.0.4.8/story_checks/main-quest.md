# Start check: The Dragonborn (`main-quest`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Unbound (`MQ101`, Skyrim.esm:03372B, Alternate Perspective - Gate to Sovngarde Edition.esp)

**Started by**

- AP_DialogueHelgen, a helper quest with Player, RestingPilgrimOwner, RestingPilgrimBackup calls SetStage 6; SetStage 7; AP_DialogueHelgen, is started by MQ101 (Unbound) (Start); MQ101 (Unbound) at stage 0 (Start). Sources: APMessengerUtil.SkipKeepEntrance on AlternatePerspective.esp:1E301D. **script**
- APS_VanillaStart, a helper quest at stage 0 calls SetStage 4. Source: QF_APS_VanillaStart_053BF197.fragment_0 on AlternatePerspective.esp:3BF197 (AlternatePerspective.esp). **script**
- APS_MQSkipKeep, a helper quest calls at stage 5 SetStage 6; at stage 5 SetStage 7. Sources: QF_APS_MQSkipKeep_0547F943.fragment_0 on AlternatePerspective.esp:47F943. **script**
- Dialogue with someone the line does not name: SetStage 1 (when: Unbound hasn't started; the speaker is the one in alias alias 2; the player has at least RoomCost (?) gold). Source: TIF_AP_05075139.Fragment_0 on INFO AlternatePerspective.esp:075139 (AlternatePerspective.esp). **script**
- Dialogue with Shazdehviir, placed in Helgen: SetStage 6 (when: the speaker is Shazdehviir). Source: TIF_AP_0638C6E9.Fragment_1 on INFO AlternatePerspective.esp:38C6E9 (AlternatePerspective.esp). **script**
- Dialogue with Shazdehviir, placed in Helgen: SetStage 7 (when: the speaker is Shazdehviir). Source: TIF_AP_0638C6E9.Fragment_1 on INFO AlternatePerspective.esp:38C6E9 (AlternatePerspective.esp). **script**
- (First objective shown at stage 160; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ102 (Before the Storm) at stage 10 calls SetStage 900. Source: QF_MQ102_0004E50D.fragment_83 (Unofficial Skyrim Special Edition Patch.esp).
- MQ102 (Before the Storm) at stage 12 calls SetStage 900. Source: QF_MQ102_0004E50D.fragment_128 (Unofficial Skyrim Special Edition Patch.esp).

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

**Who and where**

- First objective: "Talk to <Alias=RiverwoodFriend> in Riverwood". Source: Skyrim.esm:04E50D QOBJ 10. **files**
- Target alias RiverwoodFriend (run time): Gerdur (put there by a script (ForceRefTo)); Alvor (put there by a script (ForceRefTo)). **script**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: REQ_LI_MQ102_Reward2 (levelled: Flawless Amethyst) (stage 160, QF_MQ102_0004E50D.fragment_45); REQ_LI_MQ102_Reward1 (levelled: Flawless Amethyst) (stage 160, QF_MQ102_0004E50D.fragment_45).

## 3. Bleak Falls Barrow (`MQ103`, Skyrim.esm:0D0800, LoreRim - Dialogue Patch.esp)

**Started by**

- MQ102 (Before the Storm) calls at stage 160 SetStage 10; at stage 150 SetStage 8. Sources: QF_MQ102_0004E50D.fragment_45, QF_MQ102_0004E50D.fragment_115 on Skyrim.esm:04E50D. **script**
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

**Who and where**

- First objective: "Talk to Farengar". Source: Skyrim.esm:0D0800 QOBJ 15. **files**
- Target alias Farengar (unique): Farengar Secret-Fire (unique actor, placed in Dragonsreach). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dragonsreach: 5 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 4. Dragon Rising (`MQ104`, Skyrim.esm:02610C, LoreRim - Weapons.esp)

**Started by**

- MQ103 (Bleak Falls Barrow) at stage 190 calls SetStage 10. Source: QF_MQ103_000D0800.fragment_20 on Skyrim.esm:0D0800 (LoreRim - Dialogue Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ105 (The Way of the Voice) at stage 1 calls SetStage 1. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 10. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 30. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 90. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 120. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 150. Source: QF_MQ105_000242BA.fragment_1 (Skyrim.esm).
- and 5 more in the JSON

**Who and where**

- First objective: "Talk to Jarl Balgruuf". Source: Skyrim.esm:02610C QOBJ 5. **files**
- Target alias Balgruuf (unique): Balgruuf the Greater (unique actor, placed in Dragonsreach). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dragonsreach: 5 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: Blade of Whiterun (stage 160, QF_MQ104B_0002610C.fragment_45).

## 5. The Way of the Voice (`MQ105`, Skyrim.esm:0242BA, Skyrim.esm)

**Started by**

- DA08 (named "The Whispering Door" in its record), a helper quest with Fianna at stage 1 calls SetStage 0. Source: QF_DA08_0004A37B.fragment_32 on Skyrim.esm:04A37B (TWDQE - Wintersun patch.esp). **script**
- MQ104 (Dragon Rising) at stage 110 calls SetStage 5. Source: QF_MQ104B_0002610C.fragment_39 on Skyrim.esm:02610C (LoreRim - Weapons.esp). **script**
- APS_MQSkipMQ105Hadvar, a helper quest at stage 0 calls SetStage 1; APS_MQSkipMQ105Hadvar, is started by APS_MQSkipMQ105, a helper quest at stage 5 (Start). Source: QF_APS_MQSkip_063D36E9.fragment_0 on AlternatePerspective.esp:3D36E9 (AlternatePerspective.esp). **script**
- APS_MQSkipMQ105Ralof, a helper quest at stage 0 calls SetStage 1; APS_MQSkipMQ105Ralof, is started by APS_MQSkipMQ105, a helper quest at stage 5 (Start). Source: QF_APS_MQSkipRalof_063D36EA.fragment_0 on AlternatePerspective.esp:3D36EA (AlternatePerspective.esp). **script**
- (First objective shown at stage 8; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 240. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 290. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ106 (A Blade in the Dark) at stage 30 calls SetStage 220. Source: QF_MQ106_00032926.fragment_11 (Skyrim.esm).
- MQ106 (A Blade in the Dark) at stage 1 calls SetStage 1. Source: QF_MQ106_00032926.fragment_2 (Skyrim.esm).
- MQ106 (A Blade in the Dark) at stage 1 calls SetStage 30. Source: QF_MQ106_00032926.fragment_2 (Skyrim.esm).
- MQ106 (A Blade in the Dark) at stage 1 calls SetStage 70. Source: QF_MQ106_00032926.fragment_2 (Skyrim.esm).
- and 3 more in the JSON

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

- MQ105 (The Way of the Voice) at stage 160 calls SetStage 10. Source: QF_MQ105_000242BA.fragment_42 on Skyrim.esm:0242BA (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Retrieve the Horn of Jurgen Windcaller". Source: Skyrim.esm:0713DC QOBJ 10. **files**
- Target alias HornActivator (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 7. A Blade in the Dark (`MQ106`, Skyrim.esm:032926, Skyrim.esm)

**Started by**

- MQ105 (The Way of the Voice) at stage 200 calls SetStage 5. Source: QF_MQ105_000242BA.fragment_55 on Skyrim.esm:0242BA (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 10 (when: the speaker is Delphine; A Blade in the Dark stage >= 5; A Blade in the Dark stage < 10; fn67 == 1; GetActorValue == 1). Source: TIF__000453EE.Fragment_0 on INFO Skyrim.esm:0453EE (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 10 (when: the speaker is Delphine; A Blade in the Dark stage >= 5; A Blade in the Dark stage < 10; fn67 == 1). Source: TIF__000A56D4.Fragment_0 on INFO Skyrim.esm:0A56D4 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 30 (when: the speaker is Delphine). Source: TIF__00083055.Fragment_0 on INFO Skyrim.esm:083055 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 30 (when: the speaker is Delphine). Source: TIF__000C65A2.Fragment_0 on INFO Skyrim.esm:0C65A2 (Skyrim.esm). **script**
- (First objective shown at stage 30; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 1. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 30. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 50. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 80. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 120. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 150. Source: QF_MQ201_00035D5F.fragment_12 (Storm the Thalmor Embassy.esp).
- and 3 more in the JSON

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
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 30 (when: the speaker is Delphine). Source: TIF__01162FB9.Fragment_0 on INFO Skyrim.esm:03B495 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 20 (when: the speaker is Delphine). Source: TIF__0003B499.Fragment_0 on INFO Skyrim.esm:03B499 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 15 (when: the speaker is Delphine). Source: TIF__01162FAA.Fragment_0 on INFO Skyrim.esm:03B492 (Skyrim.esm). **script**
- (First objective shown at stage 30; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ202 (A Cornered Rat) at stage 1 calls SetStage 1. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- MQ202 (A Cornered Rat) at stage 1 calls SetStage 30. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- MQ202 (A Cornered Rat) at stage 1 calls SetStage 202. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- MQ202 (A Cornered Rat) at stage 1 calls SetStage 205. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- MQ202 (A Cornered Rat) at stage 1 calls SetStage 230. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- MQ202 (A Cornered Rat) at stage 1 calls SetStage 250. Source: QF_MQ202_00036191.fragment_0 (Requiem.esp).
- and 2 more in the JSON

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
- Patch1_5_UpdateQuest, a helper quest with Lydia calls at stage 10 SetStage 5; at stage 10 SetStage 10. Sources: QF_Patch1_5_UpdateQuest_0100083F.fragment_0 on Update.esm:00083F. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ302 (Season Unending) at stage 1 calls SetStage 200. Source: QF_MQ302_00045923.fragment_7 (Skyrim.esm).
- MQ301 (The Fallen) at stage 1 calls SetStage 200. Source: QF_MQ301_00044C56.fragment_4 (Unofficial Skyrim Special Edition Patch.esp).
- MQ203 (Alduin's Wall) at stage 1 calls SetStage 1. Source: QF_MQ203_00036192.fragment_0 (Skyrim.esm).
- MQ203 (Alduin's Wall) at stage 1 calls SetStage 150. Source: QF_MQ203_00036192.fragment_0 (Skyrim.esm).
- MQ203 (Alduin's Wall) at stage 1 calls SetStage 160. Source: QF_MQ203_00036192.fragment_0 (Skyrim.esm).
- MQ203 (Alduin's Wall) at stage 1 calls SetStage 170. Source: QF_MQ203_00036192.fragment_0 (Skyrim.esm).
- and 3 more in the JSON

**Who and where**

- First objective: "Ask in Riften about Esbern". Source: Skyrim.esm:036191 QOBJ 10. **files**
- Target alias Keerava (unique): Keerava (unique actor, placed in The Bee and Barb, Bee and Barb). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Bee and Barb, Bee and Barb: 5 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 10. Alduin's Wall (`MQ203`, Skyrim.esm:036192, Skyrim.esm)

**Started by**

- MQ202 (A Cornered Rat) at stage 180 calls SetStage 10. Source: QF_MQ202_00036191.fragment_19 on Skyrim.esm:036191 (Requiem.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ302 (Season Unending) at stage 1 calls SetStage 240. Source: QF_MQ302_00045923.fragment_7 (Skyrim.esm).
- MQ301 (The Fallen) at stage 1 calls SetStage 240. Source: QF_MQ301_00044C56.fragment_4 (Unofficial Skyrim Special Edition Patch.esp).
- MQ204 (The Throat of the World) at stage 1 calls SetStage 1. Source: QF_MQ204_0002D515.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).
- MQ204 (The Throat of the World) at stage 1 calls SetStage 20. Source: QF_MQ204_0002D515.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).
- MQ204 (The Throat of the World) at stage 1 calls SetStage 60. Source: QF_MQ204_0002D515.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).
- MQ204 (The Throat of the World) at stage 1 calls SetStage 110. Source: QF_MQ204_0002D515.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).
- and 5 more in the JSON

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

- MQ203 (Alduin's Wall) at stage 280 calls SetStage 10. Source: QF_MQ203_00036192.fragment_16 on Skyrim.esm:036192 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MQ206 (Alduin's Bane) at stage 15 calls SetStage 220. Source: QF_MQ206_00036193.fragment_51 (Skyrim.esm).
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 1. Source: QF_MQ205_0002D516.fragment_10 (Unofficial Skyrim Special Edition Patch.esp).
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 10. Source: QF_MQ205_0002D516.fragment_10 (Unofficial Skyrim Special Edition Patch.esp).
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 80. Source: QF_MQ205_0002D516.fragment_10 (Unofficial Skyrim Special Edition Patch.esp).
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 81. Source: QF_MQ205_0002D516.fragment_10 (Unofficial Skyrim Special Edition Patch.esp).
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 82. Source: QF_MQ205_0002D516.fragment_10 (Unofficial Skyrim Special Edition Patch.esp).
- and 13 more in the JSON

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

**Who and where**

- First objective: "Talk to Paarthurnax". Source: Skyrim.esm:044C56 QOBJ 10. **files**
- Target alias Paarthurnax (unique): Paarthurnax (unique actor, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 15. Season Unending (`MQ302`, Skyrim.esm:045923, Skyrim.esm)

**Started by**

- MQ301 (The Fallen) at stage 30 calls SetStage 10. Source: QF_MQ301_00044C56.fragment_6 on Skyrim.esm:044C56 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

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

**Who and where**

- First objective: "Find out how to defeat Alduin". Source: Skyrim.esm:046EF1 QOBJ 10. **files**
- Target alias Alduin1 (forced): a marker (forced reference, placed in Sovngarde). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 18. Dragonslayer (`MQ305`, Skyrim.esm:046EF2, Skyrim.esm)

**Started by**

- MQ304 (Sovngarde) at stage 200 calls SetStage 10. Source: QF_MQ304_00046EF1.fragment_22 on Skyrim.esm:046EF1 (Update.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

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

**Who and where**

- First objective: "Decide Paarthurnax's Fate". Source: Skyrim.esm:03FA16 QOBJ 10. **files**
- Target alias Paarthurnax (unique): Paarthurnax (unique actor, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 20. The Words of Power (`FreeformHighHrothgarA`, Skyrim.esm:0E76DE, Skyrim.esm)

**Started by**

- Dialogue with Arngeir, placed in High Hrothgar: SetStage 10 (when: DialogueHighHrothgar stage 10 done; The Words of Power stage 10 not done; the speaker is Arngeir). Source: TIF__000E76D9.Fragment_0 on INFO Skyrim.esm:0E76D9 (Skyrim.esm). **script**
- Story manager node HighHrothgarNode, event: change location; conditions up its parents: fn576 == 1. Source: HighHrothgarNode Skyrim.esm:0E76E4 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Find the Word of Power in <Alias=Dungeon>". Source: Skyrim.esm:0E76DE QOBJ 10. **files**
- Target alias WordWall (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: Paarthurnax stage 100 not done; The Way of the Voice stage 300 done. **files**

**Gives**: nothing on its completing stages.

## 21. Rebuilding the Blades (`FreeformSkyhavenTempleA`, Skyrim.esm:0E38C9, PaarthurnaxQuestExpansion.esp)

**Started by**

- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 10 (when: the speaker is Delphine; GetInFaction CurrentFollowerFaction == 0; fn359 == 1). Source: TIF__000E38C5.Fragment_0 on INFO Skyrim.esm:0E38C5 (Missing Follower Dialogue Fix.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0E38C9 DNAM (PaarthurnaxQuestExpansion.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- FreeformSkyHavenTempleB (Dragon Hunting) at stage 5 calls SetStage 50. Source: QF_FreeformSkyHavenTempleB_000E3E67.fragment_0 (PaarthurnaxQuestExpansion.esp).

**Who and where**

- First objective: "Bring a follower to Delphine". Source: Skyrim.esm:0E38C9 QOBJ 10. **files**
- Target alias Delphine (unique): Delphine (unique actor, placed in Sleeping Giant Inn). **files**

**Needs**

- Its own conditions: Alduin's Wall stage 280 done; fn359 == 1; Paarthurnax stage < 10 or Paarthurnax stage 100 done or Paarthurnax stage 99 done. **files**
- Ways in: Sleeping Giant Inn: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 22. Dragon Hunting (`FreeformSkyHavenTempleB`, Skyrim.esm:0E3E67, PaarthurnaxQuestExpansion.esp)

**Started by**

- Dialogue with Esbern, placed in The Ratway Warrens, Esbern's Vault: SetStage 10 (when: the speaker is Esbern; GetInFaction CurrentFollowerFaction == 0; fn359 == 1). Source: TIF__000E67EC.Fragment_0 on INFO Skyrim.esm:0E67EC (Missing Follower Dialogue Fix.esp). **script**
- Story manager node SkyHavenTempleNode, event: change location; conditions up its parents: none. Source: SkyHavenTempleNode Skyrim.esm:0E6802 (DragonHunting.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Kill the Dragon in <Alias=DragonLair>". Source: Skyrim.esm:0E3E67 QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: Alduin's Wall stage 280 done; fn359 == 1; Paarthurnax stage < 10 or Paarthurnax stage 100 done or Paarthurnax stage 99 done. **files**

**Gives**: nothing on its completing stages.

## 23. Dragon Research (`FreeformSkyHavenTempleD`, Skyrim.esm:0E6DF1, DragonHuntingPaarthurnaxQE.esp)

**Started by**

- Dialogue with Esbern, placed in The Ratway Warrens, Esbern's Vault: SetStage 10 (when: fn264 == 0; Dragon Research stage 100 not done; Dragon Hunting stage 20 done; the speaker is Esbern; GetInFaction CurrentFollowerFaction == 0; fn359 == 1). Source: TIF__000E67EB.Fragment_0 on INFO Skyrim.esm:0E67EB (LoreRim - Dialogue Patch.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0E6DF1 DNAM (DragonHuntingPaarthurnaxQE.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring 3 Dragon Blood, 3 Dragon Bile and 3 Dragon Rheum to Esbern". Source: Skyrim.esm:0E6DF1 QOBJ 10. **files**
- Target alias Esbern (unique): Esbern (unique actor, placed in The Ratway Warrens, Esbern's Vault). **files**

**Needs**

- Its own conditions: Alduin's Wall stage 280 done; fn359 == 1; Paarthurnax stage < 10 or Paarthurnax stage 100 done or Paarthurnax stage 99 done. **files**
- Ways in: The Ratway Warrens, Esbern's Vault: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | yes, from stage 6 | MQ101 SetStage 6; MQ101 SetStage 7 | it runs from the start |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | yes, from stage 250 | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | it runs from the start |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | To get into the main quest: talk to Farengar Secret-Fire in Dragonsreach: Bleak Falls Barrow is running from the start (Talk to Farengar); or ask Matlara in Helgen "I'd like to rent a room. (Start Intro (<Global=RoomCost> gold))" (Unbound hasn't started; the speaker is the one in alias RestingPilgrimOwner; the player has at least RoomCost (25) gold), which starts Unbound; or ask Shazdehviir in Helgen "Skip to Helgen Keep" (the speaker is Shazdehviir), which starts Unbound. |

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
- MQ105 (The Way of the Voice) at stage 160 calls SetStage 10. Source: QF_MQ105_000242BA.fragment_42 on Skyrim.esm:0242BA (Skyrim.esm).
- Its first objective: "Retrieve the Horn of Jurgen Windcaller".
- Its target alias HornActivator: nothing named.

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
