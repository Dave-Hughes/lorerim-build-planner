# Needs Bob (WO-132)

Quests the loop can't settle from the records and UESP, each with both readings and its record ids. They stay "not yet checked"; nothing here was guessed or picked to keep the loop going. Written from each batch by the PC; grouped by reason.

21 quests: what is left of the loop's batch 4, after WO-136's rerun. These are every quest still not checked; the 120 from batches 1 to 3 that the board reader and Bob's rulings settled are off the list.

**WO-138 Part 1 (PC, 23 Oct):** 19 of the 40 are settled by a hand trace of the records that agrees with UESP, each now a key row (`source: uesp`, the trace in its notes): the seven fishing jobs (Viriya's bounty letter starts a quest taken from ccBGSSSE001_MiscQuests' `miscquests` array), the four Dragonborn Black Books (the book's script holds the quest and stage 10; DLC2BookDungeonController's ReadBook sets it), the Thieves Guild's four city jobs (Delvin's lines set TGRShell 162/172/182/192, whose fragments set each job's stage 10) and Under New Management (TGRShellScript.TGLeaderCheck sets 197), and from the wiki as the order says, Purity of Revenge, Glory of the Dead and March of the Dead (only ruled-out helpers in the records). The 21 below stay, each with both readings: no UESP page, or a mod with no second source, or records that don't hold the starter UESP describes (In the Shadows: its first objective shows at stage 0 and nothing in the records starts it).

## The records hold no starter (18)

- **Durnehviir Misc Objective Handler** (`DLC1VQDragonMisc`, Dawnguard.esm:01119F; line `dawnguard`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias DLC1VQDragonMiscAlias (from alias): nothing the records name.
  - Objectives in the records: 'Speak to Durnehviir at his lair in the Soul Cairn' (QOBJ 10, shown at stage 10).
  - UESP (https://en.uesp.net/wiki/Skyrim:Durnehviir_(quest)): UESP gives no start for this handler itself; it is a stage table inside the Durnehviir quest page (DLC1VQDragon), which begins after you defeat Durnehviir in the Boneyard. Givers: Durnehviir. First objective: 'Speak to Durnehviir at his lair in the Soul Cairn'. Note: Listed as 'Durnehviir Misc Objective Handler (DLC1VQDragonMisc)'.
- **Animal Pelt Collection** (`CR03`, Skyrim.esm:025230; winning record: Companions Radiant Expansion.esp; line `companions`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - Its own conditions: Take Up Arms stage 100 done; The Silver Hand not completed or Blood's Honor completed or Animal Pelt Collection stage > 1.
  - Objectives in the records: 'Collect <Alias=SamplePelt>s (<Global=CR03PeltsGotten>/<Global=CR03TotalPeltsNeeded>)' (QOBJ 10, shown at stage 10); 'Return to <Alias.ShortName=Questgiver>' (QOBJ 20, shown at stage 20).
  - UESP: no page found: no UESP page found under the name or editor ID.
- **Campaign for the campaign hold** (`CWCampaignObj`, Skyrim.esm:026F45; winning record: LoreRim - Dialogue Patch.esp; line `civil-war`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias FieldCO (run time): nothing the records name.
  - Objectives in the records: 'Report to <Alias=FieldCO>.' (QOBJ 10, shown at stage 10); 'Help conquer <Alias=CampaignHold>.' (QOBJ 15, shown at stage 15).
  - UESP: no page found: UESP doesn't document this editor ID on any page reached.
- **Battle of the city** (`CWSiegeAttackObj`, Skyrim.esm:04E857; winning record: LoreRim - Dialogue Patch.esp; line `civil-war`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias General (run time): nothing the records name.
  - Objectives in the records: 'Meet with the <Alias=General>' (QOBJ 0); 'Break through the enemy Barricade' (QOBJ 5).
  - UESP: no page found: UESP doesn't document this editor ID on any page reached.
- **Defense of the city** (`CWSiegeDefendObj`, Skyrim.esm:02FF95; winning record: LoreRim - Dialogue Patch.esp; line `civil-war`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias General (run time): nothing the records name.
  - Objectives in the records: 'Meet with the <Alias=General> on the Front Line.' (QOBJ 0); 'Join the General on the Front Line.' (QOBJ 10).
  - UESP: no page found: UESP doesn't document this editor ID on any page reached.
- **The Lost Verse** (`dunBardsLeapSummitQST`, Skyrim.esm:0AE014; winning record: dvEdda.esp; line `bards-college`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias Giraud (forced): Giraud Gemane, placed in Bards College, The Bards College.
  - Objectives in the records: 'Show the ancient Edda fragment to someone' (QOBJ 200, shown at stage 200).
  - UESP: no page found: no quest page; the Bard's Leap Summit location page mentions no quest.
- **Boethiah's Bidding** (`DA02KillObj`, Skyrim.esm:052795; line `boethiahs-calling`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias Elisif (unique): Elisif the Fair, placed in Blue Palace, The Blue Palace.
  - Objectives in the records: 'Assassinate the Jarl of Solitude' (QOBJ 50, shown at stage 50).
  - UESP (https://en.uesp.net/wiki/Skyrim:Unfinished_Quests): Begins right after Boethiah's Calling ends, once you kill her previous champion and equip the Ebony Mail. Givers: Boethiah. First objective: 'Assassinate the Jarl of Solitude'. Note: Only on the Unfinished Quests page: never fully implemented.
- **A Grand Venture** (`DefunctQuest01`, Journey to Baan Malur.esp:2B52A7; line `baan-malur`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - Objectives in the records: none.
  - A mod's quest: the records are the only source, and they hold no way in.
- **Black Book: The Font of Memory** (`HYORBlackBook08Quest`, Siege at Icemoth.esp:59F97E; line `siege-at-icemoth`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias BookTarget (forced): Black Book: The Font of Memory, placed in Apocrypha.
  - Objectives in the records: "Learn the Black Book's hidden knowledge" (QOBJ 10, shown at stage 10).
  - A mod's quest: the records are the only source, and they hold no way in.
- **Bury Valen Dreth** (`manny_GF_BuryValenDreth`, Gray Fox Cowl.esm:01E072; line `gray-cowl`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias myDestination (forced): a marker, placed in Falkreath.
  - Objectives in the records: 'Bury the rests of Valen Dreth at Falkreath' (QOBJ 10, shown at stage 10).
  - A mod's quest: the records are the only source, and they hold no way in.
- **Black Book: Whispers of the Veil** (`NecroBlackBookQuest01`, Undeath.esp:125089; line `undeath`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias BookTarget (forced): Black Book: Whispers of the Veil, placed in Apocrypha.
  - Objectives in the records: "Learn the Black Book's hidden knowledge" (QOBJ 10, shown at stage 10).
  - A mod's quest: the records are the only source, and they hold no way in.
- **Grace of Kynareth** (`0WREnableSapling`, SurWR.esp:0C8496; line `capital-whiterun`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - Objectives in the records: none.
  - A mod's quest: the records are the only source, and they hold no way in.
- **Farmland Saga** (`0WRFarmlandQuest`, SurWR.esp:37116B; line `capital-whiterun`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - Objectives in the records: none.
  - A mod's quest: the records are the only source, and they hold no way in.
- **On Hogithum** (`REQ_HOGITHUM`, Requiem.esp:AD383D; line `on-hogithum`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - Objectives in the records: 'Find more information about the missing fragment' (QOBJ 10, shown at stage 10); 'Find all six missing fragments' (QOBJ 50, shown at stage 50).
  - A mod's quest: the records are the only source, and they hold no way in.
- **In the Shadows** (`ccBGSSSE038_Quest`, ccbgssse038-bowofshadows.esl:00080E; winning record: Bow of Shadows - Reduced Cut.esp; line `in-the-shadows`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias Proventus (run time): nothing the records name.
  - First objective's target in the records: alias Brill (run time): nothing the records name.
  - Objectives in the records: "Speak to the Jarl's Steward" (QOBJ 10, shown at stage 0); "Read the Steward's Note" (QOBJ 20, shown at stage 10).
  - UESP (https://en.uesp.net/wiki/Skyrim:In_the_Shadows): Talk to Whiterun's steward (Proventus Avenicci or Brill) and ask about work; he hands you a note about a possible assassination plot. Givers: Proventus Avenicci, Brill. First objective: "Speak to the Jarl's Steward".
- **Fear and Loathing** (`HD1GoreFearAndLoathing`, GORE.esp:AFF592; line `gore`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - Its own conditions: global HD1PermanentDismiss != 1 (now 0); the speaker is Gore.
  - Objectives in the records: 'Investigate the house with Gore' (QOBJ 0, shown at stage 0); 'Speak with Gore outside' (QOBJ 5).
  - A mod's quest: the records are the only source, and they hold no way in.
- **With Love, Eilonwy, Part 2** (`aaFaraldaQ2`, FDE Faralda.esp:000A40; line `faralda`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias Faralda (unique): Faralda, placed in Hall of Countenance, Dormitory.
  - Objectives in the records: 'Talk to Faralda' (QOBJ 1, shown at stage 1); "Meet Faralda's aunt at Lost Prospect Mine" (QOBJ 10, shown at stage 10).
  - A mod's quest: the records are the only source, and they hold no way in.
- **First Catch** (`ccBGSSSE001_Start_MQ1`, ccBGSSSE001-Fish.esm:0009D3; winning record: Synthesis - Gameplay Overwrite.esp; line `fishing`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias CampMarker (forced): a marker, placed in Skyrim.
  - Objectives in the records: 'Visit the fishing camp south of Riverwood' (QOBJ 0, shown at stage 10); 'Equip a fishing rod' (QOBJ 5, shown at stage 15).
  - UESP: no page found: no UESP page for First Catch or this editor ID; Angler Acquaintances is ccBGSSSE001_Start_MQ2, a different quest.



## Only a quest the line puts after it sets its stage (the line's order, or a real catch-up?) (3)

- **Stendarr Guide** (`zzzBMGuide`, Vigilant.esm:43B81F; line `vigilants`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias GuideThingol (forced): a marker, placed in Asylum.
  - Objectives in the records: 'Trace the blood' (QOBJ 0, shown at stage 0); 'Trace the elder blood' (QOBJ 10, shown at stage 10).
  - WO-136 ruling 1 considered and not applied: none of these calls comes from a stage that ends its quest and sets the stage where the first objective shows, or earlier, so the records name no single way in.
  - Set by a quest the line puts after it (the check counts these as catch-ups, not starts): zzzBMMq03 (The Blood Matron) at stage 20 calls SetStage 20 (QF_zzzBMMq03_01038526.fragment_2 (Vigilant.esm)); zzzBMMq02 (Remnants) at stage 80 calls SetStage 10 (QF_zzzBMMq02_01038525.fragment_16 (Vigilant.esm)).
  - A mod's quest, records only: the readings above are all the records hold. Bob to rule whether any of them is the way in.
- **Memory Guide** (`zzzCHMemoryGuide`, Vigilant.esm:42E0B1; line `vigilants`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias DreamPelinal (forced): a marker, placed in Barrier Tower of Agea.
  - Objectives in the records: 'Like when the dream no longer needs its dreamer' (QOBJ 100, shown at stage 0); 'Against the dying of the light' (QOBJ 110, shown at stage 0).
  - WO-136 ruling 1 considered and not applied: none of these calls comes from a stage that ends its quest and sets the stage where the first objective shows, or earlier, so the records name no single way in.
  - Set by a quest the line puts after it (the check counts these as catch-ups, not starts): zzzCHMemoryQuest08 (The Nameless Bard) at stage 999 calls SetStage 80 (QF_zzzCHMemoryQuest08_02080E91.fragment_46 (Vigilant.esm)); zzzCHMemoryQuest09 (Beyond the Shores of Madness) at stage 999 calls SetStage 90 (QF_zzzCHMemoryQuest09_022CAE30.fragment_29 (Vigilant.esm)); zzzCHMemoryQuest04 (Johan the Fool) at stage 999 calls SetStage 40 (QF_zzzCHMemoryQuest04_02140225.fragment_25 (Vigilant.esm)); zzzCHMemoryQuest05 (Adabal) at stage 999 calls SetStage 50 (QF_zzzCHMemoryQuest05_0205AE03.fragment_25 (Vigilant.esm)); zzzCHMemoryQuest06 (Remains of the Miracle) at stage 999 calls SetStage 60 (QF_zzzCHMemoryQuest06_0206A23B.fragment_8 (Vigilant.esm)); zzzCHMemoryQuest02 (The Mad King) at stage 999 calls SetStage 20 (QF_zzzCHMemoryQuest02_0213712B.fragment_21 (Vigilant.esm)); zzzCHMemoryQuest07 (Temptation of Marukh) at stage 999 calls SetStage 70 (QF_zzzCHMemoryQuest07_0206F53C.fragment_22 (Vigilant.esm)); zzzCHMemoryQuest01 (The Grand Inquisitor) at stage 999 calls SetStage 10 (QF_zzzCHMemoryQuest01_0212C4F4.fragment_9 (Vigilant.esm)); zzzCHMemoryQuest03 (Knight of Hounds) at stage 999 calls SetStage 30 (QF_zzzCHMemoryQuest03_0213965A.fragment_24 (Vigilant.esm)).
  - A mod's quest, records only: the readings above are all the records hold. Bob to rule whether any of them is the way in.
- **Stendarr Guide** (`zzzCOGuide`, Vigilant.esm:43CBAE; line `vigilants`, batch 4)
  - Records, how it starts: no starter in its records or scripts.
  - First objective's target in the records: alias GuideCurse01 (forced): a marker, placed in Blood Curse of Shivers.
  - Objectives in the records: 'Break the Blood Curse of Shivers' (QOBJ 10, shown at stage 10); 'Break the Blood Curse of Corruption' (QOBJ 20, shown at stage 20).
  - WO-136 ruling 1 considered and not applied: none of these calls comes from a stage that ends its quest and sets the stage where the first objective shows, or earlier, so the records name no single way in.
  - Set by a quest the line puts after it (the check counts these as catch-ups, not starts): zzzCOMq01 (Child of Oblivion) at stage 60 calls SetStage 70 (QF_zzzCOMq01_01065932.fragment_13 (Vigilant.esm)).
  - A mod's quest, records only: the readings above are all the records hold. Bob to rule whether any of them is the way in.
