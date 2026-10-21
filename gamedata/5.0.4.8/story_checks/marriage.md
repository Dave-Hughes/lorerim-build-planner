# Start check: The Bonds of Matrimony (`marriage`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. The Bonds of Matrimony (`RelationshipMarriage`, Skyrim.esm:074793, Unofficial Skyrim Special Edition Patch.esp)

**Started by**

- RelationshipMarriageFIN, a helper quest with Player at stage 200 calls SetStage 10; RelationshipMarriageFIN is started by dialogue with someone (SetStage 5); story manager node MarriageNode (event: script event; no conditions). Source: QF_RelationshipMarriageFIN_00021382.fragment_2 on Skyrim.esm:021382 (AI Overhaul.esp). **script**
- RelationshipMarriageBreakUp (named "Player Has Broken Up with the Love Interest" in its record), a helper quest at stage 100 calls SetStage 20; RelationshipMarriageBreakUp is started by story manager node RelationshipMarriageNode (event: relationship change; GetInFaction MarriageCourtingFaction == 1 or GetInFaction MarriageCourtingFaction == 1). Source: QF_RelationshipMarriageBreakU_0007431B.fragment_1 on Skyrim.esm:07431B (Skyrim.esm). **script**
- USKPVersionTracking (named "Version tracking for USKP retroactive fixes" in its record), a helper quest with Player calls SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; USKPVersionTracking is started by the start-game flag. Sources: USKP_VersionTrackingScript.ProcessRetroScripts, USKP_VersionTrackingScript.OnInit, USKP_VersionTrackingPlayerAliasScript.OnPlayerLoadGame on Unofficial Skyrim Special Edition Patch.esp:00D8B9. **script**
- USKPRetroactive202 (named "Retroactive fixes for 2.0.2" in its record), a helper quest calls SetStage 10; SetStage 10; SetStage 10; SetStage 10; USKPRetroactive202 is started by the start-game flag. Sources: USKPRetroactive202Script.Process on Unofficial Skyrim Special Edition Patch.esp:00E025. **script**
- USKPRetroactive203 (named "Retroactive fixes for 2.0.3" in its record), a helper quest calls SetStage 10; SetStage 10; USKPRetroactive203 is started by the start-game flag. Sources: uskpretroactive203script.Process on Unofficial Skyrim Special Edition Patch.esp:01068A. **script**
- USKPRetroactive204 (named "Retroactive fixes for 2.0.4" in its record), a helper quest with Gabriella, Erikur, Susanna calls SetStage 10; USKPRetroactive204 is started by the start-game flag. Source: USKPRetroactive204Script.Process on Unofficial Skyrim Special Edition Patch.esp:012C3A (Unofficial Skyrim Special Edition Patch.esp). **script**
- USKPRetroactive201 (named "Retroactive fixes for 2.0.1" in its record), a helper quest calls SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; SetStage 10; USKPRetroactive201 is started by the start-game flag. Sources: USKPRetroactive201Script.Process on Unofficial Skyrim Special Edition Patch.esp:0946CF. **script**
- Dialogue with Maramal, placed in Temple of Mara, "I'll buy an amulet of Mara. (200 gold)": SetStage 15 (when: GetItemCount Amulet of Mara == 0; the player has at least 200 gold; The Bonds of Matrimony stage 15 not done; The Bonds of Matrimony stage 10 done; the speaker is Maramal). Source: TIF__00026B5C.Fragment_1 on INFO Skyrim.esm:026B5C (Skyrim.esm). **script**
- and 14 more in the JSON
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Attend your wedding ceremony", shown at stage 30. Source: Skyrim.esm:074793 QOBJ 20. **files**
- Dialogue with Maramal, placed in Temple of Mara, "I'd like to have a wedding at the temple.": SetStage 30 (when: fn403 > 0; fn726 == 0; GetDead == 0; The Bonds of Matrimony stage 30 not done; The Bonds of Matrimony stage 20 done; the speaker is Maramal). Reply: "You wish to be married? It's good to see love blossoming, even during these difficult times." Source: TIF__00026BAA.Fragment_0 on INFO Skyrim.esm:026BAA (NPCs_Wear_Amulets_Of_Mara.esp). **script**
- Dialogue with Maramal (named by alias TemplePriest of RelationshipMarriage (The Bonds of Matrimony) (unique)), placed in Temple of Mara, "I made a mistake. I want to go ahead with the ceremony.": SetStage 30 (when: fn403 >= 1; Wedding Ceremony Scene stage 200 done; fn629 == 1; the speaker is the one in alias TemplePriest). Reply: ""Forgiveness is the heart of Mara's blessings." Very well. We shall re-arrange your wedding." Source: TIF__00075CAF.Fragment_0 on INFO Skyrim.esm:075CAF (Skyrim.esm). **script**

**Who and where**

- First objective: "Speak to Maramal about arranging your wedding". Source: Skyrim.esm:074793 QOBJ 10. **files**
- Target alias TemplePriest (unique): Maramal (unique actor, placed in Temple of Mara). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Mara: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

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

### RelationshipMarriageFIN

- What it does: stage 200: SetStage 10. Source: QF_RelationshipMarriageFIN_00021382 on Skyrim.esm:021382 (AI Overhaul.esp). **script**
- Started by: TIF__0533565E.Fragment_0 on INFO HLIORemi.esp:33565E (HLIORemi.esp); story manager node MarriageNode (script event; no conditions; MarriageNode Skyrim.esm:047A26 (Skyrim.esm)).
- In one sentence: RelationshipMarriageFIN stage 200: SetStage 10 on RelationshipMarriage (The Bonds of Matrimony); it is started by TIF__0533565E.Fragment_0 on INFO HLIORemi.esp:33565E (HLIORemi.esp); story manager node MarriageNode (script event; no conditions; MarriageNode Skyrim.esm:047A26 (Skyrim.esm)).

### RelationshipMarriageBreakUp (Player Has Broken Up with the Love Interest)

- What it does: stage 100: SetStage 20. Source: QF_RelationshipMarriageBreakU_0007431B on Skyrim.esm:07431B (Skyrim.esm). **script**
- Started by: story manager node RelationshipMarriageNode (relationship change; GetInFaction MarriageCourtingFaction == 1 or GetInFaction MarriageCourtingFaction == 1; RelationshipMarriageNode Skyrim.esm:07431C (Skyrim.esm)).
- In one sentence: RelationshipMarriageBreakUp (Player Has Broken Up with the Love Interest) stage 100: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony); it is started by story manager node RelationshipMarriageNode (relationship change; GetInFaction MarriageCourtingFaction == 1 or GetInFaction MarriageCourtingFaction == 1; RelationshipMarriageNode Skyrim.esm:07431C (Skyrim.esm)).

### USKPRetroactive204 (Retroactive fixes for 2.0.4), its script's process

- What it does: SetStage dunYngvildQST 100; SetStage RelationshipMarriage (The Bonds of Matrimony) 10; SetStage dunMidden01QST (Forgotten Names) 100; Enable alias Erikur (Erikur); SetStage FreeformStonehillsA (Payment Delivery) 25; SetStage FreeformStonehillsA (Payment Delivery) 30; Enable Skyrim.esm:0D883D; Disable Skyrim.esm:095777; Disable Skyrim.esm:01B754; Enable Skyrim.esm:01B753; SetStage FreeformMorthalA (Falion's Secret) 200; Start FreeformMorthalA (Falion's Secret); ForceRefTo DialogueWindhelm; SetValue something the reader can't resolve. Source: process on Unofficial Skyrim Special Edition Patch.esp:012C3A (Unofficial Skyrim Special Edition Patch.esp). **script**
- Called from: USKPVersionTracking (Version tracking for USKP retroactive fixes); USKPRetroactive202 (Retroactive fixes for 2.0.2); USKPRetroactive203 (Retroactive fixes for 2.0.3); USKPRetroactive201 (Retroactive fixes for 2.0.1).
- In one sentence: USKPRetroactive204 (Retroactive fixes for 2.0.4)'s process does SetStage dunYngvildQST 100; SetStage RelationshipMarriage (The Bonds of Matrimony) 10; SetStage dunMidden01QST (Forgotten Names) 100; Enable alias Erikur (Erikur); SetStage FreeformStonehillsA (Payment Delivery) 25; SetStage FreeformStonehillsA (Payment Delivery) 30; Enable Skyrim.esm:0D883D; Disable Skyrim.esm:095777; Disable Skyrim.esm:01B754; Enable Skyrim.esm:01B753; SetStage FreeformMorthalA (Falion's Secret) 200; Start FreeformMorthalA (Falion's Secret); ForceRefTo DialogueWindhelm; SetValue something the reader can't resolve; it is called from USKPVersionTracking (Version tracking for USKP retroactive fixes); USKPRetroactive202 (Retroactive fixes for 2.0.2); USKPRetroactive203 (Retroactive fixes for 2.0.3); USKPRetroactive201 (Retroactive fixes for 2.0.1).

### dialogue INFO Skyrim.esm:026B5C

- Speaker: Maramal (Redguard), placed in Temple of Mara. Named by: GetIsID.
- The player's prompt: "I'll buy an amulet of Mara. (200 gold)".
- The reply: "Here you are. Now remember, people in Skyrim respond to deeds. You will find more people interested in your love if you help them." / "Good luck. Mara bless you.".
- When it's offered: GetItemCount Amulet of Mara == 0; the player has at least 200 gold; The Bonds of Matrimony stage 15 not done; The Bonds of Matrimony stage 10 done; the speaker is Maramal.
- What it does: SetStage 15 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__00026B5C.Fragment_1 on INFO Skyrim.esm:026B5C (Skyrim.esm); topic RelationshipMarriageIntroSymbolofMaraTopic. **script**
- In one sentence: Talk to Maramal (Redguard) in Temple of Mara and choose "I'll buy an amulet of Mara. (200 gold)", when GetItemCount Amulet of Mara == 0; the player has at least 200 gold; The Bonds of Matrimony stage 15 not done; The Bonds of Matrimony stage 10 done; the speaker is Maramal: SetStage 15 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO Skyrim.esm:074DE3

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "Yes. Yes I am.".
- The reply: "It's settled then. Brief as life can be in Skyrim, at least we'll have each other.".
- When it's offered: the speaker has the voice Skyrim.esm:0CCD78; GetInFaction PotentialMarriageFaction == 1.
- What it does: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__00074DE3.Fragment_1 on INFO Skyrim.esm:074DE3 (Skyrim.esm); topic RelationshipMarriageIntroDialogueCourtshipYES. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "Yes. Yes I am.", when the speaker has the voice Skyrim.esm:0CCD78; GetInFaction PotentialMarriageFaction == 1: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO Skyrim.esm:0CDA0A

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "I will. Together, then.".
- The reply: "Together.".
- When it's offered: the speaker has the voice Skyrim.esm:0CCE4E; GetInFaction PotentialMarriageFaction == 1.
- What it does: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__000CDA0A.Fragment_1 on INFO Skyrim.esm:0CDA0A (Skyrim.esm); topic RelationshipMarriageIntroDialogueCourtshipYES. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "I will. Together, then.", when the speaker has the voice Skyrim.esm:0CCE4E; GetInFaction PotentialMarriageFaction == 1: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO Skyrim.esm:0CDA0B

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "I do. My hand is yours.".
- The reply: "And mine is yours.".
- When it's offered: the speaker has the voice Skyrim.esm:0CCE4F; GetInFaction PotentialMarriageFaction == 1.
- What it does: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__000CDA0B.Fragment_1 on INFO Skyrim.esm:0CDA0B (Skyrim.esm); topic RelationshipMarriageIntroDialogueCourtshipYES. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "I do. My hand is yours.", when the speaker has the voice Skyrim.esm:0CCE4F; GetInFaction PotentialMarriageFaction == 1: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO Skyrim.esm:0CDA0C

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "Together until the end, then.".
- The reply: "As short as life can be in this land, we will have each other.".
- When it's offered: the speaker has the voice Skyrim.esm:0CCE50; GetInFaction PotentialMarriageFaction == 1.
- What it does: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__000CDA0C.Fragment_1 on INFO Skyrim.esm:0CDA0C (Skyrim.esm); topic RelationshipMarriageIntroDialogueCourtshipYES. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "Together until the end, then.", when the speaker has the voice Skyrim.esm:0CCE50; GetInFaction PotentialMarriageFaction == 1: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO Skyrim.esm:0CDA0D

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "I'm game.".
- The reply: "Well, look at us, getting married. Life in Skyrim ain't all bad, huh?".
- When it's offered: the speaker has the voice MaleDrunk; GetInFaction PotentialMarriageFaction == 1.
- What it does: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__000CDA0D.Fragment_1 on INFO Skyrim.esm:0CDA0D (Skyrim.esm); topic RelationshipMarriageIntroDialogueCourtshipYES. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "I'm game.", when the speaker has the voice MaleDrunk; GetInFaction PotentialMarriageFaction == 1: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO Skyrim.esm:0CDA0E

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "I'd be more than interested.".
- The reply: "Good. The two of us then. All of Skyrim should get ready to stand aside.".
- When it's offered: the speaker has the voice Skyrim.esm:0CCE3F; GetInFaction PotentialMarriageFaction == 1.
- What it does: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__000CDA0E.Fragment_1 on INFO Skyrim.esm:0CDA0E (Skyrim.esm); topic RelationshipMarriageIntroDialogueCourtshipYES. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "I'd be more than interested.", when the speaker has the voice Skyrim.esm:0CCE3F; GetInFaction PotentialMarriageFaction == 1: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO Skyrim.esm:0CDA0F

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "I won't lie. I am.".
- The reply: "Then it's settled. You and me.".
- When it's offered: the speaker has the voice Skyrim.esm:0CCE4D; GetInFaction PotentialMarriageFaction == 1.
- What it does: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__000CDA0F.Fragment_1 on INFO Skyrim.esm:0CDA0F (Skyrim.esm); topic RelationshipMarriageIntroDialogueCourtshipYES. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "I won't lie. I am.", when the speaker has the voice Skyrim.esm:0CCE4D; GetInFaction PotentialMarriageFaction == 1: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO Skyrim.esm:074DE5

- Speaker: Maramal (Redguard), placed in Temple of Mara. Named by: alias TemplePriest of RelationshipMarriage (The Bonds of Matrimony) (unique).
- The player's prompt: "I might. Why don't you remind me?".
- The reply: "Typically, love in Skyrim is as earnest as the people who live here. Life is hard and short, so there is little room for long courtship." / "A person who is looking for a spouse simply wears an Amulet of Mara about the neck, showing they are available." / "When another person shows interest, and the two agree to be together, one of them comes to the Temple and we arrange a ceremony.".
- When it's offered: the speaker is the one in alias TemplePriest.
- What it does: SetStage 10 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__00074DE5.Fragment_0 on INFO Skyrim.esm:074DE5 (Skyrim.esm); topic RelationshipMarriageIntroDialogueCourtingMaybe. **script**
- In one sentence: Talk to Maramal (Redguard) in Temple of Mara and choose "I might. Why don't you remind me?", when the speaker is the one in alias TemplePriest: SetStage 10 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO Skyrim.esm:074DE4

- Speaker: Maramal (Redguard), placed in Temple of Mara. Named by: alias TemplePriest of RelationshipMarriage (The Bonds of Matrimony) (unique).
- The player's prompt: "No, not really.".
- The reply: "Typically, love in Skyrim is as earnest as the people who live here. Life is hard and short, so there is little room for long courtship." / "A person who is looking for a spouse simply wears an Amulet of Mara about the neck, showing they are available." / "When another person shows interest, and the two agree to be together, one of them comes to the Temple and we arrange a ceremony.".
- When it's offered: the speaker is the one in alias TemplePriest.
- What it does: SetStage 10 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__00074DE4.Fragment_0 on INFO Skyrim.esm:074DE4 (Skyrim.esm); topic RelationshipMarriageIntroDialogueCourtingNO. **script**
- In one sentence: Talk to Maramal (Redguard) in Temple of Mara and choose "No, not really.", when the speaker is the one in alias TemplePriest: SetStage 10 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO Skyrim.esm:074DE2

- Speaker: Maramal (Redguard), placed in Temple of Mara. Named by: alias TemplePriest of RelationshipMarriage (The Bonds of Matrimony) (unique).
- The player's prompt: "I wanted to know more about the Temple of Mara.".
- The reply: "Wonderful. Where to begin?" / "Mara is the Goddess of Love. The temple spreads her gifts by tending to the sick, the poor, and the lost." / "We also perform wedding ceremonies for all the loving couples in Skyrim.".
- When it's offered: fn726 == 1; the speaker is the one in alias TemplePriest.
- What it does: SetStage 5 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__00074DE2.Fragment_0 on INFO Skyrim.esm:074DE2 (NPCs_Wear_Amulets_Of_Mara.esp); topic RelationshipMarriageIntroDialogueMaramalTopic. **script**
- In one sentence: Talk to Maramal (Redguard) in Temple of Mara and choose "I wanted to know more about the Temple of Mara.", when fn726 == 1; the speaker is the one in alias TemplePriest: SetStage 5 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO TT_FastredsAwakening.esp:00005B

- Speaker: Fastred (Nord), placed in Fellstar Farm. Named by: GetIsID.
- The player's prompt: "We can go to the Temple of Mara whenever you're ready.".
- The reply: "I'm ready now. I've been ready since the day I left Ivarstead with you.".
- When it's offered: the speaker is Fastred.
- What it does: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__0200005B.Fragment_0 on INFO TT_FastredsAwakening.esp:00005B (TT_FastredsAwakening.esp); topic TTFA_MainControllerMarriage03. **script**
- In one sentence: Talk to Fastred (Nord) in Fellstar Farm and choose "We can go to the Temple of Mara whenever you're ready.", when the speaker is Fastred: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO NPCs_Wear_Amulets_Of_Mara.esp:00080D

- Speaker: Maramal (Redguard), placed in Temple of Mara. Named by: GetIsID.
- The player's prompt: "I need to cancel the wedding. My betrothed died.".
- The reply: "Oh no! I... I'm sorry. Take care, friend.".
- When it's offered: the speaker is Maramal; The Bonds of Matrimony stage == 250.
- What it does: Start on RelationshipMarriage (The Bonds of Matrimony). Source: GirlfriendDied.Fragment_0 on INFO NPCs_Wear_Amulets_Of_Mara.esp:00080D (NPCs_Wear_Amulets_Of_Mara.esp); topic RelationshipMarriageTempleArrangementTopic. **script**
- In one sentence: Talk to Maramal (Redguard) in Temple of Mara and choose "I need to cancel the wedding. My betrothed died.", when the speaker is Maramal; The Bonds of Matrimony stage == 250: Start on RelationshipMarriage (The Bonds of Matrimony).

### dialogue INFO HLIORemi.esp:3211EF

- Speaker: not named by an NPC. Named by: GetIsID.
- The player's prompt: "Yes, I'll let him know.".
- The reply: "I'm so excited!".
- When it's offered: no conditions.
- What it does: SetStage 20 on RelationshipMarriage (The Bonds of Matrimony). Source: TIF__053211EF.Fragment_0 on INFO HLIORemi.esp:3211EF (HLIORemi.esp); topic HLIORemiMarriageCourtinga6. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: GetIsID.
- In one sentence: Talk to the speaker the line's conditions name and choose "Yes, I'll let him know.": SetStage 20 on RelationshipMarriage (The Bonds of Matrimony).

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
