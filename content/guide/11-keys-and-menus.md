---
chapter: 11
title: Your keys and menus
subtitle: The keys LoreRim adds to Skyrim, and the menus you will use most.
icon: chapter-keys
---

LoreRim adds many keys to Skyrim's own. Press [[F11]] in game for LoreRim's key list.

## Keys {#keys}

| Key | Does |
| --- | --- |
| [[Mouse 3]] | {{Power attack}} (see [Stamina](/guide/fighting#stamina)) |
| [[Left Alt]] | Dodge, once you have the Dodge {{perk}} (see [Dodging](/guide/fighting#dodge)) |
| [[V]] | Block with a weapon in each hand or unarmed |
| [[F1]] [[F2]] [[F3]] [[F4]] | Stances: High, Mid, Low, Neutral (see [Stances](/guide/fighting#stances)) |
| Side mouse button | Lock on to a target |
| [[G]] | {{Wheeler}}, the quick wheel |
| [[Shift]] + [[E]] | Other actions on what you look at: take instead of use, trade with a {{follower}}, open a horse's {{saddlebags}}, harvest every plant nearby |
| [[H]] | Horse (see [Horses](/guide/getting-around#horses)) |
| [[U]] | Character stats |
| [[K]] | Bestiary |
| [[Y]] | Helmet on or off |
| [[X]] | Hide the whole {{HUD}} |
| [[C]] | Hide the {{widgets}} (level, weight, resistances, clock) |
| [[F6]] | SKSE menu |
| [[F7]] | Typing mode: stops hotkeys while you type |
| [[F11]] | LoreRim's key list |
| [[F12]] | Transmog (Skyrim Vanity System): show one outfit while wearing another |
| [[Shift]] + [[F12]] | {{ENB}} on or off |
| [[Shift]] + [[Enter]] | ENB settings |
| [[Page Down]] | {{dMenu}} |
| [[Backspace]] | Equipment display menu ({{IED}}) |
| [[Print Screen]] | Screenshot |

:::more
- In a loot window: [[E]] takes, [[R]] takes everything, [[Q]] opens the full container.
- [[1]] to [[8]] equip favorites groups.
- [[F5]] {{quicksaves}} (a full save). [[F9]] quick-loads; avoid it (see [Saving safely](/guide/death-and-saving#saving)).
- [[End]] opens the widgets' own settings page.
- In the magic menu, [[H]] hides a spell or power.
:::

:::mods
- **TK Dodge RE**: Dodge key.
  - nexus: 56956
  - where: `SKSE/Plugins/tk-dodge.toml` in LoreRim - MCM and INI Settings
- **One Click Power Attack NG**: Power attack key.
  - nexus: 60878
  - where: `MCM/Settings/OCPA.ini`
- **Stances - Dynamic Animation Sets**: Stance keys.
  - nexus: 40484
- **Dynamic Activation Key**: Shift+E actions.
- **True Directional Movement**: Target lock key.
  - nexus: 51614
  - where: MCM > True Directional Movement
- **Hotkey Reminder**: The F11 key list.
  - nexus: 115853
:::

## The SKSE menu {#f6}

[[F6]] opens the {{SKSE menu}}, with settings pages for several mods that have no {{MCM}}:

- **FOV:** hands, first-person and third-person field of view. Set your field of view here; the {{console}} and the old {{ini}} method don't stick.
- **STB Widgets:** where the level, weight, resistance and clock widgets sit, and whether each one shows.
- **Simple Follower Framework:** follower slots, {{essential}} followers and {{friendly fire}}.
- **Magic Organizer:** spells and powers you hid in the magic menu.

:::mods
- **SKSE Menu Framework**: The F6 menu.
  - nexus: 120352
- **First Person FOV SKSE**: The FOV page.
  - nexus: 172417
:::

## Mod settings: MCM and dMenu {#mcm}

Most mods keep their settings in the Mod Configuration Menu (MCM), in the pause menu. [[Page Down]] opens dMenu, which holds settings for some other mods.

Many MCM changes are outside LoreRim's support rules. Check [What you can change](/guide/what-lorerim-changes#changing) before you change one.

| MCM | What it controls |
| --- | --- |
| {{Requiem}} | {{Fast travel}} (Atmosphere), and Requiem's game rules |
| {{Requiem Lite}} | {{Naaktiid}} mode on or off |
| Survival Control Panel | Sleeping to level up, survival icons, warmth of each item |
| Respawn - Death Overhaul | The {{XP}} and gold you lose when you die |
| {{TrueHUD}} | {{Health}}, {{Magicka}} and Stamina bars and enemy bars |
| SkyUI | Icon sizes and favorites hotkeys |
| Simplest Horses | The horse key |
| Helmet Toggle 2 | The helmet key |
| Static Skill Leveling | Skill points per level |

## Wheeler {#wheeler}

Wheeler is a radial menu for quickly equipping weapons, spells, shouts and powers. Press [[G]] to open it. Time slows while it is open. Move the mouse to pick a slot, left-click to use the item in your right hand and right-click for your left hand. [[E]] moves to the next wheel.

To fill it, open the inventory or magic menu, point at an item, press [[G]] and left-click a slot. While editing, [[M]] adds a slot and [[N]] adds a wheel. Right-click an empty slot to remove it.

Don't put potions on the wheel: using up the last one can crash the game.

:::mods
- **Wheeler - Quick Action Wheel Of Skyrim**: The wheel.
  - nexus: 97345
  - where: dMenu > Mod Config > Wheeler
:::

:::ask{q="Wheeler keeps crashing my game"}
Reset your wheels in dMenu ([[Page Down]]) > Mod Config > Wheeler, and keep potions off the wheel.
:::

## Equipment display {#ied}

The weapons and gear hanging on your character's belt and back come from Immersive Equipment Display (IED). Press [[Backspace]] to open its menu, where you can move or hide each item. Changes are stored in your save, so save first.

:::ask{q="How do I hide the helmet hanging on my hip?"}
In the IED menu: Gear Nodes > Actor > your character > Positions > Pelvis: Helmet 1 > Invisible.
:::

:::ask{q="How do I undo my IED changes?"}
In the IED menu: File > Default config > Import, with User ticked.
:::

## The HUD {#hud}

- **TrueHUD** draws your Health, Magicka and Stamina bars, the bars over enemies' heads, the {{poise}} bar and boss bars. An enemy's bar has a red outline when it is 5 or more levels above you and grey when 5 or more below.
- **SkyHUD** places the compass and messages.
- **STB Widgets** shows your level, XP, carry weight, resistances and the time.
- **{{moreHUD}}** shows an item's value and weight, and an enemy's level, when you look at them.
- **{{QuickLoot}}** opens a small loot window when you look at a container or body.

:::mods
- **TrueHUD**: Bars.
  - nexus: 62775
  - where: MCM > TrueHUD
- **STB Widgets 16x9**: The widgets.
  - nexus: 136148
  - where: F6 > STB Widgets
- **QuickLoot IE**: The loot window. LoreRim's own note says it can cause compass and HUD problems.
  - nexus: 120075
  - tag: Optional in MO2, on by default
- **Infinity UI + Compass Navigation Overhaul**: Compass markers with distances.
  - nexus: 142377
  - tag: Optional in MO2, on by default
:::

:::ask{q="My level and weight widgets disappeared"}
Press [[C]]; it hides and shows them. If that does nothing, open [[F6]] > STB Widgets and check that each widget is set to show. If they still don't come back, restart the game.
:::

## Controller {#controller}

LoreRim's controller support is off by default. Tick Complete Controller Setup and Gamepad++ in the optional section at the bottom of {{MO2}}, and use Steam's recommended Skyrim layout. Use mouse and keyboard for character creation and the skill menu until you have left the starting room.

:::mods
- **Complete Controller Setup**: Controller layout.
  - tag: Optional in MO2, off by default
- **Gamepad++**: Controller support.
  - tag: Optional in MO2, off by default
:::
