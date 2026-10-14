---
chapter: 1
title: What LoreRim changes
subtitle: The main differences from Skyrim without mods, and what you can safely change yourself.
---

LoreRim is a modlist for Skyrim Anniversary Edition, installed with Wabbajack and launched from Mod Organizer 2 (MO2). This guide is for version 5.0.4.8. Its gameplay is built on Requiem, a large mod that changes how levels, skills, combat and magic work, and LoreRim adds its own settings and mods on top.

## LoreRim and Requiem {#requiem}

Requiem gives every enemy a fixed level, so the world does not grow with you. A cave can hold a level 40 boss on your first day. (One exception: from level 20, an optional mod that is on by default makes outlevelled enemies of level 20 to 49 tougher. See [Fighting](/guide/fighting#enemies).) Requiem also stops your health regenerating on its own, makes every swing and block cost stamina, and changes every perk tree.

LoreRim then sets the numbers for most of its mods through its own settings mod and patches. Many mods also have a settings page in the Mod Configuration Menu (MCM), in the pause menu. A mod's page on Nexus describes that mod on its own, and LoreRim has often changed it. When a mod page and the game disagree, trust the text in the game.

:::more
- LoreRim 5.0.4.8 has about 3,900 mods and 3,400 active plugins.
- LoreRim's settings for most mods are in the mod `LoreRim - MCM and INI Settings`, which sits above almost every other mod in MO2. Its copy of a settings file is the one the game reads.
- LoreRim's own patches load last and change perks, quests, prices and Survival Mode values. Perk and spell descriptions in the game are LoreRim's versions.
:::

:::mods
- **Requiem - The Roleplaying Overhaul**: Fixed enemy levels, perk trees, combat and magic rules.
- **LoreRim - MCM and INI Settings**: LoreRim's settings for most mods.
  - where: `LoreRim\mods\LoreRim - MCM and INI Settings`
:::

:::ask{q="A mod page says something different from what I see in game"}
LoreRim changes the settings of many mods. The game's own text (perk descriptions, item cards, MCM pages) shows the values LoreRim uses.
:::

## The biggest differences {#differences}

- **Skills don't rise when you use them.** You get skill points at each level-up and spend them by hand. See [Leveling up](/guide/first-days#level-up).
- **XP comes from quests and places.** Quests, discovering places and clearing dungeons pay most. Killing small animals pays almost nothing. See [How you earn XP](/guide/first-days#xp).
- **You level up when you sleep.** A full XP bar waits until you sleep in a bed.
- **Your health doesn't regenerate on its own.** Potions, food, healing spells and a few racial abilities and birthsigns restore it. See [Fighting](/guide/fighting#enemies).
- **You need to eat, drink, sleep and stay warm.** See [Staying alive](/guide/staying-alive#needs).
- **Fast travel is off.** Carriages, ferries and horses take you between places. See [Getting around](/guide/getting-around#fast-travel).
- **Dying doesn't end your game.** You lose some XP and gold and wake at your last bed or campfire if you carry Provisions, or in a Hall of the Dead if you don't. See [Death and saving](/guide/death-and-saving#death).
- **Smithing perks come from books**, and spells are learned through a ritual. See [Crafting and money](/guide/crafting-and-money#smithing) and [Magic](/guide/magic#learning).

## Default, Ultra and Extreme {#profiles}

LoreRim comes with three profiles in MO2. Pick one from the list at the top of MO2 before you launch the game.

- **Default** is the lightest. It swaps many of the large world mods for empty stand-ins and uses lighter distant landscapes.
- **Ultra** loads the full world.
- **Extreme** loads the same mods as Ultra and adds heavier ENB effects and longer view distances.

Ultra and Extreme load the same plugins, so a save from one works in the other. Default loads different plugins, so its saves don't move to or from the other two.

:::more
- Default replaces 85 world plugins with empty versions (the mod `LoreRim - Performance Plugins`). Mods such as Nature of the Wild Lands are ticked in Default but don't load. It also has no grass cache.
- Extreme adds `[Extreme] Cabbage ENB - Lore Cut Enhanced` on top of the same ENB, and its own graphics settings: 8192 shadow maps, longer fade distances and longer load distances.
- LoreRim's recommended hardware for 1440p: Default, a 10th-gen Intel i7, RTX 3070 and a SATA SSD; Ultra, a 12th-gen i7, RTX 4070 and an M.2 SSD. Both with 32 GB RAM and a 40 GB pagefile.
:::

:::ask{q="Can I move my save to another profile?"}
Between Ultra and Extreme, yes: copy both files of the save (`.ess` and `.skse`) into the other profile's `saves` folder. Saves don't move to or from Default.
:::

:::ask{q="Can I switch profiles in the middle of a playthrough?"}
Only between Ultra and Extreme. Default loads different plugins, and a save made with one set of plugins can break with another.
:::

## What you can change {#changing}

LoreRim's support rules say that if you change the list, the staff can't help with problems that follow (Rule 11 on the Discord). Some changes don't count:

- RaceMenu and SmoothCam presets.
- Swapping the ENB (the lighting and graphics preset) for another one in MO2's ENB Options section.
- Changing hotkeys in an MCM or ini.
- The optional mods on LoreRim's "Safe to Modify" list, at the bottom of MO2, such as ReShade, Smooth Random Sprint, [Hard] Dynamic Stat Scaler and "Vampire sun immunity with helmet or hat". A few of them need a new game to switch off.
- The MCM settings on LoreRim's "Safe to Modify" list, such as the XP and gold you lose on death.

Updating LoreRim with Wabbajack deletes any mod you added yourself. Back up your saves before an update. A change in the first version number (4.x to 5.x) always needs a new game.

:::more
- The MCM changes on the official safe list: SkyUI sizes and hotkeys, Better Third Person Selection toggles, SmoothCam presets and keys, the True Directional Movement target-lock key, the One Click Power Attack key, Wintersun's favor rates and abandonment, the number of Crowded Streets NPCs, the Soulslike Respawn XP and gold loss, QuickLoot toggles, Swiftly Order Squad keys and Helmet Toggle.
- Ask in the Discord's #lorerim-modification channel before changing anything else.
:::

:::ask{q="Will an update delete my changes?"}
Mods you added are deleted. Changes you made to LoreRim's own files can be overwritten. LoreRim's staff suggest keeping your own ini edits in a separate mod named with `[NoDelete]` at the start, using the same folder layout as the original file.
:::
