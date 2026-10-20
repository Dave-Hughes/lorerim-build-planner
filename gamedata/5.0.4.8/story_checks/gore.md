# Start check: Gore (`gore`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. A New Coat (`HD1ArmorUpgrades`, GORE.esp:10A083, GORE.esp)

**Started by**

- Dialogue with someone the line does not name: Start (when: global HD1DueForUpgrade == 0 (now 0); global HD1ElkEnding == 1 (now 0) or global HD1RavenEnding == 1 (now 0) or global HD1WolfEnding == 1 (now 0)). Source: HD1_TIF__0510A081.Fragment_0 on INFO GORE.esp:10A081 (GORE.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Taarie at Radient Raiment about new armor for Gore", shown at stage 5. Source: GORE.esp:10A083 QOBJ 5. **files**
- Dialogue with Gore (named by the line before it (GORE.esp:10A086), GetIsID), placed in Peak's Shade Tower, "Kind of.": SetStage 5. Reply: "... oh. Alright, well... maybe it's time for a new fresh set of armor? Not sure I even know where to begin. Do you?" Source: HD1_TIF__0510A08A.Fragment_0 on INFO GORE.esp:10A08A (GORE.esp). **script**
- Dialogue with Gore (named by the line before it (GORE.esp:10A086), GetIsID), placed in Peak's Shade Tower, "Not at all!": SetStage 5. Reply: "Liar." Source: HD1_TIF__0510A08B.Fragment_0 on INFO GORE.esp:10A08B (GORE.esp). **script**
- Dialogue with Gore (named by the line before it (GORE.esp:10A086), GetIsID), placed in Peak's Shade Tower, "I'll pay you when you earn it.": SetStage 5. Reply: "You sound just like Pate. " Source: HD1_TIF__0510A08C.Fragment_0 on INFO GORE.esp:10A08C (GORE.esp). **script**

**Who and where**

- First objective: "Speak to Gore about his equipment". Source: GORE.esp:10A083 QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0); global HD1DueForUpgrade == 1 (now 0); global HD1ElkEnding == 1 (now 0) or global HD1RavenEnding == 1 (now 0) or global HD1WolfEnding == 1 (now 0). **files**
- Global HD1ElkEnding: record 0.0 (GORE.esp); at run time script HD1_TIF__059F670F:  = 1. **run time**
- Global HD1RavenEnding: record 0.0 (GORE.esp); at run time script HD1_TIF__059F670E:  = 1. **run time**
- Global HD1WolfEnding: record 0.0 (GORE.esp); at run time script HD1_TIF__056EA624:  = 1; script HD1_TIF__059F6710:  = 1. **run time**
- Global HD1DueForUpgrade: record 0.0 (GORE.esp); at run time script HD1_TIF__0510A081:  = 1. **run time**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 2. Come, the Crows (`HD1GoreComeTheCrows`, GORE.esp:6EA61E, GORE.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- HD1GoreQuest2 (Blood Ties) calls Start. Source: HD1_TIF__036738E8.Fragment_0 (GORE.esp).
- HD1GoreQuest2 (Blood Ties) calls SetStage 0. Source: HD1_TIF__036738E8.Fragment_0 (GORE.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Head to an Inn away from Dawnstar". Source: GORE.esp:6EA61E QOBJ 10. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Speak to Gore". Source: GORE.esp:6EA61E QOBJ 0. **files**
- Target alias Gore (run time): Gore (put there by a script (ForceRefTo), placed in Peak's Shade Tower). **script**

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0); global HD1PostJuneVar == 1 (now 0). **files**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**
- Global HD1PostJuneVar: record 0.0 (GORE.esp); at run time script HD1_TIF__06002BF4:  = 0; script HD1_TIF__036738E8:  = 1; script HD1_TIF__036EA628:  = 0; script HD1_TIF__03B2E634:  = 0. **conflict**

**Gives**: nothing on its completing stages.

## 3. The Drunken Hunted (`HD1GoreDH`, GORE.esp:3E8DC9, GORE.esp)

**Started by**

- Dialogue with Gore, placed in Peak's Shade Tower, "I don't know about you, but I could use a drink.": Start (when: the speaker is Gore; The Drunken Hunted not completed; GetInFaction DismissedFollowerFaction == 0; global HD1Friendship2 == 1 (now 0); fn562 == 0). Source: TIF__063D9AC5.Fragment_0 on INFO GORE.esp:3D9AC5 (GORE.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Let Gore know he can relax". Source: GORE.esp:3E8DC9 QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Head to the Drunken Huntsman in Whiterun". Source: GORE.esp:3E8DC9 QOBJ 10. **files**
- Target alias DrunkenHuntsman (forced): a marker (forced reference, placed in The Drunken Huntsman, Drunken Huntsman). **files**

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0); global HD1Friendship2 == 1 (now 0). **files**
- Ways in: The Drunken Huntsman, Drunken Huntsman: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**
- Global HD1Friendship2: record 0.0 (GORE.esp); at run time script TIF__061ACA24:  = 1; script HD1_TIF__03AEB8BF:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 4. Wanted (`HD1GoreEscort`, GORE.esp:1517F2, GORE.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- HD1GoreMeet (Raven's Flight) at stage 40 calls SetStage 10. Source: QF_HD1GoreMeet_09066720.fragment_12 (GORE.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak with Gore.", shown at stage 20. Source: GORE.esp:1517F2 QOBJ 20. **files**
- HD1GoreEscort (Wanted) calls SetStage 20. Source: defaultaliasondeathscript.onDeath on GORE.esp:1517F2 (GORE.esp). **script**

**Who and where**

- First objective: "Defeat the Thalmor Envoy.". Source: GORE.esp:1517F2 QOBJ 10. **files**
- Target alias HD1GoreThalmor1 (forced): a marker (forced reference, placed in Peak's Shade Tower); GORE.esp:1517F9 (put there by a script (ForceRefTo), placed in Peak's Shade Tower). **script**
- Target alias HD1GoreThalmor2 (forced): a marker (forced reference, placed in Peak's Shade Tower); GORE.esp:1517FC (put there by a script (ForceRefTo), placed in Peak's Shade Tower). **script**
- Target alias HD1GoreThalmor3 (forced): a marker (forced reference, placed in Peak's Shade Tower); GORE.esp:1517FC (put there by a script (ForceRefTo), placed in Peak's Shade Tower). **script**

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0); Raven's Flight stage 30 done; the speaker is Gore. **files**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 5. Fear and Loathing (`HD1GoreFearAndLoathing`, GORE.esp:AFF592, GORE.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak with Gore outside". Source: GORE.esp:AFF592 QOBJ 5. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Investigate the house with Gore". Source: GORE.esp:AFF592 QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0); the speaker is Gore. **files**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 6. Count Fleet (`HD1GoreHorse1`, GORE.esp:2EADD8, GORE.esp)

**Started by**

- Dialogue with someone the line does not name, "Perhaps I can get you one?": Start (when: Count Fleet not completed). Source: TIF__082EADD2.Fragment_3 on INFO GORE.esp:2EADD2 (GORE.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell Gore he has a horse now.". Source: GORE.esp:2EADD8 QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "See about getting Gore a horse at the Whiterun Stables.". Source: GORE.esp:2EADD8 QOBJ 10. **files**
- Target alias Skulvar (forced): Skulvar Sable-Hilt (forced reference, placed in Whiterun Stables). **files**

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0); Wanted completed. **files**
- Ways in: Whiterun Stables: 1 door, 0 locked. A door is a need only when every way in is locked. **files**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 7. Where We Stand (`HD1GoreInterlude`, GORE.esp:7752FD, GORE.esp)

**Started by**

- Dialogue with Gore, placed in Peak's Shade Tower: Start (when: the speaker is Gore; To Free a Raven completed; global HD1Romance == 2 (now 0); Where We Stand not completed). Source: HD1_TIF__037752FE.Fragment_0 on INFO GORE.esp:7752FE (GORE.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Head to the spot near Ivarstead.". Source: GORE.esp:7752FD QOBJ 10. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "See what Gore wants to say.". Source: GORE.esp:7752FD QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0); the speaker is Gore. **files**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 8. To Free a Raven (`HD1GoreJailtime`, GORE.esp:6245B4, GORE.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- HD1GoreQuest2 (Blood Ties) calls Start. Source: HD1_TIF__0361307A.Fragment_0 (GORE.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "See how Gore is doing.", shown at stage 10. Source: GORE.esp:6245B4 QOBJ 10. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Wait for Gore to turn himself in.". Source: GORE.esp:6245B4 QOBJ 0. **files**
- Target alias Trigger (forced): a marker (forced reference, placed in Dawnstar Jail, Dawnstar Barracks); Skyrim.esm:033F50 (put there by a script (ForceRefTo), placed in Dawnstar Jail, Dawnstar Barracks). **script**

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0). **files**
- Ways in: Dawnstar Jail, Dawnstar Barracks: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 9. Raven's Flight (`HD1GoreMeet`, GORE.esp:066720, GORE.esp)

**Started by**

- Dialogue with Eden, placed in Dead Man's Drink, "Anything interesting going on around here?": Start (when: Raven's Flight not completed; the speaker is Eden). Source: HD1_TIF__034B0CAE.Fragment_0 on INFO GORE.esp:4B0CAE (GORE.esp). **script**
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak with the Nord.", shown at stage 10. Source: GORE.esp:066720 QOBJ 10. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Head to Peak's Shade Tower outside of Falkreath.". Source: GORE.esp:066720 QOBJ 1. **files**
- Target alias Gore (run time): Gore (put there by a script (ForceRefTo), placed in Peak's Shade Tower). **script**

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0). **files**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 10. The Apple from the Tree (`HD1GoreMurderer`, GORE.esp:6738F7, GORE.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- HD1GoreQuest2 (Blood Ties) calls Start. Source: HD1_TIF__036738F3.Fragment_0 (GORE.esp).
- HD1GoreQuest2 (Blood Ties) calls SetStage 0. Source: HD1_TIF__036738F3.Fragment_0 (GORE.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill Gore". Source: GORE.esp:6738F7 QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Speak to Gore". Source: GORE.esp:6738F7 QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0); the speaker is Gore; global HD1GoreMurdererVar == 1 (now 0). **files**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**
- Global HD1GoreMurdererVar: record 0.0 (GORE.esp); at run time script HD1_TIF__06002BF4:  = 0; script HD1_TIF__036738F3:  = 1; script HD1_TIF__03B2E634:  = 0. **conflict**

**Gives**: nothing on its completing stages.

## 11. Blood Ties (`HD1GoreQuest2`, GORE.esp:5A610A, GORE.esp)

**Started by**

- Dialogue with Gore, placed in Peak's Shade Tower, "Let's take a break. We earned it.": Start (when: the speaker is Gore; global HD1Friendship4 == 1 (now 0); global HD1RelaxVar == 0 (now 0); GetInFaction DismissedFollowerFaction == 0; fn562 == 1; fn67 == 0). Source: HD1_TIF__035B9E44.Fragment_0 on INFO GORE.esp:5B9E44 (GORE.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Head to Dawnstar with Gore.", shown at stage 10. Source: GORE.esp:5A610A QOBJ 10. **files**
- Dialogue with someone the line does not name, "You really plan to kill him?": SetStage 10. Reply: "Maybe. Depends on if he's somehow transformed himself into a completely different person from the one I've known for a couple of decades. Probably not, so, probably yes." Source: HD1_TIF__035B76A8.Fragment_1 on INFO GORE.esp:5B76A8 (GORE.esp). **script**
- Dialogue with someone the line does not name, "Looking forward to seeing that..": SetStage 10. Reply: "You are? Lovely. I'll make sure it's nice and pretty for you. Not his head, I can't perform miracles. " Source: HD1_TIF__035B76A9.Fragment_1 on INFO GORE.esp:5B76A9 (GORE.esp). **script**
- Dialogue with someone the line does not name, "I can't let you kill him, Gore.": SetStage 10. Reply: "Try and stop me. " Source: HD1_TIF__035B76AA.Fragment_1 on INFO GORE.esp:5B76AA (GORE.esp). **script**

**Who and where**

- First objective: "Get to know Gore better.". Source: GORE.esp:5A610A QOBJ 0. **files**
- Target alias Gore (run time): Gore (put there by a script (ForceRefTo), placed in Peak's Shade Tower). **script**

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0); global HD1GoreQuest2Var == 1 (now 0). **files**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**
- Global HD1GoreQuest2Var: record 0.0 (GORE.esp); at run time script HD1_TIF__035B9E44:  = 1. **run time**

**Gives**: nothing on its completing stages.

## 12. Nest Left Empty (`HD1Interlude2`, GORE.esp:89E472, GORE.esp)

**Started by**

- Dialogue with someone the line does not name, "Is there anywhere in Skyrim you'd like to see?": Start (when: global HD1PlatInt == 0 (now 0); GetInFaction CurrentFollowerFaction == 1; global HD1RelaxVar == 1 (now 0); To Free a Raven completed or Come, the Crows completed; Nest Left Empty not completed). Source: HD1_TIF__038AAAA9.Fragment_0 on INFO GORE.esp:8AAAA9 (GORE.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Survive the ambush", shown at stage 10. Source: GORE.esp:89E472 QOBJ 10. **files**
- Dialogue with someone the line does not name (named by scene HD1Interlude2AmbushStart, alias Gore of HD1Interlude2 (Nest Left Empty) (run time)): SetStage 10. Reply: "Hey, blood... we're not alone." Source: HD1_TIF__0389E476.Fragment_0 on INFO GORE.esp:89E476 (GORE.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: Nest Left Empty stage == 5). Reply: "We made it! Wait... blood, we're not alone. Draw your weapon." Source: HD1_TIF__038B9843.Fragment_0 on INFO GORE.esp:8B9843 (GORE.esp). **script**

**Who and where**

- First objective: "Head to the spot marked on your map.". Source: GORE.esp:89E472 QOBJ 0. **files**
- Target alias Marker (forced): a marker (forced reference, placed in Darkwater Pass); Skyrim.esm:00003B (put there by a script (ForceRefTo), placed in Darkwater Pass). **script**

**Needs**

- Its own conditions: global HD1PermanentDismiss != 1 (now 0); the speaker is Gore; GetInFaction CurrentFollowerFaction == 1; To Free a Raven completed or Come, the Crows completed. **files**
- Global HD1PermanentDismiss: record 0.0 (GORE.esp); at run time script HD1_TIF__051BB9E0:  = 1; script HD1_TIF__05225F7E:  = 1; script HD1_TIF__05225F7F:  = 1; script HD1_TIF__0390DAF4:  = 1. **run time**

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | The reader found no way into Gore from it. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | The reader found no way into Gore from it. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | The reader found no way into Gore from it. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | The reader found no way into Gore from it. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | The reader found no way into Gore from it. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | The reader found no way into Gore from it. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | The reader found no way into Gore from it. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | The reader found no way into Gore from it. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | The reader found no way into Gore from it. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | The reader found no way into Gore from it. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | The reader found no way into Gore from it. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | The reader found no way into Gore from it. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | The reader found no way into Gore from it. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | The reader found no way into Gore from it. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | The reader found no way into Gore from it. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | The reader found no way into Gore from it. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | The reader found no way into Gore from it. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | The reader found no way into Gore from it. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | The reader found no way into Gore from it. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | The reader found no way into Gore from it. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Gore from it. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | The reader found no way into Gore from it. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | The reader found no way into Gore from it. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Gore from it. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | The reader found no way into Gore from it. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | The reader found no way into Gore from it. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | The reader found no way into Gore from it. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | The reader found no way into Gore from it. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | The reader found no way into Gore from it. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | The reader found no way into Gore from it. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | The reader found no way into Gore from it. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | The reader found no way into Gore from it. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | The reader found no way into Gore from it. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | The reader found no way into Gore from it. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Gore from it. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | The reader found no way into Gore from it. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | The reader found no way into Gore from it. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | The reader found no way into Gore from it. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | The reader found no way into Gore from it. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | The reader found no way into Gore from it. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Gore from it. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | The reader found no way into Gore from it. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | The reader found no way into Gore from it. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | The reader found no way into Gore from it. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | The reader found no way into Gore from it. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | The reader found no way into Gore from it. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | The reader found no way into Gore from it. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Gore from it. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | The reader found no way into Gore from it. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | The reader found no way into Gore from it. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | The reader found no way into Gore from it. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | The reader found no way into Gore from it. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | The reader found no way into Gore from it. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | The reader found no way into Gore from it. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | The reader found no way into Gore from it. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Gore from it. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | The reader found no way into Gore from it. |

## Routes into the first quest from outside the starts

### dialogue INFO GORE.esp:10A081

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "".
- The reply: "Hey there. What's wrong? You're looking at me all funny.".
- When it's offered: global HD1DueForUpgrade == 0 (now 0); global HD1ElkEnding == 1 (now 0) or global HD1RavenEnding == 1 (now 0) or global HD1WolfEnding == 1 (now 0).
- What it does: Start on HD1ArmorUpgrades (A New Coat). Source: HD1_TIF__0510A081.Fragment_0 on INFO GORE.esp:10A081 (GORE.esp); topic HD1GoreHello. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name, when global HD1DueForUpgrade == 0 (now 0); global HD1ElkEnding == 1 (now 0) or global HD1RavenEnding == 1 (now 0) or global HD1WolfEnding == 1 (now 0): Start on HD1ArmorUpgrades (A New Coat).

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
