# The places index (WO-128 Part 1, WO-144 Part 1)

Written by `scripts/gamedata/places.py` from the winning records across the load order (with the Creation Club plugins). Clear and discovery XP from `LoreRim - MCM and INI Settings`'s Experience.ini.

**998 places.** 418 have a pointer (a line or a book that names them), 386 have a quest that goes there, and 435 have neither.

## The nine capitals

Found by name and the CWCapital keyword: Dawnstar, Falkreath, Markarth, Morthal, Riften, Solitude, Whiterun, Windhelm, Winterhold.
All nine found with an exterior position.

## By type

| Type | Places | With a pointer | With a quest |
|---|---|---|---|
| House | 203 | 16 | 27 |
| Landmark | 155 | 44 | 79 |
| Cave | 107 | 61 | 48 |
| NordicRuin | 54 | 42 | 34 |
| Store | 51 | 21 | 20 |
| Fort | 46 | 39 | 29 |
| Shack | 31 | 6 | 7 |
| Inn | 29 | 20 | 16 |
| DragonLair | 28 | 9 | 1 |
| Building | 25 | 5 | 6 |
| DwemerRuin | 24 | 17 | 19 |
| Mine | 19 | 11 | 7 |
| Camp | 16 | 11 | 8 |
| Town | 15 | 15 | 9 |
| ImperialTower | 14 | 6 | 5 |
| Temple | 14 | 12 | 7 |
| GiantCamp | 13 | 12 | 0 |
| Guild | 13 | 8 | 8 |
| NordicDwelling | 12 | 4 | 1 |
| NordicTower | 12 | 6 | 3 |
| PlayerHouse | 12 | 11 | 5 |
| Doomstone | 11 | 0 | 1 |
| City | 10 | 0 | 10 |
| Altar | 10 | 4 | 4 |
| DaedricShrine | 9 | 2 | 3 |
| Keep | 9 | 9 | 7 |
| Shipwreck | 9 | 4 | 1 |
| Grove | 7 | 4 | 1 |
| Pass | 5 | 1 | 1 |
| Stables | 5 | 1 | 0 |
| Barracks | 5 | 1 | 3 |
| Jail | 5 | 3 | 5 |
| Clearing | 4 | 1 | 1 |
| OrcStronghold | 4 | 4 | 4 |
| Lighthouse | 4 | 2 | 1 |
| Settlement | 4 | 4 | 3 |
| Castle | 4 | 2 | 2 |

## By hold

| Hold | Places | With a pointer | With a quest |
|---|---|---|---|
| (none) | 166 | 46 | 63 |
| The Rift | 97 | 53 | 37 |
| Eastmarch | 96 | 40 | 32 |
| Whiterun | 95 | 42 | 35 |
| The Reach | 94 | 43 | 40 |
| Haafingar | 86 | 29 | 26 |
| Falkreath | 65 | 35 | 28 |
| Solstheim | 64 | 25 | 36 |
| The Pale | 55 | 27 | 23 |
| Winterhold | 52 | 26 | 27 |
| Hjaalmarch | 44 | 19 | 14 |
| Wyrmstooth | 30 | 16 | 9 |
| Alik'r Desert | 29 | 9 | 10 |
| Morrowind | 15 | 7 | 4 |
| Hjorkvild Isles | 10 | 1 | 2 |

## Positions (WO-166)

**660 of 998 places have a position**; 328 are in a town and have none of their own (`inTown`); 10 could not be placed. A position is `world` and `pos` [x, y, z] in game units, found from the place's own map marker, else the exterior cells it owns (the middle of their grid squares: no height, z is null), else a door out of its interior (up to 3 rooms deep). The five big cities' own worldspaces share Tamriel's coordinates (checked door to door) and are filed as Tamriel.

| Found from | Places |
|---|---|
| marker | 469 |
| door | 147 |
| cells | 44 |

| World | Places | On a map |
|---|---|---|
| Tamriel | 450 | yes |
| DLC2SolstheimWorld | 71 | yes |
| zCHMolagWorld | 58 | yes |
| mannyGFDesert | 32 | yes |
| WyrmstoothWorld | 25 | yes |
| BSKHyorkerIsle | 10 | yes |
| ECSSShiveringIsles | 8 | yes |
| ksws07World | 4 | yes |
| NecroDragontailMountains | 1 | no (a pocket world: coordinates mean nothing on a map) |
| ksws07Dungeon02World | 1 | no (a pocket world: coordinates mean nothing on a map) |

### Not placed, and why

| Why | Places | Types |
|---|---|---|
| interior cells whose doors lead nowhere onto a map (looked 3 rooms deep) | 4 | Landmark, NordicRuin |
| interior cells with no door at all | 3 | Cave, Landmark, Shack |
| no cells: a location nothing is placed in | 3 | Cave, Doomstone, Landmark |

| Place | Type | Plugin | Why |
|---|---|---|---|
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

### Added because a quest, a person's home or a book names them (442)

Every location a named quest points at (a location alias, or the cell a forced reference stands in), a person's home (their first placed cell, people_raw.json) or a book is read or found in (book_places.json) that no place of the index covers, whatever it is, with a `kind` from its keywords (then its name's word): not a hold, a capital, a demo leftover or a name no map and no town holds. A town or city never covers what is inside it. A room inside another added place is part of it unless two quests name it. What is inside a town has `inTown` and no position; the rest needs one on a map. 48 are cells of no location at all (Green-Tip Cabin), a place of their own keyed by the cell.

| Named by | Places |
|---|---|
| homes | 305 |
| homes + quests | 96 |
| quests | 41 |

| Kind | Added | In a town | On a map |
|---|---|---|---|
| House | 203 | 168 | 35 |
| Landmark | 84 | 10 | 74 |
| Store | 51 | 43 | 8 |
| Building | 25 | 21 | 4 |
| PlayerHouse | 12 | 6 | 6 |
| Fort | 8 | 2 | 6 |
| Shack | 8 | 0 | 8 |
| Town | 7 | 0 | 7 |
| Barracks | 5 | 4 | 1 |
| Jail | 5 | 5 | 0 |
| Mine | 5 | 2 | 3 |
| Cave | 4 | 0 | 4 |
| Castle | 4 | 4 | 0 |
| Camp | 3 | 0 | 3 |
| Settlement | 3 | 0 | 3 |
| DwemerRuin | 2 | 0 | 2 |
| Shipwreck | 2 | 1 | 1 |
| Inn | 2 | 1 | 1 |
| NordicRuin | 1 | 0 | 1 |
| NordicTower | 1 | 0 | 1 |
| NordicDwelling | 1 | 0 | 1 |
| Altar | 1 | 0 | 1 |
| Grove | 1 | 0 | 1 |
| City | 1 | 0 | 1 |
| DaedricShrine | 1 | 0 | 1 |
| Lighthouse | 1 | 0 | 1 |
| Guild | 1 | 1 | 0 |

| Plugin | Added |
|---|---|
| Skyrim.esm | 74 |
| Vigilant.esm | 43 |
| Unofficial Skyrim Special Edition Patch.esp | 26 |
| RedBag's Solitude.esp | 23 |
| WindhelmSSE.esp | 20 |
| ForgottenCity.esp | 18 |
| Gray Fox Cowl.esm | 15 |
| SurWR.esp | 15 |
| Dragonborn.esm | 13 |
| GORE.esp | 11 |
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
| Soul Cairn | Landmark | Tamriel | 00Taliesin.esp | Beyond Death, Call Those NPCs, Chapel of Love |
| Ancient Ruins | Landmark | mannyGFDesert | BetalillesHammerfellQuestBundle.esp | The Silent Sword |
| Ash'abah Hideout | Landmark | mannyGFDesert | BetalillesHammerfellQuestBundle.esp | Honai, Nimshat |
| Ben Erai | Town | mannyGFDesert | BetalillesHammerfellQuestBundle.esp | Deliver a Letter Distant, Deliver a Letter Medium, Deliver a Letter Near |
| Forgotten City | Settlement | mannyGFDesert | BetalillesHammerfellQuestBundle.esp | The Library Lost to the Ages, Weltan the Poet |
| Salas Kazas | Town | mannyGFDesert | BetalillesHammerfellQuestBundle.esp | Behsharah, Daliah, Sharza |
| Goldenhills Plantation | Landmark | Tamriel | CC Farming - Tweaks and Enhancements.esp | The Unquiet Dead |
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
| Campsite | Camp | Tamriel | GORE.esp | Gore |
| Dark Brotherhood Sanctuary | Town | Tamriel | GORE.esp | BCSLL Vendor Quest, Death Incarnate, Destroy the Dark Brotherhood! |
| Dayspring Canyon | Landmark | Tamriel | GORE.esp | Dawnguard, Destroying the Dawnguard |
| Esbern's Vault | Landmark | Riften | GORE.esp | A Cornered Rat, Champion's Choice, MQ Reserved Locations |
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
| Dawnstar Sanctuary | Town | Tamriel | Lux.esp | A Nest of Vipers, The Dark Brotherhood Forever |
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
| Nightgate Inn | Inn | Tamriel | Skyrim.esm | A False Front, BCSLL Vendor Quest, Recipe for Disaster |
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
| Dungeon | Landmark | Tamriel | Vigilant.esm | Sacred Anatomancer |
| Emperor Gorieus' Charnel | Landmark | zCHMolagWorld | Vigilant.esm | Emperor Gorieus, Gallant Specter of Emperor Gorieus |
| Fort Verin | Fort | zCHMolagWorld | Vigilant.esm | Vernaccus |
| Fountain Garden of Dibella | Landmark | zCHMolagWorld | Vigilant.esm | Sir Gregory, Sir Henrik, Sir Juncan |
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
| Honrich Lake Cave | Cave | Tamriel | evgSIRENROOT.esm | Deluge of Deceit |
| Gomgralmaulgr Cave | Cave | Tamriel | mihailseagiants.esp | Grahl, Grahl Matron, Half-Giant Frostcaller |

### Named by a quest, a home or a book, and found on no map and in no town (83)

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
| DLC1 Item Holding Cell | Dawnguard.esm | no position |
| DLC1LD Holding Cell | Dawnguard.esm | no position |
| DLC2 WarehouseSpiders | Dragonborn.esm | no position |
| Deep Library | Unmarked Locations Pack - All In One.esp | no position |
| Dremora Shop Location | Dragonborn.esm | no position |
| Dwarven Dome | ForgottenCity.esp | no position |
| Editor Smoke Test Cell | Skyrim.esm | no position |
| Enchantress' Palace | Vigilant.esm | no position |
| Entombed | Apocalypse - Magic of Skyrim.esp | no position |
| Gravewind Depths | FalkreathShades.esp | no position |
| Hall of Heroes | Skyrim.esm | no position |
| Herrah's Catacombs | FalkreathShades.esp | no position |
| Hidden Room | Vigilant.esm | no position |
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
| Service Room - Get off from here! | Gray Fox Cowl.esm | no position |
| Skyrim | evgSIRENROOT.esm | no position |
| Solitary Cell | Vigilant.esm | no position |
| Sovngarde | Skyrim.esm | no position |
| TestPrvtI | PrvtIRoyalArmory.esp | no position |
| The Funhouse | Requiem - Improved Spell Learning.esp | no position |
| The Malevolent Barracks | Meridia.esp | no position |
| The Malevolent Dungeon | Meridia.esp | no position |
| The Malevolent Palace | Meridia.esp | no position |
| The Malevolent Realm | Meridia.esp | no position |
| USKP Storage | Unofficial Skyrim Special Edition Patch.esp | no position |
| Unowned Cell | Skyrim.esm | no position |
| WSN Location | Wintersun - Faiths of Skyrim.esp | no position |
| Warehouse Carry | Skyrim.esm | no position |
| Warehouse Prefabs | Skyrim.esm | no position |
| aaaMB Holding Cell | NightmarePlane.esp | no position |

### A map marker two places claimed (24)

A record that names another place's map marker as its own (Morvunskar Crypts and Bleak Falls Barrow's) does not get its position: the marker goes to the place it is named for, and the other is placed from its own cells or doors.

| Place | Claimed the marker of | Kept by |
|---|---|---|
| Abandoned Shack | Battle-Born Farm | Battle-Born Farm |
| Aeri's House | Anga's Mill | Anga's Mill |
| Arkngthamz | Chillwind Depths | Chillwind Depths |
| Chillfurrow Farm Interior | Battle-Born Farm | Battle-Born Farm |
| Cradle Stone Tower | Cliffside Retreat | Cliffside Retreat |
| Frozen Caverns | Bleakcoast Cave | Bleakcoast Cave |
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
| The Thief Doomstone | The Shadow Stone | The Shadow Doomstone |
| Ven Fillaan Miin | Shrine of Azura | Shrine of Azura |
| Warehouses | Alchemist's Shack | Alchemist's Shack |
| Western Watchtower | Fort Greymoor | Fort Greymoor |
| Whispering Walls Catacombs | Wisp Light Crevasse | Wisp Light Crevasse |

### Names the words use that the record doesn't (20)

A different way of writing a place's name (a possessive, a hyphen, a leading "The" dropped) that the game's own dialogue, books or quest names really use and no other place has. Two words or more. `aliases` on the place; the linker finds it by these too.

| Place | Also written |
|---|---|
| Black-Briar Manor | Black Briar Manor |
| Black-Briar Meadery | Black Briar Meadery |
| Bryling's House | Bryling House |
| Eldergleam Sanctuary | Eldergleam's Sanctuary |
| Erikur's House | Erikur House |
| Half-Moon Mill | Half Moon Mill |
| Silver-Blood Inn | Silver Blood Inn |
| The Aetherium Forge | Aetherium Forge |
| The Bannered Mare | Bannered Mare |
| The Blue Palace | Blue Palace |
| The Frozen Hearth | Frozen Hearth |
| The Mortar and Pestle | Mortar and Pestle |
| The Pawned Prawn | Pawned Prawn |
| The Ragged Flagon | Ragged Flagon |
| The Retching Netch | Retching Netch |
| The Spiced Yam | Spiced Yam |
| The White Hall | White Hall |
| The White Phial | White Phial |
| The Winking Skeever | Winking Skeever |
| Yngol Barrow | Yngol's Barrow |

### Listed twice or left over, now out (28)

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
| E3 Bleak Falls Barrow | E3DemoBleakFallsBarrowLocation | a demo or cut-content leftover (its editor id or name says so) | (nothing) |
| Fort Valus | WTFortValusLocationInterior | the same place as the entry kept: inside it | WTFortValusLocation |
| Goldenhills Plantation | ccVSVSSE004_FarmInteriorLocation | the same place as the entry kept: inside it | ccVSVSSE004_FarmExteriorLocation |
| Helgen | AP_HelgenInteriors | the same place as the entry kept: inside it | HelgenLocation |
| Honningbrew Meadery | WhiterunHonningbrewMeaderyInteriorLocation | the same place as the entry kept: the same map marker | WhiterunHonningbrewMeaderyDungeonLocation |
| Jorrvaskr | WhiterunJorrvaskrBasementLocation | the same place as the entry kept: inside it | WhiterunJorrvaskrLocation |
| Kynesgrove | KynesgroveFarmsLocationTGCoKG | the same place as the entry kept: inside it | KynesgroveLocation |
| Name TBD | DLC1HunterRadiantDungeonLocation | a demo or cut-content leftover (its editor id or name says so) | (nothing) |
| Nenyond's Underground Priory | zzzCHLocPrioryNenyond01 | the same place as the entry kept: inside it | zzzCHDistrictPrioryNenyond |
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

### One name, different places, all kept (7 names)

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
