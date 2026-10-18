# Start check: The Dragonborn (`main-quest`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named.

## 1. Unbound (`MQ101`, Skyrim.esm:03372B, Alternate Perspective - Gate to Sovngarde Edition.esp)

**Started by**

- AP_DialogueHelgen calls SetStage 6. Source: APMessengerUtil on AlternatePerspective.esp:1E301D (AlternatePerspective.esp). **script**
- AP_DialogueHelgen calls SetStage 7. Source: APMessengerUtil on AlternatePerspective.esp:1E301D (AlternatePerspective.esp). **script**
- APS_VanillaStart at stage 0 calls SetStage 4. Source: QF_APS_VanillaStart_053BF197 on AlternatePerspective.esp:3BF197 (AlternatePerspective.esp). **script**
- APS_MQSkipKeep at stage 5 calls SetStage 6. Source: QF_APS_MQSkipKeep_0547F943 on AlternatePerspective.esp:47F943 (AlternatePerspective.esp). **script**
- APS_MQSkipKeep at stage 5 calls SetStage 7. Source: QF_APS_MQSkipKeep_0547F943 on AlternatePerspective.esp:47F943 (AlternatePerspective.esp). **script**
- Dialogue with someone the line does not name: SetStage 1. Source: TIF_AP_05075139.Fragment_0 on INFO AlternatePerspective.esp:075139 (AlternatePerspective.esp). **script**
- Dialogue with Shazdehviir, placed in Helgen: SetStage 6. Source: TIF_AP_0638C6E9.Fragment_1 on INFO AlternatePerspective.esp:38C6E9 (AlternatePerspective.esp). **script**
- Dialogue with Shazdehviir, placed in Helgen: SetStage 7. Source: TIF_AP_0638C6E9.Fragment_1 on INFO AlternatePerspective.esp:38C6E9 (AlternatePerspective.esp). **script**

**Where**

- First objective: "Make your way to the Keep". Source: Skyrim.esm:03372B QOBJ. **files**

**Needs**

- Quests: Unbound stage >= 4.0. Source: the quest's own conditions. **files**
- Door: The Helgen door needs a key it doesn't name. Source: AlternatePerspective.esp:1DDEFA (AlternatePerspective.esp). **files**

**Gives**: Long Bow. **script**

## 2. Before the Storm (`MQ102`, Skyrim.esm:04E50D, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MQ103 (Bleak Falls Barrow) at stage 1 calls SetStage 1. Source: QF_MQ103_000D0800 on Skyrim.esm:0D0800 (LoreRim - Dialogue Patch.esp). **script**
- MQ102B (Season Unending) at stage 10 calls Start. Source: QF_MQ102B_010A4C68 on Skyrim.esm:02610A (Skyrim.esm). **script**
- MQ102B (Season Unending) at stage 5 calls Start. Source: QF_MQ102B_010A4C68 on Skyrim.esm:02610A (Skyrim.esm). **script**
- MQ102B (Season Unending) at stage 20 calls SetStage 10. Source: QF_MQ102B_010A4C68 on Skyrim.esm:02610A (Skyrim.esm). **script**
- MQ102A (Season Unending) at stage 20 calls SetStage 10. Source: QF_MQ102_0002BF9C on Skyrim.esm:02BF9C (Skyrim.esm). **script**
- MQ102A (Season Unending) at stage 5 calls Start. Source: QF_MQ102_0002BF9C on Skyrim.esm:02BF9C (Skyrim.esm). **script**

**Where**

- First objective: "Talk to <Alias=RiverwoodFriend> in Riverwood". Source: Skyrim.esm:04E50D QOBJ. **files**
- Who: Irileth (its first speaker), placed in Dragonsreach, Whiterun. **files**

**Needs**

- Door: The Dragonsreach door is locked (Master). Source: Skyrim.esm:09A0E4 (Snazzy Interiors - JKs Dragonsreach.esp). **files**

**Gives**: REQ_LI_MQ102_Reward2 (a reward list); REQ_LI_MQ102_Reward1 (a reward list). **script**

## 3. Bleak Falls Barrow (`MQ103`, Skyrim.esm:0D0800, LoreRim - Dialogue Patch.esp)

**Started by**

- MQ102 (Before the Storm) at stage 160 calls SetStage 10. Source: QF_MQ102_0004E50D on Skyrim.esm:04E50D (Unofficial Skyrim Special Edition Patch.esp). **script**
- MQ102 (Before the Storm) at stage 150 calls SetStage 8. Source: QF_MQ102_0004E50D on Skyrim.esm:04E50D (Unofficial Skyrim Special Edition Patch.esp). **script**
- MQ104 (Dragon Rising) at stage 1 calls SetStage 1. Source: QF_MQ104B_0002610C on Skyrim.esm:02610C (LoreRim - Weapons.esp). **script**
- MQ104 (Dragon Rising) at stage 1 calls SetStage 10. Source: QF_MQ104B_0002610C on Skyrim.esm:02610C (LoreRim - Weapons.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0D0800 DNAM (LoreRim - Dialogue Patch.esp). **files**

**Where**

- First objective: "Talk to Farengar". Source: Skyrim.esm:0D0800 QOBJ. **files**

**Needs**

- Door: The Dragonsreach door is locked (Master). Source: Skyrim.esm:09A0E4 (Snazzy Interiors - JKs Dragonsreach.esp). **files**

## 4. Dragon Rising (`MQ104`, Skyrim.esm:02610C, LoreRim - Weapons.esp)

**Started by**

- MQ103 (Bleak Falls Barrow) at stage 190 calls SetStage 10. Source: QF_MQ103_000D0800 on Skyrim.esm:0D0800 (LoreRim - Dialogue Patch.esp). **script**
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 1. Source: QF_MQ105_000242BA on Skyrim.esm:0242BA (Skyrim.esm). **script**
- MQ105 (The Way of the Voice) at stage 1 calls SetStage 10. Source: QF_MQ105_000242BA on Skyrim.esm:0242BA (Skyrim.esm). **script**

**Where**

- First objective: "Talk to Jarl Balgruuf". Source: Skyrim.esm:02610C QOBJ. **files**
- Who: Irileth (its first speaker), placed in Dragonsreach, Whiterun. **files**

**Needs**

- Door: The Riften door needs the Riften Warehouse Key. Source: Skyrim.esm:016C7E (Skyrim.esm). **files**
- Door: The Dragonsreach door is locked (Master). Source: Skyrim.esm:09A0E4 (Snazzy Interiors - JKs Dragonsreach.esp). **files**

**Gives**: REQ_LI_FavorRewardMQ104 (a reward list); Blade of Whiterun. **script**

## 5. The Way of the Voice (`MQ105`, Skyrim.esm:0242BA, Skyrim.esm)

**Started by**

- DA08 (The Whispering Door) at stage 1 calls SetStage 0. Source: QF_DA08_0004A37B on Skyrim.esm:04A37B (TWDQE - Wintersun patch.esp). **script**
- MQ106 (A Blade in the Dark) at stage 1 calls SetStage 1. Source: QF_MQ106_00032926 on Skyrim.esm:032926 (Skyrim.esm). **script**
- MQ104 (Dragon Rising) at stage 110 calls SetStage 5. Source: QF_MQ104B_0002610C on Skyrim.esm:02610C (LoreRim - Weapons.esp). **script**
- MQ104 (Dragon Rising) at stage 150 calls SetStage 10. Source: QF_MQ104B_0002610C on Skyrim.esm:02610C (LoreRim - Weapons.esp). **script**
- APS_MQSkipMQ105Hadvar at stage 0 calls SetStage 1. Source: QF_APS_MQSkip_063D36E9 on AlternatePerspective.esp:3D36E9 (AlternatePerspective.esp). **script**
- APS_MQSkipMQ105Ralof at stage 0 calls SetStage 1. Source: QF_APS_MQSkipRalof_063D36EA on AlternatePerspective.esp:3D36EA (AlternatePerspective.esp). **script**

**Where**

- First objective: "Speak to the Greybeards". Source: Skyrim.esm:0242BA QOBJ. **files**
- Who: Arngeir (its first speaker), placed in High Hrothgar. **files**

**Needs**

- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D3 (Skyrim.esm). **files**
- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D2 (Skyrim.esm). **files**

## 6. The Horn of Jurgen Windcaller (`MQ105Ustengrav`, Skyrim.esm:0713DC, Skyrim.esm)

**Started by**

- MQ105 (The Way of the Voice) at stage 160 calls SetStage 10. Source: QF_MQ105_000242BA on Skyrim.esm:0242BA (Skyrim.esm). **script**

**Where**

- First objective: "Retrieve the Horn of Jurgen Windcaller". Source: Skyrim.esm:0713DC QOBJ. **files**

**Needs**

- Nothing in its own conditions or doors.

## 7. A Blade in the Dark (`MQ106`, Skyrim.esm:032926, Skyrim.esm)

**Started by**

- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 1. Source: QF_MQ201_00035D5F on Skyrim.esm:035D5F (Storm the Thalmor Embassy.esp). **script**
- MQ201 (Diplomatic Immunity) at stage 1 calls SetStage 30. Source: QF_MQ201_00035D5F on Skyrim.esm:035D5F (Storm the Thalmor Embassy.esp). **script**
- MQ105 (The Way of the Voice) at stage 200 calls SetStage 5. Source: QF_MQ105_000242BA on Skyrim.esm:0242BA (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 10 (needs: GetIsID Delphine == 1.0; A Blade in the Dark stage >= 5.0; A Blade in the Dark stage < 10.0; fn67 == 1.0; GetActorValue == 1.0). Source: TIF__000453EE.Fragment_0 on INFO Skyrim.esm:0453EE (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 10 (needs: GetIsID Delphine == 1.0; A Blade in the Dark stage >= 5.0; A Blade in the Dark stage < 10.0; fn67 == 1.0). Source: TIF__000A56D4.Fragment_0 on INFO Skyrim.esm:0A56D4 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 30 (needs: GetIsID Delphine == 1.0). Source: TIF__00083055.Fragment_0 on INFO Skyrim.esm:083055 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 30 (needs: GetIsID Delphine == 1.0). Source: TIF__000C65A2.Fragment_0 on INFO Skyrim.esm:0C65A2 (Skyrim.esm). **script**

**Where**

- First objective: "Talk to Delphine". Source: Skyrim.esm:032926 QOBJ. **files**
- Who: Delphine (named in its opening), placed in Sleeping Giant Inn, Riverwood. **files**

**Needs**

- Nothing in its own conditions or doors.

**Gives**: Delphine's Secret Door Key. **script**

## 8. Diplomatic Immunity (`MQ201`, Skyrim.esm:035D5F, Storm the Thalmor Embassy.esp)

**Started by**

- MQ202 (A Cornered Rat) at stage 1 calls SetStage 1. Source: QF_MQ202_00036191 on Skyrim.esm:036191 (Requiem.esp). **script**
- MQ202 (A Cornered Rat) at stage 1 calls SetStage 30. Source: QF_MQ202_00036191 on Skyrim.esm:036191 (Requiem.esp). **script**
- MQ106 (A Blade in the Dark) at stage 160 calls SetStage 10. Source: QF_MQ106_00032926 on Skyrim.esm:032926 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 30 (needs: GetIsID Delphine == 1.0). Source: TIF__01162FB9.Fragment_0 on INFO Skyrim.esm:03B495 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 20 (needs: GetIsID Delphine == 1.0). Source: TIF__0003B499.Fragment_0 on INFO Skyrim.esm:03B499 (Skyrim.esm). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 15 (needs: GetIsID Delphine == 1.0). Source: TIF__01162FAA.Fragment_0 on INFO Skyrim.esm:03B492 (Skyrim.esm). **script**

**Where**

- First objective: "Meet Delphine in Riverwood or storm the Thalmor Embassy". Source: Skyrim.esm:035D5F QOBJ. **files**
- Who: Delphine (named in its opening), placed in Sleeping Giant Inn, Riverwood. **files**

**Needs**

- Nothing in its own conditions or doors.

**Gives**: Party Clothes; Party Shoes. **script**

## 9. A Cornered Rat (`MQ202`, Skyrim.esm:036191, Requiem.esp)

**Started by**

- MQ203 (Alduin's Wall) at stage 1 calls SetStage 1. Source: QF_MQ203_00036192 on Skyrim.esm:036192 (Skyrim.esm). **script**
- MQ201 (Diplomatic Immunity) at stage 230 calls SetStage 5. Source: QF_MQ201_00035D5F on Skyrim.esm:035D5F (Storm the Thalmor Embassy.esp). **script**
- MQ201 (Diplomatic Immunity) at stage 250 calls SetStage 10. Source: QF_MQ201_00035D5F on Skyrim.esm:035D5F (Storm the Thalmor Embassy.esp). **script**
- Patch1_5_UpdateQuest at stage 10 calls SetStage 5. Source: QF_Patch1_5_UpdateQuest_0100083F on Update.esm:00083F (Update.esm). **script**
- Patch1_5_UpdateQuest at stage 10 calls SetStage 10. Source: QF_Patch1_5_UpdateQuest_0100083F on Update.esm:00083F (Update.esm). **script**

**Where**

- First objective: "Ask in Riften about Esbern". Source: Skyrim.esm:036191 QOBJ. **files**
- Who: Delphine (named in its opening), placed in Sleeping Giant Inn, Riverwood. **files**

**Needs**

- Nothing in its own conditions or doors.

## 10. Alduin's Wall (`MQ203`, Skyrim.esm:036192, Skyrim.esm)

**Started by**

- MQ202 (A Cornered Rat) at stage 180 calls SetStage 10. Source: QF_MQ202_00036191 on Skyrim.esm:036191 (Requiem.esp). **script**
- MQ204 (The Throat of the World) at stage 1 calls SetStage 1. Source: QF_MQ204_0002D515 on Skyrim.esm:02D515 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Where**

- First objective: "Escort Esbern to Riverwood". Source: Skyrim.esm:036192 QOBJ. **files**
- Who: Delphine (named in its opening), placed in Sleeping Giant Inn, Riverwood. **files**

**Needs**

- Nothing in its own conditions or doors.

## 11. The Throat of the World (`MQ204`, Skyrim.esm:02D515, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MQ203 (Alduin's Wall) at stage 280 calls SetStage 10. Source: QF_MQ203_00036192 on Skyrim.esm:036192 (Skyrim.esm). **script**
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 1. Source: QF_MQ205_0002D516 on Skyrim.esm:02D516 (Unofficial Skyrim Special Edition Patch.esp). **script**
- MQ205 (Elder Knowledge) at stage 1 calls SetStage 10. Source: QF_MQ205_0002D516 on Skyrim.esm:02D516 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Where**

- First objective: "Talk to Arngeir". Source: Skyrim.esm:02D515 QOBJ. **files**
- Who: Arngeir (named in its opening), placed in High Hrothgar. **files**

**Needs**

- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D3 (Skyrim.esm). **files**
- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D2 (Skyrim.esm). **files**

## 12. Elder Knowledge (`MQ205`, Skyrim.esm:02D516, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MQ206 (Alduin's Bane) at stage 1 calls SetStage 1. Source: QF_MQ206_00036193 on Skyrim.esm:036193 (Skyrim.esm). **script**
- MQ204 (The Throat of the World) at stage 205 calls SetStage 10. Source: QF_MQ204_0002D515 on Skyrim.esm:02D515 (Unofficial Skyrim Special Edition Patch.esp). **script**
- MQ204 (The Throat of the World) at stage 200 calls SetStage 10. Source: QF_MQ204_0002D515 on Skyrim.esm:02D515 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Where**

- First objective: "Learn the location of the Elder Scroll". Source: Skyrim.esm:02D516 QOBJ. **files**
- Who: Paarthurnax (named in its opening), placed in Location for things that need a location. **files**

**Needs**

- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D3 (Skyrim.esm). **files**
- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D2 (Skyrim.esm). **files**

## 13. Alduin's Bane (`MQ206`, Skyrim.esm:036193, Skyrim.esm)

**Started by**

- MQ301 (The Fallen) at stage 1 calls SetStage 1. Source: QF_MQ301_00044C56 on Skyrim.esm:044C56 (Unofficial Skyrim Special Edition Patch.esp). **script**
- MQ205 (Elder Knowledge) at stage 100 calls SetStage 10. Source: QF_MQ205_0002D516 on Skyrim.esm:02D516 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Where**

- First objective: "Read the Elder Scroll at the Time-Wound". Source: Skyrim.esm:036193 QOBJ. **files**
- Who: Paarthurnax (named in its opening), placed in Location for things that need a location. **files**

**Needs**

- Nothing in its own conditions or doors.

## 14. The Fallen (`MQ301`, Skyrim.esm:044C56, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MQ303 (The World-Eater's Eyrie) at stage 1 calls SetStage 1. Source: QF_MQ303_00046EF0 on Skyrim.esm:046EF0 (Unofficial Skyrim Special Edition Patch.esp). **script**
- MQ302 (Season Unending) at stage 1 calls SetStage 1. Source: QF_MQ302_00045923 on Skyrim.esm:045923 (Skyrim.esm). **script**
- MQ206 (Alduin's Bane) at stage 220 calls SetStage 10. Source: QF_MQ206_00036193 on Skyrim.esm:036193 (Skyrim.esm). **script**

**Where**

- First objective: "Talk to Paarthurnax". Source: Skyrim.esm:044C56 QOBJ. **files**
- Who: Paarthurnax (named in its opening), placed in Location for things that need a location. **files**

**Needs**

- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D3 (Skyrim.esm). **files**
- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D2 (Skyrim.esm). **files**

## 15. Season Unending (`MQ302`, Skyrim.esm:045923, Skyrim.esm)

**Started by**

- MQ301 (The Fallen) at stage 30 calls SetStage 10. Source: QF_MQ301_00044C56 on Skyrim.esm:044C56 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Where**

- First objective: "Talk to Arngeir". Source: Skyrim.esm:045923 QOBJ. **files**
- Who: Arngeir (named in its opening), placed in High Hrothgar. **files**

**Needs**

- Door: The Dragonsreach door is locked (Master). Source: Skyrim.esm:09A0E4 (Snazzy Interiors - JKs Dragonsreach.esp). **files**
- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D3 (Skyrim.esm). **files**
- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D2 (Skyrim.esm). **files**

**Gives**: CWRankRewardSons (a reward list); CWRankRewardImperial (a reward list). **script**

## 16. The World-Eater's Eyrie (`MQ303`, Skyrim.esm:046EF0, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MQ304 (Sovngarde) at stage 1 calls SetStage 1. Source: QF_MQ304_00046EF1 on Skyrim.esm:046EF1 (Update.esm). **script**
- MQ301 (The Fallen) at stage 200 calls SetStage 5. Source: QF_MQ301_00044C56 on Skyrim.esm:044C56 (Unofficial Skyrim Special Edition Patch.esp). **script**
- MQ301 (The Fallen) at stage 220 calls SetStage 10. Source: QF_MQ301_00044C56 on Skyrim.esm:044C56 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Where**

- First objective: "Set Odahviing free". Source: Skyrim.esm:046EF0 QOBJ. **files**
- Who: Odahviing (named in its opening), placed in Dragonsreach, Great Porch. **files**

**Needs**

- Door: The Dragonsreach door is locked (Master). Source: Skyrim.esm:09A0E4 (Snazzy Interiors - JKs Dragonsreach.esp). **files**

## 17. Sovngarde (`MQ304`, Skyrim.esm:046EF1, Update.esm)

**Started by**

- MQ305 (Dragonslayer) at stage 1 calls SetStage 1. Source: QF_MQ305_00046EF2 on Skyrim.esm:046EF2 (Skyrim.esm). **script**
- MQ305 (Dragonslayer) at stage 1 calls SetStage 5. Source: QF_MQ305_00046EF2 on Skyrim.esm:046EF2 (Skyrim.esm). **script**
- MQ305 (Dragonslayer) at stage 1 calls SetStage 10. Source: QF_MQ305_00046EF2 on Skyrim.esm:046EF2 (Skyrim.esm). **script**
- MQ303 (The World-Eater's Eyrie) at stage 180 calls SetStage 5. Source: QF_MQ303_00046EF0 on Skyrim.esm:046EF0 (Unofficial Skyrim Special Edition Patch.esp). **script**
- MQ303 (The World-Eater's Eyrie) at stage 300 calls SetStage 10. Source: QF_MQ303_00046EF0 on Skyrim.esm:046EF0 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Where**

- First objective: "Find out how to defeat Alduin". Source: Skyrim.esm:046EF1 QOBJ. **files**
- Who: Tsun (its first speaker), placed in Sovngarde. **files**

**Needs**

- Nothing in its own conditions or doors.

## 18. Dragonslayer (`MQ305`, Skyrim.esm:046EF2, Skyrim.esm)

**Started by**

- MQ304 (Sovngarde) at stage 200 calls SetStage 10. Source: QF_MQ304_00046EF1 on Skyrim.esm:046EF1 (Update.esm). **script**

**Where**

- First objective: "Help the heroes of Sovngarde dispel Alduin's mist". Source: Skyrim.esm:046EF2 QOBJ. **files**
- Who: Gormlaith Golden-Hilt (named in its opening), placed in Hall of Valor, Sovngarde. **files**

**Needs**

- Nothing in its own conditions or doors.

## 19. Paarthurnax (`MQPaarthurnax`, Skyrim.esm:03FA16, PaarthurnaxQuestExpansion.esp)

**Started by**

- MQ301 (The Fallen) at stage 10 calls SetStage 10. Source: QF_MQ301_00044C56 on Skyrim.esm:044C56 (Unofficial Skyrim Special Edition Patch.esp). **script**
- MQ301 (The Fallen) at stage 50 calls SetStage 15. Source: QF_MQ301_00044C56 on Skyrim.esm:044C56 (Unofficial Skyrim Special Edition Patch.esp). **script**
- MQ301 (The Fallen) at stage 30 calls SetStage 15. Source: QF_MQ301_00044C56 on Skyrim.esm:044C56 (Unofficial Skyrim Special Edition Patch.esp). **script**
- MQ301 (The Fallen) at stage 18 calls SetStage 15. Source: QF_MQ301_00044C56 on Skyrim.esm:044C56 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 20 (needs: GetIsID Delphine == 1.0). Source: TIF__00042841.Fragment_0 on INFO Skyrim.esm:042841 (Skyrim.esm). **script**
- Dialogue with Esbern, placed in The Ratway Warrens, Esbern's Vault: SetStage 20 (needs: GetIsID Esbern == 1.0). Source: TIF__000428DC.Fragment_0 on INFO Skyrim.esm:0428DC (Unofficial Skyrim Special Edition Patch.esp). **script**

**Where**

- First objective: "Decide Paarthurnax's Fate". Source: Skyrim.esm:03FA16 QOBJ. **files**
- Who: Paarthurnax (named in its opening), placed in Location for things that need a location. **files**

**Needs**

- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D3 (Skyrim.esm). **files**
- Door: The High Hrothgar door needs a key it doesn't name. Source: Skyrim.esm:0877D2 (Skyrim.esm). **files**

## 20. The Words of Power (`FreeformHighHrothgarA`, Skyrim.esm:0E76DE, Skyrim.esm)

**Started by**

- Dialogue with Arngeir, placed in High Hrothgar: SetStage 10 (needs: DialogueHighHrothgar stage 10 done; The Words of Power stage 10 not done; GetIsID Arngeir == 1.0). Source: TIF__000E76D9.Fragment_0 on INFO Skyrim.esm:0E76D9 (Skyrim.esm). **script**
- Story manager node HighHrothgarNode, event: change location; conditions up its parents: fn576 == 1.0. Source: HighHrothgarNode Skyrim.esm:0E76E4 (Skyrim.esm). **files**

**Where**

- First objective: "Find the Word of Power in <Alias=Dungeon>". Source: Skyrim.esm:0E76DE QOBJ. **files**

**Needs**

- Quests: Paarthurnax stage 100 not done; The Way of the Voice stage 300 done. Source: the quest's own conditions. **files**
- Other conditions: fn576 == 1.0. Source: the quest's own conditions. **files**

## 21. Rebuilding the Blades (`FreeformSkyhavenTempleA`, Skyrim.esm:0E38C9, PaarthurnaxQuestExpansion.esp)

**Started by**

- Dialogue with Delphine, placed in Sleeping Giant Inn: SetStage 10 (needs: GetIsID Delphine == 1.0; GetInFaction CurrentFollowerFaction == 0.0; fn359 == 1.0). Source: TIF__000E38C5.Fragment_0 on INFO Skyrim.esm:0E38C5 (Missing Follower Dialogue Fix.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0E38C9 DNAM (PaarthurnaxQuestExpansion.esp). **files**

**Where**

- First objective: "Bring a follower to Delphine". Source: Skyrim.esm:0E38C9 QOBJ. **files**
- Who: Delphine (named in its opening), placed in Sleeping Giant Inn, Riverwood. **files**

**Needs**

- Quests: Alduin's Wall stage 280 done; Paarthurnax stage < 10.0; Paarthurnax stage 100 done; Paarthurnax stage 99 done. Source: the quest's own conditions. **files**
- Other conditions: fn359 == 1.0. Source: the quest's own conditions. **files**

## 22. Dragon Hunting (`FreeformSkyHavenTempleB`, Skyrim.esm:0E3E67, PaarthurnaxQuestExpansion.esp)

**Started by**

- Dialogue with Esbern, placed in The Ratway Warrens, Esbern's Vault: SetStage 10 (needs: GetIsID Esbern == 1.0; GetInFaction CurrentFollowerFaction == 0.0; fn359 == 1.0). Source: TIF__000E67EC.Fragment_0 on INFO Skyrim.esm:0E67EC (Missing Follower Dialogue Fix.esp). **script**
- Story manager node SkyHavenTempleNode, event: change location; conditions up its parents: no conditions. Source: SkyHavenTempleNode Skyrim.esm:0E6802 (DragonHunting.esp). **files**

**Where**

- First objective: "Kill the Dragon in <Alias=DragonLair>". Source: Skyrim.esm:0E3E67 QOBJ. **files**

**Needs**

- Quests: Alduin's Wall stage 280 done; Paarthurnax stage < 10.0; Paarthurnax stage 100 done; Paarthurnax stage 99 done. Source: the quest's own conditions. **files**
- Other conditions: fn359 == 1.0. Source: the quest's own conditions. **files**

## 23. Dragon Research (`FreeformSkyHavenTempleD`, Skyrim.esm:0E6DF1, DragonHuntingPaarthurnaxQE.esp)

**Started by**

- Dialogue with Esbern, placed in The Ratway Warrens, Esbern's Vault: SetStage 10 (needs: fn264 == 0.0; Dragon Research stage 100 not done; Dragon Hunting stage 20 done; GetIsID Esbern == 1.0; GetInFaction CurrentFollowerFaction == 0.0; fn359 == 1.0). Source: TIF__000E67EB.Fragment_0 on INFO Skyrim.esm:0E67EB (LoreRim - Dialogue Patch.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0E6DF1 DNAM (DragonHuntingPaarthurnaxQE.esp). **files**

**Where**

- First objective: "Bring 3 Dragon Blood, 3 Dragon Bile and 3 Dragon Rheum to Esbern". Source: Skyrim.esm:0E6DF1 QOBJ. **files**
- Who: Esbern (named in its opening), placed in The Ratway Warrens, Esbern's Vault. **files**

**Needs**

- Quests: Alduin's Wall stage 280 done; Paarthurnax stage < 10.0; Paarthurnax stage 100 done; Paarthurnax stage 99 done. Source: the quest's own conditions. **files**
- Other conditions: fn359 == 1.0. Source: the quest's own conditions. **files**

## Every way a game begins

MQ101's start-game flag: see each quest above. Each start's option is a quest; what its scripts do to the main quest:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves |
| --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | yes, from stage 6 | MQ101 SetStage 6; MQ101 SetStage 7 |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | yes, from stage 250 | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest |

**When MQ101 doesn't run, what starts the main quest later** (calls on MQ101 to MQ105 from outside the starts and the main quest itself):

- MQ101: AP_DialogueHelgen (SetStage 6), APMessengerUtil, AlternatePerspective.esp
- MQ101: AP_DialogueHelgen (SetStage 7), APMessengerUtil, AlternatePerspective.esp
- MQ101: APS_VanillaStart stage 0 (SetStage 4), QF_APS_VanillaStart_053BF197, AlternatePerspective.esp
- MQ101: AP_DialogueHelgen (SetStage 1), TIF_AP_05075139, AlternatePerspective.esp
- MQ101: dialogue with Shazdehviir (SetStage 6), TIF_AP_0638C6E9, AlternatePerspective.esp
- MQ101: dialogue with Shazdehviir (SetStage 7), TIF_AP_0638C6E9, AlternatePerspective.esp
- MQ102A: CW02A stage 1 (SetStage 1), QF_MQ103A_0002D75C, LoreRim - Dialogue Patch.esp
- MQ102B: CW02B stage 1 (SetStage 1), QF_MQ103B_0002610B, LoreRim - Dialogue Patch.esp
- MQ105: DA08 stage 1 (SetStage 0), QF_DA08_0004A37B, TWDQE - Wintersun patch.esp
- MQ105: MQ106 stage 1 (SetStage 1), QF_MQ106_00032926, Skyrim.esm
- MQ105: APS_MQSkipMQ105Hadvar stage 0 (SetStage 1), QF_APS_MQSkip_063D36E9, AlternatePerspective.esp
- MQ105: APS_MQSkipMQ105Ralof stage 0 (SetStage 1), QF_APS_MQSkipRalof_063D36EA, AlternatePerspective.esp

Main-quest quests with the start-game flag (running from the first moment, whatever the start): MQ103. **files**

Quests outside the main quest that move it, and what starts them:

- AP_DialogueHelgen (AlternatePerspective.esp): Unbound (Start)
- APS_VanillaStart (AlternatePerspective.esp): no starter found in its records or scripts
- APS_MQSkipMQ105Hadvar (AlternatePerspective.esp): APS_MQSkipMQ105 stage 5 (Start)
  - APS_MQSkipMQ105 is started by: no starter found in its records or scripts (**unread**)
- APS_MQSkipMQ105Ralof (AlternatePerspective.esp): APS_MQSkipMQ105 stage 5 (Start)
  - APS_MQSkipMQ105 is started by: no starter found in its records or scripts (**unread**)
- DLC2SoulSteal (Dragonborn.esm): start-game
- CW02B (LoreRim - Dialogue Patch.esp): Joining the Stormcloaks stage 200 (SetStage 10)
  - CW01B is started by: Stormcloak Introductions stage 20 (SetStage 1)
- CW02A (LoreRim - Dialogue Patch.esp): Joining the Legion stage 200 (SetStage 10)
  - CW01A is started by: Imperial Introductions stage 21 (SetStage 1); Imperial Introductions stage 20 (SetStage 1)
- MQ106 (Skyrim.esm): Diplomatic Immunity stage 1 (SetStage 1); The Way of the Voice stage 200 (SetStage 5); dialogue with Delphine (SetStage 10)
  - MQ201 is started by: A Cornered Rat stage 1 (SetStage 1); A Blade in the Dark stage 160 (SetStage 10)
- MQkillDragon (Dragonborn.esm): start-game
- MQ201 (Storm the Thalmor Embassy.esp): A Cornered Rat stage 1 (SetStage 1); A Blade in the Dark stage 160 (SetStage 10)
  - MQ202 is started by: Alduin's Wall stage 1 (SetStage 1); Diplomatic Immunity stage 230 (SetStage 5); Diplomatic Immunity stage 250 (SetStage 10); Patch1_5_UpdateQuest stage 10 (SetStage 5); Patch1_5_UpdateQuest stage 10 (SetStage 10)
  - MQ106 is started by: Diplomatic Immunity stage 1 (SetStage 1); The Way of the Voice stage 200 (SetStage 5); dialogue with Delphine (SetStage 10)
- DA08 (TWDQE - Wintersun patch.esp): dialogue with Balgruuf the Greater (SetStage 10); start-game
- e3demo (Skyrim.esm): no starter found in its records or scripts
- MQ101DragonAttack (AlternatePerspective.esp): Unbound stage 70 (SetStage 5); Unbound stage 150 (SetStage 10)

## The payoff

- **Dragonslayer** (completes at 200): nothing is given on its completing stages.
- **Paarthurnax** (completes at 99, 100): nothing is given on its completing stages.

## Three questions

**Is Skyrim.esm:0242BA MQ105, and is stage 160 the one that completes it?** Yes: Skyrim.esm:0242BA is MQ105 (The Way of the Voice), and stage 160 is its only completing stage.

**Who starts The Horn of Jurgen Windcaller, and where?** The Horn of Jurgen Windcaller (MQ105Ustengrav, Skyrim.esm:0713DC):
- MQ105 (The Way of the Voice) at stage 160 calls SetStage 10. Source: QF_MQ105_000242BA on Skyrim.esm:0242BA (Skyrim.esm).
- Its first objective: "Retrieve the Horn of Jurgen Windcaller".

**Does Dragonborn's cultist node read Timing is Everything's level (25 in its settings.ini), or something else?** Timing is Everything's setting iTIE_MinimumLevel:Dragonborn = 25 (settings.ini in Timing is Everything SE - Settings Loader).

- Node DLC2CultistAmbushNode001 (LoreRim - Global Modifiers.esp), event change location: level >= global DLC2CultistAttackMinLevel_KRY (record 25.0, at run time nothing sets it; **files**). All its conditions: level >= DLC2CultistAttackMinLevel_KRY (now 25.0); global DLC2QuestStartSelection_KRY == 1.0 (now 1.0); fn359 == 0.0; The Way of the Voice stage >= 160.0; Dragonborn stage < 5.0; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0.0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode002 (TimingIsEverything.esp), event change location: level >= global DLC2CultistAttackMinLevel_KRY (record 25.0, at run time nothing sets it; **files**). All its conditions: level >= DLC2CultistAttackMinLevel_KRY (now 25.0); global DLC2QuestStartSelection_KRY == 2.0 (now 1.0); fn359 == 0.0; The Horn of Jurgen Windcaller stage >= 60.0; Dragonborn stage < 5.0; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0.0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode003 (TimingIsEverything.esp), event change location: level >= global DLC2CultistAttackMinLevel_KRY (record 25.0, at run time nothing sets it; **files**). All its conditions: level >= DLC2CultistAttackMinLevel_KRY (now 25.0); global DLC2QuestStartSelection_KRY == 3.0 (now 1.0); fn359 == 0.0; A Blade in the Dark stage >= 200.0; Dragonborn stage < 5.0; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0.0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode004 (TimingIsEverything.esp), event change location: level >= global DLC2CultistAttackMinLevel_KRY (record 25.0, at run time nothing sets it; **files**). All its conditions: level >= DLC2CultistAttackMinLevel_KRY (now 25.0); global DLC2QuestStartSelection_KRY == 4.0 (now 1.0); fn359 == 0.0; Alduin's Wall stage >= 280.0; Dragonborn stage < 5.0; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0.0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode005 (TimingIsEverything.esp), event change location: level >= global DLC2CultistAttackMinLevel_KRY (record 25.0, at run time nothing sets it; **files**). All its conditions: level >= DLC2CultistAttackMinLevel_KRY (now 25.0); global DLC2QuestStartSelection_KRY == 5.0 (now 1.0); fn359 == 0.0; The Throat of the World stage >= 200.0; Dragonborn stage < 5.0; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0.0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode006 (TimingIsEverything.esp), event change location: level >= global DLC2CultistAttackMinLevel_KRY (record 25.0, at run time nothing sets it; **files**). All its conditions: level >= DLC2CultistAttackMinLevel_KRY (now 25.0); global DLC2QuestStartSelection_KRY == 6.0 (now 1.0); fn359 == 0.0; Elder Knowledge stage >= 100.0; Dragonborn stage < 5.0; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0.0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode007 (TimingIsEverything.esp), event change location: level >= global DLC2CultistAttackMinLevel_KRY (record 25.0, at run time nothing sets it; **files**). All its conditions: level >= DLC2CultistAttackMinLevel_KRY (now 25.0); global DLC2QuestStartSelection_KRY == 7.0 (now 1.0); fn359 == 0.0; Alduin's Bane stage >= 220.0; Dragonborn stage < 5.0; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0.0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode008 (TimingIsEverything.esp), event change location: level >= global DLC2CultistAttackMinLevel_KRY (record 25.0, at run time nothing sets it; **files**). All its conditions: level >= DLC2CultistAttackMinLevel_KRY (now 25.0); global DLC2QuestStartSelection_KRY == 8.0 (now 1.0); fn359 == 0.0; Dragonslayer stage >= 200.0; Dragonborn stage < 5.0; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0.0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode000 (TimingIsEverything.esp), event change location: level >= global DLC2CultistAttackMinLevel_KRY (record 25.0, at run time nothing sets it; **files**). All its conditions: level >= DLC2CultistAttackMinLevel_KRY (now 25.0); global DLC2QuestStartSelection_KRY == 0.0 (now 1.0); fn359 == 0.0; Dragon Rising stage >= 90.0; Dragonborn stage < 5.0; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0.0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**

## Run-time values

Settings loaders the story's globals touch, and whether the script the game runs reads their settings.ini:

- TimingIsEverything: script TIE_MCMScript on TimingIsEverything.esp:005E3B; the copy that wins is C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex (extends SKI_ConfigBase); it carries no settings.ini value into a global, so the globals keep their record values unless the player changes them in the menu.
- Wyrmstooth: script WT_MCMScript on Wyrmstooth.esp:AC1487; the copy that wins is C:/LoreRim\mods\Wyrmstooth - Settings Loader\scripts\WT_MCMScript.pex (extends MCM_ConfigBase); it reads its MCM Helper settings on load and sets globals from them.

- Timing is Everything settings loader: installed (Timing is Everything SE - Settings Loader); Dragonborn level setting 25 (settings.ini in Timing is Everything SE - Settings Loader), meant for DLC2CultistAttackMinLevel_KRY (record 25.0 from TimingIsEverything.esp; in game 25.0; the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; **files**).
- Wyrmstooth settings loader: installed (Wyrmstooth - Settings Loader). WTStartLevel: record 20.0 (Requiem - Wyrmstooth.esp), in game 10 (Wyrmstooth iWTGeneralRequirementsMinimalLevel:Requirements = 10), **run time**.

Scripts the records name that aren't in the install (259); calls inside them can't be read. Full list in the JSON.
