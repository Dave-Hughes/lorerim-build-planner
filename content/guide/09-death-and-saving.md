---
chapter: 9
title: Death and saving
subtitle: What happens when you die, and how to save without damaging your game.
icon: chapter-death
---

Dying in LoreRim usually doesn't end the game. You lose some {{XP}} and gold and wake somewhere safe, and LoreRim's team recommends that you keep playing after a death and don't load a save. Saving and loading need more care than in Skyrim without mods, because a large {{modlist}} runs many scripts in the background.

## When you die {#death}

When your health reaches zero you fall, and after 10 seconds the screen fades. You lose 10% of your progress toward the next level (never a whole level) and 10% of your gold. The gold goes to whoever killed you, so kill them and take it back. Creatures take no gold. You keep all your items.

Where you wake depends on {{Provisions}}, an item general goods merchants sell:

- **With Provisions:** at the last bed you slept in or the last campfire you rested at. One Provisions is used up.
- **Without Provisions:** in the {{Hall of the Dead}} of the hold you died in.

Enemies you killed stay dead, and the place you died in stays as you left it.

:::more
| Where you died | Where you wake without Provisions |
| --- | --- |
| Eastmarch, the Pale, Winterhold | Windhelm Hall of the Dead |
| Falkreath Hold | Falkreath Hall of the Dead |
| Haafingar, Hjaalmarch | Solitude Hall of the Dead |
| The Reach | Markarth Hall of the Dead |
| The Rift | Riften Hall of the Dead |
| Solstheim | Raven Rock |
| Whiterun Hold and anywhere else | Temple of {{Kynareth}}, Whiterun |

- If you haven't slept or rested at a campfire yet, or you die very close to your {{respawn point}}, you wake in the Temple of Kynareth in Whiterun.
- If nothing killed you (a fall, drowning), your lost gold is left in a grave marker where you died.
- Dying in a beast form (as a {{werewolf}}, werebear or {{vampire}} lord) sends you to the main menu.
:::

:::mods
- **Respawn - Soulslike Edition**: Dying and waking up, and the XP and gold you lose.
  - nexus: 69267
  - where: MCM > Respawn - Death Overhaul
  - tag: On the official safe-to-change list
- **[LoreRim] RP**: The Provisions rule.
  - tag: LoreRim's own mod
:::

:::ask{q="Should I load a save after dying?"}
LoreRim's team recommends using the respawn. If you do load, quit to desktop and restart the game first (see [Saving safely](#saving)).
:::

:::ask{q="My respawn ignored my camp"}
Sleep or rest at the camp to make it your respawn point, and carry Provisions. If you die very close to your respawn point, you wake in Whiterun instead.
:::

## Places where death is final {#no-respawn}

In a few places the respawn doesn't work, and the game tells you "You will surely perish" when you die there. If you die in one of these places, load a save. They include Halldir's Cairn, Dimhollow Crypt, Shroud Hearth Barrow, Serpent's Bluff Redoubt, the Thalmor Embassy, Kolbjorn Barrow, Gyldenhul Barrow, Ancestor Glade, Skuldafn, Folgunthur, Volskygge, the East Empire Warehouse, the abandoned house in Markarth, the inside of Azura's Star and Dead Men's Respite.

## Saving safely {#saving}

- Quit to desktop and restart before you load a save. Loading while the game is running can leave scripts stuck and carry problems into later saves.
- Don't save during scripted scenes, right after entering a new area, or several times in a row.
- You can't save or load during combat.
- [[F5]] {{quicksaves}} are full saves, so they fill the save folder like normal saves. Avoid [[F9]] (quick load).

The game also saves on its own every 15 minutes, rotating through 3 {{autosave}} slots. In the Ultra {{profile}} it doesn't save when you rest, wait or travel; Default also saves when you rest. Make a normal save before a dungeon.

:::more
- To load without restarting, be out of combat, not travelling, and wait about 60 seconds first.
- A save's file name includes your level and where you were.
:::

:::mods
- **STB No save and load in combat**: Blocks saving and loading in combat.
  - nexus: 148590
- **Engine Fixes**: Makes quicksaves full saves.
:::

## Where your saves are {#files}

Saves are in `LoreRim\profiles\[your profile]\saves`. Each save is two files, an `.ess` and an `.skse`; copy or delete both together. A save works in the profile it was made in, and between Ultra and Extreme (see [Default, Ultra and Extreme](/guide/what-lorerim-changes#profiles)).

Screenshots taken with Print Screen go to `LoreRim\overwrite\Root`.

:::ask{q="Where are my crash logs?"}
In `Documents\My Games\Skyrim Special Edition\SKSE`, named `crash-` followed by the date.
:::
