# FAQ

For LoreRim 5.0.4.8.

## Saving, death and respawn

### How should I save and load?

Quit to desktop before loading a different save. Loading while the game is running can leave scripts stuck and carry problems into later saves. Don't save during scripted scenes, right after entering a new area, or several times in a row. You can't save in combat. F5 quicksaves are full saves; avoid F9.

### What happens when I die?

You lose 10% of your progress toward the next level and 10% of your gold. The gold goes to whoever killed you, so kill them and take it back; creatures take none. You keep all your items.

You wake at the last bed you slept in or campfire you rested at, if you carry Provisions. One is used up each time; general goods merchants sell them. Without Provisions you wake in the hold's Hall of the Dead (in Whiterun, the Temple of Kynareth).

### Why does it say "You will surely perish"?

Some places don't allow respawn, for example Halldir's Cairn, Dimhollow Crypt, Skuldafn, the Thalmor Embassy and the East Empire Warehouse. Dying there is final, so load a save. Dying as a werewolf or vampire lord sends you to the main menu.

### My respawn ignored my camp

Sleep or rest at the camp to make it your respawn point, and carry Provisions. If you die very close to your respawn point, you wake in Whiterun instead.

### Where are my saves and screenshots?

Saves: `LoreRim\profiles\[your profile]\saves`. Each save is two files, `.ess` and `.skse`; copy both. Screenshots (Print Screen): `LoreRim\overwrite\Root`.

### Can I use my save in another profile?

Ultra and Extreme load the same plugins, so a save works in either: copy both files into the other profile's `saves` folder. Default replaces many world plugins, so its saves don't move to or from the other two.

## Starting out

### What do I choose at character creation?

In order: race and looks, a birthsign, 3 major skills (+10 each), up to 6 minor skills (+5 each), a deity, up to 2 traits, then Naaktiid or Konahrik. Then pick a start at the dragon statue, or walk out the main door.

### Can I change those later?

- **Birthsign:** no. Standing stones in the world are separate and can be swapped.
- **Perks:** Galathil, the face sculptor in the Ragged Flagon in Riften, resets them. 100,000 gold, once per character. Free and repeatable in Naaktiid.
- **Traits:** remove one in Magic > Active Effects: select it and press Ready Weapon. It costs 1 dragon soul and the slot isn't refilled.
- **A third trait:** the main quest gives you an Elixir of Hidden Potential. Tsun hands it to you in Sovngarde. Drinking it lets you pick one more trait.

### Naaktiid or Konahrik?

Konahrik is classic LoreRim. Naaktiid turns on Requiem Lite: +3 perk points, +25 health, magicka and stamina, +100 carry weight, faster regeneration, +25% magic resistance, no disarms, and most of Requiem's stamina penalties removed. Below level 5 you take half damage; the bonus shrinks by 5% every 5 levels and is gone at 50. Perk resets are free. You can switch Requiem Lite on or off later in its MCM. Leave the game's difficulty slider on Adept.

### It's too hard. Where should I go first?

Enemies don't scale to your level, so where you go matters. Whiterun and Falkreath holds are the gentlest. The Reach is the hardest region, and Bleak Falls Barrow is tough early. For XP: city job boards (missives), small quests in towns, guild starter quests and small bandit camps. Eat food for its buffs. MO2's "Optional - Difficulty" section has easier settings; most need a new game.

### How do I start the main quest?

Go to Helgen. Rent the best room at the inn and sleep to play the opening, or talk to the dragon behind the inn to skip it. Finish any waiting level-up first; a pending level-up breaks the start. Dragons appear only once the main quest is under way.

## Leveling

### My XP bar is full but I didn't level up

Sleep in a bed. Survival Mode levels you up only when you sleep. You confirm the level by choosing Health, Magicka or Stamina, then spend your skill points. To change this: MCM > Survival Control Panel > Sleep to level up.

### Do skills go up when I use them?

No. Each level gives 30 skill points to spend by hand. A skill can rise at most 5 per level. Each point costs 1 below 25, 2 from 25, 3 from 50 and 6 from 75. Unspent points carry over. A skill can't go above 50 + your level. Trainers give 5 sessions per level, and unused sessions carry over.

### Where are my perk points?

In the skills menu. You get 1 per level, 3 at creation and 3 more in Naaktiid. There's also a separate Destiny tree with 7 points, at levels 2, 5, 10, 15, 20, 25 and 30.

### Why did that quest give no XP?

| Source | XP |
| --- | --- |
| Main, Daedric and DLC quests | 200 |
| Civil War quests | 150 |
| Side quests, guild quests, every missive | 100 |
| Clearing a dungeon | 100 to 200 |
| Discovering a place | 10 |
| Kills | By enemy level |
| Potions, enchanting, mining, speech checks, pickpocketing, lockpicking | Small amounts |
| Jarl bounties, thane favors, miscellaneous quests, quest objectives, reading books | None |

### Can I change XP gain or the death penalty?

XP comes from Experience and skill points from Static Skill Leveling; don't disable either. The XP and gold you lose on death can be changed in the Soulslike Respawn MCM, which is on the official safe-to-change list.

## Getting around

### Why can't I fast travel?

It's off by default; carriages, ferries and your horse are the way to travel. Turning it on takes two changes:

1. MCM > Requiem > Atmosphere > Allow fast travel.
2. In `LoreRim\mods\LoreRim - MCM and INI Settings\SKSE\Plugins\SurvivalModeImproved.ini`, set `bDisableFastTravel=0`.

The Requiem setting alone isn't enough. Hunger, thirst, disease and some quests can still block fast travel.

### I learned Apparition. Why still no fast travel?

Apparition makes fast travel instant once it's turned on. It doesn't turn it on.

### Carriages and horses

Carriages cost 10 to 400 gold by distance. Golden Hills has no working carriage: wait in the Rorikstead inn, ask the innkeeper about a carriage and sit until the driver comes in. Horses cost 1,500 gold at stables and carry 300. H: tap to whistle (wait or follow), hold to bring your horse to you, tap while looking at it for the saddlebag. Don't save while mounted.

### The stablemaster says "You don't have a horse"

For horse armor, the stablemaster only counts a horse you bought at a stable or the horse you last rode. A tamed horse or the Palomino only counts as the one you last rode, so ride it to the stable, get off next to it, then ask.

## Survival

### Why can't I sleep or wait?

Check, in this order:

- Thirsty? Look for the "dry mouth" message and drink.
- Hungry?
- Diseased? That includes turning into a vampire.
- Enemies nearby?
- Is the bed owned (a yellow "Bed" prompt)?
- Poisoned?

Try another bed or an inn. During the Sanguine vampire quest you can't sleep, wait or fast travel for 3 days.

### Do vampires get thirsty?

Yes, but the thirst warnings never appear. Drink as normal.

### Thirst, water and food

Thirst rises about 5 points per game hour. Water, ale, mead, wine and any soup or stew restore 100. Brandy, flin, sujamma and other spirits restore nothing. Water also gives Hydrated: food buffs +20% for 15 minutes.

A waterskin takes 1 Leather and 1 Leather Strips at a tanning rack. Fill it by using it while standing in water, or ask an innkeeper. Thirst can be turned off with "[Optional] Disable Thirst" in MO2.

### Shrines don't cure my disease

Correct, shrines don't cure disease in LoreRim. A Potion of Cure Disease works 1 to 3 game days later. A Potion of Cure Greater Disease or the Restoration spell Cure Disease on Self works at once.

### Can I have more than one camp?

No. Pitching a new camp breaks the old one, and anything stored in it is lost. Break camp first to get your supplies and stored items back.

### How does camping work?

Camping supplies come in three levels: Simple, Sturdy (adds a cooking pot, tanning rack and small smelter) and Quality (adds alchemy and enchanting tables). Use them from your inventory. You can't camp in cities, indoors, in combat, while swimming or while mounted. Sleep or rest at your camp to make it your respawn point.

### The screen is blurry and glowing

Most often it's Dead Drunk, which one wine or brandy can cause. Check Magic > Active Effects.

## Combat and controls

### How do I dodge?

Take the Dodge perk in the Evasion tree first, then press Left Alt. Each dodge costs 10% of your stamina. To change the key, edit TK Dodge's settings in `LoreRim - MCM and INI Settings`; that copy wins over the mod's own.

### What do F1 to F4 do?

| Key | Stance | Effect |
| --- | --- | --- |
| F1 | High | +20% armor penetration; you take 20% more physical damage |
| F2 | Mid | +10% critical chance and critical damage; you deal 10% less physical damage |
| F3 | Low | +30% poise damage and +30% damage to staggered enemies; enemies do 30% more poise damage to you |
| F4 | Neutral | None |

### Keys that aren't in vanilla Skyrim

| Key | Does |
| --- | --- |
| G | Wheeler (quick wheel) |
| Shift+E | Other actions on a target: take, trade, saddlebag, harvest |
| H | Horse |
| U | Character stats |
| Y | Helmet on or off |
| X | Hide the HUD |
| C | Hide the widgets |
| K | Bestiary |
| V | Dual block |
| Mouse 3 | Power attack |
| Side mouse button | Target lock |
| Left Alt | Dodge |
| F6 | SKSE menu: field of view, widgets, followers, Magic Organizer |
| F7 | Typing mode |
| F11 | Key list |
| F12 | Transmog |
| Shift+F12 | ENB on or off |
| Page Down | dMenu (mod settings) |
| Backspace | Equipment display (IED) |

### How do I change the field of view?

F6 > FOV. You can set the hands and first-person view, and optionally third person. The old console and ini methods don't stick.

### How do I use Wheeler?

G opens it. To edit, open it from the inventory or magic menu: point at an item, press G and click a slot. M adds a slot, N adds a wheel, E moves to the next wheel, right-click clears a slot. Don't put potions on it; using the last one can crash the game. If Wheeler crashes, reset it in dMenu > Mod Config > Wheeler.

### My spells or powers disappeared

You hid them with H in the magic menu. Show them again in F6 > Magic Organizer.

### I can't turn while attacking

That's attack commitment: once a swing starts you're locked in. Tap block to cancel. "Remove Attack Commitment" is an optional mod in MO2.

### Controller setup

Turn on Complete Controller Setup and Gamepad++ in MO2's optional section; both are off by default. Use Steam's recommended Skyrim layout. Use mouse and keyboard for character creation and the skill screen until you leave the starting room.

## Magic and crafting

### How do I learn spells?

Spell tomes take time and magicka to learn. Court wizards sell the Novice and Apprentice tomes. Study time can be lowered in the Immersive Spell Learning MCM, which is on the official safe-to-change list.

### I can't unlock a Smithing perk

Smithing material perks come from books, not perk points. You need the base skill level (gear that raises Smithing doesn't count) and the perk before it, then read the book. Reading too early does nothing and the book isn't used up. Only Smithing Specialization (60) and Iron Lore (80) cost perk points.

| Book | Perk | Smithing | Where |
| --- | --- | --- | --- |
| The Armorer's Encyclopedia | Craftsmanship | 10 | Every blacksmith |
| Complete History of the Radiant Raiment | Tailoring & Polishing | 10 | Radiant Raiment, Solitude |
| The Art of Dwarven Blacksmithing | Dwarven | 30 | Calcelmo, Urag |
| An Introduction to Scale Armors | Advanced Light Armors | 30 | Warmaiden's, Markarth smiths, Urag |
| Art of the Advanced Nordic Blacksmiths | Advanced Blacksmithing | 30 | Eorlund, Baldor |
| The Almanac of Orcish Blacksmithing | Orcish | 50 | Orc stronghold smiths, Markarth smiths, Urag |
| About Elven Craftsmanship | Elven | 50 | Calcelmo, Urag |
| Arcane Craftsmanship | Arcane | 60 | Calcelmo, Urag, Katria (Stoking the Flames) |
| An Introduction to Malachite | Glass | 70 | Narzulbur smith |
| Harder than Steel | Ebony | 70 | Narzulbur smith |
| The Compendium of Draconic Armor | Draconic | 90 | Sky Haven Temple, Skuldafn |
| Daedric Craftsmanship | Daedric | 90 | Shrine of Mehrunes Dagon |
| Saint Jiub's Opus | Legendary | 90 | Impatience of a Saint (Soul Cairn) |

### The game froze after my last potion

It isn't frozen. Press Space. Making potions needs empty bottles: find them, buy them, or keep the ones you drink.

## Missives and quests

### How do missives work?

Missives are jobs from the city job boards. Every one counts as a side quest and pays 100 XP. Skip gathering missives, which can break. "Track a fugitive" jobs have no marker; if the missive names two places, the target is on the road between them. To cancel one, use it from your inventory.

### A quest is stuck

Save first and keep that save. Known fixes:

- **Word wall does nothing:** leave the area and come back.
- **Alduin won't die at the Throat of the World:** go into High Hrothgar and back out.
- **Valdar missing in Valthume:** console `prid 8CE78`, then `enable`.
- **Thoron won't die:** select him in the console, then `disable`, `markfordelete`, `setstage EC_SS_MQ102 89`.
- **Staff of Magnus won't equip:** press Shift over it to move it to quest storage, then take it back from the MCM.

### How do I worship Sotha Sil or Vivec if I'm not a Dunmer?

In Raven Rock's temple, read the journal downstairs to start "Ghost of the Tribunal". Go into the cave, don't kill the cultists, and do the matriarch's three tasks. She gives you the key; both shrines are in that cave.

## Followers and vampires

### How many followers can I have?

Follower slots grow with Speech: 1 below 25, then one more every 25 points, up to 5 at 100. Followers with their own voice (Inigo, Lucien, Auri and others) don't use a slot.

### How do I stop my followers dying?

Most named followers are protected: enemies can only knock them down, but your own hits can kill them. Essential and friendly-fire settings are in F6 > Simple Follower Framework (both off by default). Press E on a downed follower to give them your best healing potion.

### Playing as a vampire

Vampirism is Sacrilege. Vampires don't get hungry or cold, but they still tire and still get thirsty, without the warnings. Health doesn't regenerate normally: use blood potions, healing for undead, or spells that drain health. The optional mod "Vampire sun immunity with helmet or hat" removes the sunlight penalty while you wear a hood or helmet. The cure is a Potion of Purging.
