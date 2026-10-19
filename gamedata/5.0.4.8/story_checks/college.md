# Start check: The College of Winterhold (`college`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. First Lessons (`MG01`, Skyrim.esm:01F251, LoreRim - Dialogue Patch.esp)

**Started by**

- Dialogue with someone the line does not name: SetStage 10 (when: First Lessons stage < 30; the speaker is the one in alias alias 1). Source: TIF__000DF034.Fragment_0 on INFO Skyrim.esm:0DF034 (Skyrim.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:01F251 DNAM (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MG08 (The Eye of Magnus) at stage 0 calls SetStage 200. Source: QF_MG08_0001F258.fragment_0 (College of Winterhold Quest Start Fixes.esp).
- MG07 (The Staff of Magnus) at stage 0 calls SetStage 200. Source: QF_MG07_0001F257.fragment_0 (College of Winterhold Quest Start Fixes.esp).
- mg06 (Revealing the Unseen) at stage 0 calls SetStage 200. Source: QF_MG06_0001F256.fragment_16 (Unofficial Skyrim Special Edition Patch.esp).
- MG04 (Good Intentions) at stage 0 calls SetStage 200. Source: QF_MG04_0001F254.fragment_0 (Unofficial Skyrim Special Edition Patch.esp).
- MG03 (Hitting the Books) at stage 0 calls SetStage 200. Source: QF_MG03_0001F253.fragment_0 (Unofficial Skyrim Special Edition Patch.esp).
- MG02 (Under Saarthal) at stage 0 calls SetStage 200. Source: QF_MG02_0001F252.fragment_0 (CollegeEntry.esp).

**Who and where**

- First objective: "Join the College of Winterhold". Source: Skyrim.esm:01F251 QOBJ 10. **files**
- Target alias MG01FaraldaAlias (unique): Faralda (unique actor, placed in Hall of Countenance, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Countenance, Dormitory: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Under Saarthal (`MG02`, Skyrim.esm:01F252, CollegeEntry.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MG08 (The Eye of Magnus) at stage 0 calls SetStage 200. Source: QF_MG08_0001F258.fragment_0 (College of Winterhold Quest Start Fixes.esp).
- MG07 (The Staff of Magnus) at stage 0 calls SetStage 200. Source: QF_MG07_0001F257.fragment_0 (College of Winterhold Quest Start Fixes.esp).
- mg06 (Revealing the Unseen) at stage 0 calls SetStage 200. Source: QF_MG06_0001F256.fragment_16 (Unofficial Skyrim Special Edition Patch.esp).
- MG04 (Good Intentions) at stage 0 calls SetStage 200. Source: QF_MG04_0001F254.fragment_0 (Unofficial Skyrim Special Edition Patch.esp).
- MG03 (Hitting the Books) at stage 0 calls SetStage 200. Source: QF_MG03_0001F253.fragment_0 (Unofficial Skyrim Special Edition Patch.esp).
- COW_CentralQuest (College Curriculum) at stage 50 calls Start. Source: QF_COW_CentralQuest_05014C23.fragment_4 (College Of Winterhold - Quest Expansion.esp).

**Who and where**

- First objective: "Meet Tolfdir outside Saarthal". Source: Skyrim.esm:01F252 QOBJ 10. **files**
- Target alias MG02TolfdirStartMarker (forced): a marker (forced reference, placed in Saarthal). **files**
- Target alias MG02TolfdirAlias (unique): Tolfdir (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Saarthal: 1 door, 0 locked; Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: MGILItemStaffTurnUndead (levelled: Staff of Turn Lesser Undead or Staff of Turn Undead or Staff of Turn Greater Undead) (stage 200, QF_MG02_0001F252.fragment_16).

## 3. Hitting the Books (`MG03`, Skyrim.esm:01F253, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MG02 (Under Saarthal) at stage 200 calls SetStage 0. Source: QF_MG02_0001F252.fragment_16 on Skyrim.esm:01F252 (CollegeEntry.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MG08 (The Eye of Magnus) at stage 0 calls SetStage 200. Source: QF_MG08_0001F258.fragment_0 (College of Winterhold Quest Start Fixes.esp).
- MG07 (The Staff of Magnus) at stage 0 calls SetStage 200. Source: QF_MG07_0001F257.fragment_0 (College of Winterhold Quest Start Fixes.esp).
- mg06 (Revealing the Unseen) at stage 0 calls SetStage 200. Source: QF_MG06_0001F256.fragment_16 (Unofficial Skyrim Special Edition Patch.esp).
- MG04 (Good Intentions) at stage 0 calls SetStage 200. Source: QF_MG04_0001F254.fragment_0 (Unofficial Skyrim Special Edition Patch.esp).

**Who and where**

- First objective: "Speak with Mirabelle Ervine". Source: Skyrim.esm:01F253 QOBJ 10. **files**
- Target alias MG03MirabelleErvine (unique): Mirabelle Ervine (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Racial Phylogeny (stage 200, QF_MG03_0001F253.fragment_10); Daughter of the Niben (stage 200, QF_MG03_0001F253.fragment_10); 2920, Vol. 09: Hearth Fire (stage 200, QF_MG03_0001F253.fragment_10); Catalogue of Weapon Enchantments (stage 200, QF_MG03_0001F253.fragment_10); Response to Bero's Speech (stage 200, QF_MG03_0001F253.fragment_10); The Black Arts On Trial (stage 200, QF_MG03_0001F253.fragment_10).

## 4. Good Intentions (`MG04`, Skyrim.esm:01F254, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MG03 (Hitting the Books) at stage 200 calls Start. Source: QF_MG03_0001F253.fragment_10 on Skyrim.esm:01F253 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MG08 (The Eye of Magnus) at stage 0 calls SetStage 200. Source: QF_MG08_0001F258.fragment_0 (College of Winterhold Quest Start Fixes.esp).
- MG07 (The Staff of Magnus) at stage 0 calls SetStage 200. Source: QF_MG07_0001F257.fragment_0 (College of Winterhold Quest Start Fixes.esp).
- mg06 (Revealing the Unseen) at stage 0 calls SetStage 200. Source: QF_MG06_0001F256.fragment_16 (Unofficial Skyrim Special Edition Patch.esp).

**Who and where**

- First objective: "Speak with Tolfdir". Source: Skyrim.esm:01F254 QOBJ 10. **files**
- Target alias MG04TolfdirAlias (unique): Tolfdir (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: MG04RewardLVL (levelled: Mage's Circlet) (stage 200, QF_MG04_0001F254.fragment_14).

## 5. Containment (`MG05`, Skyrim.esm:01F255, College of Winterhold Quest Start Fixes.esp)

**Started by**

- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start. Sources: USKP_VersionTrackingScript.ProcessRetroScripts, USKP_VersionTrackingScript.OnInit, USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9. **script**
- USKPRetroactive202 (named "Retroactive fixes for 2.0.2" in its record), a helper quest calls Start; Start; Start; Start; Start; Start; Start; Start. Sources: USKPRetroactive202Script.Process on Unofficial Skyrim Special Edition Patch.esp:00E025. **script**
- USKPRetroactive203 (named "Retroactive fixes for 2.0.3" in its record), a helper quest calls Start; Start; Start; Start. Sources: uskpretroactive203script.Process on Unofficial Skyrim Special Edition Patch.esp:01068A. **script**
- USKPRetroactive204 (named "Retroactive fixes for 2.0.4" in its record), a helper quest with Gabriella, Erikur, Susanna calls Start; Start. Sources: USKPRetroactive204Script.Process on Unofficial Skyrim Special Edition Patch.esp:012C3A. **script**
- USKPRetroactive205 (named "Retroactive fixes for 2.0.5" in its record), a helper quest with Keerava calls Start. Source: USKPRetroactive205Script.Process on Unofficial Skyrim Special Edition Patch.esp:040578 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MG08 (The Eye of Magnus) at stage 0 calls SetStage 200. Source: QF_MG08_0001F258.fragment_0 (College of Winterhold Quest Start Fixes.esp).
- MG07 (The Staff of Magnus) at stage 0 calls SetStage 200. Source: QF_MG07_0001F257.fragment_0 (College of Winterhold Quest Start Fixes.esp).
- mg06 (Revealing the Unseen) at stage 200 calls Start. Source: QF_MG06_0001F256.fragment_14 (Unofficial Skyrim Special Edition Patch.esp).
- mg06 (Revealing the Unseen) at stage 200 calls SetStage 0. Source: QF_MG06_0001F256.fragment_14 (Unofficial Skyrim Special Edition Patch.esp).

**Who and where**

- First objective: "Assess the damage to the Great Hall". Source: Skyrim.esm:01F255 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: Torc of Labyrinthian (stage 200, QF_MG05_0001F255.fragment_11); Savos Aren's Amulet (stage 200, QF_MG05_0001F255.fragment_11).

## 6. Revealing the Unseen (`mg06`, Skyrim.esm:01F256, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MG04 (Good Intentions) at stage 200 calls Start. Source: QF_MG04_0001F254.fragment_14 on Skyrim.esm:01F254 (Unofficial Skyrim Special Edition Patch.esp). **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start. Sources: USKP_VersionTrackingScript.ProcessRetroScripts, USKP_VersionTrackingScript.OnInit, USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9. **script**
- USKPRetroactive206 (named "Retroactive fixes for 2.0.6" in its record), a helper quest with Vekel, Oengul calls Start; Start; Start; Start; Start; Start; Start; Start. Sources: USKPRetroactive206Script.Process on Unofficial Skyrim Special Edition Patch.esp:04C7DF. **script**
- USKPRetroactive207 (named "Retroactive fixes for 2.0.7" in its record), a helper quest calls Start; Start; Start; Start. Sources: USKPRetroactive207Script.Process on Unofficial Skyrim Special Edition Patch.esp:056430. **script**
- USKPRetroactive208 (named "Retroactive fixes for 2.0.8" in its record), a helper quest with Sinding calls Start; Start. Sources: USKPRetroactive208Script.Process on Unofficial Skyrim Special Edition Patch.esp:062C72. **script**
- USKPRetroactive209 (named "Retroactive fixes for 2.0.9" in its record), a helper quest with Sergius, Zaria calls Start. Source: USKPRetroactive209Script.Process on Unofficial Skyrim Special Edition Patch.esp:06D3A0 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MG08 (The Eye of Magnus) at stage 0 calls SetStage 200. Source: QF_MG08_0001F258.fragment_0 (College of Winterhold Quest Start Fixes.esp).
- MG07 (The Staff of Magnus) at stage 0 calls SetStage 200. Source: QF_MG07_0001F257.fragment_0 (College of Winterhold Quest Start Fixes.esp).

**Who and where**

- First objective: "Speak with Mirabelle Ervine". Source: Skyrim.esm:01F256 QOBJ 10. **files**
- Target alias MG06MirabelleAlias (unique): Mirabelle Ervine (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 7. The Staff of Magnus (`MG07`, Skyrim.esm:01F257, College of Winterhold Quest Start Fixes.esp)

**Started by**

- MG05 (Containment) at stage 200 calls Start. Source: QF_MG05_0001F255.fragment_11 on Skyrim.esm:01F255 (College of Winterhold Quest Start Fixes.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- MG08 (The Eye of Magnus) at stage 0 calls SetStage 200. Source: QF_MG08_0001F258.fragment_0 (College of Winterhold Quest Start Fixes.esp).

**Who and where**

- First objective: "Enter Labyrinthian". Source: Skyrim.esm:01F257 QOBJ 10. **files**
- Target alias MG07LabyrinthianExtDoorAlias (forced): Stone Door (forced reference, placed in Skyrim). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Skyrim: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 8. The Eye of Magnus (`MG08`, Skyrim.esm:01F258, College of Winterhold Quest Start Fixes.esp)

**Started by**

- MG07 (The Staff of Magnus) calls at stage 200 Start; at stage 200 SetStage 0. Sources: QF_MG07_0001F257.fragment_17 on Skyrim.esm:01F257. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Use the Staff of Magnus to enter the College of Winterhold". Source: Skyrim.esm:01F258 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 9. Shalidor's Insights (`MGR21`, Skyrim.esm:0E0E04, CollegeEntry.esp)

**Started by**

- MGR22 (named "Shalidor's Insights Rewards" in its record), a helper quest with Urag at stage 200 calls Start; MGR22 is started by MGR21 (Shalidor's Insights) at stage 200 (Start). Source: QF_MGR22_000E0E0C.fragment_0 on Skyrim.esm:0E0E0C (Requiem.esp). **script**
- MG01 (First Lessons) at stage 30 calls Start. Source: QF_MG01_0001F251.fragment_13 on Skyrim.esm:01F251 (LoreRim - Dialogue Patch.esp). **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start; Start. Sources: USKP_VersionTrackingScript.ProcessRetroScripts, USKP_VersionTrackingScript.OnInit, USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9. **script**
- USKPRetroactive131 (named "Retroactive fixes for 1.3.1" in its record), a helper quest with Varnius, Gloth calls Start; Start; Start; Start; Start; Start; Start; Start. Sources: USKPRetroactive131Script.Process on Unofficial Skyrim Special Edition Patch.esp:01906F. **script**
- USKPRetroactive132 (named "Retroactive fixes for 1.3.2" in its record), a helper quest with SindingGhost, SindingHuman calls Start; Start; Start; Start. Sources: USKPRetroactive132Script.Process on Unofficial Skyrim Special Edition Patch.esp:02C3E7. **script**
- USKPRetroactive133 (named "Retroactive fixes for 1.3.3" in its record), a helper quest with Nurelion, WoundedSoldier, Froki calls Start; Start. Sources: uskpretroactive133script.Process on Unofficial Skyrim Special Edition Patch.esp:03F7B8. **script**
- USKPRetroactive200 (named "Retroactive fixes for 2.0.0" in its record), a helper quest with Sanguine, Embry, Proventus calls Start. Source: USKPRetroactive200Script.Process on Unofficial Skyrim Special Edition Patch.esp:051CB5 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: Shalidor's Insights stage < 10; the speaker is the one in alias alias None). Source: TIF__000F6270.Fragment_0 on INFO Skyrim.esm:0F6270 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Find Shalidor's writings". Source: Skyrim.esm:0E0E04 QOBJ 10. **files**
- Target alias BookContainer (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: GetInFaction College of Winterhold == 1. **files**

**Gives**: nothing on its completing stages.

## 10. Aftershock (`MGR30`, Skyrim.esm:0C1E72, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- DialogueWinterholdCollege (named "Winterhold College Dialogue" in its record), a helper quest with Onmund, Jzargo, Tolfdir calls Start. Source: DialogueWinterholdCollegeQuestScript.OnUpdateGameTime on Skyrim.esm:03618F (Skyrim.esm). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None). Source: TIF__000C1E50.Fragment_0 on INFO Skyrim.esm:0C1E50 (Skyrim.esm). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None; fn136 == 1 or fn136 == 1 or fn136 == 1). Source: TIF__000C1E51.Fragment_0 on INFO Skyrim.esm:0C1E51 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None). Source: TIF__000C1E52.Fragment_0 on INFO Skyrim.esm:0C1E52 (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Close the Rupture". Source: Skyrim.esm:0C1E72 QOBJ 10. **files**
- Target alias Anomaly (created): Skyrim.esm:0DFB04 (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: LvlQuestReward03Large (levelled: gold) (stage 200, QF_MGR30_000C1E72.fragment_4).

## 11. Brelyna's Practice (`MGRAppBrelyna01`, Skyrim.esm:0C0416, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MG02 (Under Saarthal) at stage 200 calls Start. Source: QF_MG02_0001F252.fragment_16 on Skyrim.esm:01F252 (CollegeEntry.esp). **script**
- Dialogue with someone the line does not name: SetStage 20 (when: fn629 == 1; the speaker is the one in alias alias None; Brelyna's Practice stage == 10). Source: TIF__000C04F5.Fragment_0 on INFO Skyrim.esm:0C04F5 (Skyrim.esm). **script**
- Dialogue with someone the line does not name: SetStage 20 (when: fn629 == 1; the speaker is the one in alias alias None; Brelyna's Practice stage == 10). Source: TIF__000C04F7.Fragment_0 on INFO Skyrim.esm:0C04F7 (Skyrim.esm). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: fn46 == 0; the speaker is the one in alias alias None). Source: TIF__000C04FF.Fragment_0 on INFO Skyrim.esm:0C04FF (Skyrim.esm). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: fn46 == 0; the speaker is the one in alias alias None). Source: TIF__000C0500.Fragment_0 on INFO Skyrim.esm:0C0500 (Skyrim.esm). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None). Source: TIF__000C0501.Fragment_0 on INFO Skyrim.esm:0C0501 (Skyrim.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Wait for Brelyna's spell to wear off". Source: Skyrim.esm:0C0416 QOBJ 20. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: LItemEnchNecklaceResistMagic (levelled: an item) (stage 200, QF_MGRAppBrelyna01_000C0416.fragment_6).

## 12. J'zargo's Experiment (`MGRAppJzargo01`, Skyrim.esm:0958B3, Skyrim.esm)

**Started by**

- MG02 (Under Saarthal) at stage 200 calls Start. Source: QF_MG02_0001F252.fragment_16 on Skyrim.esm:01F252 (CollegeEntry.esp). **script**
- Dialogue with J'zargo, placed in Hall of Attainment, Dormitory: SetStage 20 (when: fn629 == 2; the speaker is J'zargo). Source: TIF__000967E2.Fragment_0 on INFO Skyrim.esm:0967E2 (Skyrim.esm). **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Test J'zargo's Flame Cloak spell on the undead (<Global=MGRJ1Test>/<Global=MGRJ1Total>)". Source: Skyrim.esm:0958B3 QOBJ 20. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 13. Onmund's Request (`MGRAppOnmund01`, Skyrim.esm:06BC33, Update.esm)

**Started by**

- MG02 (Under Saarthal) at stage 200 calls Start. Source: QF_MG02_0001F252.fragment_16 on Skyrim.esm:01F252 (CollegeEntry.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: fn249 == 1; Onmund's Request stage < 10; fn629 == 1; the speaker is the one in alias alias None). Source: TIF__000C084A.Fragment_0 on INFO Skyrim.esm:0C084A (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak with Enthir". Source: Skyrim.esm:06BC33 QOBJ 10. **files**
- Target alias Enthir (unique): Enthir (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 14. Arniel's Endeavor (`MGRArniel01`, Skyrim.esm:06A086, LoreRim - Economy Overhaul.esp)

**Started by**

- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None). Source: TIF__0006A04B.Fragment_0 on INFO Skyrim.esm:06A04B (Skyrim.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:06A086 DNAM (LoreRim - Economy Overhaul.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver ten cogs to Arniel Gane". Source: Skyrim.esm:06A086 QOBJ 10. **files**
- Target alias ArnielGane (forced): Arniel Gane (forced reference, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: FavorRewardGoldLarge (levelled: gold) (stage 200, QF_MGRArniel01_0006A086.fragment_0).

## 15. Arniel's Endeavor (`MGRArniel02`, Skyrim.esm:06A08D, Skyrim.esm)

**Started by**

- MGRArniel01 (Arniel's Endeavor) at stage 200 calls Start. Source: QF_MGRArniel01_0006A086.fragment_0 on Skyrim.esm:06A086 (LoreRim - Economy Overhaul.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None). Source: TIF__0006A03E.Fragment_0 on INFO Skyrim.esm:06A03E (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak to Enthir". Source: Skyrim.esm:06A08D QOBJ 10. **files**
- Target alias Enthir (unique): Enthir (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 16. Arniel's Endeavor (`MGRArniel03`, Skyrim.esm:06A097, College of Winterhold Quest Start Fixes.esp)

**Started by**

- MGRArniel02 (Arniel's Endeavor) at stage 200 calls Start. Source: QF_MGRArniel02_0006A08D.fragment_10 on Skyrim.esm:06A08D (Skyrim.esm). **script**
- MG08 (The Eye of Magnus) at stage 200 calls Start. Source: QF_MG08_0001F258.fragment_12 on Skyrim.esm:01F258 (College of Winterhold Quest Start Fixes.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: Arniel's Endeavor stage < 10; fn629 == 3; the speaker is the one in alias alias None). Source: TIF__0006A04E.Fragment_0 on INFO Skyrim.esm:06A04E (Unofficial Skyrim Special Edition Patch.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Place the warped soul gem into a Convector". Source: Skyrim.esm:06A097 QOBJ 10. **files**
- Target alias Convector2 (forced): Dwemer Convector (forced reference, placed in Skyrim). **files**
- Target alias Convector3 (forced): Dwemer Convector (forced reference, placed in Deep Folk Crossing). **files**
- Target alias Convector7 (forced): Dwemer Convector (forced reference, placed in Dwarven Storeroom, Mzulft). **files**
- Target alias Convector4 (forced): Dwemer Convector (forced reference, placed in Skyrim). **files**
- Target alias Convector6 (forced): Dwemer Convector (forced reference, placed in Mzulft). **files**
- Target alias Convector5 (forced): Dwemer Convector (forced reference, placed in Bthalft). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Dwarven Storeroom, Mzulft: 1 door, 0 locked; Mzulft: 2 doors, 0 locked; Bthalft: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 17. Arniel's Endeavor (`MGRArniel04`, Skyrim.esm:06A119, Skyrim.esm)

**Started by**

- MGRArniel03 (Arniel's Endeavor) at stage 255 calls Start. Source: QF_MGRArniel03_0006A097.fragment_10 on Skyrim.esm:06A097 (College of Winterhold Quest Start Fixes.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: Arniel's Endeavor stage < 10; the speaker is the one in alias alias None). Source: TIF__0006A046.Fragment_0 on INFO Skyrim.esm:06A046 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Talk to Enthir". Source: Skyrim.esm:06A119 QOBJ 10. **files**
- Target alias Enthir (unique): Enthir (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 18. Rejoining the College (`MGRejoinQuest`, Skyrim.esm:0C9A0E, Skyrim.esm)

**Started by**

- MGSuspensionQuest (named "College Suspension" in its record), a helper quest at stage 0 calls Start. Source: QF_MGSuspensionQuest_0005B5DC.fragment_0 on Skyrim.esm:05B5DC (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name: SetStage 5 (when: Rejoining the College stage < 5; the speaker isn't Tolfdir; the speaker isn't Savos Aren; GetInFaction College of Winterhold == 1). Source: TIF__0005CA16.Fragment_0 on INFO Skyrim.esm:05CA16 (Skyrim.esm). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Speak with Tolfdir". Source: Skyrim.esm:0C9A0E QOBJ 5. **files**
- Target alias MGRejoinTolfdir (unique): Tolfdir (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 19. Destruction Ritual Spell (`MGRitual01`, Skyrim.esm:0A4E82, Skyrim.esm)

**Started by**

- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None). Source: TIF__000A4E81.Fragment_0 on INFO Skyrim.esm:0A4E81 (Skyrim.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0A4E82 DNAM (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Complete the book Powers of the Elements". Source: Skyrim.esm:0A4E82 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Its own conditions: GetInFaction College of Winterhold == 1; GetActorValue >= 90. **files**

**Gives**: nothing on its completing stages.

## 20. Illusion Ritual Spell (`MGRitual02`, Skyrim.esm:0B3233, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None). Source: TIF__000B3227.Fragment_0 on INFO Skyrim.esm:0B3227 (Skyrim.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0B3233 DNAM (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring the four Master Illusion texts to Drevis Neloren". Source: Skyrim.esm:0B3233 QOBJ 10. **files**
- Target alias Drevis (unique): Drevis Neloren (unique actor, placed in Hall of Countenance, Dormitory). **files**

**Needs**

- Its own conditions: GetInFaction College of Winterhold == 1; GetActorValue >= 90. **files**
- Ways in: Hall of Countenance, Dormitory: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Spell Tome (Master): Hysteria (stage 200, QF_MGRitual02_000B3233.fragment_1).

## 21. Conjuration Ritual Spell (`MGRitual03`, Skyrim.esm:099F27, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None). Source: TIF__000DB36A.Fragment_0 on INFO Skyrim.esm:0DB36A (Unofficial Skyrim Special Edition Patch.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:099F27 DNAM (Unofficial Skyrim Special Edition Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Summon and subdue an Unbound Dremora". Source: Skyrim.esm:099F27 QOBJ 10. **files**
- Target alias SummonLocationMarker (forced): a marker (forced reference, placed in Winterhold College). **files**

**Needs**

- Its own conditions: GetInFaction College of Winterhold == 1; GetActorValue >= 90. **files**
- Ways in: Winterhold College: 7 doors, 2 locked. A door is a need only when every way in is locked. **files**

**Gives**: Spell Tome (Master): Conjure Flame Thrall (stage 200, QF_MGRitual03_00099F27.fragment_5); Sigil Stone (stage 200, QF_MGRitual03_00099F27.fragment_5).

## 22. Restoration Ritual Spell (`MGRitual04`, Skyrim.esm:0CD987, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MG04 (Good Intentions) at stage 200 calls Start. Source: QF_MG04_0001F254.fragment_14 on Skyrim.esm:01F254 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None). Source: TIF__000CD981.Fragment_0 on INFO Skyrim.esm:0CD981 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Gain the Augur's approval". Source: Skyrim.esm:0CD987 QOBJ 10. **files**
- Target alias Augur (forced): Augur of Dunlain (forced reference, placed in The Midden Dark, The Midden). **files**

**Needs**

- Its own conditions: GetInFaction College of Winterhold == 1; GetActorValue >= 90. **files**
- Ways in: The Midden Dark, The Midden: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 23. Alteration Ritual Spell (`MGRitual05`, Skyrim.esm:0D0755, DragonHunting.esp)

**Started by**

- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None). Source: TIF__000D2B44.Fragment_0 on INFO Skyrim.esm:0D2B44 (Skyrim.esm). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias None). Source: TIF__000D2B48.Fragment_0 on INFO Skyrim.esm:0D2B48 (Skyrim.esm). **script**
- Start-game flag: the quest runs from the start of the game. Source: Skyrim.esm:0D0755 DNAM (DragonHunting.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Use Kahvozein's Fang to collect Dragon Heartscales". Source: Skyrim.esm:0D0755 QOBJ 10. **files**
- Target alias Dagger (created): Kahvozein's Fang (created item). **files**

**Needs**

- Its own conditions: GetInFaction College of Winterhold == 1; GetActorValue >= 90. **files**

**Gives**: Spell Tome (Master): Dragonhide on Self (stage 200, QF_MGRitual05_000D0755.fragment_16).

## 24. Rogue Wizard (`MGRRogue`, Skyrim.esm:05A609, Skyrim.esm)

**Started by**

- Dialogue with Tolfdir, placed in Hall of Attainment, Dormitory: SetStage 10 (when: the speaker is Tolfdir). Source: TIF__0005CA18.Fragment_0 on INFO Skyrim.esm:05CA18 (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deal with the rogue wizard". Source: Skyrim.esm:05A609 QOBJ 10. **files**
- Target alias Target (created): Insane College Wizard (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 25. Rapture of the Deep (`Cow_Breathing`, College Of Winterhold - Quest Expansion.esp:000801, College Of Winterhold - Quest Expansion.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- COW_CentralQuest (College Curriculum) calls Start. Source: COW_PlayerKnowsSpell.Fragment_0 (College Of Winterhold - Quest Expansion.esp).
- COW_CentralQuest (College Curriculum) calls Start. Source: Cow_WaterLearned.Fragment_0 (College Of Winterhold - Quest Expansion.esp).

**Who and where**

- First objective: "Talk to Arniel Gane". Source: College Of Winterhold - Quest Expansion.esp:000801 QOBJ 1. **files**
- Target alias ArnielGane (unique): Arniel Gane (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 26. College Curriculum (`COW_CentralQuest`, College Of Winterhold - Quest Expansion.esp:00081D, College Of Winterhold - Quest Expansion.esp)

**Started by**

- MG01 (First Lessons) at stage 200 calls Start. Source: QF_MG01_0001F251.fragment_18 on Skyrim.esm:01F251 (LoreRim - Dialogue Patch.esp). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Talk to Tolfdir for more lessons". Source: College Of Winterhold - Quest Expansion.esp:00081D QOBJ 10. **files**
- Target alias Tolfdir (unique): Tolfdir (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 27. I Choose You, Familiar (`Cow_Conjuration`, College Of Winterhold - Quest Expansion.esp:00086F, College Of Winterhold - Quest Expansion.esp)

**Started by**

- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 10). Source: Cow_ConjuBook.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0009B1 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: SetStage 5 (when: the speaker is the one in alias alias 10). Source: Cow_ConjuBook.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0009B1 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 10; fn264 == 1). Source: Cow_CentralConjuFollow.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0009B3 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 10). Source: Cow_ConjurationSkip.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0009B5 (College Of Winterhold - Quest Expansion.esp). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Learn Conjure Familiar and Talk to Phinis". Source: College Of Winterhold - Quest Expansion.esp:00086F QOBJ 5. **files**
- Target alias Phinis (unique): Phinis Gestor (unique actor, placed in Hall of Countenance, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Countenance, Dormitory: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 28. A Test of Ice and Fire (`Cow_Destruction`, College Of Winterhold - Quest Expansion.esp:000873, College Of Winterhold - Quest Expansion.esp)

**Started by**

- Dialogue with someone the line does not name: Start (when: fn264 == 0; the speaker is the one in alias alias 7). Source: Cow_Destruction_SpellBook.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:000897 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: SetStage 5 (when: fn264 == 0; the speaker is the one in alias alias 7). Source: Cow_Destruction_SpellBook.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:000897 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: fn264 == 1; the speaker is the one in alias alias 7). Source: Destruction_SkipBook.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:000899 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 7). Source: Cow_Faralda_refuse.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0009EC (College Of Winterhold - Quest Expansion.esp). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Learn the spell and talk to Faralda". Source: College Of Winterhold - Quest Expansion.esp:000873 QOBJ 5. **files**
- Target alias Faralda (unique): Faralda (unique actor, placed in Hall of Countenance, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Countenance, Dormitory: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 29. Enchanted To Meet You (`Cow_enchantment`, College Of Winterhold - Quest Expansion.esp:000871, College Of Winterhold - Quest Expansion.esp)

**Started by**

- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 11). Source: Cow_StartEnchantment.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:000903 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 11). Source: Cow_Sergius_refuse.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:000905 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias 11; fn493 == 0). Source: Cow_enchantment_nodagger.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:00090C (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: fn493 == 1; the speaker is the one in alias alias 11). Source: Cow_enchantment_NoDagger2.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:000913 (College Of Winterhold - Quest Expansion.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Find an Arcane Enchanter". Source: College Of Winterhold - Quest Expansion.esp:000871 QOBJ 10. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 30. Back-Stabbing Rodents (`Cow_illusion`, College Of Winterhold - Quest Expansion.esp:000872, College Of Winterhold - Quest Expansion.esp)

**Started by**

- Dialogue with someone the line does not name: Start (when: fn264 == 0; the speaker is the one in alias alias 9). Source: Cow_IllusionTome.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0008E7 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: fn264 == 0; the speaker is the one in alias alias 9). Source: Cow_IllusionTome.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0008E7 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: fn264 == 1; the speaker is the one in alias alias 9). Source: Cow_Skeevers.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0008E9 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 9). Source: Cow_Drevis_refuse.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0009EE (College Of Winterhold - Quest Expansion.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Learn the spell and talk to Drevis". Source: College Of Winterhold - Quest Expansion.esp:000872 QOBJ 10. **files**
- Target alias Drevis (unique): Drevis Neloren (unique actor, placed in Hall of Countenance, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Countenance, Dormitory: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 31. Reading Comprehension 101 (`Cow_Reading`, College Of Winterhold - Quest Expansion.esp:000870, College Of Winterhold - Quest Expansion.esp)

**Started by**

- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 8). Source: Cow_UragGivesBook.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0008B2 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: SetStage 10 (when: the speaker is the one in alias alias 8). Source: Cow_UragGivesBook.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0008B2 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 8). Source: Cow_Urag_RefuseBook.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0008D2 (College Of Winterhold - Quest Expansion.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Read Olaf and the Dragon and talk to Urag gro-Shub". Source: College Of Winterhold - Quest Expansion.esp:000870 QOBJ 10. **files**
- Target alias Urag (unique): Urag gro-Shub (unique actor, placed in The Arcanaeum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Arcanaeum: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 32. None Escape The Light (`Cow_restoration`, College Of Winterhold - Quest Expansion.esp:00086E, College Of Winterhold - Quest Expansion.esp)

**Started by**

- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 6; fn264 == 0; fn264 == 0; fn264 == 0; fn264 == 0). Source: Cow_RestoGiveSpell.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:000882 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: SetStage 5 (when: the speaker is the one in alias alias 6; fn264 == 0; fn264 == 0; fn264 == 0; fn264 == 0). Source: Cow_RestoGiveSpell.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:000882 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 6; fn264 == 1 or fn264 == 1 or fn264 == 1 or fn264 == 1). Source: Cow_Resto_NoBook2.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:00087F (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 6; fn264 == 0; fn264 == 0; fn264 == 0; fn264 == 0). Source: Restoration_LearnSpell1.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:000880 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: SetStage 5 (when: the speaker is the one in alias alias 6; fn264 == 0; fn264 == 0; fn264 == 0; fn264 == 0). Source: Restoration_LearnSpell1.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:000880 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 6; fn264 == 1 or fn264 == 1 or fn264 == 1 or fn264 == 1). Source: Cow_Resto_NoBook1.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:000881 (College Of Winterhold - Quest Expansion.esp). **script**
- Dialogue with someone the line does not name: Start (when: the speaker is the one in alias alias 6). Source: Cow_RestorationRefuse.Fragment_0 on INFO College Of Winterhold - Quest Expansion.esp:0009EA (College Of Winterhold - Quest Expansion.esp). **script**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Learn the spell and talk to Colette". Source: College Of Winterhold - Quest Expansion.esp:00086E QOBJ 5. **files**
- Target alias Colette (unique): Colette Marence (unique actor, placed in Hall of Countenance, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Countenance, Dormitory: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 33. College Objective Quest (`MG01Pointer`, Skyrim.esm:054D0A, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- MG01 (First Lessons) calls Start. Source: MG01QuestScript.StartPointer on Skyrim.esm:01F251 (LoreRim - Dialogue Patch.esp). **script**
- Dialogue with Faida, placed in Four Shields Tavern: Start (when: the speaker is Faida). Source: TIF__0008EC35.Fragment_0 on INFO Skyrim.esm:08EC35 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Ambarys Rendar, placed in New Gnisis Cornerclub: Start (when: the speaker is Ambarys Rendar). Source: TIF__0008EC36.Fragment_0 on INFO Skyrim.esm:08EC36 (Skyrim.esm). **script**
- Dialogue with Elda Early-Dawn, placed in Candlehearth Hall: Start (when: the speaker is Elda Early-Dawn). Source: TIF__0008EC37.Fragment_0 on INFO Skyrim.esm:08EC37 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Hulda, placed in The Bannered Mare: Start (when: the speaker is Hulda; fn130 == 0; fn130 == 0; fn130 == 0; fn130 == 0; fn130 == 0; fn130 == 0). Source: TIF__0008EC38.Fragment_0 on INFO Skyrim.esm:08EC38 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Hulda, placed in The Bannered Mare: Start (when: the speaker is Hulda; fn130 == 1 or fn130 == 1 or fn130 == 1 or fn130 == 1 or fn130 == 1 or fn130 == 1). Source: TIF__0008EC39.Fragment_0 on INFO Skyrim.esm:08EC39 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Haelga, placed in Haelga's Bunkhouse: Start (when: the speaker is Haelga). Source: TIF__0008EC3A.Fragment_0 on INFO Skyrim.esm:08EC3A (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with Skuli, placed in Old Hroldan Inn: Start (when: fn73 < 0; the speaker is Skuli). Source: TIF__0008EC3B.Fragment_0 on INFO Skyrim.esm:08EC3B (Unofficial Skyrim Special Edition Patch.esp). **script**
- and 20 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Visit the College of Winterhold". Source: Skyrim.esm:054D0A QOBJ 10. **files**
- Target alias Nirya (unique): Faralda (unique actor, placed in Hall of Countenance, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Countenance, Dormitory: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 34. Tolfdir the Absent-Minded (`MGR01`, Skyrim.esm:0266F1, LoreRim - Economy Overhaul.esp)

**Started by**

- Dialogue with Tolfdir's Alembic, placed in Wisp Light Crevasse: SetStage 10 (when: the speaker is Tolfdir's Alembic; the speaker is Tolfdir). Source: TIF__000266EE.Fragment_0 on INFO Skyrim.esm:0266EE (Skyrim.esm). **script**
- Dialogue with Shalidor's Insights: SetStage 10 (when: the speaker is Shalidor's Insights; the speaker is Tolfdir). Source: TIF__00026C30.Fragment_0 on INFO Skyrim.esm:026C30 (Skyrim.esm). **script**
- Story manager node MGRTolfdirNode1, event: script event; conditions up its parents: fn576 == 1. Source: MGRTolfdirNode1 Skyrim.esm:028A4D (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Find Tolfdir's missing Alembic". Source: Skyrim.esm:0266F1 QOBJ 10. **files**
- Target alias MGR01Item (created): Tolfdir's Alembic (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: 30 gold (stage 200, QF_MGR01_000266F1.fragment_7); LItemSoulGemFullTown (levelled: Skyrim.esm:02E4E3 or Skyrim.esm:02E4E5 or Skyrim.esm:02E4F3) (stage 200, QF_MGR01_000266F1.fragment_7).

## 35. Out of Balance (`MGR02`, Skyrim.esm:0266F2, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- Dialogue with Drevis Neloren, placed in Hall of Countenance, Dormitory: SetStage 10 (when: Out of Balance stage < 10; the speaker is Drevis Neloren). Source: TIF__00026C2A.Fragment_0 on INFO Skyrim.esm:026C2A (Skyrim.esm). **script**
- Story manager node MGRDrevisNode, event: script event; conditions up its parents: fn576 == 1. Source: MGRDrevisNode Skyrim.esm:028A4E (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Cleanse the focal points for magical energies around the College". Source: Skyrim.esm:0266F2 QOBJ 10. **files**
- Target alias FocusPoint1 (forced): Mystic Focal Point (forced reference, placed in Winterhold College). **files**
- Target alias FocusPoint3 (forced): Mystic Focal Point (forced reference, placed in Hall of Attainment, Dormitory). **files**
- Target alias FocusPoint2 (forced): Mystic Focal Point (forced reference, placed in Hall of Countenance, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Winterhold College: 7 doors, 2 locked; Hall of Attainment, Dormitory: 2 doors, 0 locked; Hall of Countenance, Dormitory: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 36. Enchanting Pick-Up (`MGR10`, Skyrim.esm:028A13, Skyrim.esm)

**Started by**

- Dialogue with Sergius Turrianus, placed in Hall of Countenance, Dormitory: SetStage 10 (when: Enchanting Pick-Up stage < 10; the speaker is Sergius Turrianus). Source: TIF__00028A12.Fragment_0 on INFO Skyrim.esm:028A12 (Skyrim.esm). **script**
- Story manager node MGRSergiusNode, event: script event; conditions up its parents: fn576 == 1. Source: MGRSergiusNode Skyrim.esm:028A4F (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Go to <Alias.ShortName=Client> in <Alias=ClientLocation> and pick up the item". Source: Skyrim.esm:028A13 QOBJ 10. **files**
- Target alias Client (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: LvlQuestReward01Small (levelled: gold) (stage 200, QF_MGR10_00028A13.fragment_0).

## 37. Restocking Soul Gems (`MGR11`, Skyrim.esm:028A19, Skyrim.esm)

**Started by**

- Dialogue with Sergius Turrianus, placed in Hall of Countenance, Dormitory: SetStage 10 (when: Restocking Soul Gems stage <= 10; the speaker is Sergius Turrianus; global MGR11Amount == 0 (now ?) or global MGR11Amount == 3 (now ?)). Source: TIF__00028A05.Fragment_0 on INFO Skyrim.esm:028A05 (Skyrim.esm). **script**
- Dialogue with Sergius Turrianus, placed in Hall of Countenance, Dormitory: SetStage 10 (when: Restocking Soul Gems stage <= 10; the speaker is Sergius Turrianus; global MGR11Amount == 0 (now ?) or global MGR11Amount == 5 (now ?)). Source: TIF__0001FE8C.Fragment_0 on INFO Skyrim.esm:01FE8C (Skyrim.esm). **script**
- Dialogue with Sergius Turrianus, placed in Hall of Countenance, Dormitory: SetStage 10 (when: Restocking Soul Gems stage <= 10; the speaker is Sergius Turrianus; global MGR11Amount == 0 (now ?) or global MGR11Amount == 7 (now ?)). Source: TIF__0001FE8D.Fragment_0 on INFO Skyrim.esm:01FE8D (Skyrim.esm). **script**
- Dialogue with Sergius Turrianus, placed in Hall of Countenance, Dormitory: SetStage 10 (when: Restocking Soul Gems stage <= 10; the speaker is Sergius Turrianus; global MGR11Amount == 0 (now ?) or global MGR11Amount == 10 (now ?)). Source: TIF__0001FE8E.Fragment_0 on INFO Skyrim.esm:01FE8E (Skyrim.esm). **script**
- Story manager node MGRSergiusNode, event: script event; conditions up its parents: fn576 == 1. Source: MGRSergiusNode Skyrim.esm:028A4F (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 38. Filling Soul Gems (`MGR12`, Skyrim.esm:028A1E, Skyrim.esm)

**Started by**

- Dialogue with Sergius Turrianus, placed in Hall of Countenance, Dormitory: SetStage 10 (when: the speaker is Sergius Turrianus). Source: TIF__00028A0E.Fragment_0 on INFO Skyrim.esm:028A0E (Skyrim.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring a Filled Grand Soul Gem to Sergius Turrianus". Source: Skyrim.esm:028A1E QOBJ 10. **files**
- Target alias Questgiver (unique): Sergius Turrianus (unique actor, placed in Hall of Countenance, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Countenance, Dormitory: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 39. Fetch me that Book! (`MGR20`, Skyrim.esm:028A24, Update.esm)

**Started by**

- Dialogue with Urag gro-Shub, placed in The Arcanaeum: SetStage 10 (when: Fetch me that Book! stage < 10; the speaker is Urag gro-Shub). Source: TIF__00028A06.Fragment_0 on INFO Skyrim.esm:028A06 (Skyrim.esm). **script**
- Story manager node MGRUragNode, event: script event; conditions up its parents: fn576 == 1. Source: MGRUragNode Skyrim.esm:028A50 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Find the copy of <Alias=Book>". Source: Skyrim.esm:028A24 QOBJ 10. **files**
- Target alias BookContainer (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: gold (an amount the script works out) (stage 200, QF_MGR20_00028A24.fragment_4).

## 40. Fetch me that Book! (`MGR20B`, Skyrim.esm:0BC096, LoreRim - Economy Overhaul.esp)

**Started by**

- Dialogue with Urag gro-Shub, placed in The Arcanaeum: SetStage 10 (when: Fetch me that Book! stage < 10; the speaker is Urag gro-Shub). Source: TIF__000BC092.Fragment_0 on INFO Skyrim.esm:0BC092 (Skyrim.esm). **script**
- Story manager node MGRUragNode, event: script event; conditions up its parents: fn576 == 1. Source: MGRUragNode Skyrim.esm:028A50 (Skyrim.esm). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Find the copy of <Alias=Book>". Source: Skyrim.esm:0BC096 QOBJ 10. **files**
- Target alias BookContainer (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: gold (an amount the script works out) (stage 200, QF_MGR20B_000BC096.fragment_4).

## 41. Research Thief (`FreeformWinterholdCollegeA`, Skyrim.esm:05D2E9, FDE Faralda.esp)

**Started by**

- Dialogue with Nirya, placed in Hall of Attainment, Dormitory: SetStage 10 (when: the speaker is Nirya). Source: TIF__0005D2E7.Fragment_0 on INFO Skyrim.esm:05D2E7 (Skyrim.esm). **script**
- Dialogue with Nirya, placed in Hall of Attainment, Dormitory: SetStage 10 (when: the speaker is Nirya). Source: TIF__0005D2E5.Fragment_0 on INFO Skyrim.esm:05D2E5 (Skyrim.esm). **script**
- Dialogue with someone the line does not name: SetStage 1. Source: aaFa_TIF__0503333D.Fragment_0 on INFO FDE Faralda.esp:000860 (FDE Faralda.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Talk to Nirya to see what she's plotting". Source: Skyrim.esm:05D2E9 QOBJ 10. **files**
- Target alias Nirya (unique): Nirya (unique actor, placed in Hall of Attainment, Dormitory). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of Attainment, Dormitory: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

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

### dialogue INFO Skyrim.esm:0DF034

- Speaker: Nirya (Altmer), placed in Hall of Attainment, Dormitory. Named by: alias MG01NiryaAlias of MG01 (First Lessons) (unique).
- The player's prompt: "What are you doing out here?".
- The reply: "I'm here to assist anyone interested in joining the College. Also, my presence tends to frighten the locals and keep them away.".
- When it's offered: First Lessons stage < 30; the speaker is the one in alias MG01NiryaAlias.
- What it does: SetStage 10 on MG01 (First Lessons). Source: TIF__000DF034.Fragment_0 on INFO Skyrim.esm:0DF034 (Skyrim.esm); topic MG01NiryaWhyAtGateBranchTopic. **script**
- In one sentence: Talk to Nirya (Altmer) in Hall of Attainment, Dormitory and choose "What are you doing out here?", when First Lessons stage < 30; the speaker is the one in alias MG01NiryaAlias: SetStage 10 on MG01 (First Lessons).

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
