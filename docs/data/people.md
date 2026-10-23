# What we know about a person: the spec

Every field the people index carries, written before it's built. Same four columns as `places.md`. A field not in this file isn't shipped. Scope: people a design touches (merchants, trainers, innkeepers, priests, followers, marriage candidates, jarls, stewards, housecarls, quest givers, and anyone a pointer or quest names), not every NPC in the load order.

| Field | A player asks | From the records | A right value | Impossible (fails the test) |
|---|---|---|---|---|
| **name** | "Who?" | `NPC_` FULL; the template's when the NPC has none | "Farengar Secret-Fire" | empty; an editor id; a generic name ("Bandit") for a unique person |
| **race, sex** | "An Orc? A woman?" | `NPC_` RNAM, ACBS flags | "Orsimer, female" | none |
| **where** | "Where do I find them?" | Their placed reference's cell and town; **where a player first meets them**, from their first daytime package or their alias in the quest that introduces them, when that differs from their placed cell | "Dragonsreach, Whiterun" (Lydia: first met in Dragonsreach; lives in Breezehome after) | a home they only move to later given as where to find them; a holding cell |
| **when** | "Is she there at night?" | Their AI packages' schedule (sandbox, sleep, work windows) | "in the Bee and Barb 8am to 10pm; sleeps upstairs" | — |
| **role** | "What are they to me?" | Factions and keywords: `JobMerchantFaction` and the vendor factions, `JobTrainer…`, `JobInnkeeperFaction`, `JobPriestFaction`, `PotentialFollowerFaction`, `PotentialMarriageFaction`, `JobJarlFaction`, `JobStewardFaction`, `JobHousecarlFaction`; quest giver from `quests.json` | "court wizard; sells spell tomes"; "innkeeper"; "follower; can marry" | a merchant with no vendor list; a follower who can't be recruited |
| **sells** | "Where's Calm sold?" | The vendor faction's buy/sell lists and its vendor container's leveled lists, resolved to items; spell tomes by name and school; when the stock depends on the player's level, from what level | "spell tomes: Destruction and Conjuration, Novice and Apprentice from the start, Adept from level 15" | "sells everything"; a tome that isn't on any list he uses |
| **trains** | "Who trains Sneak?" | The trainer faction: skill and maximum level, cost per level from the game settings | "Sneak to 50" | a trainer with no skill |
| **joins** | "How does she join me?" | The dialogue that sets `CurrentFollowerFaction` or the follower quest's stage, with its conditions in the game's words (a brawl, a quest, gold, a level, a race) | "after you win a brawl with her"; "1,000 gold to hire"; "after The Cursed Tribe" | "joins" with no way to |
| **fights with** | "Is he a tank? An archer?" | `NPC_` class and its skill weights, their best skills, equipped weapon kind | "two-handed and heavy armour" | — |
| **marries** | "Can I marry him?" | `PotentialMarriageFaction` and its conditions | "yes, once you've helped him (Bonds of Matrimony)" | — |
| **quests** | "What does she give?" | Quest givers in `quests.json`, linked to each quest's page | "Running Wild (with Joslin)" | — |
| **dies / essential** | "Can I lose him?" | `NPC_` essential and protected flags; LoreRim's follower settings | "protected" | — |

**Before it's done:** the sanity tests for every row, and the ten spot checks: Farengar, Belethor, Arcadia, Lydia, Borgakh the Steel Heart, Keerava, Delvin Mallory, Aela the Huntress, Maramal, Jenassa. Each is written in the log against UESP and the records. One person is read through the door as a player's Claude would say it, pasted in the log.
