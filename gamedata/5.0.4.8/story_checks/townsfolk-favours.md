# Start check: Favours for townsfolk (`townsfolk-favours`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Delivery (`Favor001AngasMill`, Favor Quests Seperated.esp:000835, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Aeri, placed in Aeri's House, "Sure. I'd be glad to help.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Aeri). Source: TIF__0004037F.Fragment_0 on INFO Favor Quests Seperated.esp:000834 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationAngasMill, event: change location; conditions up its parents: the place you enter is Anga's Mill; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationAngasMill Skyrim.esm:090E55 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:000835 QOBJ 10. **files**
- Target alias Target (unique): Skald the Elder (unique actor, placed in The White Hall). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The White Hall: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Delivery (`Favor001DarkwaterCrossing`, Favor Quests Seperated.esp:000842, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Sondas Drenim, placed in Goldenrock Mine, "I could deliver your message for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Sondas Drenim). Source: TIF__00068FE9.Fragment_0 on INFO Favor Quests Seperated.esp:000846 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationDarkwaterCrossing, event: change location; conditions up its parents: the place you enter is Darkwater Crossing; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationDarkwaterCrossing Skyrim.esm:068FFC (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:000842 QOBJ 10. **files**
- Target alias Target (unique): Quintus Navale (unique actor, placed in The White Phial). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The White Phial: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. Delivery (`Favor001Falkreath`, Favor Quests Seperated.esp:000847, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Thadgeir, placed in Dengeir's House, Dengeir's Hall, "I'd be honored.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Thadgeir). Source: TIF__00090DFB.Fragment_0 on INFO Favor Quests Seperated.esp:00084A (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationFalkreath, event: change location; conditions up its parents: the place you enter is Falkreath; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationFalkreath Skyrim.esm:0705BC (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:000847 QOBJ 10. **files**
- Target alias Target (unique): Runil (unique actor, placed in Hall of the Dead, House of Arkay). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of the Dead, House of Arkay: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 4. Delivery (`Favor001Markarth`, Favor Quests Seperated.esp:000838, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Banning, placed in Markarth Stables, "I could deliver that for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Banning). Source: TIF__0004444B.Fragment_0 on INFO Favor Quests Seperated.esp:00083A (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationMarkarth, event: change location; conditions up its parents: the place you enter is Markarth; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationMarkarth Skyrim.esm:0C2B6B (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:000838 QOBJ 10. **files**
- Target alias Target (unique): Voada (unique actor, placed in Understone Keep). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Understone Keep: 6 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 5. Delivery (`Favor001Morthal`, Favor Quests Seperated.esp:00083D, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Idgrod the Younger, placed in Highmoon Hall, "I'd be glad to help.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Idgrod the Younger). Source: TIF__0009408B.Fragment_0 on INFO Favor Quests Seperated.esp:000840 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationMorthal, event: change location; conditions up its parents: the place you enter is Morthal; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationMorthal Skyrim.esm:0940DB (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:00083D QOBJ 10. **files**
- Target alias Target (unique): Danica Pure-Spring (unique actor, placed in Temple of Kynareth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Kynareth: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 6. Delivery (`Favor001Windhelm`, Favor Quests Seperated.esp:00082D, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Adonato Leotelli, placed in Candlehearth Hall, "I'll deliver the book for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Adonato Leotelli). Source: TIF__0007043E.Fragment_0 on INFO Favor Quests Seperated.esp:00082F (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWindhelm, event: change location; conditions up its parents: the place you enter is Windhelm; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWindhelm Skyrim.esm:03F4C4 (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:00082D QOBJ 10. **files**
- Target alias Target (forced): Giraud Gemane (forced reference, placed in Bards College, The Bards College). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Bards College, The Bards College: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 7. Delivery (`Favor001`, Skyrim.esm:0403B0, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Aeri, placed in Aeri's House, "Sure. I'd be glad to help.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Aeri; global TRUEGlobal == 0 (now 1)). Source: TIF__0004037F.Fragment_0 on INFO Skyrim.esm:04037F (Favor Quests Seperated.esp). **script**
- Dialogue with Thadgeir, placed in Dengeir's House, Dengeir's Hall, "I'd be honored.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Thadgeir; global TRUEGlobal == 0 (now 1)). Source: TIF__00090DFB.Fragment_0 on INFO Skyrim.esm:090DFB (Favor Quests Seperated.esp). **script**
- Dialogue with Adonato Leotelli, placed in Candlehearth Hall, "I'll deliver the book for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Adonato Leotelli; global TRUEGlobal == 0 (now 1)). Source: TIF__0007043E.Fragment_0 on INFO Skyrim.esm:07043E (Favor Quests Seperated.esp). **script**
- Dialogue with Banning, placed in Markarth Stables, "I could deliver that for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Banning; global TRUEGlobal == 0 (now 1)). Source: TIF__0004444B.Fragment_0 on INFO Skyrim.esm:04444B (Favor Quests Seperated.esp). **script**
- Dialogue with Sondas Drenim, placed in Goldenrock Mine, "I could deliver your message for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Sondas Drenim; global TRUEGlobal == 0 (now 1)). Source: TIF__00068FE9.Fragment_0 on INFO Skyrim.esm:068FE9 (Favor Quests Seperated.esp). **script**
- Dialogue with Idgrod the Younger, placed in Highmoon Hall, "I'd be glad to help.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Idgrod the Younger; global TRUEGlobal == 0 (now 1)). Source: TIF__0009408B.Fragment_0 on INFO Skyrim.esm:09408B (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Skyrim.esm:0403B0 QOBJ 10. **files**
- Target alias Target (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: global TRUEGlobal == 0 (now 1). **files**
- Global TRUEGlobal: record 1.0 (Skyrim.esm). **files**

**Gives**: nothing on its completing stages.

## 8. A Few Words with You (`Favor013`, Skyrim.esm:0CA209, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Octieve San, placed in Evette San's House, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Octieve San; the speaker is the one in alias QuestGiver; global TRUEGlobal == 0 (now 1)). Source: TIF__000CA1FA.Fragment_0 on INFO Skyrim.esm:0CA1FA (Favor Quests Seperated.esp). **script**
- Dialogue with Carlotta Valentia, placed in Carlotta Valentia's House, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Carlotta Valentia; the speaker is the one in alias QuestGiver; global TRUEGlobal == 0 (now 1)). Source: TIF__0006F7EF.Fragment_0 on INFO Skyrim.esm:06F7EF (Favor Quests Seperated.esp). **script**
- Dialogue with Scouts-Many-Marshes, placed in Argonian Assemblage, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Scouts-Many-Marshes; the speaker is the one in alias QuestGiver; global TRUEGlobal == 0 (now 1)). Source: TIF__0003F085.Fragment_0 on INFO Skyrim.esm:03F085 (Favor Quests Seperated.esp). **script**
- Dialogue with Omluag, placed in The Warrens, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Omluag; the speaker is the one in alias QuestGiver; GetDistance Skyrim.esm:0198FF >= ANDR_DialogueDistanceCheck_MulushSmelterWorkers (now 2048); global TRUEGlobal == 0 (now 1)). Source: TIF__00055115.Fragment_0 on INFO Skyrim.esm:055115 (Narrative Gameplay Consistent Dialogue Tweaks - Favor Quests Separated Patch.esp). **script**
- Dialogue with Iddra, placed in Braidwood Inn, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Iddra; the speaker is the one in alias QuestGiver; global TRUEGlobal == 0 (now 1)). Source: TIF__00068FDF.Fragment_0 on INFO Skyrim.esm:068FDF (Favor Quests Seperated.esp). **script**
- Dialogue with Haran, placed in The Frozen Hearth, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Haran; the speaker is the one in alias QuestGiver; global TRUEGlobal == 0 (now 1)). Source: TIF__00094048.Fragment_0 on INFO Skyrim.esm:094048 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> that <Alias.ShortName=Target> is taken care of", shown at stage 15. Source: Skyrim.esm:0CA209 QOBJ 15. **files**
- Dialogue with Mikael, placed in The Bannered Mare, "Leave her alone, or else. (Intimidate)": SetStage 15 (when: the speaker is Mikael; the speaker is the one in alias target; fn655 == 1; global TRUEGlobal == 0 (now 1)). Reply: "Whoa. Hey there. I didn't mean to make you upset. On my honor, Carlotta won't have to worry about me again." Source: TIF__000CA1F5.Fragment_1 on INFO Skyrim.esm:0CA1F5 (Favor Quests Seperated.esp). **script**
- Dialogue with Torbjorn Shatter-Shield, placed in House of Clan Shatter-Shield, "Pay them, or things will get ugly. (Intimidate)": SetStage 15 (when: the speaker is Torbjorn Shatter-Shield; the speaker is the one in alias target; fn655 == 1; global TRUEGlobal == 0 (now 1)). Reply: "Easy. Maybe I was being too harsh on them. By the honor of Clan Shatter-Shield, they will be paid fairly. You have my word." Source: TIF__0003F067.Fragment_1 on INFO Skyrim.esm:03F067 (Favor Quests Seperated.esp). **script**
- Dialogue with Mulush gro-Shugurz, placed in Smelter Overseer's House, "Then we do this the hard way. (Intimidate)": SetStage 15 (when: the speaker is Mulush gro-Shugurz; the speaker is the one in alias target; fn655 == 1; global TRUEGlobal == 0 (now 1)). Reply: "Wait. You win. I'll ease off on the beatings, just leave me alone." Source: TIF__00055512.Fragment_1 on INFO Skyrim.esm:055512 (Favor Quests Seperated.esp). **script**
- Dialogue with Irnskar Ironhand, placed in Bryling's House, "Lay off the old man. Now. (Intimidate)": SetStage 15 (when: the speaker is Irnskar Ironhand; the speaker is the one in alias target; fn655 == 1; global TRUEGlobal == 0 (now 1)). Reply: "All right, all right. Have it your way. Tell Octieve to forget about the debt." Source: TIF__0006F955.Fragment_1 on INFO Skyrim.esm:06F955 (Favor Quests Seperated.esp). **script**
- Dialogue with Roggi Knot-Beard, placed in Steamscorch Mine, Steamscorch Gully Mine, "Do I need to beat some sense into you? (Intimidate)": SetStage 15 (when: the speaker is Roggi Knot-Beard; the speaker is the one in alias target; fn655 == 1; global TRUEGlobal == 0 (now 1)). Reply: "What? No. All right. I won't worry about the coin anymore, just stop giving me that look." Source: TIF__00068FD3.Fragment_1 on INFO Skyrim.esm:068FD3 (Favor Quests Seperated.esp). **script**
- Dialogue with Ranmir, placed in Birna's Oddments, Ranmir's House, "Do it, or things get ugly. (Intimidate)": SetStage 15 (when: the speaker is Ranmir; the speaker is the one in alias target; fn655 == 1; global TRUEGlobal == 0 (now 1)). Reply: "Calm down there, friend. I'll pay! Tell Haran that she'll have her gold." Source: TIF__000940CB.Fragment_1 on INFO Skyrim.esm:0940CB (Favor Quests Seperated.esp). **script**
- Dialogue with Mikael, placed in The Bannered Mare, "Maybe we can come to an understanding. (<BribeCost> gold)": SetStage 15 (when: fn654 == 1; the speaker is Mikael; the speaker is the one in alias target; global TRUEGlobal == 0 (now 1)). Reply: "Bribing me? Well, a bard does need to eat. On my ancestor's honor, I won't trouble sweet Carlotta again." Source: TIF__000CA204.Fragment_1 on INFO Skyrim.esm:0CA204 (Favor Quests Seperated.esp). **script**
- Dialogue with Torbjorn Shatter-Shield, placed in House of Clan Shatter-Shield, "What if I invest in their future? (<BribeCost> gold)": SetStage 15 (when: fn654 == 1; the speaker is Torbjorn Shatter-Shield; the speaker is the one in alias target; global TRUEGlobal == 0 (now 1)). Reply: "Paying the wages yourself? Well, I won't say no to gold. By my family's honor, this money will go to the Argonian workers." Source: TIF__0003F160.Fragment_1 on INFO Skyrim.esm:03F160 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Talk to <Alias.ShortName=Target> about <Alias.ShortName=Questgiver>". Source: Skyrim.esm:0CA209 QOBJ 10. **files**
- Target alias target (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 9. Some Light Theft (`Favor018`, Skyrim.esm:03F46A, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Stands-In-Shallows, placed in Argonian Assemblage, "I'll get it for you.": SetStage 10 (when: the speaker is Stands-In-Shallows; the speaker is the one in alias Questgiver; global TRUEGlobal == 0 (now 1)). Source: TIF__0003F066.Fragment_0 on INFO Skyrim.esm:03F066 (Favor Quests Seperated.esp). **script**
- Dialogue with Malur Seloth, placed in Stonecold Fortress, Jarl's Longhouse, "I'll get it for you.": SetStage 10 (when: the speaker is Malur Seloth; the speaker is the one in alias Questgiver; global TRUEGlobal == 0 (now 1)). Source: TIF__0009404B.Fragment_0 on INFO Skyrim.esm:09404B (Favor Quests Seperated.esp). **script**
- Dialogue with Dengeir of Stuhn, placed in Dengeir's House, Dengeir's Hall, "It will be done.": SetStage 10 (when: the speaker is Dengeir of Stuhn; the speaker is the one in alias Questgiver; global TRUEGlobal == 0 (now 1)). Source: TIF__000D9392.Fragment_0 on INFO Skyrim.esm:0D9392 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Bring the <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Skyrim.esm:03F46A QOBJ 15. **files**
- Favor018 (Some Light Theft) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Skyrim.esm:03F46A (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Steal the <Alias=QuestItem> for <Alias.ShortName=QuestGiver>". Source: Skyrim.esm:03F46A QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: global TRUEGlobal == 0 (now 1). **files**
- Global TRUEGlobal: record 1.0 (Skyrim.esm). **files**

**Gives**: nothing on its completing stages.

## 10. That Was Always There (`Favor019`, Skyrim.esm:03F4EC, Skyrim.esm)

**Started by**

- Dialogue with Revyn Sadri, placed in Sadri's Used Wares, "I could return the ring for you.": SetStage 10 (when: the speaker is Revyn Sadri; the speaker is the one in alias Questgiver). Source: TIF__00040389.Fragment_0 on INFO Skyrim.esm:040389 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Story manager node FavorChangeLocationWindhelm, event: change location; conditions up its parents: the place you enter is Windhelm; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWindhelm Skyrim.esm:03F4C4 (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> <Alias=QuestItem> has been planted", shown at stage 15. Source: Skyrim.esm:03F4EC QOBJ 15. **files**
- Favor019 (That Was Always There) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Skyrim.esm:03F4EC (Skyrim.esm). **script**

**Who and where**

- First objective: "Plant <Alias=QuestItem> in <Alias=TargetHouse>". Source: Skyrim.esm:03F4EC QOBJ 10. **files**
- Target alias TargetHouseContainer (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 11. Rare Gifts (`Favor110`, Skyrim.esm:0CA439, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Rustleif, placed in Rustleif's House, "If I see it, I'll bring it to you.": SetStage 10 (when: the speaker is Rustleif; the speaker is the one in alias Questgiver; global TRUEGlobal == 0 (now 1)). Source: TIF__000CA436.Fragment_0 on INFO Skyrim.esm:0CA436 (Favor Quests Seperated.esp). **script**
- Dialogue with Siddgeir, placed in Hakkvild's High Hall, Jarl's Longhouse, "I'll bring it to you.": SetStage 10 (when: the speaker is Siddgeir; the speaker is the one in alias Questgiver; global TRUEGlobal == 0 (now 1)). Source: TIF__00090DFA.Fragment_0 on INFO Skyrim.esm:090DFA (Favor Quests Seperated.esp). **script**
- Dialogue with Ysolda, placed in Ysolda's House, "Maybe I can help you.": SetStage 10 (when: the speaker is Ysolda; the speaker is the one in alias Questgiver; global TRUEGlobal == 0 (now 1)). Source: TIF__00079ADC.Fragment_0 on INFO Skyrim.esm:079ADC (Favor Quests Seperated.esp). **script**
- Dialogue with Lami, placed in Jorgen and Lami's House, "If I find a copy, I'll bring it to you.": SetStage 10 (when: the speaker is Lami; the speaker is the one in alias Questgiver; global TRUEGlobal == 0 (now 1)). Source: TIF__000940C8.Fragment_0 on INFO Skyrim.esm:0940C8 (Favor Quests Seperated.esp). **script**
- Dialogue with Captain Aldis, placed in Castle Dour, "If I find a copy, I'll bring it to you.": SetStage 10 (when: the speaker is Captain Aldis; the speaker is the one in alias Questgiver; global TRUEGlobal == 0 (now 1)). Source: TIF__000940C9.Fragment_0 on INFO Skyrim.esm:0940C9 (Favor Quests Seperated.esp). **script**
- Dialogue with Torbjorn Shatter-Shield, placed in House of Clan Shatter-Shield, "If I find one, I'll bring it to you.": SetStage 10 (when: the speaker is Torbjorn Shatter-Shield; the speaker is the one in alias Questgiver; global TRUEGlobal == 0 (now 1)). Source: TIF__000AB818.Fragment_0 on INFO Skyrim.esm:0AB818 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring one <Alias=QuestItem> to <Alias.ShortName=QuestGiver>". Source: Skyrim.esm:0CA439 QOBJ 10. **files**
- Target alias Questgiver (run time): nothing the records or scripts name. **files**
- Target alias AlchemyBook (forced): Song of the Alchemists (forced reference, placed in Bards College, The Bards College). **files**
- Target alias BlockBook (forced): The Mirror (forced reference, placed in Palace of the Kings, Upstairs, Palace of the Kings). **files**
- Target alias OneHandBook (forced): Night Falls on Sentinel (forced reference, placed in Swindler's Den). **files**

**Needs**

- Its own conditions: global TRUEGlobal == 0 (now 1). **files**
- Ways in: Bards College, The Bards College: 4 doors, 0 locked; Palace of the Kings, Upstairs, Palace of the Kings: 1 door, 0 locked; Swindler's Den: 1 door, 0 locked. A door is a need only when every way in is locked. **files**
- Global TRUEGlobal: record 1.0 (Skyrim.esm). **files**

**Gives**: nothing on its completing stages.

## 12. Dungeon Delving (Bandits) (`Favor204`, Skyrim.esm:07105B, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Amren, placed in Amren's House, "Do you need help finding the sword?": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Amren). Source: TIF__000E1FD7.Fragment_0 on INFO Skyrim.esm:0E1FD7 (Favor Quests Seperated.esp). **script**
- Dialogue with Shahvee, placed in Argonian Assemblage, "I could find your amulet for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Shahvee). Source: TIF__000BFA08.Fragment_0 on INFO Skyrim.esm:0BFA08 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationMarkarth, event: change location; conditions up its parents: the place you enter is Markarth; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationMarkarth Skyrim.esm:0C2B6B (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Skyrim.esm:07105B QOBJ 15. **files**
- Favor204 (Dungeon Delving (Bandits)) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Skyrim.esm:07105B (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Find <Alias=QuestItem> inside <Alias=Dungeon>". Source: Skyrim.esm:07105B QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: global TRUEGlobal == 0 (now 1). **files**
- Global TRUEGlobal: record 1.0 (Skyrim.esm). **files**

**Gives**: nothing on its completing stages.

## 13. Dungeon Delving (Caves) (`Favor205`, Skyrim.esm:06FE37, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Frida, placed in The Mortar and Pestle, "I could find that ring for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Frida; global TRUEGlobal == 0 (now 1)). Source: TIF__0006FC72.Fragment_0 on INFO Skyrim.esm:06FC72 (Favor Quests Seperated.esp). **script**
- Dialogue with Runil, placed in Hall of the Dead, House of Arkay, "I'll do it.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Runil; global TRUEGlobal == 0 (now 1)). Source: TIF__00090E01.Fragment_0 on INFO Skyrim.esm:090E01 (Favor Quests Seperated.esp). **script**
- Dialogue with Noster Eagle-Eye, placed in The Winking Skeever, "What if I could find that helmet for you?": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Noster Eagle-Eye; global TRUEGlobal == 0 (now 1)). Source: TIF__0007044D.Fragment_0 on INFO Skyrim.esm:07044D (Favor Quests Seperated.esp). **script**
- Dialogue with Roggi Knot-Beard, placed in Steamscorch Mine, Steamscorch Gully Mine, "Maybe I can find that shield for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Roggi Knot-Beard; global TRUEGlobal == 0 (now 1)). Source: TIF__01002DB1.Fragment_0 on INFO TheChoiceIsYours.esp:002DB1 (Favor Quests Separated - The Choice Is Yours Patch.esp). **script**
- Dialogue with Oengul War-Anvil, placed in Blacksmith Quarters, Aretino Residence, "I can get the sword for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Oengul War-Anvil; global TRUEGlobal == 0 (now 1)). Source: TIF__01002DB2.Fragment_0 on INFO TheChoiceIsYours.esp:002DB2 (Favor Quests Separated - The Choice Is Yours Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Skyrim.esm:06FE37 QOBJ 15. **files**
- Favor205 (Dungeon Delving (Caves)) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Skyrim.esm:06FE37 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Find <Alias=QuestItem> inside <Alias=Dungeon>". Source: Skyrim.esm:06FE37 QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: global TRUEGlobal == 0 (now 1). **files**
- Global TRUEGlobal: record 1.0 (Skyrim.esm). **files**

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | To get into Favours for townsfolk: ask Aeri in Aeri's House "Sure. I'd be glad to help." (the speaker is the one in alias Questgiver; the speaker is Aeri), which starts Delivery. |

## Routes into the first quest from outside the starts

### dialogue INFO Favor Quests Seperated.esp:000834

- Speaker: Aeri (Nord), placed in Aeri's House. Named by: GetIsID.
- The player's prompt: "Sure. I'd be glad to help.".
- The reply: "Thanks.".
- When it's offered: the speaker is the one in alias Questgiver; the speaker is Aeri.
- What it does: SetStage 10 on Favor001AngasMill (Delivery). Source: TIF__0004037F.Fragment_0 on INFO Favor Quests Seperated.esp:000834 (Favor Quests Seperated.esp); topic Favor001QuestAcceptAngasMill. **script**
- In one sentence: Talk to Aeri (Nord) in Aeri's House and choose "Sure. I'd be glad to help.", when the speaker is the one in alias Questgiver; the speaker is Aeri: SetStage 10 on Favor001AngasMill (Delivery).

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
