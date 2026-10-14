---
chapter: 6
title: Magic
subtitle: How spells are learned, what they cost, and how armor spells and enchanting work.
icon: chapter-magic
---

Magic in LoreRim comes from {{Requiem}} and its magic mod, Requiem - Magic Redone, with many more mods that add spells. Spells are expensive until you take the {{perks}} for them, {{Magicka}} comes back slowly, and learning a new spell takes a ritual.

## Spell tiers and perks {#tiers}

Every spell belongs to one of five schools of magic ({{Alteration}}, {{Conjuration}}, {{Destruction}}, {{Illusion}} or {{Restoration}}) and a tier: Novice, Apprentice, Adept, Expert or Master. Each school's tree has one perk per tier, at skill 0, 25, 50, 75 and 100.

A {{tier perk}} does two things for spells of that tier in that school: it makes them much cheaper, and it makes them grow stronger and last longer as your skill rises. You can cast a spell without its perk, but it costs full price and only grows at the rate of the highest tier perk you hold in that school (not at all if you hold none). Your skill level on its own doesn't lower spell costs.

Casting the same spell with both hands ({{dual casting}}) needs the school's Empowered perk (skill 25). A dual-cast spell is 2.2 times as strong for twice the Magicka.

Magicka regenerates about a third as fast as in Skyrim without mods, and at half that rate during a fight.

:::more
| Tier perk | Alteration, Conjuration | Destruction, Illusion, Restoration | Growth per skill point |
| --- | --- | --- | --- |
| Novice (0) | 40% of the cost | 40% | 1% |
| Apprentice (25) | 45% | 50% | 2% |
| Adept (50) | 50% | 45% | 3% |
| Expert (75) | 55% | 55% | 4% |
| Master (100) | 60% | 60% | 5% |

- Example: Firebolt does 30 damage. With Apprentice Destruction at skill 50 the game files give 60.
- Magicka regeneration per second: {{Khajiit}} 1.05% of maximum, {{Nord}} 1.0%, {{Imperial}} 1.1%, {{Breton}} 1.15%, {{Altmer}} 1.2%.
- Restoration's Mental Acuity perk (25) gives +50% Magicka regeneration.
- Illusion spells work on enemies up to a level limit, which perks and dual casting raise.
:::

:::mods
- **Requiem - Magic Redone**: Spells, perks and costs, with numbers changed by LoreRim.
  - nexus: 59302
- **Dual Casting Fix**: Stops other spells from cancelling a dual cast.
  - nexus: 92454
:::

:::ask{q="Why are my spells so expensive?"}
Take the tier perk for the spells you use. The Novice perk alone cuts Novice spells in that school to 40% of their cost. Gear that lowers a school's spell costs (Fortify Alteration and so on) helps too.
:::

## Learning spells {#learning}

Reading a {{spell tome}} doesn't teach the spell straight away. It starts the {{Rite of Arcana}}, a ritual:

1. Read the tome. It tells you how hard the attempt will be and asks whether to try.
2. Say yes and a spell called Arcane Anchor appears in your hand. Cast it to start.
3. Your Magicka drains for a while. Each cast of the Anchor turns some of your {{Health}} into Magicka. Recast it whenever Magicka runs low.
4. If your Magicka lasts until the ritual ends, you learn the spell. If it runs out, you fail and your Magicka regeneration is 40% lower for a while. Failures stack.

Tomes are not used up, so you can try again. If your maximum Magicka can't pay for the spell once, you can't win the ritual.

When you take a tier perk, a menu offers you free tomes from that tier: 2 for Novice to Expert, 1 for Master. Every {{court wizard}} sells all the core Novice and Apprentice tomes of all five schools. College teachers sell their own school's tomes up to Expert.

:::more
- What makes the ritual easier: your skill in the school (most of all), a lower cost for the spell (perks and Fortify gear count), more Magicka and Health, your other magic skills, and your level.
- Novice tomes get easier as the school rises from 0 to 25, Apprentice tomes from 25 to 49.
- Drink Health potions during the ritual if you need to. Magicka potions make the ritual harder.
- Cancelling once the ritual has started (lowering your hands, jumping, mounting, being {{staggered}}) gives nothing and still applies the penalty. To back out, read the tome again before you cast the Anchor.
- Some places can give you an Arcane Confluence when you enter: more Magicka and regeneration for a while, and an easier ritual for 60 seconds.
- Tomes with a Self and a Target version, such as Oakflesh, teach both.
- Without the College start, Faralda doesn't sell the entry spell. Buy the tome from a court wizard and learn it, or come back after The Way of the Voice (the main quest step at High Hrothgar where you learn a shout) and use a {{shout}}.
:::

:::mods
- **Rite of Arcana**: The learning ritual.
  - nexus: 168649
- **Requiem - Improved Spell Learning**: Free tomes when you take a tier perk.
  - nexus: 74010
- **Requiem - Customizable Spells Per Perk**: How many free tomes each perk gives.
  - nexus: 124891
  - where: MCM > Requiem - Customizable Spells Per Perk
- **Don't Eat Spell Tomes**: Tomes are kept after reading.
  - nexus: 43095
:::

:::ask{q="Learning a spell drained all my Magicka"}
That is the ritual. Take the tier perk first, wear gear that adds Magicka or lowers the school's costs, start with full Health and Magicka, and recast the Arcane Anchor when Magicka runs low.
:::

:::ask{q="My spells or powers disappeared"}
You hid them with [[H]] in the magic menu. Show them again in [[F6]] > Magic Organizer.
:::

## Armor spells {#armor-spells}

The {{flesh spells}} raise your armor for 60 seconds at base. You can cast them in any armor. Improved Mage Armor (Alteration 25) makes them 1.5 times as strong with no chest armor on, or 1.2 times with chest armor.

| Spell | Tier | Cost | Armor | With Improved Mage Armor, no chest armor |
| --- | --- | --- | --- | --- |
| Oakflesh | Novice | 100 | 100 | 150 |
| Stoneflesh | Apprentice | 150 | 150 | 225 |
| Ironflesh | Adept | 200 | 200 | 300 |
| Ebonyflesh | Expert | 250 | 250 | 375 |
| Dragonhide | Master | 800 | 300 | 450 |

Your skill doesn't raise the armor amount, but it makes the spell last longer. The tier perk adds 1% (Novice) to 5% (Master) per skill point, so by the game files Oakflesh lasts 75 seconds at Alteration 25. Dual casting multiplies the armor by 2.2.

:::more
- Costs in the table are before perks. With Novice Alteration, Oakflesh costs 40.
- Dual-cast Stoneflesh with Improved Mage Armor and no chest armor gives 495 armor.
- Versatile Armor (Alteration 50): 20% less physical, fire, frost and shock damage while a flesh spell is on you.
- Stability (Alteration 50): Alteration spells last 1.5 times as long.
- Bonuses that make spells stronger, such as Unarmored rank 2 or Metamagic's stronger option, don't raise flesh armor. Unarmored rank 2's longer duration still applies, and so does Metamagic if you pick its longer option.
- Armor reduces physical damage by 1% per 10 points, up to 75% (see [Fighting](/guide/fighting#enemies)).
:::

## Wards and enemy mages {#wards}

Enemy mages use the same spells you do, scaled by their own perks and skill, and flesh spells on their own don't stop spell damage. By the game files, a bandit mage's Firebolt can do 60 damage. A {{ward}} in your other hand blocks spell damage while you hold it.

| Ward | Tier | Blocks | Cost per second |
| --- | --- | --- | --- |
| Lesser Ward | Novice | 25 | 15 |
| Steadfast Ward | Apprentice | 50 | 30 |
| Greater Ward | Adept | 75 | 45 |
| Superior Ward | Expert | 100 | 60 |

Magic resistance from all sources is capped at 75%.

:::more
- Sources of {{magic resistance}}: the Lord {{birthsign}} (15%), the Atronach stone (5%), Ward Mastery (+10% while holding a ward), the Resist Magic spell, and gear.
- Ward Mastery (Restoration perk, 50): wards cost half.
- Killing casters first and breaking line of sight also help.
:::

## Enchanting {#enchanting}

Anyone can use an {{arcane enchanter}}: break down an enchanted item to learn its enchantment, then put that enchantment on gear with a filled {{soul gem}}. Perks make enchantments stronger. Each item takes one enchantment until Enchantment Mastery (90).

A magic staff casts a spell from its own charge instead of your Magicka. Anyone can use one. Recharging an enchanted weapon or staff with a soul gem needs the first {{Enchanting}} perk, Enchanter's Insight.

:::more
- Enchanter's Insight (0): enchantments 25% stronger, recharge weapons, craft Novice staves and scrolls. Rank 2 (20): 50% stronger.
- Soul Gem Mastery (25): soul gems give 50% more charge, and you can make soul gems at a {{smelter}}.
- Corpus Lore (50) and Skill Lore (75): Health, Magicka and {{Stamina}} enchantments, then skill enchantments, 50% stronger.
- Enchantment Mastery (90): two enchantments on one item at 60% each. Artifact Enchanter (100): three at 50% each.
- Making a staff: at a {{forge}} with Enchanter's Insight, an unenchanted staff of the school, a lesser soul gem and knowing the spell. At Neloth's staff enchanter in Tel Mithryn, on {{Solstheim}}, you need no perk.
- Wand Mastery (50): +100% Magicka regeneration while holding a wand.
- Fortify Alteration and the other school enchantments lower that school's spell costs.
:::

:::mods
- **Requiem - The Roleplaying Overhaul**: Enchanting perks.
  - nexus: 60888
- **LoreRim - Staves and Wands Patch**: Staff and wand versions of the spell packs' spells.
  - tag: LoreRim's own mod
- **Temper and Recharge Services**: Court wizards and enchanting trainers recharge weapons for gold.
  - nexus: 129279
:::

:::ask{q="Why can't I recharge my staff?"}
You need Enchanter's Insight, the first Enchanting perk. Without it, a court wizard or enchanting trainer can recharge it for you.
:::

## Shouts {#shouts}

{{Dragon souls}} unlock {{shout}} words as in Skyrim without mods, and dragons appear once the {{main quest}} is under way. Many shouts take longer to recover in LoreRim. Slow Time takes 6 minutes after one word.

:::more
| Shout | Recovery (1 / 2 / 3 words, seconds) |
| --- | --- |
| Become Ethereal | 30 / 40 / 50 |
| Disarm | 30 / 35 / 40 |
| Dragonrend | 36 / 42 / 48 |
| Fire Breath, Frost Breath | 30 / 50 / 100 |
| Ice Form | 120 / 180 / 240 |
| Kyne's Peace | 40 / 50 / 60 |
| Marked for Death | 20 / 30 / 40 |
| Slow Time | 360 / 540 / 720 |
| Call of Valor | 240 / 240 / 240 |
:::
