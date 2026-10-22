# Start check: Meridia's Order (`meridias-order`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Meridia's Order (`NMeridia01`, Meridia.esp:00154A, Meridia.esp)

**Started by**

- Dialogue with Paladin Marith, placed in Meridia's Sanctum, "You lead, I'll follow.": SetStage 10 (when: the speaker is Paladin Marith). Source: TIF__02001553.Fragment_0 on INFO Meridia.esp:001553 (Meridia.esp). **script**
- Dialogue with Paladin Marith, placed in Meridia's Sanctum, "I'll do no such thing. Now leave me alone.": SetStage 10 (when: the speaker is Paladin Marith). Source: TIF__020019FF.Fragment_0 on INFO Meridia.esp:0019FF (Meridia.esp). **script**
- Dialogue with Paladin Marith, placed in Meridia's Sanctum, "Lead the way.": SetStage 10 (when: the speaker is Paladin Marith). Source: TIF__02001A01.Fragment_0 on INFO Meridia.esp:001A01 (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:00154A DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill the Necromancer in Solitude", shown at stage 20. Source: Meridia.esp:00154A QOBJ 20. **files**
- Dialogue with High Priestess Alara, placed in Meridia's Sanctum, "What would you like me to do?": SetStage 20 (when: the speaker is High Priestess Alara). Reply: "We've received word that a Necromancer has taken up residence in Solitude. " Source: TIF__02001F8C.Fragment_0 on INFO Meridia.esp:001F8C (Meridia.esp). **script**

**Who and where**

- First objective: "Speak with High Priestess Alara at Meridia's Sanctum". Source: Meridia.esp:00154A QOBJ 10. **files**
- Target alias Alara (unique): High Priestess Alara (unique actor, placed in Meridia's Sanctum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Meridia's Sanctum: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Our Lady (`NMeridia02`, Meridia.esp:003B23, Meridia.esp)

**Started by**

- NMeridia01 (Meridia's Order) at stage 40 calls SetStage 10; its stage 40 is set by Dialogue with High Priestess Alara, placed in Meridia's Sanctum: SetStage 40 (when: the speaker is High Priestess Alara). Source: QF_NMeridia01_0200154A.fragment_10 on Meridia.esp:00154A (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:003B23 DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Follow Alara to Meridia's Shrine", shown at stage 20. Source: Meridia.esp:003B23 QOBJ 20. **files**
- Dialogue with High Priestess Alara, placed in Meridia's Sanctum, "Where are we traveling to?": SetStage 20 (when: the speaker is High Priestess Alara; Our Lady stage == 10). Reply: "We're traveling to the Shrine of Meridia. It's not far." Source: TIF__02003B27.Fragment_0 on INFO Meridia.esp:003B27 (Meridia.esp). **script**

**Who and where**

- First objective: "Speak with Alara". Source: Meridia.esp:003B23 QOBJ 10. **files**
- Target alias Alara (unique): High Priestess Alara (unique actor, placed in Meridia's Sanctum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Meridia's Sanctum: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. Prisoner (`NMeridia03`, Meridia.esp:0046DA, Meridia.esp)

**Started by**

- NMeridia02 (Our Lady) at stage 60 calls SetStage 10; its stage 60 is set by Dialogue with High Priestess Alara, placed in Meridia's Sanctum: SetStage 60 (when: the speaker is High Priestess Alara; Our Lady stage == 55; GetItemCount Necromancer's Note == 1). Source: QF_NMeridia02_02003B23.fragment_6 on Meridia.esp:003B23 (Meridia.esp). **script**
- Dialogue with High Priestess Alara, placed in Meridia's Sanctum, "How can I find it?": SetStage 20 (when: the speaker is High Priestess Alara). Source: TIF__02004E35.Fragment_0 on INFO Meridia.esp:004E35 (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:0046DA DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Ask members of Meridia's Order about Findar", shown at stage 20. Source: Meridia.esp:0046DA QOBJ 20. **files**
- Dialogue with High Priestess Alara, placed in Meridia's Sanctum, "How can I find it?": SetStage 20 (when: the speaker is High Priestess Alara). Reply: "Well, the only person who knows it location now is Findar and I have no idea where he is." Source: TIF__02004E35.Fragment_0 on INFO Meridia.esp:004E35 (Meridia.esp). **script**

**Who and where**

- First objective: "Speak with Alara in Meridia's Sanctum". Source: Meridia.esp:0046DA QOBJ 10. **files**
- Target alias Alara (unique): High Priestess Alara (unique actor, placed in Meridia's Sanctum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Meridia's Sanctum: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Summoner's Demise (stage 100, QF_NMeridia03_020046DA.fragment_16).

## 4. Infiltration (`NMeridia04`, Meridia.esp:00816C, Meridia.esp)

**Started by**

- NMeridia03 (Prisoner) at stage 100 calls SetStage 10; its stage 100 is set by Dialogue with High Priestess Alara, placed in Meridia's Sanctum: SetStage 100 (when: the speaker is High Priestess Alara; Prisoner stage == 90). Source: QF_NMeridia03_020046DA.fragment_16 on Meridia.esp:0046DA (Meridia.esp). **script**
- Dialogue with Arch-Paladin Laracin, placed in Meridia's Sanctum, "How do I infiltrate them?": SetStage 20 (when: the speaker is Arch-Paladin Laracin). Source: TIF__02008172.Fragment_0 on INFO Meridia.esp:008172 (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:00816C DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet with the Necromancers", shown at stage 20. Source: Meridia.esp:00816C QOBJ 20. **files**
- Dialogue with Arch-Paladin Laracin, placed in Meridia's Sanctum, "How do I infiltrate them?": SetStage 20 (when: the speaker is Arch-Paladin Laracin). Reply: "Luckily for you, whilst you were dealing with that Findar fool, I arranged for you to meet their recruiter." Source: TIF__02008172.Fragment_0 on INFO Meridia.esp:008172 (Meridia.esp). **script**
- On the way, a line of its own starts a scene while it is at its first objective: Dialogue with Dralos, placed in Skyrim, "What do I have to do?": StartScene (when: the speaker is Dralos; Infiltration stage == 20) (scene Meridia.esp:008D14). Source: TIF__020081D4.Fragment_0 on INFO Meridia.esp:0081D4 (Meridia.esp). **script**

**Who and where**

- First objective: "Speak with Laracin". Source: Meridia.esp:00816C QOBJ 10. **files**
- Target alias Laracin (unique): Arch-Paladin Laracin (unique actor, placed in Meridia's Sanctum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Meridia's Sanctum: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 5. The Dark Dawn (`NMeridia04ReeshiMisc`, Meridia.esp:0092EE, Meridia.esp)

**Started by**

- Dialogue with Tahlani, placed in Dark Dawn Sanctuary, "It's good to meet you.": SetStage 10 (when: the speaker is Tahlani; GetDeadCount Dralos == 0; GetIsRace High Elf == 0). Source: TIF__02008228.Fragment_0 on INFO Meridia.esp:008228 (Meridia.esp). **script**
- Dialogue with Tahlani, placed in Dark Dawn Sanctuary, "It's good to meet you.": SetStage 10 (when: the speaker is Tahlani; GetIsRace High Elf == 1; GetDeadCount Dralos == 0). Source: TIF__02008231.Fragment_0 on INFO Meridia.esp:008231 (Meridia.esp). **script**
- Dialogue with Tahlani, placed in Dark Dawn Sanctuary, "He said he wanted to stop off in Markarth for some supplies. (Persuade)": SetStage 10 (when: the speaker is Tahlani; GetActorValue >= SpeechVeryEasy (now 10); GetIsRace High Elf == 0). Source: TIF__02008233.Fragment_0 on INFO Meridia.esp:008233 (Meridia.esp). **script**
- Dialogue with Tahlani, placed in Dark Dawn Sanctuary, "He said he wanted to stop off in Markarth for some supplies. (Persuade)": SetStage 10 (when: the speaker is Tahlani; GetActorValue >= SpeechVeryEasy (now 10); GetIsRace High Elf == 1). Source: TIF__02008234.Fragment_0 on INFO Meridia.esp:008234 (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:0092EE DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill or warn the Markarth Court Member", shown at stage 20. Source: Meridia.esp:0092EE QOBJ 20. **files**
- Dialogue with Reeshi, placed in Dark Dawn Sanctuary, "What is the task?": SetStage 20 (when: the speaker is Reeshi; The Dark Dawn stage == 10). Reply: "There is a member of the Jarl's court in Markarth petitioning with the other Holds to put a tighter grip on Necromancy and those who practice it." Source: TIF__02009300.Fragment_0 on INFO Meridia.esp:009300 (Meridia.esp). **script**

**Who and where**

- First objective: "Speak to Reeshi". Source: Meridia.esp:0092EE QOBJ 10. **files**
- Target alias Reeshi (forced): Reeshi (forced reference, placed in Dark Dawn Sanctuary). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dark Dawn Sanctuary: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 6. Fort Justice (`NMeridia05`, Meridia.esp:00BC5D, Meridia.esp)

**Started by**

- NMeridia04 (Infiltration) at stage 70 calls SetStage 10; its stage 70 is set by Dialogue with High Priestess Alara, placed in Meridia's Sanctum: SetStage 70 (when: the speaker is High Priestess Alara; Infiltration stage == 60). Source: QF_NMeridia04_0200816C.fragment_10 on Meridia.esp:00816C (Meridia.esp). **script**
- Dialogue with Initiate Velteth, placed in Meridia's Sanctum: SetStage 20 (when: the speaker is Initiate Velteth). Source: TIF__0200C750.Fragment_0 on INFO Meridia.esp:00C750 (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:00BC5D DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak with Velteth", shown at stage 20. Source: Meridia.esp:00BC5D QOBJ 20. **files**
- Dialogue with Initiate Velteth, placed in Meridia's Sanctum: SetStage 20 (when: the speaker is Initiate Velteth). Reply: "Champion, when you have the time, I wish to speak with you about a matter of high importance." Source: TIF__0200C750.Fragment_0 on INFO Meridia.esp:00C750 (Meridia.esp). **script**

**Who and where**

- First objective: "Listen to Alara". Source: Meridia.esp:00BC5D QOBJ 10. **files**
- Target alias Alara (unique): High Priestess Alara (unique actor, placed in Meridia's Sanctum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Meridia's Sanctum: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 7. A New Day (`NMeridia06`, Meridia.esp:007CFC, Meridia.esp)

**Started by**

- NMeridia05 (Fort Justice) at stage 100 calls SetStage 10; its stage 100 is set by Dialogue with High Priestess Alara, placed in Meridia's Sanctum: SetStage 100 (when: the speaker is High Priestess Alara). Source: QF_NMeridia05_0200BC5D.fragment_15 on Meridia.esp:00BC5D (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:007CFC DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Read the Letter", shown at stage 15. Source: Meridia.esp:007CFC QOBJ 15. **files**
- Dialogue with High Priestess Alara, placed in Meridia's Sanctum, "What's next?": SetStage 15 (when: the speaker is High Priestess Alara; A New Day stage == 10). Reply: "This arrived whilst you were with the Dark Dawn. Take a look." Source: TIF__020088E0.Fragment_0 on INFO Meridia.esp:0088E0 (Meridia.esp). **script**

**Who and where**

- First objective: "Speak to Alara". Source: Meridia.esp:007CFC QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 8. The Way In (`NMeridia07`, Meridia.esp:0103B4, Meridia.esp)

**Started by**

- NMeridia06 (A New Day) at stage 100 calls SetStage 10; its stage 100 is set by Dialogue with Meridia, placed in Fort Justice: SetStage 100 (when: the speaker is Meridia; A New Day stage == 90). Source: QF_NMeridia06_02007CFC.fragment_24 on Meridia.esp:007CFC (Meridia.esp). **script**
- Dialogue with Initiate Garin, placed in Meridia's Sanctum, "So, how do we do it?": SetStage 20 (when: the speaker is Initiate Garin). Source: TIF__02012EEB.Fragment_0 on INFO Meridia.esp:012EEB (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:0103B4 DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Listen to Vaegra", shown at stage 20. Source: Meridia.esp:0103B4 QOBJ 20. **files**
- Dialogue with Initiate Garin, placed in Meridia's Sanctum, "So, how do we do it?": SetStage 20 (when: the speaker is Initiate Garin). Reply: "As for finding someone who has entered the realm, frankly I have no idea." Source: TIF__02012EEB.Fragment_0 on INFO Meridia.esp:012EEB (Meridia.esp). **script**

**Who and where**

- First objective: "Speak to Garin". Source: Meridia.esp:0103B4 QOBJ 10. **files**
- Target alias Garin (unique): Initiate Garin (unique actor, placed in Meridia's Sanctum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Meridia's Sanctum: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 9. The Pocket Realm (`NMeridia08`, Meridia.esp:019A81, Meridia.esp)

**Started by**

- NMeridia07 (The Way In) at stage 90 calls SetStage 10; its stage 90 is set by Dialogue with Initiate Garin, placed in Meridia's Sanctum: SetStage 90 (when: the speaker is Initiate Garin). Source: QF_NMeridia07_020103B4.fragment_15 on Meridia.esp:0103B4 (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:019A81 DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Escape the pocket realm", shown at stage 20. Source: Meridia.esp:019A81 QOBJ 20. **files**
- On the way, a line of its own starts a scene while it is at its first objective: Dialogue with Initiate Garin, placed in Meridia's Sanctum: StartScene (when: The Pocket Realm stage == 20; the speaker is Initiate Garin) (scene Meridia.esp:01CD43). Source: TIF__0201C7E0.Fragment_0 on INFO Meridia.esp:01C7E0 (Meridia.esp). **script**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Find a way to destroy the pocket realm". Source: Meridia.esp:019A81 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 10. A Fate Worse Than Death (`NMeridia08MiscFiya`, Meridia.esp:019A82, Meridia.esp)

**Started by**

- Dialogue with Alzacar, placed in The Malevolent Realm: SetStage 10 (when: the speaker is Alzacar; A Fate Worse Than Death hasn't started). Source: TIF__0201A1AE.Fragment_0 on INFO Meridia.esp:01A1AE (Meridia.esp). **script**
- Dialogue with Fiya, placed in The Malevolent Palace: SetStage 10 (when: the speaker is Fiya; A Fate Worse Than Death stage >= 0; A Fate Worse Than Death stage <= 10). Source: TIF__0201A1C1.Fragment_1 on INFO Meridia.esp:01A1C1 (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:019A82 DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill Marith or Alara", shown at stage 30. Source: Meridia.esp:019A82 QOBJ 30. **files**
- Dialogue with Fiya, placed in The Malevolent Palace: SetStage 20 (when: the speaker is Fiya; A Fate Worse Than Death stage >= 0; A Fate Worse Than Death stage <= 10). Reply: "Well, as frustrating as I find your resolve - it is predicable." Source: TIF__0201A1C1.Fragment_0 on INFO Meridia.esp:01A1C1 (Meridia.esp). **script**
- Dialogue with Fiya, placed in The Malevolent Palace: SetStage 30 (when: the speaker is Fiya; A Fate Worse Than Death stage == 20). Reply: "Welcome to my dungeon. I do hope you don't mind that I brought guests." Source: TIF__0201A1D0.Fragment_0 on INFO Meridia.esp:01A1D0 (Meridia.esp). **script**

**Who and where**

- First objective: "Confront Fiya". Source: Meridia.esp:019A82 QOBJ 10. **files**
- Target alias Fiya (unique): Fiya (unique actor, placed in The Malevolent Palace). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Malevolent Palace: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 11. The Jester, In The Bedroom, With The Knife (`NMeridia08MiscJester`, Meridia.esp:01ACCF, Meridia.esp)

**Started by**

- Dialogue with The Jester, placed in The Malevolent Palace, "How can we do it?": SetStage 10 (when: the speaker is The Jester). Source: TIF__0201D2C2.Fragment_0 on INFO Meridia.esp:01D2C2 (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:01ACCF DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill Kelrog", shown at stage 30. Source: Meridia.esp:01ACCF QOBJ 30. **files**
- Dialogue with Alzacar, placed in The Malevolent Realm: SetStage 30 (when: the speaker is Alzacar; GetDeadCount Cleans-Many-Boots == 0). Reply: "Champion, I will help you with your intentions." Source: TIF__0201D308.Fragment_0 on INFO Meridia.esp:01D308 (Meridia.esp). **script**
- Dialogue with Alzacar, placed in The Malevolent Realm: SetStage 30 (when: the speaker is Alzacar; GetDeadCount Cleans-Many-Boots == 1). Reply: "Champion, I will help you with your intentions." Source: TIF__0201DE04.Fragment_0 on INFO Meridia.esp:01DE04 (Meridia.esp). **script**
- On the way, a line of its own starts a scene while it is at its first objective: Dialogue with The Jester, placed in The Malevolent Palace, "I found this letter.": StartScene (when: the speaker is The Jester; The Jester, In The Bedroom, With The Knife stage == 10; GetItemCount To Malfyur == 1) (scene Meridia.esp:01D2E1). Source: TIF__0201D2CC.Fragment_0 on INFO Meridia.esp:01D2CC (Meridia.esp). **script**

**Who and where**

- First objective: "Find a way to turn Alzacar against Fiya". Source: Meridia.esp:01ACCF QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 12. The Ritual (`NMeridia09`, Meridia.esp:01F41F, Meridia.esp)

**Started by**

- NMeridia08 (The Pocket Realm) at stage 40 calls SetStage 10; its stage 40 is set by Dialogue with High Priestess Alara, placed in Meridia's Sanctum: SetStage 40 (when: the speaker is High Priestess Alara). Source: QF_NMeridia08_02019A81.fragment_5 on Meridia.esp:019A81 (Meridia.esp). **script**
- Dialogue with High Priestess Alara, placed in Meridia's Sanctum: SetStage 20 (when: the speaker is High Priestess Alara). Source: TIF__02024DE9.Fragment_0 on INFO Meridia.esp:024DE9 (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:01F41F DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Stop the Ritual", shown at stage 20. Source: Meridia.esp:01F41F QOBJ 20. **files**
- Dialogue with High Priestess Alara, placed in Meridia's Sanctum: SetStage 20 (when: the speaker is High Priestess Alara). Reply: "Meridia watch over us all." Source: TIF__02024DE9.Fragment_0 on INFO Meridia.esp:024DE9 (Meridia.esp). **script**
- On the way, a line of its own starts a scene while it is at its first objective: Dialogue with High Priestess Alara, placed in Meridia's Sanctum, "I'm ready to face Fiya.": StartScene (when: the speaker is High Priestess Alara; The Ritual stage == 10) (scene Meridia.esp:024DBD). Source: TIF__0202554A.Fragment_0 on INFO Meridia.esp:02554A (Meridia.esp). **script**

**Who and where**

- First objective: "Speak to Alara". Source: Meridia.esp:01F41F QOBJ 10. **files**
- Target alias Alara (unique): High Priestess Alara (unique actor, placed in Meridia's Sanctum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Meridia's Sanctum: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Lesser Ring of Khajiiti (stage 80, QF_NMeridia09_0201F41F.fragment_8).

## 13. Champion's Choice (`NMeridiaAsger01`, Meridia.esp:02B1F6, Meridia.esp)

**Started by**

- Dialogue with Paladin Asger, placed in Meridia's Sanctum, "I can help with that.": SetStage 10 (when: the speaker is Paladin Asger). Source: TIF__0202BCC9.Fragment_0 on INFO Meridia.esp:02BCC9 (Meridia.esp). **script**
- Dialogue with Paladin Asger, placed in Meridia's Sanctum, "I'll think about it.": SetStage 5 (when: the speaker is Paladin Asger). Source: TIF__0202BCCB.Fragment_0 on INFO Meridia.esp:02BCCB (Meridia.esp). **script**
- Dialogue with Paladin Asger, placed in Meridia's Sanctum, "I'll join you on your warlock hunt.": SetStage 10 (when: the speaker is Paladin Asger; Champion's Choice stage == 5). Source: TIF__0202BCD9.Fragment_0 on INFO Meridia.esp:02BCD9 (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:02B1F6 DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find Orfoljt", shown at stage 20. Source: Meridia.esp:02B1F6 QOBJ 20. **files**
- Dialogue with Arandar, placed in Mistveil Keep, Riften Mistveil Keep, "I'm here to investigate your claims about a warlock.": SetStage 20 (when: the speaker is Arandar; Champion's Choice stage == 10). Reply: "Yes, finally someone listens. The guards here are too corrupt to do anything about it, and Gods know they won't go into the Ratway." Source: TIF__0202BCD1.Fragment_0 on INFO Meridia.esp:02BCD1 (Meridia.esp). **script**

**Who and where**

- First objective: "Speak to Arandar". Source: Meridia.esp:02B1F6 QOBJ 10. **files**
- Target alias Arandar (forced): Arandar (forced reference, placed in Mistveil Keep, Riften Mistveil Keep). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Mistveil Keep, Riften Mistveil Keep: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 14. Repentance Upheld (`NMeridiaGarin01`, Meridia.esp:02A183, Meridia.esp)

**Started by**

- Dialogue with Initiate Garin, placed in Meridia's Sanctum, "I'd be happy to come along with you.": SetStage 10 (when: the speaker is Initiate Garin). Source: TIF__0202A6F2.Fragment_0 on INFO Meridia.esp:02A6F2 (Meridia.esp). **script**
- Dialogue with Initiate Garin, placed in Meridia's Sanctum, "I'll think about it.": SetStage 5 (when: the speaker is Initiate Garin). Source: TIF__0202A6F5.Fragment_0 on INFO Meridia.esp:02A6F5 (Meridia.esp). **script**
- Dialogue with Initiate Garin, placed in Meridia's Sanctum, "I'll join you in your search for your Cult Leader.": SetStage 10 (when: the speaker is Initiate Garin; Repentance Upheld stage == 5). Source: TIF__0202A6F3.Fragment_0 on INFO Meridia.esp:02A6F3 (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:02A183 DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Confront Rosette", shown at stage 15. Source: Meridia.esp:02A183 QOBJ 15. **files**
- Dialogue with Rosette, placed in Hall of the Dead, Windhelm Hall of the Dead: SetStage 15 (when: the speaker is Rosette). Reply: "Garin... I thought it was you I saw skulking around Windhelm. I'd know that face anywhere, even in it's current state..." Source: TIF__0202A6FD.Fragment_0 on INFO Meridia.esp:02A6FD (Meridia.esp). **script**

**Who and where**

- First objective: "Find the Cult Leader in Windhelm". Source: Meridia.esp:02A183 QOBJ 10. **files**
- Target alias Rosette (forced): Rosette (forced reference, placed in Hall of the Dead, Windhelm Hall of the Dead). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of the Dead, Windhelm Hall of the Dead: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 15. Stendarr's Mercy (`NMeridiaLaracin01`, Meridia.esp:02A15E, Meridia.esp)

**Started by**

- Dialogue with Arch-Paladin Laracin, placed in Meridia's Sanctum, "Is there anything I can do to help?": SetStage 5 (when: the speaker is Arch-Paladin Laracin; The Ritual stage == 80; NMeridiaVigilantMisc stage >= 10; Stendarr's Mercy hasn't started). Source: TIF__0302A166.Fragment_0 on INFO Meridia.esp:02A166 (Meridia.esp). **script**
- Dialogue with Arch-Paladin Laracin, placed in Meridia's Sanctum, "I'll happily join you.": SetStage 10 (when: the speaker is Arch-Paladin Laracin). Source: TIF__0202A168.Fragment_0 on INFO Meridia.esp:02A168 (Meridia.esp). **script**
- Dialogue with Arch-Paladin Laracin, placed in Meridia's Sanctum, "I'll think about it.": SetStage 5 (when: the speaker is Arch-Paladin Laracin). Source: TIF__0202A16A.Fragment_0 on INFO Meridia.esp:02A16A (Meridia.esp). **script**
- Dialogue with Arch-Paladin Laracin, placed in Meridia's Sanctum, "I will help you destroy the Vigilants at Stendarr's Beacon.": SetStage 10 (when: the speaker is Arch-Paladin Laracin; Stendarr's Mercy stage == 5). Source: TIF__0202A16D.Fragment_0 on INFO Meridia.esp:02A16D (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:02A15E DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill the Vigilant Leader or make a truce", shown at stage 15. Source: Meridia.esp:02A15E QOBJ 15. **files**
- Dialogue with Arch-Paladin Laracin, placed in Meridia's Sanctum, "I'm Meridia's Champion for a reason. This is what is best for the Order.": SetStage 15 (when: the speaker is Arch-Paladin Laracin). Reply: "Hmm... You make a compelling case. Fine, but I will accompany you nonetheless.These Vigilants are not to be trusted." Source: TIF__0308ECE9.Fragment_0 on INFO Meridia.esp:08ECE9 (Meridia.esp). **script**
- On the way, a line of its own starts a scene while it is at its first objective: Dialogue with Vigilant Archeus, placed in Aba-Malatar, "Meridia's Order would like to make a truce.": StartScene (when: the speaker is Vigilant Archeus; Stendarr's Mercy stage == 15) (scene Meridia.esp:08ED05). Source: TIF__0308ECEF.Fragment_0 on INFO Meridia.esp:08ECEF (Meridia.esp). **script**

**Who and where**

- First objective: "Kill the Vigilant Leader". Source: Meridia.esp:02A15E QOBJ 10. **files**
- Target alias Vigilant (forced): Vigilant Varacus (forced reference, placed in Stendarr's Beacon). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 16. Finding Yourself (`NMeridiaUna01`, Meridia.esp:02C7C9, Meridia.esp)

**Started by**

- Dialogue with Acolyte Una, placed in Meridia's Sanctum, "I'll come with you to speak to Alara.": SetStage 10 (when: the speaker is Acolyte Una). Source: TIF__0202CD37.Fragment_0 on INFO Meridia.esp:02CD37 (Meridia.esp). **script**
- Dialogue with Acolyte Una, placed in Meridia's Sanctum, "I'll have to think about it.": SetStage 5 (when: the speaker is Acolyte Una). Source: TIF__0202CD39.Fragment_0 on INFO Meridia.esp:02CD39 (Meridia.esp). **script**
- Dialogue with Acolyte Una, placed in Meridia's Sanctum, "I'll come with you to speak to Alara.": SetStage 10 (when: the speaker is Acolyte Una; Finding Yourself stage == 5). Source: TIF__0202F33E.Fragment_0 on INFO Meridia.esp:02F33E (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:02C7C9 DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Travel to Meridia's Shrine with Una", shown at stage 20. Source: Meridia.esp:02C7C9 QOBJ 20. **files**
- Dialogue with High Priestess Alara, placed in Meridia's Sanctum: SetStage 20 (when: the speaker is High Priestess Alara). Reply: "Meridia be with you both." Source: TIF__0202CD55.Fragment_0 on INFO Meridia.esp:02CD55 (Meridia.esp). **script**

**Who and where**

- First objective: "Accompany Una to Alara". Source: Meridia.esp:02C7C9 QOBJ 10. **files**
- Target alias Una (unique): Acolyte Una (unique actor, placed in Meridia's Sanctum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Meridia's Sanctum: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 17. A Parting Gift (`NMeridiaValrar01`, Meridia.esp:030946, Meridia.esp)

**Started by**

- Dialogue with Initiate Valrar, placed in Meridia's Sanctum, "I'll have to think about it.": SetStage 5 (when: the speaker is Initiate Valrar). Source: TIF__02031996.Fragment_0 on INFO Meridia.esp:031996 (Meridia.esp). **script**
- Dialogue with Initiate Valrar, placed in Meridia's Sanctum, "I'll get your ring for you.": SetStage 10 (when: the speaker is Initiate Valrar). Source: TIF__02031998.Fragment_0 on INFO Meridia.esp:031998 (Meridia.esp). **script**
- Dialogue with Initiate Valrar, placed in Meridia's Sanctum, "I'll get your ring for you.": SetStage 10 (when: the speaker is Initiate Valrar; A Parting Gift stage == 5). Source: TIF__0203199B.Fragment_0 on INFO Meridia.esp:03199B (Meridia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Meridia.esp:030946 DNAM (Meridia.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Valrar", shown at stage 20. Source: Meridia.esp:030946 QOBJ 20. **files**
- Dialogue with Dario, placed in Sleeping Giant Inn, "Here. (3000 gold)": SetStage 20 (when: the speaker is Dario; the player has at least 3000 gold). Reply: "Pleasure doing business with you. Give Valrar my best." Source: TIF__02031F9B.Fragment_0 on INFO Meridia.esp:031F9B (Meridia.esp). **script**
- Dialogue with Dario, placed in Sleeping Giant Inn, "Come on, do the right thing for Valrar. (Persuade)": SetStage 20 (when: the speaker is Dario; GetActorValue >= SpeechHard (now 75)). Reply: "Fine. You're right. He was always good to me. It's not his fault that things had to end." Source: TIF__02031F9F.Fragment_0 on INFO Meridia.esp:031F9F (Meridia.esp). **script**
- Dialogue with Dario, placed in Sleeping Giant Inn, "How about half? (Persuade)": SetStage 20 (when: the speaker is Dario; GetActorValue >= SpeechAverage (now 50); the player has at least 1500 gold). Reply: "Fine. You're obviously desperate. I'll settle for half. Consider it a favor to Valrar." Source: TIF__02031FA6.Fragment_0 on INFO Meridia.esp:031FA6 (Meridia.esp). **script**
- Dialogue with Dario, placed in Sleeping Giant Inn, "How about half? (Persuade)": SetStage 20 (when: the speaker is Dario; GetActorValue >= SpeechAverage (now 50); gold < 1500). Reply: "I'd consider it. If you even had that much!" Source: TIF__02031FAE.Fragment_0 on INFO Meridia.esp:031FAE (Meridia.esp). **script**
- Dialogue with Dario, placed in Sleeping Giant Inn, "Turns out it's stolen. You'd better give it to me to hold on to. (Persuade)": SetStage 20 (when: the speaker is Dario; GetActorValue >= SpeechVeryHard (now 100)). Reply: "Stolen!? That fool, giving me a stolen piece of jewelry. What if I got caught? I can't afford to spend time in jail!" Source: TIF__02031FA9.Fragment_0 on INFO Meridia.esp:031FA9 (Meridia.esp). **script**

**Who and where**

- First objective: "Obtain Valrar's Family Ring". Source: Meridia.esp:030946 QOBJ 10. **files**
- Target alias Jar (created): Valrar's Family Ring (created item). **files**

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

### dialogue INFO Meridia.esp:001553

- Speaker: Paladin Marith (Imperial), placed in Meridia's Sanctum. Named by: GetIsID.
- The player's prompt: "You lead, I'll follow.".
- The reply: "Really? Just like that?" / "I expected you to question me a little more. Nevermind, I'll escort you to the Sanctum".
- When it's offered: the speaker is Paladin Marith.
- What it does: SetStage 10 on NMeridia01 (Meridia's Order). Source: TIF__02001553.Fragment_0 on INFO Meridia.esp:001553 (Meridia.esp); topic NMeridia01Yes. **script**
- In one sentence: Talk to Paladin Marith (Imperial) in Meridia's Sanctum and choose "You lead, I'll follow.", when the speaker is Paladin Marith: SetStage 10 on NMeridia01 (Meridia's Order).

### dialogue INFO Meridia.esp:0019FF

- Speaker: Paladin Marith (Imperial), placed in Meridia's Sanctum. Named by: GetIsID.
- The player's prompt: "I'll do no such thing. Now leave me alone.".
- The reply: "You and Laracin will get along famously." / "Fine, follow me, don't follow me. It's up to you. Meridia's Sanctum isn't far from Mount Kilkreath." / "When you've decided to behave like a true champion of Meridia, Alara wants to speak with you there.".
- When it's offered: the speaker is Paladin Marith.
- What it does: SetStage 10 on NMeridia01 (Meridia's Order). Source: TIF__020019FF.Fragment_0 on INFO Meridia.esp:0019FF (Meridia.esp); topic NMeridia01No. **script**
- In one sentence: Talk to Paladin Marith (Imperial) in Meridia's Sanctum and choose "I'll do no such thing. Now leave me alone.", when the speaker is Paladin Marith: SetStage 10 on NMeridia01 (Meridia's Order).

### dialogue INFO Meridia.esp:001A01

- Speaker: Paladin Marith (Imperial), placed in Meridia's Sanctum. Named by: GetIsID.
- The player's prompt: "Lead the way.".
- The reply: "Thank you. It's not too far from Meridia's Statue. I'll escort you there.".
- When it's offered: the speaker is Paladin Marith.
- What it does: SetStage 10 on NMeridia01 (Meridia's Order). Source: TIF__02001A01.Fragment_0 on INFO Meridia.esp:001A01 (Meridia.esp); topic NMeridia01Yes02. **script**
- In one sentence: Talk to Paladin Marith (Imperial) in Meridia's Sanctum and choose "Lead the way.", when the speaker is Paladin Marith: SetStage 10 on NMeridia01 (Meridia's Order).

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
