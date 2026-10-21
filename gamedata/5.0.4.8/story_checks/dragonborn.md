# Start check: Dragonborn (`dragonborn`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Dragonborn (`DLC2MQ01`, Dragonborn.esm:017F8E, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC2CultistAmbush, a helper quest calls at stage 10 Start; at stage 10 SetStage 5; DLC2CultistAmbush is started by story manager node DLC2CultistAmbushNode001 (event: change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 1 (now 1); fn359 == 0; The Way of the Voice stage >= 160; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0)); story manager node DLC2CultistAmbushNode002 (event: change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 2 (now 1); fn359 == 0; The Horn of Jurgen Windcaller stage >= 60; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0)); story manager node DLC2CultistAmbushNode003 (event: change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 3 (now 1); fn359 == 0; A Blade in the Dark stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0)); story manager node DLC2CultistAmbushNode004 (event: change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 4 (now 1); fn359 == 0; Alduin's Wall stage >= 280; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0)). Sources: DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 on Dragonborn.esm:03546D. **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC2MQ02 (The Temple of Miraak) at stage 0 calls SetStage 5. Source: DLC2_QF_DLC2MQ02_02017F8F.fragment_10 (Dragonborn.esm).
- DLC2MQ02 (The Temple of Miraak) at stage 0 calls SetStage 200. Source: DLC2_QF_DLC2MQ02_02017F8F.fragment_10 (Dragonborn.esm).
- DLC2MQ02 (The Temple of Miraak) at stage 5 calls SetStage 200. Source: DLC2_QF_DLC2MQ02_02017F8F.fragment_6 (Dragonborn.esm).
- DLC2WE09 (Cultists vs Player) at stage 10 calls Start. Source: DLC2_QF_DLC2WE09_020331C0.fragment_5 (LoreRim - Global Modifiers.esp).
- DLC2WE09 (Cultists vs Player) at stage 10 calls SetStage 5. Source: DLC2_QF_DLC2WE09_020331C0.fragment_5 (LoreRim - Global Modifiers.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Read Cultists' Orders", shown at stage 7. Source: Dragonborn.esm:017F8E QOBJ 7. **files**
- **unread**: nothing outside its own stage fragments sets stage 7 or one before it.

**Who and where**

- First objective: "Find out who sent the Cultists". Source: Dragonborn.esm:017F8E QOBJ 5. **files**
- Target alias SearchCultistAmbushObjective (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 2. The Temple of Miraak (`DLC2MQ02`, Dragonborn.esm:017F8F, Dragonborn.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC2MQ03 (The Fate of the Skaal) at stage 0 calls SetStage 0. Source: DLC2_QF_DLC2MQ03_02017F90.fragment_15 (Unofficial Skyrim Special Edition Patch.esp).
- DLC2MQ03 (The Fate of the Skaal) at stage 0 calls SetStage 60. Source: DLC2_QF_DLC2MQ03_02017F90.fragment_15 (Unofficial Skyrim Special Edition Patch.esp).
- DLC2MQ03 (The Fate of the Skaal) at stage 0 calls SetStage 200. Source: DLC2_QF_DLC2MQ03_02017F90.fragment_15 (Unofficial Skyrim Special Edition Patch.esp).
- DLC2MQ03 (The Fate of the Skaal) calls SetStage 5. Source: DLC2_TIF__0202A578.Fragment_0 (Unofficial Skyrim Special Edition Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Frea", shown at stage 10. Source: Dragonborn.esm:017F8F QOBJ 10. **files**
- DLC2MQ01 (Dragonborn) at stage 200 calls SetStage 10. Source: DLC2_QF_DLC2MQ01_02017F8E.fragment_4 on Dragonborn.esm:017F8E (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Find Frea". Source: Dragonborn.esm:017F8F QOBJ 5. **files**
- Target alias Frea (unique): Frea (unique actor, placed in Shaman's Hut, Skaal Village Shaman's Hut). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Shaman's Hut, Skaal Village Shaman's Hut: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. The Fate of the Skaal (`DLC2MQ03`, Dragonborn.esm:017F90, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC2MQ02 (The Temple of Miraak) at stage 200 calls SetStage 10. Source: DLC2_QF_DLC2MQ02_02017F8F.fragment_20 on Dragonborn.esm:017F8F (Dragonborn.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC2MQ04 (The Path of Knowledge) at stage 0 calls SetStage 0. Source: DLC2_QF_DLC2MQ05_02016E1F.fragment_26 (Dragonborn.esm).
- DLC2MQ04 (The Path of Knowledge) at stage 0 calls SetStage 50. Source: DLC2_QF_DLC2MQ05_02016E1F.fragment_26 (Dragonborn.esm).
- DLC2MQ04 (The Path of Knowledge) at stage 0 calls SetStage 70. Source: DLC2_QF_DLC2MQ05_02016E1F.fragment_26 (Dragonborn.esm).
- DLC2MQ04 (The Path of Knowledge) at stage 0 calls SetStage 200. Source: DLC2_QF_DLC2MQ05_02016E1F.fragment_26 (Dragonborn.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Storn Crag-Strider", shown at stage 20. Source: Dragonborn.esm:017F90 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Accompany Frea to Skaal Village". Source: Dragonborn.esm:017F90 QOBJ 10. **files**
- Target alias Frea (unique): Frea (unique actor, placed in Shaman's Hut, Skaal Village Shaman's Hut). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Shaman's Hut, Skaal Village Shaman's Hut: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 4. Cleansing the Stones (`DLC2MQ03B`, Dragonborn.esm:035440, Dragonborn.esm)

**Started by**

- Dialogue with Storn Crag-Strider (named by alias Storn of DLC2MQ03 (The Fate of the Skaal) (unique)), placed in Shaman's Hut, Skaal Village Shaman's Hut, "What do we do now?": SetStage 5 (when: the speaker is the one in alias Storn). Source: DLC2_TIF__020362C4.Fragment_0 on INFO Dragonborn.esm:0362C4 (Dragonborn.esm). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC2MQ04 (The Path of Knowledge) at stage 10 calls SetStage 5. Source: DLC2_QF_DLC2MQ05_02016E1F.fragment_0 (Dragonborn.esm).
- DLC2MQ06 (At the Summit of Apocrypha) at stage 0 calls SetStage 200. Source: DLC2_QF_DLC2MQ07_020179D7.fragment_5 (Unofficial Skyrim Special Edition Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Cleanse the Earth Stone", shown at stage 5. Source: Dragonborn.esm:035440 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 5 or one before it.

**Who and where**

- First objective: "Cleanse the Water Stone". Source: Dragonborn.esm:035440 QOBJ 10. **files**
- Target alias WaterStoneAlias (forced): a marker (forced reference, placed in Water Stone). **files**
- Target alias LurkerWater (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 5. The Path of Knowledge (`DLC2MQ04`, Dragonborn.esm:016E1F, Dragonborn.esm)

**Started by**

- DLC2MQ03 (The Fate of the Skaal) at stage 200 calls SetStage 10. Source: DLC2_QF_DLC2MQ03_02017F90.fragment_0 on Dragonborn.esm:017F90 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC2MQ05 (The Gardener of Men) at stage 0 calls SetStage 0. Source: DLC2_QF_DLC2MQ04_020179DE.fragment_13 (Dragonborn.esm).
- DLC2MQ05 (The Gardener of Men) at stage 0 calls SetStage 50. Source: DLC2_QF_DLC2MQ04_020179DE.fragment_13 (Dragonborn.esm).
- DLC2MQ05 (The Gardener of Men) at stage 0 calls SetStage 100. Source: DLC2_QF_DLC2MQ04_020179DE.fragment_13 (Dragonborn.esm).
- DLC2MQ05 (The Gardener of Men) at stage 0 calls SetStage 120. Source: DLC2_QF_DLC2MQ04_020179DE.fragment_13 (Dragonborn.esm).
- DLC2MQ05 (The Gardener of Men) at stage 0 calls SetStage 150. Source: DLC2_QF_DLC2MQ04_020179DE.fragment_13 (Dragonborn.esm).
- DLC2MQ05 (The Gardener of Men) at stage 0 calls SetStage 210. Source: DLC2_QF_DLC2MQ04_020179DE.fragment_13 (Dragonborn.esm).
- and 3 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Travel to Nchardak with Neloth", shown at stage 50. Source: Dragonborn.esm:016E1F QOBJ 20. **files**
- DLC2MQ05 (The Gardener of Men) at stage 0 calls SetStage 50. Source: DLC2_QF_DLC2MQ04_020179DE.fragment_13 on Dragonborn.esm:0179DE (Dragonborn.esm). **script**
- Dialogue with Neloth, placed in Tel Mithryn, Tel Mithryn Tower, "I found a Black Book. I need to find more.": SetStage 20 (when: the speaker is Neloth). Reply: "Found one? Yes... and you read it, too, didn't you? Don't try to deny it. You've got the look. I can see it now." Source: DLC2_TIF__02019AC7.Fragment_0 on INFO Dragonborn.esm:019AC7 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Neloth, placed in Tel Mithryn, Tel Mithryn Tower: SetStage 50 (when: the speaker is Neloth). Reply: "It seems the ancient Dwemer discovered this book and took it to study." Source: DLC2_TIF__0202506E.Fragment_0 on INFO Dragonborn.esm:02506E (Dragonborn.esm). **script**

**Who and where**

- First objective: "Talk to Neloth". Source: Dragonborn.esm:016E1F QOBJ 10. **files**
- Target alias Neloth (unique): Neloth (unique actor, placed in Tel Mithryn, Tel Mithryn Tower). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Tel Mithryn, Tel Mithryn Tower: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 6. The Gardener of Men (`DLC2MQ05`, Dragonborn.esm:0179DE, Dragonborn.esm)

**Started by**

- DLC2MQ04 (The Path of Knowledge) at stage 550 calls SetStage 10. Source: DLC2_QF_DLC2MQ05_02016E1F.fragment_40 on Dragonborn.esm:016E1F (Dragonborn.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC2MQ06 (At the Summit of Apocrypha) at stage 0 calls SetStage 0. Source: DLC2_QF_DLC2MQ07_020179D7.fragment_5 (Unofficial Skyrim Special Edition Patch.esp).
- DLC2MQ06 (At the Summit of Apocrypha) at stage 0 calls SetStage 150. Source: DLC2_QF_DLC2MQ07_020179D7.fragment_5 (Unofficial Skyrim Special Edition Patch.esp).
- DLC2MQ06 (At the Summit of Apocrypha) at stage 0 calls SetStage 700. Source: DLC2_QF_DLC2MQ07_020179D7.fragment_5 (Unofficial Skyrim Special Edition Patch.esp).
- DLC2MQ06 (At the Summit of Apocrypha) at stage 0 calls SetStage 750. Source: DLC2_QF_DLC2MQ07_020179D7.fragment_5 (Unofficial Skyrim Special Edition Patch.esp).
- DLC2MQ06 (At the Summit of Apocrypha) at stage 0 calls SetStage 1000. Source: DLC2_QF_DLC2MQ07_020179D7.fragment_5 (Unofficial Skyrim Special Edition Patch.esp).
- DLC2MQ06 (At the Summit of Apocrypha) at stage 550 calls SetStage 1100. Source: DLC2_QF_DLC2MQ07_020179D7.fragment_4 (Unofficial Skyrim Special Edition Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Learn the hidden knowledge of "Epistolary Acumen"", shown at stage 100. Source: Dragonborn.esm:0179DE QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 100 or one before it.

**Who and where**

- First objective: "Read the Black Book". Source: Dragonborn.esm:0179DE QOBJ 10. **files**
- Target alias Book2Tamriel (forced): Black Book: Epistolary Acumen (forced reference, placed in Nchardak Reading Room, Nchardak). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Nchardak Reading Room, Nchardak: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 7. At the Summit of Apocrypha (`DLC2MQ06`, Dragonborn.esm:0179D7, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC2MQ05 (The Gardener of Men) at stage 1000 calls SetStage 10. Source: DLC2_QF_DLC2MQ04_020179DE.fragment_27 on Dragonborn.esm:0179DE (Dragonborn.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Read "Waking Dreams"", shown at stage 100. Source: Dragonborn.esm:0179D7 QOBJ 20. **files**
- DLC2MQ06 (At the Summit of Apocrypha) calls SetStage 100. Source: dlc2mq06script.OnUpdate on Dragonborn.esm:0179D7 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Unlock your "Bend Will" Shout". Source: Dragonborn.esm:0179D7 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 8. Cultists vs Player (`DLC2WE09`, Dragonborn.esm:0331C0, LoreRim - Global Modifiers.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Actor1 of DLC2WE09 (Cultists vs Player) (created)), "...": SetStage 10 (when: the speaker is the one in alias Actor1 or the speaker is the one in alias Actor2 or the speaker is the one in alias Actor3). Source: DLC2_TIF__0203545E.Fragment_0 on INFO Dragonborn.esm:03545E (Dragonborn.esm). **script**
- Dialogue with someone the line does not name (named by alias Actor1 of DLC2WE09 (Cultists vs Player) (created)), "(Walk away)": SetStage 10 (when: the speaker is the one in alias Actor1 or the speaker is the one in alias Actor2 or the speaker is the one in alias Actor3). Source: DLC2_TIF__0203545F.Fragment_0 on INFO Dragonborn.esm:03545F (Dragonborn.esm). **script**
- Dialogue with someone the line does not name (named by alias Actor1 of DLC2WE09 (Cultists vs Player) (created)), "Hello.": SetStage 1 (when: the speaker is the one in alias Actor1 or the speaker is the one in alias Actor2 or the speaker is the one in alias Actor3). Source: DLC2_TIF__0203546C.Fragment_0 on INFO Dragonborn.esm:03546C (Dragonborn.esm). **script**
- Dialogue with someone the line does not name (named by alias Actor1 of DLC2WE09 (Cultists vs Player) (created)), "Hello.": SetStage 1 (when: the speaker is the one in alias Actor1 or the speaker is the one in alias Actor2 or the speaker is the one in alias Actor3). Source: DLC2_TIF__0203546C.Fragment_1 on INFO Dragonborn.esm:03546C (Dragonborn.esm). **script**
- Story manager node DLC2WEPriorityQuests001, event: script event; conditions up its parents: global DLC2QuestStartSelection_KRY == 1 (now 1); The Way of the Voice stage >= 160; global WEEnabled == 1 (now 1); GetEventData WEStart == 1 or GetEventData WERoadStart == 1 or GetEventData DLC2WEStart == 1 or GetEventData DLC2WERoadStart == 1. Source: DLC2WEPriorityQuests001 Dragonborn.esm:0331C1 (LoreRim - Global Modifiers.esp). **run time**
- Story manager node DLC2WEPriorityQuests002, event: script event; conditions up its parents: global DLC2QuestStartSelection_KRY == 2 (now 1); The Horn of Jurgen Windcaller stage >= 60; global WEEnabled == 1 (now 1); GetEventData WEStart == 1 or GetEventData WERoadStart == 1 or GetEventData DLC2WEStart == 1 or GetEventData DLC2WERoadStart == 1. Source: DLC2WEPriorityQuests002 TimingIsEverything.esp:02CB51 (TimingIsEverything.esp). **run time**
- Story manager node DLC2WEPriorityQuests000, event: script event; conditions up its parents: global DLC2QuestStartSelection_KRY == 0 (now 1); Dragon Rising stage >= 90; global WEEnabled == 1 (now 1); GetEventData WEStart == 1 or GetEventData WERoadStart == 1 or GetEventData DLC2WEStart == 1 or GetEventData DLC2WERoadStart == 1. Source: DLC2WEPriorityQuests000 TimingIsEverything.esp:02CB52 (TimingIsEverything.esp). **run time**
- Story manager node DLC2WEPriorityQuests003, event: script event; conditions up its parents: global DLC2QuestStartSelection_KRY == 3 (now 1); A Blade in the Dark stage >= 200; global WEEnabled == 1 (now 1); GetEventData WEStart == 1 or GetEventData WERoadStart == 1 or GetEventData DLC2WEStart == 1 or GetEventData DLC2WERoadStart == 1. Source: DLC2WEPriorityQuests003 TimingIsEverything.esp:02CB53 (TimingIsEverything.esp). **run time**
- Story manager node DLC2WEPriorityQuests004, event: script event; conditions up its parents: global DLC2QuestStartSelection_KRY == 4 (now 1); Alduin's Wall stage >= 280; global WEEnabled == 1 (now 1); GetEventData WEStart == 1 or GetEventData WERoadStart == 1 or GetEventData DLC2WEStart == 1 or GetEventData DLC2WERoadStart == 1. Source: DLC2WEPriorityQuests004 TimingIsEverything.esp:02CB54 (TimingIsEverything.esp). **run time**
- and 4 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Search the <Alias=Actor1>". Source: Dragonborn.esm:0331C0 QOBJ 10. **files**
- Target alias Actor1 (created): Dragonborn.esm:0365F6 (created item). **files**

**Needs**

- Its own conditions: the speaker has the voice Dragonborn.esm:034E61; GetRandomPercent < DLC2WE09Chance (now 0); At the Summit of Apocrypha stage < 550; level >= DLC2CultistAttackMinLevel_KRY (now 25). **files**
- Global DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp); at run time script DLC2_QF_DLC2WE09_020331C0:  = 5; script DLC2_QF_DLC2CultistAmbush_0203546D:  = 5; script EE_MCMScript:  = None. **run time**
- Global WEEnabled: record 1.0 (Skyrim.esm); at run time script QF_E3demo_00093637:  = 0; script CarriageSystemScript:  = None; script CarriageSystemScript:  = None. **run time**
- Global DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp). **conflict**
- Global DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp). **files**

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | The reader found no way into Dragonborn from it. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | The reader found no way into Dragonborn from it. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | The reader found no way into Dragonborn from it. |

## Routes into the first quest from outside the starts

### DLC2CultistAmbush

- What it does: stage 10: Start. Source: DLC2_QF_DLC2CultistAmbush_0203546D on Dragonborn.esm:03546D (Dragonborn.esm). **script**
- Started by: story manager node DLC2CultistAmbushNode001 (change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 1 (now 1); fn359 == 0; The Way of the Voice stage >= 160; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0); DLC2CultistAmbushNode001 Dragonborn.esm:035472 (LoreRim - Global Modifiers.esp)); story manager node DLC2CultistAmbushNode002 (change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 2 (now 1); fn359 == 0; The Horn of Jurgen Windcaller stage >= 60; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0); DLC2CultistAmbushNode002 TimingIsEverything.esp:00E53C (TimingIsEverything.esp)); story manager node DLC2CultistAmbushNode003 (change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 3 (now 1); fn359 == 0; A Blade in the Dark stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0); DLC2CultistAmbushNode003 TimingIsEverything.esp:00E53D (TimingIsEverything.esp)); story manager node DLC2CultistAmbushNode004 (change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 4 (now 1); fn359 == 0; Alduin's Wall stage >= 280; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0); DLC2CultistAmbushNode004 TimingIsEverything.esp:00E53E (TimingIsEverything.esp)).
- In one sentence: DLC2CultistAmbush stage 10: Start on DLC2MQ01 (Dragonborn); it is started by story manager node DLC2CultistAmbushNode001 (change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 1 (now 1); fn359 == 0; The Way of the Voice stage >= 160; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0); DLC2CultistAmbushNode001 Dragonborn.esm:035472 (LoreRim - Global Modifiers.esp)); story manager node DLC2CultistAmbushNode002 (change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 2 (now 1); fn359 == 0; The Horn of Jurgen Windcaller stage >= 60; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0); DLC2CultistAmbushNode002 TimingIsEverything.esp:00E53C (TimingIsEverything.esp)); story manager node DLC2CultistAmbushNode003 (change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 3 (now 1); fn359 == 0; A Blade in the Dark stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0); DLC2CultistAmbushNode003 TimingIsEverything.esp:00E53D (TimingIsEverything.esp)); story manager node DLC2CultistAmbushNode004 (change location; level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 4 (now 1); fn359 == 0; Alduin's Wall stage >= 280; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0); DLC2CultistAmbushNode004 TimingIsEverything.esp:00E53E (TimingIsEverything.esp)).

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
