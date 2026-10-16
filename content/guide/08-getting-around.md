---
chapter: 8
title: Getting around
subtitle: Carriages, ferries, horses, the fast travel settings, and locked doors and chests.
icon: chapter-getting-around
---

{{Fast travel}} is switched off in LoreRim. You travel on foot, by carriage, by ferry or on a horse, and time passes on the way, so your needs keep rising during long trips.

## Fast travel {#fast-travel}

Fast travel is off by default. Turning it on takes two changes:

1. {{MCM}} > {{Requiem}} > Atmosphere > Allow fast travel.
2. In `LoreRim\mods\LoreRim - MCM and INI Settings\SKSE\Plugins\SurvivalModeImproved.ini`, set `bDisableFastTravel=0`.

{{Hunger}}, {{thirst}}, disease and some quests can still stop you fast travelling.

:::mods
- **Requiem - The Roleplaying Overhaul**: The first fast travel switch.
  - nexus: 60888
  - where: MCM > Requiem > Atmosphere
- **Survival Mode Improved - SKSE**: The second fast travel switch. It has no MCM.
  - nexus: 78244
  - where: `SKSE/Plugins/SurvivalModeImproved.ini` in LoreRim - MCM and INI Settings
:::

:::ask{q="I learned Apparition. Why can't I fast travel?"}
Apparition makes fast travel instant once fast travel is turned on. It doesn't turn it on.
:::

## Carriages and ferries {#carriages}

Carriage drivers wait outside the cities and in more towns than in Skyrim without mods. Ferrymen work from the docks. Both let you pick a marked place on the map, and the fare depends on the distance: 10 to 400 gold. Time passes during the ride. An innkeeper can also call a carriage for you.

:::more
- Places marked as dangerous cost more to reach.
:::

:::mods
- **Better Carriage Destinations**: Travel to any place on the map, priced by distance.
  - nexus: 164485
  - where: `MCM/Settings/Better Carriage Destinations.ini`
- **Carriage and Ferry Travel Overhaul**: More drivers and ferrymen.
  - nexus: 8379
- **Wait Carriage in Inns**: Innkeepers call a carriage.
  - nexus: 83044
:::

## Horses {#horses}

Stables sell horses for 1,500 gold. A horse carries 300, and enemies can't kill it. You can also get one through the Running Wild quest in the fields outside Whiterun: catch a wild white horse, then sell it to the stablemaster or give it to Joslin behind the Bannered Mare (Whiterun's inn) to keep it.

The [[H]] key controls your horse:

- Tap [[H]] while looking at it, or while riding: open its {{saddlebags}}.
- Tap [[H]] anywhere else: whistle. The horse switches between waiting and following.
- Hold [[H]]: the horse comes to you.
- Hold [[H]] while looking at it: rename it.

:::more
- [[Shift]] + [[E]] on your horse also opens the saddlebags.
- Your horse's saddlebags are safe storage as long as the horse lives.
:::

:::mods
- **Simplest Horses (and other mounts)**: The H key, saddlebags and protected horses.
  - nexus: 54225
  - where: MCM > Simplest Horses
- **Animated Whistling**: The whistle.
  - nexus: 76733
:::

:::ask{q="The stablemaster says I don't have a horse"}
For horse armor, the stablemaster only counts a horse you bought at a stable or the horse you last rode. A tamed horse or the one from Running Wild only counts as the one you last rode, so ride it to the stable, get off next to it, then ask.
:::

## Locks {#locks}

Every lock has a level, from Novice to Master, and you need enough {{lockpicking expertise}} to even try it. Without it, the lock screen closes and tells you how much you need. Perks in the {{Wayfarer}} tree, the Tower {{birthsign}} and some {{shrine}} blessings raise your expertise.

There are three ways past a lock you can't pick: find its key (many locked chests have a key hidden nearby), bash it open with a weapon, or let a {{follower}} with more expertise try.

:::more
| Lock | Expertise needed |
| --- | --- |
| Novice | 1 |
| Apprentice | 3 |
| Adept | 5 |
| Expert | 7 |
| Master | 9 |

- With no bonuses you count as 1. Bonuses add up from 0: Cheap Tricks (Wayfarer, no skill needed) +3, Advanced Lockpicking (25) +2, Sophisticated (60) +2, Masterly (90) +2, {{Khajiit}} +2, {{Tower birthsign}} +4, the Skeleton Key +10. So an unperked Khajiit has 2, and 5 with Cheap Tricks.
- Lock bashing: your current {{Health}} plus {{Stamina}} must reach 150 for a Novice lock, 300 for Apprentice and 450 for Adept. Expert and Master locks can't be bashed. A broken-lock icon shows when a hit will work. Fists don't work, and bashing is a crime if someone sees it.
- A key in your inventory opens its lock with no expertise.
:::

:::mods
- **Requiem - Lockpicking SKSE**: Lockpicking expertise.
  - nexus: 172898
- **Lock Bashing**: Bashing locks open.
  - nexus: 165491
  - where: `SKSE/Plugins/LockBashing.ini` in LoreRim - MCM and INI Settings
- **Locked Chests Have Keys**: Keys hidden near locked chests.
  - nexus: 74565
:::
