# LoreRim Build Planner — backlog

What is queued, in the order it was raised. Rules for the look live in [design-rules.md](design-rules.md).

## UX feedback from Dave, 10 Oct 2026

1. **Cards select on click.** Race, birthsign, traits, game mode and every other card list: clicking anywhere on the card chooses it. Keep the Choose button. Cards need a hover state.
2. **Buttons feel bland and basic, "not fun".** Every button across the app. Needs a design pass that stays inside the visual system (square corners, no glows) but gives them some character.
3. **Skills step (step 3): how many majors and minors are chosen isn't obvious** at any moment. Make the counts unmissable while picking.

## Follow up

- **Guide: 16 mods without Nexus links (14 Oct 2026).** Animated Whistling, Complete Controller Setup, Dynamic Activation Key, Engine Fixes, Faster Mining Plus SE, Gamepad++, Lock Bashing, Locked Chests Have Keys, MaxsuBlockOverhaul, Requiem - Lockpicking SKSE, Requiem - Modern Combat Rework, Rest By Campfire - Base Object Swapper, Sanctified Stolen Goods, Simple Outfit System, Take a Nap - Sleep on Chairs, Vampire sun immunity with helmet or hat. Next time Dave's PC is linked, read each mod's `modid` from its `meta.ini` (or `modlist.csv`) and add `nexus:` lines to the chapters' Related Mods. Web searches returned the wrong mods, so don't guess. Now part of WO-91's run on Dave's PC (16 Oct 2026).

## Decisions pending

- **A planner MCP, in progress (Dave, 19 Oct 2026).** A side door for AI assistants: a player's own assistant looks up facts, drafts builds and writes a full playthrough through the planner, under rules the server keeps; the player publishes. Dave's framing: a narrative-driven playthrough that takes a build from race, deity and perks to a full walkthrough of what to do with the character in every aspect (acts, objectives, quests, story). The spec is the "LoreRim Planner MCP — Spec" doc in Dave's artifacts, rewritten in plain terms on 19 Oct. Rule added that day: only quest facts that have passed the start check are offered to assistants; the rest go out marked not checked. Built on staging behind `FEATURE_MCP` (off on production): WO-108 the door and the facts tools, WO-109 sign-in (the planner is its own OAuth server; Dave's Claude is connected), WO-110 build drafts with plain inputs (`create_build`, `add_level` and the rest; a draft is private, marked "Drafted with Claude", and the player publishes). Written, not built: WO-109b (a fresh path under `/api/mcp` and a 401 step-up, for a connector added without sign-in). Queued: WO-111 playthroughs, WO-112 the local helper, WO-113 merchants.
- **Next for the Quests pages (19 Oct).** The Main stories category page lists seven quest lines with A Forgotten Blade first and Become the Dragonborn fourth. Stories should lead each category, with the one-off lines in a list below. WO-107, to write. The start-check tool gaps from `gamedata/5.0.4.8/story_checks/crawl-2026-10-19.md` go in the same order.

- **Gear page, on hold until after the guides launch (Dave, 16 Oct 2026).** WO-91 (recipe and plugin data) and WO-92 (the Gear page and item pages) are built and on staging behind `FEATURE_GEAR`, which is off everywhere. The weapon type icons are in (they also show on @-mentions of weapons). WO-93 (links across the app) and WO-94/95 (item renders; the LoreRim team agreed, with credits) are written and on hold. The render test is on branch `spike-renders`; keep it until WO-94 moves the scripts over.

- **Quest lines (17 Oct 2026).** WO-97's crawl is curated into 152 lines in six categories (Main stories, Guilds and factions, Daedric Princes, New lands, Side stories, Followers) plus a shelf of repeatable work; a line can sit in more than one category in the hand-kept `gamedata/5.0.4.8/questlines.json`; `scripts/gamedata/questlines.py` checks every raw line and every base-game side and misc quest lands somewhere, and writes `questlines_report.md`. Each line opens with the game's own journal text. The field guide's facts (start, gate, level, length) are on about 70 lines; 88 have none checked yet. Not yet in `src/data`: that comes with the quest pages, after launch. Dave's ask for the quest home: not a table but a way to find what to do next, a choose-your-own-adventure feel. Agreed 17 Oct: six categories with a subtitle and a "learn more"; mod content is a tag on each card, not a category. Board on the canvas.
  - **What the quest pages are for (Dave, 17 Oct).** The player is someone like Dave: partway through a playthrough, wandering LoreRim, stumbling into quests, and at some point unsure what to do next or how to get a big story going. They don't want to be the Dragonborn every time. The pages exist to answer one question for that player: *what big story can I start from where I am, and how do I start it?* Every quest screen is judged by that:
    1. **Start with what's open to me.** My level and what I've finished decide what's shown first; locked lines say what opens them ("Opens at level 25", "After the Thieves Guild").
    2. **How to start it comes first on a line's page:** who gives it, where they are, or what to walk into. Then what it asks of me (length, difficulty) and what it pays (quest XP, rewards).
    3. **No spoilers by default.** The opening journal entry is the hook; anything past it is behind a click.
    4. **Honest about gaps.** Where the files don't say (a giver, a reward), the page says it isn't listed, as the Gear page does.
    5. **The test:** from the Quests page, a player picks a story and knows where to walk to start it, in about a minute, without having the story spoiled.
    Who gives a quest and its rewards are what players want most; WO-98 finds out how much of that the records hold.
  - **Stories, not quest lists (Dave, 18 Oct).** Browsing the quest lines on staging didn't hook him, and too many facts were wrong. The Quests pages hold two kinds of thing:
    - **Stories:** the big multi-quest arcs, each shown as an adventure with a goal ("Become the Dragonborn", "Join the Companions"), its chapters, and the player's next step. Written by hand, one at a time. First board: canvas row 22, `QuestStory.dc.html`.
    - **Everything else:** one-off quests stay a list, sorted by where they start (hold, then town), filtered by category and level. No story page.

    How a story is made, the same steps every time:
    1. **Pick it.** Four or more quests with a payoff at the end (a title, a home, an artifact, the end of a war). Draft list of about 20: the main quest, Companions, College, Thieves Guild, Dark Brotherhood, Civil War, Dawnguard, Dragonborn, Vigilant, Wyrmstooth, Undeath, and the mod lines in `questlines.json` with four or more story quests. Dave approves the list.
    2. **Name it as the goal.** What you become or do by the end, verb first, in the game's words, five words or fewer.
    3. **Write the pitch.** Two plain sentences: the situation, and what you're trying to do. Nothing past the first chapter.
    4. **Cut it into chapters.** Three to seven, each a few quests ending at a natural stop, named as plain goals. Chapters past the player's own are hidden until asked for.
    5. **Write each quest's start.** Who, where, and what to do to get it. Every start goes through the start check below; one that hasn't passed says it isn't checked yet.
    6. **Gates and what it opens.** The level and the stories it needs, and the stories it opens. Through the start check too.
    7. **Payoff.** One line: what you get at the end. From the files, or "not listed yet".
    8. **Dave reads it.** Does it hook, and does it pass the one-minute test. What he fixes goes back into these steps.

    **The start check** (what Gravewind and the 18 Oct finds taught): for each start, read the quest's conditions and start-game flag; the story manager node that starts it (level, quests done) and the last plugin to change it; delayed-start mods (the Delayed Quest Starts set, VIGILANT - Delayed Start) with their rumour lines and triggers; the doors and keys into where it starts; and settings loaders that reset values on every load (Timing is Everything's MCM `settings.ini` beats `LoreRim - Global Modifiers.esp` in game). Where the files disagree or a script decides, the page says so.

    **Order and who.** Become the Dragonborn first, for Dave to read. Then Companions, College, Thieves Guild, Dark Brotherhood, Dawnguard, then the rest. Bob writes stories in a hand-kept `gamedata/5.0.4.8/stories.json`; Jeff on PC runs the start check for each story's quests (in place of WO-102's sweep of all 152 lines, which is paused); Jeff on Mac builds the story page and the sorted list.

    **Found on 18 Oct, to use when the stories are written** (all from the files on the PC):
    - Corrected by WO-104: Timing is Everything's settings loader doesn't apply. LoreRim's own `tie_mcmscript.pex` (in `[LoreRim] - SPID Files and Script Overwrites`) wins and never reads its `settings.ini`, so the levels in `LoreRim - Global Modifiers.esp` stand (Dawnguard 30 and the rest). Bob's first reading came from the loader's source file without checking which compiled script wins. The start check now does that check for every loader.
    - The Forsworn Conspiracy: level 20, then ask the Markarth carriage driver about the Forsworn, then walk in by day (8 to 20). The House of Horrors: level 20, ask Kleppr or Frabbi at the Silver-Blood Inn "Anything noteworthy happening?". The Taste of Death: level 20, Kleppr or Frabbi's rumour about the Hall of the Dead. The Mind of Madness: level 20, Corpulus or Sorex Vinius's rumour at the Winking Skeever; then Dervenin comes to you.
    - Vigilant: Altano and Orlando come to the Windpeak Inn only at level 25 with The House of Horrors and Kindred Judgment done.
    - Hendraheim: needs The Silver Hand (Companions) done; LoreRim - Dialogue Patch.esp puts that back.
  - To check on the PC: Demon of Dream and Finding Velehk Sain are installed but the crawl kept no quest for them; Unmasking Sybille isn't in the plugin list under that name.

- **Domain:** lorerimplanner.com is free at $11.25/yr (checked 10 Oct 2026). Buy on Dave's say-so, then add `https://lorerimplanner.com/api/auth/callback/discord` to the Discord app's redirects (Discord developer portal, app "LoreRim Build Planner").

- **The tour's sample build (15 Oct 2026).** Iriel for now. Dave is asking Zenematics whether he'd post the first official guide; if he does, his build becomes the sample (change `SAMPLE_BUILD_ID`, no code change). On production the sample has to be a production build.

## Decided against

- **Card first, character sheet folded (13 Oct 2026).** A proposal to lead the build page with key levels and the level card, fold everything else into a closed "Character sheet", and start each editor level small behind an "Add" row (canvas artboards `CardFirst.dc.html`, `LevelStartsSmall.dc.html`). Dave: keep the page as it is.
- **Magicka check on spells (13 Oct 2026).** A warning on the level card when a spell costs more Magicka than the build has at that level. Dave: whether a spell is castable yet is for the author to cover in the guide.

- **A separate snapshot build, and Auto level (WO-64 to WO-68, 14 Oct 2026).** Filling in the levels for the author read as nobody's playthrough, and a one-level build with its own editor and page didn't read as a guide. Replaced by Skip ahead (WO-69): one kind of build, written at the levels the author picks.

## Done

- Pixel icons for the 18 skills and Destiny, approved 10 Oct 2026 (second pass: shared outline, top-left light). Rolled out everywhere by WO-4.

- Discord sign-in live on production and staging (10 Oct 2026). `identify` scope only. Discord now sends `iss` with the code, so the provider sets `issuer: "https://discord.com"`.
- Game data read from the 5.0.4.8 records: perk words, ranks, exclusions, books, trait art (10 Oct 2026).

## Still to check in game

- Stunning Precision and Lion's Arrow check the original Requiem Penetrating Shot record, while the Marksman tree offers Big Tweaks' player version. Is Stunning Precision selectable with Penetrating Shot + Power Shot at Marksman 75? The planner treats the two records as one perk (`gamedata/5.0.4.8/overrides.json`, `aliases`).
- Painful Regrets is gated on three player stats (≥5000 / ≥25 / >3) the extractor can't name. The in-game tooltip may say.
