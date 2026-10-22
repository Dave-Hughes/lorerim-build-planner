# Start check: The Companions (`companions`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Take Up Arms (`C00`, Skyrim.esm:04B2D9, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with Aela the Huntress, placed in Jorrvaskr Living Quarters, Jorrvaskr, "Can I join the Companions?": SetStage 10 (when: the speaker is Aela the Huntress; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now 0)). Source: TIF__000231C8.Fragment_0 on INFO Skyrim.esm:0231C8 (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with Vilkas, placed in Jorrvaskr Living Quarters, Jorrvaskr, "Can I join the Companions?": SetStage 10 (when: the speaker is Vilkas; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10). Source: TIF__0005477B.Fragment_0 on INFO Skyrim.esm:05477B (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with Farkas, placed in Jorrvaskr Living Quarters, Jorrvaskr, "Can I join the Companions?": SetStage 10 (when: the speaker is Farkas; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now 0)). Source: TIF__0005477C.Fragment_0 on INFO Skyrim.esm:05477C (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with Skjor, placed in Jorrvaskr Living Quarters, Jorrvaskr, "Can I join the Companions?": SetStage 10 (when: the speaker is Skjor; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10). Source: TIF__0005477D.Fragment_0 on INFO Skyrim.esm:05477D (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with Njada Stonearm, placed in Jorrvaskr Living Quarters, Jorrvaskr, "Who's in charge around here?": SetStage 10 (when: the speaker isn't the one in alias GenericDialogueSuppressor1; the speaker isn't the one in alias GenericDialogueSuppressor2; the speaker isn't the one in alias GenericDialogueSuppressor3; the speaker isn't the one in alias GenericDialogueSuppressor4; the speaker is Njada Stonearm; Take Up Arms stage 100 not done; you're in Jorrvaskr or you're in Jorrvaskr). Source: TIF__000DAB4F.Fragment_0 on INFO Skyrim.esm:0DAB4F (Companions at Mirmulnir.esp). **script**
- Dialogue with Torvar, placed in Jorrvaskr Living Quarters, Jorrvaskr, "Who's in charge around here?": SetStage 10 (when: the speaker isn't the one in alias GenericDialogueSuppressor1; the speaker isn't the one in alias GenericDialogueSuppressor2; the speaker isn't the one in alias GenericDialogueSuppressor3; the speaker isn't the one in alias GenericDialogueSuppressor4; the speaker is Torvar; Take Up Arms stage 100 not done; you're in Jorrvaskr or you're in Jorrvaskr). Source: TIF__000DAB51.Fragment_0 on INFO Skyrim.esm:0DAB51 (Companions at Mirmulnir.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:04B2D9 DNAM (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Spar with Vilkas in the training yard behind Jorrvaskr", shown at stage 20. Source: Skyrim.esm:04B2D9 QOBJ 20. **files**
- APS_GuildCompanions, a helper quest at stage 0 calls SetStage 20; APS_GuildCompanions is started by nothing in the records or scripts (**unread**). Source: QF_APS_GuildCompanions_063D36E8.fragment_0 on AlternatePerspective.esp:3D36E8 (AlternatePerspective.esp). **script**
- Dialogue with someone the line does not name, "So you're supposed to train me?": SetStage 20. Source: TIF__000A3E99.Fragment_0 on INFO Skyrim.esm:0A3E99 (Skyrim.esm). **script**
- Dialogue with Vilkas (named by alias Vilkas of C00 (Take Up Arms) (forced)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "So you're supposed to train me?": SetStage 20 (when: the speaker is the one in alias Vilkas; Take Up Arms stage == 20). Reply: "No, don't worry about that." Source: VilkasSparSkip_Scripts.Fragment_0 on INFO Vilkas Spar Skip.esp:000003 (Vilkas Spar Skip.esp). **script**
- On the way, a line of its own starts a scene while it is at its first objective: Dialogue with Kodlak Whitemane, placed in Jorrvaskr Living Quarters, Jorrvaskr, "I would like to join the Companions.": StartScene (when: GetInFaction The Companions == 0; the speaker is Kodlak Whitemane; Take Up Arms stage <= 10; GetDistance Skyrim.esm:0AA034 <= 500; you're in Jorrvaskr; GetDistance Skyrim.esm:0AA033 <= 500; you're in Jorrvaskr) (scene Skyrim.esm:0A3EB7). Source: TIF__000A3E7A.Fragment_0 on INFO Skyrim.esm:0A3E7A (Companions at Mirmulnir.esp). **script**

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
- Dialogue with Farkas, placed in Jorrvaskr Living Quarters, Jorrvaskr, "What does he want?": SetStage 10 (when: the speaker is Farkas; Proving Honor stage < 10). Source: TIF__0006F6BD.Fragment_0 on INFO Skyrim.esm:06F6BD (Skyrim.esm). **script**
- Dialogue with Aela the Huntress, placed in Jorrvaskr Living Quarters, Jorrvaskr, "What does he want?": SetStage 10 (when: the speaker is Aela the Huntress; Proving Honor stage < 10). Source: TIF__0006F6BE.Fragment_0 on INFO Skyrim.esm:06F6BE (Skyrim.esm). **script**
- Dialogue with Vilkas, placed in Jorrvaskr Living Quarters, Jorrvaskr, "What does he want?": SetStage 10 (when: the speaker is Vilkas; Proving Honor stage < 10). Source: TIF__0006F6BF.Fragment_0 on INFO Skyrim.esm:06F6BF (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- C02 (Brotherhood) at stage 200 calls SetStage 200. Source: QF_C02_0006E804.fragment_8 (Update.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to <Alias=Observer>", shown at stage 20. Source: Skyrim.esm:06E803 QOBJ 20. **files**
- Dialogue with Skjor, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 20 (when: the speaker is Skjor; the speaker is male). Reply: "He'll answer any questions you have." Source: TIF__00071DE3.Fragment_0 on INFO Skyrim.esm:071DE3 (Skyrim.esm). **script**
- Dialogue with Skjor, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 20 (when: the speaker is Skjor; the speaker is female). Reply: "She'll answer any questions you have." Source: TIF__00071DE4.Fragment_0 on INFO Skyrim.esm:071DE4 (Skyrim.esm). **script**

**Who and where**

- First objective: "Speak to Skjor". Source: Skyrim.esm:06E803 QOBJ 10. **files**
- Target alias Skjor (unique): Skjor (unique actor, placed in Jorrvaskr Living Quarters, Jorrvaskr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Jorrvaskr Living Quarters, Jorrvaskr: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. Brotherhood (`C02`, Skyrim.esm:06E804, Update.esm)

**Started by**

- C02Kicker, a helper quest at stage 200 calls SetStage 1; C02Kicker is started by C01 (Proving Honor) at stage 40 (Start). Source: QF_C02Kicker_000A3EF8.fragment_2 on Skyrim.esm:0A3EF8 (Skyrim.esm), through C00 (Take Up Arms)'s startstoryquest. **script**
- Dialogue with someone the line does not name (named by alias QuestGiver of C02 (Brotherhood) (run time)), "Why were you waiting for me?": SetStage 10 (when: the speaker is the one in alias QuestGiver). Source: TIF__000C07ED.Fragment_0 on INFO Skyrim.esm:0C07ED (Skyrim.esm). **script**
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
- Dialogue with Aela the Huntress (named by alias Aela of C03 (The Silver Hand) (unique)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "I'm looking for work.": SetStage 5 (when: the speaker is the one in alias Aela; The Silver Hand stage < 5). Source: TIF__000C5C16.Fragment_0 on INFO Skyrim.esm:0C5C16 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Farkas, placed in Jorrvaskr Living Quarters, Jorrvaskr, "I'm looking for work.": SetStage 5 (when: The Silver Hand stage < 10; the speaker is Farkas or the speaker is Vilkas). Source: TIF__000A7052.Fragment_0 on INFO Skyrim.esm:0A7052 (Skyrim.esm). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet with Skjor at night", shown at stage 10. Source: Skyrim.esm:01CEF4 QOBJ 10. **files**
- Dialogue with Skjor (named by alias Skjor of C03 (The Silver Hand) (unique)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "You wanted to see me?": SetStage 10 (when: the speaker is the one in alias Skjor; The Silver Hand stage == 5). Reply: "Yes. I have something a little different planned this time." Source: TIF__0006767A.Fragment_0 on INFO Skyrim.esm:06767A (Skyrim.esm). **script**
- Dialogue with Skjor (named by alias Skjor of C03 (The Silver Hand) (unique)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "I'm looking for work.": SetStage 10 (when: the speaker is the one in alias Skjor; The Silver Hand stage < 10). Reply: "Yes, I have something special for you. " Source: TIF__000C5C15.Fragment_0 on INFO Skyrim.esm:0C5C15 (Skyrim.esm). **script**

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
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; USKPVersionTracking is started by the start-game flag. Sources: USKP_VersionTrackingScript.ProcessRetroScripts, USKP_VersionTrackingScript.OnInit, USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9. **script**
- USKPRetroactive11 (named "Retroactive fixes added for 1.1" in its record), a helper quest calls Start; Start; Start; Start; Start; Start; Start; Start; USKPRetroactive11 is started by the start-game flag. Sources: USKPOnLoad04aScript.Process on Unofficial Skyrim Special Edition Patch.esp:02EE20. **script**
- USKPRetroactive12 (named "Retroactive fixes added for 1.2" in its record), a helper quest with Saerlund, Harrald, Adara calls Start; Start; Start; Start; USKPRetroactive12 is started by the start-game flag. Sources: USKPOnLoad05Script.Process on Unofficial Skyrim Special Edition Patch.esp:0339CE. **script**
- USKPRetroactive121 (named "Retroactive fixes for 1.2.1" in its record), a helper quest calls Start; Start; USKPRetroactive121 is started by the start-game flag. Sources: USKPRetroactive121Script.Process on Unofficial Skyrim Special Edition Patch.esp:03B601. **script**
- USKPRetroactive122 (named "Retroactive fixes for 1.2.2" in its record), a helper quest with Lortheim, Jora, Viola calls Start; USKPRetroactive122 is started by the start-game flag. Source: USKPRetroactive122Script.Process on Unofficial Skyrim Special Edition Patch.esp:03F6A2 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Aela the Huntress (named by alias Aela of C04 (Blood's Honor) (unique)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "I'm looking for work.": SetStage 10 (when: the speaker is the one in alias Aela; Blood's Honor stage < 10). Source: TIF__000582A0.Fragment_0 on INFO Skyrim.esm:0582A0 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect a Glenmoril Witch's head", shown at stage 20. Source: Skyrim.esm:01CEF5 QOBJ 20. **files**
- Dialogue with Kodlak Whitemane (named by alias Kodlak of C04 (Blood's Honor) (unique)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "It will be done.": SetStage 20 (when: the speaker is the one in alias Kodlak; fn131 == 1). Reply: "Talos guide you, lad." Source: TIF__000177FF.Fragment_0 on INFO Skyrim.esm:0177FF (Skyrim.esm). **script**
- Dialogue with Kodlak Whitemane (named by alias Kodlak of C04 (Blood's Honor) (unique)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "It will be done.": SetStage 15 (when: the speaker is the one in alias Kodlak; fn131 == 1). Reply: "Talos guide you, lass." Source: TIF__00017800.Fragment_0 on INFO Skyrim.esm:017800 (Skyrim.esm). **script**
- Dialogue with Kodlak Whitemane (named by alias Kodlak of C04 (Blood's Honor) (unique)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "Is there a way to cure yourself?": SetStage 20 (when: the speaker is the one in alias Kodlak). Reply: "That's what I've spent my twilight years trying to find out." Source: TIF__000582D9.Fragment_0 on INFO Skyrim.esm:0582D9 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Speak to Kodlak Whitemane". Source: Skyrim.esm:01CEF5 QOBJ 10. **files**
- Target alias Kodlak (unique): Kodlak Whitemane (unique actor, placed in Jorrvaskr Living Quarters, Jorrvaskr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Jorrvaskr Living Quarters, Jorrvaskr: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 6. Purity of Revenge (`C05`, Skyrim.esm:06E805, Update.esm)

**Started by**

- Patch1_9_UpdateQuest, a helper quest at stage 10 calls SetStage 1; Patch1_9_UpdateQuest is started by the start-game flag. Source: QF_Patch1_9_UpdateQuest_010009A3.fragment_0 on Update.esm:0009A3 (Update.esm), through C00 (Take Up Arms)'s startstoryquest. **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; USKPVersionTracking is started by the start-game flag. Sources: USKP_VersionTrackingScript.ProcessRetroScripts, USKP_VersionTrackingScript.OnInit, USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9. **script**
- USKPRetroactive130 (named "Retroactive fixes for 1.3.0" in its record), a helper quest calls Start; SetStage 1; USKPRetroactive130 is started by the start-game flag. Sources: USKPRetroactive130Script.Process on Unofficial Skyrim Special Edition Patch.esp:012F33. **script**
- USKPRetroactive127 (named "Retroactive fixes for 1.2.7" in its record), a helper quest with Odfel calls Start; SetStage 1; Start; SetStage 1; USKPRetroactive127 is started by the start-game flag. Sources: USKPRetroactive127Script.Process on Unofficial Skyrim Special Edition Patch.esp:0187DE. **script**
- USKPRetroactive125 (named "Retroactive fixes for 1.2.5" in its record), a helper quest with Garakh, Atub, Addvar calls Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; USKPRetroactive125 is started by the start-game flag. Sources: USKPRetroactive125Script.Process on Unofficial Skyrim Special Edition Patch.esp:01E696. **script**
- USKPRetroactive126 (named "Retroactive fixes for 1.2.6" in its record), a helper quest with Niranye, Arivanya, Ysolda calls Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; Start; SetStage 1; USKPRetroactive126 is started by the start-game flag. Sources: USKPRetroactive126Script.Process on Unofficial Skyrim Special Edition Patch.esp:025354. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "(Optional) Wipe out the Silver Hand", shown at stage 10. Source: Skyrim.esm:06E805 QOBJ 11. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

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

- Patch1_9_UpdateQuest, a helper quest at stage 10 calls SetStage 1; Patch1_9_UpdateQuest is started by the start-game flag. Source: QF_Patch1_9_UpdateQuest_010009A3.fragment_0 on Update.esm:0009A3 (Update.esm), through C00 (Take Up Arms)'s startstoryquest. **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; USKPVersionTracking is started by the start-game flag. Sources: USKP_VersionTrackingScript.ProcessRetroScripts, USKP_VersionTrackingScript.OnInit, USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9. **script**
- USKPRetroactive203 (named "Retroactive fixes for 2.0.3" in its record), a helper quest calls Start; Start; Start; Start; Start; Start; Start; Start; USKPRetroactive203 is started by the start-game flag. Sources: uskpretroactive203script.Process on Unofficial Skyrim Special Edition Patch.esp:01068A. **script**
- USKPRetroactive204 (named "Retroactive fixes for 2.0.4" in its record), a helper quest with Gabriella, Erikur, Susanna calls Start; Start; Start; Start; USKPRetroactive204 is started by the start-game flag. Sources: USKPRetroactive204Script.Process on Unofficial Skyrim Special Edition Patch.esp:012C3A. **script**
- USKPRetroactive205 (named "Retroactive fixes for 2.0.5" in its record), a helper quest with Keerava calls Start; Start; USKPRetroactive205 is started by the start-game flag. Sources: USKPRetroactive205Script.Process on Unofficial Skyrim Special Edition Patch.esp:040578. **script**
- USKPRetroactive206 (named "Retroactive fixes for 2.0.6" in its record), a helper quest with Vekel, Oengul calls Start; USKPRetroactive206 is started by the start-game flag. Source: USKPRetroactive206Script.Process on Unofficial Skyrim Special Edition Patch.esp:04C7DF (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Give the fragments of Wuuthrad to Eorlund", shown at stage 15. Source: Skyrim.esm:01CEF6 QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Attend Kodlak's funeral". Source: Skyrim.esm:01CEF6 QOBJ 10. **files**
- Target alias FuneralLocationMarker (forced): a marker (forced reference, placed in Whiterun). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 8. Animal Extermination (`CR01`, Skyrim.esm:01CEEE, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Story manager node CompanionsAelaNode, event: script event; conditions up its parents: GetEventData CRAela == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsAelaNode Skyrim.esm:0BFC77 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=Questgiver>", shown at stage 20. Source: Skyrim.esm:01CEEE QOBJ 20. **files**
- CR01 (Animal Extermination) calls SetStage 20. Source: CR01BeastScript.OnDeath on Skyrim.esm:01CEEE (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Kill the <Alias=Beast>". Source: Skyrim.esm:01CEEE QOBJ 10. **files**
- Target alias Beast (created): Skyrim.esm:025232 (created item). **files**

**Needs**

- Its own conditions: GetInFaction The Companions == 1; GetVMQuestVariable Animal Extermination == 1; GetVMQuestVariable Take Up Arms == 0. **files**

**Gives**: nothing on its completing stages.

## 9. Animal Extermination (`CR02`, Skyrim.esm:025185, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Story manager node CompanionsAelaNode, event: script event; conditions up its parents: GetEventData CRAela == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsAelaNode Skyrim.esm:0BFC77 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=Questgiver>", shown at stage 20. Source: Skyrim.esm:025185 QOBJ 20. **files**
- CR02 (Animal Extermination) calls SetStage 20. Source: CR02BeastBossScript.OnDeath on Skyrim.esm:025185 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Clear out <Alias=AnimalDen>". Source: Skyrim.esm:025185 QOBJ 10. **files**
- Target alias BeastBoss (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: GetInFaction The Companions == 1; GetVMQuestVariable Animal Extermination == 1; GetVMQuestVariable Take Up Arms == 0. **files**

**Gives**: nothing on its completing stages.

## 10. Animal Pelt Collection (`CR03`, Skyrim.esm:025230, Companions Radiant Expansion.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=Questgiver>", shown at stage 20. Source: Skyrim.esm:025230 QOBJ 20. **files**
- It starts by itself from the start of the game. (SetStage 20). Source: CR03QuestScript.OnUpdate on Skyrim.esm:025230 (Companions Radiant Expansion.esp). **script**

**Who and where**

- First objective: "Collect <Alias=SamplePelt>s (<Global=CR03PeltsGotten>/<Global=CR03TotalPeltsNeeded>)". Source: Skyrim.esm:025230 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: Take Up Arms stage 100 done; The Silver Hand not completed or Blood's Honor completed or Animal Pelt Collection stage > 1. **files**

**Gives**: nothing on its completing stages.

## 11. Hired Muscle (`CR04`, Skyrim.esm:025231, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Story manager node CompanionsFarkasNode, event: script event; conditions up its parents: GetEventData CRFarkas == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsFarkasNode Skyrim.esm:0BFC78 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=Questgiver>", shown at stage 20. Source: Skyrim.esm:025231 QOBJ 20. **files**
- DialogueFavorGeneric (named "Generic dialogue" in its record), a helper quest calls SetStage 20; DialogueFavorGeneric is started by the start-game flag. Source: FavorDialogueScript.Intimidate on Skyrim.esm:05A6DC (Meridia.esp), through CR04 (Hired Muscle)'s checkintimidate. **script**
- DGIntimidateQuest, a helper quest at stage 100 calls SetStage 20; DGIntimidateQuest is started by story manager node DGIntimidateQuestNode (event: script event; GetEventData FavorBrawlEvent == 1). Source: QF_DGIntimidateQuest_00047AE6.fragment_5 on Skyrim.esm:047AE6 (Skyrim.esm), through CR04 (Hired Muscle)'s checkintimidate. **script**
- It starts by itself from the start of the game. (SetStage 20). Source: CR04QuestScript.CheckIntimidate on Skyrim.esm:025231 (Unofficial Skyrim Special Edition Patch.esp). **script**
- CW, a helper quest with Tullius, Ulfric, Rikke calls SetStage 20; CW is started by CWMissionQuickStart, a helper quest at stage 200 (SetStage 2); CWMissionQuickStart, a helper quest at stage 42 (SetStage 2); CWMissionQuickStart, a helper quest at stage 600 (SetStage 1); CWMissionQuickStart, a helper quest at stage 71 (SetStage 1); the start-game flag. Source: CWScript.Intimidate on Skyrim.esm:019E53 (LoreRim - Dialogue Patch.esp), through CR04 (Hired Muscle)'s checkintimidate. **script**
- DLC1RadiantDisguised, a helper quest calls SetStage 20; DLC1RadiantDisguised is started by the start-game flag. Source: DLC1RadiantDisguisedScript.Intimidate on Dawnguard.esm:01574C (Dawnguard.esm), through CR04 (Hired Muscle)'s checkintimidate. **script**
- Dialogue with Nelacar, placed in The Frozen Hearth, "I didn't agree to anything. Talk. (Intimidate)": SetStage 20 (when: the speaker is Nelacar; fn655 == 1). Reply: "Just calm down. I'll tell you everything." Source: TIF__00024663.Fragment_0 on INFO Skyrim.esm:024663 (Skyrim.esm). **script**
- Dialogue with Captain Aldis, placed in Castle Dour, "Well, I'm making it "need to know." (Intimidate)": SetStage 20 (when: No News is Good News stage == 10; the speaker is Captain Aldis). Reply: "If you want to know that bad then fine." Source: TIF__00034B3E.Fragment_1 on INFO Skyrim.esm:034B3E (Skyrim.esm). **script**
- Dialogue with Lynly Star-Sung, placed in Vilemyr Inn, Ivarstead Vilemyr Inn, "Stop lying or I'll beat it out of you! (Intimidate)": SetStage 20 (when: the speaker is Lynly Star-Sung; fn655 == 1; global FFRiften02Solved == 0 (now 0)). Reply: "Please, I beg you, don't tell Sibbi where I am. He'll kill me!" Source: TIF__0003C4DA.Fragment_0 on INFO Skyrim.esm:03C4DA (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Intimidate <Alias=Brute> in <Alias=BruteTown>". Source: Skyrim.esm:025231 QOBJ 10. **files**
- Target alias Brute (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: GetInFaction The Companions == 1; GetVMQuestVariable Hired Muscle == 1; GetVMQuestVariable Take Up Arms == 0. **files**

**Gives**: nothing on its completing stages.

## 12. Trouble in Skyrim (`CR05`, Skyrim.esm:02522F, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsFarkasNode, event: script event; conditions up its parents: GetEventData CRFarkas == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsFarkasNode Skyrim.esm:0BFC78 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=Questgiver>", shown at stage 20. Source: Skyrim.esm:02522F QOBJ 20. **files**
- CR05 (Trouble in Skyrim) calls SetStage 20. Source: CR05BossScript.OnDeath on Skyrim.esm:02522F (Companions Radiant Expansion.esp). **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls SetStage 20; USKPVersionTracking is started by the start-game flag. Source: USKP_VersionTrackingScript.ProcessRetroScripts on Unofficial Skyrim Special Edition Patch.esp:00D8B9 (Unofficial Skyrim Special Edition Patch.esp), through USKPRetroactive126 (Retroactive fixes for 1.2.6)'s process. **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls SetStage 20; USKPVersionTracking is started by the start-game flag. Source: USKP_VersionTrackingScript.OnInit on Unofficial Skyrim Special Edition Patch.esp:00D8B9 (Unofficial Skyrim Special Edition Patch.esp), through USKPRetroactive126 (Retroactive fixes for 1.2.6)'s process. **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls SetStage 20; USKPVersionTracking is started by the start-game flag. Source: USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9 (Unofficial Skyrim Special Edition Patch.esp), through USKPRetroactive126 (Retroactive fixes for 1.2.6)'s process. **script**
- USKPRetroactive124 (named "Retroactive fixes for 1.2.4" in its record), a helper quest calls SetStage 20; USKPRetroactive124 is started by the start-game flag. Source: USKPRetroactive124Script.Process on Unofficial Skyrim Special Edition Patch.esp:017224 (Unofficial Skyrim Special Edition Patch.esp), through USKPRetroactive126 (Retroactive fixes for 1.2.6)'s process. **script**
- USKPRetroactive125 (named "Retroactive fixes for 1.2.5" in its record), a helper quest with Garakh, Atub, Addvar calls SetStage 20; USKPRetroactive125 is started by the start-game flag. Source: USKPRetroactive125Script.Process on Unofficial Skyrim Special Edition Patch.esp:01E696 (Unofficial Skyrim Special Edition Patch.esp), through USKPRetroactive126 (Retroactive fixes for 1.2.6)'s process. **script**
- USKPRetroactive126 (named "Retroactive fixes for 1.2.6" in its record), a helper quest with Niranye, Arivanya, Ysolda calls SetStage 20; USKPRetroactive126 is started by the start-game flag. Source: USKPRetroactive126Script.Process on Unofficial Skyrim Special Edition Patch.esp:025354 (Unofficial Skyrim Special Edition Patch.esp). **script**
- USKPRetroactive123 (named "Retroactive fixes for 1.2.3" in its record), a helper quest calls SetStage 20; USKPRetroactive123 is started by the start-game flag. Source: USKPRetroactive123Script.Process on Unofficial Skyrim Special Edition Patch.esp:0406DC (Unofficial Skyrim Special Edition Patch.esp), through USKPRetroactive126 (Retroactive fixes for 1.2.6)'s process. **script**

**Who and where**

- First objective: "Kill the leader of <Alias=Location>". Source: Skyrim.esm:02522F QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: Take Up Arms stage 100 done. **files**

**Gives**: nothing on its completing stages.

## 13. Family Heirloom (`CR06`, Skyrim.esm:0C18E1, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsVilkasSkjorDeadNode, event: script event; conditions up its parents: GetDead == 1; GetEventData CRVilkas == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsVilkasSkjorDeadNode Skyrim.esm:0EC1A8 (Unofficial Skyrim Special Edition Patch.esp). **files**
- Story manager node CompanionsSkjorNode, event: script event; conditions up its parents: GetEventData CRSkjor == 1; GetDead == 0; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsSkjorNode Skyrim.esm:0BFC79 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias=Questgiver>", shown at stage 20. Source: Skyrim.esm:0C18E1 QOBJ 20. **files**
- CR06 (Family Heirloom) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on Skyrim.esm:0C18E1 (Companions Radiant Expansion.esp). **script**

**Who and where**

- First objective: "Retrieve the <Alias=Gewgaw> from <Alias=Location>". Source: Skyrim.esm:0C18E1 QOBJ 10. **files**
- Target alias Gewgaw (created): Skyrim.esm:0E3134 (created item). **files**

**Needs**

- Its own conditions: Take Up Arms stage 100 done; GetVMQuestVariable Take Up Arms >= 2. **files**

**Gives**: nothing on its completing stages.

## 14. Escaped Criminal (`CR07`, Skyrim.esm:025250, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsVilkasSkjorDeadNode, event: script event; conditions up its parents: GetDead == 1; GetEventData CRVilkas == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsVilkasSkjorDeadNode Skyrim.esm:0EC1A8 (Unofficial Skyrim Special Edition Patch.esp). **files**
- Story manager node CompanionsSkjorNode, event: script event; conditions up its parents: GetEventData CRSkjor == 1; GetDead == 0; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsSkjorNode Skyrim.esm:0BFC79 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to <Alias=Questgiver>", shown at stage 20. Source: Skyrim.esm:025250 QOBJ 20. **files**
- CR07 (Escaped Criminal) calls SetStage 20. Source: defaultsetstageondeathrefalias.onDeath on Skyrim.esm:025250 (Companions Radiant Expansion.esp). **script**

**Who and where**

- First objective: "Kill the escaped criminal". Source: Skyrim.esm:025250 QOBJ 10. **files**
- Target alias Criminal (created): Skyrim.esm:093815 (created item). **files**

**Needs**

- Its own conditions: Take Up Arms stage 100 done; GetVMQuestVariable Take Up Arms >= 2. **files**

**Gives**: nothing on its completing stages.

## 15. Rescue Mission (`CR08`, Skyrim.esm:025251, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsVilkasSkjorDeadNode, event: script event; conditions up its parents: GetDead == 1; GetEventData CRVilkas == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsVilkasSkjorDeadNode Skyrim.esm:0EC1A8 (Unofficial Skyrim Special Edition Patch.esp). **files**
- Story manager node CompanionsVilkasAlwaysNode, event: script event; conditions up its parents: GetDead == 0; GetEventData CRVilkas == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsVilkasAlwaysNode Skyrim.esm:0BFC7A (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to <Alias=Victim>", shown at stage 20. Source: Skyrim.esm:025251 QOBJ 20. **files**
- CR08 (Rescue Mission) calls SetStage 20. Source: CR08BossScript.OnDeath on Skyrim.esm:025251 (Companions Radiant Expansion.esp). **script**

**Who and where**

- First objective: "Rescue <Alias=Victim> from <Alias=Lair>". Source: Skyrim.esm:025251 QOBJ 10. **files**
- Target alias Victim (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: Take Up Arms stage 100 done; Proving Honor completed. **files**

**Gives**: nothing on its completing stages.

## 16. Striking the Heart (`CR09`, Skyrim.esm:025252, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsReconNode, event: script event; conditions up its parents: GetEventData CRRecon == 1; Purity of Revenge stage < 10; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsReconNode Skyrim.esm:0BFC7B (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=Questgiver>", shown at stage 20. Source: Skyrim.esm:025252 QOBJ 20. **files**
- CR09 (Striking the Heart) calls SetStage 20. Source: CR09BossScript.OnDeath on Skyrim.esm:025252 (Companions Radiant Expansion.esp). **script**

**Who and where**

- First objective: "Assassinate the Silver Hand leader". Source: Skyrim.esm:025252 QOBJ 10. **files**
- Target alias CampBoss (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: The Silver Hand completed; Blood's Honor not completed or Striking the Heart stage > 1. **files**

**Gives**: nothing on its completing stages.

## 17. Stealing Plans (`CR10`, Skyrim.esm:09D6FC, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsReconNode, event: script event; conditions up its parents: GetEventData CRRecon == 1; Purity of Revenge stage < 10; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsReconNode Skyrim.esm:0BFC7B (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Aela", shown at stage 20. Source: Skyrim.esm:09D6FC QOBJ 20. **files**
- CR10 (Stealing Plans) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on Skyrim.esm:09D6FC (Companions Radiant Expansion.esp). **script**

**Who and where**

- First objective: "Steal the plans from <Alias=Camp>". Source: Skyrim.esm:09D6FC QOBJ 10. **files**
- Target alias Plans (created): Silver Hand Stratagem (created item). **files**

**Needs**

- Its own conditions: The Silver Hand completed; Blood's Honor not completed or Stealing Plans stage > 1. **files**

**Gives**: nothing on its completing stages.

## 18. Retrieval (`CR11`, Skyrim.esm:09D700, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsReconNode, event: script event; conditions up its parents: GetEventData CRRecon == 1; Purity of Revenge stage < 10; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsReconNode Skyrim.esm:0BFC7B (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Aela", shown at stage 20. Source: Skyrim.esm:09D700 QOBJ 20. **files**
- CR11 (Retrieval) calls SetStage 20. Source: defaultsetstageonplayeracquire.OnContainerChanged on Skyrim.esm:09D700 (Companions Radiant Expansion.esp). **script**

**Who and where**

- First objective: "Retrieve the fragment of Wuuthrad". Source: Skyrim.esm:09D700 QOBJ 10. **files**
- Target alias Fragment (created): Fragment of Wuuthrad (created item). **files**

**Needs**

- Its own conditions: The Silver Hand completed; Blood's Honor not completed or Retrieval stage > 1. **files**

**Gives**: nothing on its completing stages.

## 19. Totems of Hircine (`CR12`, Skyrim.esm:0E3145, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsAelaNode, event: script event; conditions up its parents: GetEventData CRAela == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsAelaNode Skyrim.esm:0BFC77 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Take the Totem to the Underforge", shown at stage 20. Source: Skyrim.esm:0E3145 QOBJ 20. **files**
- Dialogue with Aela the Huntress (named by alias QuestGiver of CR12 (Totems of Hircine) (unique)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "Is this what we're looking for?": SetStage 20 (when: the speaker is the one in alias QuestGiver; Take Up Arms's TotemsFound == 0). Reply: "That definitely matches the description of the totem from Skjor's old book. Let's get it to the Underforge." Source: TIF__000E3080.Fragment_0 on INFO Skyrim.esm:0E3080 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Aela the Huntress (named by alias QuestGiver of CR12 (Totems of Hircine) (unique)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "Is this what we're looking for?": SetStage 20 (when: the speaker is the one in alias QuestGiver; Take Up Arms's TotemsFound == 1). Reply: "That's it! That's the second Totem. Quickly, let's put it back with the other one." Source: TIF__000E3082.Fragment_0 on INFO Skyrim.esm:0E3082 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Aela the Huntress (named by alias QuestGiver of CR12 (Totems of Hircine) (unique)), placed in Jorrvaskr Living Quarters, Jorrvaskr, "Is this what we're looking for?": SetStage 20 (when: the speaker is the one in alias QuestGiver; Take Up Arms's TotemsFound == 2). Reply: "At last... the final Totem is ours. Let's go complete our set." Source: TIF__000E3083.Fragment_0 on INFO Skyrim.esm:0E3083 (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Retrieve the Totem of Hircine". Source: Skyrim.esm:0E3145 QOBJ 10. **files**
- Target alias Totem (run time): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: Glory of the Dead completed; has the spell Beast Form; Glory of the Dead completed; GetVMQuestVariable Take Up Arms < 3; GetVMQuestVariable Take Up Arms == 1. **files**

**Gives**: nothing on its completing stages.

## 20. Purity (`CR13`, Skyrim.esm:0E3163, Companions Radiant Expansion.esp)

**Started by**

- Dialogue with Vilkas, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker is Vilkas). Source: TIF__000E3075.Fragment_0 on INFO Skyrim.esm:0E3075 (Companions Radiant Expansion.esp). **script**
- Dialogue with Farkas, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 10 (when: the speaker is Farkas). Source: TIF__000E3076.Fragment_0 on INFO Skyrim.esm:0E3076 (Companions Radiant Expansion.esp). **script**
- Story manager node CompanionsFarkasPostQuestlineNode, event: script event; conditions up its parents: Glory of the Dead completed; GetVMQuestVariable Take Up Arms == 1; GetEventData CRFarkas == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsFarkasPostQuestlineNode Skyrim.esm:0F6086 (Skyrim.esm). **files**
- Story manager node VilkasPostQuestlineNode, event: script event; conditions up its parents: Glory of the Dead completed; GetVMQuestVariable Take Up Arms == 1; GetEventData CRVilkas == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: VilkasPostQuestlineNode Skyrim.esm:0F6084 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Cleanse <Alias=Questgiver> of beastblood", shown at stage 15. Source: Skyrim.esm:0E3163 QOBJ 15. **files**
- Dialogue with Vilkas, placed in Jorrvaskr Living Quarters, Jorrvaskr, "I have it.": SetStage 15 (when: the speaker is Vilkas). Reply: "Lead on, to Ysgramor and glory." Source: TIF__000E2FE7.Fragment_0 on INFO Skyrim.esm:0E2FE7 (Skyrim.esm). **script**
- Dialogue with Farkas, placed in Jorrvaskr Living Quarters, Jorrvaskr, "I have it.": SetStage 15 (when: the speaker is Farkas). Reply: "This is good. Could you show the way to the tomb again?" Source: TIF__000E2FE8.Fragment_0 on INFO Skyrim.esm:0E2FE8 (Skyrim.esm). **script**
- Dialogue with Vilkas, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 15 (when: the speaker is Vilkas; GetItemCount Glenmoril Witch Head > 0). Reply: "You still bear a head of the Glenmoril betrayers, yes? Then lead on, back to the Tomb of Ysgramor." Source: TIF__000E306E.Fragment_0 on INFO Skyrim.esm:0E306E (Companions Radiant Expansion.esp). **script**
- Dialogue with Farkas, placed in Jorrvaskr Living Quarters, Jorrvaskr: SetStage 15 (when: the speaker is Farkas; GetItemCount Glenmoril Witch Head > 0). Reply: "You still have one of the witch's heads. This is good." Source: TIF__000E306F.Fragment_0 on INFO Skyrim.esm:0E306F (Companions Radiant Expansion.esp). **script**

**Who and where**

- First objective: "Collect a Glenmoril Witch's head". Source: Skyrim.esm:0E3163 QOBJ 10. **files**
- Target alias Witch (run time): Glenmoril Witch (named in its conditions, placed in Glenmoril Coven, Glenmoril Coven). **files**

**Needs**

- Its own conditions: Glory of the Dead completed. **files**
- Ways in: Glenmoril Coven: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 21. Dragon Seekers (`CR14`, Skyrim.esm:0E3156, Companions Radiant Expansion.esp)

**Started by**

- Story manager node CompanionsVilkasSkjorDeadNode, event: script event; conditions up its parents: GetDead == 1; GetEventData CRVilkas == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsVilkasSkjorDeadNode Skyrim.esm:0EC1A8 (Unofficial Skyrim Special Edition Patch.esp). **files**
- Story manager node CompanionsFarkasNode, event: script event; conditions up its parents: GetEventData CRFarkas == 1; GetEventData CRAela == 1 or GetEventData CRFarkas == 1 or GetEventData CRSkjor == 1 or GetEventData CRVilkas == 1 or GetEventData CRRecon == 1 or GetEventData CRReconKicker == 1. Source: CompanionsFarkasNode Skyrim.esm:0BFC78 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to <Alias.ShortName=Questgiver>", shown at stage 20. Source: Skyrim.esm:0E3156 QOBJ 20. **files**
- CR14 (Dragon Seekers) calls SetStage 20. Source: CR02BeastBossScript.OnDeath on Skyrim.esm:0E3156 (Companions Radiant Expansion.esp). **script**

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
- When it's offered: the speaker is Aela the Huntress; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now 0).
- What it does: SetStage 10 on C00 (Take Up Arms). Source: TIF__000231C8.Fragment_0 on INFO Skyrim.esm:0231C8 (LoreRim - Dialogue Patch.esp); topic CRNoWorkBranchTopic. **script**
- In one sentence: Talk to Aela the Huntress (Nord) in Jorrvaskr Living Quarters, Jorrvaskr and choose "Can I join the Companions?", when the speaker is Aela the Huntress; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now 0): SetStage 10 on C00 (Take Up Arms).

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
- When it's offered: the speaker is Farkas; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now 0).
- What it does: SetStage 10 on C00 (Take Up Arms). Source: TIF__0005477C.Fragment_0 on INFO Skyrim.esm:05477C (LoreRim - Dialogue Patch.esp); topic CRNoWorkBranchTopic. **script**
- In one sentence: Talk to Farkas (Nord) in Jorrvaskr Living Quarters, Jorrvaskr and choose "Can I join the Companions?", when the speaker is Farkas; GetInFaction The Companions == 0; GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_AVMin (now 30) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150) or GetActorValue >= NGCDT_GLOB_Aela_HMSMin (now 150); Take Up Arms stage <= 10; global NGCDT_GLOB_AelaGreetingDone != 2 (now 0): SetStage 10 on C00 (Take Up Arms).

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
- When it's offered: the speaker isn't the one in alias GenericDialogueSuppressor1; the speaker isn't the one in alias GenericDialogueSuppressor2; the speaker isn't the one in alias GenericDialogueSuppressor3; the speaker isn't the one in alias GenericDialogueSuppressor4; the speaker is Njada Stonearm; Take Up Arms stage 100 not done; you're in Jorrvaskr or you're in Jorrvaskr.
- What it does: SetStage 10 on C00 (Take Up Arms). Source: TIF__000DAB4F.Fragment_0 on INFO Skyrim.esm:0DAB4F (Companions at Mirmulnir.esp); topic DialogueCompanionsJorrvaskrPreJoinWhosInChargeTopic. **script**
- In one sentence: Talk to Njada Stonearm (Nord) in Jorrvaskr Living Quarters, Jorrvaskr and choose "Who's in charge around here?", when the speaker isn't the one in alias GenericDialogueSuppressor1; the speaker isn't the one in alias GenericDialogueSuppressor2; the speaker isn't the one in alias GenericDialogueSuppressor3; the speaker isn't the one in alias GenericDialogueSuppressor4; the speaker is Njada Stonearm; Take Up Arms stage 100 not done; you're in Jorrvaskr or you're in Jorrvaskr: SetStage 10 on C00 (Take Up Arms).

### dialogue INFO Skyrim.esm:0DAB51

- Speaker: Torvar (Nord), placed in Jorrvaskr Living Quarters, Jorrvaskr. Named by: GetIsID.
- The player's prompt: "Who's in charge around here?".
- The reply: "In charge of what? I'm in charge of me, and you're in charge of you." / "If you're looking to join up, Kodlak's the one to be talking to.".
- When it's offered: the speaker isn't the one in alias GenericDialogueSuppressor1; the speaker isn't the one in alias GenericDialogueSuppressor2; the speaker isn't the one in alias GenericDialogueSuppressor3; the speaker isn't the one in alias GenericDialogueSuppressor4; the speaker is Torvar; Take Up Arms stage 100 not done; you're in Jorrvaskr or you're in Jorrvaskr.
- What it does: SetStage 10 on C00 (Take Up Arms). Source: TIF__000DAB51.Fragment_0 on INFO Skyrim.esm:0DAB51 (Companions at Mirmulnir.esp); topic DialogueCompanionsJorrvaskrPreJoinWhosInChargeTopic. **script**
- In one sentence: Talk to Torvar (Nord) in Jorrvaskr Living Quarters, Jorrvaskr and choose "Who's in charge around here?", when the speaker isn't the one in alias GenericDialogueSuppressor1; the speaker isn't the one in alias GenericDialogueSuppressor2; the speaker isn't the one in alias GenericDialogueSuppressor3; the speaker isn't the one in alias GenericDialogueSuppressor4; the speaker is Torvar; Take Up Arms stage 100 not done; you're in Jorrvaskr or you're in Jorrvaskr: SetStage 10 on C00 (Take Up Arms).

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
