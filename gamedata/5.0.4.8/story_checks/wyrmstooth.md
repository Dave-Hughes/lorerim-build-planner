# Start check: Wyrmstooth (`wyrmstooth`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Retrieving Embersunder (`WTAthirFavor`, Wyrmstooth.esp:3A1467, Wyrmstooth.esp)

**Started by**

- Dialogue with Athir, placed in Wyrmstooth Holder Cell, Wyrmstooth, "Is there anything I can do to help?": SetStage 10 (when: fn310 == 1; Retrieving Embersunder hasn't started; Barrow of the Wyrm stage >= 270; the speaker is Athir). Source: WT_TIF__023A1480.Fragment_0 on INFO Wyrmstooth.esp:3A1480 (Wyrmstooth.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:3A1467 DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Athir.", shown at stage 20. Source: Wyrmstooth.esp:3A1467 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Retrieve Embersunder.". Source: Wyrmstooth.esp:3A1467 QOBJ 10. **files**
- Target alias Embersunder (forced): Embersunder (forced reference, placed in Wyrmstooth Holder Cell, Wyrmstooth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Wyrmstooth Holder Cell, Wyrmstooth: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Barrow of the Wyrm (`WTBarrowOfTheWyrm`, Wyrmstooth.esp:028F01, Wyrmstooth.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- WTDragonHunt (Wyrmstooth) at stage 130 calls Start. Source: WT_QF_WTTEST_01022528.fragment_16 (Wyrmstooth.esp).
- WTDragonHunt (Wyrmstooth) at stage 130 calls SetStage 10. Source: WT_QF_WTTEST_01022528.fragment_16 (Wyrmstooth.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Follow Lurius Liore.", shown at stage 50. Source: Wyrmstooth.esp:028F01 QOBJ 50. **files**
- Dialogue with Lurius Liore, placed in Wyrmstooth Holder Cell, Wyrmstooth, "I'm ready to go.": SetStage 50 (when: Barrow of the Wyrm stage == 10; the speaker is Lurius Liore; GetDistance Skyrim.esm:04C488 <= 1500 or GetDistance Skyrim.esm:0A17A2 <= 4000). Reply: "Great. I'll let everyone know we're ready to set sail." Source: WT_TIF__01028F08.Fragment_0 on INFO Wyrmstooth.esp:028F08 (Wyrmstooth.esp). **script**
- On the way, a line of its own starts a scene while it is at its first objective: Dialogue with Lurius Liore, placed in Wyrmstooth Holder Cell, Wyrmstooth: StartScene (when: Barrow of the Wyrm stage == 50; the speaker is Lurius Liore) (scene Wyrmstooth.esp:0E80BB). Source: WT_TIF__010E80B4.Fragment_0 on INFO Wyrmstooth.esp:0E80B4 (Wyrmstooth.esp). **script**

**Who and where**

- First objective: "Speak to Lurius Liore at the docks in Solitude.". Source: Wyrmstooth.esp:028F01 QOBJ 10. **files**
- Target alias LuriusLiore (forced): Lurius Liore (forced reference, placed in Wyrmstooth Holder Cell, Wyrmstooth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Wyrmstooth Holder Cell, Wyrmstooth: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. Blind Robber's Cache (`WTBlindRobbersCache`, Wyrmstooth.esp:46DA2A, Wyrmstooth.esp)

**Started by**

- Read Hemvor's Note (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.stageHandling on BOOK Wyrmstooth.esp:6AB76F. **script**
- Read Hemvor's Note (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnActivate on BOOK Wyrmstooth.esp:6AB76F. **script**
- Read Hemvor's Note (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnEquipped on BOOK Wyrmstooth.esp:6AB76F. **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:46DA2A DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Unlock the door to Blind Robber's Cache.", shown at stage 20. Source: Wyrmstooth.esp:46DA2A QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Retrieve the key from Rolgar's corpse.". Source: Wyrmstooth.esp:46DA2A QOBJ 10. **files**
- Target alias Rolgar (forced): Rolgar (forced reference, placed in Dimfrost). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 4. Animal Bounty (`WTBountyAnimal`, Wyrmstooth.esp:4B9DEE, Wyrmstooth.esp)

**Started by**

- Read Animal Problem (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.stageHandling on BOOK Wyrmstooth.esp:4B9DFF. **script**
- Read Animal Problem (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnActivate on BOOK Wyrmstooth.esp:4B9DFF. **script**
- Read Animal Problem (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnEquipped on BOOK Wyrmstooth.esp:4B9DFF. **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:4B9DEE DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Kill the Bear south of Fort Valus.". Source: Wyrmstooth.esp:4B9DEE QOBJ 10. **files**
- Target alias Animal (forced): Bear (forced reference, placed in Wyrmstooth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 5. Bandit Bounty (`WTBountyBandit`, Wyrmstooth.esp:4B9DED, Wyrmstooth.esp)

**Started by**

- Read Marauder Warning (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.stageHandling on BOOK Wyrmstooth.esp:4B9DFB. **script**
- Read Marauder Warning (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnActivate on BOOK Wyrmstooth.esp:4B9DFB. **script**
- Read Marauder Warning (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnEquipped on BOOK Wyrmstooth.esp:4B9DFB. **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:4B9DED DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Kill the Marauder Clanlord at Cragwater Cavern.". Source: Wyrmstooth.esp:4B9DED QOBJ 10. **files**
- Target alias BanditBoss (forced): Marauder (forced reference, placed in Cragwater Cavern). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Cragwater Cavern: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 6. Vampire Bounty (`WTBountyVampire`, Wyrmstooth.esp:4B9DF0, Wyrmstooth.esp)

**Started by**

- Read Vampire Warning (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.stageHandling on BOOK Wyrmstooth.esp:BEDB3D. **script**
- Read Vampire Warning (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnActivate on BOOK Wyrmstooth.esp:BEDB3D. **script**
- Read Vampire Warning (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnEquipped on BOOK Wyrmstooth.esp:BEDB3D. **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:4B9DF0 DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Kill the Master Vampire at Bloodfrost Burrow.". Source: Wyrmstooth.esp:4B9DF0 QOBJ 10. **files**
- Target alias Vampire (forced): a marker (forced reference, placed in Bloodfrost Burrow). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Bloodfrost Burrow: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 7. Warlock Bounty (`WTBountyWarlock`, Wyrmstooth.esp:4B9DEF, Wyrmstooth.esp)

**Started by**

- Read Warlock Trouble (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.stageHandling on BOOK Wyrmstooth.esp:4B9E05. **script**
- Read Warlock Trouble (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnActivate on BOOK Wyrmstooth.esp:4B9E05. **script**
- Read Warlock Trouble (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnEquipped on BOOK Wyrmstooth.esp:4B9E05. **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:4B9DEF DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Kill the troublesome warlock at Krakevisa.". Source: Wyrmstooth.esp:4B9DEF QOBJ 10. **files**
- Target alias Warlock (forced): a marker (forced reference, placed in Krakevisa Midden, Krakevisa). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Krakevisa Midden, Krakevisa: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 8. Robbed Blind (`WTDaenlitFavor`, Wyrmstooth.esp:3A1469, Wyrmstooth.esp)

**Started by**

- Dialogue with Daenlit, placed in Wyrmstooth Holder Cell, Wyrmstooth, "Is there anything I can do to help?": SetStage 10 (when: fn310 == 1; Robbed Blind hasn't started; Barrow of the Wyrm stage >= 270; the speaker is Daenlit). Source: WT_TIF__023A14B8.Fragment_0 on INFO Wyrmstooth.esp:3A14B8 (Wyrmstooth.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:3A1469 DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Daenlit.", shown at stage 20. Source: Wyrmstooth.esp:3A1469 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Steal the necklace.". Source: Wyrmstooth.esp:3A1469 QOBJ 10. **files**
- Target alias NighthunterLocket (forced): Nighthunter's Locket (forced reference, placed in Wyrmstooth Holder Cell, Wyrmstooth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Wyrmstooth Holder Cell, Wyrmstooth: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 9. Wyrmstooth (`WTDragonHunt`, Wyrmstooth.esp:022528, Wyrmstooth.esp)

**Started by**

- WTWyrmstoothStarter (named "Wyrmstooth Starter" in its record), a helper quest calls at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; at stage 0 Start; WTWyrmstoothStarter is started by story manager node WT_WyrmstoothStarterNode (event: change location; no conditions). Sources: WT_QF__02AC9830.fragment_3 on Wyrmstooth.esp:AC9830. **script**
- Dialogue with Theodyn Bienne, placed in Wyrmstooth Holder Cell, Wyrmstooth, "Who are you and what do you want?": SetStage 10 (when: level >= WTStartLevel (now 10); GetQuestRunning Wyrmstooth == 1; Wyrmstooth hasn't started; the speaker is Theodyn Bienne). Source: WT_TIF__010237D7.Fragment_0 on INFO Wyrmstooth.esp:0237D7 (Wyrmstooth.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet up with the mercenaries on the road to Falkreath", shown at stage 20. Source: Wyrmstooth.esp:022528 QOBJ 20. **files**
- Dialogue with Lurius Liore, placed in Wyrmstooth Holder Cell, Wyrmstooth, "Where can I find them?": SetStage 20 (when: Wyrmstooth stage == 10; the speaker is Lurius Liore). Reply: "I'll mark the rendezvous point on your map." Source: WT_TIF__02597901.Fragment_1 on INFO Wyrmstooth.esp:597901 (Wyrmstooth.esp). **script**

**Who and where**

- First objective: "Speak to Lurius Liore at The Bannered Mare in Whiterun". Source: Wyrmstooth.esp:022528 QOBJ 10. **files**
- Target alias LuriusLiore (forced): Lurius Liore (forced reference, placed in Wyrmstooth Holder Cell, Wyrmstooth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Wyrmstooth Holder Cell, Wyrmstooth: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 10. Stickler in the Mud (`WTElmeraFavor`, Wyrmstooth.esp:3A146A, JELWyrmstoothCausePatch.esp)

**Started by**

- Dialogue with Elmera, placed in Wyrmstooth Holder Cell, Wyrmstooth, "Where are the Deadlands?": SetStage 10 (when: fn310 == 1; Stickler in the Mud hasn't started; Barrow of the Wyrm stage >= 270; the speaker is Elmera). Source: WT_TIF__023A14D8.Fragment_0 on INFO Wyrmstooth.esp:3A14D8 (Wyrmstooth.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:3A146A DNAM (JELWyrmstoothCausePatch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Elmera.". Source: Wyrmstooth.esp:3A146A QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Gather 30 spiddal sticks for Elmera (<Global=WTElmeraSpiddalCount>/30)". Source: Wyrmstooth.esp:3A146A QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: Skull (stage 30, WT_QF_WTElmeraFavor_023A146A.fragment_6).

## 11. Unwanted Guests (`WTKillThalmor`, Wyrmstooth.esp:3943A0, Wyrmstooth.esp)

**Started by**

- Dialogue with Alberthor, placed in Wyrmstooth Barrow Temple, Wyrmstooth Barrow, "I'll deal with the Thalmor.": SetStage 10 (when: Unwanted Guests hasn't started; Wrap Me Up stage >= 30; the speaker is Alberthor or the speaker is Alberthor). Source: WT_TIF__023943AF.Fragment_0 on INFO Wyrmstooth.esp:3943AF (Wyrmstooth.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:3943A0 DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Alberthor.", shown at stage 20. Source: Wyrmstooth.esp:3943A0 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill the Thalmor spies.". Source: Wyrmstooth.esp:3943A0 QOBJ 10. **files**
- Target alias ThalmorBoss (forced): a marker (forced reference, placed in Haetar's Cave). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Haetar's Cave: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 12. Reclaiming the Past (`WTPlayerHome`, Wyrmstooth.esp:28D0B5, Wyrmstooth.esp)

**Started by**

- Read Fort Valus Note (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.stageHandling on BOOK Wyrmstooth.esp:BEDB42. **script**
- Read Fort Valus Note (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnActivate on BOOK Wyrmstooth.esp:BEDB42. **script**
- Read Fort Valus Note (SetStage 10). Source: defaultSetStageOnCloseBookNotAlias.OnEquipped on BOOK Wyrmstooth.esp:BEDB42. **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:28D0B5 DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Lurius Liore about upgrading Fort Valus.", shown at stage 20. Source: Wyrmstooth.esp:28D0B5 QOBJ 20. **files**
- Dialogue with Lurius Liore, placed in Wyrmstooth Holder Cell, Wyrmstooth, "I'll buy the deed.": SetStage 20 (when: fn48 >= 30000; Barrow of the Wyrm stage >= 260; Reclaiming the Past stage == 10; the speaker is Lurius Liore). Reply: "Very Well. The deed to fort Valus is now in your hands, Dragonborn. Please do take good care of it." Source: WT_TIF__0128D0C6.Fragment_1 on INFO Wyrmstooth.esp:28D0C6 (Wyrmstooth.esp). **script**

**Who and where**

- First objective: "Ask Lurius Liore about Fort Valus.". Source: Wyrmstooth.esp:28D0B5 QOBJ 10. **files**
- Target alias LuriusLiore (forced): Lurius Liore (forced reference, placed in Wyrmstooth Holder Cell, Wyrmstooth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Wyrmstooth Holder Cell, Wyrmstooth: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 13. A Priceless Commodity (`WTPricelessCommodity`, Wyrmstooth.esp:48F992, Wyrmstooth.esp)

**Started by**

- Read Miner's Warning (SetStage 1). Source: defaultSetStageOnCloseBookNotAlias.stageHandling on BOOK Wyrmstooth.esp:BF1D1D. **script**
- Read Miner's Warning (SetStage 1). Source: defaultSetStageOnCloseBookNotAlias.OnActivate on BOOK Wyrmstooth.esp:BF1D1D. **script**
- Read Miner's Warning (SetStage 1). Source: defaultSetStageOnCloseBookNotAlias.OnEquipped on BOOK Wyrmstooth.esp:BF1D1D. **script**
- Dialogue with Bolmar, placed in Gronndal Grove, "Maybe I can help.": SetStage 10 (when: the speaker is Bolmar; A Priceless Commodity stage <= 1). Source: WT_TIF__0248F99D.Fragment_0 on INFO Wyrmstooth.esp:48F99D (Wyrmstooth.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:48F992 DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Investigate the spriggans at Gronndal Grove.", shown at stage 10. Source: Wyrmstooth.esp:48F992 QOBJ 10. **files**
- Dialogue with Bolmar, placed in Gronndal Grove, "Maybe I can help.": SetStage 10 (when: the speaker is Bolmar; A Priceless Commodity stage <= 1). Reply: "Truly? I appreciate the assistance, but do be wary. They are known to bend the will of animals against the unsuspecting and their magic is deadly." Source: WT_TIF__0248F99D.Fragment_0 on INFO Wyrmstooth.esp:48F99D (Wyrmstooth.esp). **script**

**Who and where**

- First objective: "Speak to Bolmar at Gronndal Grove.". Source: Wyrmstooth.esp:48F992 QOBJ 1. **files**
- Target alias Bolmar (forced): Bolmar (forced reference, placed in Gronndal Grove). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Gronndal Grove: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 14. Repaying a Debt (`WTShargamFavor`, Wyrmstooth.esp:3A1468, Wyrmstooth.esp)

**Started by**

- Dialogue with Shargam, placed in Wyrmstooth Holder Cell, Wyrmstooth, "Is there anything I can do to help?": SetStage 10 (when: fn310 == 1; Repaying a Debt hasn't started; Barrow of the Wyrm stage >= 270; the speaker is Shargam). Source: WT_TIF__023A149C.Fragment_0 on INFO Wyrmstooth.esp:3A149C (Wyrmstooth.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:3A1468 DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Shargam.", shown at stage 20. Source: Wyrmstooth.esp:3A1468 QOBJ 20. **files**
- Dialogue with Ulfgar, placed in Wyrmstooth Holder Cell, Wyrmstooth, "Shargam sent me. He wants you dead.": SetStage 15 (when: Repaying a Debt stage == 10; the speaker is Ulfgar). Reply: "Oh really? If that's what it's come to then so be it..." Source: WT_TIF__02B93282.Fragment_0 on INFO Wyrmstooth.esp:B93282 (Wyrmstooth.esp). **script**

**Who and where**

- First objective: "Kill Ulfgar.". Source: Wyrmstooth.esp:3A1468 QOBJ 10. **files**
- Target alias Ulfgar (forced): Ulfgar (forced reference, placed in Wyrmstooth Holder Cell, Wyrmstooth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Wyrmstooth Holder Cell, Wyrmstooth: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 15. A Debt Unpaid (`WTSignyFavor`, Wyrmstooth.esp:B5DA18, Wyrmstooth.esp)

**Started by**

- Dialogue with Signy, placed in Hulgard And Svenja's House, Hulgard and Svenja's House, "Maybe I could steal that ledger?": SetStage 10 (when: Barrow of the Wyrm completed; A Debt Unpaid hasn't started; the speaker is Signy). Source: WT_TIF__02B5DA1E.Fragment_0 on INFO Wyrmstooth.esp:B5DA1E (Wyrmstooth.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:B5DA18 DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Signy.", shown at stage 20. Source: Wyrmstooth.esp:B5DA18 QOBJ 20. **files**
- Read Debt Ledger (SetStage 20). Source: defaultsetstageonplayeracquireitem.OnContainerChanged on BOOK Wyrmstooth.esp:B5DA25. **script**

**Who and where**

- First objective: "Steal the ledger.". Source: Wyrmstooth.esp:B5DA18 QOBJ 10. **files**
- Target alias Ledger (forced): Debt Ledger (forced reference, placed in Wyrmstooth Holder Cell, Wyrmstooth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Wyrmstooth Holder Cell, Wyrmstooth: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 16. The Naked Nord (`WTTheNakedNord`, Wyrmstooth.esp:C651DA, Wyrmstooth.esp)

**Started by**

- WTRandomEnc42TheNakedNordStarter (named "Spawn in Gjalrunn" in its record), a helper quest at stage 10 calls Start; WTRandomEnc42TheNakedNordStarter is started by story manager node WTWildernessQuestNode (event: script event; GetEventData WTWEStart == 1; GetEventData WTWEStart == 1; global WEEnabled == 1 (now 1); GetEventData WTWEStart == 1 or GetEventData WTWERoadStart == 1 or GetEventData WEStart == 1 or GetEventData WERoadStart == 1); story manager node WTRoadQuestNode (event: script event; GetEventData WTWERoadStart == 1; GetEventData WTWERoadStart == 1; global WEEnabled == 1 (now 1); GetEventData WTWEStart == 1 or GetEventData WTWERoadStart == 1 or GetEventData WEStart == 1 or GetEventData WERoadStart == 1). Source: WT_QF__02C7399C.fragment_12 on Wyrmstooth.esp:C7399C (Wyrmstooth.esp). **script**
- Read Ja'Shavi-Dar's Note (SetStage 1). Source: defaultSetStageOnCloseBookNotAlias.stageHandling on BOOK Wyrmstooth.esp:C7399B. **script**
- Read Ja'Shavi-Dar's Note (SetStage 1). Source: defaultSetStageOnCloseBookNotAlias.OnActivate on BOOK Wyrmstooth.esp:C7399B. **script**
- Read Ja'Shavi-Dar's Note (SetStage 1). Source: defaultSetStageOnCloseBookNotAlias.OnEquipped on BOOK Wyrmstooth.esp:C7399B. **script**
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to the naked nord about his predicament.". Source: Wyrmstooth.esp:C651DA QOBJ 2. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Find the naked nord.". Source: Wyrmstooth.esp:C651DA QOBJ 1. **files**
- Target alias Gjalrunn (forced): Gjalrunn (forced reference, placed in Wyrmstooth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 17. Someone with Backbone (`WTUberEncounter`, Wyrmstooth.esp:2F1A74, Wyrmstooth.esp)

**Started by**

- Read History of Wyrmstooth (SetStage 5). Source: defaultSetStageOnCloseBookNotAlias.stageHandling on BOOK Wyrmstooth.esp:30EC1D. **script**
- Read History of Wyrmstooth (SetStage 5). Source: defaultSetStageOnCloseBookNotAlias.OnActivate on BOOK Wyrmstooth.esp:30EC1D. **script**
- Read History of Wyrmstooth (SetStage 5). Source: defaultSetStageOnCloseBookNotAlias.OnEquipped on BOOK Wyrmstooth.esp:30EC1D. **script**
- Dialogue with Vulom (named by scene WTVulomGreet, alias VulomTalkActivator of WTUberEncounter (Someone with Backbone) (forced)), placed in Tomb of Vulom: SetStage 10. Source: WT_TIF__012F1B15.Fragment_0 on INFO Wyrmstooth.esp:2F1B15 (Wyrmstooth.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:2F1A74 DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Follow the disembodied voice.", shown at stage 10. Source: Wyrmstooth.esp:2F1A74 QOBJ 10. **files**
- Dialogue with Vulom (named by scene WTVulomGreet, alias VulomTalkActivator of WTUberEncounter (Someone with Backbone) (forced)), placed in Tomb of Vulom: SetStage 10. Reply: "Long has it been since someone last set foot in my tomb. Approach my sarcophagus, mortal. I wish to speak with you." Source: WT_TIF__012F1B15.Fragment_0 on INFO Wyrmstooth.esp:2F1B15 (Wyrmstooth.esp). **script**

**Who and where**

- First objective: "Investigate Vulom's tomb.". Source: Wyrmstooth.esp:2F1A74 QOBJ 5. **files**
- Target alias VulomSkull (forced): Vulom (forced reference, placed in Tomb of Vulom). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Tomb of Vulom: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 18. A Howl Load of Trouble (`WTWolfFollower`, Wyrmstooth.esp:2E49AF, Wyrmstooth.esp)

**Started by**

- Read Dunyick's Request (SetStage 1). Source: defaultSetStageOnCloseBookNotAlias.stageHandling on BOOK Wyrmstooth.esp:BF1D19. **script**
- Read Dunyick's Request (SetStage 1). Source: defaultSetStageOnCloseBookNotAlias.OnActivate on BOOK Wyrmstooth.esp:BF1D19. **script**
- Read Dunyick's Request (SetStage 1). Source: defaultSetStageOnCloseBookNotAlias.OnEquipped on BOOK Wyrmstooth.esp:BF1D19. **script**
- Dialogue with Dunyick, placed in Wyrmstooth; Wyrmstooth, "Which direction did your wolf go?": SetStage 10 (when: A Howl Load of Trouble stage <= 1; the speaker is Dunyick). Source: WT_TIF__012E6C77.Fragment_1 on INFO Wyrmstooth.esp:2E6C77 (Wyrmstooth.esp). **script**
- Dialogue with Dunyick, placed in Wyrmstooth; Wyrmstooth, "I don't have the time for this.": SetStage 5 (when: A Howl Load of Trouble stage <= 1; the speaker is Dunyick). Source: WT_TIF__012E6C79.Fragment_0 on INFO Wyrmstooth.esp:2E6C79 (Wyrmstooth.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:2E49AF DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Find Dunyick's wolf Faelor.", shown at stage 10. Source: Wyrmstooth.esp:2E49AF QOBJ 10. **files**
- Dialogue with Dunyick, placed in Wyrmstooth; Wyrmstooth, "Which direction did your wolf go?": SetStage 10 (when: A Howl Load of Trouble stage <= 1; the speaker is Dunyick). Reply: "She headed down the hill, past the town and off towards the mountains. I've tried calling for her, but maybe she's too scared to return." Source: WT_TIF__012E6C77.Fragment_1 on INFO Wyrmstooth.esp:2E6C77 (Wyrmstooth.esp). **script**
- Dialogue with Dunyick, placed in Wyrmstooth; Wyrmstooth, "I don't have the time for this.": SetStage 5 (when: A Howl Load of Trouble stage <= 1; the speaker is Dunyick). Reply: "Oh well, how fortunate for you that you have more pressing matters to attend to." Source: WT_TIF__012E6C79.Fragment_0 on INFO Wyrmstooth.esp:2E6C79 (Wyrmstooth.esp). **script**
- Dialogue with Dunyick, placed in Wyrmstooth; Wyrmstooth, "Which direction did your wolf go?": SetStage 10 (when: A Howl Load of Trouble stage == 5; the speaker is Dunyick). Reply: "She headed down the hill, past the town and off towards the mountains. I've tried calling for her, but maybe she's too scared to return." Source: WT_TIF__012E6C7E.Fragment_0 on INFO Wyrmstooth.esp:2E6C7E (Wyrmstooth.esp). **script**

**Who and where**

- First objective: "Speak to Dunyick about the marauders.". Source: Wyrmstooth.esp:2E49AF QOBJ 1. **files**
- Target alias Dunyick (forced): Dunyick (forced reference, placed in Wyrmstooth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 19. Wrap Me Up (`WTWrapMeUp`, Wyrmstooth.esp:3920D5, Wyrmstooth.esp)

**Started by**

- Dialogue with Alberthor, placed in Wyrmstooth Barrow Temple, Wyrmstooth Barrow, "Is there anything I can help you with?": SetStage 10 (when: Wrap Me Up hasn't started; the speaker is Alberthor or the speaker is Alberthor). Source: WT_TIF__023920D9.Fragment_0 on INFO Wyrmstooth.esp:3920D9 (Wyrmstooth.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Wyrmstooth.esp:3920D5 DNAM (Wyrmstooth.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Deliver the wisp wrappings to Alberthor.". Source: Wyrmstooth.esp:3920D5 QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Find 8 wisp wrappings.  (<Global=WTWispWrappingsGlobalCount>/8)". Source: Wyrmstooth.esp:3920D5 QOBJ 10. **files**
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

### dialogue INFO Wyrmstooth.esp:3A1480

- Speaker: Athir (Redguard), placed in Wyrmstooth Holder Cell, Wyrmstooth. Named by: GetIsID.
- The player's prompt: "Is there anything I can do to help?".
- The reply: "I suppose there is something you could do for me." / "You see, I've been searching for a certain blade. An heirloom of sorts, that I'd like to get my hands on." / "The last anyone knows, it had fallen into the hands of the Forsworn of the Reach. I was hoping I'd stumble across it eventually." / "If you find it, I'd much appreciate it if you would bring it back to me. The blade's name is Embersunder." / "The one place I haven't yet been to is Hag's End, south-west of Solitude. The Forsworn there may have their hands on it.".
- When it's offered: fn310 == 1; Retrieving Embersunder hasn't started; Barrow of the Wyrm stage >= 270; the speaker is Athir.
- What it does: SetStage 10 on WTAthirFavor (Retrieving Embersunder). Source: WT_TIF__023A1480.Fragment_0 on INFO Wyrmstooth.esp:3A1480 (Wyrmstooth.esp); topic WTAthirFavorBranchTopic1. **script**
- In one sentence: Talk to Athir (Redguard) in Wyrmstooth Holder Cell, Wyrmstooth and choose "Is there anything I can do to help?", when fn310 == 1; Retrieving Embersunder hasn't started; Barrow of the Wyrm stage >= 270; the speaker is Athir: SetStage 10 on WTAthirFavor (Retrieving Embersunder).

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
