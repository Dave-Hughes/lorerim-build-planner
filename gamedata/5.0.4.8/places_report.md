# The places index (WO-128 Part 1, WO-144 Part 1)

Written by `scripts/gamedata/places.py` from the winning records across the load order (with the Creation Club plugins). Clear and discovery XP from `LoreRim - MCM and INI Settings`'s Experience.ini.

**1015 places.** 439 have a pointer (a line or a book that names them), 404 have a quest that goes there, and 427 have neither.

## The nine capitals

Found by name and the CWCapital keyword: Dawnstar, Falkreath, Markarth, Morthal, Riften, Solitude, Whiterun, Windhelm, Winterhold.
All nine found with an exterior position.

## By type

| Type | Places | With a pointer | With a quest |
|---|---|---|---|
| House | 179 | 9 | 23 |
| Landmark | 158 | 44 | 84 |
| Cave | 111 | 66 | 52 |
| NordicRuin | 55 | 44 | 35 |
| Store | 51 | 23 | 20 |
| Fort | 45 | 38 | 29 |
| Shack | 31 | 6 | 7 |
| Inn | 29 | 20 | 16 |
| DragonLair | 28 | 9 | 1 |
| DwemerRuin | 27 | 20 | 22 |
| Farm | 24 | 8 | 4 |
| Building | 20 | 4 | 5 |
| Mine | 19 | 11 | 7 |
| ImperialTower | 16 | 7 | 7 |
| Camp | 15 | 11 | 8 |
| Guild | 15 | 11 | 10 |
| PlayerHouse | 15 | 11 | 8 |
| Temple | 14 | 12 | 7 |
| GiantCamp | 13 | 12 | 0 |
| Town | 13 | 13 | 5 |
| NordicDwelling | 12 | 6 | 1 |
| NordicTower | 12 | 6 | 3 |
| Doomstone | 11 | 0 | 1 |
| City | 10 | 0 | 10 |
| Altar | 10 | 4 | 4 |
| DaedricShrine | 9 | 2 | 3 |
| Keep | 9 | 9 | 7 |
| Shipwreck | 9 | 5 | 1 |
| Grove | 7 | 4 | 1 |
| Barracks | 6 | 1 | 3 |
| Clearing | 5 | 1 | 1 |
| Pass | 5 | 1 | 1 |
| Stables | 5 | 1 | 1 |
| Castle | 5 | 3 | 3 |
| Jail | 5 | 3 | 5 |
| OrcStronghold | 4 | 4 | 4 |
| Lighthouse | 4 | 2 | 1 |
| Settlement | 4 | 4 | 3 |
| Mill | 4 | 3 | 0 |
| Meadery | 1 | 1 | 1 |

## By hold

| Hold | Places | With a pointer | With a quest |
|---|---|---|---|
| (none) | 169 | 49 | 67 |
| The Rift | 102 | 55 | 43 |
| Eastmarch | 100 | 42 | 36 |
| Whiterun | 95 | 45 | 35 |
| The Reach | 94 | 44 | 41 |
| Haafingar | 86 | 29 | 27 |
| Falkreath | 67 | 38 | 29 |
| Solstheim | 65 | 26 | 37 |
| The Pale | 55 | 28 | 23 |
| Winterhold | 54 | 30 | 29 |
| Hjaalmarch | 44 | 20 | 14 |
| Wyrmstooth | 30 | 16 | 8 |
| Alik'r Desert | 29 | 9 | 9 |
| Morrowind | 15 | 7 | 4 |
| Hjorkvild Isles | 10 | 1 | 2 |

## Positions (WO-166)

**683 of 1015 places have a position**; 320 are in a town and have none of their own (`inTown`); 12 could not be placed. A position is `world` and `pos` [x, y, z] in game units, found from the place's own map marker, else the exterior cells it owns (the middle of their grid squares: no height, z is null), else a door out of its interior (up to 3 rooms deep). The five big cities' own worldspaces share Tamriel's coordinates (checked door to door) and are filed as Tamriel.

| Found from | Places |
|---|---|
| marker | 476 |
| door | 162 |
| cells | 45 |

| World | Places | On a map |
|---|---|---|
| Tamriel | 471 | yes |
| DLC2SolstheimWorld | 72 | yes |
| zCHMolagWorld | 58 | yes |
| mannyGFDesert | 32 | yes |
| WyrmstoothWorld | 25 | yes |
| BSKHyorkerIsle | 10 | yes |
| ECSSShiveringIsles | 8 | yes |
| ksws07World | 4 | yes |
| ccBGSSSE067DeadlandsWorld | 1 | no (a pocket world: coordinates mean nothing on a map) |
| NecroDragontailMountains | 1 | no (a pocket world: coordinates mean nothing on a map) |
| ksws07Dungeon02World | 1 | no (a pocket world: coordinates mean nothing on a map) |

| Kind | Places | Positioned | In a town | Not placed |
|---|---|---|---|---|
| House | 179 | 24 | 155 | 0 |
| Landmark | 158 | 141 | 11 | 6 |
| Cave | 111 | 109 | 0 | 2 |
| NordicRuin | 55 | 54 | 0 | 1 |
| Store | 51 | 8 | 43 | 0 |
| Fort | 45 | 43 | 2 | 0 |
| Shack | 31 | 30 | 0 | 1 |
| Inn | 29 | 6 | 23 | 0 |
| DragonLair | 28 | 28 | 0 | 0 |
| DwemerRuin | 27 | 27 | 0 | 0 |
| Farm | 24 | 16 | 8 | 0 |
| Building | 20 | 4 | 16 | 0 |
| Mine | 19 | 17 | 2 | 0 |
| ImperialTower | 16 | 14 | 1 | 1 |
| Camp | 15 | 15 | 0 | 0 |
| Guild | 15 | 2 | 13 | 0 |
| PlayerHouse | 15 | 9 | 6 | 0 |
| Temple | 14 | 2 | 12 | 0 |
| GiantCamp | 13 | 13 | 0 | 0 |
| Town | 13 | 13 | 0 | 0 |
| NordicDwelling | 12 | 12 | 0 | 0 |
| NordicTower | 12 | 12 | 0 | 0 |
| Doomstone | 11 | 10 | 0 | 1 |
| City | 10 | 10 | 0 | 0 |
| Altar | 10 | 10 | 0 | 0 |
| DaedricShrine | 9 | 9 | 0 | 0 |
| Keep | 9 | 0 | 9 | 0 |
| Shipwreck | 9 | 8 | 1 | 0 |
| Grove | 7 | 7 | 0 | 0 |
| Barracks | 6 | 1 | 5 | 0 |
| Clearing | 5 | 5 | 0 | 0 |
| Pass | 5 | 5 | 0 | 0 |
| Stables | 5 | 1 | 4 | 0 |
| Castle | 5 | 1 | 4 | 0 |
| Jail | 5 | 0 | 5 | 0 |
| OrcStronghold | 4 | 4 | 0 | 0 |
| Lighthouse | 4 | 4 | 0 | 0 |
| Settlement | 4 | 4 | 0 | 0 |
| Mill | 4 | 4 | 0 | 0 |
| Meadery | 1 | 1 | 0 | 0 |

### Not placed, and why

| Why | Places | Types |
|---|---|---|
| interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) | 5 | ImperialTower, Landmark, NordicRuin |
| interior cells with no door at all | 3 | Cave, Landmark, Shack |
| no cells: a location nothing is placed in | 3 | Cave, Doomstone, Landmark |
| another plane: the door out of it opens in Castle Volkihar, which has the position | 1 | Landmark |

| Place | Type | Plugin | Why |
|---|---|---|---|
| Soul Cairn | Landmark | 00Taliesin.esp | another plane: the door out of it opens in Castle Volkihar, which has the position |
| Cave of Mora Sul | Landmark | Gray Fox Cowl.esm | no cells: a location nothing is placed in |
| Awakening Chambers | Landmark | NightmarePlane.esp | interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) |
| Hall Of Awakening | Landmark | NightmarePlane.esp | interior cells with no door at all |
| Nightmare Of Anguish | Landmark | NightmarePlane.esp | interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) |
| Nightmare of Self Doubt | Landmark | NightmarePlane.esp | interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) |
| Skuldafn | NordicRuin | Requiem.esp | interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) |
| The Thief Doomstone | Doomstone | Skyrim.esm | no cells: a location nothing is placed in |
| Warehouses | Shack | Skyrim.esm | interior cells with no door at all |
| Sanctum of Malacath | Cave | The Cursed Tribe - Quest Expansion.esp | no cells: a location nothing is placed in |
| Frozen Caverns | Cave | WindhelmSSE.esp | interior cells with no door at all |
| Iron Tusk Cave Location | ImperialTower | cckrtsse001_altar.esl | interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) |

### Added because a quest, a person's home or a book names them (447)

Every location a named quest points at (a location alias, or the cell a forced reference stands in), a person's home (their first placed cell, people_raw.json) or a book is read or found in (book_places.json) that no place of the index covers, whatever it is, with a `kind` from its keywords (then its name's word): not a hold, a capital, a demo leftover or a name no map and no town holds. A town or city never covers what is inside it. A room inside another added place is part of it unless two quests name it. What is inside a town has `inTown` and no position; the rest needs one on a map. 47 are cells of no location at all (Green-Tip Cabin), a place of their own keyed by the cell.

| Named by | Places |
|---|---|
| homes | 304 |
| homes + quests | 101 |
| quests | 42 |

| Kind | Added | In a town | On a map |
|---|---|---|---|
| House | 179 | 155 | 24 |
| Landmark | 85 | 11 | 73 |
| Store | 51 | 43 | 8 |
| Farm | 24 | 8 | 16 |
| Building | 20 | 16 | 4 |
| PlayerHouse | 15 | 6 | 9 |
| Fort | 8 | 2 | 6 |
| Shack | 8 | 0 | 8 |
| Barracks | 6 | 5 | 1 |
| Town | 5 | 0 | 5 |
| Jail | 5 | 5 | 0 |
| Mine | 5 | 2 | 3 |
| Cave | 4 | 0 | 4 |
| Castle | 4 | 4 | 0 |
| Mill | 4 | 0 | 4 |
| Settlement | 3 | 0 | 3 |
| Guild | 3 | 1 | 2 |
| DwemerRuin | 2 | 0 | 2 |
| Camp | 2 | 0 | 2 |
| Inn | 2 | 1 | 1 |
| Shipwreck | 2 | 1 | 1 |
| NordicRuin | 1 | 0 | 1 |
| NordicTower | 1 | 0 | 1 |
| NordicDwelling | 1 | 0 | 1 |
| Altar | 1 | 0 | 1 |
| Grove | 1 | 0 | 1 |
| City | 1 | 0 | 1 |
| DaedricShrine | 1 | 0 | 1 |
| Lighthouse | 1 | 0 | 1 |
| Meadery | 1 | 0 | 1 |
| ImperialTower | 1 | 1 | 0 |

| Plugin | Added |
|---|---|
| Skyrim.esm | 73 |
| Vigilant.esm | 42 |
| Unofficial Skyrim Special Edition Patch.esp | 28 |
| RedBag's Solitude.esp | 23 |
| WindhelmSSE.esp | 20 |
| ForgottenCity.esp | 18 |
| Gray Fox Cowl.esm | 15 |
| SurWR.esp | 15 |
| Dragonborn.esm | 13 |
| GORE.esp | 10 |
| The Great City of Solitude.esp | 10 |
| The Great City of Winterhold v4.esp | 9 |
| Journey to Baan Malur.esp | 8 |
| Wyrmstooth.esp | 8 |
| Lux Via - Markarth Entrance and Farm Overhaul.esp | 8 |
| HeartOfTheReach.esp | 6 |
| Meridia.esp | 6 |
| Arena - Markarth Side.esp | 6 |
| The Great Town of Shor's Stone.esp | 6 |
| BetalillesHammerfellQuestBundle.esp | 5 |
| LegendsOfAetherium.esp | 5 |
| COTN - Falkreath.esp | 5 |
| Sky City.esp | 5 |
| Lux - COTN Morthal patch.esp | 5 |
| COTN - Dawnstar.esp | 5 |

The places that are not a house, shop, barracks, jail or building (those are only counted above):

| Place | Kind | Where | Plugin | Named by |
|---|---|---|---|---|
| Soul Cairn | Landmark | (none) | 00Taliesin.esp | Beyond Death, Call Those NPCs, Chapel of Love |
| Ancient Ruins | Landmark | mannyGFDesert | BetalillesHammerfellQuestBundle.esp | The Silent Sword |
| Ash'abah Hideout | Landmark | mannyGFDesert | BetalillesHammerfellQuestBundle.esp | Honai, Nimshat |
| Ben Erai | Town | mannyGFDesert | BetalillesHammerfellQuestBundle.esp | Deliver a Letter Distant, Deliver a Letter Medium, Deliver a Letter Near |
| Forgotten City | Settlement | mannyGFDesert | BetalillesHammerfellQuestBundle.esp | The Library Lost to the Ages, Weltan the Poet |
| Salas Kazas | Town | mannyGFDesert | BetalillesHammerfellQuestBundle.esp | Behsharah, Daliah, Sharza |
| Goldenhills Plantation | Landmark | Tamriel | CC Farming - Tweaks and Enhancements.esp | A Farmer's Life For Me, The Unquiet Dead |
| Dead Drop Falls | Landmark | Tamriel | Dawnguard.esm | Bloodline |
| Ash Ghoul Ambush Cell Location | Landmark | DLC2SolstheimWorld | Dragonborn.esm | March of the Dead |
| Northshore Landing | Cave | DLC2SolstheimWorld | Dragonborn.esm | A New Source of Stalhrim, Init quest |
| Ulen Ancestral Tomb | Landmark | DLC2SolstheimWorld | Dragonborn.esm | Served Cold |
| Gravewind Mausoleum | Landmark | Tamriel | FalkreathShades.esp | Awakened Vessel, Magic Anomaly, Shade |
| MerchantLocations | Landmark | Tamriel | FalkreathShades.esp | Shadow Merchant |
| Ratway Arena | Landmark | Riften | Fists of Fury - Skyrim.esp | Alia, Barin, Darin |
| Abandoned Palace | Landmark | Tamriel | ForgottenCity.esp | Burnt Horror, Charred horror, Narnabus the Necromancer |
| Brol the Scholar's Chambers | Landmark | Tamriel | ForgottenCity.esp | Brol |
| Citadel | Landmark | Tamriel | ForgottenCity.esp | The Forgotten City |
| Forgotten Ruins | DwemerRuin | Tamriel | ForgottenCity.esp | Cassia, Dark Brotherhood Warlock, Looter |
| Lakehouse | Landmark | Tamriel | ForgottenCity.esp | Forget-me-not, The Forgotten City |
| Luki's Chambers | Landmark | Tamriel | ForgottenCity.esp | Luki |
| The Forgotten City | Landmark | Tamriel | ForgottenCity.esp | The Forgotten City |
| Underground Tunnels | Landmark | Tamriel | ForgottenCity.esp | Altrius, Dwarven Spider Worker, Giant Skeever |
| Dark Brotherhood Sanctuary | Guild | Tamriel | GORE.esp | BCSLL Vendor Quest, Death Incarnate, Destroy the Dark Brotherhood! |
| Dayspring Canyon | Landmark | Tamriel | GORE.esp | Dawnguard, Destroying the Dawnguard |
| Esbern's Vault | Landmark | Riften | GORE.esp | A Cornered Rat, Champion's Choice, MQ Reserved Locations |
| Honningbrew Meadery | Meadery | Tamriel | GORE.esp | Dampened Spirits |
| Thalmor Embassy | Landmark | Tamriel | GORE.esp | Diplomatic Immunity, MQ201DossiersQuest, No Stone Unturned |
| Coldharbour | Landmark | mannyGFDesert | Gray Fox Cowl.esm | Memories of the Umbranox |
| Fortress of Ben Erai | Fort | Ben Erai | Gray Fox Cowl.esm | Dragonguard Archives: Book 4 |
| Mausoleum | Altar | mannyGFDesert | Gray Fox Cowl.esm | Weltan the Poet |
| Seviana's House | Shack | Tamriel | Gray Fox Cowl.esm | Luvien, Seviana Umbranox |
| Shanta Filibb | Shack | mannyGFDesert | Gray Fox Cowl.esm | Claim Shanta Filibb |
| The Pit | Landmark | mannyGFDesert | Gray Fox Cowl.esm | The Pit Opponents fight |
| Three Peaks Staff and Magic | Shack | mannyGFDesert | Gray Fox Cowl.esm | Ilrav Baenius |
| Arkngchal | DwemerRuin | Tamriel | HLIORemi.esp | Exploring Arkngchal, We Who Challenge the Sun |
| Mercenaries' Ship | Landmark | Tamriel | HLIORemi.esp | Reunion of the Fallen |
| Ever-Bog Bowels | Landmark | Tamriel | HeartOfTheReach.esp | Heart Of The Reach |
| Ever-Bog Cave | Cave | Tamriel | HeartOfTheReach.esp | Heart Of The Reach |
| Ever-Bog Caverns | Landmark | Tamriel | HeartOfTheReach.esp | Heart Of The Reach |
| Ever-Bog Chamber | Landmark | Tamriel | HeartOfTheReach.esp | Heart Of The Reach |
| Ever-Bog Glen | Landmark | Tamriel | HeartOfTheReach.esp | Heart Of The Reach |
| Ever-Bog Heart Chamber | Landmark | Tamriel | HeartOfTheReach.esp | Heart Of The Reach |
| Langley's House | Shack | Tamriel | Inigo.esp | Langley |
| Arena Market | Landmark | Baan Malur | Journey to Baan Malur.esp | Adimmisaru, Baan Malur Guard, Bantam Guar |
| Baan Malur | City | DLC2SolstheimWorld | Journey to Baan Malur.esp | Daedra and Deceit, Hlervan's Ashes, The Amulet of Old |
| Cormaris | Town | DLC2SolstheimWorld | Journey to Baan Malur.esp | Corvin Marein, Davril, Llevys Marein |
| Fort Blacklight | Fort | Baan Malur | Journey to Baan Malur.esp | Commander Ulith, Prisoner |
| Fort Tulis | Fort | DLC2SolstheimWorld | Journey to Baan Malur.esp | Bruska Berserker, Bruska Goblin, Bruska Warchief |
| Monger Mill | Landmark | DLC2SolstheimWorld | Journey to Baan Malur.esp | Fervis, Treward |
| Ruined Farmhouse | Landmark | DLC2SolstheimWorld | Journey to Baan Malur.esp | Hlervan's Ashes |
| Saxhleel Camp | Camp | DLC2SolstheimWorld | Journey to Baan Malur.esp | Kar-Jei |
| Kilerth's Rest | Landmark | Winterhold | Katana.esp | Chasing the Current, Sugar and Spice |
| Itharzel Chironasium | Landmark | Tamriel | LegendsOfAetherium.esp | Aetherial Mage, Mercenary, Miner |
| Itharzel Grand Chamber | Landmark | Tamriel | LegendsOfAetherium.esp | Legends Of Aetherium |
| Itharzel Manufactorium | Landmark | Tamriel | LegendsOfAetherium.esp | Legends Of Aetherium |
| Itharzel Siphonasium | Landmark | Tamriel | LegendsOfAetherium.esp | Aetherial Centurion, Aetherial Sphere, Aetherial Spider Worker |
| Itharzel Throne | Landmark | Tamriel | LegendsOfAetherium.esp | Legends Of Aetherium |
| Fort Valus | Fort | WyrmstoothWorld | LoreRim - World Fixes.esp | Reclaiming the Past |
| Fort Dawnguard | Fort | Tamriel | Lux - JK's Fort Dawnguard patch.esp | ANDR_AJO_VendorQuest, BCSLL Vendor Quest, Dawnguard |
| Hidden Minotaur Village | Landmark | Tamriel | Lux - Vigilant patch.esp | Horbahha the Chief, Mordog the Man-Bull |
| Goldenglow Estate | Landmark | Tamriel | Lux Via.esp | Loud and Clear, The Litany of Larceny |
| Dawnstar Sanctuary | Guild | Tamriel | Lux.esp | A Nest of Vipers, The Dark Brotherhood Forever |
| Dark Dawn Sanctuary | Landmark | Tamriel | Meridia.esp | Infiltration, The Dark Dawn |
| Fort Justice | Fort | Tamriel | Meridia.esp | A New Day, Fort Justice, The Ritual |
| Fort Ruins | Fort | Tamriel | Meridia.esp | A New Day |
| Golvunter | NordicRuin | Tamriel | Meridia.esp | Ghost |
| Golvunter Chambers | Landmark | Tamriel | Meridia.esp | Prisoner |
| Meridia's Sanctum | Landmark | Tamriel | Meridia.esp | Fort Justice, Infiltration |
| Chillwater Mill | Settlement | WyrmstoothWorld | Missives - Wyrmstooth.esp | Balmir, Yngfa |
| Gronndal Grove | Grove | WyrmstoothWorld | Missives - Wyrmstooth.esp | A Priceless Commodity |
| Stonehollow | Town | WyrmstoothWorld | Missives - Wyrmstooth.esp | Deliver a Letter Distant, Deliver a Letter Medium, Deliver a Letter Near |
| Anga's Mill | Settlement | Tamriel | Natural Waterfalls.esp | Fills MQ302 aliases |
| Green-Tip Cabin | Shack | Tamriel | NightmarePlane.esp | Gretska, Ralforn |
| Solitude Windmill | Landmark | Solitude | RedBag's Solitude.esp | Tanaesi |
| The Katariah | Shipwreck | Solitude | RedBag's Solitude.esp | Captain Avidius, Lieutenant Salvarus, Penitus Oculatus Agent |
| Markarth Ruins | Landmark | Markarth | Requiem.esp | No One Escapes Cidhna Mine |
| The Mind Of A Madman | Landmark | Tamriel | Requiem.esp | On Hogithum, The Mind of Madness |
| Realm of Dream | Landmark | Tamriel | RuneDreamstrides.esp | Draugr Goliath, Enthralled Omen, Frostbite Spider |
| Mudcrab Den | Landmark | Tamriel | Ryn's Crabber's Shanty.esp | Giant Mudcrab, Titanclaw Caller |
| Kolskeggr Mine | Mine | Tamriel | Skyrim.esm | Kolskeggr Mine |
| Misty Grove | Landmark | Tamriel | Skyrim.esm | A Night To Remember |
| Sanurach Mine | Mine | Karthwasten | Skyrim.esm | Sanuarach Mine |
| Shrine of Talos | Landmark | Markarth | Skyrim.esm | The Forsworn Conspiracy |
| Steamscorch Gully Mine | Mine | Kynesgrove | Skyrim.esm | Ganna Uriel, Gemma Uriel, Roggi Knot-Beard |
| Drelas Cottage | Shack | Tamriel | Snazzy Drelas Cottage.esp | Drelas |
| Guard Tower | Landmark | Whiterun | SurWR.esp | Courier |
| Fallowstone Vault | Guild | Shor's Stone | The Great Town of Shor's Stone.esp | Armored Frost Troll, Armored Troll |
| Ravenscorn Spire | NordicTower | Tamriel | Undeath.esp | In their Footsteps, The Path of Transcendence |
| Temple of Arkay | NordicDwelling | Tamriel | Undeath.esp | Gundar, Priest of Arkay, Priestess of Arkay |
| The Broker's Shack | Shack | Tamriel | Undeath.esp | The Broker |
| Dainty Sload | Shipwreck | Tamriel | Unofficial Skyrim Modders Patch.esp | No Stone Unturned, The Dainty Sload |
| Angi's Camp | Shack | Tamriel | Unofficial Skyrim Special Edition Patch.esp | More to Say Find Angi |
| Nightgate Inn | Inn | Tamriel | Unofficial Skyrim Special Edition Patch.esp | Revenge, Hired Thugs |
| Solitude Lighthouse | Lighthouse | Tamriel | Unofficial Skyrim Special Edition Patch.esp | Ma'zaka |
| Soljund's Sinkhole | Mine | Tamriel | Unofficial Skyrim Special Edition Patch.esp | Soljund's Sinkhole |
| Whistling Mine | Mine | Tamriel | Unofficial Skyrim Special Edition Patch.esp | Angvid, Badnir, Gunding |
| Ironback Hideout Cellar | Landmark | Tamriel | Update.esm | Armored Frost Troll |
| Anatomancer's Room | Landmark | Tamriel | Vigilant.esm | Sacred Anatomancer |
| Bandit Kanra's Lair | Landmark | zCHMolagWorld | Vigilant.esm | Bandit Kanra, Soul-Shriven |
| Bed of Corruption | Landmark | zCHMolagWorld | Vigilant.esm | Mary the Dark Maiden |
| Blood Curse of Froth | Landmark | Tamriel | Vigilant.esm | Stendarr Guide |
| Bruiant Mansion North Wing | Landmark | Tamriel | Vigilant.esm | Stendarr Guide |
| Bruiant Mansion South Wing | Landmark | Tamriel | Vigilant.esm | Stendarr Guide |
| Chapel of Arkay | Landmark | zCHMolagWorld | Vigilant.esm | Sir Torolf |
| Chestnut Handy Stables | Landmark | zCHMolagWorld | Vigilant.esm | Ogra the Stablemaster, Skeletal Horse, Skeletal Unicorn |
| Curia Morimath | Landmark | zCHMolagWorld | Vigilant.esm | Archpriest Centius |
| Emperor Gorieus' Charnel | Landmark | zCHMolagWorld | Vigilant.esm | Emperor Gorieus, Gallant Specter of Emperor Gorieus |
| Fort Verin | Fort | zCHMolagWorld | Vigilant.esm | Vernaccus |
| Fountain Garden of Dibella | Landmark | zCHMolagWorld | Vigilant.esm | Sir Gregory, Sir Juncan |
| Golden Sanctuary | Landmark | zCHMolagWorld | Vigilant.esm | Temptation of Marukh |
| Imperial Prison Sewers | Landmark | zCHMolagWorld | Vigilant.esm | Atima, Dark Kid, Dark One |
| Jhunal's Library | Landmark | zCHMolagWorld | Vigilant.esm | Jhunal the Owl, Piece of Jhunal, Saklas the Man-Ape |
| Jo'vanni's Dream Theater | Landmark | Whiterun | Vigilant.esm | Winch the Handy |
| Malada Abasel | Landmark | zCHMolagWorld | Vigilant.esm | Coldharbour, Temptation of Marukh |
| Malada Ageasel | Landmark | zCHMolagWorld | Vigilant.esm | Arch-Selective Caliburn |
| Memory | Landmark | zCHMolagWorld | Vigilant.esm | The Nameless Bard |
| Narfin's Inquisition Court | Landmark | zCHMolagWorld | Vigilant.esm | Knight of Julianos |
| Old Sewers | Landmark | Tamriel | Vigilant.esm | Gwaji gro-Agnam, Joshua |
| Ossuary | Landmark | zCHMolagWorld | Vigilant.esm | Black Hand |
| Rusty Blacksmith | Landmark | zCHMolagWorld | Vigilant.esm | Blacksmith Tubal |
| Sancremor Ceysel | Landmark | zCHMolagWorld | Vigilant.esm | Daedroth Battlelord, Dregas the Foolkiller, Dremora Lord |
| Sancremor Nagasel | Landmark | zCHMolagWorld | Vigilant.esm | Alessia, Volar the Deathbringer |
| Sard's Charnel | Landmark | zCHMolagWorld | Vigilant.esm | Bone Strider |
| Sard's Ossuary | Landmark | zCHMolagWorld | Vigilant.esm | Melus Petilius |
| Slums | Landmark | zCHMolagWorld | Vigilant.esm | Beggar Chief |
| St. Dulsa's Charnel | Landmark | zCHMolagWorld | Vigilant.esm | Adabal |
| Temple of Stendarr | DaedricShrine | zCHMolagWorld | Vigilant.esm | Bounty: Chick Trader, Empty Cells |
| Throne of Order | Landmark | zCHMolagWorld | Vigilant.esm | Jyggalag |
| Ultar's Charnel | Landmark | zCHMolagWorld | Vigilant.esm | Count Lead, Countess Tarla |
| Varla's Hall | Landmark | zCHMolagWorld | Vigilant.esm | Belharza's Royal Guard, Maril, Umar |
| Windhelm Dungeon | Landmark | Windhelm | Vigilant.esm | Empty Cells |
| Wallside Inn | Inn | Windhelm | WindhelmSSE.esp | Dumburz, Ingjar |
| Cragwater Cavern | Camp | WyrmstoothWorld | Wyrmstooth.esp | Donnar, Gundlof Windsinger, Hagraven |
| Granite Hill | Town | Tamriel | aaaGraniteHill.esp | Aisha, Alex, Jennifer |
| Attius Farm Location | Landmark | DLC2SolstheimWorld | ccasvsse001-almsivi.esm | March of the Dead |
| The Pit | ImperialTower | Falkreath | cckrtsse001_altar.esl | The Pit |
| Honrich Lake Cave | Cave | Tamriel | evgSIRENROOT.esm | Deluge of Deceit |
| Gomgralmaulgr Cave | Cave | Tamriel | mihailseagiants.esp | Grahl, Grahl Matron, Half-Giant Frostcaller |
| Riften Ratway | Landmark | Riften | unofficial skyrim creation club content patch.esl | A Soul Divided, Bow to the Master, Fists of Fury - The Rift |

### Named by a quest, a home or a book, and found on no map and in no town (76)

Not places: their interiors reach no map by any door (holding cells, storage and test cells, Apocrypha, Sovngarde, Meridia's realm, Vigilant's rooms). The quest data still names them.

| Location | Plugin | Why |
|---|---|---|
| 00NaomiHoldingCell | 00Taliesin.esp | no position |
| Abyss of Molag Bal | Vigilant.esm | no position |
| Actor Room | Vigilant.esm | no position |
| Aetherial Armory | LegendsOfAetherium.esp | no position |
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
| Azura Voice Cell | Skyrim.esm | no position |
| Azura's Star Interior | Requiem.esp | no position |
| Basement | Vigilant.esm | no position |
| Blood Curse of Chains | Vigilant.esm | no position |
| Blood Curse of Corruption | Vigilant.esm | no position |
| Blood Curse of Shivers | Vigilant.esm | no position |
| Blood Mist Castle | Vigilant.esm | no position |
| Bloody Well | Vigilant.esm | no position |
| Bruiant Mansion | Vigilant.esm | only inside zCOBruiantWorld, which is no map |
| Burmuk's Shack | Journey to Baan Malur.esp | no position |
| Campsite | GORE.esp | no position |
| DLC1 Item Holding Cell | Dawnguard.esm | no position |
| DLC1LD Holding Cell | Dawnguard.esm | no position |
| Deep Library | Unmarked Locations Pack - All In One.esp | no position |
| Dwarven Dome | ForgottenCity.esp | no position |
| Editor Smoke Test Cell | Skyrim.esm | no position |
| Enchantress' Palace | Vigilant.esm | no position |
| Entombed | Apocalypse - Magic of Skyrim.esp | no position |
| Gravewind Depths | FalkreathShades.esp | no position |
| Hall of Heroes | Skyrim.esm | no position |
| Herrah's Catacombs | FalkreathShades.esp | no position |
| Hoarfrost Grotto | Skyrim.esm | no position |
| Honrich Aranseli | evgSIRENROOT.esm | no position |
| Honrich Atasel | evgSIRENROOT.esm | no position |
| Honrich Gardens | evgSIRENROOT.esm | no position |
| Honrich Morbalseli | evgSIRENROOT.esm | no position |
| Honrich Ruins | evgSIRENROOT.esm | no position |
| Honrich Ruins | evgSIRENROOT.esm | no position |
| Honrich Varlorsel | evgSIRENROOT.esm | no position |
| Honrich Welkeseli | evgSIRENROOT.esm | no position |
| Jail for Thistle Jail for 100 yrs | 018Auri.esp | no position |
| Japhet's Folly | Update.esm | only inside JaphetsFollyWorld, which is no map |
| Jo'vanni's Dream Theater | Vigilant.esm | no position |
| Khyth-Zel | Lucien.esp | no position |
| Khyth-Zel Sewers | Lucien.esp | no position |
| Khyth-Zel Tower | Lucien.esp | no position |
| Lamae's Catacomb | Meridia.esp | no position |
| Llethrin Fel Caverns | Journey to Baan Malur.esp | no position |
| Magic Visuals Test Hall | Skyrim.esm | no position |
| Marker Storage Unit | Skyrim.esm | no position |
| Marker Storage Unit | Triumvirate - Mage Archetypes.esp | no position |
| Master Bedroom | Meridia.esp | no position |
| Matron's Chamber | Vigilant.esm | no position |
| Old Lighthouse | Journey to Baan Malur.esp | no position |
| Old Windhelm | Vigilant.esm | no position |
| Piper Temple | Vigilant.esm | no position |
| Pryai | Journey to Baan Malur.esp | no position |
| Raven Rock Holding Cell | Dragonborn.esm | no position |
| Sancremor Angasel | Vigilant.esm | no position |
| Skyrim | evgSIRENROOT.esm | no position |
| Solitary Cell | Vigilant.esm | no position |
| Sovngarde | Skyrim.esm | no position |
| The Funhouse | Requiem - Improved Spell Learning.esp | no position |
| The Malevolent Barracks | Meridia.esp | no position |
| The Malevolent Dungeon | Meridia.esp | no position |
| The Malevolent Palace | Meridia.esp | no position |
| The Malevolent Realm | Meridia.esp | no position |
| USKP Storage | Unofficial Skyrim Special Edition Patch.esp | no position |
| Unowned Cell | Skyrim.esm | no position |
| WSN Location | Wintersun - Faiths of Skyrim.esp | no position |

### A map marker two places claimed (26)

A record that names another place's map marker as its own (Morvunskar Crypts and Bleak Falls Barrow's) does not get its position: the marker goes to the place it is named for, and the other is placed from its own cells or doors.

| Place | Claimed the marker of | Kept by |
|---|---|---|
| Abandoned Shack | Battle-Born Farm | Battle-Born Farm |
| Aeri's House | Anga's Mill | Anga's Mill |
| Arkngthamz | Chillwind Depths | Chillwind Depths |
| Chillfurrow Farm Interior | Battle-Born Farm | Battle-Born Farm |
| Cradle Stone Tower | Cliffside Retreat | Cliffside Retreat |
| Frozen Caverns | Bleakcoast Cave | Bleakcoast Cave |
| Iron Tusk Cave Location | Falkreath Watchtower | Falkreath Watchtower |
| Knifepoint Ridge | Robber's Gorge | Robber's Gorge |
| Morvunskar Crypts | Bleak Falls Barrow | Bleak Falls Barrow |
| Name TBD | Chillwind Depths | Chillwind Depths |
| Peak's Shade Tower | Bannermist Tower | Bannermist Tower |
| Pelagia Farm | Battle-Born Farm | Battle-Born Farm |
| Raldbthar | Irkngthand | Irkngthand |
| Rebel's Cairn | Red Eagle Redoubt | Red Eagle Redoubt |
| Redwater Den | Chillwind Depths | Chillwind Depths |
| Riverside Shack | Abandoned Prison | Abandoned Prison |
| Ruunvald Excavation | Chillwind Depths | Chillwind Depths |
| Sanctum of Malacath | Fallowstone Cave | Fallowstone Cave |
| Shadowgreen Cavern | Shimmermist Cave | Shimmermist Cave |
| The Aetherium Forge | Ruins of Bthalft | Ruins of Bthalft |
| The Pit | Falkreath Watchtower | Falkreath Watchtower |
| The Thief Doomstone | The Shadow Stone | The Shadow Doomstone |
| Ven Fillaan Miin | Shrine of Azura | Shrine of Azura |
| Warehouses | Alchemist's Shack | Alchemist's Shack |
| Western Watchtower | Fort Greymoor | Fort Greymoor |
| Whispering Walls Catacombs | Wisp Light Crevasse | Wisp Light Crevasse |

### Farms and mills in their fields, not inside a town (9) (WO-171)

A farm or mill whose location owns exterior cells of its own stands in a field. Its record is parented to the town's location, which read as `inTown` and left it without a pin. Its position is its door out (the farmhouse), else the middle of its field's cells; its town stays as `nearestTown`.

| Farm | Record's town | Found from | Nearest town | Position |
|---|---|---|---|---|
| Battle-Born Farm | Whiterun | door | Whiterun 0.2 km | 33889, -4967 |
| Chillfurrow Farm | Whiterun | door | Whiterun 0.2 km | 31199, -9735 |
| Hilarius Farmhouse | Markarth | door | Markarth 0.2 km | -163668, 7835 |
| Katla's Farm | Solitude | door | Solitude 0.2 km | -75489, 96293 |
| Markarth Mill Maintenance | Markarth | door | Markarth 0.2 km | -163379, 6673 |
| Merryfair Farm | Riften | door | Riften 0.2 km | 166264, -87441 |
| Pelagia Farm | Whiterun | door | Whiterun 0.2 km | 18222, -17929 |
| Salvius Farmhouse | Markarth | door | Markarth 0.1 km | -164439, 6674 |
| Solitude Sawmill | Solitude | door | Solitude 0.3 km | -78658, 91650 |

Farms that stay in their village, with no exterior cells of their own (7; each is 20 to 100 m from its town's marker): Corpselight Farm (Falkreath), Cowflop Farmhouse (Rorikstead), Fellstar Farm (Ivarstead), Gala's Stead (Kynesgrove), Herleif's and Ragna's Farm (Kynesgrove), Lemkil's Farmhouse (Rorikstead), Lod's House (Falkreath).

### Buildings outside the city's walls (3) (WO-180 Part 4a)

A location the record parents to a city, whose door opens onto Tamriel itself and not onto the city's own worldspace, stands outside the walls. It is a place of its own, put where its door is; the city stays its nearest town, and its people are not the city's.

| Place | Record's city | Found from |
|---|---|---|
| Honningbrew Meadery | Whiterun | door |
| Honningbrew Meadery | Whiterun | door |
| Whiterun Stables | Whiterun | door |

Buildings whose door opens on Tamriel too, left inside their city until Bob rules (56): Aksels House (Solitude), Angeline's Aromatics (Solitude), Argonian Assemblage (Windhelm), Black-Briar Lodge (Riften), Black-Briar Meadery (Riften), Clan Shatter-Shield Offices (Windhelm), Daighre's House (Markarth), Digitus Quintus' House (Solitude), Dockmaster's Home (Windhelm), Dorte's Cabin (Solitude), East Empire Company (Windhelm), East Empire Company Outpost (Riften), Esbern's Vault (Riften), Freyja's House (Solitude), Guard Tower (Whiterun), Gunnar's Cabin (Solitude), Hjoldan's House (Solitude), Honeyside (Riften), Jo'vanni's Dream Theater (Whiterun), Kodraug's Cabin (Solitude), Laurircella's Cabin (Solitude), Markarth East Empire Dormitory (Markarth), Markarth East Empire Goods (Markarth), Markarth Old Observatory (Markarth), Markarth Stables (Markarth), Markarth Waste Collector (Markarth), Naspis' Cabin (Solitude), New Gnisis Cornerclub (Windhelm), Old Dam (Markarth), Oyalf's Cabin (Solitude), Qrvar's Cabin (Solitude), Ratway Arena (Riften), Riften Fishery (Riften), Riften Jail (Riften), Riften Ratway (Riften), Riften Stables (Riften), Riften Warehouse (Riften), Shack (Windhelm), Skaggi's House (Markarth), Soderberg's House (Riften), Solitude Stables (Solitude), Sverre's Cabin (Solitude), Tahlen-Ra's House (Solitude), The Katariah (Solitude), The Leaning Cabin (Solitude), The Pawned Prawn (Riften), The Ragged Flagon (Riften), The Roadhouse (Whiterun), Thieves Guild Headquarters (Riften), Tilda's House (Solitude), Torbec's House (Solitude), Toril's House (Solitude), Understone Keep (Markarth), Wallside Inn (Windhelm), Whiterun Underforge (Whiterun), Windhelm Stables (Windhelm).

### Called by the name on the door (31) (WO-171)

A house, shop or inn whose location has one interior cell name, and that name is not the record's, takes the cell's (what the game shows on the door); the record's name is kept as an alias where it is two words or more and no other place's.

| Record's name | The door's | Kind |
|---|---|---|
| Blacksmith | The Scorched Hammer | Store |
| Chayim's House | Chayim and Euthymia's House | House |
| Dengeir's Hall | Dengeir's House | House |
| Emma's and Olafr's House | Emma's and Erik's House | House |
| Erundil's House | Erundil's Shack | House |
| Fine-Hair's House | Fine-Hair's Home | House |
| Gravekeeper's House | Sexton's House | House |
| Gray Pine Luxuries | Gray Pine Goods | Store |
| Gundrud's Family House | Gundrud Family House | House |
| Gunnar's Cabin | Gunnarr's Cabin | House |
| Hall of Runes | Winterhold Library | Store |
| Herleif's and Ragna's Farm | Herleif and Ragna's Farm | House |
| Home of Thane Alarik | House of Thane Alarik | House |
| Home of Thane Hearth-Healer | Hearth-Healer's Hall | House |
| Home of Thane Skjorta | House of Thane Skjorta | House |
| Home of Thane Valdemaar | House Steel-Arm | House |
| House of Clan Snow-Shod | Snow-Shod Manor | House |
| Karhwasten Hall | Karthwasten Hall | House |
| Korri's House | Kraldar's House | House |
| Lucan's Dry Goods | Riverwood Trader | Store |
| Maddock's House | The Trusty Witch | House |
| Magnar's House | House of Clan Frost-Vein | House |
| Mathendi's Magics and Imports | Mathendi's Magic and Imports | Store |
| Ranmir's House | Birna's Oddments | House |
| Skaal Village Deor's House | Deor Woodcutter's House | House |
| Sven's House | Sven and Hilde's House | House |
| The Bakeship Valand | The Bakeshop Valand | Store |
| The Hermit | The Handsome Hermit | Building |
| Tilda's House | Tilda's Home | Building |
| Whiterun Underforge | The Underforge | Building |
| Wilhelm's Winter Wares | Wilhelm's Winter Warehouse | Store |

Left as the record has them:

| Record's name | The door's | Why |
|---|---|---|
| Frederik's Farm | Frederik's House | a farm stays a farm: the door is its house |
| Jakob's Farm | Jakob's House | a farm stays a farm: the door is its house |
| Riften Mercer's House | Riftweald Manor | another place's name holds it (Riftweald Manor Player Home) |

26 more differ only in that one name holds the other (a town's name dropped from the front, a leading "The"): left as they are.

### Low actors that are not the place's fight (32) (WO-176)

A place whose records show only actors of level 3 or less (any number), and whose own zone has a higher minimum or whose war garrison comes later; or a town whose people, animals and guards reach no higher than level 6: its levels are not given (not checked yet), not read as "1 to 2".

| Place | Hold | Actors | Read as | Why dropped |
|---|---|---|---|---|
| Anga's Mill | The Pale | 11 | 1 to 3 | a town's residents, animals and guards are not a fight |
| Angi's Camp | Falkreath | 1 | 1 to 1 | its zone's minimum is 12 |
| Darkwater Pass | The Rift | 3 | 1 to 2 | its zone's minimum is 18 |
| Dragon Bridge | Haafingar | 1 | 1 to 1 | a town's residents, animals and guards are not a fight |
| Fort Amol | Eastmarch | 2 | 1 to 2 | its zone's minimum is 6 |
| Fort Greenwall | The Rift | 2 | 1 to 1 | its zone's minimum is 6 |
| Fort Neugrad | Falkreath | 1 | 1 to 2 | its zone's minimum is 6 |
| Fort Snowhawk | Hjaalmarch | 1 | 3 to 3 | the war puts its garrison there later |
| Frostskarn Vault |  | 2 | 1 to 1 | its zone's minimum is 15 |
| Headwaters of Harstrad | Solstheim | 3 | 1 to 2 | its zone's minimum is 25 |
| Hrothmund's Barrow | Solstheim | 2 | 1 to 2 | its zone's minimum is 10 |
| Imperial Military Camp | The Rift | 1 | 1 to 2 | the war puts its garrison there later |
| Imperial Military Camp | Whiterun | 2 | 1 to 2 | the war puts its garrison there later |
| Ivarstead | The Rift | 18 | 1 to 3 | a town's residents, animals and guards are not a fight |
| Karthwasten | The Reach | 9 | 1 to 6 | a town's residents, animals and guards are not a fight |
| Meeko's Shack | Hjaalmarch | 1 | 1 to 1 | its zone's minimum is 6 |
| MerchantLocations |  | 2 | 1 to 1 | its zone's minimum is 8 |
| Moss Mother Cavern | Falkreath | 1 | 1 to 2 | its zone's minimum is 8 |
| Northwind Mine | The Rift | 6 | 1 to 2 | its zone's minimum is 12 |
| Rimewind Grotto | Hjorkvild Isles | 4 | 1 to 1 | its zone's minimum is 6 |
| Riverwood | Whiterun | 27 | 1 to 4 | a town's residents, animals and guards are not a fight |
| Rorikstead | Whiterun | 24 | 1 to 3 | a town's residents, animals and guards are not a fight |
| Shor's Stone | The Rift | 8 | 1 to 3 | a town's residents, animals and guards are not a fight |
| Skaal Village | Solstheim | 2 | 1 to 3 | a town's residents, animals and guards are not a fight |
| Sons of Skyrim Military Camp | Hjaalmarch | 1 | 1 to 2 | the war puts its garrison there later |
| Sons of Skyrim Military Camp | The Pale | 1 | 1 to 2 | the war puts its garrison there later |
| Sons of Skyrim Military Camp | The Reach | 2 | 1 to 2 | the war puts its garrison there later |
| Sons of Skyrim Military Camp | The Rift | 1 | 1 to 2 | the war puts its garrison there later |
| Sons of Skyrim Military Camp | Winterhold | 1 | 1 to 2 | the war puts its garrison there later |
| Whitestream Den | Whiterun | 7 | 1 to 3 | its zone's minimum is 10 |
| Windward Ruins | The Pale | 2 | 1 to 1 | its zone's minimum is 5 |
| Wisp Light Crevasse |  | 1 | 1 to 1 | its zone's minimum is 15 |

### Taken off Tamriel's map: another plane (1) (WO-178)

The door search gave these a position in Tamriel (where the door out of the plane opens); they are not there.

| Place | World | The position the door search gave it |
|---|---|---|
| Soul Cairn | Tamriel | -169242, 149956 |

### "Interior" dropped from a name (2) (WO-171, second review)

| Record's name | Called |
|---|---|
| Chillfurrow Farm Interior | Chillfurrow Farm |
| Sarethi Farm Interior | Sarethi Farm |

### Farms and mills typed Farm and Mill, not House (28) (WO-171, second review)

By the LocTypeFarm or LocTypeLumberMill keyword, else the name's word (farm, farmhouse; mill, sawmill) on a house or building.

| Place | Was | Now |
|---|---|---|
| Battle-Born Farm | House | Farm |
| Brandy-Mug Farm | House | Farm |
| Chalureel Farm | House | Farm |
| Chillfurrow Farm | House | Farm |
| Corpselight Farm | Building | Farm |
| Cowflop Farmhouse | Building | Farm |
| Fellstar Farm | House | Farm |
| Frederik's Farm | House | Farm |
| Gala's Stead | House | Farm |
| Half-Moon Mill | House | Mill |
| Heartwood Mill | House | Mill |
| Herleif and Ragna's Farm | House | Farm |
| Hilarius Farmhouse | House | Farm |
| Hlaalu Farm | House | Farm |
| Hollyfrost Farm | House | Farm |
| Jakob's Farm | House | Farm |
| Katla's Farm | House | Farm |
| Leif's and Kyne's Farm | House | Farm |
| Lemkil's Farmhouse | Building | Farm |
| Lod's House | Building | Farm |
| Loreius Farmhouse | House | Farm |
| Markarth Mill Maintenance | House | Mill |
| Merryfair Farm | House | Farm |
| Pelagia Farm | House | Farm |
| Salvius Farmhouse | House | Farm |
| Sarethi Farm | House | Farm |
| Snow-Shod Farm | House | Farm |
| Solitude Sawmill | Building | Mill |

### Names the words use that the record doesn't (51)

A different way of writing a place's name (a possessive, a hyphen, a leading "The" dropped) that the game's own dialogue, books or quest names really use and no other place has. Two words or more. `aliases` on the place; the linker finds it by these too.

| Place | Also written |
|---|---|
| Birna's Oddments | Ranmir's House |
| Black-Briar Manor | Black Briar Manor |
| Black-Briar Meadery | Black Briar Meadery |
| Bryling's House | Bryling House |
| Chayim and Euthymia's House | Chayim's House |
| Dengeir's House | Dengeir's Hall |
| Deor Woodcutter's House | Skaal Village Deor's House |
| Eldergleam Sanctuary | Eldergleam's Sanctuary |
| Emma's and Erik's House | Emma's and Olafr's House |
| Erikur's House | Erikur House |
| Erundil's Shack | Erundil's House |
| Fine-Hair's Home | Fine-Hair's House |
| Gray Pine Goods | Gray Pine Luxuries |
| Gundrud Family House | Gundrud's Family House |
| Gunnarr's Cabin | Gunnar's Cabin |
| Half-Moon Mill | Half Moon Mill |
| Hearth-Healer's Hall | Home of Thane Hearth-Healer |
| Herleif and Ragna's Farm | Herleif's and Ragna's Farm |
| House Steel-Arm | Home of Thane Valdemaar |
| House of Clan Frost-Vein | Magnar's House |
| House of Thane Alarik | Home of Thane Alarik |
| House of Thane Skjorta | Home of Thane Skjorta |
| Karthwasten Hall | Karhwasten Hall |
| Kraldar's House | Korri's House |
| Mathendi's Magic and Imports | Mathendi's Magics and Imports |
| Riverwood Trader | Lucan's Dry Goods |
| Sexton's House | Gravekeeper's House |
| Silver-Blood Inn | Silver Blood Inn |
| Snow-Shod Manor | House of Clan Snow-Shod |
| Sven and Hilde's House | Sven's House |
| The Aetherium Forge | Aetherium Forge |
| The Bakeshop Valand | The Bakeship Valand |
| The Bannered Mare | Bannered Mare |
| The Blue Palace | Blue Palace |
| The Frozen Hearth | Frozen Hearth |
| The Handsome Hermit | The Hermit |
| The Mortar and Pestle | Mortar and Pestle |
| The Pawned Prawn | Pawned Prawn |
| The Ragged Flagon | Ragged Flagon |
| The Retching Netch | Retching Netch |
| The Scorched Hammer | Scorched Hammer |
| The Spiced Yam | Spiced Yam |
| The Trusty Witch | Maddock's House |
| The Underforge | Whiterun Underforge |
| The White Hall | White Hall |
| The White Phial | White Phial |
| The Winking Skeever | Winking Skeever |
| Tilda's Home | Tilda's House |
| Wilhelm's Winter Warehouse | Wilhelm's Winter Wares |
| Winterhold Library | Hall of Runes |
| Yngol Barrow | Yngol's Barrow |

### Listed twice or left over, now out (31)

| Name | Editor id | Why | Kept as |
|---|---|---|---|
| Al Shedim | manny_GF_L_AlShedimDungeon | the same place as the entry kept: inside it | manny_GF_L_AlShedim |
| Angeline's Aromatics | SolitudeSwampsideApothecaryLocationTGCoS | the same place as the entry kept: the same name in the same town | SolitudeAngelinesAromaticsLocation |
| Bloodworks | 0WHWindhelmBloodworksLocation | the same place as the entry kept: the same name in the same town | WindhelmBloodworksLocation |
| Bonestrewn Crest | DragonMound02LocationUNUSED | a demo or cut-content leftover (its editor id or name says so) | (nothing) |
| Bruiant Mansion South Wing | zzzCOLocBruiantMansionBE | the same place as the entry kept: the same spot | zzzCOLocBruiantMansionSouth |
| Castle Volkihar | DLC1VampireCastleDungeonLocation | the same place as the entry kept: inside it | DLC1VampireCastleLocation |
| Dormitory | WinterholdCollegeDormitory2Location | the same place as the entry kept: the same name in the same town | WinterholdCollegeDormitoryLocation |
| Doughlas House | OldHroldanTobiasHouseLocationTGCoOH | the same place as the entry kept: the same spot | OldHroldanDoughlasHouseLocationTGCoOH |
| Dungeon | zzzAoMLocTemplePriosn | a template location: a bare common noun for a kind of place, and no marker of its own on the map | (nothing) |
| E3 Bleak Falls Barrow | E3DemoBleakFallsBarrowLocation | a demo or cut-content leftover (its editor id or name says so) | (nothing) |
| Fort Valus | WTFortValusLocationInterior | the same place as the entry kept: inside it | WTFortValusLocation |
| Goldenhills Plantation | ccVSVSSE004_FarmInteriorLocation | the same place as the entry kept: inside it | ccVSVSSE004_FarmExteriorLocation |
| Helgen | AP_HelgenInteriors | the same place as the entry kept: inside it | HelgenLocation |
| Honningbrew Meadery | WhiterunHonningbrewMeaderyInteriorLocation | the same place as the entry kept: the same map marker | WhiterunHonningbrewMeaderyDungeonLocation |
| Jorrvaskr | WhiterunJorrvaskrBasementLocation | the same place as the entry kept: inside it | WhiterunJorrvaskrLocation |
| Kynesgrove | KynesgroveFarmsLocationTGCoKG | the same place as the entry kept: inside it | KynesgroveLocation |
| Name TBD | DLC1HunterRadiantDungeonLocation | a demo or cut-content leftover (its editor id or name says so) | (nothing) |
| Nenyond's Underground Priory | zzzCHLocPrioryNenyond01 | the same place as the entry kept: inside it | zzzCHDistrictPrioryNenyond |
| Nightgate Inn | NightgateInnLocation | the same place as the entry kept: inside it | NightgateInnExteriorLocation |
| Sancre Tor | manny_GF_L_SancreTorA | the same place as the entry kept: inside it | manny_GF_L_SancreTor |
| Sancre Tor | manny_GF_L_SancreTorB | the same place as the entry kept: inside it | manny_GF_L_SancreTor |
| Sancre Tor | manny_GF_L_SancreTorC | the same place as the entry kept: inside it | manny_GF_L_SancreTor |
| Sancre Tor | manny_GF_L_SancreTorD | the same place as the entry kept: inside it | manny_GF_L_SancreTor |
| Silorn's Priory | zzzCHLocPriorySilorn | the same place as the entry kept: inside it | zzzCHDistrictPriorySilorn |
| Slums | zzzCHLocSlumToSewer | the same place as the entry kept: the same map marker | zzzCHLocSlum02 |
| Temple of Stendarr | zzzAoMLocDebugRoom | the same place as the entry kept: the same map marker | zzzAoMLocTempleOfStendarr |
| Thalmor Embassy | 0WHThalmorEmbassyLocation | the same place as the entry kept: the same map marker | ThalmorEmbassyLocation |
| Throat of the World | MQ206Location | the same place as the entry kept: the same map marker | ThroatoftheWorldLocation |
| Watchtower | zzzCHLocWfWatchTower | the same place as the entry kept: the same map marker | zzzCHLocMGWatchTower |
| Wellspring Cave | zzzCHSubLocWellspringCave01 | the same place as the entry kept: inside it | zzzCHLocWellspringCave |
| Yngol Barrow | ccASVSSE001_TempleLocation | the same place as the entry kept: the same map marker | YngolBarrowLocation |

### One name, different places, all kept (8 names)

Never in the same town or at the same spot: eight Imperial camps, one in each hold; a Hall of the Dead in each of three cities.

| Name | Places | Where |
|---|---|---|
| Cragwater Cavern | 2 | Wyrmstooth; Wyrmstooth |
| Hall of Kyne | 2 | Ivarstead; Kynesgrove |
| Hall of the Dead | 4 | Markarth; Riften; Solitude; Whiterun |
| Imperial Military Camp | 8 | Eastmarch; Falkreath; Hjaalmarch; The Pale; The Reach; The Rift; Whiterun; Winterhold |
| Jarl's Longhouse | 2 | Falkreath; Winterhold |
| Shrine of Talos | 2 | Markarth; Whiterun |
| Sons of Skyrim Military Camp | 8 | Falkreath; Haafingar; Hjaalmarch; The Pale; The Reach; The Rift; Whiterun; Winterhold |
| The Pit | 2 | Alik'r Desert; Falkreath |
