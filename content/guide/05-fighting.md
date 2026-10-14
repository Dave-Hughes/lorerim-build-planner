---
chapter: 5
title: Fighting
subtitle: How combat works in LoreRim, and what is different from Skyrim without mods.
---

LoreRim's combat comes from Requiem. Enemies have fixed levels, your health doesn't regenerate on its own, and every swing, block and dodge uses stamina.

## Enemy levels and damage {#enemies}

Every enemy has a fixed level that does not change as you level up. An ordinary bandit is anywhere from level 3 to 24, and about one in four is level 12 or higher. A bandit camp's boss is level 19 or 24. A camp is as dangerous on your first day as later on, so check what you are walking into.

Armor reduces physical damage by 1% for every 10 points, up to 75% at 750 armor. Your health doesn't regenerate on its own: use potions, food, healing spells or sleep. A few racial abilities and birthsigns, and being well fed, give some regeneration. The difficulty slider has no effect in LoreRim; leave it on Adept.

Hits you don't block also make you bleed and lower your armor for a few seconds.

:::more
- Bandit levels and how often each appears: 3 (29%), 7 (26%), 10 (23%), 12 (14%), 19 (6%), 24 (3%).
- From level 20, enemies of level 20 to 49 that are below your level gain, for each level of difference, +10 health, +20 armor and higher weapon skills. Enemies below level 20 are never changed.
- Enemies of level 20 or higher have a 4% chance to be legendary: double health, and they heal once when nearly dead. They have no glow or name tag. They give extra XP.
- Each weapon hit you don't block lowers your armor for 10 seconds and makes you bleed 1% of your health over 5 seconds. Blocking, dodging or a ward prevents it.
- Enemies can't kill you with a killmove.
:::

:::mods
- **Requiem**: Fixed enemy levels, armor and resistances, no health regeneration, and the difficulty slider.
- **[Hard] Dynamic Stat Scaler**: Makes enemies of level 20 to 49 tougher when they are below your level. Bosses of level 50 and up and dragons are scaled too.
  - tag: Optional in MO2, on by default
- **Engaging Combat**: Bleeding and lowered armor from hits you don't block.
  - where: Turned off by the optional `[Easy] Turn Off Engaging Combat`
  - tag: Optional in MO2
- **Legendary Enemies**: Legendary enemies.
  - where: `MCM/Settings/Legendary Enemies.ini`
:::

:::ask{q="Does the difficulty slider do anything?"}
No. Requiem sets every difficulty to the same damage. For an easier game, choose [Naaktiid](/guide/character#mode) at character creation, or turn on Requiem Lite in its MCM later.
:::

:::ask{q="Why won't this enemy's health bar go down?"}
It is probably a legendary enemy: double health and one heal near death.
:::

## Stamina {#stamina}

Attacks, power attacks, blocking and dodging all use stamina. At 10 stamina or less you deal half damage, block a quarter as well and can't stagger enemies (see [Blocking and stagger](#block)). When stamina is low, step back until it refills.

Power attack is the middle mouse button. It costs 40 stamina plus twice the weapon's weight: 74 for a steel greatsword. Perks lower the cost. Once you start a swing, you can't cancel it by moving, and turning is slow until it finishes.

:::more
- Heavier armor raises the stamina each swing costs. Higher weapon skill lowers it.
- You can power attack with no stamina, but the hit does half damage.
- Repeated left clicks chain light attacks into a combo. A light attack can lead into a power attack.
- Without the Heavy Armor perk Conditioning, wearing heavy armor drains stamina.
:::

:::mods
- **Requiem**: Stamina cost of attacking and blocking, and the penalties at low stamina.
- **One Click Power Attack NG**: Power attack on the middle mouse button.
  - where: `MCM/Settings/OCPA.ini` in LoreRim - MCM and INI Settings
  - tag: Key can be changed
- **Attack MCO**: Combos, and the slow turning mid-swing.
  - where: The optional `[Easy] Remove Attack Commitment` lets you turn freely mid-swing.
  - tag: Optional in MO2
:::

:::ask{q="I can't turn while attacking"}
That is attack commitment. Tap block to cancel a swing, or turn on "[Easy] Remove Attack Commitment" in MO2.
:::

## Blocking and stagger {#block}

Block with right mouse. A weapon blocks 50% of a hit and a shield 75%, more with Block perks. Once you raise your block it stays up for at least half a second. [[V]] blocks when you hold a weapon in each hand or fight unarmed. You can also block with a spell in your hand.

Every character has poise, shown as a bar with their health. Hits lower it, and when it reaches zero the character staggers and can't act for a moment. Heavy weapons and unarmed hits do the most poise damage, arrows the least. After a stagger there is a short period where a character can't be staggered again.

:::more
- Your hits do 20% more poise damage than normal, and enemies' hits on you do 20% less.
- Poise: human 25, troll 50, bear 87, giant 137, dragon 175. Armor adds very little.
- When your swing hits an enemy's swing, one of them is parried. Weapon skill, weapon type, race and power attacks decide which.
- LoreRim has no timed block.
:::

:::mods
- **Requiem**: How much damage a block stops.
- **MaxsuBlockOverhaul**: Minimum block time and blocking with a spell.
  - where: `SKSE/Plugins/blockOverhaul.ini`
- **Dual Wield Parrying SKSE**: Blocking with V.
- **Chocolate Poise**: Poise and stagger.
  - where: `SKSE/Plugins/ChocolatePoise.ini`
- **Parrying RPG**: Parrying when two swings meet.
- **Break Stagger**: The period after a stagger where a character can't be staggered again.
:::

:::ask{q="Is there a timed block or parry button?"}
No. Parries happen automatically when two swings meet. Use the [dodge](#dodge) instead.
:::

## Stances {#stances}

There are four stances. Each changes your attack animations and gives a bonus with a drawback. You can switch at any time.

| Key | Stance | Bonus | Drawback |
| --- | --- | --- | --- |
| [[F1]] | High | Attacks ignore 20% of enemy armor | You take 20% more physical damage |
| [[F2]] | Mid | +10% critical chance and critical damage | You deal 10% less physical damage |
| [[F3]] | Low | +30% poise damage, +30% damage to staggered enemies | Enemies do 30% more poise damage to you |
| [[F4]] | Neutral | Default animations | None |

:::mods
- **Stances - Dynamic Animation Sets**: The four stances, their animations and their keys.
  - where: `SKSE/Plugins/dtryKeyUtil/config/custom/Stances.ini` in LoreRim - MCM and INI Settings
  - tag: Keys can be changed
- **Requiem - Modern Combat Rework**: The bonus and drawback of each stance.
:::

## Dodging {#dodge}

Dodge with [[Left Alt]]. It is a quick step with a short moment where you can't be hit, and it costs 10% of your maximum stamina.

You can't dodge until you take the Dodge perk in the Evasion tree. It needs Evasion 25, and either the Agility perk (Evasion) or the Conditioning perk (Heavy Armor).

:::more
- The moment where you can't be hit is set to 0.3 seconds; the step animation's own timing can override it.
- A dodge can cancel a light attack, but not a power attack.
- Enemies dodge too.
:::

:::mods
- **TK Dodge RE**: The dodge, its stamina cost and the perk requirement.
  - where: `SKSE/Plugins/tk-dodge.toml` in LoreRim - MCM and INI Settings. Edit this copy; it overrides the mod's own.
  - tag: Key can be changed
- **TK Dodge RE Addon**: The step animations.
- **Requiem**: The Dodge perk in the Evasion tree.
:::

:::ask{q="Left Alt does nothing"}
You don't have the Dodge perk yet. Raise Evasion to 25, take Agility (or Conditioning in Heavy Armor), then take Dodge.
:::

## Heavy, light or no armor {#armor}

Your armor skill is Evasion for light armor (Light Armor is renamed Evasion in LoreRim) or Heavy Armor. Each tree has perks that only work in its kind of armor.

- **Heavy armor:** take Conditioning first. Without it, heavy armor drains stamina while you wear it.
- **Light armor:** Evasion perks make you faster and harder to hit, and lead to the Dodge perk.
- **No armor:** the Unarmored perk (Evasion 25, after Agility) gives a 20% chance that a physical hit does no damage. Armor spells such as Oakflesh give you armor instead.

A piece of clothing that is tagged as light or heavy armor counts as armor for these perks, even when its armor rating is 0. Check the item card: if it says Light or Heavy, it counts.

:::more
- Unarmored perk, rank 1: 20% chance a physical hit does no damage, +5% speed, +10% armor penetration, with no light or heavy armor worn. Rank 2 (Evasion 50): +10% physical damage, and spells 10% stronger and longer.
- Meteoric Reflexes (Evasion 100): 50% chance to take half damage from hits and spells, without heavy armor. It takes 7 perks to reach.
- Oakflesh gives 100 armor for 60 seconds. With the Alteration perk Improved Mage Armor and no chest armor, it gives 150.
:::

:::mods
- **Requiem**: The Evasion and Heavy Armor trees, and armor spells.
- **Ordinator - Perks of Skyrim**: Some of the Evasion perks, edited for LoreRim.
:::

## Archers {#archers}

Bandit archers are dangerous early on. Their arrows ignore part of your armor, and a few arrows can empty a low-level character's health. Kill archers first. Move sideways or stay behind cover while they shoot.

Archers with low skill miss more often, and arrows do half the usual poise damage, so they rarely stagger you.

:::more
- Calculated from the game's records: an iron arrow from a level 3 bandit archer does about 100 damage to a level 1 character with 150 armor.
- Bandit archers have Ranged Combat Training: +20% damage, and your armor counts only 75% against their arrows.
- A blocked arrow bounces off.
:::

:::mods
- **Requiem**: Archer perks and arrow damage.
- **NPCs Learn to Aim**: Archers' accuracy depends on their skill.
- **Chocolate Poise**: Arrows do half poise damage.
:::
