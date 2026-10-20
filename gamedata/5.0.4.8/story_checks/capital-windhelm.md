# Start check: Windhelm, expanded (`capital-windhelm`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Pit Fighter (`0WHQuestArenaFightRepeating`, WindhelmSSE.esp:3EC170, WindhelmSSE.esp)

**Started by**

- Dialogue with Huki Seven-Swords, placed in The Pit Bloodworks, Bloodworks, "I want to fight in an unranked match.": SetStage 20 (when: Pit Fighter stage < 19; the speaker is Huki Seven-Swords). Source: TIF__0518B3A1.Fragment_0 on INFO WindhelmSSE.esp:18B3A1 (WindhelmSSE.esp). **script**
- Dialogue with Huki Seven-Swords, placed in The Pit Bloodworks, Bloodworks, "I want fight in another unranked match.": SetStage 19 (when: GetQuestRunning Pit Fighter == 0; the speaker is Huki Seven-Swords). Source: TIF__05200A45.Fragment_2 on INFO WindhelmSSE.esp:200A45 (WindhelmSSE.esp). **script**
- Dialogue with Huki Seven-Swords, placed in The Pit Bloodworks, Bloodworks: SetStage 20 (when: Pit Fighter stage == 19; the speaker is Huki Seven-Swords). Source: TIF__05200A51.Fragment_0 on INFO WindhelmSSE.esp:200A51 (WindhelmSSE.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: WindhelmSSE.esp:3EC170 DNAM (WindhelmSSE.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Fight!", shown at stage 30. Source: WindhelmSSE.esp:3EC170 QOBJ 30. **files**
- **unread**: nothing outside its own stage fragments sets stage 30 or one before it.

**Who and where**

- First objective: "Head down to the Pit". Source: WindhelmSSE.esp:3EC170 QOBJ 20. **files**
- Target alias GoHere (forced): a marker (forced reference, placed in The Pit). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Pit: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Graystone (`0WHQuestBuyHouse`, WindhelmSSE.esp:2C495C, CWE Taluri fix.esp)

**Started by**

- Dialogue with Revyn Sadri, placed in Sadri's Used Wares, "I'd like to buy Graystone Hall (1000 gold)": SetStage 20 (when: the player has at least 1000 gold; Graystone stage == 10; the speaker is Revyn Sadri). Source: TIF__052C495F.Fragment_0 on INFO WindhelmSSE.esp:2C495F (WindhelmSSE.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: WindhelmSSE.esp:2C495C DNAM (CWE Taluri fix.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Inspect your new property.". Source: WindhelmSSE.esp:2C495C QOBJ 20. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 3. A Simple Delivery (`0WHQuestDeliveryToBro`, WindhelmSSE.esp:320702, WindhelmSSE.esp)

**Started by**

- Dialogue with Wilhelm, placed in Wilhelm's Winter Warehouse, Wilhelm's Winter Wares: SetStage 10 (when: the speaker is Wilhelm). Source: TIF__0532070B.Fragment_0 on INFO WindhelmSSE.esp:32070B (WindhelmSSE.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: WindhelmSSE.esp:320702 DNAM (WindhelmSSE.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "I should tell Wilhelm I've finished the delivery.", shown at stage 15. Source: WindhelmSSE.esp:320702 QOBJ 15. **files**
- Dialogue with Higil Hammer-Shield, placed in Clan Hammer-Shield, Home of Clan Hammer-Shield, "Got a delivery for you.": SetStage 15 (when: A Simple Delivery stage == 10; fn67 == 1; the speaker is Higil Hammer-Shield). Reply: "Thank you. Here, this is for you." Source: TIF__0532070E.Fragment_0 on INFO WindhelmSSE.esp:32070E (WindhelmSSE.esp). **script**

**Who and where**

- First objective: "Deliver the purchase agreement to Higil's home.". Source: WindhelmSSE.esp:320702 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: Elk Pelt (stage 30, QF_0WHQuestDeliveryToBro_05320702.fragment_5).

## 4. Kyne's Trial (`0WHQuestFurs`, WindhelmSSE.esp:29178E, WindhelmSSE.esp)

**Started by**

- Dialogue with Frida the Younger, placed in Cult of Tsun, "Then I'll meet you at the stables, once I've prepared.": SetStage 10 (when: the speaker is Frida the Younger). Source: TIF__05296C70.Fragment_0 on INFO WindhelmSSE.esp:296C70 (WindhelmSSE.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: WindhelmSSE.esp:29178E DNAM (WindhelmSSE.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find and slay the great bear", shown at stage 20. Source: WindhelmSSE.esp:29178E QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Take a carriage from the Windhelm Stables to the hills". Source: WindhelmSSE.esp:29178E QOBJ 10. **files**
- Target alias Car (forced): Cart Seat (forced reference, placed in Windhelm). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Windhelm: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 5. Hunting Trip (`0WHQuestFursRepeating`, WindhelmSSE.esp:25E704, WindhelmSSE.esp)

**Started by**

- Dialogue with Frida the Younger, placed in Cult of Tsun: SetStage 31 (when: the speaker is Frida the Younger). Source: TIF__0525E70E.Fragment_0 on INFO WindhelmSSE.esp:25E70E (WindhelmSSE.esp). **script**
- Dialogue with Frida the Younger, placed in Cult of Tsun, "If you need any more hunting work done, I'm up for it.": SetStage 10 (when: GetQuestRunning Kyne's Trial == 0; GetQuestRunning Hunting Trip == 0; the speaker is Frida the Younger). Source: TIF__052C49A6.Fragment_0 on INFO WindhelmSSE.esp:2C49A6 (WindhelmSSE.esp). **script**
- (First objective shown at stage 31; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Bring three Sabre Cat Pelts to Frida in Windhelm", shown at stage 32. Source: WindhelmSSE.esp:25E704 QOBJ 32. **files**
- Dialogue with Frida the Younger, placed in Cult of Tsun: SetStage 32 (when: the speaker is Frida the Younger). Reply: "We've got some traders coming in, and are short on Snow Sabre Cat pelts." Source: TIF__0525E70C.Fragment_0 on INFO WindhelmSSE.esp:25E70C (WindhelmSSE.esp). **script**

**Who and where**

- First objective: "Bring six Wolf pelts to Frida in Windhelm". Source: WindhelmSSE.esp:25E704 QOBJ 31. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 6. The Mead Must Flow (`0WHQuestMead`, WindhelmSSE.esp:24F30A, WindhelmSSE.esp)

**Started by**

- Dialogue with Manheim, placed in Battle-Brew Meadery, "I could bring some mead with me to deliver. I tend to travel a lot anyway.": SetStage 10 (when: The Mead Must Flow stage < 10; the speaker is Manheim). Source: TIF__0524F334.Fragment_0 on INFO WindhelmSSE.esp:24F334 (WindhelmSSE.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: WindhelmSSE.esp:24F30A DNAM (WindhelmSSE.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver some mead to the Frozen Hearth in Winterhold.". Source: WindhelmSSE.esp:24F30A QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: LootBanditGold (levelled: an item) (stage 200, QF__0524F30A.fragment_1).

## 7. The Mead Must Flow (`0WHQuestMeadRepeating`, WindhelmSSE.esp:24F338, WindhelmSSE.esp)

**Started by**

- Dialogue with Manheim, placed in Battle-Brew Meadery: SetStage 10 (when: The Mead Must Flow stage < 10; the speaker is Manheim). Source: TIF__0524F33E.Fragment_0 on INFO WindhelmSSE.esp:24F33E (WindhelmSSE.esp). **script**
- Dialogue with Manheim, placed in Battle-Brew Meadery, "How's business?": SetStage 0 (when: GetQuestRunning The Mead Must Flow == 0; the speaker is Manheim). Source: TIF__052595D0.Fragment_0 on INFO WindhelmSSE.esp:2595D0 (WindhelmSSE.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: WindhelmSSE.esp:24F338 DNAM (WindhelmSSE.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Deliver some Battle-Brew reserve to the Frozen Hearth in Winterhold", shown at stage 20. Source: WindhelmSSE.esp:24F338 QOBJ 20. **files**
- Dialogue with Manheim, placed in Battle-Brew Meadery: SetStage 20 (when: The Mead Must Flow stage < 10; the speaker is Manheim). Reply: "I need you to take a case of mead to the Frozen Hearth in Winterhold. The delivery fee is yours to keep." Source: TIF__0524F33F.Fragment_0 on INFO WindhelmSSE.esp:24F33F (WindhelmSSE.esp). **script**

**Who and where**

- First objective: "Deliver some Battle-Brew reserve to the Bannered Mare in Whiterun". Source: WindhelmSSE.esp:24F338 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 8. Collecting the Edda - Windhelm (`0WHQuestPoetry`, WindhelmSSE.esp:1F355A, WindhelmSSE.esp)

**Started by**

- Dialogue with Higil Hammer-Shield, placed in Clan Hammer-Shield, Home of Clan Hammer-Shield: SetStage 20 (when: fn606 == CWSons (now 2); the speaker is Higil Hammer-Shield). Source: TIF__051F86F8.Fragment_0 on INFO WindhelmSSE.esp:1F86F8 (WindhelmSSE.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: WindhelmSSE.esp:1F355A DNAM (WindhelmSSE.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Get Jorn Scarred-Skald's verse", shown at stage 30. Source: WindhelmSSE.esp:1F355A QOBJ 30. **files**
- Dialogue with Thane Alarik, placed in House of Thane Alarik, Home of Thane Alarik, "Higil asked me to collect verses for the edda. I was told you have one?": SetStage 30 (when: the speaker is Thane Alarik or the speaker is Thane-Legate Torbis; Collecting the Edda - Windhelm stage == 20). Reply: "I've got it right here. Just don't read it, it's not very good." Source: TIF__0525E70F.Fragment_0 on INFO WindhelmSSE.esp:25E70F (WindhelmSSE.esp). **script**
- Dialogue with Higil Hammer-Shield, placed in Clan Hammer-Shield, Home of Clan Hammer-Shield: SetStage 30 (when: the speaker is Higil Hammer-Shield; fn606 == CWImperial (now 1)). Reply: "It's all in this note." Source: TIF__063FB528.Fragment_0 on INFO WindhelmSSE.esp:3FB528 (WindhelmSSE.esp). **script**

**Who and where**

- First objective: "Get Thane Alarik's verse". Source: WindhelmSSE.esp:1F355A QOBJ 20. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 100 gold (stage 200, QF_0WHQuestPoetry_051F355A.fragment_27); The Song of Return: Skyrim, a Preamble (stage 200, QF_0WHQuestPoetry_051F355A.fragment_27).

## 9. Unusual Imports (`0WHQuestRieklings`, WindhelmSSE.esp:1066C3, WindhelmSSE.esp)

**Started by**

- Dialogue with Signy, placed in Windhelm, "I can deal with them.": SetStage 20 (when: Unusual Imports stage < 20; the speaker is Signy). Source: TIF__05134299.Fragment_0 on INFO WindhelmSSE.esp:134299 (WindhelmSSE.esp). **script**
- Dialogue with Signy, placed in Windhelm, "I can deal with them, but not for free.": SetStage 20 (when: Unusual Imports stage < 20; the speaker is Signy). Source: TIF__05134298.Fragment_0 on INFO WindhelmSSE.esp:134298 (WindhelmSSE.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: WindhelmSSE.esp:1066C3 DNAM (WindhelmSSE.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Search the warehouse for rieklings then speak to Signy - after you feel that your work is done.", shown at stage 25. Source: WindhelmSSE.esp:1066C3 QOBJ 25. **files**
- **unread**: nothing outside its own stage fragments sets stage 25 or one before it.

**Who and where**

- First objective: "Enter the warehouse - Kill the stowaways". Source: WindhelmSSE.esp:1066C3 QOBJ 20. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 100 gold (stage 40, QF_0WHRieklingQuest_051066C3.fragment_3); Snow Bear Pelt (stage 40, QF_0WHRieklingQuest_051066C3.fragment_3).

## 10. The Talos Mistake (`0WHQuestTalosIntro`, WindhelmSSE.esp:1EE2E4, WindhelmSSE.esp)

**Started by**

- Dialogue with Beorn, placed in Old Temple of Talos, Mustering Hall, "What is this place?": SetStage 10 (when: The Talos Mistake stage < 10; fn67 == 1; the speaker is Beorn). Source: TIF__051EE2E7.Fragment_0 on INFO WindhelmSSE.esp:1EE2E7 (WindhelmSSE.esp). **script**
- Dialogue with Beorn, placed in Old Temple of Talos, Mustering Hall, "Where is he? Around here somewhere?": SetStage 30 (when: the speaker is Beorn). Source: TIF__051EE2F6.Fragment_0 on INFO WindhelmSSE.esp:1EE2F6 (WindhelmSSE.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: WindhelmSSE.esp:1EE2E4 DNAM (WindhelmSSE.esp). **files**
- (First objective shown at stage 30; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill the Thalmor agent hiding in the Gray Quarter", shown at stage 40. Source: WindhelmSSE.esp:1EE2E4 QOBJ 40. **files**
- Dialogue with Hverung, placed in Old Temple of Talos, Mustering Hall, "I'll be back. ": SetStage 40 (when: the speaker is Hverung). Reply: "Stay sharp out there." Source: TIF__052F288C.Fragment_0 on INFO WindhelmSSE.esp:2F288C (WindhelmSSE.esp). **script**

**Who and where**

- First objective: "Speak to the man called Hverung". Source: WindhelmSSE.esp:1EE2E4 QOBJ 30. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: Amulet of Talos (stage 70, QF_0WHQuestTalosIntro_051EE2E4.fragment_12).

## 11. Severed Cold (`0WHQuestVampires`, WindhelmSSE.esp:1066C4, WindhelmSSE.esp)

**Started by**

- Start-game flag: the quest runs from the start of the game. Source: WindhelmSSE.esp:1066C4 DNAM (WindhelmSSE.esp). **files**
- (First objective shown at stage 70; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "(optional) Slay the Volkhair Brute", shown at stage 110. Source: WindhelmSSE.esp:1066C4 QOBJ 110. **files**
- Dialogue with Windhelm Guard (named by the line before it (WindhelmSSE.esp:2C9AF7), GetIsID), placed in Frozen Caverns, "Huh? Where'd you come from?": SetStage 110 (when: Severed Cold stage == 100). Reply: "I saw y... What!?" Source: TIF__052C9AFB.Fragment_1 on INFO WindhelmSSE.esp:2C9AFB (WindhelmSSE.esp). **script**
- Dialogue with Windhelm Guard, placed in Frozen Caverns, "Guards? Could've used your help a bit earlier.": SetStage 110 (when: the speaker is Windhelm Guard). Reply: "I saw y... What!?" Source: TIF__052C9AFA.Fragment_1 on INFO WindhelmSSE.esp:2C9AFA (WindhelmSSE.esp). **script**

**Who and where**

- First objective: "Explore the frozen caverns". Source: WindhelmSSE.esp:1066C4 QOBJ 70. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: LItemEnchJewelryAll (levelled: an item) (stage 140, QF_0WHVampQuest_051066C4.fragment_15); 200 gold (stage 140, QF_0WHVampQuest_051066C4.fragment_15).

## 12. Death Do Us Part (`0WindhelmSceneDunmerCouple`, WindhelmSSE.esp:2CEC4D, WindhelmSSE.esp)

**Started by**

- Start-game flag: the quest runs from the start of the game. Source: WindhelmSSE.esp:2CEC4D DNAM (WindhelmSSE.esp). **files**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Who and where**

- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 13. A Night You Can't Remember (`0WindhelmSceneGuardVampireAftermath`, WindhelmSSE.esp:2DDFF3, WindhelmSSE.esp)

**Started by**

- Dialogue with Windhelm Guard, placed in Candlehearth Hall, "I won't say no to that.": SetStage 20 (when: A Night You Can't Remember stage < 20; the speaker is Windhelm Guard). Source: TIF__05367FA5.Fragment_0 on INFO WindhelmSSE.esp:367FA5 (WindhelmSSE.esp). **script**
- Dialogue with Windhelm Guard, placed in Candlehearth Hall, "Sorry, don't have time for that.": SetStage 21 (when: A Night You Can't Remember stage < 20; the speaker is Windhelm Guard). Source: TIF__05367FA3.Fragment_0 on INFO WindhelmSSE.esp:367FA3 (WindhelmSSE.esp). **script**
- Dialogue with Windhelm Guard, placed in Candlehearth Hall, "What ungodly brew is this... Another!": SetStage 30 (when: the speaker is Windhelm Guard). Source: TIF__05367FA9.Fragment_0 on INFO WindhelmSSE.esp:367FA9 (WindhelmSSE.esp). **script**
- Dialogue with Windhelm Guard, placed in Candlehearth Hall, "Thanks. I'll be leaving now. Stay safe.": SetStage 21 (when: A Night You Can't Remember stage < 20; the speaker is Windhelm Guard). Source: TIF__05367FA8.Fragment_0 on INFO WindhelmSSE.esp:367FA8 (WindhelmSSE.esp). **script**
- Dialogue with Windhelm Guard, placed in Candlehearth Hall, "Another!": SetStage 40 (when: the speaker is Windhelm Guard). Source: TIF__05367FAB.Fragment_0 on INFO WindhelmSSE.esp:367FAB (WindhelmSSE.esp). **script**
- Dialogue with Windhelm Guard, placed in Candlehearth Hall, "Keep 'em coming!": SetStage 50 (when: the speaker is Windhelm Guard). Source: TIF__05367FAD.Fragment_0 on INFO WindhelmSSE.esp:367FAD (WindhelmSSE.esp). **script**
- Dialogue with Windhelm Guard, placed in Candlehearth Hall, "Bottomsch up!": SetStage 60 (when: the speaker is Windhelm Guard). Source: TIF__05367FB1.Fragment_0 on INFO WindhelmSSE.esp:367FB1 (WindhelmSSE.esp). **script**
- Dialogue with Windhelm Guard, placed in Candlehearth Hall, "Nexscht round!": SetStage 80 (when: fn131 == 1; the speaker is Windhelm Guard). Source: TIF__05367FB3.Fragment_0 on INFO WindhelmSSE.esp:367FB3 (WindhelmSSE.esp). **script**
- and 3 more in the JSON
- (First objective shown at stage 100; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Get some fresh air". Source: WindhelmSSE.esp:2DDFF3 QOBJ 100. **files**
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

### dialogue INFO WindhelmSSE.esp:18B3A1

- Speaker: Huki Seven-Swords (Nord), placed in The Pit Bloodworks, Bloodworks. Named by: GetIsID.
- The player's prompt: "I want to fight in an unranked match.".
- The reply: "Great! Luckily there's no shortage of pit bait around here." / "Some new blood should be enough to rouse these layabouts to actually fight again." / "Okay, let's see what you can do. Head to the pit when you're ready.".
- When it's offered: Pit Fighter stage < 19; the speaker is Huki Seven-Swords.
- What it does: SetStage 20 on 0WHQuestArenaFightRepeating (Pit Fighter). Source: TIF__0518B3A1.Fragment_0 on INFO WindhelmSSE.esp:18B3A1 (WindhelmSSE.esp); topic 0WHQuestArenaFightRepeatingStartTopic. **script**
- In one sentence: Talk to Huki Seven-Swords (Nord) in The Pit Bloodworks, Bloodworks and choose "I want to fight in an unranked match.", when Pit Fighter stage < 19; the speaker is Huki Seven-Swords: SetStage 20 on 0WHQuestArenaFightRepeating (Pit Fighter).

### dialogue INFO WindhelmSSE.esp:200A45

- Speaker: Huki Seven-Swords (Nord), placed in The Pit Bloodworks, Bloodworks. Named by: GetIsID.
- The player's prompt: "I want fight in another unranked match.".
- The reply: "Of course.".
- When it's offered: GetQuestRunning Pit Fighter == 0; the speaker is Huki Seven-Swords.
- What it does: SetStage 19 on 0WHQuestArenaFightRepeating (Pit Fighter). Source: TIF__05200A45.Fragment_2 on INFO WindhelmSSE.esp:200A45 (WindhelmSSE.esp); topic 0WHControllerQuestArenaTopic. **script**
- In one sentence: Talk to Huki Seven-Swords (Nord) in The Pit Bloodworks, Bloodworks and choose "I want fight in another unranked match.", when GetQuestRunning Pit Fighter == 0; the speaker is Huki Seven-Swords: SetStage 19 on 0WHQuestArenaFightRepeating (Pit Fighter).

### dialogue INFO WindhelmSSE.esp:200A51

- Speaker: Huki Seven-Swords (Nord), placed in The Pit Bloodworks, Bloodworks. Named by: GetIsID.
- The player's prompt: "".
- The reply: "All right. Head to the pit when you think you're ready.".
- When it's offered: Pit Fighter stage == 19; the speaker is Huki Seven-Swords.
- What it does: SetStage 20 on 0WHQuestArenaFightRepeating (Pit Fighter). Source: TIF__05200A51.Fragment_0 on INFO WindhelmSSE.esp:200A51 (WindhelmSSE.esp); topic 0WHQuestArenaFightRepeatingStartALTTopic. **script**
- In one sentence: Talk to Huki Seven-Swords (Nord) in The Pit Bloodworks, Bloodworks, when Pit Fighter stage == 19; the speaker is Huki Seven-Swords: SetStage 20 on 0WHQuestArenaFightRepeating (Pit Fighter).

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
