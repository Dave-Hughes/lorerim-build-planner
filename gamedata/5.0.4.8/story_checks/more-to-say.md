# Start check: More to Say (`more-to-say`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Forsworn of Haafingar (`ACFDragonbridgeForsworn`, moretodo.esp:000818, moretodo.esp)

**Started by**

- Dialogue with Tasius Tragus, "I'll take care of those Forsworn for you.": SetStage 10 (when: the speaker is Tasius Tragus). Source: ACF_MTS_DB__010008EC.Fragment_0 on INFO moretodo.esp:000821 (moretodo.esp). **script**
- Story manager node ACFMoreToSayDragonbridgeNode, event: change location; conditions up its parents: the place you enter is Dragon Bridge. Source: ACFMoreToSayDragonbridgeNode moretodo.esp:000823 (moretodo.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias=QuestGiverAlias> the Forsworn leader is dead", shown at stage 100. Source: moretodo.esp:000818 QOBJ 100. **files**
- ACFDragonbridgeForsworn (Forsworn of Haafingar) calls SetStage 100. Source: ACFDragonbridgeForswornBossScript.OnDeath on moretodo.esp:000818 (moretodo.esp). **script**

**Who and where**

- First objective: "Kill the leader of the Forsworn at <Alias=ForswornCampAlias>". Source: moretodo.esp:000818 QOBJ 10. **files**
- Target alias ForswornBossAlias (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 100 gold (stage 200, ACFA_QF_ACFDragonbridgeForswo_010008E3.fragment_2).

## 2. Chaos in Falkreath (`ACFFalkreathBandits`, moretodo.esp:000999, moretodo.esp)

**Started by**

- Dialogue with Solaf, placed in Gray Pine Goods, Gray Pine Luxuries, "I can help with that.": SetStage 10 (when: the speaker is Solaf). Source: acf_mts_fkth_getquest_solaf.Fragment_0 on INFO moretodo.esp:0009A3 (moretodo.esp). **script**
- Story manager node ACFMTSFalkreathQuestsNode, event: change location; conditions up its parents: the place you enter is Falkreath. Source: ACFMTSFalkreathQuestsNode moretodo.esp:000802 (moretodo.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell Solaf the warlord is dead.", shown at stage 100. Source: moretodo.esp:000999 QOBJ 100. **files**
- ACFFalkreathBandits (Chaos in Falkreath) calls SetStage 100. Source: ACFFalkreathBanditBossScript.OnDeath on moretodo.esp:000999 (moretodo.esp). **script**

**Who and where**

- First objective: "Kill the warlord at <Alias=BanditCampAlias> in <Alias=Hold>.". Source: moretodo.esp:000999 QOBJ 10. **files**
- Target alias BanditBossAlias (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 201 gold (stage 200, QF_ACFFalkreathBandits_05000999.fragment_4).

## 3. Forsworn of the Reach (`ACFKarthwastenForsworn`, moretodo.esp:000836, moretodo.esp)

**Started by**

- Dialogue with Ainethach, placed in Karthwasten Hall, Karhwasten Hall, "I can help with that.": SetStage 10 (when: the speaker is Ainethach). Source: acf_mts_kw_getquest_ainethach.Fragment_0 on INFO moretodo.esp:000833 (moretodo.esp). **script**
- Story manager node ACFMoreToSayKarthwastenNode, event: change location; conditions up its parents: the place you enter is Karthwasten. Source: ACFMoreToSayKarthwastenNode moretodo.esp:00083B (moretodo.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias=KarthwastenLeaderAlias> the Forsworn leader is dead", shown at stage 100. Source: moretodo.esp:000836 QOBJ 100. **files**
- ACFKarthwastenForsworn (Forsworn of the Reach) calls SetStage 100. Source: ACFKarthwastenForswornBossScript.OnDeath on moretodo.esp:000836 (moretodo.esp). **script**

**Who and where**

- First objective: "Kill the leader of the Forsworn at <Alias=ForswornCampAlias> in <Alias=HoldAlias>". Source: moretodo.esp:000836 QOBJ 10. **files**
- Target alias ForswornBossAlias (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 100 gold (stage 200, QF_ACFKarthwastenForsworn_06000836.fragment_2).

## 4. More to Say Find Angi (`ACFMTSAngisCampDialogue`, moretodo.esp:00091B, moretodo.esp)

**Started by**

- Dialogue with Faendal, placed in Faendal's House, "Maybe I can learn something from this hunter.": SetStage 20 (when: the speaker is Faendal). Source: acf_mts_angi_start_faendal.Fragment_0 on INFO moretodo.esp:000A66 (moretodo.esp). **script**
- Dialogue with Valdr, placed in Moss Mother Cavern, "Maybe I can learn something from this hunter.": SetStage 20 (when: the speaker is Valdr). Source: acf_mts_angi_start_valdr.Fragment_0 on INFO moretodo.esp:000A67 (moretodo.esp). **script**
- Story manager node ACFMTSFalkreathQuestsNode, event: change location; conditions up its parents: the place you enter is Falkreath. Source: ACFMTSFalkreathQuestsNode moretodo.esp:000802 (moretodo.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill the seasoned hunter", shown at stage 40. Source: moretodo.esp:00091B QOBJ 22. **files**
- Dialogue with Angi, placed in Angi's Camp, "Thanks again for the archery lessons.": SetStage 30 (when: the speaker is Angi; dunArcherQST stage >= 100 or dunArcherQST completed). Reply: "It's not often I get visitors out here." Source: acf_mts_angi_complete.Fragment_0 on INFO moretodo.esp:000918 (moretodo.esp). **script**
- Dialogue with someone the line does not name (named by alias QuestGiverAlias of ACFMTSAngisCampDialogue (More to Say Find Angi) (run time)), "So...?": SetStage 40 (when: the speaker is the one in alias QuestGiverAlias; GetInFaction Imperial Legion == 1). Reply: "Make it happen, soldier." Source: acf_mts_angi_start_skulnar_soldier.Fragment_0 on INFO moretodo.esp:000A4A (moretodo.esp). **script**
- Dialogue with someone the line does not name (named by alias QuestGiverAlias of ACFMTSAngisCampDialogue (More to Say Find Angi) (run time)), "So...?": SetStage 40 (when: the speaker is the one in alias QuestGiverAlias). Reply: "Make it happen." Source: acf_mts_angi_start_skulnar.Fragment_0 on INFO moretodo.esp:000A4B (moretodo.esp). **script**

**Who and where**

- First objective: "Train with the seasoned hunter". Source: moretodo.esp:00091B QOBJ 20. **files**
- Target alias HunterAlias (unique): Angi (unique actor, placed in Angi's Camp). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 100 gold (stage 220, QF_ACFMTSAngisCampDialogue_0300091B.fragment_8); 100 gold (stage 200, QF_ACFMTSAngisCampDialogue_0300091B.fragment_6).

## 5. Ingredient Collection (`ACFMTSFreeformFalkreath001`, moretodo.esp:000927, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with Zaria, placed in Grave Concoctions, "I suppose I can help you find some sabre cat eyes.": SetStage 20 (when: the speaker is Zaria). Source: acf_mts_fkth_getquest_zaria.Fragment_0 on INFO moretodo.esp:00092F (moretodo.esp). **script**
- Story manager node ACFMTSFalkreathQuestsNode, event: change location; conditions up its parents: the place you enter is Falkreath. Source: ACFMTSFalkreathQuestsNode moretodo.esp:000802 (moretodo.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Zaria.". Source: moretodo.esp:000927 QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Bring 5 sabre cat eyes to Zaria. (<Global=ACFFFF001IngredientCount>/<Global=ACFFFF001IngredientTotal>)". Source: moretodo.esp:000927 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: FavorRewardGoldSmall (levelled: gold) (stage 200, QF_ACFMTSFreeformFalkreath00_05000927.fragment_5).

## 6. Shriekwind Bastion (`ACFMTSFreeformFalkreath002`, moretodo.esp:000987, moretodo.esp)

**Started by**

- Dialogue with Narri, placed in Dead Man's Drink, "I can help clear the ruins of undead.": SetStage 20 (when: the speaker is Narri). Source: acf_mts_fkth_getquest_shriekwind.Fragment_0 on INFO moretodo.esp:00098E (moretodo.esp). **script**
- Story manager node ACFMTSFalkreathQuestsNode, event: change location; conditions up its parents: the place you enter is Falkreath. Source: ACFMTSFalkreathQuestsNode moretodo.esp:000802 (moretodo.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Inform the steward of Falkreath that Shriekwind Bastion is clear of the restless dead.", shown at stage 100. Source: moretodo.esp:000987 QOBJ 100. **files**
- ACFMTSFreeformFalkreath002 (Shriekwind Bastion) calls SetStage 100. Source: ACFShriekwindBastionBossScript.OnDeath on moretodo.esp:000987 (moretodo.esp). **script**

**Who and where**

- First objective: "Clear Shriekwind Bastion of the restless dead.". Source: moretodo.esp:000987 QOBJ 20. **files**
- Target alias ShriekwindBastionBossAlias (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 200 gold (stage 200, QF_ACFMTSFreeformFalkreath00_05000987.fragment_3).

## 7. Birna's Shipment (`ACFMTSFreeformWinterhold01`, moretodo.esp:0008E1, moretodo.esp)

**Started by**

- Dialogue with Birna (named by alias QuestGiver of ACFMTSFreeformWinterhold01 (Birna's Shipment) (unique)), placed in Birna's Oddments, Ranmir's House, "I'd be happy to help you.": SetStage 20 (when: the speaker is the one in alias QuestGiver). Source: ACFA_TIF__050008EA.Fragment_0 on INFO moretodo.esp:0008EA (moretodo.esp). **script**
- Story manager node ACFMTSWinterholdQuestsNode, event: change location; conditions up its parents: the place you enter is Winterhold. Source: ACFMTSWinterholdQuestsNode moretodo.esp:000813 (moretodo.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return the missing shipment to <Alias=QuestGiver>.", shown at stage 100. Source: moretodo.esp:0008E1 QOBJ 100. **files**
- ACFMTSFreeformWinterhold01 (Birna's Shipment) calls SetStage 100. Source: DefaultAddItemAliasScript.OnContainerChanged on moretodo.esp:0008E1 (moretodo.esp). **script**

**Who and where**

- First objective: "Retrieve <Alias=QuestGiver>'s shipment from <Alias=QuestLocation>.". Source: moretodo.esp:0008E1 QOBJ 10. **files**
- Target alias Shipment (created): Birna's Shipment (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: gold (an amount the script works out) (stage 200, QF_ACFMTSFreeformWinterhold0_050008E1.fragment_6).

## 8. Embershard Bandits (`ACFRiverwoodEmbershardBandits`, moretodo.esp:000EEA, moretodo.esp)

**Started by**

- Dialogue with Lucan Valerius, placed in Riverwood Trader, Lucan's Dry Goods, "I'll take care of the bandits for you.": SetStage 10 (when: the speaker is Lucan Valerius). Source: acf_mts_rw_getquest_lucan.Fragment_0 on INFO moretodo.esp:000EE5 (moretodo.esp). **script**
- Story manager node ACFMTSRiverwoodQuestNode, event: change location; conditions up its parents: the place you enter is Riverwood. Source: ACFMTSRiverwoodQuestNode moretodo.esp:0009D5 (moretodo.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell Lucan the bandit leader is dead.", shown at stage 100. Source: moretodo.esp:000EEA QOBJ 100. **files**
- ACFRiverwoodEmbershardBandits (Embershard Bandits) calls SetStage 100. Source: ACFEmbershardBanditBossScript.OnDeath on moretodo.esp:000EEA (moretodo.esp). **script**
- ACFRiverwoodEmbershardBandits (Embershard Bandits) calls SetStage 20. Source: ACFEmbershardBanditBossScript.OnDeath on moretodo.esp:000EEA (moretodo.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader at <Alias=QuestLocation>.". Source: moretodo.esp:000EEA QOBJ 10. **files**
- Target alias BanditBoss (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: gold (an amount the script works out) (stage 200, ACF_QF_ACFRiverwoodLucanEmber_010512BA.fragment_4).

## 9. The Heart Will Go On (`ACFRiverwoodTheHeartWillGoOn`, moretosayriverwood.esp:000F02, moretosayriverwood.esp)

**Started by**

- Dialogue with Faendal (named by alias Faendal of ACFRiverwoodTheHeartWillGoOn (The Heart Will Go On) (unique)), placed in Faendal's House, "Do you want me to deliver the letter to Camilla for you?": SetStage 10 (when: the speaker is the one in alias Faendal). Source: acf_mts_rw_getquest_faendal.Fragment_0 on INFO moretosayriverwood.esp:000EEB (moretosayriverwood.esp). **script**
- Story manager node ACFMTSRiverwoodQuestNode, event: change location; conditions up its parents: the place you enter is Riverwood. Source: ACFMTSRiverwoodQuestNode moretosayriverwood.esp:0009D5 (moretosayriverwood.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Deliver Sven's ballad to Camilla", shown at stage 110. Source: moretosayriverwood.esp:000F02 QOBJ 110. **files**
- Dialogue with Sven (named by alias Sven of ACFRiverwoodTheHeartWillGoOn (The Heart Will Go On) (unique)), placed in Sven and Hilde's House, Sven's House, "Why not finish it up right now? I can deliver it for you.": SetStage 110 (when: the speaker is the one in alias Sven). Reply: "I'll give it a try, thanks very much." Source: acf_mts_rw_getquest_sven.Fragment_3 on INFO moretosayriverwood.esp:000EFF (moretosayriverwood.esp). **script**

**Who and where**

- First objective: "Deliver Faendal's letter to Camilla". Source: moretosayriverwood.esp:000F02 QOBJ 10. **files**
- Target alias Camilla (unique): Camilla Valerius (unique actor, placed in Riverwood Trader, Lucan's Dry Goods). **files**

**Needs**

- Its own conditions: the place you enter is Riverwood. **files**
- Ways in: Riverwood Trader, Lucan's Dry Goods: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 10. The Secret of Rorikstead (`ACFRoriksteadFreeform03`, secretofrorikstead.esp:000897, secretofrorikstead.esp)

**Started by**

- Dialogue with Erik the Slayer, placed in Frostfruit Inn, "Sure, we can go back to Rorikstead.": SetStage 20 (when: the speaker is Erik the Slayer). Source: ACF_MTS_Rorikstead_TIF__03000937.Fragment_1 on INFO secretofrorikstead.esp:000937 (secretofrorikstead.esp). **script**
- Story manager node ACFSecretOfRoriksteadChangeLocationNode, event: change location; conditions up its parents: the place you enter is Rorikstead. Source: ACFSecretOfRoriksteadChangeLocationNode secretofrorikstead.esp:00091A (secretofrorikstead.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find evidence of suspicious activities in Rorikstead.". Source: secretofrorikstead.esp:000897 QOBJ 50. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Discover the secret behind Rorikstead's fruitful harvests.". Source: secretofrorikstead.esp:000897 QOBJ 10. **files**
- Target alias MapMarkerAlias (forced): a marker (forced reference, placed in Rorikstead); Skyrim.esm:000010 (named in its conditions, placed in Warehouse Map Markers, Warehouses, Warehouse Map Markers, Warehouses). **files**

**Needs**

- The door from Stendarr's Beacon Underground into Stendarr's Beacon needs the Stendarr's Beacon Underground Key. Source: Vigilant.esm:003595 (Vigilant.esm). **files**
- The door from Solitude Lighthouse into Skyrim needs the Key to Solitude Lighthouse, carried by Ma'zaka. Source: Skyrim.esm:016B6A (Skyrim.esm). **files**
- The door from Whiterun Stables into Whiterun needs the Key to Whiterun Stables, carried by Jervar; Lillith Maiden-Loom; Skulvar Sable-Hilt. Source: Skyrim.esm:016729 (Requiem.esp). **files**
- The door from Sarethi Farm, Sarethi Farm Interior into Sarethi Farm is locked (Novice). Source: Skyrim.esm:01650C (Snazzy Interiors - Sarethi Farm.esp). **files**
- The door from Pelagia Farm into Pelagia Farm needs the Key to Pelagia Farmhouse, carried by Nimriel; Gloth. Source: Skyrim.esm:0164EC (Unofficial Skyrim Special Edition Patch.esp). **files**
- The door from Half-Moon Mill into Half-Moon Mill needs the Key to Half-Moon Mill, carried by Hert; Hern. Source: Skyrim.esm:0164DC (Half-Moon Mill - COTNed.esp). **files**
- The door from Hollyfrost Farm into Hollyfrost Farm needs the Hollyfrost Farmhouse Key, carried by Tulvur. Source: Skyrim.esm:023EE0 (Skyrim.esm). **files**
- The door from Hlaalu Farm into Hlaalu Farm needs the Hlaalu Farmhouse Key, carried by Adisla. Source: Skyrim.esm:016422 (Skyrim.esm). **files**
- The door from Heartwood Mill into Heartwood Mill needs the Heartwood Mill Key, carried by Gralnach; Grosta. Source: Skyrim.esm:016402 (LoreRim - World Fixes.esp). **files**
- The door from Brandy-Mug Farm into Brandy-Mug Farm needs the Brandy-Mug Farmhouse Key, carried by Bolfrida Brandy-Mug. Source: Skyrim.esm:0163A6 (Skyrim.esm). **files**
- The door from Pinewatch into Pinewatch is locked (Adept). Source: Skyrim.esm:015A2D (Skyrim.esm). **files**
- The door from Frostview Hall into Winterhold needs the Key to Frostview's Hall. Source: The Great City of Winterhold v4.esp:45962B (The Great City of Winterhold v4.esp). **files**
- The door from Rustleif's House into Dawnstar needs the Key to Rustleif's House, carried by Seren; Rustleif. Source: Skyrim.esm:013D01 (COTN - Dawnstar.esp). **files**
- The door from Leigelf's House into Dawnstar needs the Key to Leigelf's House, carried by Leigelf. Source: Skyrim.esm:013CF1 (COTN Dawnstar - Requiem Patch.esp). **files**
- The door from Ebony Keep into Ebony Warrior's Camp needs the Ebony Keep Key. Source: Ryn's Snazzy Last Vigil.esp:0DB9D0 (Ryn's Snazzy Last Vigil.esp). **files**
- The door from Fort Icemoth into Fort Icemoth needs the Fort Icemoth Key. Source: Siege at Icemoth.esp:149623 (Siege at Icemoth.esp). **files**
- The door from Fort Icemoth into Fort Icemoth needs the Fort Icemoth Key. Source: Siege at Icemoth.esp:149624 (Siege at Icemoth.esp). **files**
- The door from Fort Icemoth into Fort Icemoth needs the Fort Icemoth Key. Source: Siege at Icemoth.esp:14961A (Siege at Icemoth.esp). **files**
- The door from Fort Icemoth into Fort Icemoth needs the Fort Icemoth Key. Source: Siege at Icemoth.esp:143514 (Siege at Icemoth.esp). **files**
- The door from Kazmalgur Longhouse, Kazmalgur into Kazmalgur needs the Key to Gashnag's Longhouse, carried by Lorzub; Ushlog; Largahk; Gashnag; Bulak; Ghorlag. Source: Wyrmstooth.esp:220582 (Wyrmstooth.esp). **files**
- The door from Chillwater Mill into Chillwater Mill needs the Key to Chillwater Mill, carried by Balmir; Yngfa. Source: Wyrmstooth.esp:272C01 (Wyrmstooth.esp). **files**
- The door from Three Peaks Staff and Magic into Three Peaks Staff and Magic needs the Key to Telrav's House, carried by Ilrav Baenius. Source: Gray Fox Cowl.esm:0161E9 (Gray Fox Cowl.esm). **files**
- The door from Prison Tower into Prison District needs the Warden's Key. Source: Vigilant.esm:0FA29E (Vigilant.esm). **files**
- The door from Mill Maintenance, Markarth Mill Maintenance into Salvius Farm needs the Key to Savantus Mill Maintenance, carried by Savantus Ingenius. Source: Lux Via - Markarth Entrance and Farm Overhaul.esp:0008B8 (Lux Via - Markarth Entrance and Farm Overhaul.esp). **files**
- The door from Hilarius Farmhouse into Salvius Farm needs the Key to Hilarius Farmhouse, carried by Hilarius; Vagdis Hilarius. Source: Lux Via - Markarth Entrance and Farm Overhaul.esp:000888 (Lux Via - Markarth Entrance and Farm Overhaul.esp). **files**
- The door from The Chill, Winterhold into Skyrim needs the Key to the tunnel. Source: Immersive Winterhold Jail.esp:000932 (Immersive Winterhold Jail.esp). **files**
- The door from Taluri's Shack, Shack into Skyrim needs the Crude Key, carried by Taluri Moren; Delmon; Gilas; Tevyn Athin. Source: WindhelmSSE.esp:172BC7 (WindhelmSSE.esp). **files**
- The door from Tevyn's Shack, Shack into Skyrim needs the Crude Key, carried by Taluri Moren; Delmon; Gilas; Tevyn Athin. Source: WindhelmSSE.esp:172C23 (WindhelmSSE.esp). **files**
- The door from Gilas' Shack, Shack into Skyrim needs the Crude Key, carried by Taluri Moren; Delmon; Gilas; Tevyn Athin. Source: WindhelmSSE.esp:172C61 (WindhelmSSE.esp). **files**
- The door from Delmon's Shack, Shack into Skyrim needs the Crude Key, carried by Taluri Moren; Delmon; Gilas; Tevyn Athin. Source: WindhelmSSE.esp:10668A (WindhelmSSE.esp). **files**
- The door from New Gnisis Cornerclub into Skyrim needs the Passage Key. Source: JK's New Gnisis Cornerclub.esp:000BA2 (JK's New Gnisis Cornerclub.esp). **files**
- The door from Ven Fillaan Miin into Skyrim needs the Key to Ven Fillaan Miin. Source: Ryn's Azura's Shrine.esp:000DF1 (Ryn's Azura's Shrine.esp). **files**
- Ways in: Rorikstead: 2 doors, 0 locked; Reachcliff Cave: 1 door, 0 locked; Stendarr's Beacon: 1 door, 1 locked; Northwind Mine: 1 door, 0 locked; Bonechill Passage: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Raldbthar: 1 door, 0 locked; Cold Rock Pass: 1 door, 0 locked; Cold Rock Pass: 1 door, 0 locked; Sunderstone Gorge: 1 door, 0 locked; Dustman's Cairn: 1 door, 0 locked; Boulderfall Cave: 1 door, 0 locked; Steepfall Burrow: 1 door, 0 locked; Ironback Hideout: 1 door, 0 locked; Mara's Eye Pond: 2 doors, 0 locked; Abandoned Prison: 1 door, 0 locked; Markarth Outskirts: 4 doors, 3 locked; Anise's Cabin: 1 door, 0 locked; Windhelm: 1 door, 0 locked; Shrine of Mehrunes Dagon: 1 door, 0 locked; Raldbthar: 1 door, 0 locked; Brittleshin Pass: 1 door, 0 locked; Stony Creek Cave: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Drelas Cottage: 1 door, 0 locked; Crab Shack: 1 door, 0 locked; Lund's Hut: 1 door, 0 locked; Bthalft: 1 door, 0 locked; Lost Prospect Mine: 1 door, 0 locked; Alchemist's Shack: 1 door, 0 locked; Froki's Shack: 1 door, 0 locked; Skyrim: 1 door, 0 locked; The Katariah: 5 doors, 0 locked; Skyrim: 1 door, 1 locked; Black-Briar Lodge: 10 doors, 2 locked; Falkreath Watchtower: 2 doors, 1 locked; Snow Veil Sanctum: 1 door, 0 locked; Dawnstar: 2 doors, 0 locked; Broken Oar Grotto: 1 door, 0 locked; Embershard: 1 door, 0 locked; Rebel's Cairn: 1 door, 0 locked; Darkshade Copse: 1 door, 0 locked; Shrine of Azura: 1 door, 0 locked; Whiterun: 1 door, 1 locked; Dainty Sload: 1 door, 0 locked; Shroud Hearth Barrow: 4 doors, 2 locked; Snapleg Cave: 1 door, 0 locked; Bronze Water Cave: 1 door, 0 locked; Abandoned Shack: 1 door, 0 locked; Solitude: 3 doors, 0 locked; Honningbrew Meadery: 2 doors, 1 locked; Nightingale Hall: 1 door, 0 locked; Fort Hraggstad: 1 door, 0 locked; Thalmor Embassy: 5 doors, 2 locked; Merryfair Farm: 1 door, 0 locked; Septimus Signus' Outpost: 1 door, 0 locked; Brinewater Grotto: 1 door, 0 locked; Kolskeggr Mine: 4 doors, 1 locked; Dark Brotherhood Sanctuary: 2 doors, 0 locked; Goldenglow Estate: 3 doors, 0 locked; Nightcaller Temple: 1 door, 0 locked; Alftand: 2 doors, 0 locked; Angarvunde: 1 door, 0 locked; Ansilvund: 1 door, 0 locked; Whistling Mine: 1 door, 0 locked; Solitude Sawmill: 1 door, 0 locked; Sarethi Farm: 1 door, 1 locked; Salvius Farm: 2 doors, 1 locked; Pelagia Farm: 1 door, 1 locked; Half-Moon Mill: 1 door, 1 locked; Mixwater Mill: 4 doors, 2 locked; Left Hand Mine: 2 doors, 0 locked; Katla's Farm: 2 doors, 1 locked; Hollyfrost Farm: 1 door, 1 locked; Hlaalu Farm: 1 door, 1 locked; High Hrothgar: 3 doors, 0 locked; Heartwood Mill: 1 door, 1 locked; Snow-Shod Farm: 2 doors, 0 locked; Gloombound Mine: 1 door, 0 locked; Chillfurrow Farm: 1 door, 0 locked; Brandy-Mug Farm: 1 door, 1 locked; Battle-Born Farm: 1 door, 0 locked; Yngvild: 1 door, 0 locked; Ysgramor's Tomb: 2 doors, 0 locked; Wolfskull Cave: 1 door, 0 locked; White River Watch: 1 door, 0 locked; Hillgrund's Tomb: 1 door, 0 locked; Treva's Watch: 1 door, 0 locked; Tolvald's Cave: 1 door, 0 locked; Frostmere Crypt: 1 door, 0 locked; Stillborn Cave: 1 door, 0 locked; Soljund's Sinkhole: 3 doors, 1 locked; Eldergleam Sanctuary: 1 door, 0 locked; Silverdrift Lair: 1 door, 0 locked; Silent Moons Camp: 2 doors, 0 locked; Sightless Pit: 1 door, 0 locked; Shrouded Grove: 1 door, 0 locked; Brinehammer: 3 doors, 0 locked; Skyrim: 1 door, 0 locked; Shimmermist Cave: 1 door, 0 locked; Shadowgreen Cavern: 1 door, 0 locked; Robber's Gorge: 1 door, 0 locked; Saarthal: 1 door, 0 locked; Riverwood: 2 doors, 0 locked; Rimerock Burrow: 1 door, 0 locked; Redoran's Retreat: 1 door, 0 locked; Reachwater Rock: 1 door, 0 locked; Ravenscar Hollow: 1 door, 0 locked; Rannveig's Fast: 1 door, 0 locked; Pinewatch: 1 door, 1 locked; Pinepeak Cavern: 1 door, 0 locked; Pinemoon Cave: 1 door, 0 locked; Northwatch Keep: 2 doors, 0 locked; Narzulbur: 2 doors, 0 locked; Mzinchaleft: 1 door, 0 locked; Morvunskar: 1 door, 0 locked; Mor Khazgur: 2 doors, 0 locked; Mistwatch: 4 doors, 0 locked; Lost Knife Hideout: 1 door, 0 locked; Yngol Barrow: 1 door, 0 locked; Liar's Retreat: 1 door, 0 locked; Largashbur: 2 doors, 0 locked; Kilkreath Ruins: 1 door, 0 locked; Karthspire: 1 door, 0 locked; Irkngthand: 1 door, 0 locked; Honeystrand Cave: 1 door, 0 locked; Hob's Fall Cave: 1 door, 0 locked; Brittleshin Pass: 1 door, 0 locked; Volunruud: 1 door, 0 locked; High Gate Ruins: 1 door, 0 locked; Harmugstahl: 1 door, 0 locked; Halted Stream Camp: 1 door, 0 locked; Halldir's Cairn: 1 door, 0 locked; Hag Rock Redoubt: 1 door, 0 locked; Guldun Rock: 1 door, 0 locked; Cracked Tusk Keep: 3 doors, 1 locked; Greywater Grotto: 1 door, 0 locked; Graywinter Watch: 1 door, 0 locked; Gloomreach: 1 door, 0 locked; Glenmoril Coven: 1 door, 0 locked; Movarth's Lair: 1 door, 0 locked; Gallows Rock: 1 door, 0 locked; Frostflow Lighthouse: 2 doors, 0 locked; Fort Snowhawk: 4 doors, 0 locked; Fort Neugrad: 4 doors, 0 locked; Fort Greenwall: 3 doors, 0 locked; Fort Fellhammer: 2 doors, 0 locked; Fort Dunstad: 3 doors, 0 locked; Fort Greymoor: 2 doors, 0 locked; Fort Amol: 4 doors, 0 locked; Forsaken Cave: 1 door, 0 locked; Folgunthur: 1 door, 0 locked; Fellglow Keep: 3 doors, 0 locked; Fallowstone Cave: 1 door, 0 locked; Faldar's Tooth: 2 doors, 0 locked; Duskglow Crevice: 1 door, 0 locked; Dushnikh Yal: 1 door, 0 locked; Red Eagle Redoubt: 1 door, 0 locked; Druadach Redoubt: 1 door, 0 locked; Driftshade Sanctuary: 1 door, 0 locked; Deepwood Redoubt: 1 door, 0 locked; Dead Crone Rock: 3 doors, 0 locked; Darkwater Pass: 1 door, 0 locked; Darklight Tower: 1 door, 0 locked; Crystaldrift Cave: 1 door, 0 locked; Cronvangr Hall: 1 door, 0 locked; Cragwallow Slope: 1 door, 0 locked; Cragslane Cavern: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Chillwind Depths: 1 door, 0 locked; Ustengrav: 1 door, 0 locked; Bthardamz: 1 door, 0 locked; Bruca's Leap Redoubt: 1 door, 0 locked; Brood Cavern: 1 door, 0 locked; Broken Tower Redoubt: 4 doors, 0 locked; Broken Helm Hollow: 1 door, 0 locked; Broken Fang Cave: 1 door, 0 locked; Twilight Sepulcher: 1 door, 0 locked; Bloated Man's Grotto: 1 door, 0 locked; Blind Cliff Cave: 1 door, 0 locked; Bleakcoast Cave: 1 door, 0 locked; Avanchnzel: 2 doors, 0 locked; Autumnshade Clearing: 1 door, 0 locked; Winterhold: 1 door, 1 locked; Stonehills: 1 door, 0 locked; Shor's Stone: 3 doors, 0 locked; Old Hroldan: 5 doors, 2 locked; Morthal: 2 doors, 0 locked; Karthwasten: 11 doors, 2 locked; Ivarstead: 4 doors, 3 locked; Helgen: 6 doors, 3 locked; Falkreath: 8 doors, 5 locked; Dragon Bridge: 4 doors, 0 locked; Dawnstar: 2 doors, 2 locked; Darkwater Crossing: 2 doors, 1 locked; Winterhold College: 7 doors, 2 locked; Riften: 3 doors, 1 locked; Lost Echo Cave: 1 door, 0 locked; Knifepoint Ridge: 1 door, 0 locked; Shriekwind Bastion: 1 door, 0 locked; Reachwind Eyrie: 1 door, 0 locked; Snowpoint Beacon: 1 door, 0 locked; Hall of the Vigilant: 2 doors, 0 locked; Valkygg: 1 door, 0 locked; Windhelm: 9 doors, 6 locked; Windhelm: 6 doors, 3 locked; Riften: 1 door, 0 locked; Riften: 10 doors, 3 locked; Riften: 23 doors, 11 locked; Markarth: 6 doors, 3 locked; Markarth: 15 doors, 9 locked; Whiterun: 2 doors, 1 locked; Whiterun: 4 doors, 1 locked; Fallowstone Cave: 1 door, 0 locked; Hag's End: 1 door, 0 locked; Karthspire: 1 door, 0 locked; Solitude: 5 doors, 0 locked; Solitude: 13 doors, 5 locked; Dimhollow Crypt: 1 door, 0 locked; Forebears' Holdout: 1 door, 0 locked; Ancestor Glade: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Redwater Den: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Arkngthamz: 2 doors, 0 locked; Skyrim: 1 door, 0 locked; Moldering Ruins: 1 door, 0 locked; Castle Volkihar: 1 door, 0 locked; Windhelm: 4 doors, 3 locked; Dawnstar: 3 doors, 2 locked; Dayspring Canyon: 4 doors, 0 locked; Lakeview Manor: 11 doors, 0 locked; Windstad Manor: 13 doors, 0 locked; Heljarchen Hall: 13 doors, 0 locked; Skyrim: 1 door, 0 locked; Damphall Mine: 1 door, 0 locked; Bristleback Cave: 1 door, 0 locked; Morrowind: 1 door, 0 locked; Castle Karstaag Ruins: 1 door, 0 locked; Hrothmund's Barrow: 1 door, 0 locked; Abandoned Lodge: 1 door, 0 locked; Morrowind: 1 door, 0 locked; Thirsk: 1 door, 0 locked; Tel Mithryn: 5 doors, 0 locked; Skaal Village: 6 doors, 5 locked; Raven Rock: 6 doors, 2 locked; Ashfallow Citadel: 1 door, 0 locked; Glacial Cave: 1 door, 0 locked; Hrodulf's House: 1 door, 0 locked; Broken Tusk Mine: 1 door, 0 locked; Moesring Pass: 1 door, 0 locked; White Ridge Barrow: 1 door, 0 locked; Kolbjorn Barrow: 1 door, 0 locked; Vahlok's Tomb: 1 door, 0 locked; Gyldenhul Barrow: 1 door, 0 locked; Fort Frostmoth: 2 doors, 0 locked; Kagrumez: 1 door, 0 locked; Bloodskal Barrow: 1 door, 0 locked; Benkongerike: 1 door, 0 locked; Altar of Thrond: 1 door, 0 locked; Morrowind: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 2 doors, 0 locked; Wintersand Manor: 3 doors, 0 locked; Skyrim: 4 doors, 0 locked; Riften: 9 doors, 2 locked; Blackbone Isle: 1 door, 0 locked; Arcwind Point: 1 door, 0 locked; Deadlands: 1 door, 0 locked; Goldenhills Plantation: 2 doors, 0 locked; Hendraheim: 2 doors, 0 locked; Langley's House Ext: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Ebony Warrior's Camp: 1 door, 1 locked; Shivering Isles: 1 door, 0 locked; Shivering Isles: 4 doors, 0 locked; Shivering Isles: 1 door, 0 locked; Xedex: 2 doors, 0 locked; Glimmering Hollow: 1 door, 0 locked; Shivering Isles: 1 door, 0 locked; Root Canal: 1 door, 0 locked; Old Wooden Jetty: 1 door, 0 locked; Ghoruun Hall: 1 door, 0 locked; Fort Icemoth: 2 doors, 0 locked; Winter Shroud Sanctum: 1 door, 0 locked; Fort Icemoth: 4 doors, 4 locked; Saervild's Trench: 1 door, 0 locked; Frostcaller Cave: 1 door, 0 locked; The Forgotten City: 30 doors, 0 locked; Skyrim: 1 door, 0 locked; Kazmalgur: 1 door, 1 locked; Stonehollow: 1 door, 0 locked; Cragwater Cavern: 1 door, 0 locked; Wyrmstooth Barrow: 1 door, 0 locked; Chillwater Mill: 1 door, 1 locked; Stonehollow: 1 door, 0 locked; Wyrmstooth: 1 door, 0 locked; Wyrmstooth Barrow: 1 door, 0 locked; Haetar's Cave: 1 door, 0 locked; Herman's Hideout: 1 door, 0 locked; Wyrmstooth: 1 door, 0 locked; Wyrmstooth: 1 door, 0 locked; Wyrmstooth: 1 door, 0 locked; Fort Valus: 3 doors, 0 locked; Wyrmstooth: 1 door, 0 locked; Tomb of Vulom: 1 door, 0 locked; Wyrmstooth: 1 door, 0 locked; Wyrmstooth: 1 door, 0 locked; Gronndal Grove: 1 door, 0 locked; Krakevisa: 1 door, 0 locked; Blind Robber's Bluff: 1 door, 0 locked; Stonehollow: 3 doors, 1 locked; Abandoned Lighthouse: 1 door, 0 locked; Oio-Lalor: 1 door, 0 locked; Rkulftzul, Sealed Vault: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Kalbthurz: 1 door, 0 locked; Fort Dulan: 3 doors, 0 locked; Fort Blacklight: 9 doors, 0 locked; Saxhleel Camp: 1 door, 0 locked; Morrowind: 1 door, 0 locked; Morrowind: 1 door, 0 locked; Morrowind: 2 doors, 0 locked; Fort Tulis: 3 doors, 0 locked; Baan Malur: 3 doors, 0 locked; Morrowind: 1 door, 0 locked; Morrowind: 2 doors, 0 locked; Baan Malur: 7 doors, 1 locked; Cormaris: 9 doors, 0 locked; Monger Mill: 4 doors, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Dragontail Mountains: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Rimerock Burrow: 1 door, 0 locked; Aba-Malatar: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Coldharbour: 1 door, 0 locked; Coldharbour: 1 door, 0 locked; Coldharbour: 1 door, 0 locked; Ben Erai: 2 doors, 0 locked; Alik'r Desert: 1 door, 0 locked; Great Agyrion Breach: 1 door, 0 locked; Ancient Alik'r Temple: 1 door, 0 locked; Alik'r Desert: 2 doors, 0 locked; Ben Erai: 7 doors, 6 locked; Alik'r Desert: 1 door, 0 locked; Three Peaks Staff and Magic: 1 door, 1 locked; Stuhn Ravine: 5 doors, 0 locked; Bruiant Estate: 2 doors, 0 locked; Prison District: 1 door, 1 locked; Emperor Gorieus' Charnel District: 1 door, 0 locked; Slums Bridge: 2 doors, 0 locked; Waterfront District: 1 door, 0 locked; Inqusition District: 1 door, 0 locked; Waterfront District: 7 doors, 1 locked; Eight Saints District: 1 door, 0 locked; Inquisition Court District: 2 doors, 0 locked; Mitta Village: 1 door, 0 locked; Arena District: 1 door, 0 locked; Kh-Utta's Territory: 1 door, 0 locked; Varla's Territory: 1 door, 0 locked; Curia District: 1 door, 0 locked; Varla's Territory: 1 door, 0 locked; Varla's Territory: 1 door, 0 locked; Malatar District: 1 door, 0 locked; Buro Temple: 1 door, 0 locked; Kh-Utta's Territory: 1 door, 0 locked; Emperor Gorieus' Charnel District: 1 door, 0 locked; Nenyond's Underground Priory: 2 doors, 0 locked; Coldharbour: 1 door, 0 locked; Pass of Arkay: 1 door, 0 locked; Malatar District: 1 door, 0 locked; Silorn's Priory: 2 doors, 0 locked; Torture Garden: 1 door, 0 locked; Witch's Pond: 1 door, 0 locked; Whispering Walls: 1 door, 0 locked; Wisp Light Crevasse: 1 door, 0 locked; Frostskarn Vault: 1 door, 0 locked; Labyrinthine Passages: 1 door, 0 locked; Forsaken Crypt: 1 door, 0 locked; Ashbound Prison: 1 door, 0 locked; Morrowind: 1 door, 0 locked; Whiterun: 8 doors, 1 locked; Salvius Farm: 2 doors, 2 locked; Dawnstar: 2 doors, 0 locked; Langley's House Ext: 1 door, 0 locked; Granite Hill: 2 doors, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 1 locked; Skyrim: 1 door, 0 locked; Kynesgrove: 3 doors, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 5 doors, 5 locked; Morihaus' Refuge: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 1 locked; Skyrim: 1 door, 0 locked; Skyrim: 1 door, 0 locked; Forgotten City: 1 door, 0 locked; Alik'r Desert: 1 door, 0 locked; Alik'r Desert: 3 doors, 0 locked; Salas Kazas: 4 doors, 0 locked; Alik'r Desert: 3 doors, 2 locked; Alik'r Desert: 2 doors, 0 locked; Alik'r Desert: 1 door, 0 locked; Alik'r Desert: 3 doors, 0 locked; Alik'r Desert: 2 doors, 0 locked; Riften: 2 doors, 0 locked; Morvunskar: 1 door, 0 locked; Markarth Side: 4 doors, 2 locked; Granite Hill: 8 doors, 5 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 11. Bandits of Whiterun Hold (`ACFWhiterunBandits`, moretodo.esp:000803, moretodo.esp)

**Started by**

- Dialogue with Belethor, placed in Belethor's General Goods, "Bandits, huh? I'll take care of it.": SetStage 10 (when: the speaker is Belethor). Source: acf_mts_wr_getquest_belethor.Fragment_0 on INFO moretodo.esp:000809 (moretodo.esp). **script**
- Story manager node ACFMoreToSayWhiterunChangeLocationNode, event: change location; conditions up its parents: the place you enter is Whiterun. Source: ACFMoreToSayWhiterunChangeLocationNode moretodo.esp:00080E (moretodo.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell Belethor the bandit leader is dead.", shown at stage 100. Source: moretodo.esp:000803 QOBJ 100. **files**
- ACFWhiterunBandits (Bandits of Whiterun Hold) calls SetStage 100. Source: ACFWhiterunBanditBossScript.OnDeath on moretodo.esp:000803 (moretodo.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader at <Alias=BanditCampAlias> in <Alias=Hold>.". Source: moretodo.esp:000803 QOBJ 10. **files**
- Target alias BanditBossAlias (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: gold (an amount the script works out) (stage 200, QF_ACFWhiterunBandits_062190C3.fragment_4).

## 12. Giants of Whiterun Hold (`ACFWhiterunGiants`, moretodo.esp:000B05, moretodo.esp)

**Started by**

- Dialogue with Severio Pelagia, placed in Severio Pelagia's House, Severio Pelagias' House, "I'll take care of the giant.": SetStage 10 (when: the speaker is Severio Pelagia). Source: acf_mts_wr_getquest_severio.Fragment_0 on INFO moretodo.esp:000B0D (moretodo.esp). **script**
- Story manager node ACFMoreToSayWhiterunChangeLocationNode, event: change location; conditions up its parents: the place you enter is Whiterun. Source: ACFMoreToSayWhiterunChangeLocationNode moretodo.esp:00080E (moretodo.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell Severio Pelagia the giant is dead.", shown at stage 100. Source: moretodo.esp:000B05 QOBJ 100. **files**
- ACFWhiterunGiants (Giants of Whiterun Hold) calls SetStage 100. Source: ACFWhiterunGiantBossScript.OnDeath on moretodo.esp:000B05 (moretodo.esp). **script**

**Who and where**

- First objective: "Kill the giant at <Alias=GiantCampAlias> in <Alias=Hold>.". Source: moretodo.esp:000B05 QOBJ 10. **files**
- Target alias GiantBossAlias (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: gold (an amount the script works out) (stage 200, QF_ACFWhiterunGiants_0432E466.fragment_3).

## 13. Vampires of Whiterun Hold (`ACFWhiterunVampires`, moretodo.esp:000BEE, moretodo.esp)

**Started by**

- Dialogue with Hulda, placed in The Bannered Mare, "Vampires? I'll take care of them.": SetStage 10 (when: the speaker is Hulda). Source: acf_mts_wr_getquest_hulda.Fragment_0 on INFO moretodo.esp:000BF7 (moretodo.esp). **script**
- Story manager node ACFMoreToSayWhiterunChangeLocationNode, event: change location; conditions up its parents: the place you enter is Whiterun. Source: ACFMoreToSayWhiterunChangeLocationNode moretodo.esp:00080E (moretodo.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell Hulda the vampires have been dealt with.", shown at stage 100. Source: moretodo.esp:000BEE QOBJ 100. **files**
- ACFWhiterunVampires (Vampires of Whiterun Hold) calls SetStage 100. Source: ACFWhiterunVampireBossScript.OnDeath on moretodo.esp:000BEE (moretodo.esp). **script**

**Who and where**

- First objective: "Kill the vampires at <Alias=VampireDenAlias> in <Alias=Hold>.". Source: moretodo.esp:000BEE QOBJ 10. **files**
- Target alias VampireBossAlias (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: gold (an amount the script works out) (stage 200, QF_ACFWhiterunVampires_044081EF.fragment_4).

## 14. Sissel's Book (`ACFRoriksteadFreeform02`, sisselbookquest.esp:000889, sisselbookquest.esp)

**Started by**

- Dialogue with Sissel, placed in Lemkil's Farmhouse, "I can help you find your book.": SetStage 10 (when: the speaker is Sissel). Source: ACF_MTS_Rorikstead_TIF__01000894.Fragment_0 on INFO sisselbookquest.esp:000894 (sisselbookquest.esp). **script**
- Dialogue with Sissel, placed in Lemkil's Farmhouse, "Did you have something to say?": SetStage 5 (when: the speaker is Sissel; fn249 == 1; Before the Storm stage 110 done). Source: TIF__0100089A.Fragment_0 on INFO sisselbookquest.esp:00089A (sisselbookquest.esp). **script**
- Story manager node ACFMoreToSayRoriksteadChangeLocationNode, event: change location; conditions up its parents: the place you enter is Rorikstead. Source: ACFMoreToSayRoriksteadChangeLocationNode sisselbookquest.esp:00091A (sisselbookquest.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Bring one <Alias=SisselBookAlias> to <Alias.ShortName=SisselAlias>", shown at stage 100. Source: sisselbookquest.esp:000889 QOBJ 100. **files**
- ACFRoriksteadFreeform02 (Sissel's Book) calls SetStage 100. Source: ACFDefaultAddItemAliasScript.OnContainerChanged on sisselbookquest.esp:000889 (sisselbookquest.esp). **script**

**Who and where**

- First objective: "Find one <Alias=SisselBookAlias>.". Source: sisselbookquest.esp:000889 QOBJ 10. **files**
- Target alias SisselBookAlias (forced): Kolb and the Dragon (forced reference, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | To get into More to Say: ask Tasius Tragus "I'll take care of those Forsworn for you." (the speaker is Tasius Tragus), which starts Forsworn of Haafingar. |

## Routes into the first quest from outside the starts

### dialogue INFO moretodo.esp:000821

- Speaker: Tasius Tragus (Imperial). Named by: GetIsID.
- The player's prompt: "I'll take care of those Forsworn for you.".
- The reply: "Excellent. Show the rebels the futility of their cause.".
- When it's offered: the speaker is Tasius Tragus.
- What it does: SetStage 10 on ACFDragonbridgeForsworn (Forsworn of Haafingar). Source: ACF_MTS_DB__010008EC.Fragment_0 on INFO moretodo.esp:000821 (moretodo.esp); topic ACFDragonbridgeForswornStartBranchTopicYes. **script**
- In one sentence: Talk to Tasius Tragus (Imperial) and choose "I'll take care of those Forsworn for you.", when the speaker is Tasius Tragus: SetStage 10 on ACFDragonbridgeForsworn (Forsworn of Haafingar).

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
