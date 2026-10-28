# Every page template, and how good it is

Bob walked staging page by page on 27 Oct 2026 (17:40), at 1440 and 390, signed out, then signed in through Dave's Chrome (18:05). Dave: "Some of the pages are fine, some are trash, all could be better." The goal is polished and fun; Wowhead is the reference for how a game database breaks up a long page (a summary up top, a contents rail, tables you can sort, colour by kind of thing).

Verdicts: **good** (polish only), **needs work** (works, but plain or inconsistent), **trash** (wrong for what's on it). Each row names the order that fixes it.

| # | Template | Address | Verdict | What's wrong | Order |
|---|---|---|---|---|---|
| 1 | Home | `/` | good | New in the world: every row has the same book icon and the same words ("The whole line, read from the game files"). Signed-in version not checked (no login here). | WO-161 |
| 2 | Characters | `/characters` | needs work | The grid cards are the old style; the home page's new cards (race icon, badges, level, hover) should be the one card everywhere. | WO-161 |
| 3 | A character's build | `/b/<id>` | good | The core page and it holds up. The hero picture is very dark under its fade. The tour pops up on the first visit to any build. | later |
| 4 | A character's playthrough | `/p/<id>` | needs work | Still the old boxed title, no cover picture: it doesn't look like the same character as `/b/<id>`. Breaks the "a character has their cover full width" title rule. | WO-164 |
| 5 | A player's page | `/u/<handle>` | needs work | Says "Builds by Tapps", tabs "Builds" and "Liked": the site calls them characters now. Old cards. | WO-161 |
| 6 | My characters | `/me` | needs work | Signed out it's titled "My builds". Signed in not checked. | WO-161 |
| 7 | New playthrough | `/playthroughs/new` | needs work | Signed out: a title and a sign-in button, nothing saying what a playthrough is. | WO-161 |
| 8 | Guide | `/guide` | trash | **404**, but Guide is in the top menu. | WO-161 |
| 9 | Search results | `/search` | needs work | Plain list; "Its name." as the reason a person matched; no icons or kind tags. | WO-161 |
| 10 | Everything that changed | `/changes` | needs work | One page 31,000 px tall. Needs days folded and a filter by kind. | WO-161 |
| 11 | Quests home | `/quests` | needs work | The five category cards with their scenes are good. "Everything else, by place" is a framed wall of 150 links. | WO-163 |
| 12 | A quest category | `/quests/c/<slug>` | trash | Side stories is 73 framed cards, each with a journal quote and Tell me more: 10,000 px to scroll. Nothing to sort or compare. | WO-163 |
| 13 | A quest line | `/quests/<line>` and `/quests/s/<story>` | trash | Two pages for the same line, two layouts; the story page says the Companions pay 700 XP and its jobs pay none, the line page 2,100 (the data: every job pays 100). | WO-160 |
| 14 | A quest | `/quests/q/<slug>` | good | The browser tab reads "The Golden Claw \| The Golden Claw". Gets the colours with WO-160's palette. | WO-161, WO-165 |
| 15 | People | `/people` | good | The town filter needs a Show button press; should filter as you pick. | WO-161 |
| 16 | A person | `/people/<slug>` | needs work | Reads well now the people reads are in, but it's all one grey: no at-a-glance, no colour, no picture yet. "Not sure yet" lists seven things on a checked page. | WO-165 |
| 17 | Places | `/places` | good | | |
| 18 | A place | `/places/<slug>` | trash | One dungeon template for every place. Riverwood "Its boss is Camilla Valerius", a danger chart, 100 XP "for clearing it"; the Bee and Barb has Danger ("Nobody here is hostile") and "Comes back in 30 days, or 300 once cleared". No innkeeper, shops, trainers or homes. "What points here" is dozens of greetings. | WO-162 |
| 19 | Not found | any bad address | good | | |
| 20 | My characters | `/me` (signed in) | needs work | Old framed cards with a box inside each; blank hatched tiles for characters with no cover; "Start a run" where the rest says playthrough. | WO-164 |
| 21 | Home, signed in | `/` | needs work | Your characters shows five blank tiles of six (no covers). Otherwise right. | WO-164 |
| 22 | Edit a character | `/b/<id>/edit`, `/setup` | good | The Playthrough tab is there now; with no run it's one sentence and a button. | WO-164 |
| 23 | New character | `/new` | needs work | Works; no step for a playthrough at the end. Race cards are plain boxes (later: race art). | WO-164 |

## Across every page
- The browser tab says "LoreRim **Build** Planner"; the header says "LoreRim Planner". (WO-161)
- On a phone the New character button is an orange square with a plus and no word. (WO-161)
- On a phone the back button and the search box sit narrower than the content under them. (WO-161)
- Colour means nothing yet: one background, white text, orange links. WO-160 sets six colours with one meaning each; WO-165 carries them to the quest, person and place pages.
