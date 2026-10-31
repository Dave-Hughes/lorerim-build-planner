# Quest givers, where quests start, and rewards (WO-98 spike)

Written by `scripts/gamedata/quest_givers.py` from the records in the Ultra load order. Rewards are what the quest's
records can hand out (items its aliases create, objects its scripts point at), not proof of what the scripts do. A
giver's place is where the NPC is placed in the world; NPCs with schedules move about.

## Coverage over all kept quests

| | Quests |
| --- | --- |
| quests | 1387 |
| likely giver | 564 |
| giver with a location | 562 |
| first objective names who or where | 673 |
| giver or such an objective | 795 |
| start event | 213 |
| reward candidate | 949 |
| reward candidate other than gold | 547 |
| people (aliases with an NPC) | 3218 |
| people with a place | 2911 |
| named giver | 650 |
| named giver with a place | 649 |
| story lines | 144 |
| story-line openings with a named giver | 107 |
| story-line openings whose named giver has a place | 106 |

## The 15 samples

Known answer: for Bob to fill in from the game.

| Quest | Named giver, and where | Dialogue speaker | Where | First objective | Start event | Reward candidates | Known answer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| The Golden Claw (`MS13`) | Lucan Valerius (named): Riverwood Trader, Riverwood | Gerdur (dialogue before stage 5); also Hilde (before 5), Frodnar (before 5), Delphine (before 10) | Hod and Gerdur's House, Riverwood | Retrieve the Golden Claw | none found | Septim (gold, fragment); LvlQuestReward02Medium (leveled list, fragment) | |
| Rise in the East (`MS10`) | Orthus Endario (named): East Empire Company, Windhelm | Orthus Endario (dialogue before stage 6); also Stig Salt-Plank (before 31), Adelaisa Vendicci (before 41), East Empire Mercenary (before 42) | East Empire Company, Windhelm | Steal Suvaris Atheron's logbook. She works in Windhelm's Clan Shatter-Shield Office. | none found | Septim (gold, quest script); LvlQuestReward03Large (leveled list, fragment) | |
| The Forsworn Conspiracy (`MS01`) | Eltrys (named): The Warrens, Markarth | none found |  | Go to the Shrine of Talos | none found | LvlQuestReward02Medium (leveled list, fragment); Septim (gold, fragment) | |
| The Break of Dawn (`DA09`) | Meridia (named): Kilkreath Ruins | Meridia (dialogue before stage 400) | Kilkreath Ruins | Find Meridia's beacon | LEVL (DA09IncreaseLevelNodeSHARES) | Dawnbreaker (weapon, alias); kilkreathLightBeam (spell, quest script) | |
| A Daedra's Best Friend (`DA03`) | Barbas (named): Haemar's Shame | Barbas (dialogue before stage 10) | Haemar's Shame | Talk with Barbas | none found | Masque of Clavicus Vile (armour, fragment); Rueful Axe (weapon, fragment) | |
| Take Up Arms (`C00`) | Kodlak Whitemane (named): Jorrvaskr Living Quarters, Whiterun | Aela the Huntress (dialogue before stage 11); also Farkas (before 11), Skjor (before 11), Vilkas (before 11) | Jorrvaskr Living Quarters, Whiterun | Speak to Kodlak Whitemane | none found | Vilkas's Sword (weapon, alias); Aela's Shield (Master Work) (armour, alias); Beast Form (spell, quest script); Septim (gold, quest script); Ring of Hircine DISABLED (spell, quest script); Skyforge Steel Greatsword (weapon, quest script); Beastblood (spell, quest script); Inspired (spell, quest script) | |
| A Chance Arrangement (`TG00`) | Brynjolf (named): Riften | Brynjolf (dialogue before stage 1) | Riften | Meet Brynjolf during daytime | none found | TG00 Pickpocket Boost (perk, fragment); Madesi's Silver Ring (armour, fragment); Septim (gold, quest script) | |
| Wyrmstooth (`WTDragonHunt`) | Lurius Liore (named): Wyrmstooth Holder Cell, Wyrmstooth | Theodyn Bienne (dialogue before stage 1); also Lurius Liore (before 11), Athir (before 21), Vulthurkrah (before 101) | Wyrmstooth Holder Cell, Wyrmstooth | Speak to Lurius Liore at The Bannered Mare in Whiterun | none found | none found | |
| Vigilant of Stendarr (`zzzAoMMq00`) | Altano (dialogue): Temple of Stendarr, Stuhn Ravine | Altano (dialogue before stage 10); also Thorondir (before 21) | Temple of Stendarr, Stuhn Ravine | Join the Vigilants of Stendarr | change location (VigilantDelayedStart) | Amulet of Stendarr (armour, fragment); Old Histus Flask (armour, fragment); Blessing of Stendarr (spell, fragment) | |
| Meridia's Order (`NMeridia01`) | Paladin Marith (named): Meridia's Sanctum | Paladin Marith (dialogue before stage 1); also High Priestess Alara (before 20) | Meridia's Sanctum | Speak with High Priestess Alara at Meridia's Sanctum | none found | none found | |
| In the Pines (`GRVEMainQuest01`) | none found | none found |  | Explore the strange homestead. (names no one) | none found | none found | |
| Bad Vibrations (`InigoBadVibrations`) | Inigo (named): Riften Jail | Inigo (dialogue before stage 1); also Langley (before 211) | Riften Jail | Get to Snowpoint Beacon and talk to Inigo. | none found | Spell Tome (Novice): Summon Inigo (book, quest script) | |
| In their Footsteps (`NecroQuest01`) | none found | none found |  | Search for the Vigil of Stendarr caravan | change location (NecroQuestStart) | none found | |
| Deluge of Deceit (`EVGSirenrootQuest`) | Frissa Black-Briar (named): Elgrim's Elixirs | Bolli (dialogue before stage 1); also Nivenor (before 1), Valindor (before 1), Wylandriah (before 5) | Bolli's House, Riften | Accept the job from the Black-Briars | none found | none found | |
| Fists of Fury - The Rift (`FOFRiftenBrawlerQuest`) | Maul (named): Riften | Maul (dialogue before stage 6); also The Organizer (before 21), Drackis (before 31), Fights-With-Fists (before 32) | Riften | Find the Ratway Arena down in the Ratway Vaults | none found | none found | |

## Sample details

### The Golden Claw (`MS13`, Skyrim.esm:039645)

- People: Riverwood: Riverwood; Lucan: Lucan Valerius, `Skyrim.esm:01347A`, Riverwood Trader, Riverwood; Camilla: Camilla Valerius, `Skyrim.esm:01347B`, Riverwood Trader, Riverwood; Arvel: Arvel the Swift, `Skyrim.esm:039646`, Bleak Falls Temple, Bleak Falls Barrow; FrostbiteSpider: Web Mother, `Skyrim.esm:03A1E0`, Bleak Falls Temple, Bleak Falls Barrow
- Giver: Gerdur, named by GetIsID in INFO Skyrim.esm:039642, dialogue before stage 5
- Rewards: Septim (gold, fragment: QF_MS13_00039645.Gold); LvlQuestReward02Medium (leveled list, fragment: QF_MS13_00039645.LvlQuestReward02Medium)

### Rise in the East (`MS10`, Skyrim.esm:01DBFC)

- People: JaphetsFolly: Japhet's Folly; Orthus: Orthus Endario, `Skyrim.esm:01413B`, East Empire Company, Windhelm; Adelaisa: Adelaisa Vendicci, `Skyrim.esm:01411D`, East Empire Company, Windhelm; Stig: Stig Salt-Plank, `Skyrim.esm:01DC00`, Windpeak Inn, Dawnstar; Haldyn: Haldyn, `Skyrim.esm:01DC04`, Japhet's Folly Towers, Japhet's Folly; Pirate1: Alding, `Skyrim.esm:052268`, Windpeak Inn, Dawnstar; Pirate2: Irlof, `Skyrim.esm:052267`, Windpeak Inn, Dawnstar; Pirate3: Gjuk, `Skyrim.esm:052269`, Windpeak Inn, Dawnstar; Innkeeper: Karita, `Skyrim.esm:01361A`, Windpeak Inn, Dawnstar; TransitMerc: East Empire Mercenary, `Skyrim.esm:056AFD`, Skyrim
- Giver: Orthus Endario, named by GetIsID in INFO Skyrim.esm:01F7A1, dialogue before stage 6
- Rewards: Septim (gold, quest script: ms10questscript.RewardItem); LvlQuestReward03Large (leveled list, fragment: QF_MS10_0001DBFC.Reward)

### The Forsworn Conspiracy (`MS01`, Skyrim.esm:018B4B)

- People: Eltrys: Eltrys, `Skyrim.esm:013394`, The Warrens, Markarth; Kerah: Kerah, `Skyrim.esm:0133A2`, Endon's House, Markarth; Margret: Margret, `Skyrim.esm:09C8A8`, Silver-Blood Inn, Markarth; Hogni: Hogni Red-Arm, `Skyrim.esm:0284AC`, Silver-Blood Inn, Markarth; ShrineofTalos: Shrine of Talos; Inn: Silver-Blood Inn; Warrens: The Warrens; Garvey: Garvey, `Skyrim.esm:0D6703`, The Warrens, Markarth; Nepos: Nepos the Nose, `Skyrim.esm:0133AA`, Nepos' House, Markarth; Thonar: Thonar Silver-Blood, `Skyrim.esm:0133BA`, The Treasury House, Markarth; Uaile: Uaile, `Skyrim.esm:0133BC`, Nepos' House, Markarth; Tynan: Tynan, `Skyrim.esm:0D6718`, Nepos' House, Markarth; Morven: Morven, `Skyrim.esm:0D6719`, Nepos' House, Markarth; Ildene: Nana Ildene, `Skyrim.esm:0133A0`, The Treasury House, Markarth; Betrid: Betrid Silver-Blood, `Skyrim.esm:013388`, The Treasury House, Markarth; Donnel: Donnel, `Skyrim.esm:0D673A`, The Treasury House, Markarth; Dryston: Dryston, `Skyrim.esm:0D6711`, The Warrens, Markarth; EltrysDead: EltrysDead, `Skyrim.esm:101000`, Shrine of Talos, Markarth; Rhiada: Rhiada, `Skyrim.esm:0133B4`, The Treasury House, Markarth; Player: Prisoner, `Skyrim.esm:000007`, never placed
- Rewards: LvlQuestReward02Medium (leveled list, fragment: QF_MS01_00018B4B.LvlQuestReward01Medium); Septim (gold, fragment: QF_MS01_00018B4B.pGold)

### The Break of Dawn (`DA09`, Skyrim.esm:04E4E1)

- People: Meridia: Meridia, `Skyrim.esm:04E4DF`, Kilkreath Ruins; dragonPriest: Malkoran, `Skyrim.esm:09CB66`, Kilkreath Catacombs, Kilkreath Ruins
- Giver: Meridia, named by alias Meridia in INFO Skyrim.esm:04E4CD, dialogue before stage 400
- Rewards: Dawnbreaker (weapon, alias: alias Dawnsbreaker); kilkreathLightBeam (spell, quest script: DA09Script.beamSpell)

### A Daedra's Best Friend (`DA03`, Skyrim.esm:01BFC4)

- People: Barbas: Barbas, `Skyrim.esm:01BFC5`, Haemar's Shame; WizardLeader: Sebastian Lort, `Skyrim.esm:01C4E5`, Rimerock Burrow
- Giver: Barbas, named by GetIsID in INFO Skyrim.esm:07EAE0, dialogue before stage 10
- Rewards: Masque of Clavicus Vile (armour, fragment: QF_DA03_0001BFC4.Masque); Rueful Axe (weapon, fragment: QF_DA03_0001BFC4.RuefulAxe)

### Take Up Arms (`C00`, Skyrim.esm:04B2D9)

- People: Kodlak: Kodlak Whitemane, `Skyrim.esm:01A68E`, Jorrvaskr Living Quarters, Whiterun; Aela: Aela the Huntress, `Skyrim.esm:01A696`, Jorrvaskr Living Quarters, Whiterun; Farkas: Farkas, `Skyrim.esm:01A692`, Jorrvaskr Living Quarters, Whiterun; Vilkas: Vilkas, `Skyrim.esm:01A694`, Jorrvaskr Living Quarters, Whiterun; Skjor: Skjor, `Skyrim.esm:01A690`, Jorrvaskr Living Quarters, Whiterun; Eorlund: Eorlund Gray-Mane, `Skyrim.esm:013B9D`, House Gray-Mane, Whiterun; Athis: Athis, `Skyrim.esm:01A6D5`, Jorrvaskr Living Quarters, Whiterun; Njada: Njada Stonearm, `Skyrim.esm:01A6D9`, Jorrvaskr Living Quarters, Whiterun; Ria: Ria, `Skyrim.esm:01A6D7`, Jorrvaskr Living Quarters, Whiterun; Torvar: Torvar, `Skyrim.esm:01A6DB`, Jorrvaskr Living Quarters, Whiterun; DustmansCairnReservation: Dustman's Cairn; GallowsRockReservation: Gallows Rock; YsgramorsTombReservation: Ysgramor's Tomb; KodlakEssential: Kodlak Whitemane, `Skyrim.esm:01A68E`, Jorrvaskr Living Quarters, Whiterun; AelaEssential: Aela the Huntress, `Skyrim.esm:01A696`, Jorrvaskr Living Quarters, Whiterun; SkjorEssential: Skjor, `Skyrim.esm:01A690`, Jorrvaskr Living Quarters, Whiterun; VilkasEssential: Vilkas, `Skyrim.esm:01A694`, Jorrvaskr Living Quarters, Whiterun; FarkasEssential: Farkas, `Skyrim.esm:01A692`, Jorrvaskr Living Quarters, Whiterun; EorlundEssential: Eorlund Gray-Mane, `Skyrim.esm:013B9D`, House Gray-Mane, Whiterun; DeadKodlak1: C06DeadKodlak, `Skyrim.esm:0DCCC0`, Whiterun; DeadKodlak2: C04DeadKodlak, `Skyrim.esm:0AD3A5`, Jorrvaskr; DeadSilverHand1: TreasCorpseBanditNordFemale, `Skyrim.esm:0328D6`, Jorrvaskr; DeadSilverHand2: TreasCorpseBanditNordMale, `Skyrim.esm:0328D5`, Jorrvaskr; DeadSilverHand3: TreasCorpseBanditNordMale, `Skyrim.esm:0328D5`, Jorrvaskr; DeadSilverHand4: Silver Hand, `Skyrim.esm:0B8669`, Whiterun; DeadSilverHand5: Silver Hand, `Skyrim.esm:0B8669`, Whiterun
- Giver: Aela the Huntress, named by GetIsID in INFO Companions Dialogue Bundle.esp:000808, dialogue before stage 11
- Rewards: Vilkas's Sword (weapon, alias: alias VilkasSword); Aela's Shield (Master Work) (armour, alias: alias AelaShield); Beast Form (spell, quest script: companionshousekeepingscript.BeastForm); Septim (gold, quest script: companionshousekeepingscript.GoldReward); Ring of Hircine DISABLED (spell, quest script: companionshousekeepingscript.HircinesRingPower); Skyforge Steel Greatsword (weapon, quest script: companionshousekeepingscript.VilkasWeapon); Beastblood (spell, quest script: companionshousekeepingscript.WerewolfImmunity); Inspired (spell, quest script: SkjorAdviceScript.SkjorAdviceSpell)

### A Chance Arrangement (`TG00`, Skyrim.esm:021556)

- People: TG00City: Riften; BrynjolfAlias: Brynjolf, `Skyrim.esm:01B07D`, Riften; BrandSheiAlias: Brand-Shei, `Skyrim.esm:01334F`, Haelga's Bunkhouse, Riften; MadesiAlias: Madesi, `Skyrim.esm:01B072`, Riften
- Giver: Brynjolf, named by GetIsID in INFO Skyrim.esm:020ADA, dialogue before stage 1
- Rewards: TG00 Pickpocket Boost (perk, fragment: QF_TG00_00021556.pTG00Pickpockethelper); Madesi's Silver Ring (armour, fragment: QF_TG00_00021556.pRing); Septim (gold, quest script: TG00QuestScript.pTG00Gold)

### Wyrmstooth (`WTDragonHunt`, Wyrmstooth.esp:022528)

- People: LuriusLiore: Lurius Liore, `Wyrmstooth.esp:00BF55`, Wyrmstooth Holder Cell, Wyrmstooth; TheodynBienne: Theodyn Bienne, `Wyrmstooth.esp:0218B6`, Wyrmstooth Holder Cell, Wyrmstooth; FollowerAthir: Athir, `Wyrmstooth.esp:020C4C`, Wyrmstooth Holder Cell, Wyrmstooth; FollowerDaenlit: Daenlit, `Wyrmstooth.esp:020C4E`, Wyrmstooth Holder Cell, Wyrmstooth; FollowerElmera: Elmera, `Wyrmstooth.esp:020C4F`, Wyrmstooth Holder Cell, Wyrmstooth; FollowerShargam: Shargam, `Wyrmstooth.esp:020C4D`, Wyrmstooth Holder Cell, Wyrmstooth; Vulthurkrah: Vulthurkrah, `Wyrmstooth.esp:028275`, Wyrmstooth Holder Cell, Wyrmstooth
- Giver: Theodyn Bienne, named by GetIsID in INFO Wyrmstooth.esp:0237D5, dialogue before stage 1
- Rewards: none found

### Vigilant of Stendarr (`zzzAoMMq00`, Vigilant.esm:005CE2)

- People: Altano: Altano, `Vigilant.esm:000D62`, Temple of Stendarr, Stuhn Ravine; Keeper: Thorondir, `Vigilant.esm:02748B`, Temple of Stendarr, Stuhn Ravine; DawnstarLocation: Dawnstar
- Giver: Altano, named by alias Altano in INFO Vigilant.esm:005CE7, dialogue before stage 10
- Rewards: Amulet of Stendarr (armour, fragment: QF_zzAoMMq00_01005CE2.StendarrAmulet); Old Histus Flask (armour, fragment: QF_zzAoMMq00_01005CE2.HistBin); Blessing of Stendarr (spell, fragment: QF_zzAoMMq00_01005CE2.ProtectAb)

### Meridia's Order (`NMeridia01`, Meridia.esp:00154A)

- People: Marith: Paladin Marith, `Meridia.esp:000D6C`, Meridia's Sanctum; Necromancer: Malfyur the Unliving, `Meridia.esp:001FBB`, The Winking Skeever; Alara: High Priestess Alara, `Meridia.esp:000D6F`, Meridia's Sanctum; Malfyur Ghost: Malfyur the Unliving, `Meridia.esp:00302F`, Skyrim; Laracin: Arch-Paladin Laracin, `Meridia.esp:000D6E`, Meridia's Sanctum
- Giver: Paladin Marith, named by GetIsID in INFO Meridia.esp:00154C, dialogue before stage 1
- Rewards: none found

### In the Pines (`GRVEMainQuest01`, FalkreathShades.esp:4CD9DA)

- People: none
- Rewards: none found

### Bad Vibrations (`InigoBadVibrations`, Inigo.esp:0695C5)

- People: Actor 1: Inigo, `Inigo.esp:000D62`, Riften Jail; Actor 2: Langley, `Inigo.esp:056C01`, Langley's House
- Giver: Inigo, named by GetIsID in INFO Inigo.esp:069B33, dialogue before stage 1
- Rewards: Spell Tome (Novice): Summon Inigo (book, quest script: INI__QF_InigoBadVibrations_020695C5.InigoSumBook)

### In their Footsteps (`NecroQuest01`, Undeath.esp:1E225A)

- People: Necromancer: Necromancer, `Undeath.esp:25CFB5`, Skyrim; Vigilant: Vigilant Nikolas, `Undeath.esp:257E9D`, Skyrim
- Rewards: none found

### Deluge of Deceit (`EVGSirenrootQuest`, evgSIRENROOT.esm:026BC5)

- People: evgSRWujeetaAlias: Wujeeta, `Skyrim.esm:013382`, Haelga's Bunkhouse, Riften; evgSRTilaelAlias: Tilael, `evgSIRENROOT.esm:029C7E`, Skyrim; evgSRYineelAlias: Yineel, `evgSIRENROOT.esm:02B219`, Skyrim; evgSRPeletiusAlias: Peletius Flonel, `evgSIRENROOT.esm:02ACB3`, Skyrim; evgSRCayriceAlias: Cayrice Bentieve, `evgSIRENROOT.esm:051E51`, Skyrim; evgSRCrilduinAlias: Crilduin, `evgSIRENROOT.esm:089F1A`, Honrich Welkeseli; evgSRLarelleisAlias: Larelleis, `evgSIRENROOT.esm:04AC2F`, Skyrim; evgSRmoragtongalias: Morag Tong Assassin, `evgSIRENROOT.esm:0B56C1`, Honrich Morbalseli; evgSRFrissaAlias: Frissa Black-Briar, `evgSIRENROOT.esm:0A25D4`, Elgrim's Elixirs
- Giver: Bolli, named by GetIsID in INFO evgSIRENROOT.esm:027BF5, dialogue before stage 1
- Rewards: none found

### Fists of Fury - The Rift (`FOFRiftenBrawlerQuest`, Fists of Fury - Skyrim.esp:04C991)

- People: FOFRiftenGianAlias: Gian the Fist, `Fists of Fury - Skyrim.esp:0F8C1B`, The Ratway Arena, Ratway Arena; FOFRiftenOrganizerAlias: The Organizer, `Fists of Fury - Skyrim.esp:019E6A`, The Ratway Arena, Ratway Arena; FOFRiftenFighter01Alias: Barin, `Fists of Fury - Skyrim.esp:01EF7E`, The Ratway Arena, Ratway Arena; FOFRiftenFighter02Alias: Drackis, `Fists of Fury - Skyrim.esp:01EF7F`, The Ratway Arena, Ratway Arena; FOFRiftenFighter03Alias: Fights-With-Fists, `Fists of Fury - Skyrim.esp:01EF80`, The Ratway Arena, Ratway Arena; FOFRiftenMaulAlias: Maul, `Skyrim.esm:0371D6`, Riften
- Giver: Maul, named by GetIsID in INFO Fists of Fury - Skyrim.esp:04C99B, dialogue before stage 6
- Rewards: none found

