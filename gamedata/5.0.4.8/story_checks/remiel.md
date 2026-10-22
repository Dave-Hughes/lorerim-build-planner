# Start check: Remiel (`remiel`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Attuned Assassination (`HLIOADQuest`, HLIORemi.esp:62E259, HLIORemi.esp)

**Started by**

- Dialogue with Remiel (named by the one follower in HLIOADQuest (Attuned Assassination)'s aliases), placed in Silver-Blood Inn, "Maybe the Bard's College?": SetStage 20. Source: HLIO_TIF__0562E266.Fragment_0 on INFO HLIORemi.esp:62E266 (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the one follower in HLIOADQuest (Attuned Assassination)'s aliases), placed in Silver-Blood Inn, "I don't think Skyrim is known for its libraries.": SetStage 10. Source: HLIO_TIF__0562E265.Fragment_0 on INFO HLIORemi.esp:62E265 (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the line before it (HLIORemi.esp:62E26A), GetIsID), placed in Silver-Blood Inn, "We could try the Bard's College.": SetStage 20. Source: HLIO_TIF__0562E26F.Fragment_0 on INFO HLIORemi.esp:62E26F (HLIORemi.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: HLIORemi.esp:62E259 DNAM (HLIORemi.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Take Remi to the College of Winterhold.", shown at stage 30. Source: HLIORemi.esp:62E259 QOBJ 30. **files**
- Dialogue with Remiel (named by the one follower in HLIOADQuest (Attuned Assassination)'s aliases), placed in Silver-Blood Inn, "Maybe the College of Winterhold?": SetStage 30. Reply: "Ugh, of course the mages would have something like that. It's really unfortunate that the only literate people in Skyrim seem to also like magic." Source: HLIO_TIF__0562E267.Fragment_0 on INFO HLIORemi.esp:62E267 (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the line before it (HLIORemi.esp:62E26A), GetIsID), placed in Silver-Blood Inn, "We could try the College of Winterhold.": SetStage 30. Reply: "Ugh, of course the mages would have something like that. It's really unfortunate that the only literate people in Skyrim seem to also like magic." Source: HLIO_TIF__0562E26E.Fragment_0 on INFO HLIORemi.esp:62E26E (HLIORemi.esp). **script**

**Who and where**

- First objective: "Take Remi to the Bard's College.". Source: HLIORemi.esp:62E259 QOBJ 20. **files**
- Target alias BCBook (forced): A Thesis on the Properties of Tonal Magic and Its Practical Applications (forced reference, placed in Bards College, The Bards College). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Bards College, The Bards College: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Exploring Arkngchal (`HLIOArkngchalManager`, HLIORemi.esp:6A304E, HLIORemi.esp)

**Started by**

- Dialogue with Remiel (named by scene HLIOArkngchalManagerArkngchalRubbleScene2, alias Remi of HLIOArkngchalManager (Exploring Arkngchal) (forced)), placed in Silver-Blood Inn: SetStage 2; its scene is started by dialogue with Remiel, "Fine.". Source: HLIO_TIF__056B76B7.Fragment_0 on INFO HLIORemi.esp:6B76B7 (HLIORemi.esp). **script**
- Dialogue with Remiel (named by scene HLIOArkngchalManagerLeverRoom1, alias Remi of HLIOArkngchalManager (Exploring Arkngchal) (forced)), placed in Silver-Blood Inn: SetStage 4; its scene is started by HLIOArkngchalManager (Exploring Arkngchal) at stage 3. Source: HLIO_TIF__056B7750.Fragment_0 on INFO HLIORemi.esp:6B7750 (HLIORemi.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: HLIORemi.esp:6A304E DNAM (HLIORemi.esp). **files**
- (First objective shown at stage 4; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- HLIOMQ1 (Reunion of the Fallen) at stage 220 calls SetStage 60. Source: HLIO_QF_HLIOMQ1_0546FA55.fragment_21 (HLIORemi.esp).

**Who and where**

- First objective: "Tell Remi what order to pull the levers.". Source: HLIORemi.esp:6A304E QOBJ 5. **files**
- Target alias Lever1 (forced): Lever (forced reference, placed in Arkngchal). **files**
- Target alias Lever2 (forced): Lever (forced reference, placed in Arkngchal). **files**
- Target alias Lever3 (forced): Lever (forced reference, placed in Arkngchal). **files**
- Target alias Lever4 (forced): Lever (forced reference, placed in Arkngchal). **files**
- Target alias Lever5 (forced): Lever (forced reference, placed in Arkngchal). **files**

**Needs**

- The door from Skyrim into Arkngchal needs the Arkngchal Key. Source: HLIORemi.esp:4F8AA7 (HLIORemi.esp). **files**
- The door from Skyrim into Arkngchal needs the Arkngchal Key. Source: HLIORemi.esp:4F8AA7 (HLIORemi.esp). **files**
- The door from Skyrim into Arkngchal needs the Arkngchal Key. Source: HLIORemi.esp:4F8AA7 (HLIORemi.esp). **files**
- The door from Skyrim into Arkngchal needs the Arkngchal Key. Source: HLIORemi.esp:4F8AA7 (HLIORemi.esp). **files**
- The door from Skyrim into Arkngchal needs the Arkngchal Key. Source: HLIORemi.esp:4F8AA7 (HLIORemi.esp). **files**
- Ways in: Arkngchal: 1 door, 1 locked; Arkngchal: 1 door, 1 locked; Arkngchal: 1 door, 1 locked; Arkngchal: 1 door, 1 locked; Arkngchal: 1 door, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. Real Nord Food (`HLIOChaurusPieQuest`, HLIORemi.esp:59B47F, HLIORemi.esp)

**Started by**

- Dialogue with Remiel (named by the one follower in HLIOChaurusPieQuest (Real Nord Food)'s aliases), placed in Silver-Blood Inn, "A book. It's called 'Chaurus Pie.'": SetStage 10 (when: GetItemCount Chaurus Pie: A Recipe >= 1). Source: HLIO_TIF__0559B47A.Fragment_1 on INFO HLIORemi.esp:59B47A (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the one follower in HLIOChaurusPieQuest (Real Nord Food)'s aliases), placed in Silver-Blood Inn, "That's a lot.": SetStage 30. Source: HLIO_TIF__0559B48D.Fragment_0 on INFO HLIORemi.esp:59B48D (HLIORemi.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: HLIORemi.esp:59B47F DNAM (HLIORemi.esp). **files**
- (First objective shown at stage 30; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Take Remi to Candlehearth Hall.", shown at stage 40. Source: HLIORemi.esp:59B47F QOBJ 40. **files**
- Dialogue with Remiel, placed in Silver-Blood Inn, "Here are the ingredients for the chaurus pie.": SetStage 40 (when: the speaker is Remiel; GetItemCount Tomato >= 1; GetItemCount Honey >= 1; GetItemCount Dash of Salt >= 1; GetItemCount Raw Potato >= 1; GetItemCount Carrot >= 1; GetItemCount Green Apple >= 1 or GetItemCount Red Apple >= 1; Real Nord Food stage == 30). Reply: "Oh, you got everything! Excellent, because I'm hungry." Source: HLIO_TIF__0559B491.Fragment_1 on INFO HLIORemi.esp:59B491 (HLIORemi.esp). **script**
- On the way, a line of its own starts a scene while it is at its first objective: Dialogue with Remiel, placed in Silver-Blood Inn, "Here's the cooking pot.": StartScene (when: GetDistance Skyrim.esm:10E3A2 <= 300; Real Nord Food stage == 40; the speaker is Remiel) (scene HLIORemi.esp:59B498). Source: HLIO_TIF__0559B497.Fragment_0 on INFO HLIORemi.esp:59B497 (HLIORemi.esp). **script**
- On the way, a line of its own starts a scene while it is at its first objective: Dialogue with Remiel, placed in Silver-Blood Inn, "Here's the cooking pot.": StartScene (when: GetDistance Skyrim.esm:10E3A2 <= 300; Real Nord Food stage == 40; the speaker is Remiel) (scene HLIORemi.esp:59B498). Source: HLIO_TIF__0559B4A4.Fragment_0 on INFO HLIORemi.esp:59B4A4 (HLIORemi.esp). **script**

**Who and where**

- First objective: "Tell Remi once you've acquired all the ingredients.". Source: HLIORemi.esp:59B47F QOBJ 30. **files**
- Target alias Remi (forced): Remiel (forced reference, placed in Silver-Blood Inn). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Silver-Blood Inn: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 4. Reunion of the Fallen (`HLIOMQ1`, HLIORemi.esp:46FA55, HLIORemi.esp)

**Started by**

- Dialogue with Remiel (named by the one follower in HLIOMQ1 (Reunion of the Fallen)'s aliases), placed in Silver-Blood Inn, "Anytime, Remi.": SetStage 10. Source: HLIO_TIF__0546FA5D.Fragment_0 on INFO HLIORemi.esp:46FA5D (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the one follower in HLIOMQ1 (Reunion of the Fallen)'s aliases), placed in Silver-Blood Inn, "This is getting too mushy.": SetStage 10. Source: HLIO_TIF__0546FA5E.Fragment_0 on INFO HLIORemi.esp:46FA5E (HLIORemi.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: HLIORemi.esp:46FA55 DNAM (HLIORemi.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Read the note found on the assassin's corpse.", shown at stage 29. Source: HLIORemi.esp:46FA55 QOBJ 29. **files**
- Read Easy Job (SetStage 29). Source: HLIOAssassinNoteScript.OnContainerChanged on BOOK HLIORemi.esp:46FA63. **script**

**Who and where**

- First objective: "Investigate the assassin's corpse.". Source: HLIORemi.esp:46FA55 QOBJ 20. **files**
- Target alias AssassinNote (created): Easy Job (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 5. Remi's Crossbow Crucible (`HLIORPCrossbow`, HLIORemi.esp:22DCD3, HLIORemi.esp)

**Started by**

- Dialogue with Remiel (named by the line before it (HLIORemi.esp:2198A2), GetIsID), placed in Silver-Blood Inn, "Let me help you gather materials.": SetStage 10. Source: HLIO_TIF__052198A1.Fragment_0 on INFO HLIORemi.esp:2198A1 (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the line before it (HLIORemi.esp:2198A2), GetIsID), placed in Silver-Blood Inn, "You're right; that does sound too difficult.": SetStage 5. Source: HLIO_TIF__0521989E.Fragment_0 on INFO HLIORemi.esp:21989E (HLIORemi.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find eight dwemer gears. (<Global=HLIORPCGearsCount>/<Global=HLIORPCGearsTotal>)", shown at stage 10. Source: HLIORemi.esp:22DCD3 QOBJ 10. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Find two dwemer cogs. (<Global=HLIORPCCogsCount>/<Global=HLIORPCCogsTotal>)". Source: HLIORemi.esp:22DCD3 QOBJ 5. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 6. We Who Challenge the Sun (`HLIORPLantern`, HLIORemi.esp:8486EB, HLIORemi.esp)

**Started by**

- Dialogue with Remiel (named by the one follower in HLIORPLantern (We Who Challenge the Sun)'s aliases), placed in Silver-Blood Inn, "This seems like a long shot, but I'll look.": SetStage 10. Source: HLIE_TIF__058486FA.Fragment_0 on INFO HLIORemi.esp:8486FA (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the one follower in HLIORPLantern (We Who Challenge the Sun)'s aliases), placed in Silver-Blood Inn, "I'm not looking for Aetherium that may or may not be here.": SetStage 9. Source: HLIE_TIF__058486FB.Fragment_0 on INFO HLIORemi.esp:8486FB (HLIORemi.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: HLIORemi.esp:8486EB DNAM (HLIORemi.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find Aetherium in Arkngchal.", shown at stage 11. Source: HLIORemi.esp:8486EB QOBJ 11. **files**
- **unread**: nothing outside its own stage fragments sets stage 11 or one before it.

**Who and where**

- First objective: "Find Aetherium in Arkngchal.". Source: HLIORemi.esp:8486EB QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: the speaker is Remiel; fn286 == 0. **files**

**Gives**: nothing on its completing stages.

## 7. Picking Remi's Brain (`HLIORPLock`, HLIORemi.esp:237EE7, HLIORemi.esp)

**Started by**

- Dialogue with Remiel (named by the line before it (HLIORemi.esp:23CFEA), GetIsID), placed in Silver-Blood Inn, "Well, I'm sure you'll figure it out.": SetStage 10. Source: HLIO_TIF__0523CFF0.Fragment_0 on INFO HLIORemi.esp:23CFF0 (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the one follower in HLIORPLock (Picking Remi's Brain)'s aliases), placed in Silver-Blood Inn, "How will you make it?": SetStage 20. Source: HLIO_TIF__0523CFF2.Fragment_0 on INFO HLIORemi.esp:23CFF2 (HLIORemi.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: HLIORemi.esp:237EE7 DNAM (HLIORemi.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Wait for Remi to finish crafting.", shown at stage 30. Source: HLIORemi.esp:237EE7 QOBJ 30. **files**
- Dialogue with Remiel (named by the one follower in HLIORPLock (Picking Remi's Brain)'s aliases), placed in Silver-Blood Inn, "Here you go.": SetStage 30 (when: GetItemCount Iron Ingot == 1; Picking Remi's Brain stage == 20). Reply: "Perfect! Okay, don't mind me, Ghorza." Source: HLIO_TIF__052420FD.Fragment_0 on INFO HLIORemi.esp:2420FD (HLIORemi.esp). **script**

**Who and where**

- First objective: "Give Remi an iron ingot at the Markarth Forge.". Source: HLIORemi.esp:237EE7 QOBJ 20. **files**
- Target alias Forge (forced): Blacksmith Forge (forced reference, placed in Markarth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Markarth: 6 doors, 3 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 8. Upgrades (`HLIOScrapUpgrades`, HLIORemi.esp:08E59F, HLIORemi.esp)

**Started by**

- Dialogue with Remiel (named by the one follower in HLIOScrapUpgrades (Upgrades)'s aliases), placed in Silver-Blood Inn, "Then let's head out.": SetStage 10. Source: HLIO_TIF__070C0FF2.Fragment_0 on INFO HLIORemi.esp:0C0FF2 (HLIORemi.esp). **script**
- Dialogue with Remiel, placed in Silver-Blood Inn, "It's me, Remi, snap out of it. (Skips Intro Quest)": SetStage 10 (when: The Dwemer Specialist not completed; the speaker is Remiel). Source: HLIO_TIF__05256592.Fragment_0 on INFO HLIORemi.esp:256592 (HLIORemi.esp). **script**
- Story manager node HLIOUpgradesNode, event: change location; conditions up its parents: GetQuestRunning Upgrades == 0; the place you enter is Silver-Blood Inn. Source: HLIOUpgradesNode HLIORemi.esp:0BBEDA (HLIORemi.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Take Remi to see another dwemer ruin.", shown at stage 20. Source: HLIORemi.esp:08E59F QOBJ 20. **files**
- Dialogue with Remiel, placed in Silver-Blood Inn: SetStage 20 (when: global HLIOBetaBaby == 1 (now 0); The Dwemer Specialist completed; you're in Mzulft; the speaker is Remiel; GetInFaction CurrentFollowerFaction == 1). Reply: "Some of the dwemer spiders in here shoot electricity. Interesting..." Source: HLIO_TIF__070C1002.Fragment_0 on INFO HLIORemi.esp:0C1002 (HLIORemi.esp). **script**
- Dialogue with Remiel, placed in Silver-Blood Inn: SetStage 20 (when: global HLIOBetaBaby == 1 (now 0); The Dwemer Specialist completed; you're in Alftand; the speaker is Remiel; GetInFaction CurrentFollowerFaction == 1). Reply: "Wow, look at how these machines are built! They're so efficient; the dwemer who lived here had a unique technique. This gives me some ideas..." Source: HLIO_TIF__070C1003.Fragment_0 on INFO HLIORemi.esp:0C1003 (HLIORemi.esp). **script**
- Dialogue with Remiel, placed in Silver-Blood Inn: SetStage 20 (when: global HLIOBetaBaby == 1 (now 0); The Dwemer Specialist completed; you're in Irkngthand; the speaker is Remiel; GetInFaction CurrentFollowerFaction == 1). Reply: "It's incredible how long all this had lasted. Maybe... If I can mimic how these machines are built, it might make Scrap a bit tougher." Source: HLIO_TIF__070C1004.Fragment_0 on INFO HLIORemi.esp:0C1004 (HLIORemi.esp). **script**
- Dialogue with Remiel, placed in Silver-Blood Inn: SetStage 20 (when: global HLIOBetaBaby == 1 (now 0); The Dwemer Specialist completed; you're in KagrenzelLocation; the speaker is Remiel; GetInFaction CurrentFollowerFaction == 1). Reply: "Amazing! Look at this ball of energy! If I could replicate this advanced power somehow..." Source: HLIO_TIF__070C1005.Fragment_0 on INFO HLIORemi.esp:0C1005 (HLIORemi.esp). **script**
- Dialogue with Remiel, placed in Silver-Blood Inn: SetStage 20 (when: global HLIOBetaBaby == 1 (now 0); The Dwemer Specialist completed; you're in Avanchnzel; the speaker is Remiel; GetInFaction CurrentFollowerFaction == 1). Reply: "This Lexicon you're carrying... some of the Dwemeri writing is familiar. Hm... Incredible! It's so simple, yet so effective! This will be use useful!" Source: HLIO_TIF__070C1006.Fragment_0 on INFO HLIORemi.esp:0C1006 (HLIORemi.esp). **script**
- Dialogue with Remiel, placed in Silver-Blood Inn: SetStage 20 (when: global HLIOBetaBaby == 1 (now 0); The Dwemer Specialist completed; you're in Bthardamz; the speaker is Remiel; GetInFaction CurrentFollowerFaction == 1). Reply: "The way these automotons have been wired to protect these cultists is ingenious! I'm sure I can apply these techniques to strengthen Scrap." Source: HLIO_TIF__070C1007.Fragment_0 on INFO HLIORemi.esp:0C1007 (HLIORemi.esp). **script**
- Dialogue with Remiel, placed in Silver-Blood Inn: SetStage 20 (when: global HLIOBetaBaby == 1 (now 0); The Dwemer Specialist completed; you're in The Aetherium Forge; the speaker is Remiel; GetInFaction CurrentFollowerFaction == 1). Reply: "Amazing! It's THE Aetherium Forge! Look how they used the power of heat to achieve such greatness! Oh, the things I'm learning..." Source: HLIO_TIF__070C1008.Fragment_0 on INFO HLIORemi.esp:0C1008 (HLIORemi.esp). **script**
- Dialogue with Remiel, placed in Silver-Blood Inn: SetStage 20 (when: global HLIOBetaBaby == 1 (now 0); The Dwemer Specialist completed; you're in Mzinchaleft; the speaker is Remiel; GetInFaction CurrentFollowerFaction == 1). Reply: "Lever puzzles... Ingenious. I'm sure I can use a similar method to make sure no one else can rewire Scrap." Source: HLIO_TIF__070C1009.Fragment_0 on INFO HLIORemi.esp:0C1009 (HLIORemi.esp). **script**

**Who and where**

- First objective: "Take Remi to see a dwemer ruin.". Source: HLIORemi.esp:08E59F QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 9. The Dwemer Specialist (`HLIOStartingQuest`, HLIORemi.esp:0E4852, LoreRim - Remi Patch.esp)

**Started by**

- Dialogue with Remiel (named by the one follower in HLIOStartingQuest (The Dwemer Specialist)'s aliases), placed in Silver-Blood Inn, "Well, good luck with that.": SetStage 7. Source: HLIO_TIF__070E4845.Fragment_0 on INFO HLIORemi.esp:0E4845 (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the line before it (HLIORemi.esp:1AA1F0), GetIsID), placed in Silver-Blood Inn, "No way. Find someone else.": SetStage 5. Source: HLIO_TIF__070E4850.Fragment_0 on INFO HLIORemi.esp:0E4850 (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the line before it (HLIORemi.esp:1AA1F0), GetIsID), placed in Silver-Blood Inn, "Fine.": SetStage 10. Source: HLIO_TIF__080E9954.Fragment_0 on INFO HLIORemi.esp:0E9954 (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the one follower in HLIOStartingQuest (The Dwemer Specialist)'s aliases), placed in Silver-Blood Inn, "Absolutely not.": SetStage 5. Source: HLIO_TIF__071AA1E6.Fragment_0 on INFO HLIORemi.esp:1AA1E6 (HLIORemi.esp). **script**
- Dialogue with Remiel (named by the line before it (HLIORemi.esp:1AA1F2), GetIsID), placed in Silver-Blood Inn, "No way. Find someone else.": SetStage 5. Source: HLIO_TIF__071AA1EC.Fragment_0 on INFO HLIORemi.esp:1AA1EC (HLIORemi.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: HLIORemi.esp:0E4852 DNAM (LoreRim - Remi Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill Nimhe.", shown at stage 20. Source: HLIORemi.esp:0E4852 QOBJ 20. **files**
- Dialogue with Remiel, placed in Silver-Blood Inn: SetStage 20 (when: Nimhe, the Poisoned One stage == 10; the speaker is Remiel; GetInFaction CurrentFollowerFaction == 1). Reply: "Yes, excellent! Let's kill that spider and head into Nchuand-zel!" Source: HLIO_TIF__080EEA72.Fragment_0 on INFO HLIORemi.esp:0EEA72 (HLIORemi.esp). **script**

**Who and where**

- First objective: "Speak to Calcelmo about the spider in the excavation site.". Source: HLIORemi.esp:0E4852 QOBJ 10. **files**
- Target alias Calcelmo (forced): Calcelmo (forced reference, placed in Understone Keep). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Understone Keep: 6 doors, 0 locked. A door is a need only when every way in is locked. **files**

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

### dialogue INFO HLIORemi.esp:62E266

- Speaker: Remiel (Breton), placed in Silver-Blood Inn. Named by: the one follower in HLIOADQuest (Attuned Assassination)'s aliases.
- The player's prompt: "Maybe the Bard's College?".
- The reply: "Oh, you think so? They do have an awful lot of books, although I can't imagine they'd have something so complex as a manuscript on tonal magic." / "It doesn't hurt to look, though, does it? Shall we?".
- When it's offered: no conditions.
- What it does: SetStage 20 on HLIOADQuest (Attuned Assassination). Source: HLIO_TIF__0562E266.Fragment_0 on INFO HLIORemi.esp:62E266 (HLIORemi.esp); topic HLIOADQuestADStartb3. **script**
- In one sentence: Talk to Remiel (Breton) in Silver-Blood Inn and choose "Maybe the Bard's College?": SetStage 20 on HLIOADQuest (Attuned Assassination).

### dialogue INFO HLIORemi.esp:62E265

- Speaker: Remiel (Breton), placed in Silver-Blood Inn. Named by: the one follower in HLIOADQuest (Attuned Assassination)'s aliases.
- The player's prompt: "I don't think Skyrim is known for its libraries.".
- The reply: "Yes, well. That puts my idea at a stand-still. It's really not something that is intuitive to anyone other than the dwemer." / "If you happen to come across a library, do let me know, so I can look around.".
- When it's offered: no conditions.
- What it does: SetStage 10 on HLIOADQuest (Attuned Assassination). Source: HLIO_TIF__0562E265.Fragment_0 on INFO HLIORemi.esp:62E265 (HLIORemi.esp); topic HLIOADQuestADStartc3. **script**
- In one sentence: Talk to Remiel (Breton) in Silver-Blood Inn and choose "I don't think Skyrim is known for its libraries.": SetStage 10 on HLIOADQuest (Attuned Assassination).

### dialogue INFO HLIORemi.esp:62E26F

- Speaker: Remiel (Breton), placed in Silver-Blood Inn. Named by: the line before it (HLIORemi.esp:62E26A), GetIsID.
- The player's prompt: "We could try the Bard's College.".
- The reply: "Oh, you think so? They do have an awful lot of books, although I can't imagine they'd have something so complex as a manuscript on tonal magic." / "It doesn't hurt to look, though, does it? Shall we?".
- When it's offered: no conditions.
- What it does: SetStage 20 on HLIOADQuest (Attuned Assassination). Source: HLIO_TIF__0562E26F.Fragment_0 on INFO HLIORemi.esp:62E26F (HLIORemi.esp); topic HLIOADQuestADRemindb2. **script**
- In one sentence: Talk to Remiel (Breton) in Silver-Blood Inn and choose "We could try the Bard's College.": SetStage 20 on HLIOADQuest (Attuned Assassination).

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
