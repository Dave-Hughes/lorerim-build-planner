# LoreRim Build Planner — backlog

What is queued, in the order it was raised. Rules for the look live in [design-rules.md](design-rules.md).

## UX feedback from Dave, 10 Oct 2026

1. **Cards select on click.** Race, birthsign, traits, game mode and every other card list: clicking anywhere on the card chooses it. Keep the Choose button. Cards need a hover state.
2. **Buttons feel bland and basic, "not fun".** Every button across the app. Needs a design pass that stays inside the visual system (square corners, no glows) but gives them some character.
3. **Skills step (step 3): how many majors and minors are chosen isn't obvious** at any moment. Make the counts unmissable while picking.

## Follow up

- **Guide: 16 mods without Nexus links (14 Oct 2026).** Animated Whistling, Complete Controller Setup, Dynamic Activation Key, Engine Fixes, Faster Mining Plus SE, Gamepad++, Lock Bashing, Locked Chests Have Keys, MaxsuBlockOverhaul, Requiem - Lockpicking SKSE, Requiem - Modern Combat Rework, Rest By Campfire - Base Object Swapper, Sanctified Stolen Goods, Simple Outfit System, Take a Nap - Sleep on Chairs, Vampire sun immunity with helmet or hat. Next time Dave's PC is linked, read each mod's `modid` from its `meta.ini` (or `modlist.csv`) and add `nexus:` lines to the chapters' Related Mods. Web searches returned the wrong mods, so don't guess. Now part of WO-91's run on Dave's PC (16 Oct 2026).

## Decisions pending

- **Gear page, on hold until after the guides launch (Dave, 16 Oct 2026).** WO-91 (recipe and plugin data) and WO-92 (the Gear page and item pages) are built and on staging behind `FEATURE_GEAR`, which is off everywhere. The weapon type icons are in (they also show on @-mentions of weapons). WO-93 (links across the app) and WO-94/95 (item renders; the LoreRim team agreed, with credits) are written and on hold. The render test is on branch `spike-renders`; keep it until WO-94 moves the scripts over.

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
