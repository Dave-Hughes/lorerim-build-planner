# Start check: Thirsk Mead Hall (`thirsk`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Thirsk Rumors (`DLC2MHMisc`, Dragonborn.esm:02BAB0, Dragonborn.esm)

**Started by**

- Dialogue with Geldis Sadri, placed in The Retching Netch: Start (when: GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri). Source: DLC2_TIF__0203A29B.Fragment_0 on INFO Dragonborn.esm:03A29B (Unofficial Skyrim Special Edition Patch.esp). **script**
- It starts from something placed in Thirsk, by the door to Thirsk Mead Hall. (Start). Source: DLC2ThirskAssaultTriggerScript on Dragonborn.esm:01A526 (1 placed). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Investigate Thirsk Mead Hall and the exiled Nords". Source: Dragonborn.esm:02BAB0 QOBJ 10. **files**
- Target alias ThirskCenter (forced): a marker (forced reference, placed in Thirsk). **files**
- Target alias RetreatCenter (forced): a marker (forced reference, placed in Bujold's Retreat). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Thirsk: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Retaking Thirsk (`DLC2MH01`, Dragonborn.esm:01A50B, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Bujold the Intrepid, placed in Bujold's Retreat, "I don't think I can help you right now.": SetStage 10 (when: the speaker is Bujold the Intrepid; Retaking Thirsk stage < 10). Source: DLC2_TIF__0201A4E6.Fragment_0 on INFO Dragonborn.esm:01A4E6 (Dragonborn.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- DLC2MH02 (The Chief of Thirsk Hall) at stage 35 calls SetStage 205. Source: DLC2_QF_DLC2MH02_0201A50C.fragment_7 (Unofficial Skyrim Special Edition Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Approach Thirsk Mead Hall", shown at stage 20. Source: Dragonborn.esm:01A50B QOBJ 20. **files**
- DLC2MHRieklingHandler, a helper quest with Riekling001 calls SetStage 20; DLC2MHRieklingHandler is started by the start-game flag. Source: DLC2MHRieklingHandlerQuestScript.ProcessFoundRieklings on Dragonborn.esm:01A523 (Dragonborn.esm). **script**
- DLC2MHRieklingHandler, a helper quest with Riekling001 at stage 0 calls SetStage 20; DLC2MHRieklingHandler is started by the start-game flag. Source: DLC2_QF_DLC2MHRieklingHandler_0201A523.fragment_0 on Dragonborn.esm:01A523 (Dragonborn.esm), through DLC2MHRieklingHandler's processfoundrieklings. **script**

**Who and where**

- First objective: "Join the assault on Thirsk Mead Hall". Source: Dragonborn.esm:01A50B QOBJ 10. **files**
- Target alias Bujold (unique): Bujold the Intrepid (unique actor, placed in Bujold's Retreat). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 3. The Chief of Thirsk Hall (`DLC2MH02`, Dragonborn.esm:01A50C, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Riekling, placed in Thirsk Mead Hall, "Bilgemuck is an animal of some kind? And you want it back?": SetStage 10 (when: the speaker is Riekling). Source: DLC2_TIF__0201F185.Fragment_1 on INFO Dragonborn.esm:01F185 (Dragonborn.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return Bilgemuck to Thirsk", shown at stage 15. Source: Dragonborn.esm:01A50C QOBJ 15. **files**
- DLC2MH02 (The Chief of Thirsk Hall) calls SetStage 15. Source: DLC2MH02BilgemuckScript.OnItemAdded on Dragonborn.esm:01A50C (Unofficial Skyrim Special Edition Patch.esp). **script**

**Who and where**

- First objective: "Give Bilgemuck some meat". Source: Dragonborn.esm:01A50C QOBJ 10. **files**
- Target alias Bilgemuck (created): Bilgemuck (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 4. Elmus Favor Quest (`DLC2ThirskFFElmus`, Dragonborn.esm:038EBF, Dragonborn.esm)

**Started by**

- DLC2Init (named "Init quest" in its record), a helper quest with DremoraButler, DremoraMerchant at stage 100 calls Start; DLC2Init is started by the start-game flag. Source: DLC2_QF_DLC2_MQ04_02016E02.fragment_4 on Dragonborn.esm:016E02 (Fozars_Dragonborn_-_Requiem_Patch.esp). **script**
- Dialogue with Elmus (named by alias Elmus of DLC2ThirskFFElmus (Elmus Favor Quest) (unique)), placed in Bujold's Retreat, "Is there anything that would make being down here more bearable?": SetStage 10 (when: the speaker is the one in alias Elmus; Elmus Favor Quest stage < 10). Source: TIF__02038EBC.Fragment_0 on INFO Dragonborn.esm:038EBC (Dragonborn.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring Elmus some Ashfire Mead from Thirsk Mead Hall". Source: Dragonborn.esm:038EBF QOBJ 10. **files**
- Target alias ThirskDoor (forced): Door (forced reference, placed in Thirsk). **files**
- Target alias Elmus (unique): Elmus (unique actor, placed in Bujold's Retreat). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Thirsk: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward02Medium (levelled: gold) (stage 200, QF_DLC2ThirskFFElmus_02038EBF.fragment_2).

## 5. Elmus Favor Quest (`DLC2ThirskFFElmusBack`, Dragonborn.esm:038EC4, Dragonborn.esm)

**Started by**

- DLC2MH01 (Retaking Thirsk) at stage 30 calls Start; its stage 30 is set by Dialogue with Bujold the Intrepid, placed in Bujold's Retreat: SetStage 30 (when: the speaker is Bujold the Intrepid). Source: DLC2_QF_DLC2MH01_0201A50B.fragment_2 on Dragonborn.esm:01A50B (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Elmus (named by alias Elmus of DLC2ThirskFFElmusBack (Elmus Favor Quest) (unique)), placed in Bujold's Retreat, "How is the mead?": SetStage 10 (when: the speaker is the one in alias Elmus; Elmus Favor Quest stage < 10). Source: TIF__02038EBE.Fragment_0 on INFO Dragonborn.esm:038EBE (Dragonborn.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring Elmus some Juniper Berries". Source: Dragonborn.esm:038EC4 QOBJ 10. **files**
- Target alias Elmus (unique): Elmus (unique actor, placed in Bujold's Retreat). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: LvlQuestReward01Small (levelled: gold) (stage 200, QF_DLC2ThirskFFElmusBack_02038EC4.fragment_2); Ashfire Mead x10 (stage 200, QF_DLC2ThirskFFElmusBack_02038EC4.fragment_2).

## 6. Halbarn Favor Quest (`DLC2ThirskFFHalbarn`, Dragonborn.esm:038FBC, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DLC2MH01 (Retaking Thirsk) at stage 30 calls Start; its stage 30 is set by Dialogue with Bujold the Intrepid, placed in Bujold's Retreat: SetStage 30 (when: the speaker is Bujold the Intrepid). Source: DLC2_QF_DLC2MH01_0201A50B.fragment_2 on Dragonborn.esm:01A50B (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Halbarn Iron-Fur (named by alias Halbarn of DLC2ThirskFFHalbarn (Halbarn Favor Quest) (unique)), placed in Thirsk Mead Hall, "Are you getting back to work?": SetStage 10 (when: the speaker is the one in alias Halbarn; Halbarn Favor Quest stage < 10). Source: TIF__02038FB9.Fragment_0 on INFO Dragonborn.esm:038FB9 (Dragonborn.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring <Global=DLC2ThirskHalbarnStalhrimCount> Stalhrim and <Global=DLC2ThirskHalbarnEbonyCount> Ebony Ingots to Halbarn". Source: Dragonborn.esm:038FBC QOBJ 10. **files**
- Target alias Halbarn (unique): Halbarn Iron-Fur (unique actor, placed in Thirsk Mead Hall). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Thirsk Mead Hall: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward02Medium (levelled: gold) (stage 200, QF_DLC2ThirskFFHalbarn_02038FBC.fragment_1).

## 7. Hilund Favor Quest (`DLC2ThirskFFHilund`, Dragonborn.esm:038FBB, Dragonborn.esm)

**Started by**

- DLC2MH01 (Retaking Thirsk) at stage 30 calls Start; its stage 30 is set by Dialogue with Bujold the Intrepid, placed in Bujold's Retreat: SetStage 30 (when: the speaker is Bujold the Intrepid). Source: DLC2_QF_DLC2MH01_0201A50B.fragment_2 on Dragonborn.esm:01A50B (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Hilund (named by alias Hilund of DLC2ThirskFFHilund (Hilund Favor Quest) (unique)), placed in Thirsk Mead Hall, "How is the hunting going?": SetStage 10 (when: the speaker is the one in alias Hilund; Hilund Favor Quest stage < 10). Source: TIF__02038FB7.Fragment_0 on INFO Dragonborn.esm:038FB7 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring <Global=DLC2ThirskHilundSpearCount> Riekling Spears to Hilund". Source: Dragonborn.esm:038FBB QOBJ 10. **files**
- Target alias Hilund (unique): Hilund (unique actor, placed in Thirsk Mead Hall). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Thirsk Mead Hall: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: LvlQuestReward02Medium (levelled: gold) (stage 200, QF_DLC2ThirskFFHilund_02038FBB.fragment_1).

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | To get into Thirsk Mead Hall: ask Geldis Sadri in The Retching Netch "" (GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri), which starts Thirsk Rumors. |

## Routes into the first quest from outside the starts

### dialogue INFO Dragonborn.esm:03A29B

- Speaker: Geldis Sadri (Dunmer), placed in The Retching Netch. Named by: GetIsID.
- The player's prompt: "".
- The reply: "Heard that rieklings got a hold of Thirsk Mead Hall. Forced the Nords who lived there to move to a camp nearby.".
- When it's offered: GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri.
- What it does: Start on DLC2MHMisc (Thirsk Rumors). Source: DLC2_TIF__0203A29B.Fragment_0 on INFO Dragonborn.esm:03A29B (Unofficial Skyrim Special Edition Patch.esp); topic DLC2DRRRumorsBranchTopic. **script**
- In one sentence: Talk to Geldis Sadri (Dunmer) in The Retching Netch, when GetQuestRunning Thirsk Rumors == 0; Thirsk Rumors stage 100 not done; the speaker is Geldis Sadri: Start on DLC2MHMisc (Thirsk Rumors).

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
