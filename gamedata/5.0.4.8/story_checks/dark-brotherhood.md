# Start check: The Dark Brotherhood (`dark-brotherhood`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Innocence Lost (`DB01`, Skyrim.esm:01EA50, Innocence Lost - Quest Expansion.esp)

**Started by**

- Dialogue with Aventus Aretino, placed in Aretino Residence, "Contract?": SetStage 20 (when: the speaker is Aventus Aretino). Source: TIF__0001F339.Fragment_0 on INFO Skyrim.esm:01F339 (Innocence Lost - Quest Expansion.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:01EA50 DNAM (Innocence Lost - Quest Expansion.esp). **files**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB10 (Death Incarnate) at stage 0 calls SetStage 200. Source: QF_DB10_0003CEDA.fragment_0 (Skyrim.esm).
- DB04a (The Silence Has Been Broken) at stage 0 calls SetStage 200. Source: QF_DB04a_0002AD16.fragment_0 (Skyrim.esm).
- DB02a (Sanctuary) at stage 0 calls SetStage 200. Source: QF_DB02a_00022F47.fragment_0 (Skyrim.esm).
- DB11 (Hail Sithis!) at stage 0 calls SetStage 200. Source: QF_DB11_0001EA59.fragment_16 (Skyrim.esm).
- DB09 (To Kill an Empire) at stage 0 calls SetStage 200. Source: QF_DB09_0001EA58.fragment_0 (Skyrim.esm).
- DB08 (Recipe for Disaster) at stage 0 calls SetStage 200. Source: QF_DB08_0001EA57.fragment_12 (Skyrim.esm).
- and 5 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Kill Grelod the Kind or find an alternative way to deal with her", shown at stage 20. Source: Skyrim.esm:01EA50 QOBJ 20. **files**
- Dialogue with Aventus Aretino, placed in Aretino Residence, "Contract?": SetStage 20 (when: the speaker is Aventus Aretino). Reply: "My mother, she... she died. I... I'm all alone now. So they sent me to that terrible orphanage in Riften. Honorhall." Source: TIF__0001F339.Fragment_0 on INFO Skyrim.esm:01F339 (Innocence Lost - Quest Expansion.esp). **script**

**Who and where**

- First objective: "Talk to Aventus Aretino". Source: Skyrim.esm:01EA50 QOBJ 5. **files**
- Target alias AventusAretinoAlias (unique): Aventus Aretino (unique actor, placed in Aretino Residence). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Aretino Residence: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Where You Hang Your Enemy's Head... (`DarkBrotherhoodSanctuaryRepair`, Skyrim.esm:087BA2, Skyrim.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB11 (Hail Sithis!) at stage 200 calls SetStage 10. Source: QF_DB11_0001EA59.fragment_24 (Skyrim.esm).

**Who and where**

- First objective: "Employ Delvin Mallory's services". Source: Skyrim.esm:087BA2 QOBJ 10. **files**
- Target alias DelvinMalloryAlias (unique): Delvin Mallory (unique actor, placed in The Ragged Flagon). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Ragged Flagon: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. Delayed Burial (`DB01Misc`, Skyrim.esm:01EA4F, CutContentRestoration - Whiterun Stables Scene.esp)

**Started by**

- Dialogue with Cicero, placed in Loreius Farm, "Is there some way I can help?": SetStage 10 (when: the speaker is Cicero). Source: TIF__000550E0.Fragment_0 on INFO Skyrim.esm:0550E0 (Escapeweave.esp). **script**
- Dialogue with Vantus Loreius, placed in Loreius Farm, Loreius Farmhouse, "I'll do it. I'll report Cicero to the guard.": SetStage 20 (when: the speaker is Vantus Loreius). Source: TIF__000550E6.Fragment_0 on INFO Skyrim.esm:0550E6 (Skyrim.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:01EA4F DNAM (CutContentRestoration - Whiterun Stables Scene.esp). **files**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB02 (With Friends Like These...) at stage 50 calls SetStage 215. Source: QF_DB02_0001EA51.fragment_24 (Unofficial Skyrim Special Edition Patch.esp).
- DB02 (With Friends Like These...) at stage 50 calls SetStage 210. Source: QF_DB02_0001EA51.fragment_19 (Unofficial Skyrim Special Edition Patch.esp).
- DB02 (With Friends Like These...) at stage 50 calls SetStage 215. Source: QF_DB02_0001EA51.fragment_19 (Unofficial Skyrim Special Edition Patch.esp).
- DB02 (With Friends Like These...) at stage 50 calls SetStage 215. Source: QF_DB02_0001EA51.fragment_19 (Unofficial Skyrim Special Edition Patch.esp).
- DB02 (With Friends Like These...) at stage 220 calls SetStage 210. Source: QF_DB02_0001EA51.fragment_20 (Unofficial Skyrim Special Edition Patch.esp).
- DB02 (With Friends Like These...) at stage 220 calls SetStage 215. Source: QF_DB02_0001EA51.fragment_26 (Unofficial Skyrim Special Edition Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Convince Loreius to fix the wheel", shown at stage 10. Source: Skyrim.esm:01EA4F QOBJ 10. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Talk to the strange jester". Source: Skyrim.esm:01EA4F QOBJ 5. **files**
- Target alias CiceroRoadAlias (forced): Cicero (forced reference, placed in Loreius Farm). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 4. With Friends Like These... (`DB02`, Skyrim.esm:01EA51, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- APS_GuildBrotherhood, a helper quest with Astrid at stage 0 calls SetStage 10; APS_GuildBrotherhood is started by nothing in the records or scripts (**unread**). Source: QF_APS_GuildBrotherhood_063D36E7.fragment_0 on AlternatePerspective.esp:3D36E7 (AlternatePerspective.esp). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "(Remain silent)": SetStage 10 (when: the speaker is Astrid). Source: TIF__00020BE0.Fragment_0 on INFO Skyrim.esm:020BE0 (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "All right, I'll do it. I'll kill one of them.": SetStage 10 (when: the speaker is Astrid). Source: TIF__00020BE1.Fragment_0 on INFO Skyrim.esm:020BE1 (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "I'll have no part of this insanity.": SetStage 10 (when: Innocence Lost stage != 201; the speaker is Astrid). Source: TIF__00020BE2.Fragment_0 on INFO Skyrim.esm:020BE2 (Destroy the Dark Brotherhood - Quest Expansion.esp). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "DB02AstridWalkAwayTopic": SetStage 10 (when: Innocence Lost stage != 201; the speaker is Astrid). Source: TIF__000CEFB9.Fragment_1 on INFO Skyrim.esm:0CEFB9 (Destroy the Dark Brotherhood - Quest Expansion.esp). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "I'll have no part of this insanity.": SetStage 10 (when: Innocence Lost stage == 201; the speaker is Astrid). Source: DB_GrelodAlt_2.Fragment_0 on INFO Destroy the Dark Brotherhood - Quest Expansion.esp:0008B0 (Destroy the Dark Brotherhood - Quest Expansion.esp). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "DB02AstridWalkAwayTopic": SetStage 10 (when: Innocence Lost stage == 201; the speaker is Astrid). Source: DBGrelod_Alt1.Fragment_0 on INFO Destroy the Dark Brotherhood - Quest Expansion.esp:0008A7 (Destroy the Dark Brotherhood - Quest Expansion.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB10 (Death Incarnate) at stage 0 calls SetStage 200. Source: QF_DB10_0003CEDA.fragment_0 (Skyrim.esm).
- DB04a (The Silence Has Been Broken) at stage 0 calls SetStage 200. Source: QF_DB04a_0002AD16.fragment_0 (Skyrim.esm).
- DB02a (Sanctuary) at stage 0 calls SetStage 200. Source: QF_DB02a_00022F47.fragment_0 (Skyrim.esm).
- DB11 (Hail Sithis!) at stage 0 calls SetStage 200. Source: QF_DB11_0001EA59.fragment_16 (Skyrim.esm).
- DB09 (To Kill an Empire) at stage 0 calls SetStage 200. Source: QF_DB09_0001EA58.fragment_0 (Skyrim.esm).
- DB08 (Recipe for Disaster) at stage 0 calls SetStage 200. Source: QF_DB08_0001EA57.fragment_12 (Skyrim.esm).
- and 5 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak with Astrid", shown at stage 30. Source: Skyrim.esm:01EA51 QOBJ 30. **files**
- DarkSideContractDialogue, a helper quest calls SetStage 20; DarkSideContractDialogue is started by dialogue with Nazir (Start); the start-game flag. Source: QF_DarkSideContractDialogue_00024151.Fragment_0 on Skyrim.esm:024151 (Skyrim.esm). **script**
- APS_GuildBrotherhood, a helper quest with Astrid at stage 0 calls SetStage 30; APS_GuildBrotherhood is started by nothing in the records or scripts (**unread**). Source: QF_APS_GuildBrotherhood_063D36E7.fragment_0 on AlternatePerspective.esp:3D36E7 (AlternatePerspective.esp). **script**

**Who and where**

- First objective: "Kill one of the captives". Source: Skyrim.esm:01EA51 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 5. Sanctuary (`DB02a`, Skyrim.esm:022F47, Skyrim.esm)

**Started by**

- Dialogue with Astrid, placed in Abandoned Shack, "(Remain silent)": SetStage 10 (when: the speaker is Astrid). Source: TIF__00020BDF.Fragment_0 on INFO Skyrim.esm:020BDF (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "When do I get to kill someone?": SetStage 10 (when: the speaker is Astrid). Source: TIF__00020BDE.Fragment_0 on INFO Skyrim.esm:020BDE (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "I am honored to be a part of your Family, Astrid.": SetStage 10 (when: With Friends Like These... stage == 50; the speaker is Astrid). Source: TIF__00020BDD.Fragment_0 on INFO Skyrim.esm:020BDD (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DBSideContract12 (Contract: Kill Safia) at stage 0 calls SetStage 200. Source: QF_DBSideContract12_0001EA68.fragment_0 (Skyrim.esm).
- DBSideContract11 (Contract: Kill Helvard) at stage 0 calls SetStage 20. Source: QF_DBSideContract11_0001EA67.fragment_0 (Unofficial Skyrim Special Edition Patch.esp).
- DBSideContract10 (Contract: Kill Maluril) at stage 0 calls SetStage 200. Source: QF_DBSideContract10_0001EA66.fragment_0 (Skyrim.esm).
- DBSideContract09 (Contract: Kill Agnis) at stage 0 calls SetStage 200. Source: QF_DBSideContract09_0001EA65.fragment_0 (Skyrim.esm).
- DBSideContract08 (Contract: Kill Anoriath) at stage 0 calls SetStage 20. Source: QF_DBSideContract08_0001EA64.fragment_0 (Skyrim.esm).
- DBSideContract07 (Contract: Kill Ma'randru-jo) at stage 0 calls SetStage 20. Source: QF_DBSideContract07_0001EA63.fragment_10 (Skyrim.esm).
- and 7 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Receive the first set of contracts from Nazir", shown at stage 20. Source: Skyrim.esm:022F47 QOBJ 20. **files**
- DBSideContract11 (Contract: Kill Helvard) at stage 0 calls SetStage 20. Source: QF_DBSideContract11_0001EA67.fragment_0 on Skyrim.esm:01EA67 (Unofficial Skyrim Special Edition Patch.esp). **script**
- DBSideContract08 (Contract: Kill Anoriath) at stage 0 calls SetStage 20. Source: QF_DBSideContract08_0001EA64.fragment_0 on Skyrim.esm:01EA64 (Skyrim.esm). **script**
- DBSideContract07 (Contract: Kill Ma'randru-jo) at stage 0 calls SetStage 20. Source: QF_DBSideContract07_0001EA63.fragment_10 on Skyrim.esm:01EA63 (Skyrim.esm). **script**
- DBSideContract05 (Contract: Kill Lurbuk) at stage 0 calls SetStage 20. Source: QF_DBSideContract05_0001EA61.fragment_0 on Skyrim.esm:01EA61 (Skyrim.esm). **script**
- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Sounds simple enough.": SetStage 20 (when: the speaker is Nazir). Reply: "It is. These aren't particularly glamorous assassinations, I'll be honest. Don't pay much, either.  " Source: TIF__00020015.Fragment_0 on INFO Skyrim.esm:020015 (Skyrim.esm). **script**

**Who and where**

- First objective: "Speak with Nazir". Source: Skyrim.esm:022F47 QOBJ 10. **files**
- Target alias NazirAlias (forced): Nazir (forced reference, placed in Dark Brotherhood Sanctuary). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dark Brotherhood Sanctuary: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 6. Mourning Never Comes (`DB03`, Skyrim.esm:01EA52, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary: SetStage 5 (when: the speaker is Nazir; fn629 >= 1; fn629 <= 3; Mourning Never Comes stage < 10). Source: TIF__000AAAC9.Fragment_0 on INFO Skyrim.esm:0AAAC9 (Skyrim.esm). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB10 (Death Incarnate) at stage 0 calls SetStage 200. Source: QF_DB10_0003CEDA.fragment_0 (Skyrim.esm).
- DB04a (The Silence Has Been Broken) at stage 0 calls SetStage 200. Source: QF_DB04a_0002AD16.fragment_0 (Skyrim.esm).
- DBrecurring (The Dark Brotherhood Forever) at stage 0 calls SetStage 200. Source: QF_DBRecurring_0001EA5A.fragment_3 (LoreRim - Global Modifiers.esp).
- DB11 (Hail Sithis!) at stage 0 calls SetStage 200. Source: QF_DB11_0001EA59.fragment_16 (Skyrim.esm).
- DB09 (To Kill an Empire) at stage 0 calls SetStage 200. Source: QF_DB09_0001EA58.fragment_0 (Skyrim.esm).
- DB08 (Recipe for Disaster) at stage 0 calls SetStage 200. Source: QF_DB08_0001EA57.fragment_12 (Skyrim.esm).
- and 5 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Muiri", shown at stage 10. Source: Skyrim.esm:01EA52 QOBJ 10. **files**
- Dialogue with Astrid, placed in Abandoned Shack, "Anything else?": SetStage 10 (when: the speaker is Astrid). Reply: "Just do whatever the contact wishes. Be professional, represent us well, and get the job done." Source: TIF__0001FED8.Fragment_0 on INFO Skyrim.esm:01FED8 (Skyrim.esm). **script**

**Who and where**

- First objective: "Speak with Astrid". Source: Skyrim.esm:01EA52 QOBJ 5. **files**
- Target alias AstridAlias (forced): Astrid (forced reference, placed in Abandoned Shack). **files**

**Needs**

- The door from Abandoned Shack into Abandoned Shack needs the Abandoned Shack Key. Source: Skyrim.esm:050F1F (Skyrim.esm). **files**
- Ways in: Abandoned Shack: 1 door, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 7. Whispers in the Dark (`DB04`, Skyrim.esm:01EA53, Skyrim.esm)

**Started by**

- DB03 (Mourning Never Comes) calls at stage 50 SetStage 1; at stage 200 SetStage 1. Sources: QF_DB03_0001EA52.fragment_39, QF_DB03_0001EA52.fragment_14 on Skyrim.esm:01EA52. **script**
- Dialogue with Astrid, placed in Abandoned Shack, "(Remain silent)": SetStage 10 (when: the speaker is Astrid). Source: TIF__000403F6.Fragment_0 on INFO Skyrim.esm:0403F6 (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "Yes, the coffin. It's perfect.": SetStage 10 (when: the speaker is Astrid). Source: TIF__000403F7.Fragment_0 on INFO Skyrim.esm:0403F7 (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "But that seems so... disrespectful.": SetStage 10 (when: the speaker is Astrid). Source: TIF__00040361.Fragment_0 on INFO Skyrim.esm:040361 (Skyrim.esm). **script**
- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary: SetStage 5 (when: fn629 == 4; the speaker is Nazir). Source: TIF__000A34FD.Fragment_0 on INFO Skyrim.esm:0A34FD (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB10 (Death Incarnate) at stage 0 calls SetStage 200. Source: QF_DB10_0003CEDA.fragment_0 (Skyrim.esm).
- DB04a (The Silence Has Been Broken) at stage 0 calls SetStage 200. Source: QF_DB04a_0002AD16.fragment_0 (Skyrim.esm).
- DBSideContract04 (Contract: Kill Hern) at stage 0 calls SetStage 200. Source: QF_DBSideContract04_0001EA60.fragment_0 (Skyrim.esm).
- DB11 (Hail Sithis!) at stage 0 calls SetStage 200. Source: QF_DB11_0001EA59.fragment_16 (Skyrim.esm).
- DB09 (To Kill an Empire) at stage 0 calls SetStage 200. Source: QF_DB09_0001EA58.fragment_0 (Skyrim.esm).
- DB08 (Recipe for Disaster) at stage 0 calls SetStage 200. Source: QF_DB08_0001EA57.fragment_12 (Skyrim.esm).
- and 3 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Eavesdrop on Cicero", shown at stage 20. Source: Skyrim.esm:01EA53 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Hide in the Night Mother's coffin". Source: Skyrim.esm:01EA53 QOBJ 10. **files**
- Target alias CoffinAlias (forced): Night Mother's Coffin (forced reference, placed in Dark Brotherhood Sanctuary). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dark Brotherhood Sanctuary: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 8. The Silence Has Been Broken (`DB04a`, Skyrim.esm:02AD16, Skyrim.esm)

**Started by**

- DB04 (Whispers in the Dark) at stage 40 calls Start. Source: QF_DB04_0001EA53.fragment_12 on Skyrim.esm:01EA53 (Skyrim.esm). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB10 (Death Incarnate) at stage 0 calls SetStage 200. Source: QF_DB10_0003CEDA.fragment_0 (Skyrim.esm).
- DBSideContract06 (Contract: Kill Deekus) at stage 0 calls SetStage 200. Source: QF_DBSideContract06_0001EA62.fragment_0 (Skyrim.esm).
- DB11 (Hail Sithis!) at stage 0 calls SetStage 200. Source: QF_DB11_0001EA59.fragment_16 (Skyrim.esm).
- DB09 (To Kill an Empire) at stage 0 calls SetStage 200. Source: QF_DB09_0001EA58.fragment_0 (Skyrim.esm).
- DB08 (Recipe for Disaster) at stage 0 calls SetStage 200. Source: QF_DB08_0001EA57.fragment_12 (Skyrim.esm).
- DB07 (The Cure for Madness) at stage 0 calls SetStage 200. Source: QF_DB07_0001EA56.fragment_0 (Skyrim.esm).
- and 2 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak with Amaund Motierre", shown at stage 10. Source: Skyrim.esm:02AD16 QOBJ 10. **files**
- Dialogue with Astrid, placed in Abandoned Shack: SetStage 10 (when: the speaker is Astrid). Reply: "Look. Something is happening here. I'm not sure entirely what that something is, but... Well, we need to find out." Source: TIF_DB04aAstridBeginTopic_0002AD0A.Fragment_0 on INFO Skyrim.esm:02AD0A (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "(Remain silent)": SetStage 10 (when: the speaker is Astrid). Reply: "Look. Something is happening here. I'm not sure entirely what that something is, but... Well, we need to find out." Source: TIF__0002AD07.Fragment_0 on INFO Skyrim.esm:02AD07 (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "Has the time come? Will I now serve the Night Mother?": SetStage 10 (when: the speaker is Astrid). Reply: "Look. Something is happening here. I'm not sure entirely what that something is, but... Well, we need to find out." Source: TIF__0002AD06.Fragment_0 on INFO Skyrim.esm:02AD06 (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "Of course, Astrid. What is it?": SetStage 10 (when: the speaker is Astrid). Reply: "Look. Something is happening here. I'm not sure entirely what that something is, but... Well, we need to find out." Source: TIF__0002AD05.Fragment_0 on INFO Skyrim.esm:02AD05 (Skyrim.esm). **script**

**Who and where**

- First objective: "Speak with Astrid". Source: Skyrim.esm:02AD16 QOBJ 5. **files**
- Target alias AstridAlias (forced): Astrid (forced reference, placed in Abandoned Shack). **files**

**Needs**

- The door from Abandoned Shack into Abandoned Shack needs the Abandoned Shack Key. Source: Skyrim.esm:050F1F (Skyrim.esm). **files**
- Ways in: Abandoned Shack: 1 door, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 9. Bound Until Death (`DB05`, Skyrim.esm:01EA54, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Astrid, placed in Abandoned Shack, "Who's the target?": SetStage 10 (when: the speaker is Astrid). Source: TIF__00037B5A.Fragment_0 on INFO Skyrim.esm:037B5A (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "(Remain silent)": SetStage 10 (when: the speaker is Astrid). Source: TIF__000E0E54.Fragment_0 on INFO Skyrim.esm:0E0E54 (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "Enough talk. Just tell me who to kill.": SetStage 10 (when: the speaker is Astrid). Source: TIF__000E0E55.Fragment_0 on INFO Skyrim.esm:0E0E55 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB10 (Death Incarnate) at stage 0 calls SetStage 200. Source: QF_DB10_0003CEDA.fragment_0 (Skyrim.esm).
- DB11 (Hail Sithis!) at stage 0 calls SetStage 200. Source: QF_DB11_0001EA59.fragment_16 (Skyrim.esm).
- DB09 (To Kill an Empire) at stage 0 calls SetStage 200. Source: QF_DB09_0001EA58.fragment_0 (Skyrim.esm).
- DB08 (Recipe for Disaster) at stage 0 calls SetStage 200. Source: QF_DB08_0001EA57.fragment_12 (Skyrim.esm).
- DB07 (The Cure for Madness) at stage 0 calls SetStage 200. Source: QF_DB07_0001EA56.fragment_0 (Skyrim.esm).
- DB06 (Breaching Security) at stage 0 calls SetStage 20. Source: QF_DB06_0001EA55.fragment_0 (Skyrim.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Astrid", shown at stage 20. Source: Skyrim.esm:01EA54 QOBJ 20. **files**
- DB06 (Breaching Security) at stage 0 calls SetStage 20. Source: QF_DB06_0001EA55.fragment_0 on Skyrim.esm:01EA55 (Skyrim.esm). **script**

**Who and where**

- First objective: "Kill Vittoria Vici". Source: Skyrim.esm:01EA54 QOBJ 10. **files**
- Target alias VittoriaViciAlias (unique): Vittoria Vici (unique actor, placed in Vittoria Vici's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Vittoria Vici's House: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 10. Breaching Security (`DB06`, Skyrim.esm:01EA55, Skyrim.esm)

**Started by**

- Dialogue with Astrid, placed in Abandoned Shack, "(Remain silent)": SetStage 5 (when: fn629 == 1; the speaker is Astrid). Source: TIF__00037B52.Fragment_0 on INFO Skyrim.esm:037B52 (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "(Remain silent)": SetStage 5 (when: fn629 == 0; the speaker is Astrid). Source: TIF__000618A6.Fragment_0 on INFO Skyrim.esm:0618A6 (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "Yes, the blushing bride now serves Sithis in the Void.": SetStage 5 (when: fn629 == 1; the speaker is Astrid). Source: TIF__00037B43.Fragment_0 on INFO Skyrim.esm:037B43 (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "Yes, the blushing bride now serves Sithis in the Void.": SetStage 5 (when: fn629 == 0; the speaker is Astrid). Source: TIF__000618A7.Fragment_0 on INFO Skyrim.esm:0618A7 (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "She bled like a stuck pig.": SetStage 5 (when: fn629 == 1; the speaker is Astrid). Source: TIF__00037B4B.Fragment_0 on INFO Skyrim.esm:037B4B (Skyrim.esm). **script**
- Dialogue with Astrid, placed in Abandoned Shack, "She bled like a stuck pig.": SetStage 5 (when: fn629 == 0; the speaker is Astrid). Source: TIF__000618A8.Fragment_0 on INFO Skyrim.esm:0618A8 (Skyrim.esm). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB10 (Death Incarnate) at stage 0 calls SetStage 200. Source: QF_DB10_0003CEDA.fragment_0 (Skyrim.esm).
- DB11 (Hail Sithis!) at stage 0 calls SetStage 200. Source: QF_DB11_0001EA59.fragment_16 (Skyrim.esm).
- DB09 (To Kill an Empire) at stage 0 calls SetStage 200. Source: QF_DB09_0001EA58.fragment_0 (Skyrim.esm).
- DB08 (Recipe for Disaster) at stage 0 calls SetStage 200. Source: QF_DB08_0001EA57.fragment_12 (Skyrim.esm).
- DB07 (The Cure for Madness) at stage 0 calls SetStage 30. Source: QF_DB07_0001EA56.fragment_0 (Skyrim.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "(Optional) Steal Gaius Maro's travel schedule", shown at stage 10. Source: Skyrim.esm:01EA55 QOBJ 8. **files**
- Dialogue with Astrid, placed in Abandoned Shack, "What else do I need to know?": SetStage 10 (when: the speaker is Astrid). Reply: "Agallon is an efficient man, and will certainly already have begun his tour of Skyrim. Unfortunately, we don't have his schedule." Source: TIF__0001546B.Fragment_0 on INFO Skyrim.esm:01546B (Skyrim.esm). **script**
- Dialogue with Gabriella, placed in Dark Brotherhood Sanctuary, "Yes?": SetStage 10 (when: the speaker is Gabriella). Reply: "To earn your bonus, do not kill Gaius Maro in Dragon Bridge, or on the road. Kill him in one of the other major cities he'll be visiting." Source: TIF__0002392F.Fragment_0 on INFO Skyrim.esm:02392F (Skyrim.esm). **script**

**Who and where**

- First objective: "Speak with Gabriella". Source: Skyrim.esm:01EA55 QOBJ 5. **files**
- Target alias GabriellaAlias (forced): Gabriella (forced reference, placed in Dark Brotherhood Sanctuary). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dark Brotherhood Sanctuary: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 11. The Cure for Madness (`DB07`, Skyrim.esm:01EA56, Skyrim.esm)

**Started by**

- Dialogue with Gabriella, placed in Dark Brotherhood Sanctuary, "Gaius Maro is dead.": SetStage 10 (when: fn629 == 1; the speaker is Gabriella). Source: TIF__00059636.Fragment_1 on INFO Skyrim.esm:059636 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Gabriella, placed in Dark Brotherhood Sanctuary, "Gaius Maro is dead.": SetStage 10 (when: fn629 == 0; the speaker is Gabriella). Source: TIF__00059643.Fragment_1 on INFO Skyrim.esm:059643 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB10 (Death Incarnate) at stage 0 calls SetStage 200. Source: QF_DB10_0003CEDA.fragment_2 (Skyrim.esm).
- DB11 (Hail Sithis!) at stage 0 calls SetStage 200. Source: QF_DB11_0001EA59.fragment_17 (Skyrim.esm).
- DB09 (To Kill an Empire) at stage 0 calls SetStage 200. Source: QF_DB09_0001EA58.fragment_2 (Skyrim.esm).
- DB08 (Recipe for Disaster) at stage 0 calls SetStage 60. Source: QF_DB08_0001EA57.fragment_12 (Skyrim.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Search Cicero's room", shown at stage 15. Source: Skyrim.esm:01EA56 QOBJ 15. **files**
- Dialogue with Astrid, placed in Abandoned Shack, "What do you want me to do?": SetStage 15 (when: the speaker is Astrid). Reply: "I want you to find that miserable little fool and end his life!" Source: TIF__00028C80.Fragment_0 on INFO Skyrim.esm:028C80 (Skyrim.esm). **script**

**Who and where**

- First objective: "Talk to Astrid". Source: Skyrim.esm:01EA56 QOBJ 10. **files**
- Target alias AstridAlias (forced): Astrid (forced reference, placed in Abandoned Shack). **files**

**Needs**

- The door from Abandoned Shack into Abandoned Shack needs the Abandoned Shack Key. Source: Skyrim.esm:050F1F (Skyrim.esm). **files**
- Ways in: Abandoned Shack: 1 door, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 12. Recipe for Disaster (`DB08`, Skyrim.esm:01EA57, Skyrim.esm)

**Started by**

- Dialogue with Astrid, placed in Abandoned Shack, "Right. So what's my next task?": SetStage 2 (when: the speaker is Astrid). Source: TIF__00038C6D.Fragment_0 on INFO Skyrim.esm:038C6D (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 2; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB10 (Death Incarnate) at stage 0 calls SetStage 200. Source: QF_DB10_0003CEDA.fragment_2 (Skyrim.esm).
- DB11 (Hail Sithis!) at stage 0 calls SetStage 200. Source: QF_DB11_0001EA59.fragment_17 (Skyrim.esm).
- DB09 (To Kill an Empire) at stage 0 calls SetStage 200. Source: QF_DB09_0001EA58.fragment_2 (Skyrim.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Question Anton Virane", shown at stage 4. Source: Skyrim.esm:01EA57 QOBJ 4. **files**
- Dialogue with Festus Krex, placed in Dark Brotherhood Sanctuary, "(Remain silent)": SetStage 4 (when: the speaker is Festus Krex). Reply: "Hmph." Source: TIF__000681B7.Fragment_0 on INFO Skyrim.esm:0681B7 (Skyrim.esm). **script**
- Dialogue with Festus Krex, placed in Dark Brotherhood Sanctuary, "Oh, I'm waiting with bated breath...": SetStage 4 (when: the speaker is Festus Krex). Reply: "Hmph." Source: TIF__000681B5.Fragment_0 on INFO Skyrim.esm:0681B5 (Skyrim.esm). **script**
- Dialogue with Festus Krex, placed in Dark Brotherhood Sanctuary, "Of course, Festus. Please continue.": SetStage 4 (when: the speaker is Festus Krex). Reply: "Hmph." Source: TIF__000681B6.Fragment_0 on INFO Skyrim.esm:0681B6 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Report to Festus Krex". Source: Skyrim.esm:01EA57 QOBJ 2. **files**
- Target alias FestusKrexAlias (forced): Festus Krex (forced reference, placed in Dark Brotherhood Sanctuary). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dark Brotherhood Sanctuary: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 13. To Kill an Empire (`DB09`, Skyrim.esm:01EA58, Skyrim.esm)

**Started by**

- Dialogue with Festus Krex, placed in Dark Brotherhood Sanctuary, "(Remain silent)": SetStage 5 (when: the speaker is Festus Krex). Source: TIF__00068B6D.Fragment_1 on INFO Skyrim.esm:068B6D (Skyrim.esm). **script**
- Dialogue with Festus Krex, placed in Dark Brotherhood Sanctuary, "You would expect any less from the Listener?": SetStage 5 (when: the speaker is Festus Krex). Source: TIF__00068B6C.Fragment_1 on INFO Skyrim.esm:068B6C (Skyrim.esm). **script**
- Dialogue with Festus Krex, placed in Dark Brotherhood Sanctuary, "All I've ever wanted to do is serve this Sanctuary.": SetStage 5 (when: the speaker is Festus Krex). Source: TIF__00068B75.Fragment_1 on INFO Skyrim.esm:068B75 (Skyrim.esm). **script**
- Dialogue with Festus Krex, placed in Dark Brotherhood Sanctuary, "Dead.": SetStage 5 (when: fn629 == 1; fn629 == 1; fn629 == 1; fn629 == 1; the speaker is Festus Krex). Source: TIF__00068B78.Fragment_1 on INFO Skyrim.esm:068B78 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Festus Krex, placed in Dark Brotherhood Sanctuary, "Dead.": SetStage 5 (when: fn629 == 1; fn629 == 1; fn629 == 0; the speaker is Festus Krex). Source: TIF__00068B7B.Fragment_1 on INFO Skyrim.esm:068B7B (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB10 (Death Incarnate) at stage 0 calls SetStage 70. Source: QF_DB10_0003CEDA.fragment_2 (Skyrim.esm).
- DB11 (Hail Sithis!) at stage 0 calls SetStage 200. Source: QF_DB11_0001EA59.fragment_17 (Skyrim.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report to Commander Maro", shown at stage 10. Source: Skyrim.esm:01EA58 QOBJ 10. **files**
- Dialogue with Astrid, placed in Abandoned Shack, "Which poison I should use?": SetStage 10 (when: the speaker is Astrid). Reply: "Here, take this - it's called jarrin root." Source: TIF__0004BCB0.Fragment_0 on INFO Skyrim.esm:04BCB0 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Report to Astrid". Source: Skyrim.esm:01EA58 QOBJ 5. **files**
- Target alias AstridAlias (forced): Astrid (forced reference, placed in Abandoned Shack). **files**

**Needs**

- The door from Abandoned Shack into Abandoned Shack needs the Abandoned Shack Key. Source: Skyrim.esm:050F1F (Skyrim.esm). **files**
- Ways in: Abandoned Shack: 1 door, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 14. Death Incarnate (`DB10`, Skyrim.esm:03CEDA, Skyrim.esm)

**Started by**

- DarkBrotherhood (named "Dark Brotherhood" in its record), a helper quest with AmaundAlias, AventusAlias, MuiriAlias calls SetStage 10; DarkBrotherhood is started by the start-game flag. Source: pSancSoldierScript.OnUpdate on Skyrim.esm:01EA5C (Unofficial Skyrim Special Edition Patch.esp). **script**
- DB09 (To Kill an Empire) at stage 75 calls SetStage 1. Source: QF_DB09_0001EA58.fragment_59 on Skyrim.esm:01EA58 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DB11 (Hail Sithis!) at stage 0 calls SetStage 80. Source: QF_DB11_0001EA59.fragment_17 (Skyrim.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Search for survivors", shown at stage 15. Source: Skyrim.esm:03CEDA QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Enter the Sanctuary". Source: Skyrim.esm:03CEDA QOBJ 10. **files**
- Target alias BlackDoorAlias (forced): Iron Door (forced reference, placed in Dark Brotherhood Sanctuary). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dark Brotherhood Sanctuary: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 15. Hail Sithis! (`DB11`, Skyrim.esm:01EA59, Skyrim.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DBrecurring (The Dark Brotherhood Forever) at stage 0 calls SetStage 80. Source: QF_DBRecurring_0001EA5A.fragment_5 (LoreRim - Global Modifiers.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Amaund Motierre", shown at stage 10. Source: Skyrim.esm:01EA59 QOBJ 10. **files**
- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Our Family lives on, Nazir. You have to trust me.": SetStage 10 (when: the speaker is Nazir). Reply: "Hmph. All right, then. Go. Go, my Listener. Find out what that slimy bastard Motierre has to say, then send the Emperor to Sithis." Source: TIF__000769D3.Fragment_0 on INFO Skyrim.esm:0769D3 (Skyrim.esm). **script**

**Who and where**

- First objective: "Talk to Nazir". Source: Skyrim.esm:01EA59 QOBJ 5. **files**
- Target alias NazirAlias (forced): Nazir (forced reference, placed in Dark Brotherhood Sanctuary). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dark Brotherhood Sanctuary: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 16. Destroy the Dark Brotherhood! (`DBDestroy`, Skyrim.esm:0934FB, LoreRim - Dialogue Patch.esp)

**Started by**

- DarkBrotherhood (named "Dark Brotherhood" in its record), a helper quest with AmaundAlias, AventusAlias, MuiriAlias calls SetStage 10; DarkBrotherhood is started by the start-game flag. Source: pAstridScript.OnDeath on Skyrim.esm:01EA5C (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak with Commander Maro", shown at stage 20. Source: Skyrim.esm:0934FB QOBJ 20. **files**
- Dialogue with someone the line does not name, "I think I just killed the leader of the Dark Brotherhood.": SetStage 20 (when: Destroy the Dark Brotherhood! stage == 10; GetInFaction Guard Faction (for dialogue) == 1). Reply: "You did what?" Source: TIF__00094E3A.Fragment_0 on INFO Skyrim.esm:094E3A (Destroy the Dark Brotherhood - Quest Expansion.esp). **script**

**Who and where**

- First objective: "Report Astrid's death to a guard". Source: Skyrim.esm:0934FB QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 3000 gold (stage 200, QF_DBDestroy_000934FB.fragment_2).

## 17. Honor Thy Family (`DBEviction`, Skyrim.esm:06F9A5, Skyrim.esm)

**Started by**

- DBSuspensionQuest (named "Dark Brotherhood Suspension" in its record), a helper quest at stage 0 calls Start; DBSuspensionQuest is started by story manager node DBSuspensionAssault (event: ASSU; GetInFaction The Dark Brotherhood == 1; the speaker is Prisoner; GetQuestRunning Dark Brotherhood Suspension == 0; GetQuestRunning Death Incarnate == 0; With Friends Like These... stage >= 50). Source: QF_DBSuspensionQuest_000A2490.fragment_0 on Skyrim.esm:0A2490 (Skyrim.esm). **script**
- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "DBNazirEvictionBranchTopic": SetStage 10 (when: fn629 == 1; Hail Sithis! stage <= 80; the speaker is Nazir). Source: TIF__0006F99D.Fragment_0 on INFO Skyrim.esm:06F99D (Skyrim.esm). **script**
- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "DBNazirEvictionBranchTopic": SetStage 10 (when: fn629 == 1; Hail Sithis! stage > 80; the speaker is Nazir). Source: TIF__0006F99E.Fragment_0 on INFO Skyrim.esm:06F99E (Skyrim.esm). **script**
- Dialogue with Gabriella, placed in Dark Brotherhood Sanctuary, "DBNazirEvictionBranchTopic": SetStage 10 (when: fn629 == 1; the speaker is Gabriella; Destroy the Dark Brotherhood! stage <= 10). Source: TIF__0006F99F.Fragment_0 on INFO Skyrim.esm:06F99F (Destroy the Dark Brotherhood - Quest Expansion.esp). **script**
- Dialogue with Babette, placed in Dark Brotherhood Sanctuary, "DBNazirEvictionBranchTopic": SetStage 10 (when: fn629 == 1; the speaker is Babette). Source: TIF__0006F9A0.Fragment_0 on INFO Skyrim.esm:06F9A0 (Skyrim.esm). **script**
- Dialogue with Festus Krex, placed in Dark Brotherhood Sanctuary, "DBNazirEvictionBranchTopic": SetStage 10 (when: fn629 == 1; the speaker is Festus Krex). Source: TIF__0006F9A1.Fragment_0 on INFO Skyrim.esm:06F9A1 (Skyrim.esm). **script**
- Dialogue with Arnbjorn, placed in Dark Brotherhood Sanctuary, "DBNazirEvictionBranchTopic": SetStage 10 (when: fn629 == 1; the speaker is Arnbjorn). Source: TIF__0006F9A2.Fragment_0 on INFO Skyrim.esm:06F9A2 (Skyrim.esm). **script**
- Dialogue with Veezara, placed in Dark Brotherhood Sanctuary, "DBNazirEvictionBranchTopic": SetStage 10 (when: fn629 == 1; the speaker is Veezara; Destroy the Dark Brotherhood! stage <= 10). Source: TIF__0006F9A3.Fragment_0 on INFO Skyrim.esm:06F9A3 (Destroy the Dark Brotherhood - Quest Expansion.esp). **script**
- and 5 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Pay Nazir the fine". Source: Skyrim.esm:06F9A5 QOBJ 10. **files**
- Target alias NazirAlias (forced): Nazir (forced reference, placed in Dark Brotherhood Sanctuary). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dark Brotherhood Sanctuary: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 18. Contract: Kill Narfi (`DBSideContract01`, Skyrim.esm:01EA5B, CC Farming - Tweaks and Enhancements.esp)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "I'm ready for the first set of contracts.": SetStage 10 (when: Sanctuary stage < 200; fn629 == 1; the speaker is Nazir; GetInFaction ccvsvsse004-beafarmer.esl:00086C == 0). Source: TIF__00020017.Fragment_0 on INFO Skyrim.esm:020017 (CC Farming - Tweaks and Enhancements.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA5B QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Narfi". Source: Skyrim.esm:01EA5B QOBJ 10. **files**
- Target alias DBSideContract01NarfiAlias (forced): Narfi (forced reference, placed in Ivarstead). **files**

**Needs**

- The door from Henrik's House into Ivarstead needs the Key to Henrik's House, carried by Henrik. Source: The Great Town of Ivarstead.esp:000090 (The Great Town of Ivarstead.esp). **files**
- Ways in: Ivarstead: 1 door, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 19. Contract: Kill Ennodius Papius (`DBSideContract02`, Skyrim.esm:01EA5E, Skyrim.esm)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "I'm ready for the first set of contracts.": SetStage 10 (when: Sanctuary stage < 200; fn629 == 1; the speaker is Nazir; GetInFaction ccvsvsse004-beafarmer.esl:00086C == 0). Source: TIF__00020017.Fragment_0 on INFO Skyrim.esm:020017 (CC Farming - Tweaks and Enhancements.esp). **script**
- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "I'm ready for the first set of contracts.": SetStage 10 (when: Sanctuary stage < 200; fn629 == 1; the speaker is Nazir; GetInFaction ccvsvsse004-beafarmer.esl:00086C == 1). Source: DBNazir_ContractSet1Ready_Alternate.Fragment_0 on INFO CC Farming - Tweaks and Enhancements.esp:000800 (CC Farming - Tweaks and Enhancements.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA5E QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Ennodius Papius". Source: Skyrim.esm:01EA5E QOBJ 10. **files**
- Target alias DBEnnodiusAlias (unique): Ennodius Papius (unique actor, placed in Anga's Mill). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 20. Contract: Kill Beitild (`DBSideContract03`, Skyrim.esm:01EA5F, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "I'm ready for the first set of contracts.": SetStage 10 (when: Sanctuary stage < 200; fn629 == 1; the speaker is Nazir; GetInFaction ccvsvsse004-beafarmer.esl:00086C == 0). Source: TIF__00020017.Fragment_0 on INFO Skyrim.esm:020017 (CC Farming - Tweaks and Enhancements.esp). **script**
- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "I'm ready for the first set of contracts.": SetStage 10 (when: Sanctuary stage < 200; fn629 == 1; the speaker is Nazir; GetInFaction ccvsvsse004-beafarmer.esl:00086C == 1). Source: DBNazir_ContractSet1Ready_Alternate.Fragment_0 on INFO CC Farming - Tweaks and Enhancements.esp:000800 (CC Farming - Tweaks and Enhancements.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA5F QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Beitild". Source: Skyrim.esm:01EA5F QOBJ 10. **files**
- Target alias DBBeitildAlias (forced): Beitild (forced reference, placed in Beitild's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Beitild's House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 21. Contract: Kill Hern (`DBSideContract04`, Skyrim.esm:01EA60, Skyrim.esm)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Do you have any more contracts?": SetStage 10 (when: Whispers in the Dark stage > 50; fn629 == 3; fn629 == 0; the speaker is Nazir). Source: TIF__0002AD12.Fragment_0 on INFO Skyrim.esm:02AD12 (CC Farming - Tweaks and Enhancements.esp). **script**
- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Astrid wanted me to see you about some more work.": SetStage 10 (when: Whispers in the Dark stage == 50; fn629 == 3; fn629 == 0; the speaker is Nazir). Source: TIF__000205BE.Fragment_0 on INFO Skyrim.esm:0205BE (CC Farming - Tweaks and Enhancements.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA60 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Hern". Source: Skyrim.esm:01EA60 QOBJ 10. **files**
- Target alias DBHernAlias (forced): Hern (forced reference, placed in Half-Moon Mill). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Half-Moon Mill: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 22. Contract: Kill Lurbuk (`DBSideContract05`, Skyrim.esm:01EA61, Skyrim.esm)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Do you have any more contracts?": SetStage 10 (when: Whispers in the Dark stage > 50; fn629 == 3; fn629 == 0; the speaker is Nazir). Source: TIF__0002AD12.Fragment_0 on INFO Skyrim.esm:02AD12 (CC Farming - Tweaks and Enhancements.esp). **script**
- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Astrid wanted me to see you about some more work.": SetStage 10 (when: Whispers in the Dark stage == 50; fn629 == 3; fn629 == 0; the speaker is Nazir). Source: TIF__000205BE.Fragment_0 on INFO Skyrim.esm:0205BE (CC Farming - Tweaks and Enhancements.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA61 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Lurbuk". Source: Skyrim.esm:01EA61 QOBJ 10. **files**
- Target alias DBLurbukAlias (forced): Lurbuk (forced reference, placed in Moorside Inn). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Moorside Inn: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 23. Contract: Kill Deekus (`DBSideContract06`, Skyrim.esm:01EA62, Skyrim.esm)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Are there any more contracts available?": SetStage 10 (when: The Silence Has Been Broken stage >= 30; fn629 == 5; fn629 == 1; the speaker is Nazir). Source: TIF__0002AD00.Fragment_0 on INFO Skyrim.esm:02AD00 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA62 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Deekus". Source: Skyrim.esm:01EA62 QOBJ 10. **files**
- Target alias DBDeekusAlias (unique): Deekus (unique actor, placed in Hela's Folly). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 24. Contract: Kill Ma'randru-jo (`DBSideContract07`, Skyrim.esm:01EA63, Skyrim.esm)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Are there any more contracts available?": SetStage 10 (when: The Silence Has Been Broken stage >= 30; fn629 == 5; fn629 == 1; the speaker is Nazir). Source: TIF__0002AD00.Fragment_0 on INFO Skyrim.esm:02AD00 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA63 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Ma'randru-jo". Source: Skyrim.esm:01EA63 QOBJ 10. **files**
- Target alias DBMarandrujoAlias (unique): Ma'randru-jo (unique actor, placed in Salvius Farm). **files**

**Needs**

- The door from Mill Maintenance, Markarth Mill Maintenance into Salvius Farm needs the Key to Savantus Mill Maintenance, carried by Savantus Ingenius. Source: Lux Via - Markarth Entrance and Farm Overhaul.esp:0008B8 (Lux Via - Markarth Entrance and Farm Overhaul.esp). **files**
- The door from Hilarius Farmhouse into Salvius Farm needs the Key to Hilarius Farmhouse, carried by Hilarius; Vagdis Hilarius. Source: Lux Via - Markarth Entrance and Farm Overhaul.esp:000888 (Lux Via - Markarth Entrance and Farm Overhaul.esp). **files**
- Ways in: Salvius Farm: 2 doors, 2 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 25. Contract: Kill Anoriath (`DBSideContract08`, Skyrim.esm:01EA64, Skyrim.esm)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Are there any more contracts available?": SetStage 10 (when: The Silence Has Been Broken stage >= 30; fn629 == 5; fn629 == 1; the speaker is Nazir). Source: TIF__0002AD00.Fragment_0 on INFO Skyrim.esm:02AD00 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA64 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Anoriath". Source: Skyrim.esm:01EA64 QOBJ 10. **files**
- Target alias DBAnoriathAlias (forced): Anoriath (forced reference, placed in The Drunken Huntsman, Drunken Huntsman). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Drunken Huntsman, Drunken Huntsman: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 26. Contract: Kill Agnis (`DBSideContract09`, Skyrim.esm:01EA65, Skyrim.esm)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Are there any more contracts, Nazir?": SetStage 10 (when: fn629 == 8; fn629 == 2; the speaker is Nazir). Source: TIF__000205C1.Fragment_0 on INFO Skyrim.esm:0205C1 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA65 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Agnis". Source: Skyrim.esm:01EA65 QOBJ 10. **files**
- Target alias DBAgnisAlias (unique): Agnis (unique actor, placed in Fort Greymoor). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Fort Greymoor: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 27. Contract: Kill Maluril (`DBSideContract10`, Skyrim.esm:01EA66, Skyrim.esm)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Are there any more contracts available?": SetStage 10 (when: fn629 == 9; fn629 == 3; the speaker is Nazir). Source: TIF__000205C0.Fragment_0 on INFO Skyrim.esm:0205C0 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA66 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Maluril". Source: Skyrim.esm:01EA66 QOBJ 10. **files**
- Target alias DBMalurilAlias (unique): Maluril (unique actor, placed in Mzinchaleft). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Mzinchaleft: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 28. Contract: Kill Helvard (`DBSideContract11`, Skyrim.esm:01EA67, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "Are there any more contracts available?": SetStage 10 (when: fn629 == 9; fn629 == 3; the speaker is Nazir). Source: TIF__000205C0.Fragment_0 on INFO Skyrim.esm:0205C0 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA67 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Helvard". Source: Skyrim.esm:01EA67 QOBJ 10. **files**
- Target alias DBHelvardAlias (forced): Helvard (forced reference, placed in Hakkvild's High Hall, Jarl's Longhouse). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hakkvild's High Hall, Jarl's Longhouse: 5 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 29. Contract: Kill Safia (`DBSideContract12`, Skyrim.esm:01EA68, Skyrim.esm)

**Started by**

- Dialogue with Nazir, placed in Dark Brotherhood Sanctuary, "I'm ready for the last contract.": SetStage 10 (when: fn629 == 11; fn629 == 4; the speaker is Nazir). Source: TIF__000205BD.Fragment_0 on INFO Skyrim.esm:0205BD (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Report back to Nazir", shown at stage 20. Source: Skyrim.esm:01EA68 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Kill Safia". Source: Skyrim.esm:01EA68 QOBJ 10. **files**
- Target alias DBSafiaAlias (unique): Safia (unique actor, placed in Red Wave, Solitude). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Red Wave, Solitude: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 30. DB01_Opt (`DB01_OptionalObjectives`, Innocence Lost - Quest Expansion.esp:000836, Innocence Lost - Quest Expansion.esp)

**Started by**

- Start-game flag: the quest runs from the start of the game. Source: Innocence Lost - Quest Expansion.esp:000836 DNAM (Innocence Lost - Quest Expansion.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Witness Grelod's arrest". Source: Innocence Lost - Quest Expansion.esp:000836 QOBJ 20. **files**
- **unread**: no fragment of its own shows the second objective, so the stage that moves it isn't traced.

**Who and where**

- First objective: "Ask a guard to arrest Grelod (Optional)". Source: Innocence Lost - Quest Expansion.esp:000836 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 31. Contract: Kill Braith (`ExtraContracts_KillBraith_Quest`, Additional Contracts For the Dark Brotherhood.esp:000822, Additional Contracts For the Dark Brotherhood.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Nazir", shown at stage 100. Source: Additional Contracts For the Dark Brotherhood.esp:000822 QOBJ 100. **files**
- ExtraContracts_KillBraith_Quest (Contract: Kill Braith) calls SetStage 100. Source: defaultsetstageondeathrefalias.onDeath on Additional Contracts For the Dark Brotherhood.esp:000822 (Additional Contracts For the Dark Brotherhood.esp). **script**

**Who and where**

- First objective: "Kill Braith". Source: Additional Contracts For the Dark Brotherhood.esp:000822 QOBJ 10. **files**
- Target alias Braith (forced): Braith (forced reference, placed in Amren's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Amren's House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward02Medium (levelled: gold) (stage 200, QF_ExtraContracts_KillBraith_06000822.fragment_6).

## 32. Contract: Kill Elenwen (`ExtraContracts_KillElenwen_Quest`, Additional Contracts For the Dark Brotherhood.esp:000FE8, Additional Contracts For the Dark Brotherhood.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Nazir", shown at stage 100. Source: Additional Contracts For the Dark Brotherhood.esp:000FE8 QOBJ 100. **files**
- ExtraContracts_KillElenwen_Quest (Contract: Kill Elenwen) calls SetStage 100. Source: defaultsetstageondeathrefalias.onDeath on Additional Contracts For the Dark Brotherhood.esp:000FE8 (Additional Contracts For the Dark Brotherhood.esp). **script**

**Who and where**

- First objective: "Kill Elenwen". Source: Additional Contracts For the Dark Brotherhood.esp:000FE8 QOBJ 10. **files**
- Target alias Victim (forced): Elenwen (forced reference, placed in Thalmor Embassy). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Thalmor Embassy: 4 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward04Wow (levelled: gold) (stage 200, QF_ExtraContracts_KillElenwen.fragment_5).

## 33. Contract: Kill Erikur (`ExtraContracts_KillErikur_Quest`, Additional Contracts For the Dark Brotherhood.esp:000E51, Additional Contracts For the Dark Brotherhood.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Nazir", shown at stage 100. Source: Additional Contracts For the Dark Brotherhood.esp:000E51 QOBJ 100. **files**
- ExtraContracts_KillErikur_Quest (Contract: Kill Erikur) calls SetStage 100. Source: defaultsetstageondeathrefalias.onDeath on Additional Contracts For the Dark Brotherhood.esp:000E51 (Additional Contracts For the Dark Brotherhood.esp). **script**

**Who and where**

- First objective: "Kill Erikur in Solitude". Source: Additional Contracts For the Dark Brotherhood.esp:000E51 QOBJ 10. **files**
- Target alias Victim (forced): Erikur (forced reference, placed in Erikur's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Erikur's House: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward03Large (levelled: gold) (stage 200, QF_ExtraContracts_Script.fragment_5).

## 34. Contract: Kill Lemkil (`ExtraContracts_KillLemkil_Quest`, Additional Contracts For the Dark Brotherhood.esp:000DCA, Additional Contracts For the Dark Brotherhood.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Nazir", shown at stage 100. Source: Additional Contracts For the Dark Brotherhood.esp:000DCA QOBJ 100. **files**
- ExtraContracts_KillLemkil_Quest (Contract: Kill Lemkil) calls SetStage 100. Source: defaultsetstageondeathrefalias.onDeath on Additional Contracts For the Dark Brotherhood.esp:000DCA (Additional Contracts For the Dark Brotherhood.esp). **script**

**Who and where**

- First objective: "Kill Lemkil". Source: Additional Contracts For the Dark Brotherhood.esp:000DCA QOBJ 10. **files**
- Target alias Victim (forced): Lemkil (forced reference, placed in Lemkil's Farmhouse). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Lemkil's Farmhouse: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward02Medium (levelled: gold) (stage 200, QF_ExtraContracts_Script.fragment_5).

## 35. Contract: Kill Nazeem (`ExtraContracts_KillNazeem_Quest`, Additional Contracts For the Dark Brotherhood.esp:00081B, Additional Contracts For the Dark Brotherhood.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Nazir", shown at stage 100. Source: Additional Contracts For the Dark Brotherhood.esp:00081B QOBJ 100. **files**
- ExtraContracts_KillNazeem_Quest (Contract: Kill Nazeem) calls SetStage 100. Source: defaultsetstageondeathrefalias.onDeath on Additional Contracts For the Dark Brotherhood.esp:00081B (Additional Contracts For the Dark Brotherhood.esp). **script**

**Who and where**

- First objective: "Kill Nazeem". Source: Additional Contracts For the Dark Brotherhood.esp:00081B QOBJ 10. **files**
- Target alias Nazeem (forced): Nazeem (forced reference, placed in Wintersand Manor). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Wintersand Manor: 5 doors, 4 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward03Large (levelled: gold) (stage 200, QF_ExtraContracts_KillNazeem_0600AA19.fragment_0).

## 36. Contract: Kill Rolff Stone-Fist (`ExtraContracts_KillRolff_Quest`, Additional Contracts For the Dark Brotherhood.esp:000858, Additional Contracts For the Dark Brotherhood.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Nazir", shown at stage 100. Source: Additional Contracts For the Dark Brotherhood.esp:000858 QOBJ 100. **files**
- ExtraContracts_KillRolff_Quest (Contract: Kill Rolff Stone-Fist) calls SetStage 100. Source: defaultsetstageondeathrefalias.onDeath on Additional Contracts For the Dark Brotherhood.esp:000858 (Additional Contracts For the Dark Brotherhood.esp). **script**

**Who and where**

- First objective: "Kill Rolff". Source: Additional Contracts For the Dark Brotherhood.esp:000858 QOBJ 10. **files**
- Target alias Rolff (forced): Rolff Stone-Fist (forced reference, placed in Candlehearth Hall). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Candlehearth Hall: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward03Large (levelled: gold) (stage 200, QF_ExtraContracts_KillRolff__04000809.fragment_4).

## 37. Contract: Kill Serana (`ExtraContracts_KillSerana_Quest`, Additional Contracts For the Dark Brotherhood.esp:000E3C, Additional Contracts For the Dark Brotherhood.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Nazir", shown at stage 100. Source: Additional Contracts For the Dark Brotherhood.esp:000E3C QOBJ 100. **files**
- ExtraContracts_KillSerana_Quest (Contract: Kill Serana) calls SetStage 100. Source: defaultsetstageondeathrefalias.onDeath on Additional Contracts For the Dark Brotherhood.esp:000E3C (Additional Contracts For the Dark Brotherhood.esp). **script**

**Who and where**

- First objective: "Kill Serana". Source: Additional Contracts For the Dark Brotherhood.esp:000E3C QOBJ 10. **files**
- Target alias Victim (forced): Serana (forced reference, placed in Dimhollow Cavern, Dimhollow Crypt). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dimhollow Cavern, Dimhollow Crypt: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward04Wow (levelled: gold) (stage 200, QF_ExtraContracts_KillSerana.fragment_5).

## 38. Contract: Kill Taarie and Endarie (`ExtraContracts_KillTaarieEndarie_Quest`, Additional Contracts For the Dark Brotherhood.esp:00082B, Additional Contracts For the Dark Brotherhood.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Nazir", shown at stage 100. Source: Additional Contracts For the Dark Brotherhood.esp:00082B QOBJ 100. **files**
- ExtraContracts_KillTaarieEndarie_Quest (Contract: Kill Taarie and Endarie) calls SetStage 100. Source: ExtraContracts_SetStageDeath.OnDeath on Additional Contracts For the Dark Brotherhood.esp:00082B (Additional Contracts For the Dark Brotherhood.esp). **script**

**Who and where**

- First objective: "Kill Taarie and Endarie (<Global=ExtraContracts_KillTaarieEndarie_KillCount_Current>/<Global=ExtraContracts_KillTaarieEndarie_KillCount_Total>)". Source: Additional Contracts For the Dark Brotherhood.esp:00082B QOBJ 10. **files**
- Target alias Taarie (forced): Taarie (forced reference, placed in Radiant Raiment, Radiant Raiments). **files**
- Target alias Endarie (forced): Endarie (forced reference, placed in Radiant Raiment, Radiant Raiments). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Radiant Raiment, Radiant Raiments: 1 door, 0 locked; Radiant Raiment, Radiant Raiments: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward03Large (levelled: gold) (stage 200, QF_ExtraContracts_KillTaarie_0600082B.fragment_5).

## 39. Contract: Kill Thonar Silver-Blood (`ExtraContracts_KillThonarSilverblood_Quest`, Additional Contracts For the Dark Brotherhood.esp:000FDA, Additional Contracts For the Dark Brotherhood.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to Nazir", shown at stage 100. Source: Additional Contracts For the Dark Brotherhood.esp:000FDA QOBJ 100. **files**
- ExtraContracts_KillThonarSilverblood_Quest (Contract: Kill Thonar Silver-Blood) calls SetStage 100. Source: defaultsetstageondeathrefalias.onDeath on Additional Contracts For the Dark Brotherhood.esp:000FDA (Additional Contracts For the Dark Brotherhood.esp). **script**

**Who and where**

- First objective: "Kill Thonar Silver-Blood in Markarth". Source: Additional Contracts For the Dark Brotherhood.esp:000FDA QOBJ 10. **files**
- Target alias Victim (forced): Thonar Silver-Blood (forced reference, placed in The Treasury House, Treasury House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Treasury House, Treasury House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward03Large (levelled: gold) (stage 200, QF_ExtraContracts_Script.fragment_5).

## 40. LTN Quest Handler (`LTNQuestHandler`, Listen.esp:000808, Listen.esp)

**Started by**

- Start-game flag: the quest runs from the start of the game. Source: Listen.esp:000808 DNAM (Listen.esp). **files**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 41. Contract: Kill <Alias=Target> (`LTNQuestMarkarth`, Listen.esp:000828, Listen.esp)

**Started by**

- LTNQuestHandler (LTN Quest Handler) calls at stage 10 SetStage 10; at stage 10 SetStage 10; SetStage 10; SetStage 10. Sources: QF_LTNQuestHandler_01000808.fragment_7, LTNQuestHandlerScript.LTNGiveQuestsFunction on Listen.esp:000808. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Retrieve payment from the Markarth Dead Drop.", shown at stage 10. Source: Listen.esp:000828 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Kill <Alias=Target>.". Source: Listen.esp:000828 QOBJ 10. **files**
- Target alias Target (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 42. Contract: Kill <Alias=Target> (`LTNQuestRiften`, Listen.esp:00081A, Listen.esp)

**Started by**

- LTNQuestHandler (LTN Quest Handler) calls at stage 10 SetStage 10; at stage 10 SetStage 10; SetStage 10; SetStage 10. Sources: QF_LTNQuestHandler_01000808.fragment_7, LTNQuestHandlerScript.LTNGiveQuestsFunction on Listen.esp:000808. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Retrieve payment from the Dead Drop outside of Riften.", shown at stage 10. Source: Listen.esp:00081A QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Kill <Alias=Target>.". Source: Listen.esp:00081A QOBJ 10. **files**
- Target alias Target (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 43. Contract: Kill <Alias=Target> (`LTNQuestSolitude`, Listen.esp:000820, Listen.esp)

**Started by**

- LTNQuestHandler (LTN Quest Handler) calls at stage 10 SetStage 10; at stage 10 SetStage 10; SetStage 10; SetStage 10. Sources: QF_LTNQuestHandler_01000808.fragment_7, LTNQuestHandlerScript.LTNGiveQuestsFunction on Listen.esp:000808. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Retrieve payment from the Solitude Dead Drop.", shown at stage 10. Source: Listen.esp:000820 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Kill <Alias=Target>.". Source: Listen.esp:000820 QOBJ 10. **files**
- Target alias Target (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 44. Contract: Kill <Alias=Target> (`LTNQuestWhiterun`, Listen.esp:000802, Listen.esp)

**Started by**

- LTNQuestHandler (LTN Quest Handler) calls at stage 10 SetStage 10; at stage 10 SetStage 10; SetStage 10; SetStage 10. Sources: QF_LTNQuestHandler_01000808.fragment_7, LTNQuestHandlerScript.LTNGiveQuestsFunction on Listen.esp:000808. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Retrieve payment from the Whiterun Hold Dead Drop.", shown at stage 10. Source: Listen.esp:000802 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Kill <Alias=Target>.". Source: Listen.esp:000802 QOBJ 10. **files**
- Target alias Target (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 45. Contract: Kill <Alias=Target> (`LTNQuestWindhelm`, Listen.esp:000819, Listen.esp)

**Started by**

- LTNQuestHandler (LTN Quest Handler) calls at stage 10 SetStage 10; at stage 10 SetStage 10; SetStage 10; SetStage 10. Sources: QF_LTNQuestHandler_01000808.fragment_7, LTNQuestHandlerScript.LTNGiveQuestsFunction on Listen.esp:000808. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Retrieve payment from the Dead Drop in Eastmarch.", shown at stage 10. Source: Listen.esp:000819 QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Kill <Alias=Target>.". Source: Listen.esp:000819 QOBJ 10. **files**
- Target alias Target (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 46. The Dark Brotherhood Forever (`DBrecurring`, Skyrim.esm:01EA5A, LoreRim - Global Modifiers.esp)

**Started by**

- DBRecurringControlQuest, a helper quest calls SetStage 10; DBRecurringControlQuest is started by DBrecurring (The Dark Brotherhood Forever) at stage 200 (SetStage 10). Source: DBRecurringControlQuestScript.OnUpdate on Skyrim.esm:097256 (Unofficial Skyrim Modders Patch.esp). **script**
- (First objective shown at stage 15; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak with the contact", shown at stage 20. Source: Skyrim.esm:01EA5A QOBJ 20. **files**
- Dialogue with Night Mother (named by scene DBRecurringNightMotherScene2, alias NightMotherAlias of DBrecurring (The Dark Brotherhood Forever) (forced)), placed in Dark Brotherhood Sanctuary: SetStage 20. Reply: "Speak with the Nervous Patron at Candlehearth Hall, in Windhelm. Accept his gold, then kill the target. So begins a contract, bound in blood." Source: TIF__00097250.Fragment_0 on INFO Skyrim.esm:097250 (Skyrim.esm). **script**
- Dialogue with Night Mother (named by scene DBRecurringNightMotherScene2, alias NightMotherAlias of DBrecurring (The Dark Brotherhood Forever) (forced)), placed in Dark Brotherhood Sanctuary: SetStage 20. Reply: "Speak with the Wary Outlaw at the Bee and Barb, in Riften. Accept his gold, and then eliminate the target. So begins a contract, bound in blood." Source: TIF__00097251.Fragment_0 on INFO Skyrim.esm:097251 (Skyrim.esm). **script**
- Dialogue with Night Mother (named by scene DBRecurringNightMotherScene2, alias NightMotherAlias of DBrecurring (The Dark Brotherhood Forever) (forced)), placed in Dark Brotherhood Sanctuary: SetStage 20. Reply: "Speak with the Corrupt Agent at the Penitus Oculatus Outpost, in Dragon Bridge. Accept his gold, then kill the target. Hail Sithis!  " Source: TIF__000A0307.Fragment_0 on INFO Skyrim.esm:0A0307 (Skyrim.esm). **script**
- Dialogue with Night Mother (named by scene DBRecurringNightMotherScene2, alias NightMotherAlias of DBrecurring (The Dark Brotherhood Forever) (forced)), placed in Dark Brotherhood Sanctuary: SetStage 20. Reply: "Speak with the Scheming Servant at the Keep in Markarth. Accept his gold, then eliminate the target. So begins a contract, bound in blood." Source: TIF__000A0308.Fragment_0 on INFO Skyrim.esm:0A0308 (Skyrim.esm). **script**
- Dialogue with Night Mother (named by scene DBRecurringNightMotherScene2, alias NightMotherAlias of DBrecurring (The Dark Brotherhood Forever) (forced)), placed in Dark Brotherhood Sanctuary: SetStage 20. Reply: "Speak with the Desperate Gambler at the Barracks, in Windhelm. Accept his gold, then eliminate the target. So begins a contract, bound in blood." Source: TIF__000A0309.Fragment_0 on INFO Skyrim.esm:0A0309 (Skyrim.esm). **script**
- Dialogue with Night Mother (named by scene DBRecurringNightMotherScene2, alias NightMotherAlias of DBrecurring (The Dark Brotherhood Forever) (forced)), placed in Dark Brotherhood Sanctuary: SetStage 20. Reply: "Speak with the Blasphemous Priest at the Temple of Kynareth, in Whiterun. Accept his gold, then kill the target. Hail Sithis!" Source: TIF__000A030A.Fragment_0 on INFO Skyrim.esm:0A030A (Skyrim.esm). **script**
- Dialogue with Night Mother (named by scene DBRecurringNightMotherScene2, alias NightMotherAlias of DBrecurring (The Dark Brotherhood Forever) (forced)), placed in Dark Brotherhood Sanctuary: SetStage 20. Reply: "Speak with the Dishonored Skald at the Bards College, in Solitude. Accept his gold, then eliminate the target. So begins a contract, bound in blood." Source: TIF__000A030B.Fragment_0 on INFO Skyrim.esm:0A030B (Skyrim.esm). **script**
- Dialogue with Night Mother (named by scene DBRecurringNightMotherScene2, alias NightMotherAlias of DBrecurring (The Dark Brotherhood Forever) (forced)), placed in Dark Brotherhood Sanctuary: SetStage 20. Reply: "Speak with the Indolent Farmer at the Vilemyr Inn, in Ivarstead. Accept his gold, then kill the target. So begins a contract, bound in blood." Source: TIF__000A030C.Fragment_0 on INFO Skyrim.esm:0A030C (Skyrim.esm). **script**

**Who and where**

- First objective: "Approach the Night Mother". Source: Skyrim.esm:01EA5A QOBJ 10. **files**
- Target alias NMCoffinAlias (forced): Night Mother's Coffin (forced reference, placed in Dawnstar Sanctuary). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dawnstar Sanctuary: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

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
