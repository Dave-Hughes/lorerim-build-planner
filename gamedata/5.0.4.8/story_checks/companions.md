# Start check: The Companions (`companions`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Take Up Arms (`C00`, Skyrim.esm:04B2D9, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with Aela the Huntress, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker is Aela the Huntress; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now ?); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now ?)). Source: TIF__000231C8.Fragment_0 on INFO Skyrim.esm:0231C8 (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with Vilkas, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker is Vilkas; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now ?); Take Up Arms stage <= 10). Source: TIF__0005477B.Fragment_0 on INFO Skyrim.esm:05477B (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with Farkas, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker is Farkas; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now ?); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now ?)). Source: TIF__0005477C.Fragment_0 on INFO Skyrim.esm:05477C (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with Skjor, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker is Skjor; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now ?) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now ?); Take Up Arms stage <= 10). Source: TIF__0005477D.Fragment_0 on INFO Skyrim.esm:05477D (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with Njada Stonearm, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker isn't the one in alias alias 1; the speaker isn't the one in alias alias 2; the speaker isn't the one in alias alias 3; the speaker isn't the one in alias alias 4; the speaker is Njada Stonearm; Take Up Arms stage 100 not done; fn359 == 1 or fn359 == 1). Source: TIF__000DAB4F.Fragment_0 on INFO Skyrim.esm:0DAB4F (Companions at Mirmulnir.esp). **script**
- Dialogue with Torvar, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker isn't the one in alias alias 1; the speaker isn't the one in alias alias 2; the speaker isn't the one in alias alias 3; the speaker isn't the one in alias alias 4; the speaker is Torvar; Take Up Arms stage 100 not done; fn359 == 1 or fn359 == 1). Source: TIF__000DAB51.Fragment_0 on INFO Skyrim.esm:0DAB51 (Companions at Mirmulnir.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:04B2D9 DNAM (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Kodlak Whitemane". Source: Skyrim.esm:04B2D9 QOBJ 10. **files**
- Target alias Kodlak (forced): Kodlak Whitemane (forced reference, placed in Jorrvaskr Living Quarters, Jorrvaskr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Jorrvaskr Living Quarters, Jorrvaskr: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Proving Honor (`C01`, Skyrim.esm:06E803, LoreRim - Dialogue Patch.esp)

**Started by**

- C00 (Take Up Arms) calls SetStage 1. Source: companionshousekeepingscript.CompleteRadiantQuest on Skyrim.esm:04B2D9 (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with Farkas, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker is Farkas; Proving Honor stage < 10). Source: TIF__0006F6BD.Fragment_0 on INFO Skyrim.esm:06F6BD (Skyrim.esm). **script**
- Dialogue with Aela the Huntress, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker is Aela the Huntress; Proving Honor stage < 10). Source: TIF__0006F6BE.Fragment_0 on INFO Skyrim.esm:06F6BE (Skyrim.esm). **script**
- Dialogue with Vilkas, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker is Vilkas; Proving Honor stage < 10). Source: TIF__0006F6BF.Fragment_0 on INFO Skyrim.esm:06F6BF (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- C02 (Brotherhood) at stage 200 calls SetStage 200. Source: QF_C02_0006E804.fragment_8 (Update.esm).

**Who and where**

- First objective: "Speak to Skjor". Source: Skyrim.esm:06E803 QOBJ 10. **files**
- Target alias Skjor (unique): Skjor (unique actor, placed in Jorrvaskr Living Quarters, Jorrvaskr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Jorrvaskr Living Quarters, Jorrvaskr: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. Brotherhood (`C02`, Skyrim.esm:06E804, Update.esm)

**Started by**

- C02Kicker, a helper quest at stage 200 calls SetStage 1; C02Kicker, is started by C01 (Proving Honor) at stage 40 (Start). Source: QF_C02Kicker_000A3EF8.fragment_2 on Skyrim.esm:0A3EF8 (Skyrim.esm), through C00 (Take Up Arms)'s startstoryquest. **script**
- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias 2). Source: TIF__000C07ED.Fragment_0 on INFO Skyrim.esm:0C07ED (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Follow <Alias=Questgiver>". Source: Skyrim.esm:06E804 QOBJ 10. **files**
- Target alias QuestGiver (run time): Vilkas (put there by a script (ForceRefTo), placed in Jorrvaskr Living Quarters, Jorrvaskr). **script**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 4. The Silver Hand (`C03`, Skyrim.esm:01CEF4, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- C00 (Take Up Arms) calls SetStage 1. Source: companionshousekeepingscript.CompleteRadiantQuest on Skyrim.esm:04B2D9 (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with someone the line does not name: SetStage 5 (when: the speaker is the one in alias alias 5; The Silver Hand stage < 5). Source: TIF__000C5C16.Fragment_0 on INFO Skyrim.esm:0C5C16 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Farkas, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 5 (when: The Silver Hand stage < 10; the speaker is Farkas or the speaker is Vilkas). Source: TIF__000A7052.Fragment_0 on INFO Skyrim.esm:0A7052 (Skyrim.esm). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Talk to Skjor". Source: Skyrim.esm:01CEF4 QOBJ 5. **files**
- Target alias Skjor (unique): Skjor (unique actor, placed in Jorrvaskr Living Quarters, Jorrvaskr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Jorrvaskr Living Quarters, Jorrvaskr: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 5. Blood's Honor (`C04`, Skyrim.esm:01CEF5, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- C00 (Take Up Arms) calls SetStage 1. Source: companionshousekeepingscript.CompleteRadiantQuest on Skyrim.esm:04B2D9 (LoreRim - Dialogue Patch.esp). **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start. Sources: USKP_VersionTrackingScript.ProcessRetroScripts, USKP_VersionTrackingScript.OnInit, USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9. **script**
- USKPRetroactive11 (named "Retroactive fixes added for 1.1" in its record), a helper quest calls Start; Start; Start; Start; Start; Start; Start; Start. Sources: USKPOnLoad04aScript.Process on Unofficial Skyrim Special Edition Patch.esp:02EE20. **script**
- USKPRetroactive12 (named "Retroactive fixes added for 1.2" in its record), a helper quest with Saerlund, Harrald, Adara calls Start; Start; Start; Start. Sources: USKPOnLoad05Script.Process on Unofficial Skyrim Special Edition Patch.esp:0339CE. **script**
- USKPRetroactive121 (named "Retroactive fixes for 1.2.1" in its record), a helper quest calls Start; Start. Sources: USKPRetroactive121Script.Process on Unofficial Skyrim Special Edition Patch.esp:03B601. **script**
- USKPRetroactive122 (named "Retroactive fixes for 1.2.2" in its record), a helper quest with Lortheim, Jora, Viola calls Start. Source: USKPRetroactive122Script.Process on Unofficial Skyrim Special Edition Patch.esp:03F6A2 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias 8; Blood's Honor stage < 10). Source: TIF__000582A0.Fragment_0 on INFO Skyrim.esm:0582A0 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Kodlak Whitemane". Source: Skyrim.esm:01CEF5 QOBJ 10. **files**
- Target alias Kodlak (unique): Kodlak Whitemane (unique actor, placed in Jorrvaskr Living Quarters, Jorrvaskr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Jorrvaskr Living Quarters, Jorrvaskr: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 6. Purity of Revenge (`C05`, Skyrim.esm:06E805, Update.esm)

**Started by**

- Patch1_9_UpdateQuest, a helper quest at stage 10 calls SetStage 1. Source: QF_Patch1_9_UpdateQuest_010009A3.fragment_0 on Update.esm:0009A3 (Update.esm), through C00 (Take Up Arms)'s startstoryquest. **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1. Sources: USKP_VersionTrackingScript.ProcessRetroScripts, USKP_VersionTrackingScript.OnInit, USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9. **script**
- USKPRetroactive130 (named "Retroactive fixes for 1.3.0" in its record), a helper quest calls Start; SetStage 1. Sources: USKPRetroactive130Script.Process on Unofficial Skyrim Special Edition Patch.esp:012F33. **script**
- USKPRetroactive127 (named "Retroactive fixes for 1.2.7" in its record), a helper quest with Odfel calls Start; SetStage 1; Start; SetStage 1. Sources: USKPRetroactive127Script.Process on Unofficial Skyrim Special Edition Patch.esp:0187DE. **script**
- USKPRetroactive125 (named "Retroactive fixes for 1.2.5" in its record), a helper quest with Garakh, Atub, Addvar calls Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1. Sources: USKPRetroactive125Script.Process on Unofficial Skyrim Special Edition Patch.esp:01E696. **script**
- USKPRetroactive126 (named "Retroactive fixes for 1.2.6" in its record), a helper quest with Niranye, Arivanya, Ysolda calls Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1. Sources: USKPRetroactive126Script.Process on Unofficial Skyrim Special Edition Patch.esp:025354. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Retrieve the fragments of Wuuthrad". Source: Skyrim.esm:06E805 QOBJ 10. **files**
- Target alias Fragments (forced): Fragments of Wuuthrad (forced reference, placed in Driftshade Refuge, Driftshade Sanctuary). **files**
- Target alias Fragments (forced): Fragments of Wuuthrad (forced reference, placed in Driftshade Refuge, Driftshade Sanctuary). **files**
- Target alias DriftShadeInteriorDoor (forced): Wooden Door (forced reference, placed in Driftshade Refuge, Driftshade Sanctuary). **files**
- Target alias DriftShadeInteriorDoor2 (forced): Wooden Door (forced reference, placed in Driftshade Cellar, Driftshade Sanctuary). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Driftshade Refuge, Driftshade Sanctuary: 3 doors, 0 locked; Driftshade Refuge, Driftshade Sanctuary: 3 doors, 0 locked; Driftshade Refuge, Driftshade Sanctuary: 3 doors, 0 locked; Driftshade Cellar, Driftshade Sanctuary: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 7. Glory of the Dead (`C06`, Skyrim.esm:01CEF6, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Patch1_9_UpdateQuest, a helper quest at stage 10 calls SetStage 1. Source: QF_Patch1_9_UpdateQuest_010009A3.fragment_0 on Update.esm:0009A3 (Update.esm), through C00 (Take Up Arms)'s startstoryquest. **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start. Sources: USKP_VersionTrackingScript.ProcessRetroScripts, USKP_VersionTrackingScript.OnInit, USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9. **script**
- USKPRetroactive203 (named "Retroactive fixes for 2.0.3" in its record), a helper quest calls Start; Start; Start; Start; Start; Start; Start; Start. Sources: uskpretroactive203script.Process on Unofficial Skyrim Special Edition Patch.esp:01068A. **script**
- USKPRetroactive204 (named "Retroactive fixes for 2.0.4" in its record), a helper quest with Gabriella, Erikur, Susanna calls Start; Start; Start; Start. Sources: USKPRetroactive204Script.Process on Unofficial Skyrim Special Edition Patch.esp:012C3A. **script**
- USKPRetroactive205 (named "Retroactive fixes for 2.0.5" in its record), a helper quest with Keerava calls Start; Start. Sources: USKPRetroactive205Script.Process on Unofficial Skyrim Special Edition Patch.esp:040578. **script**
- USKPRetroactive206 (named "Retroactive fixes for 2.0.6" in its record), a helper quest with Vekel, Oengul calls Start. Source: USKPRetroactive206Script.Process on Unofficial Skyrim Special Edition Patch.esp:04C7DF (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Attend Kodlak's funeral". Source: Skyrim.esm:01CEF6 QOBJ 10. **files**
- Target alias FuneralLocationMarker (forced): a marker (forced reference, placed in Whiterun). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 8. Animal Extermination (`CR01`, Skyrim.esm:01CEEE, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Story manager node CompanionsAelaNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsAelaNode Skyrim.esm:0BFC77 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Kill the <Alias=Beast>". Source: Skyrim.esm:01CEEE QOBJ 10. **files**
- Target alias Beast (created): Skyrim.esm:025232 (created item). **files**

**Needs**

- Its own conditions: GetInFaction The Companions == 1; fn629 == 1; fn629 == 0. **files**

**Gives**: nothing on its completing stages.

## 9. Animal Extermination (`CR02`, Skyrim.esm:025185, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Story manager node CompanionsAelaNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsAelaNode Skyrim.esm:0BFC77 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Clear out <Alias=AnimalDen>". Source: Skyrim.esm:025185 QOBJ 10. **files**
- Target alias BeastBoss (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: GetInFaction The Companions == 1; fn629 == 1; fn629 == 0. **files**

**Gives**: nothing on its completing stages.

## 10. Animal Pelt Collection (`CR03`, Skyrim.esm:025230, Companions Radiant Expansion.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Collect <Alias=SamplePelt>s (<Global=CR03PeltsGotten>/<Global=CR03TotalPeltsNeeded>)". Source: Skyrim.esm:025230 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: Take Up Arms stage 100 done; The Silver Hand not completed or Blood's Honor completed or Animal Pelt Collection stage > 1. **files**

**Gives**: nothing on its completing stages.

## 11. Hired Muscle (`CR04`, Skyrim.esm:025231, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Story manager node CompanionsFarkasNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsFarkasNode Skyrim.esm:0BFC78 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Intimidate <Alias=Brute> in <Alias=BruteTown>". Source: Skyrim.esm:025231 QOBJ 10. **files**
- Target alias Brute (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: GetInFaction The Companions == 1; fn629 == 1; fn629 == 0. **files**

**Gives**: nothing on its completing stages.

## 12. Trouble in Skyrim (`CR05`, Skyrim.esm:02522F, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsFarkasNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsFarkasNode Skyrim.esm:0BFC78 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Kill the leader of <Alias=Location>". Source: Skyrim.esm:02522F QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: Take Up Arms stage 100 done. **files**

**Gives**: nothing on its completing stages.

## 13. Family Heirloom (`CR06`, Skyrim.esm:0C18E1, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsVilkasSkjorDeadNode, event: script event; conditions up its parents: fn46 == 1; fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsVilkasSkjorDeadNode Skyrim.esm:0EC1A8 (Unofficial Skyrim Special Edition Patch.esp). **files**
- Story manager node CompanionsSkjorNode, event: script event; conditions up its parents: fn576 == 1; fn46 == 0; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsSkjorNode Skyrim.esm:0BFC79 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Retrieve the <Alias=Gewgaw> from <Alias=Location>". Source: Skyrim.esm:0C18E1 QOBJ 10. **files**
- Target alias Gewgaw (created): Skyrim.esm:0E3134 (created item). **files**

**Needs**

- Its own conditions: Take Up Arms stage 100 done; fn629 >= 2. **files**

**Gives**: nothing on its completing stages.

## 14. Escaped Criminal (`CR07`, Skyrim.esm:025250, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsVilkasSkjorDeadNode, event: script event; conditions up its parents: fn46 == 1; fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsVilkasSkjorDeadNode Skyrim.esm:0EC1A8 (Unofficial Skyrim Special Edition Patch.esp). **files**
- Story manager node CompanionsSkjorNode, event: script event; conditions up its parents: fn576 == 1; fn46 == 0; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsSkjorNode Skyrim.esm:0BFC79 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Kill the escaped criminal". Source: Skyrim.esm:025250 QOBJ 10. **files**
- Target alias Criminal (created): Skyrim.esm:093815 (created item). **files**

**Needs**

- Its own conditions: Take Up Arms stage 100 done; fn629 >= 2. **files**

**Gives**: nothing on its completing stages.

## 15. Rescue Mission (`CR08`, Skyrim.esm:025251, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsVilkasSkjorDeadNode, event: script event; conditions up its parents: fn46 == 1; fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsVilkasSkjorDeadNode Skyrim.esm:0EC1A8 (Unofficial Skyrim Special Edition Patch.esp). **files**
- Story manager node CompanionsVilkasAlwaysNode, event: script event; conditions up its parents: fn46 == 0; fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsVilkasAlwaysNode Skyrim.esm:0BFC7A (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Rescue <Alias=Victim> from <Alias=Lair>". Source: Skyrim.esm:025251 QOBJ 10. **files**
- Target alias Victim (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: Take Up Arms stage 100 done; Proving Honor completed. **files**

**Gives**: nothing on its completing stages.

## 16. Striking the Heart (`CR09`, Skyrim.esm:025252, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsReconNode, event: script event; conditions up its parents: fn576 == 1; Purity of Revenge stage < 10; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsReconNode Skyrim.esm:0BFC7B (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Assassinate the Silver Hand leader". Source: Skyrim.esm:025252 QOBJ 10. **files**
- Target alias CampBoss (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: The Silver Hand completed; Blood's Honor not completed or Striking the Heart stage > 1. **files**

**Gives**: nothing on its completing stages.

## 17. Stealing Plans (`CR10`, Skyrim.esm:09D6FC, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsReconNode, event: script event; conditions up its parents: fn576 == 1; Purity of Revenge stage < 10; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsReconNode Skyrim.esm:0BFC7B (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Steal the plans from <Alias=Camp>". Source: Skyrim.esm:09D6FC QOBJ 10. **files**
- Target alias Plans (created): Silver Hand Stratagem (created item). **files**

**Needs**

- Its own conditions: The Silver Hand completed; Blood's Honor not completed or Stealing Plans stage > 1. **files**

**Gives**: nothing on its completing stages.

## 18. Retrieval (`CR11`, Skyrim.esm:09D700, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsReconNode, event: script event; conditions up its parents: fn576 == 1; Purity of Revenge stage < 10; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsReconNode Skyrim.esm:0BFC7B (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Retrieve the fragment of Wuuthrad". Source: Skyrim.esm:09D700 QOBJ 10. **files**
- Target alias Fragment (created): Fragment of Wuuthrad (created item). **files**

**Needs**

- Its own conditions: The Silver Hand completed; Blood's Honor not completed or Retrieval stage > 1. **files**

**Gives**: nothing on its completing stages.

## 19. Totems of Hircine (`CR12`, Skyrim.esm:0E3145, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsAelaNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsAelaNode Skyrim.esm:0BFC77 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Retrieve the Totem of Hircine". Source: Skyrim.esm:0E3145 QOBJ 10. **files**
- Target alias Totem (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: Glory of the Dead completed; fn264 == 1; Glory of the Dead completed; fn629 < 3; fn629 == 1. **files**

**Gives**: nothing on its completing stages.

## 20. Purity (`CR13`, Skyrim.esm:0E3163, Companions Radiant Expansion.esp)

**Started by**

- Dialogue with Vilkas, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker is Vilkas). Source: TIF__000E3075.Fragment_0 on INFO Skyrim.esm:0E3075 (Companions Radiant Expansion.esp). **script**
- Dialogue with Farkas, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker is Farkas). Source: TIF__000E3076.Fragment_0 on INFO Skyrim.esm:0E3076 (Companions Radiant Expansion.esp). **script**
- Story manager node CompanionsFarkasPostQuestlineNode, event: script event; conditions up its parents: Glory of the Dead completed; fn629 == 1; fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsFarkasPostQuestlineNode Skyrim.esm:0F6086 (Skyrim.esm). **files**
- Story manager node VilkasPostQuestlineNode, event: script event; conditions up its parents: Glory of the Dead completed; fn629 == 1; fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: VilkasPostQuestlineNode Skyrim.esm:0F6084 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Collect a Glenmoril Witch's head". Source: Skyrim.esm:0E3163 QOBJ 10. **files**
- Target alias Witch (run time): Glenmoril Witch (named in its conditions, placed in Glenmoril Coven, Glenmoril Coven). **files**

**Needs**

- Its own conditions: Glory of the Dead completed. **files**
- Ways in: Glenmoril Coven: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 21. Dragon Seekers (`CR14`, Skyrim.esm:0E3156, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsVilkasSkjorDeadNode, event: script event; conditions up its parents: fn46 == 1; fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsVilkasSkjorDeadNode Skyrim.esm:0EC1A8 (Unofficial Skyrim Special Edition Patch.esp). **files**
- Story manager node CompanionsFarkasNode, event: script event; conditions up its parents: fn576 == 1; fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1 or fn576 == 1. Source: CompanionsFarkasNode Skyrim.esm:0BFC78 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Kill the dragon at <Alias=Den>". Source: Skyrim.esm:0E3156 QOBJ 10. **files**
- Target alias dragon (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: Glory of the Dead completed; Dragon Rising completed; Unbound completed; Glory of the Dead completed. **files**

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

### dialogue INFO Skyrim.esm:0231C8

- Speaker: Aela the Huntress (Nord), placed in Jorrvaskr Living Quarters, Jorrvaskr. Named by: GetIsID.
- The player's prompt: "Can I join the Companions?".
- The reply: "We don't just take in any milk drinker who stumbles in. Talk to Kodlak if you think you have what it takes to be a Companion.".
- When it's offered: the speaker is Aela the Huntress; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now ?).
- What it does: SetStage 10 on C00 (Take Up Arms). Source: TIF__000231C8.Fragment_0 on INFO Skyrim.esm:0231C8 (LoreRim - Dialogue Patch.esp); topic CRNoWorkBranchTopic. **script**
- In one sentence: Talk to Aela the Huntress (Nord) in Jorrvaskr Living Quarters, Jorrvaskr and choose "Can I join the Companions?", when the speaker is Aela the Huntress; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now ?): SetStage 10 on C00 (Take Up Arms).

### dialogue INFO Skyrim.esm:05477B

- Speaker: Vilkas (Nord), placed in Jorrvaskr Living Quarters, Jorrvaskr. Named by: GetIsID.
- The player's prompt: "Can I join the Companions?".
- The reply: "I don't know if you're capable, and I don't have time to find out. If Kodlak will vouch for you, I might have some work you could do.".
- When it's offered: the speaker is Vilkas; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10.
- What it does: SetStage 10 on C00 (Take Up Arms). Source: TIF__0005477B.Fragment_0 on INFO Skyrim.esm:05477B (LoreRim - Dialogue Patch.esp); topic CRNoWorkBranchTopic. **script**
- In one sentence: Talk to Vilkas (Nord) in Jorrvaskr Living Quarters, Jorrvaskr and choose "Can I join the Companions?", when the speaker is Vilkas; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10: SetStage 10 on C00 (Take Up Arms).

### dialogue INFO Skyrim.esm:05477C

- Speaker: Farkas (Nord), placed in Jorrvaskr Living Quarters, Jorrvaskr. Named by: GetIsID.
- The player's prompt: "Can I join the Companions?".
- The reply: "Kodlak is the one who figures out who can be a Companion. So talk to him. It's out of my hands.".
- When it's offered: the speaker is Farkas; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now ?).
- What it does: SetStage 10 on C00 (Take Up Arms). Source: TIF__0005477C.Fragment_0 on INFO Skyrim.esm:05477C (LoreRim - Dialogue Patch.esp); topic CRNoWorkBranchTopic. **script**
- In one sentence: Talk to Farkas (Nord) in Jorrvaskr Living Quarters, Jorrvaskr and choose "Can I join the Companions?", when the speaker is Farkas; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now ?): SetStage 10 on C00 (Take Up Arms).

### dialogue INFO Skyrim.esm:05477D

- Speaker: Skjor (Nord), placed in Jorrvaskr Living Quarters, Jorrvaskr. Named by: GetIsID.
- The player's prompt: "Can I join the Companions?".
- The reply: "So you think you have what it takes? Huh. Lucky for you, I'm not the one who makes that decision. Talk to Kodlak." / "Who knows, maybe he's in a generous mood.".
- When it's offered: the speaker is Skjor; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10.
- What it does: SetStage 10 on C00 (Take Up Arms). Source: TIF__0005477D.Fragment_0 on INFO Skyrim.esm:05477D (LoreRim - Dialogue Patch.esp); topic CRNoWorkBranchTopic. **script**
- In one sentence: Talk to Skjor (Nord) in Jorrvaskr Living Quarters, Jorrvaskr and choose "Can I join the Companions?", when the speaker is Skjor; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10: SetStage 10 on C00 (Take Up Arms).

### dialogue INFO Skyrim.esm:0DAB4F

- Speaker: Njada Stonearm (Nord), placed in Jorrvaskr Living Quarters, Jorrvaskr. Named by: GetIsID.
- The player's prompt: "Who's in charge around here?".
- The reply: "You don't just waddle in here and get to speak to the boss. Who do you think you are?" / "If you want to embarrass yourself, I won't stop you. Kodlak is the Harbinger. He's the closest thing you'll find to a leader around here.".
- When it's offered: the speaker isn't the one in alias GenericDialogueSuppressor1; the speaker isn't the one in alias GenericDialogueSuppressor2; the speaker isn't the one in alias GenericDialogueSuppressor3; the speaker isn't the one in alias GenericDialogueSuppressor4; the speaker is Njada Stonearm; Take Up Arms stage 100 not done; fn359 == 1 or fn359 == 1.
- What it does: SetStage 10 on C00 (Take Up Arms). Source: TIF__000DAB4F.Fragment_0 on INFO Skyrim.esm:0DAB4F (Companions at Mirmulnir.esp); topic DialogueCompanionsJorrvaskrPreJoinWhosInChargeTopic. **script**
- In one sentence: Talk to Njada Stonearm (Nord) in Jorrvaskr Living Quarters, Jorrvaskr and choose "Who's in charge around here?", when the speaker isn't the one in alias GenericDialogueSuppressor1; the speaker isn't the one in alias GenericDialogueSuppressor2; the speaker isn't the one in alias GenericDialogueSuppressor3; the speaker isn't the one in alias GenericDialogueSuppressor4; the speaker is Njada Stonearm; Take Up Arms stage 100 not done; fn359 == 1 or fn359 == 1: SetStage 10 on C00 (Take Up Arms).

### dialogue INFO Skyrim.esm:0DAB51

- Speaker: Torvar (Nord), placed in Jorrvaskr Living Quarters, Jorrvaskr. Named by: GetIsID.
- The player's prompt: "Who's in charge around here?".
- The reply: "In charge of what? I'm in charge of me, and you're in charge of you." / "If you're looking to join up, Kodlak's the one to be talking to.".
- When it's offered: the speaker isn't the one in alias GenericDialogueSuppressor1; the speaker isn't the one in alias GenericDialogueSuppressor2; the speaker isn't the one in alias GenericDialogueSuppressor3; the speaker isn't the one in alias GenericDialogueSuppressor4; the speaker is Torvar; Take Up Arms stage 100 not done; fn359 == 1 or fn359 == 1.
- What it does: SetStage 10 on C00 (Take Up Arms). Source: TIF__000DAB51.Fragment_0 on INFO Skyrim.esm:0DAB51 (Companions at Mirmulnir.esp); topic DialogueCompanionsJorrvaskrPreJoinWhosInChargeTopic. **script**
- In one sentence: Talk to Torvar (Nord) in Jorrvaskr Living Quarters, Jorrvaskr and choose "Who's in charge around here?", when the speaker isn't the one in alias GenericDialogueSuppressor1; the speaker isn't the one in alias GenericDialogueSuppressor2; the speaker isn't the one in alias GenericDialogueSuppressor3; the speaker isn't the one in alias GenericDialogueSuppressor4; the speaker is Torvar; Take Up Arms stage 100 not done; fn359 == 1 or fn359 == 1: SetStage 10 on C00 (Take Up Arms).

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
