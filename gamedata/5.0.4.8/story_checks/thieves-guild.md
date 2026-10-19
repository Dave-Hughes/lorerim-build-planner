# Start check: The Thieves Guild (`thieves-guild`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. A Chance Arrangement (`TG00`, Skyrim.esm:021556, Skyrim.esm)

**Started by**

- Dialogue with Brynjolf, placed in Riften: SetStage 5 (when: the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1). Source: TIF__000352E5.Fragment_0 on INFO Skyrim.esm:0352E5 (Skyrim.esm). **script**
- Dialogue with Brynjolf, placed in Riften: SetStage 5 (when: the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1). Source: TIF__00020ADC.Fragment_0 on INFO Skyrim.esm:020ADC (Skyrim.esm). **script**
- Dialogue with Brynjolf, placed in Riften: SetStage 8 (when: fn67 == 0; the speaker is Brynjolf). Source: TIF__00038AB3.Fragment_0 on INFO Skyrim.esm:038AB3 (Skyrim.esm). **script**
- Dialogue with Brynjolf, placed in Riften: SetStage 8 (when: the speaker is Brynjolf; fn67 == 1). Source: TIF__00020BD9.Fragment_0 on INFO Skyrim.esm:020BD9 (Skyrim.esm). **script**
- Dialogue with Brynjolf, placed in Riften: SetStage 5 (when: the speaker is Brynjolf; A Cornered Rat stage 5 done; A Cornered Rat stage 20 not done; fn629 == 1). Source: TIF__00097FCB.Fragment_0 on INFO Skyrim.esm:097FCB (Skyrim.esm). **script**
- Dialogue with Brynjolf, placed in Riften: SetStage 5 (when: the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1). Source: TIF__000C99E8.Fragment_0 on INFO Skyrim.esm:0C99E8 (Skyrim.esm). **script**
- Dialogue with Brynjolf, placed in Riften: SetStage 5 (when: the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1). Source: TIF__000C99E9.Fragment_0 on INFO Skyrim.esm:0C99E9 (Skyrim.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:021556 DNAM (Skyrim.esm). **files**
- (First objective shown at stage 8; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- TGLeadership (Under New Management) at stage 0 calls SetStage 200. Source: QF_TGLeadership_000D7D69.fragment_2 (Unofficial Skyrim Special Edition Patch.esp).
- TG02B (Meet the Family) at stage 0 calls SetStage 200. Source: QF_TG02B_00084ABD.fragment_0 (Skyrim.esm).
- TG02 (Loud and Clear) at stage 0 calls SetStage 200. Source: QF_TG02_0002154E.fragment_0 (Skyrim.esm).

**Who and where**

- First objective: "Meet Brynjolf during daytime". Source: Skyrim.esm:021556 QOBJ 8. **files**
- Target alias BrynjolfAlias (unique): Brynjolf (unique actor, placed in Riften). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Riften: 23 doors, 11 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Taking Care of Business (`TG01`, Skyrim.esm:01F326, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- TG00 (A Chance Arrangement) at stage 200 calls SetStage 10. Source: QF_TG00_00021556.fragment_10 on Skyrim.esm:021556 (Skyrim.esm). **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10. Sources: USKP_VersionTrackingScript.ProcessRetroScripts, USKP_VersionTrackingScript.OnInit, USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9. **script**
- USKPRetroactive130 (named "Retroactive fixes for 1.3.0" in its record), a helper quest calls SetStage 10; SetStage 10; SetStage 10; SetStage 10. Sources: USKPRetroactive130Script.Process on Unofficial Skyrim Special Edition Patch.esp:012F33. **script**
- USKPRetroactive127 (named "Retroactive fixes for 1.2.7" in its record), a helper quest with Odfel calls SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10. Sources: USKPRetroactive127Script.Process on Unofficial Skyrim Special Edition Patch.esp:0187DE. **script**
- USKPRetroactive131 (named "Retroactive fixes for 1.3.1" in its record), a helper quest with Varnius, Gloth calls SetStage 10; SetStage 10. Sources: USKPRetroactive131Script.Process on Unofficial Skyrim Special Edition Patch.esp:01906F. **script**
- USKPRetroactive132 (named "Retroactive fixes for 1.3.2" in its record), a helper quest with SindingGhost, SindingHuman calls SetStage 10. Source: USKPRetroactive132Script.Process on Unofficial Skyrim Special Edition Patch.esp:02C3E7 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- TGLeadership (Under New Management) at stage 0 calls SetStage 200. Source: QF_TGLeadership_000D7D69.fragment_2 (Unofficial Skyrim Special Edition Patch.esp).
- TG02B (Meet the Family) at stage 0 calls SetStage 200. Source: QF_TG02B_00084ABD.fragment_0 (Skyrim.esm).
- TG02 (Loud and Clear) at stage 0 calls SetStage 200. Source: QF_TG02_0002154E.fragment_0 (Skyrim.esm).

**Who and where**

- First objective: "Locate Brynjolf at the Ragged Flagon". Source: Skyrim.esm:01F326 QOBJ 10. **files**
- Target alias BrynjolfMarkerAlias (forced): a marker (forced reference, placed in The Ragged Flagon). **files**
- Target alias BrynjolfAlias (unique): Brynjolf (unique actor, placed in Riften). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Ragged Flagon: 4 doors, 0 locked; Riften: 23 doors, 11 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. Loud and Clear (`TG02`, Skyrim.esm:02154E, Skyrim.esm)

**Started by**

- TG01 (Taking Care of Business) at stage 200 calls SetStage 10. Source: QF_TG01_0001F326.fragment_22 on Skyrim.esm:01F326 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- TGLeadership (Under New Management) at stage 0 calls SetStage 200. Source: QF_TGLeadership_000D7D69.fragment_2 (Unofficial Skyrim Special Edition Patch.esp).
- TG02B (Meet the Family) at stage 0 calls SetStage 20. Source: QF_TG02B_00084ABD.fragment_0 (Skyrim.esm).
- TG02B (Meet the Family) at stage 0 calls SetStage 30. Source: QF_TG02B_00084ABD.fragment_0 (Skyrim.esm).
- TG02B (Meet the Family) at stage 0 calls SetStage 35. Source: QF_TG02B_00084ABD.fragment_0 (Skyrim.esm).
- TGLarceny (The Litany of Larceny) at stage 0 calls SetStage 0. Source: QF_TGLarceny_0004C6C2.fragment_54 (Update.esm).
- TGLarceny (The Litany of Larceny) at stage 0 calls SetStage 20. Source: QF_TGLarceny_0004C6C2.fragment_54 (Update.esm).
- and 3 more in the JSON

**Who and where**

- First objective: "Follow Brynjolf". Source: Skyrim.esm:02154E QOBJ 10. **files**
- Target alias TG02Brynjolf (unique): Brynjolf (unique actor, placed in Riften). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Riften: 23 doors, 11 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 4. Dampened Spirits (`TG03`, Skyrim.esm:02154F, Update.esm)

**Started by**

- TG02 (Loud and Clear) at stage 200 calls SetStage 10. Source: QF_TG02_0002154E.fragment_12 on Skyrim.esm:02154E (Skyrim.esm). **script**
- Patch1_4_UpdateQuest, a helper quest at stage 0 calls SetStage 10. Source: QF_Patch1_4_UpdateQuest_01000803.fragment_0 on Update.esm:000803 (Update.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- TG03SP (Dampened Spirits Scene Quest) at stage 20 calls SetStage 80. Source: QF_TG03SP_000549F3.fragment_37 (Skyrim.esm).

**Who and where**

- First objective: "Speak to Maven Black-Briar". Source: Skyrim.esm:02154F QOBJ 10. **files**
- Target alias TG03MavenAlias (unique): Maven Black-Briar (unique actor, placed in Black-Briar Manor). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Black-Briar Manor: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 5. Scoundrel's Folly (`TG04`, Skyrim.esm:021550, Skyrim.esm)

**Started by**

- TG03 (Dampened Spirits) at stage 200 calls SetStage 10. Source: QF_TG03_0002154F.fragment_24 on Skyrim.esm:02154F (Update.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Mercer Frey". Source: Skyrim.esm:021550 QOBJ 10. **files**
- Target alias Mercer (unique): Mercer Frey (unique actor, placed in The Ragged Flagon - Cistern, Thieves Guild Headquarters). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Ragged Flagon - Cistern, Thieves Guild Headquarters: 6 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 6. Speaking With Silence (`TG05`, Skyrim.esm:021551, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- TG04 (Scoundrel's Folly) at stage 200 calls SetStage 10. Source: QF_TG04_00021550.fragment_14 on Skyrim.esm:021550 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Meet Mercer Frey outside Snow Veil Sanctum". Source: Skyrim.esm:021551 QOBJ 10. **files**
- Target alias TG05MercerAlias (unique): Mercer Frey (unique actor, placed in The Ragged Flagon - Cistern, Thieves Guild Headquarters). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Ragged Flagon - Cistern, Thieves Guild Headquarters: 6 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Skyrim.esm:080C25 (stage 200, QF_TG05_00021551.fragment_17); TGRewardPoisonAllBest (levelled: an item) (stage 200, QF_TG05_00021551.fragment_17); TGRewardPoisonAllBest (levelled: an item) (stage 200, QF_TG05_00021551.fragment_17); TGRewardPoisonAllBest (levelled: an item) (stage 200, QF_TG05_00021551.fragment_17); TGRewardPoisonAllBest (levelled: an item) (stage 200, QF_TG05_00021551.fragment_17).

## 7. Hard Answers (`TG06`, Skyrim.esm:021552, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- TG05 (Speaking With Silence) at stage 200 calls SetStage 10. Source: QF_TG05_00021551.fragment_17 on Skyrim.esm:021551 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak with Enthir". Source: Skyrim.esm:021552 QOBJ 10. **files**
- Target alias EnthirAlias (unique): Enthir (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LItemWeaponNightingaleSword (levelled: Nightingale Blade) (stage 200, QF_TG06_00021552.fragment_20).

## 8. The Pursuit (`TG07`, Skyrim.esm:021553, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- TG06 (Hard Answers) at stage 200 calls SetStage 10. Source: QF_TG06_00021552.fragment_20 on Skyrim.esm:021552 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Meet Karliah at the Ragged Flagon". Source: Skyrim.esm:021553 QOBJ 10. **files**
- Target alias KarliahAlias (unique): Karliah (unique actor, placed in Snow Veil Sanctum). **files**
- Target alias TG07KarliahMarkerAlias (forced): a marker (forced reference, placed in The Ragged Flagon). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Snow Veil Sanctum: 2 doors, 0 locked; The Ragged Flagon: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 9. Trinity Restored (`TG08A`, Skyrim.esm:057F99, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- TG07 (The Pursuit) at stage 200 calls SetStage 10. Source: QF_TG07_00021553.fragment_18 on Skyrim.esm:021553 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Listen to Karliah". Source: Skyrim.esm:057F99 QOBJ 10. **files**
- Target alias KarliahAlias (unique): Karliah (unique actor, placed in Snow Veil Sanctum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Snow Veil Sanctum: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 10. Blindsighted (`TG08B`, Skyrim.esm:021554, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- TG08A (Trinity Restored) at stage 200 calls SetStage 10. Source: QF_TG08A_00057F99.fragment_20 on Skyrim.esm:057F99 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Travel to Irkngthand". Source: Skyrim.esm:021554 QOBJ 10. **files**
- Target alias TG08MeetMarkerAlias (forced): a marker (forced reference, placed in Irkngthand Grand Cavern, Irkngthand). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Irkngthand Grand Cavern, Irkngthand: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LItemWeaponNightingaleBow (levelled: Nightingale Bow) (stage 200, QF_TG08_00021554.fragment_20).

## 11. Darkness Returns (`TG09`, Skyrim.esm:021555, Wintersun - Faiths of Skyrim.esp)

**Started by**

- TG08B (Blindsighted) at stage 200 calls SetStage 10. Source: QF_TG08_00021554.fragment_20 on Skyrim.esm:021554 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Enter the Twilight Sepulcher". Source: Skyrim.esm:021555 QOBJ 10. **files**
- Target alias TG09GallusStartMarkerAlias (forced): a marker (forced reference, placed in Twilight Sepulcher). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Twilight Sepulcher: 4 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 12. Reparations (`TGBan`, Skyrim.esm:0B03A2, Skyrim.esm)

**Started by**

- Dialogue with Mercer Frey, placed in The Ragged Flagon - Cistern, Thieves Guild Headquarters: SetStage 20 (when: the speaker is Mercer Frey; global TGBanToggle == 1 (now ?); Reparations stage == 10). Source: TIF__000B0396.Fragment_0 on INFO Skyrim.esm:0B0396 (Skyrim.esm). **script**
- Dialogue with Brynjolf, placed in Riften: SetStage 20 (when: the speaker is Brynjolf; global TGBanToggle == 1 (now ?); Reparations stage == 10). Source: TIF__000B0398.Fragment_0 on INFO Skyrim.esm:0B0398 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Delvin Mallory, placed in The Ragged Flagon: SetStage 20 (when: the speaker is Delvin Mallory; global TGBanToggle == 1 (now ?); Reparations stage == 10). Source: TIF__000B039A.Fragment_0 on INFO Skyrim.esm:0B039A (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Vex". Source: Skyrim.esm:0B03A2 QOBJ 10. **files**
- Target alias TGBanVex (unique): Vex (unique actor, placed in The Ragged Flagon). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Ragged Flagon: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 13. No Stone Unturned (`TGCrown`, Skyrim.esm:09DD77, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Maul, placed in Riften: SetStage 5 (when: the speaker is Maul; No Stone Unturned stage 5 not done; No Stone Unturned stage 20 not done; Riften Maul Dialogue stage 30 done; GetItemCount Unusual Gem >= 1). Source: TIF__0006D481.Fragment_0 on INFO Skyrim.esm:06D481 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:09DD77 DNAM (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- TG02B (Meet the Family) at stage 40 calls SetStage 10. Source: QF_TG02B_00084ABD.fragment_9 (Skyrim.esm).

**Who and where**

- First objective: "Become a full member of the Thieves Guild". Source: Skyrim.esm:09DD77 QOBJ 5. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 14. Under New Management (`TGLeadership`, Skyrim.esm:0D7D69, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- TGRShell (named "Thieves Guild Radiant Shell" in its record), a helper quest at stage 197 calls SetStage 10. Source: QF_TGRShell_00028923.fragment_65 on Skyrim.esm:028923 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Brynjolf about becoming the Guild Master". Source: Skyrim.esm:0D7D69 QOBJ 10. **files**
- Target alias TGLeadershipBrynjolf (unique): Brynjolf (unique actor, placed in Riften). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Riften: 23 doors, 11 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 15. The Burglary Job (`TGRBE`, Skyrim.esm:02893B, Skyrim.esm)

**Started by**

- Story manager node TRGBEQuestNode, event: script event; conditions up its parents: fn576 == 1. Source: TRGBEQuestNode Skyrim.esm:0609AE (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Retrieve the <Alias=ItemToGet> from <Alias=WealthyHome> in <Alias=City>". Source: Skyrim.esm:02893B QOBJ 10. **files**
- Target alias ItemToGet (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: TGRewardGoldRadiant (levelled: gold) (stage 200, QF_TGRBE_0002893B.fragment_4).

## 16. The Shill Job (`TGRDU`, Skyrim.esm:015D24, Skyrim.esm)

**Started by**

- Story manager node TGRDUQuestNode, event: script event; conditions up its parents: fn576 == 1. Source: TGRDUQuestNode Skyrim.esm:0609AF (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Plant the <Alias=Evidence> in <Alias=WealthyHome> in <Alias=City>". Source: Skyrim.esm:015D24 QOBJ 10. **files**
- Target alias WeathyHomeChest (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: TGRewardGoldRadiant (levelled: gold) (stage 200, QF_TGRDU_00015D24.fragment_5).

## 17. The Numbers Job (`TGRFO`, Skyrim.esm:06098E, Skyrim.esm)

**Started by**

- Story manager node TGRFOQuestNode, event: script event; conditions up its parents: fn576 == 1. Source: TGRFOQuestNode Skyrim.esm:0609B0 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Make changes in the ledger at <Alias=Business> in <Alias=City>". Source: Skyrim.esm:06098E QOBJ 10. **files**
- Target alias Ledger (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: TGRewardGoldRadiant (levelled: gold) (stage 200, QF_TGRFO_0006098E.fragment_2).

## 18. The Fishing Job (`TGRGF`, Skyrim.esm:028922, CFTO.esp)

**Started by**

- Story manager node TGRGFQuestNode, event: script event; conditions up its parents: fn576 == 1. Source: TGRGFQuestNode Skyrim.esm:0609B1 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Retrieve <Alias=ItemToGet> from <Alias=Mark> in <Alias=City>". Source: Skyrim.esm:028922 QOBJ 10. **files**
- Target alias Mark (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: TGRewardGoldRadiant (levelled: gold) (stage 200, QF_TGRGF_00028922.fragment_3).

## 19. The Sweep Job (`TGRHC`, Skyrim.esm:028936, Skyrim.esm)

**Started by**

- Story manager node TGRHCQuestNode, event: script event; conditions up its parents: fn576 == 1. Source: TGRHCQuestNode Skyrim.esm:0609B2 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Clear <Alias=WealthyHome> in <Alias=City> of valuables (<Global=TGRHCValuablesStolen>/<Global=TGRHCValuablesTotal>)". Source: Skyrim.esm:028936 QOBJ 10. **files**
- Target alias WealthItem01 (run time): nothing the records or scripts name. **files**
- Target alias WealthItem02 (run time): nothing the records or scripts name. **files**
- Target alias WealthItem03 (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: TGRewardGoldRadiant (levelled: gold) (stage 200, QF_TGRHC_00028936.fragment_4).

## 20. The Bedlam Job (`TGRNT`, Skyrim.esm:060990, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Story manager node TGRNTQuestNode, event: script event; conditions up its parents: fn576 == 1. Source: TGRNTQuestNode Skyrim.esm:0609B4 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Steal <Global=TGRNGold> gold in goods from <Alias=City>". Source: Skyrim.esm:060990 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: TGRewardGoldRadiant (levelled: gold) (stage 200, QF_TGRNT_00060990.fragment_4).

## 21. The Heist Job (`TGRSL`, Skyrim.esm:02893E, Skyrim.esm)

**Started by**

- Story manager node TGRSLQuestNode, event: script event; conditions up its parents: fn576 == 1. Source: TGRSLQuestNode Skyrim.esm:0609B5 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Retrieve the <Alias=ItemToGet> from <Alias=Business> in <Alias=City>". Source: Skyrim.esm:02893E QOBJ 10. **files**
- Target alias ItemToGet (created): Skyrim.esm:052B56 (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: TGRewardGoldRadiant (levelled: gold) (stage 200, QF_TGRSL_0002893E.fragment_0).

## 22. Silver Lining (`TGTQ01`, Skyrim.esm:0799DF, Skyrim.esm)

**Started by**

- TGRShell (named "Thieves Guild Radiant Shell" in its record), a helper quest at stage 192 calls SetStage 10. Source: QF_TGRShell_00028923.fragment_64 on Skyrim.esm:028923 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Endon the Silversmith". Source: Skyrim.esm:0799DF QOBJ 10. **files**
- Target alias TGTQ01EndonAlias (unique): Endon (unique actor, placed in Endon's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Endon's House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: TGRewardRandomLightArmor (levelled: an item) (stage 200, QF_TGTQ01_000799DF.fragment_0).

## 23. The Dainty Sload (`TGTQ02`, Skyrim.esm:0799E0, Vittorias Alternate Wedding.esp)

**Started by**

- TGRShell (named "Thieves Guild Radiant Shell" in its record), a helper quest at stage 172 calls SetStage 10. Source: QF_TGRShell_00028923.fragment_60 on Skyrim.esm:028923 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Erikur". Source: Skyrim.esm:0799E0 QOBJ 10. **files**
- Target alias TGTQ02ErikurAlias (unique): Erikur (unique actor, placed in Erikur's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Erikur's House: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: TGSpellTomes (levelled: an item) (stage 200, QF_TGTQ02_000799E0.fragment_9).

## 24. Imitation Amnesty (`TGTQ03`, Skyrim.esm:0799E1, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- TGRShell (named "Thieves Guild Radiant Shell" in its record), a helper quest at stage 162 calls SetStage 10. Source: QF_TGRShell_00028923.fragment_59 on Skyrim.esm:028923 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Olfrid Battle-Born". Source: Skyrim.esm:0799E1 QOBJ 10. **files**
- Target alias TGTQ03OlfridAlias (unique): Olfrid Battle-Born (unique actor, placed in House of Clan Battle-Born). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: House of Clan Battle-Born: 3 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: LItemEnchRingAll (levelled: an item) (stage 200, QF_TGTQ03_000799E1.fragment_12).

## 25. Summerset Shadows (`TGTQ04`, Skyrim.esm:0799E2, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- TGRShell (named "Thieves Guild Radiant Shell" in its record), a helper quest at stage 182 calls SetStage 10. Source: QF_TGRShell_00028923.fragment_62 on Skyrim.esm:028923 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Torsten Cruel-Sea". Source: Skyrim.esm:0799E2 QOBJ 10. **files**
- Target alias TGTQ04TorstenAlias (unique): Torsten Cruel-Sea (unique actor, placed in House of Clan Cruel-Sea). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: House of Clan Cruel-Sea: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: TGEnchJewelry (levelled: an item) (stage 200, QF_TGTQ04_000799E2.fragment_0).

## 26. TG00 Maul Handler (`TG00MaulHandler`, Skyrim.esm:064A14, Skyrim.esm)

**Started by**

- Dialogue with Maul, placed in Riften: Start (when: the speaker is Maul; Riften Maul Dialogue stage 30 done; GetInFaction Thieves' Guild == 0). Source: TIF__000649F7.Fragment_1 on INFO Skyrim.esm:0649F7 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- TG00MiscHandler (TG00 Misc Handler) at stage 10 calls SetStage 200. Source: QF_TG00MiscHandler_000C99EF.fragment_0 (Skyrim.esm).

**Who and where**

- First objective: "Talk to Brynjolf about joining the Thieves Guild". Source: Skyrim.esm:064A14 QOBJ 10. **files**
- Target alias TG00MiscHandlerBrynjolfAlias (unique): Brynjolf (unique actor, placed in Riften). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Riften: 23 doors, 11 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 27. TG00 Misc Handler (`TG00MiscHandler`, Skyrim.esm:0C99EF, Skyrim.esm)

**Started by**

- TG00 (A Chance Arrangement) at stage 5 calls Start. Source: QF_TG00_00021556.fragment_18 on Skyrim.esm:021556 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Listen to Brynjolf's scheme". Source: Skyrim.esm:0C99EF QOBJ 10. **files**
- Target alias TG00MiscHandlerBrynjolfAlias (unique): Brynjolf (unique actor, placed in Riften). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Riften: 23 doors, 11 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 28. Meet the Family (`TG02B`, Skyrim.esm:084ABD, Skyrim.esm)

**Started by**

- TG02 (Loud and Clear) at stage 35 calls Start. Source: QF_TG02_0002154E.fragment_24 on Skyrim.esm:02154E (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- TGLarceny (The Litany of Larceny) at stage 0 calls SetStage 20. Source: QF_TGLarceny_0004C6C2.fragment_54 (Update.esm).
- TGLarceny (The Litany of Larceny) at stage 0 calls SetStage 30. Source: QF_TGLarceny_0004C6C2.fragment_54 (Update.esm).

**Who and where**

- First objective: "Learn more about the Thieves Guild from Vex". Source: Skyrim.esm:084ABD QOBJ 10. **files**
- Target alias TG02BVexAlias (unique): Vex (unique actor, placed in The Ragged Flagon). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Ragged Flagon: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 29. Dampened Spirits Scene Quest (`TG03SP`, Skyrim.esm:0549F3, Skyrim.esm)

**Started by**

- TG03 (Dampened Spirits) at stage 70 calls SetStage 10. Source: QF_TG03_0002154F.fragment_35 on Skyrim.esm:02154F (Update.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Maven Black-Briar.". Source: Skyrim.esm:0549F3 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 30. East Empire Warehouse Dialogue and Handler (`TG04EECHandler`, Skyrim.esm:1007FC, Skyrim.esm)

**Started by**

- Dialogue with someone the line does not name, placed in Solitude: SetStage 10 (when: global TG04EECCheck == 1 (now ?); Rise in the East stage < 10; fn1 < 512; the speaker is Skyrim.esm:1007FA or the speaker is Skyrim.esm:1007FB). Source: TIF__001007EC.Fragment_0 on INFO Skyrim.esm:1007EC (Unofficial Skyrim Special Edition Patch.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:1007FC DNAM (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Orthas Endario about the East Empire Company's problems". Source: Skyrim.esm:1007FC QOBJ 10. **files**
- Target alias TG04EECOrthas (unique): Orthus Endario (unique actor, placed in East Empire Company). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: East Empire Company: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 31. Scoundrel's Folly Post (`TG04Post`, Skyrim.esm:0D3AC6, Skyrim.esm)

**Started by**

- TG04 (Scoundrel's Folly) at stage 200 calls SetStage 10. Source: QF_TG04_00021550.fragment_14 on Skyrim.esm:021550 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Tonilia about exchanging a piece of armor". Source: Skyrim.esm:0D3AC6 QOBJ 10. **files**
- Target alias TG04PostTonilia (unique): Tonilia (unique actor, placed in The Ragged Flagon). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Ragged Flagon: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 32. No Stone Unturned Misc Handler (`TGCrownMisc`, Skyrim.esm:06D585, Skyrim.esm)

**Started by**

- TGCrown (No Stone Unturned) calls SetStage 10. Source: TGCrownQuestScript.GemCheck on Skyrim.esm:09DD77 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Ri'saad, placed in Salvius Farm: SetStage 10 (when: GetItemCount Unusual Gem >= 1; the player has at least 1000 gold; Thieves Guild Caravan Fence Quest stage 30 not done; the speaker is Ri'saad). Source: TIF__01002DD2.Fragment_2 on INFO Sell Stones of Barenziah.esp:00080B (Sell Stones of Barenziah.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:06D585 DNAM (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring the Unusual Gem to an appraiser". Source: Skyrim.esm:06D585 QOBJ 10. **files**
- Target alias TGCrownMiscMaulAlias (unique): Maul (unique actor, placed in Riften). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Riften: 10 doors, 4 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 33. Thieves Guild Caravan Fence Quest (`TGFenceCaravan`, Skyrim.esm:0D8E40, Update.esm)

**Started by**

- TGStatus (named "Thieves Guild Status Quest" in its record), a helper quest with TGStatusDelvinAlias, TGStatusVexAlias, TGStatusSyndusAlias at stage 30 calls SetStage 10; TGStatus is started by TG02 (Loud and Clear) at stage 20 (Start). Source: QF_TGStatus_000AC9D1.fragment_4 on Skyrim.esm:0AC9D1 (Skyrim.esm). **script**
- Dialogue with Tonilia, placed in The Ragged Flagon: SetStage 20 (when: the speaker is Tonilia; Thieves Guild Caravan Fence Quest stage == 10). Source: TIF__000D8E31.Fragment_0 on INFO Skyrim.esm:0D8E31 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver Moon Sugar to Ri'saad". Source: Skyrim.esm:0D8E40 QOBJ 10. **files**
- Target alias TGFCRisaadAlias (unique): Ri'saad (unique actor, placed in Salvius Farm). **files**

**Needs**

- The door from Mill Maintenance, Markarth Mill Maintenance into Salvius Farm needs the Key to Savantus Mill Maintenance, carried by Savantus Ingenius. Source: Lux Via - Markarth Entrance and Farm Overhaul.esp:0008B8 (Lux Via - Markarth Entrance and Farm Overhaul.esp). **files**
- The door from Hilarius Farmhouse into Salvius Farm needs the Key to Hilarius Farmhouse, carried by Hilarius; Vagdis Hilarius. Source: Lux Via - Markarth Entrance and Farm Overhaul.esp:000888 (Lux Via - Markarth Entrance and Farm Overhaul.esp). **files**
- Ways in: Salvius Farm: 2 doors, 2 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 34. The Litany of Larceny (`TGLarceny`, Skyrim.esm:04C6C2, Update.esm)

**Started by**

- TG02B (Meet the Family) at stage 10 calls SetStage 10. Source: QF_TG02B_00084ABD.fragment_5 on Skyrim.esm:084ABD (Skyrim.esm). **script**
- TG08B (Blindsighted) at stage 0 calls Start. Source: QF_TG08_00021554.fragment_0 on Skyrim.esm:021554 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Return the Queen Bee Statue to Delvin". Source: Skyrim.esm:04C6C2 QOBJ 20. **files**
- Target alias TGLDelvin (unique): Delvin Mallory (unique actor, placed in The Ragged Flagon). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Ragged Flagon: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 35. Paid in Full (`DLC2TGQuest`, Dragonborn.esm:02AD26, Dragonborn.esm)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Glover Mallory, placed in Glover Mallory's House: SetStage 10 (when: the speaker is Glover Mallory; Meet the Family stage 200 done; Paid in Full stage == 5; global DLC2TGGlobal01 == 0 (now ?)). Source: DLC2_TIF__0202AD1E.Fragment_0 on INFO Dragonborn.esm:02AD1E (Dragonborn.esm). **script**
- Dialogue with Glover Mallory, placed in Glover Mallory's House: SetStage 5 (when: the speaker is Glover Mallory; Meet the Family stage 200 done; Paid in Full hasn't started). Source: DLC2_TIF__0202AD23.Fragment_1 on INFO Dragonborn.esm:02AD23 (Dragonborn.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Recover the Bonemold Formula for Glover Mallory". Source: Dragonborn.esm:02AD26 QOBJ 10. **files**
- Target alias DLC2TGEsmondAlias (unique): Esmond Tyne (unique actor, placed in Castle Karstaag Caverns, Castle Karstaag Ruins). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Castle Karstaag Caverns, Castle Karstaag Ruins: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Glover's Guild Key (stage 200, DLC2_QF_DLC2TGQuest_0202AD26.fragment_5); Glover Mallory's House Key (stage 200, DLC2_QF_DLC2TGQuest_0202AD26.fragment_5).

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

### dialogue INFO Skyrim.esm:0352E5

- Speaker: Brynjolf (Nord), placed in Riften. Named by: GetIsID.
- The player's prompt: "Break the law? Are you kidding?".
- The reply: "Sorry... I usually have a nose for this kind of thing." / "Never mind then, lad. If you change your mind, come find me.".
- When it's offered: the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1.
- What it does: SetStage 5 on TG00 (A Chance Arrangement). Source: TIF__000352E5.Fragment_0 on INFO Skyrim.esm:0352E5 (Skyrim.esm); topic TG00BrynjolfIntroBranch07. **script**
- In one sentence: Talk to Brynjolf (Nord) in Riften and choose "Break the law? Are you kidding?", when the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1: SetStage 5 on TG00 (A Chance Arrangement).

### dialogue INFO Skyrim.esm:020ADC

- Speaker: Brynjolf (Nord), placed in Riften. Named by: GetIsID.
- The player's prompt: "Break the law? Are you kidding?".
- The reply: "Sorry... I usually have a nose for this kind of thing." / "Never mind then, lass. If you change your mind, come find me.".
- When it's offered: the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1.
- What it does: SetStage 5 on TG00 (A Chance Arrangement). Source: TIF__00020ADC.Fragment_0 on INFO Skyrim.esm:020ADC (Skyrim.esm); topic TG00BrynjolfIntroBranch07. **script**
- In one sentence: Talk to Brynjolf (Nord) in Riften and choose "Break the law? Are you kidding?", when the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1: SetStage 5 on TG00 (A Chance Arrangement).

### dialogue INFO Skyrim.esm:038AB3

- Speaker: Brynjolf (Nord), placed in Riften. Named by: GetIsID.
- The player's prompt: "Why plant the ring on Brand-Shei?".
- The reply: "There's someone that wants to see him put out of business permanently. That's all you need to know." / "Now, you tell me when you're ready and we'll get started.".
- When it's offered: fn67 == 0; the speaker is Brynjolf.
- What it does: SetStage 8 on TG00 (A Chance Arrangement). Source: TIF__00038AB3.Fragment_0 on INFO Skyrim.esm:038AB3 (Skyrim.esm); topic TG00BrynjolfIntroBranch09. **script**
- In one sentence: Talk to Brynjolf (Nord) in Riften and choose "Why plant the ring on Brand-Shei?", when fn67 == 0; the speaker is Brynjolf: SetStage 8 on TG00 (A Chance Arrangement).

### dialogue INFO Skyrim.esm:020BD9

- Speaker: Brynjolf (Nord), placed in Riften. Named by: GetIsID.
- The player's prompt: "Why plant the ring on Brand-Shei?".
- The reply: "There's someone that wants to see him put out of business permanently. That's all you need to know." / "I'll be out in the market all day, from eight in the morning until eight in the evening." / "Meet me then if you've still got the stomach for it.".
- When it's offered: the speaker is Brynjolf; fn67 == 1.
- What it does: SetStage 8 on TG00 (A Chance Arrangement). Source: TIF__00020BD9.Fragment_0 on INFO Skyrim.esm:020BD9 (Skyrim.esm); topic TG00BrynjolfIntroBranch09. **script**
- In one sentence: Talk to Brynjolf (Nord) in Riften and choose "Why plant the ring on Brand-Shei?", when the speaker is Brynjolf; fn67 == 1: SetStage 8 on TG00 (A Chance Arrangement).

### dialogue INFO Skyrim.esm:097FCB

- Speaker: Brynjolf (Nord), placed in Riften. Named by: GetIsID.
- The player's prompt: "".
- The reply: "Your guy's hiding out in the Ratway Warrens and paying us good coin for nobody to know about it. Well, until now that is." / "Tell you what. Go ahead and deal with your business for now. When you're done, find me and we'll deal with mine.".
- When it's offered: the speaker is Brynjolf; A Cornered Rat stage 5 done; A Cornered Rat stage 20 not done; fn629 == 1.
- What it does: SetStage 5 on TG00 (A Chance Arrangement). Source: TIF__00097FCB.Fragment_0 on INFO Skyrim.esm:097FCB (Skyrim.esm); topic TG00BrynjolfIntroMQ203D1. **script**
- In one sentence: Talk to Brynjolf (Nord) in Riften, when the speaker is Brynjolf; A Cornered Rat stage 5 done; A Cornered Rat stage 20 not done; fn629 == 1: SetStage 5 on TG00 (A Chance Arrangement).

### dialogue INFO Skyrim.esm:0C99E8

- Speaker: Brynjolf (Nord), placed in Riften. Named by: GetIsID.
- The player's prompt: "".
- The reply: "I can take a hint, lad. You want to make some coin, come find me.".
- When it's offered: the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1.
- What it does: SetStage 5 on TG00 (A Chance Arrangement). Source: TIF__000C99E8.Fragment_0 on INFO Skyrim.esm:0C99E8 (Skyrim.esm); topic TG00BrynjolfWalkAwayTopic. **script**
- In one sentence: Talk to Brynjolf (Nord) in Riften, when the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1: SetStage 5 on TG00 (A Chance Arrangement).

### dialogue INFO Skyrim.esm:0C99E9

- Speaker: Brynjolf (Nord), placed in Riften. Named by: GetIsID.
- The player's prompt: "".
- The reply: "I can take a hint, lass. You want to make some coin, come find me.".
- When it's offered: the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1.
- What it does: SetStage 5 on TG00 (A Chance Arrangement). Source: TIF__000C99E9.Fragment_0 on INFO Skyrim.esm:0C99E9 (Skyrim.esm); topic TG00BrynjolfWalkAwayTopic. **script**
- In one sentence: Talk to Brynjolf (Nord) in Riften, when the speaker is Brynjolf; A Chance Arrangement stage < 5; fn70 == 1: SetStage 5 on TG00 (A Chance Arrangement).

## The payoff

- **Dragonslayer** (completes at 200): nothing is given on its completing stages.
- **Paarthurnax** (completes at 99, 100): nothing is given on its completing stages.

## Three questions

**Is Skyrim.esm:0242BA MQ105, and is stage 160 the one that completes it?** Yes: Skyrim.esm:0242BA is MQ105 (The Way of the Voice), and stage 160 is its only completing stage.

**Who starts The Horn of Jurgen Windcaller, and where?** None:

**Does Dragonborn's cultist node read Timing is Everything's level (25 in its settings.ini), or something else?** Timing is Everything's setting iTIE_MinimumLevel:Dragonborn = 25 (settings.ini in Timing is Everything SE - Settings Loader).

- Node DLC2CultistAmbushNode001 (LoreRim - Global Modifiers.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 1 (now 1); fn359 == 0; The Way of the Voice stage >= 160; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode002 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 2 (now 1); fn359 == 0; The Horn of Jurgen Windcaller stage >= 60; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode003 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 3 (now 1); fn359 == 0; A Blade in the Dark stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode004 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 4 (now 1); fn359 == 0; Alduin's Wall stage >= 280; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode005 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 5 (now 1); fn359 == 0; The Throat of the World stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode006 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 6 (now 1); fn359 == 0; Elder Knowledge stage >= 100; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode007 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 7 (now 1); fn359 == 0; Alduin's Bane stage >= 220; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode008 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 8 (now 1); fn359 == 0; Dragonslayer stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode000 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 0 (now 1); fn359 == 0; Dragon Rising stage >= 90; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**

## Run-time values

Settings loaders the story's globals touch, and whether the script the game runs reads their settings.ini:

- TimingIsEverything: script TIE_MCMScript on TimingIsEverything.esp:005E3B; the copy that wins is /sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/[LoreRim] - SPID Files and Script Overwrites/scripts/tie_mcmscript.pex (extends SKI_ConfigBase); it carries no settings.ini value into a global, so the globals keep their record values unless the player changes them in the menu.
- Wyrmstooth: script WT_MCMScript on Wyrmstooth.esp:AC1487; the copy that wins is /sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/Wyrmstooth - Settings Loader/Scripts/WT_MCMScript.pex (extends MCM_ConfigBase); it reads its MCM Helper settings and sets globals from them.

- Timing is Everything: Dragonborn level setting 25 (settings.ini in Timing is Everything SE - Settings Loader), meant for DLC2CultistAttackMinLevel_KRY (record 25.0 from TimingIsEverything.esp; in game 25.0; **files**).
- Wyrmstooth: WTStartLevel is 10 in a new game (record 20.0 in Requiem - Wyrmstooth.esp). Why: OnConfigInit runs once when the menu registers in a new game; it sets `migrated` and calls LoadSettings, which goes on only while bEnabled:Maintenance is set (it is 1) and then calls Load, which reads iWTGeneralRequirementsMinimalLevel:Requirements (10, settings.ini in Wyrmstooth - Settings Loader) and sets WTStartLevel to it; MigrateToMCMHelper, which would copy the global's record value (20.0) into that setting, runs only from OnGameReload or OnConfigOpen while `migrated` is false, and OnConfigInit has already set it, so a new game never migrates (an older save made before the loader would); OnGameReload reloads the settings only when bLoadSettingsonReload:Maintenance is set; it is 0, so later loads keep whatever the global holds. Source: WT_MCMScript (/sessions/rcw-01rljfmmykuy5htdzjdqi4v9/mnt/LoreRim/mods/Wyrmstooth - Settings Loader/Scripts/WT_MCMScript.pex). **run time**

Scripts the records name that aren't in the install (259); calls inside them can't be read. Full list in the JSON.
