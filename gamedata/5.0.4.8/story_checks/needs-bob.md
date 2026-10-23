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

## WO-138 Part 2, batch 1: the page and UESP differ (12 of 40)

### A different first step (3)

- **Diplomatic Immunity** (`MQ201`, Skyrim.esm:035D5F; winning record: Skyrim.esm; line `main-quest`, WO-138 batch 1)
  - The planner: giver Delphine; first step 'Meet Delphine in Riverwood or storm the Thalmor Embassy'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Diplomatic_Immunity): giver Delphine; objectives 1: 'Recover your equipment'; 5: 'Meet Delphine in Riverwood'; 10: 'Meet Malborn in Solitude'.
- **A Cornered Rat** (`MQ202`, Skyrim.esm:036191; winning record: Skyrim.esm; line `main-quest`, WO-138 batch 1)
  - The planner: giver Delphine; first step 'Ask in Riften about Esbern'.
  - UESP (https://en.uesp.net/wiki/Skyrim:A_Cornered_Rat): giver Delphine; objectives 10: 'Talk to Brynjolf'; 20: "Search the Ratway for Esbern's hideout"; 30: 'Find Esbern in the Ratway Warrens'.
- **Paarthurnax** (`MQPaarthurnax`, Skyrim.esm:03FA16; winning record: Skyrim.esm; line `main-quest`, WO-138 batch 1)
  - The planner: giver Esbern; first step "Decide Paarthurnax's Fate".
  - UESP (https://en.uesp.net/wiki/Skyrim:Paarthurnax_(quest)): giver Esbern or Delphine; objectives 10: 'Kill Paarthurnax'; 20: 'Talk to Delphine'.

### A different giver (3)

- **Dragon Rising** (`MQ104`, Skyrim.esm:02610C; winning record: Skyrim.esm; line `main-quest`, WO-138 batch 1)
  - The planner: giver Balgruuf the Greater; first step 'Talk to Jarl Balgruuf'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Dragon_Rising): giver Farengar Secret-Fire; objectives 5: 'Talk to Jarl Balgruuf'; 15: 'Meet Irileth near the Western Watchtower'; 20: 'Kill the dragon'.
- **The Way of the Voice** (`MQ105`, Skyrim.esm:0242BA; winning record: Skyrim.esm; line `main-quest`, WO-138 batch 1)
  - The planner: giver Arngeir; first step 'Speak to the Greybeards'.
  - UESP (https://en.uesp.net/wiki/Skyrim:The_Way_of_the_Voice): giver Jarl Balgruuf the Greater; objectives 10: 'Speak to the Greybeards'; 10: 'Speak to the Greybeards'; 20: 'Demonstrate your "Unrelenting Force" Shout'.
- **Season Unending** (`MQ302`, Skyrim.esm:045923; winning record: Skyrim.esm; line `main-quest`, WO-138 batch 1)
  - The planner: giver Arngeir; first step 'Talk to Arngeir'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Season_Unending): giver Jarl Balgruuf the Greater or Vignar Gray-Mane; objectives 10: 'Talk to Arngeir'; 20: 'Talk to General Tullius'; 30: 'Talk to Ulfric Stormcloak'.

### No UESP page lists it (1)

- **Dragon Research** (`FreeformSkyHavenTempleD`, Skyrim.esm:0E6DF1; winning record: Skyrim.esm; line `main-quest`, WO-138 batch 1)
  - The planner: giver Esbern; first step 'Bring 3 Dragon Blood, 3 Dragon Bile and 3 Dragon Rheum to Esbern'.
  - UESP: no page lists FreeformSkyHavenTempleD (tried Skyrim:Dragon_Research, Skyrim:Dragon_Research_(quest)).

### No giver on UESP, the page names one (1)

- **The Fallen** (`MQ301`, Skyrim.esm:044C56; winning record: Skyrim.esm; line `main-quest`, WO-138 batch 1)
  - The planner: giver Paarthurnax; first step 'Talk to Paarthurnax'.
  - UESP (https://en.uesp.net/wiki/Skyrim:The_Fallen): giver Alduin; objectives 10: 'Talk to Paarthurnax'; 11: 'Talk to Arngeir'; 12: 'Talk to Esbern'.

### The page names no giver, UESP does (3)

- **Before the Storm** (`MQ102`, Skyrim.esm:04E50D; winning record: Skyrim.esm; line `main-quest`, WO-138 batch 1)
  - The planner: giver none; first step 'Talk to the riverwood friend in Riverwood'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Before_the_Storm): giver Hadvar or Ralof; objectives 10: 'Talk to <alias> in Riverwood'; 10: 'Talk to <alias> in Riverwood'; 30: 'Talk to the Jarl of Whiterun'.
- **The Horn of Jurgen Windcaller** (`MQ105Ustengrav`, Skyrim.esm:0713DC; winning record: Skyrim.esm; line `main-quest`, WO-138 batch 1)
  - The planner: giver none; first step 'Retrieve the Horn of Jurgen Windcaller'.
  - UESP (https://en.uesp.net/wiki/Skyrim:The_Horn_of_Jurgen_Windcaller): giver Arngeir; objectives 10: 'Retrieve the Horn of Jurgen Windcaller'; 15: 'Read the note'; 20: 'Meet with whoever took the horn'.
- **Dragonslayer** (`MQ305`, Skyrim.esm:046EF2; winning record: Skyrim.esm; line `main-quest`, WO-138 batch 1)
  - The planner: giver none; first step "Help the heroes of Sovngarde dispel Alduin's mist".
  - UESP (https://en.uesp.net/wiki/Skyrim:Dragonslayer): giver Hakon, Gormlaith, and Felldir; objectives 10: "Help the heroes of Sovngarde dispel Alduin's mist"; 10: "Help the heroes of Sovngarde dispel Alduin's mist"; 20: 'Defeat Alduin'.

### The page names no giver, UESP does; the page's first step is a later UESP objective (1)

- **A New Order** (`DLC1HunterBaseIntro`, Dawnguard.esm:004E24; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 1)
  - The planner: giver none; first step 'Speak with Isran'.
  - UESP (https://en.uesp.net/wiki/Skyrim:A_New_Order): giver Isran; objectives 10: "Meet Tolan at Stendarr's Beacon"; 20: 'Speak with Isran'; 30: 'Recruit Sorine Jurard'.

## WO-138 Part 2, batch 2: the page and UESP differ (30 of 40)

### A different first step (1)

- **Forgotten Vale Books Quest** (`DLC1VQFVBooks`, Dawnguard.esm:01A3E4; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver Urag gro-Shub; first step 'Bring Ancient Falmer Tome to Urag gro-Shub'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Forgotten_Vale_Books_Quest): giver Urag gro-Shub; objectives 10: 'Bring Ancient Falmer Tome to'.

### A different giver (8)

- **Awakening** (`DLC1VQ01`, Dawnguard.esm:00352A; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver Vigilant Tolan; first step 'Find out what the vampires are seeking'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Awakening): giver Isran; objectives 30: 'Find out what the vampires are seeking'; 40: 'Speak to the mysterious woman'.
- **Chasing Echoes** (`DLC1VQ04`, Dawnguard.esm:00284F; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver Lord Harkon; first step 'Speak to Serana'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Chasing_Echoes): giver Dexion Evicus; objectives 10: 'Speak to Serana'; 20: "Explore Castle Volkihar's Courtyard"; 20: "Explore Castle Volkihar's Courtyard".
- **Touching the Sky** (`DLC1VQ07`, Dawnguard.esm:002853; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver Knight-Paladin Gelebor; first step "Locate Auriel's Bow".
  - UESP (https://en.uesp.net/wiki/Skyrim:Touching_the_Sky): giver Serana; objectives 20: "Locate Auriel's Bow"; 20: "Locate Auriel's Bow"; 30: 'Speak to Gelebor'.
- **Seeking Disclosure** (`DLC1VQElder`, Dawnguard.esm:005DA9; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver Lord Harkon; first step 'Find The Elder Scroll (Dragon)'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Seeking_Disclosure): giver Dexion Evicus; objectives 10: 'Find The Elder Scroll (Dragon)'; 20: 'Find The Elder Scroll (Blood)'; 30: 'Bring both Elder Scrolls to Dexion'.
- **The Path of Knowledge** (`DLC2MQ04`, Dragonborn.esm:016E1F; winning record: Dragonborn.esm; line `dragonborn`, WO-138 batch 2)
  - The planner: giver Frea; first step 'Talk to Neloth'.
  - UESP (https://en.uesp.net/wiki/Skyrim:The_Path_of_Knowledge): giver Storn Crag-Strider; objectives 10: 'Talk to Neloth'; 20: 'Travel to Nchardak with Neloth'; 40: 'Restore the steam supply to the Dwemer reading room'.
- **Proving Honor** (`C01`, Skyrim.esm:06E803; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver Farkas; first step 'Speak to Skjor'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Proving_Honor): giver Skjor; objectives 10: 'Speak to Skjor'; 20: 'Speak to Farkas'; 30: 'Retrieve the fragment'.
- **The Silver Hand** (`C03`, Skyrim.esm:01CEF4; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver Aela the Huntress; first step 'Talk to Skjor'.
  - UESP (https://en.uesp.net/wiki/Skyrim:The_Silver_Hand): giver Skjor; objectives 5: 'Talk to Skjor'; 10: 'Meet with Skjor at night'; 15: 'Enter the Underforge'.
- **Blood's Honor** (`C04`, Skyrim.esm:01CEF5; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver Aela the Huntress; first step 'Speak to Kodlak Whitemane'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Blood's_Honor): giver Kodlak Whitemane; objectives 10: 'Speak to Kodlak Whitemane'; 20: "Collect a Glenmoril Witch's head"; 25: '(Optional) Wipe out the Glenmoril Witches'.

### No UESP page lists it (7)

- **Prophet** (`DLC1VQ03Hunter`, Dawnguard.esm:0098CB; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver Isran; first step 'Follow Isran'.
  - UESP: no page lists DLC1VQ03Hunter (tried Skyrim:Prophet, Skyrim:Prophet_(quest)).
- **Prophet** (`DLC1VQ03Vampire`, Dawnguard.esm:004C3D; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver Lord Harkon; first step 'Speak to Harkon'.
  - UESP: no page lists DLC1VQ03Vampire (tried Skyrim:Prophet, Skyrim:Prophet_(quest)).
- **"Parent" quest for Radiant Content** (`DLC1Radiant`, Dawnguard.esm:004C1C; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver none; first step 'Speak with the current giver for an assignment'.
  - UESP: no page lists DLC1Radiant (tried Skyrim:"Parent"_quest_for_Radiant_Content, Skyrim:"Parent"_quest_for_Radiant_Content_(quest)).
- **Beyond Death Soul Gem Handler** (`DLC1VQ05SoulGemHandler`, Dawnguard.esm:00EA41; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver Valerica; first step 'Retrieve the Soul Essence Gem'.
  - UESP: no page lists DLC1VQ05SoulGemHandler (tried Skyrim:Beyond_Death_Soul_Gem_Handler, Skyrim:Beyond_Death_Soul_Gem_Handler_(quest)).
- **Power of the Blood** (`DLC1VampireTutorial`, Dawnguard.esm:01909F; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver none; first step 'Tranform into the Vampire Lord'.
  - UESP: no page lists DLC1VampireTutorial (tried Skyrim:Power_of_the_Blood, Skyrim:Power_of_the_Blood_(quest)).
- **Animal Extermination** (`CR01`, Skyrim.esm:01CEEE; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver none; first step 'Kill the beast'.
  - UESP: no page lists CR01 (tried Skyrim:Animal_Extermination, Skyrim:Animal_Extermination_(quest)).
- **Animal Extermination** (`CR02`, Skyrim.esm:025185; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver none; first step 'Clear out the animal den'.
  - UESP: no page lists CR02 (tried Skyrim:Animal_Extermination, Skyrim:Animal_Extermination_(quest)).

### No giver on UESP, the page names one (3)

- **Beyond Death** (`DLC1VQ05`, Dawnguard.esm:002850; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver Valerica; first step 'Locate Valerica'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Beyond_Death): giver Automatic upon entering the Soul Cairn during Chasing Echoes; objectives 10: 'Locate Valerica'; 10: 'Retrieve the Soul Essence Gem'; 20: 'Speak to Valerica'.
- **Impatience of a Saint** (`DLC1VQSaint`, Dawnguard.esm:01400B; winning record: Dawnguard.esm; line `dawnguard`, WO-138 batch 2)
  - The planner: giver Jiub; first step "Find pages from Saint Jiub's Opus (0/10)".
  - UESP (https://en.uesp.net/wiki/Skyrim:Impatience_of_a_Saint): giver Soul of Jiub; objectives 10: "Find pages from Saint Jiub's Opus (/10)"; 20: 'Return to Jiub'.
- **The Temple of Miraak** (`DLC2MQ02`, Dragonborn.esm:017F8F; winning record: Dragonborn.esm; line `dragonborn`, WO-138 batch 2)
  - The planner: giver Frea; first step 'Find Frea'.
  - UESP (https://en.uesp.net/wiki/Skyrim:The_Temple_of_Miraak): giver Automatic after completing Dragonborn; objectives 5: 'Find Frea'; 10: 'Talk to Frea'; 20: 'Defeat Miraak'.

### The page names no giver, UESP does (9)

- **At the Summit of Apocrypha** (`DLC2MQ06`, Dragonborn.esm:0179D7; winning record: Dragonborn.esm; line `dragonborn`, WO-138 batch 2)
  - The planner: giver none; first step 'Unlock your "Bend Will" Shout'.
  - UESP (https://en.uesp.net/wiki/Skyrim:At_the_Summit_of_Apocrypha): giver Frea; objectives 10: 'Unlock your "Bend Will" Shout'; 20: 'Read "Waking Dreams"'; 25: "Reach Miraak's Temple".
- **Hired Muscle** (`CR04`, Skyrim.esm:025231; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver none; first step 'Intimidate the brute in the brute town'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Hired_Muscle): giver Farkas; objectives 10: 'Intimidate <alias> in <alias>'; 20: 'Return to Farkas'; 20: 'Return to Farkas'.
- **Trouble in Skyrim** (`CR05`, Skyrim.esm:02522F; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver none; first step 'Kill the leader of the location'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Trouble_in_Skyrim): giver Farkas; objectives 10: 'Kill the leader of <alias>'; 10: 'Kill the leader of <alias>'; 10: 'Kill the leader of <alias>'.
- **Family Heirloom** (`CR06`, Skyrim.esm:0C18E1; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver none; first step 'Retrieve the gewgaw from the location'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Family_Heirloom): giver Skjor or Vilkas; objectives 10: 'Retrieve the <alias> from <alias>'; 20: 'Return to <alias>'.
- **Escaped Criminal** (`CR07`, Skyrim.esm:025250; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver none; first step 'Kill the escaped criminal'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Escaped_Criminal): giver Skjor or Vilkas; objectives 10: 'Kill the escaped criminal'; 20: 'Speak to <alias>'.
- **Rescue Mission** (`CR08`, Skyrim.esm:025251; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver none; first step 'Rescue the victim from the lair'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Rescue_Mission): giver Skjor or Vilkas; objectives 10: 'Rescue <alias> from <alias>'; 20: 'Talk to <alias>'; 21: 'Escort <alias> back to <alias>'.
- **Striking the Heart** (`CR09`, Skyrim.esm:025252; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver none; first step 'Assassinate the Silver Hand leader'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Striking_the_Heart): giver Aela; objectives 10: 'Assassinate the Silver Hand leader'; 20: 'Return to Aela'.
- **Stealing Plans** (`CR10`, Skyrim.esm:09D6FC; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver none; first step 'Steal the plans from the camp'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Stealing_Plans): giver Aela in Whiterun (Jorrvaskr); objectives 10: 'Steal the plans from <alias>'; 20: 'Return to Aela'.
- **Retrieval** (`CR11`, Skyrim.esm:09D700; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver none; first step 'Retrieve the fragment of Wuuthrad'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Retrieval): giver Aela the Huntress; objectives 10: 'Retrieve the fragment of Wuuthrad'; 20: 'Return to Aela'.

### The page names no giver, UESP does; a different first step (1)

- **Brotherhood** (`C02`, Skyrim.esm:06E804; winning record: Skyrim.esm; line `companions`, WO-138 batch 2)
  - The planner: giver none; first step 'Follow the questgiver'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Proving_Honor): giver Skjor; objectives 10: 'Speak to Skjor'; 20: 'Speak to Farkas'; 30: 'Retrieve the fragment'.

### The page's first step is a later UESP objective (1)

- **Cultists vs Player** (`DLC2WE09`, Dragonborn.esm:0331C0; winning record: Dragonborn.esm; line `dragonborn`, WO-138 batch 2)
  - The planner: giver none; first step 'Search the one'.
  - UESP (https://en.uesp.net/wiki/Skyrim:Dragonborn_(quest)): giver 2 cultists (DLC2CultistAmbush) OR 3 cultists (DLC2WE09); objectives 5: 'Find out who sent the Cultists'; 7: "Read Cultists' Orders"; 10: 'Travel to Solstheim'.
