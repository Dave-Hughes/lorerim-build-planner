# Places and people accuracy audit (sample seed 20261030)

Auditor: Rex. Date: 2026-10-30. Staging preview read with Playwright, as a player sees it. Sources: UESP (fetched page by page; links per page below), plus a fan wiki and Nexus for mod content where UESP has nothing. Sample: 30 places and 30 people from sample.json, unchanged.

Verdicts: **right**; **wrong** (the source contradicts the page, or the page's own wording shows a reading fault); **differs-maybe-LoreRim** (differs from UESP in a way a modlist could cause); **missing** (a fact a player needs, which the source has and the page doesn't); **unknown** (the page says 'not known' or 'not sure', or I found no source for mod content). Rates are over checked fields (right + wrong + differs + missing). Unknowns are excluded and counted separately. A field that doesn't apply is left out.


## Headline

- **Places:** 6% of checked fields are wrong, and 21% are wrong or missing (159 checked fields, plus 37 unknown). Vanilla dungeons are mostly sound on kind, hold, direction and skill books. Where they fail, it is the enemy line (impossible level ceilings, generic boss names, missing Dwemer constructs), dropped treasure (word walls, store and guild skill books), and quests.
- **People:** 17% of checked fields are wrong, and 39% are wrong or missing (69 checked fields, plus 38 unknown). The "where to find" field is the worst: 40% wrong. Every one of those errors is a generic or leveled name shown as one person at one fixed place, or a town given to a wilderness cell.
- **Honesty:** 14 of 30 people pages give a player nothing usable ("Not known yet" for where, and the race as "what they are"). That is honest, but thin.
- **Generic pages:** of 9 generic or creature names in the sample, none says it is generic. Jumping Shock Spider, Goblin, Frost Troll, Mercenary, Dark Brotherhood Assassin, Imperial Commander, Imperial Battlemage, Alit and Glowing Crab are all shown as one person at one place. My recommendation: the first seven should not be person pages. Either drop them or turn them into a "creature/role" page that lists every placement and says the spawn is leveled.

## Top fault families (each one will recur across the whole dataset)

1. **One name becomes one "person", built on its best-scored row.** In `src/lib/people/data.ts`, rows that share a name are grouped (`peopleData`, and `score()` picks the base). The page then shows only the base row's cell and race. Generic names (Mercenary: 19 rows; Goblin: 19; Dark Brotherhood Assassin: 6; Shadow Merchant: 3; Frost Troll: 2) end up as one invented individual at one place. For example, Dark Brotherhood Assassin shows only the Hag's End corpse and hides the 5 Dawnstar Sanctuary placements. Likely cause: people.json has no generic or leveled flag (template or leveled-list actors, or more than N placements), so the page can't say "found in many places". Pages hit: Mercenary, Goblin, Dark Brotherhood Assassin, Frost Troll, Shadow Merchant, Alit, Imperial Battlemage, Imperial Commander.
2. **`inTown` given to wilderness and destroyed places, then rendered as "Lives in <town>".** Goblin's data cell is Gromm's Pass, yet the page says "Lives in Riften". Imperial Battlemage "Lives in Helgen". Likely cause: in `scripts/gamedata/people.py`, inTown comes from a location parent or encounter-zone chain, and the page template words any inTown as a home.
3. **Editor and record words reach players.** Examples: cell "DLC2 WarehouseSpiders" (a developer test cell); race "Arpen Buro Race", "Elder" (Skyrim's old-age race record), "Snow Troll", "Skeletal Ancient Assassin"; the place name "Dormitory" for the College's Hall of Attainment, which has no page under its in-game name. Likely cause: race and cell names pass straight through. The WO-180 rule only blanks races whose names look like IDs; records with readable but non-player names get through.
4. **Sex taken from the base record, not the template.** Moira (a hagraven, female on UESP) is "he". Data also has Hjorunn male (UESP: female) and Sybilla male. Likely cause: the NPC_ female flag is read without following a template that has Use Traits set. Absent the flag, the record reads as male.
5. **Role and service badges read from faction membership.** Examples: Neloth's badge is "Farmer" (role `JobFarmer` in people.json). At Whiterun, Mikael and Saadia are tagged "Rents rooms", Carlotta "general goods" (UESP: food and drink), and Eorlund's shop is placed at House Gray-Mane (UESP: the Skyforge). Geldis Sadri is "general goods"; Kharag is "Follower". Trainers are missed: Neloth's Enchanting (Master), and 5 of Whiterun's 9 trainers (the Companions: Aela, Njada, Athis, Farkas, Vilkas). Likely cause: `ROLE_WORDS` maps Job* factions to badges, and `sells`/`follower` come from faction flags such as PotentialFollowerFaction or an inn faction. Trainer detection misses trainers gated by conditions (Companions membership) and ones without a trainer class.
6. **Danger numbers straight from leveled lists and encounter zones.** Borogove shows "Level 1 to 18000" and Borogove Outgrabe "4 to 18000"; uncapped leveled-list ceilings are printed as levels. Southfringe Sanctum shows "1 in all" Necromancers with a boss named "Spellsword" (UESP: Bashnag and a spellsword coven). Dwarven automatons and centurions are missing at Mzulft and Shimmermist, and the wispmother at Frostmere. Lost Prospect shows "Enemies" with no type. Likely cause: `actors.livesHere`/`alsoHere` come from faction or keyword families that don't cover constructs or wispmothers, the ceiling isn't capped, and the boss name is read from the leveled base's class name.
7. **Templates drop data the JSON already has.** Examples: the word wall Ice Form at Frostmere (in places.json `worthGoingFor.wordWall`, not rendered); skill books on store, guild and city pages (Sadri's 2920 Second Seed, Dormitory's 3 books, Whiterun's Aevar Stone-Singer); residents on guild pages (Dormitory: 15 actors, none listed). Likely cause: the place page picks sections by `type`, and dungeon-only sections (worth going for, word wall) aren't shown for Store/Guild/City.
8. **Place-to-quest links are thin and sometimes wrong.** "On Hogithum ('A fragment')", a book-fragment record, is shown as a quest that brings you to Frostmere. The Dormitory lists quests whose givers live elsewhere (Mathis Valen at the Silver-Blood Inn, Initiate Garin at Meridia's Sanctum) and misses the Hall of Attainment's own. Vanilla dungeon quests are missing (The Savior of Selveni Nethri at Southfringe, Liar's Retreat's Longhammer quest). Whiterun lists no quests at all (UESP: 10 start there). Likely cause: places.json `quests` is filled from quest-alias or giver location matches and includes non-quest QUST records, with no objective-target pass.
9. **Places outside Tamriel have no realm, no "where" and no map.** Affected: Borogove and Borogove Outgrabe (Shivering Isles), Lipsand Cave (Vigilant's Coldharbour, `zCHMolagWorld`), Nightmare of Self Doubt, Krakevisa (Wyrmstooth). Likely cause: `hold` is null and the worldspace isn't mapped to player words. Defaults (100 XP for clearing it, a 30-day respawn) still print, so a page can carry numbers and no location.
10. **"Nearest town" skips a closer city.** Solitude Sawmill says "a short walk from Dragon Bridge". By coordinates Solitude is closer (18.9k units against 25.1k), and UESP gives "southwest of Solitude". Likely cause: nearestTown and nearestCity are separate, and the page leads with the town.

## The five worst pages

1. **Jumping Shock Spider**: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/jumping-shock-spider. "Where to find him: DLC2 WarehouseSpiders", a developer test cell. On UESP it is the bomb a Shock Spider Scroll throws, not a creature you meet (https://content2.uesp.net/wiki/Skyrim:Pack_Spider). It shouldn't exist as a person page.
2. **Dark Brotherhood Assassin**: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/dark-brotherhood-assassin. Built on the Hag's End corpse alone, without saying it is a corpse, as a "Skeletal Ancient Assassin". It hides the 5 Dawnstar Sanctuary placements and the random-encounter assassins (https://content1.m.uesp.net/wiki/Skyrim:Dark_Brotherhood_Assassin, https://en.uesp.net/wiki/Skyrim:Assassin).
3. **Dormitory**: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/dormitory. In game this is the College's Hall of Attainment, and no page exists under that name (/places/hall-of-attainment is 404). It shows no residents and lists quests from people who live elsewhere, while the hall's own quests are missing (https://app.uesp.net/wiki/Skyrim:Hall_of_Attainment).
4. **Neloth**: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/neloth. A high-traffic page, marked as checked by a second reader, yet the badge reads "Farmer" and his master Enchanting training is missing (https://app.uesp.net/wiki/Skyrim:Neloth, https://En.UESP.net/wiki/Skyrim:Trainers).
5. **Whiterun**: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/whiterun. 5 of 9 trainers are missing, and Carlotta and Eorlund's shops are wrong. Two non-innkeepers are tagged "Rents rooms", only 3 of 10 followers are in the header, and no quests are listed (https://content1.uesp.net/wiki/Skyrim:Whiterun).

Runners-up: Goblin ("Lives in Riften"), Moira ("he", and "not known" despite naming Witchmist Grove), Borogove ("1 to 18000", no realm), Frostmere Crypt (the word wall is missing and a book is shown as a quest).

## What I could not check

- **Mod content with no public source** (unknown, not guessed): Ulrenssen's House, Dorte's Cabin, Fallowstone Vault, Whiterun Customs Hall, House of Thane Alarik, Nightmare of Self Doubt, Lipsand Cave; Dro'Zel, Zedrick, Emilie Valtyr, Gurzak, Nameless Bard, Tildreylo Redoran, Sybilla of Shivers, Alit, Nix Silverspoon, Heirmir, Shadow Merchant, Corrupter of Hearts, Ghost Knight, Glowing Crab, Imperial Commander.
- **Directions:** for "where" I compared each page's direction with UESP's wording, and checked it against the place coordinates in places.json. All the vanilla dungeons I checked agree. I did not open the /map view itself.
- **Access:** direct fetches of uesp.net are behind a Cloudflare check. I reached UESP through search-result mirrors (en.m, app, content1/2/3) and did not try to get past the check.

## Per-field summary


### Places (30 pages)

| field | right | wrong | differs-maybe-LoreRim | missing | unknown | wrong rate (of checked) | wrong+missing rate |
|---|---|---|---|---|---|---|---|
| kind | 20 | 0 | 2 | 0 | 8 | 0% | 0% |
| hold | 21 | 0 | 0 | 4 | 5 | 0% | 16% |
| where | 17 | 2 | 0 | 5 | 5 | 8% | 29% |
| danger | 4 | 3 | 7 | 0 | 2 | 21% | 21% |
| people | 8 | 2 | 0 | 1 | 6 | 18% | 27% |
| quests | 13 | 2 | 0 | 4 | 2 | 11% | 32% |
| worth going for | 5 | 0 | 4 | 5 | 3 | 0% | 36% |
| map | 18 | 0 | 0 | 5 | 6 | 0% | 22% |
| shops/beds/trainers | 3 | 1 | 3 | 0 | 0 | 14% | 14% |
| **all fields** | 109 | 10 | 16 | 24 | 37 | 6% | 21% |

### People (30 pages)

| field | right | wrong | differs-maybe-LoreRim | missing | unknown | wrong rate (of checked) | wrong+missing rate |
|---|---|---|---|---|---|---|---|
| race | 10 | 3 | 2 | 3 | 12 | 17% | 33% |
| sex | 9 | 2 | 0 | 0 | 6 | 18% | 18% |
| where | 7 | 6 | 1 | 1 | 15 | 40% | 47% |
| role | 2 | 1 | 0 | 8 | 0 | 9% | 82% |
| sells/trains | 1 | 0 | 0 | 1 | 3 | 0% | 50% |
| follower/marriage | 2 | 0 | 0 | 0 | 0 | 0% | 0% |
| quests | 4 | 0 | 4 | 2 | 2 | 0% | 20% |
| **all fields** | 35 | 12 | 7 | 15 | 38 | 17% | 39% |

## Places, page by page


### Southfringe Sanctum
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/southfringe-sanctum  
Source: https://en.m.uesp.net/wiki/Skyrim:Southfringe_Sanctum

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Cave | cave | **right** |
| hold | Falkreath hold | Falkreath Hold | **right** |
| where | SE of Helgen, a short walk | "a small cave southeast of Helgen", south of Fort Neugrad | **right** |
| danger | Level 19, Necromancers, "1 in all" | Min level 6; spellswords, frostbite spiders, a hostile fox (Pumpkin) | **wrong** |
| people | Boss: "Spellsword", level 19 | Boss is Bashnag, leader of the spellsword coven (carries The Art of War Magic) | **wrong** |
| quests | none shown | The Savior of Selveni Nethri; Dungeon Delving / Onmund's Request (radiant); The Rising Dead (CC) | **missing** |
| worth going for | An alchemy lab | The Art of War Magic (Destruction) and The Warrior's Charge (Conjuration); 2 alchemy labs, arcane enchanter, forge | **missing** |
| map | Pin SE of Helgen | consistent with UESP direction | **right** |

**Would a player be misled?** Yes. It names a generic "Spellsword" as boss and says there is "1" Necromancer, and it leaves out both skill books and the quest.


### Whiterun
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/whiterun  
Source: https://content1.uesp.net/wiki/Skyrim:Whiterun, https://En.UESP.net/wiki/Skyrim:Trainers

| field | page says | source says | verdict |
|---|---|---|---|
| kind | City | city | **right** |
| hold | Whiterun hold | Whiterun Hold | **right** |
| people | Mikael and Saadia tagged "Rents rooms"; Lydia, Athis, Ria etc. tagged "Sells" | Innkeeper Hulda (Ysolda backup); rooms only from innkeepers | **wrong** |
| shops/beds/trainers | Trainers: Smithing, One-Handed, Restoration, Alchemy (4). Eorlund's shop placed at "House Gray-Mane". Carlotta "general goods". Followers header: Aela, Farkas, Vilkas only | 9 trainers incl. Aela (Archery), Njada (Block), Athis (One-handed), Farkas (Heavy Armor), Vilkas (Two-handed). Eorlund works the Skyforge. Carlotta is Food and Drink. 10 potential followers incl. Lydia, Jenassa, Uthgerd, Ria, Torvar | **wrong** |
| quests | none listed | 10 quests start here (Greatsword for a Great Man, A Few Words with You, Rare Gifts, Thane of Whiterun, Battle for Whiterun...) | **missing** |
| worth going for | crafting + shrines (Kynareth, Talos, Zenithar) | not checked against source; data has a Pickpocket book (Aevar Stone-Singer) the page doesn't show | **unknown** |
| map | pin on Whiterun | sensible | **right** |

**Would a player be misled?** Yes. Five Companions trainers are missing, two shops are wrong, and room rental is shown on people who are not innkeepers. No quests are listed.


### Ulrenssen's House
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/ulrenssens-house  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| kind | House | no source (mod) | **unknown** |
| hold | Haafingar | no source | **unknown** |
| where | In Solitude | no source | **unknown** |
| people | Arnor Ulrenssen, Brina Ulrenssen, Faaran, "Lilly Brina" | no source | **unknown** |
| map | Solitude town pin | no source | **unknown** |

**Would a player be misled?** Can't tell. This is mod content (RedBag's Solitude) and I found no source to check it against.


### Enmon's House
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/enmons-house  
Source: https://en.uesp.net/wiki/Skyrim:Enmon's_House

| field | page says | source says | verdict |
|---|---|---|---|
| kind | House | two-story residence | **right** |
| hold | The Reach | The Reach | **right** |
| where | In Karthwasten | southwestern Karthwasten | **right** |
| people | Enmon, Mena | Enmon and his wife Mena | **right** |
| shops/beds/trainers | Sharpening wheel, anvil, armor workbench | Only a cooking pot listed | **differs-maybe-LoreRim** |
| map | Karthwasten pin | sensible | **right** |

**Would a player be misled?** No. The only doubt is the smithing stations, which may come from LoreRim.


### Fallowstone Vault
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/fallowstone-vault  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Guild | no source (mod) | **unknown** |
| hold | The Rift | no source | **unknown** |
| where | In Shor's Stone | no source | **unknown** |
| people | none shown (data: 2 actors) | no source | **unknown** |
| worth going for | boss chest only in 'Not sure yet' | no source | **unknown** |
| map | Shor's Stone pin | no source | **unknown** |

**Would a player be misled?** Can't tell (Great Town of Shor's Stone mod). The page shows no one, yet the data counts 2 people and a boss chest.


### Borogove Outgrabe
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/borogove-outgrabe  
Source: https://en.uesp.net/wiki/Skyrim_Mod:Saints_and_Seducers/Borogove

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Landmark | not covered on UESP (Borogove page has no sub-areas) | **unknown** |
| hold | none | Data worldspace is ECSSShiveringIsles, but the page never says so | **missing** |
| where | nothing | nothing given | **missing** |
| danger | Level 4 and up, "Enemies 4 to 18000", 15 in all | 18000 is not a level; parent Borogove is 20-50 on UESP | **wrong** |
| map | no map | none | **missing** |

**Would a player be misled?** Yes. The page doesn't say it is in the Shivering Isles, has no map, and gives a level range of "4 to 18000".


### Dorte's Cabin
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/dortes-cabin  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| kind | House | no source | **unknown** |
| hold | Haafingar | no source | **unknown** |
| where | In Solitude | no source | **unknown** |
| people | Dorte | no source | **unknown** |
| map | Solitude pin | no source | **unknown** |

**Would a player be misled?** Can't tell (RedBag's Solitude mod).


### Whiterun Customs Hall
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/whiterun-customs-hall  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Building | no source | **unknown** |
| hold | Whiterun | no source | **unknown** |
| where | South of Whiterun, next to it | no source; coordinates agree | **unknown** |
| people | Caula Statlilia, Sturn | no source | **unknown** |
| map | south of Whiterun | plausible | **unknown** |

**Would a player be misled?** Can't tell (SurWR mod). It is internally consistent: pin just south of Whiterun.


### Bilegulch Mine
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/bilegulch-mine  
Source: https://en.m.uesp.net/wiki/Skyrim:Bilegulch_Mine

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Mine | orichalcum mine | **right** |
| hold | Falkreath | Falkreath Hold | **right** |
| where | South of Rorikstead, a short walk | SW of Fort Sungard, west of Sunderstone Gorge, where Reach/Whiterun/Falkreath meet (coordinates agree it lies S of Rorikstead) | **right** |
| danger | Level 6 to 26, Bandits, Warlocks too | Min 6; a few Orc bandits, Orc bandit chief | **differs-maybe-LoreRim** |
| worth going for | The Armorer's Challenge; boss chest; forge, smelter, tanning rack, alchemy lab, armor workbench, enchanting table | The Armorer's Challenge; smelter, forge, workbench, stone quarry | **differs-maybe-LoreRim** |
| quests | none | radiant only | **right** |
| map | S of Rorikstead | sensible | **right** |

**Would a player be misled?** Mostly not. It doesn't say the bandits are Orcs, and it lists more crafting than UESP does.


### Fellstar Farm
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/fellstar-farm  
Source: https://app.uesp.net/wiki/Skyrim:Fellstar_Farm

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Farm | farm | **right** |
| hold | The Rift | Rift | **right** |
| where | In Ivarstead | in Ivarstead, across from the lumber mill | **right** |
| people | Fastred, Boti, Jofthor | Jofthor, Boti, daughter Fastred | **right** |
| quests | Hunt and Gather (from Wylandriah) | Wylandriah's satchel/spoon is here | **right** |
| map | Ivarstead pin | sensible | **right** |

**Would a player be misled?** No.


### Shimmermist Cave
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/shimmermist-cave  
Source: https://en.m.uesp.net/wiki/Skyrim:Shimmermist_Cave

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Cave | cave (2 zones) | **right** |
| hold | Whiterun | Whiterun Hold | **right** |
| where | NE of Whiterun, a short walk | Northeast of Whiterun, east of Whitewatch Tower | **right** |
| danger | Level 18-60; Falmer, Chaurus, Skeletons, Bandits, Spiders | Min 18; Falmer, chaurus, Dwarven centurions | **differs-maybe-LoreRim** |
| worth going for | boss chest | not listed | **unknown** |
| quests | none | none listed | **right** |
| map | NE of Whiterun | sensible | **right** |

**Would a player be misled?** Partly. The page leaves out the Dwarven centurion, which UESP says can kill a low-level character.


### Mzulft
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/mzulft  
Source: https://m.uesp.net/wiki/Skyrim:Mzulft

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Dwemer ruin | large Dwarven ruin | **right** |
| hold | Eastmarch | Eastmarch | **right** |
| where | SE of Kynesgrove | SSE of Windhelm, NW of Stony Creek Cave (consistent) | **right** |
| danger | Level 16-60; Falmer, Chaurus, Skeletons, Warlocks | Min 16; Dwarven automatons, Falmer, chaurus; boss is a Dwarven automaton | **differs-maybe-LoreRim** |
| quests | Arniel's Endeavor, Lost to the Ages, Revealing the Unseen | same three | **right** |
| worth going for | The Lunar Lorkhan; Heavy Armor Forging; boss chest; alchemy lab | The Lunar Lorkhan; alchemy lab (Heavy Armor Forging not on UESP) | **right** |
| map | SE of Kynesgrove | sensible | **right** |

**Would a player be misled?** Partly. The quests and books are right, but it doesn't warn about the Dwarven automatons (UESP's boss is one).


### Temple of Talos
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/temple-of-talos  
Source: https://en.uesp.net/wiki/Skyrim:Temple_of_Talos

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Temple | temple | **right** |
| hold | Eastmarch | Windhelm | **right** |
| where | In Windhelm | NW of Candlehearth Hall, Windhelm | **right** |
| people | Jora, Lortheim | Jora and Lortheim | **right** |
| shops/beds/trainers | Shrine of Talos | shrine of Talos | **right** |
| quests | none | none | **right** |
| map | Windhelm pin | sensible | **right** |

**Would a player be misled?** No.


### Borogove
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/borogove  
Source: https://en.uesp.net/wiki/Skyrim_Mod:Saints_and_Seducers/Borogove

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Fort | small ruin | **differs-maybe-LoreRim** |
| hold | none | region: The Asylum, Mania coast (Shivering Isles) | **missing** |
| where | nothing | north of The Near Corgi Shop | **missing** |
| danger | Level 1 and up, "Enemies 1 to 18000" | Level 20-50; Exiled Apostles | **wrong** |
| people | Kinthal, 24-48 | UESP names no boss (page's own note 'Thoron's Orders to Kinthal' supports it) | **unknown** |
| quests | The Roots of Madness | The Roots of Madness | **right** |
| worth going for | tanning rack, enchanting table (Nerveshatter only in quest text) | Important treasure: Nerveshatter | **missing** |
| map | none | none | **missing** |

**Would a player be misled?** Yes. It doesn't say the fort is in the Shivering Isles (Mania coast), and the level range runs "1 to 18000".


### Gloomreach
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/gloomreach  
Source: https://app.uesp.net/wiki/Skyrim:Gloomreach

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Cave | cave | **right** |
| hold | The Reach | The Reach | **right** |
| where | SW of Rorikstead | SE of Old Hroldan Inn (coordinates agree with both) | **right** |
| danger | Level 18-55; Falmer, Bears, Chaurus, Bandits, Skeletons | Min 18; Falmer and chaurus | **differs-maybe-LoreRim** |
| worth going for | Withershins; boss chest; smelter | Withershins; smelter | **right** |
| quests | none | none named | **right** |
| map | SW of Rorikstead | sensible | **right** |

**Would a player be misled?** Mostly not.


### Solitude Sawmill
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/solitude-sawmill  
Source: https://en.m.uesp.net/wiki/Skyrim:Solitude_Sawmill

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Mill | wood mill | **right** |
| hold | Haafingar | Haafingar | **right** |
| where | "a short walk from Dragon Bridge", nearest town Dragon Bridge | Southwest of Solitude. By coordinates it is 18.9k units from Solitude and 25.1k from Dragon Bridge | **wrong** |
| people | Kharag gro-Shurkul, Hjorunn | Hjorunn (owner), Kharag | **right** |
| shops/beds/trainers | Kharag: Sells, Follower | Kharag sells logs; not listed as a follower | **differs-maybe-LoreRim** |
| quests | none | none | **right** |
| map | E of Dragon Bridge | pin sensible | **right** |

**Would a player be misled?** A little. It sends you from Dragon Bridge, though Solitude is closer, and it marks Kharag as a follower.


### House of Thane Alarik
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/house-of-thane-alarik  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| kind | House | no source | **unknown** |
| hold | Eastmarch | no source | **unknown** |
| where | In Windhelm | no source | **unknown** |
| people | Kolfinna, Thane Alarik | no source | **unknown** |
| map | Windhelm pin | no source | **unknown** |

**Would a player be misled?** Can't tell (WindhelmSSE mod).


### Krakevisa
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/krakevisa  
Source: https://tes-mods.fandom.com/wiki/Krakevisa

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Altar | a building in northern Wyrmstooth (the page's own book says 'ruins of Krakevisa') | **differs-maybe-LoreRim** |
| hold | Wyrmstooth | Wyrmstooth island | **right** |
| where | nothing beyond 'in Wyrmstooth' | northern Wyrmstooth, west of the Stormcloak Camp | **missing** |
| danger | Level 6-80; Warlocks, Necromancers, Skeletons, Spriggans, Draugr, Vampires, Bandits, Hagravens, Falmer, Thalmor | mages (ice/fire/storm, necromancers) and atronachs | **differs-maybe-LoreRim** |
| quests | The Naked Nord | fan wiki lists Totems of Hircine only; not confirmed | **unknown** |
| worth going for | boss chest; forge, sharpening wheel, tanning rack, alchemy lab, armor workbench, enchanting table | alchemy lab, forge, enchanter, arcane enchanter; many spell tomes | **differs-maybe-LoreRim** |
| map | none | none | **missing** |

**Would a player be misled?** Partly. It is called an altar, it gives no spot on the island and no map, and the enemy list is implausibly broad.


### Nightmare of Self Doubt
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/nightmare-of-self-doubt  
Source: https://content2.uesp.net/wiki/Skyrim:Self_Doubt

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Landmark | no source (NightmarePlane.esp); UESP 'Self Doubt' is an NPC in The Mind of a Madman, not this | **unknown** |
| hold | none | n/a | **missing** |
| where | nothing | n/a | **missing** |
| danger | 'Not sure yet' | n/a | **unknown** |
| map | none | n/a | **missing** |

**Would a player be misled?** Yes, by saying nothing. A player can't use a page that names no realm, quest or place. It shows 100 XP for clearing it and a 30-day respawn, both defaults.


### Liar's Retreat
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/liars-retreat  
Source: https://en.uesp.net/wiki/Skyrim:Liar's_Retreat

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Cave | small cave + cellar | **right** |
| hold | The Reach | The Reach | **right** |
| where | NE of Karthwasten, next to it | Northeast of Karthwasten | **right** |
| danger | Level 18-55; Bandits, Falmer, Spiders, Chaurus | Min 18; Bandits, Falmer, Frostbite Spiders, Chaurus | **right** |
| worth going for | Biography of the Wolf Queen; boss chest | Biography of the Wolf Queen; The Longhammer | **right** |
| quests | none | Liar's Retreat: retrieve the Longhammer | **missing** |
| map | NE of Karthwasten | sensible | **right** |

**Would a player be misled?** A little. The Longhammer quest is missing.


### The Retching Netch
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/the-retching-netch  
Source: https://en.uesp.net/wiki/Skyrim:The_Retching_Netch

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Inn | cornerclub | **right** |
| hold | Solstheim | Raven Rock | **right** |
| where | In Raven Rock | near the docks in Raven Rock | **right** |
| people | Geldis Sadri, Teldryn Sero, Drovas Relvi, Mogrul, Slitter + mod NPCs Haj-Xul, Yassour Tansumiran, Arvlvan Thenven | Geldis, Drovas, Teldryn, Mogrul; Niyya/Ralis conditional | **right** |
| shops/beds/trainers | Geldis: general goods, rooms; Teldryn follower; alchemy lab + enchanting table | Geldis: food and drink, rooms 10g; Teldryn follower; cooking pot, brewing vats | **differs-maybe-LoreRim** |
| quests | Miasma (mod) | none in Related Quests | **unknown** |
| map | no map link | Solstheim not on the site's map | **n/a** |

**Would a player be misled?** Mostly not. Geldis's stock is called 'general goods' (UESP: food and drink), and the crafting stations differ.


### Kolskeggr Mine
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/kolskeggr-mine  
Source: https://content1.m.uesp.net/wiki/Skyrim:Kolskeggr_Mine

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Mine | gold mine | **right** |
| hold | The Reach | The Reach | **right** |
| where | East of Markarth, next to it | East-northeast of Markarth | **right** |
| danger | Level 24-52; Forsworn; 12 | Forsworn; boss a Forsworn Briarheart | **right** |
| quests | Kolskeggr Mine | Kolskeggr Mine; Mine Ore (radiant) | **right** |
| worth going for | none | one smelter | **missing** |
| map | E of Markarth | sensible | **right** |

**Would a player be misled?** No. It doesn't name the Briarheart boss or show the smelter, and a book quote is unrelated.


### Lost Prospect Mine
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/lost-prospect-mine  
Source: https://en.uesp.net/wiki/Skyrim:Lost_Prospect_Mine

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Mine | gold mine | **right** |
| hold | The Rift | The Rift | **right** |
| where | East of Riften, next to it | East-northeast of Riften | **right** |
| danger | 'Enemies' level 6-50, 5 in all, traps, 100 XP for clearing | No enemies listed; not clearable; min 6 | **differs-maybe-LoreRim** |
| worth going for | a smelter | journal, 3 gold ore veins, pickaxe; no crafting listed | **differs-maybe-LoreRim** |
| quests | none | none | **right** |
| map | E of Riften | sensible | **right** |

**Would a player be misled?** Possibly. It promises '5 enemies, level 6 to 50' of no named type, and clear XP. UESP lists no enemies and says it can't be cleared.


### Cragslane Cavern
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/cragslane-cavern  
Source: https://app.uesp.net/wiki/Skyrim:Cragslane_Cavern

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Cave | dungeon | **right** |
| hold | Eastmarch | Eastmarch | **right** |
| where | North of Shor's Stone | North of Shor's Stone, west of Ansilvund | **right** |
| danger | Level 6-28; Bandits; 12 | Min 6; bandits, pit wolves | **right** |
| people | Butcher, level 28 | The Butcher | **right** |
| worth going for | The Wolf Queen, Vol. 1; boss chest; tanning rack | The Wolf Queen v1; tanning rack | **right** |
| quests | Supply and Demand | Supply and Demand; Gambler's Edge (CC); radiant | **right** |
| map | N of Shor's Stone | sensible | **right** |

**Would a player be misled?** No.


### Lipsand Cave
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/lipsand-cave  
Source: https://www.nexusmods.com/skyrimspecialedition/mods/11849/

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Cave | no source found | **unknown** |
| hold | none (data world: zCHMolagWorld) | n/a | **missing** |
| where | nothing | n/a | **missing** |
| danger | Level 6-80; Skeletons; boss The Wasteland Guardian 80 | no source | **unknown** |
| map | none | n/a | **missing** |

**Would a player be misled?** Yes, by saying nothing. It doesn't say it is in Vigilant's Coldharbour realm, and it has no location or map. The boss at level 80 is the only real information.


### Gray Pine Goods
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/gray-pine-goods  
Source: https://en.uesp.net/wiki/Skyrim:Gray_Pine_Goods

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Store | general goods store | **right** |
| hold | Falkreath | Falkreath | **right** |
| where | In Falkreath | Falkreath | **right** |
| people | Solaf, Bolund | Solaf (proprietor) and his brother Bolund | **right** |
| shops/beds/trainers | Solaf, goods | general goods | **right** |
| quests | none | none | **right** |
| map | Falkreath pin | sensible | **right** |

**Would a player be misled?** No.


### Ravenscar Hollow
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/ravenscar-hollow  
Source: https://app.uesp.net/wiki/Skyrim:Ravenscar_Hollow

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Cave | small cave | **right** |
| hold | Haafingar | Haafingar | **right** |
| where | NW of Solitude | Northwest of Solitude | **right** |
| danger | Level 14-55; Hagravens, Bandits, Spriggans | Min 14; hagravens, leveled creatures, a caged bandit | **right** |
| worth going for | The Art of War Magic; boss chest | The Art of War Magic; boss chest | **right** |
| quests | none | none | **right** |
| map | NW of Solitude | sensible | **right** |

**Would a player be misled?** No.


### Sadri's Used Wares
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/sadris-used-wares  
Source: https://en.uesp.net/wiki/Skyrim:Sadri's_Used_Wares, https://app.uesp.net/wiki/Skyrim:Revyn_Sadri

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Store | pawnshop | **right** |
| hold | Eastmarch | Windhelm | **right** |
| where | In Windhelm | Gray Quarter, Windhelm | **right** |
| people | Revyn Sadri | Revyn Sadri | **right** |
| shops/beds/trainers | sells; trains Speech | sells (buys all); Speech trainer (common, to 50) | **right** |
| quests | none on the place page | That Was Always There | **missing** |
| worth going for | none shown (data has '2920, Vol. 05: Second Seed') | 2920, Second Seed, v5 (Speech) behind the counter | **missing** |
| map | Windhelm pin | sensible | **right** |

**Would a player be misled?** A little. It doesn't show the skill book, the favour quest, or that he can be married.


### Frostmere Crypt
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/frostmere-crypt  
Source: https://content1.m.uesp.net/wiki/Skyrim:Frostmere_Crypt

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Nordic ruin | Nordic ruin | **right** |
| hold | The Pale | The Pale | **right** |
| where | E of Stonehills, next to it | SSW of Dawnstar, NNE of the Lord Stone (coordinates agree) | **right** |
| danger | Level 6-24; Bandits, Bears, Skeletons | Min 6; bandits (Kyr), the Pale Lady (a wispmother) | **differs-maybe-LoreRim** |
| quests | On Hogithum ('A fragment'); The Pale Lady | The Pale Lady; Amulet of the Moon, Bandit Attack (radiant). 'On Hogithum' is a book | **wrong** |
| worth going for | The Red Kitchen Reader; boss chest; sharpening wheel | The Red Kitchen Reader; Ice Form word wall; The Pale Blade; grindstone | **missing** |
| map | E of Stonehills | sensible | **right** |

**Would a player be misled?** Yes. It lists a book fragment as a quest, and it drops the Ice Form word wall and the Pale Blade, which are the reasons to go.


### Dormitory
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/places/dormitory  
Source: https://app.uesp.net/wiki/Skyrim:Hall_of_Attainment

| field | page says | source says | verdict |
|---|---|---|---|
| kind | Guild | College hall (student quarters) | **right** |
| hold | Winterhold | Winterhold | **right** |
| where | 'In Winterhold' (links to the town); name 'Dormitory' | Hall of Attainment, College of Winterhold; no site page exists under that name | **wrong** |
| people | none shown (data: 15 actors) | Tolfdir, Brelyna, Onmund, J'zargo, Enthir, Nirya, Mirabelle, Arniel... | **missing** |
| quests | Arniel's Endeavor; Illusion Ritual Spell; Kagrenac's Tools (Mathis Valen, Silver-Blood Inn); Out of Balance; Research Thief; The Way In (Initiate Garin, Meridia's Sanctum) | Arniel's Endeavor, Brelyna's Practice, J'zargo's Experiment, Onmund's Request, Tolfdir the Absent-Minded, Rejoining the College... | **wrong** |
| worth going for | alchemy lab, enchanting table (data's 3 skill books not shown) | no stations mentioned | **differs-maybe-LoreRim** |
| map | pin | not checked | **unknown** |

**Would a player be misled?** Yes. In game this is the Hall of Attainment at the College. The page shows no residents and lists quests from people who live elsewhere, while the real ones are missing.


## People, page by page


### Neloth
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/neloth  
Source: https://app.uesp.net/wiki/Skyrim:Neloth, https://En.UESP.net/wiki/Skyrim:Trainers

| field | page says | source says | verdict |
|---|---|---|---|
| race | Dunmer | Dark Elf | **right** |
| sex | he | male | **right** |
| where | Tel Mithryn, wandering his tower | his lab in Tel Mithryn | **right** |
| role | Badge 'Farmer'; 'Telvanni wizard' | Master Wizard of House Telvanni; no farmer role | **wrong** |
| sells/trains | merchant, open at all hours (no stock); no training | sells staves, soul gems; trains Enchanting (Master) | **missing** |
| follower/marriage | none; travels with you in The Path of Knowledge | none; goes with you to Nchardak | **right** |
| quests | gives 10 (all match), in 5 more | same 10 given; also in At the Summit of Apocrypha, Krosulhah's Ambush, For House Telvanni | **right** |

**Would a player be misled?** Yes. The badge says "Farmer", and the page never says he is a master Enchanting trainer.


### Reldith
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/reldith  
Source: https://app.uesp.net/wiki/Skyrim:Reldith

| field | page says | source says | verdict |
|---|---|---|---|
| race | Altmer | High Elf | **right** |
| sex | she | female | **right** |
| where | Rorikstead; day 'not known yet' | Cowflop Farmhouse; fields 6am-5pm | **right** |
| role | Farmer | farmer | **right** |
| quests | The Secret of Rorikstead | Gather Wheat (radiant) | **differs-maybe-LoreRim** |

**Would a player be misled?** No. 'Not known yet' is honest, but UESP has her full schedule.


### Imperial Commander
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/imperial-commander  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | none | no UESP page | **missing** |
| sex | he | no source | **unknown** |
| where | 'Lives in Whiterun' | no source; no cell in data, only a town | **unknown** |
| role | none | n/a | **missing** |

**Would a player be misled?** Yes, in its framing. A generic title shown with no race says it 'Lives in Whiterun' with no sign that it is a role, not a person.


### Dark Brotherhood Assassin
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/dark-brotherhood-assassin  
Source: https://content1.m.uesp.net/wiki/Skyrim:Dark_Brotherhood_Assassin, https://en.uesp.net/wiki/Skyrim:Assassin

| field | page says | source says | verdict |
|---|---|---|---|
| race | 'Skeletal Ancient Assassin' | Hag's End one is a Nord corpse; random ones Argonian/Dunmer/Khajiit; data's other 5 rows Nord/Breton | **differs-maybe-LoreRim** |
| sex | he | male (corpse) | **right** |
| where | Hag's End only | Hag's End corpse; random encounter anywhere; data also places 5 in Dawnstar Sanctuary | **wrong** |
| role | 'Skeletal Ancient Assassin' | a long-dead body | **missing** |
| quests | Unfinished Business | Locate the Assassin of Old | **differs-maybe-LoreRim** |

**Would a player be misled?** Yes. It is built on one row: a corpse in Hag's End, not described as a corpse. It hides the 5 Dawnstar Sanctuary placements and the random assassins.


### Sirkjorg
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/sirkjorg  
Source: https://app.uesp.net/wiki/Skyrim:Sirkjorg

| field | page says | source says | verdict |
|---|---|---|---|
| race | Nord | Nord | **right** |
| sex | he | male | **right** |
| where | Not known yet | Temple of Miraak, then Bujold's Retreat or Thirsk Mead Hall | **unknown** |
| role | 'Nord' | pillar builder / Thirsk Nord | **missing** |
| quests | At the Summit of Apocrypha ('worker'); Retaking Thirsk | Retaking Thirsk | **differs-maybe-LoreRim** |

**Would a player be misled?** Mildly. 'Not known yet' is honest, but UESP places him.


### Gissur
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/gissur  
Source: https://content1.uesp.net/wiki/Skyrim:Gissur

| field | page says | source says | verdict |
|---|---|---|---|
| race | Nord | Nord | **right** |
| sex | he | male | **right** |
| where | Thalmor Embassy, Elenwen's Solar | Elenwen's Solar during Diplomatic Immunity; later Ragged Flagon/Ratway | **right** |
| role | 'Nord' | beggar and Thalmor informant | **missing** |
| quests | Diplomatic Immunity; A Cornered Rat | same | **right** |

**Would a player be misled?** A little. Only his quest-time spot is given, and his role is missing.


### Dro'Zel
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/drozel  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | Khajiit | no source | **unknown** |
| sex | he | no source | **unknown** |
| where | Mad King's Bedroom (a memory) | no source | **unknown** |
| quests | The Mad King | no source | **unknown** |

**Would a player be misled?** Can't tell (mod). Not on UESP's Mind of a Madman page.


### Jumping Shock Spider
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/jumping-shock-spider  
Source: https://content2.uesp.net/wiki/Skyrim:Pack_Spider

| field | page says | source says | verdict |
|---|---|---|---|
| race | Frostbite Spider | a thrown spider from a Shock Spider Scroll | **differs-maybe-LoreRim** |
| sex | 'him' | n/a (a projectile spider) | **wrong** |
| where | DLC2 WarehouseSpiders | made from scrolls crafted at White Ridge Barrow's imbuing chamber | **wrong** |
| role | 'Frostbite Spider' | spider-scroll summon | **missing** |

**Would a player be misled?** Yes. 'Where to find him: DLC2 WarehouseSpiders' is a developer test cell. This is the bomb a Shock Spider Scroll throws, not a creature you meet. The page shouldn't exist as a person.


### Zedrick
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/zedrick  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | 'Elder' | 'Elder' is Skyrim's old-age race record, not a people (Tolfdir has it too in the data) | **wrong** |
| sex | he | no source | **unknown** |
| where | Solitude (Balmir's House, mod) | no source | **unknown** |

**Would a player be misled?** Mildly. 'An Elder' is an age model's race, not a people.


### Goblin
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/goblin  
Source: https://content1.uesp.net/wiki/Skyrim:Goblin

| field | page says | source says | verdict |
|---|---|---|---|
| race | none | goblin (creature) | **missing** |
| sex | he | n/a | **unknown** |
| where | 'Lives in Riften' | Gromm's Pass, Hammerfell and Morrowind borders, west of Largashbur; 'encountered rarely' | **wrong** |
| quests | none | Blue in the Face (CC) | **missing** |

**Would a player be misled?** Yes. 'Lives in Riften' is wrong: the data's cell is Gromm's Pass, and UESP gives the borders. Goblins are a creature group, not a person.


### Frost Troll
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/frost-troll  
Source: https://en.uesp.net/wiki/Skyrim:Troll

| field | page says | source says | verdict |
|---|---|---|---|
| race | Snow Troll | frost troll (troll variant) | **right** |
| where | Reeking Cave | cold, high areas; fixed ones at Labyrinthian, Eldersblood Peak, path to High Hrothgar | **wrong** |

**Would a player be misled?** Yes. It names one cave for a common creature, and the data's second placement (Bleak Falls Barrow) is hidden.


### Glowing Crab
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/glowing-crab  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | Mud Crab | no source | **unknown** |
| where | Dimfrost Boilery | no source | **unknown** |

**Would a player be misled?** Can't tell. All 3 data rows are in Dimfrost Boilery (mod), so the one location may be true.


### Corrupter of Hearts
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/corrupter-of-hearts  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | Giant | no source | **unknown** |
| where | Not known yet | no source | **unknown** |

**Would a player be misled?** Can't tell. It honestly says 'Not known yet', but the page gives a player nothing.


### Mogdurz
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/mogdurz  
Source: https://app.uesp.net/wiki/Skyrim:Mogdurz

| field | page says | source says | verdict |
|---|---|---|---|
| race | Orsimer | Orc | **right** |
| sex | she | female | **right** |
| where | Narzulbur | mines all day in Gloombound Mine, next to Narzulbur | **right** |
| role | 'Orsimer' | miner | **missing** |

**Would a player be misled?** A little. It doesn't say she spends the day in Gloombound Mine.


### Ghost Knight
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/ghost-knight  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | Breton | no source | **unknown** |
| where | Not known yet | no source | **unknown** |

**Would a player be misled?** Can't tell; the page is empty for a player.


### Mercenary
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/mercenary  
Source: https://www.nexusmods.com/skyrimspecialedition/mods/109541

| field | page says | source says | verdict |
|---|---|---|---|
| race | Imperial | 19 rows, most with no race | **wrong** |
| where | Fort Icemoth Dungeons | mod: dead mercenary by the Old Wooden Jetty starts Siege at Icemoth | **wrong** |
| quests | Caches of Skorjan Iron-Beard | mod lists a book of that name; quest not confirmed | **unknown** |

**Would a player be misled?** Yes. 19 generic 'Mercenary' rows are folded into one 'Imperial' at Fort Icemoth, while the page's own quest line says a dead mercenary at the Old Wooden Jetty.


### Agmaer
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/agmaer  
Source: https://content1.uesp.net/wiki/Skyrim:Agmaer

| field | page says | source says | verdict |
|---|---|---|---|
| race | Nord | Nord | **right** |
| sex | he | male | **right** |
| where | Fort Dawnguard | Dayspring Canyon first, then Fort Dawnguard (dining area by day, cot 8pm-4am) | **right** |
| role | 'Nord' | Dawnguard recruit | **missing** |
| follower/marriage | Follower; how 'not known yet' | follower after Prophet | **right** |
| quests | Dawnguard, Destroying the Dawnguard, Awakening | + Kindred Judgment, Prophet | **right** |

**Would a player be misled?** A little. Two quests and his first location are missing.


### Emilie Valtyr
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/emilie-valtyr  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | Nord | no source | **unknown** |
| sex | she | no source | **unknown** |
| where | Solitude | no source | **unknown** |

**Would a player be misled?** Can't tell (mod).


### Gurzak
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/gurzak  
Source: https://en.uesp.net/wiki/Skyrim:Mor_Khazgur

| field | page says | source says | verdict |
|---|---|---|---|
| race | Orsimer | not on UESP | **unknown** |
| where | Mor Khazgur | not among UESP residents | **differs-maybe-LoreRim** |
| sells/trains | sells goods (what: not known) | n/a | **unknown** |

**Would a player be misled?** Can't tell. UESP's Mor Khazgur has no Gurzak, so he is likely LoreRim's.


### Nameless Bard
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/nameless-bard  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | Skeleton | no source | **unknown** |
| where | Not known yet | no source | **unknown** |

**Would a player be misled?** Can't tell; the page is empty.


### Tildreylo Redoran
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/tildreylo-redoran  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | Dunmer | no source | **unknown** |
| where | Not known yet | no source | **unknown** |

**Would a player be misled?** Can't tell; the page is empty.


### Sybilla of Shivers
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/sybilla-of-shivers  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | 'Arpen Buro Race' | raw editor race name | **wrong** |
| sex | he | no source (name suggests female) | **unknown** |
| where | Blood Curse of Shivers | no source | **unknown** |

**Would a player be misled?** Yes, in its wording. 'An Arpen Buro Race' is an editor race name, and the page calls a 'Sybilla' 'him'.


### Alit
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/alit  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | Wolf | no source | **unknown** |
| where | Crag-drop Cave | no source | **unknown** |

**Would a player be misled?** Can't tell. It is a creature name (5 rows, 3 with no cell), shown at one cave.


### Larina
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/larina  
Source: https://en.uesp.net/wiki/Skyrim:Larina

| field | page says | source says | verdict |
|---|---|---|---|
| race | Imperial | Imperial | **right** |
| sex | she | female | **right** |
| where | Hob's Fall Cave | caged in Hob's Fall Cave | **right** |
| role | 'Imperial' | Bards College student; prisoner | **missing** |
| quests | none | tied to Pantea's Flute | **missing** |

**Would a player be misled?** Yes. It doesn't say she is a caged prisoner who is killed later, or that she ties to Pantea's Flute.


### Imperial Battlemage
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/imperial-battlemage  
Source: https://content1.uesp.net/wiki/Skyrim:Unbound

| field | page says | source says | verdict |
|---|---|---|---|
| race | none (data has Imperial) | n/a | **missing** |
| where | 'Lives in Helgen' | UESP has no 'Imperial Battlemage'; Imperial mages appear only in Helgen's courtyard during Unbound | **wrong** |

**Would a player be misled?** Yes. 'Lives in Helgen' for a soldier title in a town destroyed in the opening.


### Falion
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/falion  
Source: https://en.uesp.net/wiki/Skyrim:Falion, https://En.UESP.net/wiki/Skyrim:Trainers

| field | page says | source says | verdict |
|---|---|---|---|
| race | Redguard | Redguard | **right** |
| sex | he | male | **right** |
| where | house; stones 1-5am | house; marsh stones 1-5am (nap at 1pm vs UESP 3pm) | **right** |
| role | Morthal wizard: spell merchant, Conjuration trainer | same | **right** |
| sells/trains | spell tomes 8am-8pm; Conjuration (level not sure) | spell tomes etc. 8-8; Conjuration Master | **right** |
| quests | Falion's Secret; Seeking A Cure; Fists of Fury; A Forlorn Hope; Serana's cure | Falion's Secret; Rising at Dawn | **differs-maybe-LoreRim** |

**Would a player be misled?** Mostly not. The vanilla cure quest (Rising at Dawn) appears as LoreRim's 'Seeking A Cure'.


### Nix Silverspoon
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/nix-silverspoon  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | Imperial | no source | **unknown** |
| where | The Silverspoon Trading Company | no source | **unknown** |
| sells/trains | goods | no source | **unknown** |

**Would a player be misled?** Can't tell (mod).


### Heirmir
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/heirmir  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | Nord | no source | **unknown** |
| where | Not known yet | no source | **unknown** |

**Would a player be misled?** Can't tell; the page is empty.


### Moira
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/moira  
Source: https://app.uesp.net/wiki/Skyrim:Moira

| field | page says | source says | verdict |
|---|---|---|---|
| race | Hagraven | Hagraven | **right** |
| sex | 'he' | female | **wrong** |
| where | Not known yet | Witchmist Grove (appears once A Night To Remember starts) | **missing** |
| quests | A Night To Remember | A Night To Remember | **right** |

**Would a player be misled?** Yes. It calls her 'him', and says where she is 'not known yet' while its own quest line says Witchmist Grove.


### Shadow Merchant
Page: https://lorerim-build-planner-git-staging-daves-projects-a9b7d176.vercel.app/people/shadow-merchant  
Source: none found (mod content)

| field | page says | source says | verdict |
|---|---|---|---|
| race | Nord | no source | **unknown** |
| where | Mausoleum Throne | data also Unbarred House, Gravewind Apothecary | **unknown** |
| sells/trains | goods | no source | **unknown** |

**Would a player be misled?** Can't tell (mod). The data has 3 placements, and the page shows 1 as the place to find him.
