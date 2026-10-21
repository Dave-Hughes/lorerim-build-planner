# Start check: Thane of every hold (`thane`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Making Friends and Influencing People (`FavorJarlsMakeFriends`, Skyrim.esm:087E24, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:087E24 DNAM (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- Favor258 (Thane of Falkreath) at stage 10 calls SetStage 90. Source: QF_Favor258_000A34DE.fragment_0 (LoreRim - Dialogue Patch.esp).
- Favor257 (Thane of Winterhold) at stage 10 calls SetStage 80. Source: QF_Favor257_000A34D7.fragment_0 (LoreRim - Dialogue Patch.esp).
- Favor256 (Thane of the Pale) at stage 10 calls SetStage 70. Source: QF_Favor256_000A34D4.fragment_0 (LoreRim - Dialogue Patch.esp).
- Favor255 (Thane of Hjaalmarch) at stage 10 calls SetStage 60. Source: QF_Favor255_000A34CE.fragment_0 (LoreRim - Dialogue Patch.esp).
- Favor254 (Thane of Eastmarch) at stage 10 calls SetStage 50. Source: QF_Favor254_000A2CA6.fragment_0 (LoreRim - Dialogue Patch.esp).
- Favor253 (Thane of Whiterun) at stage 10 calls SetStage 40. Source: QF_Favor253_000A2C9E.fragment_0 (LoreRim - Dialogue Patch.esp).
- and 2 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Assist the people of The Rift (<Global=FriendsCountRift>/<Global=FriendsTotalMajorHold>)", shown at stage 20. Source: Skyrim.esm:087E24 QOBJ 20. **files**
- FavorJarlsMakeFriendsTrackEvent, a helper quest at stage 0 calls SetStage 15; FavorJarlsMakeFriendsTrackEvent is started by story manager node MakeFriendsNode (event: relationship change; GetInFaction JobJarlFaction == 0; GetInFaction JobJarlFaction == 0; GetEventData Skyrim.esm:000000 <= 0; fn403 >= 1 or fn403 >= 1). Source: QF_FavorJarlsMakeFriendsTrack_00087E28.fragment_0 on Skyrim.esm:087E28 (Unofficial Skyrim Special Edition Patch.esp), through FavorJarlsMakeFriends (Making Friends and Influencing People)'s trackfriend. **script**
- FavorJarlsMakeFriends (Making Friends and Influencing People) calls SetStage 15. Source: FavorJarlsMakeFriendsScript.TrackFriend on Skyrim.esm:087E24 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Assist the people of The Reach (<Global=FriendsCountReach>/<Global=FriendsTotalMajorHold>)". Source: Skyrim.esm:087E24 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: GetInFaction JobJarlFaction == 1. **files**

**Gives**: nothing on its completing stages.

## 2. Thane of the Reach (`Favor250`, Skyrim.esm:0A2C86, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias QuestGiver of Favor250 (Thane of the Reach) (run time)), "It will be my honor.": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: TIF__00064B5F.Fragment_0 on INFO Skyrim.esm:064B5F (Skyrim.esm). **script**
- Story manager node FavorChangeLocationMarkarth, event: change location; conditions up its parents: the place you enter is Markarth; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationMarkarth Skyrim.esm:0C2B6B (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=Questgiver>", shown at stage 20. Source: Skyrim.esm:0A2C86 QOBJ 15. **files**
- FavorJarlsMakeFriends (Making Friends and Influencing People) at stage 15 calls SetStage 20. Source: QF_FavorJarlsMakeFriends_00087E24.fragment_3 on Skyrim.esm:087E24 (Unofficial Skyrim Special Edition Patch.esp). **script**
- HousePurchase, a helper quest with WhiterunJarl, WhiterunSonsJarl, WindhelmEmpireJarl at stage 10 calls SetStage 15; HousePurchase is started by MQ101 (named "Unbound" in its record), a helper quest with Hadvar, Ralof, Alduin (SetStage 5); MQ101 (named "Unbound" in its record), a helper quest with Hadvar, Ralof, Alduin at stage 0 (SetStage 5); MQ00 (named "MQ Always On" in its record), a helper quest with Esbern, Delphine at stage 5 (Start). Source: QF_HousePurchase_000A7B33.fragment_6 on Skyrim.esm:0A7B33 (Unofficial Skyrim Special Edition Patch.esp). **script**
- APS_HouseMarkarth, a helper quest with Housecarl at stage 0 calls SetStage 15; APS_HouseMarkarth is started by nothing in the records or scripts (**unread**). Source: QF_APS_HouseMarkarth_063A5DD8.fragment_0 on AlternatePerspective.esp:3A5DD8 (AlternatePerspective.esp). **script**

**Who and where**

- First objective: "Purchase a house in Markarth". Source: Skyrim.esm:0A2C86 QOBJ 10. **files**
- Target alias Steward (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 3. Thane of Haafingar (`Favor252`, Skyrim.esm:0A2C9B, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias QuestGiver of Favor252 (Thane of Haafingar) (run time)), "It would be an honor.": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: TIF__0009407A.Fragment_0 on INFO Skyrim.esm:09407A (Skyrim.esm). **script**
- Story manager node FavorChangeLocatiomSolitude, event: change location; conditions up its parents: the place you enter is Solitude; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocatiomSolitude Skyrim.esm:06FD99 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=Questgiver>", shown at stage 20. Source: Skyrim.esm:0A2C9B QOBJ 15. **files**
- FavorJarlsMakeFriends (Making Friends and Influencing People) at stage 35 calls SetStage 20. Source: QF_FavorJarlsMakeFriends_00087E24.fragment_7 on Skyrim.esm:087E24 (Unofficial Skyrim Special Edition Patch.esp). **script**
- HousePurchase, a helper quest with WhiterunJarl, WhiterunSonsJarl, WindhelmEmpireJarl at stage 10 calls SetStage 15; HousePurchase is started by MQ101 (named "Unbound" in its record), a helper quest with Hadvar, Ralof, Alduin (SetStage 5); MQ101 (named "Unbound" in its record), a helper quest with Hadvar, Ralof, Alduin at stage 0 (SetStage 5); MQ00 (named "MQ Always On" in its record), a helper quest with Esbern, Delphine at stage 5 (Start). Source: QF_HousePurchase_000A7B33.fragment_3 on Skyrim.esm:0A7B33 (Unofficial Skyrim Special Edition Patch.esp). **script**
- APS_HouseSolitude, a helper quest with Housecarl at stage 0 calls SetStage 15; APS_HouseSolitude is started by nothing in the records or scripts (**unread**). Source: QF_APS_HouseSolitude_063A5DDA.fragment_0 on AlternatePerspective.esp:3A5DDA (AlternatePerspective.esp). **script**
- APS_HouseWindhelm, a helper quest with Housecarl at stage 0 calls SetStage 15; APS_HouseWindhelm is started by nothing in the records or scripts (**unread**). Source: QF_APS_HouseWinterhold_063A5DDB.fragment_0 on AlternatePerspective.esp:3A5DDB (AlternatePerspective.esp). **script**

**Who and where**

- First objective: "Purchase a house in Solitude". Source: Skyrim.esm:0A2C9B QOBJ 10. **files**
- Target alias Steward (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 4. Thane of Whiterun (`Favor253`, Skyrim.esm:0A2C9E, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias QuestGiver of Favor253 (Thane of Whiterun) (run time)), "It would be an honor.": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: TIF__00094053.Fragment_0 on INFO Skyrim.esm:094053 (Skyrim.esm). **script**
- Story manager node FavorChangeLocationWhiterun, event: change location; conditions up its parents: the place you enter is Whiterun; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWhiterun Skyrim.esm:0C0609 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=QuestGiver>", shown at stage 20. Source: Skyrim.esm:0A2C9E QOBJ 15. **files**
- FavorJarlsMakeFriends (Making Friends and Influencing People) at stage 45 calls SetStage 20. Source: QF_FavorJarlsMakeFriends_00087E24.fragment_9 on Skyrim.esm:087E24 (Unofficial Skyrim Special Edition Patch.esp). **script**
- HousePurchase, a helper quest with WhiterunJarl, WhiterunSonsJarl, WindhelmEmpireJarl at stage 10 calls SetStage 15; HousePurchase is started by MQ101 (named "Unbound" in its record), a helper quest with Hadvar, Ralof, Alduin (SetStage 5); MQ101 (named "Unbound" in its record), a helper quest with Hadvar, Ralof, Alduin at stage 0 (SetStage 5); MQ00 (named "MQ Always On" in its record), a helper quest with Esbern, Delphine at stage 5 (Start). Source: QF_HousePurchase_000A7B33.fragment_0 on Skyrim.esm:0A7B33 (Unofficial Skyrim Special Edition Patch.esp). **script**
- APS_HouseWhiterun, a helper quest with Housecarl at stage 0 calls SetStage 15; APS_HouseWhiterun is started by nothing in the records or scripts (**unread**). Source: QF_APS_HouseWhiterun_06396AD7.fragment_0 on AlternatePerspective.esp:396AD7 (AlternatePerspective.esp). **script**

**Who and where**

- First objective: "Purchase a house in Whiterun". Source: Skyrim.esm:0A2C9E QOBJ 10. **files**
- Target alias Steward (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 5. Thane of Eastmarch (`Favor254`, Skyrim.esm:0A2CA6, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias QuestGiver of Favor254 (Thane of Eastmarch) (run time)), "It will be an honor.": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: TIF__000E0B8D.Fragment_0 on INFO Skyrim.esm:0E0B8D (Skyrim.esm). **script**
- Dialogue with someone the line does not name (named by alias QuestGiver of Favor254 (Thane of Eastmarch) (run time)), "It will be an honor.": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: TIF__00094043.Fragment_0 on INFO Skyrim.esm:094043 (Skyrim.esm). **script**
- Story manager node FavorChangeLocationWindhelm, event: change location; conditions up its parents: the place you enter is Windhelm; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWindhelm Skyrim.esm:03F4C4 (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=QuestGiver>", shown at stage 20. Source: Skyrim.esm:0A2CA6 QOBJ 15. **files**
- FavorJarlsMakeFriends (Making Friends and Influencing People) at stage 55 calls SetStage 20. Source: QF_FavorJarlsMakeFriends_00087E24.fragment_11 on Skyrim.esm:087E24 (Unofficial Skyrim Special Edition Patch.esp). **script**
- HousePurchase, a helper quest with WhiterunJarl, WhiterunSonsJarl, WindhelmEmpireJarl at stage 10 calls SetStage 15; HousePurchase is started by MQ101 (named "Unbound" in its record), a helper quest with Hadvar, Ralof, Alduin (SetStage 5); MQ101 (named "Unbound" in its record), a helper quest with Hadvar, Ralof, Alduin at stage 0 (SetStage 5); MQ00 (named "MQ Always On" in its record), a helper quest with Esbern, Delphine at stage 5 (Start). Source: QF_HousePurchase_000A7B33.fragment_7 on Skyrim.esm:0A7B33 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Purchase a house in Windhelm". Source: Skyrim.esm:0A2CA6 QOBJ 10. **files**
- Target alias Steward (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 6. Thane of Hjaalmarch (`Favor255`, Skyrim.esm:0A34CE, LoreRim - Dialogue Patch.esp)

**Started by**

- FavorJarlsMakeFriends (Making Friends and Influencing People) at stage 65 calls SetStage 20. Source: QF_FavorJarlsMakeFriends_00087E24.fragment_13 on Skyrim.esm:087E24 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name (named by alias QuestGiver of Favor255 (Thane of Hjaalmarch) (run time)), "It would be an honor.": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: TIF__0009404A.Fragment_0 on INFO Skyrim.esm:09404A (Skyrim.esm). **script**
- Story manager node FavorChangeLocationMorthal, event: change location; conditions up its parents: the place you enter is Morthal; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationMorthal Skyrim.esm:0940DB (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Return to <Alias.ShortName=QuestGiver>". Source: Skyrim.esm:0A34CE QOBJ 15. **files**
- Target alias QuestGiver (run time): Jarl (put there by a script (ForceRefTo)). **script**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 7. Thane of the Pale (`Favor256`, Skyrim.esm:0A34D4, LoreRim - Dialogue Patch.esp)

**Started by**

- FavorJarlsMakeFriends (Making Friends and Influencing People) at stage 75 calls SetStage 20. Source: QF_FavorJarlsMakeFriends_00087E24.fragment_15 on Skyrim.esm:087E24 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name (named by alias QuestGiver of Favor256 (Thane of the Pale) (run time)), "It would be an honor.": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: TIF__00090DFD.Fragment_0 on INFO Skyrim.esm:090DFD (Skyrim.esm). **script**
- Story manager node FavorChangeLocationDawnstar, event: change location; conditions up its parents: the place you enter is Dawnstar; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationDawnstar Skyrim.esm:090E34 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Return to <Alias.ShortName=QuestGiver>". Source: Skyrim.esm:0A34D4 QOBJ 15. **files**
- Target alias QuestGiver (run time): Jarl (put there by a script (ForceRefTo)). **script**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 8. Thane of Winterhold (`Favor257`, Skyrim.esm:0A34D7, LoreRim - Dialogue Patch.esp)

**Started by**

- FavorJarlsMakeFriends (Making Friends and Influencing People) at stage 85 calls SetStage 20. Source: QF_FavorJarlsMakeFriends_00087E24.fragment_17 on Skyrim.esm:087E24 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name (named by alias QuestGiver of Favor257 (Thane of Winterhold) (run time)), "It would be an honor.": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: TIF__00094078.Fragment_0 on INFO Skyrim.esm:094078 (Skyrim.esm). **script**
- Story manager node FavorChangeLocationWinterhold, event: change location; conditions up its parents: the place you enter is Winterhold; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWinterhold Skyrim.esm:0940D9 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Return to <Alias.ShortName=QuestGiver>". Source: Skyrim.esm:0A34D7 QOBJ 15. **files**
- Target alias QuestGiver (run time): Jarl (put there by a script (ForceRefTo)). **script**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 9. Thane of Falkreath (`Favor258`, Skyrim.esm:0A34DE, LoreRim - Dialogue Patch.esp)

**Started by**

- FavorJarlsMakeFriends (Making Friends and Influencing People) at stage 95 calls SetStage 20. Source: QF_FavorJarlsMakeFriends_00087E24.fragment_19 on Skyrim.esm:087E24 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name (named by alias QuestGiver of Favor258 (Thane of Falkreath) (run time)), "It would be an honor.": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: TIF__00079AD8.Fragment_0 on INFO Skyrim.esm:079AD8 (Skyrim.esm). **script**
- Story manager node FavorChangeLocationFalkreath, event: change location; conditions up its parents: the place you enter is Falkreath; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationFalkreath Skyrim.esm:0705BC (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Return to <Alias.ShortName=QuestGiver>". Source: Skyrim.esm:0A34DE QOBJ 15. **files**
- Target alias QuestGiver (run time): Siddgeir (put there by a script (ForceRefTo)). **script**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 10. I Done Got Thaned! (`FreeformRiftenThane`, Skyrim.esm:065BDF, LoreRim - Weapons.esp)

**Started by**

- FreeformRiften22 (named "Stabilized" in its record), a helper quest with FFRiften22Shadr, FFRiften22SapphireAlias at stage 200 calls SetStage 10; FreeformRiften22 is started by DialogueRiftenSS02 (named "Riften Scripted Scene Bridge" in its record), a helper quest with SapphireAlias, ShadrAlias at stage 20 (SetStage 10); the start-game flag. Source: QF_FreeformRiften22_000C1E07.fragment_3 on Skyrim.esm:0C1E07 (Skyrim.esm), through FreeformRiftenThane (I Done Got Thaned!)'s thanecheck. **script**
- FreeformRiften21 (named "Toying With The Dead" in its record), a helper quest with FFRiften21Vekel at stage 200 calls SetStage 10; FreeformRiften21 is started by the start-game flag. Source: QF_FreeformRiften21_0009F179.fragment_9 on Skyrim.esm:09F179 (Toying With The Dead mQE.esp), through FreeformRiftenThane (I Done Got Thaned!)'s thanecheck. **script**
- FreeformRiften20 (named "The Raid" in its record), a helper quest with FFRiften20Wujeeta, FFRiften20LailaJarlAlias, FFRiften20MavenJarlAlias at stage 200 calls SetStage 10; FreeformRiften20 is started by FreeformRiften12 (named "Helping Hand" in its record), a helper quest with FFRiften12WujeetaAlias at stage 200 (SetStage 10). Source: QF_FreeformRiften20_00085D40.fragment_9 on Skyrim.esm:085D40 (TheChoiceIsYours.esp), through FreeformRiftenThane (I Done Got Thaned!)'s thanecheck. **script**
- FreeformRiften19 (named "Bloody Nose" in its record), a helper quest with FFRiften19HofgrirAlias at stage 200 calls SetStage 10; FreeformRiften19 is started by the start-game flag. Source: QF_FreeformRiften19_00065C30.fragment_9 on Skyrim.esm:065C30 (Skyrim.esm), through FreeformRiftenThane (I Done Got Thaned!)'s thanecheck. **script**
- FreeformRiften18 (named "Ringmaker" in its record), a helper quest with FFRiften18MadesiAlias at stage 200 calls SetStage 10; FreeformRiften18 is started by the start-game flag. Source: QF_FreeformRiften18_0005B3A5.fragment_9 on Skyrim.esm:05B3A5 (Unofficial Skyrim Special Edition Patch.esp), through FreeformRiftenThane (I Done Got Thaned!)'s thanecheck. **script**
- FreeformRiften17 (named "Truth Ore Consequences" in its record), a helper quest with FFRiften17HafjorgAlias, FFRiften17FilnjarAlias at stage 200 calls SetStage 10; FreeformRiften17 is started by the start-game flag. Source: QF_FreeformRiften17_0005B2DE.fragment_3 on Skyrim.esm:05B2DE (Skyrim.esm), through FreeformRiftenThane (I Done Got Thaned!)'s thanecheck. **script**
- FreeformRiften16 (named "Bring It!" in its record), a helper quest with FFRiften16HarraldAlias, FFRiften16BalimundAlias at stage 200 calls SetStage 10; FreeformRiften16 is started by the start-game flag. Source: QF_FreeformRiften16_000557F3.fragment_3 on Skyrim.esm:0557F3 (Big Tweaks.esp), through FreeformRiftenThane (I Done Got Thaned!)'s thanecheck. **script**
- FreeformRiften15 (named "Special Delivery" in its record), a helper quest with FFRiften15Kleppr, FFRiften15BolliAlias at stage 200 calls SetStage 10; FreeformRiften15 is started by the start-game flag. Source: QF_FreeformRiften15_000557E9.fragment_3 on Skyrim.esm:0557E9 (Skyrim.esm), through FreeformRiftenThane (I Done Got Thaned!)'s thanecheck. **script**
- and 16 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Purchase Honeyside from Riften's Steward", shown at stage 20. Source: Skyrim.esm:065BDF QOBJ 20. **files**
- FavorJarlsMakeFriends (Making Friends and Influencing People) at stage 25 calls SetStage 20. Source: QF_FavorJarlsMakeFriends_00087E24.fragment_5 on Skyrim.esm:087E24 (Unofficial Skyrim Special Edition Patch.esp). **script**
- HousePurchase, a helper quest with WhiterunJarl, WhiterunSonsJarl, WindhelmEmpireJarl at stage 10 calls SetStage 15; HousePurchase is started by MQ101 (named "Unbound" in its record), a helper quest with Hadvar, Ralof, Alduin (SetStage 5); MQ101 (named "Unbound" in its record), a helper quest with Hadvar, Ralof, Alduin at stage 0 (SetStage 5); MQ00 (named "MQ Always On" in its record), a helper quest with Esbern, Delphine at stage 5 (Start). Source: QF_HousePurchase_000A7B33.fragment_5 on Skyrim.esm:0A7B33 (Unofficial Skyrim Special Edition Patch.esp). **script**
- APS_HouseRiften, a helper quest with Housecarl at stage 0 calls SetStage 15; APS_HouseRiften is started by nothing in the records or scripts (**unread**). Source: QF_APS_HouseRiften_063A5DD9.fragment_0 on AlternatePerspective.esp:3A5DD9 (AlternatePerspective.esp). **script**
- Dialogue with Laila Law-Giver, placed in Mistveil Keep, Riften Mistveil Keep, "I would be honored to accept.": SetStage 20 (when: the speaker is Laila Law-Giver; GetInFaction JobJarlFaction == 1; I Done Got Thaned! stage == 10; fn629 == 0; fn629 == 1). Reply: "Before I can present you with the title, there's but a single requirement you must fulfill." Source: TIF__00065AF6.Fragment_0 on INFO Skyrim.esm:065AF6 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Maven Black-Briar, placed in Black-Briar Manor, "I would be honored to accept.": SetStage 20 (when: the speaker is Maven Black-Briar; GetInFaction JobJarlFaction == 1; I Done Got Thaned! stage == 10; fn629 == 0; fn629 == 1). Reply: "Ah ah ah. Not so fast, there's a matter of residence to be discussed." Source: TIF__00065AF7.Fragment_0 on INFO Skyrim.esm:065AF7 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Speak to the Jarl of Riften". Source: Skyrim.esm:065BDF QOBJ 10. **files**
- Target alias FFRiftenThaneLailaJarlAlias (unique): Laila Law-Giver (unique actor, placed in Mistveil Keep, Riften Mistveil Keep). **files**
- Target alias FFRiftenThaneMavenJarlAlias (unique): Maven Black-Briar (unique actor, placed in Black-Briar Manor). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Mistveil Keep, Riften Mistveil Keep: 3 doors, 0 locked; Black-Briar Manor: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

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
