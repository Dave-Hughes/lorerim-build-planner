# Quest givers, where quests start, and rewards (WO-98 spike)

Written by `scripts/gamedata/quest_givers.py` from the records in the Ultra load order. Rewards are what the quest's
records can hand out (items its aliases create, objects its scripts point at), not proof of what the scripts do. A
giver's place is where the NPC is placed in the world; NPCs with schedules move about.

## Coverage over all kept quests

| | Quests |
| --- | --- |
| quests | 1340 |
| likely giver | 550 |
| giver with a location | 548 |
| first objective names who or where | 635 |
| giver or such an objective | 755 |
| start event | 212 |
| reward candidate | 920 |
| reward candidate other than gold | 520 |

## The 15 samples

Known answer: for Bob to fill in from the game.

| Quest | Likely giver | Where | First objective | Start event | Reward candidates | Known answer |
| --- | --- | --- | --- | --- | --- | --- |
| The Golden Claw (`MS13`) | Gerdur (dialogue before stage 5); also Hilde (before 5), Frodnar (before 5), Delphine (before 10) | Hod and Gerdur's House, Riverwood | Retrieve the Golden Claw | none found | Septim (gold); LvlQuestReward02Medium (leveled list) | |
| Rise in the East (`MS10`) | Orthus Endario (dialogue before stage 6); also Stig Salt-Plank (before 31), Adelaisa Vendicci (before 41), East Empire Mercenary (before 42) | East Empire Company, Windhelm | Steal Suvaris Atheron's logbook. She works in Windhelm's Clan Shatter-Shield Office. | none found | Septim (gold); LvlQuestReward03Large (leveled list) | |
| The Forsworn Conspiracy (`MS01`) | none found |  | Go to the Shrine of Talos | none found | LvlQuestReward02Medium (leveled list); Septim (gold) | |
| The Break of Dawn (`DA09`) | Meridia (dialogue before stage 400) | Kilkreath Ruins | Find Meridia's beacon | LEVL (DA09IncreaseLevelNodeSHARES) | Dawnbreaker (weapon); kilkreathLightBeam (spell) | |
| A Daedra's Best Friend (`DA03`) | Barbas (dialogue before stage 10) | Haemar's Shame | Talk with Barbas | none found | Masque of Clavicus Vile (armour); Rueful Axe (weapon) | |
| Take Up Arms (`C00`) | Aela the Huntress (dialogue before stage 11); also Farkas (before 11), Skjor (before 11), Vilkas (before 11) | Jorrvaskr Living Quarters, Whiterun | Speak to Kodlak Whitemane | none found | Vilkas's Sword (weapon); Aela's Shield (Master Work) (armour); Beast Form (spell); Septim (gold); Ring of Hircine DISABLED (spell); Skyforge Steel Greatsword (weapon); Beastblood (spell); Inspired (spell) | |
| A Chance Arrangement (`TG00`) | Brynjolf (dialogue before stage 1) | Riften | Meet Brynjolf during daytime | none found | TG00 Pickpocket Boost (perk); Madesi's Silver Ring (armour); Septim (gold) | |
| Wyrmstooth (`WTDragonHunt`) | Theodyn Bienne (dialogue before stage 1); also Lurius Liore (before 11), Athir (before 21), Vulthurkrah (before 101) | Wyrmstooth Holder Cell, Wyrmstooth | Speak to Lurius Liore at The Bannered Mare in Whiterun | none found | none found | |
| Vigilant of Stendarr (`zzzAoMMq00`) | Altano (dialogue before stage 10); also Thorondir (before 21) | Temple of Stendarr, Stuhn Ravine | Join the Vigilants of Stendarr | change location (VigilantDelayedStart) | Amulet of Stendarr (armour); Old Histus Flask (armour); Blessing of Stendarr (spell) | |
| Meridia's Order (`NMeridia01`) | Paladin Marith (dialogue before stage 1); also High Priestess Alara (before 20) | Meridia's Sanctum | Speak with High Priestess Alara at Meridia's Sanctum | none found | none found | |
| In the Pines (`GRVEMainQuest01`) | none found |  | Explore the strange homestead. (names no one) | none found | none found | |
| Bad Vibrations (`InigoBadVibrations`) | Inigo (dialogue before stage 1); also Langley (before 211) | Riften Jail | Get to Snowpoint Beacon and talk to Inigo. | none found | Spell Tome (Novice): Summon Inigo (book) | |
| In their Footsteps (`NecroQuest01`) | none found |  | Search for the Vigil of Stendarr caravan | change location (NecroQuestStart) | none found | |
| Deluge of Deceit (`EVGSirenrootQuest`) | Bolli (dialogue before stage 1); also Nivenor (before 1), Valindor (before 1), Wylandriah (before 5) | Bolli's House, Riften | Accept the job from the Black-Briars | none found | none found | |
| Fists of Fury - The Rift (`FOFRiftenBrawlerQuest`) | Maul (dialogue before stage 6); also The Organizer (before 21), Drackis (before 31), Fights-With-Fists (before 32) | Riften | Find the Ratway Arena down in the Ratway Vaults | none found | none found | |

## Sample details

### The Golden Claw (`MS13`, Skyrim.esm:039645)

- People: Riverwood: Riverwood; Lucan: Lucan Valerius; Camilla: Camilla Valerius; Arvel: Arvel the Swift; FrostbiteSpider: Web Mother
- Giver: Gerdur, named by GetIsID in INFO Skyrim.esm:039642, dialogue before stage 5
- Rewards: Septim (gold, QF_MS13_00039645.Gold); LvlQuestReward02Medium (leveled list, QF_MS13_00039645.LvlQuestReward02Medium)

### Rise in the East (`MS10`, Skyrim.esm:01DBFC)

- People: JaphetsFolly: Japhet's Folly; Orthus: Orthus Endario; Adelaisa: Adelaisa Vendicci; Stig: Stig Salt-Plank; Haldyn: Haldyn; Pirate1: Alding; Pirate2: Irlof; Pirate3: Gjuk; Innkeeper: Karita; TransitMerc: East Empire Mercenary
- Giver: Orthus Endario, named by GetIsID in INFO Skyrim.esm:01F7A1, dialogue before stage 6
- Rewards: Septim (gold, ms10questscript.RewardItem); LvlQuestReward03Large (leveled list, QF_MS10_0001DBFC.Reward)

### The Forsworn Conspiracy (`MS01`, Skyrim.esm:018B4B)

- People: Eltrys: Eltrys; Kerah: Kerah; Margret: Margret; Hogni: Hogni Red-Arm; ShrineofTalos: Shrine of Talos; Inn: Silver-Blood Inn; Warrens: The Warrens; Garvey: Garvey; Nepos: Nepos the Nose; Thonar: Thonar Silver-Blood; Uaile: Uaile; Tynan: Tynan; Morven: Morven; Ildene: Nana Ildene; Betrid: Betrid Silver-Blood; Donnel: Donnel; Dryston: Dryston; EltrysDead: EltrysDead; Rhiada: Rhiada; Player: Prisoner
- Rewards: LvlQuestReward02Medium (leveled list, QF_MS01_00018B4B.LvlQuestReward01Medium); Septim (gold, QF_MS01_00018B4B.pGold)

### The Break of Dawn (`DA09`, Skyrim.esm:04E4E1)

- People: Meridia: Meridia; dragonPriest: Malkoran
- Giver: Meridia, named by alias Meridia in INFO Skyrim.esm:04E4CD, dialogue before stage 400
- Rewards: Dawnbreaker (weapon, alias Dawnsbreaker); kilkreathLightBeam (spell, DA09Script.beamSpell)

### A Daedra's Best Friend (`DA03`, Skyrim.esm:01BFC4)

- People: Barbas: Barbas; WizardLeader: Sebastian Lort
- Giver: Barbas, named by GetIsID in INFO Skyrim.esm:07EAE0, dialogue before stage 10
- Rewards: Masque of Clavicus Vile (armour, QF_DA03_0001BFC4.Masque); Rueful Axe (weapon, QF_DA03_0001BFC4.RuefulAxe)

### Take Up Arms (`C00`, Skyrim.esm:04B2D9)

- People: Kodlak: Kodlak Whitemane; Aela: Aela the Huntress; Farkas: Farkas; Vilkas: Vilkas; Skjor: Skjor; Eorlund: Eorlund Gray-Mane; Athis: Athis; Njada: Njada Stonearm; Ria: Ria; Torvar: Torvar; DustmansCairnReservation: Dustman's Cairn; GallowsRockReservation: Gallows Rock; YsgramorsTombReservation: Ysgramor's Tomb; KodlakEssential: Kodlak Whitemane; AelaEssential: Aela the Huntress; SkjorEssential: Skjor; VilkasEssential: Vilkas; FarkasEssential: Farkas; EorlundEssential: Eorlund Gray-Mane; DeadKodlak1: C06DeadKodlak; DeadKodlak2: C04DeadKodlak; DeadSilverHand1: TreasCorpseBanditNordFemale; DeadSilverHand2: TreasCorpseBanditNordMale; DeadSilverHand3: TreasCorpseBanditNordMale; DeadSilverHand4: Silver Hand; DeadSilverHand5: Silver Hand
- Giver: Aela the Huntress, named by GetIsID in INFO Companions Dialogue Bundle.esp:000808, dialogue before stage 11
- Rewards: Vilkas's Sword (weapon, alias VilkasSword); Aela's Shield (Master Work) (armour, alias AelaShield); Beast Form (spell, companionshousekeepingscript.BeastForm); Septim (gold, companionshousekeepingscript.GoldReward); Ring of Hircine DISABLED (spell, companionshousekeepingscript.HircinesRingPower); Skyforge Steel Greatsword (weapon, companionshousekeepingscript.VilkasWeapon); Beastblood (spell, companionshousekeepingscript.WerewolfImmunity); Inspired (spell, SkjorAdviceScript.SkjorAdviceSpell)

### A Chance Arrangement (`TG00`, Skyrim.esm:021556)

- People: TG00City: Riften; BrynjolfAlias: Brynjolf; BrandSheiAlias: Brand-Shei; MadesiAlias: Madesi
- Giver: Brynjolf, named by GetIsID in INFO Skyrim.esm:020ADA, dialogue before stage 1
- Rewards: TG00 Pickpocket Boost (perk, QF_TG00_00021556.pTG00Pickpockethelper); Madesi's Silver Ring (armour, QF_TG00_00021556.pRing); Septim (gold, TG00QuestScript.pTG00Gold)

### Wyrmstooth (`WTDragonHunt`, Wyrmstooth.esp:022528)

- People: LuriusLiore: Lurius Liore; TheodynBienne: Theodyn Bienne; FollowerAthir: Athir; FollowerDaenlit: Daenlit; FollowerElmera: Elmera; FollowerShargam: Shargam; Vulthurkrah: Vulthurkrah
- Giver: Theodyn Bienne, named by GetIsID in INFO Wyrmstooth.esp:0237D5, dialogue before stage 1
- Rewards: none found

### Vigilant of Stendarr (`zzzAoMMq00`, Vigilant.esm:005CE2)

- People: Altano: Altano; Keeper: Thorondir; DawnstarLocation: Dawnstar
- Giver: Altano, named by alias Altano in INFO Vigilant.esm:005CE7, dialogue before stage 10
- Rewards: Amulet of Stendarr (armour, QF_zzAoMMq00_01005CE2.StendarrAmulet); Old Histus Flask (armour, QF_zzAoMMq00_01005CE2.HistBin); Blessing of Stendarr (spell, QF_zzAoMMq00_01005CE2.ProtectAb)

### Meridia's Order (`NMeridia01`, Meridia.esp:00154A)

- People: Marith: Paladin Marith; Necromancer: Malfyur the Unliving; Alara: High Priestess Alara; Malfyur Ghost: Malfyur the Unliving; Laracin: Arch-Paladin Laracin
- Giver: Paladin Marith, named by GetIsID in INFO Meridia.esp:00154C, dialogue before stage 1
- Rewards: none found

### In the Pines (`GRVEMainQuest01`, FalkreathShades.esp:4CD9DA)

- People: none
- Rewards: none found

### Bad Vibrations (`InigoBadVibrations`, Inigo.esp:0695C5)

- People: Actor 1: Inigo; Actor 2: Langley
- Giver: Inigo, named by GetIsID in INFO Inigo.esp:069B33, dialogue before stage 1
- Rewards: Spell Tome (Novice): Summon Inigo (book, INI__QF_InigoBadVibrations_020695C5.InigoSumBook)

### In their Footsteps (`NecroQuest01`, Undeath.esp:1E225A)

- People: Necromancer: Necromancer; Vigilant: Vigilant Nikolas
- Rewards: none found

### Deluge of Deceit (`EVGSirenrootQuest`, evgSIRENROOT.esm:026BC5)

- People: evgSRWujeetaAlias: Wujeeta; evgSRTilaelAlias: Tilael; evgSRYineelAlias: Yineel; evgSRPeletiusAlias: Peletius Flonel; evgSRCayriceAlias: Cayrice Bentieve; evgSRCrilduinAlias: Crilduin; evgSRLarelleisAlias: Larelleis; evgSRmoragtongalias: Morag Tong Assassin; evgSRFrissaAlias: Frissa Black-Briar
- Giver: Bolli, named by GetIsID in INFO evgSIRENROOT.esm:027BF5, dialogue before stage 1
- Rewards: none found

### Fists of Fury - The Rift (`FOFRiftenBrawlerQuest`, Fists of Fury - Skyrim.esp:04C991)

- People: FOFRiftenGianAlias: Gian the Fist; FOFRiftenOrganizerAlias: The Organizer; FOFRiftenFighter01Alias: Barin; FOFRiftenFighter02Alias: Drackis; FOFRiftenFighter03Alias: Fights-With-Fists; FOFRiftenMaulAlias: Maul
- Giver: Maul, named by GetIsID in INFO Fists of Fury - Skyrim.esp:04C99B, dialogue before stage 6
- Rewards: none found

