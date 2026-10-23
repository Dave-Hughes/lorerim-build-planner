# What we know about a place: the spec

Every field the places index carries, written before it's built. For each: what a player (or their Claude) asks it for, where it comes from in the records, what a right value looks like, and what's impossible (the sanity test). The PC builds to this; Bob reviews values against it. A field not in this file isn't shipped.

| Field | A player asks | From the records | A right value | Impossible (fails the test) |
|---|---|---|---|---|
| **name** | "What's it called?" | The cell's display name (`CELL` FULL); the location's (`LCTN` FULL) only when the cell has none | "Fort Hraggstad", "Vilemyr Inn" | empty; an editor id; "Location" or a town prefix in it ("Ivarstead Vilemyr Inn") |
| **kind** | "Is it a cave, a fort, a ruin?" | The location's type keywords (`LocTypeDungeon`, `LocTypeFort`, `LocTypeNordicRuin`, `LocTypeInn`…), checked against what's in it | Fort | a city tagged as an inn; a cave tagged as a temple |
| **hold** | "Which hold?" | The location's parent chain up to a hold (`LCTN` PNAM) | Haafingar | none for a place in Skyrim's worldspace |
| **near** | "How far from town?" | The place's exterior map marker to each capital's and settlement's anchor | "a short walk from Dragon Bridge; a short walk from Solitude", km kept for sorting | its own name as its nearest town; a capital with fewer than ten places within half a day |
| **what lives there** | "Bandits? Draugr? Vampires?" | The placed actors' leveled lists, resolved to their NPCs' classes and factions (`BanditFaction`, `DraugrFaction`, `ForswornFaction`, `VampireFaction`, `NecromancerFaction`…), the majority kind and any others | "bandits"; "draugr, a dragon priest" | empty for a place with actors; "Prisoner" or "Guard" as the kind of a hostile place |
| **enemy levels** | "Can she handle it at 12?" | Each hostile actor's `LVLN` entries → `NPC_` level (fixed, or a player multiple with its min and max), clamped by the encounter zone (`ECZN` min, max; 0 = no cap); a list entry only appears at or above its level | floor and ceiling, and what a player meets at a given level: "bandits from level 3; at 12, about 3 to 12" | 1 to 1; min above max; a range wider than the zone allows; a non-hostile actor counted |
| **boss** | "Who's at the end?" | The actor marked boss (ref, alias, or the location's boss marker), resolved the same way; its name if the records name it | "a bandit chief, about 19 to 24"; "Zulakaroth, about 40" | a boss with no level; a boss weaker than the place's floor |
| **zone floor** | "Will it be easy if I come back later?" | `ECZN` min level and flags (0x02 match below minimum, 0x01 never resets) | "never below 6" | — |
| **what's worth going for** | "Why go?" | A word wall (`WordWall` activator), a skill book placed there, a unique item (non-leveled, named), a boss chest (`TreasBoss…`), a forge or shrine or crafting station, a Standing Stone | "a word wall (Fire Breath); a boss chest; a skill book (Sneak)" | an item that only appears in leveled loot named as certain |
| **clear XP / discovery XP** | "What's it worth?" | Experience.ini by location type: clearing and discovering | "clear 200, discover 50" | 0 for a place with a boss |
| **respawns** | "Will it fill up again?" | The zone's never-resets flag, the cell's `NoResetZone`; LoreRim's reset days (30 ordinary, 300 cleared) | "resets after 300 days once cleared" | — |
| **danger to a build** | "Anything nasty?" | Traps placed (`TrapLinker`, pressure plates), a dragon lair marker, a boss with a spell kit (`NPC_` spells) | "traps; the boss casts frost" | — |
| **pointers** | "Who sends me there?" | Dialogue lines and books that name it (already built) | "Legate Rikke in Castle Dour: …" | a pointer from a quest's helper |
| **quests** | "Is there a quest here?" | Quest aliases and objectives that target the location | "Joining the Legion (clear it)" | — |

**Before it's done:** the sanity tests for every row, and the ten spot checks (Bleak Falls Barrow, Fort Hraggstad, Embershard Mine, Bee and Barb, Narzulbur, Labyrinthian, Ustengrav, Broken Fang Cave, Halted Stream Camp, Silent Moons Camp), each written in the log against UESP. One place read through the door as a player's Claude would say it, pasted in the log.

**For people** (`docs/data/people.md`, next): who they are, where they stand and when, what they sell and teach and up to what level, how they join or marry, what quests they give; the same four columns.
