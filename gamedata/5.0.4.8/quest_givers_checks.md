# WO-98: the 15 samples checked (Bob, 18 Oct 2026)

The known answers for `quest_givers_report.md`, from the base game, the field guide (`lorerim/world/quests-and-lands.md`) and the mod pages. "Named" is the rule tried after the spike: the first person from the quest's aliases whose name appears in its opening journal entry or first objective, falling back to the dialogue speaker.

| Quest | Known giver, and where | Dialogue speaker (spike) | Named rule | Known reward | Spike's reward candidates |
|---|---|---|---|---|---|
| The Golden Claw | Lucan Valerius, Riverwood Trader | Gerdur: wrong | Lucan Valerius: right | Gold | Gold, a medium quest reward list: right |
| Rise in the East | Orthus Endario, East Empire Company, Windhelm | right | right | Gold | Gold, a large reward list: right |
| The Forsworn Conspiracy | Eltrys, by a note; meet him at the Shrine of Talos, Markarth | none | Eltrys: right | Gold | Gold, a medium reward list: right |
| The Break of Dawn | Meridia, through her beacon; Kilkreath Ruins | right | right | Dawnbreaker | Dawnbreaker: right; a light-beam spell: noise |
| A Daedra's Best Friend | Barbas, outside Haemar's Shame | right | right | The Masque of Clavicus Vile or the Rueful Axe | both: right |
| Take Up Arms | Kodlak Whitemane, Jorrvaskr | Aela: wrong | Kodlak: right | none | eight items from the Companions' shared script: all noise |
| A Chance Arrangement | Brynjolf, Riften market | right | right | Gold | Gold: right; Madesi's ring (you plant it) and a pickpocket boost: noise |
| Wyrmstooth | Lurius Liore, the Bannered Mare, Whiterun (a courier sends you) | Theodyn Bienne, the courier: half | Lurius Liore: right | not known | none found |
| Vigilant of Stendarr | Altano, Windpeak Inn, Dawnstar | Altano: right person, placed at the Temple of Stendarr (he's moved in by script) | Altano (falls back): right | not known | Amulet of Stendarr, a flask, a blessing: to check in game |
| Meridia's Order | Paladin Marith, who finds you in a city | right | right | not known | none found |
| In the Pines | none: walk into the homestead | none: right | none: right | not known | none found |
| Bad Vibrations | Inigo, your follower | right | right | not known | Spell Tome: Summon Inigo: to check in game |
| In their Footsteps | none: a rumour, or find the ambush | none: right | none: right | not known | none found |
| Deluge of Deceit | Frissa Black-Briar, Elgrim's Elixirs, Riften | Bolli: wrong | Frissa Black-Briar: right | not known | none found |
| Fists of Fury - The Rift | a letter, then Maul in Riften | right | right | not known | none found |

## What it shows

- **Givers.** The dialogue speaker alone is right for 8 of the 13 quests that have a giver. The named rule gets all 13, and the two with no giver come out as none. Over the 139 story lines it finds a giver for the opening quest of 109; with the field guide's start notes, 116 say how to start.
- **Where.** The spike placed only the dialogue speaker, so a giver found by name (Lucan, Kodlak, Lurius, Frissa) has no place yet. Every person in a quest's aliases needs their placed cell too. A placed cell can be wrong for NPCs a script moves in (Altano), so the opening entry's own words ("in the Windpeak Inn") stay first on the page.
- **Rewards.** Gold is reliable when it comes with a quest reward list (`LvlQuestReward01Small`, `02Medium`, `03Large`): that's a small, medium or large gold reward. Named weapons and armour from the quest's own script fragment (`QF_...`) or an alias are right for the Daedric artifacts. Everything from a shared script (the Companions' housekeeping script), spells, perks and items you hand over are noise. Rewards need a person to confirm them before a page shows them as fact.

## The 3 apart (WO-99, 18 Oct)

WO-99's `namedGiver` finds a giver for 106 of the 139 story-line openings; Bob's hand count was 109. The 3 are Bob's mistakes, not gaps: his quick count also matched single words of a name, so "Yngol" in *Yngol's Barrow* picked Yngol's Shade, "Champion" picked the Champion of Boethiah, and "Shatter-Shield" picked Torbjorn for Return Aegisbane. Where the two counts name different people, WO-99's is the better one: Froki Whetted-Blade for Kyne's Sacred Trials (Bob's picked a mudcrab spirit), Septimus Signus for Discerning the Transmundane, Fralia Gray-Mane for Missing In Action. One to fix in the rule: *Unbound* (the main quest's first) gets "Prisoner"; it has no giver, so a person whose name is a role ("Prisoner", "Courier") shouldn't count.
