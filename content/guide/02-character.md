---
chapter: 2
title: Making your character
subtitle: The choices LoreRim asks for at the start, in the order the game asks for them.
icon: chapter-character
---

After you close {{RaceMenu}}, LoreRim asks for several more choices before you leave the starting room. Some of them are permanent.

## The order of choices {#steps}

1. Race and appearance, in RaceMenu.
2. A {{birthsign}}.
3. Up to 3 {{major skills}} (+10 each) and up to 6 {{minor skills}} (+5 each).
4. Up to 2 {{traits}}.
5. The game mode: {{Naaktiid}} or {{Konahrik}}.
6. A {{start}}, chosen at the {{dragon statue}} in the {{Helgen}} inn.

Later, the first time you are outdoors, a box offers you a god to follow.

You also get 3 {{perk points}} before the first choice. Use mouse and keyboard until you have left the starting room, even if you play with a controller.

:::mods
- **Sky Signs**: The birthsign menu.
  - nexus: 147884
- **Starting Skills**: The major and minor skills menu.
  - tag: Part of LoreRim - MCM and INI Settings
- **Biggie Traits**: The traits menu.
  - nexus: 136384
- **Alternate Perspective**: The start menu at the dragon statue, with starts from New Beginnings and Adventurer's Start.
  - nexus: 50307
- **Callings**: Role-play experience for a custom character. It gives a start that makes sense, a bard playing the inn or a scholar reading every book in town, instead of opening on crabs, wolves and bandits. Not part of LoreRim.
  - tag: Not yet published
:::

:::ask{q="Can I change these later?"}
- **Birthsign:** no. {{Standing stones}} in the world are a separate bonus you can swap.
- **Perks:** Galathil, the face sculptor in the Ragged Flagon under Riften, removes all your {{perks}} and refunds the points. 100,000 gold, once per character. Free and repeatable in Naaktiid.
- **Traits:** you can remove one, and add one more through the {{main quest}}. See [Traits](#traits).
:::

:::ask{q="The F11 message won't go away and I can't leave the starting room"}
F11 shows LoreRim's list of keys, and the message goes away once you leave the starting room. Players report it gets stuck after alt-tabbing in the starting room, where many scripts are set up. Restart the character and don't alt-tab until you have left.
:::

## Race {#race}

Your race sets your starting {{Health}}, {{Magicka}} and {{Stamina}}, adds +15 to one skill and +10 to five others, and gives racial abilities. Every race can carry 200.

| Race | +15 skill | Health / Magicka / Stamina |
| --- | --- | --- |
| {{Altmer}} | {{Alteration}} | 100 / 160 / 100 |
| {{Argonian}} | {{Alchemy}} | 140 / 120 / 100 |
| {{Bosmer}} | {{Marksman}} | 100 / 120 / 140 |
| {{Breton}} | {{Conjuration}} | 120 / 140 / 100 |
| {{Dunmer}} | {{Destruction}} | 100 / 140 / 120 |
| {{Imperial}} | {{Speech}} | 120 / 120 / 120 |
| {{Khajiit}} | {{Sneak}} | 100 / 100 / 160 |
| {{Nord}} | {{Two-Handed}} | 140 / 100 / 120 |
| {{Orsimer}} | {{Heavy Armor}} | 160 / 100 / 100 |
| {{Redguard}} | {{One-Handed}} | 120 / 100 / 140 |

Read each race's abilities on the race screen in RaceMenu. Altmer, Bosmer and Dunmer are elves; Argonians and Khajiit are the two beast races. Some gods only accept certain races (see [Gods and prayer](/guide/followers-gods-curses#gods)).

:::more
- The +10 skills: Altmer Conjuration, Destruction, {{Illusion}}, {{Restoration}}, {{Enchanting}}. Argonian One-Handed, {{Evasion}}, {{Wayfarer}}, Sneak, Restoration. Bosmer Evasion, {{Finesse}}, Sneak, Alchemy, Alteration. Breton Alchemy, Speech, Illusion, Restoration, Enchanting. Dunmer One-Handed, Evasion, Sneak, Conjuration, Illusion. Imperial One-Handed, Block, Heavy Armor, Destruction, Restoration. Khajiit One-Handed, Evasion, Finesse, Wayfarer, Alchemy. Nord One-Handed, Block, {{Smithing}}, Heavy Armor, Evasion. Orsimer One-Handed, Two-Handed, Block, Smithing, Destruction. Redguard Two-Handed, Marksman, Block, Smithing, Evasion.
- Argonians, Khajiit and Bosmer can brew potions at half strength without the first Alchemy perk. Other races need it (see [Alchemy](/guide/crafting-and-money#alchemy)).
- Khajiit have +2 {{lockpicking expertise}} (see [Locks](/guide/getting-around#locks)).
- No race has a weakness to an element or to magic.
- {{Vampires}} keep their racial abilities.
:::

:::mods
- **Requiem - Races Redone**: Racial abilities and starting values, with changes by LoreRim.
  - nexus: 42591
:::

## Birthsign and standing stones {#birthsign}

You choose one of 13 {{birthsigns}} right after RaceMenu. Each is named after a constellation and gives a large bonus that is always on. It is permanent.

The 13 {{standing stones}} in the world are separate. Touch a stone to take its bonus; you can hold one stone at a time and swap whenever you like. Once you have found all 13 you get a power that switches stones from anywhere. Stones give smaller bonuses than birthsigns, and the two stack.

| Birthsign | Effect |
| --- | --- |
| {{Warrior|sign-warrior}} | Health +60; all weapons +10% damage; +10 {{armor penetration}} with all weapons; unarmed +10 damage |
| {{Thief|sign-thief}} | Pickpocketing 50% easier; 40% harder to detect; +20% speed when sneaking; sneak without proficiency; 20% chance to avoid physical damage; 1% chance to take 50% more |
| {{Mage|sign-mage}} | Magicka +150; spells 30% stronger and longer while above 25% Magicka |
| {{Apprentice|sign-apprentice}} | Magic weakness +25%; +5 Magicka regeneration per second; spells 20% cheaper |
| {{Atronach|sign-atronach}} | Magicka +300; no Magicka loss when hit; +25% absorb chance; no natural Magicka regeneration |
| {{Lady|sign-lady}} | Health and Magicka +40, both regenerate 80% faster; run or swim without exertion |
| {{Lord|sign-lord}} | +15% {{magic resistance}}; +150 {{armor rating}}; restore 1.5 Health per second; 30% weakness to fire |
| {{Lover|sign-lover}} | 25% chance to take half physical and magical damage; prices 15% better; shouts 20% stronger |
| {{Ritual|sign-ritual}} | {{Soul gems}} restore 50% more charge; blessings 50% stronger; Ritual powers. Its text also says standing stone effects are 200% stronger; that was written for Requiem's stones and is untested with LoreRim's |
| {{Serpent|sign-serpent}} | +15 armor penetration with all weapons; poison does 50% less to you; most paralysis does not affect you; Serpent's Curse power |
| {{Shadow|sign-shadow}} | 50% harder to detect; sneak without proficiency; movement 30% quieter; Moonshadow power |
| {{Steed|sign-steed}} | +10% movement and sprint speed; Stamina +60; restore 1 Stamina per second; most slow effects do not affect you |
| {{Tower|sign-tower}} | More gold from kills; +50 carry weight; +4 lockpicking expertise; reflect 15% physical damage; +10% block |

:::more
Standing stones:

| Stone | Bonus |
| --- | --- |
| Warrior | Health +25 |
| Mage | Magicka +25 |
| Thief | Stamina +25 |
| Apprentice | Regain 0.3 Magicka per second |
| Lord | Regain 0.3 Health per second |
| Steed | Regain 0.3 Stamina per second |
| Lady | Buying and selling prices 10% better |
| Atronach | Magic resistance +5% |
| Lover | +100 armor rating |
| Tower | Reflect 5% of physical damage taken |
| Ritual | Conjuration spells cost 10% less |
| Serpent | Crafted potions and poisons 10% stronger |
| Shadow | Sneaking 10% more effective, footsteps 10% quieter |

- The Aetherial Crown lets you hold 3 stone effects at once.
- The Master of Destiny trait removes your birthsign.
:::

:::mods
- **Sky Signs**: The birthsign menu at the start.
  - nexus: 147884
- **Requiem - Birthsigns Redone**: The birthsign effects, with numbers changed by LoreRim.
  - nexus: 42591
- **[LoreRim] Doomstones**: The standing stone effects and the power to switch stones.
  - tag: LoreRim's own mod
:::

## Major and minor skills {#skills}

There are 18 {{skills}}, each from 0 to 100. Every skill starts at 10. Your race adds to some of them, then you pick up to 3 major skills (+10 each) and up to 6 minor skills (+5 each). Each {{major skill}} also gives you a few starting items for that skill.

A Khajiit who takes {{Two-Handed}} as a major skill starts it at 20 (10 base, 10 major). {{Sneak}} as a {{minor skill}} starts at 30 (10 base, 15 race, 5 minor).

Skills don't rise when you use them in LoreRim. After this, they go up with the points you get at each {{level-up}}, from {{trainers}}, and from a few rewards such as the Oghma Infinium, a book from a Daedric quest (see [Leveling up](/guide/first-days#level-up)). A skill can't go above 50 plus your level, so at level 1 the level-up menu can't raise any skill past 51.

LoreRim renames five skills: Light Armor is {{Evasion}}, Pickpocket is {{Finesse}}, Lockpicking is {{Wayfarer}}, Speechcraft is {{Speech}} and Archery is {{Marksman}}. Each still has its own {{perk tree}}, and some trees hold perks that have nothing to do with the old name (Wayfarer has the {{follower}}, animal taming and carry weight perks).

## Your god {#god}

LoreRim's religion comes from the mod {{Wintersun}}. The first time you are outdoors with your weapons free, a box offers you a starting god from your race's list. You can choose one or pick None. If you pick None, you can still join any god on your list later at their {{shrine}}.

Following a god gives you rules to follow ({{tenets}}), a bonus while you follow them, and a Pray {{power}}. See [Gods and prayer](/guide/followers-gods-curses#gods).

## Traits {#traits}

{{Traits}} are permanent abilities, each with a benefit and a drawback. You can take 0, 1 or 2 from a menu of 68. Your traits are listed under Magic > {{Active Effects}}.

Later you can add one more: in {{Sovngarde}}, near the end of the {{main quest|main-quest}}, Tsun gives you an Elixir of Hidden Potential. Drinking it opens the traits menu for one more pick.

You can also remove a trait: in Magic > Active Effects, select it and press the Ready Weapon key ([[R]] unless you changed it). It costs 1 {{dragon soul}}, and you don't get a new trait in its place.

| Trait | In-game text |
| --- | --- |
| Quester | Start with 50 less Health, Magicka and Stamina. Gain 2 of each per 1 quest completed, up to a maximum of +200 at 300 quests completed. |
| Wanderer | Start with 50 less stamina and -50% stamina regeneration rate. Gain 1 stamina and 1% stamina regeneration for every 2 locations discovered, up to a maximum of +200 stamina and +200% regeneration at 400 locations. |
| Self-Taught | For every 5 book or notes read, gain 1 point of Magicka, for up to 300 Magicka at 1500 read. However, you start with 100 less Magicka. |
| Skilled | Reading skill books grants an extra skill point and trainers cost 50% less, however every 5 levels you don't gain a perk point. |
| Hoarder | You love carrying stuff around, even if it's junk. Gain +200 carryweight. Selling prices are 50% worse. |
| Master of Destiny | You reject the influence of fate and star signs. Your birthsigns bonuses are removed, but you begin the game with 5 additional perk points and a permanent +5 boost to all skills. |

:::mods
- **Biggie Traits**: The traits menu and most traits, with LoreRim's number changes.
  - nexus: 136384
- **[LoreRim] Traits**: LoreRim's own traits, such as Quester, Wanderer and Self-Taught.
  - tag: LoreRim's own mod
- **[LoreRim] Tsun's Gift**: Tsun's Elixir of Hidden Potential.
  - tag: LoreRim's own mod
:::

:::ask{q="I missed Tsun's elixir"}
Tsun gives it once, in Sovngarde. If you missed it, the {{console}} can give it: `help "hidden potential" 4` shows its ID.
:::

## Naaktiid or Konahrik {#mode}

The last choice sets how hard the game is. {{Konahrik}} ("Classic LoreRim Experience") uses {{Requiem}}'s full rules. {{Naaktiid}} ("New to LoreRim") turns on {{Requiem Lite}}:

- +3 perk points.
- +25 Health, Magicka and Stamina, and faster regeneration.
- +100 carry weight.
- +25% magic resistance.
- No disarms, and most of Requiem's stamina penalties removed.
- Below level 5 you take half damage. The reduction shrinks by 5% every 5 levels and is gone at level 50.
- Resetting your perks is free.

You can turn Requiem Lite on or off later in its {{MCM}}. Leave the game's difficulty slider on Adept in both modes.

:::mods
- **Requiem - Lite**: Naaktiid mode.
  - where: MCM > Requiem Lite
  - nexus: 120272
:::

## Your start {#start}

Every game begins in the inn at Helgen, a town in the south of Skyrim, before the dragon attack that opens Skyrim's story. Walk to the dragon statue in the inn and choose a start; the menu comes from the mod {{Alternate Perspective}}. There are 25 starts, listed under More detail. Some ask a second question, such as which hold or which temple.

The start decides where you wake up and what you own. It doesn't change how you level. The main quest begins only when you start it at Helgen, so with any start you can decide later whether to play the {{Dragonborn}}.

:::more
- The starts in the menu: Regular (Inn), From Overseas, Wanted Criminal, Left for Dead, Forsworn, Guilds ({{College of Winterhold}}, {{Thieves Guild}}, Dark Brotherhood or {{Companions}}), Dragonborn (Helgen Keep start or end), Merchant, Mercenary, Pilgrim (Temple), Pilgrim (Shrine), Vampire, {{Werewolf}}, Jailed, Thalmor Prisoner, Alchemist, At Angi's Camp, Beggar, Addict, Dwemer Ruin, Bounty Hunter, Roadside Ambush, Prisoner in a Bandit Fort, Fell in a Spike Pit and Out in the Wilderness.
- The starts from New Beginnings (Merchant, Mercenary, both Pilgrims, Vampire, Werewolf, Jailed, Thalmor Prisoner, Alchemist, At Angi's Camp, Beggar, Addict, Dwemer Ruin) each end with a short quest worth 200 {{XP}}. The temple pilgrim's quest finishes when you leave the temple.
- The guild starts make you a member. The College start skips Faralda's entry test. The Companions start leaves two short errands. The Thieves Guild start leaves Taking Care of Business to do.
- The {{Forsworn}} start and the Reach in general are not level 1 country: Forsworn are level 25 to 39.
- The Werewolf start puts you at Frostmoon Crag on {{Solstheim}}.
:::

:::mods
- **Alternate Perspective**: The start menu and its starts.
  - nexus: 50307
- **New Beginnings**: The New Beginnings starts.
  - nexus: 57818
- **Adventurer's Start**: The bounty hunter, ambush, bandit fort, spike pit and wilderness starts.
  - nexus: 145599
- **LoreRim - MCM and INI Settings**: LoreRim's own list of which starts the menu offers.
  - tag: LoreRim's own mod
:::

:::ask{q="How do I start the main quest?"}
Go to Helgen. Rent the best room at the inn and sleep to play the opening, or talk to the dragon behind the inn to skip it. Finish any waiting level-up first; a pending level-up breaks the start. Dragons appear only once the main quest is under way.
:::

:::ask{q="Which start should I pick?"}
Players warn about two: the Pilgrim (Shrine) start at Stendarr's Beacon is attacked by the {{Thalmor}}, and the Dwemer Ruin start leads through a {{Dwemer ruin}} into {{Falmer}} of level 24 and up.
:::
