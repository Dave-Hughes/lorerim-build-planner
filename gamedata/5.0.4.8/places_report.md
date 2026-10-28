# The places index (WO-128 Part 1, WO-144 Part 1)

Written by `scripts/gamedata/places.py` from the winning records across the load order (with the Creation Club plugins). Clear and discovery XP from `LoreRim - MCM and INI Settings`'s Experience.ini.

**602 places.** 332 have a pointer (a line or a book that names them), 295 have a quest that goes there, and 175 have neither.

## The nine capitals

Found by name and the CWCapital keyword: Dawnstar, Falkreath, Markarth, Morthal, Riften, Solitude, Whiterun, Windhelm, Winterhold.
All nine found with an exterior position.

## By type

| Type | Places | With a pointer | With a quest |
|---|---|---|---|
| Cave | 104 | 61 | 46 |
| Landmark | 99 | 36 | 64 |
| NordicRuin | 53 | 41 | 34 |
| Fort | 41 | 36 | 27 |
| DragonLair | 28 | 9 | 1 |
| Inn | 27 | 18 | 15 |
| Shack | 23 | 5 | 5 |
| DwemerRuin | 22 | 16 | 18 |
| Mine | 17 | 10 | 7 |
| Temple | 15 | 13 | 7 |
| ImperialTower | 14 | 6 | 5 |
| GiantCamp | 13 | 12 | 0 |
| Camp | 13 | 10 | 8 |
| Guild | 13 | 8 | 9 |
| Town | 12 | 12 | 11 |
| NordicDwelling | 11 | 3 | 1 |
| NordicTower | 11 | 5 | 2 |
| Doomstone | 11 | 0 | 1 |
| City | 10 | 0 | 10 |
| Keep | 9 | 8 | 7 |
| Altar | 9 | 3 | 3 |
| DaedricShrine | 8 | 1 | 2 |
| Shipwreck | 8 | 4 | 1 |
| Grove | 7 | 4 | 1 |
| Pass | 5 | 1 | 1 |
| Stables | 5 | 1 | 0 |
| Clearing | 4 | 1 | 1 |
| OrcStronghold | 4 | 4 | 4 |
| Lighthouse | 3 | 1 | 1 |
| Settlement | 3 | 3 | 3 |

## By hold

| Hold | Places | With a pointer | With a quest |
|---|---|---|---|
| (none) | 79 | 32 | 39 |
| The Reach | 60 | 36 | 29 |
| The Rift | 58 | 39 | 26 |
| Falkreath | 53 | 29 | 23 |
| Solstheim | 52 | 25 | 35 |
| Eastmarch | 50 | 30 | 22 |
| Whiterun | 48 | 33 | 22 |
| Winterhold | 42 | 25 | 27 |
| The Pale | 39 | 23 | 20 |
| Haafingar | 33 | 20 | 19 |
| Hjaalmarch | 30 | 17 | 10 |
| Wyrmstooth | 21 | 13 | 9 |
| Alik'r Desert | 18 | 7 | 8 |
| Hjorkvild Isles | 10 | 1 | 2 |
| Morrowind | 9 | 2 | 4 |

## Positions (WO-166)

**532 of 602 places have a position**; 61 are in a town and have none of their own (`inTown`); 9 could not be placed. A position is `world` and `pos` [x, y, z] in game units, found from the place's own map marker, else the exterior cells it owns (the middle of their grid squares: no height, z is null), else a door out of its interior (up to 3 rooms deep). The five big cities' own worldspaces share Tamriel's coordinates (checked door to door) and are filed as Tamriel.

| Found from | Places |
|---|---|
| marker | 428 |
| door | 61 |
| cells | 43 |

| World | Places | On a map |
|---|---|---|
| Tamriel | 366 | yes |
| DLC2SolstheimWorld | 61 | yes |
| zCHMolagWorld | 31 | yes |
| mannyGFDesert | 27 | yes |
| WyrmstoothWorld | 22 | yes |
| BSKHyorkerIsle | 10 | yes |
| ECSSShiveringIsles | 8 | yes |
| ksws07World | 4 | yes |
| NecroDragontailMountains | 1 | no (a pocket world: coordinates mean nothing on a map) |
| zAoMVigilantWorld | 1 | no (a pocket world: coordinates mean nothing on a map) |
| ksws07Dungeon02World | 1 | no (a pocket world: coordinates mean nothing on a map) |

### Not placed, and why

| Why | Places | Types |
|---|---|---|
| interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) | 4 | Landmark, NordicRuin |
| interior cells with no door at all | 3 | Cave, Landmark, Shack |
| no cells: a location nothing is placed in | 2 | Cave, Landmark |

| Place | Type | Plugin | Why |
|---|---|---|---|
| Cave of Mora Sul | Landmark | Gray Fox Cowl.esm | no cells: a location nothing is placed in |
| Awakening Chambers | Landmark | NightmarePlane.esp | interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) |
| Hall Of Awakening | Landmark | NightmarePlane.esp | interior cells with no door at all |
| Nightmare Of Anguish | Landmark | NightmarePlane.esp | interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) |
| Nightmare of Self Doubt | Landmark | NightmarePlane.esp | interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) |
| Skuldafn | NordicRuin | Requiem.esp | interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) |
| Warehouses | Shack | Skyrim.esm | interior cells with no door at all |
| Sanctum of Malacath | Cave | The Cursed Tribe - Quest Expansion.esp | no cells: a location nothing is placed in |
| Frozen Caverns | Cave | WindhelmSSE.esp | interior cells with no door at all |

### Added because a quest names them (44)

Locations a named quest points at (a location alias, or the cell a forced reference stands in) that no place covered: not a hold, a capital, a house, shop, jail or barracks; a place keyword, a town, or no LocType at all; and found on a map. A quest-named room inside another added place is part of it unless two quests name it.

| Place | Type | Plugin | World | Named by |
|---|---|---|---|---|
| Soul Cairn | Landmark | 00Taliesin.esp | Tamriel | Beyond Death, Call Those NPCs, Chapel of Love |
| Ben Erai | Town | BetalillesHammerfellQuestBundle.esp | mannyGFDesert | Deliver a Letter Distant, Deliver a Letter Medium, Deliver a Letter Near |
| Forgotten City | Settlement | BetalillesHammerfellQuestBundle.esp | mannyGFDesert | The Library Lost to the Ages, Weltan the Poet |
| Dead Drop Falls | Landmark | Dawnguard.esm | Tamriel | Bloodline |
| Ash Ghoul Ambush Cell Location | Landmark | Dragonborn.esm | DLC2SolstheimWorld | March of the Dead |
| Northshore Landing | Cave | Dragonborn.esm | DLC2SolstheimWorld | A New Source of Stalhrim, Init quest |
| Abandoned House | Landmark | GORE.esp | Tamriel | The House of Horrors |
| Dark Brotherhood Sanctuary | Town | GORE.esp | Tamriel | BCSLL Vendor Quest, Death Incarnate, Destroy the Dark Brotherhood! |
| Dayspring Canyon | Landmark | GORE.esp | Tamriel | Dawnguard, Destroying the Dawnguard |
| Esbern's Vault | Landmark | GORE.esp | Tamriel | A Cornered Rat, Champion's Choice, MQ Reserved Locations |
| Thalmor Embassy | Landmark | GORE.esp | Tamriel | Diplomatic Immunity, MQ201DossiersQuest, No Stone Unturned |
| Coldharbour | Landmark | Gray Fox Cowl.esm | mannyGFDesert | Memories of the Umbranox |
| Fortress of Ben Erai | Fort | Gray Fox Cowl.esm | mannyGFDesert | Dragonguard Archives: Book 4 |
| The Pit | Landmark | Gray Fox Cowl.esm | mannyGFDesert | The Pit Opponents fight |
| Mercenaries' Ship | Landmark | HLIORemi.esp | Tamriel | Reunion of the Fallen |
| Baan Malur | City | Journey to Baan Malur.esp | DLC2SolstheimWorld | Daedra and Deceit, Hlervan's Ashes, The Amulet of Old |
| Kilerth's Rest | Landmark | Katana.esp | Tamriel | Chasing the Current, Sugar and Spice |
| Fort Valus | Fort | LoreRim - World Fixes.esp | WyrmstoothWorld | Reclaiming the Past |
| Fort Dawnguard | Fort | Lux - JK's Fort Dawnguard patch.esp | Tamriel | ANDR_AJO_VendorQuest, BCSLL Vendor Quest, Dawnguard |
| Goldenglow Estate | Landmark | Lux Via.esp | Tamriel | Loud and Clear, The Litany of Larceny |
| Dawnstar Sanctuary | Town | Lux.esp | Tamriel | A Nest of Vipers, The Dark Brotherhood Forever |
| Meridia's Sanctum | Landmark | Meridia.esp | Tamriel | Fort Justice, Infiltration |
| Gronndal Grove | Grove | Missives - Wyrmstooth.esp | WyrmstoothWorld | A Priceless Commodity |
| Stonehollow | Town | Missives - Wyrmstooth.esp | WyrmstoothWorld | Deliver a Letter Distant, Deliver a Letter Medium, Deliver a Letter Near |
| Anga's Mill | Settlement | Natural Waterfalls.esp | Tamriel | Fills MQ302 aliases |
| Markarth Ruins | Landmark | Requiem.esp | Tamriel | No One Escapes Cidhna Mine |
| The Mind Of A Madman | Landmark | Requiem.esp | Tamriel | On Hogithum, The Mind of Madness |
| Kolskeggr Mine | Mine | Skyrim.esm | Tamriel | Kolskeggr Mine |
| Sanurach Mine | Mine | Skyrim.esm | Tamriel | Sanuarach Mine |
| Shrine of Talos | Landmark | Skyrim.esm | Tamriel | The Forsworn Conspiracy |
| Dainty Sload | Shipwreck | Unofficial Skyrim Modders Patch.esp | Tamriel | No Stone Unturned, The Dainty Sload |
| Soljund's Sinkhole | Mine | Unofficial Skyrim Special Edition Patch.esp | Tamriel | Soljund's Sinkhole |
| Anatomancer's Room | Landmark | Vigilant.esm | Tamriel | Sacred Anatomancer |
| Blood Curse of Froth | Landmark | Vigilant.esm | Tamriel | Stendarr Guide |
| Bruiant Mansion North Wing | Landmark | Vigilant.esm | Tamriel | Stendarr Guide |
| Bruiant Mansion South Wing | Landmark | Vigilant.esm | Tamriel | Stendarr Guide |
| Golden Sanctuary | Landmark | Vigilant.esm | zCHMolagWorld | Temptation of Marukh |
| Gravekeeper's House | Landmark | Vigilant.esm | zCHMolagWorld | The Saint's Corpse |
| Malada Abasel | Landmark | Vigilant.esm | zCHMolagWorld | Coldharbour, Temptation of Marukh |
| Memory | Landmark | Vigilant.esm | zCHMolagWorld | The Nameless Bard |
| Narfin's Inquisition Court | Landmark | Vigilant.esm | zCHMolagWorld | Knight of Julianos |
| Slums | Landmark | Vigilant.esm | zCHMolagWorld | Coldharbour |
| St. Dulsa's Charnel | Landmark | Vigilant.esm | zCHMolagWorld | Adabal |
| Windhelm Dungeon | Landmark | Vigilant.esm | Tamriel | Empty Cells |

### Named by a quest, allowed by its keywords, and on no map (27)

Not places: their interiors reach no map by any door (Apocrypha, Sovngarde, Vigilant's rooms). The quest data still names them.

| Location | Plugin | Why |
|---|---|---|
| Abyss of Molag Bal | Vigilant.esm | no position |
| Actor Room | Vigilant.esm | no position |
| Aetherius | Vigilant.esm | no position |
| Aetherius | Vigilant.esm | no position |
| Apocrypha | Dragonborn.esm | no position |
| Apocrypha | Dragonborn.esm | no position |
| Apocrypha | Dragonborn.esm | no position |
| Apocrypha | Dragonborn.esm | no position |
| Apocrypha | Dragonborn.esm | no position |
| Apocrypha | Dragonborn.esm | no position |
| Apocrypha | Dragonborn.esm | only inside DLC2ApocryphaWorld, which is no map |
| Apocrypha | Siege at Icemoth.esp | no position |
| Apocrypha | Undeath.esp | no position |
| Asylum | Vigilant.esm | no position |
| Azura's Star Interior | Requiem.esp | no position |
| Basement | Vigilant.esm | no position |
| Blood Curse of Chains | Vigilant.esm | no position |
| Blood Curse of Corruption | Vigilant.esm | no position |
| Blood Curse of Shivers | Vigilant.esm | no position |
| Bruiant Mansion | Vigilant.esm | only inside zCOBruiantWorld, which is no map |
| Gravewind Depths | FalkreathShades.esp | no position |
| Japhet's Folly | Update.esm | only inside JaphetsFollyWorld, which is no map |
| Jo'vanni's Dream Theater | Vigilant.esm | no position |
| Matron's Chamber | Vigilant.esm | no position |
| Piper Temple | Vigilant.esm | no position |
| Sancremor Angasel | Vigilant.esm | no position |
| Sovngarde | Skyrim.esm | no position |

### Listed twice or left over, now out (20)

| Name | Editor id | Why | Kept as |
|---|---|---|---|
| Al Shedim | manny_GF_L_AlShedimDungeon | the same place as the entry kept: inside it | manny_GF_L_AlShedim |
| Bonestrewn Crest | DragonMound02LocationUNUSED | a demo or cut-content leftover (its editor id or name says so) | (nothing) |
| Bruiant Mansion South Wing | zzzCOLocBruiantMansionBE | the same place as the entry kept: the same spot | zzzCOLocBruiantMansionSouth |
| Castle Volkihar | DLC1VampireCastleDungeonLocation | the same place as the entry kept: inside it | DLC1VampireCastleLocation |
| E3 Bleak Falls Barrow | E3DemoBleakFallsBarrowLocation | a demo or cut-content leftover (its editor id or name says so) | (nothing) |
| Fort Valus | WTFortValusLocationInterior | the same place as the entry kept: inside it | WTFortValusLocation |
| Helgen | AP_HelgenInteriors | the same place as the entry kept: inside it | HelgenLocation |
| Jorrvaskr | WhiterunJorrvaskrBasementLocation | the same place as the entry kept: inside it | WhiterunJorrvaskrLocation |
| Kynesgrove | KynesgroveFarmsLocationTGCoKG | the same place as the entry kept: inside it | KynesgroveLocation |
| Name TBD | DLC1HunterRadiantDungeonLocation | a demo or cut-content leftover (its editor id or name says so) | (nothing) |
| Nenyond's Underground Priory | zzzCHLocPrioryNenyond01 | the same place as the entry kept: inside it | zzzCHDistrictPrioryNenyond |
| Sancre Tor | manny_GF_L_SancreTorA | the same place as the entry kept: inside it | manny_GF_L_SancreTor |
| Sancre Tor | manny_GF_L_SancreTorB | the same place as the entry kept: inside it | manny_GF_L_SancreTor |
| Sancre Tor | manny_GF_L_SancreTorC | the same place as the entry kept: inside it | manny_GF_L_SancreTor |
| Sancre Tor | manny_GF_L_SancreTorD | the same place as the entry kept: inside it | manny_GF_L_SancreTor |
| Silorn's Priory | zzzCHLocPriorySilorn | the same place as the entry kept: inside it | zzzCHDistrictPriorySilorn |
| Solitude | SolitudeDocksLocation | the same place as the entry kept: inside it | SolitudeLocation |
| Throat of the World | MQ206Location | the same place as the entry kept: the same map marker | ThroatoftheWorldLocation |
| Watchtower | zzzCHLocWfWatchTower | the same place as the entry kept: the same map marker | zzzCHLocMGWatchTower |
| Wellspring Cave | zzzCHSubLocWellspringCave01 | the same place as the entry kept: inside it | zzzCHLocWellspringCave |

### One name, different places, all kept (7 names)

Never in the same town or at the same spot: eight Imperial camps, one in each hold; a Hall of the Dead in each of three cities.

| Name | Places | Where |
|---|---|---|
| Dormitory | 2 | Winterhold; Winterhold |
| Hall of Kyne | 2 | Ivarstead; Kynesgrove |
| Hall of the Dead | 3 | Markarth; Riften; Whiterun |
| Imperial Military Camp | 8 | Eastmarch; Falkreath; Hjaalmarch; The Pale; The Reach; The Rift; Whiterun; Winterhold |
| Jarl's Longhouse | 2 | Falkreath; Winterhold |
| Shrine of Talos | 2 | The Reach; Whiterun |
| Sons of Skyrim Military Camp | 8 | Falkreath; Haafingar; Hjaalmarch; The Pale; The Reach; The Rift; Whiterun; Winterhold |
