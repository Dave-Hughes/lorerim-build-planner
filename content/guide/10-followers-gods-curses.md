---
chapter: 10
title: Followers, gods and curses
subtitle: Companions, religion, and playing as a vampire or werewolf.
icon: chapter-followers
---

You can travel with {{followers}} and animal companions, follow one god at a time, and become a {{vampire}} or a {{werewolf}}.

## Followers {#followers}

To recruit a follower, talk to them and choose the line asking them to follow you. How many ordinary followers you can have depends on your {{Speech}}: 1 below Speech 25, then one more for every 25 points, up to 5 at Speech 100. Followers added by mods, with their own voice and quests, such as Inigo, Lucien and Auri, don't take a slot.

Most named followers are {{protected}}: enemies can only knock them down, but your own hits can kill them. Be careful with wide swings and {{power attacks}} near a kneeling follower. Press [[E]] on a hurt or downed follower to give them your best healing potion.

Vanilla followers have fixed levels, and some are far stronger than a new character. Each extra follower lowers the damage of all your followers.

Followers who fall behind catch up when you draw your weapon. Hold [[Shift]] and press [[E]] on a follower to trade with them directly.

:::more
| Follower | Level | Where |
| --- | --- | --- |
| Uthgerd the Unbroken | 36 | Bannered Mare, Whiterun (win her brawl) |
| Marcurio | 36 | Bee and Barb, Riften ({{hireling}}) |
| Jenassa | 35 | Drunken Huntsman, Whiterun (hireling) |
| Lydia | 24 | Your {{housecarl}} after Dragon Rising (the main quest's first dragon fight) |
| Faendal | 20 | Riverwood |
| Lucien Flavius | 10 | Dead Man's Drink, Falkreath |
| Inigo | Your level, 1 to 60 | Riften jail |
| Auri | Your level, at least 20 | Her pod west of Falkreath |
| Remiel | Your level, 5 to 60 | Silver-Blood Inn, Markarth |
| Katana | 50 | Winking Skeever, Solitude |
| Taliesin | Your level, 10 to 80 | A hidden Talos {{shrine}} near Lake Ilinalta |
| Gore | Your level, 1 to 60 | Near Peak's Shade Tower, east of Falkreath |

- Inigo, Auri, Taliesin, Remiel and Katana can't die. Lucien can only die by your hand. Gore can die to anything.
- Two followers each deal 80% of their damage, three 64%, four 51%.
- Followers carry 200, or 250 with {{Requiem}}'s follower bonus. The trade window shows their carry weight.
- Followers who wait go home after 3 {{game days}}.
- {{Wayfarer}} {{perks}} for a leader: Leader (25) gives allies +150 armor and +15% {{magic resistance}}; Captain (40), Commander (60) and Legion (100) follow. Lone Wolf, Solo, Maverick and One Man Legion give the same to you when you are alone.
- Speech's Leadership perk (75) makes followers stronger and lets them carry 50 more.
:::

:::mods
- **Simple Follower Framework**: Follower slots, and the essential and friendly-fire options (both off).
  - nexus: 174017
  - where: F6 > Simple Follower Framework
- **Dynamic Follower Scaling SKSE**: Lower damage per extra follower.
  - nexus: 166316
- **Automatic Follower Teleporter NG**: Followers catching up when you draw your weapon.
  - nexus: 173899
- **Press E to Heal Followers SKSE**: Healing a follower with E.
  - nexus: 101823
- **Simple Outfit System**: Changing a follower's clothes.
  - nexus: 48974
- **Swiftly Order Squad - Follower Commands UI**: A command wheel for all your followers.
  - nexus: 63259
:::

:::ask{q="How do I stop my followers dying?"}
Keep your own attacks off them, especially wide swings when they are down. You can make followers {{essential}}, or turn off {{friendly fire}}, in [[F6]] > Simple Follower Framework.
:::

:::ask{q="My follower won't wear the armor I gave them"}
Followers with their own outfit put it back on. Say "Let me manage your outfit", then "Pick outfit", and move armor from your inventory into the container that opens. Armor you gave them through trading doesn't show there; take it back first.
:::

## Animal companions {#animals}

You can tame animals with the Wayfarer perk Animal Taming (Wayfarer 10, after Hunter). Choose "Animal Taming: Feed" on an animal and give it food it likes. A hostile animal has to be below 25% health first. Tamed animals follow you, fight, and carry items. How many you can keep depends on your Wayfarer skill. Animal Riding (50) lets you ride large animals.

:::mods
- **Fury - Animal Taming of Skyrim**: Taming animals, with its perks moved to the Wayfarer tree.
  - nexus: 108212
:::

## Gods and prayer {#gods}

You follow one god at a time. Religion in LoreRim comes from the mod {{Wintersun}}. Join a god at one of their {{shrines}} (or from the starting menu, see [Your god](/guide/character#god)). Some gods only accept certain races. Most {{Daedric Princes}} also accept anyone who has finished their quest.

Following a god gives you:

- **{{Tenets}}**, the god's rules, shown in Magic > {{Active Effects}}.
- **A gift**, a bonus that is on while you worship them.
- **The Pray power.** Pray once a day: kneel out of combat, standing still, with weapons away.

Your standing with the god is called {{favor}}. It rises when you pray, when you worship at their shrine and when you do what their tenets ask. It drains slowly all the time. At 100% favor you become a {{Devotee}} and get a second, stronger gift. At 0% the god abandons you.

LoreRim makes favor slow: five to eight weeks of game time of daily prayer to reach Devotee. Praying more than once a day doesn't help, and you can only pray once every 12 game hours.

:::more
| | LoreRim |
| --- | --- |
| Favor when you join | 5 |
| A day's prayer | +2 |
| Worship at your god's shrine | +1 extra a day |
| Drain | −0.2 a day |
| Devotee | 100 |
| Maximum | 200, with smaller gains above 125 |

- Daily prayer alone reaches Devotee in about 53 days, or about 34 with daily shrine worship.
- Worshipping at your god's shrine counts as the day's prayer plus 1. If you used the Pray power in the last 12 hours, the shrine gives only its blessing.
- Some gods only accept prayer at certain times or places: {{Riddle'Thar}}, {{Nocturnal}} and {{Mannimarco}} at night, {{Azura}} at dawn or dusk, {{Kynareth}}, the Hist and the All-Maker outdoors, {{Dibella}} only naked. A prayer at the wrong time fails and gives no favor (it may still start the 12-hour wait).
- The {{Nine Divines}} take 1 favor for every 100 gold of {{bounty}} you get.
- Breaking a god's strongest rule, such as raising undead while following {{Arkay}}, makes them abandon you at once.
- Joining another god ends the old one. Return to a Divine later and you get back half your old favor; a Daedric Prince makes you start again.
- A shrine's blessing lasts 24 hours. In LoreRim it doesn't cure disease.
:::

:::mods
- **Wintersun - Faiths of Skyrim**: Religion, with LoreRim's slower favor.
  - nexus: 22506
  - tag: Favor rates are on the official safe-to-change list
- **[LoreRim] Wintersun Pray Cooldown**: The 12-hour wait between prayers.
  - tag: LoreRim's own mod
:::

:::ask{q="Why did my god abandon me?"}
Favor reached 0. It drains a little every day, Divines lose favor for every bounty you get, and some acts (such as a Divine follower raising undead) end your worship at once. You can join again at a shrine.
:::

:::ask{q="How do I worship Sotha Sil or Vivec if I'm not a Dunmer?"}
In Raven Rock's temple (on {{Solstheim}}), read the journal downstairs to start "Ghost of the Tribunal". Go into the cave, don't kill the cultists, and do the matriarch's three tasks. She gives you the key; both shrines are in that cave.
:::

## Vampires {#vampires}

LoreRim's vampires come from the mod {{Sacrilege}}. Vampires don't get hungry or cold, but they still tire and still get thirsty, with no {{thirst}} warnings. Their health doesn't regenerate the normal way: use blood potions, healing for undead, or spells that drain health. Sunlight weakens them.

The cure is a Potion of Purging.

:::mods
- **Sacrilege - Minimalistic Vampires of Skyrim**: Vampirism.
  - nexus: 42408
- **Vampire sun immunity with helmet or hat**: No sunlight penalty while you wear a hood or helmet.
  - tag: Optional in MO2, safe to switch any time
:::

:::ask{q="As a vampire I can't sleep"}
You are probably thirsty. The warning never shows for vampires. Drink water.
:::

## Werewolves {#werewolves}

LoreRim's werewolves come from the mod {{Growl}}. Werewolves tire half as fast as other characters. Guards who see you transform give you a 10,000 gold bounty, and every hold's guards attack a werewolf on sight. Dying while transformed sends you to the main menu, so don't fight to the death in beast form.

The cure is a Potion of Cure Beastblood. The Werewolf start puts you at Frostmoon Crag on Solstheim.

:::mods
- **Growl - Werebeasts of Skyrim**: Lycanthropy.
  - nexus: 31245
:::
