---
chapter: 3
title: Your first days
subtitle: How you earn XP and level up, and where to go while your character is weak.
---

In LoreRim your level rises from what you do in the world: finishing quests, finding places and clearing dungeons. Using a skill or reading a book gives no XP. When the XP bar is full you sleep, and the level-up gives you points to spend on skills and perks.

## How you earn XP {#xp}

Finishing quests pays the most XP. Discovering a place pays a little, clearing a dungeon pays well, and kills pay according to how strong the enemy is compared to you. Small animals stop paying almost at once.

| Source | XP |
| --- | --- |
| Main, Daedric, Dawnguard and Dragonborn quests | 200 |
| Civil War quests | 150 |
| Side quests, guild quests and every missive (a note from a city job board, see [Jobs that pay XP](#jobs)) | 100 |
| Clearing a dungeon | 100, or 200 for forts, Nordic and Dwemer ruins and dragon lairs |
| Discovering a place | 10 |
| Kills | By enemy type and level |
| Brewing, enchanting, mining a vein, winning a speech check, pickpocketing, picking a lock | Small amounts (see More detail) |
| Jarl bounties, thane favors, miscellaneous quests, quest objectives, reading books, using skills | None |

:::more
- XP needed for the next level: 275 + 25 × your level. Level 1 to 2 takes 300, 9 to 10 takes 500, 19 to 20 takes 750.
- Kill XP: the enemy's base value × (enemy level ÷ your level)^0.8, at most ×3. Base values include mudcrab, wolf and skeever 2, draugr 5, any person 8, troll 8, bear 10, giant 15, dragon 75, dragon priest 100.
- A level 2 wolf is worth less than 1 XP once you are level 9. A level 12 bear is worth about 14 XP at level 8.
- Small sources: brewing a potion, enchanting or disenchanting 5; mining a vein empty 10; winning a persuade or intimidate check 5; pickpocketing 5% of the item's value (at most 10); picking a lock 2 (Novice) to 32 (Master); a Bards College book exam 50, 100 or 200.
- Smithing, tanning, smelting and cooking give no XP.
- Four College errands pay nothing: Tolfdir the Absent-Minded, Out of Balance and two more repeatable jobs. The temple quests The Heart of Dibella, The Book of Love and The Blessings of Nature also pay nothing.
- The level cap is 101.
:::

:::mods
- **Experience**: All character XP and the skill cap.
  - where: `SKSE/Plugins/Experience.ini` in LoreRim - MCM and INI Settings
- **Crafting Grants XP**: XP for brewing, enchanting and mining.
  - where: `MCM/Settings/Crafting Grants XP.ini`
- **Beneficial Speech Checks - Experience**: XP for speech checks.
- **[LoreRim] Thieving XP**: XP for pickpocketing and lockpicking.
- **Tome Trials**: Book exams at the Bards College.
:::

:::ask{q="Why did that quest give no XP?"}
It is probably a miscellaneous quest. Jarl bounties, thane favors and small errands are typed as miscellaneous and pay only gold. Only finishing the whole quest pays; the steps inside a quest give nothing.
:::

:::ask{q="Do I get less XP with a follower?"}
No. Followers don't cut your share, as long as you do part of the damage yourself.
:::

## Leveling up {#level-up}

When the XP bar is full, sleep in a bed. The level-up happens when you sleep. You confirm it by choosing +5 Health, Magicka or Stamina, then you spend your skill points.

Each level gives 30 skill points. One skill can rise by at most 5 per level, and the cost of each point goes up as the skill gets higher. Points you don't spend carry over to the next level-up. A skill can't go above 50 plus your level.

Trainers raise a skill by one point per session, without skill points. You get 5 sessions per level, and unused sessions carry over.

:::more
| Skill level | Cost per +1 |
| --- | --- |
| Below 25 | 1 point |
| 25 to 49 | 2 points |
| 50 to 74 | 3 points |
| 75 and up | 6 points |

- So 30 points buys +5 in six low skills, or +5 in one skill above 75.
- Choosing Stamina at level-up doesn't add carry weight.
- Trainer limits: Journeyman trainers teach up to 50, Expert to 75, Master to 100. No trainer can take you past 50 plus your level.
- The Skilled trait halves training costs.
:::

:::mods
- **Static Skill Leveling Rewritten**: Skill points at level-up, their cost and the +5 limit.
  - where: `MCM/Settings/StaticSkillLeveling.ini`, or MCM > Static Skill Leveling
- **Survival Control Panel**: The rule that you level up when you sleep.
  - where: MCM > Survival Control Panel > Sleep to level up
- **Simply Smart Training**: Unused training sessions carry over.
:::

:::ask{q="My XP bar is full but I didn't level up"}
Sleep in a bed. If you can't sleep, see [Why can't I sleep or wait?](/guide/staying-alive#sleep). To level up without sleeping, set MCM > Survival Control Panel > Sleep to level up to Always Disabled.
:::

:::ask{q="Do skills go up when I use them?"}
No. Using a skill gives nothing in LoreRim. Skills rise from level-up points and trainers, plus a few rewards such as the Oghma Infinium.
:::

## Perks and Destiny {#perks}

You get 1 perk point per level, 3 at the start and 3 more in Naaktiid. Spend them in the skill menu. Each perk needs a level in its skill, and most need the perk before them. The skill level that counts is your base skill: gear that raises a skill doesn't help.

The perk trees are Requiem's, with some perks from Ordinator and LoreRim. Read the perk text in the game; wikis for Requiem or Ordinator often don't match.

Smithing is the exception: its material perks come from books (see [Smithing](/guide/crafting-and-money#smithing)).

Destiny is a separate tree with its own 7 points, given at levels 2, 5, 10, 15, 20, 25 and 30. Open it from the Tab menu or the Destiny power. A line from the root to a final perk is 7 perks long, so you can finish one line.

:::more
- Some perks need a character level as well: Hunter, Mounted Combat, Drunken Combat, Gourmet, Herbalist, Shout Focus and Metamagic need level 10.
- Multi-rank perks cost one point per rank, and each rank has its own skill level.
- LoreRim's own in-game tips say crafting skills "can be a bit of a trap early on".
- The Destiny root perk gives +25 carry weight. Its second row gives 50% faster Magicka, Health or Stamina regeneration.
:::

:::mods
- **Requiem - The Roleplaying Overhaul**: Most perks.
- **Subclasses of Skyrim**: The Destiny tree.
- **[LoreRim] Respec**: Resetting your perks with Galathil.
:::

:::ask{q="Can I reset my perks?"}
Galathil, the face sculptor in the Ragged Flagon in Riften, removes every perk in the 18 skill trees and refunds the points. It costs 100,000 gold and works once per character, or free and as often as you like in Naaktiid. Destiny perks reset from the Destiny power for 2,500 gold per perk.
:::

## Where to go first {#where-to-go}

Enemies don't scale to your level, so where you go decides how hard the game is. A bandit can be anywhere from level 3 to 24, and a camp's boss is 19 or 24. Small camps where you can fight one or two at a time are the safest early fights.

A safe first stretch for a new character: Helgen, Riverwood and Whiterun. Around Whiterun, the Running Wild quest (catch a wild horse in the fields) and Cicero's broken cart at Loreius Farm each pay 100 XP with no fighting. Hamvir's Rest and the Ritual Stone are small early dungeons.

Bleak Falls Barrow is not an early dungeon, even though the main quest points there: its boss is level 40.

LoreRim holds back many quests until you are stronger. Almost every Daedric quest and The Forsworn Conspiracy wait for level 20, Hircine's for 25, and Dawnguard for 30.

:::more
| Place | Strongest enemy | Level |
| --- | --- | --- |
| Embershard Mine, Halted Stream Camp, Lost Knife Hideout, Pinewatch, White River Watch | Bandits and a bandit boss | 3 to 24 |
| Hamvir's Rest | A draugr warlock | 13, 21 or 30 |
| Greenspring Hollow | Three predators, most likely bears | 12 |
| Graywinter Watch | Five trolls and a bandit boss | 14 to 24 |
| Cracked Tusk Keep | Orc archers, a shaman and an orc boss outside, Ghunzul inside | 18 to 24 / 40 |
| Bilegulch Mine | Graza outside, Grakk the Crusher inside | 25 / 26 |
| Swindler's Den | Kematu and Alik'r guards | 30 to 35 |
| Valtheim Towers | Elsi the Spiker | 40 |
| Bleak Falls Barrow | Zulakaroth; two spiders can be level 55 to 60 | 40 to 60 |
| Wolfskull Cave | A necromancer | 50 |
| Dustman's Cairn | Herfodr Sun-Slayer | 55 |
| Shroud Hearth Barrow | Witch-Lord Grundvik | 60 |
| Fellglow Keep | Kyrrhala and six Slighted | 75 |

- Bandit levels: 3 (29%), 7 (26%), 10 (23%), 12 (14%), 19 (6%), 24 (3%).
- The Reach's Forsworn are level 25 to 39.
- The VIGILANT questline needs level 25 and The House of Horrors and the Dawnguard quest Kindred Judgment finished. Dragonborn's cultists come at level 25, after The Way of the Voice.
:::

:::mods
- **Delay Bleak Falls Barrow**: Balgruuf doesn't send you to Farengar at once. Ask Farengar about the dragons when you are ready.
- **Timing is Everything**: Level requirements for many quests.
- **[Hard] Dynamic Stat Scaler**: From level 20, enemies of level 20 to 49 get tougher when they are below your level. Bosses of level 50 and up and dragons are scaled too.
  - tag: Optional in MO2, on by default
:::

:::ask{q="It's too hard. Where should I go?"}
Stay near Whiterun at first and take jobs that don't need fighting: missives, Running Wild and Cicero's quest. Pick fights with small groups, retreat from any enemy that takes a third of your health in one hit, and eat food for its bonuses. MO2's "Optional - Difficulty" section has easier settings; most need a new game.
:::

:::ask{q="Why won't this Daedric quest start?"}
LoreRim holds most Daedric quests until level 20, and Hircine's until level 25.
:::

## Jobs that pay XP {#jobs}

These jobs can be repeated, and each pays XP.

- **Missives:** notes on the job board in every hold capital. Every missive pays 100 XP and some gold. New notes go up every 3 days, and a type you finished can come back.
- **Thieves Guild jobs:** 100 XP and 200 gold each. Most need no fighting. Brynjolf finds you in the Riften market during the day.
- **Companions jobs:** 100 XP each, from the Circle at Jorrvaskr in Whiterun. You need 3 jobs before Proving Honor.
- **College of Winterhold:** the first quest, First Lessons, is easy. Under Saarthal, the second, ends with a level 46 boss.
- **Fishing jobs:** 100 XP each. Catch a fish, then talk to Keerava at the Bee and Barb in Riften to start them.

:::more
- Near deliveries stay in the same hold. Distant deliveries, Track and Retrieve missives send you to another hold.
- Each type of missive has a 25% chance to appear when the board refreshes.
- Bounty missives (bandits, giants, dragons, fugitives) are paid by the hold's steward.
- Companions jobs only go to holds you have already visited. A clearing job can send you to a fortified camp. Players report the job doesn't expire, so you can leave it for later.
- Proving Honor is Dustman's Cairn, with Silver Hand of level 30 to 35 and a level 55 boss.
:::

:::mods
- **Missives**: The job boards, with LoreRim's patch that makes every missive a side quest.
  - where: MCM > Missives
:::

:::ask{q="How do missives work?"}
Take a note from the board and do what it says. Track a fugitive jobs have no marker: if the missive names two places, the target is on the road between them. To cancel a missive, use it from your inventory. Gathering missives can break, so skip them.
:::

## Money at the start {#money}

Gold is short early. Merchants pay about a quarter of an item's value and have little gold of their own, so loot sells for less than you expect. The jobs above pay some gold as well as XP. Thieves Guild jobs pay a steady 200 gold each; bounty missives pay more but mean a fight. Buying and selling, day jobs and crafting for gold are in [Crafting and money](/guide/crafting-and-money#trade).
