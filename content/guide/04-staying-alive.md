---
chapter: 4
title: Staying alive
subtitle: Hunger, thirst, fatigue, cold and disease, and how to keep them in check.
icon: chapter-staying-alive
---

LoreRim runs Skyrim's {{Survival Mode}} from the start of every game, with {{thirst}} added. You need to eat, drink, sleep and stay warm. Each need gets worse with time, and the worse it gets, the more it weakens you.

## Your needs {#needs}

There are four needs. Each one rises over game time and moves through stages. You can see your current stage as an icon on the {{HUD}}, and in {{Active Effects}} (open the Magic menu with [[P]], then Active Effects). The first stage of each is a small bonus. The last stage of hunger, thirst and cold drains your health; the last stage of fatigue stops your {{Magicka}} coming back.

| Need | Rises with | Fix | Takes from |
| --- | --- | --- | --- |
| {{Hunger}} | Time | Food | Maximum {{Stamina}} |
| {{Thirst}} | Time | Drink | Stamina regeneration |
| {{Fatigue}} | Time awake | Sleep | Maximum Magicka |
| {{Cold}} | Cold places, weather, night, water | Warm clothes, fires, hot food | Maximum {{Health}} |

Game time runs at 10 times real time: one {{game hour}} passes every 6 real minutes. From a full stomach you are Hungry after 12 game hours, a little over an hour of real play.

:::more
- Hunger: Well Fed, Fed, Peckish (warning), Hungry (no Health regeneration, more damage taken), Famished, Starving (lose 1 Health per second). It rises 10 per game hour, plus a tiny amount for health you lose. Peckish at 80, Hungry at 120, Starving at 300.
- Thirst: Quenched, Hydrated, Parched (warning), Thirsty (Stamina drains, slower movement), Dehydrated ({{power attacks}} cost twice the stamina, less weapon damage), Severely Dehydrated (lose 1 Health per second). It rises 5 per game hour. Spending stamina adds very little.
- Fatigue: Refreshed (hostile spells weaker), Languid (warning), Tired (no Magicka regeneration), Weary (worse prices), Debilitated. It rises 15 per game hour awake. Casting spells adds very little.
- Cold: Warm, Comfortable, Chilly (warning), Very Cold, Freezing, Numb (lose 1 Health per second).
:::

:::mods
- **Survival Mode Improved - SKSE**: Hunger, fatigue and cold, and Survival Mode itself.
  - nexus: 78244
  - where: `SKSE/Plugins/SurvivalModeImproved.ini` in LoreRim - MCM and INI Settings
- **DVSMP Survival Tweaks**: Thirst.
  - tag: LoreRim's own mod
- **Survival Control Panel**: Survival HUD icons, warmth values and sleeping to level up.
  - nexus: 41891
  - where: MCM > Survival Control Panel
:::

## Food and drink {#food}

Food lowers hunger by its size: a raw vegetable or an ale very little, a stew a lot. Cooked food also gives bonuses, such as restoring or raising your Health and Stamina for a while. Eat before a fight.

Every drink lowers thirst by the same amount: water, ale, mead, wine and any soup or stew. Brandy, flin, sujamma, rum and other spirits do nothing for thirst. Water also gives a buff called **Hydrated** (the same name as a thirst stage): food bonuses 20% stronger for 15 minutes.

A waterskin holds water for the road. Make one at a {{tanning rack}} (the wooden frame for stretching hides, found at blacksmiths and hunters' camps) from 1 Leather and 1 Leather Strips. To fill it, use it from your inventory while you stand in water, or ask an innkeeper. It never breaks.

:::more
- Food restores 5, 20, 40 or 80 hunger by size. A stew is the largest: one takes you from Starving to Famished, two to Hungry, three to Fed.
- A drink restores 100 thirst, about 20 game hours of thirst. Two drinks a day keeps you Quenched.
- Hot soups and stews also warm you.
:::

:::mods
- **Waterskin - Stay Hydrated in Tamriel**: The waterskin.
  - nexus: 110895
- **[Optional] Disable Thirst**: Turns thirst off.
  - tag: LoreRim's own mod
  - tag: Optional in MO2, off by default
:::

:::ask{q="Can I turn thirst off?"}
Yes: tick "[Optional] Disable Thirst" in {{MO2}}. There is no {{MCM}} switch for it.
:::

:::ask{q="Do vampires get thirsty?"}
Yes, but the thirst warnings and stage effects never appear for a {{vampire}}. Drink as normal.
:::

## Sleep {#sleep}

Sleep clears fatigue, gives a rest bonus, levels you up when your {{XP}} bar is full, and sets where you wake if you die (as long as you carry {{Provisions}}).

You can sleep in any bed you own or rent, a bedroll, your camp, or at any lit campfire. Sleeping in your own bed or a rented room gives a bigger bonus.

:::more
- Fatigue drops 40 per hour of sleep. Eight hours clears it from Tired or Weary; from Debilitated it takes 11.
- Rest bonuses last 8 game hours: Rested +25% Magicka and Stamina regeneration, Well Rested (your own bed or a rented room) +50%, Lover's Comfort (with your spouse) +75%.
- You can't rest at a giant's campfire.
:::

:::mods
- **Rest By Campfire - Base Object Swapper**: Resting at any lit campfire.
- **Take a Nap - Sleep on Chairs**: Napping in chairs.
:::

:::ask{q="Why can't I sleep or wait?"}
Check these, in this order:

- Thirst: look for the "dry mouth" message and drink.
- Hunger.
- Disease, including turning into a vampire.
- Enemies nearby.
- An owned bed (a yellow "Bed" prompt).
- Poison.

Try another bed or an inn.
:::

## Cold {#cold}

How fast you get cold depends on where you are, the weather, the time of day and whether you are wet. In mild regions you barely get colder. In a blizzard on a mountain you can go from warm to Numb in about two game hours.

Clothes and armor slow it down; each piece has a warmth value. Fur and other warm gear count double, thin clothes half, and cloaks count too. Your warmth shows in the inventory. A lit torch in your hand adds as much as a full set of normal clothes on your body and head. To warm up, stand by a fire, go indoors or eat a hot soup.

Swimming in icy water makes you Numb at once. Get out and find a fire.

:::more
| Slot | Normal | Warm | Thin |
| --- | --- | --- | --- |
| Body | 30 | 60 | 15 |
| Head | 20 | 40 | 10 |
| Hands | 10 | 20 | 5 |
| Feet | 10 | 20 | 5 |
| Cloak | 30 | 60 | 15 |
| Lit torch | 50 | | |

- Warmth counts up to 200 and can slow your cooling by at most 75%.
- One set of plain farm clothes counts as thin.
- You can change any item's warmth in MCM > Survival Control Panel > Equipment.
:::

## Disease {#disease}

Hits in combat can give you a disease. Each disease gets worse in three stages. A disease can also stop you sleeping or waiting.

Shrines don't cure disease in LoreRim. Cures:

- **Potion of Cure Disease:** cures you 1 to 3 game days after you drink it. Ironwood Soup and Scrambled Flin work the same way.
- **Potion of Cure Greater Disease:** cures at once.
- **Cure Disease on Self** (an Adept {{Restoration}} spell): cures at once.

:::mods
- **[LoreRim] Cure Disease**: The delayed cure potion, and {{shrines}} no longer curing disease.
  - tag: LoreRim's own mod
:::

:::ask{q="Shrines don't cure my disease"}
Shrines don't cure disease in LoreRim, although the blessing text still says they do. Use a cure potion or the Restoration spell.
:::

## Camping {#camping}

Camping supplies are an item that lets you pitch a tent with a bedroll and a campfire almost anywhere outdoors. Use them from your inventory. Your camp gets a map marker, and sleeping there makes it your {{respawn point}} if you carry Provisions.

There are three levels, made at a {{forge}}:

| Supplies | Recipe | Adds |
| --- | --- | --- |
| Simple Tent and Campfire | 4 Iron Ingot, 8 Firewood, 6 Leather | Tent, bedroll, campfire for simple roasting, a chair, three storage containers |
| Sturdy Tent and Campfire | Simple supplies, 6 Steel Ingot, 8 Firewood, 6 Leather | Cooking pot, tanning rack, small {{smelter}} |
| Quality Tent and Campfire | Sturdy supplies, 4 Corundum Ingot, 4 Refined Moonstone, 8 Firewood, 6 Glass | {{Alchemy}} table, enchanting table |

You can't camp in cities, indoors, in combat, while swimming or while mounted. You can have one camp at a time.

:::mods
- **CC's Camping Expansion**: Camping.
  - nexus: 73354
  - where: MCM > Camping Expansion
:::

:::ask{q="Can I have more than one camp?"}
No. Pitching a new camp breaks the old one, and anything stored in it is lost. Break camp first ("break camp" at the tent) to get your supplies and stored items back.
:::

## Alcohol {#alcohol}

Alcohol makes you drunk in four steps: Tipsy, Drunk, Seriously Drunk and Dead Drunk. Being drunk blurs and brightens the screen, slows your regeneration and can knock you over. One ale makes you Tipsy, one mead Seriously Drunk, and one wine or brandy Dead Drunk for 10 to 15 minutes.

Drinks still quench thirst while you are drunk, and food bonuses keep working.

:::more
- Once you are Drunk, more drinks don't make you drunker.
- From about Tipsy on, there is a chance every minute that you fall over: 4%, rising to 20% when Dead Drunk.
- The Alchemy {{perk}} Drunken Combat (level 10) removes the bad effects while you are Tipsy; its second rank (level 20) removes the blur. You must be Tipsy or Drunk when you take it. The Addict {{trait}} also stops the blur.
:::

:::mods
- **Requiem - The Roleplaying Overhaul**: Drunkenness and the blur.
  - nexus: 60888
- **[LoreRim] Alcohol Stumble**: Falling over when drunk.
  - tag: LoreRim's own mod
:::

:::ask{q="The screen is blurry and glowing"}
Most often it is Dead Drunk. Check Active Effects in the Magic menu. If Dead Drunk is still listed long after your last drink, open the {{console}} and type `help "gorak the trollslayer" 4`. Note the first two characters of the ID it shows, then type `player.setfactionrank XXAD382D 1`, with those two characters in place of XX.
:::

## Carrying things {#carry}

Carry weight is how much you can hold before you slow to a walk. Every race can carry 200, and leveling up never raises it. Perks, {{birthsigns}} and some traits raise it. Your horse carries 300. Followers carry 200, or 250 with Requiem's {{follower}} bonus.

:::more
- {{Wayfarer}} perks Cheap Tricks, Advanced, Sophisticated and Masterly Lockpicking: +25 each.
- {{Heavy Armor}} perk Fortitude: +20. The {{Destiny}} root perk: +25. {{Tower birthsign}}: +50. Hoarder trait: +200. {{Naaktiid}}: +100.
- Arrows and lockpicks weigh nothing.
:::
